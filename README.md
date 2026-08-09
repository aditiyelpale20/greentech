# Bharti Green Tech 🌿
*Solution for Better Life*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-brightgreen.svg)](https://nodejs.org/)
[![Multi-Lingual](https://img.shields.io/badge/Languages-English%20%7C%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A4%80-blue.svg)](#-multi-lingual-system)

**Bharti Green Tech** is a responsive, multi-lingual web platform and administrative management portal for modern biotechnology agricultural products and organic soil solutions.

The platform connects farmers with bio-fertilizers, bio-fungicides, bio-pesticides, and soil conditioners, enables direct inquiries via web forms and WhatsApp, and provides a secure Administrative Control Panel for record management, testimonial moderation, and data governance.

---

## 🌟 Key Features

### 1. Multi-Lingual Architecture
* **Full Multi-Lingual Support**: Seamless switching across **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)**.
* **Synchronous & Dynamic**: Translations are loaded instantly into memory with zero layout flicker or network delays.
* **Reactive Modals & Catalogs**: Switching languages updates all product names, technical specifications, benefits, crop recommendations, dosages, and packaging details in real time.

### 2. Interactive Product Catalog & Quick-View Modal
* **High-Resolution Transparent Product Imagery**: 42+ standardized, transparent product assets (600x600) with zero background artifacts.
* **Category Filtering & Search**: Instant filtering by Bio-Fertilizers, Growth Boosters, Bio-Fungicides, Bio-Pesticides, and Soil Health.
* **Silky Smooth Quick-View Modal**: Instant slide-up modal with backdrop blur, spec tables, pricing breakdown, YouTube demo video links, and direct WhatsApp inquiry buttons.

### 3. Smart Inquiry & Direct WhatsApp Integration
* **Rate-Limited Inquiry Submissions**: 15-second double-submission lock with client & server-side validation for 10-digit mobile numbers.
* **Pre-Filled WhatsApp Chats**: Direct click-to-chat links formatted with product names and technical details for instant farmer consultation (`+91 90497 47555`).

### 4. Administrative Control Panel (`admin.html`)
* **Secure Authentication**: Protected admin dashboard session (`om_chavan` / `123456`).
* **Farmer Stories Moderation Pipeline**: Review, approve, hide, or restore farmer reviews and success stories before publishing to the public homepage.
* **Inquiry Management**: View, filter, and respond to incoming farmer inquiries.
* **Safe Trash Bin & Permanent Deletion**:
  * **Soft Delete**: Move items to Trash with single-click restoration.
  * **Hard Delete**: Permanent deletion allowed only on records already residing in Trash.
  * **Automated Snapshot Backups**: Generates automated timestamped JSON snapshots in the `backups/` folder prior to any permanent erase operation.
* **Activity Audit Trail**: Real-time logging of all administrative actions (logins, status updates, soft deletes, and permanent deletions).

---

## 📦 Complete Product Catalog

| Product | Category | Formulation | Technical Composition |
| :--- | :--- | :--- | :--- |
| **Urva Carbon** | Growth Booster | Liquid (1L / 5L) | Liquid Consortia (N:P:K) Enriched with Carbon |
| **Urva N** | Bio-Fertilizer | Liquid (1L / 5L) | *Azotobacter chroococcum* |
| **Urva P** | Bio-Fertilizer | Liquid (1L / 5L) | Phosphate Solubilizing Bacteria (PSB) |
| **Urva K** | Bio-Fertilizer | Liquid (1L / 5L) | Potash Mobilizing Bacteria (KMB) |
| **Urva Urja** | Growth Booster | Liquid (250ml - 5L) | Bio-Consortia & Vital Amino Complex |
| **Urva Vajra** | Bio-Fungicide | Liquid (1L / 5L) | *Trichoderma viride* |
| **Urva Ayudh** | Bio-Fungicide | Liquid (1L / 5L) | *Pseudomonas fluorescens* |
| **Urva Sudarshan** | Bio-Fungicide | Liquid (1L / 5L) | *Bacillus subtilis* |
| **Urva Ampelo** | Bio-Fungicide | Liquid (1L / 5L) | *Ampelomyces quisqualis* |
| **Urva Shone** | Bio-Pesticide | Liquid (1L / 5L) | *Beauveria bassiana* |
| **Urva Rakshak** | Bio-Pesticide | Liquid (1L / 5L) | *Paecilomyces lilacinus* |
| **Urva Rudra** | Bio-Pesticide | Liquid (1L / 5L) | *Verticillium lecanii* |
| **Urva Dhanush** | Bio-Pesticide | Liquid (250ml / 500ml) | *Bacillus thuringiensis* (BT) |
| **Urva Pinaca (Liquid)** | Bio-Pesticide | Liquid (1L / 5L) | *Metarhizium anisopliae* |
| **Urva BVM** | Bio-Pesticide | Liquid (1L / 5L) | Bio-Pesticide Consortia (B + V + M) |
| **Urva Microbes** | Growth Booster | Bucket (2kg / 4kg) | *Penicillium pinophilum* + Micronutrient Solubilizers |
| **Urva Wilto** | Bio-Fungicide | Bucket (2kg / 4kg) | *Aspergillus niger* + *Bacillus subtilis* + *Penicillium* |
| **Urva K-Plus** | Bio-Fertilizer | Bucket (2kg / 4kg) | *Penicillium pinophilum* + KMB + ZSB + Silicon |
| **Urva Nutri** | Bio-Fertilizer | Bucket (2kg / 4kg) | *Penicillium* + *Rhizobium* + *Azotobacter* + PSB + KMB + ZSB |
| **Urva Fungo** | Bio-Fungicide | Bucket (2kg / 4kg) | *Trichoderma* + *Pseudomonas* + *Penicillium* |
| **Urva Nemato** | Bio-Pesticide | Bucket (2kg / 4kg) | *Paecilomyces* + *Verticillium* + *Trichoderma* |
| **Urva P2K2** | Growth Booster | Box (1kg) | *Penicillium pinophilum* (ICAR Patented) |
| **Urva Combo Jaivik** | Bio-Fertilizer | Granular (25kg Bag) | Multi-Strain Granular N:P:K + Microbes |
| **Urva Compost Culture** | Soil Health | Granular (25kg Bag) | Cellulolytic & Lignin Decomposing Fungi-Bacteria |
| **Urva Potash (25kg)** | Bio-Fertilizer | Granular (25kg Bag) | Potash Mobilizing Bacteria (KMB) Granular |
| **Urva Pinaca (25kg)** | Bio-Pesticide | Granular (25kg Bag) | *Metarhizium anisopliae* Granular Bio-Pesticide |
| **Urva Spurad** | Bio-Fertilizer | Powder / Liquid | Phosphate Solubilizing Bacteria + Trichoderma |
| **Urva Slurry Culture** | Soil Health | Liquid (250ml / 1L) | Algae, Micro-organisms & Useful Nematodes |
| **Urva D-Compost** | Soil Health | Liquid Duo / Granular | *Trichoderma*, *Cellulomonas*, *Bacillus* |
| **Urva AZO & Rhizo** | Seed Processing | Pouch / Granular | Seed Treatment Bacterial Consortia |

---

## 🛠️ Technology Stack

* **Frontend**: HTML5 (Semantic Structure), Vanilla CSS3 (Custom Design Tokens, Glassmorphism, Responsive Grid & Flexbox), Vanilla JavaScript ES6+ (Dynamic `Object.defineProperties` getters, Event-driven i18n manager).
* **Backend**: Node.js, Express.js.
* **Database & Persistence**: JSON Flat-File Storage (`inquiries.json`, `feedback.json`, `activity_log.json`, `config.json`) with atomic asynchronous file operations via `fs/promises`.
* **Image Processing**: Python, OpenCV, PyMuPDF, PIL with alpha matting and GrabCut segmentation.

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js** (v16.0.0 or higher)
* **npm** (v8.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/aditiyelpale20/greentech.git
cd greentech
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

### 4. Access the Platform
* **Public Website**: [http://localhost:3000/index.html](http://localhost:3000/index.html)
* **Product Catalog**: [http://localhost:3000/products.html](http://localhost:3000/products.html)
* **Admin Control Panel**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
  * *Default Username*: `om_chavan`
  * *Default Password*: `123456`

---

## 🌐 Production Deployment

The platform is designed to be self-contained and deployable on any cloud provider or hosting environment:

### Deploying to Render / Railway / Heroku
1. Connect your GitHub repository: `https://github.com/aditiyelpale20/greentech.git`.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variable: `PORT=3000` (or leave default assigned by host).

### Deploying Behind Nginx / Apache
Configure a reverse proxy to forward traffic to `http://127.0.0.1:3000`:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## 📁 Directory Structure

```text
├── assets/
│   ├── css/
│   │   └── style.css            # Central responsive stylesheet & modal animations
│   ├── js/
│   │   ├── main.js              # Header, navigation & general interactivity
│   │   └── products.js          # Unified product catalog with dynamic i18n getters
│   └── products/                # 42+ Clean transparent product images (600x600 PNG)
│       └── originals/           # Raw high-resolution sources
├── backups/                     # Auto-generated database backup snapshots
├── activity_log.json            # Administrative audit trail log
├── config.json                  # System configuration
├── db.js                        # Flat-file database controller
├── farmer-stories.html          # Farmer testimonials & submission form
├── feedback.json                # User testimonials & moderation status
├── i18n.js                      # Core i18n translation engine
├── index.html                   # Public homepage
├── inquiries.json               # Farmer inquiry records
├── languageManager.js           # DOM language scanner & selector handler
├── package.json                 # Node.js dependencies & scripts
├── product-details.html         # Standalone full product specification page
├── products.html                # Product catalog with Quick-View modal
├── README.md                    # Comprehensive documentation
├── server.js                    # Express API server & routes
└── translations.js              # Packed EN, MR, HI translations dictionary
```

---

## 📞 Support & Contact

* **Company**: BHARTI GREEN TECH
* **Phone / WhatsApp**: +91 90497 47555
* **Email**: info@bhartigreentech.com
* **Plant**: Gat No. 629, At Post Sokasan, Tal-Man, Satara, Maharashtra - 415508
* **Corporate Office**: Prakash Resi., 702, Sector 10E, Road Pali, Navi Mumbai, Maharashtra

