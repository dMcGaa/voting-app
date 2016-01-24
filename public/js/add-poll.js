var optionCounter = 3; //two options exist by default, start at 3

$(document).ready(function() {
    if (checkCookie() !==""){
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
        $("#poll-options").append(newOption);
        $("#poll-options").append("<br>");
        optionCounter += 1;
    })

})