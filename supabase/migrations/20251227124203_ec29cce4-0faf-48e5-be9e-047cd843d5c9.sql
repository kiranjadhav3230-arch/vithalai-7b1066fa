-- Get the police category ID and insert situations
INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Police stopped you on road', 'पुलिस ने आपको रोका', 'पोलिसांनी तुम्हाला थांबवले', 
'When police stops you for checking on road', 'जब पुलिस आपको सड़क पर जांच के लिए रोकती है', 'जेव्हा पोलीस तुम्हाला रस्त्यावर तपासणीसाठी थांबवतात',
ARRAY['police', 'stop', 'road', 'checking', 'vehicle'], 3, false
FROM public.legal_categories WHERE category_type = 'police';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Police wants to arrest you', 'पुलिस आपको गिरफ्तार करना चाहती है', 'पोलिसांना तुम्हाला अटक करायची आहे', 
'When police attempts to arrest you', 'जब पुलिस आपको गिरफ्तार करने का प्रयास करती है', 'जेव्हा पोलीस तुम्हाला अटक करण्याचा प्रयत्न करतात',
ARRAY['arrest', 'police', 'custody', 'detained'], 5, true
FROM public.legal_categories WHERE category_type = 'police';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Filing an FIR', 'FIR दर्ज करना', 'FIR दाखल करणे', 
'When you want to file a First Information Report', 'जब आप प्राथमिकी दर्ज करना चाहते हैं', 'जेव्हा तुम्हाला प्रथम माहिती अहवाल दाखल करायचा असतो',
ARRAY['FIR', 'complaint', 'report', 'crime'], 4, false
FROM public.legal_categories WHERE category_type = 'police';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Police harassment', 'पुलिस उत्पीड़न', 'पोलीस छळ', 
'When police is harassing or misbehaving with you', 'जब पुलिस आपके साथ दुर्व्यवहार कर रही है', 'जेव्हा पोलीस तुमच्याशी गैरवर्तन करत असतात',
ARRAY['harassment', 'misbehavior', 'abuse', 'police'], 5, true
FROM public.legal_categories WHERE category_type = 'police';

-- Hospital situations
INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Emergency treatment denied', 'आपातकालीन उपचार से मना', 'आपत्कालीन उपचार नाकारले', 
'Hospital refusing emergency treatment', 'अस्पताल आपातकालीन उपचार से मना कर रहा है', 'रुग्णालय आपत्कालीन उपचार नाकारत आहे',
ARRAY['emergency', 'treatment', 'denied', 'hospital', 'refused'], 5, true
FROM public.legal_categories WHERE category_type = 'hospital';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Overcharging by hospital', 'अस्पताल द्वारा अधिक शुल्क', 'रुग्णालयाने जास्त शुल्क आकारणे', 
'Hospital charging excessive fees', 'अस्पताल अधिक शुल्क ले रहा है', 'रुग्णालय जास्त शुल्क आकारत आहे',
ARRAY['overcharging', 'bill', 'fees', 'hospital', 'expensive'], 3, false
FROM public.legal_categories WHERE category_type = 'hospital';

-- Women safety situations
INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Street harassment', 'सड़क पर छेड़छाड़', 'रस्त्यावर छेडछाड', 
'Being harassed in public places', 'सार्वजनिक स्थानों पर छेड़छाड़', 'सार्वजनिक ठिकाणी छेडछाड',
ARRAY['harassment', 'eve-teasing', 'public', 'street'], 4, true
FROM public.legal_categories WHERE category_type = 'women_safety';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Workplace harassment', 'कार्यस्थल पर उत्पीड़न', 'कामाच्या ठिकाणी छळ', 
'Sexual harassment at workplace', 'कार्यस्थल पर यौन उत्पीड़न', 'कामाच्या ठिकाणी लैंगिक छळ',
ARRAY['workplace', 'harassment', 'sexual', 'office', 'POSH'], 5, false
FROM public.legal_categories WHERE category_type = 'women_safety';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Domestic violence', 'घरेलू हिंसा', 'घरगुती हिंसाचार', 
'Violence at home by family members', 'परिवार के सदस्यों द्वारा घर पर हिंसा', 'कुटुंबातील सदस्यांकडून घरी हिंसाचार',
ARRAY['domestic', 'violence', 'abuse', 'home', 'family'], 5, true
FROM public.legal_categories WHERE category_type = 'women_safety';

