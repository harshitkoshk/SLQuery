// Municipal Streetlight Network Telemetry (Dense grid along road corridors)
const BASE_LAT = 28.6139;
const BASE_LNG = 77.2090;

export const INITIAL_STREETLIGHTS = [
  // Ring Road Corridor (North-South)
  { id: "SL-N1-01", zone: "Ring Road North", street: "Mahatma Gandhi Ring Road, Pole #12", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT + 0.008, lng: BASE_LNG - 0.004, voltage: "230V", lux: "48 Lux", poleType: "LED 150W", lastHeartbeat: "2m ago" },
  { id: "SL-N1-02", zone: "Ring Road North", street: "Mahatma Gandhi Ring Road, Pole #13", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT + 0.006, lng: BASE_LNG - 0.003, voltage: "228V", lux: "46 Lux", poleType: "LED 150W", lastHeartbeat: "1m ago" },
  { id: "SL-N1-03", zone: "Ring Road North", street: "Mahatma Gandhi Ring Road, Pole #14", status: "warning", condition: "Flickering / 40% Low Lumens", lat: BASE_LAT + 0.004, lng: BASE_LNG - 0.002, voltage: "185V (Fluctuating)", lux: "18 Lux", poleType: "LED 150W", lastHeartbeat: "4m ago" },
  { id: "SL-N1-04", zone: "Ring Road North", street: "Ring Road & Sector 4 Cross", status: "critical", condition: "Complete Power Outage / Unlit", lat: BASE_LAT + 0.002, lng: BASE_LNG - 0.001, voltage: "0V", lux: "0 Lux", poleType: "LED 150W", lastHeartbeat: "32m ago" },
  { id: "SL-N1-05", zone: "Ring Road North", street: "Sector 4 Flyover Entrance", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT + 0.000, lng: BASE_LNG - 0.000, voltage: "231V", lux: "50 Lux", poleType: "LED 200W", lastHeartbeat: "Just now" },

  // Commercial Boulevard (East-West)
  { id: "SL-E2-11", zone: "Central Commercial", street: "Commercial Boulevard East, Gate 1", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT + 0.001, lng: BASE_LNG + 0.004, voltage: "229V", lux: "52 Lux", poleType: "Smart Luminaire 120W", lastHeartbeat: "1m ago" },
  { id: "SL-E2-12", zone: "Central Commercial", street: "Commercial Boulevard East, Gate 3", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT + 0.001, lng: BASE_LNG + 0.008, voltage: "230V", lux: "49 Lux", poleType: "Smart Luminaire 120W", lastHeartbeat: "3m ago" },
  { id: "SL-E2-13", zone: "Central Commercial", street: "Commercial Boulevard & Tech Avenue", status: "critical", condition: "Physical Pole Tilt / Casing Broken", lat: BASE_LAT + 0.002, lng: BASE_LNG + 0.012, voltage: "0V (Circuit Tripped)", lux: "0 Lux", poleType: "Heavy Duty 250W", lastHeartbeat: "1h ago" },
  { id: "SL-E2-14", zone: "Central Commercial", street: "Tech Avenue North Wing", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT + 0.005, lng: BASE_LNG + 0.011, voltage: "232V", lux: "55 Lux", poleType: "Smart Luminaire 120W", lastHeartbeat: "Just now" },
  { id: "SL-E2-15", zone: "Central Commercial", street: "Tech Avenue Tower 4", status: "warning", condition: "Degraded LED Array / Low Output", lat: BASE_LAT + 0.008, lng: BASE_LNG + 0.010, voltage: "210V", lux: "22 Lux", poleType: "Smart Luminaire 120W", lastHeartbeat: "5m ago" },

  // Residential Sector 7 & 9
  { id: "SL-S3-21", zone: "South Residential", street: "Green Park Avenue 1st Main", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT - 0.003, lng: BASE_LNG - 0.004, voltage: "228V", lux: "44 Lux", poleType: "Eco Glow 90W", lastHeartbeat: "2m ago" },
  { id: "SL-S3-22", zone: "South Residential", street: "Green Park Avenue 3rd Cross", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT - 0.005, lng: BASE_LNG - 0.005, voltage: "227V", lux: "45 Lux", poleType: "Eco Glow 90W", lastHeartbeat: "4m ago" },
  { id: "SL-S3-23", zone: "South Residential", street: "Green Park Community Hall", status: "critical", condition: "Blown Fuse / Unlit at Night", lat: BASE_LAT - 0.007, lng: BASE_LNG - 0.006, voltage: "0V", lux: "0 Lux", poleType: "Eco Glow 90W", lastHeartbeat: "45m ago" },
  { id: "SL-S3-24", zone: "South Residential", street: "South Heritage Road, Junction 9", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT - 0.008, lng: BASE_LNG - 0.002, voltage: "230V", lux: "48 Lux", poleType: "Eco Glow 90W", lastHeartbeat: "1m ago" },

  // Metro Link Corridor
  { id: "SL-M4-31", zone: "Metro Link Corridor", street: "Metro Pillar 140 Service Lane", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT - 0.004, lng: BASE_LNG + 0.005, voltage: "231V", lux: "50 Lux", poleType: "High Lumens 180W", lastHeartbeat: "3m ago" },
  { id: "SL-M4-32", zone: "Metro Link Corridor", street: "Metro Station Exit 2 Walkway", status: "warning", condition: "Flickering / Relay Intermittent", lat: BASE_LAT - 0.006, lng: BASE_LNG + 0.008, voltage: "190V", lux: "25 Lux", poleType: "High Lumens 180W", lastHeartbeat: "6m ago" },
  { id: "SL-M4-33", zone: "Metro Link Corridor", street: "Terminal Underpass Entry", status: "operational", condition: "100% Lumens Active", lat: BASE_LAT - 0.008, lng: BASE_LNG + 0.011, voltage: "230V", lux: "52 Lux", poleType: "High Lumens 180W", lastHeartbeat: "Just now" }
];

