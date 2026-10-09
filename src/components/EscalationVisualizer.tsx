import React, { useState } from 'react';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Building2,
  Globe2,
  Users,
  Sparkles,
  RefreshCw,
  EyeOff,
  Scale,
  Play,
} from 'lucide-react';
import { IncidentReport } from '../types';
import { determineIncidentGroup } from '../utils/escalationEngine';

interface EscalationVisualizerProps {
  reports: IncidentReport[];
  onSimulateReport: (
    category: 'offline' | 'online',
    suspectName: string,
    venueOrPlatform: string,
    desc: string
  ) => void;
  onTrackReport: (id: string) => void;
}

export const EscalationVisualizer: React.FC<EscalationVisualizerProps> = ({
  reports,
  onSimulateReport,
  onTrackReport,
}) => {
  const [testSuspect, setTestSuspect] = useState('Karthik V');
  const [testCategory, setTestCategory] = useState<'offline' | 'online'>('offline');
  const [testVenue, setTestVenue] = useState('Hostel Block C');

  // Group existing reports by matchGroupId to show active clusters
  const clusters: Record<string, IncidentReport[]> = {};
  reports.forEach((r) => {
    if (!clusters[r.matchGroupId]) {
      clusters[r.matchGroupId] = [];
    }
    clusters[r.matchGroupId].push(r);
  });

  // Calculate preview of what would happen if a report with testSuspect is submitted right now
  const simulationPreview = determineIncidentGroup(
    {
      category: testCategory,
      type: 'Physical Harassment',
      locationOrPlatform: testVenue,
      suspect: { name: testSuspect },
    },
    reports
  );

  const currentCountForTest = simulationPreview.previousReportsInGroup.length;
  const nextOccurrence = currentCountForTest + 1;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitFork className="w-6 h-6 text-[#3B82F6]" />
            <span>Deterministic Escalation Engine & Cluster Matrix</span>
          </h1>
          <p className="text-xs text-[#AAB3C2] mt-1">
            Real-time visual inspection of the multi-tier escalation state machine and incident grouping.
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs px-3 py-1 rounded-full font-mono bg-[#21E6A8]/10 text-[#21E6A8] border border-[#21E6A8]/30">
          State Machine: 1st → HOD | 2nd → Dean | 3rd → Higher Auth
        </span>
      </div>

      {/* 3-Tier State Flow Visualizer */}
      <div className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F5D547]" />
          <span>Automated Progression Logic</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Node 1 */}
          <div className="rounded-xl bg-[#080B12] border border-blue-500/40 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-[#3B82F6] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-[#3B82F6]">
                FIRST INCIDENT
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Tier 1: HOD Queue</h3>
            <p className="text-xs text-[#AAB3C2] leading-relaxed">
              Assigned directly to Department Head. Victim identity strictly masked to protect from academic or hostel bias.
            </p>
            <div className="pt-2 border-t border-[rgba(148,163,184,0.1)] text-[11px] text-[#21E6A8] flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Victim details hidden</span>
            </div>
          </div>

          {/* Node 2 */}
          <div className="rounded-xl bg-[#080B12] border border-amber-500/40 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-[#F5D547] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-[#F5D547]">
                SECOND INCIDENT
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Tier 2: Dean Escalation</h3>
            <p className="text-xs text-[#AAB3C2] leading-relaxed">
              Repeat pattern detected across suspect or localized venue. Automatically escalates to Dean of Student Welfare.
            </p>
            <div className="pt-2 border-t border-[rgba(148,163,184,0.1)] text-[11px] text-[#21E6A8] flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Victim details hidden</span>
            </div>
          </div>

          {/* Node 3 */}
          <div className="rounded-xl bg-[#080B12] border border-purple-500/40 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                THIRD+ INCIDENT
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Tier 3: Higher Authority</h3>
            <p className="text-xs text-[#AAB3C2] leading-relaxed">
              Critical multi-repeat threshold reached. Bypasses lower queues to convene Higher Disciplinary Board.
            </p>
            <div className="pt-2 border-t border-[rgba(148,163,184,0.1)] text-[11px] text-purple-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Full authorized dossier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Escalation Simulator (For Judges & Evaluators) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#071426] via-[#0A1422] to-[#071426] border border-[#3B82F6]/40 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-[#21E6A8]" />
              <span>Interactive Incident Simulator</span>
            </h2>
            <p className="text-xs text-[#AAB3C2]">
              Test how new reports update cluster counts and automatically transition tiers.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded bg-[#080B12] text-[#F5D547] border border-[rgba(148,163,184,0.2)]">
            Active Cluster: {simulationPreview.matchGroupId}
          </span>
        </div>

        {/* Simulator Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-[#AAB3C2] mb-1">Target Suspect Name</label>
            <input
              type="text"
              value={testSuspect}
              onChange={(e) => setTestSuspect(e.target.value)}
              placeholder="e.g. Karthik V"
              className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#AAB3C2] mb-1">Category</label>
            <select
              value={testCategory}
              onChange={(e) => setTestCategory(e.target.value as 'offline' | 'online')}
              className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="offline">Offline Ragging</option>
              <option value="online">Online Ragging</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#AAB3C2] mb-1">Campus Location / Platform</label>
            <input
              type="text"
              value={testVenue}
              onChange={(e) => setTestVenue(e.target.value)}
              placeholder="e.g. Hostel Block C"
              className="w-full bg-[#080B12] border border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>
        </div>

        {/* Live Predictor Banner */}
        <div className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.2)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#AAB3C2]">Prior matching reports in database:</span>
              <span className="font-mono font-bold text-white text-sm">
                {currentCountForTest}
              </span>
            </div>
            <p className="text-xs text-[#AAB3C2]">
              Next submission will be{' '}
              <strong className="text-white">Occurrence #{nextOccurrence}</strong> → Routed to{' '}
              <strong
                className={
                  simulationPreview.escalationLevel === 1
                    ? 'text-[#3B82F6]'
                    : simulationPreview.escalationLevel === 2
                    ? 'text-[#F5D547]'
                    : 'text-purple-400'
                }
              >
                {simulationPreview.targetAuthority} (Tier {simulationPreview.escalationLevel})
              </strong>
            </p>
          </div>

          {/* Trigger Button */}
          <button
            onClick={() =>
              onSimulateReport(
                testCategory,
                testSuspect,
                testVenue,
                `Simulated occurrence #${nextOccurrence} involving ${testSuspect} at ${testVenue}.`
              )
            }
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-[#F5D547]" />
            <span>Dispatch Report #{nextOccurrence}</span>
          </button>
        </div>
      </div>

      {/* Active Incident Clusters Table */}
      <div className="rounded-2xl bg-[#0A1422] border border-[rgba(148,163,184,0.18)] p-6 space-y-5 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#3B82F6]" />
            <span>Active Deterministic Incident Clusters in Storage</span>
          </div>
          <span className="text-xs font-mono text-[#AAB3C2]">
            {Object.keys(clusters).length} Active Clusters
          </span>
        </h2>

        <div className="space-y-4">
          {Object.entries(clusters).map(([groupId, groupReports]) => {
            const maxTier = Math.max(...groupReports.map((r) => r.escalationLevel));
            const firstReport = groupReports[0];

            return (
              <div
                key={groupId}
                className="rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(148,163,184,0.1)] pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#3B82F6] block">
                      {groupId}
                    </span>
                    <span className="text-xs text-[#AAB3C2] mt-0.5 block">
                      {firstReport.matchReason}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#0A1422] text-white border border-[rgba(148,163,184,0.2)]">
                      {groupReports.length} {groupReports.length === 1 ? 'Report' : 'Repeat Reports'}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        maxTier === 1
                          ? 'bg-blue-500/15 text-[#3B82F6]'
                          : maxTier === 2
                          ? 'bg-amber-500/15 text-[#F5D547]'
                          : 'bg-purple-500/15 text-purple-400'
                      }`}
                    >
                      Highest: Tier {maxTier}
                    </span>
                  </div>
                </div>

                {/* Sub-reports in this cluster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                  {groupReports.map((r, idx) => (
                    <div
                      key={r.id}
                      onClick={() => onTrackReport(r.id)}
                      className="p-2.5 rounded-lg bg-[#0A1422] hover:bg-[#071426] border border-[rgba(148,163,184,0.15)] text-xs cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white">{r.id}</span>
                        <span className="text-[10px] text-[#AAB3C2]">
                          #{idx + 1} ({r.currentAuthority})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#AAB3C2] truncate">
                        {r.type} • {r.locationOrPlatform}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
