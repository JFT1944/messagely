const express = require("express");
const db = require("../db.js");
const { ensureLoggedIn } = require("../middleware/auth.js");
const User = require("../models/user.js");
const router = new express.Router();
const jwt = require('jsonwebtoken')
/** GET / - get list of users.
 
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", ensureLoggedIn , async (req, res, next)=> {
  try {
    const allUsers = await User.all();
    console.log(allUsers);
    res.status(200).json(allUsers);
  } catch (err) {
    next(err);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", async function(req, res){
    try{const currUser = await User.get(req.params.username)
    console.log(currUser)
    let { _token } = req.headers
        let payload = jwt.verify(_token, SECRET_KEY)
      if (payload.username === req.params.username){
    res.json(currUser)}
    res.json({Error: 'This is not your account'})
}catch (error) {
    console.log(error)
}
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', async (req, res, next)=>{
try{const currUser = await User.messagesTo(req.params.username)
  let { _token } = req.headers
        let payload = jwt.verify(_token, SECRET_KEY)
      if (payload.username === req.params.username){
    res.json(currUser)}
console.log(currUser)
res.json(currUser)
}catch (error) {
    console.log(error)
}
})




/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
 router.get('/:username/from', async (req, res, next)=>{
    try {
        const currUser = await User.messagesFrom(req.params.username)
    console.log(currUser)
    let { _token } = req.headers
        let payload = jwt.verify(_token, SECRET_KEY)
      if (payload.username === req.params.username){
    res.json(currUser)}
    res.json(currUser)
    } catch (error) {
        console.log(error)
    }
    })


module.exports = router;
