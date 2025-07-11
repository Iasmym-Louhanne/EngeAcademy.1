import { useAuth } from "@/contexts/auth-context";
import { OrganizationBadge } from "./organization-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { BranchSwitcher } from "./branch-switcher";
import { getProfileById } from "@/lib/permission-service";

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const { user, profile, logout } = useAuth();

  const getInitials = () => {
    if (!profile?.full_name) return "?";
    return profile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
        
        <div className="mt-2 flex flex-wrap gap-2 items-center">
          {user?.organizationType && (
            <OrganizationBadge
              type={user.organizationType}
              name={user.organizationName}
            />
          )}
          
          {/* Badge para modo admin */}
          {user?.isAdminMode && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 flex items-center">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              Modo Administrador
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Seletor de Filial - apenas para admin e supervisor */}
        {(user?.role === 'admin' || user?.role === 'supervisor') && 
          user?.accessibleBranches && 
          user.accessibleBranches.length > 0 && (
          <BranchSwitcher />
        )}
        
        <ModeToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || "Avatar"} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="hidden md:block">
            <p className="text-sm font-medium">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground">{getProfileById(user?.profileId || '')?.name || user?.profileId}</p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}