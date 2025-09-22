import React, { useState, useEffect } from 'react';
import { Brain, Clock, Trophy, Target, Play, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuizInterfaceProps {
  user: any;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ user }) => {
  const [currentMode, setCurrentMode] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [quizConfig, setQuizConfig] = useState({
    topic: '',
    difficulty: 'medium',
    questionCount: 10
  });
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadRecentQuizzes();
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentMode === 'quiz' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && currentMode === 'quiz' && currentQuiz) {
      submitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, currentMode, currentQuiz]);

  const loadRecentQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentQuizzes(data || []);
    } catch (error: any) {
      console.error('Error loading quizzes:', error);
    }
  };

  const generateQuiz = async () => {
    if (!quizConfig.topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your quiz.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions
        .invoke('quiz-generator', {
          body: {
            topic: quizConfig.topic,
            difficulty: quizConfig.difficulty,
            questionCount: quizConfig.questionCount,
            userId: user.id
          }
        });

      if (error) throw error;

      setCurrentQuiz(data.quizSession);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft(data.quizSession.questions.length * 60); // 1 minute per question
      setCurrentMode('quiz');

      toast({
        title: "Quiz generated!",
        description: `Your ${quizConfig.topic} quiz is ready with ${data.quizSession.questions.length} questions.`
      });
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate quiz.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitQuiz = async () => {
    if (!currentQuiz) return;

    try {
      // Calculate score
      const questions = currentQuiz.questions;
      let correctAnswers = 0;
      
      questions.forEach((question: any, index: number) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / questions.length) * 100);

      // Update quiz session with results
      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          user_answers: selectedAnswers,
          score: score,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', currentQuiz.id);

      if (error) throw error;

      setQuizResults({
        score,
        correctAnswers,
        totalQuestions: questions.length,
        questions
      });
      setCurrentMode('results');

      // Check for achievements
      if (score >= 90) {
        await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_type: 'quiz_master',
            achievement_name: 'Quiz Master',
            description: `Scored ${score}% on ${currentQuiz.topic} quiz`,
            metadata: { score, topic: currentQuiz.topic }
          });

        toast({
          title: "Achievement Unlocked! 🏆",
          description: "Quiz Master - Scored 90% or higher!"
        });
      }

      loadRecentQuizzes();
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (currentMode === 'setup') {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Quiz Generator
          </h2>
          <p className="text-muted-foreground mt-2">
            Create personalized quizzes on any topic with AI-generated questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Create New Quiz
              </CardTitle>
              <CardDescription>
                Configure your quiz parameters and generate questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., React Hooks, World War II, Calculus..."
                  value={quizConfig.topic}
                  onChange={(e) => setQuizConfig({ ...quizConfig, topic: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={quizConfig.difficulty} 
                  onValueChange={(value) => setQuizConfig({ ...quizConfig, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="questions">Number of Questions</Label>
                <Select 
                  value={quizConfig.questionCount.toString()} 
                  onValueChange={(value) => setQuizConfig({ ...quizConfig, questionCount: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateQuiz} 
                disabled={isGenerating || !quizConfig.topic.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Quizzes
              </CardTitle>
              <CardDescription>
                Your quiz history and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{quiz.topic}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={quiz.score >= 80 ? "default" : quiz.score >= 60 ? "secondary" : "destructive"}>
                          {quiz.score}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {quiz.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {recentQuizzes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No quizzes taken yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentMode === 'quiz' && currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{currentQuiz.topic} Quiz</h2>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline">
              {currentQuiz.difficulty}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex] || ''}
              onValueChange={(value) => setSelectedAnswers({
                ...selectedAnswers,
                [currentQuestionIndex]: value
              })}
            >
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`option-${key}`} />
                  <Label htmlFor={`option-${key}`} className="cursor-pointer flex-1">
                    <span className="font-medium">{key}.</span> {value as string}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                <Button onClick={submitQuiz}>
                  <Target className="h-4 w-4 mr-2" />
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  disabled={!selectedAnswers[currentQuestionIndex]}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentMode === 'results' && quizResults) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>
          <p className="text-muted-foreground mt-2">
            Here are your results for {currentQuiz.topic}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">
                {quizResults.score}%
              </CardTitle>
              <CardDescription>Overall Score</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600">
                {quizResults.correctAnswers}
              </CardTitle>
              <CardDescription>Correct Answers</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                {quizResults.totalQuestions}
              </CardTitle>
              <CardDescription>Total Questions</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>
              Review your answers and see explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizResults.questions.map((question: any, index: number) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium">Your answer:</span>{' '}
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {userAnswer ? `${userAnswer}. ${question.options[userAnswer]}` : 'No answer'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="font-medium">Correct answer:</span>{' '}
                              <span className="text-green-600">
                                {question.correctAnswer}. {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-muted-foreground mt-2">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => setCurrentMode('setup')}>
            Take Another Quiz
          </Button>
          <Button variant="outline" onClick={loadRecentQuizzes}>
            View All Quizzes
          </Button>
        </div>
      </div>
    );
  }

  return null;
};