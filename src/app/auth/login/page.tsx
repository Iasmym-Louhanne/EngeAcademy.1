"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, GraduationCap, KeyRound, Lock, LucideIcon, Mail, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

// Esquema de validação do formulário
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Interface para os tipos de usuário
interface UserType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  dashboardPath: string;
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("aluno");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Configuração do react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  // Tipos de usuário disponíveis
  const userTypes: Record<string, UserType> = {
    aluno: {
      id: "aluno",
      title: "Aluno / Funcionário",
      description: "Acesse seus cursos e certificados",
      icon: GraduationCap,
      dashboardPath: "/dashboard/aluno",
    },
    empresa: {
      id: "empresa",
      title: "Empresa",
      description: "Gerencie funcionários e treinamentos",
      icon: Building2,
      dashboardPath: "/dashboard/empresa",
    },
    filial: {
      id: "filial",
      title: "Filial",
      description: "Gerencie funcionários da unidade",
      icon: UserCog,
      dashboardPath: "/dashboard/filial",
    },
    admin: {
      id: "admin",
      title: "Administrador",
      description: "Acesso completo à plataforma",
      icon: Lock,
      dashboardPath: "/dashboard/admin",
    },
  };

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        // Redirecionar com base no tipo selecionado
        const dashboardPath = userTypes[activeTab]?.dashboardPath || "/dashboard";
        toast.success(`Login bem-sucedido! Redirecionando para o painel ${userTypes[activeTab].title}`);
        router.push(dashboardPath);
      } else {
        toast.error("Credenciais inválidas. Tente novamente.");
      }
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Entrar na EngeAcademy</CardTitle>
            <CardDescription className="text-center">
              Escolha o tipo de acesso abaixo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 gap-2 mb-4">
                <TabsTrigger value="aluno" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Aluno</span>
                </TabsTrigger>
                <TabsTrigger value="empresa" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Empresa</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsList className="grid grid-cols-2 gap-2 mb-6">
                <TabsTrigger value="filial" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span>Filial</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Admin</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              <p>Credenciais de teste para {userTypes[activeTab].title}:</p>
              <p className="font-mono bg-muted p-2 rounded-md mt-1">
                {activeTab === "aluno" && "aluno@engeacademy.com"}
                {activeTab === "empresa" && "empresa@engeacademy.com"}
                {activeTab === "filial" && "filial@engeacademy.com"}
                {activeTab === "admin" && "admin@engeacademy.com"}
                <br />
                Senha: senha123
              </p>
            </div>
            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-primary hover:underline">
                Voltar para a página inicial
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}