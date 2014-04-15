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

function openLink(){
	openUrl(this.href, true/*(localStorage['HN.BackgroundTabs'] == 'false')*/);
}

function UpdateFeed() {
 GET("http://www.amino.dk/forums/Toplister.aspx",
 function(txt){
	var parser=new DOMParser();
	var htmlDoc=parser.parseFromString(txt, "text/html");
	var feed = document.getElementById("feed");

	for(var i=1;i<21;i++){
		var e =  htmlDoc.getElementById("ctl00_ctl00_bcr_bcr_TopListThreadsRepeater_ctl"+num2String2Dig(i)+"_HyperLink2");
		if( e ){ 
			var row = feed.insertRow(-1);
			var a = document.createElement("a");
			row.appendChild(a);
			a.innerHTML = ""+ i + ": " + e.innerHTML;
			a.href = "http://www.amino.dk/forums/" + e.getAttribute('href', 2);
			a.addEventListener("click", openLink);
		}
	}


//	alert(txtstr);
 });
}

UpdateFeed();