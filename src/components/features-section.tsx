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
    <section id="features" className="py-20 px-4 bg-muted/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">{t('features')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the powerful features that make Vithal AI your perfect career companion
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="premium-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 group-hover:animate-glow">
                  <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold mb-2 text-lg transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>
                <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/90">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};