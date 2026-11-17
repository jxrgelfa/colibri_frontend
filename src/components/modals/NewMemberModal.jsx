import React, { useState } from 'react'
import { UserPlus, CheckCircle, ShieldCheck, Check, Sparkles } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'

export default function NewMemberModal() {
  const { isNewMemberModalOpen, closeNewMemberModal, classes, addMember } = useGym()

  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    phone: '',
    descuentoFamiliar: false,
    payNow: true,
    paymentMethod: 'Efectivo',
    observaciones: '',
  })
  const [selectedClassIds, setSelectedClassIds] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Solo clases activas son elegibles para inscripción
  const activeClasses = classes.filter((c) => c.activo)

  // Clases seleccionadas
  const selectedClasses = activeClasses.filter((c) =>
    selectedClassIds.includes(String(c.rawId))
  )

  // Cálculo de cuota según clases seleccionadas, descuento familiar y 10% multi-clase
  const rawSum = selectedClasses.reduce((sum, c) => {
    const base = Number(c.precio_base) || 50000
    if (formData.descuentoFamiliar) {
      const pctProf = Number(c.porcentaje_profesor) || 60
      return sum + Math.round(base * (pctProf / 100))
    }
    return sum + base
  }, 0)

  // Regla Colibrí: 2 o más clases reciben 10% de descuento al total
  const isMultiClass = !formData.descuentoFamiliar && selectedClasses.length >= 2
  const feeToPay = isMultiClass ? Math.round(rawSum * 0.9) : rawSum

  const handleToggleClass = (classId) => {
    const idStr = String(classId)
    setSelectedClassIds((prev) =>
      prev.includes(idStr) ? prev.filter((id) => id !== idStr) : [...prev, idStr]
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setErrorMsg('El nombre completo es obligatorio.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await addMember({
        ...formData,
        classIds: selectedClassIds,
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          name: '',
          dni: '',
          email: '',
          phone: '',
          descuentoFamiliar: false,
          payNow: true,
          paymentMethod: 'Efectivo',
          observaciones: '',
        })
        setSelectedClassIds([])
        closeNewMemberModal()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al registrar el alumno.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isNewMemberModalOpen}
      onClose={closeNewMemberModal}
      title="Alta de Nuevo Alumno"
      subtitle="Registrar nuevo alumno en el padrón de Colibrí y agendar sus clases"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">¡Alumno Registrado con Éxito!</h4>
          <p className="text-sm text-slate-500">
            Se ha creado el perfil en el sistema{selectedClassIds.length > 0 ? `, inscripto en ${selectedClassIds.length} disciplina(s)` : ''} y actualizado el padrón.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Nombre Completo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre y Apellido *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej: Florencia Morales"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                DNI / Documento
              </label>
              <input
                type="text"
                name="dni"
                placeholder="Ej: 39.400.123"
                value={formData.dni}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Ej: +54 9 11 4820-9988"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="alumno@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            />
          </div>

          {/* Agendar a una o más Clases / Disciplinas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Agendar a Clases / Disciplinas ({selectedClassIds.length} seleccionada{selectedClassIds.length === 1 ? '' : 's'})
              </label>
              <span className="text-[11px] text-slate-400">Puedes elegir 1 o más</span>
            </div>

            {activeClasses.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                Aún no hay disciplinas activas creadas. El alumno se registrará en el padrón y podrás agendarlo cuando existan clases activas.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeClasses.map((c) => {
                  const isSelected = selectedClassIds.includes(String(c.rawId))
                  return (
                    <div
                      key={c.rawId}
                      onClick={() => handleToggleClass(c.rawId)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-50/80 border-cyan-400 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-cyan-600 border-cyan-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Prof. {c.trainer} • {c.schedule} ({c.room})
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs font-bold text-slate-800">
                        ${Number(c.precio_base).toLocaleString('es-AR')}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Descuento Familiar Directo (Regla Core de Colibrí) */}
          <div className="p-3 bg-cyan-50/60 border border-cyan-200 rounded-xl flex items-start gap-3">
            <input
              type="checkbox"
              id="descuentoFamiliar"
              name="descuentoFamiliar"
              checked={formData.descuentoFamiliar}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 text-cyan-600 rounded-sm border-slate-300 focus:ring-cyan-500 cursor-pointer"
            />
            <label htmlFor="descuentoFamiliar" className="text-xs text-slate-700 cursor-pointer select-none">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                Descuento Familiar Directo (Madre / Hermano directo)
              </span>
              <span className="text-slate-500 block mt-0.5">
                Exento del canon de Colibrí (40% o 35%). Paga únicamente la porción correspondiente al profesor de cada disciplina (${feeToPay.toLocaleString('es-AR')}).
              </span>
            </label>
          </div>

          {/* Banner de Beneficio Multi-disciplina (10% de descuento) */}
          {isMultiClass && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold">¡Beneficio Multi-disciplina (10%)!</span>
                  <span className="block text-indigo-700 text-[11px]">
                    10% de descuento aplicado al total por cursar {selectedClasses.length} disciplinas.
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="line-through text-indigo-400 block text-[11px] font-semibold">
                  ${rawSum.toLocaleString('es-AR')}
                </span>
                <span className="font-black text-indigo-700">
                  -${Math.round(rawSum * 0.1).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          )}

          {/* Importe a Abonar */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-600 block">
                Valor Total de Cuota Calculada:
              </span>
              <span className="text-[11px] text-slate-400">
                {selectedClassIds.length === 0
                  ? 'Sin clases seleccionadas'
                  : `${selectedClassIds.length} disciplina(s) agendada(s)`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-slate-900">
                ${feeToPay.toLocaleString('es-AR')}
              </span>
              {isMultiClass && (
                <span className="block text-[11px] text-indigo-600 font-semibold">
                  10% multi-clase incluido
                </span>
              )}
            </div>
          </div>

          {/* Pago inmediato checkbox (solo si eligió clases) */}
          {selectedClassIds.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="payNow"
                  checked={formData.payNow}
                  onChange={handleChange}
                  className="w-4 h-4 text-cyan-600 rounded-sm border-slate-300 focus:ring-cyan-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Registrar cobro de la primera cuota en este momento
                </span>
              </label>

              {formData.payNow && (
                <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Medio de Pago
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:border-cyan-500 focus:outline-hidden"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Transferencia">Transferencia Bancaria / MP</option>
                      <option value="Tarjeta Débito">Tarjeta Débito</option>
                      <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeNewMemberModal}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'Guardando...' : 'Dar de Alta Alumno'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
