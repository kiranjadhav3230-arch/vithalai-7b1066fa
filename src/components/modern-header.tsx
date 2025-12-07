import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { MobileNavDrawer } from '@/components/mobile-nav-drawer';
import { useLanguage } from '@/hooks/useLanguage';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download, Smartphone, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ModernHeaderProps {
  onAuthClick: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({ onAuthClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const { toast } = useToast();
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-2xl border-b border-orange-500/20 shadow-2xl shadow-orange-500/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300 sm:group-hover:scale-110 sm:group-hover:rotate-12">
              <img 
                src="/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png" 
                alt="Vithal AI Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
            </div>
            <span className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              {t('appName')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-foreground/80 hover:text-primary font-display font-medium transition-colors relative group"
            >
              {t('howItWorks')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground/80 hover:text-primary font-display font-medium transition-colors relative group"
            >
              {t('features')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-foreground/80 hover:text-primary font-display font-medium transition-colors relative group"
            >
              {t('contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Download App Button */}
            <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden lg:inline">Download App</span>
                </Button>
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
                      <span>App is already installed on your device!</span>
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
                        <li>Open this site in <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Safari</strong></li>
                        <li>Look for the install icon in the address bar</li>
                        <li>Or use browser menu → "Install app" / "Add to Home Screen"</li>
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>✓ Works offline • ✓ Fast loading • ✓ No app store needed</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="hidden sm:block">
              <LanguageSelector 
                language={language} 
                onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} 
              />
            </div>
            <Button 
              onClick={onAuthClick}
              className="hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
            >
              {t('login')}
            </Button>
            
            {/* Mobile Navigation Drawer */}
            <MobileNavDrawer onAuthClick={onAuthClick} scrollToSection={scrollToSection} />
          </div>
        </div>
      </header>
    </>
  );
};