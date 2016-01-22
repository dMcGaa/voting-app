$(document).ready(function() {
    var doughnutData = processData();
    var ctx = document.getElementById("chart-area").getContext("2d");
    window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
        responsive: true
    });
    console.log("hello world " + requestedPoll.length);
    console.log(requestedPoll[0]["poll_options"]);
    // alert("doc ready");
    // for (var option in requestedPoll[0]["poll_options"]){
    //     console.log(option) 
    // }
    
})

function processData(){
    var data = [];
    var specifiedColors = ["#FF66FF","#FF6666","#FFCC66","#66FF66","#66FFFF","#6666FF"]; //
    var optCount = 0;
    var optColor = "#A0A";
    for(var option in requestedPoll[0]["poll_options"]){
        console.log("processData " + option);
        var optValue = requestedPoll[0]["poll_options"][option];
        var optLabel = option;
        if (optCount < specifiedColors.length){
            console.log(specifiedColors[optCount]);
            optColor = specifiedColors[optCount];
        }
        else{
            optColor = getRandomColor();
        }
        
        data.push({ 
            value: optValue,
            color: optColor,
            label: optLabel
        });
        optCount += 1;
    }
    console.log("Final Data" + JSON.stringify(data));
    return data;
    
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}