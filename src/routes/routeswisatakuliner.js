
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const wisatakulinerController = require('../controllers/wisatakulinercontroler');
const reviewController = require('../controllers/reviewcontroler');


router.delete('/wisatakuliner/:id', wisatakulinerController.deleteWisatakuliner);
router.put('/wisatakuliner/:id', upload, wisatakulinerController.updateWisatakuliner);
router.get('/wisatakuliner/:id', wisatakulinerController.backendgetWisatakulinerById);
router.get('/listallwisatakuliner', wisatakulinerController.getAllwisatakuliner);



router.post('/detailwisatakuliner', upload, wisatakulinerController.createWisatakuliner);






router.get('/detailwisatakuliner/:id', wisatakulinerController.getwisatakulinerById);



router.get('/search', wisatakulinerController.searchWisataKuliner);

router.get('/populer', wisatakulinerController.getwisatakulinerpopuler);

