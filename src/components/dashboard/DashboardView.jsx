import React, { useState } from 'react'
import {
  Users,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Sparkles,
} from 'lucide-react'
import StatCard from './StatCard'
import QuickActions from './QuickActions'
import OverdueMembersCard from './OverdueMembersCard'
import RecentPaymentsCard from './RecentPaymentsCard'
import { useGym } from '../../context/useGym'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export default function DashboardView() {
  const { stats, setCurrentView } = useGym()

  const [today] = useState(() => new Date())
  const currentPeriodName = `${MONTH_NAMES[today.getMonth()]} ${today.getFullYear()} • Período en Curso`

  // Format currency in Argentine Pesos
  const formattedRevenue = `$${stats.monthlyRevenue.toLocaleString('es-AR')}`
  const formattedMembers = stats.activeMembers.toLocaleString('es-AR')

  // Dynamic collection effectiveness
  const total = stats.activeMembers
  const upToDate = Math.max(0, total - stats.overdueCount)
  const effectivenessPct = total > 0 ? ((upToDate / total) * 100).toFixed(1) : '100'

  return (
    <div className="space-y-6">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Dashboard de Gestión
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Métricas en tiempo real, estado de cobranzas y gestión diaria de Colibrí
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-cyan-600" />
          <span>{currentPeriodName}</span>
        </div>
      </div>

      {/* 1. Recuadros Principales */}
      <section aria-labelledby="estadisticas-rapidas">
        <h3 id="estadisticas-rapidas" className="sr-only">
          Estadísticas Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Recuadro 1: Alumnos Activos */}
          <StatCard
            title="Alumnos Activos"
            value={formattedMembers}
            subtitle="Socios registrados en padrón"
            badgeText={stats.activeTrend}
            icon={Users}
            accentColor="cyan"
            onClick={() => setCurrentView('alumnos')}
          />

          {/* Recuadro 2: Los Pagos del Mes */}
          <StatCard
            title="Los Pagos del Mes"
            value={formattedRevenue}
            subtitle="Recaudación bruta mensual"
            badgeText={stats.revenueTrend}
            icon={CreditCard}
            accentColor="emerald"
            onClick={() => setCurrentView('pagos')}
          />

          {/* Recuadro 3: Cuotas Vencidas */}
          <StatCard
            title="Cuotas Vencidas"
            value={stats.overdueCount}
            subtitle="Requieren regularización"
            badgeText={stats.overdueTrend}
            icon={AlertTriangle}
            accentColor="rose"
            onClick={() => setCurrentView('alumnos')}
          />
        </div>
      </section>

      {/* 2. Sección Principal: Acciones Rápidas + Tablas Operativas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Acciones Rápidas + Tarjeta Informativa (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Componente Acciones Rápidas ("Cobrar cuota" y "Nuevo Alumno") */}
          <QuickActions />

          {/* Resumen de Eficiencia de Cobro */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#121620] rounded-2xl p-5 sm:p-6 text-white shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Efectividad de Cobranzas
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold tracking-tight">
                  {effectivenessPct}%
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {upToDate} de {total} al día
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, Number(effectivenessPct)))}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {stats.overdueCount === 0 ? (
                  total === 0 ? (
                    'Comienza registrando a tus primeros alumnos y profesores.'
                  ) : (
                    '¡Excelente gestión! Todas las cuotas del mes se encuentran al día.'
                  )
                ) : (
                  <>
                    Hay <strong>{stats.overdueCount} alumnos</strong> con la cuota en mora. Puedes regularizarlos con el botón directo de cobro.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Alumnos con Cuotas Vencidas y Últimos Pagos (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Alumnos con Cuota Vencida con botón directo de Cobro */}
          <OverdueMembersCard />

          {/* Últimos Pagos del Mes */}
          <RecentPaymentsCard />
        </div>
      </div>
    </div>
  )
}
