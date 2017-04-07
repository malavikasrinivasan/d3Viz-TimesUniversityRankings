

var csv = [];
var univs = [];

// Reading and manipulating the csv


var tst = d3.csv("data/timesData_2016.csv", function(data) 
	{	
		
		data.forEach(function(d) {
			d.world_rank = d.world_rank,
			d.university_name = d.university_name,
			d.country = d.country,
			d.teaching = +d.teaching,
			d.research = +d.research,
			d.income = +d.income,
			d.student_staff_ratio = +d.student_staff_ratio,
			d.international_students = +d.international_students
		});


		csv=data; 
		
		// Get list of universities from the array of objects
		univs = csv.map(function(arr) {return arr.university_name;});

		// Dynamically assign values to the dropdown
		$.each(univs, function(i, p) {
    	$('#dropdown-1').append($('<option></option>').val(p).html(p));
		});

		$.each(univs, function(i, p) {
		    $('#dropdown-2').append($('<option></option>').val(p).html(p));
		});

		// Using selectize to turn the dropdown into a selectize dropdown with search features.
		$('#dropdown-1').selectize({
		    create: false,
		    sortField: 'text'
		});

		$('#dropdown-2').selectize({
		    create: false,
		    sortField: 'text'
		});

		// Getting values for Berkeley and Stanford to populate the default chart

		berkeley = csv.filter(function (obj) {return obj.university_name == "University of California, Berkeley"})[0];
		stanford = csv.filter(function (obj) {return obj.university_name == "Stanford University"})[0];
		// console.log(berkeley);

		// Setting default values for dropdown - weird because I'm using selectize.js
		// var dd1 = $('#dropdown-1').selectize();
		// dd1[0].selectize.setValue("University of California, Berkeley");

		// var dd2 = $('#dropdown-2').selectize();
		// dd2[0].selectize.setValue("Stanford University");


		createRadar(berkeley, stanford);
	});


function getSelectedUniv(univ, dropdown_id) {
	var selected = univ.options[univ.selectedIndex].innerHTML;
	// console.log(selected, dropdown_id);
	$(dropdown_id).text('');
	$(dropdown_id).text(selected);

	var univ1, univ2;
	// If one dropdown is changed, get current value of second dropdown and render the radar again

	if (dropdown_id == '#univ-1')
	{
		univ1 = csv.filter(function (obj) {return obj.university_name == selected})[0];
		univ2_name = $('#dropdown-2').find(":selected").text();
		if (univ2_name == "") {
			univ2_name = "Stanford University"
		}
		univ2 = csv.filter(function (obj) {return obj.university_name == univ2_name})[0];
		createRadar(univ1, univ2);
	} else
	{
		univ1 = csv.filter(function (obj) {return obj.university_name == selected})[0];
		univ2_name = $('#dropdown-1').find(":selected").text();
		if (univ2_name == "") {
			univ2_name = "University of California, Berkeley"
		}
		univ2 = csv.filter(function (obj) {return obj.university_name == univ2_name})[0];
		createRadar(univ2, univ1);
	}
}


//Radar Chart stuff

RadarChart.defaultConfig.color = function() {};
RadarChart.defaultConfig.radius = 5;
RadarChart.defaultConfig.w = 600;
RadarChart.defaultConfig.h = 400;


function createRadar(univ1, univ2) {

	console.log(univ1);
	console.log(univ2);
	
	var data = [
	  {	
	    className: "univ1", // optional can be used for styling
	    axes: [
	      {axis: "teaching", value: univ1.teaching}, 
	      {axis: "research", value: univ1.research}, 
	      {axis: "income", value: univ1.income},  
	      {axis: "student-staff-ratio", value: univ1.student_staff_ratio},  
	      {axis: "international", value: univ1.international}
	    ],
	    name: univ1.university_name
	  },
	  {
	    className: "univ2", // optional can be used for styling
	    axes: [
	      {axis: "teaching", value: univ2.teaching}, 
	      {axis: "research", value: univ2.research}, 
	      {axis: "income", value: univ2.income},  
	      {axis: "student-staff-ratio", value: univ2.student_staff_ratio},  
	      {axis: "international", value: univ2.international}
	    ],
	    name: univ2.university_name
	  }
	];

	var chart = RadarChart.chart();
	var cfg = chart.config(); // retrieve default config
	var svg = d3.select('#chart-container')
	  .attr('width', cfg.w + cfg.w + 50)
	  .attr('height', cfg.h + cfg.h / 4);

	RadarChart.draw("#chart-container", data);

	var tbody1 = document.getElementById('tbody1');
	tbody1.innerHTML = "";
	for (var i = 0; i < Object.keys(univ1).length; i++) {
		var k = Object.keys(univ1)[i];
		var v = univ1[k].toString();
		var tr;
		tr = "<td>" + k + ":" + "</td>" + "<td>" + v + "</td></tr>";
		tbody1.innerHTML += tr;
	}

	var tbody2 = document.getElementById('tbody2');
	tbody2.innerHTML = "";
	for (var i = 0; i < Object.keys(univ2).length; i++) {
		var k = Object.keys(univ2)[i];
		var v = univ2[k].toString();
		var tr;
		tr = "<td>" + k + ":" + "</td>" + "<td>" + v + "</td></tr>";
		tbody2.innerHTML += tr;
	}

}
