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
  tags: string[] | string; // Pode ser string do DB ou array na UI
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

// CURSOS
export async function getAllCourses() {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error.message);
      throw error;
    }

    return data.map(processCourseTags) as Course[];
  } catch (error: any) {
    console.error("Error in getAllCourses:", error.message);
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
      console.error(`Error fetching course with id ${id}:`, error.message);
      throw error;
    }

    return processCourseTags(data) as Course;
  } catch (error: any) {
    console.error("Error in getCourseById:", error.message);
    throw error;
  }
}

export async function getCourseWithModules(id: string) {
  try {
    const course = await getCourseById(id);

    const { data: modules, error: modulesError } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", id)
      .order("order_index", { ascending: true });

    if (modulesError) {
      console.error(`Error fetching modules for course ${id}:`, modulesError.message);
      throw modulesError;
    }

    return {
      ...course,
      modules: modules || []
    } as Course & { modules: Module[] };
  } catch (error: any) {
    console.error("Error in getCourseWithModules:", error.message);
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
          console.error(`Error fetching lessons for module ${module.id}:`, error.message);
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
  } catch (error: any) {
    console.error("Error in getCourseWithModulesAndLessons:", error.message);
    throw error;
  }
}

export async function createCourse(courseData: Omit<Course, "id" | "created_at" | "updated_at">) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }
    
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
      console.error("Error creating course:", error.message);
      throw error;
    }

    return processCourseTags(data) as Course;
  } catch (error: any) {
    console.error("Error in createCourse:", error.message);
    throw error;
  }
}

export async function updateCourse(id: string, courseData: Partial<Course>) {
  try {
    const courseToUpdate = {
      ...courseData,
      tags: Array.isArray(courseData.tags) ? courseData.tags.join(',') : courseData.tags,
    };

    const { data, error } = await supabase
      .from("courses")
      .update(courseToUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating course with id ${id}:`, error.message);
      throw error;
    }

    return processCourseTags(data) as Course;
  } catch (error: any) {
    console.error("Error in updateCourse:", error.message);
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
      console.error(`Error deleting course with id ${id}:`, error.message);
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error in deleteCourse:", error.message);
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
      console.error(`Error fetching modules for course ${courseId}:`, error.message);
      throw error;
    }

    return data as Module[];
  } catch (error: any) {
    console.error("Error in getModulesByCourse:", error.message);
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
      console.error("Error creating module:", error.message);
      throw error;
    }

    return data as Module;
  } catch (error: any) {
    console.error("Error in createModule:", error.message);
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
      console.error(`Error updating module with id ${id}:`, error.message);
      throw error;
    }

    return data as Module;
  } catch (error: any) {
    console.error("Error in updateModule:", error.message);
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
      console.error(`Error deleting module with id ${id}:`, error.message);
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error in deleteModule:", error.message);
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
      console.error(`Error fetching lessons for module ${moduleId}:`, error.message);
      throw error;
    }

    return data as Lesson[];
  } catch (error: any) {
    console.error("Error in getLessonsByModule:", error.message);
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
      console.error("Error creating lesson:", error.message);
      throw error;
    }

    return data as Lesson;
  } catch (error: any) {
    console.error("Error in createLesson:", error.message);
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
      console.error(`Error updating lesson with id ${id}:`, error.message);
      throw error;
    }

    return data as Lesson;
  } catch (error: any) {
    console.error("Error in updateLesson:", error.message);
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
      console.error(`Error deleting lesson with id ${id}:`, error.message);
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error in deleteLesson:", error.message);
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
  } catch (error: any) {
    console.error("Error reordering modules:", error.message);
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
  } catch (error: any) {
    console.error("Error reordering lessons:", error.message);
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