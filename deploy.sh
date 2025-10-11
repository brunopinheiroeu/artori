#!/bin/bash

# Artori Production Deployment Script
# This script commits and pushes the production fixes to trigger Vercel deployment

echo "🚀 Artori Production Deployment Script"
echo "======================================"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
git status --porcelain

# Show what files will be committed
echo ""
echo "📁 Files to be committed:"
echo "  - api/index.py (Added Mangum ASGI adapter)"
echo "  - api/requirements.txt (Added mangum dependency)"

# Ask for confirmation
echo ""
read -p "🤔 Do you want to proceed with deployment? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Add files
echo "📦 Adding files to git..."
git add api/index.py api/requirements.txt

# Commit with descriptive message
echo "💾 Committing changes..."
git commit -m "fix: Add Mangum ASGI adapter for Vercel serverless deployment

- Add mangum dependency to requirements.txt
- Update handler export to use Mangum(app) for proper ASGI handling
- Fixes serverless function compatibility with Vercel Python runtime

This resolves the production login issues by ensuring proper ASGI
handling in the Vercel serverless environment."

# Push to origin
echo "🚀 Pushing to origin/main..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment initiated successfully!"
    echo ""
    echo "📊 Next steps:"
    echo "  1. Monitor your Vercel dashboard for build progress"
    echo "  2. Check the deployment logs for any errors"
    echo "  3. Test the API endpoints once deployment completes"
    echo "  4. Verify login functionality on the frontend"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed verification steps"
    echo ""
    echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
else
    echo "❌ Push failed. Please check your git configuration and try again."
    exit 1
fi