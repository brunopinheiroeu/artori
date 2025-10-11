import os
import logging
import re
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from enum import Enum

from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, field_validator
from passlib.context import CryptContext
from jose import JWTError, jwt
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Configure logging first
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import AI service with error handling
try:
    from ai_service import ai_service
    logger.info("✅ AI service imported successfully")
except Exception as ai_import_error:
    logger.error(f"❌ Failed to import AI service: {ai_import_error}")
    logger.error(f"AI import error type: {type(ai_import_error).__name__}")
    # Create a mock AI service to prevent crashes
    class MockAIService:
        def is_available(self):
            return False
        async def generate_explanation(self, *args, **kwargs):
            return {"reasoning": ["AI service unavailable"], "concept": "N/A", "sources": [], "bias_check": "N/A", "reflection": "N/A"}
        async def generate_chat_response(self, *args, **kwargs):
            return "AI service is currently unavailable."
    ai_service = MockAIService()
    logger.info("✅ Mock AI service created as fallback")

# Load environment variables
load_dotenv()

app = FastAPI(title="artori.app API", version="1.0.0")

# Environment variable validation function
def validate_environment_variables():
    """Validate critical environment variables at startup"""
    logger.info("=== Environment Variable Validation ===")
    
    # Check MONGODB_URI or MONGODB_URL
    mongodb_uri = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
    if not mongodb_uri:
        logger.error("❌ CRITICAL: MONGODB_URI or MONGODB_URL environment variable is missing!")
        logger.error("   This will cause database connection failures and 500 errors")
        return False
    else:
        mongodb_var_name = "MONGODB_URI" if os.getenv("MONGODB_URI") else "MONGODB_URL"
        logger.info(f"✅ {mongodb_var_name} is present")
        # Log partial URI for debugging (hide credentials)
        if "@" in mongodb_uri:
            # Format: mongodb://user:pass@host/db or mongodb+srv://user:pass@host/db
            parts = mongodb_uri.split("@")
            if len(parts) >= 2:
                logger.info(f"   MongoDB host: @{parts[1]}")
        
    # Check JWT_SECRET
    jwt_secret = os.getenv("JWT_SECRET")
    if not jwt_secret:
        logger.error("❌ CRITICAL: JWT_SECRET environment variable is missing!")
        logger.error("   This will cause JWT token creation/validation failures and 500 errors")
        return False
    else:
        logger.info("✅ JWT_SECRET is present")
        logger.info(f"   JWT_SECRET length: {len(jwt_secret)} characters")
    
    # Check JWT_ALGORITHM
    jwt_algorithm = os.getenv("JWT_ALGORITHM", "HS256")
    logger.info(f"✅ JWT_ALGORITHM: {jwt_algorithm}")
    
    # Check JWT_EXPIRES_IN_MINUTES
    jwt_expires = os.getenv("JWT_EXPIRES_IN_MINUTES", "30")
    logger.info(f"✅ JWT_EXPIRES_IN_MINUTES: {jwt_expires}")
    
    logger.info("=== Environment Variable Validation Complete ===")
    return True

# Add startup event to validate environment and log all routes
@app.on_event("startup")
async def startup_event():
    logger.info("=== FastAPI Application Starting ===")
    
    # Validate environment variables first
    env_valid = validate_environment_variables()
    if not env_valid:
        logger.error("❌ STARTUP FAILED: Critical environment variables are missing!")
        logger.error("   The application will not function properly without these variables.")
        logger.error("   Please check your .env file or deployment environment configuration.")
    
    logger.info("Registered routes:")
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            logger.info(f"  {route.methods} {route.path}")
    logger.info("=== Route Registration Complete ===")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://artori.app",
        "https://www.artori.app"
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables - check both MONGODB_URI and MONGODB_URL for compatibility
MONGODB_URI = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
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
        logger.info("=== MONGODB CONNECTION ATTEMPT ===")
        logger.info("Attempting to connect to MongoDB...")
        
        # Log connection string details (without credentials)
        if "@" in MONGODB_URI:
            parts = MONGODB_URI.split("@")
            if len(parts) >= 2:
                logger.info(f"MongoDB host: @{parts[1]}")
        
        # Configure MongoDB client for Vercel serverless environment
        # More aggressive timeouts for serverless
        client = MongoClient(
            MONGODB_URI,
            # SSL/TLS configuration for serverless environments
            tls=True,
            tlsAllowInvalidCertificates=False,
            # Optimized connection pool settings for serverless
            maxPoolSize=1,  # Reduced for serverless
            minPoolSize=0,  # Allow zero connections when idle
            maxIdleTimeMS=10000,  # Reduced idle time
            # More aggressive timeout settings for serverless
            serverSelectionTimeoutMS=3000,  # Reduced from 5000
            connectTimeoutMS=5000,  # Reduced from 10000
            socketTimeoutMS=10000,  # Reduced from 20000
            # Retry settings
            retryWrites=True,
            retryReads=True
        )
        
        logger.info("MongoDB client created, testing connection...")
        db = client.artori
        
        # Test the connection with timeout
        import time
        start_time = time.time()
        client.admin.command('ping')
        connection_time = time.time() - start_time
        
        logger.info(f"✅ MongoDB connection successful! (took {connection_time:.2f}s)")
        
        # List collections with error handling
        try:
            collections = db.list_collection_names()
            logger.info(f"Available collections: {collections}")
        except Exception as coll_error:
            logger.warning(f"Could not list collections: {coll_error}")
            
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error details: {str(e)}")
        
        # Log specific MongoDB error types
        if "ServerSelectionTimeoutError" in str(type(e)):
            logger.error("🔍 DIAGNOSIS: Server selection timeout - likely network/DNS issue")
        elif "AuthenticationFailed" in str(type(e)):
            logger.error("🔍 DIAGNOSIS: Authentication failed - check credentials")
        elif "ConnectionFailure" in str(type(e)):
            logger.error("🔍 DIAGNOSIS: Connection failure - check network/firewall")
        elif "timeout" in str(e).lower():
            logger.error("🔍 DIAGNOSIS: Timeout issue - serverless cold start problem")
        
        client = None
        db = None
else:
    logger.error("❌ Neither MONGODB_URI nor MONGODB_URL found in environment variables")
    logger.error("🔍 DIAGNOSIS: Missing MONGODB_URI or MONGODB_URL environment variable")

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
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        return validate_password_strength(v)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

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

class Token(BaseModel):
    access_token: str
    token_type: str

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

# User progress models
class SubjectProgress(BaseModel):
    subject_id: str
    progress: float
    questions_solved: int
    correct_answers: int
    accuracy_rate: float

class UserProgress(BaseModel):
    user_id: str
    exam_id: str
    overall_progress: float
    questions_solved: int
    accuracy_rate: float
    study_time_hours: float
    current_streak_days: int
    last_studied_date: Optional[datetime] = None
    subject_progress: List[SubjectProgress]

class DashboardResponse(BaseModel):
    selected_exam: ExamResponse
    user_progress: Optional[UserProgress] = None

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

class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None

# Admin-specific enums and models
class UserRole(str, Enum):
    STUDENT = "student"
    TUTOR = "tutor"
    TEACHER = "teacher"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class ExamStatus(str, Enum):
    ACTIVE = "active"
    DRAFT = "draft"
    ARCHIVED = "archived"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"

class QuestionDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class QuestionStatus(str, Enum):
    ACTIVE = "active"
    DRAFT = "draft"
    REVIEW = "review"

# Admin Dashboard Models
class DashboardStats(BaseModel):
    total_users: int
    active_users: int
    new_users_today: int
    total_exams: int
    total_questions: int
    total_subjects: int
    completion_rate: float
    average_accuracy: float

class ActivityLog(BaseModel):
    id: str
    admin_id: str
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Dict[str, Any]
    timestamp: datetime
    ip_address: Optional[str] = None

class SystemHealth(BaseModel):
    status: str
    uptime: str
    response_time: float
    error_rate: float
    active_connections: int

# Admin User Management Models
class AdminUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.STUDENT
    status: UserStatus = UserStatus.ACTIVE

class AdminUserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None

class AdminUserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    status: UserStatus
    selected_exam_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    login_count: int = 0

class AdminUsersListResponse(BaseModel):
    users: List[AdminUserResponse]
    total_count: int
    page: int
    page_size: int
    total_pages: int

class UserProgressDetail(BaseModel):
    user_id: str
    exam_id: str
    exam_name: str
    overall_progress: float
    questions_solved: int
    accuracy_rate: float
    study_time_hours: float
    current_streak_days: int
    last_studied_date: Optional[datetime] = None
    subject_progress: List[SubjectProgress]

# Admin Exam Management Models
class AdminExamCreate(BaseModel):
    name: str
    country: str
    description: str
    status: ExamStatus = ExamStatus.DRAFT
    gradient: Optional[str] = None
    borderColor: Optional[str] = None
    bgColor: Optional[str] = None
    flag: Optional[str] = None

class AdminExamUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ExamStatus] = None
    gradient: Optional[str] = None
    borderColor: Optional[str] = None
    bgColor: Optional[str] = None
    flag: Optional[str] = None

class AdminSubjectCreate(BaseModel):
    name: str
    description: str
    duration: Optional[str] = None
    icon: Optional[str] = None
    gradient: Optional[str] = None
    bgColor: Optional[str] = None

class AdminSubjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    icon: Optional[str] = None
    gradient: Optional[str] = None
    bgColor: Optional[str] = None

class AdminQuestionCreate(BaseModel):
    question: str
    question_type: QuestionType = QuestionType.MULTIPLE_CHOICE
    difficulty: QuestionDifficulty = QuestionDifficulty.MEDIUM
    options: List[Option]
    correct_answer: str
    explanation: Explanation
    tags: List[str] = []
    status: QuestionStatus = QuestionStatus.DRAFT
    duration: int = 60  # Duration in seconds, default 1 minute

