const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const prisma = new PrismaClient();
const Str = require("@supercharge/strings");

const random = Str.random(50);

class AuthService {
  // (data) is passed from the request body in the auth controller. This will be first_name, last_name, email, and raw password.
  static async register(data) {
    // Encrypt password and replace raw data passed from auth controller to be stored in the users database.
    // Write new user to users database
    let newUser = prisma.users.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: bcrypt.hashSync(data.password, 8)
      }
    });

    // Set JWT payload to required configuration for Zendesk
    let payload = {
      name: `${newUser.first_name} ${newUser.last_name}`,
      email: newUser.email,
      jti: random
    };

    // Create and sign new JWT token. It is important to note that this validation does not guarantee the integrity of the data, 
    // so this should be handled before writing to the database in a production environment
    newUser.accessToken = await jwt.signAccessToken(payload);
    return newUser;
  }

  static async login(data) {
    console.log("data: ", data[0]);
    

    const user = await prisma.users.findUnique({
      where: {
        email: data.email
      }
    });
    if (!user) {
      throw createError.NotFound(
        "No existing user with that email address exists. Please register."
      );
    } else {
      console.log(user);
    }
    const checkPassword = bcrypt.compare(data.password, user.password);
    if (!checkPassword)
      throw createError.Unauthorized(
        "Login info is incorrect. Please try again."
      );
    delete user.password;
    const accessToken = await jwt.signAccessToken(user);
    return { ...user, accessToken };
  }

  static async all() {
    const allUsers = await prisma.users.findMany();
    return allUsers;
  }
}
module.exports = AuthService;
