#!/usr/bin/env python3

import os
import sys
from pymongo import MongoClient
from bson import ObjectId
import bcrypt

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def main():
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['artori']
    users_collection = db['users']
    
    print("=== Checking existing users ===")
    
    # Find all users
    users = list(users_collection.find({}, {"email": 1, "name": 1, "selected_exam_id": 1}))
    
    if not users:
        print("No users found in database")
    else:
        for user in users:
            print(f"User: {user.get('email', 'No email')} | Name: {user.get('name', 'No name')} | Selected Exam: {user.get('selected_exam_id', 'None')}")
    
    print("\n=== Checking for affected users ===")
    
    # Check for users with the stale exam ID
    stale_exam_id = "68de40c47781966b636c843f"
    affected_users = list(users_collection.find({"selected_exam_id": stale_exam_id}))
    
    if affected_users:
        print(f"Found {len(affected_users)} users with stale exam ID:")
        for user in affected_users:
            print(f"  - {user.get('email', 'No email')}")
    else:
        print("No users found with stale exam ID (good - they should have been fixed)")
    
    print("\n=== Creating test user if needed ===")
    
    # Check if b3dsign@gmail.com exists
    test_user = users_collection.find_one({"email": "b3dsign@gmail.com"})
    
    if not test_user:
        print("Creating test user b3dsign@gmail.com...")
        
        # Hash password
        password = "password123"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_data = {
            "email": "b3dsign@gmail.com",
            "name": "Test User",
            "password": hashed_password,
            "selected_exam_id": None,  # This is key - should be null after fix
            "created_at": "2024-01-01T00:00:00Z"
        }
        
        result = users_collection.insert_one(user_data)
        print(f"Created user with ID: {result.inserted_id}")
        print(f"Email: b3dsign@gmail.com")
        print(f"Password: {password}")
    else:
        print(f"Test user b3dsign@gmail.com already exists")
        print(f"Selected exam ID: {test_user.get('selected_exam_id', 'None')}")
    
    # Also check testuser@example.com
    test_user2 = users_collection.find_one({"email": "testuser@example.com"})
    if not test_user2:
        print("\nCreating test user testuser@example.com...")
        
        # Hash password
        password = "testpass123"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_data = {
            "email": "testuser@example.com",
            "name": "Test User 2",
            "password": hashed_password,
            "selected_exam_id": None,  # This is key - should be null after fix
            "created_at": "2024-01-01T00:00:00Z"
        }
        
        result = users_collection.insert_one(user_data)
        print(f"Created user with ID: {result.inserted_id}")
        print(f"Email: testuser@example.com")
        print(f"Password: {password}")
    else:
        print(f"\nTest user testuser@example.com already exists")
        print(f"Selected exam ID: {test_user2.get('selected_exam_id', 'None')}")

if __name__ == "__main__":
    main()