class AdminQuestionUpdate(BaseModel):
    question: Optional[str] = None
    question_type: Optional[QuestionType] = None
    difficulty: Optional[QuestionDifficulty] = None
    options: Optional[List[Option]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[Explanation] = None
    tags: Optional[List[str]] = None
    status: Optional[QuestionStatus] = None
    duration: Optional[int] = None  # Duration in seconds

class AdminQuestionResponse(BaseModel):
    id: str
    subject_id: str
    question: str
    question_type: QuestionType
    difficulty: QuestionDifficulty
    options: List[Option]
    correct_answer: str
    explanation: Explanation
    tags: List[str]
    status: QuestionStatus
    duration: int  # Duration in seconds
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None

class AdminQuestionsListResponse(BaseModel):
    questions: List[AdminQuestionResponse]
    total_count: int
    page: int
    page_size: int
    total_pages: int

# Analytics Models
class UserAnalytics(BaseModel):
    total_users: int
    active_users: int
    new_registrations: int
    user_retention_rate: float
    geographic_distribution: Dict[str, int]
    engagement_metrics: Dict[str, float]

class ExamAnalytics(BaseModel):
    exam_id: str
    exam_name: str
    total_attempts: int
    completion_rate: float
    average_score: float
    difficulty_distribution: Dict[str, int]
    popular_subjects: List[Dict[str, Any]]

class SystemSettings(BaseModel):
    category: str
    settings: Dict[str, Any]
    updated_by: str
    updated_at: datetime

# Admin Preferences Models
class AdminPreferences(BaseModel):
    admin_id: str
    system_alerts: bool = True
    user_activity: bool = True
    weekly_reports: bool = False
    emergency_alerts: bool = True
    maintenance_updates: bool = True
    feature_updates: bool = False
    two_factor: bool = False
    login_alerts: bool = True
    created_at: datetime
    updated_at: datetime

class AdminPreferencesUpdate(BaseModel):
    system_alerts: Optional[bool] = None
    user_activity: Optional[bool] = None
    weekly_reports: Optional[bool] = None
    emergency_alerts: Optional[bool] = None
    maintenance_updates: Optional[bool] = None
    feature_updates: Optional[bool] = None
    two_factor: Optional[bool] = None
    login_alerts: Optional[bool] = None

# Analytics Models
class AnalyticsMetric(BaseModel):
    id: str
    metric_type: str  # "user_engagement", "exam_performance", "system_usage"
    date: datetime
    value: float
    metadata: Dict[str, Any]
    created_at: datetime

class TimeSeriesData(BaseModel):
    id: str
    metric_name: str
    timestamp: datetime
    value: float
    tags: Dict[str, Any]
    created_at: datetime

class PerformanceMetrics(BaseModel):
    response_time: float
    throughput: float
    error_rate: float
    cpu_usage: float
    memory_usage: float
    active_connections: int
    timestamp: datetime

class TrendingData(BaseModel):
    metric_name: str
    data_points: List[Dict[str, Any]]
    time_range: str
    trend_direction: str  # "up", "down", "stable"
    percentage_change: float

# Test Results Models
class TestResultDetail(BaseModel):
    question_id: str
    question_number: int
    question_text: str
    selected_answer: str
    correct_answer: str
    is_correct: bool
    explanation: Explanation
    topic: str
    difficulty: str
    time_spent: Optional[int] = None  # in seconds

class TopicBreakdown(BaseModel):
    topic: str
    correct: int
    total: int
    percentage: float

class StudyRecommendation(BaseModel):
    area: str
    suggestion: str
    priority: str  # "High", "Medium", "Low"
    estimated_time: str

class TestSessionResult(BaseModel):
    session_id: str
    user_id: str
    exam_id: str
    subject_id: str
    exam_name: str
    subject_name: str
    start_time: datetime
    end_time: datetime
    total_questions: int
    correct_answers: int
    score_percentage: float
    grade: str
    time_spent: str  # formatted as "MM:SS"
    question_details: List[TestResultDetail]
    topic_breakdown: List[TopicBreakdown]
    recommendations: List[StudyRecommendation]
    percentile: int
    improvement: float

# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    # Truncate password to 72 bytes for bcrypt compatibility (same as in get_password_hash)
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        # Truncate to 72 bytes, being careful not to split multi-byte characters
        password_bytes = password_bytes[:72]
        # Decode back, ignoring any incomplete characters at the end
        plain_password = password_bytes.decode('utf-8', errors='ignore')
    
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

# Admin authentication and authorization
async def get_current_admin_user(current_user = Depends(get_current_user)):
    """Get current authenticated admin user"""
    user_role = current_user.get("role", "student")
    if user_role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

async def get_current_tutor_user(current_user = Depends(get_current_user)):
    """Get current authenticated tutor user"""
    user_role = current_user.get("role", "student")
    if user_role != "tutor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tutor access required"
        )
    return current_user

async def get_current_tutor_or_admin_user(current_user = Depends(get_current_user)):
    """Get current authenticated tutor or admin user"""
    user_role = current_user.get("role", "student")
    if user_role not in ["tutor", "admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tutor or admin access required"
        )
    return current_user

async def get_current_super_admin_user(current_user = Depends(get_current_user)):
    """Get current authenticated super admin user"""
    user_role = current_user.get("role", "student")
    if user_role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    return current_user

def log_admin_activity(admin_id: str, action: str, resource_type: str, resource_id: str = None, details: Dict[str, Any] = None, ip_address: str = None):
    """Log admin activity for audit purposes"""
    if db is None:
        return
    
    activity_log = {
        "admin_id": ObjectId(admin_id),
        "action": action,
        "resource_type": resource_type,
        "resource_id": ObjectId(resource_id) if resource_id else None,
        "details": details or {},
        "ip_address": ip_address,
        "user_agent": None,  # Can be extracted from request headers if needed
        "timestamp": datetime.utcnow()
    }
    
    try:
        db.admin_activity_logs.insert_one(activity_log)
    except Exception as e:
        logger.error(f"Failed to log admin activity: {e}")

def calculate_dashboard_stats():
    """Calculate dashboard statistics"""
    if db is None:
        return None
    
    try:
        # User statistics
        total_users = db.users.count_documents({})
        active_users = db.users.count_documents({"status": {"$ne": "inactive"}})
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        new_users_today = db.users.count_documents({"created_at": {"$gte": today}})
        
        # Exam statistics
        total_exams = db.exams.count_documents({})
        total_questions = db.questions.count_documents({})
        
        # Calculate total subjects across all exams
        total_subjects = 0
        exams = list(db.exams.find({}, {"subjects": 1}))
        for exam in exams:
            total_subjects += len(exam.get("subjects", []))
        
        # Calculate completion and accuracy rates
        total_answers = db.user_answers.count_documents({})
        correct_answers = db.user_answers.count_documents({"is_correct": True})
        
        completion_rate = 0.0
        average_accuracy = 0.0
        
        if total_questions > 0:
            # Simple completion rate based on answered questions
            completion_rate = (total_answers / (total_users * total_questions)) * 100 if total_users > 0 else 0
            completion_rate = min(completion_rate, 100.0)
        
        if total_answers > 0:
            average_accuracy = (correct_answers / total_answers) * 100
        
        return DashboardStats(
            total_users=total_users,
            active_users=active_users,
            new_users_today=new_users_today,
            total_exams=total_exams,
            total_questions=total_questions,
            total_subjects=total_subjects,
            completion_rate=round(completion_rate, 2),
            average_accuracy=round(average_accuracy, 2)
        )
    except Exception as e:
        logger.error(f"Failed to calculate dashboard stats: {e}")
        return None

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
        logger.error("   This indicates both MONGODB_URI and MONGODB_URL environment variables are missing or invalid")
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
        logger.error(f"   Error type: {type(db_error).__name__}")
        logger.error("   This indicates database connection issues")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connectivity error: {str(db_error)}"
        )
    
    # Debug: Check JWT_SECRET availability
    jwt_secret_available = bool(JWT_SECRET)
    logger.info(f"JWT_SECRET availability: {'✅ Available' if jwt_secret_available else '❌ MISSING'}")
    if not jwt_secret_available:
        logger.error("❌ LOGIN FAILED: JWT_SECRET environment variable is missing")
        logger.error("   This will cause token creation to fail")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="JWT configuration error - check JWT_SECRET environment variable"
        )
    
    # Get user by email with enhanced error handling
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
        # Re-raise HTTP exceptions (like 401)
        raise
    except Exception as user_lookup_error:
        logger.error(f"❌ LOGIN FAILED: User lookup error: {user_lookup_error}")
        logger.error(f"   Error type: {type(user_lookup_error).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"User lookup error: {str(user_lookup_error)}"
        )
    
    # Verify password with enhanced error handling
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
        # Re-raise HTTP exceptions (like 401)
        raise
    except Exception as password_error:
        logger.error(f"❌ LOGIN FAILED: Password verification error: {password_error}")
        logger.error(f"   Error type: {type(password_error).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password verification error: {str(password_error)}"
        )
    
    # Update login tracking with enhanced error handling
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
        logger.error(f"   Error type: {type(tracking_error).__name__}")
        # Don't fail the login for tracking errors, just log them
    
    # Create access token with enhanced error handling
    try:
        logger.info("Creating JWT access token...")
        access_token = create_access_token(data={"sub": str(user["_id"])})
        logger.info("✅ JWT access token created successfully")
        logger.info("=== LOGIN SUCCESS ===")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as token_error:
        logger.error(f"❌ LOGIN FAILED: JWT token creation error: {token_error}")
        logger.error(f"   Error type: {type(token_error).__name__}")
        logger.error("   This indicates JWT_SECRET or JWT configuration issues")
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

