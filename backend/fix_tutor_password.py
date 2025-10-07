#!/usr/bin/env python3
"""
Script to fix the tutor password by properly hashing it.
"""

import os
import sys
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from passlib.context import CryptContext
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

def get_password_hash(password: str) -> str:
    """Hash a password with proper byte-level truncation for bcrypt compatibility"""
    logger.info(f"Hashing password - Length: {len(password)} chars, {len(password.encode('utf-8'))} bytes")
    
    # Truncate password to 72 bytes for bcrypt compatibility (not just characters)
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        logger.info(f"Truncating password from {len(password_bytes)} bytes to 72 bytes")
        # Truncate to 72 bytes, being careful not to split multi-byte characters
        password_bytes = password_bytes[:72]
        # Decode back, ignoring any incomplete characters at the end
        password = password_bytes.decode('utf-8', errors='ignore')
        logger.info(f"Truncated password - New length: {len(password)} chars, {len(password.encode('utf-8'))} bytes")
    
    try:
        logger.info("Calling pwd_context.hash()...")
        hashed = pwd_context.hash(password)
        logger.info("pwd_context.hash() completed successfully")
        return hashed
    except Exception as e:
        logger.error(f"pwd_context.hash() failed: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Password being hashed: '{password}' (length: {len(password)} chars, {len(password.encode('utf-8'))} bytes)")
        raise

def fix_tutor_password(db):
    """Fix the tutor password by properly hashing it"""
    try:
        logger.info("Fixing tutor password...")
        
        # Find the tutor user
        tutor_user = db.users.find_one({"email": "sarah.tutor@artori.com"})
        if not tutor_user:
            logger.error("Tutor user not found")
            return False
        
        logger.info(f"Found tutor user: {tutor_user['name']} (ID: {tutor_user['_id']})")
        
        # Hash the password properly
        password = "TutorTest123!"
        hashed_password = get_password_hash(password)
        
        # Update the user with the properly hashed password
        result = db.users.update_one(
            {"_id": tutor_user["_id"]},
            {
                "$set": {
                    "password": hashed_password,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            logger.info("✅ Tutor password updated successfully!")
            logger.info(f"You can now log in with: sarah.tutor@artori.com / {password}")
            return True
        else:
            logger.error("❌ Failed to update tutor password")
            return False
            
    except Exception as e:
        logger.error(f"❌ Failed to fix tutor password: {e}")
        return False

def main():
    """Main function"""
    logger.info("=== Fix Tutor Password Script ===")
    
    # Connect to database
    client, db = connect_to_database()
    if client is None or db is None:
        logger.error("Failed to connect to database. Exiting.")
        sys.exit(1)
    
    try:
        # Fix the password
        success = fix_tutor_password(db)
        
        if success:
            logger.info("🎉 Password fix completed successfully!")
        else:
            logger.error("Password fix failed. Please check the logs above.")
            sys.exit(1)
            
    finally:
        # Close database connection
        client.close()
        logger.info("Database connection closed.")

if __name__ == "__main__":
    main()