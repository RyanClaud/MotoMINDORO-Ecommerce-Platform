import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
    // Show a toast notification
    showOfflineNotification();
  },
  onRegistered(registration) {
    console.log('Service Worker registered:', registration);
  },
  onRegisterError(error) {
    console.error('Service Worker registration error:', error);
  }
});

function showOfflineNotification() {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-up';
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="font-semibold">App ready for offline use!</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

export default updateSW;
