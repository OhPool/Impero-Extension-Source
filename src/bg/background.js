var extSettings = new Settings();
var comms = new ConnectionLayer();
var contentController = new ContentController();
var tabController = new TabController();

extSettings.onRefreshNeeded = function () {
    getSettings();
}

comms.setAutoReconnect(true);
comms.start(30019);

comms.onblock = function (e) {
    contentController.add(e.url, e.replacementHtml, e.tabID);
    setAllDomContent(e.url, e.tabID);
};

comms.onallow = function (e) {
    contentController.remove(e.url);
};

comms.onsettings = function (e) {
    extSettings.setSettings(e);
};

comms.onwhitelist = function (e) {
    contentController.setWhiteListTerms(e.whitelist);
};

comms.onstarted = function (e) {
    getSettings();
    checkAllTabs();
};

comms.onpolicieschanged = function(e) {
    checkAllTabs();
}

tabController.onUpdate = function (change) {
    if (isBlocked(change.url)) {
        contentController.setTabBlocked(change.url, change.tabId);
        redirectToBlock(change.url, change.tabId);
    }
};

tabController.onDeleted = function (tabId) {
    contentController.removeTabBlock(tabId);
};

tabController.getAllTabs();


function checkAllTabs() {
    tabController.iterator(function (key, value) {
        getDomContent(parseInt(key));
        return true;
    });
}

function getSettings() {
    comms.SendSettingsRequest();
}

function checkContent(url, content, contentType = "main_frame", tabID) {
    if (url && url.indexOf('chrome-extension://') > -1)
        return;
    
    if (!comms.SendRequest(url, content, contentType, tabID)) {
        console.error('Comms: connection is not avaliable');
    }
}

function retrievedDomContent(dom) {
    if (dom !== undefined) {
        var tabUrl = tabController.getTabUrl(dom.tab);
        if (tabUrl !== undefined && dom.content !== undefined) {
            checkContent(tabUrl, dom.content, '' , dom.tab);
        }
    }
}

function getDomContent(tabId) {
    chrome.tabs.sendMessage(tabId, { text: "get_content", tabId: tabId },
                       retrievedDomContent);
}

function setDomContent(tabId, content) {
    chrome.tabs.sendMessage(tabId, { text: "set_content", content: content, title: 'Impero Banned' });
}

function setAllDomContent(url, tabID) {
    if (tabID) {
        console.log("Blocking by TabID");
        contentController.setTabBlocked(url, tabID);
        redirectToBlock(url, tabID);
    } else {
        console.log("Blocking by URL");
        tabController.iterator(function (key, value) {
            if( value.url === url) {
                contentController.setTabBlocked(url, key);
                redirectToBlock(url, key);
            }
            return true;
        });
    }
}

function isBlocked(url) {   
    return contentController.isBlocked(url);
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request && (request.type === 'request_content')) {

          //provide the page with block content
          setDomContent(sender.tab.id, contentController.getReplaceContentForTab(sender.tab.id));
      }
	  else if (request && request.type === 'check_content')
	  {
		  if (!ignoreContentCheckForAddress(sender.tab.url))
		  {
			  checkContent(sender.tab.url, request.content, '', sender.tab.id);
		  }
	  }
  });
