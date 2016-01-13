$(document).ready(function(){
    // $("#database-stuff2").hide();
})

function loadDataP() {
    // document.getElementById("database-stuff").innerHTML = "Clicked";
    $("#database-stuff").html("Loading...");
    $("#database-resp").html("Response");
    $("#database-data").html("Data");
    var promise = testAjaxP();
    promise.success(function (data){
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
    promise.success(function (data){
        $("#database-stuff").html("Done");
        $("#database-resp").html("Finished, results: " + data.length);
        $("#database-data").html(JSON.stringify(data));
    })
    
}

function viewAllPolls() {
    var promise = promiseOnePoll();
    promise.success(function (data){
        $("#database-data").html(JSON.stringify(data));
    })
}

function testAjaxP(){
    return $.ajax({
        url: "/loadDatabase",
        type: "POST"
    });
}

function promiseAllPolls(){
    return $.ajax({
        url: "/viewAllPolls",
        type: "POST"
    });
}

function promiseOnePoll(){
    return $.ajax({
        url: "/viewAllPolls",
        type: "POST"
    });
}