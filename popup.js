window.onload = function(){
	var e = document.getElementById("timeRangeSelect");
	
	// Check if an timerange has previously been set:
	chrome.storage.local.get('timeselect',function(result){
		var savedOption = result.timeselect;
		if(savedOption !== undefined){
			for (var i=0; i<e.length; i++){
				if(e.options[i].getAttribute('data-timeselect') === savedOption){
					e.options[i].selected = true;
				}
			}
				
			UpdateFeed(savedOption);
		}
		else{
			UpdateFeed("24_HOUR");
		}
	});
	
	// Detect changes in timerange preferences:
	e.onchange = function(){
		document.getElementById("feed").innerHTML = "";
		var timeString = e.options[e.selectedIndex].getAttribute('data-timeselect');
		chrome.storage.local.set({'timeselect': timeString});
		UpdateFeed(timeString);
	}
}

function GET(url, fn)
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function ()
	{
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{

			fn(xmlhttp.responseText);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

function POST(url, fn, postdata)
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.withCredentials = "true"; // Kun til testing
	xmlhttp.onreadystatechange = function ()
	{
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			fn(xmlhttp.responseText);
		}
	};
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(postdata);

}

function num2String2Dig(num) {
	return ("0" + (num)).slice(-2);
}

function openUrl(url, take_focus) {
  // Only allow http and https URLs.
  if (url.indexOf("http:") != 0 && url.indexOf("https:") != 0) {
    return;
  }
  chrome.tabs.create({url: url, selected: take_focus});
}

// Takes the toplist response from amino and parses each thread title and link:

function processAminoResponse(txt){
	var parser=new DOMParser();
	var htmlDoc=parser.parseFromString(txt, "text/html");
	var feed = document.getElementById("feed");

	for(var i=1;i<21;i++){
		var e =  htmlDoc.getElementById("ctl00_ctl00_bcr_bcr_TopListThreadsRepeater_ctl"+num2String2Dig(i)+"_HyperLink2");
		if( e ){ 
			var row = feed.insertRow(-1);
			var a = document.createElement("a");
			row.appendChild(a);
			
			var textExcerpt = e.text.substring(0,52);
			
			
			if(e.text.length > 53){
				textExcerpt += "...";
			}
			a.innerText = textExcerpt;
			a.title = e.text;
			
			a.href = "http://www.amino.dk/forums/" + e.getAttribute('href', 2);
		}
	}

}


function UpdateFeed(option) {
	if(option === "24_HOUR"){
		POST("http://www.amino.dk/forums/Toplister.aspx",processAminoResponse,POSTSTRING_24H);
	}
	else if(option === "WEEK"){
		GET("http://www.amino.dk/forums/Toplister.aspx",processAminoResponse);
	}
	else if(option === "MONTH"){
		POST("http://www.amino.dk/forums/Toplister.aspx",processAminoResponse,POSTSTRING_MONTH);
	}
}

