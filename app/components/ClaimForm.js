'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { claimCredential } from '../actions';
import ClaimedCard from './ClaimedCard';

const initialState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-pill bg-electric-50 px-5 py-2.5 font-display text-sm font-medium text-white transition hover:bg-electric-30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span>{pending ? 'Affectation…' : 'Récupérer mes accès'}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
    return (
      <ClaimedCard
        credential={state.credential}
        firstName={state.firstName}
        lastName={state.lastName}
        reused={state.reused}
      />
    );
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
          className="rounded-card border border-accent-yellow/60 bg-accent-yellow/10 px-4 py-3 text-sm text-electric-15"
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex justify-end pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({ name, label, ...rest }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cloud-40">
        {label}
      </span>
      <input
        name={name}
        required
        className="mt-1.5 w-full rounded-md border border-cloud-80 bg-white px-3 py-2.5 text-[15px] text-electric-15 placeholder:text-cloud-68 focus:border-electric-50"
        {...rest}
      />
    </label>
  );
}
