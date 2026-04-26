// 1. Load environment variables immediately
require('dotenv').config({ path: __dirname + '/.env' });

const app = require("./src/app"); 
const connectDB = require("./src/config/db");

// 2. FIX: Changed default port to 5000 to avoid conflict with Vite (5173)
const PORT = process.env.PORT || 5000;

// Log the URI to verify it's loading correctly (Remove this in production!)
console.log("Connecting to MongoDB...");

// 3. Connect to Database first, then start server
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    
    app.listen(PORT, () => { 
      console.log(`🚀 Backend Server running on http://localhost:${PORT}`); 
      console.log(`💡 Note: Your React frontend should be on http://localhost:5173`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Stop the server if DB fails
  });