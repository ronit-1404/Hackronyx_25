import json
from datetime import datetime
import os

# Helper to load all entries from a list of dicts in a JSON file
def load_all_entries(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            return []
        if isinstance(data, list):
            # Sort by timestamp if available
            if data and 'timestamp' in data[0]:
                data = sorted(data, key=lambda x: x['timestamp'])
            return data
        elif isinstance(data, dict):
            return [data]
        return []

def get_trigger_action(outputs, user_preference):
    # Preference-based suffixes
    if user_preference == 'article':
        article_suffix = ' Also, suggest a summary or helpful article.'
        video_suffix = ''
    elif user_preference == 'video':
        article_suffix = ''
        video_suffix = ' Also, suggest a motivational or alternative video.'
    else:
        article_suffix = ''
        video_suffix = ''

    if outputs['video']:
        if outputs['video']['emotion'] == 'frustrated':
            return {'type': 'chatbot', 'message': f"The user is frustrated.{video_suffix} Provide a motivational quote or recommend a break."}
        if outputs['video']['emotion'] == 'bored':
            return {'type': 'mini-game', 'message': f"The user is bored. Recommend a quick game or share a fun fact.{article_suffix}{video_suffix}"}
        if outputs['video']['emotion'] == 'confused':
            return {'type': 'help', 'message': f"The user is confused.{article_suffix} Provide a summary or a helpful article."}
        if outputs['video']['attentive'] == False or outputs['video']['engagement_score'] < 0.3:
            return {'type': 'break', 'message': f"The user is inattentive. Recommend a short break, a game, or a fun fact.{article_suffix}{video_suffix}"}
    if outputs['audio']:
        if outputs['audio']['emotion'] == 'distracted':
            return {'type': 'break', 'message': f"The user sounds distracted. Recommend a break or share a fun fact.{article_suffix}{video_suffix}"}
    if outputs['screen']:
        if outputs['screen']['sentiment'] == 'negative':
            return {'type': 'motivation', 'message': f"The screen content is negative. Suggest a motivational video or a fun fact.{video_suffix}"}
        if outputs['screen']['idle_time'] > 90:
            return {'type': 'break', 'message': f"The user has been inactive for a while. Recommend a break or stretching exercise.{article_suffix}{video_suffix}"}
        if outputs['screen']['context'] not in ['studying', 'programming', 'video_lecture']:
            return {'type': 'focus', 'message': f"The user is off-task. Suggest a resource to help refocus.{article_suffix}{video_suffix}"}
    return {'type': 'none', 'message': 'No action needed at this time. No intervention required.'}

# Load all data
video_entries = load_all_entries('ml/data/video.json')
audio_entries = load_all_entries('ml/data/audio.json')
screen_entries = load_all_entries('ml/data/screen.json')

# Try to load user data from user.json, then user.txt, else fallback to empty dict
user = {}
user_file = None
if os.path.exists('ml/data/user.json'):
    user_file = 'ml/data/user.json'
elif os.path.exists('ml/data/user.txt'):
    user_file = 'ml/data/user.txt'

if user_file:
    with open(user_file, 'r', encoding='utf-8') as f:
        try:
            user = json.load(f)
        except json.JSONDecodeError:
            user = {}
else:
    user = {}

# Find minimum length to avoid index errors
min_len = min(len(video_entries), len(audio_entries), len(screen_entries))

triggers = []
user_preference = None
if 'preferred_content_types' in user:
    # Pick the most preferred type
    prefs = user['preferred_content_types']
    user_preference = max(prefs, key=prefs.get)
else:
    user_preference = 'article'  # fallback

for i in range(min_len):
    # Map audio fields
    audio = audio_entries[i]
    audio_emotion = audio.get('emotion', '').lower()
    if 'error' in audio_emotion or not audio_emotion or audio_emotion == 'unknown':
        audio_emotion = 'neutral'
    audio_out = {'emotion': audio_emotion}
    # Map video fields
    video = video_entries[i]
    video_out = {
        'emotion': video.get('emotion', 'unknown'),
        'attentive': video.get('attentive', False),
        'engagement_score': video.get('engagement_score', 0.0)
    }
    # Map screen fields
    screen = screen_entries[i]
    screen_out = {
        'context': screen.get('context', 'unknown'),
        'chrome_title': screen.get('chrome_title', ''),
        'chrome_url': screen.get('chrome_url', ''),
        'sentiment': screen.get('sentiment', 'neutral'),
        'idle_time': int(float(screen.get('idle_time', 0)) * 60) if float(screen.get('idle_time', 0)) < 10 else int(float(screen.get('idle_time', 0)))
    }
    outputs = {
        'video': video_out,
        'audio': audio_out,
        'screen': screen_out
    }
    trigger_action = get_trigger_action(outputs, user_preference)
    result = {
        'outputs': outputs,
        'user_id': user.get('user_id', 'unknown') if user else 'unknown',
        'timestamp': video.get('timestamp', datetime.now().isoformat())
    }
    if trigger_action is not None:
        result['trigger'] = trigger_action
    triggers.append(result)

with open('ml/data/triggers.json', 'w', encoding='utf-8') as f:
    json.dump(triggers, f, indent=2)
