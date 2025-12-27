-- Insert legal categories
INSERT INTO public.legal_categories (category_type, name_en, name_hi, name_mr, description_en, description_hi, description_mr, icon, color, sort_order) VALUES
('police', 'Police Matters', 'पुलिस मामले', 'पोलीस प्रकरणे', 'Rights when dealing with police', 'पुलिस से निपटते समय अधिकार', 'पोलिसांशी व्यवहार करताना हक्क', 'shield', 'blue', 1),
('hospital', 'Hospital & Medical', 'अस्पताल और चिकित्सा', 'रुग्णालय आणि वैद्यकीय', 'Medical treatment rights', 'चिकित्सा उपचार के अधिकार', 'वैद्यकीय उपचार हक्क', 'building-2', 'red', 2),
('women_safety', 'Women Safety', 'महिला सुरक्षा', 'महिला सुरक्षा', 'Protection and safety rights for women', 'महिलाओं के लिए सुरक्षा अधिकार', 'महिलांसाठी संरक्षण हक्क', 'heart', 'pink', 3),
('workplace', 'Workplace Issues', 'कार्यस्थल मुद्दे', 'कामाच्या ठिकाणी समस्या', 'Employment and labor rights', 'रोजगार और श्रम अधिकार', 'रोजगार आणि कामगार हक्क', 'briefcase', 'amber', 4),
('consumer', 'Consumer Rights', 'उपभोक्ता अधिकार', 'ग्राहक हक्क', 'Shopping and service rights', 'खरीदारी और सेवा अधिकार', 'खरेदी आणि सेवा हक्क', 'shopping-cart', 'green', 5),
('traffic', 'Traffic & Accidents', 'यातायात और दुर्घटना', 'वाहतूक आणि अपघात', 'Road safety and accident rights', 'सड़क सुरक्षा और दुर्घटना अधिकार', 'रस्ता सुरक्षा आणि अपघात हक्क', 'car', 'orange', 6),
('property', 'Property & Rent', 'संपत्ति और किराया', 'मालमत्ता आणि भाडे', 'Property and tenant rights', 'संपत्ति और किरायेदार अधिकार', 'मालमत्ता आणि भाडेकरू हक्क', 'home', 'purple', 7),
('government', 'Government Office', 'सरकारी कार्यालय', 'सरकारी कार्यालय', 'Rights in government offices', 'सरकारी कार्यालयों में अधिकार', 'सरकारी कार्यालयांमध्ये हक्क', 'landmark', 'teal', 8);

-- Insert helpline directory
INSERT INTO public.helpline_directory (name_en, name_hi, name_mr, phone_number, category, description_en, description_hi, is_toll_free, working_hours, state) VALUES
('Police Emergency', 'पुलिस आपातकाल', 'पोलीस आपत्कालीन', '100', 'police', 'Emergency police helpline', 'आपातकालीन पुलिस हेल्पलाइन', true, '24/7', 'All India'),
('National Emergency', 'राष्ट्रीय आपातकाल', 'राष्ट्रीय आपत्कालीन', '112', NULL, 'Single emergency number for all services', 'सभी सेवाओं के लिए एक आपातकालीन नंबर', true, '24/7', 'All India'),
('Women Helpline', 'महिला हेल्पलाइन', 'महिला हेल्पलाइन', '1091', 'women_safety', 'Women in distress helpline', 'संकट में महिलाओं के लिए हेल्पलाइन', true, '24/7', 'All India'),
('Women Helpline (NCW)', 'राष्ट्रीय महिला आयोग', 'राष्ट्रीय महिला आयोग', '7827-170-170', 'women_safety', 'National Commission for Women', 'राष्ट्रीय महिला आयोग', true, '24/7', 'All India'),
('Ambulance', 'एम्बुलेंस', 'रुग्णवाहिका', '102', 'hospital', 'Medical emergency ambulance', 'चिकित्सा आपातकालीन एम्बुलेंस', true, '24/7', 'All India'),
('National Health Helpline', 'राष्ट्रीय स्वास्थ्य हेल्पलाइन', 'राष्ट्रीय आरोग्य हेल्पलाइन', '104', 'hospital', 'Health information and advice', 'स्वास्थ्य जानकारी और सलाह', true, '24/7', 'All India'),
('Child Helpline', 'चाइल्ड हेल्पलाइन', 'बाल हेल्पलाइन', '1098', NULL, 'Child protection helpline', 'बाल संरक्षण हेल्पलाइन', true, '24/7', 'All India'),
('Senior Citizen Helpline', 'वरिष्ठ नागरिक हेल्पलाइन', 'ज्येष्ठ नागरिक हेल्पलाइन', '14567', NULL, 'Elderly abuse and support helpline', 'वरिष्ठ नागरिक सहायता हेल्पलाइन', true, '24/7', 'All India'),
('Consumer Helpline', 'उपभोक्ता हेल्पलाइन', 'ग्राहक हेल्पलाइन', '1800-11-4000', 'consumer', 'National Consumer Helpline', 'राष्ट्रीय उपभोक्ता हेल्पलाइन', true, '9:30 AM - 5:30 PM', 'All India'),
('Traffic Police', 'यातायात पुलिस', 'वाहतूक पोलीस', '103', 'traffic', 'Traffic police helpline', 'यातायात पुलिस हेल्पलाइन', true, '24/7', 'All India'),
('Cyber Crime', 'साइबर अपराध', 'सायबर गुन्हे', '1930', NULL, 'Cyber crime reporting', 'साइबर अपराध रिपोर्टिंग', true, '24/7', 'All India'),
('Anti-Corruption', 'भ्रष्टाचार विरोधी', 'भ्रष्टाचार विरोधी', '1031', 'government', 'Central Vigilance Commission', 'केंद्रीय सतर्कता आयोग', true, '24/7', 'All India'),
('Labour Helpline', 'श्रम हेल्पलाइन', 'कामगार हेल्पलाइन', '14434', 'workplace', 'Labour rights helpline', 'श्रम अधिकार हेल्पलाइन', true, '24/7', 'All India');