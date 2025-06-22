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

# File paths
# Fix: Use correct ML_MODELS_DIR path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_MODELS_DIR = os.path.dirname(BASE_DIR)
OUTPUT_PATH = os.path.join(ML_MODELS_DIR, 'screen-analyzer', 'output.txt')
CONTENT_PATH = os.path.join(ML_MODELS_DIR, 'content.txt')
USER_PATH = os.path.join(ML_MODELS_DIR, 'user.txt')

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

def main():
    output_txt = read_file(OUTPUT_PATH)
    content_txt = read_file(CONTENT_PATH)
    user_txt = read_file(USER_PATH)
    
    output_info = parse_output_txt(output_txt)
    contents = parse_content_txt(content_txt)
    user = parse_user_txt(user_txt)
    
    # Update user profile
    user = update_user_profile(user, output_info['context'], output_info['sentiment'], output_info['app'])
    write_file(USER_PATH, '\n'.join([f"{k}: {v}" for k, v in user.items()]))
    
    # Get recommendation
    rec = gemini_recommendation(output_info['context'], output_info['sentiment'], output_info['app'], contents, user)
    if rec:
        # Append recommendation to content.txt
        with open(CONTENT_PATH, 'a', encoding='utf-8') as f:
            f.write(f"\n---\nRecommended Title: {rec['Title']}\nRecommended URL: {rec['URL']}\n")
        print(f"Recommended: {rec['Title']} ({rec['URL']})")
    else:
        print("No recommendation generated.")

if __name__ == '__main__':
    main()
