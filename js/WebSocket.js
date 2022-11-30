var WebsocketConnection = (function(){
    "use strict";

    function WebsocketConnection() { }

    WebsocketConnection.prototype.open = function (port) {
        if (this.webSocket !== undefined) {
            this.webSocket.close();
        }   

        var ws = this.webSocket = new WebSocket("ws://localhost:" + port),
            self = this;

        ws.onmessage = function (e) {
            if (typeof self.ondatareceived === "function") {
                self.ondatareceived({ data: e.data });
            }
        };

        ws.onclose = function(e) {
            if(typeof self.onclose === "function") {
                self.onclose(e);
            }
        };

        ws.onopen = function(e) {
            if(typeof self.onopen === "function") {
                self.onopen(e);
            }
        };

        ws.onerror = function(e) {
            if(typeof self.onerror === "function") {
                self.onerror(e);
            }
        };
    };

    WebsocketConnection.prototype.close = function() {
        this.webSocket.close();
    };

    WebsocketConnection.prototype.send = function (message) {
        this.webSocket.send(message);
    };

    return WebsocketConnection;
}(WebsocketConnection || {}));
