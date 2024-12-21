const bucket = require('../connections/firebase_admin_connect').storage().bucket();
const { v4: uuidv4 } = require('uuid'); // 引入 UUID 模組

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file; // 使用 multer 獲取的檔案資訊
    if (!file) {
      return res.status(400).send({ message: '未上傳檔案' });
    }

    // 使用 UUID 生成唯一檔案名稱，保留原始副檔名
    const uniqueFileName = `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`;

    const blob = bucket.file(`uploads/${uniqueFileName}`); // 設定存儲路徑
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype, // 設置檔案類型
      },
    });

    blobStream.on('error', (err) => res.status(500).send(err));

    blobStream.on('finish', async () => {
      await blob.makePublic(); // 設置為公開訪問
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // 生成公開 URL
      res.status(200).json({ 
        success: true,
        message: '上傳檔案成功',
        imageURL: publicUrl,
      }); // 返回下載連結
    });

    blobStream.end(file.buffer); // 將檔案 buffer 寫入
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '上傳檔案失敗',
      error: error.message,
    });
  }
};
