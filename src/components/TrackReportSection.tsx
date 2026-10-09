import React, { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  EyeOff,
  GitCommit,
  Building2,
  Globe2,
  HelpCircle,
} from 'lucide-react';
import { IncidentReport, ComplaintStatus } from '../types';
import { getRoleViewReport } from '../utils/storage';
import { Language, translations } from '../utils/i18n';

interface TrackReportSectionProps {
  reports: IncidentReport[];
  prefilledId?: string;
  lang: Language;
}

export const TrackReportSection: React.FC<TrackReportSectionProps> = ({
  reports,
  prefilledId,
  lang,
}) => {
  const t = translations[lang];
  const [searchId, setSearchId] = useState(prefilledId || '');
  const [activeReport, setActiveReport] = useState<IncidentReport | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (prefilledId) {
      setSearchId(prefilledId);
      performSearch(prefilledId);
    }
  }, [prefilledId]);

  const performSearch = (idToSearch: string) => {
    const trimmed = idToSearch.trim().toUpperCase();
    setHasSearched(true);
    if (!trimmed) {
      setActiveReport(null);
      return;
    }

    const found = reports.find((r) => r.id.toUpperCase() === trimmed);
    if (found) {
      // Use role-based redaction: public tracking view
      const redacted = getRoleViewReport(found, 'student');
      setActiveReport(redacted);
    } else {
      setActiveReport(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchId);
  };

  const statusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'submitted':
        return {
          label: 'Submitted',
          class: 'bg-blue-500/15 text-[#3B82F6] border-blue-500/30',
        };
      case 'under_review':
        return {
          label: 'Under Review',
          class: 'bg-amber-500/15 text-[#F5D547] border-amber-500/30',
        };
      case 'escalated':
        return {
          label: 'Escalated',
          class: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        };
      case 'action_in_progress':
        return {
          label: 'Action in Progress',
          class: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        };
      case 'resolved':
        return {
          label: 'Resolved',
          class: 'bg-emerald-500/15 text-[#21E6A8] border-emerald-500/30',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Search Bar Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <Search className="w-6 h-6 text-[#3B82F6]" />
          <span>{t.trackReport}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#AAB3C2] max-w-lg mx-auto">
          Enter your unique complaint reference ID to securely check review milestones, authority assignment, and escalation stage.
        </p>

        {/* Input Card */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mt-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. AEGIS-2026-0811"
              className="w-full bg-[#0A1422] border border-[rgba(148,163,184,0.3)] hover:border-[#3B82F6] focus:border-[#3B82F6] rounded-xl px-4 py-3.5 pr-28 text-sm text-white font-mono placeholder:font-sans focus:outline-none shadow-lg transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Sample IDs */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-[#AAB3C2]">Quick Test Samples:</span>
          {reports.slice(0, 3).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSearchId(r.id);
                performSearch(r.id);
              }}
              className="text-xs font-mono px-2 py-0.5 rounded bg-[#0A1422] hover:bg-[#071426] border border-[rgba(148,163,184,0.2)] text-[#3B82F6] hover:text-[#21E6A8] transition-colors"
            >
              {r.id}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT VIEW */}
      {activeReport ? (
        <div className="space-y-6">
          {/* Main Status Header Card */}
          <div className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.2)] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(148,163,184,0.12)] pb-6">
              <div>
                <span className="text-xs font-mono font-semibold text-[#AAB3C2] uppercase">
                  Complaint Reference
                </span>
                <h2 className="text-2xl font-mono font-extrabold text-white">
                  {activeReport.id}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#AAB3C2]">
                  <span>Lodged: {new Date(activeReport.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="capitalize">{activeReport.category} Ragging</span>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    statusBadge(activeReport.status).class
                  }`}
                >
                  {statusBadge(activeReport.status).label}
                </span>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                    activeReport.escalationLevel === 1
                      ? 'bg-blue-500/10 text-[#3B82F6]'
                      : activeReport.escalationLevel === 2
                      ? 'bg-amber-500/10 text-[#F5D547]'
                      : 'bg-purple-500/10 text-purple-400'
                  }`}
                >
                  Tier {activeReport.escalationLevel} • {activeReport.currentAuthority} Queue
                </span>
              </div>
            </div>

            {/* Redacted Public Metrics (Ensuring zero victim leak) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-[#080B12] p-4 border border-[rgba(148,163,184,0.12)]">
                <span className="text-[11px] text-[#AAB3C2] block">Assigned Authority</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {activeReport.currentAuthority}
                </span>
                <span className="text-[10px] text-[#AAB3C2]">
                  {activeReport.escalationLevel === 1
                    ? 'Department Head Review'
                    : activeReport.escalationLevel === 2
                    ? 'Dean of Student Welfare'
                    : 'Higher Disciplinary Authority'}
                </span>
              </div>

              <div className="rounded-xl bg-[#080B12] p-4 border border-[rgba(148,163,184,0.12)]">
                <span className="text-[11px] text-[#AAB3C2] block">Incident Category</span>
                <span className="text-sm font-bold text-white mt-1 block capitalize flex items-center gap-1.5">
                  {activeReport.category === 'offline' ? (
                    <Building2 className="w-4 h-4 text-[#3B82F6]" />
                  ) : (
                    <Globe2 className="w-4 h-4 text-[#21E6A8]" />
                  )}
                  <span>{activeReport.type}</span>
                </span>
                <span className="text-[10px] text-[#AAB3C2]">
                  {activeReport.locationOrPlatform}
                </span>
              </div>

              <div className="rounded-xl bg-[#080B12] p-4 border border-[rgba(148,163,184,0.12)]">
                <span className="text-[11px] text-[#AAB3C2] block">Privacy Status</span>
                <span className="text-sm font-bold text-[#21E6A8] mt-1 block flex items-center gap-1">
                  <EyeOff className="w-4 h-4" />
                  <span>Confidentiality Active</span>
                </span>
                <span className="text-[10px] text-[#AAB3C2]">
                  Identity redacted from public logs
                </span>
              </div>
            </div>

            {/* Public Redacted Notice */}
            <div className="p-3.5 rounded-xl bg-[#071426] border border-[#3B82F6]/20 text-xs text-[#AAB3C2] flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#3B82F6] shrink-0" />
              <span>
                Public tracking view displays investigation progress and escalation level.
                Confidential victim identity, private witness statements, and evidence attachments remain protected under security policy.
              </span>
            </div>
          </div>

          {/* Incident Timeline */}
          <div className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.2)] p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#3B82F6]" />
              <span>Investigation & Escalation Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[rgba(148,163,184,0.2)]">
              {activeReport.statusUpdates.map((update, idx) => (
                <div key={update.id} className="relative group">
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-[#0A1422] ${
                      idx === activeReport.statusUpdates.length - 1
                        ? 'bg-[#21E6A8] ring-4 ring-[#21E6A8]/20'
                        : 'bg-[#3B82F6]'
                    }`}
                  ></span>

                  <div className="bg-[#080B12] border border-[rgba(148,163,184,0.15)] rounded-xl p-4 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          Status: {update.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#0A1422] text-[#AAB3C2] border border-[rgba(148,163,184,0.1)]">
                          By: {update.updatedBy}
                        </span>
                      </div>
                      <span className="text-[#AAB3C2] font-mono text-[11px]">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#AAB3C2] leading-relaxed">
                      {update.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        /* Empty / Not Found State */
        <div className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 mx-auto flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Matching Record Found</h3>
          <p className="text-xs text-[#AAB3C2] leading-relaxed">
            We could not find a complaint associated with{' '}
            <span className="font-mono text-white font-bold">{searchId}</span>.
            Please verify the complaint reference ID or check the &quot;My Reports&quot; tab.
          </p>
        </div>
      ) : (
        /* Initial Guidance State */
        <div className="rounded-2xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] p-8 text-center max-w-md mx-auto space-y-3">
          <HelpCircle className="w-8 h-8 text-[#3B82F6] mx-auto" />
          <h4 className="text-sm font-bold text-white">How Tracking Works</h4>
          <p className="text-xs text-[#AAB3C2] leading-relaxed">
            Every submitted complaint receives a unique alphanumeric token (e.g. AEGIS-2026-XXXX). Enter it above to see real-time updates as authorities act on the report.
          </p>
        </div>
      )}
    </div>
  );
};
