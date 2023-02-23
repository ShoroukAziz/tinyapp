const bcrypt = require('bcryptjs');

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
};

const findUserByEmail = function (email, userDatabase) {

  for (let userId of Object.keys(userDatabase)) {
    if (userDatabase[userId].email === email) {
      return userDatabase[userId];
    }
  }
  return null;
};

const urlsForUser = function (id, urlDatabase) {

  const urls = {};
  for (let urlId of Object.keys(urlDatabase)) {
    if (urlDatabase[urlId].userID === id) {
      urls[urlId] = urlDatabase[urlId];
    }
  }
  return urls;
};

const generateNewUser = function (email, password) {

  return {
    id: generateRandomString(),
    email,
    password: bcrypt.hashSync(password, 10)
  }
}

const saveUserToDataBase = function (user, userDatabase) {
  userDatabase[user.id] = user;
}

module.exports = { generateRandomString, findUserByEmail, urlsForUser, generateNewUser, saveUserToDataBase };