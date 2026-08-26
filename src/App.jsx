import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import PlaceholderSection from "./components/PlaceholderSection.jsx";
import Footer from "./components/Footer.jsx";
import GooFilter from "./components/GooFilter.jsx";
import ScrollVideoScrub from "./components/ScrollVideoScrub.tsx";

export default function App() {
  return (
    <div className="min-h-dvh bg-bg">
      <GooFilter />
      <Header />
      <main>
        <Hero />
        <ScrollVideoScrub videoSrc="/davinci-scrub.mp4" />
        <PlaceholderSection id="leistungen" eyebrow="Leistungen" title="Platzhalter: Leistungen" />
        <PlaceholderSection id="galerie" eyebrow="Galerie" title="Platzhalter: Vorher/Nachher" alt />
        <PlaceholderSection id="ueber-uns" eyebrow="Über uns" title="Platzhalter: Über Kolya" />
        <PlaceholderSection id="kontakt" eyebrow="Kontakt" title="Platzhalter: Termin & Anfahrt" alt />
      </main>
      <Footer />
    </div>
  );
}
