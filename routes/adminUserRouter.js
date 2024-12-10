const express = require('express');
const router = express.Router();
const { adminSignUp, adminSignIn, getUsers, deleteUser } = require('../controllers/adminUserController');

router.post('/sign_up', adminSignUp); //管理員註冊 
router.post('/sign_in', adminSignIn); //管理員登入
router.get('/users', getUsers); // 獲取所有用戶資訊
router.delete('/users/:uid', deleteUser); // 刪除會員

module.exports = router;