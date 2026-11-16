import React from 'react'
import { UserCheck, Trash2, AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function ClassStudentsModal() {
  const {
    selectedClassForStudents,
    closeClassStudentsModal,
    members,
    inscripciones,
    removeEnrollment,
  } = useGym()

  if (!selectedClassForStudents) return null

  const cls = selectedClassForStudents
  const classInscripciones = (inscripciones || []).filter(
    (i) => i.clase_id === cls.rawId && i.activo !== false
  )

  const enrolledStudents = classInscripciones.map((insc) => {
    const student = members.find((m) => m.rawId === insc.alumno_id)
    return {
      inscripcionId: insc.id,
      student,
      nombre: student ? student.name : `Alumno #${insc.alumno_id}`,
      dni: student ? student.dni : '—',
      status: student ? student.status : '—',
    }
  })

  const handleRemove = async (inscripcionId) => {
    if (window.confirm('¿Dar de baja a este alumno de la disciplina?')) {
      await removeEnrollment(inscripcionId)
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
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <span className="font-semibold text-slate-600">Ocupación Actual:</span>
          <span className="font-black text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md">
            {enrolledStudents.length} / {cls.capacity} cupos utilizados
          </span>
        </div>

        {enrolledStudents.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No hay alumnos inscriptos en esta disciplina aún.</p>
            <p className="text-xs text-slate-400">
              Puedes inscribir alumnos desde "Nuevo Alumno" asignándoles esta clase.
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
                    onClick={() => handleRemove(item.inscripcionId)}
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
