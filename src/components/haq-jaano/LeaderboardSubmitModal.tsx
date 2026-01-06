import React, { useState, useEffect } from 'react';
import { Trophy, User, MapPin, X, Sparkles, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useLeaderboard, INDIAN_STATES } from '@/hooks/useLeaderboard';
import { StateSelector } from './StateSelector';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface LeaderboardSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  score: number;
  totalQuestions: number;
  defaultName?: string;
  isWeeklyChallenge?: boolean;
}

export const LeaderboardSubmitModal: React.FC<LeaderboardSubmitModalProps> = ({
  isOpen,
  onClose,
  topic,
  score,
  totalQuestions,
  defaultName = '',
  isWeeklyChallenge = false
}) => {
  const { language } = useLanguage();
  const { submitToLeaderboard } = useLeaderboard();
  
  const [userName, setUserName] = useState(defaultName);
  const [state, setState] = useState('Maharashtra');
  const [showStateSelector, setShowStateSelector] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const [bonusApplied, setBonusApplied] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        // Generate anonymous user ID
        setUserId(`anon_${Date.now()}_${Math.random().toString(36).substring(7)}`);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    setUserName(defaultName);
  }, [defaultName]);

  if (!isOpen) return null;

  const percentage = Math.round((score / totalQuestions) * 100);

  const getStateName = (stateValue: string) => {
    const stateObj = INDIAN_STATES.find(s => s.value === stateValue);
    if (!stateObj) return stateValue;
    return stateObj[language as keyof typeof stateObj] || stateObj.en;
  };

  const handleSubmit = async () => {
    if (!userName.trim()) return;
    
    setSubmitting(true);
    try {
      const result = await submitToLeaderboard(
        userId,
        userName.trim(),
        topic,
        score,
        totalQuestions,
        state,
        undefined,
        isWeeklyChallenge
      );

      if (result.success) {
        setSubmitted(true);
        setRank(result.rank || null);
        setBonusApplied(result.bonusApplied || false);
        
        // Confetti for top 10 or bonus applied
        if ((result.rank && result.rank <= 10) || result.bonusApplied) {
          confetti({
            particleCount: result.bonusApplied ? 150 : 100,
            spread: 70,
            origin: { x: 0.5, y: 0.6 },
            colors: result.bonusApplied 
              ? ['#f97316', '#ea580c', '#fb923c', '#fed7aa'] 
              : ['#f97316', '#eab308', '#22c55e', '#3b82f6']
          });
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getTopicName = () => {
    const topics: Record<string, { en: string; hi: string; mr: string }> = {
      fundamental_rights: { en: 'Fundamental Rights', hi: 'मौलिक अधिकार', mr: 'मूलभूत अधिकार' },
      consumer_rights: { en: 'Consumer Rights', hi: 'उपभोक्ता अधिकार', mr: 'ग्राहक अधिकार' },
      women_rights: { en: 'Women Rights', hi: 'महिला अधिकार', mr: 'महिला अधिकार' },
      police_rights: { en: 'Police Rights', hi: 'पुलिस अधिकार', mr: 'पोलिस अधिकार' },
    };
    const t = topics[topic];
    return t ? t[language as keyof typeof t] || t.en : topic;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0" onClick={onClose} />
      
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto">
        <Card className="p-6 shadow-xl border-2 border-primary/20 animate-in zoom-in-95">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {!submitted ? (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {language === 'hi' ? 'लीडरबोर्ड में जोड़ें?' : 
                   language === 'mr' ? 'लीडरबोर्डवर जोडायचे?' : 
                   'Join the Leaderboard?'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {language === 'hi' ? `आपने ${percentage}% स्कोर किया - ${getTopicName()}` :
                   language === 'mr' ? `तुम्ही ${percentage}% गुण मिळवले - ${getTopicName()}` :
                   `You scored ${percentage}% - ${getTopicName()}`}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <User className="inline h-4 w-4 mr-1" />
                    {language === 'hi' ? 'आपका नाम' : language === 'mr' ? 'तुमचे नाव' : 'Your Name'}
                  </label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={language === 'hi' ? 'नाम लिखें...' : language === 'mr' ? 'नाव लिहा...' : 'Enter name...'}
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {language === 'hi' ? 'राज्य' : language === 'mr' ? 'राज्य' : 'State'}
                  </label>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setShowStateSelector(true)}
                  >
                    <span>{getStateName(state)}</span>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={!userName.trim() || submitting}
                  className="w-full gap-2"
                >
                  <Trophy className="h-5 w-5" />
                  {submitting 
                    ? (language === 'hi' ? 'जमा हो रहा...' : language === 'mr' ? 'सबमिट होत आहे...' : 'Submitting...')
                    : (language === 'hi' ? 'लीडरबोर्ड में जोड़ें' : language === 'mr' ? 'लीडरबोर्डवर जोडा' : 'Submit to Leaderboard')}
                </Button>

                <Button variant="ghost" onClick={onClose} className="w-full">
                  {language === 'hi' ? 'छोड़ें' : language === 'mr' ? 'वगळा' : 'Skip'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className={cn(
                "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
                bonusApplied ? "bg-orange-500/20" : "bg-green-500/20"
              )}>
                {rank && rank <= 3 ? (
                  <Medal className="h-10 w-10 text-yellow-500" />
                ) : bonusApplied ? (
                  <Trophy className="h-10 w-10 text-orange-500" />
                ) : (
                  <Sparkles className="h-10 w-10 text-green-500" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {language === 'hi' ? 'सबमिट हो गया!' : 
                 language === 'mr' ? 'सबमिट झाले!' : 
                 'Submitted!'}
              </h2>

              {bonusApplied && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 text-orange-600 rounded-full text-sm font-bold mb-3">
                  🔥 {language === 'hi' ? '2x बोनस लागू!' : 
                      language === 'mr' ? '2x बोनस लागू!' : 
                      '2x Bonus Applied!'}
                </div>
              )}
              
              {rank && (
                <div className="mb-4">
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'आपकी रैंक:' : 
                     language === 'mr' ? 'तुमची रँक:' : 
                     'Your Rank:'}
                  </span>
                  <div className="text-4xl font-bold text-primary mt-1">
                    #{rank}
                  </div>
                  {rank <= 10 && (
                    <p className="text-sm text-green-500 mt-2">
                      🎉 {language === 'hi' ? 'टॉप 10 में!' : 
                          language === 'mr' ? 'टॉप 10 मध्ये!' : 
                          'You\'re in the Top 10!'}
                    </p>
                  )}
                </div>
              )}

              <Button onClick={onClose} className="w-full mt-4">
                {language === 'hi' ? 'बंद करें' : language === 'mr' ? 'बंद करा' : 'Close'}
              </Button>
            </div>
          )}
        </Card>
      </div>

      <StateSelector
        isOpen={showStateSelector}
        onClose={() => setShowStateSelector(false)}
        selectedState={state}
        onSelect={setState}
        showAllIndia={false}
      />
    </>
  );
};
