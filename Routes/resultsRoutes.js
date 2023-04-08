const express  = require ('express');
const { requireAuth } = require("../middleware/authMiddleware");
const ResultsController =require("../Controllers/ResultsController");
const app = express();
const cors = require('cors')
app.use(cors());

app.post("/AdditionalInfo", requireAuth, ResultsController.SaveAdditionalInfo); //aditional info
app.get("/GetReport",requireAuth,ResultsController.GetReport);//get report information
app.get("/Delete_Result",requireAuth,ResultsController.Delete_Results);//delete targeted entry 



app.get("/test",ResultsController.test);//delete targeted entry 
module.exports= app;