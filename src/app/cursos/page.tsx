import { CourseCard } from "@/components/site/course-card";
import { courses } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function CoursesPage() {
  // Extrair todas as tags únicas dos cursos
  const allTags = Array.from(
    new Set(courses.flatMap(course => course.tags || []))
  );

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Catálogo de Cursos</h1>
          <p className="text-muted-foreground">
            Explore nossos treinamentos especializados em segurança do trabalho
          </p>
        </div>
        
        {/* Search bar */}
        <div className="w-full md:w-64 lg:w-72">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar cursos..." className="pl-8" />
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Filtrar por área</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10">
              {tag}
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Limpar filtros
          </Button>
        </div>
      </div>
      
      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
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
  );
}