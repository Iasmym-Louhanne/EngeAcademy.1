import { supabase } from "../integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: number;
  price: number;
  sale_price: number | null;
  status: "draft" | "published" | "archived";
  category: string;
  tags: string[] | string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  order_index: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

// Função auxiliar para converter tags
const processCourseTags = (course: any): Course => {
  if (course && typeof course.tags === 'string') {
    return { ...course, tags: course.tags.split(',').filter(tag => tag.trim() !== '') };
  }
  if (course && !course.tags) {
    return { ...course, tags: [] };
  }
  return course;
};

// Função auxiliar para tratar erros do Supabase
const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Erro em ${operation}:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
  
  // Criar uma mensagem de erro mais informativa
  let errorMessage = error.message || "Erro desconhecido";
  if (error.details) {
    errorMessage += ` - Detalhes: ${error.details}`;
  }
  if (error.hint) {
    errorMessage += ` - Dica: ${error.hint}`;
  }
  
  throw new Error(errorMessage);
};

// CURSOS
export async function getAllCourses() {
  try {
    console.log("Buscando todos os cursos...");
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      handleSupabaseError(error, "getAllCourses");
    }

    console.log("Cursos encontrados:", data?.length || 0);
    return data.map(processCourseTags) as Course[];
  } catch (error: any) {
    console.error("Erro em getAllCourses:", error);
    throw error;
  }
}

export async function getCourseById(id: string) {
  try {
    console.log("Buscando curso por ID:", id);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      handleSupabaseError(error, "getCourseById");
    }

    console.log("Curso encontrado:", data?.title);
    return processCourseTags(data) as Course;
  } catch (error: any) {
    console.error("Erro em getCourseById:", error);
    throw error;
  }
}

export async function getCourseWithModules(id: string) {
  try {
    console.log("Buscando curso com módulos:", id);
    const course = await getCourseById(id);

    console.log("Buscando módulos para o curso:", id);
    const { data: modules, error: modulesError } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", id)
      .order("order_index", { ascending: true });

    if (modulesError) {
      handleSupabaseError(modulesError, "getCourseWithModules - buscar módulos");
    }

    console.log("Módulos encontrados:", modules?.length || 0);
    return {
      ...course,
      modules: modules || []
    } as Course & { modules: Module[] };
  } catch (error: any) {
    console.error("Erro em getCourseWithModules:", error);
    throw error;
  }
}

export async function getCourseWithModulesAndLessons(id: string) {
  try {
    console.log("Buscando curso completo com módulos e aulas:", id);
    const courseWithModules = await getCourseWithModules(id);
    
    const modulesWithLessons = await Promise.all(
      courseWithModules.modules.map(async (module) => {
        console.log("Buscando aulas para o módulo:", module.id);
        const { data: lessons, error } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", module.id)
          .order("order_index", { ascending: true });

        if (error) {
          handleSupabaseError(error, `getCourseWithModulesAndLessons - buscar aulas do módulo ${module.id}`);
        }

        console.log(`Aulas encontradas no módulo ${module.title}:`, lessons?.length || 0);
        return {
          ...module,
          lessons: lessons || []
        };
      })
    );

    return {
      ...courseWithModules,
      modules: modulesWithLessons
    } as Course & { modules: (Module & { lessons: Lesson[] })[] };
  } catch (error: any) {
    console.error("Erro em getCourseWithModulesAndLessons:", error);
    throw error;
  }
}

export async function createCourse(courseData: Omit<Course, "id" | "created_at" | "updated_at">) {
  try {
    console.log("Criando novo curso:", courseData.title);
    
    const courseToInsert = {
      ...courseData,
      tags: Array.isArray(courseData.tags) ? courseData.tags.join(',') : courseData.tags,
    };

    const { data, error } = await supabase
      .from("courses")
      .insert(courseToInsert)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "createCourse");
    }

    console.log("Curso criado com sucesso:", data.id);
    return processCourseTags(data) as Course;
  } catch (error: any) {
    console.error("Erro em createCourse:", error);
    throw error;
  }
}

export async function updateCourse(id: string, courseData: Partial<Course>) {
  try {
    console.log("Atualizando curso:", id);
    
    const courseToUpdate = {
      ...courseData,
      tags: Array.isArray(courseData.tags) ? courseData.tags.join(',') : courseData.tags,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("courses")
      .update(courseToUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "updateCourse");
    }

    console.log("Curso atualizado com sucesso");
    return processCourseTags(data) as Course;
  } catch (error: any) {
    console.error("Erro em updateCourse:", error);
    throw error;
  }
}

