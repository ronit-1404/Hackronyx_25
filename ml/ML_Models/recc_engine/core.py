# Import required libraries
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import defaultdict, Counter
import string

# Download NLTK resources if not already present
nltk.download('punkt')
nltk.download('stopwords')

class StudentUser:
    def __init__(self, user_id):
        self.user_id = user_id
        self.attentive_topics = defaultdict(float)  # topic: score
        self.preferred_content_types = defaultdict(float)  # content_type: score
        self.average_active_time = 0.0
        self.average_idle_time = 0.0
        self.engaged_apps = defaultdict(float)  # app: time
        self.historical_attentiveness_scores = []
        self._decay = 0.8  # Decay factor for moving average

    def update_profile(self, screen_analyzer_data, attentiveness_score):
        for topic, score in screen_analyzer_data.get('topics', {}).items():
            self.attentive_topics[topic] = (
                self._decay * self.attentive_topics[topic] + (1 - self._decay) * score
            )
        for ctype, score in screen_analyzer_data.get('content_types', {}).items():
            self.preferred_content_types[ctype] = (
                self._decay * self.preferred_content_types[ctype] + (1 - self._decay) * score
            )
        self.average_active_time = (
            self._decay * self.average_active_time + (1 - self._decay) * screen_analyzer_data.get('active_time', 0)
        )
        self.average_idle_time = (
            self._decay * self.average_idle_time + (1 - self._decay) * screen_analyzer_data.get('idle_time', 0)
        )
        for app, time in screen_analyzer_data.get('engaged_apps', {}).items():
            self.engaged_apps[app] = (
                self._decay * self.engaged_apps[app] + (1 - self._decay) * time
            )
        self.historical_attentiveness_scores.append(attentiveness_score)

    def calculate_attentiveness_score(self, screen_analyzer_data):
        active = screen_analyzer_data.get('active_time', 0)
        idle = screen_analyzer_data.get('idle_time', 0)
        browse_irrelevant = screen_analyzer_data.get('browse_time_irrelevant', 0)
        total = active + idle + browse_irrelevant
        if total == 0:
            return 0.0
        score = (active / (active + idle + 1e-5)) * (1 - (browse_irrelevant / (total + 1e-5)))
        return min(max(score, 0.0), 1.0)

    def get_attentive_topics(self, top_n=3):
        return sorted(self.attentive_topics.items(), key=lambda x: x[1], reverse=True)[:top_n]

class ContentItem:
    def __init__(self, title, url, content_type, keywords, topics, description=None, length_minutes=None, readability_score=None):
        self.title = title
        self.url = url
        self.content_type = content_type  # "YouTube Video" or "Blog Post"
        self.keywords = keywords
        self.topics = topics
        self.description = description
        self.length_minutes = length_minutes
        self.readability_score = readability_score

def process_text_for_keywords_and_topics(text):
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text.lower())
    words = [w for w in tokens if w.isalpha() and w not in stop_words]
    freq = Counter(words)
    keywords = [word for word, count in freq.most_common(7)]
    topic_map = {
        "python": "Programming",
        "java": "Programming",
        "algebra": "Mathematics",
        "calculus": "Mathematics",
        "biology": "Science",
        "chemistry": "Science",
        "loop": "Programming",
        "variable": "Programming",
        "function": "Programming",
        "equation": "Mathematics",
        "experiment": "Science",
        "data": "Data Science",
        "statistics": "Mathematics",
        "machine": "AI",
        "learning": "AI",
        "neural": "AI",
        "network": "AI"
    }
    topics = set()
    for kw in keywords:
        if kw in topic_map:
            topics.add(topic_map[kw])
    if not topics and keywords:
        topics.add("General")
    return keywords, list(topics)
