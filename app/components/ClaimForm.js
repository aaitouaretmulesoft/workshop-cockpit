'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { claimCredential } from '../actions';
import CopyField from './CopyField';

const initialState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative inline-flex items-center justify-center gap-2 rounded-pill bg-electric-50 px-6 py-3 font-display text-sm font-semibold tracking-wide text-white shadow-cockpit transition hover:bg-electric-30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span>{pending ? 'Affectation en cours…' : 'Récupérer mes accès'}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition group-hover:translate-x-0.5"
      >
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function ClaimForm() {
  const [state, formAction] = useActionState(claimCredential, initialState);

  if (state.status === 'ok') {
    return <BoardingPass state={state} />;
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="firstName"
          label="Prénom"
          autoComplete="given-name"
          placeholder="Jean"
        />
        <Field
          name="lastName"
          label="Nom"
          autoComplete="family-name"
          placeholder="Dupont"
        />
      </div>

      {state.status === 'error' || state.status === 'empty' ? (
        <div
          role="alert"
          className="rounded border border-accent-yellow/60 bg-accent-yellow/10 px-4 py-3 text-sm text-electric-15"
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-xs text-cloud-40">
          Vos identifiants sont uniques et liés à votre nom — un seul compte
          par participant.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({ name, label, ...rest }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cloud-40">
        {label}
      </span>
      <input
        name={name}
        required
        className="mt-1 w-full rounded border border-cloud-80 bg-white px-3 py-2.5 text-electric-15 placeholder:text-cloud-68 focus:border-electric-50"
        {...rest}
      />
    </label>
  );
}

function BoardingPass({ state }) {
  const { credential, firstName, lastName, reused } = state;
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="animate-slideUp">
      <div className="overflow-hidden rounded-card border border-cloud-80 bg-white shadow-cockpit">
        <div className="flex items-center justify-between bg-electric-15 px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <span className="led led-live animate-pulseDot" aria-hidden />
            <span className="font-display text-[11px] uppercase tracking-[0.24em]">
              MuleSoft Workshop · Boarding pass
            </span>
          </div>
          <span className="font-mono text-[11px] text-cloud-80">
            #{String(credential.username).replace(/\D/g, '').padStart(3, '0') ||
              '—'}
          </span>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_220px]">
          <div className="space-y-5 p-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-cloud-40">
                Participant
              </div>
              <div className="mt-1 font-display text-2xl text-electric-15">
                {fullName}
              </div>
            </div>

            <CopyField label="Username" value={credential.username} mono />
            <CopyField label="Password" value={credential.password} mono />

            <div className="flex items-center gap-2 pt-1 text-xs text-cloud-40">
              <span className="led led-ok" aria-hidden />
              {reused
                ? 'Compte déjà attribué à votre nom — réutilisation.'
                : 'Nouveau compte attribué avec succès.'}
            </div>
          </div>

          <div className="hidden border-l border-dashed border-cloud-80 md:block">
            <div className="perforation h-2" aria-hidden />
            <div className="flex h-full flex-col justify-between bg-cloud-95 p-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-cloud-40">
                  Session
                </div>
                <div className="mt-1 font-display text-lg text-electric-30">
                  Hands-on
                </div>
                <div className="font-display text-lg text-electric-30">
                  MuleSoft
                </div>
              </div>
              <div className="space-y-1 text-[11px] text-cloud-40">
                <div className="flex justify-between">
                  <span>Gate</span>
                  <span className="font-mono text-electric-15">A1</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-mono text-electric-15">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-cloud-40">
        Gardez cet onglet ouvert — vos identifiants resteront affichés ci-dessus.
      </p>
    </div>
  );
}
