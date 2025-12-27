-- ===================================================
-- HOSPITAL SITUATIONS AND DATA
-- ===================================================

-- Get the hospital category ID for reference
-- Hospital situations
INSERT INTO legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, severity_level, is_emergency, keywords) VALUES
((SELECT id FROM legal_categories WHERE category_type = 'hospital'), 'Denied Treatment at Hospital', 'अस्पताल में इलाज से मना', 'रुग्णालयात उपचार नाकारले', 'Hospital or doctor refuses to provide emergency treatment', 'अस्पताल या डॉक्टर आपातकालीन उपचार देने से इनकार करता है', 'रुग्णालय किंवा डॉक्टर आपत्कालीन उपचार देण्यास नकार देतात', 5, true, ARRAY['hospital', 'treatment denied', 'emergency', 'doctor refused', 'इलाज', 'उपचार']),
((SELECT id FROM legal_categories WHERE category_type = 'hospital'), 'Medical Negligence', 'चिकित्सा लापरवाही', 'वैद्यकीय निष्काळजीपणा', 'Wrong treatment, surgery error, or medical malpractice', 'गलत इलाज, सर्जरी में गलती, या चिकित्सा कदाचार', 'चुकीचे उपचार, शस्त्रक्रियेतील चूक, किंवा वैद्यकीय गैरव्यवहार', 4, false, ARRAY['negligence', 'wrong treatment', 'malpractice', 'surgery error', 'लापरवाही', 'निष्काळजी']),
((SELECT id FROM legal_categories WHERE category_type = 'hospital'), 'Overcharging/Bill Disputes', 'अधिक बिल/बिल विवाद', 'जास्त बिल/बिल विवाद', 'Excessive charges, hidden fees, or billing fraud', 'अत्यधिक शुल्क, छुपी फीस, या बिलिंग धोखाधड़ी', 'अत्याधिक शुल्क, लपलेले शुल्क, किंवा बिलिंग फसवणूक', 2, false, ARRAY['overcharging', 'bill', 'fraud', 'excessive charges', 'बिल', 'शुल्क']);

-- Hospital rights
INSERT INTO legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, legal_reference, priority_order) VALUES
-- Denied Treatment
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 'Every hospital must provide emergency treatment regardless of payment', 'हर अस्पताल को भुगतान की परवाह किए बिना आपातकालीन उपचार देना होगा', 'प्रत्येक रुग्णालयाने पेमेंटची पर्वा न करता आपत्कालीन उपचार द्यावे', 'Indian Medical Council (Professional Conduct) Regulations', '2002', 'Section 2.1.1', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 'Refusing emergency treatment is a punishable offence', 'आपातकालीन उपचार से इनकार करना दंडनीय अपराध है', 'आपत्कालीन उपचार नाकारणे हा दंडनीय अपराध आहे', 'Indian Penal Code', 'Section 304A', 'Negligence causing death', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 'Accident victims must be treated within the golden hour without payment', 'दुर्घटना पीड़ितों का गोल्डन ऑवर में बिना भुगतान के इलाज होना चाहिए', 'अपघातग्रस्तांवर गोल्डन अवरमध्ये विनापेमेंट उपचार व्हावेत', 'Motor Vehicles Act', '2019', 'Section 134', 3),
-- Medical Negligence
((SELECT id FROM legal_situations WHERE title_en = 'Medical Negligence'), 'Right to compensation for medical negligence', 'चिकित्सा लापरवाही के लिए मुआवजे का अधिकार', 'वैद्यकीय निष्काळजीपणासाठी भरपाईचा अधिकार', 'Consumer Protection Act', '2019', 'Section 2(42)', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Medical Negligence'), 'Right to file complaint with Medical Council', 'मेडिकल काउंसिल में शिकायत दर्ज करने का अधिकार', 'वैद्यकीय परिषदेकडे तक्रार दाखल करण्याचा अधिकार', 'Indian Medical Council Act', '1956', 'Section 20A', 2),
-- Overcharging
((SELECT id FROM legal_situations WHERE title_en = 'Overcharging/Bill Disputes'), 'Right to itemized bill with all charges', 'सभी शुल्कों के साथ विस्तृत बिल का अधिकार', 'सर्व शुल्कांसह तपशीलवार बिलाचा अधिकार', 'Clinical Establishments Act', '2010', 'Section 12', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Overcharging/Bill Disputes'), 'Right to complain to State Health Authority', 'राज्य स्वास्थ्य प्राधिकरण में शिकायत का अधिकार', 'राज्य आरोग्य प्राधिकरणाकडे तक्रारीचा अधिकार', 'Clinical Establishments Act', '2010', 'Section 15', 2);

-- Hospital dos and donts
INSERT INTO dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 'do', 'Take video/photo evidence of refusal', 'इनकार का वीडियो/फोटो साक्ष्य लें', 'नकाराचा व्हिडिओ/फोटो पुरावा घ्या', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 'do', 'Get the refusal in writing if possible', 'यदि संभव हो तो इनकार लिखित में लें', 'शक्य असल्यास लिखित नकार घ्या', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 'do', 'Call 112 or 108 ambulance immediately', 'तुरंत 112 या 108 एम्बुलेंस बुलाएं', 'लगेच 112 किंवा 108 रुग्णवाहिका बोलवा', 3),
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 'dont', 'Do not leave the patient unattended', 'रोगी को अकेला न छोड़ें', 'रुग्णाला एकट्याने सोडू नका', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 'dont', 'Do not sign any document under pressure', 'दबाव में कोई दस्तावेज़ पर हस्ताक्षर न करें', 'दबावाखाली कोणत्याही कागदपत्रावर स्वाक्षरी करू नका', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Medical Negligence'), 'do', 'Preserve all medical records and prescriptions', 'सभी मेडिकल रिकॉर्ड और प्रिस्क्रिप्शन सुरक्षित रखें', 'सर्व वैद्यकीय नोंदी आणि प्रिस्क्रिप्शन जतन करा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Medical Negligence'), 'do', 'Get a second opinion from another doctor', 'किसी अन्य डॉक्टर से दूसरी राय लें', 'दुसऱ्या डॉक्टरांचे मत घ्या', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Medical Negligence'), 'dont', 'Do not destroy any evidence or documents', 'कोई भी साक्ष्य या दस्तावेज़ नष्ट न करें', 'कोणताही पुरावा किंवा कागदपत्रे नष्ट करू नका', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Overcharging/Bill Disputes'), 'do', 'Ask for itemized bill with MRP of medicines', 'दवाओं के MRP के साथ विस्तृत बिल मांगें', 'औषधांच्या MRP सह तपशीलवार बिल मागा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Overcharging/Bill Disputes'), 'dont', 'Do not pay under pressure without verification', 'सत्यापन के बिना दबाव में भुगतान न करें', 'पडताळणी केल्याशिवाय दबावाखाली पेमेंट करू नका', 1);

