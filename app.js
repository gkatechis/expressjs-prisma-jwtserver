// @TODO:
// Convert HTML to Pug and then switch the view engine
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
require("@prisma/client");
const corsAnywhere = require("cors-anywhere");

// We set the JWT secret key here, ports, and the SQLite database file path.
require("dotenv").config();

// //Adding preflight cors for all routes
// app.options('*', cors())

// The users API is passed to routes/users.routes.js
const route = require("./routes/users.route");

// The path module is native to Nodejs, nothing for npm to install
const path = require("path");

// Sets the template engine (https://expressjs.com/en/guide/using-template-engines.html) or use plain html
app.set("view engine", "html");

/* Mount middleware functions */

//app.use(cors())
app.use(express.json());``
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

// This app's API is routed through /users/* and uses the routes/users.route.js file to handle all of the CRUD requests.
app.use("/users", route);

// To use a JS file, the following express.static(path.join(__dirname, 'public')) function is used 
// to prevent POST requests made by the client side JS pages from being routed to the /users routing.
app.use("/public", express.static(path.join(__dirname, "public")));

// Begins listening for requests on the specific port. If no environment variable is used, it will utilize 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
