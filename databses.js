const urlDatabase = {
  urls: {},
  saveURL: function(url) {
    this.urls[url.id] = url;
  },
  addVisit : function(urlId, visit) {
    this.urls[urlId].visits.push(visit);
  },
  gettTotalVisitsForURL : function(urlId) {
    return this.urls[urlId].visits.length;
  },
  getUniqueVisitorsForURL : function(urlId) {
    
    const allVisitors = this.urls[urlId].visits.map(e=>e.visitorId);
    return [...new Set(allVisitors)].length;

  }
};

const usersDatabase = {
  users: {},
  saveUser: function(user) {
    this.users[user.id] = user;
  }
};

const visitors = {
  addVisitor : function(visitorId) {
    this[visitorId] = visitorId;
  }
};

const errorMessages = {
  emptyEmailOrPassword: 'Email and password can not be empty.',
  exisitingEmail: 'The email you are trying to use already exist',
  userNotFound: 'There is no user registered with that email.',
  wrongPassword: 'The email and password you typed do not match.',
  emptyURL: 'URL can not be empty'
};

module.exports = { urlDatabase, usersDatabase, errorMessages, users: usersDatabase.users, urls: urlDatabase.urls , visitors };