export async function deleteCourse(id: string) {
  try {
    console.log("Deletando curso:", id);
    
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) {
      handleSupabaseError(error, "deleteCourse");
    }

    console.log("Curso deletado com sucesso");
    return true;
  } catch (error: any) {
    console.error("Erro em deleteCourse:", error);
    throw error;
  }
}

// MÓDULOS
export async function getModulesByCourse(courseId: string) {
  try {
    console.log("Buscando módulos do curso:", courseId);
    
    const { data, error } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (error) {
      handleSupabaseError(error, "getModulesByCourse");
    }

    console.log("Módulos encontrados:", data?.length || 0);
    return data as Module[];
  } catch (error: any) {
    console.error("Erro em getModulesByCourse:", error);
    throw error;
  }
}

export async function createModule(moduleData: Omit<Module, "id" | "created_at" | "updated_at">) {
  try {
    console.log("Criando novo módulo:", moduleData);
    
    const { data, error } = await supabase
      .from("course_modules")
      .insert(moduleData)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "createModule");
    }

    console.log("Módulo criado com sucesso:", data.id);
    return data as Module;
  } catch (error: any) {
    console.error("Erro em createModule:", error);
    throw error;
  }
}

export async function updateModule(id: string, moduleData: Partial<Module>) {
  try {
    console.log("Atualizando módulo:", id);
    
    const { data, error } = await supabase
      .from("course_modules")
      .update({
        ...moduleData,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "updateModule");
    }

    console.log("Módulo atualizado com sucesso");
    return data as Module;
  } catch (error: any) {
    console.error("Erro em updateModule:", error);
    throw error;
  }
}

export async function deleteModule(id: string) {
  try {
    console.log("Deletando módulo:", id);
    
    const { error } = await supabase
      .from("course_modules")
      .delete()
      .eq("id", id);

    if (error) {
      handleSupabaseError(error, "deleteModule");
    }

    console.log("Módulo deletado com sucesso");
    return true;
  } catch (error: any) {
    console.error("Erro em deleteModule:", error);
    throw error;
  }
}

// AULAS
export async function getLessonsByModule(moduleId: string) {
  try {
    console.log("Buscando aulas do módulo:", moduleId);
    
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("order_index", { ascending: true });

    if (error) {
      handleSupabaseError(error, "getLessonsByModule");
    }

    console.log("Aulas encontradas:", data?.length || 0);
    return data as Lesson[];
  } catch (error: any) {
    console.error("Erro em getLessonsByModule:", error);
    throw error;
  }
}

export async function createLesson(lessonData: Omit<Lesson, "id" | "created_at" | "updated_at">) {
  try {
    console.log("Criando nova aula:", lessonData.title);
    
    const { data, error } = await supabase
      .from("lessons")
      .insert(lessonData)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "createLesson");
    }

    console.log("Aula criada com sucesso:", data.id);
    return data as Lesson;
  } catch (error: any) {
    console.error("Erro em createLesson:", error);
    throw error;
  }
}

export async function updateLesson(id: string, lessonData: Partial<Lesson>) {
  try {
    console.log("Atualizando aula:", id);
    
    const { data, error } = await supabase
      .from("lessons")
      .update({
        ...lessonData,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "updateLesson");
    }

    console.log("Aula atualizada com sucesso");
    return data as Lesson;
  } catch (error: any) {
    console.error("Erro em updateLesson:", error);
    throw error;
  }
}

export async function deleteLesson(id: string) {
  try {
    console.log("Deletando aula:", id);
    
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", id);

    if (error) {
      handleSupabaseError(error, "deleteLesson");
    }

    console.log("Aula deletada com sucesso");
    return true;
  } catch (error: any) {
    console.error("Erro em deleteLesson:", error);
    throw error;
  }
}

// Funções para reordenar
export async function reorderModules(modules: { id: string; order_index: number }[]) {
  try {
    console.log("Reordenando módulos:", modules.length);
    
    const updates = modules.map(({ id, order_index }) => 
      supabase
        .from("course_modules")
        .update({ order_index })
        .eq("id", id)
    );

    await Promise.all(updates);
    console.log("Módulos reordenados com sucesso");
    return true;
  } catch (error: any) {
    console.error("Erro em reorderModules:", error);
    throw error;
  }
}

export async function reorderLessons(lessons: { id: string; order_index: number }[]) {
  try {
    console.log("Reordenando aulas:", lessons.length);
    
    const updates = lessons.map(({ id, order_index }) => 
      supabase
        .from("lessons")
        .update({ order_index })
        .eq("id", id)
    );

    await Promise.all(updates);
    console.log("Aulas reordenadas com sucesso");
    return true;
  } catch (error: any) {
    console.error("Erro em reorderLessons:", error);
    throw error;
  }
}

// Extrair ID do vídeo do YouTube da URL
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}