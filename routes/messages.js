const express = require('express')
const db = require('../db.js')
const Message = require('../models/message.js')
const router = new express.Router();
const {ensureLoggedIn, ensureCorrectUser} = require('../middleware/auth.js');
const jwt = require('jsonwebtoken');
const ExpressError = require('../expressError');
const { SECRET_KEY } = require('../config.js');
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id' ,async (req, res, next)=>{
try {
    let { _token } = req.headers
    console.log(_token)
    let singleMessage = await Message.get(req.params.id)
    console.log(singleMessage.from_user.username)
    let payload = jwt.verify(_token, SECRET_KEY)
    console.log(payload.username)
    if(payload.username === singleMessage.from_user.username){
        console.log(singleMessage)
        return res.json(singleMessage)
    } else if(payload.username === singleMessage.to_user.username){
        console.log(singleMessage)
        return res.json(singleMessage)
    }
    return res.json({error: 'You shouldnt see this message'})
} catch (error) {
    console.log(error)
    next(error)
}
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/',async (req, res, next)=>{
    console.log(req.query)
    const {from_username, to_username, body} = req.query
    let newMessage = await Message.create(from_username, to_username, body)
    console.log(newMessage)
    res.json({newMessage: req.query})
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
 router.get('/:id/read', ensureCorrectUser ,async (req, res, next)=>{
    try {
        let { _token } = req.headers
        let payload = jwt.verify(_token, SECRET_KEY)
        let singleReadMessage = await Message.markRead(req.params.id)
        if(payload.username === singleMessage.to_user.username){
        // if(singleMessage.from_username)
        console.log(singleReadMessage)}


        return res.json({Error: 'This is not your message to'})
    } catch (error) {
        console.log(error)
        next(error)
    }
    })

 module.exports = router