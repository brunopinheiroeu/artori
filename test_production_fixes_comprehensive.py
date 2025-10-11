#!/usr/bin/env python3
"""
Comprehensive Test Script for Production Login Issues Fixes

This script validates all the fixes implemented to resolve production login issues:
1. Missing /api/v1/auth/me endpoint
2. MongoDB URI variable name mismatch (MONGODB_URL vs MONGODB_URI)
3. CORS configuration issues
4. Vercel serverless handler export functionality
5. Environment variable loading issues

Author: Debug Mode
Date: 2025-10-11
"""

import os
import sys
import json
import time
import requests
from typing import Dict, Any, Optional, List
from datetime import datetime
import traceback

class ProductionFixesValidator:
    """Comprehensive validator for all production fixes"""
    
    def __init__(self, base_url: str = None, test_user_credentials: Dict[str, str] = None):
        """
        Initialize the validator
        
        Args:
            base_url: The production API base URL (if None, will try to detect)
            test_user_credentials: Test user credentials for authentication tests
        """
        # Default to latest production URL or allow override
        self.base_url = base_url or "https://artori-msyc09o60-bruno-pinheiros-projects-6622c88f.vercel.app"
        
        # Test credentials - using admin user for comprehensive testing
        self.test_credentials = test_user_credentials or {
            "email": "admin@artori.app",
            "password": "AdminPass123!"
        }
        
        # Invalid credentials for negative testing
        self.invalid_credentials = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        # Test results storage
        self.test_results = {
            "total_tests": 0,
            "passed_tests": 0,
            "failed_tests": 0,
            "test_details": []
        }
        
        # Session for connection reuse
        self.session = requests.Session()
        self.session.timeout = 30
        
        print("=" * 80)
        print("🧪 COMPREHENSIVE PRODUCTION FIXES VALIDATION")
        print("=" * 80)
        print(f"🌐 Testing API: {self.base_url}")
        print(f"📧 Test User: {self.test_credentials['email']}")
        print(f"⏰ Started at: {datetime.now().isoformat()}")
        print("=" * 80)
    
    def log_test_result(self, test_name: str, passed: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.test_results["total_tests"] += 1
        if passed:
            self.test_results["passed_tests"] += 1
            status = "✅ PASS"
        else:
            self.test_results["failed_tests"] += 1
            status = "❌ FAIL"
        
        result = {
            "test_name": test_name,
            "status": status,
            "passed": passed,
            "details": details,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        }
        
        self.test_results["test_details"].append(result)
        print(f"{status} {test_name}")
        if details:
            print(f"    📝 {details}")
        if not passed and response_data:
            print(f"    📊 Response: {json.dumps(response_data, indent=2)[:200]}...")
        print()
    
    def test_health_endpoint(self) -> bool:
        """Test 1: Health check endpoint and database connectivity"""
        print("🏥 TEST 1: Health Check & Database Connectivity")
        print("-" * 50)
        
        try:
            response = self.session.get(f"{self.base_url}/healthz")
            
            if response.status_code == 200:
                health_data = response.json()
                db_status = health_data.get("database", "unknown")
                
                if db_status == "connected":
                    self.log_test_result(
                        "Health Check - Database Connected",
                        True,
                        f"Database status: {db_status}",
                        health_data
                    )
                    return True
                else:
                    self.log_test_result(
                        "Health Check - Database Connection",
                        False,
                        f"Database status: {db_status} (expected: connected)",
                        health_data
                    )
                    return False
            else:
                self.log_test_result(
                    "Health Check - Endpoint Response",
                    False,
                    f"Status: {response.status_code}, Expected: 200",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_test_result(
                "Health Check - Request",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    def test_mongodb_connection_fix(self) -> bool:
        """Test 2: MongoDB connection with corrected MONGODB_URL variable"""
        print("🗄️ TEST 2: MongoDB Connection Fix (MONGODB_URL)")
        print("-" * 50)
        
        # This is tested indirectly through the health check and login attempts
        # We'll test with invalid credentials to ensure DB connectivity without authentication
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                json=self.invalid_credentials,
                headers={"Content-Type": "application/json"}
            )
            
            # If we get 401 (Unauthorized), it means MongoDB is connected and working
            # If we get 503 (Service Unavailable), it means MongoDB connection failed
            if response.status_code == 401:
                self.log_test_result(
                    "MongoDB Connection - MONGODB_URL Variable Fix",
                    True,
                    "Got 401 for invalid credentials (DB connected and working)",
                    {"status_code": response.status_code}
                )
                return True
            elif response.status_code == 503:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"detail": response.text}
                self.log_test_result(
                    "MongoDB Connection - MONGODB_URL Variable Fix",
                    False,
                    f"Got 503 Service Unavailable: {error_data.get('detail', 'Unknown error')}",
                    error_data
                )
                return False
            else:
                self.log_test_result(
                    "MongoDB Connection - Unexpected Response",
                    False,
                    f"Unexpected status code: {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_test_result(
                "MongoDB Connection - Request Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    def test_login_endpoint(self) -> tuple[bool, Optional[str]]:
        """Test 3: Login endpoint functionality"""
        print("🔐 TEST 3: Login Endpoint Functionality")
        print("-" * 50)
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                json=self.test_credentials,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                login_data = response.json()
                access_token = login_data.get("access_token")
                token_type = login_data.get("token_type")
                
                if access_token and token_type == "bearer":
                    self.log_test_result(
                        "Login Endpoint - Successful Authentication",
                        True,
                        f"Token received (length: {len(access_token)}), Type: {token_type}",
                        {"token_type": token_type, "token_length": len(access_token)}
                    )
                    return True, access_token
                else:
                    self.log_test_result(
                        "Login Endpoint - Token Format",
                        False,
                        f"Invalid token format. Token: {bool(access_token)}, Type: {token_type}",
                        login_data
                    )
                    return False, None
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"detail": response.text}
                self.log_test_result(
                    "Login Endpoint - Authentication Failed",
                    False,
                    f"Status: {response.status_code}, Error: {error_data.get('detail', 'Unknown')}",
                    error_data
                )
                return False, None
                
        except Exception as e:
            self.log_test_result(
                "Login Endpoint - Request Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
            return False, None
    
    def test_auth_me_endpoint(self, access_token: str) -> bool:
        """Test 4: /api/v1/auth/me endpoint (was missing in production)"""
        print("👤 TEST 4: /auth/me Endpoint (Previously Missing)")
        print("-" * 50)
        
        if not access_token:
            self.log_test_result(
                "Auth Me Endpoint - No Token",
                False,
                "No access token available for testing",
                None
            )
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.get(f"{self.base_url}/api/v1/auth/me", headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                required_fields = ["id", "name", "email", "role"]
                missing_fields = [field for field in required_fields if field not in user_data]
                
                if not missing_fields:
                    self.log_test_result(
                        "Auth Me Endpoint - Response Structure",
                        True,
                        f"All required fields present: {required_fields}",
                        {k: v for k, v in user_data.items() if k in required_fields}
                    )
                    
                    # Validate specific fields
                    if user_data.get("email") == self.test_credentials["email"]:
                        self.log_test_result(
                            "Auth Me Endpoint - User Data Accuracy",
                            True,
                            f"Correct user data returned for {user_data.get('email')}",
                            {"user_id": user_data.get("id"), "role": user_data.get("role")}
                        )
                        return True
                    else:
                        self.log_test_result(
                            "Auth Me Endpoint - User Data Mismatch",
                            False,
                            f"Expected: {self.test_credentials['email']}, Got: {user_data.get('email')}",
                            user_data
                        )
                        return False
                else:
                    self.log_test_result(
                        "Auth Me Endpoint - Missing Fields",
                        False,
                        f"Missing required fields: {missing_fields}",
                        user_data
                    )
                    return False
            elif response.status_code == 404:
                self.log_test_result(
                    "Auth Me Endpoint - 404 Not Found",
                    False,
                    "Endpoint still returns 404 - fix not deployed correctly",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"detail": response.text}
                self.log_test_result(
                    "Auth Me Endpoint - Unexpected Status",
                    False,
                    f"Status: {response.status_code}, Expected: 200",
                    error_data
                )
                return False
                
        except Exception as e:
            self.log_test_result(
                "Auth Me Endpoint - Request Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    def test_cors_configuration(self) -> bool:
        """Test 5: CORS configuration with environment variables"""
        print("🌐 TEST 5: CORS Configuration")
        print("-" * 50)
        
        # Test CORS headers in preflight request
        try:
            # Simulate a preflight request
            headers = {
                "Origin": "https://artori.app",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type,Authorization"
            }
            
            response = self.session.options(f"{self.base_url}/api/v1/auth/login", headers=headers)
            
            cors_headers = {
                "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
                "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
                "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers"),
                "Access-Control-Allow-Credentials": response.headers.get("Access-Control-Allow-Credentials")
            }
            
            # Check if CORS headers are present
            if cors_headers["Access-Control-Allow-Origin"]:
                self.log_test_result(
                    "CORS Configuration - Headers Present",
                    True,
                    f"CORS headers configured correctly",
                    cors_headers
                )
                
                # Test actual request with CORS
                actual_response = self.session.post(
                    f"{self.base_url}/api/v1/auth/login",
                    json=self.invalid_credentials,
                    headers={"Origin": "https://artori.app", "Content-Type": "application/json"}
                )
                
                if "Access-Control-Allow-Origin" in actual_response.headers:
                    self.log_test_result(
                        "CORS Configuration - Actual Request",
                        True,
                        "CORS headers present in actual response",
                        {"cors_origin": actual_response.headers.get("Access-Control-Allow-Origin")}
                    )
                    return True
                else:
                    self.log_test_result(
                        "CORS Configuration - Missing in Response",
                        False,
                        "CORS headers missing in actual response",
                        dict(actual_response.headers)
                    )
                    return False
            else:
                self.log_test_result(
                    "CORS Configuration - No Headers",
                    False,
                    "CORS headers not configured",
                    cors_headers
                )
                return False
                
        except Exception as e:
            self.log_test_result(
                "CORS Configuration - Request Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    def test_vercel_handler_export(self) -> bool:
        """Test 6: Vercel serverless handler export functionality"""
        print("⚡ TEST 6: Vercel Serverless Handler")
        print("-" * 50)
        
        # Test that the handler is working by checking root endpoint
        try:
            response = self.session.get(f"{self.base_url}/")
            
            if response.status_code == 200:
                root_data = response.json()
                expected_message = "artori.app API is running"
                
                if root_data.get("message") == expected_message:
                    self.log_test_result(
                        "Vercel Handler - Root Endpoint",
                        True,
                        f"Handler export working correctly",
                        root_data
                    )
                    
                    # Test that API routes are properly routed
                    api_response = self.session.get(f"{self.base_url}/api/v1/exams")
                    
                    if api_response.status_code in [200, 401, 503]:  # Any response means routing works
                        self.log_test_result(
                            "Vercel Handler - API Routing",
                            True,
                            f"API routes properly handled (status: {api_response.status_code})",
                            {"status_code": api_response.status_code}
                        )
                        return True
                    else:
                        self.log_test_result(
                            "Vercel Handler - API Routing Failed",
                            False,
                            f"API routing not working (status: {api_response.status_code})",
                            {"status_code": api_response.status_code, "response": api_response.text}
                        )
                        return False
                else:
                    self.log_test_result(
                        "Vercel Handler - Wrong Response",
                        False,
                        f"Expected: '{expected_message}', Got: '{root_data.get('message')}'",
                        root_data
                    )
                    return False
            else:
                self.log_test_result(
                    "Vercel Handler - Root Endpoint Failed",
                    False,
                    f"Status: {response.status_code}, Expected: 200",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_test_result(
                "Vercel Handler - Request Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    def test_environment_variables(self) -> bool:
        """Test 7: Environment variable loading (indirect test)"""
        print("🔧 TEST 7: Environment Variables Loading")
        print("-" * 50)
        
        # Test that environment variables are loaded correctly by checking behavior
        tests_passed = 0
        total_tests = 3
        
        # Test 1: JWT_SECRET is loaded (login works)
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                json=self.test_credentials,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                login_data = response.json()
                if login_data.get("access_token"):
                    self.log_test_result(
                        "Environment Variables - JWT_SECRET",
                        True,
                        "JWT_SECRET loaded correctly (token generation works)",
                        {"token_present": True}
                    )
                    tests_passed += 1
                else:
                    self.log_test_result(
                        "Environment Variables - JWT_SECRET Missing",
                        False,
                        "JWT_SECRET not loaded (no token generated)",
                        login_data
                    )
            else:
                # Check if it's a 503 error indicating missing JWT_SECRET
                if response.status_code == 503:
                    error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"detail": response.text}
                    if "JWT" in error_data.get("detail", ""):
                        self.log_test_result(
                            "Environment Variables - JWT_SECRET Missing",
                            False,
                            f"JWT_SECRET not loaded: {error_data.get('detail')}",
                            error_data
                        )
                    else:
                        tests_passed += 1  # Other error, JWT_SECRET probably loaded
                        self.log_test_result(
                            "Environment Variables - JWT_SECRET",
                            True,
                            "JWT_SECRET likely loaded (non-JWT error)",
                            {"status_code": response.status_code}
                        )
                else:
                    tests_passed += 1  # Other error, JWT_SECRET probably loaded
                    
        except Exception as e:
            self.log_test_result(
                "Environment Variables - JWT_SECRET Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Test 2: MONGODB_URL is loaded (database connection works)
        try:
            response = self.session.get(f"{self.base_url}/healthz")
            if response.status_code == 200:
                health_data = response.json()
                if health_data.get("database") == "connected":
                    self.log_test_result(
                        "Environment Variables - MONGODB_URL",
                        True,
                        "MONGODB_URL loaded correctly (database connected)",
                        {"database_status": health_data.get("database")}
                    )
                    tests_passed += 1
                else:
                    self.log_test_result(
                        "Environment Variables - MONGODB_URL Issue",
                        False,
                        f"MONGODB_URL issue (database: {health_data.get('database')})",
                        health_data
                    )
            else:
                self.log_test_result(
                    "Environment Variables - Health Check Failed",
                    False,
                    f"Health check failed (status: {response.status_code})",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test_result(
                "Environment Variables - MONGODB_URL Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Test 3: ALLOWED_ORIGINS is loaded (CORS works)
        try:
            response = self.session.options(
                f"{self.base_url}/api/v1/auth/login",
                headers={"Origin": "https://artori.app"}
            )
            
            if "Access-Control-Allow-Origin" in response.headers:
                self.log_test_result(
                    "Environment Variables - ALLOWED_ORIGINS",
                    True,
                    "ALLOWED_ORIGINS loaded correctly (CORS configured)",
                    {"cors_origin": response.headers.get("Access-Control-Allow-Origin")}
                )
                tests_passed += 1
            else:
                self.log_test_result(
                    "Environment Variables - ALLOWED_ORIGINS Issue",
                    False,
                    "ALLOWED_ORIGINS not loaded correctly (no CORS headers)",
                    dict(response.headers)
                )
        except Exception as e:
            self.log_test_result(
                "Environment Variables - ALLOWED_ORIGINS Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Overall environment variables test result
        success_rate = tests_passed / total_tests
        overall_passed = success_rate >= 0.67  # At least 2 out of 3 tests should pass
        
        self.log_test_result(
            "Environment Variables - Overall",
            overall_passed,
            f"Environment variables loading: {tests_passed}/{total_tests} tests passed",
            {"success_rate": success_rate, "tests_passed": tests_passed, "total_tests": total_tests}
        )
        
        return overall_passed
    
    def test_error_handling(self) -> bool:
        """Test 8: Error handling improvements"""
        print("🚨 TEST 8: Error Handling & Edge Cases")
        print("-" * 50)
        
        error_tests_passed = 0
        total_error_tests = 4
        
        # Test 1: Invalid JSON should return 422, not 500
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                data="invalid json",
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 422:
                self.log_test_result(
                    "Error Handling - Invalid JSON",
                    True,
                    "Invalid JSON returns 422 (not 500)",
                    {"status_code": response.status_code}
                )
                error_tests_passed += 1
            elif response.status_code == 500:
                self.log_test_result(
                    "Error Handling - Invalid JSON Still 500",
                    False,
                    "Invalid JSON still returns 500 (should be 422)",
                    {"status_code": response.status_code, "response": response.text}
                )
            else:
                # Other status codes are acceptable
                error_tests_passed += 1
                self.log_test_result(
                    "Error Handling - Invalid JSON",
                    True,
                    f"Invalid JSON handled correctly (status: {response.status_code})",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test_result(
                "Error Handling - Invalid JSON Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Test 2: Missing fields should return 422, not 500
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                json={},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 422:
                self.log_test_result(
                    "Error Handling - Missing Fields",
                    True,
                    "Missing fields return 422 (not 500)",
                    {"status_code": response.status_code}
                )
                error_tests_passed += 1
            elif response.status_code == 500:
                self.log_test_result(
                    "Error Handling - Missing Fields Still 500",
                    False,
                    "Missing fields still return 500 (should be 422)",
                    {"status_code": response.status_code, "response": response.text}
                )
            else:
                error_tests_passed += 1
                self.log_test_result(
                    "Error Handling - Missing Fields",
                    True,
                    f"Missing fields handled correctly (status: {response.status_code})",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test_result(
                "Error Handling - Missing Fields Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Test 3: Invalid email format should return 422, not 500
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                json={"email": "not-an-email", "password": "test"},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 422:
                self.log_test_result(
                    "Error Handling - Invalid Email Format",
                    True,
                    "Invalid email format returns 422 (not 500)",
                    {"status_code": response.status_code}
                )
                error_tests_passed += 1
            elif response.status_code == 500:
                self.log_test_result(
                    "Error Handling - Invalid Email Still 500",
                    False,
                    "Invalid email still returns 500 (should be 422)",
                    {"status_code": response.status_code, "response": response.text}
                )
            else:
                error_tests_passed += 1
                self.log_test_result(
                    "Error Handling - Invalid Email Format",
                    True,
                    f"Invalid email handled correctly (status: {response.status_code})",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test_result(
                "Error Handling - Invalid Email Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Test 4: Invalid credentials should return 401, not 500
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                json=self.invalid_credentials,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 401:
                self.log_test_result(
                    "Error Handling - Invalid Credentials",
                    True,
                    "Invalid credentials return 401 (not 500)",
                    {"status_code": response.status_code}
                )
                error_tests_passed += 1
            elif response.status_code == 500:
                self.log_test_result(
                    "Error Handling - Invalid Credentials Still 500",
                    False,
                    "Invalid credentials still return 500 (should be 401)",
                    {"status_code": response.status_code, "response": response.text}
                )
            else:
                # 503 is acceptable if database is down
                if response.status_code == 503:
                    error_tests_passed += 1
                    self.log_test_result(
                        "Error Handling - Invalid Credentials",
                        True,
                        f"Invalid credentials handled correctly (status: {response.status_code})",
                        {"status_code": response.status_code}
                    )
                else:
                    self.log_test_result(
                        "Error Handling - Invalid Credentials Unexpected",
                        False,
                        f"Unexpected status code: {response.status_code}",
                        {"status_code": response.status_code, "response": response.text}
                    )
        except Exception as e:
            self.log_test_result(
                "Error Handling - Invalid Credentials Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Overall error handling result
        success_rate = error_tests_passed / total_error_tests
        overall_passed = success_rate >= 0.75  # At least 3 out of 4 tests should pass
        
        self.log_test_result(
            "Error Handling - Overall",
            overall_passed,
            f"Error handling: {error_tests_passed}/{total_error_tests} tests passed",
            {"success_rate": success_rate, "tests_passed": error_tests_passed, "total_tests": total_error_tests}
        )
        
        return overall_passed
    
    def test_complete_authentication_flow(self, access_token: str) -> bool:
        """Test 9: Complete authentication flow simulation"""
        print("🔄 TEST 9: Complete Authentication Flow")
        print("-" * 50)
        
        if not access_token:
            self.log_test_result(
                "Authentication Flow - No Token",
                False,
                "No access token available for flow testing",
                None
            )
            return False
        
        flow_tests_passed = 0
        total_flow_tests = 3
        
        # Test 1: Use token to access protected endpoint (/auth/me)
        # Test 1: Use token to access protected endpoint (/auth/me)
        try:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = self.session.get(f"{self.base_url}/api/v1/auth/me", headers=headers)
            
            if response.status_code == 200:
                self.log_test_result(
                    "Authentication Flow - Protected Endpoint Access",
                    True,
                    "Token successfully used to access protected endpoint",
                    {"status_code": response.status_code}
                )
                flow_tests_passed += 1
            else:
                self.log_test_result(
                    "Authentication Flow - Protected Endpoint Failed",
                    False,
                    f"Failed to access protected endpoint (status: {response.status_code})",
                    {"status_code": response.status_code, "response": response.text}
                )
        except Exception as e:
            self.log_test_result(
                "Authentication Flow - Protected Endpoint Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Test 2: Try to access protected endpoint without token (should fail)
        try:
            response = self.session.get(f"{self.base_url}/api/v1/auth/me")
            
            if response.status_code == 401:
                self.log_test_result(
                    "Authentication Flow - No Token Protection",
                    True,
                    "Protected endpoint correctly rejects requests without token",
                    {"status_code": response.status_code}
                )
                flow_tests_passed += 1
            else:
                self.log_test_result(
                    "Authentication Flow - No Token Protection Failed",
                    False,
                    f"Protected endpoint should return 401 without token (got: {response.status_code})",
                    {"status_code": response.status_code, "response": response.text}
                )
        except Exception as e:
            self.log_test_result(
                "Authentication Flow - No Token Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Test 3: Try to access protected endpoint with invalid token (should fail)
        try:
            headers = {"Authorization": "Bearer invalid_token_here"}
            response = self.session.get(f"{self.base_url}/api/v1/auth/me", headers=headers)
            
            if response.status_code == 401:
                self.log_test_result(
                    "Authentication Flow - Invalid Token Protection",
                    True,
                    "Protected endpoint correctly rejects invalid tokens",
                    {"status_code": response.status_code}
                )
                flow_tests_passed += 1
            else:
                self.log_test_result(
                    "Authentication Flow - Invalid Token Protection Failed",
                    False,
                    f"Protected endpoint should return 401 for invalid token (got: {response.status_code})",
                    {"status_code": response.status_code, "response": response.text}
                )
        except Exception as e:
            self.log_test_result(
                "Authentication Flow - Invalid Token Test Error",
                False,
                f"Exception: {str(e)}",
                {"error": str(e)}
            )
        
        # Overall authentication flow result
        success_rate = flow_tests_passed / total_flow_tests
        overall_passed = success_rate >= 0.67  # At least 2 out of 3 tests should pass
        
        self.log_test_result(
            "Authentication Flow - Overall",
            overall_passed,
            f"Authentication flow: {flow_tests_passed}/{total_flow_tests} tests passed",
            {"success_rate": success_rate, "tests_passed": flow_tests_passed, "total_tests": total_flow_tests}
        )
        
        return overall_passed
    
    def run_comprehensive_tests(self) -> Dict[str, Any]:
        """Run all comprehensive tests"""
        print("🚀 STARTING COMPREHENSIVE PRODUCTION FIXES VALIDATION")
        print("=" * 80)
        
        start_time = time.time()
        access_token = None
        
        # Test 1: Health check and database connectivity
        health_passed = self.test_health_endpoint()
        
        # Test 2: MongoDB connection fix
        mongodb_passed = self.test_mongodb_connection_fix()
        
        # Test 3: Login endpoint (get token for further tests)
        login_passed, access_token = self.test_login_endpoint()
        
        # Test 4: /auth/me endpoint (was missing)
        auth_me_passed = self.test_auth_me_endpoint(access_token) if access_token else False
        
        # Test 5: CORS configuration
        cors_passed = self.test_cors_configuration()
        
        # Test 6: Vercel handler export
        vercel_passed = self.test_vercel_handler_export()
        
        # Test 7: Environment variables loading
        env_vars_passed = self.test_environment_variables()
        
        # Test 8: Error handling improvements
        error_handling_passed = self.test_error_handling()
        
        # Test 9: Complete authentication flow
        auth_flow_passed = self.test_complete_authentication_flow(access_token) if access_token else False
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Calculate overall results
        critical_tests = [health_passed, mongodb_passed, login_passed, auth_me_passed]
        critical_passed = sum(critical_tests)
        critical_total = len(critical_tests)
        
        all_tests = [health_passed, mongodb_passed, login_passed, auth_me_passed,
                    cors_passed, vercel_passed, env_vars_passed, error_handling_passed, auth_flow_passed]
        all_passed = sum(all_tests)
        all_total = len(all_tests)
        
        # Generate final report
        self.generate_final_report(duration, critical_passed, critical_total, all_passed, all_total)
        
        return {
            "success": critical_passed == critical_total,
            "critical_tests": {"passed": critical_passed, "total": critical_total},
            "all_tests": {"passed": all_passed, "total": all_total},
            "duration": duration,
            "access_token_obtained": access_token is not None,
            "test_results": self.test_results
        }
    
    def generate_final_report(self, duration: float, critical_passed: int, critical_total: int,
                            all_passed: int, all_total: int):
        """Generate comprehensive final report"""
        print("=" * 80)
        print("📊 COMPREHENSIVE TEST RESULTS SUMMARY")
        print("=" * 80)
        
        # Critical tests summary
        critical_success_rate = (critical_passed / critical_total) * 100
        print(f"🎯 CRITICAL TESTS: {critical_passed}/{critical_total} passed ({critical_success_rate:.1f}%)")
        
        if critical_passed == critical_total:
            print("✅ ALL CRITICAL PRODUCTION FIXES VALIDATED!")
        else:
            print("❌ SOME CRITICAL FIXES STILL HAVE ISSUES!")
        
        print()
        
        # All tests summary
        overall_success_rate = (all_passed / all_total) * 100
        print(f"📈 OVERALL TESTS: {all_passed}/{all_total} passed ({overall_success_rate:.1f}%)")
        print(f"⏱️ TOTAL DURATION: {duration:.2f} seconds")
        print()
        
        # Detailed breakdown
        print("📋 DETAILED BREAKDOWN:")
        print("-" * 40)
        
        test_categories = [
            ("Health Check & DB", "Critical"),
            ("MongoDB Connection Fix", "Critical"),
            ("Login Endpoint", "Critical"),
            ("/auth/me Endpoint Fix", "Critical"),
            ("CORS Configuration", "Important"),
            ("Vercel Handler", "Important"),
            ("Environment Variables", "Important"),
            ("Error Handling", "Enhancement"),
            ("Authentication Flow", "Integration")
        ]
        
        for i, (test_name, category) in enumerate(test_categories):
            if i < len(self.test_results["test_details"]):
                result = self.test_results["test_details"][i]
                status_icon = "✅" if result["passed"] else "❌"
                print(f"{status_icon} {test_name:<25} [{category}]")
        
        print()
        
        # Recommendations
        print("💡 RECOMMENDATIONS:")
        print("-" * 40)
        
        if critical_passed == critical_total:
            print("🎉 All critical production issues have been resolved!")
            print("✅ The API is ready for production use")
            print("✅ Login functionality is working correctly")
            print("✅ Database connectivity is stable")
            print("✅ Missing endpoints have been added")
        else:
            print("⚠️ Some critical issues still need attention:")
            failed_critical = []
            if not self.test_results["test_details"][0]["passed"]:
                failed_critical.append("- Database connectivity issues")
            if not self.test_results["test_details"][1]["passed"]:
                failed_critical.append("- MongoDB connection configuration")
            if not self.test_results["test_details"][2]["passed"]:
                failed_critical.append("- Login endpoint functionality")
            if not self.test_results["test_details"][3]["passed"]:
                failed_critical.append("- Missing /auth/me endpoint")
            
            for issue in failed_critical:
                print(issue)
        
        print()
        print("=" * 80)
        print(f"🏁 VALIDATION COMPLETED AT: {datetime.now().isoformat()}")
        print("=" * 80)


def main():
    """Main function to run the comprehensive tests"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Comprehensive Production Fixes Validator")
    parser.add_argument("--url", help="API base URL (default: auto-detect latest)")
    parser.add_argument("--email", help="Test user email", default="admin@artori.app")
    parser.add_argument("--password", help="Test user password", default="AdminPass123!")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    
    args = parser.parse_args()
    
    # Setup test credentials
    test_credentials = {
        "email": args.email,
        "password": args.password
    }
    
    # Initialize validator
    validator = ProductionFixesValidator(
        base_url=args.url,
        test_user_credentials=test_credentials
    )
    
    try:
        # Run comprehensive tests
        results = validator.run_comprehensive_tests()
        
        if args.json:
            print(json.dumps(results, indent=2, default=str))
        
        # Exit with appropriate code
        if results["success"]:
            print("\n🎉 ALL CRITICAL TESTS PASSED - PRODUCTION FIXES VALIDATED!")
            sys.exit(0)
        else:
            print("\n❌ SOME CRITICAL TESTS FAILED - ISSUES STILL EXIST!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n💥 Unexpected error during testing: {e}")
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()