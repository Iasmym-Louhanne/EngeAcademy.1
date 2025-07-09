import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroSection } from "@/components/site/hero-section";
import { CourseCard } from "@/components/site/course-card";
import { courses } from "@/lib/mock-data";
import { MadeWithLasy } from "@/components/made-with-lasy";
import { BookOpen, Building2, CheckCircle, Shield } from "lucide-react";

export default function Home() {
  // Filtrar cursos em destaque
  const featuredCourses = courses.filter(course => course.featured);

  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Courses */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Cursos em Destaque</h2>
              <p className="text-muted-foreground mt-2">
                Conheça nossos treinamentos mais procurados
              </p>
            </div>
            <Link href="/cursos">
              <Button variant="outline">Ver todos os cursos</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.slug}
                description={course.description || ""}
                price={course.price || 0}
                duration={course.duration || ""}
                tags={course.tags}
                featured={course.featured}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher a EngeAcademy?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conforme as Normas</h3>
              <p className="text-muted-foreground">
                Cursos atualizados e alinhados com as mais recentes normas regulamentadoras.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conteúdo de Qualidade</h3>
              <p className="text-muted-foreground">
                Material didático desenvolvido por especialistas com experiência prática.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certificação Reconhecida</h3>
              <p className="text-muted-foreground">
                Certificados válidos e reconhecidos pelo Ministério do Trabalho.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soluções Corporativas</h3>
              <p className="text-muted-foreground">
                Plataforma adaptada para empresas, com controle de progresso e relatórios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Capacite sua equipe com os melhores treinamentos em segurança do trabalho
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/cursos">
              <Button size="lg" variant="secondary">
                Explorar Cursos
              </Button>
            </Link>
            <Link href="/contato">
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MadeWithLasy />
    </main>
  );
}