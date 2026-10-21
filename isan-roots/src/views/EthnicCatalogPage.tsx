import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, Info, MapPin, Search, X } from 'lucide-react';
import type { HeritageGroup } from '../types';

interface EthnicCatalogPageProps {
  groups: HeritageGroup[];
  initialQuery?: string;
  initialProvince?: string;
  onFiltersChange?: (query: string, province: string) => void;
}

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('th').replace(/[\s\u200B\u200C\u200D\uFEFF\-‐‑‒–—―]/g, '');

export default function EthnicCatalogPage({ groups, initialQuery = '', initialProvince = '', onFiltersChange }: EthnicCatalogPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [province, setProvince] = useState(initialProvince);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);
  useEffect(() => { setProvince(initialProvince); }, [initialProvince]);

  const provinces = useMemo(() => [...new Set(groups.map(group => group.province))], [groups]);
  const results = groups.filter(group => (!province || group.province === province) &&
    normalize(`${group.name} ${group.province} ${group.language} ${group.summary} ${group.selfName || ''}`).includes(normalize(query)));
  const updateFilters = (nextQuery: string, nextProvince: string) => {
    setQuery(nextQuery);
    setProvince(nextProvince);
    onFiltersChange?.(nextQuery, nextProvince);
  };

  return <div className="catalog-page ethnic-catalog-page">
    <section className="ec-hero" aria-labelledby="ethnic-catalog-title">
      <div className="ec-hero-landscape" aria-hidden="true">
        <img src="assets/images/temple_phanom_rung_1790134505679.jpg" alt="" width="1376" height="768" fetchPriority="high" />
      </div>
      <div className="ec-hero-ornament" aria-hidden="true"><span>❖</span></div>
      <div className="catalog-shell ec-hero-inner">
        <div className="ec-hero-copy">
          <p className="ec-eyebrow">ผู้คนและรากเหง้า<span aria-hidden="true" /></p>
          <h1 id="ethnic-catalog-title">ชาติพันธุ์</h1>
          <p className="ec-intro">สี่เรื่องราวของชุมชนในนครชัยบุรินทร์ เรียนรู้ความหลากหลาย<br className="ec-desktop-break" />ผ่านภาษา ประเพณี และวิถีชีวิต</p>
        </div>
        <p className="ec-hero-caption" aria-hidden="true">ผู้คน · วัฒนธรรม<br />บนผืนแผ่นดินเดียวกัน<span /></p>
      </div>
    </section>

    <div className="catalog-shell ec-content">
      <form className="ec-filters" role="search" aria-label="ค้นหาชาติพันธุ์" onSubmit={event => event.preventDefault()}>
        <label className="ec-search-label" htmlFor="ec-search">ค้นหาเรื่องราว</label>
        <div className="ec-search-control">
          <Search size={22} aria-hidden="true" />
          <input id="ec-search" type="search" value={query} onChange={event => updateFilters(event.target.value, province)} placeholder="ชื่อชาติพันธุ์ จังหวัด หรือภาษา" autoComplete="off" />
          {query && <button className="ec-clear-search" type="button" aria-label="ล้างคำค้นหา" onClick={() => updateFilters('', province)}><X size={18} /></button>}
        </div>
        <div className="ec-province-control">
          <label htmlFor="ec-province">จังหวัด</label>
          <div className="ec-select-wrap"><MapPin size={20} aria-hidden="true" />
            <select id="ec-province" value={province} onChange={event => updateFilters(query, event.target.value)}>
              <option value="">ทุกจังหวัด</option>
              {provinces.map(item => <option key={item} value={item}>{item}</option>)}
            </select><ChevronDown size={18} aria-hidden="true" />
          </div>
        </div>
      </form>

      <section className="ec-stories" aria-label="เรื่องราวชาติพันธุ์">
        <div className="ec-results-heading">
          <p className="ec-result-count" role="status" aria-live="polite">พบ <strong>{results.length}</strong> ชาติพันธุ์<span aria-hidden="true" /></p>
          <span className="ec-collection-label" aria-hidden="true">ETHNIC OF NAKHON CHAI BU RIN</span>
          {(query || province) && <button type="button" className="ec-reset" onClick={() => updateFilters('', '')}>ดูทั้งหมด<X size={15} aria-hidden="true" /></button>}
        </div>
        <div className="ec-story-grid">
          {results.map(group => <article className="ec-story" key={group.id}>
            <a className="ec-story-link" href={`#ethnic/${group.id}`}>
              <img className="ec-story-image" src={`assets/images/${group.image}`} alt={`ภาพประกอบวิถีชีวิต${group.name} จังหวัด${group.province}`} width="600" height="800" loading="eager" />
              <div className="ec-story-shade" />
              <span className="ec-story-number">{String(groups.findIndex(item => item.id === group.id) + 1).padStart(2, '0')}</span>
              <div className="ec-story-copy">
                <span className="ec-story-province"><MapPin size={17} aria-hidden="true" />จังหวัด{group.province}</span>
                <h2>{group.name}</h2>
                <p>{group.summary}</p>
                <span className="ec-story-action">สำรวจเรื่องราว<ArrowRight size={19} aria-hidden="true" /></span>
              </div>
              <span className="ec-card-ornament" aria-hidden="true"><i /><i /><i /><i /></span>
            </a>
          </article>)}
        </div>
        {results.length === 0 && <div className="ec-empty">
          <Search size={34} aria-hidden="true" />
          <h2>ยังไม่พบเรื่องราวที่ค้นหา</h2>
          <p>ลองเปลี่ยนชื่อชาติพันธุ์ ภาษา หรือเลือกจังหวัดอื่น</p>
          <button type="button" onClick={() => updateFilters('', '')}>ดูทั้ง {groups.length} ชาติพันธุ์<ArrowRight size={18} aria-hidden="true" /></button>
        </div>}
        <p className="ec-source-note"><Info size={18} aria-hidden="true" />ข้อมูลสาธิตเรียบเรียงจากเอกสารสาธารณะ และมีพื้นที่เพิ่มแหล่งอ้างอิงหรือภาพเพิ่มเติม</p>
      </section>
    </div>
  </div>;
}
