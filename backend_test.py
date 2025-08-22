#!/usr/bin/env python3
"""
Backend API Testing Suite
Tests FastAPI endpoints for the portfolio website backend
"""

import requests
import json
import sys
import os
from pathlib import Path

# Load the backend URL from frontend .env
def load_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return None

BACKEND_URL = load_backend_url()
if not BACKEND_URL:
    print("❌ Could not load REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BACKEND_URL}/api"
print(f"🔗 Testing backend at: {API_BASE}")

def test_get_root():
    """Test GET /api/ endpoint"""
    print("\n🧪 Testing GET /api/")
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("   ✅ GET /api/ working correctly")
                return True
            else:
                print(f"   ❌ Expected message 'Hello World', got: {data}")
                return False
        else:
            print(f"   ❌ Expected status 200, got: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False

def test_post_contact_missing_fields():
    """Test POST /api/contact with missing fields (expect 422)"""
    print("\n🧪 Testing POST /api/contact with missing fields")
    
    test_cases = [
        {},  # All fields missing
        {"name": "John"},  # Missing email and message
        {"email": "john@example.com"},  # Missing name and message
        {"message": "Hello"},  # Missing name and email
        {"name": "John", "email": "john@example.com"},  # Missing message
    ]
    
    all_passed = True
    for i, payload in enumerate(test_cases):
        try:
            response = requests.post(f"{API_BASE}/contact", json=payload, timeout=10)
            print(f"   Test {i+1} - Payload: {payload}")
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 422:
                print(f"   ✅ Correctly returned 422 for missing fields")
            else:
                print(f"   ❌ Expected 422, got: {response.status_code}")
                print(f"   Response: {response.text}")
                all_passed = False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Request failed: {e}")
            all_passed = False
    
    return all_passed

def test_post_contact_invalid_email():
    """Test POST /api/contact with invalid email (expect 422)"""
    print("\n🧪 Testing POST /api/contact with invalid email")
    
    invalid_emails = [
        "not-an-email",
        "missing@domain",
        "@missing-local.com",
        "spaces in@email.com",
        "double@@domain.com"
    ]
    
    all_passed = True
    for email in invalid_emails:
        payload = {
            "name": "Test User",
            "email": email,
            "message": "This is a test message"
        }
        
        try:
            response = requests.post(f"{API_BASE}/contact", json=payload, timeout=10)
            print(f"   Testing email: {email}")
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 422:
                print(f"   ✅ Correctly returned 422 for invalid email")
            else:
                print(f"   ❌ Expected 422, got: {response.status_code}")
                print(f"   Response: {response.text}")
                all_passed = False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Request failed: {e}")
            all_passed = False
    
    return all_passed

def test_post_contact_smtp_not_configured():
    """Test POST /api/contact with valid data but no SMTP config (expect 400)"""
    print("\n🧪 Testing POST /api/contact with valid data (SMTP not configured)")
    
    payload = {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@techcorp.com",
        "message": "I'm interested in discussing a potential DevOps consulting opportunity. Could we schedule a call to discuss your experience with AWS infrastructure automation?"
    }
    
    try:
        response = requests.post(f"{API_BASE}/contact", json=payload, timeout=10)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 400:
            try:
                data = response.json()
                detail = data.get("detail", {})
                
                if isinstance(detail, dict) and detail.get("ok") == False and detail.get("error") == "SMTP_NOT_CONFIGURED":
                    print("   ✅ Correctly returned 400 with SMTP_NOT_CONFIGURED error")
                    return True
                else:
                    print(f"   ❌ Expected detail with ok:false and error:SMTP_NOT_CONFIGURED, got: {detail}")
                    return False
            except json.JSONDecodeError:
                print(f"   ❌ Response is not valid JSON")
                return False
        else:
            print(f"   ❌ Expected status 400, got: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False

def test_cors_headers():
    """Test CORS configuration"""
    print("\n🧪 Testing CORS configuration")
    
    try:
        # Test actual request with Origin header to check CORS response
        headers = {
            'Origin': 'https://different-origin.com'
        }
        
        response = requests.get(f"{API_BASE}/", headers=headers, timeout=10)
        print(f"   GET Status Code: {response.status_code}")
        
        cors_origin = response.headers.get('Access-Control-Allow-Origin')
        print(f"   Access-Control-Allow-Origin: {cors_origin}")
        
        # Check if CORS allows all origins
        if cors_origin == '*':
            print("   ✅ CORS correctly configured to allow all origins")
            return True
        else:
            print(f"   ❌ Expected Access-Control-Allow-Origin: *, got: {cors_origin}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ CORS test failed: {e}")
        return False

def main():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests")
    print("=" * 50)
    
    tests = [
        ("GET /api/ endpoint", test_get_root),
        ("POST /api/contact missing fields", test_post_contact_missing_fields),
        ("POST /api/contact invalid email", test_post_contact_invalid_email),
        ("POST /api/contact SMTP not configured", test_post_contact_smtp_not_configured),
        ("CORS configuration", test_cors_headers)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"   ❌ Test '{test_name}' failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️  Some backend tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())