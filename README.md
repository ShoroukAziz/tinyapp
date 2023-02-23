# 🔗TinyApp
### The ultimate solution for creating short and snappy URLs!
[![made-with-node](https://img.shields.io/badge/Made%20with-Node.js%20-success)](https://nodejs.org/en/) [![made-with-express](https://img.shields.io/badge/Made%20with-Express.js%20-black)](https://expressjs.com/)

## 🌟 Features
- Generate concise, memorable short URLs from long ones.
- Create multiple users.
- **Security:** 
  - URLs can be edited or deleted only by their creator.
  - All passwords are hashed and cookies are encrypted.
---
## 🚀 Getting Started
  - Fork the repo
  - clone it  
  `git clone <repo> tinyapp`
  - Navigate to the repo
  `cd tinyapp`
  - Install all the depndencies
  `npm install`
  - Run the server
  `npm start` or `node express_server.js`
  - Create a user and start generating tiny urls 🎉🎇
---
## 🧱 Structure
```
├── views                 =>ejs templates & partials
│  ├── partials
├─── test                 =>testing code for helpers
├─── public               =>static images
├─── databases.js         =>databases
├─── express_server.js    =>The server
├─── helpers.js           =>Helper functions
├─── package-lock.json
├─── package.json
└─── README.md

```
---
## Product Overview
https://user-images.githubusercontent.com/27028706/220885021-be82ac72-034b-4340-99e9-8f68753f32e3.mp4


---
  ## 📦 Dependencies
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
## 🙈 Known issues
  - The url provided by the user has to start with http ot https otherwise it'll fail

## ⚠️ Disclaimer
- This is a project for [LHL web development bootcamp](https://www.lighthouselabs.ca/) and is not meant for production use
