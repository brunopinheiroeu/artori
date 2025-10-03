import os
import sys
import requests
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")

def debug_auth_me():
    """Debug the /auth/me endpoint by checking the database directly"""
    
    print("🔍 Debugging /auth/me Endpoint")
    print("=" * 40)
    
    try:
        # Connect to MongoDB
        client = MongoClient(MONGODB_URI)
        db = client.artori
        
        # Find admin user directly
        admin_user = db.users.find_one({"email": "admin@artori.app"})
        
        if admin_user:
            print("✅ Found admin user in database:")
            print(f"   ID: {admin_user['_id']}")
            print(f"   Name: {admin_user['name']}")
            print(f"   Email: {admin_user['email']}")
            print(f"   Role: {admin_user.get('role', 'NOT SET')}")
            print(f"   Role type: {type(admin_user.get('role'))}")
            print(f"   All fields: {list(admin_user.keys())}")
            
            # Test the .get() method specifically
            role_value = admin_user.get("role", "student")
            print(f"   admin_user.get('role', 'student'): {role_value}")
            print(f"   Type of role_value: {type(role_value)}")
            
            # Test direct access
            try:
                direct_role = admin_user["role"]
                print(f"   admin_user['role']: {direct_role}")
                print(f"   Type of direct_role: {type(direct_role)}")
            except KeyError:
                print("   admin_user['role']: KEY NOT FOUND")
            
            # Test if role is None
            if admin_user.get("role") is None:
                print("   ❌ Role is None!")
            else:
                print("   ✅ Role is not None")
                
            # Test the exact logic from the backend
            backend_role = admin_user.get("role", "student")
            print(f"   Backend logic result: {backend_role}")
            
        else:
            print("❌ Admin user not found!")
            
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 40)

if __name__ == "__main__":
    debug_auth_me()