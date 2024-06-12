
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const wisatakulinerController = require('../controllers/wisatakulinercontroler');
const reviewController = require('../controllers/reviewcontroler');
const logincms = require('../controllers/logincontroler');
const foodcontroler = require('../controllers/foodController');
const drinkcontroler = require('../controllers/drinkcontroler');
const articleController =  require('../controllers/artikelcontroler')
router.post('/authlogin', logincms.login);


router.delete('/wisatakuliner/:id', wisatakulinerController.deleteWisatakuliner);
router.put('/wisatakuliner/:id', upload, wisatakulinerController.updateWisatakuliner);
router.get('/wisatakuliner/:id', wisatakulinerController.backendgetWisatakulinerById);
router.get('/listallwisatakuliner', wisatakulinerController.getAllwisatakuliner);
router.post('/detailwisatakuliner', upload, wisatakulinerController.createWisatakuliner);

router.get('/detailwisatakuliner/:id', wisatakulinerController.getwisatakulinerById);
router.get('/search', wisatakulinerController.searchWisataKuliner);
router.get('/populer', wisatakulinerController.getwisatakulinerpopuler);

router.get('/bestreview', wisatakulinerController.getreviewsterbaik);

//! Routes Review
router.post('/detailwisatakuliner/:id/ulasan',reviewController.createReview);
router.post('/wisatakuliner/:id/review', reviewController.createReview);
router.get('/wisatakuliner/:id/reviews', reviewController.getReviewsByWisataKulinerId);
router.delete('/review/:id', reviewController.deleteReview);
router.delete('/wisatakuliner/:id/reviews', reviewController.deleteAllReviewsByWisataKulinerId);

// ! Routes makanan
router.post('/wisatakuliner/:id/food', foodcontroler.createFood);
router.get('/wisatakuliner/:id/foods', foodcontroler.getFoodsBywisatakulinerId);
router.put('/food/:id', foodcontroler.updateFood);
router.delete('/food/:id', foodcontroler.deleteFood);


// ! Routes minuman
router.post('/wisatakuliner/:id/drink', drinkcontroler.createDrink);
router.get('/wisatakuliner/:id/drinks', drinkcontroler.getDrinksBywisatakulinerId);
router.put('/drink/:id', drinkcontroler.updateDrink);
router.delete('/drink/:id', drinkcontroler.deleteDrink);

// !Routes artikel

router.post('/artikel', upload, articleController.createArticle);
router.get('/artikel', articleController.getAllArticles);
router.get('/artikel/:id', articleController.getArticleById);
router.put('/artikel/:id', articleController.updateArticle);
router.delete('/artikel/:id', articleController.deleteArticle);


module.exports = router;