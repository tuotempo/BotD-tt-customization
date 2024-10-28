/**
 * Fingerprint BotD v1.9.1-tuotempo.1 - Copyright (c) FingerprintJS, Inc, 2024 (https://fingerprint.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

import { __extends, __awaiter, __generator, __spreadArray } from 'tslib';

var version = "1.9.1-tuotempo.1";

/**
 * Enum for types of bots.
 * Specific types of bots come first, followed by automation technologies.
 *
 * @readonly
 * @enum {string}
 */
var BotKind = {
    // Object is used instead of Typescript enum to avoid emitting IIFE which might be affected by further tree-shaking.
    // See example of compiled enums https://stackoverflow.com/q/47363996)
    Awesomium: 'awesomium',
    Cef: 'cef',
    CefSharp: 'cefsharp',
    CoachJS: 'coachjs',
    Electron: 'electron',
    FMiner: 'fminer',
    Geb: 'geb',
    NightmareJS: 'nightmarejs',
    Phantomas: 'phantomas',
    PhantomJS: 'phantomjs',
    Rhino: 'rhino',
    Selenium: 'selenium',
    Sequentum: 'sequentum',
    SlimerJS: 'slimerjs',
    WebDriverIO: 'webdriverio',
    WebDriver: 'webdriver',
    HeadlessChrome: 'headless_chrome',
    Unknown: 'unknown',
};
/**
 * Bot detection error.
 */
var BotdError = /** @class */ (function (_super) {
    __extends(BotdError, _super);
    /**
     * Creates a new BotdError.
     *
     * @class
     */
    function BotdError(state, message) {
        var _this = _super.call(this, message) || this;
        _this.state = state;
        _this.name = 'BotdError';
        Object.setPrototypeOf(_this, BotdError.prototype);
        return _this;
    }
    return BotdError;
}(Error));

function detect(components, detectors) {
    var detections = {};
    var finalDetection = {
        bot: false,
    };
    for (var detectorName in detectors) {
        var detector = detectors[detectorName];
        var detectorRes = detector(components);
        var detection = { bot: false };
        if (typeof detectorRes === 'string') {
            detection = { bot: true, botKind: detectorRes };
        }
        else if (detectorRes) {
            detection = { bot: true, botKind: BotKind.Unknown };
        }
        detections[detectorName] = detection;
        if (detection.bot) {
            finalDetection = detection;
        }
    }
    return [detections, finalDetection];
}
function collect(sources) {
    return __awaiter(this, void 0, void 0, function () {
        var components, sourcesKeys;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    components = {};
                    sourcesKeys = Object.keys(sources);
                    return [4 /*yield*/, Promise.all(sourcesKeys.map(function (sourceKey) { return __awaiter(_this, void 0, void 0, function () {
                            var res, _a, _b, error_1;
                            var _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        res = sources[sourceKey];
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 3, , 4]);
                                        _a = components;
                                        _b = sourceKey;
                                        _c = {};
                                        return [4 /*yield*/, res()];
                                    case 2:
                                        _a[_b] = (_c.value = _d.sent(),
                                            _c.state = 0 /* State.Success */,
                                            _c);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _d.sent();
                                        if (error_1 instanceof BotdError) {
                                            components[sourceKey] = {
                                                state: error_1.state,
                                                error: "".concat(error_1.name, ": ").concat(error_1.message),
                                            };
                                        }
                                        else {
                                            components[sourceKey] = {
                                                state: -3 /* State.UnexpectedBehaviour */,
                                                error: error_1 instanceof Error ? "".concat(error_1.name, ": ").concat(error_1.message) : String(error_1),
                                            };
                                        }
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, components];
            }
        });
    });
}

function detectAppVersion(_a) {
    var appVersion = _a.appVersion;
    if (appVersion.state !== 0 /* State.Success */)
        return false;
    if (/headless/i.test(appVersion.value))
        return BotKind.HeadlessChrome;
    if (/electron/i.test(appVersion.value))
        return BotKind.Electron;
    if (/slimerjs/i.test(appVersion.value))
        return BotKind.SlimerJS;
}

