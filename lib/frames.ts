export type FrameId =
  | "aurelia"
  | "meridian"
  | "noor"
  | "atlas"
  | "vale"
  | "solstice"
  | "lyra"
  | "kronos"
  | "zephyr"
  | "paloma"
  | "rectangle"
  | "circle"
  | "oval"
  | "round"
  | "retro"
  | "aviator";

export type TintId = "clear" | "smoke" | "sepia" | "rose" | "sage";
export type FaceId = "oval" | "round" | "square" | "heart";
export type CollectionId = "all" | "heritage" | "titanium" | "avant-garde" | "solaris" | "indian" | "international";
export type OriginId = "international" | "indian";

export type LensTypeId =
  | "anti-glare"
  | "blue-cut"
  | "photochromic"
  | "high-index";

export interface LensTypeOption {
  id: LensTypeId;
  name: string;
  tagline: string;
  description: string;
  coating: string;
  uvProtection: string;
  priceDelta: number;
  badge: string;
  accentHex: string;
}

export interface LensShape {
  width: number;
  height: number;
  nTop: number;
  nBottom: number;
  bTop: number;
  bBottom: number;
  catLift: number;
  rimThickness: number;
  rimDepth: number;
}

export interface ColourOption {
  id: string;
  name: string;
  hex: string;
  pattern?: "tortoise";
  translucent?: boolean;
  metal?: boolean;
}

export interface TintOption {
  id: TintId;
  name: string;
  hex: string;
  distance: number;
}

export interface Frame {
  id: FrameId;
  index: string;
  name: string;
  tagline: string;
  description: string;
  material: "acetate" | "titanium";
  shape: LensShape;
  bridge: number;
  colours: ColourOption[];
  specs: { lens: string; bridge: string; temple: string; weight: string };
  price: number;
  fit: FaceId[];
  collection: "heritage" | "titanium" | "avant-garde" | "solaris";
  origin: OriginId;
}

export interface FrameConfig {
  frameId: FrameId;
  colourId: string;
  tintId: TintId;
  lensTypeId?: LensTypeId;
  engravedText?: string;
  isExploded?: boolean;
}

export const CYBER_FINISHES: ColourOption[] = [
  { id: "crimson_titanium", name: "Crimson Titanium", hex: "#e60026", metal: true },
  { id: "matte_carbon", name: "Matte Carbon Fiber", hex: "#121216" },
  { id: "brushed_obsidian", name: "Brushed Obsidian", hex: "#1c1c22", metal: true },
  { id: "damascus_steel", name: "Damascus Steel", hex: "#36383e", metal: true },
];

export interface CollectionInfo {
  id: CollectionId;
  name: string;
  tagline: string;
  description: string;
  year: string;
}

const tortoise: ColourOption = {
  id: "tortoise",
  name: "Walnut Tortoise",
  hex: "#8a5426",
  pattern: "tortoise",
};

