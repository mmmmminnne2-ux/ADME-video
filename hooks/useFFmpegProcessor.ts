'use client';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
export const useFFmpegProcessor = () => {
  const ensure = async (setStatus: (s: string) => void) => {
    if (ffmpeg) return ffmpeg;
    setStatus('ffmpeg 로딩 중...');
    ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
      wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    return ffmpeg;
  };

  const convert = async (file: File, idx: number, setStatus: (s: string) => void, onProgress: (p: number) => void) => {
    const ff = await ensure(setStatus);
    ff.on('progress', ({ progress }) => onProgress(Math.round(progress * 100)));
    const inName = `input-${idx}.mp4`; const outName = `도파민저장소_${String(idx + 1).padStart(3, '0')}.mp4`;
    await ff.writeFile(inName, await fetchFile(file));
    setStatus('인코딩 중...');
    await ff.exec(['-i', inName, '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920', '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', outName]);
    const data = await ff.readFile(outName) as Uint8Array;
    return { name: outName, url: URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })) };
  };

  return { convert };
};
