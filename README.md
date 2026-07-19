# Bharti Green Tech 🌿

Bharti Green Tech is a premium, fully responsive, and multi-lingual web application and administrative management portal designed for modern organic farming products and soil solutions. 

This platform connects farmers with soil-care products, facilitates inquiries (both via direct form submissions and WhatsApp click-to-chat), and provides an Administrative Control Panel for record management, feedback moderation, and data governance.

---

## 🌟 Key Features

### 1. Multi-Lingual Public Website
* Fully translated in **English**, **Hindi**, and **Marathi**.
* Persistent language preference setting across pages.
* Interactive product galleries, testimonials, and video sections.

### 2. Inquiry System
* **Double-Submission Protection**: Implements a 15-second rate limiter to block duplicate submissions.
* **Format Validation**: Strict validation for required fields and 10-digit mobile number parameters.
* **WhatsApp Integration**: Instant formatted click-to-chat inquiry generation for quick communication.

### 3. Administrative Control Panel (`admin.html`)
* **Secure Session Auth**: Password-protected login session store (defaults to `om_chavan` / `123456`).
* **Moderation Pipeline**: Review, approve, hide, or restore user feedback (Farmer Stories) before publishing.
* **Safe Data Governance (Trash Bin)**:
  * **Soft-Delete**: Moves records to a Trash Bin with restoration capabilities.
  * **Unified Trash API**: Securely purges records physically from the database only if they reside in the Trash tab.
  * **Automatic Snapshot Backups**: Generates automated timestamped JSON snapshots in the `backups/` directory prior to any permanent erase operation.
* **Audit Trail (Activity Log)**: Tracking administrative actions (logins, status changes, soft-deletes, permanent removals) associated with the admin username.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5 (Semantic Markup), Vanilla CSS (Custom Properties, Glassmorphism, Responsive Grid layouts), Vanilla JavaScript (DOM manipulation, Localized i18n manager).
* **Backend**: Node.js, Express.js.
* **Database**: JSON Flat-File storage (`inquiries.json`, `feedback.json`, `activity_log.json`, `config.json`) with asynchronous file operations handled via the Node `fs/promises` library.

---

## ⚙️ Project Setup & Installation

### Prerequisites
* **Node.js** (v16+ recommended)
* **npm**

### Steps to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aditiyelpale20/greentech.git
   cd greentech
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Express Server**:
   ```bash
   npm start
   ```

4. **Access the Portals**:
   * **Public Portal**: Open [http://localhost:3000/index.html](http://localhost:3000/index.html) in your browser.
   * **Admin Dashboard**: Open [http://localhost:3000/admin.html](http://localhost:3000/admin.html) in your browser.
     * *Default Credentials*: Username: `om_chavan` | Password: `123456`

---

## 📂 Project Structure

```text
├── assets/
│   ├── css/           # Styling files
│   ├── js/            # Client-side scripts (main.js, products.js, languageManager.js)
│   └── images/        # Product and UI images
├── backups/           # Auto-generated database snapshots
├── locales/           # English, Marathi, and Hindi translations
├── db.js              # Database helper class (JSON File read/writes)
├── server.js          # Express.js backend controller and API endpoints
├── index.html         # Homepage
├── contact.html       # Contact page
├── farmer-stories.html# Customer reviews & testimonials page
├── product-details.html# Product spec page
├── admin.html         # Admin dashboard
├── package.json       # Node package manager configuration
└── README.md          # Project documentation
```
