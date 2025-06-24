import os
import json
import requests
from dotenv import load_dotenv

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
    # Load screen context for each trigger
    screens = read_json_file(SCREEN_JSON_PATH)
    # For each actionable trigger, generate a popup using the LLM
    contents = []
    for trig in triggers:
        trigger = trig.get('trigger', {})
        if trigger.get('type') and trigger['type'] != 'none':
            outputs = trig.get('outputs', {})
            # Find the closest screen context by timestamp if available
            screen_context = {}
            trig_time = trig.get('timestamp')
            if trig_time and screens:
                from datetime import datetime
                def parse_time(t):
                    try:
                        return datetime.fromisoformat(t)
                    except Exception:
                        return None
                trig_dt = parse_time(trig_time)
                min_diff = None
                for s in screens:
                    s_time = s.get('timestamp')
                    s_dt = parse_time(s_time) if s_time else None
                    if trig_dt and s_dt:
                        diff = abs((trig_dt - s_dt).total_seconds())
                        if min_diff is None or diff < min_diff:
                            min_diff = diff
                            screen_context = s
            # Compose prompt for LLM
            prompt = f"""
You are a smart popup and content recommender. Given the following trigger:
- Trigger Type: {trigger['type']}
- Trigger Message: {trigger['message']}

User context:
{json.dumps(outputs, indent=2)}

Screen analyzer data (most relevant to this event):
{json.dumps(screen_context, indent=2)}

User profile:
{json.dumps(user, indent=2)}

The user's preferred content type is: {pref_type.upper()}

Generate a JSON object for a popup with:
- A motivational message for the user
- A fun fact related to the user's context or interests
- A recommended {pref_type} (with title, description, and a real, relevant, and currently accessible URL. Only use {pref_type}s that are available online and not behind a paywall or deleted/private. The recommendation must be relevant to the topic the student is currently studying, as indicated by the screen analyzer context.)
- An alternative recommendation of the other type (video if main is article, article if main is video)

Base your recommendations on the user's context, preferences, the trigger, and the topic from the screen analyzer. Do not use placeholders. Respond in JSON with keys: popup.title, popup.message, popup.fun_fact, popup.recommendation (type, title, description, url), popup.alternative (type, title, description, url), and context (trigger, user_id, idle_time if available).
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
                    match = re.search(r'\{.*\}', text, re.DOTALL)
                    if match:
                        popup_obj = pyjson.loads(match.group(0))
                        contents.append(popup_obj)
                        write_json_file(CONTENT_JSON_PATH, contents)
                        print('Popup appended to content.json')
                except Exception as ex:
                    print('Error parsing Gemini response:', ex)
    print('All actionable triggers processed.')

if __name__ == '__main__':
    main()
