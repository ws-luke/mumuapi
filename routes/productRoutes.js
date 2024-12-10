const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
//取得商品列表
router.get('/all', 
    /* 	#swagger.tags = ['使用者 - 商品','管理者 - 商品']
        #swagger.description = '取得商品列表' */
    getProducts);

//取得商品
router.get('/:id', 
    /* 	#swagger.tags = ['使用者 - 商品','管理者 - 商品']
        #swagger.description = '取得單一商品' */
    getProduct);

// 新增商品
router.post('/product', 
    /* 	#swagger.tags = ['管理者 - 商品']
        #swagger.description = '新增商品' */
    createProduct);

//更新商品
router.put('/product/:id', 
    /* 	#swagger.tags = ['管理者 - 商品']
        #swagger.description = '更新商品' */
    updateProduct);

//刪除商品
router.delete('/product/:id', 
    /* 	#swagger.tags = ['管理者 - 商品']
        #swagger.description = '刪除商品' */
    deleteProduct);

module.exports = router;