#!/usr/bin/env python3
"""
Debug script to validate dashboard API differences between production and local
"""

import os
import logging
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def debug_dashboard_issue():
    """Debug the dashboard endpoint differences"""
    
    print("=== DASHBOARD DEBUG ANALYSIS ===")
    print()
    
    print("🔍 PRODUCTION ISSUE DIAGNOSIS:")
    print("- Production uses: api/index.py (Vercel serverless)")
    print("- Local development uses: backend/main.py (full FastAPI)")
    print()
    
    print("📊 DASHBOARD ENDPOINT COMPARISON:")
    print()
    
    print("1. PRODUCTION (api/index.py:633-701):")
    print("   ❌ ALWAYS returns user_progress=None")
    print("   ❌ NO database queries for progress data")
    print("   ❌ TODO comment: 'Add user progress tracking in future updates'")
    print("   ❌ Missing all progress calculation logic")
    print()
    
    print("2. LOCAL DEVELOPMENT (backend/main.py:1240-1354):")
    print("   ✅ Full progress calculation implementation")
    print("   ✅ Queries user_progress collection")
    print("   ✅ Calculates subject-level progress")
    print("   ✅ Computes overall progress and accuracy")
    print()
    
    print("🎯 ROOT CAUSE:")
    print("The production API is an incomplete/simplified version that never")
    print("calculates or returns user progress data, while the local version")
    print("has the full implementation.")
    print()
    
    print("🔧 SOLUTION:")
    print("The production api/index.py needs to be updated with the complete")
    print("progress calculation logic from backend/main.py lines 1300-1349")
    print()
    
    print("📋 MISSING FEATURES IN PRODUCTION:")
    print("- UserProgress model with subject_progress field")
    print("- Database queries to user_progress collection")
    print("- Progress percentage calculations")
    print("- Subject-level progress tracking")
    print("- Overall accuracy calculations")
    print("- Study time and streak tracking")
    print()
    
    print("🚨 IMPACT:")
    print("- Production dashboard shows 0% progress, 0 questions solved")
    print("- Local development shows actual progress (53%, 53 questions)")
    print("- Same database, different API implementations")
    print()

def validate_database_data():
    """Validate that progress data exists in the database"""
    
    mongodb_url = os.getenv("MONGODB_URL")
    if not mongodb_url:
        print("❌ MONGODB_URL not found in environment")
        return
    
    try:
        client = MongoClient(mongodb_url)
        db = client.artori
        
        print("=== DATABASE VALIDATION ===")
        print()
        
        # Check if user_progress collection exists and has data
        progress_count = db.user_progress.count_documents({})
        print(f"📊 user_progress collection: {progress_count} records")
        
        # Check for specific user (b3dsign)
        user = db.users.find_one({"email": {"$regex": "b3dsign", "$options": "i"}})
        if user:
            user_id = user["_id"]
            user_progress = list(db.user_progress.find({"user_id": user_id}))
            print(f"👤 User b3dsign progress records: {len(user_progress)}")
            
            if user_progress:
                total_questions = sum(p.get("questions_solved", 0) for p in user_progress)
                total_correct = sum(p.get("correct_answers", 0) for p in user_progress)
                print(f"📈 Total questions solved: {total_questions}")
                print(f"✅ Total correct answers: {total_correct}")
                print(f"📊 Overall accuracy: {(total_correct/total_questions*100):.1f}%" if total_questions > 0 else "N/A")
            else:
                print("❌ No progress data found for user b3dsign")
        else:
            print("❌ User b3dsign not found in database")
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

if __name__ == "__main__":
    debug_dashboard_issue()
    print()
    validate_database_data()