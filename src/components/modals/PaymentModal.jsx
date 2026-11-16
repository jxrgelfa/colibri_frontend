import React, { useState } from 'react'
import { CreditCard, CheckCircle, UserPlus, AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

const MESES = [
  { num: 1, name: 'Enero' },
  { num: 2, name: 'Febrero' },
  { num: 3, name: 'Marzo' },
  { num: 4, name: 'Abril' },
  { num: 5, name: 'Mayo' },
  { num: 6, name: 'Junio' },
  { num: 7, name: 'Julio' },
  { num: 8, name: 'Agosto' },
  { num: 9, name: 'Septiembre' },
  { num: 10, name: 'Octubre' },
  { num: 11, name: 'Noviembre' },
  { num: 12, name: 'Diciembre' },
]

function PaymentForm({ member, members, onRecordPayment, onClose }) {
  const initialAlumno = member || members[0]

  const [selectedRawId, setSelectedRawId] = useState(
    initialAlumno ? String(initialAlumno.rawId) : ''
  )
  const [selectedMes, setSelectedMes] = useState(() => new Date().getMonth() + 1)
  const [selectedAnio, setSelectedAnio] = useState(() => new Date().getFullYear())
  const [method, setMethod] = useState('Efectivo')
  const [observaciones, setObservaciones] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const currentMember = members.find((m) => String(m.rawId) === String(selectedRawId))
  const amountToPay = currentMember ? currentMember.amount : 0

  const handleMemberChange = (e) => {
    setSelectedRawId(e.target.value)
    setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentMember) {
      setErrorMsg('Selecciona un alumno para continuar.')
      return
    }

    if (!currentMember.clasesIds || currentMember.clasesIds.length === 0) {
      setErrorMsg('El alumno no tiene ninguna disciplina asignada. Asigna una disciplina antes de cobrar.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await onRecordPayment({
        alumnoId: currentMember.rawId,
        mes: Number(selectedMes),
        anio: Number(selectedAnio),
        method,
        clasesIds: currentMember.clasesIds,
        observaciones: observaciones || null,
      })

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar el pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-slate-900">¡Pago Registrado con Éxito!</h4>
        <p className="text-sm text-slate-500">
          Se ha actualizado el estado de la cuota en el backend y la liquidación del profesor.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Alumno selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Seleccionar Alumno *
        </label>
        <select
          value={selectedRawId}
          onChange={handleMemberChange}
          required
          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
        >
          {members.map((m) => (
            <option key={m.rawId} value={m.rawId}>
              {m.name} — {m.plan} ({m.status})
            </option>
          ))}
        </select>
      </div>

      {/* Período (Mes y Año) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mes a Abonar
          </label>
          <select
            value={selectedMes}
            onChange={(e) => setSelectedMes(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
          >
            {MESES.map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Año
          </label>
          <input
            type="number"
            min="2024"
            max="2035"
            value={selectedAnio}
            onChange={(e) => setSelectedAnio(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Plan & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Disciplinas Asignadas
          </label>
          <input
            type="text"
            value={currentMember?.plan || 'Sin disciplinas'}
            readOnly
            className="w-full px-3.5 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Monto Total a Cobrar ($ ARS)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold">
              $
            </span>
            <input
              type="text"
              readOnly
              value={amountToPay.toLocaleString('es-AR')}
              className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-black cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Método de Recepción
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Efectivo', 'Transferencia', 'Tarjeta Débito', 'Mercado Pago'].map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMethod(m)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                method === m
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Comentarios / Observaciones (Opcional)
        </label>
        <input
          type="text"
          placeholder="Ej: Comprobante MP #128941"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          <span>{isSubmitting ? 'Registrando...' : 'Confirmar Cobro'}</span>
        </button>
      </div>
    </form>
  )
}

export default function PaymentModal() {
  const {
    isPaymentModalOpen,
    closePaymentModal,
    selectedMemberForPayment,
    members,
    recordPayment,
    openNewMemberModal,
  } = useGym()

  return (
    <Modal
      isOpen={isPaymentModalOpen}
      onClose={closePaymentModal}
      title="Cobrar Cuota — Colibrí"
      subtitle="Registrar abono mensual de cuota de alumno y calcular split"
    >
      {isPaymentModalOpen && (
        members.length === 0 ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                No hay alumnos en el padrón
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Para registrar un cobro, primero debes registrar al alumno en el sistema.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                closePaymentModal()
                openNewMemberModal()
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Registrar Alumno</span>
            </button>
          </div>
        ) : (
          <PaymentForm
            key={selectedMemberForPayment?.id || 'default-payment'}
            member={selectedMemberForPayment}
            members={members}
            onRecordPayment={recordPayment}
            onClose={closePaymentModal}
          />
        )
      )}
    </Modal>
  )
}
