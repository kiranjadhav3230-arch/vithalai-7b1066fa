import React from 'react';
import { BookOpen, Scale, Users, Briefcase, GraduationCap, Gavel } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FundamentalRight {
  id: string;
  icon: React.ReactNode;
  article: string;
  title: {
    en: string;
    hi: string;
    mr: string;
  };
  description: {
    en: string;
    hi: string;
    mr: string;
  };
  keyPoints: {
    en: string[];
    hi: string[];
    mr: string[];
  };
}

const fundamentalRights: FundamentalRight[] = [
  {
    id: 'equality',
    icon: <Scale className="h-5 w-5" />,
    article: '14-18',
    title: {
      en: 'Right to Equality',
      hi: 'समानता का अधिकार',
      mr: 'समानतेचा अधिकार',
    },
    description: {
      en: 'Guarantees equality before law and prohibits discrimination based on religion, race, caste, sex, or place of birth.',
      hi: 'कानून के समक्ष समानता की गारंटी देता है और धर्म, जाति, लिंग या जन्मस्थान के आधार पर भेदभाव को प्रतिबंधित करता है।',
      mr: 'कायद्यासमोर समानतेची हमी देतो आणि धर्म, जात, लिंग किंवा जन्मस्थानाच्या आधारे भेदभाव प्रतिबंधित करतो.',
    },
    keyPoints: {
      en: ['Equal protection under law', 'No discrimination by state', 'Equality in public employment', 'Abolition of untouchability'],
      hi: ['कानून के तहत समान संरक्षण', 'राज्य द्वारा कोई भेदभाव नहीं', 'सार्वजनिक रोजगार में समानता', 'अस्पृश्यता का उन्मूलन'],
      mr: ['कायद्यानुसार समान संरक्षण', 'राज्याकडून भेदभाव नाही', 'सार्वजनिक रोजगारात समानता', 'अस्पृश्यता निर्मूलन'],
    },
  },
  {
    id: 'freedom',
    icon: <Users className="h-5 w-5" />,
    article: '19-22',
    title: {
      en: 'Right to Freedom',
      hi: 'स्वतंत्रता का अधिकार',
      mr: 'स्वातंत्र्याचा अधिकार',
    },
    description: {
      en: 'Provides six freedoms including speech, assembly, association, movement, residence, and profession.',
      hi: 'भाषण, सभा, संघ, आंदोलन, निवास और पेशे सहित छह स्वतंत्रताएं प्रदान करता है।',
      mr: 'भाषण, सभा, संघटना, चळवळ, निवास आणि व्यवसाय यासह सहा स्वातंत्र्ये प्रदान करते.',
    },
    keyPoints: {
      en: ['Freedom of speech & expression', 'Freedom to assemble peacefully', 'Freedom to form associations', 'Protection against arrest'],
      hi: ['भाषण और अभिव्यक्ति की स्वतंत्रता', 'शांतिपूर्ण सभा की स्वतंत्रता', 'संघ बनाने की स्वतंत्रता', 'गिरफ्तारी से सुरक्षा'],
      mr: ['भाषण आणि अभिव्यक्ती स्वातंत्र्य', 'शांततेने एकत्र येण्याचे स्वातंत्र्य', 'संघटना स्थापन करण्याचे स्वातंत्र्य', 'अटकेपासून संरक्षण'],
    },
  },
  {
    id: 'exploitation',
    icon: <Briefcase className="h-5 w-5" />,
    article: '23-24',
    title: {
      en: 'Right Against Exploitation',
      hi: 'शोषण के विरुद्ध अधिकार',
      mr: 'शोषणाविरुद्ध अधिकार',
    },
    description: {
      en: 'Prohibits human trafficking, forced labor, and child labor in hazardous industries.',
      hi: 'मानव तस्करी, जबरन श्रम और खतरनाक उद्योगों में बाल श्रम पर रोक लगाता है।',
      mr: 'मानवी तस्करी, सक्तीचे श्रम आणि धोकादायक उद्योगांमध्ये बालमजुरी प्रतिबंधित करते.',
    },
    keyPoints: {
      en: ['No human trafficking', 'No forced labor (begar)', 'No child labor under 14 in factories', 'Protection from exploitation'],
      hi: ['मानव तस्करी नहीं', 'बेगार नहीं', '14 वर्ष से कम उम्र के बच्चों से कारखानों में काम नहीं', 'शोषण से सुरक्षा'],
      mr: ['मानवी तस्करी नाही', 'वेठबिगारी नाही', '14 वर्षाखालील मुलांकडून कारखान्यात काम नाही', 'शोषणापासून संरक्षण'],
    },
  },
  {
    id: 'religion',
    icon: <BookOpen className="h-5 w-5" />,
    article: '25-28',
    title: {
      en: 'Right to Freedom of Religion',
      hi: 'धार्मिक स्वतंत्रता का अधिकार',
      mr: 'धार्मिक स्वातंत्र्याचा अधिकार',
    },
    description: {
      en: 'Guarantees religious freedom to all citizens and ensures secular character of the state.',
      hi: 'सभी नागरिकों को धार्मिक स्वतंत्रता की गारंटी देता है और राज्य के धर्मनिरपेक्ष चरित्र को सुनिश्चित करता है।',
      mr: 'सर्व नागरिकांना धार्मिक स्वातंत्र्याची हमी देते आणि राज्याचे धर्मनिरपेक्ष स्वरूप सुनिश्चित करते.',
    },
    keyPoints: {
      en: ['Freedom to practice any religion', 'Freedom to manage religious affairs', 'No religious instruction in state schools', 'Right to propagate religion'],
      hi: ['किसी भी धर्म का पालन करने की स्वतंत्रता', 'धार्मिक मामलों का प्रबंधन', 'सरकारी स्कूलों में धार्मिक शिक्षा नहीं', 'धर्म प्रचार का अधिकार'],
      mr: ['कोणत्याही धर्माचे पालन करण्याचे स्वातंत्र्य', 'धार्मिक व्यवहार व्यवस्थापन', 'सरकारी शाळांमध्ये धार्मिक शिक्षण नाही', 'धर्म प्रसाराचा अधिकार'],
    },
  },
  {
    id: 'cultural',
    icon: <GraduationCap className="h-5 w-5" />,
    article: '29-30',
    title: {
      en: 'Cultural & Educational Rights',
      hi: 'सांस्कृतिक और शैक्षिक अधिकार',
      mr: 'सांस्कृतिक आणि शैक्षणिक अधिकार',
    },
    description: {
      en: 'Protects the rights of minorities to preserve their culture, language, and establish educational institutions.',
      hi: 'अल्पसंख्यकों को अपनी संस्कृति, भाषा को संरक्षित करने और शैक्षणिक संस्थान स्थापित करने के अधिकारों की रक्षा करता है।',
      mr: 'अल्पसंख्याकांना त्यांची संस्कृती, भाषा जपण्याचे आणि शैक्षणिक संस्था स्थापन करण्याचे अधिकार संरक्षित करते.',
    },
    keyPoints: {
      en: ['Protect distinct culture & language', 'Right to establish institutions', 'No discrimination in state-aided institutions', 'Minority rights protection'],
      hi: ['विशिष्ट संस्कृति और भाषा का संरक्षण', 'संस्थान स्थापित करने का अधिकार', 'सरकारी सहायता प्राप्त संस्थानों में भेदभाव नहीं', 'अल्पसंख्यक अधिकारों का संरक्षण'],
      mr: ['विशिष्ट संस्कृती आणि भाषेचे संरक्षण', 'संस्था स्थापन करण्याचा अधिकार', 'सरकारी मदत प्राप्त संस्थांमध्ये भेदभाव नाही', 'अल्पसंख्याक अधिकारांचे संरक्षण'],
    },
  },
  {
    id: 'remedies',
    icon: <Gavel className="h-5 w-5" />,
    article: '32',
    title: {
      en: 'Right to Constitutional Remedies',
      hi: 'संवैधानिक उपचारों का अधिकार',
      mr: 'घटनात्मक उपायांचा अधिकार',
    },
    description: {
      en: 'Empowers citizens to approach Supreme Court directly for enforcement of fundamental rights through writs.',
      hi: 'नागरिकों को रिट के माध्यम से मौलिक अधिकारों के प्रवर्तन के लिए सीधे सुप्रीम कोर्ट जाने का अधिकार देता है।',
      mr: 'नागरिकांना रिटद्वारे मूलभूत अधिकारांच्या अंमलबजावणीसाठी थेट सर्वोच्च न्यायालयात जाण्याचा अधिकार देते.',
    },
    keyPoints: {
      en: ['Habeas Corpus - release from illegal detention', 'Mandamus - direct officials to act', 'Prohibition - stop lower courts', 'Certiorari - review court decisions'],
      hi: ['बंदी प्रत्यक्षीकरण - अवैध हिरासत से रिहाई', 'परमादेश - अधिकारियों को कार्य करने का आदेश', 'प्रतिषेध - निचली अदालतों को रोकना', 'उत्प्रेषण - न्यायालय के निर्णयों की समीक्षा'],
      mr: ['बंदी प्रत्यक्षीकरण - बेकायदेशीर स्थानबद्धतेतून सुटका', 'परमादेश - अधिकाऱ्यांना कृती करण्याचा आदेश', 'प्रतिषेध - खालच्या न्यायालयांना थांबवणे', 'उत्प्रेषण - न्यायालयीन निर्णयांचे पुनरावलोकन'],
    },
  },
];

