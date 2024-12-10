const express = require('express');
const router = express.Router();
const { signUp, verifyEmail, signIn, signOut, checkOnline, resetPassword } = require('../controllers/userController');
//註冊帳號  post
router.post('/sign_up',
  /* 	#swagger.tags = ['使用者']
        #swagger.description = '使用者 - 註冊帳號' */
  /* #swagger.responses[200] = { 
    schema:{
        "username": "example@test.com",
        "password": "example"
    },
    description: "User registered successfully." } */
  /*	#swagger.parameters['obj'] = {
          in: 'body',
          description: '註冊帳號',
          required: true,
          schema: {
            "email": "信箱",
            "password": "密碼",
            "phoneNumber": "電話號碼"
          }
  } */
  signUp
);

//驗證電子郵件
router.get('/verify',
  /* 	#swagger.tags = ['使用者']
        #swagger.description = '使用者 - 信箱驗證' */
  verifyEmail);

//登入帳號  post
router.post('/sign_in',
  /* 	#swagger.tags = ['使用者']
        #swagger.description = '使用者 - 登入' */
  signIn);

//登出帳號  post
router.post('/sign_out', 
  /* 	#swagger.tags = ['使用者','管理者']
        #swagger.description = '使用者 - 登出' */
  signOut);

//檢查用戶是否持續登入 
router.post('/check', 
  /* 	#swagger.tags = ['使用者']
        #swagger.description = '使用者 - 檢查狀態' */
  checkOnline);

//忘記密碼
router.post('/reset_password', 
  /* 	#swagger.tags = ['使用者']
        #swagger.description = '使用者 - 忘記密碼' */
  resetPassword);

module.exports = router;