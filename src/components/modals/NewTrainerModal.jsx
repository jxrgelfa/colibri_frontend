import React, { useState } from 'react'
import { UserCheck, CheckCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function NewTrainerModal() {
  const { isNewTrainerModalOpen, closeNewTrainerModal, addTrainer } = useGym()

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    cbu_alias: '',
    porcentaje_honorarios: 60,
    observaciones: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'porcentaje_honorarios' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setErrorMsg('El nombre y apellido son obligatorios.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await addTrainer(formData)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          nombre: '',
          apellido: '',
          dni: '',
          email: '',
          telefono: '',
          cbu_alias: '',
          porcentaje_honorarios: 60,
          observaciones: '',
        })
        closeNewTrainerModal()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al crear el profesor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isNewTrainerModalOpen}
      onClose={closeNewTrainerModal}
      title="Alta de Profesor / Instructor"
      subtitle="Registrar nuevo docente en el staff de Colibrí"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">¡Profesor Registrado con Éxito!</h4>
          <p className="text-sm text-slate-500">
            Ahora podrás asignarlo a disciplinas y liquidar sus honorarios mensuales.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                required
                placeholder="Ej. Valentina"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                required
                placeholder="Ej. Solís"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                DNI / Identificación
              </label>
              <input
                type="text"
                name="dni"
                placeholder="Ej. 38.452.190"
                value={formData.dni}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                name="telefono"
                placeholder="Ej. +54 9 11 4829-1102"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="profesor@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                CBU o Alias para Transferencias
              </label>
              <input
                type="text"
                name="cbu_alias"
                placeholder="Ej. valen.telas.mp"
                value={formData.cbu_alias}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Especialidad / Disciplina
              </label>
              <input
                type="text"
                name="observaciones"
                placeholder="Ej. Telas y Lira"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                % Honorarios Estándar (Split)
              </label>
              <select
                name="porcentaje_honorarios"
                value={formData.porcentaje_honorarios}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              >
                <option value={60}>60% (Regla Universal Colibrí 60/40)</option>
                <option value={65}>65% (Split Especial 65/35)</option>
                <option value={50}>50% (Mitad 50/50)</option>
                <option value={70}>70% (Especial 70/30)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeNewTrainerModal}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Profesor'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
