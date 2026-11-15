import React from 'react'
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

export default function DashboardView() {
  const { stats, setCurrentView } = useGym()

  // Format currency in Argentine Pesos (or standard currency)
  const formattedRevenue = `$${stats.monthlyRevenue.toLocaleString('es-AR')}`
  const formattedMembers = stats.activeMembers.toLocaleString('es-AR')

  return (
    <div className="space-y-6">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Dashboard de Gestión
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Métricas clave, estado de cobranzas y gestión diaria de Colibrí
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-cyan-600" />
          <span>Noviembre 2026 • Período en Curso</span>
        </div>
      </div>

      {/* 1. Recuadros Principales requeridos por el usuario */}
      <section aria-labelledby="estadisticas-rapidas">
        <h3 id="estadisticas-rapidas" className="sr-only">
          Estadísticas Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Recuadro 1: Alumnos Activos */}
          <StatCard
            title="Alumnos Activos"
            value={formattedMembers}
            subtitle="Socios con cuota vigente"
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
                <span className="text-3xl font-extrabold tracking-tight">98.5%</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +1.2% este mes
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: '98.5%' }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Solo <strong>{stats.overdueCount} alumnos</strong> tienen la cuota en mora. Puedes enviarles un aviso de regularización o registrar el pago directamente.
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