function arrayIncludes(arr, value) {
    return arr.indexOf(value) !== -1;
}
function strIncludes(str, value) {
    return str.indexOf(value) !== -1;
}
function arrayFind(array, callback) {
    if ('find' in array)
        return array.find(callback);
    for (var i = 0; i < array.length; i++) {
        if (callback(array[i], i, array))
            return array[i];
    }
    return undefined;
}

function getObjectProps(obj) {
    return Object.getOwnPropertyNames(obj);
}
function includes(arr) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    var _loop_1 = function (key) {
        if (typeof key === 'string') {
            if (arrayIncludes(arr, key))
                return { value: true };
        }
        else {
            var match = arrayFind(arr, function (value) { return key.test(value); });
            if (match != null)
                return { value: true };
        }
    };
    for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
        var key = keys_1[_a];
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
function countTruthy(values) {
    return values.reduce(function (sum, value) { return sum + (value ? 1 : 0); }, 0);
}

function detectDocumentAttributes(_a) {
    var documentElementKeys = _a.documentElementKeys;
    if (documentElementKeys.state !== 0 /* State.Success */)
        return false;
    if (includes(documentElementKeys.value, 'selenium', 'webdriver', 'driver')) {
        return BotKind.Selenium;
    }
}

function detectErrorTrace(_a) {
    var errorTrace = _a.errorTrace;
    if (errorTrace.state !== 0 /* State.Success */)
        return false;
    if (/PhantomJS/i.test(errorTrace.value))
        return BotKind.PhantomJS;
}

function detectEvalLengthInconsistency(_a) {
    var evalLength = _a.evalLength, browserKind = _a.browserKind, browserEngineKind = _a.browserEngineKind;
    if (evalLength.state !== 0 /* State.Success */ ||
        browserKind.state !== 0 /* State.Success */ ||
        browserEngineKind.state !== 0 /* State.Success */)
        return;
    var length = evalLength.value;
    if (browserEngineKind.value === "unknown" /* BrowserEngineKind.Unknown */)
        return false;
    return ((length === 37 && !arrayIncludes(["webkit" /* BrowserEngineKind.Webkit */, "gecko" /* BrowserEngineKind.Gecko */], browserEngineKind.value)) ||
        (length === 39 && !arrayIncludes(["internet_explorer" /* BrowserKind.IE */], browserKind.value)) ||
        (length === 33 && !arrayIncludes(["chromium" /* BrowserEngineKind.Chromium */], browserEngineKind.value)));
}

function detectFunctionBind(_a) {
    var functionBind = _a.functionBind;
    if (functionBind.state === -2 /* State.NotFunction */)
        return BotKind.PhantomJS;
}

function detectLanguagesLengthInconsistency(_a) {
    var languages = _a.languages;
    if (languages.state === 0 /* State.Success */ && languages.value.length === 0) {
        return BotKind.HeadlessChrome;
    }
}

function detectMimeTypesConsistent(_a) {
    var mimeTypesConsistent = _a.mimeTypesConsistent;
    if (mimeTypesConsistent.state === 0 /* State.Success */ && !mimeTypesConsistent.value) {
        return BotKind.Unknown;
    }
}

function detectNotificationPermissions(_a) {
    var notificationPermissions = _a.notificationPermissions, browserKind = _a.browserKind, android = _a.android, userAgent = _a.userAgent;
    if (userAgent.state === 0 /* State.Success */ && android.state === 0 /* State.Success */) {
        var samsungBrowserUserAgant = userAgent.value.indexOf("SamsungBrowser") !== -1;
        if (android.value === true && samsungBrowserUserAgant) {
            return false;
        }
    }
    if (browserKind.state !== 0 /* State.Success */ || browserKind.value !== "chrome" /* BrowserKind.Chrome */)
        return false;
    if (notificationPermissions.state === 0 /* State.Success */ && notificationPermissions.value) {
        return BotKind.HeadlessChrome;
    }
}

function detectPluginsArray(_a) {
    var pluginsArray = _a.pluginsArray;
    if (pluginsArray.state === 0 /* State.Success */ && !pluginsArray.value)
        return BotKind.HeadlessChrome;
}

