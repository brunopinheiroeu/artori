# Vercel Deployment Guide - Production Fixes

## Overview

This guide will help you deploy the critical fixes to production on Vercel and verify that the login issues are resolved.

## Changes Being Deployed

### 1. API Fixes (`api/index.py`)

- ✅ Added Mangum ASGI adapter for proper Vercel serverless handling
- ✅ Fixed handler export format for Vercel Python runtime

### 2. Dependencies (`api/requirements.txt`)

- ✅ Added `mangum` dependency for ASGI adapter

### 3. Previous Fixes Already in Place

- ✅ MongoDB URI variable consistency (`MONGODB_URI`)
- ✅ Removed problematic `VITE_API_URL` frontend configuration
- ✅ Updated environment files and requirements

## Deployment Steps

### Step 1: Commit and Push Changes

```bash
# Add the modified files
git add api/index.py api/requirements.txt

# Commit with descriptive message
git commit -m "fix: Add Mangum ASGI adapter for Vercel serverless deployment

- Add mangum dependency to requirements.txt
- Update handler export to use Mangum(app) for proper ASGI handling
- Fixes serverless function compatibility with Vercel Python runtime"

# Push to main branch (this will trigger Vercel deployment)
git push origin main
```

### Step 2: Monitor Vercel Deployment

1. **Check Vercel Dashboard**

   - Go to your Vercel dashboard
   - Look for the new deployment triggered by your push
   - Monitor the build logs for any errors

2. **Expected Build Process**
   - Vercel will install dependencies from `api/requirements.txt`
   - The `mangum` adapter will be installed
   - The serverless function will be built with proper ASGI handling

### Step 3: Verify Environment Variables

Ensure these environment variables are set in your Vercel project:

**Required Environment Variables:**

- `MONGODB_URI` - Your MongoDB connection string
- `SECRET_KEY` - JWT secret key
- `OPENAI_API_KEY` - OpenAI API key (if using AI features)

**To check/set in Vercel:**

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Verify all required variables are present and correct

## Post-Deployment Verification

### Step 1: Basic API Health Check

Test the API root endpoint:

```bash
curl https://your-vercel-domain.vercel.app/api/
```

Expected response:

```json
{ "message": "Artori API is running", "status": "healthy" }
```

### Step 2: Authentication Endpoint Test

Test the login endpoint:

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpassword"}'
```

### Step 3: Frontend Login Test

1. **Open your deployed frontend**

   - Navigate to your Vercel frontend URL
   - Go to the login page

2. **Test Login Flow**
   - Try logging in with test credentials
   - Check browser developer tools for any API errors
   - Verify successful authentication and redirect

### Step 4: Database Connection Test

Test a protected endpoint to verify MongoDB connectivity:

```bash
# First login to get a token
TOKEN=$(curl -X POST https://your-vercel-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpassword"}' \
  | jq -r '.access_token')

# Then test a protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://your-vercel-domain.vercel.app/api/auth/me
```

## Troubleshooting

### If Deployment Fails

1. **Check Build Logs**

   - Look for dependency installation errors
   - Verify all requirements are properly listed

2. **Common Issues**
   - Missing environment variables
   - Incorrect MongoDB URI format
   - Network connectivity issues

### If API Returns 500 Errors

1. **Check Vercel Function Logs**

   - Go to Vercel dashboard → Functions tab
   - Look for runtime errors in the logs

2. **Common Fixes**
   - Verify MongoDB URI is accessible from Vercel
   - Check that all environment variables are set
   - Ensure database allows connections from Vercel IPs

### If Login Still Fails

1. **Check Network Tab in Browser**

   - Look for failed API requests
   - Verify API endpoints are being called correctly

2. **Test API Directly**
   - Use curl commands above to isolate frontend vs backend issues

## Success Indicators

✅ **Deployment Successful When:**

- Vercel build completes without errors
- API health check returns 200 status
- Login endpoint accepts credentials and returns JWT token
- Frontend can successfully authenticate users
- Protected endpoints work with valid tokens

## Next Steps After Successful Deployment

1. **Test All User Flows**

   - Student login and dashboard access
   - Tutor login and functionality
   - Admin panel access

2. **Monitor Performance**

   - Check API response times
   - Monitor error rates in Vercel dashboard

3. **Update Documentation**
   - Update any API documentation with new endpoints
   - Document any configuration changes

## Emergency Rollback

If critical issues arise:

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

This will trigger a new deployment with the previous version while you investigate issues.
