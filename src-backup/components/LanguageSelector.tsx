'use client';
import { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { useGeo } from '@/lib/geo';

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const geo = useGeo();
  const ref = useRef<HTMLDivElement>(null);
  const current = SUPPORTED_LANGUAGES.find(l => l.code === geo.language) || SUPPORTED_LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:bg-[#1E1B4B] transition-colors border border-transparent hover:border-[#3d3580]"
      >
        <span className="text-base">{current.flag}</span>
        <span className="font-medium">{current.code.toUpperCase()}</span>
        <span className="text-[8px]">▼</span>
      </button>
      {open && (
        <div className="absolute top-9 right-0 bg-[#1E1B4B] border border-[#3d3580] rounded-lg py-1 min-w-[150px] shadow-2xl z-[100]">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { geo.setLanguage(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2.5 hover:bg-[#2a2a4a] transition-colors ${lang.code === current.code ? 'text-[#F59E0B] bg-[#2a2a4a]/50' : 'text-[#c8c4e0]'}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === current.code && <span className="ml-auto text-[#F59E0B]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
