import React, { useState } from 'react';
import {
  MapPin,
  Shield,
  PhoneCall,
  Video,
  Sun,
  Compass,
  ArrowRight,
  ExternalLink,
  Building2,
  CheckCircle2,
  Navigation,
  FileText,
  Clock,
  Radio,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { TAKSHASHILA_BLOCKS, TAKSHASHILA_CAMPUS_INFO, CampusBlock } from '../utils/takshashilaAssets';

interface SafeZonesSectionProps {
  onReportForZone: (zoneName: string) => void;
  lang: Language;
}

export const SafeZonesSection: React.FC<SafeZonesSectionProps> = ({
  onReportForZone,
  lang,
}) => {
  const t = translations[lang] || translations.en;
  const [selectedBlock, setSelectedBlock] = useState<CampusBlock>(TAKSHASHILA_BLOCKS[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'academic' | 'hostel' | 'facility' | 'security'>('all');

  const filteredBlocks = activeCategory === 'all'
    ? TAKSHASHILA_BLOCKS
    : TAKSHASHILA_BLOCKS.filter((b) => b.category === activeCategory);

  return (
    <div className="space-y-8 pb-16">
      {/* Header with University Location Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(148,163,184,0.15)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-[#F5A623] border border-[#F5A623]/30">
              150-Acre Campus Infrastructure
            </span>
            <span className="text-xs text-[#AAB3C2] font-mono">Tindivanam Taluk, Ongur 604305</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 flex items-center gap-2">
            <Compass className="w-7 h-7 text-[#F5A623]" />
            <span>Takshashila Campus Safe Zones & Security Network</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#AAB3C2] mt-1">
            Real-time security coverage, emergency SOS call kiosks, CCTV camera hubs, and safe night-corridor routes across all university schools.
          </p>
        </div>

        {/* Live Google Maps Direction Trigger */}
        <div className="flex items-center gap-2">
          <a
            href={TAKSHASHILA_CAMPUS_INFO.gpsCoordinates.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A1422] hover:bg-[#071426] border border-[#F5A623]/40 hover:border-[#F5A623] text-xs font-bold text-white transition-all shadow-md"
          >
            <Navigation className="w-4 h-4 text-[#F5A623]" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#AAB3C2]" />
          </a>
        </div>
      </div>

      {/* Campus GPS Coordinates & Rapid Highway Post Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121A3A] via-[#0A1422] to-[#121A3A] border border-[rgba(148,163,184,0.2)] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#F5A623]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {TAKSHASHILA_CAMPUS_INFO.name} — Main GST Road Gate
            </h3>
            <p className="text-xs text-[#AAB3C2]">
              {TAKSHASHILA_CAMPUS_INFO.address} (GPS: 12.2359° N, 79.7431° E)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[rgba(148,163,184,0.15)] text-center">
            <span className="text-[10px] text-[#AAB3C2] block font-mono">CAMPUS CONTROL ROOM</span>
            <span className="font-bold text-[#F5A623]">{TAKSHASHILA_CAMPUS_INFO.helpline.campusControlRoom}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[rgba(148,163,184,0.15)] text-center">
            <span className="text-[10px] text-[#AAB3C2] block font-mono">CHIEF PROCTOR / SECURITY</span>
            <span className="font-bold text-white">{TAKSHASHILA_CAMPUS_INFO.helpline.chiefSecurityOfficer}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Campus Blocks (9)' },
          { id: 'academic', label: 'Academic & Schools' },
          { id: 'hostel', label: 'Student Hostels' },
          { id: 'facility', label: 'Library & Facilities' },
          { id: 'security', label: 'Security & Gates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-blue-600/20 text-[#3B82F6] border border-blue-500/40 shadow-sm'
                : 'bg-[#080B12] text-[#AAB3C2] hover:text-white border border-[rgba(148,163,184,0.15)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Blocks Grid & Interactive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Gallery of Blocks Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredBlocks.map((block) => {
            const isSelected = selectedBlock.id === block.id;
            return (
              <div
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                className={`group rounded-2xl bg-[#0A1422] border overflow-hidden transition-all cursor-pointer flex flex-col justify-between shadow-lg ${
                  isSelected
                    ? 'border-[#F5A623] shadow-amber-500/15 ring-1 ring-[#F5A623]'
                    : 'border-[rgba(148,163,184,0.18)] hover:border-white/40'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#060A14]">
                  <img
                    src={block.image}
                    alt={block.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1422] via-transparent to-black/30"></div>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#030509]/80 text-[#F5A623] border border-[#F5A623]/30 backdrop-blur-sm">
                    {block.code}
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-[#21E6A8] border border-emerald-500/30 backdrop-blur-sm">
                    {block.cctvCount} CCTV Nodes
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#F5A623] transition-colors leading-snug">
                      {block.name}
                    </h3>
                    <p className="text-[11px] text-[#AAB3C2] mt-1 line-clamp-2 leading-relaxed">
                      {block.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[rgba(148,163,184,0.12)] flex items-center justify-between text-[11px]">
                    <span className="text-white/80 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#21E6A8]" />
                      <span>{block.safetyRating.split(' - ')[0]}</span>
                    </span>
                    <span className="text-[#3B82F6] font-semibold flex items-center gap-0.5">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Selected Block Inspector Card */}
        <div className="lg:col-span-5 rounded-3xl bg-[#071224] border border-[rgba(148,163,184,0.25)] p-5 sm:p-6 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* Selected Block Photo Preview */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[rgba(148,163,184,0.2)] bg-[#030509]">
              <img
                src={selectedBlock.image}
                alt={selectedBlock.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071224] via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/40">
                  {selectedBlock.code} • {selectedBlock.category.toUpperCase()}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white mt-1">
                  {selectedBlock.name}
                </h2>
                <p className="text-[11px] text-amber-200/90 font-medium">
                  {selectedBlock.tamilName}
                </p>
              </div>
            </div>

            {/* Asset checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.12)] flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Campus Location Details</span>
                  <span className="text-[#AAB3C2]">{selectedBlock.locationDetails}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.12)] flex items-start gap-3">
                <Radio className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-bold text-white block">Dedicated Emergency Call Booth</span>
                  <span className="text-red-300 font-medium">{selectedBlock.emergencyBooth}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.12)] flex items-start gap-3">
                <Video className="w-4 h-4 text-[#21E6A8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">24/7 CCTV Camera Coverage</span>
                  <span className="text-[#AAB3C2]">{selectedBlock.cctvCount} High-Definition Monitored Cameras</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.12)] flex items-start gap-3">
                <PhoneCall className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Officer In-Charge & Direct Hotline</span>
                  <span className="text-[#AAB3C2]">{selectedBlock.securityInCharge} ({selectedBlock.contactNumber})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#080B12] border border-[rgba(148,163,184,0.12)] space-y-1">
                <span className="font-bold text-white block">Campus Safe Pathway Protocol</span>
                <p className="text-[11px] text-[#AAB3C2] leading-relaxed">
                  {selectedBlock.description} Security personnel are stationed 24/7 with emergency vehicle rapid escort upon request.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onReportForZone(selectedBlock.name)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F5A623] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071224] font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>File Confidential Report for {selectedBlock.code}</span>
            </button>

            <a
              href={`https://www.google.com/maps?q=${selectedBlock.gpsCoordinates.lat},${selectedBlock.gpsCoordinates.lng}+(${encodeURIComponent(selectedBlock.name)})`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#080B12] hover:bg-black border border-[rgba(148,163,184,0.2)] text-[#AAB3C2] hover:text-white font-semibold text-xs transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>View Block Coordinates on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
