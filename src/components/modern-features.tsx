import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Target, BookOpen, Users, TrendingUp, Award, Zap, Sparkles, Globe, Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const ModernFeatures: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      gradient: 'from-orange-500 to-orange-600',
      delay: '0s'
    },
    {
      icon: Target,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      gradient: 'from-orange-600 to-red-500',
      delay: '0.1s'
    },
    {
      icon: TrendingUp,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      gradient: 'from-orange-400 to-orange-500',
      delay: '0.2s'
    },
    {
      icon: BookOpen,
      title: 'Multi-language Support',
      description: 'Available in English, Hindi, and Marathi for better accessibility',
      gradient: 'from-orange-500 to-orange-700',
      delay: '0.3s'
    },
    {
      icon: Users,
      title: 'Indian Youth Focus',
      description: 'Specially designed for Indian job market and cultural context',
      gradient: 'from-orange-600 to-orange-800',
      delay: '0.4s'
    },
    {
      icon: Award,
      title: 'Career Success',
      description: 'Track your progress and celebrate your career milestones',
      gradient: 'from-orange-400 to-orange-600',
      delay: '0.5s'
    }
  ];

  return (
    <section id="features" className="relative py-20 md:py-32 px-4 overflow-hidden" style={{ perspective: '2000px' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/10 to-black"></div>
      
      {/* Glowing Orbs - Responsive */}
      <div className="absolute inset-0 overflow-hidden opacity-30" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute top-[20%] right-[5%] md:right-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-gradient-to-br from-orange-500/30 to-transparent blur-[80px] md:blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-[20%] left-[5%] md:left-[10%] w-[450px] md:w-[700px] h-[450px] md:h-[700px] rounded-full bg-gradient-to-tl from-orange-600/25 to-transparent blur-[90px] md:blur-[140px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20 animate-scaleIn px-4">
          <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full liquid-glass-intense border border-primary/30 mb-4 md:mb-6 morph-shape">
            <Sparkles className="h-4 md:h-5 w-4 md:w-5 text-primary animate-pulse" />
            <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            {t('features')}
          </h2>
          <p className="text-muted-foreground text-base md:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            Everything you need to accelerate your career journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4" style={{ transformStyle: 'preserve-3d' }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="glass"
              className="group morph-shape cursor-pointer"
              style={{ 
                animationDelay: feature.delay,
                transformStyle: 'preserve-3d'
              }}
            >
              <CardContent className="p-6 md:p-8 relative z-10">
                {/* Icon with Gradient */}
                <div className={`mb-4 md:mb-6 w-12 md:w-16 h-12 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl shadow-orange-500/30 group-hover:shadow-orange-500/60 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 float-3d`}>
                  <feature.icon className="h-6 md:h-8 w-6 md:w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold mb-2 md:mb-3 text-lg md:text-xl lg:text-2xl transition-colors duration-300 group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground font-sans transition-colors duration-300 group-hover:text-foreground/90 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-20 stagger-animation px-4">
          {[
            { icon: Zap, label: 'Fast AI', value: '<1s', color: 'orange-500' },
            { icon: Globe, label: 'Languages', value: '3+', color: 'orange-600' },
            { icon: Users, label: 'Users', value: '10K+', color: 'orange-400' },
            { icon: Shield, label: 'Secure', value: '100%', color: 'orange-700' }
          ].map((stat, index) => (
            <div
              key={index}
              className="liquid-glass-intense p-4 md:p-6 rounded-xl md:rounded-2xl text-center group hover:scale-105 transition-all duration-500 morph-shape"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className={`h-6 md:h-8 w-6 md:w-8 mx-auto mb-2 md:mb-3 text-${stat.color} float-3d`} />
              <div className={`text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-sans">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
