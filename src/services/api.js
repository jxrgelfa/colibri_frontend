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
    cambiarClave: async (clave_actual, clave_nueva) => {
      return request('/auth/cambiar-clave', {
        method: 'POST',
        body: JSON.stringify({ clave_actual, clave_nueva }),
      })
    },
  },

  // Alumnos
  alumnos: {
    list: async (soloActivos = false) => {
      return request(`/alumnos/?solo_activos=${soloActivos}`)
    },
    get: async (id) => {
      return request(`/alumnos/${id}`)
    },
    create: async (alumnoData) => {
      return request('/alumnos/', {
        method: 'POST',
        body: JSON.stringify(alumnoData),
      })
    },
    update: async (id, data) => {
      return request(`/alumnos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    delete: async (id) => {
      return request(`/alumnos/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Profesores
  profesores: {
    list: async (soloActivos = true) => {
      return request(`/profesores/?solo_activos=${soloActivos}`)
    },
    get: async (id) => {
      return request(`/profesores/${id}`)
    },
    create: async (profesorData) => {
      return request('/profesores/', {
        method: 'POST',
        body: JSON.stringify(profesorData),
      })
    },
    update: async (id, data) => {
      return request(`/profesores/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    delete: async (id) => {
      return request(`/profesores/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Clases
  clases: {
    list: async ({ soloActivos = true, profesorId = null } = {}) => {
      const params = new URLSearchParams()
      params.append('solo_activos', soloActivos)
      if (profesorId) params.append('profesor_id', profesorId)
      return request(`/clases/?${params.toString()}`)
    },
    get: async (id) => {
      return request(`/clases/${id}`)
    },
    create: async (claseData) => {
      return request('/clases/', {
        method: 'POST',
        body: JSON.stringify(claseData),
      })
    },
    update: async (id, data) => {
      return request(`/clases/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    delete: async (id) => {
      return request(`/clases/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Inscripciones
  inscripciones: {
    list: async ({ soloActivas = true, alumnoId = null, claseId = null } = {}) => {
      const params = new URLSearchParams()
      params.append('solo_activas', soloActivas)
      if (alumnoId) params.append('alumno_id', alumnoId)
      if (claseId) params.append('clase_id', claseId)
      return request(`/inscripciones/?${params.toString()}`)
    },
    create: async (inscripcionData) => {
      return request('/inscripciones/', {
        method: 'POST',
        body: JSON.stringify(inscripcionData),
      })
    },
    delete: async (id) => {
      return request(`/inscripciones/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Pagos
  pagos: {
    list: async (mes = null, anio = null) => {
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
    delete: async (id) => {
      return request(`/pagos/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Liquidaciones
  liquidaciones: {
    list: async ({ profesorId = null, mes = null, anio = null, estado = null } = {}) => {
      const params = new URLSearchParams()
      if (profesorId) params.append('profesor_id', profesorId)
      if (mes) params.append('mes', mes)
      if (anio) params.append('anio', anio)
      if (estado) params.append('estado', estado)
      const qs = params.toString() ? `?${params.toString()}` : ''
      return request(`/liquidaciones/${qs}`)
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
    marcarPagada: async (id, data = {}) => {
      return request(`/liquidaciones/${id}/pagar`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    delete: async (id) => {
      return request(`/liquidaciones/${id}`, {
        method: 'DELETE',
      })
    },
    resumenMensual: async (mes, anio) => {
      return request(`/liquidaciones/resumen-mensual?mes=${mes}&anio=${anio}`)
    },
  },
}
