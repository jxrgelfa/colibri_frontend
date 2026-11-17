import React, { useState } from 'react'
import { CalendarDays, CheckCircle, UserPlus, AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function NewClassModal() {
  const {
    isNewClassModalOpen,
    closeNewClassModal,
    trainers,
    addClass,
    openNewTrainerModal,
  } = useGym()

  const [name, setName] = useState('')
  const [profesorId, setProfesorId] = useState('')
  const [schedule, setSchedule] = useState('Lun y Mié 18:00')
  const [room, setRoom] = useState('Salón Principal')
  const [capacity, setCapacity] = useState(20)
  const [precioBase, setPrecioBase] = useState(50000)
  const [customPct, setCustomPct] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const activeTrainers = trainers.filter((t) => t.activo)
  const effectiveProfesorId = profesorId || (activeTrainers[0] ? String(activeTrainers[0].id) : '')
  const selectedTrainer = activeTrainers.find((t) => String(t.id) === effectiveProfesorId)
  const effectivePct = customPct !== null ? customPct : (selectedTrainer?.porcentaje_honorarios || 60)

  const handleTrainerChange = (e) => {
    const selectedId = e.target.value
    setProfesorId(selectedId)
    const found = activeTrainers.find((t) => String(t.id) === selectedId)
    if (found) {
      setCustomPct(found.porcentaje_honorarios || 60)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMsg('El nombre de la actividad es obligatorio.')
      return
    }
    if (!effectiveProfesorId) {
      setErrorMsg('Debes seleccionar un profesor a cargo.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await addClass({
        name,
        profesorId: Number(effectiveProfesorId),
        schedule,
        room,
        capacity: Number(capacity) || 20,
        precioBase: Number(precioBase) || 50000,
        porcentajeProfesor: Number(effectivePct) || 60,
      })

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setName('')
        closeNewClassModal()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al crear la clase.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isNewClassModalOpen}
      onClose={closeNewClassModal}
      title="Nueva Disciplina o Clase"
      subtitle="Crear una nueva disciplina acrobática en Colibrí"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">¡Clase Creada con Éxito!</h4>
          <p className="text-sm text-slate-500">
            La nueva actividad ya se encuentra disponible en el catálogo de clases de Colibrí.
          </p>
        </div>
      ) : activeTrainers.length === 0 ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              No hay profesores activos disponibles
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Cada disciplina debe tener un profesor activo asignado para liquidar sus honorarios. Da de alta o reactiva a un docente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              closeNewClassModal()
              openNewTrainerModal()
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>Dar de Alta un Profesor</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre de la Clase / Disciplina *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Acrobacia en Telas, Verticales, Trapecio Fijo, Lira"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Profesor a Cargo *
              </label>
              <select
                value={effectiveProfesorId}
                onChange={handleTrainerChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              >
                {activeTrainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.porcentaje_honorarios}%)
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
                min="1"
                max="100"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
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
                step="1000"
                min="0"
                required
                value={precioBase}
                onChange={(e) => setPrecioBase(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 inline-block">
                Cuota estándar: $50.000 ARS
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Split Honorarios (% Profesor) *
              </label>
              <select
                value={effectivePct}
                onChange={(e) => setCustomPct(Number(e.target.value))}
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
                placeholder="Ej: Lun y Mié 18:00 - 19:30"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Salón o Espacio
              </label>
              <input
                type="text"
                placeholder="Ej: Salón A, Sala Telas"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeNewClassModal}
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
              <CalendarDays className="w-4 h-4 text-cyan-400" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Clase'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
