const express = require('express')
const router = express.Router()
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
    res.redirect('/admin/accounts')
})

router.get('/accounts', async(req, res) => {
    //Getting data
    var users = []
    await User_game.findAll()
        .then( (datas) => {
            datas.forEach( (data) => {
                if( !data.asAdmin ){
                    users.push(data)
                }
            } )
        } )
    
    var users_bio = []
    await User_game_biodata.findAll()
        .then( (datas) => {
            datas.forEach( (data) => {
                users_bio.push(data)
            } )
        } ) 

    var users_history = []
    await User_game_history.findAll()
        .then( (datas) => [
            datas.forEach( (data) =>{
                users_history.push(data)
            } )
        ])
    
    var users_master_data = []
    users.forEach( (data) => {
        var result = users_bio.find(({id}) => id === data.id )
        var result1 = users_history.find(({id}) => id === data.id )
        var user = {
            id: data.id,
            username: data.username,
            password: data.password,
            fullname: result.fullname,
            address: result.address,
            login_succeed: result1.login_succeed,
            login_failed: result1.login_failed,
            win_total: result1.win_total,
            lose_total: result1.lose_total,
            draw_total: result1.draw_total
        }
        users_master_data.push(user)
    } )


    res.render('admin/accounts', {
        id: user_session.id,
        username: user_session.username,
        asAdmin: user_session.username,
        account_datas: users_master_data
    })
})

router.get('/accounts/delete/:id', async(req, res) =>{
    if(!req.params.id){
        res.redirect('/admin/accounts')
    }

    await User_game.findOne({
        where:{ id:req.params.id }
    }).then( async(result) => {
        if(result){
            await User_game.destroy({
                where:{ id: result.id }
            }).then(async() => {
                await User_game_biodata.destroy({
                    where:{ id: result.id }
                }).then(async() => {
                    await User_game_history.destroy({
                        where: { id: result.id }
                    }).then(() => {
                        updatePageNote = 'Account has been deleted.'
                        console.log(updatePageNote)
                        res.redirect('/admin/accounts')
                    })
                })
            })
        }
    })
})

router.get('/accounts/edit/:userId', async(req, res) => {
    await User_game_biodata.findOne({
        where: {
            id: req.params.userId
        }
    })
        .then((user) =>{
            res.render('admin/edit', {
                id: user_session.id,
                username: user_session.username,
                asAdmin: user_session.username,
                userId: req.params.userId,
                registerPageNote: registerPageNote,
                fullName: user.fullname,
                age: user.age,
                address: user.address
            })
            registerPageNote = ''
        })
})
router.post('/accounts/edit/:userId', async(req, res) => {
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
                    res.redirect('/admin/accounts')
                })
        })
})

// router.get('/test', async(req, res) => {
//     var users = []
//     await User_game.findAll()
//         .then( (datas) => {
//             datas.forEach( (data) => {
//                 users.push(data)
//             } )
//         } )
    
//     var users_bio = []
//     await User_game_biodata.findAll()
//         .then( (datas) => {
//             datas.forEach( (data) => {
//                 users_bio.push(data)
//             } )
//         } ) 

//     var users_history = []
//     await User_game_history.findAll()
//         .then( (datas) => [
//             datas.forEach( (data) =>{
//                 users_history.push(data)
//             } )
//         ])
    
//     var users_master_data = []
//     users.forEach( (data) => {
//         var result = users_bio.find(({id}) => id === data.id )
//         var result1 = users_history.find(({id}) => id === data.id )
//         var user = {
//             id: data.id,
//             username: data.username,
//             password: data.password,
//             fullname: result.fullname,
//             address: result.address,
//             login_succeed: result1.login_succeed,
//             login_failed: result1.login_failed,
//             win_total: result1.win_total,
//             lose_total: result1.lose_total,
//             draw_total: result1.draw_total
//         }
//         users_master_data.push(user)
//     } )
//     res.send(users_master_data)
// })


module.exports = router