'use client';

import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { resetAllAction, uploadCsvAction } from '../actions';

const initial = { status: 'idle' };

export default function DataPanel({ total }) {
  const [resetState, resetAction] = useActionState(resetAllAction, initial);
  const [uploadState, uploadAction] = useActionState(uploadCsvAction, initial);
  const formRef = useRef(null);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        action={resetAction}
        onSubmit={(e) => {
          if (
            !confirm(
              `Réinitialiser toutes les attributions${total ? ` (${total} comptes)` : ''} ?\n\nLes participants devront redemander leurs accès.`
            )
          ) {
            e.preventDefault();
          }
        }}
        className="rounded-md border border-cloud-80/60 bg-white p-5"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cloud-40">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-pink" aria-hidden />
          Réinitialisation
        </div>
        <h3 className="mt-3 font-display text-lg text-electric-15">
          Libérer toutes les attributions
        </h3>
        <p className="mt-1 text-sm text-cloud-40">
          Vide les colonnes prénom / nom / horodatage et coupe le lien navigateur
          → compte. La liste des identifiants reste intacte.
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          {resetState.status === 'ok' ? (
            <span className="text-xs text-electric-50">
              {resetState.count} comptes libérés.
            </span>
          ) : resetState.status === 'error' ? (
            <span className="text-xs text-accent-pink">{resetState.message}</span>
          ) : (
            <span className="text-xs text-cloud-68">Action irréversible.</span>
          )}
          <DangerButton label="Reset général" pendingLabel="Reset…" />
        </div>
      </form>

      <form
        action={(fd) => {
          uploadAction(fd);
          if (formRef.current) formRef.current.reset();
        }}
        ref={formRef}
        className="rounded-md border border-cloud-80/60 bg-white p-5"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cloud-40">
          <span className="h-1.5 w-1.5 rounded-full bg-electric-50" aria-hidden />
          Import CSV
        </div>
        <h3 className="mt-3 font-display text-lg text-electric-15">
          Charger une nouvelle liste de comptes
        </h3>
        <p className="mt-1 text-sm text-cloud-40">
          Format : <code className="font-mono">username,password</code> par
          ligne (en-tête optionnel). Remplace intégralement la table actuelle.
        </p>

        <label className="mt-4 block">
          <span className="sr-only">Fichier CSV</span>
          <input
            name="file"
            type="file"
            accept=".csv,text/csv,text/plain"
            required
            className="block w-full text-sm text-cloud-40 file:mr-3 file:rounded-pill file:border-0 file:bg-electric-15 file:px-4 file:py-2 file:font-display file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.14em] file:text-white hover:file:bg-electric-30"
          />
        </label>

        <div className="mt-4 flex items-center justify-between gap-3">
          {uploadState.status === 'ok' ? (
            <span className="text-xs text-electric-50">
              {uploadState.count} comptes importés. Table remplacée.
            </span>
          ) : uploadState.status === 'error' ? (
            <span className="text-xs text-accent-pink">
              {uploadState.message}
            </span>
          ) : (
            <span className="text-xs text-cloud-68">
              Les attributions en cours seront effacées.
            </span>
          )}
          <PrimaryButton label="Importer" pendingLabel="Import…" />
        </div>
      </form>
    </div>
  );
}

function PrimaryButton({ label, pendingLabel }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-pill bg-electric-50 px-4 py-2 font-display text-[12px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-electric-30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function DangerButton({ label, pendingLabel }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-pill border border-accent-pink/60 px-4 py-2 font-display text-[12px] font-medium uppercase tracking-[0.14em] text-accent-pink transition hover:bg-accent-pink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
