const express = require('express');
const router = express.Router();
const heatmapController = require('../controllers/heatmapController');
const citizenController = require('../controllers/citizenController');
const authController = require('../controllers/authController');

// Heat Intelligence & Geospatial REST API endpoints
router.get('/health', heatmapController.getHealth);
router.get('/heatmap', heatmapController.getHeatmapGeoJSON);
router.get('/locations', heatmapController.getLocations);
router.get('/location/:id', heatmapController.getLocationById);
router.get('/weather', heatmapController.getWeather);
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

// Authentication & Session REST API endpoints
router.post('/auth/send-otp', authController.sendOtp);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authController.getMe);

// TEE-Ready Security & Enclave Attestation REST API endpoints
router.get('/security/attestation', authController.getAttestation);
router.post('/security/encrypt', authController.encryptPayload);

module.exports = router;
