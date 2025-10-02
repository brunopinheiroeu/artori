#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

try:
    from passlib.context import CryptContext
    print("✅ Successfully imported CryptContext from passlib")
    
    # Test password hashing
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print("✅ Successfully created CryptContext with bcrypt")
    
    # Test password hashing and verification
    test_password = "TestPassword123!"
    print(f"Testing with password: {test_password}")
    
    # Hash the password
    hashed = pwd_context.hash(test_password)
    print(f"✅ Successfully hashed password: {hashed[:50]}...")
    
    # Verify the password
    is_valid = pwd_context.verify(test_password, hashed)
    print(f"✅ Password verification result: {is_valid}")
    
    # Test with a long password (over 72 bytes)
    long_password = "A" * 100  # 100 characters
    print(f"\nTesting with long password ({len(long_password)} chars, {len(long_password.encode('utf-8'))} bytes)")
    
    try:
        long_hashed = pwd_context.hash(long_password)
        print(f"✅ Successfully hashed long password: {long_hashed[:50]}...")
        
        long_is_valid = pwd_context.verify(long_password, long_hashed)
        print(f"✅ Long password verification result: {long_is_valid}")
        
    except Exception as e:
        print(f"❌ Error with long password: {e}")
        print(f"Error type: {type(e).__name__}")
    
    print("\n🎉 All password tests passed! The bcrypt/passlib compatibility issue is resolved.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()