# Artori Application - Ports Configuration

## Development Environment Ports

### Backend API Server

- **Port**: 8000
- **URL**: http://localhost:8000
- **API Base**: http://localhost:8000/api/v1
- **Status**: Always running during development

### Frontend Development Server

- **Port**: 3000
- **URL**: http://localhost:3000
- **Status**: Always running during development

## Important Notes

- Backend must be running on port 8000 before starting frontend
- Frontend automatically proxies API requests to backend
- Both servers should be running simultaneously for full functionality
- Check these ports first before troubleshooting connectivity issues

## Quick Health Check

- Backend: http://localhost:8000/healthz
- Frontend: http://localhost:3000 (should load the application)

Last Updated: 2025-10-10
