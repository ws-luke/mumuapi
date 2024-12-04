const express = require('express');
const router = express.Router();
const { createOrder, getUserOrder, getUserOrders, updateOrderStatus, deleteOrder,getOrders } = require('../controllers/orderController');

// 前台使用
router.post('/order', createOrder); // 建立訂單
router.get('/:userId/orders', getUserOrders); // 讀取使用者所有訂單
router.get('/:userId/orders/:orderId', getUserOrder); // 讀取使用者特定訂單
//後台使用
router.get('/', getOrders); // 讀取所有訂單
router.put('/:orderId', updateOrderStatus); // 更新訂單狀態
router.delete('/:orderId', deleteOrder); // 刪除訂單

module.exports = router;