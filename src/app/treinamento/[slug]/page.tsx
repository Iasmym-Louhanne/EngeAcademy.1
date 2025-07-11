"use client";

import { useState, useMemo } from 'react';
import { courses } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { VideoPlayer } from '@/components/video-player';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { generateCertificate } from '@/lib/certificate-generator';
import { useAuth } from '@/contexts/auth-context';

// Definir tipagem para o objeto de curso
interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  duration?: string;
  price?: number;
  thumbnail?: string;
  featured?: boolean;
  tags?: string[];
}

// Mock data for modules and lessons - this would come from Supabase
const courseStructure: Record<string, Array<{
  id: string;
  title: string;
  isQuiz?: boolean;
  lessons?: Array<{
    id: string;
    title: string;
    videoId: string;
  }>;
}>> = {
  'nr-35-trabalho-em-altura': [
    { id: 'mod1', title: 'Módulo 1: Introdução e Normas', lessons: [
      { id: 'les1', title: 'O que é a NR 35?', videoId: 'dQw4w9WgXcQ' },
      { id: 'les2', title: 'Responsabilidades do Empregador', videoId: 'L_jWHffIx5E' },
    ]},
    { id: 'mod2', title: 'Módulo 2: Equipamentos e Práticas', lessons: [
      { id: 'les3', title: 'Equipamentos de Proteção Individual (EPI)', videoId: '3tmd-ClpJxA' },
      { id: 'les4', title: 'Sistemas de Ancoragem', videoId: 'hT_nvWreIhg' },
    ]},
    { id: 'quiz1', title: 'Prova Final', isQuiz: true }
  ]
};

export default function TrainingPage({ params }: { params: { slug: string } }) {
  const { user, profile } = useAuth();
  const course = courses.find((c: Course) => c.slug === params.slug);
  const structure = courseStructure[params.slug as keyof typeof courseStructure] || [];

  const [activeLesson, setActiveLesson] = useState(structure[0]?.lessons?.[0]?.id || null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

  const totalLessons = useMemo(() => structure.flatMap(mod => mod.lessons || []).length, [structure]);
  const progress = useMemo(() => (completedLessons.size / totalLessons) * 100, [completedLessons, totalLessons]);

  if (!course) {
    notFound();
  }

  const handleLessonClick = (lessonId: string) => {
    setActiveLesson(lessonId);
    setShowQuiz(false);
  };

  const handleQuizClick = () => {
    if (progress < 100) {
        toast.error("Você precisa concluir todas as aulas para acessar a prova.");
        return;
    }
    setShowQuiz(true);
    setActiveLesson(null);
  }

  const handleVideoEnd = () => {
    if (activeLesson) {
      setCompletedLessons(prev => new Set(prev).add(activeLesson));
      // Em uma aplicação real, você chamaria o Supabase para salvar o progresso
      // ex: await supabase.from('student_progress').insert({ user_id: ..., lesson_id: activeLesson })
    }
  };
  
  const handleCertificateGeneration = async () => {
    setIsGeneratingCertificate(true);
    toast.loading("Gerando seu certificado...");
    
    try {
        const studentName = profile?.full_name || "Aluno";
        const completionDate = new Date().toLocaleDateString('pt-BR');
        
        const pdfUrl = await generateCertificate({
            studentName,
            courseName: course.title,
            completionDate,
            courseId: course.id,
            userId: user?.id,
        });

        toast.dismiss();
        toast.success("Certificado gerado com sucesso!");
        
        // Abrir o PDF em uma nova janela
        const newWindow = window.open();
        if (newWindow) {
            newWindow.location.href = pdfUrl;
        } else {
            toast.error("Seu navegador bloqueou a abertura do certificado. Verifique suas configurações.");
        }
    } catch (error) {
        toast.dismiss();
        toast.error("Falha ao gerar o certificado. Tente novamente.");
        console.error(error);
    } finally {
        setIsGeneratingCertificate(false);
    }
  }

  const activeVideoId = structure
    .flatMap(mod => mod.lessons || [])
    .find(les => les.id === activeLesson)?.videoId;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">{course.title}</h2>
          <Progress value={progress} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-1">{Math.round(progress)}% concluído</p>
        </div>
        <Accordion type="multiple" defaultValue={['mod1']} className="w-full overflow-y-auto">
          {structure.map((module, index) => (
            <AccordionItem value={module.id} key={module.id}>
              <AccordionTrigger className="px-4 font-semibold">{module.title}</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {module.lessons?.map(lesson => (
                    <li key={lesson.id}>
                      <button
                        onClick={() => handleLessonClick(lesson.id)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeLesson === lesson.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                      >
                        {completedLessons.has(lesson.id) ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                        <span className="flex-1">{lesson.title}</span>
                      </button>
                    </li>
                  ))}
                  {module.isQuiz && (
                     <li>
                        <button
                            onClick={handleQuizClick}
                            disabled={progress < 100}
                            className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Lock className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1">{module.title}</span>
                        </button>
                     </li>
                  )}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-muted/20 flex flex-col items-center justify-center">
        {activeVideoId && !showQuiz && (
          <VideoPlayer videoId={activeVideoId} onVideoEnd={handleVideoEnd} />
        )}
        {showQuiz && (
            <div className="text-center bg-card p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Prova Final</h2>
                <p className="text-muted-foreground mb-6">A funcionalidade da prova será implementada em breve.</p>
                <p className="mb-4">Por enquanto, vamos simular sua aprovação!</p>
                <Button 
                  onClick={handleCertificateGeneration} 
                  disabled={isGeneratingCertificate}
                >
                  {isGeneratingCertificate ? 'Gerando...' : 'Gerar Certificado de Conclusão'}
                </Button>
            </div>
        )}
        {!activeVideoId && !showQuiz && (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Bem-vindo ao seu treinamento!</h2>
                <p className="text-muted-foreground mt-2">Selecione uma aula na barra lateral para começar.</p>
            </div>
        )}
      </main>
    </div>
  );
}