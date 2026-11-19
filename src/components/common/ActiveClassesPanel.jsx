import React, { useState, useMemo } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  AlertCircle,
  ArrowRightLeft,
  Users,
} from 'lucide-react'

/**
 * Panel selector de clases activas para la gestión de profesores.
 * Cumple con la regla de negocio: "no debe quedar a juicio del usuario el escribir
 * qué clase va a dirigir, debe ser un panel donde aparezcan solo las clases activas".
 *
 * @param {Object} props
 * @param {Array} props.classes - Lista completa de clases del contexto
 * @param {Array} props.selectedClassIds - Array de IDs numéricos de clases seleccionadas
 * @param {Function} props.onChangeSelected - Callback (selectedIds, reassignments) => void
 * @param {number|null} [props.currentTrainerId] - ID del profesor en edición (null si es alta)
 * @param {Array} [props.trainers] - Lista de profesores del staff (para reasignar si se desmarca)
 * @param {string} [props.title] - Título personalizado para el panel
 * @param {string} [props.subtitle] - Subtítulo explicativo
 */
export default function ActiveClassesPanel({
  classes = [],
  selectedClassIds = [],
  onChangeSelected,
  currentTrainerId = null,
  trainers = [],
  title = 'Clases Activas que va a dirigir',
  subtitle = 'Selecciona las disciplinas activas del cronograma que estarán a cargo de este profesor',
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [reassignments, setReassignments] = useState({})

  // REGLA FUNDAMENTAL: Filtrar estrictamente solo clases activas
  const activeClasses = useMemo(() => {
    return classes.filter((c) => c.activo !== false)
  }, [classes])

  // Filtrar por término de búsqueda (nombre, horario, salón)
  const filteredClasses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return activeClasses
    return activeClasses.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.schedule && c.schedule.toLowerCase().includes(term)) ||
        (c.room && c.room.toLowerCase().includes(term)) ||
        (c.trainer && c.trainer.toLowerCase().includes(term))
    )
  }, [activeClasses, searchTerm])

  // Profesores activos disponibles para reasignación (excluyendo al profesor actual)
  const otherActiveTrainers = useMemo(() => {
    return (trainers || []).filter(
      (t) => t.activo && (!currentTrainerId || t.id !== currentTrainerId)
    )
  }, [trainers, currentTrainerId])

  const handleToggleClass = (classRawId) => {
    const isCurrentlySelected = selectedClassIds.includes(classRawId)
    let newSelectedIds = []

    if (isCurrentlySelected) {
      newSelectedIds = selectedClassIds.filter((id) => id !== classRawId)
    } else {
      newSelectedIds = [...selectedClassIds, classRawId]
      // Si se vuelve a seleccionar, eliminamos cualquier reasignación pendiente
      if (reassignments[classRawId]) {
        const updated = { ...reassignments }
        delete updated[classRawId]
        setReassignments(updated)
      }
    }

    onChangeSelected(newSelectedIds, reassignments)
  }

  const handleReassignmentChange = (classRawId, newProfId) => {
    const updated = {
      ...reassignments,
      [classRawId]: newProfId ? Number(newProfId) : null,
    }
    setReassignments(updated)
    onChangeSelected(selectedClassIds, updated)
  }

  return (
    <div className="space-y-3">
      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-1 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-cyan-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              {title}
            </h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800">
              {selectedClassIds.length}{' '}
              {selectedClassIds.length === 1 ? 'clase' : 'clases'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Buscador de clases si hay 3 o más clases activas */}
        {activeClasses.length >= 3 && (
          <div className="relative w-full sm:w-56 mt-1 sm:mt-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar clase activa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
            />
          </div>
        )}
      </div>

      {/* Contenedor de Clases Activas */}
      {activeClasses.length === 0 ? (
        <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-xl text-center space-y-1.5">
          <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
          <p className="text-xs font-bold text-amber-900">
            No hay clases activas registradas en Colibrí
          </p>
          <p className="text-[11px] text-amber-700 max-w-sm mx-auto">
            Para asignar disciplinas a este docente, primero crea o activa clases desde la sección
            <strong> Clases</strong>.
          </p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
          No se encontraron clases activas con "{searchTerm}".
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1 divide-y-0">
          {filteredClasses.map((cls) => {
            const isSelected = selectedClassIds.includes(cls.rawId)
            const wasOriginallyAssignedToCurrent =
              currentTrainerId && cls.profesorId === currentTrainerId
            const isAssignedToOther =
              cls.profesorId && (!currentTrainerId || cls.profesorId !== currentTrainerId)
            const isUncheckedOriginal = wasOriginallyAssignedToCurrent && !isSelected

            return (
              <div
                key={cls.rawId}
                className={`p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-50/40 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      id={`class-toggle-${cls.rawId}`}
                      checked={isSelected}
                      onChange={() => handleToggleClass(cls.rawId)}
                      className="w-4 h-4 rounded-md text-cyan-600 border-slate-300 focus:ring-cyan-500 cursor-pointer accent-cyan-600"
                    />
                  </div>

                  <label
                    htmlFor={`class-toggle-${cls.rawId}`}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900 leading-tight">
                        {cls.name}
                      </span>

                      {/* Estado de asignación */}
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Asignada a este profesor</span>
                        </span>
                      ) : isAssignedToOther ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                          <span>A cargo de: {cls.trainer}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <span>Sin profesor asignado</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {cls.schedule}
                      </span>
                      {cls.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {cls.room}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        Cupo: {cls.capacity} ({cls.enrolled || 0} inscriptos)
                      </span>
                      <span className="font-semibold text-slate-700">
                        ${Number(cls.precio_base).toLocaleString('es-AR')} • Split {cls.porcentaje_profesor}%
                      </span>
                    </div>
                  </label>
                </div>

                {/* Si se desmarcó una clase que pertenecía a este profesor, solicitar reasignación para no dejarla sin docente */}
                {isUncheckedOriginal && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200/80 bg-amber-50/60 p-2.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px]">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Reasignar esta clase a otro profesor:</span>
                    </div>
                    <select
                      value={reassignments[cls.rawId] || ''}
                      onChange={(e) => handleReassignmentChange(cls.rawId, e.target.value)}
                      className="px-2.5 py-1 text-xs bg-white border border-amber-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">-- Seleccionar nuevo docente --</option>
                      {otherActiveTrainers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} (Split {t.porcentaje_honorarios}%)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