-- Workplace situations
INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Salary not paid', 'वेतन नहीं मिला', 'पगार मिळाला नाही', 
'Employer not paying salary on time', 'नियोक्ता समय पर वेतन नहीं दे रहा', 'मालक वेळेवर पगार देत नाही',
ARRAY['salary', 'payment', 'wages', 'delayed', 'unpaid'], 4, false
FROM public.legal_categories WHERE category_type = 'workplace';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Wrongful termination', 'गलत तरीके से निकाला', 'अयोग्य बडतर्फी', 
'Fired from job without proper reason', 'बिना उचित कारण नौकरी से निकाला', 'योग्य कारणाशिवाय नोकरीवरून काढले',
ARRAY['fired', 'termination', 'job', 'dismissed', 'wrongful'], 4, false
FROM public.legal_categories WHERE category_type = 'workplace';

-- Consumer situations
INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Defective product', 'खराब उत्पाद', 'सदोष उत्पादन', 
'Product not working or defective', 'उत्पाद काम नहीं कर रहा या खराब है', 'उत्पादन काम करत नाही किंवा सदोष आहे',
ARRAY['defective', 'product', 'broken', 'faulty', 'refund'], 3, false
FROM public.legal_categories WHERE category_type = 'consumer';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Refund denied', 'रिफंड से मना', 'परतावा नाकारला', 
'Seller refusing to give refund', 'विक्रेता रिफंड देने से मना कर रहा है', 'विक्रेता परतावा देण्यास नकार देत आहे',
ARRAY['refund', 'denied', 'return', 'money', 'seller'], 3, false
FROM public.legal_categories WHERE category_type = 'consumer';

-- Traffic situations
INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Road accident', 'सड़क दुर्घटना', 'रस्ता अपघात', 
'Involved in a road accident', 'सड़क दुर्घटना में शामिल', 'रस्ता अपघातात सामील',
ARRAY['accident', 'crash', 'collision', 'road', 'vehicle'], 5, true
FROM public.legal_categories WHERE category_type = 'traffic';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Challan issued unfairly', 'गलत चालान', 'अन्याय्य दंड', 
'Traffic police issued unfair challan', 'ट्रैफिक पुलिस ने गलत चालान काटा', 'वाहतूक पोलिसांनी अन्याय्य दंड दिला',
ARRAY['challan', 'fine', 'traffic', 'unfair', 'ticket'], 3, false
FROM public.legal_categories WHERE category_type = 'traffic';

-- Government situations
INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Document delayed', 'दस्तावेज में देरी', 'कागदपत्रे विलंब', 
'Government office delaying your documents', 'सरकारी कार्यालय आपके दस्तावेज में देरी कर रहा है', 'सरकारी कार्यालय तुमच्या कागदपत्रांना उशीर करत आहे',
ARRAY['delay', 'documents', 'government', 'office', 'pending'], 3, false
FROM public.legal_categories WHERE category_type = 'government';

INSERT INTO public.legal_situations (category_id, title_en, title_hi, title_mr, description_en, description_hi, description_mr, keywords, severity_level, is_emergency) 
SELECT id, 'Bribe demanded', 'रिश्वत मांगी', 'लाच मागितली', 
'Government official asking for bribe', 'सरकारी अधिकारी रिश्वत मांग रहा है', 'सरकारी अधिकारी लाच मागत आहे',
ARRAY['bribe', 'corruption', 'money', 'official', 'government'], 4, false
FROM public.legal_categories WHERE category_type = 'government';