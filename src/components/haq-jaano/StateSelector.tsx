import React from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/useLanguage';
import { INDIAN_STATES } from '@/hooks/useLeaderboard';
import { cn } from '@/lib/utils';

interface StateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedState: string;
  onSelect: (state: string) => void;
  showAllIndia?: boolean;
}

export const StateSelector: React.FC<StateSelectorProps> = ({
  isOpen,
  onClose,
  selectedState,
  onSelect,
  showAllIndia = true
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const states = showAllIndia ? INDIAN_STATES : INDIAN_STATES.filter(s => s.value !== 'all');

  const getStateName = (state: typeof INDIAN_STATES[0]) => {
    return state[language as keyof typeof state] || state.en;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background border-t rounded-t-2xl shadow-xl animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'hi' ? 'राज्य चुनें' : language === 'mr' ? 'राज्य निवडा' : 'Select State'}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-2 gap-2 p-4">
            {states.map((state) => (
              <button
                key={state.value}
                onClick={() => {
                  onSelect(state.value);
                  onClose();
                }}
                className={cn(
                  "p-3 rounded-lg text-left transition-all border",
                  selectedState === state.value
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={cn(
                    "h-4 w-4 flex-shrink-0",
                    selectedState === state.value ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-medium truncate",
                    selectedState === state.value ? "text-primary" : "text-foreground"
                  )}>
                    {getStateName(state)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
