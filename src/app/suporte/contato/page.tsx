"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle, Clock, Mail, MessageSquare, Phone } from "lucide-react";

// Esquema de validação do formulário
const contactFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Assunto é obrigatório"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContatoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Configuração do react-hook-form
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });
  
  // Enviar mensagem (simulado)
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simular uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Formulário enviado:", data);
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-lg text-muted-foreground">
            Estamos aqui para ajudar. Envie sua mensagem e nossa equipe entrará em contato em breve.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações de contato */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>Fale conosco pelos seguintes canais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a href="mailto:contato@engeacademy.com" className="text-sm text-muted-foreground hover:text-primary">
                      contato@engeacademy.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <a href="tel:+551199999999" className="text-sm text-muted-foreground hover:text-primary">
                      (11) 9999-9999
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Chat Online</h3>
                    <p className="text-sm text-muted-foreground">
                      Disponível de segunda a sexta, das 8h às 18h
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Horário de Atendimento</h3>
                    <p className="text-sm text-muted-foreground">
                      Segunda a Sexta: 8h às 18h<br />
                      Sábado: 9h às 13h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Suporte Prioritário</CardTitle>
                <CardDescription>Para clientes empresariais</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Empresas com plano corporativo têm acesso ao nosso canal de atendimento prioritário.
                </p>
                <Button className="w-full mt-4" variant="outline">
                  Acessar Suporte Empresarial
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Formulário de contato */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e retornaremos o mais breve possível
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Mensagem Enviada!</h3>
                    <p className="text-muted-foreground mb-6">
                      Agradecemos seu contato. Nossa equipe analisará sua mensagem e responderá em até 24 horas úteis.
                    </p>
                    <Button onClick={() => setIsSuccess(false)}>Enviar Nova Mensagem</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone (opcional)</Label>
                        <Input
                          id="phone"
                          placeholder="(00) 00000-0000"
                          {...register("phone")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto *</Label>
                        <Select
                          onValueChange={(value) => register("subject").onChange({ target: { value } })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um assunto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dúvida sobre cursos">Dúvida sobre cursos</SelectItem>
                            <SelectItem value="Problema técnico">Problema técnico</SelectItem>
                            <SelectItem value="Informações para empresas">Informações para empresas</SelectItem>
                            <SelectItem value="Certificados">Certificados</SelectItem>
                            <SelectItem value="Pagamentos">Pagamentos</SelectItem>
                            <SelectItem value="Outro assunto">Outro assunto</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.subject && (
                          <p className="text-sm text-destructive">{errors.subject.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        placeholder="Descreva sua dúvida ou solicitação em detalhes..."
                        rows={5}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>Respostas rápidas para dúvidas comuns</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Como faço para obter um certificado?</h3>
                <p className="text-sm text-muted-foreground">
                  Após concluir todas as aulas e ser aprovado na avaliação final, seu certificado ficará disponível automaticamente na seção "Certificados" do seu perfil.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Quanto tempo leva para responderem minhas dúvidas?</h3>
                <p className="text-sm text-muted-foreground">
                  Nosso tempo médio de resposta é de até 24 horas úteis, mas geralmente respondemos bem mais rápido. Clientes empresariais têm suporte prioritário.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Posso transferir um curso para outro funcionário?</h3>
                <p className="text-sm text-muted-foreground">
                  Sim, empresas podem transferir licenças de cursos entre funcionários desde que o curso não tenha sido iniciado. Acesse o painel administrativo para realizar essa operação.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Como solicitar uma nota fiscal?</h3>
                <p className="text-sm text-muted-foreground">
                  As notas fiscais são emitidas automaticamente após a confirmação do pagamento e enviadas para o email cadastrado. Você também pode acessá-las na seção "Financeiro" do seu perfil.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <a href="/suporte/faq">Ver todas as perguntas frequentes</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}