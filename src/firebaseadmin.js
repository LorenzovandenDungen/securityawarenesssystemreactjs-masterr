const admin = require("firebase-admin");
const serviceAccount = require("C:/Users/manzo/lorenzo/securityawarenesssystem/fir-3bf99-firebase-adminsdk-399pq-884066e4f2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-3bf99.firebaseio.com",
});

module.exports = admin;
