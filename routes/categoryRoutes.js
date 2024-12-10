const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCreateCategory,
    updateCreateCategory,
    deleteCreateCategory,
    createSubcategory,
    updateCreateSubcategory,
    deleteCreateSubcategory
} = require('../controllers/categoryController');

const { verifyAdmin } = require('../middleware/auth'); // 引入中介層

//取得選單
router.get('/all', 
    /* 	#swagger.tags = ['管理者 - 選單']
        #swagger.description = '取得選單' */
    getCreateCategory);
//新增主選單
router.post('/category', 
    /* 	#swagger.tags = ['管理者 - 選單']
        #swagger.description = '新增主選單' */
    verifyAdmin,
    createCategory);
//更新主選單
router.put('/:categoryId', 
    /* 	#swagger.tags = ['管理者 - 選單']
        #swagger.description = '更新主選單' */
    verifyAdmin,
    updateCreateCategory);
//刪除主選單
router.delete('/:categoryId', 
    /* 	#swagger.tags = ['管理者 - 選單']
        #swagger.description = '刪除主選單' */
    verifyAdmin,
    deleteCreateCategory);
//新增子選單
router.post('/:categoryId/subcategories', 
    /* 	#swagger.tags = ['管理者 - 選單']
        #swagger.description = '新增子選單' */
    verifyAdmin,
    createSubcategory);
//更新子選單
router.put('/:categoryId/subcategories', 
    /* 	#swagger.tags = ['管理者 - 選單']
        #swagger.description = '更新子選單' */
    verifyAdmin,
    updateCreateSubcategory);
//刪除子選單
router.delete('/:categoryId/subcategories', 
    /* 	#swagger.tags = ['管理者 - 選單']
        #swagger.description = '刪除子選單' */
    verifyAdmin,
    deleteCreateSubcategory);

module.exports = router;