require('dotenv').config();
const admin = require('../connections/firebase_admin_connect');
const firebaseAdminAuth = admin.auth();
// 驗證會員 Token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ success: false, message: '請先登入' });
  }

  try {
    const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
    req.user = decodedToken; // 將解碼後的用戶資訊存入 req
    next();
  } catch (error) {
    console.error('Token 驗證失敗:', error);
    return res.status(401).send({ success: false, message: '授權失敗' });
  }
}

// 驗證管理者 Token
async function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).send({ success: false, message: '無權限' });
  }
  try {
    const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
    if (decodedToken.admin) {
      req.user = decodedToken;
      next();
    } else {
      return res.status(403).send({ success: false, message: '您無管理者權限' });
    }
  } catch (error) {
    console.error('Token 驗證失敗:', error);
    return res.status(401).send({ success: false, message: '授權失敗' });
  }
}

module.exports = { verifyToken, verifyAdmin };