'use strict';

const image = name => 'assets/images/' + name;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (name, size = 20) => {
  const paths = {
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>', left:'<path d="m14 6-6 6 6 6"/>', right:'<path d="m9 6 6 6-6 6"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    book:'<path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',
    food:'<path d="M5 3v7m3-7v7m-6-7v7c0 3 6 3 6 0M5 13v8M19 3c-4 3-4 7 0 9V3Zm0 9v9"/>',
    home:'<path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7"/>',
    shirt:'<path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4c0 4-8 4-8 0Z"/>',
    leaf:'<path d="M20 3C8 2 2 8 5 15c3 7 15 3 15-12Z M4 21 16 8"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    pause:'<path d="M9 5v14M15 5v14"/>', play:'<path d="m8 4 12 8-12 8Z"/>',
    camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3Z"/><circle cx="12" cy="13" r="4"/>',
    note:'<rect x="5" y="3" width="14" height="19" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>', heart:'<path d="M12 21 3 12C-3 3 9 0 12 7c3-7 15-4 9 5Z"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
};

const groupIdentity = [
  {id:'khmer',name:'เขมรถิ่นไทย',province:'สุรินทร์',image:'ethnic_khmer_surin_1790134395417.jpg'},
  {id:'lao',name:'ไทย–ลาว',province:'บุรีรัมย์',image:'ethnic_thai_lao_buriram_1790134409548.jpg'},
  {id:'nyahkur',name:'ญัฮกุร',province:'ชัยภูมิ',image:'ethnic_nyah_kur_chaiyaphum_1790134421183.jpg'},
  {id:'yuan',name:'ไทย–ยวน',province:'นครราชสีมา',image:'ethnic_thai_yuan_korat_1790134431844.jpg'},
];
const groups = groupIdentity.map(g => ({...g, ...window.HERITAGE_DEMO.groups.find(d => d.id === g.id)}));
const foodImages = {khmer:'food_boh_dong_1790134449906.jpg',lao:'food_khao_hang_1790134490355.jpg',nyahkur:'food_sweet_vegetable_soup_1790134476707.jpg',yuan:'food_a_sek_dam_1790134463719.jpg'};
const foods = window.HERITAGE_DEMO.foods.map(f => ({...f, image:foodImages[f.group]}));
const historyFields = ['ประวัติความเป็นมา','1.1 ชื่อกลุ่มชาติพันธุ์','1.2 ชื่อเรียกตนเอง','1.3 ชื่อที่บุคคลภายนอกเรียก','1.4 จังหวัด','อำเภอ','ตำบล / ชุมชน','หมู่บ้าน / สถานที่ตั้ง','1.5 ภาษา','1.6 ตระกูลภาษา','1.7 จำนวนประชากร','จำนวนครัวเรือน','1.8 ศาสนา / ความเชื่อ'];
const lifeFields = ['2.1 ที่อยู่และลักษณะบ้านเรือน','2.2 การแต่งกาย','2.3 อาชีพหลัก','อาชีพเสริม','2.4 วัฒนธรรมและประเพณีที่สำคัญ','ศูนย์การเรียนรู้','ผลิตภัณฑ์ชุมชน','2.5 อาหารการกิน','พืชผลทางการกิน','วัตถุดิบอาหาร','วิธีประกอบอาหาร','ความเชื่อในเรื่องอาหาร','เมนูอาหารชาติพันธุ์','การพัฒนาเมนูชาติพันธุ์ในโครงการ'];
const sourceFields = ['แหล่งข้อมูล','รายชื่อผู้ให้ข้อมูล','วันที่สำรวจ','พิกัดละติจูด','พิกัดลองจิจูด','การเดินทาง','ผู้รับผิดชอบ (PIC)','งาน / โครงการ','ภาพบ้านเรือน / เครื่องแต่งกาย / งานประเพณี','ภาพวัตถุดิบ / เมนู / ผลิตภัณฑ์','ลิงก์คลิป / บันทึกเสียง / เอกสาร','VDO บรรยากาศในโครงการ','โน้ตเพิ่มเติม'];
window.HeritageHome.mountHeader(document.querySelector('#heritage-header-root'));
const app = document.querySelector('#app');
const header = document.querySelector('#site-header');
const headerToggle = document.querySelector('#heritage-toggle');
const headerMobilePanel = document.querySelector('#heritage-mobile-panel');
function setHeaderMenu(open, restoreFocus = false) {
  headerToggle.setAttribute('aria-expanded', String(open));
  headerToggle.setAttribute('aria-label', open ? 'ปิดเมนูหลัก' : 'เปิดเมนูหลัก');
  headerMobilePanel.hidden = !open;
  if (restoreFocus) headerToggle.focus();
}
headerToggle.addEventListener('click', () => setHeaderMenu(headerToggle.getAttribute('aria-expanded') !== 'true'));
header.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !headerMobilePanel.hidden) {
    e.preventDefault();
    setHeaderMenu(false, true);
  }
});
header.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (link && !headerMobilePanel.hidden) setHeaderMenu(false, link.hash === location.hash);
});
header.addEventListener('focusout', e => {
  if (e.relatedTarget && !header.contains(e.relatedTarget)) setHeaderMenu(false);
});
document.addEventListener('pointerdown', e => {
  if (!header.contains(e.target)) setHeaderMenu(false);
});
matchMedia('(min-width: 1024px)').addEventListener('change', e => {
  if (e.matches) {
    const focusWasMobile = headerMobilePanel.contains(document.activeElement) || document.activeElement === headerToggle;
    setHeaderMenu(false);
    if (focusWasMobile) header.querySelector('.heritage-brand').focus();
  }
});
const ui = {query:'', province:'', foodQuery:'', foodGroup:'', foodProvince:'', foodSort:'recommended', foodView:'grid'};
const sessionDrafts = {};
let routeCleanup = () => {};

