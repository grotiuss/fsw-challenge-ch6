const express = require('express')
const router = express.Router()
const fs = require('fs')
const { User_game, User_game_history, User_game_biodata } = require('../models')

let user_session = {}

let loginPageNote = ''
let registerPageNote = ''
let updatePageNote = ''

router.use((req, res, next) => {
    user_session.id = router.params.id
    user_session.username = router.params.username
    user_session.asAdmin = router.params.asAdmin
    next()
})

router.get('/', (req, res) => {
    res.send(user_session)
})

router.get('/:userId/biodata', async(req,res) => {
    if(req.params.userId != user_session.id) {
        req.params.userId = user_session.id
    }
    await User_game_biodata.findOne({
        where: {
            id: req.params.userId
        }
    })
        .then((user) =>{
            res.render('user/biodata', {
                id: user_session.id,
                username: user_session.username,
                asAdmin: user_session.asAdmin,
                registerPageNote: registerPageNote,
                fullName: user.fullname,
                age: user.age,
                address: user.address
            })
            registerPageNote = ''
        })
})

router.get('/:userId/update', async(req, res) => {
    if(req.params.userId != user_session.id) {
        req.params.userId = user_session.id
    }
    await User_game_biodata.findOne({
        where: {
            id: req.params.userId
        }
    })
        .then((user) =>{
            res.render('user/update', {
                id: user_session.id,
                username: user_session.username,
                asAdmin: user_session.asAdmin,
                registerPageNote: registerPageNote,
                fullName: user.fullname,
                age: user.age,
                address: user.address
            })
            registerPageNote = ''
        })
})

router.post('/:userId/update', async(req, res) => {
    var input = {
        id: req.params.userId,
        fullname: req.body.fullname,
        age: req.body.age,
        address: req.body.address
    }

    //Getting the old value
    var oldValue = {}
    await User_game_biodata.findOne(
        {
            where:{
                id: input.id
            }
        }
    )
        .then( async(user) => {
            oldValue.fullname = user.fullname,
            oldValue.age = user.age,
            oldValue.address = user.address

            if ( input.age.length == 0 ) {
                input.age = oldValue.age
            } else {
                input.age = Number(input.age)
            }
            
            if ( input.fullname.length <= 0 ) {
                input.fullname = oldValue.fullname
            }

            if ( input.address.length <= 0 ) {
                input.address = oldValue.address
            }

            // res.send(input)
            await User_game_biodata.update(
                {
                    fullname: input.fullname,
                    age: input.age,
                    address: input.address
                },
                {
                    where:{
                        id: input.id
                    }
                }
            )
                .then( () => {
                    // res.send('Data has been changed')
                    registerPageNote = 'Data has been changed'
                    res.redirect('/user/' + input.id + '/biodata')
                })
        })
})

router.get('/delete/:userId', async(req, res) => {
    await User_game.destroy({
        where: {
            id: req.params.userId
        }
    })
        .then(() => {
            User_game_biodata.destroy({
                where: {
                    id: req.params.userId
                }
            })
        })
            .then(() => {
                User_game_history.destroy({
                    where: {
                        id: req.params.userId
                    }
                })
            })
                .then(() => {
                    res.redirect('/')
                })
})

module.exports = router