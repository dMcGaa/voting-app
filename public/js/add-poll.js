var optionCounter = 3; //two options exist by default, start at 3

$(document).ready(function() {
    $('input[type="submit"]').prop('disabled', true);
    $('input[type="text"]').keyup(function() {


    });
        $("#poll-new-option").click(function(){
            var newOption = document.createElement("input");
            newOption.type = "text";
            newOption.name = "pOption"+optionCounter;
            $("#poll-options").append(newOption);
            $("#poll-options").append("<br>");
        })
    
})