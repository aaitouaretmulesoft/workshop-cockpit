import Image from 'next/image';

export default function MuleSoftMark({ size = 32, className = '' }) {
  return (
    <Image
      src="/mulesoft-logo.png"
      alt="MuleSoft"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
