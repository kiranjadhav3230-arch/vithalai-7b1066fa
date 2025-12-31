// Quiz Questions Data - 20+ questions per topic for variety

export interface QuizQuestion {
  id: string;
  question: { en: string; hi: string; mr: string };
  options: { en: string[]; hi: string[]; mr: string[] };
  correctIndex: number;
  explanation: { en: string; hi: string; mr: string };
}

export const quizQuestions: Record<string, QuizQuestion[]> = {
  fundamental_rights: [
    {
      id: 'fr1',
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
        en: 'Articles 14-18 cover Right to Equality including equality before law.',
        hi: 'अनुच्छेद 14-18 समानता के अधिकार को कवर करते हैं।',
        mr: 'कलम 14-18 समानतेचा अधिकार समाविष्ट करतात.'
      }
    },
    {
      id: 'fr2',
      question: { 
        en: 'Within how many hours must police present an arrested person before a magistrate?',
        hi: 'पुलिस को गिरफ्तार व्यक्ति को कितने घंटों में मजिस्ट्रेट के सामने पेश करना होता है?',
        mr: 'पोलिसांनी अटक केलेल्या व्यक्तीला किती तासांत मॅजिस्ट्रेटसमोर हजर करावे?'
      },
      options: {
        en: ['12 hours', '24 hours', '48 hours', '72 hours'],
        hi: ['12 घंटे', '24 घंटे', '48 घंटे', '72 घंटे'],
        mr: ['12 तास', '24 तास', '48 तास', '72 तास']
      },
      correctIndex: 1,
      explanation: {
        en: 'Under Article 22, police must present arrested person within 24 hours.',
        hi: 'अनुच्छेद 22 के तहत 24 घंटे के भीतर पेश करना होता है।',
        mr: 'कलम 22 अंतर्गत 24 तासांच्या आत हजर करणे आवश्यक आहे.'
      }
    },
    {
      id: 'fr3',
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
        en: 'Article 24 prohibits child labor below 14 years in factories.',
        hi: 'अनुच्छेद 24 कारखानों में 14 वर्ष से कम के बच्चों पर रोक लगाता है।',
        mr: 'कलम 24 कारखान्यांमध्ये 14 वर्षांखालील मुलांवर बंदी घालते.'
      }
    },
    {
      id: 'fr4',
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
        en: 'Article 32 is called Heart of Constitution by Dr. Ambedkar.',
        hi: 'डॉ. अंबेडकर ने अनुच्छेद 32 को संविधान का हृदय कहा।',
        mr: 'डॉ. आंबेडकरांनी कलम 32 ला घटनेचे हृदय म्हटले.'
      }
    },
    {
      id: 'fr5',
      question: { 
        en: 'What writ can be filed for illegal detention?',
        hi: 'गैरकानूनी हिरासत के लिए कौन सी रिट दायर होती है?',
        mr: 'बेकायदेशीर अटकेसाठी कोणती रिट दाखल करता येते?'
      },
      options: {
        en: ['Mandamus', 'Habeas Corpus', 'Certiorari', 'Quo Warranto'],
        hi: ['मैंडेमस', 'बंदी प्रत्यक्षीकरण', 'सर्टिओरारी', 'को वारंटो'],
        mr: ['मँडेमस', 'हेबियस कॉर्पस', 'सर्टिओरारी', 'को वारंटो']
      },
      correctIndex: 1,
      explanation: {
        en: 'Habeas Corpus means "produce the body" for illegal detention.',
        hi: 'बंदी प्रत्यक्षीकरण गैरकानूनी हिरासत के लिए है।',
        mr: 'हेबियस कॉर्पस बेकायदेशीर अटकेसाठी आहे.'
      }
    },
    {
      id: 'fr6',
      question: { 
        en: 'Which articles protect freedom of religion?',
        hi: 'धर्म की स्वतंत्रता कौन से अनुच्छेद देते हैं?',
        mr: 'धर्मस्वातंत्र्य कोणत्या कलमांमध्ये आहे?'
      },
      options: {
        en: ['Articles 14-18', 'Articles 19-22', 'Articles 25-28', 'Articles 29-30'],
        hi: ['अनुच्छेद 14-18', 'अनुच्छेद 19-22', 'अनुच्छेद 25-28', 'अनुच्छेद 29-30'],
        mr: ['कलम 14-18', 'कलम 19-22', 'कलम 25-28', 'कलम 29-30']
      },
      correctIndex: 2,
      explanation: {
        en: 'Articles 25-28 guarantee freedom of religion.',
        hi: 'अनुच्छेद 25-28 धर्म की स्वतंत्रता देते हैं।',
        mr: 'कलम 25-28 धर्मस्वातंत्र्याची हमी देतात.'
      }
    },
    {
      id: 'fr7',
      question: { 
        en: 'Which article provides Right to Life and Personal Liberty?',
        hi: 'जीवन और व्यक्तिगत स्वतंत्रता का अधिकार किस अनुच्छेद में है?',
        mr: 'जगण्याचा आणि वैयक्तिक स्वातंत्र्याचा अधिकार कोणत्या कलमात आहे?'
      },
      options: {
        en: ['Article 19', 'Article 20', 'Article 21', 'Article 22'],
        hi: ['अनुच्छेद 19', 'अनुच्छेद 20', 'अनुच्छेद 21', 'अनुच्छेद 22'],
        mr: ['कलम 19', 'कलम 20', 'कलम 21', 'कलम 22']
      },
      correctIndex: 2,
      explanation: {
        en: 'Article 21 provides Right to Life and Personal Liberty.',
        hi: 'अनुच्छेद 21 जीवन का अधिकार देता है।',
        mr: 'कलम 21 जगण्याचा अधिकार देते.'
      }
    },
    {
      id: 'fr8',
      question: { 
        en: 'How many Fundamental Rights are there in the Indian Constitution?',
        hi: 'भारतीय संविधान में कितने मौलिक अधिकार हैं?',
        mr: 'भारतीय घटनेत किती मूलभूत अधिकार आहेत?'
      },
      options: {
        en: ['5', '6', '7', '8'],
        hi: ['5', '6', '7', '8'],
        mr: ['5', '6', '7', '8']
      },
      correctIndex: 1,
      explanation: {
        en: 'There are 6 Fundamental Rights (Right to Property was removed in 1978).',
        hi: '6 मौलिक अधिकार हैं (संपत्ति का अधिकार 1978 में हटाया गया)।',
        mr: '6 मूलभूत अधिकार आहेत (संपत्तीचा अधिकार 1978 मध्ये काढला).'
      }
    },
    {
      id: 'fr9',
      question: { 
        en: 'Which article abolishes untouchability?',
        hi: 'कौन सा अनुच्छेद अस्पृश्यता समाप्त करता है?',
        mr: 'कोणते कलम अस्पृश्यता नाहीशी करते?'
      },
      options: {
        en: ['Article 14', 'Article 15', 'Article 17', 'Article 18'],
        hi: ['अनुच्छेद 14', 'अनुच्छेद 15', 'अनुच्छेद 17', 'अनुच्छेद 18'],
        mr: ['कलम 14', 'कलम 15', 'कलम 17', 'कलम 18']
      },
      correctIndex: 2,
      explanation: {
        en: 'Article 17 abolishes untouchability in all forms.',
        hi: 'अनुच्छेद 17 अस्पृश्यता को पूर्णतः समाप्त करता है।',
        mr: 'कलम 17 अस्पृश्यता पूर्णपणे नाहीशी करते.'
      }
    },
    {
      id: 'fr10',
      question: { 
        en: 'Which article provides Right to Education?',
        hi: 'शिक्षा का अधिकार किस अनुच्छेद में है?',
        mr: 'शिक्षणाचा अधिकार कोणत्या कलमात आहे?'
      },
      options: {
        en: ['Article 21', 'Article 21A', 'Article 45', 'Article 46'],
        hi: ['अनुच्छेद 21', 'अनुच्छेद 21A', 'अनुच्छेद 45', 'अनुच्छेद 46'],
        mr: ['कलम 21', 'कलम 21A', 'कलम 45', 'कलम 46']
      },
      correctIndex: 1,
      explanation: {
        en: 'Article 21A provides free and compulsory education for children 6-14 years.',
        hi: 'अनुच्छेद 21A 6-14 वर्ष के बच्चों को मुफ्त शिक्षा देता है।',
        mr: 'कलम 21A 6-14 वर्षांच्या मुलांना मोफत शिक्षण देते.'
      }
    },
    {
      id: 'fr11',
      question: { 
        en: 'Which writ is issued to a public official to perform their duty?',
        hi: 'किसी सरकारी अधिकारी को अपना कर्तव्य निभाने के लिए कौन सी रिट जारी होती है?',
        mr: 'सरकारी अधिकाऱ्याला कर्तव्य बजावण्यासाठी कोणती रिट जारी होते?'
      },
      options: {
        en: ['Habeas Corpus', 'Mandamus', 'Certiorari', 'Prohibition'],
        hi: ['बंदी प्रत्यक्षीकरण', 'परमादेश', 'उत्प्रेषण', 'प्रतिषेध'],
        mr: ['हेबियस कॉर्पस', 'मँडेमस', 'सर्टिओरारी', 'प्रोहिबिशन']
      },
      correctIndex: 1,
      explanation: {
        en: 'Mandamus commands a public official to perform their legal duty.',
        hi: 'परमादेश सरकारी अधिकारी को कर्तव्य निभाने का आदेश देता है।',
        mr: 'मँडेमस अधिकाऱ्याला कर्तव्य बजावण्याचा आदेश देते.'
      }
    },
    {
      id: 'fr12',
      question: { 
        en: 'Article 19 provides how many freedoms?',
        hi: 'अनुच्छेद 19 कितनी स्वतंत्रताएं देता है?',
        mr: 'कलम 19 किती स्वातंत्र्ये देते?'
      },
      options: {
        en: ['4', '5', '6', '7'],
        hi: ['4', '5', '6', '7'],
        mr: ['4', '5', '6', '7']
      },
      correctIndex: 2,
      explanation: {
        en: 'Article 19 provides 6 freedoms including speech, assembly, association, movement, residence, profession.',
        hi: 'अनुच्छेद 19 में 6 स्वतंत्रताएं हैं।',
        mr: 'कलम 19 मध्ये 6 स्वातंत्र्ये आहेत.'
      }
    },
    {
      id: 'fr13',
      question: { 
        en: 'Which article protects against double jeopardy?',
        hi: 'एक ही अपराध के लिए दो बार दंड के खिलाफ कौन सा अनुच्छेद सुरक्षा देता है?',
        mr: 'एकाच गुन्ह्यासाठी दोनदा शिक्षेपासून संरक्षण कोणत्या कलमात आहे?'
      },
      options: {
        en: ['Article 19', 'Article 20', 'Article 21', 'Article 22'],
        hi: ['अनुच्छेद 19', 'अनुच्छेद 20', 'अनुच्छेद 21', 'अनुच्छेद 22'],
        mr: ['कलम 19', 'कलम 20', 'कलम 21', 'कलम 22']
      },
      correctIndex: 1,
      explanation: {
        en: 'Article 20 protects against double jeopardy and self-incrimination.',
        hi: 'अनुच्छेद 20 दोहरे दंड से सुरक्षा देता है।',
        mr: 'कलम 20 दुहेरी शिक्षेपासून संरक्षण देते.'
      }
    },
    {
      id: 'fr14',
      question: { 
        en: 'Cultural and Educational Rights are in which articles?',
        hi: 'सांस्कृतिक और शैक्षिक अधिकार किन अनुच्छेदों में हैं?',
        mr: 'सांस्कृतिक आणि शैक्षणिक अधिकार कोणत्या कलमांमध्ये आहेत?'
      },
      options: {
        en: ['Articles 25-28', 'Articles 29-30', 'Articles 31-32', 'Articles 33-35'],
        hi: ['अनुच्छेद 25-28', 'अनुच्छेद 29-30', 'अनुच्छेद 31-32', 'अनुच्छेद 33-35'],
        mr: ['कलम 25-28', 'कलम 29-30', 'कलम 31-32', 'कलम 33-35']
      },
      correctIndex: 1,
      explanation: {
        en: 'Articles 29-30 protect cultural and educational rights of minorities.',
        hi: 'अनुच्छेद 29-30 अल्पसंख्यकों के सांस्कृतिक अधिकारों की रक्षा करते हैं।',
        mr: 'कलम 29-30 अल्पसंख्यांकांच्या सांस्कृतिक अधिकारांचे संरक्षण करतात.'
      }
    },
    {
      id: 'fr15',
      question: { 
        en: 'Which article abolishes titles except military and academic?',
        hi: 'सैन्य और शैक्षिक उपाधियों को छोड़कर कौन सा अनुच्छेद उपाधियों को समाप्त करता है?',
        mr: 'लष्करी आणि शैक्षणिक पदव्यांशिवाय कोणते कलम पदव्या रद्द करते?'
      },
      options: {
        en: ['Article 15', 'Article 16', 'Article 17', 'Article 18'],
        hi: ['अनुच्छेद 15', 'अनुच्छेद 16', 'अनुच्छेद 17', 'अनुच्छेद 18'],
        mr: ['कलम 15', 'कलम 16', 'कलम 17', 'कलम 18']
      },
      correctIndex: 3,
      explanation: {
        en: 'Article 18 abolishes titles like Sir, Khan Bahadur, etc.',
        hi: 'अनुच्छेद 18 सर, खान बहादुर जैसी उपाधियां समाप्त करता है।',
        mr: 'कलम 18 सर, खान बहादुर अशा पदव्या रद्द करते.'
      }
    },
    {
      id: 'fr16',
      question: { 
        en: 'Fundamental Rights can be suspended during which situation?',
        hi: 'मौलिक अधिकार किस स्थिति में निलंबित हो सकते हैं?',
        mr: 'मूलभूत अधिकार कोणत्या परिस्थितीत निलंबित होऊ शकतात?'
      },
      options: {
        en: ['War', 'National Emergency', 'Financial Emergency', 'All of these'],
        hi: ['युद्ध', 'राष्ट्रीय आपातकाल', 'वित्तीय आपातकाल', 'ये सभी'],
        mr: ['युद्ध', 'राष्ट्रीय आणीबाणी', 'आर्थिक आणीबाणी', 'हे सर्व']
      },
      correctIndex: 1,
      explanation: {
        en: 'During National Emergency under Article 352, some rights can be suspended.',
        hi: 'अनुच्छेद 352 के तहत राष्ट्रीय आपातकाल में कुछ अधिकार निलंबित हो सकते हैं।',
        mr: 'कलम 352 अंतर्गत राष्ट्रीय आणीबाणीत काही अधिकार निलंबित होऊ शकतात.'
      }
    },
    {
      id: 'fr17',
      question: { 
        en: 'Which court can issue writs for enforcement of Fundamental Rights?',
        hi: 'मौलिक अधिकारों के प्रवर्तन के लिए कौन सी अदालत रिट जारी कर सकती है?',
        mr: 'मूलभूत अधिकारांच्या अंमलबजावणीसाठी कोणते न्यायालय रिट जारी करू शकते?'
      },
      options: {
        en: ['Only Supreme Court', 'Only High Court', 'Both Supreme and High Court', 'District Court'],
        hi: ['केवल सर्वोच्च न्यायालय', 'केवल उच्च न्यायालय', 'सर्वोच्च और उच्च दोनों', 'जिला न्यायालय'],
        mr: ['फक्त सर्वोच्च न्यायालय', 'फक्त उच्च न्यायालय', 'सर्वोच्च आणि उच्च दोन्ही', 'जिल्हा न्यायालय']
      },
      correctIndex: 2,
      explanation: {
        en: 'Both Supreme Court (Article 32) and High Courts (Article 226) can issue writs.',
        hi: 'सर्वोच्च न्यायालय और उच्च न्यायालय दोनों रिट जारी कर सकते हैं।',
        mr: 'सर्वोच्च न्यायालय आणि उच्च न्यायालय दोन्ही रिट जारी करू शकतात.'
      }
    },
    {
      id: 'fr18',
      question: { 
        en: 'Which article guarantees freedom of speech and expression?',
        hi: 'वाक् और अभिव्यक्ति की स्वतंत्रता कौन सा अनुच्छेद देता है?',
        mr: 'भाषण आणि अभिव्यक्ती स्वातंत्र्य कोणते कलम देते?'
      },
      options: {
        en: ['Article 19(1)(a)', 'Article 19(1)(b)', 'Article 19(1)(c)', 'Article 19(1)(d)'],
        hi: ['अनुच्छेद 19(1)(a)', 'अनुच्छेद 19(1)(b)', 'अनुच्छेद 19(1)(c)', 'अनुच्छेद 19(1)(d)'],
        mr: ['कलम 19(1)(a)', 'कलम 19(1)(b)', 'कलम 19(1)(c)', 'कलम 19(1)(d)']
      },
      correctIndex: 0,
      explanation: {
        en: 'Article 19(1)(a) guarantees freedom of speech and expression.',
        hi: 'अनुच्छेद 19(1)(a) वाक् और अभिव्यक्ति की स्वतंत्रता देता है।',
        mr: 'कलम 19(1)(a) भाषण आणि अभिव्यक्ती स्वातंत्र्य देते.'
      }
    },
    {
      id: 'fr19',
      question: { 
        en: 'Right against exploitation is in which articles?',
        hi: 'शोषण के विरुद्ध अधिकार किन अनुच्छेदों में है?',
        mr: 'शोषणाविरुद्ध अधिकार कोणत्या कलमांमध्ये आहे?'
      },
      options: {
        en: ['Articles 19-22', 'Articles 23-24', 'Articles 25-28', 'Articles 29-30'],
        hi: ['अनुच्छेद 19-22', 'अनुच्छेद 23-24', 'अनुच्छेद 25-28', 'अनुच्छेद 29-30'],
        mr: ['कलम 19-22', 'कलम 23-24', 'कलम 25-28', 'कलम 29-30']
      },
      correctIndex: 1,
      explanation: {
        en: 'Articles 23-24 prohibit human trafficking, forced labor, and child labor.',
        hi: 'अनुच्छेद 23-24 मानव तस्करी, बेगार और बाल श्रम पर रोक लगाते हैं।',
        mr: 'कलम 23-24 मानव तस्करी, वेठबिगारी आणि बालकामगारावर बंदी घालतात.'
      }
    },
    {
      id: 'fr20',
      question: { 
        en: 'Which article prohibits discrimination on grounds of religion, race, caste, sex?',
        hi: 'धर्म, जाति, लिंग के आधार पर भेदभाव पर रोक कौन सा अनुच्छेद लगाता है?',
        mr: 'धर्म, जात, लिंग यावर भेदभावावर बंदी कोणते कलम घालते?'
      },
      options: {
        en: ['Article 14', 'Article 15', 'Article 16', 'Article 17'],
        hi: ['अनुच्छेद 14', 'अनुच्छेद 15', 'अनुच्छेद 16', 'अनुच्छेद 17'],
        mr: ['कलम 14', 'कलम 15', 'कलम 16', 'कलम 17']
      },
      correctIndex: 1,
      explanation: {
        en: 'Article 15 prohibits discrimination on grounds of religion, race, caste, sex, place of birth.',
        hi: 'अनुच्छेद 15 धर्म, जाति, लिंग के आधार पर भेदभाव पर रोक लगाता है।',
        mr: 'कलम 15 धर्म, जात, लिंग यावर भेदभावावर बंदी घालते.'
      }
    },
    {
      id: 'fr21',
      question: { 
        en: 'Article 16 provides equality in which matter?',
        hi: 'अनुच्छेद 16 किस मामले में समानता देता है?',
        mr: 'कलम 16 कोणत्या बाबतीत समानता देते?'
      },
      options: {
        en: ['Education', 'Public Employment', 'Religion', 'Trade'],
        hi: ['शिक्षा', 'सार्वजनिक रोजगार', 'धर्म', 'व्यापार'],
        mr: ['शिक्षण', 'सार्वजनिक रोजगार', 'धर्म', 'व्यापार']
      },
      correctIndex: 1,
      explanation: {
        en: 'Article 16 provides equality of opportunity in public employment.',
        hi: 'अनुच्छेद 16 सार्वजनिक रोजगार में समान अवसर देता है।',
        mr: 'कलम 16 सार्वजनिक रोजगारात समान संधी देते.'
      }
    }
  ],
  consumer_rights: [
    {
      id: 'cr1',
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
        en: '1800-11-4000 is the National Consumer Helpline.',
        hi: '1800-11-4000 राष्ट्रीय उपभोक्ता हेल्पलाइन है।',
        mr: '1800-11-4000 राष्ट्रीय ग्राहक हेल्पलाइन आहे.'
      }
    },
    {
      id: 'cr2',
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
        en: 'Charging more than MRP is illegal.',
        hi: 'MRP से अधिक शुल्क लेना गैरकानूनी है।',
        mr: 'MRP पेक्षा जास्त शुल्क आकारणे बेकायदेशीर आहे.'
      }
    },
    {
      id: 'cr3',
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
        en: 'ISI Mark is for electrical and industrial products.',
        hi: 'ISI मार्क विद्युत उत्पादों के लिए है।',
        mr: 'ISI मार्क विद्युत उत्पादनांसाठी आहे.'
      }
    },
    {
      id: 'cr4',
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
        en: 'Consumer complaints must be filed within 2 years.',
        hi: 'उपभोक्ता शिकायत 2 वर्ष के भीतर दर्ज करनी होती है।',
        mr: 'ग्राहक तक्रार 2 वर्षांच्या आत दाखल करणे आवश्यक आहे.'
      }
    },
    {
      id: 'cr5',
      question: { 
        en: 'Which mark is for gold jewelry purity?',
        hi: 'सोने के आभूषणों की शुद्धता के लिए कौन सा चिह्न है?',
        mr: 'सोन्याच्या दागिन्यांच्या शुद्धतेसाठी कोणते चिन्ह आहे?'
      },
      options: {
        en: ['ISI Mark', 'AGMARK', 'BIS Hallmark', 'FPO'],
        hi: ['ISI मार्क', 'एगमार्क', 'BIS हॉलमार्क', 'FPO'],
        mr: ['ISI मार्क', 'एगमार्क', 'BIS हॉलमार्क', 'FPO']
      },
      correctIndex: 2,
      explanation: {
        en: 'BIS Hallmark certifies gold jewelry purity.',
        hi: 'BIS हॉलमार्क सोने की शुद्धता प्रमाणित करता है।',
        mr: 'BIS हॉलमार्क सोन्याची शुद्धता प्रमाणित करते.'
      }
    },
    {
      id: 'cr6',
      question: { 
        en: 'What does AGMARK certify?',
        hi: 'एगमार्क क्या प्रमाणित करता है?',
        mr: 'एगमार्क काय प्रमाणित करते?'
      },
      options: {
        en: ['Electronics', 'Agricultural products', 'Medicines', 'Textiles'],
        hi: ['इलेक्ट्रॉनिक्स', 'कृषि उत्पाद', 'दवाइयाँ', 'वस्त्र'],
        mr: ['इलेक्ट्रॉनिक्स', 'कृषी उत्पादने', 'औषधे', 'वस्त्रे']
      },
      correctIndex: 1,
      explanation: {
        en: 'AGMARK certifies agricultural products quality.',
        hi: 'एगमार्क कृषि उत्पादों की गुणवत्ता प्रमाणित करता है।',
        mr: 'एगमार्क कृषी उत्पादनांची गुणवत्ता प्रमाणित करते.'
      }
    },
    {
      id: 'cr7',
      question: { 
        en: 'What is the monetary limit for District Consumer Forum?',
        hi: 'जिला उपभोक्ता फोरम की मौद्रिक सीमा क्या है?',
        mr: 'जिल्हा ग्राहक मंचाची आर्थिक मर्यादा किती आहे?'
      },
      options: {
        en: ['Up to 50 lakhs', 'Up to 1 crore', 'Up to 2 crore', 'Up to 5 crore'],
        hi: ['50 लाख तक', '1 करोड़ तक', '2 करोड़ तक', '5 करोड़ तक'],
        mr: ['50 लाखांपर्यंत', '1 कोटीपर्यंत', '2 कोटीपर्यंत', '5 कोटीपर्यंत']
      },
      correctIndex: 1,
      explanation: {
        en: 'District Forum handles complaints up to Rs 1 crore.',
        hi: 'जिला फोरम 1 करोड़ तक की शिकायतें देखता है।',
        mr: 'जिल्हा मंच 1 कोटीपर्यंतच्या तक्रारी हाताळतो.'
      }
    },
    {
      id: 'cr8',
      question: { 
        en: 'Consumer Protection Act 2019 replaced which act?',
        hi: 'उपभोक्ता संरक्षण अधिनियम 2019 ने किस अधिनियम को बदला?',
        mr: 'ग्राहक संरक्षण कायदा 2019 ने कोणत्या कायद्याची जागा घेतली?'
      },
      options: {
        en: ['1978 Act', '1986 Act', '1991 Act', '2002 Act'],
        hi: ['1978 अधिनियम', '1986 अधिनियम', '1991 अधिनियम', '2002 अधिनियम'],
        mr: ['1978 कायदा', '1986 कायदा', '1991 कायदा', '2002 कायदा']
      },
      correctIndex: 1,
      explanation: {
        en: 'Consumer Protection Act 2019 replaced the 1986 Act.',
        hi: 'उपभोक्ता संरक्षण अधिनियम 2019 ने 1986 के अधिनियम को बदला।',
        mr: 'ग्राहक संरक्षण कायदा 2019 ने 1986 च्या कायद्याची जागा घेतली.'
      }
    },
    {
      id: 'cr9',
      question: { 
        en: 'How many basic consumer rights are there?',
        hi: 'कितने मूल उपभोक्ता अधिकार हैं?',
        mr: 'किती मूलभूत ग्राहक अधिकार आहेत?'
      },
      options: {
        en: ['4', '5', '6', '8'],
        hi: ['4', '5', '6', '8'],
        mr: ['4', '5', '6', '8']
      },
      correctIndex: 2,
      explanation: {
        en: 'There are 6 basic consumer rights.',
        hi: '6 मूल उपभोक्ता अधिकार हैं।',
        mr: '6 मूलभूत ग्राहक अधिकार आहेत.'
      }
    },
    {
      id: 'cr10',
      question: { 
        en: 'Which organization issues ISI Mark?',
        hi: 'ISI मार्क कौन सी संस्था जारी करती है?',
        mr: 'ISI मार्क कोणती संस्था जारी करते?'
      },
      options: {
        en: ['FSSAI', 'BIS', 'AGMARK', 'ISO'],
        hi: ['FSSAI', 'BIS', 'AGMARK', 'ISO'],
        mr: ['FSSAI', 'BIS', 'AGMARK', 'ISO']
      },
      correctIndex: 1,
      explanation: {
        en: 'Bureau of Indian Standards (BIS) issues ISI Mark.',
        hi: 'भारतीय मानक ब्यूरो (BIS) ISI मार्क जारी करता है।',
        mr: 'भारतीय मानक ब्यूरो (BIS) ISI मार्क जारी करते.'
      }
    },
    {
      id: 'cr11',
      question: { 
        en: 'Can you file consumer complaint online?',
        hi: 'क्या आप ऑनलाइन उपभोक्ता शिकायत दर्ज कर सकते हैं?',
        mr: 'तुम्ही ऑनलाइन ग्राहक तक्रार दाखल करू शकता का?'
      },
      options: {
        en: ['No', 'Yes, on e-Daakhil', 'Only offline', 'Through lawyer only'],
        hi: ['नहीं', 'हाँ, e-Daakhil पर', 'केवल ऑफलाइन', 'केवल वकील द्वारा'],
        mr: ['नाही', 'होय, e-Daakhil वर', 'फक्त ऑफलाइन', 'फक्त वकिलाद्वारे']
      },
      correctIndex: 1,
      explanation: {
        en: 'Consumer complaints can be filed online on e-Daakhil portal.',
        hi: 'उपभोक्ता शिकायत e-Daakhil पोर्टल पर ऑनलाइन दर्ज कर सकते हैं।',
        mr: 'ग्राहक तक्रार e-Daakhil पोर्टलवर ऑनलाइन दाखल करता येते.'
      }
    },
    {
      id: 'cr12',
      question: { 
        en: 'What does FPO mark indicate?',
        hi: 'FPO मार्क क्या दर्शाता है?',
        mr: 'FPO मार्क काय दर्शवते?'
      },
      options: {
        en: ['Food products', 'Fruit products', 'Farm products', 'Frozen products'],
        hi: ['खाद्य उत्पाद', 'फल उत्पाद', 'कृषि उत्पाद', 'जमे हुए उत्पाद'],
        mr: ['खाद्य उत्पादने', 'फळ उत्पादने', 'कृषी उत्पादने', 'गोठवलेली उत्पादने']
      },
      correctIndex: 1,
      explanation: {
        en: 'FPO (Fruit Products Order) mark is for processed fruit products.',
        hi: 'FPO मार्क प्रसंस्कृत फल उत्पादों के लिए है।',
        mr: 'FPO मार्क प्रक्रिया केलेल्या फळ उत्पादनांसाठी आहे.'
      }
    },
    {
      id: 'cr13',
      question: { 
        en: 'Is lawyer mandatory for consumer complaint?',
        hi: 'क्या उपभोक्ता शिकायत के लिए वकील अनिवार्य है?',
        mr: 'ग्राहक तक्रारीसाठी वकील अनिवार्य आहे का?'
      },
      options: {
        en: ['Yes, mandatory', 'No, self-representation allowed', 'Only for appeal', 'Depends on amount'],
        hi: ['हाँ, अनिवार्य', 'नहीं, स्वयं प्रतिनिधित्व', 'केवल अपील में', 'राशि पर निर्भर'],
        mr: ['होय, अनिवार्य', 'नाही, स्वतः प्रतिनिधित्व', 'फक्त अपीलसाठी', 'रकमेवर अवलंबून']
      },
      correctIndex: 1,
      explanation: {
        en: 'No lawyer is mandatory, you can represent yourself.',
        hi: 'वकील अनिवार्य नहीं है, आप स्वयं प्रतिनिधित्व कर सकते हैं।',
        mr: 'वकील अनिवार्य नाही, तुम्ही स्वतः प्रतिनिधित्व करू शकता.'
      }
    },
    {
      id: 'cr14',
      question: { 
        en: 'Which body regulates food safety in India?',
        hi: 'भारत में खाद्य सुरक्षा किस निकाय द्वारा नियंत्रित होती है?',
        mr: 'भारतात अन्न सुरक्षा कोणत्या संस्थेद्वारे नियंत्रित होते?'
      },
      options: {
        en: ['BIS', 'FSSAI', 'AGMARK', 'FCI'],
        hi: ['BIS', 'FSSAI', 'AGMARK', 'FCI'],
        mr: ['BIS', 'FSSAI', 'AGMARK', 'FCI']
      },
      correctIndex: 1,
      explanation: {
        en: 'FSSAI (Food Safety and Standards Authority of India) regulates food safety.',
        hi: 'FSSAI खाद्य सुरक्षा का नियामक है।',
        mr: 'FSSAI अन्न सुरक्षा नियंत्रित करते.'
      }
    },
    {
      id: 'cr15',
      question: { 
        en: 'What is the fee for filing consumer complaint up to Rs 5 lakh?',
        hi: '5 लाख तक की शिकायत के लिए फीस क्या है?',
        mr: '5 लाखांपर्यंतच्या तक्रारीसाठी फी किती आहे?'
      },
      options: {
        en: ['Rs 100', 'Rs 200', 'Rs 500', 'Free'],
        hi: ['₹100', '₹200', '₹500', 'मुफ्त'],
        mr: ['₹100', '₹200', '₹500', 'मोफत']
      },
      correctIndex: 3,
      explanation: {
        en: 'No fee for complaints up to Rs 5 lakh.',
        hi: '5 लाख तक की शिकायत मुफ्त है।',
        mr: '5 लाखांपर्यंतच्या तक्रारी मोफत आहेत.'
      }
    },
    {
      id: 'cr16',
      question: { 
        en: 'National Consumer Day is celebrated on?',
        hi: 'राष्ट्रीय उपभोक्ता दिवस कब मनाया जाता है?',
        mr: 'राष्ट्रीय ग्राहक दिन कधी साजरा केला जातो?'
      },
      options: {
        en: ['15 March', '24 December', '15 August', '26 January'],
        hi: ['15 मार्च', '24 दिसंबर', '15 अगस्त', '26 जनवरी'],
        mr: ['15 मार्च', '24 डिसेंबर', '15 ऑगस्ट', '26 जानेवारी']
      },
      correctIndex: 1,
      explanation: {
        en: 'National Consumer Day is on 24 December (World Consumer Rights Day is 15 March).',
        hi: 'राष्ट्रीय उपभोक्ता दिवस 24 दिसंबर को है।',
        mr: 'राष्ट्रीय ग्राहक दिन 24 डिसेंबरला आहे.'
      }
    },
    {
      id: 'cr17',
      question: { 
        en: 'Can you return product if no bill is given?',
        hi: 'क्या बिल न मिलने पर उत्पाद वापस कर सकते हैं?',
        mr: 'बिल न मिळाल्यास उत्पादन परत करता येते का?'
      },
      options: {
        en: ['No, without bill no return', 'Yes, shopkeeper must take back', 'Only exchange', 'Depends on product'],
        hi: ['नहीं, बिल के बिना नहीं', 'हाँ, दुकानदार को वापस लेना होगा', 'केवल बदलाव', 'उत्पाद पर निर्भर'],
        mr: ['नाही, बिलशिवाय नाही', 'होय, दुकानदाराला परत घ्यावे लागेल', 'फक्त बदली', 'उत्पादनावर अवलंबून']
      },
      correctIndex: 1,
      explanation: {
        en: 'Not giving bill is illegal, and you have right to return product.',
        hi: 'बिल न देना गैरकानूनी है और आप उत्पाद वापस कर सकते हैं।',
        mr: 'बिल न देणे बेकायदेशीर आहे आणि तुम्ही उत्पादन परत करू शकता.'
      }
    },
    {
      id: 'cr18',
      question: { 
        en: 'What is CCPA?',
        hi: 'CCPA क्या है?',
        mr: 'CCPA म्हणजे काय?'
      },
      options: {
        en: ['Central Consumer Protection Authority', 'Consumer Court Protection Act', 'Consumer Complaint Processing Agency', 'Central Court for Public Affairs'],
        hi: ['केंद्रीय उपभोक्ता संरक्षण प्राधिकरण', 'उपभोक्ता न्यायालय संरक्षण अधिनियम', 'उपभोक्ता शिकायत प्रसंस्करण एजेंसी', 'लोक मामलों के लिए केंद्रीय न्यायालय'],
        mr: ['केंद्रीय ग्राहक संरक्षण प्राधिकरण', 'ग्राहक न्यायालय संरक्षण कायदा', 'ग्राहक तक्रार प्रक्रिया एजन्सी', 'सार्वजनिक बाबींसाठी केंद्रीय न्यायालय']
      },
      correctIndex: 0,
      explanation: {
        en: 'CCPA is Central Consumer Protection Authority under 2019 Act.',
        hi: 'CCPA केंद्रीय उपभोक्ता संरक्षण प्राधिकरण है।',
        mr: 'CCPA केंद्रीय ग्राहक संरक्षण प्राधिकरण आहे.'
      }
    },
    {
      id: 'cr19',
      question: { 
        en: 'What is misleading advertisement penalty under Consumer Protection Act?',
        hi: 'भ्रामक विज्ञापन पर उपभोक्ता संरक्षण अधिनियम के तहत क्या दंड है?',
        mr: 'दिशाभूल करणाऱ्या जाहिरातीवर ग्राहक संरक्षण कायद्याअंतर्गत काय दंड आहे?'
      },
      options: {
        en: ['Rs 10 lakh', 'Rs 50 lakh', 'Rs 10 lakh to Rs 50 lakh', 'No penalty'],
        hi: ['₹10 लाख', '₹50 लाख', '₹10 लाख से ₹50 लाख', 'कोई दंड नहीं'],
        mr: ['₹10 लाख', '₹50 लाख', '₹10 लाख ते ₹50 लाख', 'दंड नाही']
      },
      correctIndex: 2,
      explanation: {
        en: 'Misleading ads can attract penalty of Rs 10 lakh to Rs 50 lakh.',
        hi: 'भ्रामक विज्ञापन पर ₹10 लाख से ₹50 लाख तक का दंड हो सकता है।',
        mr: 'दिशाभूल करणाऱ्या जाहिरातींवर ₹10 लाख ते ₹50 लाख दंड होऊ शकतो.'
      }
    },
    {
      id: 'cr20',
      question: { 
        en: 'What is meant by "Unfair Trade Practice"?',
        hi: '"अनुचित व्यापार प्रथा" का क्या अर्थ है?',
        mr: '"अनुचित व्यापार पद्धती" म्हणजे काय?'
      },
      options: {
        en: ['Selling at MRP', 'False claims about product', 'Giving discounts', 'Free delivery'],
        hi: ['MRP पर बेचना', 'उत्पाद के बारे में झूठे दावे', 'छूट देना', 'मुफ्त डिलीवरी'],
        mr: ['MRP ला विक्री', 'उत्पादनाबद्दल खोटे दावे', 'सवलत देणे', 'मोफत डिलिव्हरी']
      },
      correctIndex: 1,
      explanation: {
        en: 'Unfair trade practice includes false claims, misleading ads, fake offers.',
        hi: 'अनुचित व्यापार प्रथा में झूठे दावे, भ्रामक विज्ञापन शामिल हैं।',
        mr: 'अनुचित व्यापार पद्धतीत खोटे दावे, दिशाभूल करणाऱ्या जाहिराती यांचा समावेश आहे.'
      }
    }
  ],
  women_rights: [
    {
      id: 'wr1',
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
        en: '1091 is the Women Helpline. 181 is also available.',
        hi: '1091 महिला हेल्पलाइन है। 181 भी उपलब्ध है।',
        mr: '1091 महिला हेल्पलाइन आहे. 181 ही उपलब्ध आहे.'
      }
    },
    {
      id: 'wr2',
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
        en: 'Women get 26 weeks of paid maternity leave.',
        hi: 'महिलाओं को 26 सप्ताह का सवेतन मातृत्व अवकाश मिलता है।',
        mr: 'महिलांना 26 आठवड्यांची सवेतन मातृत्व रजा मिळते.'
      }
    },
    {
      id: 'wr3',
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
        hi: 'POSH अधिनियम के तहत 90 दिनों में हल होनी चाहिए।',
        mr: 'POSH कायद्यांतर्गत 90 दिवसांत निकाली काढल्या पाहिजेत.'
      }
    },
    {
      id: 'wr4',
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
        en: 'A female officer must visit to record statement at woman\'s choice.',
        hi: 'महिला अधिकारी को महिला की पसंद की जगह पर बयान लेने आना होता है।',
        mr: 'महिला अधिकाऱ्याने महिलेच्या पसंतीच्या ठिकाणी जबानी घ्यावी लागते.'
      }
    },
    {
      id: 'wr5',
      question: { 
        en: 'What is POSH Act?',
        hi: 'POSH अधिनियम क्या है?',
        mr: 'POSH कायदा म्हणजे काय?'
      },
      options: {
        en: ['Protection of Women from Domestic Violence', 'Prevention of Sexual Harassment at Workplace', 'Protection of Scheduled Castes', 'Prevention of Harassment Act'],
        hi: ['घरेलू हिंसा से महिला संरक्षण', 'कार्यस्थल पर यौन उत्पीड़न की रोकथाम', 'अनुसूचित जाति संरक्षण', 'उत्पीड़न रोकथाम अधिनियम'],
        mr: ['घरगुती हिंसाचारापासून महिला संरक्षण', 'कार्यस्थळावर लैंगिक छळ प्रतिबंध', 'अनुसूचित जाती संरक्षण', 'छळ प्रतिबंध कायदा']
      },
      correctIndex: 1,
      explanation: {
        en: 'POSH stands for Prevention of Sexual Harassment at Workplace.',
        hi: 'POSH का अर्थ है कार्यस्थल पर यौन उत्पीड़न की रोकथाम।',
        mr: 'POSH म्हणजे कार्यस्थळावर लैंगिक छळ प्रतिबंध.'
      }
    },
    {
      id: 'wr6',
      question: { 
        en: 'What is the legal age for marriage for women in India?',
        hi: 'भारत में महिलाओं के लिए विवाह की कानूनी उम्र क्या है?',
        mr: 'भारतात महिलांसाठी विवाहाचे कायदेशीर वय किती आहे?'
      },
      options: {
        en: ['16 years', '18 years', '21 years', '25 years'],
        hi: ['16 वर्ष', '18 वर्ष', '21 वर्ष', '25 वर्ष'],
        mr: ['16 वर्षे', '18 वर्षे', '21 वर्षे', '25 वर्षे']
      },
      correctIndex: 1,
      explanation: {
        en: 'Legal age for marriage for women is 18 years.',
        hi: 'महिलाओं के लिए विवाह की कानूनी उम्र 18 वर्ष है।',
        mr: 'महिलांसाठी विवाहाचे कायदेशीर वय 18 वर्षे आहे.'
      }
    },
    {
      id: 'wr7',
      question: { 
        en: 'Under which act can woman get protection order against domestic violence?',
        hi: 'किस अधिनियम के तहत महिला घरेलू हिंसा के खिलाफ सुरक्षा आदेश प्राप्त कर सकती है?',
        mr: 'कोणत्या कायद्यांतर्गत महिला घरगुती हिंसाचाराविरुद्ध संरक्षण आदेश मिळवू शकते?'
      },
      options: {
        en: ['IPC 498A', 'Protection of Women from Domestic Violence Act 2005', 'POSH Act', 'Dowry Prohibition Act'],
        hi: ['IPC 498A', 'घरेलू हिंसा से महिला संरक्षण अधिनियम 2005', 'POSH अधिनियम', 'दहेज निषेध अधिनियम'],
        mr: ['IPC 498A', 'घरगुती हिंसाचारापासून महिला संरक्षण कायदा 2005', 'POSH कायदा', 'हुंडा निषेध कायदा']
      },
      correctIndex: 1,
      explanation: {
        en: 'Protection of Women from Domestic Violence Act 2005 provides protection orders.',
        hi: 'घरेलू हिंसा से महिला संरक्षण अधिनियम 2005 सुरक्षा आदेश देता है।',
        mr: 'घरगुती हिंसाचारापासून महिला संरक्षण कायदा 2005 संरक्षण आदेश देतो.'
      }
    },
    {
      id: 'wr8',
      question: { 
        en: 'What is Section 498A IPC?',
        hi: 'IPC धारा 498A क्या है?',
        mr: 'IPC कलम 498A म्हणजे काय?'
      },
      options: {
        en: ['Rape', 'Cruelty by husband or relatives', 'Dowry death', 'Sexual harassment'],
        hi: ['बलात्कार', 'पति या रिश्तेदारों द्वारा क्रूरता', 'दहेज मृत्यु', 'यौन उत्पीड़न'],
        mr: ['बलात्कार', 'पती किंवा नातेवाईकांकडून क्रूरता', 'हुंडा मृत्यू', 'लैंगिक छळ']
      },
      correctIndex: 1,
      explanation: {
        en: 'Section 498A deals with cruelty by husband or his relatives.',
        hi: 'धारा 498A पति या उसके रिश्तेदारों द्वारा क्रूरता से संबंधित है।',
        mr: 'कलम 498A पती किंवा त्याच्या नातेवाईकांकडून क्रूरतेशी संबंधित आहे.'
      }
    },
    {
      id: 'wr9',
      question: { 
        en: 'Can woman file FIR in any police station for her safety?',
        hi: 'क्या महिला अपनी सुरक्षा के लिए किसी भी पुलिस स्टेशन में FIR दर्ज कर सकती है?',
        mr: 'महिला तिच्या सुरक्षिततेसाठी कोणत्याही पोलीस स्टेशनमध्ये FIR दाखल करू शकते का?'
      },
      options: {
        en: ['No, only in her area', 'Yes, Zero FIR facility', 'Only with lawyer', 'Only in women police station'],
        hi: ['नहीं, केवल अपने क्षेत्र में', 'हाँ, जीरो FIR सुविधा', 'केवल वकील के साथ', 'केवल महिला पुलिस स्टेशन में'],
        mr: ['नाही, फक्त तिच्या क्षेत्रात', 'होय, झिरो FIR सुविधा', 'फक्त वकिलासह', 'फक्त महिला पोलीस स्टेशनमध्ये']
      },
      correctIndex: 1,
      explanation: {
        en: 'Yes, Zero FIR can be filed at any police station.',
        hi: 'हाँ, जीरो FIR किसी भी पुलिस स्टेशन में दर्ज कर सकती है।',
        mr: 'होय, झिरो FIR कोणत्याही पोलीस स्टेशनमध्ये दाखल करता येते.'
      }
    },
    {
      id: 'wr10',
      question: { 
        en: 'What is the punishment for dowry demand?',
        hi: 'दहेज मांगने पर क्या सजा है?',
        mr: 'हुंडा मागण्यावर काय शिक्षा आहे?'
      },
      options: {
        en: ['Fine only', '6 months imprisonment', 'Up to 5 years imprisonment', 'No punishment'],
        hi: ['केवल जुर्माना', '6 महीने कारावास', '5 वर्ष तक कारावास', 'कोई सजा नहीं'],
        mr: ['फक्त दंड', '6 महिने कारावास', '5 वर्षांपर्यंत कारावास', 'शिक्षा नाही']
      },
      correctIndex: 2,
      explanation: {
        en: 'Dowry demand is punishable up to 5 years imprisonment and Rs 15,000 fine.',
        hi: 'दहेज मांगने पर 5 वर्ष तक कारावास और ₹15,000 जुर्माना हो सकता है।',
        mr: 'हुंडा मागण्यावर 5 वर्षांपर्यंत कारावास आणि ₹15,000 दंड होऊ शकतो.'
      }
    },
    {
      id: 'wr11',
      question: { 
        en: 'Is marital rape a crime in India?',
        hi: 'क्या भारत में वैवाहिक बलात्कार अपराध है?',
        mr: 'भारतात वैवाहिक बलात्कार गुन्हा आहे का?'
      },
      options: {
        en: ['Yes, punishable', 'No, not criminalized', 'Only if wife is minor', 'Partially'],
        hi: ['हाँ, दंडनीय', 'नहीं, अपराध नहीं', 'केवल अगर पत्नी नाबालिग है', 'आंशिक रूप से'],
        mr: ['होय, शिक्षापात्र', 'नाही, गुन्हा नाही', 'फक्त पत्नी अल्पवयीन असल्यास', 'अंशतः']
      },
      correctIndex: 2,
      explanation: {
        en: 'Marital rape is crime only if wife is below 18 years.',
        hi: 'वैवाहिक बलात्कार केवल तब अपराध है जब पत्नी 18 वर्ष से कम हो।',
        mr: 'वैवाहिक बलात्कार फक्त पत्नी 18 वर्षांखालील असल्यास गुन्हा आहे.'
      }
    },
    {
      id: 'wr12',
      question: { 
        en: 'How many employees needed for POSH Act to be applicable?',
        hi: 'POSH अधिनियम लागू होने के लिए कितने कर्मचारी होने चाहिए?',
        mr: 'POSH कायदा लागू होण्यासाठी किती कर्मचारी असावेत?'
      },
      options: {
        en: ['5', '10', '20', 'Any number'],
        hi: ['5', '10', '20', 'कोई भी संख्या'],
        mr: ['5', '10', '20', 'कोणतीही संख्या']
      },
      correctIndex: 1,
      explanation: {
        en: 'POSH Act applies to organizations with 10 or more employees.',
        hi: 'POSH अधिनियम 10 या अधिक कर्मचारियों वाले संगठनों पर लागू होता है।',
        mr: 'POSH कायदा 10 किंवा अधिक कर्मचारी असलेल्या संस्थांना लागू होतो.'
      }
    },
    {
      id: 'wr13',
      question: { 
        en: 'What is the helpline number for One Stop Centre?',
        hi: 'वन स्टॉप सेंटर का हेल्पलाइन नंबर क्या है?',
        mr: 'वन स्टॉप सेंटरचा हेल्पलाइन नंबर कोणता आहे?'
      },
      options: {
        en: ['100', '181', '1091', '112'],
        hi: ['100', '181', '1091', '112'],
        mr: ['100', '181', '1091', '112']
      },
      correctIndex: 1,
      explanation: {
        en: '181 is the helpline for One Stop Centre (Women Helpline).',
        hi: '181 वन स्टॉप सेंटर (महिला हेल्पलाइन) का नंबर है।',
        mr: '181 वन स्टॉप सेंटर (महिला हेल्पलाइन) चा नंबर आहे.'
      }
    },
    {
      id: 'wr14',
      question: { 
        en: 'Can woman refuse to pay rent if living in husband\'s house after divorce?',
        hi: 'क्या तलाक के बाद पति के घर में रहने पर महिला किराया देने से मना कर सकती है?',
        mr: 'घटस्फोटानंतर पतीच्या घरात राहिल्यास महिला भाडे देण्यास नकार देऊ शकते का?'
      },
      options: {
        en: ['No, must pay', 'Yes, residence right exists', 'Only for 1 year', 'Depends on court'],
        hi: ['नहीं, देना होगा', 'हाँ, निवास का अधिकार है', 'केवल 1 वर्ष के लिए', 'न्यायालय पर निर्भर'],
        mr: ['नाही, द्यावे लागेल', 'होय, निवासाचा अधिकार आहे', 'फक्त 1 वर्षासाठी', 'न्यायालयावर अवलंबून']
      },
      correctIndex: 1,
      explanation: {
        en: 'Under Domestic Violence Act, woman has right of residence in shared household.',
        hi: 'घरेलू हिंसा अधिनियम के तहत महिला को साझा घर में निवास का अधिकार है।',
        mr: 'घरगुती हिंसाचार कायद्यांतर्गत महिलेला सामायिक घरात निवासाचा अधिकार आहे.'
      }
    },
    {
      id: 'wr15',
      question: { 
        en: 'Can woman get maintenance if she is earning?',
        hi: 'क्या कमाने वाली महिला को भी भरण-पोषण मिल सकता है?',
        mr: 'कमावत्या महिलेलाही पोटगी मिळू शकते का?'
      },
      options: {
        en: ['No', 'Yes, if husband earns more', 'Only if unemployed', 'Never'],
        hi: ['नहीं', 'हाँ, अगर पति अधिक कमाता है', 'केवल बेरोजगार होने पर', 'कभी नहीं'],
        mr: ['नाही', 'होय, पती जास्त कमावत असल्यास', 'फक्त बेरोजगार असल्यास', 'कधीच नाही']
      },
      correctIndex: 1,
      explanation: {
        en: 'Working woman can get maintenance if husband earns substantially more.',
        hi: 'कमाने वाली महिला को भी भरण-पोषण मिल सकता है अगर पति अधिक कमाता है।',
        mr: 'कमावत्या महिलेलाही पोटगी मिळू शकते जर पती जास्त कमावत असेल.'
      }
    },
    {
      id: 'wr16',
      question: { 
        en: 'What is the punishment for acid attack?',
        hi: 'एसिड अटैक की सजा क्या है?',
        mr: 'अॅसिड हल्ल्याची शिक्षा काय आहे?'
      },
      options: {
        en: ['Up to 5 years', 'Up to 7 years', '10 years to life imprisonment', 'Fine only'],
        hi: ['5 वर्ष तक', '7 वर्ष तक', '10 वर्ष से आजीवन कारावास', 'केवल जुर्माना'],
        mr: ['5 वर्षांपर्यंत', '7 वर्षांपर्यंत', '10 वर्ष ते जन्मठेप', 'फक्त दंड']
      },
      correctIndex: 2,
      explanation: {
        en: 'Acid attack is punishable with 10 years to life imprisonment.',
        hi: 'एसिड अटैक पर 10 वर्ष से आजीवन कारावास की सजा है।',
        mr: 'अॅसिड हल्ल्यावर 10 वर्ष ते जन्मठेपेची शिक्षा आहे.'
      }
    },
    {
      id: 'wr17',
      question: { 
        en: 'Can woman travel abroad without husband\'s permission?',
        hi: 'क्या महिला पति की अनुमति के बिना विदेश यात्रा कर सकती है?',
        mr: 'महिला पतीच्या परवानगीशिवाय परदेश प्रवास करू शकते का?'
      },
      options: {
        en: ['No', 'Yes, independent right', 'Only with parent\'s permission', 'Only after 25 years age'],
        hi: ['नहीं', 'हाँ, स्वतंत्र अधिकार', 'केवल माता-पिता की अनुमति से', 'केवल 25 वर्ष के बाद'],
        mr: ['नाही', 'होय, स्वतंत्र अधिकार', 'फक्त पालकांच्या परवानगीने', 'फक्त 25 वर्षांनंतर']
      },
      correctIndex: 1,
      explanation: {
        en: 'Woman has independent right to travel, no permission needed.',
        hi: 'महिला को स्वतंत्र यात्रा का अधिकार है, अनुमति की जरूरत नहीं।',
        mr: 'महिलेला स्वतंत्र प्रवासाचा अधिकार आहे, परवानगी आवश्यक नाही.'
      }
    },
    {
      id: 'wr18',
      question: { 
        en: 'Is stalking a crime in India?',
        hi: 'क्या पीछा करना भारत में अपराध है?',
        mr: 'पाठलाग करणे भारतात गुन्हा आहे का?'
      },
      options: {
        en: ['No', 'Yes, Section 354D IPC', 'Only if physical contact', 'Only online stalking'],
        hi: ['नहीं', 'हाँ, धारा 354D IPC', 'केवल शारीरिक संपर्क होने पर', 'केवल ऑनलाइन पीछा'],
        mr: ['नाही', 'होय, कलम 354D IPC', 'फक्त शारीरिक संपर्क असल्यास', 'फक्त ऑनलाइन पाठलाग']
      },
      correctIndex: 1,
      explanation: {
        en: 'Stalking is a crime under Section 354D IPC with up to 5 years imprisonment.',
        hi: 'पीछा करना धारा 354D IPC के तहत 5 वर्ष तक की सजा वाला अपराध है।',
        mr: 'पाठलाग करणे कलम 354D IPC अंतर्गत 5 वर्षांपर्यंत शिक्षेचा गुन्हा आहे.'
      }
    },
    {
      id: 'wr19',
      question: { 
        en: 'What is ICC under POSH Act?',
        hi: 'POSH अधिनियम के तहत ICC क्या है?',
        mr: 'POSH कायद्यांतर्गत ICC म्हणजे काय?'
      },
      options: {
        en: ['Indian Cricket Council', 'Internal Complaints Committee', 'Independent Crime Cell', 'Investigation Control Center'],
        hi: ['इंडियन क्रिकेट काउंसिल', 'आंतरिक शिकायत समिति', 'स्वतंत्र अपराध प्रकोष्ठ', 'जांच नियंत्रण केंद्र'],
        mr: ['इंडियन क्रिकेट कौन्सिल', 'अंतर्गत तक्रार समिती', 'स्वतंत्र गुन्हा कक्ष', 'तपास नियंत्रण केंद्र']
      },
      correctIndex: 1,
      explanation: {
        en: 'ICC is Internal Complaints Committee mandatory under POSH Act.',
        hi: 'ICC आंतरिक शिकायत समिति है जो POSH अधिनियम के तहत अनिवार्य है।',
        mr: 'ICC अंतर्गत तक्रार समिती आहे जी POSH कायद्यांतर्गत अनिवार्य आहे.'
      }
    },
    {
      id: 'wr20',
      question: { 
        en: 'Can daughter inherit ancestral property equally?',
        hi: 'क्या बेटी को पैतृक संपत्ति में बराबर हिस्सा मिलता है?',
        mr: 'मुलीला वडिलोपार्जित संपत्तीत समान वाटा मिळतो का?'
      },
      options: {
        en: ['No', 'Yes, after 2005 amendment', 'Only if no sons', 'Only married daughters'],
        hi: ['नहीं', 'हाँ, 2005 संशोधन के बाद', 'केवल अगर बेटे न हों', 'केवल विवाहित बेटियां'],
        mr: ['नाही', 'होय, 2005 च्या सुधारणेनंतर', 'फक्त मुलगे नसल्यास', 'फक्त विवाहित मुली']
      },
      correctIndex: 1,
      explanation: {
        en: 'After 2005 Hindu Succession Act amendment, daughters have equal rights.',
        hi: '2005 के हिंदू उत्तराधिकार अधिनियम संशोधन के बाद बेटियों को बराबर अधिकार है।',
        mr: '2005 च्या हिंदू उत्तराधिकार कायदा सुधारणेनंतर मुलींना समान अधिकार आहेत.'
      }
    }
  ],
  police_rights: [
    {
      id: 'pr1',
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
        en: 'Zero FIR can be filed at any police station.',
        hi: 'जीरो FIR किसी भी पुलिस स्टेशन पर दर्ज की जा सकती है।',
        mr: 'झिरो FIR कोणत्याही पोलीस स्टेशनवर दाखल करता येते.'
      }
    },
    {
      id: 'pr2',
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
        en: 'Generally, warrant needed for night arrest except emergencies.',
        hi: 'आम तौर पर रात में गिरफ्तारी के लिए वारंट जरूरी है।',
        mr: 'सामान्यतः रात्री अटकेसाठी वॉरंट आवश्यक आहे.'
      }
    },
    {
      id: 'pr3',
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
        en: 'Complain to NHRC at nhrc.nic.in or call 14433.',
        hi: 'NHRC में nhrc.nic.in पर या 14433 पर शिकायत करें।',
        mr: 'NHRC मध्ये nhrc.nic.in वर किंवा 14433 वर तक्रार करा.'
      }
    },
    {
      id: 'pr4',
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
        en: 'Getting FIR copy is your legal right and is free.',
        hi: 'FIR की कॉपी पाना आपका कानूनी अधिकार है और मुफ्त है।',
        mr: 'FIR ची प्रत मिळवणे तुमचा अधिकार आहे आणि मोफत आहे.'
      }
    },
    {
      id: 'pr5',
      question: { 
        en: 'Can police handcuff an arrested person?',
        hi: 'क्या पुलिस गिरफ्तार व्यक्ति को हथकड़ी लगा सकती है?',
        mr: 'पोलीस अटक केलेल्या व्यक्तीला हातकड्या लावू शकतात का?'
      },
      options: {
        en: ['Yes, always', 'No, never', 'Only for dangerous criminals', 'Only with court order'],
        hi: ['हाँ, हमेशा', 'नहीं, कभी नहीं', 'केवल खतरनाक अपराधियों के लिए', 'केवल कोर्ट आदेश से'],
        mr: ['होय, नेहमी', 'नाही, कधीच नाही', 'फक्त धोकादायक गुन्हेगारांसाठी', 'फक्त न्यायालयाच्या आदेशाने']
      },
      correctIndex: 2,
      explanation: {
        en: 'Handcuffing is allowed only for dangerous criminals or flight risk.',
        hi: 'हथकड़ी केवल खतरनाक अपराधियों या भागने के जोखिम पर लगाई जा सकती है।',
        mr: 'हातकड्या फक्त धोकादायक गुन्हेगार किंवा पळून जाण्याचा धोका असल्यास लावता येतात.'
      }
    },
    {
      id: 'pr6',
      question: { 
        en: 'What is the emergency helpline number?',
        hi: 'आपातकालीन हेल्पलाइन नंबर क्या है?',
        mr: 'आणीबाणी हेल्पलाइन नंबर कोणता आहे?'
      },
      options: {
        en: ['100', '101', '112', '108'],
        hi: ['100', '101', '112', '108'],
        mr: ['100', '101', '112', '108']
      },
      correctIndex: 2,
      explanation: {
        en: '112 is the single emergency number for police, fire, ambulance.',
        hi: '112 पुलिस, फायर, एम्बुलेंस के लिए एकल आपातकालीन नंबर है।',
        mr: '112 पोलीस, अग्निशमन, रुग्णवाहिकेसाठी एकच आणीबाणी नंबर आहे.'
      }
    },
    {
      id: 'pr7',
      question: { 
        en: 'Can police search your house without warrant?',
        hi: 'क्या पुलिस बिना वारंट आपके घर की तलाशी ले सकती है?',
        mr: 'पोलीस वॉरंटशिवाय तुमच्या घराची झडती घेऊ शकतात का?'
      },
      options: {
        en: ['Yes, anytime', 'No, warrant required', 'Only in emergency/hot pursuit', 'Only during day'],
        hi: ['हाँ, कभी भी', 'नहीं, वारंट जरूरी', 'केवल आपातकाल/पीछा में', 'केवल दिन में'],
        mr: ['होय, कधीही', 'नाही, वॉरंट आवश्यक', 'फक्त आणीबाणी/पाठलाग', 'फक्त दिवसा']
      },
      correctIndex: 2,
      explanation: {
        en: 'Search without warrant allowed only in emergency or hot pursuit.',
        hi: 'बिना वारंट तलाशी केवल आपातकाल या पीछा में हो सकती है।',
        mr: 'वॉरंटशिवाय झडती फक्त आणीबाणी किंवा पाठलागात घेता येते.'
      }
    },
    {
      id: 'pr8',
      question: { 
        en: 'Within what time must police produce arrested person before magistrate?',
        hi: 'पुलिस को गिरफ्तार व्यक्ति को कितने समय में मजिस्ट्रेट के सामने पेश करना होता है?',
        mr: 'पोलिसांनी अटक केलेल्या व्यक्तीला किती वेळात मॅजिस्ट्रेटसमोर हजर करावे?'
      },
      options: {
        en: ['12 hours', '24 hours', '48 hours', '72 hours'],
        hi: ['12 घंटे', '24 घंटे', '48 घंटे', '72 घंटे'],
        mr: ['12 तास', '24 तास', '48 तास', '72 तास']
      },
      correctIndex: 1,
      explanation: {
        en: 'Under Article 22, must be produced within 24 hours.',
        hi: 'अनुच्छेद 22 के तहत 24 घंटे के भीतर पेश करना होता है।',
        mr: 'कलम 22 अंतर्गत 24 तासांच्या आत हजर करावे लागते.'
      }
    },
    {
      id: 'pr9',
      question: { 
        en: 'What is anticipatory bail?',
        hi: 'अग्रिम जमानत क्या है?',
        mr: 'अग्रिम जामीन म्हणजे काय?'
      },
      options: {
        en: ['Bail after arrest', 'Bail before arrest', 'Bail during trial', 'Bail after conviction'],
        hi: ['गिरफ्तारी के बाद जमानत', 'गिरफ्तारी से पहले जमानत', 'ट्रायल के दौरान जमानत', 'दोषसिद्धि के बाद जमानत'],
        mr: ['अटकेनंतर जामीन', 'अटकेआधी जामीन', 'खटल्यादरम्यान जामीन', 'दोषसिद्धीनंतर जामीन']
      },
      correctIndex: 1,
      explanation: {
        en: 'Anticipatory bail is sought before arrest under Section 438 CrPC.',
        hi: 'अग्रिम जमानत गिरफ्तारी से पहले धारा 438 CrPC के तहत ली जाती है।',
        mr: 'अग्रिम जामीन अटकेआधी कलम 438 CrPC अंतर्गत घेतला जातो.'
      }
    },
    {
      id: 'pr10',
      question: { 
        en: 'Can a woman be arrested after sunset?',
        hi: 'क्या महिला को सूर्यास्त के बाद गिरफ्तार किया जा सकता है?',
        mr: 'सूर्यास्तानंतर महिलेला अटक करता येते का?'
      },
      options: {
        en: ['Yes, anytime', 'No, only sunrise to sunset', 'Only with magistrate permission', 'Only by female officer'],
        hi: ['हाँ, कभी भी', 'नहीं, केवल सूर्योदय से सूर्यास्त', 'केवल मजिस्ट्रेट अनुमति से', 'केवल महिला अधिकारी द्वारा'],
        mr: ['होय, कधीही', 'नाही, फक्त सूर्योदय ते सूर्यास्त', 'फक्त मॅजिस्ट्रेट परवानगीने', 'फक्त महिला अधिकाऱ्याद्वारे']
      },
      correctIndex: 2,
      explanation: {
        en: 'Woman arrest after sunset requires magistrate\'s written permission.',
        hi: 'सूर्यास्त के बाद महिला गिरफ्तारी के लिए मजिस्ट्रेट की लिखित अनुमति चाहिए।',
        mr: 'सूर्यास्तानंतर महिला अटकेसाठी मॅजिस्ट्रेटची लेखी परवानगी आवश्यक आहे.'
      }
    },
    {
      id: 'pr11',
      question: { 
        en: 'Can you refuse to sign blank paper at police station?',
        hi: 'क्या आप पुलिस स्टेशन में खाली कागज पर हस्ताक्षर करने से मना कर सकते हैं?',
        mr: 'तुम्ही पोलीस स्टेशनमध्ये रिकाम्या कागदावर सही करण्यास नकार देऊ शकता का?'
      },
      options: {
        en: ['No, must sign', 'Yes, absolutely', 'Only with lawyer', 'Depends on case'],
        hi: ['नहीं, साइन करना होगा', 'हाँ, बिल्कुल', 'केवल वकील के साथ', 'केस पर निर्भर'],
        mr: ['नाही, सही करावी लागेल', 'होय, नक्कीच', 'फक्त वकिलासह', 'केसवर अवलंबून']
      },
      correctIndex: 1,
      explanation: {
        en: 'Never sign blank paper. It\'s your right to refuse.',
        hi: 'खाली कागज पर कभी हस्ताक्षर न करें। यह आपका अधिकार है।',
        mr: 'कधीही रिकाम्या कागदावर सही करू नका. हा तुमचा अधिकार आहे.'
      }
    },
    {
      id: 'pr12',
      question: { 
        en: 'What is cognizable offence?',
        hi: 'संज्ञेय अपराध क्या है?',
        mr: 'दखलपात्र गुन्हा म्हणजे काय?'
      },
      options: {
        en: ['Minor offence', 'Offence where police can arrest without warrant', 'Offence with less than 1 year punishment', 'Offence needing court order'],
        hi: ['छोटा अपराध', 'जहां पुलिस बिना वारंट गिरफ्तार कर सकती है', '1 वर्ष से कम सजा वाला', 'कोर्ट आदेश जरूरी'],
        mr: ['किरकोळ गुन्हा', 'पोलीस वॉरंटशिवाय अटक करू शकतात', '1 वर्षांपेक्षा कमी शिक्षेचा', 'न्यायालयाचा आदेश आवश्यक']
      },
      correctIndex: 1,
      explanation: {
        en: 'Cognizable offence allows arrest without warrant.',
        hi: 'संज्ञेय अपराध में बिना वारंट गिरफ्तारी हो सकती है।',
        mr: 'दखलपात्र गुन्ह्यात वॉरंटशिवाय अटक होऊ शकते.'
      }
    },
    {
      id: 'pr13',
      question: { 
        en: 'Can you record police conversation on phone?',
        hi: 'क्या आप पुलिस से बातचीत फोन पर रिकॉर्ड कर सकते हैं?',
        mr: 'तुम्ही पोलिसांशी संभाषण फोनवर रेकॉर्ड करू शकता का?'
      },
      options: {
        en: ['No, illegal', 'Yes, legal', 'Only with permission', 'Only in court'],
        hi: ['नहीं, गैरकानूनी', 'हाँ, कानूनी', 'केवल अनुमति से', 'केवल कोर्ट में'],
        mr: ['नाही, बेकायदेशीर', 'होय, कायदेशीर', 'फक्त परवानगीने', 'फक्त न्यायालयात']
      },
      correctIndex: 1,
      explanation: {
        en: 'Recording public officials during duty is legal.',
        hi: 'ड्यूटी पर सरकारी अधिकारियों को रिकॉर्ड करना कानूनी है।',
        mr: 'कर्तव्यावर असताना सरकारी अधिकाऱ्यांना रेकॉर्ड करणे कायदेशीर आहे.'
      }
    },
    {
      id: 'pr14',
      question: { 
        en: 'What is the right to silence?',
        hi: 'मौन रहने का अधिकार क्या है?',
        mr: 'मौन राहण्याचा अधिकार म्हणजे काय?'
      },
      options: {
        en: ['Right to not speak to anyone', 'Right to not answer self-incriminating questions', 'Right to ignore police', 'Right to not attend court'],
        hi: ['किसी से न बोलने का अधिकार', 'स्वयं के खिलाफ गवाही न देने का अधिकार', 'पुलिस को नजरअंदाज करने का अधिकार', 'कोर्ट न जाने का अधिकार'],
        mr: ['कोणाशीही न बोलण्याचा अधिकार', 'स्वतःविरुद्ध साक्ष न देण्याचा अधिकार', 'पोलिसांना दुर्लक्षित करण्याचा अधिकार', 'न्यायालयात न जाण्याचा अधिकार']
      },
      correctIndex: 1,
      explanation: {
        en: 'Right to silence means right against self-incrimination (Article 20).',
        hi: 'मौन रहने का अधिकार स्वयं के खिलाफ गवाही न देने का अधिकार है।',
        mr: 'मौन राहण्याचा अधिकार स्वतःविरुद्ध साक्ष न देण्याचा अधिकार आहे.'
      }
    },
    {
      id: 'pr15',
      question: { 
        en: 'Can police take your phone without warrant?',
        hi: 'क्या पुलिस बिना वारंट आपका फोन ले सकती है?',
        mr: 'पोलीस वॉरंटशिवाय तुमचा फोन घेऊ शकतात का?'
      },
      options: {
        en: ['Yes, anytime', 'No, warrant needed', 'Only during arrest', 'Only for checking'],
        hi: ['हाँ, कभी भी', 'नहीं, वारंट जरूरी', 'केवल गिरफ्तारी में', 'केवल जांच के लिए'],
        mr: ['होय, कधीही', 'नाही, वॉरंट आवश्यक', 'फक्त अटकेदरम्यान', 'फक्त तपासणीसाठी']
      },
      correctIndex: 2,
      explanation: {
        en: 'During lawful arrest, police can seize phone as evidence.',
        hi: 'कानूनी गिरफ्तारी के दौरान पुलिस फोन जब्त कर सकती है।',
        mr: 'कायदेशीर अटकेदरम्यान पोलीस फोन जप्त करू शकतात.'
      }
    },
    {
      id: 'pr16',
      question: { 
        en: 'What is FIR?',
        hi: 'FIR क्या है?',
        mr: 'FIR म्हणजे काय?'
      },
      options: {
        en: ['Final Investigation Report', 'First Information Report', 'First Investigation Record', 'Final Information Report'],
        hi: ['अंतिम जांच रिपोर्ट', 'प्रथम सूचना रिपोर्ट', 'प्रथम जांच रिकॉर्ड', 'अंतिम सूचना रिपोर्ट'],
        mr: ['अंतिम तपास अहवाल', 'प्रथम माहिती अहवाल', 'प्रथम तपास नोंद', 'अंतिम माहिती अहवाल']
      },
      correctIndex: 1,
      explanation: {
        en: 'FIR is First Information Report about a cognizable offence.',
        hi: 'FIR प्रथम सूचना रिपोर्ट है जो संज्ञेय अपराध के बारे में होती है।',
        mr: 'FIR प्रथम माहिती अहवाल आहे जो दखलपात्र गुन्ह्याबद्दल असतो.'
      }
    },
    {
      id: 'pr17',
      question: { 
        en: 'Can police deny to register FIR?',
        hi: 'क्या पुलिस FIR दर्ज करने से मना कर सकती है?',
        mr: 'पोलीस FIR नोंदवण्यास नकार देऊ शकतात का?'
      },
      options: {
        en: ['Yes, if minor case', 'Yes, if busy', 'No, must register', 'Depends on officer'],
        hi: ['हाँ, अगर छोटा केस', 'हाँ, अगर व्यस्त', 'नहीं, दर्ज करना होगा', 'अधिकारी पर निर्भर'],
        mr: ['होय, किरकोळ केस असल्यास', 'होय, व्यस्त असल्यास', 'नाही, नोंदवावी लागेल', 'अधिकाऱ्यावर अवलंबून']
      },
      correctIndex: 2,
      explanation: {
        en: 'Police must register FIR for cognizable offence. Refusal is punishable.',
        hi: 'पुलिस को संज्ञेय अपराध में FIR दर्ज करना होता है। मना करना दंडनीय है।',
        mr: 'पोलिसांना दखलपात्र गुन्ह्यात FIR नोंदवावी लागते. नकार देणे शिक्षापात्र आहे.'
      }
    },
    {
      id: 'pr18',
      question: { 
        en: 'What is police remand?',
        hi: 'पुलिस रिमांड क्या है?',
        mr: 'पोलीस रिमांड म्हणजे काय?'
      },
      options: {
        en: ['Keeping accused in jail', 'Keeping accused with police for investigation', 'Releasing accused', 'Transferring accused'],
        hi: ['आरोपी को जेल में रखना', 'जांच के लिए आरोपी को पुलिस के पास रखना', 'आरोपी को छोड़ना', 'आरोपी को स्थानांतरित करना'],
        mr: ['आरोपीला तुरुंगात ठेवणे', 'तपासासाठी आरोपीला पोलिसांकडे ठेवणे', 'आरोपीला सोडणे', 'आरोपीला हस्तांतरित करणे']
      },
      correctIndex: 1,
      explanation: {
        en: 'Police remand is custody with police for investigation.',
        hi: 'पुलिस रिमांड जांच के लिए पुलिस हिरासत है।',
        mr: 'पोलीस रिमांड तपासासाठी पोलीस कोठडी आहे.'
      }
    },
    {
      id: 'pr19',
      question: { 
        en: 'Maximum days of police custody?',
        hi: 'पुलिस हिरासत के अधिकतम दिन?',
        mr: 'पोलीस कोठडीचे जास्तीत जास्त दिवस?'
      },
      options: {
        en: ['7 days', '15 days', '30 days', '60 days'],
        hi: ['7 दिन', '15 दिन', '30 दिन', '60 दिन'],
        mr: ['7 दिवस', '15 दिवस', '30 दिवस', '60 दिवस']
      },
      correctIndex: 1,
      explanation: {
        en: 'Maximum police custody is 15 days, then judicial custody.',
        hi: 'अधिकतम पुलिस हिरासत 15 दिन है, उसके बाद न्यायिक हिरासत।',
        mr: 'जास्तीत जास्त पोलीस कोठडी 15 दिवस, त्यानंतर न्यायालयीन कोठडी.'
      }
    },
    {
      id: 'pr20',
      question: { 
        en: 'What is bail as a right?',
        hi: 'अधिकार के रूप में जमानत क्या है?',
        mr: 'अधिकार म्हणून जामीन म्हणजे काय?'
      },
      options: {
        en: ['Bail for any offence', 'Bail for bailable offence', 'Bail only for rich', 'No such right'],
        hi: ['किसी भी अपराध के लिए जमानत', 'जमानती अपराध के लिए जमानत', 'केवल अमीरों के लिए', 'ऐसा कोई अधिकार नहीं'],
        mr: ['कोणत्याही गुन्ह्यासाठी जामीन', 'जामीनपात्र गुन्ह्यासाठी जामीन', 'फक्त श्रीमंतांसाठी', 'असा अधिकार नाही']
      },
      correctIndex: 1,
      explanation: {
        en: 'For bailable offences, bail is a matter of right.',
        hi: 'जमानती अपराधों में जमानत अधिकार का मामला है।',
        mr: 'जामीनपात्र गुन्ह्यांमध्ये जामीन अधिकाराची बाब आहे.'
      }
    }
  ],
  rti_rights: [
    {
      id: 'rti1',
      question: { en: 'In which year was the RTI Act enacted?', hi: 'RTI अधिनियम किस वर्ष लागू हुआ?', mr: 'RTI कायदा कोणत्या वर्षी लागू झाला?' },
      options: { en: ['2000', '2005', '2010', '2015'], hi: ['2000', '2005', '2010', '2015'], mr: ['2000', '2005', '2010', '2015'] },
      correctIndex: 1,
      explanation: { en: 'RTI Act was enacted in 2005 to promote transparency.', hi: 'RTI अधिनियम 2005 में पारदर्शिता को बढ़ावा देने के लिए लागू हुआ।', mr: 'RTI कायदा 2005 मध्ये पारदर्शकता वाढवण्यासाठी लागू झाला.' }
    },
    {
      id: 'rti2',
      question: { en: 'What is the fee for filing an RTI application?', hi: 'RTI आवेदन दाखिल करने की फीस क्या है?', mr: 'RTI अर्ज दाखल करण्याचे शुल्क किती आहे?' },
      options: { en: ['Rs 5', 'Rs 10', 'Rs 50', 'Rs 100'], hi: ['Rs 5', 'Rs 10', 'Rs 50', 'Rs 100'], mr: ['Rs 5', 'Rs 10', 'Rs 50', 'Rs 100'] },
      correctIndex: 1,
      explanation: { en: 'RTI application fee is Rs 10 for central government departments.', hi: 'केंद्र सरकार विभागों के लिए RTI आवेदन शुल्क Rs 10 है।', mr: 'केंद्र सरकार विभागांसाठी RTI अर्ज शुल्क Rs 10 आहे.' }
    },
    {
      id: 'rti3',
      question: { en: 'Within how many days must PIO respond to RTI?', hi: 'PIO को कितने दिनों में RTI का जवाब देना होगा?', mr: 'PIO ला किती दिवसांत RTI ला उत्तर द्यावे लागते?' },
      options: { en: ['15 days', '30 days', '45 days', '60 days'], hi: ['15 दिन', '30 दिन', '45 दिन', '60 दिन'], mr: ['15 दिवस', '30 दिवस', '45 दिवस', '60 दिवस'] },
      correctIndex: 1,
      explanation: { en: 'PIO must respond within 30 days of receiving the application.', hi: 'PIO को आवेदन मिलने के 30 दिनों के भीतर जवाब देना होगा।', mr: 'PIO ला अर्ज मिळाल्यापासून 30 दिवसांच्या आत उत्तर द्यावे लागते.' }
    },
    {
      id: 'rti4',
      question: { en: 'Who is exempt from RTI application fee?', hi: 'RTI आवेदन शुल्क से कौन मुक्त है?', mr: 'RTI अर्ज शुल्कातून कोण मुक्त आहे?' },
      options: { en: ['Senior citizens', 'BPL card holders', 'Students', 'Women'], hi: ['वरिष्ठ नागरिक', 'BPL कार्ड धारक', 'छात्र', 'महिलाएं'], mr: ['ज्येष्ठ नागरिक', 'BPL कार्डधारक', 'विद्यार्थी', 'महिला'] },
      correctIndex: 1,
      explanation: { en: 'BPL card holders are exempt from paying RTI fee.', hi: 'BPL कार्ड धारक RTI शुल्क से मुक्त हैं।', mr: 'BPL कार्डधारक RTI शुल्कातून मुक्त आहेत.' }
    },
    {
      id: 'rti5',
      question: { en: 'What does PIO stand for?', hi: 'PIO का पूर्ण रूप क्या है?', mr: 'PIO चा पूर्ण अर्थ काय आहे?' },
      options: { en: ['Public Information Officer', 'Private Information Officer', 'Primary Information Officer', 'Principal Information Officer'], hi: ['जन सूचना अधिकारी', 'निजी सूचना अधिकारी', 'प्राथमिक सूचना अधिकारी', 'प्रधान सूचना अधिकारी'], mr: ['जन माहिती अधिकारी', 'खाजगी माहिती अधिकारी', 'प्राथमिक माहिती अधिकारी', 'प्रमुख माहिती अधिकारी'] },
      correctIndex: 0,
      explanation: { en: 'PIO stands for Public Information Officer.', hi: 'PIO का अर्थ जन सूचना अधिकारी है।', mr: 'PIO म्हणजे जन माहिती अधिकारी.' }
    },
    {
      id: 'rti6',
      question: { en: 'Within how many days can you file first appeal?', hi: 'पहली अपील कितने दिनों में दायर कर सकते हैं?', mr: 'पहिली अपील किती दिवसांत दाखल करता येते?' },
      options: { en: ['15 days', '30 days', '45 days', '60 days'], hi: ['15 दिन', '30 दिन', '45 दिन', '60 दिन'], mr: ['15 दिवस', '30 दिवस', '45 दिवस', '60 दिवस'] },
      correctIndex: 1,
      explanation: { en: 'First appeal can be filed within 30 days of receiving response.', hi: 'जवाब मिलने के 30 दिनों के भीतर पहली अपील दायर कर सकते हैं।', mr: 'उत्तर मिळाल्यापासून 30 दिवसांच्या आत पहिली अपील दाखल करता येते.' }
    },
    {
      id: 'rti7',
      question: { en: 'What is CIC in RTI context?', hi: 'RTI संदर्भ में CIC क्या है?', mr: 'RTI संदर्भात CIC म्हणजे काय?' },
      options: { en: ['Central Information Commission', 'Central Investigation Committee', 'Chief Information Controller', 'Central Inquiry Court'], hi: ['केंद्रीय सूचना आयोग', 'केंद्रीय जांच समिति', 'मुख्य सूचना नियंत्रक', 'केंद्रीय जांच न्यायालय'], mr: ['केंद्रीय माहिती आयोग', 'केंद्रीय तपास समिती', 'मुख्य माहिती नियंत्रक', 'केंद्रीय तपास न्यायालय'] },
      correctIndex: 0,
      explanation: { en: 'CIC is Central Information Commission for second appeals.', hi: 'CIC केंद्रीय सूचना आयोग है दूसरी अपील के लिए।', mr: 'CIC म्हणजे दुसऱ्या अपीलसाठी केंद्रीय माहिती आयोग.' }
    },
    {
      id: 'rti8',
      question: { en: 'What penalty can be imposed on PIO for delay?', hi: 'देरी के लिए PIO पर क्या जुर्माना लगाया जा सकता है?', mr: 'विलंबासाठी PIO वर कोणता दंड आकारला जाऊ शकतो?' },
      options: { en: ['Rs 100/day', 'Rs 250/day', 'Rs 500/day', 'Rs 1000/day'], hi: ['Rs 100/दिन', 'Rs 250/दिन', 'Rs 500/दिन', 'Rs 1000/दिन'], mr: ['Rs 100/दिवस', 'Rs 250/दिवस', 'Rs 500/दिवस', 'Rs 1000/दिवस'] },
      correctIndex: 1,
      explanation: { en: 'PIO can be fined Rs 250 per day for delay, up to Rs 25,000.', hi: 'देरी के लिए PIO पर Rs 250 प्रति दिन, अधिकतम Rs 25,000 जुर्माना।', mr: 'विलंबासाठी PIO वर Rs 250 प्रति दिवस, कमाल Rs 25,000 दंड.' }
    },
    {
      id: 'rti9',
      question: { en: 'Which information is exempt from RTI?', hi: 'कौन सी जानकारी RTI से मुक्त है?', mr: 'कोणती माहिती RTI मधून मुक्त आहे?' },
      options: { en: ['Salary details', 'National security matters', 'Government expenses', 'Project costs'], hi: ['वेतन विवरण', 'राष्ट्रीय सुरक्षा मामले', 'सरकारी खर्च', 'परियोजना लागत'], mr: ['वेतन तपशील', 'राष्ट्रीय सुरक्षा बाबी', 'सरकारी खर्च', 'प्रकल्प खर्च'] },
      correctIndex: 1,
      explanation: { en: 'National security related information is exempt under Section 8.', hi: 'राष्ट्रीय सुरक्षा संबंधी जानकारी धारा 8 के तहत मुक्त है।', mr: 'राष्ट्रीय सुरक्षा संबंधित माहिती कलम 8 अंतर्गत मुक्त आहे.' }
    },
    {
      id: 'rti10',
      question: { en: 'Can RTI be filed online?', hi: 'क्या RTI ऑनलाइन दाखिल हो सकता है?', mr: 'RTI ऑनलाइन दाखल करता येतो का?' },
      options: { en: ['No, only offline', 'Yes, at rtionline.gov.in', 'Only for central govt', 'Only for state govt'], hi: ['नहीं, केवल ऑफलाइन', 'हां, rtionline.gov.in पर', 'केवल केंद्र सरकार के लिए', 'केवल राज्य सरकार के लिए'], mr: ['नाही, फक्त ऑफलाइन', 'हो, rtionline.gov.in वर', 'फक्त केंद्र सरकारसाठी', 'फक्त राज्य सरकारसाठी'] },
      correctIndex: 1,
      explanation: { en: 'RTI can be filed online at rtionline.gov.in for central ministries.', hi: 'केंद्रीय मंत्रालयों के लिए RTI rtionline.gov.in पर ऑनलाइन दाखिल हो सकता है।', mr: 'केंद्रीय मंत्रालयांसाठी RTI rtionline.gov.in वर ऑनलाइन दाखल करता येतो.' }
    },
    {
      id: 'rti11',
      question: { en: 'Life-threatening info must be given within?', hi: 'जीवन के लिए खतरनाक जानकारी कितने समय में देनी होगी?', mr: 'जीवघेणी माहिती किती वेळात द्यावी लागते?' },
      options: { en: ['24 hours', '48 hours', '72 hours', '7 days'], hi: ['24 घंटे', '48 घंटे', '72 घंटे', '7 दिन'], mr: ['24 तास', '48 तास', '72 तास', '7 दिवस'] },
      correctIndex: 1,
      explanation: { en: 'Information concerning life/liberty must be provided within 48 hours.', hi: 'जीवन/स्वतंत्रता से संबंधित जानकारी 48 घंटे में देनी होगी।', mr: 'जीवन/स्वातंत्र्य संबंधित माहिती 48 तासांत द्यावी लागते.' }
    },
    {
      id: 'rti12',
      question: { en: 'What is the maximum penalty on PIO?', hi: 'PIO पर अधिकतम जुर्माना क्या है?', mr: 'PIO वर कमाल दंड किती आहे?' },
      options: { en: ['Rs 10,000', 'Rs 25,000', 'Rs 50,000', 'Rs 1,00,000'], hi: ['Rs 10,000', 'Rs 25,000', 'Rs 50,000', 'Rs 1,00,000'], mr: ['Rs 10,000', 'Rs 25,000', 'Rs 50,000', 'Rs 1,00,000'] },
      correctIndex: 1,
      explanation: { en: 'Maximum penalty on PIO is Rs 25,000.', hi: 'PIO पर अधिकतम जुर्माना Rs 25,000 है।', mr: 'PIO वर कमाल दंड Rs 25,000 आहे.' }
    },
    {
      id: 'rti13',
      question: { en: 'Who appoints Chief Information Commissioner?', hi: 'मुख्य सूचना आयुक्त की नियुक्ति कौन करता है?', mr: 'मुख्य माहिती आयुक्तांची नियुक्ती कोण करते?' },
      options: { en: ['Prime Minister', 'President', 'Parliament', 'Supreme Court'], hi: ['प्रधानमंत्री', 'राष्ट्रपति', 'संसद', 'सुप्रीम कोर्ट'], mr: ['पंतप्रधान', 'राष्ट्रपती', 'संसद', 'सर्वोच्च न्यायालय'] },
      correctIndex: 1,
      explanation: { en: 'President appoints CIC on recommendation of committee.', hi: 'राष्ट्रपति समिति की सिफारिश पर CIC की नियुक्ति करते हैं।', mr: 'राष्ट्रपती समितीच्या शिफारशीवरून CIC ची नियुक्ती करतात.' }
    },
    {
      id: 'rti14',
      question: { en: 'How many sections are in RTI Act?', hi: 'RTI अधिनियम में कितनी धाराएं हैं?', mr: 'RTI कायद्यात किती कलमे आहेत?' },
      options: { en: ['21', '25', '31', '35'], hi: ['21', '25', '31', '35'], mr: ['21', '25', '31', '35'] },
      correctIndex: 2,
      explanation: { en: 'RTI Act 2005 has 31 sections.', hi: 'RTI अधिनियम 2005 में 31 धाराएं हैं।', mr: 'RTI कायदा 2005 मध्ये 31 कलमे आहेत.' }
    },
    {
      id: 'rti15',
      question: { en: 'RTI applies to which organizations?', hi: 'RTI किन संगठनों पर लागू है?', mr: 'RTI कोणत्या संस्थांना लागू आहे?' },
      options: { en: ['Only central govt', 'Only state govt', 'All public authorities', 'Only courts'], hi: ['केवल केंद्र सरकार', 'केवल राज्य सरकार', 'सभी सार्वजनिक प्राधिकरण', 'केवल न्यायालय'], mr: ['फक्त केंद्र सरकार', 'फक्त राज्य सरकार', 'सर्व सार्वजनिक प्राधिकरणे', 'फक्त न्यायालये'] },
      correctIndex: 2,
      explanation: { en: 'RTI applies to all public authorities receiving government funding.', hi: 'RTI सरकारी फंडिंग पाने वाले सभी सार्वजनिक प्राधिकरणों पर लागू है।', mr: 'RTI सरकारी निधी मिळवणाऱ्या सर्व सार्वजनिक प्राधिकरणांना लागू आहे.' }
    },
    {
      id: 'rti16',
      question: { en: 'Second appeal is filed with?', hi: 'दूसरी अपील कहां दायर होती है?', mr: 'दुसरी अपील कुठे दाखल होते?' },
      options: { en: ['PIO', 'First Appellate Authority', 'Information Commission', 'High Court'], hi: ['PIO', 'प्रथम अपीलीय प्राधिकरण', 'सूचना आयोग', 'उच्च न्यायालय'], mr: ['PIO', 'प्रथम अपील प्राधिकरण', 'माहिती आयोग', 'उच्च न्यायालय'] },
      correctIndex: 2,
      explanation: { en: 'Second appeal goes to Central/State Information Commission.', hi: 'दूसरी अपील केंद्रीय/राज्य सूचना आयोग में जाती है।', mr: 'दुसरी अपील केंद्रीय/राज्य माहिती आयोगाकडे जाते.' }
    },
    {
      id: 'rti17',
      question: { en: 'Section 4 of RTI mandates what?', hi: 'RTI की धारा 4 क्या अनिवार्य करती है?', mr: 'RTI चे कलम 4 काय अनिवार्य करते?' },
      options: { en: ['Fee payment', 'Suo motu disclosure', 'Appeals process', 'Penalties'], hi: ['शुल्क भुगतान', 'स्वप्रेरित प्रकटीकरण', 'अपील प्रक्रिया', 'दंड'], mr: ['शुल्क भरणा', 'स्वयं प्रकटीकरण', 'अपील प्रक्रिया', 'दंड'] },
      correctIndex: 1,
      explanation: { en: 'Section 4 mandates proactive disclosure by public authorities.', hi: 'धारा 4 सार्वजनिक प्राधिकरणों द्वारा स्वप्रेरित प्रकटीकरण अनिवार्य करती है।', mr: 'कलम 4 सार्वजनिक प्राधिकरणांद्वारे स्वयं प्रकटीकरण अनिवार्य करते.' }
    },
    {
      id: 'rti18',
      question: { en: 'Can third party information be shared?', hi: 'क्या तीसरे पक्ष की जानकारी साझा हो सकती है?', mr: 'तृतीय पक्षाची माहिती शेअर होऊ शकते का?' },
      options: { en: ['Always yes', 'Always no', 'With their consent', 'Only to courts'], hi: ['हमेशा हां', 'हमेशा नहीं', 'उनकी सहमति से', 'केवल न्यायालय को'], mr: ['नेहमी हो', 'नेहमी नाही', 'त्यांच्या संमतीने', 'फक्त न्यायालयाला'] },
      correctIndex: 2,
      explanation: { en: 'Third party info can be shared with consent or if public interest outweighs.', hi: 'तीसरे पक्ष की जानकारी सहमति से या जनहित में साझा हो सकती है।', mr: 'तृतीय पक्षाची माहिती संमतीने किंवा सार्वजनिक हित असल्यास शेअर होऊ शकते.' }
    },
    {
      id: 'rti19',
      question: { en: 'RTI Act replaced which act?', hi: 'RTI अधिनियम ने किस अधिनियम को बदला?', mr: 'RTI कायद्याने कोणता कायदा बदलला?' },
      options: { en: ['Freedom of Information Act 2002', 'Official Secrets Act', 'Evidence Act', 'No previous act'], hi: ['सूचना स्वतंत्रता अधिनियम 2002', 'राजकीय गोपनीयता अधिनियम', 'साक्ष्य अधिनियम', 'कोई पूर्व अधिनियम नहीं'], mr: ['माहिती स्वातंत्र्य कायदा 2002', 'अधिकृत गुप्तता कायदा', 'पुरावा कायदा', 'पूर्वीचा कायदा नाही'] },
      correctIndex: 0,
      explanation: { en: 'RTI Act 2005 replaced Freedom of Information Act 2002.', hi: 'RTI अधिनियम 2005 ने सूचना स्वतंत्रता अधिनियम 2002 को बदला।', mr: 'RTI कायदा 2005 ने माहिती स्वातंत्र्य कायदा 2002 बदलला.' }
    },
    {
      id: 'rti20',
      question: { en: 'Which organizations are excluded from RTI?', hi: 'कौन से संगठन RTI से बाहर हैं?', mr: 'कोणत्या संस्था RTI मधून वगळल्या आहेत?' },
      options: { en: ['Schools', 'Intelligence agencies', 'Hospitals', 'Banks'], hi: ['स्कूल', 'खुफिया एजेंसियां', 'अस्पताल', 'बैंक'], mr: ['शाळा', 'गुप्तचर संस्था', 'रुग्णालये', 'बँका'] },
      correctIndex: 1,
      explanation: { en: 'Intelligence and security agencies are excluded under Second Schedule.', hi: 'खुफिया और सुरक्षा एजेंसियां दूसरी अनुसूची के तहत बाहर हैं।', mr: 'गुप्तचर आणि सुरक्षा संस्था दुसऱ्या अनुसूचीनुसार वगळल्या आहेत.' }
    },
    {
      id: 'rti21',
      question: { en: 'RTI helps in promoting what?', hi: 'RTI किसे बढ़ावा देने में मदद करता है?', mr: 'RTI काय वाढवण्यास मदत करते?' },
      options: { en: ['Secrecy', 'Transparency', 'Bureaucracy', 'Delays'], hi: ['गोपनीयता', 'पारदर्शिता', 'नौकरशाही', 'विलंब'], mr: ['गोपनीयता', 'पारदर्शकता', 'नोकरशाही', 'विलंब'] },
      correctIndex: 1,
      explanation: { en: 'RTI promotes transparency and accountability in governance.', hi: 'RTI शासन में पारदर्शिता और जवाबदेही को बढ़ावा देता है।', mr: 'RTI शासनात पारदर्शकता आणि उत्तरदायित्व वाढवते.' }
    },
    {
      id: 'rti22',
      question: { en: 'Can you ask for file noting through RTI?', hi: 'क्या RTI से फाइल नोटिंग मांग सकते हैं?', mr: 'RTI द्वारे फाइल नोटिंग मागता येते का?' },
      options: { en: ['No', 'Yes', 'Only for old files', 'Only courts can'], hi: ['नहीं', 'हां', 'केवल पुरानी फाइलों के लिए', 'केवल न्यायालय कर सकते हैं'], mr: ['नाही', 'हो', 'फक्त जुन्या फाइल्ससाठी', 'फक्त न्यायालय करू शकते'] },
      correctIndex: 1,
      explanation: { en: 'File notings can be requested through RTI as per Section 2(j).', hi: 'धारा 2(j) के अनुसार RTI से फाइल नोटिंग मांगी जा सकती है।', mr: 'कलम 2(j) नुसार RTI द्वारे फाइल नोटिंग मागता येते.' }
    },
    {
      id: 'rti23',
      question: { en: 'What is APIO?', hi: 'APIO क्या है?', mr: 'APIO म्हणजे काय?' },
      options: { en: ['Assistant Public Information Officer', 'Additional Public Information Officer', 'Associate Public Information Officer', 'Auxiliary Public Information Officer'], hi: ['सहायक जन सूचना अधिकारी', 'अतिरिक्त जन सूचना अधिकारी', 'सहयोगी जन सूचना अधिकारी', 'सहायक जन सूचना अधिकारी'], mr: ['सहाय्यक जन माहिती अधिकारी', 'अतिरिक्त जन माहिती अधिकारी', 'सहयोगी जन माहिती अधिकारी', 'सहाय्यक जन माहिती अधिकारी'] },
      correctIndex: 0,
      explanation: { en: 'APIO is Assistant Public Information Officer at sub-divisional level.', hi: 'APIO उप-विभागीय स्तर पर सहायक जन सूचना अधिकारी है।', mr: 'APIO हा उप-विभागीय स्तरावरील सहाय्यक जन माहिती अधिकारी आहे.' }
    },
    {
      id: 'rti24',
      question: { en: 'RTI information can be in which form?', hi: 'RTI जानकारी किस रूप में हो सकती है?', mr: 'RTI माहिती कोणत्या स्वरूपात असू शकते?' },
      options: { en: ['Only printed', 'Only electronic', 'Any form held by authority', 'Only original documents'], hi: ['केवल मुद्रित', 'केवल इलेक्ट्रॉनिक', 'प्राधिकरण के पास कोई भी रूप', 'केवल मूल दस्तावेज'], mr: ['फक्त मुद्रित', 'फक्त इलेक्ट्रॉनिक', 'प्राधिकरणाकडील कोणतेही स्वरूप', 'फक्त मूळ दस्तऐवज'] },
      correctIndex: 2,
      explanation: { en: 'Information includes any material in any form held by public authority.', hi: 'जानकारी में सार्वजनिक प्राधिकरण के पास किसी भी रूप में सामग्री शामिल है।', mr: 'माहितीमध्ये सार्वजनिक प्राधिकरणाकडील कोणत्याही स्वरूपातील सामग्री समाविष्ट आहे.' }
    },
    {
      id: 'rti25',
      question: { en: 'Can RTI be used for personal grievance?', hi: 'क्या RTI व्यक्तिगत शिकायत के लिए उपयोग हो सकता है?', mr: 'RTI वैयक्तिक तक्रारीसाठी वापरता येतो का?' },
      options: { en: ['No, never', 'Yes, to seek information about your case', 'Only for government employees', 'Only for senior citizens'], hi: ['नहीं, कभी नहीं', 'हां, अपने मामले की जानकारी के लिए', 'केवल सरकारी कर्मचारियों के लिए', 'केवल वरिष्ठ नागरिकों के लिए'], mr: ['नाही, कधीच नाही', 'हो, तुमच्या प्रकरणाची माहिती मिळवण्यासाठी', 'फक्त सरकारी कर्मचाऱ्यांसाठी', 'फक्त ज्येष्ठ नागरिकांसाठी'] },
      correctIndex: 1,
      explanation: { en: 'RTI can be used to seek information about status of your applications.', hi: 'RTI का उपयोग अपने आवेदनों की स्थिति जानने के लिए किया जा सकता है।', mr: 'RTI तुमच्या अर्जांच्या स्थितीची माहिती मिळवण्यासाठी वापरता येतो.' }
    }
  ],
  cyber_rights: [
    {
      id: 'cyber1',
      question: { en: 'Which act governs cyber crimes in India?', hi: 'भारत में साइबर अपराधों को कौन सा अधिनियम नियंत्रित करता है?', mr: 'भारतात सायबर गुन्हे कोणता कायदा नियंत्रित करतो?' },
      options: { en: ['IT Act 2000', 'IPC 1860', 'CrPC 1973', 'Evidence Act'], hi: ['IT अधिनियम 2000', 'IPC 1860', 'CrPC 1973', 'साक्ष्य अधिनियम'], mr: ['IT कायदा 2000', 'IPC 1860', 'CrPC 1973', 'पुरावा कायदा'] },
      correctIndex: 0,
      explanation: { en: 'IT Act 2000 is the primary law for cyber crimes in India.', hi: 'IT अधिनियम 2000 भारत में साइबर अपराधों के लिए प्राथमिक कानून है।', mr: 'IT कायदा 2000 हा भारतातील सायबर गुन्ह्यांसाठी प्राथमिक कायदा आहे.' }
    },
    {
      id: 'cyber2',
      question: { en: 'What is the cyber crime helpline number?', hi: 'साइबर अपराध हेल्पलाइन नंबर क्या है?', mr: 'सायबर गुन्हा हेल्पलाइन नंबर कोणता आहे?' },
      options: { en: ['100', '112', '1930', '181'], hi: ['100', '112', '1930', '181'], mr: ['100', '112', '1930', '181'] },
      correctIndex: 2,
      explanation: { en: 'National Cyber Crime Helpline is 1930.', hi: 'राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 है।', mr: 'राष्ट्रीय सायबर गुन्हा हेल्पलाइन 1930 आहे.' }
    },
    {
      id: 'cyber3',
      question: { en: 'Where to report cyber crimes online?', hi: 'साइबर अपराधों की ऑनलाइन रिपोर्ट कहां करें?', mr: 'सायबर गुन्ह्यांची ऑनलाइन तक्रार कुठे करावी?' },
      options: { en: ['cybercrime.gov.in', 'police.gov.in', 'mha.gov.in', 'ncw.gov.in'], hi: ['cybercrime.gov.in', 'police.gov.in', 'mha.gov.in', 'ncw.gov.in'], mr: ['cybercrime.gov.in', 'police.gov.in', 'mha.gov.in', 'ncw.gov.in'] },
      correctIndex: 0,
      explanation: { en: 'cybercrime.gov.in is the official portal for reporting cyber crimes.', hi: 'cybercrime.gov.in साइबर अपराधों की रिपोर्ट के लिए आधिकारिक पोर्टल है।', mr: 'cybercrime.gov.in हे सायबर गुन्ह्यांच्या तक्रारीसाठी अधिकृत पोर्टल आहे.' }
    },
    {
      id: 'cyber4',
      question: { en: 'What is phishing?', hi: 'फिशिंग क्या है?', mr: 'फिशिंग म्हणजे काय?' },
      options: { en: ['Catching fish online', 'Fake emails/sites to steal data', 'A type of virus', 'Online gaming'], hi: ['ऑनलाइन मछली पकड़ना', 'डेटा चुराने के लिए नकली ईमेल/साइट', 'एक प्रकार का वायरस', 'ऑनलाइन गेमिंग'], mr: ['ऑनलाइन मासेमारी', 'डेटा चोरण्यासाठी बनावट ईमेल/साइट', 'एक प्रकारचा व्हायरस', 'ऑनलाइन गेमिंग'] },
      correctIndex: 1,
      explanation: { en: 'Phishing uses fake communications to steal personal information.', hi: 'फिशिंग व्यक्तिगत जानकारी चुराने के लिए नकली संचार का उपयोग करता है।', mr: 'फिशिंग वैयक्तिक माहिती चोरण्यासाठी बनावट संवाद वापरते.' }
    },
    {
      id: 'cyber5',
      question: { en: 'Within how many days should you report bank fraud?', hi: 'बैंक धोखाधड़ी की रिपोर्ट कितने दिनों में करनी चाहिए?', mr: 'बँक फसवणुकीची तक्रार किती दिवसांत करावी?' },
      options: { en: ['1 day', '3 days', '7 days', '30 days'], hi: ['1 दिन', '3 दिन', '7 दिन', '30 दिन'], mr: ['1 दिवस', '3 दिवस', '7 दिवस', '30 दिवस'] },
      correctIndex: 1,
      explanation: { en: 'Report within 3 days for zero liability as per RBI guidelines.', hi: 'RBI दिशानिर्देशों के अनुसार शून्य देयता के लिए 3 दिनों में रिपोर्ट करें।', mr: 'RBI मार्गदर्शक तत्त्वांनुसार शून्य दायित्वासाठी 3 दिवसांत तक्रार करा.' }
    },
    {
      id: 'cyber6',
      question: { en: 'Section 66 of IT Act deals with?', hi: 'IT अधिनियम की धारा 66 किससे संबंधित है?', mr: 'IT कायद्याचे कलम 66 कशाशी संबंधित आहे?' },
      options: { en: ['Hacking', 'Spam emails', 'Online shopping', 'Social media'], hi: ['हैकिंग', 'स्पैम ईमेल', 'ऑनलाइन शॉपिंग', 'सोशल मीडिया'], mr: ['हॅकिंग', 'स्पॅम ईमेल', 'ऑनलाइन खरेदी', 'सोशल मीडिया'] },
      correctIndex: 0,
      explanation: { en: 'Section 66 deals with computer related offences including hacking.', hi: 'धारा 66 हैकिंग सहित कंप्यूटर संबंधित अपराधों से संबंधित है।', mr: 'कलम 66 हॅकिंगसह संगणक संबंधित गुन्ह्यांशी संबंधित आहे.' }
    },
    {
      id: 'cyber7',
      question: { en: 'What is identity theft?', hi: 'पहचान की चोरी क्या है?', mr: 'ओळख चोरी म्हणजे काय?' },
      options: { en: ['Stealing passwords only', 'Using someone else identity fraudulently', 'Changing your name', 'Creating fake ID cards'], hi: ['केवल पासवर्ड चुराना', 'किसी और की पहचान का धोखाधड़ी से उपयोग', 'अपना नाम बदलना', 'नकली ID कार्ड बनाना'], mr: ['फक्त पासवर्ड चोरणे', 'दुसऱ्याची ओळख फसवणुकीने वापरणे', 'तुमचे नाव बदलणे', 'बनावट ID कार्ड बनवणे'] },
      correctIndex: 1,
      explanation: { en: 'Identity theft is using someone personal information without permission.', hi: 'पहचान की चोरी बिना अनुमति किसी की व्यक्तिगत जानकारी का उपयोग है।', mr: 'ओळख चोरी म्हणजे परवानगीशिवाय कोणाची वैयक्तिक माहिती वापरणे.' }
    },
    {
      id: 'cyber8',
      question: { en: 'What is OTP?', hi: 'OTP क्या है?', mr: 'OTP म्हणजे काय?' },
      options: { en: ['One Time Password', 'Online Transaction Portal', 'Official Transfer Protocol', 'Open Text Platform'], hi: ['वन टाइम पासवर्ड', 'ऑनलाइन ट्रांजेक्शन पोर्टल', 'ऑफिशियल ट्रांसफर प्रोटोकॉल', 'ओपन टेक्स्ट प्लेटफॉर्म'], mr: ['वन टाइम पासवर्ड', 'ऑनलाइन ट्रान्झॅक्शन पोर्टल', 'ऑफिशियल ट्रान्सफर प्रोटोकॉल', 'ओपन टेक्स्ट प्लॅटफॉर्म'] },
      correctIndex: 0,
      explanation: { en: 'OTP is One Time Password for secure transactions.', hi: 'OTP सुरक्षित लेनदेन के लिए वन टाइम पासवर्ड है।', mr: 'OTP हा सुरक्षित व्यवहारांसाठी वन टाइम पासवर्ड आहे.' }
    },
    {
      id: 'cyber9',
      question: { en: 'Should you share OTP with anyone?', hi: 'क्या OTP किसी के साथ साझा करना चाहिए?', mr: 'OTP कोणाशीही शेअर करावा का?' },
      options: { en: ['Yes, with bank officials', 'Yes, with police', 'Never share with anyone', 'Only with family'], hi: ['हां, बैंक अधिकारियों के साथ', 'हां, पुलिस के साथ', 'कभी किसी के साथ साझा न करें', 'केवल परिवार के साथ'], mr: ['हो, बँक अधिकाऱ्यांसोबत', 'हो, पोलिसांसोबत', 'कधीही कोणाशीही शेअर करू नका', 'फक्त कुटुंबासोबत'] },
      correctIndex: 2,
      explanation: { en: 'Never share OTP with anyone, not even bank officials.', hi: 'OTP कभी किसी के साथ साझा न करें, बैंक अधिकारियों के साथ भी नहीं।', mr: 'OTP कधीही कोणाशीही शेअर करू नका, बँक अधिकाऱ्यांसोबतही नाही.' }
    },
    {
      id: 'cyber10',
      question: { en: 'What is cyber stalking?', hi: 'साइबर स्टॉकिंग क्या है?', mr: 'सायबर स्टॉकिंग म्हणजे काय?' },
      options: { en: ['Walking online', 'Repeatedly harassing someone online', 'Shopping online', 'Reading news online'], hi: ['ऑनलाइन चलना', 'किसी को बार-बार ऑनलाइन परेशान करना', 'ऑनलाइन खरीदारी', 'ऑनलाइन समाचार पढ़ना'], mr: ['ऑनलाइन चालणे', 'कोणाला वारंवार ऑनलाइन त्रास देणे', 'ऑनलाइन खरेदी', 'ऑनलाइन बातम्या वाचणे'] },
      correctIndex: 1,
      explanation: { en: 'Cyber stalking is repeatedly harassing or threatening someone online.', hi: 'साइबर स्टॉकिंग किसी को बार-बार ऑनलाइन परेशान या धमकाना है।', mr: 'सायबर स्टॉकिंग म्हणजे कोणाला वारंवार ऑनलाइन त्रास देणे किंवा धमकावणे.' }
    },
    {
      id: 'cyber11',
      question: { en: 'Section 66A of IT Act was struck down for?', hi: 'IT अधिनियम की धारा 66A किस कारण रद्द हुई?', mr: 'IT कायद्याचे कलम 66A कोणत्या कारणासाठी रद्द झाले?' },
      options: { en: ['Being too lenient', 'Violating free speech', 'Being outdated', 'Technical errors'], hi: ['बहुत उदार होने के लिए', 'अभिव्यक्ति की स्वतंत्रता का उल्लंघन', 'पुराना होने के लिए', 'तकनीकी त्रुटियां'], mr: ['खूप सौम्य असल्यामुळे', 'अभिव्यक्ती स्वातंत्र्याचे उल्लंघन', 'जुने असल्यामुळे', 'तांत्रिक त्रुटी'] },
      correctIndex: 1,
      explanation: { en: 'Section 66A was struck down by Supreme Court for violating free speech.', hi: 'धारा 66A को अभिव्यक्ति की स्वतंत्रता के उल्लंघन के लिए सुप्रीम कोर्ट ने रद्द किया।', mr: 'कलम 66A अभिव्यक्ती स्वातंत्र्याचे उल्लंघन केल्यामुळे सर्वोच्च न्यायालयाने रद्द केले.' }
    },
    {
      id: 'cyber12',
      question: { en: 'What should you do if hacked?', hi: 'हैक होने पर क्या करना चाहिए?', mr: 'हॅक झाल्यास काय करावे?' },
      options: { en: ['Ignore it', 'Change passwords and report', 'Delete the account', 'Pay the hacker'], hi: ['इसे अनदेखा करें', 'पासवर्ड बदलें और रिपोर्ट करें', 'अकाउंट डिलीट करें', 'हैकर को पैसे दें'], mr: ['दुर्लक्ष करा', 'पासवर्ड बदला आणि तक्रार करा', 'खाते हटवा', 'हॅकरला पैसे द्या'] },
      correctIndex: 1,
      explanation: { en: 'Change passwords immediately and report to cybercrime portal.', hi: 'तुरंत पासवर्ड बदलें और साइबर अपराध पोर्टल पर रिपोर्ट करें।', mr: 'तात्काळ पासवर्ड बदला आणि सायबर गुन्हे पोर्टलवर तक्रार करा.' }
    },
    {
      id: 'cyber13',
      question: { en: 'What is ransomware?', hi: 'रैंसमवेयर क्या है?', mr: 'रॅन्समवेअर म्हणजे काय?' },
      options: { en: ['Antivirus software', 'Malware demanding payment', 'A type of browser', 'Email service'], hi: ['एंटीवायरस सॉफ्टवेयर', 'भुगतान मांगने वाला मैलवेयर', 'एक प्रकार का ब्राउज़र', 'ईमेल सेवा'], mr: ['अँटीव्हायरस सॉफ्टवेअर', 'पैसे मागणारे मालवेअर', 'एक प्रकारचा ब्राउझर', 'ईमेल सेवा'] },
      correctIndex: 1,
      explanation: { en: 'Ransomware locks your data and demands payment for release.', hi: 'रैंसमवेयर आपका डेटा लॉक करता है और रिलीज के लिए भुगतान मांगता है।', mr: 'रॅन्समवेअर तुमचा डेटा लॉक करते आणि रिलीजसाठी पैसे मागते.' }
    },
    {
      id: 'cyber14',
      question: { en: 'Is sharing fake news a cyber crime?', hi: 'क्या फेक न्यूज शेयर करना साइबर अपराध है?', mr: 'फेक न्यूज शेअर करणे सायबर गुन्हा आहे का?' },
      options: { en: ['No', 'Yes, it can be punishable', 'Only for journalists', 'Only on WhatsApp'], hi: ['नहीं', 'हां, दंडनीय हो सकता है', 'केवल पत्रकारों के लिए', 'केवल WhatsApp पर'], mr: ['नाही', 'हो, शिक्षापात्र असू शकते', 'फक्त पत्रकारांसाठी', 'फक्त WhatsApp वर'] },
      correctIndex: 1,
      explanation: { en: 'Sharing fake news can lead to legal action under various laws.', hi: 'फेक न्यूज शेयर करने पर विभिन्न कानूनों के तहत कानूनी कार्रवाई हो सकती है।', mr: 'फेक न्यूज शेअर केल्यास विविध कायद्यांतर्गत कायदेशीर कारवाई होऊ शकते.' }
    },
    {
      id: 'cyber15',
      question: { en: 'What is two-factor authentication?', hi: 'टू-फैक्टर ऑथेंटिकेशन क्या है?', mr: 'टू-फॅक्टर ऑथेंटिकेशन म्हणजे काय?' },
      options: { en: ['Two passwords', 'Password plus another verification', 'Two email IDs', 'Two phone numbers'], hi: ['दो पासवर्ड', 'पासवर्ड और एक अन्य सत्यापन', 'दो ईमेल आईडी', 'दो फोन नंबर'], mr: ['दोन पासवर्ड', 'पासवर्ड आणि दुसरे सत्यापन', 'दोन ईमेल आयडी', 'दोन फोन नंबर'] },
      correctIndex: 1,
      explanation: { en: 'Two-factor authentication adds extra security with OTP or biometric.', hi: 'टू-फैक्टर ऑथेंटिकेशन OTP या बायोमेट्रिक से अतिरिक्त सुरक्षा जोड़ता है।', mr: 'टू-फॅक्टर ऑथेंटिकेशन OTP किंवा बायोमेट्रिकसह अतिरिक्त सुरक्षा जोडते.' }
    },
    {
      id: 'cyber16',
      question: { en: 'What is a strong password?', hi: 'मजबूत पासवर्ड क्या है?', mr: 'मजबूत पासवर्ड म्हणजे काय?' },
      options: { en: ['Your name', '123456', 'Mix of letters, numbers, symbols', 'Your birthdate'], hi: ['आपका नाम', '123456', 'अक्षरों, संख्याओं, प्रतीकों का मिश्रण', 'आपकी जन्मतिथि'], mr: ['तुमचे नाव', '123456', 'अक्षरे, संख्या, चिन्हांचे मिश्रण', 'तुमची जन्मतारीख'] },
      correctIndex: 2,
      explanation: { en: 'Strong passwords have mix of uppercase, lowercase, numbers, and symbols.', hi: 'मजबूत पासवर्ड में अपरकेस, लोअरकेस, संख्याएं और प्रतीक होते हैं।', mr: 'मजबूत पासवर्डमध्ये अपरकेस, लोअरकेस, संख्या आणि चिन्हे असतात.' }
    },
    {
      id: 'cyber17',
      question: { en: 'Can you file cyber crime FIR at any police station?', hi: 'क्या साइबर अपराध की FIR किसी भी थाने में दर्ज हो सकती है?', mr: 'सायबर गुन्ह्याची FIR कोणत्याही पोलीस स्टेशनवर दाखल होऊ शकते का?' },
      options: { en: ['No, only cyber cell', 'Yes, Zero FIR possible', 'Only in metros', 'Only online'], hi: ['नहीं, केवल साइबर सेल', 'हां, जीरो FIR संभव', 'केवल महानगरों में', 'केवल ऑनलाइन'], mr: ['नाही, फक्त सायबर सेल', 'हो, झिरो FIR शक्य', 'फक्त महानगरांमध्ये', 'फक्त ऑनलाइन'] },
      correctIndex: 1,
      explanation: { en: 'You can file Zero FIR at any police station for cyber crimes.', hi: 'साइबर अपराधों के लिए किसी भी थाने में जीरो FIR दर्ज हो सकती है।', mr: 'सायबर गुन्ह्यांसाठी कोणत्याही पोलीस स्टेशनवर झिरो FIR दाखल होऊ शकते.' }
    },
    {
      id: 'cyber18',
      question: { en: 'What is malware?', hi: 'मैलवेयर क्या है?', mr: 'मालवेअर म्हणजे काय?' },
      options: { en: ['Good software', 'Malicious software', 'Hardware', 'Mobile app'], hi: ['अच्छा सॉफ्टवेयर', 'दुर्भावनापूर्ण सॉफ्टवेयर', 'हार्डवेयर', 'मोबाइल ऐप'], mr: ['चांगले सॉफ्टवेअर', 'दुर्भावनापूर्ण सॉफ्टवेअर', 'हार्डवेअर', 'मोबाइल ॲप'] },
      correctIndex: 1,
      explanation: { en: 'Malware is malicious software designed to harm your device.', hi: 'मैलवेयर आपके डिवाइस को नुकसान पहुंचाने के लिए बनाया गया दुर्भावनापूर्ण सॉफ्टवेयर है।', mr: 'मालवेअर हे तुमच्या डिव्हाइसला हानी पोहोचवण्यासाठी बनवलेले दुर्भावनापूर्ण सॉफ्टवेअर आहे.' }
    },
    {
      id: 'cyber19',
      question: { en: 'Section 67 of IT Act deals with?', hi: 'IT अधिनियम की धारा 67 किससे संबंधित है?', mr: 'IT कायद्याचे कलम 67 कशाशी संबंधित आहे?' },
      options: { en: ['Hacking', 'Obscene content', 'Spam', 'Data theft'], hi: ['हैकिंग', 'अश्लील सामग्री', 'स्पैम', 'डेटा चोरी'], mr: ['हॅकिंग', 'अश्लील सामग्री', 'स्पॅम', 'डेटा चोरी'] },
      correctIndex: 1,
      explanation: { en: 'Section 67 deals with publishing obscene content electronically.', hi: 'धारा 67 इलेक्ट्रॉनिक रूप से अश्लील सामग्री प्रकाशित करने से संबंधित है।', mr: 'कलम 67 इलेक्ट्रॉनिक पद्धतीने अश्लील सामग्री प्रकाशित करण्याशी संबंधित आहे.' }
    },
    {
      id: 'cyber20',
      question: { en: 'What is CERT-In?', hi: 'CERT-In क्या है?', mr: 'CERT-In म्हणजे काय?' },
      options: { en: ['Certificate Authority', 'Cyber Emergency Response Team', 'Computer Education Research', 'Central E-commerce Regulator'], hi: ['प्रमाणपत्र प्राधिकरण', 'साइबर आपातकालीन प्रतिक्रिया टीम', 'कंप्यूटर शिक्षा अनुसंधान', 'केंद्रीय ई-कॉमर्स नियामक'], mr: ['प्रमाणपत्र प्राधिकरण', 'सायबर आपत्कालीन प्रतिसाद पथक', 'संगणक शिक्षण संशोधन', 'केंद्रीय ई-कॉमर्स नियामक'] },
      correctIndex: 1,
      explanation: { en: 'CERT-In is Indian Computer Emergency Response Team.', hi: 'CERT-In भारतीय कंप्यूटर आपातकालीन प्रतिक्रिया टीम है।', mr: 'CERT-In हे भारतीय संगणक आपत्कालीन प्रतिसाद पथक आहे.' }
    },
    {
      id: 'cyber21',
      question: { en: 'What is safe to click in emails?', hi: 'ईमेल में क्या क्लिक करना सुरक्षित है?', mr: 'ईमेलमध्ये काय क्लिक करणे सुरक्षित आहे?' },
      options: { en: ['Links from unknown senders', 'Attachments from strangers', 'Links from verified sources only', 'All links are safe'], hi: ['अज्ञात भेजने वालों के लिंक', 'अजनबियों से अटैचमेंट', 'केवल सत्यापित स्रोतों के लिंक', 'सभी लिंक सुरक्षित हैं'], mr: ['अज्ञात पाठवणाऱ्यांचे लिंक', 'अनोळखींकडून अटॅचमेंट', 'फक्त सत्यापित स्त्रोतांचे लिंक', 'सर्व लिंक सुरक्षित आहेत'] },
      correctIndex: 2,
      explanation: { en: 'Only click links from verified and trusted sources.', hi: 'केवल सत्यापित और विश्वसनीय स्रोतों के लिंक पर क्लिक करें।', mr: 'फक्त सत्यापित आणि विश्वसनीय स्त्रोतांचे लिंक क्लिक करा.' }
    },
    {
      id: 'cyber22',
      question: { en: 'What is digital signature?', hi: 'डिजिटल सिग्नेचर क्या है?', mr: 'डिजिटल सिग्नेचर म्हणजे काय?' },
      options: { en: ['Scanned signature', 'Electronic authentication', 'Handwritten on tablet', 'Fingerprint'], hi: ['स्कैन किया हस्ताक्षर', 'इलेक्ट्रॉनिक प्रमाणीकरण', 'टैबलेट पर हस्तलिखित', 'फिंगरप्रिंट'], mr: ['स्कॅन केलेली सही', 'इलेक्ट्रॉनिक प्रमाणीकरण', 'टॅबलेटवर हस्तलिखित', 'फिंगरप्रिंट'] },
      correctIndex: 1,
      explanation: { en: 'Digital signature is electronic method to verify document authenticity.', hi: 'डिजिटल सिग्नेचर दस्तावेज़ की प्रामाणिकता सत्यापित करने का इलेक्ट्रॉनिक तरीका है।', mr: 'डिजिटल सिग्नेचर हे दस्तऐवजाची सत्यता पडताळण्याची इलेक्ट्रॉनिक पद्धत आहे.' }
    },
    {
      id: 'cyber23',
      question: { en: 'What is social engineering attack?', hi: 'सोशल इंजीनियरिंग अटैक क्या है?', mr: 'सोशल इंजिनिअरिंग अटॅक म्हणजे काय?' },
      options: { en: ['Building social networks', 'Tricking people to reveal info', 'Engineering course', 'Social media marketing'], hi: ['सोशल नेटवर्क बनाना', 'लोगों को जानकारी देने के लिए धोखा देना', 'इंजीनियरिंग कोर्स', 'सोशल मीडिया मार्केटिंग'], mr: ['सोशल नेटवर्क बनवणे', 'लोकांना माहिती देण्यासाठी फसवणे', 'इंजिनिअरिंग कोर्स', 'सोशल मीडिया मार्केटिंग'] },
      correctIndex: 1,
      explanation: { en: 'Social engineering manipulates people to reveal confidential information.', hi: 'सोशल इंजीनियरिंग लोगों को गोपनीय जानकारी देने के लिए हेरफेर करता है।', mr: 'सोशल इंजिनिअरिंग लोकांना गोपनीय माहिती देण्यासाठी फसवते.' }
    },
    {
      id: 'cyber24',
      question: { en: 'Is using public WiFi safe for banking?', hi: 'क्या बैंकिंग के लिए पब्लिक WiFi सुरक्षित है?', mr: 'बँकिंगसाठी पब्लिक WiFi सुरक्षित आहे का?' },
      options: { en: ['Yes, always', 'No, avoid for sensitive transactions', 'Only in malls', 'Only at airports'], hi: ['हां, हमेशा', 'नहीं, संवेदनशील लेनदेन से बचें', 'केवल मॉल में', 'केवल हवाई अड्डों पर'], mr: ['हो, नेहमी', 'नाही, संवेदनशील व्यवहार टाळा', 'फक्त मॉलमध्ये', 'फक्त विमानतळांवर'] },
      correctIndex: 1,
      explanation: { en: 'Avoid banking on public WiFi as it can be intercepted.', hi: 'पब्लिक WiFi पर बैंकिंग से बचें क्योंकि इसे इंटरसेप्ट किया जा सकता है।', mr: 'पब्लिक WiFi वर बँकिंग टाळा कारण ते इंटरसेप्ट होऊ शकते.' }
    },
    {
      id: 'cyber25',
      question: { en: 'Punishment for hacking under IT Act?', hi: 'IT अधिनियम के तहत हैकिंग की सजा?', mr: 'IT कायद्यानुसार हॅकिंगची शिक्षा?' },
      options: { en: ['Warning only', 'Up to 3 years jail', 'Life imprisonment', 'No punishment'], hi: ['केवल चेतावनी', '3 साल तक जेल', 'आजीवन कारावास', 'कोई सजा नहीं'], mr: ['फक्त इशारा', '3 वर्षांपर्यंत तुरुंगवास', 'जन्मठेप', 'शिक्षा नाही'] },
      correctIndex: 1,
      explanation: { en: 'Hacking can lead to up to 3 years imprisonment and fine.', hi: 'हैकिंग के लिए 3 साल तक की जेल और जुर्माना हो सकता है।', mr: 'हॅकिंगसाठी 3 वर्षांपर्यंत तुरुंगवास आणि दंड होऊ शकतो.' }
    }
  ],
  tenant_rights: [
    {
      id: 'tenant1',
      question: { en: 'Is written rent agreement mandatory?', hi: 'क्या लिखित किराया समझौता अनिवार्य है?', mr: 'लिखित भाडे करार अनिवार्य आहे का?' },
      options: { en: ['No, verbal is enough', 'Yes, always recommended', 'Only for commercial', 'Only in cities'], hi: ['नहीं, मौखिक पर्याप्त है', 'हां, हमेशा अनुशंसित', 'केवल व्यावसायिक के लिए', 'केवल शहरों में'], mr: ['नाही, तोंडी पुरेसे', 'हो, नेहमी शिफारस केलेले', 'फक्त व्यावसायिकसाठी', 'फक्त शहरांमध्ये'] },
      correctIndex: 1,
      explanation: { en: 'Written agreement protects both tenant and landlord legally.', hi: 'लिखित समझौता किरायेदार और मकान मालिक दोनों की कानूनी सुरक्षा करता है।', mr: 'लिखित करार भाडेकरू आणि मालक दोघांचे कायदेशीर संरक्षण करतो.' }
    },
    {
      id: 'tenant2',
      question: { en: 'When should rent agreement be registered?', hi: 'किराया समझौता कब रजिस्टर होना चाहिए?', mr: 'भाडे करार कधी नोंदणी करावा?' },
      options: { en: ['For all durations', 'Above 11 months', 'Above 2 years', 'Never needed'], hi: ['सभी अवधियों के लिए', '11 महीने से अधिक', '2 साल से अधिक', 'कभी जरूरत नहीं'], mr: ['सर्व कालावधीसाठी', '11 महिन्यांपेक्षा जास्त', '2 वर्षांपेक्षा जास्त', 'कधीच आवश्यक नाही'] },
      correctIndex: 1,
      explanation: { en: 'Agreements above 11 months must be registered.', hi: '11 महीने से अधिक के समझौते रजिस्टर होने चाहिए।', mr: '11 महिन्यांपेक्षा जास्त कालावधीचे करार नोंदणी करावे.' }
    },
    {
      id: 'tenant3',
      question: { en: 'Can landlord increase rent anytime?', hi: 'क्या मकान मालिक कभी भी किराया बढ़ा सकता है?', mr: 'मालक कधीही भाडे वाढवू शकतो का?' },
      options: { en: ['Yes, anytime', 'No, as per agreement terms', 'Only after 6 months', 'Only with court order'], hi: ['हां, कभी भी', 'नहीं, समझौते की शर्तों के अनुसार', 'केवल 6 महीने बाद', 'केवल अदालत के आदेश से'], mr: ['हो, कधीही', 'नाही, कराराच्या अटींनुसार', 'फक्त 6 महिन्यांनंतर', 'फक्त न्यायालयाच्या आदेशाने'] },
      correctIndex: 1,
      explanation: { en: 'Rent increase must follow terms mentioned in the agreement.', hi: 'किराया वृद्धि समझौते में उल्लिखित शर्तों के अनुसार होनी चाहिए।', mr: 'भाडे वाढ कराराच्या अटींनुसार असणे आवश्यक आहे.' }
    },
    {
      id: 'tenant4',
      question: { en: 'What is typical security deposit?', hi: 'सामान्य सुरक्षा जमा क्या है?', mr: 'सामान्य सुरक्षा ठेव किती आहे?' },
      options: { en: ['1 month rent', '2-3 months rent varies by city', '6 months rent', '1 year rent'], hi: ['1 महीने का किराया', '2-3 महीने का किराया शहर के अनुसार', '6 महीने का किराया', '1 साल का किराया'], mr: ['1 महिन्याचे भाडे', '2-3 महिन्यांचे भाडे शहरानुसार', '6 महिन्यांचे भाडे', '1 वर्षाचे भाडे'] },
      correctIndex: 1,
      explanation: { en: 'Security deposit varies from 2-3 months depending on city norms.', hi: 'सुरक्षा जमा शहर के मानदंडों के अनुसार 2-3 महीने भिन्न होता है।', mr: 'सुरक्षा ठेव शहराच्या नियमांनुसार 2-3 महिने बदलते.' }
    },
    {
      id: 'tenant5',
      question: { en: 'Who pays for major repairs?', hi: 'बड़ी मरम्मत का भुगतान कौन करता है?', mr: 'मोठ्या दुरुस्त्यांचा खर्च कोण करतो?' },
      options: { en: ['Always tenant', 'Landlord', 'Shared equally', 'Government'], hi: ['हमेशा किरायेदार', 'मकान मालिक', 'समान रूप से साझा', 'सरकार'], mr: ['नेहमी भाडेकरू', 'मालक', 'समान वाटणी', 'सरकार'] },
      correctIndex: 1,
      explanation: { en: 'Major structural repairs are landlord responsibility.', hi: 'बड़ी संरचनात्मक मरम्मत मकान मालिक की जिम्मेदारी है।', mr: 'मोठ्या संरचनात्मक दुरुस्त्या मालकाची जबाबदारी आहे.' }
    },
    {
      id: 'tenant6',
      question: { en: 'How much notice period for eviction?', hi: 'बेदखली के लिए कितने दिन की नोटिस?', mr: 'बेदखलीसाठी किती दिवसांची नोटीस?' },
      options: { en: ['No notice needed', 'As per agreement usually 1-3 months', '1 week', '6 months'], hi: ['कोई नोटिस नहीं', 'समझौते के अनुसार आमतौर पर 1-3 महीने', '1 सप्ताह', '6 महीने'], mr: ['नोटीस आवश्यक नाही', 'कराराप्रमाणे सामान्यतः 1-3 महिने', '1 आठवडा', '6 महिने'] },
      correctIndex: 1,
      explanation: { en: 'Notice period is usually 1-3 months as per agreement.', hi: 'नोटिस अवधि आमतौर पर समझौते के अनुसार 1-3 महीने होती है।', mr: 'नोटीस कालावधी सामान्यतः कराराप्रमाणे 1-3 महिने असतो.' }
    },
    {
      id: 'tenant7',
      question: { en: 'Can landlord enter without permission?', hi: 'क्या मकान मालिक बिना अनुमति के प्रवेश कर सकता है?', mr: 'मालक परवानगीशिवाय प्रवेश करू शकतो का?' },
      options: { en: ['Yes, its their property', 'No, must give prior notice', 'Only during day', 'Only on weekends'], hi: ['हां, उनकी संपत्ति है', 'नहीं, पूर्व सूचना देनी होगी', 'केवल दिन में', 'केवल सप्ताहांत में'], mr: ['हो, त्यांची मालमत्ता आहे', 'नाही, आधी नोटीस द्यावी लागते', 'फक्त दिवसा', 'फक्त आठवड्याच्या शेवटी'] },
      correctIndex: 1,
      explanation: { en: 'Landlord must give reasonable notice before entering the property.', hi: 'मकान मालिक को संपत्ति में प्रवेश करने से पहले उचित सूचना देनी होगी।', mr: 'मालकाने मालमत्तेत प्रवेश करण्यापूर्वी वाजवी नोटीस द्यावी लागते.' }
    },
    {
      id: 'tenant8',
      question: { en: 'When should security deposit be returned?', hi: 'सुरक्षा जमा कब वापस होनी चाहिए?', mr: 'सुरक्षा ठेव कधी परत करावी?' },
      options: { en: ['Never', 'At time of vacating after inspection', 'After 1 year', 'Only if asked'], hi: ['कभी नहीं', 'निरीक्षण के बाद खाली करते समय', '1 साल बाद', 'केवल मांगने पर'], mr: ['कधीच नाही', 'तपासणीनंतर खाली करताना', '1 वर्षानंतर', 'फक्त विचारल्यास'] },
      correctIndex: 1,
      explanation: { en: 'Deposit should be returned on vacating after property inspection.', hi: 'संपत्ति निरीक्षण के बाद खाली करने पर जमा वापस होनी चाहिए।', mr: 'मालमत्ता तपासणीनंतर खाली करताना ठेव परत करावी.' }
    },
    {
      id: 'tenant9',
      question: { en: 'Can landlord cut electricity/water to evict?', hi: 'क्या मकान मालिक बेदखली के लिए बिजली/पानी काट सकता है?', mr: 'मालक बेदखलीसाठी वीज/पाणी कापू शकतो का?' },
      options: { en: ['Yes', 'No, it is illegal', 'Only after notice', 'Only in summer'], hi: ['हां', 'नहीं, यह गैरकानूनी है', 'केवल नोटिस के बाद', 'केवल गर्मियों में'], mr: ['हो', 'नाही, ते बेकायदेशीर आहे', 'फक्त नोटिसनंतर', 'फक्त उन्हाळ्यात'] },
      correctIndex: 1,
      explanation: { en: 'Cutting essential services for eviction is illegal.', hi: 'बेदखली के लिए आवश्यक सेवाएं काटना गैरकानूनी है।', mr: 'बेदखलीसाठी आवश्यक सेवा कापणे बेकायदेशीर आहे.' }
    },
    {
      id: 'tenant10',
      question: { en: 'Where to file rent disputes?', hi: 'किराया विवाद कहां दर्ज करें?', mr: 'भाडे वाद कुठे दाखल करावा?' },
      options: { en: ['Police station', 'Rent Controller/Civil Court', 'Municipality', 'Consumer Forum'], hi: ['पुलिस स्टेशन', 'किराया नियंत्रक/दीवानी अदालत', 'नगरपालिका', 'उपभोक्ता फोरम'], mr: ['पोलीस स्टेशन', 'भाडे नियंत्रक/दिवाणी न्यायालय', 'नगरपालिका', 'ग्राहक मंच'] },
      correctIndex: 1,
      explanation: { en: 'Rent disputes go to Rent Controller or Civil Court.', hi: 'किराया विवाद किराया नियंत्रक या दीवानी अदालत में जाते हैं।', mr: 'भाडे वाद भाडे नियंत्रक किंवा दिवाणी न्यायालयात जातात.' }
    },
    {
      id: 'tenant11',
      question: { en: 'Can tenant sublet the property?', hi: 'क्या किरायेदार संपत्ति उपकिराए पर दे सकता है?', mr: 'भाडेकरू मालमत्ता उपभाड्याने देऊ शकतो का?' },
      options: { en: ['Yes, always', 'Only with landlord written permission', 'Never allowed', 'Only for family'], hi: ['हां, हमेशा', 'केवल मकान मालिक की लिखित अनुमति से', 'कभी अनुमति नहीं', 'केवल परिवार के लिए'], mr: ['हो, नेहमी', 'फक्त मालकाच्या लिखित परवानगीने', 'कधीच परवानगी नाही', 'फक्त कुटुंबासाठी'] },
      correctIndex: 1,
      explanation: { en: 'Subletting usually requires landlord written consent.', hi: 'उपकिराए के लिए आमतौर पर मकान मालिक की लिखित सहमति आवश्यक है।', mr: 'उपभाड्यासाठी सामान्यतः मालकाची लिखित संमती आवश्यक असते.' }
    },
    {
      id: 'tenant12',
      question: { en: 'What is fair wear and tear?', hi: 'सामान्य टूट-फूट क्या है?', mr: 'सामान्य झीज म्हणजे काय?' },
      options: { en: ['Intentional damage', 'Normal deterioration from regular use', 'Accidental damage', 'No damage'], hi: ['जानबूझकर नुकसान', 'नियमित उपयोग से सामान्य गिरावट', 'आकस्मिक नुकसान', 'कोई नुकसान नहीं'], mr: ['जाणूनबुजून नुकसान', 'नियमित वापरातून सामान्य घसारा', 'अपघाती नुकसान', 'नुकसान नाही'] },
      correctIndex: 1,
      explanation: { en: 'Fair wear and tear is normal deterioration from everyday use.', hi: 'सामान्य टूट-फूट रोजमर्रा के उपयोग से होने वाली सामान्य गिरावट है।', mr: 'सामान्य झीज म्हणजे दैनंदिन वापरातून होणारा सामान्य घसारा.' }
    },
    {
      id: 'tenant13',
      question: { en: 'Is rent receipt important?', hi: 'क्या किराया रसीद महत्वपूर्ण है?', mr: 'भाडे पावती महत्त्वाची आहे का?' },
      options: { en: ['No', 'Yes, for proof and tax benefits', 'Only for large amounts', 'Only for commercial'], hi: ['नहीं', 'हां, प्रमाण और कर लाभ के लिए', 'केवल बड़ी राशि के लिए', 'केवल व्यावसायिक के लिए'], mr: ['नाही', 'हो, पुरावा आणि कर लाभासाठी', 'फक्त मोठ्या रकमेसाठी', 'फक्त व्यावसायिकसाठी'] },
      correctIndex: 1,
      explanation: { en: 'Rent receipts are proof of payment and needed for HRA claims.', hi: 'किराया रसीद भुगतान का प्रमाण है और HRA दावों के लिए आवश्यक है।', mr: 'भाडे पावत्या पेमेंटचा पुरावा आहेत आणि HRA दाव्यांसाठी आवश्यक आहेत.' }
    },
    {
      id: 'tenant14',
      question: { en: 'Who pays property tax?', hi: 'संपत्ति कर कौन देता है?', mr: 'मालमत्ता कर कोण भरतो?' },
      options: { en: ['Tenant', 'Landlord', 'Shared equally', 'Government'], hi: ['किरायेदार', 'मकान मालिक', 'समान रूप से साझा', 'सरकार'], mr: ['भाडेकरू', 'मालक', 'समान वाटणी', 'सरकार'] },
      correctIndex: 1,
      explanation: { en: 'Property tax is the responsibility of the property owner.', hi: 'संपत्ति कर संपत्ति मालिक की जिम्मेदारी है।', mr: 'मालमत्ता कर मालमत्ता मालकाची जबाबदारी आहे.' }
    },
    {
      id: 'tenant15',
      question: { en: 'Can landlord refuse to return deposit without reason?', hi: 'क्या मकान मालिक बिना कारण जमा वापस करने से मना कर सकता है?', mr: 'मालक कारणाशिवाय ठेव परत करण्यास नकार देऊ शकतो का?' },
      options: { en: ['Yes', 'No, tenant can take legal action', 'Depends on mood', 'Only if rent is pending'], hi: ['हां', 'नहीं, किरायेदार कानूनी कार्रवाई कर सकता है', 'मूड पर निर्भर', 'केवल अगर किराया बाकी है'], mr: ['हो', 'नाही, भाडेकरू कायदेशीर कारवाई करू शकतो', 'मूडवर अवलंबून', 'फक्त भाडे बाकी असल्यास'] },
      correctIndex: 1,
      explanation: { en: 'Landlord cannot withhold deposit without valid reason; legal action is possible.', hi: 'मकान मालिक बिना वैध कारण जमा नहीं रख सकता; कानूनी कार्रवाई संभव है।', mr: 'मालक वैध कारणाशिवाय ठेव ठेवू शकत नाही; कायदेशीर कारवाई शक्य आहे.' }
    },
    {
      id: 'tenant16',
      question: { en: 'What is lock-in period?', hi: 'लॉक-इन अवधि क्या है?', mr: 'लॉक-इन कालावधी म्हणजे काय?' },
      options: { en: ['Time when doors are locked', 'Minimum period tenant must stay', 'Maximum rent period', 'Security deposit period'], hi: ['दरवाजे बंद होने का समय', 'किरायेदार को न्यूनतम अवधि रहना होगा', 'अधिकतम किराया अवधि', 'सुरक्षा जमा अवधि'], mr: ['दरवाजे बंद असण्याची वेळ', 'भाडेकरूला किमान राहावे लागणारा कालावधी', 'कमाल भाडे कालावधी', 'सुरक्षा ठेव कालावधी'] },
      correctIndex: 1,
      explanation: { en: 'Lock-in period is minimum time tenant must stay before vacating.', hi: 'लॉक-इन अवधि वह न्यूनतम समय है जब किरायेदार को खाली करने से पहले रहना होगा।', mr: 'लॉक-इन कालावधी म्हणजे खाली करण्यापूर्वी भाडेकरूला राहावा लागणारा किमान कालावधी.' }
    },
    {
      id: 'tenant17',
      question: { en: 'Can tenant make modifications to property?', hi: 'क्या किरायेदार संपत्ति में बदलाव कर सकता है?', mr: 'भाडेकरू मालमत्तेत बदल करू शकतो का?' },
      options: { en: ['Yes, always', 'Only with landlord permission', 'Never allowed', 'Only painting'], hi: ['हां, हमेशा', 'केवल मकान मालिक की अनुमति से', 'कभी अनुमति नहीं', 'केवल पेंटिंग'], mr: ['हो, नेहमी', 'फक्त मालकाच्या परवानगीने', 'कधीच परवानगी नाही', 'फक्त रंगकाम'] },
      correctIndex: 1,
      explanation: { en: 'Structural modifications need landlord written permission.', hi: 'संरचनात्मक बदलाव के लिए मकान मालिक की लिखित अनुमति आवश्यक है।', mr: 'संरचनात्मक बदलांसाठी मालकाची लिखित परवानगी आवश्यक आहे.' }
    },
    {
      id: 'tenant18',
      question: { en: 'What if landlord sells the property?', hi: 'अगर मकान मालिक संपत्ति बेचे तो क्या?', mr: 'मालकाने मालमत्ता विकली तर काय?' },
      options: { en: ['Tenant must vacate immediately', 'Existing agreement continues with new owner', 'Agreement becomes void', 'Tenant owns property'], hi: ['किरायेदार को तुरंत खाली करना होगा', 'मौजूदा समझौता नए मालिक के साथ जारी रहता है', 'समझौता रद्द हो जाता है', 'किरायेदार संपत्ति का मालिक बनता है'], mr: ['भाडेकरूला तात्काळ खाली करावे लागेल', 'विद्यमान करार नवीन मालकासोबत सुरू राहतो', 'करार रद्द होतो', 'भाडेकरू मालमत्तेचा मालक होतो'] },
      correctIndex: 1,
      explanation: { en: 'Registered agreement continues even if property is sold.', hi: 'रजिस्टर्ड समझौता संपत्ति बेचने पर भी जारी रहता है।', mr: 'नोंदणीकृत करार मालमत्ता विकल्यावरही सुरू राहतो.' }
    },
    {
      id: 'tenant19',
      question: { en: 'Who should pay society maintenance?', hi: 'सोसाइटी मेंटेनेंस कौन देता है?', mr: 'सोसायटी मेंटेनन्स कोण भरतो?' },
      options: { en: ['Always landlord', 'As per agreement usually tenant', 'Always tenant', 'Government'], hi: ['हमेशा मकान मालिक', 'समझौते के अनुसार आमतौर पर किरायेदार', 'हमेशा किरायेदार', 'सरकार'], mr: ['नेहमी मालक', 'कराराप्रमाणे सामान्यतः भाडेकरू', 'नेहमी भाडेकरू', 'सरकार'] },
      correctIndex: 1,
      explanation: { en: 'Society maintenance is usually paid by tenant as per agreement.', hi: 'सोसाइटी मेंटेनेंस आमतौर पर समझौते के अनुसार किरायेदार देता है।', mr: 'सोसायटी मेंटेनन्स सामान्यतः कराराप्रमाणे भाडेकरू भरतो.' }
    },
    {
      id: 'tenant20',
      question: { en: 'Is police verification of tenant mandatory?', hi: 'क्या किरायेदार का पुलिस सत्यापन अनिवार्य है?', mr: 'भाडेकरूचे पोलीस सत्यापन अनिवार्य आहे का?' },
      options: { en: ['No', 'Yes, in most states', 'Only for foreigners', 'Only in Delhi'], hi: ['नहीं', 'हां, अधिकांश राज्यों में', 'केवल विदेशियों के लिए', 'केवल दिल्ली में'], mr: ['नाही', 'हो, बहुतेक राज्यांमध्ये', 'फक्त विदेशींसाठी', 'फक्त दिल्लीत'] },
      correctIndex: 1,
      explanation: { en: 'Police verification is mandatory in most Indian states.', hi: 'अधिकांश भारतीय राज्यों में पुलिस सत्यापन अनिवार्य है।', mr: 'बहुतेक भारतीय राज्यांमध्ये पोलीस सत्यापन अनिवार्य आहे.' }
    },
    {
      id: 'tenant21',
      question: { en: 'Can tenant deny entry for inspection?', hi: 'क्या किरायेदार निरीक्षण के लिए प्रवेश से मना कर सकता है?', mr: 'भाडेकरू तपासणीसाठी प्रवेश नाकारू शकतो का?' },
      options: { en: ['Yes, always', 'No, with proper notice tenant should allow', 'Depends on time', 'Only on weekends'], hi: ['हां, हमेशा', 'नहीं, उचित सूचना के साथ किरायेदार को अनुमति देनी चाहिए', 'समय पर निर्भर', 'केवल सप्ताहांत में'], mr: ['हो, नेहमी', 'नाही, योग्य नोटिसने भाडेकरूने परवानगी द्यावी', 'वेळेवर अवलंबून', 'फक्त आठवड्याच्या शेवटी'] },
      correctIndex: 1,
      explanation: { en: 'Tenant should allow inspection with reasonable prior notice.', hi: 'उचित पूर्व सूचना के साथ किरायेदार को निरीक्षण की अनुमति देनी चाहिए।', mr: 'वाजवी आगाऊ नोटिसने भाडेकरूने तपासणीची परवानगी द्यावी.' }
    },
    {
      id: 'tenant22',
      question: { en: 'Stamp duty on rent agreement is paid by?', hi: 'किराया समझौते पर स्टांप ड्यूटी कौन देता है?', mr: 'भाडे करारावरील मुद्रांक शुल्क कोण भरतो?' },
      options: { en: ['Only tenant', 'Only landlord', 'Usually shared or as agreed', 'Government'], hi: ['केवल किरायेदार', 'केवल मकान मालिक', 'आमतौर पर साझा या सहमति के अनुसार', 'सरकार'], mr: ['फक्त भाडेकरू', 'फक्त मालक', 'सामान्यतः वाटून किंवा सहमतीने', 'सरकार'] },
      correctIndex: 2,
      explanation: { en: 'Stamp duty is usually shared or as mutually agreed.', hi: 'स्टांप ड्यूटी आमतौर पर साझा या आपसी सहमति से होती है।', mr: 'मुद्रांक शुल्क सामान्यतः वाटून किंवा परस्पर सहमतीने भरले जाते.' }
    },
    {
      id: 'tenant23',
      question: { en: 'What if landlord refuses repairs?', hi: 'अगर मकान मालिक मरम्मत से मना करे तो?', mr: 'मालकाने दुरुस्ती नाकारली तर काय?' },
      options: { en: ['Tenant must do all repairs', 'Tenant can deduct from rent with notice', 'Stop paying rent', 'Nothing can be done'], hi: ['किरायेदार को सभी मरम्मत करनी होगी', 'किरायेदार नोटिस के साथ किराये से काट सकता है', 'किराया देना बंद करें', 'कुछ नहीं किया जा सकता'], mr: ['भाडेकरूने सर्व दुरुस्त्या कराव्यात', 'भाडेकरू नोटिसने भाड्यातून वजा करू शकतो', 'भाडे देणे थांबवा', 'काहीही करता येत नाही'] },
      correctIndex: 1,
      explanation: { en: 'Tenant can do repairs and deduct cost from rent with proper documentation.', hi: 'किरायेदार मरम्मत करके उचित दस्तावेज के साथ किराये से लागत काट सकता है।', mr: 'भाडेकरू दुरुस्ती करून योग्य दस्तऐवजीकरणासह भाड्यातून खर्च वजा करू शकतो.' }
    },
    {
      id: 'tenant24',
      question: { en: 'Model Tenancy Act was passed in which year?', hi: 'मॉडल किरायेदारी अधिनियम किस वर्ष पारित हुआ?', mr: 'मॉडेल भाडेकरू कायदा कोणत्या वर्षी मंजूर झाला?' },
      options: { en: ['2019', '2021', '2023', 'Not yet passed'], hi: ['2019', '2021', '2023', 'अभी तक पारित नहीं'], mr: ['2019', '2021', '2023', 'अजून मंजूर झाला नाही'] },
      correctIndex: 1,
      explanation: { en: 'Model Tenancy Act was approved by Union Cabinet in 2021.', hi: 'मॉडल किरायेदारी अधिनियम 2021 में केंद्रीय मंत्रिमंडल द्वारा अनुमोदित किया गया।', mr: 'मॉडेल भाडेकरू कायदा 2021 मध्ये केंद्रीय मंत्रिमंडळाने मंजूर केला.' }
    },
    {
      id: 'tenant25',
      question: { en: 'E-stamping for rent agreement is available?', hi: 'किराया समझौते के लिए ई-स्टांपिंग उपलब्ध है?', mr: 'भाडे करारासाठी ई-स्टँपिंग उपलब्ध आहे?' },
      options: { en: ['No', 'Yes, in most states', 'Only for commercial', 'Only above Rs 1 lakh'], hi: ['नहीं', 'हां, अधिकांश राज्यों में', 'केवल व्यावसायिक के लिए', 'केवल Rs 1 लाख से ऊपर'], mr: ['नाही', 'हो, बहुतेक राज्यांमध्ये', 'फक्त व्यावसायिकसाठी', 'फक्त Rs 1 लाखाच्या वर'] },
      correctIndex: 1,
      explanation: { en: 'E-stamping is available in most states for convenience.', hi: 'सुविधा के लिए अधिकांश राज्यों में ई-स्टांपिंग उपलब्ध है।', mr: 'सोयीसाठी बहुतेक राज्यांमध्ये ई-स्टँपिंग उपलब्ध आहे.' }
    }
  ],
  senior_citizen_rights: [
    {
      id: 'sc1',
      question: { en: 'At what age is someone considered a senior citizen?', hi: 'किस उम्र में कोई वरिष्ठ नागरिक माना जाता है?', mr: 'कोणत्या वयात कोणाला ज्येष्ठ नागरिक मानले जाते?' },
      options: { en: ['50 years', '55 years', '60 years', '65 years'], hi: ['50 वर्ष', '55 वर्ष', '60 वर्ष', '65 वर्ष'], mr: ['50 वर्षे', '55 वर्षे', '60 वर्षे', '65 वर्षे'] },
      correctIndex: 2,
      explanation: { en: 'In India, 60 years is the age for senior citizen status.', hi: 'भारत में, 60 वर्ष वरिष्ठ नागरिक की उम्र है।', mr: 'भारतात, 60 वर्षे ज्येष्ठ नागरिक दर्जाचे वय आहे.' }
    },
    {
      id: 'sc2',
      question: { en: 'Which act protects senior citizens in India?', hi: 'कौन सा अधिनियम भारत में वरिष्ठ नागरिकों की रक्षा करता है?', mr: 'भारतात ज्येष्ठ नागरिकांचे संरक्षण कोणता कायदा करतो?' },
      options: { en: ['Senior Citizens Act 2007', 'Maintenance Act 2007', 'Protection Act 2010', 'Welfare Act 2005'], hi: ['वरिष्ठ नागरिक अधिनियम 2007', 'भरण-पोषण अधिनियम 2007', 'संरक्षण अधिनियम 2010', 'कल्याण अधिनियम 2005'], mr: ['ज्येष्ठ नागरिक कायदा 2007', 'पोषण कायदा 2007', 'संरक्षण कायदा 2010', 'कल्याण कायदा 2005'] },
      correctIndex: 1,
      explanation: { en: 'Maintenance and Welfare of Parents and Senior Citizens Act 2007.', hi: 'माता-पिता और वरिष्ठ नागरिकों का भरण-पोषण और कल्याण अधिनियम 2007।', mr: 'पालक आणि ज्येष्ठ नागरिकांचे पोषण आणि कल्याण कायदा 2007.' }
    },
    {
      id: 'sc3',
      question: { en: 'Can children be legally required to support parents?', hi: 'क्या बच्चों को कानूनी रूप से माता-पिता की मदद करनी होगी?', mr: 'मुलांना कायदेशीररित्या पालकांना मदत करणे आवश्यक आहे का?' },
      options: { en: ['No', 'Yes, by law', 'Only sons', 'Only daughters'], hi: ['नहीं', 'हां, कानून द्वारा', 'केवल बेटे', 'केवल बेटियां'], mr: ['नाही', 'हो, कायद्याने', 'फक्त मुलगे', 'फक्त मुली'] },
      correctIndex: 1,
      explanation: { en: 'Children including daughters are legally bound to maintain parents.', hi: 'बेटियों सहित बच्चे कानूनी रूप से माता-पिता का भरण-पोषण करने के लिए बाध्य हैं।', mr: 'मुलींसह मुले कायदेशीररित्या पालकांचे पोषण करण्यास बांधील आहेत.' }
    },
    {
      id: 'sc4',
      question: { en: 'Maximum maintenance amount per month under the Act?', hi: 'अधिनियम के तहत प्रति माह अधिकतम भरण-पोषण राशि?', mr: 'कायद्यानुसार दरमहा कमाल पोषण रक्कम?' },
      options: { en: ['Rs 5,000', 'Rs 10,000', 'Rs 15,000', 'No upper limit'], hi: ['Rs 5,000', 'Rs 10,000', 'Rs 15,000', 'कोई ऊपरी सीमा नहीं'], mr: ['Rs 5,000', 'Rs 10,000', 'Rs 15,000', 'कमाल मर्यादा नाही'] },
      correctIndex: 1,
      explanation: { en: 'Tribunal can order up to Rs 10,000 per month as maintenance.', hi: 'न्यायाधिकरण भरण-पोषण के रूप में Rs 10,000 प्रति माह तक का आदेश दे सकता है।', mr: 'न्यायाधिकरण पोषण म्हणून दरमहा Rs 10,000 पर्यंत आदेश देऊ शकते.' }
    },
    {
      id: 'sc5',
      question: { en: 'Can property given to children be taken back?', hi: 'क्या बच्चों को दी गई संपत्ति वापस ली जा सकती है?', mr: 'मुलांना दिलेली मालमत्ता परत घेता येते का?' },
      options: { en: ['Never', 'Yes, if they neglect parents', 'Only partially', 'Only after death'], hi: ['कभी नहीं', 'हां, अगर वे माता-पिता की उपेक्षा करें', 'केवल आंशिक रूप से', 'केवल मृत्यु के बाद'], mr: ['कधीच नाही', 'हो, जर त्यांनी पालकांची उपेक्षा केली', 'फक्त अंशतः', 'फक्त मृत्यूनंतर'] },
      correctIndex: 1,
      explanation: { en: 'Transfer can be cancelled if children fail to provide maintenance.', hi: 'अगर बच्चे भरण-पोषण न करें तो हस्तांतरण रद्द हो सकता है।', mr: 'मुलांनी पोषण न केल्यास हस्तांतरण रद्द होऊ शकते.' }
    },
    {
      id: 'sc6',
      question: { en: 'Where to file complaint for maintenance?', hi: 'भरण-पोषण की शिकायत कहां दर्ज करें?', mr: 'पोषणासाठी तक्रार कुठे दाखल करावी?' },
      options: { en: ['Police station', 'Maintenance Tribunal', 'Consumer Court', 'NGO'], hi: ['पुलिस स्टेशन', 'भरण-पोषण न्यायाधिकरण', 'उपभोक्ता अदालत', 'NGO'], mr: ['पोलीस स्टेशन', 'पोषण न्यायाधिकरण', 'ग्राहक न्यायालय', 'NGO'] },
      correctIndex: 1,
      explanation: { en: 'Maintenance Tribunal at district level handles such cases.', hi: 'जिला स्तर पर भरण-पोषण न्यायाधिकरण ऐसे मामलों को संभालता है।', mr: 'जिल्हा स्तरावरील पोषण न्यायाधिकरण अशा प्रकरणांची हाताळणी करते.' }
    },
    {
      id: 'sc7',
      question: { en: 'Within how many days should tribunal decide?', hi: 'न्यायाधिकरण को कितने दिनों में फैसला करना चाहिए?', mr: 'न्यायाधिकरणाने किती दिवसांत निर्णय द्यावा?' },
      options: { en: ['30 days', '60 days', '90 days', '180 days'], hi: ['30 दिन', '60 दिन', '90 दिन', '180 दिन'], mr: ['30 दिवस', '60 दिवस', '90 दिवस', '180 दिवस'] },
      correctIndex: 2,
      explanation: { en: 'Tribunal should decide within 90 days of receiving application.', hi: 'न्यायाधिकरण को आवेदन मिलने के 90 दिनों के भीतर फैसला करना चाहिए।', mr: 'न्यायाधिकरणाने अर्ज मिळाल्यापासून 90 दिवसांच्या आत निर्णय द्यावा.' }
    },
    {
      id: 'sc8',
      question: { en: 'Elder abuse helpline number?', hi: 'वृद्ध दुर्व्यवहार हेल्पलाइन नंबर?', mr: 'ज्येष्ठ दुर्व्यवहार हेल्पलाइन नंबर?' },
      options: { en: ['100', '181', '14567', '112'], hi: ['100', '181', '14567', '112'], mr: ['100', '181', '14567', '112'] },
      correctIndex: 2,
      explanation: { en: 'Elder helpline is 14567 (Elderline).', hi: 'वृद्ध हेल्पलाइन 14567 (एल्डरलाइन) है।', mr: 'ज्येष्ठ हेल्पलाइन 14567 (एल्डरलाइन) आहे.' }
    },
    {
      id: 'sc9',
      question: { en: 'Tax benefit limit for senior citizens?', hi: 'वरिष्ठ नागरिकों के लिए कर लाभ सीमा?', mr: 'ज्येष्ठ नागरिकांसाठी कर लाभ मर्यादा?' },
      options: { en: ['Rs 2.5 lakh', 'Rs 3 lakh', 'Rs 5 lakh', 'Rs 10 lakh'], hi: ['Rs 2.5 लाख', 'Rs 3 लाख', 'Rs 5 लाख', 'Rs 10 लाख'], mr: ['Rs 2.5 लाख', 'Rs 3 लाख', 'Rs 5 लाख', 'Rs 10 लाख'] },
      correctIndex: 1,
      explanation: { en: 'Senior citizens have basic exemption limit of Rs 3 lakh.', hi: 'वरिष्ठ नागरिकों की मूल छूट सीमा Rs 3 लाख है।', mr: 'ज्येष्ठ नागरिकांची मूळ सूट मर्यादा Rs 3 लाख आहे.' }
    },
    {
      id: 'sc10',
      question: { en: 'Super senior citizen age for extra tax benefits?', hi: 'अतिरिक्त कर लाभ के लिए अति वरिष्ठ नागरिक की आयु?', mr: 'अतिरिक्त कर लाभासाठी अति ज्येष्ठ नागरिकाचे वय?' },
      options: { en: ['70 years', '75 years', '80 years', '85 years'], hi: ['70 वर्ष', '75 वर्ष', '80 वर्ष', '85 वर्ष'], mr: ['70 वर्षे', '75 वर्षे', '80 वर्षे', '85 वर्षे'] },
      correctIndex: 2,
      explanation: { en: '80 years and above are super senior citizens with Rs 5 lakh exemption.', hi: '80 वर्ष और उससे अधिक अति वरिष्ठ नागरिक हैं जिनकी Rs 5 लाख छूट है।', mr: '80 वर्षे आणि त्यावरील अति ज्येष्ठ नागरिक आहेत ज्यांना Rs 5 लाख सूट आहे.' }
    },
    {
      id: 'sc11',
      question: { en: 'Do senior citizens get priority in hospitals?', hi: 'क्या वरिष्ठ नागरिकों को अस्पतालों में प्राथमिकता मिलती है?', mr: 'ज्येष्ठ नागरिकांना रुग्णालयांमध्ये प्राधान्य मिळते का?' },
      options: { en: ['No', 'Yes, in government hospitals', 'Only in emergencies', 'Only for surgeries'], hi: ['नहीं', 'हां, सरकारी अस्पतालों में', 'केवल आपातकाल में', 'केवल सर्जरी के लिए'], mr: ['नाही', 'हो, सरकारी रुग्णालयांमध्ये', 'फक्त आपत्कालीन परिस्थितीत', 'फक्त शस्त्रक्रियेसाठी'] },
      correctIndex: 1,
      explanation: { en: 'Senior citizens get priority services in government hospitals.', hi: 'वरिष्ठ नागरिकों को सरकारी अस्पतालों में प्राथमिकता सेवाएं मिलती हैं।', mr: 'ज्येष्ठ नागरिकांना सरकारी रुग्णालयांमध्ये प्राधान्य सेवा मिळतात.' }
    },
    {
      id: 'sc12',
      question: { en: 'Who can claim maintenance from children?', hi: 'कौन बच्चों से भरण-पोषण का दावा कर सकता है?', mr: 'मुलांकडून पोषणाचा दावा कोण करू शकतो?' },
      options: { en: ['Only father', 'Only mother', 'Both parents and grandparents', 'Only grandparents'], hi: ['केवल पिता', 'केवल माता', 'माता-पिता और दादा-दादी दोनों', 'केवल दादा-दादी'], mr: ['फक्त वडील', 'फक्त आई', 'पालक आणि आजी-आजोबा दोन्ही', 'फक्त आजी-आजोबा'] },
      correctIndex: 2,
      explanation: { en: 'Parents and grandparents both can claim maintenance.', hi: 'माता-पिता और दादा-दादी दोनों भरण-पोषण का दावा कर सकते हैं।', mr: 'पालक आणि आजी-आजोबा दोन्ही पोषणाचा दावा करू शकतात.' }
    },
    {
      id: 'sc13',
      question: { en: 'Railway concession for senior citizens is how much?', hi: 'वरिष्ठ नागरिकों के लिए रेलवे रियायत कितनी है?', mr: 'ज्येष्ठ नागरिकांसाठी रेल्वे सवलत किती आहे?' },
      options: { en: ['10%', '25%', '40% for men 50% for women', '50% for all'], hi: ['10%', '25%', 'पुरुषों के लिए 40% महिलाओं के लिए 50%', 'सभी के लिए 50%'], mr: ['10%', '25%', 'पुरुषांसाठी 40% महिलांसाठी 50%', 'सर्वांसाठी 50%'] },
      correctIndex: 2,
      explanation: { en: 'Railway gives 40% concession to men and 50% to women seniors.', hi: 'रेलवे वरिष्ठ पुरुषों को 40% और महिलाओं को 50% रियायत देता है।', mr: 'रेल्वे ज्येष्ठ पुरुषांना 40% आणि महिलांना 50% सवलत देते.' }
    },
    {
      id: 'sc14',
      question: { en: 'IGNOAPS pension scheme is for whom?', hi: 'IGNOAPS पेंशन योजना किसके लिए है?', mr: 'IGNOAPS पेंशन योजना कोणासाठी आहे?' },
      options: { en: ['All senior citizens', 'BPL senior citizens', 'Government employees', 'Widows only'], hi: ['सभी वरिष्ठ नागरिक', 'BPL वरिष्ठ नागरिक', 'सरकारी कर्मचारी', 'केवल विधवाएं'], mr: ['सर्व ज्येष्ठ नागरिक', 'BPL ज्येष्ठ नागरिक', 'सरकारी कर्मचारी', 'फक्त विधवा'] },
      correctIndex: 1,
      explanation: { en: 'IGNOAPS is for BPL senior citizens above 60 years.', hi: 'IGNOAPS 60 वर्ष से अधिक BPL वरिष्ठ नागरिकों के लिए है।', mr: 'IGNOAPS 60 वर्षांवरील BPL ज्येष्ठ नागरिकांसाठी आहे.' }
    },
    {
      id: 'sc15',
      question: { en: 'Can senior citizen be evicted from their house by children?', hi: 'क्या बच्चे वरिष्ठ नागरिक को उनके घर से बेदखल कर सकते हैं?', mr: 'मुले ज्येष्ठ नागरिकांना त्यांच्या घरातून बेदखल करू शकतात का?' },
      options: { en: ['Yes', 'No, it is illegal', 'After court order', 'With 1 month notice'], hi: ['हां', 'नहीं, यह गैरकानूनी है', 'अदालत के आदेश के बाद', '1 महीने की नोटिस के साथ'], mr: ['हो', 'नाही, ते बेकायदेशीर आहे', 'न्यायालयाच्या आदेशानंतर', '1 महिन्याच्या नोटिसने'] },
      correctIndex: 1,
      explanation: { en: 'Evicting senior citizens from their own property is illegal.', hi: 'वरिष्ठ नागरिकों को उनकी अपनी संपत्ति से बेदखल करना गैरकानूनी है।', mr: 'ज्येष्ठ नागरिकांना त्यांच्या स्वतःच्या मालमत्तेतून बेदखल करणे बेकायदेशीर आहे.' }
    },
    {
      id: 'sc16',
      question: { en: 'Punishment for abandoning senior citizen?', hi: 'वरिष्ठ नागरिक को छोड़ने की सजा?', mr: 'ज्येष्ठ नागरिकांना सोडून देण्याची शिक्षा?' },
      options: { en: ['Warning', 'Up to 3 months jail', 'Fine only', 'No punishment'], hi: ['चेतावनी', '3 महीने तक जेल', 'केवल जुर्माना', 'कोई सजा नहीं'], mr: ['इशारा', '3 महिन्यांपर्यंत तुरुंगवास', 'फक्त दंड', 'शिक्षा नाही'] },
      correctIndex: 1,
      explanation: { en: 'Abandoning parents can lead to 3 months imprisonment or fine.', hi: 'माता-पिता को छोड़ने पर 3 महीने की जेल या जुर्माना हो सकता है।', mr: 'पालकांना सोडून दिल्यास 3 महिने तुरुंगवास किंवा दंड होऊ शकतो.' }
    },
    {
      id: 'sc17',
      question: { en: 'Is free legal aid available for senior citizens?', hi: 'क्या वरिष्ठ नागरिकों के लिए मुफ्त कानूनी सहायता उपलब्ध है?', mr: 'ज्येष्ठ नागरिकांसाठी मोफत कायदेशीर मदत उपलब्ध आहे का?' },
      options: { en: ['No', 'Yes, under Legal Services Authority Act', 'Only for poor', 'Only for women'], hi: ['नहीं', 'हां, विधिक सेवा प्राधिकरण अधिनियम के तहत', 'केवल गरीबों के लिए', 'केवल महिलाओं के लिए'], mr: ['नाही', 'हो, कायदेशीर सेवा प्राधिकरण कायद्यानुसार', 'फक्त गरिबांसाठी', 'फक्त महिलांसाठी'] },
      correctIndex: 1,
      explanation: { en: 'Free legal aid is available to all senior citizens.', hi: 'सभी वरिष्ठ नागरिकों के लिए मुफ्त कानूनी सहायता उपलब्ध है।', mr: 'सर्व ज्येष्ठ नागरिकांसाठी मोफत कायदेशीर मदत उपलब्ध आहे.' }
    },
    {
      id: 'sc18',
      question: { en: 'Can senior citizen will property to anyone?', hi: 'क्या वरिष्ठ नागरिक किसी को भी संपत्ति वसीयत कर सकता है?', mr: 'ज्येष्ठ नागरिक कोणालाही मालमत्ता मृत्युपत्राने देऊ शकतो का?' },
      options: { en: ['No, only to children', 'Yes, to anyone', 'Only to relatives', 'Only to spouse'], hi: ['नहीं, केवल बच्चों को', 'हां, किसी को भी', 'केवल रिश्तेदारों को', 'केवल जीवनसाथी को'], mr: ['नाही, फक्त मुलांना', 'हो, कोणालाही', 'फक्त नातेवाईकांना', 'फक्त जोडीदाराला'] },
      correctIndex: 1,
      explanation: { en: 'Senior citizens can bequeath property to anyone through will.', hi: 'वरिष्ठ नागरिक वसीयत के माध्यम से किसी को भी संपत्ति दे सकते हैं।', mr: 'ज्येष्ठ नागरिक मृत्युपत्राद्वारे कोणालाही मालमत्ता देऊ शकतात.' }
    },
    {
      id: 'sc19',
      question: { en: 'What is reverse mortgage for senior citizens?', hi: 'वरिष्ठ नागरिकों के लिए रिवर्स मॉर्टगेज क्या है?', mr: 'ज्येष्ठ नागरिकांसाठी रिव्हर्स मॉर्टगेज म्हणजे काय?' },
      options: { en: ['Selling property', 'Loan against property while living in it', 'Renting property', 'Donating property'], hi: ['संपत्ति बेचना', 'उसमें रहते हुए संपत्ति पर ऋण', 'संपत्ति किराये पर देना', 'संपत्ति दान करना'], mr: ['मालमत्ता विकणे', 'त्यात राहत असताना मालमत्तेवर कर्ज', 'मालमत्ता भाड्याने देणे', 'मालमत्ता दान करणे'] },
      correctIndex: 1,
      explanation: { en: 'Reverse mortgage allows seniors to get income while staying in home.', hi: 'रिवर्स मॉर्टगेज वरिष्ठ नागरिकों को घर में रहते हुए आय प्राप्त करने की अनुमति देता है।', mr: 'रिव्हर्स मॉर्टगेज ज्येष्ठांना घरात राहून उत्पन्न मिळवण्याची परवानगी देते.' }
    },
    {
      id: 'sc20',
      question: { en: 'Interest rate on senior citizen FD is usually?', hi: 'वरिष्ठ नागरिक FD पर ब्याज दर आमतौर पर?', mr: 'ज्येष्ठ नागरिक FD वर व्याजदर सामान्यतः?' },
      options: { en: ['Same as regular', '0.25-0.5% higher than regular', '1% lower', 'No fixed rate'], hi: ['सामान्य के समान', 'सामान्य से 0.25-0.5% अधिक', '1% कम', 'कोई निश्चित दर नहीं'], mr: ['सामान्य सारखाच', 'सामान्यपेक्षा 0.25-0.5% जास्त', '1% कमी', 'निश्चित दर नाही'] },
      correctIndex: 1,
      explanation: { en: 'Banks offer 0.25-0.5% higher interest on senior citizen FDs.', hi: 'बैंक वरिष्ठ नागरिक FD पर 0.25-0.5% अधिक ब्याज देते हैं।', mr: 'बँका ज्येष्ठ नागरिक FD वर 0.25-0.5% जास्त व्याज देतात.' }
    },
    {
      id: 'sc21',
      question: { en: 'Pradhan Mantri Vaya Vandana Yojana is?', hi: 'प्रधानमंत्री वय वंदना योजना क्या है?', mr: 'प्रधानमंत्री वय वंदना योजना म्हणजे काय?' },
      options: { en: ['Health insurance', 'Pension scheme', 'Housing scheme', 'Travel scheme'], hi: ['स्वास्थ्य बीमा', 'पेंशन योजना', 'आवास योजना', 'यात्रा योजना'], mr: ['आरोग्य विमा', 'पेंशन योजना', 'गृहनिर्माण योजना', 'प्रवास योजना'] },
      correctIndex: 1,
      explanation: { en: 'PMVVY is a pension scheme for senior citizens by LIC.', hi: 'PMVVY LIC द्वारा वरिष्ठ नागरिकों के लिए पेंशन योजना है।', mr: 'PMVVY हे LIC द्वारे ज्येष्ठ नागरिकांसाठी पेंशन योजना आहे.' }
    },
    {
      id: 'sc22',
      question: { en: 'Who is responsible for old age homes?', hi: 'वृद्धाश्रमों की जिम्मेदारी किसकी है?', mr: 'वृद्धाश्रमांची जबाबदारी कोणाची आहे?' },
      options: { en: ['Central government only', 'State government', 'Private sector only', 'NGOs only'], hi: ['केवल केंद्र सरकार', 'राज्य सरकार', 'केवल निजी क्षेत्र', 'केवल NGOs'], mr: ['फक्त केंद्र सरकार', 'राज्य सरकार', 'फक्त खाजगी क्षेत्र', 'फक्त NGOs'] },
      correctIndex: 1,
      explanation: { en: 'State governments are primarily responsible for old age homes.', hi: 'वृद्धाश्रमों के लिए मुख्य रूप से राज्य सरकारें जिम्मेदार हैं।', mr: 'वृद्धाश्रमांसाठी प्रामुख्याने राज्य सरकार जबाबदार आहे.' }
    },
    {
      id: 'sc23',
      question: { en: 'Senior Citizens Savings Scheme max deposit limit?', hi: 'वरिष्ठ नागरिक बचत योजना अधिकतम जमा सीमा?', mr: 'ज्येष्ठ नागरिक बचत योजना कमाल ठेव मर्यादा?' },
      options: { en: ['Rs 15 lakh', 'Rs 30 lakh', 'Rs 50 lakh', 'No limit'], hi: ['Rs 15 लाख', 'Rs 30 लाख', 'Rs 50 लाख', 'कोई सीमा नहीं'], mr: ['Rs 15 लाख', 'Rs 30 लाख', 'Rs 50 लाख', 'मर्यादा नाही'] },
      correctIndex: 1,
      explanation: { en: 'SCSS has a maximum deposit limit of Rs 30 lakh.', hi: 'SCSS की अधिकतम जमा सीमा Rs 30 लाख है।', mr: 'SCSS ची कमाल ठेव मर्यादा Rs 30 लाख आहे.' }
    },
    {
      id: 'sc24',
      question: { en: 'Can maintenance order be appealed?', hi: 'क्या भरण-पोषण आदेश की अपील हो सकती है?', mr: 'पोषण आदेशाची अपील होऊ शकते का?' },
      options: { en: ['No', 'Yes, to Appellate Tribunal', 'Only to High Court', 'Only to Supreme Court'], hi: ['नहीं', 'हां, अपीलीय न्यायाधिकरण में', 'केवल उच्च न्यायालय में', 'केवल सुप्रीम कोर्ट में'], mr: ['नाही', 'हो, अपील न्यायाधिकरणात', 'फक्त उच्च न्यायालयात', 'फक्त सर्वोच्च न्यायालयात'] },
      correctIndex: 1,
      explanation: { en: 'Appeal against tribunal order goes to Appellate Tribunal within 60 days.', hi: 'न्यायाधिकरण के आदेश के खिलाफ अपील 60 दिनों के भीतर अपीलीय न्यायाधिकरण में जाती है।', mr: 'न्यायाधिकरणाच्या आदेशाविरुद्ध अपील 60 दिवसांच्या आत अपील न्यायाधिकरणात जाते.' }
    },
    {
      id: 'sc25',
      question: { en: 'What is the role of District Magistrate in senior citizen protection?', hi: 'वरिष्ठ नागरिक संरक्षण में जिला मजिस्ट्रेट की भूमिका क्या है?', mr: 'ज्येष्ठ नागरिक संरक्षणात जिल्हा दंडाधिकाऱ्याची भूमिका काय आहे?' },
      options: { en: ['No role', 'Heads the Maintenance Tribunal', 'Only advisory role', 'Only for emergencies'], hi: ['कोई भूमिका नहीं', 'भरण-पोषण न्यायाधिकरण का प्रमुख', 'केवल सलाहकार भूमिका', 'केवल आपातकाल के लिए'], mr: ['भूमिका नाही', 'पोषण न्यायाधिकरणाचा प्रमुख', 'फक्त सल्लागार भूमिका', 'फक्त आपत्कालीन परिस्थितीसाठी'] },
      correctIndex: 1,
      explanation: { en: 'District Magistrate or SDM heads the Maintenance Tribunal.', hi: 'जिला मजिस्ट्रेट या SDM भरण-पोषण न्यायाधिकरण का प्रमुख होता है।', mr: 'जिल्हा दंडाधिकारी किंवा SDM पोषण न्यायाधिकरणाचे प्रमुख असतात.' }
    }
  ]
};
