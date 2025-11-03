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
    <section className="relative py-20 px-4 overflow-hidden min-h-[90vh] flex items-center" style={{ perspective: '2000px' }}>
      {/* 3D Liquid Glass Background */}
      <div className="absolute inset-0 overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
        <div className="liquid-orb top-[15%] left-[8%] w-[600px] h-[600px] text-primary" style={{ animationDelay: '0s', transform: 'translateZ(-100px)' }}></div>
        <div className="liquid-orb bottom-[10%] right-[12%] w-[700px] h-[700px] text-orange-500" style={{ animationDelay: '2s', transform: 'translateZ(-80px)' }}></div>
        <div className="liquid-orb top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-primary" style={{ animationDelay: '4s', transform: 'translateZ(-120px)' }}></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight animate-scaleIn">
            <span className="gradient-text">
              {t('appName')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-fadeInUp font-sans" style={{ animationDelay: '0.2s' }}>
            {t('heroDescription')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-scaleIn" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={onGetStarted}
              size="lg"
              variant="premium"
              className="text-lg px-8 py-6 animate-pulse-glow font-display"
            >
              {t('getStarted')}
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 stagger-animation" style={{ transformStyle: 'preserve-3d' }}>
            {[
              { icon: Brain, label: t('aiPowered'), delay: '0.5s' },
              { icon: Sparkles, label: 'Multi-language', delay: '0.6s' },
              { icon: GraduationCap, label: t('careerGuidance'), delay: '0.7s' },
              { icon: ArrowRight, label: t('instantHelp'), delay: '0.8s' }
            ].map((item, index) => (
              <div 
                key={index} 
                className="liquid-glass-intense glass-reflection p-6 morph-shape ripple-effect group cursor-pointer"
                style={{ 
                  animationDelay: item.delay,
                  transformStyle: 'preserve-3d'
                }}
              >
                <item.icon className="h-10 w-10 mx-auto mb-3 text-primary float-3d liquid-glow group-hover:scale-125 transition-transform duration-500" style={{ animationDelay: `${index * 0.5}s` }} />
                <p className="text-sm font-medium font-display relative z-10">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};