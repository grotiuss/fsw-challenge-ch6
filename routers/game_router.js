var fs = require('fs')
const express = require('express')
const router = express.Router()

let user_session = {}

router.use((req, res, next) => {
    user_session.id = router.params.id
    user_session.username = router.params.username
    user_session.asAdmin = router.params.asAdmin
    next()
})

//Middleware
router.use((req, res, next, ) => {
    if (user_session.id) {
        next()
    } else {
        res.redirect('/login')
        next()
    }
})

router.get('/', (req, res) => {
    res.render('game/game', user_session)
})



module.exports = router