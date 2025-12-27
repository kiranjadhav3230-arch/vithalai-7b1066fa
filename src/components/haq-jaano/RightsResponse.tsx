import React from 'react';
import { 
  ArrowLeft, 
  Shield, 
  Phone, 
  Mic, 
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { SituationDetails } from '@/hooks/useHaqJaano';
import { RightsCard } from './RightsCard';
import { DosAndDonts } from './DosAndDonts';
import { ActionSteps } from './ActionSteps';
import { HelplineList } from './HelplineList';

interface RightsResponseProps {
  details: SituationDetails;
  onBack: () => void;
  onRecordEvidence: () => void;
  getLocalizedText: (item: Record<string, unknown>, field: string) => string;
}

export const RightsResponse: React.FC<RightsResponseProps> = ({
  details,
  onBack,
  onRecordEvidence,
  getLocalizedText,
}) => {
  const { language } = useLanguage();
  const { situation, rights, dosAndDonts, actionSteps, helplines } = details;

  const dos = dosAndDonts.filter(d => d.type === 'do');
  const donts = dosAndDonts.filter(d => d.type === 'dont');

  const getYourRights = () => {
    switch (language) {
      case 'hi': return 'आपके अधिकार';
      case 'mr': return 'तुमचे हक्क';
      default: return 'Your Rights';
    }
  };

  const getDosTitle = () => {
    switch (language) {
      case 'hi': return 'क्या करें ✅';
      case 'mr': return 'काय करा ✅';
      default: return "Do's ✅";
    }
  };

  const getDontsTitle = () => {
    switch (language) {
      case 'hi': return 'क्या न करें ❌';
      case 'mr': return 'काय करू नका ❌';
      default: return "Don'ts ❌";
    }
  };

  const getActionStepsTitle = () => {
    switch (language) {
      case 'hi': return 'क्या कदम उठाएं';
      case 'mr': return 'काय पावले उचला';
      default: return 'Action Steps';
    }
  };

  const getHelplinesTitle = () => {
    switch (language) {
      case 'hi': return 'हेल्पलाइन नंबर';
      case 'mr': return 'हेल्पलाइन नंबर';
      default: return 'Helpline Numbers';
    }
  };

  const getRecordEvidence = () => {
    switch (language) {
      case 'hi': return 'साक्ष्य रिकॉर्ड करें';
      case 'mr': return 'पुरावा रेकॉर्ड करा';
      default: return 'Record Evidence';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
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
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {situation.is_emergency && (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
              <h1 className="text-lg font-semibold text-foreground line-clamp-1">
                {getLocalizedText(situation as unknown as Record<string, unknown>, 'title')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Situation Summary */}
        {situation.description_en && (
          <div className="rounded-xl border border-border/50 bg-card/50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-medium text-foreground">
                  {language === 'hi' ? 'आपकी स्थिति' : 
                   language === 'mr' ? 'तुमची परिस्थिती' : 'Your Situation'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {getLocalizedText(situation as unknown as Record<string, unknown>, 'description')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rights Section */}
        {rights.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              {getYourRights()}
            </h2>
            <div className="space-y-3">
              {rights.map((right, index) => (
                <RightsCard
                  key={right.id}
                  right={right}
                  index={index}
                  getLocalizedText={getLocalizedText}
                />
              ))}
            </div>
          </section>
        )}

        {/* Do's and Don'ts */}
        {dosAndDonts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {dos.length > 0 && (
              <DosAndDonts
                items={dos}
                type="do"
                title={getDosTitle()}
                getLocalizedText={getLocalizedText}
              />
            )}
            {donts.length > 0 && (
              <DosAndDonts
                items={donts}
                type="dont"
                title={getDontsTitle()}
                getLocalizedText={getLocalizedText}
              />
            )}
          </div>
        )}

        {/* Action Steps */}
        {actionSteps.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {getActionStepsTitle()}
            </h2>
            <ActionSteps
              steps={actionSteps}
              getLocalizedText={getLocalizedText}
            />
          </section>
        )}

        {/* Helplines */}
        {helplines.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Phone className="h-5 w-5 text-primary" />
              {getHelplinesTitle()}
            </h2>
            <HelplineList
              helplines={helplines}
              getLocalizedText={getLocalizedText}
            />
          </section>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/95 p-4 backdrop-blur-sm">
        <div className="container mx-auto">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onRecordEvidence}
          >
            <Mic className="h-4 w-4" />
            {getRecordEvidence()}
          </Button>
        </div>
      </div>
    </div>
  );
};
