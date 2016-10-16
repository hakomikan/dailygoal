var express = require('express');
var pug = require('pug');
var path = require("path"); 
var mongoose = require('mongoose');

var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var DailyGoalSchema = new mongoose.Schema({
  subject: String,
});
mongoose.model('DailyGoal', DailyGoalSchema);

var uristring = process.env.MONGODB_URI || 'mongodb://localhost/dailygoal'
mongoose.connect(uristring,
  function (err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      console.log ('Succeeded connected to: ' + uristring);
    }
  }
);

var DailyGoal = mongoose.model('DailyGoal');

app.get('/', function (req, res) {

  DailyGoal.find({}, function(err, docs) {
    for (var i=0, size=docs.length; i<size; ++i) {
      console.log(docs[i].subject);
    }
    res.render('index', {items: docs});
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

