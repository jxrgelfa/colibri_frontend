import { AlertCircle, CreditCard, ArrowRight } from 'lucide-react'
import { useGym } from '../../context/useGym'

export default function OverdueMembersCard() {
  const { members, openPaymentModal, setCurrentView } = useGym()

  // Filter active members with overdue fee
  const overdueMembers = members.filter((m) => m.activo && m.status === 'Vencido')

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Alumnos con Cuotas Vencidas
              </h3>
              <p className="text-xs text-slate-500">
                Alumnos en mora que requieren regularización
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
            {overdueMembers.length} vencidos
          </span>
        </div>

        {/* List of overdue students */}
        <div className="divide-y divide-slate-100 mt-2">
          {overdueMembers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              ¡Excelente! No hay cuotas vencidas pendientes.
            </div>
          ) : (
            overdueMembers.map((member) => (
              <div
                key={member.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                      {member.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {member.plan} • Venció el {member.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-sm font-bold text-rose-600">
                    ${member.amount.toLocaleString('es-AR')}
                  </span>
                  <button
                    type="button"
                    onClick={() => openPaymentModal(member)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cobrar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Gestión de cobranzas activa</span>
        <button
          type="button"
          onClick={() => setCurrentView('alumnos')}
          className="inline-flex items-center gap-1 font-semibold text-cyan-600 hover:text-cyan-700 cursor-pointer"
        >
          <span>Ver todos los alumnos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
