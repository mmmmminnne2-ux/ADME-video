import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '도파민저장소.zip 영상 자동 프레임 변환기',
  description: '쇼츠/릴스 제작용 프레임 자동 변환 툴'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko" className="dark"><body>{children}</body></html>;
}
