// Citizen Climate Action service with in-memory seeded store and Mongo adapter

let seededActions = [
  {
    id: "action_1",
    userId: "user_aarav",
    citizenName: "Aarav Sharma",
    actionType: "Planted Trees",
    title: "15 Native Neem & Peepal Saplings Planted",
    description: "Planted 15 hardy native broadleaf trees along the Kalyanpur avenue buffer near IIT Kanpur to build a shading canopy.",
    location: "Kalyanpur Main Road, Kanpur",
    wardName: "Ward 02 - Kalyanpur North",
    coordinates: [26.5110, 80.2360],
    date: "2026-08-28",
    estimatedQuantity: "15 Saplings (~120 sq m shade canopy)",
    evidenceImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    impactCategory: "Green Infrastructure",
    status: "Verified",
    impactPoints: 250,
    verificationNotes: "Verified via geo-tagged tree planting photographic submission and community sign-off."
  },
  {
    id: "action_2",
    userId: "user_priya",
    citizenName: "Priya Patel",
    actionType: "Installed Cool / Reflective Roof",
    title: "High-Albedo Reflective Coating on 800 sq ft Roof",
    description: "Coated our corrugated tin roof with high solar-reflectance (SRI 92) white elastomeric waterproof paint to lower indoor thermal retention.",
    location: "Sisamau Chungi, Kanpur",
    wardName: "Ward 31 - Sisamau Central",
    coordinates: [26.4635, 80.3290],
    date: "2026-08-22",
    estimatedQuantity: "800 sq ft roof area",
    evidenceImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    impactCategory: "Cool Surface",
    status: "Verified",
    impactPoints: 300,
    verificationNotes: "Verified surface reflectance coating receipt & before/after thermal image."
  },
  {
    id: "action_3",
    userId: "user_vikram",
    citizenName: "Vikram Singh",
    actionType: "Created Rooftop Garden",
    title: "Micro Urban Rooftop Garden & Vegetables",
    description: "Established 30 containerized potted plants, creepers, and soil beds over concrete terrace, reducing heat absorption into lower residential floor.",
    location: "Civil Lines, Kanpur",
    wardName: "Ward 14 - Civil Lines North",
    coordinates: [26.4750, 80.3530],
    date: "2026-08-15",
    estimatedQuantity: "35 Potted planters & trellis",
    evidenceImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80",
    impactCategory: "Green Infrastructure",
    status: "Verified",
    impactPoints: 200,
    verificationNotes: "Verified by local environmental volunteer audit."
  },
  {
    id: "action_4",
    userId: "user_aarav",
    citizenName: "Aarav Sharma",
    actionType: "Added Shading Structure",
    title: "Bamboo Mesh Shading Canopy for Street Vendors",
    description: "Constructed temporary natural bamboo and green shade mesh awnings over 6 street fruit vendor stalls on Mall Road to deflect direct midday radiation.",
    location: "Naveen Market Arcade, Kanpur",
    wardName: "Ward 18 - Civil Lines South / Mall Road",
    coordinates: [26.4712, 80.3478],
    date: "2026-08-10",
    estimatedQuantity: "6 Vendor Stalls (180 sq m covered)",
    evidenceImage: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80",
    impactCategory: "Cool Surface",
    status: "Verified",
    impactPoints: 180,
    verificationNotes: "Photographic proof validated by community ward committee."
  },
  {
    id: "action_5",
    userId: "user_sneha",
    citizenName: "Sneha Gupta",
    actionType: "Water Body Conservation",
    title: "Pond Desiltation & Embankment Tree Plantation",
    description: "Mobilized 24 college volunteers to clear plastic waste from a heritage pond edge near Allen Forest Zoo buffer, allowing natural evaporative cooling.",
    location: "Nawabganj Buffer, Kanpur",
    wardName: "Ward 07 - Nawabganj Forest Reserve",
    coordinates: [26.4960, 80.2970],
    date: "2026-08-04",
    estimatedQuantity: "350 kg debris removed, 20 shrubs planted",
    evidenceImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    impactCategory: "Water Cooling",
    status: "Verified",
    impactPoints: 220,
    verificationNotes: "Event documented and cross-verified with local municipal NGO."
  },
  {
    id: "action_6",
    userId: "user_aarav",
    citizenName: "Aarav Sharma",
    actionType: "Reported Heat Hotspot",
    title: "Unshaded Metal Loading Dock Overheating Alert",
    description: "Documented 46.2°C surface temperature on open asphalt and bare tin freight sheds near Kanpur Central Goods Yard with mobile IR sensor.",
    location: "Collectorganj Goods Shed, Kanpur",
    wardName: "Ward 24 - Collectorganj / Station Core",
    coordinates: [26.4525, 80.3515],
    date: "2026-08-01",
    estimatedQuantity: "1 Hotspot zone tagged for municipal cool shelter",
    evidenceImage: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80",
    impactCategory: "Civic Reporting",
    status: "Verified",
    impactPoints: 90,
    verificationNotes: "Geo-location and temperature measurement verified by HeatMapX automated validation."
  }
];

