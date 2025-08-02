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
          <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('multiModalAI')}</h3>
            <p className="text-sm text-muted-foreground text-center">{t('multiModalDesc')}</p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('studyHelper')}</h3>
            <p className="text-sm text-muted-foreground text-center">{t('studyHelperDesc')}</p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('latestCourses')}</h3>
            <p className="text-sm text-muted-foreground text-center">{t('latestCoursesDesc')}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 text-lg"
          >
            {t('getStarted')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
            {t('learnMore')}
          </Button>
        </div>
      </div>
    </section>
  );
};