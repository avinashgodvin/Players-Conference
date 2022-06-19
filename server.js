const express = require("express");
const path = require("path");
const createError = require("http-errors");
const cookieSession = require("cookie-session");

const FeedbackService = require("./services/FeedbackService");
const PlayerService = require("./services/PlayerService");

const feedbackService = new FeedbackService("./data/feedback.json");
const playerService = new PlayerService("./data/players.json");

const routes = require("./routes");
const { request } = require("http");
const { response } = require("express");
const { stat } = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set("trust proxy", 1);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["ewrfere9r", "erqrdcd4"],
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "./static")));

app.use(async (request, response, next) => {
  try {
    const names = await playerService.getNames();
    response.locals.playerNames = names;
    // console.log("Names : ", response.locals.playerNames);
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use("/", routes({ feedbackService, playerService }));

app.use((request, response, next) => {
  return next(createError(404, "File not found"));
});

app.use((err, request, response, next) => {
  response.locals.message = err.message;
  //console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render("error");
});

app.listen(process.env.PORT || port, function () {
  console.log(`Listening on port ${port}`);
});
