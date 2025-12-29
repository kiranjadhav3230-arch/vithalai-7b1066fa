import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Clock, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  questionMr: string;
  optionsEn: string[];
  optionsHi: string[];
  optionsMr: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
  explanationMr: string;
}

interface QuestionBank {
  [topicId: string]: QuizQuestion[];
}

interface RightsQuizProps {
  topicId: string;
  userName: string;
  onComplete: (score: number, total: number, passed: boolean) => void;
  onBack: () => void;
}

const questionBank: QuestionBank = {
  'fundamental-rights': [
    {
      id: 'fr1',
      questionEn: 'Which article of the Indian Constitution guarantees equality before law?',
      questionHi: 'भारतीय संविधान का कौन सा अनुच्छेद कानून के समक्ष समानता की गारंटी देता है?',
      questionMr: 'भारतीय संविधानाचे कोणते कलम कायद्यासमोर समानतेची हमी देते?',
      optionsEn: ['Article 12', 'Article 14', 'Article 16', 'Article 18'],
      optionsHi: ['अनुच्छेद 12', 'अनुच्छेद 14', 'अनुच्छेद 16', 'अनुच्छेद 18'],
      optionsMr: ['कलम 12', 'कलम 14', 'कलम 16', 'कलम 18'],
      correctIndex: 1,
      explanationEn: 'Article 14 states that the State shall not deny to any person equality before the law.',
      explanationHi: 'अनुच्छेद 14 कहता है कि राज्य किसी भी व्यक्ति को कानून के समक्ष समानता से वंचित नहीं करेगा।',
      explanationMr: 'कलम 14 सांगते की राज्य कोणत्याही व्यक्तीला कायद्यासमोर समानतेपासून वंचित ठेवणार नाही.'
    },
    {
      id: 'fr2',
      questionEn: 'Which article abolishes untouchability in India?',
      questionHi: 'कौन सा अनुच्छेद भारत में अस्पृश्यता को समाप्त करता है?',
      questionMr: 'कोणते कलम भारतात अस्पृश्यता समाप्त करते?',
      optionsEn: ['Article 15', 'Article 16', 'Article 17', 'Article 18'],
      optionsHi: ['अनुच्छेद 15', 'अनुच्छेद 16', 'अनुच्छेद 17', 'अनुच्छेद 18'],
      optionsMr: ['कलम 15', 'कलम 16', 'कलम 17', 'कलम 18'],
      correctIndex: 2,
      explanationEn: 'Article 17 abolishes untouchability and forbids its practice in any form.',
      explanationHi: 'अनुच्छेद 17 अस्पृश्यता को समाप्त करता है और किसी भी रूप में इसके अभ्यास को प्रतिबंधित करता है।',
      explanationMr: 'कलम 17 अस्पृश्यता समाप्त करते आणि कोणत्याही स्वरूपात त्याच्या आचरणावर बंदी घालते.'
    },
    {
      id: 'fr3',
      questionEn: 'Right to Education is a fundamental right for children of which age group?',
      questionHi: 'शिक्षा का अधिकार किस आयु वर्ग के बच्चों के लिए मौलिक अधिकार है?',
      questionMr: 'शिक्षणाचा हक्क कोणत्या वयोगटातील मुलांसाठी मूलभूत हक्क आहे?',
      optionsEn: ['0-14 years', '6-14 years', '5-15 years', '6-18 years'],
      optionsHi: ['0-14 वर्ष', '6-14 वर्ष', '5-15 वर्ष', '6-18 वर्ष'],
      optionsMr: ['0-14 वर्षे', '6-14 वर्षे', '5-15 वर्षे', '6-18 वर्षे'],
      correctIndex: 1,
      explanationEn: 'Article 21A provides free and compulsory education to all children aged 6 to 14 years.',
      explanationHi: 'अनुच्छेद 21A 6 से 14 वर्ष की आयु के सभी बच्चों को मुफ्त और अनिवार्य शिक्षा प्रदान करता है।',
      explanationMr: 'कलम 21A 6 ते 14 वर्षे वयोगटातील सर्व मुलांना मोफत आणि अनिवार्य शिक्षण प्रदान करते.'
    },
    {
      id: 'fr4',
      questionEn: 'Dr. Ambedkar called which right the "Heart and Soul of the Constitution"?',
      questionHi: 'डॉ. अंबेडकर ने किस अधिकार को "संविधान की आत्मा" कहा?',
      questionMr: 'डॉ. आंबेडकरांनी कोणत्या हक्काला "संविधानाचे हृदय आणि आत्मा" म्हटले?',
      optionsEn: ['Right to Equality', 'Right to Freedom', 'Right to Constitutional Remedies', 'Right to Life'],
      optionsHi: ['समानता का अधिकार', 'स्वतंत्रता का अधिकार', 'संवैधानिक उपचारों का अधिकार', 'जीवन का अधिकार'],
      optionsMr: ['समानतेचा हक्क', 'स्वातंत्र्याचा हक्क', 'घटनात्मक उपायांचा हक्क', 'जगण्याचा हक्क'],
      correctIndex: 2,
      explanationEn: 'Article 32 (Right to Constitutional Remedies) was called the heart and soul of the Constitution by Dr. Ambedkar.',
      explanationHi: 'अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार) को डॉ. अंबेडकर ने संविधान की आत्मा कहा था।',
      explanationMr: 'कलम 32 (घटनात्मक उपायांचा हक्क) ला डॉ. आंबेडकरांनी संविधानाचे हृदय आणि आत्मा म्हटले होते.'
    },
    {
      id: 'fr5',
      questionEn: 'Which article prohibits child labor in hazardous industries?',
      questionHi: 'कौन सा अनुच्छेद खतरनाक उद्योगों में बाल श्रम पर रोक लगाता है?',
      questionMr: 'कोणते कलम धोकादायक उद्योगांमध्ये बालमजुरीवर बंदी घालते?',
      optionsEn: ['Article 22', 'Article 23', 'Article 24', 'Article 25'],
      optionsHi: ['अनुच्छेद 22', 'अनुच्छेद 23', 'अनुच्छेद 24', 'अनुच्छेद 25'],
      optionsMr: ['कलम 22', 'कलम 23', 'कलम 24', 'कलम 25'],
      correctIndex: 2,
      explanationEn: 'Article 24 prohibits employment of children below 14 years in factories, mines, or hazardous employment.',
      explanationHi: 'अनुच्छेद 24 कारखानों, खानों या खतरनाक रोजगार में 14 वर्ष से कम आयु के बच्चों के रोजगार पर रोक लगाता है।',
      explanationMr: 'कलम 24 कारखाने, खाणी किंवा धोकादायक रोजगारात 14 वर्षांखालील मुलांच्या नोकरीवर बंदी घालते.'
    },
    {
      id: 'fr6',
      questionEn: 'How many types of writs can be issued under Article 32?',
      questionHi: 'अनुच्छेद 32 के तहत कितने प्रकार की रिट जारी की जा सकती हैं?',
      questionMr: 'कलम 32 अंतर्गत किती प्रकारच्या रिट जारी केल्या जाऊ शकतात?',
      optionsEn: ['3', '4', '5', '6'],
      optionsHi: ['3', '4', '5', '6'],
      optionsMr: ['3', '4', '5', '6'],
      correctIndex: 2,
      explanationEn: '5 types of writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto.',
      explanationHi: '5 प्रकार की रिट: बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, और अधिकार पृच्छा।',
      explanationMr: '5 प्रकारच्या रिट: बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, आणि अधिकार पृच्छा.'
    },
    {
      id: 'fr7',
      questionEn: 'Freedom of speech and expression is guaranteed under which article?',
      questionHi: 'भाषण और अभिव्यक्ति की स्वतंत्रता किस अनुच्छेद के तहत गारंटीकृत है?',
      questionMr: 'भाषण आणि अभिव्यक्ती स्वातंत्र्य कोणत्या कलमाअंतर्गत हमी दिलेले आहे?',
      optionsEn: ['Article 19(1)(a)', 'Article 20', 'Article 21', 'Article 22'],
      optionsHi: ['अनुच्छेद 19(1)(a)', 'अनुच्छेद 20', 'अनुच्छेद 21', 'अनुच्छेद 22'],
      optionsMr: ['कलम 19(1)(a)', 'कलम 20', 'कलम 21', 'कलम 22'],
      correctIndex: 0,
      explanationEn: 'Article 19(1)(a) guarantees freedom of speech and expression to all citizens.',
      explanationHi: 'अनुच्छेद 19(1)(a) सभी नागरिकों को भाषण और अभिव्यक्ति की स्वतंत्रता की गारंटी देता है।',
      explanationMr: 'कलम 19(1)(a) सर्व नागरिकांना भाषण आणि अभिव्यक्ती स्वातंत्र्याची हमी देते.'
    },
    {
      id: 'fr8',
      questionEn: 'Which right cannot be suspended even during a national emergency?',
      questionHi: 'राष्ट्रीय आपातकाल के दौरान भी कौन सा अधिकार निलंबित नहीं किया जा सकता?',
      questionMr: 'राष्ट्रीय आणीबाणीच्या वेळीही कोणता हक्क निलंबित करता येत नाही?',
      optionsEn: ['Right to Freedom of Speech', 'Right to Life and Personal Liberty', 'Right to Equality', 'Right to Education'],
      optionsHi: ['भाषण की स्वतंत्रता का अधिकार', 'जीवन और व्यक्तिगत स्वतंत्रता का अधिकार', 'समानता का अधिकार', 'शिक्षा का अधिकार'],
      optionsMr: ['भाषण स्वातंत्र्याचा हक्क', 'जीवन आणि वैयक्तिक स्वातंत्र्याचा हक्क', 'समानतेचा हक्क', 'शिक्षणाचा हक्क'],
      correctIndex: 1,
      explanationEn: 'Article 20 and 21 (Right to Life) cannot be suspended even during national emergency.',
      explanationHi: 'अनुच्छेद 20 और 21 (जीवन का अधिकार) राष्ट्रीय आपातकाल के दौरान भी निलंबित नहीं किया जा सकता।',
      explanationMr: 'कलम 20 आणि 21 (जगण्याचा हक्क) राष्ट्रीय आणीबाणीच्या वेळीही निलंबित करता येत नाही.'
    }
  ],
  'police-rights': [
    {
      id: 'pr1',
      questionEn: 'Within how many hours must an arrested person be produced before a magistrate?',
      questionHi: 'गिरफ्तार व्यक्ति को कितने घंटों के भीतर मजिस्ट्रेट के सामने पेश किया जाना चाहिए?',
      questionMr: 'अटक केलेल्या व्यक्तीला किती तासांच्या आत न्यायदंडाधिकाऱ्यांसमोर हजर करणे आवश्यक आहे?',
      optionsEn: ['12 hours', '24 hours', '48 hours', '72 hours'],
      optionsHi: ['12 घंटे', '24 घंटे', '48 घंटे', '72 घंटे'],
      optionsMr: ['12 तास', '24 तास', '48 तास', '72 तास'],
      correctIndex: 1,
      explanationEn: 'Article 22 mandates that an arrested person must be produced before the nearest magistrate within 24 hours.',
      explanationHi: 'अनुच्छेद 22 के अनुसार गिरफ्तार व्यक्ति को 24 घंटे के भीतर निकटतम मजिस्ट्रेट के सामने पेश किया जाना चाहिए।',
      explanationMr: 'कलम 22 नुसार अटक केलेल्या व्यक्तीला 24 तासांच्या आत जवळच्या न्यायदंडाधिकाऱ्यांसमोर हजर करणे आवश्यक आहे.'
    },
    {
      id: 'pr2',
      questionEn: 'What is a Zero FIR?',
      questionHi: 'जीरो FIR क्या है?',
      questionMr: 'शून्य FIR म्हणजे काय?',
      optionsEn: ['FIR with zero charges', 'FIR filed at any police station regardless of jurisdiction', 'FIR filed online', 'FIR without witness'],
      optionsHi: ['बिना आरोप वाली FIR', 'क्षेत्राधिकार की परवाह किए बिना किसी भी थाने में दर्ज FIR', 'ऑनलाइन दर्ज FIR', 'बिना गवाह वाली FIR'],
      optionsMr: ['शून्य आरोपांसह FIR', 'अधिकारक्षेत्राची पर्वा न करता कोणत्याही पोलीस स्टेशनवर दाखल केलेली FIR', 'ऑनलाइन दाखल केलेली FIR', 'साक्षीदाराशिवाय FIR'],
      correctIndex: 1,
      explanationEn: 'Zero FIR can be filed at any police station regardless of where the crime occurred. It will be transferred to the concerned station later.',
      explanationHi: 'जीरो FIR किसी भी थाने में दर्ज की जा सकती है, भले ही अपराध कहीं भी हुआ हो। बाद में इसे संबंधित थाने में स्थानांतरित किया जाएगा।',
      explanationMr: 'शून्य FIR गुन्हा कुठेही घडला असला तरी कोणत्याही पोलीस स्टेशनवर दाखल करता येते. नंतर ती संबंधित स्टेशनला हस्तांतरित केली जाईल.'
    },
    {
      id: 'pr3',
      questionEn: 'What should you do if police refuse to file your FIR?',
      questionHi: 'अगर पुलिस FIR दर्ज करने से मना करे तो क्या करना चाहिए?',
      questionMr: 'पोलिसांनी FIR नोंदवण्यास नकार दिल्यास काय करावे?',
      optionsEn: ['Do nothing', 'Complain to SP/DCP or approach court', 'Pay money to police', 'File complaint to PM'],
      optionsHi: ['कुछ न करें', 'SP/DCP को शिकायत करें या कोर्ट जाएं', 'पुलिस को पैसे दें', 'PM को शिकायत करें'],
      optionsMr: ['काहीच करू नका', 'SP/DCP कडे तक्रार करा किंवा न्यायालयात जा', 'पोलिसांना पैसे द्या', 'पंतप्रधानांकडे तक्रार करा'],
      correctIndex: 1,
      explanationEn: 'If police refuse to file FIR, you can complain to the Superintendent of Police (SP) or approach the Magistrate under Section 156(3) CrPC.',
      explanationHi: 'यदि पुलिस FIR दर्ज करने से मना करे, तो आप पुलिस अधीक्षक (SP) को शिकायत कर सकते हैं या धारा 156(3) CrPC के तहत मजिस्ट्रेट से संपर्क कर सकते हैं।',
      explanationMr: 'पोलिसांनी FIR नोंदवण्यास नकार दिल्यास, तुम्ही पोलीस अधीक्षक (SP) कडे तक्रार करू शकता किंवा कलम 156(3) CrPC अंतर्गत न्यायदंडाधिकाऱ्यांशी संपर्क साधू शकता.'
    },
    {
      id: 'pr4',
      questionEn: 'Can police arrest you without a warrant?',
      questionHi: 'क्या पुलिस आपको बिना वारंट के गिरफ्तार कर सकती है?',
      questionMr: 'पोलीस तुम्हाला वॉरंटशिवाय अटक करू शकतात का?',
      optionsEn: ['Never', 'Always', 'Only for cognizable offenses', 'Only with permission from DM'],
      optionsHi: ['कभी नहीं', 'हमेशा', 'केवल संज्ञेय अपराधों के लिए', 'केवल DM की अनुमति से'],
      optionsMr: ['कधीच नाही', 'नेहमी', 'फक्त दखलपात्र गुन्ह्यांसाठी', 'फक्त DM च्या परवानगीने'],
      correctIndex: 2,
      explanationEn: 'Police can arrest without warrant only for cognizable offenses (serious crimes like murder, robbery, etc.).',
      explanationHi: 'पुलिस केवल संज्ञेय अपराधों (गंभीर अपराध जैसे हत्या, डकैती आदि) के लिए ही बिना वारंट गिरफ्तार कर सकती है।',
      explanationMr: 'पोलीस फक्त दखलपात्र गुन्ह्यांसाठी (खून, दरोडा इ. गंभीर गुन्हे) वॉरंटशिवाय अटक करू शकतात.'
    }
  ],
  'women-rights': [
    {
      id: 'wr1',
      questionEn: 'Who can arrest a woman?',
      questionHi: 'एक महिला को कौन गिरफ्तार कर सकता है?',
      questionMr: 'महिलेला कोण अटक करू शकते?',
      optionsEn: ['Any police officer', 'Only female police officer', 'Only male police officer', 'Only IPS officer'],
      optionsHi: ['कोई भी पुलिस अधिकारी', 'केवल महिला पुलिस अधिकारी', 'केवल पुरुष पुलिस अधिकारी', 'केवल IPS अधिकारी'],
      optionsMr: ['कोणताही पोलीस अधिकारी', 'फक्त महिला पोलीस अधिकारी', 'फक्त पुरुष पोलीस अधिकारी', 'फक्त IPS अधिकारी'],
      correctIndex: 1,
      explanationEn: 'According to Section 46(4) of CrPC, a woman can only be arrested by a female police officer.',
      explanationHi: 'CrPC की धारा 46(4) के अनुसार, एक महिला को केवल महिला पुलिस अधिकारी ही गिरफ्तार कर सकती है।',
      explanationMr: 'CrPC च्या कलम 46(4) नुसार, महिलेला फक्त महिला पोलीस अधिकारीच अटक करू शकते.'
    },
    {
      id: 'wr2',
      questionEn: 'When can a woman NOT be arrested?',
      questionHi: 'महिला को कब गिरफ्तार नहीं किया जा सकता?',
      questionMr: 'महिलेला कधी अटक करता येत नाही?',
      optionsEn: ['During festivals', 'After sunset and before sunrise', 'On weekends', 'During pregnancy only'],
      optionsHi: ['त्योहारों के दौरान', 'सूर्यास्त के बाद और सूर्योदय से पहले', 'सप्ताहांत पर', 'केवल गर्भावस्था के दौरान'],
      optionsMr: ['सणांच्या वेळी', 'सूर्यास्तानंतर आणि सूर्योदयापूर्वी', 'आठवड्याच्या शेवटी', 'फक्त गर्भधारणेच्या वेळी'],
      correctIndex: 1,
      explanationEn: 'Women cannot be arrested after sunset and before sunrise except in exceptional circumstances with a Magistrate\'s order.',
      explanationHi: 'मजिस्ट्रेट के आदेश के साथ असाधारण परिस्थितियों को छोड़कर, महिलाओं को सूर्यास्त के बाद और सूर्योदय से पहले गिरफ्तार नहीं किया जा सकता।',
      explanationMr: 'न्यायदंडाधिकाऱ्यांच्या आदेशासह अपवादात्मक परिस्थिती वगळता, महिलांना सूर्यास्तानंतर आणि सूर्योदयापूर्वी अटक करता येत नाही.'
    },
    {
      id: 'wr3',
      questionEn: 'What is the Women Helpline number in India?',
      questionHi: 'भारत में महिला हेल्पलाइन नंबर क्या है?',
      questionMr: 'भारतातील महिला हेल्पलाइन नंबर कोणता आहे?',
      optionsEn: ['100', '108', '1091', '112'],
      optionsHi: ['100', '108', '1091', '112'],
      optionsMr: ['100', '108', '1091', '112'],
      correctIndex: 2,
      explanationEn: '1091 is the dedicated Women Helpline available 24/7 across India.',
      explanationHi: '1091 समर्पित महिला हेल्पलाइन है जो पूरे भारत में 24/7 उपलब्ध है।',
      explanationMr: '1091 हा संपूर्ण भारतात 24/7 उपलब्ध असलेला समर्पित महिला हेल्पलाइन आहे.'
    },
    {
      id: 'wr4',
      questionEn: 'Which Act protects women from domestic violence?',
      questionHi: 'कौन सा अधिनियम महिलाओं को घरेलू हिंसा से बचाता है?',
      questionMr: 'कोणता कायदा महिलांचे घरगुती हिंसाचारापासून संरक्षण करतो?',
      optionsEn: ['POSH Act 2013', 'Domestic Violence Act 2005', 'Dowry Prohibition Act 1961', 'POCSO Act 2012'],
      optionsHi: ['POSH अधिनियम 2013', 'घरेलू हिंसा अधिनियम 2005', 'दहेज प्रतिषेध अधिनियम 1961', 'POCSO अधिनियम 2012'],
      optionsMr: ['POSH कायदा 2013', 'घरगुती हिंसाचार कायदा 2005', 'हुंडा प्रतिबंध कायदा 1961', 'POCSO कायदा 2012'],
      correctIndex: 1,
      explanationEn: 'The Protection of Women from Domestic Violence Act, 2005 protects women from physical, emotional, and economic abuse at home.',
      explanationHi: 'घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम, 2005 महिलाओं को घर पर शारीरिक, भावनात्मक और आर्थिक दुर्व्यवहार से बचाता है।',
      explanationMr: 'घरगुती हिंसाचारापासून महिलांचे संरक्षण कायदा, 2005 महिलांचे घरी शारीरिक, भावनिक आणि आर्थिक गैरवर्तनापासून संरक्षण करतो.'
    }
  ]
};

