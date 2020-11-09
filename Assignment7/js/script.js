const dateIcon = document.getElementsByClassName("material-icons prefix")[0];
const datePicker = document.getElementById("date_of_birth");
const btn = document.getElementById("button1");
const res = document.getElementById("res");

let startTime;
let endTime;

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var options = {};
  var instances = M.FormSelect.init(elems, options);
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".datepicker");
  var options = {
    format: "dd/mm/yyyy"
  };
  var instances = M.Datepicker.init(elems, options);
  var instance = M.Datepicker.getInstance(datePicker);
  instance.setDate(new Date(1998, 5, 1));
});

dateIcon.addEventListener("click", function () {
  datePicker.click();
});

window.onload = () => {
  startTime = new Date().getTime();
}

btn.onclick = () => {
  endTime = new Date().getTime();
  alert("Time spent on filling the form: " + ((endTime - startTime) * 0.001).toFixed(2) + "s")
}