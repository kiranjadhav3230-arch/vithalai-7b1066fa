import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Scale, Grid3X3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from '@/components/ui/language-selector';

interface FeatureNavBarProps {
  onFeatureSelect?: (feature: 'chat' | 'room' | 'haq-jaano') => void;
  currentFeature?: 'chat' | 'room' | 'haq-jaano';
}

export const FeatureNavBar: React.FC<FeatureNavBarProps> = ({
  onFeatureSelect,
  currentFeature
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
          all: 'सभी',
          allFeaturesTitle: 'सभी सुविधाएं',
          features: [
            { name: 'AI चैट सहायक', description: 'Gemini द्वारा संचालित बुद्धिमान AI चैटबॉट के साथ अपने प्रश्नों के तुरंत उत्तर प्राप्त करें', icon: MessageSquare, key: 'chat' },
            { name: 'स्टडी रूम', description: 'AI सहायता, रीयल-टाइम चैट और सदस्य प्रबंधन के साथ सहयोगी अध्ययन स्थान', icon: Users, key: 'room' },
            { name: 'हक जानो', description: 'भारत का पहला AI कानूनी अधिकार सहायक। किसी भी स्थिति में अपने अधिकार जानें', icon: Scale, key: 'haq-jaano' },
          ]
        };
      case 'mr':
        return {
          chats: 'चॅट',
          room: 'रूम',
          haqJaano: 'हक्क जाणा',
          all: 'सर्व',
          allFeaturesTitle: 'सर्व वैशिष्ट्ये',
          features: [
            { name: 'AI चॅट सहाय्यक', description: 'Gemini द्वारे समर्थित बुद्धिमान AI चॅटबॉटसह तुमच्या प्रश्नांची त्वरित उत्तरे मिळवा', icon: MessageSquare, key: 'chat' },
            { name: 'स्टडी रूम', description: 'AI सहाय्य, रिअल-टाइम चॅट आणि सदस्य व्यवस्थापनासह सहयोगी अभ्यास जागा', icon: Users, key: 'room' },
            { name: 'हक्क जाणा', description: 'भारताचा पहिला AI कायदेशीर हक्क सहाय्यक. कोणत्याही परिस्थितीत तुमचे हक्क जाणून घ्या', icon: Scale, key: 'haq-jaano' },
          ]
        };
      default:
        return {
          chats: 'Chats',
          room: 'Room',
          haqJaano: 'Haq Jaano',
          all: 'All',
          allFeaturesTitle: 'All Features',
          features: [
            { name: 'AI Chat Assistant', description: 'Get instant answers to your questions with our intelligent AI chatbot powered by Gemini', icon: MessageSquare, key: 'chat' },
            { name: 'Study Rooms', description: 'Collaborative study spaces with AI assistance, real-time chat, and member management', icon: Users, key: 'room' },
            { name: 'Haq Jaano', description: 'India\'s first AI Legal Rights Assistant. Know your rights in any situation', icon: Scale, key: 'haq-jaano' },
          ]
        };
    }
  };

  const texts = getTexts();

  const handleFeatureClick = (feature: 'chat' | 'room' | 'haq-jaano') => {
    if (onFeatureSelect) {
      onFeatureSelect(feature);
    } else {
      // Navigate based on current location
      if (feature === 'haq-jaano') {
        navigate('/haq-jaano');
      } else {
        // For chat and room, we need to go to index and trigger the feature
        navigate('/', { state: { openFeature: feature } });
      }
    }
  };

  const isActive = (feature: 'chat' | 'room' | 'haq-jaano') => {
    if (currentFeature) return currentFeature === feature;
    if (feature === 'haq-jaano') return location.pathname === '/haq-jaano';
    return false;
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5">
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
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 shrink-0 ${
                  isActive('haq-jaano') 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'hover:bg-blue-500/10 text-blue-500'
                }`}
              >
                <Scale className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.haqJaano}</span>
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

            {/* Language Selector */}
            <div className="shrink-0">
              <LanguageSelector 
                language={language} 
                onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} 
              />
            </div>
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
                  handleFeatureClick(feature.key as 'chat' | 'room' | 'haq-jaano');
                  setShowAllFeatures(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    feature.key === 'haq-jaano' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-primary to-primary/80'
                  } shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.name}
                    </h3>
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
