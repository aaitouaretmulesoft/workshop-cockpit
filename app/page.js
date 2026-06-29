import Link from 'next/link';
import TopBar from './components/TopBar';
import SectionCard from './components/SectionCard';
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
    blurb: 'Les problèmes fréquents et comment s’en sortir vite.',
    href: '#',
  },
];

export default function Home() {
  return (
    <>
      <TopBar
        context="Workshop Cockpit"
        right={
          <Link
            href="/admin"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-cloud-40 hover:text-electric-50"
          >
            Admin
          </Link>
        }
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-[34px] font-medium leading-tight text-electric-15">
            Bienvenue
          </h1>
          <p className="mt-1 text-sm text-cloud-40">
            Récupérez vos identifiants pour la session hands-on MuleSoft.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard
            eyebrow="Étape 01 · Accès"
            title="Récupérer vos identifiants"
            action={
              <span className="inline-flex items-center gap-2 rounded-pill border border-cloud-80 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cloud-40">
                <span className="led led-live" aria-hidden />
                Live
              </span>
            }
          >
            <div className="rounded-md border border-cloud-80/60 bg-white p-5 sm:p-6">
              <ClaimForm />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Étape 02 · Documentation"
            title="À garder ouvert pendant l’atelier"
          >
            <ul className="space-y-2.5">
              {DOCS.map((doc) => {
                const external = doc.href.startsWith('http');
                return (
                  <li key={doc.title}>
                    <Link
                      href={doc.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer noopener' : undefined}
                      className="group flex items-start justify-between gap-3 rounded-md border border-cloud-80/60 bg-white px-4 py-3 transition hover:border-electric-50/40 hover:shadow-sm"
                    >
                      <div>
                        <div className="font-display text-[15px] font-medium text-electric-15">
                          {doc.title}
                        </div>
                        <div className="mt-0.5 text-xs text-cloud-40">
                          {doc.blurb}
                        </div>
                      </div>
                      <svg
                        width="16"
                        height="16"
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
                );
              })}
            </ul>
          </SectionCard>
        </div>

        <footer className="mt-12 text-center text-xs text-cloud-40">
          Un problème avec vos identifiants ? Adressez-vous à l’animateur de
          la session.
        </footer>
      </main>
    </>
  );
}
