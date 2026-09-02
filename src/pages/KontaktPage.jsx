import { useEffect } from "react";
import Kontakt from "../components/Kontakt.jsx";

export default function KontaktPage() {
  useEffect(() => {
    document.title = "Broski Detailing — Kontakt";
    return () => {
      document.title = "Broski Detailing — Wuppertal";
    };
  }, []);

  return (
    <div className="pt-16 md:pt-[73px]">
      <Kontakt />
    </div>
  );
}
