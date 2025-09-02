import React, { useMemo, useState } from 'react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { useAppContext } from '../context/AppContext.tsx';
import { exportService } from '../services/exportService.ts';
import Icon from '../components/common/Icon.tsx';

// New vibrant and contrasting color palette
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', 
  '#F0B37E', '#8D8741', '#659DBD', '#DAAD86', '#BC986A',
  '#F4A261', '#E76F51', '#2A9D8F', '#264653', '#E9C46A'
];

const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm text-gray-700 dark:text-gray-300">
        {payload.map((entry: any, index: number) => (
            <li key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color }}>
                 <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-lg">{entry.payload.icon}</span>
                <span>{entry.value}</span>
            </li>
        ))}
        </ul>
    );
};

// Custom component for the active/exploded "3D" slice
const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

    // The <g> element applies the drop shadow filter to the Sector
    return (
        <g style={{ filter: 'url(#pie-shadow)' }}>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-base font-bold">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10} // "Explode" the slice
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                stroke="#fff"
                strokeWidth={2}
            />
        </g>
    );
};

// Utility to format currency for charts
const formatCurrency = (value: number) => 
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

const Reports: React.FC = () => {
    const { transactions, categories, theme } = useAppContext();
    const [timeframe, setTimeframe] = useState('all');
    const [customStartDate, setCustomStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [customEndDate, setCustomEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportType, setReportType] = useState<'expense' | 'income'>('expense');
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        let start = new Date(now);
        let end = new Date(now);

        switch (timeframe) {
            case 'all':
                return transactions;
            case 'day':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'week':
                start.setDate(now.getDate() - now.getDay());
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
             case 'last7':
                start.setDate(now.getDate() - 6);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'last30':
                start.setDate(now.getDate() - 29);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'custom':
                start = new Date(customStartDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(customEndDate);
                end.setHours(23, 59, 59, 999);
                break;
            default:
                return transactions;
        }

        return transactions.filter(t => {
            const tDate = new Date(t.date);
            const tDateWithoutTime = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
            return tDateWithoutTime >= start && tDateWithoutTime <= end;
        });
    }, [transactions, timeframe, customStartDate, customEndDate]);

    const comparisonData = useMemo(() => {
        const { totalIncome, totalExpense } = filteredTransactions.reduce(
            (acc, t) => {
                if (t.type === 'income') {
                    acc.totalIncome += t.amount;
                } else {
                    acc.totalExpense += t.amount;
                }
                return acc;
            },
            { totalIncome: 0, totalExpense: 0 }
        );
        
        return [{
            name: 'Ringkasan',
            Pemasukan: totalIncome,
            Pengeluaran: totalExpense,
        }];
    }, [filteredTransactions]);

    const expenseByCategory = useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const data = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(data).map(([name, value]) => ({ 
            name, 
            value,
            icon: categories.find(c => c.name === name)?.icon || '📁'
        })).sort((a, b) => b.value - a.value);
    }, [filteredTransactions, categories]);
    
    const incomeByCategory = useMemo(() => {
        const incomes = filteredTransactions.filter(t => t.type === 'income');
        const data = incomes.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(data).map(([name, value]) => ({
            name,
            value,
            icon: categories.find(c => c.name === name)?.icon || '💰'
        })).sort((a, b) => b.value - a.value);
    }, [filteredTransactions, categories]);

    const handleExport = () => {
        exportService.exportToCSV(filteredTransactions, `keena-report-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const dataForChart = reportType === 'expense' ? expenseByCategory : incomeByCategory;
    const totalForChart = useMemo(() => dataForChart.reduce((total, item) => total + item.value, 0), [dataForChart]);
    
    const onPieClick = (_: any, index: number) => setActiveIndex(activeIndex === index ? undefined : index);

    const PieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const value = payload[0].value;
            const percentage = totalForChart > 0 ? (value / totalForChart * 100) : 0;
            return (
                <div className="bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-dark-accent shadow-lg">
                    <p className="font-semibold flex items-center gap-2"><span className="text-xl">{data.icon}</span><span>{data.name}</span></p>
                    <p className="text-gray-800 dark:text-gray-100">{formatCurrency(data.value)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">({percentage.toFixed(2)}%)</p>
                </div>
            );
        }
        return null;
    };

    const ComparisonTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-dark-accent shadow-lg">
                    {payload.map((pld: any) => (
                        <p key={pld.dataKey} style={{ color: pld.fill }}>{`${pld.dataKey}: ${formatCurrency(pld.value)}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const PieWithAnyProps = Pie as any;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Laporan Keuangan</h1>

            <div className="p-4 bg-white dark:bg-dark-secondary rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="timeframe" className="text-sm font-medium whitespace-nowrap">Filter Waktu:</label>
                        <select id="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="form-input">
                            <option value="all">Semua</option>
                            <option value="day">Hari Ini</option>
                            <option value="week">Minggu Ini</option>
                            <option value="last7">7 Hari Terakhir</option>
                            <option value="month">Bulan Ini</option>
                            <option value="last30">30 Hari Terakhir</option>
                            <option value="custom">Rentang Kustom</option>
                        </select>
                    </div>
                     <button onClick={handleExport} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-neon-blue text-white text-sm font-semibold rounded-lg hover:bg-neon-blue-light transition-colors">
                        <Icon name="download" className="w-5 h-5" /> Export CSV
                    </button>
                </div>
                {timeframe === 'custom' && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                        <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="form-input w-full" />
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                        <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="form-input w-full" />
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-dark-secondary p-4 sm:p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-center mb-4">Perbandingan Pemasukan & Pengeluaran</h2>
                {filteredTransactions.length > 0 ? (
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                                <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#4b5563', fontSize: 14 }} />
                                <YAxis tickFormatter={formatCurrency} tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#4b5563', fontSize: 12 }} width={100} />
                                <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                                <Legend />
                                <Bar dataKey="Pemasukan" fill="#4ECDC4" name="Pemasukan" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                <Bar dataKey="Pengeluaran" fill="#FF6B6B" name="Pengeluaran" radius={[4, 4, 0, 0]} maxBarSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                     <p className="text-center text-gray-500 dark:text-gray-400 py-10">Tidak ada data untuk perbandingan.</p>
                )}
            </div>

            <div className="bg-white dark:bg-dark-secondary p-4 sm:p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-center mb-2">Diagram Kategori</h2>
                <div className="flex justify-center mb-4 gap-2">
                    <button onClick={() => setReportType('expense')} className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${reportType === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-dark-accent text-gray-800 dark:text-gray-100'}`}>
                        Pengeluaran
                    </button>
                    <button onClick={() => setReportType('income')} className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${reportType === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-dark-accent text-gray-800 dark:text-gray-100'}`}>
                        Pemasukan
                    </button>
                </div>

                {dataForChart.length > 0 ? (
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <defs>
                                    <filter id="pie-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#000000" floodOpacity="0.25" />
                                    </filter>
                                </defs>
                                <PieWithAnyProps
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={dataForChart}
                                    cx="50%" cy="50%"
                                    labelLine={false}
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value" nameKey="name"
                                    onClick={onPieClick} label={false}
                                >
                                    {dataForChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ cursor: 'pointer', outline: 'none' }} />
                                    ))}
                                </PieWithAnyProps>
                                <Tooltip content={<PieTooltip />} />
                                <Legend content={<CustomLegend />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">Tidak ada data {reportType === 'expense' ? 'pengeluaran' : 'pemasukan'} untuk ditampilkan.</p>
                )}
            </div>
            <style>{`
                .form-input { padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid; background-color: #f9fafb; color: #111827; border-color: #d1d5db; }
                .form-input:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #2563eb; }
                .dark .form-input { background-color: #334155; color: #f8fafc; border-color: #475569; }
             `}</style>
        </div>
    );
};

export default Reports;
