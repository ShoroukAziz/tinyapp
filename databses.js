const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    createdDate: "2023-02-20",
    userID: "aJ48lW",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    createdDate: "2023-02-21",
    userID: "aJ48lW",
  },
  "9sm5xg": {
    longURL: "http://www.google.com",
    createdDate: "2023-02-21",
    userID: "ah48lk",
  }
};


const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  ah48lk: {
    id: "ah48lk",
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