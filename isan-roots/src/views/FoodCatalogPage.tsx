import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown, Info, LayoutGrid, Leaf, List, MapPin, Search, X } from 'lucide-react';
import type { HeritageFood, HeritageGroup } from '../types';

export interface FoodCatalogFilters {
  query: string;
  group: string;
  province: string;
  sort: 'recommended' | 'name';
  view: 'grid' | 'list';
}

export interface FoodCatalogPageProps {
  groups: HeritageGroup[];
  foods: HeritageFood[];
  initialFilters?: Partial<FoodCatalogFilters>;
  onFiltersChange?: (filters: FoodCatalogFilters) => void;
}

const normalize = (value: string) => value.normalize('NFKC').replace(/[–—\-\s]/g, '').toLocaleLowerCase('th');

function BotanicalSprig({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 160" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M46 156C37 116 45 67 72 13M44 126C19 121 10 106 8 92C28 95 41 105 44 126ZM43 108C63 100 75 84 78 71C58 76 46 91 43 108ZM46 88C25 81 18 65 17 54C37 61 46 72 46 88ZM53 65C73 57 85 42 87 27C68 36 57 48 53 65ZM63 39C50 27 51 14 56 3C66 15 68 26 63 39Z" />
    <path d="M10 94L43 126M19 57L46 88M46 106L76 74M56 62L84 30" opacity=".6" />
  </svg>;
}

export default function FoodCatalogPage({ groups, foods, initialFilters, onFiltersChange }: FoodCatalogPageProps) {
  const [filters, setFilters] = useState<FoodCatalogFilters>({ query: '', group: '', province: '', sort: 'recommended', view: 'grid', ...initialFilters });
  const resultsRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const updateFilters = (patch: Partial<FoodCatalogFilters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFiltersChange?.(next);
  };
  const reset = () => {
    updateFilters({ query: '', group: '', province: '' });
    searchRef.current?.focus({ preventScroll: true });
  };
  const query = normalize(filters.query);
  const selected = foods.filter(food => {
    const group = groups.find(item => item.id === food.group);
    const searchable = [food.name, food.subtitle, food.description, ...food.ingredients, group?.name ?? '', group?.province ?? ''].join(' ');
    return (!filters.group || food.group === filters.group)
      && (!filters.province || group?.province === filters.province)
      && normalize(searchable).includes(query);
  });
  const matches = filters.sort === 'name' ? [...selected].sort((a, b) => a.name.localeCompare(b.name, 'th')) : selected;
  const hasFilters = Boolean(filters.query || filters.group || filters.province);
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };

  return <div className="catalog-page food-catalog-page">
    <section className="fc-hero" aria-labelledby="food-catalog-title">
      <img className="fc-hero-image" src="assets/images/food_boh_dong_1790134449906.jpg" alt="" width="1200" height="896" fetchPriority="high" />
      <div className="fc-hero-shade" />
      <BotanicalSprig className="fc-hero-sprig" />
      <div className="catalog-shell fc-hero-inner">
        <div className="fc-hero-copy">
          <p className="fc-eyebrow"><Leaf size={18} strokeWidth={1.5} /> รสชาติของผู้คน <span /></p>
          <h1 id="food-catalog-title">อาหารพื้นถิ่น</h1>
          <p className="fc-hero-description">รู้จักวัตถุดิบ ภูมิปัญญา และเรื่องราวที่อยู่เบื้องหลังอาหาร<br className="fc-desktop-break" />ของแต่ละชุมชนในนครชัยบุรินทร์</p>
        </div>
      </div>
      <svg className="fc-hero-curve" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 24C130 92 185 4 365 24C650 58 1010 63 1240 32C1320 20 1380 8 1440 0V60H0Z" fill="currentColor" /></svg>
    </section>

    <div className="catalog-shell fc-content">
      <div className="fc-discover">
        <form className="fc-search" role="search" aria-label="ค้นหาอาหารพื้นถิ่น" onSubmit={search}>
          <div className="fc-search-input">
            <Search size={23} strokeWidth={1.7} aria-hidden="true" />
            <label htmlFor="fc-query" className="sr-only">ชื่ออาหาร วัตถุดิบ จังหวัด หรือคำสำคัญ</label>
            <input ref={searchRef} id="fc-query" type="search" value={filters.query} onChange={event => updateFilters({ query: event.target.value })} placeholder="ค้นหาอาหาร ชื่อเมนู วัตถุดิบ หรือจังหวัด" autoComplete="off" />
          </div>
          <div className="fc-province">
            <MapPin size={20} aria-hidden="true" />
            <label htmlFor="fc-province" className="sr-only">จังหวัด</label>
            <select id="fc-province" value={filters.province} onChange={event => updateFilters({ province: event.target.value })}>
              <option value="">ทุกจังหวัด</option>
              {[...new Set(groups.map(group => group.province))].map(province => <option key={province} value={province}>{province}</option>)}
            </select>
            <ChevronDown size={17} aria-hidden="true" />
          </div>
          <button type="submit" className="fc-search-submit" aria-label="ดูผลการค้นหาอาหาร"><Search size={23} /></button>
        </form>
        <div className="fc-filter-row">
          <div className="fc-filters" role="group" aria-label="เลือกชาติพันธุ์">
            <button type="button" aria-pressed={!filters.group} onClick={() => updateFilters({ group: '' })}>ทั้งหมด</button>
            {groups.map(group => <button type="button" key={group.id} aria-pressed={filters.group === group.id} onClick={() => updateFilters({ group: group.id })}>{group.name}</button>)}
          </div>
          <span className="fc-signature" aria-hidden="true">LOCAL FOOD · LOCAL PEOPLE</span>
        </div>
      </div>

      <section className="fc-results" ref={resultsRef} tabIndex={-1} aria-label="เมนูอาหารพื้นถิ่น">
        <div className="fc-results-bar">
          <div className="fc-result-summary">
            <p className="fc-count" role="status" aria-live="polite">พบ <strong>{matches.length}</strong> เมนู</p>
            {hasFilters && <button className="fc-reset" type="button" onClick={reset}>ล้างตัวกรอง <X size={16} aria-hidden="true" /></button>}
          </div>
          <div className="fc-display-controls">
            <label className="fc-sort" htmlFor="fc-sort"><span>เรียงตาม</span><select id="fc-sort" value={filters.sort} onChange={event => updateFilters({ sort: event.target.value as FoodCatalogFilters['sort'] })}><option value="recommended">แนะนำ</option><option value="name">ชื่ออาหาร ก–ฮ</option></select><ChevronDown size={15} aria-hidden="true" /></label>
            <div className="fc-view" role="group" aria-label="รูปแบบการแสดงผล">
              <button type="button" aria-label="แสดงแบบตาราง" aria-pressed={filters.view === 'grid'} onClick={() => updateFilters({ view: 'grid' })}><LayoutGrid size={19} /></button>
              <button type="button" aria-label="แสดงแบบรายการ" aria-pressed={filters.view === 'list'} onClick={() => updateFilters({ view: 'list' })}><List size={21} /></button>
            </div>
          </div>
        </div>

        {matches.length > 0 ? <div className={`fc-grid${filters.view === 'list' ? ' fc-list' : ''}`}>
          {matches.map(food => {
            const group = groups.find(item => item.id === food.group);
            return <article className="fc-card" key={food.id}>
              <a className="fc-card-link" href={`#food/${food.id}`} aria-label={`อ่านเรื่องราวและวิธีทำ ${food.name}`}>
                <div className="fc-card-image">
                  <img src={`assets/images/${food.image}`} alt={`ภาพประกอบบรรยากาศอาหาร${group?.name ?? ''} ไม่ใช่ภาพเมนูจริง`} width="1200" height="896" loading="lazy" />
                  <span className="fc-card-label"><span>{String(foods.indexOf(food) + 1).padStart(2, '0')}</span>{group?.name}</span>
                </div>
                <div className="fc-card-copy">
                  <p className="fc-card-province"><MapPin size={14} aria-hidden="true" />{group?.province}</p>
                  <h2>{food.name}</h2>
                  <p className="fc-card-description">{food.subtitle}</p>
                  <p className="fc-card-long-description">{food.description}</p>
                  <span className="fc-card-action">อ่านเรื่องราวและวิธีทำ <ArrowRight size={19} aria-hidden="true" /></span>
                  <BotanicalSprig className="fc-card-sprig" />
                </div>
              </a>
            </article>;
          })}
        </div> : <div className="catalog-empty"><Search size={35} strokeWidth={1.3} aria-hidden="true" /><h2>ยังไม่พบเมนูที่ค้นหา</h2><p>ลองใช้ชื่ออาหาร วัตถุดิบ หรือเลือกจังหวัดและชาติพันธุ์อื่น</p><button type="button" onClick={reset}>ดูอาหารทั้งหมด <ArrowRight size={18} aria-hidden="true" /></button></div>}
        <p className="catalog-note"><Info size={17} aria-hidden="true" /><span>ชื่อและเรื่องราวเมนูอ้างอิงจากเอกสาร ภาพใช้ประกอบบรรยากาศอาหาร ไม่ใช่ภาพของเมนูจริง</span></p>
      </section>
    </div>
  </div>;
}
