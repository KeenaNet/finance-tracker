import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppContext } from '../context/AppContext.tsx';
import { exportService } from '../services/exportService.ts';
import Icon from '../components/common/Icon.tsx';

// New vibrant and contrasting color palette
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', 
  '#F0B37E', '#8D8741', '#659DBD', '#DAAD86', '#BC986A',
  '#F4A261', '#E76F51', '#2A9D8F', '#264653', '#E9C46A'
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-dark-accent shadow-lg">
        <p className="font-semibold flex items-center gap-2">
          <span className="text-xl">{data.icon}</span>
          <span>{data.name}</span>
        </p>
        <p className="text-gray-800 dark:text-gray-100">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.value)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">({(payload[0].percent * 100).toFixed(2)}%)</p>
      </div>
    );
  }
  return null;
};

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


const Reports: React.FC = () => {
    const { transactions, categories } = useAppContext();
    const [timeframe, setTimeframe] = useState('all');
    const [customStartDate, setCustomStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [customEndDate, setCustomEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportType, setReportType] = useState<'expense' | 'income'>('expense');

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
            // Adjust for user's timezone when comparing dates only
            const tDateWithoutTime = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
            return tDateWithoutTime >= start && tDateWithoutTime <= end;
        });
    }, [transactions, timeframe, customStartDate, customEndDate]);

    const expenseByCategory = useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const data = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(data)
            .map(([name, value]) => {
                const category = categories.find(c => c.name === name);
                return { 
                    name, 
                    value,
                    icon: category?.icon || '📁' // fallback icon
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [filteredTransactions, categories]);
    
    const incomeByCategory = useMemo(() => {
        const incomes = filteredTransactions.filter(t => t.type === 'income');
        const data = incomes.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(data)
            .map(([name, value]) => {
                const category = categories.find(c => c.name === name);
                return { 
                    name, 
                    value,
                    icon: category?.icon || '💰' // fallback income icon
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [filteredTransactions, categories]);

    const handleExport = () => {
        exportService.exportToCSV(filteredTransactions, `keena-report-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const dataForChart = reportType === 'expense' ? expenseByCategory : incomeByCategory;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Laporan Keuangan</h1>

            <div className="p-4 bg-white dark:bg-dark-secondary rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="timeframe" className="text-sm font-medium whitespace-nowrap">Filter Waktu:</label>
                        <select
                            id="timeframe"
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="form-input"
                        >
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
                        <Icon name="download" className="w-5 h-5" />
                        Export CSV
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
                <h2 className="text-lg font-semibold text-center mb-2">Diagram Lingkaran 3D</h2>
                <div className="flex justify-center mb-4 gap-2">
                    <button 
                        onClick={() => setReportType('expense')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${reportType === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-dark-accent text-gray-800 dark:text-gray-100'}`}
                    >
                        Pengeluaran
                    </button>
                    <button 
                        onClick={() => setReportType('income')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${reportType === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-dark-accent text-gray-800 dark:text-gray-100'}`}
                    >
                        Pemasukan
                    </button>
                </div>

                {dataForChart.length > 0 ? (
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={dataForChart}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {dataForChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">Tidak ada data {reportType === 'expense' ? 'pengeluaran' : 'pemasukan'} untuk ditampilkan.</p>
                )}
            </div>
            <style>{`
                .form-input {
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    border: 1px solid;
                    background-color: #f9fafb;
                    color: #111827;
                    border-color: #d1d5db;
                }
                .form-input:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #2563eb;
                }
                .dark .form-input {
                    background-color: #334155;
                    color: #f8fafc;
                    border-color: #475569;
                }
             `}</style>
        </div>
    );
};

export default Reports;