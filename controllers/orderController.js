const { log } = require('console');
const admin = require('../connections/firebase_admin_connect'); // 資料庫模組
const firebaseDb = admin.database();
const { format } = require('date-fns');
const util = require('util');
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


// 建立訂單
createOrder = async (req, res) => {
    try {
        const newOrderRef = ordersRef.push();
        const orderId = newOrderRef.key;
        const createdAt = format(new Date(),'yyyy-MM-dd hh:mm:ss');
        const order = {
            orderId,
            user: {
                address: "地址",
                email: "信箱",
                userName: "會員名稱",
                phoneNumber: "手機號碼",
                uid: "會員ID",
                companyName: "公司名稱"
            },
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
            createdAt,
        }
        await newOrderRef.set(order);
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
    } catch (error) {
    }
}// 讀取使用者特定訂單
getUserOrder = async (req, res) => {
    try {
    } catch (error) {
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
// 更新訂單狀態
updateOrderStatus = async (req, res) => {
    try {
    } catch (error) {
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