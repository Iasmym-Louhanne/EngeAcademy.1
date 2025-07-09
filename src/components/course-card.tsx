import Link from "next/link";
import Image from "next/image";
import { Course, CoursePackage } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type CourseCardProps = {
  item: Course | CoursePackage;
  type: 'course' | 'package';
};

export function CourseCard({ item, type }: CourseCardProps) {
  const isCourse = (item: any): item is Course => type === 'course';
  
  const displayPrice = `R$ ${item.price.toFixed(2).replace('.', ',')}`;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform hover:scale-105">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.imageUrl}
            alt={item.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          {isCourse(item) && <Badge variant="secondary">{item.category}</Badge>}
          {type === 'package' && <Badge variant="default">Pacote</Badge>}
          <span className="font-bold text-lg">{displayPrice}</span>
        </div>
        <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 mt-auto">
        <Link href={`/cursos/${item.slug}`} className="w-full">
          <Button className="w-full">
            Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}