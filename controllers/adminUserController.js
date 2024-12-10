const firebase = require('../connections/firebase_connect'); 
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const firebaseAdminAuth = admin.auth();
const firebaseAuth = firebase.auth();
const adminsRef = firebaseDb.ref('admins');
const usersRef = firebaseDb.ref('users');

//管理員註冊 
adminSignUp = async (req, res) => {
    try {
        const { email, displayName, role, password} = req.body
        
        // 檢查必要欄位
        if (!email) {
          return res.status(400).json({ 
            success: false,
            message: '請輸入電子郵件'
          });
        } else if (!password) {
          return res.status(400).json({ 
            success: false,
            message: '請輸入密碼'
          });
        }
        const userRecord = await firebaseAdminAuth.createUser({
            email,
            password,
            displayName,
        });
        
        // 為該用戶分配自定義權限
        await firebaseAdminAuth.setCustomUserClaims(userRecord.uid, { admin: true });
        // 生成自訂 Token
        const customToken = await firebaseAdminAuth.createCustomToken(userRecord.uid);

        // 將用戶資料儲存到 Realtime Database
        const ref = adminsRef.child(userRecord.uid);
        await ref.set({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || '',
            role,
            createdAt: new Date(),
        });

        res.status(201).json({
            success: true,
            message: '管理員註冊成功',
            uid: userRecord.uid,
            token: customToken,
        });

    }
    catch(error) {
        res.status(400).json({
          success: false,
          message: '註冊失敗，請稍後再試',
          error: error.message,
        });
    }
}
//管理員登入
adminSignIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: '請輸入電子郵件'
      });
    } else if (!password) {
      return res.status(400).json({ 
        success: false,
        message: '請輸入密碼'
      });
    }
    try {
      const user = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const idToken = await user.user.getIdToken();
      const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
      const isAdmin = decodedToken.admin || false;
      req.session.user = {
        uid: user.user.uid,
        email: user.user.email
      }
      return res.status(200).json({
        success: true,
        message:'登入成功',
        uid: user.user.uid,
        token: idToken,
        admin: isAdmin,
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
// 獲取所有用戶資訊
getUsers = async (req, res) => {
    try {
        const snapshot = await usersRef.once('value');
        const users = snapshot.val();
        res.status(200).json({
          success: true,
          message: '取得用戶列表成功',
          data: users     
        })
      } catch (error) {
        res.status(500).json({
            success: false,
            message: '刪除用戶失敗',
        });
      }
}
// 刪除會員
deleteUser = async (req, res) => {
    const uid = req.params.uid;
    try{
        if(!uid) {
          return res.status(400).json({
            success: false,
            message: '請提供用戶 ID'
          });
        }
        
        const userOrdersSnapshot = await usersRef.child(`${uid}/myOrders`).once('value');
        const userOrders = Object.values(userOrdersSnapshot.val()); //查出該用戶的所有訂單編號

        const ordersRef = firebaseDb.ref('orders'); //訂單總路徑
        const updates = {}; //要更新的數據

        userOrders.forEach((orderId) => {
            updates[orderId] = null; // 將訂單編號節點設為 null 以刪除
        })

        await ordersRef.update(updates); // 更新所有訂單
        await firebaseAdminAuth.deleteUser(uid); // 刪除Authentication用戶
        await usersRef.child(uid).remove(); // 刪除資料庫用戶
        
        res.status(200).json({
          success: true,
          message: `會員資料與相關數據成功刪除 (UID: ${uid})`
        });
      } catch(error) {
        res.status(500).json({
          success: false,
          message: '刪除用戶失敗',
        });
      }
}
//刪除管理員
deleteAdmin = async (req, res) => {
  const uid = req.params.uid;
  try{
      if(!uid) {
        return res.status(400).json({
          success: false,
          message: '請提供管理員 ID'
        });
      }
      
      await firebaseAdminAuth.deleteUser(uid); // 刪除Authentication用戶
      await adminsRef.child(uid).remove(); // 刪除資料庫用戶
      
      res.status(200).json({
        success: true,
        message: `管理員資料與相關數據成功刪除 (UID: ${uid})`
      });
    } catch(error) {
      res.status(500).json({
        success: false,
        message: '刪除管理員失敗',
      });
    }
}
module.exports = {
    adminSignUp,
    adminSignIn,
    getUsers,
    deleteUser,
    deleteAdmin
}