// Provides access to the auth function located at /servuces/auth.services.js.
const auth = require("../services/auth.service");
const jwt = require("../utils/jwt.js");
const createError = require("http-errors");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

// npm install @supercharge/strings --save
// This is used to provide a randomized string to the jti attribute in the JWT token to prevent replay attacks on the token. This library provides URL friendly strings so that we can pass the JWT as a URL param to Zendesk.
const Str = require("@supercharge/strings");

// To customize the randomized string to your needs, see the documentation here: https://github.com/supercharge/strings. Currently we are setting the string's length to 50 characters, but you can chain additional options as well.


/* Creates AuthController class to handle register, login, and list functionality */

class AuthController {
  // Register new users. Passes to the auth service which will initiate the creation in the user database.
  static async register(req, res, next) {
    try {
      const user = await auth.register(req.body);
      res.status(201).json({
        status: true,
        message: "User created successfully",
        data: user
      });
    } catch (e) {
      next(createError(e.statusCode, e.message));
    }
  }

  static async login(req, res, next) {
    try {
      const subdomain = "z3ndoctorwhom1664823810";
      const data = await auth.login(req.body);
      let random = Str.random(50);
      let payload = {
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        jti: random
      };
      
      console.log(random)

      const sign = await jwt.signAccessToken(payload, accessTokenSecret);
      res
        .status(201)
        .redirect(
          302,
          "https://" + subdomain + ".zendesk.com/access/jwt?jwt=" + sign
        );
    } catch (e) {
      next(createError(e));
    }
  }

  static async all(req, res, next) {
    try {
      const users = await auth.all();
      res.status(200).json({
        status: true,
        message: "All users",
        data: users
      });
    } catch (e) {
      next(res.json(e.statusCode, e.message));
    }
  }
}

module.exports = AuthController;
