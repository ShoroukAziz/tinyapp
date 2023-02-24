# 🔗TinyApp
### The ultimate solution for creating short and snappy URLs!
[![made-with-node](https://img.shields.io/badge/Made%20with-Node.js%20-success)](https://nodejs.org/en/) [![made-with-express](https://img.shields.io/badge/Made%20with-Express.js%20-black)](https://expressjs.com/)

## Table of Content
- [🔗TinyApp](#tinyapp)
    - [The ultimate solution for creating short and snappy URLs!](#the-ultimate-solution-for-creating-short-and-snappy-urls)
  - [Table of Content](#table-of-content)
  - [🌟 Features](#-features)
  - [🚀 Getting Started](#-getting-started)
  - [🧱 Main Structure](#-main-structure)
  - [Product Overview](#product-overview)
  - [📦 Tech Stack (Dependencies)](#-tech-stack-dependencies)
    - [🔙 Backend](#-backend)
    - [🧰 Development Dependencies](#-development-dependencies)
    - [👁‍🗨 Frontend Dependencies](#-frontend-dependencies)
  - [🧪 Testing](#-testing)
  - [🙈 Known issues](#-known-issues)
  - [⚠️ Disclaimer](#️-disclaimer)

## 🌟 Features
- Generate concise, memorable short URLs from long ones.
- Create multiple users.
- **Analytics**
  - See When was a URL created.
  - keep track of how many times a given short URL is visited.
  - keep track of how many **unique visitors** visit each url.
  - keep track of every visit (see a timestamp, and a generated visitor_id).

- **Security:** 
  - URLs can be edited or deleted only by their creator.
  - All passwords are hashed and cookies are encrypted.
---
## 🚀 Getting Started
  - Fork the repo
  - clone it <br>
  `git clone <repo> tinyapp`
  - Navigate to the repo<br>
  `cd tinyapp`
  - Install all the depndencies <br>
  `npm install`
  - Run the server: <br>
  `npm start`  <br>or `node express_server.js`
  - Visit the app in your browser: `http://127.0.0.1:8080/` <br> or in your terminal:
  <br> `curl http://127.0.0.1:8080/`
  - Create a user and start generating tiny urls 🎉🎇

---

## 🧱 Main Structure
```sh
├── docs                  # screenshots for readme
├── views                 # ejs templates & partials
│  ├── partials
├─── test                 # Includes testing code for helpers.js` 
├─── public               # static images
├─── databases.js         # database objects
├─── express_server.js    # The server: the main driver of the app includes all the routs and server configs
├─── helpers.js           #Includes Helper functions
├─── package-lock.json
├─── package.json
└─── README.md

```
---
## Product Overview
https://user-images.githubusercontent.com/27028706/220885021-be82ac72-034b-4340-99e9-8f68753f32e3.mp4

**Register screen** <br />
<img src="https://github.com/ShoroukAziz/tinyapp/blob/master/docs/register.PNG?raw=true"  width="400" height="230">

**Login Screen** <br />
<img src="https://github.com/ShoroukAziz/tinyapp/blob/master/docs/login.PNG?raw=true"  width="400" height="230">

**URLs Screen** <br />
<img src="https://github.com/ShoroukAziz/tinyapp/blob/master/docs/my%20urls.PNG?raw=true"  width="400" height="190">

**URL Screen** <br />
<img src="https://github.com/ShoroukAziz/tinyapp/blob/master/docs/url%20page.PNG?raw=true"  width="400" height="230">

**404 Screen** <br />
<img src="https://github.com/ShoroukAziz/tinyapp/blob/master/docs/not%20found.PNG?raw=true"  width="400" height="230">

**403 Screen** <br />
<img src="https://github.com/ShoroukAziz/tinyapp/blob/master/docs/forbidden.PNG?raw=true"  width="400" height="230">


---
## 📦 Tech Stack (Dependencies)
  ### 🔙 Backend
  - 🚄 [Express](express.js)
  - 📰 [EJS](https://ejs.co/)
  - 🍪 [Cookie-Session](https://www.npmjs.com/package/cookie-session)
  - 🔐 [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
  - 📝 [Method override](https://www.npmjs.com/package/method-override)
  - 💬 [Morgan](https://www.npmjs.com/package/morgan)

 ### 🧰 Development Dependencies
  - ☕ [Mocha](https://www.npmjs.com/package/mocha)
  - 🍵 [Chai](https://www.npmjs.com/package/chai)
  - 👿 [Nodemon](https://www.npmjs.com/package/nodemon)

 ### 👁‍🗨 Frontend Dependencies
- 🎨 [Bootstrap](https://getbootstrap.com/)
- 🔠 [FontAwesome](https://fontawesome.com/)
---
## 🧪 Testing
- To run the tests. make sure you are in the project directory
 `cd tinyapp`
 - Run `npm test`
---
## 🙈 Known issues
  - The url provided by the user has to start with http ot https otherwise it'll fail
---
## ⚠️ Disclaimer
- This is a project for [LHL web development bootcamp](https://www.lighthouselabs.ca/) and is not meant for production use



<img src="https://camo.githubusercontent.com/7dd59506447a5060c5df4ab9da2c7a3fefcb0e1cd86ba40d31a45666bc98e6e0/687474703a2f2f466f7254686542616467652e636f6d2f696d616765732f6261646765732f6275696c742d776974682d6c6f76652e737667"/>

[⬆ Go to beginning](#tinyapp)