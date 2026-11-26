import { useState } from 'react';
import { Car, Cpu, Film, Mountain, Plane, Play, Video } from 'lucide-react';
import type { AdProject } from '../types/portfolio';
import { AdCanvasRenderer } from './AdCanvasRenderer';

interface ProjectCardProps {
  project: AdProject;
  onPlay: (project: AdProject) => void;
}

function getCategoryIcon(category: AdProject['category']) {
  switch (category) {
    case 'business':
      return <Video className="w-4 h-4 text-violet-300 shrink-0" aria-hidden="true" />;
    case 'automotive':
      return <Car className="w-4 h-4 text-rose-300 shrink-0" aria-hidden="true" />;
    case 'travel':
      return <Plane className="w-4 h-4 text-cyan-300 shrink-0" aria-hidden="true" />;
    case 'lifestyle':
      return <Mountain className="w-4 h-4 text-emerald-300 shrink-0" aria-hidden="true" />;
    case 'ai-creative':
      return <Cpu className="w-4 h-4 text-fuchsia-300 shrink-0" aria-hidden="true" />;
    default:
      return <Film className="w-4 h-4 text-cyan-300 shrink-0" aria-hidden="true" />;
  }
}

export function ProjectCard({ project, onPlay }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onPlay(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Watch ${project.title} ad video`}
      className="group relative w-full text-left aspect-[16/10] rounded-xl overflow-hidden bg-[#0a0f25] border border-white/15 hover:border-cyan-400/60 transition-all duration-200 shadow-lg hover:shadow-[0_10px_32px_rgba(6,182,212,0.18)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      {/* Visual Thumbnail Canvas or Custom Video Preview */}
      {project.videoUrl ? (
        <video
          src={project.videoUrl}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <AdCanvasRenderer
          sceneKey={project.sceneKey}
          title={project.title}
          client={project.client}
          metrics={project.metrics}
          mode="thumbnail"
          isHovered={hovered}
          durationSec={project.durationSec}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Measured Scrim for Guaranteed Contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/15 group-hover:via-black/20 transition-colors duration-200"
      />

      {/* Centered Translucent Play Button */}
      <div className="absolute inset-0 flex items-center justify-center pb-5">
        <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-cyan-500 group-hover:border-transparent">
          <Play className="w-5 h-5 text-white fill-white ml-0.5" aria-hidden="true" />
        </span>
      </div>

      {/* Bottom Title & Unboxed Metadata */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {getCategoryIcon(project.category)}
            <h3 className="text-sm font-bold text-white truncate">{project.title}</h3>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-300 truncate">
            <span>{project.client}</span>
            <span aria-hidden="true" className="mx-1.5 text-slate-500">
              ·
            </span>
            <span className="font-mono tabular-nums">{project.durationSec}s</span>
          </p>
        </div>
        <span className="text-[11px] font-medium text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shrink-0">
          Watch Ad
        </span>
      </div>
    </button>
  );
}
