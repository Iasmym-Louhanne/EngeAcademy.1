"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Building2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BranchSwitcher() {
  const { user, availableBranches, selectBranch, branches } = useAuth();
  const [open, setOpen] = useState(false);

  // Verifica se o usuário tem acesso a todas as filiais
  const hasAllBranchesAccess = user?.accessibleBranches?.length === branches.length;

  // Se o usuário não existe, não tem filial atual e não está no modo admin, ou só tem uma filial disponível, não mostra o seletor
  if (!user || (!user.currentBranch && !user.isAdminMode) || availableBranches.length <= 1) {
    return null;
  }

  const handleBranchSelect = (branchId: string) => {
    if (branchId === "admin-mode") {
      selectBranch("admin-mode");
      toast.success("Modo Administrador ativado. Você tem acesso a todas as filiais.");
    } else {
      selectBranch(branchId);
      toast.success(`Filial ${branches.find(b => b.id === branchId)?.name} selecionada.`);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex-1 justify-between max-w-xs"
        >
          <div className="flex items-center gap-2 truncate">
            {user.isAdminMode ? (
              <>
                <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                <span className="truncate">Modo Administrador</span>
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{user.currentBranch?.name}</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar filial..." />
          <CommandEmpty>Nenhuma filial encontrada.</CommandEmpty>
          <CommandGroup heading="Filiais">
            <CommandList>
              {availableBranches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  onSelect={() => handleBranchSelect(branch.id)}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      user.currentBranch?.id === branch.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-transparent"
                    )}
                  >
                    {user.currentBranch?.id === branch.id && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span>{branch.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {branch.city}, {branch.state}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
          
          {/* Mostrar a opção de modo admin apenas se o usuário tiver acesso a todas as filiais */}
          {hasAllBranchesAccess && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Opções Avançadas">
                <CommandItem
                  onSelect={() => handleBranchSelect("admin-mode")}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      user.isAdminMode
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-muted bg-transparent"
                    )}
                  >
                    {user.isAdminMode && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Modo Administrador</span>
                  </div>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}