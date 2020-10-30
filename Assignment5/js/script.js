const dateIcon = document.getElementsByClassName("material-icons prefix")[0];

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var options = {};
  var instances = M.FormSelect.init(elems, options);
});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.datepicker');
  var options = {
    format: 'dd/mm/yyyy'};
  var instances = M.Datepicker.init(elems, options);
});

dateIcon.addEventListener("click", function() {
  var elems = document.querySelectorAll('.datepicker');
  var options = {
    format: 'dd/mm/yyyy'};
  var instances = M.Datepicker.init(elems, options);
});



