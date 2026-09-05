const express = require('express');
const router = express.Router();
const heatmapController = require('../controllers/heatmapController');
const citizenController = require('../controllers/citizenController');

// Heat Intelligence & Geospatial REST API endpoints
router.get('/health', heatmapController.getHealth);
router.get('/heatmap', heatmapController.getHeatmapGeoJSON);
router.get('/locations', heatmapController.getLocations);
router.get('/location/:id', heatmapController.getLocationById);
router.get('/forecast', heatmapController.getForecast);
router.get('/environmental-factors', heatmapController.getEnvironmentalFactors);
router.get('/recommendations', heatmapController.getRecommendations);
router.post('/simulation', heatmapController.runSimulation);
router.get('/routes', heatmapController.getRoutes);
router.get('/equity', heatmapController.getHeatEquity);

// Citizen Climate Action & Gamification REST API endpoints
router.get('/citizen/actions', citizenController.getCitizenActions);
router.post('/citizen/actions', citizenController.createCitizenAction);
router.get('/citizen/profile', citizenController.getCitizenProfile);
router.get('/citizen/badges', citizenController.getBadges);
router.get('/citizen/awards', citizenController.getAwards);
router.get('/leaderboard', citizenController.getLeaderboard);

module.exports = router;
