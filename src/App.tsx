import { useState } from 'react';
import { Settings, Plus, Terminal, Package, ClipboardList, AlertTriangle, ChevronLeft, LayoutDashboard, Wrench, BarChart3 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { ReceptionForm } from './features/reception/ReceptionForm';
import { WorkshopDashboard } from './features/workshop/WorkshopDashboard';
import { AdminDashboard } from './features/admin/AdminDashboard';

type AppView = 'dashboard' | 'reception' | 'workshop' | 'admin';

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');

  return (
    <div className="bg-[#0F1115] text-[#F8F8F8] font-sans min-h-screen flex flex-col overflow-x-hidden">
      <Toaster position="top-right" richColors />
      
      {/* Header Section with Bold Typography */}
      <header className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-baseline border-b border-white/10 gap-4">
        <div className="flex items-baseline gap-4 cursor-pointer" onClick={() => setView('dashboard')}>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none select-none text-white">GAMA</h1>
          <span className="text-xs uppercase tracking-[0.4em] font-medium text-yellow-400">Centro de Reparación</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-baseline gap-6 w-full md:w-auto">
          <nav className="flex gap-4 mb-4 md:mb-0">
            <NavButton 
              active={view === 'dashboard'} 
              onClick={() => setView('dashboard')} 
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Admin"
            />
            <NavButton 
              active={view === 'workshop'} 
              onClick={() => setView('workshop')} 
              icon={<Wrench className="w-4 h-4" />}
              label="Taller"
            />
            <NavButton 
              active={view === 'admin'} 
              onClick={() => setView('admin')} 
              icon={<BarChart3 className="w-4 h-4" />}
              label="Inteligencia"
            />
          </nav>
          <div className="text-left md:text-right w-full md:w-auto">
            <p className="text-[10px] md:text-sm font-mono opacity-50 uppercase">Estado del Sistema / {new Date().toLocaleDateString('es-MX')}</p>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-tight">
              {view === 'dashboard' ? 'Dashboard Administrativo' : 
               view === 'reception' ? 'Módulo de Recepción' : 
               view === 'admin' ? 'Inteligencia de Negocio' : 'Taller Operativo'}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {view === 'dashboard' && (
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/5 p-px animate-in fade-in duration-500 overflow-y-auto">
            {/* Left Col: Key Metrics */}
            <section className="lg:col-span-3 bg-[#0F1115] p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-8 lg:mb-12">Órdenes Activas</p>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                  <div>
                    <span className="text-4xl md:text-6xl font-black leading-none block">24</span>
                    <span className="text-xs uppercase font-bold text-yellow-500">Pendientes</span>
                  </div>
                  <div>
                    <span className="text-4xl md:text-6xl font-black leading-none block text-blue-400">12</span>
                    <span className="text-xs uppercase font-bold">En Proceso</span>
                  </div>
                  <div>
                    <span className="text-4xl md:text-6xl font-black leading-none block text-green-500">08</span>
                    <span className="text-xs uppercase font-bold">Listos</span>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/10 mt-8">
                <button 
                  onClick={() => setView('reception')}
                  className="w-full bg-white text-black py-4 font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 group"
                  id="btn-new-order"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Nueva Orden
                </button>
              </div>
            </section>

            {/* Middle Col: Recent Service Orders */}
            <section className="lg:col-span-6 bg-[#0F1115] p-6 overflow-x-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm uppercase tracking-widest font-bold border-l-4 border-yellow-400 pl-3">Ordenes Recientes</h2>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded cursor-pointer hover:bg-white/20 transition-colors">VISTA GLOBAL</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded cursor-pointer border border-blue-500/30">ACTUALIZANDO...</span>
                </div>
              </div>
              
              <div className="space-y-px bg-white/10 min-w-[600px]">
                {/* Table Header */}
                <div className="grid grid-cols-6 text-[10px] font-bold uppercase tracking-widest p-3 bg-[#16191E] opacity-50">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-2">Equipo</div>
                  <div className="col-span-2">Cliente</div>
                  <div className="col-span-1">Estado</div>
                </div>

                {/* Order Rows Mock Data */}
                <OrderRow 
                  id="#ORD-1024" 
                  equipment={'Smart TV Samsung 55"'} 
                  serial="SN-92834-X"
                  client="Ricardo Mendez"
                  phone="55-1234-5678"
                  status="Proceso"
                  statusColor="bg-yellow-400 text-black"
                />
                <OrderRow 
                  id="#ORD-1025" 
                  equipment={'MacBook Pro 14" M2'} 
                  serial="APPLE-Z0921"
                  client="Elena Guerrero"
                  phone="55-8765-4321"
                  status="Pendiente"
                  statusColor="bg-red-500 text-white"
                />
                <OrderRow 
                  id="#ORD-1026" 
                  equipment="Amplificador Marantz" 
                  serial="MZ-V1900"
                  client="Audio Design S.A."
                  phone="55-5555-5555"
                  status="Listo"
                  statusColor="bg-green-500 text-white"
                />
                <OrderRow 
                  id="#ORD-1027" 
                  equipment="PS5 Digital Edition" 
                  serial="PLAY-9921-A"
                  client="Julian Ortega"
                  phone="55-2233-4455"
                  status="Entregado"
                  statusColor="bg-white/20 text-white/60"
                />
              </div>
            </section>

            {/* Right Col: Parts & Inventory */}
            <section className="lg:col-span-3 bg-[#0F1115] p-6 lg:border-l border-white/10 overflow-y-auto">
              <h2 className="text-sm uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Inventario Refacciones
              </h2>
              
              <div className="space-y-4">
                <InventoryItem 
                  name="Capacitor 4700uF 50V"
                  stock={124}
                  price="$4.50 CU"
                  percentage={80}
                  color="bg-blue-500"
                />
                <InventoryItem 
                  name={'Panel LED 55" LG-K'}
                  stock={2}
                  price="LOW STOCK"
                  percentage={10}
                  color="bg-red-500"
                  alert={true}
                />
                <InventoryItem 
                  name="Pasta Térmica MX-4"
                  stock={15}
                  price="$18.00 CU"
                  percentage={45}
                  color="bg-blue-500"
                />
                <InventoryItem 
                  name="Switch HDMI 4K"
                  stock={8}
                  price="$35.00 CU"
                  percentage={25}
                  color="bg-yellow-500"
                />
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-[10px] font-mono opacity-30 leading-relaxed uppercase">
                  GAMA Repair Center v1.0.4<br/>
                  Cloud Connection: Stable<br/>
                  Latency: 38ms<br/>
                  Server: MX-SOUTH-01
                </p>
              </div>
            </section>
          </main>
        )}

        {view === 'workshop' && (
          <main className="flex-1 bg-white overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <WorkshopDashboard />
          </main>
        )}

        {view === 'admin' && (
          <main className="flex-1 bg-[#0b0c10] overflow-y-auto animate-in fade-in zoom-in duration-500">
            <AdminDashboard />
          </main>
        )}

        {view === 'reception' && (
          <main className="flex-1 bg-white overflow-y-auto">
            <ReceptionForm 
              onBack={() => setView('dashboard')} 
              onSuccess={() => setView('dashboard')} 
            />
          </main>
        )}
      </div>

      {/* Bottom Bar: Status Info */}
      <footer className="bg-white text-black px-6 md:px-8 py-2 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          SISTEMA ACTIVO: ADMIN_USER_01
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <span>ORDENES TOTALES: 1,482</span>
          <span className="text-red-600 underline flex items-center gap-1 cursor-pointer">
            <AlertTriangle className="w-3 h-3" />
            2 ALERTAS DE STOCK
          </span>
          <span className="opacity-40">TERMINALES CONECTADAS: 04</span>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
        active 
          ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" 
          : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function OrderRow({ id, equipment, serial, client, phone, status, statusColor }: any) {
  return (
    <div className="grid grid-cols-6 items-center p-4 bg-[#0F1115] hover:bg-white/5 transition-colors cursor-pointer group">
      <div className="font-mono text-sm opacity-60 group-hover:opacity-100">{id}</div>
      <div className="col-span-2">
        <p className="font-bold text-sm uppercase tracking-tight">{equipment}</p>
        <p className="text-[10px] opacity-40 font-mono tracking-tighter">S/N: {serial}</p>
      </div>
      <div className="col-span-2">
        <p className="text-sm font-medium">{client}</p>
        <p className="text-[10px] text-blue-400 font-mono italic">WA: {phone}</p>
      </div>
      <div className="col-span-1">
        <span className={`px-2 py-1 text-[9px] font-black uppercase inline-block text-center min-w-[75px] ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function InventoryItem({ name, stock, price, percentage, color, alert }: any) {
  return (
    <div className={`border border-white/10 p-4 transition-all hover:border-white/30 ${alert ? 'bg-red-900/10 border-red-500/50' : 'bg-white/5'}`}>
      <p className={`text-[10px] uppercase font-bold mb-1 ${alert ? 'text-red-400' : 'opacity-50'}`}>{name}</p>
      <div className="flex justify-between items-end mt-1">
        <span className="text-3xl font-black leading-none">{stock.toString().padStart(2, '0')}</span>
        <span className={`text-[10px] font-mono ${alert ? 'text-red-400' : 'text-green-400'}`}>{price}</span>
      </div>
      <div className="w-full bg-white/10 h-1 mt-3">
        <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
