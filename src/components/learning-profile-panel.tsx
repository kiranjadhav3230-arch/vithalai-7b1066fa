import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Eye, 
  BookOpen, 
  Wrench, 
  Target, 
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface LearningProfile {
  id: string;
  user_id: string;
  learning_style: string;
  style_scores: { visual: number; reading: number; practice: number };
  total_interactions: number;
}

interface TopicInteraction {
  id: string;
  topic: string;
  subject: string;
  understanding_score: number;
  total_attempts: number;
}

interface WeakTopic {
  id: string;
  topic: string;
  subject: string;
  times_revisited: number;
  mastery_achieved: boolean;
}

interface LearningProfilePanelProps {
  userId: string;
  onReviewTopic?: (topic: string) => void;
}

export const LearningProfilePanel: React.FC<LearningProfilePanelProps> = ({
  userId,
  onReviewTopic
}) => {
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [topics, setTopics] = useState<TopicInteraction[]>([]);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load learning profile
      const { data: profileData } = await supabase
        .from('learning_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileData) {
        setProfile({
          ...profileData,
          style_scores: (profileData.style_scores as { visual: number; reading: number; practice: number }) || { visual: 0, reading: 0, practice: 0 }
        } as LearningProfile);
      }

      // Load topic interactions
      const { data: topicsData } = await supabase
        .from('topic_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('last_interaction', { ascending: false })
        .limit(10);

      if (topicsData) {
        setTopics(topicsData as TopicInteraction[]);
      }

      // Load weak topics
      const { data: weakData } = await supabase
        .from('weak_topics')
        .select('*')
        .eq('user_id', userId)
        .eq('mastery_achieved', false)
        .order('created_at', { ascending: false });

      if (weakData) {
        setWeakTopics(weakData as WeakTopic[]);
      }
    } catch (error) {
      console.error('Error loading learning data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return <Eye className="h-5 w-5 text-blue-400" />;
      case 'reading': return <BookOpen className="h-5 w-5 text-purple-400" />;
      case 'practice': return <Wrench className="h-5 w-5 text-green-400" />;
      default: return <Brain className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'visual': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'reading': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'practice': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getStyleDescription = (style: string) => {
    switch (style) {
      case 'visual': return 'You learn best with diagrams, charts, and visual representations';
      case 'reading': return 'You prefer detailed explanations and textual descriptions';
      case 'practice': return 'You excel with hands-on exercises and practical examples';
      default: return 'You adapt well to different learning methods';
    }
  };

  const calculateTotalScore = () => {
    if (!profile?.style_scores) return { visual: 33, reading: 33, practice: 34 };
    const scores = profile.style_scores;
    const total = scores.visual + scores.reading + scores.practice;
    if (total === 0) return { visual: 33, reading: 33, practice: 34 };
    return {
      visual: Math.round((scores.visual / total) * 100),
      reading: Math.round((scores.reading / total) * 100),
      practice: Math.round((scores.practice / total) * 100)
    };
  };

  const percentages = calculateTotalScore();

  if (isLoading) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Learning Style Card */}
      <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Learning Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dominant Style */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
            {getStyleIcon(profile?.learning_style || 'balanced')}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold capitalize">
                  {profile?.learning_style || 'Balanced'} Learner
                </span>
                <Badge variant="outline" className={getStyleColor(profile?.learning_style || 'balanced')}>
                  Detected
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {getStyleDescription(profile?.learning_style || 'balanced')}
              </p>
            </div>
          </div>

          {/* Style Distribution */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <span className="text-sm w-16">Visual</span>
              <Progress value={percentages.visual} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-10">{percentages.visual}%</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <span className="text-sm w-16">Reading</span>
              <Progress value={percentages.reading} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-10">{percentages.reading}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-green-400" />
              <span className="text-sm w-16">Practice</span>
              <Progress value={percentages.practice} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-10">{percentages.practice}%</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Based on {profile?.total_interactions || 0} interactions • Updates automatically
          </p>
        </CardContent>
      </Card>

      {/* Weak Topics Card */}
      {weakTopics.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              Topics to Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[150px]">
              <div className="space-y-2">
                {weakTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/20"
                  >
                    <div>
                      <p className="font-medium text-sm">{topic.topic}</p>
                      <p className="text-xs text-muted-foreground">{topic.subject}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onReviewTopic?.(topic.topic)}
                      className="text-orange-400 hover:text-orange-300"
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Recent Topics */}
      {topics.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Topic Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-background/50"
                  >
                    {topic.understanding_score >= 70 ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Target className="h-4 w-4 text-yellow-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{topic.topic}</p>
                      <p className="text-xs text-muted-foreground">
                        {topic.subject} • {topic.total_attempts} attempts
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${
                        topic.understanding_score >= 70 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {topic.understanding_score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
