#!/usr/bin/env python3
"""
Test script for the new admin endpoints
"""
import requests
import json
from datetime import datetime

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test if the server is running"""
    try:
        response = requests.get(f"{BASE_URL}/healthz")
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print("❌ Server health check failed")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server")
        return False

def test_admin_preferences():
    """Test admin preferences endpoints"""
    print("\n🧪 Testing Admin Preferences Endpoints...")
    
    # Note: These would need proper authentication in a real test
    # For now, we're just testing the endpoint structure
    
    try:
        # Test GET preferences (will fail without auth, but endpoint exists)
        response = requests.get(f"{BASE_URL}/api/v1/admin/preferences")
        print(f"GET /api/v1/admin/preferences - Status: {response.status_code}")
        
        # Test PUT preferences (will fail without auth, but endpoint exists)
        test_data = {
            "system_alerts": True,
            "user_activity": False,
            "weekly_reports": True
        }
        response = requests.put(f"{BASE_URL}/api/v1/admin/preferences", json=test_data)
        print(f"PUT /api/v1/admin/preferences - Status: {response.status_code}")
        
    except Exception as e:
        print(f"❌ Error testing preferences: {e}")

def test_system_settings():
    """Test system settings endpoints"""
    print("\n🧪 Testing System Settings Endpoints...")
    
    try:
        # Test GET settings by category
        categories = ["general", "database", "email", "security", "localization", "theme"]
        for category in categories:
            response = requests.get(f"{BASE_URL}/api/v1/admin/settings/{category}")
            print(f"GET /api/v1/admin/settings/{category} - Status: {response.status_code}")
        
        # Test PUT settings by category
        test_data = {"app_name": "Test App", "maintenance_mode": False}
        response = requests.put(f"{BASE_URL}/api/v1/admin/settings/general", json=test_data)
        print(f"PUT /api/v1/admin/settings/general - Status: {response.status_code}")
        
    except Exception as e:
        print(f"❌ Error testing settings: {e}")

def test_analytics_endpoints():
    """Test analytics endpoints"""
    print("\n🧪 Testing Analytics Endpoints...")
    
    try:
        # Test performance metrics
        response = requests.get(f"{BASE_URL}/api/v1/admin/analytics/performance?timeRange=7d")
        print(f"GET /api/v1/admin/analytics/performance - Status: {response.status_code}")
        
        # Test trending data
        response = requests.get(f"{BASE_URL}/api/v1/admin/analytics/trends?metric=user_engagement&timeRange=7d")
        print(f"GET /api/v1/admin/analytics/trends - Status: {response.status_code}")
        
    except Exception as e:
        print(f"❌ Error testing analytics: {e}")

def test_openapi_docs():
    """Test if OpenAPI docs include new endpoints"""
    print("\n🧪 Testing OpenAPI Documentation...")
    
    try:
        response = requests.get(f"{BASE_URL}/openapi.json")
        if response.status_code == 200:
            openapi_spec = response.json()
            paths = openapi_spec.get("paths", {})
            
            # Check for new endpoints
            new_endpoints = [
                "/api/v1/admin/preferences",
                "/api/v1/admin/settings/{category}",
                "/api/v1/admin/analytics/performance",
                "/api/v1/admin/analytics/trends"
            ]
            
            for endpoint in new_endpoints:
                if endpoint in paths:
                    print(f"✅ {endpoint} found in OpenAPI spec")
                else:
                    print(f"❌ {endpoint} missing from OpenAPI spec")
        else:
            print("❌ Failed to get OpenAPI spec")
            
    except Exception as e:
        print(f"❌ Error testing OpenAPI: {e}")

def main():
    """Run all tests"""
    print("🚀 Testing New Backend Endpoints")
    print("=" * 50)
    
    if not test_health_check():
        print("❌ Server not available, skipping tests")
        return
    
    test_admin_preferences()
    test_system_settings()
    test_analytics_endpoints()
    test_openapi_docs()
    
    print("\n" + "=" * 50)
    print("✅ Endpoint structure tests completed!")
    print("Note: Authentication tests would require valid admin tokens")

if __name__ == "__main__":
    main()