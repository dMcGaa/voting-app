require('dotenv').load();
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient,
  test = require('assert');

var bodyParser = require('body-parser');

// Connection url
var userName = process.env.MONGOLAB_USER || "null";
var userPw = process.env.MONGOLAB_UPW || "null";
var dbUrl = 'mongodb://' + userName + ":" + userPw + "@" + "ds039125.mongolab.com:39125/mylonelydb";
var mongoTemp = {};

console.log(dbUrl);
var dbConn;
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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.post("/addElement", function(req, res){
  var addVar = {};
  addVar.vName = req.body.voteName;
  addVar.vQty = parseInt(req.body.voteQty);
  
  console.log("adding element");
  mongoAdd(addVar, function(){
    console.log("done adding");
    // res.send(mongoTemp);
  });
})
app.post("/addPoll", function(req, res){
  var addPoll = {
    pollName: "",
    pollOptions: []
  };
  addPoll.pollName = req.body.pQuest;
  var option = {};
  option.optionName = parseInt(req.body.pOption1);
  option.optionCount = 0;
  addPoll.pollOptions.push(option);
  
  console.log("adding poll " + JSON.stringify(addPoll));
  mongoAddPoll(addPoll, function(){
    console.log("done adding poll");
    // res.send(mongoTemp);
  });
})
app.post("/loadDatabase", function(req, res){
  console.log("load database was clicked");
  mongoFind(function(){
    console.log("done loading");
    res.send(mongoTemp);
  });
})

app.post("/viewAllPolls", function(req, res){
  console.log("retrieving all polls");
  mongoFindPoll(function(){
    console.log("done loading");
    res.send(mongoTemp);
  });
})



app.get('/', function(request, response) {
  response.render('pages/index')
});
app.get('/add/', function(request, response) {
  response.render('pages/add');
});
app.get('/newPoll/', function(request, response) {
  response.render('pages/newPoll');
});
app.get('/view/', function(request, response) {
  // mongoConnectFind(response);
  response.render('pages/view');
});
app.get('/viewAjax/', function(request, response) {
  response.render('pages/viewAjax');
});
app.get('/viewPolls/', function(request, response) {
  response.render('pages/viewPolls');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Connect using MongoClient
function mongoConnect() {
  MongoClient.connect(dbUrl, function(err, db) {
    test.equal(null, err);
    dbConn = db;  //mongodb connection instance
    // db.close();  //no need to close, let application termination handle this
  });
}

function mongoFind(callback) {
    var collection = dbConn.collection("votingapp");
    //read from collection
    collection.find({
      qty: {
        $gt: 2
      }
    }).toArray(function(err, docs) {
      if (err) throw err;
      mongoTemp = docs;
      console.log(JSON.stringify(mongoTemp));
      callback();//callback once response is obtained (Asynchronous)
    })
}

function mongoAdd(addVar, callback) {
    var testVar = {
        item: addVar.vName ,
        qty: addVar.vQty
      }

    var collection = dbConn.collection("votingapp");
    //insert to collection
    console.log("adding " + JSON.stringify(testVar));
    collection.insert(testVar);
    //catch WriteConcernException
    callback();
}

function mongoAddPoll(addPoll, callback) {
    var testVar = {
        poll_name: addPoll.pollName,
        poll_options: addPoll.pollOptions
      }

    var collection = dbConn.collection("votingapp");
    //insert to collection
    console.log("adding " + JSON.stringify(testVar));
    collection.insert(testVar);
    //catch WriteConcernException
    callback();
}

function mongoFindPoll(callback) {
    var collection = dbConn.collection("votingapp");
    //read from collection
    collection.find({
      poll_name: {
        $exists: true
      }
    }).toArray(function(err, docs) {
      if (err) throw err;
      mongoTemp = docs;
      console.log(JSON.stringify(mongoTemp));
      callback();//callback once response is obtained (Asynchronous)
    })
}