const express  = require ('express');
const authController = require('../Controllers/authControllers');
const { requireAuth } = require("../middleware/authMiddleware");
const app = express();
const cors = require('cors')
app.use(cors());

    
app.post('/login',authController.loginPost);//login route 
app.post('/signup',authController.signupPost);//signup route
app.get('/logout',requireAuth,authController.logoutGet);//logout route
app.post('/ResetPassword',requireAuth,authController.ResetPassword);//reset password route
app.post('/CheckOTP',requireAuth,authController.CheckOTP);//check otp route
app.post('/NewPassword',requireAuth,authController.NewPassword);//new password route

module.exports= app;