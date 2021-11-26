require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
const port = process.env.PORT || 3000


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use(express.static(__dirname + '/public'));


//include model
const {
    User_game,
    User_game_history,
    User_game_biodata
} = require('./models')

//NOTES
let loginPageNote = ' '
let registerPageNote = ' '

//Used Account
let user_session = {
    id: undefined,
    username: undefined,
    asAdmin: false
}


app.get('/', (req, res) => {
    res.render('index', user_session)
})

app.get('/register', (req, res) => {
    if (user_session.id && user_session.username) {
        res.redirect('/')
    } else {
        res.render('register',{
            id: user_session.id,
            username: user_session.username,
            registerPageNote: registerPageNote
        })
    }
    registerPageNote = ''
})

app.post('/register', async(req, res) => {
    var input = {
        'username': req.body.username,
        'password': req.body.password
    }

    await User_game.findOne({
            where: {
                username: input.username
            }
        })
        .then((result) => {
            if (result) {
                registerPageNote = 'Username is already used.'
                res.redirect('/register')
            } else {
                User_game.create({
                        username: input.username,
                        password: input.password,
                    })
                    .then((user) => {
                        User_game_biodata.create({
                                id: user.id,
                                username: user.username
                            })
                            .then(user1 => {
                                User_game_history.create({
                                        id: user1.id,
                                        username: user1.username
                                    })
                                    .then(user2 => {
                                        loginPageNote = 'Account has been created.'
                                        res.redirect('/login')
                                    })
                            })
                    })
            }
        })
})

app.get('/admin-test', async(req, res) => {
    var users = []
    await User_game.findAll()
        .then( (datas) => {
            datas.forEach( (data) => {
                users.push(data)
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
        console.log(user)
        users_master_data.push(user)
    } )
    res.send(users_master_data)
})

//LOGIN
app.get('/login', (req, res) => {
    if (user_session.id && user_session.username) {
        res.redirect('/')
    }
    res.render('login',{
        id: user_session.id,
        username: user_session.username,
        loginPageNote: loginPageNote
    })
    loginPageNote = ' '
})

app.post('/login', async(req, res) => {
    var input = {
        username: req.body.username,
        password: req.body.password
    }

    await User_game.findOne({
            where: {
                username: input.username,
            }
        })
        .then((user) => {
            if (!user) {
                // res.send('Check you username!')
                loginPageNote = 'Check your username!'
                res.redirect('/login')
            } else {
                if (user.password == input.password) {
                    // res.send('Welcome!')
                    user_session.id = user.id
                    user_session.username = user.username 
                    user_session.asAdmin = user.asAdmin

                    //Updating login history
                    let login_succeed = 0
                    User_game_history.findOne({
                        where: {
                            id: user.id
                        }
                    })
                        .then(user1 => {
                            login_succeed = user1.login_succeed + 1
                            console.log(login_succeed)

                            User_game_history.update(
                                {
                                    login_succeed: login_succeed
                                },
                                {
                                    where:{
                                        id: user1.id
                                    }
                                }
                            )
                                .then( () => {
                                    res.redirect('/')
                                })
                        })
                } else {
                    // res.send('Wrong password')

                    //Updating login history
                    let login_failed = 0
                    User_game_history.findOne({
                        where:{
                            id: user.id
                        }
                    })
                        .then((user1) => {
                            login_failed = user1.login_failed + 1
                            console.log(login_failed)
                            User_game_history.update(
                                {
                                    login_failed: login_failed
                                },
                                {
                                    where: {
                                        id: user1.id
                                    }
                                }
                            )
                                .then(() => {
                                    loginPageNote = 'Wrong Password.'
                                    res.redirect('/login')
                                })
                        })
                }
            }
        })
})

//LOGOUT
app.get('/logout', (req, res) => {
    user_session.id = undefined,
    user_session.username = undefined
    res.redirect('/')
})

//Create admin
app.get('/create-test', async (req, res) => {
    var input = {
        'username': 'grotius.hasiholan',
        'password': 'admin',
        'asAdmin': true,
        'fullname': 'Grotius Cendikia Hasiholan',
    }
    
    await User_game.create({
            username: input.username,
            password: input.password,
            asAdmin: input.asAdmin
        })
        .then(user => {
            User_game_biodata.create({
                    id: user.id,
                    username: input.username,
                    fullname: input.fullname
                })
                .then(user1 => {
                    User_game_history.create({
                            id: user1.id,
                            username: input.username
                        })
                        .then(user2 => {
                            note = 'Data berhasil ditambahkan'
                            res.redirect('/')
                        })
                })
        })
})

//Game Page
let game_page = require('./routers/game_router')
game_page.params = user_session
app.use('/game', game_page)


//Middleware
app.use((req, res, next) => {
    if(!(user_session.id && user_session.username)){
        res.redirect('/')
        next()
    } else{
        next()
    }
})

//User Page
let user_page = require('./routers/user_router')
user_page.params = user_session
app.use('/user', user_page)

//Middleware
app.use((req, res, next) => {
    if(user_session.asAdmin){
        next()
    } else{
        res.redirect('/')
        next()
    }
})


//Admin Page
let admin_page = require('./routers/admin_router')
admin_page.params = user_session
app.use('/admin', admin_page)


app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})