import { Arrow, image } from './ui';
import type { HomePageProps } from '../types';

export default function FoodStories({ groups, foods }: HomePageProps) {
  return <section className="original-food" aria-labelledby="original-food-title">
    <div className="original-shell">
      <div className="original-food-heading">
        <div><p className="original-kicker">อาหารพื้นถิ่น</p><h2 id="original-food-title">รสชาติที่บอกเล่าเรื่องราว</h2><p>เมนูอาหารชาติพันธุ์จากวัตถุดิบท้องถิ่น ที่สืบทอดภูมิปัญญามายาวนาน</p></div>
        <a className="original-text-link" href="#food">ดูอาหารทั้งหมด <Arrow /></a>
      </div>
      <div className="original-food-grid">
        {foods.map(food => {
          const group = groups.find(item => item.id === food.group);
          return <a className="original-food-card" key={food.id} href={`#food/${food.id}`}>
            <div className="original-food-image"><img src={image(food.image)} alt="ภาพประกอบอาหารพื้นถิ่น ไม่ใช่ภาพเมนูจริง" loading="lazy" /></div>
            <div className="original-food-caption"><div><h3>{food.name}</h3><p>{group?.name} · {group?.province}</p></div><span className="original-food-arrow"><Arrow /></span></div>
          </a>;
        })}
      </div>
      <p className="original-image-note">ภาพอาหารเป็นภาพประกอบจากชุดเดิม · ที่มาของข้อมูลอยู่ในหน้าเมนู</p>
    </div>
  </section>;
}

