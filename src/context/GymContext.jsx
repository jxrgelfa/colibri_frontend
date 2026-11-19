import { createContext, useState, useCallback, useEffect } from 'react'
import { api } from '../services/api'

const GymContext = createContext(null)

export function GymProvider({ children }) {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Loading and error states
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dataError, setDataError] = useState(null)

  // Raw entities from API
  const [rawAlumnos, setRawAlumnos] = useState([])
  const [rawProfesores, setRawProfesores] = useState([])
  const [rawActividades, setRawActividades] = useState([])
  const [rawClases, setRawClases] = useState([])
  const [rawInscripciones, setRawInscripciones] = useState([])
  const [rawPagos, setRawPagos] = useState([])
  const [rawLiquidaciones, setRawLiquidaciones] = useState([])

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState(null)

  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false)
  const [isNewTrainerModalOpen, setIsNewTrainerModalOpen] = useState(false)
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false)
  const [isNewSettlementModalOpen, setIsNewSettlementModalOpen] = useState(false)

  const [selectedSettlementForDetail, setSelectedSettlementForDetail] = useState(null)
  const [selectedClassForStudents, setSelectedClassForStudents] = useState(null)

  // Edit and Class Management Modals
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null)
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false)

  const [selectedTrainerForEdit, setSelectedTrainerForEdit] = useState(null)
  const [isEditTrainerModalOpen, setIsEditTrainerModalOpen] = useState(false)

  const [selectedTrainerForClasses, setSelectedTrainerForClasses] = useState(null)
  const [isTrainerClassesModalOpen, setIsTrainerClassesModalOpen] = useState(false)

  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null)
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false)

  const [selectedMemberForClasses, setSelectedMemberForClasses] = useState(null)
  const [isMemberClassesModalOpen, setIsMemberClassesModalOpen] = useState(false)

  // Helper date values initialized safely
  const [today] = useState(() => new Date())
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()
  const dayOfMonth = today.getDate()

  // Fetch all backend data
  const refreshData = useCallback(async () => {
    try {
      const [
        alumnosRes,
        profesoresRes,
        actividadesRes,
        clasesRes,
        inscripcionesRes,
        pagosRes,
        liquidacionesRes,
      ] = await Promise.all([
        api.alumnos.list(false).catch((err) => {
          console.error('Error fetching alumnos:', err)
          return []
        }),
        api.profesores.list(false).catch((err) => {
          console.error('Error fetching profesores:', err)
          return []
        }),
        api.actividades.list(false).catch((err) => {
          console.error('Error fetching actividades:', err)
          return []
        }),
        api.clases.list({ soloActivos: false }).catch((err) => {
          console.error('Error fetching clases:', err)
          return []
        }),
        api.inscripciones.list({ soloActivas: false }).catch((err) => {
          console.error('Error fetching inscripciones:', err)
          return []
        }),
        api.pagos.list().catch((err) => {
          console.error('Error fetching pagos:', err)
          return []
        }),
        api.liquidaciones.list().catch((err) => {
          console.error('Error fetching liquidaciones:', err)
          return []
        }),
      ])

      setRawAlumnos(alumnosRes || [])
      setRawProfesores(profesoresRes || [])
      setRawActividades(actividadesRes || [])
      setRawClases(clasesRes || [])
      setRawInscripciones(inscripcionesRes || [])
      setRawPagos(pagosRes || [])
      setRawLiquidaciones(liquidacionesRes || [])
      setDataError(null)
    } catch (err) {
      console.error('Error general cargando datos de Colibrí:', err)
      setDataError(err.message || 'Error al conectar con el servidor')
    }
  }, [])

  // Initial load on mount
  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const [
          alumnosRes,
          profesoresRes,
          actividadesRes,
          clasesRes,
          inscripcionesRes,
          pagosRes,
          liquidacionesRes,
        ] = await Promise.all([
          api.alumnos.list(false).catch(() => []),
          api.profesores.list(false).catch(() => []),
          api.actividades.list(false).catch(() => []),
          api.clases.list({ soloActivos: false }).catch(() => []),
          api.inscripciones.list({ soloActivas: false }).catch(() => []),
          api.pagos.list().catch(() => []),
          api.liquidaciones.list().catch(() => []),
        ])

        if (!ignore) {
          setRawAlumnos(alumnosRes || [])
          setRawProfesores(profesoresRes || [])
          setRawActividades(actividadesRes || [])
          setRawClases(clasesRes || [])
          setRawInscripciones(inscripcionesRes || [])
          setRawPagos(pagosRes || [])
          setRawLiquidaciones(liquidacionesRes || [])
          setIsLoadingData(false)
        }
      } catch (err) {
        if (!ignore) {
          setDataError(err.message || 'Error al conectar con el servidor')
          setIsLoadingData(false)
        }
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  // Computed / Mapped entities
  const actividadesMap = rawActividades.reduce((acc, a) => {
    acc[a.id] = a
    return acc
  }, {})

  const clasesMap = rawClases.reduce((acc, c) => {
    acc[c.id] = c
    return acc
  }, {})

  const profesoresMap = rawProfesores.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})

  // 0. Actividades
  const actividades = rawActividades.map((a) => ({
    id: a.id,
    nombre: a.nombre,
    name: a.nombre,
    descripcion: a.descripcion || '',
    precio_base_sugerido: Number(a.precio_base_sugerido) || 50000,
    porcentaje_profesor_default: Number(a.porcentaje_profesor_default) || 60,
    activo: a.activo !== false,
  }))

  // 1. Members
  const members = rawAlumnos.map((a) => {
    const fullName = `${a.nombre} ${a.apellido}`.trim()
    const myInscripciones = rawInscripciones.filter(
      (i) => i.alumno_id === a.id && i.activo !== false
    )
    const myClases = myInscripciones.map((i) => clasesMap[i.clase_id]).filter(Boolean)

    let planDesc = 'Sin disciplina'
    if (myClases.length > 0) {
      planDesc = myClases.map((c) => c.nombre).join(', ')
    }
    if (a.descuento_familiar) {
      planDesc += ' (Desc. Familiar)'
    }

    // Payment status for current month
    const paidCurrentMonth = rawPagos.some(
      (p) => p.alumno_id === a.id && p.mes === currentMonth && p.anio === currentYear
    )

    let status = 'Al Día'
    if (!paidCurrentMonth) {
      status = dayOfMonth <= 10 ? 'Vence Pronto' : 'Vencido'
    }

    // Last payment date
    const myPagos = rawPagos
      .filter((p) => p.alumno_id === a.id)
      .sort((p1, p2) => new Date(p2.fecha_pago) - new Date(p1.fecha_pago))

    const lastPaymentDate = myPagos[0]?.fecha_pago
      ? new Date(myPagos[0].fecha_pago).toISOString().split('T')[0]
      : 'Sin pagos'

    const nextDueDate = paidCurrentMonth
      ? `${currentYear}-${String(currentMonth === 12 ? 1 : currentMonth + 1).padStart(2, '0')}-10`
      : `${currentYear}-${String(currentMonth).padStart(2, '0')}-10`

    // Calculate base fee amount & 10% multi-actividad discount
    let feeAmount = 0
    let discountMultiMateria = false
    let baseTotalWithoutDiscount = 0

    if (myClases.length > 0) {
      const sumBase = myClases.reduce((sum, c) => {
        const base = Number(c.precio_base) || 50000
        if (a.descuento_familiar) {
          const pctProf = Number(c.porcentaje_profesor) || 60
          return sum + Math.round(base * (pctProf / 100))
        }
        return sum + base
      }, 0)
      baseTotalWithoutDiscount = sumBase

      // Regla Colibrí: Si cursa 2 o más actividades DISTINTAS y no es familiar, aplica 10% de descuento al total
      const distinctActivities = new Set(
        myClases.map((c) => c.actividad_id || c.id)
      )
      if (!a.descuento_familiar && distinctActivities.size >= 2) {
        discountMultiMateria = true
        feeAmount = Math.round(sumBase * 0.9)
      } else {
        feeAmount = sumBase
      }
    } else {
      feeAmount = a.descuento_familiar ? 30000 : 50000
      baseTotalWithoutDiscount = feeAmount
    }

    if (discountMultiMateria) {
      planDesc += ' (10% Multi-actividad)'
    }

    return {
      id: `ALU-${a.id}`,
      rawId: a.id,
      name: fullName,
      nombre: a.nombre,
      apellido: a.apellido,
      dni: a.dni || 'S/DNI',
      email: a.email || '—',
      phone: a.telefono || '—',
      observaciones: a.observaciones || '',
      plan: planDesc,
      status,
      lastPayment: lastPaymentDate,
      dueDate: nextDueDate,
      amount: feeAmount,
      baseTotalWithoutDiscount,
      descuento_familiar: Boolean(a.descuento_familiar),
      descuento_multimateria: discountMultiMateria,
      descuento_multimateria_pct: discountMultiMateria ? 10 : 0,
      activo: a.activo !== false,
      inscripciones: myInscripciones,
      clasesIds: myClases.map((c) => c.id),
      clases: myClases,
    }
  })

  // 2. Trainers
  const trainers = rawProfesores.map((p) => {
    const fullName = `${p.nombre} ${p.apellido}`.trim()
    const myClases = rawClases.filter((c) => c.profesor_id === p.id && c.activo !== false)
    const myClasesIds = myClases.map((c) => c.id)

    const distinctStudents = new Set(
      rawInscripciones
        .filter((i) => myClasesIds.includes(i.clase_id) && i.activo !== false)
        .map((i) => i.alumno_id)
    )

    const assignedClassNames = myClases.map((c) => c.nombre).join(', ')

    return {
      id: p.id,
      rawId: p.id,
      name: fullName,
      nombre: p.nombre,
      apellido: p.apellido,
      specialty: assignedClassNames || p.observaciones || 'Sin clases asignadas',
      observaciones: p.observaciones || '',
      phone: p.telefono || '—',
      telefono: p.telefono || '',
      dni: p.dni || '—',
      email: p.email || '—',
      cbu_alias: p.cbu_alias || '—',
      porcentaje_honorarios: p.porcentaje_honorarios || 60,
      classes: myClases.length,
      directedClasses: myClases,
      students: distinctStudents.size,
      activo: p.activo !== false,
    }
  })

  // 3. Classes
  const classes = rawClases.map((c) => {
    const prof = c.profesor || profesoresMap[c.profesor_id]
    const profName = prof ? `${prof.nombre} ${prof.apellido}`.trim() : 'Sin asignar'
    const act = c.actividad || actividadesMap[c.actividad_id]
    const actName = act ? act.nombre : 'Sin actividad asignada'
    const enrolledCount = rawInscripciones.filter(
      (i) => i.clase_id === c.id && i.activo !== false
    ).length

    return {
      id: `CLS-${c.id}`,
      rawId: c.id,
      name: c.nombre,
      trainer: profName,
      profesorId: c.profesor_id,
      actividadId: c.actividad_id || null,
      actividad: act || null,
      actividadNombre: actName,
      schedule: c.dias_horarios || 'Horario a confirmar',
      room: c.descripcion || 'Salón Principal',
      capacity: c.cupo_maximo || 20,
      enrolled: enrolledCount,
      precio_base: c.precio_base || 50000,
      porcentaje_profesor: c.porcentaje_profesor || 60,
      activo: c.activo !== false,
    }
  })

  // 4. Payments
  const payments = rawPagos
    .map((p) => {
      const alumno = p.alumno || rawAlumnos.find((a) => a.id === p.alumno_id)
      const memberName = alumno
        ? `${alumno.nombre} ${alumno.apellido}`.trim()
        : `Alumno #${p.alumno_id}`

      let planName = 'Cuota Mensual'
      if (p.detalles && p.detalles.length > 0) {
        const clsNames = p.detalles
          .map((d) => clasesMap[d.clase_id]?.nombre || 'Disciplina')
          .join(', ')
        if (clsNames) planName = clsNames
      } else if (p.observaciones) {
        planName = p.observaciones
      }

      const formattedDate = p.fecha_pago
        ? new Date(p.fecha_pago).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Reciente'

      return {
        id: `PAY-${p.id}`,
        rawId: p.id,
        alumnoId: p.alumno_id,
        memberName,
        plan: planName,
        amount: Number(p.monto_total) || 0,
        method: p.metodo_pago || 'Efectivo',
        date: formattedDate,
        rawDate: p.fecha_pago,
        status: 'Completado',
        mes: p.mes,
        anio: p.anio,
        detalles: p.detalles || [],
      }
    })
    .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0))

  // 5. Settlements
  const settlements = rawLiquidaciones
    .map((s) => {
      const prof = s.profesor || profesoresMap[s.profesor_id]
      const trainerName = prof
        ? `${prof.nombre} ${prof.apellido}`.trim()
        : `Profesor #${s.profesor_id}`

      const periodName = `${String(s.mes).padStart(2, '0')}/${s.anio}`
      const isPaid = (s.estado || '').toLowerCase() === 'pagada'

      return {
        id: `LIQ-${s.id}`,
        rawId: s.id,
        profesorId: s.profesor_id,
        trainer: trainerName,
        cbu_alias: prof?.cbu_alias || 'No registrado',
        period: periodName,
        mes: s.mes,
        anio: s.anio,
        totalClasses: s.total_alumnos || 0,
        commission: Number(s.total_liquidado) || 0,
        totalColibri: Number(s.total_colibri) || 0,
        totalRecaudado: Number(s.total_recaudado) || 0,
        status: isPaid ? 'Pagado' : 'Pendiente',
        date: s.fecha_creacion
          ? new Date(s.fecha_creacion).toLocaleDateString('es-AR')
          : 'Reciente',
        fechaPago: s.fecha_pago,
        comprobante: s.comprobante || '—',
        observaciones: s.observaciones || '',
      }
    })
    .sort((a, b) => b.rawId - a.rawId)

  // 6. Stats
  const activeMembers = members.filter((m) => m.activo).length
  const currentMonthPayments = payments.filter(
    (p) => p.mes === currentMonth && p.anio === currentYear
  )
  const monthlyRevenue = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0)
  const overdueCount = members.filter((m) => m.activo && m.status === 'Vencido').length

  const stats = {
    activeMembers,
    monthlyRevenue,
    overdueCount,
    activeTrend:
      activeMembers === 0
        ? 'Sin socios registrados'
        : `${activeMembers} socios activos en padrón`,
    revenueTrend:
      monthlyRevenue === 0
        ? 'Sin cobros en el período'
        : `${currentMonthPayments.length} pagos cobrados este mes`,
    overdueTrend:
      overdueCount === 0
        ? 'Cobranzas 100% al día'
        : `${overdueCount} alumnos con cuota vencida`,
  }

  // Quick actions: Payments
  const openPaymentModal = useCallback((member = null) => {
    setSelectedMemberForPayment(member)
    setIsPaymentModalOpen(true)
  }, [])

  const closePaymentModal = useCallback(() => {
    setSelectedMemberForPayment(null)
    setIsPaymentModalOpen(false)
  }, [])

  // Quick actions: Members
  const openNewMemberModal = useCallback(() => {
    setIsNewMemberModalOpen(true)
  }, [])

  const closeNewMemberModal = useCallback(() => {
    setIsNewMemberModalOpen(false)
  }, [])

  // Quick actions: Trainers
  const openNewTrainerModal = useCallback(() => {
    setIsNewTrainerModalOpen(true)
  }, [])

  const closeNewTrainerModal = useCallback(() => {
    setIsNewTrainerModalOpen(false)
  }, [])

  // Quick actions: Classes
  const openNewClassModal = useCallback(() => {
    setIsNewClassModalOpen(true)
  }, [])

  const closeNewClassModal = useCallback(() => {
    setIsNewClassModalOpen(false)
  }, [])

  const openClassStudentsModal = useCallback((cls) => {
    setSelectedClassForStudents(cls)
  }, [])

  const closeClassStudentsModal = useCallback(() => {
    setSelectedClassForStudents(null)
  }, [])

  // Quick actions: Settlements
  const openNewSettlementModal = useCallback(() => {
    setIsNewSettlementModalOpen(true)
  }, [])

  const closeNewSettlementModal = useCallback(() => {
    setIsNewSettlementModalOpen(false)
  }, [])

  const openSettlementDetailModal = useCallback((settlement) => {
    setSelectedSettlementForDetail(settlement)
  }, [])

  const closeSettlementDetailModal = useCallback(() => {
    setSelectedSettlementForDetail(null)
  }, [])

  // Quick actions: Edit Modals
  const openEditMemberModal = useCallback((member) => {
    setSelectedMemberForEdit(member)
    setIsEditMemberModalOpen(true)
  }, [])

  const closeEditMemberModal = useCallback(() => {
    setSelectedMemberForEdit(null)
    setIsEditMemberModalOpen(false)
  }, [])

  const openEditTrainerModal = useCallback((trainer) => {
    setSelectedTrainerForEdit(trainer)
    setIsEditTrainerModalOpen(true)
  }, [])

  const closeEditTrainerModal = useCallback(() => {
    setSelectedTrainerForEdit(null)
    setIsEditTrainerModalOpen(false)
  }, [])

  const openTrainerClassesModal = useCallback((trainer) => {
    setSelectedTrainerForClasses(trainer)
    setIsTrainerClassesModalOpen(true)
  }, [])

  const closeTrainerClassesModal = useCallback(() => {
    setSelectedTrainerForClasses(null)
    setIsTrainerClassesModalOpen(false)
  }, [])

  const openEditClassModal = useCallback((cls) => {
    setSelectedClassForEdit(cls)
    setIsEditClassModalOpen(true)
  }, [])

  const closeEditClassModal = useCallback(() => {
    setSelectedClassForEdit(null)
    setIsEditClassModalOpen(false)
  }, [])

  const openMemberClassesModal = useCallback((member) => {
    setSelectedMemberForClasses(member)
    setIsMemberClassesModalOpen(true)
  }, [])

  const closeMemberClassesModal = useCallback(() => {
    setSelectedMemberForClasses(null)
    setIsMemberClassesModalOpen(false)
  }, [])

  // ================= MUTATIONS CON API REAL =================

  // 1. Add Member
  const addMember = useCallback(
    async (formData) => {
      // Split name into nombre & apellido
      const parts = (formData.name || '').trim().split(' ')
      const nombre = parts[0] || 'Alumno'
      const apellido = parts.slice(1).join(' ') || '-'

      const alumnoPayload = {
        nombre,
        apellido,
        dni: formData.dni || null,
        email: formData.email || null,
        telefono: formData.phone || null,
        descuento_familiar: Boolean(formData.descuentoFamiliar),
        observaciones: formData.observaciones || null,
      }

      const newAlumno = await api.alumnos.create(alumnoPayload)

      // Collect all class IDs to enroll
      let classIdsToEnroll = []
      if (Array.isArray(formData.classIds)) {
        classIdsToEnroll = formData.classIds.map(Number).filter(Boolean)
      } else if (formData.classId) {
        classIdsToEnroll = [Number(formData.classId)].filter(Boolean)
      }

      // Enroll in selected classes
      for (const cId of classIdsToEnroll) {
        try {
          await api.inscripciones.create({
            alumno_id: newAlumno.id,
            clase_id: cId,
            observaciones: 'Inscripción inicial al dar de alta',
          })
        } catch (enrollErr) {
          console.warn(`Error inscribiendo en clase ${cId}:`, enrollErr)
        }
      }

      // Record immediate payment if payNow is selected
      if (formData.payNow && classIdsToEnroll.length > 0) {
        try {
          const distinctActs = new Set(
            classIdsToEnroll.map((id) => clasesMap[id]?.actividad_id || id)
          )
          const isMulti = !formData.descuentoFamiliar && distinctActs.size >= 2
          await api.pagos.create({
            alumno_id: newAlumno.id,
            mes: currentMonth,
            anio: currentYear,
            metodo_pago: formData.paymentMethod || 'Efectivo',
            clases_ids: classIdsToEnroll,
            descuento_porcentaje: isMulti ? 10 : 0,
            observaciones:
              'Cobro de primera cuota al dar de alta' +
              (isMulti ? ' (10% Desc. Multi-actividad)' : ''),
          })
        } catch (payErr) {
          console.warn('Error registrando pago inicial:', payErr)
        }
      }

      await refreshData()
      return newAlumno
    },
    [currentMonth, currentYear, refreshData]
  )

  // 1b. Update Member
  const updateMember = useCallback(
    async (id, data) => {
      const rawId =
        typeof id === 'string' && id.startsWith('ALU-')
          ? Number(id.replace('ALU-', ''))
          : Number(id)
      const res = await api.alumnos.update(rawId, data)
      await refreshData()
      return res
    },
    [refreshData]
  )

  // 2. Record Payment
  const recordPayment = useCallback(
    async ({ alumnoId, mes, anio, method, clasesIds, descuentoPorcentaje, observaciones }) => {
      const payload = {
        alumno_id: Number(alumnoId),
        mes: Number(mes) || currentMonth,
        anio: Number(anio) || currentYear,
        metodo_pago: method || 'Efectivo',
        clases_ids: clasesIds && clasesIds.length > 0 ? clasesIds.map(Number) : null,
        descuento_porcentaje: Number(descuentoPorcentaje) || 0,
        observaciones: observaciones || null,
      }

      const res = await api.pagos.create(payload)
      await refreshData()
      return res
    },
    [currentMonth, currentYear, refreshData]
  )

  // 3. Add Trainer
  const addTrainer = useCallback(
    async (formData, selectedClassIds = []) => {
      const rawSelectedIds = (
        formData.clases_ids ||
        selectedClassIds ||
        []
      ).map((id) =>
        typeof id === 'string' && id.startsWith('CLS-')
          ? Number(id.replace('CLS-', ''))
          : Number(id)
      )

      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni || null,
        email: formData.email || null,
        telefono: formData.telefono || null,
        cbu_alias: formData.cbu_alias || null,
        porcentaje_honorarios: Number(formData.porcentaje_honorarios) || 60,
        observaciones: formData.observaciones || null,
        clases_ids: rawSelectedIds.length > 0 ? rawSelectedIds : null,
      }

      const res = await api.profesores.create(payload)

      await refreshData()
      return res
    },
    [refreshData]
  )

  // 3b. Update Trainer
  const updateTrainer = useCallback(
    async (id, data, selectedClassIds = null, reassignments = {}) => {
      const rawId =
        typeof id === 'string' && id.startsWith('PROF-')
          ? Number(id.replace('PROF-', ''))
          : Number(id)
      const res = await api.profesores.update(rawId, data)

      // Si se especificaron clases en el panel, actualizar asignaciones
      if (selectedClassIds !== null) {
        for (const classId of selectedClassIds) {
          try {
            await api.clases.update(classId, { profesor_id: rawId })
          } catch (err) {
            console.error(`Error actualizando clase ${classId}:`, err)
          }
        }

        // Si se desmarcó alguna clase previa, reasignarla al profesor indicado
        if (reassignments && typeof reassignments === 'object') {
          for (const [classId, newProfId] of Object.entries(reassignments)) {
            if (newProfId && Number(newProfId) !== rawId) {
              try {
                await api.clases.update(Number(classId), { profesor_id: Number(newProfId) })
              } catch (err) {
                console.error(`Error reasignando clase ${classId} al profesor ${newProfId}:`, err)
              }
            }
          }
        }
      }

      await refreshData()
      return res
    },
    [refreshData]
  )

  // 3c. Assign Classes to Trainer
  const assignClassesToTrainer = useCallback(
    async (trainerId, selectedClassIds, reassignments = {}) => {
      const rawId =
        typeof trainerId === 'string' && trainerId.startsWith('PROF-')
          ? Number(trainerId.replace('PROF-', ''))
          : Number(trainerId)

      for (const classId of selectedClassIds) {
        try {
          await api.clases.update(classId, { profesor_id: rawId })
        } catch (err) {
          console.error(`Error asignando clase ${classId} al profesor ${rawId}:`, err)
        }
      }

      if (reassignments && typeof reassignments === 'object') {
        for (const [classId, newProfId] of Object.entries(reassignments)) {
          if (newProfId && Number(newProfId) !== rawId) {
            try {
              await api.clases.update(Number(classId), { profesor_id: Number(newProfId) })
            } catch (err) {
              console.error(`Error reasignando clase ${classId} al profesor ${newProfId}:`, err)
            }
          }
        }
      }

      await refreshData()
    },
    [refreshData]
  )

  // 4. Add Class
  const addClass = useCallback(
    async (formData) => {
      const payload = {
        nombre: formData.name.trim(),
        profesor_id: Number(formData.profesorId),
        actividad_id: formData.actividadId
          ? Number(formData.actividadId)
          : formData.actividad_id
          ? Number(formData.actividad_id)
          : null,
        descripcion: formData.room || 'Salón Principal',
        dias_horarios: formData.schedule || 'A convenir',
        precio_base: Number(formData.precioBase) || 50000,
        porcentaje_profesor: Number(formData.porcentajeProfesor) || 60,
        cupo_maximo: Number(formData.capacity) || 20,
      }

      const res = await api.clases.create(payload)
      await refreshData()
      return res
    },
    [refreshData]
  )

  // 4b. Update Class
  const updateClass = useCallback(
    async (id, data) => {
      const rawId =
        typeof id === 'string' && id.startsWith('CLS-')
          ? Number(id.replace('CLS-', ''))
          : Number(id)
      const payload = { ...data }
      if ('actividadId' in payload) {
        payload.actividad_id = payload.actividadId ? Number(payload.actividadId) : null
        delete payload.actividadId
      }
      const res = await api.clases.update(rawId, payload)
      await refreshData()
      return res
    },
    [refreshData]
  )

  // 4c. Actividades
  const addActividad = useCallback(
    async (formData) => {
      const res = await api.actividades.create(formData)
      await refreshData()
      return res
    },
    [refreshData]
  )

  const updateActividad = useCallback(
    async (id, data) => {
      const res = await api.actividades.update(id, data)
      await refreshData()
      return res
    },
    [refreshData]
  )

  const deleteActividad = useCallback(
    async (id, soft = true) => {
      await api.actividades.delete(id, soft)
      await refreshData()
    },
    [refreshData]
  )

  // 5. Add Settlement
  const addSettlement = useCallback(
    async ({ profesorId, mes, anio, observaciones }) => {
      const payload = {
        profesor_id: Number(profesorId),
        mes: Number(mes) || currentMonth,
        anio: Number(anio) || currentYear,
        observaciones: observaciones || null,
      }

      const res = await api.liquidaciones.create(payload)
      await refreshData()
      return res
    },
    [currentMonth, currentYear, refreshData]
  )

  // 6. Update Settlement Status (Marcar pagada)
  const updateSettlementStatus = useCallback(
    async (id, newStatus, comprobante = 'Comprobante emitido') => {
      const rawId = typeof id === 'string' && id.startsWith('LIQ-') ? Number(id.replace('LIQ-', '')) : Number(id)
      if (newStatus === 'Pagado') {
        await api.liquidaciones.marcarPagada(rawId, {
          comprobante: comprobante || 'Comprobante emitido',
          observaciones: 'Marcado como pagado desde la plataforma',
        })
      }
      await refreshData()
    },
    [refreshData]
  )

  // 7. Enroll Student in Class
  const enrollStudent = useCallback(
    async (alumnoId, claseId, observaciones = '') => {
      const res = await api.inscripciones.create({
        alumno_id: Number(alumnoId),
        clase_id: Number(claseId),
        observaciones: observaciones || null,
      })
      await refreshData()
      return res
    },
    [refreshData]
  )

  // 8. Remove Student Enrollment
  const removeEnrollment = useCallback(
    async (inscripcionId) => {
      await api.inscripciones.delete(inscripcionId)
      await refreshData()
    },
    [refreshData]
  )

  // 9. Delete Member (Soft Delete)
  const deleteMember = useCallback(
    async (id) => {
      const rawId =
        typeof id === 'string' && id.startsWith('ALU-')
          ? Number(id.replace('ALU-', ''))
          : Number(id)
      await api.alumnos.delete(rawId)
      await refreshData()
    },
    [refreshData]
  )

  // 10. Delete Trainer (Soft Delete)
  const deleteTrainer = useCallback(
    async (id) => {
      const rawId =
        typeof id === 'string' && id.startsWith('PROF-')
          ? Number(id.replace('PROF-', ''))
          : Number(id)
      await api.profesores.delete(rawId)
      await refreshData()
    },
    [refreshData]
  )

  // 11. Delete Class (Soft Delete)
  const deleteClass = useCallback(
    async (id) => {
      const rawId =
        typeof id === 'string' && id.startsWith('CLS-')
          ? Number(id.replace('CLS-', ''))
          : Number(id)
      await api.clases.delete(rawId)
      await refreshData()
    },
    [refreshData]
  )

  return (
    <GymContext.Provider
      value={{
        currentView,
        setCurrentView,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,

        // Data & Status
        isLoadingData,
        dataError,
        refreshData,

        // Entities
        actividades,
        rawActividades,
        members,
        rawAlumnos,
        trainers,
        rawProfesores,
        classes,
        rawClases,
        payments,
        settlements,
        inscripciones: rawInscripciones,
        stats,

        // Modals & Handlers
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        selectedMemberForPayment,

        isNewMemberModalOpen,
        openNewMemberModal,
        closeNewMemberModal,

        isNewTrainerModalOpen,
        openNewTrainerModal,
        closeNewTrainerModal,

        isNewClassModalOpen,
        openNewClassModal,
        closeNewClassModal,

        isNewSettlementModalOpen,
        openNewSettlementModal,
        closeNewSettlementModal,

        selectedSettlementForDetail,
        openSettlementDetailModal,
        closeSettlementDetailModal,

        selectedClassForStudents,
        openClassStudentsModal,
        closeClassStudentsModal,

        // Edit Modals
        selectedMemberForEdit,
        isEditMemberModalOpen,
        openEditMemberModal,
        closeEditMemberModal,

        selectedTrainerForEdit,
        isEditTrainerModalOpen,
        openEditTrainerModal,
        closeEditTrainerModal,

        selectedClassForEdit,
        isEditClassModalOpen,
        openEditClassModal,
        closeEditClassModal,

        // Member Classes Modal
        selectedMemberForClasses,
        isMemberClassesModalOpen,
        openMemberClassesModal,
        closeMemberClassesModal,

        // Trainer Classes Modal
        selectedTrainerForClasses,
        isTrainerClassesModalOpen,
        openTrainerClassesModal,
        closeTrainerClassesModal,

        // Actions
        addMember,
        updateMember,
        deleteMember,
        recordPayment,
        addTrainer,
        updateTrainer,
        assignClassesToTrainer,
        deleteTrainer,
        addClass,
        updateClass,
        deleteClass,
        addActividad,
        updateActividad,
        deleteActividad,
        addSettlement,
        updateSettlementStatus,
        enrollStudent,
        removeEnrollment,
      }}
    >
      {children}
    </GymContext.Provider>
  )
}

export { GymContext }
