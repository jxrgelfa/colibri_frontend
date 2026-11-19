import React, { useState } from 'react'
import { Edit3, CheckCircle, AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import ActiveClassesPanel from '../common/ActiveClassesPanel'
import { useGym } from '../../context/useGym'

function EditTrainerForm({ trainer, classes, trainers, onUpdate, onClose }) {
  const [formData, setFormData] = useState(() => ({
    nombre: trainer.nombre || trainer.name?.split(' ')[0] || '',
    apellido: trainer.apellido || trainer.name?.split(' ').slice(1).join(' ') || '',
    dni: trainer.dni === '—' ? '' : trainer.dni || '',
    email: trainer.email === '—' ? '' : trainer.email || '',
    telefono: trainer.telefono || (trainer.phone === '—' ? '' : trainer.phone) || '',
    cbu_alias: trainer.cbu_alias === '—' ? '' : trainer.cbu_alias || '',
    porcentaje_honorarios: trainer.porcentaje_honorarios || 60,
    observaciones: trainer.observaciones || '',
    activo: trainer.activo !== false,
  }))

  const [selectedClassIds, setSelectedClassIds] = useState(() => {
    return (classes || [])
      .filter((c) => c.activo !== false && c.profesorId === trainer.id)
      .map((c) => c.rawId)
  })
  const [reassignments, setReassignments] = useState({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'porcentaje_honorarios' ? Number(value) : value),
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
      await onUpdate(
        trainer.id,
        {
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          dni: formData.dni.trim() || null,
          email: formData.email.trim() || null,
          telefono: formData.telefono.trim() || null,
          cbu_alias: formData.cbu_alias.trim() || null,
          porcentaje_honorarios: Number(formData.porcentaje_honorarios) || 60,
          observaciones: formData.observaciones.trim() || null,
          activo: Boolean(formData.activo),
        },
        selectedClassIds,
        reassignments
      )

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al actualizar el profesor.')
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
        <h4 className="text-xl font-bold text-slate-900">¡Profesor Actualizado con Éxito!</h4>
        <p className="text-sm text-slate-500">
          Los cambios en el staff docente han sido guardados en el sistema.
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
            DNI / Identificación
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            CBU o Alias para Transferencias
          </label>
          <input
            type="text"
            name="cbu_alias"
            value={formData.cbu_alias}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            % Honorarios Estándar (Split) *
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Notas / Observaciones (Opcional)
          </label>
          <input
            type="text"
            name="observaciones"
            placeholder="Ej. Notas de perfil, disponibilidad..."
            value={formData.observaciones}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Panel de Clases Activas que va a dirigir */}
      <div className="pt-2 border-t border-slate-100">
        <ActiveClassesPanel
          classes={classes}
          selectedClassIds={selectedClassIds}
          onChangeSelected={(ids, reassigns) => {
            setSelectedClassIds(ids)
            if (reassigns) setReassignments(reassigns)
          }}
          currentTrainerId={trainer.id}
          trainers={trainers}
          title="Clases Activas que va a dirigir"
          subtitle={`Gestiona qué disciplinas activas de Colibrí dictará ${trainer.name}:`}
        />
      </div>

      {/* Estado de Actividad */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Estado del Profesor en el Staff
          </span>
          <span className="text-[11px] text-slate-500">
            {formData.activo ? 'Profesor ACTIVO y disponible para asignar a clases' : 'Profesor DADO DE BAJA (Inactivo)'}
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

export default function EditTrainerModal() {
  const {
    isEditTrainerModalOpen,
    closeEditTrainerModal,
    selectedTrainerForEdit,
    classes,
    trainers,
    updateTrainer,
  } = useGym()

  if (!isEditTrainerModalOpen || !selectedTrainerForEdit) return null

  return (
    <Modal
      isOpen={isEditTrainerModalOpen}
      onClose={closeEditTrainerModal}
      title="Editar Profesor / Instructor"
      subtitle={`Modificar información de perfil y split de ${selectedTrainerForEdit.name}`}
    >
      <EditTrainerForm
        key={selectedTrainerForEdit.id}
        trainer={selectedTrainerForEdit}
        classes={classes}
        trainers={trainers}
        onUpdate={updateTrainer}
        onClose={closeEditTrainerModal}
      />
    </Modal>
  )
}
