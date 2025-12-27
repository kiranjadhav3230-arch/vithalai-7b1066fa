import React, { useEffect } from 'react';
import { ArrowLeft, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useHaqJaano, LegalCategory, LegalSituation } from '@/hooks/useHaqJaano';
import { cn } from '@/lib/utils';

interface SituationSelectorProps {
  category: LegalCategory;
  onBack: () => void;
  onSituationSelect: (situation: LegalSituation) => void;
  getLocalizedText: (item: Record<string, unknown>, field: string) => string;
}

export const SituationSelector: React.FC<SituationSelectorProps> = ({
  category,
  onBack,
  onSituationSelect,
  getLocalizedText,
}) => {
  const { language } = useLanguage();
  const { situations, fetchSituationsByCategory, isLoading } = useHaqJaano();

  useEffect(() => {
    fetchSituationsByCategory(category.id);
  }, [category.id, fetchSituationsByCategory]);

  const getSelectSituation = () => {
    switch (language) {
      case 'hi': return 'अपनी स्थिति चुनें';
      case 'mr': return 'तुमची परिस्थिती निवडा';
      default: return 'Select Your Situation';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {getLocalizedText(category as unknown as Record<string, unknown>, 'name')}
            </h1>
            <p className="text-sm text-muted-foreground">{getSelectSituation()}</p>
          </div>
        </div>
      </div>

      {/* Situations List */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-card/50"
              />
            ))}
          </div>
        ) : situations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              {language === 'hi' ? 'कोई स्थिति नहीं मिली' : 
               language === 'mr' ? 'कोणतीही परिस्थिती सापडली नाही' : 
               'No situations found'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {language === 'hi' ? 'जल्द ही जोड़ा जाएगा' : 
               language === 'mr' ? 'लवकरच जोडले जाईल' : 
               'Coming soon'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {situations.map((situation, index) => (
              <button
                key={situation.id}
                onClick={() => onSituationSelect(situation)}
                className={cn(
                  'group flex w-full items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4',
                  'transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg',
                  situation.is_emergency && 'border-destructive/30 bg-destructive/5'
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-start gap-3 text-left">
                  {situation.is_emergency && (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  )}
                  <div>
                    <h3 className="font-medium text-foreground">
                      {getLocalizedText(situation as unknown as Record<string, unknown>, 'title')}
                    </h3>
                    {situation.description_en && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {getLocalizedText(situation as unknown as Record<string, unknown>, 'description')}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
