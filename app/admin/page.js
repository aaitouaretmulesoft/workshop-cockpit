import Link from 'next/link';
import { prisma } from '@/lib/prisma';
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

  const where = q
    ? {
        OR: [
          { assignedToFirstName: { contains: q, mode: 'insensitive' } },
          { assignedToLastName: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
        ],
      }
    : undefined;

  const [total, assigned, rows] = await Promise.all([
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

  const remaining = total - assigned;

  return (
    <main className="min-h-screen instrument-grid">
      <header className="border-b border-cloud-80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="led led-live animate-pulseDot" aria-hidden />
            <Link
              href="/"
              className="font-display text-lg tracking-tight text-electric-15"
            >
              Workshop Cockpit
            </Link>
            <span className="rounded border border-cloud-80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cloud-40">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-cloud-40">
            <span className="font-mono uppercase tracking-[0.18em]">
              Live · {fmtDate(new Date())}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-display text-3xl text-electric-15">Cockpit</h1>
        <p className="mt-1 text-sm text-cloud-40">
          Suivi temps réel de l’attribution des comptes pendant la session.
        </p>

        {/* Metrics */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric label="Total comptes" value={total} accent="electric" />
          <Metric
            label="Attribués"
            value={assigned}
            sub={`${pct(assigned, total)}% de l’inventaire`}
            accent="teal"
          />
          <Metric
            label="Disponibles"
            value={remaining}
            sub={`${pct(remaining, total)}% restants`}
            accent={remaining === 0 ? 'pink' : 'cloud'}
          />
        </section>

        {/* Capacity gauge */}
        <section className="mt-4 rounded-card border border-cloud-80 bg-white p-4">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-cloud-40">
            <span>Capacité utilisée</span>
            <span className="font-mono text-electric-15">
              {assigned} / {total}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cloud-95">
            <div
              className="h-full rounded-full bg-electric-50 transition-all"
              style={{ width: `${pct(assigned, total)}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct(assigned, total)}
            />
          </div>
        </section>

        {/* Search */}
        <section className="mt-8 flex items-center justify-between gap-4">
          <form method="get" className="flex w-full max-w-md items-center gap-2">
            <label htmlFor="q" className="sr-only">
              Rechercher
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Rechercher par nom, prénom ou identifiant…"
              className="w-full rounded border border-cloud-80 bg-white px-3 py-2 text-sm text-electric-15 placeholder:text-cloud-68"
            />
            <button
              type="submit"
              className="rounded-pill bg-electric-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-electric-30"
            >
              Filtrer
            </button>
            {q ? (
              <Link
                href="/admin"
                className="rounded-pill border border-cloud-80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cloud-40 hover:text-electric-50"
              >
                Effacer
              </Link>
            ) : null}
          </form>
          <div className="hidden text-xs text-cloud-40 sm:block">
            {rows.length} ligne{rows.length > 1 ? 's' : ''}
            {q ? ' filtrée' + (rows.length > 1 ? 's' : '') : ''}
          </div>
        </section>

        {/* Table */}
        <section className="mt-4 overflow-hidden rounded-card border border-cloud-80 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cloud-95 text-[10px] uppercase tracking-[0.18em] text-cloud-40">
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
                      className="px-4 py-8 text-center text-cloud-40"
                    >
                      Aucun résultat.
                    </td>
                  </tr>
                ) : null}
                {rows.map((r) => {
                  const isAssigned = Boolean(r.assignedToFirstName);
                  return (
                    <tr key={r.id} className="hover:bg-cloud-95/60">
                      <td className="px-4 py-3 font-mono text-xs text-cloud-40">
                        {r.id.toString().padStart(3, '0')}
                      </td>
                      <td className="px-4 py-3 font-mono text-electric-15">
                        {r.username}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
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
                            <input type="hidden" name="id" value={r.id} />
                            <button
                              type="submit"
                              className="rounded-pill border border-cloud-80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cloud-40 transition hover:border-accent-pink hover:text-accent-pink"
                            >
                              Reset
                            </button>
                          </form>
                        ) : (
                          <span className="text-[11px] text-cloud-68">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="mt-8 flex items-center justify-between text-xs text-cloud-40">
          <Link href="/" className="hover:text-electric-50">
            ← Retour au tableau participant
          </Link>
          <span className="font-mono uppercase tracking-[0.18em]">
            Workshop Cockpit · v1
          </span>
        </footer>
      </div>
    </main>
  );
}

function Metric({ label, value, sub, accent = 'electric' }) {
  const accentBar = {
    electric: 'bg-electric-50',
    teal: 'bg-accent-teal',
    pink: 'bg-accent-pink',
    cloud: 'bg-cloud-68',
  }[accent];

  return (
    <div className="relative overflow-hidden rounded-card border border-cloud-80 bg-white p-5">
      <div className={`absolute inset-x-0 top-0 h-1 ${accentBar}`} aria-hidden />
      <div className="text-[11px] uppercase tracking-[0.18em] text-cloud-40">
        {label}
      </div>
      <div className="mt-2 font-mono text-4xl font-semibold tabular-nums text-electric-15">
        {String(value).padStart(2, '0')}
      </div>
      {sub ? <div className="mt-1 text-xs text-cloud-40">{sub}</div> : null}
    </div>
  );
}
