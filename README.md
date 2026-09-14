# 💡 LumiWatch — Smart Streetlight Monitoring & AI Complaint System

A modern civic-tech web application built for hackathons that empowers citizens to monitor municipal streetlights in real time and submit photo-verified complaints evaluated by Computer Vision AI.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (or yarn / pnpm)

### 2. Installation
```bash
# Clone or navigate to the repository directory
cd hackathon

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`** (or the port displayed in your terminal).

---

## ⚙️ Backend Integration Guide (For AI / Backend Teammate)

The frontend is built with a decoupled service layer (`src/services/api.js`) and environment variable configuration so that switching between **Mock Mode** (prototype demo) and **Real AI Backend Mode** takes only one line.

### Environment Configuration (`.env`)

Create or edit `.env` in the root folder:

```env
# Set to 'false' to connect to your live backend API
VITE_USE_MOCK_API=false

# Your backend API Base URL
VITE_API_BASE_URL=http://localhost:8000/api
```

*(Leave `VITE_USE_MOCK_API=true` when demonstrating without a running backend server).*

---

## 📡 API Contract Specification

### Endpoint: `POST /api/complaints`

#### Request Payload (`application/json`):
```json
{
  "problemType": "Streetlight not working",
  "description": "The main streetlight opposite Block C has been unlit for 3 nights.",
  "location": "Sector 4, Main Commercial Street, Near Metro Pillar 114",
  "landmark": "Opposite Star Cafe",
  "userName": "Aarav Sharma",
  "contact": "aarav.sharma@example.com",
  "image": "data:image/jpeg;base64,..." 
}
```

#### Supported `problemType` values:
- `Streetlight not working`
- `Streetlight flickering`
- `Light too dim`
- `Damaged streetlight`
- `Pole damaged`
- `Other`

---

#### Expected Response Payload (`application/json`):
```json
{
  "complaintId": "SL-2026-104",
  "status": "verified",
  "confidence": 0.96,
  "reason": "The complaint contains sufficient information and the uploaded image supports the reported streetlight issue. Zero lux reading confirmed on luminaire fixture.",
  "aiBreakdown": {
    "lightFixtureDetected": true,
    "defectCategory": "Non-functional Luminaire",
    "illuminationLevel": "0.0 Lux",
    "riskScore": "High Priority"
  }
}
```

---

### AI Verification Status States

The frontend dynamically styles the result card based on `status`:

| Status | Card Visual | Meaning |
| :--- | :--- | :--- |
| `"verified"` | 🟢 **GREEN** — `✓ Verified — Ready to Send` | AI confirmed streetlight failure or damage with high confidence (>0.85). |
| `"needs_information"` | 🟡 **YELLOW** — `⚠ Needs More Information` | Image is blurry, captured in extreme daylight glare, or needs extra landmark clarity. |
| `"rejected"` | 🔴 **RED** — `✕ Not Verified` | No streetlight fixture detected in photo, or photo is irrelevant to lighting infrastructure. |

---

## 🌟 Key Application Features

1. **Interactive Streetlight Telemetry Grid & Map**:
   - Live sector filtering (Central Business District, Tech Park, Residential, Metro Terminal).
   - Real-time node health indicators (**Green** = Operational, **Yellow** = Fault/Dim, **Red** = Outage/Hazard).
   - One-click "Report this Pole" to pre-fill complaint data.

2. **Smart Complaint Submission**:
   - Client-side validation with inline error highlighting.
   - Drag-and-drop photo upload with instant preview and preset demo samples.
   - Animated Computer Vision scanning simulation during submission.

3. **AI Verification Result Page**:
   - Comprehensive diagnostic breakdown, confidence gauge, and technical reasoning.
   - Clear civic hackathon disclaimer banner (*prototype disclaimer*).
   - Printable record view and quick re-submission.

4. **Complaints Log & Dashboard**:
   - Searchable and filterable by status (`All`, `Verified`, `Needs Information`, `Rejected`).
   - Quick-inspect modal drawer for fast review.

5. **Floating AI Demo Tester (`DevModeSwitcher`)**:
   - Floating widget in the bottom-right corner allowing judges and testers to test and force **Verified**, **Needs Info**, or **Rejected** states on the fly!

---

## 🛠️ Project Structure

```
hackathon/
├── .env                  # Environment config (API URL & Mock toggle)
├── .env.example          # Example template for team members
├── index.html            # Entry HTML with modern typography
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite build & dev configuration
├── src/
│   ├── assets/           # Static assets
│   ├── components/
│   │   ├── Navbar.jsx            # Header navigation & active badges
│   │   ├── Footer.jsx            # Civic footer with disclaimer & reset
│   │   ├── DevModeSwitcher.jsx   # Interactive floating AI state tester
│   │   ├── ImageUploader.jsx     # Drag-drop & sample image selector
│   │   └── StreetlightMap.jsx    # Interactive City Zone Grid with Green/Yellow/Red
│   ├── context/
│   │   └── ComplaintContext.jsx  # Global state, persistence, and navigation
│   ├── pages/
│   │   ├── LandingPage.jsx       # Hero, 3-step workflow, live telemetry
│   │   ├── ComplaintPage.jsx     # Validated submission form & scanner
│   │   ├── VerificationResultPage.jsx # AI Diagnostic card & confidence
│   │   └── DashboardPage.jsx     # Filterable logs, metrics & inspection
│   ├── services/
│   │   ├── api.js                # Environment-aware API client
│   │   └── mockApi.js            # Realistic Vision AI simulator
│   ├── utils/
│   │   └── mockData.js           # Seed streetlights and complaints
│   ├── App.jsx                   # Root application router
│   ├── index.css                 # Civic design system tokens & styles
│   └── main.jsx                  # React DOM mount point
└── README.md
```

---

## 🧪 Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready for deployment to Vercel, Netlify, or any static host.
