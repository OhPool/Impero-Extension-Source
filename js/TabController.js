var TabController = (function () {
    "use strict";

    var tabs = {};
    var self;

    function TabController() {
        self = this;

        function onCreated(tab) {
            tabs[tab.id] = tab;
            console.log('Creating Tab: ' + tab.id + ', Url: ' + tab.url);
            if (typeof self.onCreated === "function") {
                self.onCreated(tab);
            }
        }

        function onUpdated(tabId, changeInfo, tab) {
            tabs[tab.id] = tab;
            console.log('Updating Tab: ' + tabId + ', Url:' + changeInfo.url + ', Status: ' + changeInfo.status);
            if (typeof self.onUpdate === "function") {
                self.onUpdate({ url: changeInfo.url, tabId: tabId, status: changeInfo.status });
            }
        }

        function onRemoved(tabId) {
            delete tabs[tabId];
            console.log('Deleting Tab: ' + tabId);
            if (typeof self.onDelete === "function") {
                self.onDelete(tab.id);
            }
        }

        function onReplaceComplete(tab) {
            tabs[tab.id] = tab;
            if (typeof self.onUpdate === "function") {
                self.onUpdate({ url: tab.url, tabId: tab.id, status: 'replaced' });
            }
        }

        function onReplaced(addedTabId, removedTabId) {
            onRemoved(removedTabId);
            chrome.tabs.get(addedTabId, onReplaceComplete);
            console.log('Replacing Tab: ' + removedTabId + ' with: ' + addedTabId);
        }

        chrome.tabs.onCreated.addListener(onCreated);
        chrome.tabs.onUpdated.addListener(onUpdated);
        chrome.tabs.onRemoved.addListener(onRemoved);
        chrome.tabs.onReplaced.addListener(onReplaced);
    }

    //Callback is (key, value) return true to keep iterating
    TabController.prototype.iterator = function (itor) {
        Object.keys(tabs).forEach(function (key) {
            if (!itor(key, tabs[key]))
                return;
        });
    };

    TabController.prototype.getAllTabs = function () {
        chrome.tabs.query({}, function (results) {
            results.forEach(function (tab) {
                tabs[tab.id] = tab;

                //init scripts, we could have active tabs already
                if (tab.url.indexOf('http') != -1)
                    chrome.tabs.executeScript(tab.id, { file: 'js/content.js' });
            });

            if (typeof self.onIntialised === "function") {
                self.onIntialised();
            }

        });
    };

    TabController.prototype.getTabUrl = function (tabId) {
        var ret;
        Object.keys(tabs).forEach(function (key) {
            if (tabs[key].id === tabId) {
                ret = tabs[key].url;
                return;
            }
        });

        return ret;
    };

    TabController.prototype.getTabID = function (url) {
        var ret;
        Object.keys(tabs).forEach(function (key) {
            if (tabs[key].url === url) {
                ret = tabs[key].id;
                return;
            }
        });

        return ret;
    };

    TabController.prototype.getTabIDsForUrl = function (url) {
        var tabids = [];
        Object.keys(tabs).forEach(function (key) {
            if (tabs[key].url === url) {
                tabids.push(tabs[key].id);
            }
        });
        return tabids;
    };

    return TabController;
}(TabController || {}));