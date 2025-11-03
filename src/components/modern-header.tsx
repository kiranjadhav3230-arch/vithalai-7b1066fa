import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ModernHeaderProps {
  onAuthClick: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({ onAuthClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setIsMobileMenuOpen(false);
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
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <img 
                src="/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png" 
                alt="Vithal AI Logo" 
                className="h-8 w-8"
              />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
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
          <div className="flex items-center gap-4">
            <LanguageSelector 
              language={language} 
              onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} 
            />
            <Button 
              onClick={onAuthClick}
              className="hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
            >
              {t('login')}
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg liquid-glass-intense hover:scale-110 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-20 left-4 right-4 liquid-glass-intense rounded-2xl p-6 space-y-4 animate-scaleIn">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left px-4 py-3 rounded-xl hover:bg-primary/10 font-display font-medium transition-colors"
            >
              {t('howItWorks')}
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-3 rounded-xl hover:bg-primary/10 font-display font-medium transition-colors"
            >
              {t('features')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-3 rounded-xl hover:bg-primary/10 font-display font-medium transition-colors"
            >
              {t('contact')}
            </button>
            <Button 
              onClick={() => {
                onAuthClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold"
            >
              {t('login')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
