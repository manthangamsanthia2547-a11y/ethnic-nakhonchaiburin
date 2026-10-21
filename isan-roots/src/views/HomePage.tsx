import type { HomePageProps } from '../types';
import HeroSection from '../components/HeroSection';
import ActivityNewsSection from '../components/ActivityNewsSection';
import IntroductionSection from '../components/IntroductionSection';
import EthnicStories from '../components/EthnicStories';
import FoodStories from '../components/FoodStories';
import ArchiveSection from '../components/ArchiveSection';
import Footer from '../components/Footer';

/** Project updates follow the original introduction. */
export default function HomePage({ groups, foods }: HomePageProps) {
  return <div className="museum-home restored-home">
    <HeroSection />
    <IntroductionSection />
    <ActivityNewsSection />
    <EthnicStories groups={groups} />
    <FoodStories groups={groups} foods={foods} />
    <ArchiveSection groups={groups} foods={foods} compact />
    <Footer />
  </div>;
}

