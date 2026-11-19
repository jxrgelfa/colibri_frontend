import React, { useState } from 'react'
import { CheckCircle, AlertCircle, Save } from 'lucide-react'
import Modal from '../common/Modal'
import ActiveClassesPanel from '../common/ActiveClassesPanel'
import { useGym } from '../../context/useGym'

function TrainerClassesForm({ trainer, classes, trainers, onSave, onClose }) {
  const [selectedClassIds, setSelectedClassIds] = useState(() => {
    return classes
      .filter((c) => c.activo !== false && c.profesorId === trainer.id)
      .map((c) => c.rawId)
  })
  const [reassignments, setReassignments] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleClassesChange = (newSelectedIds, newReassignments) => {
    setSelectedClassIds(newSelectedIds)
    if (newReassignments) {
      setReassignments(newReassignments)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await onSave(trainer.id, selectedClassIds, reassignments)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar la asignación de clases.')
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
        <h4 className="text-xl font-bold text-slate-900">
          ¡Clases Asignadas con Éxito!
        </h4>
        <p className="text-sm text-slate-500">
          Las disciplinas a cargo de {trainer.name} han sido actualizadas en el cronograma.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Panel de Clases Activas */}
      <ActiveClassesPanel
        classes={classes}
        selectedClassIds={selectedClassIds}
        onChangeSelected={handleClassesChange}
        currentTrainerId={trainer.id}
        trainers={trainers}
        title="Disciplinas Activas del Gimnasio"
        subtitle={`Marca las clases activas que dirigirá ${trainer.name} en el cronograma de Colibrí:`}
      />

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
          <Save className="w-4 h-4 text-cyan-400" />
          <span>{isSubmitting ? 'Guardando...' : 'Guardar Clases Asignadas'}</span>
        </button>
      </div>
    </form>
  )
}

export default function TrainerClassesModal() {
  const {
    isTrainerClassesModalOpen,
    closeTrainerClassesModal,
    selectedTrainerForClasses,
    classes,
    trainers,
    assignClassesToTrainer,
  } = useGym()

  if (!isTrainerClassesModalOpen || !selectedTrainerForClasses) return null

  return (
    <Modal
      isOpen={isTrainerClassesModalOpen}
      onClose={closeTrainerClassesModal}
      title={`Clases Dirigidas — ${selectedTrainerForClasses.name}`}
      subtitle="Panel de asignación de disciplinas activas para liquidación de honorarios"
    >
      <TrainerClassesForm
        key={selectedTrainerForClasses.id}
        trainer={selectedTrainerForClasses}
        classes={classes}
        trainers={trainers}
        onSave={assignClassesToTrainer}
        onClose={closeTrainerClassesModal}
      />
    </Modal>
  )
}