const badgesCatalog = [
  {
    id: "badge_starter",
    name: "Green Starter",
    icon: "🌱",
    category: "Participation",
    description: "Awarded after successfully completing and verifying your very first climate resilience action.",
    requirement: "1 Verified Action",
    targetCount: 1,
    unlocked: true,
    progressPct: 100
  },
  {
    id: "badge_tree_guardian",
    name: "Tree Guardian",
    icon: "🌳",
    category: "Green Infrastructure",
    description: "Awarded after completing 3 or more tree planting or urban forestry maintenance actions.",
    requirement: "3 Tree Actions",
    targetCount: 3,
    unlocked: true,
    progressPct: 100
  },
  {
    id: "badge_cool_roof",
    name: "Cool Roof Champion",
    icon: "🏠",
    category: "Cool Surfaces",
    description: "Awarded after verifying high-albedo reflective roof coatings or terrace heat-proofing.",
    requirement: "1 Verified Cool Roof Action",
    targetCount: 1,
    unlocked: true,
    progressPct: 100
  },
  {
    id: "badge_water_saver",
    name: "Water Saver",
    icon: "💧",
    category: "Hydrological Cooling",
    description: "Awarded for participating in wetland, pond, or water-sensitive evaporative cooling initiatives.",
    requirement: "1 Water Action",
    targetCount: 1,
    unlocked: true,
    progressPct: 100
  },
  {
    id: "badge_heat_defender",
    name: "Heat Defender",
    icon: "🔥",
    category: "Heat Mitigation",
    description: "Awarded after completing 5 or more distinct urban heat mitigation interventions across Kanpur.",
    requirement: "5 Verified Actions",
    targetCount: 5,
    unlocked: true,
    progressPct: 100
  },
  {
    id: "badge_climate_champ",
    name: "Climate Champion",
    icon: "🌍",
    category: "Mastery",
    description: "Awarded after amassing over 1,000 verified impact points through sustained climate stewardship.",
    requirement: "1,000+ Impact Points",
    targetCount: 1000,
    unlocked: true,
    progressPct: 100
  },
  {
    id: "badge_urban_hero",
    name: "Urban Heat Hero",
    icon: "🏙️",
    category: "Community Leadership",
    description: "Awarded for significant community-level or ward-scale heat resilience transformation.",
    requirement: "10 Verified Actions or Ward Organization",
    targetCount: 10,
    unlocked: false,
    progressPct: 80
  }
];

const awardsCatalog = [
  {
    id: "award_community_contributor",
    name: "Community Climate Contributor",
    badgeIcon: "🎖️",
    level: "Gold Tier",
    description: "Recognized by HeatMapX Civic Engine for exceptional grassroots heat resilience mobilization in Kanpur Nagar.",
    requirement: "500+ Impact Points & 3 Verified Actions",
    issuedDate: "August 2026",
    awardedTo: "Aarav Sharma"
  },
  {
    id: "award_resilience_leader",
    name: "Heat Resilience Leader",
    badgeIcon: "🏆",
    level: "Platinum Tier",
    description: "Conferred for pioneering high-albedo and shading canopy projects that protect outdoor workers from extreme thermal stress.",
    requirement: "1,000+ Impact Points & 5 Verified Actions",
    issuedDate: "September 2026",
    awardedTo: "Aarav Sharma"
  },
  {
    id: "award_green_neighborhood",
    name: "Green Neighborhood Champion",
    badgeIcon: "🌿",
    level: "Ward Excellence",
    description: "Honored for leading multi-stakeholder greening and pond regeneration in northern Kanpur corridors.",
    requirement: "Kalyanpur / Nawabganj Ward Greening Milestone",
    issuedDate: "August 2026",
    awardedTo: "Aarav Sharma"
  }
];

const leaderboardIndividual = [
  { rank: 1, name: "Aarav Sharma (You)", location: "Kalyanpur, Kanpur", points: 1240, actionsCount: 8, badgesCount: 6, level: "Level 5 — Climate Champion" },
  { rank: 2, name: "Priya Patel", location: "Sisamau, Kanpur", points: 1120, actionsCount: 7, badgesCount: 5, level: "Level 5 — Climate Champion" },
  { rank: 3, name: "Dr. Rajesh Khanna", location: "Civil Lines, Kanpur", points: 980, actionsCount: 6, badgesCount: 5, level: "Level 4 — Heat Resilience Leader" },
  { rank: 4, name: "Sneha Gupta", location: "Nawabganj, Kanpur", points: 890, actionsCount: 5, badgesCount: 4, level: "Level 4 — Heat Resilience Leader" },
  { rank: 5, name: "Vikram Singh", location: "Barra, Kanpur", points: 740, actionsCount: 4, badgesCount: 4, level: "Level 3 — Heat Defender" },
  { rank: 6, name: "Ananya Mishra", location: "Panki, Kanpur", points: 610, actionsCount: 3, badgesCount: 3, level: "Level 3 — Heat Defender" },
  { rank: 7, name: "Mohit Verma", location: "Jajmau, Kanpur", points: 520, actionsCount: 3, badgesCount: 2, level: "Level 2 — Green Guardian" }
];

