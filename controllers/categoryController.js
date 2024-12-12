
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();

const categoriesRef = firebaseDb.ref('categories');

//新增主分類
createCategory = async (req,res) => {
    try {
        const key = categoriesRef.push().key;
        const categoryIdUrl = firebaseDb.ref('/categories/' + key);
        await categoryIdUrl.set({
            id: key,
            name: req.body.name,
            is_enabled: req.body.is_enabled,
            subcategories: req.body.subcategories || ""
        });        

        res.status(200).json({
            success: true,
            message: '新增分類成功',
            id: key
        });
    } catch (error) {
        console.error('新增分類失敗', error);
        res.status(500).json({
            success: false,
            message: '新增分類失敗',
            error: error.message
        });
    }
};
//取得所有分類
getCreateCategory = async (req,res) => {
    try {
        const snapshot = await categoriesRef.once('value');
        const categoryMenu = snapshot.val();

        if (!categoryMenu) {
            return res.status(404).json({
                success: false,
                message: '沒有找到分類資料'
            });
        }
        res.status(200).json({
            success: true,
            message: '取得所有分類成功',
            data: categoryMenu
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '取得所有分類失敗',
            error: error.message
        })
    }
};
//更新主分類
updateCreateCategory = async (req,res) => {
    try {
        const categoryRef = firebaseDb.ref('categories').child(req.params.categoryId);
        await categoryRef.update(req.body);
        res.status(200).json({
            success: true,
            message: '更新分類成功'
        });
    } catch (error) {
        console.error('操作失敗', error);
        res.status(500).json({
            success: false,
            message: '操作失敗',
            error: error.message
        });
    }
};
//刪除主分類
deleteCreateCategory = async (req,res) => {
    try {
        const categoryRef = firebaseDb.ref('categories').child(req.params.categoryId);
        await categoryRef.remove();
        res.status(200).json({
            success: true,
            message: '刪除分類成功'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '刪除分類失敗'  
        })
    }
};

// 取得子類別
getSubcategory = async (req, res) => {
    try {
        const snapshot = await categoriesRef.child(`/${req.params.categoryId}/subcategories`).once('value');
        console.log(snapshot.val());
        const subcategories = snapshot.val();

        if (!subcategories) {
            return res.status(404).json({
                success: false,
                message: '沒有找到子類別資料'
            });
        }

        res.status(200).json({
            success: true,
            message: '取得子類別成功',
            data: subcategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '取得子類別失敗',
            error: error.message
        });
    }
}
//新增子分類
createSubcategory = async (req,res) => {
    try {
        const subcategoryRef = firebaseDb.ref(`categories/${req.params.categoryId}/subcategories`);
        // 使用 push 新增子分類
        const newSubcategoryRef = subcategoryRef.push();
        const subcategoriesSnapshot = await subcategoryRef.once('value');
        if (subcategoriesSnapshot.exists()) {
            const subcategories = subcategoriesSnapshot.val();
            if (Object.values(subcategories).some(sub => sub.name === req.body.name)) {
                return res.status(400).json({
                    success: false,
                    message: '子分類已存在'
                });
            } else {
                await newSubcategoryRef.set({
                    id: newSubcategoryRef.key, // 儲存自動生成的唯一 ID
                    name: req.body.name, // 子分類名稱
                    is_enabled: req.body.is_enabled,
                });
                res.status(200).json({
                    success: true,
                    message: '新增子分類成功'
                });
            }
        }
    } catch (error) {
        console.error('操作失敗', error);
        res.status(500).json({
            success: false,
            message: '操作失敗',
            error: error.message
        });
    }
};
//更新子分類
updateCreateSubcategory = async (req,res) => {
    try {
        const categoryRef = await firebaseDb.ref(`categories/${req.params.categoryId}/subcategories`).child(req.body.id);
        await categoryRef.update(req.body);
        res.status(200).json({
            success: true,
            message: '更新子分類成功'
        });
    } catch (error) {
        console.error('更新子分類失敗', error);
        res.status(500).json({
            success: false,
            message: '更新子分類失敗',
            error: error.message
        });
    }
};
//刪除子分類
deleteCreateSubcategory = async (req,res) => {
    try {
        const subcategoryRfe = firebaseDb.ref(`categories/${req.params.categoryId}/subcategories`);
        const deleteSubcategory = subcategoryRfe.child(req.body.id);
        await deleteSubcategory.remove();
        res.status(200).json({
            success: true,
            message: '刪除子分類成功'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '刪除子分類失敗'  
        })
    }
};

module.exports = {
    createCategory,
    getCreateCategory,
    updateCreateCategory,
    deleteCreateCategory,
    getSubcategory,
    createSubcategory,
    updateCreateSubcategory,
    deleteCreateSubcategory,
}