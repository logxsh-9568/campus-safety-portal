export type ComplaintCategory = 'offline' | 'online';

export type AuthorityRole = 'HOD' | 'Dean' | 'Higher Authority';

export type UserRole = 'student' | 'hod' | 'dean' | 'higher_authority';

export type ComplaintStatus = 'submitted' | 'under_review' | 'action_in_progress' | 'escalated' | 'resolved';

export type UrgencyLevel = 'normal' | 'high' | 'critical';

export interface ReporterDetails {
  name?: string;
  studentId?: string;
  department?: string;
  email?: string;
  phone?: string;
}

export interface SuspectDetails {
  name?: string;
  department?: string;
  phone?: string;
  platformHandle?: string;
  otherDetails?: string;
}

export interface EvidenceAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl?: string;
}

export interface EscalationRecord {
  level: 1 | 2 | 3;
  authority: AuthorityRole;
  timestamp: string;
  reason: string;
  matchedIncidentCount: number;
}

export interface StatusUpdateRecord {
  id: string;
  status: ComplaintStatus;
  updatedBy: string;
  authorityRole: AuthorityRole | 'System';
  timestamp: string;
  note: string;
}

export interface IncidentReport {
  id: string;
  category: ComplaintCategory;
  isAnonymous: boolean;
  reporter?: ReporterDetails;
  
  // Incident Data
  date: string;
  approxTime: string;
  type: string; // e.g., 'Physical Ragging', 'Cyber Bullying', etc.
  description: string;
  locationOrPlatform: string;
  onlineAccountHandle?: string;
  onlineUrl?: string;
  isOngoing: boolean;
  urgency: UrgencyLevel;
  
  // Suspect Data
  suspect?: SuspectDetails;
  
  // Evidence
  evidence?: EvidenceAttachment;
  
  // Deterministic Matching & Escalation
  matchGroupId: string;
  matchReason: string;
  escalationLevel: 1 | 2 | 3;
  currentAuthority: AuthorityRole;
  escalationHistory: EscalationRecord[];
  
  // Workflow Status
  status: ComplaintStatus;
  statusUpdates: StatusUpdateRecord[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  isDemoSample?: boolean;

  // Urgent Voice SOS & Live Geolocation
  isVoiceEmergency?: boolean;
  voiceTranscript?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  };
  audioRecordingUrl?: string;
}

export interface AuthorityNotification {
  id: string;
  reportId: string;
  targetRole: AuthorityRole;
  escalationLevel: 1 | 2 | 3;
  message: string;
  timestamp: string;
  read: boolean;
}
