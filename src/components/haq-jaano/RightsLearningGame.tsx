import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, Lightbulb, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';

interface LearningCard {
  id: string;
  title: { en: string; hi: string; mr: string };
  content: { en: string; hi: string; mr: string };
  keyPoints: { en: string[]; hi: string[]; mr: string[] };
  example: { en: string; hi: string; mr: string };
}

interface RightsLearningGameProps {
  topic: 'fundamental_rights' | 'consumer_rights' | 'women_rights' | 'police_rights' | 'rti_rights' | 'cyber_rights' | 'tenant_rights' | 'senior_citizen_rights';
  onComplete: (learnedCards: LearningCard[]) => void;
  onBack: () => void;
}

const learningContent: Record<string, LearningCard[]> = {
  fundamental_rights: [
    {
      id: 'fr1',
      title: { en: 'Right to Equality (Articles 14-18)', hi: 'समानता का अधिकार (अनुच्छेद 14-18)', mr: 'समानतेचा अधिकार (कलम 14-18)' },
      content: { 
        en: 'Every citizen is equal before law. No discrimination based on religion, race, caste, sex, or place of birth.',
        hi: 'हर नागरिक कानून के समक्ष समान है। धर्म, जाति, लिंग या जन्मस्थान के आधार पर कोई भेदभाव नहीं।',
        mr: 'प्रत्येक नागरिक कायद्यासमोर समान आहे. धर्म, जात, लिंग किंवा जन्मस्थानाच्या आधारावर भेदभाव नाही.'
      },
      keyPoints: {
        en: ['Equality before law', 'No untouchability', 'Equal opportunity in government jobs'],
        hi: ['कानून के समक्ष समानता', 'अस्पृश्यता का निषेध', 'सरकारी नौकरियों में समान अवसर'],
        mr: ['कायद्यासमोर समानता', 'अस्पृश्यता निषेध', 'सरकारी नोकऱ्यांमध्ये समान संधी']
      },
      example: {
        en: 'If a restaurant refuses you entry based on caste, you can file a complaint under the Protection of Civil Rights Act.',
        hi: 'अगर कोई रेस्टोरेंट जाति के आधार पर प्रवेश नहीं देता, तो आप नागरिक अधिकार संरक्षण अधिनियम के तहत शिकायत कर सकते हैं।',
        mr: 'जर एखादे रेस्टॉरंट जातीच्या आधारावर प्रवेश नाकारत असेल, तर तुम्ही नागरी हक्क संरक्षण कायद्यान्वये तक्रार दाखल करू शकता.'
      }
    },
    {
      id: 'fr2',
      title: { en: 'Right to Freedom (Articles 19-22)', hi: 'स्वतंत्रता का अधिकार (अनुच्छेद 19-22)', mr: 'स्वातंत्र्याचा अधिकार (कलम 19-22)' },
      content: { 
        en: 'Citizens have freedom of speech, assembly, movement, and profession. You cannot be arrested without proper procedure.',
        hi: 'नागरिकों को भाषण, सभा, आवाजाही और पेशे की स्वतंत्रता है। बिना उचित प्रक्रिया के गिरफ्तारी नहीं हो सकती।',
        mr: 'नागरिकांना भाषण, सभा, वाहतूक आणि व्यवसायाचे स्वातंत्र्य आहे. योग्य प्रक्रियेशिवाय अटक होऊ शकत नाही.'
      },
      keyPoints: {
        en: ['Freedom of speech', 'Right to peaceful assembly', 'Right to move freely', 'Protection against arrest'],
        hi: ['अभिव्यक्ति की स्वतंत्रता', 'शांतिपूर्ण सभा का अधिकार', 'स्वतंत्र आवाजाही', 'गिरफ्तारी से सुरक्षा'],
        mr: ['अभिव्यक्ती स्वातंत्र्य', 'शांततापूर्ण सभेचा अधिकार', 'मुक्त वाहतूक', 'अटकेपासून संरक्षण']
      },
      example: {
        en: 'Police must inform you why you are being arrested and present you before a magistrate within 24 hours.',
        hi: 'पुलिस को आपको गिरफ्तारी का कारण बताना होगा और 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश करना होगा।',
        mr: 'पोलिसांनी तुम्हाला अटकेचे कारण सांगणे आवश्यक आहे आणि 24 तासांच्या आत मॅजिस्ट्रेटसमोर हजर करणे आवश्यक आहे.'
      }
    },
    {
      id: 'fr3',
      title: { en: 'Right Against Exploitation (Articles 23-24)', hi: 'शोषण के विरुद्ध अधिकार (अनुच्छेद 23-24)', mr: 'शोषणाविरुद्ध अधिकार (कलम 23-24)' },
      content: { 
        en: 'Human trafficking and forced labor are prohibited. Children under 14 cannot work in factories or hazardous conditions.',
        hi: 'मानव तस्करी और बंधुआ मजदूरी प्रतिबंधित है। 14 साल से कम उम्र के बच्चे कारखानों में काम नहीं कर सकते।',
        mr: 'मानवी तस्करी आणि बंधपत्री कामगार निषिद्ध आहे. 14 वर्षांपेक्षा कमी वयाची मुले कारखान्यात काम करू शकत नाहीत.'
      },
      keyPoints: {
        en: ['No human trafficking', 'No forced labor', 'No child labor under 14', 'Protection from hazardous work'],
        hi: ['मानव तस्करी निषेध', 'बंधुआ मजदूरी निषेध', '14 से कम बाल श्रम निषेध', 'खतरनाक काम से सुरक्षा'],
        mr: ['मानवी तस्करी निषेध', 'बंधपत्री कामगार निषेध', '14 वर्षांखालील बालकामगार निषेध', 'धोकादायक कामापासून संरक्षण']
      },
      example: {
        en: 'If you see a child working at a tea stall, you can report to Childline (1098) or local police.',
        hi: 'अगर आप किसी चाय की दुकान पर बच्चे को काम करते देखें, तो चाइल्डलाइन (1098) या पुलिस को सूचित करें।',
        mr: 'जर तुम्ही एखाद्या चहाच्या टपरीवर मुलाला काम करताना पाहिलात, तर चाइल्डलाइन (1098) किंवा पोलिसांना कळवा.'
      }
    },
    {
      id: 'fr4',
      title: { en: 'Right to Freedom of Religion (Articles 25-28)', hi: 'धर्म की स्वतंत्रता का अधिकार (अनुच्छेद 25-28)', mr: 'धर्मस्वातंत्र्याचा अधिकार (कलम 25-28)' },
      content: { 
        en: 'Every person has freedom to practice, profess, and propagate any religion. The state cannot impose any religion.',
        hi: 'हर व्यक्ति को किसी भी धर्म को मानने, आचरण करने और प्रचार करने की स्वतंत्रता है।',
        mr: 'प्रत्येक व्यक्तीला कोणताही धर्म मानण्याचे, आचरण करण्याचे आणि प्रचार करण्याचे स्वातंत्र्य आहे.'
      },
      keyPoints: {
        en: ['Freedom to practice religion', 'Manage religious affairs', 'No religious tax', 'No forced religious instruction'],
        hi: ['धर्म पालन की स्वतंत्रता', 'धार्मिक मामलों का प्रबंधन', 'कोई धार्मिक कर नहीं', 'जबरन धार्मिक शिक्षा नहीं'],
        mr: ['धर्म पालनाचे स्वातंत्र्य', 'धार्मिक व्यवहार व्यवस्थापन', 'धार्मिक कर नाही', 'जबरदस्ती धार्मिक शिक्षण नाही']
      },
      example: {
        en: 'Your employer cannot force you to participate in religious activities or discriminate based on your faith.',
        hi: 'आपका नियोक्ता आपको धार्मिक गतिविधियों में भाग लेने के लिए मजबूर नहीं कर सकता।',
        mr: 'तुमचा मालक तुम्हाला धार्मिक कार्यक्रमांमध्ये भाग घेण्यास भाग पाडू शकत नाही.'
      }
    },
    {
      id: 'fr5',
      title: { en: 'Cultural & Educational Rights (Articles 29-30)', hi: 'सांस्कृतिक और शैक्षिक अधिकार (अनुच्छेद 29-30)', mr: 'सांस्कृतिक आणि शैक्षणिक अधिकार (कलम 29-30)' },
      content: { 
        en: 'Minorities can preserve their culture and language. They have the right to establish educational institutions.',
        hi: 'अल्पसंख्यक अपनी संस्कृति और भाषा को संरक्षित कर सकते हैं। उन्हें शैक्षणिक संस्थान स्थापित करने का अधिकार है।',
        mr: 'अल्पसंख्याक त्यांची संस्कृती आणि भाषा जतन करू शकतात. त्यांना शैक्षणिक संस्था स्थापन करण्याचा अधिकार आहे.'
      },
      keyPoints: {
        en: ['Protect culture & language', 'Establish educational institutions', 'No denial of admission', 'State aid without discrimination'],
        hi: ['संस्कृति और भाषा संरक्षण', 'शैक्षणिक संस्थान स्थापना', 'प्रवेश से इंकार नहीं', 'बिना भेदभाव राज्य सहायता'],
        mr: ['संस्कृती आणि भाषा संरक्षण', 'शैक्षणिक संस्था स्थापना', 'प्रवेश नाकारता येत नाही', 'भेदभावाशिवाय राज्य मदत']
      },
      example: {
        en: 'A minority community can run its own school and teach in their mother tongue.',
        hi: 'एक अल्पसंख्यक समुदाय अपना स्कूल चला सकता है और अपनी मातृभाषा में पढ़ा सकता है।',
        mr: 'एक अल्पसंख्याक समुदाय स्वतःची शाळा चालवू शकतो आणि मातृभाषेत शिकवू शकतो.'
      }
    },
    {
      id: 'fr6',
      title: { en: 'Right to Constitutional Remedies (Article 32)', hi: 'संवैधानिक उपचारों का अधिकार (अनुच्छेद 32)', mr: 'घटनात्मक उपायांचा अधिकार (कलम 32)' },
      content: { 
        en: 'You can directly approach the Supreme Court if your fundamental rights are violated. This is the heart of the Constitution.',
        hi: 'अगर आपके मौलिक अधिकारों का उल्लंघन होता है, तो आप सीधे सुप्रीम कोर्ट जा सकते हैं।',
        mr: 'जर तुमच्या मूलभूत अधिकारांचे उल्लंघन झाले तर तुम्ही थेट सर्वोच्च न्यायालयात जाऊ शकता.'
      },
      keyPoints: {
        en: ['Direct access to Supreme Court', 'File writ petitions', 'Habeas Corpus for illegal detention', 'Heart of Constitution'],
        hi: ['सुप्रीम कोर्ट में सीधी पहुंच', 'रिट याचिका दायर करें', 'गैरकानूनी हिरासत के लिए बंदी प्रत्यक्षीकरण', 'संविधान का हृदय'],
        mr: ['सर्वोच्च न्यायालयात थेट प्रवेश', 'रिट याचिका दाखल करा', 'बेकायदेशीर अटकेसाठी हेबियस कॉर्पस', 'घटनेचे हृदय']
      },
      example: {
        en: 'If police detain you illegally, you or your family can file a Habeas Corpus petition in court.',
        hi: 'अगर पुलिस आपको गैरकानूनी तरीके से हिरासत में रखती है, तो आप या आपका परिवार कोर्ट में बंदी प्रत्यक्षीकरण याचिका दायर कर सकते हैं।',
        mr: 'जर पोलिसांनी तुम्हाला बेकायदेशीरपणे अटक केली, तर तुम्ही किंवा तुमचे कुटुंब न्यायालयात हेबियस कॉर्पस याचिका दाखल करू शकता.'
      }
    }
  ],
  consumer_rights: [
    {
      id: 'cr1',
      title: { en: 'Right to Safety', hi: 'सुरक्षा का अधिकार', mr: 'सुरक्षिततेचा अधिकार' },
      content: { 
        en: 'You have the right to be protected against goods and services that are hazardous to health and life.',
        hi: 'आपको ऐसे उत्पादों और सेवाओं से सुरक्षा का अधिकार है जो स्वास्थ्य और जीवन के लिए खतरनाक हैं।',
        mr: 'आरोग्य आणि जीवनासाठी घातक असलेल्या वस्तू आणि सेवांपासून संरक्षणाचा तुम्हाला अधिकार आहे.'
      },
      keyPoints: {
        en: ['Safe products only', 'Check ISI/AGMARK marks', 'Report unsafe goods', 'Claim compensation'],
        hi: ['केवल सुरक्षित उत्पाद', 'ISI/AGMARK चिह्न जांचें', 'असुरक्षित सामान की रिपोर्ट करें', 'मुआवजे का दावा करें'],
        mr: ['फक्त सुरक्षित उत्पादने', 'ISI/AGMARK चिन्हे तपासा', 'असुरक्षित मालाची तक्रार करा', 'नुकसान भरपाईचा दावा करा']
      },
      example: {
        en: 'If an electrical appliance causes fire due to defect, you can claim compensation from the manufacturer.',
        hi: 'अगर कोई विद्युत उपकरण दोष के कारण आग लगाता है, तो आप निर्माता से मुआवजे का दावा कर सकते हैं।',
        mr: 'जर एखाद्या विद्युत उपकरणामुळे दोषामुळे आग लागली, तर तुम्ही निर्मात्याकडून नुकसान भरपाईचा दावा करू शकता.'
      }
    },
    {
      id: 'cr2',
      title: { en: 'Right to Information', hi: 'सूचना का अधिकार', mr: 'माहितीचा अधिकार' },
      content: { 
        en: 'You have the right to know about quality, quantity, potency, purity, price, and standards of goods.',
        hi: 'आपको वस्तुओं की गुणवत्ता, मात्रा, शक्ति, शुद्धता, मूल्य और मानकों के बारे में जानने का अधिकार है।',
        mr: 'वस्तूंची गुणवत्ता, प्रमाण, क्षमता, शुद्धता, किंमत आणि मानके जाणून घेण्याचा तुम्हाला अधिकार आहे.'
      },
      keyPoints: {
        en: ['Check MRP before buying', 'Read expiry dates', 'Verify product details', 'Ask for bills'],
        hi: ['खरीदने से पहले MRP जांचें', 'समाप्ति तिथि पढ़ें', 'उत्पाद विवरण सत्यापित करें', 'बिल मांगें'],
        mr: ['खरेदीपूर्वी MRP तपासा', 'एक्सपायरी तारीख वाचा', 'उत्पादन तपशील सत्यापित करा', 'बिल मागा']
      },
      example: {
        en: 'A shopkeeper must display the MRP on products and cannot charge more than MRP.',
        hi: 'दुकानदार को उत्पादों पर MRP प्रदर्शित करना होगा और MRP से अधिक शुल्क नहीं ले सकता।',
        mr: 'दुकानदाराने उत्पादनांवर MRP प्रदर्शित करणे आवश्यक आहे आणि MRP पेक्षा जास्त शुल्क आकारता येत नाही.'
      }
    },
    {
      id: 'cr3',
      title: { en: 'Right to Choose', hi: 'चुनने का अधिकार', mr: 'निवडण्याचा अधिकार' },
      content: { 
        en: 'You have the right to choose from a variety of goods and services at competitive prices.',
        hi: 'आपको प्रतिस्पर्धी कीमतों पर विभिन्न वस्तुओं और सेवाओं में से चुनने का अधिकार है।',
        mr: 'स्पर्धात्मक किमतींवर विविध वस्तू आणि सेवांमधून निवड करण्याचा तुम्हाला अधिकार आहे.'
      },
      keyPoints: {
        en: ['No forced bundling', 'Compare products freely', 'Switch services anytime', 'No monopoly practices'],
        hi: ['जबरन बंडलिंग नहीं', 'स्वतंत्र रूप से उत्पादों की तुलना करें', 'कभी भी सेवाएं बदलें', 'कोई एकाधिकार प्रथाएं नहीं'],
        mr: ['जबरदस्ती बंडलिंग नाही', 'उत्पादनांची मुक्तपणे तुलना करा', 'कधीही सेवा बदला', 'मक्तेदारी पद्धती नाही']
      },
      example: {
        en: 'A builder cannot force you to buy an apartment with only their preferred loan provider.',
        hi: 'एक बिल्डर आपको केवल अपने पसंदीदा ऋण प्रदाता के साथ अपार्टमेंट खरीदने के लिए मजबूर नहीं कर सकता।',
        mr: 'एक बिल्डर तुम्हाला फक्त त्यांच्या पसंतीच्या कर्ज प्रदात्याकडून अपार्टमेंट खरेदी करण्यास भाग पाडू शकत नाही.'
      }
    },
    {
      id: 'cr4',
      title: { en: 'Right to be Heard', hi: 'सुने जाने का अधिकार', mr: 'ऐकले जाण्याचा अधिकार' },
      content: { 
        en: 'You have the right to file complaints and be heard. Consumer forums must address your grievances.',
        hi: 'आपको शिकायत दर्ज करने और सुने जाने का अधिकार है। उपभोक्ता फोरम को आपकी शिकायतों पर ध्यान देना होगा।',
        mr: 'तक्रार दाखल करण्याचा आणि ऐकले जाण्याचा तुम्हाला अधिकार आहे. ग्राहक मंचाने तुमच्या तक्रारींवर लक्ष देणे आवश्यक आहे.'
      },
      keyPoints: {
        en: ['File complaints freely', 'Consumer courts available', 'No fee for small claims', 'Quick resolution expected'],
        hi: ['स्वतंत्र रूप से शिकायत करें', 'उपभोक्ता अदालतें उपलब्ध', 'छोटे दावों के लिए कोई शुल्क नहीं', 'त्वरित समाधान अपेक्षित'],
        mr: ['मुक्तपणे तक्रार करा', 'ग्राहक न्यायालये उपलब्ध', 'लहान दाव्यांसाठी शुल्क नाही', 'जलद निराकरण अपेक्षित']
      },
      example: {
        en: 'You can file a complaint at consumerhelpline.gov.in or call 1800-11-4000 (toll-free).',
        hi: 'आप consumerhelpline.gov.in पर शिकायत दर्ज कर सकते हैं या 1800-11-4000 (टोल-फ्री) पर कॉल कर सकते हैं।',
        mr: 'तुम्ही consumerhelpline.gov.in वर तक्रार दाखल करू शकता किंवा 1800-11-4000 (टोल-फ्री) वर कॉल करू शकता.'
      }
    }
  ],
  women_rights: [
    {
      id: 'wr1',
      title: { en: 'Protection from Harassment', hi: 'उत्पीड़न से सुरक्षा', mr: 'छळापासून संरक्षण' },
      content: { 
        en: 'Women are protected against sexual harassment at workplace and public places under POSH Act and IPC.',
        hi: 'महिलाओं को POSH अधिनियम और IPC के तहत कार्यस्थल और सार्वजनिक स्थानों पर यौन उत्पीड़न से सुरक्षा प्राप्त है।',
        mr: 'महिलांना POSH कायदा आणि IPC अंतर्गत कार्यस्थळ आणि सार्वजनिक ठिकाणी लैंगिक छळापासून संरक्षण आहे.'
      },
      keyPoints: {
        en: ['Internal Complaints Committee at work', 'Women helpline 1091', 'Zero FIR anywhere', 'Statement at home allowed'],
        hi: ['कार्यस्थल पर आंतरिक शिकायत समिति', 'महिला हेल्पलाइन 1091', 'कहीं भी जीरो FIR', 'घर पर बयान की अनुमति'],
        mr: ['कार्यस्थळी अंतर्गत तक्रार समिती', 'महिला हेल्पलाइन 1091', 'कुठेही झिरो FIR', 'घरी जबानी देण्याची परवानगी']
      },
      example: {
        en: 'If harassed at work, report to ICC within 3 months. Company must resolve within 90 days.',
        hi: 'अगर कार्यस्थल पर उत्पीड़न हो, तो 3 महीने के भीतर ICC को रिपोर्ट करें। कंपनी को 90 दिनों में समाधान करना होगा।',
        mr: 'कार्यस्थळी छळ झाल्यास, 3 महिन्यांच्या आत ICC ला तक्रार करा. कंपनीने 90 दिवसांत निराकरण करणे आवश्यक आहे.'
      }
    },
    {
      id: 'wr2',
      title: { en: 'Domestic Violence Protection', hi: 'घरेलू हिंसा से सुरक्षा', mr: 'घरगुती हिंसेपासून संरक्षण' },
      content: { 
        en: 'Protection from physical, emotional, economic abuse by husband or relatives under DV Act 2005.',
        hi: 'DV अधिनियम 2005 के तहत पति या रिश्तेदारों द्वारा शारीरिक, भावनात्मक, आर्थिक शोषण से सुरक्षा।',
        mr: 'DV कायदा 2005 अंतर्गत पती किंवा नातेवाईकांकडून शारीरिक, भावनिक, आर्थिक शोषणापासून संरक्षण.'
      },
      keyPoints: {
        en: ['Right to residence', 'Protection orders available', 'Monetary relief', 'Custody of children'],
        hi: ['निवास का अधिकार', 'सुरक्षा आदेश उपलब्ध', 'आर्थिक राहत', 'बच्चों की कस्टडी'],
        mr: ['निवासाचा अधिकार', 'संरक्षण आदेश उपलब्ध', 'आर्थिक दिलासा', 'मुलांचा ताबा']
      },
      example: {
        en: 'You can get a protection order preventing your husband from entering the house or contacting you.',
        hi: 'आप एक सुरक्षा आदेश प्राप्त कर सकती हैं जो आपके पति को घर में प्रवेश या आपसे संपर्क करने से रोकता है।',
        mr: 'तुम्ही संरक्षण आदेश मिळवू शकता जे तुमच्या पतीला घरात प्रवेश करण्यापासून किंवा तुमच्याशी संपर्क साधण्यापासून प्रतिबंधित करते.'
      }
    },
    {
      id: 'wr3',
      title: { en: 'Equal Pay & Maternity Benefits', hi: 'समान वेतन और मातृत्व लाभ', mr: 'समान वेतन आणि मातृत्व लाभ' },
      content: { 
        en: 'Women have right to equal pay for equal work and 26 weeks paid maternity leave.',
        hi: 'महिलाओं को समान कार्य के लिए समान वेतन और 26 सप्ताह का सवेतन मातृत्व अवकाश का अधिकार है।',
        mr: 'महिलांना समान कामासाठी समान वेतन आणि 26 आठवड्यांची सवेतन मातृत्व रजा मिळण्याचा अधिकार आहे.'
      },
      keyPoints: {
        en: ['Equal pay guaranteed', '26 weeks maternity leave', 'Creche facility mandatory', 'Work from home option'],
        hi: ['समान वेतन की गारंटी', '26 सप्ताह मातृत्व अवकाश', 'क्रेच सुविधा अनिवार्य', 'घर से काम का विकल्प'],
        mr: ['समान वेतनाची हमी', '26 आठवडे मातृत्व रजा', 'पाळणाघर सुविधा अनिवार्य', 'घरून काम करण्याचा पर्याय']
      },
      example: {
        en: 'Companies with 50+ employees must provide creche facility within 500 meters.',
        hi: '50+ कर्मचारियों वाली कंपनियों को 500 मीटर के भीतर क्रेच सुविधा प्रदान करनी होगी।',
        mr: '50+ कर्मचारी असलेल्या कंपन्यांनी 500 मीटरच्या आत पाळणाघर सुविधा प्रदान करणे आवश्यक आहे.'
      }
    }
  ],
  police_rights: [
    {
      id: 'pr1',
      title: { en: 'Rights During Arrest', hi: 'गिरफ्तारी के दौरान अधिकार', mr: 'अटकेदरम्यान अधिकार' },
      content: { 
        en: 'Police must show ID, inform grounds of arrest, and present you before magistrate within 24 hours.',
        hi: 'पुलिस को ID दिखाना होगा, गिरफ्तारी का कारण बताना होगा, और 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश करना होगा।',
        mr: 'पोलिसांनी ID दाखवणे, अटकेचे कारण सांगणे आणि 24 तासांच्या आत मॅजिस्ट्रेटसमोर हजर करणे आवश्यक आहे.'
      },
      keyPoints: {
        en: ['Right to know arrest reason', 'Inform family/friend', 'Right to lawyer', 'Medical examination'],
        hi: ['गिरफ्तारी का कारण जानने का अधिकार', 'परिवार/मित्र को सूचित करें', 'वकील का अधिकार', 'चिकित्सा जांच'],
        mr: ['अटकेचे कारण जाणून घेण्याचा अधिकार', 'कुटुंब/मित्राला कळवा', 'वकिलाचा अधिकार', 'वैद्यकीय तपासणी']
      },
      example: {
        en: 'If arrested, immediately ask police to inform your family member and request a lawyer.',
        hi: 'अगर गिरफ्तार किया जाए, तो तुरंत पुलिस से अपने परिवार के सदस्य को सूचित करने और वकील की मांग करें।',
        mr: 'जर अटक झाली, तर तात्काळ पोलिसांना तुमच्या कुटुंबातील सदस्याला कळवण्यास सांगा आणि वकिलाची मागणी करा.'
      }
    },
    {
      id: 'pr2',
      title: { en: 'Right to File Zero FIR', hi: 'जीरो FIR दर्ज करने का अधिकार', mr: 'झिरो FIR दाखल करण्याचा अधिकार' },
      content: { 
        en: 'You can file FIR at any police station regardless of where the crime occurred. Police cannot refuse.',
        hi: 'आप किसी भी पुलिस स्टेशन पर FIR दर्ज कर सकते हैं, चाहे अपराध कहीं भी हुआ हो। पुलिस मना नहीं कर सकती।',
        mr: 'गुन्हा कुठेही घडला असला तरी तुम्ही कोणत्याही पोलीस स्टेशनवर FIR दाखल करू शकता. पोलीस नकार देऊ शकत नाहीत.'
      },
      keyPoints: {
        en: ['File at any station', 'Get FIR copy free', 'Online FIR available', 'Complaint to SP if refused'],
        hi: ['किसी भी स्टेशन पर दर्ज करें', 'FIR कॉपी मुफ्त पाएं', 'ऑनलाइन FIR उपलब्ध', 'इनकार पर SP को शिकायत'],
        mr: ['कोणत्याही स्टेशनवर दाखल करा', 'FIR प्रत मोफत मिळवा', 'ऑनलाइन FIR उपलब्ध', 'नकार दिल्यास SP ला तक्रार']
      },
      example: {
        en: 'If your phone is stolen in Delhi, you can file Zero FIR in Mumbai and it will be transferred.',
        hi: 'अगर आपका फोन दिल्ली में चोरी हो जाए, तो आप मुंबई में जीरो FIR दर्ज कर सकते हैं और इसे ट्रांसफर किया जाएगा।',
        mr: 'जर तुमचा फोन दिल्लीत चोरीला गेला, तर तुम्ही मुंबईत झिरो FIR दाखल करू शकता आणि ती हस्तांतरित केली जाईल.'
      }
    },
    {
      id: 'pr3',
      title: { en: 'Protection Against Torture', hi: 'यातना से सुरक्षा', mr: 'छळापासून संरक्षण' },
      content: { 
        en: 'Police cannot torture, beat, or use third-degree methods. You can complain to NHRC or courts.',
        hi: 'पुलिस यातना, पिटाई या थर्ड-डिग्री तरीके नहीं अपना सकती। आप NHRC या अदालतों में शिकायत कर सकते हैं।',
        mr: 'पोलीस छळ, मारहाण किंवा थर्ड-डिग्री पद्धती वापरू शकत नाहीत. तुम्ही NHRC किंवा न्यायालयात तक्रार करू शकता.'
      },
      keyPoints: {
        en: ['No physical torture', 'Right to medical exam', 'Complaint to NHRC', 'Compensation available'],
        hi: ['कोई शारीरिक यातना नहीं', 'चिकित्सा जांच का अधिकार', 'NHRC में शिकायत', 'मुआवजा उपलब्ध'],
        mr: ['शारीरिक छळ नाही', 'वैद्यकीय तपासणीचा अधिकार', 'NHRC मध्ये तक्रार', 'नुकसान भरपाई उपलब्ध']
      },
      example: {
        en: 'If tortured in custody, get a medical report immediately and file complaint with NHRC (nhrc.nic.in).',
        hi: 'अगर कस्टडी में यातना दी जाए, तो तुरंत मेडिकल रिपोर्ट लें और NHRC (nhrc.nic.in) में शिकायत करें।',
        mr: 'जर कोठडीत छळ झाला, तर तात्काळ वैद्यकीय अहवाल घ्या आणि NHRC (nhrc.nic.in) मध्ये तक्रार दाखल करा.'
      }
    }
  ],
  rti_rights: [
    {
      id: 'rti1',
      title: { en: 'What is RTI?', hi: 'RTI क्या है?', mr: 'RTI म्हणजे काय?' },
      content: { 
        en: 'Right to Information Act 2005 allows citizens to request information from government departments within 30 days.',
        hi: 'सूचना का अधिकार अधिनियम 2005 नागरिकों को 30 दिनों में सरकारी विभागों से जानकारी मांगने की अनुमति देता है।',
        mr: 'माहितीचा अधिकार कायदा 2005 नागरिकांना 30 दिवसांच्या आत सरकारी विभागांकडून माहिती मागण्याची परवानगी देतो.'
      },
      keyPoints: {
        en: ['Any citizen can apply', 'Rs 10 application fee', '30 days response time', 'Appeals available'],
        hi: ['कोई भी नागरिक आवेदन कर सकता है', 'Rs 10 आवेदन शुल्क', '30 दिन में जवाब', 'अपील उपलब्ध'],
        mr: ['कोणताही नागरिक अर्ज करू शकतो', 'Rs 10 अर्ज शुल्क', '30 दिवसांत उत्तर', 'अपील उपलब्ध']
      },
      example: {
        en: 'You can file RTI to know the status of your passport application or any government scheme.',
        hi: 'आप अपने पासपोर्ट आवेदन या किसी सरकारी योजना की स्थिति जानने के लिए RTI दर्ज कर सकते हैं।',
        mr: 'तुमच्या पासपोर्ट अर्जाची किंवा कोणत्याही सरकारी योजनेची स्थिती जाणून घेण्यासाठी तुम्ही RTI दाखल करू शकता.'
      }
    },
    {
      id: 'rti2',
      title: { en: 'How to File RTI', hi: 'RTI कैसे दाखिल करें', mr: 'RTI कसा दाखल करावा' },
      content: { 
        en: 'Write application to PIO (Public Information Officer) of concerned department. Can file online at rtionline.gov.in.',
        hi: 'संबंधित विभाग के PIO (जन सूचना अधिकारी) को आवेदन लिखें। rtionline.gov.in पर ऑनलाइन दर्ज कर सकते हैं।',
        mr: 'संबंधित विभागाच्या PIO (जन माहिती अधिकारी) ला अर्ज लिहा. rtionline.gov.in वर ऑनलाइन दाखल करू शकता.'
      },
      keyPoints: {
        en: ['Online or offline filing', 'Mention specific questions', 'Keep receipt safe', 'BPL card holders exempt from fee'],
        hi: ['ऑनलाइन या ऑफलाइन दाखिल करें', 'विशिष्ट प्रश्न उल्लेख करें', 'रसीद सुरक्षित रखें', 'BPL कार्ड धारक शुल्क से मुक्त'],
        mr: ['ऑनलाइन किंवा ऑफलाइन दाखल करा', 'विशिष्ट प्रश्न नमूद करा', 'पावती सुरक्षित ठेवा', 'BPL कार्डधारक शुल्कातून मुक्त']
      },
      example: {
        en: 'Visit rtionline.gov.in, select department, fill details, pay Rs 10, and submit your questions.',
        hi: 'rtionline.gov.in पर जाएं, विभाग चुनें, विवरण भरें, Rs 10 भुगतान करें, और अपने प्रश्न जमा करें।',
        mr: 'rtionline.gov.in वर जा, विभाग निवडा, तपशील भरा, Rs 10 भरा आणि तुमचे प्रश्न सबमिट करा.'
      }
    },
    {
      id: 'rti3',
      title: { en: 'RTI Appeals', hi: 'RTI अपील', mr: 'RTI अपील' },
      content: { 
        en: 'If not satisfied with response, file first appeal within 30 days, then second appeal to Information Commission.',
        hi: 'अगर जवाब से संतुष्ट नहीं हैं, तो 30 दिनों के भीतर पहली अपील दायर करें, फिर सूचना आयोग में दूसरी अपील करें।',
        mr: 'उत्तराने समाधान नसल्यास, 30 दिवसांच्या आत पहिली अपील दाखल करा, नंतर माहिती आयोगात दुसरी अपील करा.'
      },
      keyPoints: {
        en: ['First appeal to senior officer', 'Second appeal to CIC/SIC', 'Penalty on defaulting officers', 'Compensation possible'],
        hi: ['पहली अपील वरिष्ठ अधिकारी को', 'दूसरी अपील CIC/SIC को', 'चूककर्ता अधिकारियों पर जुर्माना', 'मुआवजा संभव'],
        mr: ['पहिली अपील वरिष्ठ अधिकाऱ्याला', 'दुसरी अपील CIC/SIC ला', 'चुकीच्या अधिकाऱ्यांवर दंड', 'नुकसान भरपाई शक्य']
      },
      example: {
        en: 'If PIO does not respond in 30 days, file appeal with First Appellate Authority mentioned in the office.',
        hi: 'अगर PIO 30 दिनों में जवाब नहीं देता, तो कार्यालय में उल्लिखित प्रथम अपीलीय प्राधिकरण में अपील दायर करें।',
        mr: 'जर PIO 30 दिवसांत उत्तर देत नसेल, तर कार्यालयात नमूद प्रथम अपील प्राधिकरणाकडे अपील दाखल करा.'
      }
    }
  ],
  cyber_rights: [
    {
      id: 'cyber1',
      title: { en: 'Protection from Cyber Crime', hi: 'साइबर अपराध से सुरक्षा', mr: 'सायबर गुन्ह्यापासून संरक्षण' },
      content: { 
        en: 'IT Act 2000 protects against hacking, identity theft, online fraud, and cyber stalking.',
        hi: 'IT अधिनियम 2000 हैकिंग, पहचान की चोरी, ऑनलाइन धोखाधड़ी और साइबर स्टॉकिंग से सुरक्षा प्रदान करता है।',
        mr: 'IT कायदा 2000 हॅकिंग, ओळख चोरी, ऑनलाइन फसवणूक आणि सायबर स्टॉकिंगपासून संरक्षण देतो.'
      },
      keyPoints: {
        en: ['Report at cybercrime.gov.in', 'Helpline 1930', 'Screenshot everything', 'Do not delete messages'],
        hi: ['cybercrime.gov.in पर रिपोर्ट करें', 'हेल्पलाइन 1930', 'सब कुछ स्क्रीनशॉट लें', 'संदेश न हटाएं'],
        mr: ['cybercrime.gov.in वर तक्रार करा', 'हेल्पलाइन 1930', 'सर्व स्क्रीनशॉट घ्या', 'संदेश हटवू नका']
      },
      example: {
        en: 'If someone hacks your social media, report at cybercrime.gov.in and file FIR with screenshots.',
        hi: 'अगर कोई आपका सोशल मीडिया हैक करे, तो cybercrime.gov.in पर रिपोर्ट करें और स्क्रीनशॉट के साथ FIR दर्ज करें।',
        mr: 'जर कोणी तुमचे सोशल मीडिया हॅक केले, तर cybercrime.gov.in वर तक्रार करा आणि स्क्रीनशॉटसह FIR दाखल करा.'
      }
    },
    {
      id: 'cyber2',
      title: { en: 'Online Banking Fraud Protection', hi: 'ऑनलाइन बैंकिंग धोखाधड़ी सुरक्षा', mr: 'ऑनलाइन बँकिंग फसवणूक संरक्षण' },
      content: { 
        en: 'Report fraud within 3 days to bank for zero liability. RBI guidelines protect your money.',
        hi: 'शून्य देयता के लिए 3 दिनों के भीतर बैंक को धोखाधड़ी की रिपोर्ट करें। RBI दिशानिर्देश आपके पैसे की रक्षा करते हैं।',
        mr: 'शून्य दायित्वासाठी 3 दिवसांच्या आत बँकेला फसवणुकीची तक्रार करा. RBI मार्गदर्शक तत्त्वे तुमच्या पैशांचे संरक्षण करतात.'
      },
      keyPoints: {
        en: ['Report within 3 days', 'Block card immediately', 'File complaint with bank', 'Keep transaction alerts on'],
        hi: ['3 दिनों में रिपोर्ट करें', 'कार्ड तुरंत ब्लॉक करें', 'बैंक में शिकायत दर्ज करें', 'लेन-देन अलर्ट चालू रखें'],
        mr: ['3 दिवसांत तक्रार करा', 'कार्ड तात्काळ ब्लॉक करा', 'बँकेत तक्रार दाखल करा', 'व्यवहार सूचना चालू ठेवा']
      },
      example: {
        en: 'If money debited without your knowledge, call bank helpline immediately and also call 1930.',
        hi: 'अगर आपकी जानकारी के बिना पैसे कटें, तो तुरंत बैंक हेल्पलाइन कॉल करें और 1930 पर भी कॉल करें।',
        mr: 'जर तुमच्या माहितीशिवाय पैसे कापले गेले, तर तात्काळ बँक हेल्पलाइनवर कॉल करा आणि 1930 वरही कॉल करा.'
      }
    },
    {
      id: 'cyber3',
      title: { en: 'Data Privacy Rights', hi: 'डेटा गोपनीयता अधिकार', mr: 'डेटा गोपनीयता अधिकार' },
      content: { 
        en: 'You have the right to know how your data is used. Companies must get consent before collecting personal data.',
        hi: 'आपको यह जानने का अधिकार है कि आपका डेटा कैसे उपयोग होता है। कंपनियों को व्यक्तिगत डेटा एकत्र करने से पहले सहमति लेनी होगी।',
        mr: 'तुमचा डेटा कसा वापरला जातो हे जाणून घेण्याचा तुम्हाला अधिकार आहे. कंपन्यांना वैयक्तिक डेटा गोळा करण्यापूर्वी संमती घेणे आवश्यक आहे.'
      },
      keyPoints: {
        en: ['Consent required for data', 'Right to data deletion', 'Report privacy violations', 'Use strong passwords'],
        hi: ['डेटा के लिए सहमति आवश्यक', 'डेटा हटाने का अधिकार', 'गोपनीयता उल्लंघन रिपोर्ट करें', 'मजबूत पासवर्ड उपयोग करें'],
        mr: ['डेटासाठी संमती आवश्यक', 'डेटा हटवण्याचा अधिकार', 'गोपनीयता उल्लंघनाची तक्रार करा', 'मजबूत पासवर्ड वापरा']
      },
      example: {
        en: 'You can request any app to delete your personal data and they must comply within 30 days.',
        hi: 'आप किसी भी ऐप से अपना व्यक्तिगत डेटा हटाने का अनुरोध कर सकते हैं और उन्हें 30 दिनों में पालन करना होगा।',
        mr: 'तुम्ही कोणत्याही ॲपला तुमचा वैयक्तिक डेटा हटवण्याची विनंती करू शकता आणि त्यांना 30 दिवसांत पालन करणे आवश्यक आहे.'
      }
    }
  ],
  tenant_rights: [
    {
      id: 'tenant1',
      title: { en: 'Rent Agreement Rights', hi: 'किराया समझौता अधिकार', mr: 'भाडे करार अधिकार' },
      content: { 
        en: 'Always get a written rent agreement. Landlord cannot evict without proper notice and legal procedure.',
        hi: 'हमेशा लिखित किराया समझौता करें। मकान मालिक उचित नोटिस और कानूनी प्रक्रिया के बिना बेदखल नहीं कर सकता।',
        mr: 'नेहमी लिखित भाडे करार करा. मालक योग्य नोटीस आणि कायदेशीर प्रक्रियेशिवाय बेदखल करू शकत नाही.'
      },
      keyPoints: {
        en: ['Get written agreement', 'Register if over 11 months', 'Keep rent receipts', 'Notice period required'],
        hi: ['लिखित समझौता लें', '11 महीने से अधिक हो तो रजिस्टर करें', 'किराया रसीद रखें', 'नोटिस अवधि आवश्यक'],
        mr: ['लिखित करार घ्या', '11 महिन्यांपेक्षा जास्त असल्यास नोंदणी करा', 'भाडे पावत्या ठेवा', 'नोटीस कालावधी आवश्यक']
      },
      example: {
        en: 'If landlord asks to vacate without notice, you can file complaint with rent controller.',
        hi: 'अगर मकान मालिक बिना नोटिस के खाली करने को कहे, तो आप किराया नियंत्रक के पास शिकायत दर्ज कर सकते हैं।',
        mr: 'जर मालकाने नोटीसशिवाय खाली करण्यास सांगितले, तर तुम्ही भाडे नियंत्रकाकडे तक्रार दाखल करू शकता.'
      }
    },
    {
      id: 'tenant2',
      title: { en: 'Security Deposit Rights', hi: 'सुरक्षा जमा अधिकार', mr: 'सुरक्षा ठेव अधिकार' },
      content: { 
        en: 'Security deposit should be returned when vacating. Deductions only for actual damages, not wear and tear.',
        hi: 'खाली करते समय सुरक्षा जमा वापस मिलनी चाहिए। कटौती केवल वास्तविक नुकसान के लिए, सामान्य टूट-फूट के लिए नहीं।',
        mr: 'खाली करताना सुरक्षा ठेव परत मिळायला हवी. कपात फक्त वास्तविक नुकसानीसाठी, सामान्य झीजसाठी नाही.'
      },
      keyPoints: {
        en: ['Deposit refund on vacating', 'Fair deduction only', 'Document condition at entry', 'Legal action for non-return'],
        hi: ['खाली करने पर जमा वापसी', 'उचित कटौती ही', 'प्रवेश पर स्थिति दस्तावेज करें', 'वापसी न होने पर कानूनी कार्रवाई'],
        mr: ['खाली करताना ठेव परतावा', 'योग्य कपात फक्त', 'प्रवेशावेळी स्थिती दस्तऐवजीकरण करा', 'परत न मिळाल्यास कायदेशीर कारवाई']
      },
      example: {
        en: 'Take photos of flat condition while moving in and out to prove no damage was done.',
        hi: 'जाते और आते समय फ्लैट की स्थिति के फोटो लें ताकि साबित हो कि कोई नुकसान नहीं हुआ।',
        mr: 'प्रवेश आणि बाहेर पडताना फ्लॅटच्या स्थितीचे फोटो घ्या जेणेकरून कोणतेही नुकसान झाले नाही हे सिद्ध करता येईल.'
      }
    },
    {
      id: 'tenant3',
      title: { en: 'Maintenance & Repairs', hi: 'रखरखाव और मरम्मत', mr: 'देखभाल आणि दुरुस्ती' },
      content: { 
        en: 'Major repairs are landlord responsibility. Tenant responsible for minor repairs from daily use.',
        hi: 'बड़ी मरम्मत मकान मालिक की जिम्मेदारी है। किरायेदार दैनिक उपयोग से छोटी मरम्मत के लिए जिम्मेदार है।',
        mr: 'मोठ्या दुरुस्त्या मालकाची जबाबदारी आहे. दैनंदिन वापरातील लहान दुरुस्त्या भाडेकरूची जबाबदारी आहे.'
      },
      keyPoints: {
        en: ['Structural repairs by landlord', 'Plumbing/electrical by landlord', 'Minor wear by tenant', 'Get repairs in writing'],
        hi: ['संरचनात्मक मरम्मत मालिक द्वारा', 'प्लंबिंग/बिजली मालिक द्वारा', 'मामूली टूट-फूट किरायेदार द्वारा', 'मरम्मत लिखित में लें'],
        mr: ['संरचनात्मक दुरुस्ती मालकाकडून', 'प्लंबिंग/इलेक्ट्रिकल मालकाकडून', 'किरकोळ झीज भाडेकरूकडून', 'दुरुस्ती लिखित स्वरूपात घ्या']
      },
      example: {
        en: 'If roof leaks, landlord must repair. If bulb fuses, tenant should replace.',
        hi: 'अगर छत से पानी टपके, तो मकान मालिक को मरम्मत करनी होगी। अगर बल्ब फ्यूज हो, तो किरायेदार बदले।',
        mr: 'जर छत गळत असेल, तर मालकाने दुरुस्ती करणे आवश्यक आहे. जर बल्ब फ्यूज झाला, तर भाडेकरूने बदलावा.'
      }
    }
  ],
  senior_citizen_rights: [
    {
      id: 'sc1',
      title: { en: 'Maintenance by Children', hi: 'बच्चों द्वारा भरण-पोषण', mr: 'मुलांकडून पोषण' },
      content: { 
        en: 'Under Maintenance Act, children and relatives must provide for elderly parents. Tribunal can order maintenance.',
        hi: 'भरण-पोषण अधिनियम के तहत बच्चों और रिश्तेदारों को बुजुर्ग माता-पिता का भरण-पोषण करना होगा। न्यायाधिकरण भरण-पोषण का आदेश दे सकता है।',
        mr: 'पोषण कायद्यानुसार मुले आणि नातेवाईकांनी वृद्ध पालकांचे पोषण करणे आवश्यक आहे. न्यायाधिकरण पोषणाचा आदेश देऊ शकते.'
      },
      keyPoints: {
        en: ['Children must maintain parents', 'Tribunal for complaints', 'Up to Rs 10,000/month', 'Free legal aid available'],
        hi: ['बच्चों को माता-पिता का भरण-पोषण करना होगा', 'शिकायत के लिए न्यायाधिकरण', 'Rs 10,000/माह तक', 'मुफ्त कानूनी सहायता उपलब्ध'],
        mr: ['मुलांनी पालकांचे पोषण करणे आवश्यक', 'तक्रारीसाठी न्यायाधिकरण', 'Rs 10,000/महिना पर्यंत', 'मोफत कायदेशीर मदत उपलब्ध']
      },
      example: {
        en: 'If children refuse to support, approach Maintenance Tribunal at district level for monthly allowance order.',
        hi: 'अगर बच्चे सहायता से मना करें, तो मासिक भत्ता आदेश के लिए जिला स्तर पर भरण-पोषण न्यायाधिकरण से संपर्क करें।',
        mr: 'जर मुलांनी मदत करण्यास नकार दिला, तर मासिक भत्ता आदेशासाठी जिल्हा स्तरावरील पोषण न्यायाधिकरणाशी संपर्क साधा.'
      }
    },
    {
      id: 'sc2',
      title: { en: 'Property Rights Protection', hi: 'संपत्ति अधिकार सुरक्षा', mr: 'मालमत्ता अधिकार संरक्षण' },
      content: { 
        en: 'Property transferred to children can be taken back if they fail to provide maintenance.',
        hi: 'बच्चों को हस्तांतरित संपत्ति वापस ली जा सकती है अगर वे भरण-पोषण करने में विफल रहते हैं।',
        mr: 'मुलांना हस्तांतरित केलेली मालमत्ता परत घेता येते जर त्यांनी पोषण करण्यात अयशस्वी झाले.'
      },
      keyPoints: {
        en: ['Transfer can be cancelled', 'Will can be changed', 'Right to live in property', 'Protection from eviction'],
        hi: ['हस्तांतरण रद्द हो सकता है', 'वसीयत बदली जा सकती है', 'संपत्ति में रहने का अधिकार', 'बेदखली से सुरक्षा'],
        mr: ['हस्तांतरण रद्द होऊ शकते', 'मृत्युपत्र बदलता येते', 'मालमत्तेत राहण्याचा अधिकार', 'बेदखलीपासून संरक्षण']
      },
      example: {
        en: 'If you transferred property to son who now neglects you, court can cancel the transfer deed.',
        hi: 'अगर आपने संपत्ति बेटे को हस्तांतरित की जो अब आपकी उपेक्षा करता है, तो अदालत हस्तांतरण विलेख रद्द कर सकती है।',
        mr: 'जर तुम्ही मुलाला मालमत्ता हस्तांतरित केली जो आता तुमची उपेक्षा करतो, तर न्यायालय हस्तांतरण दस्तऐवज रद्द करू शकते.'
      }
    },
    {
      id: 'sc3',
      title: { en: 'Healthcare & Pension Benefits', hi: 'स्वास्थ्य सेवा और पेंशन लाभ', mr: 'आरोग्य सेवा आणि पेंशन लाभ' },
      content: { 
        en: 'Senior citizens get priority in hospitals, tax benefits, and pension schemes like IGNOAPS.',
        hi: 'वरिष्ठ नागरिकों को अस्पतालों में प्राथमिकता, कर लाभ और IGNOAPS जैसी पेंशन योजनाएं मिलती हैं।',
        mr: 'ज्येष्ठ नागरिकांना रुग्णालयांमध्ये प्राधान्य, कर लाभ आणि IGNOAPS सारख्या पेंशन योजना मिळतात.'
      },
      keyPoints: {
        en: ['Priority in hospitals', 'Tax benefits up to Rs 50,000', 'Free health camps', 'Old age pension schemes'],
        hi: ['अस्पतालों में प्राथमिकता', 'Rs 50,000 तक कर लाभ', 'मुफ्त स्वास्थ्य शिविर', 'वृद्धावस्था पेंशन योजनाएं'],
        mr: ['रुग्णालयांमध्ये प्राधान्य', 'Rs 50,000 पर्यंत कर लाभ', 'मोफत आरोग्य शिबिरे', 'वृद्धापकाळ पेंशन योजना']
      },
      example: {
        en: 'Show senior citizen ID at government hospitals for priority consultation and discounted medicines.',
        hi: 'प्राथमिकता परामर्श और छूट वाली दवाओं के लिए सरकारी अस्पतालों में वरिष्ठ नागरिक ID दिखाएं।',
        mr: 'प्राधान्य सल्लामसलत आणि सवलतीच्या औषधांसाठी सरकारी रुग्णालयांमध्ये ज्येष्ठ नागरिक ID दाखवा.'
      }
    }
  ]
};

