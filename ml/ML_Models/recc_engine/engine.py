from collections import defaultdict
from core import StudentUser, ContentItem, process_text_for_keywords_and_topics
from content_extractors import extract_youtube_transcript, extract_blog_text

class RecommendationEngine:
    def __init__(self):
        self.users = {}
        self.content_database = {}
        self.user_recent_content = defaultdict(list)  # user_id: list of urls
        self.recommendation_threshold = 0.5
        self.recent_limit = 5

    def add_user(self, user_id):
        if user_id not in self.users:
            self.users[user_id] = StudentUser(user_id)

    def add_content(self, title, url, content_type, description=None, transcript_or_text=None, length_minutes=None, readability_score=None):
        if transcript_or_text is None:
            if content_type == "YouTube Video":
                transcript_or_text = extract_youtube_transcript(url)
            elif content_type == "Blog Post":
                transcript_or_text = extract_blog_text(url)
        keywords, topics = process_text_for_keywords_and_topics(transcript_or_text)
        content = ContentItem(title, url, content_type, keywords, topics, description, length_minutes, readability_score)
        self.content_database[url] = content

    def process_screen_data(self, user_id, screen_analyzer_data):
        user = self.users.get(user_id)
        if not user:
            return []
        score = user.calculate_attentiveness_score(screen_analyzer_data)
        user.update_profile(screen_analyzer_data, score)
        if score < self.recommendation_threshold:
            return self.generate_recommendations(user_id, score)
        return []

    def generate_recommendations(self, user_id, current_attentiveness_score):
        user = self.users.get(user_id)
        if not user:
            return []
        recent_urls = set(self.user_recent_content[user_id][-self.recent_limit:])
        attentive_topics = set([t for t, _ in user.get_attentive_topics()])
        preferred_types = set([t for t, _ in sorted(user.preferred_content_types.items(), key=lambda x: x[1], reverse=True)])
        scored = []
        for url, content in self.content_database.items():
            if url in recent_urls:
                continue
            topic_overlap = len(attentive_topics.intersection(set(content.topics)))
            type_boost = 1 if content.content_type in preferred_types else 0
            score = topic_overlap * 2 + type_boost
            scored.append((score, content))
        scored.sort(reverse=True, key=lambda x: x[0])
        recommendations = []
        for score, content in scored[:5]:
            reason = []
            if set(content.topics).intersection(attentive_topics):
                reason.append("Matches your attentive topics")
            if content.content_type in preferred_types:
                reason.append(f"Preferred content type: {content.content_type}")
            if not reason:
                reason.append("Generally engaging content")
            recommendations.append({
                "title": content.title,
                "url": content.url,
                "reason": "; ".join(reason)
            })
        return recommendations

    def display_recommendations(self, user_id, recommendations):
        print(f"Recommendations for user {user_id}:")
        for idx, rec in enumerate(recommendations, 1):
            print(f"{idx}. {rec['title']}\n   URL: {rec['url']}\n   Reason: {rec['reason']}\n")
