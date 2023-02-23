const urlDatabase = {
  urls: {},
  saveURL: function(url) {
    this.urls[url.id] = url;
  }
};

const usersDatabase = {
  users: {},
  saveUser: function(user) {
    this.users[user.id] = user;
  }
};

const errorMessages = {
  emptyEmailOrPassword: 'Email and password can not be empty.',
  exisitingEmail: 'The email you are trying to use already exist',
  userNotFound: 'There is no user registered with that email.',
  wrongPassword: 'The email and password you typed do not match.',
  emptyURL: 'URL can not be empty'
};

module.exports = { urlDatabase, usersDatabase, errorMessages, users: usersDatabase.users, urls: urlDatabase.urls };