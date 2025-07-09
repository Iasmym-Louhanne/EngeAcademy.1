"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Branch } from "@/lib/permissions";
import { branches as initialBranches } from "@/contexts/auth-context";
import { useAuth } from "@/contexts/auth-context";
import { Building2, Edit, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ScrollableTable } from "@/components/ui/scrollable-table";

export default function BranchesPage() {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState<Partial<Branch>>({
    isActive: true
  });

  // Filtrar filiais com base na busca
  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para adicionar uma nova filial
  const handleAddBranch = () => {
    // Validação
    if (!newBranch.name || !newBranch.city || !newBranch.state || !newBranch.address) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const branch: Branch = {
      id: `branch-${Date.now()}`,
      name: newBranch.name,
      address: newBranch.address,
      city: newBranch.city,
      state: newBranch.state,
      phone: newBranch.phone,
      email: newBranch.email,
      manager: newBranch.manager,
      isActive: newBranch.isActive ?? true
    };

    setBranches([...branches, branch]);
    setNewBranch({ isActive: true });
    toast.success(`Filial ${branch.name} adicionada com sucesso!`);
  };

  // Função para atualizar uma filial
  const handleUpdateBranch = () => {
    if (!editingBranch) return;

    // Validação
    if (!editingBranch.name || !editingBranch.city || !editingBranch.state || !editingBranch.address) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const updatedBranches = branches.map(branch => 
      branch.id === editingBranch.id ? editingBranch : branch
    );

    setBranches(updatedBranches);
    setEditingBranch(null);
    toast.success(`Filial ${editingBranch.name} atualizada com sucesso!`);
  };

  // Função para remover uma filial
  const handleDeleteBranch = (branchId: string) => {
    if (confirm("Tem certeza que deseja remover esta filial? Esta ação não pode ser desfeita.")) {
      const updatedBranches = branches.filter(branch => branch.id !== branchId);
      setBranches(updatedBranches);
      toast.success("Filial removida com sucesso!");
    }
  };

  // Função para alternar o status ativo/inativo
  const toggleBranchStatus = (branchId: string) => {
    const updatedBranches = branches.map(branch => {
      if (branch.id === branchId) {
        return { ...branch, isActive: !branch.isActive };
      }
      return branch;
    });

    setBranches(updatedBranches);
    const branch = updatedBranches.find(b => b.id === branchId);
    toast.success(`Filial ${branch?.name} ${branch?.isActive ? 'ativada' : 'desativada'} com sucesso!`);
  };

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <Building2 className="mr-2 h-6 w-6 text-primary" />
            Gerenciamento de Filiais
          </h2>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Filial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Filial</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova filial abaixo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="required">Nome da Filial</Label>
                    <Input
                      id="name"
                      placeholder="EngeAcademy São Paulo"
                      value={newBranch.name || ""}
                      onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Gerente</Label>
                    <Input
                      id="manager"
                      placeholder="João Silva"
                      value={newBranch.manager || ""}
                      onChange={(e) => setNewBranch({ ...newBranch, manager: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="required">Endereço</Label>
                  <Input
                    id="address"
                    placeholder="Av. Paulista, 1000"
                    value={newBranch.address || ""}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="required">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={newBranch.city || ""}
                      onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="required">Estado</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      value={newBranch.state || ""}
                      onChange={(e) => setNewBranch({ ...newBranch, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 3333-4444"
                      value={newBranch.phone || ""}
                      onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sp@engeacademy.com"
                      value={newBranch.email || ""}
                      onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={newBranch.isActive}
                    onCheckedChange={(checked) => setNewBranch({ ...newBranch, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Filial ativa</Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddBranch}>Adicionar Filial</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Filiais da EngeAcademy</CardTitle>
                <CardDescription>
                  Gerencie todas as filiais da empresa e seus dados
                </CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar filiais..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollableTable maxHeight="60vh" stickyHeader>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Gerente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma filial encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.name}</TableCell>
                      <TableCell>
                        <div className="flex items-start flex-col">
                          <span>{branch.city}, {branch.state}</span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {branch.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {branch.email && <div className="text-sm">{branch.email}</div>}
                        {branch.phone && <div className="text-sm">{branch.phone}</div>}
                      </TableCell>
                      <TableCell>{branch.manager || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={branch.isActive}
                            onCheckedChange={() => toggleBranchStatus(branch.id)}
                          />
                          <span className="ml-2 text-sm">
                            {branch.isActive ? "Ativa" : "Inativa"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingBranch(branch)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Filial</DialogTitle>
                              <DialogDescription>
                                Atualize os dados da filial abaixo.
                              </DialogDescription>
                            </DialogHeader>
                            {editingBranch && (
                              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nome da Filial</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingBranch.name}
                                      onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-manager">Gerente</Label>
                                    <Input
                                      id="edit-manager"
                                      value={editingBranch.manager || ""}
                                      onChange={(e) => setEditingBranch({ ...editingBranch, manager: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-address">Endereço</Label>
                                  <Input
                                    id="edit-address"
                                    value={editingBranch.address}
                                    onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-city">Cidade</Label>
                                    <Input
                                      id="edit-city"
                                      value={editingBranch.city}
                                      onChange={(e) => setEditingBranch({ ...editingBranch, city: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-state">Estado</Label>
                                    <Input
                                      id="edit-state"
                                      value={editingBranch.state}
                                      onChange={(e) => setEditingBranch({ ...editingBranch, state: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-phone">Telefone</Label>
                                    <Input
                                      id="edit-phone"
                                      value={editingBranch.phone || ""}
                                      onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={editingBranch.email || ""}
                                      onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                  <Switch
                                    id="edit-isActive"
                                    checked={editingBranch.isActive}
                                    onCheckedChange={(checked) => setEditingBranch({ ...editingBranch, isActive: checked })}
                                  />
                                  <Label htmlFor="edit-isActive">Filial ativa</Label>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button onClick={handleUpdateBranch}>Salvar Alterações</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDeleteBranch(branch.id)}
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