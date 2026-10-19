function Qp(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var id = { exports: {} }, Au = {};
var gy;
function MS() {
  if (gy) return Au;
  gy = 1;
  var n = /* @__PURE__ */ Symbol.for("react.transitional.element"), i = /* @__PURE__ */ Symbol.for("react.fragment");
  function o(r, c, f) {
    var d = null;
    if (f !== void 0 && (d = "" + f), c.key !== void 0 && (d = "" + c.key), "key" in c) {
      f = {};
      for (var h in c)
        h !== "key" && (f[h] = c[h]);
    } else f = c;
    return c = f.ref, {
      $$typeof: n,
      type: r,
      key: d,
      ref: c !== void 0 ? c : null,
      props: f
    };
  }
  return Au.Fragment = i, Au.jsx = o, Au.jsxs = o, Au;
}
var my;
function zS() {
  return my || (my = 1, id.exports = MS()), id.exports;
}
var w = zS(), ud = { exports: {} }, Du = {}, od = { exports: {} }, rd = {};
var yy;
function AS() {
  return yy || (yy = 1, (function(n) {
    function i(O, j) {
      var Y = O.length;
      O.push(j);
      t: for (; 0 < Y; ) {
        var k = Y - 1 >>> 1, et = O[k];
        if (0 < c(et, j))
          O[k] = j, O[Y] = et, Y = k;
        else break t;
      }
    }
    function o(O) {
      return O.length === 0 ? null : O[0];
    }
    function r(O) {
      if (O.length === 0) return null;
      var j = O[0], Y = O.pop();
      if (Y !== j) {
        O[0] = Y;
        t: for (var k = 0, et = O.length, lt = et >>> 1; k < lt; ) {
          var dt = 2 * (k + 1) - 1, xt = O[dt], M = dt + 1, F = O[M];
          if (0 > c(xt, Y))
            M < et && 0 > c(F, xt) ? (O[k] = F, O[M] = Y, k = M) : (O[k] = xt, O[dt] = Y, k = dt);
          else if (M < et && 0 > c(F, Y))
            O[k] = F, O[M] = Y, k = M;
          else break t;
        }
      }
      return j;
    }
    function c(O, j) {
      var Y = O.sortIndex - j.sortIndex;
      return Y !== 0 ? Y : O.id - j.id;
    }
    if (n.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      n.unstable_now = function() {
        return f.now();
      };
    } else {
      var d = Date, h = d.now();
      n.unstable_now = function() {
        return d.now() - h;
      };
    }
    var p = [], v = [], y = 1, m = null, x = 3, S = !1, E = !1, z = !1, T = !1, C = typeof setTimeout == "function" ? setTimeout : null, U = typeof clearTimeout == "function" ? clearTimeout : null, _ = typeof setImmediate < "u" ? setImmediate : null;
    function D(O) {
      for (var j = o(v); j !== null; ) {
        if (j.callback === null) r(v);
        else if (j.startTime <= O)
          r(v), j.sortIndex = j.expirationTime, i(p, j);
        else break;
        j = o(v);
      }
    }
    function G(O) {
      if (z = !1, D(O), !E)
        if (o(p) !== null)
          E = !0, B || (B = !0, ut());
        else {
          var j = o(v);
          j !== null && L(G, j.startTime - O);
        }
    }
    var B = !1, H = -1, $ = 5, tt = -1;
    function ot() {
      return T ? !0 : !(n.unstable_now() - tt < $);
    }
    function nt() {
      if (T = !1, B) {
        var O = n.unstable_now();
        tt = O;
        var j = !0;
        try {
          t: {
            E = !1, z && (z = !1, U(H), H = -1), S = !0;
            var Y = x;
            try {
              e: {
                for (D(O), m = o(p); m !== null && !(m.expirationTime > O && ot()); ) {
                  var k = m.callback;
                  if (typeof k == "function") {
                    m.callback = null, x = m.priorityLevel;
                    var et = k(
                      m.expirationTime <= O
                    );
                    if (O = n.unstable_now(), typeof et == "function") {
                      m.callback = et, D(O), j = !0;
                      break e;
                    }
                    m === o(p) && r(p), D(O);
                  } else r(p);
                  m = o(p);
                }
                if (m !== null) j = !0;
                else {
                  var lt = o(v);
                  lt !== null && L(
                    G,
                    lt.startTime - O
                  ), j = !1;
                }
              }
              break t;
            } finally {
              m = null, x = Y, S = !1;
            }
            j = void 0;
          }
        } finally {
          j ? ut() : B = !1;
        }
      }
    }
    var ut;
    if (typeof _ == "function")
      ut = function() {
        _(nt);
      };
    else if (typeof MessageChannel < "u") {
      var J = new MessageChannel(), N = J.port2;
      J.port1.onmessage = nt, ut = function() {
        N.postMessage(null);
      };
    } else
      ut = function() {
        C(nt, 0);
      };
    function L(O, j) {
      H = C(function() {
        O(n.unstable_now());
      }, j);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(O) {
      O.callback = null;
    }, n.unstable_forceFrameRate = function(O) {
      0 > O || 125 < O ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : $ = 0 < O ? Math.floor(1e3 / O) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return x;
    }, n.unstable_next = function(O) {
      switch (x) {
        case 1:
        case 2:
        case 3:
          var j = 3;
          break;
        default:
          j = x;
      }
      var Y = x;
      x = j;
      try {
        return O();
      } finally {
        x = Y;
      }
    }, n.unstable_requestPaint = function() {
      T = !0;
    }, n.unstable_runWithPriority = function(O, j) {
      switch (O) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          O = 3;
      }
      var Y = x;
      x = O;
      try {
        return j();
      } finally {
        x = Y;
      }
    }, n.unstable_scheduleCallback = function(O, j, Y) {
      var k = n.unstable_now();
      switch (typeof Y == "object" && Y !== null ? (Y = Y.delay, Y = typeof Y == "number" && 0 < Y ? k + Y : k) : Y = k, O) {
        case 1:
          var et = -1;
          break;
        case 2:
          et = 250;
          break;
        case 5:
          et = 1073741823;
          break;
        case 4:
          et = 1e4;
          break;
        default:
          et = 5e3;
      }
      return et = Y + et, O = {
        id: y++,
        callback: j,
        priorityLevel: O,
        startTime: Y,
        expirationTime: et,
        sortIndex: -1
      }, Y > k ? (O.sortIndex = Y, i(v, O), o(p) === null && O === o(v) && (z ? (U(H), H = -1) : z = !0, L(G, Y - k))) : (O.sortIndex = et, i(p, O), E || S || (E = !0, B || (B = !0, ut()))), O;
    }, n.unstable_shouldYield = ot, n.unstable_wrapCallback = function(O) {
      var j = x;
      return function() {
        var Y = x;
        x = j;
        try {
          return O.apply(this, arguments);
        } finally {
          x = Y;
        }
      };
    };
  })(rd)), rd;
}
var py;
function DS() {
  return py || (py = 1, od.exports = AS()), od.exports;
}
var sd = { exports: {} }, Ct = {};
var vy;
function OS() {
  if (vy) return Ct;
  vy = 1;
  var n = /* @__PURE__ */ Symbol.for("react.transitional.element"), i = /* @__PURE__ */ Symbol.for("react.portal"), o = /* @__PURE__ */ Symbol.for("react.fragment"), r = /* @__PURE__ */ Symbol.for("react.strict_mode"), c = /* @__PURE__ */ Symbol.for("react.profiler"), f = /* @__PURE__ */ Symbol.for("react.consumer"), d = /* @__PURE__ */ Symbol.for("react.context"), h = /* @__PURE__ */ Symbol.for("react.forward_ref"), p = /* @__PURE__ */ Symbol.for("react.suspense"), v = /* @__PURE__ */ Symbol.for("react.memo"), y = /* @__PURE__ */ Symbol.for("react.lazy"), m = /* @__PURE__ */ Symbol.for("react.activity"), x = /* @__PURE__ */ Symbol.for("react.view_transition"), S = Symbol.iterator;
  function E(M) {
    return M === null || typeof M != "object" ? null : (M = S && M[S] || M["@@iterator"], typeof M == "function" ? M : null);
  }
  var z = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, T = Object.assign, C = {};
  function U(M, F, ht) {
    this.props = M, this.context = F, this.refs = C, this.updater = ht || z;
  }
  U.prototype.isReactComponent = {}, U.prototype.setState = function(M, F) {
    if (typeof M != "object" && typeof M != "function" && M != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, M, F, "setState");
  }, U.prototype.forceUpdate = function(M) {
    this.updater.enqueueForceUpdate(this, M, "forceUpdate");
  };
  function _() {
  }
  _.prototype = U.prototype;
  function D(M, F, ht) {
    this.props = M, this.context = F, this.refs = C, this.updater = ht || z;
  }
  var G = D.prototype = new _();
  G.constructor = D, T(G, U.prototype), G.isPureReactComponent = !0;
  var B = Array.isArray;
  function H() {
  }
  var $ = { H: null, A: null, T: null, S: null }, tt = Object.prototype.hasOwnProperty;
  function ot(M, F, ht) {
    var rt = ht.ref;
    return {
      $$typeof: n,
      type: M,
      key: F,
      ref: rt !== void 0 ? rt : null,
      props: ht
    };
  }
  function nt(M, F) {
    return ot(M.type, F, M.props);
  }
  function ut(M) {
    return typeof M == "object" && M !== null && M.$$typeof === n;
  }
  function J(M) {
    var F = { "=": "=0", ":": "=2" };
    return "$" + M.replace(/[=:]/g, function(ht) {
      return F[ht];
    });
  }
  var N = /\/+/g;
  function L(M, F) {
    return typeof M == "object" && M !== null && M.key != null ? J("" + M.key) : F.toString(36);
  }
  function O(M) {
    switch (M.status) {
      case "fulfilled":
        return M.value;
      case "rejected":
        throw M.reason;
      default:
        switch (typeof M.status == "string" ? M.then(H, H) : (M.status = "pending", M.then(
          function(F) {
            M.status === "pending" && (M.status = "fulfilled", M.value = F);
          },
          function(F) {
            M.status === "pending" && (M.status = "rejected", M.reason = F);
          }
        )), M.status) {
          case "fulfilled":
            return M.value;
          case "rejected":
            throw M.reason;
        }
    }
    throw M;
  }
  function j(M, F, ht, rt, W) {
    var ft = typeof M;
    (ft === "undefined" || ft === "boolean") && (M = null);
    var gt = !1;
    if (M === null) gt = !0;
    else
      switch (ft) {
        case "bigint":
        case "string":
        case "number":
          gt = !0;
          break;
        case "object":
          switch (M.$$typeof) {
            case n:
            case i:
              gt = !0;
              break;
            case y:
              return gt = M._init, j(
                gt(M._payload),
                F,
                ht,
                rt,
                W
              );
          }
      }
    if (gt)
      return W = W(M), gt = rt === "" ? "." + L(M, 0) : rt, B(W) ? (ht = "", gt != null && (ht = gt.replace(N, "$&/") + "/"), j(W, F, ht, "", function(bt) {
        return bt;
      })) : W != null && (ut(W) && (W = nt(
        W,
        ht + (W.key == null || M && M.key === W.key ? "" : ("" + W.key).replace(
          N,
          "$&/"
        ) + "/") + gt
      )), F.push(W)), 1;
    gt = 0;
    var st = rt === "" ? "." : rt + ":";
    if (B(M))
      for (var ct = 0; ct < M.length; ct++)
        rt = M[ct], ft = st + L(rt, ct), gt += j(
          rt,
          F,
          ht,
          ft,
          W
        );
    else if (ct = E(M), typeof ct == "function")
      for (M = ct.call(M), ct = 0; !(rt = M.next()).done; )
        rt = rt.value, ft = st + L(rt, ct++), gt += j(
          rt,
          F,
          ht,
          ft,
          W
        );
    else if (ft === "object") {
      if (typeof M.then == "function")
        return j(
          O(M),
          F,
          ht,
          rt,
          W
        );
      throw F = String(M), Error(
        "Objects are not valid as a React child (found: " + (F === "[object Object]" ? "object with keys {" + Object.keys(M).join(", ") + "}" : F) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return gt;
  }
  function Y(M, F, ht) {
    if (M == null) return M;
    var rt = [], W = 0;
    return j(M, rt, "", "", function(ft) {
      return F.call(ht, ft, W++);
    }), rt;
  }
  function k(M) {
    if (M._status === -1) {
      var F = M._result, ht = F();
      ht.then(
        function(rt) {
          (M._status === 0 || M._status === -1) && (M._status = 1, M._result = rt, ht.status === void 0 && (ht.status = "fulfilled", ht.value = rt));
        },
        function(rt) {
          (M._status === 0 || M._status === -1) && (M._status = 2, M._result = rt, ht.status === void 0 && (ht.status = "rejected", ht.reason = rt));
        }
      ), M._status === -1 && (M._status = 0, M._result = ht);
    }
    if (M._status === 1) return M._result.default;
    throw M._result;
  }
  var et = typeof reportError == "function" ? reportError : function(M) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var F = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof M == "object" && M !== null && typeof M.message == "string" ? String(M.message) : String(M),
        error: M
      });
      if (!window.dispatchEvent(F)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", M);
      return;
    }
    console.error(M);
  };
  function lt(M) {
    var F = $.T, ht = {};
    ht.types = F !== null ? F.types : null, $.T = ht;
    try {
      var rt = M(), W = $.S;
      W !== null && W(ht, rt), typeof rt == "object" && rt !== null && typeof rt.then == "function" && rt.then(H, et);
    } catch (ft) {
      et(ft);
    } finally {
      F !== null && ht.types !== null && (F.types = ht.types), $.T = F;
    }
  }
  function dt(M) {
    var F = $.T;
    if (F !== null) {
      var ht = F.types;
      ht === null ? F.types = [M] : ht.indexOf(M) === -1 && ht.push(M);
    } else lt(dt.bind(null, M));
  }
  var xt = {
    map: Y,
    forEach: function(M, F, ht) {
      Y(
        M,
        function() {
          F.apply(this, arguments);
        },
        ht
      );
    },
    count: function(M) {
      var F = 0;
      return Y(M, function() {
        F++;
      }), F;
    },
    toArray: function(M) {
      return Y(M, function(F) {
        return F;
      }) || [];
    },
    only: function(M) {
      if (!ut(M))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return M;
    }
  };
  return Ct.Activity = m, Ct.Children = xt, Ct.Component = U, Ct.Fragment = o, Ct.Profiler = c, Ct.PureComponent = D, Ct.StrictMode = r, Ct.Suspense = p, Ct.ViewTransition = x, Ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = $, Ct.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(M) {
      return $.H.useMemoCache(M);
    }
  }, Ct.addTransitionType = dt, Ct.cache = function(M) {
    return function() {
      return M.apply(null, arguments);
    };
  }, Ct.cacheSignal = function() {
    return null;
  }, Ct.cloneElement = function(M, F, ht) {
    if (M == null)
      throw Error(
        "The argument must be a React element, but you passed " + M + "."
      );
    var rt = T({}, M.props), W = M.key;
    if (F != null)
      for (ft in F.key !== void 0 && (W = "" + F.key), F)
        !tt.call(F, ft) || ft === "key" || ft === "__self" || ft === "__source" || ft === "ref" && F.ref === void 0 || (rt[ft] = F[ft]);
    var ft = arguments.length - 2;
    if (ft === 1) rt.children = ht;
    else if (1 < ft) {
      for (var gt = Array(ft), st = 0; st < ft; st++)
        gt[st] = arguments[st + 2];
      rt.children = gt;
    }
    return ot(M.type, W, rt);
  }, Ct.createContext = function(M) {
    return M = {
      $$typeof: d,
      _currentValue: M,
      _currentValue2: M,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, M.Provider = M, M.Consumer = {
      $$typeof: f,
      _context: M
    }, M;
  }, Ct.createElement = function(M, F, ht) {
    var rt, W = {}, ft = null;
    if (F != null)
      for (rt in F.key !== void 0 && (ft = "" + F.key), F)
        tt.call(F, rt) && rt !== "key" && rt !== "__self" && rt !== "__source" && (W[rt] = F[rt]);
    var gt = arguments.length - 2;
    if (gt === 1) W.children = ht;
    else if (1 < gt) {
      for (var st = Array(gt), ct = 0; ct < gt; ct++)
        st[ct] = arguments[ct + 2];
      W.children = st;
    }
    if (M && M.defaultProps)
      for (rt in gt = M.defaultProps, gt)
        W[rt] === void 0 && (W[rt] = gt[rt]);
    return ot(M, ft, W);
  }, Ct.createRef = function() {
    return { current: null };
  }, Ct.forwardRef = function(M) {
    return { $$typeof: h, render: M };
  }, Ct.isValidElement = ut, Ct.lazy = function(M) {
    return {
      $$typeof: y,
      _payload: { _status: -1, _result: M },
      _init: k
    };
  }, Ct.memo = function(M, F) {
    return {
      $$typeof: v,
      type: M,
      compare: F === void 0 ? null : F
    };
  }, Ct.startTransition = lt, Ct.unstable_useCacheRefresh = function() {
    return $.H.useCacheRefresh();
  }, Ct.use = function(M) {
    return $.H.use(M);
  }, Ct.useActionState = function(M, F, ht) {
    return $.H.useActionState(M, F, ht);
  }, Ct.useCallback = function(M, F) {
    return $.H.useCallback(M, F);
  }, Ct.useContext = function(M) {
    return $.H.useContext(M);
  }, Ct.useDebugValue = function() {
  }, Ct.useDeferredValue = function(M, F) {
    return $.H.useDeferredValue(M, F);
  }, Ct.useEffect = function(M, F) {
    return $.H.useEffect(M, F);
  }, Ct.useEffectEvent = function(M) {
    return $.H.useEffectEvent(M);
  }, Ct.useId = function() {
    return $.H.useId();
  }, Ct.useImperativeHandle = function(M, F, ht) {
    return $.H.useImperativeHandle(M, F, ht);
  }, Ct.useInsertionEffect = function(M, F) {
    return $.H.useInsertionEffect(M, F);
  }, Ct.useLayoutEffect = function(M, F) {
    return $.H.useLayoutEffect(M, F);
  }, Ct.useMemo = function(M, F) {
    return $.H.useMemo(M, F);
  }, Ct.useOptimistic = function(M, F) {
    return $.H.useOptimistic(M, F);
  }, Ct.useReducer = function(M, F, ht) {
    return $.H.useReducer(M, F, ht);
  }, Ct.useRef = function(M) {
    return $.H.useRef(M);
  }, Ct.useState = function(M) {
    return $.H.useState(M);
  }, Ct.useSyncExternalStore = function(M, F, ht) {
    return $.H.useSyncExternalStore(
      M,
      F,
      ht
    );
  }, Ct.useTransition = function() {
    return $.H.useTransition();
  }, Ct.version = "19.3.0", Ct;
}
var xy;
function ku() {
  return xy || (xy = 1, sd.exports = OS()), sd.exports;
}
var cd = { exports: {} }, ze = {};
var by;
function RS() {
  if (by) return ze;
  by = 1;
  var n = ku();
  function i(y) {
    var m = "https://react.dev/errors/" + y;
    if (1 < arguments.length) {
      m += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var x = 2; x < arguments.length; x++)
        m += "&args[]=" + encodeURIComponent(arguments[x]);
    }
    return "Minified React error #" + y + "; visit " + m + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var r = {
    d: {
      f: o,
      r: function() {
        throw Error(i(522));
      },
      D: o,
      C: o,
      L: o,
      m: o,
      X: o,
      S: o,
      M: o
    },
    p: 0,
    findDOMNode: null
  }, c = /* @__PURE__ */ Symbol.for("react.portal"), f = /* @__PURE__ */ Symbol.for("react.recoverable"), d = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function h(y, m, x) {
    var S = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: S == null ? null : S === d ? d : "" + S,
      children: y,
      containerInfo: m,
      implementation: x
    };
  }
  var p = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function v(y, m) {
    if (y === "font") return "";
    if (typeof m == "string")
      return m === "use-credentials" ? m : "";
  }
  return ze.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, ze.browser = function(y) {
    return { $$typeof: f, _reason: y };
  }, ze.createPortal = function(y, m) {
    var x = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!m || m.nodeType !== 1 && m.nodeType !== 9 && m.nodeType !== 11)
      throw Error(i(299));
    return h(y, m, null, x);
  }, ze.flushSync = function(y) {
    var m = p.T, x = r.p;
    try {
      if (p.T = null, r.p = 2, y) return y();
    } finally {
      p.T = m, r.p = x, r.d.f();
    }
  }, ze.preconnect = function(y, m) {
    typeof y == "string" && (m ? (m = m.crossOrigin, m = typeof m == "string" ? m === "use-credentials" ? m : "" : void 0) : m = null, r.d.C(y, m));
  }, ze.prefetchDNS = function(y) {
    typeof y == "string" && r.d.D(y);
  }, ze.preinit = function(y, m) {
    if (typeof y == "string" && m && typeof m.as == "string") {
      var x = m.as, S = v(x, m.crossOrigin), E = typeof m.integrity == "string" ? m.integrity : void 0, z = typeof m.fetchPriority == "string" ? m.fetchPriority : void 0;
      x === "style" ? r.d.S(
        y,
        typeof m.precedence == "string" ? m.precedence : void 0,
        {
          crossOrigin: S,
          integrity: E,
          fetchPriority: z
        }
      ) : x === "script" && r.d.X(y, {
        crossOrigin: S,
        integrity: E,
        fetchPriority: z,
        nonce: typeof m.nonce == "string" ? m.nonce : void 0
      });
    }
  }, ze.preinitModule = function(y, m) {
    if (typeof y == "string")
      if (typeof m == "object" && m !== null) {
        if (m.as == null || m.as === "script") {
          var x = v(
            m.as,
            m.crossOrigin
          );
          r.d.M(y, {
            crossOrigin: x,
            integrity: typeof m.integrity == "string" ? m.integrity : void 0,
            nonce: typeof m.nonce == "string" ? m.nonce : void 0,
            fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0
          });
        }
      } else m == null && r.d.M(y);
  }, ze.preload = function(y, m) {
    if (typeof y == "string" && typeof m == "object" && m !== null && typeof m.as == "string") {
      var x = m.as, S = v(x, m.crossOrigin);
      r.d.L(y, x, {
        crossOrigin: S,
        integrity: typeof m.integrity == "string" ? m.integrity : void 0,
        nonce: typeof m.nonce == "string" ? m.nonce : void 0,
        type: typeof m.type == "string" ? m.type : void 0,
        fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0,
        referrerPolicy: typeof m.referrerPolicy == "string" ? m.referrerPolicy : void 0,
        imageSrcSet: typeof m.imageSrcSet == "string" ? m.imageSrcSet : void 0,
        imageSizes: typeof m.imageSizes == "string" ? m.imageSizes : void 0,
        media: typeof m.media == "string" ? m.media : void 0
      });
    }
  }, ze.preloadModule = function(y, m) {
    if (typeof y == "string")
      if (m) {
        var x = v(m.as, m.crossOrigin);
        r.d.m(y, {
          as: typeof m.as == "string" && m.as !== "script" ? m.as : void 0,
          crossOrigin: x,
          integrity: typeof m.integrity == "string" ? m.integrity : void 0,
          nonce: typeof m.nonce == "string" ? m.nonce : void 0,
          fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0
        });
      } else r.d.m(y);
  }, ze.requestFormReset = function(y) {
    r.d.r(y);
  }, ze.unstable_batchedUpdates = function(y, m) {
    return y(m);
  }, ze.useFormState = function(y, m, x) {
    return p.H.useFormState(y, m, x);
  }, ze.useFormStatus = function() {
    return p.H.useHostTransitionStatus();
  }, ze.version = "19.3.0", ze;
}
var Sy;
function $p() {
  if (Sy) return cd.exports;
  Sy = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), cd.exports = RS(), cd.exports;
}
var Ey;
function HS() {
  if (Ey) return Du;
  Ey = 1;
  var n = DS(), i = ku(), o = $p();
  function r(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        e += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function f(t) {
    for (var e = t, l = e; l && !l.alternate; )
      e = l, (e.flags & 4098) !== 0 && (t = e.return), l = e.return;
    for (; e.return; ) e = e.return;
    return e.tag === 3 ? t : null;
  }
  function d(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function h(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function p(t) {
    if (f(t) !== t)
      throw Error(r(188));
  }
  function v(t) {
    var e = t.alternate;
    if (!e) {
      if (e = f(t), e === null) throw Error(r(188));
      return e !== t ? null : t;
    }
    for (var l = t, a = e; ; ) {
      var u = l.return;
      if (u === null) break;
      var s = u.alternate;
      if (s === null) {
        if (a = u.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (u.child === s.child) {
        for (s = u.child; s; ) {
          if (s === l) return p(u), t;
          if (s === a) return p(u), e;
          s = s.sibling;
        }
        throw Error(r(188));
      }
      if (l.return !== a.return) l = u, a = s;
      else {
        for (var g = !1, b = u.child; b; ) {
          if (b === l) {
            g = !0, l = u, a = s;
            break;
          }
          if (b === a) {
            g = !0, a = u, l = s;
            break;
          }
          b = b.sibling;
        }
        if (!g) {
          for (b = s.child; b; ) {
            if (b === l) {
              g = !0, l = s, a = u;
              break;
            }
            if (b === a) {
              g = !0, a = s, l = u;
              break;
            }
            b = b.sibling;
          }
          if (!g) throw Error(r(189));
        }
      }
      if (l.alternate !== a) throw Error(r(190));
    }
    if (l.tag !== 3) throw Error(r(188));
    return l.stateNode.current === l ? t : e;
  }
  function y(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = y(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  function m(t, e, l, a, u, s) {
    for (; t !== null; ) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && l(t, a, u, s) || (t.tag !== 22 || t.memoizedState === null) && (e || t.tag !== 5 && t.tag !== 27) && m(
        t.child,
        e,
        l,
        a,
        u,
        s
      ))
        return !0;
      t = t.sibling;
    }
    return !1;
  }
  function x(t) {
    for (t = t.return; t !== null; ) {
      if (t.tag === 3 || t.tag === 5 || t.tag === 27) return t;
      t = t.return;
    }
    return null;
  }
  function S(t) {
    var e = !1;
    for (t = t.return; t !== null && (t.tag === 4 && (e = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27)); )
      t = t.return;
    return e;
  }
  function E(t) {
    var e = [null, null], l = x(t);
    return l === null || z(
      e,
      t,
      l.child,
      { foundSelf: !1 }
    ), e;
  }
  function z(t, e, l, a) {
    for (; l !== null; ) {
      if (l === e) a.foundSelf = !0;
      else if (l.tag === 5 || l.tag === 27 || l.tag === 6) {
        if (a.foundSelf) return t[1] = l, !0;
        t[0] = l;
      } else if ((l.tag !== 22 || l.memoizedState === null) && z(
        t,
        e,
        l.child,
        a
      ))
        return !0;
      l = l.sibling;
    }
    return !1;
  }
  function T(t) {
    switch (t.tag) {
      case 5:
      case 27:
      case 6:
        return t.stateNode;
      case 3:
        return t.stateNode.containerInfo;
      default:
        throw Error(r(559));
    }
  }
  var C = null, U = null;
  function _(t, e, l) {
    return t === l ? !0 : t === e ? (C = t, !0) : !1;
  }
  function D(t, e, l) {
    return t === l ? (U = t, !1) : t === e ? (U !== null && (C = t), !0) : !1;
  }
  function G(t) {
    if (t === null) return null;
    do
      t = t === null ? null : t.return;
    while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
    return t || null;
  }
  function B(t, e, l) {
    for (var a = 0, u = t; u; u = l(u)) a++;
    u = 0;
    for (var s = e; s; s = l(s)) u++;
    for (; 0 < a - u; ) t = l(t), a--;
    for (; 0 < u - a; ) e = l(e), u--;
    for (; a--; ) {
      if (t === e || e !== null && t === e.alternate)
        return t;
      t = l(t), e = l(e);
    }
    return null;
  }
  var H = Object.assign, $ = /* @__PURE__ */ Symbol.for("react.element"), tt = /* @__PURE__ */ Symbol.for("react.transitional.element"), ot = /* @__PURE__ */ Symbol.for("react.portal"), nt = /* @__PURE__ */ Symbol.for("react.fragment"), ut = /* @__PURE__ */ Symbol.for("react.strict_mode"), J = /* @__PURE__ */ Symbol.for("react.profiler"), N = /* @__PURE__ */ Symbol.for("react.consumer"), L = /* @__PURE__ */ Symbol.for("react.context"), O = /* @__PURE__ */ Symbol.for("react.forward_ref"), j = /* @__PURE__ */ Symbol.for("react.suspense"), Y = /* @__PURE__ */ Symbol.for("react.suspense_list"), k = /* @__PURE__ */ Symbol.for("react.memo"), et = /* @__PURE__ */ Symbol.for("react.lazy"), lt = /* @__PURE__ */ Symbol.for("react.activity"), dt = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), xt = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), M = /* @__PURE__ */ Symbol.for("react.view_transition"), F = /* @__PURE__ */ Symbol.for("react.recoverable"), ht = Symbol.iterator;
  function rt(t) {
    return t === null || typeof t != "object" ? null : (t = ht && t[ht] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var W = /* @__PURE__ */ Symbol.for("react.client.reference");
  function ft(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === W ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case nt:
        return "Fragment";
      case J:
        return "Profiler";
      case ut:
        return "StrictMode";
      case j:
        return "Suspense";
      case Y:
        return "SuspenseList";
      case lt:
        return "Activity";
      case M:
        return "ViewTransition";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case ot:
          return "Portal";
        case L:
          return t.displayName || "Context";
        case N:
          return (t._context.displayName || "Context") + ".Consumer";
        case O:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case k:
          return e = t.displayName || null, e !== null ? e : ft(t.type) || "Memo";
        case et:
          e = t._payload, t = t._init;
          try {
            return ft(t(e));
          } catch {
          }
      }
    return null;
  }
  var gt = Array.isArray, st = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ct = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, bt = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, zt = [], Et = -1;
  function Mt(t) {
    return { current: t };
  }
  function Ot(t) {
    0 > Et || (t.current = zt[Et], zt[Et] = null, Et--);
  }
  function Ht(t, e) {
    Et++, zt[Et] = t.current, t.current = e;
  }
  var Kt = Mt(null), oe = Mt(null), Nt = Mt(null), Se = Mt(null);
  function ye(t, e) {
    switch (Ht(Nt, e), Ht(oe, t), Ht(Kt, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? wm(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = wm(e), t = _m(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    Ot(Kt), Ht(Kt, t);
  }
  function Ee() {
    Ot(Kt), Ot(oe), Ot(Nt);
  }
  function pe(t) {
    var e = t.memoizedState;
    e !== null && (Ei._currentValue = e.memoizedState, Ht(Se, t)), e = Kt.current;
    var l = _m(e, t.type);
    e !== l && (Ht(oe, t), Ht(Kt, l));
  }
  function we(t) {
    oe.current === t && (Ot(Kt), Ot(oe)), Se.current === t && (Ot(Se), Ei._currentValue = bt);
  }
  var Pt, an;
  function Re(t) {
    if (Pt === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        Pt = e && e[1] || "", an = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Pt + t + an;
  }
  var An = !1;
  function Jl(t, e) {
    if (!t || An) return "";
    An = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var it = function() {
                throw Error();
              };
              if (Object.defineProperty(it.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(it, []);
                } catch (mt) {
                  var V = mt;
                }
                Reflect.construct(t, [], it);
              } else {
                try {
                  it.call();
                } catch (mt) {
                  V = mt;
                }
                it = !1;
                try {
                  var I = Object.getOwnPropertyDescriptor(
                    t.prototype,
                    "props"
                  );
                  Object.defineProperty(t.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), it = !0, new t();
                } finally {
                  it && (I !== void 0 ? Object.defineProperty(t.prototype, "props", I) : delete t.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (mt) {
                V = mt;
              }
              (it = t()) && typeof it.catch == "function" && it.catch(function() {
              });
            }
          } catch (mt) {
            if (mt && V && typeof mt.stack == "string")
              return [mt.stack, V.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      u && u.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var s = a.DetermineComponentFrameRoot(), g = s[0], b = s[1];
      if (g && b) {
        var A = g.split(`
`), Z = b.split(`
`);
        for (u = a = 0; a < A.length && !A[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; u < Z.length && !Z[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (a === A.length || u === Z.length)
          for (a = A.length - 1, u = Z.length - 1; 1 <= a && 0 <= u && A[a] !== Z[u]; )
            u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (A[a] !== Z[u]) {
            if (a !== 1 || u !== 1)
              do
                if (a--, u--, 0 > u || A[a] !== Z[u]) {
                  var P = `
` + A[a].replace(" at new ", " at ");
                  return t.displayName && P.includes("<anonymous>") && (P = P.replace("<anonymous>", t.displayName)), P;
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      An = !1, Error.prepareStackTrace = l;
    }
    return (l = t ? t.displayName || t.name : "") ? Re(l) : "";
  }
  function ji(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Re(t.type);
      case 16:
        return Re("Lazy");
      case 13:
        return t.child !== e && e !== null ? Re("Suspense Fallback") : Re("Suspense");
      case 19:
        return Re("SuspenseList");
      case 0:
      case 15:
        return Jl(t.type, !1);
      case 11:
        return Jl(t.type.render, !1);
      case 1:
        return Jl(t.type, !0);
      case 31:
        return Re("Activity");
      case 30:
        return Re("ViewTransition");
      default:
        return "";
    }
  }
  function $n(t) {
    try {
      var e = "", l = null;
      do
        e += ji(t, l), l = t, t = t.return;
      while (t);
      return e;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Il = Object.prototype.hasOwnProperty, Fl = n.unstable_scheduleCallback, q = n.unstable_cancelCallback, pt = n.unstable_shouldYield, St = n.unstable_requestPaint, ee = n.unstable_now, Ae = n.unstable_getCurrentPriorityLevel, no = n.unstable_ImmediatePriority, lo = n.unstable_UserBlockingPriority, Oa = n.unstable_NormalPriority, Ns = n.unstable_LowPriority, ao = n.unstable_IdlePriority, Ts = n.log, Cs = n.unstable_setDisableYieldValue, Wl = null, He = null;
  function Dn(t) {
    if (typeof Ts == "function" && Cs(t), He && typeof He.setStrictMode == "function")
      try {
        He.setStrictMode(Wl, t);
      } catch {
      }
  }
  var je = Math.clz32 ? Math.clz32 : As, Ms = Math.log, zs = Math.LN2;
  function As(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (Ms(t) / zs | 0) | 0;
  }
  var Ra = 256, Ha = 262144, ja = 4194304;
  function Kn(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & -t;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Ua(t, e, l) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var u = 0, s = t.suspendedLanes, g = t.pingedLanes;
    t = t.warmLanes;
    var b = a & 134217727;
    return b !== 0 ? (a = b & ~s, a !== 0 ? u = Kn(a) : (g &= b, g !== 0 ? u = Kn(g) : l || (l = b & ~t, l !== 0 && (u = Kn(l))))) : (b = a & ~s, b !== 0 ? u = Kn(b) : g !== 0 ? u = Kn(g) : l || (l = a & ~t, l !== 0 && (u = Kn(l)))), u === 0 ? 0 : e !== 0 && e !== u && (e & s) === 0 && (s = u & -u, l = e & -e, s >= l || s === 32 && (l & 4194048) !== 0) ? e : u;
  }
  function Pl(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Ui(t, e) {
    (e & 8) !== 0 && (e |= e & 32);
    var l = t.entangledLanes;
    if (l !== 0)
      for (t = t.entanglements, l &= e; 0 < l; ) {
        var a = 31 - je(l), u = 1 << a;
        e |= t[a], l &= ~u;
      }
    return e;
  }
  function io(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Bi() {
    var t = ja;
    return ja <<= 1, (ja & 62914560) === 0 && (ja = 4194304), t;
  }
  function Li(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function ta(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function Ds(t, e, l, a, u, s) {
    var g = t.pendingLanes;
    t.pendingLanes = l, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= l, t.entangledLanes &= l, t.errorRecoveryDisabledLanes &= l, t.shellSuspendCounter = 0;
    var b = t.entanglements, A = t.expirationTimes, Z = t.hiddenUpdates;
    for (l = g & ~l; 0 < l; ) {
      var P = 31 - je(l), it = 1 << P;
      b[P] = 0, A[P] = -1;
      var V = Z[P];
      if (V !== null)
        for (Z[P] = null, P = 0; P < V.length; P++) {
          var I = V[P];
          I !== null && (I.lane &= -536870913);
        }
      l &= ~it;
    }
    a !== 0 && uo(t, a, 0), s !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= s & ~(g & ~e));
  }
  function uo(t, e, l) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var a = 31 - je(e);
    t.entangledLanes |= e, t.entanglements[a] = t.entanglements[a] | 1073741824 | l & 261930;
  }
  function oo(t, e) {
    var l = t.entangledLanes |= e;
    for (t = t.entanglements; l; ) {
      var a = 31 - je(l), u = 1 << a;
      u & e | t[a] & e && (t[a] |= e), l &= ~u;
    }
  }
  function ro(t, e) {
    var l = e & -e;
    return l = (l & 42) !== 0 ? 1 : Ba(l), (l & (t.suspendedLanes | e)) !== 0 ? 0 : l;
  }
  function Ba(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Vi(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function so() {
    var t = ct.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : oy(t.type));
  }
  function co(t, e) {
    var l = ct.p;
    try {
      return ct.p = t, e();
    } finally {
      ct.p = l;
    }
  }
  var mn = Math.random().toString(36).slice(2), ge = "__reactFiber$" + mn, De = "__reactProps$" + mn, gl = "__reactContainer$" + mn, fo = "__reactEvents$" + mn, ho = "__reactListeners$" + mn, Os = "__reactHandles$" + mn, go = "__reactResources$" + mn, ea = "__reactMarker$" + mn, La = "__reactLoad$" + mn;
  function Va(t) {
    delete t[ge], delete t[De], delete t[ho], delete t[Os];
  }
  function kn(t) {
    var e;
    if (e = t[ge]) return e;
    for (var l = t.parentNode; l; ) {
      if (e = l[gl] || l[ge]) {
        if (l = e.alternate, e.child !== null || l !== null && l.child !== null)
          for (t = qm(t); t !== null; ) {
            if (l = t[ge]) return l;
            t = qm(t);
          }
        return e;
      }
      t = l, l = t.parentNode;
    }
    return null;
  }
  function ml(t) {
    if (t = t[ge] || t[gl]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function na(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(r(33));
  }
  function Jn(t) {
    var e = t[go];
    return e || (e = t[go] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function re(t) {
    t[ea] = !0;
  }
  function Yi(t) {
    t[La] = void 0;
  }
  var mo = /* @__PURE__ */ new Set(), yo = {};
  function yn(t, e) {
    yl(t, e), yl(t + "Capture", e);
  }
  function yl(t, e) {
    for (yo[t] = e, t = 0; t < e.length; t++)
      mo.add(e[t]);
  }
  var Rs = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), qi = {}, rh = {};
  function K1(t) {
    return Il.call(rh, t) ? !0 : Il.call(qi, t) ? !1 : Rs.test(t) ? rh[t] = !0 : (qi[t] = !0, !1);
  }
  var qt = !1;
  function sh() {
    var t = qt;
    return qt = !1, t;
  }
  function po(t, e, l) {
    if (K1(e))
      if (l === null) t.removeAttribute(e);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var a = e.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, l);
      }
  }
  function vo(t, e, l) {
    if (l === null) t.removeAttribute(e);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, l);
    }
  }
  function In(t, e, l, a) {
    if (a === null) t.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(l);
          return;
      }
      t.setAttributeNS(e, l, a);
    }
  }
  function Ke(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function ch(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function k1(t, e, l) {
    var a = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    );
    if (!t.hasOwnProperty(e) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var u = a.get, s = a.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return u.call(this);
        },
        set: function(g) {
          l = "" + g, s.call(this, g);
        }
      }), Object.defineProperty(t, e, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(g) {
          l = "" + g;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Hs(t) {
    if (!t._valueTracker) {
      var e = ch(t) ? "checked" : "value";
      t._valueTracker = k1(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function fh(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(), a = "";
    return t && (a = ch(t) ? t.checked ? "true" : "false" : t.value), t = a, t !== l ? (e.setValue(t), !0) : !1;
  }
  var J1 = /[\n"\\]/g;
  function un(t) {
    return t.replace(
      J1,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function js(t, e, l, a, u, s, g, b) {
    t.name = "", g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? t.type = g : t.removeAttribute("type"), e != null ? g === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Ke(e)) : t.value !== "" + Ke(e) && (t.value = "" + Ke(e)) : g !== "submit" && g !== "reset" || t.removeAttribute("value"), e != null ? g === "number" && t.value == e ? Us(t, Ke(t.value)) : Us(t, Ke(e)) : l != null ? Us(t, Ke(l)) : a != null && t.removeAttribute("value"), u == null && s != null && (t.defaultChecked = !!s), u != null && (t.checked = u && typeof u != "function" && typeof u != "symbol"), b != null && typeof b != "function" && typeof b != "symbol" && typeof b != "boolean" ? t.name = "" + Ke(b) : t.removeAttribute("name");
  }
  function dh(t, e, l, a, u, s, g, b) {
    if (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (t.type = s), e != null || l != null) {
      if (!(s !== "submit" && s !== "reset" || e != null)) {
        Hs(t);
        return;
      }
      l = l != null ? "" + Ke(l) : "", e = e != null ? "" + Ke(e) : l, b || e === t.value || (t.value = e), t.defaultValue = e;
    }
    a = a ?? u, a = typeof a != "function" && typeof a != "symbol" && !!a, t.checked = b ? t.checked : !!a, t.defaultChecked = !!a, g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" && (t.name = g), Hs(t);
  }
  function Us(t, e) {
    t.defaultValue !== "" + e && (t.defaultValue = "" + e);
  }
  function Ya(t, e, l, a) {
    if (t = t.options, e) {
      e = {};
      for (var u = 0; u < l.length; u++)
        e["$" + l[u]] = !0;
      for (l = 0; l < t.length; l++)
        u = e.hasOwnProperty("$" + t[l].value), t[l].selected !== u && (t[l].selected = u), u && a && (t[l].defaultSelected = !0);
    } else {
      for (l = "" + Ke(l), e = null, u = 0; u < t.length; u++) {
        if (t[u].value === l) {
          t[u].selected = !0, a && (t[u].defaultSelected = !0);
          return;
        }
        e !== null || t[u].disabled || (e = t[u]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function hh(t, e, l) {
    if (e != null && (e = "" + Ke(e), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? "" + Ke(l) : "";
  }
  function gh(t, e, l, a) {
    if (e == null) {
      if (a != null) {
        if (l != null) throw Error(r(92));
        if (gt(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), e = l;
    }
    l = Ke(e), t.defaultValue = l, a = t.textContent, a === l && a !== "" && a !== null && (t.value = a), Hs(t);
  }
  function qa(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var I1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function mh(t, e, l) {
    var a = e.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : a ? t.setProperty(e, l) : typeof l != "number" || l === 0 || I1.has(e) ? e === "float" ? t.cssFloat = l : t[e] = ("" + l).trim() : t[e] = l + "px";
  }
  function yh(t, e, l) {
    if (e != null && typeof e != "object")
      throw Error(r(62));
    if (t = t.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || e != null && e.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "", qt = !0);
      for (var u in e)
        a = e[u], e.hasOwnProperty(u) && l[u] !== a && (mh(t, u, a), qt = !0);
    } else
      for (var s in e)
        e.hasOwnProperty(s) && mh(t, s, e[s]);
  }
  function Bs(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var F1 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), W1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function xo(t) {
    return W1.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function On() {
  }
  var Ls = null;
  function Vs(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var Xa = null, Za = null;
  function ph(t) {
    var e = ml(t);
    if (e && (t = e.stateNode)) {
      var l = t[De] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (js(
            t,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), e = l.name, l.type === "radio" && e != null) {
            for (l = t; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + un(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < l.length; e++) {
              var a = l[e];
              if (a !== t && a.form === t.form) {
                var u = a[De] || null;
                if (!u) throw Error(r(90));
                js(
                  a,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (e = 0; e < l.length; e++)
              a = l[e], a.form === t.form && fh(a);
          }
          break t;
        case "textarea":
          hh(t, l.value, l.defaultValue);
          break t;
        case "select":
          e = l.value, e != null && Ya(t, !!l.multiple, e, !1);
      }
    }
  }
  var Ys = !1;
  function vh(t, e, l) {
    if (Ys) return t(e, l);
    Ys = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (Ys = !1, (Xa !== null || Za !== null) && (xr(), Xa && (e = Xa, t = Za, Za = Xa = null, ph(e), t)))
        for (e = 0; e < t.length; e++) ph(t[e]);
    }
  }
  function Xi(t, e) {
    var l = t.stateNode;
    if (l === null) return null;
    var a = l[De] || null;
    if (a === null) return null;
    l = a[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (t = t.type, a = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !a;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (l && typeof l != "function")
      throw Error(
        r(231, e, typeof l)
      );
    return l;
  }
  var Fn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), qs = !1;
  if (Fn)
    try {
      var Zi = {};
      Object.defineProperty(Zi, "passive", {
        get: function() {
          qs = !0;
        }
      }), window.addEventListener("test", Zi, Zi), window.removeEventListener("test", Zi, Zi);
    } catch {
      qs = !1;
    }
  var pl = null, Xs = null, bo = null;
  function xh() {
    if (bo) return bo;
    var t, e = Xs, l = e.length, a, u = "value" in pl ? pl.value : pl.textContent, s = u.length;
    for (t = 0; t < l && e[t] === u[t]; t++) ;
    var g = l - t;
    for (a = 1; a <= g && e[l - a] === u[s - a]; a++) ;
    return bo = u.slice(t, 1 < a ? 1 - a : void 0);
  }
  function So(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Eo() {
    return !0;
  }
  function bh() {
    return !1;
  }
  function Ue(t) {
    function e(l, a, u, s, g) {
      this._reactName = l, this._targetInst = u, this.type = a, this.nativeEvent = s, this.target = g, this.currentTarget = null;
      for (var b in t)
        t.hasOwnProperty(b) && (l = t[b], this[b] = l ? l(s) : s[b]);
      return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? Eo : bh, this.isPropagationStopped = bh, this;
    }
    return H(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Eo);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Eo);
      },
      persist: function() {
      },
      isPersistent: Eo
    }), e;
  }
  var vl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, wo = Ue(vl), Gi = H({}, vl, { view: 0, detail: 0 }), P1 = Ue(Gi), Zs, Gs, Qi, _o = H({}, Gi, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: $s,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== Qi && (Qi && t.type === "mousemove" ? (Zs = t.screenX - Qi.screenX, Gs = t.screenY - Qi.screenY) : Gs = Zs = 0, Qi = t), Zs);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Gs;
    }
  }), Sh = Ue(_o), tx = H({}, _o, { dataTransfer: 0 }), ex = Ue(tx), nx = H({}, Gi, { relatedTarget: 0 }), Qs = Ue(nx), lx = H({}, vl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), ax = Ue(lx), ix = H({}, vl, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), ux = Ue(ix), ox = H({}, vl, { data: 0 }), Eh = Ue(ox), rx = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, sx = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, cx = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function fx(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = cx[t]) ? !!e[t] : !1;
  }
  function $s() {
    return fx;
  }
  var dx = H({}, Gi, {
    key: function(t) {
      if (t.key) {
        var e = rx[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = So(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? sx[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: $s,
    charCode: function(t) {
      return t.type === "keypress" ? So(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? So(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), hx = Ue(dx), gx = H({}, _o, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), wh = Ue(gx), mx = H({}, vl, { submitter: 0 }), yx = Ue(mx), px = H({}, Gi, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: $s
  }), vx = Ue(px), xx = H({}, vl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), bx = Ue(xx), Sx = H({}, _o, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ex = Ue(Sx), wx = H({}, vl, {
    newState: 0,
    oldState: 0,
    source: 0
  }), _x = Ue(wx), Nx = [9, 13, 27, 32], Ks = Fn && "CompositionEvent" in window, $i = null;
  Fn && "documentMode" in document && ($i = document.documentMode);
  var Tx = Fn && "TextEvent" in window && !$i, _h = Fn && (!Ks || $i && 8 < $i && 11 >= $i), Nh = " ", Th = !1;
  function Ch(t, e) {
    switch (t) {
      case "keyup":
        return Nx.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Mh(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var Ga = !1;
  function Cx(t, e) {
    switch (t) {
      case "compositionend":
        return Mh(e);
      case "keypress":
        return e.which !== 32 ? null : (Th = !0, Nh);
      case "textInput":
        return t = e.data, t === Nh && Th ? null : t;
      default:
        return null;
    }
  }
  function Mx(t, e) {
    if (Ga)
      return t === "compositionend" || !Ks && Ch(t, e) ? (t = xh(), bo = Xs = pl = null, Ga = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return _h && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var zx = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function zh(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!zx[t.type] : e === "textarea";
  }
  function Ah(t, e, l, a) {
    Xa ? Za ? Za.push(a) : Za = [a] : Xa = a, e = Nr(e, "onChange"), 0 < e.length && (l = new wo(
      "onChange",
      "change",
      null,
      l,
      a
    ), t.push({ event: l, listeners: e }));
  }
  var Ki = null, ki = null;
  function Ax(t) {
    pm(t, 0);
  }
  function No(t) {
    var e = na(t);
    if (fh(e)) return t;
  }
  function Dh(t, e) {
    if (t === "change") return e;
  }
  var Oh = !1;
  if (Fn) {
    var ks;
    if (Fn) {
      var Js = "oninput" in document;
      if (!Js) {
        var Rh = document.createElement("div");
        Rh.setAttribute("oninput", "return;"), Js = typeof Rh.oninput == "function";
      }
      ks = Js;
    } else ks = !1;
    Oh = ks && (!document.documentMode || 9 < document.documentMode);
  }
  function Hh() {
    Ki && (Ki.detachEvent("onpropertychange", jh), ki = Ki = null);
  }
  function jh(t) {
    if (t.propertyName === "value" && No(ki)) {
      var e = [];
      Ah(
        e,
        ki,
        t,
        Vs(t)
      ), vh(Ax, e);
    }
  }
  function Dx(t, e, l) {
    t === "focusin" ? (Hh(), Ki = e, ki = l, Ki.attachEvent("onpropertychange", jh)) : t === "focusout" && Hh();
  }
  function Ox(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return No(ki);
  }
  function Rx(t, e) {
    if (t === "click") return No(e);
  }
  function Hx(t, e) {
    if (t === "input" || t === "change")
      return No(e);
  }
  function jx(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var ke = typeof Object.is == "function" ? Object.is : jx;
  function Ji(t, e) {
    if (ke(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var l = Object.keys(t), a = Object.keys(e);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var u = l[a];
      if (!Il.call(e, u) || !ke(t[u], e[u]))
        return !1;
    }
    return !0;
  }
  function Is(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function Uh(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Bh(t, e) {
    var l = Uh(t);
    t = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = t + l.textContent.length, t <= e && a >= e)
          return { node: l, offset: e - t };
        t = a;
      }
      t: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break t;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Uh(l);
    }
  }
  function Lh(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? Lh(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function Vh(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = Is(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = Is(t.document);
    }
    return e;
  }
  function Fs(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var Ux = Fn && "documentMode" in document && 11 >= document.documentMode, Qa = null, Ws = null, Ii = null, Ps = !1;
  function Yh(t, e, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Ps || Qa == null || Qa !== Is(a) || (a = Qa, "selectionStart" in a && Fs(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ii && Ji(Ii, a) || (Ii = a, a = Nr(Ws, "onSelect"), 0 < a.length && (e = new wo(
      "onSelect",
      "select",
      null,
      e,
      l
    ), t.push({ event: e, listeners: a }), e.target = Qa)));
  }
  function la(t, e) {
    var l = {};
    return l[t.toLowerCase()] = e.toLowerCase(), l["Webkit" + t] = "webkit" + e, l["Moz" + t] = "moz" + e, l;
  }
  var $a = {
    animationend: la("Animation", "AnimationEnd"),
    animationiteration: la("Animation", "AnimationIteration"),
    animationstart: la("Animation", "AnimationStart"),
    transitionrun: la("Transition", "TransitionRun"),
    transitionstart: la("Transition", "TransitionStart"),
    transitioncancel: la("Transition", "TransitionCancel"),
    transitionend: la("Transition", "TransitionEnd")
  }, tc = {}, qh = {};
  Fn && (qh = document.createElement("div").style, "AnimationEvent" in window || (delete $a.animationend.animation, delete $a.animationiteration.animation, delete $a.animationstart.animation), "TransitionEvent" in window || delete $a.transitionend.transition);
  function aa(t) {
    if (tc[t]) return tc[t];
    if (!$a[t]) return t;
    var e = $a[t], l;
    for (l in e)
      if (e.hasOwnProperty(l) && l in qh)
        return tc[t] = e[l];
    return t;
  }
  var Xh = aa("animationend"), Zh = aa("animationiteration"), Gh = aa("animationstart"), Bx = aa("transitionrun"), Lx = aa("transitionstart"), Vx = aa("transitioncancel"), Qh = aa("transitionend"), $h = /* @__PURE__ */ new Map(), ec = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  ec.push("scrollEnd");
  function pn(t, e) {
    $h.set(t, e), yn(e, [t]);
  }
  var Yx = 0;
  function Wn(t, e) {
    if (t.name != null && t.name !== "auto") return t.name;
    if (e.autoName !== null) return e.autoName;
    t = Sn.identifierPrefix;
    var l = Yx++;
    return t = "_" + t + "t_" + l.toString(32) + "_", e.autoName = t;
  }
  function Kh(t) {
    if (t == null || typeof t == "string")
      return t;
    var e = null, l = di;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = t[l[a]];
        if (u != null) {
          if (u === "none") return "none";
          e = e == null ? u : e + (" " + u);
        }
      }
    return e ?? t.default;
  }
  function Pn(t, e) {
    return t = Kh(t), e = Kh(e), e == null ? t === "auto" ? null : t : e === "auto" ? null : e;
  }
  var To = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, on = [], Ka = 0, nc = 0;
  function Co() {
    for (var t = Ka, e = nc = Ka = 0; e < t; ) {
      var l = on[e];
      on[e++] = null;
      var a = on[e];
      on[e++] = null;
      var u = on[e];
      on[e++] = null;
      var s = on[e];
      if (on[e++] = null, a !== null && u !== null) {
        var g = a.pending;
        g === null ? u.next = u : (u.next = g.next, g.next = u), a.pending = u;
      }
      s !== 0 && kh(l, u, s);
    }
  }
  function Mo(t, e, l, a) {
    on[Ka++] = t, on[Ka++] = e, on[Ka++] = l, on[Ka++] = a, nc |= a, t.lanes |= a, t = t.alternate, t !== null && (t.lanes |= a);
  }
  function lc(t, e, l, a) {
    return Mo(t, e, l, a), zo(t);
  }
  function ia(t, e) {
    return Mo(t, null, null, e), zo(t);
  }
  function kh(t, e, l) {
    t.lanes |= l;
    var a = t.alternate;
    a !== null && (a.lanes |= l);
    for (var u = !1, s = t.return; s !== null; )
      s.childLanes |= l, a = s.alternate, a !== null && (a.childLanes |= l), s.tag === 22 && (t = s.stateNode, t === null || t._visibility & 1 || (u = !0)), t = s, s = s.return;
    return t.tag === 3 ? (s = t.stateNode, u && e !== null && (u = 31 - je(l), t = s.hiddenUpdates, a = t[u], a === null ? t[u] = [e] : a.push(e), e.lane = l | 536870912), s) : null;
  }
  function zo(t) {
    if (50 < vu)
      throw vu = 0, vr = null, Error(r(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var ka = {};
  function qx(t, e, l, a) {
    this.tag = t, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ye(t, e, l, a) {
    return new qx(t, e, l, a);
  }
  function ac(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function tl(t, e) {
    var l = t.alternate;
    return l === null ? (l = Ye(
      t.tag,
      e,
      t.key,
      t.mode
    ), l.elementType = t.elementType, l.type = t.type, l.stateNode = t.stateNode, l.alternate = t, t.alternate = l) : (l.pendingProps = e, l.type = t.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = t.flags & 1206910976, l.childLanes = t.childLanes, l.lanes = t.lanes, l.child = t.child, l.memoizedProps = t.memoizedProps, l.memoizedState = t.memoizedState, l.updateQueue = t.updateQueue, e = t.dependencies, l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, l.sibling = t.sibling, l.index = t.index, l.ref = t.ref, l.refCleanup = t.refCleanup, l;
  }
  function Jh(t, e) {
    t.flags &= 1206910978;
    var l = t.alternate;
    return l === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = l.childLanes, t.lanes = l.lanes, t.child = l.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = l.memoizedProps, t.memoizedState = l.memoizedState, t.updateQueue = l.updateQueue, t.type = l.type, e = l.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function Ao(t, e, l, a, u, s) {
    var g = 0;
    if (a = t, typeof a == "function") ac(a) && (g = 1);
    else if (typeof a == "string")
      g = mS(
        t,
        l,
        Kt.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (a) {
        case lt:
          return t = Ye(31, l, e, u), t.elementType = lt, t.lanes = s, t;
        case nt:
          return ua(l.children, u, s, e);
        case ut:
          g = 8, u |= 24;
          break;
        case J:
          return t = Ye(12, l, e, u | 2), t.elementType = J, t.lanes = s, t;
        case j:
          return t = Ye(13, l, e, u), t.elementType = j, t.lanes = s, t;
        case Y:
          return t = Ye(19, l, e, u), t.elementType = Y, t.lanes = s, t;
        case dt:
        case M:
          return t = u | 32, t = Ye(30, l, e, t), t.elementType = M, t.lanes = s, t.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, t;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case L:
                g = 10;
                break t;
              case N:
                g = 9;
                break t;
              case O:
                g = 11;
                break t;
              case k:
                g = 14;
                break t;
              case et:
                g = 16, a = null;
                break t;
            }
          g = 29, l = Error(
            r(130, t === null ? "null" : typeof t, "")
          ), a = null;
      }
    return e = Ye(g, l, e, u), e.elementType = t, e.type = a, e.lanes = s, e;
  }
  function ua(t, e, l, a) {
    return t = Ye(7, t, a, e), t.lanes = l, t;
  }
  function ic(t, e, l) {
    return t = Ye(6, t, null, e), t.lanes = l, t;
  }
  function Ih(t) {
    var e = Ye(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function uc(t, e, l) {
    return e = Ye(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = l, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var Fh = /* @__PURE__ */ new WeakMap();
  function rn(t, e) {
    if (typeof t == "object" && t !== null) {
      var l = Fh.get(t);
      return l !== void 0 ? l : (e = {
        value: t,
        source: e,
        stack: $n(e)
      }, Fh.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: $n(e)
    };
  }
  var Ja = [], Ia = 0, Do = null, Fi = 0, sn = [], cn = 0, xl = null, Rn = 1, Hn = "";
  function el(t, e) {
    Ja[Ia++] = Fi, Ja[Ia++] = Do, Do = t, Fi = e;
  }
  function Wh(t, e, l) {
    sn[cn++] = Rn, sn[cn++] = Hn, sn[cn++] = xl, xl = t;
    var a = Rn;
    t = Hn;
    var u = 32 - je(a) - 1;
    a &= ~(1 << u), l += 1;
    var s = 32 - je(e) + u;
    if (30 < s) {
      var g = u - u % 5;
      s = (a & (1 << g) - 1).toString(32), a >>= g, u -= g, Rn = 1 << 32 - je(e) + u | l << u | a, Hn = s + t;
    } else
      Rn = 1 << s | l << u | a, Hn = t;
  }
  function Oo(t) {
    t.return !== null && (el(t, 1), Wh(t, 1, 0));
  }
  function oc(t) {
    for (; t === Do; )
      Do = Ja[--Ia], Ja[Ia] = null, Fi = Ja[--Ia], Ja[Ia] = null;
    for (; t === xl; )
      xl = sn[--cn], sn[cn] = null, Hn = sn[--cn], sn[cn] = null, Rn = sn[--cn], sn[cn] = null;
  }
  function Ph(t, e) {
    sn[cn++] = Rn, sn[cn++] = Hn, sn[cn++] = xl, Rn = e.id, Hn = e.overflow, xl = t;
  }
  var ve = null, It = null, Rt = !1, bl = null, fn = !1, rc = Error(r(519));
  function Sl(t) {
    var e = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Wi(rn(e, t)), rc;
  }
  function tg(t) {
    var e = t.stateNode, l = t.type, a = t.memoizedProps;
    switch (e[ge] = t, e[De] = a, l) {
      case "dialog":
        Ut("cancel", e), Ut("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        Ut("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < bu.length; l++)
          Ut(bu[l], e);
        break;
      case "source":
        Ut("error", e);
        break;
      case "img":
      case "image":
      case "link":
        Ut("error", e), Ut("load", e);
        break;
      case "details":
        Ut("toggle", e);
        break;
      case "input":
        Ut("invalid", e), dh(
          e,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        Ut("invalid", e);
        break;
      case "textarea":
        Ut("invalid", e), gh(e, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || e.textContent === "" + l || a.suppressHydrationWarning === !0 || Sm(e.textContent, l) ? (a.popover != null && (Ut("beforetoggle", e), Ut("toggle", e)), a.onScroll != null && Ut("scroll", e), a.onScrollEnd != null && Ut("scrollend", e), a.onClick != null && (e.onclick = On), e = !0) : e = !1, e || Sl(t, !0);
  }
  function Ro(t) {
    for (ve = t.return; ve; )
      switch (ve.tag) {
        case 5:
        case 31:
        case 13:
          fn = !1;
          return;
        case 27:
        case 3:
          fn = !0;
          return;
        default:
          ve = ve.return;
      }
  }
  function Fa(t) {
    if (t !== ve) return !1;
    if (!Rt) return Ro(t), Rt = !0, !1;
    var e = t.tag, l;
    if ((l = e !== 3 && e !== 27) && ((l = e === 5) && (l = t.type, l = !(l !== "form" && l !== "button") || Vf(t.type, t.memoizedProps)), l = !l), l && It && Sl(t), Ro(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      It = Ym(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      It = Ym(t);
    } else
      e === 27 ? (e = It, Bl(t.type) ? (t = kf, kf = null, It = t) : It = e) : It = ve ? hn(t.stateNode.nextSibling) : null;
    return !0;
  }
  function oa() {
    It = ve = null, Rt = !1;
  }
  function sc() {
    var t = bl;
    return t !== null && (Ze === null ? Ze = t : Ze.push.apply(
      Ze,
      t
    ), bl = null), t;
  }
  function Wi(t) {
    bl === null ? bl = [t] : bl.push(t);
  }
  var cc = Mt(null), ra = null, nl = null;
  function El(t, e, l) {
    Ht(cc, e._currentValue), e._currentValue = l;
  }
  function ll(t) {
    t._currentValue = cc.current, Ot(cc);
  }
  function Ho(t, e, l) {
    for (; t !== null; ) {
      var a = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, a !== null && (a.childLanes |= e)) : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e), t === l) break;
      t = t.return;
    }
  }
  function fc(t, e, l, a) {
    var u = t.child;
    for (u !== null && (u.return = t); u !== null; ) {
      var s = u.dependencies;
      if (s !== null) {
        var g = u.child;
        s = s.firstContext;
        t: for (; s !== null; ) {
          var b = s;
          s = u;
          for (var A = 0; A < e.length; A++)
            if (b.context === e[A]) {
              s.lanes |= l, b = s.alternate, b !== null && (b.lanes |= l), Ho(
                s.return,
                l,
                t
              ), a || (g = null);
              break t;
            }
          s = b.next;
        }
      } else if (u.tag === 18) {
        if (g = u.return, g === null) throw Error(r(341));
        g.lanes |= l, s = g.alternate, s !== null && (s.lanes |= l), Ho(g, l, t), g = null;
      } else
        u.tag === 13 && u.memoizedState !== null && u.memoizedState.dehydrated === null ? (u.lanes |= l, g = u.alternate, g !== null && (g.lanes |= l), Ho(
          u.return,
          l,
          t
        ), g = u.child, g = g !== null ? g.sibling : null) : g = u.child;
      if (g !== null) g.return = u;
      else
        for (g = u; g !== null; ) {
          if (g === t) {
            g = null;
            break;
          }
          if (u = g.sibling, u !== null) {
            u.return = g.return, g = u;
            break;
          }
          g = g.return;
        }
      u = g;
    }
  }
  function sa(t, e, l, a) {
    t = null;
    for (var u = e, s = !1; u !== null; ) {
      if (!s) {
        if ((u.flags & 524288) !== 0) s = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var g = u.alternate;
        if (g === null) throw Error(r(387));
        if (g = g.memoizedProps, g !== null) {
          var b = u.type;
          ke(u.pendingProps.value, g.value) || (t !== null ? t.push(b) : t = [b]);
        }
      } else if (u === Se.current) {
        if (g = u.alternate, g === null) throw Error(r(387));
        g.memoizedState.memoizedState !== u.memoizedState.memoizedState && (t !== null ? t.push(Ei) : t = [Ei]);
      }
      u = u.return;
    }
    return t !== null && fc(
      e,
      t,
      l,
      a
    ), e.flags |= 262144, t !== null;
  }
  function jo(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!ke(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function ca(t) {
    ra = t, nl = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function _e(t) {
    return eg(ra, t);
  }
  function Uo(t, e) {
    return ra === null && ca(t), eg(t, e);
  }
  function eg(t, e) {
    var l = e._currentValue;
    if (e = { context: e, memoizedValue: l, next: null }, nl === null) {
      if (t === null) throw Error(r(308));
      nl = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else nl = nl.next = e;
    return l;
  }
  var Xx = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        t.push(a);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(l) {
        return l();
      });
    };
  }, Zx = n.unstable_scheduleCallback, Gx = n.unstable_NormalPriority, se = {
    $$typeof: L,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function dc() {
    return {
      controller: new Xx(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Pi(t) {
    t.refCount--, t.refCount === 0 && Zx(Gx, function() {
      t.controller.abort();
    });
  }
  function ng(t, e) {
    if ((t.pendingLanes & 4194048) !== 0) {
      var l = t.transitionTypes;
      for (l === null && (l = t.transitionTypes = []), t = 0; t < e.length; t++) {
        var a = e[t];
        l.indexOf(a) === -1 && l.push(a);
      }
    }
  }
  var tu = null;
  function Qx(t) {
    var e = t.transitionTypes;
    return t.transitionTypes = null, e;
  }
  var eu = null, hc = 0, fa = 0, Wa = null;
  function $x(t, e) {
    if (eu === null) {
      var l = eu = [];
      hc = 0, fa = Af(), Wa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return hc++, e.then(lg, lg), e;
  }
  function lg() {
    if (--hc === 0 && (tu = null, eu !== null)) {
      Wa !== null && (Wa.status = "fulfilled");
      var t = eu;
      eu = null, fa = 0, Wa = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function Kx(t, e) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(u) {
        l.push(u);
      }
    };
    return t.then(
      function() {
        a.status = "fulfilled", a.value = e;
        for (var u = 0; u < l.length; u++) (0, l[u])(e);
      },
      function(u) {
        for (a.status = "rejected", a.reason = u, u = 0; u < l.length; u++)
          (0, l[u])(void 0);
      }
    ), a;
  }
  var ag = st.S;
  st.S = function(t, e) {
    if (I0 = ee(), typeof e == "object" && e !== null && typeof e.then == "function" && $x(t, e), tu !== null)
      for (var l = yi; l !== null; )
        ng(l, tu), l = l.next;
    if (l = t.types, l !== null) {
      for (var a = yi; a !== null; )
        ng(a, l), a = a.next;
      if (fa !== 0) {
        a = tu, a === null && (a = tu = []);
        for (var u = 0; u < l.length; u++) {
          var s = l[u];
          a.indexOf(s) === -1 && a.push(s);
        }
      }
    }
    ag !== null && ag(t, e);
  };
  var da = Mt(null);
  function gc() {
    var t = da.current;
    return t !== null ? t : Jt.pooledCache;
  }
  function Bo(t, e) {
    e === null ? Ht(da, da.current) : Ht(da, e.pool);
  }
  function ig() {
    var t = gc();
    return t === null ? null : { parent: se._currentValue, pool: t };
  }
  var Pa = Error(r(460)), mc = Error(r(474)), Lo = Error(r(542)), Vo = { then: function() {
  } };
  function ug(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function og(t, e, l) {
    switch (l = t[l], l === void 0 ? t.push(e) : l !== e && (e.then(On, On), e = l), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, sg(t), t === void 0 && !("reason" in e) ? Error(r(600)) : t;
      default:
        if (typeof e.status == "string") e.then(On, On);
        else {
          if (t = Jt, t !== null && 100 < t.shellSuspendCounter)
            throw Error(r(482));
          t = e, t.status = "pending", t.then(
            function(a) {
              if (e.status === "pending") {
                var u = e;
                u.status = "fulfilled", u.value = a;
              }
            },
            function(a) {
              if (e.status === "pending") {
                var u = e;
                u.status = "rejected", u.reason = a;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, sg(t), t;
        }
        throw ga = e, Pa;
    }
  }
  function ha(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (ga = l, Pa) : l;
    }
  }
  var ga = null;
  function rg() {
    if (ga === null) throw Error(r(459));
    var t = ga;
    return ga = null, t;
  }
  function sg(t) {
    if (t === Pa || t === Lo)
      throw Error(r(483));
  }
  var ti = null, nu = 0;
  function Yo(t) {
    var e = nu;
    return nu += 1, ti === null && (ti = []), og(ti, t, e);
  }
  function wl(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function qo(t, e) {
    throw e.$$typeof === $ ? Error(r(525)) : (t = Object.prototype.toString.call(e), Error(
      r(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function cg(t) {
    function e(X, R) {
      if (t) {
        var K = X.deletions;
        K === null ? (X.deletions = [R], X.flags |= 16) : K.push(R);
      }
    }
    function l(X, R) {
      if (!t) return null;
      for (; R !== null; )
        e(X, R), R = R.sibling;
      return null;
    }
    function a(X) {
      for (var R = /* @__PURE__ */ new Map(); X !== null; )
        X.key === null ? R.set(X.index, X) : R.set(X.key, X), X = X.sibling;
      return R;
    }
    function u(X, R) {
      return X = tl(X, R), X.index = 0, X.sibling = null, X;
    }
    function s(X, R, K) {
      return X.index = K, t ? (K = X.alternate, K !== null ? (K = K.index, K < R ? (X.flags |= 2, R) : K) : (X.flags |= 134217730, R)) : (X.flags |= 1048576, R);
    }
    function g(X) {
      return t && X.alternate === null && (X.flags |= 134217730), X;
    }
    function b(X, R, K, at) {
      return R === null || R.tag !== 6 ? (R = ic(K, X.mode, at), R.return = X, R) : (R = u(R, K), R.return = X, R);
    }
    function A(X, R, K, at) {
      var yt = K.type;
      return yt === nt ? (X = P(
        X,
        R,
        K.props.children,
        at,
        K.key
      ), wl(X, K), X) : R !== null && (R.elementType === yt || typeof yt == "object" && yt !== null && yt.$$typeof === et && ha(yt) === R.type) ? (R = u(R, K.props), wl(R, K), R.return = X, R) : (R = Ao(
        K.type,
        K.key,
        K.props,
        null,
        X.mode,
        at
      ), wl(R, K), R.return = X, R);
    }
    function Z(X, R, K, at) {
      return R === null || R.tag !== 4 || R.stateNode.containerInfo !== K.containerInfo || R.stateNode.implementation !== K.implementation ? (R = uc(K, X.mode, at), R.return = X, R) : (R = u(R, K.children || []), R.return = X, R);
    }
    function P(X, R, K, at, yt) {
      return R === null || R.tag !== 7 ? (R = ua(
        K,
        X.mode,
        at,
        yt
      ), R.return = X, R) : (R = u(R, K), R.return = X, R);
    }
    function it(X, R, K) {
      if (typeof R == "string" && R !== "" || typeof R == "number" || typeof R == "bigint")
        return R = ic(
          "" + R,
          X.mode,
          K
        ), R.return = X, R;
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case tt:
            return K = Ao(
              R.type,
              R.key,
              R.props,
              null,
              X.mode,
              K
            ), wl(K, R), K.return = X, K;
          case ot:
            return R = uc(
              R,
              X.mode,
              K
            ), R.return = X, R;
          case et:
            return R = ha(R), it(X, R, K);
        }
        if (gt(R) || rt(R))
          return R = ua(
            R,
            X.mode,
            K,
            null
          ), R.return = X, R;
        if (typeof R.then == "function")
          return it(X, Yo(R), K);
        if (R.$$typeof === L)
          return it(
            X,
            Uo(X, R),
            K
          );
        qo(X, R);
      }
      return null;
    }
    function V(X, R, K, at) {
      var yt = R !== null ? R.key : null;
      if (typeof K == "string" && K !== "" || typeof K == "number" || typeof K == "bigint")
        return yt !== null ? null : b(X, R, "" + K, at);
      if (typeof K == "object" && K !== null) {
        switch (K.$$typeof) {
          case tt:
            return K.key === yt ? A(X, R, K, at) : null;
          case ot:
            return K.key === yt ? Z(X, R, K, at) : null;
          case et:
            return K = ha(K), V(X, R, K, at);
        }
        if (gt(K) || rt(K))
          return yt !== null ? null : P(X, R, K, at, null);
        if (typeof K.then == "function")
          return V(
            X,
            R,
            Yo(K),
            at
          );
        if (K.$$typeof === L)
          return V(
            X,
            R,
            Uo(X, K),
            at
          );
        qo(X, K);
      }
      return null;
    }
    function I(X, R, K, at, yt) {
      if (typeof at == "string" && at !== "" || typeof at == "number" || typeof at == "bigint")
        return X = X.get(K) || null, b(R, X, "" + at, yt);
      if (typeof at == "object" && at !== null) {
        switch (at.$$typeof) {
          case tt:
            return X = X.get(
              at.key === null ? K : at.key
            ) || null, A(R, X, at, yt);
          case ot:
            return X = X.get(
              at.key === null ? K : at.key
            ) || null, Z(R, X, at, yt);
          case et:
            return at = ha(at), I(
              X,
              R,
              K,
              at,
              yt
            );
        }
        if (gt(at) || rt(at))
          return X = X.get(K) || null, P(R, X, at, yt, null);
        if (typeof at.then == "function")
          return I(
            X,
            R,
            K,
            Yo(at),
            yt
          );
        if (at.$$typeof === L)
          return I(
            X,
            R,
            K,
            Uo(R, at),
            yt
          );
        qo(R, at);
      }
      return null;
    }
    function mt(X, R, K, at) {
      for (var yt = null, Lt = null, _t = R, Tt = R = 0, de = null; _t !== null && Tt < K.length; Tt++) {
        _t.index > Tt ? (de = _t, _t = null) : de = _t.sibling;
        var Yt = V(
          X,
          _t,
          K[Tt],
          at
        );
        if (Yt === null) {
          _t === null && (_t = de);
          break;
        }
        t && _t && Yt.alternate === null && e(X, _t), R = s(Yt, R, Tt), Lt === null ? yt = Yt : Lt.sibling = Yt, Lt = Yt, _t = de;
      }
      if (Tt === K.length)
        return l(X, _t), Rt && el(X, Tt), yt;
      if (_t === null) {
        for (; Tt < K.length; Tt++)
          _t = it(X, K[Tt], at), _t !== null && (R = s(
            _t,
            R,
            Tt
          ), Lt === null ? yt = _t : Lt.sibling = _t, Lt = _t);
        return Rt && el(X, Tt), yt;
      }
      for (_t = a(_t); Tt < K.length; Tt++)
        de = I(
          _t,
          X,
          Tt,
          K[Tt],
          at
        ), de !== null && (t && (Yt = de.alternate, Yt !== null && _t.delete(Yt.key === null ? Tt : Yt.key)), R = s(
          de,
          R,
          Tt
        ), Lt === null ? yt = de : Lt.sibling = de, Lt = de);
      return t && _t.forEach(function(Xl) {
        return e(X, Xl);
      }), Rt && el(X, Tt), yt;
    }
    function vt(X, R, K, at) {
      if (K == null) throw Error(r(151));
      for (var yt = null, Lt = null, _t = R, Tt = R = 0, de = null, Yt = K.next(); _t !== null && !Yt.done; Tt++, Yt = K.next()) {
        _t.index > Tt ? (de = _t, _t = null) : de = _t.sibling;
        var Xl = V(X, _t, Yt.value, at);
        if (Xl === null) {
          _t === null && (_t = de);
          break;
        }
        t && _t && Xl.alternate === null && e(X, _t), R = s(Xl, R, Tt), Lt === null ? yt = Xl : Lt.sibling = Xl, Lt = Xl, _t = de;
      }
      if (Yt.done)
        return l(X, _t), Rt && el(X, Tt), yt;
      if (_t === null) {
        for (; !Yt.done; Tt++, Yt = K.next())
          Yt = it(X, Yt.value, at), Yt !== null && (R = s(Yt, R, Tt), Lt === null ? yt = Yt : Lt.sibling = Yt, Lt = Yt);
        return Rt && el(X, Tt), yt;
      }
      for (_t = a(_t); !Yt.done; Tt++, Yt = K.next())
        Yt = I(_t, X, Tt, Yt.value, at), Yt !== null && (t && (de = Yt.alternate, de !== null && _t.delete(
          de.key === null ? Tt : de.key
        )), R = s(Yt, R, Tt), Lt === null ? yt = Yt : Lt.sibling = Yt, Lt = Yt);
      return t && _t.forEach(function(CS) {
        return e(X, CS);
      }), Rt && el(X, Tt), yt;
    }
    function Dt(X, R, K, at) {
      if (typeof K == "object" && K !== null && K.type === nt && K.key === null && K.props.ref === void 0 && (K = K.props.children), typeof K == "object" && K !== null) {
        switch (K.$$typeof) {
          case tt:
            t: {
              for (var yt = K.key; R !== null; ) {
                if (R.key === yt) {
                  if (yt = K.type, yt === nt) {
                    if (R.tag === 7) {
                      l(
                        X,
                        R.sibling
                      ), at = u(
                        R,
                        K.props.children
                      ), wl(at, K), at.return = X, X = at;
                      break t;
                    }
                  } else if (R.elementType === yt || typeof yt == "object" && yt !== null && yt.$$typeof === et && ha(yt) === R.type) {
                    l(
                      X,
                      R.sibling
                    ), at = u(R, K.props), wl(at, K), at.return = X, X = at;
                    break t;
                  }
                  l(X, R);
                  break;
                } else e(X, R);
                R = R.sibling;
              }
              K.type === nt ? (at = ua(
                K.props.children,
                X.mode,
                at,
                K.key
              ), wl(at, K), at.return = X, X = at) : (at = Ao(
                K.type,
                K.key,
                K.props,
                null,
                X.mode,
                at
              ), wl(at, K), at.return = X, X = at);
            }
            return g(X);
          case ot:
            t: {
              for (yt = K.key; R !== null; ) {
                if (R.key === yt)
                  if (R.tag === 4 && R.stateNode.containerInfo === K.containerInfo && R.stateNode.implementation === K.implementation) {
                    l(
                      X,
                      R.sibling
                    ), at = u(R, K.children || []), at.return = X, X = at;
                    break t;
                  } else {
                    l(X, R);
                    break;
                  }
                else e(X, R);
                R = R.sibling;
              }
              at = uc(K, X.mode, at), at.return = X, X = at;
            }
            return g(X);
          case et:
            return K = ha(K), Dt(
              X,
              R,
              K,
              at
            );
        }
        if (gt(K))
          return mt(
            X,
            R,
            K,
            at
          );
        if (rt(K)) {
          if (yt = rt(K), typeof yt != "function") throw Error(r(150));
          return K = yt.call(K), vt(
            X,
            R,
            K,
            at
          );
        }
        if (typeof K.then == "function")
          return Dt(
            X,
            R,
            Yo(K),
            at
          );
        if (K.$$typeof === L)
          return Dt(
            X,
            R,
            Uo(X, K),
            at
          );
        qo(X, K);
      }
      return typeof K == "string" && K !== "" || typeof K == "number" || typeof K == "bigint" ? (K = "" + K, R !== null && R.tag === 6 ? (l(X, R.sibling), at = u(R, K), at.return = X, X = at) : (l(X, R), at = ic(K, X.mode, at), at.return = X, X = at), g(X)) : l(X, R);
    }
    return function(X, R, K, at) {
      try {
        nu = 0;
        var yt = Dt(
          X,
          R,
          K,
          at
        );
        return ti = null, yt;
      } catch (_t) {
        if (_t === Pa || _t === Lo) throw _t;
        var Lt = Ye(29, _t, null, X.mode);
        return Lt.lanes = at, Lt.return = X, Lt;
      }
    };
  }
  var ma = cg(!0), fg = cg(!1), _l = !1;
  function yc(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function pc(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function Nl(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Tl(t, e, l) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (Xt & 2) !== 0) {
      var u = a.pending;
      return u === null ? e.next = e : (e.next = u.next, u.next = e), a.pending = e, e = zo(t), kh(t, null, l), e;
    }
    return Mo(t, a, e, l), zo(t);
  }
  function lu(t, e, l) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (l & 4194048) !== 0)) {
      var a = e.lanes;
      a &= t.pendingLanes, l |= a, e.lanes = l, oo(t, l);
    }
  }
  function vc(t, e) {
    var l = t.updateQueue, a = t.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var u = null, s = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var g = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          s === null ? u = s = g : s = s.next = g, l = l.next;
        } while (l !== null);
        s === null ? u = s = e : s = s.next = e;
      } else u = s = e;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: s,
        shared: a.shared,
        callbacks: a.callbacks
      }, t.updateQueue = l;
      return;
    }
    t = l.lastBaseUpdate, t === null ? l.firstBaseUpdate = e : t.next = e, l.lastBaseUpdate = e;
  }
  var xc = !1;
  function au() {
    if (xc) {
      var t = Wa;
      if (t !== null) throw t;
    }
  }
  function iu(t, e, l, a) {
    xc = !1;
    var u = t.updateQueue;
    _l = !1;
    var s = u.firstBaseUpdate, g = u.lastBaseUpdate, b = u.shared.pending;
    if (b !== null) {
      u.shared.pending = null;
      var A = b, Z = A.next;
      A.next = null, g === null ? s = Z : g.next = Z, g = A;
      var P = t.alternate;
      P !== null && (P = P.updateQueue, b = P.lastBaseUpdate, b !== g && (b === null ? P.firstBaseUpdate = Z : b.next = Z, P.lastBaseUpdate = A));
    }
    if (s !== null) {
      var it = u.baseState;
      g = 0, P = Z = A = null, b = s;
      do {
        var V = b.lane & -536870913, I = V !== b.lane;
        if (I ? (Bt & V) === V : (a & V) === V) {
          V !== 0 && V === fa && (xc = !0), P !== null && (P = P.next = {
            lane: 0,
            tag: b.tag,
            payload: b.payload,
            callback: null,
            next: null
          });
          t: {
            var mt = t, vt = b;
            V = e;
            var Dt = l;
            switch (vt.tag) {
              case 1:
                if (mt = vt.payload, typeof mt == "function") {
                  it = mt.call(Dt, it, V);
                  break t;
                }
                it = mt;
                break t;
              case 3:
                mt.flags = mt.flags & -65537 | 128;
              case 0:
                if (mt = vt.payload, V = typeof mt == "function" ? mt.call(Dt, it, V) : mt, V == null) break t;
                it = H({}, it, V);
                break t;
              case 2:
                _l = !0;
            }
          }
          V = b.callback, V !== null && (t.flags |= 64, I && (t.flags |= 8192), I = u.callbacks, I === null ? u.callbacks = [V] : I.push(V));
        } else
          I = {
            lane: V,
            tag: b.tag,
            payload: b.payload,
            callback: b.callback,
            next: null
          }, P === null ? (Z = P = I, A = it) : P = P.next = I, g |= V;
        if (b = b.next, b === null) {
          if (b = u.shared.pending, b === null)
            break;
          I = b, b = I.next, I.next = null, u.lastBaseUpdate = I, u.shared.pending = null;
        }
      } while (!0);
      P === null && (A = it), u.baseState = A, u.firstBaseUpdate = Z, u.lastBaseUpdate = P, s === null && (u.shared.lanes = 0), Rl |= g, t.lanes = g, t.memoizedState = it;
    }
  }
  function dg(t, e) {
    if (typeof t != "function")
      throw Error(r(191, t));
    t.call(e);
  }
  function hg(t, e) {
    var l = t.callbacks;
    if (l !== null)
      for (t.callbacks = null, t = 0; t < l.length; t++)
        dg(l[t], e);
  }
  var Cl = Mt(null), Xo = Mt(0);
  function gg(t, e) {
    t = rl, Ht(Xo, t), Ht(Cl, e), rl = t | e.baseLanes;
  }
  function bc() {
    Ht(Xo, rl), Ht(Cl, Cl.current);
  }
  function Sc() {
    rl = Xo.current, Ot(Cl), Ot(Xo);
  }
  var Ne = Mt(null), Oe = null;
  function Ml(t) {
    var e = t.alternate;
    Ht(Te, Te.current & 1), Ht(Ne, t), Oe === null && (e === null || Cl.current !== null || e.memoizedState !== null) && (Oe = t);
  }
  function Ec(t) {
    Ht(Te, Te.current), Ht(Ne, t), Oe === null && (Oe = t);
  }
  function mg(t) {
    t.tag === 22 ? (Ht(Te, Te.current), Ht(Ne, t), Oe === null && (Oe = t)) : zl();
  }
  function zl() {
    Ht(Te, Te.current), Ht(Ne, Ne.current);
  }
  function Je(t) {
    Ot(Ne), Oe === t && (Oe = null), Ot(Te);
  }
  var Te = Mt(0);
  function uu(t, e) {
    Ht(Ne, Ne.current), Ht(Te, e);
  }
  function wc(t) {
    Ot(Te), Ot(Ne), Oe === t && (Oe = null);
  }
  function Zo(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || $f(l) || Kf(l)))
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== "independent") {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var al = 0, At = null, kt = null, ce = null, Go = !1, ei = !1, ya = !1, Qo = 0, ou = 0, ni = null, kx = 0;
  function ae() {
    throw Error(r(321));
  }
  function _c(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++)
      if (!ke(t[l], e[l])) return !1;
    return !0;
  }
  function Nc(t, e, l, a, u, s) {
    return al = s, At = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, st.H = t === null || t.memoizedState === null ? Wg : Pg, ya = !1, s = l(a, u), ya = !1, ei && (s = pg(
      e,
      l,
      a,
      u
    )), yg(t), s;
  }
  function yg(t) {
    st.H = Wo;
    var e = kt !== null && kt.next !== null;
    if (al = 0, ce = kt = At = null, Go = !1, ou = 0, ni = null, e) throw Error(r(300));
    t === null || fe || (t = t.dependencies, t !== null && jo(t) && (fe = !0));
  }
  function pg(t, e, l, a) {
    At = t;
    var u = 0;
    do {
      if (ei && (ni = null), ou = 0, ei = !1, 25 <= u) throw Error(r(301));
      if (u += 1, ce = kt = null, t.updateQueue != null) {
        var s = t.updateQueue;
        s.lastEffect = null, s.events = null, s.stores = null, s.memoCache != null && (s.memoCache.index = 0);
      }
      st.H = nb, s = e(l, a);
    } while (ei);
    return s;
  }
  function Jx() {
    var t = st.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? ru(e) : e, t = t.useState()[0], (kt !== null ? kt.memoizedState : null) !== t && (At.flags |= 1024), e;
  }
  function Tc() {
    var t = Qo !== 0;
    return Qo = 0, t;
  }
  function Cc(t, e, l) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~l;
  }
  function Mc(t) {
    if (Go) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      Go = !1;
    }
    al = 0, ce = kt = At = null, ei = !1, ou = Qo = 0, ni = null;
  }
  function Be() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return ce === null ? At.memoizedState = ce = t : ce = ce.next = t, ce;
  }
  function ue() {
    if (kt === null) {
      var t = At.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = kt.next;
    var e = ce === null ? At.memoizedState : ce.next;
    if (e !== null)
      ce = e, kt = t;
    else {
      if (t === null)
        throw At.alternate === null ? Error(r(467)) : Error(r(310));
      kt = t, t = {
        memoizedState: kt.memoizedState,
        baseState: kt.baseState,
        baseQueue: kt.baseQueue,
        queue: kt.queue,
        next: null
      }, ce === null ? At.memoizedState = ce = t : ce = ce.next = t;
    }
    return ce;
  }
  function $o() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function ru(t) {
    var e = ou;
    return ou += 1, ni === null && (ni = []), t = og(ni, t, e), e = At, (ce === null ? e.memoizedState : ce.next) === null && (e = e.alternate, st.H = e === null || e.memoizedState === null ? Wg : Pg), t;
  }
  function Ko(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return ru(t);
      if (t.$$typeof === F) return;
      if (t.$$typeof === L) return _e(t);
    }
    throw Error(r(438, String(t)));
  }
  function zc(t) {
    var e = null, l = At.updateQueue;
    if (l !== null && (e = l.memoCache), e == null) {
      var a = At.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (e = {
        data: a.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), l === null && (l = $o(), At.updateQueue = l), l.memoCache = e, l = e.data[e.index], l === void 0)
      for (l = e.data[e.index] = Array(t), a = 0; a < t; a++)
        l[a] = xt;
    return e.index++, l;
  }
  function il(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function ko(t) {
    var e = ue();
    return Ac(e, kt, t);
  }
  function Ac(t, e, l) {
    var a = t.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = l;
    var u = t.baseQueue, s = a.pending;
    if (s !== null) {
      if (u !== null) {
        var g = u.next;
        u.next = s.next, s.next = g;
      }
      e.baseQueue = u = s, a.pending = null;
    }
    if (s = t.baseState, u === null) t.memoizedState = s;
    else {
      e = u.next;
      var b = g = null, A = null, Z = e, P = !1;
      do {
        var it = Z.lane & -536870913;
        if (it !== Z.lane ? (Bt & it) === it : (al & it) === it) {
          var V = Z.revertLane;
          if (V === 0)
            A !== null && (A = A.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: Z.action,
              hasEagerState: Z.hasEagerState,
              eagerState: Z.eagerState,
              next: null
            }), it === fa && (P = !0);
          else if ((al & V) === V) {
            Z = Z.next, V === fa && (P = !0);
            continue;
          } else
            it = {
              lane: 0,
              revertLane: Z.revertLane,
              gesture: null,
              action: Z.action,
              hasEagerState: Z.hasEagerState,
              eagerState: Z.eagerState,
              next: null
            }, A === null ? (b = A = it, g = s) : A = A.next = it, At.lanes |= V, Rl |= V;
          it = Z.action, ya && l(s, it), s = Z.hasEagerState ? Z.eagerState : l(s, it);
        } else
          V = {
            lane: it,
            revertLane: Z.revertLane,
            gesture: Z.gesture,
            action: Z.action,
            hasEagerState: Z.hasEagerState,
            eagerState: Z.eagerState,
            next: null
          }, A === null ? (b = A = V, g = s) : A = A.next = V, At.lanes |= it, Rl |= it;
        Z = Z.next;
      } while (Z !== null && Z !== e);
      if (A === null ? g = s : A.next = b, !ke(s, t.memoizedState) && (fe = !0, P && (l = Wa, l !== null)))
        throw l;
      t.memoizedState = s, t.baseState = g, t.baseQueue = A, a.lastRenderedState = s;
    }
    return u === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
  }
  function Dc(t) {
    var e = ue(), l = e.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = t;
    var a = l.dispatch, u = l.pending, s = e.memoizedState;
    if (u !== null) {
      l.pending = null;
      var g = u = u.next;
      do
        s = t(s, g.action), g = g.next;
      while (g !== u);
      ke(s, e.memoizedState) || (fe = !0), e.memoizedState = s, e.baseQueue === null && (e.baseState = s), l.lastRenderedState = s;
    }
    return [s, a];
  }
  function vg(t, e, l) {
    var a = At, u = ue(), s = Rt;
    if (s) {
      if (l === void 0) throw Error(r(407));
      l = l();
    } else l = e();
    var g = !ke(
      (kt || u).memoizedState,
      l
    );
    if (g && (u.memoizedState = l, fe = !0), u = u.queue, Hc(Sg.bind(null, a, u, t), [
      t
    ]), t = u.getSnapshot !== e || g || ce !== null && (ce.memoizedState.tag & 1) !== 0, li(
      t ? 9 : 8,
      { destroy: void 0 },
      bg.bind(null, a, u, l, e),
      null
    ), t) {
      if (a.flags |= 2048, Jt === null) throw Error(r(349));
      s || (al & 127) !== 0 || xg(a, e, l);
    }
    return l;
  }
  function xg(t, e, l) {
    t.flags |= 16384, t = { getSnapshot: e, value: l }, e = At.updateQueue, e === null ? (e = $o(), At.updateQueue = e, e.stores = [t]) : (l = e.stores, l === null ? e.stores = [t] : l.push(t));
  }
  function bg(t, e, l, a) {
    e.value = l, e.getSnapshot = a, Eg(e) && wg(t);
  }
  function Sg(t, e, l) {
    return l(function() {
      Eg(e) && wg(t);
    });
  }
  function Eg(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !ke(t, l);
    } catch {
      return !0;
    }
  }
  function wg(t) {
    var e = ia(t, 2);
    e !== null && Ge(e, t, 2);
  }
  function Oc(t) {
    var e = Be();
    if (typeof t == "function") {
      var l = t;
      if (t = l(), ya) {
        Dn(!0);
        try {
          l();
        } finally {
          Dn(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: il,
      lastRenderedState: t
    }, e;
  }
  function _g(t, e, l, a) {
    return t.baseState = l, Ac(
      t,
      kt,
      typeof a == "function" ? a : il
    );
  }
  function Ix(t, e, l, a, u) {
    if (Fo(t)) throw Error(r(485));
    if (t = e.action, t !== null) {
      var s = {
        payload: u,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(g) {
          s.listeners.push(g);
        }
      };
      st.T !== null ? l(!0) : s.isTransition = !1, a(s), l = e.pending, l === null ? (s.next = e.pending = s, Ng(e, s)) : (s.next = l.next, e.pending = l.next = s);
    }
  }
  function Ng(t, e) {
    var l = e.action, a = e.payload, u = t.state;
    if (e.isTransition) {
      var s = st.T, g = {};
      g.types = s !== null ? s.types : null, st.T = g;
      try {
        var b = l(u, a), A = st.S;
        A !== null && A(g, b), Tg(t, e, b);
      } catch (Z) {
        Rc(t, e, Z);
      } finally {
        s !== null && g.types !== null && (s.types = g.types), st.T = s;
      }
    } else
      try {
        s = l(u, a), Tg(t, e, s);
      } catch (Z) {
        Rc(t, e, Z);
      }
  }
  function Tg(t, e, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Cg(t, e, a);
      },
      function(a) {
        return Rc(t, e, a);
      }
    ) : Cg(t, e, l);
  }
  function Cg(t, e, l) {
    e.status = "fulfilled", e.value = l, Mg(e), t.state = l, e = t.pending, e !== null && (l = e.next, l === e ? t.pending = null : (l = l.next, e.next = l, Ng(t, l)));
  }
  function Rc(t, e, l) {
    var a = t.pending;
    if (t.pending = null, a !== null) {
      a = a.next;
      do
        e.status = "rejected", e.reason = l, Mg(e), e = e.next;
      while (e !== a);
    }
    t.action = null;
  }
  function Mg(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function zg(t, e) {
    return e;
  }
  function Ag(t, e) {
    if (Rt) {
      var l = Jt.formState;
      if (l !== null) {
        t: {
          var a = At;
          if (Rt) {
            if (It) {
              e: {
                for (var u = It, s = fn; u.nodeType !== 8; ) {
                  if (!s) {
                    u = null;
                    break e;
                  }
                  if (u = hn(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break e;
                  }
                }
                s = u.data, u = s === "F!" || s === "F" ? u : null;
              }
              if (u) {
                It = hn(
                  u.nextSibling
                ), a = u.data === "F!";
                break t;
              }
            }
            Sl(a);
          }
          a = !1;
        }
        a && (e = l[0]);
      }
    }
    return l = Be(), l.memoizedState = l.baseState = e, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: zg,
      lastRenderedState: e
    }, l.queue = a, l = Jg.bind(
      null,
      At,
      a
    ), a.dispatch = l, a = Oc(!1), s = Vc.bind(
      null,
      At,
      !1,
      a.queue
    ), a = Be(), u = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, a.queue = u, l = Ix.bind(
      null,
      At,
      u,
      s,
      l
    ), u.dispatch = l, a.memoizedState = t, [e, l, !1];
  }
  function Dg(t) {
    var e = ue();
    return Og(e, kt, t);
  }
  function Og(t, e, l) {
    if (e = Ac(
      t,
      e,
      zg
    )[0], t = ko(il)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var a = ru(e);
      } catch (g) {
        throw g === Pa ? Lo : g;
      }
    else a = e;
    e = ue();
    var u = e.queue, s = u.dispatch;
    return l !== e.memoizedState && (At.flags |= 2048, li(
      9,
      { destroy: void 0 },
      Fx.bind(null, u, l),
      null
    )), [a, s, t];
  }
  function Fx(t, e) {
    t.action = e;
  }
  function Rg(t) {
    var e = ue(), l = kt;
    if (l !== null)
      return Og(e, l, t);
    ue(), e = e.memoizedState, l = ue();
    var a = l.queue.dispatch;
    return l.memoizedState = t, [e, a, !1];
  }
  function li(t, e, l, a) {
    return t = { tag: t, create: l, deps: a, inst: e, next: null }, e = At.updateQueue, e === null && (e = $o(), At.updateQueue = e), l = e.lastEffect, l === null ? e.lastEffect = t.next = t : (a = l.next, l.next = t, t.next = a, e.lastEffect = t), t;
  }
  function Hg() {
    return ue().memoizedState;
  }
  function Jo(t, e, l, a) {
    var u = Be();
    At.flags |= t, u.memoizedState = li(
      1 | e,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function Io(t, e, l, a) {
    var u = ue();
    a = a === void 0 ? null : a;
    var s = u.memoizedState.inst;
    kt !== null && a !== null && _c(a, kt.memoizedState.deps) ? u.memoizedState = li(e, s, l, a) : (At.flags |= t, u.memoizedState = li(
      1 | e,
      s,
      l,
      a
    ));
  }
  function jg(t, e) {
    Jo(8390656, 8, t, e);
  }
  function Hc(t, e) {
    Io(2048, 8, t, e);
  }
  function Wx(t) {
    At.flags |= 4;
    var e = At.updateQueue;
    if (e === null)
      e = $o(), At.updateQueue = e, e.events = [t];
    else {
      var l = e.events;
      l === null ? e.events = [t] : l.push(t);
    }
  }
  function Ug(t) {
    var e = ue().memoizedState;
    return Wx({ ref: e, nextImpl: t }), function() {
      if ((Xt & 2) !== 0) throw Error(r(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function Bg(t, e) {
    return Io(4, 2, t, e);
  }
  function Lg(t, e) {
    return Io(4, 4, t, e);
  }
  function Vg(t, e) {
    if (typeof e == "function") {
      t = t();
      var l = e(t);
      return function() {
        typeof l == "function" ? l() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function Yg(t, e, l) {
    l = l != null ? l.concat([t]) : null, Io(4, 4, Vg.bind(null, e, t), l);
  }
  function jc() {
  }
  function qg(t, e) {
    var l = ue();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    return e !== null && _c(e, a[1]) ? a[0] : (l.memoizedState = [t, e], t);
  }
  function Xg(t, e) {
    var l = ue();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    if (e !== null && _c(e, a[1]))
      return a[0];
    if (a = t(), ya) {
      Dn(!0);
      try {
        t();
      } finally {
        Dn(!1);
      }
    }
    return l.memoizedState = [a, e], a;
  }
  function Uc(t, e, l) {
    return l === void 0 || (al & 1073741824) !== 0 && (Bt & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = l, t = W0(), At.lanes |= t, Rl |= t, l);
  }
  function Zg(t, e, l, a) {
    return ke(l, e) ? l : Cl.current !== null ? (t = Uc(t, l, a), ke(t, e) || (fe = !0), t) : (al & 106) === 0 || (al & 1073741824) !== 0 && (Bt & 261930) === 0 ? (fe = !0, t.memoizedState = l) : (t = W0(), At.lanes |= t, Rl |= t, e);
  }
  function Gg(t, e, l, a, u) {
    var s = ct.p;
    ct.p = s !== 0 && 8 > s ? s : 8;
    var g = st.T, b = {};
    b.types = g !== null ? g.types : null, st.T = b, Vc(t, !1, e, l);
    try {
      var A = u(), Z = st.S;
      if (Z !== null && Z(b, A), A !== null && typeof A == "object" && typeof A.then == "function") {
        var P = Kx(
          A,
          a
        );
        su(
          t,
          e,
          P,
          Pe(t)
        );
      } else
        su(
          t,
          e,
          a,
          Pe(t)
        );
    } catch (it) {
      su(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: it },
        Pe()
      );
    } finally {
      ct.p = s, g !== null && b.types !== null && (g.types = b.types), st.T = g;
    }
  }
  function Px() {
  }
  function Bc(t, e, l, a) {
    if (t.tag !== 5) throw Error(r(476));
    var u = Qg(t).queue;
    Gg(
      t,
      u,
      e,
      bt,
      l === null ? Px : function() {
        return $g(t), l(a);
      }
    );
  }
  function Qg(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: bt,
      baseState: bt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: il,
        lastRenderedState: bt
      },
      next: null
    };
    var l = {};
    return e.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: il,
        lastRenderedState: l
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function $g(t) {
    var e = Qg(t);
    e.next === null && (e = t.alternate.memoizedState), su(
      t,
      e.next.queue,
      {},
      Pe()
    );
  }
  function Lc() {
    return _e(Ei);
  }
  function Kg() {
    return ue().memoizedState;
  }
  function kg() {
    return ue().memoizedState;
  }
  function tb(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = Pe();
          t = Nl(l);
          var a = Tl(e, t, l);
          a !== null && (Ge(a, e, l), lu(a, e, l)), e = { cache: dc() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function eb(t, e, l) {
    var a = Pe();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Fo(t) ? Ig(e, l) : (l = lc(t, e, l, a), l !== null && (Ge(l, t, a), Fg(l, e, a)));
  }
  function Jg(t, e, l) {
    var a = Pe();
    su(t, e, l, a);
  }
  function su(t, e, l, a) {
    var u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Fo(t)) Ig(e, u);
    else {
      var s = t.alternate;
      if (t.lanes === 0 && (s === null || s.lanes === 0) && (s = e.lastRenderedReducer, s !== null))
        try {
          var g = e.lastRenderedState, b = s(g, l);
          if (u.hasEagerState = !0, u.eagerState = b, ke(b, g))
            return Mo(t, e, u, 0), Jt === null && Co(), !1;
        } catch {
        }
      if (l = lc(t, e, u, a), l !== null)
        return Ge(l, t, a), Fg(l, e, a), !0;
    }
    return !1;
  }
  function Vc(t, e, l, a) {
    if (a = {
      lane: 2,
      revertLane: Af(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Fo(t)) {
      if (e) throw Error(r(479));
    } else
      e = lc(
        t,
        l,
        a,
        2
      ), e !== null && Ge(e, t, 2);
  }
  function Fo(t) {
    var e = t.alternate;
    return t === At || e !== null && e === At;
  }
  function Ig(t, e) {
    ei = Go = !0;
    var l = t.pending;
    l === null ? e.next = e : (e.next = l.next, l.next = e), t.pending = e;
  }
  function Fg(t, e, l) {
    if ((l & 4194048) !== 0) {
      var a = e.lanes;
      a &= t.pendingLanes, l |= a, e.lanes = l, oo(t, l);
    }
  }
  var Wo = {
    readContext: _e,
    use: Ko,
    useCallback: ae,
    useContext: ae,
    useEffect: ae,
    useImperativeHandle: ae,
    useLayoutEffect: ae,
    useInsertionEffect: ae,
    useMemo: ae,
    useReducer: ae,
    useRef: ae,
    useState: ae,
    useDebugValue: ae,
    useDeferredValue: ae,
    useTransition: ae,
    useSyncExternalStore: ae,
    useId: ae,
    useHostTransitionStatus: ae,
    useFormState: ae,
    useActionState: ae,
    useOptimistic: ae,
    useMemoCache: ae,
    useCacheRefresh: ae,
    useEffectEvent: ae
  }, Wg = {
    readContext: _e,
    use: Ko,
    useCallback: function(t, e) {
      return Be().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: _e,
    useEffect: jg,
    useImperativeHandle: function(t, e, l) {
      l = l != null ? l.concat([t]) : null, Jo(
        4194308,
        4,
        Vg.bind(null, e, t),
        l
      );
    },
    useLayoutEffect: function(t, e) {
      return Jo(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      Jo(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var l = Be();
      e = e === void 0 ? null : e;
      var a = t();
      if (ya) {
        Dn(!0);
        try {
          t();
        } finally {
          Dn(!1);
        }
      }
      return l.memoizedState = [a, e], a;
    },
    useReducer: function(t, e, l) {
      var a = Be();
      if (l !== void 0) {
        var u = l(e);
        if (ya) {
          Dn(!0);
          try {
            l(e);
          } finally {
            Dn(!1);
          }
        }
      } else u = e;
      return a.memoizedState = a.baseState = u, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: u
      }, a.queue = t, t = t.dispatch = eb.bind(
        null,
        At,
        t
      ), [a.memoizedState, t];
    },
    useRef: function(t) {
      var e = Be();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Oc(t);
      var e = t.queue, l = Jg.bind(null, At, e);
      return e.dispatch = l, [t.memoizedState, l];
    },
    useDebugValue: jc,
    useDeferredValue: function(t, e) {
      var l = Be();
      return Uc(l, t, e);
    },
    useTransition: function() {
      var t = Oc(!1);
      return t = Gg.bind(
        null,
        At,
        t.queue,
        !0,
        !1
      ), Be().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, l) {
      var a = At, u = Be();
      if (Rt) {
        if (l === void 0)
          throw Error(r(407));
        l = l();
      } else {
        if (l = e(), Jt === null)
          throw Error(r(349));
        (Bt & 127) !== 0 || xg(a, e, l);
      }
      u.memoizedState = l;
      var s = { value: l, getSnapshot: e };
      return u.queue = s, jg(Sg.bind(null, a, s, t), [
        t
      ]), a.flags |= 2048, li(
        9,
        { destroy: void 0 },
        bg.bind(
          null,
          a,
          s,
          l,
          e
        ),
        null
      ), l;
    },
    useId: function() {
      var t = Be(), e = Jt.identifierPrefix;
      if (Rt) {
        var l = Hn, a = Rn;
        l = (a & ~(1 << 32 - je(a) - 1)).toString(32) + l, e = "_" + e + "R_" + l, l = Qo++, 0 < l && (e += "H" + l.toString(32)), e += "_";
      } else
        l = kx++, e = "_" + e + "r_" + l.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Lc,
    useFormState: Ag,
    useActionState: Ag,
    useOptimistic: function(t) {
      var e = Be();
      e.memoizedState = e.baseState = t;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = l, e = Vc.bind(
        null,
        At,
        !0,
        l
      ), l.dispatch = e, [t, e];
    },
    useMemoCache: zc,
    useCacheRefresh: function() {
      return Be().memoizedState = tb.bind(
        null,
        At
      );
    },
    useEffectEvent: function(t) {
      var e = Be(), l = { impl: t };
      return e.memoizedState = l, function() {
        if ((Xt & 2) !== 0)
          throw Error(r(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, Pg = {
    readContext: _e,
    use: Ko,
    useCallback: qg,
    useContext: _e,
    useEffect: Hc,
    useImperativeHandle: Yg,
    useInsertionEffect: Bg,
    useLayoutEffect: Lg,
    useMemo: Xg,
    useReducer: ko,
    useRef: Hg,
    useState: function() {
      return ko(il);
    },
    useDebugValue: jc,
    useDeferredValue: function(t, e) {
      var l = ue();
      return Zg(
        l,
        kt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = ko(il)[0], e = ue().memoizedState;
      return [
        typeof t == "boolean" ? t : ru(t),
        e
      ];
    },
    useSyncExternalStore: vg,
    useId: Kg,
    useHostTransitionStatus: Lc,
    useFormState: Dg,
    useActionState: Dg,
    useOptimistic: function(t, e) {
      var l = ue();
      return _g(l, kt, t, e);
    },
    useMemoCache: zc,
    useCacheRefresh: kg,
    useEffectEvent: Ug
  }, nb = {
    readContext: _e,
    use: Ko,
    useCallback: qg,
    useContext: _e,
    useEffect: Hc,
    useImperativeHandle: Yg,
    useInsertionEffect: Bg,
    useLayoutEffect: Lg,
    useMemo: Xg,
    useReducer: Dc,
    useRef: Hg,
    useState: function() {
      return Dc(il);
    },
    useDebugValue: jc,
    useDeferredValue: function(t, e) {
      var l = ue();
      return kt === null ? Uc(l, t, e) : Zg(
        l,
        kt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Dc(il)[0], e = ue().memoizedState;
      return [
        typeof t == "boolean" ? t : ru(t),
        e
      ];
    },
    useSyncExternalStore: vg,
    useId: Kg,
    useHostTransitionStatus: Lc,
    useFormState: Rg,
    useActionState: Rg,
    useOptimistic: function(t, e) {
      var l = ue();
      return kt !== null ? _g(l, kt, t, e) : (l.baseState = t, [t, l.queue.dispatch]);
    },
    useMemoCache: zc,
    useCacheRefresh: kg,
    useEffectEvent: Ug
  };
  function Yc(t, e, l, a) {
    e = t.memoizedState, l = l(a, e), l = l == null ? e : H({}, e, l), t.memoizedState = l, t.lanes === 0 && (t.updateQueue.baseState = l);
  }
  var qc = {
    enqueueSetState: function(t, e, l) {
      t = t._reactInternals;
      var a = Pe(), u = Nl(a);
      u.payload = e, l != null && (u.callback = l), e = Tl(t, u, a), e !== null && (Ge(e, t, a), lu(e, t, a));
    },
    enqueueReplaceState: function(t, e, l) {
      t = t._reactInternals;
      var a = Pe(), u = Nl(a);
      u.tag = 1, u.payload = e, l != null && (u.callback = l), e = Tl(t, u, a), e !== null && (Ge(e, t, a), lu(e, t, a));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var l = Pe(), a = Nl(l);
      a.tag = 2, e != null && (a.callback = e), e = Tl(t, a, l), e !== null && (Ge(e, t, l), lu(e, t, l));
    }
  };
  function t0(t, e, l, a, u, s, g) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, s, g) : e.prototype && e.prototype.isPureReactComponent ? !Ji(l, a) || !Ji(u, s) : !0;
  }
  function e0(t, e, l, a) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(l, a), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(l, a), e.state !== t && qc.enqueueReplaceState(e, e.state, null);
  }
  function pa(t, e) {
    var l = e;
    if ("ref" in e) {
      l = {};
      for (var a in e)
        a !== "ref" && (l[a] = e[a]);
    }
    if (t = t.defaultProps) {
      l === e && (l = H({}, l));
      for (var u in t)
        l[u] === void 0 && (l[u] = t[u]);
    }
    return l;
  }
  function n0(t) {
    To(t);
  }
  function l0(t) {
    console.error(t);
  }
  function a0(t) {
    To(t);
  }
  function Po(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function i0(t, e, l) {
    try {
      var a = t.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function Xc(t, e, l) {
    return l = Nl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      Po(t, e);
    }, l;
  }
  function u0(t) {
    return t = Nl(t), t.tag = 3, t;
  }
  function o0(t, e, l, a) {
    var u = l.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var s = a.value;
      t.payload = function() {
        return u(s);
      }, t.callback = function() {
        i0(e, l, a);
      };
    }
    var g = l.stateNode;
    g !== null && typeof g.componentDidCatch == "function" && (t.callback = function() {
      i0(e, l, a), typeof u != "function" && (Hl === null ? Hl = /* @__PURE__ */ new Set([this]) : Hl.add(this));
      var b = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: b !== null ? b : ""
      });
    });
  }
  function lb(t, e, l, a, u) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (e = l.alternate, e !== null && sa(
        e,
        l,
        u,
        !0
      ), l = Ne.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
          case 19:
            return Oe === null ? br() : l.alternate === null && ie === 0 && (ie = 3), l.flags &= -257, l.flags |= 65536, l.lanes = u, a === Vo ? l.flags |= 16384 : (e = l.updateQueue, e === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : e.add(a), Cf(t, a, u)), !1;
          case 22:
            return l.flags |= 65536, a === Vo ? l.flags |= 16384 : (e = l.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = e) : (l = e.retryQueue, l === null ? e.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Cf(t, a, u)), !1;
        }
        throw Error(r(435, l.tag));
      }
      return Cf(t, a, u), br(), !1;
    }
    if (Rt)
      return e = Ne.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = u, a !== rc && (t = Error(r(422), { cause: a }), Wi(rn(t, l)))) : (a !== rc && (e = Error(r(423), {
        cause: a
      }), Wi(
        rn(e, l)
      )), t = t.current.alternate, t.flags |= 65536, u &= -u, t.lanes |= u, a = rn(a, l), u = Xc(
        t.stateNode,
        a,
        u
      ), vc(t, u), ie !== 4 && (ie = 2)), !1;
    var s = Error(r(520), { cause: a });
    if (s = rn(s, l), pu === null ? pu = [s] : pu.push(s), ie !== 4 && (ie = 2), e === null) return !0;
    a = rn(a, l), l = e;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, t = u & -u, l.lanes |= t, t = Xc(l.stateNode, a, t), vc(l, t), !1;
        case 1:
          if (e = l.type, s = l.stateNode, (l.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && (Hl === null || !Hl.has(s))))
            return l.flags |= 65536, u &= -u, l.lanes |= u, u = u0(u), o0(
              u,
              t,
              l,
              a
            ), vc(l, u), !1;
          break;
        case 22:
          if (l.memoizedState !== null)
            return l.flags |= 65536, !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Zc = Error(r(461)), fe = !1;
  function me(t, e, l, a) {
    e.child = t === null ? fg(e, null, l, a) : ma(
      e,
      t.child,
      l,
      a
    );
  }
  function r0(t, e, l, a, u) {
    l = l.render;
    var s = e.ref;
    if ("ref" in a) {
      var g = {};
      for (var b in a)
        b !== "ref" && (g[b] = a[b]);
    } else g = a;
    return ca(e), a = Nc(
      t,
      e,
      l,
      g,
      s,
      u
    ), b = Tc(), t !== null && !fe ? (Cc(t, e, u), ul(t, e, u)) : (Rt && b && Oo(e), e.flags |= 1, me(t, e, a, u), e.child);
  }
  function s0(t, e, l, a, u) {
    if (t === null) {
      var s = l.type;
      return typeof s == "function" && !ac(s) && s.defaultProps === void 0 && l.compare === null ? (e.tag = 15, e.type = s, c0(
        t,
        e,
        s,
        a,
        u
      )) : (t = Ao(
        l.type,
        null,
        a,
        e,
        e.mode,
        u
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (s = t.child, !Fc(t, u)) {
      var g = s.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Ji, l(g, a) && t.ref === e.ref)
        return ul(t, e, u);
    }
    return e.flags |= 1, t = tl(s, a), t.ref = e.ref, t.return = e, e.child = t;
  }
  function c0(t, e, l, a, u) {
    if (t !== null) {
      var s = t.memoizedProps;
      if (Ji(s, a) && t.ref === e.ref)
        if (fe = !1, e.pendingProps = a = s, Fc(t, u))
          (t.flags & 131072) !== 0 && (fe = !0);
        else
          return e.lanes = t.lanes, ul(t, e, u);
    }
    return Gc(
      t,
      e,
      l,
      a,
      u
    );
  }
  function f0(t, e, l, a) {
    var u = a.children, s = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (s = s !== null ? s.baseLanes | l : l, t !== null) {
          for (a = e.child = t.child, u = 0; a !== null; )
            u = u | a.lanes | a.childLanes, a = a.sibling;
          a = u & ~s;
        } else a = 0, e.child = null;
        return d0(
          t,
          e,
          s,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && Bo(
          e,
          s !== null ? s.cachePool : null
        ), s !== null ? gg(e, s) : bc(), mg(e);
      else
        return a = e.lanes = 536870912, d0(
          t,
          e,
          s !== null ? s.baseLanes | l : l,
          l,
          a
        );
    } else
      s !== null ? (Bo(e, s.cachePool), gg(e, s), zl(), e.memoizedState = null) : (t !== null && Bo(e, null), bc(), zl());
    return me(t, e, u, l), e.child;
  }
  function cu(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function d0(t, e, l, a, u) {
    var s = gc();
    return s = s === null ? null : { parent: se._currentValue, pool: s }, e.memoizedState = {
      baseLanes: l,
      cachePool: s
    }, t !== null && Bo(e, null), bc(), mg(e), t !== null && sa(t, e, a, !0), e.childLanes = u, null;
  }
  function tr(t, e) {
    return e = er(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function h0(t, e, l) {
    return ma(e, t.child, null, l), t = tr(e, e.pendingProps), t.flags |= 2, Je(e), e.memoizedState = null, t;
  }
  function ab(t, e, l) {
    var a = e.pendingProps, u = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (Rt) {
        if (a.mode === "hidden")
          return t = tr(e, a), e.lanes = 536870912, t.memoizedState = { baseLanes: 0, cachePool: null }, cu(null, t);
        if (Ec(e), (t = It) ? (t = Vm(
          t,
          fn
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: xl !== null ? { id: Rn, overflow: Hn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Ih(t), l.return = e, e.child = l, ve = e, It = null)) : t = null, t === null) throw Sl(e);
        return e.lanes = 536870912, null;
      }
      return tr(e, a);
    }
    var s = t.memoizedState;
    if (s !== null) {
      var g = s.dehydrated;
      if (Ec(e), u)
        if (e.flags & 256)
          e.flags &= -257, e = h0(
            t,
            e,
            l
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(r(558));
      else if (fe || sa(t, e, l, !1), u = (l & t.childLanes) !== 0, fe || u) {
        if (Cl.current === null) {
          if (a = Jt, a !== null && (g = ro(a, l), g !== 0 && g !== s.retryLane))
            throw s.retryLane = g, ia(t, g), Ge(a, t, g), Zc;
          br();
        }
        e = h0(
          t,
          e,
          l
        );
      } else
        t = s.treeContext, It = hn(g.nextSibling), ve = e, Rt = !0, bl = null, fn = !1, t !== null && Ph(e, t), e = tr(e, a), e.flags |= 134221824;
      return e;
    }
    return t = tl(t.child, {
      mode: a.mode,
      children: a.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function ai(t, e) {
    var l = e.ref;
    if (l === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(r(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function Gc(t, e, l, a, u) {
    return ca(e), l = Nc(
      t,
      e,
      l,
      a,
      void 0,
      u
    ), a = Tc(), t !== null && !fe ? (Cc(t, e, u), ul(t, e, u)) : (Rt && a && Oo(e), e.flags |= 1, me(t, e, l, u), e.child);
  }
  function g0(t, e, l, a, u, s) {
    return ca(e), e.updateQueue = null, l = pg(
      e,
      a,
      l,
      u
    ), yg(t), a = Tc(), t !== null && !fe ? (Cc(t, e, s), ul(t, e, s)) : (Rt && a && Oo(e), e.flags |= 1, me(t, e, l, s), e.child);
  }
  function m0(t, e, l, a, u) {
    if (ca(e), e.stateNode === null) {
      var s = ka, g = l.contextType;
      typeof g == "object" && g !== null && (s = _e(g)), s = new l(a, s), e.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, s.updater = qc, e.stateNode = s, s._reactInternals = e, s = e.stateNode, s.props = a, s.state = e.memoizedState, s.refs = {}, yc(e), g = l.contextType, s.context = typeof g == "object" && g !== null ? _e(g) : ka, s.state = e.memoizedState, g = l.getDerivedStateFromProps, typeof g == "function" && (Yc(
        e,
        l,
        g,
        a
      ), s.state = e.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (g = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), g !== s.state && qc.enqueueReplaceState(s, s.state, null), iu(e, a, s, u), au(), s.state = e.memoizedState), typeof s.componentDidMount == "function" && (e.flags |= 4194308), a = !0;
    } else if (t === null) {
      s = e.stateNode;
      var b = e.memoizedProps, A = pa(l, b);
      s.props = A;
      var Z = s.context, P = l.contextType;
      g = ka, typeof P == "object" && P !== null && (g = _e(P));
      var it = l.getDerivedStateFromProps;
      P = typeof it == "function" || typeof s.getSnapshotBeforeUpdate == "function", b = e.pendingProps !== b, P || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (b || Z !== g) && e0(
        e,
        s,
        a,
        g
      ), _l = !1;
      var V = e.memoizedState;
      s.state = V, iu(e, a, s, u), au(), Z = e.memoizedState, b || V !== Z || _l ? (typeof it == "function" && (Yc(
        e,
        l,
        it,
        a
      ), Z = e.memoizedState), (A = _l || t0(
        e,
        l,
        A,
        a,
        V,
        Z,
        g
      )) ? (P || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = a, e.memoizedState = Z), s.props = a, s.state = Z, s.context = g, a = A) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), a = !1);
    } else {
      s = e.stateNode, pc(t, e), g = e.memoizedProps, P = pa(l, g), s.props = P, it = e.pendingProps, V = s.context, Z = l.contextType, A = ka, typeof Z == "object" && Z !== null && (A = _e(Z)), b = l.getDerivedStateFromProps, (Z = typeof b == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (g !== it || V !== A) && e0(
        e,
        s,
        a,
        A
      ), _l = !1, V = e.memoizedState, s.state = V, iu(e, a, s, u), au();
      var I = e.memoizedState;
      g !== it || V !== I || _l || t !== null && t.dependencies !== null && jo(t.dependencies) ? (typeof b == "function" && (Yc(
        e,
        l,
        b,
        a
      ), I = e.memoizedState), (P = _l || t0(
        e,
        l,
        P,
        a,
        V,
        I,
        A
      ) || t !== null && t.dependencies !== null && jo(t.dependencies)) ? (Z || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(a, I, A), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(
        a,
        I,
        A
      )), typeof s.componentDidUpdate == "function" && (e.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || g === t.memoizedProps && V === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || g === t.memoizedProps && V === t.memoizedState || (e.flags |= 1024), e.memoizedProps = a, e.memoizedState = I), s.props = a, s.state = I, s.context = A, a = P) : (typeof s.componentDidUpdate != "function" || g === t.memoizedProps && V === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || g === t.memoizedProps && V === t.memoizedState || (e.flags |= 1024), a = !1);
    }
    return s = a, ai(t, e), a = (e.flags & 128) !== 0, s || a ? (s = e.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : s.render(), e.flags |= 1, t !== null && a ? (e.child = ma(
      e,
      t.child,
      null,
      u
    ), e.child = ma(
      e,
      null,
      l,
      u
    )) : me(t, e, l, u), e.memoizedState = s.state, t = e.child) : t = ul(
      t,
      e,
      u
    ), t;
  }
  function y0(t, e, l, a) {
    return oa(), e.flags |= 256, me(t, e, l, a), e.child;
  }
  var Qc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function $c(t) {
    return { baseLanes: t, cachePool: ig() };
  }
  function Kc(t, e, l) {
    return t = t !== null ? t.childLanes & ~l : 0, e && (t |= We), t;
  }
  function p0(t, e, l) {
    var a = e.pendingProps, u = !1, s = (e.flags & 128) !== 0, g;
    if ((g = s) || (g = t !== null && t.memoizedState === null ? !1 : (Te.current & 2) !== 0), g && (u = !0, e.flags &= -129), g = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (Rt) {
        if (u ? Ml(e) : zl(), (t = It) ? (t = Vm(
          t,
          fn
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: xl !== null ? { id: Rn, overflow: Hn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Ih(t), l.return = e, e.child = l, ve = e, It = null)) : t = null, t === null) throw Sl(e);
        return Kf(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      return s = a.children, a = a.fallback, u ? (zl(), u = e.mode, s = er(
        { mode: "hidden", children: s },
        u
      ), a = ua(
        a,
        u,
        l,
        null
      ), s.return = e, a.return = e, s.sibling = a, e.child = s, a = e.child, a.memoizedState = $c(l), a.childLanes = Kc(
        t,
        g,
        l
      ), e.memoizedState = Qc, cu(null, a)) : (Ml(e), kc(e, s));
    }
    var b = t.memoizedState;
    if (b !== null) {
      var A = b.dehydrated;
      if (A !== null)
        return ib(
          t,
          e,
          s,
          g,
          a,
          A,
          b,
          l
        );
    }
    return u ? (zl(), u = a.fallback, s = e.mode, b = t.child, A = b.sibling, a = tl(b, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = b.subtreeFlags & 1206910976, A !== null ? u = tl(A, u) : (u = ua(
      u,
      s,
      l,
      null
    ), u.flags |= 2), u.return = e, a.return = e, a.sibling = u, e.child = a, cu(null, a), a = e.child, u = t.child.memoizedState, u === null ? u = $c(l) : (s = u.cachePool, s !== null ? (b = se._currentValue, s = s.parent !== b ? { parent: b, pool: b } : s) : s = ig(), u = {
      baseLanes: u.baseLanes | l,
      cachePool: s
    }), a.memoizedState = u, a.childLanes = Kc(
      t,
      g,
      l
    ), e.memoizedState = Qc, cu(t.child, a)) : (Ml(e), l = t.child, t = l.sibling, l = tl(l, {
      mode: "visible",
      children: a.children
    }), l.return = e, l.sibling = null, t !== null && (g = e.deletions, g === null ? (e.deletions = [t], e.flags |= 16) : g.push(t)), e.child = l, e.memoizedState = null, l);
  }
  function kc(t, e) {
    return e = er(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function er(t, e) {
    return t = Ye(22, t, null, e), t.lanes = 0, t;
  }
  function nr(t, e, l) {
    return ma(e, t.child, null, l), t = kc(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function ib(t, e, l, a, u, s, g, b) {
    if (l)
      return e.flags & 256 ? (Ml(e), e.flags &= -257, nr(
        t,
        e,
        b
      )) : e.memoizedState !== null ? (zl(), e.child = t.child, e.flags |= 128, null) : (zl(), s = u.fallback, g = e.mode, u = er(
        { mode: "visible", children: u.children },
        g
      ), s = ua(
        s,
        g,
        b,
        null
      ), s.flags |= 2, u.return = e, s.return = e, u.sibling = s, e.child = u, ma(e, t.child, null, b), u = e.child, u.memoizedState = $c(b), u.childLanes = Kc(
        t,
        a,
        b
      ), e.memoizedState = Qc, cu(null, u));
    if (Ml(e), Kf(s)) {
      if (a = s.nextSibling && s.nextSibling.dataset, a) var A = a.dgst;
      return a = A, a !== "" && (u = Error(r(419)), u.stack = "", u.digest = a, Wi({ value: u, source: null, stack: null })), nr(
        t,
        e,
        b
      );
    }
    if (fe || sa(t, e, b, !1), a = (b & t.childLanes) !== 0, fe || a) {
      if (Cl.current !== null)
        return nr(
          t,
          e,
          b
        );
      if (a = Jt, a !== null && (u = ro(
        a,
        b
      ), u !== 0 && u !== g.retryLane))
        throw g.retryLane = u, ia(t, u), Ge(a, t, u), Zc;
      return $f(s) || br(), nr(
        t,
        e,
        b
      );
    }
    return $f(s) ? (e.flags |= 192, e.child = t.child, null) : (t = g.treeContext, It = hn(s.nextSibling), ve = e, Rt = !0, bl = null, fn = !1, t !== null && Ph(e, t), e = kc(
      e,
      u.children
    ), e.flags |= 134221824, e);
  }
  function v0(t, e, l) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e), Ho(t.return, e, l);
  }
  function x0(t) {
    for (var e = null; t !== null; ) {
      var l = t.alternate;
      l !== null && Zo(l) === null && (e = t), t = t.sibling;
    }
    return e;
  }
  function lr(t, e, l, a, u, s) {
    var g = t.memoizedState;
    g === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: u,
      treeForkCount: s
    } : (g.isBackwards = e, g.rendering = null, g.renderingStartTime = 0, g.last = a, g.tail = l, g.tailMode = u, g.treeForkCount = s);
  }
  function Jc(t) {
    var e = t.child;
    for (t.child = null; e !== null; ) {
      var l = e.sibling;
      e.sibling = t.child, t.child = e, e = l;
    }
  }
  function Ic(t, e, l) {
    var a = e.pendingProps, u = a.revealOrder, s = a.tail;
    a = a.children;
    var g = Te.current;
    if (e.flags & 128)
      return uu(e, g), null;
    var b = (g & 2) !== 0;
    if (b ? (g = g & 1 | 2, e.flags |= 128) : g &= 1, uu(e, g), u === "backwards" && t !== null ? (Jc(t), me(t, e, a, l), Jc(t)) : me(t, e, a, l), a = Rt ? Fi : 0, !b && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && v0(t, l, e);
        else if (t.tag === 19)
          v0(t, l, e);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    switch (u) {
      case "backwards":
        l = x0(e.child), l === null ? (u = e.child, e.child = null) : (u = l.sibling, l.sibling = null, Jc(e)), lr(
          e,
          !0,
          u,
          null,
          s,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (l = null, u = e.child, e.child = null; u !== null; ) {
          if (t = u.alternate, t !== null && Zo(t) === null) {
            e.child = u;
            break;
          }
          t = u.sibling, u.sibling = l, l = u, u = t;
        }
        lr(
          e,
          !0,
          l,
          null,
          s,
          a
        );
        break;
      case "together":
        lr(
          e,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        e.memoizedState = null;
        break;
      default:
        l = x0(e.child), l === null ? (u = e.child, e.child = null) : (u = l.sibling, l.sibling = null), lr(
          e,
          !1,
          u,
          l,
          s,
          a
        );
    }
    return e.child;
  }
  function b0(t, e, l) {
    var a = e.pendingProps;
    return El(e, e.type, a.value), me(t, e, a.children, l), e.child;
  }
  function ul(t, e, l) {
    if (t !== null && (e.dependencies = t.dependencies), Rl |= e.lanes, (l & e.childLanes) === 0)
      if (t !== null) {
        if (sa(
          t,
          e,
          l,
          !1
        ), (l & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(r(153));
    if (e.child !== null) {
      for (t = e.child, l = tl(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        t = t.sibling, l = l.sibling = tl(t, t.pendingProps), l.return = e;
      l.sibling = null;
    }
    return e.child;
  }
  function Fc(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && jo(t)));
  }
  function ub(t, e, l) {
    switch (e.tag) {
      case 3:
        ye(e, e.stateNode.containerInfo), El(e, se, t.memoizedState.cache), oa();
        break;
      case 27:
      case 5:
        pe(e);
        break;
      case 4:
        ye(e, e.stateNode.containerInfo);
        break;
      case 10:
        El(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, Ec(e), null;
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return Ml(e), e.flags |= 128, null;
          a = sa(
            t,
            e,
            l,
            !1
          );
          var u = e.child.childLanes;
          return a || (l & u) !== 0 ? p0(t, e, l) : (Ml(e), t = ul(
            t,
            e,
            l
          ), t !== null ? t.sibling : null);
        }
        Ml(e);
        break;
      case 19:
        if (e.flags & 128)
          return Ic(
            t,
            e,
            l
          );
        if (u = (t.flags & 128) !== 0, a = (l & e.childLanes) !== 0, a || (sa(
          t,
          e,
          l,
          !1
        ), a = (l & e.childLanes) !== 0), u) {
          if (a)
            return Ic(
              t,
              e,
              l
            );
          e.flags |= 128;
        }
        if (u = e.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), uu(e, Te.current), a) break;
        return null;
      case 22:
        return e.lanes = 0, f0(
          t,
          e,
          l,
          e.pendingProps
        );
      case 24:
        El(e, se, t.memoizedState.cache);
    }
    return ul(t, e, l);
  }
  function S0(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        fe = !0;
      else {
        if (!Fc(t, l) && (e.flags & 128) === 0)
          return fe = !1, ub(
            t,
            e,
            l
          );
        fe = (t.flags & 131072) !== 0;
      }
    else
      fe = !1, Rt && (e.flags & 1048576) !== 0 && Wh(e, Fi, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var a = e.pendingProps;
          if (t = ha(e.elementType), e.type = t, typeof t == "function")
            ac(t) ? (a = pa(t, a), e.tag = 1, e = m0(
              null,
              e,
              t,
              a,
              l
            )) : (e.tag = 0, e = Gc(
              null,
              e,
              t,
              a,
              l
            ));
          else {
            if (t != null) {
              var u = t.$$typeof;
              if (u === O) {
                e.tag = 11, e = r0(
                  null,
                  e,
                  t,
                  a,
                  l
                );
                break t;
              } else if (u === k) {
                e.tag = 14, e = s0(
                  null,
                  e,
                  t,
                  a,
                  l
                );
                break t;
              } else if (u === L) {
                e.tag = 10, e.type = t, e = b0(
                  null,
                  e,
                  l
                );
                break t;
              }
            }
            throw e = ft(t) || t, Error(r(306, e, ""));
          }
        }
        return e;
      case 0:
        return Gc(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 1:
        return a = e.type, u = pa(
          a,
          e.pendingProps
        ), m0(
          t,
          e,
          a,
          u,
          l
        );
      case 3:
        t: {
          if (ye(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(r(387));
          a = e.pendingProps;
          var s = e.memoizedState;
          u = s.element, pc(t, e), iu(e, a, null, l);
          var g = e.memoizedState;
          if (a = g.cache, El(e, se, a), a !== s.cache && fc(
            e,
            [se],
            l,
            !0
          ), au(), a = g.element, s.isDehydrated)
            if (s = {
              element: a,
              isDehydrated: !1,
              cache: g.cache
            }, e.updateQueue.baseState = s, e.memoizedState = s, e.flags & 256) {
              e = y0(
                t,
                e,
                a,
                l
              );
              break t;
            } else if (a !== u) {
              u = rn(
                Error(r(424)),
                e
              ), Wi(u), e = y0(
                t,
                e,
                a,
                l
              );
              break t;
            } else
              for (t = e.stateNode.containerInfo, t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t, It = hn(t.firstChild), ve = e, Rt = !0, bl = null, fn = !0, l = fg(
                e,
                null,
                a,
                l
              ), e.child = l; l; )
                l.flags = l.flags & -3 | 134221824, l = l.sibling;
          else {
            if (oa(), a === u) {
              e = ul(
                t,
                e,
                l
              );
              break t;
            }
            me(t, e, a, l);
          }
          e = e.child;
        }
        return e;
      case 26:
        return ai(t, e), t === null ? (l = $m(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = l : Rt || (e.stateNode = Nm(
          e.type,
          e.pendingProps,
          Nt.current,
          e
        )) : e.memoizedState = $m(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return pe(e), t === null && Rt && (a = e.stateNode = Xm(
          e.type,
          e.pendingProps,
          Nt.current
        ), ve = e, fn = !0, u = It, Bl(e.type) ? (kf = u, It = hn(a.firstChild)) : It = u), me(
          t,
          e,
          e.pendingProps.children,
          l
        ), ai(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && Rt && ((u = a = It) && (a = tS(
          a,
          e.type,
          e.pendingProps,
          fn
        ), a !== null ? (e.stateNode = a, ve = e, It = hn(a.firstChild), fn = !1, u = !0) : u = !1), u || Sl(e)), pe(e), u = e.type, s = e.pendingProps, g = t !== null ? t.memoizedProps : null, a = s.children, Vf(u, s) ? a = null : g !== null && Vf(u, g) && (e.flags |= 32), e.memoizedState !== null && (u = Nc(
          t,
          e,
          Jx,
          null,
          null,
          l
        ), Ei._currentValue = u), ai(t, e), me(t, e, a, l), e.child;
      case 6:
        return t === null && Rt && ((t = l = It) && (l = eS(
          l,
          e.pendingProps,
          fn
        ), l !== null ? (e.stateNode = l, ve = e, It = null, t = !0) : t = !1), t || Sl(e)), null;
      case 13:
        return p0(t, e, l);
      case 4:
        return ye(
          e,
          e.stateNode.containerInfo
        ), a = e.pendingProps, t === null ? e.child = ma(
          e,
          null,
          a,
          l
        ) : me(t, e, a, l), e.child;
      case 11:
        return r0(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 7:
        return a = e.pendingProps, ai(t, e), me(t, e, a, l), e.child;
      case 8:
        return me(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 12:
        return me(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 10:
        return b0(t, e, l);
      case 9:
        return u = e.type._context, a = e.pendingProps.children, ca(e), u = _e(u), a = a(u), e.flags |= 1, me(t, e, a, l), e.child;
      case 14:
        return s0(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 15:
        return c0(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 19:
        return Ic(t, e, l);
      case 31:
        return ab(t, e, l);
      case 22:
        return f0(
          t,
          e,
          l,
          e.pendingProps
        );
      case 24:
        return ca(e), a = _e(se), t === null ? (u = gc(), u === null && (u = Jt, s = dc(), u.pooledCache = s, s.refCount++, s !== null && (u.pooledCacheLanes |= l), u = s), e.memoizedState = { parent: a, cache: u }, yc(e), El(e, se, u)) : ((t.lanes & l) !== 0 && (pc(t, e), iu(e, null, null, l), au()), u = t.memoizedState, s = e.memoizedState, u.parent !== a ? (u = { parent: a, cache: a }, e.memoizedState = u, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = u), El(e, se, a)) : (a = s.cache, El(e, se, a), a !== u.cache && fc(
          e,
          [se],
          l,
          !0
        ))), me(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 30:
        return e.stateNode === null && (e.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = e.pendingProps, a.name != null && a.name !== "auto" ? e.flags |= t === null ? 18882560 : 18874368 : Rt && Oo(e), t !== null && t.memoizedProps.name !== a.name ? e.flags |= 4194816 : ai(t, e), me(t, e, a.children, l), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(r(156, e.tag));
  }
  function ol(t) {
    t.flags |= 4;
  }
  function Wc(t, e, l, a, u) {
    var s;
    if ((s = (t.mode & 32) !== 0) && (s = l === null ? Im(e, a) : Im(e, a) && (a.src !== l.src || a.srcSet !== l.srcSet)), s) {
      if (t.flags |= 16777216, (u & 335544128) === u)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (nm()) t.flags |= 8192;
        else
          throw ga = Vo, mc;
    } else t.flags &= -16777217;
  }
  function E0(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !Fm(e))
      if (nm()) t.flags |= 8192;
      else
        throw ga = Vo, mc;
  }
  function ar(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Bi() : 536870912, t.lanes |= e, si |= e);
  }
  function fu(t, e) {
    if (!Rt)
      switch (t.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var l = t.tail, a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (e = t.tail, l = null; e !== null; )
            e.alternate !== null && (l = e), e = e.sibling;
          l === null ? t.tail = null : l.sibling = null;
      }
  }
  function Ft(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, l = 0, a = 0;
    if (e)
      for (var u = t.child; u !== null; )
        l |= u.lanes | u.childLanes, a |= u.subtreeFlags & 1206910976, a |= u.flags & 1206910976, u.return = t, u = u.sibling;
    else
      for (u = t.child; u !== null; )
        l |= u.lanes | u.childLanes, a |= u.subtreeFlags, a |= u.flags, u.return = t, u = u.sibling;
    return t.subtreeFlags |= a, t.childLanes = l, e;
  }
  function ob(t, e, l) {
    var a = e.pendingProps;
    switch (oc(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ft(e), null;
      case 1:
        return Ft(e), null;
      case 3:
        return l = e.stateNode, a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), ll(se), Ee(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (t === null || t.child === null) && (Fa(e) ? ol(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, sc())), Ft(e), null;
      case 26:
        var u = e.type, s = e.memoizedState;
        return t === null ? (ol(e), s !== null ? (Ft(e), E0(e, s)) : (Ft(e), Wc(
          e,
          u,
          null,
          a,
          l
        ))) : s ? s !== t.memoizedState ? (ol(e), Ft(e), E0(e, s)) : (Ft(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== a && ol(e), Ft(e), Wc(
          e,
          u,
          t,
          a,
          l
        )), null;
      case 27:
        if (we(e), l = Nt.current, u = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && ol(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Ft(e), e.subtreeFlags &= -33554433, null;
          }
          t = Kt.current, Fa(e) ? tg(e) : (t = Xm(u, a, l), e.stateNode = t, ol(e));
        }
        return Ft(e), e.subtreeFlags &= -33554433, null;
      case 5:
        if (we(e), u = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && ol(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Ft(e), e.subtreeFlags &= -33554433, null;
          }
          if (s = Kt.current, Fa(e))
            tg(e);
          else {
            var g = Eu(
              Nt.current
            );
            switch (s) {
              case 1:
                s = g.createElementNS(
                  "http://www.w3.org/2000/svg",
                  u
                );
                break;
              case 2:
                s = g.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  u
                );
                break;
              default:
                switch (u) {
                  case "svg":
                    s = g.createElementNS(
                      "http://www.w3.org/2000/svg",
                      u
                    );
                    break;
                  case "math":
                    s = g.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      u
                    );
                    break;
                  case "script":
                    s = g.createElement("div"), s.innerHTML = "<script><\/script>", s = s.removeChild(
                      s.firstChild
                    );
                    break;
                  case "select":
                    s = typeof a.is == "string" ? g.createElement("select", {
                      is: a.is
                    }) : g.createElement("select"), a.multiple ? s.multiple = !0 : a.size && (s.size = a.size);
                    break;
                  default:
                    s = typeof a.is == "string" ? g.createElement(u, { is: a.is }) : g.createElement(u);
                }
            }
            s[ge] = e, s[De] = a;
            t: for (g = e.child; g !== null; ) {
              if (g.tag === 5 || g.tag === 6)
                s.appendChild(g.stateNode);
              else if (g.tag !== 4 && g.tag !== 27 && g.child !== null) {
                g.child.return = g, g = g.child;
                continue;
              }
              if (g === e) break t;
              for (; g.sibling === null; ) {
                if (g.return === null || g.return === e)
                  break t;
                g = g.return;
              }
              g.sibling.return = g.return, g = g.sibling;
            }
            e.stateNode = s;
            t: switch (Me(s, u, a), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break t;
              case "img":
                a = !0;
                break t;
              default:
                a = !1;
            }
            a && ol(e);
          }
        }
        return Ft(e), e.subtreeFlags &= -33554433, Wc(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          l
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== a && ol(e);
        else {
          if (typeof a != "string" && e.stateNode === null)
            throw Error(r(166));
          if (t = Nt.current, Fa(e)) {
            if (t = e.stateNode, l = e.memoizedProps, a = null, u = ve, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            t[ge] = e, t = !!(t.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Sm(t.nodeValue, l)), t || Sl(e, !0);
          } else
            t = Eu(t).createTextNode(
              a
            ), t[ge] = e, e.stateNode = t;
        }
        return Ft(e), null;
      case 31:
        if (l = e.memoizedState, t === null || t.memoizedState !== null) {
          if (a = Fa(e), l !== null) {
            if (t === null) {
              if (!a) throw Error(r(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(557));
              t[ge] = e;
            } else
              oa(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Ft(e), t = !1;
          } else
            l = sc(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = l), t = !0;
          if (!t)
            return e.flags & 256 ? (Je(e), e) : (Je(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(r(558));
        }
        return Ft(e), null;
      case 13:
        if (a = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (u = Fa(e), a !== null && a.dehydrated !== null) {
            if (t === null) {
              if (!u) throw Error(r(318));
              if (u = e.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(r(317));
              u[ge] = e;
            } else
              oa(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Ft(e), u = !1;
          } else
            u = sc(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return e.flags & 256 ? (Je(e), e) : (Je(e), null);
        }
        return Je(e), (e.flags & 128) !== 0 ? (e.lanes = l, e) : (l = a !== null, t = t !== null && t.memoizedState !== null, l && (a = e.child, u = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (u = a.alternate.memoizedState.cachePool.pool), s = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (s = a.memoizedState.cachePool.pool), s !== u && (a.flags |= 2048)), l !== t && l && (e.child.flags |= 8192), ar(e, e.updateQueue), Ft(e), null);
      case 4:
        return Ee(), t === null && Hf(e.stateNode.containerInfo), e.flags |= 67108864, Ft(e), null;
      case 10:
        return ll(e.type), Ft(e), null;
      case 19:
        if (wc(e), a = e.memoizedState, a === null) return Ft(e), null;
        if (u = (e.flags & 128) !== 0, s = a.rendering, s === null)
          if (u) fu(a, !1);
          else {
            if (ie !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (s = Zo(t), s !== null) {
                  for (e.flags |= 128, fu(a, !1), t = s.updateQueue, e.updateQueue = t, ar(e, t), e.subtreeFlags = 0, t = l, l = e.child; l !== null; )
                    Jh(l, t), l = l.sibling;
                  return uu(
                    e,
                    Te.current & 1 | 2
                  ), Rt && el(e, a.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            a.tail !== null && ee() > yr && (e.flags |= 128, u = !0, fu(a, !1), e.lanes = 4194304);
          }
        else {
          if (!u)
            if (t = Zo(s), t !== null) {
              if (e.flags |= 128, u = !0, t = t.updateQueue, e.updateQueue = t, ar(e, t), fu(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !s.alternate && !Rt)
                return Ft(e), null;
            } else
              2 * ee() - a.renderingStartTime > yr && l !== 536870912 && (e.flags |= 128, u = !0, fu(a, !1), e.lanes = 4194304);
          a.isBackwards ? (s.sibling = e.child, e.child = s) : (t = a.last, t !== null ? t.sibling = s : e.child = s, a.last = s);
        }
        if (a.tail !== null) {
          t = a.tail;
          t: {
            for (l = t; l !== null; ) {
              if (l.alternate !== null) {
                l = !1;
                break t;
              }
              l = l.sibling;
            }
            l = !0;
          }
          return a.rendering = t, a.tail = t.sibling, a.renderingStartTime = ee(), t.sibling = null, s = Te.current, s = u ? s & 1 | 2 : s & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !l || Rt ? uu(e, s) : (l = s, Ht(Ne, e), Ht(Te, l), Oe === null && (Oe = e)), Rt && el(e, a.treeForkCount), t;
        }
        return Ft(e), null;
      case 22:
      case 23:
        return Je(e), Sc(), a = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== a && (e.flags |= 8192) : a && (e.flags |= 8192), a ? (l & 536870912) !== 0 && (e.flags & 128) === 0 && (Ft(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Ft(e), l = e.updateQueue, l !== null && ar(e, l.retryQueue), l = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), a = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), a !== l && (e.flags |= 2048), t !== null && Ot(da), null;
      case 24:
        return l = null, t !== null && (l = t.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), ll(se), Ft(e), null;
      case 25:
        return null;
      case 30:
        return e.flags |= 33554432, Ft(e), null;
    }
    throw Error(r(156, e.tag));
  }
  function rb(t, e) {
    switch (oc(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return ll(se), Ee(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return we(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (Je(e), e.alternate === null)
            throw Error(r(340));
          oa();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (Je(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(r(340));
          oa();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return wc(e), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, t = e.memoizedState, t !== null && (t.rendering = null, t.tail = null), e.flags |= 4, e) : null;
      case 4:
        return Ee(), null;
      case 10:
        return ll(e.type), null;
      case 22:
      case 23:
        return Je(e), Sc(), t !== null && Ot(da), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return ll(se), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function w0(t, e) {
    switch (oc(e), e.tag) {
      case 3:
        ll(se), Ee();
        break;
      case 26:
      case 27:
      case 5:
        we(e);
        break;
      case 4:
        Ee();
        break;
      case 31:
        e.memoizedState !== null && Je(e);
        break;
      case 13:
        Je(e);
        break;
      case 19:
        wc(e);
        break;
      case 10:
        ll(e.type);
        break;
      case 22:
      case 23:
        Je(e), Sc(), t !== null && Ot(da);
        break;
      case 24:
        ll(se);
    }
  }
  function du(t, e) {
    try {
      var l = e.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        l = u;
        do {
          if ((l.tag & t) === t) {
            a = void 0;
            var s = l.create, g = l.inst;
            a = s(), g.destroy = a;
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (b) {
      Qt(e, e.return, b);
    }
  }
  function Al(t, e, l) {
    try {
      var a = e.updateQueue, u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var s = u.next;
        a = s;
        do {
          if ((a.tag & t) === t) {
            var g = a.inst, b = g.destroy;
            if (b !== void 0) {
              g.destroy = void 0, u = e;
              var A = l, Z = b;
              try {
                Z();
              } catch (P) {
                Qt(
                  u,
                  A,
                  P
                );
              }
            }
          }
          a = a.next;
        } while (a !== s);
      }
    } catch (P) {
      Qt(e, e.return, P);
    }
  }
  function _0(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        hg(e, l);
      } catch (a) {
        Qt(t, t.return, a);
      }
    }
  }
  function N0(t, e, l) {
    l.props = pa(
      t.type,
      t.memoizedProps
    ), l.state = t.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Qt(t, e, a);
    }
  }
  function jn(t, e) {
    try {
      var l = t.ref;
      if (l !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            var u = t.stateNode, s = Wn(t.memoizedProps, u);
            (u.ref === null || u.ref.name !== s) && (u.ref = Om(s)), a = u.ref;
            break;
          case 7:
            if (t.stateNode === null) {
              var g = new tn(t);
              m(
                t.child,
                !1,
                Wb,
                g,
                void 0,
                void 0
              ), t.stateNode = g;
            }
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof l == "function" ? t.refCleanup = l(a) : l.current = a;
      }
    } catch (b) {
      Qt(t, e, b);
    }
  }
  function Ce(t, e) {
    var l = t.ref, a = t.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (u) {
          Qt(t, e, u);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (u) {
          Qt(t, e, u);
        }
      else l.current = null;
  }
  function ir(t, e) {
    if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && e !== null)
      for (var l = 0; l < e.length; l++)
        Lm(
          t.stateNode,
          e[l]
        );
  }
  function T0(t) {
    for (var e = t.return; e !== null && (tf(e) && Lm(t.stateNode, e.stateNode), !Pc(e)); )
      e = e.return;
  }
  function hu(t) {
    for (var e = t.return; e !== null && (tf(e) && Pb(t.stateNode, e.stateNode), !Pc(e)); )
      e = e.return;
  }
  function Pc(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 27;
  }
  function tf(t) {
    return t && t.tag === 7 && t.stateNode !== null;
  }
  function ef(t) {
    var e = t.type, l = t.memoizedProps, a = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break t;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (u) {
      Qt(t, t.return, u);
    }
  }
  function nf(t, e, l) {
    try {
      var a = t.stateNode;
      Hb(a, t.type, l, e), a[De] = e;
    } catch (u) {
      Qt(t, t.return, u);
    }
  }
  function C0(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Bl(t.type) || t.tag === 4;
  }
  function lf(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || C0(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && Bl(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function af(t, e, l, a) {
    var u = t.tag;
    if (u === 5 || u === 6)
      u = t.stateNode, e ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(u, e) : (e = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, e.appendChild(u), l = l._reactRootContainer, l != null || e.onclick !== null || (e.onclick = On)), ir(t, a), qt = !0;
    else if (u !== 4 && (u === 27 && (ir(t, a), a = null, Bl(t.type) && (l = t.stateNode, e = null)), t = t.child, t !== null))
      for (af(
        t,
        e,
        l,
        a
      ), t = t.sibling; t !== null; )
        af(
          t,
          e,
          l,
          a
        ), t = t.sibling;
  }
  function ur(t, e, l, a) {
    var u = t.tag;
    if (u === 5 || u === 6)
      u = t.stateNode, e ? l.insertBefore(u, e) : l.appendChild(u), ir(t, a), qt = !0;
    else if (u !== 4 && (u === 27 && (ir(t, a), a = null, Bl(t.type) && (l = t.stateNode)), t = t.child, t !== null))
      for (ur(
        t,
        e,
        l,
        a
      ), t = t.sibling; t !== null; )
        ur(
          t,
          e,
          l,
          a
        ), t = t.sibling;
  }
  function M0(t) {
    var e = t.stateNode, l = t.memoizedProps;
    try {
      for (var a = t.type, u = e.attributes; u.length; )
        e.removeAttributeNode(u[0]);
      Me(e, a, l), e[ge] = t, e[De] = l;
    } catch (s) {
      Qt(t, t.return, s);
    }
  }
  var or = !1, Ie = null;
  function z0(t) {
    (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (or = !0);
  }
  var Un = null;
  function A0() {
    var t = Un;
    return Un = null, t;
  }
  var qe = 0;
  function ii(t, e, l, a, u) {
    return qe = 0, D0(
      t.child,
      e,
      l,
      a,
      u
    );
  }
  function D0(t, e, l, a, u) {
    for (var s = !1; t !== null; ) {
      if (t.tag === 5) {
        var g = t.stateNode;
        if (a !== null) {
          var b = Xf(g);
          a.push(b), b.view && (s = !0);
        } else
          s || Xf(g).view && (s = !0);
        or = !0, Am(
          g,
          qe === 0 ? e : e + "_" + qe,
          l
        ), qe++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && u || D0(
        t.child,
        e,
        l,
        a,
        u
      ) && (s = !0));
      t = t.sibling;
    }
    return s;
  }
  function Bn(t, e) {
    for (; t !== null; )
      t.tag === 5 ? Dm(t.stateNode, t.memoizedProps) : (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && e || Bn(
        t.child,
        e
      )), t = t.sibling;
  }
  function rr(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if ((t.tag !== 22 || t.memoizedState === null) && (rr(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)) {
          var e = t.memoizedProps;
          if (e.name == null || e.name === "auto")
            throw Error(r(544));
          var l = e.name;
          e = Pn(e.default, e.share), e !== "none" && (ii(
            t,
            l,
            e,
            null,
            !1
          ) || Bn(t.child, !1));
        }
        t = t.sibling;
      }
  }
  function uf(t, e) {
    if (t.tag === 30) {
      var l = t.stateNode, a = t.memoizedProps, u = Wn(a, l), s = Pn(
        a.default,
        l.paired ? a.share : a.enter
      );
      s !== "none" ? ii(t, u, s, null, !1) ? (rr(t), l.paired || e || hi(t, a.onEnter)) : Bn(t.child, !1) : rr(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        uf(t, e), t = t.sibling;
    else rr(t);
  }
  function of(t) {
    if (Ie !== null && Ie.size !== 0) {
      var e = Ie;
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var l = t.memoizedProps, a = l.name;
              if (a != null && a !== "auto") {
                var u = e.get(a);
                if (u !== void 0) {
                  var s = Pn(
                    l.default,
                    l.share
                  );
                  if (s !== "none" && (ii(
                    t,
                    a,
                    s,
                    null,
                    !1
                  ) ? (s = t.stateNode, u.paired = s, s.paired = u, hi(t, l.onShare)) : Bn(t.child, !1)), e.delete(a), e.size === 0) break;
                }
              }
            }
            of(t);
          }
          t = t.sibling;
        }
    }
  }
  function rf(t) {
    if (t.tag === 30) {
      var e = t.memoizedProps, l = Wn(e, t.stateNode), a = Ie !== null ? Ie.get(l) : void 0, u = Pn(
        e.default,
        a !== void 0 ? e.share : e.exit
      );
      u !== "none" && (ii(t, l, u, null, !1) ? a !== void 0 ? (u = t.stateNode, a.paired = u, u.paired = a, Ie.delete(l), hi(t, e.onShare)) : hi(t, e.onExit) : Bn(t.child, !1)), Ie !== null && of(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        rf(t), t = t.sibling;
    else
      Ie !== null && of(t);
  }
  function O0(t) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var e = t.memoizedProps, l = Wn(e, t.stateNode);
        e = Pn(e.default, e.update), t.flags &= -5, e !== "none" && ii(
          t,
          l,
          e,
          t.memoizedState = [],
          !1
        );
      } else
        (t.subtreeFlags & 33554432) !== 0 && O0(t);
      t = t.sibling;
    }
  }
  function sf(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if (t.tag !== 22 || t.memoizedState === null) {
          if (t.tag === 30 && (t.flags & 18874368) !== 0) {
            var e = t.stateNode;
            e.paired !== null && (e.paired = null, Bn(t.child, !1));
          }
          sf(t);
        }
        t = t.sibling;
      }
  }
  function sr(t) {
    if (t.tag === 30)
      t.stateNode.paired = null, Bn(t.child, !1), sf(t);
    else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        sr(t), t = t.sibling;
    else sf(t);
  }
  function R0(t) {
    for (t = t.child; t !== null; )
      t.tag === 30 ? Bn(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && R0(t), t = t.sibling;
  }
  function cf(t, e, l, a, u, s, g) {
    for (var b = !1; e !== null; ) {
      if (e.tag === 5) {
        var A = e.stateNode;
        if (s !== null && qe < s.length) {
          var Z = s[qe], P = Xf(A);
          (Z.view || P.view) && (b = !0);
          var it;
          if (it = (t.flags & 4) === 0)
            if (P.clip) it = !0;
            else {
              it = Z.rect;
              var V = P.rect;
              it = it.y !== V.y || it.x !== V.x || it.height !== V.height || it.width !== V.width;
            }
          it && (t.flags |= 4), P.abs ? P = !Z.abs : (Z = Z.rect, P = P.rect, P = Z.height !== P.height || Z.width !== P.width), P && (t.flags |= 32);
        } else t.flags |= 32;
        (t.flags & 4) !== 0 && Am(
          A,
          qe === 0 ? l : l + "_" + qe,
          u
        ), b && (t.flags & 4) !== 0 || (Un === null && (Un = []), Un.push(
          A,
          qe === 0 ? a : a + "_" + qe,
          e.memoizedProps
        )), qe++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && g ? t.flags |= e.flags & 32 : cf(
        t,
        e.child,
        l,
        a,
        u,
        s,
        g
      ) && (b = !0));
      e = e.sibling;
    }
    return b;
  }
  function H0(t, e) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var l = t.memoizedProps, a = t.stateNode, u = Wn(l, a), s = Pn(l.default, l.update), g;
        g = t.memoizedState, t.memoizedState = null, a = t;
        var b = t.child;
        qe = 0, u = cf(
          a,
          b,
          u,
          u,
          s,
          g,
          !1
        ), (t.flags & 4) !== 0 && u && hi(t, l.onUpdate);
      } else
        (t.subtreeFlags & 33554432) !== 0 && H0(t);
      t = t.sibling;
    }
  }
  var xe = !1, Zt = !1, Ln = !1, ff = !1, j0 = typeof WeakSet == "function" ? WeakSet : Set, be = null, Vn = !1, gu = !1, cr = !1, df = !1;
  function sb(t, e, l) {
    if (t = t.containerInfo, Bf = wi, t = Vh(t), Fs(t)) {
      if ("selectionStart" in t)
        var a = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          a = (a = t.ownerDocument) && a.defaultView || window;
          var u = a.getSelection && a.getSelection();
          if (u && u.rangeCount !== 0) {
            a = u.anchorNode;
            var s = u.anchorOffset, g = u.focusNode;
            u = u.focusOffset;
            try {
              a.nodeType, g.nodeType;
            } catch {
              a = null;
              break t;
            }
            var b = 0, A = -1, Z = -1, P = 0, it = 0, V = t, I = null;
            e: for (; ; ) {
              for (var mt; V !== a || s !== 0 && V.nodeType !== 3 || (A = b + s), V !== g || u !== 0 && V.nodeType !== 3 || (Z = b + u), V.nodeType === 3 && (b += V.nodeValue.length), (mt = V.firstChild) !== null; )
                I = V, V = mt;
              for (; ; ) {
                if (V === t) break e;
                if (I === a && ++P === s && (A = b), I === g && ++it === u && (Z = b), (mt = V.nextSibling) !== null) break;
                V = I, I = V.parentNode;
              }
              V = mt;
            }
            a = A === -1 || Z === -1 ? null : { start: A, end: Z };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Lf = { focusedElem: t, selectionRange: a }, wi = !1, l = (l & 335544064) === l, be = e, e = l ? 9270 : 1024; be !== null; ) {
      if (t = be, l && (a = t.deletions, a !== null))
        for (s = 0; s < a.length; s++)
          l && rf(a[s]);
      if (t.alternate === null && (t.flags & 2) !== 0)
        l && z0(t), fr(l);
      else {
        if (t.tag === 22) {
          if (a = t.alternate, t.memoizedState !== null) {
            a !== null && a.memoizedState === null && l && rf(a), fr(l);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            l && z0(t), fr(l);
            continue;
          }
        }
        a = t.child, (t.subtreeFlags & e) !== 0 && a !== null ? (a.return = t, be = a) : (l && O0(t), fr(l));
      }
    }
    Ie = null;
  }
  function fr(t) {
    for (; be !== null; ) {
      var e = be, l = t, a = e.alternate, u = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((u & 1024) !== 0 && a !== null) {
            l = void 0, u = a.memoizedProps, a = a.memoizedState;
            var s = e.stateNode;
            try {
              var g = pa(
                e.type,
                u
              );
              l = s.getSnapshotBeforeUpdate(
                g,
                a
              ), s.__reactInternalSnapshotBeforeUpdate = l;
            } catch (b) {
              Qt(e, e.return, b);
            }
          }
          break;
        case 3:
          if ((u & 1024) !== 0) {
            if (a = e.stateNode.containerInfo, l = a.nodeType, l === 9)
              Qf(a);
            else if (l === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Qf(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          l && a !== null && (l = Wn(
            a.memoizedProps,
            a.stateNode
          ), u = e.memoizedProps, u = Pn(u.default, u.update), u !== "none" && ii(
            a,
            l,
            u,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((u & 1024) !== 0) throw Error(r(163));
      }
      if (a = e.sibling, a !== null) {
        a.return = e.return, be = a;
        break;
      }
      be = e.return;
    }
  }
  function U0(t, e, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        Yn(t, l), a & 4 && du(5, l);
        break;
      case 1:
        if (Yn(t, l), a & 4)
          if (t = l.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (g) {
              Qt(l, l.return, g);
            }
          else {
            var u = pa(
              l.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                u,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (g) {
              Qt(
                l,
                l.return,
                g
              );
            }
          }
        a & 64 && _0(l), a & 512 && jn(l, l.return);
        break;
      case 3:
        if (Yn(t, l), a & 64 && (t = l.updateQueue, t !== null)) {
          if (e = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                e = l.child.stateNode;
                break;
              case 1:
                e = l.child.stateNode;
            }
          try {
            hg(t, e);
          } catch (g) {
            Qt(l, l.return, g);
          }
        }
        break;
      case 27:
        e === null && a & 4 && M0(l);
      case 26:
      case 5:
        Yn(t, l), e === null && a & 4 && ef(l), a & 512 && jn(l, l.return);
        break;
      case 12:
        Yn(t, l);
        break;
      case 31:
        Yn(t, l), a & 4 && Y0(t, l);
        break;
      case 13:
        Yn(t, l), a & 4 && q0(t, l), a & 64 && (t = l.memoizedState, t !== null && (t = t.dehydrated, t !== null && (l = Sb.bind(
          null,
          l
        ), nS(t, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || xe, !a) {
          var s = e !== null && e.memoizedState !== null || Zt;
          e = xe, u = Zt, xe = a, (Zt = s) && !u ? (a = 2, (l.subtreeFlags & 8772) !== 0 && (a |= 1), bn(
            t,
            l,
            a
          )) : Yn(t, l), xe = e, Zt = u;
        }
        break;
      case 30:
        Yn(t, l), a & 512 && jn(l, l.return);
        break;
      case 7:
        a & 512 && jn(l, l.return);
      default:
        Yn(t, l);
    }
  }
  function hf(t, e) {
    for (t = t.child; t !== null; )
      B0(t, e), t = t.sibling;
  }
  function B0(t, e) {
    switch (t.tag) {
      case 5:
      case 26:
        try {
          var l = t.stateNode;
          if (e) {
            var a = l.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var u = t.stateNode, s = t.memoizedProps.style, g = s != null && s.hasOwnProperty("display") ? s.display : null;
            u.style.display = g == null || typeof g == "boolean" ? "" : ("" + g).trim();
          }
        } catch (A) {
          Qt(t, t.return, A);
        }
        gf(t, e);
        break;
      case 6:
        try {
          t.stateNode.nodeValue = e ? "" : t.memoizedProps, qt = !0;
        } catch (A) {
          Qt(t, t.return, A);
        }
        break;
      case 18:
        try {
          var b = t.stateNode;
          e ? zm(b, !0) : zm(t.stateNode, !1);
        } catch (A) {
          Qt(t, t.return, A);
        }
        break;
      case 22:
      case 23:
        t.memoizedState === null && hf(t, e);
        break;
      default:
        hf(t, e);
    }
  }
  function gf(t, e) {
    if (t.subtreeFlags & 67108864)
      for (t = t.child; t !== null; ) {
        t: {
          var l = t, a = e;
          switch (l.tag) {
            case 4:
              B0(l, a);
              break t;
            case 22:
              l.memoizedState === null && gf(l, a);
              break t;
            default:
              gf(l, a);
          }
        }
        t = t.sibling;
      }
  }
  function L0(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, L0(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Va(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var te = null, Xe = !1;
  function vn(t, e, l) {
    for (l = l.child; l !== null; )
      V0(t, e, l), l = l.sibling;
  }
  function V0(t, e, l) {
    if (He && typeof He.onCommitFiberUnmount == "function")
      try {
        He.onCommitFiberUnmount(Wl, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Zt || Ce(l, e), vn(
          t,
          e,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && !Zt && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Zt || Ce(l, e), hu(l);
        var a = te, u = Xe;
        Bl(l.type) && (te = l.stateNode, Xe = !1), vn(
          t,
          e,
          l
        ), Zm(
          l.stateNode,
          l.type,
          l.memoizedProps
        ), te = a, Xe = u;
        break;
      case 5:
        Zt || Ce(l, e), hu(l);
      case 6:
        if (l.tag === 6 && hu(l), a = te, u = Xe, te = null, vn(
          t,
          e,
          l
        ), te = a, Xe = u, te !== null)
          if (Xe)
            try {
              (te.nodeType === 9 ? te.body : te.nodeName === "HTML" ? te.ownerDocument.body : te).removeChild(l.stateNode), qt = !0;
            } catch (s) {
              Qt(
                l,
                e,
                s
              );
            }
          else
            try {
              te.removeChild(l.stateNode), qt = !0;
            } catch (s) {
              Qt(
                l,
                e,
                s
              );
            }
        break;
      case 18:
        te !== null && (Xe ? (t = te, Mm(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          l.stateNode
        ), _i(t)) : Mm(te, l.stateNode));
        break;
      case 4:
        a = te, u = Xe, te = l.stateNode.containerInfo, Xe = !0, vn(
          t,
          e,
          l
        ), te = a, Xe = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Al(2, l, e), Zt || Al(4, l, e), vn(
          t,
          e,
          l
        );
        break;
      case 1:
        Zt || (Ce(l, e), a = l.stateNode, typeof a.componentWillUnmount == "function" && N0(
          l,
          e,
          a
        )), vn(
          t,
          e,
          l
        );
        break;
      case 21:
        vn(
          t,
          e,
          l
        );
        break;
      case 22:
        Zt = (a = Zt) || l.memoizedState !== null, vn(
          t,
          e,
          l
        ), Zt = a;
        break;
      case 30:
        Ce(l, e), vn(
          t,
          e,
          l
        );
        break;
      case 7:
        Zt || Ce(l, e), vn(
          t,
          e,
          l
        );
        break;
      default:
        vn(
          t,
          e,
          l
        );
    }
  }
  function Y0(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        _i(t);
      } catch (l) {
        Qt(e, e.return, l);
      }
    }
  }
  function q0(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        _i(t);
      } catch (l) {
        Qt(e, e.return, l);
      }
  }
  function cb(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new j0()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new j0()), e;
      default:
        throw Error(r(435, t.tag));
    }
  }
  function dr(t, e) {
    var l = cb(t);
    e.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var u = Eb.bind(null, t, a);
        a.then(u, u);
      }
    });
  }
  function Le(t, e, l) {
    var a = e.deletions;
    if (a !== null)
      for (var u = 0; u < a.length; u++) {
        var s = a[u], g = t, b = e, A = b;
        t: for (; A !== null; ) {
          switch (A.tag) {
            case 27:
              if (Bl(A.type)) {
                te = A.stateNode, Xe = !1;
                break t;
              }
              break;
            case 5:
              te = A.stateNode, Xe = !1;
              break t;
            case 3:
            case 4:
              te = A.stateNode.containerInfo, Xe = !0;
              break t;
          }
          A = A.return;
        }
        if (te === null) throw Error(r(160));
        V0(g, b, s), te = null, Xe = !1, g = s.alternate, g !== null && (g.return = null), s.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        X0(e, t, l), e = e.sibling;
  }
  var xn = null;
  function X0(t, e, l) {
    var a = t.alternate, u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (u & 4 && (a = t.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var s = 0; s < a.length; s++) {
            var g = a[s];
            g.ref.impl = g.nextImpl;
          }
        Le(e, t, l), Ve(t), u & 4 && (Al(3, t, t.return), du(3, t), Al(5, t, t.return));
        break;
      case 1:
        Le(e, t, l), Ve(t), u & 512 && (Zt || a === null || Ce(a, a.return)), u & 64 && xe && (t = t.updateQueue, t !== null && (e = t.callbacks, e !== null && (l = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = l === null ? e : l.concat(e))));
        break;
      case 26:
        if (s = xn, Le(e, t, l), Ve(t), u & 512 && (Zt || a === null || Ce(a, a.return)), u & 4)
          if (u = a !== null ? a.memoizedState : null, l = t.memoizedState, a === null)
            if (l === null)
              if (t.stateNode === null)
                if (xe)
                  t.stateNode = Nm(
                    t.type,
                    t.memoizedProps,
                    e.containerInfo,
                    t
                  );
                else {
                  t: {
                    e = t.type, l = t.memoizedProps, u = s.ownerDocument || s;
                    e: switch (e) {
                      case "title":
                        a = u.getElementsByTagName("title")[0], (!a || a[ea] || a[ge] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = u.createElement(e), u.head.insertBefore(
                          a,
                          u.querySelector("head > title")
                        )), Me(a, e, l), a[ge] = t, re(a), e = a;
                        break t;
                      case "link":
                        if (s = Jm(
                          "link",
                          "href",
                          u
                        ).get(e + (l.href || ""))) {
                          for (g = 0; g < s.length; g++)
                            if (a = s[g], a.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && a.getAttribute("rel") === (l.rel == null ? null : l.rel) && a.getAttribute("title") === (l.title == null ? null : l.title) && a.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                              s.splice(g, 1);
                              break e;
                            }
                        }
                        a = u.createElement(e), Me(a, e, l), u.head.appendChild(a);
                        break;
                      case "meta":
                        if (s = Jm(
                          "meta",
                          "content",
                          u
                        ).get(e + (l.content || ""))) {
                          for (g = 0; g < s.length; g++)
                            if (a = s[g], a.getAttribute("content") === (l.content == null ? null : "" + l.content) && a.getAttribute("name") === (l.name == null ? null : l.name) && a.getAttribute("property") === (l.property == null ? null : l.property) && a.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && a.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                              s.splice(g, 1);
                              break e;
                            }
                        }
                        a = u.createElement(e), Me(a, e, l), u.head.appendChild(a);
                        break;
                      default:
                        throw Error(r(468, e));
                    }
                    a[ge] = t, re(a), e = a;
                  }
                  t.stateNode = e;
                }
              else
                xe || Wf(s, t.type, t.stateNode);
            else
              t.stateNode = km(
                s,
                l,
                t.memoizedProps
              );
          else
            u !== l ? (u === null ? (e = a.stateNode, e === null || Zt || e.parentNode.removeChild(e)) : u.count--, l === null ? xe || Wf(s, t.type, t.stateNode) : km(s, l, t.memoizedProps)) : l === null && t.stateNode !== null && nf(
              t,
              t.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        Le(e, t, l), Ve(t), u & 512 && (Zt || a === null || Ce(a, a.return)), a !== null && u & 4 && nf(
          t,
          t.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (s = Ln, Ln = !1, Le(e, t, l), Ln = s, Ve(t), u & 512 && (Zt || a === null || Ce(a, a.return)), t.flags & 32) {
          e = t.stateNode;
          try {
            qa(e, ""), qt = !0;
          } catch (P) {
            Qt(t, t.return, P);
          }
        }
        u & 4 && t.stateNode != null && (e = t.memoizedProps, nf(
          t,
          e,
          a !== null ? a.memoizedProps : e
        )), u & 1024 && (ff = !0);
        break;
      case 6:
        if (Le(e, t, l), Ve(t), u & 4) {
          if (t.stateNode === null)
            throw Error(r(162));
          e = t.memoizedProps, l = t.stateNode;
          try {
            l.nodeValue = e, qt = !0;
          } catch (P) {
            Qt(t, t.return, P);
          }
        }
        break;
      case 3:
        if (qt = !1, Cr = null, s = xn, xn = wu(e.containerInfo), Le(e, t, l), xn = s, Ve(t), u & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            _i(e.containerInfo);
          } catch (P) {
            Qt(t, t.return, P);
          }
        ff && (ff = !1, Z0(t)), qt = !1;
        break;
      case 4:
        u = Ln, Ln = xe, a = sh(), s = xn, xn = wu(
          t.stateNode.containerInfo
        ), Le(e, t, l), Ve(t), xn = s, qt && gu && (cr = !0), qt = a, Ln = u;
        break;
      case 12:
        Le(e, t, l), Ve(t);
        break;
      case 31:
        Le(e, t, l), Ve(t), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, dr(t, e)));
        break;
      case 13:
        Le(e, t, l), Ve(t), t.child.flags & 8192 && t.memoizedState !== null != (a !== null && a.memoizedState !== null) && (mr = ee()), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, dr(t, e)));
        break;
      case 22:
        s = t.memoizedState !== null, g = a !== null && a.memoizedState !== null;
        var b = xe, A = Zt, Z = Ln;
        xe = b || s, Ln = Z || s, Zt = A || g, Le(e, t, l), Zt = A, Ln = Z, xe = b, Ve(t), u & 8192 && (e = t.stateNode, e._visibility = s ? e._visibility & -2 : e._visibility | 1, !s || a === null || g || xe || Zt || (e = g || Zt, l = xe, a = Zt, xe = s || xe, Zt = e, Dl(t, 2), xe = l, Zt = a), !s && Ln || hf(t, s)), u & 4 && (e = t.updateQueue, e !== null && (l = e.retryQueue, l !== null && (e.retryQueue = null, dr(t, l))));
        break;
      case 19:
        Le(e, t, l), Ve(t), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, dr(t, e)));
        break;
      case 30:
        u & 512 && (Zt || a === null || Ce(a, a.return)), u = sh(), s = gu, g = (l & 335544064) === l, b = t.memoizedProps, gu = g && Pn(
          b.default,
          b.update
        ) !== "none", Le(e, t, l), Ve(t), g && a !== null && qt && (t.flags |= 4), gu = s, qt = u;
        break;
      case 21:
        break;
      case 7:
        u & 512 && (Zt || a === null || Ce(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = t);
      default:
        Le(e, t, l), Ve(t);
    }
  }
  function Ve(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, a = t.return; a !== null; ) {
          if (C0(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var u = t.return; u !== null; ) {
          if (tf(u)) {
            var s = u.stateNode;
            a === null ? a = [s] : a.push(s);
          }
          if (Pc(u)) break;
          u = u.return;
        }
        var g = a;
        if (l == null) throw Error(r(160));
        switch (l.tag) {
          case 27:
            var b = l.stateNode, A = lf(t);
            ur(
              t,
              A,
              b,
              g
            );
            break;
          case 5:
            var Z = l.stateNode;
            l.flags & 32 && (qa(Z, ""), l.flags &= -33);
            var P = lf(t);
            ur(
              t,
              P,
              Z,
              g
            );
            break;
          case 3:
          case 4:
            var it = l.stateNode.containerInfo, V = lf(t);
            af(
              t,
              V,
              it,
              g
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (I) {
        Qt(t, t.return, I);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Z0(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Z0(e), e.tag === 5 && e.flags & 1024 && (e = e.stateNode, wi = !0, e.reset(), wi = !1), t = t.sibling;
      }
  }
  function ui(t, e) {
    if (e.subtreeFlags & 9270)
      for (e = e.child; e !== null; )
        G0(e, t), e = e.sibling;
    else H0(e);
  }
  function G0(t, e) {
    var l = t.alternate;
    if (l === null) uf(t, !1);
    else
      switch (t.tag) {
        case 3:
          if (df = Vn = !1, A0(), ui(e, t), !Vn && !cr) {
            if (t = Un, t !== null)
              for (var a = 0; a < t.length; a += 3) {
                l = t[a];
                var u = t[a + 1];
                Dm(l, t[a + 2]), l = l.ownerDocument.documentElement, l !== null && l.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + u + ")"
                  }
                );
              }
            t = e.containerInfo, t = t.nodeType === 9 ? t.documentElement : t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "" && (t.style.viewTransitionName = "none", t.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), t.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), df = !0;
          }
          Un = null;
          break;
        case 5:
          ui(e, t);
          break;
        case 4:
          a = Vn, Vn = !1, ui(e, t), Vn && (cr = !0), Vn = a;
          break;
        case 22:
          t.memoizedState === null && (l.memoizedState !== null ? uf(t, !1) : ui(e, t));
          break;
        case 30:
          a = Vn, u = A0(), Vn = !1, ui(e, t), Vn && (t.flags |= 4);
          var s = t.memoizedProps, g = t.stateNode;
          e = Wn(s, g), g = Wn(l.memoizedProps, g);
          var b = Pn(s.default, s.update);
          b === "none" ? e = !1 : (s = l.memoizedState, l.memoizedState = null, l = t.child, qe = 0, e = cf(
            t,
            l,
            e,
            g,
            b,
            s,
            !0
          ), qe !== (s === null ? 0 : s.length) && (t.flags |= 32)), (t.flags & 4) !== 0 && e ? (hi(
            t,
            t.memoizedProps.onUpdate
          ), Un = u) : u !== null && (u.push.apply(u, Un), Un = u), Vn = (t.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          ui(e, t);
      }
  }
  function Yn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        U0(t, e.alternate, e), e = e.sibling;
  }
  function Dl(t, e) {
    for (t = t.child; t !== null; ) {
      var l = t, a = e;
      switch (l.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Al(4, l, l.return), Dl(
            l,
            a
          );
          break;
        case 1:
          Ce(l, l.return);
          var u = l.stateNode;
          typeof u.componentWillUnmount == "function" && N0(
            l,
            l.return,
            u
          ), Dl(
            l,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && Zm(
            l.stateNode,
            l.type,
            l.memoizedProps
          );
        case 5:
          Ce(l, l.return), l.tag !== 5 && l.tag !== 27 || hu(l), Dl(
            l,
            a
          );
          break;
        case 6:
          hu(l);
          break;
        case 26:
          Ce(l, l.return), u = l.stateNode, l.memoizedState !== null || u === null || Zt || u.parentNode.removeChild(u), Dl(
            l,
            a
          );
          break;
        case 22:
          l.memoizedState === null && Dl(
            l,
            a
          );
          break;
        case 30:
          Ce(l, l.return), Dl(
            l,
            a
          );
          break;
        case 7:
          Ce(l, l.return);
        default:
          Dl(
            l,
            a
          );
      }
      t = t.sibling;
    }
  }
  function bn(t, e, l) {
    for (l = (e.subtreeFlags & 8772) !== 0 ? l : l & -2, e = e.child; e !== null; ) {
      var a = e.alternate, u = t, s = e, g = s.flags, b = (l & 1) !== 0;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          bn(
            u,
            s,
            l
          ), du(4, s);
          break;
        case 1:
          if (bn(
            u,
            s,
            l
          ), a = s, u = a.stateNode, typeof u.componentDidMount == "function")
            try {
              u.componentDidMount();
            } catch (P) {
              Qt(a, a.return, P);
            }
          if (a = s, u = a.updateQueue, u !== null) {
            var A = a.stateNode;
            try {
              var Z = u.shared.hiddenCallbacks;
              if (Z !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < Z.length; u++)
                  dg(Z[u], A);
            } catch (P) {
              Qt(a, a.return, P);
            }
          }
          b && g & 64 && _0(s), jn(s, s.return);
          break;
        case 27:
          (l & 2) !== 0 && M0(s);
        case 5:
          s.tag !== 5 && s.tag !== 27 || T0(s), bn(
            u,
            s,
            l
          ), b && a === null && g & 4 && ef(s), jn(s, s.return);
          break;
        case 6:
          T0(s);
          break;
        case 26:
          A = s.stateNode, s.memoizedState !== null || A === null || xe || Wf(
            wu(A.ownerDocument),
            s.type,
            A
          ), bn(
            u,
            s,
            l
          ), b && a === null && g & 4 && ef(s), jn(s, s.return);
          break;
        case 12:
          bn(
            u,
            s,
            l
          );
          break;
        case 31:
          bn(
            u,
            s,
            l
          ), b && g & 4 && Y0(u, s);
          break;
        case 13:
          bn(
            u,
            s,
            l
          ), b && g & 4 && q0(u, s);
          break;
        case 22:
          s.memoizedState === null && bn(
            u,
            s,
            l
          ), jn(s, s.return);
          break;
        case 30:
          bn(
            u,
            s,
            l
          ), jn(s, s.return);
          break;
        case 7:
          jn(s, s.return);
        default:
          bn(
            u,
            s,
            l
          );
      }
      e = e.sibling;
    }
  }
  function mf(t, e) {
    var l = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== l && (t != null && t.refCount++, l != null && Pi(l));
  }
  function yf(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Pi(t));
  }
  function dn(t, e, l, a) {
    var u = (l & 335544064) === l;
    if (e.subtreeFlags & (u ? 10262 : 10256))
      for (e = e.child; e !== null; )
        Q0(
          t,
          e,
          l,
          a
        ), e = e.sibling;
    else u && R0(e);
  }
  function Q0(t, e, l, a) {
    var u = (l & 335544064) === l;
    u && e.alternate === null && e.return !== null && e.return.alternate !== null && sr(e);
    var s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        dn(
          t,
          e,
          l,
          a
        ), s & 2048 && du(9, e);
        break;
      case 1:
        dn(
          t,
          e,
          l,
          a
        );
        break;
      case 3:
        dn(
          t,
          e,
          l,
          a
        ), u && df && (t = t.containerInfo, t = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, t.style.viewTransitionName === "root" && (t.style.viewTransitionName = ""), t = t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "none" && (t.style.viewTransitionName = "")), s & 2048 && (s = null, e.alternate !== null && (s = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== s && (e.refCount++, s != null && Pi(s)));
        break;
      case 12:
        if (s & 2048) {
          dn(
            t,
            e,
            l,
            a
          ), s = e.stateNode;
          try {
            var g = e.memoizedProps, b = g.id, A = g.onPostCommit;
            typeof A == "function" && A(
              b,
              e.alternate === null ? "mount" : "update",
              s.passiveEffectDuration,
              -0
            );
          } catch (Z) {
            Qt(e, e.return, Z);
          }
        } else
          dn(
            t,
            e,
            l,
            a
          );
        break;
      case 31:
        dn(
          t,
          e,
          l,
          a
        );
        break;
      case 13:
        dn(
          t,
          e,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        g = e.stateNode, b = e.alternate, e.memoizedState !== null ? (u && b !== null && b.memoizedState === null && sr(b), g._visibility & 2 ? dn(
          t,
          e,
          l,
          a
        ) : mu(
          t,
          e
        )) : (u && b !== null && b.memoizedState !== null && sr(e), g._visibility & 2 ? dn(
          t,
          e,
          l,
          a
        ) : (g._visibility |= 2, oi(
          t,
          e,
          l,
          a,
          (e.subtreeFlags & 10256) !== 0 || !1
        ))), s & 2048 && mf(b, e);
        break;
      case 24:
        dn(
          t,
          e,
          l,
          a
        ), s & 2048 && yf(e.alternate, e);
        break;
      case 30:
        u && (s = e.alternate, s !== null && (Bn(s.child, !0), Bn(e.child, !0))), dn(
          t,
          e,
          l,
          a
        );
        break;
      default:
        dn(
          t,
          e,
          l,
          a
        );
    }
  }
  function oi(t, e, l, a, u) {
    for (u = u && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var s = t, g = e, b = l, A = a, Z = g.flags;
      switch (g.tag) {
        case 0:
        case 11:
        case 15:
          oi(
            s,
            g,
            b,
            A,
            u
          ), du(8, g);
          break;
        case 23:
          break;
        case 22:
          var P = g.stateNode;
          g.memoizedState !== null ? P._visibility & 2 ? oi(
            s,
            g,
            b,
            A,
            u
          ) : mu(
            s,
            g
          ) : (P._visibility |= 2, oi(
            s,
            g,
            b,
            A,
            u
          )), u && Z & 2048 && mf(
            g.alternate,
            g
          );
          break;
        case 24:
          oi(
            s,
            g,
            b,
            A,
            u
          ), u && Z & 2048 && yf(g.alternate, g);
          break;
        default:
          oi(
            s,
            g,
            b,
            A,
            u
          );
      }
      e = e.sibling;
    }
  }
  function mu(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t, a = e, u = a.flags;
        switch (a.tag) {
          case 22:
            mu(l, a), u & 2048 && mf(
              a.alternate,
              a
            );
            break;
          case 24:
            mu(l, a), u & 2048 && yf(a.alternate, a);
            break;
          default:
            mu(l, a);
        }
        e = e.sibling;
      }
  }
  var va = 8192;
  function xa(t, e, l) {
    if (t.subtreeFlags & va)
      for (t = t.child; t !== null; )
        $0(
          t,
          e,
          l
        ), t = t.sibling;
  }
  function $0(t, e, l) {
    switch (t.tag) {
      case 26:
        xa(
          t,
          e,
          l
        ), t.flags & va && (t.memoizedState !== null ? yS(
          l,
          xn,
          t.memoizedState,
          t.memoizedProps
        ) : (t = t.stateNode, (e & 335544128) === e && Pm(l, t)));
        break;
      case 5:
        xa(
          t,
          e,
          l
        ), t.flags & va && (t = t.stateNode, (e & 335544128) === e && Pm(l, t));
        break;
      case 3:
      case 4:
        var a = xn;
        xn = wu(t.stateNode.containerInfo), xa(
          t,
          e,
          l
        ), xn = a;
        break;
      case 22:
        t.memoizedState === null && (a = t.alternate, a !== null && a.memoizedState !== null ? (a = va, va = 16777216, xa(
          t,
          e,
          l
        ), va = a) : xa(
          t,
          e,
          l
        ));
        break;
      case 30:
        if ((t.flags & va) !== 0 && (a = t.memoizedProps.name, a != null && a !== "auto")) {
          var u = t.stateNode;
          u.paired = null, Ie === null && (Ie = /* @__PURE__ */ new Map()), Ie.set(a, u);
        }
        xa(
          t,
          e,
          l
        );
        break;
      default:
        xa(
          t,
          e,
          l
        );
    }
  }
  function K0(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function yu(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          be = a, J0(
            a,
            t
          );
        }
      K0(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        k0(t), t = t.sibling;
  }
  function k0(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        yu(t), t.flags & 2048 && Al(9, t, t.return);
        break;
      case 3:
        yu(t);
        break;
      case 12:
        yu(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, hr(t)) : yu(t);
        break;
      default:
        yu(t);
    }
  }
  function hr(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          be = a, J0(
            a,
            t
          );
        }
      K0(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          Al(8, e, e.return), hr(e);
          break;
        case 22:
          l = e.stateNode, l._visibility & 2 && (l._visibility &= -3, hr(e));
          break;
        default:
          hr(e);
      }
      t = t.sibling;
    }
  }
  function J0(t, e) {
    for (; be !== null; ) {
      var l = be;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Al(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Pi(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, be = a;
      else
        t: for (l = t; be !== null; ) {
          a = be;
          var u = a.sibling, s = a.return;
          if (L0(a), a === l) {
            be = null;
            break t;
          }
          if (u !== null) {
            u.return = s, be = u;
            break t;
          }
          be = s;
        }
    }
  }
  var fb = {
    getCacheForType: function(t) {
      var e = _e(se), l = e.data.get(t);
      return l === void 0 && (l = t(), e.data.set(t, l)), l;
    },
    cacheSignal: function() {
      return _e(se).controller.signal;
    }
  }, db = typeof WeakMap == "function" ? WeakMap : Map, Xt = 0, Jt = null, jt = null, Bt = 0, Gt = 0, Fe = null, Ol = !1, ri = !1, pf = !1, rl = 0, ie = 0, Rl = 0, ba = 0, gr = 0, We = 0, si = 0, pu = null, Ze = null, vf = !1, mr = 0, I0 = 0, yr = 1 / 0, pr = null, Hl = null, ne = 0, Sn = null, Sa = null, qn = 0, xf = 0, bf = null, F0 = null, ci = null, fi = null, di = null, vu = 0, vr = null;
  function Pe() {
    return (Xt & 2) !== 0 && Bt !== 0 ? Bt & -Bt : st.T !== null ? Af() : so();
  }
  function W0() {
    if (We === 0)
      if ((Bt & 536870912) === 0 || Rt) {
        var t = Ha;
        Ha <<= 1, (Ha & 3932160) === 0 && (Ha = 262144), We = t;
      } else We = 536870912;
    return t = Ne.current, t !== null && (t.flags |= 32), We;
  }
  function hi(t, e) {
    if (e != null) {
      var l = t.stateNode, a = l.ref;
      a === null && (a = l.ref = Om(
        Wn(t.memoizedProps, l)
      )), fi === null && (fi = []), fi.push(e.bind(null, a));
    }
  }
  function Ge(t, e, l) {
    (t === Jt && (Gt === 2 || Gt === 9) || t.cancelPendingCommit !== null) && (gi(t, 0), jl(
      t,
      Bt,
      We,
      !1
    )), ta(t, l), ((Xt & 2) === 0 || t !== Jt) && (t === Jt && ((Xt & 2) === 0 && (ba |= l), ie === 4 && jl(
      t,
      Bt,
      We,
      !1
    )), Xn(t));
  }
  function P0(t, e, l) {
    if ((Xt & 6) !== 0) throw Error(r(327));
    var a = !l && (e & 127) === 0 && (e & t.expiredLanes) === 0 || Pl(t, e), u = a ? mb(t, e) : Ef(t, e, !0), s = a;
    do {
      if (u === 0) {
        ri && !a && jl(t, e, 0, !1);
        break;
      } else {
        if (l = t.current.alternate, s && !hb(l)) {
          u = Ef(t, e, !1), s = !1;
          continue;
        }
        if (u === 2) {
          if (s = e, t.errorRecoveryDisabledLanes & s)
            var g = 0;
          else
            g = t.pendingLanes & -536870913, g = g !== 0 ? g : g & 536870912 ? 536870912 : 0;
          if (g !== 0) {
            e = g;
            t: {
              var b = t;
              u = pu;
              var A = b.current.memoizedState.isDehydrated;
              if (A && (gi(b, g).flags |= 256), g = Ef(
                b,
                g,
                !1
              ), g !== 2 && g !== 6) {
                if (pf && !A) {
                  b.errorRecoveryDisabledLanes |= s, ba |= s, u = 4;
                  break t;
                }
                s = Ze, Ze = u, s !== null && (Ze === null ? Ze = s : Ze.push.apply(
                  Ze,
                  s
                ));
              }
              u = g;
            }
            if (s = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          gi(t, 0), jl(t, e, 0, !0);
          break;
        }
        t: {
          switch (a = t, s = u, s) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((e & 4194048) !== e && (e & 62914560) !== e)
                break;
            case 6:
              jl(
                a,
                e,
                We,
                !Ol
              );
              break t;
            case 2:
              Ze = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((e & 62914560) === e && (u = mr + 300 - ee(), 10 < u)) {
            if (jl(
              a,
              e,
              We,
              !Ol
            ), Ua(a, 0, !0) !== 0) break t;
            qn = e, a.timeoutHandle = qf(
              tm.bind(
                null,
                a,
                l,
                Ze,
                pr,
                vf,
                e,
                We,
                ba,
                si,
                Ol,
                s,
                "Throttled",
                -0,
                0
              ),
              u
            );
            break t;
          }
          tm(
            a,
            l,
            Ze,
            pr,
            vf,
            e,
            We,
            ba,
            si,
            Ol,
            s,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Xn(t);
  }
  function tm(t, e, l, a, u, s, g, b, A, Z, P, it, V, I) {
    t.timeoutHandle = -1;
    var mt = e.subtreeFlags, vt = (s & 335544064) === s;
    if (it = null, (vt || mt & 8192 || (mt & 16785408) === 16785408) && (it = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: On
    }, Ie = null, $0(
      e,
      s,
      it
    ), vt && (mt = it, vt = t.containerInfo, vt = (vt.nodeType === 9 ? vt : vt.ownerDocument).__reactViewTransition, vt != null && (mt.count++, mt.waitingForViewTransition = !0, mt = Tu.bind(mt), vt.finished.then(mt, mt))), mt = (s & 62914560) === s ? mr - ee() : (s & 4194048) === s ? I0 - ee() : 0, mt = pS(
      it,
      mt
    ), mt !== null)) {
      qn = s, t.cancelPendingCommit = mt(
        rm.bind(
          null,
          t,
          e,
          s,
          l,
          a,
          u,
          g,
          b,
          A,
          Z,
          P,
          it,
          null,
          V,
          I
        )
      ), jl(t, s, g, !Z);
      return;
    }
    rm(
      t,
      e,
      s,
      l,
      a,
      u,
      g,
      b,
      A,
      Z,
      P,
      it
    );
  }
  function hb(t) {
    for (var e = t; ; ) {
      var l = e.tag;
      if ((l === 0 || l === 11 || l === 15) && e.flags & 16384 && (l = e.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var u = l[a], s = u.getSnapshot;
          u = u.value;
          try {
            if (!ke(s(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = e.child, e.subtreeFlags & 16384 && l !== null)
        l.return = e, e = l;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function jl(t, e, l, a) {
    e = Ui(t, e), e &= ~gr, e &= ~ba, t.suspendedLanes |= e, t.pingedLanes &= ~e, a && (t.warmLanes |= e), a = t.expirationTimes;
    for (var u = e; 0 < u; ) {
      var s = 31 - je(u), g = 1 << s;
      a[s] = -1, u &= ~g;
    }
    l !== 0 && uo(t, l, e);
  }
  function xr() {
    return (Xt & 6) === 0 ? (xu(0), !1) : !0;
  }
  function Sf() {
    if (jt !== null) {
      if (Gt === 0)
        var t = jt.return;
      else
        t = jt, nl = ra = null, Mc(t), ti = null, nu = 0, t = jt;
      for (; t !== null; )
        w0(t.alternate, t), t = t.return;
      jt = null;
    }
  }
  function gi(t, e) {
    var l = t.timeoutHandle;
    return l !== -1 && (t.timeoutHandle = -1, Bb(l)), l = t.cancelPendingCommit, l !== null && (t.cancelPendingCommit = null, l()), qn = 0, Sf(), Jt = t, jt = l = tl(t.current, null), Bt = e, Gt = 0, Fe = null, Ol = !1, ri = Pl(t, e), pf = !1, si = We = gr = ba = Rl = ie = 0, Ze = pu = null, vf = !1, rl = Ui(t, e), Co(), l;
  }
  function em(t, e) {
    At = null, st.H = Wo, e === Pa || e === Lo ? (e = rg(), Gt = 3) : e === mc ? (e = rg(), Gt = 4) : Gt = e === Zc ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Fe = e, jt === null && (ie = 1, Po(
      t,
      rn(e, t.current)
    ));
  }
  function nm() {
    var t = Ne.current;
    return t === null ? !0 : (Bt & 4194048) === Bt ? Oe === null : (Bt & 62914560) === Bt || (Bt & 536870912) !== 0 ? t === Oe : !1;
  }
  function lm() {
    var t = st.H;
    return st.H = Wo, t === null ? Wo : t;
  }
  function am() {
    var t = st.A;
    return st.A = fb, t;
  }
  function br() {
    ie = 4, Ol || (Bt & 4194048) !== Bt && Ne.current !== null || (ri = !0), (Rl & 134217727) === 0 && (ba & 134217727) === 0 || Jt === null || jl(
      Jt,
      Bt,
      We,
      !1
    );
  }
  function Ef(t, e, l) {
    var a = Xt;
    Xt |= 2;
    var u = lm(), s = am();
    (Jt !== t || Bt !== e) && (pr = null, gi(t, e)), e = !1;
    var g = ie;
    t: do
      try {
        if (Gt !== 0 && jt !== null) {
          var b = jt, A = Fe;
          switch (Gt) {
            case 8:
              Sf(), g = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Ne.current === null && (e = !0);
              var Z = Gt;
              if (Gt = 0, Fe = null, mi(t, b, A, Z), l && ri) {
                g = 0;
                break t;
              }
              break;
            default:
              Z = Gt, Gt = 0, Fe = null, mi(t, b, A, Z);
          }
        }
        gb(), g = ie;
        break;
      } catch (P) {
        em(t, P);
      }
    while (!0);
    return e && t.shellSuspendCounter++, nl = ra = null, Xt = a, st.H = u, st.A = s, jt === null && (Jt = null, Bt = 0, Co()), g;
  }
  function gb() {
    for (; jt !== null; ) im(jt);
  }
  function mb(t, e) {
    var l = Xt;
    Xt |= 2;
    var a = lm(), u = am();
    Jt !== t || Bt !== e ? (pr = null, yr = ee() + 500, gi(t, e)) : ri = Pl(
      t,
      e
    );
    t: do
      try {
        if (Gt !== 0 && jt !== null) {
          e = jt;
          var s = Fe;
          e: switch (Gt) {
            case 1:
              Gt = 0, Fe = null, mi(t, e, s, 1);
              break;
            case 2:
            case 9:
              if (ug(s)) {
                Gt = 0, Fe = null, um(e);
                break;
              }
              e = function() {
                Gt !== 2 && Gt !== 9 || Jt !== t || (Gt = 7), Xn(t);
              }, s.then(e, e);
              break t;
            case 3:
              Gt = 7;
              break t;
            case 4:
              Gt = 5;
              break t;
            case 7:
              ug(s) ? (Gt = 0, Fe = null, um(e)) : (Gt = 0, Fe = null, mi(t, e, s, 7));
              break;
            case 5:
              var g = null;
              switch (jt.tag) {
                case 26:
                  g = jt.memoizedState;
                case 5:
                case 27:
                  var b = jt;
                  if (g ? Fm(g) : b.stateNode.complete) {
                    Gt = 0, Fe = null;
                    var A = b.sibling;
                    if (A !== null) jt = A;
                    else {
                      var Z = b.return;
                      Z !== null ? (jt = Z, Sr(Z)) : jt = null;
                    }
                    break e;
                  }
              }
              Gt = 0, Fe = null, mi(t, e, s, 5);
              break;
            case 6:
              Gt = 0, Fe = null, mi(t, e, s, 6);
              break;
            case 8:
              Sf(), ie = 6;
              break t;
            default:
              throw Error(r(462));
          }
        }
        yb();
        break;
      } catch (P) {
        em(t, P);
      }
    while (!0);
    return nl = ra = null, st.H = a, st.A = u, Xt = l, jt !== null ? 0 : (Jt = null, Bt = 0, Co(), ie);
  }
  function yb() {
    for (; jt !== null && !pt(); )
      im(jt);
  }
  function im(t) {
    var e = S0(t.alternate, t, rl);
    t.memoizedProps = t.pendingProps, e === null ? Sr(t) : jt = e;
  }
  function um(t) {
    var e = t, l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = g0(
          l,
          e,
          e.pendingProps,
          e.type,
          void 0,
          Bt
        );
        break;
      case 11:
        e = g0(
          l,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          Bt
        );
        break;
      case 5:
        Mc(e);
        var a = e;
        a === ve && (Rt ? (Ro(a), a.tag === 5 && a.stateNode != null && (It = a.stateNode)) : (Ro(a), Rt = !0));
      default:
        w0(l, e), e = jt = Jh(e, rl), e = S0(l, e, rl);
    }
    t.memoizedProps = t.pendingProps, e === null ? Sr(t) : jt = e;
  }
  function mi(t, e, l, a) {
    nl = ra = null, Mc(e), ti = null, nu = 0;
    var u = e.return;
    try {
      if (lb(
        t,
        u,
        e,
        l,
        Bt
      )) {
        ie = 1, Po(
          t,
          rn(l, t.current)
        ), jt = null;
        return;
      }
    } catch (s) {
      if (u !== null) throw jt = u, s;
      ie = 1, Po(
        t,
        rn(l, t.current)
      ), jt = null;
      return;
    }
    e.flags & 32768 ? (Rt || a === 1 ? t = !0 : ri || (Bt & 536870912) !== 0 ? t = !1 : (Ol = t = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Ne.current, a !== null && a.tag === 13 && (a.flags |= 16384))), om(e, t)) : Sr(e);
  }
  function Sr(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        om(
          e,
          Ol
        );
        return;
      }
      t = e.return;
      var l = ob(
        e.alternate,
        e,
        rl
      );
      if (l !== null) {
        jt = l;
        return;
      }
      if (e = e.sibling, e !== null) {
        jt = e;
        return;
      }
      jt = e = t;
    } while (e !== null);
    ie === 0 && (ie = 5);
  }
  function om(t, e) {
    do {
      var l = rb(t.alternate, t);
      if (l !== null) {
        l.flags &= 32767, jt = l;
        return;
      }
      if (l = t.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !e && (t = t.sibling, t !== null)) {
        jt = t;
        return;
      }
      jt = t = l;
    } while (t !== null);
    ie = 6, jt = null;
  }
  function rm(t, e, l, a, u, s, g, b, A, Z, P, it) {
    t.cancelPendingCommit = null;
    do
      Er();
    while (ne !== 0);
    if ((Xt & 6) !== 0) throw Error(r(327));
    if (e !== null) {
      if (e === t.current) throw Error(r(177));
      t === Jt && (jt = Jt = null, Bt = 0), Sa = e, Sn = t, qn = l, bf = u, F0 = a, pb(
        t,
        e,
        l,
        g,
        b,
        A,
        it
      );
    }
  }
  function pb(t, e, l, a, u, s, g) {
    var b = e.lanes | e.childLanes;
    if (xf = b, b |= nc, Ds(
      t,
      l,
      b,
      a,
      u,
      s
    ), fi = null, (l & 335544064) === l ? (di = Qx(t), a = 10262) : (di = null, a = 10256), (e.subtreeFlags & a) !== 0 || (e.flags & a) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, wb(Oa, function() {
      return Tf(), null;
    })) : (t.callbackNode = null, t.callbackPriority = 0), or = !1, a = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || a) {
      a = st.T, st.T = null, u = ct.p, ct.p = 2, s = Xt, Xt |= 4;
      try {
        sb(t, e, l);
      } finally {
        Xt = s, ct.p = u, st.T = a;
      }
    }
    ne = 1, or ? ci = Zb(
      g,
      t.containerInfo,
      di,
      wf,
      _f,
      xb,
      Nf,
      Tf,
      vb
    ) : (wf(), _f(), Nf());
  }
  function vb(t) {
    if (ne !== 0) {
      var e = Sn.onRecoverableError;
      e(t, { componentStack: null });
    }
  }
  function xb() {
    ne === 3 && (ne = 0, G0(Sa, Sn), ne = 4);
  }
  function wf() {
    if (ne === 1) {
      ne = 0;
      var t = Sn, e = Sa, l = qn, a = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || a) {
        a = st.T, st.T = null;
        var u = ct.p;
        ct.p = 2;
        var s = Xt;
        Xt |= 4;
        try {
          gu = cr = !1, X0(e, t, l), l = Lf;
          var g = Vh(t.containerInfo), b = l.focusedElem, A = l.selectionRange;
          if (g !== b && b && b.ownerDocument && Lh(
            b.ownerDocument.documentElement,
            b
          )) {
            if (A !== null && Fs(b)) {
              var Z = A.start, P = A.end;
              if (P === void 0 && (P = Z), "selectionStart" in b)
                b.selectionStart = Z, b.selectionEnd = Math.min(
                  P,
                  b.value.length
                );
              else {
                var it = b.ownerDocument || document, V = it && it.defaultView || window;
                if (V.getSelection) {
                  var I = V.getSelection(), mt = b.textContent.length, vt = Math.min(A.start, mt), Dt = A.end === void 0 ? vt : Math.min(A.end, mt);
                  !I.extend && vt > Dt && (g = Dt, Dt = vt, vt = g);
                  var X = Bh(
                    b,
                    vt
                  ), R = Bh(
                    b,
                    Dt
                  );
                  if (X && R && (I.rangeCount !== 1 || I.anchorNode !== X.node || I.anchorOffset !== X.offset || I.focusNode !== R.node || I.focusOffset !== R.offset)) {
                    var K = it.createRange();
                    K.setStart(X.node, X.offset), I.removeAllRanges(), vt > Dt ? (I.addRange(K), I.extend(R.node, R.offset)) : (K.setEnd(R.node, R.offset), I.addRange(K));
                  }
                }
              }
            }
            for (it = [], I = b; I = I.parentNode; )
              I.nodeType === 1 && it.push({
                element: I,
                left: I.scrollLeft,
                top: I.scrollTop
              });
            for (typeof b.focus == "function" && b.focus(), b = 0; b < it.length; b++) {
              var at = it[b];
              at.element.scrollLeft = at.left, at.element.scrollTop = at.top;
            }
          }
          wi = !!Bf, Lf = Bf = null;
        } finally {
          Xt = s, ct.p = u, st.T = a;
        }
      }
      t.current = e, ne = 2;
    }
  }
  function _f() {
    if (ne === 2) {
      ne = 0;
      var t = Sn, e = Sa, l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        l = st.T, st.T = null;
        var a = ct.p;
        ct.p = 2;
        var u = Xt;
        Xt |= 4;
        try {
          U0(t, e.alternate, e);
        } finally {
          Xt = u, ct.p = a, st.T = l;
        }
      }
      ne = 3;
    }
  }
  function Nf() {
    if (ne === 4 || ne === 3) {
      ne = 0;
      var t = ci;
      ci = null, St();
      var e = Sn, l = Sa, a = qn, u = F0, s = (a & 335544064) === a ? 10262 : 10256;
      if ((l.subtreeFlags & s) !== 0 || (l.flags & s) !== 0 ? ne = 5 : (ne = 0, Sa = Sn = null, sm(e, e.pendingLanes)), s = e.pendingLanes, s === 0 && (Hl = null), Vi(a), l = l.stateNode, He && typeof He.onCommitFiberRoot == "function")
        try {
          He.onCommitFiberRoot(
            Wl,
            l,
            void 0,
            (l.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        l = st.T, s = ct.p, ct.p = 2, st.T = null;
        try {
          for (var g = e.onRecoverableError, b = 0; b < u.length; b++) {
            var A = u[b];
            g(A.value, {
              componentStack: A.stack
            });
          }
        } finally {
          st.T = l, ct.p = s;
        }
      }
      if (u = fi, g = di, di = null, u !== null && (fi = null, g === null && (g = []), t !== null))
        for (A = 0; A < u.length; A++)
          l = (0, u[A])(
            g
          ), l !== void 0 && t.finished.finally(l);
      (qn & 3) !== 0 && Er(), Xn(e), s = e.pendingLanes, (a & 261930) !== 0 && (s & 42) !== 0 ? e === vr ? vu++ : (vu = 0, vr = e) : (vu = 0, vr = null), xu(0);
    }
  }
  function sm(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Pi(e)));
  }
  function Er() {
    return ci !== null && (ci.skipTransition(), ci = null), wf(), _f(), Nf(), Tf();
  }
  function Tf() {
    if (ne !== 5) return !1;
    var t = Sn, e = xf;
    xf = 0;
    var l = Vi(qn), a = st.T, u = ct.p;
    try {
      ct.p = 32 > l ? 32 : l, st.T = null, l = bf, bf = null;
      var s = Sn, g = qn;
      if (ne = 0, Sa = Sn = null, qn = 0, (Xt & 6) !== 0) throw Error(r(331));
      var b = Xt;
      if (Xt |= 4, k0(s.current), Q0(
        s,
        s.current,
        g,
        l
      ), Xt = b, xu(0, !1), He && typeof He.onPostCommitFiberRoot == "function")
        try {
          He.onPostCommitFiberRoot(Wl, s);
        } catch {
        }
      return !0;
    } finally {
      ct.p = u, st.T = a, sm(t, e);
    }
  }
  function cm(t, e, l) {
    e = rn(l, e), e = Xc(t.stateNode, e, 2), t = Tl(t, e, 2), t !== null && (ta(t, 2), Xn(t));
  }
  function Qt(t, e, l) {
    if (t.tag === 3)
      cm(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          cm(
            e,
            t,
            l
          );
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Hl === null || !Hl.has(a))) {
            t = rn(l, t), l = u0(2), a = Tl(e, l, 2), a !== null && (o0(
              l,
              a,
              e,
              t
            ), ta(a, 2), Xn(a));
            break;
          }
        }
        e = e.return;
      }
  }
  function Cf(t, e, l) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new db();
      var u = /* @__PURE__ */ new Set();
      a.set(e, u);
    } else
      u = a.get(e), u === void 0 && (u = /* @__PURE__ */ new Set(), a.set(e, u));
    u.has(l) || (pf = !0, u.add(l), t = bb.bind(null, t, e, l), e.then(t, t));
  }
  function bb(t, e, l) {
    var a = t.pingCache;
    a !== null && a.delete(e), t.pingedLanes |= t.suspendedLanes & l, t.warmLanes &= ~l, Jt === t && (Bt & l) === l && ((ie === 4 || ie === 3 && (Bt & 62914560) === Bt && 300 > ee() - mr) && (Xt & 2) === 0 ? gi(t, 0) : gr |= l, si === Bt && (si = 0)), Xn(t);
  }
  function fm(t, e) {
    e === 0 && (e = Bi()), t = ia(t, e), t !== null && (ta(t, e), Xn(t));
  }
  function Sb(t) {
    var e = t.memoizedState, l = 0;
    e !== null && (l = e.retryLane), fm(t, l);
  }
  function Eb(t, e) {
    var l = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode, u = t.memoizedState;
        u !== null && (l = u.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    a !== null && a.delete(e), fm(t, l);
  }
  function wb(t, e) {
    return Fl(t, e);
  }
  var yi = null, pi = null, Mf = !1, wr = !1, zf = !1, Ul = 0;
  function Xn(t) {
    t !== pi && t.next === null && (pi === null ? yi = pi = t : pi = pi.next = t), wr = !0, Mf || (Mf = !0, Nb());
  }
  function xu(t, e) {
    if (!zf && wr) {
      zf = !0;
      do
        for (var l = !1, a = yi; a !== null; ) {
          if (t !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var s = 0;
            else {
              var g = a.suspendedLanes, b = a.pingedLanes;
              s = (1 << 31 - je(42 | t) + 1) - 1, s &= u & ~(g & ~b), s = s & 201326741 ? s & 201326741 | 1 : s ? s | 2 : 0;
            }
            s !== 0 && (l = !0, mm(a, s));
          } else
            s = Bt, s = Ua(
              a,
              a === Jt ? s : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (s & 3) === 0 || Pl(a, s) || (l = !0, mm(a, s));
          a = a.next;
        }
      while (l);
      zf = !1;
    }
  }
  function _b() {
    dm();
  }
  function dm() {
    wr = Mf = !1;
    var t = 0;
    Ul !== 0 && Ub() && (t = Ul);
    for (var e = ee(), l = null, a = yi; a !== null; ) {
      var u = a.next, s = hm(a, e);
      s === 0 ? (a.next = null, l === null ? yi = u : l.next = u, u === null && (pi = l)) : (l = a, (t !== 0 || (s & 3) !== 0) && (wr = !0)), a = u;
    }
    ne !== 0 && ne !== 5 || xu(t), Ul !== 0 && (Ul = 0);
  }
  function hm(t, e) {
    for (var l = t.suspendedLanes, a = t.pingedLanes, u = t.expirationTimes, s = t.pendingLanes & -62914561; 0 < s; ) {
      var g = 31 - je(s), b = 1 << g, A = u[g];
      A === -1 ? ((b & l) === 0 || (b & a) !== 0) && (u[g] = io(b, e)) : A <= e && (t.expiredLanes |= b), s &= ~b;
    }
    if (e = Jt, l = Bt, l = Ua(
      t,
      t === e ? l : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a = t.callbackNode, l === 0 || t === e && (Gt === 2 || Gt === 9) || t.cancelPendingCommit !== null)
      return a !== null && a !== null && q(a), t.callbackNode = null, t.callbackPriority = 0;
    if ((l & 3) === 0 || Pl(t, l)) {
      if (e = l & -l, e === t.callbackPriority) return e;
      switch (a !== null && q(a), Vi(l)) {
        case 2:
        case 8:
          l = lo;
          break;
        case 32:
          l = Oa;
          break;
        case 268435456:
          l = ao;
          break;
        default:
          l = Oa;
      }
      return a = gm.bind(null, t), l = Fl(l, a), t.callbackPriority = e, t.callbackNode = l, e;
    }
    return a !== null && a !== null && q(a), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function gm(t, e) {
    if (ne !== 0 && ne !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var l = t.callbackNode;
    if (Er() && t.callbackNode !== l)
      return null;
    var a = Bt;
    return a = Ua(
      t,
      t === Jt ? a : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a === 0 ? null : (P0(t, a, e), hm(t, ee()), t.callbackNode != null && t.callbackNode === l ? gm.bind(null, t) : null);
  }
  function mm(t, e) {
    if (Er()) return null;
    P0(t, e, !0);
  }
  function Nb() {
    Lb(function() {
      (Xt & 6) !== 0 ? Fl(
        no,
        _b
      ) : dm();
    });
  }
  function Af() {
    if (Ul === 0) {
      var t = fa;
      t === 0 && (t = Ra, Ra <<= 1, (Ra & 261888) === 0 && (Ra = 256)), Ul = t;
    }
    return Ul;
  }
  function ym(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : xo(t);
  }
  function Tb(t, e, l, a, u) {
    if (e === "submit" && l && l.stateNode === u) {
      var s = ym(
        (u[De] || null).action
      ), g = a.submitter;
      g && (e = (e = g[De] || null) ? ym(e.formAction) : g.getAttribute("formAction"), e !== null && (s = e, g = null));
      var b = new wo(
        "action",
        "action",
        null,
        a,
        u
      );
      t.push({
        event: b,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ul !== 0) {
                  var A = new FormData(u, g);
                  Bc(
                    l,
                    {
                      pending: !0,
                      data: A,
                      method: u.method,
                      action: s
                    },
                    null,
                    A
                  );
                }
              } else
                typeof s == "function" && (b.preventDefault(), A = new FormData(u, g), Bc(
                  l,
                  {
                    pending: !0,
                    data: A,
                    method: u.method,
                    action: s
                  },
                  s,
                  A
                ));
            },
            currentTarget: u
          }
        ]
      });
    }
  }
  for (var Df = 0; Df < ec.length; Df++) {
    var Of = ec[Df], Cb = Of.toLowerCase(), Mb = Of[0].toUpperCase() + Of.slice(1);
    pn(
      Cb,
      "on" + Mb
    );
  }
  pn(Xh, "onAnimationEnd"), pn(Zh, "onAnimationIteration"), pn(Gh, "onAnimationStart"), pn("dblclick", "onDoubleClick"), pn("focusin", "onFocus"), pn("focusout", "onBlur"), pn(Bx, "onTransitionRun"), pn(Lx, "onTransitionStart"), pn(Vx, "onTransitionCancel"), pn(Qh, "onTransitionEnd"), yl("onMouseEnter", ["mouseout", "mouseover"]), yl("onMouseLeave", ["mouseout", "mouseover"]), yl("onPointerEnter", ["pointerout", "pointerover"]), yl("onPointerLeave", ["pointerout", "pointerover"]), yn(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), yn(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), yn("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), yn(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), yn(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), yn(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var bu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), zb = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(bu)
  );
  function pm(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var a = t[l], u = a.event;
      a = a.listeners;
      t: {
        var s = void 0;
        if (e)
          for (var g = a.length - 1; 0 <= g; g--) {
            var b = a[g], A = b.instance, Z = b.currentTarget;
            if (b = b.listener, A !== s && u.isPropagationStopped())
              break t;
            s = b, u.currentTarget = Z;
            try {
              s(u);
            } catch (P) {
              To(P);
            }
            u.currentTarget = null, s = A;
          }
        else
          for (g = 0; g < a.length; g++) {
            if (b = a[g], A = b.instance, Z = b.currentTarget, b = b.listener, A !== s && u.isPropagationStopped())
              break t;
            s = b, u.currentTarget = Z;
            try {
              s(u);
            } catch (P) {
              To(P);
            }
            u.currentTarget = null, s = A;
          }
      }
    }
  }
  function Ut(t, e) {
    var l = e[fo];
    l === void 0 && (l = e[fo] = /* @__PURE__ */ new Set());
    var a = t + "__bubble";
    l.has(a) || (vm(e, t, 2, !1), l.add(a));
  }
  function Rf(t, e, l) {
    var a = 0;
    e && (a |= 4), vm(
      l,
      t,
      a,
      e
    );
  }
  var _r = "_reactListening" + Math.random().toString(36).slice(2);
  function Hf(t) {
    if (!t[_r]) {
      t[_r] = !0, mo.forEach(function(l) {
        l !== "selectionchange" && (zb.has(l) || Rf(l, !1, t), Rf(l, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[_r] || (e[_r] = !0, Rf("selectionchange", !1, e));
    }
  }
  function vm(t, e, l, a) {
    switch (oy(e)) {
      case 2:
        var u = SS;
        break;
      case 8:
        u = ES;
        break;
      default:
        u = td;
    }
    l = u.bind(
      null,
      e,
      l,
      t
    ), u = void 0, !qs || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (u = !0), a ? u !== void 0 ? t.addEventListener(e, l, {
      capture: !0,
      passive: u
    }) : t.addEventListener(e, l, !0) : u !== void 0 ? t.addEventListener(e, l, {
      passive: u
    }) : t.addEventListener(e, l, !1);
  }
  function jf(t, e, l, a, u) {
    var s = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (; ; ) {
        if (a === null) return;
        var g = a.tag;
        if (g === 3 || g === 4) {
          var b = a.stateNode.containerInfo;
          if (b === u) break;
          if (g === 4)
            for (g = a.return; g !== null; ) {
              var A = g.tag;
              if ((A === 3 || A === 4) && g.stateNode.containerInfo === u)
                return;
              g = g.return;
            }
          for (; b !== null; ) {
            if (g = kn(b), g === null) return;
            if (A = g.tag, A === 5 || A === 6 || A === 26 || A === 27) {
              a = s = g;
              continue t;
            }
            b = b.parentNode;
          }
        }
        a = a.return;
      }
    vh(function() {
      var Z = s, P = Vs(l), it = [];
      t: {
        var V = $h.get(t);
        if (V !== void 0) {
          var I = wo, mt = t;
          switch (t) {
            case "keypress":
              if (So(l) === 0) break t;
            case "keydown":
            case "keyup":
              I = hx;
              break;
            case "focusin":
              mt = "focus", I = Qs;
              break;
            case "focusout":
              mt = "blur", I = Qs;
              break;
            case "beforeblur":
            case "afterblur":
              I = Qs;
              break;
            case "click":
              if (l.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              I = Sh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              I = ex;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              I = vx;
              break;
            case Xh:
            case Zh:
            case Gh:
              I = ax;
              break;
            case Qh:
              I = bx;
              break;
            case "scroll":
            case "scrollend":
              I = P1;
              break;
            case "wheel":
              I = Ex;
              break;
            case "copy":
            case "cut":
            case "paste":
              I = ux;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              I = wh;
              break;
            case "submit":
              I = yx;
              break;
            case "toggle":
            case "beforetoggle":
              I = _x;
          }
          var vt = (e & 4) !== 0, Dt = !vt && (t === "scroll" || t === "scrollend"), X = vt ? V !== null ? V + "Capture" : null : V;
          vt = [];
          for (var R = Z, K; R !== null; ) {
            var at = R;
            if (K = at.stateNode, at = at.tag, at !== 5 && at !== 26 && at !== 27 || K === null || X === null || (at = Xi(R, X), at != null && vt.push(
              Su(R, at, K)
            )), Dt) break;
            R = R.return;
          }
          0 < vt.length && (V = new I(
            V,
            mt,
            null,
            l,
            P
          ), it.push({ event: V, listeners: vt }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (I = t === "mouseover" || t === "pointerover", V = t === "mouseout" || t === "pointerout", I && l !== Ls && (mt = l.relatedTarget || l.fromElement) && (kn(mt) || mt[gl]))
            break t;
          (V || I) && (mt = P.window === P ? P : (I = P.ownerDocument) ? I.defaultView || I.parentWindow : window, V ? (I = l.relatedTarget || l.toElement, V = Z, I = I ? kn(I) : null, I !== null && (Dt = f(I), vt = I.tag, I !== Dt || vt !== 5 && vt !== 27 && vt !== 6) && (I = null)) : (V = null, I = Z), V !== I && (vt = Sh, at = "onMouseLeave", X = "onMouseEnter", R = "mouse", (t === "pointerout" || t === "pointerover") && (vt = wh, at = "onPointerLeave", X = "onPointerEnter", R = "pointer"), Dt = V == null ? mt : na(V), K = I == null ? mt : na(I), mt = new vt(
            at,
            R + "leave",
            V,
            l,
            P
          ), mt.target = Dt, mt.relatedTarget = K, at = null, kn(P) === Z && (vt = new vt(
            X,
            R + "enter",
            I,
            l,
            P
          ), vt.target = K, vt.relatedTarget = Dt, at = vt), Dt = at, vt = V && I ? B(
            V,
            I,
            Ab
          ) : null, V !== null && xm(
            it,
            mt,
            V,
            vt,
            !1
          ), I !== null && Dt !== null && xm(
            it,
            Dt,
            I,
            vt,
            !0
          )));
        }
        t: {
          if (V = Z ? na(Z) : window, I = V.nodeName && V.nodeName.toLowerCase(), I === "select" || I === "input" && V.type === "file")
            var yt = Dh;
          else if (zh(V))
            if (Oh)
              yt = Hx;
            else {
              yt = Ox;
              var Lt = Dx;
            }
          else
            I = V.nodeName, !I || I.toLowerCase() !== "input" || V.type !== "checkbox" && V.type !== "radio" ? Z && Bs(Z.elementType) && (yt = Dh) : yt = Rx;
          if (yt && (yt = yt(t, Z))) {
            Ah(
              it,
              yt,
              l,
              P
            );
            break t;
          }
          Lt && Lt(t, V, Z);
        }
        switch (Lt = Z ? na(Z) : window, t) {
          case "focusin":
            (zh(Lt) || Lt.contentEditable === "true") && (Qa = Lt, Ws = Z, Ii = null);
            break;
          case "focusout":
            Ii = Ws = Qa = null;
            break;
          case "mousedown":
            Ps = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Ps = !1, Yh(it, l, P);
            break;
          case "selectionchange":
            if (Ux) break;
          case "keydown":
          case "keyup":
            Yh(it, l, P);
        }
        var _t;
        if (Ks)
          t: {
            switch (t) {
              case "compositionstart":
                var Tt = "onCompositionStart";
                break t;
              case "compositionend":
                Tt = "onCompositionEnd";
                break t;
              case "compositionupdate":
                Tt = "onCompositionUpdate";
                break t;
            }
            Tt = void 0;
          }
        else
          Ga ? Ch(t, l) && (Tt = "onCompositionEnd") : t === "keydown" && l.keyCode === 229 && (Tt = "onCompositionStart");
        Tt && (_h && l.locale !== "ko" && (Ga || Tt !== "onCompositionStart" ? Tt === "onCompositionEnd" && Ga && (_t = xh()) : (pl = P, Xs = "value" in pl ? pl.value : pl.textContent, Ga = !0)), Lt = Nr(Z, Tt), 0 < Lt.length && (Tt = new Eh(
          Tt,
          t,
          null,
          l,
          P
        ), it.push({ event: Tt, listeners: Lt }), _t ? Tt.data = _t : (_t = Mh(l), _t !== null && (Tt.data = _t)))), (_t = Tx ? Cx(t, l) : Mx(t, l)) && (Tt = Nr(Z, "onBeforeInput"), 0 < Tt.length && (Lt = new Eh(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          P
        ), it.push({
          event: Lt,
          listeners: Tt
        }), Lt.data = _t)), Tb(
          it,
          t,
          Z,
          l,
          P
        );
      }
      pm(it, e);
    });
  }
  function Su(t, e, l) {
    return {
      instance: t,
      listener: e,
      currentTarget: l
    };
  }
  function Nr(t, e) {
    for (var l = e + "Capture", a = []; t !== null; ) {
      var u = t, s = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || s === null || (u = Xi(t, l), u != null && a.unshift(
        Su(t, u, s)
      ), u = Xi(t, e), u != null && a.push(
        Su(t, u, s)
      )), t.tag === 3) return a;
      t = t.return;
    }
    return [];
  }
  function Ab(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function xm(t, e, l, a, u) {
    for (var s = e._reactName, g = []; l !== null && l !== a; ) {
      var b = l, A = b.alternate, Z = b.stateNode;
      if (b = b.tag, A !== null && A === a) break;
      b !== 5 && b !== 26 && b !== 27 || Z === null || (A = Z, u ? (Z = Xi(l, s), Z != null && g.unshift(
        Su(l, Z, A)
      )) : u || (Z = Xi(l, s), Z != null && g.push(
        Su(l, Z, A)
      ))), l = l.return;
    }
    g.length !== 0 && t.push({ event: e, listeners: g });
  }
  var Db = /\r\n?/g, Ob = /\u0000|\uFFFD/g;
  function bm(t) {
    return (typeof t == "string" ? t : "" + t).replace(Db, `
`).replace(Ob, "");
  }
  function Sm(t, e) {
    return e = bm(e), bm(t) === e;
  }
  function $t(t, e, l, a, u, s) {
    switch (l) {
      case "children":
        if (typeof a == "string")
          e === "body" || e === "textarea" && a === "" || qa(t, a);
        else if (typeof a == "number" || typeof a == "bigint")
          e !== "body" && qa(t, "" + a);
        else return;
        break;
      case "className":
        vo(t, "class", a);
        break;
      case "tabIndex":
        vo(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        vo(t, l, a);
        break;
      case "style":
        yh(t, a, s);
        return;
      case "data":
        if (e !== "object") {
          vo(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (e !== "a" || l !== "href")) {
          t.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(l);
          break;
        }
        a = xo(a), t.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof s == "function" && (l === "formAction" ? (e !== "input" && $t(t, e, "name", u.name, u, null), $t(
            t,
            e,
            "formEncType",
            u.formEncType,
            u,
            null
          ), $t(
            t,
            e,
            "formMethod",
            u.formMethod,
            u,
            null
          ), $t(
            t,
            e,
            "formTarget",
            u.formTarget,
            u,
            null
          )) : ($t(t, e, "encType", u.encType, u, null), $t(t, e, "method", u.method, u, null), $t(t, e, "target", u.target, u, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(l);
          break;
        }
        a = xo(a), t.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (t.onclick = On);
        return;
      case "onScroll":
        a != null && Ut("scroll", t);
        return;
      case "onScrollEnd":
        a != null && Ut("scrollend", t);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (u.children != null) throw Error(r(60));
            s?.__html !== l && (t.innerHTML = l);
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        l = xo(a), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(l, a) : t.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(l, "") : t.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? t.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(l, a) : t.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? t.setAttribute(l, a) : t.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? t.removeAttribute(l) : t.setAttribute(l, a);
        break;
      case "popover":
        Ut("beforetoggle", t), Ut("toggle", t), po(t, "popover", a);
        break;
      case "xlinkActuate":
        In(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        In(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        In(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        In(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        In(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        In(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        In(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        In(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        In(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        po(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N")
          l = F1.get(l) || l, po(t, l, a);
        else return;
    }
    qt = !0;
  }
  function Uf(t, e, l, a, u, s) {
    switch (l) {
      case "style":
        yh(t, a, s);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (u.children != null) throw Error(r(60));
            s?.__html !== l && (t.innerHTML = l);
          }
        }
        break;
      case "children":
        if (typeof a == "string") qa(t, a);
        else if (typeof a == "number" || typeof a == "bigint")
          qa(t, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && Ut("scroll", t);
        return;
      case "onScrollEnd":
        a != null && Ut("scrollend", t);
        return;
      case "onClick":
        a != null && (t.onclick = On);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!yo.hasOwnProperty(l))
          t: {
            if (l[0] === "o" && l[1] === "n" && (u = l.endsWith("Capture"), s = l.slice(2, u ? l.length - 7 : void 0), e = t[De] || null, e = e != null ? e[l] : null, typeof e == "function" && t.removeEventListener(s, e, u), typeof a == "function")) {
              typeof e != "function" && e !== null && (l in t ? t[l] = null : t.hasAttribute(l) && t.removeAttribute(l)), t.addEventListener(s, a, u);
              break t;
            }
            qt = !0, l in t ? t[l] = a : a === !0 ? t.setAttribute(l, "") : po(t, l, a);
          }
        return;
    }
    qt = !0;
  }
  function Me(t, e, l) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        Ut("error", t), Ut("load", t);
        var a = !1, u = !1, s;
        for (s in l)
          if (l.hasOwnProperty(s)) {
            var g = l[s];
            if (g != null)
              switch (s) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, e));
                default:
                  $t(t, e, s, g, l, null);
              }
          }
        u && $t(t, e, "srcSet", l.srcSet, l, null), a && $t(t, e, "src", l.src, l, null);
        return;
      case "input":
        Ut("invalid", t);
        var b = s = g = u = null, A = null, Z = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var P = l[a];
            if (P != null)
              switch (a) {
                case "name":
                  u = P;
                  break;
                case "type":
                  g = P;
                  break;
                case "checked":
                  A = P;
                  break;
                case "defaultChecked":
                  Z = P;
                  break;
                case "value":
                  s = P;
                  break;
                case "defaultValue":
                  b = P;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (P != null)
                    throw Error(r(137, e));
                  break;
                default:
                  $t(t, e, a, P, l, null);
              }
          }
        dh(
          t,
          s,
          b,
          A,
          Z,
          g,
          u,
          !1
        );
        return;
      case "select":
        Ut("invalid", t), a = g = s = null;
        for (u in l)
          if (l.hasOwnProperty(u) && (b = l[u], b != null))
            switch (u) {
              case "value":
                s = b;
                break;
              case "defaultValue":
                g = b;
                break;
              case "multiple":
                a = b;
              default:
                $t(t, e, u, b, l, null);
            }
        e = s, l = g, t.multiple = !!a, e != null ? Ya(t, !!a, e, !1) : l != null && Ya(t, !!a, l, !0);
        return;
      case "textarea":
        Ut("invalid", t), s = u = a = null;
        for (g in l)
          if (l.hasOwnProperty(g) && (b = l[g], b != null))
            switch (g) {
              case "value":
                a = b;
                break;
              case "defaultValue":
                u = b;
                break;
              case "children":
                s = b;
                break;
              case "dangerouslySetInnerHTML":
                if (b != null) throw Error(r(91));
                break;
              default:
                $t(t, e, g, b, l, null);
            }
        gh(t, a, u, s);
        return;
      case "option":
        for (A in l)
          l.hasOwnProperty(A) && (a = l[A], a != null) && (A === "selected" ? t.selected = a && typeof a != "function" && typeof a != "symbol" : $t(t, e, A, a, l, null));
        return;
      case "dialog":
        Ut("beforetoggle", t), Ut("toggle", t), Ut("cancel", t), Ut("close", t);
        break;
      case "iframe":
      case "object":
        Ut("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < bu.length; a++)
          Ut(bu[a], t);
        break;
      case "image":
        Ut("error", t), Ut("load", t);
        break;
      case "details":
        Ut("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        Ut("error", t), Ut("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (Z in l)
          if (l.hasOwnProperty(Z) && (a = l[Z], a != null))
            switch (Z) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, e));
              default:
                $t(t, e, Z, a, l, null);
            }
        return;
      default:
        if (Bs(e)) {
          for (P in l)
            l.hasOwnProperty(P) && (a = l[P], a !== void 0 && Uf(
              t,
              e,
              P,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (b in l)
      l.hasOwnProperty(b) && (a = l[b], a != null && $t(t, e, b, a, l, null));
  }
  var Rb = {};
  function Hb(t, e, l, a) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null, s = null, g = null, b = null, A = null, Z = null, P = null;
        for (I in l) {
          var it = l[I];
          if (l.hasOwnProperty(I) && it != null)
            switch (I) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                A = it;
              default:
                a.hasOwnProperty(I) || $t(t, e, I, null, a, it);
            }
        }
        for (var V in a) {
          var I = a[V];
          if (it = l[V], a.hasOwnProperty(V) && (I != null || it != null))
            switch (V) {
              case "type":
                I !== it && (qt = !0), s = I;
                break;
              case "name":
                I !== it && (qt = !0), u = I;
                break;
              case "checked":
                I !== it && (qt = !0), Z = I;
                break;
              case "defaultChecked":
                I !== it && (qt = !0), P = I;
                break;
              case "value":
                I !== it && (qt = !0), g = I;
                break;
              case "defaultValue":
                I !== it && (qt = !0), b = I;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (I != null)
                  throw Error(r(137, e));
                break;
              default:
                I !== it && $t(
                  t,
                  e,
                  V,
                  I,
                  a,
                  it
                );
            }
        }
        js(
          t,
          g,
          b,
          A,
          Z,
          P,
          s,
          u
        );
        return;
      case "select":
        I = g = b = V = null;
        for (s in l)
          if (A = l[s], l.hasOwnProperty(s) && A != null)
            switch (s) {
              case "value":
                break;
              case "multiple":
                I = A;
              default:
                a.hasOwnProperty(s) || $t(
                  t,
                  e,
                  s,
                  null,
                  a,
                  A
                );
            }
        for (u in a)
          if (s = a[u], A = l[u], a.hasOwnProperty(u) && (s != null || A != null))
            switch (u) {
              case "value":
                s !== A && (qt = !0), V = s;
                break;
              case "defaultValue":
                s !== A && (qt = !0), b = s;
                break;
              case "multiple":
                s !== A && (qt = !0), g = s;
              default:
                s !== A && $t(
                  t,
                  e,
                  u,
                  s,
                  a,
                  A
                );
            }
        e = b, l = g, a = I, V != null ? Ya(t, !!l, V, !1) : !!a != !!l && (e != null ? Ya(t, !!l, e, !0) : Ya(t, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        I = V = null;
        for (b in l)
          if (u = l[b], l.hasOwnProperty(b) && u != null && !a.hasOwnProperty(b))
            switch (b) {
              case "value":
                break;
              case "children":
                break;
              default:
                $t(t, e, b, null, a, u);
            }
        for (g in a)
          if (u = a[g], s = l[g], a.hasOwnProperty(g) && (u != null || s != null))
            switch (g) {
              case "value":
                u !== s && (qt = !0), V = u;
                break;
              case "defaultValue":
                u !== s && (qt = !0), I = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(r(91));
                break;
              default:
                u !== s && $t(t, e, g, u, a, s);
            }
        hh(t, V, I);
        return;
      case "option":
        for (var mt in l)
          V = l[mt], l.hasOwnProperty(mt) && V != null && !a.hasOwnProperty(mt) && (mt === "selected" ? t.selected = !1 : $t(
            t,
            e,
            mt,
            null,
            a,
            V
          ));
        for (A in a)
          V = a[A], I = l[A], a.hasOwnProperty(A) && V !== I && (V != null || I != null) && (A === "selected" ? (V !== I && (qt = !0), t.selected = V && typeof V != "function" && typeof V != "symbol") : $t(
            t,
            e,
            A,
            V,
            a,
            I
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var vt in l)
          V = l[vt], l.hasOwnProperty(vt) && V != null && !a.hasOwnProperty(vt) && $t(t, e, vt, null, a, V);
        for (Z in a)
          if (V = a[Z], I = l[Z], a.hasOwnProperty(Z) && V !== I && (V != null || I != null))
            switch (Z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (V != null)
                  throw Error(r(137, e));
                break;
              default:
                $t(
                  t,
                  e,
                  Z,
                  V,
                  a,
                  I
                );
            }
        return;
      default:
        if (Bs(e)) {
          for (var Dt in l)
            V = l[Dt], l.hasOwnProperty(Dt) && V !== void 0 && !a.hasOwnProperty(Dt) && Uf(
              t,
              e,
              Dt,
              void 0,
              a,
              V
            );
          for (P in a)
            V = a[P], I = l[P], !a.hasOwnProperty(P) || V === I || V === void 0 && I === void 0 || Uf(
              t,
              e,
              P,
              V,
              a,
              I
            );
          return;
        }
    }
    for (var X in l)
      V = l[X], l.hasOwnProperty(X) && V != null && !a.hasOwnProperty(X) && $t(t, e, X, null, a, V);
    for (it in a)
      V = a[it], I = l[it], !a.hasOwnProperty(it) || V === I || V == null && I == null || $t(t, e, it, V, a, I);
  }
  function Em(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function jb() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var u = l[a], s = u.transferSize, g = u.initiatorType, b = u.duration;
        if (s && b && Em(g)) {
          for (g = 0, b = u.responseEnd, a += 1; a < l.length; a++) {
            var A = l[a], Z = A.startTime;
            if (Z > b) break;
            var P = A.transferSize, it = A.initiatorType;
            P && Em(it) && (A = A.responseEnd, g += P * (A < b ? 1 : (b - Z) / (A - Z)));
          }
          if (--a, e += 8 * (s + g) / (u.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Bf = null, Lf = null;
  function Eu(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function wm(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function _m(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Nm(t, e, l, a) {
    return l = Eu(
      l
    ).createElement(t), l[ge] = a, l[De] = e, Me(l, t, e), re(l), l;
  }
  function Vf(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Yf = null;
  function Ub() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Yf ? !1 : (Yf = t, !0) : (Yf = null, !1);
  }
  var qf = typeof setTimeout == "function" ? setTimeout : void 0, Bb = typeof clearTimeout == "function" ? clearTimeout : void 0, Tm = typeof Promise == "function" ? Promise : void 0, Cm = typeof requestAnimationFrame == "function" ? requestAnimationFrame : qf, Lb = typeof queueMicrotask == "function" ? queueMicrotask : typeof Tm < "u" ? function(t) {
    return Tm.resolve(null).then(t).catch(Vb);
  } : qf;
  function Vb(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Bl(t) {
    return t === "head";
  }
  function Mm(t, e) {
    var l = e, a = 0;
    do {
      var u = l.nextSibling;
      if (t.removeChild(l), u && u.nodeType === 8)
        if (l = u.data, l === "/$" || l === "/&") {
          if (a === 0) {
            t.removeChild(u), _i(e);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Jf(
            t.ownerDocument.documentElement
          );
        else if (l === "head") {
          l = t.ownerDocument.head, Jf(l);
          for (var s = l.firstChild; s; ) {
            var g = s.nextSibling, b = s.nodeName;
            s[ea] || b === "SCRIPT" || b === "STYLE" || b === "LINK" && s.rel.toLowerCase() === "stylesheet" || l.removeChild(s), s = g;
          }
        } else
          l === "body" && Jf(t.ownerDocument.body);
      l = u;
    } while (l);
    _i(e);
  }
  function zm(t, e) {
    var l = t;
    t = 0;
    do {
      var a = l.nextSibling;
      if (l.nodeType === 1 ? e ? (l._stashedDisplay = l.style.display, l.style.display = "none") : (l.style.display = l._stashedDisplay || "", l.getAttribute("style") === "" && l.removeAttribute("style")) : l.nodeType === 3 && (e ? (l._stashedText = l.nodeValue, l.nodeValue = "") : l.nodeValue = l._stashedText || ""), a && a.nodeType === 8)
        if (l = a.data, l === "/$") {
          if (t === 0) break;
          t--;
        } else
          l !== "$" && l !== "$?" && l !== "$~" && l !== "$!" || t++;
      l = a;
    } while (l);
  }
  function Am(t, e, l) {
    if (e = CSS.escape(e) !== e ? "r-" + btoa(e).replace(/=/g, "") : e, t.style.viewTransitionName = e, l != null && (t.style.viewTransitionClass = l), l = getComputedStyle(t), l.display === "inline") {
      if (e = t.getClientRects(), e.length === 1) var a = 1;
      else
        for (var u = a = 0; u < e.length; u++) {
          var s = e[u];
          0 < s.width && 0 < s.height && a++;
        }
      a === 1 && (t = t.style, t.display = e.length === 1 ? "inline-block" : "block", t.marginTop = "-" + l.paddingTop, t.marginBottom = "-" + l.paddingBottom);
    }
  }
  function Dm(t, e) {
    t = t.style, e = e.style;
    var l = e != null ? e.hasOwnProperty("viewTransitionName") ? e.viewTransitionName : e.hasOwnProperty("view-transition-name") ? e["view-transition-name"] : null : null;
    t.viewTransitionName = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), l = e != null ? e.hasOwnProperty("viewTransitionClass") ? e.viewTransitionClass : e.hasOwnProperty("view-transition-class") ? e["view-transition-class"] : null : null, t.viewTransitionClass = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), t.display === "inline-block" && (e == null ? t.display = t.margin = "" : (l = e.display, t.display = l == null || typeof l == "boolean" ? "" : l, l = e.margin, l != null ? t.margin = l : (l = e.hasOwnProperty("marginTop") ? e.marginTop : e["margin-top"], t.marginTop = l == null || typeof l == "boolean" ? "" : l, e = e.hasOwnProperty("marginBottom") ? e.marginBottom : e["margin-bottom"], t.marginBottom = e == null || typeof e == "boolean" ? "" : e)));
  }
  function Yb(t, e, l) {
    return l = l.ownerDocument.defaultView, {
      rect: t,
      abs: e.position === "absolute" || e.position === "fixed",
      clip: e.clipPath !== "none" || e.overflow !== "visible" || e.filter !== "none" || e.mask !== "none" || e.mask !== "none" || e.borderRadius !== "0px",
      view: 0 <= t.bottom && 0 <= t.right && t.top <= l.innerHeight && t.left <= l.innerWidth
    };
  }
  function Xf(t) {
    var e = t.getBoundingClientRect(), l = getComputedStyle(t);
    return Yb(e, l, t);
  }
  function qb(t) {
    return t.documentElement.clientHeight;
  }
  function Xb(t) {
    this.addEventListener("load", t), this.addEventListener("error", t);
  }
  function Zb(t, e, l, a, u, s, g, b, A) {
    var Z = e.nodeType === 9 ? e : e.ownerDocument;
    try {
      var P = Z.startViewTransition({
        update: function() {
          var V = Z.defaultView, I = V.navigation && V.navigation.transition, mt = Z.fonts.status;
          a();
          var vt = [];
          if (mt === "loaded" && (qb(Z), Z.fonts.status === "loading" && vt.push(Z.fonts.ready)), mt = vt.length, t !== null)
            for (var Dt = t.suspenseyImages, X = 0, R = 0; R < Dt.length; R++) {
              var K = Dt[R];
              if (!K.complete) {
                var at = K.getBoundingClientRect();
                if (0 < at.bottom && 0 < at.right && at.top < V.innerHeight && at.left < V.innerWidth) {
                  if (X += Wm(K), X > Mr) {
                    vt.length = mt;
                    break;
                  }
                  K = new Promise(
                    Xb.bind(K)
                  ), vt.push(K);
                }
              }
            }
          if (0 < vt.length)
            return V = Promise.race([
              Promise.all(vt),
              new Promise(function(yt) {
                return setTimeout(yt, 500);
              })
            ]).then(u, u), (I ? Promise.allSettled([I.finished, V]) : V).then(s, s);
          if (u(), I)
            return I.finished.then(
              s,
              s
            );
          s();
        },
        types: l
      });
      Z.__reactViewTransition = P;
      var it = [];
      return P.ready.then(
        function() {
          for (var V = Z.documentElement.getAnimations({
            subtree: !0
          }), I = 0; I < V.length; I++) {
            var mt = V[I], vt = mt.effect, Dt = vt.pseudoElement;
            if (Dt != null && Dt.startsWith("::view-transition")) {
              it.push(mt), mt = vt.getKeyframes();
              for (var X = Dt = void 0, R = !0, K = 0; K < mt.length; K++) {
                var at = mt[K], yt = at.width;
                if (Dt === void 0) Dt = yt;
                else if (Dt !== yt) {
                  R = !1;
                  break;
                }
                if (yt = at.height, X === void 0) X = yt;
                else if (X !== yt) {
                  R = !1;
                  break;
                }
                delete at.width, delete at.height, at.transform === "none" && delete at.transform;
              }
              R && Dt !== void 0 && X !== void 0 && (vt.setKeyframes(mt), R = getComputedStyle(
                vt.target,
                vt.pseudoElement
              ), R.width !== Dt || R.height !== X) && (R = mt[0], R.width = Dt, R.height = X, R = mt[mt.length - 1], R.width = Dt, R.height = X, vt.setKeyframes(mt));
            }
          }
          g();
        },
        function(V) {
          Z.__reactViewTransition === P && (Z.__reactViewTransition = null);
          try {
            typeof V == "object" && V !== null && V.name === "InvalidStateError" && (V.message === "View transition was skipped because document visibility state is hidden." || V.message === "Skipping view transition because document visibility state has become hidden." || V.message === "Skipping view transition because viewport size changed." || V.message === "Transition was aborted because of invalid state") && (V = null), V !== null && A(V);
          } finally {
            a(), u(), g();
          }
        }
      ), P.finished.finally(function() {
        for (var V = 0; V < it.length; V++)
          it[V].cancel();
        Z.__reactViewTransition === P && (Z.__reactViewTransition = null), b();
      }), P;
    } catch {
      return a(), u(), g(), null;
    }
  }
  function Ea(t, e) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + t + "(" + e + ")";
  }
  Ea.prototype.animate = function(t, e) {
    return e = typeof e == "number" ? { duration: e } : H({}, e), e.pseudoElement = this._selector, this._scope.animate(t, e);
  }, Ea.prototype.getAnimations = function() {
    for (var t = this._scope, e = this._selector, l = t.getAnimations({ subtree: !0 }), a = [], u = 0; u < l.length; u++) {
      var s = l[u].effect;
      s !== null && s.target === t && s.pseudoElement === e && a.push(l[u]);
    }
    return a;
  }, Ea.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function Om(t) {
    return {
      name: t,
      group: new Ea("group", t),
      imagePair: new Ea("image-pair", t),
      old: new Ea("old", t),
      new: new Ea("new", t)
    };
  }
  function tn(t) {
    this._fragmentFiber = t, this._observers = this._eventListeners = null;
  }
  tn.prototype.addEventListener = function(t, e, l) {
    var a = null, u = null;
    if (!(l != null && typeof l != "boolean" && (a = l.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var s = this._eventListeners;
      if (Hm(s, t, e, l) === -1) {
        var g = this, b = e;
        l != null && typeof l != "boolean" && l.once === !0 && (b = function(A) {
          g.removeEventListener(
            t,
            e,
            l
          ), typeof e == "function" ? e.call(this, A) : e.handleEvent(A);
        }), a !== null && (u = g.removeEventListener.bind(
          g,
          t,
          e,
          l
        ), a.addEventListener("abort", u, { once: !0 }), u = a.removeEventListener.bind(a, "abort", u)), a = vi(l), s.push({
          type: t,
          listener: e,
          optionsOrUseCapture: l,
          attachedListener: b,
          cleanup: u
        }), m(
          this._fragmentFiber.child,
          !1,
          Gb,
          t,
          b,
          a
        );
      }
      this._eventListeners = s;
    }
  };
  function Gb(t, e, l, a) {
    return T(t).addEventListener(
      e,
      l,
      a
    ), !1;
  }
  tn.prototype.removeEventListener = function(t, e, l) {
    var a = this._eventListeners;
    if (a !== null && (e = Hm(
      a,
      t,
      e,
      l
    ), e !== -1)) {
      var u = a[e];
      l = u.attachedListener;
      var s = u.cleanup;
      u = vi(u.optionsOrUseCapture), m(
        this._fragmentFiber.child,
        !1,
        Qb,
        t,
        l,
        u
      ), a.splice(e, 1), s !== null && s();
    }
  };
  function Qb(t, e, l, a) {
    return T(t).removeEventListener(
      e,
      l,
      a
    ), !1;
  }
  function vi(t) {
    return t != null && typeof t != "boolean" && (t.once === !0 || t.signal instanceof AbortSignal) ? { capture: t.capture, passive: t.passive } : t;
  }
  function Rm(t) {
    return t == null ? "c=0" : typeof t == "boolean" ? "c=" + (t ? "1" : "0") : "c=" + (t.capture ? "1" : "0");
  }
  function Hm(t, e, l, a) {
    if (t.length === 0) return -1;
    a = Rm(a);
    for (var u = 0; u < t.length; u++) {
      var s = t[u];
      if (s.type === e && s.listener === l && Rm(s.optionsOrUseCapture) === a)
        return u;
    }
    return -1;
  }
  tn.prototype.dispatchEvent = function(t) {
    var e = x(
      this._fragmentFiber
    );
    if (e === null) return !0;
    e = T(e);
    var l = this._eventListeners;
    if (l !== null && 0 < l.length || !t.bubbles) {
      var a = e.nodeType === 9 ? e.createComment("") : document.createTextNode("");
      if (l)
        for (var u = 0; u < l.length; u++) {
          var s = l[u];
          a.addEventListener(
            s.type,
            s.attachedListener,
            vi(s.optionsOrUseCapture)
          );
        }
      if (e.appendChild(a), t = a.dispatchEvent(t), l)
        for (u = 0; u < l.length; u++)
          s = l[u], a.removeEventListener(
            s.type,
            s.attachedListener,
            vi(s.optionsOrUseCapture)
          );
      return e.removeChild(a), t;
    }
    return e.dispatchEvent(t);
  }, tn.prototype.focus = function(t) {
    m(
      this._fragmentFiber.child,
      !0,
      jm,
      t,
      void 0,
      void 0
    );
  };
  function jm(t, e) {
    return t.tag === 6 ? !1 : (t = T(t), lS(t, e));
  }
  tn.prototype.focusLast = function(t) {
    var e = [];
    m(
      this._fragmentFiber.child,
      !0,
      Zf,
      e,
      void 0,
      void 0
    );
    for (var l = e.length - 1; 0 <= l && !jm(e[l], t); l--) ;
  };
  function Zf(t, e) {
    return e.push(t), !1;
  }
  tn.prototype.blur = function() {
    var t = x(
      this._fragmentFiber
    );
    t !== null && (t = T(t), t = Eu(t).activeElement, t !== null && m(
      this._fragmentFiber.child,
      !1,
      $b,
      t,
      void 0,
      void 0
    ));
  };
  function $b(t, e) {
    return t.tag === 6 ? !1 : (t = T(t), t === e || t.contains(e) ? (e.blur(), !0) : !1);
  }
  tn.prototype.observeUsing = function(t) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(t), m(
      this._fragmentFiber.child,
      !1,
      Kb,
      t,
      void 0,
      void 0
    );
  };
  function Kb(t, e) {
    return t.tag === 6 || (t = T(t), e.observe(t)), !1;
  }
  tn.prototype.unobserveUsing = function(t) {
    var e = this._observers;
    if (e !== null && e.has(t)) {
      e.delete(t), m(
        this._fragmentFiber.child,
        !1,
        kb,
        t,
        void 0,
        void 0
      );
      for (var l = e = 0; l < En.length; l++) {
        var a = En[l];
        a.fragmentInstance === this && a.observer === t ? t.unobserve(a.instance) : En[e++] = a;
      }
      En.length = e;
    }
  };
  function kb(t, e) {
    return t.tag === 6 || (t = T(t), e.unobserve(t)), !1;
  }
  var En = [], Gf = !1;
  function Jb(t, e, l) {
    En.push({
      fragmentInstance: t,
      observer: e,
      instance: l
    }), Gf || (Gf = !0, aS(function() {
      Gf = !1;
      var a = En;
      En = [];
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        s.observer.unobserve(s.instance);
      }
    }));
  }
  tn.prototype.getClientRects = function() {
    var t = [];
    return m(
      this._fragmentFiber.child,
      !1,
      Ib,
      t,
      void 0,
      void 0
    ), t;
  };
  function Ib(t, e) {
    if (t.tag === 6) {
      t = t.stateNode;
      var l = t.ownerDocument.createRange();
      l.selectNodeContents(t), e.push.apply(e, l.getClientRects());
    } else
      t = T(t), e.push.apply(e, t.getClientRects());
    return !1;
  }
  tn.prototype.getRootNode = function(t) {
    var e = x(
      this._fragmentFiber
    );
    return e === null ? this : T(e).getRootNode(t);
  }, tn.prototype.compareDocumentPosition = function(t) {
    var e = x(
      this._fragmentFiber
    );
    if (e === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var l = [];
    m(
      this._fragmentFiber.child,
      !1,
      Zf,
      l,
      void 0,
      void 0
    );
    var a = T(e);
    if (l.length === 0) {
      if (l = a, S(this._fragmentFiber)) {
        t: {
          for (e = this._fragmentFiber.return; e !== null; ) {
            if (e.tag === 4) {
              e = e.stateNode.containerInfo;
              break t;
            }
            if (e.tag === 3 || e.tag === 5 || e.tag === 27)
              break;
            e = e.return;
          }
          e = null;
        }
        e != null && (l = e);
      }
      e = this._fragmentFiber;
      var u = a = l.compareDocumentPosition(t);
      return l === t ? u = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (l = E(e)[1], l === null ? u = Node.DOCUMENT_POSITION_PRECEDING : (t = T(l).compareDocumentPosition(
        t
      ), u = t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), u |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    e = T(l[0]), u = T(l[l.length - 1]);
    var s = S(this._fragmentFiber) ? e.parentElement : a;
    if (s == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = s.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY, s = s.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var g = e.compareDocumentPosition(t), b = u.compareDocumentPosition(t), A = g & Node.DOCUMENT_POSITION_CONTAINED_BY || b & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return b = a && s && g & Node.DOCUMENT_POSITION_FOLLOWING && b & Node.DOCUMENT_POSITION_PRECEDING, e = a && e === t || s && u === t || A || b ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && e === t || !s && u === t ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : g, e & Node.DOCUMENT_POSITION_DISCONNECTED || e & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Fb(
      e,
      this._fragmentFiber,
      l[0],
      l[l.length - 1],
      t
    ) ? e : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function Fb(t, e, l, a, u) {
    var s = kn(u);
    if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (l = !!s)
        t: {
          for (; s !== null; ) {
            if (s.tag === 7 && (s === e || s.alternate === e)) {
              l = !0;
              break t;
            }
            s = s.return;
          }
          l = !1;
        }
      return l;
    }
    if (t & Node.DOCUMENT_POSITION_CONTAINS) {
      if (s === null)
        return s = u.ownerDocument, u === s || u === s.documentElement || u === s.body;
      t: {
        for (s = e, e = x(e); s !== null; ) {
          if (!(s.tag !== 5 && s.tag !== 3 && s.tag !== 27 || s !== e && s.alternate !== e)) {
            s = !0;
            break t;
          }
          s = s.return;
        }
        s = !1;
      }
      return s;
    }
    return t & Node.DOCUMENT_POSITION_PRECEDING ? ((e = !!s) && !(e = s === l) && (e = B(
      l,
      s,
      G
    ), e === null ? e = !1 : (m(
      e,
      !0,
      _,
      s,
      l
    ), s = C, C = null, e = s !== null)), e) : t & Node.DOCUMENT_POSITION_FOLLOWING ? ((e = !!s) && !(e = s === a) && (e = B(
      a,
      s,
      G
    ), e === null ? e = !1 : (m(
      e,
      !0,
      D,
      s,
      a
    ), s = C, U = C = null, e = s !== null)), e) : !1;
  }
  function Um(t, e) {
    var l = t.ownerDocument.createRange();
    l.selectNodeContents(t), t = l.getBoundingClientRect(), window.scrollTo(
      window.scrollX + t.left,
      e ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight
    );
  }
  tn.prototype.scrollIntoView = function(t) {
    if (typeof t == "object") throw Error(r(566));
    var e = [];
    m(
      this._fragmentFiber.child,
      !1,
      Zf,
      e,
      void 0,
      void 0
    );
    var l = t !== !1;
    if (e.length === 0) {
      var a = E(
        this._fragmentFiber
      );
      if (a = l ? a[1] || a[0] || x(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        t = T(a), Um(t, l);
        return;
      }
      if (a = T(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          l = "host" in a ? a.host : null, l !== null && l.scrollIntoView(t);
          return;
        }
        a.scrollIntoView(t);
      }
    }
    for (a = l ? e.length - 1 : 0; a !== (l ? -1 : e.length); ) {
      var u = e[a];
      u.tag === 6 ? (u = T(u), Um(u, l)) : T(u).scrollIntoView(t), a += l ? -1 : 1;
    }
  };
  function Wb(t, e) {
    return t = T(t), Bm(t, e), !1;
  }
  function Bm(t, e) {
    t.reactFragments == null && (t.reactFragments = /* @__PURE__ */ new Set()), t.reactFragments.add(e);
  }
  function Lm(t, e) {
    var l = e._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = l[a];
        t.addEventListener(
          u.type,
          u.attachedListener,
          vi(u.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (l = e._observers, l !== null && l.forEach(function(s) {
      for (var g = 0, b = 0; b < En.length; b++) {
        var A = En[b];
        (A.fragmentInstance !== e || A.observer !== s || A.instance !== t) && (En[g++] = A);
      }
      En.length = g, s.observe(t);
    }), Bm(t, e));
  }
  function Pb(t, e) {
    var l = e._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = l[a];
        t.removeEventListener(
          u.type,
          u.attachedListener,
          vi(u.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (l = e._observers, l !== null && l.forEach(function(s) {
      typeof s.rootMargin == "string" ? Jb(
        e,
        s,
        t
      ) : s.unobserve(t);
    }), t.reactFragments != null && t.reactFragments.delete(e));
  }
  function Qf(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (e = e.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Qf(l), Va(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(l);
    }
  }
  function tS(t, e, l, a) {
    for (; t.nodeType === 1; ) {
      var u = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (a) {
        if (!t[ea])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (s = t.getAttribute("rel"), s === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (s !== u.rel || t.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || t.getAttribute("title") !== (u.title == null ? null : u.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (s = t.getAttribute("src"), (s !== (u.src == null ? null : u.src) || t.getAttribute("type") !== (u.type == null ? null : u.type) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && s && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var s = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && t.getAttribute("name") === s)
          return t;
      } else return t;
      if (t = hn(t.nextSibling), t === null) break;
    }
    return null;
  }
  function eS(t, e, l) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l || (t = hn(t.nextSibling), t === null)) return null;
    return t;
  }
  function Vm(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = hn(t.nextSibling), t === null)) return null;
    return t;
  }
  function $f(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Kf(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function nS(t, e) {
    var l = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || l.readyState !== "loading")
      e();
    else {
      var a = function() {
        e(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), t._reactRetry = a;
    }
  }
  function hn(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F")
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var kf = null;
  function Ym(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === "/$" || l === "/&") {
          if (e === 0)
            return hn(t.nextSibling);
          e--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function qm(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (e === 0) return t;
          e--;
        } else l !== "/$" && l !== "/&" || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function lS(t, e) {
    function l() {
      a = !0;
    }
    if (t.ownerDocument.activeElement === t) return !0;
    var a = !1;
    try {
      t.ownerDocument.addEventListener("focus", l, !0), (t.focus || HTMLElement.prototype.focus).call(t, e);
    } finally {
      t.ownerDocument.removeEventListener("focus", l, !0);
    }
    return a;
  }
  function aS(t) {
    Cm(function() {
      Cm(function(e) {
        return t(e);
      });
    });
  }
  function Xm(t, e, l) {
    switch (e = Eu(l), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(r(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(r(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function Zm(t, e, l) {
    for (var a in l) {
      var u = l[a];
      l.hasOwnProperty(a) && u != null && $t(t, e, a, null, Rb, u);
    }
    l.dangerouslySetInnerHTML != null && (t.textContent = ""), t.onclick === On && (t.onclick = null), Va(t);
  }
  function Jf(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    Va(t);
  }
  var gn = /* @__PURE__ */ new Map(), Gm = /* @__PURE__ */ new Set();
  function wu(t) {
    if (typeof t.getRootNode == "function") {
      var e = t.getRootNode();
      if (e.nodeType === 9 || e.nodeType === 11) return e;
    }
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  var sl = ct.d;
  ct.d = {
    f: iS,
    r: uS,
    D: oS,
    C: rS,
    L: sS,
    m: cS,
    X: dS,
    S: fS,
    M: hS
  };
  function iS() {
    var t = sl.f(), e = xr();
    return t || e;
  }
  function uS(t) {
    var e = ml(t);
    e !== null && e.tag === 5 && e.type === "form" ? $g(e) : sl.r(t);
  }
  var xi = typeof document > "u" ? null : document;
  function Qm(t, e, l) {
    var a = xi;
    if (a && typeof e == "string" && e) {
      var u = un(e);
      u = 'link[rel="' + t + '"][href="' + u + '"]', typeof l == "string" && (u += '[crossorigin="' + l + '"]'), Gm.has(u) || (Gm.add(u), t = { rel: t, crossOrigin: l, href: e }, a.querySelector(u) === null && (e = a.createElement("link"), Me(e, "link", t), re(e), a.head.appendChild(e)));
    }
  }
  function oS(t) {
    sl.D(t), Qm("dns-prefetch", t, null);
  }
  function rS(t, e) {
    sl.C(t, e), Qm("preconnect", t, e);
  }
  function sS(t, e, l) {
    sl.L(t, e, l);
    var a = xi;
    if (a && t && e) {
      var u = 'link[rel="preload"][as="' + un(e) + '"]';
      e === "image" && l && l.imageSrcSet ? (u += '[imagesrcset="' + un(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (u += '[imagesizes="' + un(
        l.imageSizes
      ) + '"]')) : u += '[href="' + un(t) + '"]';
      var s = u;
      switch (e) {
        case "style":
          s = bi(t);
          break;
        case "script":
          s = Si(t);
      }
      if (!(gn.has(s) || (t = H(
        {
          rel: "preload",
          href: e === "image" && l && l.imageSrcSet ? void 0 : t,
          as: e
        },
        l
      ), gn.set(s, t), a.querySelector(u) !== null || e === "style" && a.querySelector(_u(s)) || e === "script" && a.querySelector(Nu(s))))) {
        var g = a.createElement("link");
        Me(g, "link", t), e === "style" && (g[La] = !0, g.onload = g.onerror = function() {
          Yi(g);
        }), re(g), a.head.appendChild(g);
      }
    }
  }
  function cS(t, e) {
    sl.m(t, e);
    var l = xi;
    if (l && t) {
      var a = e && typeof e.as == "string" ? e.as : "script", u = 'link[rel="modulepreload"][as="' + un(a) + '"][href="' + un(t) + '"]', s = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          s = Si(t);
      }
      if (!gn.has(s) && (t = H({ rel: "modulepreload", href: t }, e), gn.set(s, t), l.querySelector(u) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Nu(s)))
              return;
        }
        a = l.createElement("link"), Me(a, "link", t), re(a), l.head.appendChild(a);
      }
    }
  }
  function fS(t, e, l) {
    sl.S(t, e, l);
    var a = xi;
    if (a && t) {
      var u = Jn(a).hoistableStyles, s = bi(t);
      e = e || "default";
      var g = u.get(s);
      if (!g) {
        var b = { loading: 0, preload: null };
        if (g = a.querySelector(
          _u(s)
        ))
          b.loading = 5;
        else {
          t = H(
            { rel: "stylesheet", href: t, "data-precedence": e },
            l
          ), (l = gn.get(s)) && If(t, l);
          var A = g = a.createElement("link");
          re(A), Me(A, "link", t), A._p = new Promise(function(Z, P) {
            A.onload = Z, A.onerror = P;
          }), A.addEventListener("load", function() {
            b.loading |= 1;
          }), A.addEventListener("error", function() {
            b.loading |= 2;
          }), b.loading |= 4, Tr(g, e, a);
        }
        g = {
          type: "stylesheet",
          instance: g,
          count: 1,
          state: b
        }, u.set(s, g);
      }
    }
  }
  function dS(t, e) {
    sl.X(t, e);
    var l = xi;
    if (l && t) {
      var a = Jn(l).hoistableScripts, u = Si(t), s = a.get(u);
      s || (s = l.querySelector(Nu(u)), s || (t = H({ src: t, async: !0 }, e), (e = gn.get(u)) && Ff(t, e), s = l.createElement("script"), re(s), Me(s, "link", t), l.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, a.set(u, s));
    }
  }
  function hS(t, e) {
    sl.M(t, e);
    var l = xi;
    if (l && t) {
      var a = Jn(l).hoistableScripts, u = Si(t), s = a.get(u);
      s || (s = l.querySelector(Nu(u)), s || (t = H({ src: t, async: !0, type: "module" }, e), (e = gn.get(u)) && Ff(t, e), s = l.createElement("script"), re(s), Me(s, "link", t), l.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, a.set(u, s));
    }
  }
  function $m(t, e, l, a) {
    var u = (u = Nt.current) ? wu(u) : null;
    if (!u) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (l = bi(l.href), e = Jn(
          u
        ).hoistableStyles, a = e.get(l), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(l, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          t = bi(l.href);
          var s = Jn(
            u
          ).hoistableStyles, g = s.get(t);
          if (g || (u = u.ownerDocument || u, g = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, s.set(t, g), (s = u.querySelector(
            _u(t)
          )) ? s._p || (g.instance = s, g.state.loading = 5) : (s = gn.get(t), s || (s = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, gn.set(t, s)), gS(
            u,
            t,
            s,
            g.state
          ))), e && a === null)
            throw Error(r(528, ""));
          return g;
        }
        if (e && a !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return e = l.async, l = l.src, typeof l == "string" && e && typeof e != "function" && typeof e != "symbol" ? (l = Si(l), e = Jn(
          u
        ).hoistableScripts, a = e.get(l), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(l, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, t));
    }
  }
  function bi(t) {
    return 'href="' + un(t) + '"';
  }
  function _u(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function Km(t) {
    return H({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function gS(t, e, l, a) {
    if (e = t.querySelector(
      'link[rel="preload"][as="style"][' + e + "]"
    )) {
      if (e[La] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      e = t.createElement("link"), e[La] = !0, e.onload = e.onerror = Yi.bind(null, e), Me(e, "link", l), re(e), t.head.appendChild(e);
    a.preload = e, e.addEventListener("load", function() {
      return a.loading |= 1;
    }), e.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function Si(t) {
    return '[src="' + un(t) + '"]';
  }
  function Nu(t) {
    return "script[async]" + t;
  }
  function km(t, e, l) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var a = t.querySelector(
            'style[data-href~="' + un(l.href) + '"]'
          );
          if (a)
            return e.instance = a, re(a), a;
          var u = H({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (t.ownerDocument || t).createElement(
            "style"
          ), re(a), Me(a, "style", u), Tr(a, l.precedence, t), e.instance = a;
        case "stylesheet":
          u = bi(l.href);
          var s = t.querySelector(
            _u(u)
          );
          if (s)
            return e.state.loading |= 4, e.instance = s, re(s), s;
          a = Km(l), (u = gn.get(u)) && If(a, u), s = (t.ownerDocument || t).createElement("link"), re(s);
          var g = s;
          return g._p = new Promise(function(b, A) {
            g.onload = b, g.onerror = A;
          }), Me(s, "link", a), e.state.loading |= 4, Tr(s, l.precedence, t), e.instance = s;
        case "script":
          return s = Si(l.src), (u = t.querySelector(
            Nu(s)
          )) ? (e.instance = u, re(u), u) : (a = l, (u = gn.get(s)) && (a = H({}, l), Ff(a, u)), t = t.ownerDocument || t, u = t.createElement("script"), re(u), Me(u, "link", a), t.head.appendChild(u), e.instance = u);
        case "void":
          return null;
        default:
          throw Error(r(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (a = e.instance, e.state.loading |= 4, Tr(a, l.precedence, t));
    return e.instance;
  }
  function Tr(t, e, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = a.length ? a[a.length - 1] : null, s = u, g = 0; g < a.length; g++) {
      var b = a[g];
      if (b.dataset.precedence === e) s = b;
      else if (s !== u) break;
    }
    s ? s.parentNode.insertBefore(t, s.nextSibling) : (e = l.nodeType === 9 ? l.head : l, e.insertBefore(t, e.firstChild));
  }
  function If(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Ff(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var Cr = null;
  function Jm(t, e, l) {
    if (Cr === null) {
      var a = /* @__PURE__ */ new Map(), u = Cr = /* @__PURE__ */ new Map();
      u.set(l, a);
    } else
      u = Cr, a = u.get(l), a || (a = /* @__PURE__ */ new Map(), u.set(l, a));
    if (a.has(t)) return a;
    for (a.set(t, null), l = l.getElementsByTagName(t), u = 0; u < l.length; u++) {
      var s = l[u];
      if (!(s[ea] || s[ge] || t === "link" && s.getAttribute("rel") === "stylesheet") && s.namespaceURI !== "http://www.w3.org/2000/svg") {
        var g = s.getAttribute(e) || "";
        g = t + g;
        var b = a.get(g);
        b ? b.push(s) : a.set(g, [s]);
      }
    }
    return a;
  }
  function Wf(t, e, l) {
    t = t.ownerDocument || t, t.head.insertBefore(
      l,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function mS(t, e, l) {
    if (l === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        return e.rel === "stylesheet" ? (t = e.disabled, typeof e.precedence == "string" && t == null) : !0;
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function Im(t, e) {
    return t === "img" && e.src != null && e.src !== "" && e.onLoad == null && e.loading !== "lazy";
  }
  function Fm(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function Wm(t) {
    return (t.width || 100) * (t.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Pm(t, e) {
    typeof e.decode == "function" && (t.imgCount++, e.complete || (t.imgBytes += Wm(e), t.suspenseyImages.push(e)), t = vS.bind(t), e.decode().then(t, t));
  }
  function yS(t, e, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var u = bi(a.href), s = e.querySelector(
          _u(u)
        );
        if (s) {
          e = s._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = Tu.bind(t), e.then(t, t)), l.state.loading |= 4, l.instance = s, re(s);
          return;
        }
        s = e.ownerDocument || e, a = Km(a), (u = gn.get(u)) && If(a, u), s = s.createElement("link"), re(s);
        var g = s;
        g._p = new Promise(function(b, A) {
          g.onload = b, g.onerror = A;
        }), Me(s, "link", a), l.instance = s;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(l, e), (e = l.state.preload) && (l.state.loading & 3) === 0 && (t.count++, l = Tu.bind(t), e.addEventListener("load", l), e.addEventListener("error", l));
    }
  }
  var Mr = 0;
  function pS(t, e) {
    return t.stylesheets && t.count === 0 && Ar(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (t.stylesheets && Ar(t, t.stylesheets), t.unsuspend) {
          var s = t.unsuspend;
          t.unsuspend = null, s();
        }
      }, 6e4 + e);
      0 < t.imgBytes && Mr === 0 && (Mr = 62500 * jb());
      var u = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && Ar(t, t.stylesheets), t.unsuspend)) {
            var s = t.unsuspend;
            t.unsuspend = null, s();
          }
        },
        (t.imgBytes > Mr ? 50 : 800) + e
      );
      return t.unsuspend = l, function() {
        t.unsuspend = null, clearTimeout(a), clearTimeout(u);
      };
    } : null;
  }
  function ty(t) {
    if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
      if (t.stylesheets) Ar(t, t.stylesheets);
      else if (t.unsuspend) {
        var e = t.unsuspend;
        t.unsuspend = null, e();
      }
    }
  }
  function Tu() {
    this.count--, ty(this);
  }
  function vS() {
    this.imgCount--, ty(this);
  }
  var zr = null;
  function Ar(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, zr = /* @__PURE__ */ new Map(), e.forEach(xS, t), zr = null, Tu.call(t));
  }
  function xS(t, e) {
    if (!(e.state.loading & 4)) {
      var l = zr.get(t);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), zr.set(t, l);
        for (var u = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), s = 0; s < u.length; s++) {
          var g = u[s];
          (g.nodeName === "LINK" || g.getAttribute("media") !== "not all") && (l.set(g.dataset.precedence, g), a = g);
        }
        a && l.set(null, a);
      }
      u = e.instance, g = u.getAttribute("data-precedence"), s = l.get(g) || a, s === a && l.set(null, u), l.set(g, u), this.count++, a = Tu.bind(this), u.addEventListener("load", a), u.addEventListener("error", a), s ? s.parentNode.insertBefore(u, s.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(u, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Ei = {
    $$typeof: L,
    Provider: null,
    Consumer: null,
    _currentValue: bt,
    _currentValue2: bt,
    _threadCount: 0
  };
  function bS(t, e, l, a, u, s, g, b, A) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Li(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Li(0), this.hiddenUpdates = Li(null), this.identifierPrefix = a, this.onUncaughtError = u, this.onCaughtError = s, this.onRecoverableError = g, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = A, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function ey(t, e, l, a, u, s, g, b, A, Z, P, it) {
    return t = new bS(
      t,
      e,
      l,
      g,
      A,
      Z,
      P,
      it,
      b
    ), e = 1, s === !0 && (e |= 24), s = Ye(3, null, null, e), t.current = s, s.stateNode = t, e = dc(), e.refCount++, t.pooledCache = e, e.refCount++, s.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: e
    }, yc(s), t;
  }
  function ny(t) {
    return t ? (t = ka, t) : ka;
  }
  function ly(t, e, l, a, u, s) {
    u = ny(u), a.context === null ? a.context = u : a.pendingContext = u, a = Nl(e), a.payload = { element: l }, s = s === void 0 ? null : s, s !== null && (a.callback = s), l = Tl(t, a, e), l !== null && (Ge(l, t, e), lu(l, t, e));
  }
  function ay(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function Pf(t, e) {
    ay(t, e), (t = t.alternate) && ay(t, e);
  }
  function iy(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = ia(t, 67108864);
      e !== null && Ge(e, t, 67108864), Pf(t, 67108864);
    }
  }
  function uy(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Pe();
      e = Ba(e);
      var l = ia(t, e);
      l !== null && Ge(l, t, e), Pf(t, e);
    }
  }
  var wi = !0;
  function SS(t, e, l, a) {
    var u = st.T;
    st.T = null;
    var s = ct.p;
    try {
      ct.p = 2, td(t, e, l, a);
    } finally {
      ct.p = s, st.T = u;
    }
  }
  function ES(t, e, l, a) {
    var u = st.T;
    st.T = null;
    var s = ct.p;
    try {
      ct.p = 8, td(t, e, l, a);
    } finally {
      ct.p = s, st.T = u;
    }
  }
  function td(t, e, l, a) {
    if (wi) {
      var u = ed(a);
      if (u === null)
        jf(
          t,
          e,
          a,
          Dr,
          l
        ), ry(t, a);
      else if (_S(
        u,
        t,
        e,
        l,
        a
      ))
        a.stopPropagation();
      else if (ry(t, a), e & 4 && -1 < wS.indexOf(t)) {
        for (; u !== null; ) {
          var s = ml(u);
          if (s !== null)
            switch (s.tag) {
              case 3:
                if (s = s.stateNode, s.current.memoizedState.isDehydrated) {
                  var g = Kn(s.pendingLanes);
                  if (g !== 0) {
                    var b = s;
                    for (b.pendingLanes |= 2, b.entangledLanes |= 2; g; ) {
                      var A = 1 << 31 - je(g);
                      b.entanglements[1] |= A, g &= ~A;
                    }
                    Xn(s), (Xt & 6) === 0 && (yr = ee() + 500, xu(0));
                  }
                }
                break;
              case 31:
              case 13:
                b = ia(s, 2), b !== null && Ge(b, s, 2), xr(), Pf(s, 2);
            }
          if (s = ed(a), s === null && jf(
            t,
            e,
            a,
            Dr,
            l
          ), s === u) break;
          u = s;
        }
        u !== null && a.stopPropagation();
      } else
        jf(
          t,
          e,
          a,
          null,
          l
        );
    }
  }
  function ed(t) {
    return t = Vs(t), nd(t);
  }
  var Dr = null;
  function nd(t) {
    if (Dr = null, t = kn(t), t !== null) {
      var e = f(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (t = d(e), t !== null) return t;
          t = null;
        } else if (l === 31) {
          if (t = h(e), t !== null) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return Dr = t, null;
  }
  function oy(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Ae()) {
          case no:
            return 2;
          case lo:
            return 8;
          case Oa:
          case Ns:
            return 32;
          case ao:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ld = !1, Ll = null, Vl = null, Yl = null, Cu = /* @__PURE__ */ new Map(), Mu = /* @__PURE__ */ new Map(), ql = [], wS = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function ry(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Ll = null;
        break;
      case "dragenter":
      case "dragleave":
        Vl = null;
        break;
      case "mouseover":
      case "mouseout":
        Yl = null;
        break;
      case "pointerover":
      case "pointerout":
        Cu.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Mu.delete(e.pointerId);
    }
  }
  function zu(t, e, l, a, u, s) {
    return t === null || t.nativeEvent !== s ? (t = {
      blockedOn: e,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: s,
      targetContainers: [u]
    }, e !== null && (e = ml(e), e !== null && iy(e)), t) : (t.eventSystemFlags |= a, e = t.targetContainers, u !== null && e.indexOf(u) === -1 && e.push(u), t);
  }
  function _S(t, e, l, a, u) {
    switch (e) {
      case "focusin":
        return Ll = zu(
          Ll,
          t,
          e,
          l,
          a,
          u
        ), !0;
      case "dragenter":
        return Vl = zu(
          Vl,
          t,
          e,
          l,
          a,
          u
        ), !0;
      case "mouseover":
        return Yl = zu(
          Yl,
          t,
          e,
          l,
          a,
          u
        ), !0;
      case "pointerover":
        var s = u.pointerId;
        return Cu.set(
          s,
          zu(
            Cu.get(s) || null,
            t,
            e,
            l,
            a,
            u
          )
        ), !0;
      case "gotpointercapture":
        return s = u.pointerId, Mu.set(
          s,
          zu(
            Mu.get(s) || null,
            t,
            e,
            l,
            a,
            u
          )
        ), !0;
    }
    return !1;
  }
  function sy(t) {
    var e = kn(t.target);
    if (e !== null) {
      var l = f(e);
      if (l !== null) {
        if (e = l.tag, e === 13) {
          if (e = d(l), e !== null) {
            t.blockedOn = e, co(t.priority, function() {
              uy(l);
            });
            return;
          }
        } else if (e === 31) {
          if (e = h(l), e !== null) {
            t.blockedOn = e, co(t.priority, function() {
              uy(l);
            });
            return;
          }
        } else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Or(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = ed(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        Ls = a, l.target.dispatchEvent(a), Ls = null;
      } else
        return e = ml(l), e !== null && iy(e), t.blockedOn = l, !1;
      e.shift();
    }
    return !0;
  }
  function cy(t, e, l) {
    Or(t) && l.delete(e);
  }
  function NS() {
    ld = !1, Ll !== null && Or(Ll) && (Ll = null), Vl !== null && Or(Vl) && (Vl = null), Yl !== null && Or(Yl) && (Yl = null), Cu.forEach(cy), Mu.forEach(cy);
  }
  function Rr(t, e) {
    t.blockedOn === e && (t.blockedOn = null, ld || (ld = !0, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      NS
    )));
  }
  var Hr = null;
  function fy(t) {
    Hr !== t && (Hr = t, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      function() {
        Hr === t && (Hr = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e], a = t[e + 1], u = t[e + 2];
          if (typeof a != "function") {
            if (nd(a || l) === null)
              continue;
            break;
          }
          var s = ml(l);
          s !== null && (t.splice(e, 3), e -= 3, Bc(
            s,
            {
              pending: !0,
              data: u,
              method: l.method,
              action: a
            },
            a,
            u
          ));
        }
      }
    ));
  }
  function _i(t) {
    function e(A) {
      return Rr(A, t);
    }
    Ll !== null && Rr(Ll, t), Vl !== null && Rr(Vl, t), Yl !== null && Rr(Yl, t), Cu.forEach(e), Mu.forEach(e);
    for (var l = 0; l < ql.length; l++) {
      var a = ql[l];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < ql.length && (l = ql[0], l.blockedOn === null); )
      sy(l), l.blockedOn === null && ql.shift();
    if (l = (t.ownerDocument || t).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var u = l[a], s = l[a + 1], g = u[De] || null;
        if (typeof s == "function")
          g || fy(l);
        else if (g) {
          var b = null;
          if (s && s.hasAttribute("formAction")) {
            if (u = s, g = s[De] || null)
              b = g.formAction;
            else if (nd(u) !== null) continue;
          } else b = g.action;
          typeof b == "function" ? l[a + 1] = b : (l.splice(a, 3), a -= 3), fy(l);
        }
      }
  }
  function dy() {
    function t(s) {
      s.canIntercept && s.info === "react-transition" && s.intercept({
        handler: function() {
          return new Promise(function(g) {
            return u = g;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      u !== null && (u(), u = null), a || setTimeout(l, 20);
    }
    function l() {
      if (!a && !navigation.transition) {
        var s = navigation.currentEntry;
        s && s.url != null && navigation.navigate(s.url, {
          state: s.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, u = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), u !== null && (u(), u = null);
      };
    }
  }
  function ad(t) {
    this._internalRoot = t;
  }
  jr.prototype.render = ad.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(r(409));
    var l = e.current, a = Pe();
    ly(l, a, t, e, null, null);
  }, jr.prototype.unmount = ad.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      ly(t.current, 2, null, t, null, null), xr(), e[gl] = null;
    }
  };
  function jr(t) {
    this._internalRoot = t;
  }
  jr.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = so();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < ql.length && e !== 0 && e < ql[l].priority; l++) ;
      ql.splice(l, 0, t), l === 0 && sy(t);
    }
  };
  var hy = i.version;
  if (hy !== "19.3.0")
    throw Error(
      r(
        527,
        hy,
        "19.3.0"
      )
    );
  ct.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(r(188)) : (t = Object.keys(t).join(","), Error(r(268, t)));
    return t = v(e), t = t !== null ? y(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var TS = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: st,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ur = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ur.isDisabled && Ur.supportsFiber)
      try {
        Wl = Ur.inject(
          TS
        ), He = Ur;
      } catch {
      }
  }
  return Du.createRoot = function(t, e) {
    if (!c(t)) throw Error(r(299));
    var l = !1, a = "", u = n0, s = l0, g = a0;
    return e != null && (e.unstable_strictMode === !0 && (l = !0), e.identifierPrefix !== void 0 && (a = e.identifierPrefix), e.onUncaughtError !== void 0 && (u = e.onUncaughtError), e.onCaughtError !== void 0 && (s = e.onCaughtError), e.onRecoverableError !== void 0 && (g = e.onRecoverableError)), e = ey(
      t,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      u,
      s,
      g,
      dy
    ), t[gl] = e.current, Hf(t), new ad(e);
  }, Du.hydrateRoot = function(t, e, l) {
    if (!c(t)) throw Error(r(299));
    var a = !1, u = "", s = n0, g = l0, b = a0, A = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (u = l.identifierPrefix), l.onUncaughtError !== void 0 && (s = l.onUncaughtError), l.onCaughtError !== void 0 && (g = l.onCaughtError), l.onRecoverableError !== void 0 && (b = l.onRecoverableError), l.formState !== void 0 && (A = l.formState)), e = ey(
      t,
      1,
      !0,
      e,
      l ?? null,
      a,
      u,
      A,
      s,
      g,
      b,
      dy
    ), e.context = ny(null), l = e.current, a = Pe(), a = Ba(a), u = Nl(a), u.callback = null, Tl(l, u, a), l = a, e.current.lanes = l, ta(e, l), Xn(e), t[gl] = e.current, Hf(t), new jr(e);
  }, Du.version = "19.3.0", Du;
}
var wy;
function jS() {
  if (wy) return ud.exports;
  wy = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), ud.exports = HS(), ud.exports;
}
var US = jS(), Q = ku();
const BS = /* @__PURE__ */ Qp(Q);
function he(n) {
  if (typeof n == "string" || typeof n == "number") return "" + n;
  let i = "";
  if (Array.isArray(n))
    for (let o = 0, r; o < n.length; o++)
      (r = he(n[o])) !== "" && (i += (i && " ") + r);
  else
    for (let o in n)
      n[o] && (i += (i && " ") + o);
  return i;
}
var LS = { value: () => {
} };
function ds() {
  for (var n = 0, i = arguments.length, o = {}, r; n < i; ++n) {
    if (!(r = arguments[n] + "") || r in o || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    o[r] = [];
  }
  return new kr(o);
}
function kr(n) {
  this._ = n;
}
function VS(n, i) {
  return n.trim().split(/^|\s+/).map(function(o) {
    var r = "", c = o.indexOf(".");
    if (c >= 0 && (r = o.slice(c + 1), o = o.slice(0, c)), o && !i.hasOwnProperty(o)) throw new Error("unknown type: " + o);
    return { type: o, name: r };
  });
}
kr.prototype = ds.prototype = {
  constructor: kr,
  on: function(n, i) {
    var o = this._, r = VS(n + "", o), c, f = -1, d = r.length;
    if (arguments.length < 2) {
      for (; ++f < d; ) if ((c = (n = r[f]).type) && (c = YS(o[c], n.name))) return c;
      return;
    }
    if (i != null && typeof i != "function") throw new Error("invalid callback: " + i);
    for (; ++f < d; )
      if (c = (n = r[f]).type) o[c] = _y(o[c], n.name, i);
      else if (i == null) for (c in o) o[c] = _y(o[c], n.name, null);
    return this;
  },
  copy: function() {
    var n = {}, i = this._;
    for (var o in i) n[o] = i[o].slice();
    return new kr(n);
  },
  call: function(n, i) {
    if ((c = arguments.length - 2) > 0) for (var o = new Array(c), r = 0, c, f; r < c; ++r) o[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    for (f = this._[n], r = 0, c = f.length; r < c; ++r) f[r].value.apply(i, o);
  },
  apply: function(n, i, o) {
    if (!this._.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    for (var r = this._[n], c = 0, f = r.length; c < f; ++c) r[c].value.apply(i, o);
  }
};
function YS(n, i) {
  for (var o = 0, r = n.length, c; o < r; ++o)
    if ((c = n[o]).name === i)
      return c.value;
}
function _y(n, i, o) {
  for (var r = 0, c = n.length; r < c; ++r)
    if (n[r].name === i) {
      n[r] = LS, n = n.slice(0, r).concat(n.slice(r + 1));
      break;
    }
  return o != null && n.push({ name: i, value: o }), n;
}
var Td = "http://www.w3.org/1999/xhtml";
const Ny = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Td,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function hs(n) {
  var i = n += "", o = i.indexOf(":");
  return o >= 0 && (i = n.slice(0, o)) !== "xmlns" && (n = n.slice(o + 1)), Ny.hasOwnProperty(i) ? { space: Ny[i], local: n } : n;
}
function qS(n) {
  return function() {
    var i = this.ownerDocument, o = this.namespaceURI;
    return o === Td && i.documentElement.namespaceURI === Td ? i.createElement(n) : i.createElementNS(o, n);
  };
}
function XS(n) {
  return function() {
    return this.ownerDocument.createElementNS(n.space, n.local);
  };
}
function Kp(n) {
  var i = hs(n);
  return (i.local ? XS : qS)(i);
}
function ZS() {
}
function qd(n) {
  return n == null ? ZS : function() {
    return this.querySelector(n);
  };
}
function GS(n) {
  typeof n != "function" && (n = qd(n));
  for (var i = this._groups, o = i.length, r = new Array(o), c = 0; c < o; ++c)
    for (var f = i[c], d = f.length, h = r[c] = new Array(d), p, v, y = 0; y < d; ++y)
      (p = f[y]) && (v = n.call(p, p.__data__, y, f)) && ("__data__" in p && (v.__data__ = p.__data__), h[y] = v);
  return new ln(r, this._parents);
}
function QS(n) {
  return n == null ? [] : Array.isArray(n) ? n : Array.from(n);
}
function $S() {
  return [];
}
function kp(n) {
  return n == null ? $S : function() {
    return this.querySelectorAll(n);
  };
}
function KS(n) {
  return function() {
    return QS(n.apply(this, arguments));
  };
}
function kS(n) {
  typeof n == "function" ? n = KS(n) : n = kp(n);
  for (var i = this._groups, o = i.length, r = [], c = [], f = 0; f < o; ++f)
    for (var d = i[f], h = d.length, p, v = 0; v < h; ++v)
      (p = d[v]) && (r.push(n.call(p, p.__data__, v, d)), c.push(p));
  return new ln(r, c);
}
function Jp(n) {
  return function() {
    return this.matches(n);
  };
}
function Ip(n) {
  return function(i) {
    return i.matches(n);
  };
}
var JS = Array.prototype.find;
function IS(n) {
  return function() {
    return JS.call(this.children, n);
  };
}
function FS() {
  return this.firstElementChild;
}
function WS(n) {
  return this.select(n == null ? FS : IS(typeof n == "function" ? n : Ip(n)));
}
var PS = Array.prototype.filter;
function tE() {
  return Array.from(this.children);
}
function eE(n) {
  return function() {
    return PS.call(this.children, n);
  };
}
function nE(n) {
  return this.selectAll(n == null ? tE : eE(typeof n == "function" ? n : Ip(n)));
}
function lE(n) {
  typeof n != "function" && (n = Jp(n));
  for (var i = this._groups, o = i.length, r = new Array(o), c = 0; c < o; ++c)
    for (var f = i[c], d = f.length, h = r[c] = [], p, v = 0; v < d; ++v)
      (p = f[v]) && n.call(p, p.__data__, v, f) && h.push(p);
  return new ln(r, this._parents);
}
function Fp(n) {
  return new Array(n.length);
}
function aE() {
  return new ln(this._enter || this._groups.map(Fp), this._parents);
}
function Pr(n, i) {
  this.ownerDocument = n.ownerDocument, this.namespaceURI = n.namespaceURI, this._next = null, this._parent = n, this.__data__ = i;
}
Pr.prototype = {
  constructor: Pr,
  appendChild: function(n) {
    return this._parent.insertBefore(n, this._next);
  },
  insertBefore: function(n, i) {
    return this._parent.insertBefore(n, i);
  },
  querySelector: function(n) {
    return this._parent.querySelector(n);
  },
  querySelectorAll: function(n) {
    return this._parent.querySelectorAll(n);
  }
};
function iE(n) {
  return function() {
    return n;
  };
}
function uE(n, i, o, r, c, f) {
  for (var d = 0, h, p = i.length, v = f.length; d < v; ++d)
    (h = i[d]) ? (h.__data__ = f[d], r[d] = h) : o[d] = new Pr(n, f[d]);
  for (; d < p; ++d)
    (h = i[d]) && (c[d] = h);
}
function oE(n, i, o, r, c, f, d) {
  var h, p, v = /* @__PURE__ */ new Map(), y = i.length, m = f.length, x = new Array(y), S;
  for (h = 0; h < y; ++h)
    (p = i[h]) && (x[h] = S = d.call(p, p.__data__, h, i) + "", v.has(S) ? c[h] = p : v.set(S, p));
  for (h = 0; h < m; ++h)
    S = d.call(n, f[h], h, f) + "", (p = v.get(S)) ? (r[h] = p, p.__data__ = f[h], v.delete(S)) : o[h] = new Pr(n, f[h]);
  for (h = 0; h < y; ++h)
    (p = i[h]) && v.get(x[h]) === p && (c[h] = p);
}
function rE(n) {
  return n.__data__;
}
function sE(n, i) {
  if (!arguments.length) return Array.from(this, rE);
  var o = i ? oE : uE, r = this._parents, c = this._groups;
  typeof n != "function" && (n = iE(n));
  for (var f = c.length, d = new Array(f), h = new Array(f), p = new Array(f), v = 0; v < f; ++v) {
    var y = r[v], m = c[v], x = m.length, S = cE(n.call(y, y && y.__data__, v, r)), E = S.length, z = h[v] = new Array(E), T = d[v] = new Array(E), C = p[v] = new Array(x);
    o(y, m, z, T, C, S, i);
    for (var U = 0, _ = 0, D, G; U < E; ++U)
      if (D = z[U]) {
        for (U >= _ && (_ = U + 1); !(G = T[_]) && ++_ < E; ) ;
        D._next = G || null;
      }
  }
  return d = new ln(d, r), d._enter = h, d._exit = p, d;
}
function cE(n) {
  return typeof n == "object" && "length" in n ? n : Array.from(n);
}
function fE() {
  return new ln(this._exit || this._groups.map(Fp), this._parents);
}
function dE(n, i, o) {
  var r = this.enter(), c = this, f = this.exit();
  return typeof n == "function" ? (r = n(r), r && (r = r.selection())) : r = r.append(n + ""), i != null && (c = i(c), c && (c = c.selection())), o == null ? f.remove() : o(f), r && c ? r.merge(c).order() : c;
}
function hE(n) {
  for (var i = n.selection ? n.selection() : n, o = this._groups, r = i._groups, c = o.length, f = r.length, d = Math.min(c, f), h = new Array(c), p = 0; p < d; ++p)
    for (var v = o[p], y = r[p], m = v.length, x = h[p] = new Array(m), S, E = 0; E < m; ++E)
      (S = v[E] || y[E]) && (x[E] = S);
  for (; p < c; ++p)
    h[p] = o[p];
  return new ln(h, this._parents);
}
function gE() {
  for (var n = this._groups, i = -1, o = n.length; ++i < o; )
    for (var r = n[i], c = r.length - 1, f = r[c], d; --c >= 0; )
      (d = r[c]) && (f && d.compareDocumentPosition(f) ^ 4 && f.parentNode.insertBefore(d, f), f = d);
  return this;
}
function mE(n) {
  n || (n = yE);
  function i(m, x) {
    return m && x ? n(m.__data__, x.__data__) : !m - !x;
  }
  for (var o = this._groups, r = o.length, c = new Array(r), f = 0; f < r; ++f) {
    for (var d = o[f], h = d.length, p = c[f] = new Array(h), v, y = 0; y < h; ++y)
      (v = d[y]) && (p[y] = v);
    p.sort(i);
  }
  return new ln(c, this._parents).order();
}
function yE(n, i) {
  return n < i ? -1 : n > i ? 1 : n >= i ? 0 : NaN;
}
function pE() {
  var n = arguments[0];
  return arguments[0] = this, n.apply(null, arguments), this;
}
function vE() {
  return Array.from(this);
}
function xE() {
  for (var n = this._groups, i = 0, o = n.length; i < o; ++i)
    for (var r = n[i], c = 0, f = r.length; c < f; ++c) {
      var d = r[c];
      if (d) return d;
    }
  return null;
}
function bE() {
  let n = 0;
  for (const i of this) ++n;
  return n;
}
function SE() {
  return !this.node();
}
function EE(n) {
  for (var i = this._groups, o = 0, r = i.length; o < r; ++o)
    for (var c = i[o], f = 0, d = c.length, h; f < d; ++f)
      (h = c[f]) && n.call(h, h.__data__, f, c);
  return this;
}
function wE(n) {
  return function() {
    this.removeAttribute(n);
  };
}
function _E(n) {
  return function() {
    this.removeAttributeNS(n.space, n.local);
  };
}
function NE(n, i) {
  return function() {
    this.setAttribute(n, i);
  };
}
function TE(n, i) {
  return function() {
    this.setAttributeNS(n.space, n.local, i);
  };
}
function CE(n, i) {
  return function() {
    var o = i.apply(this, arguments);
    o == null ? this.removeAttribute(n) : this.setAttribute(n, o);
  };
}
function ME(n, i) {
  return function() {
    var o = i.apply(this, arguments);
    o == null ? this.removeAttributeNS(n.space, n.local) : this.setAttributeNS(n.space, n.local, o);
  };
}
function zE(n, i) {
  var o = hs(n);
  if (arguments.length < 2) {
    var r = this.node();
    return o.local ? r.getAttributeNS(o.space, o.local) : r.getAttribute(o);
  }
  return this.each((i == null ? o.local ? _E : wE : typeof i == "function" ? o.local ? ME : CE : o.local ? TE : NE)(o, i));
}
function Wp(n) {
  return n.ownerDocument && n.ownerDocument.defaultView || n.document && n || n.defaultView;
}
function AE(n) {
  return function() {
    this.style.removeProperty(n);
  };
}
function DE(n, i, o) {
  return function() {
    this.style.setProperty(n, i, o);
  };
}
function OE(n, i, o) {
  return function() {
    var r = i.apply(this, arguments);
    r == null ? this.style.removeProperty(n) : this.style.setProperty(n, r, o);
  };
}
function RE(n, i, o) {
  return arguments.length > 1 ? this.each((i == null ? AE : typeof i == "function" ? OE : DE)(n, i, o ?? "")) : zi(this.node(), n);
}
function zi(n, i) {
  return n.style.getPropertyValue(i) || Wp(n).getComputedStyle(n, null).getPropertyValue(i);
}
function HE(n) {
  return function() {
    delete this[n];
  };
}
function jE(n, i) {
  return function() {
    this[n] = i;
  };
}
function UE(n, i) {
  return function() {
    var o = i.apply(this, arguments);
    o == null ? delete this[n] : this[n] = o;
  };
}
function BE(n, i) {
  return arguments.length > 1 ? this.each((i == null ? HE : typeof i == "function" ? UE : jE)(n, i)) : this.node()[n];
}
function Pp(n) {
  return n.trim().split(/^|\s+/);
}
function Xd(n) {
  return n.classList || new tv(n);
}
function tv(n) {
  this._node = n, this._names = Pp(n.getAttribute("class") || "");
}
tv.prototype = {
  add: function(n) {
    var i = this._names.indexOf(n);
    i < 0 && (this._names.push(n), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(n) {
    var i = this._names.indexOf(n);
    i >= 0 && (this._names.splice(i, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(n) {
    return this._names.indexOf(n) >= 0;
  }
};
function ev(n, i) {
  for (var o = Xd(n), r = -1, c = i.length; ++r < c; ) o.add(i[r]);
}
function nv(n, i) {
  for (var o = Xd(n), r = -1, c = i.length; ++r < c; ) o.remove(i[r]);
}
function LE(n) {
  return function() {
    ev(this, n);
  };
}
function VE(n) {
  return function() {
    nv(this, n);
  };
}
function YE(n, i) {
  return function() {
    (i.apply(this, arguments) ? ev : nv)(this, n);
  };
}
function qE(n, i) {
  var o = Pp(n + "");
  if (arguments.length < 2) {
    for (var r = Xd(this.node()), c = -1, f = o.length; ++c < f; ) if (!r.contains(o[c])) return !1;
    return !0;
  }
  return this.each((typeof i == "function" ? YE : i ? LE : VE)(o, i));
}
function XE() {
  this.textContent = "";
}
function ZE(n) {
  return function() {
    this.textContent = n;
  };
}
function GE(n) {
  return function() {
    var i = n.apply(this, arguments);
    this.textContent = i ?? "";
  };
}
function QE(n) {
  return arguments.length ? this.each(n == null ? XE : (typeof n == "function" ? GE : ZE)(n)) : this.node().textContent;
}
function $E() {
  this.innerHTML = "";
}
function KE(n) {
  return function() {
    this.innerHTML = n;
  };
}
function kE(n) {
  return function() {
    var i = n.apply(this, arguments);
    this.innerHTML = i ?? "";
  };
}
function JE(n) {
  return arguments.length ? this.each(n == null ? $E : (typeof n == "function" ? kE : KE)(n)) : this.node().innerHTML;
}
function IE() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function FE() {
  return this.each(IE);
}
function WE() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function PE() {
  return this.each(WE);
}
function tw(n) {
  var i = typeof n == "function" ? n : Kp(n);
  return this.select(function() {
    return this.appendChild(i.apply(this, arguments));
  });
}
function ew() {
  return null;
}
function nw(n, i) {
  var o = typeof n == "function" ? n : Kp(n), r = i == null ? ew : typeof i == "function" ? i : qd(i);
  return this.select(function() {
    return this.insertBefore(o.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function lw() {
  var n = this.parentNode;
  n && n.removeChild(this);
}
function aw() {
  return this.each(lw);
}
function iw() {
  var n = this.cloneNode(!1), i = this.parentNode;
  return i ? i.insertBefore(n, this.nextSibling) : n;
}
function uw() {
  var n = this.cloneNode(!0), i = this.parentNode;
  return i ? i.insertBefore(n, this.nextSibling) : n;
}
function ow(n) {
  return this.select(n ? uw : iw);
}
function rw(n) {
  return arguments.length ? this.property("__data__", n) : this.node().__data__;
}
function sw(n) {
  return function(i) {
    n.call(this, i, this.__data__);
  };
}
function cw(n) {
  return n.trim().split(/^|\s+/).map(function(i) {
    var o = "", r = i.indexOf(".");
    return r >= 0 && (o = i.slice(r + 1), i = i.slice(0, r)), { type: i, name: o };
  });
}
function fw(n) {
  return function() {
    var i = this.__on;
    if (i) {
      for (var o = 0, r = -1, c = i.length, f; o < c; ++o)
        f = i[o], (!n.type || f.type === n.type) && f.name === n.name ? this.removeEventListener(f.type, f.listener, f.options) : i[++r] = f;
      ++r ? i.length = r : delete this.__on;
    }
  };
}
function dw(n, i, o) {
  return function() {
    var r = this.__on, c, f = sw(i);
    if (r) {
      for (var d = 0, h = r.length; d < h; ++d)
        if ((c = r[d]).type === n.type && c.name === n.name) {
          this.removeEventListener(c.type, c.listener, c.options), this.addEventListener(c.type, c.listener = f, c.options = o), c.value = i;
          return;
        }
    }
    this.addEventListener(n.type, f, o), c = { type: n.type, name: n.name, value: i, listener: f, options: o }, r ? r.push(c) : this.__on = [c];
  };
}
function hw(n, i, o) {
  var r = cw(n + ""), c, f = r.length, d;
  if (arguments.length < 2) {
    var h = this.node().__on;
    if (h) {
      for (var p = 0, v = h.length, y; p < v; ++p)
        for (c = 0, y = h[p]; c < f; ++c)
          if ((d = r[c]).type === y.type && d.name === y.name)
            return y.value;
    }
    return;
  }
  for (h = i ? dw : fw, c = 0; c < f; ++c) this.each(h(r[c], i, o));
  return this;
}
function lv(n, i, o) {
  var r = Wp(n), c = r.CustomEvent;
  typeof c == "function" ? c = new c(i, o) : (c = r.document.createEvent("Event"), o ? (c.initEvent(i, o.bubbles, o.cancelable), c.detail = o.detail) : c.initEvent(i, !1, !1)), n.dispatchEvent(c);
}
function gw(n, i) {
  return function() {
    return lv(this, n, i);
  };
}
function mw(n, i) {
  return function() {
    return lv(this, n, i.apply(this, arguments));
  };
}
function yw(n, i) {
  return this.each((typeof i == "function" ? mw : gw)(n, i));
}
function* pw() {
  for (var n = this._groups, i = 0, o = n.length; i < o; ++i)
    for (var r = n[i], c = 0, f = r.length, d; c < f; ++c)
      (d = r[c]) && (yield d);
}
var av = [null];
function ln(n, i) {
  this._groups = n, this._parents = i;
}
function Ju() {
  return new ln([[document.documentElement]], av);
}
function vw() {
  return this;
}
ln.prototype = Ju.prototype = {
  constructor: ln,
  select: GS,
  selectAll: kS,
  selectChild: WS,
  selectChildren: nE,
  filter: lE,
  data: sE,
  enter: aE,
  exit: fE,
  join: dE,
  merge: hE,
  selection: vw,
  order: gE,
  sort: mE,
  call: pE,
  nodes: vE,
  node: xE,
  size: bE,
  empty: SE,
  each: EE,
  attr: zE,
  style: RE,
  property: BE,
  classed: qE,
  text: QE,
  html: JE,
  raise: FE,
  lower: PE,
  append: tw,
  insert: nw,
  remove: aw,
  clone: ow,
  datum: rw,
  on: hw,
  dispatch: yw,
  [Symbol.iterator]: pw
};
function nn(n) {
  return typeof n == "string" ? new ln([[document.querySelector(n)]], [document.documentElement]) : new ln([[n]], av);
}
function xw(n) {
  let i;
  for (; i = n.sourceEvent; ) n = i;
  return n;
}
function wn(n, i) {
  if (n = xw(n), i === void 0 && (i = n.currentTarget), i) {
    var o = i.ownerSVGElement || i;
    if (o.createSVGPoint) {
      var r = o.createSVGPoint();
      return r.x = n.clientX, r.y = n.clientY, r = r.matrixTransform(i.getScreenCTM().inverse()), [r.x, r.y];
    }
    if (i.getBoundingClientRect) {
      var c = i.getBoundingClientRect();
      return [n.clientX - c.left - i.clientLeft, n.clientY - c.top - i.clientTop];
    }
  }
  return [n.pageX, n.pageY];
}
const bw = { passive: !1 }, Vu = { capture: !0, passive: !1 };
function fd(n) {
  n.stopImmediatePropagation();
}
function Ci(n) {
  n.preventDefault(), n.stopImmediatePropagation();
}
function iv(n) {
  var i = n.document.documentElement, o = nn(n).on("dragstart.drag", Ci, Vu);
  "onselectstart" in i ? o.on("selectstart.drag", Ci, Vu) : (i.__noselect = i.style.MozUserSelect, i.style.MozUserSelect = "none");
}
function uv(n, i) {
  var o = n.document.documentElement, r = nn(n).on("dragstart.drag", null);
  i && (r.on("click.drag", Ci, Vu), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in o ? r.on("selectstart.drag", null) : (o.style.MozUserSelect = o.__noselect, delete o.__noselect);
}
const Br = (n) => () => n;
function Cd(n, {
  sourceEvent: i,
  subject: o,
  target: r,
  identifier: c,
  active: f,
  x: d,
  y: h,
  dx: p,
  dy: v,
  dispatch: y
}) {
  Object.defineProperties(this, {
    type: { value: n, enumerable: !0, configurable: !0 },
    sourceEvent: { value: i, enumerable: !0, configurable: !0 },
    subject: { value: o, enumerable: !0, configurable: !0 },
    target: { value: r, enumerable: !0, configurable: !0 },
    identifier: { value: c, enumerable: !0, configurable: !0 },
    active: { value: f, enumerable: !0, configurable: !0 },
    x: { value: d, enumerable: !0, configurable: !0 },
    y: { value: h, enumerable: !0, configurable: !0 },
    dx: { value: p, enumerable: !0, configurable: !0 },
    dy: { value: v, enumerable: !0, configurable: !0 },
    _: { value: y }
  });
}
Cd.prototype.on = function() {
  var n = this._.on.apply(this._, arguments);
  return n === this._ ? this : n;
};
function Sw(n) {
  return !n.ctrlKey && !n.button;
}
function Ew() {
  return this.parentNode;
}
function ww(n, i) {
  return i ?? { x: n.x, y: n.y };
}
function _w() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function ov() {
  var n = Sw, i = Ew, o = ww, r = _w, c = {}, f = ds("start", "drag", "end"), d = 0, h, p, v, y, m = 0;
  function x(D) {
    D.on("mousedown.drag", S).filter(r).on("touchstart.drag", T).on("touchmove.drag", C, bw).on("touchend.drag touchcancel.drag", U).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function S(D, G) {
    if (!(y || !n.call(this, D, G))) {
      var B = _(this, i.call(this, D, G), D, G, "mouse");
      B && (nn(D.view).on("mousemove.drag", E, Vu).on("mouseup.drag", z, Vu), iv(D.view), fd(D), v = !1, h = D.clientX, p = D.clientY, B("start", D));
    }
  }
  function E(D) {
    if (Ci(D), !v) {
      var G = D.clientX - h, B = D.clientY - p;
      v = G * G + B * B > m;
    }
    c.mouse("drag", D);
  }
  function z(D) {
    nn(D.view).on("mousemove.drag mouseup.drag", null), uv(D.view, v), Ci(D), c.mouse("end", D);
  }
  function T(D, G) {
    if (n.call(this, D, G)) {
      var B = D.changedTouches, H = i.call(this, D, G), $ = B.length, tt, ot;
      for (tt = 0; tt < $; ++tt)
        (ot = _(this, H, D, G, B[tt].identifier, B[tt])) && (fd(D), ot("start", D, B[tt]));
    }
  }
  function C(D) {
    var G = D.changedTouches, B = G.length, H, $;
    for (H = 0; H < B; ++H)
      ($ = c[G[H].identifier]) && (Ci(D), $("drag", D, G[H]));
  }
  function U(D) {
    var G = D.changedTouches, B = G.length, H, $;
    for (y && clearTimeout(y), y = setTimeout(function() {
      y = null;
    }, 500), H = 0; H < B; ++H)
      ($ = c[G[H].identifier]) && (fd(D), $("end", D, G[H]));
  }
  function _(D, G, B, H, $, tt) {
    var ot = f.copy(), nt = wn(tt || B, G), ut, J, N;
    if ((N = o.call(D, new Cd("beforestart", {
      sourceEvent: B,
      target: x,
      identifier: $,
      active: d,
      x: nt[0],
      y: nt[1],
      dx: 0,
      dy: 0,
      dispatch: ot
    }), H)) != null)
      return ut = N.x - nt[0] || 0, J = N.y - nt[1] || 0, function L(O, j, Y) {
        var k = nt, et;
        switch (O) {
          case "start":
            c[$] = L, et = d++;
            break;
          case "end":
            delete c[$], --d;
          // falls through
          case "drag":
            nt = wn(Y || j, G), et = d;
            break;
        }
        ot.call(
          O,
          D,
          new Cd(O, {
            sourceEvent: j,
            subject: N,
            target: x,
            identifier: $,
            active: et,
            x: nt[0] + ut,
            y: nt[1] + J,
            dx: nt[0] - k[0],
            dy: nt[1] - k[1],
            dispatch: ot
          }),
          H
        );
      };
  }
  return x.filter = function(D) {
    return arguments.length ? (n = typeof D == "function" ? D : Br(!!D), x) : n;
  }, x.container = function(D) {
    return arguments.length ? (i = typeof D == "function" ? D : Br(D), x) : i;
  }, x.subject = function(D) {
    return arguments.length ? (o = typeof D == "function" ? D : Br(D), x) : o;
  }, x.touchable = function(D) {
    return arguments.length ? (r = typeof D == "function" ? D : Br(!!D), x) : r;
  }, x.on = function() {
    var D = f.on.apply(f, arguments);
    return D === f ? x : D;
  }, x.clickDistance = function(D) {
    return arguments.length ? (m = (D = +D) * D, x) : Math.sqrt(m);
  }, x;
}
function Zd(n, i, o) {
  n.prototype = i.prototype = o, o.constructor = n;
}
function rv(n, i) {
  var o = Object.create(n.prototype);
  for (var r in i) o[r] = i[r];
  return o;
}
function Iu() {
}
var Yu = 0.7, ts = 1 / Yu, Mi = "\\s*([+-]?\\d+)\\s*", qu = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Gn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Nw = /^#([0-9a-f]{3,8})$/, Tw = new RegExp(`^rgb\\(${Mi},${Mi},${Mi}\\)$`), Cw = new RegExp(`^rgb\\(${Gn},${Gn},${Gn}\\)$`), Mw = new RegExp(`^rgba\\(${Mi},${Mi},${Mi},${qu}\\)$`), zw = new RegExp(`^rgba\\(${Gn},${Gn},${Gn},${qu}\\)$`), Aw = new RegExp(`^hsl\\(${qu},${Gn},${Gn}\\)$`), Dw = new RegExp(`^hsla\\(${qu},${Gn},${Gn},${qu}\\)$`), Ty = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Zd(Iu, Ca, {
  copy(n) {
    return Object.assign(new this.constructor(), this, n);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Cy,
  // Deprecated! Use color.formatHex.
  formatHex: Cy,
  formatHex8: Ow,
  formatHsl: Rw,
  formatRgb: My,
  toString: My
});
function Cy() {
  return this.rgb().formatHex();
}
function Ow() {
  return this.rgb().formatHex8();
}
function Rw() {
  return sv(this).formatHsl();
}
function My() {
  return this.rgb().formatRgb();
}
function Ca(n) {
  var i, o;
  return n = (n + "").trim().toLowerCase(), (i = Nw.exec(n)) ? (o = i[1].length, i = parseInt(i[1], 16), o === 6 ? zy(i) : o === 3 ? new Qe(i >> 8 & 15 | i >> 4 & 240, i >> 4 & 15 | i & 240, (i & 15) << 4 | i & 15, 1) : o === 8 ? Lr(i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, (i & 255) / 255) : o === 4 ? Lr(i >> 12 & 15 | i >> 8 & 240, i >> 8 & 15 | i >> 4 & 240, i >> 4 & 15 | i & 240, ((i & 15) << 4 | i & 15) / 255) : null) : (i = Tw.exec(n)) ? new Qe(i[1], i[2], i[3], 1) : (i = Cw.exec(n)) ? new Qe(i[1] * 255 / 100, i[2] * 255 / 100, i[3] * 255 / 100, 1) : (i = Mw.exec(n)) ? Lr(i[1], i[2], i[3], i[4]) : (i = zw.exec(n)) ? Lr(i[1] * 255 / 100, i[2] * 255 / 100, i[3] * 255 / 100, i[4]) : (i = Aw.exec(n)) ? Oy(i[1], i[2] / 100, i[3] / 100, 1) : (i = Dw.exec(n)) ? Oy(i[1], i[2] / 100, i[3] / 100, i[4]) : Ty.hasOwnProperty(n) ? zy(Ty[n]) : n === "transparent" ? new Qe(NaN, NaN, NaN, 0) : null;
}
function zy(n) {
  return new Qe(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function Lr(n, i, o, r) {
  return r <= 0 && (n = i = o = NaN), new Qe(n, i, o, r);
}
function Hw(n) {
  return n instanceof Iu || (n = Ca(n)), n ? (n = n.rgb(), new Qe(n.r, n.g, n.b, n.opacity)) : new Qe();
}
function Md(n, i, o, r) {
  return arguments.length === 1 ? Hw(n) : new Qe(n, i, o, r ?? 1);
}
function Qe(n, i, o, r) {
  this.r = +n, this.g = +i, this.b = +o, this.opacity = +r;
}
Zd(Qe, Md, rv(Iu, {
  brighter(n) {
    return n = n == null ? ts : Math.pow(ts, n), new Qe(this.r * n, this.g * n, this.b * n, this.opacity);
  },
  darker(n) {
    return n = n == null ? Yu : Math.pow(Yu, n), new Qe(this.r * n, this.g * n, this.b * n, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Qe(Na(this.r), Na(this.g), Na(this.b), es(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ay,
  // Deprecated! Use color.formatHex.
  formatHex: Ay,
  formatHex8: jw,
  formatRgb: Dy,
  toString: Dy
}));
function Ay() {
  return `#${_a(this.r)}${_a(this.g)}${_a(this.b)}`;
}
function jw() {
  return `#${_a(this.r)}${_a(this.g)}${_a(this.b)}${_a((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Dy() {
  const n = es(this.opacity);
  return `${n === 1 ? "rgb(" : "rgba("}${Na(this.r)}, ${Na(this.g)}, ${Na(this.b)}${n === 1 ? ")" : `, ${n})`}`;
}
function es(n) {
  return isNaN(n) ? 1 : Math.max(0, Math.min(1, n));
}
function Na(n) {
  return Math.max(0, Math.min(255, Math.round(n) || 0));
}
function _a(n) {
  return n = Na(n), (n < 16 ? "0" : "") + n.toString(16);
}
function Oy(n, i, o, r) {
  return r <= 0 ? n = i = o = NaN : o <= 0 || o >= 1 ? n = i = NaN : i <= 0 && (n = NaN), new _n(n, i, o, r);
}
function sv(n) {
  if (n instanceof _n) return new _n(n.h, n.s, n.l, n.opacity);
  if (n instanceof Iu || (n = Ca(n)), !n) return new _n();
  if (n instanceof _n) return n;
  n = n.rgb();
  var i = n.r / 255, o = n.g / 255, r = n.b / 255, c = Math.min(i, o, r), f = Math.max(i, o, r), d = NaN, h = f - c, p = (f + c) / 2;
  return h ? (i === f ? d = (o - r) / h + (o < r) * 6 : o === f ? d = (r - i) / h + 2 : d = (i - o) / h + 4, h /= p < 0.5 ? f + c : 2 - f - c, d *= 60) : h = p > 0 && p < 1 ? 0 : d, new _n(d, h, p, n.opacity);
}
function Uw(n, i, o, r) {
  return arguments.length === 1 ? sv(n) : new _n(n, i, o, r ?? 1);
}
function _n(n, i, o, r) {
  this.h = +n, this.s = +i, this.l = +o, this.opacity = +r;
}
Zd(_n, Uw, rv(Iu, {
  brighter(n) {
    return n = n == null ? ts : Math.pow(ts, n), new _n(this.h, this.s, this.l * n, this.opacity);
  },
  darker(n) {
    return n = n == null ? Yu : Math.pow(Yu, n), new _n(this.h, this.s, this.l * n, this.opacity);
  },
  rgb() {
    var n = this.h % 360 + (this.h < 0) * 360, i = isNaN(n) || isNaN(this.s) ? 0 : this.s, o = this.l, r = o + (o < 0.5 ? o : 1 - o) * i, c = 2 * o - r;
    return new Qe(
      dd(n >= 240 ? n - 240 : n + 120, c, r),
      dd(n, c, r),
      dd(n < 120 ? n + 240 : n - 120, c, r),
      this.opacity
    );
  },
  clamp() {
    return new _n(Ry(this.h), Vr(this.s), Vr(this.l), es(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const n = es(this.opacity);
    return `${n === 1 ? "hsl(" : "hsla("}${Ry(this.h)}, ${Vr(this.s) * 100}%, ${Vr(this.l) * 100}%${n === 1 ? ")" : `, ${n})`}`;
  }
}));
function Ry(n) {
  return n = (n || 0) % 360, n < 0 ? n + 360 : n;
}
function Vr(n) {
  return Math.max(0, Math.min(1, n || 0));
}
function dd(n, i, o) {
  return (n < 60 ? i + (o - i) * n / 60 : n < 180 ? o : n < 240 ? i + (o - i) * (240 - n) / 60 : i) * 255;
}
const Gd = (n) => () => n;
function Bw(n, i) {
  return function(o) {
    return n + o * i;
  };
}
function Lw(n, i, o) {
  return n = Math.pow(n, o), i = Math.pow(i, o) - n, o = 1 / o, function(r) {
    return Math.pow(n + r * i, o);
  };
}
function Vw(n) {
  return (n = +n) == 1 ? cv : function(i, o) {
    return o - i ? Lw(i, o, n) : Gd(isNaN(i) ? o : i);
  };
}
function cv(n, i) {
  var o = i - n;
  return o ? Bw(n, o) : Gd(isNaN(n) ? i : n);
}
const ns = (function n(i) {
  var o = Vw(i);
  function r(c, f) {
    var d = o((c = Md(c)).r, (f = Md(f)).r), h = o(c.g, f.g), p = o(c.b, f.b), v = cv(c.opacity, f.opacity);
    return function(y) {
      return c.r = d(y), c.g = h(y), c.b = p(y), c.opacity = v(y), c + "";
    };
  }
  return r.gamma = n, r;
})(1);
function Yw(n, i) {
  i || (i = []);
  var o = n ? Math.min(i.length, n.length) : 0, r = i.slice(), c;
  return function(f) {
    for (c = 0; c < o; ++c) r[c] = n[c] * (1 - f) + i[c] * f;
    return r;
  };
}
function qw(n) {
  return ArrayBuffer.isView(n) && !(n instanceof DataView);
}
function Xw(n, i) {
  var o = i ? i.length : 0, r = n ? Math.min(o, n.length) : 0, c = new Array(r), f = new Array(o), d;
  for (d = 0; d < r; ++d) c[d] = Bu(n[d], i[d]);
  for (; d < o; ++d) f[d] = i[d];
  return function(h) {
    for (d = 0; d < r; ++d) f[d] = c[d](h);
    return f;
  };
}
function Zw(n, i) {
  var o = /* @__PURE__ */ new Date();
  return n = +n, i = +i, function(r) {
    return o.setTime(n * (1 - r) + i * r), o;
  };
}
function Zn(n, i) {
  return n = +n, i = +i, function(o) {
    return n * (1 - o) + i * o;
  };
}
function Gw(n, i) {
  var o = {}, r = {}, c;
  (n === null || typeof n != "object") && (n = {}), (i === null || typeof i != "object") && (i = {});
  for (c in i)
    c in n ? o[c] = Bu(n[c], i[c]) : r[c] = i[c];
  return function(f) {
    for (c in o) r[c] = o[c](f);
    return r;
  };
}
var zd = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, hd = new RegExp(zd.source, "g");
function Qw(n) {
  return function() {
    return n;
  };
}
function $w(n) {
  return function(i) {
    return n(i) + "";
  };
}
function fv(n, i) {
  var o = zd.lastIndex = hd.lastIndex = 0, r, c, f, d = -1, h = [], p = [];
  for (n = n + "", i = i + ""; (r = zd.exec(n)) && (c = hd.exec(i)); )
    (f = c.index) > o && (f = i.slice(o, f), h[d] ? h[d] += f : h[++d] = f), (r = r[0]) === (c = c[0]) ? h[d] ? h[d] += c : h[++d] = c : (h[++d] = null, p.push({ i: d, x: Zn(r, c) })), o = hd.lastIndex;
  return o < i.length && (f = i.slice(o), h[d] ? h[d] += f : h[++d] = f), h.length < 2 ? p[0] ? $w(p[0].x) : Qw(i) : (i = p.length, function(v) {
    for (var y = 0, m; y < i; ++y) h[(m = p[y]).i] = m.x(v);
    return h.join("");
  });
}
function Bu(n, i) {
  var o = typeof i, r;
  return i == null || o === "boolean" ? Gd(i) : (o === "number" ? Zn : o === "string" ? (r = Ca(i)) ? (i = r, ns) : fv : i instanceof Ca ? ns : i instanceof Date ? Zw : qw(i) ? Yw : Array.isArray(i) ? Xw : typeof i.valueOf != "function" && typeof i.toString != "function" || isNaN(i) ? Gw : Zn)(n, i);
}
var Hy = 180 / Math.PI, Ad = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function dv(n, i, o, r, c, f) {
  var d, h, p;
  return (d = Math.sqrt(n * n + i * i)) && (n /= d, i /= d), (p = n * o + i * r) && (o -= n * p, r -= i * p), (h = Math.sqrt(o * o + r * r)) && (o /= h, r /= h, p /= h), n * r < i * o && (n = -n, i = -i, p = -p, d = -d), {
    translateX: c,
    translateY: f,
    rotate: Math.atan2(i, n) * Hy,
    skewX: Math.atan(p) * Hy,
    scaleX: d,
    scaleY: h
  };
}
var Yr;
function Kw(n) {
  const i = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(n + "");
  return i.isIdentity ? Ad : dv(i.a, i.b, i.c, i.d, i.e, i.f);
}
function kw(n) {
  return n == null || (Yr || (Yr = document.createElementNS("http://www.w3.org/2000/svg", "g")), Yr.setAttribute("transform", n), !(n = Yr.transform.baseVal.consolidate())) ? Ad : (n = n.matrix, dv(n.a, n.b, n.c, n.d, n.e, n.f));
}
function hv(n, i, o, r) {
  function c(v) {
    return v.length ? v.pop() + " " : "";
  }
  function f(v, y, m, x, S, E) {
    if (v !== m || y !== x) {
      var z = S.push("translate(", null, i, null, o);
      E.push({ i: z - 4, x: Zn(v, m) }, { i: z - 2, x: Zn(y, x) });
    } else (m || x) && S.push("translate(" + m + i + x + o);
  }
  function d(v, y, m, x) {
    v !== y ? (v - y > 180 ? y += 360 : y - v > 180 && (v += 360), x.push({ i: m.push(c(m) + "rotate(", null, r) - 2, x: Zn(v, y) })) : y && m.push(c(m) + "rotate(" + y + r);
  }
  function h(v, y, m, x) {
    v !== y ? x.push({ i: m.push(c(m) + "skewX(", null, r) - 2, x: Zn(v, y) }) : y && m.push(c(m) + "skewX(" + y + r);
  }
  function p(v, y, m, x, S, E) {
    if (v !== m || y !== x) {
      var z = S.push(c(S) + "scale(", null, ",", null, ")");
      E.push({ i: z - 4, x: Zn(v, m) }, { i: z - 2, x: Zn(y, x) });
    } else (m !== 1 || x !== 1) && S.push(c(S) + "scale(" + m + "," + x + ")");
  }
  return function(v, y) {
    var m = [], x = [];
    return v = n(v), y = n(y), f(v.translateX, v.translateY, y.translateX, y.translateY, m, x), d(v.rotate, y.rotate, m, x), h(v.skewX, y.skewX, m, x), p(v.scaleX, v.scaleY, y.scaleX, y.scaleY, m, x), v = y = null, function(S) {
      for (var E = -1, z = x.length, T; ++E < z; ) m[(T = x[E]).i] = T.x(S);
      return m.join("");
    };
  };
}
var Jw = hv(Kw, "px, ", "px)", "deg)"), Iw = hv(kw, ", ", ")", ")"), Fw = 1e-12;
function jy(n) {
  return ((n = Math.exp(n)) + 1 / n) / 2;
}
function Ww(n) {
  return ((n = Math.exp(n)) - 1 / n) / 2;
}
function Pw(n) {
  return ((n = Math.exp(2 * n)) - 1) / (n + 1);
}
const Jr = (function n(i, o, r) {
  function c(f, d) {
    var h = f[0], p = f[1], v = f[2], y = d[0], m = d[1], x = d[2], S = y - h, E = m - p, z = S * S + E * E, T, C;
    if (z < Fw)
      C = Math.log(x / v) / i, T = function(H) {
        return [
          h + H * S,
          p + H * E,
          v * Math.exp(i * H * C)
        ];
      };
    else {
      var U = Math.sqrt(z), _ = (x * x - v * v + r * z) / (2 * v * o * U), D = (x * x - v * v - r * z) / (2 * x * o * U), G = Math.log(Math.sqrt(_ * _ + 1) - _), B = Math.log(Math.sqrt(D * D + 1) - D);
      C = (B - G) / i, T = function(H) {
        var $ = H * C, tt = jy(G), ot = v / (o * U) * (tt * Pw(i * $ + G) - Ww(G));
        return [
          h + ot * S,
          p + ot * E,
          v * tt / jy(i * $ + G)
        ];
      };
    }
    return T.duration = C * 1e3 * i / Math.SQRT2, T;
  }
  return c.rho = function(f) {
    var d = Math.max(1e-3, +f), h = d * d, p = h * h;
    return n(d, h, p);
  }, c;
})(Math.SQRT2, 2, 4);
var Ai = 0, Hu = 0, Ou = 0, gv = 1e3, ls, ju, as = 0, Ma = 0, gs = 0, Xu = typeof performance == "object" && performance.now ? performance : Date, mv = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(n) {
  setTimeout(n, 17);
};
function Qd() {
  return Ma || (mv(t_), Ma = Xu.now() + gs);
}
function t_() {
  Ma = 0;
}
function is() {
  this._call = this._time = this._next = null;
}
is.prototype = yv.prototype = {
  constructor: is,
  restart: function(n, i, o) {
    if (typeof n != "function") throw new TypeError("callback is not a function");
    o = (o == null ? Qd() : +o) + (i == null ? 0 : +i), !this._next && ju !== this && (ju ? ju._next = this : ls = this, ju = this), this._call = n, this._time = o, Dd();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Dd());
  }
};
function yv(n, i, o) {
  var r = new is();
  return r.restart(n, i, o), r;
}
function e_() {
  Qd(), ++Ai;
  for (var n = ls, i; n; )
    (i = Ma - n._time) >= 0 && n._call.call(void 0, i), n = n._next;
  --Ai;
}
function Uy() {
  Ma = (as = Xu.now()) + gs, Ai = Hu = 0;
  try {
    e_();
  } finally {
    Ai = 0, l_(), Ma = 0;
  }
}
function n_() {
  var n = Xu.now(), i = n - as;
  i > gv && (gs -= i, as = n);
}
function l_() {
  for (var n, i = ls, o, r = 1 / 0; i; )
    i._call ? (r > i._time && (r = i._time), n = i, i = i._next) : (o = i._next, i._next = null, i = n ? n._next = o : ls = o);
  ju = n, Dd(r);
}
function Dd(n) {
  if (!Ai) {
    Hu && (Hu = clearTimeout(Hu));
    var i = n - Ma;
    i > 24 ? (n < 1 / 0 && (Hu = setTimeout(Uy, n - Xu.now() - gs)), Ou && (Ou = clearInterval(Ou))) : (Ou || (as = Xu.now(), Ou = setInterval(n_, gv)), Ai = 1, mv(Uy));
  }
}
function By(n, i, o) {
  var r = new is();
  return i = i == null ? 0 : +i, r.restart((c) => {
    r.stop(), n(c + i);
  }, i, o), r;
}
var a_ = ds("start", "end", "cancel", "interrupt"), i_ = [], pv = 0, Ly = 1, Od = 2, Ir = 3, Vy = 4, Rd = 5, Fr = 6;
function ms(n, i, o, r, c, f) {
  var d = n.__transition;
  if (!d) n.__transition = {};
  else if (o in d) return;
  u_(n, o, {
    name: i,
    index: r,
    // For context during callback.
    group: c,
    // For context during callback.
    on: a_,
    tween: i_,
    time: f.time,
    delay: f.delay,
    duration: f.duration,
    ease: f.ease,
    timer: null,
    state: pv
  });
}
function $d(n, i) {
  var o = Mn(n, i);
  if (o.state > pv) throw new Error("too late; already scheduled");
  return o;
}
function Qn(n, i) {
  var o = Mn(n, i);
  if (o.state > Ir) throw new Error("too late; already running");
  return o;
}
function Mn(n, i) {
  var o = n.__transition;
  if (!o || !(o = o[i])) throw new Error("transition not found");
  return o;
}
function u_(n, i, o) {
  var r = n.__transition, c;
  r[i] = o, o.timer = yv(f, 0, o.time);
  function f(v) {
    o.state = Ly, o.timer.restart(d, o.delay, o.time), o.delay <= v && d(v - o.delay);
  }
  function d(v) {
    var y, m, x, S;
    if (o.state !== Ly) return p();
    for (y in r)
      if (S = r[y], S.name === o.name) {
        if (S.state === Ir) return By(d);
        S.state === Vy ? (S.state = Fr, S.timer.stop(), S.on.call("interrupt", n, n.__data__, S.index, S.group), delete r[y]) : +y < i && (S.state = Fr, S.timer.stop(), S.on.call("cancel", n, n.__data__, S.index, S.group), delete r[y]);
      }
    if (By(function() {
      o.state === Ir && (o.state = Vy, o.timer.restart(h, o.delay, o.time), h(v));
    }), o.state = Od, o.on.call("start", n, n.__data__, o.index, o.group), o.state === Od) {
      for (o.state = Ir, c = new Array(x = o.tween.length), y = 0, m = -1; y < x; ++y)
        (S = o.tween[y].value.call(n, n.__data__, o.index, o.group)) && (c[++m] = S);
      c.length = m + 1;
    }
  }
  function h(v) {
    for (var y = v < o.duration ? o.ease.call(null, v / o.duration) : (o.timer.restart(p), o.state = Rd, 1), m = -1, x = c.length; ++m < x; )
      c[m].call(n, y);
    o.state === Rd && (o.on.call("end", n, n.__data__, o.index, o.group), p());
  }
  function p() {
    o.state = Fr, o.timer.stop(), delete r[i];
    for (var v in r) return;
    delete n.__transition;
  }
}
function Wr(n, i) {
  var o = n.__transition, r, c, f = !0, d;
  if (o) {
    i = i == null ? null : i + "";
    for (d in o) {
      if ((r = o[d]).name !== i) {
        f = !1;
        continue;
      }
      c = r.state > Od && r.state < Rd, r.state = Fr, r.timer.stop(), r.on.call(c ? "interrupt" : "cancel", n, n.__data__, r.index, r.group), delete o[d];
    }
    f && delete n.__transition;
  }
}
function o_(n) {
  return this.each(function() {
    Wr(this, n);
  });
}
function r_(n, i) {
  var o, r;
  return function() {
    var c = Qn(this, n), f = c.tween;
    if (f !== o) {
      r = o = f;
      for (var d = 0, h = r.length; d < h; ++d)
        if (r[d].name === i) {
          r = r.slice(), r.splice(d, 1);
          break;
        }
    }
    c.tween = r;
  };
}
function s_(n, i, o) {
  var r, c;
  if (typeof o != "function") throw new Error();
  return function() {
    var f = Qn(this, n), d = f.tween;
    if (d !== r) {
      c = (r = d).slice();
      for (var h = { name: i, value: o }, p = 0, v = c.length; p < v; ++p)
        if (c[p].name === i) {
          c[p] = h;
          break;
        }
      p === v && c.push(h);
    }
    f.tween = c;
  };
}
function c_(n, i) {
  var o = this._id;
  if (n += "", arguments.length < 2) {
    for (var r = Mn(this.node(), o).tween, c = 0, f = r.length, d; c < f; ++c)
      if ((d = r[c]).name === n)
        return d.value;
    return null;
  }
  return this.each((i == null ? r_ : s_)(o, n, i));
}
function Kd(n, i, o) {
  var r = n._id;
  return n.each(function() {
    var c = Qn(this, r);
    (c.value || (c.value = {}))[i] = o.apply(this, arguments);
  }), function(c) {
    return Mn(c, r).value[i];
  };
}
function vv(n, i) {
  var o;
  return (typeof i == "number" ? Zn : i instanceof Ca ? ns : (o = Ca(i)) ? (i = o, ns) : fv)(n, i);
}
function f_(n) {
  return function() {
    this.removeAttribute(n);
  };
}
function d_(n) {
  return function() {
    this.removeAttributeNS(n.space, n.local);
  };
}
function h_(n, i, o) {
  var r, c = o + "", f;
  return function() {
    var d = this.getAttribute(n);
    return d === c ? null : d === r ? f : f = i(r = d, o);
  };
}
function g_(n, i, o) {
  var r, c = o + "", f;
  return function() {
    var d = this.getAttributeNS(n.space, n.local);
    return d === c ? null : d === r ? f : f = i(r = d, o);
  };
}
function m_(n, i, o) {
  var r, c, f;
  return function() {
    var d, h = o(this), p;
    return h == null ? void this.removeAttribute(n) : (d = this.getAttribute(n), p = h + "", d === p ? null : d === r && p === c ? f : (c = p, f = i(r = d, h)));
  };
}
function y_(n, i, o) {
  var r, c, f;
  return function() {
    var d, h = o(this), p;
    return h == null ? void this.removeAttributeNS(n.space, n.local) : (d = this.getAttributeNS(n.space, n.local), p = h + "", d === p ? null : d === r && p === c ? f : (c = p, f = i(r = d, h)));
  };
}
function p_(n, i) {
  var o = hs(n), r = o === "transform" ? Iw : vv;
  return this.attrTween(n, typeof i == "function" ? (o.local ? y_ : m_)(o, r, Kd(this, "attr." + n, i)) : i == null ? (o.local ? d_ : f_)(o) : (o.local ? g_ : h_)(o, r, i));
}
function v_(n, i) {
  return function(o) {
    this.setAttribute(n, i.call(this, o));
  };
}
function x_(n, i) {
  return function(o) {
    this.setAttributeNS(n.space, n.local, i.call(this, o));
  };
}
function b_(n, i) {
  var o, r;
  function c() {
    var f = i.apply(this, arguments);
    return f !== r && (o = (r = f) && x_(n, f)), o;
  }
  return c._value = i, c;
}
function S_(n, i) {
  var o, r;
  function c() {
    var f = i.apply(this, arguments);
    return f !== r && (o = (r = f) && v_(n, f)), o;
  }
  return c._value = i, c;
}
function E_(n, i) {
  var o = "attr." + n;
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (i == null) return this.tween(o, null);
  if (typeof i != "function") throw new Error();
  var r = hs(n);
  return this.tween(o, (r.local ? b_ : S_)(r, i));
}
function w_(n, i) {
  return function() {
    $d(this, n).delay = +i.apply(this, arguments);
  };
}
function __(n, i) {
  return i = +i, function() {
    $d(this, n).delay = i;
  };
}
function N_(n) {
  var i = this._id;
  return arguments.length ? this.each((typeof n == "function" ? w_ : __)(i, n)) : Mn(this.node(), i).delay;
}
function T_(n, i) {
  return function() {
    Qn(this, n).duration = +i.apply(this, arguments);
  };
}
function C_(n, i) {
  return i = +i, function() {
    Qn(this, n).duration = i;
  };
}
function M_(n) {
  var i = this._id;
  return arguments.length ? this.each((typeof n == "function" ? T_ : C_)(i, n)) : Mn(this.node(), i).duration;
}
function z_(n, i) {
  if (typeof i != "function") throw new Error();
  return function() {
    Qn(this, n).ease = i;
  };
}
function A_(n) {
  var i = this._id;
  return arguments.length ? this.each(z_(i, n)) : Mn(this.node(), i).ease;
}
function D_(n, i) {
  return function() {
    var o = i.apply(this, arguments);
    if (typeof o != "function") throw new Error();
    Qn(this, n).ease = o;
  };
}
function O_(n) {
  if (typeof n != "function") throw new Error();
  return this.each(D_(this._id, n));
}
function R_(n) {
  typeof n != "function" && (n = Jp(n));
  for (var i = this._groups, o = i.length, r = new Array(o), c = 0; c < o; ++c)
    for (var f = i[c], d = f.length, h = r[c] = [], p, v = 0; v < d; ++v)
      (p = f[v]) && n.call(p, p.__data__, v, f) && h.push(p);
  return new hl(r, this._parents, this._name, this._id);
}
function H_(n) {
  if (n._id !== this._id) throw new Error();
  for (var i = this._groups, o = n._groups, r = i.length, c = o.length, f = Math.min(r, c), d = new Array(r), h = 0; h < f; ++h)
    for (var p = i[h], v = o[h], y = p.length, m = d[h] = new Array(y), x, S = 0; S < y; ++S)
      (x = p[S] || v[S]) && (m[S] = x);
  for (; h < r; ++h)
    d[h] = i[h];
  return new hl(d, this._parents, this._name, this._id);
}
function j_(n) {
  return (n + "").trim().split(/^|\s+/).every(function(i) {
    var o = i.indexOf(".");
    return o >= 0 && (i = i.slice(0, o)), !i || i === "start";
  });
}
function U_(n, i, o) {
  var r, c, f = j_(i) ? $d : Qn;
  return function() {
    var d = f(this, n), h = d.on;
    h !== r && (c = (r = h).copy()).on(i, o), d.on = c;
  };
}
function B_(n, i) {
  var o = this._id;
  return arguments.length < 2 ? Mn(this.node(), o).on.on(n) : this.each(U_(o, n, i));
}
function L_(n) {
  return function() {
    var i = this.parentNode;
    for (var o in this.__transition) if (+o !== n) return;
    i && i.removeChild(this);
  };
}
function V_() {
  return this.on("end.remove", L_(this._id));
}
function Y_(n) {
  var i = this._name, o = this._id;
  typeof n != "function" && (n = qd(n));
  for (var r = this._groups, c = r.length, f = new Array(c), d = 0; d < c; ++d)
    for (var h = r[d], p = h.length, v = f[d] = new Array(p), y, m, x = 0; x < p; ++x)
      (y = h[x]) && (m = n.call(y, y.__data__, x, h)) && ("__data__" in y && (m.__data__ = y.__data__), v[x] = m, ms(v[x], i, o, x, v, Mn(y, o)));
  return new hl(f, this._parents, i, o);
}
function q_(n) {
  var i = this._name, o = this._id;
  typeof n != "function" && (n = kp(n));
  for (var r = this._groups, c = r.length, f = [], d = [], h = 0; h < c; ++h)
    for (var p = r[h], v = p.length, y, m = 0; m < v; ++m)
      if (y = p[m]) {
        for (var x = n.call(y, y.__data__, m, p), S, E = Mn(y, o), z = 0, T = x.length; z < T; ++z)
          (S = x[z]) && ms(S, i, o, z, x, E);
        f.push(x), d.push(y);
      }
  return new hl(f, d, i, o);
}
var X_ = Ju.prototype.constructor;
function Z_() {
  return new X_(this._groups, this._parents);
}
function G_(n, i) {
  var o, r, c;
  return function() {
    var f = zi(this, n), d = (this.style.removeProperty(n), zi(this, n));
    return f === d ? null : f === o && d === r ? c : c = i(o = f, r = d);
  };
}
function xv(n) {
  return function() {
    this.style.removeProperty(n);
  };
}
function Q_(n, i, o) {
  var r, c = o + "", f;
  return function() {
    var d = zi(this, n);
    return d === c ? null : d === r ? f : f = i(r = d, o);
  };
}
function $_(n, i, o) {
  var r, c, f;
  return function() {
    var d = zi(this, n), h = o(this), p = h + "";
    return h == null && (p = h = (this.style.removeProperty(n), zi(this, n))), d === p ? null : d === r && p === c ? f : (c = p, f = i(r = d, h));
  };
}
function K_(n, i) {
  var o, r, c, f = "style." + i, d = "end." + f, h;
  return function() {
    var p = Qn(this, n), v = p.on, y = p.value[f] == null ? h || (h = xv(i)) : void 0;
    (v !== o || c !== y) && (r = (o = v).copy()).on(d, c = y), p.on = r;
  };
}
function k_(n, i, o) {
  var r = (n += "") == "transform" ? Jw : vv;
  return i == null ? this.styleTween(n, G_(n, r)).on("end.style." + n, xv(n)) : typeof i == "function" ? this.styleTween(n, $_(n, r, Kd(this, "style." + n, i))).each(K_(this._id, n)) : this.styleTween(n, Q_(n, r, i), o).on("end.style." + n, null);
}
function J_(n, i, o) {
  return function(r) {
    this.style.setProperty(n, i.call(this, r), o);
  };
}
function I_(n, i, o) {
  var r, c;
  function f() {
    var d = i.apply(this, arguments);
    return d !== c && (r = (c = d) && J_(n, d, o)), r;
  }
  return f._value = i, f;
}
function F_(n, i, o) {
  var r = "style." + (n += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (i == null) return this.tween(r, null);
  if (typeof i != "function") throw new Error();
  return this.tween(r, I_(n, i, o ?? ""));
}
function W_(n) {
  return function() {
    this.textContent = n;
  };
}
function P_(n) {
  return function() {
    var i = n(this);
    this.textContent = i ?? "";
  };
}
function t2(n) {
  return this.tween("text", typeof n == "function" ? P_(Kd(this, "text", n)) : W_(n == null ? "" : n + ""));
}
function e2(n) {
  return function(i) {
    this.textContent = n.call(this, i);
  };
}
function n2(n) {
  var i, o;
  function r() {
    var c = n.apply(this, arguments);
    return c !== o && (i = (o = c) && e2(c)), i;
  }
  return r._value = n, r;
}
function l2(n) {
  var i = "text";
  if (arguments.length < 1) return (i = this.tween(i)) && i._value;
  if (n == null) return this.tween(i, null);
  if (typeof n != "function") throw new Error();
  return this.tween(i, n2(n));
}
function a2() {
  for (var n = this._name, i = this._id, o = bv(), r = this._groups, c = r.length, f = 0; f < c; ++f)
    for (var d = r[f], h = d.length, p, v = 0; v < h; ++v)
      if (p = d[v]) {
        var y = Mn(p, i);
        ms(p, n, o, v, d, {
          time: y.time + y.delay + y.duration,
          delay: 0,
          duration: y.duration,
          ease: y.ease
        });
      }
  return new hl(r, this._parents, n, o);
}
function i2() {
  var n, i, o = this, r = o._id, c = o.size();
  return new Promise(function(f, d) {
    var h = { value: d }, p = { value: function() {
      --c === 0 && f();
    } };
    o.each(function() {
      var v = Qn(this, r), y = v.on;
      y !== n && (i = (n = y).copy(), i._.cancel.push(h), i._.interrupt.push(h), i._.end.push(p)), v.on = i;
    }), c === 0 && f();
  });
}
var u2 = 0;
function hl(n, i, o, r) {
  this._groups = n, this._parents = i, this._name = o, this._id = r;
}
function bv() {
  return ++u2;
}
var cl = Ju.prototype;
hl.prototype = {
  constructor: hl,
  select: Y_,
  selectAll: q_,
  selectChild: cl.selectChild,
  selectChildren: cl.selectChildren,
  filter: R_,
  merge: H_,
  selection: Z_,
  transition: a2,
  call: cl.call,
  nodes: cl.nodes,
  node: cl.node,
  size: cl.size,
  empty: cl.empty,
  each: cl.each,
  on: B_,
  attr: p_,
  attrTween: E_,
  style: k_,
  styleTween: F_,
  text: t2,
  textTween: l2,
  remove: V_,
  tween: c_,
  delay: N_,
  duration: M_,
  ease: A_,
  easeVarying: O_,
  end: i2,
  [Symbol.iterator]: cl[Symbol.iterator]
};
function o2(n) {
  return ((n *= 2) <= 1 ? n * n * n : (n -= 2) * n * n + 2) / 2;
}
var r2 = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: o2
};
function s2(n, i) {
  for (var o; !(o = n.__transition) || !(o = o[i]); )
    if (!(n = n.parentNode))
      throw new Error(`transition ${i} not found`);
  return o;
}
function c2(n) {
  var i, o;
  n instanceof hl ? (i = n._id, n = n._name) : (i = bv(), (o = r2).time = Qd(), n = n == null ? null : n + "");
  for (var r = this._groups, c = r.length, f = 0; f < c; ++f)
    for (var d = r[f], h = d.length, p, v = 0; v < h; ++v)
      (p = d[v]) && ms(p, n, i, v, d, o || s2(p, i));
  return new hl(r, this._parents, n, i);
}
Ju.prototype.interrupt = o_;
Ju.prototype.transition = c2;
const qr = (n) => () => n;
function f2(n, {
  sourceEvent: i,
  target: o,
  transform: r,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: n, enumerable: !0, configurable: !0 },
    sourceEvent: { value: i, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
function fl(n, i, o) {
  this.k = n, this.x = i, this.y = o;
}
fl.prototype = {
  constructor: fl,
  scale: function(n) {
    return n === 1 ? this : new fl(this.k * n, this.x, this.y);
  },
  translate: function(n, i) {
    return n === 0 & i === 0 ? this : new fl(this.k, this.x + this.k * n, this.y + this.k * i);
  },
  apply: function(n) {
    return [n[0] * this.k + this.x, n[1] * this.k + this.y];
  },
  applyX: function(n) {
    return n * this.k + this.x;
  },
  applyY: function(n) {
    return n * this.k + this.y;
  },
  invert: function(n) {
    return [(n[0] - this.x) / this.k, (n[1] - this.y) / this.k];
  },
  invertX: function(n) {
    return (n - this.x) / this.k;
  },
  invertY: function(n) {
    return (n - this.y) / this.k;
  },
  rescaleX: function(n) {
    return n.copy().domain(n.range().map(this.invertX, this).map(n.invert, n));
  },
  rescaleY: function(n) {
    return n.copy().domain(n.range().map(this.invertY, this).map(n.invert, n));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var ys = new fl(1, 0, 0);
Sv.prototype = fl.prototype;
function Sv(n) {
  for (; !n.__zoom; ) if (!(n = n.parentNode)) return ys;
  return n.__zoom;
}
function gd(n) {
  n.stopImmediatePropagation();
}
function Ru(n) {
  n.preventDefault(), n.stopImmediatePropagation();
}
function d2(n) {
  return (!n.ctrlKey || n.type === "wheel") && !n.button;
}
function h2() {
  var n = this;
  return n instanceof SVGElement ? (n = n.ownerSVGElement || n, n.hasAttribute("viewBox") ? (n = n.viewBox.baseVal, [[n.x, n.y], [n.x + n.width, n.y + n.height]]) : [[0, 0], [n.width.baseVal.value, n.height.baseVal.value]]) : [[0, 0], [n.clientWidth, n.clientHeight]];
}
function Yy() {
  return this.__zoom || ys;
}
function g2(n) {
  return -n.deltaY * (n.deltaMode === 1 ? 0.05 : n.deltaMode ? 1 : 2e-3) * (n.ctrlKey ? 10 : 1);
}
function m2() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function y2(n, i, o) {
  var r = n.invertX(i[0][0]) - o[0][0], c = n.invertX(i[1][0]) - o[1][0], f = n.invertY(i[0][1]) - o[0][1], d = n.invertY(i[1][1]) - o[1][1];
  return n.translate(
    c > r ? (r + c) / 2 : Math.min(0, r) || Math.max(0, c),
    d > f ? (f + d) / 2 : Math.min(0, f) || Math.max(0, d)
  );
}
function Ev() {
  var n = d2, i = h2, o = y2, r = g2, c = m2, f = [0, 1 / 0], d = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], h = 250, p = Jr, v = ds("start", "zoom", "end"), y, m, x, S = 500, E = 150, z = 0, T = 10;
  function C(N) {
    N.property("__zoom", Yy).on("wheel.zoom", $, { passive: !1 }).on("mousedown.zoom", tt).on("dblclick.zoom", ot).filter(c).on("touchstart.zoom", nt).on("touchmove.zoom", ut).on("touchend.zoom touchcancel.zoom", J).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  C.transform = function(N, L, O, j) {
    var Y = N.selection ? N.selection() : N;
    Y.property("__zoom", Yy), N !== Y ? G(N, L, O, j) : Y.interrupt().each(function() {
      B(this, arguments).event(j).start().zoom(null, typeof L == "function" ? L.apply(this, arguments) : L).end();
    });
  }, C.scaleBy = function(N, L, O, j) {
    C.scaleTo(N, function() {
      var Y = this.__zoom.k, k = typeof L == "function" ? L.apply(this, arguments) : L;
      return Y * k;
    }, O, j);
  }, C.scaleTo = function(N, L, O, j) {
    C.transform(N, function() {
      var Y = i.apply(this, arguments), k = this.__zoom, et = O == null ? D(Y) : typeof O == "function" ? O.apply(this, arguments) : O, lt = k.invert(et), dt = typeof L == "function" ? L.apply(this, arguments) : L;
      return o(_(U(k, dt), et, lt), Y, d);
    }, O, j);
  }, C.translateBy = function(N, L, O, j) {
    C.transform(N, function() {
      return o(this.__zoom.translate(
        typeof L == "function" ? L.apply(this, arguments) : L,
        typeof O == "function" ? O.apply(this, arguments) : O
      ), i.apply(this, arguments), d);
    }, null, j);
  }, C.translateTo = function(N, L, O, j, Y) {
    C.transform(N, function() {
      var k = i.apply(this, arguments), et = this.__zoom, lt = j == null ? D(k) : typeof j == "function" ? j.apply(this, arguments) : j;
      return o(ys.translate(lt[0], lt[1]).scale(et.k).translate(
        typeof L == "function" ? -L.apply(this, arguments) : -L,
        typeof O == "function" ? -O.apply(this, arguments) : -O
      ), k, d);
    }, j, Y);
  };
  function U(N, L) {
    return L = Math.max(f[0], Math.min(f[1], L)), L === N.k ? N : new fl(L, N.x, N.y);
  }
  function _(N, L, O) {
    var j = L[0] - O[0] * N.k, Y = L[1] - O[1] * N.k;
    return j === N.x && Y === N.y ? N : new fl(N.k, j, Y);
  }
  function D(N) {
    return [(+N[0][0] + +N[1][0]) / 2, (+N[0][1] + +N[1][1]) / 2];
  }
  function G(N, L, O, j) {
    N.on("start.zoom", function() {
      B(this, arguments).event(j).start();
    }).on("interrupt.zoom end.zoom", function() {
      B(this, arguments).event(j).end();
    }).tween("zoom", function() {
      var Y = this, k = arguments, et = B(Y, k).event(j), lt = i.apply(Y, k), dt = O == null ? D(lt) : typeof O == "function" ? O.apply(Y, k) : O, xt = Math.max(lt[1][0] - lt[0][0], lt[1][1] - lt[0][1]), M = Y.__zoom, F = typeof L == "function" ? L.apply(Y, k) : L, ht = p(M.invert(dt).concat(xt / M.k), F.invert(dt).concat(xt / F.k));
      return function(rt) {
        if (rt === 1) rt = F;
        else {
          var W = ht(rt), ft = xt / W[2];
          rt = new fl(ft, dt[0] - W[0] * ft, dt[1] - W[1] * ft);
        }
        et.zoom(null, rt);
      };
    });
  }
  function B(N, L, O) {
    return !O && N.__zooming || new H(N, L);
  }
  function H(N, L) {
    this.that = N, this.args = L, this.active = 0, this.sourceEvent = null, this.extent = i.apply(N, L), this.taps = 0;
  }
  H.prototype = {
    event: function(N) {
      return N && (this.sourceEvent = N), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(N, L) {
      return this.mouse && N !== "mouse" && (this.mouse[1] = L.invert(this.mouse[0])), this.touch0 && N !== "touch" && (this.touch0[1] = L.invert(this.touch0[0])), this.touch1 && N !== "touch" && (this.touch1[1] = L.invert(this.touch1[0])), this.that.__zoom = L, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(N) {
      var L = nn(this.that).datum();
      v.call(
        N,
        this.that,
        new f2(N, {
          sourceEvent: this.sourceEvent,
          target: C,
          transform: this.that.__zoom,
          dispatch: v
        }),
        L
      );
    }
  };
  function $(N, ...L) {
    if (!n.apply(this, arguments)) return;
    var O = B(this, L).event(N), j = this.__zoom, Y = Math.max(f[0], Math.min(f[1], j.k * Math.pow(2, r.apply(this, arguments)))), k = wn(N);
    if (O.wheel)
      (O.mouse[0][0] !== k[0] || O.mouse[0][1] !== k[1]) && (O.mouse[1] = j.invert(O.mouse[0] = k)), clearTimeout(O.wheel);
    else {
      if (j.k === Y) return;
      O.mouse = [k, j.invert(k)], Wr(this), O.start();
    }
    Ru(N), O.wheel = setTimeout(et, E), O.zoom("mouse", o(_(U(j, Y), O.mouse[0], O.mouse[1]), O.extent, d));
    function et() {
      O.wheel = null, O.end();
    }
  }
  function tt(N, ...L) {
    if (x || !n.apply(this, arguments)) return;
    var O = N.currentTarget, j = B(this, L, !0).event(N), Y = nn(N.view).on("mousemove.zoom", dt, !0).on("mouseup.zoom", xt, !0), k = wn(N, O), et = N.clientX, lt = N.clientY;
    iv(N.view), gd(N), j.mouse = [k, this.__zoom.invert(k)], Wr(this), j.start();
    function dt(M) {
      if (Ru(M), !j.moved) {
        var F = M.clientX - et, ht = M.clientY - lt;
        j.moved = F * F + ht * ht > z;
      }
      j.event(M).zoom("mouse", o(_(j.that.__zoom, j.mouse[0] = wn(M, O), j.mouse[1]), j.extent, d));
    }
    function xt(M) {
      Y.on("mousemove.zoom mouseup.zoom", null), uv(M.view, j.moved), Ru(M), j.event(M).end();
    }
  }
  function ot(N, ...L) {
    if (n.apply(this, arguments)) {
      var O = this.__zoom, j = wn(N.changedTouches ? N.changedTouches[0] : N, this), Y = O.invert(j), k = O.k * (N.shiftKey ? 0.5 : 2), et = o(_(U(O, k), j, Y), i.apply(this, L), d);
      Ru(N), h > 0 ? nn(this).transition().duration(h).call(G, et, j, N) : nn(this).call(C.transform, et, j, N);
    }
  }
  function nt(N, ...L) {
    if (n.apply(this, arguments)) {
      var O = N.touches, j = O.length, Y = B(this, L, N.changedTouches.length === j).event(N), k, et, lt, dt;
      for (gd(N), et = 0; et < j; ++et)
        lt = O[et], dt = wn(lt, this), dt = [dt, this.__zoom.invert(dt), lt.identifier], Y.touch0 ? !Y.touch1 && Y.touch0[2] !== dt[2] && (Y.touch1 = dt, Y.taps = 0) : (Y.touch0 = dt, k = !0, Y.taps = 1 + !!y);
      y && (y = clearTimeout(y)), k && (Y.taps < 2 && (m = dt[0], y = setTimeout(function() {
        y = null;
      }, S)), Wr(this), Y.start());
    }
  }
  function ut(N, ...L) {
    if (this.__zooming) {
      var O = B(this, L).event(N), j = N.changedTouches, Y = j.length, k, et, lt, dt;
      for (Ru(N), k = 0; k < Y; ++k)
        et = j[k], lt = wn(et, this), O.touch0 && O.touch0[2] === et.identifier ? O.touch0[0] = lt : O.touch1 && O.touch1[2] === et.identifier && (O.touch1[0] = lt);
      if (et = O.that.__zoom, O.touch1) {
        var xt = O.touch0[0], M = O.touch0[1], F = O.touch1[0], ht = O.touch1[1], rt = (rt = F[0] - xt[0]) * rt + (rt = F[1] - xt[1]) * rt, W = (W = ht[0] - M[0]) * W + (W = ht[1] - M[1]) * W;
        et = U(et, Math.sqrt(rt / W)), lt = [(xt[0] + F[0]) / 2, (xt[1] + F[1]) / 2], dt = [(M[0] + ht[0]) / 2, (M[1] + ht[1]) / 2];
      } else if (O.touch0) lt = O.touch0[0], dt = O.touch0[1];
      else return;
      O.zoom("touch", o(_(et, lt, dt), O.extent, d));
    }
  }
  function J(N, ...L) {
    if (this.__zooming) {
      var O = B(this, L).event(N), j = N.changedTouches, Y = j.length, k, et;
      for (gd(N), x && clearTimeout(x), x = setTimeout(function() {
        x = null;
      }, S), k = 0; k < Y; ++k)
        et = j[k], O.touch0 && O.touch0[2] === et.identifier ? delete O.touch0 : O.touch1 && O.touch1[2] === et.identifier && delete O.touch1;
      if (O.touch1 && !O.touch0 && (O.touch0 = O.touch1, delete O.touch1), O.touch0) O.touch0[1] = this.__zoom.invert(O.touch0[0]);
      else if (O.end(), O.taps === 2 && (et = wn(et, this), Math.hypot(m[0] - et[0], m[1] - et[1]) < T)) {
        var lt = nn(this).on("dblclick.zoom");
        lt && lt.apply(this, arguments);
      }
    }
  }
  return C.wheelDelta = function(N) {
    return arguments.length ? (r = typeof N == "function" ? N : qr(+N), C) : r;
  }, C.filter = function(N) {
    return arguments.length ? (n = typeof N == "function" ? N : qr(!!N), C) : n;
  }, C.touchable = function(N) {
    return arguments.length ? (c = typeof N == "function" ? N : qr(!!N), C) : c;
  }, C.extent = function(N) {
    return arguments.length ? (i = typeof N == "function" ? N : qr([[+N[0][0], +N[0][1]], [+N[1][0], +N[1][1]]]), C) : i;
  }, C.scaleExtent = function(N) {
    return arguments.length ? (f[0] = +N[0], f[1] = +N[1], C) : [f[0], f[1]];
  }, C.translateExtent = function(N) {
    return arguments.length ? (d[0][0] = +N[0][0], d[1][0] = +N[1][0], d[0][1] = +N[0][1], d[1][1] = +N[1][1], C) : [[d[0][0], d[0][1]], [d[1][0], d[1][1]]];
  }, C.constrain = function(N) {
    return arguments.length ? (o = N, C) : o;
  }, C.duration = function(N) {
    return arguments.length ? (h = +N, C) : h;
  }, C.interpolate = function(N) {
    return arguments.length ? (p = N, C) : p;
  }, C.on = function() {
    var N = v.on.apply(v, arguments);
    return N === v ? C : N;
  }, C.clickDistance = function(N) {
    return arguments.length ? (z = (N = +N) * N, C) : Math.sqrt(z);
  }, C.tapDistance = function(N) {
    return arguments.length ? (T = +N, C) : T;
  }, C;
}
const Cn = {
  error001: (n = "react") => `Seems like you have not used ${n === "svelte" ? "SvelteFlowProvider" : "ReactFlowProvider"} as an ancestor. Help: https://${n}flow.dev/error#001`,
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (n) => `Node type "${n}" not found. Using fallback type "default".`,
  error004: () => "The parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (n) => `The old edge with id=${n} does not exist.`,
  error009: (n) => `Marker type "${n}" doesn't exist.`,
  error008: (n, { id: i, sourceHandle: o, targetHandle: r }) => `Couldn't create edge for ${n} handle id: "${n === "source" ? o : r}", edge id: ${i}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (n) => `Edge type "${n}" not found. Using fallback type "default".`,
  error012: (n) => `Node with id "${n}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (n = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${n}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",
  error016: (n) => `Edge with id "${n}" does not exist, it may have been removed. This can happen when an edge is deleted before the "onEdgeClick" handler is called.`
}, Zu = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], wv = ["Enter", " ", "Escape"], _v = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: n, x: i, y: o }) => `Moved selected node ${n}. New position, x: ${i}, y: ${o}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var Di;
(function(n) {
  n.Strict = "strict", n.Loose = "loose";
})(Di || (Di = {}));
var Ta;
(function(n) {
  n.Free = "free", n.Vertical = "vertical", n.Horizontal = "horizontal";
})(Ta || (Ta = {}));
var Gu;
(function(n) {
  n.Partial = "partial", n.Full = "full";
})(Gu || (Gu = {}));
const Nv = {
  inProgress: !1,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var $l;
(function(n) {
  n.Bezier = "default", n.Straight = "straight", n.Step = "step", n.SmoothStep = "smoothstep", n.SimpleBezier = "simplebezier";
})($l || ($l = {}));
var us;
(function(n) {
  n.Arrow = "arrow", n.ArrowClosed = "arrowclosed";
})(us || (us = {}));
var wt;
(function(n) {
  n.Left = "left", n.Top = "top", n.Right = "right", n.Bottom = "bottom";
})(wt || (wt = {}));
const qy = {
  [wt.Left]: wt.Right,
  [wt.Right]: wt.Left,
  [wt.Top]: wt.Bottom,
  [wt.Bottom]: wt.Top
}, Tv = (n) => !!n && typeof n == "object" && "id" in n && "source" in n && "target" in n, p2 = (n) => !!n && typeof n == "object" && "id" in n && "position" in n && !("source" in n) && !("target" in n), kd = (n) => !!n && typeof n == "object" && "id" in n && "internals" in n && !("source" in n) && !("target" in n), Fu = (n, i = [0, 0]) => {
  const { width: o, height: r } = zn(n), c = n.origin ?? i, f = o * c[0], d = r * c[1];
  return {
    x: n.position.x - f,
    y: n.position.y - d
  };
}, Cv = (n, i = { nodeOrigin: [0, 0] }) => {
  if (n.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let o = !1;
  const r = n.reduce((c, f) => {
    const d = typeof f == "string";
    let h = !i.nodeLookup && !d ? f : void 0;
    return i.nodeLookup && (h = d ? i.nodeLookup.get(f) : kd(f) ? f : i.nodeLookup.get(f.id)), h ? (o = !0, ps(c, os(h, i.nodeOrigin))) : c;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return o ? vs(r) : { x: 0, y: 0, width: 0, height: 0 };
}, Wu = (n, i = {}) => {
  let o = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return n.forEach((c) => {
    (i.filter === void 0 || i.filter(c)) && (o = ps(o, os(c)), r = !0);
  }), r ? vs(o) : { x: 0, y: 0, width: 0, height: 0 };
}, Jd = (n, i, [o, r, c] = [0, 0, 1], f = !1, d = !1) => {
  const h = (i.x - o) / c, p = (i.y - r) / c, v = i.width / c, y = i.height / c, m = [];
  for (const x of n.values()) {
    const { measured: S, selectable: E = !0, hidden: z = !1 } = x;
    if (d && !E || z)
      continue;
    const T = S.width ?? x.width ?? x.initialWidth ?? 0, C = S.height ?? x.height ?? x.initialHeight ?? 0, { x: U, y: _ } = x.internals.positionAbsolute, D = Dv(h, p, v, y, U, _, T, C), G = T * C, B = f && D > 0;
    (!x.internals.handleBounds || B || D >= G || x.dragging) && m.push(x);
  }
  return m;
}, v2 = (n, i) => {
  const o = /* @__PURE__ */ new Set();
  return n.forEach((r) => {
    o.add(r.id);
  }), i.filter((r) => o.has(r.source) || o.has(r.target));
};
function x2(n, i) {
  const o = /* @__PURE__ */ new Map(), r = i?.nodes ? new Set(i.nodes.map((c) => c.id)) : null;
  return n.forEach((c) => {
    let f;
    if (i?.includeHiddenNodes) {
      const { width: d, height: h } = zn(c);
      f = d > 0 && h > 0;
    } else
      f = !!(c.measured.width && c.measured.height && !c.hidden);
    f && (!r || r.has(c.id)) && o.set(c.id, c);
  }), o;
}
async function b2({ nodes: n, width: i, height: o, panZoom: r, minZoom: c, maxZoom: f }, d) {
  if (n.size === 0)
    return !0;
  const h = x2(n, d), p = Wu(h), v = Fd(p, i, o, d?.minZoom ?? c, d?.maxZoom ?? f, d?.padding ?? 0.1);
  return await r.setViewport(v, {
    duration: d?.duration,
    ease: d?.ease,
    interpolate: d?.interpolate
  }), !0;
}
function Mv({ nodeId: n, nextPosition: i, nodeLookup: o, nodeOrigin: r = [0, 0], nodeExtent: c, onError: f }) {
  const d = o.get(n), h = d.parentId ? o.get(d.parentId) : void 0, { x: p, y: v } = h ? h.internals.positionAbsolute : { x: 0, y: 0 }, y = d.origin ?? r;
  let m = d.extent || c;
  if (d.extent === "parent" && !d.expandParent)
    if (!h)
      f?.("005", Cn.error005());
    else {
      const { width: S, height: E } = zn(h);
      S && E && (m = [
        [p, v],
        [p + S, v + E]
      ]);
    }
  else h && Aa(d.extent) && (m = [
    [d.extent[0][0] + p, d.extent[0][1] + v],
    [d.extent[1][0] + p, d.extent[1][1] + v]
  ]);
  const x = Aa(m) ? za(i, m, d.measured) : i;
  return (d.measured.width === void 0 || d.measured.height === void 0) && f?.("015", Cn.error015()), {
    position: {
      x: x.x - p + (d.measured.width ?? 0) * y[0],
      y: x.y - v + (d.measured.height ?? 0) * y[1]
    },
    positionAbsolute: x
  };
}
async function S2({ nodesToRemove: n = [], edgesToRemove: i = [], nodes: o, edges: r, onBeforeDelete: c }) {
  const f = new Set(n.map((x) => x.id)), d = [];
  for (const x of o) {
    if (x.deletable === !1)
      continue;
    const S = f.has(x.id), E = !S && x.parentId && d.find((z) => z.id === x.parentId);
    (S || E) && d.push(x);
  }
  const h = new Set(i.map((x) => x.id)), p = r.filter((x) => x.deletable !== !1), y = v2(d, p);
  for (const x of p)
    h.has(x.id) && !y.find((E) => E.id === x.id) && y.push(x);
  if (!c)
    return {
      edges: y,
      nodes: d
    };
  const m = await c({
    nodes: d,
    edges: y
  });
  return typeof m == "boolean" ? m ? { edges: y, nodes: d } : { edges: [], nodes: [] } : m;
}
const Oi = (n, i = 0, o = 1) => Math.min(Math.max(n, i), o), za = (n = { x: 0, y: 0 }, i, o) => ({
  x: Oi(n.x, i[0][0], i[1][0] - (o?.width ?? 0)),
  y: Oi(n.y, i[0][1], i[1][1] - (o?.height ?? 0))
});
function zv(n, i, o) {
  const { width: r, height: c } = zn(o), { x: f, y: d } = o.internals.positionAbsolute;
  return za(n, [
    [f, d],
    [f + r, d + c]
  ], i);
}
const Xy = (n, i, o) => n < i ? Oi(Math.abs(n - i), 1, i) / i : n > o ? -Oi(Math.abs(n - o), 1, i) / i : 0, Id = (n, i, o = 15, r = 40) => {
  const c = Xy(n.x, r, i.width - r) * o, f = Xy(n.y, r, i.height - r) * o;
  return [c, f];
}, ps = (n, i) => ({
  x: Math.min(n.x, i.x),
  y: Math.min(n.y, i.y),
  x2: Math.max(n.x2, i.x2),
  y2: Math.max(n.y2, i.y2)
}), Hd = ({ x: n, y: i, width: o, height: r }) => ({
  x: n,
  y: i,
  x2: n + o,
  y2: i + r
}), vs = ({ x: n, y: i, x2: o, y2: r }) => ({
  x: n,
  y: i,
  width: o - n,
  height: r - i
}), Qu = (n, i = [0, 0]) => {
  const { x: o, y: r } = kd(n) ? n.internals.positionAbsolute : Fu(n, i);
  return {
    x: o,
    y: r,
    width: n.measured?.width ?? n.width ?? n.initialWidth ?? 0,
    height: n.measured?.height ?? n.height ?? n.initialHeight ?? 0
  };
}, os = (n, i = [0, 0]) => {
  const { x: o, y: r } = kd(n) ? n.internals.positionAbsolute : Fu(n, i);
  return {
    x: o,
    y: r,
    x2: o + (n.measured?.width ?? n.width ?? n.initialWidth ?? 0),
    y2: r + (n.measured?.height ?? n.height ?? n.initialHeight ?? 0)
  };
}, Av = (n, i) => vs(ps(Hd(n), Hd(i))), Dv = (n, i, o, r, c, f, d, h) => {
  const p = Math.max(0, Math.min(n + o, c + d) - Math.max(n, c)), v = Math.max(0, Math.min(i + r, f + h) - Math.max(i, f));
  return Math.ceil(p * v);
}, rs = (n, i) => Dv(n.x, n.y, n.width, n.height, i.x, i.y, i.width, i.height), Zy = (n) => Nn(n.width) && Nn(n.height) && Nn(n.x) && Nn(n.y), Nn = (n) => !isNaN(n) && isFinite(n), Ov = (n, i) => (o, r) => {
}, Pu = (n, i = [1, 1]) => ({
  x: i[0] * Math.round(n.x / i[0]),
  y: i[1] * Math.round(n.y / i[1])
}), to = ({ x: n, y: i }, [o, r, c], f = !1, d = [1, 1]) => {
  const h = {
    x: (n - o) / c,
    y: (i - r) / c
  };
  return f ? Pu(h, d) : h;
}, Ri = ({ x: n, y: i }, [o, r, c]) => ({
  x: n * c + o,
  y: i * c + r
});
function Ni(n, i) {
  if (typeof n == "number")
    return Math.floor((i - i / (1 + n)) * 0.5);
  if (typeof n == "string" && n.endsWith("px")) {
    const o = parseFloat(n);
    if (!Number.isNaN(o))
      return Math.floor(o);
  }
  if (typeof n == "string" && n.endsWith("%")) {
    const o = parseFloat(n);
    if (!Number.isNaN(o))
      return Math.floor(i * o * 0.01);
  }
  return console.error(`The padding value "${n}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function E2(n, i, o) {
  if (typeof n == "string" || typeof n == "number") {
    const r = Ni(n, o), c = Ni(n, i);
    return {
      top: r,
      right: c,
      bottom: r,
      left: c,
      x: c * 2,
      y: r * 2
    };
  }
  if (typeof n == "object") {
    const r = Ni(n.top ?? n.y ?? 0, o), c = Ni(n.bottom ?? n.y ?? 0, o), f = Ni(n.left ?? n.x ?? 0, i), d = Ni(n.right ?? n.x ?? 0, i);
    return { top: r, right: d, bottom: c, left: f, x: f + d, y: r + c };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function w2(n, i, o, r, c, f) {
  const { x: d, y: h } = Ri(n, [i, o, r]), { x: p, y: v } = Ri({ x: n.x + n.width, y: n.y + n.height }, [i, o, r]), y = c - p, m = f - v;
  return {
    left: Math.floor(d),
    top: Math.floor(h),
    right: Math.floor(y),
    bottom: Math.floor(m)
  };
}
const Fd = (n, i, o, r, c, f) => {
  const d = E2(f, i, o), h = (i - d.x) / n.width, p = (o - d.y) / n.height, v = Math.min(h, p), y = Oi(v, r, c), m = n.x + n.width / 2, x = n.y + n.height / 2, S = i / 2 - m * y, E = o / 2 - x * y, z = w2(n, S, E, y, i, o), T = {
    left: Math.min(z.left - d.left, 0),
    top: Math.min(z.top - d.top, 0),
    right: Math.min(z.right - d.right, 0),
    bottom: Math.min(z.bottom - d.bottom, 0)
  };
  return {
    x: S - T.left + T.right,
    y: E - T.top + T.bottom,
    zoom: y
  };
}, $u = () => typeof navigator < "u" && navigator?.userAgent?.indexOf("Mac") >= 0;
function Aa(n) {
  return n != null && n !== "parent";
}
function zn(n) {
  return {
    width: n.measured?.width ?? n.width ?? n.initialWidth ?? 0,
    height: n.measured?.height ?? n.height ?? n.initialHeight ?? 0
  };
}
function Rv(n) {
  return (n.measured?.width ?? n.width ?? n.initialWidth) !== void 0 && (n.measured?.height ?? n.height ?? n.initialHeight) !== void 0;
}
function Hv(n, i = { width: 0, height: 0 }, o, r, c) {
  const f = { ...n }, d = r.get(o);
  if (d) {
    const h = d.origin || c;
    f.x += d.internals.positionAbsolute.x - (i.width ?? 0) * h[0], f.y += d.internals.positionAbsolute.y - (i.height ?? 0) * h[1];
  }
  return f;
}
function Gy(n, i) {
  if (n.size !== i.size)
    return !1;
  for (const o of n)
    if (!i.has(o))
      return !1;
  return !0;
}
function _2() {
  let n, i;
  return { promise: new Promise((r, c) => {
    n = r, i = c;
  }), resolve: n, reject: i };
}
function N2(n) {
  return { ..._v, ...n || {} };
}
function jv(n) {
  return n === null ? null : n ? "valid" : "invalid";
}
function Lu(n, { snapGrid: i = [0, 0], snapToGrid: o = !1, transform: r, containerBounds: c }) {
  const { x: f, y: d } = Tn(n), h = to({ x: f - (c?.left ?? 0), y: d - (c?.top ?? 0) }, r), { x: p, y: v } = o ? Pu(h, i) : h;
  return {
    xSnapped: p,
    ySnapped: v,
    ...h
  };
}
const Wd = (n) => ({
  width: n.offsetWidth,
  height: n.offsetHeight
}), Uv = (n) => n?.getRootNode?.() || window?.document, T2 = ["INPUT", "SELECT", "TEXTAREA"];
function Bv(n) {
  const i = n.composedPath?.()?.[0] || n.target;
  return i?.nodeType !== 1 ? !1 : T2.includes(i.nodeName) || i.hasAttribute("contenteditable") || !!i.closest(".nokey");
}
const Lv = (n) => "clientX" in n, Tn = (n, i) => {
  const o = Lv(n), r = o ? n.clientX : n.touches?.[0].clientX, c = o ? n.clientY : n.touches?.[0].clientY;
  return {
    x: r - (i?.left ?? 0),
    y: c - (i?.top ?? 0)
  };
}, Qy = (n, i, o, r, c) => {
  const f = i.querySelectorAll(`.${n}`);
  return !f || !f.length ? null : Array.from(f).map((d) => {
    const h = d.getBoundingClientRect();
    return {
      id: d.getAttribute("data-handleid"),
      type: n,
      nodeId: c,
      position: d.getAttribute("data-handlepos"),
      x: (h.left - o.left) / r,
      y: (h.top - o.top) / r,
      ...Wd(d)
    };
  });
};
function Vv({ sourceX: n, sourceY: i, targetX: o, targetY: r, sourceControlX: c, sourceControlY: f, targetControlX: d, targetControlY: h }) {
  const p = n * 0.125 + c * 0.375 + d * 0.375 + o * 0.125, v = i * 0.125 + f * 0.375 + h * 0.375 + r * 0.125, y = Math.abs(p - n), m = Math.abs(v - i);
  return [p, v, y, m];
}
function Xr(n, i) {
  return n >= 0 ? 0.5 * n : i * 25 * Math.sqrt(-n);
}
function $y({ pos: n, x1: i, y1: o, x2: r, y2: c, c: f }) {
  switch (n) {
    case wt.Left:
      return [i - Xr(i - r, f), o];
    case wt.Right:
      return [i + Xr(r - i, f), o];
    case wt.Top:
      return [i, o - Xr(o - c, f)];
    case wt.Bottom:
      return [i, o + Xr(c - o, f)];
  }
}
function Pd({ sourceX: n, sourceY: i, sourcePosition: o = wt.Bottom, targetX: r, targetY: c, targetPosition: f = wt.Top, curvature: d = 0.25 }) {
  const [h, p] = $y({
    pos: o,
    x1: n,
    y1: i,
    x2: r,
    y2: c,
    c: d
  }), [v, y] = $y({
    pos: f,
    x1: r,
    y1: c,
    x2: n,
    y2: i,
    c: d
  }), [m, x, S, E] = Vv({
    sourceX: n,
    sourceY: i,
    targetX: r,
    targetY: c,
    sourceControlX: h,
    sourceControlY: p,
    targetControlX: v,
    targetControlY: y
  });
  return [
    `M${n},${i} C${h},${p} ${v},${y} ${r},${c}`,
    m,
    x,
    S,
    E
  ];
}
function Yv({ sourceX: n, sourceY: i, targetX: o, targetY: r }) {
  const c = Math.abs(o - n) / 2, f = o < n ? o + c : o - c, d = Math.abs(r - i) / 2, h = r < i ? r + d : r - d;
  return [f, h, c, d];
}
function C2({ sourceNode: n, targetNode: i, selected: o = !1, zIndex: r = 0, elevateOnSelect: c = !1, zIndexMode: f = "basic" }) {
  if (f === "manual")
    return r;
  const d = c && o ? r + 1e3 : r, h = Math.max(n.parentId || c && n.selected ? n.internals.z : 0, i.parentId || c && i.selected ? i.internals.z : 0);
  return d + h;
}
function M2({ sourceNode: n, targetNode: i, width: o, height: r, transform: c }) {
  const f = ps(os(n), os(i));
  f.x === f.x2 && (f.x2 += 1), f.y === f.y2 && (f.y2 += 1);
  const d = {
    x: -c[0] / c[2],
    y: -c[1] / c[2],
    width: o / c[2],
    height: r / c[2]
  };
  return rs(d, vs(f)) > 0;
}
const z2 = ({ source: n, sourceHandle: i, target: o, targetHandle: r }) => `xy-edge__${n}${i || ""}-${o}${r || ""}`, A2 = (n, i) => i.some((o) => o.source === n.source && o.target === n.target && (o.sourceHandle === n.sourceHandle || !o.sourceHandle && !n.sourceHandle) && (o.targetHandle === n.targetHandle || !o.targetHandle && !n.targetHandle)), D2 = (n, i, o = {}) => {
  if (!n.source || !n.target)
    return o.onError?.("006", Cn.error006()), i;
  const r = o.getEdgeId || z2;
  let c;
  return Tv(n) ? c = { ...n } : c = {
    ...n,
    id: r(n)
  }, A2(c, i) ? i : (c.sourceHandle === null && delete c.sourceHandle, c.targetHandle === null && delete c.targetHandle, i.concat(c));
};
function qv({ sourceX: n, sourceY: i, targetX: o, targetY: r }) {
  const [c, f, d, h] = Yv({
    sourceX: n,
    sourceY: i,
    targetX: o,
    targetY: r
  });
  return [`M ${n},${i}L ${o},${r}`, c, f, d, h];
}
const Ky = {
  [wt.Left]: { x: -1, y: 0 },
  [wt.Right]: { x: 1, y: 0 },
  [wt.Top]: { x: 0, y: -1 },
  [wt.Bottom]: { x: 0, y: 1 }
}, O2 = ({ source: n, sourcePosition: i = wt.Bottom, target: o }) => i === wt.Left || i === wt.Right ? n.x < o.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : n.y < o.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, ky = (n, i) => Math.sqrt(Math.pow(i.x - n.x, 2) + Math.pow(i.y - n.y, 2));
function R2({ source: n, sourcePosition: i = wt.Bottom, target: o, targetPosition: r = wt.Top, center: c, offset: f, stepPosition: d }) {
  const h = Ky[i], p = Ky[r], v = { x: n.x + h.x * f, y: n.y + h.y * f }, y = { x: o.x + p.x * f, y: o.y + p.y * f }, m = O2({
    source: v,
    sourcePosition: i,
    target: y
  }), x = m.x !== 0 ? "x" : "y", S = m[x];
  let E = [], z, T;
  const C = { x: 0, y: 0 }, U = { x: 0, y: 0 }, [, , _, D] = Yv({
    sourceX: n.x,
    sourceY: n.y,
    targetX: o.x,
    targetY: o.y
  });
  if (h[x] * p[x] === -1) {
    x === "x" ? (z = c.x ?? v.x + (y.x - v.x) * d, T = c.y ?? (v.y + y.y) / 2) : (z = c.x ?? (v.x + y.x) / 2, T = c.y ?? v.y + (y.y - v.y) * d);
    const $ = [
      { x: z, y: v.y },
      { x: z, y: y.y }
    ], tt = [
      { x: v.x, y: T },
      { x: y.x, y: T }
    ];
    h[x] === S ? E = x === "x" ? $ : tt : E = x === "x" ? tt : $;
  } else {
    const $ = [{ x: v.x, y: y.y }], tt = [{ x: y.x, y: v.y }];
    if (x === "x" ? E = h.x === S ? tt : $ : E = h.y === S ? $ : tt, i === r) {
      const N = Math.abs(n[x] - o[x]);
      if (N <= f) {
        const L = Math.min(f - 1, f - N);
        h[x] === S ? C[x] = (v[x] > n[x] ? -1 : 1) * L : U[x] = (y[x] > o[x] ? -1 : 1) * L;
      }
    }
    if (i !== r) {
      const N = x === "x" ? "y" : "x", L = h[x] === p[N], O = v[N] > y[N], j = v[N] < y[N];
      (h[x] === 1 && (!L && O || L && j) || h[x] !== 1 && (!L && j || L && O)) && (E = x === "x" ? $ : tt);
    }
    const ot = { x: v.x + C.x, y: v.y + C.y }, nt = { x: y.x + U.x, y: y.y + U.y }, ut = Math.max(Math.abs(ot.x - E[0].x), Math.abs(nt.x - E[0].x)), J = Math.max(Math.abs(ot.y - E[0].y), Math.abs(nt.y - E[0].y));
    ut >= J ? (z = (ot.x + nt.x) / 2, T = E[0].y) : (z = E[0].x, T = (ot.y + nt.y) / 2);
  }
  const G = { x: v.x + C.x, y: v.y + C.y }, B = { x: y.x + U.x, y: y.y + U.y };
  return [[
    n,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...G.x !== E[0].x || G.y !== E[0].y ? [G] : [],
    ...E,
    ...B.x !== E[E.length - 1].x || B.y !== E[E.length - 1].y ? [B] : [],
    o
  ], z, T, _, D];
}
function H2(n, i, o, r) {
  const c = Math.min(ky(n, i) / 2, ky(i, o) / 2, r), { x: f, y: d } = i;
  if (n.x === f && f === o.x || n.y === d && d === o.y)
    return `L${f} ${d}`;
  if (n.y === d) {
    const v = n.x < o.x ? -1 : 1, y = n.y < o.y ? 1 : -1;
    return `L ${f + c * v},${d}Q ${f},${d} ${f},${d + c * y}`;
  }
  const h = n.x < o.x ? 1 : -1, p = n.y < o.y ? -1 : 1;
  return `L ${f},${d + c * p}Q ${f},${d} ${f + c * h},${d}`;
}
function jd({ sourceX: n, sourceY: i, sourcePosition: o = wt.Bottom, targetX: r, targetY: c, targetPosition: f = wt.Top, borderRadius: d = 5, centerX: h, centerY: p, offset: v = 20, stepPosition: y = 0.5 }) {
  const [m, x, S, E, z] = R2({
    source: { x: n, y: i },
    sourcePosition: o,
    target: { x: r, y: c },
    targetPosition: f,
    center: { x: h, y: p },
    offset: v,
    stepPosition: y
  });
  let T = `M${m[0].x} ${m[0].y}`;
  for (let C = 1; C < m.length - 1; C++)
    T += H2(m[C - 1], m[C], m[C + 1], d);
  return T += `L${m[m.length - 1].x} ${m[m.length - 1].y}`, [T, x, S, E, z];
}
function Jy(n) {
  return n && !!(n.internals.handleBounds || n.handles?.length) && !!(n.measured.width || n.width || n.initialWidth);
}
function j2(n) {
  const { sourceNode: i, targetNode: o } = n;
  if (!Jy(i) || !Jy(o))
    return null;
  const r = i.internals.handleBounds || Iy(i.handles), c = o.internals.handleBounds || Iy(o.handles), f = Fy(r?.source ?? [], n.sourceHandle), d = Fy(
    // when connection type is loose we can define all handles as sources and connect source -> source
    n.connectionMode === Di.Strict ? c?.target ?? [] : (c?.target ?? []).concat(c?.source ?? []),
    n.targetHandle
  );
  if (!f || !d)
    return n.onError?.("008", Cn.error008(f ? "target" : "source", {
      id: n.id,
      sourceHandle: n.sourceHandle,
      targetHandle: n.targetHandle
    })), null;
  const h = f?.position || wt.Bottom, p = d?.position || wt.Top, v = Da(i, f, h), y = Da(o, d, p);
  return {
    sourceX: v.x,
    sourceY: v.y,
    targetX: y.x,
    targetY: y.y,
    sourcePosition: h,
    targetPosition: p
  };
}
function Iy(n) {
  if (!n)
    return null;
  const i = [], o = [];
  for (const r of n)
    r.width = r.width ?? 1, r.height = r.height ?? 1, r.type === "source" ? i.push(r) : r.type === "target" && o.push(r);
  return {
    source: i,
    target: o
  };
}
function Da(n, i, o = wt.Left, r = !1) {
  const c = (i?.x ?? 0) + n.internals.positionAbsolute.x, f = (i?.y ?? 0) + n.internals.positionAbsolute.y, { width: d, height: h } = i ?? zn(n);
  if (r)
    return { x: c + d / 2, y: f + h / 2 };
  switch (i?.position ?? o) {
    case wt.Top:
      return { x: c + d / 2, y: f };
    case wt.Right:
      return { x: c + d, y: f + h / 2 };
    case wt.Bottom:
      return { x: c + d / 2, y: f + h };
    case wt.Left:
      return { x: c, y: f + h / 2 };
  }
}
function Fy(n, i) {
  return n && (i ? n.find((o) => o.id === i) : n[0]) || null;
}
function Ud(n, i) {
  return n ? typeof n == "string" ? n : `${i ? `${i}__` : ""}${Object.keys(n).sort().map((r) => `${r}=${n[r]}`).join("&")}` : "";
}
function U2(n, { id: i, defaultColor: o, defaultMarkerStart: r, defaultMarkerEnd: c }) {
  const f = /* @__PURE__ */ new Set();
  return n.reduce((d, h) => ([h.markerStart || r, h.markerEnd || c].forEach((p) => {
    if (p && typeof p == "object") {
      const v = Ud(p, i);
      f.has(v) || (d.push({ id: v, color: p.color || o, ...p }), f.add(v));
    }
  }), d), []).sort((d, h) => d.id.localeCompare(h.id));
}
const Xv = 1e3, B2 = 10, th = {
  nodeOrigin: [0, 0],
  nodeExtent: Zu,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, L2 = {
  ...th,
  checkEquality: !0
};
function eh(n, i) {
  const o = { ...n };
  for (const r in i)
    i[r] !== void 0 && (o[r] = i[r]);
  return o;
}
function V2(n, i, o) {
  const r = eh(th, o);
  for (const c of n.values())
    if (c.parentId)
      lh(c, n, i, r);
    else {
      const f = Fu(c, r.nodeOrigin), d = Aa(c.extent) ? c.extent : r.nodeExtent, h = za(f, d, zn(c));
      c.internals.positionAbsolute = h;
    }
}
function Y2(n, i) {
  if (!n.handles)
    return n.measured ? i?.internals.handleBounds : void 0;
  const o = [], r = [];
  for (const c of n.handles) {
    const f = {
      id: c.id,
      width: c.width ?? 1,
      height: c.height ?? 1,
      nodeId: n.id,
      x: c.x,
      y: c.y,
      position: c.position,
      type: c.type
    };
    c.type === "source" ? o.push(f) : c.type === "target" && r.push(f);
  }
  return {
    source: o,
    target: r
  };
}
function nh(n) {
  return n === "manual";
}
function Bd(n, i, o, r = {}) {
  const c = eh(L2, r), f = { i: 0 }, d = new Map(i), h = c?.elevateNodesOnSelect && !nh(c.zIndexMode) ? Xv : 0;
  let p = n.length > 0, v = !1;
  i.clear(), o.clear();
  for (const y of n) {
    let m = d.get(y.id);
    if (c.checkEquality && y === m?.internals.userNode)
      i.set(y.id, m);
    else {
      const x = Fu(y, c.nodeOrigin), S = Aa(y.extent) ? y.extent : c.nodeExtent, E = za(x, S, zn(y));
      m = {
        ...c.defaults,
        ...y,
        measured: {
          width: y.measured?.width,
          height: y.measured?.height
        },
        internals: {
          positionAbsolute: E,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: Y2(y, m),
          z: Zv(y, h, c.zIndexMode),
          userNode: y
        }
      }, i.set(y.id, m);
    }
    (m.measured === void 0 || m.measured.width === void 0 || m.measured.height === void 0) && !m.hidden && (p = !1), y.parentId && lh(m, i, o, r, f), v ||= y.selected ?? !1;
  }
  return { nodesInitialized: p, hasSelectedNodes: v };
}
function q2(n, i) {
  if (!n.parentId)
    return;
  const o = i.get(n.parentId);
  o ? o.set(n.id, n) : i.set(n.parentId, /* @__PURE__ */ new Map([[n.id, n]]));
}
function lh(n, i, o, r, c) {
  const { elevateNodesOnSelect: f, nodeOrigin: d, nodeExtent: h, zIndexMode: p } = eh(th, r), v = n.parentId, y = i.get(v);
  if (!y) {
    console.warn(`Parent node ${v} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  q2(n, o), c && !y.parentId && y.internals.rootParentIndex === void 0 && p === "auto" && (y.internals.rootParentIndex = ++c.i, y.internals.z = y.internals.z + c.i * B2), c && y.internals.rootParentIndex !== void 0 && (c.i = y.internals.rootParentIndex);
  const m = f && !nh(p) ? Xv : 0, { x, y: S, z: E } = X2(n, y, d, h, m, p), { positionAbsolute: z } = n.internals, T = x !== z.x || S !== z.y;
  (T || E !== n.internals.z) && i.set(n.id, {
    ...n,
    internals: {
      ...n.internals,
      positionAbsolute: T ? { x, y: S } : z,
      z: E
    }
  });
}
function Zv(n, i, o) {
  const r = Nn(n.zIndex) ? n.zIndex : 0;
  return nh(o) ? r : r + (n.selected ? i : 0);
}
function X2(n, i, o, r, c, f) {
  const { x: d, y: h } = i.internals.positionAbsolute, p = zn(n), v = Fu(n, o), y = Aa(n.extent) ? za(v, n.extent, p) : v;
  let m = za({ x: d + y.x, y: h + y.y }, r, p);
  n.extent === "parent" && (m = zv(m, p, i));
  const x = Zv(n, c, f), S = i.internals.z ?? 0;
  return {
    x: m.x,
    y: m.y,
    z: S >= x ? S + 1 : x
  };
}
function ah(n, i, o, r = [0, 0]) {
  const c = [], f = /* @__PURE__ */ new Map();
  for (const d of n) {
    const h = i.get(d.parentId);
    if (!h)
      continue;
    const p = f.get(d.parentId)?.expandedRect ?? Qu(h), v = Av(p, d.rect);
    f.set(d.parentId, { expandedRect: v, parent: h });
  }
  return f.size > 0 && f.forEach(({ expandedRect: d, parent: h }, p) => {
    const v = h.internals.positionAbsolute, y = zn(h), m = h.origin ?? r, x = d.x < v.x ? Math.round(Math.abs(v.x - d.x)) : 0, S = d.y < v.y ? Math.round(Math.abs(v.y - d.y)) : 0, E = Math.max(y.width, Math.round(d.width)), z = Math.max(y.height, Math.round(d.height)), T = (E - y.width) * m[0], C = (z - y.height) * m[1];
    (x > 0 || S > 0 || T || C) && (c.push({
      id: p,
      type: "position",
      position: {
        x: h.position.x - x + T,
        y: h.position.y - S + C
      }
    }), o.get(p)?.forEach((U) => {
      n.some((_) => _.id === U.id) || c.push({
        id: U.id,
        type: "position",
        position: {
          x: U.position.x + x,
          y: U.position.y + S
        }
      });
    })), (y.width < d.width || y.height < d.height || x || S) && c.push({
      id: p,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: E + (x ? m[0] * x - T : 0),
        height: z + (S ? m[1] * S - C : 0)
      }
    });
  }), c;
}
function Z2(n, i, o, r, c, f, d) {
  const h = r?.querySelector(".xyflow__viewport");
  let p = !1;
  if (!h)
    return { changes: [], updatedInternals: p };
  const v = [], y = window.getComputedStyle(h), { m22: m } = new window.DOMMatrixReadOnly(y.transform), x = [];
  for (const S of n.values()) {
    const E = i.get(S.id);
    if (!E)
      continue;
    if (E.hidden) {
      i.set(E.id, {
        ...E,
        internals: {
          ...E.internals,
          handleBounds: void 0
        }
      }), p = !0;
      continue;
    }
    const z = Wd(S.nodeElement), T = E.measured.width !== z.width || E.measured.height !== z.height;
    if (!!(z.width && z.height && (T || !E.internals.handleBounds || S.force))) {
      const U = S.nodeElement.getBoundingClientRect(), _ = Aa(E.extent) ? E.extent : f;
      let { positionAbsolute: D } = E.internals;
      if (E.parentId && E.extent === "parent") {
        const B = i.get(E.parentId);
        B && (D = zv(D, z, B));
      } else _ && (D = za(D, _, z));
      const G = {
        ...E,
        measured: z,
        internals: {
          ...E.internals,
          positionAbsolute: D,
          handleBounds: {
            source: Qy("source", S.nodeElement, U, m, E.id),
            target: Qy("target", S.nodeElement, U, m, E.id)
          }
        }
      };
      i.set(E.id, G), E.parentId && lh(G, i, o, { nodeOrigin: c, zIndexMode: d }), p = !0, T && (v.push({
        id: E.id,
        type: "dimensions",
        dimensions: z
      }), E.expandParent && E.parentId && x.push({
        id: E.id,
        parentId: E.parentId,
        rect: Qu(G, c)
      }));
    }
  }
  if (x.length > 0) {
    const S = ah(x, i, o, c);
    v.push(...S);
  }
  return { changes: v, updatedInternals: p };
}
async function G2({ delta: n, panZoom: i, transform: o, translateExtent: r, width: c, height: f }) {
  if (!i || !n.x && !n.y)
    return !1;
  const d = await i.setViewportConstrained({
    x: o[0] + n.x,
    y: o[1] + n.y,
    zoom: o[2]
  }, [
    [0, 0],
    [c, f]
  ], r);
  return !!d && (d.x !== o[0] || d.y !== o[1] || d.k !== o[2]);
}
function Wy(n, i, o, r, c, f) {
  let d = c;
  const h = r.get(d) || /* @__PURE__ */ new Map();
  r.set(d, h.set(o, i)), d = `${c}-${n}`;
  const p = r.get(d) || /* @__PURE__ */ new Map();
  if (r.set(d, p.set(o, i)), f) {
    d = `${c}-${n}-${f}`;
    const v = r.get(d) || /* @__PURE__ */ new Map();
    r.set(d, v.set(o, i));
  }
}
function Gv(n, i, o) {
  n.clear(), i.clear();
  for (const r of o) {
    const { source: c, target: f, sourceHandle: d = null, targetHandle: h = null } = r, p = { edgeId: r.id, source: c, target: f, sourceHandle: d, targetHandle: h }, v = `${c}-${d}--${f}-${h}`, y = `${f}-${h}--${c}-${d}`;
    Wy("source", p, y, n, c, d), Wy("target", p, v, n, f, h), i.set(r.id, r);
  }
}
function Qv(n, i) {
  if (!n.parentId)
    return !1;
  const o = i.get(n.parentId);
  return o ? o.selected ? !0 : Qv(o, i) : !1;
}
function Py(n, i, o) {
  let r = n;
  do {
    if (r?.matches?.(i))
      return !0;
    if (r === o)
      return !1;
    r = r?.parentElement;
  } while (r);
  return !1;
}
function Q2(n, i, o, r) {
  const c = /* @__PURE__ */ new Map();
  for (const [f, d] of n)
    if ((d.selected || d.id === r) && (!d.parentId || !Qv(d, n)) && (d.draggable || i && typeof d.draggable > "u")) {
      const h = n.get(f);
      h && c.set(f, {
        id: f,
        position: h.position || { x: 0, y: 0 },
        distance: {
          x: o.x - h.internals.positionAbsolute.x,
          y: o.y - h.internals.positionAbsolute.y
        },
        extent: h.extent,
        parentId: h.parentId,
        origin: h.origin,
        expandParent: h.expandParent,
        internals: {
          positionAbsolute: h.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: h.measured.width ?? 0,
          height: h.measured.height ?? 0
        }
      });
    }
  return c;
}
function md({ nodeId: n, dragItems: i, nodeLookup: o, dragging: r = !0 }) {
  const c = [];
  for (const [d, h] of i) {
    const p = o.get(d)?.internals.userNode;
    p && c.push({
      ...p,
      position: h.position,
      dragging: r
    });
  }
  if (!n)
    return [c[0], c];
  const f = o.get(n)?.internals.userNode;
  return [
    f ? {
      ...f,
      position: i.get(n)?.position || f.position,
      dragging: r
    } : c[0],
    c
  ];
}
function $2({ dragItems: n, snapGrid: i, x: o, y: r }) {
  const c = n.values().next().value;
  if (!c)
    return null;
  const f = {
    x: o - c.distance.x,
    y: r - c.distance.y
  }, d = Pu(f, i);
  return {
    x: d.x - f.x,
    y: d.y - f.y
  };
}
function K2({ onNodeMouseDown: n, getStoreItems: i, onDragStart: o, onDrag: r, onDragStop: c }) {
  let f = { x: null, y: null }, d = 0, h = /* @__PURE__ */ new Map(), p = !1, v = { x: 0, y: 0 }, y = null, m = !1, x = null, S = !1, E = !1, z = null;
  function T({ noDragClassName: U, handleSelector: _, domNode: D, isSelectable: G, nodeId: B, nodeClickDistance: H = 0 }) {
    x = nn(D);
    function $({ x: ut, y: J }) {
      const { nodeLookup: N, nodeExtent: L, snapGrid: O, snapToGrid: j, nodeOrigin: Y, onNodeDrag: k, onSelectionDrag: et, onError: lt, updateNodePositions: dt } = i();
      f = { x: ut, y: J };
      let xt = !1;
      const M = h.size > 1, F = M && L ? Hd(Wu(h)) : null, ht = M && j ? $2({
        dragItems: h,
        snapGrid: O,
        x: ut,
        y: J
      }) : null;
      for (const [rt, W] of h) {
        if (!N.has(rt))
          continue;
        let ft = { x: ut - W.distance.x, y: J - W.distance.y };
        j && (ft = ht ? {
          x: Math.round(ft.x + ht.x),
          y: Math.round(ft.y + ht.y)
        } : Pu(ft, O));
        let gt = null;
        if (M && L && !W.extent && F) {
          const { positionAbsolute: bt } = W.internals, zt = bt.x - F.x + L[0][0], Et = bt.x + W.measured.width - F.x2 + L[1][0], Mt = bt.y - F.y + L[0][1], Ot = bt.y + W.measured.height - F.y2 + L[1][1];
          gt = [
            [zt, Mt],
            [Et, Ot]
          ];
        }
        const { position: st, positionAbsolute: ct } = Mv({
          nodeId: rt,
          nextPosition: ft,
          nodeLookup: N,
          nodeExtent: gt || L,
          nodeOrigin: Y,
          onError: lt
        });
        xt = xt || W.position.x !== st.x || W.position.y !== st.y, W.position = st, W.internals.positionAbsolute = ct;
      }
      if (E = E || xt, !!xt && (dt(h, !0), z && (r || k || !B && et))) {
        const [rt, W] = md({
          nodeId: B,
          dragItems: h,
          nodeLookup: N
        });
        r?.(z, h, rt, W), k?.(z, rt, W), B || et?.(z, W);
      }
    }
    async function tt() {
      if (!y)
        return;
      const { transform: ut, panBy: J, autoPanSpeed: N, autoPanOnNodeDrag: L } = i();
      if (!L) {
        p = !1, cancelAnimationFrame(d);
        return;
      }
      const [O, j] = Id(v, y, N);
      (O !== 0 || j !== 0) && (f.x = (f.x ?? 0) - O / ut[2], f.y = (f.y ?? 0) - j / ut[2], await J({ x: O, y: j }) && $(f)), d = requestAnimationFrame(tt);
    }
    function ot(ut) {
      const { nodeLookup: J, multiSelectionActive: N, nodesDraggable: L, transform: O, snapGrid: j, snapToGrid: Y, selectNodesOnDrag: k, onNodeDragStart: et, onSelectionDragStart: lt, unselectNodesAndEdges: dt } = i();
      m = !0, (!k || !G) && !N && B && (J.get(B)?.selected || dt()), G && k && B && n?.(B);
      const xt = Lu(ut.sourceEvent, { transform: O, snapGrid: j, snapToGrid: Y, containerBounds: y });
      if (f = xt, h = Q2(J, L, xt, B), h.size > 0 && (o || et || !B && lt)) {
        const [M, F] = md({
          nodeId: B,
          dragItems: h,
          nodeLookup: J
        });
        o?.(ut.sourceEvent, h, M, F), et?.(ut.sourceEvent, M, F), B || lt?.(ut.sourceEvent, F);
      }
    }
    const nt = ov().clickDistance(H).on("start", (ut) => {
      const { domNode: J, nodeDragThreshold: N, transform: L, snapGrid: O, snapToGrid: j } = i();
      y = J?.getBoundingClientRect() || null, S = !1, E = !1, z = ut.sourceEvent, N === 0 && ot(ut), f = Lu(ut.sourceEvent, { transform: L, snapGrid: O, snapToGrid: j, containerBounds: y }), v = Tn(ut.sourceEvent, y);
    }).on("drag", (ut) => {
      const { autoPanOnNodeDrag: J, transform: N, snapGrid: L, snapToGrid: O, nodeDragThreshold: j, nodeLookup: Y } = i(), k = Lu(ut.sourceEvent, { transform: N, snapGrid: L, snapToGrid: O, containerBounds: y });
      if (z = ut.sourceEvent, (ut.sourceEvent.type === "touchmove" && ut.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      B && !Y.has(B)) && (S = !0), !S) {
        if (!p && J && m && (p = !0, tt()), !m) {
          const et = Tn(ut.sourceEvent, y), lt = et.x - v.x, dt = et.y - v.y;
          Math.sqrt(lt * lt + dt * dt) > j && ot(ut);
        }
        (f.x !== k.xSnapped || f.y !== k.ySnapped) && h && m && (v = Tn(ut.sourceEvent, y), $(k));
      }
    }).on("end", (ut) => {
      if (!m || S) {
        S && h.size > 0 && i().updateNodePositions(h, !1);
        return;
      }
      if (p = !1, m = !1, cancelAnimationFrame(d), h.size > 0) {
        const { nodeLookup: J, updateNodePositions: N, onNodeDragStop: L, onSelectionDragStop: O } = i();
        if (E && (N(h, !1), E = !1), c || L || !B && O) {
          const [j, Y] = md({
            nodeId: B,
            dragItems: h,
            nodeLookup: J,
            dragging: !1
          });
          c?.(ut.sourceEvent, h, j, Y), L?.(ut.sourceEvent, j, Y), B || O?.(ut.sourceEvent, Y);
        }
      }
    }).filter((ut) => {
      const J = ut.target;
      return !ut.button && (!U || !Py(J, `.${U}`, D)) && (!_ || Py(J, _, D));
    });
    x.call(nt);
  }
  function C() {
    x?.on(".drag", null);
  }
  return {
    update: T,
    destroy: C
  };
}
function k2(n, i, o) {
  const r = [], c = {
    x: n.x - o,
    y: n.y - o,
    width: o * 2,
    height: o * 2
  };
  for (const f of i.values())
    rs(c, Qu(f)) > 0 && r.push(f);
  return r;
}
const J2 = 250;
function I2(n, i, o, r) {
  let c = [], f = 1 / 0;
  const d = k2(n, o, i + J2);
  for (const h of d) {
    const p = [...h.internals.handleBounds?.source ?? [], ...h.internals.handleBounds?.target ?? []];
    for (const v of p) {
      if (r.nodeId === v.nodeId && r.type === v.type && r.id === v.id)
        continue;
      const { x: y, y: m } = Da(h, v, v.position, !0), x = Math.sqrt(Math.pow(y - n.x, 2) + Math.pow(m - n.y, 2));
      x > i || (x < f ? (c = [{ ...v, x: y, y: m }], f = x) : x === f && c.push({ ...v, x: y, y: m }));
    }
  }
  if (!c.length)
    return null;
  if (c.length > 1) {
    const h = r.type === "source" ? "target" : "source";
    return c.find((p) => p.type === h) ?? c[0];
  }
  return c[0];
}
function $v(n, i, o, r, c, f = !1) {
  const d = r.get(n);
  if (!d)
    return null;
  const h = c === "strict" ? d.internals.handleBounds?.[i] : [...d.internals.handleBounds?.source ?? [], ...d.internals.handleBounds?.target ?? []], p = (o ? h?.find((v) => v.id === o) : h?.[0]) ?? null;
  return p && f ? { ...p, ...Da(d, p, p.position, !0) } : p;
}
function Kv(n, i) {
  return n || (i?.classList.contains("target") ? "target" : i?.classList.contains("source") ? "source" : null);
}
function F2(n, i) {
  let o = null;
  return i ? o = !0 : n && !i && (o = !1), o;
}
const kv = () => !0;
function W2(n, { connectionMode: i, connectionRadius: o, handleId: r, nodeId: c, edgeUpdaterType: f, isTarget: d, domNode: h, nodeLookup: p, lib: v, autoPanOnConnect: y, flowId: m, panBy: x, cancelConnection: S, onConnectStart: E, onConnect: z, onConnectEnd: T, isValidConnection: C = kv, onReconnectEnd: U, updateConnection: _, getTransform: D, getFromHandle: G, autoPanSpeed: B, dragThreshold: H = 1, handleDomNode: $ }) {
  const tt = Uv(n.target);
  let ot = 0, nt;
  const { x: ut, y: J } = Tn(n), N = Kv(f, $), L = h?.getBoundingClientRect();
  let O = !1;
  if (!L || !N)
    return;
  const j = $v(c, N, r, p, i);
  if (!j)
    return;
  let Y = Tn(n, L), k = !1, et = null, lt = !1, dt = null;
  function xt() {
    if (!y || !L)
      return;
    const [st, ct] = Id(Y, L, B);
    x({ x: st, y: ct }), ot = requestAnimationFrame(xt);
  }
  const M = {
    ...j,
    nodeId: c,
    type: N,
    position: j.position
  }, F = p.get(c);
  let rt = {
    inProgress: !0,
    isValid: null,
    from: Da(F, M, wt.Left, !0),
    fromHandle: M,
    fromPosition: M.position,
    fromNode: F,
    to: Y,
    toHandle: null,
    toPosition: qy[M.position],
    toNode: null,
    pointer: Y
  };
  function W() {
    O = !0, _(rt), E?.(n, { nodeId: c, handleId: r, handleType: N });
  }
  H === 0 && W();
  function ft(st) {
    if (!O) {
      const { x: Ot, y: Ht } = Tn(st), Kt = Ot - ut, oe = Ht - J;
      if (!(Kt * Kt + oe * oe > H * H))
        return;
      W();
    }
    if (!G() || !M) {
      gt(st);
      return;
    }
    const ct = D();
    Y = Tn(st, L), nt = I2(to(Y, ct, !1, [1, 1]), o, p, M), k || (xt(), k = !0);
    const bt = Jv(st, {
      handle: nt,
      connectionMode: i,
      fromNodeId: c,
      fromHandleId: r,
      fromType: d ? "target" : "source",
      isValidConnection: C,
      doc: tt,
      lib: v,
      flowId: m,
      nodeLookup: p
    });
    dt = bt.handleDomNode, et = bt.connection, lt = F2(!!nt, bt.isValid);
    const zt = p.get(c), Et = zt ? Da(zt, M, wt.Left, !0) : rt.from, Mt = {
      ...rt,
      from: Et,
      isValid: lt,
      to: bt.toHandle && lt ? Ri({ x: bt.toHandle.x, y: bt.toHandle.y }, ct) : Y,
      toHandle: bt.toHandle,
      toPosition: lt && bt.toHandle ? bt.toHandle.position : qy[M.position],
      toNode: bt.toHandle ? p.get(bt.toHandle.nodeId) : null,
      pointer: Y
    };
    _(Mt), rt = Mt;
  }
  function gt(st) {
    if (!("touches" in st && st.touches.length > 0)) {
      if (O) {
        (nt || dt) && et && lt && z?.(et);
        const { inProgress: ct, ...bt } = rt, zt = {
          ...bt,
          toPosition: rt.toHandle ? rt.toPosition : null
        };
        T?.(st, zt), f && U?.(st, zt);
      }
      S(), cancelAnimationFrame(ot), k = !1, lt = !1, et = null, dt = null, tt.removeEventListener("mousemove", ft), tt.removeEventListener("mouseup", gt), tt.removeEventListener("touchmove", ft), tt.removeEventListener("touchend", gt);
    }
  }
  tt.addEventListener("mousemove", ft), tt.addEventListener("mouseup", gt), tt.addEventListener("touchmove", ft), tt.addEventListener("touchend", gt);
}
function Jv(n, { handle: i, connectionMode: o, fromNodeId: r, fromHandleId: c, fromType: f, doc: d, lib: h, flowId: p, isValidConnection: v = kv, nodeLookup: y }) {
  const m = f === "target", x = i ? d.querySelector(`.${h}-flow__handle[data-id="${p}-${i?.nodeId}-${i?.id}-${i?.type}"]`) : null, { x: S, y: E } = Tn(n), z = d.elementFromPoint(S, E), T = z?.classList.contains(`${h}-flow__handle`) ? z : x, C = {
    handleDomNode: T,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (T) {
    const U = Kv(void 0, T), _ = T.getAttribute("data-nodeid"), D = T.getAttribute("data-handleid"), G = T.classList.contains("connectable"), B = T.classList.contains("connectableend");
    if (!_ || !U)
      return C;
    const H = {
      source: m ? _ : r,
      sourceHandle: m ? D : c,
      target: m ? r : _,
      targetHandle: m ? c : D
    };
    C.connection = H;
    const tt = G && B && (o === Di.Strict ? m && U === "source" || !m && U === "target" : _ !== r || D !== c);
    C.isValid = tt && v(H), C.toHandle = $v(_, U, D, y, o, !0);
  }
  return C;
}
const Ld = {
  onPointerDown: W2,
  isValid: Jv
};
function P2({ domNode: n, panZoom: i, getTransform: o, getViewScale: r }) {
  const c = nn(n);
  function f({ translateExtent: h, width: p, height: v, zoomStep: y = 1, pannable: m = !0, zoomable: x = !0, inversePan: S = !1 }) {
    const E = (_) => {
      if (_.sourceEvent.type !== "wheel" || !i)
        return;
      const D = o(), G = _.sourceEvent.ctrlKey && $u() ? 10 : 1, B = -_.sourceEvent.deltaY * (_.sourceEvent.deltaMode === 1 ? 0.05 : _.sourceEvent.deltaMode ? 1 : 2e-3) * y, H = D[2] * Math.pow(2, B * G);
      i.scaleTo(H);
    };
    let z = [0, 0];
    const T = (_) => {
      (_.sourceEvent.type === "mousedown" || _.sourceEvent.type === "touchstart") && (z = [
        _.sourceEvent.clientX ?? _.sourceEvent.touches[0].clientX,
        _.sourceEvent.clientY ?? _.sourceEvent.touches[0].clientY
      ]);
    }, C = (_) => {
      const D = o();
      if (_.sourceEvent.type !== "mousemove" && _.sourceEvent.type !== "touchmove" || !i)
        return;
      const G = [
        _.sourceEvent.clientX ?? _.sourceEvent.touches[0].clientX,
        _.sourceEvent.clientY ?? _.sourceEvent.touches[0].clientY
      ], B = [G[0] - z[0], G[1] - z[1]];
      z = G;
      const H = r() * Math.max(D[2], Math.log(D[2])) * (S ? -1 : 1), $ = {
        x: D[0] - B[0] * H,
        y: D[1] - B[1] * H
      }, tt = [
        [0, 0],
        [p, v]
      ];
      i.setViewportConstrained({
        x: $.x,
        y: $.y,
        zoom: D[2]
      }, tt, h);
    }, U = Ev().on("start", T).on("zoom", m ? C : null).on("zoom.wheel", x ? E : null);
    c.call(U, {});
  }
  function d() {
    c.on("zoom", null);
  }
  return {
    update: f,
    destroy: d,
    pointer: wn
  };
}
const xs = (n) => ({
  x: n.x,
  y: n.y,
  zoom: n.k
}), yd = ({ x: n, y: i, zoom: o }) => ys.translate(n, i).scale(o), Ql = (n, i) => n.target.closest(`.${i}`), Iv = (n, i) => i === 2 && Array.isArray(n) && n.includes(2), tN = (n) => ((n *= 2) <= 1 ? n * n * n : (n -= 2) * n * n + 2) / 2, pd = (n, i = 0, o = tN, r = () => {
}) => {
  const c = typeof i == "number" && i > 0;
  return c || r(), c ? n.transition().duration(i).ease(o).on("end", r) : n;
}, Fv = (n) => {
  const i = n.ctrlKey && $u() ? 10 : 1;
  return -n.deltaY * (n.deltaMode === 1 ? 0.05 : n.deltaMode ? 1 : 2e-3) * i;
};
function eN({ zoomPanValues: n, noWheelClassName: i, d3Selection: o, d3Zoom: r, panOnScrollMode: c, panOnScrollSpeed: f, zoomOnPinch: d, onPanZoomStart: h, onPanZoom: p, onPanZoomEnd: v }) {
  return (y) => {
    if (Ql(y, i))
      return y.ctrlKey && y.preventDefault(), !1;
    y.preventDefault(), y.stopImmediatePropagation();
    const m = o.property("__zoom").k || 1;
    if (y.ctrlKey && d) {
      const T = wn(y), C = Fv(y), U = m * Math.pow(2, C);
      r.scaleTo(o, U, T, y);
      return;
    }
    const x = y.deltaMode === 1 ? 20 : 1;
    let S = c === Ta.Vertical ? 0 : y.deltaX * x, E = c === Ta.Horizontal ? 0 : y.deltaY * x;
    !$u() && y.shiftKey && c !== Ta.Vertical && (S = y.deltaY * x, E = 0), r.translateBy(
      o,
      -(S / m) * f,
      -(E / m) * f,
      // @ts-ignore
      { internal: !0 }
    );
    const z = xs(o.property("__zoom"));
    clearTimeout(n.panScrollTimeout), n.isPanScrolling ? p?.(y, z) : (n.isPanScrolling = !0, h?.(y, z)), n.panScrollTimeout = setTimeout(() => {
      v?.(y, z), n.isPanScrolling = !1;
    }, 150);
  };
}
function nN({ noWheelClassName: n, preventScrolling: i, d3ZoomHandler: o }) {
  return function(r, c) {
    const f = r.type === "wheel", d = !i && f && !r.ctrlKey, h = Ql(r, n);
    if (r.ctrlKey && f && h && r.preventDefault(), d || h)
      return null;
    r.preventDefault(), o.call(this, r, c);
  };
}
function lN({ zoomPanValues: n, onDraggingChange: i, onPanZoomStart: o }) {
  return (r) => {
    if (r.sourceEvent?.internal)
      return;
    const c = xs(r.transform);
    n.mouseButton = r.sourceEvent?.button || 0, n.isZoomingOrPanning = !0, n.prevViewport = c, r.sourceEvent?.type === "mousedown" && i(!0), o && o?.(r.sourceEvent, c);
  };
}
function aN({ zoomPanValues: n, panOnDrag: i, onPaneContextMenu: o, onTransformChange: r, onPanZoom: c }) {
  return (f) => {
    n.usedRightMouseButton = !!(o && Iv(i, n.mouseButton ?? 0)), f.sourceEvent?.sync || r([f.transform.x, f.transform.y, f.transform.k]), c && !f.sourceEvent?.internal && c?.(f.sourceEvent, xs(f.transform));
  };
}
function iN({ zoomPanValues: n, panOnDrag: i, panOnScroll: o, onDraggingChange: r, onPanZoomEnd: c, onPaneContextMenu: f }) {
  return (d) => {
    if (!d.sourceEvent?.internal && (n.isZoomingOrPanning = !1, f && Iv(i, n.mouseButton ?? 0) && !n.usedRightMouseButton && d.sourceEvent && f(d.sourceEvent), n.usedRightMouseButton = !1, r(!1), c)) {
      const h = xs(d.transform);
      n.prevViewport = h, clearTimeout(n.timerId), n.timerId = setTimeout(
        () => {
          c?.(d.sourceEvent, h);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        o ? 150 : 0
      );
    }
  };
}
function uN({ panActivationKeyPressed: n, zoomActivationKeyPressed: i, zoomOnScroll: o, zoomOnPinch: r, panOnDrag: c, panOnScroll: f, zoomOnDoubleClick: d, userSelectionActive: h, noWheelClassName: p, noPanClassName: v, lib: y, connectionInProgress: m }) {
  return (x) => {
    const S = i || o, E = r && x.ctrlKey, z = x.type === "wheel";
    if (x.button === 1 && x.type === "mousedown" && (Ql(x, `${y}-flow__node`) || Ql(x, `${y}-flow__edge`) || Ql(x, `${y}-flow__selection`) || Ql(x, `${y}-flow__nodesselection`)))
      return !0;
    if (!c && !S && !f && !d && !r || h || m && !z || Ql(x, p) && z || Ql(x, v) && (!z || f && z && !i) || !r && x.ctrlKey && z)
      return !1;
    if (!r && x.type === "touchstart" && x.touches?.length > 1)
      return x.preventDefault(), !1;
    if (!S && !f && !E && z || !c && (x.type === "mousedown" || x.type === "touchstart") || Array.isArray(c) && !c.includes(x.button) && x.type === "mousedown")
      return !1;
    const T = Array.isArray(c) && c.includes(x.button) || !x.button || x.button <= 1;
    return (!x.ctrlKey || z || n) && T;
  };
}
function oN({ domNode: n, minZoom: i, maxZoom: o, translateExtent: r, viewport: c, onPanZoom: f, onPanZoomStart: d, onPanZoomEnd: h, onDraggingChange: p }) {
  const v = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, y = n.getBoundingClientRect();
  let m = [
    [0, 0],
    [y.width, y.height]
  ];
  (typeof ResizeObserver < "u" ? new ResizeObserver((J) => {
    const N = J[0];
    N && (m = [
      [0, 0],
      [N.contentRect.width, N.contentRect.height]
    ]);
  }) : null)?.observe(n);
  const S = Ev().extent(() => m).scaleExtent([i, o]).translateExtent(r), E = nn(n).call(S);
  D({
    x: c.x,
    y: c.y,
    zoom: Oi(c.zoom, i, o)
  }, [
    [0, 0],
    [y.width, y.height]
  ], r);
  const z = E.on("wheel.zoom"), T = E.on("dblclick.zoom");
  S.wheelDelta(Fv);
  async function C(J, N) {
    return E ? new Promise((L) => {
      S?.interpolate(N?.interpolate === "linear" ? Bu : Jr).transform(pd(E, N?.duration, N?.ease, () => L(!0)), J);
    }) : !1;
  }
  function U({ noWheelClassName: J, noPanClassName: N, onPaneContextMenu: L, userSelectionActive: O, panOnScroll: j, panOnDrag: Y, panOnScrollMode: k, panOnScrollSpeed: et, preventScrolling: lt, zoomOnPinch: dt, zoomOnScroll: xt, zoomOnDoubleClick: M, panActivationKeyPressed: F = !1, zoomActivationKeyPressed: ht, lib: rt, onTransformChange: W, connectionInProgress: ft, paneClickDistance: gt, selectionOnDrag: st }) {
    O && !v.isZoomingOrPanning && _();
    const ct = j && !ht && !O;
    S.clickDistance(st ? 1 / 0 : !Nn(gt) || gt < 0 ? 0 : gt);
    const bt = ct ? eN({
      zoomPanValues: v,
      noWheelClassName: J,
      d3Selection: E,
      d3Zoom: S,
      panOnScrollMode: k,
      panOnScrollSpeed: et,
      zoomOnPinch: dt,
      onPanZoomStart: d,
      onPanZoom: f,
      onPanZoomEnd: h
    }) : nN({
      noWheelClassName: J,
      preventScrolling: lt,
      d3ZoomHandler: z
    });
    E.on("wheel.zoom", bt, { passive: !1 });
    const zt = lN({
      zoomPanValues: v,
      onDraggingChange: p,
      onPanZoomStart: d
    });
    S.on("start", zt);
    const Et = aN({
      zoomPanValues: v,
      panOnDrag: Y,
      onPaneContextMenu: !!L,
      onPanZoom: f,
      onTransformChange: W
    });
    S.on("zoom", Et);
    const Mt = iN({
      zoomPanValues: v,
      panOnDrag: Y,
      panOnScroll: j,
      onPaneContextMenu: L,
      onPanZoomEnd: h,
      onDraggingChange: p
    });
    S.on("end", Mt);
    const Ot = uN({
      panActivationKeyPressed: F,
      zoomActivationKeyPressed: ht,
      panOnDrag: Y,
      zoomOnScroll: xt,
      panOnScroll: j,
      zoomOnDoubleClick: M,
      zoomOnPinch: dt,
      userSelectionActive: O,
      noPanClassName: N,
      noWheelClassName: J,
      lib: rt,
      connectionInProgress: ft
    });
    S.filter(Ot), M ? E.on("dblclick.zoom", T) : E.on("dblclick.zoom", null);
  }
  function _() {
    S.on("zoom", null);
  }
  async function D(J, N, L) {
    const O = yd(J), j = S?.constrain()(O, N, L);
    return j && await C(j), j;
  }
  async function G(J, N) {
    const L = yd(J);
    return await C(L, N), L;
  }
  function B(J) {
    if (E) {
      const N = yd(J), L = E.property("__zoom");
      (L.k !== J.zoom || L.x !== J.x || L.y !== J.y) && S?.transform(E, N, null, { sync: !0 });
    }
  }
  function H() {
    const J = E ? Sv(E.node()) : { x: 0, y: 0, k: 1 };
    return { x: J.x, y: J.y, zoom: J.k };
  }
  async function $(J, N) {
    return E ? new Promise((L) => {
      S?.interpolate(N?.interpolate === "linear" ? Bu : Jr).scaleTo(pd(E, N?.duration, N?.ease, () => L(!0)), J);
    }) : !1;
  }
  async function tt(J, N) {
    return E ? new Promise((L) => {
      S?.interpolate(N?.interpolate === "linear" ? Bu : Jr).scaleBy(pd(E, N?.duration, N?.ease, () => L(!0)), J);
    }) : !1;
  }
  function ot(J) {
    S?.scaleExtent(J);
  }
  function nt(J) {
    S?.translateExtent(J);
  }
  function ut(J) {
    const N = !Nn(J) || J < 0 ? 0 : J;
    S?.clickDistance(N);
  }
  return {
    update: U,
    destroy: _,
    setViewport: G,
    setViewportConstrained: D,
    getViewport: H,
    scaleTo: $,
    scaleBy: tt,
    setScaleExtent: ot,
    setTranslateExtent: nt,
    syncViewport: B,
    setClickDistance: ut
  };
}
var Hi;
(function(n) {
  n.Line = "line", n.Handle = "handle";
})(Hi || (Hi = {}));
function rN({ width: n, prevWidth: i, height: o, prevHeight: r, affectsX: c, affectsY: f }) {
  const d = n - i, h = o - r, p = [d > 0 ? 1 : d < 0 ? -1 : 0, h > 0 ? 1 : h < 0 ? -1 : 0];
  return d && c && (p[0] = p[0] * -1), h && f && (p[1] = p[1] * -1), p;
}
function tp(n) {
  const i = n.includes("right") || n.includes("left"), o = n.includes("bottom") || n.includes("top"), r = n.includes("left"), c = n.includes("top");
  return {
    isHorizontal: i,
    isVertical: o,
    affectsX: r,
    affectsY: c
  };
}
function Zl(n, i) {
  return Math.max(0, i - n);
}
function Gl(n, i) {
  return Math.max(0, n - i);
}
function Zr(n, i, o) {
  return Math.max(0, i - n, n - o);
}
function ep(n, i) {
  return n ? !i : i;
}
function sN(n, i, o, r, c, f, d, h) {
  let { affectsX: p, affectsY: v } = i;
  const { isHorizontal: y, isVertical: m } = i, x = y && m, { xSnapped: S, ySnapped: E } = o, { minWidth: z, maxWidth: T, minHeight: C, maxHeight: U } = r, { x: _, y: D, width: G, height: B, aspectRatio: H } = n;
  let $ = Math.floor(y ? S - n.pointerX : 0), tt = Math.floor(m ? E - n.pointerY : 0);
  const ot = G + (p ? -$ : $), nt = B + (v ? -tt : tt), ut = -f[0] * G, J = -f[1] * B;
  let N = Zr(ot, z, T), L = Zr(nt, C, U);
  if (d) {
    let Y = 0, k = 0;
    p && $ < 0 ? Y = Zl(_ + $ + ut, d[0][0]) : !p && $ > 0 && (Y = Gl(_ + ot + ut, d[1][0])), v && tt < 0 ? k = Zl(D + tt + J, d[0][1]) : !v && tt > 0 && (k = Gl(D + nt + J, d[1][1])), N = Math.max(N, Y), L = Math.max(L, k);
  }
  if (h) {
    let Y = 0, k = 0;
    p && $ > 0 ? Y = Gl(_ + $, h[0][0]) : !p && $ < 0 && (Y = Zl(_ + ot, h[1][0])), v && tt > 0 ? k = Gl(D + tt, h[0][1]) : !v && tt < 0 && (k = Zl(D + nt, h[1][1])), N = Math.max(N, Y), L = Math.max(L, k);
  }
  if (c) {
    if (y) {
      const Y = Zr(ot / H, C, U) * H;
      if (N = Math.max(N, Y), d) {
        let k = 0;
        !p && !v || p && !v && x ? k = Gl(D + J + ot / H, d[1][1]) * H : k = Zl(D + J + (p ? $ : -$) / H, d[0][1]) * H, N = Math.max(N, k);
      }
      if (h) {
        let k = 0;
        !p && !v || p && !v && x ? k = Zl(D + ot / H, h[1][1]) * H : k = Gl(D + (p ? $ : -$) / H, h[0][1]) * H, N = Math.max(N, k);
      }
    }
    if (m) {
      const Y = Zr(nt * H, z, T) / H;
      if (L = Math.max(L, Y), d) {
        let k = 0;
        !p && !v || v && !p && x ? k = Gl(_ + nt * H + ut, d[1][0]) / H : k = Zl(_ + (v ? tt : -tt) * H + ut, d[0][0]) / H, L = Math.max(L, k);
      }
      if (h) {
        let k = 0;
        !p && !v || v && !p && x ? k = Zl(_ + nt * H, h[1][0]) / H : k = Gl(_ + (v ? tt : -tt) * H, h[0][0]) / H, L = Math.max(L, k);
      }
    }
  }
  tt = tt + (tt < 0 ? L : -L), $ = $ + ($ < 0 ? N : -N), c && (x ? ot > nt * H ? tt = (ep(p, v) ? -$ : $) / H : $ = (ep(p, v) ? -tt : tt) * H : y ? (tt = $ / H, v = p) : ($ = tt * H, p = v));
  const O = p ? _ + $ : _, j = v ? D + tt : D;
  return {
    width: G + (p ? -$ : $),
    height: B + (v ? -tt : tt),
    x: f[0] * $ * (p ? -1 : 1) + O,
    y: f[1] * tt * (v ? -1 : 1) + j
  };
}
const Wv = { width: 0, height: 0, x: 0, y: 0 }, cN = {
  ...Wv,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function fN(n, i, o) {
  const r = i.position.x + n.position.x, c = i.position.y + n.position.y, f = n.measured.width ?? 0, d = n.measured.height ?? 0, h = o[0] * f, p = o[1] * d;
  return [
    [r - h, c - p],
    [r + f - h, c + d - p]
  ];
}
function dN({ domNode: n, nodeId: i, getStoreItems: o, onChange: r, onEnd: c }) {
  const f = nn(n);
  let d = {
    controlDirection: tp("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function h({ controlPosition: v, boundaries: y, keepAspectRatio: m, resizeDirection: x, onResizeStart: S, onResize: E, onResizeEnd: z, shouldResize: T }) {
    let C = { ...Wv }, U = { ...cN };
    d = {
      boundaries: y,
      resizeDirection: x,
      keepAspectRatio: m,
      controlDirection: tp(v)
    };
    let _, D = null, G = [], B, H, $;
    const tt = ov().on("start", (ot) => {
      const { nodeLookup: nt, transform: ut, snapGrid: J, snapToGrid: N, nodeOrigin: L, paneDomNode: O } = o();
      if (_ = nt.get(i), !_)
        return;
      D = O?.getBoundingClientRect() ?? null;
      const { xSnapped: j, ySnapped: Y } = Lu(ot.sourceEvent, {
        transform: ut,
        snapGrid: J,
        snapToGrid: N,
        containerBounds: D
      });
      C = {
        width: _.measured.width ?? 0,
        height: _.measured.height ?? 0,
        x: _.position.x ?? 0,
        y: _.position.y ?? 0
      }, U = {
        ...C,
        pointerX: j,
        pointerY: Y,
        aspectRatio: C.width / C.height
      }, B = void 0, H = Aa(_.extent) ? _.extent : void 0, _.parentId && (_.extent === "parent" || _.expandParent) && (B = nt.get(_.parentId)), B && _.extent === "parent" && (H = [
        [0, 0],
        [B.measured.width, B.measured.height]
      ]), G = [], $ = void 0;
      for (const [k, et] of nt)
        if (et.parentId === i && (G.push({
          id: k,
          position: { ...et.position },
          extent: et.extent
        }), et.extent === "parent" || et.expandParent)) {
          const lt = fN(et, _, et.origin ?? L);
          $ ? $ = [
            [Math.min(lt[0][0], $[0][0]), Math.min(lt[0][1], $[0][1])],
            [Math.max(lt[1][0], $[1][0]), Math.max(lt[1][1], $[1][1])]
          ] : $ = lt;
        }
      S?.(ot, { ...C });
    }).on("drag", (ot) => {
      const { transform: nt, snapGrid: ut, snapToGrid: J, nodeOrigin: N } = o(), L = Lu(ot.sourceEvent, {
        transform: nt,
        snapGrid: ut,
        snapToGrid: J,
        containerBounds: D
      }), O = [];
      if (!_)
        return;
      const { x: j, y: Y, width: k, height: et } = C, lt = {}, dt = _.origin ?? N, { width: xt, height: M, x: F, y: ht } = sN(U, d.controlDirection, L, d.boundaries, d.keepAspectRatio, dt, H, $), rt = xt !== k, W = M !== et, ft = F !== j && rt, gt = ht !== Y && W;
      if (!ft && !gt && !rt && !W)
        return;
      const st = {
        prevValues: { ...C },
        startX: U.x,
        startY: U.y,
        childNodes: G.map((Et) => ({
          ...Et,
          position: { ...Et.position }
        }))
      };
      if ((ft || gt || dt[0] === 1 || dt[1] === 1) && (lt.x = ft ? F : C.x, lt.y = gt ? ht : C.y, C.x = lt.x, C.y = lt.y, G.length > 0)) {
        const Et = F - j, Mt = ht - Y;
        for (const Ot of G)
          Ot.position = {
            x: Ot.position.x - Et + dt[0] * (xt - k),
            y: Ot.position.y - Mt + dt[1] * (M - et)
          }, O.push(Ot);
      }
      if ((rt || W) && (lt.width = rt && (!d.resizeDirection || d.resizeDirection === "horizontal") ? xt : C.width, lt.height = W && (!d.resizeDirection || d.resizeDirection === "vertical") ? M : C.height, C.width = lt.width, C.height = lt.height), B && _.expandParent) {
        const Et = dt[0] * (lt.width ?? 0);
        lt.x && lt.x < Et && (C.x = Et, U.x = U.x - (lt.x - Et));
        const Mt = dt[1] * (lt.height ?? 0);
        lt.y && lt.y < Mt && (C.y = Mt, U.y = U.y - (lt.y - Mt));
      }
      const ct = rN({
        width: C.width,
        prevWidth: k,
        height: C.height,
        prevHeight: et,
        affectsX: d.controlDirection.affectsX,
        affectsY: d.controlDirection.affectsY
      }), bt = { ...C, direction: ct };
      if (T?.(ot, bt) === !1) {
        C = st.prevValues, U.x = st.startX, U.y = st.startY, G.forEach((Et, Mt) => {
          Et.position = st.childNodes[Mt].position;
        });
        return;
      }
      E?.(ot, bt), r(lt, O);
    }).on("end", (ot) => {
      z?.(ot, { ...C }), c?.({ ...C });
    });
    f.call(tt);
  }
  function p() {
    f.on(".drag", null);
  }
  return {
    update: h,
    destroy: p
  };
}
var vd = { exports: {} }, xd = {}, bd = { exports: {} }, Sd = {};
var np;
function hN() {
  if (np) return Sd;
  np = 1;
  var n = ku();
  function i(m, x) {
    return m === x && (m !== 0 || 1 / m === 1 / x) || m !== m && x !== x;
  }
  var o = typeof Object.is == "function" ? Object.is : i, r = n.useState, c = n.useEffect, f = n.useLayoutEffect, d = n.useDebugValue;
  function h(m, x) {
    var S = x(), E = r({ inst: { value: S, getSnapshot: x } }), z = E[0].inst, T = E[1];
    return f(
      function() {
        z.value = S, z.getSnapshot = x, p(z) && T({ inst: z });
      },
      [m, S, x]
    ), c(
      function() {
        return p(z) && T({ inst: z }), m(function() {
          p(z) && T({ inst: z });
        });
      },
      [m]
    ), d(S), S;
  }
  function p(m) {
    var x = m.getSnapshot;
    m = m.value;
    try {
      var S = x();
      return !o(m, S);
    } catch {
      return !0;
    }
  }
  function v(m, x) {
    return x();
  }
  var y = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? v : h;
  return Sd.useSyncExternalStore = n.useSyncExternalStore !== void 0 ? n.useSyncExternalStore : y, Sd;
}
var lp;
function gN() {
  return lp || (lp = 1, bd.exports = hN()), bd.exports;
}
var ap;
function mN() {
  if (ap) return xd;
  ap = 1;
  var n = ku(), i = gN();
  function o(v, y) {
    return v === y && (v !== 0 || 1 / v === 1 / y) || v !== v && y !== y;
  }
  var r = typeof Object.is == "function" ? Object.is : o, c = i.useSyncExternalStore, f = n.useRef, d = n.useEffect, h = n.useMemo, p = n.useDebugValue;
  return xd.useSyncExternalStoreWithSelector = function(v, y, m, x, S) {
    var E = f(null);
    if (E.current === null) {
      var z = { hasValue: !1, value: null };
      E.current = z;
    } else z = E.current;
    E = h(
      function() {
        function C(B) {
          if (!U) {
            if (U = !0, _ = B, B = x(B), S !== void 0 && z.hasValue) {
              var H = z.value;
              if (S(H, B))
                return D = H;
            }
            return D = B;
          }
          if (H = D, r(_, B)) return H;
          var $ = x(B);
          return S !== void 0 && S(H, $) ? (_ = B, H) : (_ = B, D = $);
        }
        var U = !1, _, D, G = m === void 0 ? null : m;
        return [
          function() {
            return C(y());
          },
          G === null ? void 0 : function() {
            return C(G());
          }
        ];
      },
      [y, m, x, S]
    );
    var T = c(v, E[0], E[1]);
    return d(
      function() {
        z.hasValue = !0, z.value = T;
      },
      [T]
    ), p(T), T;
  }, xd;
}
var ip;
function yN() {
  return ip || (ip = 1, vd.exports = mN()), vd.exports;
}
var pN = yN();
const vN = /* @__PURE__ */ Qp(pN), xN = {}, up = (n) => {
  let i;
  const o = /* @__PURE__ */ new Set(), r = (y, m) => {
    const x = typeof y == "function" ? y(i) : y;
    if (!Object.is(x, i)) {
      const S = i;
      i = m ?? (typeof x != "object" || x === null) ? x : Object.assign({}, i, x), o.forEach((E) => E(i, S));
    }
  }, c = () => i, p = { setState: r, getState: c, getInitialState: () => v, subscribe: (y) => (o.add(y), () => o.delete(y)), destroy: () => {
    (xN ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), o.clear();
  } }, v = i = n(r, c, p);
  return p;
}, bN = (n) => n ? up(n) : up, { useDebugValue: SN } = BS, { useSyncExternalStoreWithSelector: EN } = vN, wN = (n) => n;
function Pv(n, i = wN, o) {
  const r = EN(
    n.subscribe,
    n.getState,
    n.getServerState || n.getInitialState,
    i,
    o
  );
  return SN(r), r;
}
const op = (n, i) => {
  const o = bN(n), r = (c, f = i) => Pv(o, c, f);
  return Object.assign(r, o), r;
}, _N = (n, i) => n ? op(n, i) : op;
function le(n, i) {
  if (Object.is(n, i))
    return !0;
  if (typeof n != "object" || n === null || typeof i != "object" || i === null)
    return !1;
  if (n instanceof Map && i instanceof Map) {
    if (n.size !== i.size) return !1;
    for (const [r, c] of n)
      if (!Object.is(c, i.get(r)))
        return !1;
    return !0;
  }
  if (n instanceof Set && i instanceof Set) {
    if (n.size !== i.size) return !1;
    for (const r of n)
      if (!i.has(r))
        return !1;
    return !0;
  }
  const o = Object.keys(n);
  if (o.length !== Object.keys(i).length)
    return !1;
  for (const r of o)
    if (!Object.prototype.hasOwnProperty.call(i, r) || !Object.is(n[r], i[r]))
      return !1;
  return !0;
}
var t1 = $p();
const bs = Q.createContext(null), NN = bs.Provider, e1 = Cn.error001("react");
function Vt(n, i) {
  const o = Q.useContext(bs);
  if (o === null)
    throw new Error(e1);
  return Pv(o, n, i);
}
function Wt() {
  const n = Q.useContext(bs);
  if (n === null)
    throw new Error(e1);
  return Q.useMemo(() => ({
    getState: n.getState,
    setState: n.setState,
    subscribe: n.subscribe
  }), [n]);
}
const rp = { display: "none" }, TN = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, n1 = "react-flow__node-desc", l1 = "react-flow__edge-desc", CN = "react-flow__aria-live", MN = (n) => n.ariaLiveMessage, zN = (n) => n.ariaLabelConfig;
function AN({ rfId: n }) {
  const i = Vt(MN);
  return w.jsx("div", { id: `${CN}-${n}`, "aria-live": "assertive", "aria-atomic": "true", style: TN, children: i });
}
function DN({ rfId: n, disableKeyboardA11y: i }) {
  const o = Vt(zN);
  return w.jsxs(w.Fragment, { children: [w.jsx("div", { id: `${n1}-${n}`, style: rp, children: i ? o["node.a11yDescription.default"] : o["node.a11yDescription.keyboardDisabled"] }), w.jsx("div", { id: `${l1}-${n}`, style: rp, children: o["edge.a11yDescription.default"] }), !i && w.jsx(AN, { rfId: n })] });
}
const Ss = Q.forwardRef(({ position: n = "top-left", children: i, className: o, style: r, ...c }, f) => {
  const d = `${n}`.split("-");
  return w.jsx("div", { className: he(["react-flow__panel", o, ...d]), style: r, ref: f, ...c, children: i });
});
Ss.displayName = "Panel";
const sp = "https://reactflow.dev?utm_source=attribution";
function ON({ proOptions: n, position: i = "bottom-right" }) {
  return Q.useEffect(() => {
  }, []), n?.hideAttribution ? null : w.jsx(Ss, { position: i, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${sp}`, children: w.jsx("a", { href: sp, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const RN = (n) => {
  const i = [], o = [];
  for (const [, r] of n.nodeLookup)
    r.selected && i.push(r.internals.userNode);
  for (const [, r] of n.edgeLookup)
    r.selected && o.push(r);
  return { selectedNodes: i, selectedEdges: o };
}, Gr = (n) => n.id;
function HN(n, i) {
  return le(n.selectedNodes.map(Gr), i.selectedNodes.map(Gr)) && le(n.selectedEdges.map(Gr), i.selectedEdges.map(Gr));
}
function jN({ onSelectionChange: n }) {
  const i = Wt(), { selectedNodes: o, selectedEdges: r } = Vt(RN, HN);
  return Q.useEffect(() => {
    const c = { nodes: o, edges: r };
    n?.(c), i.getState().onSelectionChangeHandlers.forEach((f) => f(c));
  }, [o, r, n]), null;
}
const UN = (n) => !!n.onSelectionChangeHandlers;
function BN({ onSelectionChange: n }) {
  const i = Vt(UN);
  return n || i ? w.jsx(jN, { onSelectionChange: n }) : null;
}
const a1 = [0, 0], LN = { x: 0, y: 0, zoom: 1 }, VN = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig",
  "zIndexMode"
], cp = [...VN, "rfId"], YN = (n) => ({
  setNodes: n.setNodes,
  setEdges: n.setEdges,
  setMinZoom: n.setMinZoom,
  setMaxZoom: n.setMaxZoom,
  setTranslateExtent: n.setTranslateExtent,
  setNodeExtent: n.setNodeExtent,
  reset: n.reset,
  setDefaultNodesAndEdges: n.setDefaultNodesAndEdges
}), fp = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Zu,
  nodeOrigin: a1,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function qN(n) {
  const { setNodes: i, setEdges: o, setMinZoom: r, setMaxZoom: c, setTranslateExtent: f, setNodeExtent: d, reset: h, setDefaultNodesAndEdges: p } = Vt(YN, le), v = Wt();
  Q.useEffect(() => (p(n.defaultNodes, n.defaultEdges), () => {
    y.current = fp, h();
  }), []);
  const y = Q.useRef(fp);
  return Q.useEffect(
    () => {
      for (const m of cp) {
        const x = n[m], S = y.current[m];
        x !== S && (typeof n[m] > "u" || (m === "nodes" ? i(x) : m === "edges" ? o(x) : m === "minZoom" ? r(x) : m === "maxZoom" ? c(x) : m === "translateExtent" ? f(x) : m === "nodeExtent" ? d(x) : m === "ariaLabelConfig" ? v.setState({ ariaLabelConfig: N2(x) }) : m === "fitView" ? v.setState({ fitViewQueued: x }) : m === "fitViewOptions" ? v.setState({ fitViewOptions: x }) : v.setState({ [m]: x })));
      }
      y.current = n;
    },
    // Only re-run the effect if one of the fields we track changes
    cp.map((m) => n[m])
  ), null;
}
function dp() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function XN(n) {
  const [i, o] = Q.useState(n === "system" ? null : n);
  return Q.useEffect(() => {
    if (n !== "system") {
      o(n);
      return;
    }
    const r = dp(), c = () => o(r?.matches ? "dark" : "light");
    return c(), r?.addEventListener("change", c), () => {
      r?.removeEventListener("change", c);
    };
  }, [n]), i !== null ? i : dp()?.matches ? "dark" : "light";
}
const hp = typeof document < "u" ? document : null;
function Ku(n = null, i = { target: hp, actInsideInputWithModifier: !0 }) {
  const [o, r] = Q.useState(!1), c = Q.useRef(!1), f = Q.useRef(/* @__PURE__ */ new Set([])), [d, h] = Q.useMemo(() => {
    if (n !== null) {
      const v = (Array.isArray(n) ? n : [n]).filter((m) => typeof m == "string").map((m) => m.replace(/\+/g, `
`).replace(`

`, `
+`).split(`
`)), y = v.reduce((m, x) => m.concat(...x), []);
      return [v, y];
    }
    return [[], []];
  }, [n]);
  return Q.useEffect(() => {
    const p = i?.target ?? hp, v = i?.actInsideInputWithModifier ?? !0;
    if (n !== null) {
      const y = (S) => {
        if (c.current = S.ctrlKey || S.metaKey || S.shiftKey || S.altKey, (!c.current || c.current && !v) && Bv(S))
          return !1;
        const z = mp(S.code, h);
        if (f.current.add(S[z]), gp(d, f.current, !1)) {
          const T = S.composedPath?.()?.[0] || S.target, C = T?.nodeName === "BUTTON" || T?.nodeName === "A";
          i.preventDefault !== !1 && (c.current || !C) && S.preventDefault(), r(!0);
        }
      }, m = (S) => {
        const E = mp(S.code, h);
        gp(d, f.current, !0) ? (r(!1), f.current.clear()) : f.current.delete(S[E]), S.key === "Meta" && f.current.clear(), c.current = !1;
      }, x = () => {
        f.current.clear(), r(!1);
      };
      return p?.addEventListener("keydown", y), p?.addEventListener("keyup", m), window.addEventListener("blur", x), window.addEventListener("contextmenu", x), () => {
        p?.removeEventListener("keydown", y), p?.removeEventListener("keyup", m), window.removeEventListener("blur", x), window.removeEventListener("contextmenu", x);
      };
    }
  }, [n, r]), o;
}
function gp(n, i, o) {
  return n.filter((r) => o || r.length === i.size).some((r) => r.every((c) => i.has(c)));
}
function mp(n, i) {
  return i.includes(n) ? "code" : "key";
}
const ZN = () => {
  const n = Wt();
  return Q.useMemo(() => ({
    zoomIn: async (i) => {
      const { panZoom: o } = n.getState();
      return o ? o.scaleBy(1.2, i) : !1;
    },
    zoomOut: async (i) => {
      const { panZoom: o } = n.getState();
      return o ? o.scaleBy(1 / 1.2, i) : !1;
    },
    zoomTo: async (i, o) => {
      const { panZoom: r } = n.getState();
      return r ? r.scaleTo(i, o) : !1;
    },
    getZoom: () => n.getState().transform[2],
    setViewport: async (i, o) => {
      const { transform: [r, c, f], panZoom: d } = n.getState();
      return d ? (await d.setViewport({
        x: i.x ?? r,
        y: i.y ?? c,
        zoom: i.zoom ?? f
      }, o), !0) : !1;
    },
    getViewport: () => {
      const [i, o, r] = n.getState().transform;
      return { x: i, y: o, zoom: r };
    },
    setCenter: async (i, o, r) => n.getState().setCenter(i, o, r),
    fitBounds: async (i, o) => {
      const { width: r, height: c, minZoom: f, maxZoom: d, panZoom: h } = n.getState(), p = Fd(i, r, c, f, d, o?.padding ?? 0.1);
      return h ? (await h.setViewport(p, {
        duration: o?.duration,
        ease: o?.ease,
        interpolate: o?.interpolate
      }), !0) : !1;
    },
    screenToFlowPosition: (i, o = {}) => {
      const { transform: r, snapGrid: c, snapToGrid: f, domNode: d } = n.getState();
      if (!d)
        return i;
      const { x: h, y: p } = d.getBoundingClientRect(), v = {
        x: i.x - h,
        y: i.y - p
      }, y = o.snapGrid ?? c, m = o.snapToGrid ?? f;
      return to(v, r, m, y);
    },
    flowToScreenPosition: (i) => {
      const { transform: o, domNode: r } = n.getState();
      if (!r)
        return i;
      const { x: c, y: f } = r.getBoundingClientRect(), d = Ri(i, o);
      return {
        x: d.x + c,
        y: d.y + f
      };
    }
  }), []);
};
function i1(n, i) {
  const o = [], r = /* @__PURE__ */ new Map(), c = [];
  for (const f of n)
    if (f.type === "add") {
      c.push(f);
      continue;
    } else if (f.type === "remove" || f.type === "replace")
      r.set(f.id, [f]);
    else {
      const d = r.get(f.id);
      d ? d.push(f) : r.set(f.id, [f]);
    }
  for (const f of i) {
    const d = r.get(f.id);
    if (!d) {
      o.push(f);
      continue;
    }
    if (d[0].type === "remove")
      continue;
    if (d[0].type === "replace") {
      o.push({ ...d[0].item });
      continue;
    }
    const h = { ...f };
    for (const p of d)
      GN(p, h);
    o.push(h);
  }
  return c.length && c.forEach((f) => {
    f.index !== void 0 ? o.splice(f.index, 0, { ...f.item }) : o.push({ ...f.item });
  }), o;
}
function GN(n, i) {
  switch (n.type) {
    case "select": {
      i.selected = n.selected;
      break;
    }
    case "position": {
      typeof n.position < "u" && (i.position = n.position), typeof n.dragging < "u" && (i.dragging = n.dragging);
      break;
    }
    case "dimensions": {
      typeof n.dimensions < "u" && (i.measured = {
        ...n.dimensions
      }, n.setAttributes && ((n.setAttributes === !0 || n.setAttributes === "width") && (i.width = n.dimensions.width), (n.setAttributes === !0 || n.setAttributes === "height") && (i.height = n.dimensions.height))), typeof n.resizing == "boolean" && (i.resizing = n.resizing);
      break;
    }
  }
}
function u1(n, i) {
  return i1(n, i);
}
function QN(n, i) {
  return i1(n, i);
}
function wa(n, i) {
  return {
    id: n,
    type: "select",
    selected: i
  };
}
function Ti(n, i = /* @__PURE__ */ new Set(), o = !1) {
  const r = [];
  for (const [c, f] of n) {
    const d = i.has(c);
    !(f.selected === void 0 && !d) && f.selected !== d && (o && (f.selected = d), r.push(wa(f.id, d)));
  }
  return r;
}
function yp({ items: n = [], lookup: i }) {
  const o = [], r = new Map(n.map((c) => [c.id, c]));
  for (const [c, f] of n.entries()) {
    const d = i.get(f.id), h = d?.internals?.userNode ?? d;
    h !== void 0 && h !== f && o.push({ id: f.id, item: f, type: "replace" }), h === void 0 && o.push({ item: f, type: "add", index: c });
  }
  for (const [c] of i)
    r.get(c) === void 0 && o.push({ id: c, type: "remove" });
  return o;
}
function pp(n) {
  return {
    id: n.id,
    type: "remove"
  };
}
const $N = Ov();
function KN(n, i, o = {}) {
  return D2(n, i, {
    ...o,
    onError: o.onError ?? $N
  });
}
const vp = (n) => p2(n), kN = (n) => Tv(n);
function o1(n) {
  return Q.forwardRef(n);
}
const r1 = typeof window < "u" ? Q.useLayoutEffect : Q.useEffect;
function xp(n) {
  const [i, o] = Q.useState(BigInt(0)), [r] = Q.useState(() => JN(() => o((c) => c + BigInt(1))));
  return r1(() => {
    const c = r.get();
    c.length && (n(c), r.reset());
  }, [i]), r;
}
function JN(n) {
  let i = [];
  return {
    get: () => i,
    reset: () => {
      i = [];
    },
    push: (o) => {
      i.push(o), n();
    }
  };
}
const s1 = Q.createContext(null);
function IN({ children: n }) {
  const i = Wt(), o = Q.useCallback((h) => {
    const { nodes: p = [], setNodes: v, hasDefaultNodes: y, onNodesChange: m, nodeLookup: x, fitViewQueued: S, onNodesChangeMiddlewareMap: E } = i.getState();
    let z = p;
    for (const C of h)
      z = typeof C == "function" ? C(z) : C;
    let T = yp({
      items: z,
      lookup: x
    });
    for (const C of E.values())
      T = C(T);
    y && v(z), T.length > 0 ? m?.(T) : S && window.requestAnimationFrame(() => {
      const { fitViewQueued: C, nodes: U, setNodes: _ } = i.getState();
      C && _(U);
    });
  }, []), r = xp(o), c = Q.useCallback((h) => {
    const { edges: p = [], setEdges: v, hasDefaultEdges: y, onEdgesChange: m, edgeLookup: x } = i.getState();
    let S = p;
    for (const E of h)
      S = typeof E == "function" ? E(S) : E;
    y ? v(S) : m && m(yp({
      items: S,
      lookup: x
    }));
  }, []), f = xp(c), d = Q.useMemo(() => ({ nodeQueue: r, edgeQueue: f }), []);
  return w.jsx(s1.Provider, { value: d, children: n });
}
function FN() {
  const n = Q.useContext(s1);
  if (!n)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return n;
}
const WN = (n) => !!n.panZoom;
function Es() {
  const n = ZN(), i = Wt(), o = FN(), r = Vt(WN), c = Q.useMemo(() => {
    const f = (m) => i.getState().nodeLookup.get(m), d = (m) => {
      o.nodeQueue.push(m);
    }, h = (m) => {
      o.edgeQueue.push(m);
    }, p = (m) => {
      const { nodeLookup: x, nodeOrigin: S } = i.getState(), E = vp(m) ? m : x.get(m.id), z = E.parentId ? Hv(E.position, E.measured, E.parentId, x, S) : E.position, T = {
        ...E,
        position: z,
        width: E.measured?.width ?? E.width,
        height: E.measured?.height ?? E.height
      };
      return Qu(T);
    }, v = (m, x, S = { replace: !1 }) => {
      d((E) => E.map((z) => {
        if (z.id === m) {
          const T = typeof x == "function" ? x(z) : x;
          return S.replace && vp(T) ? T : { ...z, ...T };
        }
        return z;
      }));
    }, y = (m, x, S = { replace: !1 }) => {
      h((E) => E.map((z) => {
        if (z.id === m) {
          const T = typeof x == "function" ? x(z) : x;
          return S.replace && kN(T) ? T : { ...z, ...T };
        }
        return z;
      }));
    };
    return {
      getNodes: () => i.getState().nodes.map((m) => ({ ...m })),
      getNode: (m) => f(m)?.internals.userNode,
      getInternalNode: f,
      getEdges: () => {
        const { edges: m = [] } = i.getState();
        return m.map((x) => ({ ...x }));
      },
      getEdge: (m) => i.getState().edgeLookup.get(m),
      setNodes: d,
      setEdges: h,
      addNodes: (m) => {
        const x = Array.isArray(m) ? m : [m];
        o.nodeQueue.push((S) => [...S, ...x]);
      },
      addEdges: (m) => {
        const x = Array.isArray(m) ? m : [m];
        o.edgeQueue.push((S) => [...S, ...x]);
      },
      toObject: () => {
        const { nodes: m = [], edges: x = [], transform: S } = i.getState(), [E, z, T] = S;
        return {
          nodes: m.map((C) => ({ ...C })),
          edges: x.map((C) => ({ ...C })),
          viewport: {
            x: E,
            y: z,
            zoom: T
          }
        };
      },
      deleteElements: async ({ nodes: m = [], edges: x = [] }) => {
        const { nodes: S, edges: E, onNodesDelete: z, onEdgesDelete: T, triggerNodeChanges: C, triggerEdgeChanges: U, onDelete: _, onBeforeDelete: D } = i.getState(), { nodes: G, edges: B } = await S2({
          nodesToRemove: m,
          edgesToRemove: x,
          nodes: S,
          edges: E,
          onBeforeDelete: D
        }), H = B.length > 0, $ = G.length > 0;
        if (H) {
          const tt = B.map(pp);
          T?.(B), U(tt);
        }
        if ($) {
          const tt = G.map(pp);
          z?.(G), C(tt);
        }
        return ($ || H) && _?.({ nodes: G, edges: B }), { deletedNodes: G, deletedEdges: B };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (m, x = !0, S) => {
        const E = Zy(m), z = E ? m : p(m), T = S !== void 0;
        return z ? (S || i.getState().nodes).filter((C) => {
          const U = i.getState().nodeLookup.get(C.id);
          if (U && !E && (C.id === m.id || !U.internals.positionAbsolute))
            return !1;
          const _ = Qu(T ? C : U), D = rs(_, z);
          return x && D > 0 || D >= _.width * _.height || D >= z.width * z.height;
        }) : [];
      },
      isNodeIntersecting: (m, x, S = !0) => {
        const z = Zy(m) ? m : p(m);
        if (!z)
          return !1;
        const T = rs(z, x);
        return S && T > 0 || T >= x.width * x.height || T >= z.width * z.height;
      },
      updateNode: v,
      updateNodeData: (m, x, S = { replace: !1 }) => {
        v(m, (E) => {
          const z = typeof x == "function" ? x(E) : x;
          return S.replace ? { ...E, data: z } : { ...E, data: { ...E.data, ...z } };
        }, S);
      },
      updateEdge: y,
      updateEdgeData: (m, x, S = { replace: !1 }) => {
        y(m, (E) => {
          const z = typeof x == "function" ? x(E) : x;
          return S.replace ? { ...E, data: z } : { ...E, data: { ...E.data, ...z } };
        }, S);
      },
      getNodesBounds: (m) => {
        const { nodeLookup: x, nodeOrigin: S } = i.getState();
        return Cv(m, { nodeLookup: x, nodeOrigin: S });
      },
      getHandleConnections: ({ type: m, id: x, nodeId: S }) => Array.from(i.getState().connectionLookup.get(`${S}-${m}${x ? `-${x}` : ""}`)?.values() ?? []),
      getNodeConnections: ({ type: m, handleId: x, nodeId: S }) => Array.from(i.getState().connectionLookup.get(`${S}${m ? x ? `-${m}-${x}` : `-${m}` : ""}`)?.values() ?? []),
      fitView: async (m) => {
        const x = i.getState().fitViewResolver ?? _2();
        return i.setState({ fitViewQueued: !0, fitViewOptions: m, fitViewResolver: x }), o.nodeQueue.push((S) => [...S]), x.promise;
      }
    };
  }, []);
  return Q.useMemo(() => ({
    ...c,
    ...n,
    viewportInitialized: r
  }), [r]);
}
const bp = (n) => n.selected, PN = typeof window < "u" ? window : void 0;
function t3({ deleteKeyCode: n, multiSelectionKeyCode: i }) {
  const o = Wt(), { deleteElements: r } = Es(), c = Ku(n, { actInsideInputWithModifier: !1 }), f = Ku(i, { target: PN });
  Q.useEffect(() => {
    if (c) {
      const { edges: d, nodes: h } = o.getState();
      r({ nodes: h.filter(bp), edges: d.filter(bp) }), o.setState({ nodesSelectionActive: !1 });
    }
  }, [c]), Q.useEffect(() => {
    o.setState({ multiSelectionActive: f });
  }, [f]);
}
function e3(n) {
  const i = Wt();
  Q.useEffect(() => {
    const o = () => {
      if (!n.current || !(n.current.checkVisibility?.() ?? !0))
        return !1;
      const r = Wd(n.current);
      (r.height === 0 || r.width === 0) && i.getState().onError?.("004", Cn.error004()), i.setState({ width: r.width || 500, height: r.height || 500 });
    };
    if (n.current) {
      o(), window.addEventListener("resize", o);
      const r = new ResizeObserver(() => o());
      return r.observe(n.current), () => {
        window.removeEventListener("resize", o), r && n.current && r.unobserve(n.current);
      };
    }
  }, []);
}
const ws = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, n3 = (n) => ({
  userSelectionActive: n.userSelectionActive,
  lib: n.lib,
  connectionInProgress: n.connection.inProgress
});
function l3({ onPaneContextMenu: n, zoomOnScroll: i = !0, zoomOnPinch: o = !0, panOnScroll: r = !1, panActivationKeyPressed: c, panOnScrollSpeed: f = 0.5, panOnScrollMode: d = Ta.Free, zoomOnDoubleClick: h = !0, panOnDrag: p = !0, defaultViewport: v, translateExtent: y, minZoom: m, maxZoom: x, zoomActivationKeyCode: S, preventScrolling: E = !0, children: z, noWheelClassName: T, noPanClassName: C, onViewportChange: U, isControlledViewport: _, paneClickDistance: D, selectionOnDrag: G }) {
  const B = Wt(), H = Q.useRef(null), { userSelectionActive: $, lib: tt, connectionInProgress: ot } = Vt(n3, le), nt = Ku(S), ut = Q.useRef();
  e3(H);
  const J = Q.useCallback((N) => {
    U?.({ x: N[0], y: N[1], zoom: N[2] }), _ || B.setState({ transform: N });
  }, [U, _]);
  return Q.useEffect(() => {
    if (H.current) {
      ut.current = oN({
        domNode: H.current,
        minZoom: m,
        maxZoom: x,
        translateExtent: y,
        viewport: v,
        onDraggingChange: (j) => B.setState((Y) => Y.paneDragging === j ? Y : { paneDragging: j }),
        onPanZoomStart: (j, Y) => {
          const { onViewportChangeStart: k, onMoveStart: et } = B.getState();
          et?.(j, Y), k?.(Y);
        },
        onPanZoom: (j, Y) => {
          const { onViewportChange: k, onMove: et } = B.getState();
          et?.(j, Y), k?.(Y);
        },
        onPanZoomEnd: (j, Y) => {
          const { onViewportChangeEnd: k, onMoveEnd: et } = B.getState();
          et?.(j, Y), k?.(Y);
        }
      });
      const { x: N, y: L, zoom: O } = ut.current.getViewport();
      return B.setState({
        panZoom: ut.current,
        transform: [N, L, O],
        domNode: H.current.closest(".react-flow")
      }), () => {
        ut.current?.destroy();
      };
    }
  }, []), Q.useEffect(() => {
    ut.current?.update({
      onPaneContextMenu: n,
      zoomOnScroll: i,
      zoomOnPinch: o,
      panOnScroll: r,
      panActivationKeyPressed: c,
      panOnScrollSpeed: f,
      panOnScrollMode: d,
      zoomOnDoubleClick: h,
      panOnDrag: p,
      zoomActivationKeyPressed: nt,
      preventScrolling: E,
      noPanClassName: C,
      userSelectionActive: $,
      noWheelClassName: T,
      lib: tt,
      onTransformChange: J,
      connectionInProgress: ot,
      selectionOnDrag: G,
      paneClickDistance: D
    });
  }, [
    n,
    i,
    o,
    r,
    c,
    f,
    d,
    h,
    p,
    nt,
    E,
    C,
    $,
    T,
    tt,
    J,
    ot,
    G,
    D
  ]), w.jsx("div", { className: "react-flow__renderer", ref: H, style: ws, children: z });
}
const a3 = (n) => ({
  userSelectionActive: n.userSelectionActive,
  userSelectionRect: n.userSelectionRect
});
function i3() {
  const { userSelectionActive: n, userSelectionRect: i } = Vt(a3, le);
  return n && i ? w.jsx("div", { className: "react-flow__selection react-flow__container", style: {
    width: i.width,
    height: i.height,
    transform: `translate(${i.x}px, ${i.y}px)`
  } }) : null;
}
const Ed = (n, i) => (o) => {
  o.target === i.current && n?.(o);
}, u3 = (n) => ({
  userSelectionActive: n.userSelectionActive,
  elementsSelectable: n.elementsSelectable,
  dragging: n.paneDragging,
  panBy: n.panBy,
  autoPanSpeed: n.autoPanSpeed
});
function o3({ isSelecting: n, selectionKeyPressed: i, selectionMode: o = Gu.Full, panOnDrag: r, autoPanOnSelection: c, paneClickDistance: f, selectionOnDrag: d, onSelectionStart: h, onSelectionEnd: p, onPaneClick: v, onPaneContextMenu: y, onPaneScroll: m, onPaneMouseEnter: x, onPaneMouseMove: S, onPaneMouseLeave: E, children: z }) {
  const T = Q.useRef(0), C = Wt(), { userSelectionActive: U, elementsSelectable: _, dragging: D, panBy: G, autoPanSpeed: B } = Vt(u3, le), H = _ && (n || U), $ = Q.useRef(null), tt = Q.useRef(), ot = Q.useRef(/* @__PURE__ */ new Set()), nt = Q.useRef(/* @__PURE__ */ new Set()), ut = Q.useRef(!1), J = Q.useRef(!1), N = Q.useRef({ x: 0, y: 0 }), L = Q.useRef(!1), O = (W) => {
    if (J.current || ut.current || C.getState().connection.inProgress) {
      J.current = !1, ut.current = !1;
      return;
    }
    v?.(W), C.getState().resetSelectedElements(), C.setState({ nodesSelectionActive: !1 });
  }, j = (W) => {
    if (Array.isArray(r) && r?.includes(2)) {
      W.preventDefault();
      return;
    }
    y?.(W);
  }, Y = m ? (W) => m(W) : void 0, k = (W) => {
    J.current && (W.stopPropagation(), J.current = !1);
  }, et = (W) => {
    if (W.pointerType === "touch" && r !== !1 && !i)
      return;
    const { domNode: ft, transform: gt } = C.getState();
    if (tt.current = ft?.getBoundingClientRect(), !tt.current)
      return;
    const st = W.target === $.current;
    if (!st && !!W.target.closest(".nokey") || !n || !(d && st || i) || W.button !== 0 || !W.isPrimary)
      return;
    W.target?.setPointerCapture?.(W.pointerId), J.current = !1;
    const { x: zt, y: Et } = Tn(W.nativeEvent, tt.current), Mt = to({ x: zt, y: Et }, gt);
    C.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: Mt.x,
        startY: Mt.y,
        x: zt,
        y: Et
      }
    }), st || (W.stopPropagation(), W.preventDefault());
  };
  function lt(W, ft) {
    const { userSelectionRect: gt } = C.getState();
    if (!gt)
      return;
    const { transform: st, nodeLookup: ct, edgeLookup: bt, connectionLookup: zt, triggerNodeChanges: Et, triggerEdgeChanges: Mt, defaultEdgeOptions: Ot } = C.getState(), Ht = { x: gt.startX, y: gt.startY }, { x: Kt, y: oe } = Ri(Ht, st), Nt = {
      startX: Ht.x,
      startY: Ht.y,
      x: W < Kt ? W : Kt,
      y: ft < oe ? ft : oe,
      width: Math.abs(W - Kt),
      height: Math.abs(ft - oe)
    }, Se = ot.current, ye = nt.current;
    ot.current = new Set(Jd(ct, Nt, st, o === Gu.Partial, !0).map((pe) => pe.id)), nt.current = /* @__PURE__ */ new Set();
    const Ee = Ot?.selectable ?? !0;
    for (const pe of ot.current) {
      const we = zt.get(pe);
      if (we)
        for (const { edgeId: Pt } of we.values()) {
          const an = bt.get(Pt);
          an && (an.selectable ?? Ee) && nt.current.add(Pt);
        }
    }
    if (!Gy(Se, ot.current)) {
      const pe = Ti(ct, ot.current, !0);
      Et(pe);
    }
    if (!Gy(ye, nt.current)) {
      const pe = Ti(bt, nt.current);
      Mt(pe);
    }
    C.setState({
      userSelectionRect: Nt,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function dt() {
    if (!c || !tt.current)
      return;
    const [W, ft] = Id(N.current, tt.current, B);
    G({ x: W, y: ft }).then((gt) => {
      if (!J.current || !gt) {
        T.current = requestAnimationFrame(dt);
        return;
      }
      const { x: st, y: ct } = N.current;
      lt(st, ct), T.current = requestAnimationFrame(dt);
    });
  }
  const xt = () => {
    cancelAnimationFrame(T.current), T.current = 0, L.current = !1;
  };
  Q.useEffect(() => () => xt(), []);
  const M = (W) => {
    const { userSelectionRect: ft, transform: gt, resetSelectedElements: st } = C.getState();
    if (!tt.current || !ft)
      return;
    const { x: ct, y: bt } = Tn(W.nativeEvent, tt.current);
    N.current = { x: ct, y: bt };
    const zt = Ri({ x: ft.startX, y: ft.startY }, gt);
    if (!J.current) {
      const Et = i ? 0 : f;
      if (Math.hypot(ct - zt.x, bt - zt.y) <= Et)
        return;
      st(), h?.(W);
    }
    J.current = !0, L.current || (dt(), L.current = !0), lt(ct, bt);
  }, F = (W) => {
    if (!H) {
      W.target === $.current && C.getState().connection.inProgress && (ut.current = !0);
      return;
    }
    W.button === 0 && (W.target?.releasePointerCapture?.(W.pointerId), !U && W.target === $.current && C.getState().userSelectionRect && O?.(W), C.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), J.current && (p?.(W), C.setState({
      nodesSelectionActive: ot.current.size > 0
    })), xt());
  }, ht = (W) => {
    W.target?.releasePointerCapture?.(W.pointerId), xt();
  }, rt = r === !0 || Array.isArray(r) && r.includes(0);
  return w.jsxs("div", { className: he(["react-flow__pane", { draggable: rt, dragging: D, selection: n }]), onClick: H ? void 0 : Ed(O, $), onContextMenu: Ed(j, $), onWheel: Ed(Y, $), onPointerEnter: H ? void 0 : x, onPointerMove: H ? M : S, onPointerUp: F, onPointerCancel: H ? ht : void 0, onPointerDownCapture: H ? et : void 0, onClickCapture: H ? k : void 0, onPointerLeave: E, ref: $, style: ws, children: [z, w.jsx(i3, {})] });
}
function Vd({ id: n, store: i, unselect: o = !1, nodeRef: r }) {
  const { addSelectedNodes: c, unselectNodesAndEdges: f, multiSelectionActive: d, nodeLookup: h, onError: p } = i.getState(), v = h.get(n);
  if (!v) {
    p?.("012", Cn.error012(n));
    return;
  }
  i.setState({ nodesSelectionActive: !1 }), v.selected ? (o || v.selected && d) && (f({ nodes: [v], edges: [] }), requestAnimationFrame(() => r?.current?.blur())) : c([n]);
}
function c1({ nodeRef: n, disabled: i = !1, noDragClassName: o, handleSelector: r, nodeId: c, isSelectable: f, nodeClickDistance: d }) {
  const h = Wt(), [p, v] = Q.useState(!1), y = Q.useRef();
  return Q.useEffect(() => {
    if (!i)
      return y.current = K2({
        getStoreItems: () => h.getState(),
        onNodeMouseDown: (m) => {
          Vd({
            id: m,
            store: h,
            nodeRef: n
          });
        },
        onDragStart: () => {
          v(!0);
        },
        onDragStop: () => {
          v(!1);
        }
      }), () => {
        y.current?.destroy(), y.current = void 0;
      };
  }, [i, h, n]), Q.useEffect(() => {
    i || !n.current || !y.current || y.current.update({
      noDragClassName: o,
      handleSelector: r,
      domNode: n.current,
      isSelectable: f,
      nodeId: c,
      nodeClickDistance: d
    });
  }, [o, r, i, f, n, c, d]), p;
}
const r3 = (n) => (i) => i.selected && (i.draggable || n && typeof i.draggable > "u");
function f1() {
  const n = Wt();
  return Q.useCallback((o) => {
    const { nodeExtent: r, snapToGrid: c, snapGrid: f, nodesDraggable: d, onError: h, updateNodePositions: p, nodeLookup: v, nodeOrigin: y } = n.getState(), m = /* @__PURE__ */ new Map(), x = r3(d), S = c ? f[0] : 5, E = c ? f[1] : 5, z = o.direction.x * S * o.factor, T = o.direction.y * E * o.factor;
    for (const [, C] of v) {
      if (!x(C))
        continue;
      let U = {
        x: C.internals.positionAbsolute.x + z,
        y: C.internals.positionAbsolute.y + T
      };
      c && (U = Pu(U, f));
      const { position: _, positionAbsolute: D } = Mv({
        nodeId: C.id,
        nextPosition: U,
        nodeLookup: v,
        nodeExtent: r,
        nodeOrigin: y,
        onError: h
      });
      C.position = _, C.internals.positionAbsolute = D, m.set(C.id, C);
    }
    p(m);
  }, []);
}
const ih = Q.createContext(null), s3 = ih.Provider;
ih.Consumer;
const d1 = () => Q.useContext(ih), c3 = (n) => ({
  connectOnClick: n.connectOnClick,
  noPanClassName: n.noPanClassName,
  rfId: n.rfId
}), h1 = Q.createContext(null);
function f3({ children: n }) {
  const i = Vt(c3, le);
  return w.jsx(h1.Provider, { value: i, children: n });
}
function d3() {
  const n = Q.useContext(h1);
  if (!n)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return n;
}
const h3 = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, g3 = (n, i, o) => (r) => {
  const { connectionClickStartHandle: c, connectionMode: f, connection: d } = r, { fromHandle: h, toHandle: p, isValid: v } = d;
  if (!h && !c)
    return h3;
  const y = p?.nodeId === n && p?.id === i && p?.type === o;
  return {
    connectingFrom: h?.nodeId === n && h?.id === i && h?.type === o,
    connectingTo: y,
    clickConnecting: c?.nodeId === n && c?.id === i && c?.type === o,
    isPossibleEndHandle: f === Di.Strict ? h?.type !== o : n !== h?.nodeId || i !== h?.id,
    connectionInProcess: !!h,
    clickConnectionInProcess: !!c,
    valid: y && v
  };
};
function m3({ type: n = "source", position: i = wt.Top, isValidConnection: o, isConnectable: r = !0, isConnectableStart: c = !0, isConnectableEnd: f = !0, id: d, onConnect: h, children: p, className: v, onMouseDown: y, onTouchStart: m, ...x }, S) {
  const E = d || null, z = n === "target", T = Wt(), C = d1(), { connectOnClick: U, noPanClassName: _, rfId: D } = d3(), { connectingFrom: G, connectingTo: B, clickConnecting: H, isPossibleEndHandle: $, connectionInProcess: tt, clickConnectionInProcess: ot, valid: nt } = Vt(g3(C, E, n), le);
  C || T.getState().onError?.("010", Cn.error010());
  const ut = (L) => {
    const { defaultEdgeOptions: O, onConnect: j, hasDefaultEdges: Y } = T.getState(), k = {
      ...O,
      ...L
    };
    if (Y) {
      const { edges: et, setEdges: lt, onError: dt } = T.getState();
      lt(KN(k, et, { onError: dt }));
    }
    j?.(k), h?.(k);
  }, J = (L) => {
    if (!C)
      return;
    const O = Lv(L.nativeEvent);
    if (c && (O && L.button === 0 || !O)) {
      const j = T.getState();
      Ld.onPointerDown(L.nativeEvent, {
        handleDomNode: L.currentTarget,
        autoPanOnConnect: j.autoPanOnConnect,
        connectionMode: j.connectionMode,
        connectionRadius: j.connectionRadius,
        domNode: j.domNode,
        nodeLookup: j.nodeLookup,
        lib: j.lib,
        isTarget: z,
        handleId: E,
        nodeId: C,
        flowId: j.rfId,
        panBy: j.panBy,
        cancelConnection: j.cancelConnection,
        onConnectStart: j.onConnectStart,
        onConnectEnd: (...Y) => T.getState().onConnectEnd?.(...Y),
        updateConnection: j.updateConnection,
        onConnect: ut,
        isValidConnection: o || ((...Y) => T.getState().isValidConnection?.(...Y) ?? !0),
        getTransform: () => T.getState().transform,
        getFromHandle: () => T.getState().connection.fromHandle,
        autoPanSpeed: j.autoPanSpeed,
        dragThreshold: j.connectionDragThreshold
      });
    }
    O ? y?.(L) : m?.(L);
  }, N = (L) => {
    const { onClickConnectStart: O, onClickConnectEnd: j, connectionClickStartHandle: Y, connectionMode: k, isValidConnection: et, lib: lt, rfId: dt, nodeLookup: xt, connection: M } = T.getState();
    if (!C || !Y && !c)
      return;
    if (!Y) {
      O?.(L.nativeEvent, { nodeId: C, handleId: E, handleType: n }), T.setState({ connectionClickStartHandle: { nodeId: C, type: n, id: E } });
      return;
    }
    const F = Uv(L.target), ht = o || et, { connection: rt, isValid: W } = Ld.isValid(L.nativeEvent, {
      handle: {
        nodeId: C,
        id: E,
        type: n
      },
      connectionMode: k,
      fromNodeId: Y.nodeId,
      fromHandleId: Y.id || null,
      fromType: Y.type,
      isValidConnection: ht,
      flowId: dt,
      doc: F,
      lib: lt,
      nodeLookup: xt
    });
    W && rt && ut(rt);
    const ft = structuredClone(M);
    delete ft.inProgress, ft.toPosition = ft.toHandle ? ft.toHandle.position : null, j?.(L, ft), T.setState({ connectionClickStartHandle: null });
  };
  return w.jsx("div", { "data-handleid": E, "data-nodeid": C, "data-handlepos": i, "data-id": `${D}-${C}-${E}-${n}`, className: he([
    "react-flow__handle",
    `react-flow__handle-${i}`,
    "nodrag",
    _,
    v,
    {
      source: !z,
      target: z,
      connectable: r,
      connectablestart: c,
      connectableend: f,
      clickconnecting: H,
      connectingfrom: G,
      connectingto: B,
      valid: nt,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!tt || $) && (tt || ot ? f : c)
    }
  ]), onMouseDown: J, onTouchStart: J, onClick: U ? N : void 0, ref: S, ...x, children: p });
}
const Kl = Q.memo(o1(m3));
function y3({ data: n, isConnectable: i, sourcePosition: o = wt.Bottom }) {
  return w.jsxs(w.Fragment, { children: [n?.label, w.jsx(Kl, { type: "source", position: o, isConnectable: i })] });
}
function p3({ data: n, isConnectable: i, targetPosition: o = wt.Top, sourcePosition: r = wt.Bottom }) {
  return w.jsxs(w.Fragment, { children: [w.jsx(Kl, { type: "target", position: o, isConnectable: i }), n?.label, w.jsx(Kl, { type: "source", position: r, isConnectable: i })] });
}
function v3() {
  return null;
}
function x3({ data: n, isConnectable: i, targetPosition: o = wt.Top }) {
  return w.jsxs(w.Fragment, { children: [w.jsx(Kl, { type: "target", position: o, isConnectable: i }), n?.label] });
}
const ss = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Sp = {
  input: y3,
  default: p3,
  output: x3,
  group: v3
};
function b3(n) {
  return n.internals.handleBounds === void 0 ? {
    width: n.width ?? n.initialWidth ?? n.style?.width,
    height: n.height ?? n.initialHeight ?? n.style?.height
  } : {
    width: n.width ?? n.style?.width,
    height: n.height ?? n.style?.height
  };
}
const S3 = (n) => {
  const { width: i, height: o, x: r, y: c } = Wu(n.nodeLookup, {
    filter: (f) => !!f.selected
  });
  return {
    width: Nn(i) ? i : null,
    height: Nn(o) ? o : null,
    userSelectionActive: n.userSelectionActive,
    transformString: `translate(${n.transform[0]}px,${n.transform[1]}px) scale(${n.transform[2]}) translate(${r}px,${c}px)`
  };
};
function E3({ onSelectionContextMenu: n, noPanClassName: i, disableKeyboardA11y: o }) {
  const r = Wt(), { width: c, height: f, transformString: d, userSelectionActive: h } = Vt(S3, le), p = f1(), v = Q.useRef(null);
  Q.useEffect(() => {
    o || v.current?.focus({
      preventScroll: !0
    });
  }, [o]);
  const y = !h && c !== null && f !== null;
  if (c1({
    nodeRef: v,
    disabled: !y
  }), !y)
    return null;
  const m = n ? (S) => {
    const E = r.getState().nodes.filter((z) => z.selected);
    n(S, E);
  } : void 0, x = (S) => {
    Object.prototype.hasOwnProperty.call(ss, S.key) && (S.preventDefault(), p({
      direction: ss[S.key],
      factor: S.shiftKey ? 4 : 1
    }));
  };
  return w.jsx("div", { className: he(["react-flow__nodesselection", "react-flow__container", i]), style: {
    transform: d
  }, children: w.jsx("div", { ref: v, className: "react-flow__nodesselection-rect", onContextMenu: m, tabIndex: o ? void 0 : -1, onKeyDown: o ? void 0 : x, style: {
    width: c,
    height: f
  } }) });
}
const Ep = typeof window < "u" ? window : void 0, w3 = (n) => ({ nodesSelectionActive: n.nodesSelectionActive, userSelectionActive: n.userSelectionActive });
function g1({ children: n, onPaneClick: i, onPaneMouseEnter: o, onPaneMouseMove: r, onPaneMouseLeave: c, onPaneContextMenu: f, onPaneScroll: d, paneClickDistance: h, deleteKeyCode: p, selectionKeyCode: v, selectionOnDrag: y, selectionMode: m, onSelectionStart: x, onSelectionEnd: S, multiSelectionKeyCode: E, panActivationKeyCode: z, zoomActivationKeyCode: T, elementsSelectable: C, zoomOnScroll: U, zoomOnPinch: _, panOnScroll: D, panOnScrollSpeed: G, panOnScrollMode: B, zoomOnDoubleClick: H, panOnDrag: $, autoPanOnSelection: tt, defaultViewport: ot, translateExtent: nt, minZoom: ut, maxZoom: J, preventScrolling: N, onSelectionContextMenu: L, noWheelClassName: O, noPanClassName: j, disableKeyboardA11y: Y, onViewportChange: k, isControlledViewport: et }) {
  const { nodesSelectionActive: lt, userSelectionActive: dt } = Vt(w3, le), xt = Ku(v, { target: Ep }), M = Ku(z, { target: Ep }), F = M || $, ht = M || D, rt = y && F !== !0, W = xt || dt || rt;
  return t3({ deleteKeyCode: p, multiSelectionKeyCode: E }), w.jsx(l3, { onPaneContextMenu: f, elementsSelectable: C, zoomOnScroll: U, zoomOnPinch: _, panOnScroll: ht, panActivationKeyPressed: M, panOnScrollSpeed: G, panOnScrollMode: B, zoomOnDoubleClick: H, panOnDrag: !xt && F, defaultViewport: ot, translateExtent: nt, minZoom: ut, maxZoom: J, zoomActivationKeyCode: T, preventScrolling: N, noWheelClassName: O, noPanClassName: j, onViewportChange: k, isControlledViewport: et, paneClickDistance: h, selectionOnDrag: rt, children: w.jsxs(o3, { onSelectionStart: x, onSelectionEnd: S, onPaneClick: i, onPaneMouseEnter: o, onPaneMouseMove: r, onPaneMouseLeave: c, onPaneContextMenu: f, onPaneScroll: d, panOnDrag: F, autoPanOnSelection: tt, isSelecting: !!W, selectionMode: m, selectionKeyPressed: xt, paneClickDistance: h, selectionOnDrag: rt, children: [n, lt && w.jsx(E3, { onSelectionContextMenu: L, noPanClassName: j, disableKeyboardA11y: Y })] }) });
}
g1.displayName = "FlowRenderer";
const _3 = Q.memo(g1), N3 = (n) => (i) => n ? Jd(i.nodeLookup, { x: 0, y: 0, width: i.width, height: i.height }, i.transform, !0).map((o) => o.id) : Array.from(i.nodeLookup.keys());
function T3(n) {
  return Vt(Q.useCallback(N3(n), [n]), le);
}
const C3 = (n) => n.updateNodeInternals;
function M3() {
  const n = Vt(C3), [i] = Q.useState(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((o) => {
    const r = /* @__PURE__ */ new Map();
    o.forEach((c) => {
      const f = c.target.getAttribute("data-id");
      r.set(f, {
        id: f,
        nodeElement: c.target,
        force: !0
      });
    }), n(r);
  }));
  return Q.useEffect(() => () => {
    i?.disconnect();
  }, [i]), i;
}
function z3({ node: n, nodeType: i, hasDimensions: o, resizeObserver: r }) {
  const c = Wt(), f = Q.useRef(null), d = Q.useRef(null), h = Q.useRef(n.sourcePosition), p = Q.useRef(n.targetPosition), v = Q.useRef(i), y = o && !!n.internals.handleBounds;
  return Q.useEffect(() => {
    f.current && !n.hidden && (!y || d.current !== f.current) && (d.current && r?.unobserve(d.current), r?.observe(f.current), d.current = f.current);
  }, [y, n.hidden]), Q.useEffect(() => () => {
    d.current && (r?.unobserve(d.current), d.current = null);
  }, []), Q.useEffect(() => {
    if (f.current) {
      const m = v.current !== i, x = h.current !== n.sourcePosition, S = p.current !== n.targetPosition;
      (m || x || S) && (v.current = i, h.current = n.sourcePosition, p.current = n.targetPosition, c.getState().updateNodeInternals(/* @__PURE__ */ new Map([[n.id, { id: n.id, nodeElement: f.current, force: !0 }]])));
    }
  }, [n.id, i, n.sourcePosition, n.targetPosition]), f;
}
function A3({ id: n, onClick: i, onMouseEnter: o, onMouseMove: r, onMouseLeave: c, onContextMenu: f, onDoubleClick: d, nodesDraggable: h, elementsSelectable: p, nodesConnectable: v, nodesFocusable: y, resizeObserver: m, noDragClassName: x, noPanClassName: S, disableKeyboardA11y: E, rfId: z, nodeTypes: T, nodeClickDistance: C, onError: U }) {
  const { node: _, internals: D, isParent: G } = Vt((W) => {
    const ft = W.nodeLookup.get(n), gt = W.parentLookup.has(n);
    return {
      node: ft,
      internals: ft.internals,
      isParent: gt
    };
  }, le);
  let B = _.type || "default", H = T?.[B] || Sp[B];
  H === void 0 && (U?.("003", Cn.error003(B)), B = "default", H = T?.default || Sp.default);
  const $ = !!(_.draggable || h && typeof _.draggable > "u"), tt = !!(_.selectable || p && typeof _.selectable > "u"), ot = !!(_.connectable || v && typeof _.connectable > "u"), nt = !!(_.focusable || y && typeof _.focusable > "u"), ut = Wt(), J = Rv(_), N = z3({ node: _, nodeType: B, hasDimensions: J, resizeObserver: m }), L = c1({
    nodeRef: N,
    disabled: _.hidden || !$,
    noDragClassName: x,
    handleSelector: _.dragHandle,
    nodeId: n,
    isSelectable: tt,
    nodeClickDistance: C
  }), O = f1();
  if (_.hidden)
    return null;
  const j = zn(_), Y = b3(_), k = tt || $ || i || o || r || c, et = o ? (W) => o(W, { ...D.userNode }) : void 0, lt = r ? (W) => r(W, { ...D.userNode }) : void 0, dt = c ? (W) => c(W, { ...D.userNode }) : void 0, xt = f ? (W) => f(W, { ...D.userNode }) : void 0, M = d ? (W) => d(W, { ...D.userNode }) : void 0, F = (W) => {
    const { selectNodesOnDrag: ft, nodeDragThreshold: gt } = ut.getState();
    tt && (!ft || !$ || gt > 0) && Vd({
      id: n,
      store: ut,
      nodeRef: N
    }), i && i(W, { ...D.userNode });
  }, ht = (W) => {
    if (!(Bv(W.nativeEvent) || E)) {
      if (wv.includes(W.key) && tt) {
        const ft = W.key === "Escape";
        Vd({
          id: n,
          store: ut,
          unselect: ft,
          nodeRef: N
        });
      } else if ($ && _.selected && Object.prototype.hasOwnProperty.call(ss, W.key)) {
        W.preventDefault();
        const { ariaLabelConfig: ft } = ut.getState();
        ut.setState({
          ariaLiveMessage: ft["node.a11yDescription.ariaLiveMessage"]({
            direction: W.key.replace("Arrow", "").toLowerCase(),
            x: ~~D.positionAbsolute.x,
            y: ~~D.positionAbsolute.y
          })
        }), O({
          direction: ss[W.key],
          factor: W.shiftKey ? 4 : 1
        });
      }
    }
  }, rt = () => {
    if (E || !N.current?.matches(":focus-visible"))
      return;
    const { transform: W, width: ft, height: gt, autoPanOnNodeFocus: st, setCenter: ct } = ut.getState();
    if (!st)
      return;
    Jd(/* @__PURE__ */ new Map([[n, _]]), { x: 0, y: 0, width: ft, height: gt }, W, !0).length > 0 || ct(_.position.x + j.width / 2, _.position.y + j.height / 2, {
      zoom: W[2]
    });
  };
  return w.jsx("div", { className: he([
    "react-flow__node",
    `react-flow__node-${B}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [S]: $
    },
    _.className,
    {
      selected: _.selected,
      selectable: tt,
      parent: G,
      draggable: $,
      dragging: L
    }
  ]), ref: N, style: {
    zIndex: D.z,
    transform: `translate(${D.positionAbsolute.x}px,${D.positionAbsolute.y}px)`,
    pointerEvents: k ? "all" : "none",
    visibility: J ? "visible" : "hidden",
    ..._.style,
    ...Y
  }, "data-id": n, "data-testid": `rf__node-${n}`, onMouseEnter: et, onMouseMove: lt, onMouseLeave: dt, onContextMenu: xt, onClick: F, onDoubleClick: M, onKeyDown: nt ? ht : void 0, tabIndex: nt ? 0 : void 0, onFocus: nt ? rt : void 0, role: _.ariaRole ?? (nt ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": E ? void 0 : `${n1}-${z}`, "aria-label": _.ariaLabel, ..._.domAttributes, children: w.jsx(s3, { value: n, children: w.jsx(H, { id: n, data: _.data, type: B, positionAbsoluteX: D.positionAbsolute.x, positionAbsoluteY: D.positionAbsolute.y, selected: _.selected ?? !1, selectable: tt, draggable: $, deletable: _.deletable ?? !0, isConnectable: ot, sourcePosition: _.sourcePosition, targetPosition: _.targetPosition, dragging: L, dragHandle: _.dragHandle, zIndex: D.z, parentId: _.parentId, ...j }) }) });
}
var D3 = Q.memo(A3);
const O3 = (n) => ({
  nodesConnectable: n.nodesConnectable,
  nodesFocusable: n.nodesFocusable,
  elementsSelectable: n.elementsSelectable,
  onError: n.onError
});
function m1(n) {
  const { nodesConnectable: i, nodesFocusable: o, elementsSelectable: r, onError: c } = Vt(O3, le), f = T3(n.onlyRenderVisibleElements), d = M3();
  return w.jsx("div", { className: "react-flow__nodes", style: ws, children: f.map((h) => (
    /*
     * The split of responsibilities between NodeRenderer and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For example, when you’re dragging a single node, that node gets
     * updated multiple times per second. If `NodeRenderer` were to update
     * every time, it would have to re-run the `nodes.map()` loop every
     * time. This gets pricey with hundreds of nodes, especially if every
     * loop cycle does more than just rendering a JSX element!
     *
     * As a result of this choice, we took the following implementation
     * decisions:
     * - NodeRenderer subscribes *only* to node IDs – and therefore
     *   rerender *only* when visible nodes are added or removed.
     * - NodeRenderer performs all operations the result of which can be
     *   shared between nodes (such as creating the `ResizeObserver`
     *   instance, or subscribing to `selector`). This means extra prop
     *   drilling into `NodeComponentWrapper`, but it means we need to run
     *   these operations only once – instead of once per node.
     * - Any operations that you’d normally write inside `nodes.map` are
     *   moved into `NodeComponentWrapper`. This ensures they are
     *   memorized – so if `NodeRenderer` *has* to rerender, it only
     *   needs to regenerate the list of nodes, nothing else.
     */
    w.jsx(D3, { id: h, nodeTypes: n.nodeTypes, nodeExtent: n.nodeExtent, onClick: n.onNodeClick, onMouseEnter: n.onNodeMouseEnter, onMouseMove: n.onNodeMouseMove, onMouseLeave: n.onNodeMouseLeave, onContextMenu: n.onNodeContextMenu, onDoubleClick: n.onNodeDoubleClick, noDragClassName: n.noDragClassName, noPanClassName: n.noPanClassName, rfId: n.rfId, disableKeyboardA11y: n.disableKeyboardA11y, resizeObserver: d, nodesDraggable: n.nodesDraggable ?? !0, nodesConnectable: i, nodesFocusable: o, elementsSelectable: r, nodeClickDistance: n.nodeClickDistance, onError: c }, h)
  )) });
}
m1.displayName = "NodeRenderer";
const R3 = Q.memo(m1);
function H3(n) {
  return Vt(Q.useCallback((o) => {
    if (!n)
      return o.edges.map((c) => c.id);
    const r = [];
    if (o.width && o.height)
      for (const c of o.edges) {
        const f = o.nodeLookup.get(c.source), d = o.nodeLookup.get(c.target);
        f && d && M2({
          sourceNode: f,
          targetNode: d,
          width: o.width,
          height: o.height,
          transform: o.transform
        }) && r.push(c.id);
      }
    return r;
  }, [n]), le);
}
const j3 = ({ color: n = "none", strokeWidth: i = 1 }) => {
  const o = {
    strokeWidth: i,
    ...n && { stroke: n }
  };
  return w.jsx("polyline", { className: "arrow", style: o, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, U3 = ({ color: n = "none", strokeWidth: i = 1 }) => {
  const o = {
    strokeWidth: i,
    ...n && { stroke: n, fill: n }
  };
  return w.jsx("polyline", { className: "arrowclosed", style: o, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, wp = {
  [us.Arrow]: j3,
  [us.ArrowClosed]: U3
};
function B3(n) {
  const i = Wt();
  return Q.useMemo(() => Object.prototype.hasOwnProperty.call(wp, n) ? wp[n] : (i.getState().onError?.("009", Cn.error009(n)), null), [n]);
}
const L3 = ({ id: n, type: i, color: o, width: r = 12.5, height: c = 12.5, markerUnits: f = "strokeWidth", strokeWidth: d, orient: h = "auto-start-reverse" }) => {
  const p = B3(i);
  return p ? w.jsx("marker", { className: "react-flow__arrowhead", id: n, markerWidth: `${r}`, markerHeight: `${c}`, viewBox: "-10 -10 20 20", markerUnits: f, orient: h, refX: "0", refY: "0", children: w.jsx(p, { color: o, strokeWidth: d }) }) : null;
}, y1 = ({ defaultColor: n, rfId: i }) => {
  const o = Vt((f) => f.edges), r = Vt((f) => f.defaultEdgeOptions), c = Q.useMemo(() => U2(o, {
    id: i,
    defaultColor: n,
    defaultMarkerStart: r?.markerStart,
    defaultMarkerEnd: r?.markerEnd
  }), [o, r, i, n]);
  return c.length ? w.jsx("svg", { className: "react-flow__marker", "aria-hidden": "true", children: w.jsx("defs", { children: c.map((f) => w.jsx(L3, { id: f.id, type: f.type, color: f.color, width: f.width, height: f.height, markerUnits: f.markerUnits, strokeWidth: f.strokeWidth, orient: f.orient }, f.id)) }) }) : null;
};
y1.displayName = "MarkerDefinitions";
var V3 = Q.memo(y1);
function p1({ x: n, y: i, label: o, labelStyle: r, labelShowBg: c = !0, labelBgStyle: f, labelBgPadding: d = [2, 4], labelBgBorderRadius: h = 2, children: p, className: v, ...y }) {
  const [m, x] = Q.useState({ x: 1, y: 0, width: 0, height: 0 }), S = he(["react-flow__edge-textwrapper", v]), E = Q.useRef(null);
  return Q.useEffect(() => {
    if (E.current) {
      const z = E.current.getBBox();
      x({
        x: z.x,
        y: z.y,
        width: z.width,
        height: z.height
      });
    }
  }, [o]), o ? w.jsxs("g", { transform: `translate(${n - m.width / 2} ${i - m.height / 2})`, className: S, visibility: m.width ? "visible" : "hidden", ...y, children: [c && w.jsx("rect", { width: m.width + 2 * d[0], x: -d[0], y: -d[1], height: m.height + 2 * d[1], className: "react-flow__edge-textbg", style: f, rx: h, ry: h }), w.jsx("text", { className: "react-flow__edge-text", y: m.height / 2, dy: "0.3em", ref: E, style: r, children: o }), p] }) : null;
}
p1.displayName = "EdgeText";
const Y3 = Q.memo(p1);
function eo({ path: n, labelX: i, labelY: o, label: r, labelStyle: c, labelShowBg: f, labelBgStyle: d, labelBgPadding: h, labelBgBorderRadius: p, interactionWidth: v = 20, ...y }) {
  return w.jsxs(w.Fragment, { children: [w.jsx("path", { ...y, d: n, fill: "none", className: he(["react-flow__edge-path", y.className]) }), v ? w.jsx("path", { d: n, fill: "none", strokeOpacity: 0, strokeWidth: v, className: "react-flow__edge-interaction" }) : null, r && Nn(i) && Nn(o) ? w.jsx(Y3, { x: i, y: o, label: r, labelStyle: c, labelShowBg: f, labelBgStyle: d, labelBgPadding: h, labelBgBorderRadius: p }) : null] });
}
function _p({ pos: n, x1: i, y1: o, x2: r, y2: c }) {
  return n === wt.Left || n === wt.Right ? [0.5 * (i + r), o] : [i, 0.5 * (o + c)];
}
function v1({ sourceX: n, sourceY: i, sourcePosition: o = wt.Bottom, targetX: r, targetY: c, targetPosition: f = wt.Top }) {
  const [d, h] = _p({
    pos: o,
    x1: n,
    y1: i,
    x2: r,
    y2: c
  }), [p, v] = _p({
    pos: f,
    x1: r,
    y1: c,
    x2: n,
    y2: i
  }), [y, m, x, S] = Vv({
    sourceX: n,
    sourceY: i,
    targetX: r,
    targetY: c,
    sourceControlX: d,
    sourceControlY: h,
    targetControlX: p,
    targetControlY: v
  });
  return [
    `M${n},${i} C${d},${h} ${p},${v} ${r},${c}`,
    y,
    m,
    x,
    S
  ];
}
function x1(n) {
  return Q.memo(({ id: i, sourceX: o, sourceY: r, targetX: c, targetY: f, sourcePosition: d, targetPosition: h, label: p, labelStyle: v, labelShowBg: y, labelBgStyle: m, labelBgPadding: x, labelBgBorderRadius: S, style: E, markerEnd: z, markerStart: T, interactionWidth: C }) => {
    const [U, _, D] = v1({
      sourceX: o,
      sourceY: r,
      sourcePosition: d,
      targetX: c,
      targetY: f,
      targetPosition: h
    }), G = n.isInternal ? void 0 : i;
    return w.jsx(eo, { id: G, path: U, labelX: _, labelY: D, label: p, labelStyle: v, labelShowBg: y, labelBgStyle: m, labelBgPadding: x, labelBgBorderRadius: S, style: E, markerEnd: z, markerStart: T, interactionWidth: C });
  });
}
const q3 = x1({ isInternal: !1 }), b1 = x1({ isInternal: !0 });
q3.displayName = "SimpleBezierEdge";
b1.displayName = "SimpleBezierEdgeInternal";
function S1(n) {
  return Q.memo(({ id: i, sourceX: o, sourceY: r, targetX: c, targetY: f, label: d, labelStyle: h, labelShowBg: p, labelBgStyle: v, labelBgPadding: y, labelBgBorderRadius: m, style: x, sourcePosition: S = wt.Bottom, targetPosition: E = wt.Top, markerEnd: z, markerStart: T, pathOptions: C, interactionWidth: U }) => {
    const [_, D, G] = jd({
      sourceX: o,
      sourceY: r,
      sourcePosition: S,
      targetX: c,
      targetY: f,
      targetPosition: E,
      borderRadius: C?.borderRadius,
      offset: C?.offset,
      stepPosition: C?.stepPosition
    }), B = n.isInternal ? void 0 : i;
    return w.jsx(eo, { id: B, path: _, labelX: D, labelY: G, label: d, labelStyle: h, labelShowBg: p, labelBgStyle: v, labelBgPadding: y, labelBgBorderRadius: m, style: x, markerEnd: z, markerStart: T, interactionWidth: U });
  });
}
const E1 = S1({ isInternal: !1 }), w1 = S1({ isInternal: !0 });
E1.displayName = "SmoothStepEdge";
w1.displayName = "SmoothStepEdgeInternal";
function _1(n) {
  return Q.memo(({ id: i, ...o }) => {
    const r = n.isInternal ? void 0 : i;
    return w.jsx(E1, { ...o, id: r, pathOptions: Q.useMemo(() => ({ borderRadius: 0, offset: o.pathOptions?.offset }), [o.pathOptions?.offset]) });
  });
}
const X3 = _1({ isInternal: !1 }), N1 = _1({ isInternal: !0 });
X3.displayName = "StepEdge";
N1.displayName = "StepEdgeInternal";
function T1(n) {
  return Q.memo(({ id: i, sourceX: o, sourceY: r, targetX: c, targetY: f, label: d, labelStyle: h, labelShowBg: p, labelBgStyle: v, labelBgPadding: y, labelBgBorderRadius: m, style: x, markerEnd: S, markerStart: E, interactionWidth: z }) => {
    const [T, C, U] = qv({ sourceX: o, sourceY: r, targetX: c, targetY: f }), _ = n.isInternal ? void 0 : i;
    return w.jsx(eo, { id: _, path: T, labelX: C, labelY: U, label: d, labelStyle: h, labelShowBg: p, labelBgStyle: v, labelBgPadding: y, labelBgBorderRadius: m, style: x, markerEnd: S, markerStart: E, interactionWidth: z });
  });
}
const Z3 = T1({ isInternal: !1 }), C1 = T1({ isInternal: !0 });
Z3.displayName = "StraightEdge";
C1.displayName = "StraightEdgeInternal";
function M1(n) {
  return Q.memo(({ id: i, sourceX: o, sourceY: r, targetX: c, targetY: f, sourcePosition: d = wt.Bottom, targetPosition: h = wt.Top, label: p, labelStyle: v, labelShowBg: y, labelBgStyle: m, labelBgPadding: x, labelBgBorderRadius: S, style: E, markerEnd: z, markerStart: T, pathOptions: C, interactionWidth: U }) => {
    const [_, D, G] = Pd({
      sourceX: o,
      sourceY: r,
      sourcePosition: d,
      targetX: c,
      targetY: f,
      targetPosition: h,
      curvature: C?.curvature
    }), B = n.isInternal ? void 0 : i;
    return w.jsx(eo, { id: B, path: _, labelX: D, labelY: G, label: p, labelStyle: v, labelShowBg: y, labelBgStyle: m, labelBgPadding: x, labelBgBorderRadius: S, style: E, markerEnd: z, markerStart: T, interactionWidth: U });
  });
}
const G3 = M1({ isInternal: !1 }), z1 = M1({ isInternal: !0 });
G3.displayName = "BezierEdge";
z1.displayName = "BezierEdgeInternal";
const Np = {
  default: z1,
  straight: C1,
  step: N1,
  smoothstep: w1,
  simplebezier: b1
}, Tp = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Q3 = (n, i, o) => o === wt.Left ? n - i : o === wt.Right ? n + i : n, $3 = (n, i, o) => o === wt.Top ? n - i : o === wt.Bottom ? n + i : n, Cp = "react-flow__edgeupdater";
function Mp({ position: n, centerX: i, centerY: o, radius: r = 10, onMouseDown: c, onMouseEnter: f, onMouseOut: d, type: h }) {
  return w.jsx("circle", { onMouseDown: c, onMouseEnter: f, onMouseOut: d, className: he([Cp, `${Cp}-${h}`]), cx: Q3(i, r, n), cy: $3(o, r, n), r, stroke: "transparent", fill: "transparent" });
}
function K3({ isReconnectable: n, reconnectRadius: i, edge: o, sourceX: r, sourceY: c, targetX: f, targetY: d, sourcePosition: h, targetPosition: p, onReconnect: v, onReconnectStart: y, onReconnectEnd: m, setReconnecting: x, setUpdateHover: S }) {
  const E = Wt(), z = (D, G) => {
    if (D.button !== 0)
      return;
    const { autoPanOnConnect: B, domNode: H, connectionMode: $, connectionRadius: tt, lib: ot, onConnectStart: nt, cancelConnection: ut, nodeLookup: J, rfId: N, panBy: L, updateConnection: O } = E.getState(), j = G.type === "target", Y = (lt, dt) => {
      x(!1), m?.(lt, o, G.type, dt);
    }, k = (lt) => v?.(o, lt), et = (lt, dt) => {
      x(!0), y?.(D, o, G.type), nt?.(lt, dt);
    };
    Ld.onPointerDown(D.nativeEvent, {
      autoPanOnConnect: B,
      connectionMode: $,
      connectionRadius: tt,
      domNode: H,
      handleId: G.id,
      nodeId: G.nodeId,
      nodeLookup: J,
      isTarget: j,
      edgeUpdaterType: G.type,
      lib: ot,
      flowId: N,
      cancelConnection: ut,
      panBy: L,
      isValidConnection: (...lt) => E.getState().isValidConnection?.(...lt) ?? !0,
      onConnect: k,
      onConnectStart: et,
      onConnectEnd: (...lt) => E.getState().onConnectEnd?.(...lt),
      onReconnectEnd: Y,
      updateConnection: O,
      getTransform: () => E.getState().transform,
      getFromHandle: () => E.getState().connection.fromHandle,
      dragThreshold: E.getState().connectionDragThreshold,
      handleDomNode: D.currentTarget
    });
  }, T = (D) => z(D, { nodeId: o.target, id: o.targetHandle ?? null, type: "target" }), C = (D) => z(D, { nodeId: o.source, id: o.sourceHandle ?? null, type: "source" }), U = () => S(!0), _ = () => S(!1);
  return w.jsxs(w.Fragment, { children: [(n === !0 || n === "source") && w.jsx(Mp, { position: h, centerX: r, centerY: c, radius: i, onMouseDown: T, onMouseEnter: U, onMouseOut: _, type: "source" }), (n === !0 || n === "target") && w.jsx(Mp, { position: p, centerX: f, centerY: d, radius: i, onMouseDown: C, onMouseEnter: U, onMouseOut: _, type: "target" })] });
}
function k3({ id: n, edgesFocusable: i, edgesReconnectable: o, elementsSelectable: r, onClick: c, onDoubleClick: f, onContextMenu: d, onMouseEnter: h, onMouseMove: p, onMouseLeave: v, reconnectRadius: y, onReconnect: m, onReconnectStart: x, onReconnectEnd: S, rfId: E, edgeTypes: z, noPanClassName: T, onError: C, disableKeyboardA11y: U }) {
  let _ = Vt((ct) => ct.edgeLookup.get(n));
  const D = Vt((ct) => ct.defaultEdgeOptions);
  _ = D ? { ...D, ..._ } : _;
  let G = _.type || "default", B = z?.[G] || Np[G];
  B === void 0 && (C?.("011", Cn.error011(G)), G = "default", B = z?.default || Np.default);
  const H = !!(_.focusable || i && typeof _.focusable > "u"), $ = typeof m < "u" && (_.reconnectable || o && typeof _.reconnectable > "u"), tt = !!(_.selectable || r && typeof _.selectable > "u"), ot = Q.useRef(null), [nt, ut] = Q.useState(!1), [J, N] = Q.useState(!1), L = Wt(), { zIndex: O = _.zIndex, sourceX: j, sourceY: Y, targetX: k, targetY: et, sourcePosition: lt, targetPosition: dt } = Vt(Q.useCallback((ct) => {
    const bt = ct.nodeLookup.get(_.source), zt = ct.nodeLookup.get(_.target);
    if (!bt || !zt)
      return Tp;
    const Et = j2({
      id: n,
      sourceNode: bt,
      targetNode: zt,
      sourceHandle: _.sourceHandle || null,
      targetHandle: _.targetHandle || null,
      connectionMode: ct.connectionMode,
      onError: C
    }), Mt = C2({
      selected: _.selected,
      zIndex: _.zIndex,
      sourceNode: bt,
      targetNode: zt,
      elevateOnSelect: ct.elevateEdgesOnSelect,
      zIndexMode: ct.zIndexMode
    });
    return {
      ...Et || Tp,
      zIndex: Mt
    };
  }, [_.source, _.target, _.sourceHandle, _.targetHandle, _.selected, _.zIndex, C]), le), xt = Q.useMemo(() => _.markerStart ? `url('#${Ud(_.markerStart, E)}')` : void 0, [_.markerStart, E]), M = Q.useMemo(() => _.markerEnd ? `url('#${Ud(_.markerEnd, E)}')` : void 0, [_.markerEnd, E]);
  if (_.hidden || j === null || Y === null || k === null || et === null)
    return null;
  const F = (ct) => {
    const { addSelectedEdges: bt, unselectNodesAndEdges: zt, multiSelectionActive: Et } = L.getState();
    tt && (L.setState({ nodesSelectionActive: !1 }), _.selected && Et ? (zt({ nodes: [], edges: [_] }), ot.current?.blur()) : bt([n])), c && c(ct, _);
  }, ht = f ? (ct) => {
    f(ct, { ..._ });
  } : void 0, rt = d ? (ct) => {
    d(ct, { ..._ });
  } : void 0, W = h ? (ct) => {
    h(ct, { ..._ });
  } : void 0, ft = p ? (ct) => {
    p(ct, { ..._ });
  } : void 0, gt = v ? (ct) => {
    v(ct, { ..._ });
  } : void 0, st = (ct) => {
    if (!U && wv.includes(ct.key) && tt) {
      const { unselectNodesAndEdges: bt, addSelectedEdges: zt } = L.getState();
      ct.key === "Escape" ? (ot.current?.blur(), bt({ edges: [_] })) : zt([n]);
    }
  };
  return w.jsx("svg", { style: { zIndex: O }, children: w.jsxs("g", { className: he([
    "react-flow__edge",
    `react-flow__edge-${G}`,
    _.className,
    T,
    {
      selected: _.selected,
      animated: _.animated,
      inactive: !tt && !c,
      updating: nt,
      selectable: tt
    }
  ]), onClick: F, onDoubleClick: ht, onContextMenu: rt, onMouseEnter: W, onMouseMove: ft, onMouseLeave: gt, onKeyDown: H ? st : void 0, tabIndex: H ? 0 : void 0, role: _.ariaRole ?? (H ? "group" : "img"), "aria-roledescription": "edge", "data-id": n, "data-testid": `rf__edge-${n}`, "aria-label": _.ariaLabel === null ? void 0 : _.ariaLabel || `Edge from ${_.source} to ${_.target}`, "aria-describedby": H ? `${l1}-${E}` : void 0, ref: ot, ..._.domAttributes, children: [!J && w.jsx(B, { id: n, source: _.source, target: _.target, type: _.type, selected: _.selected, animated: _.animated, selectable: tt, deletable: _.deletable ?? !0, label: _.label, labelStyle: _.labelStyle, labelShowBg: _.labelShowBg, labelBgStyle: _.labelBgStyle, labelBgPadding: _.labelBgPadding, labelBgBorderRadius: _.labelBgBorderRadius, sourceX: j, sourceY: Y, targetX: k, targetY: et, sourcePosition: lt, targetPosition: dt, data: _.data, style: _.style, sourceHandleId: _.sourceHandle, targetHandleId: _.targetHandle, markerStart: xt, markerEnd: M, pathOptions: "pathOptions" in _ ? _.pathOptions : void 0, interactionWidth: _.interactionWidth }), $ && w.jsx(K3, { edge: _, isReconnectable: $, reconnectRadius: y, onReconnect: m, onReconnectStart: x, onReconnectEnd: S, sourceX: j, sourceY: Y, targetX: k, targetY: et, sourcePosition: lt, targetPosition: dt, setUpdateHover: ut, setReconnecting: N })] }) });
}
var J3 = Q.memo(k3);
const I3 = (n) => ({
  edgesFocusable: n.edgesFocusable,
  edgesReconnectable: n.edgesReconnectable,
  elementsSelectable: n.elementsSelectable,
  connectionMode: n.connectionMode,
  onError: n.onError
});
function A1({ defaultMarkerColor: n, onlyRenderVisibleElements: i, rfId: o, edgeTypes: r, noPanClassName: c, onReconnect: f, onEdgeContextMenu: d, onEdgeMouseEnter: h, onEdgeMouseMove: p, onEdgeMouseLeave: v, onEdgeClick: y, reconnectRadius: m, onEdgeDoubleClick: x, onReconnectStart: S, onReconnectEnd: E, disableKeyboardA11y: z }) {
  const { edgesFocusable: T, edgesReconnectable: C, elementsSelectable: U, onError: _ } = Vt(I3, le), D = H3(i);
  return w.jsxs("div", { className: "react-flow__edges", children: [w.jsx(V3, { defaultColor: n, rfId: o }), D.map((G) => w.jsx(J3, { id: G, edgesFocusable: T, edgesReconnectable: C, elementsSelectable: U, noPanClassName: c, onReconnect: f, onContextMenu: d, onMouseEnter: h, onMouseMove: p, onMouseLeave: v, onClick: y, reconnectRadius: m, onDoubleClick: x, onReconnectStart: S, onReconnectEnd: E, rfId: o, onError: _, edgeTypes: r, disableKeyboardA11y: z }, G))] });
}
A1.displayName = "EdgeRenderer";
const F3 = Q.memo(A1), zp = (n) => `translate(${n[0]}px,${n[1]}px) scale(${n[2]})`;
function W3({ children: n }) {
  const i = Wt(), o = Q.useRef(null), [r] = Q.useState(() => i.getState().transform);
  return r1(() => {
    let c = null;
    const f = () => {
      const d = i.getState().transform;
      c && d[0] === c[0] && d[1] === c[1] && d[2] === c[2] || (c = d, o.current && (o.current.style.transform = zp(d)));
    };
    return f(), i.subscribe(f);
  }, [i]), w.jsx("div", { ref: o, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: zp(r) }, children: n });
}
function P3(n) {
  const i = Es(), o = Q.useRef(!1);
  Q.useEffect(() => {
    !o.current && i.viewportInitialized && n && (setTimeout(() => n(i), 1), o.current = !0);
  }, [n, i.viewportInitialized]);
}
const tT = (n) => n.panZoom?.syncViewport;
function eT(n) {
  const i = Vt(tT), o = Wt();
  return Q.useEffect(() => {
    n && (i?.(n), o.setState({ transform: [n.x, n.y, n.zoom] }));
  }, [n, i]), null;
}
function nT(n) {
  return n.connection.inProgress ? { ...n.connection, to: to(n.connection.to, n.transform) } : { ...n.connection };
}
function lT(n) {
  return nT;
}
function aT(n) {
  const i = lT();
  return Vt(i, le);
}
const iT = (n) => ({
  nodesConnectable: n.nodesConnectable,
  isValid: n.connection.isValid,
  inProgress: n.connection.inProgress,
  width: n.width,
  height: n.height
});
function uT({ containerStyle: n, style: i, type: o, component: r }) {
  const { nodesConnectable: c, width: f, height: d, isValid: h, inProgress: p } = Vt(iT, le);
  return !(f && c && p) ? null : w.jsx("svg", { style: n, width: f, height: d, className: "react-flow__connectionline react-flow__container", children: w.jsx("g", { className: he(["react-flow__connection", jv(h)]), children: w.jsx(D1, { style: i, type: o, CustomComponent: r, isValid: h }) }) });
}
const D1 = ({ style: n, type: i = $l.Bezier, CustomComponent: o, isValid: r }) => {
  const { inProgress: c, from: f, fromNode: d, fromHandle: h, fromPosition: p, to: v, toNode: y, toHandle: m, toPosition: x, pointer: S } = aT();
  if (!c)
    return;
  if (o)
    return w.jsx(o, { connectionLineType: i, connectionLineStyle: n, fromNode: d, fromHandle: h, fromX: f.x, fromY: f.y, toX: v.x, toY: v.y, fromPosition: p, toPosition: x, connectionStatus: jv(r), toNode: y, toHandle: m, pointer: S });
  let E = "";
  const z = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: p,
    targetX: v.x,
    targetY: v.y,
    targetPosition: x
  };
  switch (i) {
    case $l.Bezier:
      [E] = Pd(z);
      break;
    case $l.SimpleBezier:
      [E] = v1(z);
      break;
    case $l.Step:
      [E] = jd({
        ...z,
        borderRadius: 0
      });
      break;
    case $l.SmoothStep:
      [E] = jd(z);
      break;
    default:
      [E] = qv(z);
  }
  return w.jsx("path", { d: E, fill: "none", className: "react-flow__connection-path", style: n });
};
D1.displayName = "ConnectionLine";
const oT = {};
function Ap(n = oT) {
  Q.useRef(n), Wt(), Q.useEffect(() => {
  }, [n]);
}
function rT() {
  Wt(), Q.useRef(!1), Q.useEffect(() => {
  }, []);
}
function O1({ nodeTypes: n, edgeTypes: i, onInit: o, onNodeClick: r, onEdgeClick: c, onNodeDoubleClick: f, onEdgeDoubleClick: d, onNodeMouseEnter: h, onNodeMouseMove: p, onNodeMouseLeave: v, onNodeContextMenu: y, onSelectionContextMenu: m, onSelectionStart: x, onSelectionEnd: S, connectionLineType: E, connectionLineStyle: z, connectionLineComponent: T, connectionLineContainerStyle: C, selectionKeyCode: U, selectionOnDrag: _, selectionMode: D, multiSelectionKeyCode: G, panActivationKeyCode: B, zoomActivationKeyCode: H, deleteKeyCode: $, onlyRenderVisibleElements: tt, elementsSelectable: ot, defaultViewport: nt, translateExtent: ut, minZoom: J, maxZoom: N, preventScrolling: L, defaultMarkerColor: O, zoomOnScroll: j, zoomOnPinch: Y, panOnScroll: k, panOnScrollSpeed: et, panOnScrollMode: lt, zoomOnDoubleClick: dt, panOnDrag: xt, autoPanOnSelection: M, onPaneClick: F, onPaneMouseEnter: ht, onPaneMouseMove: rt, onPaneMouseLeave: W, onPaneScroll: ft, onPaneContextMenu: gt, paneClickDistance: st, nodeClickDistance: ct, onEdgeContextMenu: bt, onEdgeMouseEnter: zt, onEdgeMouseMove: Et, onEdgeMouseLeave: Mt, reconnectRadius: Ot, onReconnect: Ht, onReconnectStart: Kt, onReconnectEnd: oe, noDragClassName: Nt, noWheelClassName: Se, noPanClassName: ye, disableKeyboardA11y: Ee, nodeExtent: pe, rfId: we, viewport: Pt, onViewportChange: an, nodesDraggable: Re }) {
  return Ap(n), Ap(i), rT(), P3(o), eT(Pt), w.jsx(_3, { onPaneClick: F, onPaneMouseEnter: ht, onPaneMouseMove: rt, onPaneMouseLeave: W, onPaneContextMenu: gt, onPaneScroll: ft, paneClickDistance: st, deleteKeyCode: $, selectionKeyCode: U, selectionOnDrag: _, selectionMode: D, onSelectionStart: x, onSelectionEnd: S, multiSelectionKeyCode: G, panActivationKeyCode: B, zoomActivationKeyCode: H, elementsSelectable: ot, zoomOnScroll: j, zoomOnPinch: Y, zoomOnDoubleClick: dt, panOnScroll: k, panOnScrollSpeed: et, panOnScrollMode: lt, panOnDrag: xt, autoPanOnSelection: M, defaultViewport: nt, translateExtent: ut, minZoom: J, maxZoom: N, onSelectionContextMenu: m, preventScrolling: L, noDragClassName: Nt, noWheelClassName: Se, noPanClassName: ye, disableKeyboardA11y: Ee, onViewportChange: an, isControlledViewport: !!Pt, children: w.jsxs(W3, { children: [w.jsx(F3, { edgeTypes: i, onEdgeClick: c, onEdgeDoubleClick: d, onReconnect: Ht, onReconnectStart: Kt, onReconnectEnd: oe, onlyRenderVisibleElements: tt, onEdgeContextMenu: bt, onEdgeMouseEnter: zt, onEdgeMouseMove: Et, onEdgeMouseLeave: Mt, reconnectRadius: Ot, defaultMarkerColor: O, noPanClassName: ye, disableKeyboardA11y: Ee, rfId: we }), w.jsx(uT, { style: z, type: E, component: T, containerStyle: C }), w.jsx("div", { className: "react-flow__edgelabel-renderer" }), w.jsx(R3, { nodeTypes: n, onNodeClick: r, onNodeDoubleClick: f, onNodeMouseEnter: h, onNodeMouseMove: p, onNodeMouseLeave: v, onNodeContextMenu: y, nodeClickDistance: ct, onlyRenderVisibleElements: tt, noPanClassName: ye, noDragClassName: Nt, disableKeyboardA11y: Ee, nodeExtent: pe, rfId: we, nodesDraggable: Re }), w.jsx("div", { className: "react-flow__viewport-portal" })] }) });
}
O1.displayName = "GraphView";
const sT = Q.memo(O1), cT = Ov(), Dp = ({ nodes: n, edges: i, defaultNodes: o, defaultEdges: r, width: c, height: f, fitView: d, fitViewOptions: h, minZoom: p = 0.5, maxZoom: v = 2, nodeOrigin: y, nodeExtent: m, zIndexMode: x = "basic" } = {}) => {
  const S = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), C = r ?? i ?? [], U = o ?? n ?? [], _ = y ?? [0, 0], D = m ?? Zu;
  Gv(z, T, C);
  const { nodesInitialized: G } = Bd(U, S, E, {
    nodeOrigin: _,
    nodeExtent: D,
    zIndexMode: x
  });
  let B = [0, 0, 1];
  if (d && c && f) {
    const H = Wu(S, {
      filter: (nt) => !!((nt.width || nt.initialWidth) && (nt.height || nt.initialHeight))
    }), { x: $, y: tt, zoom: ot } = Fd(H, c, f, p, v, h?.padding ?? 0.1);
    B = [$, tt, ot];
  }
  return {
    rfId: "1",
    width: c ?? 0,
    height: f ?? 0,
    transform: B,
    nodes: U,
    nodesInitialized: G,
    nodeLookup: S,
    parentLookup: E,
    edges: C,
    edgeLookup: T,
    connectionLookup: z,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: o !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: p,
    maxZoom: v,
    translateExtent: Zu,
    nodeExtent: D,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Di.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: _,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: !1,
    nodesDraggable: !0,
    nodesConnectable: !0,
    nodesFocusable: !0,
    edgesFocusable: !0,
    edgesReconnectable: !0,
    elementsSelectable: !0,
    elevateNodesOnSelect: !0,
    elevateEdgesOnSelect: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    fitViewQueued: d ?? !1,
    fitViewOptions: h,
    fitViewResolver: null,
    connection: { ...Nv },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: cT,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: _v,
    zIndexMode: x,
    defaultEdgeOptions: void 0,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onNodesDelete: void 0,
    onEdgesDelete: void 0,
    onDelete: void 0,
    onBeforeDelete: void 0,
    onViewportChangeStart: void 0,
    onViewportChange: void 0,
    onViewportChangeEnd: void 0,
    onNodeDragStart: void 0,
    onNodeDrag: void 0,
    onNodeDragStop: void 0,
    onSelectionDragStart: void 0,
    onSelectionDrag: void 0,
    onSelectionDragStop: void 0,
    onMoveStart: void 0,
    onMove: void 0,
    onMoveEnd: void 0,
    onConnect: void 0,
    onConnectStart: void 0,
    onConnectEnd: void 0,
    onClickConnectStart: void 0,
    onClickConnectEnd: void 0
  };
}, fT = ({ nodes: n, edges: i, defaultNodes: o, defaultEdges: r, width: c, height: f, fitView: d, fitViewOptions: h, minZoom: p, maxZoom: v, nodeOrigin: y, nodeExtent: m, zIndexMode: x }) => _N((S, E) => {
  async function z() {
    const { nodeLookup: T, panZoom: C, fitViewOptions: U, fitViewResolver: _, width: D, height: G, minZoom: B, maxZoom: H } = E();
    C && (await b2({
      nodes: T,
      width: D,
      height: G,
      panZoom: C,
      minZoom: B,
      maxZoom: H
    }, U), _?.resolve(!0), S({ fitViewResolver: null }));
  }
  return {
    ...Dp({
      nodes: n,
      edges: i,
      width: c,
      height: f,
      fitView: d,
      fitViewOptions: h,
      minZoom: p,
      maxZoom: v,
      nodeOrigin: y,
      nodeExtent: m,
      defaultNodes: o,
      defaultEdges: r,
      zIndexMode: x
    }),
    setNodes: (T) => {
      const { nodeLookup: C, parentLookup: U, nodeOrigin: _, nodeExtent: D, elevateNodesOnSelect: G, fitViewQueued: B, zIndexMode: H, nodesSelectionActive: $ } = E(), { nodesInitialized: tt, hasSelectedNodes: ot } = Bd(T, C, U, {
        nodeOrigin: _,
        nodeExtent: D,
        elevateNodesOnSelect: G,
        checkEquality: !0,
        zIndexMode: H
      }), nt = $ && ot;
      B && tt ? (z(), S({
        nodes: T,
        nodesInitialized: tt,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: nt
      })) : S({ nodes: T, nodesInitialized: tt, nodesSelectionActive: nt });
    },
    setEdges: (T) => {
      const { connectionLookup: C, edgeLookup: U } = E();
      Gv(C, U, T), S({ edges: T });
    },
    setDefaultNodesAndEdges: (T, C) => {
      if (T) {
        const { setNodes: U } = E();
        U(T), S({ hasDefaultNodes: !0 });
      }
      if (C) {
        const { setEdges: U } = E();
        U(C), S({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (T) => {
      const { triggerNodeChanges: C, nodeLookup: U, parentLookup: _, domNode: D, nodeOrigin: G, nodeExtent: B, debug: H, fitViewQueued: $, zIndexMode: tt } = E(), { changes: ot, updatedInternals: nt } = Z2(T, U, _, D, G, B, tt);
      nt && (V2(U, _, { nodeOrigin: G, nodeExtent: B, zIndexMode: tt }), $ ? (z(), S({ fitViewQueued: !1, fitViewOptions: void 0 })) : S({}), ot?.length > 0 && (H && console.log("React Flow: trigger node changes", ot), C?.(ot)));
    },
    updateNodePositions: (T, C = !1) => {
      const U = [];
      let _ = [];
      const { nodeLookup: D, triggerNodeChanges: G, connection: B, updateConnection: H, onNodesChangeMiddlewareMap: $ } = E();
      for (const [tt, ot] of T) {
        const nt = D.get(tt), ut = !!(nt?.expandParent && nt?.parentId && ot?.position), J = {
          id: tt,
          type: "position",
          position: ut ? {
            x: Math.max(0, ot.position.x),
            y: Math.max(0, ot.position.y)
          } : ot.position,
          dragging: C
        };
        if (nt && B.inProgress && B.fromNode.id === nt.id) {
          const N = Da(nt, B.fromHandle, wt.Left, !0);
          H({ ...B, from: N });
        }
        ut && nt.parentId && U.push({
          id: tt,
          parentId: nt.parentId,
          rect: {
            ...ot.internals.positionAbsolute,
            width: ot.measured.width ?? 0,
            height: ot.measured.height ?? 0
          }
        }), _.push(J);
      }
      if (U.length > 0) {
        const { parentLookup: tt, nodeOrigin: ot } = E(), nt = ah(U, D, tt, ot);
        _.push(...nt);
      }
      for (const tt of $.values())
        _ = tt(_);
      G(_);
    },
    triggerNodeChanges: (T) => {
      const { onNodesChange: C, setNodes: U, nodes: _, hasDefaultNodes: D, debug: G } = E();
      if (T?.length) {
        if (D) {
          const B = u1(T, _);
          U(B);
        }
        G && console.log("React Flow: trigger node changes", T), C?.(T);
      }
    },
    triggerEdgeChanges: (T) => {
      const { onEdgesChange: C, setEdges: U, edges: _, hasDefaultEdges: D, debug: G } = E();
      if (T?.length) {
        if (D) {
          const B = QN(T, _);
          U(B);
        }
        G && console.log("React Flow: trigger edge changes", T), C?.(T);
      }
    },
    addSelectedNodes: (T) => {
      const { multiSelectionActive: C, edgeLookup: U, nodeLookup: _, triggerNodeChanges: D, triggerEdgeChanges: G } = E();
      if (C) {
        const B = T.map((H) => wa(H, !0));
        D(B);
        return;
      }
      D(Ti(_, /* @__PURE__ */ new Set([...T]), !0)), G(Ti(U));
    },
    addSelectedEdges: (T) => {
      const { multiSelectionActive: C, edgeLookup: U, nodeLookup: _, triggerNodeChanges: D, triggerEdgeChanges: G } = E();
      if (C) {
        const B = T.map((H) => wa(H, !0));
        G(B);
        return;
      }
      G(Ti(U, /* @__PURE__ */ new Set([...T]))), D(Ti(_, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: T, edges: C } = {}) => {
      const { edges: U, nodes: _, nodeLookup: D, triggerNodeChanges: G, triggerEdgeChanges: B } = E(), H = T || _, $ = C || U, tt = [];
      for (const nt of H) {
        if (!nt.selected)
          continue;
        const ut = D.get(nt.id);
        ut && (ut.selected = !1), tt.push(wa(nt.id, !1));
      }
      const ot = [];
      for (const nt of $)
        nt.selected && ot.push(wa(nt.id, !1));
      G(tt), B(ot);
    },
    setMinZoom: (T) => {
      const { panZoom: C, maxZoom: U } = E();
      C?.setScaleExtent([T, U]), S({ minZoom: T });
    },
    setMaxZoom: (T) => {
      const { panZoom: C, minZoom: U } = E();
      C?.setScaleExtent([U, T]), S({ maxZoom: T });
    },
    setTranslateExtent: (T) => {
      E().panZoom?.setTranslateExtent(T), S({ translateExtent: T });
    },
    resetSelectedElements: () => {
      const { edges: T, nodes: C, triggerNodeChanges: U, triggerEdgeChanges: _, elementsSelectable: D } = E();
      if (!D)
        return;
      const G = C.reduce((H, $) => $.selected ? [...H, wa($.id, !1)] : H, []), B = T.reduce((H, $) => $.selected ? [...H, wa($.id, !1)] : H, []);
      U(G), _(B);
    },
    setNodeExtent: (T) => {
      const { nodes: C, nodeLookup: U, parentLookup: _, nodeOrigin: D, elevateNodesOnSelect: G, nodeExtent: B, zIndexMode: H } = E();
      T[0][0] === B[0][0] && T[0][1] === B[0][1] && T[1][0] === B[1][0] && T[1][1] === B[1][1] || (Bd(C, U, _, {
        nodeOrigin: D,
        nodeExtent: T,
        elevateNodesOnSelect: G,
        checkEquality: !1,
        zIndexMode: H
      }), S({ nodeExtent: T }));
    },
    panBy: (T) => {
      const { transform: C, width: U, height: _, panZoom: D, translateExtent: G } = E();
      return G2({ delta: T, panZoom: D, transform: C, translateExtent: G, width: U, height: _ });
    },
    setCenter: async (T, C, U) => {
      const { width: _, height: D, maxZoom: G, panZoom: B } = E();
      if (!B)
        return !1;
      const H = typeof U?.zoom < "u" ? U.zoom : G;
      return await B.setViewport({
        x: _ / 2 - T * H,
        y: D / 2 - C * H,
        zoom: H
      }, { duration: U?.duration, ease: U?.ease, interpolate: U?.interpolate }), !0;
    },
    cancelConnection: () => {
      S({
        connection: { ...Nv }
      });
    },
    updateConnection: (T) => {
      S({ connection: T });
    },
    reset: () => S({ ...Dp() })
  };
}, Object.is);
function dT({ initialNodes: n, initialEdges: i, defaultNodes: o, defaultEdges: r, initialWidth: c, initialHeight: f, initialMinZoom: d, initialMaxZoom: h, initialFitViewOptions: p, fitView: v, nodeOrigin: y, nodeExtent: m, zIndexMode: x, children: S }) {
  const [E] = Q.useState(() => fT({
    nodes: n,
    edges: i,
    defaultNodes: o,
    defaultEdges: r,
    width: c,
    height: f,
    fitView: v,
    minZoom: d,
    maxZoom: h,
    fitViewOptions: p,
    nodeOrigin: y,
    nodeExtent: m,
    zIndexMode: x
  }));
  return w.jsx(NN, { value: E, children: w.jsx(IN, { children: w.jsx(f3, { children: S }) }) });
}
function hT({ children: n, nodes: i, edges: o, defaultNodes: r, defaultEdges: c, width: f, height: d, fitView: h, fitViewOptions: p, minZoom: v, maxZoom: y, nodeOrigin: m, nodeExtent: x, zIndexMode: S }) {
  return Q.useContext(bs) ? w.jsx(w.Fragment, { children: n }) : w.jsx(dT, { initialNodes: i, initialEdges: o, defaultNodes: r, defaultEdges: c, initialWidth: f, initialHeight: d, fitView: h, initialFitViewOptions: p, initialMinZoom: v, initialMaxZoom: y, nodeOrigin: m, nodeExtent: x, zIndexMode: S, children: n });
}
const gT = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function mT({ nodes: n, edges: i, defaultNodes: o, defaultEdges: r, className: c, nodeTypes: f, edgeTypes: d, onNodeClick: h, onEdgeClick: p, onInit: v, onMove: y, onMoveStart: m, onMoveEnd: x, onConnect: S, onConnectStart: E, onConnectEnd: z, onClickConnectStart: T, onClickConnectEnd: C, onNodeMouseEnter: U, onNodeMouseMove: _, onNodeMouseLeave: D, onNodeContextMenu: G, onNodeDoubleClick: B, onNodeDragStart: H, onNodeDrag: $, onNodeDragStop: tt, onNodesDelete: ot, onEdgesDelete: nt, onDelete: ut, onSelectionChange: J, onSelectionDragStart: N, onSelectionDrag: L, onSelectionDragStop: O, onSelectionContextMenu: j, onSelectionStart: Y, onSelectionEnd: k, onBeforeDelete: et, connectionMode: lt, connectionLineType: dt = $l.Bezier, connectionLineStyle: xt, connectionLineComponent: M, connectionLineContainerStyle: F, deleteKeyCode: ht = "Backspace", selectionKeyCode: rt = "Shift", selectionOnDrag: W = !1, selectionMode: ft = Gu.Full, panActivationKeyCode: gt = "Space", multiSelectionKeyCode: st = $u() ? "Meta" : "Control", zoomActivationKeyCode: ct = $u() ? "Meta" : "Control", snapToGrid: bt, snapGrid: zt, onlyRenderVisibleElements: Et = !1, selectNodesOnDrag: Mt, nodesDraggable: Ot, autoPanOnNodeFocus: Ht, nodesConnectable: Kt, nodesFocusable: oe, nodeOrigin: Nt = a1, edgesFocusable: Se, edgesReconnectable: ye, elementsSelectable: Ee = !0, defaultViewport: pe = LN, minZoom: we = 0.5, maxZoom: Pt = 2, translateExtent: an = Zu, preventScrolling: Re = !0, nodeExtent: An, defaultMarkerColor: Jl = "#b1b1b7", zoomOnScroll: ji = !0, zoomOnPinch: $n = !0, panOnScroll: Il = !1, panOnScrollSpeed: Fl = 0.5, panOnScrollMode: q = Ta.Free, zoomOnDoubleClick: pt = !0, panOnDrag: St = !0, onPaneClick: ee, onPaneMouseEnter: Ae, onPaneMouseMove: no, onPaneMouseLeave: lo, onPaneScroll: Oa, onPaneContextMenu: Ns, paneClickDistance: ao = 1, nodeClickDistance: Ts = 0, children: Cs, onReconnect: Wl, onReconnectStart: He, onReconnectEnd: Dn, onEdgeContextMenu: je, onEdgeDoubleClick: Ms, onEdgeMouseEnter: zs, onEdgeMouseMove: As, onEdgeMouseLeave: Ra, reconnectRadius: Ha = 10, onNodesChange: ja, onEdgesChange: Kn, noDragClassName: Ua = "nodrag", noWheelClassName: Pl = "nowheel", noPanClassName: Ui = "nopan", fitView: io, fitViewOptions: Bi, connectOnClick: Li, attributionPosition: ta, proOptions: Ds, defaultEdgeOptions: uo, elevateNodesOnSelect: oo = !0, elevateEdgesOnSelect: ro = !1, disableKeyboardA11y: Ba = !1, autoPanOnConnect: Vi, autoPanOnNodeDrag: so, autoPanOnSelection: co = !0, autoPanSpeed: mn, connectionRadius: ge, isValidConnection: De, onError: gl, style: fo, id: ho, nodeDragThreshold: Os, connectionDragThreshold: go, viewport: ea, onViewportChange: La, width: Va, height: kn, colorMode: ml = "light", debug: na, onScroll: Jn, ariaLabelConfig: re, zIndexMode: Yi = "basic", ...mo }, yo) {
  const yn = ho || "1", yl = XN(ml), Rs = Q.useCallback((qi) => {
    qi.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Jn?.(qi);
  }, [Jn]);
  return w.jsx("div", { "data-testid": "rf__wrapper", ...mo, onScroll: Rs, style: { ...fo, ...gT }, ref: yo, className: he(["react-flow", c, yl]), id: ho, role: "application", children: w.jsxs(hT, { nodes: n, edges: i, width: Va, height: kn, fitView: io, fitViewOptions: Bi, minZoom: we, maxZoom: Pt, nodeOrigin: Nt, nodeExtent: An, zIndexMode: Yi, children: [w.jsx(qN, { nodes: n, edges: i, defaultNodes: o, defaultEdges: r, onConnect: S, onConnectStart: E, onConnectEnd: z, onClickConnectStart: T, onClickConnectEnd: C, nodesDraggable: Ot, autoPanOnNodeFocus: Ht, nodesConnectable: Kt, nodesFocusable: oe, edgesFocusable: Se, edgesReconnectable: ye, elementsSelectable: Ee, elevateNodesOnSelect: oo, elevateEdgesOnSelect: ro, minZoom: we, maxZoom: Pt, nodeExtent: An, onNodesChange: ja, onEdgesChange: Kn, snapToGrid: bt, snapGrid: zt, connectionMode: lt, translateExtent: an, connectOnClick: Li, defaultEdgeOptions: uo, fitView: io, fitViewOptions: Bi, onNodesDelete: ot, onEdgesDelete: nt, onDelete: ut, onNodeDragStart: H, onNodeDrag: $, onNodeDragStop: tt, onSelectionDrag: L, onSelectionDragStart: N, onSelectionDragStop: O, onMove: y, onMoveStart: m, onMoveEnd: x, noPanClassName: Ui, nodeOrigin: Nt, rfId: yn, autoPanOnConnect: Vi, autoPanOnNodeDrag: so, autoPanSpeed: mn, onError: gl, connectionRadius: ge, isValidConnection: De, selectNodesOnDrag: Mt, nodeDragThreshold: Os, connectionDragThreshold: go, onBeforeDelete: et, debug: na, ariaLabelConfig: re, zIndexMode: Yi }), w.jsx(sT, { onInit: v, onNodeClick: h, onEdgeClick: p, onNodeMouseEnter: U, onNodeMouseMove: _, onNodeMouseLeave: D, onNodeContextMenu: G, onNodeDoubleClick: B, nodeTypes: f, edgeTypes: d, connectionLineType: dt, connectionLineStyle: xt, connectionLineComponent: M, connectionLineContainerStyle: F, selectionKeyCode: rt, selectionOnDrag: W, selectionMode: ft, deleteKeyCode: ht, multiSelectionKeyCode: st, panActivationKeyCode: gt, zoomActivationKeyCode: ct, onlyRenderVisibleElements: Et, defaultViewport: pe, translateExtent: an, minZoom: we, maxZoom: Pt, preventScrolling: Re, zoomOnScroll: ji, zoomOnPinch: $n, zoomOnDoubleClick: pt, panOnScroll: Il, panOnScrollSpeed: Fl, panOnScrollMode: q, panOnDrag: St, autoPanOnSelection: co, onPaneClick: ee, onPaneMouseEnter: Ae, onPaneMouseMove: no, onPaneMouseLeave: lo, onPaneScroll: Oa, onPaneContextMenu: Ns, paneClickDistance: ao, nodeClickDistance: Ts, onSelectionContextMenu: j, onSelectionStart: Y, onSelectionEnd: k, onReconnect: Wl, onReconnectStart: He, onReconnectEnd: Dn, onEdgeContextMenu: je, onEdgeDoubleClick: Ms, onEdgeMouseEnter: zs, onEdgeMouseMove: As, onEdgeMouseLeave: Ra, reconnectRadius: Ha, defaultMarkerColor: Jl, noDragClassName: Ua, noWheelClassName: Pl, noPanClassName: Ui, rfId: yn, disableKeyboardA11y: Ba, nodeExtent: An, viewport: ea, onViewportChange: La, nodesDraggable: Ot }), w.jsx(BN, { onSelectionChange: J }), Cs, w.jsx(ON, { proOptions: Ds, position: ta }), w.jsx(DN, { rfId: yn, disableKeyboardA11y: Ba })] }) });
}
var R1 = o1(mT);
const yT = (n) => n.domNode?.querySelector(".react-flow__edgelabel-renderer");
function pT({ children: n }) {
  const i = Vt(yT);
  return i ? t1.createPortal(n, i) : null;
}
const vT = (n) => n.domNode?.querySelector(".react-flow__viewport-portal");
function xT({ children: n }) {
  const i = Vt(vT);
  return i ? t1.createPortal(n, i) : null;
}
function bT({ dimensions: n, lineWidth: i, variant: o, className: r }) {
  return w.jsx("path", { strokeWidth: i, d: `M${n[0] / 2} 0 V${n[1]} M0 ${n[1] / 2} H${n[0]}`, className: he(["react-flow__background-pattern", o, r]) });
}
function ST({ radius: n, className: i }) {
  return w.jsx("circle", { cx: n, cy: n, r: n, className: he(["react-flow__background-pattern", "dots", i]) });
}
var kl;
(function(n) {
  n.Lines = "lines", n.Dots = "dots", n.Cross = "cross";
})(kl || (kl = {}));
const ET = {
  [kl.Dots]: 1,
  [kl.Lines]: 1,
  [kl.Cross]: 6
}, wT = (n) => ({ transform: n.transform, patternId: `pattern-${n.rfId}` });
function H1({
  id: n,
  variant: i = kl.Dots,
  // only used for dots and cross
  gap: o = 20,
  // only used for lines and cross
  size: r,
  lineWidth: c = 1,
  offset: f = 0,
  color: d,
  bgColor: h,
  style: p,
  className: v,
  patternClassName: y
}) {
  const m = Q.useRef(null), { transform: x, patternId: S } = Vt(wT, le), E = r || ET[i], z = i === kl.Dots, T = i === kl.Cross, C = Array.isArray(o) ? o : [o, o], U = [C[0] * x[2] || 1, C[1] * x[2] || 1], _ = E * x[2], D = Array.isArray(f) ? f : [f, f], G = T ? [_, _] : U, B = [
    D[0] * x[2] + G[0] / 2,
    D[1] * x[2] + G[1] / 2
  ], H = `${S}${n || ""}`;
  return w.jsxs("svg", { className: he(["react-flow__background", v]), style: {
    ...p,
    ...ws,
    "--xy-background-color-props": h,
    "--xy-background-pattern-color-props": d
  }, ref: m, "data-testid": "rf__background", children: [w.jsx("pattern", { id: H, x: x[0] % U[0], y: x[1] % U[1], width: U[0], height: U[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${B[0]},-${B[1]})`, children: z ? w.jsx(ST, { radius: _ / 2, className: y }) : w.jsx(bT, { dimensions: G, lineWidth: c, variant: i, className: y }) }), w.jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${H})` })] });
}
H1.displayName = "Background";
const j1 = Q.memo(H1);
function _T() {
  return w.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: w.jsx("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function NT() {
  return w.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: w.jsx("path", { d: "M0 0h32v4.2H0z" }) });
}
function TT() {
  return w.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: w.jsx("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function CT() {
  return w.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: w.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function MT() {
  return w.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: w.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function Qr({ children: n, className: i, ...o }) {
  return w.jsx("button", { type: "button", className: he(["react-flow__controls-button", i]), ...o, children: n });
}
const zT = (n) => ({
  isInteractive: n.nodesDraggable || n.nodesConnectable || n.elementsSelectable,
  minZoomReached: n.transform[2] <= n.minZoom,
  maxZoomReached: n.transform[2] >= n.maxZoom,
  ariaLabelConfig: n.ariaLabelConfig
});
function U1({ style: n, showZoom: i = !0, showFitView: o = !0, showInteractive: r = !0, fitViewOptions: c, onZoomIn: f, onZoomOut: d, onFitView: h, onInteractiveChange: p, className: v, children: y, position: m = "bottom-left", orientation: x = "vertical", "aria-label": S }) {
  const E = Wt(), { isInteractive: z, minZoomReached: T, maxZoomReached: C, ariaLabelConfig: U } = Vt(zT, le), { zoomIn: _, zoomOut: D, fitView: G } = Es(), B = () => {
    _(), f?.();
  }, H = () => {
    D(), d?.();
  }, $ = () => {
    G(c), h?.();
  }, tt = () => {
    E.setState({
      nodesDraggable: !z,
      nodesConnectable: !z,
      elementsSelectable: !z
    }), p?.(!z);
  }, ot = x === "horizontal" ? "horizontal" : "vertical";
  return w.jsxs(Ss, { className: he(["react-flow__controls", ot, v]), position: m, style: n, "data-testid": "rf__controls", "aria-label": S ?? U["controls.ariaLabel"], children: [i && w.jsxs(w.Fragment, { children: [w.jsx(Qr, { onClick: B, className: "react-flow__controls-zoomin", title: U["controls.zoomIn.ariaLabel"], "aria-label": U["controls.zoomIn.ariaLabel"], disabled: C, children: w.jsx(_T, {}) }), w.jsx(Qr, { onClick: H, className: "react-flow__controls-zoomout", title: U["controls.zoomOut.ariaLabel"], "aria-label": U["controls.zoomOut.ariaLabel"], disabled: T, children: w.jsx(NT, {}) })] }), o && w.jsx(Qr, { className: "react-flow__controls-fitview", onClick: $, title: U["controls.fitView.ariaLabel"], "aria-label": U["controls.fitView.ariaLabel"], children: w.jsx(TT, {}) }), r && w.jsx(Qr, { className: "react-flow__controls-interactive", onClick: tt, title: U["controls.interactive.ariaLabel"], "aria-label": U["controls.interactive.ariaLabel"], children: z ? w.jsx(MT, {}) : w.jsx(CT, {}) }), y] });
}
U1.displayName = "Controls";
const B1 = Q.memo(U1);
function AT({ id: n, x: i, y: o, width: r, height: c, style: f, color: d, strokeColor: h, strokeWidth: p, className: v, borderRadius: y, shapeRendering: m, selected: x, onClick: S }) {
  const { background: E, backgroundColor: z } = f || {}, T = d || E || z;
  return w.jsx("rect", { className: he(["react-flow__minimap-node", { selected: x }, v]), x: i, y: o, rx: y, ry: y, width: r, height: c, style: {
    fill: T,
    stroke: h,
    strokeWidth: p
  }, shapeRendering: m, onClick: S ? (C) => S(C, n) : void 0 });
}
const DT = Q.memo(AT), OT = (n) => n.nodes.map((i) => i.id), wd = (n) => n instanceof Function ? n : () => n;
function RT({
  nodeStrokeColor: n,
  nodeColor: i,
  nodeClassName: o = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: c,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: f = DT,
  onClick: d
}) {
  const h = Vt(OT, le), p = wd(i), v = wd(n), y = wd(o), m = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return w.jsx(w.Fragment, { children: h.map((x) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    w.jsx(jT, { id: x, nodeColorFunc: p, nodeStrokeColorFunc: v, nodeClassNameFunc: y, nodeBorderRadius: r, nodeStrokeWidth: c, NodeComponent: f, onClick: d, shapeRendering: m }, x)
  )) });
}
function HT({ id: n, nodeColorFunc: i, nodeStrokeColorFunc: o, nodeClassNameFunc: r, nodeBorderRadius: c, nodeStrokeWidth: f, shapeRendering: d, NodeComponent: h, onClick: p }) {
  const { node: v, x: y, y: m, width: x, height: S } = Vt((E) => {
    const z = E.nodeLookup.get(n);
    if (!z)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const T = z.internals.userNode, { x: C, y: U } = z.internals.positionAbsolute, { width: _, height: D } = zn(T);
    return {
      node: T,
      x: C,
      y: U,
      width: _,
      height: D
    };
  }, le);
  return !v || v.hidden || !Rv(v) ? null : w.jsx(h, { x: y, y: m, width: x, height: S, style: v.style, selected: !!v.selected, className: r(v), color: i(v), borderRadius: c, strokeColor: o(v), strokeWidth: f, shapeRendering: d, onClick: p, id: v.id });
}
const jT = Q.memo(HT);
var UT = Q.memo(RT);
const BT = 200, LT = 150, VT = (n) => !n.hidden, YT = (n) => {
  const i = {
    x: -n.transform[0] / n.transform[2],
    y: -n.transform[1] / n.transform[2],
    width: n.width / n.transform[2],
    height: n.height / n.transform[2]
  };
  let o = !1;
  for (const r of n.nodeLookup.values())
    if (!r.hidden) {
      o = !0;
      break;
    }
  return {
    viewBB: i,
    boundingRect: o ? Av(Wu(n.nodeLookup, { filter: VT }), i) : i,
    rfId: n.rfId,
    panZoom: n.panZoom,
    translateExtent: n.translateExtent,
    flowWidth: n.width,
    flowHeight: n.height,
    ariaLabelConfig: n.ariaLabelConfig
  };
}, Op = (n, i) => n.x === i.x && n.y === i.y && n.width === i.width && n.height === i.height, qT = (n, i) => Op(n.viewBB, i.viewBB) && Op(n.boundingRect, i.boundingRect) && n.rfId === i.rfId && n.panZoom === i.panZoom && n.translateExtent === i.translateExtent && n.flowWidth === i.flowWidth && n.flowHeight === i.flowHeight && n.ariaLabelConfig === i.ariaLabelConfig, XT = "react-flow__minimap-desc";
function L1({
  style: n,
  className: i,
  nodeStrokeColor: o,
  nodeColor: r,
  nodeClassName: c = "",
  nodeBorderRadius: f = 5,
  nodeStrokeWidth: d,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: h,
  bgColor: p,
  maskColor: v,
  maskStrokeColor: y,
  maskStrokeWidth: m,
  position: x = "bottom-right",
  onClick: S,
  onNodeClick: E,
  pannable: z = !1,
  zoomable: T = !1,
  ariaLabel: C,
  inversePan: U,
  zoomStep: _ = 1,
  offsetScale: D = 5
}) {
  const G = Wt(), B = Q.useRef(null), { boundingRect: H, panZoom: $, viewBB: tt, rfId: ot, translateExtent: nt, flowWidth: ut, flowHeight: J, ariaLabelConfig: N } = Vt(YT, qT), L = n?.width ?? BT, O = n?.height ?? LT, j = H.width / L, Y = H.height / O, k = Math.max(j, Y), et = k * L, lt = k * O, dt = D * k, xt = H.x - (et - H.width) / 2 - dt, M = H.y - (lt - H.height) / 2 - dt, F = et + dt * 2, ht = lt + dt * 2, rt = `${XT}-${ot}`, W = Q.useRef(0), ft = Q.useRef();
  W.current = k, Q.useEffect(() => {
    const zt = G.getState().panZoom;
    if (B.current && zt)
      return ft.current = P2({
        domNode: B.current,
        panZoom: zt,
        getTransform: () => G.getState().transform,
        getViewScale: () => W.current
      }), () => {
        ft.current?.destroy();
      };
  }, [$]), Q.useEffect(() => {
    ft.current?.update({
      translateExtent: nt,
      width: ut,
      height: J,
      inversePan: U,
      pannable: z,
      zoomStep: _,
      zoomable: T
    });
  }, [z, T, U, _, nt, ut, J]);
  const gt = S ? (zt) => {
    const [Et, Mt] = ft.current?.pointer(zt) || [0, 0];
    S(zt, { x: Et, y: Mt });
  } : void 0, st = Q.useCallback((zt, Et) => {
    const Mt = G.getState().nodeLookup.get(Et).internals.userNode;
    E?.(zt, Mt);
  }, [E]), ct = E ? st : void 0, bt = C ?? N["minimap.ariaLabel"];
  return w.jsx(Ss, { position: x, style: {
    ...n,
    "--xy-minimap-background-color-props": typeof p == "string" ? p : void 0,
    "--xy-minimap-mask-background-color-props": typeof v == "string" ? v : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof y == "string" ? y : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof m == "number" ? m * k : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-width-props": typeof d == "number" ? d : void 0
  }, className: he(["react-flow__minimap", i]), "data-testid": "rf__minimap", children: w.jsxs("svg", { width: L, height: O, viewBox: `${xt} ${M} ${F} ${ht}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": rt, ref: B, onClick: gt, children: [bt && w.jsx("title", { id: rt, children: bt }), w.jsx(UT, { onClick: ct, nodeColor: r, nodeStrokeColor: o, nodeBorderRadius: f, nodeClassName: c, nodeStrokeWidth: d, nodeComponent: h }), w.jsx("path", { className: "react-flow__minimap-mask", d: `M${xt - dt},${M - dt}h${F + dt * 2}v${ht + dt * 2}h${-F - dt * 2}z
        M${tt.x},${tt.y}h${tt.width}v${tt.height}h${-tt.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
L1.displayName = "MiniMap";
const ZT = Q.memo(L1), GT = (n) => (i) => n ? `${Math.max(1 / i.transform[2], 1)}` : void 0, QT = {
  [Hi.Line]: "right",
  [Hi.Handle]: "bottom-right"
};
function $T({ nodeId: n, position: i, variant: o = Hi.Handle, className: r, style: c = void 0, children: f, color: d, minWidth: h = 10, minHeight: p = 10, maxWidth: v = Number.MAX_VALUE, maxHeight: y = Number.MAX_VALUE, keepAspectRatio: m = !1, resizeDirection: x, autoScale: S = !0, shouldResize: E, onResizeStart: z, onResize: T, onResizeEnd: C }) {
  const U = d1(), _ = typeof n == "string" ? n : U, D = Wt(), G = Q.useRef(null), B = o === Hi.Handle, H = Vt(Q.useCallback(GT(B && S), [B, S]), le), $ = Q.useRef(null), tt = i ?? QT[o];
  Q.useEffect(() => {
    if (!(!G.current || !_))
      return $.current || ($.current = dN({
        domNode: G.current,
        nodeId: _,
        getStoreItems: () => {
          const { nodeLookup: nt, transform: ut, snapGrid: J, snapToGrid: N, nodeOrigin: L, domNode: O } = D.getState();
          return {
            nodeLookup: nt,
            transform: ut,
            snapGrid: J,
            snapToGrid: N,
            nodeOrigin: L,
            paneDomNode: O
          };
        },
        onChange: (nt, ut) => {
          const { triggerNodeChanges: J, nodeLookup: N, parentLookup: L, nodeOrigin: O } = D.getState(), j = [], Y = { x: nt.x, y: nt.y }, k = N.get(_);
          if (k && k.expandParent && k.parentId) {
            const et = k.origin ?? O, lt = nt.width ?? k.measured.width ?? 0, dt = nt.height ?? k.measured.height ?? 0, xt = {
              id: k.id,
              parentId: k.parentId,
              rect: {
                width: lt,
                height: dt,
                ...Hv({
                  x: nt.x ?? k.position.x,
                  y: nt.y ?? k.position.y
                }, { width: lt, height: dt }, k.parentId, N, et)
              }
            }, M = ah([xt], N, L, O);
            j.push(...M), Y.x = nt.x ? Math.max(et[0] * lt, nt.x) : void 0, Y.y = nt.y ? Math.max(et[1] * dt, nt.y) : void 0;
          }
          if (Y.x !== void 0 && Y.y !== void 0) {
            const et = {
              id: _,
              type: "position",
              position: { ...Y }
            };
            j.push(et);
          }
          if (nt.width !== void 0 && nt.height !== void 0) {
            const lt = {
              id: _,
              type: "dimensions",
              resizing: !0,
              setAttributes: x ? x === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: nt.width,
                height: nt.height
              }
            };
            j.push(lt);
          }
          for (const et of ut) {
            const lt = {
              ...et,
              type: "position"
            };
            j.push(lt);
          }
          J(j);
        },
        onEnd: ({ width: nt, height: ut }) => {
          const J = {
            id: _,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: nt,
              height: ut
            }
          };
          D.getState().triggerNodeChanges([J]);
        }
      })), $.current.update({
        controlPosition: tt,
        boundaries: {
          minWidth: h,
          minHeight: p,
          maxWidth: v,
          maxHeight: y
        },
        keepAspectRatio: m,
        resizeDirection: x,
        onResizeStart: z,
        onResize: T,
        onResizeEnd: C,
        shouldResize: E
      }), () => {
        $.current?.destroy();
      };
  }, [
    tt,
    h,
    p,
    v,
    y,
    m,
    z,
    T,
    C,
    E
  ]);
  const ot = tt.split("-");
  return w.jsx("div", { className: he(["react-flow__resize-control", "nodrag", ...ot, o, r]), ref: G, style: {
    ...c,
    scale: H,
    ...d && { [B ? "backgroundColor" : "borderColor"]: d }
  }, children: f });
}
Q.memo($T);
function _d(n, i) {
  const o = new Set(n.map((c) => c.trim().toLowerCase()));
  let r = 1;
  for (; o.has(`${i}_${r}`.toLowerCase()); ) r++;
  return `${i}_${r}`;
}
function Rp(n, i, o, r) {
  const c = n.entities.find((h) => h.id === i), f = c?.fields.findIndex((h) => h.id === o) ?? -1;
  if (!c || f < 0 || f + r < 0 || f + r >= c.fields.length)
    return n;
  const d = [...c.fields];
  return [d[f], d[f + r]] = [
    d[f + r],
    d[f]
  ], {
    ...n,
    entities: n.entities.map(
      (h) => h.id === i ? { ...h, fields: d } : h
    )
  };
}
function KT(n) {
  const i = Math.max(1, Math.ceil(Math.sqrt(n.entities.length)));
  let o = 60;
  const r = [];
  for (let c = 0; c < n.entities.length; c += i) {
    const f = n.entities.slice(c, c + i);
    f.forEach(
      (d, h) => r.push({
        ...d,
        position: { x: 60 + h * 340, y: o }
      })
    ), o += Math.max(
      ...f.map(
        (d) => 140 + d.fields.length * 30 + (d.annotation ? 70 : 0)
      )
    ) + 80;
  }
  return { ...n, entities: r };
}
function Hp(n, i, o = []) {
  const r = new Set(i), c = new Set(o);
  return {
    ...n,
    ...n.strokes ? {
      strokes: n.strokes.filter((f) => !r.has(f.id))
    } : {},
    entities: n.entities.filter((f) => !r.has(f.id)),
    relationships: n.relationships.filter(
      (f) => !c.has(f.id) && !r.has(f.source) && !r.has(f.target)
    )
  };
}
function kT({ data: n }) {
  const i = n.stroke, o = Math.max(...i.points.map((c) => c.x)) + i.width, r = Math.max(...i.points.map((c) => c.y)) + i.width;
  return /* @__PURE__ */ w.jsx(
    "svg",
    {
      width: o,
      height: r,
      className: "erd-stroke",
      "aria-label": "Freehand drawing",
      children: /* @__PURE__ */ w.jsx(
        "polyline",
        {
          points: i.points.map((c) => `${c.x},${c.y}`).join(" "),
          fill: "none",
          stroke: i.color,
          strokeWidth: i.width,
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  );
}
function JT({
  color: n,
  width: i,
  onStroke: o
}) {
  const r = Es(), c = Q.useRef(
    null
  ), [f, d] = Q.useState([]), h = (y) => r.screenToFlowPosition(
    { x: y.clientX, y: y.clientY },
    { snapToGrid: !1 }
  ), p = () => {
    c.current = null, d([]);
  }, v = (y) => {
    const m = c.current;
    if (!m || m.pointer !== y.pointerId || m.points.length >= 2e3)
      return;
    const x = h(y), S = m.points[m.points.length - 1];
    Math.hypot(x.x - S.x, x.y - S.y) < 1 / r.getZoom() || (m.points.push(x), d([...m.points]));
  };
  return /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
    /* @__PURE__ */ w.jsx(xT, { children: /* @__PURE__ */ w.jsx("svg", { className: "erd-drawing-preview", children: /* @__PURE__ */ w.jsx(
      "polyline",
      {
        points: f.map((y) => `${y.x},${y.y}`).join(" "),
        fill: "none",
        stroke: n,
        strokeWidth: i,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ) }) }),
    /* @__PURE__ */ w.jsx(
      "div",
      {
        className: "erd-drawing-surface",
        "aria-label": "Drawing canvas",
        tabIndex: 0,
        onKeyDown: (y) => {
          y.key === "Escape" && p();
        },
        onPointerDown: (y) => {
          y.button !== 0 || c.current || (y.preventDefault(), y.currentTarget.focus(), y.currentTarget.setPointerCapture(y.pointerId), c.current = { pointer: y.pointerId, points: [h(y)] }, d([...c.current.points]));
        },
        onPointerMove: v,
        onPointerUp: (y) => {
          if (c.current?.pointer !== y.pointerId) return;
          v(y);
          const m = c.current.points, x = {
            x: Math.min(...m.map((E) => E.x)) - i,
            y: Math.min(...m.map((E) => E.y)) - i
          }, S = m.map((E) => ({
            x: E.x - x.x,
            y: E.y - x.y
          }));
          S.length === 1 && S.push({ x: S[0].x + 0.01, y: S[0].y }), o({
            id: crypto.randomUUID(),
            position: x,
            points: S,
            color: n,
            width: i
          }), p(), y.currentTarget.releasePointerCapture(y.pointerId);
        },
        onPointerCancel: p,
        onLostPointerCapture: p
      }
    )
  ] });
}
function IT({
  data: n
}) {
  const i = n.entity;
  return /* @__PURE__ */ w.jsxs("div", { className: `erd-node erd-node-${i.role}`, children: [
    /* @__PURE__ */ w.jsx(Kl, { type: "target", position: wt.Left, id: "left" }),
    /* @__PURE__ */ w.jsx(Kl, { type: "source", position: wt.Right, id: "right" }),
    /* @__PURE__ */ w.jsx(Kl, { type: "target", position: wt.Top, id: "top" }),
    /* @__PURE__ */ w.jsx(Kl, { type: "source", position: wt.Bottom, id: "bottom" }),
    /* @__PURE__ */ w.jsxs("div", { className: "erd-node-heading", children: [
      /* @__PURE__ */ w.jsx("small", { children: i.role }),
      /* @__PURE__ */ w.jsx("strong", { children: i.name || "Untitled" })
    ] }),
    i.annotation && /* @__PURE__ */ w.jsx("div", { className: "erd-node-note", title: i.annotation, children: i.annotation }),
    !i.fields.length && /* @__PURE__ */ w.jsx("div", { className: "erd-node-empty", children: n.readOnly ? "No fields saved" : "Select to add fields" }),
    i.fields.map((o) => /* @__PURE__ */ w.jsxs("div", { className: "erd-node-field", children: [
      /* @__PURE__ */ w.jsxs("span", { children: [
        /* @__PURE__ */ w.jsx("span", { className: `erd-key ${o.pk || o.fk ? "erd-key-set" : ""}`, children: [o.pk && "PK", o.fk && "FK"].filter(Boolean).join(" ") || "·" }),
        o.name
      ] }),
      /* @__PURE__ */ w.jsx("small", { children: o.data_type })
    ] }, o.id))
  ] });
}
const jp = (n, i) => n ? i === "many" ? "0..*" : "0..1" : i === "many" ? "1..*" : "1";
function FT(n) {
  const [i, o, r] = Pd(n), c = n.data?.relation;
  return /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
    /* @__PURE__ */ w.jsx(
      eo,
      {
        path: i,
        markerEnd: c?.target_cardinality === "many" ? "url(#erd-crowfoot)" : "url(#erd-one)",
        markerStart: c?.source_cardinality === "many" ? "url(#erd-crowfoot-start)" : "url(#erd-one-start)",
        style: {
          stroke: n.selected ? "#0b766e" : "#8597a5",
          strokeWidth: n.selected ? 3 : 1.6
        }
      }
    ),
    c && /* @__PURE__ */ w.jsx(pT, { children: /* @__PURE__ */ w.jsxs(
      "div",
      {
        className: `erd-edge-label ${n.selected ? "selected" : ""}`,
        style: {
          transform: `translate(-50%, -50%) translate(${o}px,${r}px)`
        },
        children: [
          c.label || "relationship",
          " ·",
          " ",
          jp(c.source_optional, c.source_cardinality),
          " :",
          " ",
          jp(c.target_optional, c.target_cardinality)
        ]
      }
    ) })
  ] });
}
const V1 = { entity: Q.memo(IT), stroke: Q.memo(kT) }, Y1 = { relation: Q.memo(FT) };
function WT(n, i) {
  if (n.match(/^[a-z]+:\/\//i))
    return n;
  if (n.match(/^\/\//))
    return window.location.protocol + n;
  if (n.match(/^[a-z]+:/i))
    return n;
  const o = document.implementation.createHTMLDocument(), r = o.createElement("base"), c = o.createElement("a");
  return o.head.appendChild(r), o.body.appendChild(c), i && (r.href = i), c.href = n, c.href;
}
const PT = /* @__PURE__ */ (() => {
  let n = 0;
  const i = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (n += 1, `u${i()}${n}`);
})();
function dl(n) {
  const i = [];
  for (let o = 0, r = n.length; o < r; o++)
    i.push(n[o]);
  return i;
}
function cs(n, i) {
  const r = (n.ownerDocument.defaultView || window).getComputedStyle(n).getPropertyValue(i);
  return r ? parseFloat(r.replace("px", "")) : 0;
}
function tC(n) {
  const i = cs(n, "border-left-width"), o = cs(n, "border-right-width");
  return n.clientWidth + i + o;
}
function eC(n) {
  const i = cs(n, "border-top-width"), o = cs(n, "border-bottom-width");
  return n.clientHeight + i + o;
}
function q1(n, i = {}) {
  const o = i.width || tC(n), r = i.height || eC(n);
  return { width: o, height: r };
}
function nC() {
  let n, i;
  try {
    i = process;
  } catch {
  }
  const o = i && i.env ? i.env.devicePixelRatio : null;
  return o && (n = parseInt(o, 10), Number.isNaN(n) && (n = 1)), n || window.devicePixelRatio || 1;
}
const en = 16384;
function lC(n) {
  (n.width > en || n.height > en) && (n.width > en && n.height > en ? n.width > n.height ? (n.height *= en / n.width, n.width = en) : (n.width *= en / n.height, n.height = en) : n.width > en ? (n.height *= en / n.width, n.width = en) : (n.width *= en / n.height, n.height = en));
}
function fs(n) {
  return new Promise((i, o) => {
    const r = new Image();
    r.decode = () => i(r), r.onload = () => i(r), r.onerror = o, r.crossOrigin = "anonymous", r.decoding = "async", r.src = n;
  });
}
async function aC(n) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(n)).then(encodeURIComponent).then((i) => `data:image/svg+xml;charset=utf-8,${i}`);
}
async function iC(n, i, o) {
  const r = "http://www.w3.org/2000/svg", c = document.createElementNS(r, "svg"), f = document.createElementNS(r, "foreignObject");
  return c.setAttribute("width", `${i}`), c.setAttribute("height", `${o}`), c.setAttribute("viewBox", `0 0 ${i} ${o}`), f.setAttribute("width", "100%"), f.setAttribute("height", "100%"), f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("externalResourcesRequired", "true"), c.appendChild(f), f.appendChild(n), aC(c);
}
const $e = (n, i) => {
  if (n instanceof i)
    return !0;
  const o = Object.getPrototypeOf(n);
  return o === null ? !1 : o.constructor.name === i.name || $e(o, i);
};
function uC(n) {
  const i = n.getPropertyValue("content");
  return `${n.cssText} content: '${i.replace(/'|"/g, "")}';`;
}
function oC(n) {
  return dl(n).map((i) => {
    const o = n.getPropertyValue(i), r = n.getPropertyPriority(i);
    return `${i}: ${o}${r ? " !important" : ""};`;
  }).join(" ");
}
function rC(n, i, o) {
  const r = `.${n}:${i}`, c = o.cssText ? uC(o) : oC(o);
  return document.createTextNode(`${r}{${c}}`);
}
function Up(n, i, o) {
  const r = window.getComputedStyle(n, o), c = r.getPropertyValue("content");
  if (c === "" || c === "none")
    return;
  const f = PT();
  try {
    i.className = `${i.className} ${f}`;
  } catch {
    return;
  }
  const d = document.createElement("style");
  d.appendChild(rC(f, o, r)), i.appendChild(d);
}
function sC(n, i) {
  Up(n, i, ":before"), Up(n, i, ":after");
}
const Bp = "application/font-woff", Lp = "image/jpeg", cC = {
  woff: Bp,
  woff2: Bp,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Lp,
  jpeg: Lp,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function fC(n) {
  const i = /\.([^./]*?)$/g.exec(n);
  return i ? i[1] : "";
}
function uh(n) {
  const i = fC(n).toLowerCase();
  return cC[i] || "";
}
function dC(n) {
  return n.split(/,/)[1];
}
function Yd(n) {
  return n.search(/^(data:)/) !== -1;
}
function hC(n, i) {
  return `data:${i};base64,${n}`;
}
async function X1(n, i, o) {
  const r = await fetch(n, i);
  if (r.status === 404)
    throw new Error(`Resource "${r.url}" not found`);
  const c = await r.blob();
  return new Promise((f, d) => {
    const h = new FileReader();
    h.onerror = d, h.onloadend = () => {
      try {
        f(o({ res: r, result: h.result }));
      } catch (p) {
        d(p);
      }
    }, h.readAsDataURL(c);
  });
}
const Nd = {};
function gC(n, i, o) {
  let r = n.replace(/\?.*/, "");
  return o && (r = n), /ttf|otf|eot|woff2?/i.test(r) && (r = r.replace(/.*\//, "")), i ? `[${i}]${r}` : r;
}
async function oh(n, i, o) {
  const r = gC(n, i, o.includeQueryParams);
  if (Nd[r] != null)
    return Nd[r];
  o.cacheBust && (n += (/\?/.test(n) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let c;
  try {
    const f = await X1(n, o.fetchRequestInit, ({ res: d, result: h }) => (i || (i = d.headers.get("Content-Type") || ""), dC(h)));
    c = hC(f, i);
  } catch (f) {
    c = o.imagePlaceholder || "";
    let d = `Failed to fetch resource: ${n}`;
    f && (d = typeof f == "string" ? f : f.message), d && console.warn(d);
  }
  return Nd[r] = c, c;
}
async function mC(n) {
  const i = n.toDataURL();
  return i === "data:," ? n.cloneNode(!1) : fs(i);
}
async function yC(n, i) {
  if (n.currentSrc) {
    const f = document.createElement("canvas"), d = f.getContext("2d");
    f.width = n.clientWidth, f.height = n.clientHeight, d?.drawImage(n, 0, 0, f.width, f.height);
    const h = f.toDataURL();
    return fs(h);
  }
  const o = n.poster, r = uh(o), c = await oh(o, r, i);
  return fs(c);
}
async function pC(n) {
  var i;
  try {
    if (!((i = n?.contentDocument) === null || i === void 0) && i.body)
      return await _s(n.contentDocument.body, {}, !0);
  } catch {
  }
  return n.cloneNode(!1);
}
async function vC(n, i) {
  return $e(n, HTMLCanvasElement) ? mC(n) : $e(n, HTMLVideoElement) ? yC(n, i) : $e(n, HTMLIFrameElement) ? pC(n) : n.cloneNode(!1);
}
const xC = (n) => n.tagName != null && n.tagName.toUpperCase() === "SLOT";
async function bC(n, i, o) {
  var r, c;
  let f = [];
  return xC(n) && n.assignedNodes ? f = dl(n.assignedNodes()) : $e(n, HTMLIFrameElement) && (!((r = n.contentDocument) === null || r === void 0) && r.body) ? f = dl(n.contentDocument.body.childNodes) : f = dl(((c = n.shadowRoot) !== null && c !== void 0 ? c : n).childNodes), f.length === 0 || $e(n, HTMLVideoElement) || await f.reduce((d, h) => d.then(() => _s(h, o)).then((p) => {
    p && i.appendChild(p);
  }), Promise.resolve()), i;
}
function SC(n, i) {
  const o = i.style;
  if (!o)
    return;
  const r = window.getComputedStyle(n);
  r.cssText ? (o.cssText = r.cssText, o.transformOrigin = r.transformOrigin) : dl(r).forEach((c) => {
    let f = r.getPropertyValue(c);
    c === "font-size" && f.endsWith("px") && (f = `${Math.floor(parseFloat(f.substring(0, f.length - 2))) - 0.1}px`), $e(n, HTMLIFrameElement) && c === "display" && f === "inline" && (f = "block"), c === "d" && i.getAttribute("d") && (f = `path(${i.getAttribute("d")})`), o.setProperty(c, f, r.getPropertyPriority(c));
  });
}
function EC(n, i) {
  $e(n, HTMLTextAreaElement) && (i.innerHTML = n.value), $e(n, HTMLInputElement) && i.setAttribute("value", n.value);
}
function wC(n, i) {
  if ($e(n, HTMLSelectElement)) {
    const r = Array.from(i.children).find((c) => n.value === c.getAttribute("value"));
    r && r.setAttribute("selected", "");
  }
}
function _C(n, i) {
  return $e(i, Element) && (SC(n, i), sC(n, i), EC(n, i), wC(n, i)), i;
}
async function NC(n, i) {
  const o = n.querySelectorAll ? n.querySelectorAll("use") : [];
  if (o.length === 0)
    return n;
  const r = {};
  for (let f = 0; f < o.length; f++) {
    const h = o[f].getAttribute("xlink:href");
    if (h) {
      const p = n.querySelector(h), v = document.querySelector(h);
      !p && v && !r[h] && (r[h] = await _s(v, i, !0));
    }
  }
  const c = Object.values(r);
  if (c.length) {
    const f = "http://www.w3.org/1999/xhtml", d = document.createElementNS(f, "svg");
    d.setAttribute("xmlns", f), d.style.position = "absolute", d.style.width = "0", d.style.height = "0", d.style.overflow = "hidden", d.style.display = "none";
    const h = document.createElementNS(f, "defs");
    d.appendChild(h);
    for (let p = 0; p < c.length; p++)
      h.appendChild(c[p]);
    n.appendChild(d);
  }
  return n;
}
async function _s(n, i, o) {
  return !o && i.filter && !i.filter(n) ? null : Promise.resolve(n).then((r) => vC(r, i)).then((r) => bC(n, r, i)).then((r) => _C(n, r)).then((r) => NC(r, i));
}
const Z1 = /url\((['"]?)([^'"]+?)\1\)/g, TC = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, CC = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function MC(n) {
  const i = n.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${i})(['"]?\\))`, "g");
}
function zC(n) {
  const i = [];
  return n.replace(Z1, (o, r, c) => (i.push(c), o)), i.filter((o) => !Yd(o));
}
async function AC(n, i, o, r, c) {
  try {
    const f = o ? WT(i, o) : i, d = uh(i);
    let h;
    return c || (h = await oh(f, d, r)), n.replace(MC(i), `$1${h}$3`);
  } catch {
  }
  return n;
}
function DC(n, { preferredFontFormat: i }) {
  return i ? n.replace(CC, (o) => {
    for (; ; ) {
      const [r, , c] = TC.exec(o) || [];
      if (!c)
        return "";
      if (c === i)
        return `src: ${r};`;
    }
  }) : n;
}
function G1(n) {
  return n.search(Z1) !== -1;
}
async function Q1(n, i, o) {
  if (!G1(n))
    return n;
  const r = DC(n, o);
  return zC(r).reduce((f, d) => f.then((h) => AC(h, d, i, o)), Promise.resolve(r));
}
async function $r(n, i, o) {
  var r;
  const c = (r = i.style) === null || r === void 0 ? void 0 : r.getPropertyValue(n);
  if (c) {
    const f = await Q1(c, null, o);
    return i.style.setProperty(n, f, i.style.getPropertyPriority(n)), !0;
  }
  return !1;
}
async function OC(n, i) {
  await $r("background", n, i) || await $r("background-image", n, i), await $r("mask", n, i) || await $r("mask-image", n, i);
}
async function RC(n, i) {
  const o = $e(n, HTMLImageElement);
  if (!(o && !Yd(n.src)) && !($e(n, SVGImageElement) && !Yd(n.href.baseVal)))
    return;
  const r = o ? n.src : n.href.baseVal, c = await oh(r, uh(r), i);
  await new Promise((f, d) => {
    n.onload = f, n.onerror = d;
    const h = n;
    h.decode && (h.decode = f), h.loading === "lazy" && (h.loading = "eager"), o ? (n.srcset = "", n.src = c) : n.href.baseVal = c;
  });
}
async function HC(n, i) {
  const r = dl(n.childNodes).map((c) => $1(c, i));
  await Promise.all(r).then(() => n);
}
async function $1(n, i) {
  $e(n, Element) && (await OC(n, i), await RC(n, i), await HC(n, i));
}
function jC(n, i) {
  const { style: o } = n;
  i.backgroundColor && (o.backgroundColor = i.backgroundColor), i.width && (o.width = `${i.width}px`), i.height && (o.height = `${i.height}px`);
  const r = i.style;
  return r != null && Object.keys(r).forEach((c) => {
    o[c] = r[c];
  }), n;
}
const Vp = {};
async function Yp(n) {
  let i = Vp[n];
  if (i != null)
    return i;
  const r = await (await fetch(n)).text();
  return i = { url: n, cssText: r }, Vp[n] = i, i;
}
async function qp(n, i) {
  let o = n.cssText;
  const r = /url\(["']?([^"')]+)["']?\)/g, f = (o.match(/url\([^)]+\)/g) || []).map(async (d) => {
    let h = d.replace(r, "$1");
    return h.startsWith("https://") || (h = new URL(h, n.url).href), X1(h, i.fetchRequestInit, ({ result: p }) => (o = o.replace(d, `url(${p})`), [d, p]));
  });
  return Promise.all(f).then(() => o);
}
function Xp(n) {
  if (n == null)
    return [];
  const i = [], o = /(\/\*[\s\S]*?\*\/)/gi;
  let r = n.replace(o, "");
  const c = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  for (; ; ) {
    const p = c.exec(r);
    if (p === null)
      break;
    i.push(p[0]);
  }
  r = r.replace(c, "");
  const f = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, d = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", h = new RegExp(d, "gi");
  for (; ; ) {
    let p = f.exec(r);
    if (p === null) {
      if (p = h.exec(r), p === null)
        break;
      f.lastIndex = h.lastIndex;
    } else
      h.lastIndex = f.lastIndex;
    i.push(p[0]);
  }
  return i;
}
async function UC(n, i) {
  const o = [], r = [];
  return n.forEach((c) => {
    if ("cssRules" in c)
      try {
        dl(c.cssRules || []).forEach((f, d) => {
          if (f.type === CSSRule.IMPORT_RULE) {
            let h = d + 1;
            const p = f.href, v = Yp(p).then((y) => qp(y, i)).then((y) => Xp(y).forEach((m) => {
              try {
                c.insertRule(m, m.startsWith("@import") ? h += 1 : c.cssRules.length);
              } catch (x) {
                console.error("Error inserting rule from remote css", {
                  rule: m,
                  error: x
                });
              }
            })).catch((y) => {
              console.error("Error loading remote css", y.toString());
            });
            r.push(v);
          }
        });
      } catch (f) {
        const d = n.find((h) => h.href == null) || document.styleSheets[0];
        c.href != null && r.push(Yp(c.href).then((h) => qp(h, i)).then((h) => Xp(h).forEach((p) => {
          d.insertRule(p, c.cssRules.length);
        })).catch((h) => {
          console.error("Error loading remote stylesheet", h);
        })), console.error("Error inlining remote css file", f);
      }
  }), Promise.all(r).then(() => (n.forEach((c) => {
    if ("cssRules" in c)
      try {
        dl(c.cssRules || []).forEach((f) => {
          o.push(f);
        });
      } catch (f) {
        console.error(`Error while reading CSS rules from ${c.href}`, f);
      }
  }), o));
}
function BC(n) {
  return n.filter((i) => i.type === CSSRule.FONT_FACE_RULE).filter((i) => G1(i.style.getPropertyValue("src")));
}
async function LC(n, i) {
  if (n.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const o = dl(n.ownerDocument.styleSheets), r = await UC(o, i);
  return BC(r);
}
async function VC(n, i) {
  const o = await LC(n, i);
  return (await Promise.all(o.map((c) => {
    const f = c.parentStyleSheet ? c.parentStyleSheet.href : null;
    return Q1(c.cssText, f, i);
  }))).join(`
`);
}
async function YC(n, i) {
  const o = i.fontEmbedCSS != null ? i.fontEmbedCSS : i.skipFonts ? null : await VC(n, i);
  if (o) {
    const r = document.createElement("style"), c = document.createTextNode(o);
    r.appendChild(c), n.firstChild ? n.insertBefore(r, n.firstChild) : n.appendChild(r);
  }
}
async function qC(n, i = {}) {
  const { width: o, height: r } = q1(n, i), c = await _s(n, i, !0);
  return await YC(c, i), await $1(c, i), jC(c, i), await iC(c, o, r);
}
async function XC(n, i = {}) {
  const { width: o, height: r } = q1(n, i), c = await qC(n, i), f = await fs(c), d = document.createElement("canvas"), h = d.getContext("2d"), p = i.pixelRatio || nC(), v = i.canvasWidth || o, y = i.canvasHeight || r;
  return d.width = v * p, d.height = y * p, i.skipAutoScale || lC(d), d.style.width = `${v}`, d.style.height = `${y}`, i.backgroundColor && (h.fillStyle = i.backgroundColor, h.fillRect(0, 0, d.width, d.height)), h.drawImage(f, 0, 0, d.width, d.height), d;
}
async function ZC(n, i = {}) {
  return (await XC(n, i)).toDataURL();
}
function GC(n) {
  const o = Math.max(400, n.width + 320), r = Math.max(300, n.height + 320), c = Math.min(
    1.5,
    4096 / o,
    4096 / r,
    Math.sqrt(12e6 / (o * r))
  );
  return {
    width: Math.ceil(o * c),
    height: Math.ceil(r * c),
    scale: c,
    x: (160 - n.x) * c,
    y: (160 - n.y) * c
  };
}
async function QC(n, i, o) {
  await document.fonts.ready;
  const r = n.querySelector(".react-flow");
  if (!r) throw new Error("Canvas is unavailable");
  const c = Cv(i.getNodes());
  let f = c.x, d = c.y, h = c.x + c.width, p = c.y + c.height;
  for (const S of i.getEdges()) {
    const E = S.data?.lane;
    typeof E != "number" || !Number.isFinite(E) || (S.data?.vertical ? (f = Math.min(f, E), h = Math.max(h, E)) : (d = Math.min(d, E), p = Math.max(p, E)));
  }
  const v = GC({
    x: f,
    y: d,
    width: h - f,
    height: p - d
  }), y = r.cloneNode(!0);
  Object.assign(y.style, {
    position: "relative",
    left: "0",
    top: "0",
    width: `${v.width}px`,
    height: `${v.height}px`,
    background: "white"
  }), y.querySelectorAll(
    ".react-flow__controls, .react-flow__minimap, .react-flow__background, .react-flow__attribution, .react-flow__handle, .erd-drawing-surface, .erd-drawing-preview"
  ).forEach((S) => S.remove()), y.querySelectorAll(".selected, .sut-node-active").forEach((S) => S.classList.remove("selected", "sut-node-active")), y.querySelectorAll(".react-flow__node, .react-flow__edge").forEach((S) => {
    S.style.opacity = "1";
  }), y.querySelectorAll(".react-flow__edge-path").forEach((S) => {
    S.style.opacity = "1", S.style.stroke = "#8597a5", S.style.strokeWidth = "1.6";
  });
  const m = y.querySelector(".react-flow__viewport");
  if (!m) throw new Error("Canvas viewport is unavailable");
  m.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.scale})`;
  const x = document.createElement("div");
  Object.assign(x.style, {
    position: "fixed",
    left: "-100000px",
    top: "0"
  }), x.appendChild(y), n.appendChild(x);
  try {
    const S = await ZC(y, {
      width: v.width,
      height: v.height,
      pixelRatio: 1,
      backgroundColor: "#ffffff",
      style: { left: "0", top: "0" }
    }), E = document.createElement("a");
    return E.download = `${o.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 100) || "diagram"}.png`, E.href = S, document.body.appendChild(E), E.click(), E.remove(), { url: S, filename: E.download };
  } finally {
    x.remove();
  }
}
class $C {
  pending = null;
  timer = null;
  save;
  delay;
  constructor(i, o = 500) {
    this.save = i, this.delay = o;
  }
  queue(i, o = !1) {
    this.pending = i, this.timer && clearTimeout(this.timer), this.timer = null, o ? this.flush() : this.timer = setTimeout(() => this.flush(), this.delay);
  }
  flush() {
    this.timer && clearTimeout(this.timer), this.timer = null;
    const i = this.pending;
    this.pending = null, i !== null && this.save(i);
  }
}
function KC(n, i) {
  const o = new Set(
    n.entities.map((h) => h.name.trim().toLowerCase())
  ), r = [], c = n.entities.length ? Math.max(...n.entities.map((h) => h.position.x)) + 380 : 60;
  let f = 60, d = 0;
  for (const { entity: h, ifNotExists: p } of i) {
    const v = h.name.trim().toLowerCase();
    if (o.has(v)) {
      if (p) continue;
      throw new Error(
        `Table ${h.name} already exists. Use IF NOT EXISTS to skip it.`
      );
    }
    if (n.entities.length + r.length >= 100)
      throw new Error("A diagram can contain at most 100 tables.");
    r.length && r.length % 3 === 0 && (f += d + 80, d = 0);
    const y = { x: c + r.length % 3 * 340, y: f };
    if (Math.abs(y.x) >= 1e5 || Math.abs(y.y) >= 1e5)
      throw new Error(
        "Move the existing tables closer to the canvas center before importing."
      );
    r.push({
      ...h,
      position: y,
      role: n.kind === "conceptual_erd" ? "entity" : n.kind === "star_schema" ? "dimension" : "table"
    }), d = Math.max(d, 140 + h.fields.length * 30), o.add(v);
  }
  return r.length ? { ...n, entities: [...n.entities, ...r] } : n;
}
const kC = {
  getItem: (n) => sessionStorage.getItem(n),
  setItem: (n, i) => sessionStorage.setItem(n, i),
  removeItem: (n) => sessionStorage.removeItem(n)
};
class JC {
  snapshot;
  saved;
  key;
  storage;
  saves;
  now;
  listeners = /* @__PURE__ */ new Set();
  past = [];
  future = [];
  lastEdit = 0;
  lastImport = null;
  started = !1;
  recovered = !1;
  submitted = [];
  constructor(i) {
    this.key = `constructor-draft:${i.documentId}`, this.storage = i.workspace ? i.storage ?? kC : null, this.now = i.now ?? Date.now, this.saved = JSON.stringify(i.savedDiagram ?? i.diagram);
    const o = this.readDraft();
    this.recovered = !!(o && o.diagram.kind === i.diagram.kind && o.base === this.saved);
    const r = this.recovered ? o.diagram : i.diagram;
    this.snapshot = {
      diagram: r,
      conflictingDraft: o && !this.recovered && o.diagram.kind === r.kind && JSON.stringify(o.diagram) !== this.saved ? o.diagram : null,
      canUndo: !1,
      canRedo: !1,
      isSaved: JSON.stringify(r) === this.saved
    }, this.saves = new $C((c) => {
      this.submitted = [...this.submitted.slice(-49), c], i.save(c);
    });
  }
  get diagram() {
    return this.snapshot.diagram;
  }
  getSnapshot = () => this.snapshot;
  subscribe = (i) => (this.listeners.add(i), () => {
    this.listeners.delete(i);
  });
  /** Run after mount, so constructing a session never sends a save. */
  start() {
    this.started || (this.started = !0, this.recovered && !this.snapshot.isSaved ? this.saves.queue(this.diagram, !0) : this.snapshot.conflictingDraft || this.forget());
  }
  acknowledge(i) {
    const o = JSON.stringify(i);
    if (o === this.saved) return;
    const r = this.submitted.findIndex(
      (c) => JSON.stringify(c) === o
    );
    this.saved = o, JSON.stringify(this.diagram) === o ? this.forget() : r !== -1 && !this.snapshot.conflictingDraft && this.remember(), r !== -1 && (this.submitted = this.submitted.slice(r + 1)), this.publish();
  }
  commit(i) {
    const o = this.diagram;
    if (i === o) return;
    const r = this.now(), c = o.strokes !== i.strokes || o.entities.length !== i.entities.length || o.relationships.length !== i.relationships.length || o.entities.some(
      (f, d) => f.fields.length !== i.entities[d]?.fields.length || f.fields.some(
        (h, p) => h.id !== i.entities[d]?.fields[p]?.id
      ) || f.position !== i.entities[d]?.position
    );
    (r - this.lastEdit > 600 || c || !this.past.length) && (this.past = [...this.past.slice(-49), o]), this.future = [], this.lastEdit = r, this.change(i), this.saves.queue(i, c);
  }
  travel(i) {
    const o = i === "past" ? this.past : this.future, r = o.at(-1);
    r && (i === "past" ? (this.past = o.slice(0, -1), this.future = [...this.future, this.diagram]) : (this.past = [...this.past, this.diagram], this.future = o.slice(0, -1)), this.lastEdit = 0, this.change(r), this.saves.queue(r, !0));
  }
  importSql(i) {
    if (this.lastImport === i.id) return null;
    this.lastImport = i.id;
    try {
      const o = this.diagram, r = KC(o, i.tables), c = r.entities.length - o.entities.length;
      return this.commit(r), {
        id: i.id,
        message: c ? `Added ${c} table${c === 1 ? "" : "s"} to the diagram.` : "All tables already exist; the diagram was unchanged.",
        firstEntityId: c ? r.entities[o.entities.length].id : void 0
      };
    } catch (o) {
      return {
        id: i.id,
        error: o instanceof Error ? o.message : "Could not add the SQL tables."
      };
    }
  }
  restoreDraft() {
    const i = this.snapshot.conflictingDraft;
    i && (this.past = [], this.future = [], this.lastEdit = 0, this.change(i), this.saves.queue(i, !0));
  }
  discardDraft() {
    this.forget(), this.snapshot = { ...this.snapshot, conflictingDraft: null }, this.publish();
  }
  flush() {
    this.saves.flush();
  }
  change(i) {
    this.snapshot = { ...this.snapshot, diagram: i, conflictingDraft: null }, this.remember(), this.publish();
  }
  publish() {
    this.snapshot = {
      ...this.snapshot,
      canUndo: this.past.length > 0,
      canRedo: this.future.length > 0,
      isSaved: JSON.stringify(this.diagram) === this.saved
    };
    for (const i of this.listeners) i();
  }
  remember() {
    try {
      this.storage?.setItem(
        this.key,
        JSON.stringify({ base: this.saved, diagram: this.diagram })
      );
    } catch {
    }
  }
  forget() {
    try {
      this.storage?.removeItem(this.key);
    } catch {
    }
  }
  readDraft() {
    try {
      const i = this.storage?.getItem(this.key);
      if (!i || i.length > 2e6) return null;
      const o = JSON.parse(i);
      return typeof o.base == "string" && o.diagram?.version === 1 && Array.isArray(o.diagram.entities) && Array.isArray(o.diagram.relationships) ? o : null;
    } catch {
      return null;
    }
  }
}
const Uu = () => crypto.randomUUID();
function Zp() {
  return /* @__PURE__ */ w.jsxs(
    "svg",
    {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ w.jsx(
          "rect",
          {
            x: "3",
            y: "3",
            width: "18",
            height: "18",
            rx: "3",
            stroke: "currentColor",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ w.jsx(
          "path",
          {
            d: "M3 9h18M9 9v12M3 15h18",
            stroke: "currentColor",
            strokeWidth: "1.5"
          }
        )
      ]
    }
  );
}
const IC = (n) => n === "conceptual_erd" ? "entity" : n === "star_schema" ? "dimension" : "table", FC = (n, i) => ({
  id: Uu(),
  source: n,
  target: i,
  label: "",
  source_cardinality: "one",
  target_cardinality: "many",
  source_optional: !1,
  target_optional: !0
});
function WC({
  attemptLinked: n,
  onReturn: i,
  onBusy: o,
  diagram: r,
  documentId: c,
  layout: f = "embedded",
  documentName: d = "diagram",
  savedDiagram: h,
  saveError: p,
  kind: v,
  onSave: y,
  sqlImport: m,
  onSqlImportResult: x
}) {
  const S = Q.useRef(null), [E, z] = Q.useState(!0), [T, C] = Q.useState(!1), [U, _] = Q.useState("#126e63"), [D, G] = Q.useState(3), [B, H] = Q.useState(!1), [$, tt] = Q.useState(""), [ot, nt] = Q.useState(null), ut = Q.useRef(y);
  ut.current = y;
  const [J] = Q.useState(
    () => new JC({
      documentId: c,
      diagram: r,
      savedDiagram: h,
      workspace: f === "workspace",
      save: (q) => ut.current(q)
    })
  ), { diagram: N, conflictingDraft: L, canUndo: O, canRedo: j, isSaved: Y } = Q.useSyncExternalStore(J.subscribe, J.getSnapshot);
  Q.useEffect(() => {
    n && o?.(!Y || !!L || !!p);
  }, [Y, L, p]);
  const [k, et] = Q.useState(null), [lt, dt] = Q.useState(null), [xt, M] = Q.useState([]), [F, ht] = Q.useState(null), [rt, W] = Q.useState(""), [ft, gt] = Q.useState(
    "tables"
  ), st = Q.useRef(null), ct = Q.useRef(!1), [bt, zt] = Q.useState(!1);
  Q.useEffect(() => {
    J.start();
    const q = () => J.flush();
    return window.addEventListener("pagehide", q), () => {
      window.removeEventListener("pagehide", q), q();
    };
  }, [J]), Q.useEffect(() => {
    J.acknowledge(h ?? r);
  }, [J, h, r]), Q.useEffect(() => {
    M((q) => {
      const pt = new Map(q.map((St) => [St.id, St]));
      return [
        ...N.entities.map(
          (St) => pt.get(St.id)?.data.entity === St && pt.get(St.id)?.selected === (k === St.id) ? pt.get(St.id) : {
            ...pt.get(St.id),
            id: St.id,
            type: "entity",
            selected: k === St.id,
            position: St.position,
            data: { entity: St }
          }
        ),
        ...(N.strokes ?? []).map((St) => ({
          ...pt.get(St.id),
          id: St.id,
          type: "stroke",
          position: St.position,
          data: { stroke: St }
        }))
      ];
    });
  }, [N.entities, N.strokes, k]);
  const Et = Q.useCallback(
    (q) => J.commit(q),
    [J]
  ), Mt = Q.useRef(null);
  Q.useEffect(() => {
    const q = Mt.current;
    !q || !F || !xt.some((pt) => pt.id === q) || (Mt.current = null, F.fitView({
      nodes: [{ id: q }],
      padding: 0.7,
      maxZoom: 1.1,
      duration: 250
    }));
  }, [xt, F]), Q.useEffect(() => {
    if (!m) return;
    const q = J.importSql(m);
    if (!q) return;
    q.error || (W(""), gt("tables"), z(!0), q.firstEntityId && (Mt.current = q.firstEntityId, et(q.firstEntityId), dt(null)));
    const { firstEntityId: pt, ...St } = q;
    x?.(St);
  }, [m, J, x]);
  const Ot = (q) => J.travel(q), Ht = (q) => {
    z(!0), ft !== "tables" && W(""), gt("tables"), et(q), dt(null), F?.fitView({
      nodes: [{ id: q }],
      padding: 0.7,
      maxZoom: 1.1,
      duration: 250
    });
  }, Kt = (q, pt) => Et({
    ...J.diagram,
    entities: J.diagram.entities.map(
      (St) => St.id === q ? { ...St, ...pt } : St
    )
  }), oe = (q, pt) => Et({
    ...J.diagram,
    relationships: J.diagram.relationships.map(
      (St) => St.id === q ? { ...St, ...pt } : St
    )
  }), Nt = N.entities.find((q) => q.id === k), Se = Q.useMemo(
    () => new Map(N.entities.map((q) => [q.id, q.name])),
    [N.entities]
  ), ye = rt.trim().toLowerCase(), Ee = Q.useMemo(
    () => N.entities.filter(
      (q) => `${q.name} ${q.fields.map((pt) => pt.name).join(" ")}`.toLowerCase().includes(ye)
    ),
    [N.entities, ye]
  ), pe = Q.useMemo(
    () => N.relationships.filter(
      (q) => `${Se.get(q.source)} ${Se.get(q.target)} ${q.label}`.toLowerCase().includes(ye)
    ),
    [N.relationships, Se, ye]
  );
  Q.useEffect(() => {
    ct.current && Nt && E && (ct.current = !1, st.current?.focus(), st.current?.select());
  }, [Nt?.id, E]);
  const we = (q, pt = !1) => {
    ft !== "relationships" && W(""), dt(q), et(null), z(!0), gt("relationships");
    const St = J.diagram.relationships.find(
      (ee) => ee.id === q
    );
    pt && St && F?.fitView({
      nodes: [{ id: St.source }, { id: St.target }],
      padding: 0.4,
      maxZoom: 1.1,
      duration: 250
    });
  }, Pt = N.relationships.find((q) => q.id === lt), an = Q.useMemo(
    () => N.relationships.map((q) => ({
      id: q.id,
      source: q.source,
      target: q.target,
      sourceHandle: q.source_handle ?? "right",
      targetHandle: q.target_handle ?? "left",
      selected: q.id === lt,
      type: "relation",
      data: { relation: q }
    })),
    [N.relationships, lt]
  ), Re = Q.useCallback(
    (q) => {
      if (q.source && q.target && q.source !== q.target && J.diagram.relationships.length < 300 && !J.diagram.relationships.some(
        (pt) => pt.source === q.source && pt.target === q.target
      )) {
        const pt = {
          ...FC(q.source, q.target),
          source_handle: q.sourceHandle,
          target_handle: q.targetHandle
        };
        Et({
          ...J.diagram,
          relationships: [...J.diagram.relationships, pt]
        }), dt(pt.id), et(null), z(!0), gt("relationships"), W("");
      }
    },
    [Et]
  ), An = () => {
    if (J.diagram.entities.length >= 100) return;
    const q = {
      id: Uu(),
      name: _d(
        J.diagram.entities.map((pt) => pt.name),
        v === "star_schema" ? "dimension" : v === "conceptual_erd" ? "entity" : "table"
      ),
      role: IC(v),
      annotation: "",
      position: {
        x: 80 + N.entities.length % 4 * 260,
        y: 80 + Math.floor(N.entities.length / 4) * 180
      },
      fields: []
    };
    Et({ ...J.diagram, entities: [...J.diagram.entities, q] }), et(q.id), dt(null), z(!0), gt("tables"), ct.current = !0, W(""), requestAnimationFrame(
      () => {
        F?.fitView({
          nodes: [{ id: q.id }],
          padding: 0.7,
          maxZoom: 1.1,
          duration: 250
        });
      }
    );
  }, Jl = () => {
    Nt && (Et(Hp(J.diagram, [Nt.id])), et(null));
  }, ji = () => {
    !Nt || Nt.fields.length >= 100 || Kt(Nt.id, {
      fields: [
        ...Nt.fields,
        {
          id: Uu(),
          name: _d(
            Nt.fields.map((q) => q.name),
            "field"
          ),
          data_type: "",
          pk: !1,
          fk: !1
        }
      ]
    });
  }, $n = (q, pt) => {
    Nt && Kt(Nt.id, {
      fields: Nt.fields.map(
        (St) => St.id === q ? { ...St, ...pt } : St
      )
    });
  }, Il = (q) => M((pt) => u1(q, pt)), Fl = (q) => {
    for (const pt of q)
      pt.type === "select" && dt(
        (St) => pt.selected ? pt.id : St === pt.id ? null : St
      );
  };
  return /* @__PURE__ */ w.jsxs(
    "div",
    {
      ref: S,
      onBlurCapture: (q) => {
        q.currentTarget.contains(
          q.relatedTarget
        ) || J.flush();
      },
      className: `erd-editor ${bt ? "erd-expanded" : ""} ${f === "workspace" ? "erd-workspace" : ""} ${E ? "" : "erd-panel-hidden"}`,
      onKeyDown: (q) => {
        q.target.closest("input, textarea, select, [contenteditable=true]") || ((q.ctrlKey || q.metaKey) && q.key.toLowerCase() === "z" ? (q.preventDefault(), Ot(q.shiftKey ? "future" : "past")) : (q.ctrlKey || q.metaKey) && q.key.toLowerCase() === "y" ? (q.preventDefault(), Ot("future")) : q.key === "Escape" && (C(!1), et(null), dt(null)));
      },
      children: [
        $ && /* @__PURE__ */ w.jsx("div", { role: "alert", className: "erd-export-error", children: $ }),
        L && /* @__PURE__ */ w.jsxs("div", { role: "alert", className: "erd-export-error", children: [
          "A local draft differs from the saved diagram. Review it before replacing the saved version.",
          /* @__PURE__ */ w.jsx("button", { type: "button", onClick: () => J.restoreDraft(), children: "Restore local draft" }),
          /* @__PURE__ */ w.jsx("button", { type: "button", onClick: () => J.discardDraft(), children: "Discard local draft" })
        ] }),
        /* @__PURE__ */ w.jsxs("div", { className: "erd-toolbar", children: [
          /* @__PURE__ */ w.jsxs("div", { className: "erd-brand", children: [
            /* @__PURE__ */ w.jsx("span", { className: "erd-brand-icon", children: /* @__PURE__ */ w.jsx(Zp, {}) }),
            /* @__PURE__ */ w.jsxs("div", { children: [
              /* @__PURE__ */ w.jsx("strong", { children: "Schema studio" }),
              /* @__PURE__ */ w.jsx("small", { children: v.replaceAll("_", " ") })
            ] })
          ] }),
          /* @__PURE__ */ w.jsxs(
            "button",
            {
              className: "erd-primary",
              type: "button",
              disabled: N.entities.length >= 100,
              onClick: An,
              children: [
                "+ Add ",
                v === "conceptual_erd" ? "entity" : "table"
              ]
            }
          ),
          /* @__PURE__ */ w.jsxs("div", { className: "erd-toolbar-group", children: [
            /* @__PURE__ */ w.jsx(
              "button",
              {
                type: "button",
                "aria-pressed": !T,
                onClick: () => C(!1),
                children: "Select"
              }
            ),
            /* @__PURE__ */ w.jsx(
              "button",
              {
                type: "button",
                "aria-pressed": T,
                disabled: (N.strokes?.length ?? 0) >= 200,
                onClick: () => C(!0),
                children: "Draw"
              }
            )
          ] }),
          T && /* @__PURE__ */ w.jsxs("div", { className: "erd-draw-options", children: [
            /* @__PURE__ */ w.jsxs("label", { children: [
              "Ink",
              " ",
              /* @__PURE__ */ w.jsx(
                "input",
                {
                  type: "color",
                  "aria-label": "Drawing color",
                  value: U,
                  onChange: (q) => _(q.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ w.jsxs("label", { children: [
              "Line",
              " ",
              /* @__PURE__ */ w.jsxs(
                "select",
                {
                  "aria-label": "Drawing line width",
                  value: D,
                  onChange: (q) => G(Number(q.target.value)),
                  children: [
                    /* @__PURE__ */ w.jsx("option", { value: 2, children: "Thin" }),
                    /* @__PURE__ */ w.jsx("option", { value: 3, children: "Medium" }),
                    /* @__PURE__ */ w.jsx("option", { value: 6, children: "Thick" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ w.jsxs("div", { className: "erd-toolbar-group", children: [
            /* @__PURE__ */ w.jsx(
              "button",
              {
                type: "button",
                title: "Undo (Ctrl/Cmd+Z outside text fields)",
                disabled: !O,
                onClick: () => Ot("past"),
                children: "Undo"
              }
            ),
            /* @__PURE__ */ w.jsx(
              "button",
              {
                type: "button",
                title: "Redo (Ctrl/Cmd+Shift+Z)",
                disabled: !j,
                onClick: () => Ot("future"),
                children: "Redo"
              }
            )
          ] }),
          /* @__PURE__ */ w.jsx(
            "button",
            {
              type: "button",
              disabled: !N.entities.length,
              onClick: () => {
                Et(KT(J.diagram)), requestAnimationFrame(
                  () => {
                    F?.fitView({ padding: 0.2, duration: 250 });
                  }
                );
              },
              children: "Tidy layout"
            }
          ),
          /* @__PURE__ */ w.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                F?.fitView({ padding: 0.2, duration: 250 });
              },
              children: "Fit view"
            }
          ),
          f === "workspace" && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
            /* @__PURE__ */ w.jsx(
              "button",
              {
                type: "button",
                "aria-expanded": E,
                onClick: () => z(!E),
                children: E ? "Hide explorer" : "Show explorer"
              }
            ),
            /* @__PURE__ */ w.jsx(
              "button",
              {
                type: "button",
                disabled: B || !N.entities.length && !N.strokes?.length,
                onClick: async () => {
                  if (!(!F || !S.current)) {
                    H(!0), tt("");
                    try {
                      nt(
                        await QC(
                          S.current,
                          F,
                          d
                        )
                      );
                    } catch {
                      tt(
                        "Could not generate PNG. Try again or download JSON to preserve your diagram."
                      );
                    } finally {
                      H(!1);
                    }
                  }
                },
                children: B ? "Exporting..." : "Download PNG"
              }
            ),
            n && /* @__PURE__ */ w.jsx(
              "button",
              {
                type: "button",
                disabled: !!p || !!L,
                onClick: () => {
                  J.flush(), i?.(J.diagram);
                },
                children: "Save and return to attempt"
              }
            ),
            /* @__PURE__ */ w.jsx(
              "span",
              {
                role: "status",
                className: `erd-save-state ${p ? "error" : Y ? "saved" : "pending"}`,
                children: p ? "Save failed" : Y ? "Saved" : "Saving…"
              }
            )
          ] }),
          f === "embedded" && /* @__PURE__ */ w.jsx(
            "button",
            {
              type: "button",
              className: "erd-expand",
              "aria-pressed": bt,
              onClick: () => zt(!bt),
              children: bt ? "Compact view" : "Expand canvas"
            }
          )
        ] }),
        ot && /* @__PURE__ */ w.jsxs("details", { className: "erd-export-preview", children: [
          /* @__PURE__ */ w.jsx("summary", { children: "PNG ready - preview or save" }),
          /* @__PURE__ */ w.jsx("a", { href: ot.url, download: ot.filename, children: "Save PNG" }),
          /* @__PURE__ */ w.jsx("img", { src: ot.url, alt: "Exported diagram preview" })
        ] }),
        /* @__PURE__ */ w.jsxs("div", { className: "erd-body", children: [
          /* @__PURE__ */ w.jsxs("aside", { className: "erd-panel", children: [
            /* @__PURE__ */ w.jsxs("div", { className: "erd-section-heading", children: [
              "Model explorer",
              " ",
              /* @__PURE__ */ w.jsx("span", { className: "erd-count", children: N.entities.length })
            ] }),
            /* @__PURE__ */ w.jsxs(
              "div",
              {
                className: "erd-explorer-tabs",
                role: "group",
                "aria-label": "Browse model",
                children: [
                  /* @__PURE__ */ w.jsxs(
                    "button",
                    {
                      type: "button",
                      "aria-pressed": ft === "tables",
                      onClick: () => {
                        gt("tables"), dt(null), W("");
                      },
                      children: [
                        v === "conceptual_erd" ? "Entities" : "Tables",
                        " ",
                        /* @__PURE__ */ w.jsx("span", { children: N.entities.length })
                      ]
                    }
                  ),
                  /* @__PURE__ */ w.jsxs(
                    "button",
                    {
                      type: "button",
                      "aria-pressed": ft === "relationships",
                      onClick: () => {
                        gt("relationships"), et(null), W("");
                      },
                      children: [
                        "Relationships ",
                        /* @__PURE__ */ w.jsx("span", { children: N.relationships.length })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ w.jsx(
              "input",
              {
                className: "erd-search",
                "aria-label": ft === "tables" ? "Find a table or field" : "Find a relationship",
                placeholder: ft === "tables" ? "Find a name or field…" : "Find an endpoint or label…",
                value: rt,
                onChange: (q) => W(q.target.value)
              }
            ),
            /* @__PURE__ */ w.jsxs("div", { className: "erd-list", children: [
              ft === "tables" && Ee.map((q) => /* @__PURE__ */ w.jsxs(
                "button",
                {
                  type: "button",
                  className: k === q.id ? "active" : "",
                  "aria-pressed": k === q.id,
                  onClick: () => {
                    Ht(q.id);
                  },
                  children: [
                    /* @__PURE__ */ w.jsx("span", { className: `erd-role-dot ${q.role}` }),
                    " ",
                    /* @__PURE__ */ w.jsx("span", { children: q.name || "Untitled" }),
                    /* @__PURE__ */ w.jsx("small", { children: q.fields.length })
                  ]
                },
                q.id
              )),
              ft === "relationships" && pe.map((q) => /* @__PURE__ */ w.jsx(
                "button",
                {
                  type: "button",
                  className: lt === q.id ? "active erd-relation-item" : "erd-relation-item",
                  "aria-pressed": lt === q.id,
                  onClick: () => we(q.id, !0),
                  children: /* @__PURE__ */ w.jsxs("span", { children: [
                    Se.get(q.source),
                    " →",
                    " ",
                    Se.get(q.target),
                    /* @__PURE__ */ w.jsx("small", { children: q.label || "Unlabeled relationship" })
                  ] })
                },
                q.id
              ))
            ] }),
            (ft === "tables" ? !Ee.length : !pe.length) && /* @__PURE__ */ w.jsx("p", { className: "erd-muted", children: ye ? "No matches. Try another name." : ft === "tables" ? "Add an entity to start your model." : "Select a table and choose a connection, or drag between its handles." }),
            Nt && /* @__PURE__ */ w.jsxs("div", { className: "erd-details", children: [
              /* @__PURE__ */ w.jsxs("div", { className: "erd-section-heading", children: [
                /* @__PURE__ */ w.jsx("h4", { children: "Properties" }),
                /* @__PURE__ */ w.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: N.entities.length >= 100,
                    onClick: () => {
                      const q = {
                        ...Nt,
                        id: Uu(),
                        name: _d(
                          J.diagram.entities.map((pt) => pt.name),
                          `${Nt.name.slice(0, 185)}_copy`
                        ),
                        fields: Nt.fields.map((pt) => ({ ...pt, id: Uu() })),
                        position: {
                          x: Nt.position.x + 320,
                          y: Nt.position.y + 40
                        }
                      };
                      Et({
                        ...J.diagram,
                        entities: [...J.diagram.entities, q]
                      }), et(q.id), ct.current = !0;
                    },
                    children: "Duplicate"
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsxs("label", { children: [
                "Name",
                /* @__PURE__ */ w.jsx(
                  "input",
                  {
                    ref: st,
                    maxLength: 200,
                    "aria-label": "Entity name",
                    value: Nt.name,
                    onChange: (q) => Kt(Nt.id, { name: q.target.value })
                  }
                )
              ] }),
              v === "star_schema" && /* @__PURE__ */ w.jsxs("label", { children: [
                "Table role",
                /* @__PURE__ */ w.jsx(
                  "select",
                  {
                    "aria-label": "Entity role",
                    value: Nt.role,
                    onChange: (q) => Kt(Nt.id, {
                      role: q.target.value
                    }),
                    children: (v === "star_schema" ? ["fact", "dimension"] : v === "logical_erd" ? ["table"] : ["entity"]).map((q) => /* @__PURE__ */ w.jsx("option", { children: q }, q))
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsxs("label", { children: [
                v === "star_schema" ? "Grain / annotation" : "Annotation",
                /* @__PURE__ */ w.jsx(
                  "textarea",
                  {
                    maxLength: 1e3,
                    "aria-label": "Entity annotation",
                    value: Nt.annotation,
                    onChange: (q) => Kt(Nt.id, { annotation: q.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsxs("label", { children: [
                "Connect to another",
                " ",
                v === "conceptual_erd" ? "entity" : "table",
                /* @__PURE__ */ w.jsxs(
                  "select",
                  {
                    "aria-label": "Connect to another table",
                    value: "",
                    disabled: N.relationships.length >= 300,
                    onChange: (q) => {
                      q.target.value && Re({
                        source: Nt.id,
                        target: q.target.value,
                        sourceHandle: "right",
                        targetHandle: "left"
                      });
                    },
                    children: [
                      /* @__PURE__ */ w.jsx("option", { value: "", children: "Choose an endpoint…" }),
                      N.entities.filter(
                        (q) => q.id !== Nt.id && !N.relationships.some(
                          (pt) => pt.source === Nt.id && pt.target === q.id
                        )
                      ).map((q) => /* @__PURE__ */ w.jsx("option", { value: q.id, children: q.name }, q.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsxs("div", { className: "erd-section-heading", children: [
                "Fields",
                " ",
                /* @__PURE__ */ w.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: Nt.fields.length >= 100,
                    onClick: ji,
                    children: "+ Field"
                  }
                )
              ] }),
              !Nt.fields.length && /* @__PURE__ */ w.jsxs("p", { className: "erd-muted", children: [
                "Add fields to describe this",
                " ",
                v === "conceptual_erd" ? "entity" : "table",
                ". Mark identifiers as primary keys and references as foreign keys."
              ] }),
              Nt.fields.map((q, pt) => /* @__PURE__ */ w.jsxs("div", { className: "erd-field-edit", children: [
                /* @__PURE__ */ w.jsx(
                  "input",
                  {
                    maxLength: 200,
                    "aria-label": "Field name",
                    value: q.name,
                    onChange: (St) => $n(q.id, { name: St.target.value })
                  }
                ),
                /* @__PURE__ */ w.jsx(
                  "input",
                  {
                    maxLength: 100,
                    "aria-label": "Field data type",
                    placeholder: "Type",
                    list: `erd-types-${c}`,
                    value: q.data_type,
                    onChange: (St) => $n(q.id, { data_type: St.target.value })
                  }
                ),
                /* @__PURE__ */ w.jsxs("label", { children: [
                  /* @__PURE__ */ w.jsx(
                    "input",
                    {
                      type: "checkbox",
                      "aria-label": `Primary key for ${q.name}`,
                      checked: q.pk,
                      onChange: (St) => $n(q.id, { pk: St.target.checked })
                    }
                  ),
                  " ",
                  "PK"
                ] }),
                /* @__PURE__ */ w.jsxs("label", { children: [
                  /* @__PURE__ */ w.jsx(
                    "input",
                    {
                      type: "checkbox",
                      "aria-label": `Foreign key for ${q.name}`,
                      checked: q.fk,
                      onChange: (St) => $n(q.id, { fk: St.target.checked })
                    }
                  ),
                  " ",
                  "FK"
                ] }),
                /* @__PURE__ */ w.jsxs("div", { className: "erd-field-actions", children: [
                  /* @__PURE__ */ w.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: pt === 0,
                      "aria-label": `Move ${q.name} up`,
                      onClick: () => Et(
                        Rp(J.diagram, Nt.id, q.id, -1)
                      ),
                      children: "Move up"
                    }
                  ),
                  /* @__PURE__ */ w.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: pt === Nt.fields.length - 1,
                      "aria-label": `Move ${q.name} down`,
                      onClick: () => Et(Rp(J.diagram, Nt.id, q.id, 1)),
                      children: "Move down"
                    }
                  ),
                  /* @__PURE__ */ w.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": `Remove field ${q.name}`,
                      onClick: () => Kt(Nt.id, {
                        fields: Nt.fields.filter((St) => St.id !== q.id)
                      }),
                      children: "Remove field"
                    }
                  )
                ] })
              ] }, q.id)),
              /* @__PURE__ */ w.jsxs(
                "button",
                {
                  type: "button",
                  className: "erd-danger",
                  onClick: Jl,
                  children: [
                    "Delete ",
                    v === "conceptual_erd" ? "entity" : "table"
                  ]
                }
              )
            ] }),
            !Nt && !Pt && /* @__PURE__ */ w.jsxs("div", { className: "erd-inspector-hint", children: [
              /* @__PURE__ */ w.jsx("strong", { children: "Your model, one connection at a time." }),
              /* @__PURE__ */ w.jsxs("p", { children: [
                "Select a ",
                v === "conceptual_erd" ? "entity" : "table",
                " to edit its fields. Choose a connection in its properties or drag a green connector to another",
                " ",
                v === "conceptual_erd" ? "entity" : "table",
                "."
              ] }),
              /* @__PURE__ */ w.jsxs("small", { children: [
                "PK · Primary key",
                /* @__PURE__ */ w.jsx("br", {}),
                "FK · Foreign key",
                /* @__PURE__ */ w.jsx("br", {}),
                "0..* · Zero or many"
              ] })
            ] }),
            Pt && /* @__PURE__ */ w.jsxs("div", { className: "erd-details", children: [
              /* @__PURE__ */ w.jsx("h4", { children: "Edit relationship" }),
              /* @__PURE__ */ w.jsxs("label", { children: [
                "Label",
                /* @__PURE__ */ w.jsx(
                  "input",
                  {
                    maxLength: 200,
                    "aria-label": "Relationship label",
                    value: Pt.label,
                    onChange: (q) => oe(Pt.id, { label: q.target.value })
                  }
                )
              ] }),
              ["source", "target"].map((q) => /* @__PURE__ */ w.jsxs("div", { children: [
                /* @__PURE__ */ w.jsx("strong", { children: Se.get(Pt[q]) }),
                /* @__PURE__ */ w.jsxs("label", { children: [
                  "Cardinality",
                  /* @__PURE__ */ w.jsxs(
                    "select",
                    {
                      "aria-label": `${q} cardinality`,
                      value: Pt[`${q}_cardinality`],
                      onChange: (pt) => oe(Pt.id, {
                        [`${q}_cardinality`]: pt.target.value
                      }),
                      children: [
                        /* @__PURE__ */ w.jsx("option", { value: "one", children: "One" }),
                        /* @__PURE__ */ w.jsx("option", { value: "many", children: "Many" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ w.jsxs("label", { children: [
                  /* @__PURE__ */ w.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: Pt[`${q}_optional`],
                      onChange: (pt) => oe(Pt.id, {
                        [`${q}_optional`]: pt.target.checked
                      })
                    }
                  ),
                  " ",
                  "Optional"
                ] })
              ] }, q)),
              /* @__PURE__ */ w.jsx(
                "button",
                {
                  type: "button",
                  className: "erd-danger",
                  onClick: () => {
                    Et({
                      ...J.diagram,
                      relationships: J.diagram.relationships.filter(
                        (q) => q.id !== Pt.id
                      )
                    }), dt(null);
                  },
                  children: "Delete relationship"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ w.jsxs("div", { className: "erd-canvas", children: [
            !N.entities.length && !N.strokes?.length && !T && /* @__PURE__ */ w.jsxs("div", { className: "erd-empty", children: [
              /* @__PURE__ */ w.jsx("span", { children: /* @__PURE__ */ w.jsx(Zp, {}) }),
              /* @__PURE__ */ w.jsx("h3", { children: "Give your data a structure" }),
              /* @__PURE__ */ w.jsxs("p", { children: [
                "Add your first ",
                v === "conceptual_erd" ? "entity" : "table",
                ", define its fields,",
                /* @__PURE__ */ w.jsx("br", {}),
                "then connect the relationships."
              ] }),
              /* @__PURE__ */ w.jsxs("button", { type: "button", onClick: An, children: [
                "+ Create your first",
                " ",
                v === "conceptual_erd" ? "entity" : "table"
              ] })
            ] }),
            /* @__PURE__ */ w.jsxs(
              R1,
              {
                nodesDraggable: !T,
                nodesConnectable: !T,
                elementsSelectable: !T,
                panOnDrag: !T,
                zoomOnScroll: !T,
                zoomOnPinch: !T,
                zoomOnDoubleClick: !T,
                deleteKeyCode: T ? null : ["Backspace", "Delete"],
                onInit: ht,
                onPaneClick: () => {
                  et(null), dt(null);
                },
                minZoom: 0.1,
                maxZoom: 1.8,
                snapToGrid: !0,
                snapGrid: [20, 20],
                nodes: xt,
                edges: an,
                nodeTypes: V1,
                edgeTypes: Y1,
                onNodesChange: Il,
                onEdgesChange: Fl,
                onDelete: ({ nodes: q, edges: pt }) => Et(
                  Hp(
                    J.diagram,
                    q.map((St) => St.id),
                    pt.map((St) => St.id)
                  )
                ),
                onConnect: Re,
                onNodeClick: (q, pt) => {
                  if (pt.type === "stroke") {
                    et(null), dt(null);
                    return;
                  }
                  et(pt.id), dt(null), z(!0), ft !== "tables" && W(""), gt("tables");
                },
                onEdgeClick: (q, pt) => {
                  we(pt.id);
                },
                onNodeDragStop: (q, pt, St) => {
                  const ee = new Map(
                    St.map((Ae) => [Ae.id, Ae.position])
                  );
                  ee.set(pt.id, pt.position), Et({
                    ...J.diagram,
                    ...J.diagram.strokes ? {
                      strokes: J.diagram.strokes.map(
                        (Ae) => ee.has(Ae.id) ? { ...Ae, position: ee.get(Ae.id) } : Ae
                      )
                    } : {},
                    entities: J.diagram.entities.map(
                      (Ae) => ee.has(Ae.id) ? { ...Ae, position: ee.get(Ae.id) } : Ae
                    )
                  });
                },
                fitView: !0,
                fitViewOptions: { padding: 0.25 },
                children: [
                  T && /* @__PURE__ */ w.jsx(
                    JT,
                    {
                      color: U,
                      width: D,
                      onStroke: (q) => {
                        const pt = J.diagram.strokes ?? [];
                        pt.length >= 200 || (Et({ ...J.diagram, strokes: [...pt, q] }), pt.length === 199 && C(!1));
                      }
                    }
                  ),
                  /* @__PURE__ */ w.jsx(j1, { gap: 20, size: 1, color: "#c9d6dc" }),
                  /* @__PURE__ */ w.jsx(B1, {}),
                  /* @__PURE__ */ w.jsx(
                    ZT,
                    {
                      pannable: !0,
                      zoomable: !0,
                      nodeColor: (q) => q.data.entity?.role === "fact" ? "#b59ee8" : "#85bcb5"
                    }
                  ),
                  /* @__PURE__ */ w.jsx("svg", { children: /* @__PURE__ */ w.jsxs("defs", { children: [
                    /* @__PURE__ */ w.jsx(
                      "marker",
                      {
                        id: "erd-crowfoot",
                        markerWidth: "12",
                        markerHeight: "12",
                        refX: "11",
                        refY: "6",
                        orient: "auto",
                        children: /* @__PURE__ */ w.jsx(
                          "path",
                          {
                            d: "M1 1 L11 6 L1 11 M1 6 L11 6",
                            stroke: "#607889",
                            fill: "none"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ w.jsx(
                      "marker",
                      {
                        id: "erd-crowfoot-start",
                        markerWidth: "12",
                        markerHeight: "12",
                        refX: "1",
                        refY: "6",
                        orient: "auto-start-reverse",
                        children: /* @__PURE__ */ w.jsx(
                          "path",
                          {
                            d: "M11 1 L1 6 L11 11 M11 6 L1 6",
                            stroke: "#607889",
                            fill: "none"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ w.jsx(
                      "marker",
                      {
                        id: "erd-one",
                        markerWidth: "8",
                        markerHeight: "12",
                        refX: "7",
                        refY: "6",
                        orient: "auto",
                        children: /* @__PURE__ */ w.jsx("path", { d: "M6 1 L6 11", stroke: "#607889", fill: "none" })
                      }
                    ),
                    /* @__PURE__ */ w.jsx(
                      "marker",
                      {
                        id: "erd-one-start",
                        markerWidth: "8",
                        markerHeight: "12",
                        refX: "1",
                        refY: "6",
                        orient: "auto-start-reverse",
                        children: /* @__PURE__ */ w.jsx("path", { d: "M2 1 L2 11", stroke: "#607889", fill: "none" })
                      }
                    )
                  ] }) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ w.jsxs("div", { className: "erd-status", children: [
          /* @__PURE__ */ w.jsxs("span", { children: [
            /* @__PURE__ */ w.jsx("i", {}),
            " ",
            N.entities.length,
            " tables / entities ·",
            " ",
            N.relationships.length,
            " relationships"
          ] }),
          /* @__PURE__ */ w.jsx("span", { children: T ? "Drag to draw · Escape to select" : "Drag to move · Select a drawing and press Delete · Scroll to zoom" })
        ] }),
        /* @__PURE__ */ w.jsx("datalist", { id: `erd-types-${c}`, children: [
          "INTEGER",
          "BIGINT",
          "VARCHAR",
          "BOOLEAN",
          "DATE",
          "TIMESTAMP",
          "DECIMAL(12,2)",
          "UUID"
        ].map((q) => /* @__PURE__ */ w.jsx("option", { value: q }, q)) })
      ]
    }
  );
}
function Gp({ diagram: n }) {
  const i = Q.useRef(null), [o, r] = Q.useState(null);
  Q.useEffect(() => {
    if (!i.current || !o) return;
    const d = new ResizeObserver(() => {
      o.fitView({ padding: 0.2, maxZoom: 1 });
    });
    return d.observe(i.current), () => d.disconnect();
  }, [o]);
  const c = [
    ...n.entities.map((d) => ({
      id: d.id,
      type: "entity",
      position: d.position,
      data: { entity: d, readOnly: !0 }
    })),
    ...(n.strokes ?? []).map((d) => ({
      id: d.id,
      type: "stroke",
      position: d.position,
      data: { stroke: d }
    }))
  ], f = n.relationships.map((d) => ({
    id: d.id,
    source: d.source,
    target: d.target,
    sourceHandle: d.source_handle ?? "right",
    targetHandle: d.target_handle ?? "left",
    type: "relation",
    data: { relation: d }
  }));
  return /* @__PURE__ */ w.jsx("div", { ref: i, style: { height: "100%" }, children: /* @__PURE__ */ w.jsxs(
    R1,
    {
      onInit: r,
      nodes: c,
      edges: f,
      nodeTypes: V1,
      edgeTypes: Y1,
      nodesDraggable: !1,
      nodesConnectable: !1,
      elementsSelectable: !1,
      deleteKeyCode: null,
      fitView: !0,
      fitViewOptions: { padding: 0.2, maxZoom: 1 },
      minZoom: 0.01,
      maxZoom: 2,
      children: [
        /* @__PURE__ */ w.jsx(j1, {}),
        /* @__PURE__ */ w.jsx(B1, { showInteractive: !1 }),
        /* @__PURE__ */ w.jsx("svg", { children: /* @__PURE__ */ w.jsxs("defs", { children: [
          [!1, !0].map((d) => /* @__PURE__ */ w.jsx(
            "marker",
            {
              id: `erd-crowfoot${d ? "-start" : ""}`,
              markerWidth: "12",
              markerHeight: "12",
              refX: d ? 1 : 11,
              refY: "6",
              orient: d ? "auto-start-reverse" : "auto",
              children: /* @__PURE__ */ w.jsx(
                "path",
                {
                  d: "M1 1 L11 6 L1 11 M1 6 L11 6",
                  stroke: "#607889",
                  fill: "none"
                }
              )
            },
            String(d)
          )),
          [!1, !0].map((d) => /* @__PURE__ */ w.jsx(
            "marker",
            {
              id: `erd-one${d ? "-start" : ""}`,
              markerWidth: "8",
              markerHeight: "12",
              refX: d ? 1 : 7,
              refY: "6",
              orient: d ? "auto-start-reverse" : "auto",
              children: /* @__PURE__ */ w.jsx("path", { d: "M6 1 L6 11", stroke: "#607889", fill: "none" })
            },
            String(d)
          ))
        ] }) })
      ]
    }
  ) });
}
function PC({ diagram: n }) {
  const i = Q.useRef(null);
  return /* @__PURE__ */ w.jsxs("div", { className: "submission-preview", "aria-label": "Read-only saved diagram", children: [
    /* @__PURE__ */ w.jsx(
      "button",
      {
        className: "preview-action",
        type: "button",
        onClick: () => i.current?.showModal(),
        children: "Enlarge diagram"
      }
    ),
    /* @__PURE__ */ w.jsx("div", { style: { height: 330 }, children: /* @__PURE__ */ w.jsx(Gp, { diagram: n }) }),
    /* @__PURE__ */ w.jsxs(
      "dialog",
      {
        ref: i,
        style: { width: "92vw", maxWidth: "none", height: "85vh" },
        children: [
          /* @__PURE__ */ w.jsx(
            "button",
            {
              className: "preview-action",
              type: "button",
              onClick: () => i.current?.close(),
              children: "Close enlarged diagram"
            }
          ),
          /* @__PURE__ */ w.jsx("div", { style: { height: "calc(100% - 48px)" }, children: /* @__PURE__ */ w.jsx(Gp, { diagram: n }) })
        ]
      }
    )
  ] });
}
class tM extends Q.Component {
  state = { failed: !1 };
  static getDerivedStateFromError() {
    return { failed: !0 };
  }
  render() {
    return this.state.failed ? /* @__PURE__ */ w.jsx("p", { role: "status", children: "Visual preview unavailable. Use the saved summary or open the deliverable below." }) : this.props.children;
  }
}
function eM(n) {
  return Array.isArray(n) ? n[0] : n;
}
const Kr = /* @__PURE__ */ new WeakMap(), nM = ({
  data: n,
  parentElement: i,
  setStateValue: o,
  setTriggerValue: r
}) => {
  const c = eM(n), f = i.querySelector(".erd-root");
  if (!f) throw new Error("ERD mount element missing");
  let d = Kr.get(i);
  return d || (d = US.createRoot(f), Kr.set(i, d)), d.render(
    c.readOnly ? /* @__PURE__ */ w.jsx(tM, { children: /* @__PURE__ */ w.jsx(PC, { diagram: c.diagram }) }, c.documentId) : /* @__PURE__ */ w.jsx(
      WC,
      {
        ...c,
        onSave: (h) => o("diagram", h),
        onReturn: (h) => o("return_request", { diagram: h, id: crypto.randomUUID() }),
        onBusy: (h) => o("busy", h),
        onSqlImportResult: (h) => r("sql_import_result", h)
      },
      c.documentId
    )
  ), () => {
    Kr.get(i)?.unmount(), Kr.delete(i);
  };
};
export {
  nM as default
};
