import Link from "next/link";

export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg bg-primary-500 text-white ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="currentColor">
        <path d="M6 3h7a6 6 0 0 1 0 12h-3.5v6H6V3Zm3.5 3.5v5H13a2.5 2.5 0 0 0 0-5H9.5Z" />
      </svg>
    </span>
  );
}

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex min-w-0 items-center gap-2">
      <BrandMark />
      <span className="text-[17px] font-bold tracking-tight text-default-900">PostProAI</span>
      <span className="hidden text-[17px] text-default-600 sm:inline">for Business</span>
    </Link>
  );
}
