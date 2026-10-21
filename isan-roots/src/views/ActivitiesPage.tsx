import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Images, MapPin, Search } from 'lucide-react';
import { activityStories } from '../data/activityStories';

export default function ActivitiesPage() {
  const track = useRef<HTMLDivElement>(null);
  const slideStep = useRef(1);
  const [pagination, setPagination] = useState({ page: 0, count: 1 });
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('');
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => {
      const card = element.firstElementChild as HTMLElement | null;
      slideStep.current = (card?.offsetWidth || element.clientWidth) + (parseFloat(getComputedStyle(element).columnGap) || 0);
      const count = Math.max(1, Math.ceil((element.scrollWidth - element.clientWidth - 2) / slideStep.current) + 1);
      const page = Math.min(count - 1, Math.round(element.scrollLeft / slideStep.current));
      setPagination({ page, count });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.addEventListener('scroll', measure, { passive: true });
    measure();
    return () => { observer.disconnect(); element.removeEventListener('scroll', measure); };
  }, []);
  const goTo = (page: number) => {
    const element = track.current;
    if (!element) return;
    element.scrollTo({
      left: page * slideStep.current,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  };
  const normalize = (value: string) => value.normalize('NFKC').replace(/[–—\-\s]/g, '').toLowerCase();
  const matches = activityStories.filter(story =>
    (!province || story.province === province) &&
    normalize(`${story.headline} ${story.groupName} ${story.province}`).includes(normalize(query))
  );
  return <div className="activity-pages activity-news-page">
    <section className="an-featured" aria-labelledby="activity-news-title">
      <div className="an-backdrop" aria-hidden="true" />
      <div className="an-shell">
        <header className="an-heading">
          <span className="an-kicker">เรื่องราวจากชุมชน · นครชัยบุรินทร์</span>
          <h1 id="activity-news-title">ข่าวสารและกิจกรรม</h1>
          <div className="an-ornament" aria-hidden="true"><span>❖</span></div>
          <p>ติดตามกิจกรรมและเรื่องราวจากชุมชนชาติพันธุ์ทั้ง 4 จังหวัด<br className="an-desktop-break" />นครราชสีมา ชัยภูมิ บุรีรัมย์ และสุรินทร์</p>
        </header>
        <div className="an-carousel" role="region" aria-label="เรื่องราวกิจกรรม 4 ชุมชน" aria-roledescription="สไลด์">
          <div className="an-story-track" ref={track}>
            {activityStories.map(story => <article className="an-story-card" key={story.id}>
              <a className="an-card-link" href={`#activities/${story.id}`}>
                <div className="an-story-visual">
                  <img src={story.image} alt={story.alt} style={{ objectPosition: story.position }} width="600" height="440" />
                  <span className="an-category">{story.category}</span>
                </div>
                <div className="an-story-copy">
                  <span className="an-province"><MapPin size={17} aria-hidden="true" />{story.province}</span>
                  <h2>{story.headline}</h2>
                  <p>{story.summary}</p>
                </div>
                <div className="an-story-action">
                  <span>อ่านเพิ่มเติม</span><span className="an-arrow-circle"><ArrowRight size={19} aria-hidden="true" /></span>
                  <span className="an-corner-pattern" aria-hidden="true" />
                </div>
              </a>
            </article>)}
          </div>
          {pagination.count > 1 && <div className="an-carousel-controls">
            <button type="button" className="an-slide-arrow" onClick={() => goTo(pagination.page - 1)} disabled={pagination.page === 0} aria-label="ดูกิจกรรมก่อนหน้า"><ArrowLeft size={21} /></button>
            <div className="an-pagination" aria-label="เลือกหน้ากิจกรรม">
              {Array.from({length: pagination.count}, (_, index) => <button type="button" key={index} className={index === pagination.page ? 'is-active' : ''} aria-label={`ดูกิจกรรมหน้าที่ ${index + 1}`} aria-current={index === pagination.page ? 'true' : undefined} onClick={() => goTo(index)} />)}
            </div>
            <button type="button" className="an-slide-arrow" onClick={() => goTo(pagination.page + 1)} disabled={pagination.page === pagination.count - 1} aria-label="ดูกิจกรรมถัดไป"><ArrowRight size={21} /></button>
          </div>}
        </div>
      </div>
    </section>
    <section className="an-archive an-shell" aria-labelledby="activity-archive-title" id="activity-albums">
      <div className="an-archive-heading">
        <div><span className="an-small-ornament" aria-hidden="true">❖</span><h2 id="activity-archive-title">สำรวจอัลบั้มกิจกรรม</h2></div>
        <p>ภาพถ่ายและความทรงจำจากทั้ง 4 ชุมชน</p>
      </div>
      <div className="an-filters">
        <label className="an-search"><Search size={20} aria-hidden="true" /><span className="sr-only">ค้นหากิจกรรม</span><input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="ค้นหาชาติพันธุ์หรือจังหวัด" /></label>
        <div className="an-province-filters" role="group" aria-label="เลือกจังหวัด">
          {['', ...activityStories.map(story => story.province)].map(item => <button type="button" key={item} aria-pressed={province === item} onClick={() => setProvince(item)}>{item || 'ทั้งหมด'}</button>)}
        </div>
      </div>
      <div className="an-album-list">
        {matches.map(story => <a href={`#activities/${story.id}`} className="an-album-item" key={story.id}>
          <img src={story.image} alt="" loading="lazy" width="160" height="160" />
          <div><span className="an-album-category">{story.category}</span><h3>{story.headline}</h3><span className="an-album-meta"><MapPin size={15} aria-hidden="true" />{story.province}<ArrowRight size={17} className="an-album-arrow" aria-hidden="true" /></span></div>
        </a>)}
      </div>
      {matches.length === 0 && <div className="an-empty"><Images size={28} aria-hidden="true" /><p>ยังไม่พบกิจกรรมที่ตรงกับคำค้น</p><button type="button" onClick={() => { setQuery(''); setProvince(''); }}>ดูทุกกิจกรรม</button></div>}
      <p className="an-results" role="status">{matches.length} อัลบั้มจากโครงการ</p>
    </section>
  </div>;
}
