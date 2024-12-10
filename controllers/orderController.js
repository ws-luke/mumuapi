const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const { format } = require('date-fns');
// 訂單狀態
/* 
Pending	訂單已建立但未處理。
Processing	訂單正在處理中（如打包、準備出貨）。
Shipped	訂單已出貨。
Delivered	訂單已送達客戶手中。
Cancelled	訂單已被用戶或商家取消。
Refunded	訂單已退款。
Failed	訂單失敗（可能是付款失敗或其他原因）。 
*/
// 訂單總路徑
const ordersRef = firebaseDb.ref('orders');
// 使用者總路徑
const usersRef = firebaseDb.ref('users');

// 建立訂單
createOrder = async (req, res) => {
    try {
        const userUid = req.body.uid; // 前端傳送會員ID
        const newOrderRef = ordersRef.push();
        const orderId = newOrderRef.key; //訂單ID
        const createdAt = format(new Date(),'yyyy-MM-dd HH:mm:ss'); // 更新訂單時間

        const order = {
            orderId,
            products:{
                L8nBrq8Ym4ARI1Kog4t:{
                    id: "L8nBrq8Ym4ARI1Kog4t",
                    productId: "L8moRfPlDZZ2e-1ritQ",
                    qty: 3,
                },
                L8nBrq8Ym4ARI1Kog48:{
                    id: "L8nBrq8Ym4ARI1Kog4t",
                    productId: "L8moRfPlDZZ2e-1ritQ",
                    qty: 4,
                },
                L8nBrq8Ym4ARIhdfdhg:{
                    id: "L8nBrq8Ym4ARI1Kog4t",
                    productId: "L8moRfPlDZZ2e-1ritQ",
                    qty: 555,
                },
            },
            totalAmount: "400,000",
            paymentMethod: {
                name: "轉帳付款",
                number: "56789"
            },
            orderNotes: "訂單備註",
            status: "訂單已建立但未處理",
            createdAt
        }
        await newOrderRef.set(order);
        usersRef.child(userUid).child('myOrders').push(orderId); // 找到會員的訂單位置，並將新訂單的編號輸入進去
        res.status(200).json({
            success: true,
            message: "已建立訂單",
            total: 100,
            createdAt,
            orderId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,       
        })
    }
}
// 讀取使用者訂單
getUserOrders = async (req, res) => {
    try {
        //先查詢會員本身的訂單編號
        const userUid = req.params.uid;
        const userSnapshot = await usersRef.child(userUid).once('value'); // 會員資料快照
        const user = userSnapshot.val(); // 會員資料
        
        const userMyOrders = user.myOrders;
        const orders = []; // 放該會員的訂單編號
        Object.values(userMyOrders).forEach((orderId) => {
            orders.push(orderId);
        })
        
        // 再從所有訂單裡挑選該會員的訂單
        const ordersSnapshot = await ordersRef.once('value');
        const allOrders = ordersSnapshot.val(); // 所有訂單資料
        
        const userOrders = orders.map((orderId) => {
            const order = allOrders[orderId];
            return order ? { orderId, ...order } : null;
            
        }).filter(order => order !== null);
        
        res.status(200).json({
            success: true,
            message: "取得使用者訂單成功",
            user,
            orders: userOrders
        });
    } catch (error) {
    }
}
// 讀取使用者特定訂單
getUserOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderSnapshot = await ordersRef.child(orderId).once('value');
        const order = orderSnapshot.val();

        if(!order) {
            return res.status(404).json({
                success: false,
                message: "訂單不存在"
            });
        }

        res.status(200).json({
            success: true,
            message: "取得使用者特定訂單成功",
            order:{
                orderId,
                ...order
            }
        });
    } catch (error) {
        console.error('讀取訂單時出現錯誤:', error);
        res.status(500).json({
            success: false,
            message: '伺服器發生錯誤，請稍後再試'
        });
    }
}

// 讀取所有訂單
getOrders = async (req, res) => {
    try {
        const data = [];
        await ordersRef.once('value', (snapshot) => {
            snapshot.forEach((item) => {
                const order = item.val();
                const products = order.products;
        
                const productDetails = Object.keys(products).map((key) => ({
                    ...products[key], // 合併每個產品的詳細資料
                }));
                order.products = productDetails; // 將 products 儲存為陣列
                data.push(order);
            });
        });
        res.status(200).json({
            success: true,
            orders: data,
            message: "取得所有訂單成功"
        })
    } catch (error) {
    }
}
// 更新訂單
updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId; // 從路徑參數獲取 orderId
        const newStatus = req.body.status; // 從body獲取新狀態

        // 確認有提供狀態
        if (!newStatus) {
            return res.status(400).json({
                success: false,
                message: "請提供有效的狀態值"
            });
        }

        // 取得所有訂單的快照
        const snapshot = await ordersRef.once('value');
        const allOrders = snapshot.val();
        const existingOrder = allOrders[orderId]; // 根據 orderId 找到對應的訂單
        const updatedAt = format(new Date(),'yyyy-MM-dd HH:mm:ss');

        // 檢查訂單是否存在
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "查無訂單編號"
            });
        }

        // 更新訂單狀態
        await ordersRef.child(orderId).update({
            status: newStatus,
            updatedAt
        });

        // 回傳成功回應
        return res.status(200).json({
            success: true,
            message: "更新訂單狀態成功",
            order: {
                orderId,
                status: newStatus,
                updatedAt
            }
        });

    } catch (error) {
        // 處理錯誤
        console.error("更新訂單狀態時發生錯誤：", error);
        return res.status(500).json({
            success: false,
            message: "伺服器發生錯誤，請稍後再試"
        });
    }
}
// 刪除訂單
deleteOrder = async (req, res) => {
    try {
        await ordersRef.child(req.params.orderId).remove();
        res.status(200).json({
            success: true,
            message: "已刪除"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,       
        })
    }
}
module.exports = {
    createOrder,
    getOrders,
    getUserOrders,
    getUserOrder,
    updateOrderStatus,
    deleteOrder,
}