/*
 * tcial.js
 * the cake is a lie, but the cookie isn't
 *
 * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  https://github.com/SimonWaldherr/tcial.js
 * Version: 0.1.0
 */

/*jslint browser: true, plusplus: true, unparam: true, indent: 2 */

var tcial = {};

tcial = {
  esc: window.escape !== undefined ? window.escape : encodeURIComponent,
  unesc: window.unescape !== undefined ? window.unescape : decodeURIComponent,
  get: function (sKey) {
    "use strict";
    var retvalue;
    if (!sKey || !tcial.has(sKey)) {
      return null;
    }
    retvalue = document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + tcial.esc(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1");
    return tcial.unesc(retvalue);
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
    var oExpDate;
    if (!sKey || !tcial.has(sKey)) {
      return;
    }
    oExpDate = new Date();
    oExpDate.setDate(oExpDate.getDate() - 1);
    document.cookie = window.escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; path=";
  },
  has: function (sKey) {
    "use strict";
    return (new RegExp("(?:^|;\\s*)" + window.escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  list: function () {
    "use strict";
    var cookieArray = document.cookie.split(';'), oarray = [], tmp, i;
    for (i = 0; i < cookieArray.length; i++) {
      tmp = cookieArray[i].split('=', 2);
      oarray[i] = {};
      oarray[i].key = tmp[0];
      oarray[i].value = tmp[1];
    }
    return oarray;
  },
  lsHasItem: function (sKey) {
    "use strict";
    if (localStorage.getItem(sKey) === null) {
      return false;
    }
    return true;
  },
  lsListItems: function () {
    "use strict";
    var i, oarray = [];
    for (i = 0; i < localStorage.length; i++) {
      oarray[i] = {};
      oarray[i].key = localStorage.key(i);
      oarray[i].value = localStorage.getItem(localStorage.key(i));
    }
    return oarray;
  },
  getItem: localStorage.getItem !== undefined ? function (sKey) {
    "use strict";
    return localStorage.getItem(sKey);
  } : function (sKey) {
    "use strict";
    return tcial.get(sKey);
  },
  setItem: localStorage.setItem !== undefined ? function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    "use strict";
    return localStorage.setItem(sKey, sValue);
  } : function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    "use strict";
    return tcial.set(sKey, sValue, vEnd, sPath, sDomain, bSecure);
  },
  hasItem: localStorage.getItem !== undefined ? function (sKey) {
    "use strict";
    return tcial.lsHasItem(sKey);
  } : function (sKey) {
    "use strict";
    return tcial.has(sKey);
  },
  listItems: localStorage.getItem !== undefined ? function () {
    "use strict";
    return tcial.lsListItems();
  } : function () {
    "use strict";
    return tcial.list();
  },
  removeItem: localStorage.removeItem !== undefined ? function (sKey) {
    "use strict";
    return localStorage.removeItem(sKey);
  } : function (sKey) {
    "use strict";
    return tcial.remove(sKey);
  }
};

