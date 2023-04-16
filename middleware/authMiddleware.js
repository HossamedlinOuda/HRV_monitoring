//this middlware is used to prevent users who didnt login from checking our content
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAuth = (req, res, next) => {
    let token = req.headers.cookie;
    console.log("TESTTTS" , req.cookies);
    //if this token exist then the user has logged in so we will check this token
    if (token && token.includes("HRV_Dr")) {
        token = token.slice(token.indexOf("HRV_Dr"));
        token = token.replace("HRV_Dr=", "");
        jwt.verify(token, "HRV_DOC_gradProject", (err, decodeToken) => {
            if (err) {
                res.locals.user = null;
                next();
            }
            else
            {
                User.findById(decodeToken.id)
                    .then(doc => {
                        res.locals.user = doc;
                        next();
                    })
                    .catch(err => {
                        res.status(400).json({msg:err}); 
                    });
                // User.findById(decodeToken.id, function (err, docs) {
                //     if (err) {
                //         res.status(400).json({msg:err}); 
                //     } 
                //     else {
                //         res.locals.user = docs;
                //         next();
                //     }
                // });
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }   
}
module.exports = { requireAuth };