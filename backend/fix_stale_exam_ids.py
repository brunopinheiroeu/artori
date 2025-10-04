#!/usr/bin/env python3
"""
Cleanup script to fix users with invalid selected_exam_id references
"""

import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def fix_stale_exam_ids():
    """Fix users with invalid selected_exam_id references"""
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        print("❌ MONGODB_URI not found in environment variables")
        return
    
    try:
        client = MongoClient(mongodb_uri)
        db = client.artori
        
        # Test connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB successfully")
        
        # Known problematic exam ID
        problematic_exam_id = "68de40c47781966b636c843f"
        
        # Valid exam IDs (from the task description)
        valid_exam_ids = {
            "SAT (USA)": "68dfc765f13266ab21636736",
            "ENEM (Brazil)": "68dfc765f13266ab21636737", 
            "Leaving Certificate (Ireland)": "68dfc765f13266ab21636738",
            "Selectividad (Spain)": "68dfc765f13266ab21636739"
        }
        
        print(f"\n🔍 Looking for users with invalid exam ID references...")
        
        # Find all users with selected_exam_id
        users_with_exams = list(db.users.find({"selected_exam_id": {"$exists": True, "$ne": None}}))
        
        if not users_with_exams:
            print("❌ No users have selected exam IDs")
            return
        
        print(f"📊 Found {len(users_with_exams)} users with selected exam IDs")
        
        # Check each user's selected_exam_id
        users_to_fix = []
        valid_users = []
        
        for user in users_with_exams:
            selected_exam_id = user.get('selected_exam_id')
            user_info = f"{user['name']} ({user['email']})"
            
            if selected_exam_id:
                # Check if the selected exam exists
                try:
                    if isinstance(selected_exam_id, str):
                        exam_object_id = ObjectId(selected_exam_id)
                    else:
                        exam_object_id = selected_exam_id
                    
                    exam = db.exams.find_one({"_id": exam_object_id})
                    
                    if exam:
                        print(f"✅ {user_info} - Valid exam: {exam['name']}")
                        valid_users.append(user)
                    else:
                        print(f"❌ {user_info} - Invalid exam ID: {selected_exam_id}")
                        users_to_fix.append(user)
                        
                except Exception as e:
                    print(f"❌ {user_info} - Error checking exam ID {selected_exam_id}: {e}")
                    users_to_fix.append(user)
        
        if not users_to_fix:
            print("\n🎉 No users found with invalid exam IDs!")
            return
        
        print(f"\n🔧 Found {len(users_to_fix)} users that need fixing:")
        for user in users_to_fix:
            print(f"  - {user['name']} ({user['email']}) - ID: {user.get('selected_exam_id')}")
        
        # Ask for confirmation before making changes
        print(f"\n⚠️  This will update {len(users_to_fix)} users.")
        print("Options:")
        print("1. Set selected_exam_id to null (force re-selection)")
        print("2. Set selected_exam_id to SAT (USA) as default")
        print("3. Cancel operation")
        
        choice = input("\nEnter your choice (1/2/3): ").strip()
        
        if choice == "3":
            print("❌ Operation cancelled")
            return
        elif choice not in ["1", "2"]:
            print("❌ Invalid choice. Operation cancelled")
            return
        
        # Perform the fix
        updates_made = 0
        
        for user in users_to_fix:
            try:
                if choice == "1":
                    # Set to null (force re-selection)
                    result = db.users.update_one(
                        {"_id": user["_id"]},
                        {"$unset": {"selected_exam_id": ""}}
                    )
                    new_value = "null (removed)"
                elif choice == "2":
                    # Set to SAT as default
                    sat_id = ObjectId(valid_exam_ids["SAT (USA)"])
                    result = db.users.update_one(
                        {"_id": user["_id"]},
                        {"$set": {"selected_exam_id": sat_id}}
                    )
                    new_value = f"SAT (USA) - {sat_id}"
                
                if result.modified_count > 0:
                    print(f"✅ Updated {user['name']} ({user['email']}) - set to {new_value}")
                    updates_made += 1
                else:
                    print(f"⚠️  No changes made for {user['name']} ({user['email']})")
                    
            except Exception as e:
                print(f"❌ Error updating {user['name']} ({user['email']}): {e}")
        
        print(f"\n🎉 Successfully updated {updates_made} users!")
        
        # Verify the fix
        print(f"\n🔍 Verifying the fix...")
        remaining_invalid = list(db.users.find({
            "selected_exam_id": {"$exists": True, "$ne": None}
        }))
        
        invalid_count = 0
        for user in remaining_invalid:
            selected_exam_id = user.get('selected_exam_id')
            if selected_exam_id:
                try:
                    if isinstance(selected_exam_id, str):
                        exam_object_id = ObjectId(selected_exam_id)
                    else:
                        exam_object_id = selected_exam_id
                    
                    exam = db.exams.find_one({"_id": exam_object_id})
                    if not exam:
                        invalid_count += 1
                        print(f"❌ Still invalid: {user['name']} ({user['email']}) - {selected_exam_id}")
                except:
                    invalid_count += 1
                    print(f"❌ Still invalid: {user['name']} ({user['email']}) - {selected_exam_id}")
        
        if invalid_count == 0:
            print("✅ All users now have valid exam ID references!")
        else:
            print(f"⚠️  {invalid_count} users still have invalid exam ID references")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

if __name__ == "__main__":
    fix_stale_exam_ids()