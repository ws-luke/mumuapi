const express = require('express');
const router = express.Router();
const firebase = require('../connections/firebase_connect'); 
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const firebaseAdminAuth = admin.auth();
const firebaseAuth = firebase.auth();

// 管理控制台

//取得所有分類
router.get('/admin/all',(req,res)=>{
    firebaseDb.ref('/categories').once('value',(snapshot)=>{
        console.log(snapshot.val());
        
    });
});
//新增主分類
router.post('/admin/category', async (req,res)=>{
    try {
        const key = firebaseDb.ref('/categories').push().key;
        const categoryIdUrl = firebaseDb.ref('/categories/' + key);
        await categoryIdUrl.set({
            id: key,
            name: req.body.name,
            subcategories: req.body.subcategories || ""
        });        

        res.status(200).send({
            status: true,
            message: '新增分類成功',
            id: key
        });
    } catch (error) {
        console.error('新增分類失敗', error);
        res.status(500).send({
            status: false,
            message: '新增分類失敗',
            error: error.message
        });
    }
});
//更新主分類
router.put('/admin/:id', async (req,res)=>{
    try {
        const editCategory = await firebaseDb.ref(`/categories/${req.params.id}`);
        editCategory.update({
            name: req.body.name
        })
        res.status(200).send({
            status: true,
            message: '更新分類成功'
        });
    } catch (error) {

    }
});
//刪除主分類
router.delete('/admin/:id', async (req,res)=>{
    try {
        const deleteCategory = await firebaseDb.ref(`/categories/${req.params.id}`);
        deleteCategory.remove()
        res.status(200).send({
            status: true,
            message: '刪除分類成功'
        });
    } catch (error) {
        res.status(500).send({
          status: false,
          message: '刪除分類失敗'  
        })
    }
});
//新增子分類
router.post('/admin/:id/subcategories',async (req,res)=>{
    try {
        const newCategory = await firebaseDb.ref(`/categories/${req.params.id}/subcategories`);
        const name = req.body.name;
        const subNameAry = [];
        await firebaseDb.ref(`/categories/${req.params.id}/subcategories`).once('value',(snapshot)=>{
           snapshot.forEach((item)=>{
            subNameAry.push(item.val().name);
           })
        });

        if(subNameAry.includes(name)){
            return res.status(400).send({
                status: false,
                message: '子分類已存在'
            });
        } else {
            newCategory.push({
                id: newCategory.push().key,
                name: req.body.name
            })
            res.status(200).send({
                status: true,
                message: '新增子分類成功'
            });
        }
        
    } catch (error) {

    }
});
//更新子分類
router.put('/admin/:id/subcategories',(req,res)=>{

});
//刪除子分類
router.delete('/admin/:id/subcategories',(req,res)=>{

});

// 客戶端

//取得所有分類
router.get('/all',(req,res)=>{
    firebaseDb.ref('/categories').once('value',(snapshot)=>{
        console.log(snapshot.val());
    });
});




module.exports = router;