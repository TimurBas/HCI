const dateIcon = document.getElementsByClassName("material-icons prefix")[0];
const datePicker = document.getElementById("date_of_birth");

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
