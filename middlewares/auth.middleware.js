//creamos un middleware que añadiremos a las rutas para que compruebe si el usuario tiene una sesión activa o no
const loggedOn = (req, res, next) => {
    if (req.session.activeUser === undefined) {
        res.redirect("/auth/login") 
    } else {
        next()        
    }
}

module.exports = {
    loggedOn
}