function detectPluginsLengthInconsistency(_a) {
    var pluginsLength = _a.pluginsLength, android = _a.android, browserKind = _a.browserKind, browserEngineKind = _a.browserEngineKind;
    if (pluginsLength.state !== 0 /* State.Success */ ||
        android.state !== 0 /* State.Success */ ||
        browserKind.state !== 0 /* State.Success */ ||
        browserEngineKind.state !== 0 /* State.Success */)
        return;
    if (browserKind.value !== "chrome" /* BrowserKind.Chrome */ ||
        android.value ||
        browserEngineKind.value !== "chromium" /* BrowserEngineKind.Chromium */)
        return;
    if (pluginsLength.value === 0)
        return BotKind.HeadlessChrome;
}

function detectProcess(_a) {
    var _b;
    var process = _a.process;
    if (process.state !== 0 /* State.Success */)
        return false;
    if (process.value.type === 'renderer' || ((_b = process.value.versions) === null || _b === void 0 ? void 0 : _b.electron) != null)
        return BotKind.Electron;
}

function detectProductSub(_a) {
    var productSub = _a.productSub, browserKind = _a.browserKind;
    if (productSub.state !== 0 /* State.Success */ || browserKind.state !== 0 /* State.Success */)
        return false;
    if ((browserKind.value === "chrome" /* BrowserKind.Chrome */ ||
        browserKind.value === "safari" /* BrowserKind.Safari */ ||
        browserKind.value === "opera" /* BrowserKind.Opera */ ||
        browserKind.value === "wechat" /* BrowserKind.WeChat */) &&
        productSub.value !== '20030107')
        return BotKind.Unknown;
}

function detectUserAgent(_a) {
    var userAgent = _a.userAgent;
    if (userAgent.state !== 0 /* State.Success */)
        return false;
    if (/PhantomJS/i.test(userAgent.value))
        return BotKind.PhantomJS;
    if (/Headless/i.test(userAgent.value))
        return BotKind.HeadlessChrome;
    if (/Electron/i.test(userAgent.value))
        return BotKind.Electron;
    if (/slimerjs/i.test(userAgent.value))
        return BotKind.SlimerJS;
}

function detectWebDriver(_a) {
    var webDriver = _a.webDriver;
    if (webDriver.state === 0 /* State.Success */ && webDriver.value)
        return BotKind.HeadlessChrome;
}

function detectWebGL(_a) {
    var webGL = _a.webGL;
    if (webGL.state === 0 /* State.Success */) {
        var _b = webGL.value, vendor = _b.vendor, renderer = _b.renderer;
        if (vendor == 'Brian Paul' && renderer == 'Mesa OffScreen') {
            return BotKind.HeadlessChrome;
        }
    }
}

function detectWindowExternal(_a) {
    var windowExternal = _a.windowExternal;
    if (windowExternal.state !== 0 /* State.Success */)
        return false;
    if (/Sequentum/i.test(windowExternal.value))
        return BotKind.Sequentum;
}

function detectWindowSize(_a) {
    var windowSize = _a.windowSize, documentFocus = _a.documentFocus;
    if (windowSize.state !== 0 /* State.Success */ || documentFocus.state !== 0 /* State.Success */)
        return false;
    var _b = windowSize.value, outerWidth = _b.outerWidth, outerHeight = _b.outerHeight;
    // When a page is opened in a new tab without focusing it right away, the window outer size is 0x0
    if (!documentFocus.value)
        return;
    if (outerWidth === 0 && outerHeight === 0)
        return BotKind.HeadlessChrome;
}

function detectDistinctiveProperties(_a) {
    var distinctiveProps = _a.distinctiveProps;
    if (distinctiveProps.state !== 0 /* State.Success */)
        return false;
    var value = distinctiveProps.value;
    var bot;
    for (bot in value)
        if (value[bot])
            return bot;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var detectors = {
    detectAppVersion: detectAppVersion,
    detectDocumentAttributes: detectDocumentAttributes,
    detectErrorTrace: detectErrorTrace,
    detectEvalLengthInconsistency: detectEvalLengthInconsistency,
    detectFunctionBind: detectFunctionBind,
    detectLanguagesLengthInconsistency: detectLanguagesLengthInconsistency,
    detectNotificationPermissions: detectNotificationPermissions,
    detectPluginsArray: detectPluginsArray,
    detectPluginsLengthInconsistency: detectPluginsLengthInconsistency,
    detectProcess: detectProcess,
    detectUserAgent: detectUserAgent,
    detectWebDriver: detectWebDriver,
    detectWebGL: detectWebGL,
    detectWindowExternal: detectWindowExternal,
    detectWindowSize: detectWindowSize,
    detectMimeTypesConsistent: detectMimeTypesConsistent,
    detectProductSub: detectProductSub,
    detectDistinctiveProperties: detectDistinctiveProperties,
};

function getAppVersion() {
    var appVersion = navigator.appVersion;
    if (appVersion == undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'navigator.appVersion is undefined');
    }
    return appVersion;
}

