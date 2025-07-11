import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1'
import { corsHeaders } from '../_shared/cors.ts'

async function fetchImage(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  return await response.arrayBuffer();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId, courseId } = await req.json();
    if (!userId || !courseId) {
      throw new Error("User ID e Course ID são obrigatórios.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: userData, error: userError } = await supabaseAdmin.from('profiles').select('full_name').eq('id', userId).single();
    if (userError) throw userError;
    const studentName = userData.full_name || 'Aluno Sem Nome';

    const { data: courseData, error: courseError } = await supabaseAdmin.from('courses').select('title').eq('id', courseId).single();
    if (courseError) throw courseError;
    const courseName = courseData.title || "Curso Concluído";
    
    const completionDate = new Date().toLocaleDateString('pt-BR');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([841.89, 595.28]); // A4 Landscape
    const { width, height } = page.getSize();

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const engeacademyLogoUrl = 'https://i.imgur.com/Y8vC5h4.png';
    const engeacademyLogoBytes = await fetchImage(engeacademyLogoUrl);
    const engeacademyLogo = await pdfDoc.embedPng(engeacademyLogoBytes);
    page.drawImage(engeacademyLogo, { x: 50, y: height - 100, width: 150 });

    page.drawText('CERTIFICADO DE CONCLUSÃO', {
      x: width / 2 - 200,
      y: height - 150,
      font: helveticaBold,
      size: 30,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText(`Certificamos que`, { x: 150, y: height / 2 + 50, font: helvetica, size: 20 });
    page.drawText(`${studentName}`, { x: width / 2 - (studentName.length * 12) / 2, y: height / 2, font: helveticaBold, size: 24, color: rgb(0.2, 0.5, 0.8) });
    page.drawText(`concluiu com sucesso o curso de ${courseName}, em ${completionDate}.`, { x: 150, y: height / 2 - 50, font: helvetica, size: 20 });

    const authCode = crypto.randomUUID();
    page.drawText(`Código de Autenticação: ${authCode}`, { x: 50, y: 50, font: helvetica, size: 10 });

    const pdfBytes = await pdfDoc.save();
    const filePath = `certificates/${userId}/${courseId}-${authCode}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('certificates')
      .upload(filePath, pdfBytes, { contentType: 'application/pdf', upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseAdmin.storage.from('certificates').getPublicUrl(filePath);
    
    const { error: dbError } = await supabaseAdmin.from('certificates').insert({
      user_id: userId,
      course_id: courseId,
      authentication_code: authCode,
      pdf_url: urlData.publicUrl,
    });

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ pdfUrl: urlData.publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});