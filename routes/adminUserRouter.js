const express = require('express');
const router = express.Router();
const { adminSignUp, adminSignIn, getUsers, deleteUser,deleteAdmin } = require('../controllers/adminUserController');

//管理員註冊 
router.post('/sign_up', 
    /* 	#swagger.tags = ['管理者']
        #swagger.description = '管理員註冊' */
    adminSignUp);

//管理員登入
router.post('/sign_in', 
    /* 	#swagger.tags = ['管理者']
        #swagger.description = '管理員登入' */
    adminSignIn);

// 獲取所有用戶資訊
router.get('/users', 
    /* 	#swagger.tags = ['管理者']
        #swagger.description = '獲取所有用戶資訊' */
    getUsers);

// 刪除會員
router.delete('/users/:uid', 
    /* 	#swagger.tags = ['管理者']
        #swagger.description = '刪除會員' */
    deleteUser);

// 刪除管理員
router.delete('/admins/:uid', 
    /* 	#swagger.tags = ['管理者']
        #swagger.description = '刪除管理員' */
    deleteAdmin);
module.exports = router;