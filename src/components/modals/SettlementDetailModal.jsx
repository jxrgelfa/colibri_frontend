import React from 'react'
import { CheckCircle, Clock, Printer } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function SettlementDetailModal() {
  const { selectedSettlementForDetail, closeSettlementDetailModal, updateSettlementStatus } = useGym()

  if (!selectedSettlementForDetail) return null

  const s = selectedSettlementForDetail

  const handleToggleStatus = () => {
    const newStatus = s.status === 'Pagado' ? 'Pendiente' : 'Pagado'
    updateSettlementStatus(s.id, newStatus)
  }

  return (
    <Modal
      isOpen={Boolean(selectedSettlementForDetail)}
      onClose={closeSettlementDetailModal}
      title="Comprobante de Liquidación"
      subtitle={`Referencia oficial: ${s.id}`}
    >
      <div className="space-y-5">
        {/* Encabezado con estado */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Estado de Pago
            </span>
            <div className="mt-1 flex items-center gap-2">
              {s.status === 'Pagado' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Liquidado y Pagado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Pendiente de Pago
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              s.status === 'Pagado'
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            {s.status === 'Pagado' ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
          </button>
        </div>

        {/* Detalle */}
        <div className="divide-y divide-slate-100 text-sm">
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-500">Profesor:</span>
            <span className="font-bold text-slate-900">{s.trainer}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-500">Período:</span>
            <span className="font-semibold text-slate-800">{s.period}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-500">Horas / Clases Dictadas:</span>
            <span className="font-bold text-slate-800">{s.totalClasses} hs</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-500">Fecha de Registro:</span>
            <span className="text-slate-700">{s.date}</span>
          </div>
          <div className="py-3 flex justify-between items-center bg-slate-50/80 px-3 rounded-xl mt-2">
            <span className="text-sm font-bold text-slate-800">Honorarios Netos:</span>
            <span className="text-xl font-black text-slate-900">
              ${s.commission.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimir Comprobante</span>
          </button>

          <button
            type="button"
            onClick={closeSettlementDetailModal}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}
