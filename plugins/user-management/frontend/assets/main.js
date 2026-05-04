var Yr = { exports: {} }, Qe = {}, gr = { exports: {} }, m = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pt;
function Wt() {
  if (pt) return m;
  pt = 1;
  var ne = Symbol.for("react.element"), v = Symbol.for("react.portal"), _e = Symbol.for("react.fragment"), H = Symbol.for("react.strict_mode"), ye = Symbol.for("react.profiler"), ae = Symbol.for("react.provider"), se = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), F = Symbol.for("react.suspense"), q = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), U = Symbol.iterator;
  function W(n) {
    return n === null || typeof n != "object" ? null : (n = U && n[U] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var Q = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, pe = Object.assign, Ce = {};
  function ce(n, u, g) {
    this.props = n, this.context = u, this.refs = Ce, this.updater = g || Q;
  }
  ce.prototype.isReactComponent = {}, ce.prototype.setState = function(n, u) {
    if (typeof n != "object" && typeof n != "function" && n != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, n, u, "setState");
  }, ce.prototype.forceUpdate = function(n) {
    this.updater.enqueueForceUpdate(this, n, "forceUpdate");
  };
  function le() {
  }
  le.prototype = ce.prototype;
  function O(n, u, g) {
    this.props = n, this.context = u, this.refs = Ce, this.updater = g || Q;
  }
  var he = O.prototype = new le();
  he.constructor = O, pe(he, ce.prototype), he.isPureReactComponent = !0;
  var oe = Array.isArray, N = Object.prototype.hasOwnProperty, $ = { current: null }, Z = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ve(n, u, g) {
    var b, R = {}, x = null, P = null;
    if (u != null) for (b in u.ref !== void 0 && (P = u.ref), u.key !== void 0 && (x = "" + u.key), u) N.call(u, b) && !Z.hasOwnProperty(b) && (R[b] = u[b]);
    var T = arguments.length - 2;
    if (T === 1) R.children = g;
    else if (1 < T) {
      for (var w = Array(T), B = 0; B < T; B++) w[B] = arguments[B + 2];
      R.children = w;
    }
    if (n && n.defaultProps) for (b in T = n.defaultProps, T) R[b] === void 0 && (R[b] = T[b]);
    return { $$typeof: ne, type: n, key: x, ref: P, props: R, _owner: $.current };
  }
  function ie(n, u) {
    return { $$typeof: ne, type: n.type, key: u, ref: n.ref, props: n.props, _owner: n._owner };
  }
  function be(n) {
    return typeof n == "object" && n !== null && n.$$typeof === ne;
  }
  function ke(n) {
    var u = { "=": "=0", ":": "=2" };
    return "$" + n.replace(/[=:]/g, function(g) {
      return u[g];
    });
  }
  var Ee = /\/+/g;
  function ee(n, u) {
    return typeof n == "object" && n !== null && n.key != null ? ke("" + n.key) : u.toString(36);
  }
  function re(n, u, g, b, R) {
    var x = typeof n;
    (x === "undefined" || x === "boolean") && (n = null);
    var P = !1;
    if (n === null) P = !0;
    else switch (x) {
      case "string":
      case "number":
        P = !0;
        break;
      case "object":
        switch (n.$$typeof) {
          case ne:
          case v:
            P = !0;
        }
    }
    if (P) return P = n, R = R(P), n = b === "" ? "." + ee(P, 0) : b, oe(R) ? (g = "", n != null && (g = n.replace(Ee, "$&/") + "/"), re(R, u, g, "", function(B) {
      return B;
    })) : R != null && (be(R) && (R = ie(R, g + (!R.key || P && P.key === R.key ? "" : ("" + R.key).replace(Ee, "$&/") + "/") + n)), u.push(R)), 1;
    if (P = 0, b = b === "" ? "." : b + ":", oe(n)) for (var T = 0; T < n.length; T++) {
      x = n[T];
      var w = b + ee(x, T);
      P += re(x, u, g, w, R);
    }
    else if (w = W(n), typeof w == "function") for (n = w.call(n), T = 0; !(x = n.next()).done; ) x = x.value, w = b + ee(x, T++), P += re(x, u, g, w, R);
    else if (x === "object") throw u = String(n), Error("Objects are not valid as a React child (found: " + (u === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : u) + "). If you meant to render a collection of children, use an array instead.");
    return P;
  }
  function K(n, u, g) {
    if (n == null) return n;
    var b = [], R = 0;
    return re(n, b, "", "", function(x) {
      return u.call(g, x, R++);
    }), b;
  }
  function k(n) {
    if (n._status === -1) {
      var u = n._result;
      u = u(), u.then(function(g) {
        (n._status === 0 || n._status === -1) && (n._status = 1, n._result = g);
      }, function(g) {
        (n._status === 0 || n._status === -1) && (n._status = 2, n._result = g);
      }), n._status === -1 && (n._status = 0, n._result = u);
    }
    if (n._status === 1) return n._result.default;
    throw n._result;
  }
  var l = { current: null }, fe = { transition: null }, me = { ReactCurrentDispatcher: l, ReactCurrentBatchConfig: fe, ReactCurrentOwner: $ };
  function de() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return m.Children = { map: K, forEach: function(n, u, g) {
    K(n, function() {
      u.apply(this, arguments);
    }, g);
  }, count: function(n) {
    var u = 0;
    return K(n, function() {
      u++;
    }), u;
  }, toArray: function(n) {
    return K(n, function(u) {
      return u;
    }) || [];
  }, only: function(n) {
    if (!be(n)) throw Error("React.Children.only expected to receive a single React element child.");
    return n;
  } }, m.Component = ce, m.Fragment = _e, m.Profiler = ye, m.PureComponent = O, m.StrictMode = H, m.Suspense = F, m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = me, m.act = de, m.cloneElement = function(n, u, g) {
    if (n == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + n + ".");
    var b = pe({}, n.props), R = n.key, x = n.ref, P = n._owner;
    if (u != null) {
      if (u.ref !== void 0 && (x = u.ref, P = $.current), u.key !== void 0 && (R = "" + u.key), n.type && n.type.defaultProps) var T = n.type.defaultProps;
      for (w in u) N.call(u, w) && !Z.hasOwnProperty(w) && (b[w] = u[w] === void 0 && T !== void 0 ? T[w] : u[w]);
    }
    var w = arguments.length - 2;
    if (w === 1) b.children = g;
    else if (1 < w) {
      T = Array(w);
      for (var B = 0; B < w; B++) T[B] = arguments[B + 2];
      b.children = T;
    }
    return { $$typeof: ne, type: n.type, key: R, ref: x, props: b, _owner: P };
  }, m.createContext = function(n) {
    return n = { $$typeof: se, _currentValue: n, _currentValue2: n, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, n.Provider = { $$typeof: ae, _context: n }, n.Consumer = n;
  }, m.createElement = ve, m.createFactory = function(n) {
    var u = ve.bind(null, n);
    return u.type = n, u;
  }, m.createRef = function() {
    return { current: null };
  }, m.forwardRef = function(n) {
    return { $$typeof: G, render: n };
  }, m.isValidElement = be, m.lazy = function(n) {
    return { $$typeof: A, _payload: { _status: -1, _result: n }, _init: k };
  }, m.memo = function(n, u) {
    return { $$typeof: q, type: n, compare: u === void 0 ? null : u };
  }, m.startTransition = function(n) {
    var u = fe.transition;
    fe.transition = {};
    try {
      n();
    } finally {
      fe.transition = u;
    }
  }, m.unstable_act = de, m.useCallback = function(n, u) {
    return l.current.useCallback(n, u);
  }, m.useContext = function(n) {
    return l.current.useContext(n);
  }, m.useDebugValue = function() {
  }, m.useDeferredValue = function(n) {
    return l.current.useDeferredValue(n);
  }, m.useEffect = function(n, u) {
    return l.current.useEffect(n, u);
  }, m.useId = function() {
    return l.current.useId();
  }, m.useImperativeHandle = function(n, u, g) {
    return l.current.useImperativeHandle(n, u, g);
  }, m.useInsertionEffect = function(n, u) {
    return l.current.useInsertionEffect(n, u);
  }, m.useLayoutEffect = function(n, u) {
    return l.current.useLayoutEffect(n, u);
  }, m.useMemo = function(n, u) {
    return l.current.useMemo(n, u);
  }, m.useReducer = function(n, u, g) {
    return l.current.useReducer(n, u, g);
  }, m.useRef = function(n) {
    return l.current.useRef(n);
  }, m.useState = function(n) {
    return l.current.useState(n);
  }, m.useSyncExternalStore = function(n, u, g) {
    return l.current.useSyncExternalStore(n, u, g);
  }, m.useTransition = function() {
    return l.current.useTransition();
  }, m.version = "18.3.1", m;
}
var er = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
er.exports;
var vt;
function Yt() {
  return vt || (vt = 1, function(ne, v) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var _e = "18.3.1", H = Symbol.for("react.element"), ye = Symbol.for("react.portal"), ae = Symbol.for("react.fragment"), se = Symbol.for("react.strict_mode"), G = Symbol.for("react.profiler"), F = Symbol.for("react.provider"), q = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), W = Symbol.for("react.suspense_list"), Q = Symbol.for("react.memo"), pe = Symbol.for("react.lazy"), Ce = Symbol.for("react.offscreen"), ce = Symbol.iterator, le = "@@iterator";
      function O(e) {
        if (e === null || typeof e != "object")
          return null;
        var r = ce && e[ce] || e[le];
        return typeof r == "function" ? r : null;
      }
      var he = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, oe = {
        transition: null
      }, N = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, $ = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Z = {}, ve = null;
      function ie(e) {
        ve = e;
      }
      Z.setExtraStackFrame = function(e) {
        ve = e;
      }, Z.getCurrentStack = null, Z.getStackAddendum = function() {
        var e = "";
        ve && (e += ve);
        var r = Z.getCurrentStack;
        return r && (e += r() || ""), e;
      };
      var be = !1, ke = !1, Ee = !1, ee = !1, re = !1, K = {
        ReactCurrentDispatcher: he,
        ReactCurrentBatchConfig: oe,
        ReactCurrentOwner: $
      };
      K.ReactDebugCurrentFrame = Z, K.ReactCurrentActQueue = N;
      function k(e) {
        {
          for (var r = arguments.length, a = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++)
            a[o - 1] = arguments[o];
          fe("warn", e, a);
        }
      }
      function l(e) {
        {
          for (var r = arguments.length, a = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++)
            a[o - 1] = arguments[o];
          fe("error", e, a);
        }
      }
      function fe(e, r, a) {
        {
          var o = K.ReactDebugCurrentFrame, s = o.getStackAddendum();
          s !== "" && (r += "%s", a = a.concat([s]));
          var p = a.map(function(d) {
            return String(d);
          });
          p.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, p);
        }
      }
      var me = {};
      function de(e, r) {
        {
          var a = e.constructor, o = a && (a.displayName || a.name) || "ReactClass", s = o + "." + r;
          if (me[s])
            return;
          l("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", r, o), me[s] = !0;
        }
      }
      var n = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(e) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(e, r, a) {
          de(e, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(e, r, a, o) {
          de(e, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(e, r, a, o) {
          de(e, "setState");
        }
      }, u = Object.assign, g = {};
      Object.freeze(g);
      function b(e, r, a) {
        this.props = e, this.context = r, this.refs = g, this.updater = a || n;
      }
      b.prototype.isReactComponent = {}, b.prototype.setState = function(e, r) {
        if (typeof e != "object" && typeof e != "function" && e != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, e, r, "setState");
      }, b.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
      };
      {
        var R = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, x = function(e, r) {
          Object.defineProperty(b.prototype, e, {
            get: function() {
              k("%s(...) is deprecated in plain JavaScript React classes. %s", r[0], r[1]);
            }
          });
        };
        for (var P in R)
          R.hasOwnProperty(P) && x(P, R[P]);
      }
      function T() {
      }
      T.prototype = b.prototype;
      function w(e, r, a) {
        this.props = e, this.context = r, this.refs = g, this.updater = a || n;
      }
      var B = w.prototype = new T();
      B.constructor = w, u(B, b.prototype), B.isPureReactComponent = !0;
      function _r() {
        var e = {
          current: null
        };
        return Object.seal(e), e;
      }
      var rr = Array.isArray;
      function Fe(e) {
        return rr(e);
      }
      function br(e) {
        {
          var r = typeof Symbol == "function" && Symbol.toStringTag, a = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
          return a;
        }
      }
      function Le(e) {
        try {
          return we(e), !1;
        } catch {
          return !0;
        }
      }
      function we(e) {
        return "" + e;
      }
      function Pe(e) {
        if (Le(e))
          return l("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", br(e)), we(e);
      }
      function tr(e, r, a) {
        var o = e.displayName;
        if (o)
          return o;
        var s = r.displayName || r.name || "";
        return s !== "" ? a + "(" + s + ")" : a;
      }
      function je(e) {
        return e.displayName || "Context";
      }
      function ge(e) {
        if (e == null)
          return null;
        if (typeof e.tag == "number" && l("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
          return e.displayName || e.name || null;
        if (typeof e == "string")
          return e;
        switch (e) {
          case ae:
            return "Fragment";
          case ye:
            return "Portal";
          case G:
            return "Profiler";
          case se:
            return "StrictMode";
          case U:
            return "Suspense";
          case W:
            return "SuspenseList";
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case q:
              var r = e;
              return je(r) + ".Consumer";
            case F:
              var a = e;
              return je(a._context) + ".Provider";
            case A:
              return tr(e, e.render, "ForwardRef");
            case Q:
              var o = e.displayName || null;
              return o !== null ? o : ge(e.type) || "Memo";
            case pe: {
              var s = e, p = s._payload, d = s._init;
              try {
                return ge(d(p));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var xe = Object.prototype.hasOwnProperty, Me = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, nr, ar, Ue;
      Ue = {};
      function Be(e) {
        if (xe.call(e, "ref")) {
          var r = Object.getOwnPropertyDescriptor(e, "ref").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.ref !== void 0;
      }
      function ze(e) {
        if (xe.call(e, "key")) {
          var r = Object.getOwnPropertyDescriptor(e, "key").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.key !== void 0;
      }
      function Er(e, r) {
        var a = function() {
          nr || (nr = !0, l("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        a.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: a,
          configurable: !0
        });
      }
      function or(e, r) {
        var a = function() {
          ar || (ar = !0, l("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        a.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: a,
          configurable: !0
        });
      }
      function ir(e) {
        if (typeof e.ref == "string" && $.current && e.__self && $.current.stateNode !== e.__self) {
          var r = ge($.current.type);
          Ue[r] || (l('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', r, e.ref), Ue[r] = !0);
        }
      }
      var qe = function(e, r, a, o, s, p, d) {
        var y = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: H,
          // Built-in properties that belong on the element
          type: e,
          key: r,
          ref: a,
          props: d,
          // Record the component responsible for creating this element.
          _owner: p
        };
        return y._store = {}, Object.defineProperty(y._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(y, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: o
        }), Object.defineProperty(y, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: s
        }), Object.freeze && (Object.freeze(y.props), Object.freeze(y)), y;
      };
      function Rr(e, r, a) {
        var o, s = {}, p = null, d = null, y = null, E = null;
        if (r != null) {
          Be(r) && (d = r.ref, ir(r)), ze(r) && (Pe(r.key), p = "" + r.key), y = r.__self === void 0 ? null : r.__self, E = r.__source === void 0 ? null : r.__source;
          for (o in r)
            xe.call(r, o) && !Me.hasOwnProperty(o) && (s[o] = r[o]);
        }
        var j = arguments.length - 2;
        if (j === 1)
          s.children = a;
        else if (j > 1) {
          for (var D = Array(j), I = 0; I < j; I++)
            D[I] = arguments[I + 2];
          Object.freeze && Object.freeze(D), s.children = D;
        }
        if (e && e.defaultProps) {
          var M = e.defaultProps;
          for (o in M)
            s[o] === void 0 && (s[o] = M[o]);
        }
        if (p || d) {
          var z = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          p && Er(s, z), d && or(s, z);
        }
        return qe(e, p, d, y, E, $.current, s);
      }
      function Cr(e, r) {
        var a = qe(e.type, r, e.ref, e._self, e._source, e._owner, e.props);
        return a;
      }
      function wr(e, r, a) {
        if (e == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
        var o, s = u({}, e.props), p = e.key, d = e.ref, y = e._self, E = e._source, j = e._owner;
        if (r != null) {
          Be(r) && (d = r.ref, j = $.current), ze(r) && (Pe(r.key), p = "" + r.key);
          var D;
          e.type && e.type.defaultProps && (D = e.type.defaultProps);
          for (o in r)
            xe.call(r, o) && !Me.hasOwnProperty(o) && (r[o] === void 0 && D !== void 0 ? s[o] = D[o] : s[o] = r[o]);
        }
        var I = arguments.length - 2;
        if (I === 1)
          s.children = a;
        else if (I > 1) {
          for (var M = Array(I), z = 0; z < I; z++)
            M[z] = arguments[z + 2];
          s.children = M;
        }
        return qe(e.type, p, d, y, E, j, s);
      }
      function Se(e) {
        return typeof e == "object" && e !== null && e.$$typeof === H;
      }
      var ur = ".", Sr = ":";
      function Ke(e) {
        var r = /[=:]/g, a = {
          "=": "=0",
          ":": "=2"
        }, o = e.replace(r, function(s) {
          return a[s];
        });
        return "$" + o;
      }
      var He = !1, Te = /\/+/g;
      function Ne(e) {
        return e.replace(Te, "$&/");
      }
      function Ae(e, r) {
        return typeof e == "object" && e !== null && e.key != null ? (Pe(e.key), Ke("" + e.key)) : r.toString(36);
      }
      function De(e, r, a, o, s) {
        var p = typeof e;
        (p === "undefined" || p === "boolean") && (e = null);
        var d = !1;
        if (e === null)
          d = !0;
        else
          switch (p) {
            case "string":
            case "number":
              d = !0;
              break;
            case "object":
              switch (e.$$typeof) {
                case H:
                case ye:
                  d = !0;
              }
          }
        if (d) {
          var y = e, E = s(y), j = o === "" ? ur + Ae(y, 0) : o;
          if (Fe(E)) {
            var D = "";
            j != null && (D = Ne(j) + "/"), De(E, r, D, "", function(Vt) {
              return Vt;
            });
          } else E != null && (Se(E) && (E.key && (!y || y.key !== E.key) && Pe(E.key), E = Cr(
            E,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            a + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (E.key && (!y || y.key !== E.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              Ne("" + E.key) + "/"
            ) : "") + j
          )), r.push(E));
          return 1;
        }
        var I, M, z = 0, X = o === "" ? ur : o + Sr;
        if (Fe(e))
          for (var mr = 0; mr < e.length; mr++)
            I = e[mr], M = X + Ae(I, mr), z += De(I, r, a, M, s);
        else {
          var Wr = O(e);
          if (typeof Wr == "function") {
            var lt = e;
            Wr === lt.entries && (He || k("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), He = !0);
            for (var Ut = Wr.call(lt), ft, Nt = 0; !(ft = Ut.next()).done; )
              I = ft.value, M = X + Ae(I, Nt++), z += De(I, r, a, M, s);
          } else if (p === "object") {
            var dt = String(e);
            throw new Error("Objects are not valid as a React child (found: " + (dt === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : dt) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return z;
      }
      function Ve(e, r, a) {
        if (e == null)
          return e;
        var o = [], s = 0;
        return De(e, o, "", "", function(p) {
          return r.call(a, p, s++);
        }), o;
      }
      function sr(e) {
        var r = 0;
        return Ve(e, function() {
          r++;
        }), r;
      }
      function Tr(e, r, a) {
        Ve(e, function() {
          r.apply(this, arguments);
        }, a);
      }
      function cr(e) {
        return Ve(e, function(r) {
          return r;
        }) || [];
      }
      function lr(e) {
        if (!Se(e))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return e;
      }
      function Or(e) {
        var r = {
          $$typeof: q,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: e,
          _currentValue2: e,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        r.Provider = {
          $$typeof: F,
          _context: r
        };
        var a = !1, o = !1, s = !1;
        {
          var p = {
            $$typeof: q,
            _context: r
          };
          Object.defineProperties(p, {
            Provider: {
              get: function() {
                return o || (o = !0, l("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), r.Provider;
              },
              set: function(d) {
                r.Provider = d;
              }
            },
            _currentValue: {
              get: function() {
                return r._currentValue;
              },
              set: function(d) {
                r._currentValue = d;
              }
            },
            _currentValue2: {
              get: function() {
                return r._currentValue2;
              },
              set: function(d) {
                r._currentValue2 = d;
              }
            },
            _threadCount: {
              get: function() {
                return r._threadCount;
              },
              set: function(d) {
                r._threadCount = d;
              }
            },
            Consumer: {
              get: function() {
                return a || (a = !0, l("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), r.Consumer;
              }
            },
            displayName: {
              get: function() {
                return r.displayName;
              },
              set: function(d) {
                s || (k("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", d), s = !0);
              }
            }
          }), r.Consumer = p;
        }
        return r._currentRenderer = null, r._currentRenderer2 = null, r;
      }
      var Ie = -1, We = 0, Ge = 1, kr = 2;
      function Pr(e) {
        if (e._status === Ie) {
          var r = e._result, a = r();
          if (a.then(function(p) {
            if (e._status === We || e._status === Ie) {
              var d = e;
              d._status = Ge, d._result = p;
            }
          }, function(p) {
            if (e._status === We || e._status === Ie) {
              var d = e;
              d._status = kr, d._result = p;
            }
          }), e._status === Ie) {
            var o = e;
            o._status = We, o._result = a;
          }
        }
        if (e._status === Ge) {
          var s = e._result;
          return s === void 0 && l(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, s), "default" in s || l(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, s), s.default;
        } else
          throw e._result;
      }
      function jr(e) {
        var r = {
          // We use these fields to store the result.
          _status: Ie,
          _result: e
        }, a = {
          $$typeof: pe,
          _payload: r,
          _init: Pr
        };
        {
          var o, s;
          Object.defineProperties(a, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return o;
              },
              set: function(p) {
                l("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), o = p, Object.defineProperty(a, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return s;
              },
              set: function(p) {
                l("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), s = p, Object.defineProperty(a, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return a;
      }
      function xr(e) {
        e != null && e.$$typeof === Q ? l("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof e != "function" ? l("forwardRef requires a render function but was given %s.", e === null ? "null" : typeof e) : e.length !== 0 && e.length !== 2 && l("forwardRef render functions accept exactly two parameters: props and ref. %s", e.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), e != null && (e.defaultProps != null || e.propTypes != null) && l("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var r = {
          $$typeof: A,
          render: e
        };
        {
          var a;
          Object.defineProperty(r, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return a;
            },
            set: function(o) {
              a = o, !e.name && !e.displayName && (e.displayName = o);
            }
          });
        }
        return r;
      }
      var t;
      t = Symbol.for("react.module.reference");
      function i(e) {
        return !!(typeof e == "string" || typeof e == "function" || e === ae || e === G || re || e === se || e === U || e === W || ee || e === Ce || be || ke || Ee || typeof e == "object" && e !== null && (e.$$typeof === pe || e.$$typeof === Q || e.$$typeof === F || e.$$typeof === q || e.$$typeof === A || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        e.$$typeof === t || e.getModuleId !== void 0));
      }
      function c(e, r) {
        i(e) || l("memo: The first argument must be a component. Instead received: %s", e === null ? "null" : typeof e);
        var a = {
          $$typeof: Q,
          type: e,
          compare: r === void 0 ? null : r
        };
        {
          var o;
          Object.defineProperty(a, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return o;
            },
            set: function(s) {
              o = s, !e.name && !e.displayName && (e.displayName = s);
            }
          });
        }
        return a;
      }
      function f() {
        var e = he.current;
        return e === null && l(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), e;
      }
      function C(e) {
        var r = f();
        if (e._context !== void 0) {
          var a = e._context;
          a.Consumer === e ? l("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : a.Provider === e && l("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return r.useContext(e);
      }
      function S(e) {
        var r = f();
        return r.useState(e);
      }
      function _(e, r, a) {
        var o = f();
        return o.useReducer(e, r, a);
      }
      function h(e) {
        var r = f();
        return r.useRef(e);
      }
      function J(e, r) {
        var a = f();
        return a.useEffect(e, r);
      }
      function L(e, r) {
        var a = f();
        return a.useInsertionEffect(e, r);
      }
      function V(e, r) {
        var a = f();
        return a.useLayoutEffect(e, r);
      }
      function ue(e, r) {
        var a = f();
        return a.useCallback(e, r);
      }
      function Oe(e, r) {
        var a = f();
        return a.useMemo(e, r);
      }
      function Re(e, r, a) {
        var o = f();
        return o.useImperativeHandle(e, r, a);
      }
      function te(e, r) {
        {
          var a = f();
          return a.useDebugValue(e, r);
        }
      }
      function Je() {
        var e = f();
        return e.useTransition();
      }
      function Ar(e) {
        var r = f();
        return r.useDeferredValue(e);
      }
      function Dr() {
        var e = f();
        return e.useId();
      }
      function _t(e, r, a) {
        var o = f();
        return o.useSyncExternalStore(e, r, a);
      }
      var Xe = 0, $r, Br, zr, qr, Kr, Hr, Gr;
      function Jr() {
      }
      Jr.__reactDisabledLog = !0;
      function bt() {
        {
          if (Xe === 0) {
            $r = console.log, Br = console.info, zr = console.warn, qr = console.error, Kr = console.group, Hr = console.groupCollapsed, Gr = console.groupEnd;
            var e = {
              configurable: !0,
              enumerable: !0,
              value: Jr,
              writable: !0
            };
            Object.defineProperties(console, {
              info: e,
              log: e,
              warn: e,
              error: e,
              group: e,
              groupCollapsed: e,
              groupEnd: e
            });
          }
          Xe++;
        }
      }
      function Et() {
        {
          if (Xe--, Xe === 0) {
            var e = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: u({}, e, {
                value: $r
              }),
              info: u({}, e, {
                value: Br
              }),
              warn: u({}, e, {
                value: zr
              }),
              error: u({}, e, {
                value: qr
              }),
              group: u({}, e, {
                value: Kr
              }),
              groupCollapsed: u({}, e, {
                value: Hr
              }),
              groupEnd: u({}, e, {
                value: Gr
              })
            });
          }
          Xe < 0 && l("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Ir = K.ReactCurrentDispatcher, Fr;
      function fr(e, r, a) {
        {
          if (Fr === void 0)
            try {
              throw Error();
            } catch (s) {
              var o = s.stack.trim().match(/\n( *(at )?)/);
              Fr = o && o[1] || "";
            }
          return `
` + Fr + e;
        }
      }
      var Lr = !1, dr;
      {
        var Rt = typeof WeakMap == "function" ? WeakMap : Map;
        dr = new Rt();
      }
      function Xr(e, r) {
        if (!e || Lr)
          return "";
        {
          var a = dr.get(e);
          if (a !== void 0)
            return a;
        }
        var o;
        Lr = !0;
        var s = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var p;
        p = Ir.current, Ir.current = null, bt();
        try {
          if (r) {
            var d = function() {
              throw Error();
            };
            if (Object.defineProperty(d.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(d, []);
              } catch (X) {
                o = X;
              }
              Reflect.construct(e, [], d);
            } else {
              try {
                d.call();
              } catch (X) {
                o = X;
              }
              e.call(d.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (X) {
              o = X;
            }
            e();
          }
        } catch (X) {
          if (X && o && typeof X.stack == "string") {
            for (var y = X.stack.split(`
`), E = o.stack.split(`
`), j = y.length - 1, D = E.length - 1; j >= 1 && D >= 0 && y[j] !== E[D]; )
              D--;
            for (; j >= 1 && D >= 0; j--, D--)
              if (y[j] !== E[D]) {
                if (j !== 1 || D !== 1)
                  do
                    if (j--, D--, D < 0 || y[j] !== E[D]) {
                      var I = `
` + y[j].replace(" at new ", " at ");
                      return e.displayName && I.includes("<anonymous>") && (I = I.replace("<anonymous>", e.displayName)), typeof e == "function" && dr.set(e, I), I;
                    }
                  while (j >= 1 && D >= 0);
                break;
              }
          }
        } finally {
          Lr = !1, Ir.current = p, Et(), Error.prepareStackTrace = s;
        }
        var M = e ? e.displayName || e.name : "", z = M ? fr(M) : "";
        return typeof e == "function" && dr.set(e, z), z;
      }
      function Ct(e, r, a) {
        return Xr(e, !1);
      }
      function wt(e) {
        var r = e.prototype;
        return !!(r && r.isReactComponent);
      }
      function pr(e, r, a) {
        if (e == null)
          return "";
        if (typeof e == "function")
          return Xr(e, wt(e));
        if (typeof e == "string")
          return fr(e);
        switch (e) {
          case U:
            return fr("Suspense");
          case W:
            return fr("SuspenseList");
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case A:
              return Ct(e.render);
            case Q:
              return pr(e.type, r, a);
            case pe: {
              var o = e, s = o._payload, p = o._init;
              try {
                return pr(p(s), r, a);
              } catch {
              }
            }
          }
        return "";
      }
      var Qr = {}, Zr = K.ReactDebugCurrentFrame;
      function vr(e) {
        if (e) {
          var r = e._owner, a = pr(e.type, e._source, r ? r.type : null);
          Zr.setExtraStackFrame(a);
        } else
          Zr.setExtraStackFrame(null);
      }
      function St(e, r, a, o, s) {
        {
          var p = Function.call.bind(xe);
          for (var d in e)
            if (p(e, d)) {
              var y = void 0;
              try {
                if (typeof e[d] != "function") {
                  var E = Error((o || "React class") + ": " + a + " type `" + d + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[d] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw E.name = "Invariant Violation", E;
                }
                y = e[d](r, d, o, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (j) {
                y = j;
              }
              y && !(y instanceof Error) && (vr(s), l("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", o || "React class", a, d, typeof y), vr(null)), y instanceof Error && !(y.message in Qr) && (Qr[y.message] = !0, vr(s), l("Failed %s type: %s", a, y.message), vr(null));
            }
        }
      }
      function Ye(e) {
        if (e) {
          var r = e._owner, a = pr(e.type, e._source, r ? r.type : null);
          ie(a);
        } else
          ie(null);
      }
      var Mr;
      Mr = !1;
      function et() {
        if ($.current) {
          var e = ge($.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
      function Tt(e) {
        if (e !== void 0) {
          var r = e.fileName.replace(/^.*[\\\/]/, ""), a = e.lineNumber;
          return `

Check your code at ` + r + ":" + a + ".";
        }
        return "";
      }
      function Ot(e) {
        return e != null ? Tt(e.__source) : "";
      }
      var rt = {};
      function kt(e) {
        var r = et();
        if (!r) {
          var a = typeof e == "string" ? e : e.displayName || e.name;
          a && (r = `

Check the top-level render call using <` + a + ">.");
        }
        return r;
      }
      function tt(e, r) {
        if (!(!e._store || e._store.validated || e.key != null)) {
          e._store.validated = !0;
          var a = kt(r);
          if (!rt[a]) {
            rt[a] = !0;
            var o = "";
            e && e._owner && e._owner !== $.current && (o = " It was passed a child from " + ge(e._owner.type) + "."), Ye(e), l('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', a, o), Ye(null);
          }
        }
      }
      function nt(e, r) {
        if (typeof e == "object") {
          if (Fe(e))
            for (var a = 0; a < e.length; a++) {
              var o = e[a];
              Se(o) && tt(o, r);
            }
          else if (Se(e))
            e._store && (e._store.validated = !0);
          else if (e) {
            var s = O(e);
            if (typeof s == "function" && s !== e.entries)
              for (var p = s.call(e), d; !(d = p.next()).done; )
                Se(d.value) && tt(d.value, r);
          }
        }
      }
      function at(e) {
        {
          var r = e.type;
          if (r == null || typeof r == "string")
            return;
          var a;
          if (typeof r == "function")
            a = r.propTypes;
          else if (typeof r == "object" && (r.$$typeof === A || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          r.$$typeof === Q))
            a = r.propTypes;
          else
            return;
          if (a) {
            var o = ge(r);
            St(a, e.props, "prop", o, e);
          } else if (r.PropTypes !== void 0 && !Mr) {
            Mr = !0;
            var s = ge(r);
            l("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", s || "Unknown");
          }
          typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && l("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Pt(e) {
        {
          for (var r = Object.keys(e.props), a = 0; a < r.length; a++) {
            var o = r[a];
            if (o !== "children" && o !== "key") {
              Ye(e), l("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", o), Ye(null);
              break;
            }
          }
          e.ref !== null && (Ye(e), l("Invalid attribute `ref` supplied to `React.Fragment`."), Ye(null));
        }
      }
      function ot(e, r, a) {
        var o = i(e);
        if (!o) {
          var s = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (s += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var p = Ot(r);
          p ? s += p : s += et();
          var d;
          e === null ? d = "null" : Fe(e) ? d = "array" : e !== void 0 && e.$$typeof === H ? (d = "<" + (ge(e.type) || "Unknown") + " />", s = " Did you accidentally export a JSX literal instead of a component?") : d = typeof e, l("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", d, s);
        }
        var y = Rr.apply(this, arguments);
        if (y == null)
          return y;
        if (o)
          for (var E = 2; E < arguments.length; E++)
            nt(arguments[E], e);
        return e === ae ? Pt(y) : at(y), y;
      }
      var it = !1;
      function jt(e) {
        var r = ot.bind(null, e);
        return r.type = e, it || (it = !0, k("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(r, "type", {
          enumerable: !1,
          get: function() {
            return k("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: e
            }), e;
          }
        }), r;
      }
      function xt(e, r, a) {
        for (var o = wr.apply(this, arguments), s = 2; s < arguments.length; s++)
          nt(arguments[s], o.type);
        return at(o), o;
      }
      function At(e, r) {
        var a = oe.transition;
        oe.transition = {};
        var o = oe.transition;
        oe.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          e();
        } finally {
          if (oe.transition = a, a === null && o._updatedFibers) {
            var s = o._updatedFibers.size;
            s > 10 && k("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), o._updatedFibers.clear();
          }
        }
      }
      var ut = !1, yr = null;
      function Dt(e) {
        if (yr === null)
          try {
            var r = ("require" + Math.random()).slice(0, 7), a = ne && ne[r];
            yr = a.call(ne, "timers").setImmediate;
          } catch {
            yr = function(s) {
              ut === !1 && (ut = !0, typeof MessageChannel > "u" && l("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var p = new MessageChannel();
              p.port1.onmessage = s, p.port2.postMessage(void 0);
            };
          }
        return yr(e);
      }
      var $e = 0, st = !1;
      function ct(e) {
        {
          var r = $e;
          $e++, N.current === null && (N.current = []);
          var a = N.isBatchingLegacy, o;
          try {
            if (N.isBatchingLegacy = !0, o = e(), !a && N.didScheduleLegacyUpdate) {
              var s = N.current;
              s !== null && (N.didScheduleLegacyUpdate = !1, Vr(s));
            }
          } catch (M) {
            throw hr(r), M;
          } finally {
            N.isBatchingLegacy = a;
          }
          if (o !== null && typeof o == "object" && typeof o.then == "function") {
            var p = o, d = !1, y = {
              then: function(M, z) {
                d = !0, p.then(function(X) {
                  hr(r), $e === 0 ? Ur(X, M, z) : M(X);
                }, function(X) {
                  hr(r), z(X);
                });
              }
            };
            return !st && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              d || (st = !0, l("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), y;
          } else {
            var E = o;
            if (hr(r), $e === 0) {
              var j = N.current;
              j !== null && (Vr(j), N.current = null);
              var D = {
                then: function(M, z) {
                  N.current === null ? (N.current = [], Ur(E, M, z)) : M(E);
                }
              };
              return D;
            } else {
              var I = {
                then: function(M, z) {
                  M(E);
                }
              };
              return I;
            }
          }
        }
      }
      function hr(e) {
        e !== $e - 1 && l("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), $e = e;
      }
      function Ur(e, r, a) {
        {
          var o = N.current;
          if (o !== null)
            try {
              Vr(o), Dt(function() {
                o.length === 0 ? (N.current = null, r(e)) : Ur(e, r, a);
              });
            } catch (s) {
              a(s);
            }
          else
            r(e);
        }
      }
      var Nr = !1;
      function Vr(e) {
        if (!Nr) {
          Nr = !0;
          var r = 0;
          try {
            for (; r < e.length; r++) {
              var a = e[r];
              do
                a = a(!0);
              while (a !== null);
            }
            e.length = 0;
          } catch (o) {
            throw e = e.slice(r + 1), o;
          } finally {
            Nr = !1;
          }
        }
      }
      var It = ot, Ft = xt, Lt = jt, Mt = {
        map: Ve,
        forEach: Tr,
        count: sr,
        toArray: cr,
        only: lr
      };
      v.Children = Mt, v.Component = b, v.Fragment = ae, v.Profiler = G, v.PureComponent = w, v.StrictMode = se, v.Suspense = U, v.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = K, v.act = ct, v.cloneElement = Ft, v.createContext = Or, v.createElement = It, v.createFactory = Lt, v.createRef = _r, v.forwardRef = xr, v.isValidElement = Se, v.lazy = jr, v.memo = c, v.startTransition = At, v.unstable_act = ct, v.useCallback = ue, v.useContext = C, v.useDebugValue = te, v.useDeferredValue = Ar, v.useEffect = J, v.useId = Dr, v.useImperativeHandle = Re, v.useInsertionEffect = L, v.useLayoutEffect = V, v.useMemo = Oe, v.useReducer = _, v.useRef = h, v.useState = S, v.useSyncExternalStore = _t, v.useTransition = Je, v.version = _e, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(er, er.exports)), er.exports;
}
var yt;
function gt() {
  return yt || (yt = 1, process.env.NODE_ENV === "production" ? gr.exports = Wt() : gr.exports = Yt()), gr.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ht;
function $t() {
  if (ht) return Qe;
  ht = 1;
  var ne = gt(), v = Symbol.for("react.element"), _e = Symbol.for("react.fragment"), H = Object.prototype.hasOwnProperty, ye = ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, ae = { key: !0, ref: !0, __self: !0, __source: !0 };
  function se(G, F, q) {
    var A, U = {}, W = null, Q = null;
    q !== void 0 && (W = "" + q), F.key !== void 0 && (W = "" + F.key), F.ref !== void 0 && (Q = F.ref);
    for (A in F) H.call(F, A) && !ae.hasOwnProperty(A) && (U[A] = F[A]);
    if (G && G.defaultProps) for (A in F = G.defaultProps, F) U[A] === void 0 && (U[A] = F[A]);
    return { $$typeof: v, type: G, key: W, ref: Q, props: U, _owner: ye.current };
  }
  return Qe.Fragment = _e, Qe.jsx = se, Qe.jsxs = se, Qe;
}
var Ze = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var mt;
function Bt() {
  return mt || (mt = 1, process.env.NODE_ENV !== "production" && function() {
    var ne = gt(), v = Symbol.for("react.element"), _e = Symbol.for("react.portal"), H = Symbol.for("react.fragment"), ye = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), se = Symbol.for("react.provider"), G = Symbol.for("react.context"), F = Symbol.for("react.forward_ref"), q = Symbol.for("react.suspense"), A = Symbol.for("react.suspense_list"), U = Symbol.for("react.memo"), W = Symbol.for("react.lazy"), Q = Symbol.for("react.offscreen"), pe = Symbol.iterator, Ce = "@@iterator";
    function ce(t) {
      if (t === null || typeof t != "object")
        return null;
      var i = pe && t[pe] || t[Ce];
      return typeof i == "function" ? i : null;
    }
    var le = ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function O(t) {
      {
        for (var i = arguments.length, c = new Array(i > 1 ? i - 1 : 0), f = 1; f < i; f++)
          c[f - 1] = arguments[f];
        he("error", t, c);
      }
    }
    function he(t, i, c) {
      {
        var f = le.ReactDebugCurrentFrame, C = f.getStackAddendum();
        C !== "" && (i += "%s", c = c.concat([C]));
        var S = c.map(function(_) {
          return String(_);
        });
        S.unshift("Warning: " + i), Function.prototype.apply.call(console[t], console, S);
      }
    }
    var oe = !1, N = !1, $ = !1, Z = !1, ve = !1, ie;
    ie = Symbol.for("react.module.reference");
    function be(t) {
      return !!(typeof t == "string" || typeof t == "function" || t === H || t === ae || ve || t === ye || t === q || t === A || Z || t === Q || oe || N || $ || typeof t == "object" && t !== null && (t.$$typeof === W || t.$$typeof === U || t.$$typeof === se || t.$$typeof === G || t.$$typeof === F || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      t.$$typeof === ie || t.getModuleId !== void 0));
    }
    function ke(t, i, c) {
      var f = t.displayName;
      if (f)
        return f;
      var C = i.displayName || i.name || "";
      return C !== "" ? c + "(" + C + ")" : c;
    }
    function Ee(t) {
      return t.displayName || "Context";
    }
    function ee(t) {
      if (t == null)
        return null;
      if (typeof t.tag == "number" && O("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof t == "function")
        return t.displayName || t.name || null;
      if (typeof t == "string")
        return t;
      switch (t) {
        case H:
          return "Fragment";
        case _e:
          return "Portal";
        case ae:
          return "Profiler";
        case ye:
          return "StrictMode";
        case q:
          return "Suspense";
        case A:
          return "SuspenseList";
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case G:
            var i = t;
            return Ee(i) + ".Consumer";
          case se:
            var c = t;
            return Ee(c._context) + ".Provider";
          case F:
            return ke(t, t.render, "ForwardRef");
          case U:
            var f = t.displayName || null;
            return f !== null ? f : ee(t.type) || "Memo";
          case W: {
            var C = t, S = C._payload, _ = C._init;
            try {
              return ee(_(S));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var re = Object.assign, K = 0, k, l, fe, me, de, n, u;
    function g() {
    }
    g.__reactDisabledLog = !0;
    function b() {
      {
        if (K === 0) {
          k = console.log, l = console.info, fe = console.warn, me = console.error, de = console.group, n = console.groupCollapsed, u = console.groupEnd;
          var t = {
            configurable: !0,
            enumerable: !0,
            value: g,
            writable: !0
          };
          Object.defineProperties(console, {
            info: t,
            log: t,
            warn: t,
            error: t,
            group: t,
            groupCollapsed: t,
            groupEnd: t
          });
        }
        K++;
      }
    }
    function R() {
      {
        if (K--, K === 0) {
          var t = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: re({}, t, {
              value: k
            }),
            info: re({}, t, {
              value: l
            }),
            warn: re({}, t, {
              value: fe
            }),
            error: re({}, t, {
              value: me
            }),
            group: re({}, t, {
              value: de
            }),
            groupCollapsed: re({}, t, {
              value: n
            }),
            groupEnd: re({}, t, {
              value: u
            })
          });
        }
        K < 0 && O("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var x = le.ReactCurrentDispatcher, P;
    function T(t, i, c) {
      {
        if (P === void 0)
          try {
            throw Error();
          } catch (C) {
            var f = C.stack.trim().match(/\n( *(at )?)/);
            P = f && f[1] || "";
          }
        return `
` + P + t;
      }
    }
    var w = !1, B;
    {
      var _r = typeof WeakMap == "function" ? WeakMap : Map;
      B = new _r();
    }
    function rr(t, i) {
      if (!t || w)
        return "";
      {
        var c = B.get(t);
        if (c !== void 0)
          return c;
      }
      var f;
      w = !0;
      var C = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var S;
      S = x.current, x.current = null, b();
      try {
        if (i) {
          var _ = function() {
            throw Error();
          };
          if (Object.defineProperty(_.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(_, []);
            } catch (te) {
              f = te;
            }
            Reflect.construct(t, [], _);
          } else {
            try {
              _.call();
            } catch (te) {
              f = te;
            }
            t.call(_.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (te) {
            f = te;
          }
          t();
        }
      } catch (te) {
        if (te && f && typeof te.stack == "string") {
          for (var h = te.stack.split(`
`), J = f.stack.split(`
`), L = h.length - 1, V = J.length - 1; L >= 1 && V >= 0 && h[L] !== J[V]; )
            V--;
          for (; L >= 1 && V >= 0; L--, V--)
            if (h[L] !== J[V]) {
              if (L !== 1 || V !== 1)
                do
                  if (L--, V--, V < 0 || h[L] !== J[V]) {
                    var ue = `
` + h[L].replace(" at new ", " at ");
                    return t.displayName && ue.includes("<anonymous>") && (ue = ue.replace("<anonymous>", t.displayName)), typeof t == "function" && B.set(t, ue), ue;
                  }
                while (L >= 1 && V >= 0);
              break;
            }
        }
      } finally {
        w = !1, x.current = S, R(), Error.prepareStackTrace = C;
      }
      var Oe = t ? t.displayName || t.name : "", Re = Oe ? T(Oe) : "";
      return typeof t == "function" && B.set(t, Re), Re;
    }
    function Fe(t, i, c) {
      return rr(t, !1);
    }
    function br(t) {
      var i = t.prototype;
      return !!(i && i.isReactComponent);
    }
    function Le(t, i, c) {
      if (t == null)
        return "";
      if (typeof t == "function")
        return rr(t, br(t));
      if (typeof t == "string")
        return T(t);
      switch (t) {
        case q:
          return T("Suspense");
        case A:
          return T("SuspenseList");
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case F:
            return Fe(t.render);
          case U:
            return Le(t.type, i, c);
          case W: {
            var f = t, C = f._payload, S = f._init;
            try {
              return Le(S(C), i, c);
            } catch {
            }
          }
        }
      return "";
    }
    var we = Object.prototype.hasOwnProperty, Pe = {}, tr = le.ReactDebugCurrentFrame;
    function je(t) {
      if (t) {
        var i = t._owner, c = Le(t.type, t._source, i ? i.type : null);
        tr.setExtraStackFrame(c);
      } else
        tr.setExtraStackFrame(null);
    }
    function ge(t, i, c, f, C) {
      {
        var S = Function.call.bind(we);
        for (var _ in t)
          if (S(t, _)) {
            var h = void 0;
            try {
              if (typeof t[_] != "function") {
                var J = Error((f || "React class") + ": " + c + " type `" + _ + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof t[_] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw J.name = "Invariant Violation", J;
              }
              h = t[_](i, _, f, c, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (L) {
              h = L;
            }
            h && !(h instanceof Error) && (je(C), O("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", f || "React class", c, _, typeof h), je(null)), h instanceof Error && !(h.message in Pe) && (Pe[h.message] = !0, je(C), O("Failed %s type: %s", c, h.message), je(null));
          }
      }
    }
    var xe = Array.isArray;
    function Me(t) {
      return xe(t);
    }
    function nr(t) {
      {
        var i = typeof Symbol == "function" && Symbol.toStringTag, c = i && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return c;
      }
    }
    function ar(t) {
      try {
        return Ue(t), !1;
      } catch {
        return !0;
      }
    }
    function Ue(t) {
      return "" + t;
    }
    function Be(t) {
      if (ar(t))
        return O("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", nr(t)), Ue(t);
    }
    var ze = le.ReactCurrentOwner, Er = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, or, ir;
    function qe(t) {
      if (we.call(t, "ref")) {
        var i = Object.getOwnPropertyDescriptor(t, "ref").get;
        if (i && i.isReactWarning)
          return !1;
      }
      return t.ref !== void 0;
    }
    function Rr(t) {
      if (we.call(t, "key")) {
        var i = Object.getOwnPropertyDescriptor(t, "key").get;
        if (i && i.isReactWarning)
          return !1;
      }
      return t.key !== void 0;
    }
    function Cr(t, i) {
      typeof t.ref == "string" && ze.current;
    }
    function wr(t, i) {
      {
        var c = function() {
          or || (or = !0, O("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", i));
        };
        c.isReactWarning = !0, Object.defineProperty(t, "key", {
          get: c,
          configurable: !0
        });
      }
    }
    function Se(t, i) {
      {
        var c = function() {
          ir || (ir = !0, O("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", i));
        };
        c.isReactWarning = !0, Object.defineProperty(t, "ref", {
          get: c,
          configurable: !0
        });
      }
    }
    var ur = function(t, i, c, f, C, S, _) {
      var h = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: v,
        // Built-in properties that belong on the element
        type: t,
        key: i,
        ref: c,
        props: _,
        // Record the component responsible for creating this element.
        _owner: S
      };
      return h._store = {}, Object.defineProperty(h._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(h, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: f
      }), Object.defineProperty(h, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: C
      }), Object.freeze && (Object.freeze(h.props), Object.freeze(h)), h;
    };
    function Sr(t, i, c, f, C) {
      {
        var S, _ = {}, h = null, J = null;
        c !== void 0 && (Be(c), h = "" + c), Rr(i) && (Be(i.key), h = "" + i.key), qe(i) && (J = i.ref, Cr(i, C));
        for (S in i)
          we.call(i, S) && !Er.hasOwnProperty(S) && (_[S] = i[S]);
        if (t && t.defaultProps) {
          var L = t.defaultProps;
          for (S in L)
            _[S] === void 0 && (_[S] = L[S]);
        }
        if (h || J) {
          var V = typeof t == "function" ? t.displayName || t.name || "Unknown" : t;
          h && wr(_, V), J && Se(_, V);
        }
        return ur(t, h, J, C, f, ze.current, _);
      }
    }
    var Ke = le.ReactCurrentOwner, He = le.ReactDebugCurrentFrame;
    function Te(t) {
      if (t) {
        var i = t._owner, c = Le(t.type, t._source, i ? i.type : null);
        He.setExtraStackFrame(c);
      } else
        He.setExtraStackFrame(null);
    }
    var Ne;
    Ne = !1;
    function Ae(t) {
      return typeof t == "object" && t !== null && t.$$typeof === v;
    }
    function De() {
      {
        if (Ke.current) {
          var t = ee(Ke.current.type);
          if (t)
            return `

Check the render method of \`` + t + "`.";
        }
        return "";
      }
    }
    function Ve(t) {
      return "";
    }
    var sr = {};
    function Tr(t) {
      {
        var i = De();
        if (!i) {
          var c = typeof t == "string" ? t : t.displayName || t.name;
          c && (i = `

Check the top-level render call using <` + c + ">.");
        }
        return i;
      }
    }
    function cr(t, i) {
      {
        if (!t._store || t._store.validated || t.key != null)
          return;
        t._store.validated = !0;
        var c = Tr(i);
        if (sr[c])
          return;
        sr[c] = !0;
        var f = "";
        t && t._owner && t._owner !== Ke.current && (f = " It was passed a child from " + ee(t._owner.type) + "."), Te(t), O('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', c, f), Te(null);
      }
    }
    function lr(t, i) {
      {
        if (typeof t != "object")
          return;
        if (Me(t))
          for (var c = 0; c < t.length; c++) {
            var f = t[c];
            Ae(f) && cr(f, i);
          }
        else if (Ae(t))
          t._store && (t._store.validated = !0);
        else if (t) {
          var C = ce(t);
          if (typeof C == "function" && C !== t.entries)
            for (var S = C.call(t), _; !(_ = S.next()).done; )
              Ae(_.value) && cr(_.value, i);
        }
      }
    }
    function Or(t) {
      {
        var i = t.type;
        if (i == null || typeof i == "string")
          return;
        var c;
        if (typeof i == "function")
          c = i.propTypes;
        else if (typeof i == "object" && (i.$$typeof === F || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        i.$$typeof === U))
          c = i.propTypes;
        else
          return;
        if (c) {
          var f = ee(i);
          ge(c, t.props, "prop", f, t);
        } else if (i.PropTypes !== void 0 && !Ne) {
          Ne = !0;
          var C = ee(i);
          O("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", C || "Unknown");
        }
        typeof i.getDefaultProps == "function" && !i.getDefaultProps.isReactClassApproved && O("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Ie(t) {
      {
        for (var i = Object.keys(t.props), c = 0; c < i.length; c++) {
          var f = i[c];
          if (f !== "children" && f !== "key") {
            Te(t), O("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", f), Te(null);
            break;
          }
        }
        t.ref !== null && (Te(t), O("Invalid attribute `ref` supplied to `React.Fragment`."), Te(null));
      }
    }
    var We = {};
    function Ge(t, i, c, f, C, S) {
      {
        var _ = be(t);
        if (!_) {
          var h = "";
          (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (h += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var J = Ve();
          J ? h += J : h += De();
          var L;
          t === null ? L = "null" : Me(t) ? L = "array" : t !== void 0 && t.$$typeof === v ? (L = "<" + (ee(t.type) || "Unknown") + " />", h = " Did you accidentally export a JSX literal instead of a component?") : L = typeof t, O("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", L, h);
        }
        var V = Sr(t, i, c, C, S);
        if (V == null)
          return V;
        if (_) {
          var ue = i.children;
          if (ue !== void 0)
            if (f)
              if (Me(ue)) {
                for (var Oe = 0; Oe < ue.length; Oe++)
                  lr(ue[Oe], t);
                Object.freeze && Object.freeze(ue);
              } else
                O("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              lr(ue, t);
        }
        if (we.call(i, "key")) {
          var Re = ee(t), te = Object.keys(i).filter(function(Dr) {
            return Dr !== "key";
          }), Je = te.length > 0 ? "{key: someKey, " + te.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!We[Re + Je]) {
            var Ar = te.length > 0 ? "{" + te.join(": ..., ") + ": ...}" : "{}";
            O(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Je, Re, Ar, Re), We[Re + Je] = !0;
          }
        }
        return t === H ? Ie(V) : Or(V), V;
      }
    }
    function kr(t, i, c) {
      return Ge(t, i, c, !0);
    }
    function Pr(t, i, c) {
      return Ge(t, i, c, !1);
    }
    var jr = Pr, xr = kr;
    Ze.Fragment = H, Ze.jsx = jr, Ze.jsxs = xr;
  }()), Ze;
}
process.env.NODE_ENV === "production" ? Yr.exports = $t() : Yr.exports = Bt();
var Y = Yr.exports;
function zt(ne, v, _e) {
  const { useState: H, useEffect: ye, Fragment: ae } = ne, { Table: se, Button: G, Modal: F, Form: q, Input: A, Select: U, message: W } = v, { PlusOutlined: Q, EditOutlined: pe, DeleteOutlined: Ce } = _e;
  function ce() {
    const [le, O] = H([]), [he, oe] = H(!1), [N, $] = H(!1), [Z, ve] = H(null), [ie] = q.useForm(), be = async () => {
      oe(!0);
      try {
        const l = await (await fetch("/api/plugins/user-management/users")).json();
        O(l.users || []);
      } catch (k) {
        W.error("加载用户列表失败"), console.error("加载用户列表失败:", k);
      } finally {
        oe(!1);
      }
    };
    ye(() => {
      be();
    }, []);
    const ke = () => {
      ve(null), $(!0), ie.resetFields();
    }, Ee = (k) => {
      ve(k), $(!0), ie.setFieldsValue(k);
    }, ee = async (k) => {
      try {
        await fetch(`/api/plugins/user-management/users/${k}`, {
          method: "DELETE"
        }), O((l) => l.filter((fe) => fe.id !== k)), W.success("删除成功");
      } catch (l) {
        W.error("删除失败"), console.error("删除失败:", l);
      }
    }, re = async () => {
      try {
        const k = await ie.validateFields(), l = Z ? `/api/plugins/user-management/users/${Z.id}` : "/api/plugins/user-management/users", me = await fetch(l, {
          method: Z ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(k)
        });
        if (me.ok) {
          const de = await me.json();
          Z ? (O((n) => n.map((u) => u.id === de.id ? de : u)), W.success("更新成功")) : (O((n) => [...n, de]), W.success("创建成功")), $(!1), ie.resetFields();
        } else
          W.error("提交失败");
      } catch (k) {
        W.error("提交失败"), console.error("提交失败:", k);
      }
    }, K = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "角色",
        dataIndex: "role",
        key: "role"
      },
      {
        title: "创建时间",
        dataIndex: "created_at",
        key: "created_at",
        render: (k) => new Date(k).toLocaleString("zh-CN")
      },
      {
        title: "操作",
        key: "action",
        width: 180,
        render: (k, l) => /* @__PURE__ */ Y.jsxs(ae, { children: [
          /* @__PURE__ */ Y.jsx(
            G,
            {
              type: "link",
              icon: /* @__PURE__ */ Y.jsx(pe, {}),
              onClick: () => Ee(l),
              children: "编辑"
            }
          ),
          /* @__PURE__ */ Y.jsx(
            G,
            {
              type: "link",
              danger: !0,
              icon: /* @__PURE__ */ Y.jsx(Ce, {}),
              onClick: () => ee(l.id),
              children: "删除"
            }
          )
        ] })
      }
    ];
    return /* @__PURE__ */ Y.jsxs(ae, { children: [
      /* @__PURE__ */ Y.jsx("div", { style: { marginBottom: 16, textAlign: "right" }, children: /* @__PURE__ */ Y.jsx(G, { type: "primary", icon: /* @__PURE__ */ Y.jsx(Q, {}), onClick: ke, children: "新建用户" }) }),
      /* @__PURE__ */ Y.jsx(
        se,
        {
          columns: K,
          dataSource: le,
          rowKey: "id",
          loading: he,
          bordered: !0
        }
      ),
      /* @__PURE__ */ Y.jsx(
        F,
        {
          title: Z ? "编辑用户" : "新建用户",
          open: N,
          onOk: re,
          onCancel: () => {
            $(!1), ie.resetFields();
          },
          okText: "确定",
          cancelText: "取消",
          children: /* @__PURE__ */ Y.jsxs(q, { form: ie, layout: "vertical", children: [
            /* @__PURE__ */ Y.jsx(
              q.Item,
              {
                label: "姓名",
                name: "name",
                rules: [{ required: !0, message: "请输入姓名" }],
                children: /* @__PURE__ */ Y.jsx(A, { placeholder: "请输入姓名" })
              }
            ),
            /* @__PURE__ */ Y.jsx(
              q.Item,
              {
                label: "邮箱",
                name: "email",
                rules: [
                  { required: !0, message: "请输入邮箱" },
                  { type: "email", message: "请输入有效的邮箱地址" }
                ],
                children: /* @__PURE__ */ Y.jsx(A, { placeholder: "请输入邮箱" })
              }
            ),
            /* @__PURE__ */ Y.jsx(
              q.Item,
              {
                label: "角色",
                name: "role",
                rules: [{ required: !0, message: "请选择角色" }],
                children: /* @__PURE__ */ Y.jsxs(U, { placeholder: "请选择角色", children: [
                  /* @__PURE__ */ Y.jsx(U.Option, { value: "管理员", children: "管理员" }),
                  /* @__PURE__ */ Y.jsx(U.Option, { value: "用户", children: "用户" }),
                  /* @__PURE__ */ Y.jsx(U.Option, { value: "访客", children: "访客" })
                ] })
              }
            )
          ] })
        }
      )
    ] });
  }
  return ce;
}
export {
  zt as default
};
