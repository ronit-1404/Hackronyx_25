from attentiveness_engine.engine import RecommendationEngine

# Initialize engine
engine = RecommendationEngine()

# Add content items
engine.add_content(
    title="Python Loops Tutorial",
    url="https://youtube.com/python-loops",
    content_type="YouTube Video",
    description="A beginner's guide to loops in Python.",
    transcript_or_text="Learn about loops, variables, and Python programming in this tutorial.",
    length_minutes=10
)
engine.add_content(
    title="Understanding Algebraic Equations",
    url="https://blog.com/algebra-equations",
    content_type="Blog Post",
    description="A blog post on solving algebraic equations.",
    transcript_or_text="This blog post discusses algebra, equations, and statistics in mathematics.",
    readability_score=70.0
)
engine.add_content(
    title="Biology Basics: The Cell",
    url="https://youtube.com/biology-cell",
    content_type="YouTube Video",
    description="An engaging video about cell biology.",
    transcript_or_text="Explore biology, cells, and experiments in this science video.",
    length_minutes=8
)
engine.add_content(
    title="Getting Started with Data Science",
    url="https://blog.com/data-science-intro",
    content_type="Blog Post",
    description="Introduction to data science concepts.",
    transcript_or_text="Data science, machine learning, and statistics are covered in this post.",
    readability_score=65.0
)

# Add a sample student user
engine.add_user("student_001")

# Scenario 1: Attentive Student
screen_data_attentive = {
    'topics': {'Programming': 1.0},
    'content_types': {'YouTube Video': 1.0},
    'active_time': 25,
    'idle_time': 2,
    'engaged_apps': {'VS Code': 20, 'Jupyter Notebook': 5},
    'browse_time_irrelevant': 0
}
recs1 = engine.process_screen_data("student_001", screen_data_attentive)
print("Scenario 1: Attentive Student")
engine.display_recommendations("student_001", recs1)

# Scenario 2: Disengaging Student
screen_data_disengaged = {
    'topics': {'Programming': 0.5},
    'content_types': {'YouTube Video': 0.5, 'Blog Post': 0.5},
    'active_time': 5,
    'idle_time': 15,
    'engaged_apps': {'Web Browser': 10},
    'browse_time_irrelevant': 10
}
recs2 = engine.process_screen_data("student_001", screen_data_disengaged)
print("\nScenario 2: Disengaging Student")
engine.display_recommendations("student_001", recs2)
