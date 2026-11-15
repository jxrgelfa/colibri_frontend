import React, { useState } from 'react'
import { CreditCard, Search, CheckCircle2 } from 'lucide-react'
import { useGym } from '../../context/useGym'

export default function PaymentsView() {
  const { payments, stats, openPaymentModal } = useGym()
  const [filterMethod, setFilterMethod] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterMethod === 'todos') return matchesSearch
    return matchesSearch && p.method.toLowerCase().includes(filterMethod.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Libro de Pagos e Ingresos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Auditoría de cobros, emisión de comprobantes y métodos de recepción
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openPaymentModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Cobrar Cuota</span>
          </button>
        </div>
      </div>

      {/* Filter and stats banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Recaudado en el Mes
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">
            ${stats.monthlyRevenue.toLocaleString('es-AR')}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            {stats.revenueTrend}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Transacciones Registradas
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">{payments.length}</div>
          <span className="text-xs text-slate-400 mt-1 inline-block">
            Promedio ticket: ${(stats.monthlyRevenue / Math.max(1, payments.length)).toFixed(0)}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Canal de Pago Principal
          </span>
          <div className="text-3xl font-black text-cyan-600 mt-1">Transferencias</div>
          <span className="text-xs text-slate-400 mt-1 inline-block">52% de las transacciones</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por alumno o ID de recibo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['todos', 'efectivo', 'transferencia', 'tarjeta'].map((method) => (
            <button
              key={method}
              onClick={() => setFilterMethod(method)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap cursor-pointer ${
                filterMethod === method
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Comprobante</th>
                <th className="py-3 px-4">Alumno</th>
                <th className="py-3 px-4">Plan / Concepto</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-xs text-slate-500">
                    {p.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.memberName}</td>
                  <td className="py-3.5 px-4 text-slate-700">{p.plan}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{p.date}</td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-600">
                    +${p.amount.toLocaleString('es-AR')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {p.status}
                    </span>
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
