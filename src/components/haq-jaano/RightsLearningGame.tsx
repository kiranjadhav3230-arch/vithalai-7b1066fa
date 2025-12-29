import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Lightbulb, CheckCircle, Star, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface LearningTopic {
  id: string;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  contentEn: string[];
  contentHi: string[];
  contentMr: string[];
  factEn: string;
  factHi: string;
  factMr: string;
}

interface RightsLearningGameProps {
  onComplete: (topicId: string, score: number) => void;
  onBack: () => void;
}

const learningTopics: LearningTopic[] = [
  {
    id: 'fundamental-rights',
    titleEn: 'Fundamental Rights',
    titleHi: 'मौलिक अधिकार',
    titleMr: 'मूलभूत हक्क',
    lessons: [
      {
        id: 'right-to-equality',
        titleEn: 'Right to Equality (Article 14-18)',
        titleHi: 'समानता का अधिकार (अनुच्छेद 14-18)',
        titleMr: 'समानतेचा हक्क (कलम 14-18)',
        contentEn: [
          '🏛️ Article 14: All persons are equal before law',
          '🚫 Article 15: No discrimination based on religion, race, caste, sex, or birth',
          '💼 Article 16: Equal opportunity in government jobs',
          '🚷 Article 17: Abolition of untouchability',
          '🎖️ Article 18: Abolition of titles (except military/academic)'
        ],
        contentHi: [
          '🏛️ अनुच्छेद 14: कानून के सामने सभी व्यक्ति समान हैं',
          '🚫 अनुच्छेद 15: धर्म, जाति, लिंग के आधार पर भेदभाव नहीं',
          '💼 अनुच्छेद 16: सरकारी नौकरियों में समान अवसर',
          '🚷 अनुच्छेद 17: अस्पृश्यता का उन्मूलन',
          '🎖️ अनुच्छेद 18: उपाधियों का उन्मूलन'
        ],
        contentMr: [
          '🏛️ कलम 14: कायद्यासमोर सर्व व्यक्ती समान आहेत',
          '🚫 कलम 15: धर्म, जात, लिंगावर आधारित भेदभाव नाही',
          '💼 कलम 16: सरकारी नोकऱ्यांमध्ये समान संधी',
          '🚷 कलम 17: अस्पृश्यतेचे उच्चाटन',
          '🎖️ कलम 18: पदव्यांचे उच्चाटन'
        ],
        factEn: '💡 Did you know? India was the first country to constitutionally abolish untouchability!',
        factHi: '💡 क्या आप जानते हैं? भारत पहला देश था जिसने संवैधानिक रूप से अस्पृश्यता को समाप्त किया!',
        factMr: '💡 तुम्हाला माहीत आहे का? भारत हा पहिला देश होता ज्याने घटनात्मकरित्या अस्पृश्यता नष्ट केली!'
      },
      {
        id: 'right-to-freedom',
        titleEn: 'Right to Freedom (Article 19-22)',
        titleHi: 'स्वतंत्रता का अधिकार (अनुच्छेद 19-22)',
        titleMr: 'स्वातंत्र्याचा हक्क (कलम 19-22)',
        contentEn: [
          '🗣️ Freedom of speech and expression',
          '🤝 Freedom to assemble peacefully',
          '👥 Freedom to form associations or unions',
          '🚶 Freedom to move freely throughout India',
          '🏠 Freedom to reside in any part of India',
          '💼 Freedom to practice any profession'
        ],
        contentHi: [
          '🗣️ भाषण और अभिव्यक्ति की स्वतंत्रता',
          '🤝 शांतिपूर्वक एकत्र होने की स्वतंत्रता',
          '👥 संघ या संगठन बनाने की स्वतंत्रता',
          '🚶 भारत में कहीं भी घूमने की स्वतंत्रता',
          '🏠 भारत के किसी भी हिस्से में रहने की स्वतंत्रता',
          '💼 कोई भी पेशा अपनाने की स्वतंत्रता'
        ],
        contentMr: [
          '🗣️ भाषण आणि अभिव्यक्ती स्वातंत्र्य',
          '🤝 शांततेने एकत्र येण्याचे स्वातंत्र्य',
          '👥 संघटना किंवा संघ स्थापन करण्याचे स्वातंत्र्य',
          '🚶 भारतात कुठेही मुक्तपणे फिरण्याचे स्वातंत्र्य',
          '🏠 भारताच्या कोणत्याही भागात राहण्याचे स्वातंत्र्य',
          '💼 कोणताही व्यवसाय करण्याचे स्वातंत्र्य'
        ],
        factEn: '💡 Article 21 (Right to Life) has been expanded to include right to privacy, clean environment, and dignity!',
        factHi: '💡 अनुच्छेद 21 (जीवन का अधिकार) में गोपनीयता, स्वच्छ पर्यावरण और सम्मान का अधिकार भी शामिल है!',
        factMr: '💡 कलम 21 (जगण्याचा हक्क) मध्ये गोपनीयता, स्वच्छ पर्यावरण आणि सन्मानाचा हक्क देखील समाविष्ट आहे!'
      },
      {
        id: 'right-against-exploitation',
        titleEn: 'Right Against Exploitation (Article 23-24)',
        titleHi: 'शोषण के विरुद्ध अधिकार (अनुच्छेद 23-24)',
        titleMr: 'शोषणाविरुद्ध हक्क (कलम 23-24)',
        contentEn: [
          '🚫 Prohibition of human trafficking',
          '⛓️ Prohibition of forced labor (begar)',
          '👶 No child labor in hazardous industries',
          '🔒 Children under 14 cannot work in factories/mines',
          '📞 Report violations to National Child Labor Helpline: 1098'
        ],
        contentHi: [
          '🚫 मानव तस्करी पर प्रतिबंध',
          '⛓️ बेगार (जबरन श्रम) पर प्रतिबंध',
          '👶 खतरनाक उद्योगों में बाल श्रम नहीं',
          '🔒 14 वर्ष से कम आयु के बच्चे कारखानों में काम नहीं कर सकते',
          '📞 उल्लंघन की रिपोर्ट करें: बाल श्रम हेल्पलाइन 1098'
        ],
        contentMr: [
          '🚫 मानवी तस्करीवर बंदी',
          '⛓️ बळजबरी मजुरीवर (बेगार) बंदी',
          '👶 धोकादायक उद्योगांमध्ये बालमजुरी नाही',
          '🔒 14 वर्षांखालील मुलं कारखान्यांमध्ये काम करू शकत नाहीत',
          '📞 उल्लंघनाची तक्रार करा: बाल श्रम हेल्पलाइन 1098'
        ],
        factEn: '💡 The Bonded Labour System (Abolition) Act, 1976 makes bonded labor a punishable offense!',
        factHi: '💡 बंधुआ मजदूरी प्रणाली (उन्मूलन) अधिनियम, 1976 बंधुआ मजदूरी को दंडनीय अपराध बनाता है!',
        factMr: '💡 बंधपत्रित मजुरी प्रणाली (निर्मूलन) कायदा, 1976 बंधपत्रित मजुरीला शिक्षापात्र गुन्हा बनवतो!'
      },
      {
        id: 'right-to-religion',
        titleEn: 'Right to Freedom of Religion (Article 25-28)',
        titleHi: 'धार्मिक स्वतंत्रता का अधिकार (अनुच्छेद 25-28)',
        titleMr: 'धार्मिक स्वातंत्र्याचा हक्क (कलम 25-28)',
        contentEn: [
          '🙏 Freedom of conscience and religion',
          '⛪ Freedom to manage religious affairs',
          '🕌 Freedom from religious tax',
          '📚 Freedom from religious instruction in state schools',
          '🤝 India is a secular country - all religions equal'
        ],
        contentHi: [
          '🙏 अंतःकरण और धर्म की स्वतंत्रता',
          '⛪ धार्मिक मामलों का प्रबंधन करने की स्वतंत्रता',
          '🕌 धार्मिक कर से मुक्ति',
          '📚 सरकारी स्कूलों में धार्मिक शिक्षा से मुक्ति',
          '🤝 भारत एक धर्मनिरपेक्ष देश है - सभी धर्म समान'
        ],
        contentMr: [
          '🙏 विवेक आणि धर्माचे स्वातंत्र्य',
          '⛪ धार्मिक बाबींचे व्यवस्थापन करण्याचे स्वातंत्र्य',
          '🕌 धार्मिक करापासून मुक्ती',
          '📚 सरकारी शाळांमध्ये धार्मिक शिक्षणापासून मुक्ती',
          '🤝 भारत एक धर्मनिरपेक्ष देश आहे - सर्व धर्म समान'
        ],
        factEn: '💡 India has no official state religion - everyone is free to follow any faith!',
        factHi: '💡 भारत का कोई आधिकारिक राज्य धर्म नहीं है - हर कोई किसी भी आस्था का पालन कर सकता है!',
        factMr: '💡 भारताचा कोणताही अधिकृत राज्य धर्म नाही - प्रत्येकजण कोणत्याही श्रद्धेचे पालन करू शकतो!'
      },
      {
        id: 'cultural-educational-rights',
        titleEn: 'Cultural & Educational Rights (Article 29-30)',
        titleHi: 'सांस्कृतिक और शैक्षिक अधिकार (अनुच्छेद 29-30)',
        titleMr: 'सांस्कृतिक आणि शैक्षणिक हक्क (कलम 29-30)',
        contentEn: [
          '🌍 Right to conserve distinct language, script, culture',
          '🏫 Right of minorities to establish educational institutions',
          '📖 No citizen denied admission based on religion/race/caste',
          '🎓 Right to Education (RTE) - Free education for ages 6-14',
          '📝 Minorities can administer their own institutions'
        ],
        contentHi: [
          '🌍 विशिष्ट भाषा, लिपि, संस्कृति को संरक्षित करने का अधिकार',
          '🏫 अल्पसंख्यकों को शैक्षणिक संस्थाएं स्थापित करने का अधिकार',
          '📖 धर्म/जाति के आधार पर प्रवेश से इनकार नहीं',
          '🎓 शिक्षा का अधिकार - 6-14 वर्ष के बच्चों के लिए मुफ्त शिक्षा',
          '📝 अल्पसंख्यक अपने संस्थानों का प्रशासन कर सकते हैं'
        ],
        contentMr: [
          '🌍 विशिष्ट भाषा, लिपी, संस्कृतीचे संरक्षण करण्याचा हक्क',
          '🏫 अल्पसंख्याकांना शैक्षणिक संस्था स्थापन करण्याचा हक्क',
          '📖 धर्म/जातीच्या आधारावर प्रवेश नाकारता येत नाही',
          '🎓 शिक्षणाचा हक्क - 6-14 वयोगटातील मुलांसाठी मोफत शिक्षण',
          '📝 अल्पसंख्याक त्यांच्या संस्थांचे व्यवस्थापन करू शकतात'
        ],
        factEn: '💡 RTE Act 2009 made education a fundamental right for children aged 6-14 years!',
        factHi: '💡 RTE अधिनियम 2009 ने 6-14 वर्ष के बच्चों के लिए शिक्षा को मौलिक अधिकार बनाया!',
        factMr: '💡 RTE कायदा 2009 ने 6-14 वर्षे वयोगटातील मुलांसाठी शिक्षण मूलभूत हक्क बनवले!'
      },
      {
        id: 'right-to-remedies',
        titleEn: 'Right to Constitutional Remedies (Article 32)',
        titleHi: 'संवैधानिक उपचारों का अधिकार (अनुच्छेद 32)',
        titleMr: 'घटनात्मक उपायांचा हक्क (कलम 32)',
        contentEn: [
          '⚖️ Dr. Ambedkar called it "Heart and Soul of Constitution"',
          '📜 5 Types of Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto',
          '🏛️ Directly approach Supreme Court for rights violation',
          '🛡️ Cannot be suspended even during emergency (except Article 21)',
          '✊ Ensures fundamental rights are not just on paper'
        ],
        contentHi: [
          '⚖️ डॉ. अंबेडकर ने इसे "संविधान की आत्मा" कहा',
          '📜 5 प्रकार की रिट: बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार पृच्छा',
          '🏛️ अधिकार उल्लंघन के लिए सीधे सुप्रीम कोर्ट जाएं',
          '🛡️ आपातकाल में भी निलंबित नहीं किया जा सकता',
          '✊ सुनिश्चित करता है कि मौलिक अधिकार सिर्फ कागज पर न हों'
        ],
        contentMr: [
          '⚖️ डॉ. आंबेडकरांनी याला "संविधानाचे हृदय आणि आत्मा" म्हटले',
          '📜 5 प्रकारच्या रिट: बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार पृच्छा',
          '🏛️ हक्कभंगासाठी थेट सर्वोच्च न्यायालयात जा',
          '🛡️ आणीबाणीतही निलंबित करता येत नाही',
          '✊ मूलभूत हक्क फक्त कागदावर नाहीत याची खात्री करते'
        ],
        factEn: '💡 Only Article 32 allows direct access to Supreme Court - this makes it special!',
        factHi: '💡 केवल अनुच्छेद 32 सुप्रीम कोर्ट तक सीधी पहुंच की अनुमति देता है - यह इसे विशेष बनाता है!',
        factMr: '💡 फक्त कलम 32 सर्वोच्च न्यायालयात थेट प्रवेशाची परवानगी देतो - हे त्याला खास बनवते!'
      }
    ]
  },
  {
    id: 'police-rights',
    titleEn: 'Your Rights with Police',
    titleHi: 'पुलिस के साथ आपके अधिकार',
    titleMr: 'पोलिसांसोबत तुमचे हक्क',
    lessons: [
      {
        id: 'arrest-rights',
        titleEn: 'Rights During Arrest',
        titleHi: 'गिरफ्तारी के दौरान अधिकार',
        titleMr: 'अटक दरम्यान हक्क',
        contentEn: [
          '📋 Right to know the reason for arrest',
          '👨‍⚖️ Right to consult a lawyer of your choice',
          '👪 Right to inform family member about arrest',
          '🏛️ Must be produced before magistrate within 24 hours',
          '🚫 Cannot be tortured or beaten in custody'
        ],
        contentHi: [
          '📋 गिरफ्तारी का कारण जानने का अधिकार',
          '👨‍⚖️ अपनी पसंद के वकील से परामर्श का अधिकार',
          '👪 परिवार के सदस्य को सूचित करने का अधिकार',
          '🏛️ 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश होना चाहिए',
          '🚫 हिरासत में यातना या पिटाई नहीं की जा सकती'
        ],
        contentMr: [
          '📋 अटकेचे कारण जाणून घेण्याचा हक्क',
          '👨‍⚖️ तुमच्या पसंतीच्या वकिलाशी सल्लामसलत करण्याचा हक्क',
          '👪 कुटुंबातील सदस्याला कळवण्याचा हक्क',
          '🏛️ 24 तासांच्या आत न्यायदंडाधिकाऱ्यांसमोर हजर करणे आवश्यक',
          '🚫 कोठडीत छळ किंवा मारहाण करता येत नाही'
        ],
        factEn: '💡 Section 50 CrPC: Police must inform you of the offense for which you are being arrested!',
        factHi: '💡 धारा 50 CrPC: पुलिस को आपको बताना होगा कि किस अपराध के लिए गिरफ्तार किया जा रहा है!',
        factMr: '💡 कलम 50 CrPC: तुम्हाला कोणत्या गुन्ह्यासाठी अटक केली जात आहे हे पोलिसांनी सांगणे आवश्यक आहे!'
      },
      {
        id: 'fir-rights',
        titleEn: 'Rights for Filing FIR',
        titleHi: 'FIR दर्ज करने के अधिकार',
        titleMr: 'FIR दाखल करण्याचे हक्क',
        contentEn: [
          '📝 Police MUST register FIR for cognizable offenses',
          '🆓 FIR registration is FREE - no fees',
          '📄 You have the right to get a copy of FIR',
          '🏠 Zero FIR can be filed at any police station',
          '📧 E-FIR can be filed online in many states'
        ],
        contentHi: [
          '📝 संज्ञेय अपराधों के लिए पुलिस को FIR दर्ज करना अनिवार्य है',
          '🆓 FIR दर्ज करना मुफ्त है - कोई शुल्क नहीं',
          '📄 आपको FIR की प्रति प्राप्त करने का अधिकार है',
          '🏠 जीरो FIR किसी भी थाने में दर्ज की जा सकती है',
          '📧 कई राज्यों में E-FIR ऑनलाइन दर्ज की जा सकती है'
        ],
        contentMr: [
          '📝 दखलपात्र गुन्ह्यांसाठी पोलिसांना FIR नोंदवणे बंधनकारक आहे',
          '🆓 FIR नोंदणी मोफत आहे - कोणतेही शुल्क नाही',
          '📄 तुम्हाला FIR ची प्रत मिळण्याचा हक्क आहे',
          '🏠 शून्य FIR कोणत्याही पोलीस स्टेशनवर दाखल करता येते',
          '📧 अनेक राज्यांमध्ये E-FIR ऑनलाइन दाखल करता येते'
        ],
        factEn: '💡 If police refuse to file FIR, you can complain to SP/DCP or approach the court!',
        factHi: '💡 अगर पुलिस FIR दर्ज करने से मना करे, तो SP/DCP को शिकायत करें या कोर्ट जाएं!',
        factMr: '💡 पोलिसांनी FIR नोंदवण्यास नकार दिल्यास, SP/DCP कडे तक्रार करा किंवा न्यायालयात जा!'
      }
    ]
  },
  {
    id: 'women-rights',
    titleEn: 'Women Safety Laws',
    titleHi: 'महिला सुरक्षा कानून',
    titleMr: 'महिला सुरक्षा कायदे',
    lessons: [
      {
        id: 'protection-laws',
        titleEn: 'Protection Laws for Women',
        titleHi: 'महिलाओं के लिए सुरक्षा कानून',
        titleMr: 'महिलांसाठी संरक्षण कायदे',
        contentEn: [
          '🚺 Woman can only be arrested by female police officer',
          '🌙 No arrest of women after sunset and before sunrise',
          '🏠 Domestic Violence Act protects women at home',
          '💼 Sexual Harassment Act (POSH) protects at workplace',
          '📞 Women Helpline: 1091 (24/7)'
        ],
        contentHi: [
          '🚺 महिला को केवल महिला पुलिस अधिकारी ही गिरफ्तार कर सकती है',
          '🌙 सूर्यास्त के बाद और सूर्योदय से पहले महिला की गिरफ्तारी नहीं',
          '🏠 घरेलू हिंसा अधिनियम घर पर महिलाओं की रक्षा करता है',
          '💼 यौन उत्पीड़न अधिनियम (POSH) कार्यस्थल पर सुरक्षा देता है',
          '📞 महिला हेल्पलाइन: 1091 (24/7)'
        ],
        contentMr: [
          '🚺 महिलेला फक्त महिला पोलीस अधिकारीच अटक करू शकते',
          '🌙 सूर्यास्तानंतर आणि सूर्योदयापूर्वी महिलेला अटक नाही',
          '🏠 घरगुती हिंसाचार कायदा घरी महिलांचे संरक्षण करतो',
          '💼 लैंगिक छळ कायदा (POSH) कार्यस्थळी संरक्षण देतो',
          '📞 महिला हेल्पलाइन: 1091 (24/7)'
        ],
        factEn: '💡 Every workplace with 10+ employees must have an Internal Complaints Committee (ICC)!',
        factHi: '💡 10+ कर्मचारियों वाले हर कार्यस्थल में आंतरिक शिकायत समिति (ICC) होनी चाहिए!',
        factMr: '💡 10+ कर्मचारी असलेल्या प्रत्येक कार्यस्थळात अंतर्गत तक्रार समिती (ICC) असणे आवश्यक आहे!'
      }
    ]
  }
];

