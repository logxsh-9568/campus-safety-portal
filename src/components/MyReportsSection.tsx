import React, { useState } from 'react';
import {
  FolderLock,
  Copy,
  Check,
  Search,
  FilePlus,
  Clock,
  Shield,
  Building2,
  Globe2,
} from 'lucide-react';
import { IncidentReport } from '../types';
import { Language, translations } from '../utils/i18n';

interface MyReportsSectionProps {
  reports: IncidentReport[];
  myReportIds: string[];
  onTrackReport: (id: string) => void;
  onNewReport: () => void;
  lang: Language;
}

export const MyReportsSection: React.FC<MyReportsSectionProps> = ({
  reports,
  myReportIds,
  onTrackReport,
  onNewReport,
  lang,
}) => {
  const t = translations[lang];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter reports that were submitted in this browser or match demo samples
  const myReports = reports.filter(
    (r) => myReportIds.includes(r.id) || r.isDemoSample
  );

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-[#21E6A8]" />
            <span>{t.myReports}</span>
          </h1>
          <p className="text-xs text-[#AAB3C2] mt-1">
            Locally indexed complaint tokens filed on this device.
          </p>
        </div>

        <button
          onClick={onNewReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer self-start sm:self-auto"
        >
          <FilePlus className="w-4 h-4" />
          <span>Lodge New Complaint</span>
        </button>
      </div>

      {/* Reports List */}
      {myReports.length > 0 ? (
        <div className="space-y-4">
          {myReports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-5 hover:border-[#3B82F6]/50 transition-all space-y-4 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#071426] border border-[rgba(148,163,184,0.2)] flex items-center justify-center">
                    {report.category === 'offline' ? (
                      <Building2 className="w-5 h-5 text-[#3B82F6]" />
                    ) : (
                      <Globe2 className="w-5 h-5 text-[#21E6A8]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">
                        {report.id}
                      </span>
                      {report.isDemoSample && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(148,163,184,0.1)] text-[#AAB3C2]">
                          Demo Sample
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#AAB3C2] capitalize block">
                      {report.type} • {report.locationOrPlatform}
                    </span>
                  </div>
                </div>

                {/* Status & Escalation Tier */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      report.escalationLevel === 1
                        ? 'bg-blue-500/15 text-[#3B82F6] border border-blue-500/30'
                        : report.escalationLevel === 2
                        ? 'bg-amber-500/15 text-[#F5D547] border border-amber-500/30'
                        : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    Tier {report.escalationLevel} ({report.currentAuthority})
                  </span>

                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#080B12] text-[#AAB3C2] border border-[rgba(148,163,184,0.18)] capitalize">
                    {report.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[rgba(148,163,184,0.1)] text-xs">
                <span className="text-[#AAB3C2] flex items-center gap-1.5 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Filed {new Date(report.createdAt).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(report.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080B12] hover:bg-[#071426] border border-[rgba(148,163,184,0.2)] text-xs text-[#AAB3C2] hover:text-white transition-colors"
                  >
                    {copiedId === report.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#21E6A8]" />
                        <span className="text-[#21E6A8]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onTrackReport(report.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6]/15 hover:bg-[#3B82F6]/25 border border-[#3B82F6]/30 text-xs text-[#3B82F6] font-semibold transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-12 text-center space-y-4">
          <FolderLock className="w-12 h-12 text-[#AAB3C2] mx-auto opacity-60" />
          <h3 className="text-base font-bold text-white">No Reports Filed on this Device</h3>
          <p className="text-xs text-[#AAB3C2] max-w-sm mx-auto">
            When you submit a complaint, its reference token will be stored here so you can easily copy and track its status.
          </p>
          <button
            onClick={onNewReport}
            className="px-5 py-2.5 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
          >
            File First Report
          </button>
        </div>
      )}
    </div>
  );
};
