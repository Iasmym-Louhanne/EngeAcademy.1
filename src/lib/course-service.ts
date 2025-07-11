import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

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
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }

  return data as Course[];
}

export async function getCourseById(id: string) {
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
}

export async function getCourseWithModules(id: string) {
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
    .from("modules")
    .select("*")
    .eq("course_id", id)
    .order("order_index", { ascending: true });

  if (modulesError) {
    console.error(`Error fetching modules for course ${id}:`, modulesError);
    throw modulesError;
  }

  return {
    ...course,
    modules: modules
  } as Course & { modules: Module[] };
}

export async function getCourseWithModulesAndLessons(id: string) {
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
        lessons: lessons
      };
    })
  );

  return {
    ...courseWithModules,
    modules: modulesWithLessons
  } as Course & { modules: (Module & { lessons: Lesson[] })[] };
}

export async function createCourse(courseData: Omit<Course, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("courses")
    .insert(courseData)
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error);
    throw error;
  }

  return data as Course;
}

export async function updateCourse(id: string, courseData: Partial<Course>) {
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
}

export async function deleteCourse(id: string) {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting course with id ${id}:`, error);
    throw error;
  }

  return true;
}

// MÓDULOS
export async function getModulesByCourse(courseId: string) {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error(`Error fetching modules for course ${courseId}:`, error);
    throw error;
  }

  return data as Module[];
}

export async function getModuleWithLessons(moduleId: string) {
  const { data: module, error: moduleError } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .single();

  if (moduleError) {
    console.error(`Error fetching module with id ${moduleId}:`, moduleError);
    throw moduleError;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleId)
    .order("order_index", { ascending: true });

  if (lessonsError) {
    console.error(`Error fetching lessons for module ${moduleId}:`, lessonsError);
    throw lessonsError;
  }

  return {
    ...module,
    lessons: lessons
  } as Module & { lessons: Lesson[] };
}

export async function createModule(moduleData: Omit<Module, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("modules")
    .insert(moduleData)
    .select()
    .single();

  if (error) {
    console.error("Error creating module:", error);
    throw error;
  }

  return data as Module;
}

export async function updateModule(id: string, moduleData: Partial<Module>) {
  const { data, error } = await supabase
    .from("modules")
    .update(moduleData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating module with id ${id}:`, error);
    throw error;
  }

  return data as Module;
}

export async function deleteModule(id: string) {
  const { error } = await supabase
    .from("modules")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting module with id ${id}:`, error);
    throw error;
  }

  return true;
}

export async function reorderModules(modules: { id: string; order_index: number }[]) {
  const updates = modules.map(({ id, order_index }) => ({
    id,
    order_index
  }));

  const { data, error } = await supabase
    .from("modules")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    console.error("Error reordering modules:", error);
    throw error;
  }

  return true;
}

// AULAS
export async function getLessonsByModule(moduleId: string) {
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
}

export async function getLessonById(id: string) {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching lesson with id ${id}:`, error);
    throw error;
  }

  return data as Lesson;
}

export async function createLesson(lessonData: Omit<Lesson, "id" | "created_at" | "updated_at">) {
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
}

export async function updateLesson(id: string, lessonData: Partial<Lesson>) {
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
}

export async function deleteLesson(id: string) {
  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting lesson with id ${id}:`, error);
    throw error;
  }

  return true;
}

export async function reorderLessons(lessons: { id: string; order_index: number }[]) {
  const updates = lessons.map(({ id, order_index }) => ({
    id,
    order_index
  }));

  const { data, error } = await supabase
    .from("lessons")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    console.error("Error reordering lessons:", error);
    throw error;
  }

  return true;
}

// Extrair ID do vídeo do YouTube da URL
export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}