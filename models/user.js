/** User class for message.ly */
const db = require("../db.js");
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError.js");
const timeStamp = new Date(Date.now()).toISOString()
/** User of the site. */

function w_o_location(eta){
let newTS = eta.split('.')
newTS.pop()

console.log(newTS)
return(newTS[0])
}





class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register( username, password, first_name, last_name, phone) {
    console.log({'inside_of_register': {
      username: username, 
      password: password
    }})
    console.log(timeStamp)
    let newTimeStamp = w_o_location(timeStamp)
    try {
    if (!username || !password || !first_name || !last_name || !phone) {
      return "Missing Input";
    }
    let encryptedPassword = await bcrypt.hash(password, 12);

    let result = await db.query(
      ` 
    Insert INTO users (username, password, first_name, last_name, phone, join_at, last_login_at) VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING username, password, first_name, last_name, phone`,
      [username, encryptedPassword, first_name, last_name, phone, newTimeStamp, newTimeStamp]
    );

    return result.rows[0];
  

  } catch (error) {
    console.log(error)
  }}
  



  static async authenticate(username, password) {
    try {
      let result = await db.query(`SELECT password from users where username=$1`, [username])
      const user = result.rows[0]

      if(user){
        if (await bcrypt.compare(password, user.password) === true){
          
          return true
        }
      }
      throw new ExpressError('Invalid user/password', 400)

    } catch (error) {
      console.log(error)
    }


  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    await db.query(`UPDATE users SET last_login_at=$1 WHERE username=$2`, [w_o_location(timeStamp), username])
    return {timeStamp: 'updated'}
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
   let result = await await db.query('SELECT username, first_name, last_name, phone FROM users')
   console.log(result) 
   return result.rows
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    console.log(username)
    let result = await db.query('SELECT username, first_name, last_name, phone, join_at, last_login_at FROM users where username=$1', [username])
    return result.rows[0]
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    let results = await db.query('SELECT id, to_username, body, sent_at, read_at from messages where from_username=$1', [username])
    console.log(results)
    return results.rows[0]
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    let results = await db.query('SELECT id, from_username, body, sent_at, read_at from messages where from_username=$1', [username])
    console.log(results.rows)
    return results.rows[0]
  }
}

module.exports = User;
