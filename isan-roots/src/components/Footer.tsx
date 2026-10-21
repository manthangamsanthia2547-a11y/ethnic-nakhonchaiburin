import { useState } from 'react';
import { Share2, ArrowUp, Facebook, Instagram, Youtube } from 'lucide-react';
import { image } from './ui';

export interface SocialLink { platform: 'facebook' | 'instagram' | 'youtube'; url: string; }
// Populate only with verified project accounts.
export default function Footer({ socialLinks = [] }: { socialLinks?: SocialLink[] }) {
  const [message, setMessage] = useState('');
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: 'ชาติพันธุ์นครชัยบุรินทร์', url: location.href });
      else { await navigator.clipboard.writeText(location.href); setMessage('คัดลอกลิงก์แล้ว'); }
    } catch { setMessage('แชร์ลิงก์ได้จากแถบที่อยู่ของเบราว์เซอร์'); }
  }
  return <footer className="mh-footer"><div className="mh-shell">
    <div className="mh-footer-top"><a href="#home" className="mh-footer-brand"><img src={image('logo.png')} alt="" width="56" height="56"/><span>ชาติพันธุ์นครชัยบุรินทร์<small>Ethnic of Nakhon Chai Bu Rin</small></span></a><p>สืบค้นเรื่องราว<br/>สานต่อความเข้าใจ</p><nav aria-label="เมนูท้ายหน้า"><a href="#ethnic">ชาติพันธุ์</a><a href="#food">อาหารพื้นถิ่น</a><a href="#activities">กิจกรรม</a><a href="#archive">คลังข้อมูล</a></nav></div>
    <div className="ref-footer-social"><span>นครราชสีมา · บุรีรัมย์ · สุรินทร์ · ชัยภูมิ</span><div>{socialLinks.filter(link => /^https:\/\//.test(link.url)).map(link => { const Icon = { facebook: Facebook, instagram: Instagram, youtube: Youtube }[link.platform]; return <a href={link.url} key={link.platform} target="_blank" rel="noreferrer" aria-label={link.platform}><Icon size={20}/></a>; })}<button type="button" onClick={share}><Share2 size={18} aria-hidden="true"/> แชร์เรื่องราว</button><span role="status">{message}</span></div></div>
    <div className="ref-footer-ornament" aria-hidden="true"><span/><svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="m16 2 14 14-14 14L2 16Z M16 8l8 8-8 8-8-8Z M16 0v8m16 8h-8M16 32v-8M0 16h8"/></svg><span/></div>
    <div className="mh-footer-bottom"><span>© {new Date().getFullYear()} ชาติพันธุ์นครชัยบุรินทร์</span><span>ข้อมูลสาธิตเพื่อการเรียนรู้ · แหล่งอ้างอิงในหน้ารายละเอียด</span><a href="#home" onClick={event => { if (!location.hash || location.hash === '#home') { event.preventDefault(); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); document.querySelector<HTMLAnchorElement>('.heritage-brand')?.focus({preventScroll:true}); } }}>กลับด้านบน <ArrowUp size={16}/></a></div>
  </div></footer>;
}
