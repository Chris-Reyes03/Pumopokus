export function TomatoMark({ className = 'size-6' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16 10.4c6.2 0 11 4.3 11 10.2C27 27 22.4 31 16 31S5 27 5 20.6c0-5.9 4.8-10.2 11-10.2Z"
        fill="currentColor"
      />
      <path d="M16 11c-2-3.1-5-4.6-8.5-4.4.6 3.1 2.7 5.2 5.9 6.2" fill="var(--leaf, #397451)" />
      <path d="M16 11c2-3.1 5-4.6 8.5-4.4-.6 3.1-2.7 5.2-5.9 6.2" fill="var(--leaf, #397451)" />
      <path
        d="M14.9 8.7c-.3-2.2.4-4 2-5.4 1.3 1.5 1.8 3.3 1.3 5.3"
        stroke="var(--leaf, #397451)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CalyxMark({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 40 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M20 18c-4.5-1.8-7.8-5-9.7-9.5 4.3-.8 8 .8 11 4.7 2.8-4.1 6.5-5.8 11-5.1-1.7 4.7-5 8-9.6 9.9"
        fill="var(--leaf, #397451)"
      />
      <path
        d="M18.6 9.8c-.6-2.8.1-5.2 2.1-7.2 1.8 1.9 2.5 4.2 2 6.9"
        stroke="var(--leaf, #397451)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CloseIcon({ className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

export function ChevronDownIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function ClockIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function RepeatIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11V9a3 3 0 0 1 3-3h15" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v2a3 3 0 0 1-3 3H3" />
    </svg>
  )
}

export function PaletteIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3a9 9 0 1 0 0 18h1.4a2.1 2.1 0 0 0 1.3-3.8 1.9 1.9 0 0 1 1.3-3.4h1.9A3.1 3.1 0 0 0 21 10.7 8.2 8.2 0 0 0 12 3Z" />
      <circle cx="7.8" cy="11.4" r=".8" fill="currentColor" />
      <circle cx="10.2" cy="7.6" r=".8" fill="currentColor" />
      <circle cx="14.7" cy="7.8" r=".8" fill="currentColor" />
      <circle cx="17" cy="11.3" r=".8" fill="currentColor" />
    </svg>
  )
}

export function GlobeIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.4 3.6 5.4 3.6 9S14.4 18.6 12 21c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3Z" />
    </svg>
  )
}

export function VolumeIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z" />
      <path d="M15 8.8a4.5 4.5 0 0 1 0 6.4" />
      <path d="M18 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  )
}

export function BellIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  )
}

export function SproutIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 21v-8" />
      <path d="M12 13c-4.2 0-7-2.3-7-6.5 4.2 0 7 2.3 7 6.5Z" />
      <path d="M12 13c0-4.2 2.3-7 6.5-7 0 4.2-2.3 7-6.5 7Z" />
    </svg>
  )
}

export function PlayIcon({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 5.14v13.72L19 12 8 5.14Z" />
    </svg>
  )
}

export function PauseIcon({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="6" y="5" width="4" height="14" rx="1.2" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" />
    </svg>
  )
}

export function SkipIcon({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6 5.5v13l9-6.5-9-6.5Z" />
      <rect x="16.5" y="5" width="2.4" height="14" rx="1.2" />
    </svg>
  )
}

export function ResetIcon({ className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 3.2-6.9L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

export function SlidersIcon({ className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 7h7" />
      <path d="M15 7h5" />
      <circle cx="13" cy="7" r="2" />
      <path d="M4 17h5" />
      <path d="M13 17h7" />
      <circle cx="11" cy="17" r="2" />
    </svg>
  )
}

export function MoonIcon({ className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.6 13.2A8.6 8.6 0 1 1 10.8 3.4a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

export function SunIcon({ className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.9 4.9 6.3 6.3" />
      <path d="M17.7 17.7l1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.9 19.1l1.4-1.4" />
      <path d="M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

export function PencilIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  )
}

export function TrashIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}

export function MinusIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  )
}

export function PlusIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}
