#!/bin/bash

# Artori Production Verification Script
# This script tests the deployed API endpoints to verify fixes are working

echo "🔍 Artori Production Verification Script"
echo "========================================"

# Check if jq is available for JSON parsing
if ! command -v jq &> /dev/null; then
    echo "⚠️  Warning: jq not found. JSON responses will not be formatted."
    JQ_AVAILABLE=false
else
    JQ_AVAILABLE=true
fi

# Get the API URL from user
echo ""
read -p "🌐 Enter your Vercel API URL (e.g., https://your-app.vercel.app/api): " API_URL

if [ -z "$API_URL" ]; then
    echo "❌ Error: API URL is required"
    exit 1
fi

# Remove trailing slash if present
API_URL=${API_URL%/}

echo ""
echo "🧪 Testing API endpoints..."
echo "API Base URL: $API_URL"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing API Health Check..."
echo "   GET $API_URL/"

HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Health check passed (HTTP $HTTP_CODE)"
    if [ "$JQ_AVAILABLE" = true ]; then
        echo "   📄 Response: $(echo "$RESPONSE_BODY" | jq -c .)"
    else
        echo "   📄 Response: $RESPONSE_BODY"
    fi
else
    echo "   ❌ Health check failed (HTTP $HTTP_CODE)"
    echo "   📄 Response: $RESPONSE_BODY"
fi

echo ""

# Test 2: Login Endpoint Structure
echo "2️⃣  Testing Login Endpoint Structure..."
echo "   POST $API_URL/auth/login (with invalid credentials)"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "invalid@test.com", "password": "invalid"}')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "422" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "   ✅ Login endpoint responding correctly (HTTP $HTTP_CODE)"
    if [ "$JQ_AVAILABLE" = true ]; then
        echo "   📄 Response: $(echo "$RESPONSE_BODY" | jq -c .)"
    else
        echo "   📄 Response: $RESPONSE_BODY"
    fi
else
    echo "   ❌ Login endpoint issue (HTTP $HTTP_CODE)"
    echo "   📄 Response: $RESPONSE_BODY"
fi

echo ""

# Test 3: Database Connection (via subjects endpoint)
echo "3️⃣  Testing Database Connection..."
echo "   GET $API_URL/subjects"

SUBJECTS_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/subjects")
HTTP_CODE=$(echo "$SUBJECTS_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$SUBJECTS_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Database connection working (HTTP $HTTP_CODE)"
    if [ "$JQ_AVAILABLE" = true ]; then
        SUBJECT_COUNT=$(echo "$RESPONSE_BODY" | jq '. | length' 2>/dev/null || echo "unknown")
        echo "   📊 Found $SUBJECT_COUNT subjects"
    fi
else
    echo "   ❌ Database connection issue (HTTP $HTTP_CODE)"
    echo "   📄 Response: $RESPONSE_BODY"
fi

echo ""

# Test 4: CORS Headers
echo "4️⃣  Testing CORS Configuration..."
echo "   OPTIONS $API_URL/auth/login"

CORS_RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS "$API_URL/auth/login" \
    -H "Origin: https://your-frontend.vercel.app" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type")

HTTP_CODE=$(echo "$CORS_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
    echo "   ✅ CORS configured correctly (HTTP $HTTP_CODE)"
else
    echo "   ⚠️  CORS might need configuration (HTTP $HTTP_CODE)"
fi

echo ""
echo "📋 Verification Summary"
echo "======================"

# Provide test credentials prompt
echo ""
echo "🔐 Manual Login Test"
echo "==================="
echo "To complete verification, test login with your actual credentials:"
echo ""
echo "Using curl:"
echo "curl -X POST $API_URL/auth/login \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\": \"your-email@example.com\", \"password\": \"your-password\"}'"
echo ""
echo "Expected successful response should include:"
echo "- access_token (JWT)"
echo "- token_type: \"bearer\""
echo "- user information"
echo ""

# Frontend test instructions
echo "🌐 Frontend Test"
echo "==============="
echo "1. Open your deployed frontend URL"
echo "2. Navigate to the login page"
echo "3. Try logging in with valid credentials"
echo "4. Check browser developer tools for any API errors"
echo "5. Verify successful authentication and redirect"
echo ""

# Monitoring instructions
echo "📊 Monitoring"
echo "============"
echo "Monitor your Vercel dashboard for:"
echo "- Function execution logs"
echo "- Error rates"
echo "- Response times"
echo ""
echo "Vercel Dashboard: https://vercel.com/dashboard"
echo ""

echo "✅ Verification script completed!"