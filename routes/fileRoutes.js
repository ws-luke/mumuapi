const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/fileController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // 使用記憶體存放檔案

router.post('/upload', upload.single('file'), uploadFile); // 定義上傳 API

module.exports = router;
