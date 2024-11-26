const express = require('express');
const router = express.Router();
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();

//取得所有分類
router.get('/all', async (req,res)=>{
    try {
        const snapshot = await firebaseDb.ref('/categories').once('value');
        const categoryMenu = snapshot.val();

        if (!categoryMenu) {
            return res.status(404).send({
                success: false,
                message: '沒有找到分類資料'
            });
        }
        res.status(200).send({
            success: true,
            message: '取得所有分類成功',
            data: categoryMenu
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '取得所有分類失敗',
            error: error.message
        })
    }
});
module.exports = router;