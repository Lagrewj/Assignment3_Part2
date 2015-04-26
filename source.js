//Outline of functions
//Favorites 
  //display
  //add
  //remove
  //clear
  //helper locatedInFavorites
  //not duplicate
//Filter
//GetLanguage
//Display Results
//clear results

//global call to refresh favorites 
//global even handler
window.onload = function()
{
	redisplaymyFavorites();
}
//function to clear favorites
//does so by making string empty 
function clearmyFavorites()
{
	document.getElementById("favoritesList").innerHTML = "";

}
function redisplaymyFavorites()
{
	//clear
	clearmyFavorites();

	//if local storage favorites exists then strings will get called by AJAX to query GitHub
	if (localStorage.getItem("favGists")) 
	{
		var favoriteString = localStorage.getItem("favGists");
		var favoriteList = favoriteString.split(",");
		for(var i =0;i<favoriteList.length;i++)
		{
			oneGist(favoriteList[i]);
		}
	};
}
//remove will check if gistID is in favorites list and loop through
//list by comma again and insert into local storage 
//redisplay favorites
function deleteFromFavList(favoriteID)
{
	
	var gistID = favoriteID.split("fav-")[1];
	if(isInFavList(gistID))
	{
		var newmyFavorites = []
		var myFavorites = localStorage.getItem("favGists");
		var favoriteList = myFavorites.split(",");
		for(i=0;i<favoriteList.length;i++)
		{
			gist = favoriteList[i];
			if(gist != gistID )
			{
				newmyFavorites.push(gist);
			}
		}
		localStorage.setItem("favGists",newmyFavorites.join());
		redisplaymyFavorites();
	}
}
//adding favorites function first check gistID list 
//then if enough storage locally will add to string or add just ID
function addToFavList(gistID)
{
	if (!isInFavList(gistID))
	{
		//checking local storage of favorites
		if (localStorage.getItem("favGists"))
		{
			var myFavorites = localStorage.getItem("favGists");
			myFavorites = myFavorites+","+gistID;
			if(!isInFavList(gistID))
			{
				localStorage.setItem("favGists", myFavorites);

			}
		}
		else
		{
			localStorage.setItem("favGists", gistID);
		}

		//redisplaying new list then will call searchGists
		redisplaymyFavorites();
		searchGists();
	}
}
//this helper function will be used in add and remove favorites list to check to see if its 
//already in favorites list by comparing IDs
function isInFavList(gistID)
{
	//local storage favs
	if (localStorage.getItem("favGists"))
	{
		var myFavorites = localStorage.getItem("favGists");
		var favoriteList = myFavorites.split(",");
		for(i=0;i<favoriteList.length;i++)
		{
			//return true if in list already
			gist = favoriteList[i];
			if(gist == gistID )
			{
				return true
			}
		}
		return false;
	}
	return false;
}
//this will filter the language search results to only show checked languages
//default is set to show all results
function filterGist(gist, pychk, sqlchk, jsonchk, javachk)
{
	//for each language pushing that language on the stack
	var checkedLanguage = []
	if(pychk)
	{
		checkedLanguage.push("python");
	}
	if(sqlchk)
	{
		checkedLanguage.push("sql");
	}

	if(javachk)
	{
		checkedLanguage.push("javascript");
	}
	if(jsonchk)
	{
		checkedLanguage.push("json");
	}

	//default all languages searched
	if (checkedLanguage.length == 0)
	{
		return true;
	}
	var files = gist.files;
	for (var article in files)
	{
		
		var dict = files[article];
		for(var item in dict)
		{
			if(item == "language")
			{
				gist_lang = dict.language;
				for(var i = 0; i<checkedLanguage.length;i++)
				{	
					if(gist_lang != null)
					{	
						if(gist_lang.toLowerCase() == checkedLanguage[i])
						{
							return true;
						}
					}
					
				}
			}
		}

	}
	return false;
}
//will return language if in gist objects
//called in display function
function getLanguage(gist)
{
	//goes through object
	var files = gist.files;
	for (var article in files)
	{
		var dict = files[article];
		for(var item in dict)
		{
			if(item == "language")
			{
				return dict.language;
			}
		}
	}

}

