const express = require("express");
const router = express.Router();
// Express Validator Middleware
const { body, validationResult } = require('express-validator');

// Bring in Models
//const { Article } = require("../models/article");
const Article = require('../models/article');


// Delete Article
router.delete("/:id", async (req, res) => {
  try {
    let query = { _id: req.params.id };
    const article = await Article.findById(req.params.id);

    Article.remove(query, (err) => {
      if (err) {
        console.log(err);
      }
      res.send("Success");
    });
  } catch (e) {
    res.send(e);
  }
});

// Load Edit Form - route for edit article
router.get("/edit/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      res.render("edit_article", {
        title: 'Edit Article "' + article.title + '"',
        article: article,
      });
    }
  });
});

// Update/Save Edit Article Form - route for POST edit article
router.post("/edit/:id", (req, res) => {
  console.log("Submitted POST DATA", req.body);
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  console.log("Received Article", article);

  let query = { _id: req.params.id };

  Article.update(query, article, (err) => {
    if (err) {
      console.log("Save error", err);
      req.flash("danger", "Article failed to update");
      return;
    } else {
      req.flash("success", "Article Saved successfully");
      res.redirect("/");
    }
  });
  return;
});

// add route http://localhost:3000/articles/add
router.get("/add", (req, res) => {
  res.render("add_article", {
    title: "Add Article",
  });
});

// add Submit POST route http://localhost:3000/articles/add
router.post(
  "/add",
  body("title").notEmpty(),
  body("author").notEmpty(),
  body("body").notEmpty(),
  (req, res) => {
    console.log("Submitted POST DATA", req.body);
    const errors = validationResult(req).errors;
    // if errors array not empty exist, render form again with errors
    if (errors.length > 0) {
      res.render("add_article", {
        title: "fill out all required fields before submit new Article",
        errors: errors
      });
      return;
    }

    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    console.log("Received Article", article);
    article.save((err) => {
      if (err) {
        console.log("Save error", err);
        res.redirect("/");
      } else {
        // console.log('Saved successfully');
        req.flash("success", "Article Added");
        res.redirect("/");
      }
    });
    return; //Article.create(req.body, (err, article) => {})
  }
);

/*
this route "/:id" is a dynamic route, and should be last checked 
otherwise it will be treat path parameter 'add' in "/add" as numeric id
give us an error :

 messageFormat: undefined,
  stringValue: '"add"',
  kind: 'ObjectId',
  value: 'add',
  path: '_id',
  reason: BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters

  .i.e. it's trying to convert string "add" to ObjectId
*/
// add route for single article
router.get("/:id", (req, res) => {
    Article.findById(req.params.id, (err, article) => {
      if (err) {
        console.log(err);
      } else {
        //console.log(article); // print article record
        res.render("article", { article: article });
      }
    });
  });
  

module.exports = router;