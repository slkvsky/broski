import { useEffect } from "react";
import Gewerbekunden from "../components/Gewerbekunden.jsx";

export default function GewerbekundenPage() {
  useEffect(() => {
    document.title = "Broski Detailing — Gewerbekunden";
    return () => {
      document.title = "Broski Detailing — Wuppertal";
    };
  }, []);

  return (
    <div className="pt-16 md:pt-[73px]">
      <Gewerbekunden />
    </div>
  );
}
