require("./config/config");
const express = require("express");
const db = require("./config/db");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session); // session store
const apiErrorHandler = require("./middleware/errorHandler");
const cors = require("cors");
/**
 * ---------------- PASSPORT CONFIG ----------------
 */
require("./config/passport"); // passport config

/**
 * ---------------- MONGO LOGS ----------------
 */

db.on("error", (err) => {
  console.log("There was a db connection error " + err);
});

db.once("connected", () => {
  console.log("Successfully connected to DB");
  launchServer();
});

function launchServer() {
  /**
   * ---------------- EXPRESS APPLICATION ----------------
   */
  const app = express();

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
  };

  app.use(cors(corsOptions));

  // basic middleware
  app.use(express.json()); //  to parse the different request types
  app.use(express.urlencoded({ extended: true }));
  // app.use((req, res, next) => {
  //   // if you want some delay
  //   setTimeout(next, Math.floor(Math.random() * 1000 + 1000));
  // });
  /**
   * ---------------- SESSION SET UP ----------------
   */

  const sessionStore = new MongoStore({
    mongooseConnection: db, // default mongoose connection
    collection: "sessions"
  });

  app.use(
    session({
      // uses the session function as middleware
      secret: process.env.SESSION_SECRET, // the secret used to sign the session
      resave: false, // to not save to store unless something is modified
      saveUninitialized: false, // false is useful for implementing login sessions
      store: sessionStore, // where we store the sessions on the server
      cookie: {
        //the cookie configuration
        maxAge: 1000 * 60 * 60 * 24 * 30,
        secure: false,
        httpOnly: true,
        path: "/",
        sameSite: true // so the content is not readable by the client
      }
    })
  );

  /**
   * ---------------- PASSPORT MIDDLEWARE----------------
   */

  app.use(passport.initialize()); // initialize the passport middleware
  app.use(passport.session()); //this is for checking if the user is logged in

  /**
   * ---------------- ROUTES ----------------
   */

  app.use(require("./routes/index.js"));
  app.use("/events", require("./routes/event"));
  app.use("/foods", require("./routes/food"));
  /**
   * ---------------- ERROR HANDLELING MIDDLEWARE ----------------
   */

  app.use(apiErrorHandler);

  /**
   * ---------------- SERVER CONFIG ----------------
   */

  app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
  });
}
