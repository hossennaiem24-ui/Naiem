import { useState } from 'react';
import { Film, Upload, X } from 'lucide-react';
import type { AdCategory, AdProject } from '../types/portfolio';

interface UploadAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: AdProject) => void;
}

export function UploadAdModal({ isOpen, onClose, onAddProject }: UploadAdModalProps) {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState<Exclude<AdCategory, 'all'>>('business');
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid MP4, WebM, or MOV video file.');
      return;
    }
    setError('');
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    setFileName(file.name);
    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a project title.');
      return;
    }
    if (!videoUrl.trim()) {
      setError('Please upload a video file or provide a direct MP4/WebM URL.');
      return;
    }

    const categoryLabels: Record<Exclude<AdCategory, 'all'>, string> = {
      business: 'Corporate Ad',
      automotive: 'Automotive Spot',
      travel: 'Travel & Aviation',
      lifestyle: 'Social Media Ad',
      'ai-creative': 'AI Creative Ad',
    };

    const newProject: AdProject = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category],
      client: client.trim() || 'Client Campaign',
      durationSec: 30,
      format: 'Custom Video Ad',
      metrics: 'Ready to Watch',
      description: 'Uploaded commercial ad video added directly to Rashedul’s showcase.',
      deliverables: ['Custom Video Upload', 'Cinema Player Ready'],
      sceneKey: 'custom',
      accentFrom: '#8b5cf6',
      accentTo: '#06b6d4',
      videoUrl: videoUrl.trim(),
      featured: true,
    };

    onAddProject(newProject);
    setTitle('');
    setClient('');
    setVideoUrl('');
    setFileName('');
    setError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-ad-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#090d22] border border-white/15 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-cyan-400" />
            <h2 id="upload-ad-title" className="text-lg font-bold text-white">
              Add Video Ad to Showcase
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close upload dialog"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Upload Local Video File (MP4 / WebM / MOV)
            </label>
            <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border border-dashed border-violet-400/40 bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer text-center">
              <Upload className="w-6 h-6 text-cyan-400" />
              <span className="text-sm font-medium text-white">
                {fileName ? fileName : 'Choose video file from your device'}
              </span>
              <span className="text-xs text-slate-400">Plays instantly inside the portfolio viewer</span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          <div>
            <label htmlFor="video-url-input" className="block text-xs font-medium text-slate-300 mb-1.5">
              Or Paste Direct Video URL (.mp4 / .webm)
            </label>
            <input
              id="video-url-input"
              type="url"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setFileName('');
              }}
              placeholder="https://example.com/ad-commercial.mp4"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="ad-title-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                Ad Title
              </label>
              <input
                id="ad-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Launch Reel"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="ad-category-select" className="block text-xs font-medium text-slate-300 mb-1.5">
                Category
              </label>
              <select
                id="ad-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<AdCategory, 'all'>)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="business">Business Ads</option>
                <option value="automotive">Car Action</option>
                <option value="travel">Travel & Aviation</option>
                <option value="lifestyle">Lifestyle & Social</option>
                <option value="ai-creative">AI Creative</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ad-client-input" className="block text-xs font-medium text-slate-300 mb-1.5">
              Brand / Client Name (optional)
            </label>
            <input
              id="ad-client-input"
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Acme Studio"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-rose-400">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-white/15 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer"
            >
              Add & Watch Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
