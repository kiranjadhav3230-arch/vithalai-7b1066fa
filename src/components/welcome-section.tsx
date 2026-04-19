import React, { useState, useEffect, useMemo } from 'react';

interface WelcomeSectionProps {
  language: string;
  onSuggestionClick: (suggestion: string) => void;
}

const allSuggestions = {
  en: [
    { icon: '📚', text: 'Help me study for my exams' },
    { icon: '🎯', text: 'Give me career guidance' },
    { icon: '💻', text: 'Teach me programming' },
    { icon: '📝', text: 'Help me write an essay' },
    { icon: '🧮', text: 'Solve a math problem' },
    { icon: '🔬', text: 'Explain a science concept' },
    { icon: '📊', text: 'Help me with data analysis' },
    { icon: '🎨', text: 'Give me creative ideas' },
    { icon: '💼', text: 'Prepare me for an interview' },
    { icon: '🌐', text: 'Help me learn English' },
    { icon: '💪', text: 'Give me health tips' },
    { icon: '🗣️', text: 'Teach me a new language' },
    { icon: '💰', text: 'Give me business advice' },
    { icon: '🧘', text: 'Help me with meditation' },
    { icon: '🍳', text: 'Share cooking recipes' },
    { icon: '✈️', text: 'Plan my travel itinerary' },
    { icon: '💡', text: 'Help me start a startup' },
    { icon: '📖', text: 'Recommend books to read' },
  ],
  hi: [
    { icon: '📚', text: 'परीक्षा की तैयारी में मदद करो' },
    { icon: '🎯', text: 'करियर गाइडेंस दो' },
    { icon: '💻', text: 'प्रोग्रामिंग सिखाओ' },
    { icon: '📝', text: 'निबंध लिखने में मदद करो' },
    { icon: '🧮', text: 'गणित का सवाल हल करो' },
    { icon: '🔬', text: 'विज्ञान समझाओ' },
    { icon: '📊', text: 'डेटा एनालिसिस में मदद करो' },
    { icon: '🎨', text: 'क्रिएटिव आइडियाज दो' },
    { icon: '💼', text: 'इंटरव्यू की तैयारी कराओ' },
    { icon: '🌐', text: 'अंग्रेजी सीखने में मदद करो' },
    { icon: '💪', text: 'स्वास्थ्य टिप्स दो' },
    { icon: '🗣️', text: 'नई भाषा सिखाओ' },
    { icon: '💰', text: 'बिज़नेस सलाह दो' },
    { icon: '🧘', text: 'ध्यान करने में मदद करो' },
    { icon: '🍳', text: 'रेसिपी बताओ' },
    { icon: '✈️', text: 'यात्रा की योजना बनाओ' },
    { icon: '💡', text: 'स्टार्टअप शुरू करने में मदद करो' },
    { icon: '📖', text: 'पढ़ने के लिए किताबें सुझाओ' },
  ],
  mr: [
    { icon: '📚', text: 'परीक्षेची तयारी करायला मदत करा' },
    { icon: '🎯', text: 'करिअर मार्गदर्शन द्या' },
    { icon: '💻', text: 'प्रोग्रामिंग शिकवा' },
    { icon: '📝', text: 'निबंध लिहायला मदत करा' },
    { icon: '🧮', text: 'गणिताचा प्रश्न सोडवा' },
    { icon: '🔬', text: 'विज्ञान समजावून सांगा' },
    { icon: '📊', text: 'डेटा एनालिसिसमध्ये मदत करा' },
    { icon: '🎨', text: 'क्रिएटिव्ह आयडियाज द्या' },
    { icon: '💼', text: 'मुलाखतीची तयारी करा' },
    { icon: '🌐', text: 'इंग्रजी शिकायला मदत करा' },
    { icon: '💪', text: 'आरोग्य टिप्स द्या' },
    { icon: '🗣️', text: 'नवीन भाषा शिकवा' },
    { icon: '💰', text: 'व्यवसाय सल्ला द्या' },
    { icon: '🧘', text: 'ध्यान करायला मदत करा' },
    { icon: '🍳', text: 'पाककृती सांगा' },
    { icon: '✈️', text: 'प्रवास नियोजन करा' },
    { icon: '💡', text: 'स्टार्टअप सुरू करायला मदत करा' },
    { icon: '📖', text: 'वाचण्यासाठी पुस्तके सुचवा' },
  ],
};

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ language, onSuggestionClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get random suggestions - memoized to stay consistent during session
  const suggestions = useMemo(() => {
    const langSuggestions = allSuggestions[language as keyof typeof allSuggestions] || allSuggestions.en;
    // Shuffle and pick 4 random suggestions
    const shuffled = [...langSuggestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full flex-1 py-10 px-4">
      {/* Logo with steady orange ring (no blink) */}
      <div 
        className={`relative w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-full p-1 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'
        }`}
        style={{ transitionDelay: '0ms' }}
      >
        <div className="absolute inset-0 rounded-full ring-2 ring-primary/40 shadow-[0_0_30px_hsl(25_100%_55%/0.25)]" />
        <img 
          src="/lovable-uploads/41c38d97508445bab63b1cf32b4c255d-removebg-preview.png" 
          alt="Vithal AI" 
          className="relative w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
      
      {/* Welcome Title with staggered animation */}
      <h2 
        className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 gradient-text-orange text-center transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '150ms' }}
      >
        Welcome to Vithal AI
      </h2>
      
      {/* Subtitle with staggered animation */}
      <p 
        className={`text-foreground/50 text-sm sm:text-base mb-6 text-center max-w-md transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '300ms' }}
      >
        {language === 'hi' ? 'अपना सवाल नीचे टाइप करें या सुझाव चुनें' : 
         language === 'mr' ? 'तुमचा प्रश्न खाली टाइप करा किंवा सूचना निवडा' : 
         'Type your question below or pick a suggestion'}
      </p>

      {/* Suggestion Chips with staggered animation */}
      <div 
        className={`flex flex-wrap justify-center gap-2 mb-8 max-w-lg transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '450ms' }}
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className={`glass-card flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm text-foreground/80 hover:text-foreground transition-all duration-300 hover:scale-105 active:scale-95 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${500 + index * 80}ms` }}
          >
            <span>{suggestion.icon}</span>
            <span>{suggestion.text}</span>
          </button>
        ))}
      </div>
      
      {/* Credits with staggered animation */}
      <div 
        className={`flex flex-col items-center gap-1 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '800ms' }}
      >
        <p className="text-xs text-foreground/40 text-center">
          Powered by <span className="text-orange-500 font-medium">Gemini AI</span>
        </p>
        <p className="text-xs text-foreground/40 text-center">
          Developed By <span className="text-orange-400 font-medium">Kapil Kiran Jadhav</span>
        </p>
        <p className="text-xs text-foreground/40 text-center mt-1">
          Sponsored By{' '}
          <a 
            href="https://www.instagram.com/shreealankar2112?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300 hover:underline"
          >
            Shree Alankar
          </a>
        </p>
      </div>
    </div>
  );
};