export const RightsLearningGame: React.FC<RightsLearningGameProps> = ({ onComplete, onBack }) => {
  const { language } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getLocalizedText = (en: string, hi: string, mr: string) => {
    switch (language) {
      case 'hi': return hi;
      case 'mr': return mr;
      default: return en;
    }
  };

  const getTitle = () => getLocalizedText('Learn Your Rights', 'अपने अधिकार सीखें', 'तुमचे हक्क शिका');
  const getSelectTopic = () => getLocalizedText('Select a Topic', 'विषय चुनें', 'विषय निवडा');
  const getNextText = () => getLocalizedText('Next', 'अगला', 'पुढे');
  const getPrevText = () => getLocalizedText('Previous', 'पिछला', 'मागे');
  const getStartQuiz = () => getLocalizedText('Take Quiz', 'परीक्षा दें', 'परीक्षा द्या');
  const getLessonsCompleted = () => getLocalizedText('lessons completed', 'पाठ पूरे हुए', 'धडे पूर्ण झाले');

  const currentLesson = selectedTopic?.lessons[currentLessonIndex];
  const currentContent = currentLesson ? 
    (language === 'hi' ? currentLesson.contentHi : language === 'mr' ? currentLesson.contentMr : currentLesson.contentEn) : [];
  const totalPoints = currentContent.length;
  const progress = selectedTopic ? ((currentLessonIndex * 100) / selectedTopic.lessons.length) : 0;

  const handleNextPoint = () => {
    if (currentPointIndex < totalPoints - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPointIndex(currentPointIndex + 1);
        setIsAnimating(false);
      }, 200);
    } else if (!showFact) {
      setShowFact(true);
    } else {
      // Move to next lesson
      if (currentLesson && !completedLessons.includes(currentLesson.id)) {
        setCompletedLessons([...completedLessons, currentLesson.id]);
      }
      if (currentLessonIndex < (selectedTopic?.lessons.length || 0) - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
        setCurrentPointIndex(0);
        setShowFact(false);
      }
    }
  };

  const handlePrevPoint = () => {
    if (showFact) {
      setShowFact(false);
    } else if (currentPointIndex > 0) {
      setCurrentPointIndex(currentPointIndex - 1);
    } else if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      const prevLesson = selectedTopic?.lessons[currentLessonIndex - 1];
      const prevContent = prevLesson ? 
        (language === 'hi' ? prevLesson.contentHi : language === 'mr' ? prevLesson.contentMr : prevLesson.contentEn) : [];
      setCurrentPointIndex(prevContent.length - 1);
      setShowFact(false);
    }
  };

  const handleStartQuiz = () => {
    if (selectedTopic) {
      onComplete(selectedTopic.id, completedLessons.length);
    }
  };

  const isAllLessonsComplete = selectedTopic && completedLessons.length >= selectedTopic.lessons.length;
  const isLastPointOfLastLesson = selectedTopic && 
    currentLessonIndex === selectedTopic.lessons.length - 1 && 
    showFact;

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{getTitle()}</h1>
        </div>

        <h2 className="mb-4 text-lg text-muted-foreground">{getSelectTopic()}</h2>

        <div className="space-y-4">
          {learningTopics.map((topic, index) => (
            <Card
              key={topic.id}
              className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
              onClick={() => setSelectedTopic(topic)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {getLocalizedText(topic.titleEn, topic.titleHi, topic.titleMr)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.lessons.length} {getLessonsCompleted().split(' ').slice(1).join(' ')}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setSelectedTopic(null)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">
            {getLocalizedText(selectedTopic.titleEn, selectedTopic.titleHi, selectedTopic.titleMr)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentLessonIndex + 1} / {selectedTopic.lessons.length} {getLessonsCompleted()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="mb-6 h-2" />

      {/* Lesson Title */}
      <div className="mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <h2 className="font-semibold text-foreground">
          {currentLesson && getLocalizedText(currentLesson.titleEn, currentLesson.titleHi, currentLesson.titleMr)}
        </h2>
      </div>

      {/* Content Card */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6">
          {!showFact ? (
            <div className={cn(
              "transition-all duration-200",
              isAnimating && "opacity-0 translate-x-4"
            )}>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  {currentPointIndex + 1}
                </div>
                <span className="text-sm text-muted-foreground">
                  / {totalPoints}
                </span>
              </div>
              <p className="text-lg leading-relaxed text-foreground">
                {currentContent[currentPointIndex]}
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                <span className="font-semibold text-yellow-500">
                  {getLocalizedText('Fun Fact!', 'रोचक तथ्य!', 'मजेशीर तथ्य!')}
                </span>
              </div>
              <p className="text-lg leading-relaxed text-foreground">
                {currentLesson && getLocalizedText(currentLesson.factEn, currentLesson.factHi, currentLesson.factMr)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handlePrevPoint}
          disabled={currentLessonIndex === 0 && currentPointIndex === 0 && !showFact}
        >
          <ChevronLeft className="h-4 w-4" />
          {getPrevText()}
        </Button>

        {isLastPointOfLastLesson ? (
          <Button
            className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
            onClick={handleStartQuiz}
          >
            <Trophy className="h-4 w-4" />
            {getStartQuiz()}
          </Button>
        ) : (
          <Button
            className="flex-1 gap-2"
            onClick={handleNextPoint}
          >
            {getNextText()}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Completed Lessons Indicator */}
      <div className="mt-6 flex justify-center gap-2">
        {selectedTopic.lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className={cn(
              "h-2 w-8 rounded-full transition-all",
              index < currentLessonIndex || completedLessons.includes(lesson.id)
                ? "bg-primary"
                : index === currentLessonIndex
                ? "bg-primary/50"
                : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
};
