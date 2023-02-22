const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

// Server Config
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser())

// Helper Functions
const { generateRandomString, findUserByEmail, urlsForUser } = require('./helper');

// Databases
const { urlDatabase, users, errorMessages } = require('./databses')


//
// Routes
//


// Login
app.get("/login", (req, res) => {

  if (req.cookies['user_id']) {
    res.redirect('/urls');
    return;
  }
  res.render("login");
})


app.post("/login", (req, res) => {
  let error = false;
  let errorMessage = "";

  const user = findUserByEmail(req.body.email);


  if (!req.body.email || !req.body.password) {
    error = true;
    errorMessage = errorMessages.emptyEmailOrPassword;
  }

  else if (!user) {
    error = true;
    errorMessage = errorMessages.userNotFound;
  }
  else if (user.password !== req.body.password) {
    error = true;
    errorMessage = errorMessages.wrongPassword;
  }

  if (error) {
    res.status(403);
    res.render("login", { errorMessage });
    return;
  }
  res.cookie('user_id', user.id);
  res.redirect("/urls");
})

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
})

// Register
app.get("/register", (req, res) => {

  if (req.cookies['user_id']) {
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

  else if (findUserByEmail(req.body.email)) {
    error = true;
    errorMessage = errorMessages.exisitingEmail
  }

  if (error) {
    res.status(400);
    res.render("register", { errorMessage });
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

  const user_id = req.cookies['user_id'];
  if (!user_id) {
    res.render("forbidden");
    return;
  }
  const templateVars = { urls: urlsForUser(user_id), user: users[user_id] };
  res.render("urls_index", templateVars);

});

//Create
app.get("/urls/new", (req, res) => {

  if (!req.cookies['user_id']) {
    res.redirect('/login');
    return;
  }
  res.render("urls_new", { user: users[req.cookies['user_id']] });
});

app.post("/urls", (req, res) => {

  if (!req.cookies['user_id']) {
    res.status(403);
    res.render('forbidden');
    return;
  }

  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    createdDate: new Date().toISOString().split('T')[0]
  }
  res.redirect(`/urls/${shortUrl}`);

});
//Read
app.get("/urls/:id", (req, res) => {

  const user_id = req.cookies['user_id'];
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
  res.render("not_found", { user: users[req.cookies['user_id']] });
  return;

});

//Update
app.post("/urls/:id", (req, res) => {

  const user_id = req.cookies['user_id'];
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
  res.render("not_found", { user: users[req.cookies['user_id']] });
  return;

});
//Delete
app.post("/urls/:id/delete", (req, res) => {

  const user_id = req.cookies['user_id'];
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