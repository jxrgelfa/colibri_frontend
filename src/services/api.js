const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://colibri-backend-lvg5.onrender.com/api/v1').replace(/\/+$/, '')

/**
 * Helper genérico para peticiones HTTP al backend de Colibrí
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('colibri_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    // Manejo de token vencido o no autorizado
    if (response.status === 401) {
      if (token) {
        localStorage.removeItem('colibri_token')
        localStorage.removeItem('colibri_user')
        window.location.reload()
      }
    }

    if (response.status === 204) {
      return null
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || 'Ocurrió un error en la solicitud')
    }

    return data
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor backend (puerto 8000).')
    }
    throw error
  }
}

export const api = {
  // Autenticación
  auth: {
    login: async (username, password) => {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
    },
    getMe: async () => {
      return request('/auth/me')
    },
  },

  // Alumnos
  alumnos: {
    list: async (soloActivos = true) => {
      return request(`/alumnos/?solo_activos=${soloActivos}`)
    },
    create: async (alumnoData) => {
      return request('/alumnos/', {
        method: 'POST',
        body: JSON.stringify(alumnoData),
      })
    },
  },

  // Profesores
  profesores: {
    list: async () => {
      return request('/profesores/')
    },
  },

  // Clases
  clases: {
    list: async () => {
      return request('/clases/')
    },
  },

  // Pagos
  pagos: {
    list: async (mes, anio) => {
      const params = new URLSearchParams()
      if (mes) params.append('mes', mes)
      if (anio) params.append('anio', anio)
      const qs = params.toString() ? `?${params.toString()}` : ''
      return request(`/pagos/${qs}`)
    },
    create: async (pagoData) => {
      return request('/pagos/', {
        method: 'POST',
        body: JSON.stringify(pagoData),
      })
    },
  },

  // Liquidaciones
  liquidaciones: {
    list: async () => {
      return request('/liquidaciones/')
    },
    preview: async (profesorId, mes, anio) => {
      return request(`/liquidaciones/preview?profesor_id=${profesorId}&mes=${mes}&anio=${anio}`)
    },
    create: async (data) => {
      return request('/liquidaciones/', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    resumenMensual: async (mes, anio) => {
      return request(`/liquidaciones/resumen-mensual?mes=${mes}&anio=${anio}`)
    },
  },
}