export const LENS_TYPES: LensTypeOption[] = [
  {
    id: "anti-glare",
    name: "Anti-Glare (Anti-Reflective) Lenses",
    tagline: "Ultra-clear optical transmission with 99.8% reflection cancellation",
    description:
      "Engineered with 9-layer vacuum-sputtered magnesium fluoride and hydrophobic coatings. Neutralizes nighttime headlights, camera flare, and harsh atelier reflections.",
    coating: "9-Layer C-Clear™ Hydrophobic AR Shield",
    uvProtection: "100% UVA / UVB (UV400 Certified)",
    priceDelta: 45,
    badge: "Anti-Reflective AR",
    accentHex: "#34d399",
  },
  {
    id: "blue-cut",
    name: "Blue-Cut (Blue Light Filter) Lenses",
    tagline: "Selective 415–455nm digital blue light attenuation",
    description:
      "Formulated for intensive screen work, software developers, and writers. Filters high-energy visible (HEV) blue light without altering true color temperatures or skin tones.",
    coating: "OptiGuard™ Nanotech HEV Blue Filter",
    uvProtection: "UV420 Total Blue Ray Defense",
    priceDelta: 55,
    badge: "Blue Light Filter",
    accentHex: "#60a5fa",
  },
  {
    id: "photochromic",
    name: "Photochromic (Transitions) Lenses",
    tagline: "Smart transition from crystalline clear indoors to deep sunglass outdoors",
    description:
      "Infused with dynamic photochromic dyes that activate within 30 seconds of UV exposure. One pair carries you from reading at your desk into midday sun.",
    coating: "Rapid ChromaShift™ Molecular UV Matrix",
    uvProtection: "Adaptive UV400 Continuous Protection",
    priceDelta: 75,
    badge: "Smart Transitions",
    accentHex: "#f59e0b",
  },
  {
    id: "high-index",
    name: "High-Index (Thin & Light) Lenses",
    tagline: "1.74 ultra-thin compressed profile for superior aesthetics",
    description:
      "Up to 45% thinner and 35% lighter than standard lenses. Flat aspheric curves eliminate edge thickness, eye minification, and distortion in stronger prescriptions.",
    coating: "1.74 Aspheric Ultra-Compressed Core",
    uvProtection: "UV400 Total Spectral Block",
    priceDelta: 85,
    badge: "1.74 Ultra-Thin",
    accentHex: "#a78bfa",
  },
];

export const COLLECTIONS: CollectionInfo[] = [
  {
    id: "all",
    name: "Full Atelier",
    tagline: "The complete sixteen-frame international & Indian archive",
    description: "Every piece handcrafted in limited runs of 250 numbered specimens across London, Sabae, and Jaipur.",
    year: "2026 Archive",
  },
  {
    id: "international",
    name: "International Series",
    tagline: "British & Japanese heritage silhouettes",
    description: "Ten classic silhouettes handcrafted in London and Sabae using aerospace beta-titanium and Italian cellulose acetate.",
    year: "Series International",
  },
  {
    id: "indian",
    name: "Indian Heritage",
    tagline: "Rich architectural contours & vibrant finishes",
    description: "Six bespoke designs celebrating classic Indian proportions: tailored rectangles, intellectual pure circles, flowing ovals, and commanding browlines.",
    year: "Atelier India 2026",
  },
  {
    id: "heritage",
    name: "Heritage Archive",
    tagline: "Timeless British proportions & cellulose acetate",
    description: "The founding silhouettes that defined Marlowe: softened rectangles, classic pantos, and heirloom amber hues.",
    year: "Est. 2021",
  },
  {
    id: "titanium",
    name: "Titanium Precision",
    tagline: "Japanese beta-titanium wire under 18 grams",
    description: "Milled cold from aero-grade titanium bars in Sabae. Featherweight durability with zero corrosion.",
    year: "Series 04",
  },
  {
    id: "avant-garde",
    name: "Studio Avant-Garde",
    tagline: "Architectural bevels and sculpted geometry",
    description: "For connoisseurs seeking pronounced brows, sculpted bevel cuts, and bold statement silhouettes.",
    year: "Limited Run",
  },
  {
    id: "solaris",
    name: "Solaris Sunwear",
    tagline: "Glazed with UV400 anti-reflective polarized tints",
    description: "Frames engineered for high-altitude sunlight and Riviera coastal glare, fitted with anti-glare coatings.",
    year: "Summer 2026",
  },
];

