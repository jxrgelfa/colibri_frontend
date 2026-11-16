import React, { useState } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import Modal from '../common/Modal'

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar baja',
  entityName = '',
  message,
  confirmText = 'Sí, dar de baja',
  cancelText = 'Cancelar',
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleClose = () => {
    if (isDeleting) return
    setError(null)
    setIsDeleting(false)
    onClose()
  }

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      await onConfirm()
      setIsDeleting(false)
      onClose()
    } catch (err) {
      console.error('Error al dar de baja:', err)
      setError(err.message || 'Ocurrió un error al procesar la baja.')
      setIsDeleting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      subtitle={entityName ? `Operación sobre: ${entityName}` : undefined}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Warning Icon & Prompt Message */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
            <Trash2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Informative Note about soft deletion */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Esta acción realiza una baja lógica en el sistema. Todos los registros históricos, liquidaciones y pagos anteriores quedarán resguardados.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Dando de baja...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
