import React from 'react'

export default function Badge({ variant = 'default', children, className = '' }) {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    info: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    default: 'bg-slate-400',
  }

  const selectedStyle = variantStyles[variant] || variantStyles.default
  const dotColor = dotColors[variant] || dotColors.default

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${selectedStyle} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {children}
    </span>
  )
}
