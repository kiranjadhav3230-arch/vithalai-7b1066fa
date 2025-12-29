import React, { useState } from 'react';
import { ChevronLeft, BookOpen, Trophy, Award, GraduationCap, Scale, ShoppingBag, Shield, Users, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { RightsLearningGame } from './RightsLearningGame';
import { RightsQuizExam } from './RightsQuizExam';
import { RightsCertificate } from './RightsCertificate';
import { RightsLeaderboard } from './RightsLeaderboard';
import { WeeklyChallenge } from './WeeklyChallenge';

type TopicType = 'fundamental_rights' | 'consumer_rights' | 'women_rights' | 'police_rights';
type ModeType = 'select' | 'enter_name' | 'learn' | 'exam' | 'certificate' | 'leaderboard';

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
  }
];

export const RightsLearningHub: React.FC<RightsLearningHubProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<ModeType>('select');
  const [selectedTopic, setSelectedTopic] = useState<TopicType | null>(null);
  const [userName, setUserName] = useState('');
  const [examScore, setExamScore] = useState(0);
  const [examTotal, setExamTotal] = useState(0);

  const getLocalizedText = (item: { en: string; hi: string; mr: string }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const handleTopicSelect = (topic: TopicType) => {
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

  const handleExamComplete = (score: number, total: number, passed: boolean) => {
    setExamScore(score);
    setExamTotal(total);
    setMode('certificate');
  };

  const handleRetry = () => {
    setMode('learn');
  };

  const handleBackToTopics = () => {
    setMode('select');
    setSelectedTopic(null);
    setUserName('');
  };

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
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className="p-4 cursor-pointer hover:border-primary/50 transition-all"
            onClick={() => handleTopicSelect(topic.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${topic.color} flex items-center justify-center flex-shrink-0`}>
                <topic.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">
                  {getLocalizedText(topic.title)}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {getLocalizedText(topic.description)}
                </p>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground rotate-180" />
            </div>
          </Card>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md mx-auto">
        <p>
          {language === 'hi' 
            ? '⏱️ हर परीक्षा 10 मिनट की है | 📝 10 प्रश्न | 🎯 60% पास मार्क्स'
            : language === 'mr'
            ? '⏱️ प्रत्येक परीक्षा 10 मिनिटांची | 📝 10 प्रश्न | 🎯 60% उत्तीर्ण गुण'
            : '⏱️ Each exam is 10 minutes | 📝 10 questions | 🎯 60% to pass'}
        </p>
      </div>
    </div>
  );
};
