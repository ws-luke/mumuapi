const express = require('express');
const router = express.Router();
const { getProducts , getProduct } = require('../controllers/productController');

router.get('/all', getProducts); //取得商品列表
router.get('/:id', getProduct); //取得商品

module.exports = router;