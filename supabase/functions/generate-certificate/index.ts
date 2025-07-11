import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { userId, courseId } = requestData

    // Validate required fields
    if (!userId || !courseId) {
      return new Response(
        JSON.stringify({ error: 'User ID e Course ID são obrigatórios.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('User error:', userError)
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get course data
    const { data: courseData, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('title')
      .eq('id', courseId)
      .single()

    if (courseError) {
      console.error('Course error:', courseError)
      return new Response(
        JSON.stringify({ error: 'Curso não encontrado.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const studentName = userData.full_name || 'Aluno Sem Nome'
    const courseName = courseData.title || 'Curso Concluído'
    const completionDate = new Date().toLocaleDateString('pt-BR')
    const authCode = crypto.randomUUID()

    // For now, we'll create a simple text-based certificate
    // In a real implementation, you would use a PDF library
    const certificateContent = `
CERTIFICADO DE CONCLUSÃO

Certificamos que ${studentName} concluiu com sucesso o curso de ${courseName}, em ${completionDate}.

Código de Autenticação: ${authCode}

EngeAcademy - Treinamentos Especializados
    `.trim()

    // Create a simple text file as certificate (placeholder)
    const certificateBlob = new Blob([certificateContent], { type: 'text/plain' })
    const filePath = `certificates/${userId}/${courseId}-${authCode}.txt`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('certificates')
      .upload(filePath, certificateBlob, { 
        contentType: 'text/plain',
        upsert: true 
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar certificado.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('certificates')
      .getPublicUrl(filePath)

    // Save certificate record to database
    const { error: dbError } = await supabaseAdmin
      .from('certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        authentication_code: authCode,
        pdf_url: urlData.publicUrl,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Erro ao registrar certificado.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Certificado gerado com sucesso!',
        pdfUrl: urlData.publicUrl,
        authCode: authCode
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})