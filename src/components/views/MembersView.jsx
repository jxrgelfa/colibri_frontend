import React, { useState } from 'react'
import {
  Search,
  UserPlus,
  CreditCard,
  Phone,
  Filter,
} from 'lucide-react'
import Badge from '../common/Badge'
import { useGym } from '../../context/useGym'

export default function MembersView() {
  const { members, openPaymentModal, openNewMemberModal } = useGym()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.dni.includes(searchTerm) ||
      m.plan.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === 'todos') return matchesSearch
    if (statusFilter === 'al-dia') return matchesSearch && m.status === 'Al Día'
    if (statusFilter === 'vencido') return matchesSearch && m.status === 'Vencido'
    if (statusFilter === 'vence-pronto') return matchesSearch && m.status === 'Vence Pronto'
    return matchesSearch
  })

  const getStatusBadge = (status) => {
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

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por nombre, DNI o plan..."
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Alumno</th>
                <th className="py-3 px-4">DNI / Contacto</th>
                <th className="py-3 px-4">Plan Actual</th>
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
                      <div className="w-9 h-9 rounded-full bg-cyan-50 text-cyan-700 font-bold text-xs flex items-center justify-center border border-cyan-100 shrink-0">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
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
                  <td className="py-3.5 px-4 font-medium text-slate-800">{member.plan}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(member.status)}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                    {member.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ${member.amount.toLocaleString('es-AR')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => openPaymentModal(member)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Cobrar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
