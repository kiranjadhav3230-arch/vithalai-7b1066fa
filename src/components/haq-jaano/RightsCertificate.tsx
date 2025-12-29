import React, { useRef, useEffect, useState } from 'react';
import { Award, Download, Share2, ChevronLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import vithalLogo from '@/assets/vithal-pin-logo.png';
import confetti from 'canvas-confetti';
import { LeaderboardSubmitModal } from './LeaderboardSubmitModal';

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
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  const certificateIdRef = useRef(`VIT-${Date.now().toString(36).toUpperCase()}`);

  const safeScore = Number.isFinite(score) ? score : 0;
  const safeTotalQuestions = Number.isFinite(totalQuestions) ? totalQuestions : 0;

  const percentage =
    safeTotalQuestions > 0 ? Math.round((safeScore / safeTotalQuestions) * 100) : 0;

  const passed =
    safeTotalQuestions > 0 && safeScore >= Math.ceil(safeTotalQuestions * 0.6);

  // Confetti animation when certificate is displayed (passed)
  useEffect(() => {
    if (passed) {
      // Fire confetti from both sides
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        // Left side confetti
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']
        });
        // Right side confetti
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Center burst after a delay
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
        });
      }, 500);
    }
  }, [passed]);

  const date = new Date().toLocaleDateString(
    language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );
  const isMr = language === 'mr';

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

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      } as const)[c] ?? c
    );

  const buildCertificatePrintHtml = () => {
    const safeUserName = escapeHtml(userName);
    const safeTopicName = escapeHtml(getTopicName());
    const safeTitle = escapeHtml(getCertificateTitle());
    const safeText = escapeHtml(getCertificateText());

    const correctLabel =
      language === 'hi'
        ? 'सही उत्तर'
        : language === 'mr'
          ? 'बरोबर उत्तरे'
          : 'Correct Answers';

    const dateLabel =
      language === 'hi'
        ? 'जारी तिथि'
        : language === 'mr'
          ? 'जारी तारीख'
          : 'Date of Issue';

    const idLabel =
      language === 'hi'
        ? 'प्रमाणपत्र आईडी'
        : language === 'mr'
          ? 'प्रमाणपत्र आयडी'
          : 'Certificate ID';

    const certificateIntro =
      language === 'hi'
        ? 'यह प्रमाणपत्र प्रदान किया जाता है'
        : language === 'mr'
          ? 'हे प्रमाणपत्र प्रदान केले जाते'
          : 'This certificate is presented to';

    // Use HSL values only (matches our design-system format)
    const css = `
      :root {
        --cert-paper: 0 0% 100%;
        --cert-ink: 0 0% 10%;
        --cert-muted: 0 0% 42%;
        --cert-accent: 25 95% 53%;
      }

      * { box-sizing: border-box; }
      html, body { height: 100%; }

      body {
        margin: 0;
        padding: 24px;
        background: hsl(var(--cert-paper));
        color: hsl(var(--cert-ink));
        font-family: 'Mukta','Noto Sans Devanagari','Noto Sans',system-ui,sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      @page {
        size: A4;
        margin: 12mm;
      }

      .sheet {
        max-width: 980px;
        margin: 0 auto;
        border: 4px double hsl(var(--cert-accent));
        border-radius: 16px;
        padding: 32px;
      }

      .header {
        text-align: center;
        margin-bottom: 24px;
      }

      .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: 18px;
      }

      .logo {
        width: 64px;
        height: 64px;
        border-radius: 999px;
        object-fit: cover;
      }

      .brand h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        color: hsl(var(--cert-accent));
      }

      .brand p {
        margin: 2px 0 0;
        font-size: 13px;
        color: hsl(var(--cert-muted));
      }

      .titleWrap {
        padding-bottom: 16px;
        border-bottom: 2px solid hsl(var(--cert-accent) / 0.5);
      }

      .title {
        margin: 0;
        font-size: 34px;
        font-weight: 700;
        font-family: 'Tiro Devanagari Marathi','Mukta','Noto Sans Devanagari',serif;
        letter-spacing: 0.2px;
      }

      .content {
        text-align: center;
        margin: 24px 0;
      }

      .intro {
        margin: 0 0 10px;
        color: hsl(var(--cert-muted));
        font-size: 15px;
      }

      .name {
        margin: 0 auto 14px;
        display: inline-block;
        font-family: 'Tiro Devanagari Marathi','Mukta','Noto Sans Devanagari',serif;
        font-size: 40px;
        font-weight: 700;
        color: hsl(var(--cert-accent));
        padding: 6px 22px 8px;
        border-bottom: 1px solid hsl(var(--cert-accent) / 0.5);
      }

      .text {
        max-width: 760px;
        margin: 0 auto 18px;
        font-size: 16px;
        line-height: 1.8;
      }

      .scoreBox {
        display: inline-block;
        background: hsl(var(--cert-accent) / 0.12);
        border: 1px solid hsl(var(--cert-accent) / 0.28);
        border-radius: 12px;
        padding: 14px 18px;
      }

      .percent {
        font-size: 56px;
        font-weight: 800;
        line-height: 1;
        color: hsl(var(--cert-accent));
      }

      .correct {
        margin-top: 6px;
        font-size: 14px;
        color: hsl(var(--cert-ink));
      }

      .footer {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        border-top: 1px solid hsl(var(--cert-accent) / 0.25);
        padding-top: 18px;
        margin-top: 26px;
        font-size: 14px;
      }

      .label {
        font-size: 12px;
        color: hsl(var(--cert-muted));
        margin-bottom: 4px;
      }

      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        font-size: 12px;
      }

      .topic {
        margin-top: 10px;
        font-size: 12px;
        color: hsl(var(--cert-muted));
      }
    `;

    const certificateId = escapeHtml(certificateIdRef.current);

    return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle} - ${safeUserName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Tiro+Devanagari+Marathi:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>${css}</style>
</head>
<body>
  <main class="sheet">
    <header class="header">
      <div class="brand">
        <img class="logo" src="${vithalLogo}" alt="Vithal AI logo" />
        <div>
          <h1>Vithal AI</h1>
          <p>Rights Awareness Platform</p>
        </div>
      </div>

      <div class="titleWrap">
        <h2 class="title">${safeTitle}</h2>
        <div class="topic">${safeTopicName}</div>
      </div>
    </header>

    <section class="content">
      <p class="intro">${certificateIntro}</p>
      <div class="name">${safeUserName}</div>
      <p class="text">${safeText}</p>

      <div class="scoreBox">
        <div class="percent">${percentage}%</div>
        <div class="correct">${safeScore}/${safeTotalQuestions} ${correctLabel}</div>
      </div>
    </section>

    <footer class="footer">
      <div>
        <div class="label">${dateLabel}</div>
        <div>${escapeHtml(date)}</div>
      </div>
      <div style="text-align:right">
        <div class="label">${idLabel}</div>
        <div class="mono">${certificateId}</div>
      </div>
    </footer>
  </main>

  <script>
    window.addEventListener('afterprint', () => window.close());
  </script>
</body>
</html>`;
  };

  const handleDownloadPdf = async () => {
    const printWindow = window.open('about:blank', '_blank');
    if (!printWindow) {
      toast({
        variant: 'destructive',
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description:
          language === 'hi'
            ? 'PDF डाउनलोड के लिए पॉप-अप अनुमति दें'
            : language === 'mr'
              ? 'PDF डाउनलोडसाठी पॉप-अप परवानगी द्या'
              : 'Please allow popups to download the PDF',
      });
      return;
    }

    try {
      const htmlContent = buildCertificatePrintHtml();
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for fonts & images in the new window before printing
      const waitForAssets = async () => {
        // Fonts
        try {
          await printWindow.document.fonts?.ready;
        } catch {
          // ignore
        }

        // Images
        const imgs = Array.from(printWindow.document.images || []);
        await Promise.all(
          imgs.map(
            (img) =>
              img.complete
                ? Promise.resolve()
                : new Promise<void>((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                  })
          )
        );
      };

      setTimeout(async () => {
        try {
          await waitForAssets();
        } finally {
          printWindow.focus();
          printWindow.print();
        }
      }, 250);

      toast({
        title: language === 'hi' ? 'PDF तैयार है' : language === 'mr' ? 'PDF तयार आहे' : 'PDF ready',
        description:
          language === 'hi'
            ? 'प्रिंट डायलॉग में “Save as PDF” चुनें'
            : language === 'mr'
              ? 'प्रिंट डायलॉगमध्ये “Save as PDF” निवडा'
              : 'In the print dialog, choose “Save as PDF”',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'PDF बन नहीं सका' : language === 'mr' ? 'PDF बनू शकले नाही' : 'Could not create PDF',
      });
    }
  };

  const handleShare = async () => {
    const shareText = language === 'hi'
      ? `मैंने Vithal AI पर ${getTopicName()} की परीक्षा ${percentage}% अंकों के साथ पास की! 🎓`
      : language === 'mr'
        ? `मी Vithal AI वर ${getTopicName()} परीक्षा ${percentage}% गुणांसह उत्तीर्ण झालो! 🎓`
        : `I passed the ${getTopicName()} exam with ${percentage}% on Vithal AI! 🎓`;

    const copyFallback = async () => {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: language === 'hi' ? 'कॉपी हो गया!' : language === 'mr' ? 'कॉपी झाले!' : 'Copied!',
          description: language === 'hi' ? 'शेयर टेक्स्ट कॉपी हुआ' : language === 'mr' ? 'शेअर टेक्स्ट कॉपी झाला' : 'Share text copied'
        });
        return;
      } catch {
        const ta = document.createElement('textarea');
        ta.value = shareText;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();

        toast({
          title: ok
            ? (language === 'hi' ? 'कॉपी हो गया!' : language === 'mr' ? 'कॉपी झाले!' : 'Copied!')
            : (language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error'),
          description: ok
            ? (language === 'hi' ? 'शेयर टेक्स्ट कॉपी हुआ' : language === 'mr' ? 'शेअर टेक्स्ट कॉपी झाला' : 'Share text copied')
            : (language === 'hi' ? 'कॉपी नहीं हो सका' : language === 'mr' ? 'कॉपी अयशस्वी' : 'Could not copy'),
          variant: ok ? undefined : 'destructive'
        });
      }
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vithal AI Certificate',
          text: shareText
        });
        toast({
          title: language === 'hi' ? 'शेयर हो गया!' : language === 'mr' ? 'शेअर झाले!' : 'Shared!',
          description: language === 'hi' ? 'प्रमाणपत्र संदेश शेयर हुआ' : language === 'mr' ? 'प्रमाणपत्र संदेश शेअर झाला' : 'Certificate message shared'
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') return;
        await copyFallback();
        return;
      }
    }

    await copyFallback();
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
            {safeScore}/{safeTotalQuestions}
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
        className={cn(
          "bg-white rounded-xl border-4 border-double border-amber-500 p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto",
          isMr && "font-cert-mr-body"
        )}
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
            <h2 className={cn("text-3xl font-bold text-gray-800", isMr ? "font-cert-mr" : "font-serif")}>
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
          
          <h3 className={cn(
            "text-4xl font-bold text-amber-700 py-2 border-b border-amber-300 inline-block px-8",
            isMr ? "font-cert-mr" : "font-serif"
          )}>
            {userName}
          </h3>
          
          <p className="text-gray-700 max-w-md mx-auto leading-relaxed">
            {getCertificateText()}
          </p>

          <div className="bg-primary/10 rounded-lg p-4 inline-block">
            <div className="text-5xl font-bold text-primary">{percentage}%</div>
            <div className="text-sm text-primary/80">
              {safeScore}/{safeTotalQuestions}{' '}
              {language === 'hi'
                ? 'सही उत्तर'
                : language === 'mr'
                  ? 'बरोबर उत्तरे'
                  : 'Correct Answers'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pt-6 border-t border-amber-200 gap-4">
          <div className="text-left">
            <p className="text-xs text-gray-500">
              {language === 'hi' ? 'जारी तिथि' : language === 'mr' ? 'जारी तारीख' : 'Date of Issue'}
            </p>
            <p className="font-medium text-gray-700">{date}</p>
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
      <div className="flex flex-col gap-3 max-w-2xl mx-auto mt-6">
        <Button onClick={() => setShowLeaderboardModal(true)} variant="default" className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600 text-black">
          <Trophy className="h-4 w-4" />
          {language === 'hi' ? 'लीडरबोर्ड में जोड़ें' : language === 'mr' ? 'लीडरबोर्डवर जोडा' : 'Join Leaderboard'}
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare} className="flex-1 gap-2">
            <Share2 className="h-4 w-4" />
            {language === 'hi' ? 'शेयर करें' : language === 'mr' ? 'शेअर करा' : 'Share'}
          </Button>
          <Button onClick={handleDownloadPdf} className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            {language === 'hi' ? 'PDF डाउनलोड करें' : language === 'mr' ? 'PDF डाउनलोड करा' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Leaderboard Submit Modal */}
      <LeaderboardSubmitModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        topic={topic}
        score={safeScore}
        totalQuestions={safeTotalQuestions}
        defaultName={userName}
      />
    </div>
  );
};
