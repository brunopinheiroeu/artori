#!/usr/bin/env python3
"""
MongoDB Connection Diagnostic Script for Serverless Environment
This script helps diagnose MongoDB connection issues specific to Vercel serverless deployment.
"""

import os
import sys
import time
import logging
from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, ConfigurationError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_environment_variables():
    """Test if required environment variables are present"""
    logger.info("=== ENVIRONMENT VARIABLE DIAGNOSTIC ===")
    
    mongodb_uri = os.getenv("MONGODB_URI")
    jwt_secret = os.getenv("JWT_SECRET")
    
    if not mongodb_uri:
        logger.error("❌ MONGODB_URI environment variable is MISSING")
        return False
    else:
        logger.info("✅ MONGODB_URI is present")
        # Log partial URI for debugging (hide credentials)
        if "@" in mongodb_uri:
            parts = mongodb_uri.split("@")
            if len(parts) >= 2:
                logger.info(f"   MongoDB host: @{parts[1]}")
    
    if not jwt_secret:
        logger.error("❌ JWT_SECRET environment variable is MISSING")
        return False
    else:
        logger.info("✅ JWT_SECRET is present")
    
    return True

def test_connection_with_different_timeouts():
    """Test MongoDB connection with different timeout configurations"""
    logger.info("=== CONNECTION TIMEOUT DIAGNOSTIC ===")
    
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        logger.error("Cannot test connection - MONGODB_URI missing")
        return False
    
    # Test configurations for serverless environments
    test_configs = [
        {
            "name": "Current Production Settings",
            "config": {
                "tls": True,
                "tlsAllowInvalidCertificates": False,
                "maxPoolSize": 10,
                "minPoolSize": 1,
                "maxIdleTimeMS": 30000,
                "serverSelectionTimeoutMS": 5000,
                "connectTimeoutMS": 10000,
                "socketTimeoutMS": 20000,
                "retryWrites": True,
                "retryReads": True
            }
        },
        {
            "name": "Serverless Optimized Settings",
            "config": {
                "tls": True,
                "tlsAllowInvalidCertificates": False,
                "maxPoolSize": 1,  # Reduced for serverless
                "minPoolSize": 0,  # No minimum for serverless
                "maxIdleTimeMS": 10000,  # Shorter idle time
                "serverSelectionTimeoutMS": 15000,  # Longer for cold starts
                "connectTimeoutMS": 20000,  # Longer for cold starts
                "socketTimeoutMS": 30000,  # Longer for serverless
                "retryWrites": True,
                "retryReads": True
            }
        },
        {
            "name": "Minimal Settings",
            "config": {
                "serverSelectionTimeoutMS": 30000,  # Very long timeout
                "connectTimeoutMS": 30000,
                "socketTimeoutMS": 60000,
            }
        }
    ]
    
    results = []
    
    for test_config in test_configs:
        logger.info(f"\n--- Testing: {test_config['name']} ---")
        
        start_time = time.time()
        try:
            client = MongoClient(mongodb_uri, **test_config['config'])
            
            # Test connection
            client.admin.command('ping')
            
            # Test database access
            db = client.artori
            collections = db.list_collection_names()
            
            connection_time = time.time() - start_time
            
            logger.info(f"✅ Connection successful in {connection_time:.2f}s")
            logger.info(f"   Available collections: {collections}")
            
            results.append({
                "config": test_config['name'],
                "success": True,
                "time": connection_time,
                "collections": len(collections)
            })
            
            client.close()
            
        except ServerSelectionTimeoutError as e:
            connection_time = time.time() - start_time
            logger.error(f"❌ Server selection timeout after {connection_time:.2f}s: {e}")
            results.append({
                "config": test_config['name'],
                "success": False,
                "error": "ServerSelectionTimeoutError",
                "time": connection_time
            })
            
        except ConnectionFailure as e:
            connection_time = time.time() - start_time
            logger.error(f"❌ Connection failure after {connection_time:.2f}s: {e}")
            results.append({
                "config": test_config['name'],
                "success": False,
                "error": "ConnectionFailure",
                "time": connection_time
            })
            
        except Exception as e:
            connection_time = time.time() - start_time
            logger.error(f"❌ Unexpected error after {connection_time:.2f}s: {e}")
            results.append({
                "config": test_config['name'],
                "success": False,
                "error": str(type(e).__name__),
                "time": connection_time
            })
    
    return results

def test_connection_string_variations():
    """Test different MongoDB connection string formats"""
    logger.info("=== CONNECTION STRING DIAGNOSTIC ===")
    
    base_uri = os.getenv("MONGODB_URI")
    if not base_uri:
        logger.error("Cannot test connection strings - MONGODB_URI missing")
        return False
    
    # Extract components for testing
    if "mongodb+srv://" in base_uri:
        logger.info("✅ Using MongoDB+SRV format (recommended for Atlas)")
        
        # Test with explicit SSL parameters
        test_uris = [
            base_uri,  # Original
            base_uri + "&ssl=true&ssl_cert_reqs=CERT_REQUIRED",  # Explicit SSL
            base_uri + "&authSource=admin",  # Explicit auth source
        ]
        
        for i, uri in enumerate(test_uris):
            logger.info(f"\n--- Testing URI variation {i+1} ---")
            try:
                client = MongoClient(uri, serverSelectionTimeoutMS=10000)
                client.admin.command('ping')
                logger.info("✅ Connection successful")
                client.close()
            except Exception as e:
                logger.error(f"❌ Connection failed: {e}")
    
    else:
        logger.warning("⚠️ Not using MongoDB+SRV format - consider upgrading for Atlas")

