'use client';
import { useEffect, useMemo, useState } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { templateDB } from '@/lib/db';
import { useFFmpegProcessor } from '@/hooks/useFFmpegProcessor';
import { FrameTemplate, VideoItem } from '@/types';

const accept = ['video/mp4','video/quicktime','video/webm','video/x-m4v'];

export default function Page() {
  const st = useStudioStore();
  const { convert } = useFFmpegProcessor();
  const [status, setStatus] = useState('대기 중');

  useEffect(() => { templateDB.getAll().then(st.setTemplates); }, []);

  const selectedTemplate = useMemo(() => st.templates.find((t) => t.id === st.selectedTemplateId), [st.templates, st.selectedTemplateId]);

  const onUpload = async (files: FileList | null) => {
    if (!files) return;
    const arr = [...files].filter((f) => accept.includes(f.type));
    const items: VideoItem[] = arr.map((file) => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file), status: '업로드 완료', progress: 0 }));
    st.addVideos(items);
  };

  const addTemplate = async (file?: File) => {
    if (!file) return;
    const pngDataUrl = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(file); });
    const tmp: FrameTemplate = { id: crypto.randomUUID(), name: `프레임 ${st.templates.length + 1}`, pngDataUrl, region: { x: 0, y: 0, width: 1080, height: 1920 }, transform: { scale: 1, offsetX: 0, offsetY: 0 } };
    st.addTemplate(tmp); await templateDB.save(tmp);
  };

  const startConvert = async () => {
    for (let i = 0; i < st.videos.length; i++) {
      const v = st.videos[i];
      st.updateVideo(v.id, { status: '변환 중' });
      const out = await convert(v.file, i, setStatus, (p) => st.updateVideo(v.id, { progress: p }));
      st.updateVideo(v.id, { outputUrl: out.url, status: '완료', progress: 100 });
    }
    setStatus('완료');
  };

  return <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-black to-slate-950 text-white">
    <h1 className="text-2xl font-semibold mb-4">도파민저장소.zip 영상 자동 프레임 변환기</h1>
    <div className="grid md:grid-cols-[280px_1fr_340px] gap-4">
      <aside className="glass p-4 space-y-3"><h2>프레임 목록</h2><input type="file" accept="image/png" onChange={(e)=>addTemplate(e.target.files?.[0])} />
        <div className="space-y-2 max-h-[60vh] overflow-auto">{st.templates.map(t=><button key={t.id} onClick={()=>st.selectTemplate(t.id)} className={`w-full text-left p-2 rounded ${st.selectedTemplateId===t.id?'bg-accent':'bg-white/5'}`}>{t.name}</button>)}</div>
      </aside>
      <section className="glass p-4">
        <div className="border border-white/10 rounded-xl aspect-[9/16] max-h-[70vh] mx-auto bg-black/70 relative overflow-hidden">
          {st.videos[0] && <video src={st.videos[0].url} className="w-full h-full object-cover" controls />}
          {selectedTemplate && <img src={selectedTemplate.pngDataUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
          <div className="absolute top-4 inset-x-4 text-center font-bold">{st.topText}</div>
          <div className="absolute bottom-4 inset-x-4 text-center font-bold">{st.bottomText}</div>
        </div>
      </section>
      <aside className="glass p-4 space-y-3">
        <h2>세부 설정</h2>
        <input className="w-full bg-white/5 p-2 rounded" placeholder="상단 텍스트" value={st.topText} onChange={(e)=>st.setText({topText:e.target.value})} />
        <input className="w-full bg-white/5 p-2 rounded" placeholder="하단 텍스트" value={st.bottomText} onChange={(e)=>st.setText({bottomText:e.target.value})} />
        <select className="w-full bg-white/5 p-2 rounded" value={st.fitMode} onChange={(e)=>st.setFitMode(e.target.value as any)}><option value="cover">cover</option><option value="contain">contain</option><option value="smart-crop">smart crop</option></select>
        <label className="flex items-center gap-2"><input type="checkbox" checked={st.blurBg} onChange={(e)=>st.setBlurBg(e.target.checked)} /> 배경 블러 사용</label>
      </aside>
    </div>

    <div className="glass p-4 mt-4">
      <div className="flex flex-wrap items-center gap-3"><input type="file" multiple accept=".mp4,.mov,.webm,.m4v" onChange={(e)=>onUpload(e.target.files)} />
      <button className="px-4 py-2 bg-accent rounded" onClick={startConvert}>영상 변환 시작</button><span>{status}</span></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">{st.videos.map(v=><article key={v.id} className="bg-white/5 rounded-xl p-3">
        <video src={v.url} className="w-full h-32 object-cover rounded" />
        <p className="text-sm truncate mt-2">{v.file.name}</p>
        <p className="text-xs text-slate-300">{(v.file.size/1024/1024).toFixed(1)}MB · {v.status} · {v.progress ?? 0}%</p>
        {v.outputUrl && <a href={v.outputUrl} download className="text-accent text-sm">MP4 다운로드</a>}
        <button onClick={()=>st.removeVideo(v.id)} className="text-red-400 text-sm ml-3">삭제</button>
      </article>)}</div>
    </div>
  </main>;
}
