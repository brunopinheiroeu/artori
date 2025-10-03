#!/usr/bin/env python3
"""
Direct test of the questions endpoint to see what it returns
"""
import requests
import json
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API configuration
API_BASE_URL = "http://127.0.0.1:8000/api/v1"

def get_admin_token():
    """Get admin token by logging in"""
    login_data = {
        "email": "admin@artori.app",
        "password": "AdminPass123!"
    }
    
    response = requests.post(f"{API_BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"Failed to login: {response.status_code} - {response.text}")
        return None

def test_questions_endpoint():
    """Test the questions endpoint directly"""
    print("=== Testing Questions Endpoint ===")
    
    # Get admin token
    token = get_admin_token()
    if not token:
        print("Failed to get admin token")
        return
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # First, get exams to find a subject ID
    print("\n1. Getting exams...")
    exams_response = requests.get(f"{API_BASE_URL}/admin/exams", headers=headers)
    print(f"Exams response status: {exams_response.status_code}")
    
    if exams_response.status_code == 200:
        exams = exams_response.json()
        print(f"Found {len(exams)} exams")
        
        # Find an exam with subjects
        subject_id = None
        for exam in exams:
            if exam.get('subjects') and len(exam['subjects']) > 0:
                subject_id = exam['subjects'][0]['id']
                subject_name = exam['subjects'][0]['name']
                exam_name = exam['name']
                print(f"Using subject: {subject_name} (ID: {subject_id}) from exam: {exam_name}")
                break
        
        if not subject_id:
            print("No subjects found in any exam")
            return
        
        # Now test the questions endpoint
        print(f"\n2. Testing questions endpoint for subject {subject_id}...")
        questions_url = f"{API_BASE_URL}/admin/subjects/{subject_id}/questions?limit=10"
        print(f"URL: {questions_url}")
        
        questions_response = requests.get(questions_url, headers=headers)
        print(f"Questions response status: {questions_response.status_code}")
        print(f"Questions response headers: {dict(questions_response.headers)}")
        
        if questions_response.status_code == 200:
            questions_data = questions_response.json()
            print(f"\nQuestions response structure:")
            print(f"Type: {type(questions_data)}")
            print(f"Keys: {list(questions_data.keys()) if isinstance(questions_data, dict) else 'Not a dict'}")
            
            # Save full response to file for inspection
            with open('debug_questions_response_direct.json', 'w') as f:
                json.dump(questions_data, f, indent=2, default=str)
            print("Full response saved to debug_questions_response_direct.json")
            
            # Analyze the response
            if isinstance(questions_data, dict):
                if 'questions' in questions_data:
                    questions_list = questions_data['questions']
                    print(f"\nQuestions array length: {len(questions_list)}")
                    print(f"Total count: {questions_data.get('total_count', 'Not provided')}")
                    print(f"Page: {questions_data.get('page', 'Not provided')}")
                    print(f"Page size: {questions_data.get('page_size', 'Not provided')}")
                    
                    if len(questions_list) > 0:
                        print(f"\nFirst question sample:")
                        first_question = questions_list[0]
                        print(f"ID: {first_question.get('id')}")
                        print(f"Question: {first_question.get('question', '')[:100]}...")
                        print(f"Subject ID: {first_question.get('subject_id')}")
                        print(f"Options count: {len(first_question.get('options', []))}")
                    else:
                        print("\n❌ Questions array is EMPTY!")
                        print("This is likely the root cause of the issue.")
                else:
                    print(f"\n❌ No 'questions' key in response!")
                    print(f"Response keys: {list(questions_data.keys())}")
            else:
                print(f"\n❌ Response is not a dictionary: {type(questions_data)}")
                
        else:
            print(f"❌ Questions request failed: {questions_response.text}")
    else:
        print(f"❌ Exams request failed: {exams_response.text}")

if __name__ == "__main__":
    test_questions_endpoint()