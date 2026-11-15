import React from 'react'
import { Users, Calendar, Phone, ArrowRight } from 'lucide-react'
import { useGym } from '../../context/useGym'

export default function TrainersView() {
  const { trainers, setCurrentView } = useGym()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Staff de Profesores e Instructores
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Equipo docente a cargo de las disciplinas acrobáticas y aéreas de Colibrí
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-black text-xl flex items-center justify-center mb-4 shadow-sm shadow-cyan-500/20">
                {trainer.name.split(' ').map((n) => n[0]).join('')}
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
    </div>
  )
}
