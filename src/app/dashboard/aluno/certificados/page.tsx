"use client";

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { CertificateCard } from "@/components/dashboard/aluno/certificate-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { certificates, courses, employees } from "@/lib/mock-data";
import { Award } from "lucide-react";

export default function CertificadosPage() {
  // Simular que o usuário logado é o primeiro da lista
  const currentUser = employees[0];
  
  // Filtrar certificados do usuário
  const userCertificates = certificates
    .filter(cert => cert.employeeId === currentUser.id)
    .map(cert => {
      const courseDetails = courses.find(c => c.id === cert.courseId);
      return {
        ...cert,
        courseName: courseDetails?.title || "Curso não encontrado"
      };
    });

  return (
    <DashboardLayout userType="aluno">
      <div className="grid gap-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Award className="mr-2 h-6 w-6 text-primary" />
            Meus Certificados
          </h2>
        </div>

        {userCertificates.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Sem certificados</CardTitle>
              <CardDescription>
                Você ainda não possui certificados. Complete os cursos para receber seus certificados.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                id={cert.id}
                courseName={cert.courseName}
                issueDate={cert.issueDate}
                expiryDate={cert.expiryDate}
                authCode={cert.authCode}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}