// Seed complaints for municipal department review (with consolidated duplicate clusters)
export const INITIAL_COMPLAINTS = [
  {
    complaintId: "SL-2026-001",
    problemType: "Streetlight not working",
    description: "The main streetlight opposite Block C has been dark for 3 nights. Pedestrians feeling unsafe.",
    location: "Sector 4, Main Commercial Street, Near Metro Pillar 114",
    landmark: "Opposite Star Cafe",
    userName: "Aarav Sharma",
    contact: "aarav.sharma@example.com",
    submittedAt: "2026-09-14T17:42:00Z",
    status: "verified",
    confidence: 0.96,
    accuracyScore: 96,
    authenticityScore: 98,
    isRealImage: true,
    imageName: "IMG_20260914_214512.jpg",
    isMerged: true,
    mergedCount: 3,
    reporters: [
      { name: "Aarav Sharma", contact: "aarav.sharma@example.com", time: "2026-09-14T17:42:00Z" },
      { name: "Rohit Sen", contact: "rohit.sen@mail.com", time: "2026-09-14T18:10:00Z" },
      { name: "Meera K.", contact: "9876543210", time: "2026-09-14T18:35:00Z" }
    ],
    reason: "Computer Vision verified real camera capture. Zero lux illumination confirmed on pole SL-N1-04 matching GIS coordinates. Image metadata validated as authentic (non-stock, non-AI).",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
    aiBreakdown: {
      lightFixtureDetected: true,
      defectCategory: "Non-functional Luminaire",
      illuminationLevel: "0.0 Lux",
      riskScore: "High Priority",
      authenticityVerdict: "Real Camera Evidence (Authentic)",
      antiSpoofingPass: true
    }
  },
  {
    complaintId: "SL-2026-002",
    problemType: "Pole damaged",
    description: "A delivery vehicle struck the pole. It is tilted at an angle with visible fractures near the base.",
    location: "Commercial Boulevard & Tech Avenue",
    landmark: "Near Tech Park Tower 1",
    userName: "Priya Patel",
    contact: "priya.p@civicmail.org",
    submittedAt: "2026-09-14T16:15:00Z",
    status: "verified",
    confidence: 0.98,
    accuracyScore: 98,
    authenticityScore: 99,
    isRealImage: true,
    imageName: "DCIM_Camera_Field_88.jpg",
    isMerged: false,
    mergedCount: 1,
    reporters: [
      { name: "Priya Patel", contact: "priya.p@civicmail.org", time: "2026-09-14T16:15:00Z" }
    ],
    reason: "Computer Vision structural analysis verified severe pole tilt (>25 degrees) with active mechanical hazard. High physical authenticity score.",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80",
    aiBreakdown: {
      lightFixtureDetected: true,
      defectCategory: "Severe Structural Fracture",
      illuminationLevel: "Offline",
      riskScore: "Critical Priority",
      authenticityVerdict: "Real Camera Evidence (Authentic)",
      antiSpoofingPass: true
    }
  },
  {
    complaintId: "SL-2026-003",
    problemType: "Streetlight not working",
    description: "Light not working near the park corner.",
    location: "Green Park Avenue 1st Main",
    landmark: "Park Gate 1",
    userName: "Vikram Malhotra",
    contact: "vikram@outlook.com",
    submittedAt: "2026-09-14T14:20:00Z",
    status: "needs_information",
    confidence: 0.58,
    accuracyScore: 58,
    authenticityScore: 72,
    isRealImage: true,
    imageName: "daytime_park.jpg",
    isMerged: false,
    mergedCount: 1,
    reporters: [
      { name: "Vikram Malhotra", contact: "vikram@outlook.com", time: "2026-09-14T14:20:00Z" }
    ],
    reason: "Image was captured in bright daylight. The AI model cannot verify nighttime lumen outage or electrical flickering from a daytime snapshot.",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80",
    aiBreakdown: {
      lightFixtureDetected: true,
      defectCategory: "Ambiguous Daylight Condition",
      illuminationLevel: "High Ambient Sunlight",
      riskScore: "Pending Citizen Re-submission",
      authenticityVerdict: "Daytime Photo (Inconclusive)",
      antiSpoofingPass: true
    }
  }
];

// Presets for testing & judge presentations
export const SAMPLE_IMAGES = [
  {
    name: "Night Outage (Real Photo — 96%)",
    url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    fileName: "IMG_20260914_210432.jpg",
    description: "Unlit luminaire in nighttime darkness",
    defaultProblem: "Streetlight not working",
    expectedOutcome: "verified",
    accuracyScore: 96,
    isReal: true
  },
  {
    name: "Fractured Pole (Real Photo — 98%)",
    url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    fileName: "Camera_Field_Pole_Damage.jpg",
    description: "Physical collision damage on streetlight pole",
    defaultProblem: "Pole damaged",
    expectedOutcome: "verified",
    accuracyScore: 98,
    isReal: true
  },
  {
    name: "Daylight Ambiguity (58% — Needs Info)",
    url: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80",
    fileName: "daylight_road_view.jpg",
    description: "High daytime sunlight glare",
    defaultProblem: "Streetlight flickering",
    expectedOutcome: "needs_information",
    accuracyScore: 58,
    isReal: true
  },
  {
    name: "Fake / Stock Download (22% — Rejected)",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    fileName: "download_stock_photo_shutterstock_9921.jpg",
    description: "Stock internet download / non-streetlight garbage",
    defaultProblem: "Other",
    expectedOutcome: "rejected",
    accuracyScore: 22,
    isReal: false
  }
];
