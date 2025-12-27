import React, { useState, useCallback } from 'react';
import { HaqJaanoHome } from '@/components/haq-jaano/HaqJaanoHome';
import { SituationSelector } from '@/components/haq-jaano/SituationSelector';
import { RightsResponse } from '@/components/haq-jaano/RightsResponse';
import { AIResponseView } from '@/components/haq-jaano/AIResponseView';
import { DocumentGenerator } from '@/components/haq-jaano/DocumentGenerator';
import { useHaqJaano, LegalCategory, LegalSituation } from '@/hooks/useHaqJaano';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

type ViewState = 'home' | 'category' | 'situation' | 'ai-response' | 'document-generator';

const HaqJaano: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const {
    situationDetails,
    fetchSituationDetails,
    searchSituations,
    getLocalizedText,
    setSituationDetails,
  } = useHaqJaano();

  const [viewState, setViewState] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [documentType, setDocumentType] = useState<'complaint' | 'rti' | 'legal_notice'>('complaint');

  const handleCategorySelect = useCallback((category: LegalCategory) => {
    setSelectedCategory(category);
    setViewState('category');
  }, []);

  const handleSituationSelect = useCallback(async (situation: LegalSituation) => {
    await fetchSituationDetails(situation.id);
    setViewState('situation');
  }, [fetchSituationDetails]);

  const handleSearch = useCallback((query: string) => {
    setAiQuery(query);
    setViewState('ai-response');
  }, []);

  const handleVoiceInput = useCallback((text: string) => {
    setAiQuery(text);
    setViewState('ai-response');
  }, []);

  const handleBack = useCallback(() => {
    switch (viewState) {
      case 'category':
        setViewState('home');
        setSelectedCategory(null);
        break;
      case 'situation':
        setViewState('category');
        setSituationDetails(null);
        break;
      case 'ai-response':
        setViewState('home');
        setAiQuery('');
        break;
      case 'document-generator':
        if (situationDetails) {
          setViewState('situation');
        } else {
          setViewState('home');
        }
        break;
      default:
        setViewState('home');
    }
  }, [viewState, setSituationDetails]);

  const handleRecordEvidence = useCallback(() => {
    toast({
      title: language === 'hi' ? 'जल्द आ रहा है' : 
             language === 'mr' ? 'लवकरच येत आहे' : 'Coming Soon',
      description: language === 'hi' ? 'साक्ष्य रिकॉर्डिंग फीचर जल्द ही उपलब्ध होगा' : 
                   language === 'mr' ? 'पुरावा रेकॉर्डिंग वैशिष्ट्य लवकरच उपलब्ध होईल' : 
                   'Evidence recording feature will be available soon',
    });
  }, [language, toast]);

  const handleGenerateDocument = useCallback(() => {
    setDocumentType('complaint');
    setViewState('document-generator');
  }, []);

  // Render based on view state
  switch (viewState) {
    case 'category':
      if (!selectedCategory) {
        setViewState('home');
        return null;
      }
      return (
        <SituationSelector
          category={selectedCategory}
          onBack={handleBack}
          onSituationSelect={handleSituationSelect}
          getLocalizedText={getLocalizedText}
        />
      );

    case 'situation':
      if (!situationDetails) {
        setViewState('home');
        return null;
      }
      return (
        <RightsResponse
          details={situationDetails}
          onBack={handleBack}
          onRecordEvidence={handleRecordEvidence}
          onGenerateDocument={handleGenerateDocument}
          getLocalizedText={getLocalizedText}
        />
      );

    case 'ai-response':
      return (
        <AIResponseView
          query={aiQuery}
          onBack={handleBack}
        />
      );

    case 'document-generator':
      return (
        <DocumentGenerator
          situationTitle={situationDetails ? getLocalizedText(situationDetails.situation as unknown as Record<string, unknown>, 'title') : undefined}
          documentType={documentType}
          onBack={handleBack}
        />
      );

    default:
      return (
        <HaqJaanoHome
          onCategorySelect={handleCategorySelect}
          onSearch={handleSearch}
          onVoiceInput={handleVoiceInput}
        />
      );
  }
};

export default HaqJaano;
