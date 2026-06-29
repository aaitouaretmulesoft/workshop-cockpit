'use client';

import { useState } from 'react';

export default function CopyField({ label, value }) {
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cloud-40">
        {label}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex-1 truncate rounded-md border border-cloud-80 bg-cloud-95/40 px-3 py-2 font-mono text-[14px] text-electric-15">
          {value}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copier ${label}`}
          className="rounded-pill border border-cloud-80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-electric-50 transition hover:border-electric-50 hover:bg-electric-50 hover:text-white"
        >
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
    </div>
  );
}
