# 도파민저장소.zip 영상 자동 프레임 변환기

Next.js + Tailwind + ffmpeg.wasm 기반 브라우저 내 쇼츠/릴스 변환 도구입니다.

## 실행

```bash
npm install
npm run dev
```

## 핵심 구현

- 다중 영상 업로드 카드
- 프레임 PNG 템플릿 저장(IndexedDB)
- 9:16 (1080x1920) MP4 변환(H264)
- 실시간 프리뷰(텍스트/프레임 합성)
- Zustand 상태 관리 + localStorage 영속
