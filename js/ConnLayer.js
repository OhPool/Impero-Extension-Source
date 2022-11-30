var ConnectionLayer = (function (WebsocketConnection) {
    "use strict";

    var wsc = new WebsocketConnection();
    var connected = false,
     autoReconnect = false,
     defaultPort = 80;

    function ConnectionLayer() {
        var self = this;

        wsc.onopen = function (e) {
            connected = true;
            console.info('WS Connected', e);
            if (typeof self.onstarted === "function") {
                self.onstarted(e);
            }
        };

        wsc.onclose = function (e) {
            connected = false;
            console.info('WS Closed', e);
            if (typeof self.onstopped === "function") {
                self.onstopped(e);
            }

            if (self.isAutoReconnect()) {
                setTimeout(function () {
                    self.restart();
                }, 5000);
            }

        };

        wsc.onerror = function (e) {
            console.info('WS Error', e);
            if (typeof self.onerror === "function") {
                self.onerror(e);
            }
        };

        wsc.ondatareceived = function (e) {       

            var response = JSON.parse(e.data);
            if (response.type === 'check-response') {
                var content = response.content;
                if (content.block === true) {
                    console.info('WS Reply: Block', content);
                    if (typeof self.onblock === "function") {
                        self.onblock({ replacementHtml: content.replaceHtml, url: content.sourceUrl, tabID: content.tabID });
                    }
                }
                else {
                    console.info('WS Reply: Allow', content);
                    if (typeof self.onallow === "function") {
                        self.onallow({ url: content.sourceUrl });
                    }
                }
            } else if (response.type === 'settings-response') {
                var content = response.content;
                console.info('WS Reply: Settings', content);
                if (typeof self.onsettings === "function") {
                    self.onsettings(content);
                }
            } else if (response.type === 'whitelist-response') {
                var content = response.content;
                console.info('WS Reply: Whitelist', content);
                if (typeof self.onwhitelist === "function") {
                    self.onwhitelist(content);
                }
            } else if (response.type === 'policies-changed') {
                if (typeof self.onpolicieschanged === "function") {
                    self.onpolicieschanged(e);
                }
            }
        };
    }

    ConnectionLayer.prototype.start = function (port) {
        console.info('WS Connecting:', port);
        defaultPort = port;
        wsc.open(port);
    };

    ConnectionLayer.prototype.restart = function () {
        console.info('WS Connecting:', defaultPort);
        wsc.open(defaultPort);
    };

    ConnectionLayer.prototype.stop = function () {
        wsc.close();
    };

    ConnectionLayer.prototype.setAutoReconnect = function (autoConn) {
        autoReconnect = autoConn;
    };

    ConnectionLayer.prototype.isAutoReconnect = function () {
        return autoReconnect;
    };

    ConnectionLayer.prototype.isConnected = function () {
        return connected;
    };

    ConnectionLayer.prototype.SendRequest = function (url, content, contentType, tabID) { 
        var request = new Request('check-content', new CheckRequest(url, JSON.stringify(content), 'google-chrome', contentType, tabID.toString() ));
        return this.SendMessage(request);
    };

    ConnectionLayer.prototype.SendSettingsRequest = function () {
        var request = new Request('get-settings', null);
        return this.SendMessage(request);
    };

    ConnectionLayer.prototype.SendWhitelistRequest = function () {
        var request = new Request('get-whitelist', null);
        return this.SendMessage(request);
    };

    ConnectionLayer.prototype.SendMessage = function (request) {
        if (connected) {
            console.info('WS Sending:', request);
            wsc.send(new Blob([JSON.stringify(request)]));
            return true;
        }

        return false;
    };

    return ConnectionLayer;
}(WebsocketConnection || {}));

/* Messages */
function Request(type, content) {
    this.type = type;
    this.content = content;
}

function CheckRequest(url, content, origin, contentType, tabID) {
    this.url = url;
    this.content = content;
    this.origin = origin;
    this.contentType = contentType;
	this.tabID = tabID;
}
