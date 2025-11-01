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
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto text-center max-w-5xl">
        <div className="mb-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary text-sm font-semibold backdrop-blur-sm animate-fade-in-up shimmer-effect">
          <Sparkles className="h-4 w-4 animate-glow" />
          {t('tagline')}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 gradient-text animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {t('heroTitle')}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {t('heroSubtitle')}
        </p>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="group premium-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-foreground">{t('multiModalAI')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('multiModalDesc')}</p>
          </div>
          
          <div className="group premium-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/50">
              <GraduationCap className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-foreground">{t('studyHelper')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('studyHelperDesc')}</p>
          </div>
          
          <div className="group premium-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
              <Sparkles className="h-8 w-8 text-primary-foreground animate-glow" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-foreground">{t('latestCourses')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('latestCoursesDesc')}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            variant="premium"
            className="group"
          >
            {t('getStarted')}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button variant="glass" size="lg">
            {t('learnMore')}
          </Button>
        </div>
      </div>
    </section>
  );
};