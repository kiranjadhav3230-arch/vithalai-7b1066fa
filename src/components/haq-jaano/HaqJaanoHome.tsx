import React, { useEffect, useState } from 'react';
import { Shield, Search, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { useHaqJaano, LegalCategory } from '@/hooks/useHaqJaano';
import { CategoryCard } from './CategoryCard';
import { EmergencySOS } from './EmergencySOS';
import { VoiceInputButton } from './VoiceInputButton';
import { FundamentalRightsSection } from './FundamentalRightsSection';
import vithalLogo from '@/assets/vithal-pin-logo.png';
interface HaqJaanoHomeProps {
  onCategorySelect: (category: LegalCategory) => void;
  onSearch: (query: string) => void;
  onVoiceInput: (text: string) => void;
  onBackToHome?: () => void;
}

export const HaqJaanoHome: React.FC<HaqJaanoHomeProps> = ({
  onCategorySelect,
  onSearch,
  onVoiceInput,
}) => {
  const { language } = useLanguage();
  const { categories, fetchCategories, isLoading, getLocalizedText } = useHaqJaano();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const getTitle = () => {
    switch (language) {
      case 'hi': return 'हक जानो';
      case 'mr': return 'हक्क जाणा';
      default: return 'Haq Jaano';
    }
  };

  const getSubtitle = () => {
    switch (language) {
      case 'hi': return 'अपने अधिकार जानें, अपनी आवाज़ उठाएं';
      case 'mr': return 'तुमचे हक्क जाणा, तुमचा आवाज उठवा';
      default: return 'Know Your Rights, Raise Your Voice';
    }
  };

  const getVoicePrompt = () => {
    switch (language) {
      case 'hi': return 'बोलो, क्या हुआ?';
      case 'mr': return 'बोला, काय झालं?';
      default: return 'Tell us, what happened?';
    }
  };

  const getSearchPlaceholder = () => {
    switch (language) {
      case 'hi': return 'अपनी स्थिति खोजें...';
      case 'mr': return 'तुमची परिस्थिती शोधा...';
      default: return 'Search your situation...';
    }
  };

  const getCommonSituations = () => {
    switch (language) {
      case 'hi': return 'आम स्थितियां';
      case 'mr': return 'सामान्य परिस्थिती';
      default: return 'Common Situations';
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-background pb-8 pt-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="container relative mx-auto px-4">

          {/* Logo and Title */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <img 
              src={vithalLogo} 
              alt="Vithal AI" 
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/30"
            />
            <div className="rounded-full bg-primary/20 p-2.5">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{getTitle()}</h1>
              <p className="text-sm text-muted-foreground">{getSubtitle()}</p>
            </div>
          </div>

          {/* Emergency SOS */}
          <EmergencySOS />

          {/* Voice Input */}
          <div className="mt-6">
            <VoiceInputButton 
              onVoiceInput={onVoiceInput}
              prompt={getVoicePrompt()}
            />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 sm:h-14 rounded-xl border-border/50 bg-card/50 pl-12 pr-4 text-base sm:text-lg backdrop-blur-sm focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          {getCommonSituations()}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl bg-card/50"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => onCategorySelect(category)}
                index={index}
                getLocalizedText={getLocalizedText}
              />
            ))}
          </div>
        )}
      </div>

      {/* Know Your Constitution Section */}
      <FundamentalRightsSection />

      {/* Credits */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="px-4 py-2 rounded-full bg-card/40 border border-border/40 backdrop-blur-sm">
            Powered by Gemini AI
          </span>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <span className="px-4 py-2 rounded-full bg-card/40 border border-border/40 backdrop-blur-sm">
            Developed by Kapil Kiran Jadhav
          </span>
        </div>
      </div>

      {/* Quick Helpline Banner */}
      <div className="container mx-auto px-4 pb-8">
        <div className="rounded-xl bg-gradient-to-r from-destructive/20 to-destructive/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-destructive" />
              <div>
                <p className="font-semibold text-foreground">
                  {language === 'hi' ? 'आपातकालीन हेल्पलाइन' : 
                   language === 'mr' ? 'आपत्कालीन हेल्पलाइन' : 'Emergency Helpline'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'पुलिस: 100 | महिला: 1091 | एम्बुलेंस: 102' : 
                   language === 'mr' ? 'पोलीस: 100 | महिला: 1091 | रुग्णवाहिका: 102' : 
                   'Police: 100 | Women: 1091 | Ambulance: 102'}
                </p>
              </div>
            </div>
            <a href="tel:112">
              <Button variant="destructive" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                112
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
