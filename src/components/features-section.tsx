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
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">{t('features')}</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover the powerful features that make Vithal AI your perfect career companion
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group premium-card p-8 rounded-2xl hover:scale-105 hover-glow transition-all duration-500 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold mb-3 text-xl text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};