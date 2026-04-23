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
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const [loading, setLoading] = React.useState(false);

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
    <div className="bg-[#002D4C] min-h-screen text-[#f8f8f8] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-[#FF4F00]" />
              Business Intelligence
            </h1>
            <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-1">Salud Financiera & Operativa GAMA</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="border-white/10 text-white bg-white/5 hover:bg-white/10"
              onClick={() => toast.info('Sincronizando datos...')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Este Mes
            </Button>
            <Button 
              className="bg-[#FF4F00] hover:bg-[#e64700] text-white font-bold"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
          </div>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Ingresos Totales" 
            value={`$${data.revenue.toLocaleString()}`} 
            icon={<DollarSign className="w-6 h-6 text-green-500" />}
            trend="+12% vs anterior"
            isPositive={true}
          />
          <KPICard 
            title="Gastos Refacciones" 
            value={`$${data.expense.toLocaleString()}`} 
            icon={<TrendingDown className="w-6 h-6 text-red-500" />}
            trend="+5% en costos"
            isPositive={false}
          />
          <KPICard 
            title="Utilidad Neta" 
            value={`$${data.profit.toLocaleString()}`} 
            icon={<BarChart3 className="w-6 h-6 text-[#FF6B35]" />}
            trend="Rendimiento Óptimo"
            isPositive={true}
          />
          <KPICard 
            title="Tasa Conversión" 
            value={`${data.conversionRate}%`} 
            icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
            trend="Alta efectividad"
            isPositive={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <Card className="lg:col-span-2 bg-[#16191E] border-white/5 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-2">
                Reparaciones por Categoría
              </CardTitle>
              <CardDescription className="text-white/40">Volumen de equipos entregados exitosamente</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#718096" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#718096" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: '#1A202C', borderColor: '#2D3748', color: '#FFF' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                    {data.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cash Closing / Payment Methods */}
          <Card className="bg-[#16191E] border-white/5 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-2">
                Cierre de Caja Diario
              </CardTitle>
              <CardDescription className="text-white/40">Distribución de cobros realizados hoy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
              
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase font-bold text-white/40">Total Arqueo</span>
                  <span className="text-3xl font-black text-[#FF4F00] tracking-tighter">
                    ${Object.values(data.cashClosing).reduce((a, b) => a + b, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Inventory & Low Stock */}
        <div className="mt-8">
          <Card className="bg-[#16191E] border-white/5 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Inventario Crítico
                </CardTitle>
              </div>
              <Button size="sm" variant="ghost" className="text-[10px] font-bold text-[#FF4F00]">VER TODO EL KARDEX</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.criticalStock.map(item => (
                  <div key={item.id} className="bg-black/20 p-4 border border-white/10 rounded-xl flex justify-between items-center group hover:border-[#FF4F00] transition-colors">
                    <div>
                      <h4 className="font-bold text-sm">{item.nombre}</h4>
                      <p className="text-[10px] text-white/40 font-mono">COSTO: ${item.precio_costo}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/30 font-black animate-pulse">
                        {item.stock} PIEZAS
                      </Badge>
                    </div>
                  </div>
                ))}
                {data.criticalStock.length === 0 && (
                  <div className="col-span-full py-10 text-center opacity-30">
                    <PackageSearch className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">Sin alertas de suministro</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, isPositive }: any) {
  return (
    <Card className="bg-[#16191E] border-white/5 shadow-xl hover:translate-y-[-4px] transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded bg-white/5 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        </div>
        <CardDescription className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">{title}</CardDescription>
        <CardTitle className="text-3xl font-black text-white tracking-tighter">{value}</CardTitle>
      </CardContent>
    </Card>
  );
}

function PaymentMethodItem({ label, amount, icon, total }: any) {
  const percentage = (amount / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
          <span className="text-sm font-bold text-white/80">{label}</span>
        </div>
        <span className="text-sm font-mono font-bold">${amount.toLocaleString()}</span>
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#FF4F00] rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
