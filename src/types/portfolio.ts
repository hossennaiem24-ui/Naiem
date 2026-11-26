export type NavSectionId = 'home' | 'portfolio' | 'services' | 'about' | 'contact';

export type AdCategory =
  | 'all'
  | 'business'
  | 'automotive'
  | 'travel'
  | 'lifestyle'
  | 'ai-creative';

export type AdAspectRatio = '16:9' | '9:16' | '1:1';

export type AdSceneKey =
  | 'business-skyline'
  | 'car-action'
  | 'travel-aviation'
  | 'lifestyle-alpine'
  | 'ai-neural'
  | 'social-streetwear'
  | 'showreel'
  | 'custom';

export interface AdProject {
  id: string;
  title: string;
  category: Exclude<AdCategory, 'all'>;
  categoryLabel: string;
  client: string;
  durationSec: number;
  format: string;
  metrics: string;
  description: string;
  deliverables: string[];
  sceneKey: AdSceneKey;
  accentFrom: string;
  accentTo: string;
  videoUrl?: string;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  turnaround: string;
  iconKey: 'video' | 'megaphone' | 'cpu' | 'trending';
}
