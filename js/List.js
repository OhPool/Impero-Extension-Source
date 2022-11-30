var List = (function () {
    "use strict";

    var internalList = [];

    function List() {
    }

    List.prototype.add = function (url) {
        if (!this.contains(url)) {
            internalList.push(url);
        }
    };

    List.prototype.remove = function (url) {
        var index;
        while ((index = internalList.indexOf(url)) != -1) {
            internalList.splice(index, 1);
        }
    };

    List.prototype.contains = function (url) {
        return (internalList.indexOf(url) != -1);
    };

    return List;
}(List || {}));