# Dashboard endpoint
@app.get("/api/v1/users/me/dashboard", response_model=DashboardResponse)
async def get_user_dashboard(current_user = Depends(get_current_user)):
    """Get user's dashboard data including selected exam and progress"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    # Get user's selected exam
    if not current_user.get("selected_exam_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No exam selected"
        )
    
    try:
        exam = db.exams.find_one({"_id": ObjectId(current_user["selected_exam_id"])})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid exam ID"
        )
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Selected exam not found"
        )
    
    # Build exam response
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
    
    selected_exam = ExamResponse(
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
    
    # Get user progress for this exam
    user_progress = None
    progress_records = list(db.user_progress.find({
        "user_id": ObjectId(current_user["_id"]),
        "exam_id": ObjectId(current_user["selected_exam_id"])
    }))
    
    if progress_records:
        # Calculate overall statistics
        total_questions_solved = sum(record.get("questions_solved", 0) for record in progress_records)
        total_correct_answers = sum(record.get("correct_answers", 0) for record in progress_records)
        overall_accuracy = (total_correct_answers / total_questions_solved * 100) if total_questions_solved > 0 else 0
        
        # Calculate overall progress based on total questions in exam
        total_exam_questions = exam.get("total_questions", 1)
        overall_progress = min((total_questions_solved / total_exam_questions * 100), 100) if total_exam_questions > 0 else 0
        
        # Build subject progress
        subject_progress = []
        for record in progress_records:
            subject_id = str(record["subject_id"])
            questions_solved = record.get("questions_solved", 0)
            correct_answers = record.get("correct_answers", 0)
            accuracy_rate = record.get("accuracy_rate", 0)
            
            # Find subject total questions for progress calculation
            subject_total = 1
            for subject in exam.get("subjects", []):
                if str(subject["_id"]) == subject_id:
                    subject_total = subject.get("total_questions", 1)
                    break
            
            progress_percentage = min((questions_solved / subject_total * 100), 100) if subject_total > 0 else 0
            
            subject_progress.append(SubjectProgress(
                subject_id=subject_id,
                progress=progress_percentage,
                questions_solved=questions_solved,
                correct_answers=correct_answers,
                accuracy_rate=accuracy_rate
            ))
        
        user_progress = UserProgress(
            user_id=str(current_user["_id"]),
            exam_id=str(current_user["selected_exam_id"]),
            overall_progress=overall_progress,
            questions_solved=total_questions_solved,
            accuracy_rate=overall_accuracy,
            study_time_hours=25.5,  # Mock data for now
            current_streak_days=7,  # Mock data for now
            subject_progress=subject_progress
        )
    
    return DashboardResponse(
        selected_exam=selected_exam,
        user_progress=user_progress
    )

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
    
    # Record user answer
    user_id = ObjectId(current_user["_id"])
    subject_id = question["subject_id"]
    
    # Insert answer record
    db.user_answers.insert_one({
        "user_id": user_id,
        "question_id": ObjectId(question_id),
        "selected_option_id": answer_submission.answer,
        "is_correct": is_correct,
        "answered_at": datetime.utcnow()
    })
    
    # Get user's selected exam ID
    exam_id = current_user.get("selected_exam_id")
    if not exam_id:
        # If no exam selected, we can't update progress properly
        pass
    else:
        # Find or create user progress record for this exam and subject
        progress = db.user_progress.find_one({
            "user_id": user_id,
            "exam_id": ObjectId(exam_id),
            "subject_id": subject_id
        })
        
        if progress:
            # Update existing progress
            questions_solved = progress.get("questions_solved", 0) + 1
            correct_answers = progress.get("correct_answers", 0) + (1 if is_correct else 0)
            accuracy_rate = (correct_answers / questions_solved * 100) if questions_solved > 0 else 0
            
            db.user_progress.update_one(
                {"_id": progress["_id"]},
                {
                    "$set": {
                        "questions_solved": questions_solved,
                        "correct_answers": correct_answers,
                        "accuracy_rate": accuracy_rate,
                        "last_studied_date": datetime.utcnow()
                    }
                }
            )
        else:
            # Create new progress record
            db.user_progress.insert_one({
                "user_id": user_id,
                "exam_id": ObjectId(exam_id),
                "subject_id": subject_id,
                "questions_solved": 1,
                "correct_answers": 1 if is_correct else 0,
                "accuracy_rate": 100.0 if is_correct else 0.0,
                "last_studied_date": datetime.utcnow()
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

@app.get("/api/v1/questions/{question_id}/ai-explanation", response_model=AnswerResponse)
async def get_ai_explanation(
    question_id: str,
    selected_answer: Optional[str] = Query(None, description="User's selected answer"),
    current_user = Depends(get_current_user)
):
    """Get an AI-generated explanation for a question with context of user's answer"""
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
    
    # Get subject information for context
    subject_name = "General"
    try:
        # Find the exam that contains this subject
        exam = db.exams.find_one({"subjects._id": question["subject_id"]})
        if exam:
            subject = next((s for s in exam.get("subjects", []) if s["_id"] == question["subject_id"]), None)
            if subject:
                subject_name = subject["name"]
    except Exception as e:
        logger.warning(f"Could not determine subject name: {e}")
    
    # Generate AI explanation
    try:
        ai_explanation = await ai_service.generate_explanation(
            question=question["question"],
            options=question["options"],
            correct_answer=question["correct_answer"],
            selected_answer=selected_answer,
            subject=subject_name,
            difficulty=question.get("difficulty", "medium")
        )
        
        # Convert to Explanation model
        explanation = Explanation(
            reasoning=ai_explanation["reasoning"],
            concept=ai_explanation["concept"],
            sources=ai_explanation["sources"],
            bias_check=ai_explanation["bias_check"],
            reflection=ai_explanation["reflection"]
        )
        
        return AnswerResponse(
            correct=True,  # Not applicable for explanation-only request
            correct_answer=question["correct_answer"],
            explanation=explanation
        )
        
    except Exception as e:
        logger.error(f"Failed to generate AI explanation: {e}")
        # Fall back to existing explanation if AI fails
        explanation = Explanation(
            reasoning=question["explanation"]["reasoning"],
            concept=question["explanation"]["concept"],
            sources=question["explanation"]["sources"],
            bias_check=question["explanation"]["bias_check"],
            reflection=question["explanation"]["reflection"]
        )
        
        return AnswerResponse(
            correct=True,
            correct_answer=question["correct_answer"],
            explanation=explanation
        )

@app.post("/api/v1/questions/{question_id}/ai-chat", response_model=ChatResponse)
async def ai_chat(
    question_id: str,
    chat_request: ChatRequest,
    current_user = Depends(get_current_user)
):
    """Handle conversational AI chat for a specific question"""
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
    
    # Get subject information for context
    subject_name = "General"
    try:
        # Find the exam that contains this subject
        exam = db.exams.find_one({"subjects._id": question["subject_id"]})
        if exam:
            subject = next((s for s in exam.get("subjects", []) if s["_id"] == question["subject_id"]), None)
            if subject:
                subject_name = subject["name"]
    except Exception as e:
        logger.warning(f"Could not determine subject name: {e}")
    
    # Build question context for the AI
    question_context = {
        "question": question["question"],
        "options": question["options"],
        "correct_answer": question["correct_answer"],
        "subject": subject_name,
        "difficulty": question.get("difficulty", "medium")
    }
    
    # Generate AI chat response
    try:
        ai_response = await ai_service.generate_chat_response(
            messages=[{"role": msg.role, "content": msg.content} for msg in chat_request.messages],
            question_context=question_context
        )
        
        return ChatResponse(
            response=ai_response,
            conversation_id=None  # Could be implemented for session tracking
        )
        
    except Exception as e:
        logger.error(f"Failed to generate AI chat response: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate AI response"
        )

# =============================================================================
# ADMIN API ENDPOINTS
# =============================================================================

# Admin Dashboard Analytics Endpoints
@app.get("/api/v1/admin/dashboard/stats", response_model=DashboardStats)
async def get_admin_dashboard_stats(current_admin = Depends(get_current_admin_user)):
    """Get dashboard statistics for admin panel"""
    stats = calculate_dashboard_stats()
    if stats is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to calculate dashboard statistics"
        )
    
    # Log admin activity
    log_admin_activity(
        admin_id=str(current_admin["_id"]),
        action="view",
        resource_type="dashboard_stats"
    )
    
    return stats

@app.get("/api/v1/admin/dashboard/activity", response_model=List[ActivityLog])
async def get_admin_activity_logs(
    current_admin = Depends(get_current_admin_user),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Get recent admin activity logs"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        logs = list(db.admin_activity_logs.find({})
                   .sort("timestamp", -1)
                   .skip(skip)
                   .limit(limit))
        
        return [
            ActivityLog(
                id=str(log["_id"]),
                admin_id=str(log["admin_id"]),
                action=log["action"],
                resource_type=log["resource_type"],
                resource_id=str(log["resource_id"]) if log.get("resource_id") else None,
                details=log.get("details", {}),
                timestamp=log["timestamp"],
                ip_address=log.get("ip_address")
            )
            for log in logs
        ]
    except Exception as e:
        logger.error(f"Failed to get activity logs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve activity logs"
        )

@app.get("/api/v1/admin/dashboard/performance", response_model=SystemHealth)
async def get_system_health(current_admin = Depends(get_current_admin_user)):
    """Get system health and performance metrics"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Calculate basic system metrics
        start_time = datetime.utcnow()
        
        # Test database response time
        db.users.count_documents({})
        db_response_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        
        # Mock system health data (in a real system, these would come from monitoring tools)
        health = SystemHealth(
            status="healthy",
            uptime="99.9%",
            response_time=round(db_response_time, 2),
            error_rate=0.1,
            active_connections=25
        )
        
        return health
    except Exception as e:
        logger.error(f"Failed to get system health: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve system health"
        )

# Admin User Management Endpoints
@app.get("/api/v1/admin/users", response_model=AdminUsersListResponse)
async def get_admin_users(
    current_admin = Depends(get_current_admin_user),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    role: Optional[UserRole] = Query(None),
    status: Optional[UserStatus] = Query(None)
):
    """Get list of users with admin details"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Build query filter
        query_filter = {}
        if search:
            query_filter["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]
        if role:
            query_filter["role"] = role.value
        if status:
            query_filter["status"] = status.value
        
        # Get total count for pagination
        total_count = db.users.count_documents(query_filter)
        
        # Get paginated users
        users = list(db.users.find(query_filter)
                    .sort("created_at", -1)
                    .skip(skip)
                    .limit(limit))
        
        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total_count + limit - 1) // limit  # Ceiling division
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="view",
            resource_type="users",
            details={"filters": query_filter, "count": len(users), "total_count": total_count}
        )
        
        user_responses = [
            AdminUserResponse(
                id=str(user["_id"]),
                name=user["name"],
                email=user["email"],
                role=UserRole(user.get("role", "student")),
                status=UserStatus(user.get("status", "active")),
                selected_exam_id=str(user["selected_exam_id"]) if user.get("selected_exam_id") else None,
                created_at=user["created_at"],
                updated_at=user["updated_at"],
                last_login=user.get("last_login"),
                login_count=user.get("login_count", 0)
            )
            for user in users
        ]
        
        return AdminUsersListResponse(
            users=user_responses,
            total_count=total_count,
            page=page,
            page_size=limit,
            total_pages=total_pages
        )
    except Exception as e:
        logger.error(f"Failed to get users: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve users"
        )

