# Vercel Deployment Guide for MotoMINDORO

## Quick Deploy

### Option 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `MotoMINDORO-Ecommerce-Platform`

3. **Configure Project Settings**
   ```
   Framework Preset: Vite
   Root Directory: react-frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables** (Add these in Vercel dashboard)
   ```
   VITE_API_URL=https://your-laravel-backend.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

### Option 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Root Directory**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? motomindoro
   - In which directory is your code located? react-frontend
   - Want to override settings? Yes
   - Build Command: npm run build
   - Output Directory: dist
   - Development Command: npm run dev

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Project Structure for Vercel

```
MotoMINDORO-Ecommerce-Platform/
├── react-frontend/          ← Frontend (Deploy this to Vercel)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── laravel-backend/         ← Backend (Deploy separately)
├── vercel.json             ← Vercel configuration
└── package.json            ← Root package.json
```

## Important Configuration Files

### vercel.json
Already configured in the root directory. This tells Vercel:
- Where to find the build command
- Where the output files are
- How to handle routing (SPA)

### react-frontend/.env.production
Create this file with your production API URL:
```env
VITE_API_URL=https://your-laravel-backend.com
```

## Backend Deployment

Your Laravel backend needs to be deployed separately. Options:

### 1. Railway.app (Recommended for Laravel)
- Free tier available
- Easy Laravel deployment
- Automatic HTTPS
- Visit: https://railway.app/

### 2. Heroku
- Popular choice for Laravel
- Free tier available
- Visit: https://www.heroku.com/

### 3. DigitalOcean App Platform
- $5/month
- Great performance
- Visit: https://www.digitalocean.com/products/app-platform

### 4. AWS/Azure/GCP
- More complex but scalable
- Requires more configuration

## After Deployment

### 1. Update API URL
In `react-frontend/src/api/axios.js`, update the baseURL:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

### 2. Configure CORS on Backend
In your Laravel backend `config/cors.php`:
```php
'allowed_origins' => [
    'https://your-vercel-app.vercel.app',
    'https://motomindoro.com', // your custom domain
],
```

### 3. Update Environment Variables
Add in Vercel dashboard under Settings → Environment Variables:
- `VITE_API_URL` - Your Laravel backend URL

### 4. Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Troubleshooting

### Build Fails with "vite: command not found"
- Make sure Root Directory is set to `react-frontend`
- Or use the vercel.json configuration provided

### 404 on Page Refresh
- Check that rewrites are configured in vercel.json
- Vercel should redirect all routes to index.html

### API Calls Failing
- Check VITE_API_URL environment variable
- Verify CORS settings on backend
- Check browser console for errors

### PWA Not Working
- Ensure HTTPS is enabled (Vercel provides this automatically)
- Check that service worker is registered
- Verify manifest.json is accessible

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch automatically deploys
- Pull requests get preview deployments
- Rollback to previous deployments anytime

## Performance Optimization

### 1. Enable Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to your App.jsx:
```javascript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 2. Enable Vercel Speed Insights
```bash
npm install @vercel/speed-insights
```

### 3. Configure Caching
Vercel automatically caches static assets. For API caching, use:
```javascript
// In your API calls
fetch(url, {
  headers: {
    'Cache-Control': 'max-age=3600'
  }
})
```

## Monitoring

- **Vercel Dashboard**: View deployments, logs, and analytics
- **Real-time Logs**: `vercel logs`
- **Build Logs**: Available in deployment details

## Cost

- **Hobby Plan**: Free
  - 100 GB bandwidth
  - Unlimited deployments
  - Automatic HTTPS
  - Perfect for this project

- **Pro Plan**: $20/month
  - More bandwidth
  - Team collaboration
  - Advanced analytics

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- Project Issues: https://github.com/RyanClaud/MotoMINDORO-Ecommerce-Platform/issues
