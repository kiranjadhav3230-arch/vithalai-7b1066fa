import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

interface CareerAssessmentProps {
  onComplete: (data: any) => void;
}

export const CareerAssessment: React.FC<CareerAssessmentProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education: '',
    currentStatus: '',
    interests: [],
    skills: [],
    preferredIndustries: [],
    careerGoals: '',
    workPreference: '',
    location: ''
  });

  const skills = [
    'Programming', 'Data Analysis', 'Communication', 'Leadership', 'Marketing',
    'Design', 'Sales', 'Project Management', 'Teaching', 'Research',
    'Finance', 'Healthcare', 'Engineering', 'Writing', 'Public Speaking'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'Manufacturing',
    'Retail', 'Entertainment', 'Government', 'Non-profit', 'Agriculture',
    'Real Estate', 'Transportation', 'Energy', 'Media', 'Consulting'
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      preferredIndustries: prev.preferredIndustries.includes(industry)
        ? prev.preferredIndustries.filter(i => i !== industry)
        : [...prev.preferredIndustries, industry]
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit assessment
      toast({
        title: "Assessment Complete!",
        description: "Generating your personalized career recommendations..."
      });
      onComplete(formData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">Let's start with some basic information about you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            placeholder="Enter your age"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="education">Education Level</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Current Status</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, currentStatus: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your current status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="job-seeker">Job Seeker</SelectItem>
              <SelectItem value="employed">Currently Employed</SelectItem>
              <SelectItem value="freelancer">Freelancer</SelectItem>
              <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Preferred Work Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="e.g., Mumbai, Delhi, Remote"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Skills & Interests</h2>
        <p className="text-muted-foreground">Tell us about your skills and what interests you</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold mb-3 block">Your Skills (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={formData.skills.includes(skill)}
                  onCheckedChange={() => handleSkillToggle(skill)}
                />
                <Label htmlFor={skill} className="text-sm">{skill}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">Preferred Industries</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {industries.map((industry) => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox
                  id={industry}
                  checked={formData.preferredIndustries.includes(industry)}
                  onCheckedChange={() => handleIndustryToggle(industry)}
                />
                <Label htmlFor={industry} className="text-sm">{industry}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Career Goals & Preferences</h2>
        <p className="text-muted-foreground">Help us understand your career aspirations</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goals">Career Goals & Aspirations</Label>
          <Textarea
            id="goals"
            value={formData.careerGoals}
            onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
            placeholder="Describe your career goals, what you want to achieve, and your ideal work environment..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="work-preference">Work Preference</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, workPreference: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your work preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office-based</SelectItem>
              <SelectItem value="remote">Remote Work</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="travel">Travel Required</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="border-0 shadow-xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle className="text-3xl font-bold">{t('startAssessment')}</CardTitle>
            </div>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-primary' : 'bg-muted'
                  } transition-colors`}
                />
              ))}
            </div>
            <p className="text-muted-foreground mt-2">Step {step} of 3</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              
              <Button 
                onClick={handleNext}
                className="ml-auto bg-gradient-to-r from-primary to-accent"
              >
                {step === 3 ? 'Complete Assessment' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};