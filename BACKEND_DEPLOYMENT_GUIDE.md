# Backend Deployment Guide - Fix "Invalid Credentials" Error

## 🔴 Current Problem

Your frontend on Vercel is trying to connect to `http://localhost:8000/api`, which doesn't exist in production. You need to deploy your Laravel backend.

## 🚀 Quick Solution - Deploy Backend to Railway.app (Recommended)

### Step 1: Sign Up for Railway
1. Go to https://railway.app/
2. Sign in with GitHub
3. It's FREE for hobby projects!

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `MotoMINDORO-Ecommerce-Platform`
4. Railway will detect Laravel automatically

### Step 3: Configure Root Directory
1. In Railway dashboard, go to Settings
2. Set "Root Directory" to: `laravel-backend`
3. Click "Save"

### Step 4: Add Environment Variables
Click "Variables" tab and add these:

```env
APP_NAME=MotoMINDORO
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-app.railway.app

DB_CONNECTION=mysql
DB_HOST=YOUR_RAILWAY_DB_HOST
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=YOUR_RAILWAY_DB_PASSWORD

SESSION_DRIVER=cookie
SESSION_DOMAIN=.railway.app
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app

FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 5: Add MySQL Database
1. In Railway, click "New" → "Database" → "Add MySQL"
2. Railway will automatically set DB environment variables
3. Wait for database to provision

### Step 6: Run Migrations
1. In Railway dashboard, go to your Laravel service
2. Click "Settings" → "Deploy"
3. Add this to "Build Command":
   ```bash
   php artisan migrate --force && php artisan db:seed --force
   ```

### Step 7: Get Your Backend URL
1. Go to "Settings" → "Domains"
2. Railway will provide a URL like: `https://your-app.railway.app`
3. Copy this URL

### Step 8: Update Vercel Environment Variable
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Edit `VITE_API_URL` to: `https://your-app.railway.app`
4. Go to Deployments → Click "..." → Redeploy

### Step 9: Configure CORS on Backend
Update `laravel-backend/config/cors.php`:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://your-vercel-app.vercel.app',
        'http://localhost:5173', // for local development
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## 🎯 Alternative: Deploy to Heroku

### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
cd laravel-backend
heroku create motomindoro-api
```

### Step 4: Add MySQL Database
```bash
heroku addons:create jawsdb:kitefin
```

### Step 5: Set Environment Variables
```bash
heroku config:set APP_NAME=MotoMINDORO
heroku config:set APP_ENV=production
heroku config:set APP_KEY=$(php artisan key:generate --show)
heroku config:set APP_DEBUG=false
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 6: Create Procfile
Create `laravel-backend/Procfile`:
```
web: vendor/bin/heroku-php-apache2 public/
```

### Step 7: Deploy
```bash
git subtree push --prefix laravel-backend heroku main
```

### Step 8: Run Migrations
```bash
heroku run php artisan migrate --force
heroku run php artisan db:seed --force
```

## 🔧 Update Laravel Backend for Production

### 1. Update Session Configuration
`laravel-backend/config/session.php`:
```php
'domain' => env('SESSION_DOMAIN', null),
'secure' => env('SESSION_SECURE_COOKIE', true),
'same_site' => env('SESSION_SAME_SITE_COOKIE', 'none'),
```

### 2. Update Sanctum Configuration
`laravel-backend/config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1,your-vercel-app.vercel.app')),
```

### 3. Update CORS Configuration
`laravel-backend/config/cors.php`:
```php
'allowed_origins' => explode(',', env('ALLOWED_ORIGINS', 'http://localhost:5173')),
'supports_credentials' => true,
```

### 4. Add to .env
```env
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app,localhost
SESSION_DOMAIN=.railway.app
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE_COOKIE=none
```

## 🧪 Testing After Deployment

### 1. Test Backend API
Visit: `https://your-backend-url.railway.app/api/health`

Should return: `{"status": "ok"}`

### 2. Test CORS
Open browser console on your Vercel app and check for CORS errors

### 3. Test Login
Try logging in with test credentials

### 4. Check Network Tab
- Open DevTools → Network
- Try to login
- Check if API calls are going to the correct URL
- Look for CORS or 401 errors

## 🐛 Common Issues & Solutions

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution:** 
- Update CORS config in Laravel
- Add your Vercel domain to allowed_origins
- Make sure `supports_credentials` is true

### Issue: "419 CSRF token mismatch"
**Solution:**
- Update SESSION_DOMAIN in .env
- Set SESSION_SAME_SITE_COOKIE=none
- Set SESSION_SECURE_COOKIE=true
- Clear browser cookies and try again

### Issue: "Invalid credentials" (even with correct password)
**Solution:**
- Make sure database is seeded
- Check if users exist: `heroku run php artisan tinker` then `User::count()`
- Verify password hashing is working

### Issue: "Connection refused"
**Solution:**
- Check VITE_API_URL in Vercel
- Make sure it points to your deployed backend
- Redeploy frontend after changing env vars

## 📊 Cost Comparison

| Service | Free Tier | Paid |
|---------|-----------|------|
| Railway | $5 credit/month | $5/month after credit |
| Heroku | 1000 hours/month | $7/month |
| DigitalOcean | No free tier | $5/month |
| AWS/GCP | Complex free tier | Variable |

## ✅ Checklist

- [ ] Backend deployed to Railway/Heroku
- [ ] MySQL database created and connected
- [ ] Migrations and seeders run
- [ ] Environment variables configured
- [ ] CORS configured with Vercel domain
- [ ] VITE_API_URL updated in Vercel
- [ ] Frontend redeployed
- [ ] Login tested and working

## 🆘 Still Having Issues?

1. Check Railway/Heroku logs for errors
2. Check browser console for CORS errors
3. Verify environment variables are set correctly
4. Test API endpoints directly with Postman
5. Check if database has users (run seeders)

## 📞 Need Help?

- Railway Docs: https://docs.railway.app/
- Heroku Docs: https://devcenter.heroku.com/
- Laravel Deployment: https://laravel.com/docs/deployment
