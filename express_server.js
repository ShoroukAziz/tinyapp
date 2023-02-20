const express = require("express");
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


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {

  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send(generateRandomString());
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});