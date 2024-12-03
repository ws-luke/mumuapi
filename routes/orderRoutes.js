const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getUserOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

router.post('/all', createOrder); // 建立訂單
router.get('/:orderId', getOrder); // 讀取特定訂單
router.get('/users/:userId/orders', getUserOrders); // 讀取使用者訂單
router.put('/:orderId/status', updateOrderStatus); // 更新訂單狀態
router.delete('/:orderId', deleteOrder); // 刪除訂單

module.exports = router;