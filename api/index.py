import os
import logging
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from pymongo import MongoClient
from bson import ObjectId

# Configure logging for Vercel serverless environment
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("=== VERCEL SERVERLESS FUNCTION STARTING ===")

# Log environment variables (without sensitive values)
logger.info("=== ENVIRONMENT VARIABLES CHECK ===")
env_vars = ['MONGODB_URI', 'MONGODB_URL', 'JWT_SECRET', 'JWT_ALGORITHM', 'JWT_EXPIRES_IN_MINUTES', 'OPENAI_API_KEY']
for var in env_vars:
    value = os.getenv(var)
    if value:
        if var in ['MONGODB_URI', 'MONGODB_URL', 'JWT_SECRET', 'OPENAI_API_KEY']:
            logger.info(f"✅ {var}: Present (length: {len(value)})")
        else:
            logger.info(f"✅ {var}: {value}")
    else:
        logger.error(f"❌ {var}: MISSING")

# Check if at least one MongoDB variable is present
mongodb_uri = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
if mongodb_uri:
    mongodb_var = "MONGODB_URI" if os.getenv("MONGODB_URI") else "MONGODB_URL"
    logger.info(f"✅ MongoDB connection available via {mongodb_var}")
else:
    logger.error("❌ CRITICAL: Neither MONGODB_URI nor MONGODB_URL is available!")

# Initialize FastAPI app
app = FastAPI(title="artori.app API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://artori.app",
        "https://www.artori.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
MONGODB_URI = mongodb_uri
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_IN_MINUTES = int(os.getenv("JWT_EXPIRES_IN_MINUTES", "30"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
client = None
db = None

if MONGODB_URI:
    try:
        logger.info("=== MONGODB CONNECTION ATTEMPT ===")
        logger.info("Attempting to connect to MongoDB...")
        
        # Configure MongoDB client for Vercel serverless environment
        client = MongoClient(
            MONGODB_URI,
            tls=True,
            tlsAllowInvalidCertificates=False,
            maxPoolSize=1,
            minPoolSize=0,
            maxIdleTimeMS=10000,
            serverSelectionTimeoutMS=3000,
            connectTimeoutMS=5000,
            socketTimeoutMS=10000,
            retryWrites=True,
            retryReads=True
        )
        
        logger.info("MongoDB client created, testing connection...")
        db = client.artori
        
        # Test the connection
        client.admin.command('ping')
        logger.info("✅ MongoDB connection successful!")
        
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        client = None
        db = None
else:
    logger.error("❌ Neither MONGODB_URI nor MONGODB_URL found in environment variables")

# Pydantic models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
        plain_password = password_bytes.decode('utf-8', errors='ignore')
    
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRES_IN_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str):
    """Get user by email from database"""
    if db is None:
        return None
    return db.users.find_one({"email": email})

# Routes
@app.get("/healthz")
async def health_check():
    """Health check endpoint"""
    try:
        logger.info("Health check endpoint called")
        db_status = "connected" if db is not None else "disconnected"
        
        if db is not None:
            # Test database connectivity
            collections = db.list_collection_names()
            logger.info(f"Database collections: {collections}")
        
        response = {"status": "ok", "database": db_status}
        logger.info(f"Health check response: {response}")
        return response
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "artori.app API is running"}

@app.post("/api/v1/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """Authenticate user and return JWT token"""
    logger.info("=== LOGIN ATTEMPT DEBUG ===")
    logger.info(f"Login attempt for email: {user_data.email}")
    
    # Debug: Check database connection status
    if db is None:
        logger.error("❌ LOGIN FAILED: Database connection is None")
        mongodb_uri_present = bool(os.getenv("MONGODB_URI"))
        mongodb_url_present = bool(os.getenv("MONGODB_URL"))
        logger.error(f"   MONGODB_URI status: {'Present' if mongodb_uri_present else 'MISSING'}")
        logger.error(f"   MONGODB_URL status: {'Present' if mongodb_url_present else 'MISSING'}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available - check MONGODB_URI environment variable"
        )
    else:
        logger.info("✅ Database connection is available")
    
    # Debug: Test database connectivity
    try:
        logger.info("Testing database connectivity...")
        db.users.count_documents({}, limit=1)
        logger.info("✅ Database connectivity test passed")
    except Exception as db_error:
        logger.error(f"❌ LOGIN FAILED: Database connectivity test failed: {db_error}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connectivity error: {str(db_error)}"
        )
    
    # Debug: Check JWT_SECRET availability
    jwt_secret_available = bool(JWT_SECRET)
    logger.info(f"JWT_SECRET availability: {'✅ Available' if jwt_secret_available else '❌ MISSING'}")
    if not jwt_secret_available:
        logger.error("❌ LOGIN FAILED: JWT_SECRET environment variable is missing")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="JWT configuration error - check JWT_SECRET environment variable"
        )
    
    # Get user by email
    try:
        logger.info(f"Looking up user by email: {user_data.email}")
        user = get_user_by_email(user_data.email)
        if not user:
            logger.info(f"❌ User not found for email: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        else:
            logger.info(f"✅ User found: {user.get('name', 'Unknown')} (ID: {user['_id']})")
    except HTTPException:
        raise
    except Exception as user_lookup_error:
        logger.error(f"❌ LOGIN FAILED: User lookup error: {user_lookup_error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"User lookup error: {str(user_lookup_error)}"
        )
    
    # Verify password
    try:
        logger.info("Verifying password...")
        password_valid = verify_password(user_data.password, user["password"])
        if not password_valid:
            logger.info("❌ Password verification failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        else:
            logger.info("✅ Password verification successful")
    except HTTPException:
        raise
    except Exception as password_error:
        logger.error(f"❌ LOGIN FAILED: Password verification error: {password_error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password verification error: {str(password_error)}"
        )
    
    # Update login tracking
    try:
        logger.info("Updating login tracking...")
        db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {"last_login": datetime.utcnow()},
                "$inc": {"login_count": 1}
            }
        )
        logger.info("✅ Login tracking updated successfully")
    except Exception as tracking_error:
        logger.error(f"⚠️ LOGIN WARNING: Login tracking update failed: {tracking_error}")
    
    # Create access token
    try:
        logger.info("Creating JWT access token...")
        access_token = create_access_token(data={"sub": str(user["_id"])})
        logger.info("✅ JWT access token created successfully")
        logger.info("=== LOGIN SUCCESS ===")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as token_error:
        logger.error(f"❌ LOGIN FAILED: JWT token creation error: {token_error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token creation error: {str(token_error)}"
        )

logger.info("=== VERCEL SERVERLESS FUNCTION READY ===")

# Export the FastAPI app for Vercel's Python runtime
# This is the key line that Vercel needs