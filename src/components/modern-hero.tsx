import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, MessageSquare, Users, Shield, Grid3X3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface ModernHeroProps {
  onGetStarted: () => void;
  onLearnMore?: () => void;
}

export const ModernHero: React.FC<ModernHeroProps> = ({ onGetStarted, onLearnMore }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      const featuresSection = document.getElementById('all-features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Main features with multilingual support
  const mainFeatures = [
    { 
      icon: MessageSquare, 
      label: language === 'hi' ? 'AI चैट' : language === 'mr' ? 'AI चॅट' : 'AI Chat',
      gradient: 'from-orange-500 to-orange-600',
      action: onGetStarted
    },
    { 
      icon: Users, 
      label: language === 'hi' ? 'स्टडी रूम' : language === 'mr' ? 'स्टडी रूम' : 'Study Rooms',
      gradient: 'from-orange-600 to-red-500',
      action: onGetStarted
    },
    { 
      icon: Shield, 
      label: language === 'hi' ? 'हक जानो' : language === 'mr' ? 'हक्क जाणा' : 'Haq Jaano',
      gradient: 'from-blue-500 to-blue-600',
      action: () => navigate('/haq-jaano')
    },
    { 
      icon: Grid3X3, 
      label: language === 'hi' ? 'सभी सुविधाएं' : language === 'mr' ? 'सर्व वैशिष्ट्ये' : 'All Features',
      gradient: 'from-orange-400 to-orange-500',
      action: handleLearnMore
    }
  ];

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden py-8 md:py-16 px-4" style={{ perspective: '2000px' }}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/30"></div>
      
      {/* Glowing Orbs - Optimized */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="hidden sm:block absolute top-[10%] left-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-gradient-to-br from-orange-500/40 to-orange-600/20 blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] rounded-full bg-gradient-to-tl from-orange-400/30 to-orange-500/10 blur-[80px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-10">
          {/* Badge */}
          <div className="animate-scaleIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-intense border border-primary/30 morph-shape">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                {language === 'hi' ? 'AI करियर प्लेटफॉर्म' : language === 'mr' ? 'AI करिअर प्लॅटफॉर्म' : 'AI-Powered Career Platform'}
              </span>
            </div>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-3 md:space-y-4 animate-scaleIn">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 font-sans">
              {language === 'hi' ? 'आपका AI करियर साथी' : language === 'mr' ? 'तुमचा AI करिअर साथीदार' : 'Your AI Career Companion'}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-sans px-4">
              {t('heroDescription')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-5 md:py-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
            >
              <Zap className="mr-2 h-5 w-5" />
              {t('getStarted')}
            </Button>
          </div>

          {/* Quick Feature Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-6 md:pt-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            {mainFeatures.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="liquid-glass-intense p-4 md:p-5 rounded-xl group hover:scale-105 transition-all duration-300 cursor-pointer border border-white/5 hover:border-orange-500/30"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 group-hover:scale-110 transition-all duration-300`}>
                  <item.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <p className="text-xs md:text-sm font-display font-semibold text-foreground/90">{item.label}</p>
              </button>
            ))}
          </div>

          {/* Credits Footer */}
          <div className="pt-6 md:pt-8 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>Powered by Gemini AI</span>
              </span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                Developed by Kapil Kiran Jadhav
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};
