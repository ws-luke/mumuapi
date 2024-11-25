const express = require('express');
const router = express.Router();
const firebase = require('../connections/firebase_connect'); 
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const firebaseAdminAuth = admin.auth();
const firebaseAuth = firebase.auth();

//取得商品列表
router.get('/products',(req,res)=>{
    
})
//按分類篩選商品
router.get('/products?categoryId=1',(req,res)=>{
    
})
//新增商品
router.post('/products',(req,res)=>{
    
})
//取得單一商品
router.get('/products/:id',(req,res)=>{
    
})
//更新商品
router.put('/products/:id',(req,res)=>{
    
})
//刪除商品
router.delete('/products/:id',(req,res)=>{
    
})
module.exports = router;