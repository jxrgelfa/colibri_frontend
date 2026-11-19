import React, { useState } from 'react'
import { Edit3, CheckCircle, AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

function EditClassForm({ cls, trainers, actividades, onUpdate, onClose }) {
  const [formData, setFormData] = useState(() => ({
    name: cls.name || '',
    actividadId: String(cls.actividadId || cls.actividad_id || ''),
    profesorId: String(cls.profesorId || ''),
    schedule: cls.schedule || '',
    room: cls.room || '',
    capacity: Number(cls.capacity) || 20,
    precioBase: Number(cls.precio_base) || 50000,
    porcentajeProfesor: Number(cls.porcentaje_profesor) || 60,
    activo: cls.activo !== false,
  }))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // En la asignación de profesores, mostrar los activos (o el actual para permitir mantenerlo o reasignarlo)
  const activeTrainers = trainers.filter(
    (t) => t.activo || t.id === cls.profesorId
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : ['capacity', 'precioBase', 'porcentajeProfesor'].includes(name)
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setErrorMsg('El nombre de la actividad es obligatorio.')
      return
    }
    if (!formData.profesorId) {
      setErrorMsg('Debes seleccionar un profesor a cargo.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await onUpdate(cls.rawId, {
        nombre: formData.name.trim(),
        profesor_id: Number(formData.profesorId),
        actividad_id: formData.actividadId ? Number(formData.actividadId) : null,
        descripcion: formData.room.trim() || 'Salón Principal',
        dias_horarios: formData.schedule.trim() || 'A convenir',
        precio_base: Number(formData.precioBase) || 50000,
        porcentaje_profesor: Number(formData.porcentajeProfesor) || 60,
        cupo_maximo: Number(formData.capacity) || 20,
        activo: Boolean(formData.activo),
      })

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al actualizar la clase.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">¡Actividad Actualizada con Éxito!</h4>
          <p className="text-sm text-slate-500">
            Los cambios en horarios, cupos y valores han sido guardados en el sistema.
          </p>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Disciplina / Actividad General
            </label>
            <select
              name="actividadId"
              value={formData.actividadId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            >
              <option value="">Sin disciplina general vinculada</option>
              {(actividades || []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Permite agrupar turnos y calcular descuentos multi-actividad con precisión.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre de la Clase / Turno *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Profesor a Cargo *
              </label>
              <select
                name="profesorId"
                value={formData.profesorId}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              >
                {activeTrainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {!t.activo ? '(Inactivo)' : `(Split ${t.porcentaje_honorarios}%)`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cupo Máximo
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                max="100"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cuota Mensual Base ($ ARS) *
              </label>
              <input
                type="number"
                name="precioBase"
                step="1000"
                min="0"
                required
                value={formData.precioBase}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Split Honorarios (% Profesor) *
              </label>
              <select
                name="porcentajeProfesor"
                value={formData.porcentajeProfesor}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              >
                <option value={60}>60% Profesor / 40% Colibrí (Estándar)</option>
                <option value={65}>65% Profesor / 35% Colibrí (Verticales)</option>
                <option value={50}>50% Profesor / 50% Colibrí</option>
                <option value={70}>70% Profesor / 30% Colibrí</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Días y Horarios
              </label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Salón o Espacio
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Estado de Actividad */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Disponibilidad de la Clase
              </span>
              <span className="text-[11px] text-slate-500">
                {formData.activo ? 'Clase ACTIVA (Visible para agendar alumnos y cobros)' : 'Clase PAUSADA / DADA DE BAJA'}
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
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Edit3 className="w-4 h-4 text-cyan-400" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </>
      )}
    </form>
  )
}

export default function EditClassModal() {
  const {
    isEditClassModalOpen,
    closeEditClassModal,
    selectedClassForEdit,
    trainers,
    actividades,
    updateClass,
  } = useGym()

  if (!isEditClassModalOpen || !selectedClassForEdit) return null

  return (
    <Modal
      isOpen={isEditClassModalOpen}
      onClose={closeEditClassModal}
      title="Editar Actividad o Clase"
      subtitle={`Modificar configuración, horarios y aranceles de ${selectedClassForEdit.name}`}
    >
      <EditClassForm
        key={selectedClassForEdit.rawId}
        cls={selectedClassForEdit}
        trainers={trainers}
        actividades={actividades}
        onUpdate={updateClass}
        onClose={closeEditClassModal}
      />
    </Modal>
  )
}
