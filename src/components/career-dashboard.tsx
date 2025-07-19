import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Users, 
  MapPin, 
  Star,
  Briefcase,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface CareerDashboardProps {
  assessmentData: any;
  onLogout: () => void;
}

export const CareerDashboard: React.FC<CareerDashboardProps> = ({ 
  assessmentData, 
  onLogout 
}) => {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);

  useEffect(() => {
    // Simulate AI-powered career recommendations based on assessment data
    generateRecommendations();
    generateSkillGaps();
  }, [assessmentData]);

  const generateRecommendations = () => {
    // Mock AI-generated recommendations based on skills and interests
    const mockRecommendations = [
      {
        title: 'Software Developer',
        match: 92,
        description: 'Perfect match for your programming skills and technology interest',
        requirements: ['JavaScript', 'React', 'Node.js'],
        averageSalary: '₹6-12 LPA',
        growthRate: '+15%'
      },
      {
        title: 'Data Scientist',
        match: 87,
        description: 'Great fit for your analytical skills and data interest',
        requirements: ['Python', 'Machine Learning', 'Statistics'],
        averageSalary: '₹8-15 LPA',
        growthRate: '+22%'
      },
      {
        title: 'Product Manager',
        match: 83,
        description: 'Ideal for your leadership and communication skills',
        requirements: ['Strategy', 'Analytics', 'Leadership'],
        averageSalary: '₹10-20 LPA',
        growthRate: '+18%'
      }
    ];
    setRecommendations(mockRecommendations);
  };

  const generateSkillGaps = () => {
    const mockSkillGaps = [
      {
        skill: 'Machine Learning',
        currentLevel: 30,
        targetLevel: 80,
        courses: ['ML Foundations', 'Python for ML', 'Deep Learning']
      },
      {
        skill: 'React.js',
        currentLevel: 60,
        targetLevel: 90,
        courses: ['Advanced React', 'React Hooks', 'Redux']
      },
      {
        skill: 'Data Visualization',
        currentLevel: 40,
        targetLevel: 75,
        courses: ['D3.js', 'Tableau', 'Power BI']
      }
    ];
    setSkillGaps(mockSkillGaps);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png" 
              alt="Vithal AI Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary">{t('appName')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {assessmentData.name}!</span>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 bg-gradient-to-br from-primary to-primary/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80">Career Matches</p>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-accent to-accent/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80">Skill Gaps</p>
                  <p className="text-2xl font-bold">{skillGaps.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-accent-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-success to-success/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-foreground/80">Learning Paths</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <GraduationCap className="h-8 w-8 text-success-foreground/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Career Recommendations */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  AI Career Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="border border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{rec.title}</h3>
                          <p className="text-muted-foreground text-sm">{rec.description}</p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {rec.match}% Match
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span>Growth: {rec.growthRate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Salary: {rec.averageSalary}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.requirements.map((req: string, reqIndex: number) => (
                          <Badge key={reqIndex} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>

                      <Button size="sm" className="w-full">
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Skill Development */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Skill Development Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillGaps.map((skill, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{skill.skill}</h4>
                      <span className="text-sm text-muted-foreground">
                        {skill.currentLevel}% → {skill.targetLevel}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={skill.currentLevel} 
                      className="h-2"
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      {skill.courses.map((course: string, courseIndex: number) => (
                        <Badge 
                          key={courseIndex} 
                          variant="secondary" 
                          className="text-xs bg-accent/10 text-accent"
                        >
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                <Button className="w-full bg-gradient-to-r from-primary to-accent">
                  Start Learning Journey
                  <BookOpen className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Job Opportunities
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Connect with Mentors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Explore Courses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Update Career Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};