export type FitMode = 'cover' | 'contain' | 'smart-crop';

export interface VideoItem {
  id: string; file: File; url: string; thumb?: string; duration?: number; width?: number; height?: number; status: string; outputUrl?: string; progress?: number;
}

export interface FrameTemplate {
  id: string; name: string; pngDataUrl: string;
  region: { x: number; y: number; width: number; height: number };
  transform: { scale: number; offsetX: number; offsetY: number };
}
