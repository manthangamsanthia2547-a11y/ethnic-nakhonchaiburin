import {createRoot,type Root} from 'react-dom/client';
import {flushSync} from 'react-dom';
import HomePage from './views/HomePage';
import EthnicDetailPage from './views/EthnicDetailPage';
import ActivitiesPage from './views/ActivitiesPage';
import ActivityDetailPage from './views/ActivityDetailPage';
import FoodCatalogPage, { type FoodCatalogPageProps } from './views/FoodCatalogPage';
import EthnicCatalogPage from './views/EthnicCatalogPage';
import { activityStories } from './data/activityStories';
import Header from './components/Header';
import Footer from './components/Footer';
import type {HomePageProps,HeritageGroup} from './types';
export { activities as activitySlides } from './data/activities';
let root:Root|null=null;
let headerRoot:Root|null=null;
export function mountHeader(container:HTMLElement){
 headerRoot?.unmount();headerRoot=createRoot(container);
 flushSync(()=>headerRoot!.render(<Header/>));
}
export function mount(container:HTMLElement,data:HomePageProps){
 unmount();root=createRoot(container);flushSync(()=>root!.render(<HomePage {...data}/>));
}
export function mountEthnic(container:HTMLElement,data:HomePageProps&{group:HeritageGroup;record:Record<string,string>}){
 unmount();root=createRoot(container);flushSync(()=>root!.render(<><EthnicDetailPage {...data}/><div className="museum-home"><Footer/></div></>));
}
export function mountActivities(container:HTMLElement,id?:string){
 unmount();root=createRoot(container);
 const activity=activityStories.find(item=>item.id===id);
 flushSync(()=>root!.render(activity?<ActivityDetailPage key={activity.id} activity={activity}/>:<ActivitiesPage/>));
}
export function mountFoodCatalog(container:HTMLElement,data:FoodCatalogPageProps){
 unmount();root=createRoot(container);flushSync(()=>root!.render(<FoodCatalogPage {...data}/>));
}
export function mountEthnicCatalog(container:HTMLElement,data:{groups:HeritageGroup[];initialQuery?:string;initialProvince?:string;onFiltersChange?:(query:string,province:string)=>void}){
 unmount();root=createRoot(container);flushSync(()=>root!.render(<EthnicCatalogPage {...data}/>));
}
export function unmount(){root?.unmount();root=null;}
