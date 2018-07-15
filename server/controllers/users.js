require('./../configs/config');
var router=require('express').Router();
var mongoose=require('./../db/mongoose');
var jwt=require('jsonwebtoken');
var passport = require('passport');
var responseGenerator=require('./../utils/responsegenerator');
var myResponse={};


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

//api for facebook signin
router.get('/signin/facebook',
        passport.authenticate('facebook',{scope: ['email']})
);

//api for facebook signin callback
router.get('/signin/facebook/callback',
        passport.authenticate('facebook', { 
            failureRedirect: '/' 
        })
        ,function (req, res) {
            res.redirect("/#/signin");
        }
);

//api to get all user details when signed-in through google or facebook
router.get('/userDetails', function (req, res) {
    if (req.user) {
        var payload = req.user.social.toObject();
        var result = payload.toObject();
        var access='auth';
        var token=jwt.sign({payload,access},process.env.JWT_SECRET,{expiresIn:30*60});
        var email=req.user.social.email;
        myResponse = responseGenerator.generate(false, "Token Issued", 200, {user:email,token:token});
        res.send(myResponse);
    }
});

//api to logout of the session
router.get('/logout', function(req, res){
    req.logout();
    myResponse=responseGenerator.generate(false,"User Logout successful",200,null);
    res.send(myResponse);
});

module.exports = router;