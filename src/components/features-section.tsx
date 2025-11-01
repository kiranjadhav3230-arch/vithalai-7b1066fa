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
    <section id="features" className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the powerful features that make Vithal AI your perfect career companion
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};