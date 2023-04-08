const User = require("../models/User");
const History = require("../models/Patient_History");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  console.log("finished with the oauth2client creation");
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(
          "the error occured while getting access token is bla bla ............. ",
          err
        );
        reject("Failed to create access token :(");
        res.status(400).json({ msg: "Failed to create access token :(" });
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });
  console.log("endede the transporter functions ");
  return transporter;
};

const handle_errors = (err) => {
  const error_obj = {};
  if (err.code === 11000) {
    error_obj["msg"] = " Duplicate email ";
    error_obj.status_code = 11000;
  }

  if (err.message == "Incorrect password") {
    error_obj["msg"] = err.message;
    error_obj.status_code = 401;
  } else if (err.message == "Incorrect email") {
    error_obj["msg"] = "Your email is not registered in the system";
    error_obj.status_code = 401;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error_obj[properties.path] = properties.message;
      //console.log("my path " , properties.path , " the message in it " ,properties.message );
    });
    error_obj.status_code = 400;
  }
  return error_obj;
};

module.exports.signupPost = async (req, res) => {
  //console.log("the recieved request ", req.body);
  const { firstName, lastName, email, birthDate, gender, password } = req.body;
    try {
      const my_user = await User.create({
        firstName,
        lastName,
        email,
        birthDate,
        gender,
        password
      });
      //console.log("sign up is successfull", my_user._id);
      const id = my_user._id;
      console.log("MY USER ID IS",id);
      const token = jwt.sign({ id }, "HRV_DOC_gradProject", {
        expiresIn: 3 * 24 * 60 * 60,
      });
      res.cookie("HRV_Dr", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      console.log("cookie is created ");
      res.status(201).json({ msg: "sign up is successfull", userID: my_user._id });
      //console.log("the response msg is: ",res);
  
      //  User.findOneAndUpdate({ email }, { Medical_History: history._id })
      //  .then ((doc)=>{ res.status(201).json(my_user._id);})
      //  .catch ((err)=>{ res.status(500).json({msg : err});})
    } catch (err) {
      const recieved_Err = handle_errors(err);
      console.log("error occured during signup process ", err);
      res.status(400).json({ recieved_Err });
    }
  
};
module.exports.ResetPassword = async (req, res) => {
  const { email } = req.body;
  console.log("email recieved is ", email);
  const user = await User.findOne({ email });
  if (!user) {
    console.log("didnt find the email");
    res.status(401).json({ msg: "User does not exist" });
  } else {
    // meaning that the user exists in our database
    const OTP = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    console.log("the created otp is ", OTP);
    User.findOneAndUpdate({ email }, { OTP: OTP }, function (err, doc) {
      if (err) return res.send(500, { msg: err });
      console.log("successfully saved the otp in db");
    });
    console.log("************** moment of truth ");
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'HRVDRteam.21@gmail.com',
        pass: 'HRVDOCTOR1241997@!'
      }
    });
    
    var mailOptions = {
      from: 'HRVDRteam.21@gmail.com',
      to: 'hosam.tarek3@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    // const template_info = { name: user.firstName, password: OTP };
    // const source = fs.readFileSync(
    //   path.join(__dirname, "../views/Reset_password.handlebars"),
    //   "utf8"
    // );
    // const compiledTemplate = handlebars.compile(source);
    // const msg_obj = {
    //   subject: "HRV Doctor Reset Password",
    //   html: compiledTemplate(template_info),
    //   to: email,
    //   from: process.env.EMAIL,
    // };
    // // sendEmail(msg_obj ,res);
    // let emailTransporter = await createTransporter();
    // try {
    //   await emailTransporter.sendMail(msg_obj, (error, info) => {
    //     if (error) {
    //       console.log(
    //         "error occured while sending reset password mail please try again later ",error);
    //       res.status(400).json({
    //         msg:
    //           "error occured while sending reset password mail please try again later ",
    //       });
    //     } else {
    //       console.log("Huraaaaaaaaay the email has been sent");
    //       res.status(200).json({ msg: "Reset code has been sent" });
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    //   res.status(400).json({ msg: error });
    // }
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.status(200).json({msg:"code has been sent"});
    // const res_obj= await sendEmail(msg_obj ,res);
    // console.log("the returned response is ", res_obj);
    // res.send();
  }
};
module.exports.CheckOTP = async (req, res) => {
  const { email, OTP } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    //console.log("didnt find the email");
    res.status(401).json({ msg: "User does not exist" });
  }
  const user_entry_otp = OTP;
  const user_sent_otp = user.OTP;
  if (user_entry_otp == user_sent_otp) {
    res.status(200).json({ msg: "can proceed to reset password" });
  } else {
    res.status(400).json({ msg: "OTP not match" });
  }
};
module.exports.NewPassword = async (req, res) => {
  //console.log("my user in the new password function is ",res.locals.user);
  
  const { Newpassword, ConfirmPassword } = req.body;
  const email=res.locals.user.email;
  
  if (Newpassword === ConfirmPassword) {
    User.findOneAndUpdate({ email }, { password: Newpassword })
      .then((doc) => {
        res.status(200).json({ msg: "Successfully reset password" });
      })
      .catch((err) => {
        res.status(500).json({ msg: err });
      });
  } else {
    res.status(400).json({ msg: "Unmatched Password" });
  }
};
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const my_user = await User.login(email, password);
    console.log("login is successfull", my_user._id);
    const id = my_user._id;
    const token = jwt.sign({ id }, "HRV_DOC_gradProject", {
      expiresIn: 3 * 24 * 60 * 60,
    });
    //console.log("token is created waiting to add attributes ....");
    res.cookie("HRV_Dr", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ msg: "login is successfull", userID: my_user._id });
    console.log("logged in ");
  } catch (error) {
    console.log(error);
    const recived_Err = handle_errors(error);
    //console.log(error.message, "*****", error.code)
    res.status(400).json({ recived_Err });
  }
};
module.exports.logoutGet = (req, res) => {
  res.cookie("HRV_Dr", (maxAge = 1)); //lifespan is too short so it will kill the cookie
  res.status(200).json({ msg: "Logout process is Completed" });
  //console.log(res.headers);
  //res.redirect("/");
};
