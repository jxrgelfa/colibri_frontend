import React from 'react'
import { Users, Calendar, Phone, ArrowRight, UserPlus, GraduationCap } from 'lucide-react'
import { useGym } from '../../context/useGym'

export default function TrainersView() {
  const { trainers, setCurrentView, openNewTrainerModal } = useGym()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Staff de Profesores e Instructores
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Equipo docente a cargo de las disciplinas acrobáticas y aéreas de Colibrí
          </p>
        </div>

        <button
          type="button"
          onClick={openNewTrainerModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-cyan-400" />
          <span>Nuevo Profesor</span>
        </button>
      </div>

      {trainers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mx-auto mb-4 text-cyan-600">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No hay profesores registrados aún</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Comienza dando de alta a los docentes e instructores para luego asignarlos a las clases y disciplinas.
          </p>
          <button
            type="button"
            onClick={openNewTrainerModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Primer Profesor</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-black text-xl flex items-center justify-center mb-4 shadow-sm shadow-cyan-500/20">
                  {trainer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>

                <h3 className="font-bold text-slate-900 text-base">{trainer.name}</h3>
                <p className="text-xs font-semibold text-cyan-600 mt-0.5">{trainer.specialty}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" /> Clases semanales:
                    </span>
                    <span className="font-bold text-slate-800">{trainer.classes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5" /> Alumnos a cargo:
                    </span>
                    <span className="font-bold text-slate-800">{trainer.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5" /> Contacto:
                    </span>
                    <span className="font-medium text-slate-700">{trainer.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Split honorarios:</span>
                    <span className="font-bold text-slate-800">
                      {trainer.porcentaje_honorarios}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentView('liquidaciones')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Ver Ficha y Liquidación</span>
                  <ArrowRight className="w-3 h-3 text-cyan-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
