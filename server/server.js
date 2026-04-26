require('dotenv').config({ path: __dirname + '/.env' });
const app = require("./src/app"); 
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;
console.log("MONGO_URI:", process.env.MONGO_URI);

// connect DB first
connectDB().then(() => {
  app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`); 
  });
});