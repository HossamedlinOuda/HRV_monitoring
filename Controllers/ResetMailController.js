require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const Res_obj = {};
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
  console.log("finished with the oauth2client set credentials");
  const accessToken = await new Promise((resolve, reject) => {
    console.log("getting the access token");
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log("the error occured while getting access token is bla bla ............. ",err);
        reject("Failed to create access token :(");
        Res_obj.status=400;
        Res_obj.msg="Failed to create access token :(";
        return Res_obj;
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

const sendEmail = async (emailOptions,res) => {
  console.log("enterd the sendmail function ");
  let emailTransporter = await createTransporter();
  console.log("enterd the sendmail function after create trasnporeter ");
  try {
    await emailTransporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log("error occured while sending reset password mail please try again later ",error);
        Res_obj.status=400;
        Res_obj.msg="error occured while sending reset password mail please try again later ";
        
        //return Res_obj;
      } else {
        console.log("Huraaaaaaaaay the email has been sent");
        Res_obj.status=200;
        Res_obj.msg="Reset code has been sent";
        //res.send("Huraaaaaaaaay the email has been sent");
        console.log("the final object is ",Res_obj);
        return Res_obj;
        
      }
    });
  } catch (error) {
    console.log(error);
    Res_obj.status=400;
    Res_obj.msg=error;
    
    return Res_obj;
  }
};
module.exports = sendEmail;
