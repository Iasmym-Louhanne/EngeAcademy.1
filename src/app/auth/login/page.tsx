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
      // A lógica de login agora só precisa do email
      const success = await login(data.email);
      
      if (success) {
        // O redirecionamento será tratado pelo contexto de autenticação
        toast.success(`Login bem-sucedido! Redirecionando...`);
        // O hook useEffect no layout do dashboard cuidará do redirecionamento
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
              Acesse seu painel com seu email e senha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              <p>Credenciais de teste:</p>
              <div className="font-mono bg-muted p-2 rounded-md mt-1 text-left text-xs">
                <p><b>Admin:</b> admin@engeacademy.com</p>
                <p><b>Supervisor:</b> supervisor@engeacademy.com</p>
                <p><b>Comercial:</b> comercial@engeacademy.com</p>
                <p><b>Suporte:</b> suporte@engeacademy.com</p>
                <p className="mt-1"><b>Senha para todos:</b> senha123</p>
              </div>
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