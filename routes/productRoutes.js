const express = require('express');
const router = express.Router();
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();

const getProductRef = (id) => firebaseDb.ref('products').child(id);

//取得商品列表
router.get('/all', async (req,res)=>{
    try {
        const limit = req.query.limit || 12;
        const startAt = req.query.startAt || null;
        let query = firebaseDb.ref('products').limitToFirst(limit);
        if(startAt) query = query.startAt(startAt);
        const snapshot = await query.once('value');
        const data = snapshot.val();
        res.status(200).send({
            success: true,
            message: '取得商品列表成功',
            data
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '取得商品列表失敗',
            error: error.message,
        });
    }
})
//新增商品
router.post('/product', async (req,res)=>{
    try {
        const productsRef = await firebaseDb.ref('products');
        const newProductRef = productsRef.push();
        const data = {
            id: newProductRef.key,
            productCode: '商品編號',
            category: '分類',
            title: '商品名稱',
            weight: '商品重量',
            warranty: '保固',
            material: '材質',
            origin_price: '原價',
            price: '售價',
            unit: '單位',
            description: '商品描述',
            content: '商品內容',
            is_enabled: '是否啟用',
            num: '商品數量',
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
            createdAt: new Date().toISOString(), // 將日期轉換為字串
            updatedAt: new Date().toISOString(), // 將日期轉換為字串
        };
        await productsRef.child(newProductRef.key).set(data);
        res.status(200).send({
            success: true,
            message: '新增商品成功',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '取得商品列表失敗',
            error: error.message,
        });
    }
})
//取得商品
router.get('/:id', async (req,res)=>{
    try {
        const snapshot = await getProductRef(req.params.id).once('value');
        const data = snapshot.val();
        if (!data) {
            return res.status(404).send({ success: false, message: '商品不存在' });
        }
        res.status(200).send({
            success: true,
            message: '取得商品成功',
            data
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '取得商品列表失敗',
            error: error.message,
        });
    }
})
//更新商品
router.put('/:id', async (req,res)=>{
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
            message: '取得商品列表失敗',
            error: error.message,
        });
    }
})
//刪除商品
router.delete('/:id', async (req,res)=>{
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
            message: '取得商品列表失敗',
            error: error.message,
        });
    }
})
module.exports = router;