# Quick Vercel Deployment Steps

## 🚀 Deploy in 5 Minutes

### Step 1: Go to Vercel
Visit: https://vercel.com/new

### Step 2: Import Your Repository
- Click "Import Git Repository"
- Select: `RyanClaud/MotoMINDORO-Ecommerce-Platform`

### Step 3: Configure Build Settings
```
Framework Preset: Vite
Root Directory: react-frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Add Environment Variable
Click "Environment Variables" and add:
```
Name: VITE_API_URL
Value: http://localhost:8000
```
(Update this later when you deploy your Laravel backend)

### Step 5: Deploy!
Click "Deploy" button and wait ~2 minutes

## ✅ Your App Will Be Live At:
`https://your-project-name.vercel.app`

## 🔧 After First Deployment

### Update Environment Variable
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Edit `VITE_API_URL` to your Laravel backend URL
4. Redeploy (Deployments → Click "..." → Redeploy)

### Add Custom Domain (Optional)
1. Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL (automatic)

## 🐛 If Build Fails

### Error: "vite: command not found"
**Solution:** Make sure Root Directory is set to `react-frontend`

### Error: "Module not found"
**Solution:** Clear build cache and redeploy
- Deployments → Click "..." → Redeploy → Check "Clear cache"

### Error: "404 on page refresh"
**Solution:** Already fixed in vercel.json (rewrites configured)

## 📱 Test Your Deployment

1. Visit your Vercel URL
2. Try browsing listings (will show empty until backend is connected)
3. Test PWA install (should work!)
4. Test offline mode (should cache pages)

## 🔗 Next Steps

1. **Deploy Laravel Backend** (see VERCEL_DEPLOYMENT.md)
   - Recommended: Railway.app or Heroku
   
2. **Update VITE_API_URL** in Vercel
   - Point to your deployed backend

3. **Configure CORS** on Laravel backend
   - Allow your Vercel domain

4. **Test Full Functionality**
   - Login, create listings, etc.

## 💡 Pro Tips

- Every push to `main` auto-deploys
- Pull requests get preview URLs
- Free SSL certificate included
- CDN and caching automatic
- Rollback anytime from dashboard

## 📞 Need Help?

Check the full guide: `VERCEL_DEPLOYMENT.md`