-- Hospital action steps
INSERT INTO action_steps (situation_id, step_order, action_type, action_text_en, action_text_hi, action_text_mr, is_critical, action_data) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 1, 'call', 'Call 112 emergency helpline', '112 आपातकालीन हेल्पलाइन पर कॉल करें', '112 आणीबाणी हेल्पलाइनवर कॉल करा', true, '{"phone": "112"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 2, 'record', 'Record video of hospital staff refusing treatment', 'इलाज से इनकार करते स्टाफ का वीडियो रिकॉर्ड करें', 'उपचार नाकारणाऱ्या कर्मचाऱ्यांचे व्हिडिओ रेकॉर्ड करा', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Denied Treatment at Hospital'), 3, 'call', 'Call District Health Officer', 'जिला स्वास्थ्य अधिकारी को कॉल करें', 'जिल्हा आरोग्य अधिकाऱ्यांना कॉल करा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Medical Negligence'), 1, 'info', 'Collect all medical records from hospital', 'अस्पताल से सभी मेडिकल रिकॉर्ड इकट्ठा करें', 'रुग्णालयातून सर्व वैद्यकीय नोंदी गोळा करा', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Medical Negligence'), 2, 'generate_document', 'File complaint with State Medical Council', 'राज्य मेडिकल काउंसिल में शिकायत दर्ज करें', 'राज्य वैद्यकीय परिषदेकडे तक्रार दाखल करा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Overcharging/Bill Disputes'), 1, 'info', 'Compare rates with government rate chart', 'सरकारी दर सूची से तुलना करें', 'सरकारी दर यादीशी तुलना करा', false, '{}');

-- ===================================================
-- WORKPLACE SITUATIONS AND DATA
-- ===================================================

INSERT INTO legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, severity_level, is_emergency, keywords) VALUES
((SELECT id FROM legal_categories WHERE category_type = 'workplace'), 'Sexual Harassment at Work', 'कार्यस्थल पर यौन उत्पीड़न', 'कामाच्या ठिकाणी लैंगिक छळ', 'Unwanted sexual advances, comments, or conduct at workplace', 'कार्यस्थल पर अवांछित यौन प्रस्ताव, टिप्पणियां, या आचरण', 'कामाच्या ठिकाणी अवांछित लैंगिक प्रस्ताव, टिप्पण्या, किंवा वर्तन', 5, true, ARRAY['sexual harassment', 'POSH', 'workplace', 'यौन उत्पीड़न', 'लैंगिक छळ']),
((SELECT id FROM legal_categories WHERE category_type = 'workplace'), 'Salary Not Paid', 'वेतन नहीं मिला', 'पगार मिळाला नाही', 'Employer not paying salary or delaying payment', 'नियोक्ता वेतन नहीं दे रहा या देरी कर रहा', 'नियोक्ता पगार देत नाही किंवा उशीर करत आहे', 3, false, ARRAY['salary', 'wages', 'payment', 'वेतन', 'पगार']),
((SELECT id FROM legal_categories WHERE category_type = 'workplace'), 'Wrongful Termination', 'गलत तरीके से नौकरी से निकालना', 'चुकीच्या पद्धतीने नोकरीतून काढणे', 'Fired without proper notice, reason, or procedure', 'बिना उचित नोटिस, कारण, या प्रक्रिया के निकाला गया', 'योग्य नोटीस, कारण, किंवा प्रक्रियेशिवाय काढून टाकले', 3, false, ARRAY['termination', 'fired', 'dismissed', 'नौकरी', 'नोकरी']);

-- Workplace rights
INSERT INTO legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, legal_reference, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 'Right to file complaint with Internal Complaints Committee', 'आंतरिक शिकायत समिति में शिकायत दर्ज करने का अधिकार', 'अंतर्गत तक्रार समितीकडे तक्रार दाखल करण्याचा अधिकार', 'POSH Act', '2013', 'Section 9', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 'Right to confidentiality during investigation', 'जांच के दौरान गोपनीयता का अधिकार', 'तपासादरम्यान गोपनीयतेचा अधिकार', 'POSH Act', '2013', 'Section 16', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 'Right to interim relief during pendency', 'लंबित मामले के दौरान अंतरिम राहत का अधिकार', 'प्रलंबित प्रकरणादरम्यान अंतरिम दिलासाचा अधिकार', 'POSH Act', '2013', 'Section 12', 3),
((SELECT id FROM legal_situations WHERE title_en = 'Salary Not Paid'), 'Right to receive wages within 7 days of wage period', 'वेतन अवधि के 7 दिनों के भीतर वेतन प्राप्त करने का अधिकार', 'वेतन कालावधीच्या 7 दिवसांत वेतन मिळण्याचा अधिकार', 'Payment of Wages Act', '1936', 'Section 5', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Salary Not Paid'), 'Right to claim interest on delayed wages', 'विलंबित वेतन पर ब्याज का दावा करने का अधिकार', 'उशीरा वेतनावर व्याजाचा दावा करण्याचा अधिकार', 'Payment of Wages Act', '1936', 'Section 4', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Wrongful Termination'), 'Right to one month notice or pay in lieu', 'एक महीने की नोटिस या उसके बदले वेतन का अधिकार', 'एक महिन्याची नोटीस किंवा त्याऐवजी वेतनाचा अधिकार', 'Industrial Disputes Act', '1947', 'Section 25F', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Wrongful Termination'), 'Right to reinstatement with back wages', 'बकाया वेतन के साथ पुनर्बहाली का अधिकार', 'थकित वेतनासह पुनर्स्थापनेचा अधिकार', 'Industrial Disputes Act', '1947', 'Section 25H', 2);

