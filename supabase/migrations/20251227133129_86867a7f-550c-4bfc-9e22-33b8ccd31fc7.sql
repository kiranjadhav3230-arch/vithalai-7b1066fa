-- Seed comprehensive legal data for all categories
-- Get category IDs dynamically and insert rights, dos/donts, action steps

-- ========== HOSPITAL CATEGORY ==========
-- Get hospital category situations and add rights
INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to emergency medical care without prior payment', 'पूर्व भुगतान के बिना आपातकालीन चिकित्सा देखभाल का अधिकार', 'पूर्व पेमेंटशिवाय आपत्कालीन वैद्यकीय सेवेचा अधिकार', 'Clinical Establishments Act', 'Section 11', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital' AND s.title_en LIKE '%Treatment Denial%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to receive treatment irrespective of ability to pay', 'भुगतान क्षमता की परवाह किए बिना इलाज पाने का अधिकार', 'पेमेंट क्षमतेची पर्वा न करता उपचार मिळण्याचा अधिकार', 'Supreme Court Judgment', 'Parmanand Katara Case', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital' AND s.title_en LIKE '%Treatment Denial%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to itemized bill and explanation of charges', 'आइटमाइज्ड बिल और शुल्क स्पष्टीकरण का अधिकार', 'तपशीलवार बिल आणि शुल्क स्पष्टीकरणाचा अधिकार', 'Consumer Protection Act', 'Section 2', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital' AND s.title_en LIKE '%Overcharging%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to informed consent before any procedure', 'किसी भी प्रक्रिया से पहले सूचित सहमति का अधिकार', 'कोणत्याही प्रक्रियेपूर्वी माहितीपूर्ण संमतीचा अधिकार', 'Indian Medical Council Regulations', 'Regulation 7.16', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital' AND s.title_en LIKE '%Medical Negligence%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to compensation for medical negligence', 'चिकित्सा लापरवाही के लिए मुआवजे का अधिकार', 'वैद्यकीय निष्काळजीपणाबद्दल नुकसान भरपाईचा अधिकार', 'Consumer Protection Act', 'Section 14', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital' AND s.title_en LIKE '%Medical Negligence%';

-- Hospital Dos and Donts
INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Document everything - keep all receipts and prescriptions', 'सब कुछ दस्तावेज करें - सभी रसीदें और नुस्खे रखें', 'सर्व काही दस्तऐवजीकरण करा - सर्व पावत्या आणि प्रिस्क्रिप्शन ठेवा', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Ask for itemized bill with all charges explained', 'सभी शुल्कों के साथ आइटमाइज्ड बिल मांगें', 'सर्व शुल्कांसह तपशीलवार बिल मागा', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital' AND s.title_en LIKE '%Overcharging%';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not sign blank consent forms', 'खाली सहमति फॉर्म पर हस्ताक्षर न करें', 'रिक्त संमती फॉर्मवर सही करू नका', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not leave without getting discharge summary', 'डिस्चार्ज सारांश लिए बिना न जाएं', 'डिस्चार्ज सारांश घेतल्याशिवाय जाऊ नका', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital';

-- Hospital Action Steps
INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'File complaint with hospital grievance cell', 'अस्पताल शिकायत सेल में शिकायत दर्ज करें', 'रुग्णालय तक्रार कक्षात तक्रार दाखल करा', 'info', 1, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital';

INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'Contact State Medical Council if negligence suspected', 'यदि लापरवाही का संदेह हो तो राज्य चिकित्सा परिषद से संपर्क करें', 'निष्काळजीपणाचा संशय असल्यास राज्य वैद्यकीय परिषदेशी संपर्क साधा', 'call', 2, true
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'hospital' AND s.title_en LIKE '%Medical Negligence%';

