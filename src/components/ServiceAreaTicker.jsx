const CITIES = [
  "Wuppertal",
  "Solingen",
  "Remscheid",
  "Düsseldorf",
  "Essen",
  "Dortmund",
  "Duisburg",
  "Köln",
  "Bochum",
  "Hagen",
  "Velbert",
  "Mettmann",
  "Haan",
  "Ratingen",
  "Hilden",
  "Neuss",
];

function CityList({ hidden = false }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {CITIES.map((city, index) => (
        <span key={index} className="flex items-center">
          <span className="px-3 font-mono text-[11px] uppercase tracking-wider text-ink-soft sm:px-5 sm:text-xs sm:tracking-widest">
            {city}
          </span>
          <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export default function ServiceAreaTicker() {
  return (
    <div className="flex w-full items-center gap-2 overflow-hidden border-y border-line bg-bg-alt py-3 pl-4 sm:gap-4 md:pl-10">
      <span className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-wider text-accent sm:text-xs sm:tracking-widest">
        Mobiler Service in der Region
      </span>
      <div
        className="relative flex shrink-0 overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
      >
        <div className="flex shrink-0 animate-marquee">
          <CityList />
          <CityList hidden />
        </div>
      </div>
    </div>
  );
}