export const FRAMES: Frame[] = [
  {
    id: "aurelia",
    index: "01",
    name: "Aurelia",
    tagline: "The quiet classic.",
    description:
      "A rounded panto drawn in titanium wire — weightless on the bridge, quietly exact from every angle. The pair we make for people who already know their look.",
    material: "titanium",
    shape: {
      width: 4.7,
      height: 4.3,
      nTop: 2.32,
      nBottom: 2.12,
      bTop: 1,
      bBottom: 0.98,
      catLift: 0,
      rimThickness: 0.1,
      rimDepth: 0.14,
    },
    bridge: 2.0,
    colours: [
      { id: "brass", name: "Brushed Brass", hex: "#c1955a", metal: true },
      { id: "silver", name: "Polished Silver", hex: "#c9ccce", metal: true },
      { id: "graphite", name: "Graphite", hex: "#5b5d60", metal: true },
    ],
    specs: { lens: "47 mm", bridge: "21 mm", temple: "145 mm", weight: "18 g" },
    price: 285,
    fit: ["oval", "square", "heart"],
    collection: "heritage",
    origin: "international",
  },
  {
    id: "meridian",
    index: "02",
    name: "Meridian",
    tagline: "Structure, softened.",
    description:
      "Our rectangular house shape in hand-polished acetate. Broad enough to balance a rounder face, softened at every corner so it never feels severe.",
    material: "acetate",
    shape: {
      width: 5.02,
      height: 3.95,
      nTop: 3.7,
      nBottom: 3.45,
      bTop: 0.99,
      bBottom: 0.97,
      catLift: 0,
      rimThickness: 0.34,
      rimDepth: 0.38,
    },
    bridge: 1.9,
    colours: [
      tortoise,
      { id: "ink", name: "Ink Black", hex: "#211f1c" },
      { id: "caramel", name: "Caramel", hex: "#a97440" },
      { id: "sage", name: "Sage", hex: "#6c7159" },
    ],
    specs: { lens: "51 mm", bridge: "19 mm", temple: "148 mm", weight: "26 g" },
    price: 240,
    fit: ["round", "oval"],
    collection: "heritage",
    origin: "international",
  },
  {
    id: "noor",
    index: "03",
    name: "Noor",
    tagline: "A lift, not a shout.",
    description:
      "A low cat-eye with one upward stroke at the outer corner. Cut from block acetate, then tumbled and polished over three days until the light sits inside it.",
    material: "acetate",
    shape: {
      width: 4.82,
      height: 3.9,
      nTop: 2.62,
      nBottom: 2.4,
      bTop: 1,
      bBottom: 0.96,
      catLift: 0.42,
      rimThickness: 0.32,
      rimDepth: 0.36,
    },
    bridge: 1.8,
    colours: [
      { id: "oxblood", name: "Oxblood", hex: "#6d2b2c" },
      tortoise,
      { id: "coal", name: "Coal", hex: "#232120" },
      {
        id: "rosewater",
        name: "Rosewater",
        hex: "#d0aaa5",
        translucent: true,
      },
    ],
    specs: { lens: "49 mm", bridge: "20 mm", temple: "145 mm", weight: "24 g" },
    price: 265,
    fit: ["oval", "heart", "round"],
    collection: "avant-garde",
    origin: "international",
  },
  {
    id: "atlas",
    index: "04",
    name: "Atlas",
    tagline: "Engineered calm.",
    description:
      "Square, architectural, unbothered. A titanium front with a matte keyhole bridge and temples that disappear behind the ear. Built for long days.",
    material: "titanium",
    shape: {
      width: 4.98,
      height: 4.05,
      nTop: 4.05,
      nBottom: 3.8,
      bTop: 1,
      bBottom: 0.98,
      catLift: 0,
      rimThickness: 0.11,
      rimDepth: 0.15,
    },
    bridge: 1.9,
    colours: [
      { id: "steel", name: "Cold Steel", hex: "#b6b9bc", metal: true },
      { id: "brass", name: "Brushed Brass", hex: "#c1955a", metal: true },
      { id: "matteblack", name: "Matte Black", hex: "#33322f", metal: true },
    ],
    specs: { lens: "50 mm", bridge: "20 mm", temple: "147 mm", weight: "16 g" },
    price: 310,
    fit: ["round", "oval", "heart"],
    collection: "titanium",
    origin: "international",
  },
  {
    id: "vale",
    index: "05",
    name: "Vale",
    tagline: "An easy oval.",
    description:
      "A soft oval in translucent acetate, hand-tinted in small batches. Worn in daylight the colour appears lit from within — an heirloom that never announces itself.",
    material: "acetate",
    shape: {
      width: 4.88,
      height: 4.2,
      nTop: 2.34,
      nBottom: 2.22,
      bTop: 1,
      bBottom: 0.97,
      catLift: 0,
      rimThickness: 0.35,
      rimDepth: 0.4,
    },
    bridge: 2.0,
    colours: [
      { id: "olive", name: "Olive", hex: "#616345" },
      { id: "crystal", name: "Crystal", hex: "#d8d1c1", translucent: true },
      { id: "amber", name: "Amber", hex: "#ab6a31" },
      tortoise,
    ],
    specs: { lens: "48 mm", bridge: "21 mm", temple: "143 mm", weight: "23 g" },
    price: 255,
    fit: ["square", "heart", "oval"],
    collection: "heritage",
    origin: "international",
  },
  {
    id: "solstice",
    index: "06",
    name: "Solstice",
    tagline: "The aviator, elevated.",
    description:
      "A dual-brow titanium aviator re-engineered with balanced teardrop geometry. Hand-soldered top wire with diamond-knurled temple tips.",
    material: "titanium",
    shape: {
      width: 5.25,
      height: 4.45,
      nTop: 2.8,
      nBottom: 2.2,
      bTop: 0.95,
      bBottom: 1.05,
      catLift: 0,
      rimThickness: 0.1,
      rimDepth: 0.14,
    },
    bridge: 2.1,
    colours: [
      { id: "gold", name: "24k Gold Wash", hex: "#d4af37", metal: true },
      { id: "silver", name: "Polished Silver", hex: "#c9ccce", metal: true },
      { id: "gunmetal", name: "Gunmetal", hex: "#4a4c4e", metal: true },
    ],
    specs: { lens: "54 mm", bridge: "18 mm", temple: "146 mm", weight: "17 g" },
    price: 325,
    fit: ["oval", "heart", "square"],
    collection: "solaris",
    origin: "international",
  },
  {
    id: "lyra",
    index: "07",
    name: "Lyra",
    tagline: "Modernist hexagonal wire.",
    description:
      "Sculpted six-sided rims cold-milled from solid Japanese titanium wire. Geometric precision softened at every vertex for an easy, intellectual silhouette.",
    material: "titanium",
    shape: {
      width: 4.85,
      height: 4.15,
      nTop: 3.2,
      nBottom: 3.1,
      bTop: 1.02,
      bBottom: 0.96,
      catLift: 0,
      rimThickness: 0.11,
      rimDepth: 0.14,
    },
    bridge: 1.95,
    colours: [
      { id: "bronze", name: "Antique Bronze", hex: "#8c6239", metal: true },
      { id: "silver", name: "Polished Silver", hex: "#c9ccce", metal: true },
      { id: "matteblack", name: "Obsidian", hex: "#222120", metal: true },
    ],
    specs: { lens: "48 mm", bridge: "20 mm", temple: "145 mm", weight: "15 g" },
    price: 295,
    fit: ["round", "oval"],
    collection: "titanium",
    origin: "international",
  },
  {
    id: "kronos",
    index: "08",
    name: "Kronos",
    tagline: "Architectural gravity.",
    description:
      "Cut from substantial 8mm cellulose block acetate with diamond-bevelled facets along the top brow. Designed for those who wear eyewear as architecture.",
    material: "acetate",
    shape: {
      width: 5.15,
      height: 4.1,
      nTop: 4.3,
      nBottom: 4.1,
      bTop: 1.0,
      bBottom: 0.98,
      catLift: 0,
      rimThickness: 0.42,
      rimDepth: 0.46,
    },
    bridge: 2.0,
    colours: [
      { id: "blackagate", name: "Black Agate", hex: "#161514" },
      { id: "smokeamber", name: "Smoke Amber", hex: "#9b5a2b" },
      tortoise,
      { id: "moss", name: "Deep Moss", hex: "#3f4634" },
    ],
    specs: { lens: "52 mm", bridge: "21 mm", temple: "150 mm", weight: "31 g" },
    price: 275,
    fit: ["oval", "round", "heart"],
    collection: "avant-garde",
    origin: "international",
  },
  {
    id: "zephyr",
    index: "09",
    name: "Zephyr",
    tagline: "Fourteen grams of air.",
    description:
      "Ultra-flexible Japanese beta-titanium panto. Screwless micro-hinges and floating wire temple arms that completely dissolve against the temple.",
    material: "titanium",
    shape: {
      width: 4.65,
      height: 4.25,
      nTop: 2.2,
      nBottom: 2.15,
      bTop: 1.0,
      bBottom: 1.0,
      catLift: 0,
      rimThickness: 0.08,
      rimDepth: 0.12,
    },
    bridge: 2.05,
    colours: [
      { id: "rawtitanium", name: "Raw Titanium", hex: "#9da1a4", metal: true },
      { id: "rosegold", name: "Champagne Gold", hex: "#cfb095", metal: true },
      { id: "graphite", name: "Graphite", hex: "#5b5d60", metal: true },
    ],
    specs: { lens: "46 mm", bridge: "21 mm", temple: "145 mm", weight: "14 g" },
    price: 330,
    fit: ["square", "round", "heart", "oval"],
    collection: "titanium",
    origin: "international",
  },
  {
    id: "paloma",
    index: "10",
    name: "Paloma",
    tagline: "Dramatic winged poise.",
    description:
      "A high-sculpt cat-eye shaped in champagne crystal acetate with tapered temple tips. Subtle light reflection along the upper rim brings focus to the eyes.",
    material: "acetate",
    shape: {
      width: 5.05,
      height: 3.95,
      nTop: 2.5,
      nBottom: 2.3,
      bTop: 1.05,
      bBottom: 0.92,
      catLift: 0.58,
      rimThickness: 0.36,
      rimDepth: 0.38,
    },
    bridge: 1.85,
    colours: [
      { id: "champagne", name: "Champagne Crystal", hex: "#dfd2be", translucent: true },
      { id: "oxblood", name: "Oxblood Glaze", hex: "#5e2324" },
      tortoise,
      { id: "midnight", name: "Midnight Ink", hex: "#19191d" },
    ],
    specs: { lens: "51 mm", bridge: "19 mm", temple: "144 mm", weight: "27 g" },
    price: 280,
    fit: ["oval", "square", "round"],
    collection: "avant-garde",
    origin: "international",
  },
  /* =========================================================================
   * INDIAN HERITAGE FRAMES (PLATES 11 TO 16)
   * ========================================================================= */
  {
    id: "rectangle",
    index: "11",
    name: "Arya Rectangle",
    tagline: "Structure & presence in hand-polished Madras acetate.",
    description:
      "A tailored, geometric rectangle inspired by modern Indian architectural lines. Sculpted bevel temples and a balanced keyhole bridge offer all-day composure and sharp intellectual presence.",
    material: "acetate",
    shape: {
      width: 5.12,
      height: 3.82,
      nTop: 3.85,
      nBottom: 3.65,
      bTop: 0.98,
      bBottom: 0.96,
      catLift: 0,
      rimThickness: 0.33,
      rimDepth: 0.37,
    },
    bridge: 1.9,
    colours: [
      { id: "madras_tortoise", name: "Madras Tortoise", hex: "#7a461e", pattern: "tortoise" },
      { id: "royal_emerald", name: "Royal Emerald", hex: "#1c3b2b" },
      { id: "kohl_black", name: "Kohl Agate", hex: "#171717" },
      { id: "jaipur_amber", name: "Jaipur Amber", hex: "#c7752b" },
    ],
    specs: { lens: "52 mm", bridge: "19 mm", temple: "148 mm", weight: "25 g" },
    price: 235,
    fit: ["round", "oval", "heart"],
    collection: "heritage",
    origin: "indian",
  },
  {
    id: "circle",
    index: "12",
    name: "Ashoka Circle",
    tagline: "The contemplative pure wire circle.",
    description:
      "A timeless geometric circle cold-milled from ultra-resilient beta-titanium. Echoes the scholarly wire frames of India's golden academic eras with refined laser-engraved bridge details.",
    material: "titanium",
    shape: {
      width: 4.45,
      height: 4.45,
      nTop: 2.0,
      nBottom: 2.0,
      bTop: 1.0,
      bBottom: 1.0,
      catLift: 0,
      rimThickness: 0.09,
      rimDepth: 0.12,
    },
    bridge: 2.1,
    colours: [
      { id: "jaipur_brass", name: "Jaipur Brass", hex: "#d4af37", metal: true },
      { id: "antique_copper", name: "Deccan Copper", hex: "#b86b43", metal: true },
      { id: "silver", name: "Himalayan Silver", hex: "#c9ccce", metal: true },
      { id: "kohl_matte", name: "Kohl Matte Black", hex: "#232323", metal: true },
    ],
    specs: { lens: "45 mm", bridge: "21 mm", temple: "145 mm", weight: "13 g" },
    price: 295,
    fit: ["square", "oval", "heart"],
    collection: "titanium",
    origin: "indian",
  },
  {
    id: "oval",
    index: "13",
    name: "Ganga Oval",
    tagline: "Fluid contour in translucent river crystal.",
    description:
      "A soft, flowing oval silhouette echoing river-smoothed stones. Hand-beveled along its perimeter with translucent crystal acetate that refracts natural sunlight warmly.",
    material: "acetate",
    shape: {
      width: 4.92,
      height: 4.12,
      nTop: 2.42,
      nBottom: 2.26,
      bTop: 1.0,
      bBottom: 0.95,
      catLift: 0,
      rimThickness: 0.33,
      rimDepth: 0.36,
    },
    bridge: 2.0,
    colours: [
      { id: "thar_crystal", name: "Thar Crystal Sand", hex: "#ded4c3", translucent: true },
      { id: "lotus_rose", name: "Lotus Rose Quartz", hex: "#cfa29d", translucent: true },
      { id: "madras_tortoise", name: "Madras Tortoise", hex: "#7a461e", pattern: "tortoise" },
      { id: "bengal_indigo", name: "Bengal Indigo", hex: "#1e293b" },
    ],
    specs: { lens: "49 mm", bridge: "20 mm", temple: "144 mm", weight: "22 g" },
    price: 250,
    fit: ["square", "heart", "oval"],
    collection: "heritage",
    origin: "indian",
  },
  {
    id: "round",
    index: "14",
    name: "Swaraj Round",
    tagline: "Iconic heritage panto with a sculpted keyhole bridge.",
    description:
      "The quintessential mid-century Indian panto, featuring an elevated keyhole arch, gentle flattened brow, and triple-pin hand-riveted hinges crafted for lifelong durability.",
    material: "acetate",
    shape: {
      width: 4.76,
      height: 4.38,
      nTop: 2.16,
      nBottom: 2.06,
      bTop: 0.98,
      bBottom: 1.0,
      catLift: 0,
      rimThickness: 0.35,
      rimDepth: 0.38,
    },
    bridge: 2.05,
    colours: [
      { id: "haveli_amber", name: "Haveli Amber", hex: "#ba6f2b" },
      { id: "madras_tortoise", name: "Madras Tortoise", hex: "#7a461e", pattern: "tortoise" },
      { id: "kohl_black", name: "Kohl Charcoal", hex: "#1f1e1d" },
      { id: "darjeeling_sage", name: "Darjeeling Green", hex: "#5d6d53" },
    ],
    specs: { lens: "47 mm", bridge: "21 mm", temple: "145 mm", weight: "24 g" },
    price: 265,
    fit: ["square", "oval", "heart"],
    collection: "heritage",
    origin: "indian",
  },
  {
    id: "retro",
    index: "15",
    name: "Bombay Retro",
    tagline: "Commanding 1970s Marine Drive browline.",
    description:
      "A commanding architectural browline with sculpted top chamfers and weighty cellulose block acetate. Inspired by Bombay's vintage cinema era, balanced with modern featherweight hinge geometry.",
    material: "acetate",
    shape: {
      width: 5.22,
      height: 4.24,
      nTop: 4.25,
      nBottom: 3.72,
      bTop: 1.04,
      bBottom: 0.94,
      catLift: 0.12,
      rimThickness: 0.44,
      rimDepth: 0.44,
    },
    bridge: 1.95,
    colours: [
      { id: "kohl_black", name: "Midnight Obsidian", hex: "#151515" },
      { id: "madras_tortoise", name: "Madras Tortoise", hex: "#7a461e", pattern: "tortoise" },
      { id: "vintage_cognac", name: "Vintage Cognac", hex: "#8a4c21" },
      { id: "nilgiri_olive", name: "Nilgiri Olive", hex: "#464c36" },
    ],
    specs: { lens: "53 mm", bridge: "20 mm", temple: "150 mm", weight: "32 g" },
    price: 285,
    fit: ["oval", "round", "heart"],
    collection: "avant-garde",
    origin: "indian",
  },
  {
    id: "aviator",
    index: "16",
    name: "Garuda Aviator",
    tagline: "Dual-brow aerodynamic beta-titanium navigator.",
    description:
      "A high-altitude teardrop pilot frame crafted from aerospace titanium wire. Features a swept top crossbar, knurled temple flexures, and balanced mass distribution.",
    material: "titanium",
    shape: {
      width: 5.38,
      height: 4.62,
      nTop: 2.85,
      nBottom: 2.14,
      bTop: 0.94,
      bBottom: 1.08,
      catLift: 0,
      rimThickness: 0.1,
      rimDepth: 0.14,
    },
    bridge: 2.15,
    colours: [
      { id: "jaipur_gold", name: "24k Jaipur Gold", hex: "#d8b13a", metal: true },
      { id: "rose_gold", name: "Indian Rose Gold", hex: "#dca794", metal: true },
      { id: "gunmetal", name: "Deccan Gunmetal", hex: "#44474b", metal: true },
      { id: "silver", name: "Polished Silver", hex: "#c9ccce", metal: true },
    ],
    specs: { lens: "55 mm", bridge: "18 mm", temple: "148 mm", weight: "17 g" },
    price: 340,
    fit: ["oval", "heart", "square"],
    collection: "solaris",
    origin: "indian",
  },
];

