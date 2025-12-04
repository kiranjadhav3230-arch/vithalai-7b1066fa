import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ModernHeroProps {
  onGetStarted: () => void;
  onLearnMore?: () => void;
}

export const ModernHero: React.FC<ModernHeroProps> = ({ onGetStarted, onLearnMore }) => {
  const { t } = useLanguage();

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      // Default: scroll to features section
      const featuresSection = document.getElementById('all-features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-20 px-4" style={{ perspective: '2000px' }}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/30"></div>
      
      {/* Large Glowing Orbs - Optimized for mobile performance */}
      <div className="absolute inset-0 overflow-hidden opacity-40" style={{ transformStyle: 'preserve-3d' }}>
        <div className="hidden sm:block absolute top-[10%] left-[5%] md:left-[10%] w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full bg-gradient-to-br from-orange-500/40 to-orange-600/20 blur-[120px] md:blur-[150px] animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[5%] md:right-[10%] w-[300px] sm:w-[450px] md:w-[900px] h-[300px] sm:h-[450px] md:h-[900px] rounded-full bg-gradient-to-tl from-orange-400/30 to-orange-500/10 blur-[80px] sm:blur-[90px] md:blur-[180px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="hidden md:block absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[700px] h-[350px] md:h-[700px] rounded-full bg-gradient-to-r from-orange-600/25 to-orange-400/15 blur-[80px] md:blur-[160px] animate-pulse-glow"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
          {/* Main Heading */}
          <div className="space-y-4 md:space-y-6 animate-scaleIn">
            <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full liquid-glass-intense border border-primary/30 mb-4 md:mb-6 morph-shape">
              <Sparkles className="h-4 md:h-5 w-4 md:w-5 text-primary animate-pulse" />
              <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                AI-Powered Career Platform
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight px-4">
              <span className="block mb-3 md:mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% auto' }}>
                {t('appName')}
              </span>
              <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-foreground/90 font-sans font-normal mt-3 md:mt-4">
                Your AI Career Companion
              </span>
            </h1>
            
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-sans px-4" style={{ animationDelay: '0.2s' }}>
              {t('heroDescription')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fadeInUp px-4" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-500 border border-orange-400/20"
            >
              <Zap className="mr-2 h-4 md:h-5 w-4 md:w-5" />
              {t('getStarted')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLearnMore}
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-xl md:rounded-2xl liquid-glass-intense border-primary/30 hover:border-primary/50 font-display hover:scale-105 transition-all duration-500"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-8 md:pt-12 stagger-animation px-4" style={{ transformStyle: 'preserve-3d' }}>
            {[
              { icon: Sparkles, label: 'AI Powered', gradient: 'from-orange-500 to-orange-600' },
              { icon: Zap, label: 'Instant Results', gradient: 'from-orange-600 to-red-500' },
              { icon: TrendingUp, label: 'Career Growth', gradient: 'from-orange-400 to-orange-500' },
              { icon: Award, label: 'Certified', gradient: 'from-orange-500 to-orange-700' }
            ].map((item, index) => (
              <div
                key={index}
                className="liquid-glass-intense p-4 md:p-6 rounded-xl md:rounded-2xl group hover:scale-110 transition-all duration-500 cursor-pointer morph-shape"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 md:w-14 h-10 md:h-14 mx-auto mb-2 md:mb-3 rounded-lg md:rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 group-hover:rotate-12 transition-all duration-500 float-3d`}>
                  <item.icon className="h-5 md:h-7 w-5 md:w-7 text-white" />
                </div>
                <p className="text-xs md:text-sm font-display font-semibold text-foreground/90">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};
