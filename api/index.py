import os
import logging
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from pymongo import MongoClient
from bson import ObjectId
from mangum import Mangum

# Configure logging for Vercel serverless environment
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("=== VERCEL SERVERLESS FUNCTION STARTING ===")

# Log environment variables (without sensitive values)
logger.info("=== ENVIRONMENT VARIABLES CHECK ===")
env_vars = ['MONGODB_URL', 'JWT_SECRET', 'JWT_ALGORITHM', 'JWT_EXPIRES_IN_MINUTES', 'OPENAI_API_KEY']
for var in env_vars:
    value = os.getenv(var)
    if value:
        if var in ['MONGODB_URL', 'JWT_SECRET', 'OPENAI_API_KEY']:
            logger.info(f"✅ {var}: Present (length: {len(value)})")
        else:
            logger.info(f"✅ {var}: {value}")
    else:
        logger.error(f"❌ {var}: MISSING")

# Check MongoDB URL variable
mongodb_url = os.getenv("MONGODB_URL")
if mongodb_url:
    logger.info("✅ MongoDB connection available via MONGODB_URL")
else:
    logger.error("❌ CRITICAL: MONGODB_URL is not available!")

# Initialize FastAPI app
app = FastAPI(title="artori.app API", version="1.0.0")

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "https://artori.app,http://localhost:3000").split(",")
# Clean up any whitespace from the origins
allowed_origins = [origin.strip() for origin in allowed_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
MONGODB_URL = mongodb_url
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_IN_MINUTES = int(os.getenv("JWT_EXPIRES_IN_MINUTES", "30"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Security
security = HTTPBearer()

# MongoDB connection
client = None
db = None

if MONGODB_URL:
    try:
        logger.info("=== MONGODB CONNECTION ATTEMPT ===")
        logger.info("Attempting to connect to MongoDB...")
        
        # Configure MongoDB client for Vercel serverless environment
        client = MongoClient(
            MONGODB_URL,
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
    logger.error("❌ MONGODB_URL not found in environment variables")

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TutorData(BaseModel):
    subjects: List[str] = []
    qualifications: List[str] = []
    bio: Optional[str] = None
    availability: Dict[str, Any] = {}
    hourly_rate: Optional[float] = None
    experience_years: Optional[int] = None
    languages: List[str] = []
    rating: Optional[float] = None
    total_sessions: int = 0

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: Optional[str] = "student"
    selected_exam_id: Optional[str] = None
    tutor_data: Optional[TutorData] = None
    created_at: datetime
    updated_at: datetime

# Exam-related models
class Subject(BaseModel):
    id: str
    name: str
    description: str
    total_questions: Optional[int] = None
    duration: Optional[str] = None
    icon: Optional[str] = None
    gradient: Optional[str] = None
    bgColor: Optional[str] = None

class Exam(BaseModel):
    id: str
    name: str
    country: str
    description: str
    subjects: List[Subject]
    total_questions: Optional[int] = None
    gradient: Optional[str] = None
    borderColor: Optional[str] = None
    bgColor: Optional[str] = None
    flag: Optional[str] = None

class ExamResponse(BaseModel):
    id: str
    name: str
    country: str
    description: str
    subjects: List[Subject]
    total_questions: Optional[int] = None
    gradient: Optional[str] = None
    borderColor: Optional[str] = None
    bgColor: Optional[str] = None
    flag: Optional[str] = None

class ExamListResponse(BaseModel):
    id: str
    name: str
    country: str
    description: str
    total_questions: Optional[int] = None
    gradient: Optional[str] = None
    borderColor: Optional[str] = None
    bgColor: Optional[str] = None
    flag: Optional[str] = None

class UserExamSelection(BaseModel):
    exam_id: str

# Helper functions
def get_password_hash(password: str) -> str:
    """Hash a password"""
    # Truncate password to 72 bytes for bcrypt compatibility
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
        password = password_bytes.decode('utf-8', errors='ignore')
    
    return pwd_context.hash(password)

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

def get_user_by_id(user_id: str):
    """Get user by ID from database"""
    if db is None:
        return None
    try:
        return db.users.find_one({"_id": ObjectId(user_id)})
    except:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    
    return user

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
        mongodb_url_present = bool(os.getenv("MONGODB_URL"))
        logger.error(f"   MONGODB_URL status: {'Present' if mongodb_url_present else 'MISSING'}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available - check MONGODB_URL environment variable"
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

@app.get("/api/v1/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current authenticated user's details"""
    # Explicitly handle the role field to ensure it's not None
    user_role = current_user.get("role")
    if user_role is None:
        user_role = "student"
    
    # Handle tutor data if user is a tutor
    tutor_data = None
    if user_role == "tutor" and current_user.get("tutor_data"):
        tutor_data = TutorData(**current_user["tutor_data"])
    
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        role=user_role,
        selected_exam_id=str(current_user["selected_exam_id"]) if current_user.get("selected_exam_id") else None,
        tutor_data=tutor_data,
        created_at=current_user["created_at"],
        updated_at=current_user["updated_at"]
    )

@app.post("/api/v1/auth/signup", response_model=Token)
async def signup(user_data: UserCreate):
    """Register a new user"""
    logger.info(f"Signup attempt for email: {user_data.email}")
    
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    # Check if user already exists
    existing_user = get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    try:
        hashed_password = get_password_hash(user_data.password)
    except Exception as e:
        logger.error(f"Password hashing failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password processing failed"
        )
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "role": "student",  # Default role for regular signup
        "status": "active",  # Default status for new users
        "selected_exam_id": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "login_count": 0
    }
    
    # Insert user into database
    result = db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/exams", response_model=List[ExamListResponse])
async def get_exams():
    """Get a list of all available exams"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    exams = list(db.exams.find({}))
    return [
        ExamListResponse(
            id=str(exam["_id"]),
            name=exam["name"],
            country=exam["country"],
            description=exam["description"],
            total_questions=exam.get("total_questions"),
            gradient=exam.get("gradient"),
            borderColor=exam.get("borderColor"),
            bgColor=exam.get("bgColor"),
            flag=exam.get("flag")
        )
        for exam in exams
    ]

@app.get("/api/v1/exams/{exam_id}", response_model=ExamResponse)
async def get_exam(exam_id: str):
    """Get details for a specific exam, including its subjects"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        exam = db.exams.find_one({"_id": ObjectId(exam_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid exam ID"
        )
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    subjects = [
        Subject(
            id=str(subject["_id"]),
            name=subject["name"],
            description=subject["description"],
            total_questions=subject.get("total_questions"),
            duration=subject.get("duration"),
            icon=subject.get("icon"),
            gradient=subject.get("gradient"),
            bgColor=subject.get("bgColor")
        )
        for subject in exam.get("subjects", [])
    ]
    
    return ExamResponse(
        id=str(exam["_id"]),
        name=exam["name"],
        country=exam["country"],
        description=exam["description"],
        subjects=subjects,
        total_questions=exam.get("total_questions"),
        gradient=exam.get("gradient"),
        borderColor=exam.get("borderColor"),
        bgColor=exam.get("bgColor"),
        flag=exam.get("flag")
    )

@app.post("/api/v1/users/me/exam")
async def set_user_exam(
    exam_selection: UserExamSelection,
    current_user = Depends(get_current_user)
):
    """Set the user's selected exam"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    # Validate exam exists
    try:
        exam = db.exams.find_one({"_id": ObjectId(exam_selection.exam_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid exam ID"
        )
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Update user's selected exam
    db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {
            "$set": {
                "selected_exam_id": ObjectId(exam_selection.exam_id),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Exam selected successfully"}

logger.info("=== VERCEL SERVERLESS FUNCTION READY ===")

# Export the FastAPI app for Vercel's Python runtime using Mangum ASGI adapter
# Use direct assignment to avoid Vercel's handler introspection issues
try:
    logger.info("Creating Mangum ASGI handler...")
    handler = Mangum(app, lifespan="off")
    logger.info("✅ Mangum handler created successfully")
except Exception as e:
    logger.error(f"❌ Failed to create Mangum handler: {e}")
    # Fallback handler that returns an error
    def handler(event, context):
        return {
            'statusCode': 500,
            'body': f'Handler initialization failed: {str(e)}'
        }