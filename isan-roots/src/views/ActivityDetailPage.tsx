import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, ChevronLeft, ChevronRight, ExternalLink, Images, Link, MapPin, Maximize2, X } from 'lucide-react';
import { activityStories, type ActivityStory } from '../data/activityStories';

interface ActivityDetailPageProps {
  activity: ActivityStory;
}

export default function ActivityDetailPage({ activity }: ActivityDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [copyStatus, setCopyStatus] = useState('');
  const [manualLink, setManualLink] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageTriggerRef = useRef<HTMLButtonElement>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);
  const overflowRef = useRef<string | null>(null);
  const gallery = activity.gallery.length
    ? activity.gallery
    : [{ src: activity.image, alt: activity.alt, caption: activity.caption }];
  const photo = gallery[Math.min(selectedImage, gallery.length - 1)];
  const currentIndex = activityStories.findIndex(story => story.id === activity.id);
  const previous = activityStories[(currentIndex - 1 + activityStories.length) % activityStories.length];
  const next = activityStories[(currentIndex + 1) % activityStories.length];
  const related = activityStories.filter(story => story.id !== activity.id).slice(0, 3);

  const restorePageScroll = () => {
    if (overflowRef.current !== null) {
      document.body.style.overflow = overflowRef.current;
      overflowRef.current = null;
    }
  };

  useEffect(() => {
    setSelectedImage(0);
    setCopyStatus('');
    setManualLink('');
    if (dialogRef.current?.open) dialogRef.current.close();
    restorePageScroll();
    return restorePageScroll;
  }, [activity.id]);

  useEffect(() => {
    if (manualLink) {
      manualInputRef.current?.focus();
      manualInputRef.current?.select();
    }
  }, [manualLink]);

  const openImage = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    overflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  };

  const closeImage = () => {
    dialogRef.current?.close();
  };

  const copyLink = async () => {
    const url = window.location.href;
    setManualLink('');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      setCopyStatus('คัดลอกลิงก์แล้ว พร้อมส่งต่อเรื่องราวนี้');
    } catch {
      const input = document.createElement('textarea');
      input.value = url;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.append(input);
      input.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      input.remove();
      if (copied) setCopyStatus('คัดลอกลิงก์แล้ว พร้อมส่งต่อเรื่องราวนี้');
      else {
        setManualLink(url);
        setCopyStatus('เลือกลิงก์ด้านล่างเพื่อคัดลอกและส่งต่อ');
      }
    }
  };

  return <article className="activity-pages activity-detail-editorial">
    <section className="ad-masthead" aria-label="รายละเอียดข่าวและกิจกรรม">
      <img src={activity.image} alt="" className="ad-masthead-image" />
      <div className="ad-masthead-wash" />
      <div className="an-shell ad-masthead-copy">
        <p className="ad-masthead-title">รายละเอียดข่าวและกิจกรรม</p>
        <p>บันทึกเรื่องราว ผู้คน และภูมิปัญญาจากชุมชนทั้ง 4 จังหวัด</p>
        <div className="an-ornament" aria-hidden="true"><span>❖</span></div>
      </div>
    </section>

    <div className="an-shell ad-article-shell">
      <header className="ad-heading">
        <div className="ad-meta">
          <span className="ad-category">{activity.category}</span>
          <span>{activity.groupName}</span>
          <span className="ad-province"><MapPin size={17} aria-hidden="true" />จังหวัด{activity.province}</span>
        </div>
        <h1>{activity.headline}</h1>
        <p className="ad-summary">{activity.summary}</p>
      </header>

      <div className="ad-story-layout">
        <section className="ad-gallery" aria-label={`ภาพกิจกรรม${activity.groupName}`}>
          <figure className="ad-gallery-figure">
            <button type="button" className={`ad-main-image${selectedImage > 0 ? ' ad-main-image--artwork' : ''}`} onClick={openImage} ref={imageTriggerRef} aria-label={`ขยายภาพ: ${photo.alt}`}>
              <img src={photo.src} alt={photo.alt} style={{ objectPosition: selectedImage === 0 ? activity.position : 'center' }} fetchPriority="high" />
              <span className="ad-enlarge"><Maximize2 size={20} aria-hidden="true" /><span>ขยายภาพ</span></span>
            </button>
            <figcaption><Camera size={16} aria-hidden="true" /><span>{photo.caption}</span></figcaption>
          </figure>
          {gallery.length > 1 && <div className="ad-thumbnails" role="group" aria-label="เลือกภาพกิจกรรม">
            {gallery.map((item, index) => <button
              type="button"
              className={`ad-thumbnail${selectedImage === index ? ' is-selected' : ''}`}
              key={item.src}
              onClick={() => setSelectedImage(index)}
              aria-label={`ดูภาพที่ ${index + 1}: ${item.alt}`}
              aria-pressed={selectedImage === index}
            >
              <img src={item.src} alt="" loading="lazy" />
              <span>{index === 0 ? 'ภาพกิจกรรม' : 'ภาพประชาสัมพันธ์'}</span>
            </button>)}
          </div>}
        </section>

        <div className="ad-article-copy">
          <div className="ad-prose">{activity.paragraphs.map((paragraph, index) => <p key={`${activity.id}-${index}`}>{paragraph}</p>)}</div>
          <div className="ad-album-block">
            <a className="ad-album-link" href={activity.albumUrl} target="_blank" rel="noopener noreferrer">
              <Images size={20} aria-hidden="true" />
              <span>ชมอัลบั้มภาพกิจกรรม</span>
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <p>เปิดภาพเพิ่มเติมจากอัลบั้มของโครงการ <ExternalLink size={13} aria-hidden="true" /></p>
          </div>
          <div className="ad-share">
            <span>ส่งต่อเรื่องราวนี้</span>
            <button type="button" onClick={copyLink} aria-label="คัดลอกลิงก์กิจกรรม">
              {copyStatus.startsWith('คัดลอกลิงก์แล้ว') ? <Check size={18} aria-hidden="true" /> : <Link size={18} aria-hidden="true" />}
              คัดลอกลิงก์
            </button>
          </div>
          <p className="ad-copy-status" role="status" aria-live="polite">{copyStatus}</p>
          {manualLink && <label className="ad-manual-link">ลิงก์เรื่องราว<input ref={manualInputRef} type="text" readOnly value={manualLink} onFocus={event => event.currentTarget.select()} /></label>}
        </div>
      </div>

      <nav className="ad-article-navigation" aria-label="อ่านกิจกรรมอื่น">
        <a href={`#activities/${previous.id}`} className="ad-previous"><ArrowLeft size={20} aria-hidden="true" /><span><small>เรื่องก่อนหน้า</small>{previous.groupName}</span></a>
        <a href="#activities" className="ad-back-all">ข่าวสารและกิจกรรมทั้งหมด</a>
        <a href={`#activities/${next.id}`} className="ad-next"><span><small>เรื่องถัดไป</small>{next.groupName}</span><ArrowRight size={20} aria-hidden="true" /></a>
      </nav>
    </div>

    <section className="ad-related-section" aria-labelledby="ad-related-title">
      <div className="an-shell">
        <header className="ad-related-heading">
          <h2 id="ad-related-title">เรื่องราวจากชุมชนอื่น</h2>
          <div className="an-ornament" aria-hidden="true"><span>❖</span></div>
        </header>
        <div className="ad-related-list">{related.map(story => <a className="ad-related-story" href={`#activities/${story.id}`} key={story.id}>
          <div className="ad-related-photo"><img src={story.image} alt={story.alt} loading="lazy" style={{ objectPosition: story.position }} /></div>
          <div className="ad-related-copy">
            <span className="ad-related-category">{story.category}</span>
            <h3>{story.headline}</h3>
            <span className="ad-related-location"><MapPin size={15} aria-hidden="true" />{story.province}<ArrowRight size={17} aria-hidden="true" /></span>
          </div>
        </a>)}</div>
      </div>
    </section>

    <dialog
      className="ad-image-dialog"
      ref={dialogRef}
      aria-label="ภาพกิจกรรมขนาดใหญ่"
      onCancel={event => { event.preventDefault(); closeImage(); }}
      onClose={() => { restorePageScroll(); imageTriggerRef.current?.focus({ preventScroll: true }); }}
      onClick={event => { if (event.target === event.currentTarget) closeImage(); }}
      onKeyDown={event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); setSelectedImage(index => (index + 1) % gallery.length); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); setSelectedImage(index => (index - 1 + gallery.length) % gallery.length); }
      }}
    >
      <div className="ad-dialog-toolbar"><span>ภาพที่ {selectedImage + 1} / {gallery.length}</span><button type="button" onClick={closeImage} autoFocus aria-label="ปิดภาพขนาดใหญ่"><X size={24} aria-hidden="true" /></button></div>
      <figure>
        <img src={photo.src} alt={photo.alt} />
        <figcaption>{photo.caption}</figcaption>
      </figure>
      {gallery.length > 1 && <div className="ad-dialog-navigation">
        <button type="button" onClick={() => setSelectedImage(index => (index - 1 + gallery.length) % gallery.length)} aria-label="ภาพก่อนหน้า"><ChevronLeft size={24} aria-hidden="true" /></button>
        <button type="button" onClick={() => setSelectedImage(index => (index + 1) % gallery.length)} aria-label="ภาพถัดไป"><ChevronRight size={24} aria-hidden="true" /></button>
      </div>}
    </dialog>
  </article>;
}
