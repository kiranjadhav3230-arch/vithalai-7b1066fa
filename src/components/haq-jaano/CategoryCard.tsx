import React from 'react';
import { 
  Shield, 
  Building2, 
  Briefcase, 
  Heart, 
  ShoppingCart, 
  Car, 
  Home, 
  Landmark,
  LucideIcon
} from 'lucide-react';
import { LegalCategory } from '@/hooks/useHaqJaano';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: LegalCategory;
  onClick: () => void;
  index: number;
  getLocalizedText: (item: Record<string, unknown>, field: string) => string;
}

const categoryIcons: Record<string, LucideIcon> = {
  police: Shield,
  hospital: Building2,
  workplace: Briefcase,
  women_safety: Heart,
  consumer: ShoppingCart,
  traffic: Car,
  property: Home,
  government: Landmark,
};

const categoryColors: Record<string, string> = {
  police: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50',
  hospital: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/50',
  workplace: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/50',
  women_safety: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-500/50',
  consumer: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/50',
  traffic: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50',
  property: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50',
  government: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 hover:border-teal-500/50',
};

const categoryIconColors: Record<string, string> = {
  police: 'text-blue-400',
  hospital: 'text-red-400',
  workplace: 'text-amber-400',
  women_safety: 'text-pink-400',
  consumer: 'text-green-400',
  traffic: 'text-orange-400',
  property: 'text-purple-400',
  government: 'text-teal-400',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  index,
  getLocalizedText,
}) => {
  const Icon = categoryIcons[category.category_type] || Shield;
  const colorClass = categoryColors[category.category_type] || categoryColors.police;
  const iconColorClass = categoryIconColors[category.category_type] || 'text-primary';

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center justify-center gap-3 rounded-xl border bg-gradient-to-br p-6',
        'transition-all duration-300 hover:scale-105 hover:shadow-lg',
        colorClass
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className={cn(
        'rounded-full bg-background/50 p-4 transition-transform duration-300 group-hover:scale-110',
      )}>
        <Icon className={cn('h-8 w-8', iconColorClass)} />
      </div>
      <span className="text-center text-sm font-medium text-foreground">
        {getLocalizedText(category as unknown as Record<string, unknown>, 'name')}
      </span>
    </button>
  );
};
