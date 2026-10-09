import { IncidentReport, AuthorityNotification, UserRole } from '../types';
import { INITIAL_DEMO_REPORTS, INITIAL_NOTIFICATIONS } from './initialData';

const REPORTS_KEY = 'aegis_campus_reports_v2';
const NOTIFICATIONS_KEY = 'aegis_campus_notifications_v2';
const MY_REPORTS_KEY = 'aegis_campus_my_submissions_v2';

export function loadReports(): IncidentReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      saveReports(INITIAL_DEMO_REPORTS);
      return INITIAL_DEMO_REPORTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_REPORTS;
  } catch (e) {
    console.error('Error loading reports from localStorage:', e);
    return INITIAL_DEMO_REPORTS;
  }
}

export function saveReports(reports: IncidentReport[]): void {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.warn('Storage quota exceeded or error occurred, trimming heavy payloads and retrying...', e);
    try {
      // Strip dataUrls from older reports to free up space
      const lightReports = reports.map((r, idx) => {
        if (idx > 1 && r.evidence?.dataUrl && r.evidence.dataUrl.length > 50000) {
          return {
            ...r,
            evidence: {
              ...r.evidence,
              dataUrl: undefined,
            },
          };
        }
        return r;
      });
      localStorage.setItem(REPORTS_KEY, JSON.stringify(lightReports));
    } catch (innerErr) {
      console.error('Failed to save reports even after trimming:', innerErr);
    }
  }
}


export function loadNotifications(): AuthorityNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      saveNotifications(INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
  } catch (e) {
    console.error('Error loading notifications:', e);
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AuthorityNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
}

export function loadMyReportIds(): string[] {
  try {
    const raw = localStorage.getItem(MY_REPORTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMyReportId(id: string): void {
  try {
    const current = loadMyReportIds();
    if (!current.includes(id)) {
      const updated = [id, ...current];
      localStorage.setItem(MY_REPORTS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Error saving my report ID:', e);
  }
}

export function resetDemoData(emptyAll = false): {
  reports: IncidentReport[];
  notifications: AuthorityNotification[];
} {
  const reports = emptyAll ? [] : INITIAL_DEMO_REPORTS;
  const notifications = emptyAll ? [] : INITIAL_NOTIFICATIONS;
  saveReports(reports);
  saveNotifications(notifications);
  if (emptyAll) {
    localStorage.removeItem(MY_REPORTS_KEY);
  }
  return { reports, notifications };
}

/**
 * Privacy Filter & Redaction Engine
 * 
 * Enforces role-based data shielding at the object level before rendering.
 */
export function getRoleViewReport(report: IncidentReport, activeRole: UserRole): IncidentReport {
  // Deep clone to prevent mutations
  const clone: IncidentReport = JSON.parse(JSON.stringify(report));

  if (activeRole === 'higher_authority') {
    // Higher Authority view: Can view full details for level 3 or authorized cases.
    // If report was anonymous, reporter is genuinely undefined.
    return clone;
  }

  if (activeRole === 'hod' || activeRole === 'dean') {
    // HOD & Dean: Strictly redact victim identity!
    if (clone.reporter) {
      clone.reporter = {
        name: '████████ [CONFIDENTIAL VICTIM IDENTITY REDACTED]',
        department: '████████ [PROTECTED]',
        studentId: '████████',
        email: '████████@campus.edu',
        phone: '██████████',
      };
    }
    return clone;
  }

  // Student / Public tracking view:
  // Never reveal victim identity or suspect contact info or raw internal evidence
  if (clone.reporter) {
    clone.reporter = {
      name: '[Confidential]',
      department: '[Confidential]',
    };
  }
  if (clone.suspect) {
    clone.suspect = {
      name: clone.suspect.name || 'Anonymous Suspect',
      department: clone.suspect.department,
      platformHandle: clone.suspect.platformHandle,
      // Phone is redacted in public tracking
      phone: undefined,
      otherDetails: undefined,
    };
  }
  // Public tracking hides full evidence binary
  if (clone.evidence) {
    clone.evidence = {
      fileName: clone.evidence.fileName,
      fileType: clone.evidence.fileType,
      fileSize: clone.evidence.fileSize,
      dataUrl: undefined, // no public preview
    };
  }

  return clone;
}