-- Workplace dos and donts
INSERT INTO dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 'do', 'Document every incident with date, time, and witnesses', 'हर घटना को तारीख, समय और गवाहों के साथ दर्ज करें', 'प्रत्येक घटना तारीख, वेळ आणि साक्षीदारांसह नोंदवा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 'do', 'File written complaint with ICC within 3 months', 'ICC में 3 महीने के भीतर लिखित शिकायत दर्ज करें', 'ICC कडे 3 महिन्यांच्या आत लिखित तक्रार दाखल करा', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 'dont', 'Do not discuss the case with colleagues', 'सहकर्मियों के साथ मामले पर चर्चा न करें', 'सहकाऱ्यांशी प्रकरणाबद्दल चर्चा करू नका', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Salary Not Paid'), 'do', 'Keep record of all salary slips and bank statements', 'सभी वेतन पर्चियों और बैंक स्टेटमेंट का रिकॉर्ड रखें', 'सर्व पगार स्लिप आणि बँक स्टेटमेंटची नोंद ठेवा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Salary Not Paid'), 'do', 'Send written reminder to employer first', 'पहले नियोक्ता को लिखित अनुस्मारक भेजें', 'प्रथम नियोक्त्याला लिखित स्मरणपत्र पाठवा', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Wrongful Termination'), 'do', 'Keep copy of appointment letter and termination letter', 'नियुक्ति पत्र और समाप्ति पत्र की प्रति रखें', 'नियुक्तीपत्र आणि समाप्तीपत्राची प्रत जतन करा', 1);

-- Workplace action steps
INSERT INTO action_steps (situation_id, step_order, action_type, action_text_en, action_text_hi, action_text_mr, is_critical, action_data) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 1, 'record', 'Document the incident in writing immediately', 'तुरंत घटना का लिखित में दस्तावेज़ बनाएं', 'घटनेची लगेच लिखित नोंद करा', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 2, 'generate_document', 'File complaint with Internal Complaints Committee', 'आंतरिक शिकायत समिति में शिकायत दर्ज करें', 'अंतर्गत तक्रार समितीकडे तक्रार दाखल करा', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Sexual Harassment at Work'), 3, 'call', 'Contact Women Helpline if needed', 'जरूरत पड़ने पर महिला हेल्पलाइन से संपर्क करें', 'आवश्यक असल्यास महिला हेल्पलाइनशी संपर्क करा', false, '{"phone": "181"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Salary Not Paid'), 1, 'generate_document', 'Send legal notice to employer', 'नियोक्ता को कानूनी नोटिस भेजें', 'नियोक्त्याला कायदेशीर नोटीस पाठवा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Salary Not Paid'), 2, 'navigate', 'File complaint with Labour Commissioner', 'श्रम आयुक्त में शिकायत दर्ज करें', 'कामगार आयुक्तांकडे तक्रार दाखल करा', false, '{}');

-- ===================================================
-- WOMEN SAFETY SITUATIONS AND DATA  
-- ===================================================

INSERT INTO legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, severity_level, is_emergency, keywords) VALUES
((SELECT id FROM legal_categories WHERE category_type = 'women_safety'), 'Domestic Violence', 'घरेलू हिंसा', 'घरगुती हिंसा', 'Physical, emotional, or financial abuse by family member', 'परिवार के सदस्य द्वारा शारीरिक, भावनात्मक, या आर्थिक दुर्व्यवहार', 'कुटुंबातील सदस्याकडून शारीरिक, भावनिक, किंवा आर्थिक छळ', 5, true, ARRAY['domestic violence', 'abuse', 'beating', 'घरेलू हिंसा', 'घरगुती हिंसा']),
((SELECT id FROM legal_categories WHERE category_type = 'women_safety'), 'Stalking/Cyberstalking', 'पीछा करना/साइबर स्टॉकिंग', 'पाठलाग/सायबर स्टॉकिंग', 'Being followed, watched, or harassed repeatedly', 'बार-बार पीछा किया जाना, देखा जाना, या परेशान किया जाना', 'वारंवार पाठलाग, पाळत ठेवणे, किंवा त्रास देणे', 4, false, ARRAY['stalking', 'following', 'harassment', 'पीछा', 'पाठलाग']),
((SELECT id FROM legal_categories WHERE category_type = 'women_safety'), 'Dowry Harassment', 'दहेज उत्पीड़न', 'हुंडा छळ', 'Harassment or cruelty for dowry demands', 'दहेज की मांग के लिए उत्पीड़न या क्रूरता', 'हुंड्याच्या मागणीसाठी छळ किंवा क्रूरता', 4, false, ARRAY['dowry', 'harassment', 'in-laws', 'दहेज', 'हुंडा']);

