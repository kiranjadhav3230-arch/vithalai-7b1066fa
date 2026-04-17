import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Scale, Grid3X3, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from '@/components/ui/language-selector';

interface FeatureNavBarProps {
  onFeatureSelect?: (feature: 'chat' | 'room' | 'haq-jaano' | 'fullstack') => void;
  currentFeature?: 'chat' | 'room' | 'haq-jaano' | 'fullstack';
  hideLanguageSelector?: boolean;
}

export const FeatureNavBar: React.FC<FeatureNavBarProps> = ({
  onFeatureSelect,
  currentFeature,
  hideLanguageSelector = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const getTexts = () => {
    switch (language) {
      case 'hi':
        return {
          chats: 'चैट',
          room: 'रूम',
          haqJaano: 'हक जानो',
          appBuilder: 'ऐप बिल्डर',
          all: 'सभी',
          allFeaturesTitle: 'सभी सुविधाएं',
          features: [
            { name: 'AI चैट सहायक', description: 'Gemini द्वारा संचालित बुद्धिमान AI चैटबॉट के साथ अपने प्रश्नों के तुरंत उत्तर प्राप्त करें', icon: MessageSquare, key: 'chat' },
            { name: 'स्टडी रूम', description: 'AI सहायता, रीयल-टाइम चैट और सदस्य प्रबंधन के साथ सहयोगी अध्ययन स्थान', icon: Users, key: 'room' },
            { name: 'हक जानो', description: 'भारत का पहला AI कानूनी अधिकार सहायक। किसी भी स्थिति में अपने अधिकार जानें', icon: Scale, key: 'haq-jaano' },
            { name: 'ऐप बिल्डर', description: 'अपने Supabase के साथ पूर्ण-स्टैक ऐप्स बनाएं। डेटाबेस और प्रमाणीकरण शामिल', icon: Rocket, key: 'fullstack', isNew: true },
          ]
        };
      case 'mr':
        return {
          chats: 'चॅट',
          room: 'रूम',
          haqJaano: 'हक्क जाणा',
          appBuilder: 'ॲप बिल्डर',
          all: 'सर्व',
          allFeaturesTitle: 'सर्व वैशिष्ट्ये',
          features: [
            { name: 'AI चॅट सहाय्यक', description: 'Gemini द्वारे समर्थित बुद्धिमान AI चॅटबॉटसह तुमच्या प्रश्नांची त्वरित उत्तरे मिळवा', icon: MessageSquare, key: 'chat' },
            { name: 'स्टडी रूम', description: 'AI सहाय्य, रिअल-टाइम चॅट आणि सदस्य व्यवस्थापनासह सहयोगी अभ्यास जागा', icon: Users, key: 'room' },
            { name: 'हक्क जाणा', description: 'भारताचा पहिला AI कायदेशीर हक्क सहाय्यक. कोणत्याही परिस्थितीत तुमचे हक्क जाणून घ्या', icon: Scale, key: 'haq-jaano' },
            { name: 'ॲप बिल्डर', description: 'तुमच्या Supabase सह फुल-स्टॅक ॲप्स तयार करा. डेटाबेस आणि प्रमाणीकरण समाविष्ट', icon: Rocket, key: 'fullstack', isNew: true },
          ]
        };
      default:
        return {
          chats: 'Chats',
          room: 'Room',
          haqJaano: 'Haq Jaano',
          appBuilder: 'App Builder',
          all: 'All',
          allFeaturesTitle: 'All Features',
          features: [
            { name: 'AI Chat Assistant', description: 'Get instant answers to your questions with our intelligent AI chatbot powered by Gemini', icon: MessageSquare, key: 'chat' },
            { name: 'Study Rooms', description: 'Collaborative study spaces with AI assistance, real-time chat, and member management', icon: Users, key: 'room' },
            { name: 'Haq Jaano', description: 'India\'s first AI Legal Rights Assistant. Know your rights in any situation', icon: Scale, key: 'haq-jaano' },
            { name: 'App Builder', description: 'Build full-stack apps with your own Supabase. Includes database & authentication', icon: Rocket, key: 'fullstack', isNew: true },
          ]
        };
    }
  };

  const texts = getTexts();

  const handleFeatureClick = (feature: 'chat' | 'room' | 'haq-jaano' | 'fullstack') => {
    if (onFeatureSelect) {
      onFeatureSelect(feature);
    } else {
      // Navigate based on current location
      if (feature === 'haq-jaano') {
        navigate('/haq-jaano');
      } else {
        // For chat, room, and fullstack, we need to go to index and trigger the feature
        navigate('/', { state: { openFeature: feature } });
      }
    }
  };

  const isActive = (feature: 'chat' | 'room' | 'haq-jaano' | 'fullstack') => {
    if (currentFeature) return currentFeature === feature;
    if (feature === 'haq-jaano') return location.pathname === '/haq-jaano';
    return false;
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Feature Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
              {/* Chats */}
              <Button
                variant={isActive('chat') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFeatureClick('chat')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 shrink-0 ${
                  isActive('chat') 
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.chats}</span>
              </Button>

              {/* Room */}
              <Button
                variant={isActive('room') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFeatureClick('room')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 shrink-0 ${
                  isActive('room') 
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.room}</span>
              </Button>

              {/* Haq Jaano */}
              <Button
                variant={isActive('haq-jaano') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFeatureClick('haq-jaano')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 shrink-0 rounded-full ${
                  isActive('haq-jaano') 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                    : 'hover:bg-primary/10 text-foreground/80'
                }`}
              >
                <Scale className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.haqJaano}</span>
              </Button>

              {/* App Builder */}
              <Button
                variant={isActive('fullstack') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFeatureClick('fullstack')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 shrink-0 rounded-full ${
                  isActive('fullstack') 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' 
                    : 'hover:bg-primary/10 text-foreground/80'
                }`}
              >
                <Rocket className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{texts.appBuilder}</span>
                <Badge className="text-[9px] px-1 py-0 bg-green-500 text-white">NEW</Badge>
              </Button>

              {/* All Features */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllFeatures(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 shrink-0 hover:bg-primary/10"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.all}</span>
              </Button>
            </div>

            {/* Language Selector - conditionally rendered */}
            {!hideLanguageSelector && (
              <div className="shrink-0">
                <LanguageSelector 
                  language={language} 
                  onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Features Modal */}
      <Dialog open={showAllFeatures} onOpenChange={setShowAllFeatures}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Grid3X3 className="h-5 w-5 text-primary" />
              {texts.allFeaturesTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {texts.features.map((feature, index) => (
              <button
                key={index}
                onClick={() => {
                  handleFeatureClick(feature.key as 'chat' | 'room' | 'haq-jaano' | 'fullstack');
                  setShowAllFeatures(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    feature.key === 'haq-jaano' 
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500' 
                      : feature.key === 'fullstack'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                      : 'bg-gradient-to-br from-orange-500 to-amber-500'
                  } shadow-lg shadow-orange-500/20`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.name}
                      </h3>
                      {(feature as any).isNew && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-green-500 text-white">NEW</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
