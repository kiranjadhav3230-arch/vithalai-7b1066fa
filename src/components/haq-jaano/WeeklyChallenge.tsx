import React, { useState, useEffect } from 'react';
import { Flame, Clock, Trophy, ChevronRight, Sparkles, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { getWeekNumber } from '@/hooks/useLeaderboard';

interface WeeklyChallengeProps {
  onStartChallenge: (topic: string) => void;
}

const WEEKLY_TOPICS = [
  { 
    id: 'fundamental_rights', 
    en: 'Fundamental Rights', 
    hi: 'मौलिक अधिकार', 
    mr: 'मूलभूत अधिकार',
    color: 'from-blue-500 to-indigo-600',
    icon: '⚖️'
  },
  { 
    id: 'consumer_rights', 
    en: 'Consumer Rights', 
    hi: 'उपभोक्ता अधिकार', 
    mr: 'ग्राहक अधिकार',
    color: 'from-green-500 to-emerald-600',
    icon: '🛒'
  },
  { 
    id: 'women_rights', 
    en: 'Women Rights', 
    hi: 'महिला अधिकार', 
    mr: 'महिला अधिकार',
    color: 'from-pink-500 to-rose-600',
    icon: '👩'
  },
  { 
    id: 'police_rights', 
    en: 'Police Rights', 
    hi: 'पुलिस अधिकार', 
    mr: 'पोलिस अधिकार',
    color: 'from-orange-500 to-amber-600',
    icon: '🛡️'
  },
];

export const WeeklyChallenge: React.FC<WeeklyChallengeProps> = ({ onStartChallenge }) => {
  const { language } = useLanguage();
  const [timeToWeekEnd, setTimeToWeekEnd] = useState('');

  // Get current week's topic based on week number
  const currentWeek = getWeekNumber();
  const currentTopic = WEEKLY_TOPICS[currentWeek % WEEKLY_TOPICS.length];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(23, 59, 59, 999);
      
      const diff = nextSunday.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (language === 'hi') {
        return `${days} दिन ${hours} घंटे`;
      } else if (language === 'mr') {
        return `${days} दिवस ${hours} तास`;
      }
      return `${days}d ${hours}h`;
    };

    setTimeToWeekEnd(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeToWeekEnd(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [language]);

  const getLocalizedText = (item: { en: string; hi: string; mr: string }) => {
    return item[language as keyof typeof item] || item.en;
  };

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${currentTopic.color} p-4 border-0 shadow-lg`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 opacity-20">
        <Sparkles className="h-24 w-24 text-white" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-10">
        <Star className="h-16 w-16 text-white" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full">
            <Flame className="h-4 w-4 text-yellow-300 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              {language === 'hi' ? 'साप्ताहिक चुनौती' : 
               language === 'mr' ? 'साप्ताहिक आव्हान' : 
               'Weekly Challenge'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full text-white/90 text-xs">
            <Clock className="h-3 w-3" />
            {timeToWeekEnd}
          </div>
        </div>

        {/* Topic */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{currentTopic.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">
              {getLocalizedText(currentTopic)}
            </h3>
            <p className="text-white/80 text-xs">
              {language === 'hi' ? `सप्ताह ${currentWeek} • 2x बोनस पॉइंट्स` : 
               language === 'mr' ? `आठवडा ${currentWeek} • 2x बोनस पॉइंट्स` : 
               `Week ${currentWeek} • 2x Bonus Points`}
            </p>
          </div>
        </div>

        {/* Prizes */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <Trophy className="h-5 w-5 text-yellow-300 mx-auto mb-1" />
            <div className="text-[10px] text-white/70">
              {language === 'hi' ? '1st' : language === 'mr' ? '1st' : '1st'}
            </div>
            <div className="text-xs font-bold text-white">🥇</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <Trophy className="h-5 w-5 text-gray-300 mx-auto mb-1" />
            <div className="text-[10px] text-white/70">
              {language === 'hi' ? '2nd' : language === 'mr' ? '2nd' : '2nd'}
            </div>
            <div className="text-xs font-bold text-white">🥈</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <Trophy className="h-5 w-5 text-amber-600 mx-auto mb-1" />
            <div className="text-[10px] text-white/70">
              {language === 'hi' ? '3rd' : language === 'mr' ? '3rd' : '3rd'}
            </div>
            <div className="text-xs font-bold text-white">🥉</div>
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={() => onStartChallenge(currentTopic.id)}
          className="w-full bg-white text-gray-900 hover:bg-white/90 font-bold gap-2"
        >
          {language === 'hi' ? 'चुनौती स्वीकार करें' : 
           language === 'mr' ? 'आव्हान स्वीकारा' : 
           'Accept Challenge'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
