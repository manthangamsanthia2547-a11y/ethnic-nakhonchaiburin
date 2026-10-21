import { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { HomePageProps } from '../types';
import { Arrow, NumberLabel, image } from './ui';

// An editorial schematic, deliberately labelled rather than presented as GIS boundaries.
const regions = [
  { id: 'nyahkur', path: 'M140 48 211 35 260 76 252 137 285 175 259 225 189 241 147 210 97 190 109 131 86 95Z', x: 188, y: 142 },
  { id: 'yuan', path: 'M97 198 145 219 189 251 257 235 293 272 280 330 239 370 180 393 131 365 72 371 40 326 57 278 30 246Z', x: 165, y: 310 },
  { id: 'lao', path: 'M270 218 316 201 346 230 342 284 367 317 346 365 300 384 249 378 290 336 304 270Z', x: 311, y: 292 },
  { id: 'khmer', path: 'M356 228 398 209 435 230 457 272 492 299 470 344 426 366 391 390 355 369 379 317 352 282Z', x: 419, y: 299 },
];

export default function ProvinceMap({ groups }: Pick<HomePageProps, 'groups'>) {
  const [active, setActive] = useState('nyahkur');
  const selected = groups.find(group => group.id === active) ?? groups[0];
  return <section className="ref-provinces mh-section" aria-labelledby="ref-province-title">
    <div className="mh-shell">
      <NumberLabel number="03">พื้นที่ / A SENSE OF PLACE</NumberLabel>
      <div className="mh-section-heading"><h2 className="mh-display" id="ref-province-title">สี่จังหวัด<br/><span>ร้อยเรื่องราว</span></h2><p>เริ่มจากสถานที่ แล้วเดินทางไปพบผู้คน<br/>เลือกจังหวัดเพื่อเปิดเรื่องราวของแต่ละชุมชน</p></div>
      <div className="ref-map-layout">
        <div className="ref-map-canvas">
          <img src={image('hero_isan_heritage_1790134382342.jpg')} alt="" loading="lazy" />
          <span className="ref-map-compass" aria-hidden="true">N<br/>↑</span>
          <svg className="ref-map" viewBox="0 0 530 435" aria-label="แผนผังเลือกจังหวัดนครชัยบุรินทร์">
            {regions.map(region => {
              const group = groups.find(item => item.id === region.id)!;
              return <g key={region.id} className={active === region.id ? 'is-selected' : ''} role="button" tabIndex={0}
                aria-label={`${group.province} ${group.name}`} aria-pressed={active === region.id}
                onMouseEnter={() => setActive(region.id)} onFocus={() => setActive(region.id)} onClick={() => setActive(region.id)}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActive(region.id); } }}>
                <path d={region.path}/><circle cx={region.x} cy={region.y-26} r="5"/>
                <text x={region.x} y={region.y} textAnchor="middle">{group.province}</text>
                <text className="ref-map-group" x={region.x} y={region.y+22} textAnchor="middle">{group.name}</text>
              </g>;
            })}
          </svg>
          <p className="ref-map-caption">แผนผังเพื่อสำรวจเรื่องราว ไม่ใช่ขอบเขตภูมิศาสตร์</p>
        </div>
        <div className="ref-province-panel">
          <div className="ref-province-list" aria-label="เลือกจังหวัด">{regions.map((region, index) => {
            const group = groups.find(item => item.id === region.id)!;
            return <button type="button" key={group.id} className={active === group.id ? 'is-selected' : ''} aria-pressed={active === group.id} onClick={() => setActive(group.id)} onMouseEnter={() => setActive(group.id)}><span>0{index+1}</span><strong>{group.province}<small>{group.name}</small></strong><Arrow diagonal/></button>;
          })}</div>
          <div className="ref-province-story" aria-live="polite"><span><MapPin size={16} aria-hidden="true"/> {selected.province}</span><h3>{selected.name}</h3><p>{selected.summary}</p><a className="mh-text-link" href={`#ethnic/${selected.id}`}>สำรวจชุมชน <Arrow/></a></div>
        </div>
      </div>
    </div>
  </section>;
}
