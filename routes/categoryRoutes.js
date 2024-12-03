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


//取得主分類
router.get('/all', getCreateCategory);
//新增主分類
router.post('/category', createCategory);
//更新主分類
router.put('/:categoryId', updateCreateCategory);
//刪除主分類
router.delete('/:categoryId', deleteCreateCategory);
//新增子分類
router.post('/:categoryId/subcategories', createSubcategory);
//更新子分類
router.put('/:categoryId/subcategories', updateCreateSubcategory);
//刪除子分類
router.delete('/:categoryId/subcategories', deleteCreateSubcategory);

module.exports = router;