@app.post("/api/v1/admin/users", response_model=AdminUserResponse)
async def create_admin_user(
    user_data: AdminUserCreate,
    current_admin = Depends(get_current_super_admin_user)
):
    """Create a new user (super admin only)"""
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
    
    try:
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user document
        user_doc = {
            "name": user_data.name,
            "email": user_data.email,
            "password": hashed_password,
            "role": user_data.role.value,
            "status": user_data.status.value,
            "selected_exam_id": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "login_count": 0
        }
        
        # Insert user into database
        result = db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="create",
            resource_type="user",
            resource_id=user_id,
            details={"email": user_data.email, "role": user_data.role.value}
        )
        
        # Return created user
        created_user = db.users.find_one({"_id": result.inserted_id})
        return AdminUserResponse(
            id=str(created_user["_id"]),
            name=created_user["name"],
            email=created_user["email"],
            role=UserRole(created_user["role"]),
            status=UserStatus(created_user["status"]),
            selected_exam_id=str(created_user["selected_exam_id"]) if created_user.get("selected_exam_id") else None,
            created_at=created_user["created_at"],
            updated_at=created_user["updated_at"],
            last_login=created_user.get("last_login"),
            login_count=created_user.get("login_count", 0)
        )
    except Exception as e:
        logger.error(f"Failed to create user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@app.get("/api/v1/admin/users/{user_id}", response_model=AdminUserResponse)
async def get_admin_user(
    user_id: str,
    current_admin = Depends(get_current_admin_user)
):
    """Get specific user details"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="view",
            resource_type="user",
            resource_id=user_id
        )
        
        return AdminUserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            role=UserRole(user.get("role", "student")),
            status=UserStatus(user.get("status", "active")),
            selected_exam_id=str(user["selected_exam_id"]) if user.get("selected_exam_id") else None,
            created_at=user["created_at"],
            updated_at=user["updated_at"],
            last_login=user.get("last_login"),
            login_count=user.get("login_count", 0)
        )
    except Exception as e:
        logger.error(f"Failed to get user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user"
        )

@app.put("/api/v1/admin/users/{user_id}", response_model=AdminUserResponse)
async def update_admin_user(
    user_id: str,
    user_data: AdminUserUpdate,
    current_admin = Depends(get_current_admin_user)
):
    """Update user details"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Check if user exists
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Build update document
        update_doc = {"updated_at": datetime.utcnow()}
        if user_data.name is not None:
            update_doc["name"] = user_data.name
        if user_data.email is not None:
            # Check if email is already taken by another user
            existing_user = db.users.find_one({"email": user_data.email, "_id": {"$ne": ObjectId(user_id)}})
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            update_doc["email"] = user_data.email
        if user_data.role is not None:
            # Only super admin can change roles
            if current_admin.get("role") != "super_admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Super admin access required to change user roles"
                )
            update_doc["role"] = user_data.role.value
        if user_data.status is not None:
            update_doc["status"] = user_data.status.value
        
        # Update user
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_doc}
        )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="update",
            resource_type="user",
            resource_id=user_id,
            details={"changes": update_doc}
        )
        
        # Return updated user
        updated_user = db.users.find_one({"_id": ObjectId(user_id)})
        return AdminUserResponse(
            id=str(updated_user["_id"]),
            name=updated_user["name"],
            email=updated_user["email"],
            role=UserRole(updated_user.get("role", "student")),
            status=UserStatus(updated_user.get("status", "active")),
            selected_exam_id=str(updated_user["selected_exam_id"]) if updated_user.get("selected_exam_id") else None,
            created_at=updated_user["created_at"],
            updated_at=updated_user["updated_at"],
            last_login=updated_user.get("last_login"),
            login_count=updated_user.get("login_count", 0)
        )
    except Exception as e:
        logger.error(f"Failed to update user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )

@app.delete("/api/v1/admin/users/{user_id}")
async def delete_admin_user(
    user_id: str,
    current_admin = Depends(get_current_super_admin_user)
):
    """Delete user (super admin only)"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Check if user exists
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Prevent self-deletion
        if str(user["_id"]) == str(current_admin["_id"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete your own account"
            )
        
        # Delete user and related data
        db.users.delete_one({"_id": ObjectId(user_id)})
        db.user_progress.delete_many({"user_id": ObjectId(user_id)})
        db.user_answers.delete_many({"user_id": ObjectId(user_id)})
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="delete",
            resource_type="user",
            resource_id=user_id,
            details={"email": user["email"]}
        )
        
        return {"message": "User deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user"
        )

@app.post("/api/v1/admin/users/{user_id}/reset")
async def reset_admin_user(
    user_id: str,
    current_admin = Depends(get_current_admin_user)
):
    """Reset user progress and exam selection"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Check if user exists
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Prevent resetting admin accounts
        if user.get("role") in ["admin", "super_admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot reset admin accounts"
            )
        
        # Reset user data
        reset_fields = []
        
        # Clear selected exam
        if user.get("selected_exam_id"):
            reset_fields.append("selected_exam")
        
        # Delete user progress
        progress_deleted = db.user_progress.delete_many({"user_id": ObjectId(user_id)})
        if progress_deleted.deleted_count > 0:
            reset_fields.append("progress_data")
        
        # Delete user answers
        answers_deleted = db.user_answers.delete_many({"user_id": ObjectId(user_id)})
        if answers_deleted.deleted_count > 0:
            reset_fields.append("answer_history")
        
        # Delete test sessions
        sessions_deleted = db.test_sessions.delete_many({"user_id": ObjectId(user_id)})
        if sessions_deleted.deleted_count > 0:
            reset_fields.append("test_sessions")
        
        # Update user document
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "selected_exam_id": None,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="reset",
            resource_type="user",
            resource_id=user_id,
            details={
                "reset_fields": reset_fields,
                "progress_records_deleted": progress_deleted.deleted_count,
                "answers_deleted": answers_deleted.deleted_count,
                "sessions_deleted": sessions_deleted.deleted_count
            }
        )
        
        return {
            "message": "User reset successfully",
            "user_id": user_id,
            "reset_fields": reset_fields
        }
    except Exception as e:
        logger.error(f"Failed to reset user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset user"
        )

@app.get("/api/v1/admin/users/{user_id}/progress", response_model=List[UserProgressDetail])
async def get_user_progress_detail(
    user_id: str,
    current_admin = Depends(get_current_admin_user)
):
    """Get detailed progress for a specific user"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Check if user exists
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get user progress records
        progress_records = list(db.user_progress.find({"user_id": ObjectId(user_id)}))
        
        progress_details = []
        for record in progress_records:
            # Get exam details
            exam = db.exams.find_one({"_id": record["exam_id"]})
            if not exam:
                continue
            
            # Build subject progress
            subject_progress = []
            subject_records = list(db.user_progress.find({
                "user_id": ObjectId(user_id),
                "exam_id": record["exam_id"]
            }))
            
            for sub_record in subject_records:
                subject_id = str(sub_record["subject_id"])
                questions_solved = sub_record.get("questions_solved", 0)
                correct_answers = sub_record.get("correct_answers", 0)
                accuracy_rate = sub_record.get("accuracy_rate", 0)
                
                # Find subject total questions for progress calculation
                subject_total = 1
                for subject in exam.get("subjects", []):
                    if str(subject["_id"]) == subject_id:
                        subject_total = subject.get("total_questions", 1)
                        break
                
                progress_percentage = min((questions_solved / subject_total * 100), 100) if subject_total > 0 else 0
                
                subject_progress.append(SubjectProgress(
                    subject_id=subject_id,
                    progress=progress_percentage,
                    questions_solved=questions_solved,
                    correct_answers=correct_answers,
                    accuracy_rate=accuracy_rate
                ))
            
            # Calculate overall progress
            total_questions_solved = sum(sp.questions_solved for sp in subject_progress)
            total_exam_questions = exam.get("total_questions", 1)
            overall_progress = min((total_questions_solved / total_exam_questions * 100), 100) if total_exam_questions > 0 else 0
            
            # Calculate overall accuracy
            total_correct = sum(sp.correct_answers for sp in subject_progress)
            overall_accuracy = (total_correct / total_questions_solved * 100) if total_questions_solved > 0 else 0
            
            progress_details.append(UserProgressDetail(
                user_id=user_id,
                exam_id=str(exam["_id"]),
                exam_name=exam["name"],
                overall_progress=overall_progress,
                questions_solved=total_questions_solved,
                accuracy_rate=overall_accuracy,
                study_time_hours=25.5,  # Mock data
                current_streak_days=7,  # Mock data
                last_studied_date=record.get("last_studied_date"),
                subject_progress=subject_progress
            ))
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="view",
            resource_type="user_progress",
            resource_id=user_id
        )
        
        return progress_details
    except Exception as e:
        logger.error(f"Failed to get user progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user progress"
        )

# Admin Exam Management Endpoints
@app.get("/api/v1/admin/exams", response_model=List[ExamResponse])
async def get_admin_exams(
    current_admin = Depends(get_current_admin_user),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    status: Optional[ExamStatus] = Query(None)
):
    """Get list of exams with admin details"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Build query filter
        query_filter = {}
        if status:
            query_filter["status"] = status.value
        
        exams = list(db.exams.find(query_filter)
                    .sort("created_at", -1)
                    .skip(skip)
                    .limit(limit))
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="view",
            resource_type="exams",
            details={"filters": query_filter, "count": len(exams)}
        )
        
        result = []
        for exam in exams:
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
            
            result.append(ExamResponse(
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
            ))
        
        return result
    except Exception as e:
        logger.error(f"Failed to get exams: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve exams"
        )

