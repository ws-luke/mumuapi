const express = require('express');
const router = express.Router();
const { signUp, verifyEmail, signIn, signOut, checkOnline, resetPassword } = require('../controllers/userController');
//註冊帳號  post
router.post('/sign_up',
  /* 	#swagger.tags = ['User']
        #swagger.description = '註冊帳號' */
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
router.get('/verify', verifyEmail);

//登入帳號  post
router.post('/sign_in', signIn);

//登出帳號  post
router.post('/sign_out', signOut);

//檢查用戶是否持續登入 
router.post('/check', checkOnline);

//忘記密碼
router.post('/reset_password', resetPassword);

module.exports = router;