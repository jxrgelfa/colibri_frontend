import React, { useState } from 'react'
import {
  Users,
  Calendar,
  CalendarDays,
  Phone,
  ArrowRight,
  UserPlus,
  GraduationCap,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Pencil,
} from 'lucide-react'
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal'
import { useGym } from '../../context/useGym'

export default function TrainersView() {
  const {
    trainers,
    setCurrentView,
    openNewTrainerModal,
    deleteTrainer,
    openEditTrainerModal,
    openTrainerClassesModal,
  } = useGym()
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [statusFilter, setStatusFilter] = useState('activos') // 'activos' | 'inactivos' | 'todos'
  const [searchTerm, setSearchTerm] = useState('')
  const [trainerToDelete, setTrainerToDelete] = useState(null)

  const filteredTrainers = trainers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.specialty && t.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.dni && t.dni.includes(searchTerm))

    if (!matchesSearch) return false

    if (statusFilter === 'activos') return t.activo
    if (statusFilter === 'inactivos') return !t.activo
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <>
          {/* Controls: Search, Status Filter & View Mode Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar profesor por nombre o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Filter pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'activos', label: 'Activos' },
                  { id: 'inactivos', label: 'Inactivos' },
                  { id: 'todos', label: 'Todos' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === f.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* View mode toggle (Cards / Table) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Vista en cuadrícula"
                  aria-label="Vista en cuadrícula"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Vista en tabla"
                  aria-label="Vista en tabla"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredTrainers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-slate-400 text-sm shadow-xs">
              No se encontraron profesores con los filtros seleccionados.
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Profesor</th>
                      <th className="py-3 px-4">Clases Dirigidas</th>
                      <th className="py-3 px-4">DNI / Contacto</th>
                      <th className="py-3 px-4 text-center">Clases Semanales</th>
                      <th className="py-3 px-4 text-center">Alumnos</th>
                      <th className="py-3 px-4 text-right">Split Honorarios</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTrainers.map((trainer) => (
                      <tr key={trainer.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {trainer.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <div className={`font-bold leading-tight ${trainer.activo ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
                                {trainer.name}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">ID: {trainer.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {trainer.directedClasses && trainer.directedClasses.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {trainer.directedClasses.map((cls) => (
                                <span
                                  key={cls.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/70"
                                >
                                  {cls.nombre}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Sin clases asignadas
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-medium">{trainer.dni || '—'}</div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {trainer.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                          {trainer.classes}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                          {trainer.students}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          {trainer.porcentaje_honorarios}%
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openTrainerClassesModal(trainer)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              title={`Asignar o editar clases de ${trainer.name}`}
                            >
                              <CalendarDays className="w-3.5 h-3.5 text-cyan-600" />
                              <span>Clases</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCurrentView('liquidaciones')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              title="Ver ficha y liquidación"
                            >
                              <span>Ficha</span>
                              <ArrowRight className="w-3 h-3 text-cyan-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditTrainerModal(trainer)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title={`Editar ${trainer.name}`}
                              aria-label={`Editar ${trainer.name}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            {trainer.activo && (
                              <button
                                type="button"
                                onClick={() => setTrainerToDelete(trainer)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                                title={`Dar de baja a ${trainer.name}`}
                                aria-label={`Dar de baja a ${trainer.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredTrainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-sm shadow-cyan-500/20">
                        {trainer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    </div>

                    <h3 className={`font-bold text-base ${trainer.activo ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
                      {trainer.name}
                    </h3>
                    <div className="mt-1">
                      {trainer.directedClasses && trainer.directedClasses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {trainer.directedClasses.map((cls) => (
                            <span
                              key={cls.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/70"
                            >
                              {cls.nombre}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Sin clases asignadas</p>
                      )}
                    </div>

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

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openTrainerClassesModal(trainer)}
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors cursor-pointer"
                      title={`Asignar o editar clases de ${trainer.name}`}
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Clases</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView('liquidaciones')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Ficha</span>
                      <ArrowRight className="w-3 h-3 text-cyan-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditTrainerModal(trainer)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      title={`Editar ${trainer.name}`}
                      aria-label={`Editar ${trainer.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {trainer.activo && (
                      <button
                        type="button"
                        onClick={() => setTrainerToDelete(trainer)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title={`Dar de baja a ${trainer.name}`}
                        aria-label={`Dar de baja a ${trainer.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de Confirmación de Baja de Profesor */}
      <ConfirmDeleteModal
        isOpen={Boolean(trainerToDelete)}
        onClose={() => setTrainerToDelete(null)}
        onConfirm={async () => {
          if (trainerToDelete) {
            await deleteTrainer(trainerToDelete.id)
          }
        }}
        title="Dar de baja profesor"
        entityName={trainerToDelete?.name}
        message={`¿Estás seguro de dar de baja a ${trainerToDelete?.name}? Dejará de figurar en las listas activas pero se conservará su historial de liquidaciones.`}
      />
    </div>
  )
}
