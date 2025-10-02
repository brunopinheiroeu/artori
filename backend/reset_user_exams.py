import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

def reset_user_exams():
    """Reset all users' selected_exam_id to None"""
    if not MONGODB_URI:
        print("MONGODB_URI not found in environment variables")
        return
    
    client = MongoClient(MONGODB_URI)
    db = client.artori
    
    # Update all users to have no selected exam
    result = db.users.update_many(
        {},  # Match all users
        {"$set": {"selected_exam_id": None}}
    )
    
    print(f"✅ Reset selected_exam_id for {result.modified_count} users")
    client.close()

if __name__ == "__main__":
    reset_user_exams()