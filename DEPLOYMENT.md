# Deployment Guide: Backend on Render, Frontend on Vercel

## Backend Deployment (Render)

### 1. Prepare Your Backend
- Ensure your `server/package.json` has the correct scripts
- Make sure all dependencies are in `dependencies` (not `devDependencies`)

### 2. Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `financial-system-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### 3. Set Environment Variables in Render
Add these environment variables in your Render service settings:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 4. Get Your Backend URL
After deployment, Render will provide a URL like: `https://your-app-name.onrender.com`

## Frontend Deployment (Vercel)

### 1. Prepare Your Frontend
- Ensure your React app is ready for production
- Update the API base URL to point to your Render backend

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3. Set Environment Variables in Vercel
Add this environment variable in your Vercel project settings:
```
REACT_APP_API_BASE_URL=https://your-backend-domain.onrender.com/api
```

### 4. Update CORS in Backend
After getting your Vercel domain, update the CORS configuration in `server/server.js`:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://your-actual-vercel-domain.vercel.app']
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

## Important Notes

### PowerShell Commands
Since you're using PowerShell, use these commands instead of `&&`:
```powershell
# Navigate to server directory
cd server
npm start

# In another terminal, navigate to client directory
cd client
npm start
```

### Environment Variables
- **Backend (Render)**: Set in Render dashboard under Environment Variables
- **Frontend (Vercel)**: Set in Vercel dashboard under Environment Variables

### CORS Issues
If you encounter CORS issues:
1. Make sure your backend CORS configuration includes your Vercel domain
2. Ensure the `FRONTEND_URL` environment variable is set correctly in Render
3. Check that your API calls are using the correct backend URL

### Database Connection
- Ensure your MongoDB Atlas cluster allows connections from Render's IP addresses
- Add `0.0.0.0/0` to your MongoDB Atlas IP whitelist for Render

## Testing Your Deployment

1. **Test Backend**: Visit `https://your-backend-domain.onrender.com/api/dashboard/summary`
2. **Test Frontend**: Visit your Vercel domain and try logging in
3. **Test API Calls**: Check browser console for any CORS or connection errors

## Troubleshooting

### Common Issues:
1. **Port Already in Use**: Kill existing processes or use different ports
2. **CORS Errors**: Update CORS configuration with correct domains
3. **Environment Variables**: Ensure all variables are set in both Render and Vercel
4. **Build Failures**: Check that all dependencies are in the correct section of package.json

### Useful Commands:
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Check if ports are in use
netstat -ano | findstr :3000
netstat -ano | findstr :5000
``` 