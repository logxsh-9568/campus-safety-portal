import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  FileCheck,
} from 'lucide-react';
import { IncidentReport, ComplaintStatus, UserRole, AuthorityRole } from '../types';

interface StatusUpdateModalProps {
  report: IncidentReport | null;
  activeRole: UserRole;
  onClose: () => void;
  onUpdateStatus: (
    reportId: string,
    newStatus: ComplaintStatus,
    note: string,
    updaterName: string
  ) => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  report,
  activeRole,
  onClose,
  onUpdateStatus,
}) => {
  if (!report) return null;

  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(report.status);
  const [note, setNote] = useState('');
  const [updaterName, setUpdaterName] = useState(() => {
    if (activeRole === 'hod') return 'Dr. M. Sridhar (HOD CSE)';
    if (activeRole === 'dean') return 'Prof. K. Narayanan (Dean Welfare)';
    return 'Disciplinary Oversight Board';
  });

  const roleNameMap: Record<UserRole, AuthorityRole | string> = {
    student: 'Student',
    hod: 'HOD',
    dean: 'Dean',
    higher_authority: 'Higher Authority',
  };

  const statusOptions: { value: ComplaintStatus; label: string; desc: string }[] = [
    {
      value: 'under_review',
      label: 'Under Review',
      desc: 'Active confidential inquiry and initial fact-finding started.',
    },
    {
      value: 'action_in_progress',
      label: 'Action in Progress',
      desc: 'Warden intervention, IT cyber takedown, or disciplinary counseling initiated.',
    },
    {
      value: 'escalated',
      label: 'Escalate to Next Tier',
      desc: 'Formally elevate case to higher authority level for disciplinary sanctions.',
    },
    {
      value: 'resolved',
      label: 'Resolved & Closed',
      desc: 'Disciplinary action enacted, undertaking signed, or remediation verified.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    onUpdateStatus(
      report.id,
      selectedStatus,
      note.trim(),
      updaterName.trim() || String(roleNameMap[activeRole])
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.25)] shadow-2xl p-6 sm:p-7 space-y-5">
        <div className="flex items-start justify-between border-b border-[rgba(148,163,184,0.15)] pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#3B82F6]" />
              <span>Update Case Status</span>
            </h3>
            <p className="text-xs text-[#AAB3C2] font-mono mt-0.5">
              Case Ref: <strong className="text-white">{report.id}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#AAB3C2] hover:text-white hover:bg-[#071426] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-2">
              Select New Case Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedStatus === opt.value
                      ? 'bg-blue-600/15 border-[#3B82F6] text-white'
                      : 'bg-[#080B12] border-[rgba(148,163,184,0.15)] text-[#AAB3C2] hover:border-[rgba(148,163,184,0.3)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="caseStatus"
                    value={opt.value}
                    checked={selectedStatus === opt.value}
                    onChange={() => setSelectedStatus(opt.value)}
                    className="mt-0.5 text-[#3B82F6] focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-[#AAB3C2] block">
                      {opt.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Author / Authority Designation
            </label>
            <input
              type="text"
              value={updaterName}
              onChange={(e) => setUpdaterName(e.target.value)}
              className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Official Audit Note / Investigation Action *
            </label>
            <textarea
              rows={3}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Summoned anti-ragging squad; reviewed hostel CCTV footage; perpetrator issued official warning..."
              className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(148,163,184,0.12)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#080B12] text-xs font-semibold text-[#AAB3C2] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!note.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Commit Status Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
