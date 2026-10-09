import React from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  User,
  Clock,
  MapPin,
  Globe2,
  Building2,
  FileText,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { IncidentReport, UserRole } from '../types';
import { getRoleViewReport } from '../utils/storage';

interface ReportDetailsModalProps {
  report: IncidentReport | null;
  activeRole: UserRole;
  onClose: () => void;
  onOpenStatusUpdate: (report: IncidentReport) => void;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  activeRole,
  onClose,
  onOpenStatusUpdate,
}) => {
  if (!report) return null;

  // Apply privacy shielding based on role
  const displayReport = getRoleViewReport(report, activeRole);
  const isAnonymous = displayReport.isAnonymous;
  const isHigherAuthority = activeRole === 'higher_authority';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.25)] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[rgba(148,163,184,0.15)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-extrabold text-white">
                {displayReport.id}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  displayReport.escalationLevel === 1
                    ? 'bg-blue-500/15 text-[#3B82F6]'
                    : displayReport.escalationLevel === 2
                    ? 'bg-amber-500/15 text-[#F5D547]'
                    : 'bg-purple-500/15 text-purple-400'
                }`}
              >
                Tier {displayReport.escalationLevel} • {displayReport.currentAuthority}
              </span>
            </div>
            <p className="text-xs text-[#AAB3C2] mt-1 capitalize">
              {displayReport.category} Ragging — {displayReport.type}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#AAB3C2] hover:text-white hover:bg-[#071426] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Privacy Notice Banner */}
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-3 border ${
            isHigherAuthority
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
              : 'bg-blue-500/10 border-blue-500/30 text-[#AAB3C2]'
          }`}
        >
          {isHigherAuthority ? (
            <Scale className="w-5 h-5 text-purple-400 shrink-0" />
          ) : (
            <EyeOff className="w-5 h-5 text-[#21E6A8] shrink-0" />
          )}
          <div>
            <span className="font-bold text-white block">
              {isHigherAuthority
                ? 'Authorized Disciplinary Board View'
                : 'Role-Protected Redacted View (HOD / Dean)'}
            </span>
            <span className="text-[11px]">
              {isHigherAuthority
                ? isAnonymous
                  ? 'Complaint filed anonymously. Zero reporter identity was captured.'
                  : 'Authorized access to full reporter and suspect credentials.'
                : 'Victim personal identity is shielded under campus anti-retaliation guidelines.'}
            </span>
          </div>
        </div>

        {/* Reporter Section (Redacted for HOD/Dean, Authorized for Higher Auth) */}
        <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] p-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#3B82F6]" />
            <span>Reporter Identity Status</span>
          </h4>

          {isAnonymous ? (
            <div className="flex items-center gap-2 text-xs text-[#21E6A8]">
              <EyeOff className="w-4 h-4" />
              <span>
                Anonymous Submission — No student credentials stored in system.
              </span>
            </div>
          ) : isHigherAuthority ? (
            // Higher Authority sees real details
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#AAB3C2] block">Student Name:</span>
                <span className="text-white font-bold">{displayReport.reporter?.name}</span>
              </div>
              <div>
                <span className="text-[#AAB3C2] block">Department / Roll:</span>
                <span className="text-white font-medium">
                  {displayReport.reporter?.department} ({displayReport.reporter?.studentId || 'N/A'})
                </span>
              </div>
              <div>
                <span className="text-[#AAB3C2] block">Email:</span>
                <span className="text-white font-mono">{displayReport.reporter?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#AAB3C2] block">Phone:</span>
                <span className="text-white font-mono">{displayReport.reporter?.phone || 'N/A'}</span>
              </div>
            </div>
          ) : (
            // HOD & Dean see strictly redacted fields
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#AAB3C2] block">Student Name:</span>
                <span className="text-[#21E6A8] font-mono font-bold">
                  [CONFIDENTIAL VICTIM IDENTITY REDACTED]
                </span>
              </div>
              <div>
                <span className="text-[#AAB3C2] block">Department / Roll:</span>
                <span className="text-[#AAB3C2] font-mono">[PROTECTED]</span>
              </div>
              <div>
                <span className="text-[#AAB3C2] block">Contact Channels:</span>
                <span className="text-[#AAB3C2] font-mono">[INTERNAL PROXY ONLY]</span>
              </div>
            </div>
          )}
        </div>

        {/* Incident Details */}
        <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] p-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#3B82F6]" />
            <span>Incident Brief</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#AAB3C2] block">Date & Time:</span>
              <span className="text-white font-medium">
                {displayReport.date} at {displayReport.approxTime}
              </span>
            </div>
            <div>
              <span className="text-[#AAB3C2] block">Location / Platform:</span>
              <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                {displayReport.category === 'offline' ? (
                  <Building2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                ) : (
                  <Globe2 className="w-3.5 h-3.5 text-[#21E6A8]" />
                )}
                <span>{displayReport.locationOrPlatform}</span>
              </span>
            </div>
            {displayReport.onlineAccountHandle && (
              <div>
                <span className="text-[#AAB3C2] block">Reported Handle:</span>
                <span className="text-[#21E6A8] font-mono">
                  @{displayReport.onlineAccountHandle}
                </span>
              </div>
            )}
            <div>
              <span className="text-[#AAB3C2] block">Ongoing Threat:</span>
              <span
                className={`font-semibold ${
                  displayReport.isOngoing ? 'text-red-400' : 'text-[#AAB3C2]'
                }`}
              >
                {displayReport.isOngoing ? 'YES — Active Situation' : 'No'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[rgba(148,163,184,0.1)]">
            <span className="text-[#AAB3C2] text-xs block mb-1">Description:</span>
            <p className="text-xs text-white leading-relaxed bg-[#0A1422] p-3 rounded-lg border border-[rgba(148,163,184,0.1)]">
              {displayReport.description}
            </p>
          </div>
        </div>

        {/* Suspect Information */}
        <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] p-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#F5D547]" />
            <span>Suspect & Correlation Profile</span>
          </h4>

          {displayReport.suspect ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#AAB3C2] block">Suspect Name:</span>
                <span className="text-white font-bold">
                  {displayReport.suspect.name || 'Unspecified'}
                </span>
              </div>
              <div>
                <span className="text-[#AAB3C2] block">Department / Year:</span>
                <span className="text-white font-medium">
                  {displayReport.suspect.department || 'Unspecified'}
                </span>
              </div>
              <div>
                <span className="text-[#AAB3C2] block">Contact / Handle:</span>
                <span className="text-white font-mono">
                  {displayReport.suspect.phone || displayReport.suspect.platformHandle || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[#AAB3C2] block">Identified Cluster:</span>
                <span className="text-[#F5D547] font-mono text-[11px]">
                  {displayReport.matchGroupId}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#AAB3C2] italic">
              No specific suspect details supplied by reporter.
            </p>
          )}

          <div className="text-[11px] text-[#AAB3C2] pt-1">
            <strong className="text-white">Matching Explanation:</strong> {displayReport.matchReason}
          </div>
        </div>

        {/* Evidence Attachment */}
        {displayReport.evidence && (
          <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#21E6A8]" />
              <span>Evidence File</span>
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {displayReport.evidence.dataUrl && (
                <img
                  src={displayReport.evidence.dataUrl}
                  alt="Evidence"
                  className="w-32 h-24 object-cover rounded-lg border border-[rgba(148,163,184,0.2)]"
                />
              )}
              <div className="text-xs space-y-1">
                <p className="font-bold text-white">{displayReport.evidence.fileName}</p>
                <p className="text-[#AAB3C2]">
                  {(displayReport.evidence.fileSize / 1024).toFixed(1)} KB • {displayReport.evidence.fileType}
                </p>
                <span className="inline-block text-[10px] text-[#21E6A8] font-semibold">
                  Verified Local Demo Attachment
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Timeline / Escalation History */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Escalation Milestones
          </h4>
          <div className="space-y-2">
            {displayReport.escalationHistory.map((esc, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#080B12] border border-[rgba(148,163,184,0.1)] text-xs flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-white">
                    Tier {esc.level} — {esc.authority}
                  </span>
                  <p className="text-[11px] text-[#AAB3C2] mt-0.5">{esc.reason}</p>
                </div>
                <span className="text-[10px] text-[#AAB3C2] font-mono shrink-0">
                  {new Date(esc.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[rgba(148,163,184,0.15)]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#080B12] hover:bg-[#071426] text-[#AAB3C2] hover:text-white text-xs font-semibold transition-colors"
          >
            Close Details
          </button>

          {activeRole !== 'student' && (
            <button
              onClick={() => {
                onClose();
                onOpenStatusUpdate(report);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Update Case Status / Add Audit Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
