require('dotenv').load();
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
  
  
// Connection url
var userName = process.env.MONGOLAB_USER || "null";
var userPw = process.env.MONGOLAB_UPW || "null";
var dbUrl = 'mongodb://'+ userName + ":" + userPw + "@" +"ds039125.mongolab.com:39125/mylonelydb";
console.log(dbUrl);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Connect using MongoClient
MongoClient.connect(dbUrl, function(err, db) {
  test.equal(null, err);
  db.close();
  // // Use the admin database for the operation
  // var adminDb = db.admin();
  // // List all the available databases
  // adminDb.listDatabases(function(err, dbs) {
  //   test.equal(null, err);
  //   test.ok(dbs.databases.length > 0);
  //   db.close();
  // });
});