export const FundamentalRightsSection: React.FC = () => {
  const { language } = useLanguage();

  const getSectionTitle = () => {
    switch (language) {
      case 'hi': return 'संविधान जानें';
      case 'mr': return 'संविधान जाणा';
      default: return 'Know Your Constitution';
    }
  };

  const getSectionSubtitle = () => {
    switch (language) {
      case 'hi': return 'मौलिक अधिकार (अनुच्छेद 12-35)';
      case 'mr': return 'मूलभूत अधिकार (कलम 12-35)';
      default: return 'Fundamental Rights (Articles 12-35)';
    }
  };

  const getLocalizedText = (textObj: { en: string; hi: string; mr: string }) => {
    return textObj[language as 'en' | 'hi' | 'mr'] || textObj.en;
  };

  const getLocalizedArray = (arrObj: { en: string[]; hi: string[]; mr: string[] }) => {
    return arrObj[language as 'en' | 'hi' | 'mr'] || arrObj.en;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">{getSectionTitle()}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{getSectionSubtitle()}</p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {fundamentalRights.map((right) => (
          <AccordionItem
            key={right.id}
            value={right.id}
            className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent/30">
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  {right.icon}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {getLocalizedText(right.title)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'hi' ? `अनुच्छेद ${right.article}` :
                     language === 'mr' ? `कलम ${right.article}` :
                     `Article ${right.article}`}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="pt-2 pl-13">
                <p className="text-sm text-muted-foreground mb-4">
                  {getLocalizedText(right.description)}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground uppercase tracking-wide">
                    {language === 'hi' ? 'मुख्य बिंदु' :
                     language === 'mr' ? 'मुख्य मुद्दे' :
                     'Key Points'}
                  </p>
                  <ul className="grid gap-2">
                    {getLocalizedArray(right.keyPoints).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