-- ========== WORKPLACE CATEGORY ==========
INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to file complaint with Internal Complaints Committee', 'आंतरिक शिकायत समिति में शिकायत दर्ज करने का अधिकार', 'अंतर्गत तक्रार समितीकडे तक्रार दाखल करण्याचा अधिकार', 'POSH Act', 'Section 9', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace' AND s.title_en LIKE '%Sexual Harassment%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to confidentiality during inquiry', 'जांच के दौरान गोपनीयता का अधिकार', 'चौकशी दरम्यान गोपनीयतेचा अधिकार', 'POSH Act', 'Section 16', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace' AND s.title_en LIKE '%Sexual Harassment%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to minimum wages as per state notification', 'राज्य अधिसूचना के अनुसार न्यूनतम मजदूरी का अधिकार', 'राज्य अधिसूचनेनुसार किमान वेतनाचा अधिकार', 'Minimum Wages Act', 'Section 3', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace' AND s.title_en LIKE '%Salary Issues%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to timely payment of wages', 'समय पर वेतन भुगतान का अधिकार', 'वेळेवर वेतन मिळण्याचा अधिकार', 'Payment of Wages Act', 'Section 5', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace' AND s.title_en LIKE '%Salary Issues%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to one month notice or salary in lieu', 'एक महीने की नोटिस या उसके बदले वेतन का अधिकार', 'एक महिन्याची नोटीस किंवा त्याऐवजी वेतनाचा अधिकार', 'Industrial Disputes Act', 'Section 25F', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace' AND s.title_en LIKE '%Wrongful Termination%';

-- Workplace Dos and Donts
INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Keep written records of all incidents with dates and witnesses', 'तारीखों और गवाहों के साथ सभी घटनाओं का लिखित रिकॉर्ड रखें', 'तारखा आणि साक्षीदारांसह सर्व घटनांची लिखित नोंद ठेवा', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Save all emails, messages and communication as evidence', 'सभी ईमेल, संदेश और संचार को सबूत के रूप में सहेजें', 'सर्व ईमेल, संदेश आणि संवाद पुरावा म्हणून सेव्ह करा', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not resign under pressure - it weakens your case', 'दबाव में इस्तीफा न दें - यह आपके केस को कमजोर करता है', 'दबावाखाली राजीनामा देऊ नका - यामुळे तुमचे प्रकरण कमकुवत होते', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not confront the harasser alone', 'उत्पीड़क का अकेले सामना न करें', 'छळ करणाऱ्याशी एकट्याने सामना करू नका', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace' AND s.title_en LIKE '%Sexual Harassment%';

-- Workplace Action Steps
INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'File written complaint with ICC within 3 months of incident', '3 महीने के भीतर ICC में लिखित शिकायत दर्ज करें', '3 महिन्यांच्या आत ICC कडे लेखी तक्रार दाखल करा', 'info', 1, true
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace' AND s.title_en LIKE '%Sexual Harassment%';

INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'File complaint with Labour Commissioner for wage issues', 'वेतन मुद्दों के लिए श्रम आयुक्त में शिकायत दर्ज करें', 'वेतन समस्यांसाठी कामगार आयुक्तांकडे तक्रार दाखल करा', 'info', 1, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'workplace' AND s.title_en LIKE '%Salary Issues%';

-- ========== WOMEN SAFETY CATEGORY ==========
INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to file FIR - police cannot refuse', 'एफआईआर दर्ज करने का अधिकार - पुलिस मना नहीं कर सकती', 'FIR दाखल करण्याचा अधिकार - पोलीस नकार देऊ शकत नाहीत', 'CrPC', 'Section 154', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to record statement before lady officer', 'महिला अधिकारी के समक्ष बयान दर्ज करने का अधिकार', 'महिला अधिकाऱ्यासमोर जबाब नोंदवण्याचा अधिकार', 'CrPC', 'Section 164', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to protection order restraining the abuser', 'दुर्व्यवहार करने वाले को रोकने के लिए सुरक्षा आदेश का अधिकार', 'अत्याचार करणाऱ्याला रोखण्यासाठी संरक्षण आदेशाचा अधिकार', 'Protection of Women from Domestic Violence Act', 'Section 18', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety' AND s.title_en LIKE '%Domestic Violence%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to residence in shared household', 'साझा घर में रहने का अधिकार', 'सामायिक घरात राहण्याचा अधिकार', 'Protection of Women from Domestic Violence Act', 'Section 17', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety' AND s.title_en LIKE '%Domestic Violence%';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to free legal aid', 'मुफ्त कानूनी सहायता का अधिकार', 'मोफत कायदेशीर मदतीचा अधिकार', 'Legal Services Authorities Act', 'Section 12', 3
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

