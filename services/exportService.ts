
import { Transaction } from '../types.ts';

const convertToCSV = (transactions: Transaction[]): string => {
  const header = ['ID', 'Date', 'Title', 'Type', 'Amount', 'Category', 'Description'];
  const rows = transactions.map(t => 
    [
      t.id,
      t.date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      t.category,
      `"${t.description?.replace(/"/g, '""') || ''}"`
    ].join(',')
  );
  return [header.join(','), ...rows].join('\n');
};

const downloadCSV = (csvString: string, filename: string): void => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportService = {
  exportToCSV: (transactions: Transaction[], filename: string = 'transactions.csv'): void => {
    const csvString = convertToCSV(transactions);
    downloadCSV(csvString, filename);
  },
};