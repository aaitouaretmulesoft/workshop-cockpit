'use client';

import { useState } from 'react';

export default function CopyUrlInline({ url }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked — silent
    }
  }

  return (
    <div className="mt-2 flex items-start gap-1.5">
      <code className="break-all font-mono text-[12px] leading-snug text-electric-50">
        {url}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'URL copiée' : "Copier l'URL"}
        title={copied ? 'Copié' : 'Copier'}
        className="mt-0.5 shrink-0 rounded p-1 text-cloud-68 transition hover:bg-cloud-95 hover:text-electric-50"
      >
        {copied ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
    </div>
  );
}
