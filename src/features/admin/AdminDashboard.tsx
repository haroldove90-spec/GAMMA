import * as React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  AlertTriangle, 
  Download, 
  Calendar,
  Wallet,
  CreditCard,
  Banknote,
  PackageSearch
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { exportToCSV } from '@/src/services/financeService';

// Mock Data for the demo if direct fetching fails
const MOCK_DATA = {
  revenue: 45800,
  expense: 12500,
  profit: 33300,
  conversionRate: 85.5,
  categoryData: [
    { name: 'Audio', value: 24, color: '#002D4C' },
    { name: 'Video', value: 45, color: '#FF4F00' },
    { name: 'Computación', value: 38, color: '#4F46E5' },
    { name: 'Línea Blanca', value: 18, color: '#10B981' }
  ],
  cashClosing: {
    'Efectivo': 15600,
    'Transferencia': 22400,
    'Tarjeta': 7800
  },
  criticalStock: [
    { id: '1', nombre: 'Capacitor 4700uF', stock: 2, precio_costo: 3.5 },
    { id: '2', nombre: 'Pasta Térmica MX-4', stock: 4, precio_costo: 12.0 },
    { id: '3', nombre: 'Switch HDMI 4K', stock: 3, precio_costo: 25.0 }
  ]
};

export function AdminDashboard() {
  const [data, setData] = React.useState(MOCK_DATA);

  const handleExport = () => {
    const reportData = [
      { Concepto: 'Ingresos Totales', Valor: data.revenue },
      { Concepto: 'Gastos Refacciones', Valor: data.expense },
      { Concepto: 'Utilidad Neta', Valor: data.profit },
      { Concepto: 'Tasa Conversión', Valor: `${data.conversionRate}%` }
    ];
    exportToCSV(reportData, `Reporte_GAMA_${new Date().toISOString().split('T')[0]}`);
    toast.success('Reporte exportado correctamente');
  };

  return (
    <div className="bg-transparent min-h-screen text-gray-800 p-0 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in zoom-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3 text-[#002D4C]">
              <BarChart3 className="w-10 h-10 text-[#FF4F00]" />
              BI & Finanzas
            </h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Gama Repair Center System</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-2xl h-12 px-6"
              onClick={() => toast.info('Filtrando datos...')}
            >
              <Calendar className="w-4 h-4 mr-2 text-[#FF4F00]" />
              Este Mes
            </Button>
            <Button 
              className="bg-[#FF4F00] hover:bg-[#e64700] text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-2xl shadow-xl shadow-[#FF4F00]/20 transition-transform active:scale-95"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
          </div>
        </div>

        {/* Primary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Ingresos Totales" 
            value={`$${data.revenue.toLocaleString()}`} 
            icon={<DollarSign className="text-green-500" />} 
            trend="+15%" 
            trendUp={true}
          />
          <StatCard 
            title="Gastos Refacciones" 
            value={`$${data.expense.toLocaleString()}`} 
            icon={<PackageSearch className="text-[#FF4F00]" />} 
            trend="-2%" 
            trendUp={false}
          />
          <StatCard 
            title="Utilidad Neta" 
            value={`$${data.profit.toLocaleString()}`} 
            icon={<TrendingUp className="text-blue-500" />} 
            trend="+18%" 
            trendUp={true}
          />
          <StatCard 
            title="Tasa de Conversión" 
            value={`${data.conversionRate}%`} 
            icon={<TrendingUp className="text-purple-500" />} 
            trend="+5%" 
            trendUp={true}
          />
        </div>

        {/* Middle Section: Visualization & Cash Closing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Chart Card */}
          <Card className="lg:col-span-2 bg-white rounded-[45px] shadow-2xl shadow-gray-200/50 border-none p-6 lg:p-10">
            <CardHeader className="p-0 flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">Reparaciones por Categoría</CardTitle>
                <CardDescription className="text-[10px] font-bold text-gray-500 uppercase mt-1">Distribución Operativa</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                 {data.categoryData.map(c => (
                   <div key={c.name} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></div>
                      <span className="text-[9px] font-black uppercase text-gray-400">{c.name}</span>
                   </div>
                 ))}
              </div>
            </CardHeader>
            <CardContent className="h-[350px] w-full p-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 'black', fill: '#94A3B8' }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 'black', fill: '#94A3B8' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontSize: '10px', fontWeight: 'black', padding: '15px' }}
                  />
                  <Bar dataKey="value" radius={[15, 15, 0, 0]} barSize={40}>
                    {data.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cash Closing Widget */}
          <Card className="bg-white rounded-[45px] shadow-2xl shadow-gray-200/50 border-none p-6 lg:p-10 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8">
               <Wallet className="w-16 h-16 lg:w-20 lg:h-20 text-gray-50 opacity-10 rotate-12 transition-transform group-hover:scale-110" />
            </div>
            
            <CardHeader className="p-0 mb-10 text-center">
              <CardDescription className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Cierre de Caja Diario</CardDescription>
              <CardTitle className="text-4xl lg:text-5xl font-black text-[#002D4C] tracking-tighter">
                ${Object.values(data.cashClosing).reduce((a: number, b: any) => a + (Number(b) || 0), 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0 space-y-8">
              <PaymentMethodItem 
                label="Efectivo" 
                amount={data.cashClosing['Efectivo']} 
                icon={<Banknote className="text-green-500" />}
                total={data.revenue}
              />
              <PaymentMethodItem 
                label="Transferencia" 
                amount={data.cashClosing['Transferencia']} 
                icon={<Wallet className="text-blue-500" />}
                total={data.revenue}
              />
              <PaymentMethodItem 
                label="Tarjeta" 
                amount={data.cashClosing['Tarjeta']} 
                icon={<CreditCard className="text-[#FF4F00]" />}
                total={data.revenue}
              />
            </CardContent>
            
            <div className="mt-10">
               <Button className="w-full bg-[#002D4C] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl h-14 shadow-2xl shadow-blue-900/30 hover:scale-[1.02] transition-transform active:scale-95">
                 Realizar Arqueo Completo
               </Button>
            </div>
          </Card>
        </div>

        {/* Inventory Section */}
        <Card className="bg-white rounded-[45px] shadow-2xl shadow-gray-200/50 border-none p-6 lg:p-10">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 p-0 mb-10">
            <div className="text-center sm:text-left">
              <CardTitle className="text-xs font-black tracking-widest uppercase text-gray-800">Alertas de Inventario Crítico</CardTitle>
              <CardDescription className="text-[10px] font-black text-red-500 uppercase mt-1 tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Detección de Stock Insuficiente
              </CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="text-[10px] font-black text-[#FF4F00] uppercase tracking-widest hover:bg-[#FF4F00]/5 rounded-xl px-4 py-2 w-full sm:w-auto">Ver Kardex Completo</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.criticalStock.map(item => (
                <div key={item.id} className="bg-gray-50/50 p-8 border border-gray-100 rounded-[35px] flex justify-between items-center group hover:border-[#FF4F00] transition-all hover:bg-white hover:shadow-2xl">
                  <div>
                    <h4 className="font-black text-gray-800 uppercase text-[11px] tracking-tight">{item.nombre}</h4>
                    <p className="text-[9px] text-gray-400 font-black uppercase mt-1 tracking-widest opacity-80">COSTO: ${item.precio_costo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-[#002D4C] leading-none tracking-tighter group-hover:text-[#FF4F00] transition-colors">{item.stock}</p>
                    <Badge variant="destructive" className="mt-2 bg-red-100 text-red-600 border-none text-[8px] font-black uppercase px-3 py-0.5 rounded-lg">Urgente</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <Card className="bg-white rounded-[45px] shadow-2xl shadow-gray-200/40 border-none p-6 lg:p-10 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden text-center md:text-left">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="w-14 h-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#FF4F00]/5 transition-colors">
            {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' })}
          </div>
          <Badge variant="outline" className={`border-none rounded-xl text-[10px] font-black px-4 py-1.5 ${trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600 shadow-sm shadow-red-100'}`}>
            {trend}
          </Badge>
        </div>
        <div>
          <CardDescription className="text-gray-300 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-gray-400 transition-colors">{title}</CardDescription>
          <CardTitle className="text-4xl font-black text-[#002D4C] tracking-tighter">{value}</CardTitle>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentMethodItem({ label, amount, icon, total }: any) {
  const percentage = (amount / total) * 100;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-50">
            {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 opacity-80' })}
          </div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-sm font-black text-gray-800 tracking-tighter">${amount.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden p-[2px] border border-gray-100 shadow-inner">
        <div 
          className="h-full bg-[#FF4F00] rounded-full shadow-lg shadow-[#FF4F00]/30 transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
