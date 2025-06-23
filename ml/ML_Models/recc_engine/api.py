# from flask import Flask, request, jsonify, render_template
# from flask_cors import CORS
# import json
# import time
# from datetime import datetime

# # Import recommendation engine components
# from engine import RecommendationEngine
# from llm_recommender import generate_gemini_recommendations, build_user_profile_string, build_content_list_string

# app = Flask(__name__, static_folder='static', template_folder='templates')
# CORS(app)  # Enable CORS for all routes

# # Initialize the engine and add sample contents
# engine = RecommendationEngine()
# engine.add_user("student_001")

# # Add sample content
# engine.add_content(
#     title="Python Loops Tutorial",
#     url="https://youtube.com/python-loops",
#     content_type="YouTube Video",
#     description="A beginner's guide to loops in Python.",
#     transcript_or_text="Learn about loops, variables, and Python programming in this tutorial.",
#     length_minutes=10
# )

# engine.add_content(
#     title="Understanding Algebraic Equations",
#     url="https://blog.com/algebra-equations",
#     content_type="Blog Post",
#     description="A blog post on solving algebraic equations.",
#     transcript_or_text="This blog post discusses algebra, equations, and statistics in mathematics.",
#     readability_score=70.0
# )

# engine.add_content(
#     title="Biology Basics: The Cell",
#     url="https://youtube.com/biology-cell",
#     content_type="YouTube Video",
#     description="An engaging video about cell biology.",
#     transcript_or_text="Explore biology, cells, and experiments in this science video.",
#     length_minutes=8
# )

# engine.add_content(
#     title="Getting Started with Data Science",
#     url="https://blog.com/data-science-intro",
#     content_type="Blog Post",
#     description="Introduction to data science concepts.",
#     transcript_or_text="Data science, machine learning, and statistics are covered in this post.",
#     readability_score=65.0
# )

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/api/parse-screen-data', methods=['POST'])
# def parse_screen_data():
#     """Parse screen data from terminal output and generate recommendations"""
#     try:
#         data = request.json
#         lines = data.get('terminal_output', '').splitlines()
        
#         # Parse the terminal output
#         screen_data = {
#             'topics': {},
#             'content_types': {},
#             'active_time': 0.0,
#             'idle_time': 0.0,
#             'engaged_apps': {},
#             'browse_time_irrelevant': 0.0
#         }
        
#         current_app = None
#         current_context = None
#         idle_time = 0.0
        
#         for line in lines:
#             if 'Active App:' in line:
#                 current_app = line.split('Active App:')[1].strip()
#                 screen_data['engaged_apps'][current_app] = screen_data['engaged_apps'].get(current_app, 0) + 1
#             if 'Detected Context:' in line:
#                 current_context = line.split('Detected Context:')[1].strip()
#                 if current_context:
#                     screen_data['topics'][current_context.capitalize()] = 1.0
#             if 'Idle Time:' in line:
#                 match = re.search(r'Idle Time: ([\d\.]+)', line)
#                 if match:
#                     idle_time = float(match.group(1))
#                     screen_data['idle_time'] += idle_time
#             if 'Context' in line and 'lasted' in line:
#                 match = re.search(r'lasted ([\d\.]+) seconds', line)
#                 if match:
#                     duration = float(match.group(1))
#                     if current_context == 'browsing':
#                         screen_data['browse_time_irrelevant'] += duration
#                     elif current_context == 'programming':
#                         screen_data['active_time'] += duration
                        
#         # Assume content type by context
#         if 'programming' in screen_data['topics']:
#             screen_data['content_types']['YouTube Video'] = 1.0
#         if 'browsing' in screen_data['topics']:
#             screen_data['content_types']['Blog Post'] = 1.0
        
#         # Process the screen data with the recommendation engine
#         user_id = "student_001"  # Default user for demo
#         user = engine.users[user_id]
#         score = user.calculate_attentiveness_score(screen_data)
#         user.update_profile(screen_data, score)
        
#         # Generate recommendations
#         recommendations = engine.generate_recommendations(user_id, score)
        
#         # Get LLM recommendations
#         user_profile_str = build_user_profile_string(user)
#         content_list_str = build_content_list_string(engine.content_database)
#         llm_output = generate_gemini_recommendations(user_profile_str, content_list_str, top_n=3)
        
#         return jsonify({
#             'success': True,
#             'recommendations': recommendations,
#             'llm_recommendations': llm_output,
#             'attentiveness_score': score,
#             'user_profile': {
#                 'topics': dict(user.attentive_topics),
#                 'content_types': dict(user.preferred_content_types),
#                 'active_time': user.average_active_time,
#                 'idle_time': user.average_idle_time
#             }
#         })
    
#     except Exception as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500

# @app.route('/api/user-profile', methods=['GET'])
# def get_user_profile():
#     """Get the current user profile"""
#     try:
#         user_id = request.args.get('user_id', 'student_001')
#         user = engine.users.get(user_id)
#         if not user:
#             return jsonify({'success': False, 'error': 'User not found'}), 404
            
#         return jsonify({
#             'success': True,
#             'user_profile': {
#                 'user_id': user.user_id,
#                 'topics': dict(user.attentive_topics),
#                 'content_types': dict(user.preferred_content_types),
#                 'active_time': user.average_active_time,
#                 'idle_time': user.average_idle_time,
#                 'engaged_apps': dict(user.engaged_apps),
#                 'historical_scores': user.historical_attentiveness_scores
#             }
#         })
        
