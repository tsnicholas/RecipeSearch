import $ from "jQuery";

$.ajax({
    url: 'https://www.themealdb.com/api/json/v1/1/search.php',
    type: 'GET',
    data: {s: "Arrabiata"},
    dataType: 'json',
    CORS: true,
    success: function() {
        console.log("Got data!");
    },
    error: function () {
        console.log("Something went wrong!");
    }
});
