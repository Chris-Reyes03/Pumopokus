export default function SettingsSection({ title, description, icon, children }) {
  return (
    <section className="px-5 py-5 sm:px-6">
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tomato-soft text-tomato">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-on-paper-muted sm:text-sm">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}
