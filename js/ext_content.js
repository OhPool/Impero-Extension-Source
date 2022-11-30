chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text && (msg.text == "get_content")) {
        sendResponse({ content: document.all[0].outerHTML, tab: msg.tabId });
    } else if (msg.text && (msg.text == "set_content")) {    
        if (msg.content !== null) {
            console.info("Replacing Page");
            document.write(msg.content);
            document.close();
        } else {
            console.info("No content found to replace page");
        }
    }
});

function sendMessage(message) {
    chrome.runtime.sendMessage(message);
}

window.onload = function () {
    sendMessage({ type: 'request_content' });
}
