var Settings = (function () {
    "use strict";

    var useGoogleSafeSearch,
        useYoutubeEdu,
        youTubeEduID;

    var self;

    function Settings() {
        self = this;
        refreshSettings();
    }

    Settings.prototype.isUsingGoogleSafeSearch = function () {
        return useGoogleSafeSearch;
    };

    Settings.prototype.isUsingYoutubeEdu = function () {
        return useYoutubeEdu;
    };

    Settings.prototype.getYouTubeEduID = function () {
        if (useYoutubeEdu) {
            return youTubeEduID;
        }

        return null;
    };

    Settings.prototype.setSettings = function (settings) {
        useGoogleSafeSearch = settings.useGoogleSafeSearch;
        useYoutubeEdu = settings.useYoutubeEdu;
        if (useYoutubeEdu === true) {
            youTubeEduID = settings.youTubeEduID;
        }
        else {
            youTubeEduID = '';
        }
    };

    function refreshSettings() {
        if (typeof self.onRefreshNeeded === "function") {
            self.onRefreshNeeded();
        }

        setTimeout(function () {
            refreshSettings();
        }, 60000);
    }

    return Settings;
}(Settings || {}));