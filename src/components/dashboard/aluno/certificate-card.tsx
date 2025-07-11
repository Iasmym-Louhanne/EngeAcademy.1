import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface CertificateCardProps {
  id: string;
  courseName: string;
  issueDate: string;
  expiryDate: string;
  authCode: string;
}

export function CertificateCard({ id, courseName, issueDate, expiryDate, authCode }: CertificateCardProps) {
  const handleDownload = () => {
    // Em uma implementação real, isso iria fazer download do PDF
    toast.success("Baixando certificado...");
  };

  const handleView = () => {
    // Em uma implementação real, isso abriria o PDF em uma nova aba
    toast.success("Abrindo certificado...");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" />
          {courseName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            <span className="text-muted-foreground">Emitido em:</span> {issueDate}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            <span className="text-muted-foreground">Válido até:</span> {expiryDate}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Código:</span> {authCode}
        </div>
      </CardContent>
      <CardFooter className="gap-2 flex">
        <Button variant="outline" className="flex-1" onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Visualizar
        </Button>
        <Button className="flex-1" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Baixar
        </Button>
      </CardFooter>
    </Card>
  );
}