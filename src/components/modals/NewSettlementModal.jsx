import React, { useState, useEffect } from 'react'
import { Receipt, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import Modal from '../common/Modal'
import { useGym } from '../../context/useGym'
import { api } from '../../services/api'

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

export default function NewSettlementModal() {
  const { isNewSettlementModalOpen, closeNewSettlementModal, trainers, addSettlement } = useGym()

  const [profesorId, setProfesorId] = useState('')
  const [mes, setMes] = useState(() => new Date().getMonth() + 1)
  const [anio, setAnio] = useState(() => new Date().getFullYear())
  const [observaciones, setObservaciones] = useState('')

  const [preview, setPreview] = useState(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const activeTrainers = trainers.filter((t) => t.activo)
  const effectiveProfesorId = profesorId || (activeTrainers[0] ? String(activeTrainers[0].id) : '')

  // Fetch real-time preview from backend when profesor, mes or anio change
  useEffect(() => {
    if (!isNewSettlementModalOpen || !effectiveProfesorId) return

    let isMounted = true

    api.liquidaciones
      .preview(Number(effectiveProfesorId), Number(mes), Number(anio))
      .then((data) => {
        if (isMounted) {
          setPreview(data)
          setIsLoadingPreview(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Error fetching preview:', err)
          setPreview(null)
          setIsLoadingPreview(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isNewSettlementModalOpen, effectiveProfesorId, mes, anio])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!effectiveProfesorId) {
      setErrorMsg('Selecciona un profesor.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await addSettlement({
        profesorId: Number(effectiveProfesorId),
        mes: Number(mes),
        anio: Number(anio),
        observaciones: observaciones || null,
      })

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        closeNewSettlementModal()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Error al generar la liquidación')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isNewSettlementModalOpen}
      onClose={closeNewSettlementModal}
      title="Generar Nueva Liquidación de Honorarios"
      subtitle="Cálculo automático de honorarios según cuotas cobradas y splits comerciales"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">¡Liquidación Generada con Éxito!</h4>
          <p className="text-sm text-slate-500">
            Se ha registrado en el backend y guardado el estado de honorarios a transferir.
          </p>
        </div>
      ) : activeTrainers.length === 0 ? (
        <div className="py-6 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">No hay profesores activos cargados</h4>
          <p className="text-xs text-slate-500">
            Para liquidar honorarios, primero debes dar de alta o reactivar al menos a un profesor.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Seleccionar Profesor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Profesor / Instructor *
            </label>
            <select
              value={effectiveProfesorId}
              onChange={(e) => {
                setProfesorId(e.target.value)
                setIsLoadingPreview(true)
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-hidden"
            >
              {activeTrainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Split {t.porcentaje_honorarios}%) — CBU/Alias: {t.cbu_alias}
                </option>
              ))}
            </select>
          </div>

          {/* Período */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mes *
              </label>
              <select
                value={mes}
                onChange={(e) => {
                  setMes(Number(e.target.value))
                  setIsLoadingPreview(true)
                }}
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
                Año *
              </label>
              <input
                type="number"
                min="2024"
                max="2035"
                value={anio}
                onChange={(e) => {
                  setAnio(Number(e.target.value))
                  setIsLoadingPreview(true)
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Preview Financiero en Vivo desde el Backend */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Cálculo en Tiempo Real (Backend)
              </span>
              {isLoadingPreview && (
                <span className="text-[11px] text-slate-400 animate-pulse">Calculando...</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Alumnos con cuota paga:</span>
                <span className="text-base font-bold text-white">
                  {preview ? preview.total_alumnos : 0} alumnos
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Recaudado Bruto:</span>
                <span className="text-base font-bold text-white">
                  ${preview ? Number(preview.total_recaudado).toLocaleString('es-AR') : 0}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Honorarios Profesor:</span>
                <span className="text-lg font-black text-emerald-400">
                  ${preview ? Number(preview.total_liquidado).toLocaleString('es-AR') : 0}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Retención Colibrí:</span>
                <span className="text-base font-bold text-cyan-300">
                  ${preview ? Number(preview.total_colibri).toLocaleString('es-AR') : 0}
                </span>
              </div>
            </div>

            {preview && preview.cbu_alias && (
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Transferir a: <strong className="text-slate-200">{preview.cbu_alias}</strong>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Observaciones (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Cierre de liquidación regular"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeNewSettlementModal}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingPreview}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>{isSubmitting ? 'Generando...' : 'Confirmar Liquidación'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
