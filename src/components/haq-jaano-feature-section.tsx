import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, Brain, Phone, BookOpen, Award, Trophy, Mic,
  ArrowRight, CheckCircle2
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
        highlights: ['पुलिस स्टेशन में अधिकार', 'अस्पताल में अधिकार', 'कार्यस्थल में अधिकार', 'महिला सुरक्षा अधिकार', 'उपभोक्ता अधिकार', 'RTI अधिकार']
      };
    } else if (language === 'mr') {
      return {
        badge: 'भारतातील पहिला AI कायदेशीर सहाय्यक',
        title: 'हक्क जाणा',
        subtitle: 'तुमचे हक्क जाणून घ्या',
        description: 'पोलीस स्टेशन, हॉस्पिटल, कामाच्या ठिकाणी किंवा कुठेही - आता AI च्या मदतीने तुमचे कायदेशीर हक्क लगेच जाणून घ्या',
        tryNow: 'आता वापरा',
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
        highlights: ['पोलीस स्टेशनमध्ये हक्क', 'हॉस्पिटलमध्ये हक्क', 'कामाच्या ठिकाणी हक्क', 'महिला सुरक्षा हक्क', 'ग्राहक हक्क', 'RTI हक्क']
      };
    }
    return {
      badge: "India's First AI Legal Rights Assistant",
      title: 'Haq Jaano',
      subtitle: 'Know Your Rights',
      description: 'At police station, hospital, workplace or anywhere - instantly know your legal rights with AI assistance',
      tryNow: 'Try Now',
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
      highlights: ['Rights at Police Station', 'Rights at Hospital', 'Workplace Rights', 'Women Safety Rights', 'Consumer Rights', 'RTI Rights']
    };
  };

  const texts = getTexts();

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Background - orange themed */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/8 to-black"></div>
      
      {/* Single subtle orb */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-orange-500/25 to-transparent blur-[100px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 animate-[scaleIn_0.5s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs md:text-sm font-display font-semibold text-primary">
              {texts.badge}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            {texts.title}
          </h2>
          <p className="text-2xl md:text-3xl font-display font-semibold mb-4 text-foreground/90">
            {texts.subtitle}
          </p>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-sans">
            {texts.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          {texts.features.map((feature, index) => (
            <Card key={index} variant="glass" className="group border border-primary/8 hover:border-primary/25 transition-all duration-300">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/15 group-hover:shadow-orange-500/25 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-display font-bold text-foreground/90 mb-1">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Highlights */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {texts.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs md:text-sm text-foreground/70">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {texts.stats.map((stat, index) => (
            <div key={index} className="text-center p-4 md:p-5 rounded-xl bg-black/40 backdrop-blur-sm border border-primary/10 hover:border-primary/25 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-sans">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center">
          <Button
            onClick={() => navigate('/haq-jaano')}
            size="lg"
            className="w-full sm:w-auto px-8 py-6 text-base md:text-lg rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300"
          >
            <Shield className="mr-2 h-5 w-5" />
            {texts.tryNow}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
