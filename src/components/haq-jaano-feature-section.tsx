import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Brain, 
  Phone, 
  BookOpen, 
  Award, 
  Trophy, 
  Mic, 
  Languages, 
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Target
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const HaqJaanoFeatureSection: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const getTexts = () => {
    if (language === 'hi') {
      return {
        badge: 'भारत का पहला AI कानूनी सहायक',
        title: 'हक जानो',
        subtitle: 'अपने अधिकार जानो',
        description: 'पुलिस स्टेशन, अस्पताल, कार्यस्थल या कहीं भी - अब AI की मदद से अपने कानूनी अधिकार तुरंत जानें',
        tryNow: 'अभी आज़माएं',
        learnMore: 'और जानें',
        features: [
          { icon: Brain, title: 'AI कानूनी सहायक', desc: 'Gemini AI द्वारा संचालित 24/7 कानूनी मार्गदर्शन' },
          { icon: Phone, title: 'आपातकालीन SOS', desc: '3 सेकंड में 112 पर कॉल, स्थान साझा करें' },
          { icon: BookOpen, title: '8 अधिकार विषय', desc: 'मौलिक, उपभोक्ता, महिला, पुलिस, RTI और अधिक' },
          { icon: Award, title: 'प्रमाणपत्र प्राप्त करें', desc: 'क्विज़ पास करें और PDF प्रमाणपत्र डाउनलोड करें' },
          { icon: Trophy, title: 'लीडरबोर्ड', desc: 'राष्ट्रीय और राज्य रैंकिंग, साप्ताहिक चुनौती' },
          { icon: Mic, title: 'वॉइस इनपुट', desc: 'हिंदी, मराठी या अंग्रेजी में बोलें' }
        ],
        stats: [
          { value: '8+', label: 'अधिकार विषय' },
          { value: '25+', label: 'क्विज़ प्रश्न/विषय' },
          { value: '3', label: 'भाषाएं' },
          { value: '24/7', label: 'AI सहायता' }
        ],
        highlights: [
          'पुलिस स्टेशन में अधिकार',
          'अस्पताल में अधिकार',
          'कार्यस्थल में अधिकार',
          'महिला सुरक्षा अधिकार',
          'उपभोक्ता अधिकार',
          'RTI अधिकार'
        ]
      };
    } else if (language === 'mr') {
      return {
        badge: 'भारतातील पहिला AI कायदेशीर सहाय्यक',
        title: 'हक्क जाणा',
        subtitle: 'तुमचे हक्क जाणून घ्या',
        description: 'पोलीस स्टेशन, हॉस्पिटल, कामाच्या ठिकाणी किंवा कुठेही - आता AI च्या मदतीने तुमचे कायदेशीर हक्क लगेच जाणून घ्या',
        tryNow: 'आता वापरा',
        learnMore: 'अधिक जाणून घ्या',
        features: [
          { icon: Brain, title: 'AI कायदेशीर सहाय्यक', desc: 'Gemini AI द्वारे 24/7 कायदेशीर मार्गदर्शन' },
          { icon: Phone, title: 'आपत्कालीन SOS', desc: '3 सेकंदात 112 वर कॉल, स्थान शेअर करा' },
          { icon: BookOpen, title: '8 हक्क विषय', desc: 'मूलभूत, ग्राहक, महिला, पोलीस, RTI आणि अधिक' },
          { icon: Award, title: 'प्रमाणपत्र मिळवा', desc: 'क्विझ पास करा आणि PDF प्रमाणपत्र डाउनलोड करा' },
          { icon: Trophy, title: 'लीडरबोर्ड', desc: 'राष्ट्रीय आणि राज्य रँकिंग, साप्ताहिक आव्हान' },
          { icon: Mic, title: 'व्हॉइस इनपुट', desc: 'हिंदी, मराठी किंवा इंग्रजीत बोला' }
        ],
        stats: [
          { value: '8+', label: 'हक्क विषय' },
          { value: '25+', label: 'क्विझ प्रश्न/विषय' },
          { value: '3', label: 'भाषा' },
          { value: '24/7', label: 'AI सहाय्य' }
        ],
        highlights: [
          'पोलीस स्टेशनमध्ये हक्क',
          'हॉस्पिटलमध्ये हक्क',
          'कामाच्या ठिकाणी हक्क',
          'महिला सुरक्षा हक्क',
          'ग्राहक हक्क',
          'RTI हक्क'
        ]
      };
    }
    return {
      badge: "India's First AI Legal Rights Assistant",
      title: 'Haq Jaano',
      subtitle: 'Know Your Rights',
      description: 'At police station, hospital, workplace or anywhere - instantly know your legal rights with AI assistance',
      tryNow: 'Try Now',
      learnMore: 'Learn More',
      features: [
        { icon: Brain, title: 'AI Legal Assistant', desc: '24/7 legal guidance powered by Gemini AI' },
        { icon: Phone, title: 'Emergency SOS', desc: 'Call 112 in 3 seconds, share location instantly' },
        { icon: BookOpen, title: '8 Rights Topics', desc: 'Fundamental, Consumer, Women, Police, RTI & more' },
        { icon: Award, title: 'Get Certificate', desc: 'Pass quiz and download PDF certificate' },
        { icon: Trophy, title: 'Leaderboard', desc: 'National & state rankings, weekly challenge' },
        { icon: Mic, title: 'Voice Input', desc: 'Speak in Hindi, Marathi or English' }
      ],
      stats: [
        { value: '8+', label: 'Rights Topics' },
        { value: '25+', label: 'Quiz Q/Topic' },
        { value: '3', label: 'Languages' },
        { value: '24/7', label: 'AI Support' }
      ],
      highlights: [
        'Rights at Police Station',
        'Rights at Hospital',
        'Workplace Rights',
        'Women Safety Rights',
        'Consumer Rights',
        'RTI Rights'
      ]
    };
  };

  const texts = getTexts();

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-25">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-500/40 to-transparent blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-blue-600/30 to-transparent blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 animate-scaleIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
            <Shield className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-xs md:text-sm font-display font-semibold text-blue-400">
              {texts.badge}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            {texts.title}
          </h2>
          <p className="text-2xl md:text-3xl font-display font-semibold mb-4 text-foreground/90">
            {texts.subtitle}
          </p>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-sans">
            {texts.description}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          {texts.features.map((feature, index) => (
            <Card
              key={index}
              variant="glass"
              className="group hover:scale-[1.02] transition-all duration-300 border border-blue-500/10 hover:border-blue-500/30"
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-display font-bold text-foreground/90 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rights Highlights */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {texts.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs md:text-sm text-blue-300"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {texts.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 md:p-5 liquid-glass-intense rounded-xl border border-blue-500/10 hover:border-blue-500/30 hover:scale-105 transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-sans">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate('/haq-jaano')}
            size="lg"
            className="w-full sm:w-auto px-8 py-6 text-base md:text-lg rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-display font-semibold shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            <Shield className="mr-2 h-5 w-5" />
            {texts.tryNow}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Powered By */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    </section>
  );
};
