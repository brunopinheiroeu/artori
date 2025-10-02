import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_with_auth():
    """Test the dashboard endpoint with proper authentication"""
    
    print("🧪 Testing Dashboard Endpoint with Authentication")
    print("=" * 50)
    
    # Step 1: Login to get a token
    print("\n1. Logging in...")
    login_data = {
        "email": "test@example.com",  # Assuming this user exists
        "password": "TestPassword123!"
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"   Login Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            access_token = token_data["access_token"]
            print("   ✅ Login successful")
            
            # Step 2: Test dashboard with token
            print("\n2. Testing dashboard with authentication...")
            headers = {"Authorization": f"Bearer {access_token}"}
            dashboard_response = requests.get(f"{BASE_URL}/users/me/dashboard", headers=headers)
            print(f"   Dashboard Status: {dashboard_response.status_code}")
            
            if dashboard_response.status_code == 200:
                print("   ✅ Dashboard endpoint working!")
                dashboard_data = dashboard_response.json()
                if "selected_exam" in dashboard_data:
                    print(f"   Selected exam: {dashboard_data['selected_exam']['name']}")
                else:
                    print("   No selected exam in response")
            elif dashboard_response.status_code == 400:
                print("   ⚠️  No exam selected (expected for reset users)")
                print(f"   Response: {dashboard_response.json()}")
            else:
                print(f"   ❌ Dashboard error: {dashboard_response.status_code}")
                print(f"   Response: {dashboard_response.text}")
                
        else:
            print(f"   ❌ Login failed: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    test_with_auth()