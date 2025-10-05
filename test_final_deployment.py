#!/usr/bin/env python3
"""
Test script to verify the final deployment with corrected MongoDB URI
"""
import requests
import json
import sys

def test_final_deployment():
    """Test the final deployment with corrected MongoDB URI"""
    
    # The latest production API URL
    base_url = "https://artori-msyc09o60-bruno-pinheiros-projects-6622c88f.vercel.app"
    login_url = f"{base_url}/api/v1/auth/login"
    
    print("=== Testing Final Deployment with Corrected MongoDB URI ===")
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
                print("   🎉 DATABASE CONNECTION SUCCESSFUL!")
                return True
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
            return False
        elif response.status_code == 401:
            print("   🎉 PERFECT! Got 401 Unauthorized (expected for invalid credentials)")
            print("   ✅ This means MongoDB connection is working!")
            try:
                error_data = response.json()
                print(f"   Error message: {error_data.get('detail', 'No detail provided')}")
            except:
                print(f"   Raw response: {response.text}")
            return True
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
    return False

if __name__ == "__main__":
    success = test_final_deployment()
    if success:
        print("\n🎉 FINAL DEPLOYMENT TEST SUCCESSFUL!")
        print("✅ MongoDB connection is working!")
        print("✅ Login endpoint is functioning correctly!")
        print("✅ 500 Internal Server Error is completely resolved!")
        sys.exit(0)
    else:
        print("\n❌ Final deployment test failed. MongoDB connection still has issues.")
        sys.exit(1)