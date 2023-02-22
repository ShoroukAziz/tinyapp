const express = require("express");
const cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs");
const methodOverride = require('method-override')

const app = express();
const PORT = 8080;

// Server Config
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'))


app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Helper Functions
const { generateRandomString, findUserByEmail, urlsForUser } = require('./helpers');

// Databases
const { urlDatabase, users, errorMessages } = require('./databses')


//
// Routes
//


// Login
app.get("/login", (req, res) => {

  if (req.session.user_id) {
    res.redirect('/urls');
    return;
  }
  res.render("login");
})


app.post("/login", (req, res) => {
  let error = false;
  let errorMessage = "";

  const user = findUserByEmail(req.body.email, users);


  if (!req.body.email || !req.body.password) {
    error = true;
    errorMessage = errorMessages.emptyEmailOrPassword;
  }

  else if (!user) {
    error = true;
    errorMessage = errorMessages.userNotFound;
  }
  else if (!bcrypt.compareSync(req.body.password, user.password)) {
    error = true;
    errorMessage = errorMessages.wrongPassword;
  }

  if (error) {
    res.status(403);
    res.render("login", { errorMessage });
    return;
  }
  req.session.user_id = user.id;
  res.redirect("/urls");
})

// Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
})

// Register
app.get("/register", (req, res) => {

  if (req.session.user_id) {
    res.redirect('/urls');
    return;
  }

  res.render("register");
})

app.post("/register", (req, res) => {

  let error = false;
  let errorMessage = "";

  if (!req.body.email || !req.body.password) {
    error = true;
    errorMessage = errorMessages.emptyEmailOrPassword;
  }

  else if (findUserByEmail(req.body.email, users)) {
    error = true;
    errorMessage = errorMessages.exisitingEmail
  }

  if (error) {
    res.status(400);
    res.render("register", { errorMessage });
    return;
  }

  const userId = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  users[userId] = {
    id: userId,
    email: req.body.email,
    password: hashedPassword
  }
  req.session.user_id = userId;
  res.redirect("/urls");
})

//Home Page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {

  const user_id = req.session.user_id;
  if (!user_id) {
    res.render("forbidden");
    return;
  }
  const templateVars = { urls: urlsForUser(user_id, urlDatabase), user: users[user_id] };
  res.render("urls_index", templateVars);

});

//Create
app.get("/urls/new", (req, res) => {

  if (!req.session.user_id) {
    res.redirect('/login');
    return;
  }
  res.render("urls_new", { user: users[req.session.user_id] });
});

app.post("/urls", (req, res) => {

  if (!req.session.user_id) {
    res.status(403);
    res.render('forbidden');
    return;
  }

  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    createdDate: new Date().toISOString().split('T')[0],
    userID: req.session.user_id
  }
  res.redirect(`/urls/${shortUrl}`);

});
//Read
app.get("/urls/:id", (req, res) => {

  const user_id = req.session.user_id;
  if (!user_id) {
    res.render("forbidden");
    return;
  }
  if (urlDatabase[req.params.id]) {

    if (urlDatabase[req.params.id].userID === user_id) {
      const templateVars = {
        id: req.params.id,
        longURL: urlDatabase[req.params.id].longURL,
        user: users[user_id]
      };
      res.render("urls_show", templateVars);
      return;
    }
    res.status(403)
    res.render("no_permission");
    return;


  }
  res.status(404);
  res.render("not_found", { user: users[req.session.user_id] });
  return;

});

//Update
app.put("/urls/:id", (req, res) => {

  const user_id = req.session.user_id;
  if (!user_id) {
    res.render("forbidden");
    return;
  }

  const shortUrl = req.params.id;

  if (urlDatabase[shortUrl]) {

    if (urlDatabase[shortUrl].userID === user_id) {
      const newLongURL = req.body.longURL;
      urlDatabase[shortUrl].longURL = newLongURL;
      res.redirect('/urls');
      return;
    }
    res.status(403)
    res.render("no_permission");
    return;
  }
  res.status(404);
  res.render("not_found", { user: users[req.session.user_id] });
  return;

});
//Delete
app.delete("/urls/:id", (req, res) => {

  const user_id = req.session.user_id;
  if (!user_id) {
    res.render("forbidden");
    return;
  }

  const id = req.params.id;

  if (urlDatabase[req.params.id]) {

    if (urlDatabase[req.params.id].userID === user_id) {
      delete urlDatabase[req.params.id];
      res.redirect('/urls');
      return;
    }
    res.status(403)
    res.render("no_permission");
    return;

  }
  res.status(404);
  res.render("not_found", { user: users[req.session.user_id] });
  return;

});
// Main Function
app.get("/u/:id", (req, res) => {

  if (urlDatabase[req.params.id]) {
    res.redirect(urlDatabase[req.params.id].longURL);
    return;
  }
  res.status(404);
  res.render("not_found", { user: users[req.session.user_id] });
  return;


});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});