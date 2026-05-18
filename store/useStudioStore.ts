'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FitMode, FrameTemplate, VideoItem } from '@/types';

interface State {
  videos: VideoItem[];
  templates: FrameTemplate[];
  selectedTemplateId?: string;
  fitMode: FitMode;
  blurBg: boolean;
  topText: string;
  bottomText: string;
  addVideos: (v: VideoItem[]) => void;
  removeVideo: (id: string) => void;
  updateVideo: (id: string, patch: Partial<VideoItem>) => void;
  setTemplates: (t: FrameTemplate[]) => void;
  addTemplate: (t: FrameTemplate) => void;
  selectTemplate: (id: string) => void;
  setFitMode: (m: FitMode) => void;
  setBlurBg: (v: boolean) => void;
  setText: (p: Partial<Pick<State, 'topText' | 'bottomText'>>) => void;
}

export const useStudioStore = create<State>()(persist((set) => ({
  videos: [], templates: [], fitMode: 'cover', blurBg: false, topText: '', bottomText: '',
  addVideos: (videos) => set((s) => ({ videos: [...s.videos, ...videos] })),
  removeVideo: (id) => set((s) => ({ videos: s.videos.filter((v) => v.id !== id) })),
  updateVideo: (id, patch) => set((s) => ({ videos: s.videos.map((v) => v.id === id ? { ...v, ...patch } : v) })),
  setTemplates: (templates) => set({ templates }),
  addTemplate: (t) => set((s) => ({ templates: [...s.templates, t], selectedTemplateId: t.id })),
  selectTemplate: (id) => set({ selectedTemplateId: id }),
  setFitMode: (fitMode) => set({ fitMode }), setBlurBg: (blurBg) => set({ blurBg }),
  setText: (p) => set(p)
}), { name: 'dopamine-studio-ui' }));
