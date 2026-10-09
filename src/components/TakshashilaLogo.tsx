import React from 'react';

// Official Takshashila University Circular Emblem (renders exact official brand graphic)
export const TakshashilaEmblemIcon: React.FC<{ size?: number | string; className?: string }> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white ${className}`}
    >
      <img
        src="/takshashila_logo.png"
        alt="Takshashila University Emblem"
        className="w-full h-full object-contain p-0.5"
        loading="eager"
      />
    </div>
  );
};

interface TakshashilaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const TakshashilaLogo: React.FC<TakshashilaLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-16 sm:h-20',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Takshashila University Logo with white protective pill */}
      <div className="flex items-center bg-white/95 px-2.5 py-1 rounded-xl shadow-md shadow-orange-500/15 border border-[#E25822]/40 hover:scale-102 transition-transform">
        <img
          src="/takshashila_logo.png"
          alt="Takshashila University"
          className={`${heights[size]} w-auto max-w-[170px] sm:max-w-[200px] object-contain shrink-0`}
          loading="eager"
        />
      </div>

      {/* Campus Sub-badge & Cell details */}
      <div className="hidden sm:flex flex-col justify-center text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md bg-[#E25822]/20 text-[#F5A623] border border-[#E25822]/40 font-bold uppercase whitespace-nowrap">
            Ongur Campus
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-[#94A3B8] font-medium leading-none mt-1 whitespace-nowrap">
            Safety & Anti-Ragging Portal
          </span>
        )}
      </div>
    </div>
  );
};