function getDocumentElementKeys() {
    if (document.documentElement === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'document.documentElement is undefined');
    }
    var documentElement = document.documentElement;
    if (typeof documentElement.getAttributeNames !== 'function') {
        throw new BotdError(-2 /* State.NotFunction */, 'document.documentElement.getAttributeNames is not a function');
    }
    return documentElement.getAttributeNames();
}

function getErrorTrace() {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        null[0]();
    }
    catch (error) {
        if (error instanceof Error && error['stack'] != null) {
            return error.stack.toString();
        }
    }
    throw new BotdError(-3 /* State.UnexpectedBehaviour */, 'errorTrace signal unexpected behaviour');
}

function getEvalLength() {
    return eval.toString().length;
}

function getFunctionBind() {
    if (Function.prototype.bind === undefined) {
        throw new BotdError(-2 /* State.NotFunction */, 'Function.prototype.bind is undefined');
    }
    return Function.prototype.bind.toString();
}

function getBrowserEngineKind() {
    var _a, _b;
    // Based on research in October 2020. Tested to detect Chromium 42-86.
    var w = window;
    var n = navigator;
    if (countTruthy([
        'webkitPersistentStorage' in n,
        'webkitTemporaryStorage' in n,
        n.vendor.indexOf('Google') === 0,
        'webkitResolveLocalFileSystemURL' in w,
        'BatteryManager' in w,
        'webkitMediaStream' in w,
        'webkitSpeechGrammar' in w,
    ]) >= 5) {
        return "chromium" /* BrowserEngineKind.Chromium */;
    }
    if (countTruthy([
        'ApplePayError' in w,
        'CSSPrimitiveValue' in w,
        'Counter' in w,
        n.vendor.indexOf('Apple') === 0,
        'getStorageUpdates' in n,
        'WebKitMediaKeys' in w,
    ]) >= 4) {
        return "webkit" /* BrowserEngineKind.Webkit */;
    }
    if (countTruthy([
        'buildID' in navigator,
        'MozAppearance' in ((_b = (_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : {}),
        'onmozfullscreenchange' in w,
        'mozInnerScreenX' in w,
        'CSSMozDocumentRule' in w,
        'CanvasCaptureMediaStream' in w,
    ]) >= 4) {
        return "gecko" /* BrowserEngineKind.Gecko */;
    }
    return "unknown" /* BrowserEngineKind.Unknown */;
}
function getBrowserKind() {
    var _a;
    var userAgent = (_a = navigator.userAgent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (strIncludes(userAgent, 'edg/')) {
        return "edge" /* BrowserKind.Edge */;
    }
    else if (strIncludes(userAgent, 'trident') || strIncludes(userAgent, 'msie')) {
        return "internet_explorer" /* BrowserKind.IE */;
    }
    else if (strIncludes(userAgent, 'wechat')) {
        return "wechat" /* BrowserKind.WeChat */;
    }
    else if (strIncludes(userAgent, 'firefox')) {
        return "firefox" /* BrowserKind.Firefox */;
    }
    else if (strIncludes(userAgent, 'opera') || strIncludes(userAgent, 'opr')) {
        return "opera" /* BrowserKind.Opera */;
    }
    else if (strIncludes(userAgent, 'chrome')) {
        return "chrome" /* BrowserKind.Chrome */;
    }
    else if (strIncludes(userAgent, 'safari')) {
        return "safari" /* BrowserKind.Safari */;
    }
    else {
        return "unknown" /* BrowserKind.Unknown */;
    }
}
// Source: https://github.com/fingerprintjs/fingerprintjs/blob/master/src/utils/browser.ts#L223
function isAndroid() {
    var browserEngineKind = getBrowserEngineKind();
    var isItChromium = browserEngineKind === "chromium" /* BrowserEngineKind.Chromium */;
    var isItGecko = browserEngineKind === "gecko" /* BrowserEngineKind.Gecko */;
    var w = window;
    var n = navigator;
    var c = 'connection';
    // Chrome removes all words "Android" from `navigator` when desktop version is requested
    // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
    if (isItChromium) {
        return (countTruthy([
            !('SharedWorker' in w),
            // `typechange` is deprecated, but it's still present on Android (tested on Chrome Mobile 117)
            // Removal proposal https://bugs.chromium.org/p/chromium/issues/detail?id=699892
            // Note: this expression returns true on ChromeOS, so additional detectors are required to avoid false-positives
            n[c] && 'ontypechange' in n[c],
            !('sinkId' in new Audio()),
        ]) >= 2);
    }
    else if (isItGecko) {
        return countTruthy(['onorientationchange' in w, 'orientation' in w, /android/i.test(n.appVersion)]) >= 2;
    }
    else {
        // Only 2 browser engines are presented on Android.
        // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
        return false;
    }
}
function getDocumentFocus() {
    if (document.hasFocus === undefined) {
        return false;
    }
    return document.hasFocus();
}
function isChromium86OrNewer() {
    // Checked in Chrome 85 vs Chrome 86 both on desktop and Android. Checked in macOS Chrome 128, Android Chrome 127.
    var w = window;
    return (countTruthy([
        !('MediaSettingsRange' in w),
        'RTCEncodedAudioFrame' in w,
        '' + w.Intl === '[object Intl]',
        '' + w.Reflect === '[object Reflect]',
    ]) >= 3);
}

function getLanguages() {
    var n = navigator;
    var result = [];
    var language = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
    if (language !== undefined) {
        result.push([language]);
    }
    if (Array.isArray(n.languages)) {
        var browserEngine = getBrowserEngineKind();
        // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
        // the value of `navigator.language`. Therefore, the value is ignored in this browser.
        if (!(browserEngine === "chromium" /* BrowserEngineKind.Chromium */ && isChromium86OrNewer())) {
            result.push(n.languages);
        }
    }
    else if (typeof n.languages === 'string') {
        var languages = n.languages;
        if (languages) {
            result.push(languages.split(','));
        }
    }
    return result;
}

function areMimeTypesConsistent() {
    if (navigator.mimeTypes === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'navigator.mimeTypes is undefined');
    }
    var mimeTypes = navigator.mimeTypes;
    var isConsistent = Object.getPrototypeOf(mimeTypes) === MimeTypeArray.prototype;
    for (var i = 0; i < mimeTypes.length; i++) {
        isConsistent && (isConsistent = Object.getPrototypeOf(mimeTypes[i]) === MimeType.prototype);
    }
    return isConsistent;
}

function getNotificationPermissions() {
    return __awaiter(this, void 0, void 0, function () {
        var permissions, permissionStatus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (window.Notification === undefined) {
                        throw new BotdError(-1 /* State.Undefined */, 'window.Notification is undefined');
                    }
                    if (navigator.permissions === undefined) {
                        throw new BotdError(-1 /* State.Undefined */, 'navigator.permissions is undefined');
                    }
                    permissions = navigator.permissions;
                    if (typeof permissions.query !== 'function') {
                        throw new BotdError(-2 /* State.NotFunction */, 'navigator.permissions.query is not a function');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, permissions.query({ name: 'notifications' })];
                case 2:
                    permissionStatus = _a.sent();
                    return [2 /*return*/, window.Notification.permission === 'denied' && permissionStatus.state === 'prompt'];
                case 3:
                    _a.sent();
                    throw new BotdError(-3 /* State.UnexpectedBehaviour */, 'notificationPermissions signal unexpected behaviour');
                case 4: return [2 /*return*/];
            }
        });
    });
}

