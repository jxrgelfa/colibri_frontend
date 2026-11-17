import React, { useState } from 'react'
import { Edit3, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

function EditMemberForm({ member, onUpdate, onClose }) {
  const [formData, setFormData] = useState(() => ({
    nombre: member.nombre || member.name?.split(' ')[0] || '',
    apellido: member.apellido || member.name?.split(' ').slice(1).join(' ') || '',
    dni: member.dni === 'S/DNI' ? '' : member.dni || '',
    email: member.email === '—' ? '' : member.email || '',
    telefono: member.phone === '—' ? '' : member.phone || '',
    descuento_familiar: Boolean(member.descuento_familiar),
    activo: member.activo !== false,
    observaciones: member.observaciones || '',
  }))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      await onUpdate(member.rawId, {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni.trim() || null,
        email: formData.email.trim() || null,
        telefono: formData.telefono.trim() || null,
        descuento_familiar: Boolean(formData.descuento_familiar),
        activo: Boolean(formData.activo),
        observaciones: formData.observaciones.trim() || null,
      })

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al actualizar los datos del alumno.')
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
        <h4 className="text-xl font-bold text-slate-900">¡Alumno Actualizado con Éxito!</h4>
        <p className="text-sm text-slate-500">
          Los cambios en los datos personales y aranceles han sido guardados en el sistema.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
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
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
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
            value={formData.apellido}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            DNI / Documento
          </label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Teléfono / WhatsApp
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
        />
      </div>

      {/* Descuento Familiar Directo */}
      <div className="p-3 bg-cyan-50/60 border border-cyan-200 rounded-xl flex items-start gap-3">
        <input
          type="checkbox"
          id="editDescuentoFamiliar"
          name="descuento_familiar"
          checked={formData.descuento_familiar}
          onChange={handleChange}
          className="mt-0.5 w-4 h-4 text-cyan-600 rounded-sm border-slate-300 focus:ring-cyan-500 cursor-pointer"
        />
        <label htmlFor="editDescuentoFamiliar" className="text-xs text-slate-700 cursor-pointer select-none">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            Descuento Familiar Directo (Madre / Hermano directo)
          </span>
          <span className="text-slate-500 block mt-0.5">
            Exento del canon de Colibrí (40% o 35%). Paga únicamente la porción correspondiente a los profesores.
          </span>
        </label>
      </div>

      {/* Estado de Actividad / Padrón */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Estado en Padrón de Alumnos
          </span>
          <span className="text-[11px] text-slate-500">
            {formData.activo ? 'Alumno ACTIVO y elegible para clases y cobros' : 'Alumno DADO DE BAJA (Inactivo)'}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Observaciones
        </label>
        <input
          type="text"
          name="observaciones"
          placeholder="Notas médicas, excepciones, etc."
          value={formData.observaciones}
          onChange={handleChange}
          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
        />
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
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
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </form>
  )
}

export default function EditMemberModal() {
  const {
    isEditMemberModalOpen,
    closeEditMemberModal,
    selectedMemberForEdit,
    updateMember,
  } = useGym()

  if (!isEditMemberModalOpen || !selectedMemberForEdit) return null

  return (
    <Modal
      isOpen={isEditMemberModalOpen}
      onClose={closeEditMemberModal}
      title="Editar Datos del Alumno"
      subtitle={`Modificar información de perfil y estado de ${selectedMemberForEdit.name}`}
    >
      <EditMemberForm
        key={selectedMemberForEdit.rawId}
        member={selectedMemberForEdit}
        onUpdate={updateMember}
        onClose={closeEditMemberModal}
      />
    </Modal>
  )
}
