import { useState } from 'react'

interface FormFieldExplanation {
  why: string
  impact: string
}

interface FormFieldWithExplanationProps {
  label: string
  required?: boolean
  explanation: FormFieldExplanation
  children: React.ReactNode
}

export function FormFieldWithExplanation({
  label,
  required,
  explanation,
  children,
}: FormFieldWithExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-3">
      <label className="block text-base font-medium text-[var(--sea-ink)]">
        {label}
        {required && <span className="ml-1 text-[var(--xhs-primary)]">*</span>}
      </label>

      {children}

      {/* Explanation Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-[var(--sea-ink-soft)] transition hover:text-[var(--xhs-primary)]"
      >
        <svg
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-base">
          {isExpanded ? '收起说明' : '为什么要设置此项？'}
        </span>
      </button>

      {/* Explanation Content */}
      {isExpanded && (
        <div className="rounded-xl bg-[var(--seafoam)]/30 p-4 text-sm">
          <div className="mb-3 flex items-start gap-2">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--xhs-primary)]/10 text-xs text-[var(--xhs-primary)]">
              💡
            </span>
            <div className="font-medium text-[var(--sea-ink)]">为什么设置此项？</div>
          </div>
          <p className="mb-3 text-base leading-relaxed text-[var(--sea-ink-soft)]">
            {explanation.why}
          </p>

          <div className="mb-2 flex items-start gap-2">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--xhs-primary)]/10 text-xs text-[var(--xhs-primary)]">
              📊
            </span>
            <div className="font-medium text-[var(--sea-ink)]">设置后会有哪些影响？</div>
          </div>
          <p className="text-base leading-relaxed text-[var(--sea-ink-soft)]">
            {explanation.impact}
          </p>
        </div>
      )}
    </div>
  )
}
