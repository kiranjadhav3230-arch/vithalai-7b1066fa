import React, { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, Trophy, Award, GraduationCap, Scale, ShoppingBag, Shield, Users, Clock, CheckCircle, Lock, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/useLanguage';
import { useExamHistory } from '@/hooks/useExamHistory';
import { RightsLearningGame } from './RightsLearningGame';
import { RightsQuizExam } from './RightsQuizExam';
import { RightsCertificate } from './RightsCertificate';
import { RightsLeaderboard } from './RightsLeaderboard';
import { WeeklyChallenge } from './WeeklyChallenge';
import { supabase } from '@/integrations/supabase/client';

type TopicType = 'fundamental_rights' | 'consumer_rights' | 'women_rights' | 'police_rights' | 'rti_rights' | 'cyber_rights' | 'tenant_rights' | 'senior_citizen_rights';
type ModeType = 'select' | 'enter_name' | 'learn' | 'exam' | 'certificate' | 'leaderboard' | 'history';

interface RightsLearningHubProps {
  onBack: () => void;
}

const topics = [
  {
    id: 'fundamental_rights' as TopicType,
    icon: Scale,
    color: 'bg-blue-500',
    title: { en: 'Fundamental Rights', hi: 'मौलिक अधिकार', mr: 'मूलभूत अधिकार' },
    description: { 
      en: 'Learn about your constitutional rights', 
      hi: 'अपने संवैधानिक अधिकारों के बारे में जानें',
      mr: 'तुमच्या घटनात्मक अधिकारांबद्दल जाणून घ्या'
    }
  },
  {
    id: 'consumer_rights' as TopicType,
    icon: ShoppingBag,
    color: 'bg-green-500',
    title: { en: 'Consumer Rights', hi: 'उपभोक्ता अधिकार', mr: 'ग्राहक अधिकार' },
    description: { 
      en: 'Know your rights as a consumer', 
      hi: 'एक उपभोक्ता के रूप में अपने अधिकार जानें',
      mr: 'ग्राहक म्हणून तुमचे अधिकार जाणून घ्या'
    }
  },
  {
    id: 'women_rights' as TopicType,
    icon: Users,
    color: 'bg-pink-500',
    title: { en: 'Women Rights', hi: 'महिला अधिकार', mr: 'महिला अधिकार' },
    description: { 
      en: 'Workplace & domestic safety rights', 
      hi: 'कार्यस्थल और घरेलू सुरक्षा अधिकार',
      mr: 'कार्यस्थळ आणि घरगुती सुरक्षा अधिकार'
    }
  },
  {
    id: 'police_rights' as TopicType,
    icon: Shield,
    color: 'bg-orange-500',
    title: { en: 'Rights with Police', hi: 'पुलिस के साथ अधिकार', mr: 'पोलिसांसोबत अधिकार' },
    description: { 
      en: 'Know your rights during arrest', 
      hi: 'गिरफ्तारी के दौरान अपने अधिकार जानें',
      mr: 'अटकेदरम्यान तुमचे अधिकार जाणून घ्या'
    }
  },
  {
    id: 'rti_rights' as TopicType,
    icon: BookOpen,
    color: 'bg-purple-500',
    title: { en: 'RTI Rights', hi: 'RTI अधिकार', mr: 'RTI अधिकार' },
    description: { 
      en: 'Right to Information Act knowledge', 
      hi: 'सूचना का अधिकार अधिनियम ज्ञान',
      mr: 'माहितीचा अधिकार कायद्याचे ज्ञान'
    }
  },
  {
    id: 'cyber_rights' as TopicType,
    icon: Shield,
    color: 'bg-cyan-500',
    title: { en: 'Cyber Rights', hi: 'साइबर अधिकार', mr: 'सायबर अधिकार' },
    description: { 
      en: 'Online safety & digital rights', 
      hi: 'ऑनलाइन सुरक्षा और डिजिटल अधिकार',
      mr: 'ऑनलाइन सुरक्षा आणि डिजिटल अधिकार'
    }
  },
  {
    id: 'tenant_rights' as TopicType,
    icon: Scale,
    color: 'bg-amber-500',
    title: { en: 'Tenant Rights', hi: 'किरायेदार अधिकार', mr: 'भाडेकरू अधिकार' },
    description: { 
      en: 'Rental & housing rights', 
      hi: 'किराया और आवास अधिकार',
      mr: 'भाडे आणि घरगुती अधिकार'
    }
  },
  {
    id: 'senior_citizen_rights' as TopicType,
    icon: Users,
    color: 'bg-rose-500',
    title: { en: 'Senior Citizen Rights', hi: 'वरिष्ठ नागरिक अधिकार', mr: 'ज्येष्ठ नागरिक अधिकार' },
    description: { 
      en: 'Rights for elderly persons', 
      hi: 'वृद्ध व्यक्तियों के अधिकार',
      mr: 'ज्येष्ठ व्यक्तींचे अधिकार'
    }
  }
];

export const RightsLearningHub: React.FC<RightsLearningHubProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<ModeType>('select');
  const [selectedTopic, setSelectedTopic] = useState<TopicType | null>(null);
  const [userName, setUserName] = useState('');
  const [examScore, setExamScore] = useState(0);
  const [examTotal, setExamTotal] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);

  const { 
    examHistory, 
    loading: historyLoading, 
    saveExamResult, 
    canTakeExam, 
    getCooldownRemaining,
    getPassedTopics 
  } = useExamHistory(userId);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getLocalizedText = (item: { en: string; hi: string; mr: string }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const handleTopicSelect = (topic: TopicType) => {
    // Check cooldown for logged-in users
    if (userId && !canTakeExam(topic)) {
      return; // Button should be disabled anyway
    }
    setSelectedTopic(topic);
    setMode('enter_name');
  };

  const handleStartLearning = () => {
    if (userName.trim()) {
      setMode('learn');
    }
  };

  const handleLearningComplete = () => {
    setMode('exam');
  };

  const handleExamComplete = async (score: number, total: number, passed: boolean) => {
    setExamScore(score);
    setExamTotal(total);
    
    // Generate certificate ID
    const newCertId = `VIT-${Date.now().toString(36).toUpperCase()}`;
    setCertificateId(newCertId);

    // Save exam result to database if user is logged in
    if (userId && selectedTopic) {
      await saveExamResult(
        selectedTopic,
        userName,
        score,
        total,
        passed,
        passed ? newCertId : undefined
      );
    }

    setMode('certificate');
  };

  const handleRetry = () => {
    setMode('learn');
  };

  const handleBackToTopics = () => {
    setMode('select');
    setSelectedTopic(null);
    setUserName('');
    setCertificateId(null);
  };

  const passedTopics = getPassedTopics();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  };

  if (mode === 'history') {
    return (
      <div className="min-h-screen bg-background p-4">
        <Button variant="ghost" onClick={() => setMode('select')} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back'}
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {language === 'hi' ? 'परीक्षा इतिहास' : language === 'mr' ? 'परीक्षा इतिहास' : 'Exam History'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'hi' ? 'आपकी सभी परीक्षाएं और प्रमाणपत्र' : 
               language === 'mr' ? 'तुमच्या सर्व परीक्षा आणि प्रमाणपत्रे' : 
               'All your exams and certificates'}
            </p>
          </div>

          {historyLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'hi' ? 'लोड हो रहा है...' : language === 'mr' ? 'लोड होत आहे...' : 'Loading...'}
            </div>
          ) : examHistory.length === 0 ? (
            <Card className="p-8 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'hi' ? 'अभी तक कोई परीक्षा नहीं दी' : 
                 language === 'mr' ? 'अद्याप कोणतीही परीक्षा दिलेली नाही' : 
                 'No exams taken yet'}
              </p>
              <Button onClick={() => setMode('select')} className="mt-4">
                {language === 'hi' ? 'परीक्षा दें' : language === 'mr' ? 'परीक्षा द्या' : 'Take an Exam'}
              </Button>
            </Card>
          ) : (
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                {examHistory.map((entry) => {
                  const topicData = topics.find(t => t.id === entry.topic);
                  return (
                    <Card key={entry.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full ${topicData?.color || 'bg-primary'} flex items-center justify-center flex-shrink-0`}>
                          {topicData && <topicData.icon className="h-6 w-6 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {topicData ? getLocalizedText(topicData.title) : entry.topic}
                            </h3>
                            {entry.passed ? (
                              <Badge className="bg-green-500 text-white text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {language === 'hi' ? 'पास' : language === 'mr' ? 'उत्तीर्ण' : 'Passed'}
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                {language === 'hi' ? 'फेल' : language === 'mr' ? 'अनुत्तीर्ण' : 'Failed'}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{entry.percentage}% ({entry.score}/{entry.total_questions})</span>
                            <span>{formatDate(entry.completed_at)}</span>
                          </div>
                          {entry.certificate_id && (
                            <div className="flex items-center gap-1 text-xs text-primary mt-1">
                              <Award className="h-3 w-3" />
                              <span>{entry.certificate_id}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'leaderboard') {
    return (
      <RightsLeaderboard
        onBack={() => setMode('select')}
      />
    );
  }

  if (mode === 'learn' && selectedTopic) {
    return (
      <RightsLearningGame
        topic={selectedTopic}
        onComplete={handleLearningComplete}
        onBack={() => setMode('enter_name')}
      />
    );
  }

  if (mode === 'exam' && selectedTopic) {
    return (
      <RightsQuizExam
        topic={selectedTopic}
        onComplete={handleExamComplete}
        onBack={handleBackToTopics}
      />
    );
  }

  if (mode === 'certificate' && selectedTopic) {
    return (
      <RightsCertificate
        userName={userName}
        topic={selectedTopic}
        score={examScore}
        totalQuestions={examTotal}
        onBack={handleBackToTopics}
        onRetry={handleRetry}
      />
    );
  }

  if (mode === 'enter_name' && selectedTopic) {
    const topic = topics.find(t => t.id === selectedTopic);
    
    return (
      <div className="min-h-screen bg-background p-4">
        <Button variant="ghost" onClick={() => setMode('select')} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back'}
        </Button>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full ${topic?.color} flex items-center justify-center mb-4`}>
              {topic && <topic.icon className="h-8 w-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {topic && getLocalizedText(topic.title)}
            </h1>
            <p className="text-muted-foreground">
              {language === 'hi' 
                ? 'प्रमाणपत्र के लिए अपना नाम दर्ज करें'
                : language === 'mr'
                ? 'प्रमाणपत्रासाठी तुमचे नाव प्रविष्ट करा'
                : 'Enter your name for the certificate'}
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {language === 'hi' ? 'आपका पूरा नाम' : language === 'mr' ? 'तुमचे पूर्ण नाव' : 'Your Full Name'}
              </label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={language === 'hi' ? 'नाम लिखें...' : language === 'mr' ? 'नाव लिहा...' : 'Enter your name...'}
                className="text-lg"
              />
            </div>

            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>
                  {language === 'hi' ? 'पहले सीखें (गेम मोड)' : language === 'mr' ? 'प्रथम शिका (गेम मोड)' : 'Learn First (Game Mode)'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Trophy className="h-4 w-4 text-primary" />
                <span>
                  {language === 'hi' ? 'फिर परीक्षा दें' : language === 'mr' ? 'मग परीक्षा द्या' : 'Then Take Exam'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Award className="h-4 w-4 text-primary" />
                <span>
                  {language === 'hi' ? 'प्रमाणपत्र प्राप्त करें' : language === 'mr' ? 'प्रमाणपत्र मिळवा' : 'Get Certificate'}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleStartLearning} 
              className="w-full gap-2"
              disabled={!userName.trim()}
            >
              <GraduationCap className="h-5 w-5" />
              {language === 'hi' ? 'सीखना शुरू करें' : language === 'mr' ? 'शिकायला सुरुवात करा' : 'Start Learning'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back'}
        </Button>
        
        <div className="flex items-center gap-2">
          {/* History Button - only show if logged in */}
          {userId && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setMode('history')}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              {language === 'hi' ? 'इतिहास' : language === 'mr' ? 'इतिहास' : 'History'}
            </Button>
          )}
          
          {/* Leaderboard Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMode('leaderboard')}
            className="gap-2"
          >
            <Trophy className="h-4 w-4 text-yellow-500" />
            {language === 'hi' ? 'लीडरबोर्ड' : language === 'mr' ? 'लीडरबोर्ड' : 'Leaderboard'}
          </Button>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {language === 'hi' ? 'अधिकार शिक्षा केंद्र' : language === 'mr' ? 'अधिकार शिक्षण केंद्र' : 'Rights Learning Hub'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'hi' 
            ? 'सीखें, परीक्षा दें, प्रमाणपत्र पाएं'
            : language === 'mr'
            ? 'शिका, परीक्षा द्या, प्रमाणपत्र मिळवा'
            : 'Learn, Take Exam, Get Certificate'}
        </p>
      </div>

      {/* Weekly Challenge Banner */}
      <div className="max-w-lg mx-auto mb-6">
        <WeeklyChallenge onStartChallenge={(topic) => handleTopicSelect(topic as TopicType)} />
      </div>

      <div className="grid gap-4 max-w-lg mx-auto">
        {topics.map((topic) => {
          const isOnCooldown = userId && !canTakeExam(topic.id);
          const cooldownTime = userId ? getCooldownRemaining(topic.id) : null;
          const hasPassed = passedTopics.includes(topic.id);

          return (
            <Card
              key={topic.id}
              className={`p-4 transition-all ${
                isOnCooldown 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'cursor-pointer hover:border-primary/50'
              }`}
              onClick={() => !isOnCooldown && handleTopicSelect(topic.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${topic.color} flex items-center justify-center flex-shrink-0 relative`}>
                  <topic.icon className="h-6 w-6 text-white" />
                  {hasPassed && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {getLocalizedText(topic.title)}
                    </h3>
                    {hasPassed && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                        <Award className="h-3 w-3 mr-1" />
                        {language === 'hi' ? 'प्रमाणित' : language === 'mr' ? 'प्रमाणित' : 'Certified'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {getLocalizedText(topic.description)}
                  </p>
                  {isOnCooldown && cooldownTime && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                      <Lock className="h-3 w-3" />
                      <Clock className="h-3 w-3" />
                      <span>
                        {language === 'hi' ? `${cooldownTime} में उपलब्ध` : 
                         language === 'mr' ? `${cooldownTime} मध्ये उपलब्ध` : 
                         `Available in ${cooldownTime}`}
                      </span>
                    </div>
                  )}
                </div>
                {isOnCooldown ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-muted-foreground rotate-180" />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md mx-auto space-y-2">
        <p>
          {language === 'hi' 
            ? '⏱️ हर परीक्षा 5 मिनट की है | 📝 10 प्रश्न | 🎯 60% पास मार्क्स'
            : language === 'mr'
            ? '⏱️ प्रत्येक परीक्षा 5 मिनिटांची | 📝 10 प्रश्न | 🎯 60% उत्तीर्ण गुण'
            : '⏱️ Each exam is 5 minutes | 📝 10 questions | 🎯 60% to pass'}
        </p>
        {userId && (
          <p className="text-xs">
            {language === 'hi' 
              ? '🔒 एक विषय में परीक्षा देने के बाद 7 दिन तक दोबारा नहीं दे सकते'
              : language === 'mr'
              ? '🔒 एका विषयात परीक्षा दिल्यानंतर 7 दिवस पुन्हा देता येणार नाही'
              : '🔒 After taking an exam, you must wait 7 days to retake the same topic'}
          </p>
        )}
      </div>
    </div>
  );
};
