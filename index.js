require('dotenv').load();
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
// var myDb = require('./public/js/db.js');


// Connection url
var userName = process.env.MONGOLAB_USER || "null";
var userPw = process.env.MONGOLAB_UPW || "null";
var dbUrl = 'mongodb://' + userName + ":" + userPw + "@" + "ds039125.mongolab.com:39125/mylonelydb";
var mongoTemp = {};

console.log(dbUrl);
mongoConnect();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Give Views/Layouts direct access to data.
app.use(function(req, res, next) {
  res.locals.mongoTemp = mongoTemp;
  next();
});

app.get('/', function(request, response) {
  response.render('pages/index')
});
app.get('/add/', function(request, response) {
  response.render('pages/add')
});
app.get('/view/', function(request, response) {
  response.render('pages/view')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Connect using MongoClient
function mongoConnect() {
  MongoClient.connect(dbUrl, function(err, db) {
    test.equal(null, err);
    //db.close();
    var testVar = {
        _id: "myOne",
        item: "something",
        qty: 5,
      }
      // console.log(db.listCollections());
      // db.listCollections(); //will print the collection object
      // db.votingapp.insert(testVar);
      // db.insert(testVar);

    var collection = db.collection("votingapp");
    //insert to collection
    collection.insert(testVar);

    //read from collection
    collection.find({
      qty: {
        $gt: 2
      }
    }).toArray(function(err, docs) {
      if (err) throw err;
      mongoTemp = docs;
      console.log(JSON.stringify(mongoTemp));
      db.close();
    })

    // db.close();  //if using find, error with sockets closed before db returns (this close happens first, since db find is asynchronous)
  });
}