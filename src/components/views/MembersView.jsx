import React, { useState } from 'react'
import {
  Search,
  UserPlus,
  CreditCard,
  Phone,
  Filter,
  Users,
  Trash2,
  Pencil,
  CalendarPlus,
} from 'lucide-react'
import Badge from '../common/Badge'
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal'
import { useGym } from '../../context/useGym'

export default function MembersView() {
  const {
    members,
    openPaymentModal,
    openNewMemberModal,
    deleteMember,
    openEditMemberModal,
    openMemberClassesModal,
  } = useGym()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [memberToDelete, setMemberToDelete] = useState(null)

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.dni.includes(searchTerm) ||
      m.plan.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === 'inactivos') {
      return !m.activo
    }

    // Por defecto en las listas activas, solo mostramos socios con alta vigente
    if (!m.activo) return false

    if (statusFilter === 'todos') return true
    if (statusFilter === 'al-dia') return m.status === 'Al Día'
    if (statusFilter === 'vencido') return m.status === 'Vencido'
    if (statusFilter === 'vence-pronto') return m.status === 'Vence Pronto'
    return true
  })

  const getStatusBadge = (status, activo) => {
    if (!activo) return <Badge variant="neutral">Dado de Baja</Badge>
    if (status === 'Al Día') return <Badge variant="success">Al Día</Badge>
    if (status === 'Vence Pronto') return <Badge variant="warning">Vence Pronto</Badge>
    if (status === 'Vencido') return <Badge variant="danger">Vencido</Badge>
    return <Badge>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Gestión de Alumnos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Padrón de socios activos, historial de cuotas y estado de pagos
          </p>
        </div>

        <button
          type="button"
          onClick={openNewMemberModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>Nuevo Alumno</span>
        </button>
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mx-auto mb-4 text-cyan-600">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No hay alumnos en el padrón</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Comienza dando de alta a los socios de Colibrí para registrar sus inscripciones, cobrar cuotas y liquidar a los profesores.
          </p>
          <button
            type="button"
            onClick={openNewMemberModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Primer Alumno</span>
          </button>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar por nombre, DNI o disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'al-dia', label: 'Al Día' },
                { id: 'vence-pronto', label: 'Vence Pronto' },
                { id: 'vencido', label: 'Vencidos' },
                { id: 'inactivos', label: 'Inactivos' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {filteredMembers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No se encontraron alumnos con los filtros seleccionados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Alumno</th>
                      <th className="py-3 px-4">DNI / Contacto</th>
                      <th className="py-3 px-4">Disciplinas</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Vencimiento</th>
                      <th className="py-3 px-4 text-right">Cuota</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 ${
                              member.activo
                                ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                              {member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <div className={`font-bold leading-tight ${member.activo ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
                                {member.name}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">{member.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-medium">{member.dni}</div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {member.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          <button
                            type="button"
                            onClick={() => openMemberClassesModal(member)}
                            className="text-left hover:text-cyan-600 transition-colors cursor-pointer group flex items-center gap-1.5"
                            title="Gestionar disciplinas del alumno"
                          >
                            <span>{member.plan}</span>
                            <CalendarPlus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-500 transition-opacity" />
                          </button>
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(member.status, member.activo)}</td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                          {member.dueDate}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          <div>${member.amount.toLocaleString('es-AR')}</div>
                          {member.descuento_multimateria && (
                            <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-md mt-0.5">
                              10% Multi-actividad
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {member.activo ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openMemberClassesModal(member)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                  title="Agendar o quitar disciplinas"
                                >
                                  <CalendarPlus className="w-3.5 h-3.5 text-cyan-600" />
                                  <span>Clases</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openPaymentModal(member)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                  title="Cobrar cuota"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Cobrar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditMemberModal(member)}
                                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                  title={`Editar datos de ${member.name}`}
                                  aria-label={`Editar datos de ${member.name}`}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMemberToDelete(member)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                                  title={`Dar de baja a ${member.name}`}
                                  aria-label={`Dar de baja a ${member.name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditMemberModal(member)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                                  title={`Editar o reactivar a ${member.name}`}
                                >
                                  <Pencil className="w-3 h-3 text-slate-500" />
                                  <span>Editar / Alta</span>
                                </button>
                                <span className="text-xs text-slate-400 italic">Baja</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de Confirmación de Baja */}
      <ConfirmDeleteModal
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        onConfirm={async () => {
          if (memberToDelete) {
            await deleteMember(memberToDelete.rawId || memberToDelete.id)
          }
        }}
        title="Dar de baja alumno"
        entityName={memberToDelete?.name}
        message={`¿Estás seguro de dar de baja a ${memberToDelete?.name}? Dejará de figurar en las listas activas pero se conservará su historial de pagos.`}
      />
    </div>
  )
}
