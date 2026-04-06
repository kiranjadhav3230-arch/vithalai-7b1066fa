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
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
      gradient: 'from-amber-500 to-orange-600',
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
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden py-8 md:py-16 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/20"></div>
      
      {/* Single subtle orb */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute bottom-[10%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-gradient-to-tl from-orange-500/25 to-transparent blur-[100px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-10">
          {/* Badge */}
          <div className="animate-[scaleIn_0.5s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                {language === 'hi' ? 'AI करियर प्लेटफॉर्म' : language === 'mr' ? 'AI करिअर प्लॅटफॉर्म' : 'AI-Powered Career Platform'}
              </span>
            </div>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-3 md:space-y-4 animate-[scaleIn_0.6s_ease-out]">
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
          <div className="animate-[fadeInUp_0.7s_ease-out]">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-5 md:py-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300"
            >
              <Zap className="mr-2 h-5 w-5" />
              {t('getStarted')}
            </Button>
          </div>

          {/* Quick Feature Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-6 md:pt-8 animate-[fadeInUp_0.8s_ease-out]">
            {mainFeatures.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="bg-black/40 backdrop-blur-sm p-4 md:p-5 rounded-xl group hover:bg-black/50 transition-all duration-300 cursor-pointer border border-white/5 hover:border-primary/25"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all duration-300`}>
                  <item.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <p className="text-xs md:text-sm font-display font-semibold text-foreground/90">{item.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};
