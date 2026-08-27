import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import GooFilter from "./components/GooFilter.jsx";
import HomePage from "./pages/HomePage.jsx";
import GewerbekundenPage from "./pages/GewerbekundenPage.jsx";
import FaqPage from "./pages/FaqPage.jsx";

function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // A hash in the URL means something else (the target page's own
    // mount effect, or the browser's native handling) is responsible for
    // scrolling to that element — jumping to the top first would fight it.
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-dvh bg-bg">
      <GooFilter />
      <ScrollToTopOnNavigate />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gewerbekunden" element={<GewerbekundenPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
