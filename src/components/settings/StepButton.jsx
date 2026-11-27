export default function StepButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full bg-on-paper/10 text-on-paper transition-colors duration-150 hover:bg-on-paper/15 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  )
}
