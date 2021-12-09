const express = require('express');

const router = express.Router();


const productController = require('../controllers/products.controller');

router.get('/products', productController.getAllProduct);

router.get('/products/:id', productController.getProductDetails)

module.exports = router;