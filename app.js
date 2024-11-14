const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// 使用內建的 JSON 解析
app.use(express.json());
// 使用內建的 URL 編碼解析（適用於 `application/x-www-form-urlencoded`）
app.use(express.urlencoded({ extended: true }));
//router
const user = require('./routes/userRoutes');
app.use('/user',user);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});