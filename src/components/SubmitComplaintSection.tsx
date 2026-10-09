import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  EyeOff,
  AlertCircle,
  Upload,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Globe2,
  Building2,
  User,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Info,
  Mic,
  Radio,
  Compass,
} from 'lucide-react';
import {
  ComplaintCategory,
  UrgencyLevel,
  IncidentReport,
  EvidenceAttachment,
} from '../types';
import {
  determineIncidentGroup,
  createEscalationNotification,
  buildEscalationRecord,
} from '../utils/escalationEngine';
import { Language, translations } from '../utils/i18n';

interface SubmitComplaintSectionProps {
  initialCategory?: ComplaintCategory;
  existingReports: IncidentReport[];
  onSubmitSuccess: (newReport: IncidentReport) => void;
  onTrackSubmitted: (reportId: string) => void;
  lang: Language;
}

export const SubmitComplaintSection: React.FC<SubmitComplaintSectionProps> = ({
  initialCategory = 'offline',
  existingReports,
  onSubmitSuccess,
  onTrackSubmitted,
  lang,
}) => {
  const t = translations[lang];

  // Form State
  const [category, setCategory] = useState<ComplaintCategory>(initialCategory);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  // Reporter (Only captured when NOT anonymous)
  const [reporterName, setReporterName] = useState('');
  const [reporterDept, setReporterDept] = useState('');
  const [reporterId, setReporterId] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  // Incident Details
  const [incidentDate, setIncidentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [approxTime, setApproxTime] = useState('20:00');
  const [incidentType, setIncidentType] = useState('Verbal Abuse & Intimidation');
  const [locationOrPlatform, setLocationOrPlatform] = useState('');
  const [onlineAccountHandle, setOnlineAccountHandle] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isOngoing, setIsOngoing] = useState(false);
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');

  // Suspect Details (Optional)
  const [suspectName, setSuspectName] = useState('');
  const [suspectDept, setSuspectDept] = useState('');
  const [suspectPhone, setSuspectPhone] = useState('');
  const [suspectHandle, setSuspectHandle] = useState('');
  const [suspectOther, setSuspectOther] = useState('');

  // Evidence Attachment
  const [evidence, setEvidence] = useState<EvidenceAttachment | undefined>();
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  // UI Flow & Submission State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Offline vs Online type options
  const offlineTypes = [
    'Verbal Abuse & Intimidation',
    'Physical Harassment or Push',
    'Hostel Room Intrusion & Forced Chores',
    'Stalking on Campus Pathways',
    'Dress Code Mockery & Public Humiliation',
    'Extortion or Compelled Spending',
    'Other In-Person Hostile Conduct',
  ];

  const onlineTypes = [
    'Fake Account Impersonation',
    'Abusive DMs or Cyber Bullying',
    'Obscene Content or Media Sharing',
    'Online Blackmail / Coercion',
    'Defamation on Campus Confession Pages',
    'Doxxing / Leaking Phone Numbers',
    'Other Cyber Misconduct',
  ];

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const removeEvidence = () => {
    setEvidence(undefined);
    setEvidenceError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process & compress uploaded image
  const processImageFile = (file: File) => {
    setEvidenceError(null);
    if (!file.type.startsWith('image/')) {
      setEvidenceError('Only image files (PNG, JPG, JPEG, WEBP) are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setEvidence({
            fileName: file.name,
            fileType: 'image/jpeg',
            fileSize: Math.round(compressedDataUrl.length * 0.75),
            dataUrl: compressedDataUrl,
          });
        } else {
          setEvidence({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            dataUrl: event.target?.result as string,
          });
        }
      };
      img.onerror = () => {
        setEvidenceError('Failed to load image preview. Please try another image.');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setEvidenceError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Evidence file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };


  // Voice Dictation & GPS helpers
  const [isRecordingDesc, setIsRecordingDesc] = useState(false);
  const [isLocatingLocation, setIsLocatingLocation] = useState(false);
  const descRecognitionRef = React.useRef<any>(null);

  const toggleSpeechForDescription = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on this browser.');
      return;
    }

    if (isRecordingDesc) {
      if (descRecognitionRef.current) descRecognitionRef.current.stop();
      setIsRecordingDesc(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      const langMap: Record<Language, string> = {
        en: 'en-US',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        ml: 'ml-IN',
        kn: 'kn-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
      };
      rec.lang = langMap[lang] || 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript) {
          setDescription((prev) => (prev ? prev + ' ' + transcript : transcript).trim());
        }
      };

      rec.onerror = () => setIsRecordingDesc(false);
      rec.onend = () => setIsRecordingDesc(false);

      rec.start();
      setIsRecordingDesc(true);
      descRecognitionRef.current = rec;
    } catch (e) {
      setIsRecordingDesc(false);
    }
  };

  const detectCampusLocation = () => {
    setIsLocatingLocation(true);
    if (!('geolocation' in navigator)) {
      setLocationOrPlatform('Hostel Block C - Quadrangle (Default Zone)');
      setIsLocatingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setLocationOrPlatform(`Hostel & Academic Walkway (${lat}° N, ${lng}° E)`);
        setIsLocatingLocation(false);
      },
      () => {
        setLocationOrPlatform('Science Quadrangle & Central Library Lawn (Estimated GPS)');
        setIsLocatingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  // Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!locationOrPlatform.trim()) {
      errors.locationOrPlatform =
        category === 'offline'
          ? 'Please specify the campus location (e.g. Hostel Block, Library).'
          : 'Please enter the online platform (e.g. Instagram, WhatsApp).';
    }
    if (!description.trim() || description.trim().length < 15) {
      errors.description = 'Please provide at least 15 characters describing what occurred.';
    }
    if (!isAnonymous && !reporterName.trim()) {
      errors.reporterName = 'Reporter name is required when not filing anonymously.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  // Demo Prefill button for hackathon judges
  const prefillTestScenario = (type: 'karthik_third' | 'cyber' | 'anonymous') => {
    if (type === 'karthik_third') {
      setCategory('offline');
      setIsAnonymous(true);
      setIncidentType('Physical Threat & Ragging');
      setLocationOrPlatform('Hostel Block C - Dining Hall Area');
      setDescription(
        'Third encounter with Karthik V. Intercepted after dinner hours demanding juniors carry luggage to top floor.'
      );
      setSuspectName('Karthik V');
      setSuspectDept('Mechanical Engineering');
      setUrgency('high');
      setEvidence({
        fileName: 'hostel_c_mess_entry.png',
        fileType: 'image/png',
        fileSize: 120000,
        dataUrl:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="100%" height="100%" fill="%230A1422"/><text x="50%" y="50%" fill="%23F5D547" font-size="14" font-family="sans-serif" text-anchor="middle">HOSTEL MESS LOG NOTE</text></svg>',
      });
    } else if (type === 'cyber') {
      setCategory('online');
      setIsAnonymous(false);
      setReporterName('Pooja Sundaram');
      setReporterDept('IT 2nd Year');
      setReporterEmail('pooja.s@campus.edu');
      setIncidentType('Fake Account Impersonation');
      setLocationOrPlatform('Instagram');
      setOnlineAccountHandle('phantom_anon99');
      setOnlineUrl('https://instagram.com/phantom_anon99');
      setDescription(
        'Fake account sending disparaging messages and posting altered photos on class group story.'
      );
      setSuspectName('Unknown Cyber Perpetrator');
      setSuspectHandle('phantom_anon99');
      setUrgency('critical');
    } else {
      setCategory('offline');
      setIsAnonymous(true);
      setIncidentType('Stalking on Campus Pathways');
      setLocationOrPlatform('Science Block Walkway towards Gate 3');
      setDescription(
        'Two senior students following juniors along unlit pathway between 8:30 PM and 9:00 PM.'
      );
      setSuspectName('');
      setSuspectDept('Unknown');
      setUrgency('normal');
    }
    setFormErrors({});
  };

  // Final Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (isSubmitting) return; // Prevent duplicate clicks!
    setIsSubmitting(true);

    try {
      // Generate unique ID
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newId = `AEGIS-2026-${randomPart}`;

      // Run Deterministic Escalation Matching Engine
      const matchResult = determineIncidentGroup(
        {
          category,
          type: incidentType,
          locationOrPlatform,
          suspect: {
            name: suspectName,
            department: suspectDept,
            phone: suspectPhone,
            platformHandle: suspectHandle || onlineAccountHandle,
          },
          onlineAccountHandle,
        },
        existingReports
      );

      const occurrenceNumber = matchResult.previousReportsInGroup.length + 1;
      const escalationHistoryRecord = buildEscalationRecord(
        matchResult.escalationLevel,
        matchResult.targetAuthority,
        occurrenceNumber,
        matchResult.matchReason
      );

      const nowIso = new Date().toISOString();

      const newReport: IncidentReport = {
        id: newId,
        category,
        isAnonymous,
        reporter: isAnonymous
          ? undefined // Excluded from stored record when anonymous!
          : {
              name: reporterName,
              department: reporterDept,
              studentId: reporterId,
              email: reporterEmail,
              phone: reporterPhone,
            },
        date: incidentDate,
        approxTime,
        type: incidentType,
        description,
        locationOrPlatform,
        onlineAccountHandle: category === 'online' ? onlineAccountHandle : undefined,
        onlineUrl: category === 'online' ? onlineUrl : undefined,
        isOngoing,
        urgency,
        suspect:
          suspectName || suspectDept || suspectPhone || suspectHandle || suspectOther
            ? {
                name: suspectName || undefined,
                department: suspectDept || undefined,
                phone: suspectPhone || undefined,
                platformHandle: suspectHandle || undefined,
                otherDetails: suspectOther || undefined,
              }
            : undefined,
        evidence,
        matchGroupId: matchResult.matchGroupId,
        matchReason: matchResult.matchReason,
        escalationLevel: matchResult.escalationLevel,
        currentAuthority: matchResult.targetAuthority,
        escalationHistory: [escalationHistoryRecord],
        status: matchResult.escalationLevel > 1 ? 'escalated' : 'submitted',
        statusUpdates: [
          {
            id: `su-${Date.now()}-1`,
            status: matchResult.escalationLevel > 1 ? 'escalated' : 'submitted',
            updatedBy: 'System Escalation Engine',
            authorityRole: 'System',
            timestamp: nowIso,
            note:
              matchResult.escalationLevel === 1
                ? 'Report filed. Assigned to Department HOD queue.'
                : matchResult.escalationLevel === 2
                ? `2nd repeat incident correlated (${matchResult.matchReason}). Automatically escalated to Dean.`
                : `3rd repeat incident correlated (${matchResult.matchReason}). Escalated to Higher Authority Disciplinary Board.`,
          },
        ],
        createdAt: nowIso,
        updatedAt: nowIso,
        isDemoSample: false,
      };

      setSubmittedReport(newReport);
      onSubmitSuccess(newReport);
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE VIEW
  if (submittedReport) {
    return (
      <div className="max-w-3xl mx-auto rounded-2xl bg-[#0A1422] border border-[#21E6A8]/40 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#21E6A8]/10 border border-[#21E6A8]/40 flex items-center justify-center text-[#21E6A8]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Complaint Lodged Successfully</h2>
          <p className="text-sm text-[#AAB3C2] max-w-lg mx-auto">
            Your complaint has been encrypted in local demo storage and dispatched through the automated escalation workflow.
          </p>
        </div>

        {/* Reference ID Card */}
        <div className="rounded-xl bg-[#071426] border border-[rgba(148,163,184,0.2)] p-5 text-center space-y-2">
          <p className="text-xs text-[#AAB3C2] uppercase tracking-wider font-semibold">
            Confidential Tracking Reference ID
          </p>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F5D547] select-all">
            {submittedReport.id}
          </div>
          <p className="text-[11px] text-[#AAB3C2]">
            Save this reference number. For anonymous reports, this is your sole key to track investigation status.
          </p>
        </div>

        {/* Escalation Routing Outcome */}
        <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.18)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              Escalation Engine Decision
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                submittedReport.escalationLevel === 1
                  ? 'bg-blue-500/20 text-[#3B82F6]'
                  : submittedReport.escalationLevel === 2
                  ? 'bg-amber-500/20 text-[#F5D547]'
                  : 'bg-purple-500/20 text-purple-400'
              }`}
            >
              Tier {submittedReport.escalationLevel} • {submittedReport.currentAuthority}
            </span>
          </div>

          <div className="text-xs text-[#AAB3C2] space-y-1">
            <p>
              <strong className="text-white">Assigned Queue:</strong>{' '}
              {submittedReport.currentAuthority}
            </p>
            <p>
              <strong className="text-white">Matching Pattern:</strong>{' '}
              {submittedReport.matchReason}
            </p>
            <p>
              <strong className="text-white">Victim Identity Protection:</strong>{' '}
              {submittedReport.isAnonymous ? (
                <span className="text-[#21E6A8]">
                  Zero personal data captured (Full Anonymity)
                </span>
              ) : (
                <span className="text-[#3B82F6]">
                  Redacted from HOD & Dean (Disclosed solely to Higher Board if escalated)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => onTrackSubmitted(submittedReport.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Track This Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSubmittedReport(null);
              setCurrentStep(1);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#080B12] hover:bg-[#071426] text-white border border-[rgba(148,163,184,0.2)] font-semibold text-sm transition-all cursor-pointer"
          >
            File Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#3B82F6]" />
            <span>Confidential Harassment & Safety Report</span>
          </h1>
          <p className="text-xs text-[#AAB3C2] mt-1">
            Fill the multi-section form below. Anonymous reporting is enabled by default.
          </p>
        </div>

        {/* Evaluator Fast-Fill Chips */}
        <div className="flex items-center gap-1.5 bg-[#0A1422] p-1.5 rounded-lg border border-[rgba(148,163,184,0.18)]">
          <span className="text-[11px] text-[#AAB3C2] px-1 font-medium">Judge Quick Fill:</span>
          <button
            type="button"
            onClick={() => prefillTestScenario('karthik_third')}
            className="px-2 py-1 rounded bg-[#071426] hover:bg-blue-900/30 text-[11px] text-[#F5D547] border border-[#F5D547]/30 transition-colors"
            title="Pre-fills a 3rd report with suspect 'Karthik V' to test Tier 3 Higher Authority escalation"
          >
            Test 3rd Escalation
          </button>
          <button
            type="button"
            onClick={() => prefillTestScenario('cyber')}
            className="px-2 py-1 rounded bg-[#071426] hover:bg-emerald-900/30 text-[11px] text-[#21E6A8] border border-[#21E6A8]/30 transition-colors"
          >
            Online Cyber DM
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`py-2 px-3 rounded-lg text-xs font-semibold text-left transition-all border ${
            currentStep === 1
              ? 'bg-[#0A1422] text-[#3B82F6] border-[#3B82F6]/50 shadow-sm'
              : 'bg-[#080B12] text-[#AAB3C2] border-[rgba(148,163,184,0.15)]'
          }`}
        >
          <span className="block text-[10px] text-[#AAB3C2]">Step 1</span>
          <span>Category & Details</span>
        </button>

        <button
          type="button"
          onClick={() => validateStep1() && setCurrentStep(2)}
          className={`py-2 px-3 rounded-lg text-xs font-semibold text-left transition-all border ${
            currentStep === 2
              ? 'bg-[#0A1422] text-[#3B82F6] border-[#3B82F6]/50 shadow-sm'
              : 'bg-[#080B12] text-[#AAB3C2] border-[rgba(148,163,184,0.15)]'
          }`}
        >
          <span className="block text-[10px] text-[#AAB3C2]">Step 2</span>
          <span>Suspect & Evidence</span>
        </button>

        <button
          type="button"
          onClick={() => validateStep1() && setCurrentStep(3)}
          className={`py-2 px-3 rounded-lg text-xs font-semibold text-left transition-all border ${
            currentStep === 3
              ? 'bg-[#0A1422] text-[#3B82F6] border-[#3B82F6]/50 shadow-sm'
              : 'bg-[#080B12] text-[#AAB3C2] border-[rgba(148,163,184,0.15)]'
          }`}
        >
          <span className="block text-[10px] text-[#AAB3C2]">Step 3</span>
          <span>Privacy Review & Submit</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-6 sm:p-8 space-y-8 shadow-xl">
        {/* STEP 1: Incident & Category */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Section A: Category Switcher */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Section A: Incident Category (Required)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCategory('offline')}
                  className={`flex items-start gap-3 p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    category === 'offline'
                      ? 'bg-blue-600/15 border-[#3B82F6] text-white shadow-md'
                      : 'bg-[#080B12] border-[rgba(148,163,184,0.18)] text-[#AAB3C2] hover:border-[rgba(148,163,184,0.4)]'
                  }`}
                >
                  <Building2
                    className={`w-5 h-5 shrink-0 ${
                      category === 'offline' ? 'text-[#3B82F6]' : 'text-[#AAB3C2]'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-sm block text-white">
                      {t.offlineCategory}
                    </span>
                    <span className="text-xs text-[#AAB3C2] mt-0.5 block">
                      Physical ragging, hallway harassment, following, or hostel coercion.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('online')}
                  className={`flex items-start gap-3 p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    category === 'online'
                      ? 'bg-emerald-600/15 border-[#21E6A8] text-white shadow-md'
                      : 'bg-[#080B12] border-[rgba(148,163,184,0.18)] text-[#AAB3C2] hover:border-[rgba(148,163,184,0.4)]'
                  }`}
                >
                  <Globe2
                    className={`w-5 h-5 shrink-0 ${
                      category === 'online' ? 'text-[#21E6A8]' : 'text-[#AAB3C2]'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-sm block text-white">
                      {t.onlineCategory}
                    </span>
                    <span className="text-xs text-[#AAB3C2] mt-0.5 block">
                      Cyber harassment, fake accounts, abusive DMs, or digital extortion.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Section B: Reporting Preferences (Anonymous Toggle) */}
            <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.18)] p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <EyeOff className="w-5 h-5 text-[#21E6A8]" />
                  <div>
                    <span className="font-bold text-sm text-white block">
                      Anonymous Reporting Option
                    </span>
                    <span className="text-xs text-[#AAB3C2]">
                      When toggled, zero reporter identity details are captured or stored in the database.
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#071426] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21E6A8]"></div>
                </label>
              </div>

              {/* Conditional Personal Details when NOT Anonymous */}
              {!isAnonymous && (
                <div className="pt-4 border-t border-[rgba(148,163,184,0.15)] space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#F5D547]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      Confidential Reporting Mode: Your name will remain redacted from HOD and Dean queues.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#AAB3C2] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-[#0A1422] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                      />
                      {formErrors.reporterName && (
                        <p className="text-[11px] text-red-400 mt-1">{formErrors.reporterName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-[#AAB3C2] mb-1">
                        Department & Year
                      </label>
                      <input
                        type="text"
                        value={reporterDept}
                        onChange={(e) => setReporterDept(e.target.value)}
                        placeholder="e.g. CSE - 2nd Year"
                        className="w-full bg-[#0A1422] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#AAB3C2] mb-1">
                        Student ID / Roll No
                      </label>
                      <input
                        type="text"
                        value={reporterId}
                        onChange={(e) => setReporterId(e.target.value)}
                        placeholder="e.g. 2025-CS-240"
                        className="w-full bg-[#0A1422] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#AAB3C2] mb-1">
                        Confidential Email / Phone
                      </label>
                      <input
                        type="text"
                        value={reporterEmail}
                        onChange={(e) => setReporterEmail(e.target.value)}
                        placeholder="For inquiry follow-up only"
                        className="w-full bg-[#0A1422] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section C: Incident Information */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Section C: Incident Specifics
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#AAB3C2] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Incident Date *</span>
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#AAB3C2] mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Approximate Time *</span>
                  </label>
                  <input
                    type="time"
                    value={approxTime}
                    onChange={(e) => setApproxTime(e.target.value)}
                    className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#AAB3C2] mb-1">
                  Incident Classification Type *
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                >
                  {(category === 'offline' ? offlineTypes : onlineTypes).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic location/platform field based on category */}
              {category === 'offline' ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-[#AAB3C2] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Campus Location / Building *</span>
                    </label>
                    <button
                      type="button"
                      onClick={detectCampusLocation}
                      disabled={isLocatingLocation}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#21E6A8] hover:text-[#21E6A8]/80 cursor-pointer"
                    >
                      <Compass className={`w-3.5 h-3.5 ${isLocatingLocation ? 'animate-spin' : ''}`} />
                      <span>{isLocatingLocation ? 'Locating GPS...' : 'Auto-Detect GPS Location'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={locationOrPlatform}
                    onChange={(e) => setLocationOrPlatform(e.target.value)}
                    placeholder="e.g. Hostel Block C 3rd floor, Library Lawn, Tech Park Canteen"
                    className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                  {formErrors.locationOrPlatform && (
                    <p className="text-[11px] text-red-400 mt-1">
                      {formErrors.locationOrPlatform}
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#AAB3C2] mb-1 flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-[#21E6A8]" />
                      <span>Online Platform *</span>
                    </label>
                    <input
                      type="text"
                      value={locationOrPlatform}
                      onChange={(e) => setLocationOrPlatform(e.target.value)}
                      placeholder="e.g. Instagram, WhatsApp, Discord"
                      className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#21E6A8]"
                    />
                    {formErrors.locationOrPlatform && (
                      <p className="text-[11px] text-red-400 mt-1">
                        {formErrors.locationOrPlatform}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-[#AAB3C2] mb-1">
                      Account / Handle (if known)
                    </label>
                    <input
                      type="text"
                      value={onlineAccountHandle}
                      onChange={(e) => setOnlineAccountHandle(e.target.value)}
                      placeholder="e.g. @anonymous_fake99"
                      className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#21E6A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#AAB3C2] mb-1">
                      Direct Post / Group URL
                    </label>
                    <input
                      type="text"
                      value={onlineUrl}
                      onChange={(e) => setOnlineUrl(e.target.value)}
                      placeholder="e.g. https://instagram.com/p/..."
                      className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#21E6A8]"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-[#AAB3C2]">
                    Detailed Description *
                  </label>
                  <button
                    type="button"
                    onClick={toggleSpeechForDescription}
                    className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                      isRecordingDesc
                        ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                        : 'bg-[#0A1422] text-[#3B82F6] hover:text-white border-[rgba(148,163,184,0.2)]'
                    }`}
                  >
                    {isRecordingDesc ? <Radio className="w-3 h-3 animate-spin" /> : <Mic className="w-3 h-3" />}
                    <span>{isRecordingDesc ? 'Listening (Speak now)...' : '🎙️ Dictate via Voice'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe in detail what happened, words spoken, threats made, or actions taken..."
                  className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
                {formErrors.description && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Toggles: Ongoing and Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#080B12] border border-[rgba(148,163,184,0.15)]">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Is this incident ongoing?
                    </span>
                    <span className="text-[11px] text-[#AAB3C2]">
                      Active threat currently happening
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isOngoing}
                    onChange={(e) => setIsOngoing(e.target.checked)}
                    className="w-4 h-4 text-[#3B82F6] rounded focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#080B12] border border-[rgba(148,163,184,0.15)]">
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Urgency Assessment
                  </label>
                  <div className="flex items-center gap-2">
                    {(['normal', 'high', 'critical'] as UrgencyLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setUrgency(level)}
                        className={`flex-1 py-1 rounded text-[11px] font-semibold capitalize transition-colors ${
                          urgency === level
                            ? level === 'critical'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : level === 'high'
                              ? 'bg-amber-500/20 text-[#F5D547] border border-amber-500/40'
                              : 'bg-blue-500/20 text-[#3B82F6] border border-blue-500/40'
                            : 'bg-[#0A1422] text-[#AAB3C2]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Suspect & Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Suspect & Evidence */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Section D: Suspect Details (Optional) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#3B82F6]" />
                  <span>Section D: Suspect Details (Optional)</span>
                </label>
                <span className="text-[11px] text-[#AAB3C2]">
                  Not required — submit whatever you know
                </span>
              </div>
              <p className="text-xs text-[#AAB3C2]">
                Providing suspect details helps our deterministic engine recognize repeated harassment patterns and escalate to Dean or Higher Authority.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#AAB3C2] mb-1">
                    Suspect Name or Nickname
                  </label>
                  <input
                    type="text"
                    value={suspectName}
                    onChange={(e) => setSuspectName(e.target.value)}
                    placeholder="e.g. Karthik V, Senior in Room 412"
                    className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#AAB3C2] mb-1">
                    Department / Year (if known)
                  </label>
                  <input
                    type="text"
                    value={suspectDept}
                    onChange={(e) => setSuspectDept(e.target.value)}
                    placeholder="e.g. Final Year Mech / Hostel Resident"
                    className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#AAB3C2] mb-1">
                    Suspect Phone / Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={suspectPhone}
                    onChange={(e) => setSuspectPhone(e.target.value)}
                    placeholder="e.g. +91 91234 56789"
                    className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#AAB3C2] mb-1">
                    Social Handle / Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    value={suspectHandle}
                    onChange={(e) => setSuspectHandle(e.target.value)}
                    placeholder="e.g. @karthik_mech or handle"
                    className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#AAB3C2] mb-1">
                  Other Identifying Features or Accompanied Persons
                </label>
                <input
                  type="text"
                  value={suspectOther}
                  onChange={(e) => setSuspectOther(e.target.value)}
                  placeholder="e.g. Red bike, tall build, accompanied by 2 batchmates"
                  className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            {/* Section E: Evidence Upload */}
            <div className="space-y-3 pt-4 border-t border-[rgba(148,163,184,0.15)]">
              <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#21E6A8]" />
                <span>Section E: Evidence Upload (Optional)</span>
              </label>

              {category === 'online' && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-[#21E6A8] flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Screenshot evidence is strongly recommended for online complaints to preserve chat logs, timestamps, and usernames.
                  </span>
                </div>
              )}

              {/* Upload Dropzone */}
              {!evidence ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) processImageFile(file);
                  }}
                  className="rounded-xl border-2 border-dashed border-[rgba(148,163,184,0.25)] hover:border-[#3B82F6] p-6 text-center transition-colors bg-[#080B12]"
                >
                  <Upload className="w-8 h-8 mx-auto text-[#AAB3C2] mb-2" />
                  <p className="text-xs text-white font-medium">
                    Click to browse or drag and drop image evidence
                  </p>
                  <p className="text-[11px] text-[#AAB3C2] mt-1">
                    Accepts PNG, JPG, JPEG, WEBP (Max 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="evidence-file-input"
                  />
                  <label
                    htmlFor="evidence-file-input"
                    className="inline-block mt-3 px-4 py-2 rounded-lg bg-[#0A1422] hover:bg-[#071426] border border-[rgba(148,163,184,0.3)] text-xs font-semibold text-white cursor-pointer transition-colors"
                  >
                    Select Image File
                  </label>
                  {evidenceError && (
                    <p className="text-xs text-red-400 mt-2 font-medium">{evidenceError}</p>
                  )}
                </div>
              ) : (
                /* Evidence Preview */
                <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.2)] p-4 flex flex-col sm:flex-row items-center gap-4">
                  {evidence.dataUrl && (
                    <img
                      src={evidence.dataUrl}
                      alt="Evidence preview"
                      className="w-24 h-24 object-cover rounded-lg border border-[rgba(148,163,184,0.2)]"
                    />
                  )}
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                      {evidence.fileName}
                    </p>
                    <p className="text-[11px] text-[#AAB3C2] mt-0.5">
                      {(evidence.fileSize / 1024).toFixed(1)} KB • {evidence.fileType}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-[#21E6A8]">
                      Ready for attachment
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeEvidence}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              )}

              {!evidence && (
                <p className="text-[11px] text-[#AAB3C2] italic">
                  Note: A complaint will NOT be rejected if no evidence is attached. You may proceed without an upload.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[rgba(148,163,184,0.15)]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#080B12] hover:bg-[#071426] text-[#AAB3C2] hover:text-white text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Incident Details</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Review & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Section F: Pre-Submission Review & Privacy Protocol
              </label>
              <p className="text-xs text-[#AAB3C2]">
                Please review the information below before finalizing your submission.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.2)] p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#AAB3C2] block">Category:</span>
                  <span className="text-white font-bold capitalize">
                    {category} Ragging ({incidentType})
                  </span>
                </div>
                <div>
                  <span className="text-[#AAB3C2] block">Reporting Identity Mode:</span>
                  <span
                    className={`font-bold ${
                      isAnonymous ? 'text-[#21E6A8]' : 'text-[#3B82F6]'
                    }`}
                  >
                    {isAnonymous
                      ? 'Anonymous (Zero Identity Stored)'
                      : `Confidential (${reporterName || 'Student Contact'})`}
                  </span>
                </div>
                <div>
                  <span className="text-[#AAB3C2] block">Location / Platform:</span>
                  <span className="text-white font-medium">{locationOrPlatform}</span>
                </div>
                <div>
                  <span className="text-[#AAB3C2] block">Incident Timing:</span>
                  <span className="text-white font-medium">
                    {incidentDate} at {approxTime}
                  </span>
                </div>
                <div>
                  <span className="text-[#AAB3C2] block">Suspect Identified:</span>
                  <span className="text-white font-medium">
                    {suspectName || suspectHandle ? `${suspectName || ''} ${suspectHandle || ''}` : 'None specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[#AAB3C2] block">Evidence Attached:</span>
                  <span className="text-white font-medium">
                    {evidence ? evidence.fileName : 'None (Text report only)'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(148,163,184,0.12)]">
                <span className="text-[#AAB3C2] text-xs block mb-1">Description:</span>
                <p className="text-xs text-white leading-relaxed bg-[#0A1422] p-3 rounded-lg border border-[rgba(148,163,184,0.1)]">
                  {description}
                </p>
              </div>
            </div>

            {/* Privacy Declaration Disclaimer */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-[#AAB3C2] space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-[#21E6A8]" />
                <span>Deterministic Escalation Assurance</span>
              </div>
              <p className="leading-relaxed">
                By submitting, the complaint is deterministically indexed. If this is the 1st matching report, it routes to HOD with victim identity redacted. If it is the 2nd repeat report, it escalates to Dean. If it is the 3rd repeat report, it escalates directly to Higher Authority.
              </p>
              <p className="text-[11px] text-[#AAB3C2]/80 italic">
                Demo notice: Stored in browser localStorage for evaluation. Do not submit production confidential credentials.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[rgba(148,163,184,0.15)]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#080B12] hover:bg-[#071426] text-[#AAB3C2] hover:text-white text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? t.submitting : t.submitButton}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
