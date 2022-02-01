/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./config/keys.js":
/*!************************!*\
  !*** ./config/keys.js ***!
  \************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

if (false) {} else {
  module.exports = __webpack_require__(/*! ./keys_dev */ "./config/keys_dev.js");
}

/***/ }),

/***/ "./config/keys_dev.js":
/*!****************************!*\
  !*** ./config/keys_dev.js ***!
  \****************************/
/***/ (function(module) {

module.exports = {
  app_id: '4a9dc7e5',
  app_key: '2af4ab3abfee4642aa55515e4d1180e5',
  google_client_id: '213047326259-2clqcc10ue10c1bkig2k01secmi562fi.apps.googleusercontent.com',
  google_client_secret: 'L_SKB0W9-Jg122FowHYKNobK',
  google_redirect_uri: 'https://developers.google.com/oauthplayground',
  google_refresh_token: '1//04Pvpt-uAXfDbCgYIARAAGAQSNwF-L9Ir5ZZ9nYQT8fHCR-aaD74afPu3w5oU486Cw7v20tMD4kAXe6ZUwWsXyNaV3vEq_0i-6lM'
};

/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");

var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");

var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");

var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");

var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;

    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest(); // HTTP basic authentication

    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true); // Set the request timeout in MS

    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      } // Prepare the response


      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' || responseType === 'json' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response); // Clean up request

      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        } // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request


        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        } // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'


        setTimeout(onloadend);
      };
    } // Handle browser request cancellation (as opposed to a manual cancellation)


    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Handle low level network errors


    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request)); // Clean up request

      request = null;
    }; // Handle timeout


    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      var transitional = config.transitional || defaults.transitional;

      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }

      reject(createError(timeoutErrorMessage, config, transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.


    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    } // Add headers to the request


    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    } // Add withCredentials to request if needed


    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    } // Add responseType to request if needed


    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    } // Handle progress if needed


    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    } // Not all browsers support upload events


    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function onCanceled(cancel) {
        if (!request) {
          return;
        }

        reject(!cancel || cancel && cancel.type ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);

      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    } // Send the request


    request.send(requestData);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");

var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */


function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context); // Copy axios.prototype to instance

  utils.extend(instance, Axios.prototype, context); // Copy context to instance

  utils.extend(instance, context); // Factory for creating new instances

  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
} // Create the default instance to be exported


var axios = createInstance(defaults); // Expose Axios class to allow class inheritance

axios.Axios = Axios; // Expose Cancel & CancelToken

axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = __webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version; // Expose all/spread

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js"); // Expose isAxiosError

axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");
module.exports = axios; // Allow use of default import syntax in TypeScript

module.exports["default"] = axios;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ (function(module) {

"use strict";

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;
module.exports = Cancel;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */


function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this; // eslint-disable-next-line func-names

  this.promise.then(function (cancel) {
    if (!token._listeners) return;
    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }

    token._listeners = null;
  }); // eslint-disable-next-line func-names

  this.promise.then = function (onfulfilled) {
    var _resolve; // eslint-disable-next-line func-names


    var promise = new Promise(function (resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
/**
 * Subscribe to the cancel signal
 */


CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};
/**
 * Unsubscribe from the cancel signal
 */


CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }

  var index = this._listeners.indexOf(listener);

  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};
/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */


CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");

var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */

function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */


Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config); // Set config.method

  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  } // filter out skipped interceptors


  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });
  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);
    promise = Promise.resolve(config);

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  var newConfig = config;

  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();

    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
}; // Provide aliases for supported request methods


utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});
module.exports = Axios;

/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}
/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */


InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};
/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */


InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */


InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");

var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");
/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */


module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }

  return requestedURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */


module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");

var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}
/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */


module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config); // Ensure headers exist

  config.headers = config.headers || {}; // Transform request data

  config.data = transformData.call(config, config.data, config.headers, config.transformRequest); // Flatten headers

  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config); // Transform response data

    response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config); // Transform response data

      if (reason && reason.response) {
        reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */

module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;

  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };

  return error;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");
/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */


module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }

    return source;
  } // eslint-disable-next-line consistent-return


  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  } // eslint-disable-next-line consistent-return


  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  } // eslint-disable-next-line consistent-return


  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  } // eslint-disable-next-line consistent-return


  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };
  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */


module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;

  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
  }
};

/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */


module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/

  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });
  return data;
};

/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;

  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }

  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }

    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }

    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    if (utils.isObject(data) || headers && headers['Content-Type'] === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],
  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }

          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
module.exports = defaults;

/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ (function(module) {

module.exports = {
  "version": "0.22.0"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return fn.apply(thisArg, args);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */


module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }

        parts.push(encode(key) + '=' + encode(v));
      });
    });
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ (function(module) {

"use strict";

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */

module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() : // Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ (function(module) {

"use strict";

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function isAxiosError(payload) {
  return _typeof(payload) === 'object' && payload.isAxiosError === true;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;
  /**
  * Parse a URL to discover it's components
  *
  * @param {String} url The URL to be parsed
  * @returns {Object}
  */

  function resolveURL(url) {
    var href = url;

    if (msie) {
      // IE needs attribute set twice to normalize properties
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href); // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils

    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);
  /**
  * Determine if a URL shares the same origin as the current location
  *
  * @param {String} requestURL The URL to test
  * @returns {boolean} True if URL shares the same origin, otherwise false
  */

  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : // Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js"); // Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers


var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */

module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }

      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });
  return parsed;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ (function(module) {

"use strict";

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */

module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var VERSION = __webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version;

var validators = {}; // eslint-disable-next-line func-names

['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function (type, i) {
  validators[type] = function validator(thing) {
    return _typeof(thing) === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});
var deprecatedWarnings = {};
/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */

validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  } // eslint-disable-next-line func-names


  return function (value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true; // eslint-disable-next-line no-console

      console.warn(formatMessage(opt, ' has been deprecated since v' + version + ' and will be removed in the near future'));
    }

    return validator ? validator(value, opt, opts) : true;
  };
};
/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */


function assertOptions(options, schema, allowUnknown) {
  if (_typeof(options) !== 'object') {
    throw new TypeError('options must be an object');
  }

  var keys = Object.keys(options);
  var i = keys.length;

  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];

    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);

      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }

      continue;
    }

    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};

/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js"); // utils is a library of generic helper functions non-specific to axios


var toString = Object.prototype.toString;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */

function isArray(val) {
  return toString.call(val) === '[object Array]';
}
/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */


function isUndefined(val) {
  return typeof val === 'undefined';
}
/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */


function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */


function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}
/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */


function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */


function isArrayBufferView(val) {
  var result;

  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }

  return result;
}
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */


function isString(val) {
  return typeof val === 'string';
}
/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */


function isNumber(val) {
  return typeof val === 'number';
}
/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */


function isObject(val) {
  return val !== null && _typeof(val) === 'object';
}
/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */


function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */


function isDate(val) {
  return toString.call(val) === '[object Date]';
}
/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */


function isFile(val) {
  return toString.call(val) === '[object File]';
}
/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */


function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}
/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */


function isFunction(val) {
  return toString.call(val) === '[object Function]';
}
/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */


function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */


function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */


function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */


function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */


function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  } // Force an array if not already something iterable


  if (_typeof(obj) !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */


function merge() {
  var result = {};

  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }

  return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */


function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */


function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
( false ? 0 : _typeof(module)) === "object" ? module.exports : {});

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./src/scripts/modal.js":
/*!******************************!*\
  !*** ./src/scripts/modal.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "modalClick": function() { return /* binding */ modalClick; },
/* harmony export */   "closeModal": function() { return /* binding */ closeModal; },
/* harmony export */   "clickOutside": function() { return /* binding */ clickOutside; }
/* harmony export */ });
var howItWorks = document.querySelector('#how-scroople-works');
var modalBg = document.querySelector('.modal-background'); // const times = document.querySelector('.fa-times');

var modalX = document.getElementById('modal-x');
var modalClick = howItWorks.addEventListener('click', function () {
  modalBg.classList.add('modal-active');
});
var closeModal = modalX.addEventListener('click', function () {
  modalBg.classList.remove('modal-active');
});
var clickOutside = window.addEventListener('click', function (e) {
  if (e.target == modalBg) {
    modalBg.classList.remove('modal-active');
  }
});

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
/* harmony import */ var _scripts_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scripts/modal */ "./src/scripts/modal.js");