#     except Exception as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500

# @app.route('/api/reset-user', methods=['POST'])
# def reset_user():
#     """Reset user profile data"""
#     try:
#         data = request.json
#         user_id = data.get('user_id', 'student_001')
        
#         # Re-initialize user
#         engine.users[user_id] = engine.users[user_id].__class__(user_id)
        
#         return jsonify({
#             'success': True,
#             'message': f'User {user_id} has been reset'
#         })
        
#     except Exception as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500

# if __name__ == '__main__':
#     import re  # Make sure to import re for regex matching
#     app.run(debug=True, port=5000)

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import time
import os
from datetime import datetime
# Import recommendation engine components
from .engine import RecommendationEngine
from .llm_recommender import generate_gemini_recommendations, build_user_profile_string, build_content_list_string

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS for all routes

# Initialize the engine and add sample contents
engine = RecommendationEngine()
engine.add_user("student_001")

# Directory to save data
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

def write_to_json_file(data_type, data):
    """Write data to a JSON file in the data directory"""
    try:
        file_path = os.path.join(DATA_DIR, f"{data_type}.json")
        
        # Read existing data if available
        existing_data = []
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    existing_data = []
        
        # Ensure existing_data is a list
        if not isinstance(existing_data, list):
            existing_data = []
        
        # Add timestamp to the data
        data['timestamp'] = datetime.now().isoformat()
        
        # Append new data
        existing_data.append(data)
        
        # Write updated data back to the file
        with open(file_path, 'w') as f:
            json.dump(existing_data, f, indent=2)
            
        return True
    except Exception as e:
        print(f"Error writing to JSON file: {e}")
        return False

# Add sample content
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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get personalized recommendations"""
    try:
        data = request.json
        user_id = data.get('user_id', 'student_001')
        
        user = engine.users.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        # Generate recommendations
        recommendations = engine.generate_recommendations(user_id, 0.5)  # Use a mid-range attentiveness score
        
        # Get LLM recommendations
        user_profile_str = build_user_profile_string(user)
        content_list_str = build_content_list_string(engine.content_database)
        llm_output = generate_gemini_recommendations(user_profile_str, content_list_str, top_n=3)
        
        response_data = {
            'success': True,
            'recommendations': recommendations,
            'llm_recommendations': llm_output
        }
        
        # Save to JSON file
        content_data = {
            'userId': user_id,
            'recommendations': recommendations,
            'llm_recommendations': llm_output
        }
        write_to_json_file('content', content_data)
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/parse-screen-data', methods=['POST'])
def parse_screen_data():
    """Parse screen data from terminal output and generate recommendations"""
    try:
        data = request.json
        user_id = data.get('user_id', 'student_001')
        lines = data.get('terminal_output', '').splitlines()
        
        # Parse the terminal output
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
                import re
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
        
        # Assume content type by context
        if 'programming' in screen_data['topics']:
            screen_data['content_types']['YouTube Video'] = 1.0
        if 'browsing' in screen_data['topics']:
            screen_data['content_types']['Blog Post'] = 1.0
        
        # Process the screen data with the recommendation engine
        user = engine.users[user_id]
        score = user.calculate_attentiveness_score(screen_data)
        user.update_profile(screen_data, score)
        
        # Generate recommendations
        recommendations = engine.generate_recommendations(user_id, score)
        
        # Get LLM recommendations
        user_profile_str = build_user_profile_string(user)
        content_list_str = build_content_list_string(engine.content_database)
        llm_output = generate_gemini_recommendations(user_profile_str, content_list_str, top_n=3)
        
        response_data = {
            'success': True,
            'recommendations': recommendations,
            'llm_recommendations': llm_output,
            'attentiveness_score': score,
            'user_profile': {
                'topics': dict(user.attentive_topics),
                'content_types': dict(user.preferred_content_types),
                'active_time': user.average_active_time,
                'idle_time': user.average_idle_time
            }
        }
        
        # Save to JSON file
        user_data = {
            'userId': user_id,
            'attentiveness_score': score,
            'topics': dict(user.attentive_topics),
            'content_types': dict(user.preferred_content_types),
            'active_time': user.average_active_time,
            'idle_time': user.average_idle_time,
            'recommendations': recommendations
        }
        write_to_json_file('user', user_data)
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/user-profile', methods=['GET'])
def get_user_profile():
    """Get the current user profile"""
    try:
        user_id = request.args.get('user_id', 'student_001')
        user = engine.users.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
            
        return jsonify({
            'success': True,
            'user_profile': {
                'user_id': user.user_id,
                'topics': dict(user.attentive_topics),
                'content_types': dict(user.preferred_content_types),
                'active_time': user.average_active_time,
                'idle_time': user.average_idle_time,
                'engaged_apps': dict(user.engaged_apps),
                'historical_scores': user.historical_attentiveness_scores
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/reset-user', methods=['POST'])
def reset_user():
    """Reset user profile data"""
    try:
        data = request.json
        user_id = data.get('user_id', 'student_001')
        
        # Re-initialize user
        engine.users[user_id] = engine.users[user_id].__class__(user_id)
        
        return jsonify({
            'success': True,
            'message': f'User {user_id} has been reset'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    import re  # Make sure to import re for regex matching
    app.run(debug=True, port=5000)