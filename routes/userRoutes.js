const express = require('express');
const router = express.Router();
const firebase = require('../connections/firebase_connect'); 
const firebaseDb = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseAuth = firebase.auth();// 認證模組

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
  (req, res, next) => {
  const { email, password, phoneNumber } = req.body;
  firebaseAuth.createUserWithEmailAndPassword(email, password)
  .then((user) => {
    req.session.email = email;
    req.session.password = password;
    req.session.uid = user.user.uid;
    let saveUser = {
      "email": email,
      "password": password,
      "phoneNumber": phoneNumber,
      "uid": user.user.uid
    }
    console.log(req.session);
    firebaseDb.ref('/user/' + user.user.uid).set(saveUser);
    res.status(200).send({
      status: true,
      message:'註冊帳號成功',
    });
  })
  .catch((error) => {
    if(error.code === 'auth/email-already-in-use'){
      res.status(400).send({
        status: false,
        message:"電子郵件已經被使用，無法註冊相同的電子郵件"
      });
    }else if(error.code === 'auth/invalid-email'){
      res.status(401).send({
        status: false,
        message:'電子郵件格式無效'
      });
    }else if(error.code === 'auth/weak-password'){
      res.status(402).send({
        status: false,
        message:'密碼強度不足，需要更複雜的密碼'
      });
    }
  })
})
//登入帳號  post
router.post('/sign_in',async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: false,
      message: '請提供電子郵件和密碼',
    });
  }

  try {
    const user = await firebaseAuth.signInWithEmailAndPassword(email, password);
    req.session.user = {
      uid: user.user.uid,
      email: user.user.email
    }
    
    return res.status(200).send({
      status: true,
      message:'登入成功',
      uid: user.user.uid,
    })
  } catch (error) {
    let errorMessage = '登入失敗';
    if (error.code === 'auth/user-not-found') {
      errorMessage = '使用者不存在';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = '密碼錯誤';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '無效的電子郵件格式';
    }
    return res.status(400).send({
      status: false,
      message: errorMessage
    });
  }
})

//登出帳號  post
router.post('/sign_out', (req, res, next) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // 清除 Session Cookie
      return res.status(200).send({ 
        status: true,
        message: '已登出' 
      });
  });
})

//檢查用戶是否持續登入 
router.post('/check', (req, res, next) => {
  try {
    // 檢查是否有有效的 session
    if (req.session && req.session.user) {
      return res.status(200).send({
        success: true,
        message: "用戶仍在登入狀態"
      });
    } else {
      return res.status(401).send({
        success: false,
        message: "請重新登入"
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "伺服器錯誤，請稍後再試"
    });
  }
})

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // 使用者已登入，繼續處理
  }
  return res.status(401).send({
    status: false,
    message: '未登入，請先登入',
  });
}

// 範例：需要登入的路由
router.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).send({
    status: true,
    message: '這是受保護的內容',
    user: req.session.user,
  });
});

module.exports = router;