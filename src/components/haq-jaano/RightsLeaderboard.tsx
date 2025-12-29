import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Calendar, Clock, MapPin, Filter, RefreshCw, Medal, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/useLanguage';
import { useLeaderboard, INDIAN_STATES } from '@/hooks/useLeaderboard';
import { LeaderboardEntry } from './LeaderboardEntry';
import { StateSelector } from './StateSelector';
import { supabase } from '@/integrations/supabase/client';

interface RightsLeaderboardProps {
  onBack: () => void;
}

const TOPICS = [
  { value: 'all', en: 'All Topics', hi: 'सभी विषय', mr: 'सर्व विषय' },
  { value: 'fundamental_rights', en: 'Fundamental Rights', hi: 'मौलिक अधिकार', mr: 'मूलभूत अधिकार' },
  { value: 'consumer_rights', en: 'Consumer Rights', hi: 'उपभोक्ता अधिकार', mr: 'ग्राहक अधिकार' },
  { value: 'women_rights', en: 'Women Rights', hi: 'महिला अधिकार', mr: 'महिला अधिकार' },
  { value: 'police_rights', en: 'Police Rights', hi: 'पुलिस अधिकार', mr: 'पोलिस अधिकार' },
];

export const RightsLeaderboard: React.FC<RightsLeaderboardProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { entries, loading, fetchLeaderboard, userRank, fetchUserRank } = useLeaderboard();
  
  const [filter, setFilter] = useState<'week' | 'all'>('week');
  const [topic, setTopic] = useState('all');
  const [state, setState] = useState('all');
  const [showStateSelector, setShowStateSelector] = useState(false);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        fetchUserRank(user.id, filter);
      }
    };
    getUser();
  }, [filter, fetchUserRank]);

  useEffect(() => {
    fetchLeaderboard(filter, topic, state);
  }, [filter, topic, state, fetchLeaderboard]);

  const getLocalizedText = (item: { en: string; hi: string; mr: string }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const getStateName = (stateValue: string) => {
    const stateObj = INDIAN_STATES.find(s => s.value === stateValue);
    if (!stateObj) return stateValue;
    return stateObj[language as keyof typeof stateObj] || stateObj.en;
  };

  const getTopicName = (topicValue: string) => {
    const topicObj = TOPICS.find(t => t.value === topicValue);
    if (!topicObj) return topicValue;
    return topicObj[language as keyof typeof topicObj] || topicObj.en;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ChevronLeft className="mr-1 h-4 w-4" />
            {language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back'}
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {language === 'hi' ? 'लीडरबोर्ड' : language === 'mr' ? 'लीडरबोर्ड' : 'Leaderboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'अधिकार ज्ञान रैंकिंग' : 
                   language === 'mr' ? 'अधिकार ज्ञान रँकिंग' : 
                   'Rights Knowledge Rankings'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchLeaderboard(filter, topic, state)}
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as 'week' | 'all')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week" className="gap-1.5">
                <Calendar className="h-4 w-4" />
                {language === 'hi' ? 'इस सप्ताह' : language === 'mr' ? 'या आठवड्यात' : 'This Week'}
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-1.5">
                <Clock className="h-4 w-4" />
                {language === 'hi' ? 'सर्वकालिक' : language === 'mr' ? 'सर्वकालीन' : 'All Time'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStateSelector(true)}
            className="flex-1 justify-between"
          >
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              {getStateName(state)}
            </span>
            <Filter className="h-3.5 w-3.5 flex-shrink-0 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTopicFilter(!showTopicFilter)}
            className="flex-1 justify-between"
          >
            <span className="truncate">{getTopicName(topic)}</span>
            <Filter className="h-3.5 w-3.5 flex-shrink-0 ml-1" />
          </Button>
        </div>

        {/* Topic Filter Dropdown */}
        {showTopicFilter && (
          <div className="px-4 pb-3">
            <Card className="p-2 grid grid-cols-2 gap-1">
              {TOPICS.map((t) => (
                <Button
                  key={t.value}
                  variant={topic === t.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setTopic(t.value);
                    setShowTopicFilter(false);
                  }}
                  className="justify-start text-xs"
                >
                  {getLocalizedText(t)}
                </Button>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* User's Rank Card */}
      {userRank && userRank.entry && (
        <div className="p-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  {userRank.rank <= 3 ? (
                    <Crown className="h-6 w-6 text-primary-foreground" />
                  ) : (
                    <span className="text-xl font-bold text-primary-foreground">#{userRank.rank}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'आपकी रैंक' : language === 'mr' ? 'तुमची रँक' : 'Your Rank'}
                  </p>
                  <p className="text-2xl font-bold text-foreground">#{userRank.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{userRank.entry.percentage}%</p>
                <p className="text-sm text-muted-foreground">{userRank.entry.score}/{userRank.entry.total_questions}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Leaderboard List */}
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : entries.length === 0 ? (
            <Card className="p-8 text-center">
              <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                {language === 'hi' ? 'कोई प्रविष्टि नहीं' : 
                 language === 'mr' ? 'कोणतीही नोंद नाही' : 
                 'No entries yet'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'hi' ? 'पहले बनें जो लीडरबोर्ड पर आए!' : 
                 language === 'mr' ? 'लीडरबोर्डवर प्रथम या!' : 
                 'Be the first one on the leaderboard!'}
              </p>
            </Card>
          ) : (
            entries.map((entry, idx) => (
              <LeaderboardEntry
                key={entry.id}
                entry={entry}
                rank={idx + 1}
                isCurrentUser={entry.user_id === currentUserId}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* State Selector Modal */}
      <StateSelector
        isOpen={showStateSelector}
        onClose={() => setShowStateSelector(false)}
        selectedState={state}
        onSelect={setState}
        showAllIndia={true}
      />
    </div>
  );
};
