import './home.css';
import './reference.css';
import './ethnic-detail.css';
import './restored-home.css';
import './activities.css';
import './activity-detail.css';
import './catalogs.css';
import './ethnic-catalog.css';
import * as HeritageHome from './main';

// Share the React views with the existing hash router, including its saved records.
Object.assign(window, { HeritageHome });

function loadClassicScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
    document.head.append(script);
  });
}

// Data must be ready before the existing router starts its initial render.
loadClassicScript('data.js')
  .then(() => loadClassicScript('app.js'))
  .catch(error => {
    console.error(error);
    const app = document.getElementById('app');
    if (app) app.textContent = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองเปิดหน้าเว็บอีกครั้ง';
  });
