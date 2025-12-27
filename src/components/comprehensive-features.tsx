import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Code, 
  Target, 
  Mic, 
  Camera,
  Languages,
  Sparkles,
  Brain,
  GraduationCap,
  Leaf,
  Shield
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const ComprehensiveFeatures: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: language === 'hi' ? 'हक जानो - अपने अधिकार जानो' : language === 'mr' ? 'हक्क जाणा - तुमचे हक्क जाणून घ्या' : 'Haq Jaano - Know Your Rights',
      description: language === 'hi' ? 'भारत का पहला AI कानूनी अधिकार सहायक। पुलिस, अस्पताल, कार्यस्थल में अपने अधिकार जानें' : language === 'mr' ? 'भारतातील पहिला AI कायदेशीर हक्क सहाय्यक। पोलीस, हॉस्पिटल, कामाच्या ठिकाणी तुमचे हक्क जाणून घ्या' : 'India\'s first AI Legal Rights Assistant. Know your rights with police, hospital, workplace & more',
      gradient: 'from-blue-500 to-blue-600',
      category: language === 'hi' ? 'कानूनी' : language === 'mr' ? 'कायदेशीर' : 'Legal',
      isNew: true,
      link: '/haq-jaano'
    },
    {
      icon: MessageSquare,
      title: language === 'hi' ? 'AI चैट सहायक' : language === 'mr' ? 'AI चॅट सहाय्यक' : 'AI Chat Assistant',
      description: language === 'hi' ? 'Gemini द्वारा संचालित AI चैटबॉट से तुरंत जवाब पाएं' : language === 'mr' ? 'Gemini द्वारे संचालित AI चॅटबॉटकडून त्वरित उत्तरे मिळवा' : 'Get instant answers with our AI chatbot powered by Gemini',
      gradient: 'from-orange-500 to-orange-600',
      category: language === 'hi' ? 'मुख्य' : language === 'mr' ? 'मुख्य' : 'Core'
    },
    {
      icon: Code,
      title: language === 'hi' ? 'कोड जनरेटर' : language === 'mr' ? 'कोड जनरेटर' : 'Code Generator',
      description: language === 'hi' ? '18+ प्रोग्रामिंग भाषाओं में कोड जनरेट, डिबग, ऑप्टिमाइज़ करें' : language === 'mr' ? '18+ प्रोग्रामिंग भाषांमध्ये कोड जनरेट करा, डीबग करा, ऑप्टिमाइझ करा' : 'Generate, debug, optimize code in 18+ programming languages',
      gradient: 'from-orange-600 to-red-500',
      category: language === 'hi' ? 'डेवलपर' : language === 'mr' ? 'डेव्हलपर' : 'Developer'
    },
    {
      icon: GraduationCap,
      title: language === 'hi' ? 'स्टडी रूम' : language === 'mr' ? 'स्टडी रूम' : 'Study Rooms',
      description: language === 'hi' ? 'AI सहायता के साथ सहयोगी अध्ययन स्थान, रीयल-टाइम चैट' : language === 'mr' ? 'AI सहाय्यासह सहयोगी अभ्यास जागा, रिअल-टाइम चॅट' : 'Collaborative study spaces with AI assistance, real-time chat',
      gradient: 'from-orange-400 to-orange-600',
      category: language === 'hi' ? 'शिक्षा' : language === 'mr' ? 'शिक्षण' : 'Education'
    },
    {
      icon: Leaf,
      title: language === 'hi' ? 'फसल स्वास्थ्य विश्लेषक' : language === 'mr' ? 'पीक आरोग्य विश्लेषक' : 'Crop Health Analyzer',
      description: language === 'hi' ? 'AI-संचालित पौधों की बीमारी निदान, पोषक तत्वों की कमी का पता लगाना' : language === 'mr' ? 'AI-संचालित वनस्पती रोग निदान, पोषक तत्वांची कमतरता शोधणे' : 'AI-powered plant disease diagnosis, nutrient deficiency detection',
      gradient: 'from-green-500 to-green-600',
      category: language === 'hi' ? 'कृषि' : language === 'mr' ? 'शेती' : 'Agriculture'
    },
    {
      icon: Target,
      title: language === 'hi' ? 'करियर मार्गदर्शन' : language === 'mr' ? 'करिअर मार्गदर्शन' : 'Career Guidance',
      description: language === 'hi' ? 'भारतीय नौकरी बाजार के लिए व्यक्तिगत करियर सलाह' : language === 'mr' ? 'भारतीय नोकरी बाजारासाठी वैयक्तिक करिअर सल्ला' : 'Personalized career advice for Indian job market',
      gradient: 'from-orange-400 to-orange-500',
      category: language === 'hi' ? 'करियर' : language === 'mr' ? 'करिअर' : 'Career'
    },
    {
      icon: Brain,
      title: language === 'hi' ? 'करियर मूल्यांकन' : language === 'mr' ? 'करिअर मूल्यांकन' : 'Career Assessment',
      description: language === 'hi' ? 'अपनी ताकत और आदर्श करियर पथ खोजने के लिए मूल्यांकन लें' : language === 'mr' ? 'तुमची ताकद आणि आदर्श करिअर मार्ग शोधण्यासाठी मूल्यांकन घ्या' : 'Take assessments to discover your strengths and ideal career paths',
      gradient: 'from-orange-500 to-orange-700',
      category: language === 'hi' ? 'करियर' : language === 'mr' ? 'करिअर' : 'Career'
    },
    {
      icon: Mic,
      title: language === 'hi' ? 'वॉइस इनपुट' : language === 'mr' ? 'व्हॉइस इनपुट' : 'Voice Input',
      description: language === 'hi' ? 'अंग्रेजी, हिंदी या मराठी में स्वाभाविक रूप से बोलें' : language === 'mr' ? 'इंग्रजी, हिंदी किंवा मराठीत नैसर्गिकपणे बोला' : 'Speak naturally in English, Hindi, or Marathi',
      gradient: 'from-orange-400 to-orange-500',
      category: language === 'hi' ? 'इनपुट' : language === 'mr' ? 'इनपुट' : 'Input'
    },
    {
      icon: Camera,
      title: language === 'hi' ? 'कैमरा इंटीग्रेशन' : language === 'mr' ? 'कॅमेरा इंटिग्रेशन' : 'Camera Integration',
      description: language === 'hi' ? 'समस्याओं को हल करने के लिए सीधे फोटो लें' : language === 'mr' ? 'समस्या सोडवण्यासाठी थेट फोटो काढा' : 'Take photos directly to solve problems and get instant help',
      gradient: 'from-orange-500 to-orange-600',
      category: language === 'hi' ? 'इनपुट' : language === 'mr' ? 'इनपुट' : 'Input'
    },
    {
      icon: Languages,
      title: language === 'hi' ? 'बहु-भाषा समर्थन' : language === 'mr' ? 'बहु-भाषा समर्थन' : 'Multi-language Support',
      description: language === 'hi' ? 'अंग्रेजी, हिंदी और मराठी में उपलब्ध' : language === 'mr' ? 'इंग्रजी, हिंदी आणि मराठीमध्ये उपलब्ध' : 'Available in English, Hindi, and Marathi',
      gradient: 'from-orange-600 to-red-500',
      category: language === 'hi' ? 'पहुंच' : language === 'mr' ? 'प्रवेशयोग्यता' : 'Accessibility'
    }
  ];

  return (
    <section id="all-features" className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/5 to-black"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-orange-500/30 to-transparent blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-orange-600/25 to-transparent blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 animate-scaleIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-intense border border-primary/30 mb-4 morph-shape">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              {language === 'hi' ? 'सभी सुविधाएं' : language === 'mr' ? 'सर्व वैशिष्ट्ये' : 'Complete Feature Set'}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            {language === 'hi' ? 'आपको जो कुछ भी चाहिए' : language === 'mr' ? 'तुम्हाला हवे असलेले सर्व काही' : 'Everything You Need'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto font-sans">
            {language === 'hi' ? 'आपकी सीखने और करियर यात्रा को तेज करने के लिए AI-संचालित उपकरण' : language === 'mr' ? 'तुमच्या शिक्षण आणि करिअर प्रवासाला गती देण्यासाठी AI-संचालित साधने' : 'AI-powered tools to accelerate your learning and career journey'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="glass"
              className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 border border-white/5 hover:border-orange-500/20"
              onClick={() => (feature as any).link && navigate((feature as any).link)}
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-display font-medium">
                        {feature.category}
                      </span>
                      {(feature as any).isNew && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500 text-white font-bold animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm md:text-base font-display font-bold text-foreground/90 mb-1 line-clamp-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                    
                    {/* Link indicator */}
                    {(feature as any).link && (
                      <div className="mt-2 flex items-center gap-1 text-primary text-xs font-medium">
                        <span>{language === 'hi' ? 'अभी आज़माएं' : language === 'mr' ? 'आता वापरा' : 'Try Now'}</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: '18+', value: language === 'hi' ? 'कोड भाषाएं' : language === 'mr' ? 'कोड भाषा' : 'Code Languages' },
            { label: '3', value: language === 'hi' ? 'UI भाषाएं' : language === 'mr' ? 'UI भाषा' : 'UI Languages' },
            { label: 'AI', value: language === 'hi' ? 'Gemini इंजन' : language === 'mr' ? 'Gemini इंजिन' : 'Gemini Engine' },
            { label: '24/7', value: language === 'hi' ? 'हमेशा उपलब्ध' : language === 'mr' ? 'नेहमी उपलब्ध' : 'Always Available' }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 md:p-5 liquid-glass-intense rounded-xl border border-orange-500/10 hover:border-orange-500/30 hover:scale-105 transition-all duration-300"
            >
              <div className="text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-1">
                {stat.label}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-sans">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Credits */}
        <div className="mt-10 md:mt-14 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs md:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Powered by Gemini AI</span>
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
              Developed by Kapil Kiran Jadhav
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
