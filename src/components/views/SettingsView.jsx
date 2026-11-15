import React, { useState } from 'react'
import { Save, Bell, Building2 } from 'lucide-react'
import Logo from '../common/Logo'

export default function SettingsView() {
  const [gymName, setGymName] = useState('Colibrí')
  const [address, setAddress] = useState('Av. Corrientes 3450, CABA')
  const [phone, setPhone] = useState('+54 11 4890-1200')
  const [currency, setCurrency] = useState('ARS ($)')
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Configuración General
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ajustes de la sede, planes de membresía y preferencias del sistema
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identidad de Colibrí */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-slate-900">Identidad de Colibrí</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl">
              <Logo />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Logotipo Oficial</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Utilizado en comprobantes de pago, portal y barra lateral
              </p>
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-cyan-600 hover:text-cyan-700 cursor-pointer"
              >
                Cambiar imagen
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre de la Academia / Gimnasio
              </label>
              <input
                type="text"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Moneda de Cobro
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dirección de la Sede
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Políticas de Cobranza */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-slate-900">Políticas y Recordatorios de Cobranzas</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 mt-0.5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
              />
              <div>
                <span className="text-sm font-semibold text-slate-800">
                  Notificar cuotas por vencer automáticamente
                </span>
                <p className="text-xs text-slate-500">
                  Enviar recordatorio por WhatsApp/Email 3 días antes del vencimiento.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 mt-0.5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
              />
              <div>
                <span className="text-sm font-semibold text-slate-800">
                  Marcar como moroso automáticamente tras 5 días de vencimiento
                </span>
                <p className="text-xs text-slate-500">
                  Coloca al alumno en estado "Vencido" en el dashboard y listados.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-semibold text-emerald-600 animate-fade-in">
              ¡Configuración guardada correctamente!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-cyan-400" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  )
}
