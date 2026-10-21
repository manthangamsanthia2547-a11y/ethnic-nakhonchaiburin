import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, ArrowRight, MapPin, BookOpen, Camera, Leaf } from 'lucide-react';
import type { HeritageGroup, HeritageFood } from '../types';

interface EthnicDetailPageProps {
  group: HeritageGroup;
  foods: HeritageFood[];
  groups: HeritageGroup[];
  record: Record<string, string>;
}

const image = (name: string) => `assets/images/${name}`;
const missing = 'รอการบันทึกข้อมูลจากชุมชน';
const sections = [
  ['history', 'ประวัติความเป็นมา'], ['basic', 'รู้จักชุมชน'], ['life', 'วิถีชีวิต'],
  ['food-story', 'วัฒนธรรมอาหาร'], ['gallery', 'ภาพและเรื่องราว'], ['sources', 'แหล่งข้อมูล'],
] as const;

function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n+/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</>;
}

function safeSourceUrl(value: string) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined; }
  catch { return undefined; }
}

export default function EthnicDetailPage({ group, foods, groups, record }: EthnicDetailPageProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('history');
  const value = (key: string, fallback?: string) => {
    const text = Object.prototype.hasOwnProperty.call(record, key) ? record[key] : fallback;
    return text?.trim() && !text.trim().startsWith('รอ') ? text.trim() : missing;
  };
  const name = value('1.1 ชื่อกลุ่มชาติพันธุ์', group.name);
  const province = value('1.4 จังหวัด', group.province);
  const village = value('หมู่บ้าน / สถานที่ตั้ง', group.location.village);
  const district = value('อำเภอ', group.location.district);
  const subdistrict = value('ตำบล / ชุมชน', group.location.subdistrict);
  const location = [village, subdistrict !== missing ? `ตำบล${subdistrict}` : '', district !== missing ? `อำเภอ${district}` : '', province !== missing ? `จังหวัด${province}` : ''].filter(v => v && v !== missing).join(' ');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  const relatedFoods = foods.filter(food => food.group === group.id);
  const storyImage = group.id === 'nyahkur' ? 'hero_isan_heritage_1790134382342.jpg' : 'archival_village_1790134516945.jpg';
  const index = Math.max(groups.findIndex(item => item.id === group.id), 0) + 1;
  const surveyFields = ['รายชื่อผู้ให้ข้อมูล', 'วันที่สำรวจ', 'ผู้รับผิดชอบ (PIC)', 'งาน / โครงการ', 'พิกัดละติจูด', 'พิกัดลองจิจูด', 'การเดินทาง', 'ภาพบ้านเรือน / เครื่องแต่งกาย / งานประเพณี', 'ภาพวัตถุดิบ / เมนู / ผลิตภัณฑ์', 'ลิงก์คลิป / บันทึกเสียง / เอกสาร', 'VDO บรรยากาศในโครงการ', 'โน้ตเพิ่มเติม'];
  const originalSources = group.sources ?? [];
  const originalSourceText = originalSources.map(source => `${source.title}\n${source.url}`).join('\n\n');
  const savedSources = record['แหล่งข้อมูล']?.trim();

  useEffect(() => {
    setActiveSection('history');
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: '-22% 0px -52% 0px', threshold: 0 });
    articleRef.current?.querySelectorAll<HTMLElement>('[data-detail-section]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [group.id]);

  const navigateSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = articleRef.current?.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    setActiveSection(id);
    window.history.replaceState(null, '', `#ethnic/${group.id}/${id}`);
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  };

  return <article className="museum-detail" ref={articleRef}>
    <header className="md-hero">
      <img className="md-hero-landscape" src={image('hero_isan_heritage_1790134382342.jpg')} alt="" />
      <img className="md-hero-portrait" src={image(group.image)} alt={`ภาพประกอบเรื่องราว${group.name}`} fetchPriority="high" />
      <div className="md-hero-overlay" />
      <div className="mh-shell md-hero-content">

        <p className="md-kicker">CULTURAL STORIES <span /> 0{index} / 04</p>
        <p className="md-hero-province">จังหวัด{group.province}</p>
        <h1>{group.name}</h1>
        <p className="md-hero-summary">{group.summary}</p>
        <a className="md-hero-link" href={`#ethnic/${group.id}/history`} onClick={event => navigateSection(event, 'history')}>เริ่มอ่านเรื่องราว <ArrowRight size={20} /></a>
      </div>
      <p className="md-hero-caption">ภาพประกอบจากเว็บไซต์เดิม · ไม่ใช่ภาพหลักฐานภาคสนาม</p>
    </header>

    <nav className="md-section-nav" aria-label="หัวข้อเรื่องราว"><div className="mh-shell">{sections.map(([id, label]) => <a key={id} className={activeSection === id ? 'is-current' : ''} aria-current={activeSection === id ? 'location' : undefined} href={`#ethnic/${group.id}/${id}`} onClick={event => navigateSection(event, id)}>{label}</a>)}</div></nav>

    <div className="mh-shell md-data-note"><BookOpen size={16} aria-hidden="true" /><p>เรื่องราวสาธิตจากเอกสารสาธารณะ ใช้ชุมชนตัวอย่างเพื่อการเรียนรู้ ลักษณะวัฒนธรรมอาจแตกต่างกันในแต่ละพื้นที่</p></div>

    <section className="mh-shell md-section md-history" id="history" data-detail-section tabIndex={-1}>
      <div className="md-history-copy"><p className="mh-eyebrow">01 <span className="mh-eyebrow-line" /> รากเหง้าและการเดินทาง</p><h2 className="mh-display">เรื่องราวที่<br /><span>ยังคงมีชีวิต</span></h2><div className="md-prose"><Paragraphs text={value('ประวัติความเป็นมา', group.history.join('\n\n'))} /></div></div>
      <figure className="md-history-image"><img src={image(storyImage)} alt="ภาพประกอบบรรยากาศชุมชนและภูมิทัศน์" loading="lazy" /><figcaption>ภาพประกอบบรรยากาศจากเว็บไซต์เดิม ไม่ใช่ภาพยืนยันสถานที่ตั้งชุมชน</figcaption><span className="md-image-number" aria-hidden="true">0{index}</span></figure>
      <aside className="md-story-pull"><span className="md-pull-ornament" aria-hidden="true">✦</span><p>{group.summary}</p><span className="md-pull-label">ประเด็นจากเรื่องราว · {group.name}</span></aside>
    </section>

    <section className="md-basic-section" id="basic" data-detail-section tabIndex={-1}>
      <div className="mh-shell md-section">
        <div className="md-section-title"><div><p className="mh-eyebrow">02 <span className="mh-eyebrow-line" /> ผู้คน ภาษา และถิ่นฐาน</p><h2 className="mh-display">รู้จักชุมชน</h2></div><p>ชื่อที่เรียก ภาษา และพื้นที่อยู่อาศัย<br />ช่วยให้เข้าใจเรื่องราวจากมุมมองของชุมชน</p></div>
        <div className="md-identity-layout"><dl className="md-facts">{[
          ['ชื่อกลุ่มชาติพันธุ์', name], ['ชื่อเรียกตนเอง', value('1.2 ชื่อเรียกตนเอง', group.selfName)], ['ชื่อที่บุคคลภายนอกเรียก', value('1.3 ชื่อที่บุคคลภายนอกเรียก', group.externalName)],
        ].map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
          <div className="md-language"><span className="md-detail-label">ภาษาที่เชื่อมโยงผู้คน</span><h3>{value('1.5 ภาษา', group.language)}</h3><p><span>ตระกูลภาษา</span>{value('1.6 ตระกูลภาษา', group.family)}</p><div className="md-population"><div><span>จำนวนประชากร</span><strong>{value('1.7 จำนวนประชากร') === missing ? 'ยังไม่มีข้อมูลสำรวจ' : value('1.7 จำนวนประชากร')}</strong></div><div><span>จำนวนครัวเรือน</span><strong>{value('จำนวนครัวเรือน') === missing ? 'ยังไม่มีข้อมูลสำรวจ' : value('จำนวนครัวเรือน')}</strong></div></div></div>
        </div>
        <div className="md-location-band"><div className="md-location-heading"><MapPin size={25} strokeWidth={1.4} /><div><span className="md-detail-label">ชุมชนตัวอย่าง</span><h3>{village}</h3></div></div><div className="md-location-body"><p>{location || missing}</p>{location && <a className="mh-text-link" href={mapUrl} target="_blank" rel="noopener noreferrer">ค้นหาชุมชนบนแผนที่ <ArrowUpRight size={19} /></a>}<small>ค้นหาจากชื่อสถานที่ ยังไม่ใช่พิกัดสำรวจที่ยืนยันแล้ว</small></div></div>
        <div className="md-beliefs"><span className="md-detail-label">ศาสนาและความเชื่อ</span><p>{value('1.8 ศาสนา / ความเชื่อ', group.beliefs)}</p></div>
      </div>
    </section>

    <section className="mh-shell md-section md-life" id="life" data-detail-section tabIndex={-1}>
      <p className="mh-eyebrow">03 <span className="mh-eyebrow-line" /> วัฒนธรรมในชีวิตประจำวัน</p><h2 className="mh-display">บ้านที่อยู่<br /><span>วิถีที่สืบต่อ</span></h2>
      <div className="md-life-row"><figure className="md-life-image"><img src={image('archival_village_1790134516945.jpg')} alt="ภาพประกอบเรือนและบรรยากาศชุมชน" loading="lazy" /><figcaption>ภาพประกอบเรือนจากเว็บไซต์เดิม ไม่ใช่ภาพสำรวจบ้านเรือนของกลุ่มชาติพันธุ์</figcaption></figure><div className="md-life-copy"><span className="md-detail-label">01 / พื้นที่แห่งชีวิต</span><h3>บ้านเรือน</h3><Paragraphs text={value('2.1 ที่อยู่และลักษณะบ้านเรือน', group.housing)} /><div className="md-inline-topic"><span className="md-detail-label">การทำมาหากิน</span><h4>อาชีพและงานในชุมชน</h4><Paragraphs text={value('2.3 อาชีพหลัก', group.occupation)} />{value('อาชีพเสริม', group.secondaryOccupation) !== missing && <p><span className="md-detail-label">อาชีพเสริม</span><br />{value('อาชีพเสริม', group.secondaryOccupation)}</p>}</div></div></div>
      <div className="md-life-row md-life-reverse"><div className="md-life-copy"><span className="md-detail-label">02 / ความงามที่ถักทอ</span><h3>เครื่องแต่งกาย<br />และภูมิปัญญา</h3><Paragraphs text={value('2.2 การแต่งกาย', group.dress)} />{value('ผลิตภัณฑ์ชุมชน', group.products) !== missing && <div className="md-inline-topic"><span className="md-detail-label">ผลิตภัณฑ์ชุมชน</span><Paragraphs text={value('ผลิตภัณฑ์ชุมชน', group.products)} /></div>}</div><figure className="md-life-portrait"><img src={image(group.image)} alt={`ภาพประกอบเรื่องราวผู้คน${group.name}`} loading="lazy" /><figcaption>ภาพประกอบจากเว็บไซต์เดิม ใช้สร้างบรรยากาศการเรียนรู้</figcaption></figure></div>
    </section>

    <section className="md-traditions"><div className="mh-shell md-tradition-inner"><div><Leaf size={34} strokeWidth={1} /><p className="md-kicker">A LIVING TRADITION</p><h2>ประเพณี<br />ที่เชื่อมคนกับรากเหง้า</h2></div><div><p className="md-tradition-text">{value('2.4 วัฒนธรรมและประเพณีที่สำคัญ', group.traditions)}</p>{value('ศูนย์การเรียนรู้') !== missing && <p className="md-learning"><span>ศูนย์การเรียนรู้</span>{value('ศูนย์การเรียนรู้')}</p>}</div></div></section>

    <section className="mh-shell md-section md-food" id="food-story" data-detail-section tabIndex={-1}><div className="md-section-title"><div><p className="mh-eyebrow">04 <span className="mh-eyebrow-line" /> รสชาติและความทรงจำ</p><h2 className="mh-display">สำรับที่เล่าเรื่อง</h2></div><p>{value('2.5 อาหารการกิน', group.foodIntro)}</p></div>
      {relatedFoods.map(food => <article className="md-food-feature" key={food.id}><a className="md-food-image" href={`#food/${food.id}`} aria-label={`อ่านเรื่องราวอาหาร ${food.name}`}><img src={image(food.image)} alt={`ภาพประกอบอาหารพื้นถิ่น ไม่ใช่ภาพเมนู${food.name}`} loading="lazy" /><span>ภาพประกอบ</span></a><div className="md-food-copy"><span className="md-detail-label">{group.name} · {group.province}</span><h3><a href={`#food/${food.id}`}>{food.name}</a></h3><p>{food.description}</p><a className="mh-text-link" href={`#food/${food.id}`}>เรื่องราว วัตถุดิบ และวิธีทำ <ArrowUpRight size={21} /></a></div></article>)}
      {value('การพัฒนาเมนูชาติพันธุ์ในโครงการ') !== missing && <div className="md-food-development"><h3>การพัฒนาเมนูในโครงการ</h3><Paragraphs text={value('การพัฒนาเมนูชาติพันธุ์ในโครงการ')} /></div>}
    </section>

    <section className="md-gallery-section" id="gallery" data-detail-section tabIndex={-1}><div className="mh-shell md-section"><div className="md-section-title"><div><p className="mh-eyebrow">05 <span className="mh-eyebrow-line" /> ภาพและเรื่องราว</p><h2 className="mh-display">มองผ่านวิถีชีวิต</h2></div><p>ภาพประกอบบรรยากาศการเรียนรู้<br />และภาพกิจกรรมของโครงการ</p></div><div className="md-gallery"><figure className="md-gallery-main"><img src="assets/project-cooking.jpg" alt="ผู้ร่วมกิจกรรมกำลังประกอบอาหารในครัว" loading="lazy" /><figcaption><Camera size={15} />ภาพกิจกรรมทำอาหารของโครงการ · ยังไม่ระบุชาติพันธุ์หรือสถานที่</figcaption></figure><figure className="md-gallery-small"><img src={image('culture_charcoal_stove_1790134529027.jpg')} alt="ภาพประกอบเตาและการปรุงอาหาร" loading="lazy" /><figcaption>ภาพประกอบวิถีการปรุงอาหารจากเว็บไซต์เดิม</figcaption></figure></div></div></section>

    <section className="mh-shell md-section md-sources" id="sources" data-detail-section tabIndex={-1}><div><p className="mh-eyebrow">06 <span className="mh-eyebrow-line" /> ที่มาของเรื่องราว</p><h2 className="mh-display">อ่านให้ลึก<br /><span>รู้จักให้มากขึ้น</span></h2><p className="md-source-note">เนื้อหาสาธิตเรียบเรียงจากเอกสารสาธารณะ ไม่ใช่ผลสำรวจภาคสนามของโครงการ</p></div><div className="md-source-content"><ol className="md-source-list">{originalSources.map((source, sourceIndex) => <li key={`${source.url}-${sourceIndex}`}><span>{String(sourceIndex + 1).padStart(2, '0')}</span>{safeSourceUrl(source.url) ? <a href={safeSourceUrl(source.url)} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={18} /></a> : <p>{source.title}</p>}</li>)}</ol>
      {savedSources && savedSources !== originalSourceText && <div className="md-saved-sources"><h3>แหล่งข้อมูลที่บันทึกในเครื่องนี้</h3>{savedSources.split(/\n+/).filter(Boolean).map((line, lineIndex) => safeSourceUrl(line.trim()) ? <p key={lineIndex}><a href={safeSourceUrl(line.trim())} target="_blank" rel="noopener noreferrer">{line}<ArrowUpRight size={15} /></a></p> : <p key={lineIndex}>{line}</p>)}</div>}
      <details className="md-survey"><summary>บันทึกภาคสนามและสื่อของโครงการ <span aria-hidden="true">+</span></summary><p>ข้อมูลส่วนนี้มาจากแบบบันทึกในเบราว์เซอร์เครื่องนี้ ช่องที่ยังไม่กรอกจะแสดงสถานะรอข้อมูล</p><dl>{surveyFields.map(field => <div key={field}><dt>{field}</dt><dd>{value(field)}</dd></div>)}</dl><a className="mh-text-link" href={`#archive/${group.id}`}>เพิ่มหรือแก้ไขข้อมูลสำรวจ <ArrowUpRight size={18} /></a></details>
    </div></section>

    <aside className="md-discover"><div className="mh-shell"><p className="mh-eyebrow">เรื่องราวยังมีต่อ</p><h2>อีกมุมของนครชัยบุรินทร์</h2><div className="md-next-stories">{groups.filter(item => item.id !== group.id).map(item => <a href={`#ethnic/${item.id}`} key={item.id}><img src={image(item.image)} alt="" loading="lazy" /><div><span>{item.province}</span><h3>{item.name}</h3></div><ArrowUpRight size={23} /></a>)}</div><a className="mh-text-link" href="#ethnic">สำรวจชาติพันธุ์ทั้งหมด <ArrowRight size={18} /></a></div></aside>
  </article>;
}
