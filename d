[1mdiff --git a/public/js/view-db-items.js b/public/js/view-db-items.js[m
[1mindex 645522d..66820d3 100644[m
[1m--- a/public/js/view-db-items.js[m
[1m+++ b/public/js/view-db-items.js[m
[36m@@ -29,6 +29,13 @@[m [mfunction viewAllPolls() {[m
     [m
 }[m
 [m
[32m+[m[32mfunction viewAllPolls() {[m
[32m+[m[32m    var promise = promiseOnePoll();[m
[32m+[m[32m    promise.success(function (data){[m
[32m+[m[32m        $("#database-data").html(JSON.stringify(data));[m
[32m+[m[32m    })[m
[32m+[m[32m}[m
[32m+[m
 function testAjaxP(){[m
     return $.ajax({[m
         url: "/loadDatabase",[m
[36m@@ -41,4 +48,11 @@[m [mfunction promiseAllPolls(){[m
         url: "/viewAllPolls",[m
         type: "POST"[m
     });[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction promiseOnePoll(){[m
[32m+[m[32m    return $.ajax({[m
[32m+[m[32m        url: "/viewAllPolls",[m
[32m+[m[32m        type: "POST"[m
[32m+[m[32m    });[m
 }[m
\ No newline at end of file[m
