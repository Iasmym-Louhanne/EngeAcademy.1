"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ScrollableTableProps {
  className?: string;
  children: React.ReactNode;
  maxHeight?: string | number;
  stickyHeader?: boolean;
}

export function ScrollableTable({ 
  className, 
  children, 
  maxHeight = "70vh",
  stickyHeader = true
}: ScrollableTableProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Verificar se o conteúdo está transbordando
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        setIsOverflowing(scrollHeight > clientHeight);
      }
    };
    
    checkOverflow();
    
    // Verificar novamente em caso de redimensionamento
    window.addEventListener("resize", checkOverflow);
    
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [children]);
  
  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative rounded-md border", 
        className
      )}
      style={{ maxHeight }}
    >
      <ScrollArea className="h-full w-full">
        <div className="w-full">
          <Table>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                // Aplicar estilos ao cabeçalho da tabela se stickyHeader for true
                if (child.type === TableHeader && stickyHeader) {
                  return React.cloneElement(child as React.ReactElement, {
                    className: cn(
                      "sticky top-0 z-10 bg-background",
                      child.props.className
                    ),
                  });
                }
                
                // Passar o resto dos elementos inalterados
                return child;
              }
              return child;
            })}
          </Table>
        </div>
      </ScrollArea>
      
      {/* Indicador de rolagem - mostrado apenas quando há conteúdo transbordando */}
      {isOverflowing && (
        <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M12 17V7" />
            <path d="m6 11 6 6 6-6" />
          </svg>
        </div>
      )}
    </div>
  );
}