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
    <section id="how-it-works" className="relative py-32 px-4 overflow-hidden" style={{ perspective: '2000px' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-orange-950/20"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-30" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute top-[30%] left-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-orange-500/30 to-transparent blur-[130px] animate-float-slow"></div>
        <div className="absolute bottom-[30%] right-[15%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-orange-600/25 to-transparent blur-[120px] animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-scaleIn">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass-intense border border-primary/30 mb-6 morph-shape">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Simple Process
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            {t('howItWorks')}
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            {t('howItWorksExp')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                transformStyle: 'preserve-3d'
              }}
            >
              <Card variant="glass" className="group morph-shape h-full">
                <CardContent className="p-10 text-center relative z-10 h-full flex flex-col">
                  {/* Number Badge */}
                  <div className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/40 group-hover:shadow-orange-500/60 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 morph-shape z-10">
                    <span className="text-2xl font-display font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl shadow-orange-500/40 group-hover:shadow-orange-500/60 transition-all duration-500 group-hover:scale-125 float-3d morph-shape`}>
                    <step.icon className="h-12 w-12 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold mb-4 text-2xl group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground font-sans group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed flex-grow">
                    {step.description}
                  </p>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none"></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
