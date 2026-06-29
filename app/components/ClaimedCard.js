import CopyField from './CopyField';

export default function ClaimedCard({
  credential,
  firstName,
  lastName,
  reused = false,
}) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || '—';

  return (
    <div className="rounded-card border border-cloud-80/60 bg-white">
      <div className="flex items-center justify-between border-b border-cloud-80/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="led led-ok" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cloud-40">
            {reused ? 'Compte déjà attribué' : 'Compte attribué'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-cloud-40">
          {credential.username}
        </span>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cloud-40">
            Participant
          </div>
          <div className="mt-1 font-display text-2xl text-electric-15">
            {fullName}
          </div>
        </div>

        <CopyField label="Username" value={credential.username} />
        <CopyField label="Password" value={credential.password} />

        <p className="text-xs text-cloud-40">
          Ce navigateur est lié à ce compte. Gardez cet onglet ouvert pendant
          l’atelier — un refresh vous rendra les mêmes identifiants.
        </p>
      </div>
    </div>
  );
}
