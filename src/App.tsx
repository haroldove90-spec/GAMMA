import { useState } from 'react';
import { Settings, Plus, Terminal, Package, ClipboardList, AlertTriangle, ChevronLeft, LayoutDashboard, Wrench, BarChart3, Search, LogOut, Layout, User, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { InstallPrompt } from './components/InstallPrompt';
import { ReceptionForm } from './features/reception/ReceptionForm';
import { WorkshopDashboard } from './features/workshop/WorkshopDashboard';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { cn } from '@/lib/utils';

import { ConnectionCheck } from './components/ConnectionCheck';

type AppView = 'dashboard' | 'reception' | 'workshop' | 'admin';

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');

  return (
    <div className="bg-[#E9EDF1] text-[#2D3748] font-sans min-h-screen flex overflow-hidden">
      <Toaster position="top-right" richColors />
      <InstallPrompt />
      
      {/* Sidebar - Gama Navy #002B45 */}
      <aside className="w-68 bg-[#002B45] flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-inner">
            <img 
              src="https://cossma.com.mx/gama.png" 
              alt="Gama Logo" 
              className="h-8 w-auto"
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white italic leading-none">GAMA</h1>
            <p className="text-[7px] uppercase font-bold text-[#FF4F00] tracking-widest mt-1">REPAIR CENTER</p>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          <SidebarItem 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
          />
          <SidebarItem 
            active={view === 'admin'} 
            onClick={() => setView('admin')} 
            icon={<BarChart3 className="w-5 h-5" />}
            label="Estadísticas"
            badge="2"
          />
          <SidebarItem 
            active={view === 'workshop'} 
            onClick={() => setView('workshop')} 
            icon={<Wrench className="w-5 h-5" />}
            label="Taller"
          />
          <SidebarItem 
            active={view === 'reception'} 
            onClick={() => setView('reception')} 
            icon={<ClipboardList className="w-5 h-5" />}
            label="Formularios"
          />
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="opacity-80 scale-90 origin-left">
            <ConnectionCheck />
          </div>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all group">
            <LogOut className="w-4 h-4 group-hover:text-[#FF4F00] transition-colors" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <Layout className="w-4 h-4" />
              <span>/</span>
              <span className="text-gray-700">{view}</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#FF4F00] transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por folio o cliente..." 
                className="bg-[#F8FAFC] border border-gray-100 rounded-xl pl-12 pr-6 py-2.5 text-xs w-80 focus:ring-1 focus:ring-[#FF4F00]/30 focus:bg-white transition-all outline-none font-medium text-gray-600"
              />
            </div>
            
            <div className="flex items-center gap-4 border-l border-gray-100 pl-8">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-gray-800 leading-tight tracking-tighter">Administrador</p>
                <p className="text-[8px] font-bold text-[#FF4F00] uppercase tracking-widest">Gama Pro</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#002D4C] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#002D4C]/20 border border-white/10">
                G1
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#E9EDF1]">
          {view === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10 max-w-7xl mx-auto">
              {/* Widgets Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <WidgetCard label="Ventas Mensuales" value="$84.2k" color="text-[#FF4F00]" trend="up" />
                <WidgetCard label="Órdenes Activas" value="156" color="text-[#002D4C]" trend="up" />
                <WidgetCard label="Diagnósticos" value="28" color="text-[#002D4C]" trend="down" />
                <WidgetCard label="Pendientes" value="12" color="text-red-500" trend="warning" />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Table Widget */}
                <div className="lg:col-span-2 bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-white overflow-hidden">
                  <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-white">
                    <div>
                      <h3 className="font-black text-gray-800 uppercase text-xs tracking-[0.2em]">Registro de Actividad</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Últimas 24 horas</p>
                    </div>
                    <button 
                      onClick={() => setView('reception')}
                      className="bg-[#FF4F00] text-white text-[10px] px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-[#E64700] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#FF4F00]/30"
                    >
                      Nueva Orden +
                    </button>
                  </div>
                  
                  <div className="divide-y divide-gray-50">
                    <div className="grid grid-cols-6 p-5 bg-gray-50/50 text-[9px] font-black uppercase tracking-widest text-gray-400 px-10">
                      <div>Folio</div>
                      <div className="col-span-2">Equipo</div>
                      <div className="col-span-2">Cliente</div>
                      <div className="text-right">Estado</div>
                    </div>
                    <OrderRowUI id="GMA-001" eq="TV Samsung 55" cl="M. Lopez" ph="55 12..34" st="En Proceso" />
                    <OrderRowUI id="GMA-002" eq="MacBook Pro" cl="R. Mendez" ph="55 56..78" st="Pendiente" />
                    <OrderRowUI id="GMA-003" eq="PS5 Slim" cl="C. Ortiz" ph="55 99..00" st="Listo" />
                    <OrderRowUI id="GMA-004" eq="Xbox Series X" cl="L. Diaz" ph="55 44..55" st="Entregado" />
                  </div>
                </div>

                {/* Secondary Widgets Column */}
                <div className="space-y-8">
                  <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-white">
                    <h3 className="font-black text-xs uppercase tracking-widest mb-8 text-gray-800">Alertas de Stock</h3>
                    <div className="space-y-6">
                       <ProgressItem name="Componentes Audio" percent={15} color="bg-red-500" value="02" />
                       <ProgressItem name="Refacciones Video" percent={45} color="bg-[#FF4F00]" value="08" />
                       <ProgressItem name="Insumos Taller" percent={85} color="bg-blue-500" value="45" />
                    </div>
                  </div>

                  <div className="bg-[#002D4C] rounded-[40px] p-10 shadow-2xl text-white relative overflow-hidden group border border-white/5">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FF4F00]/20 rounded-full blur-3xl group-hover:bg-[#FF4F00]/30 transition-colors duration-700"></div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-2 text-[#FF4F00]">Status Operativo</h3>
                    <p className="text-2xl font-black tracking-tight leading-tight mb-6">Eficiencia del<br/>Taller: 94%</p>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-70">Sistema en Línea</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'admin' && (
            <main className="animate-in fade-in zoom-in duration-700">
              <AdminDashboard />
            </main>
          )}

          {view === 'workshop' && (
            <main className="h-full animate-in fade-in slide-in-from-right-6 duration-700">
              <WorkshopDashboard />
            </main>
          )}

          {view === 'reception' && (
            <main className="bg-white rounded-[40px] shadow-2xl p-10 border border-white animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto">
              <ReceptionForm 
                onBack={() => setView('dashboard')} 
                onSuccess={() => setView('dashboard')} 
              />
            </main>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, label, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
        active 
          ? "bg-[#FF4F00] text-white shadow-xl shadow-[#FF4F00]/20 scale-[1.03]" 
          : "text-white/30 hover:bg-white/5 hover:text-white"
      )}
    >
      <div className="flex items-center gap-4 z-10">
        <span className={cn("transition-all duration-500", active ? "text-white scale-110" : "group-hover:text-[#FF4F00]")}>
          {icon}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      {badge && (
        <span className={cn(
          "text-[9px] font-black px-2.5 py-1 rounded-lg z-10",
          active ? "bg-white text-[#FF4F00]" : "bg-[#FF4F00] text-white"
        )}>
          {badge}
        </span>
      )}
      {active && (
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white rounded-l-full"></div>
      )}
    </button>
  );
}

