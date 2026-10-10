export const CONTACT_EMAIL = "broski.detailingg@gmail.com";
export const CONTACT_PHONE = "+49 152 37880830";
export const CONTACT_PHONE_HREF = "tel:+4915237880830";
export const WHATSAPP_HREF = "https://wa.me/4915237880830";

export const VEHICLE_SIZES = [
  { id: "klein", label: "Kleinwagen", hint: "z. B. VW Polo, Toyota Yaris, MINI" },
  { id: "kompakt", label: "Kompaktklasse", hint: "z. B. VW Golf, Audi A3, BMW 1er" },
  { id: "mittel", label: "Mittelklasse", hint: "z. B. BMW 3er, Audi A4, Mercedes C-Klasse" },
  { id: "ober", label: "Oberklasse", hint: "z. B. BMW 5er, Audi A6, Mercedes E-Klasse" },
  { id: "suv", label: "SUV / Van", hint: "z. B. BMW X5, Mercedes GLE, VW Multivan" },
  { id: "transporter", label: "Transporter", hint: "z. B. VW Transporter, Mercedes Vito, Ford Transit" },
];

// Price tables keyed by vehicle-size id. `null` = no fixed price ("auf Anfrage").
const AUSSEN_PRICES = { klein: 49, kompakt: 55, mittel: 59, ober: 65, suv: 79, transporter: 79 };
const INNEN_PRICES = { klein: 89, kompakt: 95, mittel: 109, ober: 119, suv: 139, transporter: 149 };
const KOMPLETT_LACKSCHUTZ_PRICES = { klein: 333, kompakt: 354, mittel: 380, ober: 415, suv: 465, transporter: 474 };
const TIERHAAR_PRICES = { klein: 40, kompakt: 50, mittel: 60, ober: 70, suv: 80, transporter: 90 };
const ONE_STEP_POLITUR_PRICES = { klein: 159, kompakt: 169, mittel: 179, ober: 199, suv: 219, transporter: 249 };
const MOTORRAUM_PRICES = { klein: 50, kompakt: 50, mittel: 55, ober: 55, suv: 60, transporter: 60 };

function tablePrice(table) {
  return (sizeId) => table[sizeId] ?? null;
}

// Komplett-Aufbereitung = Innenraum + Außen − 10 %, computed live so it always
// tracks the Innenraum/Außen tables above.
function komplettPrice(sizeId) {
  const innen = INNEN_PRICES[sizeId];
  const aussen = AUSSEN_PRICES[sizeId];
  if (innen == null || aussen == null) return null;
  return Math.round((innen + aussen) * 0.9);
}

export const LEISTUNGEN = [
  {
    id: "innen",
    label: "Innenraum-Aufbereitung",
    description:
      "Gründliche Innenraumaufbereitung bis ins Detail – inklusive schwer zugänglicher Bereiche, Oberflächen, Polster, Teppiche, Leder und Scheiben.",
    getPrice: tablePrice(INNEN_PRICES),
  },
  {
    id: "aussen",
    label: "Außen-Aufbereitung",
    description:
      "Gründliche Außenaufbereitung bis ins Detail – von Felgen und Lack bis zu schwer zugänglichen Bereichen und typischen Ablagerungen.",
    getPrice: tablePrice(AUSSEN_PRICES),
  },
  {
    id: "komplett",
    label: "Komplett-Aufbereitung",
    description:
      "Das komplette Fahrzeug wird von innen und außen gründlich bis ins Detail aufbereitet. 10 % Preisvorteil gegenüber der Einzelbuchung.",
    getPrice: komplettPrice,
  },
  {
    id: "komplett-lackschutz",
    label: "Komplett-Aufbereitung + Lackschutz",
    description:
      "Komplett-Aufbereitung + One-Step-Politur + keramische Lackversiegelung – für mehr Glanz, ein verfeinertes Lackbild und langfristigen Lackschutz. Mehrstufige Lackkorrekturen sind nicht enthalten und werden individuell angeboten.",
    getPrice: tablePrice(KOMPLETT_LACKSCHUTZ_PRICES),
    includesExtraIds: ["one-step-politur"],
  },
];

export const EXTRAS = [
  {
    id: "tierhaar",
    label: "Tierhaarentfernung",
    description: "Preis richtet sich zusätzlich nach Menge und Aufwand.",
    getPrice: tablePrice(TIERHAAR_PRICES),
  },
  {
    id: "one-step-politur",
    label: "One-Step-Lackpolitur",
    description:
      "One-Step-Politur zur Verbesserung von Glanz und Lackbild. Das Fahrzeug muss sauber und frei von grobem Schmutz sein – auf Wunsch übernehmen wir die Außenwäsche vor der Politur.",
    getPrice: tablePrice(ONE_STEP_POLITUR_PRICES),
  },
  {
    id: "scheinwerfer",
    label: "Scheinwerferaufbereitung",
    description: "Aufbereitung der Scheinwerfer für klare Sicht und ein hochwertigeres Erscheinungsbild.",
    getPrice: () => 70,
    priceSuffix: "/ Paar",
  },
  {
    id: "motorraum",
    label: "Motorraumaufbereitung",
    description: "Gründliche Reinigung und Pflege des Motorraums.",
    getPrice: tablePrice(MOTORRAUM_PRICES),
    noAb: true,
  },
  {
    id: "leder",
    label: "Leder-Farbwiederherstellung",
    description:
      "Abgenutzte oder verfärbte Lederflächen werden professionell vorbereitet, farblich wiederhergestellt und anschließend geschützt.",
    highlight: true,
    variants: [
      { id: "lenkrad", label: "Lenkrad", getPrice: () => 79 },
      { id: "schalthebel", label: "Schalt-/Wählhebel", getPrice: () => 39 },
      { id: "set", label: "Set (Lenkrad + Schalt-/Wählhebel)", getPrice: () => 100 },
    ],
  },
];
