const users = require('./databses').users;
/*
 returns a string of 6 random alphanumeric characters
*/
const generateRandomString = function () {

  /*toString takes an integer in the range 2 through 36
   specifying the base to use for representing the number value.
   The default is 10. Here we're using base 36 to get a range
   from 0 to 9 and A to Z
   */

  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const findUserByEmail = function (email) {

  for (userId of Object.keys(users)) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

module.exports = { generateRandomString, findUserByEmail };