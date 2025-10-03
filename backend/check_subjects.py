#!/usr/bin/env python3

import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_subjects():
    """Check what subjects exist in the database"""
    
    MONGODB_URI = os.getenv("MONGODB_URI")
    if not MONGODB_URI:
        print("❌ MONGODB_URI not found")
        return
    
    try:
        client = MongoClient(MONGODB_URI)
        db = client.artori
        
        print("🔍 Checking exams and subjects in database...")
        
        # Get all exams
        exams = list(db.exams.find({}))
        print(f"📚 Found {len(exams)} exams")
        
        for exam in exams:
            print(f"\n📖 Exam: {exam['name']} ({exam['country']})")
            print(f"   ID: {exam['_id']}")
            
            subjects = exam.get('subjects', [])
            print(f"   📋 Subjects ({len(subjects)}):")
            
            for subject in subjects:
                subject_id = subject['_id']
                subject_name = subject['name']
                
                # Count questions for this subject
                question_count = db.questions.count_documents({"subject_id": ObjectId(subject_id)})
                
                print(f"      - {subject_name}")
                print(f"        ID: {subject_id}")
                print(f"        Questions: {question_count}")
        
        print(f"\n🔢 Total questions in database: {db.questions.count_documents({})}")
        
        # Find a subject with questions
        subjects_with_questions = []
        for exam in exams:
            for subject in exam.get('subjects', []):
                subject_id = subject['_id']
                question_count = db.questions.count_documents({"subject_id": ObjectId(subject_id)})
                if question_count > 0:
                    subjects_with_questions.append({
                        'exam_name': exam['name'],
                        'subject_name': subject['name'],
                        'subject_id': str(subject_id),
                        'question_count': question_count
                    })
        
        if subjects_with_questions:
            print(f"\n✅ Found {len(subjects_with_questions)} subjects with questions:")
            for subj in subjects_with_questions:
                print(f"   - {subj['exam_name']} > {subj['subject_name']}: {subj['question_count']} questions (ID: {subj['subject_id']})")
            
            return subjects_with_questions[0]['subject_id']  # Return first valid subject ID
        else:
            print("\n❌ No subjects found with questions")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    valid_subject_id = check_subjects()
    if valid_subject_id:
        print(f"\n🎯 Use this subject ID for testing: {valid_subject_id}")