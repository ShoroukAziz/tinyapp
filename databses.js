const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    createdDate: "2023-02-20"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    createdDate: "2023-02-21"
  }
};


const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const errorMessages = {
  emptyEmailOrPassword: "Email and password can't be empty.",
  exisitingEmail: "The email you're trying to use already exist",
  userNotFound: "There's no user registered with that email.",
  wrongPassword: "The email and password you typed don't match."
}

module.exports = { urlDatabase, users, errorMessages };