export const TINTS: TintOption[] = [
  { id: "clear", name: "Clear", hex: "#e9ede8", distance: 8 },
  { id: "smoke", name: "Smoke", hex: "#54534f", distance: 1.15 },
  { id: "sepia", name: "Sepia", hex: "#7d5b33", distance: 1.0 },
  { id: "rose", name: "Rose", hex: "#b57c78", distance: 1.0 },
  { id: "sage", name: "Sage", hex: "#5e705d", distance: 1.0 },
];

export interface FaceProfile {
  id: FaceId;
  name: string;
  note: string;
  headline: string;
  copy: string;
  recommend: FrameId[];
}

export const FACES: FaceProfile[] = [
  {
    id: "oval",
    name: "Oval",
    note: "Balanced, slightly longer than wide.",
    headline: "Almost anything, kept in proportion.",
    copy: "An oval face carries most shapes. Favour frames that echo your width rather than overhang it — the Meridian's clean brow, Arya rectangle, or the Solstice & Garuda aviators sit effortlessly.",
    recommend: ["meridian", "rectangle", "solstice", "aviator", "noor", "kronos"],
  },
  {
    id: "round",
    name: "Round",
    note: "Soft, even curves, full cheeks.",
    headline: "Let angles do the talking.",
    copy: "A little structure sharpens soft curves. Architectural squares, the Arya rectangle, and geometric wire define the browline without overpowering cheek contours.",
    recommend: ["atlas", "rectangle", "lyra", "meridian", "retro", "zephyr"],
  },
  {
    id: "square",
    name: "Square",
    note: "Strong jaw, broad brow.",
    headline: "Curves will soften the frame.",
    copy: "Round and oval shapes relax a strong jawline. The Ashoka circle wire, Ganga oval, Aurelia, and Swaraj round sit with natural harmony.",
    recommend: ["circle", "oval", "round", "aurelia", "vale", "zephyr"],
  },
  {
    id: "heart",
    name: "Heart",
    note: "Wider brow, tapered chin.",
    headline: "Keep the weight low and open.",
    copy: "Lighter, bottom-weighted shapes balance a narrower chin. Choose a frame with a gentle lower line, the Ashoka circle wire, or the Garuda aviator so the gaze stays centered.",
    recommend: ["circle", "aviator", "vale", "solstice", "aurelia", "atlas"],
  },
];