-- Women safety rights
INSERT INTO legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, legal_reference, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 'Right to reside in shared household', 'साझा घर में रहने का अधिकार', 'सामायिक घरात राहण्याचा अधिकार', 'Protection of Women from Domestic Violence Act', '2005', 'Section 17', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 'Right to protection orders from court', 'अदालत से सुरक्षा आदेश का अधिकार', 'न्यायालयाकडून संरक्षण आदेशाचा अधिकार', 'Protection of Women from Domestic Violence Act', '2005', 'Section 18', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 'Right to monetary relief and maintenance', 'आर्थिक राहत और भरण-पोषण का अधिकार', 'आर्थिक दिलासा आणि पोटगीचा अधिकार', 'Protection of Women from Domestic Violence Act', '2005', 'Section 20', 3),
((SELECT id FROM legal_situations WHERE title_en = 'Stalking/Cyberstalking'), 'Stalking is a cognizable and non-bailable offence', 'पीछा करना एक संज्ञेय और गैर-जमानती अपराध है', 'पाठलाग हा दखलपात्र आणि अजामीनपात्र गुन्हा आहे', 'Indian Penal Code', 'Section 354D', 'Up to 5 years imprisonment', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Stalking/Cyberstalking'), 'Right to file FIR at any police station', 'किसी भी थाने में FIR दर्ज करने का अधिकार', 'कोणत्याही पोलीस स्टेशनमध्ये FIR दाखल करण्याचा अधिकार', 'CrPC', 'Section 154', 'Zero FIR provision', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Dowry Harassment'), 'Dowry demand is illegal and punishable', 'दहेज मांगना अवैध और दंडनीय है', 'हुंड्याची मागणी बेकायदेशीर आणि दंडनीय आहे', 'Dowry Prohibition Act', '1961', 'Section 3', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Dowry Harassment'), 'Cruelty by husband/relatives is punishable up to 3 years', 'पति/रिश्तेदारों द्वारा क्रूरता 3 साल तक दंडनीय है', 'पती/नातेवाईकांची क्रूरता 3 वर्षांपर्यंत शिक्षेस पात्र', 'Indian Penal Code', 'Section 498A', 'Cognizable offence', 2);

-- Women safety dos and donts
INSERT INTO dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 'do', 'Call Women Helpline 181 immediately', 'तुरंत महिला हेल्पलाइन 181 पर कॉल करें', 'लगेच महिला हेल्पलाइन 181 वर कॉल करा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 'do', 'Go to nearest Protection Officer or police station', 'निकटतम संरक्षण अधिकारी या थाने जाएं', 'जवळच्या संरक्षण अधिकारी किंवा पोलीस स्टेशनला जा', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 'do', 'Keep emergency bag ready with documents', 'दस्तावेजों के साथ आपातकालीन बैग तैयार रखें', 'कागदपत्रांसह आणीबाणीची बॅग तयार ठेवा', 3),
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 'dont', 'Do not confront the abuser alone', 'अकेले दुर्व्यवहार करने वाले का सामना न करें', 'एकट्याने अत्याचार करणाऱ्याचा सामना करू नका', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Stalking/Cyberstalking'), 'do', 'Screenshot and save all evidence', 'सभी साक्ष्य का स्क्रीनशॉट लें और सहेजें', 'सर्व पुराव्यांचे स्क्रीनशॉट घ्या आणि जतन करा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Stalking/Cyberstalking'), 'do', 'Block the stalker on all platforms', 'सभी प्लेटफॉर्म पर स्टॉकर को ब्लॉक करें', 'सर्व प्लॅटफॉर्मवर स्टॉकरला ब्लॉक करा', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Dowry Harassment'), 'do', 'Record conversations and keep evidence', 'बातचीत रिकॉर्ड करें और साक्ष्य रखें', 'संभाषणे रेकॉर्ड करा आणि पुरावे ठेवा', 1);

-- Women safety action steps
INSERT INTO action_steps (situation_id, step_order, action_type, action_text_en, action_text_hi, action_text_mr, is_critical, action_data) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 1, 'call', 'Call Women Helpline 181', 'महिला हेल्पलाइन 181 पर कॉल करें', 'महिला हेल्पलाइन 181 वर कॉल करा', true, '{"phone": "181"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 2, 'share_location', 'Share live location with trusted person', 'विश्वसनीय व्यक्ति के साथ लाइव लोकेशन साझा करें', 'विश्वासू व्यक्तीशी लाइव्ह लोकेशन शेअर करा', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Domestic Violence'), 3, 'navigate', 'Go to nearest One Stop Centre', 'निकटतम वन स्टॉप सेंटर जाएं', 'जवळच्या वन स्टॉप सेंटरला जा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Stalking/Cyberstalking'), 1, 'record', 'Save screenshots of all messages', 'सभी संदेशों के स्क्रीनशॉट सहेजें', 'सर्व संदेशांचे स्क्रीनशॉट जतन करा', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Stalking/Cyberstalking'), 2, 'call', 'Report to Cyber Crime helpline 1930', 'साइबर क्राइम हेल्पलाइन 1930 पर रिपोर्ट करें', 'सायबर क्राइम हेल्पलाइन 1930 वर अहवाल द्या', false, '{"phone": "1930"}');

-- ===================================================
-- CONSUMER SITUATIONS AND DATA
-- ===================================================

INSERT INTO legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, severity_level, is_emergency, keywords) VALUES
((SELECT id FROM legal_categories WHERE category_type = 'consumer'), 'Defective Product', 'खराब उत्पाद', 'दोषपूर्ण उत्पादन', 'Product not working properly or has manufacturing defects', 'उत्पाद ठीक से काम नहीं कर रहा या निर्माण दोष है', 'उत्पादन व्यवस्थित काम करत नाही किंवा उत्पादन दोष आहे', 2, false, ARRAY['defective', 'product', 'warranty', 'खराब', 'दोषपूर्ण']),
((SELECT id FROM legal_categories WHERE category_type = 'consumer'), 'Online Shopping Fraud', 'ऑनलाइन शॉपिंग धोखाधड़ी', 'ऑनलाइन खरेदी फसवणूक', 'Wrong product delivered, no refund, or fraudulent seller', 'गलत उत्पाद मिला, रिफंड नहीं, या धोखाधड़ी विक्रेता', 'चुकीचे उत्पादन मिळाले, रिफंड नाही, किंवा फसवणूक विक्रेता', 2, false, ARRAY['online', 'fraud', 'refund', 'shopping', 'ऑनलाइन', 'खरेदी']),
((SELECT id FROM legal_categories WHERE category_type = 'consumer'), 'Bank/Insurance Complaint', 'बैंक/बीमा शिकायत', 'बँक/विमा तक्रार', 'Issues with bank services, loans, or insurance claims', 'बैंक सेवाओं, ऋण, या बीमा दावों में समस्या', 'बँक सेवा, कर्ज, किंवा विमा दाव्यांमध्ये समस्या', 2, false, ARRAY['bank', 'insurance', 'loan', 'claim', 'बैंक', 'बँक']);

