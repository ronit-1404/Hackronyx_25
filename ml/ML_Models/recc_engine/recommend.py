import os
import json
import requests
from dotenv import load_dotenv
import re

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
# Use latest Gemini API endpoint and supported model name
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY

# File paths (point to ml/data, not ML_Models/data)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', '..'))
DATA_DIR = os.path.join(ML_DIR, 'data')
USER_JSON_PATH = os.path.join(DATA_DIR, 'user.txt')
SCREEN_JSON_PATH = os.path.join(DATA_DIR, 'screen.json')
CONTENT_JSON_PATH = os.path.join(DATA_DIR, 'content.json')
TRIGGERS_PATH = os.path.join(DATA_DIR, 'triggers.json')

# Read files
def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def parse_output_txt(text):
    # Extract last context, sentiment, and app
    blocks = [b for b in text.split('=========================================') if b.strip()]
    if not blocks:
        return None
    last_block = blocks[-1]
    context = None
    sentiment = None
    app = None
    for line in last_block.splitlines():
        if 'Detected Context:' in line:
            context = line.split(':', 1)[1].strip()
        if 'Sentiment:' in line:
            sentiment = line.split(':', 1)[1].strip()
        if 'Active App:' in line:
            app = line.split(':', 1)[1].strip()
    return {'context': context, 'sentiment': sentiment, 'app': app}

def parse_content_txt(text):
    # Parse content blocks
    contents = []
    for block in text.strip().split('---'):
        if not block.strip():
            continue
        item = {}
        for line in block.strip().splitlines():
            if ':' in line:
                key, val = line.split(':', 1)
                item[key.strip()] = val.strip()
        if item:
            contents.append(item)
    return contents

def parse_user_txt(text):
    # Parse user profile as key-value pairs
    user = {}
    for line in text.strip().splitlines():
        if ':' in line:
            key, val = line.split(':', 1)
            user[key.strip()] = val.strip()
    return user

def update_user_profile(user, context, sentiment, app):
    # Update user attentiveness and engaged apps
    from collections import defaultdict
    import ast
    # Update context
    att_topics = user.get('Attentive Topics', '{}')
    try:
        att_topics = ast.literal_eval(att_topics)
    except Exception:
        att_topics = {}
    if context:
        att_topics[context] = att_topics.get(context, 0) + 1
    user['Attentive Topics'] = str(att_topics)
    # Update engaged apps
    engaged_apps = user.get('Engaged Apps', '{}')
    try:
        engaged_apps = ast.literal_eval(engaged_apps)
    except Exception:
        engaged_apps = {}
    if app:
        engaged_apps[app] = engaged_apps.get(app, 0) + 1
    user['Engaged Apps'] = str(engaged_apps)
    # Update sentiment
    user['Last Sentiment'] = sentiment or user.get('Last Sentiment', '')
    return user

def gemini_recommendation(context, sentiment, app, contents, user):
    # Compose prompt
    prompt = f"""
You are a smart content recommender. Given the user's recent activity:
- Context: {context}
- Sentiment: {sentiment}
- App: {app}

And the following available content:
{json.dumps(contents, indent=2)}

And the user profile:
{json.dumps(user, indent=2)}

Recommend the most relevant content (Title and URL) for the user. Respond in JSON: {{"Title": ..., "URL": ...}}. Only recommend one item.
"""
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    resp = requests.post(GEMINI_API_URL, json=data)
    print('Gemini API status:', resp.status_code)
    try:
        print('Gemini API response:', resp.json())
    except Exception as e:
        print('Error reading Gemini API response:', e)
    if resp.status_code == 200:
        try:
            text = resp.json()['candidates'][0]['content']['parts'][0]['text']
            # Try to extract JSON from response
            import re
            import json as pyjson
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                return pyjson.loads(match.group(0))
        except Exception as ex:
            print('Error parsing Gemini response:', ex)
    return None

