const express = require('express');
const router = express.Router();
const firebase = require('../connections/firebase_connect'); 
const firebaseAuth = firebase.auth();// 認證模組
const firebaseDb = require('../connections/firebase_admin_connect'); // 資料庫模組


//註冊帳號  post
router.post('/sign_up', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await firebaseAuth.createUserWithEmailAndPassword(email, password);


  }catch (error){
    console.error(error)
  }
})
//登入帳號  post
router.post('/sign_in', async (req, res, next) => {

})
//檢查Token  get
router.get('/checkout', async (req, res, next) => {  

})
//登出帳號  post
router.post('/sign_out', async (req, res, next) => {

})


module.exports = router;