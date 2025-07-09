"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  ReportColumn, 
  ReportOptions, 
  applyFilters, 
  sortData, 
  exportToCSV, 
  exportToPDF 
} from "@/lib/report-generator";
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileText, 
  Filter, 
  RefreshCw, 
  Save, 
  Search,
  FilePdf,
  FileSpreadsheet
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { PermissionGuard } from "@/lib/permissions";
import { toast } from "sonner";

interface ReportGeneratorProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: ReportColumn[];
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onFilter?: (filteredData: T[]) => void;
  className?: string;
}

export function ReportGenerator<T>({
  title,
  description,
  data,
  columns,
  defaultSortField,
  defaultSortDirection = 'asc',
  onFilter,
  className
}: ReportGeneratorProps<T>) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map(col => col.field)
  );
  const [sortField, setSortField] = useState(defaultSortField || columns[0]?.field);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [reportName, setReportName] = useState(title);
  
  // Filtrar os dados
  const filteredData = data.filter(item => {
    // Pesquisa global
    if (searchTerm) {
      return Object.values(item).some(
        value => 
          value !== null && 
          value !== undefined && 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });
  
  // Ordenar os dados
  const sortedData = sortData(filteredData, sortField, sortDirection);
  
  // Colunas visíveis
  const visibleColumns = columns.filter(col => 
    selectedColumns.includes(col.field)
  );
  
  // Alternar direção de ordenação
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Gerar as opções do relatório
  const getReportOptions = (): ReportOptions => {
    return {
      title: reportName,
      description,
      columns: visibleColumns,
      sortBy: sortField,
      sortDirection: sortDirection,
      dateRange: startDate && endDate ? { startDate, endDate } : undefined
    };
  };
  
  // Exportar para CSV
  const handleExportCSV = () => {
    const options = getReportOptions();
    exportToCSV(sortedData, options, reportName.replace(/\s+/g, '_').toLowerCase());
  };
  
  // Exportar para PDF
  const handleExportPDF = () => {
    const options = getReportOptions();
    exportToPDF(sortedData, options, reportName.replace(/\s+/g, '_').toLowerCase());
  };
  
  // Resetar filtros
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedColumns(columns.map(col => col.field));
    setSortField(defaultSortField || columns[0]?.field);
    setSortDirection('asc');
    setStartDate(undefined);
    setEndDate(undefined);
    toast.success("Filtros redefinidos");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
            
            <PermissionGuard 
              role={user?.role || 'aluno'} 
              permission="export:reports"
            >
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportCSV}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportPDF}
                >
                  <FilePdf className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </PermissionGuard>
          </div>
        </div>
      </CardHeader>
      
      {showFilters && (
        <CardContent className="border-t border-b">
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar em todos os campos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="reportName">Nome do Relatório</Label>
                <Input
                  id="reportName"
                  placeholder="Nome para exportação"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="sortField">Ordenar por</Label>
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger id="sortField">
                    <SelectValue placeholder="Selecione um campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column.field} value={column.field}>
                        {column.header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Período de Datas</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="startDate" className="text-xs">Início</Label>
                    <DatePicker
                      id="startDate"
                      selected={startDate}
                      onSelect={setStartDate}
                      placeholder="Selecione a data inicial"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endDate" className="text-xs">Fim</Label>
                    <DatePicker
                      id="endDate"
                      selected={endDate}
                      onSelect={setEndDate}
                      placeholder="Selecione a data final"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Colunas Visíveis</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {columns.map((column) => (
                    <div key={column.field} className="flex items-center space-x-2">
                      <Checkbox
                        id={`column-${column.field}`}
                        checked={selectedColumns.includes(column.field)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColumns([...selectedColumns, column.field]);
                          } else {
                            setSelectedColumns(selectedColumns.filter(col => col !== column.field));
                          }
                        }}
                      />
                      <label
                        htmlFor={`column-${column.field}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {column.header}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Redefinir Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardContent className="p-0">
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.field}
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                    >
                      <button
                        className="flex items-center gap-1"
                        onClick={() => toggleSort(column.field)}
                      >
                        {column.header}
                        {sortField === column.field && (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Nenhum resultado encontrado.
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t transition-colors hover:bg-muted/50"
                    >
                      {visibleColumns.map((column) => (
                        <td
                          key={column.field}
                          className="px-4 py-3 text-sm"
                        >
                          {(item as any)[column.field]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {sortedData.length} de {data.length} registros
        </div>
      </CardFooter>
    </Card>
  );
}