const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const { format } = require('date-fns');

const getProductRef = (id) => firebaseDb.ref('products').child(id);

//取得商品列表
getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 12; // 每頁商品數量
        const page = parseInt(req.query.page, 10) || 1;    // 當前頁數
        const categoryFilter = req.query.category || '';  // 類別篩選 - 名稱
        const subcategoryFilter = req.query.subcategory || ''; // 子類別篩選 - 名稱
        const statusFilter = req.query.status || '';      // 上架狀態篩選

        if (page < 1 || limit < 1) {
        return res.status(400).json({
            success: false,
            message: '頁數和每頁商品數量必須大於 0',
        });
        }

        // 從 Firebase 取得所有商品資料
        const snapshot = await firebaseDb.ref('products').once('value');
        const allData = snapshot.val();

        // 如果沒有資料，直接返回空
        if (!allData) {
            return res.status(200).json({
                success: true,
                message: '取得商品列表成功',
                data: {
                    products: [],
                    pagination: {
                        totalItems: 0,
                        totalPages: 0,
                        currentPage: page,
                        limit,
                    },
                },
            });
        }

        // 將資料轉換為陣列
        let products = Object.entries(allData).map(([id, value]) => ({
            id,
            ...value,
        }));

        // 篩選主類別的商品
        if (categoryFilter === '') {
            products = Object.entries(allData).map(([id, value]) => ({
                id,
                ...value,
            }));
        } else {
            products = products.filter(product => product.category === categoryFilter);
        }

        // 篩選子類別的商品
        if (subcategoryFilter) {
            products = products.filter(product => product.subcategory === subcategoryFilter);
        }
        
        if (statusFilter !== undefined && statusFilter !== '') {
            const isEnabled = parseInt(statusFilter, 10);
            if (isEnabled === 1 || isEnabled === 0) {
                products = products.filter(product => product.is_enabled === isEnabled);
            }
        }

        // 計算總商品數量和總頁數
        const totalItems = products.length;
        const totalPages = Math.ceil(totalItems / limit);

        // 計算當前頁的商品資料
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = products.slice(startIndex, endIndex);
        
        console.log('Category:', categoryFilter, 'Subcategory:', subcategoryFilter);

        // 回傳資料
        res.status(200).json({
            success: true,
            message: '取得商品列表成功',
            data: {
                products: paginatedProducts, // 當前頁的商品資料
                pagination: {
                    totalItems,   // 總商品數量
                    totalPages,   // 總頁數
                    currentPage: page, // 當前頁數
                    limit,        // 每頁商品數量
                },
            },
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: '取得商品列表失敗',
        error: error.message,
        });
    }
};
//取得商品
getProduct = async (req,res) => {
    try {
        const snapshot = await getProductRef(req.params.id).once('value');
        const data = snapshot.val();
        if (!data) {
            return res.status(404).json({ success: false, message: '商品不存在' });
        }
        res.status(200).json({
            success: true,
            message: '取得商品成功',
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '取得商品失敗',
            error: error.message,
        });
    }
}
//新增商品
createProduct = async (req,res)=>{
    try {
        const productsRef = await firebaseDb.ref('products');
        const newProductRef = productsRef.push();
        const productData = req.body;
        const data = {
            id: newProductRef.key,
            title: productData.title,
            weight: productData.weight,
            material: productData.material,
            warranty: productData.warranty,
            origin_price: productData.origin_price, // 原價
            price: productData.price, // 售價
            unit: productData.unit, // 單位
            is_enabled: productData.is_enabled, // 是否上架
            is_stock: productData.is_stock, // 庫存
            category: productData.category, // 分類
            subcategory: productData.subcategory, // 子分類
            productVariants: productData.productVariants,
            imageUrl: productData.imageUrl,
            imagesUrl: productData.imagesUrl,
            createdAt: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
            updatedAt: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
        };
        await productsRef.child(newProductRef.key).set(data);
        res.status(200).json({
            success: true,
            message: '新增商品成功',
        });
    } catch (error) {
        res.status(500).json({
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
        res.status(200).json({
            success: true,
            message: '更新商品成功',
        });
    } catch (error) {
        res.status(500).json({
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
        res.status(200).json({
            success: true,
            message: '刪除商品成功',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '刪除商品失敗',
            error: error.message,
        });
    }
}
module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };