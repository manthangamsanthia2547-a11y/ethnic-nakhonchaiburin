import {useEffect,useRef,useState,type FormEvent} from 'react';
import {Camera, Film, BookOpen, FileText} from 'lucide-react';
import type {HomePageProps, HeritageFood, HeritageGroup} from '../types';
import {Arrow,SearchIcon,NumberLabel,image} from './ui';
export default function ArchiveSection({groups,foods,compact=false}:HomePageProps & {compact?:boolean}){
const [query,setQuery]=useState('');
const [submittedQuery,setSubmittedQuery]=useState<string|null>(null);
const resultsRef=useRef<HTMLDivElement>(null);
useEffect(()=>{if(submittedQuery!==null)resultsRef.current?.focus({preventScroll:true});},[submittedQuery]);
  const matchingGroups = submittedQuery === null ? [] : groups.filter(g => `${g.name} ${g.province} ${g.summary} ${g.language} ${g.location.village}`.toLowerCase().includes(submittedQuery.toLowerCase()));
  const matchingFoods = submittedQuery === null ? [] : foods.filter(f => `${f.name} ${f.subtitle} ${groups.find(g=>g.id===f.group)?.name} ${groups.find(g=>g.id===f.group)?.province}`.toLowerCase().includes(submittedQuery.toLowerCase()));
  const search = (event: FormEvent) => { event.preventDefault(); setSubmittedQuery(query.trim()); };
  const foodMeta = (food: HeritageFood) => groups.find(g => g.id === food.group)!;

return (<section className={`mh-archive mh-section ${compact ? "original-search-strip" : ""}`} aria-labelledby="mh-archive-title"><div className="mh-shell"><div className="mh-archive-grid"><div>{!compact&&<NumberLabel number="06">คลังเรื่องราว / THE ARCHIVE</NumberLabel>}<h2 className="mh-display" id="mh-archive-title">{compact ? "ค้นหาข้อมูลที่คุณสนใจ" : <>ทุกการค้นพบ<br/>เริ่มจาก<span>ความสงสัย</span></>}</h2></div><div className="mh-archive-search"><p>ค้นหาชาติพันธุ์ จังหวัด ภาษา หรืออาหาร<br/>แล้วเริ่มต้นเรื่องราวที่คุณสนใจ</p><form className="mh-search-form" onSubmit={search} role="search"><label htmlFor="mh-search" className="sr-only">ค้นหาเรื่องราว</label><SearchIcon/><input id="mh-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="ลองค้นหา ญัฮกุร หรือ สุรินทร์"/><button type="submit" aria-label="ค้นหา"><Arrow/></button></form><div className="mh-search-suggestions"><span>ลองสำรวจ</span>{['สุรินทร์','ญัฮกุร','ซันลอเจก'].map(q=><button key={q} type="button" onClick={()=>{setQuery(q);setSubmittedQuery(q);}}>{q}</button>)}</div><a className="mh-text-link" href="#archive">เปิดคลังข้อมูลและบันทึกภาคสนาม <Arrow diagonal/></a></div></div>
        {submittedQuery!==null&&<div className="mh-search-results" ref={resultsRef} tabIndex={-1}><div className="mh-results-heading"><p role="status">พบ {matchingGroups.length+matchingFoods.length} เรื่องราว{submittedQuery?` สำหรับ “${submittedQuery}”`:''}</p><button type="button" onClick={()=>{setSubmittedQuery(null);setQuery('');document.getElementById('mh-search')?.focus();}}>ล้างการค้นหา ×</button></div>{matchingGroups.map(g=><a className="mh-search-result" key={g.id} href={`#ethnic/${g.id}`}><span className="mh-small-label">ชาติพันธุ์ · {g.province}</span><strong>{g.name}</strong><Arrow diagonal/></a>)}{matchingFoods.map(f=><a className="mh-search-result" key={f.id} href={`#food/${f.id}`}><span className="mh-small-label">อาหาร · {foodMeta(f).province}</span><strong>{f.name}</strong><Arrow diagonal/></a>)}{!matchingGroups.length&&!matchingFoods.length&&<p className="mh-no-results">ยังไม่พบเรื่องราวนี้ ลองค้นหาชื่อจังหวัด ชาติพันธุ์ หรืออาหารอื่น</p>}</div>}
        {!compact&&<ArchiveMedia groups={groups}/>}
      </div></section>);}

function ArchiveMedia({groups}:{groups:HeritageGroup[]}){
 const [category,setCategory]=useState('photos');
 const categories=[{id:'photos',label:'รูปภาพ',Icon:Camera},{id:'video',label:'วิดีโอ',Icon:Film},{id:'stories',label:'เรื่องเล่าชุมชน',Icon:BookOpen},{id:'documents',label:'เอกสารข้อมูล',Icon:FileText}];
 const sources=groups.flatMap(group=>(group.sources??[]).map(source=>({...source,group:group.name}))).filter((source,index,list)=>list.findIndex(item=>item.url===source.url)===index);
 return <div className="ref-media"><div className="ref-media-tabs" role="group" aria-label="ประเภทสื่อ">{categories.map(({id,label,Icon})=><button key={id} type="button" aria-pressed={category===id} onClick={()=>setCategory(id)}><Icon size={19} aria-hidden="true"/>{label}</button>)}</div>
 <div className="ref-media-content" aria-live="polite">
 {category==='photos'&&<div className="ref-photo-strip"><figure><img src="assets/project-cooking.jpg" alt="ภาพกิจกรรมทำอาหารจากโครงการ" loading="lazy"/><figcaption>การเรียนรู้ผ่านอาหาร · ภาพโครงการ</figcaption></figure><figure><img src={image('archival_village_1790134516945.jpg')} alt="ภาพประกอบบ้านเรือนชุมชน" loading="lazy"/><figcaption>บ้านเรือนและวิถีชีวิต · ภาพประกอบ</figcaption></figure><figure><img src={image(groups[2].image)} alt="ภาพประกอบวัฒนธรรมญัฮกุร" loading="lazy"/><figcaption>ผู้คนและเครื่องแต่งกาย · ภาพประกอบ</figcaption></figure></div>}
 {category==='video'&&<div className="ref-media-empty"><Film size={36} strokeWidth={1}/><div><h3>บันทึกภาพเคลื่อนไหวของชุมชน</h3><p>ยังไม่มีไฟล์วิดีโอในชุดข้อมูลนี้ สามารถเพิ่มลิงก์วิดีโอและบันทึกเสียงในคลังข้อมูลภาคสนาม</p><a className="mh-text-link" href="#archive">ไปยังคลังข้อมูล <Arrow/></a></div></div>}
 {category==='stories'&&groups.map(group=><a className="ref-media-source" key={group.id} href={`#ethnic/${group.id}`}><span>{group.province}</span><strong>{group.name}</strong><Arrow diagonal/></a>)}
 {category==='documents'&&sources.map(source=><a className="ref-media-source" key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.group}</span><strong>{source.title}</strong><Arrow diagonal/></a>)}
 </div></div>;
}
