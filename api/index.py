import sys
import os
import logging

# Configure logging for Vercel serverless environment
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("=== VERCEL SERVERLESS FUNCTION STARTING ===")

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(backend_path)
logger.info(f"Added backend path to sys.path: {backend_path}")

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
mongodb_uri = os.getenv("MONGODB_URI")
mongodb_url = os.getenv("MONGODB_URL")
if mongodb_uri or mongodb_url:
    mongodb_var = "MONGODB_URI" if mongodb_uri else "MONGODB_URL"
    logger.info(f"✅ MongoDB connection available via {mongodb_var}")
else:
    logger.error("❌ CRITICAL: Neither MONGODB_URI nor MONGODB_URL is available!")

try:
    logger.info("Attempting to import FastAPI app from main...")
    # Import the FastAPI app
    from main import app
    logger.info("✅ Successfully imported FastAPI app")
    
    # Test basic app functionality
    logger.info("Testing app routes...")
    route_count = len(app.routes)
    logger.info(f"✅ App has {route_count} routes registered")
    
except Exception as e:
    logger.error(f"❌ CRITICAL: Failed to import FastAPI app: {e}")
    logger.error(f"Error type: {type(e).__name__}")
    logger.error(f"Python path: {sys.path}")
    raise

logger.info("=== VERCEL SERVERLESS FUNCTION READY ===")

# Export the FastAPI app for Vercel's Python runtime
app = app