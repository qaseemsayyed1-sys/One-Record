const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

let serviceAccount;

// Render pe secret file yahan mount hoti hai
const secretPath = "/etc/secrets/serviceAccountKey.json";
// Local pe tumhare folder me hoti hai
const localPath = path.join(__dirname, "serviceAccountKey.json");

if (fs.existsSync(secretPath)) {
  // Cloud pe
  serviceAccount = JSON.parse(fs.readFileSync(secretPath, "utf8"));
} else {
  // Local pe
  serviceAccount = require("./serviceAccountKey.json");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { db, admin };