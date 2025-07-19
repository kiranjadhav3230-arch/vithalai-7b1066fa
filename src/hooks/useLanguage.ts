import { useState } from 'react';

const translations = {
  en: {
    appName: 'Vithal AI Assistance',
    tagline: 'Your AI-Powered Career Planning Companion',
    heroTitle: 'Discover Your Perfect Career Path with AI',
    heroSubtitle: 'Get personalized career guidance, job recommendations, and skill development plans tailored for Indian youth',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    howItWorks: 'How It Works',
    features: 'Features',
    testimonials: 'Testimonials',
    contact: 'Contact',
    step1Title: 'Share Your Skills',
    step1Desc: 'Tell us about your interests, skills, and career aspirations',
    step2Title: 'AI Analysis',
    step2Desc: 'Our AI analyzes market trends and matches your profile',
    step3Title: 'Get Recommendations',
    step3Desc: 'Receive personalized career paths and development plans',
    feature1Title: 'AI-Powered Guidance',
    feature1Desc: 'Advanced algorithms provide personalized career recommendations',
    feature2Title: 'Market Insights',
    feature2Desc: 'Real-time job market analysis and trending opportunities',
    feature3Title: 'Skill Development',
    feature3Desc: 'Customized learning paths to enhance your capabilities',
    startAssessment: 'Start Career Assessment',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    login: 'Login',
    signup: 'Sign Up',
    or: 'or'
  },
  hi: {
    appName: 'विठल AI असिस्टेंस',
    tagline: 'आपका AI-संचालित करियर प्लानिंग साथी',
    heroTitle: 'AI के साथ अपना सही करियर पाथ खोजें',
    heroSubtitle: 'भारतीय युवाओं के लिए व्यक्तिगत करियर मार्गदर्शन, नौकरी सुझाव और कौशल विकास योजनाएं प्राप्त करें',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    howItWorks: 'यह कैसे काम करता है',
    features: 'विशेषताएं',
    testimonials: 'प्रशंसापत्र',
    contact: 'संपर्क',
    step1Title: 'अपने कौशल साझा करें',
    step1Desc: 'हमें अपनी रुचियों, कौशल और करियर लक्ष्यों के बारे में बताएं',
    step2Title: 'AI विश्लेषण',
    step2Desc: 'हमारी AI बाजार के रुझान का विश्लेषण करती है और आपकी प्रोफाइल से मेल खाती है',
    step3Title: 'सुझाव प्राप्त करें',
    step3Desc: 'व्यक्तिगत करियर पथ और विकास योजनाएं प्राप्त करें',
    feature1Title: 'AI-संचालित मार्गदर्शन',
    feature1Desc: 'उन्नत एल्गोरिदम व्यक्तिगत करियर सुझाव प्रदान करते हैं',
    feature2Title: 'बाजार अंतर्दृष्टि',
    feature2Desc: 'वास्तविक समय नौकरी बाजार विश्लेषण और ट्रेंडिंग अवसर',
    feature3Title: 'कौशल विकास',
    feature3Desc: 'आपकी क्षमताओं को बढ़ाने के लिए अनुकूलित सीखने के रास्ते',
    startAssessment: 'करियर आकलन शुरू करें',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    login: 'लॉगिन',
    signup: 'साइन अप',
    or: 'या'
  },
  mr: {
    appName: 'विठल AI असिस्टन्स',
    tagline: 'तुमचा AI-चालित करिअर प्लॅनिंग साथी',
    heroTitle: 'AI सह तुमचा योग्य करिअर मार्ग शोधा',
    heroSubtitle: 'भारतीय तरुणांसाठी वैयक्तिक करिअर मार्गदर्शन, नोकरी शिफारसी आणि कौशल्य विकास योजना मिळवा',
    getStarted: 'सुरुवात करा',
    learnMore: 'अधिक जाणा',
    howItWorks: 'हे कसे काम करते',
    features: 'वैशिष्ट्ये',
    testimonials: 'प्रशंसापत्रे',
    contact: 'संपर्क',
    step1Title: 'तुमची कौशल्ये सामायिक करा',
    step1Desc: 'तुमच्या आवडी, कौशल्ये आणि करिअर आकांक्षांबद्दल आम्हाला सांगा',
    step2Title: 'AI विश्लेषण',
    step2Desc: 'आमची AI बाजार प्रवृत्तींचे विश्लेषण करते आणि तुमच्या प्रोफाइलशी जुळते',
    step3Title: 'शिफारसी मिळवा',
    step3Desc: 'वैयक्तिक करिअर मार्ग आणि विकास योजना प्राप्त करा',
    feature1Title: 'AI-चालित मार्गदर्शन',
    feature1Desc: 'प्रगत अल्गोरिदम वैयक्तिक करिअर शिफारसी प्रदान करतात',
    feature2Title: 'बाजार अंतर्दृष्टी',
    feature2Desc: 'वास्तविक वेळ नोकरी बाजार विश्लेषण आणि ट्रेंडिंग संधी',
    feature3Title: 'कौशल्य विकास',
    feature3Desc: 'तुमच्या क्षमता वाढवण्यासाठी सानुकूलित शिकण्याचे मार्ग',
    startAssessment: 'करिअर मूल्यांकन सुरू करा',
    emailPlaceholder: 'तुमचा ईमेल प्रविष्ट करा',
    passwordPlaceholder: 'तुमचा पासवर्ड प्रविष्ट करा',
    login: 'लॉगिन',
    signup: 'साइन अप',
    or: 'किंवा'
  }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return {
    language,
    setLanguage,
    t
  };
};