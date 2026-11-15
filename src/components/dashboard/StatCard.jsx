import React from 'react'

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  accentColor = 'cyan',
  onClick,
}) {
  const accentStyles = {
    cyan: {
      iconBg: 'bg-cyan-50 text-cyan-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderHover: 'hover:border-cyan-300',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderHover: 'hover:border-emerald-300',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderHover: 'hover:border-rose-300',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderHover: 'hover:border-amber-300',
    },
  }

  const selectedAccent = accentStyles[accentColor] || accentStyles.cyan

  return (
    <div
      onClick={onClick}
      className={`relative p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:shadow-md ' + selectedAccent.borderHover : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${selectedAccent.iconBg} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          {value}
        </div>

        {(subtitle || badgeText) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {badgeText && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold border text-[11px] ${selectedAccent.badgeBg}`}
              >
                {badgeText}
              </span>
            )}
            {subtitle && (
              <span className="text-slate-500 font-medium">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
