/**
*   @author Christian Blach, Ulrik Moe
**/

const maxFeedLength = 19;
const maxTitleLength = 56; // characters

window.onload = function () {
    updateFeed();
    document.getElementById('timeRangeSelect').addEventListener('change', updateFeed);
};

function AJAX(url, payload)
{
    const method = (payload) ? 'POST' : 'GET';
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'document';
    xhr.onload = buildFeed;
    xhr.onerror = function (e) {};
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(payload);
}

function zeroPad(num) {
    return ('0' + num).slice(-2);
}

// Takes the toplist response from amino and parses each thread title and link:

function buildFeed() {
    const feed = document.getElementById('feed');
    const frag = document.createDocumentFragment();
    const html = this.response;

    for (var i = 1; i < maxFeedLength; i++) {
        const e = html.getElementById('ctl00_ctl00_bcr_bcr_TopListThreadsRepeater_ctl' + zeroPad(i) + '_HyperLink2');
        if (!e) { continue; }

        let text = e.text.substring(0, maxTitleLength);
        if (e.text.length > 53) { text += '...'; }

        let li = document.createElement('li');
        let a = document.createElement('a');
        a.href = e.href;
        a.textContent = text;
        a.title = e.text;
        a.classList.add('story');
        li.appendChild(a);
        frag.appendChild(li);
    }
    feed.appendChild(frag);
}

function updateFeed(evt) {
    const time = (evt) ? evt.target.value : 'day';
    const payload = postObj[time];
    AJAX('https://www.amino.dk/forums/Toplister.aspx', payload);
    document.getElementById('feed').innerHTML = '';
}
