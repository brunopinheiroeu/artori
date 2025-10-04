import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the FastAPI app
from main import app

# Export the FastAPI app for Vercel's Python runtime
# This is the correct way to export for Vercel serverless functions
app = app