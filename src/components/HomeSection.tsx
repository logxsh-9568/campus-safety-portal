import React from 'react';
import {
  ShieldAlert,
  FileText,
  Search,
  Lock,
  EyeOff,
  UserCheck,
  ChevronRight,
  Globe2,
  Building2,
  Scale,
  Sparkles,
  ArrowRight,
  Radio,
  MapPin,
  Mic,
  Compass,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Award,
  Clock,
} from 'lucide-react';
import { IncidentReport, UserRole } from '../types';
import { Language, translations } from '../utils/i18n';
import { TAKSHASHILA_CAMPUS_INFO, TAKSHASHILA_BLOCKS } from '../utils/takshashilaAssets';
import { TakshashilaEmblemIcon } from './TakshashilaLogo';

interface HomeSectionProps {
  onStartReport: (category?: 'offline' | 'online') => void;
  onTrackReport: (prefillId?: string) => void;
  onExploreEscalation: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenVoiceSOS: () => void;
  reports: IncidentReport[];
  lang: Language;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onStartReport,
  onTrackReport,
  onExploreEscalation,
  onSwitchRole,
  onOpenVoiceSOS,
  reports,
  lang,
}) => {
  const t = translations[lang] || translations.en;

  // Dynamic metrics
  const totalReports = reports.length;
  const underReviewCount = reports.filter((r) => r.status === 'under_review').length;
  const escalatedCount = reports.filter((r) => r.escalationLevel > 1 || r.status === 'escalated').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const offlineCount = reports.filter((r) => r.category === 'offline').length;
  const onlineCount = reports.filter((r) => r.category === 'online').length;

  return (
    <div className="space-y-12 pb-20">
      {/* High-Impact Institutional Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0B152B] via-[#070D1E] to-[#040814] border border-[rgba(245,166,35,0.2)] p-6 sm:p-12 shadow-2xl shadow-black/80">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#E25822]/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Institutional Badge Lockup */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0A162C]/90 text-[#F5A623] border border-[#F5A623]/35 shadow-inner backdrop-blur-md">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 border border-[#E25822]">
              <TakshashilaEmblemIcon size={14} />
            </div>
            <span>Takshashila University • Ongur Campus, Tindivanam Taluk 604305</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Confidential Campus Safety &{' '}
            <span className="bg-gradient-to-r from-[#E25822] via-[#F5A623] to-[#3B82F6] bg-clip-text text-transparent">
              Anti-Ragging Portal
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-normal">
            Safeguarding every student across our 150-acre Ongur campus. Report offline physical intimidation or online cyber harassment with complete identity shielding.
            Our deterministic system coordinates escalation from <strong className="text-white">Department HOD</strong> to{' '}
            <strong className="text-white">Dean of Student Welfare</strong> to{' '}
            <strong className="text-white">Higher Disciplinary Board</strong> without revealing student names to lower queues.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <button
              onClick={() => onStartReport()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t.reportIncident}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenVoiceSOS}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-[#E25822] hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-red-600/35 border border-red-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-pulse"
            >
              <Radio className="w-4 h-4 animate-spin" />
              <span>{t.urgentVoiceSOS}</span>
            </button>

            <button
              onClick={() => onTrackReport()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0A162C]/80 hover:bg-[#0E1F3D] text-[#F1F5F9] border border-[rgba(148,163,184,0.25)] hover:border-[#3B82F6]/60 font-bold text-sm transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#3B82F6]" />
              <span>{t.trackReport}</span>
            </button>
          </div>

          {/* Privacy Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0A1428]/80 border border-[rgba(148,163,184,0.15)] shadow-sm">
              <EyeOff className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[#F1F5F9] font-medium">100% Anonymous Option</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0A1428]/80 border border-[rgba(148,163,184,0.15)] shadow-sm">
              <Lock className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="text-[#F1F5F9] font-medium">Identity Redacted in HOD & Dean Portals</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0A1428]/80 border border-[rgba(148,163,184,0.15)] shadow-sm">
              <UserCheck className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="text-[#F1F5F9] font-medium">Deterministic Tier Escalation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Rapid Voice SOS Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-red-950/50 via-[#0A1428] to-amber-950/40 border border-red-500/35 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase">
                Immediate Danger on Campus? • Rapid SOS Protocol
              </span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-white">
              Instant Voice SOS with Real-Time Ongur Campus Geolocation Lock
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Press the Voice SOS trigger in threatening situations. The portal immediately secures your <strong>live GPS campus coordinates</strong>, transcribes your voice in real time, and auto-dispatches an official incident dossier directly to the Dean of Student Welfare & Campus Security Squad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={onOpenVoiceSOS}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-xl shadow-red-600/35 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Launch Voice SOS Now</span>
            </button>
            <a
              href="tel:09297623456"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#081022] hover:bg-[#0D1830] text-[#F5A623] border border-amber-500/30 text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 092976 23456</span>
            </a>
          </div>
        </div>
      </section>

      {/* Two Incident Stream Classifications */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
            Choose Incident Classification
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Select the reporting stream tailored to campus physical zones or digital social harassment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Stream 1: Offline Ragging */}
          <div
            onClick={() => onStartReport('offline')}
            className="group relative rounded-3xl bg-gradient-to-b from-[#0A1428] to-[#060D1E] hover:from-[#0D1A33] hover:to-[#081124] border border-[rgba(148,163,184,0.18)] hover:border-[#3B82F6]/60 p-6 sm:p-7 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-blue-500/10"
          >
            <div className="flex items-start justify-between">
              <div className="w-13 h-13 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#3B82F6] group-hover:scale-105 transition-transform shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-blue-500/10 text-[#3B82F6] border border-blue-500/20">
                {offlineCount} Sample Cases
              </span>
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors flex items-center gap-2">
              {t.offlineCategory}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed">
              Physical intimidation, stalking, hostile threats, Kaveri/Vaigai/Thamirabarani hostel harassment, or corridor bullying across university grounds.
            </p>
            <div className="mt-5 pt-4 border-t border-[rgba(148,163,184,0.1)] flex items-center justify-between text-xs">
              <span className="text-[#F1F5F9] font-semibold">Incident Fields:</span>
              <span className="text-[#94A3B8]">Campus Block, Approximate Time, Suspect Details, Photo Evidence</span>
            </div>
          </div>

          {/* Stream 2: Online Ragging */}
          <div
            onClick={() => onStartReport('online')}
            className="group relative rounded-3xl bg-gradient-to-b from-[#0A1428] to-[#060D1E] hover:from-[#0D1A33] hover:to-[#081124] border border-[rgba(148,163,184,0.18)] hover:border-[#10B981]/60 p-6 sm:p-7 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="flex items-start justify-between">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#10B981] group-hover:scale-105 transition-transform shadow-md">
                <Globe2 className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-[#10B981] border border-emerald-500/20">
                {onlineCount} Sample Cases
              </span>
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-[#10B981] transition-colors flex items-center gap-2">
              {t.onlineCategory}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed">
              Cyber bullying, impersonation profiles, abusive group DMs, offensive media, digital coercion, and social media intimidation.
            </p>
            <div className="mt-5 pt-4 border-t border-[rgba(148,163,184,0.1)] flex items-center justify-between text-xs">
              <span className="text-[#F1F5F9] font-semibold">Incident Fields:</span>
              <span className="text-[#10B981] font-semibold">Screenshot Uploads, Profile URLs, Handles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campus Surroundings & Infrastructure Showcase */}
      <section className="rounded-3xl bg-[#070E1E] border border-[rgba(148,163,184,0.18)] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E25822]/15 text-[#F5A623] border border-[#E25822]/30">
                150-ACRE CAMPUS SURROUNDINGS
              </span>
              <h2 className="font-heading text-lg font-bold text-white">
                Takshashila University Schools & Protected Zones
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Active CCTV surveillance hubs and rapid emergency call kiosks across all Ongur campus zones
            </p>
          </div>

          <a
            href={TAKSHASHILA_CAMPUS_INFO.gpsCoordinates.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#F5A623] hover:underline font-bold"
          >
            <span>Google Maps Satellite View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TAKSHASHILA_BLOCKS.slice(0, 4).map((b) => (
            <div
              key={b.id}
              className="group rounded-2xl bg-[#0A1428] border border-[rgba(148,163,184,0.15)] hover:border-[#F5A623]/40 overflow-hidden flex flex-col justify-between transition-all duration-200"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/50">
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1428] via-transparent to-black/30"></div>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#030712]/90 text-[#F5A623] border border-[#F5A623]/40">
                  {b.code}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="font-heading text-xs font-bold text-white line-clamp-1">{b.name}</h4>
                <p className="text-[10px] text-[#94A3B8] line-clamp-1">{b.locationDetails}</p>
                <div className="pt-2 text-[10px] text-[#10B981] font-semibold flex items-center justify-between border-t border-[rgba(148,163,184,0.1)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{b.cctvCount} CCTV Nodes</span>
                  </span>
                  <span className="text-[#F5A623]">{b.safetyRating.split('-')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Tier Escalation Architecture */}
      <section className="rounded-3xl bg-[#070E1E] border border-[rgba(148,163,184,0.18)] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E25822]/15 text-[#F5A623] border border-[#E25822]/30">
                REPEATED COMPLAINT ESCALATION ENGINE
              </span>
              <h2 className="font-heading text-lg font-bold text-white">
                Deterministic 3-Stage Resolution Workflow
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Automated progression ensuring zero delays and complete victim confidentiality
            </p>
          </div>

          <button
            onClick={onExploreEscalation}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A1428] hover:bg-[#0E1A33] border border-[rgba(148,163,184,0.2)] text-xs text-[#3B82F6] font-bold transition-colors cursor-pointer"
          >
            <span>Open Escalation Simulator</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stage 1 */}
          <div className="relative rounded-2xl bg-[#0A1428] border border-blue-500/30 p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-[#3B82F6] text-xs font-extrabold flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-[#3B82F6] border border-blue-500/30">
                1st Incident
              </span>
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Assigned to School HOD</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              The Department HOD receives the incident brief, suspect pattern, and location for immediate departmental counseling.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#10B981] pt-2 border-t border-[rgba(148,163,184,0.1)] font-semibold">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Victim identity strictly redacted</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="relative rounded-2xl bg-[#0A1428] border border-amber-500/30 p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-[#F5A623] text-xs font-extrabold flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[#F5A623] border border-amber-500/30">
                2nd Repeat Incident
              </span>
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Escalated to Dean of Student Welfare</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              When a 2nd incident matches the suspect or venue cluster, it automatically bypasses HOD and alerts the Dean.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#10B981] pt-2 border-t border-[rgba(148,163,184,0.1)] font-semibold">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Victim identity strictly redacted</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="relative rounded-2xl bg-[#0A1428] border border-purple-500/30 p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-xs font-extrabold flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                3rd Repeat Incident
              </span>
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Higher Disciplinary Board</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Third matching report triggers university-wide disciplinary action. Full details accessible only in authorized higher board session.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300 pt-2 border-t border-[rgba(148,163,184,0.1)] font-semibold">
              <Scale className="w-3.5 h-3.5" />
              <span>Authorized full details access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live System Metrics Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-[#0A1428] border border-[rgba(148,163,184,0.18)] p-5 text-center shadow-md">
          <p className="text-xs font-medium text-[#94A3B8]">Total Portal Cases</p>
          <p className="text-3xl font-black text-white mt-1 font-mono">{totalReports}</p>
        </div>
        <div className="rounded-2xl bg-[#0A1428] border border-[rgba(148,163,184,0.18)] p-5 text-center shadow-md">
          <p className="text-xs font-medium text-[#94A3B8]">Active Under Review</p>
          <p className="text-3xl font-black text-[#3B82F6] mt-1 font-mono">{underReviewCount}</p>
        </div>
        <div className="rounded-2xl bg-[#0A1428] border border-[rgba(148,163,184,0.18)] p-5 text-center shadow-md">
          <p className="text-xs font-medium text-[#94A3B8]">Repeat Escalated</p>
          <p className="text-3xl font-black text-[#F5A623] mt-1 font-mono">{escalatedCount}</p>
        </div>
        <div className="rounded-2xl bg-[#0A1428] border border-[rgba(148,163,184,0.18)] p-5 text-center shadow-md">
          <p className="text-xs font-medium text-[#94A3B8]">Cases Resolved</p>
          <p className="text-3xl font-black text-[#10B981] mt-1 font-mono">{resolvedCount}</p>
        </div>
      </section>

      {/* Institutional Legal Notice Footer */}
      <footer className="rounded-2xl bg-[#060D1E]/80 border border-[rgba(148,163,184,0.14)] p-4 text-xs text-[#94A3B8] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>
            Takshashila University Anti-Ragging Cell • Compliant with UGC & Supreme Court of India Directives.
          </span>
        </div>
        <div className="text-[11px] text-[#94A3B8]/90 font-mono">
          Campus Control: 092976 23456 • Ongur, Tindivanam 604305
        </div>
      </footer>
    </div>
  );
};
