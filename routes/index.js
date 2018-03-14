var express = require('express')
var control = require('../controller')

var router = express.Router()

// A GET route for scraping the echojs website
router.route('/scrape')
  .get(control.scrape)

// Route for getting all Articles from the db
router.route('/articles')
  .get(control.getAllArticles)

router.route('/articles/:id')
  .put(control.saveArticle)

// Route for getting all Saved Articles from the db
router.route('/saved')
  .get(control.getAllSaved)

router.route('/saved/:id')
  .put(control.unsaveArticle)

// Route for grabbing a specific Article by id, populate it with it's note
// And saving/updating an Article's associated Note
router.route('/note')
  .get(control.getAllNotes)

router.route('/note/:id')
  .get(control.getNote)
  .post(control.updateNote)

module.exports = router