var app_key = __webpack_require__(/*! ../config/keys */ "./config/keys.js").app_key;

var axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js")["default"];

var regeneratorRuntime = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");

var searchInput = document.getElementById('search-input');
var mainSearchInput = document.querySelector('#main-search-input');
var searchContainer = document.querySelector('#search-container');
var searchResultsContainer = document.querySelector('#search-result-container');
var searchResults = document.querySelector('#search-results');
var scroopleSearchBtn = document.querySelector('#scroople-search-btn');
var feelingLuckyBtn = document.getElementById('feeling-lucky-btn');
var feelingLuckyList = document.getElementById('feeling-lucky-list');
var tools = document.getElementById('tools');
var loaderContainer = document.getElementById('loader-container');
var searchX = document.getElementById('search-x');
var filter = document.getElementById('filter');
var excludeInput = document.getElementById('exclude-input');
var mealType = document.querySelector('#meal-type');
var diets = document.querySelector('#diets');
var searchQuery = '';
mainSearchInput.addEventListener('keypress', function (e) {
  // e.preventDefault();
  if (e.key === 'Enter') {
    searchQuery = mainSearchInput.value;
    fetchSearchResults(searchQuery); // fetchSearchResults();
  }
});
scroopleSearchBtn.addEventListener('click', function (e) {
  // e.preventDefault();
  searchQuery = mainSearchInput.value;
  fetchSearchResults(searchQuery); // fetchSearchResults();
});
feelingLuckyBtn.addEventListener('mouseover', function (e) {
  var pos = -(Math.floor(Math.random() * 11 + 1) * 5 - 3) * 5;
  var arr = [];

  if (pos === -116) {// pos = -35;
  } // animate the ul ??


  feelingLuckyList;

  if (pos === -24 || pos === -47 || pos === -70 || pos === -116) {// make the width 130px
  } else if (pos === -93 || -139) {// make the width 145px
  } else {}
}); // $('#search_btns button:nth-child(2)').hover(function () {
//   btnTimeID = setTimeout(function () {
//     // We are using the math object to randomly pick a number between 1 - 11, and then applying the formula (5n-3)5 to this number, which leaves us with a randomly selected number that is applied to the <ul> (i.e. -185) and corresponds to the position of a word (or <li> element, i.e. "I'm Feeling Curious").
//     var pos = -((Math.floor((Math.random() * 11) + 1)) * 5 - 3) * 5;
//     if (pos === -135) {
//       console.log("position didn't change, let's force change")
//       pos = -35;
//     }
//     $('#search_btns button:nth-child(2) ul').animate({ 'bottom': pos + 'px' }, 300);
//     // Change the width of the button to fit the currently selected word.
//     if (pos === -35 || pos === -110 || pos === -185 || pos === -10 || pos === -60 || pos === -160) {
//       console.log(pos + ' = -35, -110, -185, -10, -60, -160');
//       $('#search_btns button:nth-child(2)').css('width', '149px');
//     } else if (pos === -85) {
//       console.log(pos + ' = -85');
//       $('#search_btns button:nth-child(2)').css('width', '160px');
//     } else if (pos === -210) {
//       console.log(pos + ' = -210');
//       $('#search_btns button:nth-child(2)').css('width', '165px');
//     } else {
//       console.log(pos + ' = -260, -235');
//       $('#search_btns button:nth-child(2)').css('width', '144px');
//     }
//   }, 200);
// });
// FIRST GET REQUEST

function fetchSearchResults(searchQuery) {
  axios({
    method: 'GET',
    url: "https://api.spoonacular.com/recipes/complexSearch?apiKey=".concat(app_key, "&number=1000&addRecipeInformation=true&includeIngredients=").concat(searchQuery)
  }).then(function (res) {
    searchContainer.style.display = "none";
    generateResults(res.data.results);
    searchInput.value = searchQuery;
    document.getElementById('logo').classList.remove('visibility');
    document.getElementById('input-filter-container').classList.remove('visibility');
    document.getElementById('tools').classList.remove('visibility');
  }).catch(function (err) {
    return console.log(err);
  });
}

var state = false;
tools.addEventListener('click', function (e) {
  if (!state) {
    state = true;
    document.querySelector('.filter-container').classList.remove('visibility');
  } else {
    state = false;
    document.querySelector('.filter-container').classList.add('visibility');
  }

  searchInput.value = searchQuery;
}); // SECOND GET REQUEST //

filter.addEventListener('click', function () {
  // e.preventDefault();
  var excludeQuery = excludeInput.value;
  var type = mealType.value;
  var diet = diets.value;
  fetchFilteredSearchResults(searchQuery, excludeQuery, type, diet);
});
excludeInput.addEventListener('keypress', function (e) {
  // e.preventDefault();
  var excludeQuery = excludeInput.value;
  var type = mealType.value;
  var diet = diets.value;

  if (e.key === 'Enter') {
    fetchFilteredSearchResults(searchQuery, excludeQuery, type, diet);
  }
});

function fetchFilteredSearchResults(searchQuery, excludeQuery, type, diet) {
  axios({
    method: 'GET',
    url: "/recipes/".concat(searchQuery, "/filter"),
    params: {
      searchQuery: searchQuery,
      excludeQuery: excludeQuery,
      type: type,
      diet: diet
    }
  }).then(function (res) {
    generateResults(res.data.results);
  }).catch(function (err) {
    return console.log(err);
  });
}

searchX.addEventListener('click', function () {
  searchInput.value = "";
});

