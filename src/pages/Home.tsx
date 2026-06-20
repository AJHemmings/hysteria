import StarField from '../components/ui/StarField';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import VideoSection from '../components/sections/VideoSection';
import GigDates from '../components/sections/GigDates';
import Contact from '../components/sections/Contact';

export default function Home() {

  return (
    <>
      <StarField />
      <Navbar visible={true} />
      <Hero />
      <AboutSection />
      <VideoSection />
      <GigDates />
      <Contact />
    </>
  );
}
