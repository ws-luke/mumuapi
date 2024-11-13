var admin = require("firebase-admin");
require('dotenv').config();

var serviceAccount = require("");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASEURL
});

module.exports = admin;