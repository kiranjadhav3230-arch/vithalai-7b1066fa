import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';
import vithalLogo from '@/assets/vithal-pin-logo.png';

interface GlassHeaderProps {
  onAuthClick: () => void;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({ onAuthClick }) => {
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg overflow-hidden bg-card ring-1 ring-border">
              <img src={vithalLogo} alt="Vithal AI" className="h-full w-full object-cover" />
            </div>
            <span className="text-base font-display font-semibold text-foreground">Vithal AI</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSelector
                language={language}
                onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')}
              />
            </div>
            <Button
              onClick={onAuthClick}
              size="sm"
              className="rounded-lg h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