-- Consumer rights
INSERT INTO legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, legal_reference, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Defective Product'), 'Right to replacement or refund for defective goods', 'दोषपूर्ण सामान के लिए प्रतिस्थापन या रिफंड का अधिकार', 'दोषपूर्ण वस्तूंसाठी बदली किंवा परताव्याचा अधिकार', 'Consumer Protection Act', '2019', 'Section 2(6)', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Defective Product'), 'Right to compensation for loss/injury caused', 'हुई हानि/चोट के लिए मुआवजे का अधिकार', 'झालेल्या नुकसान/दुखापतीसाठी भरपाईचा अधिकार', 'Consumer Protection Act', '2019', 'Section 39', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Online Shopping Fraud'), 'Right to file complaint on National Consumer Helpline', 'राष्ट्रीय उपभोक्ता हेल्पलाइन पर शिकायत दर्ज करने का अधिकार', 'राष्ट्रीय ग्राहक हेल्पलाइनवर तक्रार दाखल करण्याचा अधिकार', 'Consumer Protection Act', '2019', 'Section 35', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Online Shopping Fraud'), 'E-commerce platforms must address grievances within 30 days', 'ई-कॉमर्स प्लेटफॉर्म को 30 दिनों में शिकायत का समाधान करना होगा', 'ई-कॉमर्स प्लॅटफॉर्मने 30 दिवसांत तक्रारीचे निराकरण करणे आवश्यक', 'Consumer Protection E-Commerce Rules', '2020', 'Rule 4(6)', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Bank/Insurance Complaint'), 'Right to file complaint with Banking Ombudsman', 'बैंकिंग लोकपाल में शिकायत दर्ज करने का अधिकार', 'बँकिंग लोकपालांकडे तक्रार दाखल करण्याचा अधिकार', 'Banking Ombudsman Scheme', '2006', 'Clause 8', 1);

-- Consumer dos and donts
INSERT INTO dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Defective Product'), 'do', 'Keep purchase bill, warranty card, and packaging', 'खरीद बिल, वारंटी कार्ड और पैकेजिंग रखें', 'खरेदी बिल, वॉरंटी कार्ड आणि पॅकेजिंग ठेवा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Defective Product'), 'do', 'First approach seller/manufacturer for resolution', 'पहले समाधान के लिए विक्रेता/निर्माता से संपर्क करें', 'प्रथम निराकरणासाठी विक्रेता/उत्पादकाशी संपर्क करा', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Defective Product'), 'dont', 'Do not tamper with product before complaint', 'शिकायत से पहले उत्पाद के साथ छेड़छाड़ न करें', 'तक्रारीपूर्वी उत्पादनाशी छेडछाड करू नका', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Online Shopping Fraud'), 'do', 'Screenshot order details and communications', 'ऑर्डर विवरण और संचार का स्क्रीनशॉट लें', 'ऑर्डर तपशील आणि संवादाचे स्क्रीनशॉट घ्या', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Bank/Insurance Complaint'), 'do', 'First file complaint with bank grievance cell', 'पहले बैंक की शिकायत सेल में शिकायत दर्ज करें', 'प्रथम बँकेच्या तक्रार कक्षात तक्रार दाखल करा', 1);

-- Consumer action steps
INSERT INTO action_steps (situation_id, step_order, action_type, action_text_en, action_text_hi, action_text_mr, is_critical, action_data) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Defective Product'), 1, 'info', 'Gather all purchase documents and evidence', 'सभी खरीद दस्तावेज़ और साक्ष्य इकट्ठा करें', 'सर्व खरेदी कागदपत्रे आणि पुरावे गोळा करा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Defective Product'), 2, 'generate_document', 'Send complaint letter to seller/manufacturer', 'विक्रेता/निर्माता को शिकायत पत्र भेजें', 'विक्रेता/उत्पादकाला तक्रार पत्र पाठवा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Defective Product'), 3, 'call', 'Call National Consumer Helpline 1800-11-4000', 'राष्ट्रीय उपभोक्ता हेल्पलाइन 1800-11-4000 पर कॉल करें', 'राष्ट्रीय ग्राहक हेल्पलाइन 1800-11-4000 वर कॉल करा', false, '{"phone": "1800-11-4000"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Online Shopping Fraud'), 1, 'record', 'Take screenshots of all transactions', 'सभी लेन-देन के स्क्रीनशॉट लें', 'सर्व व्यवहारांचे स्क्रीनशॉट घ्या', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Online Shopping Fraud'), 2, 'call', 'Report to Cyber Crime helpline 1930', 'साइबर क्राइम हेल्पलाइन 1930 पर रिपोर्ट करें', 'सायबर क्राइम हेल्पलाइन 1930 वर अहवाल द्या', false, '{"phone": "1930"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Bank/Insurance Complaint'), 1, 'generate_document', 'File formal complaint with bank', 'बैंक में औपचारिक शिकायत दर्ज करें', 'बँकेत औपचारिक तक्रार दाखल करा', false, '{}');

-- ===================================================
-- TRAFFIC SITUATIONS AND DATA
-- ===================================================

