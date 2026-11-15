import React from 'react'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  CreditCard,
  Receipt,
  Settings,
  X,
  LogOut,
} from 'lucide-react'
import Logo from '../common/Logo'
import { useGym } from '../../context/useGym'
import { useAuth } from '../../context/useAuth'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alumnos', label: 'Alumnos', icon: Users, badge: null },
  { id: 'profesores', label: 'Profesores', icon: GraduationCap, badge: null },
  { id: 'clases', label: 'Clases', icon: CalendarDays, badge: null },
  { id: 'pagos', label: 'Pagos', icon: CreditCard, badge: null },
  { id: 'liquidaciones', label: 'Liquidaciones', icon: Receipt, badge: null },
  { id: 'configuracion', label: 'Configuración', icon: Settings, badge: null },
]

export default function Sidebar() {
  const { currentView, setCurrentView, isMobileSidebarOpen, setIsMobileSidebarOpen, stats } = useGym()
  const { logout } = useAuth()

  const handleNavClick = (id) => {
    setCurrentView(id)
    setIsMobileSidebarOpen(false)
  }

  return (
    <>
      {/* Backdrop overlay for mobile screens */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container - siempre anclado a la izquierda con 100vh de altura completa */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#121620] text-slate-300 border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:self-start`}
      >
        {/* Top Header with Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 shrink-0">
          <Logo />
          {/* Close button for mobile */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden focus:outline-hidden"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list con scroll interno en caso de pantallas muy reducidas */}
        <nav
          className="flex-1 px-3 py-3 space-y-1 overflow-y-auto overscroll-contain"
          aria-label="Menú principal de Colibrí"
        >
          <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Módulos del Sistema
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-xs border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.id === 'alumnos' && stats.overdueCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {stats.overdueCount}
                  </span>
                )}

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer info / Gym Status anclado abajo */}
        <div className="p-3 m-3 space-y-2 shrink-0">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-200 text-xs">Sede Central</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Abierto
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">Horario: 07:00 a 23:00 hs</p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800/80 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
