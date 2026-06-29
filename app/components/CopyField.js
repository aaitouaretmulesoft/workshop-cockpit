'use client';

import { useState } from 'react';

export default function CopyField({ label, value, mono = false }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked — silent
    }
  }

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-cloud-40">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div
          className={`flex-1 truncate rounded border border-cloud-80 bg-cloud-95/60 px-3 py-2 text-electric-15 ${
            mono ? 'font-mono text-[15px]' : 'font-mono text-[15px]'
          }`}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copier ${label}`}
          className="rounded-pill border border-electric-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-electric-50 transition hover:bg-electric-50 hover:text-white"
        >
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
    </div>
  );
}
