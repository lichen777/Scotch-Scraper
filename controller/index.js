var axios = require('axios')
var cheerio = require('cheerio')
var db = require('../models')

module.exports = {
  scrape: function (req, res) {
    // First, we grab the body of the html with request
    axios.get('https://scotch.io/').then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data)

      // Now, we grab every h2 within an article tag, and do the following:
      $('h2.card__title').each(function (i, element) {
        // Save an empty result object
        let result = {}

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).children().text()
        result.link = $(element).children().attr('href')

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle)
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.status(500).json(err)
          })
      })
    })
      .then(function () {
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send('Scrape Complete')
      })
  },

  getAllArticles: function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle)
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err)
      })
  },

  getAllSaved: function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({ saved: true })
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle)
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err)
      })
  },

  saveArticle: function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } }, { new: true })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle)
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err)
      })
  },

  unsaveArticle: function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } }, { new: true })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle)
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err)
      })
  },

  getNote: function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate('note')
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle)
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err)
      })
  },

  updateNote: function (req, res) {
    // Create a new note and pass the req.body to the entry
    console.log(req.body)
    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { notes: dbNote._id } }, { new: true })
      // if we want to have multiple notes per article, we should use $push instead of $set. And don't forget to update schema model. See next line
      // return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true })
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle)
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err)
      })
  }
}
