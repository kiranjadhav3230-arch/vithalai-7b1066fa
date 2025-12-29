import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Clock, CheckCircle, XCircle, Trophy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';

interface QuizQuestion {
  id: string;
  question: { en: string; hi: string; mr: string };
  options: { en: string[]; hi: string[]; mr: string[] };
  correctIndex: number;
  explanation: { en: string; hi: string; mr: string };
}

interface RightsQuizExamProps {
  topic: 'fundamental_rights' | 'consumer_rights' | 'women_rights' | 'police_rights';
  onComplete: (score: number, total: number, passed: boolean) => void;
  onBack: () => void;
}

const quizQuestions: Record<string, QuizQuestion[]> = {
  fundamental_rights: [
    {
      id: 'q1',
      question: { 
        en: 'Which articles cover Right to Equality?',
        hi: 'समानता का अधिकार किन अनुच्छेदों में है?',
        mr: 'समानतेचा अधिकार कोणत्या कलमांमध्ये आहे?'
      },
      options: {
        en: ['Articles 14-18', 'Articles 19-22', 'Articles 23-24', 'Articles 25-28'],
        hi: ['अनुच्छेद 14-18', 'अनुच्छेद 19-22', 'अनुच्छेद 23-24', 'अनुच्छेद 25-28'],
        mr: ['कलम 14-18', 'कलम 19-22', 'कलम 23-24', 'कलम 25-28']
      },
      correctIndex: 0,
      explanation: {
        en: 'Articles 14-18 of the Indian Constitution cover Right to Equality including equality before law and prohibition of discrimination.',
        hi: 'भारतीय संविधान के अनुच्छेद 14-18 समानता के अधिकार को कवर करते हैं।',
        mr: 'भारतीय घटनेचे कलम 14-18 समानतेचा अधिकार समाविष्ट करतात.'
      }
    },
    {
      id: 'q2',
      question: { 
        en: 'Within how many hours must police present an arrested person before a magistrate?',
        hi: 'पुलिस को गिरफ्तार व्यक्ति को कितने घंटों के भीतर मजिस्ट्रेट के सामने पेश करना होता है?',
        mr: 'पोलिसांनी अटक केलेल्या व्यक्तीला किती तासांत मॅजिस्ट्रेटसमोर हजर करणे आवश्यक आहे?'
      },
      options: {
        en: ['12 hours', '24 hours', '48 hours', '72 hours'],
        hi: ['12 घंटे', '24 घंटे', '48 घंटे', '72 घंटे'],
        mr: ['12 तास', '24 तास', '48 तास', '72 तास']
      },
      correctIndex: 1,
      explanation: {
        en: 'Under Article 22, police must present an arrested person before a magistrate within 24 hours.',
        hi: 'अनुच्छेद 22 के तहत, पुलिस को 24 घंटे के भीतर गिरफ्तार व्यक्ति को मजिस्ट्रेट के सामने पेश करना होता है।',
        mr: 'कलम 22 अंतर्गत, पोलिसांनी 24 तासांच्या आत अटक केलेल्या व्यक्तीला मॅजिस्ट्रेटसमोर हजर करणे आवश्यक आहे.'
      }
    },
    {
      id: 'q3',
      question: { 
        en: 'What is the minimum age for child labor in factories?',
        hi: 'कारखानों में बाल श्रम की न्यूनतम आयु क्या है?',
        mr: 'कारखान्यांमध्ये बालकामगारांसाठी किमान वय किती आहे?'
      },
      options: {
        en: ['10 years', '12 years', '14 years', '16 years'],
        hi: ['10 वर्ष', '12 वर्ष', '14 वर्ष', '16 वर्ष'],
        mr: ['10 वर्षे', '12 वर्षे', '14 वर्षे', '16 वर्षे']
      },
      correctIndex: 2,
      explanation: {
        en: 'Article 24 prohibits employment of children below 14 years in factories, mines, or hazardous employment.',
        hi: 'अनुच्छेद 24 कारखानों, खदानों या खतरनाक रोजगार में 14 वर्ष से कम उम्र के बच्चों के रोजगार पर रोक लगाता है।',
        mr: 'कलम 24 कारखाने, खाणी किंवा धोकादायक रोजगारामध्ये 14 वर्षांपेक्षा कमी वयाच्या मुलांच्या रोजगारावर बंदी घालते.'
      }
    },
    {
      id: 'q4',
      question: { 
        en: 'Which article is called the "Heart of the Constitution"?',
        hi: 'कौन सा अनुच्छेद "संविधान का हृदय" कहलाता है?',
        mr: 'कोणते कलम "घटनेचे हृदय" म्हणून ओळखले जाते?'
      },
      options: {
        en: ['Article 14', 'Article 21', 'Article 32', 'Article 44'],
        hi: ['अनुच्छेद 14', 'अनुच्छेद 21', 'अनुच्छेद 32', 'अनुच्छेद 44'],
        mr: ['कलम 14', 'कलम 21', 'कलम 32', 'कलम 44']
      },
      correctIndex: 2,
      explanation: {
        en: 'Article 32 (Right to Constitutional Remedies) is called the Heart of the Constitution by Dr. Ambedkar.',
        hi: 'डॉ. अंबेडकर ने अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार) को संविधान का हृदय कहा।',
        mr: 'डॉ. आंबेडकरांनी कलम 32 (घटनात्मक उपायांचा अधिकार) ला घटनेचे हृदय म्हटले.'
      }
    },
    {
      id: 'q5',
      question: { 
        en: 'What writ can be filed for illegal detention?',
        hi: 'गैरकानूनी हिरासत के लिए कौन सी रिट दायर की जा सकती है?',
        mr: 'बेकायदेशीर अटकेसाठी कोणती रिट दाखल करता येते?'
      },
      options: {
        en: ['Mandamus', 'Habeas Corpus', 'Certiorari', 'Quo Warranto'],
        hi: ['मैंडेमस', 'बंदी प्रत्यक्षीकरण', 'सर्टिओरारी', 'को वारंटो'],
        mr: ['मँडेमस', 'हेबियस कॉर्पस', 'सर्टिओरारी', 'को वारंटो']
      },
      correctIndex: 1,
      explanation: {
        en: 'Habeas Corpus literally means "produce the body" and is used to challenge illegal detention.',
        hi: 'बंदी प्रत्यक्षीकरण का अर्थ है "शरीर को प्रस्तुत करो" और इसका उपयोग गैरकानूनी हिरासत को चुनौती देने के लिए किया जाता है।',
        mr: 'हेबियस कॉर्पस म्हणजे "शरीर सादर करा" आणि बेकायदेशीर अटकेला आव्हान देण्यासाठी याचा वापर केला जातो.'
      }
    },
    {
      id: 'q6',
      question: { 
        en: 'Which articles protect freedom of religion?',
        hi: 'धर्म की स्वतंत्रता की रक्षा कौन से अनुच्छेद करते हैं?',
        mr: 'धर्मस्वातंत्र्याचे संरक्षण कोणत्या कलमांमध्ये आहे?'
      },
      options: {
        en: ['Articles 14-18', 'Articles 19-22', 'Articles 25-28', 'Articles 29-30'],
        hi: ['अनुच्छेद 14-18', 'अनुच्छेद 19-22', 'अनुच्छेद 25-28', 'अनुच्छेद 29-30'],
        mr: ['कलम 14-18', 'कलम 19-22', 'कलम 25-28', 'कलम 29-30']
      },
      correctIndex: 2,
      explanation: {
        en: 'Articles 25-28 guarantee freedom of religion including freedom to practice, profess, and propagate religion.',
        hi: 'अनुच्छेद 25-28 धर्म की स्वतंत्रता की गारंटी देते हैं।',
        mr: 'कलम 25-28 धर्मस्वातंत्र्याची हमी देतात.'
      }
    }
  ],
  consumer_rights: [
    {
      id: 'cq1',
      question: { 
        en: 'What is the toll-free consumer helpline number?',
        hi: 'उपभोक्ता हेल्पलाइन का टोल-फ्री नंबर क्या है?',
        mr: 'ग्राहक हेल्पलाइनचा टोल-फ्री नंबर कोणता आहे?'
      },
      options: {
        en: ['1800-11-4000', '1800-11-5000', '1800-11-6000', '1800-11-7000'],
        hi: ['1800-11-4000', '1800-11-5000', '1800-11-6000', '1800-11-7000'],
        mr: ['1800-11-4000', '1800-11-5000', '1800-11-6000', '1800-11-7000']
      },
      correctIndex: 0,
      explanation: {
        en: '1800-11-4000 is the National Consumer Helpline. You can also visit consumerhelpline.gov.in',
        hi: '1800-11-4000 राष्ट्रीय उपभोक्ता हेल्पलाइन है।',
        mr: '1800-11-4000 राष्ट्रीय ग्राहक हेल्पलाइन आहे.'
      }
    },
    {
      id: 'cq2',
      question: { 
        en: 'Can a shopkeeper charge more than MRP?',
        hi: 'क्या दुकानदार MRP से अधिक शुल्क ले सकता है?',
        mr: 'दुकानदार MRP पेक्षा जास्त शुल्क आकारू शकतो का?'
      },
      options: {
        en: ['Yes, upto 10%', 'Yes, if quality is better', 'No, never', 'Only with discount'],
        hi: ['हाँ, 10% तक', 'हाँ, अगर गुणवत्ता बेहतर है', 'नहीं, कभी नहीं', 'केवल छूट के साथ'],
        mr: ['होय, 10% पर्यंत', 'होय, गुणवत्ता चांगली असल्यास', 'नाही, कधीच नाही', 'फक्त सवलतीसह']
      },
      correctIndex: 2,
      explanation: {
        en: 'Charging more than MRP is illegal. MRP means Maximum Retail Price and is the highest price that can be charged.',
        hi: 'MRP से अधिक शुल्क लेना गैरकानूनी है।',
        mr: 'MRP पेक्षा जास्त शुल्क आकारणे बेकायदेशीर आहे.'
      }
    },
    {
      id: 'cq3',
      question: { 
        en: 'Which mark indicates electrical safety in India?',
        hi: 'भारत में विद्युत सुरक्षा कौन सा चिह्न दर्शाता है?',
        mr: 'भारतात विद्युत सुरक्षितता कोणते चिन्ह दर्शवते?'
      },
      options: {
        en: ['AGMARK', 'ISI Mark', 'FPO', 'BIS Hallmark'],
        hi: ['एगमार्क', 'ISI मार्क', 'FPO', 'BIS हॉलमार्क'],
        mr: ['एगमार्क', 'ISI मार्क', 'FPO', 'BIS हॉलमार्क']
      },
      correctIndex: 1,
      explanation: {
        en: 'ISI Mark is given by Bureau of Indian Standards for electrical and other industrial products.',
        hi: 'ISI मार्क भारतीय मानक ब्यूरो द्वारा विद्युत और अन्य औद्योगिक उत्पादों के लिए दिया जाता है।',
        mr: 'ISI मार्क भारतीय मानक ब्यूरोद्वारे विद्युत आणि इतर औद्योगिक उत्पादनांसाठी दिले जाते.'
      }
    },
    {
      id: 'cq4',
      question: { 
        en: 'What is the time limit to file a consumer complaint?',
        hi: 'उपभोक्ता शिकायत दर्ज करने की समय सीमा क्या है?',
        mr: 'ग्राहक तक्रार दाखल करण्याची मुदत किती आहे?'
      },
      options: {
        en: ['1 year', '2 years', '3 years', '5 years'],
        hi: ['1 वर्ष', '2 वर्ष', '3 वर्ष', '5 वर्ष'],
        mr: ['1 वर्ष', '2 वर्षे', '3 वर्षे', '5 वर्षे']
      },
      correctIndex: 1,
      explanation: {
        en: 'Consumer complaints must be filed within 2 years from the date of cause of action.',
        hi: 'उपभोक्ता शिकायत कारण की तारीख से 2 वर्ष के भीतर दर्ज करनी होती है।',
        mr: 'ग्राहक तक्रार कारणाच्या तारखेपासून 2 वर्षांच्या आत दाखल करणे आवश्यक आहे.'
      }
    }
  ],
  women_rights: [
    {
      id: 'wq1',
      question: { 
        en: 'What is the Women Helpline number?',
        hi: 'महिला हेल्पलाइन नंबर क्या है?',
        mr: 'महिला हेल्पलाइन नंबर कोणता आहे?'
      },
      options: {
        en: ['1091', '100', '1098', '181'],
        hi: ['1091', '100', '1098', '181'],
        mr: ['1091', '100', '1098', '181']
      },
      correctIndex: 0,
      explanation: {
        en: '1091 is the Women Helpline. 181 is also Women in Distress helpline.',
        hi: '1091 महिला हेल्पलाइन है। 181 भी संकट में महिलाओं के लिए हेल्पलाइन है।',
        mr: '1091 महिला हेल्पलाइन आहे. 181 ही संकटात असलेल्या महिलांसाठी हेल्पलाइन आहे.'
      }
    },
    {
      id: 'wq2',
      question: { 
        en: 'How many weeks of paid maternity leave are women entitled to?',
        hi: 'महिलाओं को कितने सप्ताह का सवेतन मातृत्व अवकाश मिलता है?',
        mr: 'महिलांना किती आठवड्यांची सवेतन मातृत्व रजा मिळते?'
      },
      options: {
        en: ['12 weeks', '18 weeks', '26 weeks', '32 weeks'],
        hi: ['12 सप्ताह', '18 सप्ताह', '26 सप्ताह', '32 सप्ताह'],
        mr: ['12 आठवडे', '18 आठवडे', '26 आठवडे', '32 आठवडे']
      },
      correctIndex: 2,
      explanation: {
        en: 'Under the Maternity Benefit Amendment Act 2017, women get 26 weeks of paid maternity leave.',
        hi: 'मातृत्व लाभ संशोधन अधिनियम 2017 के तहत, महिलाओं को 26 सप्ताह का सवेतन मातृत्व अवकाश मिलता है।',
        mr: 'मातृत्व लाभ सुधारणा कायदा 2017 अंतर्गत, महिलांना 26 आठवड्यांची सवेतन मातृत्व रजा मिळते.'
      }
    },
    {
      id: 'wq3',
      question: { 
        en: 'Within how many days should workplace harassment complaints be resolved?',
        hi: 'कार्यस्थल उत्पीड़न की शिकायतें कितने दिनों में हल होनी चाहिए?',
        mr: 'कार्यस्थळ छळाच्या तक्रारी किती दिवसांत निकाली काढल्या पाहिजेत?'
      },
      options: {
        en: ['30 days', '60 days', '90 days', '120 days'],
        hi: ['30 दिन', '60 दिन', '90 दिन', '120 दिन'],
        mr: ['30 दिवस', '60 दिवस', '90 दिवस', '120 दिवस']
      },
      correctIndex: 2,
      explanation: {
        en: 'Under POSH Act, complaints must be resolved within 90 days.',
        hi: 'POSH अधिनियम के तहत, शिकायतें 90 दिनों में हल होनी चाहिए।',
        mr: 'POSH कायद्यांतर्गत, तक्रारी 90 दिवसांत निकाली काढल्या पाहिजेत.'
      }
    },
    {
      id: 'wq4',
      question: { 
        en: 'Can a woman give her statement at home in case of assault?',
        hi: 'क्या हमले के मामले में महिला घर पर बयान दे सकती है?',
        mr: 'हल्ल्याच्या प्रकरणात महिला घरी जबानी देऊ शकते का?'
      },
      options: {
        en: ['No, must go to station', 'Yes, female officer visits', 'Only with court order', 'Not allowed'],
        hi: ['नहीं, स्टेशन जाना होगा', 'हाँ, महिला अधिकारी आती है', 'केवल कोर्ट आदेश से', 'अनुमति नहीं'],
        mr: ['नाही, स्टेशनला जावे लागेल', 'होय, महिला अधिकारी येतात', 'फक्त न्यायालयाच्या आदेशाने', 'परवानगी नाही']
      },
      correctIndex: 1,
      explanation: {
        en: 'A female police officer must visit the woman at her home or any place of her choice to record her statement.',
        hi: 'एक महिला पुलिस अधिकारी को महिला के घर या उसकी पसंद की जगह पर बयान लेने के लिए आना होता है।',
        mr: 'महिला पोलीस अधिकाऱ्याने महिलेच्या घरी किंवा तिच्या पसंतीच्या ठिकाणी जबानी घेण्यासाठी यावे लागते.'
      }
    }
  ],
  police_rights: [
    {
      id: 'pq1',
      question: { 
        en: 'What is Zero FIR?',
        hi: 'जीरो FIR क्या है?',
        mr: 'झिरो FIR म्हणजे काय?'
      },
      options: {
        en: ['FIR with no details', 'FIR filed anywhere', 'FIR for minor crimes', 'Online FIR only'],
        hi: ['बिना विवरण वाली FIR', 'कहीं भी दर्ज FIR', 'छोटे अपराधों के लिए FIR', 'केवल ऑनलाइन FIR'],
        mr: ['तपशीलाशिवाय FIR', 'कुठेही दाखल केलेली FIR', 'किरकोळ गुन्ह्यांसाठी FIR', 'फक्त ऑनलाइन FIR']
      },
      correctIndex: 1,
      explanation: {
        en: 'Zero FIR can be filed at any police station regardless of jurisdiction. It is later transferred to the correct station.',
        hi: 'जीरो FIR किसी भी पुलिस स्टेशन पर दर्ज की जा सकती है, बाद में सही स्टेशन को ट्रांसफर होती है।',
        mr: 'झिरो FIR अधिकार क्षेत्राची पर्वा न करता कोणत्याही पोलीस स्टेशनवर दाखल करता येते.'
      }
    },
    {
      id: 'pq2',
      question: { 
        en: 'Can police arrest without warrant at night?',
        hi: 'क्या पुलिस रात में बिना वारंट गिरफ्तार कर सकती है?',
        mr: 'पोलीस रात्री वॉरंटशिवाय अटक करू शकतात का?'
      },
      options: {
        en: ['Yes, anytime', 'Yes, for serious crimes only', 'No, except in emergencies', 'Never at night'],
        hi: ['हाँ, कभी भी', 'हाँ, केवल गंभीर अपराधों में', 'नहीं, आपातकाल को छोड़कर', 'रात में कभी नहीं'],
        mr: ['होय, कधीही', 'होय, फक्त गंभीर गुन्ह्यांसाठी', 'नाही, आणीबाणी वगळता', 'रात्री कधीच नाही']
      },
      correctIndex: 2,
      explanation: {
        en: 'Generally, police need a warrant to arrest at night. Exceptions exist for emergencies and serious crimes.',
        hi: 'आम तौर पर, रात में गिरफ्तारी के लिए वारंट जरूरी है। आपातकाल और गंभीर अपराधों में अपवाद हैं।',
        mr: 'सामान्यतः, रात्री अटकेसाठी वॉरंट आवश्यक आहे. आणीबाणी आणि गंभीर गुन्ह्यांसाठी अपवाद आहेत.'
      }
    },
    {
      id: 'pq3',
      question: { 
        en: 'Where can you complain about police torture?',
        hi: 'पुलिस यातना की शिकायत कहाँ कर सकते हैं?',
        mr: 'पोलिस छळाबद्दल कुठे तक्रार करता येते?'
      },
      options: {
        en: ['Only to SP', 'Only to Court', 'NHRC', 'Cannot complain'],
        hi: ['केवल SP को', 'केवल कोर्ट में', 'NHRC', 'शिकायत नहीं कर सकते'],
        mr: ['फक्त SP ला', 'फक्त न्यायालयात', 'NHRC', 'तक्रार करता येत नाही']
      },
      correctIndex: 2,
      explanation: {
        en: 'You can complain to NHRC (National Human Rights Commission) at nhrc.nic.in or call 14433.',
        hi: 'आप NHRC (राष्ट्रीय मानवाधिकार आयोग) में nhrc.nic.in पर या 14433 पर कॉल करके शिकायत कर सकते हैं।',
        mr: 'तुम्ही NHRC (राष्ट्रीय मानवाधिकार आयोग) मध्ये nhrc.nic.in वर किंवा 14433 वर कॉल करून तक्रार करू शकता.'
      }
    },
    {
      id: 'pq4',
      question: { 
        en: 'Is getting a copy of FIR free?',
        hi: 'क्या FIR की कॉपी मुफ्त मिलती है?',
        mr: 'FIR ची प्रत मोफत मिळते का?'
      },
      options: {
        en: ['No, Rs. 100', 'No, Rs. 50', 'Yes, free', 'Only for victims'],
        hi: ['नहीं, ₹100', 'नहीं, ₹50', 'हाँ, मुफ्त', 'केवल पीड़ितों के लिए'],
        mr: ['नाही, ₹100', 'नाही, ₹50', 'होय, मोफत', 'फक्त पीडितांसाठी']
      },
      correctIndex: 2,
      explanation: {
        en: 'Getting a copy of your FIR is your legal right and is completely free of charge.',
        hi: 'FIR की कॉपी पाना आपका कानूनी अधिकार है और यह पूरी तरह मुफ्त है।',
        mr: 'FIR ची प्रत मिळवणे तुमचा कायदेशीर अधिकार आहे आणि ते पूर्णपणे मोफत आहे.'
      }
    }
  ]
};

