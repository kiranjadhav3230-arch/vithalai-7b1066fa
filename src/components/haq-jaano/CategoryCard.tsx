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

const categoryGradients: Record<string, string> = {
  police: 'from-orange-500 to-amber-500',
  hospital: 'from-red-500 to-orange-500',
  workplace: 'from-amber-500 to-orange-500',
  women_safety: 'from-pink-500 to-orange-500',
  consumer: 'from-orange-400 to-amber-400',
  traffic: 'from-orange-500 to-red-500',
  property: 'from-amber-500 to-orange-600',
  government: 'from-orange-600 to-amber-600',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  index,
  getLocalizedText,
}) => {
  const Icon = categoryIcons[category.category_type] || Shield;
  const gradient = categoryGradients[category.category_type] || 'from-orange-500 to-amber-500';

  return (
    <button
      onClick={onClick}
      className="glass-card group relative flex flex-col items-center justify-center gap-3 p-6"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={cn(
        'rounded-2xl p-4 bg-gradient-to-br shadow-lg shadow-orange-500/20 transition-transform duration-300 group-hover:scale-110',
        gradient
      )}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <span className="text-center text-sm font-medium text-foreground">
        {getLocalizedText(category as unknown as Record<string, unknown>, 'name')}
      </span>
    </button>
  );
};
