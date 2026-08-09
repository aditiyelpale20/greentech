// BHARTI GREEN TECH - Unified Products Database and Config (i18n Enabled)

const COMPANY_INFO = {
  name: "BHARTI GREEN TECH",
  phone: "+91 90497 47555",
  email: "info@bhartigreentech.com",
  whatsapp: "+919049747555",
  get tagline() { return window.i18n ? window.i18n.t('company.tagline') : "Solution for Better Life"; },
  get office() { return window.i18n ? window.i18n.t('company.office') : "Prakash Resi., 702, Sector 10E, Road Pali, Navi Mumbai, Maharashtra"; },
  get plant() { return window.i18n ? window.i18n.t('company.plant') : "Gat No. 629, At Post Sokasan, Tal-Man, Satara, Maharashtra - 415508"; }
};

function attachProductGetters(p, fallbackName, fallbackTech) {
  const id = p.id;
  Object.defineProperties(p, {
    name: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.name`) : fallbackName;
        return (v && !v.startsWith('products.')) ? v : fallbackName;
      },
      enumerable: true,
      configurable: true
    },
    technical: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.technical`) : fallbackTech;
        return (v && !v.startsWith('products.')) ? v : fallbackTech;
      },
      enumerable: true,
      configurable: true
    },
    shortDescription: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.shortDescription`) : "";
        return (v && !v.startsWith('products.')) ? v : "";
      },
      enumerable: true,
      configurable: true
    },
    overview: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.overview`) : "";
        return (v && !v.startsWith('products.')) ? v : "";
      },
      enumerable: true,
      configurable: true
    },
    benefits: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.benefits`) : [];
        return (Array.isArray(v) && v.length > 0) ? v : [];
      },
      enumerable: true,
      configurable: true
    },
    crops: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.crops`) : [];
        return (Array.isArray(v) && v.length > 0) ? v : [];
      },
      enumerable: true,
      configurable: true
    },
    application: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.application`) : [];
        return (Array.isArray(v) && v.length > 0) ? v : [];
      },
      enumerable: true,
      configurable: true
    },
    dosage: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.dosage`) : "";
        return (v && !v.startsWith('products.')) ? v : "";
      },
      enumerable: true,
      configurable: true
    },
    precautions: {
      get() {
        const v = typeof window !== 'undefined' && window.i18n ? window.i18n.t(`products.${id}.precautions`) : [];
        return (Array.isArray(v) && v.length > 0) ? v : [];
      },
      enumerable: true,
      configurable: true
    }
  });
  return p;
}

