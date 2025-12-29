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
  ]
};
