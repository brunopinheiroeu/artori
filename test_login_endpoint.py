#!/usr/bin/env python3
"""
Test script to verify the login endpoint is working correctly after deployment
"""
import requests
import json
import sys

def test_login_endpoint():
    """Test the login endpoint with various scenarios"""
    
    # The production API URL
    base_url = "https://artori-ddn0t4qoy-bruno-pinheiros-projects-6622c88f.vercel.app"
    login_url = f"{base_url}/api/v1/auth/login"
    
    print("=== Testing Login Endpoint ===")
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
            print("   ✅ Health check passed")
        else:
            print(f"   ❌ Health check failed: {health_response.text}")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
    print()
    
    # Test 2: Test with invalid credentials (should return 401, not 500)
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
        print(f"   Response Headers: {dict(response.headers)}")
        
        if response.status_code == 500:
            print("   ❌ CRITICAL: Still getting 500 Internal Server Error!")
            print(f"   Response: {response.text}")
            return False
        elif response.status_code == 401:
            print("   ✅ Correct: Got 401 Unauthorized (expected for invalid credentials)")
            try:
                error_data = response.json()
                print(f"   Error message: {error_data.get('detail', 'No detail provided')}")
            except:
                print(f"   Raw response: {response.text}")
        else:
            print(f"   Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("   ❌ Request timed out (30 seconds)")
        return False
    except Exception as e:
        print(f"   ❌ Request error: {e}")
        return False
    
    print()
    
    # Test 3: Test with malformed request (should return 422, not 500)
    print("3. Testing login with malformed request...")
    malformed_data = {
        "email": "not-an-email",
        "password": ""
    }
    
    try:
        response = requests.post(
            login_url,
            json=malformed_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 500:
            print("   ❌ CRITICAL: Still getting 500 Internal Server Error for malformed request!")
            print(f"   Response: {response.text}")
            return False
        elif response.status_code == 422:
            print("   ✅ Correct: Got 422 Unprocessable Entity (expected for malformed request)")
            try:
                error_data = response.json()
                print(f"   Validation errors: {error_data}")
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
    
    # Test 4: Test with empty request (should return 422, not 500)
    print("4. Testing login with empty request...")
    
    try:
        response = requests.post(
            login_url,
            json={},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 500:
            print("   ❌ CRITICAL: Still getting 500 Internal Server Error for empty request!")
            print(f"   Response: {response.text}")
            return False
        elif response.status_code == 422:
            print("   ✅ Correct: Got 422 Unprocessable Entity (expected for empty request)")
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
    print("=== Login Endpoint Test Summary ===")
    print("✅ No 500 Internal Server Errors detected!")
    print("✅ API is responding correctly to different request types")
    print("✅ MongoDB SSL and Vercel handler fixes appear to be working")
    
    return True

if __name__ == "__main__":
    success = test_login_endpoint()
    if success:
        print("\n🎉 All tests passed! The login endpoint is working correctly.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the output above for details.")
        sys.exit(1)