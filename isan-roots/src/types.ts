export interface HeritageGroup {
  id: string; name: string; province: string; image: string;
  summary: string; history: string[]; language: string; family: string;
  beliefs: string; traditions: string; foodIntro: string;
  selfName?: string; externalName?: string; housing?: string; dress?: string;
  occupation?: string; secondaryOccupation?: string; products?: string;
  sources?: {title: string; url: string}[];
  location: { district: string; subdistrict: string; village: string };
}
export interface HeritageFood {
  id: string; group: string; name: string; subtitle: string; description: string;
  image: string; ingredients: string[]; steps: string[]; context: string;
}
export interface HomePageProps { groups: HeritageGroup[]; foods: HeritageFood[] }
