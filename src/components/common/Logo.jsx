import React from 'react'

export default function Logo({ className = '', collapsed = false }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Isotipo Colibrí en Vuelo */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-500 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
        <div className="w-full h-full bg-[#121620] rounded-[10px] flex items-center justify-center p-1.5">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-cyan-400"
          >
            {/* Pico característico del colibrí */}
            <path
              d="M4 11L12 14"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Cabeza y cuerpo dinámico en movimiento */}
            <path
              d="M12 14C12 12.5 13.5 11 15.5 11.5C17.5 12 19 14 19.5 17C20 20 18.5 23.5 16 25.5C14.8 26.5 13.5 27.5 12.5 28.5L14.5 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Ala principal abierta en vuelo acrobático */}
            <path
              d="M16 14L27 6C27.5 7.5 26.5 11 23 14L18 16"
              fill="currentColor"
              fillOpacity="0.25"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Pluma secundaria / reflejo esmeralda */}
            <path
              d="M17 16L25 12C24.5 14 22 17 18 18"
              stroke="#34d399"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Ojo del colibrí */}
            <circle cx="14" cy="13.5" r="1.1" fill="#34d399" />
          </svg>
        </div>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-wider text-white font-sans flex items-center gap-1">
            COLIBRÍ
          </span>
          <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
            Gimnasio & Acrobacias
          </span>
        </div>
      )}
    </div>
  )
}
