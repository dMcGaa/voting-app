$(document).ready(function() {
    $("#eUser").submit(function(e) {
        $.ajax({
            type: "POST",
            url: "/logInUser",
            data: $("#eUser").serialize(),
            success: function(data) {
                if (data === "error") {
                    $("#database-message").html("Invalid User Name or Password");
                    $("#database-message").css("visibility", "visible");
                }
                else {
                    $("#database-message").html("Logged in as: " + data);
                    $("#eUser").hide();
                    document.cookie="username=" + data + ";"; //cookie defaults to expire when browser closed
                    // checkUser();
                    //referencing function from user-cookie.js
                    var loggedIn = checkCookie();
                    if (loggedIn){
                        // alert("verified");
                        // alert(loggedIn);
                        window.location.href = "viewPolls"; //simulate a link click
                    };  
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