window.addEventListener("popstate", function () {
document.getElementById("m").classList.toggle("active");
});

// window.openDatabase("database-name","version","database description","database size in bytes")
var db = window.openDatabase("dsgdb", "1.0", "dsg database", 1000000); //will create database Dummy_DB or open it

if (localStorage.getItem("theme") == "dark") {
	document.getElementById("body").classList.toggle("active");
document.getElementById("search").classList.toggle("active");
document.getElementById("gg-search").classList.toggle("active");
document.getElementById("logo").classList.toggle("active");
document.getElementById("res").classList.toggle("active");
document.getElementById("cog").classList.toggle("active");
}


document.addEventListener("deviceready", function () {
	document.getElementById("search").value = "";
	db.transaction(function(transaction) {
		transaction.executeSql("SELECT * FROM study_guides", [], function(tx, result){
			if (result == null) {
				// alert("null");
			} else {
				// alert("not null");
			}
			var len = result.rows.length;
			for (var i=0; i<len; i++){
			var q = result.rows.item(i).questions;
			var a = result.rows.item(i).answers;
			var c = result.rows.item(i).category_id;
			var id = result.rows.item(i).id;
			
			// Add ltem
			var list = "<li onclick='view(" + id + ")'  ontouchstart='touchStart(" + id + ")' ontouchend='touchEnd()' id='" + id + "'><div>" + q + "</div><span>" + a + "</span></li>";
			var res = document.getElementById("res");
			res.innerHTML += list;

		}
	}, function (err) {
		// alert("Error: "+err.code);
	});
}, function (err) {
	// alert("Error2: "+err.code);
}, function () {
	// alert("Success!");
});

});

function view(id) {
	localStorage.setItem("id", id);
	window.location = "create.html";
}

var longTouch;
var pressTimer;

function touchStart(id) {
	if (!pressTimer) {
		pressTimer = setTimeout(function longTouch() {
			pressTimer = null;
			window.location.href = "#m";
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


var searchCon = document.getElementById("search-container");
var search = document.getElementById("search");
var catBtn = document.getElementById("category-btn");
var add = document.getElementById("add");
var res = document.getElementById("res");
var results = res.getElementsByTagName("li");

search.addEventListener("focus", function () {
	searchCon.style.marginTop = "0";
	add.style.transitionDelay = "";
	catBtn.style.display = "none";
	add.style.transform = "scale(0)";
});
search.addEventListener("keyup", function () {
	var filter = search.value.toUpperCase();
	
	if (filter !== "") {
		res.style.display = "block";
	} else {
		res.style.display = "none";
	}
	
	for (var i=0;i<results.length;i++) {
		var div = results[i].getElementsByTagName("div")[0];
		var divTxt = div.textContent.toUpperCase();
		if (divTxt.indexOf(filter) > -1) {
			results[i].style.display = "block";
		} else {
			results[i].style.display = "none";
		}
	}
});
search.addEventListener("blur", function () {
	if (search.value == "") {
		searchCon.style.marginTop = "7rem";
		add.style.transitionDelay = ".2s";
		catBtn.style.display = "block";
		add.style.transform = "scale(1)";
	}
});

add.addEventListener("click", function () {
	if (localStorage.getItem("id") !== null) {
		localStorage.removeItem("id");
	}
})


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
	var ul = document.getElementById("res");
	var li = ul.getElementsByTagName("li");
	
	for (var i=0; i<li.length; i++) {
		if (localStorage.getItem("theme") == "dark") {
			li[i].style.background = "#333";
		} else {
			li[i].style.background = "#fff";
		}
	}
});