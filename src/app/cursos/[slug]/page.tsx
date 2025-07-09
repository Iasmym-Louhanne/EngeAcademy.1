import { courses, packages } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Video, BarChart } from "lucide-react";
import { CourseCard } from "@/components/course-card";

type CourseInfoItemProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function CourseInfoItem({ icon: Icon, label, value }: CourseInfoItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-8 w-8 text-primary" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const allItems = [...courses, ...packages];
  const item = allItems.find((c) => c.slug === params.slug);

  if (!item) {
    notFound();
  }

  const isCourse = 'category' in item;
  const displayPrice = `R$ ${item.price.toFixed(2).replace('.', ',')}`;

  const relatedCourses = courses.filter(c => isCourse && c.category === item.category && c.id !== item.id).slice(0, 3);

  return (
    <div className="container py-12 md:py-20">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          {isCourse ? (
            <Badge variant="secondary" className="mb-2">{item.category}</Badge>
          ) : (
            <Badge className="mb-2">Pacote de Cursos</Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{item.description}</p>

          <div className="aspect-video rounded-lg overflow-hidden border mb-8">
            <Image
              src={item.imageUrl}
              alt={`Preview do curso ${item.title}`}
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Sobre este {isCourse ? 'Curso' : 'Pacote'}</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Este treinamento foi cuidadosamente elaborado para fornecer o conhecimento necessário para profissionais que buscam excelência e conformidade em Saúde e Segurança do Trabalho. Abordamos desde os conceitos fundamentais até as práticas mais avançadas, garantindo uma formação completa.
            </p>
            {isCourse && (
                <p>Ao concluir, você estará apto a aplicar os conhecimentos no seu dia a dia profissional, contribuindo para um ambiente de trabalho mais seguro e produtivo.</p>
            )}
            {!isCourse && (
                <div>
                    <p>Este pacote inclui os seguintes cursos:</p>
                    <ul>
                        {(item as any).courseIds.map((id: string) => {
                            const courseInPackage = courses.find(c => c.id === id);
                            return courseInPackage ? <li key={id}>{courseInPackage.title}</li> : null;
                        })}
                    </ul>
                </div>
            )}
          </div>
        </div>

        <aside className="md:col-span-1">
          <div className="sticky top-24 p-6 border rounded-lg bg-card">
            <div className="space-y-6">
              {isCourse && (
                <>
                  <CourseInfoItem icon={Clock} label="Duração" value={item.duration} />
                  <CourseInfoItem icon={BarChart} label="Carga Horária" value={item.workload} />
                  <CourseInfoItem icon={Video} label="Formato" value="Vídeo Aulas" />
                  <CourseInfoItem icon={ShieldCheck} label="Certificado" value={item.hasCertificate ? "Incluso" : "Não Incluso"} />
                </>
              )}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-4xl font-bold">{displayPrice}</p>
              </div>
              <Button size="lg" className="w-full">Comprar Agora</Button>
              <Button variant="outline" className="w-full">Adicionar ao Carrinho</Button>
            </div>
          </div>
        </aside>
      </div>

      {relatedCourses.length > 0 && (
        <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center">Cursos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCourses.map(course => (
                    <CourseCard key={course.id} item={course} type="course" />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}