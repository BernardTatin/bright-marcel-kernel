/*
 * myajax.js
 *
 * classes for ajax request, using classic Javascript, before version 6
 */
/*
 * JSHint options:
 */
 /*      globals utils: false; */
 /*      globals XMLHttpRequest: true; */

"use strict";

var AjaxStates = (function () {
    return {
        IDLE: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    };
})();

var HttpStatus = (function () {
    return {
        OK: 200,
        NOTFOUND: 404
    };
})();

function Ajax (url, http_request) {
    this.url = url;
    this.http_request = http_request;
    this.request = null;
    this.name = 'Ajax';
    return this;
}
Ajax.prototype = {
    createRequest: function() {
        var req = new XMLHttpRequest();
        req.self = this;
        if (req.timeout) {
            req.timeout = 9000;
        }
        req.lastState = AjaxStates.IDLE;
        req.open(this.http_request, this.url, true);
        req.onreadystatechange = function (aEvt) {
            if (this.readyState == AjaxStates.DONE) {
                if (this.status == HttpStatus.OK) {
                    req.self.on_receive(this.responseText);
                } else {
                    req.self.on_failure("<h1>ERREUR!!!!</h1><h2>Cette page n'existe pas!</h2><p>Vérifiez l'URL!</p>");
                }
            }
        };
        this.request = req;
    },
    send: function (data) {
        this.createRequest();
        if (utils.isUndefined(data)) {
            this.request.send(null);
        } else {
            this.request.send(data);
        }
    }
};

function AjaxGet(url) {
    Ajax.call(this, url, 'GET');
}
AjaxGet.prototype = Object.create(Ajax.prototype);

/*
 * AjaxGetPage:
 *      prototype of an Ajax query used to load pages
 */
function AjaxGetPage(page) {
    AjaxGet.call(this, page.fileName());
    this.page = page;
}

AjaxGetPage.prototype = Object.create(AjaxGet.prototype);

AjaxGetPage.prototype.on_receive = function(data) {
    // console.log('AjaxGetPage.prototype.on_receive ' + this.page.getName());
    this.page.on_success(data);
};
AjaxGetPage.prototype.on_failure = function (data) {
    // console.log('AjaxGetPage.prototype.on_failure ' + this.page.getName());
    this.page.on_failure(data);
};
