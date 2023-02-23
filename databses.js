const urlDatabase = {};
const usersDatabase = {
  users: {},
  saveUser: function (user) {
    this.users[user.id] = user;
  }
};

const errorMessages = {
  emptyEmailOrPassword: 'Email and password can not be empty.',
  exisitingEmail: 'The email you are trying to use already exist',
  userNotFound: 'There is no user registered with that email.',
  wrongPassword: 'The email and password you typed do not match.'
};

module.exports = { urlDatabase, usersDatabase, errorMessages, users: usersDatabase.users };