import React, { useState } from 'react'
import { CreditCard, CheckCircle, UserPlus, AlertCircle, Sparkles, Percent } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

const MESES = [
  { num: 1, name: 'Enero' },
  { num: 2, name: 'Febrero' },
  { num: 3, name: 'Marzo' },
  { num: 4, name: 'Abril' },
  { num: 5, name: 'Mayo' },
  { num: 6, name: 'Junio' },
  { num: 7, name: 'Julio' },
  { num: 8, name: 'Agosto' },
  { num: 9, name: 'Septiembre' },
  { num: 10, name: 'Octubre' },
  { num: 11, name: 'Noviembre' },
  { num: 12, name: 'Diciembre' },
]

function PaymentForm({ member, members, onRecordPayment, onClose }) {
  const initialAlumno = member || members[0]

  const [selectedRawId, setSelectedRawId] = useState(
    initialAlumno ? String(initialAlumno.rawId) : ''
  )
  const [selectedMes, setSelectedMes] = useState(() => new Date().getMonth() + 1)
  const [selectedAnio, setSelectedAnio] = useState(() => new Date().getFullYear())
  const [method, setMethod] = useState('Efectivo')
  const [observaciones, setObservaciones] = useState('')

  const currentMember = members.find((m) => String(m.rawId) === String(selectedRawId))
  const expectedFee = currentMember ? Number(currentMember.amount) || 0 : 0
  const fullBase = currentMember
    ? Number(currentMember.baseTotalWithoutDiscount) || expectedFee
    : 0

  // Monto editable / excepcional
  const [customAmount, setCustomAmount] = useState(expectedFee)
  const [discountPreset, setDiscountPreset] = useState('full') // 'full' | '10' | '20' | 'custom'

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Cuando cambia el alumno seleccionado en el dropdown, actualizamos el importe inicial
  const handleMemberChange = (e) => {
    const newId = e.target.value
    setSelectedRawId(newId)
    setErrorMsg('')
    const found = members.find((m) => String(m.rawId) === String(newId))
    const fee = found ? Number(found.amount) || 0 : 0
    setCustomAmount(fee)
    setDiscountPreset('full')
  }

  // Porcentaje profesor de la clase (o 60% estándar)
  const profPct = currentMember?.clases?.[0]
    ? Number(currentMember.clases[0].porcentaje_profesor) || 60
    : 60
  const colibriPct = 100 - profPct

  // Cálculo del split 60/40 en base al monto que realmente ingresa
  const numericAmount = Math.max(0, Number(customAmount) || 0)

  let montoProfesor = 0
  let montoColibri = 0

  if (currentMember?.descuento_familiar) {
    // Si es familiar directo: todo va al profesor, Colibrí 0
    montoProfesor = numericAmount
    montoColibri = 0
  } else {
    // Regla estándar: split 60/40 (o 65/35) sobre lo que ingresa
    montoProfesor = Math.round(numericAmount * (profPct / 100))
    montoColibri = numericAmount - montoProfesor
  }

  // Descuento porcentual calculado respecto a la cuota base completa (para enviar al backend)
  const discountToSend = currentMember?.descuento_familiar
    ? 0
    : fullBase > 0 && numericAmount < fullBase
      ? Math.max(0, Math.min(100, Number((((fullBase - numericAmount) / fullBase) * 100).toFixed(2))))
      : 0

  // Descuento porcentual visual respecto a la cuota regular
  const visualDiscountPct =
    expectedFee > 0 && numericAmount < expectedFee
      ? Math.max(0, Math.min(100, Number((((expectedFee - numericAmount) / expectedFee) * 100).toFixed(2))))
      : 0

  const handleApplyPreset = (preset) => {
    setDiscountPreset(preset)
    if (preset === 'full') {
      setCustomAmount(expectedFee)
    } else if (preset === '10') {
      setCustomAmount(Math.round(expectedFee * 0.9))
    } else if (preset === '20') {
      setCustomAmount(Math.round(expectedFee * 0.8))
    } else if (preset === 'rawBase') {
      setCustomAmount(fullBase)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentMember) {
      setErrorMsg('Selecciona un alumno para continuar.')
      return
    }

    if (!currentMember.clasesIds || currentMember.clasesIds.length === 0) {
      setErrorMsg('El alumno no tiene ninguna disciplina asignada. Asigna una disciplina antes de cobrar.')
      return
    }

    if (numericAmount <= 0) {
      setErrorMsg('El importe a cobrar debe ser mayor a $0.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      let finalObservaciones = observaciones.trim()
      if (numericAmount !== expectedFee) {
        const descText = `Cobro excepcional: $${numericAmount.toLocaleString('es-AR')} (Cuota regular $${expectedFee.toLocaleString('es-AR')}, Desc. ${visualDiscountPct}%)`
        finalObservaciones = finalObservaciones
          ? `${finalObservaciones} | ${descText}`
          : descText
      } else if (currentMember?.descuento_multimateria) {
        const descText = `Beneficio 10% multi-actividad aplicado ($${numericAmount.toLocaleString('es-AR')})`
        finalObservaciones = finalObservaciones
          ? `${finalObservaciones} | ${descText}`
          : descText
      }

      await onRecordPayment({
        alumnoId: currentMember.rawId,
        mes: Number(selectedMes),
        anio: Number(selectedAnio),
        method,
        clasesIds: currentMember.clasesIds,
        descuentoPorcentaje: discountToSend,
        observaciones: finalObservaciones || null,
      })

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar el pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-slate-900">¡Pago Registrado con Éxito!</h4>
        <p className="text-sm text-slate-500">
          Se ha actualizado el estado de la cuota en el backend y la liquidación del profesor con el split correspondiente.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Alumno selector (Solo alumnos activos) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Seleccionar Alumno *
        </label>
        <select
          value={selectedRawId}
          onChange={handleMemberChange}
          required
          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
        >
          {members.map((m) => (
            <option key={m.rawId} value={m.rawId}>
              {m.name} — {m.plan} ({m.status})
            </option>
          ))}
        </select>
      </div>

      {/* Período (Mes y Año) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mes a Abonar
          </label>
          <select
            value={selectedMes}
            onChange={(e) => setSelectedMes(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
          >
            {MESES.map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Año
          </label>
          <input
            type="number"
            min="2024"
            max="2035"
            value={selectedAnio}
            onChange={(e) => setSelectedAnio(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Disciplinas y Monto Base */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Disciplinas Asignadas
          </label>
          <input
            type="text"
            value={currentMember?.plan || 'Sin disciplinas'}
            readOnly
            className="w-full px-3.5 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Valor de Cuota Regular
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold">
              $
            </span>
            <input
              type="text"
              readOnly
              value={expectedFee.toLocaleString('es-AR')}
              className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Banner Informativo de Beneficio Multi-disciplina o Familiar */}
      {currentMember?.descuento_multimateria && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 text-xs text-indigo-900">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold">Descuento Multi-actividad (10%): </span>
            Aplica automáticamente por cursar actividades distintas. Base regular:{' '}
            <span className="line-through text-indigo-400">${fullBase.toLocaleString('es-AR')}</span> → Total cuota:{' '}
            <span className="font-bold text-indigo-700">${expectedFee.toLocaleString('es-AR')}</span>.
          </div>
        </div>
      )}

      {currentMember?.descuento_familiar && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2.5 text-xs text-purple-900">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <div>
            <span className="font-bold">Descuento Familiar Directo: </span>
            Exento de canon Colibrí (40%). El 100% de lo cobrado se acredita al profesor.
          </div>
        </div>
      )}

      {/* Monto editable y Situaciones Excepcionales */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-900">
            Monto a Cobrar en Este Pago ($ ARS) *
          </label>
          <span className="text-[11px] text-cyan-700 font-semibold flex items-center gap-1">
            <Percent className="w-3 h-3" />
            Editable por situaciones excepcionales
          </span>
        </div>

        {/* Botones de Presets Rápidos */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleApplyPreset('full')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              discountPreset === 'full' && numericAmount === expectedFee
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Cuota ($ {expectedFee.toLocaleString('es-AR')})
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('10')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              discountPreset === '10'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            -10% ($ {Math.round(expectedFee * 0.9).toLocaleString('es-AR')})
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('20')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              discountPreset === '20'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            -20% ($ {Math.round(expectedFee * 0.8).toLocaleString('es-AR')})
          </button>
          {currentMember?.descuento_multimateria && (
            <button
              type="button"
              onClick={() => handleApplyPreset('rawBase')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                discountPreset === 'rawBase'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Sin desc. ($ {fullBase.toLocaleString('es-AR')})
            </button>
          )}
        </div>

        {/* Input con el monto a cobrar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
            $
          </span>
          <input
            type="number"
            min="0"
            step="500"
            required
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value)
              setDiscountPreset('custom')
            }}
            placeholder="Ingresa el monto a cobrar"
            className="w-full pl-8 pr-3.5 py-2.5 text-base font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
          />
        </div>

        {/* Live Calculation Split 60/40 */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 font-semibold border-b border-slate-100 pb-1.5">
            <span className="flex items-center gap-1 text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Distribución de Ingresos (Split {currentMember?.descuento_familiar ? 'Familiar' : `${profPct}/${colibriPct}`}):
            </span>
            {visualDiscountPct > 0 && (
              <span className="text-amber-600 font-bold">
                -{visualDiscountPct}% sobre cuota regular
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-lg">
              <span className="text-[11px] text-emerald-800 block font-medium">
                Honorarios Profesor ({currentMember?.descuento_familiar ? '100%' : `${profPct}%`}):
              </span>
              <span className="text-sm font-black text-emerald-700">
                ${montoProfesor.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="p-2 bg-cyan-50/70 border border-cyan-100 rounded-lg">
              <span className="text-[11px] text-cyan-800 block font-medium">
                Instalaciones Colibrí ({currentMember?.descuento_familiar ? '0% Exento' : `${colibriPct}%`}):
              </span>
              <span className="text-sm font-black text-cyan-700">
                ${montoColibri.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Método de Recepción
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Efectivo', 'Transferencia', 'Tarjeta Débito', 'Mercado Pago'].map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMethod(m)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                method === m
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Comentarios / Observaciones (Opcional)
        </label>
        <input
          type="text"
          placeholder="Ej: Situación excepcional, comprobante MP #128941"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          <span>{isSubmitting ? 'Registrando...' : `Cobrar $${numericAmount.toLocaleString('es-AR')}`}</span>
        </button>
      </div>
    </form>
  )
}

export default function PaymentModal() {
  const {
    isPaymentModalOpen,
    closePaymentModal,
    selectedMemberForPayment,
    members,
    recordPayment,
    openNewMemberModal,
  } = useGym()

  // Solo alumnos activos son elegibles para registrar pagos
  const activeMembers = members.filter((m) => m.activo)

  return (
    <Modal
      isOpen={isPaymentModalOpen}
      onClose={closePaymentModal}
      title="Cobrar Cuota — Colibrí"
      subtitle="Registrar abono mensual de cuota de alumno y calcular split 60/40"
    >
      {isPaymentModalOpen && (
        activeMembers.length === 0 ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                No hay alumnos activos en el padrón
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Para registrar un cobro, primero debes registrar o reactivar al alumno en el sistema.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                closePaymentModal()
                openNewMemberModal()
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Registrar Alumno</span>
            </button>
          </div>
        ) : (
          <PaymentForm
            key={selectedMemberForPayment?.id || 'default-payment'}
            member={selectedMemberForPayment}
            members={activeMembers}
            onRecordPayment={recordPayment}
            onClose={closePaymentModal}
          />
        )
      )}
    </Modal>
  )
}
