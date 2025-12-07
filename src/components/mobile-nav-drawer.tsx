import React, { useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X, Download, Smartphone, Check } from 'lucide-react';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MobileNavDrawerProps {
  onAuthClick: () => void;
  scrollToSection: (id: string) => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  onAuthClick,
  scrollToSection
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showInstallDialog, setShowInstallDialog] = React.useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const { toast } = useToast();

  // Swipe gesture handling
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      // Swipe from right edge to left (close drawer)
      if (isOpen && touchStartX.current - touchEndX.current > 75) {
        setIsOpen(false);
      }
      // Swipe from right edge to open
      if (!isOpen && touchStartX.current > window.innerWidth - 50 && touchEndX.current - touchStartX.current > 75) {
        setIsOpen(true);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen]);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  const handleInstallApp = async () => {
    const result = await installApp();
    if (result.success) {
      toast({
        title: "App Installed!",
        description: "Vithal AI has been installed on your device."
      });
      setShowInstallDialog(false);
    } else {
      toast({
        variant: "destructive",
        title: "Installation",
        description: result.message
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 transition-all duration-300 border border-orange-500/30"
        >
          <Menu className="h-5 w-5 text-orange-400" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-[280px] sm:w-[320px] bg-black/98 backdrop-blur-2xl border-l border-orange-500/30 p-0"
      >
        <SheetHeader className="border-b border-orange-500/20 p-4">
          <SheetTitle className="flex items-center justify-between">
            <span className="text-lg font-display font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Menu
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 hover:bg-orange-500/10"
            >
              <X className="h-5 w-5 text-orange-400" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-orange-500/10 font-display font-medium transition-all duration-300 text-foreground/80 hover:text-orange-400 border border-transparent hover:border-orange-500/20"
            >
              {t('howItWorks')}
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-orange-500/10 font-display font-medium transition-all duration-300 text-foreground/80 hover:text-orange-400 border border-transparent hover:border-orange-500/20"
            >
              {t('features')}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-orange-500/10 font-display font-medium transition-all duration-300 text-foreground/80 hover:text-orange-400 border border-transparent hover:border-orange-500/20"
            >
              {t('contact')}
            </button>

            {/* Download App Button */}
            <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
              <DialogTrigger asChild>
                <button
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 font-display font-medium transition-all duration-300 text-orange-400 border border-orange-500/30 flex items-center gap-3"
                >
                  <Download className="h-5 w-5" />
                  Download App
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-orange-400" />
                    Download Vithal AI App
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
                    <img 
                      src="/pwa-192x192.png" 
                      alt="Vithal AI" 
                      className="h-16 w-16 rounded-xl"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">Vithal AI</h3>
                      <p className="text-sm text-muted-foreground">AI Career Companion</p>
                    </div>
                  </div>

                  {isInstalled ? (
                    <div className="flex items-center gap-2 text-green-400 text-sm p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <Check className="h-5 w-5" />
                      <span>App is already installed!</span>
                    </div>
                  ) : isIOS ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">To install on iOS:</p>
                      <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-2">
                        <li>Tap the <strong>Share</strong> button <span className="inline-block px-2 py-0.5 bg-muted rounded text-xs">↑</span> in Safari</li>
                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                        <li>Tap <strong>"Add"</strong> to install Vithal AI</li>
                      </ol>
                    </div>
                  ) : isInstallable ? (
                    <Button 
                      onClick={handleInstallApp}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Install Vithal AI
                    </Button>
                  ) : (
                    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-2">How to install:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Open in <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Safari</strong></li>
                        <li>Look for the install icon in the address bar</li>
                        <li>Or use browser menu → "Add to Home Screen"</li>
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>✓ Works offline • ✓ Fast loading • ✓ No app store needed</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </nav>

          {/* Language Selector & Login Button */}
          <div className="p-4 border-t border-orange-500/20 space-y-3">
            <div className="mb-3">
              <label className="text-xs font-display font-semibold text-orange-400 mb-2 block">
                {t('language')}
              </label>
              <LanguageSelector 
                language={language} 
                onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} 
              />
            </div>
            
            <Button 
              onClick={() => {
                onAuthClick();
                setIsOpen(false);
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold py-3 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300"
            >
              {t('login')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