function readRecords() {
  try { const r = JSON.parse(localStorage.getItem('isan-records-v1') || '{}'); return r && typeof r === 'object' && !Array.isArray(r) ? r : {}; }
  catch { return {}; }
}
function known(value) { return value && !String(value).startsWith('รอ'); }
function defaults(g) {
  const f = foods.find(x => x.group === g.id);
  return {
    'ประวัติความเป็นมา':g.history.join('\n\n'),'1.1 ชื่อกลุ่มชาติพันธุ์':g.name,'1.2 ชื่อเรียกตนเอง':g.selfName,'1.3 ชื่อที่บุคคลภายนอกเรียก':g.externalName,'1.4 จังหวัด':g.province,
    'อำเภอ':g.location.district,'ตำบล / ชุมชน':g.location.subdistrict,'หมู่บ้าน / สถานที่ตั้ง':g.location.village,'1.5 ภาษา':g.language,'1.6 ตระกูลภาษา':g.family,'1.8 ศาสนา / ความเชื่อ':g.beliefs,
    '2.1 ที่อยู่และลักษณะบ้านเรือน':known(g.housing)?g.housing:'','2.2 การแต่งกาย':known(g.dress)?g.dress:'','2.3 อาชีพหลัก':known(g.occupation)?g.occupation:'','อาชีพเสริม':known(g.secondaryOccupation)?g.secondaryOccupation:'',
    '2.4 วัฒนธรรมและประเพณีที่สำคัญ':g.traditions,'ผลิตภัณฑ์ชุมชน':known(g.products)?g.products:'','2.5 อาหารการกิน':g.foodIntro,'วัตถุดิบอาหาร':f.ingredients.join('\n'),'วิธีประกอบอาหาร':f.steps.join('\n'),'ความเชื่อในเรื่องอาหาร':f.context,'เมนูอาหารชาติพันธุ์':f.name,
    'แหล่งข้อมูล':g.sources.map(s=>`${s.title}\n${s.url}`).join('\n\n'),'โน้ตเพิ่มเติม':'ข้อมูลสาธิตจากเอกสารสาธารณะ ไม่ใช่ผลสำรวจของโครงการ',
  };
}
function record(g) {
  const saved=sessionDrafts[g.id] || readRecords()[g.id];
  const clean= saved && typeof saved==='object' && !Array.isArray(saved) ? Object.fromEntries(Object.entries(saved).filter(([k,v])=>typeof v==='string' && (saved.__version===2 || v.trim()))) : {};
  return {...defaults(g), ...clean};
}
const groupById = id => groups.find(g=>g.id===id);
const note = text => `<div class="demo-note">${icon('info',18)}<span>${text}</span></div>`;
const sources = list => `<ol class="source-list">${list.map(s=>`<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title)}</a></li>`).join('')}</ol>`;
function foodCards(list) {
  return list.map(f=>`<article class="food-card"><a class="food-card-image" href="#food/${f.id}" aria-label="อ่านเรื่อง${f.name}"><img src="${image(f.image)}" alt="ภาพประกอบอาหารพื้นถิ่น ไม่ใช่ภาพเมนูจริง" loading="lazy" width="1000" height="700"><span class="image-caption">ภาพประกอบ</span></a><div class="food-card-body"><span class="pill">${groupById(f.group).name}</span><h3><a href="#food/${f.id}">${f.name}</a></h3><p>${escapeHtml(f.subtitle)}</p><a class="text-link" href="#food/${f.id}">อ่านเรื่องราวและวิธีทำ ${icon('arrow',17)}</a></div></article>`).join('');
}
function factGrid(entries) { return `<dl class="fact-grid">${entries.map(([label,value])=>`<div class="fact"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value||'ยังไม่มีข้อมูลสำรวจ')}</dd></div>`).join('')}</dl>`; }
function ethnicDetail(g) {
  const d=record(g),life=[['home','บ้านเรือน','2.1 ที่อยู่และลักษณะบ้านเรือน'],['shirt','เครื่องแต่งกาย','2.2 การแต่งกาย'],['leaf','การทำมาหากิน','2.3 อาชีพหลัก'],['heart','ประเพณีและความเชื่อ','2.4 วัฒนธรรมและประเพณีที่สำคัญ']].filter(x=>known(d[x[2]]));
  return `<section class="page-hero"><img src="${image(g.image)}" alt="ภาพประกอบ${g.name}"><div class="container page-hero-content"><span class="eyebrow">จังหวัด${g.province}</span><h1>${g.name}</h1><p class="lead">${escapeHtml(g.summary)}</p></div></section><nav class="subnav" aria-label="หัวข้อข้อมูลชาติพันธุ์"><div class="container">${[['history','ประวัติความเป็นมา','book'],['basic','ข้อมูลพื้นฐาน','note'],['life','วิถีชีวิต','home'],['food-story','อาหาร','food'],['sources','แหล่งข้อมูล','pin']].map(([id,label,i])=>`<a href="#ethnic/${g.id}" data-scroll="${id}">${icon(i,17)}${label}</a>`).join('')}</div></nav>
  <div class="container detail-layout"><div>${note('ข้อมูลสาธิตจากแหล่งอ้างอิง • ภาพประกอบจากเว็บไซต์เดิม ไม่ใช่หลักฐานภาคสนาม')}<section class="article-section" id="history"><span class="eyebrow">01 · ประวัติความเป็นมา</span><h2>เรื่องราวของ${g.name}</h2>${d['ประวัติความเป็นมา'].split('\n').filter(Boolean).map(p=>`<p>${escapeHtml(p)}</p>`).join('')}</section>
  <section class="article-section" id="basic"><span class="eyebrow">02 · รู้จักชุมชน</span><h2>ข้อมูลพื้นฐาน</h2>${factGrid([['ชื่อกลุ่มชาติพันธุ์',d['1.1 ชื่อกลุ่มชาติพันธุ์']],['ชื่อเรียกตนเอง',d['1.2 ชื่อเรียกตนเอง']],['ชื่อที่บุคคลภายนอกเรียก',d['1.3 ชื่อที่บุคคลภายนอกเรียก']],['จังหวัด',d['1.4 จังหวัด']],['ภาษา',d['1.5 ภาษา']],['ตระกูลภาษา',d['1.6 ตระกูลภาษา']],['ชุมชนตัวอย่าง',`${d['หมู่บ้าน / สถานที่ตั้ง']} · ต.${d['ตำบล / ชุมชน']} · อ.${d['อำเภอ']}`],['ศาสนา / ความเชื่อ',d['1.8 ศาสนา / ความเชื่อ']]])}<p class="location-note">ใช้ชุมชนตัวอย่างเพื่อการเรียนรู้ ลักษณะทางวัฒนธรรมอาจแตกต่างกันในแต่ละพื้นที่</p></section>
  <section class="article-section" id="life"><span class="eyebrow">03 · ชีวิตประจำวัน</span><h2>วิถีชีวิตและวัฒนธรรม</h2><div class="life-grid">${life.map(([i,title,key])=>`<article class="life-card">${icon(i,28)}<h3>${title}</h3><p>${escapeHtml(d[key])}</p></article>`).join('')}</div>${known(d['ผลิตภัณฑ์ชุมชน'])?`<div class="fieldwork-details"><h3>ภูมิปัญญาและผลิตภัณฑ์</h3><p>${escapeHtml(d['ผลิตภัณฑ์ชุมชน'])}</p>${known(d['อาชีพเสริม'])?`<p>${escapeHtml(d['อาชีพเสริม'])}</p>`:''}</div>`:''}</section>
  <section class="article-section" id="food-story"><span class="eyebrow">04 · วัฒนธรรมอาหาร</span><h2>รสชาติจากชุมชน</h2><p>${escapeHtml(d['2.5 อาหารการกิน'])}</p><div class="detail-food-grid">${foodCards(foods.filter(f=>f.group===g.id))}</div>${known(d['การพัฒนาเมนูชาติพันธุ์ในโครงการ'])?`<div class="fieldwork-details"><h3>การพัฒนาเมนูในโครงการ</h3><p>${escapeHtml(d['การพัฒนาเมนูชาติพันธุ์ในโครงการ'])}</p></div>`:''}</section>
  <section class="article-section" id="sources"><span class="eyebrow">05 · อ่านต่อ</span><h2>แหล่งข้อมูล</h2>${sources(g.sources)}<details class="fieldwork-details"><summary>ข้อมูลสำรวจและสื่อของโครงการ</summary><p>ส่วนนี้เก็บข้อมูลที่ผู้รับผิดชอบบันทึกเพิ่มเติมในเครื่องนี้ แยกจากข้อมูลสาธิต</p>${factGrid([...historyFields.filter(f=>f.includes('จำนวน')), ...sourceFields].map(f=>[f,d[f]]))}<a class="button outline" href="#archive/${g.id}" style="margin-top:20px">เพิ่มข้อมูลสำรวจ</a></details></section></div>
  <aside class="detail-aside"><div class="aside-card"><img src="${image(g.image)}" alt="ภาพประกอบชุมชน" loading="lazy"><div class="aside-card-content"><span class="eyebrow">ชุมชนตัวอย่าง</span><h3>${escapeHtml(g.location.village)}</h3><p>อำเภอ${escapeHtml(g.location.district)}<br>จังหวัด${g.province}</p><a class="button outline" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.location.village+' '+g.location.district+' '+g.province)}" target="_blank" rel="noopener">${icon('pin',17)}ค้นหาบนแผนที่</a><p class="location-note">ผลค้นหาจากชื่อสถานที่</p></div></div><div class="aside-card"><div class="aside-card-content"><h3>สำรวจชาติพันธุ์อื่น</h3><ul class="aside-links">${groups.filter(x=>x.id!==g.id).map(x=>`<li><a href="#ethnic/${x.id}"><span>${x.name}<br><small class="muted">${x.province}</small></span>${icon('right',16)}</a></li>`).join('')}</ul></div></div></aside></div>`;
}
function foodDetail(f) {
  const g=groupById(f.group),d=record(g),saved=readRecords()[g.id]||{},ingredients=saved['วัตถุดิบอาหาร']?saved['วัตถุดิบอาหาร'].split('\n').filter(Boolean):f.ingredients,steps=saved['วิธีประกอบอาหาร']?saved['วิธีประกอบอาหาร'].split('\n').filter(Boolean):f.steps;
  return `<article class="container food-detail"><div class="food-heading"><figure class="food-visual"><img src="${image(f.image)}" alt="ภาพประกอบบรรยากาศอาหารพื้นถิ่น"><figcaption>ภาพประกอบจากโครงการเดิม ไม่ใช่ภาพของเมนู${f.name}</figcaption></figure><div><span class="eyebrow">${g.province} · ${g.name}</span><span class="pill">เมนูสาธิตจากแหล่งอ้างอิง</span><h1>${f.name}</h1><p class="lead">${escapeHtml(f.description)}</p><div class="food-meta"><span>${icon('pin',18)}${g.province}</span><span>${icon('book',18)}เรื่องราวและวัฒนธรรมอาหาร</span></div><div class="actions"><a class="button" href="#food/${f.id}" data-scroll="recipe">อ่านเรื่องราวและวิธีทำ</a><a class="text-link" href="#ethnic/${g.id}">รู้จัก${g.name} ${icon('arrow',17)}</a></div></div></div>
  <div class="food-content" id="recipe"><aside class="ingredients"><span class="eyebrow">จากธรรมชาติสู่สำรับ</span><h2>วัตถุดิบ</h2>${ingredients.length?`<ul>${ingredients.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:`<p class="location-note">แหล่งข้อมูลนี้บันทึกบทบาทของอาหารในงานบุญ ยังไม่ระบุสูตรและสัดส่วนวัตถุดิบ</p>`}</aside><div><section class="recipe-section"><h2>${steps.length?'วิธีประกอบอาหาร':'เรื่องราวของเมนู'}</h2>${steps.length?`<ol class="steps">${steps.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol><p class="location-note">วิธีทำโดยสรุปจากเอกสาร สัดส่วนและเครื่องปรุงอาจแตกต่างตามผู้ปรุง</p>`:`<p>${escapeHtml(f.description)}</p><p>เมนูนี้เปิดให้เรียนรู้บริบททางวัฒนธรรม รายละเอียดสูตรสามารถบันทึกเพิ่มเติมร่วมกับผู้ปรุงในชุมชน</p>`}</section><section class="recipe-section"><h2>อาหารกับวิถีชีวิต</h2><p>${escapeHtml(d['ความเชื่อในเรื่องอาหาร']||f.context)}</p></section><section class="recipe-section"><h2>การพัฒนาเมนูในโครงการ</h2><p>${escapeHtml(d['การพัฒนาเมนูชาติพันธุ์ในโครงการ']||'พื้นที่บันทึกการทดลองปรับวัตถุดิบ วิธีปรุง และการจัดสำรับร่วมกับชุมชน โดยยังไม่มีผลการทดลองของโครงการในฉบับสาธิตนี้')}</p><a class="text-link" href="#archive/${g.id}">เพิ่มบันทึกการพัฒนาเมนู ${icon('arrow',17)}</a></section><section class="recipe-section"><h2>ที่มาของเรื่องราว</h2>${sources([f.source])}</section><a class="button outline" href="#food">${icon('left',17)}กลับไปอาหารทั้งหมด</a></div></div></article><section class="section food-section"><div class="container"><div class="section-heading"><div><span class="eyebrow">ค้นพบต่อ</span><h2>เรื่องราวจากสำรับอื่น</h2></div></div><div class="food-grid">${foodCards(foods.filter(x=>x.id!==f.id))}</div></div></section>`;
}
function archive(g) {
  const d=record(g);
  const fields=(label,list,open)=>`<details class="form-group" ${open?'open':''}><summary>${label}</summary><div class="form-fields">${list.map(key=>`<label>${key}${key==='วันที่สำรวจ'?`<input name="${key}" type="date" value="${escapeHtml(d[key])}">`:`<textarea name="${key}" placeholder="เพิ่มข้อมูล${escapeHtml(key.replace(/^\d[.\d]*\s/,''))}">${escapeHtml(d[key])}</textarea>`}</label>`).join('')}</div></details>`;
  return `<section class="container page-section"><div class="page-heading"><span class="eyebrow">บันทึกและส่งต่อ</span><h1>คลังข้อมูลสำรวจ</h1><p class="lead">จัดเก็บเรื่องราว ประวัติ วิถีชีวิต และอาหารของชุมชนตามกรอบข้อมูลโครงการ</p></div>${note('แบบบันทึกเริ่มต้นด้วยข้อมูลสาธิต แก้ไขและบันทึกในเบราว์เซอร์เครื่องนี้ หรือดาวน์โหลด JSON เพื่อสำรองได้')}<div class="archive-layout"><aside class="archive-sidebar"><label for="record-group" class="field-label">ชาติพันธุ์ที่ต้องการบันทึก</label><select id="record-group">${groups.map(x=>`<option value="${x.id}" ${g.id===x.id?'selected':''}>${x.name} · ${x.province}</option>`).join('')}</select><p>ข้อมูลผู้ให้ข้อมูลและสื่อควรได้รับความยินยอมก่อนเผยแพร่</p><a class="text-link" href="#ethnic/${g.id}">ดูหน้าชาติพันธุ์ ${icon('arrow',17)}</a></aside><form id="record-form">${fields('1. ประวัติและข้อมูลพื้นฐาน',historyFields,true)}${fields('2. วิถีชีวิตและอาหาร',lifeFields,false)}${fields('3. สื่อและแหล่งข้อมูล',sourceFields,false)}<div class="form-actions"><button class="button" type="submit">บันทึกข้อมูล</button><button class="button outline" type="button" id="export">${icon('download',17)}ดาวน์โหลด JSON</button><p id="save-status" class="save-status" role="status"></p></div></form></div></section>`;
}
function setupForm(g) {
  const form=document.querySelector('#record-form');let dirty=false;
  form.addEventListener('input',()=>{dirty=true;document.querySelector('#save-status').textContent='มีการแก้ไขที่ยังไม่ได้บันทึก';});
  const collect=()=>Object.fromEntries(new FormData(form));
  const save=()=>{const draft={...collect(),__version:2};sessionDrafts[g.id]=draft;try{const all=readRecords();all[g.id]=draft;localStorage.setItem('isan-records-v1',JSON.stringify(all));delete sessionDrafts[g.id];dirty=false;document.querySelector('#save-status').textContent='บันทึกในเครื่องนี้แล้ว · เปิดหน้าชาติพันธุ์เพื่อดูข้อมูล';return true;}catch{document.querySelector('#save-status').textContent='เก็บชั่วคราวระหว่างเปิดเว็บนี้แล้ว โปรดดาวน์โหลด JSON ก่อนปิดหน้า';return false;}};
  if(sessionDrafts[g.id]){dirty=true;document.querySelector('#save-status').textContent='มีฉบับร่างชั่วคราว โปรดดาวน์โหลด JSON เพื่อเก็บข้อมูลก่อนปิดหน้า';}
  form.addEventListener('submit',e=>{e.preventDefault();save();});
  // Preserve edits when switching groups or routes, without leaving a blocking dialog.
  const autosave=()=>{if(dirty)save();};
  document.querySelector('#record-group').addEventListener('change',e=>{autosave();location.hash='archive/'+e.target.value;});
  document.querySelector('#export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({schemaVersion:1,ethnicId:g.id,exportedAt:new Date().toISOString(),data:collect()},null,2)],{type:'application/json;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='isan-survey-'+g.id+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);document.querySelector('#save-status').textContent='สร้างไฟล์ JSON สำหรับดาวน์โหลดแล้ว';};
  const unload=e=>{if(dirty&&!save()){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',unload);
  routeCleanup=()=>{autosave();window.removeEventListener('beforeunload',unload);};
}
function route(initial=false) {
  routeCleanup();routeCleanup=()=>{};
  const [rawPage,id,section]=location.hash.slice(1).split('/'),page=rawPage||'home';
  let title='',content='';
  if(page==='home'){content='<div id="museum-home-root"></div>';}
  else if(page==='ethnic'){const g=groupById(id);content=id?(g?'<div id="museum-detail-root"></div>':notFound()):'<div id="ethnic-catalog-root"></div>';title=g?g.name:'ชาติพันธุ์';}
  else if(page==='food'){const f=foods.find(f=>f.id===id);content=id?(f?foodDetail(f):notFound()):'<div id="food-catalog-root"></div>';title=f?f.name:'อาหารพื้นถิ่น';}
  else if(page==='activities'){const activity=window.HeritageHome.activitySlides.find(item=>item.id===id);content=!id||activity?'<div id="activities-page-root"></div>':notFound();title=activity?.title||'ข่าวสารและกิจกรรม';}
  else if(page==='archive'){const g=groupById(id)||groups[0];content=archive(g);title='คลังข้อมูลสำรวจ';}
  else{content=notFound();title='ไม่พบหน้า';}
  document.body.classList.toggle('home-is-museum',page==='home'||(page==='ethnic'&&!!groupById(id)));
  document.body.classList.toggle('activity-detail-page',page==='activities' && !!window.HeritageHome.activitySlides.find(item=>item.id===id)); 
  document.body.classList.toggle('activity-news-route',page==='activities');
  app.innerHTML=content;document.title=(title?title+' · ':'')+'ชาติพันธุ์นครชัยบุรินทร์';
  setHeaderMenu(false);
  document.querySelectorAll('#site-header [data-nav-link]').forEach(a=>{const active=a.hash==='#'+page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  window.scrollTo({top:0,behavior:'instant'});if(!initial)app.focus({preventScroll:true});
  if(page==='home'){window.HeritageHome.mount(document.querySelector('#museum-home-root'),{groups,foods});routeCleanup=()=>window.HeritageHome.unmount();}
  if(page==='activities'&&document.querySelector('#activities-page-root')){window.HeritageHome.mountActivities(document.querySelector('#activities-page-root'),id);routeCleanup=()=>window.HeritageHome.unmount();}
  if(page==='ethnic'&&id&&groupById(id)){const g=groupById(id);window.HeritageHome.mountEthnic(document.querySelector('#museum-detail-root'),{groups,foods,group:g,record:record(g)});routeCleanup=()=>window.HeritageHome.unmount();}
  if(section)requestAnimationFrame(()=>document.getElementById(section)?.scrollIntoView({behavior:'instant'}));
  if(page==='ethnic'&&!id){window.HeritageHome.mountEthnicCatalog(document.querySelector('#ethnic-catalog-root'),{groups,initialQuery:ui.query,initialProvince:ui.province,onFiltersChange:(query,province)=>{ui.query=query;ui.province=province;}});routeCleanup=()=>window.HeritageHome.unmount();}
  if(page==='food'&&!id){window.HeritageHome.mountFoodCatalog(document.querySelector('#food-catalog-root'),{groups,foods,initialFilters:{query:ui.foodQuery,group:ui.foodGroup,province:ui.foodProvince,sort:ui.foodSort,view:ui.foodView},onFiltersChange:filters=>{ui.foodQuery=filters.query;ui.foodGroup=filters.group;ui.foodProvince=filters.province;ui.foodSort=filters.sort;ui.foodView=filters.view;}});routeCleanup=()=>window.HeritageHome.unmount();}
  if(page==='archive')setupForm(groupById(id)||groups[0]);
}
function notFound(){return `<section class="container page-section"><h1>ไม่พบหน้าที่ต้องการ</h1><p class="lead">เลือกเรื่องราวจากหน้าหลักเพื่อเริ่มสำรวจอีกครั้ง</p><a class="button" href="#home" style="margin-top:25px">กลับหน้าหลัก</a></section>`;}
document.addEventListener('click',e=>{
  if (e.target.closest('#site-header a[href="#home"]') && (!location.hash || location.hash === '#home')) { e.preventDefault(); window.scrollTo({top:0,behavior:'instant'}); app.focus({preventScroll:true}); }
  if(e.target.closest('.skip-link')){e.preventDefault();app.focus({preventScroll:true});app.scrollIntoView();return;}
  const anchor=e.target.closest('[data-scroll]');if(anchor){e.preventDefault();document.getElementById(anchor.dataset.scroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelectorAll('.subnav a').forEach(a=>a.classList.toggle('active',a===anchor));}
});
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>20),{passive:true});
window.addEventListener('hashchange',()=>route());
route(true);



// Include the floating header's top gap so page content clears the pill.
const headerSizeObserver = new ResizeObserver(()=>document.documentElement.style.setProperty('--header-height',(header.getBoundingClientRect().bottom + 12)+'px'));
headerSizeObserver.observe(header);
