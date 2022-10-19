const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

//GET "/auth/singup" => ruta que renderiza un formulario para introducir datos de nuevo usuario
router.get("/singup", (req, res, next) => {
    res.render("auth/singup.hbs")
})



//POST "/auth/singup" => guarda en la DB la información del usuario y redirecciona
router.post("/singup", async (req, res, next) => {
    //guardamos la info del formulario
    const { username, password } = req.body;
    //si alguno de los campos está vacío, muestra error
    if (username === "" || password === "") {
        res.render("auth/singup.hbs", {
            alertError: "¡Completa todos los campos para poder crear tu usuario!"
        })
        return
    }
    const passRegex = /^(?=.*\d)(?=.*[a-z]).{6,}$/gm;
    if (passRegex.test(password) === false) {
        res.render("auth/singup.hbs", {
            alertError: "La contraseña no cumple con los requisitos",
        });
        return;
    }
    try {
        //comprobamos que el usuario no exista ya en la DB
        const userData = await User.findOne({username: username});
        if (userData !== null) {
            res.render("auth/singup.hbs", {
                alertError: "Este nombre ya esta cogido, tienes que ser más original"
            });
            return;
        }
        // ciframos la pass del usuario
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt)


        //creamos el perfil del usuario en la DB
        const newUser = {
            username: username,
            password: hashPassword //guardamos la contraseña que hemos cifrado en el punto anterior
          };
          await User.create(newUser);
    } catch (err) {
    next(err);
    }
    res.redirect("/auth/login")
});

//GET "/auth/login" => renderiza formulario para introducir datos para acceder a la cuenta del usuario
router.get("/login", (req, res, next) => {
    res.render("auth/login")
})

//POST "/auth/login" => recibe los datos del formulario y verifica que sean igual a los de la DB
router.post("/login", async (req, res, render) => {
    const { username, password } = req.body
    if (username === "" || password === "") {
        res.render("auth/login.hbs", {
          alertError: "Deberías rellenar todos los campos para poder acceder a tu perfil",
        });
        return;
      }
try{
    const userData = await User.findOne({username: username});  //comprobar si el usuario existe en la DB
    if (userData === null) {
        res.render("auth/login.hbs", {
            alertError: "Credenciales no aceptadas"
        })
        return;
    }

    //verificar la contraseña del usuario
    const passValid = await bcrypt.compare(password, userData.password)
    if (passValid === false) {
        res.render("auth/login.hbs", {
          alertError: "Credenciales no aceptadas"
        });
        return;
      }


      req.session.activeUser = userData;
      req.session.save(() => {
        res.redirect("/profile/main")
      })
} catch (err) {
    next(err);
  }

})

//GET "/auth/logout" => destruye la sesión
router.get("/logout", (req, res, next) => {
    req.session.destroy(() => { 

    res.redirect("/");
    })
})







module.exports = router;