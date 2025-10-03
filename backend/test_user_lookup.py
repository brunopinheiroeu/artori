import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")

def get_user_by_id(user_id: str):
    """Get user by ID from database - same as backend function"""
    client = MongoClient(MONGODB_URI)
    db = client.artori
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
        client.close()
        return user
    except:
        client.close()
        return None

def test_user_lookup():
    """Test user lookup function directly"""
    
    print("🔍 Testing User Lookup Function")
    print("=" * 40)
    
    try:
        # Connect to MongoDB
        client = MongoClient(MONGODB_URI)
        db = client.artori
        
        # Find admin user to get the ID
        admin_user = db.users.find_one({"email": "admin@artori.app"})
        
        if admin_user:
            user_id = str(admin_user['_id'])
            print(f"✅ Found admin user with ID: {user_id}")
            
            # Test the get_user_by_id function (same as backend)
            looked_up_user = get_user_by_id(user_id)
            
            if looked_up_user:
                print(f"✅ User lookup successful:")
                print(f"   ID: {looked_up_user['_id']}")
                print(f"   Name: {looked_up_user['name']}")
                print(f"   Email: {looked_up_user['email']}")
                print(f"   Role: {looked_up_user.get('role', 'NOT SET')}")
                print(f"   Role type: {type(looked_up_user.get('role'))}")
                
                # Test the exact logic from the backend
                role_value = looked_up_user.get("role", "student")
                print(f"   Backend logic result: {role_value}")
                
                # Test if the role is being lost somewhere
                if looked_up_user.get("role") == "admin":
                    print("✅ Role is correctly 'admin'")
                else:
                    print(f"❌ Role is not 'admin', it's: {looked_up_user.get('role')}")
                    
            else:
                print("❌ User lookup failed!")
        else:
            print("❌ Admin user not found!")
            
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 40)

if __name__ == "__main__":
    test_user_lookup()