export function getFrame(id: FrameId): Frame {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}

export function getColour(frame: Frame, id: string): ColourOption {
  const foundInFrame = frame.colours.find((c) => c.id === id);
  if (foundInFrame) return foundInFrame;
  const foundInCyber = CYBER_FINISHES.find((c) => c.id === id);
  if (foundInCyber) return foundInCyber;
  return frame.colours[0];
}

export function getTint(id: TintId): TintOption {
  return TINTS.find((t) => t.id === id) ?? TINTS[0];
}

export function getLensType(id?: LensTypeId): LensTypeOption {
  return LENS_TYPES.find((l) => l.id === id) ?? LENS_TYPES[0];
}

export function getFace(id: FaceId): FaceProfile {
  return FACES.find((f) => f.id === id) ?? FACES[0];
}

export function getFramesByOrigin(origin: OriginId | "all"): Frame[] {
  if (origin === "all") return FRAMES;
  return FRAMES.filter((f) => f.origin === origin);
}

export function getFramesByCollection(collectionId: CollectionId): Frame[] {
  if (collectionId === "all") return FRAMES;
  if (collectionId === "international" || collectionId === "indian") {
    return FRAMES.filter((f) => f.origin === collectionId);
  }
  return FRAMES.filter((f) => f.collection === collectionId);
}

/**
 * Superellipse lens outline. Produces the shared silhouette used by both the
 * 3D extrusion and the SVG thumbnails, in centimetres.
 */
export function lensOutline(
  shape: LensShape,
  side: 1 | -1 = 1,
  segments = 120,
  expand = 0,
): [number, number][] {
  const a = (shape.width + expand * 2) / 2;
  const b = (shape.height + expand * 2) / 2;
  const points: [number, number][] = [];

  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const n = s >= 0 ? shape.nTop : shape.nBottom;
    const sy = s >= 0 ? shape.bTop : shape.bBottom;

    const x = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
    let y = b * sy * Math.sign(s) * Math.pow(Math.abs(s), 2 / n);

    if (shape.catLift > 0 && s > 0) {
      const outward = Math.max(0, (x / a) * side);
      y += shape.catLift * Math.pow(outward, 3) * b;
    }

    points.push([x, y]);
  }

  return points;
}

export function pointsToSvgPath(points: [number, number][]): string {
  return (
    "M" +
    points.map(([x, y]) => `${x.toFixed(3)} ${y.toFixed(3)}`).join("L") +
    "Z"
  );
}
