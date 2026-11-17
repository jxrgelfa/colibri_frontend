import React, { useState } from 'react'
import { UserCheck, Trash2, AlertCircle, Plus, CheckCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function ClassStudentsModal() {
  const {
    selectedClassForStudents,
    closeClassStudentsModal,
    members,
    inscripciones,
    enrollStudent,
    removeEnrollment,
  } = useGym()

  const [studentToAddId, setStudentToAddId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!selectedClassForStudents) return null

  const cls = selectedClassForStudents
  const classInscripciones = (inscripciones || []).filter(
    (i) => i.clase_id === cls.rawId && i.activo !== false
  )

  const enrolledStudentIds = classInscripciones.map((i) => i.alumno_id)

  const enrolledStudents = classInscripciones.map((insc) => {
    const student = members.find((m) => m.rawId === insc.alumno_id)
    return {
      inscripcionId: insc.id,
      student,
      nombre: student ? student.name : `Alumno #${insc.alumno_id}`,
      dni: student ? student.dni : '—',
      status: student ? student.status : '—',
      activo: student ? student.activo : true,
    }
  })

  // Alumnos activos disponibles que no están inscriptos aún
  const availableStudents = members.filter(
    (m) => m.activo && !enrolledStudentIds.includes(m.rawId)
  )

  const handleEnrollStudent = async (e) => {
    e.preventDefault()
    if (!studentToAddId) {
      setErrorMsg('Selecciona un alumno para inscribir.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await enrollStudent(
        Number(studentToAddId),
        cls.rawId,
        'Inscripción desde gestión de clase'
      )
      setSuccessMsg('Alumno inscripto con éxito.')
      setStudentToAddId('')
      setTimeout(() => setSuccessMsg(''), 2500)
    } catch (err) {
      setErrorMsg(err.message || 'Error al inscribir alumno en la clase.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (inscripcionId, studentName) => {
    if (window.confirm(`¿Dar de baja a ${studentName} de la disciplina?`)) {
      setIsSubmitting(true)
      setErrorMsg('')
      try {
        await removeEnrollment(inscripcionId)
        setSuccessMsg(`Baja de ${studentName} registrada.`)
        setTimeout(() => setSuccessMsg(''), 2500)
      } catch (err) {
        setErrorMsg(err.message || 'Error al desinscribir al alumno.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Modal
      isOpen={Boolean(selectedClassForStudents)}
      onClose={closeClassStudentsModal}
      title={`Inscriptos — ${cls.name}`}
      subtitle={`${cls.schedule} • Prof. ${cls.trainer} (${cls.room})`}
    >
      <div className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <span className="font-semibold text-slate-600">Ocupación Actual:</span>
          <span className="font-black text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md">
            {enrolledStudents.length} / {cls.capacity} cupos utilizados
          </span>
        </div>

        {/* Formulario rápido para inscribir alumno activo */}
        {cls.activo && availableStudents.length > 0 && (
          <form onSubmit={handleEnrollStudent} className="p-3 bg-cyan-50/50 border border-cyan-200/80 rounded-xl flex items-center gap-2">
            <select
              value={studentToAddId}
              onChange={(e) => setStudentToAddId(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:border-cyan-500 focus:outline-hidden"
            >
              <option value="">-- Inscribir alumno activo a la clase --</option>
              {availableStudents.map((s) => (
                <option key={s.rawId} value={s.rawId}>
                  {s.name} (DNI: {s.dni})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isSubmitting || !studentToAddId}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inscribir</span>
            </button>
          </form>
        )}

        {enrolledStudents.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No hay alumnos inscriptos en esta disciplina aún.</p>
            <p className="text-xs text-slate-400">
              Inscribe alumnos seleccionándolos en el formulario superior o desde "Gestión de Alumnos".
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {enrolledStudents.map((item, index) => (
              <div key={item.inscripcionId} className="py-2.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">
                      {item.nombre}
                    </div>
                    <div className="text-xs text-slate-400">
                      DNI: {item.dni} • Estado: {item.status}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Inscripto
                  </span>
                  <button
                    type="button"
                    title="Dar de baja de la clase"
                    onClick={() => handleRemove(item.inscripcionId, item.nombre)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={closeClassStudentsModal}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}
