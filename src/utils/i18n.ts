export type Language = 
  | 'en' 
  | 'ta' 
  | 'hi' 
  | 'te' 
  | 'ml' 
  | 'kn' 
  | 'bn' 
  | 'mr' 
  | 'gu' 
  | 'es' 
  | 'fr' 
  | 'de';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export interface TranslationSchema {
  systemTitle: string;
  tagline: string;
  reportIncident: string;
  trackReport: string;
  myReports: string;
  authorityPortal: string;
  escalationMatrix: string;
  safeZones: string;
  guidelines: string;
  settings: string;
  
  // Voice SOS & Assistant
  urgentVoiceSOS: string;
  instantVoiceSOSDesc: string;
  speakToReport: string;
  recordingVoice: string;
  liveGpsTracking: string;
  locationAcquired: string;
  autoSubmittingIn: string;
  submitInstantSos: string;
  sosDocumentReady: string;
  downloadReceipt: string;
  aiAssistantTitle: string;
  aiAssistantSubtitle: string;
  askAssistantPlaceholder: string;
  howToUseSystem: string;
  
  // Roles
  roleStudent: string;
  roleHOD: string;
  roleDean: string;
  roleHigherAuthority: string;
  demoRoleNotice: string;
  
  // Categories
  offlineCategory: string;
  offlineDesc: string;
  onlineCategory: string;
  onlineDesc: string;
  
  // Workflow Steps
  tier1Title: string;
  tier1Desc: string;
  tier2Title: string;
  tier2Desc: string;
  tier3Title: string;
  tier3Desc: string;
  
  // Form Labels
  anonymousToggle: string;
  confidentialNotice: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  onlinePlatform: string;
  incidentType: string;
  description: string;
  isOngoing: string;
  urgencyLevel: string;
  suspectName: string;
  suspectDept: string;
  suspectContact: string;
  evidenceUpload: string;
  evidenceHelper: string;
  submitButton: string;
  submitting: string;
  
  // Statuses
  submitted: string;
  under_review: string;
  action_in_progress: string;
  escalated: string;
  resolved: string;
  
  // Quick Helpline
  helplineText: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    systemTitle: 'AegisCampus',
    tagline: 'Confidential Campus Safety & Harassment Reporting System',
    reportIncident: 'Report an Incident',
    trackReport: 'Track Existing Report',
    myReports: 'My Reports',
    authorityPortal: 'Authority Dashboard',
    escalationMatrix: 'Escalation Engine',
    safeZones: 'Campus Safe Zones',
    guidelines: 'Safety Guidelines',
    settings: 'Settings & Privacy',

    urgentVoiceSOS: 'Urgent Voice SOS Report',
    instantVoiceSOSDesc: 'Emergency 1-click voice complaint with real-time GPS location tracking & auto document generation',
    speakToReport: 'Press Mic & Speak Your Emergency',
    recordingVoice: 'Listening & Transcribing Voice...',
    liveGpsTracking: 'Tracking Live GPS Coordinates...',
    locationAcquired: 'Location Coordinates Secured',
    autoSubmittingIn: 'Auto-submitting critical report in',
    submitInstantSos: 'Submit Instant Voice Complaint',
    sosDocumentReady: 'Official Safety Report Document Generated',
    downloadReceipt: 'Download Official PDF Report',
    aiAssistantTitle: 'Aegis AI Campus Assistant',
    aiAssistantSubtitle: 'Ask anything about reporting, confidentiality & campus safety',
    askAssistantPlaceholder: 'Ask how to report, track cases, or get urgent safety help...',
    howToUseSystem: 'How to use this safety portal?',

    roleStudent: 'Student',
    roleHOD: 'Head of Department (HOD)',
    roleDean: 'Dean of Student Welfare',
    roleHigherAuthority: 'Higher Authority / Disciplinary Board',
    demoRoleNotice: 'Demonstration Role Switcher — For evaluation purposes',

    offlineCategory: 'Offline Ragging',
    offlineDesc: 'Physical harassment, stalking, hostile intimidation, hostel bullying, or corridor ragging.',
    onlineCategory: 'Online Ragging',
    onlineDesc: 'Cyber bullying, impersonation accounts, abusive DMs, obscene media, or digital coercion.',

    tier1Title: 'Tier 1: HOD Review',
    tier1Desc: 'First complaint assigned to Department HOD. Victim identity strictly redacted.',
    tier2Title: 'Tier 2: Dean Escalation',
    tier2Desc: 'Second repeat incident automatically escalated to Dean. Victim identity strictly redacted.',
    tier3Title: 'Tier 3: Higher Authority',
    tier3Desc: 'Third repeat incident escalated to Higher Disciplinary Authority with authorized full file.',

    anonymousToggle: 'File Anonymously (Zero Identity Captured)',
    confidentialNotice: 'Your identity is protected under campus anti-retaliation guidelines. Lower authority queues never receive your name.',
    incidentDate: 'Incident Date',
    incidentTime: 'Approximate Time',
    incidentLocation: 'Campus Location / Zone',
    onlinePlatform: 'Online Platform (e.g. Instagram, WhatsApp, Discord)',
    incidentType: 'Incident Type',
    description: 'Detailed Description of What Occurred',
    isOngoing: 'Is this incident currently ongoing?',
    urgencyLevel: 'Urgency Level',
    suspectName: 'Suspect Name (Optional)',
    suspectDept: 'Suspect Department / Year (Optional)',
    suspectContact: 'Suspect Contact / Handle (Optional)',
    evidenceUpload: 'Upload Screenshot or Image Evidence',
    evidenceHelper: 'For online harassment, screenshot logs are strongly recommended. Accepted formats: JPG, PNG, WEBP (Max 5MB).',
    submitButton: 'Submit Confidential Report',
    submitting: 'Verifying & Submitting...',

    submitted: 'Submitted',
    under_review: 'Under Review',
    action_in_progress: 'Action in Progress',
    escalated: 'Escalated',
    resolved: 'Resolved',

    helplineText: 'Takshashila Safety Helpline (24/7): 092976 23456',
  },

  ta: {
    systemTitle: 'ஏஜிஸ் கேம்பஸ்',
    tagline: 'இரகசிய வளாகப் பாதுகாப்பு மற்றும் ராகிங் புகார் தளம்',
    reportIncident: 'புகார் பதிவு செய்க',
    trackReport: 'புகாரைக் கண்காணிக்க',
    myReports: 'எனது புகார்கள்',
    authorityPortal: 'அதிகாரிகள் தளம்',
    escalationMatrix: 'தீவிரப்படுத்தல் பொறிமுறை',
    safeZones: 'பாதுகாப்பு மண்டலங்கள்',
    guidelines: 'பாதுகாப்பு வழிகாட்டுதல்கள்',
    settings: 'அமைப்புகள் & தனியுரிமை',

    urgentVoiceSOS: 'அவசர குரல்வழி SOS புகார்',
    instantVoiceSOSDesc: 'நிகழ்நேர இருப்பிடம் (GPS) மற்றும் தானியங்கி ஆவணத் தயாரிப்புடன் உடனடி குரல் புகார்',
    speakToReport: 'மைக் அழுத்தி உங்கள் அவசர புகாரைப் பேசுங்கள்',
    recordingVoice: 'குரல் பதிவு செய்யப்பட்டு உரையாக மாற்றப்படுகிறது...',
    liveGpsTracking: 'நேரடி GPS இருப்பிடம் கண்காணிக்கப்படுகிறது...',
    locationAcquired: 'இருப்பிடத் தகவல் வெற்றிகரமாக பெறப்பட்டது',
    autoSubmittingIn: 'அவசர புகார் தானாக சமர்ப்பிக்கப்பட உள்ளது:',
    submitInstantSos: 'உடனடி குரல் புகாரை சமர்ப்பிக்க',
    sosDocumentReady: 'அதிகாரப்பூர்வ புகார் ஆவணம் உருவாக்கப்பட்டது',
    downloadReceipt: 'புகார் ஆவணத்தை பதிவிறக்கு (PDF)',
    aiAssistantTitle: 'ஏஜிஸ் AI வளாக உதவியாளர்',
    aiAssistantSubtitle: 'புகார் பதிவு, பாதுகாப்பு மற்றும் வழிகாட்டுதல்களை கேளுங்கள்',
    askAssistantPlaceholder: 'எவ்வாறு புகார் அளிப்பது? எங்கு பாதுகாப்பு உள்ளது என கேளுங்கள்...',
    howToUseSystem: 'இந்த தளத்தை எவ்வாறு பயன்படுத்துவது?',

    roleStudent: 'மாணவர்',
    roleHOD: 'துறைத் தலைவர் (HOD)',
    roleDean: 'மாணவர் நலத்துறை தலைவர் (Dean)',
    roleHigherAuthority: 'உயர் ஒழுங்கு நடவடிக்கை குழு',
    demoRoleNotice: 'மாதிரி மதிப்பீட்டுப் பங்கு — பரிசோதனைக்காக மட்டும்',

    offlineCategory: 'நேரடி ராகிங் (Offline)',
    offlineDesc: 'உடலியல் அச்சுறுத்தல், பின்தொடர்தல், விடுதி மற்றும் வளாக அச்சுறுத்தல்கள்.',
    onlineCategory: 'இணையவழி ராகிங் (Online)',
    onlineDesc: 'சைபர் துன்புறுத்தல், போலி கணக்குகள், ஆபாச தகவல்கள் மற்றும் சமூக வலைதள மிரட்டல்.',

    tier1Title: 'நிலை 1: துறைத் தலைவர் பார்வை',
    tier1Desc: 'முதல் புகார் துறைத் தலைவருக்குச் செல்லும். மாணவர் பெயர் முழுமையாக மறைக்கப்படும்.',
    tier2Title: 'நிலை 2: டீன் பார்வைக்கு மாற்றம்',
    tier2Desc: 'இரண்டாவது மீண்டும் நிகழும் புகார் தானாக டீனுக்கு மாற்றப்படும். அடையாள பாதுகாப்பு தொடரும்.',
    tier3Title: 'நிலை 3: உயர் ஒழுங்கு நடவடிக்கை குழு',
    tier3Desc: 'மூன்றாவது மீண்டும் நிகழும் புகார் உயர் ஒழுங்கு குழுவிற்கு மாற்றப்படும்.',

    anonymousToggle: 'பெயர் தெரியாமல் பதிவு செய்க (Anonymous)',
    confidentialNotice: 'உங்கள் அடையாளம் முழுமையாகப் பாதுகாக்கப்படுகிறது. அதிகாரிகள் பார்வைக்கு உங்கள் பெயர் தெரியாது.',
    incidentDate: 'நிகழ்வு தேதி',
    incidentTime: 'தோராயமான நேரம்',
    incidentLocation: 'வளாக இடம் / மண்டலம்',
    onlinePlatform: 'இணையதளம் (Instagram, WhatsApp, Discord)',
    incidentType: 'நிகழ்வின் வகை',
    description: 'நடந்த நிகழ்வின் முழு விவரம்',
    isOngoing: 'இந்த நிகழ்வு தற்போதும் தொடர்கிறதா?',
    urgencyLevel: 'அவசர நிலை',
    suspectName: 'சந்தேக நபர் பெயர் (விருப்பப்பட்டால்)',
    suspectDept: 'சந்தேக நபர் துறை / ஆண்டு (விருப்பப்பட்டால்)',
    suspectContact: 'தொடர்பு எண் / பயனர் பெயர் (விருப்பப்பட்டால்)',
    evidenceUpload: 'ஆதாரம் / ஸ்கிரீன்ஷாட் பதிவேற்றவும்',
    evidenceHelper: 'இணைய புகார்களுக்கு ஸ்கிரீன்ஷாட் மிகவும் உதவியாக இருக்கும் (அதிகபட்சம் 5MB).',
    submitButton: 'இரகசியப் புகாரைச் சமர்ப்பிக்க',
    submitting: 'சரிபார்க்கப்படுகிறது...',

    submitted: 'சமர்ப்பிக்கப்பட்டது',
    under_review: 'ஆய்வில் உள்ளது',
    action_in_progress: 'நடவடிக்கை எடுக்கப்படுகிறது',
    escalated: 'தீவிரப்படுத்தப்பட்டது',
    resolved: 'தீர்வு காணப்பட்டது',

    helplineText: 'தக்ஷஷீலா பல்கலைக்கழக பாதுகாப்பு உதவி எண் (24/7): 092976 23456',
  },

  hi: {
    systemTitle: 'एजिस कैंपस',
    tagline: 'गोपनीय कैंपस सुरक्षा एवं रैगिंग रोकथाम प्रणाली',
    reportIncident: 'शिकायत दर्ज करें',
    trackReport: 'शिकायत की स्थिति जांचें',
    myReports: 'मेरी शिकायतें',
    authorityPortal: 'अधिकारी डैशबोर्ड',
    escalationMatrix: 'एस्केलेशन इंजन',
    safeZones: 'सुरक्षित क्षेत्र (Safe Zones)',
    guidelines: 'सुरक्षा दिशा-निर्देश',
    settings: 'सेटिंग्स एवं गोपनीयता',

    urgentVoiceSOS: 'आपातकालीन वॉयस SOS रिपोर्ट',
    instantVoiceSOSDesc: 'रीयल-टाइम जीपीएस लोकेशन ट्रैकिंग एवं त्वरित रिपोर्ट दस्तावेज़ के साथ तत्काल वॉयस शिकायत',
    speakToReport: 'माइक दबाएं और अपनी समस्या बोलें',
    recordingVoice: 'आवाज सुनी जा रही है और टेक्स्ट में बदली जा रही है...',
    liveGpsTracking: 'लाइव जीपीएस लोकेशन ट्रैक की जा रही है...',
    locationAcquired: 'स्थान निर्देशांक सुरक्षित कर लिए गए हैं',
    autoSubmittingIn: 'आपातकालीन शिकायत स्वतः दर्ज होगी:',
    submitInstantSos: 'तुरंत वॉयस शिकायत दर्ज करें',
    sosDocumentReady: 'आधिकारिक सुरक्षा रिपोर्ट दस्तावेज़ तैयार हो गया',
    downloadReceipt: 'आधिकारिक पीडीएफ रिपोर्ट डाउनलोड करें',
    aiAssistantTitle: 'एजिस एआई कैंपस सहायक',
    aiAssistantSubtitle: 'शिकायत दर्ज करने व सुरक्षा संबंधी कोई भी प्रश्न पूछें',
    askAssistantPlaceholder: 'शिकायत कैसे करें, सुरक्षित क्षेत्र कहां हैं, पूछें...',
    howToUseSystem: 'इस पोर्टल का उपयोग कैसे करें?',

    roleStudent: 'छात्र (Student)',
    roleHOD: 'विभागाध्यक्ष (HOD)',
    roleDean: 'छात्र कल्याण डीन (Dean)',
    roleHigherAuthority: 'उच्च अनुशासन समिति',
    demoRoleNotice: 'डेमो रोल स्विचर — केवल मूल्यांकन उद्देश्य हेतु',

    offlineCategory: 'ऑफ़लाइन रैगिंग',
    offlineDesc: 'शारीरिक उत्पीड़न, पीछा करना, धमकी, हॉस्टल में परेशान करना।',
    onlineCategory: 'ऑनलाइन रैगिंग',
    onlineDesc: 'साइबर बुलिंग, फर्जी खाते, अपमानजनक संदेश या सोशल मीडिया प्रताड़ना।',

    tier1Title: 'स्तर 1: विभागाध्यक्ष समीक्षा',
    tier1Desc: 'पहली शिकायत सीधे विभागाध्यक्ष को। छात्र की पहचान पूरी तरह गोपनीय।',
    tier2Title: 'स्तर 2: डीन को एस्केलेशन',
    tier2Desc: 'दूसरी पुनरावृत्ति स्वतः डीन को स्थानांतरित होगी। पहचान सुरक्षा जारी रहेगी।',
    tier3Title: 'स्तर 3: उच्च अनुशासन समिति',
    tier3Desc: 'तीसरी पुनरावृत्ति उच्च अनुशासन बोर्ड को भेजी जाएगी।',

    anonymousToggle: 'गुमनाम रूप से शिकायत दर्ज करें (Anonymous)',
    confidentialNotice: 'आपकी पहचान पूरी तरह सुरक्षित है। कनिष्ठ अधिकारियों को आपका नाम नहीं दिखेगा।',
    incidentDate: 'घटना की तारीख',
    incidentTime: 'अनुमानित समय',
    incidentLocation: 'स्थान / कैंपस क्षेत्र',
    onlinePlatform: 'ऑनलाइन प्लेटफॉर्म (जैसे Instagram, WhatsApp)',
    incidentType: 'घटना का प्रकार',
    description: 'घटना का संपूर्ण विवरण',
    isOngoing: 'क्या यह घटना वर्तमान में जारी है?',
    urgencyLevel: 'आपातकालीन स्तर',
    suspectName: 'संदिग्ध का नाम (वैकल्पिक)',
    suspectDept: 'संदिग्ध का विभाग / वर्ष (वैकल्पिक)',
    suspectContact: 'संपर्क / सोशल हैंडल (वैकल्पिक)',
    evidenceUpload: 'स्क्रीनशॉट या साक्ष्य अपलोड करें',
    evidenceHelper: 'ऑनलाइन उत्पीड़न हेतु स्क्रीनशॉट उपयोगी है (अधिकतम 5MB)।',
    submitButton: 'गोपनीय रिपोर्ट सबमिट करें',
    submitting: 'सत्यापित और सबमिट किया जा रहा है...',

    submitted: 'दर्ज हुई',
    under_review: 'समीक्षाधीन',
    action_in_progress: 'कार्यवाही प्रगति पर',
    escalated: 'उच्च स्तर पर प्रेषित',
    resolved: 'निस्तारित',

    helplineText: 'तक्षशिला विश्वविद्यालय सुरक्षा हेल्पलाइन (24/7): 092976 23456',
  },

  te: {
    systemTitle: 'ఈజిస్ క్యాంపస్',
    tagline: 'రహస్య క్యాంపస్ భద్రత మరియు ర్యాగింగ్ నివేదిక వ్యవస్థ',
    reportIncident: 'ఫిర్యాదు నమోదు చేయండి',
    trackReport: 'ఫిర్యాదు స్థితి చూడండి',
    myReports: 'నా ఫిర్యాదులు',
    authorityPortal: 'అధికారుల డ్యాష్‌బోర్డ్',
    escalationMatrix: 'ఎస్కిలేషన్ ఇంజిన్',
    safeZones: 'సురక్షిత మండలాలు',
    guidelines: 'భద్రతా మార్గదర్శకాలు',
    settings: 'సెట్టింగ్‌లు & గోప్యత',

    urgentVoiceSOS: 'అత్యవసర వాయిస్ SOS ఫిర్యాదు',
    instantVoiceSOSDesc: 'రియల్-టైమ్ GPS లొకేషన్ ట్రాకింగ్ మరియు ఆటోమేటిక్ రిపోర్ట్ డాక్యుమెంట్‌తో తక్షణ వాయిస్ ఫిర్యాదు',
    speakToReport: 'మైక్ నొక్కి అత్యవసర సమస్యను మాట్లాడండి',
    recordingVoice: 'వాయిస్ రికార్డ్ అవుతోంది మరియు టెక్స్ట్‌గా మారుతోంది...',
    liveGpsTracking: 'లైవ్ GPS లొకేషన్ ట్రాక్ చేయబడుతోంది...',
    locationAcquired: 'లొకేషన్ వివరాలు విజయవంతంగా తీసుకోబడ్డాయి',
    autoSubmittingIn: 'అత్యవసర ఫిర్యాదు ఆటో సమర్పణ అవుతుంది:',
    submitInstantSos: 'తక్షణ వాయిస్ ఫిర్యాదు సమర్పించండి',
    sosDocumentReady: 'అధికారిక భద్రతా నివేదిక పత్రం సిద్ధమైంది',
    downloadReceipt: 'అధికారిక PDF డౌన్‌లోడ్ చేసుకోండి',
    aiAssistantTitle: 'ఈజిస్ AI క్యాంపస్ అసిస్టెంట్',
    aiAssistantSubtitle: 'ఫిర్యాదు నమోదు, రక్షణ మరియు సహాయం కోసం అడగండి',
    askAssistantPlaceholder: 'ఎలా ఫిర్యాదు చేయాలి? సురక్షిత ప్రదేశాలు ఎక్కడ ఉన్నాయి?',
    howToUseSystem: 'ఈ పోర్టల్ ఎలా ఉపయోగించాలి?',

    roleStudent: 'విద్యార్థి',
    roleHOD: 'విభాగాధిపతి (HOD)',
    roleDean: 'డీన్ (Dean)',
    roleHigherAuthority: 'ఉన్నత క్రమశిక్షణా మండలి',
    demoRoleNotice: 'డెమో రోల్ స్విచ్చర్ — మూల్యాంకనం కోసం మాత్రమే',

    offlineCategory: 'ఆఫ్‌లైన్ ర్యాగింగ్',
    offlineDesc: 'శారీరక వేధింపులు, హాస్టల్ గొడవలు, బెదిరింపులు.',
    onlineCategory: 'ఆన్‌లైన్ ర్యాగింగ్',
    onlineDesc: 'సైబర్ వేధింపులు, నకిలీ ఖాతాలు, సోషల్ మీడియా బెదిరింపులు.',

    tier1Title: 'స్థాయి 1: విభాగాధిపతి సమీక్ష',
    tier1Desc: 'మొదటి ఫిర్యాదు విభాగాధిపతికి వెళ్తుంది. విద్యార్థి వివరాలు పూర్తిగా రహస్యం.',
    tier2Title: 'స్థాయి 2: డీన్‌కు బదిలీ',
    tier2Desc: 'రెండవ పునరావృత ఘటన ఆటోమేటిక్‌గా డీన్‌కు చేరుతుంది.',
    tier3Title: 'స్థాయి 3: ఉన్నత క్రమశిక్షణా మండలి',
    tier3Desc: 'మూడవ పునరావృత ఘటన ఉన్నత క్రమశిక్షణా బోర్డుకు బదిలీ చేయబడుతుంది.',

    anonymousToggle: 'పేరు లేకుండా నమోదు చేయండి (Anonymous)',
    confidentialNotice: 'మీ గుర్తింపు పూర్తిగా రక్షించబడింది.',
    incidentDate: 'సంఘటన తేదీ',
    incidentTime: 'సుమారు సమయం',
    incidentLocation: 'క్యాంపస్ ప్రదేశం / జోన్',
    onlinePlatform: 'ఆన్‌లైన్ ప్లాట్‌ఫారమ్ (Instagram, WhatsApp)',
    incidentType: 'సంఘటన రకం',
    description: 'సంఘటన పూర్తి వివరాలు',
    isOngoing: 'ఈ సంఘటన ఇంకా జరుగుతోందా?',
    urgencyLevel: 'అత్యవసర స్థాయి',
    suspectName: 'అనుమానితుడి పేరు (ఐచ్ఛికం)',
    suspectDept: 'అనుమానితుడి విభాగం (ఐచ్ఛికం)',
    suspectContact: 'సంప్రదింపు వివరాలు (ఐచ్ఛికం)',
    evidenceUpload: 'ఆధారాలు / స్క్రీన్‌షాట్ అప్‌లోడ్ చేయండి',
    evidenceHelper: 'ఆన్‌లైన్ వేధింపులకు స్క్రీన్‌షాట్ చాలా ఉపయోగపడుతుంది (గరిష్టంగా 5MB).',
    submitButton: 'రహస్య ఫిర్యాదు సమర్పించండి',
    submitting: 'పరిశీలించి సమర్పిస్తోంది...',

    submitted: 'సమర్పించబడింది',
    under_review: 'సమీక్షలో ఉంది',
    action_in_progress: 'చర్య కొనసాగుతోంది',
    escalated: 'ఉన్నత స్థాయికి పంపబడింది',
    resolved: 'పరిష్కరించబడింది',

    helplineText: 'తక్షశిల విశ్వవిద్యాలయం భద్రతా హెల్ప్‌లైన్ (24/7): 092976 23456',
  },

  ml: {
    systemTitle: 'ഏജിസ് ക്യാമ്പസ്',
    tagline: 'രഹസ്യ ക്യാമ്പസ് സുരക്ഷാ & റാഗിംഗ് റിപ്പോർട്ടിംഗ് സംവിധാനം',
    reportIncident: 'പരാതി നൽകുക',
    trackReport: 'പരാതി പരിശോധിക്കുക',
    myReports: 'എന്റെ പരാതികൾ',
    authorityPortal: 'അധികൃത ഡാഷ്‌ബോർഡ്',
    escalationMatrix: 'എസ്കലേഷൻ എഞ്ചിൻ',
    safeZones: 'സുരക്ഷിത മേഖലകൾ',
    guidelines: 'സുരക്ഷാ മാർഗ്ഗനിർദ്ദേശങ്ങൾ',
    settings: 'ക്രമീകരണങ്ങൾ & സ്വകാര്യത',

    urgentVoiceSOS: 'അടിയന്തര വോയ്‌സ് SOS റിപ്പോർട്ട്',
    instantVoiceSOSDesc: 'തത്സമയ GPS ലൊക്കേഷനും തത്സമയ റിപ്പോർട്ട് രേഖയും ഉൾക്കൊള്ളുന്ന അടിയന്തര വോയ്‌സ് പരാതി',
    speakToReport: 'മൈക്ക് അമർത്തി അടിയന്തര പ്രശ്നം സംസാരിക്കുക',
    recordingVoice: 'ശബ്ദം രേഖപ്പെടുത്തുകയും ടെക്സ്റ്റാക്കി മാറ്റുകയും ചെയ്യുന്നു...',
    liveGpsTracking: 'തത്സമയ GPS ലൊക്കേഷൻ കണ്ടെത്തുന്നു...',
    locationAcquired: 'ലൊക്കേഷൻ വിജയകരമായി ലഭിച്ചു',
    autoSubmittingIn: 'അടിയന്തര പരാതി സ്വമേധയാ സമർപ്പിക്കപ്പെടുന്നു:',
    submitInstantSos: 'ഉടൻ വോയ്‌സ് പരാതി സമർപ്പിക്കുക',
    sosDocumentReady: 'ഔദ്യോഗിക സുരക്ഷാ റിപ്പോർട്ട് തയ്യാറായി',
    downloadReceipt: 'ഔദ്യോഗിക PDF ഡൗൺലോഡ് ചെയ്യുക',
    aiAssistantTitle: 'ഏജിസ് AI ക്യാമ്പസ് അസിസ്റ്റന്റ്',
    aiAssistantSubtitle: 'പരാതി നൽകാനും സുരക്ഷാ വിവരങ്ങൾക്കും ചോദിക്കാം',
    askAssistantPlaceholder: 'എങ്ങനെ പരാതി നൽകണം? സുരക്ഷിത മേഖലകൾ എവിടെ?',
    howToUseSystem: 'ഈ പോർട്ടൽ എങ്ങനെ ഉപയോഗിക്കാം?',

    roleStudent: 'വിദ്യാർത്ഥി',
    roleHOD: 'വകുപ്പ് മേധാവി (HOD)',
    roleDean: 'ഡീൻ (Dean)',
    roleHigherAuthority: 'ഉന്നത അച്ചടക്ക സമിതി',
    demoRoleNotice: 'ഡെമോ റോൾ സ്വിച്ചർ — പരിശോധനയ്ക്കായി മാത്രം',

    offlineCategory: 'ഓഫ്‌ലൈൻ റാഗിംഗ്',
    offlineDesc: 'ശാരീരിക പീഡനം, ഭീഷണിപ്പെടുത്തൽ, ഹോസ്റ്റൽ ശല്യം ചെയ്യൽ.',
    onlineCategory: 'ഓൺലൈൻ റാഗിംഗ്',
    onlineDesc: 'സൈബർ ഭീഷണി, വ്യാജ അക്കൗണ്ടുകൾ, മോശം സന്ദേശങ്ങൾ.',

    tier1Title: 'ഘട്ടം 1: വകുപ്പ് മേധാവി പരിശോധന',
    tier1Desc: 'ആദ്യ പരാതി വകുപ്പ് മേധാവിയിലേക്ക്. വിദ്യാർത്ഥി വിവരം പൂർണ്ണമായും രഹസ്യം.',
    tier2Title: 'ഘട്ടം 2: ഡീനിലേക്ക് മാറ്റുന്നു',
    tier2Desc: 'രണ്ടാമത്തെ സംഭവം സ്വയമേവ ഡീനിലേക്ക് മാറ്റപ്പെടും.',
    tier3Title: 'ഘട്ടം 3: ഉന്നത അച്ചടക്ക സമിതി',
    tier3Desc: 'മൂന്നാമത്തെ സംഭവം ഉന്നത അച്ചടക്ക ബോർഡിലേക്ക് കൈമാറും.',

    anonymousToggle: 'പേര് വെളിപ്പെടുത്താതെ പരാതി നൽകുക (Anonymous)',
    confidentialNotice: 'നിങ്ങളുടെ വിവരങ്ങൾ പൂർണ്ണമായും സുരക്ഷിതമാണ്.',
    incidentDate: 'സംഭവ തീയതി',
    incidentTime: 'ഏകദേശ സമയം',
    incidentLocation: 'സ്ഥലം / ക്യാമ്പസ് മേഖല',
    onlinePlatform: 'ഓൺലൈൻ പ്ലാറ്റ്‌ഫോം (Instagram, WhatsApp)',
    incidentType: 'സംഭവ തരം',
    description: 'സംഭവത്തിന്റെ പൂർണ്ണ വിവരണം',
    isOngoing: 'ഇത് ഇപ്പോൾ തുടരുന്നുണ്ടോ?',
    urgencyLevel: 'അടിയന്തര നില',
    suspectName: 'സംശയിക്കപ്പെടുന്ന ആളുടെ പേര് (ഓപ്ഷണൽ)',
    suspectDept: 'വകുപ്പ് / വർഷം (ഓപ്ഷണൽ)',
    suspectContact: 'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ (ഓപ്ഷണൽ)',
    evidenceUpload: 'തെളിവ് / സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്യുക',
    evidenceHelper: 'ഓൺലൈൻ പരാതികൾക്ക് സ്ക്രീൻഷോട്ട് സഹായകരമാണ് (പരമാവധി 5MB).',
    submitButton: 'രഹസ്യ പരാതി സമർപ്പിക്കുക',
    submitting: 'പരിശോധിച്ച് സമർപ്പിക്കുന്നു...',

    submitted: 'സമർപ്പിച്ചു',
    under_review: 'പരിശോധനയിൽ',
    action_in_progress: 'നടപടി പുരോഗമിക്കുന്നു',
    escalated: 'ഉന്നത തലത്തിലേക്ക് മാറ്റി',
    resolved: 'പരിഹരിച്ചു',

    helplineText: 'തക്ഷശില സർവ്വകലാശാല സുരക്ഷാ ഹെൽപ്പ് ലൈൻ (24/7): 092976 23456',
  },

  kn: {
    systemTitle: 'ಏಜಿಸ್ ಕ್ಯಾಂಪಸ್',
    tagline: 'ಗೌಪ್ಯ ಕ್ಯಾಂಪಸ್ ಸುರಕ್ಷತೆ ಮತ್ತು ರ‍್ಯಾಗಿಂಗ್ ವರದಿ ವ್ಯವಸ್ಥೆ',
    reportIncident: 'ದೂರು ದಾಖಲಿಸಿ',
    trackReport: 'ದೂರಿನ ಸ್ಥಿತಿ ತಿಳಿಯಿರಿ',
    myReports: 'ನನ್ನ ದೂರುಗಳು',
    authorityPortal: 'ಅಧಿಕಾರಿಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    escalationMatrix: 'ಎಸ್ಕಲೇಷನ್ ಎಂಜಿನ್',
    safeZones: 'ಸುರಕ್ಷಿತ ವಲಯಗಳು',
    guidelines: 'ಸುರಕ್ಷತಾ ಮಾರ್ಗಸೂಚಿಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್ & ಗೌಪ್ಯತೆ',

    urgentVoiceSOS: 'ತುರ್ತು ವಾಯ್ಸ್ SOS ದೂರು',
    instantVoiceSOSDesc: 'ನೈಜ ಸಮಯದ GPS ಸ್ಥಳ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸ್ವಯಂ ದೂರು ದಾಖಲೆಯೊಂದಿಗೆ ತಕ್ಷಣದ ವಾಯ್ಸ್ ದೂರು',
    speakToReport: 'ಮೈಕ್ ಒತ್ತಿ ನಿಮ್ಮ ತುರ್ತು ದೂರನ್ನು ಮಾತನಾಡಿ',
    recordingVoice: 'ಧ್ವನಿಯನ್ನು ದಾಖಲಿಸಿ ಪಠ್ಯವಾಗಿ ಪರಿವರ್ತಿಸಲಾಗುತ್ತಿದೆ...',
    liveGpsTracking: 'ಲೈವ್ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    locationAcquired: 'ಸ್ಥಳದ ವಿವರಗಳನ್ನು ಪಡೆಯಲಾಗಿದೆ',
    autoSubmittingIn: 'ತುರ್ತು ದೂರು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ದಾಖಲಾಗುತ್ತಿದೆ:',
    submitInstantSos: 'ತಕ್ಷಣದ ವಾಯ್ಸ್ ದೂರು ಸಲ್ಲಿಸಿ',
    sosDocumentReady: 'ಅಧಿಕೃತ ಸುರಕ್ಷತಾ ವರದಿ ದಾಖಲೆ ಸಿದ್ಧವಾಗಿದೆ',
    downloadReceipt: 'ಅಧಿಕೃತ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    aiAssistantTitle: 'ಏಜಿಸ್ AI ಕ್ಯಾಂಪಸ್ ಸಹಾಯಕ',
    aiAssistantSubtitle: 'ದೂರು ದಾಖಲಾತಿ ಮತ್ತು ಸುರಕ್ಷತೆ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ',
    askAssistantPlaceholder: 'ದೂರು ದಾಖಲಿಸುವುದು ಹೇಗೆ? ಸುರಕ್ಷಿತ ವಲಯ ಎಲ್ಲಿದೆ?',
    howToUseSystem: 'ಈ ಪೋರ್ಟಲ್ ಅನ್ನು ಹೇಗೆ ಬಳಸುವುದು?',

    roleStudent: 'ವಿದ್ಯಾರ್ಥಿ',
    roleHOD: 'ವಿಭಾಗ ಮುಖ್ಯಸ್ಥ (HOD)',
    roleDean: 'ಡೀನ್ (Dean)',
    roleHigherAuthority: 'ಉನ್ನತ ಶಿಸ್ತು ಮಂಡಳಿ',
    demoRoleNotice: 'ಡೆಮೊ ರೋಲ್ ಸ್ವಿಚರ್ — ಮೌಲ್ಯಮಾಪನಕ್ಕಾಗಿ ಮಾತ್ರ',

    offlineCategory: 'ಆಫ್‌ಲೈನ್ ರ‍್ಯಾಗಿಂಗ್',
    offlineDesc: 'ದೈಹಿಕ ಕಿರುಕುಳ, ಬೆದರಿಕೆ, ಹಾಸ್ಟೆಲ್ ಕಿರುಕುಳ.',
    onlineCategory: 'ಆನ್‌ಲೈನ್ ರ‍್ಯಾಗಿಂಗ್',
    onlineDesc: 'ಸೈಬರ್ ಕಿರುಕುಳ, ನಕಲಿ ಖಾತೆಗಳು, ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಕಿರುಕುಳ.',

    tier1Title: 'ಹಂತ 1: ವಿಭಾಗ ಮುಖ್ಯಸ್ಥರ ಪರಿಶೀಲನೆ',
    tier1Desc: 'ಮೊದಲ ದೂರು ವಿಭಾಗ ಮುಖ್ಯಸ್ಥರಿಗೆ. ವಿದ್ಯಾರ್ಥಿ ವಿವರಗಳು ಸಂಪೂರ್ಣ ಗೌಪ್ಯ.',
    tier2Title: 'ಹಂತ 2: ಡೀನ್‌ಗೆ ವರ್ಗಾವಣೆ',
    tier2Desc: 'ಎರಡನೇ ಘಟನೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಡೀನ್‌ಗೆ ವರ್ಗಾವಣೆಯಾಗುತ್ತದೆ.',
    tier3Title: 'ಹಂತ 3: ಉನ್ನತ ಶಿಸ್ತು ಮಂಡಳಿ',
    tier3Desc: 'ಮೂರನೇ ಪುನರಾವರ್ತಿತ ಘಟನೆ ಉನ್ನತ ಶಿಸ್ತು ಮಂಡಳಿಗೆ ತಲುಪುತ್ತದೆ.',

    anonymousToggle: 'ಹೆಸರಿಲ್ಲದೆ ದೂರು ಸಲ್ಲಿಸಿ (Anonymous)',
    confidentialNotice: 'ನಿಮ್ಮ ಗುರುತು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿದೆ.',
    incidentDate: 'ಘಟನೆಯ ದಿನಾಂಕ',
    incidentTime: 'ಅಂದಾಜು ಸಮಯ',
    incidentLocation: 'ಸ್ಥಳ / ಕ್ಯಾಂಪಸ್ ವಲಯ',
    onlinePlatform: 'ಆನ್‌ಲೈನ್ ವೇದಿಕೆ (Instagram, WhatsApp)',
    incidentType: 'ಘಟನೆಯ ಪ್ರಕಾರ',
    description: 'ಘಟನೆಯ ಸಂಪೂರ್ಣ ವಿವರ',
    isOngoing: 'ಈ ಘಟನೆ ಈಗಲೂ ಮುಂದುವರಿದಿದೆಯೇ?',
    urgencyLevel: 'ತುರ್ತು ಮಟ್ಟ',
    suspectName: 'ಶಂಕಿತರ ಹೆಸರು (ಐಚ್ಛಿಕ)',
    suspectDept: 'ವಿಭಾಗ / ವರ್ಷ (ಐಚ್ಛಿಕ)',
    suspectContact: 'ಸಂಪರ್ಕ ವಿವರ (ಐಚ್ಛಿಕ)',
    evidenceUpload: 'ಪುರಾವೆ / ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    evidenceHelper: 'ಆನ್‌ಲೈನ್ ದೂರುಗಳಿಗೆ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಸಹಾಯಕ (ಗರಿಷ್ಠ 5MB).',
    submitButton: 'ಗೌಪ್ಯ ದೂರು ಸಲ್ಲಿಸಿ',
    submitting: 'ಪರಿಶೀಲಿಸಿ ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',

    submitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    under_review: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    action_in_progress: 'ಕ್ರಮ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    escalated: 'ಉನ್ನತ ಹಂತಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',

    helplineText: 'ತಕ್ಷಶಿಲಾ ವಿಶ್ವವಿದ್ಯಾಲಯ ಸುರಕ್ಷತಾ ಸಹಾಯವಾಣಿ (24/7): 092976 23456',
  },

  bn: {
    systemTitle: 'এজিস ক্যাম্পাস',
    tagline: 'গোপনীয় ক্যাম্পাস নিরাপত্তা ও র‍্যাগিং বিরোধী রিপোর্টিং পোর্টাল',
    reportIncident: 'অভিযোগ দায়ের করুন',
    trackReport: 'অভিযোগের স্থিতি দেখুন',
    myReports: 'আমার অভিযোগসমূহ',
    authorityPortal: 'কর্তৃপক্ষ ড্যাশবোর্ড',
    escalationMatrix: 'এসকেলেশন ইঞ্জিন',
    safeZones: 'নিরাপদ অঞ্চল (Safe Zones)',
    guidelines: 'নিরাপত্তা নির্দেশিকা',
    settings: 'সেটিংস ও গোপনীয়তা',

    urgentVoiceSOS: 'জরুরি ভয়েস SOS রিপোর্ট',
    instantVoiceSOSDesc: 'রিয়েল-টাইম জিপিএস লোকেশন ট্র্যাকিং এবং তাৎক্ষণিক রিপোর্ট ডকুমেন্ট সহ জরুরি ভয়েস অভিযোগ',
    speakToReport: 'মাইক টিপে আপনার জরুরি সমস্যা বলুন',
    recordingVoice: 'ভয়েস রেকর্ড হচ্ছে এবং লেখায় রূপান্তর করা হচ্ছে...',
    liveGpsTracking: 'লাইভ জিপিএস লোকেশন ট্র্যাক করা হচ্ছে...',
    locationAcquired: 'অবস্থানের তথ্য সুরক্ষিত করা হয়েছে',
    autoSubmittingIn: 'জরুরি অভিযোগ স্বয়ংক্রিয়ভাবে জমা হচ্ছে:',
    submitInstantSos: 'তাত্ক্ষণিক ভয়েস অভিযোগ জমা দিন',
    sosDocumentReady: 'অফিসিয়াল নিরাপত্তা রিপোর্ট ডকুমেন্ট তৈরি হয়েছে',
    downloadReceipt: 'অফিসিয়াল পিডিএফ ডাউনলোড করুন',
    aiAssistantTitle: 'এজিস এআই ক্যাম্পাস সহকারী',
    aiAssistantSubtitle: 'রিপোর্টিং, নিরাপত্তা ও নিয়মাবলী সংক্রান্ত প্রশ্ন জিজ্ঞাসা করুন',
    askAssistantPlaceholder: 'কীভাবে অভিযোগ করবেন? নিরাপদ স্থান কোথায়?',
    howToUseSystem: 'এই পোর্টাল কীভাবে ব্যবহার করবেন?',

    roleStudent: 'শিক্ষার্থী',
    roleHOD: 'বিভাগীয় প্রধান (HOD)',
    roleDean: 'ডিন (Dean)',
    roleHigherAuthority: 'উচ্চ শৃঙ্খলা বোর্ড',
    demoRoleNotice: 'ডেমো রোল পরিবর্তন — শুধুমাত্র মূল্যায়নের জন্য',

    offlineCategory: 'অফলাইন র‍্যাগিং',
    offlineDesc: 'শারীরিক নির্যাতন, কটূক্তি, হোস্টেল হয়রানি।',
    onlineCategory: 'অনলাইন র‍্যাগিং',
    onlineDesc: 'সাইবার বুলিং, ভুয়া অ্যাকাউন্ট, অনলাইন হুমকি।',

    tier1Title: 'স্তর ১: বিভাগীয় প্রধান পর্যালোচনা',
    tier1Desc: 'প্রথম অভিযোগ বিভাগীয় প্রধানের কাছে যাবে। শিক্ষার্থীর পরিচয় গোপন।',
    tier2Title: 'স্তর ২: ডিনের কাছে এসকেলেশন',
    tier2Desc: 'দ্বিতীয় পুনরাবৃত্তিমূলক ঘটনা স্বয়ংক্রিয়ভাবে ডিনের কাছে যাবে।',
    tier3Title: 'স্তর ৩: উচ্চ শৃঙ্খলা কমিটি',
    tier3Desc: 'তৃতীয় ঘটনা সরাসরি উচ্চ শৃঙ্খলা কমিটির কাছে স্থানান্তরিত হবে।',

    anonymousToggle: 'বেনামে অভিযোগ দায়ের করুন (Anonymous)',
    confidentialNotice: 'আপনার পরিচয় সম্পূর্ণ গোপন রাখা হবে।',
    incidentDate: 'ঘটনার তারিখ',
    incidentTime: 'আনুমানিক সময়',
    incidentLocation: 'ক্যাম্পাস স্থান / জোন',
    onlinePlatform: 'অনলাইন প্ল্যাটফর্ম (Instagram, WhatsApp)',
    incidentType: 'ঘটনার ধরন',
    description: 'ঘটনার সম্পূর্ণ বিবরণ',
    isOngoing: 'এই ঘটনা কি বর্তমানে চলছে?',
    urgencyLevel: 'জরুরি স্তর',
    suspectName: 'অভিযুক্তের নাম (ঐচ্ছিক)',
    suspectDept: 'অভিযুক্তের বিভাগ (ঐচ্ছিক)',
    suspectContact: 'যোগাযোগের বিবরণ (ঐচ্ছিক)',
    evidenceUpload: 'প্রমাণ / স্ক্রিনশট আপলোড করুন',
    evidenceHelper: 'অনলাইন হয়রানির ক্ষেত্রে স্ক্রিনশট উপযোগী (সর্বোচ্চ 5MB)।',
    submitButton: 'গোপনীয় রিপোর্ট জমা দিন',
    submitting: 'যাচাই ও জমা করা হচ্ছে...',

    submitted: 'জমা হয়েছে',
    under_review: 'পর্যালোচনাধীন',
    action_in_progress: 'পদক্ষেপ প্রক্রিয়াধীন',
    escalated: 'উচ্চ স্তরে স্থানান্তরিত',
    resolved: 'মীমাংসিত',

    helplineText: 'তক্ষশীলা বিশ্ববিদ্যালয় নিরাপত্তা হেল্পলাইন (24/7): 092976 23456',
  },

  mr: {
    systemTitle: 'एजिस कॅम्पस',
    tagline: 'गोपनीय कॅम्पस सुरक्षा व रॅगिंग प्रतिबंधक तक्रार प्रणाली',
    reportIncident: 'तक्रार नोंदवा',
    trackReport: 'तक्रारीची स्थिती तपासा',
    myReports: 'माझ्या तक्रारी',
    authorityPortal: 'अधिकारी डॅशबोर्ड',
    escalationMatrix: 'एस्केलेशन इंजिन',
    safeZones: 'सुरक्षित क्षेत्रे',
    guidelines: 'सुरक्षा मार्गदर्शक तत्त्वे',
    settings: 'सेटिंग्ज आणि गोपनीयता',

    urgentVoiceSOS: 'तातडीची व्हॉइस SOS तक्रार',
    instantVoiceSOSDesc: 'रिअल-टाइम जीपीएस लोकेशन ट्रॅकिंग आणि त्वरित अहवाल दस्तऐवजासह तातडीची व्हॉइस तक्रार',
    speakToReport: 'माईक दाबा आणि तुमची समस्या बोला',
    recordingVoice: 'आवाज रेकॉर्ड होत आहे आणि मजकुरात रूपांतरित केला जात आहे...',
    liveGpsTracking: 'थेट जीपीएस लोकेशन ट्रॅक केले जात आहे...',
    locationAcquired: 'स्थानाची माहिती सुरक्षित करण्यात आली आहे',
    autoSubmittingIn: 'तातडीची तक्रार आपोआप सबमिट होत आहे:',
    submitInstantSos: 'त्वरित व्हॉइस तक्रार सबमिट करा',
    sosDocumentReady: 'अधिकृत सुरक्षा अहवाल दस्तऐवज तयार झाला',
    downloadReceipt: 'अधिकृत पीडीएफ डाउनलोड करा',
    aiAssistantTitle: 'एजिस एआय कॅम्पस सहाय्यक',
    aiAssistantSubtitle: 'तक्रार नोंदणी आणि सुरक्षेविषयी कोणतीही शंका विचारा',
    askAssistantPlaceholder: 'तक्रार कशी करावी? सुरक्षित क्षेत्रे कुठे आहेत?',
    howToUseSystem: 'हे पोर्टल कसे वापरावे?',

    roleStudent: 'विद्यार्थी',
    roleHOD: 'विभाग प्रमुख (HOD)',
    roleDean: 'डीन (Dean)',
    roleHigherAuthority: 'उच्च शिस्तपालन समिती',
    demoRoleNotice: 'डेमो रोल स्विचर — केवळ मूल्यांकनासाठी',

    offlineCategory: 'ऑफलाइन रॅगिंग',
    offlineDesc: 'शारीरिक छळ, धमकी, वसतिगृहातील छळवणूक.',
    onlineCategory: 'ऑनलाइन रॅगिंग',
    onlineDesc: 'सायबर बुलिंग, बनावट खाती, सोशल मीडियावरील त्रास.',

    tier1Title: 'स्तर १: विभाग प्रमुख पुनरावलोकन',
    tier1Desc: 'पहिली तक्रार विभाग प्रमुखांकडे. विद्यार्थ्यांची ओळख पूर्णपणे गोपनीय.',
    tier2Title: 'स्तर २: डीनकडे एस्केलेशन',
    tier2Desc: 'दुसरी पुनरावृत्ती आपोआप डीनकडे हस्तांतरित होईल.',
    tier3Title: 'स्तर ३: उच्च शिस्तपालन समिती',
    tier3Desc: 'तिसरी घटना उच्च शिस्तपालन मंडळाकडे पाठवली जाईल.',

    anonymousToggle: 'नाव न सांगता तक्रार नोंदवा (Anonymous)',
    confidentialNotice: 'तुमची ओळख पूर्णपणे सुरक्षित आहे.',
    incidentDate: 'घटनेची तारीख',
    incidentTime: 'अंदाजे वेळ',
    incidentLocation: 'कॅम्पस ठिकाण / झोन',
    onlinePlatform: 'ऑनलाइन प्लॅटफॉर्म (Instagram, WhatsApp)',
    incidentType: 'घटनेचा प्रकार',
    description: 'घटनेचे संपूर्ण वर्णन',
    isOngoing: 'ही घटना सध्या सुरू आहे का?',
    urgencyLevel: 'तातडीची पातळी',
    suspectName: 'संशयिताचे नाव (पर्यायी)',
    suspectDept: 'विभाग / वर्ष (पर्यायी)',
    suspectContact: 'संपर्क तपशील (पर्यायी)',
    evidenceUpload: 'पुरावा / स्क्रीनशॉट अपलोड करा',
    evidenceHelper: 'ऑनलाइन छळासाठी स्क्रीनशॉट उपयुक्त ठरतो (जास्तीत जास्त 5MB).',
    submitButton: 'गोपनीय तक्रार सबमिट करा',
    submitting: 'तपासणी आणि सबमिट करत आहे...',

    submitted: 'नोंदवली',
    under_review: 'पुनरावलोकनात',
    action_in_progress: 'कारवाई सुरू',
    escalated: 'उच्च स्तरावर वर्ग',
    resolved: 'निवारण झाले',

    helplineText: 'तक्षशिला विद्यापीठ सुरक्षा हेल्पलाईन (24/7): 092976 23456',
  },

  gu: {
    systemTitle: 'એજિસ કેમ્પસ',
    tagline: 'ગુપ્ત કેમ્પસ સુરક્ષા અને રેગિંગ નિવારણ ફરિયાદ પોર્ટલ',
    reportIncident: 'ફરિયાદ નોંધાવો',
    trackReport: 'ફરિયાદ સ્થિતિ તપાસો',
    myReports: 'મારી ફરિયાદો',
    authorityPortal: 'અધિકારી ડેશબોર્ડ',
    escalationMatrix: 'એસ્કેલેશન એન્જિન',
    safeZones: 'સુરક્ષિત વિસ્તારો',
    guidelines: 'સુરક્ષા માર્ગદર્શિકા',
    settings: 'સેટિંગ્સ અને ગોપનીયતા',

    urgentVoiceSOS: 'તાત્કાલિક વોઇસ SOS ફરિયાદ',
    instantVoiceSOSDesc: 'રીઅલ-ટાઇમ જીપીએસ લોકેશન ટ્રેકિંગ અને તાત્કાલિક દસ્તાવેજ સાથે ત્વરિત વોઇસ ફરિયાદ',
    speakToReport: 'માઇક દબાવો અને તમારી સમસ્યા બોલો',
    recordingVoice: 'અવાજ રેકોર્ડ થઈ રહ્યો છે અને ટેક્સ્ટમાં રૂપાંતરિત થાય છે...',
    liveGpsTracking: 'લાઈવ જીપીએસ લોકેશન ટ્રેક થઈ રહ્યું છે...',
    locationAcquired: 'સ્થાનની વિગતો મેળવી લેવાઈ છે',
    autoSubmittingIn: 'કટોકટી ફરિયાદ આપોઆપ સબમિટ થઈ રહી છે:',
    submitInstantSos: 'તાત્કાલિક વોઇસ ફરિયાદ સબમિટ કરો',
    sosDocumentReady: 'સત્તાવાર સુરક્ષા અહેવાલ દસ્તાવેજ તૈયાર થયો',
    downloadReceipt: 'સત્તાવાર પીડીએફ ડાઉનલોડ કરો',
    aiAssistantTitle: 'એજિસ AI કેમ્પસ સહાયક',
    aiAssistantSubtitle: 'ફરિયાદ નોંધણી અને સુરક્ષા વિશે કોઈપણ પ્રશ્ન પૂછો',
    askAssistantPlaceholder: 'ફરિયાદ કેવી રીતે કરવી? સુરક્ષિત વિસ્તારો ક્યાં છે?',
    howToUseSystem: 'આ પોર્ટલનો ઉપયોગ કેવી રીતે કરવો?',

    roleStudent: 'વિદ્યાર્થી',
    roleHOD: 'વિભાગના વડા (HOD)',
    roleDean: 'ડીન (Dean)',
    roleHigherAuthority: 'ઉચ્ચ શિસ્ત સમિતિ',
    demoRoleNotice: 'ડેમો રોલ સ્વિચર — ફક્ત મૂલ્યાંકન હેતુ માટે',

    offlineCategory: 'ઓફલાઇન રેગિંગ',
    offlineDesc: 'શારીરિક સતામણી, ધમકી, હોસ્ટેલ હેરાનગતિ.',
    onlineCategory: 'ઓનલાઇન રેગિંગ',
    onlineDesc: 'સાયબર ઉત્પીડન, નકલી એકાઉન્ટ્સ, સોશિયલ મીડિયા પર સતામણી.',

    tier1Title: 'સ્તર ૧: વિભાગ વડા સમીક્ષા',
    tier1Desc: 'પ્રથમ ફરિયાદ વિભાગના વડા પાસે જશે. વિદ્યાર્થીની ઓળખ સંપૂર્ણ ગુપ્ત.',
    tier2Title: 'સ્તર ૨: ડીનને એસ્કેલેશન',
    tier2Desc: 'બીજી પુનરાવર્તિત ઘટના આપમેળે ડીનને ટ્રાન્સફર થશે.',
    tier3Title: 'સ્તર ૩: ઉચ્ચ શિસ્ત સમિતિ',
    tier3Desc: 'ત્રીજી ઘટના ઉચ્ચ શિસ્ત બોર્ડને મોકલવામાં આવશે.',

    anonymousToggle: 'નામ આપ્યા વગર ફરિયાદ નોંધાવો (Anonymous)',
    confidentialNotice: 'તમારી ઓળખ સંપૂર્ણ સુરક્ષિત છે.',
    incidentDate: 'ઘટનાની તારીખ',
    incidentTime: 'અંદાજિત સમય',
    incidentLocation: 'સ્થળ / કેમ્પસ ઝોન',
    onlinePlatform: 'ઓનલાઇન પ્લેટફોર્મ (Instagram, WhatsApp)',
    incidentType: 'ઘટનાનો પ્રકાર',
    description: 'ઘટનાનું સંપૂર્ણ વર્ણન',
    isOngoing: 'શું આ ઘટના હાલમાં ચાલુ છે?',
    urgencyLevel: 'કટોકટી સ્તર',
    suspectName: 'શંકાસ્પદનું નામ (વૈકલ્પિક)',
    suspectDept: 'વિભાગ / વર્ષ (વૈકલ્પિક)',
    suspectContact: 'સંપર્ક વિગતો (વૈકલ્પિક)',
    evidenceUpload: 'પુરાવા / સ્ક્રીનશોટ અપલોડ કરો',
    evidenceHelper: 'ઓનલાઇન સતામણી માટે સ્ક્રીનશોટ ઉપયોગી છે (મહત્તમ 5MB).',
    submitButton: 'ગુપ્ત ફરિયાદ સબમિટ કરો',
    submitting: 'ચકાસણી અને સબમિટ થઈ રહ્યું છે...',

    submitted: 'સબમિટ થઈ',
    under_review: 'સમીક્ષા હેઠળ',
    action_in_progress: 'કાર્યવાહી ચાલુ',
    escalated: 'ઉચ્ચ સ્તરે મોકલાયેલ',
    resolved: 'ઉકેલાયેલ',

    helplineText: 'તક્ષશિલા યુનિવર્સિટી સુરક્ષા હેલ્પલાઇન (24/7): 092976 23456',
  },

  es: {
    systemTitle: 'AegisCampus',
    tagline: 'Sistema Confidencial de Denuncia de Acoso y Seguridad en el Campus',
    reportIncident: 'Reportar un Incidente',
    trackReport: 'Seguir Reporte',
    myReports: 'Mis Reportes',
    authorityPortal: 'Panel de Autoridades',
    escalationMatrix: 'Motor de Escalamiento',
    safeZones: 'Zonas Seguras',
    guidelines: 'Pautas de Seguridad',
    settings: 'Configuración y Privacidad',

    urgentVoiceSOS: 'Reporte SOS de Voz Urgente',
    instantVoiceSOSDesc: 'Queja de voz de 1 clic de emergencia con rastreo GPS en tiempo real y generación automática de reporte',
    speakToReport: 'Presiona el Micrófono y Habla tu Emergencia',
    recordingVoice: 'Escuchando y transcribiendo voz en tiempo real...',
    liveGpsTracking: 'Rastreando coordenadas GPS en vivo...',
    locationAcquired: 'Coordenadas de ubicación aseguradas',
    autoSubmittingIn: 'Envío automático de reporte crítico en:',
    submitInstantSos: 'Enviar Reporte de Voz Inmediato',
    sosDocumentReady: 'Documento Oficial de Incidente Generado',
    downloadReceipt: 'Descargar Reporte Oficial en PDF',
    aiAssistantTitle: 'Asistente IA de Aegis Campus',
    aiAssistantSubtitle: 'Pregunta sobre cómo reportar, confidencialidad y auxilio',
    askAssistantPlaceholder: '¿Cómo reportar? ¿Dónde están las zonas seguras?',
    howToUseSystem: '¿Cómo utilizar este portal de seguridad?',

    roleStudent: 'Estudiante',
    roleHOD: 'Jefe de Departamento (HOD)',
    roleDean: 'Decano de Bienestar Estudiantil',
    roleHigherAuthority: 'Comité Disciplinario Superior',
    demoRoleNotice: 'Selector de Rol de Demostración — Solo con fines de prueba',

    offlineCategory: 'Novatadas Físicas (Offline)',
    offlineDesc: 'Acoso físico, intimidación, hostigamiento en dormitorios o pasillos.',
    onlineCategory: 'Acoso Digital (Online)',
    onlineDesc: 'Ciberacoso, cuentas falsas, mensajes abusivos y coacción digital.',

    tier1Title: 'Nivel 1: Revisión por HOD',
    tier1Desc: 'Primera queja asignada al HOD. Identidad de la víctima estrictamente protegida.',
    tier2Title: 'Nivel 2: Escalamiento al Decano',
    tier2Desc: 'El segundo incidente repetido escala automáticamente al Decano.',
    tier3Title: 'Nivel 3: Autoridad Superior',
    tier3Desc: 'El tercer incidente repetido escala a la Junta Disciplinaria Superior.',

    anonymousToggle: 'Reportar Anónimamente (Sin Identidad Registrada)',
    confidentialNotice: 'Su identidad está protegida bajo las directrices contra represalias del campus.',
    incidentDate: 'Fecha del Incidente',
    incidentTime: 'Hora Aproximada',
    incidentLocation: 'Ubicación en el Campus / Zona',
    onlinePlatform: 'Plataforma Online (p. ej. Instagram, WhatsApp)',
    incidentType: 'Tipo de Incidente',
    description: 'Descripción Detallada de lo Ocurrido',
    isOngoing: '¿Este incidente continúa ocurriendo?',
    urgencyLevel: 'Nivel de Urgencia',
    suspectName: 'Nombre del Sospechoso (Opcional)',
    suspectDept: 'Departamento / Año (Opcional)',
    suspectContact: 'Contacto / Usuario (Opcional)',
    evidenceUpload: 'Subir Captura de Pantalla o Evidencia',
    evidenceHelper: 'Para quejas digitales, se recomiendan capturas de pantalla (Máx 5MB).',
    submitButton: 'Enviar Reporte Confidencial',
    submitting: 'Verificando y enviando...',

    submitted: 'Enviado',
    under_review: 'En Revisión',
    action_in_progress: 'Acción en Progreso',
    escalated: 'Escalado',
    resolved: 'Resuelto',

    helplineText: 'Línea de Seguridad Universidad Takshashila (24/7): 092976 23456',
  },

  fr: {
    systemTitle: 'AegisCampus',
    tagline: 'Système Confidentiel de Signalement du Harcèlement sur le Campus',
    reportIncident: 'Signaler un Incident',
    trackReport: 'Suivre un Signalement',
    myReports: 'Mes Signalements',
    authorityPortal: 'Tableau de Bord Autorité',
    escalationMatrix: 'Moteur d\'Escalade',
    safeZones: 'Zones Sécurisées',
    guidelines: 'Directives de Sécurité',
    settings: 'Paramètres et Confidentialité',

    urgentVoiceSOS: 'Signalement Vocal d\'Urgence SOS',
    instantVoiceSOSDesc: 'Plainte vocale d\'urgence en 1 clic avec géolocalisation GPS en temps réel et rapport officiel généré',
    speakToReport: 'Appuyez sur le micro et décrivez votre urgence',
    recordingVoice: 'Écoute et transcription vocale en cours...',
    liveGpsTracking: 'Recherche des coordonnées GPS en direct...',
    locationAcquired: 'Coordonnées de localisation enregistrées',
    autoSubmittingIn: 'Soumission automatique du rapport d\'urgence dans :',
    submitInstantSos: 'Soumettre la plainte vocale immédiate',
    sosDocumentReady: 'Document officiel d\'incident généré avec succès',
    downloadReceipt: 'Télécharger le rapport PDF officiel',
    aiAssistantTitle: 'Assistant IA Aegis Campus',
    aiAssistantSubtitle: 'Posez vos questions sur les signalements et la sécurité',
    askAssistantPlaceholder: 'Comment signaler ? Où sont les zones de sécurité ?',
    howToUseSystem: 'Comment utiliser ce portail de sécurité ?',

    roleStudent: 'Étudiant',
    roleHOD: 'Chef de Département (HOD)',
    roleDean: 'Doyen de la Vie Étudiante',
    roleHigherAuthority: 'Conseil Disciplinaire Supérieur',
    demoRoleNotice: 'Sélecteur de Rôle Démo — À des fins d\'évaluation',

    offlineCategory: 'Bizutage Physique (Hors ligne)',
    offlineDesc: 'Harcèlement physique, menaces, intimidation dans les résidences ou couloirs.',
    onlineCategory: 'Cyberharcèlement (En ligne)',
    onlineDesc: 'Intimidation en ligne, faux comptes, messages injurieux et chantage numérique.',

    tier1Title: 'Niveau 1 : Examen par le Chef de Département',
    tier1Desc: 'Première plainte transmise au HOD. Identité de l\'étudiant strictement masquée.',
    tier2Title: 'Niveau 2 : Escalade vers le Doyen',
    tier2Desc: 'Deuxième récidive automatiquement transmise au Doyen.',
    tier3Title: 'Niveau 3 : Haute Autorité Disciplinaire',
    tier3Desc: 'Troisième récidive transférée au conseil supérieur de discipline.',

    anonymousToggle: 'Signaler Anonymement (Zéro identité transmise)',
    confidentialNotice: 'Votre identité est protégée conformément aux règles de protection du campus.',
    incidentDate: 'Date de l\'Incident',
    incidentTime: 'Heure Approximative',
    incidentLocation: 'Lieu sur le Campus / Zone',
    onlinePlatform: 'Plateforme en Ligne (Instagram, WhatsApp, Discord)',
    incidentType: 'Type d\'Incident',
    description: 'Description Détaillée de l\'Événement',
    isOngoing: 'Cet incident est-il actuellement en cours ?',
    urgencyLevel: 'Niveau d\'Urgence',
    suspectName: 'Nom du Suspect (Facultatif)',
    suspectDept: 'Département / Année (Facultatif)',
    suspectContact: 'Contact / Pseudo (Facultatif)',
    evidenceUpload: 'Téléverser Capture d\'Écran ou Preuve',
    evidenceHelper: 'Pour le cyberharcèlement, les captures d\'écran sont recommandées (Max 5Mo).',
    submitButton: 'Soumettre le Rapport Confidentiel',
    submitting: 'Vérification et transmission en cours...',

    submitted: 'Soumis',
    under_review: 'En cours d\'examen',
    action_in_progress: 'Action en cours',
    escalated: 'Transmis au niveau supérieur',
    resolved: 'Résolu',

    helplineText: "Ligne de Sécurité Université Takshashila (24h/24) : 092976 23456",
  },

  de: {
    systemTitle: 'AegisCampus',
    tagline: 'Vertrauliches Meldesystem für Campussicherheit & Belästigung',
    reportIncident: 'Vorfall Melden',
    trackReport: 'Meldung Verfolgen',
    myReports: 'Meine Meldungen',
    authorityPortal: 'Behörden-Dashboard',
    escalationMatrix: 'Eskalations-Engine',
    safeZones: 'Sicherheitszonen',
    guidelines: 'Sicherheitsrichtlinien',
    settings: 'Einstellungen & Datenschutz',

    urgentVoiceSOS: 'Dringender Sprach-SOS-Bericht',
    instantVoiceSOSDesc: '1-Klick Notfall-Sprachbeschwerde mit Echtzeit-GPS-Ortung und automatischer Berichterstellung',
    speakToReport: 'Mikrofon drücken & Notfall schildern',
    recordingVoice: 'Sprache wird aufgezeichnet & in Text umgewandelt...',
    liveGpsTracking: 'Live-GPS-Koordinaten werden ermittelt...',
    locationAcquired: 'Standortkoordinaten erfolgreich erfasst',
    autoSubmittingIn: 'Automatische Notfall-Übermittlung in:',
    submitInstantSos: 'Sofortige Sprachmeldung einreichen',
    sosDocumentReady: 'Offizielles Sicherheitsdokument erstellt',
    downloadReceipt: 'Offiziellen PDF-Bericht herunterladen',
    aiAssistantTitle: 'Aegis KI Campus-Assistent',
    aiAssistantSubtitle: 'Fragen zu Meldungen, Anonymität & Sicherheit stellen',
    askAssistantPlaceholder: 'Wie erstelle ich eine Meldung? Wo sind Schutzzonen?',
    howToUseSystem: 'Wie benutze ich dieses Sicherheitsportal?',

    roleStudent: 'Student/in',
    roleHOD: 'Fachbereichsleiter (HOD)',
    roleDean: 'Dekan für studentische Angelegenheiten',
    roleHigherAuthority: 'Disziplinarausschuss',
    demoRoleNotice: 'Demo-Rollenwechsler — Nur zu Evaluierungszwecken',

    offlineCategory: 'Offline-Belästigung & Mobbing',
    offlineDesc: 'Körperliche Belästigung, Stalking, Bedrohung im Wohnheim oder Campus.',
    onlineCategory: 'Online-Belästigung & Cybermobbing',
    onlineDesc: 'Cybermobbing, Fake-Accounts, beleidigende DMs und Erpressung.',

    tier1Title: 'Stufe 1: HOD-Überprüfung',
    tier1Desc: 'Erste Beschwerde geht an den HOD. Identität des Opfers streng geschützt.',
    tier2Title: 'Stufe 2: Eskalation an den Dekan',
    tier2Desc: 'Zweiter Wiederholungsfall eskaliert automatisch zum Dekan.',
    tier3Title: 'Stufe 3: Oberster Disziplinarausschuss',
    tier3Desc: 'Dritter Vorfall wird direkt an den obersten Disziplinarausschuss übergeben.',

    anonymousToggle: 'Anonym melden (Keine Identität übertragen)',
    confidentialNotice: 'Ihre Identität wird gemäß den Campus-Schutzrichtlinien vertraulich behandelt.',
    incidentDate: 'Vorfallsdatum',
    incidentTime: 'Ungefähre Uhrzeit',
    incidentLocation: 'Ort auf dem Campus / Zone',
    onlinePlatform: 'Online-Plattform (z. B. Instagram, WhatsApp)',
    incidentType: 'Art des Vorfalls',
    description: 'Detaillierte Beschreibung des Vorfalls',
    isOngoing: 'Dauert dieser Vorfall aktuell an?',
    urgencyLevel: 'Dringlichkeitsstufe',
    suspectName: 'Name des Verdächtigen (Optional)',
    suspectDept: 'Fachbereich / Semester (Optional)',
    suspectContact: 'Kontakt / Social Handle (Optional)',
    evidenceUpload: 'Screenshot oder Beweisfoto hochladen',
    evidenceHelper: 'Für Online-Vorfälle werden Screenshots empfohlen (Max. 5MB).',
    submitButton: 'Vertraulichen Bericht Einreichen',
    submitting: 'Wird überprüft und übermittelt...',

    submitted: 'Eingereicht',
    under_review: 'In Prüfung',
    action_in_progress: 'Maßnahme läuft',
    escalated: 'Eskaliert',
    resolved: 'Gelöst',

    helplineText: 'Takshashila Universität Sicherheits-Helpline (24/7): 092976 23456',
  },
};
