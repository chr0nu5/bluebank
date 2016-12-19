var express = require('express'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    consolidate = require('consolidate');

//controllers
var PageController = require('./controllers/page_controller');

// webserver configuration
var app = express();
app
    .set('views', __dirname + '/views')
    .set('view engine', 'ejs')
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
    .engine('html', consolidate.swig)
    .enable('trust proxy');

// routes
app
    .get('/', PageController.index);

// run
app.listen(3000);
console.log('Listening on port 3000');
