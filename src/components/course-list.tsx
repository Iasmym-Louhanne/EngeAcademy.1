"use client";

import { useState } from "react";
import { courses, packages, Course, CoursePackage } from "@/lib/mock-data";
import { CourseCard } from "./course-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function CourseList() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [certificateFilter, setCertificateFilter] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const allItems: (Course | CoursePackage)[] = [...courses, ...packages];

  const filteredItems = allItems.filter(item => {
    const isCourse = (item: any): item is Course => 'category' in item;

    // Category filter
    const categoryMatch = categoryFilter === 'all' || (isCourse(item) && item.category.replace(/\s+/g, '+') === categoryFilter);
    
    // Certificate filter
    const certificateMatch = !certificateFilter || (isCourse(item) && item.hasCertificate);

    // Search filter
    const searchMatch = searchFilter === '' || item.title.toLowerCase().includes(searchFilter.toLowerCase());

    return categoryMatch && certificateMatch && searchMatch;
  });

  return (
    <section id="cursos" className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Cursos e Pacotes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 p-4 border rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-4">Filtros</h3>
              <div className="space-y-6">
                <div>
                  <Label>Busca por nome</Label>
                  <Input 
                    placeholder="Ex: NR 35"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="NR">NR</SelectItem>
                      <SelectItem value="CIPA">CIPA</SelectItem>
                      <SelectItem value="Primeiros+Socorros">Primeiros Socorros</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="certificate" 
                    checked={certificateFilter}
                    onCheckedChange={(checked) => setCertificateFilter(Boolean(checked))}
                  />
                  <Label htmlFor="certificate">Com Certificado</Label>
                </div>
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <main className="md:col-span-3">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <CourseCard 
                    key={item.id} 
                    item={item} 
                    type={'category' in item ? 'course' : 'package'} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>Nenhum curso encontrado com os filtros selecionados.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}