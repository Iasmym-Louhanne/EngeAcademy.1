import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from "sonner";

// Definir tipos para os relatórios
export type ReportColumn = {
  field: string;
  header: string;
  width?: number;
};

export type ReportFilter = {
  field: string;
  value: any;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
};

export type ReportOptions = {
  title: string;
  description?: string;
  columns: ReportColumn[];
  filters?: ReportFilter[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  groupBy?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  pageSize?: number;
  pageNumber?: number;
};

// Função para exportar para CSV
export function exportToCSV(data: any[], options: ReportOptions, filename: string) {
  try {
    // Verificar se há dados para exportar
    if (!data || data.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }

    // Criar cabeçalhos do CSV
    const headers = options.columns.map(col => `"${col.header}"`).join(',');
    
    // Criar linhas do CSV
    const csvRows = data.map(row => {
      return options.columns.map(col => {
        const value = row[col.field];
        // Tratar valores com vírgulas ou aspas
        return `"${value !== undefined && value !== null ? value.toString().replace(/"/g, '""') : ''}"`;
      }).join(',');
    });
    
    // Combinar cabeçalhos e linhas
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Relatório CSV exportado com sucesso");
  } catch (error) {
    console.error("Erro ao exportar CSV:", error);
    toast.error("Erro ao exportar relatório CSV");
  }
}

// Função para exportar para PDF
export function exportToPDF(data: any[], options: ReportOptions, filename: string) {
  try {
    // Verificar se há dados para exportar
    if (!data || data.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }
    
    // Criar instância do PDF
    const doc = new jsPDF();
    
    // Adicionar título
    doc.setFontSize(18);
    doc.text(options.title, 14, 22);
    
    // Adicionar descrição se existir
    if (options.description) {
      doc.setFontSize(11);
      doc.text(options.description, 14, 30);
    }
    
    // Adicionar data de geração
    const now = new Date();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 14, 38);
    
    // Preparar dados para a tabela
    const tableColumn = options.columns.map(col => col.header);
    const tableRows = data.map(item => {
      return options.columns.map(col => {
        const value = item[col.field];
        return value !== undefined && value !== null ? value.toString() : '';
      });
    });
    
    // Adicionar tabela
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [78, 78, 78]
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    // Salvar o PDF
    doc.save(`${filename}.pdf`);
    
    toast.success("Relatório PDF exportado com sucesso");
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    toast.error("Erro ao exportar relatório PDF");
  }
}

// Função para aplicar filtros aos dados
export function applyFilters(data: any[], filters?: ReportFilter[]) {
  if (!filters || filters.length === 0) return data;
  
  return data.filter(item => {
    return filters.every(filter => {
      const value = item[filter.field];
      
      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'greaterThan':
          return value > filter.value;
        case 'lessThan':
          return value < filter.value;
        case 'between':
          return value >= filter.value[0] && value <= filter.value[1];
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        default:
          return true;
      }
    });
  });
}

// Função para ordenar dados
export function sortData(data: any[], sortBy?: string, sortDirection: 'asc' | 'desc' = 'asc') {
  if (!sortBy) return data;
  
  return [...data].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

// Função para agrupar dados
export function groupData(data: any[], groupBy?: string) {
  if (!groupBy) return { ungrouped: data };
  
  return data.reduce((groups, item) => {
    const key = item[groupBy] || 'Não definido';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}