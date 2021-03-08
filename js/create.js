

var db = window.openDatabase("dsgdb", "1.0", "dsg database", 1000000); //will create database Dummy_DB or open it

document.addEventListener("deviceready", function () {

if (localStorage.getItem("theme") == "dark") {
	document.getElementById("body").classList.toggle("active");
document.getElementById("qDiv").classList.toggle("active");
document.getElementById("aDiv").classList.toggle("active");
document.getElementById("header").classList.toggle("active");
}

localStorage.removeItem("selected");
db.transaction(function(transaction) {
		transaction.executeSql("SELECT * FROM category", [], function(tx, result){
			var len = result.rows.length;
			for (var i=0; i<len; i++) {
			var name = result.rows.item(i).name;
			var id = result.rows.item(i).id;
			
			// Add ltem to real select
			var opt = document.createElement("option");
			opt.innerText = name;
			opt.setAttribute("value", id);
			var cat = document.getElementById("category");
			cat.appendChild(opt);
			
			// Add item to custom select
			var div = document.createElement("div");
			div.innerHTML = "<div>" + name + "</div><div><i></i></div>";
			div.setAttribute("onclick", `selected(this, ${id})`);
			div.setAttribute("id", id);
			document.getElementById("opt-container").appendChild(div);
			
			
			}
			
		
	}, function (err) {
		// alert("Error here: "+err.code);
	});
}, function (err) {
	// alert("Error2: "+err.code);
}, function () {
	// alert("Success in select");
});


var q = document.getElementById('qDiv');
var a = document.getElementById('aDiv');
var c = document.getElementById('category');
var save = document.getElementById("save");
var edit = document.getElementById("edit");
var reset = document.getElementById("reset");

c.addEventListener("click", function (e) {
	e.preventDefault();
	window.location = "#m";
	document.getElementById("m").classList.add("active");
});

if (localStorage.getItem("id") == null) {
	// alert("create");
	createTable();
	editMode();
} else {
	// alert("fetch");
	fetchData();
	viewMode();
}

function createTable() {
// Create Table
db.transaction(function (tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS study_guides(id INTEGER PRIMARY KEY AUTOINCREMENT,questions TEXT NOT NULL, answers TEXT NOT NULL, category_id INTEGER)');
}, function (err) {
		// alert("Error on creating table: "+err.code);
}, function () {
		// alert("Success on creating Table!");
});
}

function fetchData() {
	var id = localStorage.getItem("id");
	// Fetch Data
	db.transaction(function(transaction) {
		transaction.executeSql("SELECT * FROM study_guides WHERE id = ?", [id], function(tx, result){
			
			q.value = result.rows.item(0).questions;
			a.value = result.rows.item(0).answers;
			c.value = result.rows.item(0).category_id;
			
			q.style.height = (q.scrollHeight + 20) + "px";
			a.style.height = (a.scrollHeight + 20) + "px";
		});
	});
}

save.addEventListener("click", function () {
	// alert("click!");
	if (localStorage.getItem("id") == null) {
		// Insert record
		if (q.value !== "" && a.value !== "" && c.value > 0) {
			db.transaction(insertNote, errorInsert, successInsert);
		} else {
			alert("No value");
		}
	} else {
		// Update record
		if (q.value !== "" && a.value !== "" && c.value > 0) {
			db.transaction(updateNote, errorUpdate, successUpdate);
		} else {
			alert("No value");
		}
	}
});

function updateNote(tx){
	// Update
	var questions = q.value;
	var answers = a.value;
	var category_id = c.value;
	var id = localStorage.getItem("id");
	// Insert query
	tx.executeSql("UPDATE study_guides SET questions = ?, answers = ?, category_id = ? WHERE id  = ?", [questions, answers, category_id, id], function (tx, res) {
		// alert("updated!");
	});
}

function insertNote(tx){
	// Insert
	var questions = q.value;
	var answers = a.value;
	var category_id = c.value;
	// Insert query
	tx.executeSql("INSERT INTO study_guides (questions, answers, category_id) VALUES (?,?,?)",[questions, answers, category_id], function (t, res) {
		tx.executeSql("SELECT * FROM study_guides ORDER BY id DESC LIMIT 1", [], function(tx, result){
			localStorage.setItem("id", result.rows.item(0).id);
		});
	});
}

function errorInsert(err) {
	// alert("Error processing SQL: "+ err.code);
}
function successInsert() {
	// alert("success!");
	viewMode();
} 

function errorUpdate(err) {
	// alert("Error processing SQL: "+ err.code);
}
function successUpdate() {
	// alert("Updated!");
	viewMode();
} 

function viewMode() {
	save.style.display = "none";
	edit.style.display = "block";
	q.disabled = true;
	a.disabled = true;
	c.disabled = true;
}

edit.addEventListener("click", editMode);

reset.addEventListener("click", function () {
	q.value = "";
	a.value = "";
	c.value = "0";
	editMode();
	localStorage.removeItem("id");
});

function editMode() {
	q.disabled = false;
	a.disabled = false;
	c.disabled = false;
	save.style.display = "block";
	edit.style.display = "none";
}

document.getElementById("back").addEventListener("click", function () {
	window.history.back();
});

});