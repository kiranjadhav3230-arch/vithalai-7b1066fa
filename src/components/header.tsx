import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';

interface HeaderProps {
  onAuthClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png" 
            alt="Vithal AI Logo" 
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-primary">{t('appName')}</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('howItWorks')}
          </a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('features')}
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('contact')}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSelector 
            language={language} 
            onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} 
          />
          <Button onClick={onAuthClick} variant="outline">
            {t('login')}
          </Button>
        </div>
      </div>
    </header>
  );
};