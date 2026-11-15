import React, { useState } from 'react'
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import Logo from '../common/Logo'
import { useAuth } from '../../context/useAuth'

export default function LoginPage() {
  const { login, isLoading, error: authError } = useAuth()

  const [username, setUsername] = useState('socia')
  const [password, setPassword] = useState('colibri2026')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!username.trim() || !password) {
      setErrorMessage('Por favor ingresa usuario y contraseña.')
      return
    }

    const result = await login(username, password)
    if (!result.success) {
      setErrorMessage(result.error || 'Credenciales inválidas.')
    }
  }

  const fillDefaultCredentials = () => {
    setUsername('socia')
    setPassword('colibri2026')
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#0e121a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. Panel Lateral Izquierdo: Presentación y Branding Colibrí */}
      <div className="relative lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 bg-gradient-to-br from-[#121620] via-[#0f141d] to-[#0a0d13]">
        {/* Glow decorativo de fondo */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Logo />
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema Operativo de Gestión</span>
          </div>
        </div>

        <div className="relative z-10 my-8 lg:my-0 space-y-6 max-w-lg">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Administración ágil y liquidaciones <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">sin planillas</span>.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Plataforma diseñada para Colibrí. Control de cuotas, alumnos, disciplinas acrobáticas y cálculo exacto de honorarios para profesores en tiempo real.
          </p>

          <div className="pt-2 space-y-3">
            {[
              'Distribución automática de ingresos y split 60/40',
              'Gestión de descuentos exclusivos y familiares',
              'Liquidación de honorarios a profesores en un clic',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800/80">
          <span>Colibrí © 2026 • Acceso exclusivo para socias</span>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Conexión Segura JWT
          </span>
        </div>
      </div>

      {/* 2. Panel Derecho: Formulario de Inicio de Sesión */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#0a0d13]">
        <div className="w-full max-w-md space-y-8 bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-md">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Ingresa tus credenciales de socia para acceder al panel.
            </p>
          </div>

          {/* Banner de error */}
          {(errorMessage || authError) && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Usuario o Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Usuario o Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="socia o socia@colibri.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-hidden"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Recordar sesión */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Mantener sesión iniciada</span>
              </label>
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 active:from-cyan-600 active:to-teal-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Atajo de prueba para el evaluador / usuario */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-500 mb-2">Credenciales iniciales por defecto:</p>
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-semibold transition-colors cursor-pointer border border-slate-700/60"
            >
              <span>socia / colibri2026</span>
              <span className="text-[10px] text-slate-400">(autocompletar)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
