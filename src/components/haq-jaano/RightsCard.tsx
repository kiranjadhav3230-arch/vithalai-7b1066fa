import React from 'react';
import { CheckCircle2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LegalRight } from '@/hooks/useHaqJaano';
import { cn } from '@/lib/utils';

interface RightsCardProps {
  right: LegalRight;
  index: number;
  getLocalizedText: (item: Record<string, unknown>, field: string) => string;
}

export const RightsCard: React.FC<RightsCardProps> = ({
  right,
  index,
  getLocalizedText,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5 p-4',
        'transition-all duration-300 hover:border-green-500/40 hover:shadow-lg'
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-green-500/20 p-1.5">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">
            {getLocalizedText(right as unknown as Record<string, unknown>, 'right_text')}
          </p>
          
          {(right.section_number || right.act_name) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              {right.section_number && (
                <Badge variant="outline" className="text-xs">
                  {right.section_number}
                </Badge>
              )}
              {right.act_name && (
                <span className="text-xs text-muted-foreground">
                  {right.act_name}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
