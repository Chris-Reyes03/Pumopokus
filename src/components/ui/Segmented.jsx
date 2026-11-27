export default function Segmented({
  options,
  value,
  onChange,
  ariaLabel,
  tone = 'page',
  className = '',
}) {
  const isPaper = tone === 'paper'

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex gap-1 p-1 ${
        isPaper ? 'bg-on-paper/10' : 'bg-black/15'
      } rounded-control ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value
        const activeClasses = isPaper
          ? 'bg-tomato text-paper shadow-sm'
          : 'bg-black/25 text-on-page shadow-sm'
        const inactiveClasses = isPaper
          ? 'text-on-paper-muted hover:bg-on-paper/5 hover:text-on-paper'
          : 'text-on-page-muted hover:bg-black/10 hover:text-on-page'

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-[0.65rem] px-2 py-1.5 text-xs font-semibold leading-tight transition-colors duration-150 sm:py-2 sm:text-[13px] ${
              active ? activeClasses : inactiveClasses
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
