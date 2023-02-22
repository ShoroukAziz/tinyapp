const urlDatabase = {};
const users = {};

const errorMessages = {
  emptyEmailOrPassword: "Email and password can't be empty.",
  exisitingEmail: "The email you're trying to use already exist",
  userNotFound: "There's no user registered with that email.",
  wrongPassword: "The email and password you typed don't match."
};

module.exports = { urlDatabase, users, errorMessages };