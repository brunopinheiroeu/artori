import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_endpoints():
    """Test the key endpoints that were causing 404 errors"""
    
    print("🧪 Testing Backend Endpoints")
    print("=" * 40)
    
    # Test 1: Get all exams
    print("\n1. Testing GET /exams")
    try:
        response = requests.get(f"{BASE_URL}/exams")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            exams = response.json()
            print(f"   Found {len(exams)} exams")
            if exams:
                exam_id = exams[0]["id"]
                print(f"   First exam ID: {exam_id}")
                
                # Test 2: Get specific exam
                print(f"\n2. Testing GET /exams/{exam_id}")
                exam_response = requests.get(f"{BASE_URL}/exams/{exam_id}")
                print(f"   Status: {exam_response.status_code}")
                if exam_response.status_code == 200:
                    exam_data = exam_response.json()
                    print(f"   Exam name: {exam_data['name']}")
                    print(f"   Subjects: {len(exam_data.get('subjects', []))}")
                else:
                    print(f"   Error: {exam_response.text}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 3: Dashboard endpoint (will fail without auth, but should return 401, not 404)
    print(f"\n3. Testing GET /users/me/dashboard (without auth)")
    try:
        response = requests.get(f"{BASE_URL}/users/me/dashboard")
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print("   ✅ Endpoint exists (returns 401 Unauthorized as expected)")
        elif response.status_code == 404:
            print("   ❌ Endpoint not found (404)")
        else:
            print(f"   Unexpected status: {response.status_code}")
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n" + "=" * 40)
    print("✅ Endpoint testing complete!")

if __name__ == "__main__":
    test_endpoints()