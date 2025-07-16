import { supabase } from "../integrations/supabase/client";

export interface Exam {
  id: string;
  module_id: string;
  title: string;
  description: string;
  passing_score: number;
  time_limit: number | null;
  attempts_allowed: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  points: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
  created_at: string;
}

export interface ExamAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  score: number | null;
  passed: boolean | null;
  started_at: string;
  completed_at: string | null;
  answers: {
    question_id: string;
    selected_options: string[];
  }[];
}

// PROVAS
export async function getExamsByModule(moduleId: string) {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("module_id", moduleId);

  if (error) {
    console.error(`Error fetching exams for module ${moduleId}:`, error);
    throw error;
  }

  return data as Exam[];
}

export async function getExamById(id: string) {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching exam with id ${id}:`, error);
    throw error;
  }

  return data as Exam;
}

export async function getExamWithQuestions(id: string) {
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select("*")
    .eq("id", id)
    .single();

  if (examError) {
    console.error(`Error fetching exam with id ${id}:`, examError);
    throw examError;
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("exam_id", id)
    .order("order_index", { ascending: true });

  if (questionsError) {
    console.error(`Error fetching questions for exam ${id}:`, questionsError);
    throw questionsError;
  }

  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      const { data: options, error: optionsError } = await supabase
        .from("question_options")
        .select("*")
        .eq("question_id", question.id)
        .order("order_index", { ascending: true });

      if (optionsError) {
        console.error(`Error fetching options for question ${question.id}:`, optionsError);
        throw optionsError;
      }

      return {
        ...question,
        options: options
      };
    })
  );

  return {
    ...exam,
    questions: questionsWithOptions
  } as Exam & { questions: (Question & { options: QuestionOption[] })[] };
}

export async function createExam(examData: Omit<Exam, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("exams")
    .insert(examData)
    .select()
    .single();

  if (error) {
    console.error("Error creating exam:", error);
    throw error;
  }

  return data as Exam;
}

export async function updateExam(id: string, examData: Partial<Exam>) {
  const { data, error } = await supabase
    .from("exams")
    .update(examData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating exam with id ${id}:`, error);
    throw error;
  }

  return data as Exam;
}

export async function deleteExam(id: string) {
  const { error } = await supabase
    .from("exams")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting exam with id ${id}:`, error);
    throw error;
  }

  return true;
}

// QUESTÕES
export async function getQuestionsByExam(examId: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error(`Error fetching questions for exam ${examId}:`, error);
    throw error;
  }

  return data as Question[];
}

export async function getQuestionWithOptions(id: string) {
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .single();

  if (questionError) {
    console.error(`Error fetching question with id ${id}:`, questionError);
    throw questionError;
  }

  const { data: options, error: optionsError } = await supabase
    .from("question_options")
    .select("*")
    .eq("question_id", id)
    .order("order_index", { ascending: true });

  if (optionsError) {
    console.error(`Error fetching options for question ${id}:`, optionsError);
    throw optionsError;
  }

  return {
    ...question,
    options: options
  } as Question & { options: QuestionOption[] };
}

export async function createQuestion(
  questionData: Omit<Question, "id" | "created_at" | "updated_at">,
  options: Omit<QuestionOption, "id" | "question_id" | "created_at">[]
) {
  // Iniciar uma transação
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .insert(questionData)
    .select()
    .single();

  if (questionError) {
    console.error("Error creating question:", questionError);
    throw questionError;
  }

  if (options.length > 0) {
    const optionsWithQuestionId = options.map(option => ({
      ...option,
      question_id: question.id
    }));

    const { error: optionsError } = await supabase
      .from("question_options")
      .insert(optionsWithQuestionId);

    if (optionsError) {
      console.error(`Error creating options for question ${question.id}:`, optionsError);
      throw optionsError;
    }
  }

  return getQuestionWithOptions(question.id);
}

export async function updateQuestion(
  id: string,
  questionData: Partial<Question>,
  options?: Omit<QuestionOption, "question_id" | "created_at">[]
) {
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .update(questionData)
    .eq("id", id)
    .select()
    .single();

  if (questionError) {
    console.error(`Error updating question with id ${id}:`, questionError);
    throw questionError;
  }

  if (options) {
    // Deletar opções existentes e inserir novas
    const { error: deleteError } = await supabase
      .from("question_options")
      .delete()
      .eq("question_id", id);

    if (deleteError) {
      console.error(`Error deleting options for question ${id}:`, deleteError);
      throw deleteError;
    }

    if (options.length > 0) {
      const optionsWithQuestionId = options.map(option => ({
        ...option,
        question_id: id
      }));

      const { error: optionsError } = await supabase
        .from("question_options")
        .insert(optionsWithQuestionId);

      if (optionsError) {
        console.error(`Error creating options for question ${id}:`, optionsError);
        throw optionsError;
      }
    }
  }

  return getQuestionWithOptions(id);
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting question with id ${id}:`, error);
    throw error;
  }

  return true;
}

export async function reorderQuestions(questions: { id: string; order_index: number }[]) {
  const updates = questions.map(({ id, order_index }) => ({
    id,
    order_index
  }));

  const { data, error } = await supabase
    .from("questions")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    console.error("Error reordering questions:", error);
    throw error;
  }

  return true;
}

// TENTATIVAS DE PROVA
export async function startExamAttempt(userId: string, examId: string) {
  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({
      user_id: userId,
      exam_id: examId,
      answers: []
    })
    .select()
    .single();

  if (error) {
    console.error(`Error starting exam attempt for user ${userId} on exam ${examId}:`, error);
    throw error;
  }

  return data as ExamAttempt;
}

export async function submitExamAttempt(
  attemptId: string,
  answers: { question_id: string; selected_options: string[] }[],
  score: number,
  passed: boolean
) {
  const { data, error } = await supabase
    .from("exam_attempts")
    .update({
      answers,
      score,
      passed,
      completed_at: new Date().toISOString()
    })
    .eq("id", attemptId)
    .select()
    .single();

  if (error) {
    console.error(`Error submitting exam attempt ${attemptId}:`, error);
    throw error;
  }

  return data as ExamAttempt;
}

export async function getUserExamAttempts(userId: string, examId: string) {
  const { data, error } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("exam_id", examId)
    .order("started_at", { ascending: false });

  if (error) {
    console.error(`Error fetching attempts for user ${userId} on exam ${examId}:`, error);
    throw error;
  }

  return data as ExamAttempt[];
}