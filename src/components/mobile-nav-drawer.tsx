import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';

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

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false);
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
