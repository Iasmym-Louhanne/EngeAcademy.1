"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "@/components/site/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Course, getAllCourses } from "@/lib/course-service";
import { toast } from "sonner";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data.filter(c => c.status === 'published'));
      } catch (error) {
        toast.error("Não foi possível carregar os cursos.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, []);

  // Extrair todas as tags únicas dos cursos
  const allTags = Array.from(
    new Set(courses.flatMap(course => course.tags || []))
  );
  
  // Filtrar cursos com base na busca e tags selecionadas
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      searchTerm === "" || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => course.tags && course.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
  };

  return (
    <div className="container py-12 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Catálogo de Cursos</h1>
          <p className="text-muted-foreground">
            Explore nossos treinamentos especializados em segurança do trabalho
          </p>
        </div>
        
        <div className="w-full md:w-64 lg:w-72">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar cursos..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Filtrar por área</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge 
              key={tag} 
              variant={selectedTags.includes(tag) ? "default" : "outline"} 
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {(selectedTags.length > 0 || searchTerm) && (
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">Carregando cursos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium">Nenhum curso encontrado</h3>
              <p className="text-muted-foreground mt-2">
                Tente ajustar seus filtros ou critérios de busca.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.id} // Usando ID como slug por enquanto
                description={course.description || ""}
                price={course.price || 0}
                duration={`${course.duration || 0} min`}
                tags={course.tags}
                featured={course.status === 'published'} // Exemplo
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}