@app.post("/api/v1/admin/exams", response_model=ExamResponse)
async def create_admin_exam(
    exam_data: AdminExamCreate,
    current_admin = Depends(get_current_admin_user)
):
    """Create a new exam"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Create exam document
        exam_doc = {
            "name": exam_data.name,
            "country": exam_data.country,
            "description": exam_data.description,
            "status": exam_data.status.value,
            "subjects": [],
            "total_questions": 0,
            "gradient": exam_data.gradient,
            "borderColor": exam_data.borderColor,
            "bgColor": exam_data.bgColor,
            "flag": exam_data.flag,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": ObjectId(current_admin["_id"])
        }
        
        # Insert exam into database
        result = db.exams.insert_one(exam_doc)
        exam_id = str(result.inserted_id)
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="create",
            resource_type="exam",
            resource_id=exam_id,
            details={"name": exam_data.name, "country": exam_data.country}
        )
        
        # Return created exam
        created_exam = db.exams.find_one({"_id": result.inserted_id})
        return ExamResponse(
            id=str(created_exam["_id"]),
            name=created_exam["name"],
            country=created_exam["country"],
            description=created_exam["description"],
            subjects=[],
            total_questions=created_exam.get("total_questions", 0),
            gradient=created_exam.get("gradient"),
            borderColor=created_exam.get("borderColor"),
            bgColor=created_exam.get("bgColor"),
            flag=created_exam.get("flag")
        )
    except Exception as e:
        logger.error(f"Failed to create exam: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create exam"
        )

@app.put("/api/v1/admin/exams/{exam_id}", response_model=ExamResponse)
async def update_admin_exam(
    exam_id: str,
    exam_data: AdminExamUpdate,
    current_admin = Depends(get_current_admin_user)
):
    """Update exam details"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Check if exam exists
        exam = db.exams.find_one({"_id": ObjectId(exam_id)})
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        # Build update document
        update_doc = {"updated_at": datetime.utcnow()}
        if exam_data.name is not None:
            update_doc["name"] = exam_data.name
        if exam_data.country is not None:
            update_doc["country"] = exam_data.country
        if exam_data.description is not None:
            update_doc["description"] = exam_data.description
        if exam_data.status is not None:
            update_doc["status"] = exam_data.status.value
        if exam_data.gradient is not None:
            update_doc["gradient"] = exam_data.gradient
        if exam_data.borderColor is not None:
            update_doc["borderColor"] = exam_data.borderColor
        if exam_data.bgColor is not None:
            update_doc["bgColor"] = exam_data.bgColor
        if exam_data.flag is not None:
            update_doc["flag"] = exam_data.flag
        
        # Update exam
        db.exams.update_one(
            {"_id": ObjectId(exam_id)},
            {"$set": update_doc}
        )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="update",
            resource_type="exam",
            resource_id=exam_id,
            details={"changes": update_doc}
        )
        
        # Return updated exam
        updated_exam = db.exams.find_one({"_id": ObjectId(exam_id)})
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
            for subject in updated_exam.get("subjects", [])
        ]
        
        return ExamResponse(
            id=str(updated_exam["_id"]),
            name=updated_exam["name"],
            country=updated_exam["country"],
            description=updated_exam["description"],
            subjects=subjects,
            total_questions=updated_exam.get("total_questions"),
            gradient=updated_exam.get("gradient"),
            borderColor=updated_exam.get("borderColor"),
            bgColor=updated_exam.get("bgColor"),
            flag=updated_exam.get("flag")
        )
    except Exception as e:
        logger.error(f"Failed to update exam: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update exam"
        )

@app.delete("/api/v1/admin/exams/{exam_id}")
async def delete_admin_exam(
    exam_id: str,
    current_admin = Depends(get_current_admin_user)
):
    """Delete exam and all related data"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Check if exam exists
        exam = db.exams.find_one({"_id": ObjectId(exam_id)})
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        # Get all subject IDs for this exam
        subject_ids = [subject["_id"] for subject in exam.get("subjects", [])]
        
        # Delete related data
        if subject_ids:
            db.questions.delete_many({"subject_id": {"$in": subject_ids}})
            db.user_answers.delete_many({"question_id": {"$in": [
                q["_id"] for q in db.questions.find({"subject_id": {"$in": subject_ids}})
            ]}})
        
        db.user_progress.delete_many({"exam_id": ObjectId(exam_id)})
        db.users.update_many(
            {"selected_exam_id": ObjectId(exam_id)},
            {"$set": {"selected_exam_id": None}}
        )
        
        # Delete exam
        db.exams.delete_one({"_id": ObjectId(exam_id)})
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="delete",
            resource_type="exam",
            resource_id=exam_id,
            details={"name": exam["name"], "subjects_count": len(subject_ids)}
        )
        
        return {"message": "Exam deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete exam: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete exam"
        )

# Admin Question Management Endpoints

@app.get("/api/v1/admin/subjects/{subject_id}/questions", response_model=AdminQuestionsListResponse)
async def get_admin_questions(
    subject_id: str,
    current_admin = Depends(get_current_admin_user),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    difficulty: Optional[QuestionDifficulty] = Query(None),
    status: Optional[QuestionStatus] = Query(None)
):
    """Get questions for a subject with admin details"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Build query filter
        query_filter = {"subject_id": ObjectId(subject_id)}
        if difficulty:
            query_filter["difficulty"] = difficulty.value
        if status:
            query_filter["status"] = status.value
        
        # Get total count for pagination
        total_count = db.questions.count_documents(query_filter)
        
        # Get paginated questions
        questions = list(db.questions.find(query_filter)
                        .sort("created_at", -1)
                        .skip(skip)
                        .limit(limit))
        
        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total_count + limit - 1) // limit  # Ceiling division
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="view",
            resource_type="questions",
            details={"subject_id": subject_id, "count": len(questions), "total_count": total_count}
        )
        
        question_responses = [
            AdminQuestionResponse(
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
            for question in questions
        ]
        
        # Return the proper AdminQuestionsListResponse model
        response_obj = AdminQuestionsListResponse(
            questions=question_responses,
            total_count=total_count,
            page=page,
            page_size=limit,
            total_pages=total_pages
        )
        
        
        return response_obj
    except Exception as e:
        logger.error(f"Failed to get questions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve questions"
        )
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Build query filter
        query_filter = {"subject_id": ObjectId(subject_id)}
        if difficulty:
            query_filter["difficulty"] = difficulty.value
        if status:
            query_filter["status"] = status.value
        
        # Get total count for pagination
        total_count = db.questions.count_documents(query_filter)
        
        # Get paginated questions
        questions = list(db.questions.find(query_filter)
                        .sort("created_at", -1)
                        .skip(skip)
                        .limit(limit))
        
        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total_count + limit - 1) // limit  # Ceiling division
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="view",
            resource_type="questions",
            details={"subject_id": subject_id, "count": len(questions), "total_count": total_count}
        )
        
        question_responses = [
            AdminQuestionResponse(
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
            for question in questions
        ]
        
        # Return the proper AdminQuestionsListResponse model
        response_obj = AdminQuestionsListResponse(
            questions=question_responses,
            total_count=total_count,
            page=page,
            page_size=limit,
            total_pages=total_pages
        )
        
        # DEBUG: Log what we're returning
        logger.info(f"DEBUG: Returning AdminQuestionsListResponse with {len(question_responses)} questions")
        logger.info(f"DEBUG: Response type: {type(response_obj)}")
        logger.info(f"DEBUG: Response dict keys: {response_obj.dict().keys()}")
        
        return response_obj
    except Exception as e:
        logger.error(f"Failed to get questions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve questions"
        )

@app.post("/api/v1/admin/subjects/{subject_id}/questions", response_model=AdminQuestionResponse)
async def create_admin_question(
    subject_id: str,
    question_data: AdminQuestionCreate,
    current_admin = Depends(get_current_admin_user)
):
    """Create a new question"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Verify subject exists
        exam = db.exams.find_one({"subjects._id": ObjectId(subject_id)})
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subject not found"
            )
        
        # Create question document
        question_doc = {
            "subject_id": ObjectId(subject_id),
            "question": question_data.question,
            "question_type": question_data.question_type.value,
            "difficulty": question_data.difficulty.value,
            "options": [{"id": opt.id, "text": opt.text} for opt in question_data.options],
            "correct_answer": question_data.correct_answer,
            "explanation": {
                "reasoning": question_data.explanation.reasoning,
                "concept": question_data.explanation.concept,
                "sources": question_data.explanation.sources,
                "bias_check": question_data.explanation.bias_check,
                "reflection": question_data.explanation.reflection
            },
            "tags": question_data.tags,
            "status": question_data.status.value,
            "duration": question_data.duration,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": ObjectId(current_admin["_id"])
        }
        
        # Insert question
        result = db.questions.insert_one(question_doc)
        question_id = str(result.inserted_id)
        
        # Update subject question count and duration based on actual questions
        actual_question_count = db.questions.count_documents({"subject_id": ObjectId(subject_id)})
        total_duration_pipeline = [
            {"$match": {"subject_id": ObjectId(subject_id)}},
            {"$group": {"_id": None, "total_duration": {"$sum": "$duration"}}}
        ]
        duration_result = list(db.questions.aggregate(total_duration_pipeline))
        total_duration = duration_result[0]["total_duration"] if duration_result else 0
        
        # Convert total duration from seconds to minutes for display
        duration_minutes = f"{total_duration // 60} min" if total_duration > 0 else "0 min"
        
        db.exams.update_one(
            {"subjects._id": ObjectId(subject_id)},
            {"$set": {
                "subjects.$.total_questions": actual_question_count,
                "subjects.$.duration": duration_minutes
            }}
        )
        
        # Update exam total questions based on actual question counts
        updated_exam = db.exams.find_one({"subjects._id": ObjectId(subject_id)})
        total_exam_questions = 0
        for subject in updated_exam.get("subjects", []):
            subject_question_count = db.questions.count_documents({"subject_id": subject["_id"]})
            total_exam_questions += subject_question_count
        
        db.exams.update_one(
            {"_id": updated_exam["_id"]},
            {"$set": {"total_questions": total_exam_questions}}
        )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="create",
            resource_type="question",
            resource_id=question_id,
            details={"subject_id": subject_id, "difficulty": question_data.difficulty.value}
        )
        
        # Return created question
        created_question = db.questions.find_one({"_id": result.inserted_id})
        return AdminQuestionResponse(
            id=str(created_question["_id"]),
            subject_id=str(created_question["subject_id"]),
            question=created_question["question"],
            question_type=QuestionType(created_question["question_type"]),
            difficulty=QuestionDifficulty(created_question["difficulty"]),
            options=[
                Option(id=option["id"], text=option["text"])
                for option in created_question["options"]
            ],
            correct_answer=created_question["correct_answer"],
            explanation=Explanation(
                reasoning=created_question["explanation"]["reasoning"],
                concept=created_question["explanation"]["concept"],
                sources=created_question["explanation"]["sources"],
                bias_check=created_question["explanation"]["bias_check"],
                reflection=created_question["explanation"]["reflection"]
            ),
            tags=created_question["tags"],
            status=QuestionStatus(created_question["status"]),
            duration=created_question.get("duration", 60),
            created_at=created_question["created_at"],
            updated_at=created_question["updated_at"],
            created_by=str(created_question["created_by"])
        )
    except Exception as e:
        logger.error(f"Failed to create question: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create question"
        )

@app.put("/api/v1/admin/subjects/{subject_id}/questions/{question_id}", response_model=AdminQuestionResponse)
async def update_admin_question(
    subject_id: str,
    question_id: str,
    question_data: AdminQuestionUpdate,
    current_admin = Depends(get_current_admin_user)
):
    """Update an existing question"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Check if question exists
        question = db.questions.find_one({"_id": ObjectId(question_id), "subject_id": ObjectId(subject_id)})
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        # Build update document
        update_doc = {"updated_at": datetime.utcnow()}
        if question_data.question is not None:
            update_doc["question"] = question_data.question
        if question_data.question_type is not None:
            update_doc["question_type"] = question_data.question_type.value
        if question_data.difficulty is not None:
            update_doc["difficulty"] = question_data.difficulty.value
        if question_data.options is not None:
            update_doc["options"] = [{"id": opt.id, "text": opt.text} for opt in question_data.options]
        if question_data.correct_answer is not None:
            update_doc["correct_answer"] = question_data.correct_answer
        if question_data.explanation is not None:
            update_doc["explanation"] = {
                "reasoning": question_data.explanation.reasoning,
                "concept": question_data.explanation.concept,
                "sources": question_data.explanation.sources,
                "bias_check": question_data.explanation.bias_check,
                "reflection": question_data.explanation.reflection
            }
        if question_data.tags is not None:
            update_doc["tags"] = question_data.tags
        if question_data.status is not None:
            update_doc["status"] = question_data.status.value
        if question_data.duration is not None:
            update_doc["duration"] = question_data.duration
        
        # Update question
        db.questions.update_one(
            {"_id": ObjectId(question_id)},
            {"$set": update_doc}
        )
        
        # Update subject duration if duration was changed
        if question_data.duration is not None:
            total_duration_pipeline = [
                {"$match": {"subject_id": ObjectId(subject_id)}},
                {"$group": {"_id": None, "total_duration": {"$sum": "$duration"}}}
            ]
            duration_result = list(db.questions.aggregate(total_duration_pipeline))
            total_duration = duration_result[0]["total_duration"] if duration_result else 0
            duration_minutes = f"{total_duration // 60} min" if total_duration > 0 else "0 min"
            
            db.exams.update_one(
                {"subjects._id": ObjectId(subject_id)},
                {"$set": {"subjects.$.duration": duration_minutes}}
            )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="update",
            resource_type="question",
            resource_id=question_id,
            details={"subject_id": subject_id, "changes": update_doc}
        )
        
        # Return updated question
        updated_question = db.questions.find_one({"_id": ObjectId(question_id)})
        return AdminQuestionResponse(
            id=str(updated_question["_id"]),
            subject_id=str(updated_question["subject_id"]),
            question=updated_question["question"],
            question_type=QuestionType(updated_question["question_type"]),
            difficulty=QuestionDifficulty(updated_question["difficulty"]),
            options=[
                Option(id=option["id"], text=option["text"])
                for option in updated_question["options"]
            ],
            correct_answer=updated_question["correct_answer"],
            explanation=Explanation(
                reasoning=updated_question["explanation"]["reasoning"],
                concept=updated_question["explanation"]["concept"],
                sources=updated_question["explanation"]["sources"],
                bias_check=updated_question["explanation"]["bias_check"],
                reflection=updated_question["explanation"]["reflection"]
            ),
            tags=updated_question["tags"],
            status=QuestionStatus(updated_question["status"]),
            duration=updated_question.get("duration", 60),
            created_at=updated_question["created_at"],
            updated_at=updated_question["updated_at"],
            created_by=str(updated_question["created_by"]) if updated_question.get("created_by") else None
        )
    except Exception as e:
        logger.error(f"Failed to update question: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update question"
        )

