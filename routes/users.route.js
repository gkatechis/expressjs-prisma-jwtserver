const router = require("express").Router();
const path = require("path");

// Provides access to the AuthController class located at /controllers/auth.controller.js
const user = require("../controllers/auth.controller");

// Provides access to the auth function located at /middlewares/auth. This is specifically for the list route below, 
// as the auth functionality is handled from within the controllers for all other requests.
const auth = require("../middlewares/auth");

/* Routes */

// Create new user
// Passes the request to the register function in the AuthController class located at /controllers/auth.controller.js
router.post("/register", user.register);

// Login user
// path is utilized again to load the index.html file in the /public folder
router.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Passes the request to the login function in the AuthController class located at /controllers/auth.controller.js
router.post("/login", user.login);

// Passes the request to the all function in the AuthController class located at /controllers/auth.controller.js. 
// As noted above, this is currently unauthenticated. To require authentication, add auth to the function 
// like this: router.get("list, auth, user.all")
// List all users
router.get("/list", user.all);

router.get("/logout", function (req, res) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
})

module.exports = router;
