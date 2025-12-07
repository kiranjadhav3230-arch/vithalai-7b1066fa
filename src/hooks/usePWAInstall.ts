import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    // Check device type
    const checkDevice = () => {
      const ua = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /ipad|iphone|ipod/.test(ua) && !(window as any).MSStream;
      const isAndroidDevice = /android/.test(ua);
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);
      
      // On Android/Chrome, we can assume installable even before the event fires
      if (isAndroidDevice && !isIOSDevice) {
        setIsInstallable(true);
      }
    };

    checkInstalled();
    checkDevice();

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const installApp = useCallback(async () => {
    // If we have the deferred prompt, use it
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setIsInstallable(false);
          setDeferredPrompt(null);
          return { success: true, message: 'App installed successfully!' };
        } else {
          return { success: false, message: 'Installation cancelled' };
        }
      } catch (error) {
        return { success: false, message: 'Installation failed' };
      }
    }
    
    // Fallback - try to trigger install via navigation
    // This works on some browsers
    return { success: false, message: 'Please use browser menu to install', showInstructions: true };
  }, [deferredPrompt]);

  return {
    isInstallable: isInstallable || isAndroid, // Always show on Android
    isInstalled,
    isIOS,
    isAndroid,
    hasPrompt: !!deferredPrompt,
    installApp
  };
};
