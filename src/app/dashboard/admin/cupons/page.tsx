"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { Coupon, CouponType, DiscountType } from "@/types/coupon";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/coupon-service";
import { companies, courses } from "@/lib/mock-data";
import { Ticket, Plus, Search, Edit, Trash2, Tag, Building2, Percent, DollarSign, Calendar } from "lucide-react";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "individual" | "company">("all");
  
  // Estado para novo cupom
  const [newCoupon, setNewCoupon] = useState<{
    code: string;
    type: CouponType;
    discountType: DiscountType;
    discountValue: number;
    companyId?: string;
    maxUses: number;
    validFrom: Date;
    validUntil: Date;
    minPurchase?: number;
    applicableCourses?: string[];
    isActive: boolean;
  }>({
    code: "",
    type: "individual",
    discountType: "percentage",
    discountValue: 10,
    maxUses: 100,
    validFrom: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    isActive: true
  });
  
  // Carregar cupons
  useEffect(() => {
    const loadCoupons = () => {
      const allCoupons = getAllCoupons();
      setCoupons(allCoupons);
    };
    
    loadCoupons();
  }, []);
  
  // Filtrar cupons
  const filteredCoupons = coupons.filter(coupon => {
    // Filtrar por texto de busca
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.companyId && companies.find(c => c.id === coupon.companyId)?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtrar por tipo
    const matchesType = 
      activeTab === "all" || 
      (activeTab === "individual" && coupon.type === "individual") ||
      (activeTab === "company" && coupon.type === "company");
      
    return matchesSearch && matchesType;
  });
  
  // Manipular a criação de um novo cupom
  const handleCreateCoupon = () => {
    try {
      // Validação básica
      if (!newCoupon.code.trim()) {
        toast.error("O código do cupom é obrigatório.");
        return;
      }
      
      if (newCoupon.discountValue <= 0) {
        toast.error("O valor do desconto deve ser maior que zero.");
        return;
      }
      
      if (newCoupon.type === "company" && !newCoupon.companyId) {
        toast.error("Selecione uma empresa para o cupom corporativo.");
        return;
      }
      
      // Criar o cupom
      const createdCoupon = createCoupon(newCoupon);
      
      // Atualizar a lista
      setCoupons(prev => [createdCoupon, ...prev]);
      
      // Limpar o formulário
      setNewCoupon({
        code: "",
        type: "individual",
        discountType: "percentage",
        discountValue: 10,
        maxUses: 100,
        validFrom: new Date(),
        validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        isActive: true
      });
      
      toast.success(`Cupom ${createdCoupon.code} criado com sucesso!`);
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      toast.error("Erro ao criar o cupom. Tente novamente.");
    }
  };
  
  // Manipular a atualização de um cupom
  const handleUpdateCoupon = () => {
    if (!editingCoupon) return;
    
    try {
      // Validação básica
      if (!editingCoupon.code.trim()) {
        toast.error("O código do cupom é obrigatório.");
        return;
      }
      
      if (editingCoupon.discountValue <= 0) {
        toast.error("O valor do desconto deve ser maior que zero.");
        return;
      }
      
      if (editingCoupon.type === "company" && !editingCoupon.companyId) {
        toast.error("Selecione uma empresa para o cupom corporativo.");
        return;
      }
      
      // Atualizar o cupom
      const updatedCoupon = updateCoupon(editingCoupon.id, editingCoupon);
      
      if (!updatedCoupon) {
        toast.error("Cupom não encontrado.");
        return;
      }
      
      // Atualizar a lista
      setCoupons(prev => prev.map(coupon => 
        coupon.id === updatedCoupon.id ? updatedCoupon : coupon
      ));
      
      setEditingCoupon(null);
      toast.success(`Cupom ${updatedCoupon.code} atualizado com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar cupom:", error);
      toast.error("Erro ao atualizar o cupom. Tente novamente.");
    }
  };
  
  // Manipular a exclusão de um cupom
  const handleDeleteCoupon = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita.")) {
      try {
        const success = deleteCoupon(id);
        
        if (success) {
          // Atualizar a lista
          setCoupons(prev => prev.filter(coupon => coupon.id !== id));
          toast.success("Cupom excluído com sucesso!");
        } else {
          toast.error("Cupom não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao excluir cupom:", error);
        toast.error("Erro ao excluir o cupom. Tente novamente.");
      }
    }
  };
  
  // Formatar data para exibição
  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };
  
  // Obter nome da empresa por ID
  const getCompanyName = (companyId?: string) => {
    if (!companyId) return "-";
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : "-";
  };
  
  // Verificar se o cupom está ativo (não expirado e com usos disponíveis)
  const isCouponActive = (coupon: Coupon) => {
    const now = new Date();
    return (
      coupon.isActive &&
      coupon.usedCount < coupon.maxUses &&
      now >= new Date(coupon.validFrom) &&
      now <= new Date(coupon.validUntil)
    );
  };

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Ticket className="mr-2 h-6 w-6 text-primary" />
            Gerenciamento de Cupons
          </h2>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cupom
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Cupom</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do novo cupom promocional.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="required">Código do Cupom</Label>
                    <Input
                      id="code"
                      placeholder="PROMO2023"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use letras maiúsculas e números, sem espaços
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de Cupom</Label>
                    <RadioGroup 
                      value={newCoupon.type} 
                      onValueChange={(value: CouponType) => setNewCoupon({ ...newCoupon, type: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual" className="cursor-pointer">
                          Individual
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company" className="cursor-pointer">
                          Empresarial
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                {newCoupon.type === "company" && (
                  <div className="space-y-2">
                    <Label htmlFor="companyId" className="required">Empresa</Label>
                    <Select
                      value={newCoupon.companyId}
                      onValueChange={(value) => setNewCoupon({ ...newCoupon, companyId: value })}
                    >
                      <SelectTrigger id="companyId">
                        <SelectValue placeholder="Selecione uma empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Desconto</Label>
                    <RadioGroup 
                      value={newCoupon.discountType} 
                      onValueChange={(value: DiscountType) => setNewCoupon({ ...newCoupon, discountType: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <Label htmlFor="percentage" className="cursor-pointer">
                          Porcentagem (%)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed" className="cursor-pointer">
                          Valor Fixo (R$)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discountValue" className="required">
                      {newCoupon.discountType === "percentage" ? "Porcentagem de Desconto (%)" : "Valor de Desconto (R$)"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min={0}
                      max={newCoupon.discountType === "percentage" ? 100 : undefined}
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom" className="required">Data de Início</Label>
                    <DatePicker
                      id="validFrom"
                      selected={newCoupon.validFrom}
                      onSelect={(date) => date && setNewCoupon({ ...newCoupon, validFrom: date })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="validUntil" className="required">Data de Término</Label>
                    <DatePicker
                      id="validUntil"
                      selected={newCoupon.validUntil}
                      onSelect={(date) => date && setNewCoupon({ ...newCoupon, validUntil: date })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUses" className="required">Limite de Utilizações</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      min={1}
                      value={newCoupon.maxUses}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Valor Mínimo de Compra (R$)</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      min={0}
                      value={newCoupon.minPurchase || ""}
                      onChange={(e) => setNewCoupon({ 
                        ...newCoupon, 
                        minPurchase: e.target.value ? parseFloat(e.target.value) : undefined 
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="applicableCourses">Cursos Aplicáveis</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os cursos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os cursos</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Deixe em branco para aplicar a todos os cursos
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={newCoupon.isActive}
                    onCheckedChange={(checked) => setNewCoupon({ ...newCoupon, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Cupom ativo</Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCoupon}>Criar Cupom</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Cupons Promocionais</CardTitle>
                <CardDescription>
                  Gerencie os cupons de desconto para seus clientes e empresas
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cupons..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Tabs value={activeTab} onValueChange={(value: "all" | "individual" | "company") => setActiveTab(value)}>
                  <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="individual">Individuais</TabsTrigger>
                    <TabsTrigger value="company">Empresariais</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollableTable maxHeight="60vh" stickyHeader>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Uso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum cupom encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-primary" />
                          {coupon.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          coupon.type === "company" 
                            ? "bg-blue-100 text-blue-800 border-blue-200" 
                            : "bg-purple-100 text-purple-800 border-purple-200"
                        }>
                          {coupon.type === "company" ? (
                            <Building2 className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {coupon.type === "company" ? "Empresarial" : "Individual"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {coupon.discountType === "percentage" ? (
                            <Percent className="h-3.5 w-3.5 mr-1 text-green-600" />
                          ) : (
                            <DollarSign className="h-3.5 w-3.5 mr-1 text-green-600" />
                          )}
                          {coupon.discountType === "percentage" 
                            ? `${coupon.discountValue}%` 
                            : `R$ ${coupon.discountValue.toFixed(2)}`
                          }
                        </div>
                        {coupon.minPurchase && (
                          <div className="text-xs text-muted-foreground">
                            Mín: R$ {coupon.minPurchase.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {coupon.type === "company" ? getCompanyName(coupon.companyId) : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {coupon.usedCount} / {coupon.maxUses}
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isCouponActive(coupon) ? "success" : "destructive"}>
                          {isCouponActive(coupon) ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingCoupon({ ...coupon })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {editingCoupon && (
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Editar Cupom</DialogTitle>
                                <DialogDescription>
                                  Altere os detalhes do cupom promocional.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-code" className="required">Código do Cupom</Label>
                                    <Input
                                      id="edit-code"
                                      value={editingCoupon.code}
                                      onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label>Tipo de Cupom</Label>
                                    <RadioGroup 
                                      value={editingCoupon.type} 
                                      onValueChange={(value: CouponType) => setEditingCoupon({ ...editingCoupon, type: value })}
                                      className="flex gap-4"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="individual" id="edit-individual" />
                                        <Label htmlFor="edit-individual" className="cursor-pointer">
                                          Individual
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="company" id="edit-company" />
                                        <Label htmlFor="edit-company" className="cursor-pointer">
                                          Empresarial
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                </div>
                                
                                {editingCoupon.type === "company" && (
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-companyId" className="required">Empresa</Label>
                                    <Select
                                      value={editingCoupon.companyId}
                                      onValueChange={(value) => setEditingCoupon({ ...editingCoupon, companyId: value })}
                                    >
                                      <SelectTrigger id="edit-companyId">
                                        <SelectValue placeholder="Selecione uma empresa" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {companies.map((company) => (
                                          <SelectItem key={company.id} value={company.id}>
                                            {company.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Tipo de Desconto</Label>
                                    <RadioGroup 
                                      value={editingCoupon.discountType} 
                                      onValueChange={(value: DiscountType) => setEditingCoupon({ ...editingCoupon, discountType: value })}
                                      className="flex gap-4"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="percentage" id="edit-percentage" />
                                        <Label htmlFor="edit-percentage" className="cursor-pointer">
                                          Porcentagem (%)
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="fixed" id="edit-fixed" />
                                        <Label htmlFor="edit-fixed" className="cursor-pointer">
                                          Valor Fixo (R$)
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-discountValue" className="required">
                                      {editingCoupon.discountType === "percentage" ? "Porcentagem de Desconto (%)" : "Valor de Desconto (R$)"}
                                    </Label>
                                    <Input
                                      id="edit-discountValue"
                                      type="number"
                                      min={0}
                                      max={editingCoupon.discountType === "percentage" ? 100 : undefined}
                                      value={editingCoupon.discountValue}
                                      onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: parseFloat(e.target.value) || 0 })}
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-validFrom" className="required">Data de Início</Label>
                                    <DatePicker
                                      id="edit-validFrom"
                                      selected={new Date(editingCoupon.validFrom)}
                                      onSelect={(date) => date && setEditingCoupon({ ...editingCoupon, validFrom: date })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-validUntil" className="required">Data de Término</Label>
                                    <DatePicker
                                      id="edit-validUntil"
                                      selected={new Date(editingCoupon.validUntil)}
                                      onSelect={(date) => date && setEditingCoupon({ ...editingCoupon, validUntil: date })}
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-maxUses" className="required">Limite de Utilizações</Label>
                                    <Input
                                      id="edit-maxUses"
                                      type="number"
                                      min={editingCoupon.usedCount}
                                      value={editingCoupon.maxUses}
                                      onChange={(e) => setEditingCoupon({ ...editingCoupon, maxUses: parseInt(e.target.value) || editingCoupon.usedCount })}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Já utilizados: {editingCoupon.usedCount}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-minPurchase">Valor Mínimo de Compra (R$)</Label>
                                    <Input
                                      id="edit-minPurchase"
                                      type="number"
                                      min={0}
                                      value={editingCoupon.minPurchase || ""}
                                      onChange={(e) => setEditingCoupon({ 
                                        ...editingCoupon, 
                                        minPurchase: e.target.value ? parseFloat(e.target.value) : undefined 
                                      })}
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 pt-2">
                                  <Switch
                                    id="edit-isActive"
                                    checked={editingCoupon.isActive}
                                    onCheckedChange={(checked) => setEditingCoupon({ ...editingCoupon, isActive: checked })}
                                  />
                                  <Label htmlFor="edit-isActive">Cupom ativo</Label>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleUpdateCoupon}>Salvar Alterações</Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </ScrollableTable>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Componente de ícone de usuário individual
function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}