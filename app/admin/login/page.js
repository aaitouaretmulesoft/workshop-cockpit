import TopBar from '../../components/TopBar';

export const dynamic = 'force-dynamic';

const ERRORS = {
  '1': 'Identifiants incorrects.',
  'missing-config':
    'ADMIN_PASSWORD non configurée sur le serveur. Définissez-la dans les variables d’environnement.',
};

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === 'string' ? params.next : '/admin';
  const errorKey = typeof params?.error === 'string' ? params.error : null;
  const error = errorKey ? ERRORS[errorKey] ?? null : null;

  return (
    <>
      <TopBar context="Workshop Cockpit · Admin" />

      <main className="mx-auto max-w-md px-6 py-16">
        <div className="mb-6">
          <h1 className="font-display text-[28px] font-medium leading-tight text-electric-15">
            Connexion admin
          </h1>
          <p className="mt-1 text-sm text-cloud-40">
            Accès réservé aux animateurs de la session.
          </p>
        </div>

        <form
          action="/api/admin/login"
          method="POST"
          className="space-y-5 rounded-card border border-cloud-80/60 bg-white p-6"
          noValidate
        >
          <input type="hidden" name="next" value={next} />

          <Field
            name="username"
            label="Identifiant"
            autoComplete="username"
            autoFocus
          />
          <Field
            name="password"
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
          />

          {error ? (
            <div
              role="alert"
              className="rounded-card border border-accent-pink/40 bg-accent-pink/5 px-4 py-3 text-sm text-electric-15"
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-electric-50 px-5 py-2.5 font-display text-sm font-medium text-white transition hover:bg-electric-30"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-cloud-40">
          Mini-protection — n’hébergez pas de secrets sensibles ici.
        </p>
      </main>
    </>
  );
}

function Field({ name, label, type = 'text', ...rest }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cloud-40">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        className="mt-1.5 w-full rounded-md border border-cloud-80 bg-white px-3 py-2.5 text-[15px] text-electric-15 placeholder:text-cloud-68 focus:border-electric-50"
        {...rest}
      />
    </label>
  );
}
