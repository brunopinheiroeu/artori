import os
import logging
import re
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, validator
from passlib.context import CryptContext
from jose import JWTError, jwt
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="artori.app API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
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

logger.info(f"MONGODB_URI loaded: {'Yes' if MONGODB_URI else 'No'}")
if MONGODB_URI:
    try:
        logger.info("Attempting to connect to MongoDB...")
        client = MongoClient(MONGODB_URI)
        db = client.artori
        # Test the connection
        client.admin.command('ping')
        logger.info("✅ MongoDB connection successful!")
        collections = db.list_collection_names()
        logger.info(f"Available collections: {collections}")
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        client = None
        db = None
else:
    logger.error("❌ MONGODB_URI not found in environment variables")

# Password validation function
def validate_password_strength(password: str) -> str:
    """Validate password meets strength requirements"""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        raise ValueError("Password must contain at least one uppercase letter")
    
    if not re.search(r'[0-9]', password):
        raise ValueError("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValueError("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")
    
    return password

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        return validate_password_strength(v)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    selected_exam_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

# Exam-related models
class Subject(BaseModel):
    id: str
    name: str
    description: str

class Exam(BaseModel):
    id: str
    name: str
    country: str
    description: str
    subjects: List[Subject]

class ExamResponse(BaseModel):
    id: str
    name: str
    country: str
    description: str
    subjects: List[Subject]

class ExamListResponse(BaseModel):
    id: str
    name: str
    country: str
    description: str

class UserExamSelection(BaseModel):
    exam_id: str

# Question-related models
class Option(BaseModel):
    id: str
    text: str

class Explanation(BaseModel):
    reasoning: List[str]
    concept: str
    sources: List[str]
    bias_check: str
    reflection: str

class Question(BaseModel):
    id: str
    subject_id: str
    question: str
    options: List[Option]
    correct_answer: str
    explanation: Explanation

class QuestionResponse(BaseModel):
    id: str
    subject_id: str
    question: str
    options: List[Option]

class AnswerSubmission(BaseModel):
    answer: str

class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    explanation: Explanation

# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password with proper byte-level truncation for bcrypt compatibility"""
    logger.info(f"get_password_hash called - Password length: {len(password)} chars, {len(password.encode('utf-8'))} bytes")
    
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
        logger.error(f"Error type: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "artori.app API is running"}

@app.post("/api/v1/auth/signup", response_model=Token)
async def signup(user_data: UserCreate):
    """Register a new user"""
    logger.info(f"Signup attempt for email: {user_data.email}")
    logger.info(f"Password received - Length: {len(user_data.password)} chars, {len(user_data.password.encode('utf-8'))} bytes")
    
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
    logger.info("About to hash password...")
    try:
        hashed_password = get_password_hash(user_data.password)
        logger.info("Password hashing completed successfully")
    except Exception as e:
        logger.error(f"Password hashing failed with error: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password processing failed: {str(e)}"
        )
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "selected_exam_id": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert user into database
    result = db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/v1/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """Authenticate user and return JWT token"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    # Get user by email
    user = get_user_by_email(user_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current authenticated user's details"""
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        selected_exam_id=str(current_user["selected_exam_id"]) if current_user.get("selected_exam_id") else None,
        created_at=current_user["created_at"],
        updated_at=current_user["updated_at"]
    )

# Exam endpoints
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
            description=exam["description"]
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
            description=subject["description"]
        )
        for subject in exam.get("subjects", [])
    ]
    
    return ExamResponse(
        id=str(exam["_id"]),
        name=exam["name"],
        country=exam["country"],
        description=exam["description"],
        subjects=subjects
    )

# User exam selection endpoint
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

# Question endpoints
@app.get("/api/v1/exams/{exam_id}/subjects/{subject_id}/questions", response_model=List[QuestionResponse])
async def get_questions(exam_id: str, subject_id: str):
    """Get questions for a specific subject"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    # Validate exam and subject exist
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
    
    # Check if subject exists in exam
    subject_exists = any(
        str(subject["_id"]) == subject_id
        for subject in exam.get("subjects", [])
    )
    
    if not subject_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found in exam"
        )
    
    # Get questions for the subject
    try:
        questions = list(db.questions.find({"subject_id": ObjectId(subject_id)}))
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subject ID"
        )
    
    return [
        QuestionResponse(
            id=str(question["_id"]),
            subject_id=str(question["subject_id"]),
            question=question["question"],
            options=[
                Option(id=option["id"], text=option["text"])
                for option in question["options"]
            ]
        )
        for question in questions
    ]

@app.post("/api/v1/questions/{question_id}/answer", response_model=AnswerResponse)
async def submit_answer(
    question_id: str,
    answer_submission: AnswerSubmission,
    current_user = Depends(get_current_user)
):
    """Submit an answer for a question and get the result"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    # Get the question
    try:
        question = db.questions.find_one({"_id": ObjectId(question_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid question ID"
        )
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check if answer is correct
    is_correct = answer_submission.answer == question["correct_answer"]
    
    # Update user progress
    subject_id = question["subject_id"]
    user_id = ObjectId(current_user["_id"])
    
    # Find or create user progress record
    progress = db.user_progress.find_one({
        "user_id": user_id,
        "subject_id": subject_id
    })
    
    if progress:
        # Update existing progress
        completed_questions = progress.get("completed_questions", [])
        if ObjectId(question_id) not in completed_questions:
            completed_questions.append(ObjectId(question_id))
            
        # Update score (simple scoring: +1 for correct, 0 for incorrect)
        current_score = progress.get("score", 0)
        new_score = current_score + (1 if is_correct else 0)
        
        db.user_progress.update_one(
            {"_id": progress["_id"]},
            {
                "$set": {
                    "score": new_score,
                    "completed_questions": completed_questions
                }
            }
        )
    else:
        # Create new progress record
        db.user_progress.insert_one({
            "user_id": user_id,
            "subject_id": subject_id,
            "score": 1 if is_correct else 0,
            "completed_questions": [ObjectId(question_id)]
        })
    
    # Return answer result with explanation
    explanation = Explanation(
        reasoning=question["explanation"]["reasoning"],
        concept=question["explanation"]["concept"],
        sources=question["explanation"]["sources"],
        bias_check=question["explanation"]["bias_check"],
        reflection=question["explanation"]["reflection"]
    )
    
    return AnswerResponse(
        correct=is_correct,
        correct_answer=question["correct_answer"],
        explanation=explanation
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)