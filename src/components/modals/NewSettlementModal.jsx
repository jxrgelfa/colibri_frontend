import React, { useState } from 'react'
import { Receipt, CheckCircle, Calculator } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function NewSettlementModal() {
  const { isNewSettlementModalOpen, closeNewSettlementModal, trainers, addSettlement } = useGym()

  const [trainer, setTrainer] = useState(trainers[0]?.name || 'Marcos Peralta')
  const [period, setPeriod] = useState('Noviembre 2026')
  const [totalClasses, setTotalClasses] = useState(48)
  const [ratePerHour, setRatePerHour] = useState(4000)
  const [status, setStatus] = useState('Pendiente')
  const [isSuccess, setIsSuccess] = useState(false)

  const commission = totalClasses * ratePerHour

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!trainer) return

    addSettlement({
      trainer,
      period,
      totalClasses,
      commission,
      status,
    })

    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      closeNewSettlementModal()
    }, 1200)
  }

  return (
    <Modal
      isOpen={isNewSettlementModalOpen}
      onClose={closeNewSettlementModal}
      title="Generar Nueva Liquidación de Honorarios"
      subtitle="Calcular y emitir comprobante de pago a profesores"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">¡Liquidación Generada con Éxito!</h4>
          <p className="text-sm text-slate-500">
            Se ha añadido al registro de liquidaciones y actualizado los totales de Colibrí.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seleccionar Profesor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Profesor / Instructor *
            </label>
            <select
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
            >
              {trainers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.specialty})
                </option>
              ))}
            </select>
          </div>

          {/* Período */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Período a Liquidar *
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
            >
              <option value="Noviembre 2026">Noviembre 2026 (Mes Actual)</option>
              <option value="Octubre 2026">Octubre 2026</option>
              <option value="Diciembre 2026">Diciembre 2026 (Adelanto)</option>
            </select>
          </div>

          {/* Horas de clase y valor por hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Horas / Clases Dictadas
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={totalClasses}
                onChange={(e) => setTotalClasses(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Honorario por Hora ($)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                value={ratePerHour}
                onChange={(e) => setRatePerHour(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Subtotal calculado */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Calculator className="w-4 h-4 text-cyan-600" />
              <span>Total a Liquidar:</span>
            </div>
            <span className="text-lg font-black text-slate-900">
              ${commission.toLocaleString('es-AR')}
            </span>
          </div>

          {/* Estado inicial */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Estado de la Liquidación
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Pendiente')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  status === 'Pendiente'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Pendiente de Pago
              </button>
              <button
                type="button"
                onClick={() => setStatus('Pagado')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  status === 'Pagado'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Liquidado / Pagado
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeNewSettlementModal}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>Confirmar Liquidación</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
