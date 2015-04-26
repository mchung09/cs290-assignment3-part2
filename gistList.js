
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
			var originalGistList = [];
      		var gistLog = JSON.parse(this.responseText);

      		for(var i = 0; i < 30; i++) {
      			originalGistList.push(new gistObj(gistLog[i].description, gistLog[i].url));
      			
      		}


		}
	};
	
	req.open('GET', url);
	req.send();
}



window.onload = function() {
	/*var settingsStr = localStorage.getItem('userSettings');
	if( settingsStr === null ) {
		settings = {'sports':[]};
		localStorage.setItem('userSettings', JSON.stringify(settings));
	}
	else {
		settings = JSON.parse(localStorage.getItem('userSettings'));
	} */

	fetchdata();
} 