-- Women Safety Dos and Donts
INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Call Women Helpline 1091 or 181 immediately', 'तुरंत महिला हेल्पलाइन 1091 या 181 पर कॉल करें', 'तातडीने महिला हेल्पलाइन 1091 किंवा 181 वर कॉल करा', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Get medical examination done within 72 hours', '72 घंटे के भीतर चिकित्सा जांच करवाएं', '72 तासांच्या आत वैद्यकीय तपासणी करून घ्या', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Preserve evidence - do not wash clothes or bathe', 'सबूत सुरक्षित रखें - कपड़े न धोएं या नहाएं', 'पुरावे जतन करा - कपडे धुवू नका किंवा आंघोळ करू नका', 3
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not compromise under family pressure', 'पारिवारिक दबाव में समझौता न करें', 'कौटुंबिक दबावाखाली तडजोड करू नका', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

-- Women Safety Action Steps
INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'Call Women Helpline 1091', 'महिला हेल्पलाइन 1091 पर कॉल करें', 'महिला हेल्पलाइन 1091 वर कॉल करा', 'call', 1, true
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'Go to nearest police station and file FIR', 'निकटतम पुलिस स्टेशन जाएं और एफआईआर दर्ज करें', 'जवळच्या पोलीस स्टेशनला जा आणि FIR दाखल करा', 'navigate', 2, true
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'women_safety';

-- ========== CONSUMER CATEGORY ==========
INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to be informed about quality, quantity, price', 'गुणवत्ता, मात्रा, कीमत के बारे में सूचित होने का अधिकार', 'गुणवत्ता, प्रमाण, किंमत याबद्दल माहिती मिळण्याचा अधिकार', 'Consumer Protection Act', 'Section 2(9)', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'consumer';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to seek redressal against unfair trade practices', 'अनुचित व्यापार प्रथाओं के खिलाफ निवारण का अधिकार', 'अयोग्य व्यापार पद्धतींविरुद्ध निवारणाचा अधिकार', 'Consumer Protection Act', 'Section 2(47)', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'consumer';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to file complaint online at consumerhelpline.gov.in', 'consumerhelpline.gov.in पर ऑनलाइन शिकायत दर्ज करने का अधिकार', 'consumerhelpline.gov.in वर ऑनलाइन तक्रार दाखल करण्याचा अधिकार', 'Consumer Protection Act', 'Section 35', 3
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'consumer';

-- Consumer Dos and Donts
INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Keep all bills, receipts and warranty cards', 'सभी बिल, रसीदें और वारंटी कार्ड रखें', 'सर्व बिले, पावत्या आणि वॉरंटी कार्ड ठेवा', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'consumer';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Take photos/videos of defective products', 'खराब उत्पादों की फोटो/वीडियो लें', 'सदोष उत्पादनांचे फोटो/व्हिडिओ घ्या', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'consumer';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not destroy defective product - it is evidence', 'खराब उत्पाद को नष्ट न करें - यह सबूत है', 'सदोष उत्पादन नष्ट करू नका - हा पुरावा आहे', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'consumer';

-- Consumer Action Steps
INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'Call National Consumer Helpline 1915', 'राष्ट्रीय उपभोक्ता हेल्पलाइन 1915 पर कॉल करें', 'राष्ट्रीय ग्राहक हेल्पलाइन 1915 वर कॉल करा', 'call', 1, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'consumer';

INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'File complaint at Consumer Forum for claims up to Rs. 1 crore', '1 करोड़ तक के दावों के लिए उपभोक्ता फोरम में शिकायत दर्ज करें', '1 कोटी पर्यंतच्या दाव्यांसाठी ग्राहक मंचात तक्रार दाखल करा', 'info', 2, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'consumer';

