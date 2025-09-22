import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Target, Plus, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isSameDay } from 'date-fns';

interface StudyPlannerProps {
  user: any;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ user }) => {
  const [currentMode, setCurrentMode] = useState<'overview' | 'create' | 'calendar'>('overview');
  const [studyPlans, setStudyPlans] = useState<any[]>([]);
  const [activeStudyPlan, setActiveStudyPlan] = useState<any>(null);
  const [studySessions, setStudySessions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreating, setIsCreating] = useState(false);
  
  const [newPlan, setNewPlan] = useState({
    subjects: [''],
    duration: 14,
    studyHoursPerDay: 2,
    goals: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    loadStudyPlans();
    loadStudySessions();
  }, [user]);

  const loadStudyPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudyPlans(data || []);
      
      // Set the first active plan as default
      const activePlan = data?.find(plan => plan.status === 'active');
      if (activePlan) {
        setActiveStudyPlan(activePlan);
      }
    } catch (error: any) {
      console.error('Error loading study plans:', error);
      toast({
        title: "Error loading study plans",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadStudySessions = async () => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setStudySessions(data || []);
    } catch (error: any) {
      console.error('Error loading study sessions:', error);
    }
  };

  const addSubject = () => {
    setNewPlan({
      ...newPlan,
      subjects: [...newPlan.subjects, '']
    });
  };

  const updateSubject = (index: number, value: string) => {
    const updatedSubjects = [...newPlan.subjects];
    updatedSubjects[index] = value;
    setNewPlan({
      ...newPlan,
      subjects: updatedSubjects
    });
  };

  const removeSubject = (index: number) => {
    const updatedSubjects = newPlan.subjects.filter((_, i) => i !== index);
    setNewPlan({
      ...newPlan,
      subjects: updatedSubjects
    });
  };

  const createStudyPlan = async () => {
    const validSubjects = newPlan.subjects.filter(subject => subject.trim());
    
    if (validSubjects.length === 0) {
      toast({
        title: "Subjects required",
        description: "Please add at least one subject to your study plan.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase.functions
        .invoke('study-planner', {
          body: {
            subjects: validSubjects,
            duration: newPlan.duration,
            studyHoursPerDay: newPlan.studyHoursPerDay,
            goals: newPlan.goals,
            userId: user.id
          }
        });

      if (error) throw error;

      toast({
        title: "Study plan created!",
        description: `Your ${newPlan.duration}-day study plan has been generated.`
      });

      setNewPlan({
        subjects: [''],
        duration: 14,
        studyHoursPerDay: 2,
        goals: ''
      });
      
      setCurrentMode('overview');
      loadStudyPlans();
    } catch (error: any) {
      console.error('Error creating study plan:', error);
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create study plan.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const markSessionComplete = async (sessionDate: string, topic: string) => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          study_plan_id: activeStudyPlan?.id,
          topic: topic,
          duration_minutes: newPlan.studyHoursPerDay * 60,
          session_date: sessionDate,
          completed: true,
          rating: 5
        });

      if (error) throw error;

      toast({
        title: "Session completed!",
        description: `Great job studying ${topic}!`
      });

      loadStudySessions();
    } catch (error: any) {
      console.error('Error marking session complete:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getSessionsForDate = (date: Date) => {
    return studySessions.filter(session => 
      isSameDay(new Date(session.session_date), date)
    );
  };

  const getTodaysSchedule = () => {
    if (!activeStudyPlan?.schedule) return [];
    
    const today = new Date();
    const dayIndex = Math.floor((today.getTime() - new Date(activeStudyPlan.start_date).getTime()) / (1000 * 60 * 60 * 24));
    
    return activeStudyPlan.schedule.filter((item: any) => item.day === dayIndex + 1);
  };

  if (currentMode === 'create') {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Create Study Plan
          </h2>
          <p className="text-muted-foreground mt-2">
            Let AI create a personalized study schedule for you
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Study Plan Configuration</CardTitle>
            <CardDescription>
              Customize your study plan parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Subjects to Study</Label>
              <div className="space-y-2 mt-2">
                {newPlan.subjects.map((subject, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Mathematics, History, Biology"
                      value={subject}
                      onChange={(e) => updateSubject(index, e.target.value)}
                    />
                    {newPlan.subjects.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubject(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addSubject} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Study Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="365"
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan({
                    ...newPlan,
                    duration: parseInt(e.target.value) || 14
                  })}
                />
              </div>

              <div>
                <Label htmlFor="hours">Study Hours Per Day</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0.5"
                  max="12"
                  step="0.5"
                  value={newPlan.studyHoursPerDay}
                  onChange={(e) => setNewPlan({
                    ...newPlan,
                    studyHoursPerDay: parseFloat(e.target.value) || 2
                  })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="goals">Study Goals (Optional)</Label>
              <Textarea
                id="goals"
                placeholder="Describe what you want to achieve with this study plan..."
                value={newPlan.goals}
                onChange={(e) => setNewPlan({
                  ...newPlan,
                  goals: e.target.value
                })}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={createStudyPlan}
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <BookOpen className="h-4 w-4 mr-2 animate-pulse" />
                    Creating Plan...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Create Study Plan
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentMode('overview')}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Study Planner
          </h2>
          <p className="text-muted-foreground mt-2">
            AI-powered study scheduling and progress tracking
          </p>
        </div>
        <Button onClick={() => setCurrentMode('create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>

      <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {activeStudyPlan ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{activeStudyPlan.title}</CardTitle>
                      <CardDescription>{activeStudyPlan.description}</CardDescription>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {activeStudyPlan.completed_hours}
                      </div>
                      <div className="text-sm text-muted-foreground">Hours Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {activeStudyPlan.total_hours}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((activeStudyPlan.completed_hours / activeStudyPlan.total_hours) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.ceil((new Date(activeStudyPlan.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-muted-foreground">Days Left</div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={(activeStudyPlan.completed_hours / activeStudyPlan.total_hours) * 100} 
                    className="mt-4" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTodaysSchedule().map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <h4 className="font-medium">{item.subject}</h4>
                          <p className="text-sm text-muted-foreground">{item.topic}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{item.duration} hours</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => markSessionComplete(format(new Date(), 'yyyy-MM-dd'), item.topic)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </div>
                    ))}
                    {getTodaysSchedule().length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No study sessions scheduled for today
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Study Plan</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first AI-powered study plan to get started
                </p>
                <Button onClick={() => setCurrentMode('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Study Plan
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Study Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studyPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                      activeStudyPlan?.id === plan.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => setActiveStudyPlan(plan)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{plan.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(plan.start_date), 'MMM d')} - {format(new Date(plan.end_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                          {plan.status}
                        </Badge>
                        <div className="text-sm text-right">
                          <div className="font-medium">
                            {Math.round((plan.completed_hours / plan.total_hours) * 100)}%
                          </div>
                          <div className="text-muted-foreground">
                            {plan.completed_hours}/{plan.total_hours}h
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {studyPlans.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No study plans created yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Calendar</CardTitle>
                <CardDescription>
                  View and track your study sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Sessions for {format(selectedDate, 'MMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {getSessionsForDate(selectedDate).map((session) => (
                      <div key={session.id} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{session.topic}</h4>
                            <p className="text-sm text-muted-foreground">
                              {session.duration_minutes} minutes
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.completed && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {session.rating && (
                              <div className="flex">
                                {[...Array(session.rating)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {session.notes}
                          </p>
                        )}
                      </div>
                    ))}
                    {getSessionsForDate(selectedDate).length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No study sessions on this date
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};