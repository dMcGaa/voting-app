require('dotenv').load();
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
var ObjectId = require('mongodb').ObjectId;

var bodyParser = require('body-parser');

// Connection url
var userName = process.env.MONGOLAB_USER || "null";
var userPw = process.env.MONGOLAB_UPW || "null";
var dbUrl = 'mongodb://' + userName + ":" + userPw + "@" + "ds039125.mongolab.com:39125/mylonelydb";
var mongoTemp = {};
var requestedPoll = {};
var lastUsedPollId = "";

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
app.use(bodyParser.urlencoded({
  extended: false
}))

app.post("/addElement", function(req, res) {
  var addVar = {};
  addVar.vName = req.body.voteName;
  addVar.vQty = parseInt(req.body.voteQty);

  console.log("adding element");
  mongoAdd(addVar, function() {
    console.log("done adding");
    // res.send(mongoTemp);
  });
})
app.post("/addPoll", function(req, res) {
  var addPoll = {
    pollName: "",
    pollOptions: {}
  };
  //array of array for poll items and vote count
  addPoll.userName = req.body.userName;
  addPoll.pollName = req.body.pQuest;
  var option = [];
  var tempStr = "";
  
  // tempStr = req.body.pOption1;
  console.log(JSON.stringify(req.body));
  //regex to get all "pOption"
  for (var key in req.body){
    if (req.body.hasOwnProperty(key) && key.match(/pOption/)){
      console.log(key);
      addPoll.pollOptions[key] = {count:0, name:req.body[key]};
      // addPoll.pollOptions[key]["name"] = req.body[key];
      // addPoll.pollOptions[req.body[key]] = 0;
    }
  }


  console.log("adding poll " + JSON.stringify(addPoll));
  mongoAddPoll(addPoll, function() {
    console.log("done adding poll");
    res.redirect("/viewPoll/"+lastUsedPollId);
    // res.send(mongoTemp);
  });
})
app.post("/addUser", function(req, res) {
  console.log("Add User"); //todo
  console.log(req.body);
  var newUser = {};
  newUser.name = req.body.nuName;
  newUser.email = req.body.nuEmail;
  newUser.passw = req.body.nuPass;
  console.log(newUser);
  mongoAddUser(newUser, function() {
    console.log("done adding user");
    res.send(mongoTemp);
  });
  // res.send(true);  //send success value for the AJAX post
})
app.post("/castVote", function(req, res) {
  console.log("Casting Vote...");
  // console.log(req.body);
  var castVote = {};
  castVote.id = req.body.id;
  castVote.option = req.body.vote;
  console.log(castVote);
  mongoCastVote(castVote, function() {
    console.log("Done casting vote");
    res.redirect("/viewPoll/"+castVote.id);
  });
})
app.post("/deletePoll", function(req, res) {
  console.log("Casting Vote...");
  // console.log(req.body);
  var deletePoll = {};
  deletePoll.id = req.body.pollId;
  deletePoll.userName = req.body.userName;
  console.log(deletePoll);
  mongoRemoveOnePoll(deletePoll, function() {
    console.log("Done deleting poll");
    res.send("deleted");
  });
})
app.post("/logInUser", function(req, res) {
  var loginUser = {};
  loginUser.name = req.body.logInName;
  loginUser.pass = req.body.logInPass;
  console.log("Log In"); //todo
  mongoLogInUser(loginUser, function(data) {
    console.log("done loading");
    if (data.length === 1) {
      res.send(loginUser.name); //plus the authenticated token for a cookie
    }
    else {
      res.send("error");
    }
  });
  // res.send(true);  //send success value for the AJAX post
})
app.post("/loadDatabase", function(req, res) {
  console.log("load database was clicked");
  mongoFind(function() {
    console.log("done loading");
    res.send(mongoTemp);
  });
})

app.post("/viewAllPolls", function(req, res) {
  console.log("retrieving all polls");
  mongoFindPoll(function() {
    console.log("done loading");
    res.send(mongoTemp);
  });
})

app.post("/viewUserPolls", function(req, res) {
  var userName = req.body.userName;
  console.log("retrieving all polls for " + userName);
  mongoFindUserPoll(userName, function() {
    console.log("done loading");
    res.send(mongoTemp);
  });
})

app.post("/checkUser", function(req, res) {
  console.log("checking db user");
  // console.log(req.body);
  mongoCheckUser(req.body.nuName, function() {
    console.log("done user search");
    res.send(mongoTemp);
  });
  // res.send(true);
})

