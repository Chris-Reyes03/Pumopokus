import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { getSubjectLabel } from '../../utils/tasks'

export default function SubjectSelect({ value, onChange, subjects, label, className = '' }) {
  const { t } = useTranslation()
  const id = useId()
  const hasValue = subjects.some((subject) => subject.id === value)

  return (
    <select
      id={id}
      aria-label={label}
      value={hasValue ? value : ''}
      onChange={(event) => onChange(event.target.value || null)}
      className={`h-11 min-w-0 rounded-control border border-paper-line bg-paper-raised px-2.5 text-sm text-on-paper ${className}`}
    >
      {hasValue ? null : <option value="">{t('tasks.noSubject')}</option>}
      {subjects.map((subject) => (
        <option key={subject.id} value={subject.id}>
          {getSubjectLabel(subject, t)}
        </option>
      ))}
    </select>
  )
}
