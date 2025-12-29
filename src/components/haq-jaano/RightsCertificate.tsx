import React, { useRef } from 'react';
import { Award, Download, Share2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import vithalLogo from '@/assets/vithal-pin-logo.png';

interface RightsCertificateProps {
  userName: string;
  topic: 'fundamental_rights' | 'consumer_rights' | 'women_rights' | 'police_rights';
  score: number;
  totalQuestions: number;
  onBack: () => void;
  onRetry: () => void;
}

export const RightsCertificate: React.FC<RightsCertificateProps> = ({
  userName,
  topic,
  score,
  totalQuestions,
  onBack,
  onRetry
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);
  const passed = score >= Math.ceil(totalQuestions * 0.6);
  const percentage = Math.round((score / totalQuestions) * 100);
  const date = new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getTopicName = () => {
    const topics = {
      fundamental_rights: { en: 'Fundamental Rights of India', hi: 'भारत के मौलिक अधिकार', mr: 'भारताचे मूलभूत अधिकार' },
      consumer_rights: { en: 'Consumer Rights', hi: 'उपभोक्ता अधिकार', mr: 'ग्राहक अधिकार' },
      women_rights: { en: 'Women Rights & Safety', hi: 'महिला अधिकार और सुरक्षा', mr: 'महिला अधिकार आणि सुरक्षा' },
      police_rights: { en: 'Rights with Police', hi: 'पुलिस के साथ अधिकार', mr: 'पोलिसांसोबत अधिकार' }
    };
    return topics[topic]?.[language as keyof typeof topics.fundamental_rights] || topics[topic]?.en;
  };

  const getCertificateTitle = () => {
    switch (language) {
      case 'hi': return 'उपलब्धि प्रमाणपत्र';
      case 'mr': return 'उपलब्धी प्रमाणपत्र';
      default: return 'Certificate of Achievement';
    }
  };

  const getCertificateText = () => {
    switch (language) {
      case 'hi': 
        return `यह प्रमाणित किया जाता है कि ${userName} ने ${getTopicName()} के विषय में ज्ञान परीक्षा में ${percentage}% अंक प्राप्त करके सफलतापूर्वक उत्तीर्ण किया है।`;
      case 'mr': 
        return `हे प्रमाणित केले जाते की ${userName} ने ${getTopicName()} या विषयावरील ज्ञान परीक्षेत ${percentage}% गुण मिळवून यशस्वीरित्या उत्तीर्ण झाले आहे.`;
      default: 
        return `This is to certify that ${userName} has successfully passed the knowledge assessment on ${getTopicName()} with a score of ${percentage}%.`;
    }
  };

  const getFailureText = () => {
    switch (language) {
      case 'hi': 
        return `आपने ${percentage}% अंक प्राप्त किए। उत्तीर्ण होने के लिए 60% की आवश्यकता है। कृपया पुनः प्रयास करें।`;
      case 'mr': 
        return `तुम्ही ${percentage}% गुण मिळवले. उत्तीर्ण होण्यासाठी 60% आवश्यक आहे. कृपया पुन्हा प्रयत्न करा.`;
      default: 
        return `You scored ${percentage}%. You need 60% to pass. Please try again.`;
    }
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      // Create a canvas from the certificate
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `Vithal_AI_Certificate_${userName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: language === 'hi' ? 'डाउनलोड हो गया!' : language === 'mr' ? 'डाउनलोड झाले!' : 'Downloaded!',
        description: language === 'hi' ? 'प्रमाणपत्र सहेजा गया' : language === 'mr' ? 'प्रमाणपत्र जतन झाले' : 'Certificate saved'
      });
    } catch (error) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'डाउनलोड विफल' : language === 'mr' ? 'डाउनलोड अयशस्वी' : 'Download failed',
        variant: 'destructive'
      });
    }
  };

  const handleShare = async () => {
    const shareText = language === 'hi' 
      ? `मैंने Vithal AI पर ${getTopicName()} की परीक्षा ${percentage}% अंकों के साथ पास की! 🎓`
      : language === 'mr'
      ? `मी Vithal AI वर ${getTopicName()} परीक्षा ${percentage}% गुणांसह उत्तीर्ण झालो! 🎓`
      : `I passed the ${getTopicName()} exam with ${percentage}% on Vithal AI! 🎓`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vithal AI Certificate',
          text: shareText
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: language === 'hi' ? 'कॉपी हो गया!' : language === 'mr' ? 'कॉपी झाले!' : 'Copied!',
        description: language === 'hi' ? 'शेयर टेक्स्ट कॉपी हुआ' : language === 'mr' ? 'शेअर टेक्स्ट कॉपी झाला' : 'Share text copied'
      });
    }
  };

  if (!passed) {
    return (
      <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <span className="text-4xl">😔</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {language === 'hi' ? 'पुनः प्रयास करें' : language === 'mr' ? 'पुन्हा प्रयत्न करा' : 'Try Again'}
            </h2>
            <p className="text-muted-foreground">{getFailureText()}</p>
          </div>

          <div className="text-4xl font-bold text-destructive mb-6">
            {score}/{totalQuestions}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back'}
            </Button>
            <Button onClick={onRetry} className="flex-1">
              {language === 'hi' ? 'पुनः सीखें' : language === 'mr' ? 'पुन्हा शिका' : 'Learn Again'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        {language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back'}
      </Button>

      {/* Certificate */}
      <div 
        ref={certificateRef}
        className="bg-white rounded-xl border-4 border-double border-amber-500 p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src={vithalLogo} 
              alt="Vithal AI" 
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-amber-700">Vithal AI</h1>
              <p className="text-sm text-amber-600">Rights Awareness Platform</p>
            </div>
          </div>
          
          <div className="border-b-2 border-amber-400 pb-4 mb-4">
            <Award className="h-12 w-12 text-amber-500 mx-auto mb-2" />
            <h2 className="text-3xl font-serif font-bold text-gray-800">
              {getCertificateTitle()}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 mb-6">
          <p className="text-gray-600">
            {language === 'hi' ? 'यह प्रमाणपत्र प्रदान किया जाता है' : 
             language === 'mr' ? 'हे प्रमाणपत्र प्रदान केले जाते' : 
             'This certificate is presented to'}
          </p>
          
          <h3 className="text-4xl font-serif font-bold text-amber-700 py-2 border-b border-amber-300 inline-block px-8">
            {userName}
          </h3>
          
          <p className="text-gray-700 max-w-md mx-auto leading-relaxed">
            {getCertificateText()}
          </p>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 inline-block">
            <div className="text-5xl font-bold text-amber-600">{percentage}%</div>
            <div className="text-sm text-amber-700">
              {score}/{totalQuestions} {language === 'hi' ? 'सही उत्तर' : language === 'mr' ? 'बरोबर उत्तरे' : 'Correct Answers'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pt-6 border-t border-amber-200">
          <div className="text-left">
            <p className="text-xs text-gray-500">
              {language === 'hi' ? 'जारी तिथि' : language === 'mr' ? 'जारी तारीख' : 'Date of Issue'}
            </p>
            <p className="font-medium text-gray-700">{date}</p>
          </div>
          
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 px-8">
              <p className="text-sm font-medium text-gray-700">Vithal AI</p>
              <p className="text-xs text-gray-500">
                {language === 'hi' ? 'डिजिटल हस्ताक्षर' : language === 'mr' ? 'डिजिटल स्वाक्षरी' : 'Digital Signature'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {language === 'hi' ? 'प्रमाणपत्र आईडी' : language === 'mr' ? 'प्रमाणपत्र आयडी' : 'Certificate ID'}
            </p>
            <p className="font-mono text-xs text-gray-700">
              VIT-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 max-w-2xl mx-auto mt-6">
        <Button variant="outline" onClick={handleShare} className="flex-1 gap-2">
          <Share2 className="h-4 w-4" />
          {language === 'hi' ? 'शेयर करें' : language === 'mr' ? 'शेअर करा' : 'Share'}
        </Button>
        <Button onClick={handleDownload} className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          {language === 'hi' ? 'डाउनलोड करें' : language === 'mr' ? 'डाउनलोड करा' : 'Download'}
        </Button>
      </div>
    </div>
  );
};
