import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { AdAspectRatio, AdProject } from '../types/portfolio';
import { adAudioEngine } from '../utils/adAudioEngine';
import { AdCanvasRenderer } from './AdCanvasRenderer';

interface VideoPlayerModalProps {
  project: AdProject | null;
  playlist: AdProject[];
  onClose: () => void;
  onSelectProject: (project: AdProject) => void;
  onBookSimilar: (project: AdProject) => void;
}

function formatTimecode(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function VideoPlayerModal({
  project,
  playlist,
  onClose,
  onSelectProject,
  onBookSimilar,
}: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [aspectRatio, setAspectRatio] = useState<AdAspectRatio>('16:9');
  const [currentTime, setCurrentTime] = useState(0);
  const [nativeDuration, setNativeDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalDuration = project?.videoUrl && nativeDuration ? nativeDuration : project?.durationSec ?? 20;

  // Reset playback state when switching project
  useEffect(() => {
    if (!project) {
      adAudioEngine.stop();
      return;
    }
    setCurrentTime(0);
    setNativeDuration(null);
    setIsPlaying(true);
    setAspectRatio(project.format.includes('9:16') ? '9:16' : '16:9');

    if (!project.videoUrl) {
      adAudioEngine.start(project.sceneKey, isMuted);
    } else {
      adAudioEngine.stop();
    }

    return () => {
      adAudioEngine.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  // Sync Web Audio Engine mute & play state for canvas ads
  useEffect(() => {
    if (!project || project.videoUrl) return;
    if (isPlaying) {
      adAudioEngine.start(project.sceneKey, isMuted);
    } else {
      adAudioEngine.stop();
    }
  }, [isPlaying, isMuted, project]);

  // Sync native <video> element playback
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !project?.videoUrl) return;
    vid.muted = isMuted;
    vid.playbackRate = speed;
    if (isPlaying) {
      void vid.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      vid.pause();
    }
  }, [isPlaying, isMuted, speed, project?.videoUrl]);

  // Advance timer for procedural canvas ads
  useEffect(() => {
    if (!project || project.videoUrl || !isPlaying) return;
    let rafId = 0;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = ((now - lastTs) / 1000) * speed;
      lastTs = now;
      setCurrentTime((prev) => {
        const next = prev + dt;
        if (next >= totalDuration) {
          return 0; // loop smoothly like an ad preview
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [project, isPlaying, speed, totalDuration]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && (e.target as HTMLElement)?.tagName !== 'BUTTON') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const currentIdx = playlist.findIndex((item) => item.id === project.id);
  const hasPlaylist = playlist.length > 1 && currentIdx !== -1;

  const handlePrev = () => {
    if (!hasPlaylist) return;
    const prevIdx = (currentIdx - 1 + playlist.length) % playlist.length;
    onSelectProject(playlist[prevIdx]);
  };

  const handleNext = () => {
    if (!hasPlaylist) return;
    const nextIdx = (currentIdx + 1) % playlist.length;
    onSelectProject(playlist[nextIdx]);
  };

  const handleSeek = (nextSec: number) => {
    setCurrentTime(nextSec);
    if (videoRef.current && project.videoUrl) {
      videoRef.current.currentTime = nextSec;
    }
  };

  const handleReplay = () => {
    handleSeek(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!project.videoUrl) {
      adAudioEngine.setMuted(nextMuted);
    }
  };

  const progressPct = totalDuration > 0 ? Math.min(100, (currentTime / totalDuration) * 100) : 0;

  const aspectClass =
    aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[420px] mx-auto'
      : aspectRatio === '1:1'
        ? 'aspect-square max-h-[420px] mx-auto'
        : 'aspect-video w-full';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#090d22] border border-white/15 shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-medium">{project.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{project.client}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{formatTimecode(totalDuration)}</span>
            </div>
            <h2 id="video-modal-title" className="text-lg sm:text-xl font-bold text-white truncate">
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Aspect Ratio Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              {(['16:9', '9:16', '1:1'] as AdAspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    aspectRatio === ratio
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close video player"
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Split: Video Stage + Campaign Brief */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Video Stage */}
          <div className="lg:col-span-8 p-4 sm:p-6 bg-[#050714] flex flex-col justify-between gap-4">
            <div className="relative w-full min-h-[260px] sm:min-h-[380px] flex items-center justify-center rounded-xl overflow-hidden bg-black border border-white/10">
              <div className={`relative w-full overflow-hidden transition-all duration-200 ${aspectClass}`}>
                {project.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={project.videoUrl}
                    playsInline
                    loop
                    onLoadedMetadata={(e) => setNativeDuration(e.currentTarget.duration)}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AdCanvasRenderer
                    sceneKey={project.sceneKey}
                    title={project.title}
                    client={project.client}
                    metrics={project.metrics}
                    mode="player"
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    durationSec={totalDuration}
                  />
                )}

                {/* Center Play Overlay when Paused */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    aria-label="Resume video playback"
                    className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/25 transition-colors cursor-pointer"
                  >
                    <span className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Playback Controls Bar */}
            <div className="space-y-2.5">
              {/* Scrubber */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-300 tabular-nums w-11">
                  {formatTimecode(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={totalDuration}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  aria-label="Seek video timeline"
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/15 accent-cyan-400"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #22d3ee ${progressPct}%, rgba(255,255,255,0.14) ${progressPct}%)`,
                  }}
                />
                <span className="font-mono text-xs text-slate-400 tabular-nums w-11 text-right">
                  {formatTimecode(totalDuration)}
                </span>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReplay}
                    aria-label="Replay from start"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      !isMuted
                        ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Playback speed */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
                    {([1, 1.25, 1.5] as const).map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setSpeed(rate)}
                        className={`px-2 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                          speed === rate
                            ? 'bg-white/15 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  {hasPlaylist && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous ad video"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next ad video"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Campaign Specs & Playlist */}
          <div className="lg:col-span-4 p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between gap-6 bg-[#0b1026]">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">
                  Campaign Overview
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <div>
                  <span className="block text-xs text-slate-400">Result</span>
                  <span className="text-sm font-semibold text-white">{project.metrics}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Delivery Format</span>
                  <span className="text-sm font-semibold text-white">{project.format}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-2">Scope & Deliverables</p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {project.deliverables.join(' · ')}
                </p>
              </div>

              {hasPlaylist && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-xs font-medium text-slate-400">Watch Next in Portfolio</p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {playlist.map((item) => {
                      const active = item.id === project.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectProject(item)}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            active
                              ? 'bg-violet-600/20 border-violet-400/50 text-white'
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="truncate font-medium">{item.title}</span>
                          <span className="font-mono text-[11px] text-slate-400 shrink-0 tabular-nums">
                            {formatTimecode(item.durationSec)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onBookSimilar(project)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Order Similar Ad Video</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
