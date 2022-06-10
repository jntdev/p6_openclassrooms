const express = require("express");

const app = express();
const mongoose = require("mongoose");
const path = require("path");

mongoose
  .connect(
    "mongodb+srv://jonathan:$FU*6*9iuiaqH6$@openclassroomsp6.lj4rx.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const userRoutes = require('./routes/user.js')
const saucesRoutes = require('./routes/sauces.js')

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, 'images')));

app.use("/api/auth/", userRoutes)
app.use("/api/sauces/", saucesRoutes)

module.exports = app;
