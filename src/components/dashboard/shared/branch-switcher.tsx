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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function BranchSwitcher() {
  const { user, availableBranches, selectBranch } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user || !user.currentBranch || availableBranches.length <= 1) {
    return null;
  }

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
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{user.currentBranch.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar filial..." />
          <CommandEmpty>Nenhuma filial encontrada.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {availableBranches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  onSelect={() => {
                    selectBranch(branch.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      user.currentBranch.id === branch.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-transparent"
                    )}
                  >
                    {user.currentBranch.id === branch.id && (
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
        </Command>
      </PopoverContent>
    </Popover>
  );
}