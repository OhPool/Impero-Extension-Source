function get(url) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.setRequestHeader("x-content-check", true);

        req.onload = function () {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error({ error: req.statusText, status: req.status }));
            }
        };

        req.onerror = function () {
            reject(Error({ error: "Network Error", status: 0 }));
        };

        req.send();
    });
}

function redirectToBlock(url, tabID) {
        chrome.tabs.update(parseInt(tabID), { url: getBlockURL() });
}

function getBlockURL() {
    return chrome.extension.getURL("block.html");
}

RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};