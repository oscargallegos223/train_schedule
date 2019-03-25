var config = {

  apiKey: "AIzaSyDpu46Zln72RK9s72m-dJ1JEyoLsQZkYEY",
  authDomain: "trainschedule-d93d2.firebaseapp.com",
  databaseURL: "https://trainschedule-d93d2.firebaseio.com",
  projectId: "trainschedule-d93d2",
  storageBucket: "trainschedule-d93d2.appspot.com",
  messagingSenderId: "1097152156552"

};



firebase.initializeApp(config);



var database = firebase.database();



var trainName = "";

var destination = "";

var startTime = "";

var frequency = 0;



$("#train-name").val(sessionStorage.getItem("train"));

$("#destination").val(sessionStorage.getItem("city"));

$("#first-train").val(sessionStorage.getItem("time"));

$("#frequency").val(sessionStorage.getItem("freq"));



$("#submit").on("click", function (event) {

  event.preventDefault();



  if ($("#train-name").val().trim() === "" ||

    $("#destination").val().trim() === "" ||

    $("#first-train").val().trim() === "" ||

    $("#frequency").val().trim() === "") {



    alert("Please fill in all details to add new train");



  } else {



    trainName = $("#train-name").val().trim();

    destination = $("#destination").val().trim();

    startTime = $("#first-train").val().trim();

    frequency = $("#frequency").val().trim();



    $(".form-field").val("");



    database.ref().push({

      trainName: trainName,

      destination: destination,

      frequency: frequency,

      startTime: startTime,

    });



    sessionStorage.clear();

  }



});



database.ref().on("child_added", function (childSnapshot) {

  var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");

  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");

  var timeRemain = timeDiff % childSnapshot.val().frequency;

  var minToArrival = childSnapshot.val().frequency - timeRemain;

  var nextTrain = moment().add(minToArrival, "minutes");

  var key = childSnapshot.key;



  var newrow = $("<tr>");

  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));

  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));

  newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));

  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));

  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));

  newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>Delete</button></td>"));



  if (minToArrival < 6) {

    newrow.addClass("info");

  }

  $("#train-table-rows").append(newrow);

});

$(document).on("click", ".arrival", function () {

  keyref = $(this).attr("data-key");

  database.ref().child(keyref).remove();

  window.location.reload();

});

setInterval(function () {

  window.location.reload();

}, 60000)