require('dotenv').config();
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebase = require('../connections/firebase_connect'); // 資料庫模組
const firebaseDb = admin.database();
const firebaseAdminAuth = admin.auth();
const firebaseAuth = firebase.auth();
const nodemailer = require('nodemailer'); // 寄信
const { format } = require('date-fns');

//註冊帳號  post
signUp = async (req, res, next) => {
    try {
      const user = await firebaseAuth.createUserWithEmailAndPassword(req.body.email, req.body.password)
      req.session.email = req.body.email;
      req.session.password = req.body.password;
      req.session.uid = user.user.uid;
      
      firebaseDb.ref('/users/' + user.user.uid).set({
        email:req.body.email, //信箱
        userName:req.body.userName, //姓名
        companyName:req.body.companyName, //公司名稱
        phoneNumber:req.body.phoneNumber, //手機號碼
        address:req.body.address, //地址
        salesChannels:req.body.salesChannels, // 賣場通路
        ubn:req.body.ubn, //統編
        businessLiaison:req.body.businessLiaison, //對接業務
        uid: user.user.uid,
        role: 'user', //預設為一般用戶
        verified: false, // 設定為未驗證
        myOrders: '',
        createdAt: format(new Date(),'yyyy-MM-dd hh:mm:ss'),
      });
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465, // Gmail 建議使用 465 (SSL)
        secure: true, // 設為 true 以使用 SSL
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        logger: true, // 啟用日誌
        debug: true,  // 顯示 debug 資訊
      });
      await transporter.verify();
      const verificationUrl = `http://127.0.0.1:3000/api/user/verify?uid=${user.user.uid}`;
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: req.body.email,
        subject: '請驗證您的電子郵件',
        text: `親愛的 ${req.body.userName}，請點擊以下連結驗證您的帳號：\n${verificationUrl}`,
      };    
      await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('寄信失敗:',err);
          res.status(500).send('Error sending email');
          return res.status(500).send('註冊成功，但寄信失敗');
        } else {
          console.log('驗證信已發送:', info.response);
          res.status(200).send('註冊成功，請檢查您的電子郵件進行驗證');
        }
      });
  
      res.status(200).json({
        success: true,
        message:'註冊帳號成功，請檢查您的電子郵件完成驗證',
      });
    }
    catch(error) {
      if(error.code === 'auth/email-already-in-use'){
        res.status(400).json({
          success: false,
          message:"電子郵件已經被使用，無法註冊相同的電子郵件"
        });
      }else if(error.code === 'auth/invalid-email'){
        res.status(401).json({
          success: false,
          message:'電子郵件格式無效'
        });
      }else if(error.code === 'auth/weak-password'){
        res.status(402).json({
          success: false,
          message:'密碼強度不足，需要更複雜的密碼'
        });
      }
    }
}
  
//驗證電子郵件
verifyEmail = async (req, res) => {
const { uid } = req.query;
if(!uid){
    return res.status(400).send('驗證連結無效或已過期');
}
try {
    const userUid = await firebaseDb.ref('/users').child(uid).once('value');
    const uidSnapshot = userUid.val()
    if(uidSnapshot.uid === uid){
    firebaseDb.ref('/users/' + uid + '/verified').set(true);
    }
    res.send('驗證成功，您現在可以登入，並關閉此視窗');
} catch (error) {
    console.error('驗證錯誤:', error);
    res.status(500).send('伺服器錯誤');
}
};
  
//登入帳號  post
signIn = async (req, res, next) => {
const { email, password } = req.body;

if (!email || !password) {
    return res.status(400).json({
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
    return res.status(200).json({
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
    return res.status(400).json({
    success: false,
    message: errorMessage
    });
}
}

//登出帳號  post
signOut = async (req, res, next) => {
req.session.destroy(err => {
    if (err) {
        return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // 清除 Session Cookie
    return res.status(200).json({ 
        success: true,
        message: '已登出' 
    });
});
}

//檢查用戶是否持續登入 
checkOnline = async (req, res, next) => {
try {
    // 檢查是否有有效的 session
    if (req.session && req.session.user) {
    return res.status(200).json({
        success: true,
        message: "用戶仍在登入狀態"
    });
    } else {
    return res.status(401).json({
        success: false,
        message: "請重新登入"
    });
    }
} catch (error) {
    res.status(500).json({
    success: false,
    message: "伺服器錯誤，請稍後再試"
    });
}
}

//忘記密碼
resetPassword = async (req, res, next) => {
const { email } = req.body;  
if (!email) {
    return res.status(400).json({ error: 'Email is required' });
}
try {
    //firebase重設密碼連結方法
    const link = await firebaseAdminAuth.generatePasswordResetLink (email); 
    //準備發信
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465, // Gmail 建議使用 465 (SSL)
    secure: true, // 設為 true 以使用 SSL
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
    });
    //驗證傳輸器
    await transporter.verify();
    //信件內容
    const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: '重設密碼',
    text: `請點擊以下連結重設您的密碼：${link}`,
    };  
    //發送信件  
    await transporter.sendMail(mailOptions);
    res.status(200).json({ 
    success: true,
    message: '密碼重設連結已成功發送' 
    });
} catch (error) {
    console.error('密碼重設過程中發生錯誤:', error);
    if (error.code === 'auth/user-not-found') {
    return res.status(404).json({ 
        success: false,
        error: '找不到該用戶的電子郵件' 
    });
    }
    res.status(500).json({ 
    success: false,
    error: '無法發送密碼重設電子郵件，請稍後再試' 
    });
}
}

module.exports = { signUp, verifyEmail, signIn, signOut, checkOnline, resetPassword };