import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://127.0.0.1:8000/api/v1"

def create_and_test_user():
    """Create a test user and test the dashboard endpoint"""
    
    print("🧪 Creating Test User and Testing Dashboard")
    print("=" * 50)
    
    # Step 1: Create a test user
    print("\n1. Creating test user...")
    signup_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "TestPassword123!"
    }
    
    try:
        signup_response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        print(f"   Signup Status: {signup_response.status_code}")
        
        if signup_response.status_code == 200:
            token_data = signup_response.json()
            access_token = token_data["access_token"]
            print("   ✅ User created and logged in")
            
            # Step 2: Test dashboard with token (should fail - no exam selected)
            print("\n2. Testing dashboard without exam selection...")
            headers = {"Authorization": f"Bearer {access_token}"}
            dashboard_response = requests.get(f"{BASE_URL}/users/me/dashboard", headers=headers)
            print(f"   Dashboard Status: {dashboard_response.status_code}")
            
            if dashboard_response.status_code == 400:
                print("   ✅ Expected 400 - No exam selected")
                print(f"   Response: {dashboard_response.json()}")
            elif dashboard_response.status_code == 404:
                print("   ❌ Unexpected 404 - Endpoint not found")
            else:
                print(f"   Status: {dashboard_response.status_code}")
                print(f"   Response: {dashboard_response.text}")
            
            # Step 3: Get available exams
            print("\n3. Getting available exams...")
            exams_response = requests.get(f"{BASE_URL}/exams", headers=headers)
            if exams_response.status_code == 200:
                exams = exams_response.json()
                if exams:
                    exam_id = exams[0]["id"]
                    print(f"   Found exam: {exams[0]['name']} (ID: {exam_id})")
                    
                    # Step 4: Select an exam
                    print("\n4. Selecting exam...")
                    select_response = requests.post(
                        f"{BASE_URL}/users/me/exam", 
                        json={"exam_id": exam_id},
                        headers=headers
                    )
                    print(f"   Exam selection status: {select_response.status_code}")
                    
                    if select_response.status_code == 200:
                        print("   ✅ Exam selected successfully")
                        
                        # Step 5: Test dashboard again
                        print("\n5. Testing dashboard with exam selected...")
                        dashboard_response = requests.get(f"{BASE_URL}/users/me/dashboard", headers=headers)
                        print(f"   Dashboard Status: {dashboard_response.status_code}")
                        
                        if dashboard_response.status_code == 200:
                            print("   ✅ Dashboard working perfectly!")
                            dashboard_data = dashboard_response.json()
                            print(f"   Selected exam: {dashboard_data['selected_exam']['name']}")
                            if dashboard_data.get('user_progress'):
                                print(f"   Progress: {dashboard_data['user_progress']['overall_progress']}%")
                            else:
                                print("   No progress data yet (expected for new user)")
                        else:
                            print(f"   ❌ Dashboard error: {dashboard_response.status_code}")
                            print(f"   Response: {dashboard_response.text}")
                    else:
                        print(f"   ❌ Exam selection failed: {select_response.status_code}")
                        print(f"   Response: {select_response.text}")
                else:
                    print("   No exams available")
            else:
                print(f"   Failed to get exams: {exams_response.status_code}")
                
        elif signup_response.status_code == 400:
            # User might already exist, try to login
            print("   User might already exist, trying to login...")
            login_data = {
                "email": signup_data["email"],
                "password": signup_data["password"]
            }
            login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            if login_response.status_code == 200:
                token_data = login_response.json()
                access_token = token_data["access_token"]
                print("   ✅ Logged in with existing user")
                
                # Test dashboard
                print("\n2. Testing dashboard...")
                headers = {"Authorization": f"Bearer {access_token}"}
                dashboard_response = requests.get(f"{BASE_URL}/users/me/dashboard", headers=headers)
                print(f"   Dashboard Status: {dashboard_response.status_code}")
                print(f"   Response: {dashboard_response.text}")
            else:
                print(f"   Login failed: {login_response.status_code}")
        else:
            print(f"   ❌ Signup failed: {signup_response.status_code}")
            print(f"   Response: {signup_response.text}")
            
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    create_and_test_user()