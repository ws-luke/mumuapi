const express = require('express');
const router = express.Router();
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();

//取得所有訂單
router.get('/all', async (req,res)=>{
  try {
      const snapshot = await firebaseDb.ref('/orders').once('value');
      const orders = snapshot.val();

      if (!orders) {
          return res.status(404).send({
              success: false,
              message: '沒有找到訂單資料'
          });
      }
      res.status(200).send({
          success: true,
          message: '取得所有訂單成功',
          data: orders
      });
  } catch (error) {
      res.status(500).send({
          success: false,
          message: '取得所有訂單失敗',
          error: error.message
      })
  }
});

module.exports = router;