INSERT INTO legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, severity_level, is_emergency, keywords) VALUES
((SELECT id FROM legal_categories WHERE category_type = 'traffic'), 'Road Accident', 'सड़क दुर्घटना', 'रस्ता अपघात', 'Involved in or witnessed a road accident', 'सड़क दुर्घटना में शामिल या गवाह', 'रस्ता अपघातात सहभागी किंवा साक्षीदार', 5, true, ARRAY['accident', 'road', 'collision', 'दुर्घटना', 'अपघात']),
((SELECT id FROM legal_categories WHERE category_type = 'traffic'), 'Challan/Fine Dispute', 'चालान/जुर्माना विवाद', 'चलन/दंड विवाद', 'Wrongly issued traffic challan or excessive fine', 'गलत तरीके से जारी ट्रैफिक चालान या अत्यधिक जुर्माना', 'चुकीच्या पद्धतीने जारी ट्रॅफिक चलन किंवा जास्त दंड', 2, false, ARRAY['challan', 'fine', 'traffic', 'चालान', 'चलन']),
((SELECT id FROM legal_categories WHERE category_type = 'traffic'), 'Drunk Driving Accusation', 'नशे में ड्राइविंग का आरोप', 'मद्यधुंद वाहन चालवण्याचा आरोप', 'Falsely accused of drunk driving', 'गलत तरीके से नशे में ड्राइविंग का आरोप', 'खोटेपणाने मद्यधुंद वाहन चालवण्याचा आरोप', 3, false, ARRAY['drunk', 'driving', 'alcohol', 'breathalyzer', 'नशा', 'मद्यधुंद']);

-- Traffic rights
INSERT INTO legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, legal_reference, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Road Accident'), 'Good Samaritan protection for helping accident victims', 'दुर्घटना पीड़ितों की मदद करने वालों के लिए गुड सैमरिटन सुरक्षा', 'अपघातग्रस्तांना मदत करणाऱ्यांसाठी गुड सॅमरिटन संरक्षण', 'Motor Vehicles Act', '2019', 'Section 134A', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Road Accident'), 'Right to free emergency treatment at any hospital', 'किसी भी अस्पताल में मुफ्त आपातकालीन उपचार का अधिकार', 'कोणत्याही रुग्णालयात मोफत आपत्कालीन उपचाराचा अधिकार', 'Motor Vehicles Act', '2019', 'Section 162', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Challan/Fine Dispute'), 'Right to contest e-challan within 60 days', '60 दिनों के भीतर ई-चालान का विरोध करने का अधिकार', '60 दिवसांच्या आत ई-चलनावर आक्षेप घेण्याचा अधिकार', 'Motor Vehicles Act', '2019', 'Section 206', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Drunk Driving Accusation'), 'Right to request blood test instead of breathalyzer', 'ब्रीथलाइज़र के बजाय रक्त परीक्षण का अनुरोध करने का अधिकार', 'ब्रीथलायझरऐवजी रक्त तपासणीची विनंती करण्याचा अधिकार', 'Motor Vehicles Act', '2019', 'Section 203', 1);

-- Traffic dos and donts
INSERT INTO dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Road Accident'), 'do', 'Help the injured - you are protected by law', 'घायलों की मदद करें - आप कानून द्वारा सुरक्षित हैं', 'जखमींना मदत करा - तुम्ही कायद्याने संरक्षित आहात', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Road Accident'), 'do', 'Call 112 and 108 ambulance immediately', 'तुरंत 112 और 108 एम्बुलेंस बुलाएं', 'लगेच 112 आणि 108 रुग्णवाहिका बोलवा', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Road Accident'), 'do', 'Take photos of accident scene and vehicles', 'दुर्घटना स्थल और वाहनों की तस्वीरें लें', 'अपघातस्थळ आणि वाहनांचे फोटो काढा', 3),
((SELECT id FROM legal_situations WHERE title_en = 'Road Accident'), 'dont', 'Do not move injured person unless critical', 'जब तक गंभीर न हो घायल व्यक्ति को न हिलाएं', 'गंभीर नसल्यास जखमी व्यक्तीला हलवू नका', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Challan/Fine Dispute'), 'do', 'Ask for official receipt for any on-spot payment', 'किसी भी मौके पर भुगतान के लिए आधिकारिक रसीद मांगें', 'कोणत्याही तात्काळ पेमेंटसाठी अधिकृत पावती मागा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Drunk Driving Accusation'), 'do', 'Request for blood test at hospital', 'अस्पताल में रक्त परीक्षण का अनुरोध करें', 'रुग्णालयात रक्त तपासणीची विनंती करा', 1);

-- Traffic action steps
INSERT INTO action_steps (situation_id, step_order, action_type, action_text_en, action_text_hi, action_text_mr, is_critical, action_data) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Road Accident'), 1, 'call', 'Call 112 emergency and 108 ambulance', '112 आपातकालीन और 108 एम्बुलेंस को कॉल करें', '112 आणीबाणी आणि 108 रुग्णवाहिकाला कॉल करा', true, '{"phone": "112"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Road Accident'), 2, 'record', 'Record accident scene and vehicles', 'दुर्घटना स्थल और वाहनों को रिकॉर्ड करें', 'अपघातस्थळ आणि वाहनांचे रेकॉर्डिंग करा', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Challan/Fine Dispute'), 1, 'info', 'Note down officer name and badge number', 'अधिकारी का नाम और बैज नंबर नोट करें', 'अधिकाऱ्याचे नाव आणि बॅज नंबर लिहून घ्या', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Challan/Fine Dispute'), 2, 'navigate', 'File appeal on Parivahan portal', 'परिवहन पोर्टल पर अपील दायर करें', 'परिवहन पोर्टलवर अपील दाखल करा', false, '{}');

-- ===================================================
-- PROPERTY SITUATIONS AND DATA
-- ===================================================

INSERT INTO legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, severity_level, is_emergency, keywords) VALUES
((SELECT id FROM legal_categories WHERE category_type = 'property'), 'Illegal Eviction', 'अवैध बेदखली', 'बेकायदेशीर बेदखली', 'Landlord trying to evict without proper notice or procedure', 'मकान मालिक उचित नोटिस या प्रक्रिया के बिना बेदखल करने की कोशिश कर रहा है', 'जमीनमालक योग्य नोटीस किंवा प्रक्रियेशिवाय बेदखल करण्याचा प्रयत्न करत आहे', 3, false, ARRAY['eviction', 'landlord', 'tenant', 'बेदखली', 'बेदखल']),
((SELECT id FROM legal_categories WHERE category_type = 'property'), 'Property Fraud', 'संपत्ति धोखाधड़ी', 'मालमत्ता फसवणूक', 'Cheated in property purchase, fake documents, or encroachment', 'संपत्ति खरीद में धोखा, नकली दस्तावेज, या अतिक्रमण', 'मालमत्ता खरेदीत फसवणूक, बनावट कागदपत्रे, किंवा अतिक्रमण', 3, false, ARRAY['property', 'fraud', 'encroachment', 'fake documents', 'धोखाधड़ी', 'फसवणूक']),
((SELECT id FROM legal_categories WHERE category_type = 'property'), 'Tenant Security Deposit', 'किरायेदार सुरक्षा जमा', 'भाडेकरू सुरक्षा ठेव', 'Landlord refusing to return security deposit', 'मकान मालिक सुरक्षा जमा वापस करने से मना कर रहा है', 'जमीनमालक सुरक्षा ठेव परत करण्यास नकार देत आहे', 2, false, ARRAY['deposit', 'security', 'refund', 'tenant', 'जमा', 'ठेव']);

