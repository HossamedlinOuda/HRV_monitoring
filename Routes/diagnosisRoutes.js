const express  = require ('express');
const diagnosisController = require('../Controllers/DiagnosisController');
const { requireAuth } = require("../middleware/authMiddleware");
const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  
app.post('/Isobese',requireAuth,diagnosisController.isObese);//check for obesity
app.post('/Diabetic',requireAuth,diagnosisController.haveDiabetes);//check for diabetes existence
app.get('/Get_User_Condition',requireAuth,diagnosisController.User_condition_according_to_HRV);//get user condition and wellness
app.get('/Get_User_Diagnosis',requireAuth,diagnosisController.User_diagnosis_according_to_HRV);//get user diagnosis according to hrv
app.post('/Get_HRV',requireAuth,diagnosisController.Calculate_HRV); // to get hrv values by calculating them


module.exports= app;