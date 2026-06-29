import Link from 'next/link';
import MuleSoftMark from './MuleSoftMark';

export default function TopBar({ context, right }) {
  return (
    <header className="sticky top-0 z-20 border-b border-cloud-80/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <MuleSoftMark size={28} />
          <span className="font-display text-[17px] font-medium tracking-tight text-electric-50">
            MuleSoft
          </span>
          {context ? (
            <>
              <span className="mx-2 h-4 w-px bg-cloud-80" aria-hidden />
              <span className="font-display text-[13px] text-electric-15">
                {context}
              </span>
            </>
          ) : null}
        </Link>
        <div className="flex items-center gap-4 text-xs text-cloud-40">
          {right}
        </div>
      </div>
    </header>
  );
}
