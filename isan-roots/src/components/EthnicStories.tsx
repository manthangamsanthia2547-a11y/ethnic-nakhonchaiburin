import { Arrow, image } from './ui';
import type { HomePageProps } from '../types';

const accents = ['#bf6558', '#93a46e', '#c49a4d', '#709fba'];
export default function EthnicStories({ groups }: Pick<HomePageProps, 'groups'>) {
  return <section className="original-ethnic" aria-labelledby="original-ethnic-title">
    <div className="original-shell">
      <div className="original-centered-heading">
        <h2 id="original-ethnic-title">เรื่องราวจาก 4 ชาติพันธุ์</h2>
        <p>สัมผัสวิถีชีวิต อาหาร และวัฒนธรรมที่แตกต่าง แต่เชื่อมโยงกันคือผืนแผ่นดินอีสาน</p>
      </div>
      <div className="original-ethnic-grid">
        {groups.map((group, index) => <a key={group.id} className="original-ethnic-card" href={`#ethnic/${group.id}`}>
          <img src={image(group.image)} alt={`ภาพประกอบ${group.name}`} loading="lazy" />
          <div className="original-card-shade" />
          <div className="original-ethnic-caption">
            <div className="original-ethnic-name"><span style={{ color: accents[index] }} aria-hidden="true">✥</span><div><h3>{group.name}</h3><p>จังหวัด{group.province}</p></div></div>
            <span className="original-gold-button">สำรวจเรื่องราว <Arrow /></span>
          </div>
        </a>)}
      </div>
    </div>
  </section>;
}

