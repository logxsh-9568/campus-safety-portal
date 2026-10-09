import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldCheck,
  Radio,
  FileText,
  Search,
  MapPin,
  Volume2,
  VolumeX,
  Mic,
  Maximize2,
  Minimize2,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { TakshashilaEmblemIcon } from './TakshashilaLogo';
import { TAKSHASHILA_CAMPUS_INFO } from '../utils/takshashilaAssets';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    action: () => void;
    icon?: any;
    primary?: boolean;
  }[];
}

interface AIAssistantChatbotProps {
  onNavigateTab: (tab: string) => void;
  onOpenVoiceSOS: () => void;
  onStartReport: (category?: 'offline' | 'online') => void;
  lang: Language;
}

export const AIAssistantChatbot: React.FC<AIAssistantChatbotProps> = ({
  onNavigateTab,
  onOpenVoiceSOS,
  onStartReport,
  lang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = translations[lang] || translations.en;

  // Initial welcome message based on language
  const getWelcomeMessage = (): Message => {
    const welcomeTexts: Record<Language, string> = {
      en: "Hello! I am your Takshashila University AI Safety Assistant. How can I assist you across our Ongur campus today? You can ask how to file a confidential complaint, how the 3-tier escalation works, or how to trigger emergency Voice SOS.",
      ta: "வணக்கம்! நான் உங்கள் தக்ஷஷீலா பல்கலைக்கழக AI பாதுகாப்பு உதவியாளர். ஓங்கூர் வளாகத்தில் புகார் அளிப்பது, இரகசியப் பாதுகாப்பு முறை, அல்லது அவசர Voice SOS பற்றி எதை வேண்டுமானாலும் கேட்கலாம்.",
      hi: "नमस्ते! मैं आपका तक्षशिला विश्वविद्यालय एआई सुरक्षा सहायक हूँ। आप शिकायत दर्ज करने, गोपनीयता नियमों या इमरजेंसी वॉयस एसओएस के बारे में पूछ सकते हैं।",
      te: "నమస్కారం! నేను మీ తక్షశిల విశ్వవిద్యాలయం AI భద్రతా సహాయకుడిని. ఫిర్యాదు నమోదు లేదా ఎమర్జెన్సీ వాయిస్ SOS గురించి అడగండి.",
      ml: "നമസ്കാരം! ഞാൻ തക്ഷശില സർവ്വകലാശാല ക്യാമ്പസ് സുരക്ഷാ AI അസിസ്റ്റന്റാണ്. പരാതി നൽകുന്നതിനെക്കുറിച്ചോ അടിയന്തര വോയ്‌സ് SOS നെക്കുറിച്ചോ ചോദിക്കാം.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ತಕ್ಷಶಿಲಾ ವಿಶ್ವವಿದ್ಯಾಲಯ ಸುರಕ್ಷತಾ AI ಸಹಾಯಕ. ದೂರು ದಾಖಲಿಸುವುದು ಅಥವಾ ತುರ್ತು ವಾಯ್ಸ್ SOS ಬಗ್ಗೆ ಕೇಳಿ.",
      bn: "নমস্কার! আমি আপনার তক্ষশীলা বিশ্ববিদ্যালয় এআই নিরাপত্তা সহকারী। অভিযোগ দায়ের বা জরুরি ভয়েস এসওএস সম্পর্কে জিজ্ঞাসা করুন।",
      mr: "नमस्कार! मी तुमचा तक्षशिला विद्यापीठ एआय सुरक्षा सहाय्यक आहे. तक्रार नोंदणी किंवा आपत्कालीन व्हॉइस एसओएस कसा वापरायचा ते विचारा.",
      gu: "નમસ્તે! હું તમારો તક્ષશિલા યુનિવર્સિટી AI સુરક્ષા સહાયક છું. ફરિયાદ નોંધણી અથવા ઇમરજન્સી વોઇસ SOS વિશે પૂછી શકો છો.",
      es: "Hola! Soy el asistente de seguridad IA de la Universidad Takshashila. Pregúntame sobre cómo reportar incidentes en el campus de Ongur o usar el SOS de voz.",
      fr: "Bonjour ! Je suis l'assistant IA de sécurité de l'Université Takshashila. Demandez-moi comment signaler un incident ou utiliser le SOS vocal d'urgence.",
      de: "Hallo! Ich bin Ihr Takshashila University KI-Sicherheitsassistent. Fragen Sie mich zu vertraulichen Meldungen oder dem Notfall-Sprach-SOS.",
    };

    return {
      id: 'welcome-1',
      sender: 'ai',
      text: welcomeTexts[lang] || welcomeTexts.en,
      timestamp: 'Just now',
      actions: [
        {
          label: 'How to file a confidential report?',
          action: () => handleUserQuestion('How to report an incident on Takshashila portal?'),
          icon: FileText,
          primary: true,
        },
        {
          label: 'How does Urgent Voice SOS work?',
          action: () => handleUserQuestion('How does Urgent Voice SOS reporting work?'),
          icon: Radio,
        },
        {
          label: 'Explain 3-Tier Escalation (HOD to Dean to Board)',
          action: () => handleUserQuestion('Explain the 3-Tier Escalation Engine (HOD to Dean to Higher Authority)'),
          icon: Sparkles,
        },
        {
          label: 'Where are Ongur Campus Safe Zones?',
          action: () => handleUserQuestion('Where are campus safe zones at Takshashila University?'),
          icon: MapPin,
        },
      ],
    };
  };

  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'ai') {
      setMessages([getWelcomeMessage()]);
    }
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  // Quick preset questions
  const quickSuggestions = [
    { query: 'How to use this portal?', label: 'How to use portal?' },
    { query: 'How to raise urgent voice complaint?', label: 'Emergency Voice SOS' },
    { query: 'Where are Takshashila safe zones?', label: 'Campus Safe Zones' },
    { query: 'How does escalation to Dean work?', label: 'Escalation Process' },
    { query: 'How to track my complaint?', label: 'Track Complaint' },
  ];

  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setInputValue(spoken);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      rec.start();
      setIsListening(true);
      recognitionRef.current = rec;
    } catch (e) {
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const generateAIResponse = (userQuery: string): { text: string; actions?: any[] } => {
    const q = userQuery.toLowerCase();

    // Urgent / Voice query
    if (
      q.includes('voice') ||
      q.includes('sos') ||
      q.includes('urgent') ||
      q.includes('takunu') ||
      q.includes('location') ||
      q.includes('mic') ||
      q.includes('emergency') ||
      q.includes('danger')
    ) {
      return {
        text: `**Takshashila Urgent Voice SOS & Live Geolocation:**\n\n1. Press the **Voice SOS** button in the header or home screen.\n2. The system locks onto your **real-time GPS coordinates** in Ongur (e.g., Kaveri Hostel, SET Block, Central Library, Agro Research Farm).\n3. Speak clearly — your voice statement is transcribed into a structured dossier in real time.\n4. You can submit immediately or let the 5-second countdown auto-dispatch.\n5. The emergency complaint is escalated directly to the **Dean of Student Welfare & Campus Security Squad**, generating a timestamped printable PDF receipt with reference ID.`,
        actions: [
          {
            label: 'Launch Urgent Voice SOS Now',
            action: () => {
              setIsOpen(false);
              onOpenVoiceSOS();
            },
            primary: true,
            icon: Radio,
          },
        ],
      };
    }

    // How to use portal
    if (
      q.includes('how to use') ||
      q.includes('epdi use') ||
      q.includes('use pananum') ||
      q.includes('guide') ||
      q.includes('overview') ||
      q.includes('features')
    ) {
      return {
        text: `**Welcome to Takshashila University Safety Portal! Here is how to use this platform:**\n\n1. **Report Incident:** File an Offline (physical/hostel ragging) or Online (cyber harassment/social media) complaint.\n2. **Confidentiality:** Choose "File Anonymously" for zero identity capture. If you provide contact details, your name remains redacted from HOD & Dean reviewer queues.\n3. **3-Tier Escalation:** 1st complaint $\\to$ School HOD; 2nd repeat $\\to$ Dean of Student Welfare; 3rd repeat $\\to$ Higher Disciplinary Board.\n4. **Urgent Voice SOS:** Press Voice SOS in dangerous situations for real-time GPS location lock and instant dispatch.\n5. **Track Incident:** Use your unique Reference Token (e.g. \`TU-2026-XXXX\`) to track review progress.`,
        actions: [
          {
            label: 'File a Confidential Report',
            action: () => {
              setIsOpen(false);
              onStartReport('offline');
            },
            primary: true,
            icon: FileText,
          },
          {
            label: 'Track Existing Case',
            action: () => {
              setIsOpen(false);
              onNavigateTab('track');
            },
            icon: Search,
          },
        ],
      };
    }

    // Safe zones & campus blocks
    if (
      q.includes('safe zone') ||
      q.includes('location') ||
      q.includes('map') ||
      q.includes('block') ||
      q.includes('ongur') ||
      q.includes('tindivanam') ||
      q.includes('hostel')
    ) {
      return {
        text: `**Takshashila University Campus Infrastructure (Ongur, Tindivanam):**\n\n- **Administrative & Chancellery Tower:** Main governance and Proctor command.\n- **School of Engineering & Technology (SET):** 48 CCTV nodes, Ground floor Atrium SOS kiosk.\n- **Kaveri & Vaigai Boys Hostels / Thamirabarani & Bhavani Girls Hostels:** 24/7 guarded residential gates.\n- **Takshashila Central Library:** Air-conditioned knowledge hub with illuminated safe walking corridors.\n- **Main GST Highway Gate:** 24/7 security sentry & visitor ANPR checkpoint.\n\nCampus Control Room: **04147 - 294444**`,
        actions: [
          {
            label: 'Explore Campus Safe Zones',
            action: () => {
              setIsOpen(false);
              onNavigateTab('safe-zones');
            },
            primary: true,
            icon: MapPin,
          },
        ],
      };
    }

    // Default response
    return {
      text: `I am here to help you navigate Takshashila University's Safety Portal:\n\n• **File a new complaint** (Offline physical/hostel or Online cyber harassment)\n• **Trigger Urgent Voice SOS** with live Ongur campus GPS lock\n• **Track case progress** using your reference ID\n• **Review Campus Safe Zones & Emergency Call Booths**\n• **Takshashila Rapid Safety Helpline:** ${TAKSHASHILA_CAMPUS_INFO.helpline.campusControlRoom}`,
      actions: [
        {
          label: 'Submit Complaint',
          action: () => {
            setIsOpen(false);
            onStartReport();
          },
          primary: true,
        },
        {
          label: 'Emergency Voice SOS',
          action: () => {
            setIsOpen(false);
            onOpenVoiceSOS();
          },
          icon: Radio,
        },
      ],
    };
  };

  const handleUserQuestion = (queryText: string) => {
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      const { text, actions } = generateAIResponse(queryText);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
      speakText(text);
    }, 400);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    handleUserQuestion(inputValue.trim());
  };

  return (
    <>
      {/* Floating Circular Trigger Button */}
      <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center select-none">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-200"
            aria-label="Open AI Assistant"
            title="Open Takshashila AI Safety Assistant"
          >
            {/* Circular College Logo Button */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-[#E25822] shadow-2xl shadow-orange-500/30 flex items-center justify-center p-2 group-hover:border-amber-400 group-hover:shadow-orange-500/50 transition-all">
              {/* Green Online Status Pulse Dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#21E6A8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#21E6A8] border-2 border-[#07101E]"></span>
              </span>

              {/* Exact Takshashila Circular Emblem Vector */}
              <TakshashilaEmblemIcon size="100%" />
            </div>

            {/* AI Assistant Label below circle */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black text-white bg-[#0A1422]/95 border border-[rgba(148,163,184,0.3)] shadow-lg tracking-wider uppercase group-hover:border-[#E25822] transition-colors">
              AI Assistant
            </span>
          </button>
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-3 sm:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[420px] max-w-[440px] h-[580px] max-h-[85vh]'
          } flex flex-col rounded-3xl bg-[#07101E] border border-[rgba(148,163,184,0.25)] shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Header */}
          <div className="p-4 sm:px-5 sm:py-4 bg-gradient-to-r from-[#0F172E] via-[#1E255E] to-[#0F172E] border-b border-[rgba(148,163,184,0.18)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-[#F5A623] to-amber-600 text-black shadow-md shadow-amber-500/30">
                <Bot className="w-5 h-5 text-black" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#21E6A8] border border-[#0A1628]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">Takshashila AI Safety Assistant</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-[#21E6A8] border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-[#AAB3C2] leading-tight">
                  Ongur Campus Safety & Redressal Desk
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#AAB3C2]">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  speechEnabled ? 'text-[#21E6A8] bg-[#21E6A8]/10' : 'hover:text-white'
                }`}
                title={speechEnabled ? 'Mute Voice Read-out' : 'Enable Voice Read-out'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:inline-flex p-1.5 rounded-lg hover:text-white hover:bg-[#080B12] transition-colors cursor-pointer"
                title={isExpanded ? 'Collapse window' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-[#080B12] transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick SOS Trigger Banner */}
          <div className="px-4 py-2 bg-red-950/30 border-b border-red-500/20 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-red-400 font-semibold text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>In Immediate Danger on Campus?</span>
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenVoiceSOS();
              }}
              className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Radio className="w-3 h-3" />
              <span>Trigger Voice SOS</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#F5A623] shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                      : 'bg-[#0A1422] border border-[rgba(148,163,184,0.18)] text-[#F5F7FA] rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 flex flex-col gap-1.5 border-t border-[rgba(148,163,184,0.12)]">
                      {msg.actions.map((act, i) => {
                        const Icon = act.icon || ChevronRight;
                        return (
                          <button
                            key={i}
                            onClick={act.action}
                            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer ${
                              act.primary
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-[#F5A623] border border-amber-500/40'
                                : 'bg-[#080B12] hover:bg-[#071426] text-[#AAB3C2] hover:text-white border border-[rgba(148,163,184,0.15)]'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Icon className="w-3.5 h-3.5 text-current shrink-0" />
                              <span>{act.label}</span>
                            </span>
                            <ArrowRight className="w-3 h-3 shrink-0 opacity-60" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-[#AAB3C2]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-[#AAB3C2] p-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#F5A623]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="flex items-center gap-1 bg-[#0A1422] px-3 py-2 rounded-xl border border-[rgba(148,163,184,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#21E6A8] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] ml-1">Analyzing Takshashila protocols...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-[#050B14] border-t border-[rgba(148,163,184,0.1)] overflow-x-auto scrollbar-none flex items-center gap-1.5">
            {quickSuggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleUserQuestion(s.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#080B12] hover:bg-[#0A1422] text-[#AAB3C2] hover:text-white border border-[rgba(148,163,184,0.15)] text-[10px] font-medium transition-colors shrink-0 cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#080B12] border-t border-[rgba(148,163,184,0.15)] flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-[#0A1422] text-[#AAB3C2] hover:text-white border-[rgba(148,163,184,0.2)]'
              }`}
              title={isListening ? 'Listening...' : 'Speak your question'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about reporting, Kaveri/Thamirabarani hostels, safe zones..."
              className="flex-1 bg-[#0A1422] text-xs text-white placeholder-[#AAB3C2] px-3.5 py-2.5 rounded-xl border border-[rgba(148,163,184,0.2)] focus:outline-none focus:border-[#F5A623] transition-colors"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isThinking}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#F5A623] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold disabled:opacity-40 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
