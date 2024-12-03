const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.get('/all', getProducts); //取得商品列表
router.get('/:id', getProduct); //取得商品
router.post('/product', createProduct); // 新增商品
router.put('/product/:id', updateProduct); //更新商品
router.delete('/product/:id', deleteProduct); //刪除商品

module.exports = router;