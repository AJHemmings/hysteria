import { useState, useCallback } from 'react';
import StarField from '../components/ui/StarField';
import SplashScreen from '../components/ui/SplashScreen';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import VideoSection from '../components/sections/VideoSection';
import GigDates from '../components/sections/GigDates';
import Contact from '../components/sections/Contact';

export default function Home() {
  const [splashComplete, setSplashComplete] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true);
  }, []);

  return (
    <>
      {!splashComplete && <SplashScreen onComplete={handleSplashComplete} />}
      <StarField />
      <Navbar visible={splashComplete} />
      <Hero />
      <VideoSection />
      <GigDates />
      <Contact />
    </>
  );
}
