import React, { useState } from 'react'
import { Search, Menu, Bell, LogOut } from 'lucide-react'
import { useGym } from '../../context/useGym'
import { useAuth } from '../../context/useAuth'

export default function Header() {
  const { setIsMobileSidebarOpen } = useGym()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const displayName = user?.nombre || 'Socia Colibrí'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Left side: Hamburger button (mobile) + Greeting */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Hola, {displayName.split(' ')[0]}
          </h1>
          <p className="hidden sm:block text-xs font-medium text-slate-500">
            Panel de control operativo • Colibrí
          </p>
        </div>
      </div>

      {/* Right side: Search bar + Quick Header Actions + Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscador global..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden transition-all"
          />
        </div>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Ver notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* User profile avatar & logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Avatar de Socia"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800">{displayName}</span>
            <span className="text-[10px] text-cyan-600 font-semibold">Socia Administradora</span>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
