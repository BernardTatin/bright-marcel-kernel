/*
 * myajax.js
 *
 * classes for ajax request, using classic Javascript, before version 6
 */
"use strict";

Module('MyAjax', function (m) {
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

	Role('AjaxLoadable', {
		requires: ['urlName', 'on_success', 'on_failure'],
		has: {
			isLoaded: {init: false},
		},
		methods: {
			urlName: function() {
			},
			on_success: function(data) {
			},
			on_failure: function(data) {
			}
		}
	});

	Class('AjaxGetPage', {
		has: {
			url: {is: 'n/a', init: null},
			http_request: {is: 'ro', init: 'GET'},
			request: {is: 'n/a', init: null},
		},
		methods: {
			initialize: function (ajax_loadable) {
				this.url = ajax_loadable.urlName();
				var req = this.prepareRequest();
				req.ajax_loadable = ajax_loadable;
				this.createRequest();
				return this;
			},
			prepareRequest: function() {
				var req = null;
	            if (window.XMLHttpRequest) {
	                req = new XMLHttpRequest();
	            } else {
	                req = new ActiveXObject("Microsoft.XMLHTTP");
	            }
				req.self = this;
				if (req.timeout) {
					req.timeout = 9000;
				}
				this.request = req;
				return req;
			},
			createRequest: function() {
				var req = this.request;
				req.open(this.http_request, this.url, true);
				req.onreadystatechange = function (aEvt) {
					if (this.readyState == AjaxStates.DONE) {
						if (this.status == HttpStatus.OK) {
							this.ajax_loadable.on_success(this.responseText);
						} else {
							// TODO : afficher l'erreur
							this.ajax_loadable.on_failure("<h1>ERREUR " +
								this.status +
								" !!!!</h1><h2>Cette page n'existe pas!</h2><p>Vérifiez l'URL!</p>");
						}
					}
				};
			},
			send: function (data) {
				if (utils.isUndefined(data)) {
					this.request.send(null);
				} else {
					this.request.send(data);
				}
			}
		}
	});

});
