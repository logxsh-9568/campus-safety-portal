import React, { useState } from 'react';
import {
  LayoutDashboard,
  Shield,
  Bell,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Globe2,
  FileText,
  UserCheck,
  Scale,
  Sparkles,
  Search,
  Check,
} from 'lucide-react';
import {
  IncidentReport,
  UserRole,
  AuthorityRole,
  ComplaintCategory,
  ComplaintStatus,
  AuthorityNotification,
} from '../types';
import { Language, translations } from '../utils/i18n';

interface AuthorityDashboardProps {
  reports: IncidentReport[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  notifications: AuthorityNotification[];
  onMarkNotificationRead: (id: string) => void;
  onOpenReportDetails: (report: IncidentReport) => void;
  onOpenStatusUpdate: (report: IncidentReport) => void;
  lang: Language;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  reports,
  activeRole,
  setActiveRole,
  notifications,
  onMarkNotificationRead,
  onOpenReportDetails,
  onOpenStatusUpdate,
  lang,
}) => {
  const t = translations[lang];

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Authority role map
  const roleNameMap: Record<UserRole, AuthorityRole | null> = {
    student: null,
    hod: 'HOD',
    dean: 'Dean',
    higher_authority: 'Higher Authority',
  };

  const currentAuthority = roleNameMap[activeRole];

  // Authority-scoped reports:
  // HOD sees Tier 1 or general assigned
  // Dean sees Tier 2
  // Higher Authority sees Tier 3 or all escalated
  const scopedReports = reports.filter((r) => {
    if (activeRole === 'hod') {
      return r.escalationLevel === 1 || r.currentAuthority === 'HOD';
    }
    if (activeRole === 'dean') {
      return r.escalationLevel === 2 || r.currentAuthority === 'Dean';
    }
    if (activeRole === 'higher_authority') {
      return r.escalationLevel === 3 || r.currentAuthority === 'Higher Authority';
    }
    return true; // if student views dashboard, shows overview
  });

  // Filtered reports
  const displayedReports = scopedReports.filter((r) => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = r.id.toLowerCase().includes(q);
      const matchType = r.type.toLowerCase().includes(q);
      const matchLoc = r.locationOrPlatform.toLowerCase().includes(q);
      const matchSuspect = r.suspect?.name?.toLowerCase().includes(q) || false;
      if (!matchId && !matchType && !matchLoc && !matchSuspect) return false;
    }
    return true;
  });

  // Statistics
  const totalInScope = scopedReports.length;
  const newCount = scopedReports.filter((r) => r.status === 'submitted').length;
  const underReviewCount = scopedReports.filter((r) => r.status === 'under_review').length;
  const escalatedCount = scopedReports.filter((r) => r.status === 'escalated').length;
  const resolvedCount = scopedReports.filter((r) => r.status === 'resolved').length;

  const offlineInScope = scopedReports.filter((r) => r.category === 'offline').length;
  const onlineInScope = scopedReports.filter((r) => r.category === 'online').length;

  // Unread notifications for this role
  const roleNotifications = notifications.filter((n) => {
    if (!currentAuthority) return false;
    return n.targetRole === currentAuthority;
  });
  const unreadNotifs = roleNotifications.filter((n) => !n.read);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Role Demonstration Notice */}
      <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.18)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#3B82F6] shrink-0">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Authority Management Portal</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-[#3B82F6] border border-blue-500/30">
                {currentAuthority ? `${currentAuthority} QUEUE` : 'GLOBAL MONITOR'}
              </span>
            </h1>
            <p className="text-xs text-[#AAB3C2]">
              Role-protected case triage, automated escalation notifications, and resolution audit trail.
            </p>
          </div>
        </div>

        {/* Role Quick Switch Buttons */}
        <div className="flex items-center gap-1.5 bg-[#0A1422] p-1 rounded-xl border border-[rgba(148,163,184,0.2)]">
          <span className="text-[11px] text-[#AAB3C2] px-2 font-medium hidden md:inline">
            Active Role:
          </span>
          {(['hod', 'dean', 'higher_authority'] as UserRole[]).map((r) => {
            const labels: Record<UserRole, string> = {
              student: 'Student',
              hod: 'HOD (Tier 1)',
              dean: 'Dean (Tier 2)',
              higher_authority: 'Higher Board (Tier 3)',
            };
            return (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeRole === r
                    ? 'bg-[#3B82F6] text-white shadow-md'
                    : 'text-[#AAB3C2] hover:text-white hover:bg-[#071426]'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role View Disclaimer Banner */}
      <div className="rounded-xl bg-[#071426] border border-[#3B82F6]/30 p-4 flex items-start gap-3 text-xs text-[#AAB3C2]">
        <Shield className="w-4 h-4 text-[#21E6A8] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-white font-semibold">
            {activeRole === 'higher_authority'
              ? 'Authorized Disciplinary Board Access: Full case details accessible for Tier 3 escalations.'
              : 'Victim Anonymity Protection Enforced: Reporter identity and student credentials are strictly masked from HOD & Dean views.'}
          </p>
          <p className="text-[11px] text-[#AAB3C2]/80">
            Note: This interface represents a frontend role-based access demonstration. Real-world deployment enforces server-side JWT authentication and database level row security.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-4">
          <span className="text-[11px] text-[#AAB3C2] block">Queue Complaints</span>
          <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
            {totalInScope}
          </span>
          <span className="text-[10px] text-[#3B82F6]">Current authority scope</span>
        </div>

        <div className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-4">
          <span className="text-[11px] text-[#AAB3C2] block">New / Submitted</span>
          <span className="text-2xl font-extrabold text-[#3B82F6] font-mono mt-1 block">
            {newCount}
          </span>
          <span className="text-[10px] text-[#AAB3C2]">Awaiting initial review</span>
        </div>

        <div className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-4">
          <span className="text-[11px] text-[#AAB3C2] block">Under Review</span>
          <span className="text-2xl font-extrabold text-[#F5D547] font-mono mt-1 block">
            {underReviewCount}
          </span>
          <span className="text-[10px] text-[#AAB3C2]">Active inquiry</span>
        </div>

        <div className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-4">
          <span className="text-[11px] text-[#AAB3C2] block">Escalated Cases</span>
          <span className="text-2xl font-extrabold text-purple-400 font-mono mt-1 block">
            {escalatedCount}
          </span>
          <span className="text-[10px] text-purple-300">Repeat incident trigger</span>
        </div>

        <div className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-4 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-[#AAB3C2] block">Cases Resolved</span>
          <span className="text-2xl font-extrabold text-[#21E6A8] font-mono mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-[10px] text-[#21E6A8]">Action completed</span>
        </div>
      </div>

      {/* Breakdown Bar & Notification Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Breakdown Card */}
        <div className="rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-5 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Category Distribution</span>
            <span className="text-[#AAB3C2] font-mono text-[11px]">{totalInScope} Cases</span>
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#AAB3C2] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Offline Physical / Hostel</span>
                </span>
                <span className="text-white font-mono font-bold">{offlineInScope}</span>
              </div>
              <div className="w-full h-2 bg-[#080B12] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3B82F6]"
                  style={{
                    width: totalInScope > 0 ? `${(offlineInScope / totalInScope) * 100}%` : '0%',
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#AAB3C2] flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#21E6A8]" />
                  <span>Online Cyber / DMs</span>
                </span>
                <span className="text-white font-mono font-bold">{onlineInScope}</span>
              </div>
              <div className="w-full h-2 bg-[#080B12] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#21E6A8]"
                  style={{
                    width: totalInScope > 0 ? `${(onlineInScope / totalInScope) * 100}%` : '0%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Authority Notification Queue */}
        <div className="lg:col-span-2 rounded-xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#F5D547]" />
              <span>{currentAuthority || 'Authority'} Dispatch Alerts</span>
              {unreadNotifs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white">
                  {unreadNotifs.length} new
                </span>
              )}
            </h3>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-xs text-[#3B82F6] hover:underline"
            >
              {showNotifications ? 'Collapse' : `View All (${roleNotifications.length})`}
            </button>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {roleNotifications.length > 0 ? (
              roleNotifications.slice(0, showNotifications ? 10 : 3).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 transition-colors ${
                    !notif.read
                      ? 'bg-[#071426] border-[#3B82F6]/40 text-white'
                      : 'bg-[#080B12] border-[rgba(148,163,184,0.1)] text-[#AAB3C2]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        !notif.read ? 'bg-[#21E6A8] animate-pulse' : 'bg-transparent'
                      }`}
                    ></span>
                    <div>
                      <p className="font-medium leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-[#AAB3C2] font-mono mt-0.5 block">
                        {new Date(notif.timestamp).toLocaleTimeString()} • Ref: {notif.reportId}
                      </span>
                    </div>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className="px-2 py-1 rounded bg-[#0A1422] hover:bg-emerald-950 text-[10px] text-[#21E6A8] border border-[#21E6A8]/30 shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-[#AAB3C2] italic py-2">
                No recent dispatch alerts in {currentAuthority} queue.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Registry Table Controls */}
      <div className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Assigned Complaint Registry</span>
              <span className="text-xs font-normal text-[#AAB3C2]">
                ({displayedReports.length} records)
              </span>
            </h2>
            <p className="text-xs text-[#AAB3C2]">
              Select a case to inspect evidence, view suspect correlation, or commit an official status transition.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#AAB3C2] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, suspect, venue..."
              className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[rgba(148,163,184,0.12)]">
          <span className="text-xs text-[#AAB3C2] flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#080B12] text-xs text-white border border-[rgba(148,163,184,0.2)] rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="offline">Offline Ragging</option>
            <option value="online">Online Ragging</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#080B12] text-xs text-white border border-[rgba(148,163,184,0.2)] rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="escalated">Escalated</option>
            <option value="action_in_progress">Action in Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Reports Table / Card List */}
        {displayedReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(148,163,184,0.15)] text-[11px] uppercase tracking-wider text-[#AAB3C2] bg-[#080B12]/50">
                  <th className="py-3 px-3">Complaint ID</th>
                  <th className="py-3 px-3">Type / Category</th>
                  <th className="py-3 px-3">Victim Identity</th>
                  <th className="py-3 px-3">Suspect / Group</th>
                  <th className="py-3 px-3">Escalation</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(148,163,184,0.1)] text-xs">
                {displayedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-[#071426]/60 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {report.id}
                    </td>

                    {/* Category & Type */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {report.category === 'offline' ? (
                          <Building2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                        ) : (
                          <Globe2 className="w-3.5 h-3.5 text-[#21E6A8]" />
                        )}
                        <span className="font-semibold text-white capitalize">
                          {report.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#AAB3C2] block">
                        {report.locationOrPlatform}
                      </span>
                    </td>

                    {/* Reporter (Redacted Check) */}
                    <td className="py-3.5 px-3">
                      {report.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#21E6A8] bg-emerald-500/10 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" /> Anonymous
                        </span>
                      ) : activeRole === 'higher_authority' ? (
                        <span className="font-semibold text-white">
                          {report.reporter?.name || 'Authorized View'}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-[#AAB3C2] bg-[#080B12] px-2 py-0.5 rounded border border-[rgba(148,163,184,0.1)]">
                          [CONFIDENTIAL - REDACTED]
                        </span>
                      )}
                    </td>

                    {/* Suspect */}
                    <td className="py-3.5 px-3">
                      <span className="text-white font-medium">
                        {report.suspect?.name || report.suspect?.platformHandle || 'Unidentified'}
                      </span>
                      {report.suspect?.department && (
                        <span className="text-[11px] text-[#AAB3C2] block">
                          {report.suspect.department}
                        </span>
                      )}
                    </td>

                    {/* Escalation Level */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          report.escalationLevel === 1
                            ? 'bg-blue-500/15 text-[#3B82F6]'
                            : report.escalationLevel === 2
                            ? 'bg-amber-500/15 text-[#F5D547]'
                            : 'bg-purple-500/15 text-purple-400'
                        }`}
                      >
                        Tier {report.escalationLevel} ({report.currentAuthority})
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded bg-[#080B12] text-[#AAB3C2] border border-[rgba(148,163,184,0.15)]">
                        {report.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenReportDetails(report)}
                          className="px-2.5 py-1 rounded-lg bg-[#080B12] hover:bg-[#071426] border border-[rgba(148,163,184,0.2)] text-[11px] text-[#3B82F6] font-semibold transition-colors"
                          title="View Case File"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => onOpenStatusUpdate(report)}
                          className="px-2.5 py-1 rounded-lg bg-[#3B82F6] hover:bg-blue-600 text-[11px] text-white font-semibold transition-colors"
                          title="Update Status"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2 bg-[#080B12]/40 rounded-xl border border-[rgba(148,163,184,0.1)]">
            <p className="text-xs text-[#AAB3C2]">
              No complaints found matching current queue or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
