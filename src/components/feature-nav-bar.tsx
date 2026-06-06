import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Scale, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from '@/components/ui/language-selector';

type FeatureKey = 'chat' | 'room' | 'haq-jaano';

interface FeatureNavBarProps {
  onFeatureSelect?: (feature: FeatureKey) => void;
  currentFeature?: FeatureKey;
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
          chats: 'चैट', room: 'रूम', haqJaano: 'हक जानो', all: 'सभी',
          allFeaturesTitle: 'सभी सुविधाएं',
          features: [
            { name: 'AI चैट सहायक', description: 'Gemini द्वारा संचालित बुद्धिमान AI चैटबॉट', icon: MessageSquare, key: 'chat' as const },
            { name: 'स्टडी रूम', description: 'AI सहायता के साथ सहयोगी अध्ययन स्थान', icon: Users, key: 'room' as const },
            { name: 'हक जानो', description: 'भारत का पहला AI कानूनी अधिकार सहायक', icon: Scale, key: 'haq-jaano' as const },
          ]
        };
      case 'mr':
        return {
          chats: 'चॅट', room: 'रूम', haqJaano: 'हक्क जाणा', all: 'सर्व',
          allFeaturesTitle: 'सर्व वैशिष्ट्ये',
          features: [
            { name: 'AI चॅट सहाय्यक', description: 'Gemini द्वारे समर्थित बुद्धिमान AI चॅटबॉट', icon: MessageSquare, key: 'chat' as const },
            { name: 'स्टडी रूम', description: 'AI सहाय्यासह सहयोगी अभ्यास जागा', icon: Users, key: 'room' as const },
            { name: 'हक्क जाणा', description: 'भारताचा पहिला AI कायदेशीर हक्क सहाय्यक', icon: Scale, key: 'haq-jaano' as const },
          ]
        };
      default:
        return {
          chats: 'Chats', room: 'Room', haqJaano: 'Haq Jaano', all: 'All',
          allFeaturesTitle: 'All Features',
          features: [
            { name: 'AI Chat Assistant', description: 'Intelligent AI chatbot powered by Gemini', icon: MessageSquare, key: 'chat' as const },
            { name: 'Study Rooms', description: 'Collaborative study spaces with AI assistance', icon: Users, key: 'room' as const },
            { name: 'Haq Jaano', description: "India's first AI Legal Rights Assistant", icon: Scale, key: 'haq-jaano' as const },
          ]
        };
    }
  };

  const texts = getTexts();

  const handleFeatureClick = (feature: FeatureKey) => {
    if (onFeatureSelect) {
      onFeatureSelect(feature);
    } else {
      if (feature === 'haq-jaano') navigate('/haq-jaano');
      else navigate('/', { state: { openFeature: feature } });
    }
  };

  const isActive = (feature: FeatureKey) => {
    if (currentFeature) return currentFeature === feature;
    if (feature === 'haq-jaano') return location.pathname === '/haq-jaano';
    return false;
  };

  const pillClass = (active: boolean) =>
    `flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 shrink-0 rounded-full border transition-all duration-300 ${
      active
        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary/40 shadow-[0_0_20px_hsl(25_100%_55%/0.3)]'
        : 'border-primary/15 bg-background/30 text-foreground/80 hover:bg-primary/10 hover:border-primary/30 hover:text-foreground'
    }`;

  return (
    <>
      <div className="sticky top-0 z-50 w-full glass-surface border-b border-primary/15">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
              <Button variant="ghost" size="sm" onClick={() => handleFeatureClick('chat')} className={pillClass(isActive('chat'))}>
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.chats}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleFeatureClick('room')} className={pillClass(isActive('room'))}>
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.room}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleFeatureClick('haq-jaano')} className={pillClass(isActive('haq-jaano'))}>
                <Scale className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.haqJaano}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAllFeatures(true)} className={pillClass(false)}>
                <Grid3X3 className="h-4 w-4" />
                <span className="text-sm font-medium">{texts.all}</span>
              </Button>
            </div>

            {!hideLanguageSelector && (
              <div className="shrink-0">
                <LanguageSelector language={language} onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} />
              </div>
            )}
          </div>
        </div>
      </div>

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
                onClick={() => { handleFeatureClick(feature.key); setShowAllFeatures(false); }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{feature.description}</p>
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
