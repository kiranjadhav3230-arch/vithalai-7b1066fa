import React, { useRef } from 'react';
import { ChevronLeft, Download, Share2, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import vithalLogo from '@/assets/vithal-pin-logo.png';

interface RightsCertificateProps {
  userName: string;
  topicName: string;
  score: number;
  totalQuestions: number;
  date: string;
  onBack: () => void;
}

export const RightsCertificate: React.FC<RightsCertificateProps> = ({
  userName,
  topicName,
  score,
  totalQuestions,
  date,
  onBack
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const getLocalizedText = (en: string, hi: string, mr: string) => {
    switch (language) {
      case 'hi': return hi;
      case 'mr': return mr;
      default: return en;
    }
  };

  const percentage = Math.round((score / totalQuestions) * 100);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      // Create a canvas from the certificate
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      // Convert to image and download
      const link = document.createElement('a');
      link.download = `Vithal_AI_Certificate_${userName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: getLocalizedText('Certificate Downloaded!', 'प्रमाणपत्र डाउनलोड हो गया!', 'प्रमाणपत्र डाउनलोड झाले!'),
        description: getLocalizedText('Check your downloads folder', 'अपना डाउनलोड फ़ोल्डर देखें', 'तुमचा डाउनलोड फोल्डर तपासा'),
      });
    } catch (error) {
      toast({
        title: getLocalizedText('Download Failed', 'डाउनलोड विफल', 'डाउनलोड अयशस्वी'),
        description: getLocalizedText('Please try again', 'कृपया पुनः प्रयास करें', 'कृपया पुन्हा प्रयत्न करा'),
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getLocalizedText(
            'My Rights Certificate - Vithal AI',
            'मेरा अधिकार प्रमाणपत्र - विठ्ठल AI',
            'माझे हक्क प्रमाणपत्र - विठ्ठल AI'
          ),
          text: getLocalizedText(
            `I completed the ${topicName} course on Vithal AI and scored ${percentage}%! 🎓`,
            `मैंने विठ्ठल AI पर ${topicName} कोर्स पूरा किया और ${percentage}% स्कोर किया! 🎓`,
            `मी विठ्ठल AI वर ${topicName} कोर्स पूर्ण केला आणि ${percentage}% गुण मिळवले! 🎓`
          ),
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      toast({
        title: getLocalizedText('Share not supported', 'शेयर समर्थित नहीं', 'शेअर समर्थित नाही'),
        description: getLocalizedText(
          'Download the certificate and share manually',
          'प्रमाणपत्र डाउनलोड करें और मैन्युअल रूप से साझा करें',
          'प्रमाणपत्र डाउनलोड करा आणि मॅन्युअली शेअर करा'
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">
          {getLocalizedText('Your Certificate', 'आपका प्रमाणपत्र', 'तुमचे प्रमाणपत्र')}
        </h1>
      </div>

      {/* Certificate */}
      <div 
        ref={certificateRef}
        className="mx-auto mb-6 max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-50 shadow-2xl"
        style={{ aspectRatio: '1/1.4' }}
      >
        {/* Certificate Border */}
        <div className="relative h-full w-full border-8 border-double border-amber-600/30 p-4">
          {/* Decorative corners */}
          <div className="absolute left-2 top-2 h-8 w-8 border-l-4 border-t-4 border-amber-600/50" />
          <div className="absolute right-2 top-2 h-8 w-8 border-r-4 border-t-4 border-amber-600/50" />
          <div className="absolute bottom-2 left-2 h-8 w-8 border-b-4 border-l-4 border-amber-600/50" />
          <div className="absolute bottom-2 right-2 h-8 w-8 border-b-4 border-r-4 border-amber-600/50" />

          {/* Content */}
          <div className="flex h-full flex-col items-center justify-between py-4 text-center">
            {/* Header */}
            <div>
              <div className="mb-2 flex items-center justify-center gap-2">
                <img 
                  src={vithalLogo} 
                  alt="Vithal AI" 
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-amber-800">Vithal AI</h2>
                  <p className="text-xs text-amber-600">Rights Awareness Platform</p>
                </div>
              </div>
              
              <div className="my-3 flex items-center justify-center">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <Star className="mx-2 h-4 w-4 text-amber-500" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              </div>

              <h1 className="mb-1 text-2xl font-bold tracking-wide text-amber-900">
                {getLocalizedText('CERTIFICATE', 'प्रमाणपत्र', 'प्रमाणपत्र')}
              </h1>
              <p className="text-sm text-amber-700">
                {getLocalizedText('of Achievement', 'उपलब्धि का', 'कर्तृत्वाचे')}
              </p>
            </div>

            {/* Award Icon */}
            <div className="my-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                  ✓
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="mb-4">
              <p className="mb-1 text-sm text-amber-700">
                {getLocalizedText('This is to certify that', 'यह प्रमाणित किया जाता है कि', 'हे प्रमाणित केले जाते की')}
              </p>
              <h3 className="mb-2 border-b-2 border-amber-400 px-4 pb-1 text-2xl font-bold text-amber-900">
                {userName}
              </h3>
              <p className="text-sm text-amber-700">
                {getLocalizedText(
                  'has successfully completed the',
                  'ने सफलतापूर्वक पूरा किया',
                  'ने यशस्वीरित्या पूर्ण केले'
                )}
              </p>
              <p className="mt-1 font-semibold text-amber-800">{topicName}</p>
              <p className="text-sm text-amber-700">
                {getLocalizedText('course with a score of', 'कोर्स के साथ स्कोर', 'कोर्स गुणांसह')}
              </p>
              <p className="text-2xl font-bold text-green-600">{percentage}%</p>
            </div>

            {/* Date & Signature */}
            <div className="w-full">
              <div className="flex items-center justify-center gap-1 text-xs text-amber-600">
                <span>{getLocalizedText('Issued on:', 'जारी तिथि:', 'जारी तारीख:')}</span>
                <span>{date}</span>
              </div>
              
              <div className="mt-3 flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="mb-1 h-px w-24 bg-amber-400" />
                  <p className="text-xs text-amber-600">Vithal AI</p>
                </div>
              </div>
              
              <p className="mt-2 text-[10px] text-amber-500">
                {getLocalizedText(
                  'Certificate ID: VA-' + Date.now().toString(36).toUpperCase(),
                  'प्रमाणपत्र आईडी: VA-' + Date.now().toString(36).toUpperCase(),
                  'प्रमाणपत्र आयडी: VA-' + Date.now().toString(36).toUpperCase()
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-auto flex max-w-md gap-3">
        <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          {getLocalizedText('Share', 'शेयर करें', 'शेअर करा')}
        </Button>
        <Button className="flex-1 gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          {getLocalizedText('Download', 'डाउनलोड', 'डाउनलोड')}
        </Button>
      </div>

      {/* Info */}
      <p className="mx-auto mt-4 max-w-md text-center text-xs text-muted-foreground">
        {getLocalizedText(
          'This certificate validates your knowledge of legal rights in India.',
          'यह प्रमाणपत्र भारत में कानूनी अधिकारों के आपके ज्ञान को मान्य करता है।',
          'हे प्रमाणपत्र भारतातील कायदेशीर हक्कांबद्दलचे तुमचे ज्ञान प्रमाणित करते.'
        )}
      </p>
    </div>
  );
};
