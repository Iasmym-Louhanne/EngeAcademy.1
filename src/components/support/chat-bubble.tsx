"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, X, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Iniciar chat
  const startChat = () => {
    setIsConnecting(true);
    
    // Simular conexão com agente
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Adicionar mensagem do agente
      setMessages([
        {
          id: Date.now().toString(),
          text: "Olá! Sou Ana, sua assistente virtual. Como posso ajudar você hoje?",
          sender: "agent",
          timestamp: new Date()
        }
      ]);
    }, 2000);
  };
  
  // Enviar mensagem
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    // Simular resposta do agente após 1 segundo
    setTimeout(() => {
      const responses = [
        "Entendi! Vou verificar isso para você.",
        "Posso ajudar com mais alguma coisa?",
        "Para resolver isso, sugiro que você tente acessar a seção de certificados no seu painel.",
        "Essa é uma ótima pergunta! Deixe-me consultar e já te respondo.",
        "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const agentMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: "agent",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };
  
  // Formatar horário
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Fechar chat
  const closeChat = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsConnected(false);
      setMessages([]);
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-10 duration-300">
          <CardHeader className="bg-primary text-primary-foreground py-3 rounded-t-lg flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/support-agent.png" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <CardTitle className="text-base">Suporte EngeAcademy</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={closeChat} className="text-primary-foreground">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-3 h-80 overflow-y-auto flex flex-col gap-3">
            {!isConnected && !isConnecting && (
              <div className="text-center py-8 flex-1 flex flex-col justify-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Chat de Suporte</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Converse com um de nossos atendentes para tirar suas dúvidas.
                </p>
                <Button onClick={startChat}>
                  Iniciar Chat
                </Button>
              </div>
            )}
            
            {isConnecting && (
              <div className="text-center py-8 flex-1 flex flex-col justify-center">
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
                <h3 className="font-medium mb-2">Conectando...</h3>
                <p className="text-sm text-muted-foreground">
                  Estamos conectando você a um atendente. Isso pode levar alguns instantes.
                </p>
              </div>
            )}
            
            {isConnected && (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user'
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
          
          {isConnected && (
            <CardFooter className="border-t p-3">
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                <Button size="icon" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      ) : (
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg transition-all hover:scale-110"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}