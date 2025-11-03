import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, Brain, Target } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserCheck,
      title: t('step1Title'),
      description: t('step1Desc'),
      step: '01'
    },
    {
      icon: Brain,
      title: t('step2Title'),
      description: t('step2Desc'),
      step: '02'
    },
    {
      icon: Target,
      title: t('step3Title'),
      description: t('step3Desc'),
      step: '03'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden" style={{ perspective: '2000px' }}>
      <div className="absolute inset-0 overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
        <div className="liquid-orb top-[10%] left-[20%] w-[650px] h-[650px] text-primary" style={{ animationDelay: '0.5s', transform: 'translateZ(-95px)' }}></div>
        <div className="liquid-orb bottom-[15%] right-[25%] w-[600px] h-[600px] text-orange-500" style={{ animationDelay: '2.5s', transform: 'translateZ(-85px)' }}></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20 animate-scaleIn">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">{t('howItWorks')}</h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed font-sans">
            {t('howItWorksExp')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 stagger-animation" style={{ transformStyle: 'preserve-3d' }}>
          {steps.map((step, index) => (
            <div key={index} className="relative" style={{ transformStyle: 'preserve-3d' }}>
              <Card variant="glass" className="group morph-shape" style={{ animationDelay: `${index * 0.2}s`, transformStyle: 'preserve-3d' }}>
                <CardContent className="p-10 text-center relative z-10">
                  <div className="relative mb-8">
                    <div className="absolute -top-6 -right-6 w-14 h-14 liquid-glass-intense flex items-center justify-center text-lg font-bold shadow-lg shadow-primary/40 group-hover:scale-125 transition-all duration-500 liquid-glow morph-shape">
                      <span className="gradient-text font-display">{step.step}</span>
                    </div>
                    <div className="mx-auto w-24 h-24 liquid-glass-intense flex items-center justify-center shadow-xl shadow-primary/40 group-hover:shadow-primary/60 transition-all duration-500 group-hover:scale-125 liquid-glow morph-shape float-3d">
                      <step.icon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold mb-4 text-2xl group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                  <p className="text-muted-foreground font-sans group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed text-base">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2 rounded-full shadow-lg shadow-primary/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};