import React, { useState } from 'react'
import { Calendar, Trash2, Plus, AlertCircle, CheckCircle, GraduationCap, Sparkles } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function MemberClassesModal() {
  const {
    selectedMemberForClasses,
    closeMemberClassesModal,
    classes,
    inscripciones,
    enrollStudent,
    removeEnrollment,
  } = useGym()

  const [selectedClassToAdd, setSelectedClassToAdd] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!selectedMemberForClasses) return null

  const member = selectedMemberForClasses

  // Inscripciones activas de este alumno
  const memberInscripciones = (inscripciones || []).filter(
    (i) => i.alumno_id === member.rawId && i.activo !== false
  )

  const enrolledClassIds = memberInscripciones.map((i) => i.clase_id)

  // Clases en las que está inscripto
  const myEnrolledClasses = memberInscripciones
    .map((insc) => {
      const cls = classes.find((c) => c.rawId === insc.clase_id)
      return {
        inscripcionId: insc.id,
        clase: cls || { name: `Clase #${insc.clase_id}`, schedule: '—', trainer: '—', precio_base: 50000 },
      }
    })

  // Clases activas en las que el alumno NO está inscripto aún
  const availableClasses = classes.filter(
    (c) => c.activo && !enrolledClassIds.includes(c.rawId)
  )

  const handleEnroll = async (e) => {
    e.preventDefault()
    if (!selectedClassToAdd) {
      setErrorMsg('Selecciona una clase para agendar al alumno.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await enrollStudent(
        member.rawId,
        Number(selectedClassToAdd),
        observaciones || 'Inscripción desde gestión de alumno'
      )
      setSuccessMsg('¡Alumno agendado a la disciplina con éxito!')
      setSelectedClassToAdd('')
      setObservaciones('')
      setTimeout(() => setSuccessMsg(''), 2500)
    } catch (err) {
      setErrorMsg(err.message || 'Error al agendar la clase.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (inscripcionId, className) => {
    if (window.confirm(`¿Seguro que deseas dar de baja al alumno de la clase "${className}"?`)) {
      setIsSubmitting(true)
      setErrorMsg('')
      try {
        await removeEnrollment(inscripcionId)
        setSuccessMsg(`Baja de "${className}" registrada correctamente.`)
        setTimeout(() => setSuccessMsg(''), 2500)
      } catch (err) {
        setErrorMsg(err.message || 'Error al eliminar la inscripción.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Modal
      isOpen={Boolean(selectedMemberForClasses)}
      onClose={closeMemberClassesModal}
      title={`Agendar Clases — ${member.name}`}
      subtitle={`DNI: ${member.dni} • Padrón de disciplinas activas`}
    >
      <div className="space-y-5">
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

        {/* Clases Actualmente Agendadas */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Disciplinas Actuales ({myEnrolledClasses.length})
            </h4>
            <span className="text-xs font-bold text-slate-800">
              Cuota Total: ${member.amount.toLocaleString('es-AR')}
            </span>
          </div>

          {(() => {
            const distinctActsCount = new Set(
              myEnrolledClasses.map((item) => item.clase?.actividad_id || item.clase?.actividadId || item.clase?.id)
            ).size
            const hasMultiDiscount = distinctActsCount >= 2 && !member.descuento_familiar

            if (hasMultiDiscount) {
              return (
                <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 text-xs text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold">Beneficio 10% Multi-actividad Activo: </span>
                    Al cursar {distinctActsCount} actividades distintas, se aplica un 10% de descuento automático en el total mensual.
                  </div>
                </div>
              )
            }

            if (myEnrolledClasses.length >= 2 && !member.descuento_familiar) {
              return (
                <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
                  <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-semibold">Múltiples turnos de la misma actividad: </span>
                    El alumno cursa {myEnrolledClasses.length} clases de la misma disciplina. El beneficio del 10% aplica al combinar actividades distintas.
                  </div>
                </div>
              )
            }

            return null
          })()}

          {myEnrolledClasses.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-slate-200/90 rounded-2xl text-center space-y-1">
              <GraduationCap className="w-7 h-7 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Sin disciplinas agendadas</p>
              <p className="text-[11px] text-slate-400">
                Este alumno no está cursando ninguna clase activa actualmente.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 bg-slate-50/70 border border-slate-200/90 rounded-2xl overflow-hidden">
              {myEnrolledClasses.map(({ inscripcionId, clase }) => (
                <div
                  key={inscripcionId}
                  className="p-3 flex items-center justify-between text-xs hover:bg-white transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm">
                      {clase.name}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Prof. {clase.trainer} • {clase.schedule}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">
                      ${Number(clase.precio_base || 50000).toLocaleString('es-AR')}
                    </span>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRemove(inscripcionId, clase.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                      title={`Dar de baja de ${clase.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario para Agendar a una Nueva Clase */}
        <form onSubmit={handleEnroll} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Plus className="w-4 h-4 text-cyan-600" />
            <span>Inscribir en otra Disciplina / Horario</span>
          </div>

          {availableClasses.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              No hay otras disciplinas activas disponibles para inscribir a este alumno.
            </p>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Seleccionar Clase Activa *
                </label>
                <select
                  value={selectedClassToAdd}
                  onChange={(e) => setSelectedClassToAdd(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="">-- Elige una clase para agendar --</option>
                  {availableClasses.map((c) => (
                    <option key={c.rawId} value={c.rawId}>
                      {c.name} — Prof. {c.trainer} • {c.schedule} (${Number(c.precio_base).toLocaleString('es-AR')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Observaciones / Motivo (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Asiste a 2 clases por semana"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedClassToAdd}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isSubmitting ? 'Inscribiendo...' : 'Agendar Clase'}</span>
                </button>
              </div>
            </>
          )}
        </form>

        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={closeMemberClassesModal}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}
