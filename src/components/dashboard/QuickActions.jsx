import React from 'react'
import { CreditCard, UserPlus, Zap } from 'lucide-react'
import { useGym } from '../../context/useGym'

export default function QuickActions() {
  const { openPaymentModal, openNewMemberModal } = useGym()

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Acciones Rápidas</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Accesos directos</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Botón Cobrar Cuota */}
        <button
          type="button"
          onClick={() => openPaymentModal()}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-slate-900/50"
        >
          <CreditCard className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Cobrar Cuota</span>
        </button>

        {/* Botón Nuevo Alumno */}
        <button
          type="button"
          onClick={openNewMemberModal}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-slate-900/50"
        >
          <UserPlus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Nuevo Alumno</span>
        </button>
      </div>

      <p className="mt-4 text-[11px] text-slate-400 text-center">
        Registra cobros instantáneos o da de alta nuevos alumnos en Colibrí.
      </p>
    </div>
  )
}
