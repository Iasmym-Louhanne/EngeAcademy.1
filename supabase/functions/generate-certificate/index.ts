// @deno-types="https://deno.land/x/supabase@1.0.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function handler(req: Request): Promise<Response> {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, courseId } = await req.json()
    
    if (!userId || !courseId) {
      throw new Error("User ID e Course ID são obrigatórios.")
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()

    if (userError) throw userError
    const studentName = userData.full_name || 'Aluno Sem Nome'

    // Get course data
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('title')
      .eq('id', courseId)
      .single()

    if (courseError) throw courseError
    const courseName = courseData.title || "Curso Concluído"
    
    const completionDate = new Date().toLocaleDateString('pt-BR')
    const authCode = crypto.randomUUID()

    // For now, we'll create a simple certificate record
    // In a real implementation, you would generate a PDF here
    const { error: dbError } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        authentication_code: authCode,
        pdf_url: `https://certificates.engeacademy.com/${authCode}.pdf`, // Mock URL
      })

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Certificado gerado com sucesso!',
        authCode: authCode,
        pdfUrl: `https://certificates.engeacademy.com/${authCode}.pdf`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error generating certificate:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}

// Export the handler
export default handler