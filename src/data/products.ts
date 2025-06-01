import { Product } from '..';

export const products: Product[] = [
  {
    id: 1,
    name: "Eclypse Chronograph",
    description: "The Eclypse Chronograph combines precision engineering with timeless design. This sophisticated timepiece features a premium stainless steel case, scratch-resistant sapphire crystal, and automatic movement with a 48-hour power reserve.",
    price: 4995,
    images: [
      "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg",
      "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg",
      "https://images.pexels.com/photos/9979925/pexels-photo-9979925.jpeg"
    ],
    category: "chronograph",
    features: [
      "Automatic movement",
      "Sapphire crystal",
      "48-hour power reserve",
      "100m water resistant",
      "Stainless steel case"
    ],
    rating: 4.9,
    inStock: true
  },
  {
    id: 2,
    name: "Eclypse Diver Pro",
    description: "The ultimate diving companion, the Eclypse Diver Pro offers unparalleled performance at depths of up to 300 meters. Featuring our proprietary luminous dial technology and unidirectional rotating bezel.",
    price: 3495,
    images: [
      "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg",
      "https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg",
      "https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg"
    ],
    category: "diver",
    features: [
      "300m water resistant",
      "Helium escape valve",
      "Super-LumiNova indices",
      "Unidirectional bezel",
      "Rubber strap with deployment clasp"
    ],
    rating: 4.7,
    inStock: true
  },
  {
    id: 3,
    name: "Eclypse Classic",
    description: "Timeless elegance meets modern craftsmanship. The Eclypse Classic is our signature dress watch, featuring a slim profile, dauphine hands, and a hand-finished movement visible through the exhibition caseback.",
    price: 2995,
    images: [
      "https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg",
      "https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg",
      "https://images.pexels.com/photos/9978685/pexels-photo-9978685.jpeg"
    ],
    category: "dress",
    features: [
      "Manual winding movement",
      "38mm case diameter",
      "Alligator leather strap",
      "Exhibition caseback",
      "Date complication"
    ],
    rating: 4.8,
    inStock: true
  },
  {
    id: 4,
    name: "Eclypse GMT Master",
    description: "Perfect for the global traveler, the Eclypse GMT Master allows you to track multiple time zones with precision and style. Features a bidirectional rotating bezel and distinctive 24-hour hand.",
    price: 5495,
    images: [
      "https://images.pexels.com/photos/1034062/pexels-photo-1034062.jpeg",
      "https://images.pexels.com/photos/236915/pexels-photo-236915.jpeg",
      "https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg"
    ],
    category: "gmt",
    features: [
      "GMT complication",
      "Bidirectional 24-hour bezel",
      "Date magnifier",
      "Jubilee bracelet",
      "72-hour power reserve"
    ],
    rating: 4.9,
    inStock: false
  },
  {
    id: 5,
    name: "Eclypse Tourbillon Limited",
    description: "Our pinnacle of watchmaking art, the Eclypse Tourbillon Limited features a hand-finished tourbillon movement visible through the dial. Limited to just 50 pieces worldwide.",
    price: 25000,
    images: [
      "https://images.pexels.com/photos/9981071/pexels-photo-9981071.jpeg",
      "https://images.pexels.com/photos/9981074/pexels-photo-9981074.jpeg",
      "https://images.pexels.com/photos/9978724/pexels-photo-9978724.jpeg"
    ],
    category: "luxury",
    features: [
      "Visible tourbillon complication",
      "Hand-finished movement",
      "18k rose gold case",
      "Deployant buckle",
      "Limited to 50 pieces"
    ],
    rating: 5.0,
    inStock: true
  },
  {
    id: 6,
    name: "Eclypse Pilot",
    description: "Inspired by aviation timepieces of the 1940s, the Eclypse Pilot features high legibility, a large crown for ease of use with gloves, and our proprietary shock-resistant movement.",
    price: 3895,
    images: [
      "https://images.pexels.com/photos/3651820/pexels-photo-3651820.jpeg",
      "https://images.pexels.com/photos/47339/mechanics-movement-feinmechanik-wrist-watch-47339.jpeg",
      "https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg"
    ],
    category: "pilot",
    features: [
      "Anti-magnetic case",
      "Shock-resistant movement",
      "Oversized crown",
      "Luminous numerals and hands",
      "Leather pilot strap"
    ],
    rating: 4.6,
    inStock: true
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.rating && product.rating >= 4.8);
};