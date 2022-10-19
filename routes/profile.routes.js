const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const { loggedOn } = require("../middlewares/auth.middleware.js")

//GET "/profile/main" => el usuario puede ver su perfil
router.get("/main", loggedOn, (req, res, next) => {
    User.findById(req.session.activeUser._id)
    .then((response) => {
    res.render("profile/main.hbs", {
        dataUser: response
    })
    })
    .catch((err) => {
        next(err)
    })

})

//GET "/profile/private" => el usuario puede ver un aimagen de un gatito
router.get("/private", loggedOn, (req, res, next) => {
    User.findById(req.session.activeUser._id)
    .then((response) => {
    res.render("profile/private.hbs", {
        dataUser: response
    })
    })
    .catch((err) => {
        next(err)
    })

})




module.exports = router;