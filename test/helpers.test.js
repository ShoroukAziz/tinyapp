const { assert } = require('chai');
const { findUserByEmail, urlsForUser, generateRandomString } = require('../helpers.js');

const testUsers = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "ah48lk": {
    id: "ah48lk",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

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


describe('findUserByEmail', () => {

  it('should return a user with valid email', () => {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUserID = "aJ48lW";
    assert.equal(user, testUsers[expectedUserID]);
  });

  it('should return null when given a non-existent email', () => {
    const user = findUserByEmail("hello@example.com", testUsers);
    assert.equal(user, null);
  });
});

describe('urlsForUser', () => {

  it('should return an object with the urls that belongs to the given user only', () => {
    const urls = urlsForUser("ah48lk", urlDatabase);
    const expectedURLs = {
      "9sm5xg": {
        longURL: "http://www.google.com",
        createdDate: "2023-02-21",
        userID: "ah48lk",
      }
    };
    assert.deepEqual(urls, expectedURLs);
  });

  it('should return an empty opject if the given user doen\'t exist', () => {
    const urls = urlsForUser("45fy", urlDatabase);
    assert.deepEqual(urls, {});
  });
});


describe('generateRandomString', () => {

  it('should return a string of 6 charachters', () => {
    const string = generateRandomString();
    assert.equal(string.length, 6);
  });

});