import { useTranslation } from 'react-i18next'

function SectionHeading({ title, description }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <span aria-hidden="true" className="mt-3 block h-1 w-10 rounded-full bg-tomato" />
      {description ? (
        <p className="mt-4 max-w-prose text-sm leading-6 text-on-paper-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default function StudyGuide() {
  const { t } = useTranslation()
  const aboutParagraphs = t('landing.about.paragraphs', { returnObjects: true })
  const techniqueParagraphs = t('landing.technique.paragraphs', { returnObjects: true })
  const steps = t('landing.how.steps', { returnObjects: true })
  const features = t('landing.features.items', { returnObjects: true })
  const roadmapGroups = t('landing.roadmap.groups', { returnObjects: true })

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <section className="pt-14 sm:pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-tomato">
          {t('landing.eyebrow')}
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
          {t('landing.intro.title')}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8">
          {t('landing.intro.lead')}
        </p>
        <p className="mt-3 max-w-[58ch] text-sm leading-6 text-on-paper-muted sm:text-base">
          {t('landing.intro.description')}
        </p>
      </section>

      <section id="about" className="mt-12 scroll-mt-6 border-t border-paper-line py-10 sm:py-12">
        <SectionHeading title={t('landing.about.title')} />
        <div className="mt-5 space-y-4">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-[65ch] text-sm leading-6 sm:text-base sm:leading-7">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="border-t border-paper-line py-10 sm:py-12">
        <SectionHeading title={t('landing.technique.title')} />
        <div className="mt-5 space-y-4">
          {techniqueParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-[65ch] text-sm leading-6 text-on-paper-muted sm:text-base sm:leading-7"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <p className="mt-5 text-xs font-medium text-on-paper-muted">
          {t('landing.technique.credit')}
        </p>
      </section>

      <section id="guide" className="scroll-mt-6 border-t border-paper-line py-10 sm:py-12">
        <SectionHeading title={t('landing.how.title')} description={t('landing.how.intro')} />
        <ol className="mt-7 space-y-5">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tomato-soft font-display text-sm font-bold text-tomato">
                {index + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-1 max-w-[60ch] text-sm leading-6 text-on-paper-muted">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="features" className="scroll-mt-6 border-t border-paper-line py-10 sm:py-12">
        <SectionHeading
          title={t('landing.features.title')}
          description={t('landing.features.description')}
        />
        <ul className="mt-6 grid gap-y-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex gap-2.5 text-sm leading-6 text-on-paper-muted sm:text-base"
            >
              <span
                aria-hidden="true"
                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-tomato"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="roadmap" className="scroll-mt-6 border-t border-paper-line py-10 sm:py-12">
        <SectionHeading
          title={t('landing.roadmap.title')}
          description={t('landing.roadmap.description')}
        />
        <div className="mt-6 grid gap-3">
          {roadmapGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-paper-line bg-paper-raised p-4 sm:p-5"
            >
              <h3 className="font-display text-base font-semibold">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-on-paper-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-leaf"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
