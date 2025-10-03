import os
import sys
import requests
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "admin@artori.app"
ADMIN_PASSWORD = "AdminPass123!"

def test_admin_functionality():
    """Test admin panel functionality with populated database"""
    
    print("🧪 Testing Admin Panel Functionality")
    print("=" * 50)
    
    # Step 1: Login as admin
    print("\n1. Testing Admin Login...")
    login_response = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        return
    
    token = login_response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Admin login successful")
    
    # Step 2: Test Dashboard Stats
    print("\n2. Testing Dashboard Statistics...")
    stats_response = requests.get(f"{BASE_URL}/api/v1/admin/dashboard/stats", headers=headers)
    if stats_response.status_code == 200:
        stats = stats_response.json()
        print(f"✅ Dashboard Stats:")
        print(f"   Total Users: {stats.get('total_users', 'N/A')}")
        print(f"   Active Users: {stats.get('active_users', 'N/A')}")
        print(f"   Total Questions: {stats.get('total_questions', 'N/A')}")
        print(f"   Total Exams: {stats.get('total_exams', 'N/A')}")
    else:
        print(f"❌ Dashboard stats failed: {stats_response.status_code}")
    
    # Step 3: Test Users Management
    print("\n3. Testing Users Management...")
    users_response = requests.get(f"{BASE_URL}/api/v1/admin/users", headers=headers)
    if users_response.status_code == 200:
        users_data = users_response.json()
        # Handle both list and dict response formats
        if isinstance(users_data, list):
            users = users_data
        else:
            users = users_data.get('users', [])
        print(f"✅ Users Management:")
        print(f"   Total Users Retrieved: {len(users)}")
        
        # Count by role
        role_counts = {}
        for user in users:
            role = user.get('role', 'unknown')
            role_counts[role] = role_counts.get(role, 0) + 1
        
        for role, count in role_counts.items():
            print(f"   {role}: {count} users")
            
        # Show student accounts
        students = [u for u in users if u.get('role') == 'student']
        print(f"\n   Student Accounts:")
        for student in students[:8]:  # Show first 8
            print(f"   - {student.get('name', 'N/A')} ({student.get('email', 'N/A')})")
    else:
        print(f"❌ Users management failed: {users_response.status_code}")
    
    # Step 4: Test Exams Management
    print("\n4. Testing Exams Management...")
    exams_response = requests.get(f"{BASE_URL}/api/v1/admin/exams", headers=headers)
    if exams_response.status_code == 200:
        exams = exams_response.json()
        print(f"✅ Exams Management:")
        print(f"   Total Exams: {len(exams)}")
        
        for exam in exams:
            print(f"   - {exam.get('name', 'N/A')}: {exam.get('question_count', 0)} questions")
    else:
        print(f"❌ Exams management failed: {exams_response.status_code}")
    
    # Step 5: Test Analytics
    print("\n5. Testing Analytics...")
    analytics_response = requests.get(f"{BASE_URL}/api/v1/admin/dashboard/performance", headers=headers)
    if analytics_response.status_code == 200:
        analytics = analytics_response.json()
        print(f"✅ Analytics:")
        print(f"   Performance Data Available: {len(analytics) > 0}")
        if analytics:
            print(f"   Sample Analytics Keys: {list(analytics.keys())[:5]}")
    else:
        print(f"❌ Analytics failed: {analytics_response.status_code}")
    
    # Step 6: Test Activity Logs
    print("\n6. Testing Activity Logs...")
    activity_response = requests.get(f"{BASE_URL}/api/v1/admin/dashboard/activity", headers=headers)
    if activity_response.status_code == 200:
        activity = activity_response.json()
        print(f"✅ Activity Logs:")
        # Handle both list and dict response formats
        if isinstance(activity, list):
            print(f"   Recent Activities: {len(activity)}")
        else:
            print(f"   Recent Activities: {len(activity.get('activities', []))}")
    else:
        print(f"❌ Activity logs failed: {activity_response.status_code}")
    
    print("\n" + "=" * 50)
    print("✅ Admin Panel Functionality Test Complete!")

def check_database_population():
    """Check database population directly"""
    print("\n📊 Database Population Check")
    print("-" * 30)
    
    try:
        # Connect to MongoDB
        MONGODB_URI = os.getenv("MONGODB_URI")
        client = MongoClient(MONGODB_URI)
        db = client.artori
        
        # Check collections
        collections = {
            'users': db.users.count_documents({}),
            'exams': db.exams.count_documents({}),
            'questions': db.questions.count_documents({}),
            'user_answers': db.user_answers.count_documents({}),
            'user_progress': db.user_progress.count_documents({}),
            'analytics_metrics': db.analytics_metrics.count_documents({})
        }
        
        for collection, count in collections.items():
            print(f"   {collection}: {count} documents")
        
        # Check student accounts specifically
        students = list(db.users.find({"role": "student"}, {"name": 1, "email": 1}))
        print(f"\n   Student Test Accounts ({len(students)}):")
        for student in students:
            print(f"   - {student.get('name', 'N/A')} ({student.get('email', 'N/A')})")
            
        client.close()
        
    except Exception as e:
        print(f"❌ Database check failed: {e}")

if __name__ == "__main__":
    check_database_population()
    test_admin_functionality()