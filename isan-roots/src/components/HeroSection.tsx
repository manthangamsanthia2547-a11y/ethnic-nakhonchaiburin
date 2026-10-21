import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { activities } from '../data/activities';

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<{x:number; y:number} | null>(null);
  const swiped = useRef(false);
  const selectSlide = (index: number) => {
    setSlide((index + activities.length) % activities.length);
  };

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setSlide(index => (index + 1) % activities.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slide, reducedMotion]);

  return <section className="activity-banner activity-banner--artwork" aria-label="ภาพกิจกรรมของโครงการ" aria-roledescription="carousel"
    onTouchStart={event => { swiped.current = false; touchStart.current = {x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY}; }}
    onTouchEnd={event => {
      const start = touchStart.current;
      if (!start) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        swiped.current = true;
        selectSlide(slide + (dx < 0 ? 1 : -1));
      }
      touchStart.current = null;
    }}>
    <h1 className="sr-only">กิจกรรม ชาติพันธุ์นครชัยบุรินทร์</h1>
    <div className="activity-banner-slides">
      {activities.map((activity,index) => <a key={activity.id}
        className={`activity-banner-slide ${slide === index ? 'is-active' : ''}`}
        href={`#activities/${activity.id}`} aria-label={`ดูกิจกรรม ${activity.title}`}
        aria-hidden={slide !== index} tabIndex={slide === index ? 0 : -1}
        onClick={event => { if (swiped.current) { event.preventDefault(); swiped.current = false; } }}>
        <img src={activity.bannerImage} alt={activity.bannerAlt} style={{objectPosition:activity.position}} fetchPriority={index === 0 ? 'high' : 'auto'} draggable={false}/>
      </a>)}
    </div>
    <div className="activity-banner-shade" aria-hidden="true"/>
    <button className="activity-banner-arrow activity-banner-prev" type="button" aria-label="ภาพกิจกรรมก่อนหน้า" onClick={() => selectSlide(slide-1)}><ArrowLeft size={22}/></button>
    <button className="activity-banner-arrow activity-banner-next" type="button" aria-label="ภาพกิจกรรมถัดไป" onClick={() => selectSlide(slide+1)}><ArrowRight size={22}/></button>
    <div className="activity-banner-pagination" role="group" aria-label="เลือกภาพกิจกรรม">
      {activities.map((activity, index) => <button key={activity.id} type="button"
        aria-label={`แสดงภาพกิจกรรมที่ ${index + 1}: ${activity.title}`} aria-pressed={slide === index}
        onClick={() => selectSlide(index)}><span aria-hidden="true" /></button>)}
    </div>
    <span className="sr-only" role="status" aria-live="off">ภาพที่ {slide+1} จาก {activities.length}: {activities[slide].title}</span>
  </section>;
}

