//Outline of functions
//Favorites 
  //display
  //add
  //remove
  //clear
  //not duplicate
//Filter
//GetLanguage
//Display Results
//clear results

function displayGists(gists)
{	//searchResults div 
	var main = document.getelemententById("searchResults");

	//the 4 requested languages from the checked boxes
	var python = document.getelemententById("python").checked;
	var json = document.getelemententById("json").checked;
	var javascript = document.getelemententById("javascript").checked;
	var sql = document.getelemententById("sql").checked;	
	
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
			var element = document.createelementent("div");
			element.id = "div-"+gistID;
			element.innerHTML = gisthtml;
			//method to add node to end of list of children 
			main.appendChild(element);
		}
	} 
}