app.post("/viewOnePoll", function(req, res) {
  console.log("retrieving one poll");
  var reqPoll = req.body.pollNumber;
  mongoFindOnePoll(reqPoll, function() {
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
app.get('/viewUserPolls/', function(request, response) {
  response.render('pages/viewUserPolls');
});
app.get('/viewPoll/:pollId', function(request, response, next) {
  var requestedPoll = request.params.pollId;
  console.log(requestedPoll);
  mongoFindOnePoll(requestedPoll, function(err) {
    if (err) throw err;
    console.log("Find status: " + JSON.stringify(mongoTemp));
    response.render('pages/viewPoll', {
      requestedPoll: mongoTemp
    }); //add object to html
  });
  // response.render('pages/takePoll', {requestedPoll: requestedPoll}); //add object to html
});
app.get('/takePoll/:pollId', function(request, response, next) {
  var requestedPoll = request.params.pollId;
  console.log(requestedPoll);
  mongoFindOnePoll(requestedPoll, function(err) {
    if (err) throw err;
    console.log("Find status: " + JSON.stringify(mongoTemp));
    response.render('pages/takePoll', {
      requestedPoll: mongoTemp
    }); //add object to html
  });
  // response.render('pages/takePoll', {requestedPoll: requestedPoll}); //add object to html
});
app.get('/eraseAllPolls/', function(request, response) {
  mongoRemoveAllPolls(function(err){
    if(err) throw err;
    response.render('pages/index');  
  })
});
app.get('/takeRandomPoll/', function(request, response) {
  mongoOneRandom(function(err, docs){
    if(err) throw err;
    console.log(JSON.stringify(docs));
    response.redirect('/takePoll/'+docs._id);
    // response.send(JSON.stringify(docs));  
  })
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Connect using MongoClient
function mongoConnect() {
  MongoClient.connect(dbUrl, function(err, db) {
    test.equal(null, err);
    dbConn = db; //mongodb connection instance
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
    callback(); //callback once response is obtained (Asynchronous)
  })
}

function mongoAdd(addVar, callback) {
  var testVar = {
    item: addVar.vName,
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
    poll_user: addPoll.userName,
    poll_name: addPoll.pollName,
    poll_options: addPoll.pollOptions
  }

  var collection = dbConn.collection("votingapp");
  //insert to collection
  console.log("adding " + JSON.stringify(testVar));
  collection.insert(testVar, function(err, docsInserted) {
    if (err) throw err;
    // console.log(docsInserted); //view all insert
    console.log(docsInserted.ops[0]._id); //view one insert, and parameters
    lastUsedPollId = docsInserted.ops[0]._id;
    callback();
    //possibly have callback here, with return value and link to inserted poll.
  });
  //catch WriteConcernException

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
    callback(); //callback once response is obtained (Asynchronous)
  })
}

function mongoFindUserPoll(userName, callback) {
  var collection = dbConn.collection("votingapp");
  //read from collection
  collection.find({
    poll_name: {
      $exists: true
    },
    poll_user: userName
  }).toArray(function(err, docs) {
    if (err) throw err;
    mongoTemp = docs;
    console.log(JSON.stringify(mongoTemp));
    callback(); //callback once response is obtained (Asynchronous)
  })
}

function mongoFindOnePoll(pollId, callback) {
  var collection = dbConn.collection("votingapp");
  console.log("looking for: " + pollId + "(" + typeof(pollId) + ")");
  //read from collection
  collection.find({
    // _id: pollId
    _id: ObjectId(pollId),
    poll_name: {
      $exists: true
    }
  }).toArray(function(err, docs) {
    if (err) throw err;
    mongoTemp = docs;
    console.log(JSON.stringify(mongoTemp));
    callback(); //callback once response is obtained (Asynchronous)
  })
}
function mongoOneRandom(callback) {
  var collection = dbConn.collection("votingapp");
  //read from collection
  collection.aggregate([
    {$match : {poll_name : { $exists: true}}}
    // {$sample: { size: 1 }}
    ]).toArray(function(err, docs) {
    if (err) throw err;
    var randomDoc = Math.floor((Math.random() * docs.length));
    mongoTemp = docs[randomDoc];
    console.log(JSON.stringify(mongoTemp));
    callback(err, mongoTemp); //callback once response is obtained (Asynchronous)
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
  collection.insert(testVar, function(err, docsInserted) {
    if (err) throw err;
    // console.log(docsInserted); //view all insert
    console.log(docsInserted.ops[0]._id); //view one insert, and parameters
    //possibly have callback here, with return value and link to inserted poll.
  });
  //catch WriteConcernException
  callback();
}
function mongoCastVote(castVote, callback) {
  var collection = dbConn.collection("votingapp");
  console.log("Vote Input: " + JSON.stringify(castVote));
  var tempStr = "poll_options." + castVote.option + ".count";
  var incObj = {};
  incObj[tempStr] = 1;
  console.log("Vote String: " + tempStr);
  collection.update(
    {_id: ObjectId(castVote.id)},
    { $inc: incObj}
  );
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
    callback(); //callback once response is obtained (Asynchronous)
  })
}
function mongoRemoveAllPolls(callback) {
  var collection = dbConn.collection("votingapp");
  //read from collection
  collection.remove({
    poll_name: {
      $exists: true
    }
  })
  callback(); //callback once response is obtained (Asynchronous)
}

function mongoRemoveOnePoll(removeObj, callback) {
  var collection = dbConn.collection("votingapp");
  collection.remove({
    _id: ObjectId(removeObj.id),
    poll_name: {
      $exists: true
    },
    poll_user: removeObj.userName
  })
  callback(); //callback once response is obtained (Asynchronous)
}

function mongoLogInUser(loginUser, callback) {
  var collection = dbConn.collection("votingapp");
  //read from collection
  collection.find({
    uName: loginUser.name,
    uPass: loginUser.pass
  }).toArray(function(err, docs) {
    if (err) throw err;
    // mongoTemp = docs;
    console.log(JSON.stringify(docs));
    callback(docs); //callback once response is obtained (Asynchronous)
  })
}