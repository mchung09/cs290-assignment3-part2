var settings = null;
var settings2 = null;

function gistObj(descript, urlLink, gistId) {
	this.descript = descript;
	this.urlLink = urlLink;
	this.gistId = gistId;
}

var fetchdata = function(x){
	
	var req = new XMLHttpRequest();
	if(!req){
		throw 'Unable to create HttpRequest.';
	}
	
	var url = 'https://api.github.com/gists/public';
	
	req.onreadystatechange = function(){ 
		if(this.readyState === 4){
			
      		var gistLog = JSON.parse(this.responseText);

      		for(var i = 0; i < x; i++) {
      			settings.originalGistList.push(new gistObj(gistLog[i].description, gistLog[i].url, gistLog[i].id));
      		}


      		localStorage.setItem('originalGistList', JSON.stringify(settings));
      		createGistsList(document.getElementById('gist-list'));

		}
	};
	
	req.open('GET', url);
	req.send();
}

function clearData() {
	localStorage.clear();
	location.reload(true);
}

function getPages() {

	localStorage.removeItem('originalGistList');

	var numberOfPages = document.getElementsByName('search-value')[0].value;
			
	if (!numberOfPages) {
		alert("Providing Default Pages of 30");
		fetchdata(30);

	}
	else if (numberOfPages <= 0 || numberOfPages > 30) {
		alert("Providing Default Pages of 30");
		fetchdata(30);
	}
	else {
		fetchdata(numberOfPages);
		
	}
	
	
} 

function createGistsList(ul) {

    settings.originalGistList.forEach(

		function(s) {
			var li = document.createElement('li');
			li.appendChild(liGist(s));
			ul.appendChild(li);

		}
	); 
}

function createFavGistsList(ul) {

    settings2.favoriteGistList.forEach(

		function(s) {
			var li = document.createElement('li');
			li.appendChild(liGist(s));
			ul.appendChild(li);

		}
	); 
}


function liGist(g) {
	var dl = document.createElement('dl');
	var entry = dlEntry(g.descript, g.urlLink, g.gistId);
	
	dl.appendChild(entry.dt);
	dl.appendChild(entry.a);
	dl.appendChild(entry.button);
		
	return dl;
}

function dlEntry(term, definition, gistId) {
	var dt = document.createElement('dt');
	var a = document.createElement('a');
	var fbutton = document.createElement("button");
	
	
	dt.textContent = term;
	//I got the link information from Stack Overflow, as I couldn't pass the code
	//by innerHTML for some reason. http://stackoverflow.com/questions/4772774/how-do-i-create-a-link-using-javascript
	var linkText = document.createTextNode(definition);
	a.appendChild(linkText);
	a.href = definition;
	fbutton.innerHTML = "+";
	fbutton.setAttribute("gistID", gistId);

	fbutton.onclick = function(){
	
		moveToFavorites(gistId);


	//var gistId = this.getAttribute("gistId"); //this is what you have saved before
	//var toBeFavoredGist = findById(gistId);
	//here you add the gist to your favorite list in the localStorage and remove it from the gist list and add it to favorite list
	}

	return {'dt':dt, 'a':a, 'button':fbutton};
}

function moveToFavorites(gistId) {

	for (var i = 0; i < settings.originalGistList.length; i++) {

		if(settings.originalGistList[i].gistId == gistId) {
			settings2.favoriteGistList.push(settings.originalGistList[i]);
			localStorage.setItem('favoriteGistList', JSON.stringify(settings2));

		}

	}

	createGistsList(document.getElementById('gist-list'));
	createFavGistsList(document.getElementById('favorite-gist-list'));
}


window.onload = function() {
	localStorage.clear('originalGistList');
	
	var settingsStr = localStorage.getItem('originalGistList');
	if( settingsStr === null ) {
		settings = {'originalGistList':[]};
		localStorage.setItem('originalGistList', JSON.stringify(settings));
	}
	else {
		settings = JSON.parse(localStorage.getItem('originalGistList'));
	} 
	
	var settingsStr2 = localStorage.getItem('favoriteGistList');
	if( settingsStr2 === null ) {
		settings2 = {'favoriteGistList':[]};
		localStorage.setItem('favoriteGistList', JSON.stringify(settings2));
	}
	else {
		settings2 = JSON.parse(localStorage.getItem('favoriteGistList'));
	}
} 




