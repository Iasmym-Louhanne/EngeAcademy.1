"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, ChevronRight, LifeBuoy, HelpCircle, MessageSquare, FileText, BookOpen, FileQuestion, Building, Shield, Award } from "lucide-react";

// Categorias e perguntas do FAQ
const faqCategories = [
  {
    id: "platform",
    title: "Plataforma",
    icon: <LifeBuoy className="h-5 w-5" />,
    questions: [
      {
        id: "q1",
        question: "Como faço login na plataforma?",
        answer: "Para fazer login na plataforma, acesse a página inicial e clique no botão 'Entrar' no canto superior direito. Insira seu email e senha cadastrados e selecione o tipo de perfil adequado (Aluno, Empresa, Filial ou Administrador)."
      },
      {
        id: "q2",
        question: "Esqueci minha senha, como recuperá-la?",
        answer: "Na tela de login, clique em 'Esqueci minha senha'. Você receberá um email com instruções para criar uma nova senha. Verifique também sua pasta de spam caso não encontre o email na caixa de entrada."
      },
      {
        id: "q3",
        question: "A plataforma funciona em dispositivos móveis?",
        answer: "Sim, a EngeAcademy foi desenvolvida com abordagem mobile-first e é totalmente responsiva. Você pode acessar todos os recursos através de smartphones e tablets, sem a necessidade de instalar aplicativos."
      },
      {
        id: "q4",
        question: "Quais navegadores são compatíveis com a plataforma?",
        answer: "A plataforma é compatível com as versões mais recentes dos principais navegadores: Google Chrome, Mozilla Firefox, Safari, Microsoft Edge e Opera. Recomendamos manter seu navegador sempre atualizado para melhor experiência."
      }
    ]
  },
  {
    id: "courses",
    title: "Cursos",
    icon: <BookOpen className="h-5 w-5" />,
    questions: [
      {
        id: "q5",
        question: "Como acessar um curso que comprei?",
        answer: "Após efetuar o login, acesse seu dashboard de aluno e clique em 'Meus Cursos'. Todos os cursos adquiridos estarão disponíveis nesta seção. Clique no curso desejado para começar ou continuar seus estudos."
      },
      {
        id: "q6",
        question: "Quanto tempo tenho para concluir um curso?",
        answer: "O acesso aos cursos é ilimitado. Uma vez adquirido, você pode acessar o conteúdo quando e quantas vezes quiser, sem prazo de validade. Os certificados de conclusão, porém, possuem validade específica conforme a norma regulamentadora."
      },
      {
        id: "q7",
        question: "Posso baixar o material para estudar offline?",
        answer: "Sim, a maioria dos materiais complementares (apostilas, planilhas, checklists) pode ser baixada para estudo offline. Os vídeos, porém, estão disponíveis apenas para streaming durante a conexão com a internet."
      },
      {
        id: "q8",
        question: "Como faço para obter o certificado após concluir o curso?",
        answer: "Após assistir a todas as aulas e ser aprovado na avaliação final, o certificado será gerado automaticamente e ficará disponível na seção 'Certificados' do seu dashboard. Você poderá baixá-lo em formato PDF ou solicitar uma versão impressa."
      }
    ]
  },
  {
    id: "certificates",
    title: "Certificados",
    icon: <Award className="h-5 w-5" />,
    questions: [
      {
        id: "q9",
        question: "Os certificados da EngeAcademy são reconhecidos?",
        answer: "Sim, nossos certificados são reconhecidos e válidos para fins de comprovação de treinamento conforme exigido pelas Normas Regulamentadoras do Ministério do Trabalho. Todos possuem código de autenticação verificável."
      },
      {
        id: "q10",
        question: "Qual é a validade dos certificados?",
        answer: "A validade dos certificados varia conforme a norma regulamentadora específica. Por exemplo, certificados da NR-35 têm validade de 2 anos, enquanto os da NR-10 têm validade de 2 anos para reciclagem. A data de validade é claramente indicada em cada certificado."
      },
      {
        id: "q11",
        question: "Como verificar a autenticidade de um certificado?",
        answer: "Todos os certificados possuem um código de autenticação único. Para verificar a autenticidade, acesse a seção 'Verificar Certificado' em nosso site e insira o código. O sistema mostrará os detalhes do certificado para confirmação."
      }
    ]
  },
  {
    id: "corporate",
    title: "Empresas",
    icon: <Building className="h-5 w-5" />,
    questions: [
      {
        id: "q12",
        question: "Como cadastrar minha empresa na plataforma?",
        answer: "Para cadastrar sua empresa, clique em 'Para Empresas' no menu principal e depois em 'Cadastrar Empresa'. Preencha o formulário com os dados solicitados e nossa equipe entrará em contato para finalizar o processo e oferecer os planos disponíveis."
      },
      {
        id: "q13",
        question: "É possível gerenciar múltiplas filiais?",
        answer: "Sim, a plataforma permite o gerenciamento hierárquico de empresa matriz e suas filiais. Cada filial pode ter seu próprio administrador com acesso restrito aos funcionários daquela unidade, enquanto a matriz tem visão completa de todas as filiais."
      },
      {
        id: "q14",
        question: "Como adicionar funcionários em lote?",
        answer: "No dashboard da empresa, acesse 'Funcionários' e clique em 'Importar'. Você pode baixar o modelo de planilha, preenchê-lo com os dados dos funcionários e fazer o upload. O sistema processará a importação automaticamente."
      },
      {
        id: "q15",
        question: "Quais relatórios estão disponíveis para empresas?",
        answer: "A plataforma oferece diversos relatórios, como: progresso de treinamento por funcionário, certificados emitidos, certificados próximos do vencimento, histórico de cursos concluídos, e estatísticas gerais. Todos podem ser exportados em formato CSV ou PDF."
      }
    ]
  },
  {
    id: "security",
    title: "Segurança",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        id: "q16",
        question: "Como a EngeAcademy protege meus dados?",
        answer: "A EngeAcademy utiliza criptografia de ponta a ponta para proteger dados sensíveis. Adotamos padrões rigorosos de segurança, incluindo autenticação em duas etapas, e estamos em conformidade com a LGPD (Lei Geral de Proteção de Dados)."
      },
      {
        id: "q17",
        question: "Quais informações são coletadas pela plataforma?",
        answer: "Coletamos apenas as informações necessárias para o funcionamento da plataforma, como dados cadastrais, histórico de cursos e informações de pagamento. Para detalhes completos, consulte nossa Política de Privacidade."
      }
    ]
  },
  {
    id: "payment",
    title: "Pagamentos",
    icon: <FileText className="h-5 w-5" />,
    questions: [
      {
        id: "q18",
        question: "Quais formas de pagamento são aceitas?",
        answer: "Aceitamos cartões de crédito, boleto bancário, PIX e, para empresas, também oferecemos a opção de faturamento com prazo de pagamento negociável de acordo com o volume de cursos adquiridos."
      },
      {
        id: "q19",
        question: "Como aplicar um voucher de desconto?",
        answer: "Durante o processo de compra, na tela de pagamento, você encontrará um campo para inserir o código do voucher. Digite o código e clique em 'Aplicar'. O desconto será calculado automaticamente no valor final."
      }
    ]
  }
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("platform");
  
  // Filtrar perguntas com base na pesquisa
  const filteredQuestions = searchTerm
    ? faqCategories.flatMap(category => 
        category.questions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(q => ({ ...q, category: category.id }))
      )
    : [];
  
  // Determinar se estamos mostrando resultados de pesquisa
  const showingSearchResults = searchTerm.length > 0;
  
  // Obter as perguntas da categoria atual (quando não estamos pesquisando)
  const currentCategoryQuestions = faqCategories.find(
    cat => cat.id === activeCategory
  )?.questions || [];

  return (
    <div className="container py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-lg text-muted-foreground">
            Encontre respostas para as dúvidas mais comuns sobre a EngeAcademy
          </p>
          
          <div className="mt-6 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-10 py-6"
                placeholder="Pesquisar por palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {showingSearchResults ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Resultados da pesquisa para "{searchTerm}"
            </h2>
            
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
                <p className="text-muted-foreground">
                  Tente utilizar termos diferentes ou entre em contato com nosso suporte.
                </p>
                <Button className="mt-4" asChild>
                  <a href="/suporte/contato">Contatar Suporte</a>
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredQuestions.map((q) => (
                  <AccordionItem 
                    key={q.id} 
                    value={q.id}
                    className="border rounded-lg px-4 py-2"
                  >
                    <AccordionTrigger className="text-left font-medium py-3">
                      {q.question}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <p className="text-muted-foreground">{q.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
                {faqCategories.map((category) => (
                  <TabsTrigger 
                    key={category.id}
                    value={category.id}
                    className="flex flex-col items-center py-3"
                  >
                    {category.icon}
                    <span className="mt-1 text-xs">{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {faqCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    {category.icon}
                    <span className="ml-2">{category.title}</span>
                  </h2>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((q) => (
                      <AccordionItem 
                        key={q.id} 
                        value={q.id}
                        className="border rounded-lg px-4 py-2"
                      >
                        <AccordionTrigger className="text-left font-medium py-3">
                          {q.question}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                          <p className="text-muted-foreground">{q.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
        
        <div className="mt-12 text-center bg-muted rounded-lg p-8">
          <h2 className="text-xl font-bold mb-2">Não encontrou o que procurava?</h2>
          <p className="text-muted-foreground mb-6">
            Nossa equipe de suporte está pronta para ajudar com qualquer dúvida adicional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="flex items-center">
              <a href="/suporte/contato">
                <MessageSquare className="mr-2 h-5 w-5" />
                Falar com Suporte
              </a>
            </Button>
            <Button variant="outline" asChild className="flex items-center">
              <a href="/suporte/tutorial">
                <FileQuestion className="mr-2 h-5 w-5" />
                Ver Tutoriais
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}