import Link from 'next/link';
import TopBar from './components/TopBar';
import SectionCard from './components/SectionCard';
import ClaimForm from './components/ClaimForm';
import ClaimedCard from './components/ClaimedCard';
import { getMyCredential } from './actions';

const DOCS = [
  {
    title: 'Guide de démarrage',
    blurb: 'Accédez à Anypoint Platform et suivez l’atelier MCP.',
    href: 'https://hot-world-tour-paris.workshops.mulesoft.com/',
  },
  {
    title: 'API exposée — console',
    blurb:
      'Testez l’API Système ERP depuis la console APIkit : endpoints, payloads et réponses.',
    href: 'http://erp-system-app-de-c1.de-c1.cloudhub.io/console',
    forceHttp: true,
  },
];

export const dynamic = 'force-dynamic';

export default async function Home() {
  const mine = await getMyCredential();

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
            title={mine ? 'Vos identifiants' : 'Récupérer vos identifiants'}
          >
            {mine ? (
              <ClaimedCard
                credential={{ username: mine.username, password: mine.password }}
                firstName={mine.assignedToFirstName}
                lastName={mine.assignedToLastName}
                reused
              />
            ) : (
              <div className="rounded-md border border-cloud-80/60 bg-white p-5 sm:p-6">
                <ClaimForm />
              </div>
            )}
          </SectionCard>

          <SectionCard
            eyebrow="Étape 02 · Documentation"
            title="À garder ouvert pendant l’atelier"
          >
            <ul className="space-y-2.5">
              {DOCS.map((doc) => {
                const external = doc.href.startsWith('http');
                const className =
                  'group flex items-start justify-between gap-3 rounded-md border border-cloud-80/60 bg-white px-4 py-3 transition hover:border-electric-50/40 hover:shadow-sm';
                const content = (
                  <>
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
                  </>
                );

                return (
                  <li key={doc.title}>
                    {doc.forceHttp ? (
                      <a
                        href={doc.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={className}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        href={doc.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer noopener' : undefined}
                        className={className}
                      >
                        {content}
                      </Link>
                    )}
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
