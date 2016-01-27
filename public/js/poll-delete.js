$(document).ready(function() {
    // $("#database-stuff2").hide();
    $("#database-status").hide();
    // alert("delete JS loaded");
    $("button[id^='delPoll']").click(function(event){
        alert("delete poll");// + this.id);
    });
    // $(".delPoll").click(function(event){
    //     event.preventDefault();
    //     alert("delete poll");// + this.id);
    // });
    // $("a").click(function(event){
    //     event.preventDefault();
    //     alert("delete poll" + this.id);
    // });

})

function deleteUserPoll(poll) {
    var promise = promiseDeleteUserPolls(poll.id);
    promise.success(function(data) {
        // alert("poll deleted");
        $("#"+poll.id).remove();
    })

}


function promiseDeleteUserPolls(pollId) {
    var userName = checkCookie();
    if ((pollId !== "")&&(userName!=="")) {
        return $.ajax({
            type: "POST",
            url: "/deletePoll",
            data: {
                pollId: pollId,
                userName: userName
            },
            success: function(data) {
                if (data === "error") {
                    $("#database-message").html("Invalid Delete");
                    $("#database-message").css("visibility", "visible");
                }
            }
        })

    }

}