// Nigerian delivery fee calculation.
//
// Pickup station: Abule Egba, Lagos (Zone 6). Lagos fees are the courier's
// "Zone 6 → buyer's zone" rates from the 2025 Teemah Logistics rate card
// (see /public/delivery-rates). Where the card gives a range, the upper
// bound is used since the card lists minimum charges.

export interface LagosZone {
  id: string;
  label: string;
  fee: number; // NGN
  areas: string[];
}

// export const LAGOS_ZONES: LagosZone[] = [
//   {
//     id: "island-1",
//     label: "Island Zone 1",
//     fee: 5500,
//     areas: [
//       "Victoria Island", "Oniru", "Marina", "Lekki Phase 1", "Lagos Island",
//       "Ikoyi", "Obalende", "Dolphin Estate", "Banana Island",
//     ],
//   },
//   {
//     id: "zone-1b",
//     label: "Zone 1b",
//     fee: 5500,
//     areas: [
//       "Agungi", "Orchid Road", "Lekki Peninsula 2", "Chevron", "Osapa London",
//       "Jakande Lekki", "VGC", "Ikota", "Lekki Phase 2 Garden",
//     ],
//   },
//   {
//     id: "zone-2",
//     label: "Zone 2",
//     fee: 4500,
//     areas: [
//       "Yaba", "Ojuelegba", "Surulere", "Somolu", "Gbagada", "Palmgrove",
//       "Onipanu", "Lawanson", "Orile Iganmu", "Ijesha", "Ijora", "Amukoko",
//       "Iwaya", "Costain", "Aguda", "Alagomeji", "Ebute Metta", "Jibowu",
//       "Bariga", "Oyingbo", "Idi Araba", "Mushin",
//     ],
//   },
//   {
//     id: "zone-3",
//     label: "Zone 3",
//     fee: 4500,
//     areas: [
//       "Ikeja", "Oshodi", "Ilupeju", "Ogudu", "Ojota", "Maryland", "Ketu",
//       "Anthony Village", "Ladipo", "Mile 12", "Ogba", "Omole", "Ojodu Berger",
//       "Agege", "Magodo 1&2",
//     ],
//   },
//   {
//     id: "zone-4",
//     label: "Zone 4",
//     fee: 3500,
//     areas: [
//       "Ikotun", "Ayobo", "Cele Egbe", "Igando", "Lasu Road", "Ijegun",
//       "Governor's Road",
//     ],
//   },
//   {
//     id: "zone-5",
//     label: "Zone 5",
//     fee: 5500,
//     areas: [
//       "Mile 2", "Satellite Town", "Amuwo Odofin", "Festac", "Okota",
//       "Ago Palace Way", "Isolo", "Ejigbo", "Jakande", "Ilasamaja",
//     ],
//   },
//   {
//     id: "zone-6",
//     label: "Zone 6",
//     fee: 3000,
//     areas: [
//       "Dopemu", "Egbeda", "Alagbado", "Iyana Ipaja", "Ipaja", "Meiran",
//       "Command", "Abule Egba", "Ijaiye", "Fagba", "Iju Ishaga", "Obawole",
//     ],
//   },
//   {
//     id: "ajah-axis",
//     label: "Ajah Axis",
//     fee: 6000,
//     areas: ["Ajah", "Ogombo", "Sangotedo", "Awoyaya"],
//   },
//   {
//     id: "ikorodu",
//     label: "Ikorodu",
//     fee: 5500,
//     areas: ["Ikorodu"],
//   },
// ];


 export const LAGOS_ZONES: LagosZone[] = [
   {  
    id: "Island",
    label: "Island",
    fee: 5500,
    areas: ["Victoria Island", "Oniru", "Marina", "Lekki Phase 1", "Lagos Island",  "Ikoyi", "Obalende", "Dolphin Estate", "Banana Island, Agungi", "Orchid Road", 
      "Lekki Peninsula 2", "Chevron", "Osapa London", "Jakande Lekki", "VGC", "Ikota", "Lekki Phase 2 Garden"],
  },
  {
    id: "mainland",
    label: "Mainland",
    fee: 4500,
    areas: [
      "Yaba", "Ojuelegba", "Surulere", "Somolu", "Gbagada", "Palmgrove",
      "Onipanu", "Lawanson", "Orile Iganmu", "Ijesha", "Ijora", "Amukoko",
      "Iwaya", "Costain", "Aguda", "Alagomeji", "Ebute Metta", "Jibowu",
      "Bariga", "Oyingbo", "Idi Araba", "Mushin",
      "Ikeja", "Oshodi", "Ilupeju", "Ogudu", "Ojota", "Maryland", "Ketu",
      "Anthony Village", "Ladipo", "Mile 12", "Ogba", "Omole", "Ojodu Berger",
      "Agege", "Magodo 1&2",
      "Ikotun", "Ayobo", "Cele Egbe", "Igando", "Lasu Road", "Ijegun",
      "Governor's Road", "Mile 2", "Satellite Town", "Amuwo Odofin", "Festac", "Okota",
      "Ago Palace Way", "Isolo", "Ejigbo", "Jakande", "Ilasamaja",
      "Dopemu", "Egbeda", "Alagbado", "Iyana Ipaja", "Ipaja", "Meiran",
      "Command", "Abule Egba", "Ijaiye", "Fagba", "Iju Ishaga", "Obawole",
      "Ikorodu"
    ],
  },
];


const OYO_FEE = 3000;
const OGUN_FEE = 4500;

// We currently deliver within Nigeria only to Lagos, Oyo, and Ogun (Abeokuta).
export const DELIVERABLE_STATES = ["Lagos", "Ogun", "Oyo"];

// Display list for the /shipping page — single source of truth for the fees.
export interface DeliveryFeeRow {
  label: string;
  fee: number; // NGN
}

export const NIGERIA_DELIVERY_FEES: DeliveryFeeRow[] = [
  { label: "Lagos Mainland", fee: LAGOS_ZONES.find((z) => z.id === "mainland")!.fee },
  { label: "Lagos Island", fee: LAGOS_ZONES.find((z) => z.id === "Island")!.fee },
  { label: "Oyo", fee: OYO_FEE },
  { label: "Abeokuta", fee: OGUN_FEE },
];

export function getLagosZoneByArea(area: string): LagosZone | undefined {
  return LAGOS_ZONES.find((z) => z.areas.includes(area));
}

/**
 * Returns the delivery fee in NGN, or null when we don't deliver there or more
 * input is needed (Lagos selected but no area chosen yet).
 */
export function getNigerianDeliveryFee(
  state: string,
  lagosArea?: string
): number | null {
  if (state === "Oyo") return OYO_FEE;
  if (state === "Ogun") return OGUN_FEE;
  if (state === "Lagos") {
    if (!lagosArea) return null;
    return getLagosZoneByArea(lagosArea)?.fee ?? null;
  }
  return null;
}
