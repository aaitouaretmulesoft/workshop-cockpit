export default function MuleSoftMark({ size = 32, className = '' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="MuleSoft"
    >
      <circle cx="20" cy="20" r="20" fill="#1B5CE6" />
      <path
        d="M11 27.5 V14.5 C11 12.6 13.4 11.9 14.5 13.4 L20 21 L25.5 13.4 C26.6 11.9 29 12.6 29 14.5 V27.5"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
