const express = require('express');
const router = express.Router();
const { createOrder, getUserOrder, getUserOrders, updateOrderStatus, deleteOrder,getOrders } = require('../controllers/orderController');

// 前台使用
// 建立訂單
router.post('/order', 
    /* 	#swagger.tags = ['使用者 - 訂單']
        #swagger.description = '建立訂單' */
    createOrder); 

// 取得使用者所有訂單
router.get('/:uid/all', 
    /* 	#swagger.tags = ['使用者 - 訂單']
        #swagger.description = '取得使用者所有訂單' */
    getUserOrders); 


//後台使用
// 取得所有訂單
router.get('/', 
    /* 	#swagger.tags = ['管理者 - 訂單']
        #swagger.description = '取得所有訂單' */
    getOrders); 

// 取得特定訂單
router.get('/:orderId', 
    /* 	#swagger.tags = ['使用者 - 訂單','管理者 - 訂單']
        #swagger.description = '取得特定訂單' */
    getUserOrder); 

// 更新訂單狀態
router.put('/:orderId', 
    /* 	#swagger.tags = ['管理者 - 訂單']
        #swagger.description = '更新訂單狀態' */
    updateOrderStatus);

// 刪除訂單
router.delete('/:orderId', 
    /* 	#swagger.tags = ['管理者 - 訂單']
        #swagger.description = '刪除訂單' */
    deleteOrder);

module.exports = router;