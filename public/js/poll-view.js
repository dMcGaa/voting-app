$(document).ready(function() {
    
})

function chartPoll(pollData){
    // Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);
    myNewChart.PolarArea(pollData, options);
}