import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Play } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  progress: number;
  duration: string;
  completed: boolean;
}

export function CourseCard({ id, title, slug, progress, duration, completed }: CourseCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {completed ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
              Concluído
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
              Em andamento
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{duration}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/treinamento/${slug}`} className="w-full">
          <Button className="w-full">
            <Play className="mr-2 h-4 w-4" />
            {completed ? "Revisar curso" : "Continuar curso"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}