const express = require("express");

const { check, validationResult } = require("express-validator");
const { request } = require("express");

const router = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  router.get("/", async (request, response, next) => {
    try {
      const feedback = await feedbackService.getList();

      // const errors = request.session.feedback
      //   ? request.session.feedback.errors
      //   : false;
      const successMessage = request.session.feedback
        ? request.session.feedback.message
        : false;
      request.session.feedback = {};

      return response.render("layout", {
        pageTitle: "Feedback",
        template: "feedback",
        feedback,
        successMessage,
        // errors,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post(
    "/",
    // [
    //   check("name")
    //     .trim()
    //     .isLength({ min: 3 })
    //     .escape()
    //     .withMessage("A name is required"),
    //   check("email")
    //     .trim()
    //     .isEmail()
    //     .normalizeEmail()
    //     .withMessage("A valid Email address is required"),
    //   check("title")
    //     .trim()
    //     .isLength({ min: 3 })
    //     .escape()
    //     .withMessage("A title is required"),
    //   check("message")
    //     .trim()
    //     .isLength({ min: 5 })
    //     .escape()
    //     .withMessage("A message is required"),
    // ],
    async (request, response, next) => {
      // const errors = validationResult(request);
      // if (!errors.isEmpty()) {
      //   request.session.feedback = {
      //     errors: errors.array(),
      //   };
      //   return response.redirect("/feedback");
      // }
      // return response.send("feedback page post request");
      const { name, email, title, message } = request.body;
      await feedbackService.addEntry(name, email, title, message);
      request.session.feedback = {
        message: "Thank you for your feedback ",
      };
      return response.redirect("/feedback");
    }
  );

  return router;
};
