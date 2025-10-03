#!/usr/bin/env python3

import os
import logging
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, status, Query
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client.artori

# Import the models from main.py
from main import (
    AdminQuestionResponse, AdminQuestionsListResponse, 
    QuestionType, QuestionDifficulty, QuestionStatus,
    Option, Explanation
)

def debug_questions_endpoint(subject_id: str, limit: int = 10, skip: int = 0):
    """Debug version of the admin questions endpoint"""
    
    try:
        # Build query filter
        query_filter = {"subject_id": ObjectId(subject_id)}
        
        # Get total count for pagination
        total_count = db.questions.count_documents(query_filter)
        logger.info(f"🔢 Total count: {total_count}")
        
        # Get paginated questions
        questions = list(db.questions.find(query_filter)
                        .sort("created_at", -1)
                        .skip(skip)
                        .limit(limit))
        
        logger.info(f"📋 Found {len(questions)} questions")
        
        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total_count + limit - 1) // limit  # Ceiling division
        
        logger.info(f"📄 Pagination: page={page}, page_size={limit}, total_pages={total_pages}")
        
        question_responses = []
        for question in questions:
            question_response = AdminQuestionResponse(
                id=str(question["_id"]),
                subject_id=str(question["subject_id"]),
                question=question["question"],
                question_type=QuestionType(question.get("question_type", "multiple_choice")),
                difficulty=QuestionDifficulty(question.get("difficulty", "medium")),
                options=[
                    Option(id=option["id"], text=option["text"])
                    for option in question["options"]
                ],
                correct_answer=question["correct_answer"],
                explanation=Explanation(
                    reasoning=question["explanation"]["reasoning"],
                    concept=question["explanation"]["concept"],
                    sources=question["explanation"]["sources"],
                    bias_check=question["explanation"]["bias_check"],
                    reflection=question["explanation"]["reflection"]
                ),
                tags=question.get("tags", []),
                status=QuestionStatus(question.get("status", "active")),
                duration=question.get("duration", 60),
                created_at=question.get("created_at", datetime.utcnow()),
                updated_at=question.get("updated_at", datetime.utcnow()),
                created_by=str(question["created_by"]) if question.get("created_by") else None
            )
            question_responses.append(question_response)
        
        logger.info(f"✅ Created {len(question_responses)} question response objects")
        
        # Create the response object
        response_obj = AdminQuestionsListResponse(
            questions=question_responses,
            total_count=total_count,
            page=page,
            page_size=limit,
            total_pages=total_pages
        )
        
        logger.info(f"✅ Created AdminQuestionsListResponse object")
        logger.info(f"   - questions: {len(response_obj.questions)} items")
        logger.info(f"   - total_count: {response_obj.total_count}")
        logger.info(f"   - page: {response_obj.page}")
        logger.info(f"   - page_size: {response_obj.page_size}")
        logger.info(f"   - total_pages: {response_obj.total_pages}")
        
        # Test serialization
        response_dict = response_obj.model_dump()
        logger.info(f"📦 Serialized response keys: {list(response_dict.keys())}")
        
        return response_obj
        
    except Exception as e:
        logger.error(f"❌ Error in debug_questions_endpoint: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        raise

if __name__ == "__main__":
    # Test with SAT Math subject
    subject_id = "68dfc765f13266ab2163673a"
    
    print("🔍 Testing questions endpoint logic...")
    result = debug_questions_endpoint(subject_id, limit=10, skip=0)
    
    print(f"\n📊 Result type: {type(result)}")
    print(f"📋 Result has questions: {hasattr(result, 'questions')}")
    
    if hasattr(result, 'questions'):
        print(f"✅ Questions count: {len(result.questions)}")
        print(f"✅ Total count: {result.total_count}")
        print(f"✅ Page: {result.page}")
        print(f"✅ Page size: {result.page_size}")
        print(f"✅ Total pages: {result.total_pages}")
    
    # Test JSON serialization
    import json
    try:
        result_dict = result.model_dump()
        json_str = json.dumps(result_dict, default=str)
        print(f"✅ JSON serialization successful, length: {len(json_str)}")
        
        # Parse back to verify structure
        parsed = json.loads(json_str)
        print(f"✅ Parsed JSON keys: {list(parsed.keys())}")
        
    except Exception as e:
        print(f"❌ JSON serialization failed: {e}")