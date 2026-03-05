const express = require("express");
const Routes = require("./routes/urls");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/api", Routes);

module.exports = app;