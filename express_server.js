const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;


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

//
// Config
//
app.set("view engine", "ejs");

//
// Middleware
//
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser())

//
// Databases
//
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
  exisitingEmail: "The email you're trying to use already exist"
}

//
// Routes
//

///Register, Login & Logout 
app.post("/login", (req, res) => {
  //todo
  res.cookie('username', req.body.username)
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
})

app.get("/register", (req, res) => {

  const templateVars = { user: users[req.cookies['user_id']] };
  res.render("register", templateVars);
})

app.post("/register", (req, res) => {

  let error = false;
  let errorMessage = "";

  if (!req.body.email || !req.body.password) {
    error = true;
    errorMessage = errorMessages.emptyEmailOrPassword;
  }

  else if (findUserByEmail(req.body.email)) {
    error = true;
    errorMessage = errorMessages.exisitingEmail
  }

  if (error) {
    templateVars = { user: users[req.cookies['user_id']], errorMessage };
    res.status(400);
    res.render("register", templateVars);
    return;
  }

  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user_id', userId);
  res.redirect("/urls");
})

//Home Page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {

  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
  res.render("urls_index", templateVars);

});

//Create
app.get("/urls/new", (req, res) => {
  res.render("urls_new", { user: users[req.cookies['user_id']] });
});

app.post("/urls", (req, res) => {

  const shortUrl = generateRandomString();

  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    createdDate: new Date().toISOString().split('T')[0]
  }
  res.redirect(`/urls/${shortUrl}`);

});

//Read
app.get("/urls/:id", (req, res) => {


  if (urlDatabase[req.params.id]) {
    const templateVars = {
      id: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      user: users[req.cookies['user_id']]
    };
    res.render("urls_show", templateVars);
    return;
  }
  res.status(404);
  res.render("not_found", { username: req.cookies["username"] });
  return;

});

//Update
app.post("/urls/:id", (req, res) => {

  const shortUrl = req.params.id;

  if (urlDatabase[shortUrl]) {
    const newLongURL = req.body.longURL;
    urlDatabase[shortUrl].longURL = newLongURL;
    res.redirect('/urls');
    return;

  }
  res.status(404);
  res.render("not_found", { user: users[req.cookies['user_id']] });
  return;

});
//Delete
app.post("/urls/:id/delete", (req, res) => {

  const id = req.params.id;

  if (urlDatabase[req.params.id]) {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
    return;
  }
  res.status(404);
  res.render("not_found", { user: users[req.cookies['user_id']] });
  return;

});
// Main Function
app.get("/u/:id", (req, res) => {

  if (urlDatabase[req.params.id]) {
    res.redirect(urlDatabase[req.params.id].longURL);
    return;
  }
  res.status(404);
  res.render("not_found", { user: users[req.cookies['user_id']] });
  return;


});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});