export const RightsLearningGame: React.FC<RightsLearningGameProps> = ({
  topic,
  onComplete,
  onBack
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());
  const [showExample, setShowExample] = useState(false);

  const cards = learningContent[topic] || learningContent.fundamental_rights;
  const currentCard = cards[currentIndex];
  const progress = ((viewedCards.size) / cards.length) * 100;

  useEffect(() => {
    setViewedCards(prev => new Set([...prev, currentCard.id]));
  }, [currentCard.id]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExample(false);
    } else if (viewedCards.size === cards.length) {
      onComplete(cards);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExample(false);
    }
  };

  const getLocalizedText = (item: { en: string; hi: string; mr: string }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const getLocalizedArray = (item: { en: string[]; hi: string[]; mr: string[] }) => {
    return item[language as keyof typeof item] || item.en;
  };

  const getTopicTitle = () => {
    const titles: Record<string, { en: string; hi: string; mr: string }> = {
      fundamental_rights: { en: 'Fundamental Rights', hi: 'मौलिक अधिकार', mr: 'मूलभूत अधिकार' },
      consumer_rights: { en: 'Consumer Rights', hi: 'उपभोक्ता अधिकार', mr: 'ग्राहक अधिकार' },
      women_rights: { en: 'Women Rights', hi: 'महिला अधिकार', mr: 'महिला अधिकार' },
      police_rights: { en: 'Rights with Police', hi: 'पुलिस के साथ अधिकार', mr: 'पोलिसांसोबत अधिकार' },
      rti_rights: { en: 'RTI Rights', hi: 'RTI अधिकार', mr: 'RTI अधिकार' },
      cyber_rights: { en: 'Cyber Rights', hi: 'साइबर अधिकार', mr: 'सायबर अधिकार' },
      tenant_rights: { en: 'Tenant Rights', hi: 'किरायेदार अधिकार', mr: 'भाडेकरू अधिकार' },
      senior_citizen_rights: { en: 'Senior Citizen Rights', hi: 'वरिष्ठ नागरिक अधिकार', mr: 'ज्येष्ठ नागरिक अधिकार' }
    };
    return getLocalizedText(titles[topic] || titles.fundamental_rights);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back'}
        </Button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-primary/20 p-2">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{getTopicTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' ? `कार्ड ${currentIndex + 1} / ${cards.length}` : 
               language === 'mr' ? `कार्ड ${currentIndex + 1} / ${cards.length}` :
               `Card ${currentIndex + 1} of ${cards.length}`}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      {/* Learning Card */}
      <Card className="p-6 mb-6 bg-card border-primary/20">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            {getLocalizedText(currentCard.title)}
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            {getLocalizedText(currentCard.content)}
          </p>

          {/* Key Points */}
          <div className="bg-primary/5 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              {language === 'hi' ? 'मुख्य बिंदु' : language === 'mr' ? 'मुख्य मुद्दे' : 'Key Points'}
            </h3>
            <ul className="space-y-2">
              {getLocalizedArray(currentCard.keyPoints).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Example Toggle */}
          <Button 
            variant="outline" 
            onClick={() => setShowExample(!showExample)}
            className="w-full gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            {showExample 
              ? (language === 'hi' ? 'उदाहरण छुपाएं' : language === 'mr' ? 'उदाहरण लपवा' : 'Hide Example')
              : (language === 'hi' ? 'उदाहरण देखें' : language === 'mr' ? 'उदाहरण पहा' : 'Show Example')}
          </Button>

          {showExample && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                💡 {getLocalizedText(currentCard.example)}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === 'hi' ? 'पिछला' : language === 'mr' ? 'मागील' : 'Previous'}
        </Button>
        
        <Button 
          onClick={handleNext}
          className="flex-1"
        >
          {currentIndex === cards.length - 1 && viewedCards.size === cards.length
            ? (language === 'hi' ? 'परीक्षा शुरू करें' : language === 'mr' ? 'परीक्षा सुरू करा' : 'Start Exam')
            : (language === 'hi' ? 'अगला' : language === 'mr' ? 'पुढील' : 'Next')}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
