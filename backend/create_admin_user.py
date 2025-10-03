import os
import sys
from datetime import datetime
from pymongo import MongoClient
from passlib.context import CryptContext
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    print("❌ MONGODB_URI not found in environment variables")
    sys.exit(1)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user():
    """Create admin and super admin test users"""
    
    print("🔧 Creating Admin Users")
    print("=" * 40)
    
    try:
        # Connect to MongoDB
        client = MongoClient(MONGODB_URI)
        db = client.artori
        
        # Test connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB")
        
        # Admin user data
        admin_users = [
            {
                "name": "Admin User",
                "email": "admin@artori.app",
                "password": "AdminPass123!",
                "role": "admin"
            },
            {
                "name": "Super Admin",
                "email": "superadmin@artori.app", 
                "password": "SuperAdminPass123!",
                "role": "super_admin"
            }
        ]
        
        for user_data in admin_users:
            # Check if user already exists
            existing_user = db.users.find_one({"email": user_data["email"]})
            
            if existing_user:
                print(f"⚠️  User {user_data['email']} already exists, updating role...")
                # Update existing user to admin role
                db.users.update_one(
                    {"email": user_data["email"]},
                    {
                        "$set": {
                            "role": user_data["role"],
                            "status": "active",
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                print(f"✅ Updated {user_data['email']} to {user_data['role']}")
            else:
                # Create new admin user
                hashed_password = pwd_context.hash(user_data["password"])
                
                user_doc = {
                    "name": user_data["name"],
                    "email": user_data["email"],
                    "password": hashed_password,
                    "role": user_data["role"],
                    "status": "active",
                    "selected_exam_id": None,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                    "login_count": 0
                }
                
                result = db.users.insert_one(user_doc)
                print(f"✅ Created {user_data['role']}: {user_data['email']}")
                print(f"   Password: {user_data['password']}")
        
        print("\n📋 Admin Login Credentials:")
        print("   Admin: admin@artori.app / AdminPass123!")
        print("   Super Admin: superadmin@artori.app / SuperAdminPass123!")
        
        # Show user count by role
        print("\n📊 User Statistics:")
        for role in ["student", "admin", "super_admin"]:
            count = db.users.count_documents({"role": role})
            print(f"   {role}: {count} users")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        if 'client' in locals():
            client.close()
    
    print("\n" + "=" * 40)

if __name__ == "__main__":
    create_admin_user()