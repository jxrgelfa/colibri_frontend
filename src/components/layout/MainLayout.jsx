import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import DashboardView from '../dashboard/DashboardView'
import MembersView from '../views/MembersView'
import TrainersView from '../views/TrainersView'
import ClassesView from '../views/ClassesView'
import PaymentsView from '../views/PaymentsView'
import SettlementsView from '../views/SettlementsView'
import SettingsView from '../views/SettingsView'
import PaymentModal from '../modals/PaymentModal'
import NewMemberModal from '../modals/NewMemberModal'
import NewSettlementModal from '../modals/NewSettlementModal'
import SettlementDetailModal from '../modals/SettlementDetailModal'
import NewClassModal from '../modals/NewClassModal'
import NewTrainerModal from '../modals/NewTrainerModal'
import ClassStudentsModal from '../modals/ClassStudentsModal'
import { useGym } from '../../context/useGym'

export default function MainLayout() {
  const { currentView } = useGym()

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />
      case 'alumnos':
        return <MembersView />
      case 'profesores':
        return <TrainersView />
      case 'clases':
        return <ClassesView />
      case 'pagos':
        return <PaymentsView />
      case 'liquidaciones':
        return <SettlementsView />
      case 'configuracion':
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f8fafc] text-slate-800 antialiased font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. Slider / Sidebar Izquierdo fijo al 100% de la altura de la pantalla */}
      <Sidebar />

      {/* 2. Área Principal de Contenido con scroll independiente para evitar que el sidebar se corte */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Barra superior / Header */}
        <Header />

        {/* Contenedor de la vista activa */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {renderCurrentView()}
        </main>
      </div>

      {/* 3. Modales Globales de Acciones Rápidas y Operaciones */}
      <PaymentModal />
      <NewMemberModal />
      <NewSettlementModal />
      <SettlementDetailModal />
      <NewClassModal />
      <NewTrainerModal />
      <ClassStudentsModal />
    </div>
  )
}
