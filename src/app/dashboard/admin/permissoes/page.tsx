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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { Permission, PermissionProfile } from "@/lib/permissions";
import { 
  getInternalPermissionProfiles, 
  createPermissionProfile, 
  updatePermissionProfile, 
  deletePermissionProfile 
} from "@/lib/permission-service";
import { Plus, Search, Edit, Trash2, Shield, Users, BookOpen, Building2, BarChart3, FileText, Ticket } from "lucide-react";

// Estrutura para organizar as permissões na UI
const permissionCategories: { title: string; icon: React.ReactNode; permissions: { id: Permission; label: string }[] }[] = [
  {
    title: "Usuários",
    icon: <Users className="h-4 w-4" />,
    permissions: [
      { id: "manage:users", label: "Gerenciar Usuários" },
      { id: "view:users", label: "Visualizar Usuários" },
    ],
  },
  {
    title: "Permissões",
    icon: <Shield className="h-4 w-4" />,
    permissions: [
      { id: "manage:permissions", label: "Gerenciar Perfis" },
      { id: "view:permissions", label: "Visualizar Perfis" },
    ],
  },
  {
    title: "Clientes",
    icon: <Users className="h-4 w-4" />,
    permissions: [
      { id: "manage:clients", label: "Gerenciar Clientes" },
      { id: "view:clients", label: "Visualizar Clientes" },
    ],
  },
  {
    title: "Cursos",
    icon: <BookOpen className="h-4 w-4" />,
    permissions: [
      { id: "manage:courses", label: "Gerenciar Cursos" },
      { id: "view:courses", label: "Visualizar Cursos" },
    ],
  },
  {
    title: "Filiais",
    icon: <Building2 className="h-4 w-4" />,
    permissions: [
      { id: "manage:branches", label: "Gerenciar Filiais" },
      { id: "view:branches", label: "Visualizar Filiais" },
    ],
  },
  {
    title: "Financeiro",
    icon: <BarChart3 className="h-4 w-4" />,
    permissions: [
      { id: "manage:financials", label: "Gerenciar Financeiro" },
      { id: "view:financials", label: "Visualizar Financeiro" },
    ],
  },
  {
    title: "Relatórios",
    icon: <FileText className="h-4 w-4" />,
    permissions: [
      { id: "export:reports", label: "Exportar Relatórios" },
      { id: "view:reports", label: "Visualizar Relatórios" },
    ],
  },
  {
    title: "Certificados",
    icon: <FileText className="h-4 w-4" />,
    permissions: [
      { id: "issue:certificates", label: "Emitir Certificados" },
      { id: "view:certificates", label: "Visualizar Certificados" },
    ],
  },
  {
    title: "Cupons",
    icon: <Ticket className="h-4 w-4" />,
    permissions: [
      { id: "manage:coupons", label: "Gerenciar Cupons" },
      { id: "view:coupons", label: "Visualizar Cupons" },
    ],
  },
];

export default function PermissionProfilesPage() {
  const [profiles, setProfiles] = useState<PermissionProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<PermissionProfile | null>(null);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const data = await getInternalPermissionProfiles();
      setProfiles(data);
    } catch (error) {
      toast.error("Falha ao carregar perfis de permissão.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleOpenModal = (profile: PermissionProfile | null = null) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (profileData: Omit<PermissionProfile, 'id' | 'created_at'> | PermissionProfile) => {
    try {
      if ('id' in profileData) {
        await updatePermissionProfile(profileData.id, profileData);
        toast.success("Perfil atualizado com sucesso!");
      } else {
        await createPermissionProfile(profileData);
        toast.success("Perfil criado com sucesso!");
      }
      fetchProfiles(); // Recarregar perfis
      setIsModalOpen(false);
      setEditingProfile(null);
    } catch (error) {
      toast.error("Falha ao salvar o perfil.");
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (confirm("Tem certeza que deseja excluir este perfil? Usuários associados a ele perderão suas permissões.")) {
      try {
        await deletePermissionProfile(profileId);
        fetchProfiles(); // Recarregar perfis
        toast.success("Perfil excluído com sucesso!");
      } catch (error) {
        toast.error("Falha ao excluir o perfil.");
      }
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            Perfis de Permissão
          </h2>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Perfil
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Lista de Perfis</CardTitle>
                <CardDescription>Gerencie os níveis de acesso dos usuários internos.</CardDescription>
              </div>
              <div className="w-72">
                <Input
                  placeholder="Buscar por nome do perfil..."
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
              <div className="text-center py-8">Carregando perfis...</div>
            ) : (
              <ScrollableTable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Perfil</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map(profile => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{profile.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{profile.permissions.length} permissões</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(profile)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProfile(profile.id)}
                        >
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
        <PermissionProfileFormModal
          profile={editingProfile}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </DashboardLayout>
  );
}

// Componente do Modal de Formulário de Perfil de Permissão
function PermissionProfileFormModal({
  profile,
  onClose,
  onSave,
}: {
  profile: PermissionProfile | null;
  onClose: () => void;
  onSave: (data: Omit<PermissionProfile, 'id' | 'created_at'> | PermissionProfile) => void;
}) {
  const [formData, setFormData] = useState<Omit<PermissionProfile, 'id' | 'created_at'> | PermissionProfile>(
    profile || { name: "", description: "", permissions: [] }
  );

  const handlePermissionChange = (permissionId: Permission, checked: boolean) => {
    const currentPermissions = formData.permissions;
    if (checked) {
      setFormData({ ...formData, permissions: [...currentPermissions, permissionId] });
    } else {
      setFormData({ ...formData, permissions: currentPermissions.filter(p => p !== permissionId) });
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("O nome do perfil é obrigatório.");
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{profile ? "Editar Perfil" : "Novo Perfil de Permissão"}</DialogTitle>
          <DialogDescription>
            Defina o nome, a descrição e as permissões associadas a este perfil.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Perfil</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <Label className="text-base font-medium">Permissões</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {permissionCategories.map(category => (
                <div key={category.title} className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </h4>
                  <div className="space-y-2 pl-2">
                    {category.permissions.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                        />
                        <Label htmlFor={permission.id} className="font-normal cursor-pointer">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Perfil</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}