-- Property rights
INSERT INTO legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, legal_reference, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Illegal Eviction'), 'Tenant cannot be evicted without court order', 'किरायेदार को अदालती आदेश के बिना बेदखल नहीं किया जा सकता', 'भाडेकरूला न्यायालयाच्या आदेशाशिवाय बेदखल करता येत नाही', 'Rent Control Act', 'Various', 'State specific', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Illegal Eviction'), 'Right to 15-30 days notice before eviction proceedings', 'बेदखली कार्यवाही से पहले 15-30 दिन की नोटिस का अधिकार', 'बेदखली कार्यवाहीपूर्वी 15-30 दिवसांच्या नोटीसचा अधिकार', 'Transfer of Property Act', '1882', 'Section 106', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Property Fraud'), 'Right to file FIR for cheating and forgery', 'धोखाधड़ी और जालसाजी के लिए FIR दर्ज करने का अधिकार', 'फसवणूक आणि बनावटगिरीसाठी FIR दाखल करण्याचा अधिकार', 'Indian Penal Code', 'Section 420, 468', 'Cheating and Forgery', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Tenant Security Deposit'), 'Right to full refund of deposit after deductions if any', 'कटौती के बाद जमा की पूर्ण वापसी का अधिकार', 'कपातींनंतर ठेवीच्या पूर्ण परताव्याचा अधिकार', 'Indian Contract Act', '1872', 'Section 73', 1);

-- Property dos and donts
INSERT INTO dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Illegal Eviction'), 'do', 'Keep copy of rent agreement handy', 'किराया समझौते की प्रति पास रखें', 'भाडे कराराची प्रत जवळ ठेवा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Illegal Eviction'), 'do', 'Record any threats or harassment', 'किसी भी धमकी या उत्पीड़न को रिकॉर्ड करें', 'कोणत्याही धमक्या किंवा छळाचे रेकॉर्डिंग करा', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Illegal Eviction'), 'dont', 'Do not vacate under pressure without legal advice', 'कानूनी सलाह के बिना दबाव में न खाली करें', 'कायदेशीर सल्ल्याशिवाय दबावाखाली रिक्त करू नका', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Property Fraud'), 'do', 'Verify all documents from Sub-Registrar office', 'उप-पंजीयक कार्यालय से सभी दस्तावेज सत्यापित करें', 'उप-निबंधक कार्यालयातून सर्व कागदपत्रे सत्यापित करा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Tenant Security Deposit'), 'do', 'Send written notice demanding deposit return', 'जमा वापसी की मांग करते हुए लिखित नोटिस भेजें', 'ठेव परतीची मागणी करणारी लिखित नोटीस पाठवा', 1);

-- Property action steps
INSERT INTO action_steps (situation_id, step_order, action_type, action_text_en, action_text_hi, action_text_mr, is_critical, action_data) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Illegal Eviction'), 1, 'record', 'Document all communication with landlord', 'मकान मालिक के साथ सभी संचार का दस्तावेज़ बनाएं', 'जमीनमालकाशी सर्व संवादाची नोंद करा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Illegal Eviction'), 2, 'call', 'Call police if physically threatened', 'शारीरिक धमकी मिलने पर पुलिस को बुलाएं', 'शारीरिक धमकी मिळाल्यास पोलिसांना बोलवा', true, '{"phone": "100"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Property Fraud'), 1, 'navigate', 'File FIR at nearest police station', 'निकटतम थाने में FIR दर्ज करें', 'जवळच्या पोलीस स्टेशनमध्ये FIR दाखल करा', true, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Tenant Security Deposit'), 1, 'generate_document', 'Send legal notice to landlord', 'मकान मालिक को कानूनी नोटिस भेजें', 'जमीनमालकाला कायदेशीर नोटीस पाठवा', false, '{}');

-- ===================================================
-- GOVERNMENT SITUATIONS AND DATA
-- ===================================================

