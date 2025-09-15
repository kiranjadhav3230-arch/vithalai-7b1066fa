import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Brain, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const { t } = useLanguage();

  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          {t('tagline')}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Enhanced Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="floating-card flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm border border-primary/30 shadow-lg">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-6 shadow-lg">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-3 gradient-text">{t('multiModalAI')}</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">{t('multiModalDesc')}</p>
          </div>
          
          <div className="floating-card flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 backdrop-blur-sm border border-accent/30 shadow-lg">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-6 shadow-lg">
              <GraduationCap className="h-7 w-7 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-3 gradient-text">{t('studyHelper')}</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">{t('studyHelperDesc')}</p>
          </div>
          
          <div className="floating-card flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm border border-primary/30 shadow-lg">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-3 gradient-text">{t('latestCourses')}</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">{t('latestCoursesDesc')}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            onClick={onGetStarted}
            variant="premium"
            size="lg" 
            className="px-10 py-4 text-lg font-semibold"
          >
            {t('getStarted')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="lg" className="px-10 py-4 text-lg font-medium">
            {t('learnMore')}
          </Button>
        </div>
      </div>
    </section>
  );
};