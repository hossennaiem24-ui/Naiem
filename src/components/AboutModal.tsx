import { ArrowRight, X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookProject: () => void;
}

const WORKFLOW_STEPS = [
  {
    step: '01. Hook & Script Strategy',
    detail: 'Audit the target audience and design a thumb-stopping first 1.5-second visual hook.',
  },
  {
    step: '02. Rhythm & Rough Cut',
    detail: 'Assemble tight, beat-synced storytelling with zero wasted frames for high retention.',
  },
  {
    step: '03. Motion, AI VFX & Sound',
    detail: 'Layer kinetic typography, AI-enhanced product scenes, SFX risers, and DaVinci color.',
  },
  {
    step: '04. Multi-Ratio Delivery',
    detail: 'Export master cuts in 16:9, 9:16 Reels/TikTok, and 1:1 feed formats ready to launch.',
  },
];

export function AboutModal({ isOpen, onClose, onBookProject }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#090d22] border border-white/15 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-xs font-medium text-cyan-400">Creative Director Profile</p>
            <h2 id="about-modal-title" className="text-lg font-bold text-white">
              About Rashedul & Production Workflow
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close about dialog"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src="/assets/rashedul-about.png"
              alt="Rashedul portrait"
              referrerPolicy="no-referrer"
              className="w-28 h-24 object-cover rounded-xl border border-white/15 shrink-0"
            />
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-base font-bold text-white">
                Video Editor · Social Media Ads Specialist · AI Creative
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Based in Dhaka, Bangladesh, I partner with e-commerce brands, startups, and global
                agencies to turn raw footage and product concepts into high-ROAS commercial video ads.
              </p>
              <p className="text-xs text-slate-400">
                Premiere Pro · After Effects · DaVinci Resolve · Runway · Midjourney · ElevenLabs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
            {WORKFLOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-xl bg-[#050714] border border-white/10 space-y-1"
              >
                <h4 className="text-sm font-semibold text-white">{item.step}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-white/15 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookProject();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer"
            >
              <span>Start a Campaign</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