@app.delete("/api/v1/admin/subjects/{subject_id}/questions/{question_id}")
async def delete_admin_question(
    subject_id: str,
    question_id: str,
    current_admin = Depends(get_current_admin_user)
):
    """Delete a question"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Check if question exists
        question = db.questions.find_one({"_id": ObjectId(question_id), "subject_id": ObjectId(subject_id)})
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        # Delete question
        db.questions.delete_one({"_id": ObjectId(question_id)})
        
        # Delete related user answers
        db.user_answers.delete_many({"question_id": ObjectId(question_id)})
        
        # Update subject question count and duration based on remaining questions
        actual_question_count = db.questions.count_documents({"subject_id": ObjectId(subject_id)})
        total_duration_pipeline = [
            {"$match": {"subject_id": ObjectId(subject_id)}},
            {"$group": {"_id": None, "total_duration": {"$sum": "$duration"}}}
        ]
        duration_result = list(db.questions.aggregate(total_duration_pipeline))
        total_duration = duration_result[0]["total_duration"] if duration_result else 0
        duration_minutes = f"{total_duration // 60} min" if total_duration > 0 else "0 min"
        
        db.exams.update_one(
            {"subjects._id": ObjectId(subject_id)},
            {"$set": {
                "subjects.$.total_questions": actual_question_count,
                "subjects.$.duration": duration_minutes
            }}
        )
        
        # Update exam total questions
        exam = db.exams.find_one({"subjects._id": ObjectId(subject_id)})
        total_exam_questions = 0
        for subject in exam.get("subjects", []):
            subject_question_count = db.questions.count_documents({"subject_id": subject["_id"]})
            total_exam_questions += subject_question_count
        
        db.exams.update_one(
            {"_id": exam["_id"]},
            {"$set": {"total_questions": total_exam_questions}}
        )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="delete",
            resource_type="question",
            resource_id=question_id,
            details={"subject_id": subject_id, "question": question["question"]}
        )
        
        return {"message": "Question deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete question: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete question"
        )

# Admin Analytics Endpoints
@app.get("/api/v1/admin/analytics/users", response_model=UserAnalytics)
async def get_user_analytics(current_admin = Depends(get_current_admin_user)):
    """Get user analytics data"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Calculate user metrics
        total_users = db.users.count_documents({})
        active_users = db.users.count_documents({"status": {"$ne": "inactive"}})
        
        # New registrations in last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        new_registrations = db.users.count_documents({"created_at": {"$gte": thirty_days_ago}})
        
        # Mock retention rate calculation
        user_retention_rate = 85.5
        
        # Mock geographic distribution
        geographic_distribution = {
            "US": 45,
            "UK": 20,
            "CA": 15,
            "AU": 10,
            "Other": 10
        }
        
        # Mock engagement metrics
        engagement_metrics = {
            "avg_session_duration": 25.5,
            "daily_active_users": 150,
            "weekly_active_users": 450,
            "monthly_active_users": 1200
        }
        
        return UserAnalytics(
            total_users=total_users,
            active_users=active_users,
            new_registrations=new_registrations,
            user_retention_rate=user_retention_rate,
            geographic_distribution=geographic_distribution,
            engagement_metrics=engagement_metrics
        )
    except Exception as e:
        logger.error(f"Failed to get user analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user analytics"
        )

