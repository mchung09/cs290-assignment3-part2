var settings = null;
var settings2 = null;

function GistObj(descript, urlLink, gistId) {
    this.descript = descript;
    this.urlLink = urlLink;
    this.gistId = gistId;
}

function clearData() {
    localStorage.clear();
    location.reload(true);
}

function moveToFavorites(gistId) {
    var i;
    for (i = 0; i < settings.originalGistList.length; i++) {

        if (settings.originalGistList[i].gistId === gistId) {
            settings2.favoriteGistList.push(settings.originalGistList[i]);
            localStorage.setItem('favoriteGistList', JSON.stringify(settings2));
            settings.originalGistList.splice(i, 1);
        }
    }

    createGistsList(document.getElementById('gist-list'));
    createFavGistsList(document.getElementById('favorite-gist-list'));
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

    fbutton.onclick = function () {
        moveToFavorites(gistId);
    }

    return {'dt':dt, 'a':a, 'button':fbutton};
}

function liGist(g) {
    var dl = document.createElement('dl');
    var entry = dlEntry(g.descript, g.urlLink, g.gistId);

    dl.appendChild(entry.dt);
    dl.appendChild(entry.a);
    dl.appendChild(entry.button);

    return dl;
}

function createGistsList(ul) {
    var element = document.getElementById("gist-list");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    settings.originalGistList.forEach(

        function (s) {
            var li = document.createElement('li');
            li.appendChild(liGist(s));
            ul.appendChild(li);
        }
    );
}

function dlFavEntry(term, definition, gistId) {
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
        removeFromFavorites(gistId);
    }

    return {'dt':dt, 'a':a, 'button':fbutton};
}

function liFavGist(g) {
    var dl = document.createElement('dl');
    var entry = dlFavEntry(g.descript, g.urlLink, g.gistId);

    dl.appendChild(entry.dt);
    dl.appendChild(entry.a);
    dl.appendChild(entry.button);

    return dl;
}

function createFavGistsList(ul) {

    var element2 = document.getElementById("favorite-gist-list");
    while (element2.firstChild) {
        element2.removeChild(element2.firstChild);
    }

    settings2.favoriteGistList.forEach(

        function (s) {
            var li = document.createElement('li');
            li.appendChild(liFavGist(s));
            ul.appendChild(li);
        }
    );
}



function removeFromFavorites(gistId) {

    for (var i = 0; i < settings2.favoriteGistList.length; i++) {

        if(settings2.favoriteGistList[i].gistId == gistId) {
            settings.originalGistList.push(settings2.favoriteGistList[i]);
            localStorage.setItem('originalGistList', JSON.stringify(settings));
            settings2.favoriteGistList.splice(i, 1);
        }
    }

    localStorage.setItem('favoriteGistList', JSON.stringify(settings2));
    createGistsList(document.getElementById('gist-list'));
    createFavGistsList(document.getElementById('favorite-gist-list'));
}

var fetchdata = function (x) {
    var req = new XMLHttpRequest();
    if (!req) {
        throw 'Unable to create HttpRequest.';
    }

    var url = 'https://api.github.com/gists/public';

    req.onreadystatechange = function () {
        if (this.readyState === 4) {

            var gistLog = JSON.parse(this.responseText);

            var i;
            for (i = 0; i < x; i++) {
                settings.originalGistList.push(new GistObj(gistLog[i].description, gistLog[i].url, gistLog[i].id));
            }


            localStorage.setItem('originalGistList', JSON.stringify(settings));
            createGistsList(document.getElementById('gist-list'));
        }
    };

    req.open('GET', url);
    req.send();
}

function getPages() {
    localStorage.removeItem('originalGistList');
    /*Empty the array so the next fetch won't pick up the leftovers */
    settings.originalGistList = [];
    //Empty the existing elements - Retrieved from MDN website
    var element = document.getElementById("gist-list");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

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

window.onload = function() {
    localStorage.removeItem('originalGistList');

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

    createFavGistsList(document.getElementById('favorite-gist-list'));
}




