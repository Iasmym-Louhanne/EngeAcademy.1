"use client";

import YouTube from 'react-youtube';
import { toast } from "sonner";

type VideoPlayerProps = {
  videoId: string;
  onVideoEnd: () => void;
};

export function VideoPlayer({ videoId, onVideoEnd }: VideoPlayerProps) {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0, // Não mostrar vídeos relacionados
      showinfo: 0, // Ocultar título do vídeo
      modestbranding: 1, // Logo do YouTube menos intrusivo
      disablekb: 1, // Desabilitar controles de teclado
      fs: 1, // Habilitar fullscreen
    },
  };

  const handleEnd = () => {
    toast.success("Aula concluída! Marcando seu progresso.");
    onVideoEnd();
  };

  return (
    <div className="aspect-video w-full bg-black">
      <YouTube
        videoId={videoId}
        opts={opts}
        onEnd={handleEnd}
        className="w-full h-full"
      />
    </div>
  );
}