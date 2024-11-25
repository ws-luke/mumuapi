const express = require('express');
const router = express.Router();
const firebase = require('../connections/firebase_connect'); 
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const firebaseAdminAuth = admin.auth();
const firebaseAuth = firebase.auth();

// 管理控制台

//取得所有分類
router.get('/admin/all', async (req,res)=>{
    try {
        const categoryMenu = await firebaseDb.ref('/categories').once('value',(snapshot)=>{
            snapshot.val()
        });
        res.status(200).send({
            success: true,
            message: '取得所有分類成功',
            data: categoryMenu
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '取得所有分類失敗', error
        })
    }
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
            success: true,
            message: '新增分類成功',
            id: key
        });
    } catch (error) {
        console.error('新增分類失敗', error);
        res.status(500).send({
            success: false,
            message: '新增分類失敗',
            error: error.message
        });
    }
});
//更新主分類
router.put('/admin/:categoryId', async (req,res)=>{
    try {
        const editCategory = await firebaseDb.ref(`/categories/${req.params.categoryId}`);
        editCategory.update({
            name: req.body.name
        })
        res.status(200).send({
            success: true,
            message: '更新分類成功'
        });
    } catch (error) {

    }
});
//刪除主分類
router.delete('/admin/:categoryId', async (req,res)=>{
    try {
        const deleteCategory = await firebaseDb.ref(`/categories/${req.params.categoryId}`);
        deleteCategory.remove()
        res.status(200).send({
            success: true,
            message: '刪除分類成功'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '刪除分類失敗'  
        })
    }
});
//新增子分類
router.put('/admin/:categoryId/subcategories', async (req,res)=>{
    try {
        const newCategory = await firebaseDb.ref(`/categories/${req.params.categoryId}/subcategories`);
        const name = req.body.name;
        const subNameAry = [];
        await firebaseDb.ref(`/categories/${req.params.categoryId}/subcategories`).once('value',(snapshot)=>{
            snapshot.forEach((item)=>{
                subNameAry.push(item.val().name);
            })
        });
        if(subNameAry.includes(name)){
            return res.status(400).send({
                success: false,
                message: '子分類已存在'
            });
        } else {
            newCategory.push({
                name: req.body.name
            })
            res.status(200).send({
                success: true,
                message: '新增子分類成功'
            });
        }
    } catch (error) {

    }
});
//更新子分類
router.put('/admin/:categoryId/subcategories/:subcategoryId', async (req,res)=>{
    try {
        const categoryRef = await firebaseDb.ref(`/categories/${req.params.categoryId}/subcategories/${req.params.subcategoryId}`);
        await categoryRef.update({
            name: req.body.name
        })
        res.status(200).send({
            success: true,
            message: '更新子分類成功'
        });
    } catch (error) {
        console.error('更新子分類失敗', error);
        res.status(500).send({
            success: false,
            message: '更新子分類失敗',
            error: error.message
        });
    }
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