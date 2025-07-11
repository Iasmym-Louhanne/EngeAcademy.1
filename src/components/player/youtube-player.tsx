"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface YouTubePlayerProps {
  videoId: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  onVideoEnd?: () => void;
  onVideoProgress?: (seconds: number, percent: number) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function YouTubePlayer({
  videoId,
  width = "100%",
  height = "100%",
  autoplay = false,
  onVideoEnd,
  onVideoProgress,
}: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [progressInterval, setProgressIntervalRef] = useState<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carregar a API do YouTube
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = initializePlayer;

    // Verificar se a API já está carregada
    if (window.YT && window.YT.Player) {
      initializePlayer();
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (playerRef.current && window.YT && window.YT.Player) {
      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0, // Desativar controles nativos
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handlePlayerStateChange,
        },
      });
    }
  };

  const handlePlayerReady = (event: any) => {
    setPlayerReady(true);
    setDuration(playerInstanceRef.current.getDuration());
    
    // Iniciar monitoramento de progresso
    const interval = setInterval(() => {
      if (playerInstanceRef.current && playing) {
        const currentTime = playerInstanceRef.current.getCurrentTime();
        const duration = playerInstanceRef.current.getDuration();
        const percent = (currentTime / duration) * 100;
        
        setCurrentTime(currentTime);
        
        if (onVideoProgress) {
          onVideoProgress(currentTime, percent);
        }
      }
    }, 1000);
    
    setProgressIntervalRef(interval);
  };

  const handlePlayerStateChange = (event: any) => {
    // YT.PlayerState.ENDED = 0
    if (event.data === 0) {
      setPlaying(false);
      if (onVideoEnd) {
        onVideoEnd();
      }
    }
    
    // YT.PlayerState.PLAYING = 1
    if (event.data === 1) {
      setPlaying(true);
    }
    
    // YT.PlayerState.PAUSED = 2
    if (event.data === 2) {
      setPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!playerInstanceRef.current) return;
    
    if (playing) {
      playerInstanceRef.current.pauseVideo();
    } else {
      playerInstanceRef.current.playVideo();
    }
    
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!playerInstanceRef.current) return;
    
    if (muted) {
      playerInstanceRef.current.unMute();
      playerInstanceRef.current.setVolume(volume);
    } else {
      playerInstanceRef.current.mute();
    }
    
    setMuted(!muted);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!playerInstanceRef.current) return;
    
    const newVolume = value[0];
    playerInstanceRef.current.setVolume(newVolume);
    setVolume(newVolume);
    
    if (muted && newVolume > 0) {
      playerInstanceRef.current.unMute();
      setMuted(false);
    }
  };

  const handleSeek = (value: number[]) => {
    if (!playerInstanceRef.current) return;
    
    const seekTime = (value[0] / 100) * duration;
    playerInstanceRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(document.fullscreenElement !== null);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Formatar tempo (segundos para MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-black rounded-md", 
        fullscreen ? "w-screen h-screen" : ""
      )}
      style={{ width, height }}
    >
      {/* Camada do player */}
      <div className="w-full h-full">
        <div ref={playerRef} className="w-full h-full" />
      </div>
      
      {/* Controles personalizados - mostrar quando o player estiver pronto */}
      {playerReady && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Barra de progresso */}
          <div className="mb-2">
            <Slider
              value={[currentTime ? (currentTime / duration) * 100 : 0]}
              min={0}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="h-1"
            />
          </div>
          
          {/* Controles e tempo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                  value={[muted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20 h-1"
                />
              </div>
              
              <div className="text-xs text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}