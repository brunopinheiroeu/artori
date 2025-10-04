#!/usr/bin/env python3

import requests
import json

def test_api_endpoints():
    base_url = "http://localhost:8000"
    
    print("=== Testing API Endpoints ===")
    
    # Test 1: Check if backend is responding
    try:
        response = requests.get(f"{base_url}/api/v1/exams")
        print(f"GET /api/v1/exams: {response.status_code}")
        if response.status_code == 200:
            exams = response.json()
            print(f"  Found {len(exams)} exams")
            for exam in exams[:3]:  # Show first 3 exams
                print(f"    - {exam.get('name', 'Unknown')} (ID: {exam.get('_id', 'Unknown')})")
        else:
            print(f"  Error: {response.text}")
    except Exception as e:
        print(f"GET /api/v1/exams: ERROR - {e}")
    
    # Test 2: Test auth/me without authentication
    try:
        response = requests.get(f"{base_url}/api/v1/auth/me")
        print(f"GET /api/v1/auth/me (no auth): {response.status_code}")
        if response.status_code != 401:
            print(f"  Unexpected response: {response.text}")
    except Exception as e:
        print(f"GET /api/v1/auth/me: ERROR - {e}")
    
    # Test 3: Test login with test credentials
    test_credentials = [
        {"email": "b3dsign@gmail.com", "password": "password123"},
        {"email": "testuser@example.com", "password": "testpass"},
        {"email": "testuser@example.com", "password": "password123"},
        {"email": "admin@example.com", "password": "admin123"},
    ]
    
    print("\n=== Testing Login Attempts ===")
    for creds in test_credentials:
        try:
            response = requests.post(f"{base_url}/api/v1/auth/login", json=creds)
            print(f"Login {creds['email']}: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"  SUCCESS! Token received")
                
                # Test authenticated request
                headers = {"Authorization": f"Bearer {data.get('token', '')}"}
                me_response = requests.get(f"{base_url}/api/v1/auth/me", headers=headers)
                print(f"  Auth test: {me_response.status_code}")
                if me_response.status_code == 200:
                    user_data = me_response.json()
                    print(f"    User: {user_data.get('email')} | Selected Exam: {user_data.get('selected_exam_id', 'None')}")
                    
                    # Test dashboard endpoint
                    dashboard_response = requests.get(f"{base_url}/api/v1/users/me/dashboard", headers=headers)
                    print(f"  Dashboard test: {dashboard_response.status_code}")
                    if dashboard_response.status_code != 200:
                        print(f"    Dashboard error: {dashboard_response.text}")
                
                return True  # Found working credentials
            else:
                print(f"  Failed: {response.text}")
        except Exception as e:
            print(f"Login {creds['email']}: ERROR - {e}")
    
    return False

if __name__ == "__main__":
    success = test_api_endpoints()
    if not success:
        print("\n=== DIAGNOSIS ===")
        print("No working user credentials found.")
        print("This confirms that the test users either don't exist or have different passwords.")
        print("Recommendation: Create a test user with known credentials to proceed with testing.")