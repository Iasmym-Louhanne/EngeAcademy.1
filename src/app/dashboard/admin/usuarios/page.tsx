"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { InternalUser, getInternalUsers, updateInternalUser, deleteInternalUser } from "@/lib/user-service";
import { PermissionProfile, getInternalPermissionProfiles } from "@/lib/permission-service";
import { Branch } from "@/lib/permissions";
import { branches as allBranches } from "@/lib/mock-data";
import { Plus, Search, Edit, Trash2, ShieldCheck, GitBranch } from "lucide-react";
import { supabase } from "../../../../integrations/supabase/client";

export default function InternalUsersPage() {
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [permissionProfiles, setPermissionProfiles] = useState<PermissionProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [usersData, profilesData] = await Promise.all([
        getInternalUsers(),
        getInternalPermissionProfiles()
      ]);
      setUsers(usersData);
      setPermissionProfiles(profilesData);
    } catch (error) {
      toast.error("Falha ao carregar dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (user: InternalUser | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData: Partial<InternalUser>) => {
    try {
      if (editingUser) {
        // Lógica de atualização
        await updateInternalUser(editingUser.id, userData);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Lógica de criação direta
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(
          userData.email!,
          {
            data: {
              full_name: userData.full_name,
              profile_id: userData.profile_id,
            },
          }
        );

        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("Este email já está cadastrado no sistema.");
          } else {
            throw error;
          }
          return;
        }
        
        // Inserir na tabela de usuários internos
        await supabase.from('internal_users').insert({
          id: data.user.id,
          email: userData.email,
          full_name: userData.full_name,
          profile_id: userData.profile_id,
          accessible_branches: userData.accessible_branches || [],
          has_full_access: userData.has_full_access || false,
          is_active: true,
        });
        
        toast.success("Convite enviado com sucesso para o novo usuário!");
      }
      fetchData();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error);
      toast.error(`Falha ao salvar usuário: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteInternalUser(userId);
        fetchData();
        toast.success("Usuário excluído com sucesso!");
      } catch (error) {
        toast.error("Falha ao excluir usuário.");
      }
    }
  };

  const getProfileNameById = (profileId: string) => {
    return permissionProfiles.find(p => p.id === profileId)?.name || 'N/A';
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            {isLoading ? (
              <div className="text-center py-8">Carregando usuários...</div>
            ) : (
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
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>{getProfileNameById(user.profile_id)}</TableCell>
                      <TableCell>
                        {user.has_full_access ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Acesso Total
                          </Badge>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {user.accessible_branches.map(branchId => (
                              <Badge key={branchId} variant="secondary">
                                {allBranches.find(b => b.id === branchId)?.name || 'Desconhecida'}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "success" : "destructive"}>
                          {user.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ScrollableTable>
            )}
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
function UserFormModal({ user, onClose, onSave, profiles, branches }: { user: InternalUser | null, onClose: () => void, onSave: (user: Partial<InternalUser>) => void, profiles: PermissionProfile[], branches: Branch[] }) {
  const [formData, setFormData] = useState<Partial<InternalUser>>(
    user || { is_active: true, has_full_access: false, accessible_branches: [] }
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.full_name || !formData.email || !formData.profile_id) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!formData.has_full_access && (!formData.accessible_branches || formData.accessible_branches.length === 0)) {
      toast.error("Selecione ao menos uma filial ou conceda acesso total.");
      return;
    }
    
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  const handleBranchChange = (branchId: string, checked: boolean) => {
    const currentBranches = formData.accessible_branches || [];
    if (checked) {
      setFormData({ ...formData, accessible_branches: [...currentBranches, branchId] });
    } else {
      setFormData({ ...formData, accessible_branches: currentBranches.filter(id => id !== branchId) });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuário" : "Convidar Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {user 
              ? "Edite os dados do usuário interno."
              : "Preencha os dados para enviar um convite de acesso ao novo usuário."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" value={formData.full_name || ""} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!!user} />
              {user && <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile">Perfil de Permissão</Label>
            <Select value={formData.profile_id} onValueChange={value => setFormData({ ...formData, profile_id: value })}>
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
              value={formData.has_full_access ? "full" : "specific"}
              onValueChange={value => setFormData({ ...formData, has_full_access: value === "full" })}
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
            {!formData.has_full_access && (
              <div className="grid grid-cols-2 gap-2 pt-2 pl-6 max-h-32 overflow-y-auto">
                {branches.map(branch => (
                  <div key={branch.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`branch-${branch.id}`}
                      checked={formData.accessible_branches?.includes(branch.id)}
                      onCheckedChange={(checked) => handleBranchChange(branch.id, !!checked)}
                    />
                    <Label htmlFor={`branch-${branch.id}`} className="font-normal">{branch.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={formData.is_active} onCheckedChange={checked => setFormData({ ...formData, is_active: !!checked })} />
            <Label htmlFor="isActive">Usuário Ativo</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}