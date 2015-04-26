var settings = null;

function gistObj(descript, urlLink) {
	this.descript = descript;
	this.urlLink = urlLink;
	
}

var fetchdata = function(){
	
	var req = new XMLHttpRequest();
	if(!req){
		throw 'Unable to create HttpRequest.';
	}
	
	var url = 'https://api.github.com/gists/public';
	
	req.onreadystatechange = function(){ 
		if(this.readyState === 4){
			
      		var gistLog = JSON.parse(this.responseText);

      		for(var i = 0; i < 30; i++) {
      			settings.originalGistList.push(new gistObj(gistLog[i].description, gistLog[i].url));
      		}


      		localStorage.setItem('originalGistList', JSON.stringify(settings));
      		createGistsList(document.getElementById('gist-list'));

		}
	};
	
	req.open('GET', url);
	req.send();
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
	var entry = dlEntry(g.descript, g.urlLink);
	dl.appendChild(entry.dt);
	dl.appendChild(entry.dd);
	return dl;
}

function dlEntry(term, definition) {
	var dt = document.createElement('dt');
	var dd = document.createElement('dd');
	
	dt.innerText = term;
	dd.innerText = definition;
	return {'dt':dt, 'dd':dd};
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

	fetchdata();
} 
