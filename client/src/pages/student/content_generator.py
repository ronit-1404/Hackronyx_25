#!/usr/bin/env python3
"""
Simple Content Generator with YouTube Transcript and Gemini AI
Single file solution for generating summaries, quizzes, and flashcards
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import urllib.request
import re
import os
import requests
from datetime import datetime

# You need to install these packages:
# pip install youtube-transcript-api requests

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print("Required packages not installed!")
    print("Please run: pip install youtube-transcript-api requests")
    exit(1)

# Configure Gemini AI - Replace with your actual API key
GEMINI_API_KEY = "AIzaSyCKKfKBPBDwVyHb-FVPGrrB2SXeq2bckgo"  # Get from https://makersuite.google.com/app/apikey
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY

class ContentGeneratorHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/generate':
            try:
                # Get request data
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                youtube_url = data.get('youtube_url', '')
                output_type = data.get('output_type', 'summary')
                
                print(f"Processing request: {youtube_url} -> {output_type}")
                
                # Extract video ID from YouTube URL
                video_id = self.extract_video_id(youtube_url)
                if not video_id:
                    self.send_error_response("Invalid YouTube URL")
                    return
                
                # Get transcript
                transcript = self.get_transcript(video_id)
                if not transcript:
                    self.send_error_response("Could not get transcript for this video")
                    return
                
                # Generate content with Gemini
                generated_content = self.generate_content(transcript, output_type)
                
                # Send successful response
                self.send_json_response({
                    'transcript': transcript,
                    'generated_content': generated_content,
                    'output_type': output_type,
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                print(f"Error: {e}")
                self.send_error_response(f"Server error: {str(e)}")
        else:
            self.send_error_response("Endpoint not found", 404)

    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/health':
            self.send_json_response({'status': 'healthy', 'message': 'Content Generator is running'})
        else:
            self.send_error_response("Endpoint not found", 404)

    def extract_video_id(self, url):
        """Extract YouTube video ID from URL"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
            r'youtube\.com\/watch\?.*v=([^&\n?#]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None

    def get_transcript(self, video_id):
        """Get transcript from YouTube video"""
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            transcript = ' '.join([item['text'] for item in transcript_list])
            return transcript
        except Exception as e:
            print(f"Transcript error: {e}")
            return None

    def generate_content(self, transcript, output_type):
        """Generate content using Gemini AI REST API"""
        try:
            prompts = {
                'summary': f"""
Create a comprehensive summary of this video transcript. Structure it clearly with:
- Main Topic
- Key Points (3-5 main points)
- Important Details
- Conclusion

Transcript: {transcript}
""",
                
                'quiz': f"""
Create a 10-question quiz based on this transcript. Format each question as:

Q: [Question text]
A: [Answer text]

Include a mix of multiple choice, true/false, and short answer questions.
Make sure each question starts with "Q:" and each answer starts with "A:".

Transcript: {transcript}
""",
                
                'flashcards': f"""
Create 12 flashcards for studying based on this transcript. 
Format each as:

Q: [Question/Term]
A: [Answer/Definition]

Make sure each question starts with "Q:" and each answer starts with "A:".
Focus on key concepts, definitions, and important facts.

Transcript: {transcript}
"""
            }
            
            prompt = prompts.get(output_type, prompts['summary'])
            
            # Use Gemini REST API
            data = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            
            response = requests.post(GEMINI_API_URL, json=data)
            print(f'Gemini API status: {response.status_code}')
            
            if response.status_code == 200:
                try:
                    result = response.json()
                    generated_text = result['candidates'][0]['content']['parts'][0]['text']
                    return generated_text
                except Exception as ex:
                    print(f'Error parsing Gemini response: {ex}')
                    return f"Error parsing response: {str(ex)}"
            else:
                print(f'Gemini API error: {response.text}')
                return f"API Error: {response.status_code} - {response.text}"
            
        except Exception as e:
            print(f"Gemini error: {e}")
            return f"Error generating content: {str(e)}"

    def send_json_response(self, data):
        """Send JSON response with CORS headers"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def send_error_response(self, message, status_code=400):
        """Send error response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_data = {'error': message}
        self.wfile.write(json.dumps(error_data).encode('utf-8'))

    def log_message(self, format, *args):
        """Override to customize logging"""
        print(f"{datetime.now()} - {format % args}")

def main():
    """Start the server"""
    print("=" * 50)
    print("Content Generator Server")
    print("=" * 50)
    
    # Check API key
    if GEMINI_API_KEY == "your-gemini-api-key-here":
        print("⚠️  WARNING: Please set your GEMINI_API_KEY in the script!")
        print("Get your API key from: https://makersuite.google.com/app/apikey")
        print()
    
    print("Starting server on http://localhost:8000")
    print("Endpoints:")
    print("  POST /generate - Generate content from YouTube URL")
    print("  GET  /health  - Health check")
    print()
    print("Make sure you have installed required packages:")
    print("  pip install youtube-transcript-api requests")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        server = HTTPServer(('localhost', 8000), ContentGeneratorHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except Exception as e:
        print(f"Server error: {e}")

if __name__ == '__main__':
    main()