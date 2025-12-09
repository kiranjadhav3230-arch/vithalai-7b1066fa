import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Code2, MessageSquare, Users, Leaf, Library, ChevronRight, Sparkles } from 'lucide-react';
import type { CarouselApi } from '@/components/ui/carousel';

// Import real screenshots
import screenshotChat from '@/assets/screenshot-chat.png';
import screenshotCode from '@/assets/screenshot-code.png';
import screenshotLibrary from '@/assets/screenshot-library.png';
import screenshotRooms from '@/assets/screenshot-rooms.png';
import screenshotCrop from '@/assets/screenshot-crop.png';

export const FeatureShowcaseCarousel: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat - Vithal',
      subtitle: 'Your Intelligent Companion',
      description: 'Chat with Vithal, your best friend and trusted AI companion. Get instant answers, academic help, career guidance, and friendly conversations in English, Hindi, and Marathi.',
      highlights: [
        'Multilingual support (English, Hindi, Marathi)',
        'Academic problem solving',
        'Career guidance & advice',
        'Voice input & text-to-speech'
      ],
      screenshot: screenshotChat,
      gradient: 'from-orange-500 to-amber-500',
      shadowColor: 'shadow-orange-500/30'
    },
    {
      icon: Code2,
      title: 'Code Generator',
      subtitle: 'AI-Powered Code Assistant',
      description: 'Generate high-quality code in 15+ programming languages with v2.0 Enhanced features. Includes syntax highlighting, quality validation, and multiple download options.',
      highlights: [
        '15+ programming languages supported',
        'Quality score validation (up to 99%)',
        'VS Code & HTML download options',
        'Real-time streaming responses'
      ],
      screenshot: screenshotCode,
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/30'
    },
    {
      icon: Library,
      title: 'Code Library',
      subtitle: 'Save & Manage Your Code',
      description: 'Save, organize, and manage all your generated code snippets. Edit, favorite, tag, and download your code anytime with keyboard shortcuts support.',
      highlights: [
        'Save & organize snippets',
        'Edit with Ctrl+S / Ctrl+Z shortcuts',
        'Tag-based organization',
        'Multiple export formats (VS Code, HTML, ZIP)'
      ],
      screenshot: screenshotLibrary,
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/30'
    },
    {
      icon: Users,
      title: 'Study Rooms',
      subtitle: 'Collaborative Learning Space',
      description: 'Create or join study rooms with AI-powered assistance. Chat with classmates, share images, get AI help from Vithal, and track online members in real-time.',
      highlights: [
        'Real-time group chat with reactions',
        'AI assistance from Vithal in rooms',
        'Message replies & photo sharing',
        'Invite via shareable link or code'
      ],
      screenshot: screenshotRooms,
      gradient: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/30'
    },
    {
      icon: Leaf,
      title: 'Crop Health Analyzer',
      subtitle: 'AI Agricultural Support',
      description: 'Upload plant images for AI-powered disease diagnosis and treatment recommendations. Get location-based crop suggestions, pest alerts, and comprehensive agricultural reports.',
      highlights: [
        'Disease diagnosis from plant photos',
        'Location-based agricultural analysis',
        'Seasonal crop & fertilizer recommendations',
        'Downloadable PDF reports'
      ],
      screenshot: screenshotCrop,
      gradient: 'from-green-600 to-lime-500',
      shadowColor: 'shadow-green-600/30'
    }
  ];

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 6000);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      clearInterval(interval);
    };
  }, [api]);

  return (
    <section className="relative py-20 md:py-28 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      
      {/* Subtle Glow */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-primary/15 to-transparent blur-[130px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Feature Showcase
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Explore Vithal AI Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful AI tools designed to enhance your learning, coding, and agricultural needs
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-6xl mx-auto">
          <Carousel setApi={setApi} className="w-full" opts={{ loop: true, align: 'center' }}>
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index}>
                  <Card className="border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid lg:grid-cols-2 gap-0">
                        {/* Left - Feature Info */}
                        <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                          <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3.5 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadowColor}`}>
                              <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                                {feature.title}
                              </h3>
                              <p className={`text-sm font-medium bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                                {feature.subtitle}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
                            {feature.description}
                          </p>
                          
                          <div className="space-y-3">
                            {feature.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-foreground/80 text-sm md:text-base">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Right - Screenshot */}
                        <div className="relative p-6 md:p-8 flex items-center justify-center bg-muted/30 order-1 lg:order-2">
                          <div className="relative w-full max-w-md lg:max-w-lg">
                            {/* Browser mockup frame */}
                            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50">
                              {/* Browser header */}
                              <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                                <div className="flex gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-red-500" />
                                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                  <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="flex-1 mx-4">
                                  <div className="bg-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-400 text-center">
                                    vithal-ai.lovable.app
                                  </div>
                                </div>
                              </div>
                              {/* Screenshot */}
                              <img
                                src={feature.screenshot}
                                alt={`${feature.title} - Real Interface Screenshot`}
                                className="w-full h-auto block"
                              />
                            </div>
                            
                            {/* Glow effect behind screenshot */}
                            <div className={`absolute -inset-4 bg-gradient-to-r ${feature.gradient} opacity-15 blur-3xl -z-10 rounded-3xl`} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious className="hidden md:flex left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary" />
            <CarouselNext className="hidden md:flex right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary" />
          </Carousel>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index 
                    ? `w-10 bg-gradient-to-r ${feature.gradient}` 
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to ${feature.title} slide`}
              />
            ))}
          </div>
          
          {/* Feature names below dots */}
          <div className="flex justify-center mt-4">
            <span className="text-sm text-muted-foreground">
              {features[current]?.title}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
