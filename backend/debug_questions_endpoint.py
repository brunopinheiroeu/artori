#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

def test_questions_endpoint():
    """Test the admin questions endpoint directly"""
    
    # First, get an admin token
    login_url = "http://localhost:8000/api/v1/auth/login"
    login_data = {
        "email": "admin@artori.app",
        "password": "AdminPass123!"
    }
    
    print("🔐 Getting admin token...")
    login_response = requests.post(login_url, json=login_data)
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json()["access_token"]
    print(f"✅ Got token: {token[:20]}...")
    
    # Test the questions endpoint
    subject_id = "68dfc765f13266ab2163673d"  # ENEM Matemática
    questions_url = f"http://localhost:8000/api/v1/admin/subjects/{subject_id}/questions"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    params = {
        "limit": 10,
        "skip": 0
    }
    
    print(f"\n🔍 Testing questions endpoint...")
    print(f"URL: {questions_url}")
    print(f"Params: {params}")
    
    response = requests.get(questions_url, headers=headers, params=params)
    
    print(f"\n📊 Response Status: {response.status_code}")
    print(f"📊 Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        try:
            data = response.json()
            print(f"\n📋 Response Type: {type(data)}")
            
            if isinstance(data, list):
                print(f"❌ PROBLEM: Response is a plain array with {len(data)} items")
                print("❌ Expected: Paginated response object with 'questions', 'total_count', etc.")
                
                if data:
                    print(f"\n🔍 First question structure:")
                    first_question = data[0]
                    print(f"  - ID: {first_question.get('id', 'N/A')}")
                    print(f"  - Question: {first_question.get('question', 'N/A')[:50]}...")
                    print(f"  - Subject ID: {first_question.get('subject_id', 'N/A')}")
                    print(f"  - Difficulty: {first_question.get('difficulty', 'N/A')}")
                
            elif isinstance(data, dict):
                print(f"✅ Response is a dictionary")
                print(f"🔑 Keys: {list(data.keys())}")
                
                if 'questions' in data:
                    print(f"✅ Has 'questions' key with {len(data['questions'])} items")
                    print(f"✅ Total count: {data.get('total_count', 'N/A')}")
                    print(f"✅ Page: {data.get('page', 'N/A')}")
                    print(f"✅ Page size: {data.get('page_size', 'N/A')}")
                    print(f"✅ Total pages: {data.get('total_pages', 'N/A')}")
                else:
                    print(f"❌ Missing 'questions' key")
            
            # Save response for analysis
            with open('debug_questions_response.json', 'w') as f:
                json.dump(data, f, indent=2, default=str)
            print(f"\n💾 Response saved to debug_questions_response.json")
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {e}")
            print(f"Raw response: {response.text[:500]}...")
    else:
        print(f"❌ Request failed: {response.text}")

if __name__ == "__main__":
    test_questions_endpoint()