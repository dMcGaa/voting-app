$(document).ready(function() {
    $("#database-data").html("test");

    $("#nUser").submit(function(e) {
        // alert("form submitted");
        $.ajax({
            type: "POST",
            url: "/addUser",
            data: $("#nUser").serialize(),
            success: function(data) {
                $("#database-data").html("Added");
            }
        })
        e.preventDefault();  //must have to prevent form from submitting
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

function addUser() {
    var promise = promiseAddUser();
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

function promiseAddUser() {
    return $.ajax({
        url: "/addUser",
        type: "POST"
    });
}

function validateNewUser() {
    var isValid = true;
    var name = document.forms["newUser"]["nuName"].value;
    var email = document.forms["newUser"]["nuEmail"].value;
    var pw1 = document.forms["newUser"]["nuPass"].value;
    var pw2 = document.forms["newUser"]["nuPassConfirm"].value;

    if (name == null || name == "") {
        isValid = false;
    }
    if (email == null || email == "") {
        isValid = false;
    }
    if (pw1 == null || pw1 == "") {
        isValid = false;
    }
    if (pw1 !== pw2) {
        isValid = false;
    }
    $("#database-data").html("Valid");
    return isValid; //return true if all above statements are ok.
}

$("#nUser").submit(function() {
    // alert("form submitted");
    $.get("/");
})