function generateResults(results) {
  var generatedResults = "<p>".concat(results.length, " results (0.13 seconds)</p>");
  results.forEach(function (result) {
    var resultItem = "<div class=\"result\">\n            <p class=\"url\">".concat(result.sourceUrl, "</p>\n            <a href=").concat(result.sourceUrl, " target=\"_blank\"><h3 class=\"title\">").concat(result.title, "</h3></a>\n            <p class=\"summary\">").concat(result.summary, "</p>\n            <div class=\"result-links\">\n                <p>").concat(result.readyInMinutes, " minutes</p>\n                <p>").concat(result.servings, " servings</p>\n            </div>\n        </div>");
    generatedResults += resultItem;
  });
  searchResults.innerHTML = generatedResults;
}
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RVM1SyxNQUFNLENBQUM2SyxTQUZoQix1Q0FHRTdLLE1BQU0sQ0FBQzZLLFNBSFQsb0RBR3dEN0ssTUFBTSxDQUFDOEssS0FIL0QseURBSWE5SyxNQUFNLENBQUMrSyxPQUpwQixnRkFNQy9LLE1BQU0sQ0FBQ2dMLGNBTlIsOENBT0NoTCxNQUFNLENBQUNpTCxRQVBSLHNEQUFoQjtBQVVBTixJQUFBQSxnQkFBZ0IsSUFBSUMsVUFBcEI7QUFDRCxHQVpEO0FBY0E1QixFQUFBQSxhQUFhLENBQUNrQyxTQUFkLEdBQTBCUCxnQkFBMUI7QUFDRCxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9jb25maWcva2V5cy5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL2NvbmZpZy9rZXlzX2Rldi5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwid2VicGFjazovL3Njcm9vcGxlLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovL3Njcm9vcGxlLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzIiwid2VicGFjazovL3Njcm9vcGxlLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvY3JlYXRlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzIiwid2VicGFjazovL3Njcm9vcGxlLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2Vudi9kYXRhLmpzIiwid2VicGFjazovL3Njcm9vcGxlLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovL3Njcm9vcGxlLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL3Njcm9vcGxlLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9zY3Jvb3BsZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovL3Njcm9vcGxlLy4vc3JjL3NjcmlwdHMvbW9kYWwuanMiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvLi9zcmMvc3R5bGVzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Njcm9vcGxlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2Nyb29wbGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zY3Jvb3BsZS93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL3Njcm9vcGxlLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9rZXlzX3Byb2QnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9rZXlzX2RldicpO1xufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBhcHBfaWQ6ICc0YTlkYzdlNScsXG4gIGFwcF9rZXk6ICcyYWY0YWIzYWJmZWU0NjQyYWE1NTUxNWU0ZDExODBlNScsXG4gIGdvb2dsZV9jbGllbnRfaWQ6ICcyMTMwNDczMjYyNTktMmNscWNjMTB1ZTEwYzFia2lnMmswMXNlY21pNTYyZmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxuICBnb29nbGVfY2xpZW50X3NlY3JldDogJ0xfU0tCMFc5LUpnMTIyRm93SFlLTm9iSycsXG4gIGdvb2dsZV9yZWRpcmVjdF91cmk6ICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9vYXV0aHBsYXlncm91bmQnLFxuICBnb29nbGVfcmVmcmVzaF90b2tlbjogJzEvLzA0UHZwdC11QVhmRGJDZ1lJQVJBQUdBUVNOd0YtTDlJcjVaWjluWVFUOGZIQ1ItYWFENzRhZlB1M3c1b1U0ODZDdzd2MjB0TUQ0a0FYZTZaVXdXc1h5TmFWM3ZFcV8waS02bE0nXG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvQ2FuY2VsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcbiAgICB2YXIgcmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICB2YXIgb25DYW5jZWxlZDtcbiAgICBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgICBjb25maWcuY2FuY2VsVG9rZW4udW5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChjb25maWcuYXV0aC5wYXNzd29yZCkpIDogJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG9ubG9hZGVuZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSAndGV4dCcgfHwgIHJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nID9cbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKGZ1bmN0aW9uIF9yZXNvbHZlKHZhbHVlKSB7XG4gICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCBmdW5jdGlvbiBfcmVqZWN0KGVycikge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoJ29ubG9hZGVuZCcgaW4gcmVxdWVzdCkge1xuICAgICAgLy8gVXNlIG9ubG9hZGVuZCBpZiBhdmFpbGFibGVcbiAgICAgIHJlcXVlc3Qub25sb2FkZW5kID0gb25sb2FkZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlIHRvIGVtdWxhdGUgb25sb2FkZW5kXG4gICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCB8fCByZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVhZHlzdGF0ZSBoYW5kbGVyIGlzIGNhbGxpbmcgYmVmb3JlIG9uZXJyb3Igb3Igb250aW1lb3V0IGhhbmRsZXJzLFxuICAgICAgICAvLyBzbyB3ZSBzaG91bGQgY2FsbCBvbmxvYWRlbmQgb24gdGhlIG5leHQgJ3RpY2snXG4gICAgICAgIHNldFRpbWVvdXQob25sb2FkZW5kKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGJyb3dzZXIgcmVxdWVzdCBjYW5jZWxsYXRpb24gKGFzIG9wcG9zZWQgdG8gYSBtYW51YWwgY2FuY2VsbGF0aW9uKVxuICAgIHJlcXVlc3Qub25hYm9ydCA9IGZ1bmN0aW9uIGhhbmRsZUFib3J0KCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdSZXF1ZXN0IGFib3J0ZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHZhciB0aW1lb3V0RXJyb3JNZXNzYWdlID0gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJztcbiAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsIHx8IGRlZmF1bHRzLnRyYW5zaXRpb25hbDtcbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyAnRVRJTUVET1VUJyA6ICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKHJlc3BvbnNlVHlwZSAmJiByZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4gfHwgY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlamVjdCghY2FuY2VsIHx8IChjYW5jZWwgJiYgY2FuY2VsLnR5cGUpID8gbmV3IENhbmNlbCgnY2FuY2VsZWQnKSA6IGNhbmNlbCk7XG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9O1xuXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4gJiYgY29uZmlnLmNhbmNlbFRva2VuLnN1YnNjcmliZShvbkNhbmNlbGVkKTtcbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IGNvbmZpZy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL2NvcmUvbWVyZ2VDb25maWcnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICAvLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG4gIGluc3RhbmNlLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICAgIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhkZWZhdWx0Q29uZmlnLCBpbnN0YW5jZUNvbmZpZykpO1xuICB9O1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcbmF4aW9zLlZFUlNJT04gPSByZXF1aXJlKCcuL2Vudi9kYXRhJykudmVyc2lvbjtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxuLy8gRXhwb3NlIGlzQXhpb3NFcnJvclxuYXhpb3MuaXNBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzQXhpb3NFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuXG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHRoaXMucHJvbWlzZS50aGVuKGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgIGlmICghdG9rZW4uX2xpc3RlbmVycykgcmV0dXJuO1xuXG4gICAgdmFyIGk7XG4gICAgdmFyIGwgPSB0b2tlbi5fbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRva2VuLl9saXN0ZW5lcnNbaV0oY2FuY2VsKTtcbiAgICB9XG4gICAgdG9rZW4uX2xpc3RlbmVycyA9IG51bGw7XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHRoaXMucHJvbWlzZS50aGVuID0gZnVuY3Rpb24ob25mdWxmaWxsZWQpIHtcbiAgICB2YXIgX3Jlc29sdmU7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgIHRva2VuLnN1YnNjcmliZShyZXNvbHZlKTtcbiAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB9KS50aGVuKG9uZnVsZmlsbGVkKTtcblxuICAgIHByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24gcmVqZWN0KCkge1xuICAgICAgdG9rZW4udW5zdWJzY3JpYmUoX3Jlc29sdmUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfTtcblxuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBTdWJzY3JpYmUgdG8gdGhlIGNhbmNlbCBzaWduYWxcbiAqL1xuXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIGxpc3RlbmVyKHRoaXMucmVhc29uKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbi8qKlxuICogVW5zdWJzY3JpYmUgZnJvbSB0aGUgY2FuY2VsIHNpZ25hbFxuICovXG5cbkNhbmNlbFRva2VuLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uIHVuc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gIGlmICghdGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3ZhbGlkYXRvcicpO1xuXG52YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci52YWxpZGF0b3JzO1xuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgdmFyIHRyYW5zaXRpb25hbCA9IGNvbmZpZy50cmFuc2l0aW9uYWw7XG5cbiAgaWYgKHRyYW5zaXRpb25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICBzaWxlbnRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgIH0sIGZhbHNlKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgdmFyIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluID0gW107XG4gIHZhciBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBpZiAodHlwZW9mIGludGVyY2VwdG9yLnJ1bldoZW4gPT09ICdmdW5jdGlvbicgJiYgaW50ZXJjZXB0b3IucnVuV2hlbihjb25maWcpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyA9IHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyAmJiBpbnRlcmNlcHRvci5zeW5jaHJvbm91cztcblxuICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHZhciByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2U7XG5cbiAgaWYgKCFzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMpIHtcbiAgICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuXG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICBjaGFpbiA9IGNoYWluLmNvbmNhdChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuXG4gICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG4gIHZhciBuZXdDb25maWcgPSBjb25maWc7XG4gIHdoaWxlIChyZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICB2YXIgb25GdWxmaWxsZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpO1xuICAgIHZhciBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICB0cnkge1xuICAgICAgbmV3Q29uZmlnID0gb25GdWxmaWxsZWQobmV3Q29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgb25SZWplY3RlZChlcnJvcik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIHByb21pc2UgPSBkaXNwYXRjaFJlcXVlc3QobmV3Q29uZmlnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICB9XG5cbiAgd2hpbGUgKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZCxcbiAgICBzeW5jaHJvbm91czogb3B0aW9ucyA/IG9wdGlvbnMuc3luY2hyb25vdXMgOiBmYWxzZSxcbiAgICBydW5XaGVuOiBvcHRpb25zID8gb3B0aW9ucy5ydW5XaGVuIDogbnVsbFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9DYW5jZWwnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxuXG4gIGlmIChjb25maWcuc2lnbmFsICYmIGNvbmZpZy5zaWduYWwuYWJvcnRlZCkge1xuICAgIHRocm93IG5ldyBDYW5jZWwoJ2NhbmNlbGVkJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgIGNvbmZpZyxcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1xuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgY29uZmlnLFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBzdGF0dXM6IHRoaXMucmVzcG9uc2UgJiYgdGhpcy5yZXNwb25zZS5zdGF0dXMgPyB0aGlzLnJlc3BvbnNlLnN0YXR1cyA6IG51bGxcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB2YXIgbWVyZ2VNYXAgPSB7XG4gICAgJ3VybCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ21ldGhvZCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ2RhdGEnOiB2YWx1ZUZyb21Db25maWcyLFxuICAgICdiYXNlVVJMJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNmb3JtUmVxdWVzdCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zZm9ybVJlc3BvbnNlJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAncGFyYW1zU2VyaWFsaXplcic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RpbWVvdXQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd0aW1lb3V0TWVzc2FnZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3dpdGhDcmVkZW50aWFscyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2FkYXB0ZXInOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZVR5cGUnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd4c3JmQ29va2llTmFtZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnb25VcGxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ29uRG93bmxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2RlY29tcHJlc3MnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnbWF4Qm9keUxlbmd0aCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zcG9ydCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2h0dHBBZ2VudCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2h0dHBzQWdlbnQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdjYW5jZWxUb2tlbic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3NvY2tldFBhdGgnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZUVuY29kaW5nJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndmFsaWRhdGVTdGF0dXMnOiBtZXJnZURpcmVjdEtleXNcbiAgfTtcblxuICB1dGlscy5mb3JFYWNoKE9iamVjdC5rZXlzKGNvbmZpZzEpLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgdmFyIG1lcmdlID0gbWVyZ2VNYXBbcHJvcF0gfHwgbWVyZ2VEZWVwUHJvcGVydGllcztcbiAgICB2YXIgY29uZmlnVmFsdWUgPSBtZXJnZShwcm9wKTtcbiAgICAodXRpbHMuaXNVbmRlZmluZWQoY29uZmlnVmFsdWUpICYmIG1lcmdlICE9PSBtZXJnZURpcmVjdEtleXMpIHx8IChjb25maWdbcHJvcF0gPSBjb25maWdWYWx1ZSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIHZhciBjb250ZXh0ID0gdGhpcyB8fCBkZWZhdWx0cztcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4uY2FsbChjb250ZXh0LCBkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9jb3JlL2VuaGFuY2VFcnJvcicpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVNhZmVseShyYXdWYWx1ZSwgcGFyc2VyLCBlbmNvZGVyKSB7XG4gIGlmICh1dGlscy5pc1N0cmluZyhyYXdWYWx1ZSkpIHtcbiAgICB0cnkge1xuICAgICAgKHBhcnNlciB8fCBKU09OLnBhcnNlKShyYXdWYWx1ZSk7XG4gICAgICByZXR1cm4gdXRpbHMudHJpbShyYXdWYWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUubmFtZSAhPT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoZW5jb2RlciB8fCBKU09OLnN0cmluZ2lmeSkocmF3VmFsdWUpO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG5cbiAgdHJhbnNpdGlvbmFsOiB7XG4gICAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gICAgZm9yY2VkSlNPTlBhcnNpbmc6IHRydWUsXG4gICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogZmFsc2VcbiAgfSxcblxuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdBY2NlcHQnKTtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpIHx8IChoZWFkZXJzICYmIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID09PSAnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTYWZlbHkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICB2YXIgdHJhbnNpdGlvbmFsID0gdGhpcy50cmFuc2l0aW9uYWwgfHwgZGVmYXVsdHMudHJhbnNpdGlvbmFsO1xuICAgIHZhciBzaWxlbnRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuc2lsZW50SlNPTlBhcnNpbmc7XG4gICAgdmFyIGZvcmNlZEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5mb3JjZWRKU09OUGFyc2luZztcbiAgICB2YXIgc3RyaWN0SlNPTlBhcnNpbmcgPSAhc2lsZW50SlNPTlBhcnNpbmcgJiYgdGhpcy5yZXNwb25zZVR5cGUgPT09ICdqc29uJztcblxuICAgIGlmIChzdHJpY3RKU09OUGFyc2luZyB8fCAoZm9yY2VkSlNPTlBhcnNpbmcgJiYgdXRpbHMuaXNTdHJpbmcoZGF0YSkgJiYgZGF0YS5sZW5ndGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHN0cmljdEpTT05QYXJzaW5nKSB7XG4gICAgICAgICAgaWYgKGUubmFtZSA9PT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICAgICAgdGhyb3cgZW5oYW5jZUVycm9yKGUsIHRoaXMsICdFX0pTT05fUEFSU0UnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfSxcblxuICBoZWFkZXJzOiB7XG4gICAgY29tbW9uOiB7XG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgICB9XG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4yMi4wXCJcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gKHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JykgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZFUlNJT04gPSByZXF1aXJlKCcuLi9lbnYvZGF0YScpLnZlcnNpb247XG5cbnZhciB2YWxpZGF0b3JzID0ge307XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5bJ29iamVjdCcsICdib29sZWFuJywgJ251bWJlcicsICdmdW5jdGlvbicsICdzdHJpbmcnLCAnc3ltYm9sJ10uZm9yRWFjaChmdW5jdGlvbih0eXBlLCBpKSB7XG4gIHZhbGlkYXRvcnNbdHlwZV0gPSBmdW5jdGlvbiB2YWxpZGF0b3IodGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSB0eXBlIHx8ICdhJyArIChpIDwgMSA/ICduICcgOiAnICcpICsgdHlwZTtcbiAgfTtcbn0pO1xuXG52YXIgZGVwcmVjYXRlZFdhcm5pbmdzID0ge307XG5cbi8qKlxuICogVHJhbnNpdGlvbmFsIG9wdGlvbiB2YWxpZGF0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb258Ym9vbGVhbj99IHZhbGlkYXRvciAtIHNldCB0byBmYWxzZSBpZiB0aGUgdHJhbnNpdGlvbmFsIG9wdGlvbiBoYXMgYmVlbiByZW1vdmVkXG4gKiBAcGFyYW0ge3N0cmluZz99IHZlcnNpb24gLSBkZXByZWNhdGVkIHZlcnNpb24gLyByZW1vdmVkIHNpbmNlIHZlcnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nP30gbWVzc2FnZSAtIHNvbWUgbWVzc2FnZSB3aXRoIGFkZGl0aW9uYWwgaW5mb1xuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIFZFUlNJT04gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvcHQsIG9wdHMpIHtcbiAgICBpZiAodmFsaWRhdG9yID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdE1lc3NhZ2Uob3B0LCAnIGhhcyBiZWVuIHJlbW92ZWQnICsgKHZlcnNpb24gPyAnIGluICcgKyB2ZXJzaW9uIDogJycpKSk7XG4gICAgfVxuXG4gICAgaWYgKHZlcnNpb24gJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKFxuICAgICAgICAgIG9wdCxcbiAgICAgICAgICAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdicgKyB2ZXJzaW9uICsgJyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgfTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7b2JqZWN0fSBzY2hlbWFcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGFsbG93VW5rbm93blxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIHZhciBvcHQgPSBrZXlzW2ldO1xuICAgIHZhciB2YWxpZGF0b3IgPSBzY2hlbWFbb3B0XTtcbiAgICBpZiAodmFsaWRhdG9yKSB7XG4gICAgICB2YXIgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICB2YXIgcmVzdWx0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0aW9ucyk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IEVycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0KTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2VydE9wdGlvbnM6IGFzc2VydE9wdGlvbnMsXG4gIHZhbGlkYXRvcnM6IHZhbGlkYXRvcnNcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbCkge1xuICBpZiAodG9TdHJpbmcuY2FsbCh2YWwpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci50cmltID8gc3RyLnRyaW0oKSA6IHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBkZWZpbmUoSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIGRlZmluZShHcCwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gIGRlZmluZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvbik7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgZGVmaW5lKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlLCBhc3luY0l0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIGRlZmluZShHcCwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBkZWZpbmUoR3AsIFwidG9TdHJpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIGluIG1vZGVybiBlbmdpbmVzXG4gIC8vIHdlIGNhbiBleHBsaWNpdGx5IGFjY2VzcyBnbG9iYWxUaGlzLiBJbiBvbGRlciBlbmdpbmVzIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbFRoaXMucmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbiAgfSBlbHNlIHtcbiAgICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xuICB9XG59XG4iLCJjb25zdCBob3dJdFdvcmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hvdy1zY3Jvb3BsZS13b3JrcycpO1xuY29uc3QgbW9kYWxCZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1iYWNrZ3JvdW5kJyk7XG4vLyBjb25zdCB0aW1lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYS10aW1lcycpO1xuY29uc3QgbW9kYWxYID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXgnKTtcblxuZXhwb3J0IGNvbnN0IG1vZGFsQ2xpY2sgPSBob3dJdFdvcmtzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICBtb2RhbEJnLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWFjdGl2ZScpO1xufSlcblxuZXhwb3J0IGNvbnN0IGNsb3NlTW9kYWwgPSBtb2RhbFguYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gIG1vZGFsQmcuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtYWN0aXZlJyk7XG59KVxuXG5leHBvcnQgY29uc3QgY2xpY2tPdXRzaWRlID0gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgaWYgKGUudGFyZ2V0ID09IG1vZGFsQmcpIHtcbiAgICBtb2RhbEJnLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWFjdGl2ZScpO1xuICB9XG59KSIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiaW1wb3J0IFwiLi9zdHlsZXMvaW5kZXguc2Nzc1wiO1xuaW1wb3J0IHsgbW9kYWxDbGljaywgY2xvc2VNb2RhbCwgY2xpY2tPdXRzaWRlIH0gZnJvbSBcIi4vc2NyaXB0cy9tb2RhbFwiO1xuXG5jb25zdCBhcHBfa2V5ID0gcmVxdWlyZSgnLi4vY29uZmlnL2tleXMnKS5hcHBfa2V5O1xuY29uc3QgYXhpb3MgPSByZXF1aXJlKCdheGlvcycpLmRlZmF1bHQ7XG5jb25zdCByZWdlbmVyYXRvclJ1bnRpbWUgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcblxuY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWlucHV0Jyk7XG5jb25zdCBtYWluU2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbi1zZWFyY2gtaW5wdXQnKTtcbmNvbnN0IHNlYXJjaENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWFyY2gtY29udGFpbmVyJyk7XG5jb25zdCBzZWFyY2hSZXN1bHRzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NlYXJjaC1yZXN1bHQtY29udGFpbmVyJyk7XG5jb25zdCBzZWFyY2hSZXN1bHRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NlYXJjaC1yZXN1bHRzJyk7XG5jb25zdCBzY3Jvb3BsZVNlYXJjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzY3Jvb3BsZS1zZWFyY2gtYnRuJyk7XG5jb25zdCBmZWVsaW5nTHVja3lCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmVlbGluZy1sdWNreS1idG4nKTtcbmNvbnN0IGZlZWxpbmdMdWNreUxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmVlbGluZy1sdWNreS1saXN0Jyk7XG5jb25zdCB0b29scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29scycpO1xuY29uc3QgbG9hZGVyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRlci1jb250YWluZXInKTtcbmNvbnN0IHNlYXJjaFggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLXgnKTtcbmNvbnN0IGZpbHRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXInKTtcbmxldCBleGNsdWRlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhjbHVkZS1pbnB1dCcpO1xuY29uc3QgbWVhbFR5cGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWVhbC10eXBlJyk7XG5jb25zdCBkaWV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkaWV0cycpO1xuXG5sZXQgc2VhcmNoUXVlcnkgPSAnJztcblxubWFpblNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgKGUpID0+IHtcbiAgLy8gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICBzZWFyY2hRdWVyeSA9IG1haW5TZWFyY2hJbnB1dC52YWx1ZTtcbiAgICBmZXRjaFNlYXJjaFJlc3VsdHMoc2VhcmNoUXVlcnkpO1xuICAgIC8vIGZldGNoU2VhcmNoUmVzdWx0cygpO1xuICB9XG59KVxuXG5zY3Jvb3BsZVNlYXJjaEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gIC8vIGUucHJldmVudERlZmF1bHQoKTtcbiAgc2VhcmNoUXVlcnkgPSBtYWluU2VhcmNoSW5wdXQudmFsdWU7XG4gIGZldGNoU2VhcmNoUmVzdWx0cyhzZWFyY2hRdWVyeSk7XG4gIC8vIGZldGNoU2VhcmNoUmVzdWx0cygpO1xufSlcblxuZmVlbGluZ0x1Y2t5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gIHZhciBwb3MgPSAtKChNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTEpICsgMSkpICogNSAtIDMpICogNTtcbiAgbGV0IGFyciA9IFtdXG5cbiAgaWYgKHBvcyA9PT0gLTExNikge1xuICAgIC8vIHBvcyA9IC0zNTtcbiAgfVxuXG4gIC8vIGFuaW1hdGUgdGhlIHVsID8/XG4gIGZlZWxpbmdMdWNreUxpc3RcblxuICBpZiAocG9zID09PSAtMjQgfHwgcG9zID09PSAtNDcgfHwgcG9zID09PSAtNzAgfHwgcG9zID09PSAtMTE2KSB7XG4gICAgLy8gbWFrZSB0aGUgd2lkdGggMTMwcHhcbiAgfSBlbHNlIGlmIChwb3MgPT09IC05MyB8fCAtMTM5KSB7XG4gICAgLy8gbWFrZSB0aGUgd2lkdGggMTQ1cHhcbiAgfSBlbHNlIGlmIChwb3MgPT09IC0xNjQgfHwgLTE4NSkge1xuICAgIC8vIG1ha2UgdGhlIHdpZHRoIDE1NXB4XG4gIH0gZWxzZSB7XG4gICAgLy8gbWFrZSB0aGUgd2lkdGggMTkwcHhcbiAgfVxuXG5cbn0pXG5cbi8vICQoJyNzZWFyY2hfYnRucyBidXR0b246bnRoLWNoaWxkKDIpJykuaG92ZXIoZnVuY3Rpb24gKCkge1xuXG4vLyAgIGJ0blRpbWVJRCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4vLyAgICAgLy8gV2UgYXJlIHVzaW5nIHRoZSBtYXRoIG9iamVjdCB0byByYW5kb21seSBwaWNrIGEgbnVtYmVyIGJldHdlZW4gMSAtIDExLCBhbmQgdGhlbiBhcHBseWluZyB0aGUgZm9ybXVsYSAoNW4tMyk1IHRvIHRoaXMgbnVtYmVyLCB3aGljaCBsZWF2ZXMgdXMgd2l0aCBhIHJhbmRvbWx5IHNlbGVjdGVkIG51bWJlciB0aGF0IGlzIGFwcGxpZWQgdG8gdGhlIDx1bD4gKGkuZS4gLTE4NSkgYW5kIGNvcnJlc3BvbmRzIHRvIHRoZSBwb3NpdGlvbiBvZiBhIHdvcmQgKG9yIDxsaT4gZWxlbWVudCwgaS5lLiBcIkknbSBGZWVsaW5nIEN1cmlvdXNcIikuXG4vLyAgICAgdmFyIHBvcyA9IC0oKE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMSkgKyAxKSkgKiA1IC0gMykgKiA1O1xuXG4vLyAgICAgaWYgKHBvcyA9PT0gLTEzNSkge1xuLy8gICAgICAgY29uc29sZS5sb2coXCJwb3NpdGlvbiBkaWRuJ3QgY2hhbmdlLCBsZXQncyBmb3JjZSBjaGFuZ2VcIilcbi8vICAgICAgIHBvcyA9IC0zNTtcbi8vICAgICB9XG5cbi8vICAgICAkKCcjc2VhcmNoX2J0bnMgYnV0dG9uOm50aC1jaGlsZCgyKSB1bCcpLmFuaW1hdGUoeyAnYm90dG9tJzogcG9zICsgJ3B4JyB9LCAzMDApO1xuXG4vLyAgICAgLy8gQ2hhbmdlIHRoZSB3aWR0aCBvZiB0aGUgYnV0dG9uIHRvIGZpdCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHdvcmQuXG4vLyAgICAgaWYgKHBvcyA9PT0gLTM1IHx8IHBvcyA9PT0gLTExMCB8fCBwb3MgPT09IC0xODUgfHwgcG9zID09PSAtMTAgfHwgcG9zID09PSAtNjAgfHwgcG9zID09PSAtMTYwKSB7XG4vLyAgICAgICBjb25zb2xlLmxvZyhwb3MgKyAnID0gLTM1LCAtMTEwLCAtMTg1LCAtMTAsIC02MCwgLTE2MCcpO1xuLy8gICAgICAgJCgnI3NlYXJjaF9idG5zIGJ1dHRvbjpudGgtY2hpbGQoMiknKS5jc3MoJ3dpZHRoJywgJzE0OXB4Jyk7XG4vLyAgICAgfSBlbHNlIGlmIChwb3MgPT09IC04NSkge1xuLy8gICAgICAgY29uc29sZS5sb2cocG9zICsgJyA9IC04NScpO1xuLy8gICAgICAgJCgnI3NlYXJjaF9idG5zIGJ1dHRvbjpudGgtY2hpbGQoMiknKS5jc3MoJ3dpZHRoJywgJzE2MHB4Jyk7XG4vLyAgICAgfSBlbHNlIGlmIChwb3MgPT09IC0yMTApIHtcbi8vICAgICAgIGNvbnNvbGUubG9nKHBvcyArICcgPSAtMjEwJyk7XG4vLyAgICAgICAkKCcjc2VhcmNoX2J0bnMgYnV0dG9uOm50aC1jaGlsZCgyKScpLmNzcygnd2lkdGgnLCAnMTY1cHgnKTtcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgY29uc29sZS5sb2cocG9zICsgJyA9IC0yNjAsIC0yMzUnKTtcbi8vICAgICAgICQoJyNzZWFyY2hfYnRucyBidXR0b246bnRoLWNoaWxkKDIpJykuY3NzKCd3aWR0aCcsICcxNDRweCcpO1xuLy8gICAgIH1cbi8vICAgfSwgMjAwKTtcbi8vIH0pO1xuXG4vLyBGSVJTVCBHRVQgUkVRVUVTVFxuZnVuY3Rpb24gZmV0Y2hTZWFyY2hSZXN1bHRzKHNlYXJjaFF1ZXJ5KSB7XG4gIGF4aW9zKHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogYGh0dHBzOi8vYXBpLnNwb29uYWN1bGFyLmNvbS9yZWNpcGVzL2NvbXBsZXhTZWFyY2g/YXBpS2V5PSR7YXBwX2tleX0mbnVtYmVyPTEwMDAmYWRkUmVjaXBlSW5mb3JtYXRpb249dHJ1ZSZpbmNsdWRlSW5ncmVkaWVudHM9JHtzZWFyY2hRdWVyeX1gXG4gIH0pXG4gICAgLnRoZW4ocmVzID0+IHtcbiAgICAgIHNlYXJjaENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBnZW5lcmF0ZVJlc3VsdHMocmVzLmRhdGEucmVzdWx0cylcblxuICAgICAgc2VhcmNoSW5wdXQudmFsdWUgPSBzZWFyY2hRdWVyeTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ28nKS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmlsaXR5Jyk7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtZmlsdGVyLWNvbnRhaW5lcicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2liaWxpdHknKTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29scycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2liaWxpdHknKTtcblxuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxufVxuXG5sZXQgc3RhdGUgPSBmYWxzZTtcbnRvb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHN0YXRlID0gdHJ1ZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyLWNvbnRhaW5lcicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2liaWxpdHknKTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZSA9IGZhbHNlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXItY29udGFpbmVyJykuY2xhc3NMaXN0LmFkZCgndmlzaWJpbGl0eScpO1xuICB9XG4gIHNlYXJjaElucHV0LnZhbHVlID0gc2VhcmNoUXVlcnk7XG59KTtcblxuLy8gU0VDT05EIEdFVCBSRVFVRVNUIC8vXG5cbmZpbHRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgLy8gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBsZXQgZXhjbHVkZVF1ZXJ5ID0gZXhjbHVkZUlucHV0LnZhbHVlO1xuICBsZXQgdHlwZSA9IG1lYWxUeXBlLnZhbHVlO1xuICBsZXQgZGlldCA9IGRpZXRzLnZhbHVlO1xuICBmZXRjaEZpbHRlcmVkU2VhcmNoUmVzdWx0cyhzZWFyY2hRdWVyeSwgZXhjbHVkZVF1ZXJ5LCB0eXBlLCBkaWV0KTtcbn0pXG5cbmV4Y2x1ZGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChlKSA9PiB7XG4gIC8vIGUucHJldmVudERlZmF1bHQoKTtcbiAgbGV0IGV4Y2x1ZGVRdWVyeSA9IGV4Y2x1ZGVJbnB1dC52YWx1ZTtcbiAgbGV0IHR5cGUgPSBtZWFsVHlwZS52YWx1ZTtcbiAgbGV0IGRpZXQgPSBkaWV0cy52YWx1ZTtcbiAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgZmV0Y2hGaWx0ZXJlZFNlYXJjaFJlc3VsdHMoc2VhcmNoUXVlcnksIGV4Y2x1ZGVRdWVyeSwgdHlwZSwgZGlldCk7XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGZldGNoRmlsdGVyZWRTZWFyY2hSZXN1bHRzKHNlYXJjaFF1ZXJ5LCBleGNsdWRlUXVlcnksIHR5cGUsIGRpZXQpIHtcbiAgYXhpb3Moe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiBgL3JlY2lwZXMvJHtzZWFyY2hRdWVyeX0vZmlsdGVyYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIHNlYXJjaFF1ZXJ5OiBzZWFyY2hRdWVyeSxcbiAgICAgIGV4Y2x1ZGVRdWVyeTogZXhjbHVkZVF1ZXJ5LFxuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIGRpZXQ6IGRpZXRcbiAgICB9XG4gIH0pXG4gICAgLnRoZW4ocmVzID0+IHtcbiAgICAgIGdlbmVyYXRlUmVzdWx0cyhyZXMuZGF0YS5yZXN1bHRzKVxuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxufVxuXG5zZWFyY2hYLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICBzZWFyY2hJbnB1dC52YWx1ZSA9IFwiXCI7XG59KVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJlc3VsdHMocmVzdWx0cykge1xuXG4gIGxldCBnZW5lcmF0ZWRSZXN1bHRzID0gYDxwPiR7cmVzdWx0cy5sZW5ndGh9IHJlc3VsdHMgKDAuMTMgc2Vjb25kcyk8L3A+YDtcblxuICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICBjb25zdCByZXN1bHRJdGVtID1cbiAgICAgIGA8ZGl2IGNsYXNzPVwicmVzdWx0XCI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cInVybFwiPiR7cmVzdWx0LnNvdXJjZVVybH08L3A+XG4gICAgICAgICAgICA8YSBocmVmPSR7cmVzdWx0LnNvdXJjZVVybH0gdGFyZ2V0PVwiX2JsYW5rXCI+PGgzIGNsYXNzPVwidGl0bGVcIj4ke3Jlc3VsdC50aXRsZX08L2gzPjwvYT5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwic3VtbWFyeVwiPiR7cmVzdWx0LnN1bW1hcnl9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJlc3VsdC1saW5rc1wiPlxuICAgICAgICAgICAgICAgIDxwPiR7cmVzdWx0LnJlYWR5SW5NaW51dGVzfSBtaW51dGVzPC9wPlxuICAgICAgICAgICAgICAgIDxwPiR7cmVzdWx0LnNlcnZpbmdzfSBzZXJ2aW5nczwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5gXG4gICAgZ2VuZXJhdGVkUmVzdWx0cyArPSByZXN1bHRJdGVtO1xuICB9KTtcblxuICBzZWFyY2hSZXN1bHRzLmlubmVySFRNTCA9IGdlbmVyYXRlZFJlc3VsdHM7XG59Il0sIm5hbWVzIjpbInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwiYXBwX2lkIiwiYXBwX2tleSIsImdvb2dsZV9jbGllbnRfaWQiLCJnb29nbGVfY2xpZW50X3NlY3JldCIsImdvb2dsZV9yZWRpcmVjdF91cmkiLCJnb29nbGVfcmVmcmVzaF90b2tlbiIsInV0aWxzIiwic2V0dGxlIiwiY29va2llcyIsImJ1aWxkVVJMIiwiYnVpbGRGdWxsUGF0aCIsInBhcnNlSGVhZGVycyIsImlzVVJMU2FtZU9yaWdpbiIsImNyZWF0ZUVycm9yIiwiZGVmYXVsdHMiLCJDYW5jZWwiLCJ4aHJBZGFwdGVyIiwiY29uZmlnIiwiUHJvbWlzZSIsImRpc3BhdGNoWGhyUmVxdWVzdCIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0RGF0YSIsImRhdGEiLCJyZXF1ZXN0SGVhZGVycyIsImhlYWRlcnMiLCJyZXNwb25zZVR5cGUiLCJvbkNhbmNlbGVkIiwiZG9uZSIsImNhbmNlbFRva2VuIiwidW5zdWJzY3JpYmUiLCJzaWduYWwiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaXNGb3JtRGF0YSIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsImF1dGgiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwidW5lc2NhcGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJBdXRob3JpemF0aW9uIiwiYnRvYSIsImZ1bGxQYXRoIiwiYmFzZVVSTCIsInVybCIsIm9wZW4iLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsInBhcmFtcyIsInBhcmFtc1NlcmlhbGl6ZXIiLCJ0aW1lb3V0Iiwib25sb2FkZW5kIiwicmVzcG9uc2VIZWFkZXJzIiwiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VUZXh0IiwicmVzcG9uc2UiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwiX3Jlc29sdmUiLCJ2YWx1ZSIsIl9yZWplY3QiLCJlcnIiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJoYW5kbGVMb2FkIiwicmVhZHlTdGF0ZSIsInJlc3BvbnNlVVJMIiwiaW5kZXhPZiIsInNldFRpbWVvdXQiLCJvbmFib3J0IiwiaGFuZGxlQWJvcnQiLCJvbmVycm9yIiwiaGFuZGxlRXJyb3IiLCJvbnRpbWVvdXQiLCJoYW5kbGVUaW1lb3V0IiwidGltZW91dEVycm9yTWVzc2FnZSIsInRyYW5zaXRpb25hbCIsImNsYXJpZnlUaW1lb3V0RXJyb3IiLCJpc1N0YW5kYXJkQnJvd3NlckVudiIsInhzcmZWYWx1ZSIsIndpdGhDcmVkZW50aWFscyIsInhzcmZDb29raWVOYW1lIiwicmVhZCIsInVuZGVmaW5lZCIsInhzcmZIZWFkZXJOYW1lIiwiZm9yRWFjaCIsInNldFJlcXVlc3RIZWFkZXIiLCJ2YWwiLCJrZXkiLCJ0b0xvd2VyQ2FzZSIsImlzVW5kZWZpbmVkIiwib25Eb3dubG9hZFByb2dyZXNzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uVXBsb2FkUHJvZ3Jlc3MiLCJ1cGxvYWQiLCJjYW5jZWwiLCJ0eXBlIiwiYWJvcnQiLCJzdWJzY3JpYmUiLCJhYm9ydGVkIiwic2VuZCIsImJpbmQiLCJBeGlvcyIsIm1lcmdlQ29uZmlnIiwiY3JlYXRlSW5zdGFuY2UiLCJkZWZhdWx0Q29uZmlnIiwiY29udGV4dCIsImluc3RhbmNlIiwicHJvdG90eXBlIiwiZXh0ZW5kIiwiY3JlYXRlIiwiaW5zdGFuY2VDb25maWciLCJheGlvcyIsIkNhbmNlbFRva2VuIiwiaXNDYW5jZWwiLCJWRVJTSU9OIiwidmVyc2lvbiIsImFsbCIsInByb21pc2VzIiwic3ByZWFkIiwiaXNBeGlvc0Vycm9yIiwiZGVmYXVsdCIsIm1lc3NhZ2UiLCJ0b1N0cmluZyIsIl9fQ0FOQ0VMX18iLCJleGVjdXRvciIsIlR5cGVFcnJvciIsInJlc29sdmVQcm9taXNlIiwicHJvbWlzZSIsInByb21pc2VFeGVjdXRvciIsInRva2VuIiwidGhlbiIsIl9saXN0ZW5lcnMiLCJpIiwibCIsImxlbmd0aCIsIm9uZnVsZmlsbGVkIiwicmVhc29uIiwidGhyb3dJZlJlcXVlc3RlZCIsImxpc3RlbmVyIiwicHVzaCIsImluZGV4Iiwic3BsaWNlIiwic291cmNlIiwiYyIsIkludGVyY2VwdG9yTWFuYWdlciIsImRpc3BhdGNoUmVxdWVzdCIsInZhbGlkYXRvciIsInZhbGlkYXRvcnMiLCJpbnRlcmNlcHRvcnMiLCJhcmd1bWVudHMiLCJhc3NlcnRPcHRpb25zIiwic2lsZW50SlNPTlBhcnNpbmciLCJib29sZWFuIiwiZm9yY2VkSlNPTlBhcnNpbmciLCJyZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbiIsInN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyIsInVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzIiwiaW50ZXJjZXB0b3IiLCJydW5XaGVuIiwic3luY2hyb25vdXMiLCJ1bnNoaWZ0IiwiZnVsZmlsbGVkIiwicmVqZWN0ZWQiLCJyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4iLCJwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMiLCJjaGFpbiIsIkFycmF5IiwiYXBwbHkiLCJjb25jYXQiLCJzaGlmdCIsIm5ld0NvbmZpZyIsIm9uRnVsZmlsbGVkIiwib25SZWplY3RlZCIsImVycm9yIiwiZ2V0VXJpIiwicmVwbGFjZSIsImZvckVhY2hNZXRob2ROb0RhdGEiLCJmb3JFYWNoTWV0aG9kV2l0aERhdGEiLCJoYW5kbGVycyIsInVzZSIsIm9wdGlvbnMiLCJlamVjdCIsImlkIiwiZm4iLCJmb3JFYWNoSGFuZGxlciIsImgiLCJpc0Fic29sdXRlVVJMIiwiY29tYmluZVVSTHMiLCJyZXF1ZXN0ZWRVUkwiLCJlbmhhbmNlRXJyb3IiLCJjb2RlIiwiRXJyb3IiLCJ0cmFuc2Zvcm1EYXRhIiwidGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZCIsImNhbGwiLCJ0cmFuc2Zvcm1SZXF1ZXN0IiwibWVyZ2UiLCJjb21tb24iLCJjbGVhbkhlYWRlckNvbmZpZyIsImFkYXB0ZXIiLCJvbkFkYXB0ZXJSZXNvbHV0aW9uIiwidHJhbnNmb3JtUmVzcG9uc2UiLCJvbkFkYXB0ZXJSZWplY3Rpb24iLCJ0b0pTT04iLCJuYW1lIiwiZGVzY3JpcHRpb24iLCJudW1iZXIiLCJmaWxlTmFtZSIsImxpbmVOdW1iZXIiLCJjb2x1bW5OdW1iZXIiLCJzdGFjayIsImNvbmZpZzEiLCJjb25maWcyIiwiZ2V0TWVyZ2VkVmFsdWUiLCJ0YXJnZXQiLCJpc1BsYWluT2JqZWN0IiwiaXNBcnJheSIsInNsaWNlIiwibWVyZ2VEZWVwUHJvcGVydGllcyIsInByb3AiLCJ2YWx1ZUZyb21Db25maWcyIiwiZGVmYXVsdFRvQ29uZmlnMiIsIm1lcmdlRGlyZWN0S2V5cyIsIm1lcmdlTWFwIiwiT2JqZWN0Iiwia2V5cyIsImNvbXB1dGVDb25maWdWYWx1ZSIsImNvbmZpZ1ZhbHVlIiwidmFsaWRhdGVTdGF0dXMiLCJmbnMiLCJ0cmFuc2Zvcm0iLCJub3JtYWxpemVIZWFkZXJOYW1lIiwiREVGQVVMVF9DT05URU5UX1RZUEUiLCJzZXRDb250ZW50VHlwZUlmVW5zZXQiLCJnZXREZWZhdWx0QWRhcHRlciIsInN0cmluZ2lmeVNhZmVseSIsInJhd1ZhbHVlIiwicGFyc2VyIiwiZW5jb2RlciIsImlzU3RyaW5nIiwiSlNPTiIsInBhcnNlIiwidHJpbSIsImUiLCJzdHJpbmdpZnkiLCJpc0FycmF5QnVmZmVyIiwiaXNCdWZmZXIiLCJpc1N0cmVhbSIsImlzRmlsZSIsImlzQmxvYiIsImlzQXJyYXlCdWZmZXJWaWV3IiwiYnVmZmVyIiwiaXNVUkxTZWFyY2hQYXJhbXMiLCJpc09iamVjdCIsInN0cmljdEpTT05QYXJzaW5nIiwibWF4Q29udGVudExlbmd0aCIsIm1heEJvZHlMZW5ndGgiLCJ0aGlzQXJnIiwid3JhcCIsImFyZ3MiLCJlbmNvZGUiLCJzZXJpYWxpemVkUGFyYW1zIiwicGFydHMiLCJzZXJpYWxpemUiLCJwYXJzZVZhbHVlIiwidiIsImlzRGF0ZSIsInRvSVNPU3RyaW5nIiwiam9pbiIsImhhc2htYXJrSW5kZXgiLCJyZWxhdGl2ZVVSTCIsInN0YW5kYXJkQnJvd3NlckVudiIsIndyaXRlIiwiZXhwaXJlcyIsInBhdGgiLCJkb21haW4iLCJzZWN1cmUiLCJjb29raWUiLCJpc051bWJlciIsIkRhdGUiLCJ0b0dNVFN0cmluZyIsImRvY3VtZW50IiwibWF0Y2giLCJSZWdFeHAiLCJkZWNvZGVVUklDb21wb25lbnQiLCJyZW1vdmUiLCJub3ciLCJub25TdGFuZGFyZEJyb3dzZXJFbnYiLCJ0ZXN0IiwicGF5bG9hZCIsIm1zaWUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ1cmxQYXJzaW5nTm9kZSIsImNyZWF0ZUVsZW1lbnQiLCJvcmlnaW5VUkwiLCJyZXNvbHZlVVJMIiwiaHJlZiIsInNldEF0dHJpYnV0ZSIsInByb3RvY29sIiwiaG9zdCIsInNlYXJjaCIsImhhc2giLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsImNoYXJBdCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVxdWVzdFVSTCIsInBhcnNlZCIsIm5vcm1hbGl6ZWROYW1lIiwicHJvY2Vzc0hlYWRlciIsImlnbm9yZUR1cGxpY2F0ZU9mIiwic3BsaXQiLCJsaW5lIiwic3Vic3RyIiwiY2FsbGJhY2siLCJhcnIiLCJ0aGluZyIsImRlcHJlY2F0ZWRXYXJuaW5ncyIsImZvcm1hdE1lc3NhZ2UiLCJvcHQiLCJkZXNjIiwib3B0cyIsImNvbnNvbGUiLCJ3YXJuIiwic2NoZW1hIiwiYWxsb3dVbmtub3duIiwicmVzdWx0IiwiY29uc3RydWN0b3IiLCJGb3JtRGF0YSIsIkFycmF5QnVmZmVyIiwiaXNWaWV3IiwiZ2V0UHJvdG90eXBlT2YiLCJpc0Z1bmN0aW9uIiwicGlwZSIsIlVSTFNlYXJjaFBhcmFtcyIsInN0ciIsInByb2R1Y3QiLCJvYmoiLCJoYXNPd25Qcm9wZXJ0eSIsImFzc2lnblZhbHVlIiwiYSIsImIiLCJzdHJpcEJPTSIsImNvbnRlbnQiLCJjaGFyQ29kZUF0IiwicnVudGltZSIsIk9wIiwiaGFzT3duIiwiJFN5bWJvbCIsIlN5bWJvbCIsIml0ZXJhdG9yU3ltYm9sIiwiaXRlcmF0b3IiLCJhc3luY0l0ZXJhdG9yU3ltYm9sIiwiYXN5bmNJdGVyYXRvciIsInRvU3RyaW5nVGFnU3ltYm9sIiwidG9TdHJpbmdUYWciLCJkZWZpbmUiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImlubmVyRm4iLCJvdXRlckZuIiwic2VsZiIsInRyeUxvY3NMaXN0IiwicHJvdG9HZW5lcmF0b3IiLCJHZW5lcmF0b3IiLCJnZW5lcmF0b3IiLCJDb250ZXh0IiwiX2ludm9rZSIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsImFyZyIsIkdlblN0YXRlU3VzcGVuZGVkU3RhcnQiLCJHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkIiwiR2VuU3RhdGVFeGVjdXRpbmciLCJHZW5TdGF0ZUNvbXBsZXRlZCIsIkNvbnRpbnVlU2VudGluZWwiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwiSXRlcmF0b3JQcm90b3R5cGUiLCJnZXRQcm90byIsIk5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlIiwidmFsdWVzIiwiR3AiLCJkaXNwbGF5TmFtZSIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwibWFyayIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiYXdyYXAiLCJfX2F3YWl0IiwiQXN5bmNJdGVyYXRvciIsIlByb21pc2VJbXBsIiwiaW52b2tlIiwicmVjb3JkIiwidW53cmFwcGVkIiwicHJldmlvdXNQcm9taXNlIiwiZW5xdWV1ZSIsImNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnIiwiYXN5bmMiLCJpdGVyIiwibmV4dCIsInN0YXRlIiwiZG9uZVJlc3VsdCIsImRlbGVnYXRlIiwiZGVsZWdhdGVSZXN1bHQiLCJtYXliZUludm9rZURlbGVnYXRlIiwic2VudCIsIl9zZW50IiwiZGlzcGF0Y2hFeGNlcHRpb24iLCJhYnJ1cHQiLCJpbmZvIiwicmVzdWx0TmFtZSIsIm5leHRMb2MiLCJwdXNoVHJ5RW50cnkiLCJsb2NzIiwiZW50cnkiLCJ0cnlMb2MiLCJjYXRjaExvYyIsImZpbmFsbHlMb2MiLCJhZnRlckxvYyIsInRyeUVudHJpZXMiLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0Iiwib2JqZWN0IiwicmV2ZXJzZSIsInBvcCIsIml0ZXJhYmxlIiwiaXRlcmF0b3JNZXRob2QiLCJpc05hTiIsInNraXBUZW1wUmVzZXQiLCJwcmV2Iiwic3RvcCIsInJvb3RFbnRyeSIsInJvb3RSZWNvcmQiLCJydmFsIiwiZXhjZXB0aW9uIiwiaGFuZGxlIiwibG9jIiwiY2F1Z2h0IiwiaGFzQ2F0Y2giLCJoYXNGaW5hbGx5IiwiZmluYWxseUVudHJ5IiwiY29tcGxldGUiLCJmaW5pc2giLCJ0aHJvd24iLCJkZWxlZ2F0ZVlpZWxkIiwicmVnZW5lcmF0b3JSdW50aW1lIiwiYWNjaWRlbnRhbFN0cmljdE1vZGUiLCJnbG9iYWxUaGlzIiwiRnVuY3Rpb24iLCJob3dJdFdvcmtzIiwicXVlcnlTZWxlY3RvciIsIm1vZGFsQmciLCJtb2RhbFgiLCJnZXRFbGVtZW50QnlJZCIsIm1vZGFsQ2xpY2siLCJjbGFzc0xpc3QiLCJhZGQiLCJjbG9zZU1vZGFsIiwiY2xpY2tPdXRzaWRlIiwic2VhcmNoSW5wdXQiLCJtYWluU2VhcmNoSW5wdXQiLCJzZWFyY2hDb250YWluZXIiLCJzZWFyY2hSZXN1bHRzQ29udGFpbmVyIiwic2VhcmNoUmVzdWx0cyIsInNjcm9vcGxlU2VhcmNoQnRuIiwiZmVlbGluZ0x1Y2t5QnRuIiwiZmVlbGluZ0x1Y2t5TGlzdCIsInRvb2xzIiwibG9hZGVyQ29udGFpbmVyIiwic2VhcmNoWCIsImZpbHRlciIsImV4Y2x1ZGVJbnB1dCIsIm1lYWxUeXBlIiwiZGlldHMiLCJzZWFyY2hRdWVyeSIsImZldGNoU2VhcmNoUmVzdWx0cyIsInBvcyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInJlcyIsInN0eWxlIiwiZGlzcGxheSIsImdlbmVyYXRlUmVzdWx0cyIsInJlc3VsdHMiLCJjYXRjaCIsImxvZyIsImV4Y2x1ZGVRdWVyeSIsImRpZXQiLCJmZXRjaEZpbHRlcmVkU2VhcmNoUmVzdWx0cyIsImdlbmVyYXRlZFJlc3VsdHMiLCJyZXN1bHRJdGVtIiwic291cmNlVXJsIiwidGl0bGUiLCJzdW1tYXJ5IiwicmVhZHlJbk1pbnV0ZXMiLCJzZXJ2aW5ncyIsImlubmVySFRNTCJdLCJzb3VyY2VSb290IjoiIn0=