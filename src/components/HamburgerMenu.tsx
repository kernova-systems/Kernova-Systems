import React from 'react';

interface HamburgerMenuProps {
  className?: string;
  onClick?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  className = '',
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Navigation Menu"
      title="Menu"
      className={`fixed top-6 left-6 sm:top-8 sm:left-10 md:top-9 md:left-12 z-50 w-12 h-12 flex items-center justify-center cursor-pointer group focus:outline-none select-none transition-transform duration-150 active:scale-90 hover:scale-105 ${className}`}
    >
      {/* 4 Crisp, Generously Spaced Horizontal Lines */}
      <div className="flex flex-col justify-between w-8 sm:w-9 h-6 sm:h-[26px]">
        <span className="w-full h-[2px] bg-white rounded-full block mix-blend-difference transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm" />
        <span className="w-full h-[2px] bg-white rounded-full block mix-blend-difference transition-transform duration-200 group-hover:translate-x-1 shadow-sm" />
        <span className="w-full h-[2px] bg-white rounded-full block mix-blend-difference transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm" />
        <span className="w-full h-[2px] bg-white rounded-full block mix-blend-difference transition-transform duration-200 group-hover:translate-x-1 shadow-sm" />
      </div>
    </button>
  );
};
