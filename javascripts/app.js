/*
 * JSHint options:
 */
 /*      global utils: true; */
 /*      global navigator: true; */
 /*      global LazyLoad: true; */
"use strict";

var marcel_kernel = (function () {
    // constants
    var appConstants = {
        // javascript source base directory
        jsRoot: 'bright-marcel-kernel/javascripts'
    },
    // can be modified by program in a future release
    appVariables = {
        // code entry point
        main_code: ['private/constants.js', 'private/main-purejs.js'],
        // first libs to load
        beforelibs: ['private/utils.js'],
        // all libs
        libs: ['private/myajax.js', 'private/purejs-lib.js', 'private/jprint.js', 'private/session.js'],
        // library name
        libname: 'pure Javascript 0.2.1',
        // navigator name
        navigator: null
    };
    // normalize library name
    function normalize_libname(libname) {
        return appConstants.jsRoot + '/' + libname;
    }

    return {
        // return only library name
        app_type: function () {
            return appVariables.libname;
        },
        // load all necessary code
        app_loader: function () {
            // TODO : must be elsewhere
            appVariables.navigator = navigator.appName + ' ' + navigator.appCodeName + ' ' + navigator.appVersion;
            // two step loader
            LazyLoad.js(appVariables.beforelibs.map(normalize_libname), function () {
                LazyLoad.js(appVariables.libs.map(normalize_libname), function () {
                    LazyLoad.js(appVariables.main_code.map(normalize_libname), function () {
                    });
                });
            });
        }
    };
})();

// what to do on load
marcel_kernel.app_loader();
