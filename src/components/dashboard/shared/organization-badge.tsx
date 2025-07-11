import { Badge } from "@/components/ui/badge";
import { Building2, GitBranch, Home } from "lucide-react";

type OrganizationType = 'empresa' | 'filial_empresa' | 'filial_engeacademy';

interface OrganizationBadgeProps {
  type: OrganizationType;
  name?: string;
}

export function OrganizationBadge({ type, name }: OrganizationBadgeProps) {
  // Configurações específicas para cada tipo
  const config = {
    empresa: {
      icon: <Building2 className="h-3.5 w-3.5 mr-1" />,
      label: name || 'Empresa',
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200'
    },
    filial_empresa: {
      icon: <GitBranch className="h-3.5 w-3.5 mr-1" />,
      label: name || 'Filial de Empresa',
      className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200'
    },
    filial_engeacademy: {
      icon: <Home className="h-3.5 w-3.5 mr-1" />,
      label: name || 'Filial EngeAcademy',
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200'
    }
  };

  const { icon, label, className } = config[type];

  return (
    <Badge variant="outline" className={className}>
      {icon}
      {label}
    </Badge>
  );
}