INSERT INTO legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, severity_level, is_emergency, keywords) VALUES
((SELECT id FROM legal_categories WHERE category_type = 'government'), 'Ration Card Issues', 'राशन कार्ड समस्या', 'रेशन कार्ड समस्या', 'Ration card denied, wrong entries, or dealer not giving ration', 'राशन कार्ड अस्वीकृत, गलत प्रविष्टियां, या डीलर राशन नहीं दे रहा', 'रेशन कार्ड नाकारले, चुकीच्या नोंदी, किंवा डीलर रेशन देत नाही', 2, false, ARRAY['ration', 'PDS', 'card', 'dealer', 'राशन', 'रेशन']),
((SELECT id FROM legal_categories WHERE category_type = 'government'), 'RTI Not Answered', 'RTI का जवाब नहीं', 'RTI चे उत्तर नाही', 'Government department not responding to RTI application', 'सरकारी विभाग RTI आवेदन का जवाब नहीं दे रहा', 'सरकारी विभाग RTI अर्जाला उत्तर देत नाही', 2, false, ARRAY['RTI', 'information', 'reply', 'government', 'सूचना', 'माहिती']),
((SELECT id FROM legal_categories WHERE category_type = 'government'), 'Corruption/Bribe Demand', 'भ्रष्टाचार/रिश्वत की मांग', 'भ्रष्टाचार/लाच मागणी', 'Government official demanding bribe for service', 'सरकारी अधिकारी सेवा के लिए रिश्वत मांग रहा है', 'सरकारी अधिकारी सेवेसाठी लाच मागत आहे', 4, false, ARRAY['corruption', 'bribe', 'official', 'भ्रष्टाचार', 'रिश्वत', 'लाच']);

-- Government rights
INSERT INTO legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, legal_reference, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Ration Card Issues'), 'Right to get ration as per entitlement', 'पात्रता के अनुसार राशन प्राप्त करने का अधिकार', 'पात्रतेनुसार रेशन मिळण्याचा अधिकार', 'National Food Security Act', '2013', 'Section 3', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Ration Card Issues'), 'Right to file complaint with District Grievance Redressal Officer', 'जिला शिकायत निवारण अधिकारी में शिकायत का अधिकार', 'जिल्हा तक्रार निवारण अधिकाऱ्यांकडे तक्रारीचा अधिकार', 'National Food Security Act', '2013', 'Section 14', 2),
((SELECT id FROM legal_situations WHERE title_en = 'RTI Not Answered'), 'Right to receive information within 30 days', '30 दिनों के भीतर सूचना प्राप्त करने का अधिकार', '30 दिवसांच्या आत माहिती मिळण्याचा अधिकार', 'Right to Information Act', '2005', 'Section 7', 1),
((SELECT id FROM legal_situations WHERE title_en = 'RTI Not Answered'), 'Right to first appeal within 30 days of non-response', 'जवाब न मिलने के 30 दिनों के भीतर प्रथम अपील का अधिकार', 'उत्तर न मिळाल्यास 30 दिवसांच्या आत प्रथम अपीलाचा अधिकार', 'Right to Information Act', '2005', 'Section 19', 2),
((SELECT id FROM legal_situations WHERE title_en = 'Corruption/Bribe Demand'), 'Demanding bribe is punishable up to 7 years', 'रिश्वत मांगना 7 साल तक दंडनीय है', 'लाच मागणे 7 वर्षांपर्यंत शिक्षेस पात्र', 'Prevention of Corruption Act', '1988', 'Section 7', 1);

-- Government dos and donts
INSERT INTO dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Ration Card Issues'), 'do', 'Keep Aadhaar and ration card linked', 'आधार और राशन कार्ड लिंक रखें', 'आधार आणि रेशन कार्ड लिंक ठेवा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Ration Card Issues'), 'do', 'Take receipt for every transaction', 'हर लेन-देन की रसीद लें', 'प्रत्येक व्यवहाराची पावती घ्या', 2),
((SELECT id FROM legal_situations WHERE title_en = 'RTI Not Answered'), 'do', 'Keep copy of RTI application and postal receipt', 'RTI आवेदन और डाक रसीद की प्रति रखें', 'RTI अर्ज आणि पोस्टाच्या पावतीची प्रत ठेवा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Corruption/Bribe Demand'), 'do', 'Record the conversation if safe to do so', 'यदि सुरक्षित हो तो बातचीत रिकॉर्ड करें', 'सुरक्षित असल्यास संभाषण रेकॉर्ड करा', 1),
((SELECT id FROM legal_situations WHERE title_en = 'Corruption/Bribe Demand'), 'dont', 'Do not pay bribe - report instead', 'रिश्वत न दें - इसके बजाय रिपोर्ट करें', 'लाच देऊ नका - त्याऐवजी अहवाल द्या', 1);

-- Government action steps
INSERT INTO action_steps (situation_id, step_order, action_type, action_text_en, action_text_hi, action_text_mr, is_critical, action_data) VALUES
((SELECT id FROM legal_situations WHERE title_en = 'Ration Card Issues'), 1, 'call', 'Call Food Helpline 1967', 'खाद्य हेल्पलाइन 1967 पर कॉल करें', 'अन्न हेल्पलाइन 1967 वर कॉल करा', false, '{"phone": "1967"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Ration Card Issues'), 2, 'navigate', 'File complaint on State PDS portal', 'राज्य PDS पोर्टल पर शिकायत दर्ज करें', 'राज्य PDS पोर्टलवर तक्रार दाखल करा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'RTI Not Answered'), 1, 'generate_document', 'File First Appeal to Appellate Authority', 'अपीलीय प्राधिकरण में प्रथम अपील दायर करें', 'अपिलीय प्राधिकरणाकडे प्रथम अपील दाखल करा', false, '{}'),
((SELECT id FROM legal_situations WHERE title_en = 'Corruption/Bribe Demand'), 1, 'call', 'Call Anti-Corruption Helpline 1031', 'भ्रष्टाचार विरोधी हेल्पलाइन 1031 पर कॉल करें', 'भ्रष्टाचार विरोधी हेल्पलाइन 1031 वर कॉल करा', true, '{"phone": "1031"}'),
((SELECT id FROM legal_situations WHERE title_en = 'Corruption/Bribe Demand'), 2, 'navigate', 'File complaint on IGMS portal', 'IGMS पोर्टल पर शिकायत दर्ज करें', 'IGMS पोर्टलवर तक्रार दाखल करा', false, '{}');