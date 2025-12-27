import React from 'react';
import { Phone, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helpline } from '@/hooks/useHaqJaano';
import { cn } from '@/lib/utils';

interface HelplineListProps {
  helplines: Helpline[];
  getLocalizedText: (item: Record<string, unknown>, field: string) => string;
}

export const HelplineList: React.FC<HelplineListProps> = ({
  helplines,
  getLocalizedText,
}) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {helplines.slice(0, 6).map((helpline) => (
        <div
          key={helpline.id}
          className={cn(
            'flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4',
            'transition-all duration-300 hover:border-primary/30 hover:bg-card'
          )}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground truncate">
                {getLocalizedText(helpline as unknown as Record<string, unknown>, 'name')}
              </h4>
              {helpline.is_toll_free && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  Free
                </Badge>
              )}
            </div>
            
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {helpline.working_hours && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {helpline.working_hours}
                </span>
              )}
              {helpline.state && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {helpline.state}
                </span>
              )}
            </div>
          </div>

          <a href={`tel:${helpline.phone_number}`}>
            <Button
              size="sm"
              className="ml-3 gap-2 shrink-0"
            >
              <Phone className="h-4 w-4" />
              {helpline.phone_number}
            </Button>
          </a>
        </div>
      ))}
    </div>
  );
};