function displayGists(gists)
{	
	//searchResults div
	var main = document.getElementById("searchResults");

	//the 4 requested languages from the checked boxes
	var python = document.getElementById("python").checked;
	var json = document.getElementById("json").checked;
	var javascript = document.getElementById("javascript").checked;
	var sql = document.getElementById("sql").checked;	
	
	//getting description from gist
	//getting ID from gist
	//getting url from gist
	// Create and html string and inject it into the "searchResults"
	for(var i = 0; i<gists.length; i++)
	{
		var objectGist =  JSON.stringify(gists[i]);
		objectGist = gists[i];
		var files = objectGist.files;
		var gistID = objectGist['id'];
		//filter if not in favorites but located in gists filter function
		if (filterGist(objectGist, python,sql,json,javascript) && !isInFavList(gistID))
		{	
			console.log("displaying");
			//creating variables for displaying search results
			var gist_owner = objectGist.owner;
			var gist_created = objectGist.created_at;
			var gist_desc = objectGist.description;
			var gist_repo = objectGist.html_url;
			//ensuring spaces and breaks to display nicely
			var idhtml = "<b>id: </b><a href="+ gist_repo +">" + gistID +"</a><br>";
			var deschtml = "<b>Description: </b>" + gist_desc +"<br>";
			var langhtml = "<b>Language: </b>" + getLanguage(objectGist) +"<br>";
			var buttonClick =  '<button id="'+ gistID +'" onclick="addToFavList(this.id)">Add to Favorites</button>';
			var gisthtml = "<div class='gist-item'>" + idhtml + deschtml +langhtml + buttonClick +"<br></div>";	
			var elem = document.createElement("div");
			elem.id = "div-"+gistID;
			//inner html method
			elem.innerHTML = gisthtml;
			main.appendChild(elem);
		}
	} 
}
//clearing searchresults before rebuild
function clear()
{	
	var mainDiv = document.getElementById("searchResults");
	mainDiv.innerHTML = "";

}
//this function will clear, get search results, get number of pages and request each page
//if not between 1 through 5 will display an error to the user 
function searchGists()
{	
	
	clear();
	var main = document.getElementById("searchResults");
	var numberOfPages = document.getElementById("selectedPages").value;
	var totalGists = [];
	if(numberOfPages >=1 && numberOfPages <=5)
	{
		var header = document.createElement("h2");
		header.innerHTML = "Search Results:<br><br>";
		main.appendChild(header);
		//from 1 to number of pages
		for(i=1; i<=numberOfPages; i++)
		{
			requestGists(i);
		}
	}
	//error to user
	else
	{
		var header = document.createElement("h2");
		header.innerHTML = "Please enter page between 1 and 5.<br><br>";
		main.appendChild(header);
	}
}

//creates AJAX request for id
function oneGist(gistID)
{
	//ajax request
	var ajaxRequest = new XMLHttpRequest();
	//url and id 
	var gisturl = "https://api.github.com/gists/"+gistID;
	//getting url
	ajaxRequest.open('GET',gisturl);
	//send null
	ajaxRequest.send(null);
		ajaxRequest.onreadystatechange = function()
		{
			if(ajaxRequest.readyState == 4)
			{
				if(ajaxRequest.status == 200)
				{
					console.log("good request");
					var response = JSON.parse(ajaxRequest.responseText);
					insertFavorite(response);
					return response;
				}
				else
				{
					console.log("bad request");
				}
			}
		};
}
//inserting favorites 
function insertFavorite(response)
{
		var main = document.getElementById("favoritesList");

		var gistID = response['id'];
		var gist_owner = response.owner;
		var gist_created = response.created_at;
		var gist_desc = response.description;
		var gist_repo = response.html_url;
		var idhtml = "<b>id: </b><a href="+gist_repo+">" + gistID +"</a><br>";
		var deschtml = "<b>Description: </b>" + gist_desc +"<br>";
		var buttonClick =  '<button id="fav-'+gistID+'" onclick="deleteFromFavList(this.id)">Remove Favorite</button>';		
		var gisthtml = "<div class='favorite-item'>" + idhtml + deschtml +buttonClick+"<br></div>";	
		var elem = document.createElement("div");
		elem.id = "div-fav-"+gistID;
		elem.class = "favorite-item";
		elem.innerHTML = gisthtml;
			

		main.appendChild(elem);

}
//AJAX request for gists
function requestGists(page)
{		
		var ajaxRequest = new XMLHttpRequest();
		var gisturl = "https://api.github.com/gists?page="+page;
		console.log(gisturl);
		ajaxRequest.open('GET',gisturl);
		ajaxRequest.send(null);
		ajaxRequest.onreadystatechange = function()
		{
			if(ajaxRequest.readyState == 4)
			{
				if(ajaxRequest.status == 200)
				{
					console.log("good request"  );
					var response = JSON.parse(ajaxRequest.responseText);
					displayGists(response);
					return response;
				}
				else
				{
					console.log("bad request");
				}
			}
		};
}

//resources: 
//1. https://developer.mozilla.org/en-US/
//2. http://www.sanwebe.com/2013/03/ajax-pagination-with-jquery-php
//3. http://www.infotuts.com/ajax-pagination-mysql-php-and-jquery/
//4. http://www.w3schools.com/ajax/
//5. http://www.yourhtmlsource.com/javascript/ajax.html
//6. http://api.jquery.com/jquery.ajax/
//7. http://stackoverflow.com/questions/9154026/jquery-dynamically-load-a-gist-embed

//known errors
//1. had C# results returned 
//2. html returns when js checked
