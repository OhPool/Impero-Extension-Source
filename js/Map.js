var Map = (function () {
    "use strict";

    var internal = {};

    function Map() {
    }

    Map.prototype.insert = function (key, value) {
        internal[key] = value;
    };

    Map.prototype.value = function (key) {
        if (this.contains(key)) {
            return internal[key];
        }
        return null;
    };

    Map.prototype.remove = function (key) {
        delete internal[key];
    };

    Map.prototype.contains = function (key) {
        return (key in internal);
    };

    //Callback is (key, value) return true to keep iterating
    Map.prototype.iterator = function (itor) {
        Object.keys(internal).forEach(function (key) {
            if (!itor(key, internal[key]))
                return;
        });
    };

    Map.prototype.clear = function () {
        internal = {};
    };

    return Map;
}(Map || {}));