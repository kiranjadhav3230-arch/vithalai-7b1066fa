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
    <section id="how-it-works" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorks')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simple steps to discover your ideal career path with AI assistance
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-3 text-xl">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};