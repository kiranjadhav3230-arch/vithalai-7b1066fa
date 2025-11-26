import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Code2, MessageSquare, Users, BookOpen, Sparkles } from 'lucide-react';
import type { CarouselApi } from '@/components/ui/carousel';

export const FeatureShowcaseCarousel: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Get instant answers to your questions with intelligent AI responses',
      gradient: 'from-orange-500 to-orange-600',
      screenshot: 'Intelligent chat interface with multi-language support'
    },
    {
      icon: Code2,
      title: 'Code Generator',
      description: 'Generate, debug, and optimize code in 15+ programming languages',
      gradient: 'from-orange-600 to-red-500',
      screenshot: 'Professional code editor with syntax highlighting'
    },
    {
      icon: Users,
      title: 'Study Rooms',
      description: 'Collaborate with peers in real-time AI-powered study spaces',
      gradient: 'from-orange-400 to-orange-500',
      screenshot: 'Interactive study rooms with live chat and reactions'
    },
    {
      icon: BookOpen,
      title: 'Career Guidance',
      description: 'Personalized career advice tailored to Indian job market',
      gradient: 'from-orange-500 to-orange-700',
      screenshot: 'Comprehensive career assessments and recommendations'
    }
  ];

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-scroll every 5 seconds

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
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                              <p className="text-foreground/80 font-sans">{feature.screenshot}</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                              <p className="text-foreground/80 font-sans">Powered by Gemini AI</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                              <p className="text-foreground/80 font-sans">Available 24/7</p>
                            </div>
                          </div>
                        </div>

                        {/* Screenshot Placeholder */}
                        <div className="relative">
                          <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${feature.gradient} p-1 shadow-2xl shadow-orange-500/50`}>
                            <div className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center">
                              <div className="text-center space-y-4 p-8">
                                <feature.icon className="h-20 w-20 text-white/80 mx-auto animate-float" />
                                <p className="text-white/70 font-display font-semibold text-lg">
                                  {feature.title} Interface
                                </p>
                              </div>
                            </div>
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