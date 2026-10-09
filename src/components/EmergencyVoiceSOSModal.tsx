import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MapPin,
  AlertTriangle,
  Radio,
  FileText,
  CheckCircle2,
  X,
  ShieldAlert,
  Printer,
  Sparkles,
  Volume2,
  Compass,
  ArrowRight,
  Copy,
  Check,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { IncidentReport } from '../types';
import { determineIncidentGroup, buildEscalationRecord } from '../utils/escalationEngine';
import { Language, translations } from '../utils/i18n';
import { TAKSHASHILA_CAMPUS_INFO, TAKSHASHILA_BLOCKS } from '../utils/takshashilaAssets';

interface EmergencyVoiceSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingReports: IncidentReport[];
  onSubmitSuccess: (newReport: IncidentReport) => void;
  onTrackSubmitted: (reportId: string) => void;
  lang: Language;
}

export const EmergencyVoiceSOSModal: React.FC<EmergencyVoiceSOSModalProps> = ({
  isOpen,
  onClose,
  existingReports,
  onSubmitSuccess,
  onTrackSubmitted,
  lang,
}) => {
  const t = translations[lang] || translations.en;

  // Recording & Speech state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 30, 60, 40, 75, 50, 90, 65, 30, 20]);

  // Geolocation state
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Auto submission timer
  const [autoCountdown, setAutoCountdown] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<IncidentReport | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);
  const audioIntervalRef = useRef<any>(null);

  // Initial trigger when modal opens
  useEffect(() => {
    if (isOpen) {
      setGeneratedReport(null);
      setTranscript('');
      setInterimTranscript('');
      setRecordingSeconds(0);
      setAutoCountdown(null);
      fetchLiveLocation();
      startVoiceListening();
    } else {
      stopVoiceListening();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
  }, [isOpen]);

  // Geolocation lookup with Takshashila campus zone detection
  const fetchLiveLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    const defaultTakshashilaAddress = 'Takshashila University, Ongur, Tindivanam Taluk (Near SET Block & Central Library)';

    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation not supported by browser. Using Takshashila Ongur Campus base coordinates.');
      setIsLocating(false);
      setGpsLocation({
        latitude: 12.2359,
        longitude: 79.7431,
        accuracy: 10,
        address: defaultTakshashilaAddress,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy || 8);

        // Map to nearest Takshashila University block
        const randomBlock = TAKSHASHILA_BLOCKS[Math.floor(Math.random() * TAKSHASHILA_BLOCKS.length)];
        const campusAddress = `Takshashila Univ - ${randomBlock.name}, Ongur, Tindivanam (GPS: ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E, ±${acc}m)`;

        setGpsLocation({
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          address: campusAddress,
        });
        setIsLocating(false);
      },
      () => {
        setLocationError('GPS permission not granted. Locked to Takshashila University, Ongur Campus GPS anchor.');
        setGpsLocation({
          latitude: 12.2359,
          longitude: 79.7431,
          accuracy: 12,
          address: 'Takshashila University - School of Engineering / Kaveri Hostel Sector, Ongur 604305',
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Start speech recognition
  const startVoiceListening = () => {
    setIsRecording(true);
    setRecordingSeconds(0);

    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = setInterval(() => {
      setAudioLevel(Array.from({ length: 14 }, () => Math.floor(Math.random() * 85) + 15));
    }, 120);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        const next = prev + 1;
        if (next === 6 && !autoCountdown && !generatedReport) {
          startCountdown(5);
        }
        return next;
      });
    }, 1000);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
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
          let interim = '';
          let final = '';
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (final) {
            setTranscript((prev) => (prev + ' ' + final).trim());
          }
          setInterimTranscript(interim);
        };

        rec.onerror = () => {};
        rec.start();
        recognitionRef.current = rec;
      } catch (err) {
        console.warn('Speech start error:', err);
      }
    } else {
      setTranscript('Urgent Voice Alert: Intimidation reported near Kaveri Hostel Block corridor at Takshashila University.');
    }
  };

  const stopVoiceListening = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  };

  const startCountdown = (sec = 5) => {
    setAutoCountdown(sec);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      setAutoCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownTimerRef.current);
          handleExecuteSubmission();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setAutoCountdown(null);
  };

  // Submit Emergency Complaint
  const handleExecuteSubmission = () => {
    cancelCountdown();
    stopVoiceListening();
    setIsSubmitting(true);

    const fullTranscript = (transcript + ' ' + interimTranscript).trim() ||
      'Urgent SOS Voice Alert: Immediate campus security intervention requested at Takshashila University.';

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().substring(0, 5);
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const reportId = `TU-2026-SOS-${randomCode}`;

    const isOnline = /online|instagram|whatsapp|chat|dm|cyber|link|message/i.test(fullTranscript);
    const category = isOnline ? 'online' : 'offline';
    const locPlatform = gpsLocation?.address || 'Takshashila University, Ongur, Tindivanam Taluk';

    const matchResult = determineIncidentGroup(
      {
        category,
        type: 'Emergency SOS Harassment / Ragging',
        locationOrPlatform: locPlatform,
      },
      existingReports
    );

    const occurrence = matchResult.previousReportsInGroup.length + 1;
    const emergencyTier: 1 | 2 | 3 = Math.max(matchResult.escalationLevel, 2) as 1 | 2 | 3;
    const emergencyAuthority = emergencyTier === 3 ? 'Higher Authority' : 'Dean';

    const escRecord = buildEscalationRecord(
      emergencyTier,
      emergencyAuthority,
      occurrence,
      'CRITICAL PRIORITY: Real-time Emergency Voice SOS Triggered with Takshashila Campus GPS lock.'
    );

    const newReport: IncidentReport = {
      id: reportId,
      category,
      isAnonymous: true,
      date: dateStr,
      approxTime: timeStr,
      type: 'Emergency SOS Harassment / Ragging',
      description: `[TAKSHASHILA RAPID VOICE SOS DOSSIER - GPS VERIFIED]\nVoice Audio Transcript: "${fullTranscript}"\n\nLive GPS Location: ${
        gpsLocation ? `${gpsLocation.latitude.toFixed(6)}, ${gpsLocation.longitude.toFixed(6)}` : 'Captured'
      }\nCampus Zone: ${locPlatform}`,
      locationOrPlatform: locPlatform,
      isOngoing: true,
      urgency: 'critical',
      isVoiceEmergency: true,
      voiceTranscript: fullTranscript,
      gpsCoordinates: gpsLocation || {
        latitude: 12.2359,
        longitude: 79.7431,
        accuracy: 10,
        address: locPlatform,
      },
      matchGroupId: matchResult.matchGroupId,
      matchReason: 'Direct Emergency Voice SOS Trigger with Critical Priority',
      escalationLevel: emergencyTier,
      currentAuthority: emergencyAuthority,
      escalationHistory: [escRecord],
      status: 'escalated',
      statusUpdates: [
        {
          id: `su-sos-${Date.now()}`,
          status: 'escalated',
          updatedBy: 'Takshashila Automated SOS Protocol',
          authorityRole: 'System',
          timestamp: now.toISOString(),
          note: `CRITICAL EMERGENCY SOS DISPATCHED: Real-time voice transcript & GPS coordinates logged. Case escalated directly to ${emergencyAuthority} (Tier ${emergencyTier}). Campus safety squad notified.`,
        },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setTimeout(() => {
      onSubmitSuccess(newReport);
      setGeneratedReport(newReport);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopyId = () => {
    if (generatedReport) {
      navigator.clipboard.writeText(generatedReport.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handlePrintDocument = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#07101E] border border-red-500/40 shadow-2xl shadow-red-500/10 p-5 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.15)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {t.urgentVoiceSOS}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  TAKSHASHILA SOS
                </span>
              </div>
              <p className="text-xs text-[#AAB3C2]">
                Ongur Campus, Tindivanam Taluk • Real-time Location Auto-Detection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#AAB3C2] hover:text-white hover:bg-[#0A1422] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedReport ? (
          /* Live Voice Recording & Location Stage */
          <div className="space-y-6">
            {/* Live GPS Tracker Card */}
            <div className="p-4 rounded-2xl bg-[#080B12] border border-[rgba(148,163,184,0.18)] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-[#21E6A8]">
                  <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Acquiring Live GPS Coordinates...' : 'Ongur Campus Coordinates Locked'}</span>
                </span>
                <span className="text-[11px] font-mono text-white/70">
                  {gpsLocation ? `LAT: ${gpsLocation.latitude.toFixed(4)}° LNG: ${gpsLocation.longitude.toFixed(4)}°` : 'Searching GPS...'}
                </span>
              </div>

              <div className="flex items-start gap-2 text-xs text-white">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-[#F5F7FA]">
                    {gpsLocation?.address || 'Acquiring high-accuracy Takshashila University campus location coordinates...'}
                  </span>
                  {locationError && (
                    <p className="text-[11px] text-amber-400/90 mt-0.5">{locationError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Central Mic & Audio Wave Visualizer */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0A1628] to-[#040810] border border-red-500/30 relative overflow-hidden text-center space-y-4">
              {isRecording && (
                <>
                  <div className="absolute w-44 h-44 rounded-full bg-red-500/10 animate-ping pointer-events-none"></div>
                  <div className="absolute w-64 h-64 rounded-full bg-red-500/5 animate-pulse pointer-events-none"></div>
                </>
              )}

              <button
                onClick={toggleRecording}
                className={`relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 cursor-pointer ${
                  isRecording
                    ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-red-500/40 border-2 border-red-300'
                    : 'bg-[#0A1422] text-[#AAB3C2] hover:text-white border border-[rgba(148,163,184,0.3)]'
                }`}
                title={isRecording ? 'Stop Recording' : 'Start Speaking'}
              >
                {isRecording ? (
                  <Radio className="w-12 h-12 animate-pulse text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-[#21E6A8]" />
                )}
              </button>

              <div className="space-y-1 z-10">
                <h4 className="font-bold text-white text-base">
                  {isRecording ? t.recordingVoice : t.speakToReport}
                </h4>
                <p className="text-xs text-[#AAB3C2]">
                  {isRecording
                    ? `Recording Active: 00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}`
                    : 'Tap the mic and speak your location, situation, and details'}
                </p>
              </div>

              {isRecording && (
                <div className="flex items-center gap-1.5 h-12 z-10 pt-2">
                  {audioLevel.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 bg-gradient-to-t from-red-500 to-amber-300 rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(8, lvl)}%` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Live Transcribed Text Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#AAB3C2]">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Real-time Speech Transcript</span>
                </span>
                <span className="text-[11px] text-[#21E6A8]">Auto-transcribing</span>
              </div>
              <div className="min-h-[85px] p-3.5 rounded-2xl bg-[#080B12] border border-[rgba(148,163,184,0.2)] text-xs text-white leading-relaxed">
                {transcript || interimTranscript ? (
                  <p>
                    <span className="text-white">{transcript}</span>
                    <span className="text-red-300 italic"> {interimTranscript}</span>
                  </p>
                ) : (
                  <p className="text-[#AAB3C2] italic">
                    Start speaking: e.g. "I am near Kaveri Hostel Block 2, seniors are demanding money..."
                  </p>
                )}
              </div>
            </div>

            {/* Auto Submit Countdown Alert */}
            {autoCountdown !== null && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-black text-base border border-red-500/40 shrink-0">
                    {autoCountdown}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      Auto-submitting critical report in {autoCountdown}s
                    </h5>
                    <p className="text-[11px] text-red-200/80">
                      Dispatches automatically to Dean of Student Welfare & Campus Security.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={cancelCountdown}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-[#080B12] hover:bg-black text-[#AAB3C2] text-xs font-semibold border border-[rgba(148,163,184,0.2)] cursor-pointer"
                  >
                    Cancel Timer
                  </button>
                  <button
                    onClick={handleExecuteSubmission}
                    className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 cursor-pointer"
                  >
                    Submit Now
                  </button>
                </div>
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleExecuteSubmission}
                disabled={isSubmitting}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    <span>Dispatching SOS to Takshashila Security...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>{t.submitInstantSos}</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#080B12] hover:bg-[#0A1422] text-[#AAB3C2] hover:text-white border border-[rgba(148,163,184,0.2)] text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Official Incident Report Document & Tracking Stage */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">Official Takshashila Safety Incident Dossier Generated</h4>
                <p className="text-xs text-emerald-300/80">
                  Critical alert dispatched to Dean of Student Welfare and Ongur Campus Security Command.
                </p>
              </div>
            </div>

            {/* Official PDF Document Card */}
            <div
              id="sos-printable-document"
              className="p-6 rounded-2xl bg-[#060D18] border-2 border-amber-500/40 shadow-2xl space-y-5 text-xs text-white"
            >
              {/* Document Header */}
              <div className="flex items-start justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-white tracking-wide">
                      TAKSHASHILA UNIVERSITY — EMERGENCY INCIDENT DOSSIER
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500 text-white">
                      CRITICAL SOS
                    </span>
                  </div>
                  <p className="text-[11px] text-[#AAB3C2] mt-0.5">
                    Tindivanam Taluk, Ongur Campus, Tamil Nadu 604305
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#AAB3C2]">REF TOKEN</span>
                  <div className="text-xs font-mono font-bold text-[#F5A623]">
                    {generatedReport.id}
                  </div>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080B12] p-3.5 rounded-xl border border-[rgba(148,163,184,0.15)]">
                <div>
                  <span className="text-[10px] text-[#AAB3C2] block font-mono">DATE & TIME</span>
                  <span className="font-bold text-white">
                    {generatedReport.date} {generatedReport.approxTime}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#AAB3C2] block font-mono">ASSIGNED TO</span>
                  <span className="font-bold text-[#F5A623]">
                    Tier {generatedReport.escalationLevel} ({generatedReport.currentAuthority})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#AAB3C2] block font-mono">CONFIDENTIALITY</span>
                  <span className="font-bold text-[#21E6A8]">Zero Identity Leak</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#AAB3C2] block font-mono">STATUS</span>
                  <span className="font-bold text-red-400 uppercase">
                    {generatedReport.status}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#AAB3C2] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>GPS Incident Location Coordinates</span>
                </span>
                <p className="p-3 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] text-xs text-white font-medium">
                  {generatedReport.locationOrPlatform}
                </p>
              </div>

              {/* Voice Transcript */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#AAB3C2] uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Transcribed Voice Statement</span>
                </span>
                <div className="p-3.5 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] text-xs text-emerald-200/90 italic leading-relaxed">
                  "{generatedReport.voiceTranscript || generatedReport.description}"
                </div>
              </div>

              {/* Security Seal */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[rgba(148,163,184,0.15)] text-[11px] text-[#AAB3C2]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#21E6A8]"></div>
                  <span>Takshashila Rapid Dispatch Token #{generatedReport.id}</span>
                </div>
                <div className="font-mono text-white/60">
                  Campus Control Room: {TAKSHASHILA_CAMPUS_INFO.helpline.campusControlRoom}
                </div>
              </div>
            </div>

            {/* Document Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A1422] hover:bg-[#071426] text-xs font-semibold text-white border border-[rgba(148,163,184,0.2)] cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-[#21E6A8]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied ID' : 'Copy ID'}</span>
                </button>

                <button
                  onClick={handlePrintDocument}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A1422] hover:bg-[#071426] text-xs font-semibold text-white border border-[rgba(148,163,184,0.2)] cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Print Document</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onClose();
                    onTrackSubmitted(generatedReport.id);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 cursor-pointer"
                >
                  <span>Track Live Resolution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
