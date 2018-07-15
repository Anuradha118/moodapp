require('./../configs/config');
var router=require('express').Router();
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
            successRedirect: '/me',
            failureRedirect: '/eror' 
        })
        // ,function (req, res) {
        //     // res.render('profile.ejs', { user: "Anuradha" });
        //     // res.redirect("/#/signin");
        // }
);

router.get('/error',function(req,res){
    // myResponse=responseGenerator.generate(false,"User:",200,req.user);
    // res.send(myResponse);
    res.render('error.ejs');
});

router.get('/me',isLoggedIn,function(req,res){
    // myResponse=responseGenerator.generate(false,"User:",200,req.user);
    // res.send(myResponse);
    res.render('profile.ejs', {user:req.user});
});

//api to get all user details when signed-in through google or facebook
router.get('/userDetails', function (req, res) {
    if (req.user) {
        var payload = req.user.social.toObject();
        // var result = payload.toObject();
        var access='auth';
        var token=jwt.sign({payload,access},process.env.JWT_SECRET,{expiresIn:30*60});
        var email=req.user.social;
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

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

}

module.exports = router;