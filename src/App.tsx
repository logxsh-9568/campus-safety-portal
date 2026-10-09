import React, { useState, useEffect } from 'react';
import {
  IncidentReport,
  UserRole,
  AuthorityRole,
  ComplaintStatus,
  AuthorityNotification,
  ComplaintCategory,
} from './types';
import {
  loadReports,
  saveReports,
  loadNotifications,
  saveNotifications,
  loadMyReportIds,
  saveMyReportId,
  resetDemoData,
} from './utils/storage';
import {
  determineIncidentGroup,
  createEscalationNotification,
  buildEscalationRecord,
} from './utils/escalationEngine';
import { Language } from './utils/i18n';

// Components
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { SubmitComplaintSection } from './components/SubmitComplaintSection';
import { TrackReportSection } from './components/TrackReportSection';
import { MyReportsSection } from './components/MyReportsSection';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { EscalationVisualizer } from './components/EscalationVisualizer';
import { SafeZonesSection } from './components/SafeZonesSection';
import { SafetyGuidelinesSection } from './components/SafetyGuidelinesSection';
import { SettingsModal } from './components/SettingsModal';
import { ReportDetailsModal } from './components/ReportDetailsModal';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { EmergencyVoiceSOSModal } from './components/EmergencyVoiceSOSModal';
import { AIAssistantChatbot } from './components/AIAssistantChatbot';
import { LoginPage } from './components/LoginPage';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('student.ongur@takshashilauniv.ac.in');

  // Application State
  const [reports, setReports] = useState<IncidentReport[]>(() => loadReports());
  const [notifications, setNotifications] = useState<AuthorityNotification[]>(() =>
    loadNotifications()
  );
  const [myReportIds, setMyReportIds] = useState<string[]>(() => loadMyReportIds());

  // Active View & Role
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [lang, setLang] = useState<Language>('en');

  // Modals & Sub-states
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceSosOpen, setVoiceSosOpen] = useState(false);
  const [detailModalReport, setDetailModalReport] = useState<IncidentReport | null>(null);
  const [statusModalReport, setStatusModalReport] = useState<IncidentReport | null>(null);

  // Cross-navigation helpers
  const [trackPrefillId, setTrackPrefillId] = useState<string>('');
  const [submitPrefillCategory, setSubmitPrefillCategory] = useState<ComplaintCategory>('offline');

  // Persist reports & notifications whenever modified
  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Handle new complaint submitted
  const handleReportSubmitted = (newReport: IncidentReport) => {
    setReports((prev) => [newReport, ...prev]);
    saveMyReportId(newReport.id);
    setMyReportIds((prev) => [newReport.id, ...prev]);

    // Create system notification for targeted authority
    const notif = createEscalationNotification(
      newReport.id,
      newReport.currentAuthority,
      newReport.escalationLevel,
      newReport.escalationLevel > 1
    );
    setNotifications((prev) => [notif, ...prev]);
  };

  // Handle simulation run from Escalation Simulator
  const handleSimulateReport = (
    category: 'offline' | 'online',
    suspectName: string,
    venueOrPlatform: string,
    desc: string
  ) => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const id = `AEGIS-2026-SIM${randomHex}`;

    const matchResult = determineIncidentGroup(
      {
        category,
        type: category === 'offline' ? 'Physical Threat' : 'Cyber DM Harassment',
        locationOrPlatform: venueOrPlatform,
        suspect: { name: suspectName },
      },
      reports
    );

    const occurrence = matchResult.previousReportsInGroup.length + 1;
    const escRecord = buildEscalationRecord(
      matchResult.escalationLevel,
      matchResult.targetAuthority,
      occurrence,
      matchResult.matchReason
    );

    const nowIso = new Date().toISOString();

    const simReport: IncidentReport = {
      id,
      category,
      isAnonymous: true,
      reporter: undefined,
      date: nowIso.split('T')[0],
      approxTime: '21:00',
      type: category === 'offline' ? 'Physical Threat' : 'Cyber DM Harassment',
      description: desc,
      locationOrPlatform: venueOrPlatform,
      isOngoing: false,
      urgency: matchResult.escalationLevel === 3 ? 'critical' : 'high',
      suspect: {
        name: suspectName,
        department: 'Simulated Target Profile',
      },
      matchGroupId: matchResult.matchGroupId,
      matchReason: matchResult.matchReason,
      escalationLevel: matchResult.escalationLevel,
      currentAuthority: matchResult.targetAuthority,
      escalationHistory: [escRecord],
      status: matchResult.escalationLevel > 1 ? 'escalated' : 'submitted',
      statusUpdates: [
        {
          id: `su-sim-${Date.now()}`,
          status: matchResult.escalationLevel > 1 ? 'escalated' : 'submitted',
          updatedBy: 'Automated Escalation Simulator',
          authorityRole: 'System',
          timestamp: nowIso,
          note: `Incident occurrence #${occurrence} registered. Assigned to ${matchResult.targetAuthority} (Tier ${matchResult.escalationLevel}).`,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
      isDemoSample: true,
    };

    setReports((prev) => [simReport, ...prev]);
    saveMyReportId(simReport.id);
    setMyReportIds((prev) => [simReport.id, ...prev]);

    const notif = createEscalationNotification(
      simReport.id,
      simReport.currentAuthority,
      simReport.escalationLevel,
      simReport.escalationLevel > 1
    );
    setNotifications((prev) => [notif, ...prev]);

    // Navigate to track report or visualizer
    setTrackPrefillId(simReport.id);
    setActiveTab('track');
  };

  // Handle case status update commit
  const handleUpdateStatus = (
    reportId: string,
    newStatus: ComplaintStatus,
    note: string,
    updaterName: string
  ) => {
    const roleAuthorityMap: Record<UserRole, AuthorityRole | 'System'> = {
      student: 'System',
      hod: 'HOD',
      dean: 'Dean',
      higher_authority: 'Higher Authority',
    };

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const nowIso = new Date().toISOString();
          const newUpdate = {
            id: `su-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            status: newStatus,
            updatedBy: updaterName,
            authorityRole: roleAuthorityMap[activeRole],
            timestamp: nowIso,
            note,
          };
          return {
            ...r,
            status: newStatus,
            updatedAt: nowIso,
            statusUpdates: [...r.statusUpdates, newUpdate],
          };
        }
        return r;
      })
    );
  };

  // Mark notification read
  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  // Reset data handler
  const handleResetData = (emptyAll = false) => {
    const { reports: resetReports, notifications: resetNotifs } = resetDemoData(emptyAll);
    setReports(resetReports);
    setNotifications(resetNotifs);
    setMyReportIds(emptyAll ? [] : loadMyReportIds());
  };

  // If user is not authenticated, display the pristine Takshashila Login Page
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(role, userIdentifier) => {
          setActiveRole(role);
          setCurrentUser(userIdentifier);
          setIsAuthenticated(true);
        }}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030509] text-[#F5F7FA] flex flex-col font-sans relative">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        lang={lang}
        setLang={setLang}
        notifications={notifications}
        myReportCount={myReportIds.length}
        openSettingsModal={() => setSettingsOpen(true)}
        onOpenVoiceSOS={() => setVoiceSosOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeSection
            onStartReport={(cat) => {
              if (cat) setSubmitPrefillCategory(cat);
              setActiveTab('submit');
            }}
            onTrackReport={(prefillId) => {
              if (prefillId) setTrackPrefillId(prefillId);
              setActiveTab('track');
            }}
            onExploreEscalation={() => setActiveTab('escalation')}
            onSwitchRole={(r) => {
              setActiveRole(r);
              setActiveTab('authority');
            }}
            onOpenVoiceSOS={() => setVoiceSosOpen(true)}
            reports={reports}
            lang={lang}
          />
        )}

        {activeTab === 'submit' && (
          <SubmitComplaintSection
            initialCategory={submitPrefillCategory}
            existingReports={reports}
            onSubmitSuccess={(newReport) => {
              handleReportSubmitted(newReport);
            }}
            onTrackSubmitted={(reportId) => {
              setTrackPrefillId(reportId);
              setActiveTab('track');
            }}
            lang={lang}
          />
        )}

        {activeTab === 'track' && (
          <TrackReportSection
            reports={reports}
            prefilledId={trackPrefillId}
            lang={lang}
          />
        )}

        {activeTab === 'my-reports' && (
          <MyReportsSection
            reports={reports}
            myReportIds={myReportIds}
            onTrackReport={(id) => {
              setTrackPrefillId(id);
              setActiveTab('track');
            }}
            onNewReport={() => setActiveTab('submit')}
            lang={lang}
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityDashboard
            reports={reports}
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onOpenReportDetails={(report) => setDetailModalReport(report)}
            onOpenStatusUpdate={(report) => setStatusModalReport(report)}
            lang={lang}
          />
        )}

        {activeTab === 'escalation' && (
          <EscalationVisualizer
            reports={reports}
            onSimulateReport={handleSimulateReport}
            onTrackReport={(id) => {
              setTrackPrefillId(id);
              setActiveTab('track');
            }}
          />
        )}

        {activeTab === 'safe-zones' && (
          <SafeZonesSection
            onReportForZone={(zone) => {
              setSubmitPrefillCategory('offline');
              setActiveTab('submit');
            }}
            lang={lang}
          />
        )}

        {activeTab === 'guidelines' && (
          <SafetyGuidelinesSection lang={lang} />
        )}
      </main>

      {/* Global Modals */}
      <EmergencyVoiceSOSModal
        isOpen={voiceSosOpen}
        onClose={() => setVoiceSosOpen(false)}
        existingReports={reports}
        onSubmitSuccess={(newReport) => {
          handleReportSubmitted(newReport);
        }}
        onTrackSubmitted={(reportId) => {
          setTrackPrefillId(reportId);
          setActiveTab('track');
        }}
        lang={lang}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        lang={lang}
        setLang={setLang}
        onResetData={handleResetData}
        reportCount={reports.length}
      />

      <ReportDetailsModal
        report={detailModalReport}
        activeRole={activeRole}
        onClose={() => setDetailModalReport(null)}
        onOpenStatusUpdate={(rep) => setStatusModalReport(rep)}
      />

      <StatusUpdateModal
        report={statusModalReport}
        activeRole={activeRole}
        onClose={() => setStatusModalReport(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Interactive AI Safety Assistant Chatbot (Floating) */}
      <AIAssistantChatbot
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenVoiceSOS={() => setVoiceSosOpen(true)}
        onStartReport={(cat) => {
          if (cat) setSubmitPrefillCategory(cat);
          setActiveTab('submit');
        }}
        lang={lang}
      />

      {/* Mobile Floating Bottom Quick Bar (< sm screens) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#060D1E]/95 backdrop-blur-xl border-t border-[rgba(148,163,184,0.2)] px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'home' ? 'text-[#F5A623]' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('submit')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'submit' ? 'text-[#3B82F6]' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <span className="text-base">📝</span>
          <span>Report</span>
        </button>

        {/* Center Prominent SOS Button */}
        <button
          onClick={() => setVoiceSosOpen(true)}
          className="flex flex-col items-center justify-center -mt-4 w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-xl shadow-red-600/50 border-2 border-[#060D1E] active:scale-90 transition-transform animate-pulse"
          title="Voice SOS"
        >
          <span className="text-xs font-black">SOS</span>
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'track' ? 'text-[#3B82F6]' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <span className="text-base">🔍</span>
          <span>Track</span>
        </button>

        <button
          onClick={() => setActiveTab('safe-zones')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'safe-zones' ? 'text-[#10B981]' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <span className="text-base">📍</span>
          <span>Campus</span>
        </button>
      </nav>
    </div>
  );
}

