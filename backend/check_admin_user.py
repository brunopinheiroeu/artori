import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    print("❌ MONGODB_URI not found in environment variables")
    sys.exit(1)

def check_admin_user():
    """Check admin user in database"""
    
    print("🔍 Checking Admin User in Database")
    print("=" * 40)
    
    try:
        # Connect to MongoDB
        client = MongoClient(MONGODB_URI)
        db = client.artori
        
        # Test connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB")
        
        # Find admin user
        admin_user = db.users.find_one({"email": "admin@artori.app"})
        
        if admin_user:
            print(f"✅ Found admin user:")
            print(f"   ID: {admin_user['_id']}")
            print(f"   Name: {admin_user['name']}")
            print(f"   Email: {admin_user['email']}")
            print(f"   Role: {admin_user.get('role', 'NOT SET')}")
            print(f"   Status: {admin_user.get('status', 'NOT SET')}")
            print(f"   Created: {admin_user.get('created_at', 'NOT SET')}")
            print(f"   Updated: {admin_user.get('updated_at', 'NOT SET')}")
        else:
            print("❌ Admin user not found!")
            
        # Show all users with their roles
        print("\n📊 All Users:")
        users = list(db.users.find({}, {"name": 1, "email": 1, "role": 1}))
        for user in users:
            role = user.get('role', 'NOT SET')
            print(f"   {user['email']} - {user['name']} - Role: {role}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        if 'client' in locals():
            client.close()
    
    print("\n" + "=" * 40)

if __name__ == "__main__":
    check_admin_user()