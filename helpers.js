const bcrypt = require('bcryptjs');


/**
 *  Generates a string of 6 random alphanumeric characters
 *  How it works?
 *  toString takes an integer in the range 2 through 36
 *  specifying the base to use for representing the number value.
 *  The default is 10. Here we're using base 36 to get a range
 *  from 0 to 9 and A to Z
 * @return {[string]}      [6 random alphanumeric charachters]
 */
const generateRandomString = function () {
  return Math.random().toString(36).slice(2, 8);
};


/**
 * Generates a random Id for a database object and ensures its uniqueness
 * @param  {[object]} database [the database you want to generate a new id for]
 * @return {[number]}          [the genrated id]
 */
const generateUniqueRandomId = function (database) {

  const existingIds = Object.keys(database);
  const id = generateRandomString();
  if (existingIds.includes(id.toString())) {
    return generateUniqueRandomId(database);
  }
  return id;

}

/**
 * Searches for a user object in a database of users by the user email
 * @param  {[string]} email        [the email you're searching by]
 * @param  {[object]} userDatabase [the database you're searching in]
 * @return {[object]}              [The user if it exists or null]
 */
const findUserByEmail = function (email, userDatabase) {

  for (let userId of Object.keys(userDatabase)) {
    if (userDatabase[userId].email === email) {
      return userDatabase[userId];
    }
  }
  return null;
};

/**
 * Returns an object of all the urls that belongs to a specific user.
 * @param  {[string]} id          [the user id]
 * @param  {[object]} urlDatabase [the url database]
 * @return {[object]}             [All the user's urls]
 */
const getUrlsForUser = function (id, urlDatabase) {

  const urls = {};
  for (let urlId of Object.keys(urlDatabase)) {
    if (urlDatabase[urlId].userID === id) {
      urls[urlId] = urlDatabase[urlId];
    }
  }
  return urls;
};

/**
 * Generates a new user object.
 * @param  {[string]} email    [the user email]
 * @param  {[string]} password [the user plain text password]
 * @param  {[object]} databse  [the users database]
 * @return {[object]}          [a new user object with a random unique id and hashed password]
 */
const generateNewUser = function (email, password, database) {

  return {
    id: generateUniqueRandomId(database),
    email,
    password: bcrypt.hashSync(password, 10)
  }
}

/**
 * Generates a new url object.
 * @param  {[string]} longURL [the long url]
 * @param  {[string]} userID  [Id of the user who created the url]
 * @param  {[object]} databse [the urls database]
 * @return {[object]}         [a new url object with a random unique id (short url) and created time]
 */
const generateNewURL = function (longURL, userID, database) {
  return {
    id: generateUniqueRandomId(database),
    longURL,
    createdDate: new Date().toISOString().split('T')[0],
    userID
  }
}


module.exports = { findUserByEmail, getUrlsForUser, generateNewUser, generateNewURL };