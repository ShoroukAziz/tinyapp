const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;


/*
 returns a string of 6 random alphanumeric characters
*/
function generateRandomString() {

  /*toString takes an integer in the range 2 through 36
   specifying the base to use for representing the number value.
   The default is 10. Here we're using base 36 to get a range
   from 0 to 9 and A to Z
   */

  return Math.random().toString(36).slice(2, 8).toUpperCase();
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
// Database
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

//
// Routes
//

//Login & Logout
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
})

//Home Page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {

  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);

});

//Create
app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: req.cookies["username"] });
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

  const longURL = urlDatabase[req.params.id].longURL

  if (longURL) {
    const templateVars = { id: req.params.id, longURL, username: req.cookies["username"] };
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
  res.render("not_found", { username: req.cookies["username"] });
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
  res.render("not_found", { username: req.cookies["username"] });
  return;

});
// Main Function
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL

  if (longURL) {
    res.redirect(longURL);
    return;
  }
  res.status(404);
  res.render("not_found", { username: req.cookies["username"] });
  return;


});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});