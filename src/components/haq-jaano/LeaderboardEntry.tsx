import React from 'react';
import { Medal, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { LeaderboardEntry as LeaderboardEntryType, INDIAN_STATES } from '@/hooks/useLeaderboard';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  rank: number;
  isCurrentUser?: boolean;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
  entry,
  rank,
  isCurrentUser = false
}) => {
  const { language } = useLanguage();

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return '';
  };

  const getStateName = (stateValue: string) => {
    const state = INDIAN_STATES.find(s => s.value === stateValue);
    if (!state) return stateValue;
    return state[language as keyof typeof state] || state.en;
  };

  const getTopicShort = (topic: string) => {
    const topics: Record<string, { en: string; hi: string; mr: string }> = {
      fundamental_rights: { en: 'FR', hi: 'मौ.अ.', mr: 'मू.अ.' },
      consumer_rights: { en: 'CR', hi: 'उ.अ.', mr: 'ग्रा.अ.' },
      women_rights: { en: 'WR', hi: 'म.अ.', mr: 'म.अ.' },
      police_rights: { en: 'PR', hi: 'पु.अ.', mr: 'पो.अ.' },
    };
    const t = topics[topic];
    return t ? t[language as keyof typeof t] || t.en : topic;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all animate-in fade-in-50 slide-in-from-left-2",
        isCurrentUser 
          ? "bg-primary/10 border-2 border-primary" 
          : "bg-card border border-border",
        rank <= 3 && "shadow-md"
      )}
      style={{ animationDelay: `${rank * 50}ms` }}
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        {rank <= 3 ? (
          <Medal className={cn("h-7 w-7", getMedalColor(rank))} />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg",
          rank === 1 ? "bg-yellow-500" :
          rank === 2 ? "bg-gray-400" :
          rank === 3 ? "bg-amber-600" :
          "bg-primary/80"
        )}>
          {entry.avatar_url ? (
            <img 
              src={entry.avatar_url} 
              alt={entry.user_name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            entry.user_name.charAt(0).toUpperCase()
          )}
        </div>
      </div>

      {/* Name & State */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-semibold text-foreground truncate",
            isCurrentUser && "text-primary"
          )}>
            {entry.user_name}
            {isCurrentUser && (
              <span className="ml-1 text-xs text-primary">
                ({language === 'hi' ? 'आप' : language === 'mr' ? 'तुम्ही' : 'You'})
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{getStateName(entry.state)}</span>
          <span className="mx-1">•</span>
          <span className="px-1.5 py-0.5 bg-primary/10 rounded text-primary text-[10px] font-medium">
            {getTopicShort(entry.topic)}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <div className={cn(
          "text-xl font-bold",
          entry.percentage >= 80 ? "text-green-500" :
          entry.percentage >= 60 ? "text-primary" :
          "text-muted-foreground"
        )}>
          {entry.percentage}%
        </div>
        <div className="text-xs text-muted-foreground">
          {entry.score}/{entry.total_questions}
        </div>
      </div>
    </div>
  );
};
