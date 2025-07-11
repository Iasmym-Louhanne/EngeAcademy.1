import { supabase } from "@/integrations/supabase/client";

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
  tags: string[];
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

// CURSOS
export async function getAllCourses() {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }

    return data as Course[];
  } catch (error) {
    console.error("Error in getAllCourses:", error);
    throw error;
  }
}

export async function getCourseById(id: string) {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching course with id ${id}:`, error);
      throw error;
    }

    return data as Course;
  } catch (error) {
    console.error("Error in getCourseById:", error);
    throw error;
  }
}

export async function getCourseWithModules(id: string) {
  try {
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (courseError) {
      console.error(`Error fetching course with id ${id}:`, courseError);
      throw courseError;
    }

    const { data: modules, error: modulesError } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", id)
      .order("order_index", { ascending: true });

    if (modulesError) {
      console.error(`Error fetching modules for course ${id}:`, modulesError);
      throw modulesError;
    }

    return {
      ...course,
      modules: modules || []
    } as Course & { modules: Module[] };
  } catch (error) {
    console.error("Error in getCourseWithModules:", error);
    throw error;
  }
}

export async function getCourseWithModulesAndLessons(id: string) {
  try {
    const courseWithModules = await getCourseWithModules(id);
    
    const modulesWithLessons = await Promise.all(
      courseWithModules.modules.map(async (module) => {
        const { data: lessons, error } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", module.id)
          .order("order_index", { ascending: true });

        if (error) {
          console.error(`Error fetching lessons for module ${module.id}:`, error);
          throw error;
        }

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
  } catch (error) {
    console.error("Error in getCourseWithModulesAndLessons:", error);
    throw error;
  }
}

export async function createCourse(courseData: Omit<Course, "id" | "created_at" | "updated_at">) {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }

    console.log("Creating course with data:", courseData);
    console.log("Authenticated user:", user.id);
    
    // Garantir que os campos obrigatórios estão presentes
    const courseToInsert = {
      title: courseData.title || '',
      description: courseData.description || '',
      thumbnail_url: courseData.thumbnail_url || '',
      duration: courseData.duration || 0,
      price: courseData.price || 0,
      sale_price: courseData.sale_price || null,
      status: courseData.status || 'draft',
      category: courseData.category || '',
      tags: courseData.tags || []
    };

    console.log("Data to insert:", courseToInsert);

    const { data, error } = await supabase
      .from("courses")
      .insert(courseToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating course:", error);
      throw error;
    }

    console.log("Course created successfully:", data);
    return data as Course;
  } catch (error) {
    console.error("Error in createCourse:", error);
    throw error;
  }
}

export async function updateCourse(id: string, courseData: Partial<Course>) {
  try {
    const { data, error } = await supabase
      .from("courses")
      .update(courseData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating course with id ${id}:`, error);
      throw error;
    }

    return data as Course;
  } catch (error) {
    console.error("Error in updateCourse:", error);
    throw error;
  }
}

export async function deleteCourse(id: string) {
  try {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting course with id ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    throw error;
  }
}

// MÓDULOS
export async function getModulesByCourse(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error(`Error fetching modules for course ${courseId}:`, error);
      throw error;
    }

    return data as Module[];
  } catch (error) {
    console.error("Error in getModulesByCourse:", error);
    throw error;
  }
}

export async function createModule(moduleData: Omit<Module, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .insert(moduleData)
      .select()
      .single();

    if (error) {
      console.error("Error creating module:", error);
      throw error;
    }

    return data as Module;
  } catch (error) {
    console.error("Error in createModule:", error);
    throw error;
  }
}

export async function updateModule(id: string, moduleData: Partial<Module>) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .update(moduleData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating module with id ${id}:`, error);
      throw error;
    }

    return data as Module;
  } catch (error) {
    console.error("Error in updateModule:", error);
    throw error;
  }
}

export async function deleteModule(id: string) {
  try {
    const { error } = await supabase
      .from("course_modules")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting module with id ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteModule:", error);
    throw error;
  }
}

// AULAS
export async function getLessonsByModule(moduleId: string) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error(`Error fetching lessons for module ${moduleId}:`, error);
      throw error;
    }

    return data as Lesson[];
  } catch (error) {
    console.error("Error in getLessonsByModule:", error);
    throw error;
  }
}

export async function createLesson(lessonData: Omit<Lesson, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .insert(lessonData)
      .select()
      .single();

    if (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }

    return data as Lesson;
  } catch (error) {
    console.error("Error in createLesson:", error);
    throw error;
  }
}

export async function updateLesson(id: string, lessonData: Partial<Lesson>) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .update(lessonData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating lesson with id ${id}:`, error);
      throw error;
    }

    return data as Lesson;
  } catch (error) {
    console.error("Error in updateLesson:", error);
    throw error;
  }
}

export async function deleteLesson(id: string) {
  try {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting lesson with id ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteLesson:", error);
    throw error;
  }
}

// Funções para reordenar
export async function reorderModules(modules: { id: string; order_index: number }[]) {
  try {
    const updates = modules.map(({ id, order_index }) => 
      supabase
        .from("course_modules")
        .update({ order_index })
        .eq("id", id)
    );

    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error("Error reordering modules:", error);
    throw error;
  }
}

export async function reorderLessons(lessons: { id: string; order_index: number }[]) {
  try {
    const updates = lessons.map(({ id, order_index }) => 
      supabase
        .from("lessons")
        .update({ order_index })
        .eq("id", id)
    );

    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error("Error reordering lessons:", error);
    throw error;
  }
}

// Extrair ID do vídeo do YouTube da URL
export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}