const express = require('express');
const router = express.Router();
const firebase = require('../connections/firebase_connect'); 
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const firebaseAdminAuth = admin.auth();
const firebaseAuth = firebase.auth();


//管理員註冊 
router.post('/sign_up', async (req, res, next) => {
    try {
        const { email, displayName, role, password} = req.body
        
        // 檢查必要欄位
        if (!email || !password || !role) {
            return res.status(400).send({ error: '缺少必要欄位' });
        }
        const userRecord = await firebaseAdminAuth.createUser({
            email,
            password,
            displayName,
        });
        console.log(userRecord);
        
        // 為該用戶分配自定義權限
        await firebaseAdminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

        // 將用戶資料儲存到 Realtime Database
        const ref = firebaseDb.ref(`admins/${userRecord.uid}`);
        await ref.set({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || '',
            role,
            createdAt: new Date(),
        });

        res.status(201).send({
            message: '管理員註冊成功',
            uid: userRecord.uid,
        });

    }
    catch(error) {
        res.status(400).send({
          success: false,
          message:error.message,
        });
    }
  })
//管理員登入
//登入帳號  post
router.post('/sign_in',async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
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
        success: true,
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
        success: false,
        message: errorMessage
      });
    }
})









module.exports = router;