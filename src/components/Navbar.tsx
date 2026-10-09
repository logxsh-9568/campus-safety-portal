import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  Search,
  FolderLock,
  LayoutDashboard,
  GitFork,
  MapPin,
  BookOpen,
  Globe,
  Settings,
  Radio,
  ChevronDown,
  PhoneCall,
  Menu,
  X,
  Shield,
  ArrowRight,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { UserRole, AuthorityRole, AuthorityNotification } from '../types';
import { Language, translations, supportedLanguages } from '../utils/i18n';
import { TakshashilaLogo } from './TakshashilaLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  notifications: AuthorityNotification[];
  myReportCount: number;
  openSettingsModal: () => void;
  onOpenVoiceSOS: () => void;
  onLogout?: () => void;
  currentUser?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  lang,
  setLang,
  notifications,
  myReportCount,
  openSettingsModal,
  onOpenVoiceSOS,
  onLogout,
  currentUser,
}) => {
  const t = translations[lang] || translations.en;
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate unread notifications for current role
  const unreadCount = notifications.filter((n) => {
    if (activeRole === 'student') return false;
    const targetMap: Record<UserRole, AuthorityRole | null> = {
      student: null,
      hod: 'HOD',
      dean: 'Dean',
      higher_authority: 'Higher Authority',
    };
    return n.targetRole === targetMap[activeRole] && !n.read;
  }).length;

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string; ring: string }> = {
    student: {
      label: 'Student View',
      badge: 'Confidential Reporter',
      color: 'bg-emerald-500/10 text-[#10B981] border-emerald-500/30',
      ring: 'ring-emerald-500/30',
    },
    hod: {
      label: 'HOD View',
      badge: 'Tier 1 Reviewer (Redacted)',
      color: 'bg-blue-500/10 text-[#3B82F6] border-blue-500/30',
      ring: 'ring-blue-500/30',
    },
    dean: {
      label: 'Dean View',
      badge: 'Tier 2 Escalation (Redacted)',
      color: 'bg-amber-500/10 text-[#F5A623] border-amber-500/30',
      ring: 'ring-amber-500/30',
    },
    higher_authority: {
      label: 'Higher Authority',
      badge: 'Tier 3 Board (Full File)',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      ring: 'ring-purple-500/30',
    },
  };

  const navItems = [
    { id: 'home', label: 'Overview', icon: ShieldAlert },
    { id: 'submit', label: 'Report Incident', icon: FileText, highlight: true },
    { id: 'track', label: 'Track Case', icon: Search },
    {
      id: 'my-reports',
      label: 'My Reports',
      icon: FolderLock,
      badge: myReportCount > 0 ? myReportCount : null,
    },
    {
      id: 'authority',
      label: 'Authority Portal',
      icon: LayoutDashboard,
      badge: unreadCount > 0 ? `${unreadCount} new` : null,
      badgeColor: 'bg-red-500/90 text-white',
    },
    { id: 'escalation', label: 'Escalation', icon: GitFork },
    { id: 'safe-zones', label: 'Safe Zones', icon: MapPin },
    { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
  ];

  const currentLangObj = supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(148,163,184,0.14)] bg-[#030712]/92 backdrop-blur-xl">
      {/* Top Controls Bar */}
      <div className="bg-[#060D1E]/95 border-b border-[rgba(148,163,184,0.1)] px-3 sm:px-6 py-1.5 text-xs text-[#94A3B8] flex items-center justify-between gap-2">
        {/* Left Status Indicator */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-[#10B981] font-semibold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="hidden sm:inline">Takshashila University • 24/7 Rapid Safety & Anti-Ragging Cell</span>
            <span className="sm:hidden">Takshashila Safety Cell</span>
          </span>
        </div>

        {/* Right Controls: Helpline + Role + Language + Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Helpline Pill */}
          <a
            href="tel:09297623456"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-[#F5A623] border border-amber-500/30 text-[11px] font-bold transition-all"
            title="Takshashila Rapid Safety Helpline"
          >
            <PhoneCall className="w-3 h-3 text-[#F5A623]" />
            <span className="font-mono">092976 23456</span>
          </a>

          {/* Demonstration Role Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-[#0A1428] px-2 py-0.5 rounded-lg border border-[rgba(148,163,184,0.18)]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as UserRole)}
              className="bg-transparent text-[11px] font-semibold text-white focus:outline-none cursor-pointer"
              aria-label="Switch demonstration role"
            >
              <option value="student" className="bg-[#0A1428] text-white">Student (Reporter)</option>
              <option value="hod" className="bg-[#0A1428] text-white">HOD (Tier 1 Redacted)</option>
              <option value="dean" className="bg-[#0A1428] text-white">Dean (Tier 2 Redacted)</option>
              <option value="higher_authority" className="bg-[#0A1428] text-white">Disciplinary Board (Full)</option>
            </select>
          </div>

          {/* 12+ Multi-Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0A1428] hover:bg-[#0E1A33] border border-[rgba(148,163,184,0.2)] text-[11px] font-semibold text-white transition-colors cursor-pointer"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="hidden sm:inline">{currentLangObj.flag} {currentLangObj.nativeName}</span>
              <span className="sm:hidden">{currentLangObj.flag}</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-52 max-h-80 overflow-y-auto z-40 rounded-2xl bg-[#081022] border border-[rgba(148,163,184,0.25)] shadow-2xl p-1.5 space-y-0.5 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] border-b border-[rgba(148,163,184,0.1)] mb-1 flex items-center justify-between">
                    <span>12 Regional Languages</span>
                    <Sparkles className="w-3 h-3 text-[#F5A623]" />
                  </div>
                  {supportedLanguages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                        lang === item.code
                          ? 'bg-blue-600/25 text-[#3B82F6] font-bold border border-blue-500/30'
                          : 'text-[#F1F5F9] hover:bg-[#0D1B36]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{item.flag}</span>
                        <span>{item.nativeName}</span>
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">{item.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Settings */}
          <button
            onClick={openSettingsModal}
            className="p-1 text-[#94A3B8] hover:text-white hover:bg-[#0A1428] rounded-lg transition-colors cursor-pointer"
            title="Settings & Reset"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2 py-0.5 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 border border-[rgba(148,163,184,0.15)] hover:border-red-500/30 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
              title="Sign Out to Login Page"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer group select-none shrink-0"
          >
            <TakshashilaLogo size="md" />
          </div>

          {/* Desktop Navigation Tabs (Compact Single Line Pills) */}
          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    item.highlight && !isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-[#3B82F6] border border-blue-500/30 hover:bg-blue-600/30 shadow-sm'
                      : isActive
                      ? 'bg-gradient-to-r from-[#E25822]/20 to-[#F5A623]/20 text-white border border-[#E25822]/50 shadow-md shadow-orange-500/10'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#091224]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#F5A623]' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        item.badgeColor || 'bg-[#3B82F6]/25 text-[#3B82F6]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Voice SOS & Mobile Menu Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Urgent Voice SOS Button */}
            <button
              onClick={onOpenVoiceSOS}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/35 border border-red-400/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
              title="Urgent Voice Complaint & Location Auto-Track"
            >
              <Radio className="w-4 h-4 animate-spin shrink-0" />
              <span className="tracking-wide uppercase font-extrabold text-[11px]">Voice SOS</span>
            </button>

            {/* Active Role Indicator (Desktop) */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold tracking-wide ${
                roleLabels[activeRole].color
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>{roleLabels[activeRole].label}</span>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[#0A1428] hover:bg-[#0E1A33] border border-[rgba(148,163,184,0.2)] text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tablet / Medium Screen Horizontal Scrollable Tabs */}
        <div className="hidden lg:flex xl:hidden items-center gap-1.5 overflow-x-auto py-2 scrollbar-none border-t border-[rgba(148,163,184,0.1)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E25822]/20 text-[#F5A623] border border-[#E25822]/40'
                    : 'text-[#94A3B8] hover:text-white bg-[#0A1428]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-blue-500/20 text-[#3B82F6]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation (Slide-over for phones) */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[88px] z-50 bg-[#030712]/95 backdrop-blur-2xl p-4 overflow-y-auto border-t border-[rgba(148,163,184,0.2)] animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-4 max-w-lg mx-auto">
            {/* Mobile Demonstration Role Switcher */}
            <div className="p-3.5 rounded-2xl bg-[#0A1428] border border-[rgba(148,163,184,0.15)] space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Demonstration Portal Role
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['student', 'hod', 'dean', 'higher_authority'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setActiveRole(r);
                      if (r !== 'student') setActiveTab('authority');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between ${
                      activeRole === r
                        ? `${roleLabels[r].color} border shadow-sm`
                        : 'bg-[#060D1E] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>{roleLabels[r].label}</span>
                    {activeRole === r && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E25822]/20 to-[#F5A623]/20 text-white border border-[#E25822]/50 shadow-md'
                        : 'bg-[#0A1428] text-[#94A3B8] hover:text-white hover:bg-[#0E1A33] border border-[rgba(148,163,184,0.1)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-[#E25822]/30 text-[#F5A623]' : 'bg-[#060D1E] text-[#94A3B8]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                        {item.badge}
                      </span>
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Helpline Emergency Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0A1428] to-amber-950/30 border border-red-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                  24/7 Security Hotline
                </div>
                <div className="text-sm font-black text-white">092976 23456</div>
              </div>
              <a
                href="tel:09297623456"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
