// window.openDatabase("database-name","version","database description","database size in bytes")
var db = window.openDatabase("dsgdb", "1.0", "dsg database", 1000000); //will create database Dummy_DB or open it


document.addEventListener("deviceready", function () {
	
	if (localStorage.getItem("theme") == "dark") {	document.getElementById("body").classList.toggle("active");
document.getElementById("ul").classList.toggle("active");
document.getElementById("home").classList.toggle("active");
document.getElementById("cog").classList.toggle("active");
	}
	
	var id = localStorage.getItem("cat_id");
	var title = localStorage.getItem("title");
	
	document.getElementById("title").innerHTML = title;
	
	db.transaction(function(transaction) {
		transaction.executeSql("SELECT * FROM study_guides WHERE category_id = ?", [id], function(tx, result){
			var len = result.rows.length;
			for (var i=0; i<len; i++) {
			var q = result.rows.item(i).questions;
			var a = result.rows.item(i).answers;
			var id = result.rows.item(i).id;
			
			// Add ltem
			var list = "<li onclick='editItem(" + id + ")' ontouchstart='touchStart(" + id + ")' ontouchend='touchEnd()' id='" + id + "'><div>" + q + "</div><span>" + a + "</span></li>";
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

}, false);

function editItem(id) {
	localStorage.setItem("id", id);
	window.location = "create.html";
}

var longTouch;
var pressTimer;

function touchStart(id) {
	if (!pressTimer) {
		pressTimer = setTimeout(function longTouch() {
			pressTimer = null;
			window.location.href = "#delModal";
			if (localStorage.getItem("theme") == "dark") {
				document.getElementById(id).style.background = "#2F4F4F";
			} else {
			document.getElementById(id).style.background = "lightgrey";
			}	document.getElementById("delBtn").setAttribute("onclick", `deleteThread(${id})`);
		}, 1000);
	}
}
function touchEnd() {
	if (pressTimer) {
		clearTimeout(pressTimer);
		pressTimer = null;
	}
}

function deleteThread(id) {
	db.transaction(function(transaction) {
		transaction.executeSql("DELETE FROM study_guides WHERE id = ?", [id], function (tx, result) {
			var thread = document.getElementById(id);
			thread.style.transform = "scale(.7)";
			thread.style.opacity = "0";
			setTimeout(function () {
				thread.style.display = "none";
			}, 200);
			window.history.back();
		});
	});
}
document.getElementById("cancelDel").addEventListener("click", function () {
	window.history.back();
	var ul = document.getElementById("ul");
	var li = ul.getElementsByTagName("li");
	for (var i=0; i<li.length; i++) {
		if (localStorage.getItem("theme") == "dark") {
			li[i].style.background = "#333";
		} else {
			li[i].style.background = "#fff";
		}
	}
});

window.addEventListener("popstate", function () {
	delModal.classList.toggle("active");
});

document.getElementById("home").addEventListener("click", function () {
	window.history.go(-2);
});