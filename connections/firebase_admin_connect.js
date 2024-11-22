var admin = require("firebase-admin");

// var serviceAccount = require("./mumu-865bc-firebase-adminsdk-kqwlv-f5bcda3a19.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mumu-865bc-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin;