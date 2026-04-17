import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';

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
          ? 'bg-black/60 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-foreground">Vithal AI</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSelector
                language={language}
                onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')}
              />
            </div>
            <Button
              onClick={onAuthClick}
              size="sm"
              className="rounded-full px-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 hover:opacity-90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