const RAW_PRODUCTS_DATA = [
  // 1. Bio-Fertilizers & Nutrients
  {
    id: "urva-n",
    slug: "urva-n",
    category: "bio-fertilizers",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "240.00", "mrp": "555.00"}, {"size": "5000ml", "dp": "1475.00", "mrp": "2495.00"}],
    image: "assets/products/urva-n.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva N", _fallbackTech: "Azotobacter chroococcum"
  },
  {
    id: "urva-p",
    slug: "urva-p",
    category: "bio-fertilizers",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "240.00", "mrp": "555.00"}, {"size": "5000ml", "dp": "1475.00", "mrp": "2495.00"}],
    image: "assets/products/urva-p.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva P", _fallbackTech: "Phosphate Solubilizing Bacteria (PSB)"
  },
  {
    id: "urva-k",
    slug: "urva-k",
    category: "bio-fertilizers",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "240.00", "mrp": "565.00"}, {"size": "5000ml", "dp": "1525.00", "mrp": "2535.00"}],
    image: "assets/products/urva-k.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva K", _fallbackTech: "Potash Mobilizing Bacteria (KMB)"
  },
  {
    id: "urva-urja",
    slug: "urva-urja",
    category: "growth-boosters",
    formulation: "Liquid",
    packing: ["250ml", "500ml", "1000ml", "5000ml"],
    prices: [{"size": "250ml", "dp": "120.00", "mrp": "195.00"}, {"size": "500ml", "dp": "195.00", "mrp": "315.00"}, {"size": "1000ml", "dp": "290.00", "mrp": "565.00"}, {"size": "5000ml", "dp": "1525.00", "mrp": "2535.00"}],
    image: "assets/products/urva-urja-liq.png",
    youtubeUrl: "https://www.youtube.com/watch?v=f6dNnKNqKFA",
    _fallbackName: "Urva Urja", _fallbackTech: "Liquid N:P:K Solubilizing Consortia"
  },
  {
    id: "urva-carbon",
    slug: "urva-carbon",
    category: "growth-boosters",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "320.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1590.00", "mrp": "2650.00"}],
    image: "assets/products/urva-carbon.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Carbon", _fallbackTech: "Liquid Consortia (N:P:K) Enriched with Carbon"
  },
  {
    id: "urva-slurry-culture",
    slug: "urva-slurry-culture",
    category: "soil-health",
    formulation: "Liquid",
    packing: ["250ml", "500ml", "1000ml"],
    prices: [{"size": "250ml", "dp": "165.00", "mrp": "295.00"}, {"size": "1000ml", "dp": "395.00", "mrp": "695.00"}],
    image: "assets/products/urva-slurry-culture.png",
    youtubeUrl: "https://www.youtube.com/watch?v=nQ0ykYnQF80",
    _fallbackName: "Urva Slurry Culture", _fallbackTech: "Algae, Micro-organisms & Useful Nematodes"
  },
  {
    id: "urva-d-compost",
    slug: "urva-d-compost",
    category: "soil-health",
    formulation: "Liquid / Granular",
    packing: ["1000ml Bottle Duo (B & F)", "25kg Bag"],
    prices: [{"size": "1000ml Duo", "dp": "295.00", "mrp": "550.00"}],
    image: "assets/products/urva-d-compost.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva D-Compost", _fallbackTech: "Trichoderma spp, Cellulomonas spp, Bacillus spp"
  },
  {
    id: "urva-spurad",
    slug: "urva-spurad",
    category: "bio-fertilizers",
    formulation: "Carrier Powder / Liquid",
    packing: ["1kg Pouch", "2 Liter Bucket"],
    prices: [{"size": "1kg Pouch", "dp": "210.00", "mrp": "420.00"}, {"size": "2 Liter", "dp": "480.00", "mrp": "890.00"}],
    image: "assets/products/urva-spurad.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Spurad", _fallbackTech: "Phosphate Solubilizing Bacteria / Trichoderma spp"
  },

  // 2. Bio-Fungicides
  {
    id: "urva-vajra",
    slug: "urva-vajra",
    category: "bio-fungicides",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "285.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1545.00", "mrp": "2595.00"}],
    image: "assets/products/urva-vajra.png",
    youtubeUrl: "https://www.youtube.com/watch?v=0k3Nn9P4Tps",
    _fallbackName: "Urva Vajra", _fallbackTech: "Trichoderma viride / Trichoderma harzianum"
  },
  {
    id: "urva-aayudh",
    slug: "urva-aayudh",
    category: "bio-fungicides",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "285.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1545.00", "mrp": "2595.00"}],
    image: "assets/products/urva-ayudh.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Ayudh", _fallbackTech: "Pseudomonas fluorescens"
  },
  {
    id: "urva-sudarshan",
    slug: "urva-sudarshan",
    category: "bio-fungicides",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "285.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1545.00", "mrp": "2595.00"}],
    image: "assets/products/urva-sudarshan.png",
    youtubeUrl: "https://www.youtube.com/watch?v=Xh0Y9Z1A6sE",
    _fallbackName: "Urva Sudarshan", _fallbackTech: "Bacillus subtilis"
  },
  {
    id: "urva-amphilo",
    slug: "urva-amphilo",
    category: "bio-fungicides",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "295.00", "mrp": "615.00"}, {"size": "5000ml", "dp": "1580.00", "mrp": "2695.00"}],
    image: "assets/products/urva-ampelo.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Ampelo", _fallbackTech: "Ampelomyces quisqualis"
  },

  // 3. Bio-Pesticides
  {
    id: "urva-shone",
    slug: "urva-shone",
    category: "bio-pesticides",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "285.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1545.00", "mrp": "2595.00"}],
    image: "assets/products/urva-shone.png",
    youtubeUrl: "https://www.youtube.com/watch?v=o0XbYw_qM_4",
    _fallbackName: "Urva Shone", _fallbackTech: "Beauveria bassiana"
  },
  {
    id: "urva-rakshak",
    slug: "urva-rakshak",
    category: "bio-pesticides",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "285.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1545.00", "mrp": "2595.00"}],
    image: "assets/products/urva-rakshak.png",
    youtubeUrl: "https://www.youtube.com/watch?v=9jP4x1Y7m_A",
    _fallbackName: "Urva Rakshak", _fallbackTech: "Paecilomyces lilacinus / Paecilomyces spp"
  },
  {
    id: "urva-rudra",
    slug: "urva-rudra",
    category: "bio-pesticides",
    formulation: "Liquid",
    packing: ["250ml", "500ml", "1000ml", "5000ml"],
    prices: [{"size": "250ml", "dp": "115.00", "mrp": "195.00"}, {"size": "500ml", "dp": "195.00", "mrp": "325.00"}, {"size": "1000ml", "dp": "285.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1545.00", "mrp": "2595.00"}],
    image: "assets/products/urva-rudra.png",
    youtubeUrl: "https://www.youtube.com/watch?v=8q_rN_4k1uM",
    _fallbackName: "Urva Rudra", _fallbackTech: "Verticillium lecanii"
  },
  {
    id: "urva-dhanush",
    slug: "urva-dhanush",
    category: "bio-pesticides",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "285.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1545.00", "mrp": "2595.00"}],
    image: "assets/products/urva-dhanush.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Dhanush-BT", _fallbackTech: "Bacillus thuringiensis (BT)"
  },
  {
    id: "urva-e-pinaca",
    slug: "urva-e-pinaca",
    category: "bio-pesticides",
    formulation: "Liquid",
    packing: ["1000ml", "5000ml"],
    prices: [{"size": "1000ml", "dp": "285.00", "mrp": "595.00"}, {"size": "5000ml", "dp": "1545.00", "mrp": "2595.00"}],
    image: "assets/products/urva-pinaca-liq.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Pinaca (Liquid)", _fallbackTech: "Metarhizium anisopliae"
  },
  {
    id: "urva-bvm",
    slug: "urva-bvm",
    category: "bio-pesticides",
    formulation: "Liquid",
    packing: ["250ml", "500ml", "1000ml", "5000ml"],
    prices: [{"size": "250ml", "dp": "125.00", "mrp": "215.00"}, {"size": "500ml", "dp": "210.00", "mrp": "345.00"}, {"size": "1000ml", "dp": "315.00", "mrp": "625.00"}, {"size": "5000ml", "dp": "1625.00", "mrp": "2795.00"}],
    image: "assets/products/urva-bvm.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva BVM", _fallbackTech: "Beauveria + Verticillium + Metarhizium Consortia"
  },

  // 4. Seed Processing & Box Products
  {
    id: "urva-azo",
    slug: "urva-azo",
    category: "soil-health",
    formulation: "Pouch / Granular",
    packing: ["400gm", "1000gm", "1200gm"],
    prices: [{"size": "400gm", "dp": "140.00", "mrp": "260.00"}, {"size": "1000gm", "dp": "260.00", "mrp": "480.00"}],
    image: "assets/products/urva-azo.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva AZO", _fallbackTech: "Azotobacter chroococcum + Penicillium pinophilum + Trichoderma viride"
  },
  {
    id: "urva-rhizo",
    slug: "urva-rhizo",
    category: "soil-health",
    formulation: "Pouch / Granular",
    packing: ["2 nos", "4 nos"],
    prices: [{"size": "2 nos", "dp": "140.00", "mrp": "260.00"}, {"size": "4 nos", "dp": "260.00", "mrp": "480.00"}],
    image: "assets/products/urva-rhizo.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Rhizo", _fallbackTech: "Rhizobium spp + Penicillium pinophilum + Trichoderma viride"
  },
  {
    id: "urva-p2k2",
    slug: "urva-p2k2",
    category: "growth-boosters",
    formulation: "Soluble Powder / Box",
    packing: ["1kg Box"],
    prices: [{"size": "1kg", "dp": "375.00", "mrp": "685.00"}],
    image: "assets/products/urva-p2k2.png",
    youtubeUrl: "https://www.youtube.com/watch?v=kU_v34x01Bw",
    _fallbackName: "Urva P2K2", _fallbackTech: "Penicillium pinophilum (ICAR-NRCP Patented Strain)"
  },

  // 5. Specialty Buckets
  {
    id: "urva-fungo",
    slug: "urva-fungo",
    category: "bio-fungicides",
    formulation: "Bucket Carrier Consortia",
    packing: ["2kg Bucket", "4kg Bucket"],
    prices: [{"size": "2kg Bucket", "dp": "485.00", "mrp": "895.00"}, {"size": "4kg Bucket", "dp": "890.00", "mrp": "1650.00"}],
    image: "assets/products/urva-fungo.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Fungo / Aalvani Fungo", _fallbackTech: "Trichoderma spp + Pseudomonas spp + Penicillium pinophilum"
  },
  {
    id: "urva-wilto",
    slug: "urva-wilto",
    category: "bio-fungicides",
    formulation: "Bucket Carrier Consortia",
    packing: ["2kg Bucket", "4kg Bucket"],
    prices: [{"size": "2kg Bucket", "dp": "485.00", "mrp": "895.00"}, {"size": "4kg Bucket", "dp": "890.00", "mrp": "1650.00"}],
    image: "assets/products/urva-wilto.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Wilto / Aalvani Wilto", _fallbackTech: "Aspergillus niger + Bacillus subtilis + Penicillium pinophilum"
  },
  {
    id: "urva-nutri",
    slug: "urva-nutri",
    category: "bio-fertilizers",
    formulation: "Bucket Carrier Consortia",
    packing: ["2kg Bucket", "4kg Bucket"],
    prices: [{"size": "2kg Bucket", "dp": "485.00", "mrp": "895.00"}, {"size": "4kg Bucket", "dp": "890.00", "mrp": "1650.00"}],
    image: "assets/products/urva-nutri.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Nutri", _fallbackTech: "Penicillium pinophilum + Rhizobium + Azotobacter + PSB + KMB + ZSB"
  },
  {
    id: "urva-k-plus",
    slug: "urva-k-plus",
    category: "bio-fertilizers",
    formulation: "Bucket Carrier Consortia",
    packing: ["2kg Bucket", "4kg Bucket"],
    prices: [{"size": "2kg Bucket", "dp": "485.00", "mrp": "895.00"}, {"size": "4kg Bucket", "dp": "890.00", "mrp": "1650.00"}],
    image: "assets/products/urva-k-plus.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva K-Plus", _fallbackTech: "Penicillium pinophilum + KMB + ZSB + Silicon Solubilizers"
  },
  {
    id: "urva-microbes",
    slug: "urva-microbes",
    category: "growth-boosters",
    formulation: "Bucket Carrier Consortia",
    packing: ["2kg Bucket", "4kg Bucket"],
    prices: [{"size": "2kg Bucket", "dp": "495.00", "mrp": "925.00"}, {"size": "4kg Bucket", "dp": "920.00", "mrp": "1720.00"}],
    image: "assets/products/urva-microbes.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Microbes", _fallbackTech: "Penicillium pinophilum + Multi-Micro Nutrient Solubilizers"
  },
  {
    id: "urva-nemato",
    slug: "urva-nemato",
    category: "bio-pesticides",
    formulation: "Bucket Carrier Consortia",
    packing: ["2kg Bucket", "4kg Bucket"],
    prices: [{"size": "2kg Bucket", "dp": "495.00", "mrp": "925.00"}, {"size": "4kg Bucket", "dp": "920.00", "mrp": "1720.00"}],
    image: "assets/products/urva-nemato.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Nemato", _fallbackTech: "Paecilomyces lilacinus + Verticillium + Trichoderma viride"
  }
];

