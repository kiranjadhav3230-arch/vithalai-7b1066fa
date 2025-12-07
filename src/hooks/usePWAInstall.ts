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
      console.log('[PWA] Standalone mode:', isStandalone || isIOSStandalone);
    };

    // Check device type
    const checkDevice = () => {
      const ua = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /ipad|iphone|ipod/.test(ua) && !(window as any).MSStream;
      const isAndroidDevice = /android/.test(ua);
      const isChrome = /chrome/.test(ua) && !/edge|edg/.test(ua);
      
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);
      
      console.log('[PWA] Device detection:', { isIOSDevice, isAndroidDevice, isChrome, ua });
      
      // On supported browsers, assume installable
      if ((isAndroidDevice || isChrome) && !isIOSDevice) {
        setIsInstallable(true);
      }
    };

    checkInstalled();
    checkDevice();

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('[PWA] beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully!');
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

  const installApp = useCallback(async (): Promise<{ success: boolean; message: string; showInstructions?: boolean }> => {
    console.log('[PWA] Install button clicked, deferredPrompt:', !!deferredPrompt);
    
    // If we have the deferred prompt, use it
    if (deferredPrompt) {
      try {
        console.log('[PWA] Triggering install prompt...');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] User choice:', outcome);
        
        if (outcome === 'accepted') {
          setIsInstallable(false);
          setDeferredPrompt(null);
          return { success: true, message: 'App installed successfully!' };
        } else {
          return { success: false, message: 'Installation cancelled' };
        }
      } catch (error) {
        console.error('[PWA] Installation error:', error);
        return { success: false, message: 'Installation failed', showInstructions: true };
      }
    }
    
    // No deferred prompt available - show manual instructions
    console.log('[PWA] No deferred prompt available, showing instructions');
    return { success: false, message: 'Please use browser menu to install', showInstructions: true };
  }, [deferredPrompt]);

  return {
    isInstallable: isInstallable || isAndroid || !isIOS, // Show on most devices except showing iOS instructions
    isInstalled,
    isIOS,
    isAndroid,
    hasPrompt: !!deferredPrompt,
    installApp
  };
};
