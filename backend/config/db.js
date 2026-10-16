const { db } = require("./firebase");

async function connectDB() {
  try {
    // Lightweight read to confirm Firestore is reachable
    await db.collection("meta").doc("health").get();
    console.log("Firestore connected");
    return true;
  } catch (err) {
    console.error("Firestore connection failed:", err.message);
    return false;
  }
}

module.exports = { connectDB };