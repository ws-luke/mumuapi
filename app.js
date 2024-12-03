const express = require('express');
const app = express();

const { verifyToken, verifyAdmin } = require('./middleware/auth'); // 引入中介層

const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const user = require('./routes/userRoutes'); // 用戶
const categoryRoutes = require('./routes/categoryRoutes'); // 分類
const product = require('./routes/productRoutes'); // 產品
const orderRoutes = require('./routes/orderRoutes'); // 訂單
const adminUserRouter = require('./routes/adminUserRouter');
const adminRoutes = require('./routes/adminRouter');

app.use(session({
    secret: 'iLoveMuMu',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        secure: false,
        maxAge: 3600000 
    }
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//router
app.use('/api/user',user); // 用戶
app.use('/api/categories', categoryRoutes); // 分類
app.use('/api/products', product); // 產品
app.use('/api/orders',orderRoutes); // 訂單

app.use('/api/admin', adminUserRouter);
app.use('/api/admin', verifyAdmin, adminRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});