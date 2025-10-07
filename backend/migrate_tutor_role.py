#!/usr/bin/env python3
"""
Database migration script to add tutor role support to existing users.
This script will:
1. Add tutor role to the system
2. Initialize tutor_data field for existing users who might become tutors
3. Create sample tutor users for testing
"""

import os
import sys
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def connect_to_database():
    """Connect to MongoDB database"""
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        logger.error("MONGODB_URI environment variable not found")
        return None, None
    
    try:
        client = MongoClient(
            mongodb_uri,
            tls=True,
            tlsAllowInvalidCertificates=False,
            maxPoolSize=10,
            minPoolSize=1,
            maxIdleTimeMS=30000,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            socketTimeoutMS=20000,
            retryWrites=True,
            retryReads=True
        )
        db = client.artori
        # Test connection
        client.admin.command('ping')
        logger.info("✅ Connected to MongoDB successfully")
        return client, db
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        return None, None

def migrate_tutor_role(db):
    """Add tutor role support to the database"""
    try:
        logger.info("Starting tutor role migration...")
        
        # 1. Update existing users to ensure they have the tutor_data field initialized
        logger.info("Initializing tutor_data field for existing users...")
        result = db.users.update_many(
            {"tutor_data": {"$exists": False}},
            {"$set": {"tutor_data": None}}
        )
        logger.info(f"Updated {result.modified_count} users with tutor_data field")
        
        # 2. Create a sample tutor user for testing
        logger.info("Creating sample tutor user...")
        sample_tutor = {
            "name": "Dr. Sarah Johnson",
            "email": "sarah.tutor@artori.com",
            "password": "$2b$12$LQv3c1yqBwEHxPiHweLOiOX9jGoaRQzTpwHrZgqJkFqg8qKBGKTCS",  # password: TutorTest123!
            "role": "tutor",
            "status": "active",
            "selected_exam_id": None,
            "tutor_data": {
                "subjects": ["Mathematics", "Physics", "Chemistry"],
                "qualifications": [
                    "PhD in Mathematics - MIT",
                    "MSc in Physics - Stanford University",
                    "Certified Online Tutor - 5 years experience"
                ],
                "bio": "Experienced mathematics and science tutor with over 5 years of online teaching experience. Specialized in helping students prepare for competitive exams.",
                "availability": {
                    "monday": ["09:00-12:00", "14:00-18:00"],
                    "tuesday": ["09:00-12:00", "14:00-18:00"],
                    "wednesday": ["09:00-12:00", "14:00-18:00"],
                    "thursday": ["09:00-12:00", "14:00-18:00"],
                    "friday": ["09:00-12:00", "14:00-16:00"],
                    "saturday": ["10:00-14:00"],
                    "sunday": []
                },
                "hourly_rate": 45.0,
                "experience_years": 5,
                "languages": ["English", "Spanish"],
                "rating": 4.8,
                "total_sessions": 127
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "login_count": 0
        }
        
        # Check if sample tutor already exists
        existing_tutor = db.users.find_one({"email": sample_tutor["email"]})
        if not existing_tutor:
            result = db.users.insert_one(sample_tutor)
            logger.info(f"✅ Created sample tutor user with ID: {result.inserted_id}")
        else:
            logger.info("Sample tutor user already exists, skipping creation")
        
        # 3. Create indexes for tutor-related queries
        logger.info("Creating indexes for tutor queries...")
        db.users.create_index([("role", 1), ("tutor_data.subjects", 1)])
        db.users.create_index([("tutor_data.rating", -1)])
        logger.info("✅ Created tutor-related indexes")
        
        logger.info("✅ Tutor role migration completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        return False

def main():
    """Main migration function"""
    logger.info("=== Tutor Role Migration Script ===")
    
    # Connect to database
    client, db = connect_to_database()
    if client is None or db is None:
        logger.error("Failed to connect to database. Exiting.")
        sys.exit(1)
    
    try:
        # Run migration
        success = migrate_tutor_role(db)
        
        if success:
            logger.info("🎉 Migration completed successfully!")
            logger.info("You can now:")
            logger.info("1. Log in as a tutor using: sarah.tutor@artori.com / TutorTest123!")
            logger.info("2. Create new tutor users through the admin panel")
            logger.info("3. Convert existing users to tutors by updating their role")
        else:
            logger.error("Migration failed. Please check the logs above.")
            sys.exit(1)
            
    finally:
        # Close database connection
        client.close()
        logger.info("Database connection closed.")

if __name__ == "__main__":
    main()