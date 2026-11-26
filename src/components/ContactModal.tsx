import { useEffect, useState } from 'react';
import { CheckCircle2, Send, X } from 'lucide-react';
import { SERVICES_LIST } from '../data/portfolioData';

interface ContactModalProps {
  isOpen: boolean;
  initialService?: string;
  initialContext?: string;
  onClose: () => void;
}

export function ContactModal({
  isOpen,
  initialService = 'Video Editing',
  initialContext = '',
  onClose,
}: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(initialService);
  const [budget, setBudget] = useState('$300 – $800');
  const [message, setMessage] = useState(initialContext);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setService(initialService);
      if (initialContext) setMessage(initialContext);
      setSubmitted(false);
    }
  }, [isOpen, initialService, initialContext]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#090d22] border border-white/15 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-xs font-medium text-cyan-400">Start a Project</p>
            <h2 id="contact-modal-title" className="text-lg font-bold text-white">
              Work With Rashedul
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry modal"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thanks, {name}. Your brief for <span className="text-cyan-300 font-medium">{service}</span> has been
              prepared. Rashedul typically replies within 4 hours from Dhaka (GMT+6).
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:rashedul@email.com?subject=${encodeURIComponent(
                  `Project Brief: ${service} (${budget})`
                )}&body=${encodeURIComponent(`Hi Rashedul,\n\nName: ${name}\nEmail: ${email}\n\n${message}`)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-semibold text-white"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in Email App</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-white/15 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rahman"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@brand.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="contact-service" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Service Needed
                </label>
                <select
                  id="contact-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  {SERVICES_LIST.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-budget" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Estimated Budget
                </label>
                <select
                  id="contact-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="$150 – $300">$150 – $300</option>
                  <option value="$300 – $800">$300 – $800</option>
                  <option value="$800 – $2,000">$800 – $2,000</option>
                  <option value="$2,000+ Monthly Retainer">$2,000+ Monthly Retainer</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-brief" className="block text-xs font-medium text-slate-300 mb-1.5">
                Project Brief & Video Goal
              </label>
              <textarea
                id="contact-brief"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your product, target platform (Reels, TikTok, YouTube Ads), and timeline..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#050714] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-white/15 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
