import React from 'react';
import { Phone, Mic, MapPin, FileText, Info, Navigation, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionStep } from '@/hooks/useHaqJaano';
import { cn } from '@/lib/utils';

interface ActionStepsProps {
  steps: ActionStep[];
  getLocalizedText: (item: Record<string, unknown>, field: string) => string;
}

const actionTypeIcons: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  record: <Mic className="h-4 w-4" />,
  share_location: <MapPin className="h-4 w-4" />,
  generate_document: <FileText className="h-4 w-4" />,
  navigate: <Navigation className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

export const ActionSteps: React.FC<ActionStepsProps> = ({
  steps,
  getLocalizedText,
}) => {
  const handleAction = (step: ActionStep) => {
    const data = step.action_data as Record<string, string>;
    
    switch (step.action_type) {
      case 'call':
        if (data?.phone_number) {
          window.location.href = `tel:${data.phone_number}`;
        }
        break;
      case 'share_location':
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            const url = `https://maps.google.com/?q=${latitude},${longitude}`;
            window.open(url, '_blank');
          });
        }
        break;
      case 'navigate':
        if (data?.url) {
          window.open(data.url, '_blank');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'relative flex gap-4 pl-2',
              step.is_critical && 'animate-pulse'
            )}
          >
            {/* Step number */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                step.is_critical
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-primary text-primary-foreground'
              )}
            >
              {step.is_critical ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <span className="text-sm font-bold">{step.step_order}</span>
              )}
            </div>

            {/* Step content */}
            <div
              className={cn(
                'flex-1 rounded-xl border bg-card/50 p-4',
                step.is_critical
                  ? 'border-destructive/30 bg-destructive/5'
                  : 'border-border/50'
              )}
            >
              <p className="font-medium text-foreground">
                {getLocalizedText(step as unknown as Record<string, unknown>, 'action_text')}
              </p>
              
              {step.action_type !== 'info' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-2"
                  onClick={() => handleAction(step)}
                >
                  {actionTypeIcons[step.action_type]}
                  {step.action_type === 'call' && 'Call'}
                  {step.action_type === 'record' && 'Record'}
                  {step.action_type === 'share_location' && 'Share Location'}
                  {step.action_type === 'generate_document' && 'Generate'}
                  {step.action_type === 'navigate' && 'Open'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
