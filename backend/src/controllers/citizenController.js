const citizenService = require('../services/citizenService');

// GET /api/citizen/actions - Returns list of citizen mitigation submissions
exports.getCitizenActions = (req, res) => {
  try {
    const actions = citizenService.getCitizenActions();
    res.json({
      success: true,
      totalCount: actions.length,
      datasetLabel: "Citizen Climate Action Ecosystem (Prototype Community Layer)",
      actions
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch citizen actions", details: err.message });
  }
};

// POST /api/citizen/actions - Citizen submits a mitigation action
exports.createCitizenAction = (req, res) => {
  try {
    const { actionType, title, description, location, wardName, estimatedQuantity, impactCategory, evidenceImage } = req.body;

    if (!actionType || !title || !description) {
      return res.status(400).json({ error: "Missing required fields: actionType, title, description are required." });
    }

    const newAction = citizenService.addCitizenAction(req.body);

    res.status(201).json({
      success: true,
      message: "Climate action submitted successfully! Prototype automated verification granted.",
      action: newAction
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit climate action", details: err.message });
  }
};

// GET /api/citizen/profile - Returns logged-in citizen impact summary
exports.getCitizenProfile = (req, res) => {
  try {
    const profile = citizenService.getCitizenProfile();
    res.json({
      success: true,
      datasetLabel: "Citizen Impact Dashboard (Prototype Gamification Engine)",
      profile
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch citizen profile", details: err.message });
  }
};

// GET /api/citizen/badges - Returns digital achievement badges
exports.getBadges = (req, res) => {
  try {
    const badges = citizenService.getBadges();
    res.json({
      success: true,
      datasetLabel: "Digital Badges System",
      badges
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch badges", details: err.message });
  }
};

// GET /api/citizen/awards - Returns digital awards
exports.getAwards = (req, res) => {
  try {
    const awards = citizenService.getAwards();
    res.json({
      success: true,
      datasetLabel: "Digital Awards & Certificates",
      awards
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch awards", details: err.message });
  }
};

// GET /api/leaderboard - Returns individual & neighborhood leaderboards
exports.getLeaderboard = (req, res) => {
  try {
    const leaderboard = citizenService.getLeaderboard();
    res.json({
      success: true,
      datasetLabel: "Community Climate Leaderboard (Prototype)",
      ...leaderboard
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard", details: err.message });
  }
};
