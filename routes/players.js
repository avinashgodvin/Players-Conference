const express = require("express");
const { request } = require("express");

const router = express.Router();

module.exports = (params) => {
  const { playerService } = params;

  router.get("/", async (request, response, next) => {
    try {
      const topPlayers = await playerService.getListOfTopPlayers();
      return response.render("layout", {
        pageTitle: "Players",
        template: "players",
        topPlayers,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get("/:shortname", async (req, response, next) => {
    try {
      const player = await playerService.getPlayer(req.params.shortname);
      //console.log(player);
      return response.render("layout", {
        pageTitle: "Player Details",
        template: "playerDetail",
        player,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
