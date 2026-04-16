export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  type: string;
  tagline: string;
  description: string;
  signatureFeel: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  prices: {
    GBP: number;
    USD: number;
    NGN: number;
  };
  image: string;
  gallery: ProductImage[];
  gender: "her" | "him";
}

export interface Country {
  code: string;
  name: string;
  currency: "GBP" | "USD" | "NGN";
  currencySymbol: string;
  shippingDays: string;
  flag: string;
}

export const countries: Country[] = [
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    shippingDays: "2–5",
    flag: "🇬🇧",
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    shippingDays: "3–10",
    flag: "🇺🇸",
  },
  {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    currencySymbol: "₦",
    shippingDays: "3–7",
    flag: "🇳🇬",
  },
];

export const products: Product[] = [
  {
    id: "yagel-for-her",
    name: "Yagel",
    slug: "yagel-for-her",
    type: "Extrait de Parfum",
    tagline: "For Her",
    description:
      "A vibrant opening of citrus, orange, and soft fruity notes is elevated by a touch of saffron. The heart unfolds into a luxurious blend of rose, jasmine, and creamy white florals, wrapped in indulgent hints of chocolate and caramel. It settles into a warm, lasting base of vanilla, oud, amber, and musk, leaving a soft yet powerful trail of elegance.",
    signatureFeel: "Sweet. Warm. Elegant.",
    notes: {
      top: "Citrus, Orange, Saffron, Soft Fruits",
      heart: "Rose, Jasmine, White Florals, Chocolate, Caramel",
      base: "Vanilla, Oud, Amber, Musk",
    },
    prices: {
      GBP: 40,
      USD: 40,
      NGN: 40000,
    },
    image: "/images/yagel-for-her.png",
    gallery: [
      { src: "/images/yagel-for-her.png", alt: "Yagel For Her — Front View" },
      { src: "/images/yagel-for-her.png", alt: "Yagel For Her — Side View" },
      { src: "/images/yagel-for-her.png", alt: "Yagel For Her — Back View" },
    ],
    gender: "her",
  },
  {
    id: "yagel-for-him",
    name: "Yagel",
    slug: "yagel-for-him",
    type: "Extrait de Parfum",
    tagline: "For Him",
    description:
      "A bold opening of mango and citrus is sharpened by ginger and warm spices. The heart reveals a refined blend of woods, patchouli, soft florals, and resin, adding depth and character. It settles into a rich, smoky base of ambergris, amberwood, oud, musk, incense, and vanilla leaving a powerful, lasting impression.",
    signatureFeel: "Bold. Warm. Commanding.",
    notes: {
      top: "Mango, Citrus, Ginger, Warm Spices",
      heart: "Woods, Patchouli, Soft Florals, Resin",
      base: "Ambergris, Amberwood, Oud, Musk, Incense, Vanilla",
    },
    prices: {
      GBP: 40,
      USD: 40,
      NGN: 40000,
    },
    image: "/images/yagel-for-him.png",
    gallery: [
      { src: "/images/yagel-for-him.png", alt: "Yagel For Him — Front View" },
      { src: "/images/yagel-for-him.png", alt: "Yagel For Him — Side View" },
      { src: "/images/yagel-for-him.png", alt: "Yagel For Him — Back View" },
    ],
    gender: "him",
  },
];

export function formatPrice(
  amount: number,
  currency: "GBP" | "USD" | "NGN"
): string {
  const locale =
    currency === "GBP" ? "en-GB" : currency === "USD" ? "en-US" : "en-NG";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "NGN" ? 0 : 2,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(amount);
}
