// window.openDatabase("database-name","version","database description","database size in bytes")
var db = window.openDatabase("dsgdb", "1.0", "dsg database", 1000000); //will create database Dummy_DB or open it


document.addEventListener("deviceready", function () {
	
	if (localStorage.getItem("theme") == "dark") {	document.getElementById("body").classList.toggle("active");
document.getElementById("ul").classList.toggle("active");
document.getElementById("home").classList.toggle("active");
document.getElementById("cog").classList.toggle("active");
	}
	
	// Create Table
db.transaction(function (tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS category(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL)');
}, function (err) {
		// alert("Error on creating table: "+-err.code);
}, function () {
		// alert("Success on creating Table!");
});
	
	fetchData();
}, false);

function fetchData() {
	db.transaction(function(transaction) {
		transaction.executeSql("SELECT * FROM category", [], function(tx, result){
			var len = result.rows.length;
			for (var i=0; i<len; i++) {
			var name = result.rows.item(i).name;
			var id = result.rows.item(i).id;
			
			// Add ltem
			var list = "<li onclick='categoryItems(" + id + ")' ontouchstart='touchStart(" + id + ")' ontouchend='touchEnd()' id='" + id + "'>" + name + "</li>";
			var ul = document.getElementById("ul");
			ul.innerHTML += list;
			}
		
	}, function (err) {
		// alert("Error here: "+err.code);
	});
}, function (err) {
	// alert("Error2: "+err.code);
}, function () {
	// alert("Success!");
});
}

function categoryItems(id) {
	localStorage.setItem("cat_id", id);
	var txt = document.getElementById(id).textContent;
	localStorage.setItem("title", txt);
	window.location = "category-items.html";
}

var addModal = document.getElementById("addModal");
var editModal = document.getElementById("editModal");
var renameModal = document.getElementById("renameModal");
var longTouch;
var pressTimer;

function touchStart(id) {
	if (!pressTimer) {
		pressTimer = setTimeout(function longTouch() {
			pressTimer = null;
			window.location = "#editModal";
			editModal.classList.add("active");
			var txt = document.getElementById(id).textContent;
			document.getElementById("modalTitle").innerHTML = txt;
			document.getElementById("renameInput").value = txt;
			
			localStorage.setItem("cat_id", id);
		}, 1000);
	}
}
function touchEnd() {
	if (pressTimer) {
		clearTimeout(pressTimer);
		pressTimer = null;
	}
}

document.getElementById("add").addEventListener("click", function () {
	window.location = "#addModal";
	document.getElementById("category").value = "";
	addModal.classList.add("active");
});

document.getElementById("rename").addEventListener("click", function () {
	addModal.classList.remove("active");
	window.location = "#renameModal";
	renameModal.classList.add("active");
});

document.getElementById("delete").addEventListener("click", function () {
	addModal.classList.remove("active");
	window.location = "#delModal";
	delModal.classList.add("active");
});

window.addEventListener("popstate", function () {
	addModal.classList.remove("active");
	editModal.classList.remove("active");
	renameModal.classList.remove("active");
	delModal.classList.remove("active");
});

document.getElementById("cancel").addEventListener("click", function () {
	window.history.back();
});

function back() {
	window.history.go(-2);
}

// Inserting Data
document.getElementById("save").addEventListener("click", function () {
	var name = document.getElementById("category").value;
	
	if (name !== "") {
	
	db.transaction(function (tx) {
	tx.executeSql("INSERT INTO category (name) VALUES (?)",[name], function (tx, res) {
		document.getElementById("category").value = "";
		window.history.back();
		location.reload();
		});
	});
	} else {
		alert("No Value");
	}
});

document.getElementById("saveName").addEventListener("click", function () {
	var id = localStorage.getItem("cat_id");
	var name = document.getElementById("renameInput").value;
	
	if (name !== "") {
	db.transaction(function (tx) {
		tx.executeSql("UPDATE category SET name = ? WHERE id  = ?", [name, id], function (tx, res) {
			// alert("updated!");
			window.history.go(-2);
			location.reload();
		});
	});
	} else {
		alert("No value");
	}
});

document.getElementById("delBtn").addEventListener("click", function () {
	db.transaction(function(transaction) {
		var id = localStorage.getItem("cat_id");
		transaction.executeSql("SELECT * FROM study_guides WHERE category_id = ?", [id], function(tx, result){
			if (result.rows.length == 0) {
				transaction.executeSql("DELETE FROM category WHERE id = ?", [id], function (tx, result) {
			var thread = document.getElementById(id);
			thread.style.transform = "scale(.7)";
			thread.style.opacity = "0";
			setTimeout(function () {
				thread.style.display = "none";
			}, 200);
			window.history.go(-2);
			location.reload();
		});
			} else {
				alert("This category is not empty");
			}
		});
	});
});

document.getElementById("home").addEventListener("click", function () {
	window.history.back();
});