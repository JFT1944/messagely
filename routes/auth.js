const express = require('express');
const { routes } = require('../app.js');
const db = require('../db.js')
const Users = require('../models/user')
const User = ('../routes/URLSearchParams.js')
const router = new express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:true}))
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
// app.use(express.urlencoded({extended: true}));
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next)=>{
let {username, password} = req.query
let authentication = await Users.authenticate(username, password)
if (authentication){
    let token = jwt.sign({username:username}, SECRET_KEY)
    Users.updateLoginTimestamp(username)
    let currUser = await Users.get(username)
    return res.json({'logged in as':currUser, token: token})
}
return res.send('password no bueno')
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async function(req, res, next){
try {
    console.log(req.query)
let {username, password, first_name, last_name, phone} = req.query
console.log(username)
let newUser = Users.register(username, password, first_name, last_name, phone)
res.send(newUser)
} catch (err) {
    console.log(err)
    next(err)
}
})







module.exports = router