def check_network_connectivity():
    """Check basic network connectivity to MongoDB Atlas"""
    logger.info("=== NETWORK CONNECTIVITY DIAGNOSTIC ===")
    
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        logger.error("Cannot test network - MONGODB_URI missing")
        return False
    
    # Extract hostname from URI
    if "@" in mongodb_uri:
        host_part = mongodb_uri.split("@")[1].split("/")[0]
        if ":" in host_part:
            hostname = host_part.split(":")[0]
        else:
            hostname = host_part
        
        logger.info(f"MongoDB hostname: {hostname}")
        
        # Test DNS resolution
        try:
            import socket
            ip_addresses = socket.gethostbyname_ex(hostname)
            logger.info(f"✅ DNS resolution successful: {ip_addresses[2]}")
        except Exception as e:
            logger.error(f"❌ DNS resolution failed: {e}")
            return False
        
        # Test basic connectivity (if possible)
        try:
            import socket
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(10)
            result = sock.connect_ex((hostname, 27017))
            sock.close()
            
            if result == 0:
                logger.info("✅ Basic TCP connectivity successful")
            else:
                logger.warning(f"⚠️ TCP connectivity test failed (code: {result})")
                logger.info("This might be normal for MongoDB Atlas with SRV records")
        except Exception as e:
            logger.warning(f"⚠️ TCP connectivity test error: {e}")
    
    return True

def generate_recommendations(results):
    """Generate recommendations based on test results"""
    logger.info("=== RECOMMENDATIONS ===")
    
    successful_configs = [r for r in results if r.get('success', False)]
    
    if not successful_configs:
        logger.error("❌ NO SUCCESSFUL CONNECTIONS - CRITICAL ISSUES DETECTED")
        logger.info("\n🔧 IMMEDIATE ACTIONS REQUIRED:")
        logger.info("1. Verify MONGODB_URI is correctly set in Vercel environment variables")
        logger.info("2. Check MongoDB Atlas Network Access settings:")
        logger.info("   - Add 0.0.0.0/0 to IP whitelist (allow all IPs)")
        logger.info("   - Or add Vercel's IP ranges if available")
        logger.info("3. Verify MongoDB Atlas cluster is running and accessible")
        logger.info("4. Check MongoDB Atlas user permissions")
        
    else:
        fastest_config = min(successful_configs, key=lambda x: x['time'])
        logger.info(f"✅ FASTEST SUCCESSFUL CONFIG: {fastest_config['config']}")
        logger.info(f"   Connection time: {fastest_config['time']:.2f}s")
        
        logger.info("\n🔧 SERVERLESS OPTIMIZATION RECOMMENDATIONS:")
        
        if fastest_config['config'] == "Serverless Optimized Settings":
            logger.info("✅ Serverless optimized settings work best")
            logger.info("   Recommended changes for main.py:")
            logger.info("   - maxPoolSize=1 (instead of 10)")
            logger.info("   - minPoolSize=0 (instead of 1)")
            logger.info("   - maxIdleTimeMS=10000 (instead of 30000)")
            logger.info("   - serverSelectionTimeoutMS=15000 (instead of 5000)")
            logger.info("   - connectTimeoutMS=20000 (instead of 10000)")
            logger.info("   - socketTimeoutMS=30000 (instead of 20000)")
        
        if any(r['time'] > 5 for r in successful_configs):
            logger.warning("⚠️ Slow connection times detected (>5s)")
            logger.info("   Consider implementing connection caching/reuse strategies")
        
        logger.info("\n🔧 VERCEL DEPLOYMENT RECOMMENDATIONS:")
        logger.info("1. Set environment variables in Vercel dashboard")
        logger.info("2. Consider using Vercel's edge functions for better performance")
        logger.info("3. Implement connection retry logic with exponential backoff")
        logger.info("4. Add MongoDB Atlas IP whitelist: 0.0.0.0/0 (all IPs)")

def main():
    """Main diagnostic function"""
    logger.info("🔍 MONGODB SERVERLESS CONNECTION DIAGNOSTIC")
    logger.info(f"Timestamp: {datetime.now().isoformat()}")
    logger.info("=" * 60)
    
    # Test 1: Environment Variables
    if not test_environment_variables():
        logger.error("❌ Environment variable test failed - cannot continue")
        return False
    
    # Test 2: Network Connectivity
    if not check_network_connectivity():
        logger.error("❌ Network connectivity test failed")
        return False
    
    # Test 3: Connection String Variations
    test_connection_string_variations()
    
    # Test 4: Different Timeout Configurations
    results = test_connection_with_different_timeouts()
    
    # Test 5: Generate Recommendations
    generate_recommendations(results)
    
    logger.info("\n" + "=" * 60)
    logger.info("🏁 DIAGNOSTIC COMPLETE")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        logger.info("\n⏹️ Diagnostic interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"💥 Unexpected error during diagnostic: {e}")
        sys.exit(1)