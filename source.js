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

//function is the handler function to be called when the window's load event fires
//Global Event Handler
window.onload = function()
{
	displayFavorites();
}

//clear favorites function will clear all favorites with empty string
function clearFavorites()
{
	//setting html to empty string which will clear the favorites
	//The innerHTML property sets or returns the HTML content (inner HTML) of an element
	document.getElementById("favoritesList").innerHTML = "";

}

function displayFavorites()
{
	//clearing favorites
	clearFavorites();

	//if local storage favorites exists then strings will get called by AJAX to query GitHub 
	if (localStorage.getItem("favorites")) 
	{
		var favorite_string = localStorage.getItem("favorites");
		//splitting by comma
		var favorite_list = favorite_string.split(",");
		//for loop running through favorites list length
		for(var i =0;i<favorite_list.length;i++)			  	
		{
			getGist(favorite_list[i]);
		}
	};
}
//adding favorites function first check gistID list 
//then if enough storage locally will add to string or add just ID
function addFavorite(gistID)
{
	if (!locatedInFavorites(gistID))
	{
		//checking local storage of favorites
		if (localStorage.getItem("favorites"))
		{
			var favorites = localStorage.getItem("favorites");
			favorites = favorites+","+gistID;
			if(!locatedInFavorites(gistID))
			{
				localStorage.setItem("favorites", favorites);

			}
		}
		else
		{
			localStorage.setItem("favorites", gistID);
		}

		// Reconstruct the favorites list and the requested gists
		displayFavorites();
		getGists();
	}
}
//remove will check if gistID is in favorites list and loop through
//list by comma again and insert into local storage 
//redisplay favorites
function removeFavorite(favorite_gistID)
{
	var gistID = favorite_gistID.split("fav-")[1];
	if(locatedInFavorites(gistID))
	{
		var newfavorites = []
		var favorites = localStorage.getItem("favorites");
		var favoriteList = favorites.split(",");
		for(i=0;i<favoriteList.length;i++)
		{
			gist = favoriteList[i];
			if(gist != gistID )
			{
				newfavorites.push(gist);
			}
		}
		localStorage.setItem("favorites",newfavorites.join());
		displayFavorites();
	}
}

//this helper function will be used in add and remove favorites list to check to see if its 
//already in favorites list by comparing IDs
function locatedInFavorites(gistID)
{
	if (localStorage.getItem("favorites"))
	{
		var favorites = localStorage.getItem("favorites");
		var favoriteList = favorites.split(",");
		for(i=0;i<favoriteList.length;i++)
		{
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
function displayGists(gists)
{	//searchResults div 
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
		var gistObject =  JSON.stringify(gists[i]);
		gistObject = gists[i];
		var files = gistObject.files;
		var gistID = gistObject['id'];
	//filter if not in favorites but located in gists filter function 
		if (!inFavorites(gistID) && filterGist(gistObject, python,sql,json,javascript))
		{	
			console.log("displaying");
			var gist_owner = gistObject.owner;
			var gist_created = gistObject.created_at;
			var gist_desc = gistObject.description;
			var gist_repo = gistObject.html_url;
			var id = "<b>id: </b><a href="+gist_repo+">" + gistID +"</a><br>";
			var description = "<b>Description: </b>" + gist_desc +"<br>";
			var language = "<b>Language: </b>" + getLanguage(gistObject) +"<br>";
			//adding favorites button on click
			var button =  '<button id="'+gistID+'" onclick="addFavorite(this.id)">Add to Favorites</button>';
			var gisthtml = "<div class='gist-item'>" + id + description + language + button +"<br></div>";	
			var element = document.creatElement("div");
			element.id = "div-"+gistID;
			element.innerHTML = gisthtml;
			//method to add node to end of list of children 
			main.appendChild(element);
		}
	} 
}