def read_json_file(path):
    if not os.path.exists(path) or os.stat(path).st_size == 0:
        return []
    with open(path, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except Exception:
            return []

def write_json_file(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    YouTubeTranscriptApi = None

def fetch_youtube_transcript(youtube_url):
    if not YouTubeTranscriptApi:
        return None
    # Extract video ID
    match = re.search(r'(?:v=|youtu.be/)([\w-]{11})', youtube_url)
    if not match:
        return None
    video_id = match.group(1)
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        # Join transcript text
        return ' '.join([seg['text'] for seg in transcript])
    except Exception as e:
        print('Transcript fetch error:', e)
        return None

def summarize_text(text):
    # Simple extractive summary: first 2-3 sentences
    sentences = re.split(r'(?<=[.!?]) +', text)
    return ' '.join(sentences[:3]) if sentences else text[:200]

def main():
    # Load user profile (old key-value format)
    user_txt = read_file(USER_JSON_PATH)
    user = parse_user_txt(user_txt)
    # Determine user preference (video or article)
    pref_type = 'article'
    if 'Preferred Content Types' in user:
        import ast
        try:
            prefs = ast.literal_eval(user['Preferred Content Types'])
            if isinstance(prefs, dict):
                pref_type = max(prefs, key=prefs.get)
        except Exception:
            pass
    # Load triggers
    triggers = read_json_file(TRIGGERS_PATH)
    # Load existing content.json as a list
    contents = read_json_file(CONTENT_JSON_PATH)
    if not isinstance(contents, list):
        contents = []
    for trig in triggers:
        trigger = trig.get('trigger', {})
        trig_type = trigger.get('type')
        print(f'Processing trigger type: {trig_type}')
        if trig_type == 'none':
            print('Skipping trigger with type "none".')
            continue
        outputs = trig.get('outputs', {})
        # Compose prompt for LLM
        prompt = f"""
You are a smart content recommender. Given the following trigger:
- Trigger Type: {trigger['type']}
- Trigger Message: {trigger['message']}

User context:
{json.dumps(outputs, indent=2)}

User profile:
{json.dumps(user, indent=2)}

The user's preferred content type is: {pref_type.upper()}

Generate a JSON object with:
- recommendation (type, title, description, url)
- summary (for YouTube, use transcript if possible, else 'no summary')
- context (trigger, user_id, idle_time if available)
Respond in JSON with these keys only.
"""
        data = {"contents": [{"parts": [{"text": prompt}]}]}
        resp = requests.post(GEMINI_API_URL, json=data)
        print('Gemini API status:', resp.status_code)
        try:
            print('Gemini API response:', resp.json())
        except Exception as e:
            print('Error reading Gemini API response:', e)
        if resp.status_code == 200:
            try:
                text = resp.json()['candidates'][0]['content']['parts'][0]['text']
                import re
                import json as pyjson
                # Remove markdown code block if present
                text = re.sub(r'^```json|^```|```$', '', text.strip(), flags=re.MULTILINE).strip()
                match = re.search(r'\{.*\}', text, re.DOTALL)
                if match:
                    rec_obj = pyjson.loads(match.group(0))
                    # --- Always generate summary from YouTube video in trigger ---
                    def get_youtube_summary_from_trigger(outputs):
                        url = ''
                        # Try to get YouTube URL from screen context
                        screen = outputs.get('screen', {})
                        url = screen.get('chrome_url', '')
                        if 'youtube.com' in url or 'youtu.be' in url:
                            transcript = fetch_youtube_transcript(url)
                            if transcript:
                                return summarize_text(transcript)
                            else:
                                return 'no summary'
                        return 'no summary'
                    rec_obj['summary'] = get_youtube_summary_from_trigger(outputs)
                    contents.append(rec_obj)
                    print('Recommendation appended:', json.dumps(rec_obj, indent=2))
            except Exception as ex:
                print('Error parsing Gemini response:', ex)
    print('Writing to content.json:', json.dumps(contents, indent=2))
    write_json_file(CONTENT_JSON_PATH, contents)
    print('Recommendations written to content.json.')
    print('All actionable triggers processed.')

if __name__ == '__main__':
    main()
