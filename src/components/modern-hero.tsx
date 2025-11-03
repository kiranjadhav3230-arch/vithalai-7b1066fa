import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ModernHeroProps {
  onGetStarted: () => void;
}

export const ModernHero: React.FC<ModernHeroProps> = ({ onGetStarted }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4" style={{ perspective: '2000px' }}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/30"></div>
      
      {/* Large Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-40" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute top-[10%] left-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-orange-500/40 to-orange-600/20 blur-[150px] animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[900px] h-[900px] rounded-full bg-gradient-to-tl from-orange-400/30 to-orange-500/10 blur-[180px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-orange-600/25 to-orange-400/15 blur-[160px] animate-pulse-glow"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6 animate-scaleIn">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass-intense border border-primary/30 mb-6 morph-shape">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-display font-semibold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                AI-Powered Career Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight">
              <span className="block mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% auto' }}>
                {t('appName')}
              </span>
              <span className="block text-3xl md:text-5xl lg:text-6xl text-foreground/90 font-sans font-normal mt-4">
                Your AI Career Companion
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-sans" style={{ animationDelay: '0.2s' }}>
              {t('heroDescription')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="text-lg px-10 py-7 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-500 border border-orange-400/20"
            >
              <Zap className="mr-2 h-5 w-5" />
              {t('getStarted')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-7 rounded-2xl liquid-glass-intense border-primary/30 hover:border-primary/50 font-display hover:scale-105 transition-all duration-500"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 stagger-animation" style={{ transformStyle: 'preserve-3d' }}>
            {[
              { icon: Sparkles, label: 'AI Powered', gradient: 'from-orange-500 to-orange-600' },
              { icon: Zap, label: 'Instant Results', gradient: 'from-orange-600 to-red-500' },
              { icon: TrendingUp, label: 'Career Growth', gradient: 'from-orange-400 to-orange-500' },
              { icon: Award, label: 'Certified', gradient: 'from-orange-500 to-orange-700' }
            ].map((item, index) => (
              <div
                key={index}
                className="liquid-glass-intense p-6 rounded-2xl group hover:scale-110 transition-all duration-500 cursor-pointer morph-shape"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 group-hover:rotate-12 transition-all duration-500 float-3d`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm font-display font-semibold text-foreground/90">{item.label}</p>
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
