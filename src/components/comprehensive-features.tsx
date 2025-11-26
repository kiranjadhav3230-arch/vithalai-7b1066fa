import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Code, 
  FileText, 
  Image as ImageIcon, 
  BookOpen, 
  Target, 
  Mic, 
  Camera,
  Languages,
  Sparkles,
  Brain,
  Calendar,
  GraduationCap,
  Lightbulb
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ComprehensiveFeaturesProps {
  onFeatureSelect?: (feature: string) => void;
}

export const ComprehensiveFeatures: React.FC<ComprehensiveFeaturesProps> = ({ onFeatureSelect }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Get instant answers to your questions with our intelligent AI chatbot powered by Gemini',
      gradient: 'from-orange-500 to-orange-600',
      category: 'Core',
      action: null
    },
    {
      icon: FileText,
      title: 'NotebookLM',
      description: 'Upload PDFs and documents, then chat with your sources to get AI-powered insights',
      gradient: 'from-orange-600 to-orange-700',
      category: 'Core',
      action: 'notebook-lm'
    },
    {
      icon: Code,
      title: 'Code Generator',
      description: 'Generate, debug, explain, optimize, and translate code in 18+ programming languages',
      gradient: 'from-orange-600 to-red-500',
      category: 'Developer',
      action: null
    },
    {
      icon: Target,
      title: 'Career Guidance',
      description: 'Personalized career advice tailored to Indian job market and your skills',
      gradient: 'from-orange-400 to-orange-500',
      category: 'Career',
      action: null
    },
    {
      icon: Brain,
      title: 'Career Assessment',
      description: 'Take comprehensive assessments to discover your strengths and ideal career paths',
      gradient: 'from-orange-500 to-orange-700',
      category: 'Career',
      action: null
    },
    {
      icon: Lightbulb,
      title: 'Quiz Generator',
      description: 'Generate custom quizzes on any topic to test your knowledge and prepare for exams',
      gradient: 'from-orange-600 to-orange-800',
      category: 'Education',
      action: null
    },
    {
      icon: Calendar,
      title: 'Study Planner',
      description: 'Create personalized study schedules and track your progress with AI-powered planning',
      gradient: 'from-orange-400 to-orange-600',
      category: 'Education',
      action: null
    },
    {
      icon: FileText,
      title: 'Document Analyzer',
      description: 'Upload PDFs and documents for AI-powered analysis, summaries, and insights',
      gradient: 'from-orange-500 to-red-600',
      category: 'Productivity',
      action: null
    },
    {
      icon: ImageIcon,
      title: 'Image Analysis',
      description: 'Upload or capture images for AI recognition, problem-solving, and analysis',
      gradient: 'from-orange-600 to-orange-700',
      category: 'AI Tools',
      action: null
    },
    {
      icon: Mic,
      title: 'Voice Input',
      description: 'Speak naturally in English, Hindi, or Marathi for hands-free conversations',
      gradient: 'from-orange-400 to-orange-500',
      category: 'Input',
      action: null
    },
    {
      icon: Camera,
      title: 'Camera Integration',
      description: 'Take photos directly to solve problems, analyze content, or get instant help',
      gradient: 'from-orange-500 to-orange-600',
      category: 'Input',
      action: null
    },
    {
      icon: Languages,
      title: 'Multi-language Support',
      description: 'Available in English, Hindi, and Marathi for seamless communication',
      gradient: 'from-orange-600 to-red-500',
      category: 'Accessibility',
      action: null
    },
    {
      icon: GraduationCap,
      title: 'Student Focused',
      description: 'Specially designed for Indian students with relevant content and guidance',
      gradient: 'from-orange-400 to-orange-600',
      category: 'Target Audience',
      action: null
    }
  ];

  return (
    <section id="all-features" className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/5 to-black"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-500/30 to-transparent blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-orange-600/25 to-transparent blur-[140px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 animate-scaleIn">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass-intense border border-primary/30 mb-6 morph-shape">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Complete Feature Set
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            A comprehensive suite of AI-powered tools to accelerate your learning and career journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="glass"
              className="group morph-shape cursor-pointer hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => feature.action && onFeatureSelect?.(feature.action)}
            >
              <CardContent className="p-8">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-display font-semibold bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 text-orange-400">
                    {feature.category}
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold mb-3 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-500 transition-all duration-500">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-sans">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {[
            { label: '18+ Languages', value: 'Code Support' },
            { label: '3 Languages', value: 'UI Support' },
            { label: 'AI Powered', value: 'Gemini Engine' },
            { label: '24/7', value: 'Always Available' }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 liquid-glass-intense rounded-2xl border border-orange-500/20 morph-shape hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground font-sans">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
