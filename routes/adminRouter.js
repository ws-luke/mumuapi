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


//新增主分類
router.post('/category', async (req,res)=>{
    try {
        const key = firebaseDb.ref('/categories').push().key;
        const categoryIdUrl = firebaseDb.ref('/categories/' + key);
        await categoryIdUrl.set({
            id: key,
            name: req.body.name,
            is_enabled: req.body.is_enabled,
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
router.put('/:categoryId', async (req,res)=>{
    try {
        const categoryRef = firebaseDb.ref('categories').child(req.params.categoryId);
        await categoryRef.update(req.body);
        res.status(200).send({
            success: true,
            message: '更新分類成功'
        });
    } catch (error) {
        console.error('操作失敗', error);
        res.status(500).send({
            success: false,
            message: '操作失敗',
            error: error.message
        });
    }
});
//刪除主分類
router.delete('/:categoryId', async (req,res)=>{
    try {
        const categoryRef = firebaseDb.ref('categories').child(req.params.categoryId);
        await categoryRef.remove();
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
router.post('/:categoryId/subcategories', async (req,res)=>{
    try {
        const subcategoryRef = firebaseDb.ref(`categories/${req.params.categoryId}/subcategories`);
        // 使用 push 新增子分類
        const newSubcategoryRef = subcategoryRef.push();
        const subcategoriesSnapshot = await subcategoryRef.once('value');
        if (subcategoriesSnapshot.exists()) {
            const subcategories = subcategoriesSnapshot.val();
            if (Object.values(subcategories).some(sub => sub.name === req.body.name)) {
                return res.status(400).send({
                    success: false,
                    message: '子分類已存在'
                });
            } else {
                await newSubcategoryRef.set({
                    id: newSubcategoryRef.key, // 儲存自動生成的唯一 ID
                    name: req.body.name, // 子分類名稱
                    is_enabled: req.body.is_enabled,
                });
                res.status(200).send({
                    success: true,
                    message: '新增子分類成功'
                });
            }
        }
    } catch (error) {
        console.error('操作失敗', error);
        res.status(500).send({
            success: false,
            message: '操作失敗',
            error: error.message
        });
    }
});
//更新子分類
router.put('/:categoryId/subcategories', async (req,res)=>{
    try {
        const categoryRef = await firebaseDb.ref(`categories/${req.params.categoryId}/subcategories`).child(req.body.id);
        await categoryRef.update(req.body);
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
router.delete('/:categoryId/subcategories', async (req,res)=>{
    try {
        const subcategoryRfe = firebaseDb.ref(`categories/${req.params.categoryId}/subcategories`);
        const deleteSubcategory = subcategoryRfe.child(req.body.id);
        await deleteSubcategory.remove();
        res.status(200).send({
            success: true,
            message: '刪除子分類成功'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: '刪除子分類失敗'  
        })
    }
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