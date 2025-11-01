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
    <section className="relative py-20 px-4 overflow-hidden min-h-[90vh] flex items-center">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-glow"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fadeInUp">
            <span className="gradient-text">
              {t('appName')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {t('heroDescription')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={onGetStarted}
              size="lg"
              variant="premium"
              className="text-lg px-8 py-6"
            >
              {t('getStarted')}
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Brain, label: t('aiPowered'), delay: '0.5s' },
              { icon: Sparkles, label: 'Multi-language', delay: '0.6s' },
              { icon: GraduationCap, label: t('careerGuidance'), delay: '0.7s' },
              { icon: ArrowRight, label: t('instantHelp'), delay: '0.8s' }
            ].map((item, index) => (
              <div key={index} className="premium-card p-4 animate-slideInRight" style={{ animationDelay: item.delay }}>
                <item.icon className="h-8 w-8 mx-auto mb-2 text-primary animate-float" style={{ animationDelay: `${index * 0.5}s` }} />
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};