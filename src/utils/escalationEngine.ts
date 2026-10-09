import {
  IncidentReport,
  AuthorityRole,
  ComplaintCategory,
  EscalationRecord,
  AuthorityNotification,
} from '../types';

/**
 * Normalizes text for deterministic key generation.
 * Strips special chars, converts to lowercase, trims whitespace.
 */
function normalizeKeyPart(text?: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

export interface MatchResult {
  matchGroupId: string;
  isNewGroup: boolean;
  matchReason: string;
  previousReportsInGroup: IncidentReport[];
  escalationLevel: 1 | 2 | 3;
  targetAuthority: AuthorityRole;
}

/**
 * Deterministic Matching Function
 * 
 * Rules:
 * 1. Suspect identification:
 *    - If suspect name/handle/phone is provided, and length > 2 chars,
 *      we create a deterministic key: `category:suspectIdentifier`.
 * 2. Location/Platform specific matching:
 *    - If no suspect is named, but there is a specific localized offline venue
 *      (e.g., "Hostel Block C") or online account identifier with incident type,
 *      we group by `category:incidentType:locationOrPlatform`.
 * 3. Insufficient details fallback:
 *    - If information is generic (e.g. "Campus", "Unknown", no suspect),
 *      we MUST NOT guess or silently merge unrelated students' complaints.
 *      Instead, we generate an isolated group key `isolated-${Date.now()}-${random}`.
 */
export function determineIncidentGroup(
  newReportDraft: {
    category: ComplaintCategory;
    type: string;
    locationOrPlatform: string;
    suspect?: {
      name?: string;
      department?: string;
      phone?: string;
      platformHandle?: string;
    };
    onlineAccountHandle?: string;
  },
  existingReports: IncidentReport[]
): MatchResult {
  const normCategory = newReportDraft.category;
  const suspectName = normalizeKeyPart(newReportDraft.suspect?.name);
  const suspectHandle = normalizeKeyPart(
    newReportDraft.suspect?.platformHandle || newReportDraft.onlineAccountHandle
  );
  const suspectPhone = normalizeKeyPart(newReportDraft.suspect?.phone);
  const normLocation = normalizeKeyPart(newReportDraft.locationOrPlatform);
  const normType = normalizeKeyPart(newReportDraft.type);

  let matchGroupId = '';
  let matchReason = '';

  // Case 1: Primary match on Suspect Identifier (Name or Handle or Phone)
  if (suspectName && suspectName.length >= 3) {
    matchGroupId = `cluster-suspect-${normCategory}-${suspectName}`;
    matchReason = `Matched suspect identifier "${newReportDraft.suspect?.name}" in ${normCategory} category`;
  } else if (suspectHandle && suspectHandle.length >= 3) {
    matchGroupId = `cluster-handle-${normCategory}-${suspectHandle}`;
    matchReason = `Matched online handle/account identifier "@${newReportDraft.suspect?.platformHandle || newReportDraft.onlineAccountHandle}"`;
  } else if (suspectPhone && suspectPhone.length >= 6) {
    matchGroupId = `cluster-phone-${normCategory}-${suspectPhone}`;
    matchReason = `Matched suspect contact identifier "${newReportDraft.suspect?.phone}"`;
  } 
  // Case 2: Matching specific offline campus location + specific incident type (if location is specific)
  else if (
    normCategory === 'offline' &&
    normLocation.length >= 5 &&
    !normLocation.includes('campus') &&
    !normLocation.includes('college')
  ) {
    matchGroupId = `cluster-venue-${normLocation}-${normType}`;
    matchReason = `Matched repeat venue "${newReportDraft.locationOrPlatform}" with incident pattern "${newReportDraft.type}"`;
  } 
  // Case 3: Insufficient information to establish correlation -> Standalone group
  else {
    const randomHex = Math.random().toString(36).substring(2, 7);
    matchGroupId = `isolated-${normCategory}-${Date.now()}-${randomHex}`;
    matchReason = 'Unique standalone report (insufficient overlapping suspect or venue details to safely cluster)';
  }

  // Find previous reports belonging to this group
  const previousReportsInGroup = existingReports.filter(
    (r) => r.matchGroupId === matchGroupId
  );

  const matchedCount = previousReportsInGroup.length;
  const isNewGroup = matchedCount === 0;

  // Escalation sequence:
  // 1st report -> HOD (Level 1)
  // 2nd report -> Dean (Level 2)
  // 3rd+ report -> Higher Authority (Level 3)
  let escalationLevel: 1 | 2 | 3 = 1;
  let targetAuthority: AuthorityRole = 'HOD';

  if (matchedCount === 0) {
    escalationLevel = 1;
    targetAuthority = 'HOD';
  } else if (matchedCount === 1) {
    escalationLevel = 2;
    targetAuthority = 'Dean';
  } else {
    escalationLevel = 3;
    targetAuthority = 'Higher Authority';
  }

  return {
    matchGroupId,
    isNewGroup,
    matchReason,
    previousReportsInGroup,
    escalationLevel,
    targetAuthority,
  };
}

/**
 * Creates notification for the targeted authority queue.
 * Complies with requirement: Generic non-sensitive notification copy.
 */
export function createEscalationNotification(
  reportId: string,
  targetAuthority: AuthorityRole,
  level: 1 | 2 | 3,
  isRepeatIncident: boolean
): AuthorityNotification {
  const message = isRepeatIncident
    ? `Repeated incident pattern detected. Report ${reportId} automatically escalated to ${targetAuthority} (Tier ${level}).`
    : `A new complaint (${reportId}) has been assigned to ${targetAuthority} queue for review.`;

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    reportId,
    targetRole: targetAuthority,
    escalationLevel: level,
    message,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

/**
 * Generates initial escalation history record
 */
export function buildEscalationRecord(
  level: 1 | 2 | 3,
  authority: AuthorityRole,
  occurrenceNumber: number,
  reason: string
): EscalationRecord {
  return {
    level,
    authority,
    timestamp: new Date().toISOString(),
    matchedIncidentCount: occurrenceNumber,
    reason:
      occurrenceNumber === 1
        ? 'First incident logged. Assigned to Department HOD.'
        : occurrenceNumber === 2
        ? `Repeat incident #2 detected (${reason}). Escalated to Dean of Student Welfare.`
        : `Critical escalation #3+ detected (${reason}). Escalated to Higher Authority Disciplinary Board.`,
  };
}
