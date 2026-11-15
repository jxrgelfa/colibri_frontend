import React, { useState } from 'react'
import { CalendarDays, CheckCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function NewClassModal() {
  const { isNewClassModalOpen, closeNewClassModal, trainers, addClass } = useGym()

  const [name, setName] = useState('')
  const [trainer, setTrainer] = useState(trainers[0]?.name || 'Romina Navarro')
  const [schedule, setSchedule] = useState('Lun - Mié - Vie 18:00')
  const [room, setRoom] = useState('Salón A')
  const [capacity, setCapacity] = useState(20)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    addClass({
      name,
      trainer,
      schedule,
      room,
      capacity,
    })

    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setName('')
      closeNewClassModal()
    }, 1200)
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
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre de la Clase / Disciplina *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Acrobacia en Telas, Verticales, Trapecio, Lira"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Profesor a Cargo
              </label>
              <select
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
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
                min="5"
                max="100"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Días y Horario
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Mar y Jue 19:30"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Salón o Sala
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Salón A, Box 1, Sala Ciclo"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeNewClassModal}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-cyan-400" />
              <span>Guardar Clase</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
