const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const { format } = require('date-fns');

const getProductRef = (id) => firebaseDb.ref('products').child(id);

//取得商品列表
getProducts = async (req,res) => {
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
}
//取得商品
getProduct = async (req,res) => {
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
}
// 新增商品
createProduct = async (req,res)=>{
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
}
//更新商品
updateProduct = async (req,res)=>{
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
}
//刪除商品
deleteProduct = async (req,res)=>{
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
}
module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };