var settings = null;

function gistObj(descript, urlLink, favorite) {
	this.descript = descript;
	this.urlLink = urlLink;
	this.favorite = favorite;
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
      			settings.originalGistList.push(new gistObj(gistLog[i].description, gistLog[i].url, (i+1)));
      		}


      		localStorage.setItem('originalGistList', JSON.stringify(settings));
      		createGistsList(document.getElementById('gist-list'));

		}
	};
	
	req.open('GET', url);
	req.send();
}

function clearData() {
	localStorage.clear('originalGistList');
	location.reload(true);
}

function getPages() {
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

function liGist(g) {
	var dl = document.createElement('dl');
	var entry = dlEntry(g.descript, g.urlLink, g.favorite);
	dl.appendChild(entry.dt);
	dl.appendChild(entry.dd);
	dl.appendChild(entry.button);
	
	/*fbutton.onclick = function(){
	var gistId = this.getAttribute("gistId"); //this is what you have saved before
	var toBeFavoredGist = findById(gistId);
	//here you add the gist to your favorite list in the localStorage and remove it from the gist list and add it to favorite list
	}*/


	

	return dl;
}

function dlEntry(term, definition, favorite) {
	var dt = document.createElement('dt');
	var dd = document.createElement('dd');
	var fbutton = document.createElement("button");
	
	
	dt.innerText = term;
	dd.innerText = definition;
	fbutton.innerHTML = "+";
	fbutton.setAttribute("gistID", favorite);

	return {'dt':dt, 'dd':dd, 'button':fbutton  };
}


window.onload = function() {
	//localStorage.clear('originalGistList');
	
	var settingsStr = localStorage.getItem('originalGistList');
	if( settingsStr === null ) {
		settings = {'originalGistList':[]};
		localStorage.setItem('originalGistList', JSON.stringify(settings));
	}
	else {
		settings = JSON.parse(localStorage.getItem('originalGistList'));
	} 

	
} 