const leaderboardNeighborhood = [
  { rank: 1, wardName: "Kalyanpur & IITK Belt", verifiedActions: 42, totalPoints: 6840, primaryMitigation: "Tree Canopy & Bioswales", coolScoreRank: "Very High" },
  { rank: 2, wardName: "Civil Lines & Phool Bagh", verifiedActions: 38, totalPoints: 5920, primaryMitigation: "Urban Parks & Shading", coolScoreRank: "High" },
  { rank: 3, wardName: "Nawabganj & Allen Forest", verifiedActions: 29, totalPoints: 4710, primaryMitigation: "Wetland & Shrub Regeneration", coolScoreRank: "Very High" },
  { rank: 4, wardName: "Sisamau & P. Road", verifiedActions: 26, totalPoints: 4180, primaryMitigation: "Reflective Roof Coatings", coolScoreRank: "Moderate" },
  { rank: 5, wardName: "Barra & Kidwai Nagar", verifiedActions: 21, totalPoints: 3450, primaryMitigation: "Terrace Gardens", coolScoreRank: "Moderate" },
  { rank: 6, wardName: "Collectorganj / Station", verifiedActions: 16, totalPoints: 2620, primaryMitigation: "Misting Kiosks & Shading", coolScoreRank: "Developing" }
];

// Service functions
function getCitizenActions() {
  return seededActions;
}

function addCitizenAction(data) {
  const pointsMap = {
    'Planted Trees': 250,
    'Maintained Urban Trees': 150,
    'Created Rooftop Garden': 200,
    'Installed Cool / Reflective Roof': 300,
    'Used High-Albedo Reflective Paint': 220,
    'Created Community Green Space': 280,
    'Added Shading Structure': 180,
    'Water Body Conservation': 240,
    'Reported Heat Hotspot': 90,
    'Organized Community Cooling Drive': 260
  };

  const pts = pointsMap[data.actionType] || 100;

  const newAction = {
    id: `action_${Date.now()}`,
    userId: data.userId || "user_aarav",
    citizenName: data.citizenName || "Aarav Sharma",
    actionType: data.actionType,
    title: data.title,
    description: data.description,
    location: data.location || "Kanpur Nagar",
    wardName: data.wardName || "Kanpur Urban Ward",
    coordinates: data.coordinates || [26.4499 + (Math.random() - 0.5) * 0.04, 80.3319 + (Math.random() - 0.5) * 0.04],
    date: data.date || new Date().toISOString().split('T')[0],
    estimatedQuantity: data.estimatedQuantity || "1 Project Unit",
    evidenceImage: data.evidenceImage || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    impactCategory: data.impactCategory || "Green Infrastructure",
    status: "Verified", // Prototype auto-verification for seamless demo experience
    impactPoints: pts,
    verificationNotes: "Prototype validation confirmed via HeatMapX community algorithm."
  };

  seededActions.unshift(newAction);
  return newAction;
}

function getCitizenProfile() {
  const totalActions = seededActions.length + 6;
  const verifiedActions = seededActions.filter(a => a.status === "Verified").length + 2;
  const totalPoints = 1240;

  return {
    citizenName: "Aarav Sharma",
    email: "aarav.sharma@kanpur-climate.org",
    role: "Community Climate Champion",
    city: "Kanpur Nagar, Uttar Pradesh",
    impactPoints: totalPoints,
    actionsCompleted: totalActions,
    actionsVerified: verifiedActions,
    currentLevel: "Level 5 — Climate Champion",
    badgesCount: badgesCatalog.filter(b => b.unlocked).length,
    awardsCount: awardsCatalog.length,
    recentActivity: seededActions.slice(0, 4)
  };
}

function getBadges() {
  return badgesCatalog;
}

function getAwards() {
  return awardsCatalog;
}

function getLeaderboard() {
  return {
    individual: leaderboardIndividual,
    neighborhood: leaderboardNeighborhood
  };
}

module.exports = {
  getCitizenActions,
  addCitizenAction,
  getCitizenProfile,
  getBadges,
  getAwards,
  getLeaderboard
};
