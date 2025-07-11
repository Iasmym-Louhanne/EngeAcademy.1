"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { User, branches as allBranches, testUsers } from "@/contexts/auth-context";
import { getInternalPermissionProfiles, getProfileById } from "@/lib/permission-service";
import { Plus, Search, Edit, Trash2, ShieldCheck, GitBranch } from "lucide-react";

export default function InternalUsersPage() {
  const [users, setUsers] = useState<User[]>(testUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const permissionProfiles = getInternalPermissionProfiles();

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === userData.id ? userData : u));
      toast.success("Usuário atualizado com sucesso!");
    } else {
      const newUser = { ...userData, id: `user-${Date.now()}` };
      setUsers([...users, newUser]);
      toast.success("Usuário adicionado com sucesso!");
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Usuários Internos</h2>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>Gerencie a equipe interna da EngeAcademy.</CardDescription>
              </div>
              <div className="w-72">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                  icon={<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollableTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Perfil de Permissão</TableHead>
                  <TableHead>Acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>{getProfileById(user.profileId)?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {user.hasFullAccess ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          Acesso Total
                        </Badge>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.accessibleBranches.map(branchId => (
                            <Badge key={branchId} variant="secondary">
                              {allBranches.find(b => b.id === branchId)?.name || 'Desconhecida'}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "success" : "destructive"}>
                        {user.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ScrollableTable>
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          profiles={permissionProfiles}
          branches={allBranches}
        />
      )}
    </DashboardLayout>
  );
}

// Componente do Modal de Formulário de Usuário
function UserFormModal({ user, onClose, onSave, profiles, branches }: { user: User | null, onClose: () => void, onSave: (user: User) => void, profiles: any[], branches: any[] }) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || { isActive: true, hasFullAccess: false, accessibleBranches: [] }
  );

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.profileId) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!formData.hasFullAccess && formData.accessibleBranches?.length === 0) {
      toast.error("Selecione ao menos uma filial ou conceda acesso total.");
      return;
    }
    onSave(formData as User);
  };

  const handleBranchChange = (branchId: string, checked: boolean) => {
    const currentBranches = formData.accessibleBranches || [];
    if (checked) {
      setFormData({ ...formData, accessibleBranches: [...currentBranches, branchId] });
    } else {
      setFormData({ ...formData, accessibleBranches: currentBranches.filter(id => id !== branchId) });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
          <DialogDescription>
            Preencha os dados do usuário interno.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile">Perfil de Permissão</Label>
            <Select value={formData.profileId} onValueChange={value => setFormData({ ...formData, profileId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map(profile => (
                  <SelectItem key={profile.id} value={profile.id}>{profile.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3 rounded-md border p-4">
            <Label>Acesso às Filiais</Label>
            <RadioGroup
              value={formData.hasFullAccess ? "full" : "specific"}
              onValueChange={value => setFormData({ ...formData, hasFullAccess: value === "full" })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="font-normal flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Acesso Total (Modo Administrador)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific" />
                <Label htmlFor="specific" className="font-normal flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" /> Acesso a Filiais Específicas
                </Label>
              </div>
            </RadioGroup>
            {!formData.hasFullAccess && (
              <div className="grid grid-cols-2 gap-2 pt-2 pl-6 max-h-32 overflow-y-auto">
                {branches.map(branch => (
                  <div key={branch.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`branch-${branch.id}`}
                      checked={formData.accessibleBranches?.includes(branch.id)}
                      onCheckedChange={(checked) => handleBranchChange(branch.id, !!checked)}
                    />
                    <Label htmlFor={`branch-${branch.id}`} className="font-normal">{branch.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={formData.isActive} onCheckedChange={checked => setFormData({ ...formData, isActive: checked })} />
            <Label htmlFor="isActive">Usuário Ativo</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}