export const RightsQuizExam: React.FC<RightsQuizExamProps> = ({
  topic,
  onComplete,
  onBack
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [examFinished, setExamFinished] = useState(false);

  // Randomize questions on mount
  const questions = useMemo(() => {
    const allQuestions = quizQuestions[topic] || quizQuestions.fundamental_rights;
    return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(5, allQuestions.length));
  }, [topic]);

  useEffect(() => {
    if (examFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const getLocalizedText = (item: { en: string; hi: string; mr: string }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const getLocalizedArray = (item: { en: string[]; hi: string[]; mr: string[] }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOption;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(answers[currentIndex + 1] ?? null);
      setShowResult(answers[currentIndex + 1] !== undefined);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    setExamFinished(true);
    const correctCount = answers.reduce((acc, answer, idx) => {
      return acc + (answer === questions[idx]?.correctIndex ? 1 : 0);
    }, 0);
    const passed = correctCount >= Math.ceil(questions.length * 0.6);
    onComplete(correctCount, questions.length, passed);
  };

  const getTopicTitle = () => {
    const titles = {
      fundamental_rights: { en: 'Fundamental Rights Exam', hi: 'मौलिक अधिकार परीक्षा', mr: 'मूलभूत अधिकार परीक्षा' },
      consumer_rights: { en: 'Consumer Rights Exam', hi: 'उपभोक्ता अधिकार परीक्षा', mr: 'ग्राहक अधिकार परीक्षा' },
      women_rights: { en: 'Women Rights Exam', hi: 'महिला अधिकार परीक्षा', mr: 'महिला अधिकार परीक्षा' },
      police_rights: { en: 'Police Rights Exam', hi: 'पुलिस अधिकार परीक्षा', mr: 'पोलिस अधिकार परीक्षा' }
    };
    return getLocalizedText(titles[topic] || titles.fundamental_rights);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            {language === 'hi' ? 'छोड़ें' : language === 'mr' ? 'सोडा' : 'Quit'}
          </Button>
          
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft < 60 ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-primary/20 p-2">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{getTopicTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' ? `प्रश्न ${currentIndex + 1} / ${questions.length}` : 
               language === 'mr' ? `प्रश्न ${currentIndex + 1} / ${questions.length}` :
               `Question ${currentIndex + 1} of ${questions.length}`}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6 mb-6 bg-card">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {getLocalizedText(currentQuestion.question)}
          </h2>

          <div className="space-y-3">
            {getLocalizedArray(currentQuestion.options).map((option, idx) => {
              const isCorrect = idx === currentQuestion.correctIndex;
              const isSelected = selectedOption === idx;
              
              let optionClass = 'border-border hover:border-primary/50 bg-card';
              if (showResult) {
                if (isCorrect) {
                  optionClass = 'border-green-500 bg-green-500/10';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'border-destructive bg-destructive/10';
                }
              } else if (isSelected) {
                optionClass = 'border-primary bg-primary/10';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${optionClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current text-sm font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-foreground">{option}</span>
                    {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {getLocalizedText(currentQuestion.explanation)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <Button 
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="flex-1"
          >
            {language === 'hi' ? 'उत्तर जमा करें' : language === 'mr' ? 'उत्तर सबमिट करा' : 'Submit Answer'}
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex-1">
            {currentIndex === questions.length - 1
              ? (language === 'hi' ? 'परिणाम देखें' : language === 'mr' ? 'निकाल पहा' : 'View Results')
              : (language === 'hi' ? 'अगला प्रश्न' : language === 'mr' ? 'पुढील प्रश्न' : 'Next Question')}
          </Button>
        )}
      </div>
    </div>
  );
};
