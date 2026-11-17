import React, { useState } from 'react'
import {
  Clock,
  Plus,
  Dumbbell,
  Trash2,
  Users,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Pencil,
} from 'lucide-react'
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal'
import { useGym } from '../../context/useGym'

export default function ClassesView() {
  const {
    classes,
    openNewClassModal,
    openClassStudentsModal,
    deleteClass,
    openEditClassModal,
  } = useGym()
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [statusFilter, setStatusFilter] = useState('activos') // 'activos' | 'inactivos' | 'todos'
  const [searchTerm, setSearchTerm] = useState('')
  const [classToDelete, setClassToDelete] = useState(null)

  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === 'activos') return c.activo
    if (statusFilter === 'inactivos') return !c.activo
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mx-auto mb-4 text-cyan-600">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No hay disciplinas ni clases creadas</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Agrega las disciplinas acrobáticas (Telas, Lira, Trapecio, etc.) con sus horarios, salones y split de honorarios para profesores.
          </p>
          <button
            type="button"
            onClick={openNewClassModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Primera Actividad</span>
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
                placeholder="Buscar por disciplina, profesor o salón..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Filter pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'activos', label: 'Activas' },
                  { id: 'inactivos', label: 'Inactivas' },
                  { id: 'todos', label: 'Todas' },
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

          {filteredClasses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-slate-400 text-sm shadow-xs">
              No se encontraron actividades con los filtros seleccionados.
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Actividad</th>
                      <th className="py-3 px-4">Salón</th>
                      <th className="py-3 px-4">Profesor</th>
                      <th className="py-3 px-4">Horarios</th>
                      <th className="py-3 px-4 text-right">Cuota Mensual</th>
                      <th className="py-3 px-4 text-center">Split Prof.</th>
                      <th className="py-3 px-4 text-center">Cupo / Inscriptos</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClasses.map((c) => {
                      const occupancyPercent = Math.round(
                        (c.enrolled / Math.max(1, c.capacity)) * 100
                      )
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className={`font-bold leading-tight ${c.activo ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
                              {c.name}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{c.id}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                              {c.room}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            {c.trainer}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">
                            {c.schedule}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                            ${Number(c.precio_base).toLocaleString('es-AR')}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                            {c.porcentaje_profesor}%
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-xs font-bold text-slate-800">
                              {c.enrolled} / {c.capacity} ({occupancyPercent}%)
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openClassStudentsModal(c)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                title="Ver inscriptos"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>Inscriptos</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditClassModal(c)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                title={`Editar ${c.name}`}
                                aria-label={`Editar ${c.name}`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              {c.activo && (
                                <button
                                  type="button"
                                  onClick={() => setClassToDelete(c)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                                  title={`Dar de baja ${c.name}`}
                                  aria-label={`Dar de baja ${c.name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredClasses.map((c) => {
                const occupancyPercent = Math.round(
                  (c.enrolled / Math.max(1, c.capacity)) * 100
                )
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

                      <h3 className={`font-bold text-base ${c.activo ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Prof: {c.trainer}</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{c.schedule}</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-500">
                          <span>Cuota mensual:</span>
                          <span className="font-bold text-slate-800">
                            ${Number(c.precio_base).toLocaleString('es-AR')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-500">
                          <span>Split profesor:</span>
                          <span className="font-bold text-slate-800">
                            {c.porcentaje_profesor}%
                          </span>
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
                              style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openClassStudentsModal(c)}
                        className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      >
                        Gestionar Inscriptos ({c.enrolled})
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditClassModal(c)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        title={`Editar ${c.name}`}
                        aria-label={`Editar ${c.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {c.activo && (
                        <button
                          type="button"
                          onClick={() => setClassToDelete(c)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                          title={`Dar de baja ${c.name}`}
                          aria-label={`Dar de baja ${c.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Modal de Confirmación de Baja de Clase */}
      <ConfirmDeleteModal
        isOpen={Boolean(classToDelete)}
        onClose={() => setClassToDelete(null)}
        onConfirm={async () => {
          if (classToDelete) {
            await deleteClass(classToDelete.rawId || classToDelete.id)
          }
        }}
        title="Dar de baja actividad"
        entityName={classToDelete?.name}
        message={`¿Estás seguro de dar de baja la actividad ${classToDelete?.name}? Dejará de figurar en las listas activas pero se conservará el historial de inscripciones y cobros.`}
      />
    </div>
  )
}
