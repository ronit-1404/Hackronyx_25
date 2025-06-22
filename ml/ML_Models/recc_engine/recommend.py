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

def gemini_context_recommendation(chrome_title, chrome_url, context, contents, user):
    """
    Ask Gemini to generate a fun fact, an alternative video, and an alternative blog for the given Chrome context.
    The video/blog must not duplicate the current URL or each other.
    Always provide real, existing resources with real URLs. If the provided content is not satisfactory, generate new recommendations from your own knowledge.
    """
    prompt = f"""
You are a smart content recommender. For the following user context:
- Chrome Title: {chrome_title}
- Chrome URL: {chrome_url}
- Context: {context}

User profile:
{json.dumps(user, indent=2)}

Available content (you may use these, but you can also generate new recommendations if these are not satisfactory):
{json.dumps(contents, indent=2)}

Instructions:
- For each recommendation, always provide real, existing resources with real, accessible URLs (no placeholders, no dummy data).
- If the provided content is not satisfactory, generate new, relevant recommendations from your own knowledge.
- Do not repeat or duplicate the Chrome URL or any other recommendation in the same response.
- The alternative video should be a real YouTube (or similar) video, and the blog should be a real, accessible blog post.
- The fun fact should be creative and based on the Chrome Title.

Generate:
1. A fun fact based on the Chrome Title (be creative and relevant).
2. An alternative resource video (YouTube or similar) with a real title and real URL, that is NOT the current Chrome URL and is not a duplicate of the fun fact or blog.
3. An alternative blog (with real title and real URL), that is NOT the current Chrome URL and is not a duplicate of the fun fact or video.

Respond in JSON as:
{{"fun_fact": ..., "alternative_video": {{"title": ..., "url": ...}}, "alternative_blog": {{"title": ..., "url": ...}}}}
"""
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    resp = requests.post(GEMINI_API_URL, json=data)
    if resp.status_code == 200:
        try:
            text = resp.json()['candidates'][0]['content']['parts'][0]['text']
            import re
            import json as pyjson
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                return pyjson.loads(match.group(0))
        except Exception as ex:
            print('Error parsing Gemini context response:', ex)
    else:
        print('Gemini API error:', resp.status_code)
    return None

def extract_chrome_sessions(output_txt):
    """Extract Chrome sessions with title and URL, detecting context changes by URL."""
    sessions = []
    last_url = None
    current = {}
    for block in output_txt.split('========================================='):
        lines = block.strip().splitlines()
        chrome_title, chrome_url, context = None, None, None
        for line in lines:
            if line.startswith('Chrome Title:'):
                chrome_title = line.split(':', 1)[1].strip()
            if line.startswith('Chrome URL:'):
                chrome_url = line.split(':', 1)[1].strip()
            if 'Detected Context:' in line:
                context = line.split(':', 1)[1].strip()
        if chrome_url and chrome_url != last_url:
            sessions.append({'title': chrome_title, 'url': chrome_url, 'context': context})
            last_url = chrome_url
    return sessions

def find_alternative(contents, current_url, content_type):
    """Find an alternative resource of a given type, not matching the current URL."""
    for item in contents:
        if item.get('Type', '').lower() == content_type.lower() and item.get('URL') != current_url:
            return {'title': item.get('Title'), 'url': item.get('URL')}
    return None

def find_alternative_blog(contents, current_url):
    """Find an alternative blog post, not matching the current URL."""
    for item in contents:
        if 'blog' in item.get('Type', '').lower() and item.get('URL') != current_url:
            return {'title': item.get('Title'), 'url': item.get('URL')}
    return None

def main():
    output_txt = read_file(OUTPUT_PATH)
    content_txt = read_file(CONTENT_PATH)
    user_txt = read_file(USER_PATH)
    
    contents = parse_content_txt(content_txt)
    user = parse_user_txt(user_txt)
    sessions = extract_chrome_sessions(output_txt)
    
    for session in sessions:
        chrome_title = session['title']
        chrome_url = session['url']
        context = session['context']
        print(f"\n=== LLM Recommendations for context: {context} ===")
        print(f"Chrome Title: {chrome_title}")
        print(f"Chrome URL: {chrome_url}")
        rec = gemini_context_recommendation(chrome_title, chrome_url, context, contents, user)
        if rec:
            print(f"1. Fun Fact: {rec.get('fun_fact', 'None')}")
            video = rec.get('alternative_video', {})
            print(f"2. Alternative Video: {video.get('title', 'None')} ({video.get('url', 'None')})")
            blog = rec.get('alternative_blog', {})
            print(f"3. Alternative Blog: {blog.get('title', 'None')} ({blog.get('url', 'None')})")
            # Append to content.txt
            with open(CONTENT_PATH, 'a', encoding='utf-8') as f:
                f.write(f"\n---\nContext: {context}\nChrome Title: {chrome_title}\nChrome URL: {chrome_url}\nFun Fact: {rec.get('fun_fact', '')}\nRecommended Video Title: {video.get('title', '')}\nRecommended Video URL: {video.get('url', '')}\nRecommended Blog Title: {blog.get('title', '')}\nRecommended Blog URL: {blog.get('url', '')}\n")
            # Update user.txt with last recommended URLs and context
            user['Last Recommended Context'] = context
            user['Last Recommended Video URL'] = video.get('url', '')
            user['Last Recommended Blog URL'] = blog.get('url', '')
            write_file(USER_PATH, '\n'.join([f"{k}: {v}" for k, v in user.items()]))
        else:
            print("No LLM recommendation generated.")

if __name__ == '__main__':
    main()