function getPluginsArray() {
    if (navigator.plugins === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'navigator.plugins is undefined');
    }
    if (window.PluginArray === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'window.PluginArray is undefined');
    }
    return navigator.plugins instanceof PluginArray;
}

function getPluginsLength() {
    if (navigator.plugins === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'navigator.plugins is undefined');
    }
    if (navigator.plugins.length === undefined) {
        throw new BotdError(-3 /* State.UnexpectedBehaviour */, 'navigator.plugins.length is undefined');
    }
    return navigator.plugins.length;
}

function getProcess() {
    var process = window.process;
    var errorPrefix = 'window.process is';
    if (process === undefined) {
        throw new BotdError(-1 /* State.Undefined */, "".concat(errorPrefix, " undefined"));
    }
    if (process && typeof process !== 'object') {
        throw new BotdError(-3 /* State.UnexpectedBehaviour */, "".concat(errorPrefix, " not an object"));
    }
    return process;
}

function getProductSub() {
    var productSub = navigator.productSub;
    if (productSub === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'navigator.productSub is undefined');
    }
    return productSub;
}

function getRTT() {
    if (navigator.connection === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'navigator.connection is undefined');
    }
    if (navigator.connection.rtt === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'navigator.connection.rtt is undefined');
    }
    return navigator.connection.rtt;
}

