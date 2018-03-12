var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var mongoose = require('mongoose')

var PORT = 8080

var app = express()

// Use morgan logger for logging requests
app.use(logger('dev'))
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }))
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'))

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise
mongoose.connect('mongodb://localhost/scotch', {
  useMongoClient: true
})

// Routes
app.use(require('./routes'))

// Start the server
app.listen(PORT, function () {
  console.log('App running on port ' + PORT + '!')
})