-- ========== TRAFFIC CATEGORY ==========
INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to see police ID before paying fine', 'जुर्माना देने से पहले पुलिस आईडी देखने का अधिकार', 'दंड भरण्यापूर्वी पोलीस ID पाहण्याचा अधिकार', 'Motor Vehicles Act', 'Section 206', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to get receipt for every fine paid', 'भुगतान किए गए प्रत्येक जुर्माने की रसीद पाने का अधिकार', 'भरलेल्या प्रत्येक दंडाची पावती मिळण्याचा अधिकार', 'Motor Vehicles Act', 'Section 207', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to compound offences at court instead of spot fine', 'स्पॉट फाइन के बजाय कोर्ट में जुर्माना भरने का अधिकार', 'स्पॉट दंडाऐवजी न्यायालयात दंड भरण्याचा अधिकार', 'Motor Vehicles Act', 'Section 200', 3
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic';

-- Traffic Dos and Donts
INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Always carry original documents - License, RC, Insurance', 'हमेशा मूल दस्तावेज रखें - लाइसेंस, RC, बीमा', 'नेहमी मूळ कागदपत्रे बाळगा - लायसन्स, RC, विमा', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Ask for challan number if paying fine', 'जुर्माना देते समय चालान नंबर मांगें', 'दंड भरताना चलान क्रमांक मागा', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not pay fine without getting official receipt', 'आधिकारिक रसीद लिए बिना जुर्माना न दें', 'अधिकृत पावतीशिवाय दंड भरू नका', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not argue aggressively with traffic police', 'ट्रैफिक पुलिस से आक्रामक तरीके से बहस न करें', 'वाहतूक पोलिसांशी आक्रमकपणे वाद घालू नका', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic';

-- Traffic Action Steps
INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'Note down traffic police badge number and vehicle number', 'ट्रैफिक पुलिस बैज नंबर और वाहन नंबर नोट करें', 'वाहतूक पोलीस बॅज क्रमांक आणि वाहन क्रमांक नोंदवा', 'record', 1, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic';

INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'Report bribery on Anti-Corruption Helpline 1031', 'भ्रष्टाचार विरोधी हेल्पलाइन 1031 पर रिश्वत की रिपोर्ट करें', 'भ्रष्टाचार विरोधी हेल्पलाइन 1031 वर लाचखोरीची तक्रार करा', 'call', 2, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'traffic' AND s.title_en LIKE '%Bribe%';

-- ========== PROPERTY CATEGORY ==========
INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to written rent agreement', 'लिखित किराया समझौते का अधिकार', 'लिखित भाडे कराराचा अधिकार', 'Transfer of Property Act', 'Section 107', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'property';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to peaceful possession of rented property', 'किराए की संपत्ति पर शांतिपूर्ण कब्जे का अधिकार', 'भाड्याच्या मालमत्तेवर शांततापूर्ण ताब्याचा अधिकार', 'Rent Control Acts', 'Various Sections', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'property';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right against illegal eviction without court order', 'कोर्ट आदेश के बिना अवैध निष्कासन के खिलाफ अधिकार', 'न्यायालयाच्या आदेशाशिवाय बेकायदेशीर निष्कासनाविरुद्ध अधिकार', 'Specific Relief Act', 'Section 6', 3
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'property';

-- Property Dos and Donts
INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Get all property documents verified by lawyer', 'वकील से सभी संपत्ति दस्तावेजों का सत्यापन कराएं', 'वकिलाकडून सर्व मालमत्ता कागदपत्रांची पडताळणी करून घ्या', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'property';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Keep rent receipts and payment records', 'किराया रसीदें और भुगतान रिकॉर्ड रखें', 'भाडे पावत्या आणि पेमेंट रेकॉर्ड ठेवा', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'property';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not pay advance without registered agreement', 'पंजीकृत समझौते के बिना एडवांस न दें', 'नोंदणीकृत कराराशिवाय अॅडव्हान्स देऊ नका', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'property';

-- Property Action Steps
INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'Register rent agreement at Sub-Registrar office', 'उप-पंजीयक कार्यालय में किराया समझौता पंजीकृत करें', 'उप-निबंधक कार्यालयात भाडे करार नोंदणी करा', 'navigate', 1, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'property';

INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'File complaint with Rent Controller for disputes', 'विवादों के लिए किराया नियंत्रक में शिकायत दर्ज करें', 'वादांसाठी भाडे नियंत्रकाकडे तक्रार दाखल करा', 'info', 2, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'property';

