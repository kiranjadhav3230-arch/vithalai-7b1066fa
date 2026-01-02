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
        en: ['Equality before law (Article 14)', 'No untouchability (Article 17)', 'Equal opportunity in government jobs (Article 16)', 'Abolition of titles (Article 18)'],
        hi: ['कानून के समक्ष समानता (अनुच्छेद 14)', 'अस्पृश्यता का निषेध (अनुच्छेद 17)', 'सरकारी नौकरियों में समान अवसर (अनुच्छेद 16)', 'उपाधियों का अंत (अनुच्छेद 18)'],
        mr: ['कायद्यासमोर समानता (कलम 14)', 'अस्पृश्यता निषेध (कलम 17)', 'सरकारी नोकऱ्यांमध्ये समान संधी (कलम 16)', 'पदव्यांचे उच्चाटन (कलम 18)']
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
        en: 'Article 19 guarantees 6 freedoms: speech, assembly, association, movement, residence, and profession. You cannot be arrested without proper procedure.',
        hi: 'अनुच्छेद 19 में 6 स्वतंत्रताएं हैं: भाषण, सभा, संघ, आवाजाही, निवास और पेशा। बिना उचित प्रक्रिया के गिरफ्तारी नहीं हो सकती।',
        mr: 'कलम 19 मध्ये 6 स्वातंत्र्य आहेत: भाषण, सभा, संघटना, वाहतूक, निवास आणि व्यवसाय. योग्य प्रक्रियेशिवाय अटक होऊ शकत नाही.'
      },
      keyPoints: {
        en: ['Freedom of speech and expression', 'Right to peaceful assembly', 'Right to move freely throughout India', 'Protection against arbitrary arrest (Article 22)'],
        hi: ['अभिव्यक्ति की स्वतंत्रता', 'शांतिपूर्ण सभा का अधिकार', 'भारत में स्वतंत्र आवाजाही', 'मनमानी गिरफ्तारी से सुरक्षा (अनुच्छेद 22)'],
        mr: ['अभिव्यक्ती स्वातंत्र्य', 'शांततापूर्ण सभेचा अधिकार', 'भारतात मुक्त वाहतूक', 'मनमानी अटकेपासून संरक्षण (कलम 22)']
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
        en: ['No human trafficking (Article 23)', 'No forced labor or begar', 'No child labor under 14 (Article 24)', 'Protection from hazardous work'],
        hi: ['मानव तस्करी निषेध (अनुच्छेद 23)', 'बंधुआ मजदूरी या बेगार निषेध', '14 से कम बाल श्रम निषेध (अनुच्छेद 24)', 'खतरनाक काम से सुरक्षा'],
        mr: ['मानवी तस्करी निषेध (कलम 23)', 'बंधपत्री कामगार किंवा बेगार निषेध', '14 वर्षांखालील बालकामगार निषेध (कलम 24)', 'धोकादायक कामापासून संरक्षण']
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
        en: ['Freedom to practice religion (Article 25)', 'Manage religious affairs (Article 26)', 'No religious tax (Article 27)', 'No forced religious instruction (Article 28)'],
        hi: ['धर्म पालन की स्वतंत्रता (अनुच्छेद 25)', 'धार्मिक मामलों का प्रबंधन (अनुच्छेद 26)', 'कोई धार्मिक कर नहीं (अनुच्छेद 27)', 'जबरन धार्मिक शिक्षा नहीं (अनुच्छेद 28)'],
        mr: ['धर्म पालनाचे स्वातंत्र्य (कलम 25)', 'धार्मिक व्यवहार व्यवस्थापन (कलम 26)', 'धार्मिक कर नाही (कलम 27)', 'जबरदस्ती धार्मिक शिक्षण नाही (कलम 28)']
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
        en: ['Protect culture & language (Article 29)', 'Establish educational institutions (Article 30)', 'No denial of admission based on religion', 'State aid without discrimination'],
        hi: ['संस्कृति और भाषा संरक्षण (अनुच्छेद 29)', 'शैक्षणिक संस्थान स्थापना (अनुच्छेद 30)', 'धर्म के आधार पर प्रवेश से इंकार नहीं', 'बिना भेदभाव राज्य सहायता'],
        mr: ['संस्कृती आणि भाषा संरक्षण (कलम 29)', 'शैक्षणिक संस्था स्थापना (कलम 30)', 'धर्माच्या आधारावर प्रवेश नाकारता येत नाही', 'भेदभावाशिवाय राज्य मदत']
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
        en: 'You can directly approach the Supreme Court if your fundamental rights are violated. This is called the "heart and soul" of the Constitution by Dr. Ambedkar.',
        hi: 'अगर आपके मौलिक अधिकारों का उल्लंघन होता है, तो आप सीधे सुप्रीम कोर्ट जा सकते हैं। डॉ. अंबेडकर ने इसे संविधान का "हृदय और आत्मा" कहा।',
        mr: 'जर तुमच्या मूलभूत अधिकारांचे उल्लंघन झाले तर तुम्ही थेट सर्वोच्च न्यायालयात जाऊ शकता. डॉ. आंबेडकरांनी याला घटनेचे "हृदय आणि आत्मा" म्हटले.'
      },
      keyPoints: {
        en: ['Direct access to Supreme Court', 'File writ petitions', 'Habeas Corpus for illegal detention', 'Called "Heart & Soul" of Constitution'],
        hi: ['सुप्रीम कोर्ट में सीधी पहुंच', 'रिट याचिका दायर करें', 'गैरकानूनी हिरासत के लिए बंदी प्रत्यक्षीकरण', 'संविधान का "हृदय और आत्मा" कहलाता है'],
        mr: ['सर्वोच्च न्यायालयात थेट प्रवेश', 'रिट याचिका दाखल करा', 'बेकायदेशीर अटकेसाठी हेबियस कॉर्पस', 'घटनेचे "हृदय आणि आत्मा" म्हणतात']
      },
      example: {
        en: 'If police detain you illegally, you or your family can file a Habeas Corpus petition in court.',
        hi: 'अगर पुलिस आपको गैरकानूनी तरीके से हिरासत में रखती है, तो आप या आपका परिवार कोर्ट में बंदी प्रत्यक्षीकरण याचिका दायर कर सकते हैं।',
        mr: 'जर पोलिसांनी तुम्हाला बेकायदेशीरपणे अटक केली, तर तुम्ही किंवा तुमचे कुटुंब न्यायालयात हेबियस कॉर्पस याचिका दाखल करू शकता.'
      }
    },
    {
      id: 'fr7',
      title: { en: 'Five Types of Writs', hi: 'पांच प्रकार की रिट', mr: 'पाच प्रकारच्या रिट' },
      content: { 
        en: 'Courts can issue 5 writs: Habeas Corpus (release from illegal detention), Mandamus (order to perform duty), Certiorari (quash order), Prohibition (stop proceedings), Quo Warranto (question authority).',
        hi: 'अदालतें 5 रिट जारी कर सकती हैं: बंदी प्रत्यक्षीकरण (अवैध हिरासत से मुक्ति), परमादेश (कर्तव्य निभाने का आदेश), उत्प्रेषण (आदेश रद्द करें), निषेध (कार्यवाही रोकें), अधिकार पृच्छा (अधिकार पर प्रश्न)।',
        mr: 'न्यायालये 5 रिट जारी करू शकतात: हेबियस कॉर्पस (बेकायदेशीर अटकेतून सुटका), मँडॅमस (कर्तव्य पार पाडण्याचा आदेश), सर्टिओरारी (आदेश रद्द करा), प्रोहिबिशन (कार्यवाही थांबवा), क्वो वॉरंटो (अधिकारावर प्रश्न).'
      },
      keyPoints: {
        en: ['Habeas Corpus - "produce the body"', 'Mandamus - "we command" (order to act)', 'Certiorari - quash lower court order', 'Quo Warranto - challenge illegal authority'],
        hi: ['बंदी प्रत्यक्षीकरण - "शरीर प्रस्तुत करो"', 'परमादेश - "हम आदेश देते हैं" (कार्य करने का आदेश)', 'उत्प्रेषण - निचली अदालत का आदेश रद्द करें', 'अधिकार पृच्छा - अवैध अधिकार को चुनौती'],
        mr: ['हेबियस कॉर्पस - "शरीर हजर करा"', 'मँडॅमस - "आम्ही आदेश देतो" (कृती करण्याचा आदेश)', 'सर्टिओरारी - खालच्या न्यायालयाचा आदेश रद्द करा', 'क्वो वॉरंटो - बेकायदेशीर अधिकाराला आव्हान']
      },
      example: {
        en: 'Quo Warranto can be filed if someone is holding a public office without proper qualifications.',
        hi: 'अगर कोई बिना उचित योग्यता के सार्वजनिक पद पर है, तो अधिकार पृच्छा दायर की जा सकती है।',
        mr: 'जर कोणी योग्य पात्रतेशिवाय सार्वजनिक पद धारण करत असेल तर क्वो वॉरंटो दाखल करता येतो.'
      }
    },
    {
      id: 'fr8',
      title: { en: 'Right to Privacy (Article 21)', hi: 'निजता का अधिकार (अनुच्छेद 21)', mr: 'गोपनीयतेचा अधिकार (कलम 21)' },
      content: { 
        en: 'Right to Privacy is a fundamental right under Article 21. The landmark Puttaswamy judgment (2017) confirmed privacy as intrinsic to life and liberty.',
        hi: 'निजता का अधिकार अनुच्छेद 21 के तहत मौलिक अधिकार है। पुट्टस्वामी फैसले (2017) ने निजता को जीवन और स्वतंत्रता का अभिन्न अंग माना।',
        mr: 'गोपनीयतेचा अधिकार कलम 21 अंतर्गत मूलभूत अधिकार आहे. पुट्टस्वामी निकालाने (2017) गोपनीयता जीवन आणि स्वातंत्र्याचा अविभाज्य भाग मानला.'
      },
      keyPoints: {
        en: ['Part of Right to Life (Article 21)', 'Puttaswamy case landmark judgment', 'Covers bodily autonomy', 'Protection of personal data'],
        hi: ['जीवन के अधिकार का हिस्सा (अनुच्छेद 21)', 'पुट्टस्वामी केस ऐतिहासिक फैसला', 'शारीरिक स्वायत्तता शामिल', 'व्यक्तिगत डेटा का संरक्षण'],
        mr: ['जीवनाच्या अधिकाराचा भाग (कलम 21)', 'पुट्टस्वामी केस ऐतिहासिक निकाल', 'शारीरिक स्वायत्तता समाविष्ट', 'वैयक्तिक डेटाचे संरक्षण']
      },
      example: {
        en: 'Government cannot force Aadhaar for all services without legal backing, as privacy is protected.',
        hi: 'सरकार कानूनी समर्थन के बिना सभी सेवाओं के लिए आधार अनिवार्य नहीं कर सकती, क्योंकि निजता संरक्षित है।',
        mr: 'सरकार कायदेशीर आधाराशिवाय सर्व सेवांसाठी आधार अनिवार्य करू शकत नाही, कारण गोपनीयता संरक्षित आहे.'
      }
    },
    {
      id: 'fr9',
      title: { en: 'Protection Against Self-Incrimination (Article 20)', hi: 'आत्म-दोषारोपण से सुरक्षा (अनुच्छेद 20)', mr: 'स्वतःविरुद्ध साक्ष देण्यापासून संरक्षण (कलम 20)' },
      content: { 
        en: 'Article 20(3) protects you from being forced to be a witness against yourself. No one can force you to confess a crime.',
        hi: 'अनुच्छेद 20(3) आपको अपने खिलाफ गवाह बनने के लिए मजबूर किए जाने से बचाता है। कोई आपको अपराध स्वीकार करने के लिए मजबूर नहीं कर सकता।',
        mr: 'कलम 20(3) तुम्हाला स्वतःविरुद्ध साक्षीदार बनण्यास भाग पाडण्यापासून संरक्षण देतो. कोणीही तुम्हाला गुन्हा कबूल करण्यास भाग पाडू शकत नाही.'
      },
      keyPoints: {
        en: ['Cannot be forced to confess', 'No retrospective criminal laws', 'No double punishment for same offense', 'Silent right in custody'],
        hi: ['स्वीकारोक्ति के लिए मजबूर नहीं किया जा सकता', 'पूर्वव्यापी आपराधिक कानून नहीं', 'एक ही अपराध के लिए दोहरी सजा नहीं', 'हिरासत में मौन का अधिकार'],
        mr: ['कबुलीजबाब देण्यास भाग पाडता येत नाही', 'पूर्वलक्षी गुन्हेगारी कायदे नाहीत', 'एकाच गुन्ह्यासाठी दुहेरी शिक्षा नाही', 'कोठडीत मौनाचा अधिकार']
      },
      example: {
        en: 'Police cannot force you to sign a confession. Any forced confession is not valid in court.',
        hi: 'पुलिस आपको जबरदस्ती इकबालिया बयान पर हस्ताक्षर नहीं करा सकती। कोई भी जबरन इकबालिया बयान अदालत में मान्य नहीं है।',
        mr: 'पोलीस तुम्हाला जबरदस्तीने कबुलीजबाबावर स्वाक्षरी करण्यास भाग पाडू शकत नाहीत. कोणताही जबरदस्तीने घेतलेला कबुलीजबाब न्यायालयात वैध नाही.'
      }
    },
    {
      id: 'fr10',
      title: { en: 'Right to Education (Article 21A)', hi: 'शिक्षा का अधिकार (अनुच्छेद 21A)', mr: 'शिक्षणाचा अधिकार (कलम 21A)' },
      content: { 
        en: 'Article 21A guarantees free and compulsory education for children aged 6-14 years. Added by the 86th Amendment in 2002.',
        hi: 'अनुच्छेद 21A 6-14 वर्ष के बच्चों के लिए मुफ्त और अनिवार्य शिक्षा की गारंटी देता है। 2002 में 86वें संशोधन द्वारा जोड़ा गया।',
        mr: 'कलम 21A 6-14 वर्षांच्या मुलांसाठी मोफत आणि अनिवार्य शिक्षणाची हमी देते. 2002 मध्ये 86व्या दुरुस्तीद्वारे जोडले.'
      },
      keyPoints: {
        en: ['Free education for ages 6-14', 'Added by 86th Amendment', 'RTE Act 2009 implemented it', '25% seats reserved in private schools'],
        hi: ['6-14 वर्ष के लिए मुफ्त शिक्षा', '86वें संशोधन द्वारा जोड़ा गया', 'RTE अधिनियम 2009 ने लागू किया', 'निजी स्कूलों में 25% सीटें आरक्षित'],
        mr: ['6-14 वर्षांसाठी मोफत शिक्षण', '86व्या दुरुस्तीद्वारे जोडले', 'RTE कायदा 2009 ने अंमलबजावणी केली', 'खाजगी शाळांमध्ये 25% जागा आरक्षित']
      },
      example: {
        en: 'Private schools must reserve 25% seats for economically weaker sections under RTE Act.',
        hi: 'निजी स्कूलों को RTE अधिनियम के तहत आर्थिक रूप से कमजोर वर्गों के लिए 25% सीटें आरक्षित करनी होंगी।',
        mr: 'खाजगी शाळांना RTE कायद्यानुसार आर्थिकदृष्ट्या दुर्बल घटकांसाठी 25% जागा आरक्षित ठेवाव्या लागतात.'
      }
    },
    {
      id: 'fr11',
      title: { en: 'Emergency & Fundamental Rights', hi: 'आपातकाल और मौलिक अधिकार', mr: 'आणीबाणी आणि मूलभूत अधिकार' },
      content: { 
        en: 'During National Emergency (Article 352), fundamental rights can be suspended EXCEPT Articles 20 and 21. The right to life can never be suspended.',
        hi: 'राष्ट्रीय आपातकाल (अनुच्छेद 352) के दौरान, अनुच्छेद 20 और 21 को छोड़कर मौलिक अधिकार निलंबित हो सकते हैं। जीवन का अधिकार कभी निलंबित नहीं होता।',
        mr: 'राष्ट्रीय आणीबाणी (कलम 352) दरम्यान, कलम 20 आणि 21 वगळता मूलभूत अधिकार निलंबित होऊ शकतात. जगण्याचा अधिकार कधीही निलंबित होत नाही.'
      },
      keyPoints: {
        en: ['Article 20 & 21 never suspended', '44th Amendment protects life & liberty', 'Article 359 allows suspension of other rights', 'President can declare emergency'],
        hi: ['अनुच्छेद 20 और 21 कभी निलंबित नहीं', '44वां संशोधन जीवन और स्वतंत्रता की रक्षा करता है', 'अनुच्छेद 359 अन्य अधिकारों के निलंबन की अनुमति देता है', 'राष्ट्रपति आपातकाल घोषित कर सकते हैं'],
        mr: ['कलम 20 आणि 21 कधीही निलंबित नाही', '44वी दुरुस्ती जीवन आणि स्वातंत्र्याचे रक्षण करते', 'कलम 359 इतर अधिकारांचे निलंबन करण्याची परवानगी देते', 'राष्ट्रपती आणीबाणी घोषित करू शकतात']
      },
      example: {
        en: 'Even during emergency, police cannot kill anyone or detain without any legal procedure.',
        hi: 'आपातकाल के दौरान भी, पुलिस किसी को नहीं मार सकती या बिना कानूनी प्रक्रिया के हिरासत में नहीं रख सकती।',
        mr: 'आणीबाणी दरम्यानही, पोलीस कोणालाही मारू शकत नाहीत किंवा कायदेशीर प्रक्रियेशिवाय ताब्यात ठेवू शकत नाहीत.'
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
        en: ['Safe products only', 'Check ISI/AGMARK marks', 'Report unsafe goods', 'Claim compensation for harm'],
        hi: ['केवल सुरक्षित उत्पाद', 'ISI/AGMARK चिह्न जांचें', 'असुरक्षित सामान की रिपोर्ट करें', 'नुकसान के लिए मुआवजे का दावा करें'],
        mr: ['फक्त सुरक्षित उत्पादने', 'ISI/AGMARK चिन्हे तपासा', 'असुरक्षित मालाची तक्रार करा', 'हानीसाठी नुकसान भरपाईचा दावा करा']
      },
      example: {
        en: 'If an electrical appliance causes fire due to defect, you can claim compensation from the manufacturer.',
        hi: 'अगर कोई विद्युत उपकरण दोष के कारण आग लगाता है, तो आप निर्माता से मुआवजे का दावा कर सकते हैं।',
        mr: 'जर एखाद्या विद्युत उपकरणामुळे दोषामुळे आग लागली, तर तुम्ही निर्मात्याकडून नुकसान भरपाईचा दावा करू शकता.'
      }
    },
    {
      id: 'cr2',
      title: { en: 'Right to Information & MRP', hi: 'सूचना और MRP का अधिकार', mr: 'माहिती आणि MRP चा अधिकार' },
      content: { 
        en: 'You have the right to know about quality, quantity, price, and standards of goods. No shop can charge above MRP (Maximum Retail Price).',
        hi: 'आपको वस्तुओं की गुणवत्ता, मात्रा, मूल्य और मानकों के बारे में जानने का अधिकार है। कोई दुकान MRP से अधिक शुल्क नहीं ले सकती।',
        mr: 'वस्तूंची गुणवत्ता, प्रमाण, किंमत आणि मानके जाणून घेण्याचा तुम्हाला अधिकार आहे. कोणतेही दुकान MRP पेक्षा जास्त शुल्क आकारू शकत नाही.'
      },
      keyPoints: {
        en: ['Check MRP before buying', 'Read expiry dates', 'MRP includes all taxes', 'Overcharging is illegal'],
        hi: ['खरीदने से पहले MRP जांचें', 'समाप्ति तिथि पढ़ें', 'MRP में सभी कर शामिल', 'अधिक शुल्क लेना अवैध'],
        mr: ['खरेदीपूर्वी MRP तपासा', 'एक्सपायरी तारीख वाचा', 'MRP मध्ये सर्व कर समाविष्ट', 'जास्त शुल्क आकारणे बेकायदेशीर']
      },
      example: {
        en: 'A shopkeeper must display the MRP on products and cannot charge more than MRP even in malls or airports.',
        hi: 'दुकानदार को उत्पादों पर MRP प्रदर्शित करना होगा और मॉल या एयरपोर्ट में भी MRP से अधिक शुल्क नहीं ले सकता।',
        mr: 'दुकानदाराने उत्पादनांवर MRP प्रदर्शित करणे आवश्यक आहे आणि मॉल किंवा विमानतळावरही MRP पेक्षा जास्त शुल्क आकारता येत नाही.'
      }
    },
    {
      id: 'cr3',
      title: { en: 'Right to Choose', hi: 'चुनने का अधिकार', mr: 'निवडण्याचा अधिकार' },
      content: { 
        en: 'You have the right to choose from a variety of goods and services at competitive prices without forced bundling.',
        hi: 'आपको प्रतिस्पर्धी कीमतों पर विभिन्न वस्तुओं और सेवाओं में से बिना जबरन बंडलिंग के चुनने का अधिकार है।',
        mr: 'स्पर्धात्मक किमतींवर विविध वस्तू आणि सेवांमधून जबरदस्ती बंडलिंगशिवाय निवड करण्याचा तुम्हाला अधिकार आहे.'
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
      title: { en: 'Right to be Heard & Consumer Forums', hi: 'सुने जाने और उपभोक्ता फोरम का अधिकार', mr: 'ऐकले जाण्याचा आणि ग्राहक मंचाचा अधिकार' },
      content: { 
        en: 'You have the right to file complaints at Consumer Forums. Three-tier system: District (up to Rs 1 crore), State (Rs 1-10 crore), National (above Rs 10 crore).',
        hi: 'आपको उपभोक्ता फोरम में शिकायत दर्ज करने का अधिकार है। तीन स्तरीय प्रणाली: जिला (Rs 1 करोड़ तक), राज्य (Rs 1-10 करोड़), राष्ट्रीय (Rs 10 करोड़ से ऊपर)।',
        mr: 'ग्राहक मंचात तक्रार दाखल करण्याचा तुम्हाला अधिकार आहे. तीन स्तरीय प्रणाली: जिल्हा (Rs 1 कोटी पर्यंत), राज्य (Rs 1-10 कोटी), राष्ट्रीय (Rs 10 कोटी वर).'
      },
      keyPoints: {
        en: ['File complaints freely', 'Three-tier consumer courts', 'Online filing available', 'Helpline 1800-11-4000 (toll-free)'],
        hi: ['स्वतंत्र रूप से शिकायत करें', 'तीन स्तरीय उपभोक्ता अदालतें', 'ऑनलाइन फाइलिंग उपलब्ध', 'हेल्पलाइन 1800-11-4000 (टोल-फ्री)'],
        mr: ['मुक्तपणे तक्रार करा', 'तीन स्तरीय ग्राहक न्यायालये', 'ऑनलाइन फायलिंग उपलब्ध', 'हेल्पलाइन 1800-11-4000 (टोल-फ्री)']
      },
      example: {
        en: 'You can file a complaint at consumerhelpline.gov.in or edaakhil.nic.in for online filing.',
        hi: 'आप consumerhelpline.gov.in या edaakhil.nic.in पर ऑनलाइन फाइलिंग के लिए शिकायत दर्ज कर सकते हैं।',
        mr: 'तुम्ही consumerhelpline.gov.in किंवा edaakhil.nic.in वर ऑनलाइन फायलिंगसाठी तक्रार दाखल करू शकता.'
      }
    },
    {
      id: 'cr5',
      title: { en: 'Quality Marks: ISI, AGMARK, BIS Hallmark, FSSAI', hi: 'गुणवत्ता चिह्न: ISI, AGMARK, BIS हॉलमार्क, FSSAI', mr: 'गुणवत्ता चिन्हे: ISI, AGMARK, BIS हॉलमार्क, FSSAI' },
      content: { 
        en: 'ISI mark for industrial products, AGMARK for agricultural products, BIS Hallmark for gold/silver, FSSAI for food safety. Always check these before buying.',
        hi: 'औद्योगिक उत्पादों के लिए ISI मार्क, कृषि उत्पादों के लिए AGMARK, सोने/चांदी के लिए BIS हॉलमार्क, खाद्य सुरक्षा के लिए FSSAI। खरीदने से पहले हमेशा जांचें।',
        mr: 'औद्योगिक उत्पादनांसाठी ISI मार्क, कृषी उत्पादनांसाठी AGMARK, सोने/चांदीसाठी BIS हॉलमार्क, अन्न सुरक्षिततेसाठी FSSAI. खरेदीपूर्वी नेहमी तपासा.'
      },
      keyPoints: {
        en: ['ISI = Industrial products', 'AGMARK = Agricultural products', 'BIS Hallmark = Gold/Silver purity', 'FSSAI = Food safety license'],
        hi: ['ISI = औद्योगिक उत्पाद', 'AGMARK = कृषि उत्पाद', 'BIS हॉलमार्क = सोने/चांदी की शुद्धता', 'FSSAI = खाद्य सुरक्षा लाइसेंस'],
        mr: ['ISI = औद्योगिक उत्पादने', 'AGMARK = कृषी उत्पादने', 'BIS हॉलमार्क = सोने/चांदी शुद्धता', 'FSSAI = अन्न सुरक्षा परवाना']
      },
      example: {
        en: 'When buying gold jewelry, always check BIS Hallmark 916 for 22 karat or 999 for 24 karat gold.',
        hi: 'सोने के आभूषण खरीदते समय, 22 कैरेट के लिए BIS हॉलमार्क 916 या 24 कैरेट के लिए 999 हमेशा जांचें।',
        mr: 'सोन्याचे दागिने खरेदी करताना, 22 कॅरेटसाठी BIS हॉलमार्क 916 किंवा 24 कॅरेटसाठी 999 नेहमी तपासा.'
      }
    },
    {
      id: 'cr6',
      title: { en: 'E-commerce Consumer Rights', hi: 'ई-कॉमर्स उपभोक्ता अधिकार', mr: 'ई-कॉमर्स ग्राहक अधिकार' },
      content: { 
        en: 'Consumer Protection (E-Commerce) Rules 2020 protect online shoppers. Sellers must display seller details, return policy, and grievance officer contact.',
        hi: 'उपभोक्ता संरक्षण (ई-कॉमर्स) नियम 2020 ऑनलाइन खरीदारों की रक्षा करते हैं। विक्रेताओं को विक्रेता विवरण, वापसी नीति और शिकायत अधिकारी संपर्क प्रदर्शित करना होगा।',
        mr: 'ग्राहक संरक्षण (ई-कॉमर्स) नियम 2020 ऑनलाइन खरेदीदारांचे संरक्षण करतात. विक्रेत्यांनी विक्रेता तपशील, परतावा धोरण आणि तक्रार अधिकारी संपर्क प्रदर्शित करणे आवश्यक आहे.'
      },
      keyPoints: {
        en: ['Return/refund within 14 days', 'Cancel order before dispatch', 'Grievance officer mandatory', 'Product must match description'],
        hi: ['14 दिनों में वापसी/रिफंड', 'डिस्पैच से पहले ऑर्डर रद्द करें', 'शिकायत अधिकारी अनिवार्य', 'उत्पाद विवरण से मेल खाना चाहिए'],
        mr: ['14 दिवसांत परतावा/रिफंड', 'डिस्पॅचपूर्वी ऑर्डर रद्द करा', 'तक्रार अधिकारी अनिवार्य', 'उत्पादन वर्णनाशी जुळणे आवश्यक']
      },
      example: {
        en: 'If product delivered is different from what was shown online, you can return and get full refund.',
        hi: 'अगर वितरित उत्पाद ऑनलाइन दिखाए गए से अलग है, तो आप वापस कर सकते हैं और पूर्ण रिफंड पा सकते हैं।',
        mr: 'जर वितरित उत्पादन ऑनलाइन दाखवलेल्यापेक्षा वेगळे असेल, तर तुम्ही परत करू शकता आणि पूर्ण रिफंड मिळवू शकता.'
      }
    },
    {
      id: 'cr7',
      title: { en: 'National Consumer Day & Rights', hi: 'राष्ट्रीय उपभोक्ता दिवस और अधिकार', mr: 'राष्ट्रीय ग्राहक दिन आणि अधिकार' },
      content: { 
        en: 'National Consumer Day is celebrated on 24th December (Consumer Protection Act 1986 passed). World Consumer Rights Day is 15th March.',
        hi: 'राष्ट्रीय उपभोक्ता दिवस 24 दिसंबर को मनाया जाता है (उपभोक्ता संरक्षण अधिनियम 1986 पारित)। विश्व उपभोक्ता अधिकार दिवस 15 मार्च है।',
        mr: 'राष्ट्रीय ग्राहक दिन 24 डिसेंबर रोजी साजरा केला जातो (ग्राहक संरक्षण कायदा 1986 मंजूर). जागतिक ग्राहक हक्क दिन 15 मार्च आहे.'
      },
      keyPoints: {
        en: ['National Consumer Day = 24 December', 'World Consumer Rights Day = 15 March', 'Consumer Protection Act 2019 (current)', 'Six consumer rights recognized'],
        hi: ['राष्ट्रीय उपभोक्ता दिवस = 24 दिसंबर', 'विश्व उपभोक्ता अधिकार दिवस = 15 मार्च', 'उपभोक्ता संरक्षण अधिनियम 2019 (वर्तमान)', 'छह उपभोक्ता अधिकार मान्यता प्राप्त'],
        mr: ['राष्ट्रीय ग्राहक दिन = 24 डिसेंबर', 'जागतिक ग्राहक हक्क दिन = 15 मार्च', 'ग्राहक संरक्षण कायदा 2019 (सध्याचा)', 'सहा ग्राहक अधिकार मान्य']
      },
      example: {
        en: 'The 6 consumer rights are: Safety, Information, Choice, Hearing, Redressal, and Consumer Education.',
        hi: '6 उपभोक्ता अधिकार हैं: सुरक्षा, सूचना, चयन, सुनवाई, निवारण और उपभोक्ता शिक्षा।',
        mr: '6 ग्राहक अधिकार आहेत: सुरक्षितता, माहिती, निवड, सुनावणी, निवारण आणि ग्राहक शिक्षण.'
      }
    },
    {
      id: 'cr8',
      title: { en: 'Consumer Complaint Filing Process', hi: 'उपभोक्ता शिकायत दाखिल करने की प्रक्रिया', mr: 'ग्राहक तक्रार दाखल करण्याची प्रक्रिया' },
      content: { 
        en: 'File complaint within 2 years of purchase. Include proof of purchase (bill), defect details, and relief sought. No lawyer required.',
        hi: 'खरीद के 2 साल के भीतर शिकायत दर्ज करें। खरीद का प्रमाण (बिल), दोष का विवरण और मांगी गई राहत शामिल करें। वकील की जरूरत नहीं।',
        mr: 'खरेदीच्या 2 वर्षांच्या आत तक्रार दाखल करा. खरेदीचा पुरावा (बिल), दोषाचे तपशील आणि मागितलेला दिलासा समाविष्ट करा. वकिलाची आवश्यकता नाही.'
      },
      keyPoints: {
        en: ['File within 2 years', 'Keep purchase bill safe', 'No lawyer needed', 'E-filing at edaakhil.nic.in'],
        hi: ['2 साल के भीतर दर्ज करें', 'खरीद बिल सुरक्षित रखें', 'वकील की जरूरत नहीं', 'edaakhil.nic.in पर ई-फाइलिंग'],
        mr: ['2 वर्षांच्या आत दाखल करा', 'खरेदी बिल सुरक्षित ठेवा', 'वकिलाची आवश्यकता नाही', 'edaakhil.nic.in वर ई-फायलिंग']
      },
      example: {
        en: 'If a mobile phone stops working within warranty, file complaint at District Forum with bill and warranty card.',
        hi: 'अगर मोबाइल फोन वारंटी में खराब हो जाए, तो बिल और वारंटी कार्ड के साथ जिला फोरम में शिकायत करें।',
        mr: 'जर मोबाइल फोन वॉरंटीमध्ये बंद पडला, तर बिल आणि वॉरंटी कार्डसह जिल्हा मंचात तक्रार दाखल करा.'
      }
    }
  ],
  women_rights: [
    {
      id: 'wr1',
      title: { en: 'Protection from Harassment (POSH Act)', hi: 'उत्पीड़न से सुरक्षा (POSH अधिनियम)', mr: 'छळापासून संरक्षण (POSH कायदा)' },
      content: { 
        en: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act 2013 protects women. Every company with 10+ employees must have Internal Complaints Committee (ICC).',
        hi: 'कार्यस्थल पर महिलाओं का यौन उत्पीड़न (रोकथाम, निषेध और निवारण) अधिनियम 2013 महिलाओं की रक्षा करता है। 10+ कर्मचारियों वाली हर कंपनी में आंतरिक शिकायत समिति (ICC) होनी चाहिए।',
        mr: 'कार्यस्थळी महिलांचे लैंगिक छळ (प्रतिबंध, निषेध आणि निवारण) कायदा 2013 महिलांचे संरक्षण करतो. 10+ कर्मचारी असलेल्या प्रत्येक कंपनीत अंतर्गत तक्रार समिती (ICC) असणे आवश्यक आहे.'
      },
      keyPoints: {
        en: ['ICC mandatory in 10+ employee companies', 'Women helpline 1091 & 181', 'Zero FIR at any police station', 'Report within 3 months'],
        hi: ['10+ कर्मचारी कंपनियों में ICC अनिवार्य', 'महिला हेल्पलाइन 1091 और 181', 'किसी भी थाने में जीरो FIR', '3 महीने के भीतर रिपोर्ट करें'],
        mr: ['10+ कर्मचारी कंपन्यांमध्ये ICC अनिवार्य', 'महिला हेल्पलाइन 1091 आणि 181', 'कोणत्याही पोलीस स्टेशनवर झिरो FIR', '3 महिन्यांच्या आत तक्रार करा']
      },
      example: {
        en: 'If harassed at work, report to ICC within 3 months. Company must resolve within 90 days.',
        hi: 'अगर कार्यस्थल पर उत्पीड़न हो, तो 3 महीने के भीतर ICC को रिपोर्ट करें। कंपनी को 90 दिनों में समाधान करना होगा।',
        mr: 'कार्यस्थळी छळ झाल्यास, 3 महिन्यांच्या आत ICC ला तक्रार करा. कंपनीने 90 दिवसांत निराकरण करणे आवश्यक आहे.'
      }
    },
    {
      id: 'wr2',
      title: { en: 'Domestic Violence Protection (DV Act 2005)', hi: 'घरेलू हिंसा से सुरक्षा (DV अधिनियम 2005)', mr: 'घरगुती हिंसेपासून संरक्षण (DV कायदा 2005)' },
      content: { 
        en: 'Protection from physical, emotional, sexual, and economic abuse by husband or relatives under Domestic Violence Act 2005.',
        hi: 'घरेलू हिंसा अधिनियम 2005 के तहत पति या रिश्तेदारों द्वारा शारीरिक, भावनात्मक, यौन और आर्थिक शोषण से सुरक्षा।',
        mr: 'घरगुती हिंसा कायदा 2005 अंतर्गत पती किंवा नातेवाईकांकडून शारीरिक, भावनिक, लैंगिक आणि आर्थिक शोषणापासून संरक्षण.'
      },
      keyPoints: {
        en: ['Right to residence in shared household', 'Protection orders available', 'Monetary relief', 'Custody of children'],
        hi: ['साझा घर में निवास का अधिकार', 'सुरक्षा आदेश उपलब्ध', 'आर्थिक राहत', 'बच्चों की कस्टडी'],
        mr: ['सामायिक घरात निवासाचा अधिकार', 'संरक्षण आदेश उपलब्ध', 'आर्थिक दिलासा', 'मुलांचा ताबा']
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
        en: 'Women have right to equal pay for equal work and 26 weeks paid maternity leave under Maternity Benefit Act 2017.',
        hi: 'मातृत्व लाभ अधिनियम 2017 के तहत महिलाओं को समान कार्य के लिए समान वेतन और 26 सप्ताह का सवेतन मातृत्व अवकाश का अधिकार है।',
        mr: 'मातृत्व लाभ कायदा 2017 अंतर्गत महिलांना समान कामासाठी समान वेतन आणि 26 आठवड्यांची सवेतन मातृत्व रजा मिळण्याचा अधिकार आहे.'
      },
      keyPoints: {
        en: ['Equal pay guaranteed', '26 weeks maternity leave', 'Creche facility mandatory (50+ employees)', 'Work from home option after leave'],
        hi: ['समान वेतन की गारंटी', '26 सप्ताह मातृत्व अवकाश', 'क्रेच सुविधा अनिवार्य (50+ कर्मचारी)', 'छुट्टी के बाद घर से काम का विकल्प'],
        mr: ['समान वेतनाची हमी', '26 आठवडे मातृत्व रजा', 'पाळणाघर सुविधा अनिवार्य (50+ कर्मचारी)', 'रजेनंतर घरून काम करण्याचा पर्याय']
      },
      example: {
        en: 'Companies with 50+ employees must provide creche facility within 500 meters.',
        hi: '50+ कर्मचारियों वाली कंपनियों को 500 मीटर के भीतर क्रेच सुविधा प्रदान करनी होगी।',
        mr: '50+ कर्मचारी असलेल्या कंपन्यांनी 500 मीटरच्या आत पाळणाघर सुविधा प्रदान करणे आवश्यक आहे.'
      }
    },
    {
      id: 'wr4',
      title: { en: 'Dowry Prohibition & Protection', hi: 'दहेज निषेध और सुरक्षा', mr: 'हुंडा निषेध आणि संरक्षण' },
      content: { 
        en: 'Dowry Prohibition Act 1961 makes giving or taking dowry punishable with 5 years imprisonment. Section 498A IPC protects against cruelty.',
        hi: 'दहेज निषेध अधिनियम 1961 दहेज देने या लेने को 5 साल की कैद से दंडनीय बनाता है। IPC की धारा 498A क्रूरता से बचाती है।',
        mr: 'हुंडा निषेध कायदा 1961 हुंडा देणे किंवा घेणे 5 वर्षांच्या कारावासाने दंडनीय करतो. IPC कलम 498A क्रूरतेपासून संरक्षण करते.'
      },
      keyPoints: {
        en: ['Dowry = 5 years imprisonment', 'Section 498A for cruelty', 'Harassment for dowry is crime', 'Both families punishable'],
        hi: ['दहेज = 5 साल कैद', 'क्रूरता के लिए धारा 498A', 'दहेज के लिए उत्पीड़न अपराध है', 'दोनों परिवार दंडनीय'],
        mr: ['हुंडा = 5 वर्षे कारावास', 'क्रूरतेसाठी कलम 498A', 'हुंड्यासाठी छळ गुन्हा आहे', 'दोन्ही कुटुंबे दंडनीय']
      },
      example: {
        en: 'If in-laws demand money/gifts after marriage, file complaint under Section 498A and Dowry Prohibition Act.',
        hi: 'अगर ससुराल वाले शादी के बाद पैसे/उपहार मांगें, तो धारा 498A और दहेज निषेध अधिनियम के तहत शिकायत करें।',
        mr: 'जर सासरच्यांनी लग्नानंतर पैसे/भेटवस्तू मागितल्या, तर कलम 498A आणि हुंडा निषेध कायद्यानुसार तक्रार करा.'
      }
    },
    {
      id: 'wr5',
      title: { en: 'Acid Attack Laws & Compensation', hi: 'एसिड अटैक कानून और मुआवजा', mr: 'ॲसिड हल्ला कायदे आणि भरपाई' },
      content: { 
        en: 'Section 326A IPC provides minimum 10 years imprisonment for acid attack. Victims entitled to minimum Rs 3 lakh compensation and free treatment.',
        hi: 'IPC की धारा 326A एसिड अटैक के लिए न्यूनतम 10 साल की कैद प्रदान करती है। पीड़ितों को न्यूनतम Rs 3 लाख मुआवजा और मुफ्त इलाज का अधिकार है।',
        mr: 'IPC कलम 326A ॲसिड हल्ल्यासाठी किमान 10 वर्षे कारावास प्रदान करते. पीडितांना किमान Rs 3 लाख भरपाई आणि मोफत उपचाराचा अधिकार आहे.'
      },
      keyPoints: {
        en: ['Minimum 10 years imprisonment', 'Rs 3 lakh minimum compensation', 'Free medical treatment', 'Acid sale regulated (Section 326B)'],
        hi: ['न्यूनतम 10 साल कैद', 'Rs 3 लाख न्यूनतम मुआवजा', 'मुफ्त चिकित्सा उपचार', 'एसिड बिक्री नियंत्रित (धारा 326B)'],
        mr: ['किमान 10 वर्षे कारावास', 'Rs 3 लाख किमान भरपाई', 'मोफत वैद्यकीय उपचार', 'ॲसिड विक्री नियंत्रित (कलम 326B)']
      },
      example: {
        en: 'Acid attack victims can get immediate first aid at any hospital and compensation from Victim Compensation Scheme.',
        hi: 'एसिड अटैक पीड़ित किसी भी अस्पताल में तत्काल प्राथमिक उपचार और पीड़ित मुआवजा योजना से मुआवजा प्राप्त कर सकते हैं।',
        mr: 'ॲसिड हल्ल्याच्या पीडितांना कोणत्याही रुग्णालयात तात्काळ प्रथमोपचार आणि पीडित भरपाई योजनेतून भरपाई मिळू शकते.'
      }
    },
    {
      id: 'wr6',
      title: { en: 'Cyber Harassment & IT Act', hi: 'साइबर उत्पीड़न और IT अधिनियम', mr: 'सायबर छळ आणि IT कायदा' },
      content: { 
        en: 'Sections 66E, 67, 67A of IT Act protect against voyeurism, sharing intimate images, and online harassment. Report at cybercrime.gov.in.',
        hi: 'IT अधिनियम की धारा 66E, 67, 67A दृश्यरतिकता, अंतरंग छवियों को साझा करने और ऑनलाइन उत्पीड़न से बचाती हैं। cybercrime.gov.in पर रिपोर्ट करें।',
        mr: 'IT कायद्याचे कलम 66E, 67, 67A दृश्यरतिकता, अंतरंग प्रतिमा शेअर करणे आणि ऑनलाइन छळापासून संरक्षण करतात. cybercrime.gov.in वर तक्रार करा.'
      },
      keyPoints: {
        en: ['Section 66E - Voyeurism', 'Section 67A - Intimate images', 'Cyber Crime helpline 1930', 'NCW helpline 7827-170-170'],
        hi: ['धारा 66E - दृश्यरतिकता', 'धारा 67A - अंतरंग छवियां', 'साइबर अपराध हेल्पलाइन 1930', 'NCW हेल्पलाइन 7827-170-170'],
        mr: ['कलम 66E - दृश्यरतिकता', 'कलम 67A - अंतरंग प्रतिमा', 'सायबर गुन्हे हेल्पलाइन 1930', 'NCW हेल्पलाइन 7827-170-170']
      },
      example: {
        en: 'If someone shares your private photos without consent, report at cybercrime.gov.in and file FIR under Section 67A.',
        hi: 'अगर कोई आपकी निजी तस्वीरें बिना सहमति के साझा करे, तो cybercrime.gov.in पर रिपोर्ट करें और धारा 67A के तहत FIR दर्ज करें।',
        mr: 'जर कोणी तुमचे खाजगी फोटो संमतीशिवाय शेअर केले, तर cybercrime.gov.in वर तक्रार करा आणि कलम 67A अंतर्गत FIR दाखल करा.'
      }
    },
    {
      id: 'wr7',
      title: { en: 'Legal Marriage Age & Child Marriage', hi: 'कानूनी विवाह आयु और बाल विवाह', mr: 'कायदेशीर विवाह वय आणि बालविवाह' },
      content: { 
        en: 'Legal marriage age is 18 for women and 21 for men. Child marriage is punishable. PCMA (Prohibition of Child Marriage Act) protects minors.',
        hi: 'कानूनी विवाह की उम्र महिलाओं के लिए 18 और पुरुषों के लिए 21 है। बाल विवाह दंडनीय है। PCMA (बाल विवाह निषेध अधिनियम) नाबालिगों की रक्षा करता है।',
        mr: 'कायदेशीर विवाह वय महिलांसाठी 18 आणि पुरुषांसाठी 21 आहे. बालविवाह दंडनीय आहे. PCMA (बालविवाह निषेध कायदा) अल्पवयीनांचे संरक्षण करतो.'
      },
      keyPoints: {
        en: ['Women = 18, Men = 21', 'Child marriage is void/voidable', 'Report to Childline 1098', '2 years imprisonment for violators'],
        hi: ['महिला = 18, पुरुष = 21', 'बाल विवाह शून्य/शून्यकरणीय', 'चाइल्डलाइन 1098 पर रिपोर्ट करें', 'उल्लंघनकर्ताओं को 2 साल कैद'],
        mr: ['महिला = 18, पुरुष = 21', 'बालविवाह रद्द/रद्दयोग्य', 'चाइल्डलाइन 1098 वर तक्रार करा', 'उल्लंघनकर्त्यांना 2 वर्षे कारावास']
      },
      example: {
        en: 'If you know about a planned child marriage, inform Childline 1098 or District Magistrate to stop it.',
        hi: 'अगर आपको किसी बाल विवाह की योजना की जानकारी है, तो इसे रोकने के लिए चाइल्डलाइन 1098 या जिला मजिस्ट्रेट को सूचित करें।',
        mr: 'जर तुम्हाला नियोजित बालविवाहाची माहिती असेल, तर ते थांबवण्यासाठी चाइल्डलाइन 1098 किंवा जिल्हा दंडाधिकाऱ्यांना कळवा.'
      }
    },
    {
      id: 'wr8',
      title: { en: 'Nirbhaya Fund & Safety Initiatives', hi: 'निर्भया फंड और सुरक्षा पहल', mr: 'निर्भया निधी आणि सुरक्षा उपक्रम' },
      content: { 
        en: 'Nirbhaya Fund created for women safety projects. One Stop Centres (Sakhi Centres) provide 24/7 support including shelter, legal aid, and counseling.',
        hi: 'महिला सुरक्षा परियोजनाओं के लिए निर्भया फंड बनाया गया। वन स्टॉप सेंटर (सखी केंद्र) आश्रय, कानूनी सहायता और परामर्श सहित 24/7 सहायता प्रदान करते हैं।',
        mr: 'महिला सुरक्षा प्रकल्पांसाठी निर्भया निधी तयार करण्यात आला. वन स्टॉप सेंटर (सखी केंद्र) आश्रय, कायदेशीर मदत आणि समुपदेशनासह 24/7 सहाय्य प्रदान करतात.'
      },
      keyPoints: {
        en: ['One Stop Centres in every district', '24/7 helpline 181', 'Free legal aid', 'Shelter and medical help'],
        hi: ['हर जिले में वन स्टॉप सेंटर', '24/7 हेल्पलाइन 181', 'मुफ्त कानूनी सहायता', 'आश्रय और चिकित्सा सहायता'],
        mr: ['प्रत्येक जिल्ह्यात वन स्टॉप सेंटर', '24/7 हेल्पलाइन 181', 'मोफत कायदेशीर मदत', 'आश्रय आणि वैद्यकीय मदत']
      },
      example: {
        en: 'Women in distress can visit nearest Sakhi Centre for immediate help including temporary shelter and police assistance.',
        hi: 'संकट में महिलाएं अस्थायी आश्रय और पुलिस सहायता सहित तत्काल सहायता के लिए निकटतम सखी केंद्र जा सकती हैं।',
        mr: 'संकटात असलेल्या महिला तात्पुरते आश्रय आणि पोलीस सहाय्यासह तात्काळ मदतीसाठी जवळच्या सखी केंद्रात जाऊ शकतात.'
      }
    }
  ],
  police_rights: [
    {
      id: 'pr1',
      title: { en: 'Rights During Arrest (D.K. Basu Guidelines)', hi: 'गिरफ्तारी के दौरान अधिकार (D.K. बसु दिशानिर्देश)', mr: 'अटकेदरम्यान अधिकार (D.K. बसू मार्गदर्शक तत्त्वे)' },
      content: { 
        en: 'D.K. Basu vs State of West Bengal (1997) laid down guidelines for arrest. Police must show ID, inform grounds of arrest, and present before magistrate within 24 hours.',
        hi: 'D.K. बसु बनाम पश्चिम बंगाल राज्य (1997) ने गिरफ्तारी के दिशानिर्देश दिए। पुलिस को ID दिखाना होगा, गिरफ्तारी का कारण बताना होगा, और 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश करना होगा।',
        mr: 'D.K. बसू विरुद्ध पश्चिम बंगाल राज्य (1997) ने अटकेसाठी मार्गदर्शक तत्त्वे दिली. पोलिसांनी ID दाखवणे, अटकेचे कारण सांगणे आणि 24 तासांच्या आत मॅजिस्ट्रेटसमोर हजर करणे आवश्यक आहे.'
      },
      keyPoints: {
        en: ['Right to know arrest reason', 'Inform family immediately', 'Right to lawyer', 'Medical examination mandatory'],
        hi: ['गिरफ्तारी का कारण जानने का अधिकार', 'तुरंत परिवार को सूचित करें', 'वकील का अधिकार', 'चिकित्सा जांच अनिवार्य'],
        mr: ['अटकेचे कारण जाणून घेण्याचा अधिकार', 'तात्काळ कुटुंबाला कळवा', 'वकिलाचा अधिकार', 'वैद्यकीय तपासणी अनिवार्य']
      },
      example: {
        en: 'If arrested, immediately ask police to inform your family member and request for a lawyer.',
        hi: 'अगर गिरफ्तार किया जाए, तो तुरंत पुलिस से अपने परिवार के सदस्य को सूचित करने और वकील की मांग करें।',
        mr: 'जर अटक झाली, तर तात्काळ पोलिसांना तुमच्या कुटुंबातील सदस्याला कळवण्यास सांगा आणि वकिलाची मागणी करा.'
      }
    },
    {
      id: 'pr2',
      title: { en: 'Right to File Zero FIR & e-FIR', hi: 'जीरो FIR और e-FIR दर्ज करने का अधिकार', mr: 'झिरो FIR आणि e-FIR दाखल करण्याचा अधिकार' },
      content: { 
        en: 'You can file FIR at any police station regardless of where crime occurred. Many states offer e-FIR for certain crimes online.',
        hi: 'आप किसी भी पुलिस स्टेशन पर FIR दर्ज कर सकते हैं, चाहे अपराध कहीं भी हुआ हो। कई राज्य कुछ अपराधों के लिए ऑनलाइन e-FIR प्रदान करते हैं।',
        mr: 'गुन्हा कुठेही घडला असला तरी तुम्ही कोणत्याही पोलीस स्टेशनवर FIR दाखल करू शकता. अनेक राज्ये काही गुन्ह्यांसाठी ऑनलाइन e-FIR प्रदान करतात.'
      },
      keyPoints: {
        en: ['File at any station', 'Get FIR copy free', 'e-FIR for vehicle theft, lost items', 'Complaint to SP if refused'],
        hi: ['किसी भी स्टेशन पर दर्ज करें', 'FIR कॉपी मुफ्त पाएं', 'वाहन चोरी, खोई वस्तुओं के लिए e-FIR', 'इनकार पर SP को शिकायत'],
        mr: ['कोणत्याही स्टेशनवर दाखल करा', 'FIR प्रत मोफत मिळवा', 'वाहन चोरी, हरवलेल्या वस्तूंसाठी e-FIR', 'नकार दिल्यास SP ला तक्रार']
      },
      example: {
        en: 'If your phone is stolen in Delhi, you can file Zero FIR in Mumbai and it will be transferred.',
        hi: 'अगर आपका फोन दिल्ली में चोरी हो जाए, तो आप मुंबई में जीरो FIR दर्ज कर सकते हैं और इसे ट्रांसफर किया जाएगा।',
        mr: 'जर तुमचा फोन दिल्लीत चोरीला गेला, तर तुम्ही मुंबईत झिरो FIR दाखल करू शकता आणि ती हस्तांतरित केली जाईल.'
      }
    },
    {
      id: 'pr3',
      title: { en: 'Protection Against Torture & Custodial Death', hi: 'यातना और हिरासत में मृत्यु से सुरक्षा', mr: 'छळ आणि कोठडीतील मृत्यूपासून संरक्षण' },
      content: { 
        en: 'Police cannot torture, beat, or use third-degree methods. Custodial death/violence can be reported to NHRC or Judicial Magistrate.',
        hi: 'पुलिस यातना, पिटाई या थर्ड-डिग्री तरीके नहीं अपना सकती। हिरासत में मृत्यु/हिंसा की रिपोर्ट NHRC या न्यायिक मजिस्ट्रेट को की जा सकती है।',
        mr: 'पोलीस छळ, मारहाण किंवा थर्ड-डिग्री पद्धती वापरू शकत नाहीत. कोठडीतील मृत्यू/हिंसेची तक्रार NHRC किंवा न्यायिक दंडाधिकाऱ्याला करता येते.'
      },
      keyPoints: {
        en: ['No physical torture', 'Medical exam every 48 hours in custody', 'Complaint to NHRC (nhrc.nic.in)', 'Compensation for torture victims'],
        hi: ['कोई शारीरिक यातना नहीं', 'हिरासत में हर 48 घंटे मेडिकल जांच', 'NHRC में शिकायत (nhrc.nic.in)', 'यातना पीड़ितों को मुआवजा'],
        mr: ['शारीरिक छळ नाही', 'कोठडीत दर 48 तासांनी वैद्यकीय तपासणी', 'NHRC मध्ये तक्रार (nhrc.nic.in)', 'छळ पीडितांना भरपाई']
      },
      example: {
        en: 'If tortured in custody, get a medical report immediately and file complaint with NHRC.',
        hi: 'अगर कस्टडी में यातना दी जाए, तो तुरंत मेडिकल रिपोर्ट लें और NHRC में शिकायत करें।',
        mr: 'जर कोठडीत छळ झाला, तर तात्काळ वैद्यकीय अहवाल घ्या आणि NHRC मध्ये तक्रार दाखल करा.'
      }
    },
    {
      id: 'pr4',
      title: { en: 'Confession & Evidence Rules', hi: 'इकबालिया बयान और साक्ष्य नियम', mr: 'कबुलीजबाब आणि पुरावा नियम' },
      content: { 
        en: 'Confession made to police is not admissible in court (Section 25 Evidence Act). Only confession to Magistrate is valid.',
        hi: 'पुलिस को दिया गया इकबालिया बयान अदालत में मान्य नहीं है (साक्ष्य अधिनियम धारा 25)। केवल मजिस्ट्रेट को दिया गया इकबालिया बयान मान्य है।',
        mr: 'पोलिसांना दिलेला कबुलीजबाब न्यायालयात ग्राह्य नाही (पुरावा कायदा कलम 25). फक्त मॅजिस्ट्रेटला दिलेला कबुलीजबाब वैध आहे.'
      },
      keyPoints: {
        en: ['Confession to police not valid', 'Section 25 Evidence Act', 'Only Magistrate confession valid', 'Narco test requires consent'],
        hi: ['पुलिस को इकबालिया बयान मान्य नहीं', 'साक्ष्य अधिनियम धारा 25', 'केवल मजिस्ट्रेट को इकबालिया बयान मान्य', 'नार्को टेस्ट के लिए सहमति आवश्यक'],
        mr: ['पोलिसांना कबुलीजबाब वैध नाही', 'पुरावा कायदा कलम 25', 'फक्त मॅजिस्ट्रेटला कबुलीजबाब वैध', 'नार्को टेस्टसाठी संमती आवश्यक']
      },
      example: {
        en: 'If police force you to sign a confession, do not sign. It has no legal value in court.',
        hi: 'अगर पुलिस आपको जबरदस्ती इकबालिया बयान पर हस्ताक्षर करने के लिए कहे, तो हस्ताक्षर न करें। इसका कोर्ट में कोई कानूनी महत्व नहीं है।',
        mr: 'जर पोलिसांनी तुम्हाला जबरदस्तीने कबुलीजबाबावर स्वाक्षरी करण्यास सांगितले, तर स्वाक्षरी करू नका. त्याला न्यायालयात कोणतेही कायदेशीर मूल्य नाही.'
      }
    },
    {
      id: 'pr5',
      title: { en: 'Charge Sheet & Bail Rights', hi: 'चार्जशीट और जमानत अधिकार', mr: 'चार्जशीट आणि जामीन अधिकार' },
      content: { 
        en: 'Police must file charge sheet within 60-90 days. Default bail available if charge sheet delayed. Bail is the rule, jail is exception.',
        hi: 'पुलिस को 60-90 दिनों में चार्जशीट दाखिल करनी होगी। चार्जशीट में देरी होने पर डिफॉल्ट जमानत उपलब्ध। जमानत नियम है, जेल अपवाद।',
        mr: 'पोलिसांनी 60-90 दिवसांत चार्जशीट दाखल करणे आवश्यक. चार्जशीटला विलंब झाल्यास डिफॉल्ट जामीन उपलब्ध. जामीन नियम आहे, तुरुंग अपवाद.'
      },
      keyPoints: {
        en: ['Charge sheet within 60-90 days', 'Default bail if delayed', 'Anticipatory bail available', 'Bail is the rule'],
        hi: ['60-90 दिनों में चार्जशीट', 'देरी पर डिफॉल्ट जमानत', 'अग्रिम जमानत उपलब्ध', 'जमानत नियम है'],
        mr: ['60-90 दिवसांत चार्जशीट', 'विलंबावर डिफॉल्ट जामीन', 'अग्रिम जामीन उपलब्ध', 'जामीन नियम आहे']
      },
      example: {
        en: 'If police do not file charge sheet in 90 days, you can apply for default bail under Section 167(2) CrPC.',
        hi: 'अगर पुलिस 90 दिनों में चार्जशीट दाखिल नहीं करती, तो आप CrPC धारा 167(2) के तहत डिफॉल्ट जमानत के लिए आवेदन कर सकते हैं।',
        mr: 'जर पोलिसांनी 90 दिवसांत चार्जशीट दाखल केली नाही, तर तुम्ही CrPC कलम 167(2) अंतर्गत डिफॉल्ट जामिनासाठी अर्ज करू शकता.'
      }
    },
    {
      id: 'pr6',
      title: { en: 'Lok Adalat & Alternative Dispute Resolution', hi: 'लोक अदालत और वैकल्पिक विवाद समाधान', mr: 'लोक अदालत आणि पर्यायी वाद निवारण' },
      content: { 
        en: 'Lok Adalat provides free, quick settlement of disputes. No court fees, decisions are final and binding. Covers motor accident, matrimonial, labor cases.',
        hi: 'लोक अदालत विवादों का मुफ्त, त्वरित निपटारा प्रदान करती है। कोई कोर्ट फीस नहीं, निर्णय अंतिम और बाध्यकारी। मोटर दुर्घटना, वैवाहिक, श्रम मामलों को कवर करता है।',
        mr: 'लोक अदालत वादांचे मोफत, जलद निवारण प्रदान करते. कोर्ट फी नाही, निर्णय अंतिम आणि बंधनकारक. मोटार अपघात, वैवाहिक, कामगार प्रकरणे समाविष्ट.'
      },
      keyPoints: {
        en: ['Free of cost', 'No appeal against decision', 'Quick resolution', 'Covers compoundable offenses'],
        hi: ['मुफ्त', 'निर्णय के खिलाफ कोई अपील नहीं', 'त्वरित समाधान', 'समझौता योग्य अपराधों को कवर करता है'],
        mr: ['मोफत', 'निर्णयाविरुद्ध अपील नाही', 'जलद निराकरण', 'समझौतायोग्य गुन्हे समाविष्ट']
      },
      example: {
        en: 'Motor accident claims can be settled in Lok Adalat without lawyer and court fees.',
        hi: 'मोटर दुर्घटना के दावे लोक अदालत में बिना वकील और कोर्ट फीस के निपटाए जा सकते हैं।',
        mr: 'मोटार अपघाताचे दावे लोक अदालतमध्ये वकील आणि कोर्ट फीशिवाय निकाली काढता येतात.'
      }
    },
    {
      id: 'pr7',
      title: { en: 'Free Legal Aid (NALSA)', hi: 'मुफ्त कानूनी सहायता (NALSA)', mr: 'मोफत कायदेशीर मदत (NALSA)' },
      content: { 
        en: 'Free legal aid available under NALSA for SC/ST, women, children, disabled, victims of trafficking, industrial workers earning below Rs 9,000/month.',
        hi: 'NALSA के तहत SC/ST, महिलाओं, बच्चों, विकलांगों, तस्करी पीड़ितों, Rs 9,000/माह से कम कमाने वाले औद्योगिक श्रमिकों के लिए मुफ्त कानूनी सहायता उपलब्ध।',
        mr: 'NALSA अंतर्गत SC/ST, महिला, मुले, अपंग, तस्करी पीडित, Rs 9,000/महिना पेक्षा कमी कमावणाऱ्या औद्योगिक कामगारांसाठी मोफत कायदेशीर मदत उपलब्ध.'
      },
      keyPoints: {
        en: ['SC/ST entitled', 'Women and children', 'Industrial workers below Rs 9,000', 'Apply at District Legal Services Authority'],
        hi: ['SC/ST हकदार', 'महिलाएं और बच्चे', 'Rs 9,000 से कम के औद्योगिक श्रमिक', 'जिला विधिक सेवा प्राधिकरण में आवेदन करें'],
        mr: ['SC/ST हक्कदार', 'महिला आणि मुले', 'Rs 9,000 पेक्षा कमी औद्योगिक कामगार', 'जिल्हा विधी सेवा प्राधिकरणात अर्ज करा']
      },
      example: {
        en: 'If you cannot afford a lawyer, apply at District Legal Services Authority (DLSA) for free lawyer.',
        hi: 'अगर आप वकील का खर्च वहन नहीं कर सकते, तो मुफ्त वकील के लिए जिला विधिक सेवा प्राधिकरण (DLSA) में आवेदन करें।',
        mr: 'जर तुम्हाला वकिलाचा खर्च परवडत नसेल, तर मोफत वकिलासाठी जिल्हा विधी सेवा प्राधिकरण (DLSA) मध्ये अर्ज करा.'
      }
    },
    {
      id: 'pr8',
      title: { en: 'Women Arrest Rules', hi: 'महिला गिरफ्तारी नियम', mr: 'महिला अटक नियम' },
      content: { 
        en: 'Women cannot be arrested after sunset and before sunrise except by lady police. Statement can be recorded at home. Medical examination by female doctor only.',
        hi: 'सूर्यास्त के बाद और सूर्योदय से पहले महिलाओं को महिला पुलिस के अलावा गिरफ्तार नहीं किया जा सकता। बयान घर पर दर्ज किया जा सकता है। चिकित्सा जांच केवल महिला डॉक्टर द्वारा।',
        mr: 'सूर्यास्तानंतर आणि सूर्योदयापूर्वी महिला पोलिसांशिवाय महिलांना अटक करता येत नाही. जबानी घरी नोंदवता येते. वैद्यकीय तपासणी फक्त महिला डॉक्टरकडून.'
      },
      keyPoints: {
        en: ['No arrest after sunset', 'Lady police mandatory', 'Statement at home option', 'Female doctor for medical exam'],
        hi: ['सूर्यास्त के बाद गिरफ्तारी नहीं', 'महिला पुलिस अनिवार्य', 'घर पर बयान का विकल्प', 'मेडिकल जांच के लिए महिला डॉक्टर'],
        mr: ['सूर्यास्तानंतर अटक नाही', 'महिला पोलीस अनिवार्य', 'घरी जबानीचा पर्याय', 'वैद्यकीय तपासणीसाठी महिला डॉक्टर']
      },
      example: {
        en: 'If police come to arrest a woman at night, she can refuse and ask them to come after sunrise with lady constable.',
        hi: 'अगर पुलिस रात को किसी महिला को गिरफ्तार करने आए, तो वह मना कर सकती है और उन्हें महिला कांस्टेबल के साथ सूर्योदय के बाद आने को कह सकती है।',
        mr: 'जर पोलीस रात्री एखाद्या महिलेला अटक करण्यासाठी आले, तर ती नकार देऊ शकते आणि त्यांना महिला कॉन्स्टेबलसह सूर्योदयानंतर येण्यास सांगू शकते.'
      }
    }
  ],
  rti_rights: [
    {
      id: 'rti1',
      title: { en: 'What is RTI Act 2005?', hi: 'RTI अधिनियम 2005 क्या है?', mr: 'RTI कायदा 2005 म्हणजे काय?' },
      content: { 
        en: 'Right to Information Act 2005 allows citizens to request information from government departments. PIO must respond within 30 days.',
        hi: 'सूचना का अधिकार अधिनियम 2005 नागरिकों को सरकारी विभागों से जानकारी मांगने की अनुमति देता है। PIO को 30 दिनों में जवाब देना होगा।',
        mr: 'माहितीचा अधिकार कायदा 2005 नागरिकांना सरकारी विभागांकडून माहिती मागण्याची परवानगी देतो. PIO ने 30 दिवसांत उत्तर देणे आवश्यक.'
      },
      keyPoints: {
        en: ['Any citizen can apply', 'Rs 10 application fee', '30 days response time', 'Life matter = 48 hours response'],
        hi: ['कोई भी नागरिक आवेदन कर सकता है', 'Rs 10 आवेदन शुल्क', '30 दिन में जवाब', 'जीवन मामला = 48 घंटे में जवाब'],
        mr: ['कोणताही नागरिक अर्ज करू शकतो', 'Rs 10 अर्ज शुल्क', '30 दिवसांत उत्तर', 'जीवन प्रकरण = 48 तासांत उत्तर']
      },
      example: {
        en: 'You can file RTI to know the status of your passport application or any government scheme.',
        hi: 'आप अपने पासपोर्ट आवेदन या किसी सरकारी योजना की स्थिति जानने के लिए RTI दर्ज कर सकते हैं।',
        mr: 'तुमच्या पासपोर्ट अर्जाची किंवा कोणत्याही सरकारी योजनेची स्थिती जाणून घेण्यासाठी तुम्ही RTI दाखल करू शकता.'
      }
    },
    {
      id: 'rti2',
      title: { en: 'How to File RTI - Online & Offline', hi: 'RTI कैसे दाखिल करें - ऑनलाइन और ऑफलाइन', mr: 'RTI कसा दाखल करावा - ऑनलाइन आणि ऑफलाइन' },
      content: { 
        en: 'Write application to PIO of concerned department. Online filing at rtionline.gov.in for central departments. BPL card holders exempt from fee.',
        hi: 'संबंधित विभाग के PIO को आवेदन लिखें। केंद्रीय विभागों के लिए rtionline.gov.in पर ऑनलाइन दाखिल करें। BPL कार्ड धारक शुल्क से मुक्त।',
        mr: 'संबंधित विभागाच्या PIO ला अर्ज लिहा. केंद्रीय विभागांसाठी rtionline.gov.in वर ऑनलाइन दाखल करा. BPL कार्डधारक शुल्कातून मुक्त.'
      },
      keyPoints: {
        en: ['Online at rtionline.gov.in', 'Offline on plain paper', 'BPL exempt from fee', 'Keep receipt/acknowledgment'],
        hi: ['rtionline.gov.in पर ऑनलाइन', 'सादे कागज पर ऑफलाइन', 'BPL शुल्क से मुक्त', 'रसीद/पावती रखें'],
        mr: ['rtionline.gov.in वर ऑनलाइन', 'साध्या कागदावर ऑफलाइन', 'BPL शुल्कातून मुक्त', 'पावती ठेवा']
      },
      example: {
        en: 'Visit rtionline.gov.in, select department, fill details, pay Rs 10, and submit your questions.',
        hi: 'rtionline.gov.in पर जाएं, विभाग चुनें, विवरण भरें, Rs 10 भुगतान करें, और अपने प्रश्न जमा करें।',
        mr: 'rtionline.gov.in वर जा, विभाग निवडा, तपशील भरा, Rs 10 भरा आणि तुमचे प्रश्न सबमिट करा.'
      }
    },
    {
      id: 'rti3',
      title: { en: 'First & Second Appeal Process', hi: 'प्रथम और द्वितीय अपील प्रक्रिया', mr: 'पहिली आणि दुसरी अपील प्रक्रिया' },
      content: { 
        en: 'If not satisfied with response, file first appeal within 30 days to First Appellate Authority. Second appeal to CIC (Central) or SIC (State) within 90 days.',
        hi: 'अगर जवाब से संतुष्ट नहीं, 30 दिनों के भीतर प्रथम अपीलीय प्राधिकरण को पहली अपील दायर करें। 90 दिनों के भीतर CIC (केंद्रीय) या SIC (राज्य) को दूसरी अपील।',
        mr: 'उत्तराने समाधान नसल्यास, 30 दिवसांच्या आत प्रथम अपील प्राधिकरणाला पहिली अपील दाखल करा. 90 दिवसांच्या आत CIC (केंद्रीय) किंवा SIC (राज्य) ला दुसरी अपील.'
      },
      keyPoints: {
        en: ['First appeal within 30 days', 'Second appeal within 90 days', 'CIC for Central, SIC for State', 'No fee for appeals'],
        hi: ['30 दिनों में पहली अपील', '90 दिनों में दूसरी अपील', 'केंद्र के लिए CIC, राज्य के लिए SIC', 'अपील के लिए कोई शुल्क नहीं'],
        mr: ['30 दिवसांत पहिली अपील', '90 दिवसांत दुसरी अपील', 'केंद्रासाठी CIC, राज्यासाठी SIC', 'अपीलसाठी शुल्क नाही']
      },
      example: {
        en: 'If PIO does not respond in 30 days, file appeal with First Appellate Authority mentioned in the office.',
        hi: 'अगर PIO 30 दिनों में जवाब नहीं देता, तो कार्यालय में उल्लिखित प्रथम अपीलीय प्राधिकरण में अपील दायर करें।',
        mr: 'जर PIO 30 दिवसांत उत्तर देत नसेल, तर कार्यालयात नमूद प्रथम अपील प्राधिकरणाकडे अपील दाखल करा.'
      }
    },
    {
      id: 'rti4',
      title: { en: 'CIC & State Information Commissions', hi: 'CIC और राज्य सूचना आयोग', mr: 'CIC आणि राज्य माहिती आयोग' },
      content: { 
        en: 'Central Information Commission (CIC) handles central government RTIs. State Information Commission (SIC) handles state government RTIs.',
        hi: 'केंद्रीय सूचना आयोग (CIC) केंद्र सरकार के RTI संभालता है। राज्य सूचना आयोग (SIC) राज्य सरकार के RTI संभालता है।',
        mr: 'केंद्रीय माहिती आयोग (CIC) केंद्र सरकारचे RTI हाताळतो. राज्य माहिती आयोग (SIC) राज्य सरकारचे RTI हाताळतो.'
      },
      keyPoints: {
        en: ['CIC = Central departments', 'SIC = State departments', 'Can impose penalty on PIO', 'Final appellate authority'],
        hi: ['CIC = केंद्रीय विभाग', 'SIC = राज्य विभाग', 'PIO पर जुर्माना लगा सकते हैं', 'अंतिम अपीलीय प्राधिकरण'],
        mr: ['CIC = केंद्रीय विभाग', 'SIC = राज्य विभाग', 'PIO वर दंड आकारू शकतात', 'अंतिम अपील प्राधिकरण']
      },
      example: {
        en: 'For Railway RTI, second appeal goes to CIC. For state electricity board, second appeal goes to SIC.',
        hi: 'रेलवे RTI के लिए, दूसरी अपील CIC को जाती है। राज्य बिजली बोर्ड के लिए, दूसरी अपील SIC को जाती है।',
        mr: 'रेल्वे RTI साठी, दुसरी अपील CIC ला जाते. राज्य वीज मंडळासाठी, दुसरी अपील SIC ला जाते.'
      }
    },
    {
      id: 'rti5',
      title: { en: 'Section 4 - Suo Motu Disclosure', hi: 'धारा 4 - स्वतःप्रेरित प्रकटीकरण', mr: 'कलम 4 - स्वयंप्रेरित प्रकटीकरण' },
      content: { 
        en: 'Section 4 mandates proactive disclosure of information by government departments without RTI application. Includes budget, schemes, officers list.',
        hi: 'धारा 4 RTI आवेदन के बिना सरकारी विभागों द्वारा सूचना के सक्रिय प्रकटीकरण को अनिवार्य बनाती है। बजट, योजनाएं, अधिकारियों की सूची शामिल।',
        mr: 'कलम 4 RTI अर्जाशिवाय सरकारी विभागांद्वारे माहितीचे सक्रिय प्रकटीकरण अनिवार्य करते. अर्थसंकल्प, योजना, अधिकाऱ्यांची यादी समाविष्ट.'
      },
      keyPoints: {
        en: ['No RTI needed for Section 4 info', 'Available on department websites', 'Budget and expenditure', 'Decision making process'],
        hi: ['धारा 4 जानकारी के लिए RTI की जरूरत नहीं', 'विभाग की वेबसाइटों पर उपलब्ध', 'बजट और खर्च', 'निर्णय लेने की प्रक्रिया'],
        mr: ['कलम 4 माहितीसाठी RTI आवश्यक नाही', 'विभागाच्या वेबसाइटवर उपलब्ध', 'अर्थसंकल्प आणि खर्च', 'निर्णय प्रक्रिया']
      },
      example: {
        en: 'Check department website for basic information before filing RTI - many details are already published under Section 4.',
        hi: 'RTI दाखिल करने से पहले विभाग की वेबसाइट पर बुनियादी जानकारी देखें - कई विवरण धारा 4 के तहत पहले से प्रकाशित हैं।',
        mr: 'RTI दाखल करण्यापूर्वी विभागाच्या वेबसाइटवर मूलभूत माहिती तपासा - अनेक तपशील कलम 4 अंतर्गत आधीच प्रकाशित आहेत.'
      }
    },
    {
      id: 'rti6',
      title: { en: 'Exemptions Under Section 8', hi: 'धारा 8 के तहत छूट', mr: 'कलम 8 अंतर्गत सूट' },
      content: { 
        en: 'Some information is exempt: national security, cabinet papers, trade secrets, privacy. But public interest can override exemption.',
        hi: 'कुछ जानकारी छूट प्राप्त है: राष्ट्रीय सुरक्षा, कैबिनेट पेपर, व्यापार रहस्य, गोपनीयता। लेकिन सार्वजनिक हित छूट को ओवरराइड कर सकता है।',
        mr: 'काही माहिती सूट आहे: राष्ट्रीय सुरक्षा, कॅबिनेट पेपर, व्यापार रहस्य, गोपनीयता. पण सार्वजनिक हित सूट ओव्हरराइड करू शकते.'
      },
      keyPoints: {
        en: ['National security exempt', 'Cabinet papers protected', 'Trade secrets exempt', 'Public interest test applies'],
        hi: ['राष्ट्रीय सुरक्षा छूट', 'कैबिनेट पेपर संरक्षित', 'व्यापार रहस्य छूट', 'सार्वजनिक हित परीक्षण लागू'],
        mr: ['राष्ट्रीय सुरक्षा सूट', 'कॅबिनेट पेपर संरक्षित', 'व्यापार रहस्य सूट', 'सार्वजनिक हित चाचणी लागू']
      },
      example: {
        en: 'Information about corruption by officials can be disclosed even if it falls under exemptions, as public interest is greater.',
        hi: 'अधिकारियों द्वारा भ्रष्टाचार की जानकारी छूट के अंतर्गत आने पर भी प्रकट की जा सकती है, क्योंकि सार्वजनिक हित अधिक है।',
        mr: 'अधिकाऱ्यांच्या भ्रष्टाचाराची माहिती सूटमध्ये आली तरी प्रकट केली जाऊ शकते, कारण सार्वजनिक हित अधिक आहे.'
      }
    },
    {
      id: 'rti7',
      title: { en: 'Penalty on PIO for Delay', hi: 'विलंब पर PIO पर जुर्माना', mr: 'विलंबासाठी PIO वर दंड' },
      content: { 
        en: 'If PIO delays response without reason, penalty of Rs 250 per day (max Rs 25,000) can be imposed. Repeated delays can lead to disciplinary action.',
        hi: 'अगर PIO बिना कारण जवाब में देरी करता है, तो Rs 250 प्रति दिन (अधिकतम Rs 25,000) जुर्माना लगाया जा सकता है। बार-बार देरी से अनुशासनात्मक कार्रवाई हो सकती है।',
        mr: 'जर PIO ने कारणाशिवाय उत्तरात विलंब केला, तर Rs 250 प्रति दिन (जास्तीत जास्त Rs 25,000) दंड आकारला जाऊ शकतो. वारंवार विलंबाने शिस्तभंगाची कारवाई होऊ शकते.'
      },
      keyPoints: {
        en: ['Rs 250 per day penalty', 'Maximum Rs 25,000', 'CIC/SIC can impose penalty', 'Departmental action possible'],
        hi: ['Rs 250 प्रति दिन जुर्माना', 'अधिकतम Rs 25,000', 'CIC/SIC जुर्माना लगा सकते हैं', 'विभागीय कार्रवाई संभव'],
        mr: ['Rs 250 प्रति दिन दंड', 'जास्तीत जास्त Rs 25,000', 'CIC/SIC दंड आकारू शकतात', 'विभागीय कारवाई शक्य']
      },
      example: {
        en: 'If PIO gave false reason for denial, Information Commission can impose full Rs 25,000 penalty.',
        hi: 'अगर PIO ने इनकार के लिए झूठा कारण दिया, तो सूचना आयोग पूर्ण Rs 25,000 जुर्माना लगा सकता है।',
        mr: 'जर PIO ने नकारण्यासाठी खोटे कारण दिले, तर माहिती आयोग पूर्ण Rs 25,000 दंड आकारू शकतो.'
      }
    },
    {
      id: 'rti8',
      title: { en: 'Third Party Information', hi: 'तृतीय पक्ष सूचना', mr: 'तृतीय पक्ष माहिती' },
      content: { 
        en: 'If RTI involves third party (private person/company), PIO must give 5 days notice to third party. Third party can object within 10 days.',
        hi: 'अगर RTI में तृतीय पक्ष (निजी व्यक्ति/कंपनी) शामिल है, तो PIO को तृतीय पक्ष को 5 दिन का नोटिस देना होगा। तृतीय पक्ष 10 दिनों में आपत्ति कर सकता है।',
        mr: 'जर RTI मध्ये तृतीय पक्ष (खाजगी व्यक्ती/कंपनी) समाविष्ट असेल, तर PIO ने तृतीय पक्षाला 5 दिवसांची नोटीस देणे आवश्यक. तृतीय पक्ष 10 दिवसांत आक्षेप घेऊ शकतो.'
      },
      keyPoints: {
        en: ['5 days notice to third party', '10 days to object', 'Decision within 40 days', 'Third party can appeal'],
        hi: ['तृतीय पक्ष को 5 दिन का नोटिस', 'आपत्ति के लिए 10 दिन', '40 दिनों में निर्णय', 'तृतीय पक्ष अपील कर सकता है'],
        mr: ['तृतीय पक्षाला 5 दिवसांची नोटीस', 'आक्षेपासाठी 10 दिवस', '40 दिवसांत निर्णय', 'तृतीय पक्ष अपील करू शकतो']
      },
      example: {
        en: 'If you seek contract details of a private company with government, the company will be given chance to object.',
        hi: 'अगर आप सरकार के साथ किसी निजी कंपनी के अनुबंध विवरण मांगते हैं, तो कंपनी को आपत्ति का मौका दिया जाएगा।',
        mr: 'जर तुम्ही सरकारसोबतच्या खाजगी कंपनीचे करार तपशील मागत असाल, तर कंपनीला आक्षेप घेण्याची संधी दिली जाईल.'
      }
    }
  ],
  cyber_rights: [
    {
      id: 'cyber1',
      title: { en: 'IT Act 2000 - Protection from Cyber Crime', hi: 'IT अधिनियम 2000 - साइबर अपराध से सुरक्षा', mr: 'IT कायदा 2000 - सायबर गुन्ह्यापासून संरक्षण' },
      content: { 
        en: 'Information Technology Act 2000 protects against hacking, identity theft, online fraud, and cyber stalking. Report crimes at cybercrime.gov.in.',
        hi: 'सूचना प्रौद्योगिकी अधिनियम 2000 हैकिंग, पहचान की चोरी, ऑनलाइन धोखाधड़ी और साइबर स्टॉकिंग से सुरक्षा प्रदान करता है। cybercrime.gov.in पर अपराध रिपोर्ट करें।',
        mr: 'माहिती तंत्रज्ञान कायदा 2000 हॅकिंग, ओळख चोरी, ऑनलाइन फसवणूक आणि सायबर स्टॉकिंगपासून संरक्षण देतो. cybercrime.gov.in वर गुन्हे तक्रार करा.'
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
        en: 'Report fraud within 3 days to bank for zero liability. RBI guidelines protect your money. After 3 days, limited liability applies.',
        hi: 'शून्य देयता के लिए 3 दिनों के भीतर बैंक को धोखाधड़ी की रिपोर्ट करें। RBI दिशानिर्देश आपके पैसे की रक्षा करते हैं। 3 दिन बाद, सीमित देयता लागू।',
        mr: 'शून्य दायित्वासाठी 3 दिवसांच्या आत बँकेला फसवणुकीची तक्रार करा. RBI मार्गदर्शक तत्त्वे तुमच्या पैशांचे संरक्षण करतात. 3 दिवसांनंतर, मर्यादित दायित्व लागू.'
      },
      keyPoints: {
        en: ['Report within 3 days = zero liability', '4-7 days = Rs 10,000-25,000 liability', 'Block card immediately', 'Call 1930 helpline'],
        hi: ['3 दिनों में रिपोर्ट = शून्य देयता', '4-7 दिन = Rs 10,000-25,000 देयता', 'कार्ड तुरंत ब्लॉक करें', '1930 हेल्पलाइन पर कॉल करें'],
        mr: ['3 दिवसांत तक्रार = शून्य दायित्व', '4-7 दिवस = Rs 10,000-25,000 दायित्व', 'कार्ड तात्काळ ब्लॉक करा', '1930 हेल्पलाइनवर कॉल करा']
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
        en: 'You have the right to know how your data is used. Companies must get consent before collecting personal data. Digital Personal Data Protection Act 2023 provides framework.',
        hi: 'आपको यह जानने का अधिकार है कि आपका डेटा कैसे उपयोग होता है। कंपनियों को व्यक्तिगत डेटा एकत्र करने से पहले सहमति लेनी होगी। डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 ढांचा प्रदान करता है।',
        mr: 'तुमचा डेटा कसा वापरला जातो हे जाणून घेण्याचा तुम्हाला अधिकार आहे. कंपन्यांना वैयक्तिक डेटा गोळा करण्यापूर्वी संमती घेणे आवश्यक आहे. डिजिटल वैयक्तिक डेटा संरक्षण कायदा 2023 आराखडा प्रदान करतो.'
      },
      keyPoints: {
        en: ['Consent required for data collection', 'Right to data deletion', 'DPDP Act 2023 framework', 'Data breach notification mandatory'],
        hi: ['डेटा संग्रह के लिए सहमति आवश्यक', 'डेटा हटाने का अधिकार', 'DPDP अधिनियम 2023 ढांचा', 'डेटा उल्लंघन सूचना अनिवार्य'],
        mr: ['डेटा संकलनासाठी संमती आवश्यक', 'डेटा हटवण्याचा अधिकार', 'DPDP कायदा 2023 आराखडा', 'डेटा उल्लंघन सूचना अनिवार्य']
      },
      example: {
        en: 'You can request any app to delete your personal data and they must comply within reasonable time.',
        hi: 'आप किसी भी ऐप से अपना व्यक्तिगत डेटा हटाने का अनुरोध कर सकते हैं और उन्हें उचित समय में पालन करना होगा।',
        mr: 'तुम्ही कोणत्याही ॲपला तुमचा वैयक्तिक डेटा हटवण्याची विनंती करू शकता आणि त्यांना वाजवी वेळेत पालन करणे आवश्यक आहे.'
      }
    },
    {
      id: 'cyber4',
      title: { en: 'Common Cyber Crimes - Phishing, Ransomware', hi: 'आम साइबर अपराध - फिशिंग, रैंसमवेयर', mr: 'सामान्य सायबर गुन्हे - फिशिंग, रॅन्समवेअर' },
      content: { 
        en: 'Phishing = fake emails/websites to steal credentials. Ransomware = malware that locks data for ransom. Never click unknown links or download attachments from strangers.',
        hi: 'फिशिंग = क्रेडेंशियल चुराने के लिए नकली ईमेल/वेबसाइट। रैंसमवेयर = फिरौती के लिए डेटा लॉक करने वाला मैलवेयर। अज्ञात लिंक पर क्लिक न करें या अजनबियों से अटैचमेंट डाउनलोड न करें।',
        mr: 'फिशिंग = क्रेडेन्शियल चोरण्यासाठी बनावट ईमेल/वेबसाइट. रॅन्समवेअर = खंडणीसाठी डेटा लॉक करणारा मालवेअर. अज्ञात लिंकवर क्लिक करू नका किंवा अनोळखी लोकांकडून अटॅचमेंट डाउनलोड करू नका.'
      },
      keyPoints: {
        en: ['Phishing = credential theft', 'Ransomware = data locked for money', 'Never share OTP', 'Verify before clicking links'],
        hi: ['फिशिंग = क्रेडेंशियल चोरी', 'रैंसमवेयर = पैसे के लिए डेटा लॉक', 'OTP कभी साझा न करें', 'लिंक क्लिक करने से पहले सत्यापित करें'],
        mr: ['फिशिंग = क्रेडेन्शियल चोरी', 'रॅन्समवेअर = पैशांसाठी डेटा लॉक', 'OTP कधीही शेअर करू नका', 'लिंकवर क्लिक करण्यापूर्वी सत्यापित करा']
      },
      example: {
        en: 'Bank will never ask for OTP or password via call/SMS. Any such request is phishing attempt.',
        hi: 'बैंक कभी कॉल/SMS के माध्यम से OTP या पासवर्ड नहीं मांगेगा। ऐसा कोई भी अनुरोध फिशिंग प्रयास है।',
        mr: 'बँक कधीही कॉल/SMS द्वारे OTP किंवा पासवर्ड मागणार नाही. अशी कोणतीही विनंती फिशिंग प्रयत्न आहे.'
      }
    },
    {
      id: 'cyber5',
      title: { en: 'IT Act Sections 66, 67, 67A', hi: 'IT अधिनियम धारा 66, 67, 67A', mr: 'IT कायदा कलम 66, 67, 67A' },
      content: { 
        en: 'Section 66 = Computer related offenses (hacking). Section 67 = Publishing obscene content. Section 67A = Sexually explicit content. Punishable with imprisonment and fine.',
        hi: 'धारा 66 = कंप्यूटर संबंधित अपराध (हैकिंग)। धारा 67 = अश्लील सामग्री प्रकाशित करना। धारा 67A = यौन स्पष्ट सामग्री। कारावास और जुर्माने से दंडनीय।',
        mr: 'कलम 66 = संगणक संबंधित गुन्हे (हॅकिंग). कलम 67 = अश्लील सामग्री प्रकाशित करणे. कलम 67A = लैंगिक स्पष्ट सामग्री. कारावास आणि दंडाने दंडनीय.'
      },
      keyPoints: {
        en: ['Section 66 = Hacking (3 years)', 'Section 67 = Obscene content (5 years)', 'Section 67A = Sexual content (7 years)', 'Section 66E = Voyeurism'],
        hi: ['धारा 66 = हैकिंग (3 साल)', 'धारा 67 = अश्लील सामग्री (5 साल)', 'धारा 67A = यौन सामग्री (7 साल)', 'धारा 66E = दृश्यरतिकता'],
        mr: ['कलम 66 = हॅकिंग (3 वर्षे)', 'कलम 67 = अश्लील सामग्री (5 वर्षे)', 'कलम 67A = लैंगिक सामग्री (7 वर्षे)', 'कलम 66E = दृश्यरतिकता']
      },
      example: {
        en: 'Sharing someone private photos without consent is punishable under Section 67A with 7 years imprisonment.',
        hi: 'किसी की निजी तस्वीरें बिना सहमति के साझा करना धारा 67A के तहत 7 साल की कैद से दंडनीय है।',
        mr: 'कोणाचे खाजगी फोटो संमतीशिवाय शेअर करणे कलम 67A अंतर्गत 7 वर्षांच्या कारावासाने दंडनीय आहे.'
      }
    },
    {
      id: 'cyber6',
      title: { en: 'CERT-In & Cyber Security Reporting', hi: 'CERT-In और साइबर सुरक्षा रिपोर्टिंग', mr: 'CERT-In आणि सायबर सुरक्षा तक्रार' },
      content: { 
        en: 'CERT-In (Computer Emergency Response Team India) is national agency for cyber security incidents. Report security incidents, malware, and vulnerabilities.',
        hi: 'CERT-In (कंप्यूटर इमरजेंसी रिस्पांस टीम इंडिया) साइबर सुरक्षा घटनाओं के लिए राष्ट्रीय एजेंसी है। सुरक्षा घटनाओं, मैलवेयर और कमजोरियों की रिपोर्ट करें।',
        mr: 'CERT-In (कॉम्प्युटर इमर्जन्सी रिस्पॉन्स टीम इंडिया) सायबर सुरक्षा घटनांसाठी राष्ट्रीय एजन्सी आहे. सुरक्षा घटना, मालवेअर आणि असुरक्षिततांची तक्रार करा.'
      },
      keyPoints: {
        en: ['CERT-In = National cyber security agency', 'Report at cert-in.org.in', 'Mandatory incident reporting for companies', 'Free security guidelines'],
        hi: ['CERT-In = राष्ट्रीय साइबर सुरक्षा एजेंसी', 'cert-in.org.in पर रिपोर्ट करें', 'कंपनियों के लिए अनिवार्य घटना रिपोर्टिंग', 'मुफ्त सुरक्षा दिशानिर्देश'],
        mr: ['CERT-In = राष्ट्रीय सायबर सुरक्षा एजन्सी', 'cert-in.org.in वर तक्रार करा', 'कंपन्यांसाठी अनिवार्य घटना तक्रार', 'मोफत सुरक्षा मार्गदर्शक तत्त्वे']
      },
      example: {
        en: 'If you discover a security vulnerability in any government website, report to CERT-In for responsible disclosure.',
        hi: 'अगर आप किसी सरकारी वेबसाइट में सुरक्षा कमजोरी पाते हैं, तो जिम्मेदार प्रकटीकरण के लिए CERT-In को रिपोर्ट करें।',
        mr: 'जर तुम्हाला कोणत्याही सरकारी वेबसाइटमध्ये सुरक्षा असुरक्षितता आढळली, तर जबाबदार प्रकटीकरणासाठी CERT-In ला तक्रार करा.'
      }
    },
    {
      id: 'cyber7',
      title: { en: 'Digital Signatures & Two-Factor Authentication', hi: 'डिजिटल हस्ताक्षर और टू-फैक्टर प्रमाणीकरण', mr: 'डिजिटल स्वाक्षरी आणि टू-फॅक्टर ऑथेंटिकेशन' },
      content: { 
        en: 'Digital signatures are legally valid under IT Act. Always enable 2FA (Two Factor Authentication) for banking, email, and social media accounts.',
        hi: 'IT अधिनियम के तहत डिजिटल हस्ताक्षर कानूनी रूप से वैध हैं। बैंकिंग, ईमेल और सोशल मीडिया खातों के लिए हमेशा 2FA (टू फैक्टर ऑथेंटिकेशन) सक्षम करें।',
        mr: 'IT कायद्यानुसार डिजिटल स्वाक्षरी कायदेशीररित्या वैध आहेत. बँकिंग, ईमेल आणि सोशल मीडिया खात्यांसाठी नेहमी 2FA (टू फॅक्टर ऑथेंटिकेशन) सक्षम करा.'
      },
      keyPoints: {
        en: ['Digital signature = legally valid', 'Enable 2FA everywhere', 'Use authenticator apps', 'Avoid SMS OTP if possible'],
        hi: ['डिजिटल हस्ताक्षर = कानूनी रूप से वैध', 'हर जगह 2FA सक्षम करें', 'ऑथेंटिकेटर ऐप्स का उपयोग करें', 'यदि संभव हो तो SMS OTP से बचें'],
        mr: ['डिजिटल स्वाक्षरी = कायदेशीररित्या वैध', 'सर्वत्र 2FA सक्षम करा', 'ऑथेंटिकेटर ॲप्स वापरा', 'शक्य असल्यास SMS OTP टाळा']
      },
      example: {
        en: 'Enable Google Authenticator or similar app for your email and bank accounts for better security than SMS OTP.',
        hi: 'SMS OTP से बेहतर सुरक्षा के लिए अपने ईमेल और बैंक खातों के लिए Google Authenticator या समान ऐप सक्षम करें।',
        mr: 'SMS OTP पेक्षा चांगल्या सुरक्षिततेसाठी तुमच्या ईमेल आणि बँक खात्यांसाठी Google Authenticator किंवा तत्सम ॲप सक्षम करा.'
      }
    },
    {
      id: 'cyber8',
      title: { en: 'Social Engineering & Safe Online Practices', hi: 'सोशल इंजीनियरिंग और सुरक्षित ऑनलाइन प्रथाएं', mr: 'सोशल इंजिनिअरिंग आणि सुरक्षित ऑनलाइन पद्धती' },
      content: { 
        en: 'Social engineering = manipulating people to reveal confidential info. Never share OTP, password, or bank details over phone/message even if caller claims to be from bank.',
        hi: 'सोशल इंजीनियरिंग = गोपनीय जानकारी प्रकट करने के लिए लोगों को हेरफेर करना। कॉलर बैंक से होने का दावा करे तो भी फोन/मैसेज पर OTP, पासवर्ड या बैंक विवरण कभी साझा न करें।',
        mr: 'सोशल इंजिनिअरिंग = गोपनीय माहिती उघड करण्यासाठी लोकांना फसवणे. कॉलर बँकेचा असल्याचा दावा करत असला तरी फोन/मेसेजवर OTP, पासवर्ड किंवा बँक तपशील कधीही शेअर करू नका.'
      },
      keyPoints: {
        en: ['Never share OTP with anyone', 'Bank never asks for password', 'Verify caller independently', 'Use strong unique passwords'],
        hi: ['किसी के साथ OTP साझा न करें', 'बैंक कभी पासवर्ड नहीं मांगता', 'कॉलर को स्वतंत्र रूप से सत्यापित करें', 'मजबूत अद्वितीय पासवर्ड का उपयोग करें'],
        mr: ['कोणासोबतही OTP शेअर करू नका', 'बँक कधीही पासवर्ड मागत नाही', 'कॉलर स्वतंत्रपणे सत्यापित करा', 'मजबूत अद्वितीय पासवर्ड वापरा']
      },
      example: {
        en: 'If someone calls claiming KYC update needed, disconnect and call bank official number to verify.',
        hi: 'अगर कोई KYC अपडेट की जरूरत बताते हुए कॉल करे, तो कॉल काटें और सत्यापित करने के लिए बैंक के आधिकारिक नंबर पर कॉल करें।',
        mr: 'जर कोणी KYC अपडेट आवश्यक असल्याचे सांगून कॉल केला, तर कॉल डिस्कनेक्ट करा आणि सत्यापित करण्यासाठी बँकेच्या अधिकृत नंबरवर कॉल करा.'
      }
    }
  ],
  tenant_rights: [
    {
      id: 'tenant1',
      title: { en: 'Rent Agreement - Written & Registered', hi: 'किराया समझौता - लिखित और पंजीकृत', mr: 'भाडे करार - लिखित आणि नोंदणीकृत' },
      content: { 
        en: 'Always get a written rent agreement. If tenure exceeds 11 months, registration is mandatory. Landlord cannot evict without proper notice and legal procedure.',
        hi: 'हमेशा लिखित किराया समझौता करें। अगर अवधि 11 महीने से अधिक है, तो पंजीकरण अनिवार्य है। मकान मालिक उचित नोटिस और कानूनी प्रक्रिया के बिना बेदखल नहीं कर सकता।',
        mr: 'नेहमी लिखित भाडे करार करा. कालावधी 11 महिन्यांपेक्षा जास्त असल्यास, नोंदणी अनिवार्य आहे. मालक योग्य नोटीस आणि कायदेशीर प्रक्रियेशिवाय बेदखल करू शकत नाही.'
      },
      keyPoints: {
        en: ['Written agreement essential', 'Register if over 11 months', 'Keep rent receipts', 'Notice period required for eviction'],
        hi: ['लिखित समझौता आवश्यक', '11 महीने से अधिक हो तो पंजीकृत करें', 'किराया रसीद रखें', 'बेदखली के लिए नोटिस अवधि आवश्यक'],
        mr: ['लिखित करार आवश्यक', '11 महिन्यांपेक्षा जास्त असल्यास नोंदणी करा', 'भाडे पावत्या ठेवा', 'बेदखलीसाठी नोटीस कालावधी आवश्यक']
      },
      example: {
        en: 'If landlord asks to vacate without notice, you can file complaint with rent controller or civil court.',
        hi: 'अगर मकान मालिक बिना नोटिस के खाली करने को कहे, तो आप किराया नियंत्रक या दीवानी अदालत में शिकायत दर्ज कर सकते हैं।',
        mr: 'जर मालकाने नोटीसशिवाय खाली करण्यास सांगितले, तर तुम्ही भाडे नियंत्रक किंवा दिवाणी न्यायालयात तक्रार दाखल करू शकता.'
      }
    },
    {
      id: 'tenant2',
      title: { en: 'Security Deposit Rules', hi: 'सुरक्षा जमा नियम', mr: 'सुरक्षा ठेव नियम' },
      content: { 
        en: 'Security deposit should be reasonable (typically 2-3 months rent). Must be returned when vacating. Deductions only for actual damages, not normal wear and tear.',
        hi: 'सुरक्षा जमा उचित होनी चाहिए (आमतौर पर 2-3 महीने का किराया)। खाली करते समय वापस मिलनी चाहिए। कटौती केवल वास्तविक नुकसान के लिए, सामान्य टूट-फूट के लिए नहीं।',
        mr: 'सुरक्षा ठेव वाजवी असावी (सामान्यतः 2-3 महिन्यांचे भाडे). खाली करताना परत मिळायला हवी. कपात फक्त वास्तविक नुकसानीसाठी, सामान्य झीजसाठी नाही.'
      },
      keyPoints: {
        en: ['Reasonable deposit amount', 'Refund when vacating', 'Fair deduction only', 'Take photos at entry/exit'],
        hi: ['उचित जमा राशि', 'खाली करते समय वापसी', 'उचित कटौती ही', 'प्रवेश/निकास पर फोटो लें'],
        mr: ['वाजवी ठेव रक्कम', 'खाली करताना परतावा', 'योग्य कपात फक्त', 'प्रवेश/बाहेर पडताना फोटो घ्या']
      },
      example: {
        en: 'Take photos of flat condition while moving in and out to prove no damage was done.',
        hi: 'जाते और आते समय फ्लैट की स्थिति के फोटो लें ताकि साबित हो कि कोई नुकसान नहीं हुआ।',
        mr: 'प्रवेश आणि बाहेर पडताना फ्लॅटच्या स्थितीचे फोटो घ्या जेणेकरून कोणतेही नुकसान झाले नाही हे सिद्ध करता येईल.'
      }
    },
    {
      id: 'tenant3',
      title: { en: 'Maintenance & Repairs Responsibility', hi: 'रखरखाव और मरम्मत की जिम्मेदारी', mr: 'देखभाल आणि दुरुस्तीची जबाबदारी' },
      content: { 
        en: 'Major structural repairs are landlord responsibility. Tenant responsible for minor repairs from daily use. Get major repairs done in writing.',
        hi: 'बड़ी संरचनात्मक मरम्मत मकान मालिक की जिम्मेदारी है। किरायेदार दैनिक उपयोग से छोटी मरम्मत के लिए जिम्मेदार है। बड़ी मरम्मत लिखित में करवाएं।',
        mr: 'मोठ्या संरचनात्मक दुरुस्त्या मालकाची जबाबदारी आहे. दैनंदिन वापरातील लहान दुरुस्त्या भाडेकरूची जबाबदारी आहे. मोठ्या दुरुस्त्या लिखित स्वरूपात करवून घ्या.'
      },
      keyPoints: {
        en: ['Structural repairs = Landlord', 'Plumbing/electrical major = Landlord', 'Minor wear = Tenant', 'Document repair requests'],
        hi: ['संरचनात्मक मरम्मत = मालिक', 'प्लंबिंग/बिजली बड़ी = मालिक', 'मामूली टूट-फूट = किरायेदार', 'मरम्मत अनुरोध दस्तावेज करें'],
        mr: ['संरचनात्मक दुरुस्ती = मालक', 'प्लंबिंग/इलेक्ट्रिकल मोठी = मालक', 'किरकोळ झीज = भाडेकरू', 'दुरुस्ती विनंती दस्तऐवजीकरण करा']
      },
      example: {
        en: 'If roof leaks, landlord must repair. If bulb fuses, tenant should replace.',
        hi: 'अगर छत से पानी टपके, तो मकान मालिक को मरम्मत करनी होगी। अगर बल्ब फ्यूज हो, तो किरायेदार बदले।',
        mr: 'जर छत गळत असेल, तर मालकाने दुरुस्ती करणे आवश्यक आहे. जर बल्ब फ्यूज झाला, तर भाडेकरूने बदलावा.'
      }
    },
    {
      id: 'tenant4',
      title: { en: 'Model Tenancy Act 2021', hi: 'मॉडल किरायेदारी अधिनियम 2021', mr: 'मॉडेल भाडेकरार कायदा 2021' },
      content: { 
        en: 'Model Tenancy Act 2021 is a framework for states. Key features: Rent Authority, fast dispute resolution, capped security deposit at 2 months rent.',
        hi: 'मॉडल किरायेदारी अधिनियम 2021 राज्यों के लिए एक ढांचा है। मुख्य विशेषताएं: किराया प्राधिकरण, तेज विवाद समाधान, सुरक्षा जमा 2 महीने के किराये पर सीमित।',
        mr: 'मॉडेल भाडेकरार कायदा 2021 राज्यांसाठी एक आराखडा आहे. मुख्य वैशिष्ट्ये: भाडे प्राधिकरण, जलद वाद निराकरण, सुरक्षा ठेव 2 महिन्यांच्या भाड्यापर्यंत मर्यादित.'
      },
      keyPoints: {
        en: ['Security deposit max 2 months', 'Rent Authority for disputes', 'Written agreement mandatory', 'Digital registration'],
        hi: ['सुरक्षा जमा अधिकतम 2 महीने', 'विवादों के लिए किराया प्राधिकरण', 'लिखित समझौता अनिवार्य', 'डिजिटल पंजीकरण'],
        mr: ['सुरक्षा ठेव जास्तीत जास्त 2 महिने', 'वादांसाठी भाडे प्राधिकरण', 'लिखित करार अनिवार्य', 'डिजिटल नोंदणी']
      },
      example: {
        en: 'Under Model Act, landlord cannot demand more than 2 months rent as security deposit for residential property.',
        hi: 'मॉडल अधिनियम के तहत, मकान मालिक आवासीय संपत्ति के लिए 2 महीने के किराये से अधिक सुरक्षा जमा की मांग नहीं कर सकता।',
        mr: 'मॉडेल कायद्यानुसार, मालक निवासी मालमत्तेसाठी 2 महिन्यांपेक्षा जास्त भाड्याची सुरक्षा ठेव मागू शकत नाही.'
      }
    },
    {
      id: 'tenant5',
      title: { en: 'Lock-in Period & Notice Period', hi: 'लॉक-इन अवधि और नोटिस अवधि', mr: 'लॉक-इन कालावधी आणि नोटीस कालावधी' },
      content: { 
        en: 'Lock-in period means neither party can terminate during that time. Notice period (usually 1-2 months) required before vacating after lock-in.',
        hi: 'लॉक-इन अवधि का मतलब है कि उस समय दोनों में से कोई भी पक्ष समाप्त नहीं कर सकता। लॉक-इन के बाद खाली करने से पहले नोटिस अवधि (आमतौर पर 1-2 महीने) आवश्यक।',
        mr: 'लॉक-इन कालावधी म्हणजे त्या काळात कोणताही पक्ष समाप्त करू शकत नाही. लॉक-इन नंतर खाली करण्यापूर्वी नोटीस कालावधी (सामान्यतः 1-2 महिने) आवश्यक.'
      },
      keyPoints: {
        en: ['Lock-in = Cannot leave during period', 'Check notice period in agreement', 'Written notice required', 'Rent payable during notice'],
        hi: ['लॉक-इन = अवधि के दौरान नहीं छोड़ सकते', 'समझौते में नोटिस अवधि जांचें', 'लिखित नोटिस आवश्यक', 'नोटिस के दौरान किराया देय'],
        mr: ['लॉक-इन = कालावधीत सोडता येत नाही', 'करारात नोटीस कालावधी तपासा', 'लिखित नोटीस आवश्यक', 'नोटीस दरम्यान भाडे देय']
      },
      example: {
        en: 'If agreement has 6 months lock-in and 1 month notice, you can vacate after 7 months with proper notice.',
        hi: 'अगर समझौते में 6 महीने का लॉक-इन और 1 महीने का नोटिस है, तो आप उचित नोटिस के साथ 7 महीने बाद खाली कर सकते हैं।',
        mr: 'जर करारात 6 महिन्यांचा लॉक-इन आणि 1 महिन्याची नोटीस असेल, तर तुम्ही योग्य नोटीसनंतर 7 महिन्यांनी खाली करू शकता.'
      }
    },
    {
      id: 'tenant6',
      title: { en: 'Police Verification & e-Stamping', hi: 'पुलिस सत्यापन और ई-स्टांपिंग', mr: 'पोलीस पडताळणी आणि ई-स्टॅम्पिंग' },
      content: { 
        en: 'Police verification of tenant is mandatory in many states. Rent agreement should be on stamp paper (e-stamp valid). Keep copies safe.',
        hi: 'कई राज्यों में किरायेदार का पुलिस सत्यापन अनिवार्य है। किराया समझौता स्टांप पेपर पर होना चाहिए (ई-स्टांप वैध)। प्रतियां सुरक्षित रखें।',
        mr: 'अनेक राज्यांमध्ये भाडेकरूची पोलीस पडताळणी अनिवार्य आहे. भाडे करार स्टॅम्प पेपरवर असावा (ई-स्टॅम्प वैध). प्रती सुरक्षित ठेवा.'
      },
      keyPoints: {
        en: ['Police verification mandatory', 'e-Stamp paper valid', 'Online verification available', 'Keep original and copies'],
        hi: ['पुलिस सत्यापन अनिवार्य', 'ई-स्टांप पेपर वैध', 'ऑनलाइन सत्यापन उपलब्ध', 'मूल और प्रतियां रखें'],
        mr: ['पोलीस पडताळणी अनिवार्य', 'ई-स्टॅम्प पेपर वैध', 'ऑनलाइन पडताळणी उपलब्ध', 'मूळ आणि प्रती ठेवा']
      },
      example: {
        en: 'In Maharashtra, tenant verification can be done online at citizen.mahapolice.gov.in.',
        hi: 'महाराष्ट्र में, किरायेदार सत्यापन citizen.mahapolice.gov.in पर ऑनलाइन किया जा सकता है।',
        mr: 'महाराष्ट्रात, भाडेकरू पडताळणी citizen.mahapolice.gov.in वर ऑनलाइन करता येते.'
      }
    },
    {
      id: 'tenant7',
      title: { en: 'Rent Receipt & Tax Benefits', hi: 'किराया रसीद और कर लाभ', mr: 'भाडे पावती आणि कर लाभ' },
      content: { 
        en: 'Always collect rent receipts with landlord signature and PAN (for rent above Rs 1 lakh/year). HRA exemption requires rent receipts as proof.',
        hi: 'हमेशा मकान मालिक के हस्ताक्षर और PAN (Rs 1 लाख/वर्ष से अधिक किराये के लिए) के साथ किराया रसीद लें। HRA छूट के लिए किराया रसीद प्रमाण के रूप में आवश्यक।',
        mr: 'नेहमी मालकाची स्वाक्षरी आणि PAN (Rs 1 लाख/वर्षापेक्षा जास्त भाड्यासाठी) सह भाडे पावती घ्या. HRA सूटसाठी भाडे पावती पुरावा म्हणून आवश्यक.'
      },
      keyPoints: {
        en: ['Collect receipts monthly', 'Landlord PAN if rent > Rs 1 lakh/year', 'HRA exemption proof', 'Revenue stamp on receipts'],
        hi: ['मासिक रसीद लें', 'किराया > Rs 1 लाख/वर्ष हो तो मकान मालिक का PAN', 'HRA छूट प्रमाण', 'रसीदों पर राजस्व स्टांप'],
        mr: ['मासिक पावत्या घ्या', 'भाडे > Rs 1 लाख/वर्ष असल्यास मालकाचा PAN', 'HRA सूट पुरावा', 'पावत्यांवर महसूल स्टॅम्प']
      },
      example: {
        en: 'For claiming HRA exemption, submit rent receipts with landlord PAN to your employer.',
        hi: 'HRA छूट का दावा करने के लिए, अपने नियोक्ता को मकान मालिक के PAN के साथ किराया रसीद जमा करें।',
        mr: 'HRA सूटचा दावा करण्यासाठी, तुमच्या नियोक्त्याला मालकाच्या PAN सह भाडे पावत्या सबमिट करा.'
      }
    },
    {
      id: 'tenant8',
      title: { en: 'Eviction - Legal Process', hi: 'बेदखली - कानूनी प्रक्रिया', mr: 'बेदखली - कायदेशीर प्रक्रिया' },
      content: { 
        en: 'Landlord cannot forcefully evict. Must follow legal process through Rent Controller or Civil Court. Grounds for eviction: non-payment, misuse, personal need.',
        hi: 'मकान मालिक जबरदस्ती बेदखल नहीं कर सकता। किराया नियंत्रक या दीवानी अदालत के माध्यम से कानूनी प्रक्रिया का पालन करना होगा। बेदखली के आधार: गैर-भुगतान, दुरुपयोग, व्यक्तिगत आवश्यकता।',
        mr: 'मालक जबरदस्तीने बेदखल करू शकत नाही. भाडे नियंत्रक किंवा दिवाणी न्यायालयाद्वारे कायदेशीर प्रक्रियेचे पालन करणे आवश्यक. बेदखलीचे कारण: न भरणे, गैरवापर, वैयक्तिक गरज.'
      },
      keyPoints: {
        en: ['No forceful eviction', 'Court order required', 'Valid grounds needed', 'Appeal options available'],
        hi: ['जबरन बेदखली नहीं', 'अदालत का आदेश आवश्यक', 'वैध आधार आवश्यक', 'अपील विकल्प उपलब्ध'],
        mr: ['जबरदस्ती बेदखली नाही', 'न्यायालयाचा आदेश आवश्यक', 'वैध कारणे आवश्यक', 'अपील पर्याय उपलब्ध']
      },
      example: {
        en: 'If landlord cuts water/electricity to force eviction, file complaint with police and Rent Controller.',
        hi: 'अगर मकान मालिक जबरन बेदखली के लिए पानी/बिजली काट दे, तो पुलिस और किराया नियंत्रक के पास शिकायत करें।',
        mr: 'जर मालकाने जबरदस्ती बेदखलीसाठी पाणी/वीज बंद केली, तर पोलीस आणि भाडे नियंत्रकाकडे तक्रार दाखल करा.'
      }
    }
  ],
  senior_citizen_rights: [
    {
      id: 'sc1',
      title: { en: 'Maintenance by Children (Tribunal)', hi: 'बच्चों द्वारा भरण-पोषण (न्यायाधिकरण)', mr: 'मुलांकडून पोषण (न्यायाधिकरण)' },
      content: { 
        en: 'Under Maintenance and Welfare of Parents and Senior Citizens Act 2007, children and relatives must provide maintenance. Tribunal can order up to Rs 10,000/month.',
        hi: 'माता-पिता और वरिष्ठ नागरिकों के भरण-पोषण और कल्याण अधिनियम 2007 के तहत बच्चों और रिश्तेदारों को भरण-पोषण करना होगा। न्यायाधिकरण Rs 10,000/माह तक का आदेश दे सकता है।',
        mr: 'पालक आणि ज्येष्ठ नागरिक पोषण आणि कल्याण कायदा 2007 अंतर्गत मुले आणि नातेवाईकांनी पोषण करणे आवश्यक. न्यायाधिकरण Rs 10,000/महिना पर्यंत आदेश देऊ शकते.'
      },
      keyPoints: {
        en: ['Children must maintain parents', 'Tribunal at district level', 'Up to Rs 10,000/month', 'Decision within 90 days'],
        hi: ['बच्चों को माता-पिता का भरण-पोषण करना होगा', 'जिला स्तर पर न्यायाधिकरण', 'Rs 10,000/माह तक', '90 दिनों में निर्णय'],
        mr: ['मुलांनी पालकांचे पोषण करणे आवश्यक', 'जिल्हा स्तरावर न्यायाधिकरण', 'Rs 10,000/महिना पर्यंत', '90 दिवसांत निर्णय']
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
        en: 'Property transferred to children can be taken back if they fail to provide maintenance. Will can be changed anytime before death.',
        hi: 'बच्चों को हस्तांतरित संपत्ति वापस ली जा सकती है अगर वे भरण-पोषण करने में विफल रहते हैं। वसीयत मृत्यु से पहले कभी भी बदली जा सकती है।',
        mr: 'मुलांना हस्तांतरित केलेली मालमत्ता परत घेता येते जर त्यांनी पोषण करण्यात अयशस्वी झाले. मृत्यूपत्र मृत्यूपूर्वी कधीही बदलता येते.'
      },
      keyPoints: {
        en: ['Transfer can be cancelled', 'Will changeable anytime', 'Right to live in own property', 'Protection from eviction by children'],
        hi: ['हस्तांतरण रद्द हो सकता है', 'वसीयत कभी भी बदली जा सकती है', 'अपनी संपत्ति में रहने का अधिकार', 'बच्चों द्वारा बेदखली से सुरक्षा'],
        mr: ['हस्तांतरण रद्द होऊ शकते', 'मृत्युपत्र कधीही बदलता येते', 'स्वतःच्या मालमत्तेत राहण्याचा अधिकार', 'मुलांकडून बेदखलीपासून संरक्षण']
      },
      example: {
        en: 'If you transferred property to son who now neglects you, court can cancel the transfer deed.',
        hi: 'अगर आपने संपत्ति बेटे को हस्तांतरित की जो अब आपकी उपेक्षा करता है, तो अदालत हस्तांतरण विलेख रद्द कर सकती है।',
        mr: 'जर तुम्ही मुलाला मालमत्ता हस्तांतरित केली जो आता तुमची उपेक्षा करतो, तर न्यायालय हस्तांतरण दस्तऐवज रद्द करू शकते.'
      }
    },
    {
      id: 'sc3',
      title: { en: 'Tax Benefits for Senior Citizens', hi: 'वरिष्ठ नागरिकों के लिए कर लाभ', mr: 'ज्येष्ठ नागरिकांसाठी कर लाभ' },
      content: { 
        en: 'Senior citizens (60+) get higher tax exemption: Rs 3 lakh for 60-80 years, Rs 5 lakh for 80+ (super senior). Higher interest deduction under 80TTB.',
        hi: 'वरिष्ठ नागरिकों (60+) को अधिक कर छूट मिलती है: 60-80 वर्ष के लिए Rs 3 लाख, 80+ (अति वरिष्ठ) के लिए Rs 5 लाख। 80TTB के तहत उच्च ब्याज कटौती।',
        mr: 'ज्येष्ठ नागरिकांना (60+) जास्त कर सूट मिळते: 60-80 वर्षांसाठी Rs 3 लाख, 80+ (अति ज्येष्ठ) साठी Rs 5 लाख. 80TTB अंतर्गत जास्त व्याज वजावट.'
      },
      keyPoints: {
        en: ['60-80 years = Rs 3 lakh exemption', '80+ years = Rs 5 lakh exemption', '80TTB = Rs 50,000 interest deduction', 'No advance tax if no business income'],
        hi: ['60-80 वर्ष = Rs 3 लाख छूट', '80+ वर्ष = Rs 5 लाख छूट', '80TTB = Rs 50,000 ब्याज कटौती', 'व्यापार आय न होने पर अग्रिम कर नहीं'],
        mr: ['60-80 वर्षे = Rs 3 लाख सूट', '80+ वर्षे = Rs 5 लाख सूट', '80TTB = Rs 50,000 व्याज वजावट', 'व्यवसाय उत्पन्न नसल्यास अग्रिम कर नाही']
      },
      example: {
        en: 'A 75-year-old gets Rs 3 lakh exemption, and Rs 50,000 interest from FD is also exempt under 80TTB.',
        hi: '75 वर्षीय को Rs 3 लाख छूट मिलती है, और FD से Rs 50,000 ब्याज भी 80TTB के तहत छूट है।',
        mr: '75 वर्षीय व्यक्तीला Rs 3 लाख सूट मिळते, आणि FD मधून Rs 50,000 व्याज देखील 80TTB अंतर्गत सूट आहे.'
      }
    },
    {
      id: 'sc4',
      title: { en: 'Railway Concessions for Seniors', hi: 'वरिष्ठ नागरिकों के लिए रेलवे रियायत', mr: 'ज्येष्ठांसाठी रेल्वे सवलत' },
      content: { 
        en: 'Senior citizens get railway ticket concession: 40% for men (60+), 50% for women (58+). Available in all classes except Duronto, Shatabdi, Rajdhani.',
        hi: 'वरिष्ठ नागरिकों को रेलवे टिकट रियायत: पुरुषों के लिए 40% (60+), महिलाओं के लिए 50% (58+)। दुरंतो, शताब्दी, राजधानी को छोड़कर सभी श्रेणियों में उपलब्ध।',
        mr: 'ज्येष्ठ नागरिकांना रेल्वे तिकीट सवलत: पुरुषांसाठी 40% (60+), महिलांसाठी 50% (58+). दुरंतो, शताब्दी, राजधानी वगळता सर्व वर्गांमध्ये उपलब्ध.'
      },
      keyPoints: {
        en: ['Men 60+ = 40% discount', 'Women 58+ = 50% discount', 'Lower berth priority', 'Apply at counter with age proof'],
        hi: ['पुरुष 60+ = 40% छूट', 'महिला 58+ = 50% छूट', 'लोअर बर्थ प्राथमिकता', 'आयु प्रमाण के साथ काउंटर पर आवेदन करें'],
        mr: ['पुरुष 60+ = 40% सवलत', 'महिला 58+ = 50% सवलत', 'लोअर बर्थ प्राधान्य', 'वय पुराव्यासह काउंटरवर अर्ज करा']
      },
      example: {
        en: 'A 65-year-old man can get 40% discount on railway ticket by showing Aadhaar card as age proof.',
        hi: '65 वर्षीय पुरुष आधार कार्ड आयु प्रमाण के रूप में दिखाकर रेलवे टिकट पर 40% छूट पा सकता है।',
        mr: '65 वर्षीय पुरुष आधार कार्ड वयाचा पुरावा म्हणून दाखवून रेल्वे तिकिटावर 40% सवलत मिळवू शकतो.'
      }
    },
    {
      id: 'sc5',
      title: { en: 'PMVVY & Senior Citizen Saving Scheme', hi: 'PMVVY और वरिष्ठ नागरिक बचत योजना', mr: 'PMVVY आणि ज्येष्ठ नागरिक बचत योजना' },
      content: { 
        en: 'PMVVY (Pradhan Mantri Vaya Vandana Yojana) gives guaranteed pension. SCSS (Senior Citizen Saving Scheme) offers highest interest rate among government schemes.',
        hi: 'PMVVY (प्रधानमंत्री वय वंदना योजना) गारंटीड पेंशन देती है। SCSS (वरिष्ठ नागरिक बचत योजना) सरकारी योजनाओं में सबसे अधिक ब्याज दर देती है।',
        mr: 'PMVVY (प्रधानमंत्री वय वंदना योजना) हमीपत्र पेंशन देते. SCSS (ज्येष्ठ नागरिक बचत योजना) सरकारी योजनांमध्ये सर्वाधिक व्याज दर देते.'
      },
      keyPoints: {
        en: ['PMVVY = Guaranteed pension', 'SCSS = Highest interest rate', 'SCSS limit Rs 30 lakh', 'Tax benefit on SCSS investment'],
        hi: ['PMVVY = गारंटीड पेंशन', 'SCSS = सबसे अधिक ब्याज दर', 'SCSS सीमा Rs 30 लाख', 'SCSS निवेश पर कर लाभ'],
        mr: ['PMVVY = हमीपत्र पेंशन', 'SCSS = सर्वाधिक व्याज दर', 'SCSS मर्यादा Rs 30 लाख', 'SCSS गुंतवणुकीवर कर लाभ']
      },
      example: {
        en: 'Senior citizen can invest up to Rs 30 lakh in SCSS at post office or bank for regular income.',
        hi: 'वरिष्ठ नागरिक नियमित आय के लिए डाकघर या बैंक में SCSS में Rs 30 लाख तक निवेश कर सकते हैं।',
        mr: 'ज्येष्ठ नागरिक नियमित उत्पन्नासाठी पोस्ट ऑफिस किंवा बँकेत SCSS मध्ये Rs 30 लाख पर्यंत गुंतवणूक करू शकतात.'
      }
    },
    {
      id: 'sc6',
      title: { en: 'Reverse Mortgage Loan', hi: 'रिवर्स मॉर्टगेज लोन', mr: 'रिव्हर्स मॉर्टगेज कर्ज' },
      content: { 
        en: 'Seniors (60+) can get monthly income by mortgaging property while continuing to live in it. Loan repaid only after death from property sale.',
        hi: 'वरिष्ठ नागरिक (60+) संपत्ति को गिरवी रखकर उसमें रहते हुए मासिक आय प्राप्त कर सकते हैं। ऋण मृत्यु के बाद संपत्ति बिक्री से चुकाया जाता है।',
        mr: 'ज्येष्ठ नागरिक (60+) मालमत्ता तारण ठेवून त्यात राहत मासिक उत्पन्न मिळवू शकतात. कर्ज मृत्यूनंतर मालमत्ता विक्रीतून परतफेड होते.'
      },
      keyPoints: {
        en: ['Monthly income from property', 'Continue living in home', 'No EMI during lifetime', 'Heir can repay and keep property'],
        hi: ['संपत्ति से मासिक आय', 'घर में रहना जारी रखें', 'जीवनकाल में कोई EMI नहीं', 'वारिस चुकाकर संपत्ति रख सकता है'],
        mr: ['मालमत्तेतून मासिक उत्पन्न', 'घरात राहणे सुरू ठेवा', 'आयुष्यभर EMI नाही', 'वारस परतफेड करून मालमत्ता ठेवू शकतो']
      },
      example: {
        en: 'A 65-year-old can mortgage house worth Rs 50 lakh and get monthly income for 15-20 years.',
        hi: '65 वर्षीय व्यक्ति Rs 50 लाख का मकान गिरवी रखकर 15-20 साल तक मासिक आय प्राप्त कर सकता है।',
        mr: '65 वर्षीय व्यक्ती Rs 50 लाखांचे घर तारण ठेवून 15-20 वर्षांसाठी मासिक उत्पन्न मिळवू शकतो.'
      }
    },
    {
      id: 'sc7',
      title: { en: 'Free Legal Aid for Seniors', hi: 'वरिष्ठों के लिए मुफ्त कानूनी सहायता', mr: 'ज्येष्ठांसाठी मोफत कायदेशीर मदत' },
      content: { 
        en: 'Senior citizens are entitled to free legal aid from District Legal Services Authority (DLSA) regardless of income. Free lawyer provided for court cases.',
        hi: 'वरिष्ठ नागरिक आय की परवाह किए बिना जिला विधिक सेवा प्राधिकरण (DLSA) से मुफ्त कानूनी सहायता के हकदार हैं। अदालती मामलों के लिए मुफ्त वकील प्रदान किया जाता है।',
        mr: 'ज्येष्ठ नागरिक उत्पन्नाची पर्वा न करता जिल्हा विधी सेवा प्राधिकरण (DLSA) कडून मोफत कायदेशीर मदत मिळण्यास पात्र आहेत. न्यायालयीन प्रकरणांसाठी मोफत वकील दिला जातो.'
      },
      keyPoints: {
        en: ['Free legal aid at DLSA', 'No income limit for seniors', 'Free lawyer for cases', 'Apply at district court'],
        hi: ['DLSA में मुफ्त कानूनी सहायता', 'वरिष्ठों के लिए कोई आय सीमा नहीं', 'मामलों के लिए मुफ्त वकील', 'जिला अदालत में आवेदन करें'],
        mr: ['DLSA मध्ये मोफत कायदेशीर मदत', 'ज्येष्ठांसाठी उत्पन्न मर्यादा नाही', 'प्रकरणांसाठी मोफत वकील', 'जिल्हा न्यायालयात अर्ज करा']
      },
      example: {
        en: 'If children refuse maintenance, senior can approach DLSA for free lawyer to file case in Tribunal.',
        hi: 'अगर बच्चे भरण-पोषण से मना करें, तो वरिष्ठ नागरिक न्यायाधिकरण में मामला दायर करने के लिए मुफ्त वकील के लिए DLSA से संपर्क कर सकते हैं।',
        mr: 'जर मुलांनी पोषण नाकारले, तर ज्येष्ठ न्यायाधिकरणात प्रकरण दाखल करण्यासाठी मोफत वकिलासाठी DLSA शी संपर्क साधू शकतात.'
      }
    },
    {
      id: 'sc8',
      title: { en: 'Healthcare Priority & Ayushman Bharat', hi: 'स्वास्थ्य प्राथमिकता और आयुष्मान भारत', mr: 'आरोग्य प्राधान्य आणि आयुष्मान भारत' },
      content: { 
        en: 'Senior citizens get priority in hospital queues. Ayushman Bharat provides Rs 5 lakh health insurance for eligible families covering senior members.',
        hi: 'वरिष्ठ नागरिकों को अस्पताल की कतारों में प्राथमिकता मिलती है। आयुष्मान भारत पात्र परिवारों के वरिष्ठ सदस्यों के लिए Rs 5 लाख स्वास्थ्य बीमा प्रदान करता है।',
        mr: 'ज्येष्ठ नागरिकांना रुग्णालयाच्या रांगांमध्ये प्राधान्य मिळते. आयुष्मान भारत पात्र कुटुंबांच्या ज्येष्ठ सदस्यांसाठी Rs 5 लाख आरोग्य विमा प्रदान करतो.'
      },
      keyPoints: {
        en: ['Hospital queue priority', 'Rs 5 lakh health cover', 'Free treatment at empaneled hospitals', 'No age limit in Ayushman'],
        hi: ['अस्पताल कतार में प्राथमिकता', 'Rs 5 लाख स्वास्थ्य कवर', 'सूचीबद्ध अस्पतालों में मुफ्त इलाज', 'आयुष्मान में कोई आयु सीमा नहीं'],
        mr: ['रुग्णालय रांगेत प्राधान्य', 'Rs 5 लाख आरोग्य कव्हर', 'सूचीबद्ध रुग्णालयांमध्ये मोफत उपचार', 'आयुष्मान मध्ये वय मर्यादा नाही']
      },
      example: {
        en: 'Check eligibility for Ayushman Bharat at mera.pmjay.gov.in using ration card or Aadhaar number.',
        hi: 'राशन कार्ड या आधार नंबर का उपयोग करके mera.pmjay.gov.in पर आयुष्मान भारत की पात्रता जांचें।',
        mr: 'रेशन कार्ड किंवा आधार नंबर वापरून mera.pmjay.gov.in वर आयुष्मान भारत पात्रता तपासा.'
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
