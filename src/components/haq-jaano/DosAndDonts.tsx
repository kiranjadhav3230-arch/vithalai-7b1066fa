import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { DoAndDont } from '@/hooks/useHaqJaano';
import { cn } from '@/lib/utils';

interface DosAndDontsProps {
  items: DoAndDont[];
  type: 'do' | 'dont';
  title: string;
  getLocalizedText: (item: Record<string, unknown>, field: string) => string;
}

export const DosAndDonts: React.FC<DosAndDontsProps> = ({
  items,
  type,
  title,
  getLocalizedText,
}) => {
  const isDo = type === 'do';
  
  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        isDo 
          ? 'border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5'
          : 'border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-600/5'
      )}
    >
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            {isDo ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            )}
            <span className="text-sm text-foreground">
              {getLocalizedText(item as unknown as Record<string, unknown>, 'content')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
