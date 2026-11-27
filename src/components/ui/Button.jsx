const VARIANTS = {
  primary:
    'bg-control text-on-control shadow-sm hover:brightness-105 active:scale-[0.98] disabled:active:scale-100',
  ghost: 'bg-black/15 text-on-page hover:bg-black/25',
  outline: 'border border-on-page/30 text-on-page hover:bg-white/10',
  paperGhost: 'bg-on-paper/10 text-on-paper hover:bg-on-paper/15',
  paperOutline: 'border border-on-paper/25 text-on-paper hover:bg-on-paper/5',
  accent:
    'bg-tomato text-paper shadow-sm hover:brightness-105 active:scale-[0.98] disabled:active:scale-100',
}

const SIZES = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-7 text-base font-bold',
  icon: 'size-11 p-0 sm:size-12',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold transition duration-150 ease-soft disabled:pointer-events-none disabled:opacity-45 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  )
}