const RAW_ADDITIONAL_PRODUCTS_DATA = [
  // 6. Granular 25kg Agricultural Ranges
  {
    id: "urva-kombo",
    slug: "urva-kombo",
    category: "bio-fertilizers",
    formulation: "Granular",
    packing: ["25kg Bag"],
    prices: [{"size": "25kg Bag", "dp": "680.00", "mrp": "1250.00"}],
    image: "assets/products/urva-kombo.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Combo Jaivik (25kg)", _fallbackTech: "Multi-Strain Bio-Granular N:P:K + Microbes Consortia"
  },
  {
    id: "urva-compost-culture",
    slug: "urva-compost-culture",
    category: "soil-health",
    formulation: "Granular",
    packing: ["25kg Bag"],
    prices: [{"size": "25kg Bag", "dp": "650.00", "mrp": "1190.00"}],
    image: "assets/products/urva-compost-culture.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Compost Culture (25kg)", _fallbackTech: "Cellulolytic & Lignin Decomposing Fungi-Bacteria"
  },
  {
    id: "urva-potash",
    slug: "urva-potash",
    category: "bio-fertilizers",
    formulation: "Granular",
    packing: ["25kg Bag"],
    prices: [{"size": "25kg Bag", "dp": "695.00", "mrp": "1280.00"}],
    image: "assets/products/urva-potash.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Potash (25kg)", _fallbackTech: "Potash Mobilizing Bacteria (KMB) Granular"
  },
  {
    id: "urva-pinaca",
    slug: "urva-pinaca",
    category: "bio-pesticides",
    formulation: "Granular",
    packing: ["25kg Bag"],
    prices: [{"size": "25kg Bag", "dp": "720.00", "mrp": "1350.00"}],
    image: "assets/products/urva-pinaca.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Pinaca (25kg)", _fallbackTech: "Metarhizium anisopliae Granular Bio-Pesticide"
  },
  {
    id: "urva-urja-gr",
    slug: "urva-urja-gr",
    category: "growth-boosters",
    formulation: "Granular",
    packing: ["25kg Bag"],
    prices: [{"size": "25kg Bag", "dp": "690.00", "mrp": "1295.00"}],
    image: "assets/products/urva-urja.png",
    youtubeUrl: "https://youtube.com/@bhartigreentechshetimitra6078",
    _fallbackName: "Urva Urja (25kg)", _fallbackTech: "Carrier Based Consortia N.P.K Granular"
  }
];

const PRODUCTS_DATA = RAW_PRODUCTS_DATA.map(p => attachProductGetters(p, p._fallbackName || p.id, p._fallbackTech || ""));
const ADDITIONAL_PRODUCTS_DATA = RAW_ADDITIONAL_PRODUCTS_DATA.map(p => attachProductGetters(p, p._fallbackName || p.id, p._fallbackTech || ""));

if (typeof window !== 'undefined') {
  window.COMPANY_INFO = COMPANY_INFO;
  window.PRODUCTS_DATA = PRODUCTS_DATA;
  window.ADDITIONAL_PRODUCTS_DATA = ADDITIONAL_PRODUCTS_DATA;
  window.getProductById = (id) => [...PRODUCTS_DATA, ...ADDITIONAL_PRODUCTS_DATA].find(p => p.id === id || p.slug === id);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COMPANY_INFO,
    PRODUCTS_DATA,
    ADDITIONAL_PRODUCTS_DATA,
    getProductById: (id) => [...PRODUCTS_DATA, ...ADDITIONAL_PRODUCTS_DATA].find(p => p.id === id || p.slug === id)
  };
}