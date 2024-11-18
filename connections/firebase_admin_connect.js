var admin = require("firebase-admin");

var serviceAccount = require("./mumu-865bc-firebase-adminsdk-kqwlv-274e72bb70.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mumu-865bc-default-rtdb.asia-southeast1.firebasedatabase.app"
});

var db = admin.database();

module.exports = db;