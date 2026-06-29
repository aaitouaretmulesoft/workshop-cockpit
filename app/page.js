import Link from 'next/link';
import ClaimForm from './components/ClaimForm';

const DOCS = [
  {
    title: 'Guide de démarrage',
    blurb: 'Activer votre Anypoint Platform et configurer Anypoint Studio.',
    href: 'https://docs.mulesoft.com/general/',
  },
  {
    title: 'Atelier — étapes 1 → 5',
    blurb: 'Suivez les exercices dans l’ordre. Comptez 20 min par étape.',
    href: '#',
  },
  {
    title: 'API exposée — référence',
    blurb: 'Endpoints, payloads, codes d’erreur attendus pendant l’atelier.',
    href: '#',
  },
  {
    title: 'Dépannage & FAQ',
    blurb: 'Les problèmes les plus fréquents, et comment s’en sortir vite.',
    href: '#',
  },
];

export default function Home() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient text-electric-15">
        <div className="absolute inset-0 instrument-grid opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-6 pt-14 pb-20">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-electric-30">
            <span className="led led-live animate-pulseDot" aria-hidden />
            <span>MuleSoft · Hands-on workshop</span>
          </div>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-electric-15 sm:text-6xl">
            Workshop <span className="text-white">Cockpit</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-electric-15/85">
            Tableau de bord de la session. Récupérez vos identifiants, ouvrez
            la documentation, et démarrez l’atelier.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-14 max-w-5xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Claim panel */}
          <section
            aria-labelledby="claim-title"
            className="rounded-card border border-cloud-80 bg-white p-6 shadow-cockpit sm:p-8"
          >
            <div className="flex items-baseline justify-between">
              <h2
                id="claim-title"
                className="font-display text-2xl text-electric-15"
              >
                Récupérer vos accès
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cloud-40">
                Step · 01
              </span>
            </div>
            <p className="mt-2 text-sm text-cloud-40">
              Entrez votre prénom et votre nom. Un compte unique vous sera
              attribué pour toute la durée de l’atelier.
            </p>
            <div className="mt-6">
              <ClaimForm />
            </div>
          </section>

          {/* Docs panel */}
          <section
            aria-labelledby="docs-title"
            className="rounded-card border border-cloud-80 bg-cloud-95 p-6 sm:p-8"
          >
            <div className="flex items-baseline justify-between">
              <h2
                id="docs-title"
                className="font-display text-2xl text-electric-15"
              >
                Documentation
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cloud-40">
                Step · 02
              </span>
            </div>
            <p className="mt-2 text-sm text-cloud-40">
              À consulter au fur et à mesure. Gardez ces liens à portée de
              main.
            </p>

            <ul className="mt-6 space-y-3">
              {DOCS.map((doc) => (
                <li key={doc.title}>
                  <Link
                    href={doc.href}
                    target={doc.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      doc.href.startsWith('http')
                        ? 'noreferrer noopener'
                        : undefined
                    }
                    className="group flex items-start justify-between gap-3 rounded border border-transparent bg-white px-4 py-3 transition hover:border-cloud-80 hover:shadow-cockpit"
                  >
                    <div>
                      <div className="font-display text-[15px] text-electric-15">
                        {doc.title}
                      </div>
                      <div className="text-xs text-cloud-40">{doc.blurb}</div>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-1 shrink-0 text-cloud-68 transition group-hover:translate-x-0.5 group-hover:text-electric-50"
                      aria-hidden
                    >
                      <path d="M7 17 17 7" />
                      <path d="M8 7h9v9" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="mt-12 flex flex-col items-center gap-1 text-center text-xs text-cloud-40">
          <div>
            Un problème avec vos identifiants ? Adressez-vous à l’animateur de
            la session.
          </div>
          <div>
            <Link
              href="/admin"
              className="font-mono uppercase tracking-[0.18em] text-cloud-40 hover:text-electric-50"
            >
              · admin ·
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
