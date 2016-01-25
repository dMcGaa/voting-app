var optionCounter = 3; //two options exist by default, start at 3

$(document).ready(function() {
    var uName = checkCookie();
    if (uName !==""){
        $('input[name="userName"]').val(uName);
        $("#poll-new").css("display", "block");
        $("#control-login").css("display", "none");
    }
    
    
    $('input[type="submit"]').prop('disabled', true);
    $('input[type="text"]').keyup(function() {
        if ($(this).val() != '') {
            $('input[type="submit"]').prop('disabled', false);
        }
        else {
            $('input[type="submit"]').prop('disabled', true);
        }
    });
    $("#poll-new-option").click(function() {
        var newOption = document.createElement("input");
        newOption.type = "text";
        newOption.name = "pOption" + optionCounter;
        var newOptionButton = document.createElement("button");
        newOptionButton.style.color = "black";
        newOptionButton.className = "bOptionButton";
        var buttonText = document.createTextNode("-");
        newOptionButton.id = "bOption" + optionCounter;
        newOptionButton.type = "button";
        newOptionButton.appendChild(buttonText);
        $("#poll-options").append(newOption);
        // $("#poll-options").append(newOptionButton);
        $("#poll-options").append("<br>");
        optionCounter += 1;
    })
    $('.bOptionButton').click(function(){
        alert("Test");
    })

})