function WidgetCard({ label, value, color, trend }: any) {
  return (
    <div className="bg-white p-8 rounded-[45px] shadow-xl shadow-gray-200/40 border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <p className="text-[9px] uppercase font-black tracking-widest text-gray-300 group-hover:text-[#FF4F00] transition-colors">{label}</p>
        <div className={cn(
          "w-8 h-8 rounded-2xl flex items-center justify-center opacity-20",
          trend === 'up' ? "bg-green-500" : trend === 'down' ? "bg-red-500" : "bg-orange-500"
        )}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-700" /> : <TrendingDown className="w-4 h-4 text-red-700" />}
        </div>
      </div>
      <span className={cn("text-4xl font-black tracking-tighter block", color)}>{value}</span>
      <div className="mt-8 flex items-center justify-between ">
        <span className="text-[10px] font-black text-gray-400">vs Mes Pasado</span>
        <div className="flex gap-1 h-8 items-end">
          <div className="w-1 bg-gray-50 rounded-full h-[40%] group-hover:h-[70%] transition-all duration-500"></div>
          <div className="w-1 bg-gray-50 rounded-full h-[60%] group-hover:h-[90%] transition-all duration-500 delay-75"></div>
          <div className="w-1 bg-[#FF4F00] rounded-full h-[20%] group-hover:h-[100%] transition-all duration-500 delay-150"></div>
        </div>
      </div>
    </div>
  );
}

function OrderRowUI({ id, eq, cl, ph, st }: any) {
  const stColor = st === 'Listo' ? 'bg-green-50 text-green-600' : st === 'En Proceso' ? 'bg-blue-50 text-blue-600' : st === 'Entregado' ? 'bg-gray-50 text-gray-400' : 'bg-orange-50 text-orange-600';
  return (
    <div className="grid grid-cols-6 items-center p-6 bg-white hover:bg-gray-50 transition-all cursor-pointer group px-10">
      <div className="font-mono text-xs font-black text-gray-300 group-hover:text-[#FF4F00] transition-colors">{id}</div>
      <div className="col-span-2">
        <p className="font-black text-[11px] text-gray-800 uppercase tracking-tight">{eq}</p>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Diagnóstico pend.</p>
      </div>
      <div className="col-span-2">
        <p className="text-[11px] font-black text-gray-700 uppercase leading-none">{cl}</p>
        <p className="text-[9px] text-[#FF4F00] font-black mt-1.5 tracking-widest">{ph}</p>
      </div>
      <div className="text-right">
        <span className={cn("px-4 py-1.5 text-[8px] font-black uppercase rounded-xl inline-block", stColor)}>
          {st}
        </span>
      </div>
    </div>
  );
}

function ProgressItem({ name, percent, color, value }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{name}</p>
        <span className={cn("text-xl font-black leading-none", percent < 20 ? "text-red-500" : "text-gray-900 tracking-tighter")}>{value}</span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-100 shadow-inner p-[1px]">
        <div className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", color)} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
