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
var requestedPoll = {};

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
  res.locals.requestedPoll = requestedPoll;
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
  //array of array for poll items and vote count
  addPoll.pollName = req.body.pQuest;
  var option = [];
  var tempStr = "";
  
  //regex to get all "pOption"
  tempStr = req.body.pOption1;
  option.push(tempStr);
  option.push(0); //initialize vote to 0
  addPoll.pollOptions.push(option);
  console.log(addPoll.pollOptions);
  
  option = [];
  tempStr = req.body.pOption2;
  option.push(tempStr);
  option.push(0); //initialize vote to 0
  addPoll.pollOptions.push(option);
  console.log(addPoll.pollOptions);
  
  console.log("adding poll " + JSON.stringify(addPoll));
  mongoAddPoll(addPoll, function(){
    console.log("done adding poll");
    // res.send(mongoTemp);
  });
})
app.post("/addUser", function(req, res){
  console.log("Add User"); //todo
  console.log(req.body);
  var newUser = {};
  newUser.name = req.body.nuName;
  newUser.email = req.body.nuEmail;
  newUser.passw = req.body.nuPass;
  console.log(newUser);
  mongoAddUser(newUser, function(){
    console.log("done adding user");
    res.send(mongoTemp);
  });
  // res.send(true);  //send success value for the AJAX post
})
app.post("/logInUser", function(req, res){
  console.log("Log In");  //todo
  res.send(true);  //send success value for the AJAX post
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
app.post("/checkUser", function(req, res){
  console.log("checking db user");
  // console.log(req.body);
  mongoCheckUser(req.body.nuName, function(){
    console.log("done user search");
    res.send(mongoTemp);
  });
  // res.send(true);
})

app.post("/viewOnePoll", function(req, res){
  console.log("retrieving one poll");
  var reqPoll = req.body.pollNumber;
  mongoFindOnePoll(reqPoll, function(){
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
app.get('/signUp/', function(request, response) {
  // mongoConnectFind(response);
  response.render('pages/signUp');
});
app.get('/logIn/', function(request, response) {
  // mongoConnectFind(response);
  response.render('pages/logIn');
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
app.get('/takePoll/*', function(request, response) {
  var str = request.url;
  str = str.slice(("/takePoll/").length);
  if (str.match(/poll/)){
    str = str.slice(("poll").length);
    requestedPoll = str;
    console.log(requestedPoll);  
    //get database poll
    // response.render('pages/takePoll');
  }
  else{
    str = "not valid url for poll"
  }
  response.render('pages/takePoll', {requestedPoll: requestedPoll}); //add object to html
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
    collection.insert(testVar, function(err, docsInserted){
      if (err) throw err;
      // console.log(docsInserted); //view all insert
      console.log(docsInserted.ops[0]._id); //view one insert, and parameters
      //possibly have callback here, with return value and link to inserted poll.
    });
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

function mongoFindOnePoll(callback) {
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
function mongoAddUser(newUser, callback) {
    var testVar = {
        uName: newUser.name,
        uEmail: newUser.email,
        uPass: newUser.passw
      }

    var collection = dbConn.collection("votingapp");
    //insert to collection
    console.log("adding " + JSON.stringify(testVar));
    collection.insert(testVar, function(err, docsInserted){
      if (err) throw err;
      // console.log(docsInserted); //view all insert
      console.log(docsInserted.ops[0]._id); //view one insert, and parameters
      //possibly have callback here, with return value and link to inserted poll.
    });
    //catch WriteConcernException
    callback();
}
function mongoCheckUser(uName, callback) {
    var collection = dbConn.collection("votingapp");
    //read from collection
    collection.find({
      uName: uName
    }).toArray(function(err, docs) {
      if (err) throw err;
      mongoTemp = docs;
      console.log(JSON.stringify(mongoTemp));
      callback();//callback once response is obtained (Asynchronous)
    })
}