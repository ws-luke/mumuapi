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
            message: '取得商品失敗',
            error: error.message,
        });
    }
})

module.exports = router;