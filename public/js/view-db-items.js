$(document).ready(function() {
    // $("#database-stuff2").hide();
    $("#database-status").hide();


})

function loadDataP() {
    // document.getElementById("database-stuff").innerHTML = "Clicked";
    $("#database-stuff").html("Loading...");
    $("#database-resp").html("Response");
    $("#database-data").html("Data");
    var promise = testAjaxP();
    promise.success(function(data) {
        $("#database-stuff").html("Done");
        $("#database-resp").html("Finished, results: " + data.length);
        $("#database-data").html(JSON.stringify(data));
    })

}

function viewAllPolls() {
    // document.getElementById("database-stuff").innerHTML = "Clicked";
    $("#database-stuff").html("Loading...");
    $("#database-resp").html("Response");
    $("#database-data").html("Data");
    var promise = promiseAllPolls();
    promise.success(function(data) {
        // $("#database-data").html(data.length);
        $("#database-data").html("");
        for (var i = 0; i < data.length; i++){
            var pollIdLink = "/viewPoll/" + data[i]["_id"];
            var pollName = data[i]["poll_name"];
            var newPoll = document.createElement('a');
            newPoll.href = pollIdLink;
            newPoll.innerHTML = pollName;
            var votePoll = document.createElement('a');
            votePoll.href = "/takePoll/" + data[i]["_id"];
            votePoll.innerHTML = "(Vote)";
            $("#database-data").append(newPoll);
            $("#database-data").append(" ");
            $("#database-data").append(votePoll);
            $("#database-data").append("<br>");
            // $("#database-data").append("<div>TEMP<div>");
        }
    })

}

function viewUserPolls() {
    var promise = promiseUserPolls();
    promise.success(function(data) {
        // $("#database-data").html(data.length + JSON.stringify(data));
        $("#database-data").html("");
        for (var i = 0; i < data.length; i++){
            var pollIdLink = "/viewPoll/" + data[i]["_id"];
            var pollName = data[i]["poll_name"];
            var newPoll = document.createElement('a');
            var deletePoll = document.createElement('button');
            newPoll.href = pollIdLink;
            newPoll.innerHTML = pollName;
            deletePoll.innerHTML = "delete";
            deletePoll.style.color = "black";
            deletePoll.id = data[i]["_id"];
            deletePoll.addEventListener("click", function(){
                deleteUserPoll(this);
            });
            $("#user-polls").append(newPoll);
            $("#user-polls").append("&nbsp; &nbsp; &nbsp; &nbsp;");
            $("#user-polls").append(deletePoll);
            $("#user-polls").append("<br>");
        }
    })

}


function viewOnePoll() {
    var promise = promiseOnePoll();
    promise.success(function(data) {
        $("#database-data").html(JSON.stringify(data));
    })
}

function testAjaxP() {
    return $.ajax({
        url: "/loadDatabase",
        type: "POST"
    });
}

function promiseAllPolls() {
    return $.ajax({
        url: "/viewAllPolls",
        type: "POST"
    });
}

function promiseUserPolls() {
    var userName = checkCookie();
    if (userName !== "") {
        return $.ajax({
            type: "POST",
            url: "/viewUserPolls",
            data: {userName: userName},
            success: function(data) {
                if (data === "error") {
                    $("#database-message").html("Invalid User Name or Password");
                    $("#database-message").css("visibility", "visible");
                }
                // else{
                //     for (var item in data){

                //     }
                // }
            }
        })

    }

}

function promiseOnePoll() {
    return $.ajax({
        url: "/viewOnePoll",
        type: "POST"
    });
}