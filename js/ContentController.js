var ContentController = (function () {
    "use strict";

    var blocklist = new Map();
    var blocktab = new Map();
    var whiteListTerms = [];

    function ContentController() {
    }

    ContentController.prototype.add = function (url, replacement) {
        blocklist.insert(url, replacement);
    };

    ContentController.prototype.remove = function (url) {
        blocklist.remove(url);
    };

    ContentController.prototype.isBlocked = function (url) {
        return blocklist.contains(url);
    };

    ContentController.prototype.setTabBlocked = function (url, tabId) {
        if (this.isBlocked(url)) {
            blocktab.insert(tabId, blocklist.value(url));
        }
    };

    ContentController.prototype.removeTabBlock = function (tabId) {
        return blocktab.remove(tabId);
    };

    ContentController.prototype.getReplaceContentForTab = function (tabId) {
        return blocktab.value(tabId);
    };

    ContentController.prototype.setWhiteListTerms = function (whiteList) {
        whiteListTerms = whiteList;
    };

    ContentController.prototype.getWhiteListTerms = function () {
        return whiteListTerms;
    };

    return ContentController;
}(ContentController || {}));