import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, MessageSquare, Target, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const ModernHowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      title: t('step1Title'),
      description: t('step1Desc'),
      gradient: 'from-orange-500 to-orange-600',
      number: '01'
    },
    {
      icon: MessageSquare,
      title: t('step2Title'),
      description: t('step2Desc'),
      gradient: 'from-orange-600 to-red-500',
      number: '02'
    },
    {
      icon: Target,
      title: t('step3Title'),
      description: t('step3Desc'),
      gradient: 'from-orange-400 to-orange-500',
      number: '03'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-orange-950/10"></div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20 animate-[scaleIn_0.5s_ease-out] px-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-sm border border-primary/20 mb-5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Simple Process
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            {t('howItWorks')}
          </h2>
          <p className="text-muted-foreground text-base md:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            {t('howItWorksExp')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative px-4">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative animate-[fadeInUp_0.5s_ease-out]" style={{ animationDelay: `${index * 0.15}s` }}>
              <Card variant="glass" className="group h-full">
                <CardContent className="p-8 md:p-10 text-center relative z-10 h-full flex flex-col">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-all duration-300 z-10">
                    <span className="text-lg font-display font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`mx-auto mb-6 md:mb-8 w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-all duration-300`}>
                    <step.icon className="h-8 md:h-10 w-8 md:w-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold mb-3 md:mb-4 text-lg md:text-xl lg:text-2xl group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed flex-grow">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
