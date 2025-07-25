import sys
import re
import json
from .engine import RecommendationEngine
from .llm_recommender import generate_gemini_recommendations, build_user_profile_string, build_content_list_string

def parse_terminal_output(lines):
    screen_data = {
        'topics': {},
        'content_types': {},
        'active_time': 0.0,
        'idle_time': 0.0,
        'engaged_apps': {},
        'browse_time_irrelevant': 0.0
    }
    current_app = None
    current_context = None
    idle_time = 0.0
    for line in lines:
        if 'Active App:' in line:
            current_app = line.split('Active App:')[1].strip()
            screen_data['engaged_apps'][current_app] = screen_data['engaged_apps'].get(current_app, 0) + 1
        if 'Detected Context:' in line:
            current_context = line.split('Detected Context:')[1].strip()
            if current_context:
                screen_data['topics'][current_context.capitalize()] = 1.0
        if 'Idle Time:' in line:
            match = re.search(r'Idle Time: ([\d\.]+)', line)
            if match:
                idle_time = float(match.group(1))
                screen_data['idle_time'] += idle_time
        if 'Context' in line and 'lasted' in line:
            match = re.search(r'lasted ([\d\.]+) seconds', line)
            if match:
                duration = float(match.group(1))
                if current_context == 'browsing':
                    screen_data['browse_time_irrelevant'] += duration
                elif current_context == 'programming':
                    screen_data['active_time'] += duration
    if 'programming' in screen_data['topics']:
        screen_data['content_types']['YouTube Video'] = 1.0
    if 'browsing' in screen_data['topics']:
        screen_data['content_types']['Blog Post'] = 1.0
    return screen_data

def main():
    engine = RecommendationEngine()
    engine.add_user("student_001")
    # Always read from output.txt, clean input by removing empty lines and irrelevant headers
    with open("ml/ML_Models/screen-analyzer/output.txt", "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip() and not line.startswith("Live Screen Analyzer")]  # skip header and empty lines
    screen_data = parse_terminal_output(lines)
    user = engine.users["student_001"]
    user_profile_str = build_user_profile_string(user)
    content_list_str = build_content_list_string(engine.content_database)
    print("\n--- Gemini LLM Recommendations ---\n")
    llm_output = generate_gemini_recommendations(user_profile_str, content_list_str, top_n=3)
    print(llm_output)
    # Always trigger recommendations, skip attentiveness threshold
    recs = engine.generate_recommendations("student_001", 0.0)
    # Write user profile to user.txt
    with open("user.txt", "w", encoding="utf-8") as f:
        user = engine.users["student_001"]
        f.write(f"User ID: {user.user_id}\n")
        f.write(f"Attentive Topics: {dict(user.attentive_topics)}\n")
        f.write(f"Preferred Content Types: {dict(user.preferred_content_types)}\n")
        f.write(f"Average Active Time: {user.average_active_time}\n")
        f.write(f"Average Idle Time: {user.average_idle_time}\n")
        f.write(f"Engaged Apps: {dict(user.engaged_apps)}\n")
        f.write(f"Historical Attentiveness Scores: {user.historical_attentiveness_scores}\n")
    # Write content database to content.txt
    with open("content.txt", "w", encoding="utf-8") as f:
        for url, content in engine.content_database.items():
            f.write(f"Title: {content.title}\n")
            f.write(f"URL: {content.url}\n")
            f.write(f"Type: {content.content_type}\n")
            f.write(f"Keywords: {content.keywords}\n")
            f.write(f"Topics: {content.topics}\n")
            f.write(f"Description: {content.description}\n")
            f.write(f"Length (min): {content.length_minutes}\n")
            f.write(f"Readability: {content.readability_score}\n")
            f.write("---\n")
    # Print recommendations to terminal
    if recs:
        engine.display_recommendations("student_001", recs)
    else:
        print("No recommendations triggered.")

if __name__ == "__main__":
    main()
