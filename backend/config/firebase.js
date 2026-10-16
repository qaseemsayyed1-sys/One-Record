const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize only once (prevents "app already exists" errors on hot reload)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { db, admin };