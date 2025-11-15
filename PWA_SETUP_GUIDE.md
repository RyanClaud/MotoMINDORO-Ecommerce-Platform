# PWA Setup Guide for MotoMINDORO

## What is PWA?

Progressive Web App (PWA) functionality has been added to MotoMINDORO, allowing users to:
- Install the app on their devices (mobile and desktop)
- Use the app offline with cached content
- Receive faster loading times
- Get a native app-like experience

## Features Implemented

### 1. Service Worker
- Automatic caching of assets and API responses
- Offline functionality for previously viewed content
- Background sync capabilities

### 2. Install Prompt
- Smart install banner that appears for eligible users
- Can be dismissed and won't show again
- Works on Android, iOS (Add to Home Screen), and Desktop

### 3. Network Status Indicator
- Real-time online/offline detection
- Visual notifications when connection changes
- Graceful degradation when offline

### 4. Caching Strategy
- **API Calls**: NetworkFirst (tries network, falls back to cache)
- **Images**: CacheFirst (serves from cache, updates in background)
- **Static Assets**: Precached during installation

## How to Generate PWA Icons

### Option 1: Using the HTML Converter (Easiest)
1. Open `react-frontend/public/convert-svg-to-png.html` in your browser
2. The icons will automatically download
3. Place `pwa-192x192.png` and `pwa-512x512.png` in the `public` folder

### Option 2: Using Online Tools
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your logo/icon
3. Generate PWA icons (192x192 and 512x512)
4. Download and place in `public` folder

### Option 3: Manual Creation
Create two PNG files with your branding:
- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)

## Testing PWA Functionality

### On Desktop (Chrome/Edge)
1. Run `npm run dev` in the react-frontend folder
2. Open http://localhost:5173
3. Look for the install icon in the address bar
4. Click to install the app

### On Mobile (Android)
1. Deploy your app or use ngrok for local testing
2. Open in Chrome
3. Tap the menu and select "Add to Home Screen"
4. The app will install like a native app

### On iOS
1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will be added to your home screen

## Testing Offline Mode

1. Open the app in your browser
2. Browse some listings and stores
3. Open DevTools (F12)
4. Go to Network tab
5. Select "Offline" from the throttling dropdown
6. Refresh the page - you should see cached content
7. Try navigating to previously viewed pages

## Configuration

### Manifest Settings
Edit `vite.config.js` to customize:
- App name and short name
- Theme colors
- Display mode
- Icons
- Start URL

### Cache Settings
Modify the `workbox` configuration in `vite.config.js`:
- Cache duration
- Maximum cache entries
- URL patterns to cache

## Production Build

When building for production:

```bash
cd react-frontend
npm run build
```

The PWA assets will be automatically generated in the `dist` folder:
- `manifest.webmanifest`
- `sw.js` (service worker)
- `workbox-*.js` (workbox runtime)

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet
- ⚠️ iOS Safari has limited PWA features

## Troubleshooting

### Install prompt not showing?
- Make sure you're using HTTPS (or localhost)
- Check that manifest.json is valid
- Ensure service worker is registered
- Clear browser cache and try again

### Offline mode not working?
- Check service worker registration in DevTools
- Verify cache storage in Application tab
- Make sure you've visited pages before going offline

### Icons not displaying?
- Ensure PNG files are in the public folder
- Check file names match manifest configuration
- Verify image dimensions (192x192 and 512x512)

## Additional Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Guide](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
