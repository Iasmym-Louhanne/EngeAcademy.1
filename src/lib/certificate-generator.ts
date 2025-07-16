import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

interface GenerateCertificateParams {
  studentName: string;
  courseName: string;
  completionDate: string;
  courseId: string;
  userId?: string;
}

export async function generateCertificate({
  studentName,
  courseName,
  completionDate,
  courseId,
  userId,
}: GenerateCertificateParams): Promise<string> {
  try {
    // Criar um novo documento PDF (A4 paisagem)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Adicionar fundo
    doc.setFillColor(245, 245, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Adicionar borda
    doc.setDrawColor(0, 0, 150);
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');
    
    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(0, 0, 100);
    const title = 'CERTIFICADO DE CONCLUSÃO';
    const titleWidth = doc.getStringUnitWidth(title) * 30 / doc.internal.scaleFactor;
    doc.text(title, (pageWidth - titleWidth) / 2, 40);
    
    // Adicionar logo (simulado com um retângulo azul)
    doc.setFillColor(0, 80, 170);
    doc.rect(20, 20, 40, 15, 'F');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('EngeAcademy', 25, 28);
    
    // Texto principal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text('Certificamos que', pageWidth / 2, 80, { align: 'center' });
    
    // Nome do aluno
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 100, 150);
    doc.text(studentName, pageWidth / 2, 100, { align: 'center' });
    
    // Descrição do curso
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(
      `concluiu com sucesso o curso de ${courseName}, em ${completionDate}.`,
      pageWidth / 2,
      120,
      { align: 'center' }
    );
    
    // Assinatura (simulada com uma linha)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, 160, pageWidth / 2 + 40, 160);
    doc.setFontSize(12);
    doc.text('Diretor de Treinamento', pageWidth / 2, 170, { align: 'center' });
    
    // Código de autenticação
    const authCode = Math.random().toString(36).substring(2, 15);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Código de Autenticação: ${authCode}`, 15, pageHeight - 15);
    
    // Salvar certificado no banco de dados se userId for fornecido
    if (userId) {
      try {
        const { error } = await supabase
          .from('certificates')
          .insert({
            user_id: userId,
            course_id: courseId,
            authentication_code: authCode,
            pdf_url: null, // Por enquanto, não salvamos o PDF
          });
        
        if (error) {
          console.error('Erro ao salvar certificado no banco:', error);
        }
      } catch (dbError) {
        console.error('Erro de conexão com banco:', dbError);
        // Não falha a geração do PDF por causa de erro no banco
      }
    }
    
    // Salvar PDF e retornar como URL de dados
    const pdfOutput = doc.output('datauristring');
    
    console.log(`Certificado gerado para ${studentName} - Curso: ${courseId}`);
    
    return pdfOutput;
  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    toast.error('Erro ao gerar o certificado. Tente novamente.');
    throw error;
  }
}