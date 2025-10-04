#!/usr/bin/env python3
"""
Debug script to check for the specific exam ID causing 404 errors
"""

import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def debug_exam_lookup():
    """Check for the specific exam ID and list all available exams"""
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
        
        # The problematic exam ID from the error
        problematic_exam_id = "68de40c47781966b636c843f"
        
        print(f"\n🔍 Searching for exam ID: {problematic_exam_id}")
        
        # Try to find the exam with this ID
        try:
            exam = db.exams.find_one({"_id": ObjectId(problematic_exam_id)})
            if exam:
                print(f"✅ Found exam: {exam['name']} ({exam['country']})")
            else:
                print(f"❌ Exam with ID {problematic_exam_id} NOT FOUND")
        except Exception as e:
            print(f"❌ Error looking up exam ID: {e}")
        
        # List all available exams
        print(f"\n📚 All available exams in database:")
        exams = list(db.exams.find({}))
        
        if not exams:
            print("❌ No exams found in database!")
        else:
            for exam in exams:
                print(f"  - {exam['name']} ({exam['country']}) - ID: {exam['_id']}")
                print(f"    Subjects: {len(exam.get('subjects', []))}")
                for subject in exam.get('subjects', []):
                    print(f"      * {subject['name']} - ID: {subject['_id']}")
        
        # Check if there are any users with selected_exam_id
        print(f"\n👥 Users with selected exam IDs:")
        users_with_exams = list(db.users.find({"selected_exam_id": {"$exists": True, "$ne": None}}))
        
        if not users_with_exams:
            print("❌ No users have selected exam IDs")
        else:
            for user in users_with_exams:
                selected_exam_id = user.get('selected_exam_id')
                print(f"  - {user['name']} ({user['email']}) - Selected Exam ID: {selected_exam_id}")
                
                # Check if the selected exam exists
                if selected_exam_id:
                    exam = db.exams.find_one({"_id": selected_exam_id})
                    if exam:
                        print(f"    ✅ Exam exists: {exam['name']}")
                    else:
                        print(f"    ❌ Exam with ID {selected_exam_id} does NOT exist!")
        
        # Check questions count
        print(f"\n❓ Questions in database:")
        questions_count = db.questions.count_documents({})
        print(f"  Total questions: {questions_count}")
        
        if questions_count > 0:
            # Group by subject
            pipeline = [
                {"$group": {"_id": "$subject_id", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ]
            subject_counts = list(db.questions.aggregate(pipeline))
            
            for subject_count in subject_counts:
                subject_id = subject_count["_id"]
                count = subject_count["count"]
                
                # Find which exam this subject belongs to
                exam = db.exams.find_one({"subjects._id": subject_id})
                if exam:
                    subject = next((s for s in exam["subjects"] if s["_id"] == subject_id), None)
                    if subject:
                        print(f"  - {exam['name']} > {subject['name']}: {count} questions")
                else:
                    print(f"  - Unknown subject {subject_id}: {count} questions")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

if __name__ == "__main__":
    debug_exam_lookup()