import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Code2, MessageSquare, Users, BookOpen, Sparkles, Leaf } from 'lucide-react';
import type { CarouselApi } from '@/components/ui/carousel';

// Import feature screenshots
import featureChatImg from '@/assets/feature-chat.png';
import featureCodeImg from '@/assets/feature-code.png';
import featureStudyRoomsImg from '@/assets/feature-study-rooms.png';
import featureCropImg from '@/assets/feature-crop.png';
import featureCareerImg from '@/assets/feature-career.png';

export const FeatureShowcaseCarousel: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Get instant answers to your questions with intelligent AI responses',
      gradient: 'from-orange-500 to-orange-600',
      screenshot: featureChatImg,
      highlights: ['Intelligent chat interface with multi-language support', 'Powered by Gemini AI', 'Available 24/7']
    },
    {
      icon: Code2,
      title: 'Code Generator',
      description: 'Generate, debug, and optimize code in 15+ programming languages',
      gradient: 'from-orange-600 to-red-500',
      screenshot: featureCodeImg,
      highlights: ['Professional code editor with syntax highlighting', 'Powered by Gemini AI', 'Available 24/7']
    },
    {
      icon: Users,
      title: 'Study Rooms',
      description: 'Collaborate with peers in real-time AI-powered study spaces',
      gradient: 'from-orange-400 to-orange-500',
      screenshot: featureStudyRoomsImg,
      highlights: ['Interactive study rooms with live chat and reactions', 'Powered by Gemini AI', 'Available 24/7']
    },
    {
      icon: Leaf,
      title: 'Crop Health Analyzer',
      description: 'AI-powered plant disease diagnosis and treatment recommendations for sustainable agriculture',
      gradient: 'from-green-500 to-green-600',
      screenshot: featureCropImg,
      highlights: ['Upload plant images for instant disease detection', 'Weather-based recommendations', 'PDF report generation']
    },
    {
      icon: BookOpen,
      title: 'Career Guidance',
      description: 'Personalized career advice tailored to Indian job market',
      gradient: 'from-orange-500 to-orange-700',
      screenshot: featureCareerImg,
      highlights: ['Comprehensive career assessments', 'Skill analysis and recommendations', 'Job market insights']
    }
  ];

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      clearInterval(interval);
    };
  }, [api]);

  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/10 to-black"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-500/30 to-transparent blur-[130px] animate-float-slow"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-orange-600/25 to-transparent blur-[140px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 animate-scaleIn">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass-intense border border-primary/30 mb-6 morph-shape">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Feature Showcase
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Experience Vithal AI
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            Explore our powerful features designed to accelerate your learning journey
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-5xl mx-auto">
          <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index}>
                  <Card variant="glass" className="border-2 border-orange-500/20">
                    <CardContent className="p-8 md:p-12">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Feature Info */}
                        <div className="space-y-6">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg shadow-orange-500/30`}>
                            <feature.icon className="h-8 w-8 text-white" />
                          </div>
                          
                          <div>
                            <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                              {feature.title}
                            </h3>
                            <p className="text-muted-foreground text-lg font-sans leading-relaxed">
                              {feature.description}
                            </p>
                          </div>

                          {/* Feature Highlights */}
                          <div className="space-y-3">
                            {feature.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                <p className="text-foreground/80 font-sans">{highlight}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Feature Screenshot */}
                        <div className="relative">
                          <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${feature.gradient} p-1 shadow-2xl shadow-orange-500/50 overflow-hidden`}>
                            <img 
                              src={feature.screenshot} 
                              alt={`${feature.title} Interface`}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                          
                          {/* Decorative Elements */}
                          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-500/30 to-transparent rounded-full blur-2xl"></div>
                          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tl from-orange-600/30 to-transparent rounded-full blur-2xl"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index 
                    ? 'w-8 bg-gradient-to-r from-orange-500 to-orange-600' 
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
