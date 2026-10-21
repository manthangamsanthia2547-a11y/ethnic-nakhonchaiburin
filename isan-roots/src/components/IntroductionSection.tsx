import { Arrow, image } from './ui';

export default function IntroductionSection() {
  return <section className="original-intro" aria-labelledby="original-intro-title">
    <div className="original-shell original-intro-layout">
      <div className="original-intro-copy">
        <p className="original-kicker">เกี่ยวกับโครงการ</p>
        <h2 id="original-intro-title">ค้นพบความหลากหลาย<br />ที่อยู่บนโต๊ะอาหาร</h2>
        <p>อาหารไม่ได้เป็นเพียงสิ่งที่เรารับประทาน<br className="original-desktop-break" />
          แต่ยังสะท้อนถึงวิถีชีวิต ความเชื่อ วัฒนธรรม<br className="original-desktop-break" />
          และภูมิปัญญาของผู้คนในแต่ละชุมชน</p>
        <a className="original-outline-button" href="#activities">เรียนรู้เพิ่มเติม <Arrow /></a>
      </div>
      <div className="original-collage" aria-label="ภาพประกอบอาหาร ชุมชน และวิถีชีวิต">
        <img className="original-collage-food" src={image('food_boh_dong_1790134449906.jpg')} alt="ภาพประกอบอาหารพื้นถิ่น" loading="lazy" />
        <img className="original-collage-village" src={image('archival_village_1790134516945.jpg')} alt="ภาพประกอบบ้านเรือนชุมชน" loading="lazy" />
        <img className="original-collage-culture" src={image('ethnic_thai_yuan_korat_1790134431844.jpg')} alt="ภาพประกอบวิถีชีวิต" loading="lazy" />
        <span className="original-collage-ornament" aria-hidden="true">✥</span>
      </div>
    </div>
  </section>;
}

