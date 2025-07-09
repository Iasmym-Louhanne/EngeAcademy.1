import { useAuth } from "@/contexts/auth-context";
import { OrganizationBadge } from "./organization-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { BranchSwitcher } from "./branch-switcher";

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const { user, logout } = useAuth();

  const getInitials = () => {
    if (!user?.name) return "?";
    return user.name
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
        
        {user?.organizationType && (
          <div className="mt-2">
            <OrganizationBadge
              type={user.organizationType}
              name={user.organizationName}
            />
          </div>
        )}
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
            <AvatarImage src="/images/avatar.png" alt={user?.name || "Avatar"} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}