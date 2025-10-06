# Vercel Deployment Guide - MongoDB Atlas Connection Fix

## Overview

This guide provides the complete solution to fix MongoDB Atlas connection issues with Vercel serverless deployment.

## 1. Environment Variables Configuration

### Step 1: Set Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variables:

```bash
# MongoDB Configuration - Optimized for Serverless
MONGODB_URI=mongodb+srv://b3dsign_db_user:yxHxBDi0ES9Y5bZI@cluster0.z8xjon4.mongodb.net/artori?retryWrites=true&w=majority&appName=Cluster0&maxPoolSize=1&maxIdleTimeMS=10000&serverSelectionTimeoutMS=3000&connectTimeoutMS=5000&socketTimeoutMS=10000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024-artori-app-secure-random-string
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN_MINUTES=30
```

### Step 2: Environment Variable Settings

- Set **Environment**: `Production`, `Preview`, and `Development`
- Ensure all variables are properly saved

## 2. MongoDB Atlas Network Access Configuration

### Step 1: Allow All IP Addresses (Recommended for Vercel)

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster
3. Go to **Security** → **Network Access**
4. Click **Add IP Address**
5. Select **Allow Access from Anywhere** (0.0.0.0/0)
6. Add a comment: "Vercel Serverless Functions"
7. Click **Confirm**

### Step 2: Alternative - Specific Vercel IP Ranges (Advanced)

If you prefer more restrictive access, add these Vercel IP ranges:

```
76.76.19.0/24
76.223.126.0/24
```

**Note**: Vercel uses dynamic IPs, so allowing all IPs (0.0.0.0/0) is the most reliable approach for serverless functions.

## 3. MongoDB Connection String Optimization

### Key Optimizations Applied:

1. **Database Name**: `/artori` is correctly included in the connection string
2. **Serverless Parameters**:
   - `maxPoolSize=1` - Limits connection pool for serverless
   - `maxIdleTimeMS=10000` - Shorter idle timeout
   - `serverSelectionTimeoutMS=3000` - Faster server selection
   - `connectTimeoutMS=5000` - Faster connection timeout
   - `socketTimeoutMS=10000` - Shorter socket timeout

### Connection String Format:

```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority&appName=Cluster0&maxPoolSize=1&maxIdleTimeMS=10000&serverSelectionTimeoutMS=3000&connectTimeoutMS=5000&socketTimeoutMS=10000
```

## 4. Code Optimizations Applied

### MongoDB Client Configuration:

- Reduced `maxPoolSize` to 1 for serverless
- Set `minPoolSize` to 0 to allow connections to close
- Aggressive timeout settings for faster failures
- Enhanced error logging for debugging

### Error Handling:

- Specific error messages for common connection issues
- Debugging information for IP whitelisting problems
- Authentication and DNS error detection

## 5. Deployment Steps

### Step 1: Update Local Environment

```bash
# Update your local .env file with the optimized connection string
cp .env.example .env
# Edit .env with your actual credentials
```

### Step 2: Deploy to Vercel

```bash
# Deploy using Vercel CLI
vercel --prod

# Or push to your connected Git repository
git add .
git commit -m "Fix MongoDB Atlas connection for serverless"
git push origin main
```

### Step 3: Verify Deployment

1. Check Vercel deployment logs
2. Test the `/healthz` endpoint
3. Verify database connectivity

## 6. Testing the Connection

### Local Testing:

```bash
cd backend
source venv/bin/activate
python main.py
```

### Production Testing:

```bash
curl https://your-app.vercel.app/healthz
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## 7. Troubleshooting

### Common Issues and Solutions:

#### Issue 1: "ServerSelectionTimeoutError"

**Cause**: IP not whitelisted in MongoDB Atlas
**Solution**: Add 0.0.0.0/0 to Network Access in MongoDB Atlas

#### Issue 2: "AuthenticationFailed"

**Cause**: Incorrect username/password
**Solution**: Verify credentials in MongoDB Atlas Users section

#### Issue 3: "DNSError"

**Cause**: Incorrect cluster hostname
**Solution**: Copy connection string directly from MongoDB Atlas

#### Issue 4: Environment Variables Not Found

**Cause**: Variables not set in Vercel
**Solution**: Check Vercel Dashboard → Settings → Environment Variables

### Debug Commands:

```bash
# Check if environment variables are loaded
vercel env ls

# View deployment logs
vercel logs

# Test specific endpoint
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
```

## 8. Security Considerations

1. **Never commit credentials** to version control
2. **Use strong passwords** for MongoDB users
3. **Rotate JWT secrets** regularly
4. **Monitor access logs** in MongoDB Atlas
5. **Consider IP restrictions** if your use case allows

## 9. Performance Monitoring

### MongoDB Atlas Monitoring:

- Monitor connection counts
- Check query performance
- Review error logs

### Vercel Monitoring:

- Check function execution time
- Monitor cold start performance
- Review error rates

## 10. Next Steps

1. Set up MongoDB Atlas alerts for connection issues
2. Implement connection retry logic in application code
3. Consider implementing connection pooling strategies
4. Set up monitoring and alerting for production

---

## Quick Checklist

- [ ] MongoDB Atlas Network Access: 0.0.0.0/0 added
- [ ] Vercel Environment Variables: All variables set
- [ ] Connection String: Includes database name and serverless optimizations
- [ ] Code: MongoDB client optimized for serverless
- [ ] Testing: `/healthz` endpoint returns "connected"
- [ ] Monitoring: Alerts configured for connection issues

## Support

If you continue to experience issues:

1. Check Vercel deployment logs
2. Review MongoDB Atlas monitoring
3. Verify all environment variables are set correctly
4. Test the connection string locally first
