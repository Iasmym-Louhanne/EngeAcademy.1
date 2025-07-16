"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  tags?: string[];
  featured?: boolean;
  thumbnail_url?: string; // Garantir que essa propriedade seja passada corretamente
}

export function CourseCard({
  id,
  title,
  slug,
  description,
  price,
  duration,
  tags = [],
  featured = false,
  thumbnail_url,
}: CourseCardProps) {
  const router = useRouter();

  // Função para redirecionar para o checkout
  const handleBuy = () => {
    router.push(`/checkout?course=${id}`);
  };

  return (
    <Card className={`h-full flex flex-col ${featured ? "border-primary/30 shadow-md" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
          {featured && (
            <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/30">
              Destaque
            </Badge>
          )}
        </div>

        {/* Adicionando a imagem do curso */}
        {thumbnail_url ? (
          <div className="relative h-48 w-full mb-2">
            <Image
              src={thumbnail_url}
              alt={title}
              layout="fill"
              className="object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="relative h-48 w-full mb-2">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              Sem Imagem
            </div>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="mr-1 h-4 w-4" />
          <span>{duration}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
        <div className="text-lg font-semibold mb-2 sm:mb-0 sm:mr-auto">R$ {price.toFixed(2)}</div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href={`/treinamento/${slug}`} className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Detalhes
            </Button>
          </Link>
          <Button className="flex-1 sm:flex-none" onClick={handleBuy}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Comprar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
