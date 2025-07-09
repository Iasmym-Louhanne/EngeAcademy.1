import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
// PDF-LIB é uma biblioteca poderosa para criar e modificar PDFs.
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';
import { corsHeaders } from '../_shared/cors.ts';

// Função para carregar uma imagem de uma URL
async function fetchImage(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  return await response.arrayBuffer();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    // 1. Validação: Verificar se o usuário realmente concluiu o curso (lógica a ser implementada)
    // Ex: const { data: attempt, error } = await supabaseAdmin.from('quiz_attempts').select('*').eq('user_id', userId).eq('course_id', courseId).eq('passed', true).single();
    // if (error || !attempt) throw new Error("Usuário não concluiu o curso.");

    // 2. Buscar dados para o certificado
    const { data: userData, error: userError } = await supabaseAdmin.from('users').select('raw_user_meta_data').eq('id', userId).single();
    if (userError) throw userError;
    const studentName = userData.raw_user_meta_data?.full_name || 'Aluno Sem Nome';

    // Mock de dados do curso por enquanto
    const courseName = "NR 35 - Trabalho em Altura";
    const completionDate = new Date().toLocaleDateString('pt-BR');

    // 3. Criar o documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([841.89, 595.28]); // Formato A4 paisagem
    const { width, height } = page.getSize();

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Carregar logo da EngeAcademy (substituir pela URL real)
    const engeacademyLogoUrl = 'https://i.imgur.com/Y8vC5h4.png'; // URL de exemplo
    const engeacademyLogoBytes = await fetchImage(engeacademyLogoUrl);
    const engeacademyLogo = await pdfDoc.embedPng(engeacademyLogoBytes);
    page.drawImage(engeacademyLogo, { x: 50, y: height - 100, width: 150 });

    // Título
    page.drawText('CERTIFICADO DE CONCLUSÃO', {
      x: width / 2 - 200,
      y: height - 150,
      font: helveticaBold,
      size: 30,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Corpo do texto
    const text = `Certificamos que`;
    const studentText = `${studentName}`;
    const conclusionText = `concluiu com sucesso o curso de ${courseName}, em ${completionDate}.`;

    page.drawText(text, { x: 150, y: height / 2 + 50, font: helvetica, size: 20 });
    page.drawText(studentText, { x: width / 2 - (studentName.length * 12) / 2, y: height / 2, font: helveticaBold, size: 24, color: rgb(0.2, 0.5, 0.8) });
    page.drawText(conclusionText, { x: 150, y: height / 2 - 50, font: helvetica, size: 20 });

    // Código de autenticação
    const authCode = crypto.randomUUID();
    page.drawText(`Código de Autenticação: ${authCode}`, { x: 50, y: 50, font: helvetica, size: 10 });

    // 4. Salvar o PDF no Supabase Storage
    const pdfBytes = await pdfDoc.save();
    const filePath = `certificates/${userId}/${courseId}-${authCode}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('certificates')
      .upload(filePath, pdfBytes, { contentType: 'application/pdf', upsert: true });

    if (uploadError) throw uploadError;

    // 5. Obter a URL pública e salvar na tabela de certificados
    const { data: urlData } = supabaseAdmin.storage.from('certificates').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabaseAdmin.from('certificates').insert({
      user_id: userId,
      course_id: courseId,
      authentication_code: authCode,
      pdf_url: publicUrl,
    });

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ pdfUrl: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});