const express = require("express")
const router = express.Router()

//GET "/" => renderiza la página Home
router.get("/", (req, res, next) => {
    res.render("index");
  });

  const authRoutes = require("./auth.routes.js")
  router.use("/auth", authRoutes)

  const profileRoutes = require("./profile.routes")
  router.use("/profile", profileRoutes)

module.exports = router;