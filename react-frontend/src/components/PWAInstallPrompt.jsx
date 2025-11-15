import { useState, useEffect } from 'react';
import { FaTimes, FaDownload } from 'react-icons/fa';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 text-white">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
        
        <div className="flex items-start space-x-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <FaDownload className="text-2xl" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Install MotoMINDORO</h3>
            <p className="text-sm text-white/90 mb-4">
              Install our app for a better experience with offline access and faster loading!
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleInstall}
                className="flex-1 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
