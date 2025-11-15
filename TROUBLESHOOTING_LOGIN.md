# Troubleshooting "Invalid Credentials" Error

## 🔴 Problem: Login fails with "Invalid credentials"

This happens because your frontend (Vercel) can't reach your backend (localhost).

## ✅ Quick Fix Steps

### Step 1: Check What's Happening
Open your Vercel app → Press F12 (DevTools) → Go to Network tab → Try to login

You'll see one of these errors:

#### Error A: "Failed to fetch" or "net::ERR_CONNECTION_REFUSED"
**Cause:** Frontend is trying to connect to `http://localhost:8000`
**Solution:** Deploy your backend (see below)

#### Error B: "CORS policy: No 'Access-Control-Allow-Origin'"
**Cause:** Backend doesn't allow requests from Vercel domain
**Solution:** Update CORS config (see below)

#### Error C: "419 CSRF token mismatch"
**Cause:** Session/cookie configuration issue
**Solution:** Update session settings (see below)

## 🚀 Solution 1: Deploy Backend (Required!)

Your backend MUST be deployed and accessible online. Choose one:

### Option A: Railway.app (Easiest - 5 minutes)

1. **Go to Railway**
   - Visit: https://railway.app/
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `MotoMINDORO-Ecommerce-Platform`

3. **Configure**
   - Settings → Root Directory: `laravel-backend`
   - Add MySQL database (New → Database → MySQL)

4. **Add Environment Variables**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
   SESSION_DOMAIN=.railway.app
   SESSION_SECURE_COOKIE=true
   SESSION_SAME_SITE=none
   ```

5. **Deploy & Get URL**
   - Railway will give you a URL like: `https://motomindoro-api.railway.app`
   - Copy this URL

6. **Update Vercel**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Edit `VITE_API_URL` to: `https://motomindoro-api.railway.app`
   - Deployments → Redeploy

### Option B: Use a Temporary Backend (For Testing Only)

If you just want to test quickly, you can use ngrok:

1. **Install ngrok**
   - Download from: https://ngrok.com/download

2. **Start your local Laravel**
   ```bash
   cd laravel-backend
   php artisan serve
   ```

3. **Expose with ngrok**
   ```bash
   ngrok http 8000
   ```

4. **Copy the HTTPS URL**
   - ngrok will show: `https://abc123.ngrok.io`

5. **Update Vercel**
   - Settings → Environment Variables
   - `VITE_API_URL` = `https://abc123.ngrok.io`
   - Redeploy

6. **Update Laravel CORS**
   ```bash
   # In laravel-backend/.env
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```

## 🔧 Solution 2: Fix CORS (After Backend is Deployed)

### Update Laravel .env
```env
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app,localhost
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Verify CORS Config
File: `laravel-backend/config/cors.php`
```php
'allowed_origins' => array_filter(explode(',', env('ALLOWED_ORIGINS', 'http://localhost:5173'))),
'supports_credentials' => true,
```

## 🍪 Solution 3: Fix Session/Cookie Issues

### Update Laravel .env for Production
```env
SESSION_DRIVER=database
SESSION_DOMAIN=.railway.app  # or your backend domain
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
SESSION_HTTP_ONLY=true
```

### Why these settings?
- `SESSION_SECURE_COOKIE=true` - Required for HTTPS
- `SESSION_SAME_SITE=none` - Allows cross-site cookies
- `SESSION_DOMAIN` - Must match your backend domain

## 🧪 Testing Checklist

### 1. Test Backend API
Visit: `https://your-backend-url/api/user`

Should return: `{"message":"Unauthenticated."}`  ← This is good!

### 2. Test CORS
```bash
curl -H "Origin: https://your-vercel-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend-url/api/login
```

Should include: `Access-Control-Allow-Origin` header

### 3. Test Login from Vercel
1. Open your Vercel app
2. Open DevTools (F12) → Network tab
3. Try to login
4. Check the request:
   - URL should be your deployed backend
   - Status should be 200 (not 401, 419, or 500)
   - Response should include user data

## 🐛 Common Errors & Solutions

### Error: "net::ERR_FAILED" or "Failed to fetch"
**Cause:** Backend URL is wrong or backend is down
**Fix:** 
- Check VITE_API_URL in Vercel
- Verify backend is running
- Test backend URL in browser

### Error: "401 Unauthenticated"
**Cause:** Credentials are wrong OR database has no users
**Fix:**
- Run seeders: `php artisan db:seed`
- Check database has users
- Verify password is correct

### Error: "419 CSRF token mismatch"
**Cause:** Session/cookie configuration
**Fix:**
- Set SESSION_SAME_SITE=none
- Set SESSION_SECURE_COOKIE=true
- Clear browser cookies
- Try in incognito mode

### Error: "CORS policy" error
**Cause:** Backend doesn't allow your Vercel domain
**Fix:**
- Add Vercel domain to ALLOWED_ORIGINS
- Restart backend
- Clear browser cache

### Error: "500 Internal Server Error"
**Cause:** Backend configuration issue
**Fix:**
- Check backend logs
- Verify all environment variables are set
- Check database connection
- Run migrations

## 📊 Environment Variables Summary

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Railway/Heroku (Backend)
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-url.railway.app
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
SESSION_DOMAIN=.railway.app
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
DB_CONNECTION=mysql
DB_HOST=<provided-by-railway>
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=<provided-by-railway>
```

## ✅ Final Checklist

- [ ] Backend deployed and accessible
- [ ] Database created and migrated
- [ ] Seeders run (users exist in database)
- [ ] VITE_API_URL updated in Vercel
- [ ] ALLOWED_ORIGINS includes Vercel domain
- [ ] SANCTUM_STATEFUL_DOMAINS includes Vercel domain
- [ ] SESSION_SECURE_COOKIE=true
- [ ] SESSION_SAME_SITE=none
- [ ] Frontend redeployed after env changes
- [ ] Tested login in incognito mode

## 🆘 Still Not Working?

1. **Check Backend Logs**
   - Railway: Dashboard → Logs
   - Heroku: `heroku logs --tail`

2. **Check Browser Console**
   - Look for red errors
   - Check Network tab for failed requests

3. **Test API Directly**
   - Use Postman or curl
   - Try login endpoint directly

4. **Verify Database**
   - Check if users table has data
   - Verify password hashing

5. **Try Incognito Mode**
   - Clears cookies and cache
   - Rules out browser issues

## 📞 Need More Help?

Share these details:
- Error message from browser console
- Network tab screenshot
- Backend logs
- Environment variables (hide sensitive data)
