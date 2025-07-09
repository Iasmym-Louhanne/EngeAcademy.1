"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { Building2, Map, Landmark, MapPin } from "lucide-react";

export function BranchSelector() {
  const { availableBranches, selectBranch, user } = useAuth();
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    availableBranches.length === 1 ? availableBranches[0].id : ""
  );

  const handleBranchSelection = () => {
    if (!selectedBranchId) return;
    selectBranch(selectedBranchId);
  };

  if (!user || availableBranches.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-primary" />
            Selecione uma filial
          </CardTitle>
          <CardDescription>
            Escolha a filial que deseja acessar. Você poderá mudar essa seleção mais tarde.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedBranchId} 
            onValueChange={setSelectedBranchId}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {availableBranches.map((branch) => (
              <div 
                key={branch.id} 
                className={`flex items-start space-x-3 rounded-md border p-3 ${
                  selectedBranchId === branch.id ? 'border-primary bg-primary/5' : ''
                } hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer h-full`}
                onClick={() => setSelectedBranchId(branch.id)}
              >
                <RadioGroupItem value={branch.id} id={branch.id} className="mt-1" />
                <div className="flex-1 space-y-1">
                  <Label 
                    htmlFor={branch.id} 
                    className="text-base font-medium cursor-pointer flex items-center"
                  >
                    {branch.name}
                  </Label>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span className="line-clamp-1">{branch.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Landmark className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{branch.city}, {branch.state}</span>
                    </div>
                    {branch.manager && (
                      <div className="text-xs text-muted-foreground">
                        Gerente: {branch.manager}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleBranchSelection} 
            disabled={!selectedBranchId}
          >
            Acessar Filial
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}