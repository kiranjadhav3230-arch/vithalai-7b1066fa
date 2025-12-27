-- Insert rights for "Police stopped you on road" situation
INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, legal_reference, section_number, act_name, priority_order)
SELECT id, 
'Police MUST show their ID card when asked', 
'पुलिस को पूछने पर अपना आईडी कार्ड दिखाना होगा', 
'पोलिसांना विचारल्यास त्यांचे ओळखपत्र दाखवणे आवश्यक आहे',
'Police officers must identify themselves', 'Section 41', 'CrPC', 1
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, legal_reference, section_number, act_name, priority_order)
SELECT id, 
'You can refuse body search without same-gender officer', 
'आप समान लिंग के अधिकारी के बिना शरीर की तलाशी से मना कर सकते हैं', 
'तुम्ही समान लिंगाच्या अधिकाऱ्याशिवाय अंगझडती नाकारू शकता',
'Body search must be conducted by same gender officer', 'Section 51', 'CrPC', 2
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, legal_reference, section_number, act_name, priority_order)
SELECT id, 
'You have the right to know the reason for stopping', 
'आपको रोकने का कारण जानने का अधिकार है', 
'तुम्हाला थांबवण्याचे कारण जाणून घेण्याचा अधिकार आहे',
'Police must inform reason for stopping', 'Section 41', 'CrPC', 3
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.legal_rights (situation_id, right_text_en, right_text_hi, right_text_mr, legal_reference, section_number, act_name, priority_order)
SELECT id, 
'You can record the interaction on your phone', 
'आप अपने फोन पर बातचीत रिकॉर्ड कर सकते हैं', 
'तुम्ही तुमच्या फोनवर संवाद रेकॉर्ड करू शकता',
'Recording in public places is legal', NULL, 'Constitutional Right', 4
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

-- Insert Do's and Don'ts for "Police stopped you on road"
INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, icon, priority_order)
SELECT id, 'do', 'Stay calm and be polite', 'शांत रहें और विनम्र रहें', 'शांत राहा आणि नम्र असा', 'check', 1
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, icon, priority_order)
SELECT id, 'do', 'Ask for their ID and note their details', 'उनकी आईडी मांगें और उनका विवरण नोट करें', 'त्यांचे ओळखपत्र मागा आणि तपशील नोंदवा', 'check', 2
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, icon, priority_order)
SELECT id, 'do', 'Record the interaction if possible', 'यदि संभव हो तो बातचीत रिकॉर्ड करें', 'शक्य असल्यास संवाद रेकॉर्ड करा', 'check', 3
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, icon, priority_order)
SELECT id, 'do', 'Inform a family member about your location', 'परिवार के किसी सदस्य को अपने स्थान के बारे में सूचित करें', 'कुटुंबातील सदस्याला तुमच्या स्थानाबद्दल कळवा', 'check', 4
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, icon, priority_order)
SELECT id, 'dont', 'Do not argue or shout at police', 'पुलिस से बहस या चिल्लाएं नहीं', 'पोलिसांशी वाद घालू नका किंवा ओरडू नका', 'x', 1
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, icon, priority_order)
SELECT id, 'dont', 'Do not run away from the spot', 'उस जगह से भागें नहीं', 'त्या ठिकाणाहून पळू नका', 'x', 2
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, icon, priority_order)
SELECT id, 'dont', 'Never offer bribe to police', 'पुलिस को कभी रिश्वत न दें', 'पोलिसांना कधीही लाच देऊ नका', 'x', 3
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.dos_and_donts (situation_id, type, content_en, content_hi, content_mr, icon, priority_order)
SELECT id, 'dont', 'Do not sign any blank paper', 'किसी खाली कागज पर हस्ताक्षर न करें', 'कोणत्याही कोऱ्या कागदावर सही करू नका', 'x', 4
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

-- Insert action steps for "Police stopped you on road"
INSERT INTO public.action_steps (situation_id, step_order, action_text_en, action_text_hi, action_text_mr, action_type, action_data, is_critical)
SELECT id, 1, 'Ask the officer to show their ID card and note down their name and badge number', 
'अधिकारी से उनका आईडी कार्ड दिखाने को कहें और उनका नाम और बैज नंबर नोट करें',
'अधिकाऱ्याला त्यांचे ओळखपत्र दाखवायला सांगा आणि त्यांचे नाव आणि बॅज क्रमांक लिहून घ्या',
'info', '{}', false
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.action_steps (situation_id, step_order, action_text_en, action_text_hi, action_text_mr, action_type, action_data, is_critical)
SELECT id, 2, 'Ask politely why you have been stopped', 
'विनम्रता से पूछें कि आपको क्यों रोका गया है',
'नम्रपणे विचारा की तुम्हाला का थांबवले',
'info', '{}', false
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.action_steps (situation_id, step_order, action_text_en, action_text_hi, action_text_mr, action_type, action_data, is_critical)
SELECT id, 3, 'Start recording the interaction on your phone', 
'अपने फोन पर बातचीत रिकॉर्ड करना शुरू करें',
'तुमच्या फोनवर संवाद रेकॉर्ड करणे सुरू करा',
'record', '{}', false
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.action_steps (situation_id, step_order, action_text_en, action_text_hi, action_text_mr, action_type, action_data, is_critical)
SELECT id, 4, 'Share your live location with a family member', 
'परिवार के किसी सदस्य के साथ अपना लाइव लोकेशन साझा करें',
'कुटुंबातील सदस्यासह तुमचे लाइव्ह लोकेशन शेअर करा',
'share_location', '{}', true
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';

INSERT INTO public.action_steps (situation_id, step_order, action_text_en, action_text_hi, action_text_mr, action_type, action_data, is_critical)
SELECT id, 5, 'If harassed, call 112 or note the details and file a complaint later', 
'यदि उत्पीड़न हो, तो 112 पर कॉल करें या विवरण नोट करें और बाद में शिकायत दर्ज करें',
'छळ झाल्यास, 112 वर कॉल करा किंवा तपशील नोंदवा आणि नंतर तक्रार दाखल करा',
'call', '{"phone_number": "112"}', true
FROM public.legal_situations WHERE title_en = 'Police stopped you on road';