function getUserAgent() {
    return navigator.userAgent;
}

function getWebDriver() {
    if (navigator.webdriver == undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'navigator.webdriver is undefined');
    }
    return navigator.webdriver;
}

function getWebGL() {
    var canvasElement = document.createElement('canvas');
    if (typeof canvasElement.getContext !== 'function') {
        throw new BotdError(-2 /* State.NotFunction */, 'HTMLCanvasElement.getContext is not a function');
    }
    var webGLContext = canvasElement.getContext('webgl');
    if (webGLContext === null) {
        throw new BotdError(-4 /* State.Null */, 'WebGLRenderingContext is null');
    }
    if (typeof webGLContext.getParameter !== 'function') {
        throw new BotdError(-2 /* State.NotFunction */, 'WebGLRenderingContext.getParameter is not a function');
    }
    var vendor = webGLContext.getParameter(webGLContext.VENDOR);
    var renderer = webGLContext.getParameter(webGLContext.RENDERER);
    return { vendor: vendor, renderer: renderer };
}

function getWindowExternal() {
    if (window.external === undefined) {
        throw new BotdError(-1 /* State.Undefined */, 'window.external is undefined');
    }
    var external = window.external;
    if (typeof external.toString !== 'function') {
        throw new BotdError(-2 /* State.NotFunction */, 'window.external.toString is not a function');
    }
    return external.toString();
}

function getWindowSize() {
    return {
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
    };
}

function checkDistinctiveProperties() {
    var _a;
    // The order in the following list matters, because specific types of bots come first, followed by automation technologies.
    var distinctivePropsList = (_a = {},
        _a[BotKind.Awesomium] = {
            window: ['awesomium'],
        },
        _a[BotKind.Cef] = {
            window: ['RunPerfTest'],
        },
        _a[BotKind.CefSharp] = {
            window: ['CefSharp'],
        },
        _a[BotKind.CoachJS] = {
            window: ['emit'],
        },
        _a[BotKind.FMiner] = {
            window: ['fmget_targets'],
        },
        _a[BotKind.Geb] = {
            window: ['geb'],
        },
        _a[BotKind.NightmareJS] = {
            window: ['__nightmare', 'nightmare'],
        },
        _a[BotKind.Phantomas] = {
            window: ['__phantomas'],
        },
        _a[BotKind.PhantomJS] = {
            window: ['callPhantom', '_phantom'],
        },
        _a[BotKind.Rhino] = {
            window: ['spawn'],
        },
        _a[BotKind.Selenium] = {
            window: ['_Selenium_IDE_Recorder', '_selenium', 'calledSelenium', /^([a-z]){3}_.*_(Array|Promise|Symbol)$/],
            document: ['__selenium_evaluate', 'selenium-evaluate', '__selenium_unwrapped'],
        },
        _a[BotKind.WebDriverIO] = {
            window: ['wdioElectron'],
        },
        _a[BotKind.WebDriver] = {
            window: [
                'webdriver',
                '__webdriverFunc',
                '__lastWatirAlert',
                '__lastWatirConfirm',
                '__lastWatirPrompt',
                '_WEBDRIVER_ELEM_CACHE',
                'ChromeDriverw',
            ],
            document: [
                '__webdriver_script_fn',
                '__driver_evaluate',
                '__webdriver_evaluate',
                '__fxdriver_evaluate',
                '__driver_unwrapped',
                '__webdriver_unwrapped',
                '__fxdriver_unwrapped',
                '__webdriver_script_fn',
                '__webdriver_script_func',
                '__webdriver_script_function',
                '$cdc_asdjflasutopfhvcZLmcf',
                '$cdc_asdjflasutopfhvcZLmcfl_',
                '$chrome_asyncScriptInfo',
                '__$webdriverAsyncExecutor',
            ],
        },
        _a[BotKind.HeadlessChrome] = {
            window: ['domAutomation', 'domAutomationController'],
        },
        _a);
    var botName;
    var result = {};
    var windowProps = getObjectProps(window);
    var documentProps = [];
    if (window.document !== undefined)
        documentProps = getObjectProps(window.document);
    for (botName in distinctivePropsList) {
        var props = distinctivePropsList[botName];
        if (props !== undefined) {
            var windowContains = props.window === undefined ? false : includes.apply(void 0, __spreadArray([windowProps], props.window, false));
            var documentContains = props.document === undefined || !documentProps.length ? false : includes.apply(void 0, __spreadArray([documentProps], props.document, false));
            result[botName] = windowContains || documentContains;
        }
    }
    return result;
}

