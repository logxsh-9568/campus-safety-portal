import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  PhoneCall,
  Mail,
  AlertTriangle,
  Scale,
  FileCheck,
  Globe2,
  Building2,
  Lock,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface SafetyGuidelinesSectionProps {
  lang: Language;
}

export const SafetyGuidelinesSection: React.FC<SafetyGuidelinesSectionProps> = ({
  lang,
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#3B82F6]" />
          <span>Campus Safety Directives & Student Protection Code</span>
        </h1>
        <p className="text-xs text-[#AAB3C2] mt-1">
          Regulatory compliance under UGC Regulations on Curbing the Menace of Ragging (2009) & IT Act Cyber Protection.
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0A1422] to-[#0A1422] border border-red-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider block">
                24/7 Takshashila Rapid Safety Helpline
              </span>
              <a
                href="tel:09297623456"
                className="text-xl sm:text-2xl font-mono font-extrabold text-white hover:text-red-300 transition-colors"
              >
                092976 23456
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1 text-xs text-[#AAB3C2]">
            <span className="flex items-center gap-1.5 text-white">
              <Mail className="w-4 h-4 text-red-400" />
              <span>safety.complaints@takshashilauniv.ac.in</span>
            </span>
            <span>Takshashila University Campus Security Command</span>
          </div>
        </div>
      </div>

      {/* Anti-Ragging Legal Framework */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-6 space-y-3 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#3B82F6]" />
            <span>Definition of Offline Ragging</span>
          </h3>
          <p className="text-xs text-[#AAB3C2] leading-relaxed">
            Any conduct by senior students by words spoken or written, or by an act which has the effect of teasing, treating or handling with rudeness a junior; indulging in rowdy or undisciplined activities; or asking students to do acts causing shame, torment, or physical discomfort.
          </p>
          <ul className="text-xs text-[#AAB3C2] space-y-1.5 list-disc list-inside pt-1">
            <li>Forced servitude or errands in hostels</li>
            <li>Restricting free movement or blocking corridors</li>
            <li>Verbal abuse, intimidation, or derogatory nicknames</li>
            <li>Physical assault or compulsion to consume substances</li>
          </ul>
        </div>

        <div className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-6 space-y-3 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#21E6A8]" />
            <span>Definition of Online Ragging & Cyber Harassment</span>
          </h3>
          <p className="text-xs text-[#AAB3C2] leading-relaxed">
            The use of electronic communication, fake digital personas, social media pages, confession boards, or direct messaging channels to harass, defame, impersonate, or intimidate fellow students under Section 66E/67 of the Information Technology Act.
          </p>
          <ul className="text-xs text-[#AAB3C2] space-y-1.5 list-disc list-inside pt-1">
            <li>Impersonating students via fake social media accounts</li>
            <li>Posting or sharing non-consensual photographs or media</li>
            <li>Sending abusive, threatening direct messages or voice notes</li>
            <li>Organized cyber-bullying on batch WhatsApp/Discord groups</li>
          </ul>
        </div>
      </div>

      {/* Student Rights & Confidentiality Assurance */}
      <div className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-6 space-y-5 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#21E6A8]" />
          <span>Campus Anti-Retaliation & Identity Shielding Protocol</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.1)] space-y-1.5">
            <span className="font-bold text-white block">Absolute Victim Shielding</span>
            <p className="text-[#AAB3C2] leading-relaxed">
              Neither Department Heads nor Deans receive victim personal contact credentials in their review queues.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.1)] space-y-1.5">
            <span className="font-bold text-white block">Deterministic Escalation</span>
            <p className="text-[#AAB3C2] leading-relaxed">
              Repeat offenders cannot bury complaints. The system automatically elevates 2nd reports to the Dean and 3rd reports to the Higher Disciplinary Board.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.1)] space-y-1.5">
            <span className="font-bold text-white block">Zero Academic Retaliation</span>
            <p className="text-[#AAB3C2] leading-relaxed">
              Retaliatory grading, attendance docking, or viva bias against a complainant is classified as a gross misconduct offense.
            </p>
          </div>
        </div>
      </div>

      {/* Prototype Reality Disclosure */}
      <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] p-5 text-xs text-[#AAB3C2] space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Lock className="w-4 h-4 text-[#F5D547]" />
          <span>Evaluation Prototype Architecture Note</span>
        </div>
        <p className="leading-relaxed">
          This system was designed and engineered for the Hackverse technical challenge. All records are processed via deterministic JavaScript state algorithms and persisted in browser storage. In a production university roll-out, this system interfaces with institutional LDAP/SSO authentication and encrypted audit databases.
        </p>
      </div>
    </div>
  );
};
