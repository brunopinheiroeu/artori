#!/usr/bin/env python3
"""
Debug script to check questions and subject ID linking
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId

# Load environment variables
load_dotenv()

def debug_questions():
    """Debug questions and subject linking"""
    mongodb_uri = os.getenv("MONGODB_URI")
    client = MongoClient(mongodb_uri)
    db = client.artori
    
    print("=== DEBUGGING QUESTIONS AND SUBJECT LINKING ===\n")
    
    # 1. Check total questions count
    total_questions = db.questions.count_documents({})
    print(f"📊 Total questions in database: {total_questions}")
    
    # 2. Check ENEM exam and subjects
    enem_exam = db.exams.find_one({"name": "ENEM"})
    if enem_exam:
        print(f"\n📚 ENEM Exam ID: {enem_exam['_id']}")
        print(f"📚 ENEM Subjects:")
        for subject in enem_exam['subjects']:
            subject_id = subject['_id']
            subject_name = subject['name']
            
            # Count questions for this subject
            question_count = db.questions.count_documents({"subject_id": subject_id})
            print(f"  - {subject_name} (ID: {subject_id}): {question_count} questions")
            
            # Show a sample question for this subject
            sample_question = db.questions.find_one({"subject_id": subject_id})
            if sample_question:
                print(f"    Sample question: {sample_question['question'][:50]}...")
            else:
                print(f"    ❌ No questions found for subject ID: {subject_id}")
    
    # 3. Check what subject_ids exist in questions collection
    print(f"\n🔍 Unique subject_ids in questions collection:")
    subject_ids_in_questions = db.questions.distinct("subject_id")
    for sid in subject_ids_in_questions:
        count = db.questions.count_documents({"subject_id": sid})
        print(f"  - {sid}: {count} questions")
    
    # 4. Check the specific subject ID from the API call
    api_subject_id = "68dfc765f13266ab2163673d"
    try:
        api_subject_oid = ObjectId(api_subject_id)
        api_questions = db.questions.count_documents({"subject_id": api_subject_oid})
        print(f"\n🎯 Questions for API subject ID {api_subject_id}: {api_questions}")
        
        # Check if this subject ID exists in any exam
        exam_with_subject = db.exams.find_one({"subjects._id": api_subject_oid})
        if exam_with_subject:
            subject_info = next((s for s in exam_with_subject['subjects'] if s['_id'] == api_subject_oid), None)
            print(f"✅ Subject found in exam: {exam_with_subject['name']} - {subject_info['name']}")
        else:
            print(f"❌ Subject ID {api_subject_id} not found in any exam")
            
    except Exception as e:
        print(f"❌ Error checking API subject ID: {e}")
    
    client.close()

if __name__ == "__main__":
    debug_questions()