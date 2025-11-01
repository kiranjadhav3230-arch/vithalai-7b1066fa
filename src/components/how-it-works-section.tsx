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
    <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">{t('howItWorks')}</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            {t('howItWorksExp')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="premium-card group animate-fadeInUp" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110 animate-glow">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-3 text-xl group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{step.description}</p>
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