import { activities } from '../data/activities';
import { Arrow } from './ui';

/** Project albums in the same four-column composition as the ethnic stories. */
export default function ActivityNewsSection() {
  return <section className="home-activity-news" aria-labelledby="home-activity-news-title">
    <div className="original-shell">
      <header className="home-activity-news-heading">
        <h2 id="home-activity-news-title">กิจกรรมและข่าวประชาสัมพันธ์</h2>
        <p>ติดตามภาพกิจกรรมและเรื่องราวจากชุมชนทั้ง 4 จังหวัด</p>
      </header>
      <div className="home-activity-news-grid">
        {activities.map(activity => {
          const [title, province] = activity.title.split(' · ');
          return <a className="home-activity-news-card" key={activity.id} href={`#activities/${activity.id}`}>
            <img src={activity.image} alt={activity.alt} loading="lazy" style={{objectPosition:activity.position}} />
            <span className="home-activity-news-shade" aria-hidden="true" />
            <div className="home-activity-news-caption">
              <h3>{title}</h3>
              <p>จังหวัด{province}</p>
              <span className="home-activity-news-button">ดูรายละเอียด <Arrow /></span>
            </div>
          </a>;
        })}
      </div>
      <div className="home-activity-news-more"><a href="#activities">ไปหน้ากิจกรรม <Arrow /></a></div>
    </div>
  </section>;
}
