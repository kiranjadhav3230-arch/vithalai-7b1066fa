import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, TrendingUp, Target, Users, BookOpen, Award } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('feature1Title'),
      description: t('feature1Desc')
    },
    {
      icon: TrendingUp,
      title: t('feature2Title'),
      description: t('feature2Desc')
    },
    {
      icon: Target,
      title: t('feature3Title'),
      description: t('feature3Desc')
    },
    {
      icon: Users,
      title: 'Indian Youth Focus',
      description: 'Specially designed for Indian job market and cultural context'
    },
    {
      icon: BookOpen,
      title: 'Multi-language Support',
      description: 'Available in English, Hindi, and Marathi for better accessibility'
    },
    {
      icon: Award,
      title: 'Career Success',
      description: 'Track your progress and celebrate your career milestones'
    }
  ];

  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden" style={{ perspective: '2000px' }}>
      {/* 3D Glass Background */}
      <div className="absolute inset-0 overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
        <div className="liquid-orb top-[20%] right-[5%] w-[700px] h-[700px] text-primary" style={{ animationDelay: '1s', transform: 'translateZ(-90px)' }}></div>
        <div className="liquid-orb bottom-[25%] left-[8%] w-[650px] h-[650px] text-orange-500" style={{ animationDelay: '3s', transform: 'translateZ(-100px)' }}></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-scaleIn">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 gradient-text">{t('features')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            Discover the powerful features that make Vithal AI your perfect career companion
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation" style={{ transformStyle: 'preserve-3d' }}>
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="glass"
              className="group morph-shape"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <CardContent className="p-8 relative z-10">
                <div className="mb-6 p-4 rounded-xl liquid-glass-intense w-fit transition-all duration-500 group-hover:scale-125 liquid-glow morph-shape">
                  <feature.icon className="h-8 w-8 text-primary transition-transform duration-500 group-hover:rotate-12 float-3d" />
                </div>
                <h3 className="font-display font-semibold mb-3 text-xl transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>
                <p className="text-muted-foreground font-sans transition-colors duration-300 group-hover:text-foreground/90 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};