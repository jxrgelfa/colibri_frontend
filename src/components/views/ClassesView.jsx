import React from 'react'
import { Clock, Plus } from 'lucide-react'
import { useGym } from '../../context/useGym'

export default function ClassesView() {
  const { classes, openNewClassModal, openClassStudentsModal } = useGym()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Catálogo de Clases y Actividades
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Programación horaria, cupos y salones de Colibrí
          </p>
        </div>

        <button
          type="button"
          onClick={openNewClassModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Nueva Actividad</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {classes.map((c) => {
          const occupancyPercent = Math.round((c.enrolled / Math.max(1, c.capacity)) * 100)
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg">
                    {c.room}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{c.id}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Prof: {c.trainer}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{c.schedule}</span>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Cupo:</span>
                      <span className="font-bold text-slate-800">
                        {c.enrolled} / {c.capacity} ({occupancyPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          occupancyPercent >= 90 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openClassStudentsModal(c)}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Gestionar Inscriptos
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
