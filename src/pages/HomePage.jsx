import { useEffect } from "react";
import Hero from "../components/Hero.jsx";
import Kalkulator from "../components/Kalkulator.jsx";
import WarumBroski from "../components/WarumBroski.jsx";
import ScrollVideoScrub from "../components/ScrollVideoScrub.tsx";

export default function HomePage() {
  // Landing here with a hash (a fresh load from "/#leistungen", including
  // the full-page navigation a plain <a> makes from another route) races
  // the browser's native hash-scroll against React actually rendering the
  // target section, so it loses. Scroll to it ourselves once mounted.
  useEffect(() => {
    if (!window.location.hash) return;
    document
      .getElementById(window.location.hash.slice(1))
      ?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  return (
    <>
      <Hero />
      <WarumBroski />
      <ScrollVideoScrub
        videoSrc="/davinci-scrub-2.mp4"
        eyebrow="Detailing"
        beforeLabel="Vorher"
        afterLabel="Nachher"
      />
      <Kalkulator />
    </>
  );
}
