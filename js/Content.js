chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text && (msg.text == "get_content")) {
        sendResponse({ content: document.all[0].outerHTML, tab: msg.tabId });
    } else if (msg.text && (msg.text == "set_content")) {
        console.info("Replacing Page");
        document.write(msg.content);
        document.close();
    }
});

var textToScan_tk7Sc4GOkj = "";
window.addEventListener('pageshow' , function(element){
		AddTextFromElement_tk7Sc4GOkj(document, "***ELEMENT*** > ");
		chrome.runtime.sendMessage({type: "check_content", content: textToScan_tk7Sc4GOkj});
	});

function AddTextFromElement_tk7Sc4GOkj(element, prefix)
{
	if (textToScan_tk7Sc4GOkj.length < 10000000)
	{
		if (textToScan_tk7Sc4GOkj.indexOf(element.innerHTML) < 0)
		{
			textToScan_tk7Sc4GOkj += prefix + element.innerHTML + " ";
			for (child of element.children)
			{
				AddTextFromElement_tk7Sc4GOkj(child, prefix + "> ");
			}
		}
	}
}
