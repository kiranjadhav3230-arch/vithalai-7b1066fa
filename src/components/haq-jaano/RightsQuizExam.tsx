import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Clock, CheckCircle, XCircle, Trophy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { quizQuestions, QuizQuestion } from '@/data/quizQuestions';

interface RightsQuizExamProps {
  topic: 'fundamental_rights' | 'consumer_rights' | 'women_rights' | 'police_rights';
  onComplete: (score: number, total: number, passed: boolean) => void;
  onBack: () => void;
}

export const RightsQuizExam: React.FC<RightsQuizExamProps> = ({
  topic,
  onComplete,
  onBack
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [examFinished, setExamFinished] = useState(false);

  // Randomize and select 10 questions from the pool
  const questions = useMemo(() => {
    const allQuestions = quizQuestions[topic] || quizQuestions.fundamental_rights;
    return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(10, allQuestions.length));
  }, [topic]);

  useEffect(() => {
    if (examFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const getLocalizedText = (item: { en: string; hi: string; mr: string }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const getLocalizedArray = (item: { en: string[]; hi: string[]; mr: string[] }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOption;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(answers[currentIndex + 1] ?? null);
      setShowResult(answers[currentIndex + 1] !== undefined);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    setExamFinished(true);
    const correctCount = answers.reduce((acc, answer, idx) => {
      return acc + (answer === questions[idx]?.correctIndex ? 1 : 0);
    }, 0);
    const passed = correctCount >= Math.ceil(questions.length * 0.6);
    onComplete(correctCount, questions.length, passed);
  };

  const getTopicTitle = () => {
    const titles = {
      fundamental_rights: { en: 'Fundamental Rights Exam', hi: 'मौलिक अधिकार परीक्षा', mr: 'मूलभूत अधिकार परीक्षा' },
      consumer_rights: { en: 'Consumer Rights Exam', hi: 'उपभोक्ता अधिकार परीक्षा', mr: 'ग्राहक अधिकार परीक्षा' },
      women_rights: { en: 'Women Rights Exam', hi: 'महिला अधिकार परीक्षा', mr: 'महिला अधिकार परीक्षा' },
      police_rights: { en: 'Police Rights Exam', hi: 'पुलिस अधिकार परीक्षा', mr: 'पोलिस अधिकार परीक्षा' }
    };
    return getLocalizedText(titles[topic] || titles.fundamental_rights);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            {language === 'hi' ? 'छोड़ें' : language === 'mr' ? 'सोडा' : 'Quit'}
          </Button>
          
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft < 60 ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-primary/20 p-2">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{getTopicTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' ? `प्रश्न ${currentIndex + 1} / ${questions.length}` : 
               language === 'mr' ? `प्रश्न ${currentIndex + 1} / ${questions.length}` :
               `Question ${currentIndex + 1} of ${questions.length}`}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6 mb-6 bg-card">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {getLocalizedText(currentQuestion.question)}
          </h2>

          <div className="space-y-3">
            {getLocalizedArray(currentQuestion.options).map((option, idx) => {
              const isCorrect = idx === currentQuestion.correctIndex;
              const isSelected = selectedOption === idx;
              
              let optionClass = 'border-border hover:border-primary/50 bg-card';
              if (showResult) {
                if (isCorrect) {
                  optionClass = 'border-green-500 bg-green-500/10';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'border-destructive bg-destructive/10';
                }
              } else if (isSelected) {
                optionClass = 'border-primary bg-primary/10';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${optionClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current text-sm font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-foreground">{option}</span>
                    {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {getLocalizedText(currentQuestion.explanation)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <Button 
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="flex-1"
          >
            {language === 'hi' ? 'उत्तर जमा करें' : language === 'mr' ? 'उत्तर सबमिट करा' : 'Submit Answer'}
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex-1">
            {currentIndex === questions.length - 1
              ? (language === 'hi' ? 'परिणाम देखें' : language === 'mr' ? 'निकाल पहा' : 'View Results')
              : (language === 'hi' ? 'अगला प्रश्न' : language === 'mr' ? 'पुढील प्रश्न' : 'Next Question')}
          </Button>
        )}
      </div>
    </div>
  );
};