-- ========== GOVERNMENT CATEGORY ==========
INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to get information within 30 days', '30 दिनों के भीतर जानकारी पाने का अधिकार', '30 दिवसांत माहिती मिळण्याचा अधिकार', 'Right to Information Act', 'Section 7', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'government';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to first appeal within 30 days of rejection', 'अस्वीकृति के 30 दिनों के भीतर प्रथम अपील का अधिकार', 'नाकारल्याच्या 30 दिवसांत पहिल्या अपीलाचा अधिकार', 'Right to Information Act', 'Section 19', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'government';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, act_name, section_number, priority_order) 
SELECT s.id, 'Right to receive services within stipulated time', 'निर्धारित समय के भीतर सेवाएं प्राप्त करने का अधिकार', 'निर्धारित वेळेत सेवा मिळण्याचा अधिकार', 'Right to Service Acts', 'Various Sections', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'government' AND s.title_en LIKE '%Service Delay%';

-- Government Dos and Donts
INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'File RTI application with Rs. 10 fee', 'Rs. 10 शुल्क के साथ RTI आवेदन दाखिल करें', 'Rs. 10 शुल्कासह RTI अर्ज दाखल करा', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'government';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'do', 'Keep acknowledgment receipt of all applications', 'सभी आवेदनों की पावती रसीद रखें', 'सर्व अर्जांची पोचपावती ठेवा', 2
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'government';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, priority_order)
SELECT s.id, 'dont', 'Do not pay bribe for government services', 'सरकारी सेवाओं के लिए रिश्वत न दें', 'शासकीय सेवांसाठी लाच देऊ नका', 1
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'government';

-- Government Action Steps
INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'File RTI online at rtionline.gov.in', 'rtionline.gov.in पर ऑनलाइन RTI दाखिल करें', 'rtionline.gov.in वर ऑनलाइन RTI दाखल करा', 'navigate', 1, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'government';

INSERT INTO public.action_steps (situation_id, action_text_en, action_text_hi, action_text_mr, action_type, step_order, is_critical)
SELECT s.id, 'Complain on CPGRAMS portal for grievance redressal', 'शिकायत निवारण के लिए CPGRAMS पोर्टल पर शिकायत करें', 'तक्रार निवारणासाठी CPGRAMS पोर्टलवर तक्रार करा', 'navigate', 2, false
FROM legal_situations s JOIN legal_categories c ON s.category_id = c.id WHERE c.category_type = 'government';

-- Add more helplines for various categories
INSERT INTO public.helpline_directory (name_en, name_hi, name_mr, phone_number, category, description_en, is_toll_free, working_hours, state)
VALUES 
('Consumer Helpline', 'उपभोक्ता हेल्पलाइन', 'ग्राहक हेल्पलाइन', '1915', 'consumer', 'National Consumer Helpline for complaints', true, '9:30 AM - 5:30 PM', 'All India'),
('Labour Helpline', 'श्रम हेल्पलाइन', 'कामगार हेल्पलाइन', '14434', 'workplace', 'Labour Department Helpline', true, '24/7', 'All India'),
('RERA Helpline Maharashtra', 'RERA हेल्पलाइन महाराष्ट्र', 'RERA हेल्पलाइन महाराष्ट्र', '022-22023037', 'property', 'Real Estate Regulatory Authority', false, '10 AM - 6 PM', 'Maharashtra'),
('Anti-Corruption Helpline', 'भ्रष्टाचार विरोधी हेल्पलाइन', 'भ्रष्टाचार विरोधी हेल्पलाइन', '1031', 'government', 'Report bribery and corruption', true, '24/7', 'All India'),
('Traffic Helpline', 'ट्रैफिक हेल्पलाइन', 'वाहतूक हेल्पलाइन', '103', 'traffic', 'Traffic Police Helpline', true, '24/7', 'All India'),
('Domestic Violence Helpline', 'घरेलू हिंसा हेल्पलाइन', 'घरगुती हिंसाचार हेल्पलाइन', '181', 'women_safety', 'Women in distress helpline', true, '24/7', 'All India'),
('Hospital Grievance', 'अस्पताल शिकायत', 'रुग्णालय तक्रार', '104', 'hospital', 'Health Helpline for medical grievances', true, '24/7', 'All India')
ON CONFLICT DO NOTHING;