var sources = {
    android: isAndroid,
    browserKind: getBrowserKind,
    browserEngineKind: getBrowserEngineKind,
    documentFocus: getDocumentFocus,
    userAgent: getUserAgent,
    appVersion: getAppVersion,
    rtt: getRTT,
    windowSize: getWindowSize,
    pluginsLength: getPluginsLength,
    pluginsArray: getPluginsArray,
    errorTrace: getErrorTrace,
    productSub: getProductSub,
    windowExternal: getWindowExternal,
    mimeTypesConsistent: areMimeTypesConsistent,
    evalLength: getEvalLength,
    webGL: getWebGL,
    webDriver: getWebDriver,
    languages: getLanguages,
    notificationPermissions: getNotificationPermissions,
    documentElementKeys: getDocumentElementKeys,
    functionBind: getFunctionBind,
    process: getProcess,
    distinctiveProps: checkDistinctiveProperties,
};

/**
 * Class representing a bot detector.
 *
 * @class
 * @implements {BotDetectorInterface}
 */
var BotDetector = /** @class */ (function () {
    function BotDetector() {
        this.components = undefined;
        this.detections = undefined;
    }
    BotDetector.prototype.getComponents = function () {
        return this.components;
    };
    BotDetector.prototype.getDetections = function () {
        return this.detections;
    };
    /**
     * @inheritdoc
     */
    BotDetector.prototype.detect = function () {
        if (this.components === undefined) {
            throw new Error("BotDetector.detect can't be called before BotDetector.collect");
        }
        var _a = detect(this.components, detectors), detections = _a[0], finalDetection = _a[1];
        this.detections = detections;
        return finalDetection;
    };
    /**
     * @inheritdoc
     */
    BotDetector.prototype.collect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, collect(sources)];
                    case 1:
                        _a.components = _b.sent();
                        return [2 /*return*/, this.components];
                }
            });
        });
    };
    return BotDetector;
}());

/**
 * Sends an unpersonalized AJAX request to collect installation statistics
 */
function monitor() {
    // The FingerprintJS CDN (https://github.com/fingerprintjs/cdn) replaces `window.__fpjs_d_m` with `true`
    if (window.__fpjs_d_m || Math.random() >= 0.001) {
        return;
    }
    try {
        var request = new XMLHttpRequest();
        request.open('get', "https://m1.openfpcdn.io/botd/v".concat(version, "/npm-monitoring"), true);
        request.send();
    }
    catch (error) {
        // console.error is ok here because it's an unexpected error handler
        // eslint-disable-next-line no-console
        console.error(error);
    }
}
function load(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.monitoring, monitoring = _c === void 0 ? true : _c;
    return __awaiter(this, void 0, void 0, function () {
        var detector;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (monitoring) {
                        monitor();
                    }
                    detector = new BotDetector();
                    return [4 /*yield*/, detector.collect()];
                case 1:
                    _d.sent();
                    return [2 /*return*/, detector];
            }
        });
    });
}
var index = { load: load };

export { BotKind, BotdError, collect, index as default, detect, detectors, load, sources };
