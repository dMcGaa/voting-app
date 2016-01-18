$(document).ready(function() {
    $("#eUser").submit(function(e) {
        $.ajax({
            type: "POST",
            url: "/logInUser",
            data: $("#eUser").serialize(),
            success: function(data) {
                if (data === "error") {

                }
                else {
                    $("#database-message").html("Logged in as: " + data);
                    $("#eUser").hide();
                    // checkUser();
                }
            }
        })
        e.preventDefault(); //must have to prevent form from submitting
    })

})

//detect if client supports local storage
function supportsLocalStorage() {
    return typeof(Storage) !== 'undefined';
}

if (!supportsLocalStorage()) {
    //no html localStorage
}
else {
    //localStorage capable
}

function userLogin() {
    var promise = promiseLogin();
    promise.success(function(data) {
        $("#database-data").html(JSON.stringify(data));
    })
}

function promiseLogin() {
    return $.ajax({
        url: "/viewAllPolls",
        type: "POST"
    });
}