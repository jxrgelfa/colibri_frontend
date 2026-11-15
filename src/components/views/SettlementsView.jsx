import React from 'react'
import { Receipt, CheckCircle, Clock } from 'lucide-react'
import { useGym } from '../../context/useGym'

export default function SettlementsView() {
  const { settlements, openNewSettlementModal, openSettlementDetailModal } = useGym()

  const totalPaid = settlements
    .filter((s) => s.status === 'Pagado')
    .reduce((acc, s) => acc + s.commission, 0)
  const totalPending = settlements
    .filter((s) => s.status === 'Pendiente')
    .reduce((acc, s) => acc + s.commission, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Liquidaciones de Profesores
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Cálculo de honorarios según cuotas cobradas (Split 60/40 y excepciones de Colibrí)
          </p>
        </div>

        <button
          type="button"
          onClick={openNewSettlementModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Receipt className="w-4 h-4 text-cyan-400" />
          <span>Generar Nueva Liquidación</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Liquidado (Pagado)
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            ${totalPaid.toLocaleString('es-AR')}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Comprobantes emitidos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pendiente de Liquidar
          </span>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">
            ${totalPending.toLocaleString('es-AR')}
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            {settlements.filter((s) => s.status === 'Pendiente').length} liquidaciones pendientes
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Fecha de Cierre Mensual
          </span>
          <div className="text-3xl font-extrabold text-cyan-600 mt-1">Día 10</div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Próximo cierre: 10/12/2026</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">ID Liquidación</th>
                <th className="py-3 px-4">Profesor / Entrenador</th>
                <th className="py-3 px-4">Período</th>
                <th className="py-3 px-4 text-center">Clases Impartidas</th>
                <th className="py-3 px-4 text-right">Honorarios a Cobrar</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{s.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.trainer}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.period}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {s.totalClasses} hs
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    ${s.commission.toLocaleString('es-AR')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {s.status === 'Pagado' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Pagado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => openSettlementDetailModal(s)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
