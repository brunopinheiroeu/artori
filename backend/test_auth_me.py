import os
import sys
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
API_BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_auth_me():
    """Test the /auth/me endpoint directly"""
    
    print("🧪 Testing /auth/me Endpoint")
    print("=" * 40)
    
    try:
        # First, login to get a token
        login_data = {
            "email": "admin@artori.app",
            "password": "AdminPass123!"
        }
        
        print("1. Logging in...")
        login_response = requests.post(f"{API_BASE_URL}/auth/login", json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return
        
        login_result = login_response.json()
        access_token = login_result["access_token"]
        print(f"✅ Login successful, got token: {access_token[:20]}...")
        
        # Now test /auth/me
        print("\n2. Testing /auth/me...")
        headers = {"Authorization": f"Bearer {access_token}"}
        me_response = requests.get(f"{API_BASE_URL}/auth/me", headers=headers)
        
        if me_response.status_code != 200:
            print(f"❌ /auth/me failed: {me_response.status_code}")
            print(f"Response: {me_response.text}")
            return
        
        user_data = me_response.json()
        print(f"✅ /auth/me successful:")
        print(f"   ID: {user_data.get('id')}")
        print(f"   Name: {user_data.get('name')}")
        print(f"   Email: {user_data.get('email')}")
        print(f"   Role: {user_data.get('role')}")
        print(f"   Selected Exam ID: {user_data.get('selected_exam_id')}")
        
        # Compare with database
        print("\n3. Comparing with database...")
        client = MongoClient(MONGODB_URI)
        db = client.artori
        
        db_user = db.users.find_one({"email": "admin@artori.app"})
        if db_user:
            print(f"   Database Role: {db_user.get('role')}")
            print(f"   API Response Role: {user_data.get('role')}")
            
            if db_user.get('role') == user_data.get('role'):
                print("✅ Roles match!")
            else:
                print("❌ Roles don't match!")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 40)

if __name__ == "__main__":
    test_auth_me()