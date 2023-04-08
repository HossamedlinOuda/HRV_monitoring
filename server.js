const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require('cors');
const authRoutes = require("./Routes/authRoutes");
const diagnosisRoutes=require("./Routes/diagnosisRoutes");
const resultsRoutes=require("./Routes/resultsRoutes");


//database
// const dbUrI = process.env.dbURI;
// mongoose
//   .connect(dbUrI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((result) => app.listen(4000))
//   .catch((err) => console.log(err));

const dbUrI = process.env.dbURI;
const port = 4000 ; 

mongoose
  .connect(dbUrI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  })
  .then((result) => app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`)))
  .catch((err) => console.log(err));
//view pages in ejs
// app.set("view engine", "ejs");
app.use(express.static("Public"));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {res.sendFile("index.html");});

app.use(authRoutes);
app.use(diagnosisRoutes);
app.use(resultsRoutes);
