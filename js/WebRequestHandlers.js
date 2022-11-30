function onBeforeRequest(details) {

    if (!comms.isConnected())
        return;

    //Video asking for content or our own XHR's requesting content
    if ( (details.type === 'xmlhttprequest' && details.frameId > 0 ) || details.tabId === -1 ) {
        return;
    }

    //handle redirections
    var currentUrl = details.url;
    var newurl = currentUrl;

    if (extSettings.isUsingGoogleSafeSearch() && isUrlGoogle(currentUrl)) {
        newurl = buildRedirectForGoogle(currentUrl);
    }else if (extSettings.isUsingYoutubeEdu() && isUrlYoutube(currentUrl)) {
        newurl = buildRedirectForYoutube(currentUrl);
    }

    if (newurl !== currentUrl) {
        return { redirectUrl: newurl };
    }
}

chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, {
   urls: ["<all_urls>"], types: ["main_frame", "xmlhttprequest"]
}, ["blocking"]);

chrome.tabs.onUpdated.addListener(function (id, info, tab){
    if (info.url) {
		checkContent(info.url, '', '', id);
	};
});

function isUrlGoogle(url) {
    var reg = /www\.google\..*\/search\?(q=|as_q=|.*\&q=|.*\&as_q=)/i;
    return reg.test(url);
}

function buildRedirectForGoogle(url) {
    if (url.indexOf("safe=active") > -1) {
        return url; 
    }

    url += "&safe=active";
    return url;
}

function isUrlYoutube(url) {
    var reg = new RegExp(".*youtube\.co.*watch.*", "i");
    return reg.test(url);
}

function buildRedirectForYoutube(url) {

    var youTubeID = extSettings.getYouTubeEduID();
    if (url.indexOf(youTubeID) > -1) {
        return url; //ID is already present
    }

    url += "&edufilter=";
    url += youTubeID

    return url;
}

function ignoreContentCheckForAddress(url) {

    var terms = contentController.getWhiteListTerms();

    for (var i = 0, l = terms.length; i < l; ++i) {
        var reg = new RegExp(terms[i], "i");
        if (reg.test(url) === true) {
            console.info('Ignoring content from address: ' + url + ' | Matched (' + terms[i] + ')');
            return true;
        }
    }

    return false;
}