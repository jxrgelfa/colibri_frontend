import React, { useState } from 'react'
import { UserPlus, CheckCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

const AVAILABLE_PLANS = [
  { name: 'Acrobacia en Telas', price: 50000 },
  { name: 'Trapecio Fijo', price: 50000 },
  { name: 'Lira / Aro Acrobático', price: 50000 },
  { name: 'Verticales (Split 65/35)', price: 50000 },
  { name: 'Flexibilidad & Contorsión', price: 50000 },
  { name: 'Pase Libre Acrobacias', price: 85000 },
  { name: 'Descuento Familiar (Solo Profesor)', price: 30000 },
]

export default function NewMemberModal() {
  const { isNewMemberModalOpen, closeNewMemberModal, addMember } = useGym()

  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    phone: '',
    plan: AVAILABLE_PLANS[0].name,
    amount: AVAILABLE_PLANS[0].price,
    payNow: true,
    paymentMethod: 'Efectivo',
  })
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePlanChange = (e) => {
    const planName = e.target.value
    const found = AVAILABLE_PLANS.find((p) => p.name === planName)
    setFormData((prev) => ({
      ...prev,
      plan: planName,
      amount: found ? found.price : 28000,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    addMember(formData)

    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      // reset form
      setFormData({
        name: '',
        dni: '',
        email: '',
        phone: '',
        plan: AVAILABLE_PLANS[0].name,
        amount: AVAILABLE_PLANS[0].price,
        payNow: true,
        paymentMethod: 'Efectivo',
      })
      closeNewMemberModal()
    }, 1200)
  }

  return (
    <Modal
      isOpen={isNewMemberModalOpen}
      onClose={closeNewMemberModal}
      title="Alta de Nuevo Alumno"
      subtitle="Registrar nuevo alumno en el padrón de Colibrí"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">¡Alumno Registrado con Éxito!</h4>
          <p className="text-sm text-slate-500">
            Se ha incrementado el recuadro de Alumnos Activos en el Dashboard.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre Completo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Facundo Gómez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            />
          </div>

          {/* DNI & Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                DNI / Identificación
              </label>
              <input
                type="text"
                placeholder="Ej: 40.123.456"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="Ej: +54 9 11 5555-1234"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="Ej: alumno@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            />
          </div>

          {/* Plan de Membresía */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Plan Seleccionado
              </label>
              <select
                value={formData.plan}
                onChange={handlePlanChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              >
                {AVAILABLE_PLANS.map((plan) => (
                  <option key={plan.name} value={plan.name}>
                    {plan.name} (${plan.price.toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cuota Mensual ($)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Cobrar cuota inicial */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.payNow}
                onChange={(e) => setFormData({ ...formData, payNow: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">
                Cobrar primera cuota ahora mismo
              </span>
            </label>

            {formData.payNow && (
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {['Efectivo', 'Transferencia', 'Tarjeta'].map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      formData.paymentMethod === method
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeNewMemberModal}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar Alumno</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
