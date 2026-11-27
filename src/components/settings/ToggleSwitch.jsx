export default function ToggleSwitch({ id, label, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <p id={`${id}-label`} className="text-sm font-medium">
        {label}
      </p>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        onClick={() => {
          if (!disabled) onChange(!checked)
        }}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150 ${
          checked ? 'bg-tomato' : 'bg-on-paper/20'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <span
          className={`absolute left-1 top-1 size-5 rounded-full transition-transform duration-150 ${
            checked ? 'translate-x-5 bg-paper' : 'bg-on-paper/70'
          }`}
        />
      </button>
    </div>
  )
}
