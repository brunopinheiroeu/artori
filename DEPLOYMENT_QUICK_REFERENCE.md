# 🚀 Quick Deployment Reference

## Current Status

- **Branch:** `main` (1 commit ahead of origin)
- **Modified Files:**
  - `api/index.py` (Added Mangum ASGI adapter)
  - `api/requirements.txt` (Added mangum dependency)

## 🎯 One-Command Deployment

```bash
./deploy.sh
```

## 🔍 One-Command Verification

```bash
./verify_deployment.sh
```

## 📋 Manual Steps (Alternative)

### 1. Deploy

```bash
git add api/index.py api/requirements.txt
git commit -m "fix: Add Mangum ASGI adapter for Vercel serverless deployment"
git push origin main
```

### 2. Verify

```bash
# Replace with your actual Vercel URL
curl https://your-app.vercel.app/api/
```

## 🔧 Key Fixes Included

✅ **Mangum ASGI Adapter** - Proper serverless handling  
✅ **Handler Export Fix** - Correct Vercel Python runtime format  
✅ **MongoDB URI Consistency** - Fixed environment variable usage  
✅ **Frontend API Config** - Removed problematic VITE_API_URL

## 🎯 Success Indicators

- ✅ Vercel build completes without errors
- ✅ API health check returns `{"message": "Artori API is running"}`
- ✅ Login endpoint responds (even with invalid credentials)
- ✅ Frontend can authenticate users successfully

## 🆘 Emergency Rollback

```bash
git revert HEAD
git push origin main
```

## 📞 Need Help?

- **Detailed Guide:** `DEPLOYMENT_GUIDE.md`
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Check Function Logs:** Vercel Dashboard → Functions tab
