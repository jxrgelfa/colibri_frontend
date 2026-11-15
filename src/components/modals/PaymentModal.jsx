import React, { useState } from 'react'
import { CreditCard, CheckCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

function PaymentForm({ member, members, onRecordPayment, onClose }) {
  const [selectedMemberName, setSelectedMemberName] = useState(member?.name || (members[0]?.name ?? ''))
  const [selectedPlan, setSelectedPlan] = useState(member?.plan || (members[0]?.plan ?? 'Acrobacia en Telas'))
  const [amount, setAmount] = useState(member?.amount || (members[0]?.amount ?? 50000))
  const [method, setMethod] = useState('Efectivo')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleMemberChange = (e) => {
    const memberName = e.target.value
    setSelectedMemberName(memberName)
    const found = members.find((m) => m.name === memberName)
    if (found) {
      setSelectedPlan(found.plan)
      setAmount(found.amount)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedMemberName) return

    onRecordPayment({
      memberName: selectedMemberName,
      plan: selectedPlan,
      amount,
      method,
    })

    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1200)
  }

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-slate-900">¡Pago Registrado con Éxito!</h4>
        <p className="text-sm text-slate-500">
          Se ha actualizado el estado del socio y la recaudación del mes.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alumno selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Seleccionar Alumno
        </label>
        <div className="relative">
          <select
            value={selectedMemberName}
            onChange={handleMemberChange}
            required
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
          >
            {members.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name} — {m.plan} ({m.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Plan & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Plan Asociado
          </label>
          <input
            type="text"
            value={selectedPlan}
            readOnly
            className="w-full px-3.5 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Monto a Cobrar ($)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              min="0"
              step="500"
              className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Método de Pago
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Efectivo', 'Transferencia', 'Tarjeta Débito', 'Mercado Pago'].map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMethod(m)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
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

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Confirmar Cobro</span>
        </button>
      </div>
    </form>
  )
}

export default function PaymentModal() {
  const { isPaymentModalOpen, closePaymentModal, selectedMemberForPayment, members, recordPayment } = useGym()

  return (
    <Modal
      isOpen={isPaymentModalOpen}
      onClose={closePaymentModal}
      title="Cobrar Cuota — Colibrí"
      subtitle="Registrar abono mensual de cuota de alumno"
    >
      {isPaymentModalOpen && (
        <PaymentForm
          key={selectedMemberForPayment?.id || 'default-payment'}
          member={selectedMemberForPayment}
          members={members}
          onRecordPayment={recordPayment}
          onClose={closePaymentModal}
        />
      )}
    </Modal>
  )
}
