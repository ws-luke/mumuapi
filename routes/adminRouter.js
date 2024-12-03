const express = require('express');
const router = express.Router();
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const { format } = require('date-fns');

// 獲取所有用戶資訊
router.get('/users', async (req, res) => {
  // 回傳用戶列表
  try {
    const snapshot = await firebaseDb.ref('/user').once('value');
    const users = snapshot.val();
    res.status(200).send({
      success: true,
      message: '取得用戶列表成功',
      data: users     
    })
  } catch (error) {

  }
});
// 刪除用戶
router.delete('/users/:uid', async (req, res) => {
    // 刪除用戶邏輯
});

const getProductRef = (id) => firebaseDb.ref('products').child(id);
// 新增商品
router.post('/product', async (req,res)=>{
    try {
        const productsRef = await firebaseDb.ref('products');
        const newProductRef = productsRef.push();
        const {productCode,category,title,weight,warranty,material,origin_price,price,unit,description,content,is_enabled,num,} = req.body;
        const data = {
            id: newProductRef.key,
            productCode,
            category,
            title,
            weight,
            warranty,
            material,
            origin_price,
            price,
            unit,
            description,
            content,
            is_enabled,
            num,
            imageUrl: '主圖網址',
            imagesUrl: [
                "圖片網址一",
                "圖片網址二",
                "圖片網址三",
                "圖片網址四",
                "圖片網址五"
            ],
            specifications: [
                {
                    name: '尺寸',
                    options: [
                        {
                            value: '1m',
                            quantity: 200,
                        },
                        {
                            value: '1.2m',
                            quantity: 300,
                        },
                        {
                            value: '1.5m',
                            quantity: 500,
                        },
                    ],
                },
            ],
            createdAt: format(new Date(),'yyyy-MM-dd'),
            updatedAt: format(new Date(),'yyyy-MM-dd'),
        };
        await productsRef.child(newProductRef.key).set(data);
        res.status(200).send({
            success: true,
            message: '新增商品成功',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '新增商品失敗',
            error: error.message,
        });
    }
})
//更新商品
router.put('/product/:id', async (req,res)=>{
    try {
        const productsRef = await getProductRef(req.params.id);
        await productsRef.update(req.body);
        res.status(200).send({
            success: true,
            message: '更新商品成功',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '更新商品失敗',
            error: error.message,
        });
    }
})
//刪除商品
router.delete('/product/:id', async (req,res)=>{
    try {
        const productsRef = await getProductRef(req.params.id);
        await productsRef.remove();
        res.status(200).send({
            success: true,
            message: '刪除商品成功',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '刪除商品失敗',
            error: error.message,
        });
    }
})

module.exports = router;