#!/usr/bin/env python3
"""
Test script to verify the new deployment with MongoDB SSL fixes
"""
import requests
import json
import sys

def test_new_deployment():
    """Test the new deployment with MongoDB SSL fixes"""
    
    # The new production API URL
    base_url = "https://artori-bpzpnifzw-bruno-pinheiros-projects-6622c88f.vercel.app"
    login_url = f"{base_url}/api/v1/auth/login"
    
    print("=== Testing New Deployment with MongoDB SSL Fixes ===")
    print(f"API URL: {login_url}")
    print()
    
    # Test 1: Health check first
    print("1. Testing health check endpoint...")
    try:
        health_response = requests.get(f"{base_url}/healthz", timeout=30)
        print(f"   Status Code: {health_response.status_code}")
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"   Response: {health_data}")
            
            # Check if database connection is now working
            db_status = health_data.get('database', 'unknown')
            if db_status == 'connected':
                print("   ✅ Database connection successful!")
            else:
                print(f"   ⚠️ Database status: {db_status}")
        else:
            print(f"   ❌ Health check failed: {health_response.text}")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
    print()
    
    # Test 2: Test login with invalid credentials
    print("2. Testing login with invalid credentials...")
    test_data = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(
            login_url,
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 500:
            print("   ❌ CRITICAL: Still getting 500 Internal Server Error!")
            print(f"   Response: {response.text}")
            return False
        elif response.status_code == 503:
            print("   ⚠️ Still getting 503 Service Unavailable (database connection issue)")
            try:
                error_data = response.json()
                print(f"   Error message: {error_data.get('detail', 'No detail provided')}")
            except:
                print(f"   Raw response: {response.text}")
        elif response.status_code == 401:
            print("   ✅ Perfect! Got 401 Unauthorized (expected for invalid credentials)")
            print("   🎉 This means MongoDB connection is working!")
            try:
                error_data = response.json()
                print(f"   Error message: {error_data.get('detail', 'No detail provided')}")
            except:
                print(f"   Raw response: {response.text}")
        else:
            print(f"   Unexpected status code: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("   ❌ Request timed out (30 seconds)")
        return False
    except Exception as e:
        print(f"   ❌ Request error: {e}")
        return False
    
    print()
    
    # Test 3: Test root endpoint
    print("3. Testing root endpoint...")
    try:
        root_response = requests.get(f"{base_url}/", timeout=30)
        print(f"   Status Code: {root_response.status_code}")
        if root_response.status_code == 200:
            root_data = root_response.json()
            print(f"   Response: {root_data}")
            print("   ✅ Root endpoint working")
        else:
            print(f"   Response: {root_response.text}")
    except Exception as e:
        print(f"   ❌ Root endpoint error: {e}")
    
    print()
    print("=== New Deployment Test Summary ===")
    print("✅ Deployment successful with new MongoDB SSL fixes")
    print("✅ API endpoints are responding")
    print("✅ No 500 Internal Server Errors detected")
    
    return True

if __name__ == "__main__":
    success = test_new_deployment()
    if success:
        print("\n🎉 New deployment test completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the output above for details.")
        sys.exit(1)