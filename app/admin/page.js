import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import TopBar from '../components/TopBar';
import SectionCard from '../components/SectionCard';
import { resetCredential } from './actions';

export const dynamic = 'force-dynamic';

function fmtDate(d) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(d));
}

function pct(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 100);
}

export default async function AdminPage({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q ?? '').trim();

  let total = 0;
  let assigned = 0;
  let rows = [];
  let dbError = null;

  try {
    const where = q
      ? {
          OR: [
            { assignedToFirstName: { contains: q, mode: 'insensitive' } },
            { assignedToLastName: { contains: q, mode: 'insensitive' } },
            { username: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined;

    [total, assigned, rows] = await Promise.all([
      prisma.credential.count(),
      prisma.credential.count({ where: { NOT: { assignedToFirstName: null } } }),
      prisma.credential.findMany({
        where,
        orderBy: [
          { assignedAt: { sort: 'desc', nulls: 'last' } },
          { id: 'asc' },
        ],
        take: 500,
      }),
    ]);
  } catch (err) {
    console.error('[admin] database error:', err);
    dbError =
      'Impossible de joindre la base de données. Vérifiez que DATABASE_URL est configurée sur Vercel (Neon connecté) puis redéployez.';
  }

  const remaining = total - assigned;

  return (
    <>
      <TopBar
        context="Workshop Cockpit · Admin"
        right={
          <span className="inline-flex items-center gap-2">
            <span className="led led-live" aria-hidden />
            <span className="font-mono uppercase tracking-[0.16em]">Live</span>
          </span>
        }
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[34px] font-medium leading-tight text-electric-15">
              Cockpit
            </h1>
            <p className="mt-1 text-sm text-cloud-40">
              Suivi temps réel de l’attribution des comptes pendant la session.
            </p>
          </div>
          <Link
            href="/"
            className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-cloud-40 hover:text-electric-50 sm:inline"
          >
            ← Vue participant
          </Link>
        </div>

        {dbError ? (
          <div
            role="alert"
            className="mb-6 rounded-md border border-accent-pink/40 bg-accent-pink/5 px-4 py-3 text-sm text-electric-15"
          >
            {dbError}
          </div>
        ) : null}

        <div className="space-y-5">
          <SectionCard eyebrow="Inventaire des comptes" title="Vue d’ensemble">
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricTile
                label="Total"
                value={total}
                caption="Comptes provisionnés"
                accent="electric"
              />
              <MetricTile
                label="Attribués"
                value={assigned}
                caption={`${pct(assigned, total)}% de l’inventaire`}
                accent="teal"
              />
              <MetricTile
                label="Disponibles"
                value={remaining}
                caption={`${pct(remaining, total)}% restants`}
                accent={remaining === 0 ? 'pink' : 'cloud'}
              />
            </div>

            <div className="mt-5 rounded-md border border-cloud-80/60 bg-white p-4">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-cloud-40">
                <span>Capacité utilisée</span>
                <span className="font-mono text-electric-15">
                  {assigned} / {total}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cloud-95">
                <div
                  className="h-full rounded-full bg-electric-50 transition-all"
                  style={{ width: `${pct(assigned, total)}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct(assigned, total)}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Attributions"
            title="Comptes et participants"
            action={
              <form
                method="get"
                className="flex items-center gap-2"
                role="search"
              >
                <div className="relative">
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
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cloud-68"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <label htmlFor="q" className="sr-only">
                    Rechercher
                  </label>
                  <input
                    id="q"
                    name="q"
                    defaultValue={q}
                    placeholder="Rechercher par nom ou identifiant…"
                    className="w-72 rounded-pill border border-cloud-80 bg-white py-2 pl-8 pr-3 text-sm text-electric-15 placeholder:text-cloud-68"
                  />
                </div>
                {q ? (
                  <Link
                    href="/admin"
                    className="rounded-pill border border-cloud-80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cloud-40 hover:text-electric-50"
                  >
                    Effacer
                  </Link>
                ) : null}
              </form>
            }
          >
            <div className="overflow-hidden rounded-md border border-cloud-80/60 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cloud-95/60 text-[10px] font-semibold uppercase tracking-[0.16em] text-cloud-40">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Identifiant</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Attribué à</th>
                      <th className="px-4 py-3">Horodatage</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cloud-95">
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-sm text-cloud-40"
                        >
                          Aucun résultat.
                        </td>
                      </tr>
                    ) : null}
                    {rows.map((r) => {
                      const isAssigned = Boolean(r.assignedToFirstName);
                      return (
                        <tr key={r.id} className="hover:bg-cloud-95/50">
                          <td className="px-4 py-3 font-mono text-xs text-cloud-40">
                            {r.id.toString().padStart(3, '0')}
                          </td>
                          <td className="px-4 py-3 font-mono text-[13px] text-electric-15">
                            {r.username}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-cloud-40">
                              <span
                                className={`led ${
                                  isAssigned ? 'led-live' : 'led-ok'
                                }`}
                                aria-hidden
                              />
                              {isAssigned ? 'Attribué' : 'Disponible'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-electric-15">
                            {isAssigned
                              ? `${r.assignedToFirstName} ${r.assignedToLastName}`
                              : '—'}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-cloud-40">
                            {fmtDate(r.assignedAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isAssigned ? (
                              <form action={resetCredential}>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={r.id}
                                />
                                <button
                                  type="submit"
                                  className="rounded-pill border border-cloud-80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cloud-40 transition hover:border-accent-pink hover:text-accent-pink"
                                >
                                  Reset
                                </button>
                              </form>
                            ) : (
                              <span className="text-[11px] text-cloud-68">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-cloud-40">
              <span>
                {rows.length} ligne{rows.length > 1 ? 's' : ''}
                {q ? ' filtrée' + (rows.length > 1 ? 's' : '') : ''}
              </span>
              <span className="font-mono uppercase tracking-[0.16em]">
                Workshop Cockpit · v1
              </span>
            </div>
          </SectionCard>
        </div>
      </main>
    </>
  );
}

function MetricTile({ label, value, caption, accent = 'electric' }) {
  const dot = {
    electric: 'bg-electric-50',
    teal: 'bg-accent-teal',
    pink: 'bg-accent-pink',
    cloud: 'bg-cloud-68',
  }[accent];

  return (
    <div className="rounded-md border border-cloud-80/60 bg-white p-5">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cloud-40">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
        {label}
      </div>
      <div className="mt-3 font-display text-[40px] font-medium leading-none tabular-nums text-electric-15">
        {value}
      </div>
      {caption ? (
        <div className="mt-2 text-xs text-cloud-40">{caption}</div>
      ) : null}
    </div>
  );
}
