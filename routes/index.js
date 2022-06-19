const express = require("express");

const playersRoute = require("./players");
const feedbackRoute = require("./feedback");

const router = express.Router();

module.exports = (params) => {
  const { playerService } = params;

  router.get("/", async (request, response, next) => {
    try {
      const topPlayers = await playerService.getListOfTopPlayers();
      // if (!request.session.visitcount) {
      //   request.session.visitcount = 0;
      // }
      // request.session.visitcount += 1;
      // console.log("Count is ", request.session.visitcount);
      return response.render("layout", {
        pageTitle: "welcome",
        template: "index",
        topPlayers,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use("/players", playersRoute(params));
  router.use("/feedback", feedbackRoute(params));

  return router;
};