const PASS_PERCENTAGE = 60;
const QUIZ_TIME_SECONDS = 300; // 5 minutes

export const RightsQuiz: React.FC<RightsQuizProps> = ({ topicId, userName, onComplete, onBack }) => {
  const { language } = useLanguage();
  
  // Shuffle and select 5 random questions
  const questions = useMemo(() => {
    const allQuestions = questionBank[topicId] || questionBank['fundamental-rights'];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [topicId]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (quizCompleted || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizCompleted, showResult]);

  const getLocalizedText = (en: string, hi: string, mr: string) => {
    switch (language) {
      case 'hi': return hi;
      case 'mr': return mr;
      default: return en;
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    const correctAnswers = answers.filter((ans, idx) => ans === questions[idx]?.correctIndex).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= PASS_PERCENTAGE;
    setShowResult(true);
    onComplete(correctAnswers, questions.length, passed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctCount = answers.filter((ans, idx) => ans === questions[idx]?.correctIndex).length;
  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const passed = scorePercentage >= PASS_PERCENTAGE;

  if (showResult) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex flex-col items-center justify-center py-8">
          <div className={cn(
            "mb-6 flex h-24 w-24 items-center justify-center rounded-full",
            passed ? "bg-green-500/20" : "bg-destructive/20"
          )}>
            {passed ? (
              <Trophy className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>

          <h1 className="mb-2 text-2xl font-bold text-foreground">
            {passed 
              ? getLocalizedText('Congratulations! 🎉', 'बधाई हो! 🎉', 'अभिनंदन! 🎉')
              : getLocalizedText('Keep Learning!', 'सीखते रहें!', 'शिकत रहा!')
            }
          </h1>

          <p className="mb-6 text-center text-muted-foreground">
            {passed
              ? getLocalizedText(
                  `You scored ${scorePercentage}% and passed the quiz!`,
                  `आपने ${scorePercentage}% स्कोर किया और परीक्षा पास की!`,
                  `तुम्ही ${scorePercentage}% गुण मिळवले आणि परीक्षा पास केली!`
                )
              : getLocalizedText(
                  `You scored ${scorePercentage}%. You need ${PASS_PERCENTAGE}% to pass.`,
                  `आपने ${scorePercentage}% स्कोर किया। पास होने के लिए ${PASS_PERCENTAGE}% चाहिए।`,
                  `तुम्ही ${scorePercentage}% गुण मिळवले. पास होण्यासाठी ${PASS_PERCENTAGE}% आवश्यक आहे.`
                )
            }
          </p>

          <div className="mb-6 grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-card p-4">
              <p className="text-2xl font-bold text-primary">{correctCount}</p>
              <p className="text-sm text-muted-foreground">
                {getLocalizedText('Correct', 'सही', 'बरोबर')}
              </p>
            </div>
            <div className="rounded-lg bg-card p-4">
              <p className="text-2xl font-bold text-destructive">{questions.length - correctCount}</p>
              <p className="text-sm text-muted-foreground">
                {getLocalizedText('Wrong', 'गलत', 'चूक')}
              </p>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
              {getLocalizedText('Back', 'वापस', 'मागे')}
            </Button>
            {passed && (
              <Button className="flex-1 gap-2">
                <Trophy className="h-4 w-4" />
                {getLocalizedText('Get Certificate', 'प्रमाणपत्र लें', 'प्रमाणपत्र घ्या')}
              </Button>
            )}
            {!passed && (
              <Button 
                className="flex-1 gap-2" 
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setAnswers(Array(questions.length).fill(null));
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setShowResult(false);
                  setQuizCompleted(false);
                  setTimeLeft(QUIZ_TIME_SECONDS);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                {getLocalizedText('Try Again', 'फिर से कोशिश करें', 'पुन्हा प्रयत्न करा')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1",
          timeLeft < 60 ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
        )}>
          <Clock className="h-4 w-4" />
          <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-muted-foreground">
          <span>{getLocalizedText('Question', 'प्रश्न', 'प्रश्न')} {currentQuestionIndex + 1}/{questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-lg font-medium text-foreground">
            {getLocalizedText(currentQuestion.questionEn, currentQuestion.questionHi, currentQuestion.questionMr)}
          </p>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="mb-6 space-y-3">
        {(language === 'hi' ? currentQuestion.optionsHi : 
          language === 'mr' ? currentQuestion.optionsMr : 
          currentQuestion.optionsEn).map((option, index) => (
          <button
            key={index}
            className={cn(
              "w-full rounded-xl border p-4 text-left transition-all",
              selectedAnswer === index && !showExplanation && "border-primary bg-primary/10",
              showExplanation && index === currentQuestion.correctIndex && "border-green-500 bg-green-500/10",
              showExplanation && selectedAnswer === index && index !== currentQuestion.correctIndex && "border-destructive bg-destructive/10",
              !showExplanation && selectedAnswer !== index && "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
            onClick={() => handleSelectAnswer(index)}
            disabled={showExplanation}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                selectedAnswer === index && !showExplanation && "bg-primary text-primary-foreground",
                showExplanation && index === currentQuestion.correctIndex && "bg-green-500 text-white",
                showExplanation && selectedAnswer === index && index !== currentQuestion.correctIndex && "bg-destructive text-white",
                !showExplanation && selectedAnswer !== index && "bg-muted text-muted-foreground"
              )}>
                {showExplanation && index === currentQuestion.correctIndex ? (
                  <CheckCircle className="h-5 w-5" />
                ) : showExplanation && selectedAnswer === index && index !== currentQuestion.correctIndex ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </div>
              <span className="text-foreground">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm text-foreground">
              💡 {getLocalizedText(currentQuestion.explanationEn, currentQuestion.explanationHi, currentQuestion.explanationMr)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <Button
        className="w-full"
        onClick={showExplanation ? handleNextQuestion : handleConfirmAnswer}
        disabled={selectedAnswer === null && !showExplanation}
      >
        {showExplanation
          ? currentQuestionIndex < questions.length - 1
            ? getLocalizedText('Next Question', 'अगला प्रश्न', 'पुढचा प्रश्न')
            : getLocalizedText('See Results', 'परिणाम देखें', 'निकाल पहा')
          : getLocalizedText('Confirm Answer', 'उत्तर की पुष्टि करें', 'उत्तर निश्चित करा')
        }
      </Button>
    </div>
  );
};
