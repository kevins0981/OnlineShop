const User = require("../models/user.model")
const authUtil = require("../util/authentication")
const validation = require('../util/validation')
const sessionFlash =require("../util/session-flash");

function toSignUp(req, res){
    let sessionData = sessionFlash.getSessionData(req);
    if(!sessionData){
        sessionData = {
            email: "",
            confirmEmail: "",
            password: "",
            fullname: "",
            address: "",
            zipcode: "",
            city: ""
        };
    }
    res.render('customer/auth/signup', { inputData: sessionData});
}

async function signup(req, res, next) {
    
    const enteredData = {email: req.body.email, confirmEmail: req.body['confirm-email'], password: req.body.password, fullname: req.body.fullname, address: req.body.address, zipcode: req.body.zipcode, city: req.body.city};

    if(!validation.isUserDetailValid(req.body.email, req.body.password, req.body.fullname, req.body.address, req.body.zipcode, req.body.city) || !validation.emailIsConfirmed(req.body.email, req.body['confirm-email']))
    {
        sessionFlash.flashDataToSession(req, {errMsg: "Please check your input. Password must be at least 6 character long, zip code must be at least 5 character long", ...enteredData}, function() {
            res.redirect('/signup');
        })
        return;
    }

    const user = new User(req.body.email, req.body.password, req.body.fullname, req.body.address, req.body.zipcode, req.body.city);

    try{
        const existingAcc = await user.existsAccount();

        if(existingAcc)
        {
            sessionFlash.flashDataToSession(req, {errMsg : "User exists already! try logging in instead!", ...enteredData}, function () {
                res.redirect('/signup');
            })
            return;
        }

        await user.signUp();
    }
    catch(e) {
        next(e);
        return;
    }
    res.redirect('/login');
}

function toLogin(req, res, next){
    let sessionData = sessionFlash.getSessionData(req);
    if(!sessionData){
        sessionData = {
            email : "",
            password : "",
        };
    }

    res.render('customer/auth/login', { inputData: sessionData});
}

async function login(req, res, next){
    const user = new User(req.body.email, req.body.password);
    const sessionErrorData = { errMsg : "Invalid account - please check your email and password", email: req.body.email, password: req.body.password};
    let existingUser;
    try{
        existingUser = await user.getUserWithSameEmail();
    }
    catch(e){
        next(e);
        return;
    }

    if(!existingUser){
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect('/login');
        })
        return;
    }

    const passwordIsCorrect = await user.isMatchingPassword(existingUser.password);

    if(!passwordIsCorrect){
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect('/login');
        })
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect("/");
    });
}

function logout(req, res) {
    authUtil.destroyCurrUserSession(req);
    res.redirect('/login');
}

module.exports = {
    toSignUp: toSignUp,
    toLogin: toLogin,
    signup: signup,
    login: login,
    logout: logout
};