"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { vouchers } from "@/lib/mock-data";
import { Ticket, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function VouchersPage() {
  const [voucherCode, setVoucherCode] = useState("");

  const handleVoucherSubmit = () => {
    if (!voucherCode.trim()) {
      toast.error("Por favor, insira um código de voucher.");
      return;
    }
    
    const voucher = vouchers.find(v => v.code === voucherCode);
    
    if (!voucher) {
      toast.error("Voucher inválido. Verifique o código e tente novamente.");
      return;
    }
    
    if (voucher.used) {
      toast.error("Este voucher já foi utilizado.");
      return;
    }
    
    // Simulação de resgate bem-sucedido
    toast.success(`Voucher resgatado com sucesso! Desconto de ${voucher.discount}% aplicado.`);
    setVoucherCode("");
  };

  // Filtrar vouchers válidos (não expirados e não usados)
  const currentDate = new Date().toISOString().split('T')[0];
  const validVouchers = vouchers.filter(v => !v.used && v.expires >= currentDate);

  return (
    <DashboardLayout userType="aluno">
      <div className="grid gap-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Ticket className="mr-2 h-6 w-6 text-primary" />
            Vouchers
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resgatar Voucher</CardTitle>
            <CardDescription>
              Insira o código do voucher para obter descontos em cursos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Insira o código do voucher"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
              />
              <Button onClick={handleVoucherSubmit}>Aplicar</Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-4">Meus Vouchers</h3>
          {validVouchers.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Sem vouchers disponíveis</CardTitle>
                <CardDescription>
                  Você não possui vouchers disponíveis no momento.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {validVouchers.map((voucher) => (
                <Card key={voucher.code}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Ticket className="mr-2 h-5 w-5 text-primary" />
                      {voucher.code}
                    </CardTitle>
                    <CardDescription>
                      Desconto de {voucher.discount}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Válido até: {voucher.expires}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Disponível para uso
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}