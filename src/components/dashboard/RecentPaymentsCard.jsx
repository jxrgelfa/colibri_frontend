import { ArrowRight, CheckCircle2, Receipt } from 'lucide-react'
import { useGym } from '../../context/useGym'

export default function RecentPaymentsCard() {
  const { payments, setCurrentView } = useGym()

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Últimos Pagos del Mes
              </h3>
              <p className="text-xs text-slate-500">
                Transacciones y cuotas cobradas recientemente
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {payments.length} transacciones
          </span>
        </div>

        {/* Payments table / list */}
        {payments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm space-y-1">
            <Receipt className="w-6 h-6 text-slate-300 mx-auto mb-1" />
            <p>No hay cobros registrados en el período aún.</p>
            <p className="text-xs text-slate-400">
              Usa la acción rápida "Cobrar cuota" para registrar el primer pago.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                  <th className="py-2.5 px-2">Alumno</th>
                  <th className="py-2.5 px-2">Método</th>
                  <th className="py-2.5 px-2">Fecha</th>
                  <th className="py-2.5 px-2 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 5).map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-2">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {payment.memberName}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{payment.plan}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {payment.method}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs text-slate-500 whitespace-nowrap">
                      {payment.date}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-bold text-slate-900 text-sm">
                        +${payment.amount.toLocaleString('es-AR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Actualizado con la API en tiempo real</span>
        <button
          type="button"
          onClick={() => setCurrentView('pagos')}
          className="inline-flex items-center gap-1 font-semibold text-cyan-600 hover:text-cyan-700 cursor-pointer"
        >
          <span>Ver historial completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
