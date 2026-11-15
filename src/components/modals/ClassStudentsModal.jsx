import React from 'react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function ClassStudentsModal() {
  const { selectedClassForStudents, closeClassStudentsModal, members } = useGym()

  if (!selectedClassForStudents) return null

  const cls = selectedClassForStudents
  // Sample enrolled members based on class
  const sampleEnrolled = members.slice(0, Math.min(cls.enrolled, members.length))

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
            {cls.enrolled} / {cls.capacity} cupos utilizados
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
          {sampleEnrolled.map((m, index) => (
            <div key={m.id} className="py-2.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-slate-400">#{index + 1}</span>
                <div>
                  <div className="font-bold text-slate-900 leading-tight">{m.name}</div>
                  <div className="text-xs text-slate-400">{m.plan}</div>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Inscripto
              </span>
            </div>
          ))}
        </div>

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
