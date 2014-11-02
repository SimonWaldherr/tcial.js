/*
 * tcial.js
 * the cake is a lie, but the cookie isn't
 *
 * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  https://github.com/SimonWaldherr/tcial.js
 * Version: 0.1.3
 */

/*jslint browser: true, plusplus: true, unparam: true, indent: 2 */

/* modes:
0: auto
1: localStorage
2: Cookie
3: URL-Hash
*/

var tcial = {};

tcial = {
  mode: 0,
  other: {
    esc: window.escape !== undefined ? window.escape : encodeURIComponent,
    unesc: window.unescape !== undefined ? window.unescape : decodeURIComponent,
    htmldecode: function (string) {
      "use strict";
      var div = document.createElement('div');
      div.innerHTML = string;
      string = div.innerText || div.textContent;
      div = undefined;
      return string;
    },
    htmlencode: function (string) {
      "use strict";
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(string));
      string = div.innerHTML;
      div = undefined;
      return string;
    },
    cookieEnabled: function () {
      "use strict";
      var ret;
      if (navigator.cookieEnabled) {
        return true;
      }
      document.cookie = "cookietest=1";
      ret = document.cookie.indexOf("cookietest=") !== -1;
      document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return ret;
    },
    setTcialMode: function () {
      "use strict";
      if (localStorage.getItem !== undefined) {
        tcial.mode = 1;
      } else if (tcial.other.cookieEnabled()) {
        tcial.mode = 2;
      } else {
        tcial.mode = 3;
      }
    }
  },
  cookie: {
    get: function (sKey) {
      "use strict";
      var retvalue;
      if (!sKey || !tcial.cookie.has(sKey)) {
        return null;
      }
      retvalue = document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + tcial.other.esc(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1");
      return tcial.other.unesc(retvalue);
    },
    set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      "use strict";
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/.test(sKey)) {
        return;
      }
      var sExpires = "";
      if (vEnd) {
        switch (typeof vEnd) {
        case "number":
          sExpires = "; max-age=" + vEnd;
          break;
        case "string":
          sExpires = "; expires=" + vEnd;
          break;
        case "object":
          if (vEnd.hasOwnProperty("toGMTString")) {
            sExpires = "; expires=" + vEnd.toGMTString();
          }
          break;
        }
      }
      if (sPath === undefined) {
        sPath = "/";
      }
      document.cookie = window.escape(sKey) + "=" + window.escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    },
    remove: function (sKey) {
      "use strict";
      if (!sKey || !tcial.cookie.has(sKey)) {
        return;
      }
      tcial.cookie.set(sKey, '', 'Thu, 01-Jan-1970 00:00:01 GMT');
    },
    has: function (sKey) {
      "use strict";
      return (new RegExp("(?:^|;\\s*)" + window.escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    list: function () {
      "use strict";
      var cookieArray = document.cookie.split(';'),
        values = cookieArray.length,
        oarray = [],
        tmp,
        i;
      for (i = 0; i < values; i++) {
        tmp = cookieArray[i].split('=', 2);
        if (tmp[1] !== undefined) {
          oarray[i] = {};
          oarray[i].key = tmp[0];
          oarray[i].value = tmp[1];
        }
      }
      return oarray;
    }
  },
  localstorage: {
    has: function (sKey) {
      "use strict";
      if (localStorage.getItem(sKey) === null) {
        return false;
      }
      return true;
    },
    list: function () {
      "use strict";
      var i,
        oarray = [],
        values = localStorage.length;
      if (values === 0) {
        return oarray;
      }
      for (i = 0; i < values; i++) {
        oarray[i] = {};
        oarray[i].key = localStorage.key(i);
        oarray[i].value = localStorage.getItem(localStorage.key(i));
      }
      return oarray;
    }
  },
  urlhash: {
    fromHash: function () {
      "use strict";
      var params = window.location.hash ? window.location.hash.substr(1).split("&") : [],
        paramsObject = {},
        i,
        a;
      for (i = 0; i < params.length; i++) {
        a = params[i].split("=");
        paramsObject[a[0]] =  decodeURIComponent(a[1]);
      }
      return paramsObject;
    },
    toHash: function (params) {
      "use strict";
      var str = [], p;
      for (p in params) {
        str.push(p + "=" + encodeURIComponent(params[p]));
      }
      window.location.hash = str.join("&");
    },
    get: function (sKey) {
      "use strict";
      var params = tcial.urlhash.fromHash(),
        oarray = [],
        p,
        i;
      if (sKey) {
        return params[sKey];
      }
      i = 0;
      for (p in params) {
        oarray[i] = {};
        oarray[i].key = p;
        oarray[i].value = params[p];
        i++;
      }
      return oarray;
    },
    setObject: function (newParams) {
      "use strict";
      var params = tcial.urlhash.fromHash(), p;
      for (p in newParams) {
        params[p] = newParams[p];
      }
      tcial.urlhash.toHash(params);
    },
    set: function (sKey, sValue) {
      "use strict";
      var params = tcial.urlhash.fromHash();
      params[sKey] = sValue;
      tcial.urlhash.toHash(params);
    },
    remove: function (removeParams) {
      "use strict";
      var params = tcial.urlhash.fromHash(),
        i;
      removeParams = (typeof removeParams === 'string') ? [removeParams] : removeParams;
      for (i = 0; i < removeParams.length; i++) {
        delete params[removeParams[i]];
      }
      tcial.urlhash.toHash(params);
    },
    has: function (sKey) {
      "use strict";
      var params = tcial.urlhash.fromHash();
      if (params.keys.indexOf(sKey) !== -1) {
        return true;
      }
      return false;
    },
    clear: function () {
      "use strict";
      tcial.urlhash.toHash({});
    }
  },
  getItem: function (sKey) {
    "use strict";
    switch (tcial.mode) {
    case 0:
      tcial.other.setTcialMode();
      return tcial.getItem(sKey);
    case 1:
      return localStorage.getItem(sKey);
    case 2:
      return tcial.cookie.get(sKey);
    case 3:
      return tcial.urlhash.get(sKey);
    }
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    "use strict";
    switch (tcial.mode) {
    case 0:
      tcial.other.setTcialMode();
      return tcial.setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure);
    case 1:
      return localStorage.setItem(sKey, sValue);
    case 2:
      return tcial.cookie.set(sKey, sValue, vEnd, sPath, sDomain, bSecure);
    case 3:
      return tcial.urlhash.set(sKey, sValue);
    }
  },
  hasItem: function (sKey) {
    "use strict";
    switch (tcial.mode) {
    case 0:
      tcial.other.setTcialMode();
      return tcial.hasItem(sKey);
    case 1:
      return tcial.localstorage.has(sKey);
    case 2:
      return tcial.cookie.has(sKey);
    case 3:
      return tcial.urlhash.has(sKey);
    }
  },
  removeItem: function (sKey) {
    "use strict";
    switch (tcial.mode) {
    case 0:
      tcial.other.setTcialMode();
      return tcial.removeItem(sKey);
    case 1:
      return localStorage.removeItem(sKey);
    case 2:
      return tcial.cookie.remove(sKey);
    case 3:
      return tcial.urlhash.remove(sKey);
    }
  },
  listItems: function () {
    "use strict";
    switch (tcial.mode) {
    case 0:
      tcial.other.setTcialMode();
      return tcial.listItems();
    case 1:
      return tcial.localstorage.list();
    case 2:
      return tcial.cookie.list();
    case 3:
      return tcial.urlhash.get();
    }
  },
  clearItems: function () {
    "use strict";
    switch (tcial.mode) {
    case 0:
      tcial.other.setTcialMode();
      return tcial.clearItems();
    case 1:
      
      break;
    case 2:
      
      break;
    case 3:
      
      break;
    }
  }
};