# Admin System Settings Endpoints
@app.get("/api/v1/admin/system/settings", response_model=List[SystemSettings])
async def get_system_settings(current_admin = Depends(get_current_super_admin_user)):
    """Get system settings (super admin only)"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        settings = list(db.system_settings.find({}))
        return [
            SystemSettings(
                category=setting["category"],
                settings=setting["settings"],
                updated_by=str(setting["updated_by"]),
                updated_at=setting["updated_at"]
            )
            for setting in settings
        ]
    except Exception as e:
        logger.error(f"Failed to get system settings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve system settings"
        )

@app.put("/api/v1/admin/system/settings/{category}")
async def update_system_settings(
    category: str,
    settings_data: Dict[str, Any],
    current_admin = Depends(get_current_super_admin_user)
):
    """Update system settings (super admin only)"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Update or create settings
        db.system_settings.update_one(
            {"category": category},
            {
                "$set": {
                    "settings": settings_data,
                    "updated_by": ObjectId(current_admin["_id"]),
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="update",
            resource_type="system_settings",
            resource_id=category,
            details={"category": category}
        )
        
        return {"message": "Settings updated successfully"}
    except Exception as e:
        logger.error(f"Failed to update system settings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update system settings"
        )

# Admin Preferences Endpoints
@app.get("/api/v1/admin/preferences", response_model=AdminPreferences)
async def get_admin_preferences(current_admin = Depends(get_current_admin_user)):
    """Get admin notification preferences"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        admin_id = ObjectId(current_admin["_id"])
        preferences = db.admin_preferences.find_one({"admin_id": admin_id})
        
        if not preferences:
            # Create default preferences if none exist
            default_preferences = {
                "admin_id": admin_id,
                "system_alerts": True,
                "user_activity": True,
                "weekly_reports": False,
                "emergency_alerts": True,
                "maintenance_updates": True,
                "feature_updates": False,
                "two_factor": False,
                "login_alerts": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = db.admin_preferences.insert_one(default_preferences)
            preferences = db.admin_preferences.find_one({"_id": result.inserted_id})
        
        return AdminPreferences(
            admin_id=str(preferences["admin_id"]),
            system_alerts=preferences.get("system_alerts", True),
            user_activity=preferences.get("user_activity", True),
            weekly_reports=preferences.get("weekly_reports", False),
            emergency_alerts=preferences.get("emergency_alerts", True),
            maintenance_updates=preferences.get("maintenance_updates", True),
            feature_updates=preferences.get("feature_updates", False),
            two_factor=preferences.get("two_factor", False),
            login_alerts=preferences.get("login_alerts", True),
            created_at=preferences["created_at"],
            updated_at=preferences["updated_at"]
        )
    except Exception as e:
        logger.error(f"Failed to get admin preferences: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve admin preferences"
        )

@app.put("/api/v1/admin/preferences", response_model=AdminPreferences)
async def update_admin_preferences(
    preferences_data: AdminPreferencesUpdate,
    current_admin = Depends(get_current_admin_user)
):
    """Update admin notification preferences"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        admin_id = ObjectId(current_admin["_id"])
        
        # Build update document
        update_doc = {"updated_at": datetime.utcnow()}
        if preferences_data.system_alerts is not None:
            update_doc["system_alerts"] = preferences_data.system_alerts
        if preferences_data.user_activity is not None:
            update_doc["user_activity"] = preferences_data.user_activity
        if preferences_data.weekly_reports is not None:
            update_doc["weekly_reports"] = preferences_data.weekly_reports
        if preferences_data.emergency_alerts is not None:
            update_doc["emergency_alerts"] = preferences_data.emergency_alerts
        if preferences_data.maintenance_updates is not None:
            update_doc["maintenance_updates"] = preferences_data.maintenance_updates
        if preferences_data.feature_updates is not None:
            update_doc["feature_updates"] = preferences_data.feature_updates
        if preferences_data.two_factor is not None:
            update_doc["two_factor"] = preferences_data.two_factor
        if preferences_data.login_alerts is not None:
            update_doc["login_alerts"] = preferences_data.login_alerts
        
        # Update or create preferences
        db.admin_preferences.update_one(
            {"admin_id": admin_id},
            {"$set": update_doc},
            upsert=True
        )
        
        # Log admin activity
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="update",
            resource_type="admin_preferences",
            details={"changes": update_doc}
        )
        
        # Return updated preferences
        updated_preferences = db.admin_preferences.find_one({"admin_id": admin_id})
        return AdminPreferences(
            admin_id=str(updated_preferences["admin_id"]),
            system_alerts=updated_preferences.get("system_alerts", True),
            user_activity=updated_preferences.get("user_activity", True),
            weekly_reports=updated_preferences.get("weekly_reports", False),
            emergency_alerts=updated_preferences.get("emergency_alerts", True),
            maintenance_updates=updated_preferences.get("maintenance_updates", True),
            feature_updates=updated_preferences.get("feature_updates", False),
            two_factor=updated_preferences.get("two_factor", False),
            login_alerts=updated_preferences.get("login_alerts", True),
            created_at=updated_preferences["created_at"],
            updated_at=updated_preferences["updated_at"]
        )
    except Exception as e:
        logger.error(f"Failed to update admin preferences: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update admin preferences"
        )

# Enhanced System Settings Endpoints
@app.get("/api/v1/admin/settings/{category}")
async def get_system_settings_by_category(
    category: str,
    current_admin = Depends(get_current_super_admin_user)
):
    """Get system settings by category (super admin only)"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        settings = db.system_settings.find_one({"category": category})
        if not settings:
            # Return default settings for the category
            default_settings = get_default_settings_for_category(category)
            return {"category": category, "settings": default_settings}
        
        return {
            "category": settings["category"],
            "settings": settings["settings"],
            "updated_by": str(settings["updated_by"]),
            "updated_at": settings["updated_at"]
        }
    except Exception as e:
        logger.error(f"Failed to get system settings for category {category}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve {category} settings"
        )

@app.put("/api/v1/admin/settings/{category}")
async def update_system_settings_by_category(
    category: str,
    settings_data: Dict[str, Any],
    current_admin = Depends(get_current_super_admin_user)
):
    """Update system settings by category (super admin only)"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Update or create settings
        db.system_settings.update_one(
            {"category": category},
            {
                "$set": {
                    "settings": settings_data,
                    "updated_by": ObjectId(current_admin["_id"]),
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        # Log admin activity (don't convert category to ObjectId)
        log_admin_activity(
            admin_id=str(current_admin["_id"]),
            action="update",
            resource_type="system_settings",
            resource_id=None,  # Category is not an ObjectId
            details={"category": category}
        )
        
        return {"message": f"{category.title()} settings updated successfully"}
    except Exception as e:
        logger.error(f"Failed to update system settings for category {category}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update {category} settings"
        )

# Analytics Endpoints
@app.get("/api/v1/admin/analytics/performance")
async def get_performance_metrics(
    timeRange: str = Query("7d", description="Time range: 1d, 7d, 30d, 90d"),
    current_admin = Depends(get_current_admin_user)
):
    """Get performance metrics for the specified time range"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Calculate time range
        now = datetime.utcnow()
        if timeRange == "1d":
            start_time = now - timedelta(days=1)
        elif timeRange == "7d":
            start_time = now - timedelta(days=7)
        elif timeRange == "30d":
            start_time = now - timedelta(days=30)
        elif timeRange == "90d":
            start_time = now - timedelta(days=90)
        else:
            start_time = now - timedelta(days=7)
        
        # Get analytics metrics from database
        metrics = list(db.analytics_metrics.find({
            "metric_type": "system_performance",
            "date": {"$gte": start_time}
        }).sort("date", -1))
        
        if not metrics:
            # Return mock performance data if no metrics exist
            return {
                "response_time": 45.2,
                "throughput": 1250.0,
                "error_rate": 0.1,
                "cpu_usage": 35.5,
                "memory_usage": 68.2,
                "active_connections": 25,
                "timestamp": now.isoformat(),
                "time_range": timeRange
            }
        
        # Calculate averages from metrics
        avg_response_time = sum(m.get("metadata", {}).get("response_time", 0) for m in metrics) / len(metrics)
        avg_throughput = sum(m.get("metadata", {}).get("throughput", 0) for m in metrics) / len(metrics)
        avg_error_rate = sum(m.get("metadata", {}).get("error_rate", 0) for m in metrics) / len(metrics)
        
        return {
            "response_time": round(avg_response_time, 2),
            "throughput": round(avg_throughput, 2),
            "error_rate": round(avg_error_rate, 2),
            "cpu_usage": 35.5,  # Mock data
            "memory_usage": 68.2,  # Mock data
            "active_connections": 25,  # Mock data
            "timestamp": now.isoformat(),
            "time_range": timeRange
        }
    except Exception as e:
        logger.error(f"Failed to get performance metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve performance metrics"
        )

@app.get("/api/v1/admin/analytics/trends")
async def get_trending_data(
    metric: str = Query("user_engagement", description="Metric name"),
    timeRange: str = Query("7d", description="Time range: 1d, 7d, 30d, 90d"),
    current_admin = Depends(get_current_admin_user)
):
    """Get trending data for the specified metric and time range"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Calculate time range
        now = datetime.utcnow()
        if timeRange == "1d":
            start_time = now - timedelta(days=1)
        elif timeRange == "7d":
            start_time = now - timedelta(days=7)
        elif timeRange == "30d":
            start_time = now - timedelta(days=30)
        elif timeRange == "90d":
            start_time = now - timedelta(days=90)
        else:
            start_time = now - timedelta(days=7)
        
        # Get time series data from database
        time_series = list(db.time_series_data.find({
            "metric_name": metric,
            "timestamp": {"$gte": start_time}
        }).sort("timestamp", 1))
        
        if not time_series:
            # Return mock trending data if no data exists
            mock_data = []
            days = 7 if timeRange == "7d" else 30 if timeRange == "30d" else 1
            for i in range(days):
                date = start_time + timedelta(days=i)
                mock_data.append({
                    "timestamp": date.isoformat(),
                    "value": 100 + (i * 5) + (i % 3 * 10),  # Mock trending up data
                    "date": date.strftime("%Y-%m-%d")
                })
            
            return {
                "metric_name": metric,
                "data_points": mock_data,
                "time_range": timeRange,
                "trend_direction": "up",
                "percentage_change": 15.5
            }
        
        # Process real data
        data_points = []
        for ts in time_series:
            data_points.append({
                "timestamp": ts["timestamp"].isoformat(),
                "value": ts["value"],
                "date": ts["timestamp"].strftime("%Y-%m-%d")
            })
        
        # Calculate trend direction
        if len(data_points) >= 2:
            first_value = data_points[0]["value"]
            last_value = data_points[-1]["value"]
            percentage_change = ((last_value - first_value) / first_value) * 100
            trend_direction = "up" if percentage_change > 5 else "down" if percentage_change < -5 else "stable"
        else:
            percentage_change = 0
            trend_direction = "stable"
        
        return {
            "metric_name": metric,
            "data_points": data_points,
            "time_range": timeRange,
            "trend_direction": trend_direction,
            "percentage_change": round(percentage_change, 2)
        }
    except Exception as e:
        logger.error(f"Failed to get trending data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trending data"
        )

# Test Results Endpoints
@app.post("/api/v1/test-sessions", response_model=dict)
async def create_test_session(
    exam_id: str,
    subject_id: str,
    current_user = Depends(get_current_user)
):
    """Create a new test session"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Validate exam and subject exist
        exam = db.exams.find_one({"_id": ObjectId(exam_id)})
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
        
        # Create test session
        session_doc = {
            "user_id": ObjectId(current_user["_id"]),
            "exam_id": ObjectId(exam_id),
            "subject_id": ObjectId(subject_id),
            "start_time": datetime.utcnow(),
            "end_time": None,
            "status": "in_progress",
            "answers": [],
            "created_at": datetime.utcnow()
        }
        
        result = db.test_sessions.insert_one(session_doc)
        session_id = str(result.inserted_id)
        
        return {"session_id": session_id, "status": "created"}
    except Exception as e:
        logger.error(f"Failed to create test session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create test session"
        )

@app.put("/api/v1/test-sessions/{session_id}/complete")
async def complete_test_session(
    session_id: str,
    current_user = Depends(get_current_user)
):
    """Complete a test session"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Update test session
        db.test_sessions.update_one(
            {"_id": ObjectId(session_id), "user_id": ObjectId(current_user["_id"])},
            {
                "$set": {
                    "end_time": datetime.utcnow(),
                    "status": "completed"
                }
            }
        )
        
        return {"message": "Test session completed"}
    except Exception as e:
        logger.error(f"Failed to complete test session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete test session"
        )

@app.get("/api/v1/test-results/{exam_id}/{subject_id}", response_model=TestSessionResult)
async def get_test_results(
    exam_id: str,
    subject_id: str,
    current_user = Depends(get_current_user)
):
    """Get detailed test results for a user's most recent session"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Get the most recent completed test session for this user, exam, and subject
        session = db.test_sessions.find_one({
            "user_id": ObjectId(current_user["_id"]),
            "exam_id": ObjectId(exam_id),
            "subject_id": ObjectId(subject_id),
            "status": "completed"
        }, sort=[("end_time", -1)])
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No completed test session found"
            )
        
        # Get exam and subject details
        exam = db.exams.find_one({"_id": ObjectId(exam_id)})
        subject = next((s for s in exam.get("subjects", []) if str(s["_id"]) == subject_id), None)
        
        if not exam or not subject:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam or subject not found"
            )
        
        # Get user answers for this session
        user_answers = list(db.user_answers.find({
            "user_id": ObjectId(current_user["_id"]),
            "answered_at": {
                "$gte": session["start_time"],
                "$lte": session["end_time"]
            }
        }))
        
        # Get questions and build detailed results
        question_details = []
        topic_stats = {}
        correct_count = 0
        
        for i, answer in enumerate(user_answers):
            question = db.questions.find_one({"_id": answer["question_id"]})
            if question:
                is_correct = answer["is_correct"]
                if is_correct:
                    correct_count += 1
                
                # Track topic statistics
                topic = "General"  # Default topic, could be enhanced with actual topic data
                if topic not in topic_stats:
                    topic_stats[topic] = {"correct": 0, "total": 0}
                topic_stats[topic]["total"] += 1
                if is_correct:
                    topic_stats[topic]["correct"] += 1
                
                question_details.append(TestResultDetail(
                    question_id=str(question["_id"]),
                    question_number=i + 1,
                    question_text=question["question"],
                    selected_answer=answer["selected_option_id"],
                    correct_answer=question["correct_answer"],
                    is_correct=is_correct,
                    explanation=Explanation(
                        reasoning=question["explanation"]["reasoning"],
                        concept=question["explanation"]["concept"],
                        sources=question["explanation"]["sources"],
                        bias_check=question["explanation"]["bias_check"],
                        reflection=question["explanation"]["reflection"]
                    ),
                    topic=topic,
                    difficulty=question.get("difficulty", "medium"),
                    time_spent=None  # Could be calculated if we track timing
                ))
        
        total_questions = len(user_answers)
        score_percentage = (correct_count / total_questions * 100) if total_questions > 0 else 0
        
        # Calculate grade
        if score_percentage >= 90:
            grade = "A"
        elif score_percentage >= 80:
            grade = "B"
        elif score_percentage >= 70:
            grade = "C"
        elif score_percentage >= 60:
            grade = "D"
        else:
            grade = "F"
        
        # Build topic breakdown
        topic_breakdown = []
        for topic, stats in topic_stats.items():
            percentage = (stats["correct"] / stats["total"] * 100) if stats["total"] > 0 else 0
            topic_breakdown.append(TopicBreakdown(
                topic=topic,
                correct=stats["correct"],
                total=stats["total"],
                percentage=percentage
            ))
        
        # Generate study recommendations based on performance
        recommendations = []
        for topic_data in topic_breakdown:
            if topic_data.percentage < 70:
                priority = "High" if topic_data.percentage < 50 else "Medium"
                recommendations.append(StudyRecommendation(
                    area=topic_data.topic,
                    suggestion=f"Focus on {topic_data.topic.lower()} concepts and practice more problems",
                    priority=priority,
                    estimated_time="2-3 hours" if priority == "High" else "1-2 hours"
                ))
        
        # Calculate time spent
        time_diff = session["end_time"] - session["start_time"]
        total_seconds = int(time_diff.total_seconds())
        minutes = total_seconds // 60
        seconds = total_seconds % 60
        time_spent = f"{minutes}:{seconds:02d}"
        
        # Calculate percentile (mock calculation)
        percentile = min(95, int(score_percentage + 5))
        
        # Calculate improvement (mock calculation)
        improvement = 5.0  # Could be calculated from previous sessions
        
        return TestSessionResult(
            session_id=str(session["_id"]),
            user_id=str(session["user_id"]),
            exam_id=str(session["exam_id"]),
            subject_id=str(session["subject_id"]),
            exam_name=exam["name"],
            subject_name=subject["name"],
            start_time=session["start_time"],
            end_time=session["end_time"],
            total_questions=total_questions,
            correct_answers=correct_count,
            score_percentage=score_percentage,
            grade=grade,
            time_spent=time_spent,
            question_details=question_details,
            topic_breakdown=topic_breakdown,
            recommendations=recommendations,
            percentile=percentile,
            improvement=improvement
        )
    except Exception as e:
        logger.error(f"Failed to get test results: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve test results"
        )

# =============================================================================
# TUTOR API ENDPOINTS
# =============================================================================

class TutorDashboardStats(BaseModel):
    total_students: int
    active_sessions: int
    completed_sessions: int
    average_rating: float
    total_earnings: float
    upcoming_sessions: int

class TutorProfileUpdate(BaseModel):
    subjects: Optional[List[str]] = None
    qualifications: Optional[List[str]] = None
    bio: Optional[str] = None
    availability: Optional[Dict[str, Any]] = None
    hourly_rate: Optional[float] = None
    experience_years: Optional[int] = None
    languages: Optional[List[str]] = None

@app.get("/api/v1/tutor/dashboard", response_model=TutorDashboardStats)
async def get_tutor_dashboard(current_tutor = Depends(get_current_tutor_user)):
    """Get tutor dashboard statistics"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Mock data for now - in a real implementation, these would be calculated from actual data
        stats = TutorDashboardStats(
            total_students=15,
            active_sessions=3,
            completed_sessions=127,
            average_rating=4.8,
            total_earnings=2450.00,
            upcoming_sessions=5
        )
        
        return stats
    except Exception as e:
        logger.error(f"Failed to get tutor dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tutor dashboard"
        )

@app.get("/api/v1/tutor/profile", response_model=UserResponse)
async def get_tutor_profile(current_tutor = Depends(get_current_tutor_user)):
    """Get tutor profile information"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Get fresh user data from database
        user = get_user_by_id(str(current_tutor["_id"]))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Handle tutor data
        tutor_data = None
        if user.get("tutor_data"):
            tutor_data = TutorData(**user["tutor_data"])
        
        return UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            role=user.get("role", "tutor"),
            selected_exam_id=str(user["selected_exam_id"]) if user.get("selected_exam_id") else None,
            tutor_data=tutor_data,
            created_at=user["created_at"],
            updated_at=user["updated_at"]
        )
    except Exception as e:
        logger.error(f"Failed to get tutor profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tutor profile"
        )

@app.put("/api/v1/tutor/profile", response_model=UserResponse)
async def update_tutor_profile(
    profile_data: TutorProfileUpdate,
    current_tutor = Depends(get_current_tutor_user)
):
    """Update tutor profile information"""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available"
        )
    
    try:
        # Get current tutor data
        user = get_user_by_id(str(current_tutor["_id"]))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Build update document for tutor_data
        current_tutor_data = user.get("tutor_data", {})
        update_tutor_data = current_tutor_data.copy()
        
        if profile_data.subjects is not None:
            update_tutor_data["subjects"] = profile_data.subjects
        if profile_data.qualifications is not None:
            update_tutor_data["qualifications"] = profile_data.qualifications
        if profile_data.bio is not None:
            update_tutor_data["bio"] = profile_data.bio
        if profile_data.availability is not None:
            update_tutor_data["availability"] = profile_data.availability
        if profile_data.hourly_rate is not None:
            update_tutor_data["hourly_rate"] = profile_data.hourly_rate
        if profile_data.experience_years is not None:
            update_tutor_data["experience_years"] = profile_data.experience_years
        if profile_data.languages is not None:
            update_tutor_data["languages"] = profile_data.languages
        
        # Update user in database
        db.users.update_one(
            {"_id": ObjectId(current_tutor["_id"])},
            {
                "$set": {
                    "tutor_data": update_tutor_data,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Return updated user
        updated_user = get_user_by_id(str(current_tutor["_id"]))
        tutor_data = TutorData(**updated_user["tutor_data"]) if updated_user.get("tutor_data") else None
        
        return UserResponse(
            id=str(updated_user["_id"]),
            name=updated_user["name"],
            email=updated_user["email"],
            role=updated_user.get("role", "tutor"),
            selected_exam_id=str(updated_user["selected_exam_id"]) if updated_user.get("selected_exam_id") else None,
            tutor_data=tutor_data,
            created_at=updated_user["created_at"],
            updated_at=updated_user["updated_at"]
        )
    except Exception as e:
        logger.error(f"Failed to update tutor profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update tutor profile"
        )

def get_default_settings_for_category(category: str) -> Dict[str, Any]:
    """Get default settings for a specific category"""
    defaults = {
        "general": {
            "app_name": "Artori",
            "app_version": "1.0.0",
            "app_description": "AI-powered exam preparation platform",
            "maintenance_mode": False
        },
        "database": {
            "host": "localhost",
            "port": "27017",
            "name": "artori",
            "ssl_enabled": True
        },
        "email": {
            "smtp_host": "",
            "smtp_port": "587",
            "smtp_username": "",
            "smtp_password": "",
            "from_email": "noreply@artori.com"
        },
        "security": {
            "session_timeout": 60,
            "max_login_attempts": 5,
            "password_policy": {
                "min_length": 8,
                "require_uppercase": True,
                "require_lowercase": True,
                "require_numbers": True,
                "require_special_chars": True
            }
        },
        "localization": {
            "default_language": "en",
            "timezone": "UTC",
            "date_format": "YYYY-MM-DD"
        },
        "theme": {
            "primary_color": "#6366f1",
            "secondary_color": "#8b5cf6",
            "dark_mode_enabled": False
        }
    }
    return defaults.get(category, {})

def initialize_default_data():
    """Initialize database with default data"""
    if db is None:
        return
    
    try:
        # Initialize default system settings
        categories = ["general", "database", "email", "security", "localization", "theme"]
        for category in categories:
            existing = db.system_settings.find_one({"category": category})
            if not existing:
                default_settings = get_default_settings_for_category(category)
                db.system_settings.insert_one({
                    "category": category,
                    "settings": default_settings,
                    "updated_by": None,  # System initialization
                    "updated_at": datetime.utcnow()
                })
                logger.info(f"Initialized default {category} settings")
        
        # Initialize sample analytics data
        sample_metrics = [
            {
                "metric_type": "system_performance",
                "date": datetime.utcnow() - timedelta(days=1),
                "value": 45.2,
                "metadata": {
                    "response_time": 45.2,
                    "throughput": 1250.0,
                    "error_rate": 0.1
                },
                "created_at": datetime.utcnow()
            },
            {
                "metric_type": "user_engagement",
                "date": datetime.utcnow() - timedelta(days=1),
                "value": 85.5,
                "metadata": {
                    "active_users": 150,
                    "session_duration": 25.5
                },
                "created_at": datetime.utcnow()
            }
        ]
        
        for metric in sample_metrics:
            existing = db.analytics_metrics.find_one({
                "metric_type": metric["metric_type"],
                "date": metric["date"]
            })
            if not existing:
                db.analytics_metrics.insert_one(metric)
        
        logger.info("Database initialization completed")
    except Exception as e:
        logger.error(f"Failed to initialize default data: {e}")

# Initialize default data on startup
initialize_default_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)