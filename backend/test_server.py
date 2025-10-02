#!/usr/bin/env python3

import os
import logging
from datetime import datetime, timedelta
from typing import Optional

# Try importing with minimal dependencies
try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, EmailStr
    from passlib.context import CryptContext
    from pymongo import MongoClient
    from dotenv import load_dotenv
    
    print("✅ All imports successful!")
    
    # Load environment variables
    load_dotenv()
    
    app = FastAPI(title="Test API", version="1.0.0")
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Password hashing
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Test models
    class UserLogin(BaseModel):
        email: EmailStr
        password: str
    
    class TestResponse(BaseModel):
        message: str
        success: bool
    
    # Helper functions
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)
    
    @app.get("/")
    async def root():
        return {"message": "Test server is running", "status": "ok"}
    
    @app.get("/healthz")
    async def health_check():
        return {"status": "ok", "message": "Health check passed"}
    
    @app.post("/test-password", response_model=TestResponse)
    async def test_password_functionality(user_data: UserLogin):
        """Test password hashing and verification"""
        try:
            # Hash the password
            hashed = get_password_hash(user_data.password)
            
            # Verify the password
            is_valid = verify_password(user_data.password, hashed)
            
            return TestResponse(
                message=f"Password test successful. Hash: {hashed[:50]}..., Valid: {is_valid}",
                success=True
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Password test failed: {str(e)}")
    
    if __name__ == "__main__":
        import uvicorn
        print("🚀 Starting test server...")
        uvicorn.run(app, host="0.0.0.0", port=8001)
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Some dependencies are missing or incompatible")
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()