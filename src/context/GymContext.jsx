import { createContext, useState, useCallback } from 'react'
import { initialGymData } from '../data/mockData'

const GymContext = createContext(null)

export function GymProvider({ children }) {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false)
  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState(null)

  // New settlement & class modal states
  const [isNewSettlementModalOpen, setIsNewSettlementModalOpen] = useState(false)
  const [selectedSettlementForDetail, setSelectedSettlementForDetail] = useState(null)
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false)
  const [selectedClassForStudents, setSelectedClassForStudents] = useState(null)

  const [members, setMembers] = useState(initialGymData.members)
  const [payments, setPayments] = useState(initialGymData.recentPayments)
  const [stats, setStats] = useState(initialGymData.stats)
  const [trainers] = useState(initialGymData.trainers)
  const [classes, setClasses] = useState(initialGymData.classes)
  const [settlements, setSettlements] = useState(initialGymData.settlements)

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

  const recordPayment = useCallback(({ memberName, plan, amount, method }) => {
    const now = new Date()
    const paymentRecord = {
      id: `PAY-${9000 + (Date.now() % 1000)}`,
      memberName,
      plan,
      amount: Number(amount),
      method: method || 'Efectivo',
      date: 'Hoy, ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Completado',
    }

    setPayments((prev) => [paymentRecord, ...prev])
    setStats((prev) => {
      return {
        ...prev,
        monthlyRevenue: prev.monthlyRevenue + Number(amount),
        overdueCount: Math.max(0, prev.overdueCount - 1),
      }
    })

    setMembers((prev) =>
      prev.map((m) => {
        if (m.name === memberName) {
          const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          return {
            ...m,
            status: 'Al Día',
            lastPayment: now.toISOString().split('T')[0],
            dueDate: nextMonth.toISOString().split('T')[0],
          }
        }
        return m
      })
    )

    closePaymentModal()
  }, [closePaymentModal])

  const addMember = useCallback((newMemberData) => {
    const today = new Date().toISOString().split('T')[0]
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const newId = `ALU-${Math.floor(100 + Math.random() * 900)}`

    const newMember = {
      id: newId,
      name: newMemberData.name,
      dni: newMemberData.dni || 'S/DNI',
      email: newMemberData.email || '',
      phone: newMemberData.phone || '',
      plan: newMemberData.plan,
      status: 'Al Día',
      lastPayment: today,
      dueDate: nextMonth,
      amount: Number(newMemberData.amount) || 50000,
    }

    setMembers((prev) => [newMember, ...prev])
    setStats((prev) => ({
      ...prev,
      activeMembers: prev.activeMembers + 1,
    }))

    if (newMemberData.payNow) {
      recordPayment({
        memberName: newMember.name,
        plan: newMember.plan,
        amount: newMember.amount,
        method: newMemberData.paymentMethod || 'Efectivo',
      })
    }

    closeNewMemberModal()
  }, [closeNewMemberModal, recordPayment])

  // Add settlement
  const addSettlement = useCallback((data) => {
    const todayStr = new Date().toLocaleDateString('es-AR')
    const newId = `LIQ-2026-11-${String(settlements.length + 1).padStart(2, '0')}`
    const newRecord = {
      id: newId,
      trainer: data.trainer,
      period: data.period || 'Noviembre 2026',
      totalClasses: Number(data.totalClasses) || 40,
      commission: Number(data.commission) || 160000,
      status: data.status || 'Pendiente',
      date: todayStr,
    }

    setSettlements((prev) => [newRecord, ...prev])
    closeNewSettlementModal()
  }, [closeNewSettlementModal, settlements.length])

  // Update settlement status (e.g. mark as Pagado)
  const updateSettlementStatus = useCallback((id, newStatus) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    )
    if (selectedSettlementForDetail && selectedSettlementForDetail.id === id) {
      setSelectedSettlementForDetail((prev) => ({ ...prev, status: newStatus }))
    }
  }, [selectedSettlementForDetail])

  // Add class
  const addClass = useCallback((classData) => {
    const newId = `CLS-${String(classes.length + 1).padStart(2, '0')}`
    const newClass = {
      id: newId,
      name: classData.name,
      trainer: classData.trainer,
      schedule: classData.schedule,
      room: classData.room || 'Salón Principal',
      capacity: Number(classData.capacity) || 20,
      enrolled: 0,
    }

    setClasses((prev) => [newClass, ...prev])
    closeNewClassModal()
  }, [classes.length, closeNewClassModal])

  return (
    <GymContext.Provider
      value={{
        currentView,
        setCurrentView,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        isNewMemberModalOpen,
        openNewMemberModal,
        closeNewMemberModal,
        selectedMemberForPayment,
        isNewSettlementModalOpen,
        openNewSettlementModal,
        closeNewSettlementModal,
        selectedSettlementForDetail,
        openSettlementDetailModal,
        closeSettlementDetailModal,
        isNewClassModalOpen,
        openNewClassModal,
        closeNewClassModal,
        selectedClassForStudents,
        openClassStudentsModal,
        closeClassStudentsModal,
        members,
        payments,
        stats,
        trainers,
        classes,
        settlements,
        addMember,
        recordPayment,
        addSettlement,
        updateSettlementStatus,
        addClass,
      }}
    >
      {children}
    </GymContext.Provider>
  )
}

export { GymContext }
