import os
import google.generativeai as genai
from dotenv import load_dotenv
from engine import ContentItem

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def generate_gemini_recommendations(user_profile, content_list, top_n=3):
    # Build a system prompt for Gemini
    system_prompt = f"""
You are an educational recommendation engine. Your job is to suggest the most relevant and engaging content for a student based on their profile and available content. 

User Profile:
{user_profile}

Available Content:
{content_list}

Instructions:
- Recommend the top {top_n} items.
- For each, provide the title, URL, and a short reason for recommendation.
- Be concise and helpful.
"""
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(system_prompt)
    return response.text

def build_user_profile_string(user):
    return (
        f"User ID: {user.user_id}\n"
        f"Attentive Topics: {dict(user.attentive_topics)}\n"
        f"Preferred Content Types: {dict(user.preferred_content_types)}\n"
        f"Average Active Time: {user.average_active_time}\n"
        f"Average Idle Time: {user.average_idle_time}\n"
        f"Engaged Apps: {dict(user.engaged_apps)}\n"
        f"Historical Attentiveness Scores: {user.historical_attentiveness_scores}\n"
    )

def build_content_list_string(content_db):
    out = []
    for url, content in content_db.items():
        out.append(
            f"Title: {content.title}\nURL: {content.url}\nType: {content.content_type}\nKeywords: {content.keywords}\nTopics: {content.topics}\nDescription: {content.description}\nLength (min): {content.length_minutes}\nReadability: {content.readability_score}\n---"
        )
    return "\n".join(out)
