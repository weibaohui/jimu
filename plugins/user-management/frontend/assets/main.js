import * as A from "react";
import fe, { createContext as fr, useContext as dr, useEffect as mt, useState as ue } from "react";
import { Form as Q, Button as Ce, Table as hr, Modal as vr, Input as rt, Select as le, message as V } from "antd";
function gr(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Ee = { exports: {} }, Z = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nt;
function mr() {
  if (nt) return Z;
  nt = 1;
  var r = fe, e = Symbol.for("react.element"), n = Symbol.for("react.fragment"), i = Object.prototype.hasOwnProperty, a = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, s = { key: !0, ref: !0, __self: !0, __source: !0 };
  function l(f, c, d) {
    var v, g = {}, w = null, I = null;
    d !== void 0 && (w = "" + d), c.key !== void 0 && (w = "" + c.key), c.ref !== void 0 && (I = c.ref);
    for (v in c) i.call(c, v) && !s.hasOwnProperty(v) && (g[v] = c[v]);
    if (f && f.defaultProps) for (v in c = f.defaultProps, c) g[v] === void 0 && (g[v] = c[v]);
    return { $$typeof: e, type: f, key: w, ref: I, props: g, _owner: a.current };
  }
  return Z.Fragment = n, Z.jsx = l, Z.jsxs = l, Z;
}
var ee = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var it;
function pr() {
  return it || (it = 1, process.env.NODE_ENV !== "production" && function() {
    var r = fe, e = Symbol.for("react.element"), n = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), a = Symbol.for("react.strict_mode"), s = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), f = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), v = Symbol.for("react.suspense_list"), g = Symbol.for("react.memo"), w = Symbol.for("react.lazy"), I = Symbol.for("react.offscreen"), Y = Symbol.iterator, _ = "@@iterator";
    function j(t) {
      if (t === null || typeof t != "object")
        return null;
      var o = Y && t[Y] || t[_];
      return typeof o == "function" ? o : null;
    }
    var M = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function C(t) {
      {
        for (var o = arguments.length, u = new Array(o > 1 ? o - 1 : 0), h = 1; h < o; h++)
          u[h - 1] = arguments[h];
        $("error", t, u);
      }
    }
    function $(t, o, u) {
      {
        var h = M.ReactDebugCurrentFrame, y = h.getStackAddendum();
        y !== "" && (o += "%s", u = u.concat([y]));
        var b = u.map(function(p) {
          return String(p);
        });
        b.unshift("Warning: " + o), Function.prototype.apply.call(console[t], console, b);
      }
    }
    var F = !1, ne = !1, At = !1, It = !1, Dt = !1, ke;
    ke = Symbol.for("react.module.reference");
    function Nt(t) {
      return !!(typeof t == "string" || typeof t == "function" || t === i || t === s || Dt || t === a || t === d || t === v || It || t === I || F || ne || At || typeof t == "object" && t !== null && (t.$$typeof === w || t.$$typeof === g || t.$$typeof === l || t.$$typeof === f || t.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      t.$$typeof === ke || t.getModuleId !== void 0));
    }
    function $t(t, o, u) {
      var h = t.displayName;
      if (h)
        return h;
      var y = o.displayName || o.name || "";
      return y !== "" ? u + "(" + y + ")" : u;
    }
    function Me(t) {
      return t.displayName || "Context";
    }
    function N(t) {
      if (t == null)
        return null;
      if (typeof t.tag == "number" && C("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof t == "function")
        return t.displayName || t.name || null;
      if (typeof t == "string")
        return t;
      switch (t) {
        case i:
          return "Fragment";
        case n:
          return "Portal";
        case s:
          return "Profiler";
        case a:
          return "StrictMode";
        case d:
          return "Suspense";
        case v:
          return "SuspenseList";
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case f:
            var o = t;
            return Me(o) + ".Consumer";
          case l:
            var u = t;
            return Me(u._context) + ".Provider";
          case c:
            return $t(t, t.render, "ForwardRef");
          case g:
            var h = t.displayName || null;
            return h !== null ? h : N(t.type) || "Memo";
          case w: {
            var y = t, b = y._payload, p = y._init;
            try {
              return N(p(b));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var H = Object.assign, G = 0, Ae, Ie, De, Ne, $e, Fe, He;
    function Le() {
    }
    Le.__reactDisabledLog = !0;
    function Ft() {
      {
        if (G === 0) {
          Ae = console.log, Ie = console.info, De = console.warn, Ne = console.error, $e = console.group, Fe = console.groupCollapsed, He = console.groupEnd;
          var t = {
            configurable: !0,
            enumerable: !0,
            value: Le,
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
        G++;
      }
    }
    function Ht() {
      {
        if (G--, G === 0) {
          var t = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: H({}, t, {
              value: Ae
            }),
            info: H({}, t, {
              value: Ie
            }),
            warn: H({}, t, {
              value: De
            }),
            error: H({}, t, {
              value: Ne
            }),
            group: H({}, t, {
              value: $e
            }),
            groupCollapsed: H({}, t, {
              value: Fe
            }),
            groupEnd: H({}, t, {
              value: He
            })
          });
        }
        G < 0 && C("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var he = M.ReactCurrentDispatcher, ve;
    function ie(t, o, u) {
      {
        if (ve === void 0)
          try {
            throw Error();
          } catch (y) {
            var h = y.stack.trim().match(/\n( *(at )?)/);
            ve = h && h[1] || "";
          }
        return `
` + ve + t;
      }
    }
    var ge = !1, ae;
    {
      var Lt = typeof WeakMap == "function" ? WeakMap : Map;
      ae = new Lt();
    }
    function Ve(t, o) {
      if (!t || ge)
        return "";
      {
        var u = ae.get(t);
        if (u !== void 0)
          return u;
      }
      var h;
      ge = !0;
      var y = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var b;
      b = he.current, he.current = null, Ft();
      try {
        if (o) {
          var p = function() {
            throw Error();
          };
          if (Object.defineProperty(p.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(p, []);
            } catch (P) {
              h = P;
            }
            Reflect.construct(t, [], p);
          } else {
            try {
              p.call();
            } catch (P) {
              h = P;
            }
            t.call(p.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (P) {
            h = P;
          }
          t();
        }
      } catch (P) {
        if (P && h && typeof P.stack == "string") {
          for (var m = P.stack.split(`
`), O = h.stack.split(`
`), x = m.length - 1, S = O.length - 1; x >= 1 && S >= 0 && m[x] !== O[S]; )
            S--;
          for (; x >= 1 && S >= 0; x--, S--)
            if (m[x] !== O[S]) {
              if (x !== 1 || S !== 1)
                do
                  if (x--, S--, S < 0 || m[x] !== O[S]) {
                    var k = `
` + m[x].replace(" at new ", " at ");
                    return t.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", t.displayName)), typeof t == "function" && ae.set(t, k), k;
                  }
                while (x >= 1 && S >= 0);
              break;
            }
        }
      } finally {
        ge = !1, he.current = b, Ht(), Error.prepareStackTrace = y;
      }
      var B = t ? t.displayName || t.name : "", L = B ? ie(B) : "";
      return typeof t == "function" && ae.set(t, L), L;
    }
    function Vt(t, o, u) {
      return Ve(t, !1);
    }
    function Wt(t) {
      var o = t.prototype;
      return !!(o && o.isReactComponent);
    }
    function oe(t, o, u) {
      if (t == null)
        return "";
      if (typeof t == "function")
        return Ve(t, Wt(t));
      if (typeof t == "string")
        return ie(t);
      switch (t) {
        case d:
          return ie("Suspense");
        case v:
          return ie("SuspenseList");
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case c:
            return Vt(t.render);
          case g:
            return oe(t.type, o, u);
          case w: {
            var h = t, y = h._payload, b = h._init;
            try {
              return oe(b(y), o, u);
            } catch {
            }
          }
        }
      return "";
    }
    var X = Object.prototype.hasOwnProperty, We = {}, Ye = M.ReactDebugCurrentFrame;
    function se(t) {
      if (t) {
        var o = t._owner, u = oe(t.type, t._source, o ? o.type : null);
        Ye.setExtraStackFrame(u);
      } else
        Ye.setExtraStackFrame(null);
    }
    function Yt(t, o, u, h, y) {
      {
        var b = Function.call.bind(X);
        for (var p in t)
          if (b(t, p)) {
            var m = void 0;
            try {
              if (typeof t[p] != "function") {
                var O = Error((h || "React class") + ": " + u + " type `" + p + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof t[p] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw O.name = "Invariant Violation", O;
              }
              m = t[p](o, p, h, u, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (x) {
              m = x;
            }
            m && !(m instanceof Error) && (se(y), C("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", h || "React class", u, p, typeof m), se(null)), m instanceof Error && !(m.message in We) && (We[m.message] = !0, se(y), C("Failed %s type: %s", u, m.message), se(null));
          }
      }
    }
    var Ut = Array.isArray;
    function me(t) {
      return Ut(t);
    }
    function Bt(t) {
      {
        var o = typeof Symbol == "function" && Symbol.toStringTag, u = o && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return u;
      }
    }
    function qt(t) {
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
      if (qt(t))
        return C("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Bt(t)), Ue(t);
    }
    var qe = M.ReactCurrentOwner, zt = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ze, Ke;
    function Kt(t) {
      if (X.call(t, "ref")) {
        var o = Object.getOwnPropertyDescriptor(t, "ref").get;
        if (o && o.isReactWarning)
          return !1;
      }
      return t.ref !== void 0;
    }
    function Jt(t) {
      if (X.call(t, "key")) {
        var o = Object.getOwnPropertyDescriptor(t, "key").get;
        if (o && o.isReactWarning)
          return !1;
      }
      return t.key !== void 0;
    }
    function Gt(t, o) {
      typeof t.ref == "string" && qe.current;
    }
    function Xt(t, o) {
      {
        var u = function() {
          ze || (ze = !0, C("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", o));
        };
        u.isReactWarning = !0, Object.defineProperty(t, "key", {
          get: u,
          configurable: !0
        });
      }
    }
    function Qt(t, o) {
      {
        var u = function() {
          Ke || (Ke = !0, C("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", o));
        };
        u.isReactWarning = !0, Object.defineProperty(t, "ref", {
          get: u,
          configurable: !0
        });
      }
    }
    var Zt = function(t, o, u, h, y, b, p) {
      var m = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: e,
        // Built-in properties that belong on the element
        type: t,
        key: o,
        ref: u,
        props: p,
        // Record the component responsible for creating this element.
        _owner: b
      };
      return m._store = {}, Object.defineProperty(m._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(m, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: h
      }), Object.defineProperty(m, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: y
      }), Object.freeze && (Object.freeze(m.props), Object.freeze(m)), m;
    };
    function er(t, o, u, h, y) {
      {
        var b, p = {}, m = null, O = null;
        u !== void 0 && (Be(u), m = "" + u), Jt(o) && (Be(o.key), m = "" + o.key), Kt(o) && (O = o.ref, Gt(o, y));
        for (b in o)
          X.call(o, b) && !zt.hasOwnProperty(b) && (p[b] = o[b]);
        if (t && t.defaultProps) {
          var x = t.defaultProps;
          for (b in x)
            p[b] === void 0 && (p[b] = x[b]);
        }
        if (m || O) {
          var S = typeof t == "function" ? t.displayName || t.name || "Unknown" : t;
          m && Xt(p, S), O && Qt(p, S);
        }
        return Zt(t, m, O, y, h, qe.current, p);
      }
    }
    var pe = M.ReactCurrentOwner, Je = M.ReactDebugCurrentFrame;
    function U(t) {
      if (t) {
        var o = t._owner, u = oe(t.type, t._source, o ? o.type : null);
        Je.setExtraStackFrame(u);
      } else
        Je.setExtraStackFrame(null);
    }
    var ye;
    ye = !1;
    function be(t) {
      return typeof t == "object" && t !== null && t.$$typeof === e;
    }
    function Ge() {
      {
        if (pe.current) {
          var t = N(pe.current.type);
          if (t)
            return `

Check the render method of \`` + t + "`.";
        }
        return "";
      }
    }
    function tr(t) {
      return "";
    }
    var Xe = {};
    function rr(t) {
      {
        var o = Ge();
        if (!o) {
          var u = typeof t == "string" ? t : t.displayName || t.name;
          u && (o = `

Check the top-level render call using <` + u + ">.");
        }
        return o;
      }
    }
    function Qe(t, o) {
      {
        if (!t._store || t._store.validated || t.key != null)
          return;
        t._store.validated = !0;
        var u = rr(o);
        if (Xe[u])
          return;
        Xe[u] = !0;
        var h = "";
        t && t._owner && t._owner !== pe.current && (h = " It was passed a child from " + N(t._owner.type) + "."), U(t), C('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', u, h), U(null);
      }
    }
    function Ze(t, o) {
      {
        if (typeof t != "object")
          return;
        if (me(t))
          for (var u = 0; u < t.length; u++) {
            var h = t[u];
            be(h) && Qe(h, o);
          }
        else if (be(t))
          t._store && (t._store.validated = !0);
        else if (t) {
          var y = j(t);
          if (typeof y == "function" && y !== t.entries)
            for (var b = y.call(t), p; !(p = b.next()).done; )
              be(p.value) && Qe(p.value, o);
        }
      }
    }
    function nr(t) {
      {
        var o = t.type;
        if (o == null || typeof o == "string")
          return;
        var u;
        if (typeof o == "function")
          u = o.propTypes;
        else if (typeof o == "object" && (o.$$typeof === c || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        o.$$typeof === g))
          u = o.propTypes;
        else
          return;
        if (u) {
          var h = N(o);
          Yt(u, t.props, "prop", h, t);
        } else if (o.PropTypes !== void 0 && !ye) {
          ye = !0;
          var y = N(o);
          C("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", y || "Unknown");
        }
        typeof o.getDefaultProps == "function" && !o.getDefaultProps.isReactClassApproved && C("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ir(t) {
      {
        for (var o = Object.keys(t.props), u = 0; u < o.length; u++) {
          var h = o[u];
          if (h !== "children" && h !== "key") {
            U(t), C("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", h), U(null);
            break;
          }
        }
        t.ref !== null && (U(t), C("Invalid attribute `ref` supplied to `React.Fragment`."), U(null));
      }
    }
    var et = {};
    function tt(t, o, u, h, y, b) {
      {
        var p = Nt(t);
        if (!p) {
          var m = "";
          (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (m += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var O = tr();
          O ? m += O : m += Ge();
          var x;
          t === null ? x = "null" : me(t) ? x = "array" : t !== void 0 && t.$$typeof === e ? (x = "<" + (N(t.type) || "Unknown") + " />", m = " Did you accidentally export a JSX literal instead of a component?") : x = typeof t, C("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", x, m);
        }
        var S = er(t, o, u, y, b);
        if (S == null)
          return S;
        if (p) {
          var k = o.children;
          if (k !== void 0)
            if (h)
              if (me(k)) {
                for (var B = 0; B < k.length; B++)
                  Ze(k[B], t);
                Object.freeze && Object.freeze(k);
              } else
                C("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ze(k, t);
        }
        if (X.call(o, "key")) {
          var L = N(t), P = Object.keys(o).filter(function(cr) {
            return cr !== "key";
          }), _e = P.length > 0 ? "{key: someKey, " + P.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!et[L + _e]) {
            var lr = P.length > 0 ? "{" + P.join(": ..., ") + ": ...}" : "{}";
            C(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, _e, L, lr, L), et[L + _e] = !0;
          }
        }
        return t === i ? ir(S) : nr(S), S;
      }
    }
    function ar(t, o, u) {
      return tt(t, o, u, !0);
    }
    function or(t, o, u) {
      return tt(t, o, u, !1);
    }
    var sr = or, ur = ar;
    ee.Fragment = i, ee.jsx = sr, ee.jsxs = ur;
  }()), ee;
}
process.env.NODE_ENV === "production" ? Ee.exports = mr() : Ee.exports = pr();
var E = Ee.exports, pt = /* @__PURE__ */ fr({});
function z() {
  return z = Object.assign ? Object.assign.bind() : function(r) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var i in n) ({}).hasOwnProperty.call(n, i) && (r[i] = n[i]);
    }
    return r;
  }, z.apply(null, arguments);
}
function yr(r) {
  if (Array.isArray(r)) return r;
}
function br(r, e) {
  var n = r == null ? null : typeof Symbol < "u" && r[Symbol.iterator] || r["@@iterator"];
  if (n != null) {
    var i, a, s, l, f = [], c = !0, d = !1;
    try {
      if (s = (n = n.call(r)).next, e !== 0) for (; !(c = (i = s.call(n)).done) && (f.push(i.value), f.length !== e); c = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!c && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return f;
  }
}
function at(r, e) {
  (e == null || e > r.length) && (e = r.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = r[n];
  return i;
}
function _r(r, e) {
  if (r) {
    if (typeof r == "string") return at(r, e);
    var n = {}.toString.call(r).slice(8, -1);
    return n === "Object" && r.constructor && (n = r.constructor.name), n === "Map" || n === "Set" ? Array.from(r) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? at(r, e) : void 0;
  }
}
function Cr() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function yt(r, e) {
  return yr(r) || br(r, e) || _r(r, e) || Cr();
}
function W(r) {
  "@babel/helpers - typeof";
  return W = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, W(r);
}
function xr(r, e) {
  if (W(r) != "object" || !r) return r;
  var n = r[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(r, e);
    if (W(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(r);
}
function Er(r) {
  var e = xr(r, "string");
  return W(e) == "symbol" ? e : e + "";
}
function T(r, e, n) {
  return (e = Er(e)) in r ? Object.defineProperty(r, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : r[e] = n, r;
}
function wr(r, e) {
  if (r == null) return {};
  var n = {};
  for (var i in r) if ({}.hasOwnProperty.call(r, i)) {
    if (e.indexOf(i) !== -1) continue;
    n[i] = r[i];
  }
  return n;
}
function bt(r, e) {
  if (r == null) return {};
  var n, i, a = wr(r, e);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(r);
    for (i = 0; i < s.length; i++) n = s[i], e.indexOf(n) === -1 && {}.propertyIsEnumerable.call(r, n) && (a[n] = r[n]);
  }
  return a;
}
var _t = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
(function(r) {
  (function() {
    var e = {}.hasOwnProperty;
    function n() {
      for (var s = "", l = 0; l < arguments.length; l++) {
        var f = arguments[l];
        f && (s = a(s, i(f)));
      }
      return s;
    }
    function i(s) {
      if (typeof s == "string" || typeof s == "number")
        return s;
      if (typeof s != "object")
        return "";
      if (Array.isArray(s))
        return n.apply(null, s);
      if (s.toString !== Object.prototype.toString && !s.toString.toString().includes("[native code]"))
        return s.toString();
      var l = "";
      for (var f in s)
        e.call(s, f) && s[f] && (l = a(l, f));
      return l;
    }
    function a(s, l) {
      return l ? s ? s + " " + l : s + l : s;
    }
    r.exports ? (n.default = n, r.exports = n) : window.classNames = n;
  })();
})(_t);
var Sr = _t.exports;
const Rr = /* @__PURE__ */ gr(Sr), R = Math.round;
function xe(r, e) {
  const n = r.replace(/^[^(]*\((.*)/, "$1").replace(/\).*/, "").match(/\d*\.?\d+%?/g) || [], i = n.map((a) => parseFloat(a));
  for (let a = 0; a < 3; a += 1)
    i[a] = e(i[a] || 0, n[a] || "", a);
  return n[3] ? i[3] = n[3].includes("%") ? i[3] / 100 : i[3] : i[3] = 1, i;
}
const ot = (r, e, n) => n === 0 ? r : r / 100;
function te(r, e) {
  const n = e || 255;
  return r > n ? n : r < 0 ? 0 : r;
}
class q {
  constructor(e) {
    T(this, "isValid", !0), T(this, "r", 0), T(this, "g", 0), T(this, "b", 0), T(this, "a", 1), T(this, "_h", void 0), T(this, "_s", void 0), T(this, "_l", void 0), T(this, "_v", void 0), T(this, "_max", void 0), T(this, "_min", void 0), T(this, "_brightness", void 0);
    function n(i) {
      return i[0] in e && i[1] in e && i[2] in e;
    }
    if (e) if (typeof e == "string") {
      let a = function(s) {
        return i.startsWith(s);
      };
      const i = e.trim();
      /^#?[A-F\d]{3,8}$/i.test(i) ? this.fromHexString(i) : a("rgb") ? this.fromRgbString(i) : a("hsl") ? this.fromHslString(i) : (a("hsv") || a("hsb")) && this.fromHsvString(i);
    } else if (e instanceof q)
      this.r = e.r, this.g = e.g, this.b = e.b, this.a = e.a, this._h = e._h, this._s = e._s, this._l = e._l, this._v = e._v;
    else if (n("rgb"))
      this.r = te(e.r), this.g = te(e.g), this.b = te(e.b), this.a = typeof e.a == "number" ? te(e.a, 1) : 1;
    else if (n("hsl"))
      this.fromHsl(e);
    else if (n("hsv"))
      this.fromHsv(e);
    else
      throw new Error("@ant-design/fast-color: unsupported input " + JSON.stringify(e));
  }
  // ======================= Setter =======================
  setR(e) {
    return this._sc("r", e);
  }
  setG(e) {
    return this._sc("g", e);
  }
  setB(e) {
    return this._sc("b", e);
  }
  setA(e) {
    return this._sc("a", e, 1);
  }
  setHue(e) {
    const n = this.toHsv();
    return n.h = e, this._c(n);
  }
  // ======================= Getter =======================
  /**
   * Returns the perceived luminance of a color, from 0-1.
   * @see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   */
  getLuminance() {
    function e(s) {
      const l = s / 255;
      return l <= 0.03928 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4);
    }
    const n = e(this.r), i = e(this.g), a = e(this.b);
    return 0.2126 * n + 0.7152 * i + 0.0722 * a;
  }
  getHue() {
    if (typeof this._h > "u") {
      const e = this.getMax() - this.getMin();
      e === 0 ? this._h = 0 : this._h = R(60 * (this.r === this.getMax() ? (this.g - this.b) / e + (this.g < this.b ? 6 : 0) : this.g === this.getMax() ? (this.b - this.r) / e + 2 : (this.r - this.g) / e + 4));
    }
    return this._h;
  }
  getSaturation() {
    if (typeof this._s > "u") {
      const e = this.getMax() - this.getMin();
      e === 0 ? this._s = 0 : this._s = e / this.getMax();
    }
    return this._s;
  }
  getLightness() {
    return typeof this._l > "u" && (this._l = (this.getMax() + this.getMin()) / 510), this._l;
  }
  getValue() {
    return typeof this._v > "u" && (this._v = this.getMax() / 255), this._v;
  }
  /**
   * Returns the perceived brightness of the color, from 0-255.
   * Note: this is not the b of HSB
   * @see http://www.w3.org/TR/AERT#color-contrast
   */
  getBrightness() {
    return typeof this._brightness > "u" && (this._brightness = (this.r * 299 + this.g * 587 + this.b * 114) / 1e3), this._brightness;
  }
  // ======================== Func ========================
  darken(e = 10) {
    const n = this.getHue(), i = this.getSaturation();
    let a = this.getLightness() - e / 100;
    return a < 0 && (a = 0), this._c({
      h: n,
      s: i,
      l: a,
      a: this.a
    });
  }
  lighten(e = 10) {
    const n = this.getHue(), i = this.getSaturation();
    let a = this.getLightness() + e / 100;
    return a > 1 && (a = 1), this._c({
      h: n,
      s: i,
      l: a,
      a: this.a
    });
  }
  /**
   * Mix the current color a given amount with another color, from 0 to 100.
   * 0 means no mixing (return current color).
   */
  mix(e, n = 50) {
    const i = this._c(e), a = n / 100, s = (f) => (i[f] - this[f]) * a + this[f], l = {
      r: R(s("r")),
      g: R(s("g")),
      b: R(s("b")),
      a: R(s("a") * 100) / 100
    };
    return this._c(l);
  }
  /**
   * Mix the color with pure white, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return white.
   */
  tint(e = 10) {
    return this.mix({
      r: 255,
      g: 255,
      b: 255,
      a: 1
    }, e);
  }
  /**
   * Mix the color with pure black, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return black.
   */
  shade(e = 10) {
    return this.mix({
      r: 0,
      g: 0,
      b: 0,
      a: 1
    }, e);
  }
  onBackground(e) {
    const n = this._c(e), i = this.a + n.a * (1 - this.a), a = (s) => R((this[s] * this.a + n[s] * n.a * (1 - this.a)) / i);
    return this._c({
      r: a("r"),
      g: a("g"),
      b: a("b"),
      a: i
    });
  }
  // ======================= Status =======================
  isDark() {
    return this.getBrightness() < 128;
  }
  isLight() {
    return this.getBrightness() >= 128;
  }
  // ======================== MISC ========================
  equals(e) {
    return this.r === e.r && this.g === e.g && this.b === e.b && this.a === e.a;
  }
  clone() {
    return this._c(this);
  }
  // ======================= Format =======================
  toHexString() {
    let e = "#";
    const n = (this.r || 0).toString(16);
    e += n.length === 2 ? n : "0" + n;
    const i = (this.g || 0).toString(16);
    e += i.length === 2 ? i : "0" + i;
    const a = (this.b || 0).toString(16);
    if (e += a.length === 2 ? a : "0" + a, typeof this.a == "number" && this.a >= 0 && this.a < 1) {
      const s = R(this.a * 255).toString(16);
      e += s.length === 2 ? s : "0" + s;
    }
    return e;
  }
  /** CSS support color pattern */
  toHsl() {
    return {
      h: this.getHue(),
      s: this.getSaturation(),
      l: this.getLightness(),
      a: this.a
    };
  }
  /** CSS support color pattern */
  toHslString() {
    const e = this.getHue(), n = R(this.getSaturation() * 100), i = R(this.getLightness() * 100);
    return this.a !== 1 ? `hsla(${e},${n}%,${i}%,${this.a})` : `hsl(${e},${n}%,${i}%)`;
  }
  /** Same as toHsb */
  toHsv() {
    return {
      h: this.getHue(),
      s: this.getSaturation(),
      v: this.getValue(),
      a: this.a
    };
  }
  toRgb() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a
    };
  }
  toRgbString() {
    return this.a !== 1 ? `rgba(${this.r},${this.g},${this.b},${this.a})` : `rgb(${this.r},${this.g},${this.b})`;
  }
  toString() {
    return this.toRgbString();
  }
  // ====================== Privates ======================
  /** Return a new FastColor object with one channel changed */
  _sc(e, n, i) {
    const a = this.clone();
    return a[e] = te(n, i), a;
  }
  _c(e) {
    return new this.constructor(e);
  }
  getMax() {
    return typeof this._max > "u" && (this._max = Math.max(this.r, this.g, this.b)), this._max;
  }
  getMin() {
    return typeof this._min > "u" && (this._min = Math.min(this.r, this.g, this.b)), this._min;
  }
  fromHexString(e) {
    const n = e.replace("#", "");
    function i(a, s) {
      return parseInt(n[a] + n[s || a], 16);
    }
    n.length < 6 ? (this.r = i(0), this.g = i(1), this.b = i(2), this.a = n[3] ? i(3) / 255 : 1) : (this.r = i(0, 1), this.g = i(2, 3), this.b = i(4, 5), this.a = n[6] ? i(6, 7) / 255 : 1);
  }
  fromHsl({
    h: e,
    s: n,
    l: i,
    a
  }) {
    if (this._h = e % 360, this._s = n, this._l = i, this.a = typeof a == "number" ? a : 1, n <= 0) {
      const w = R(i * 255);
      this.r = w, this.g = w, this.b = w;
    }
    let s = 0, l = 0, f = 0;
    const c = e / 60, d = (1 - Math.abs(2 * i - 1)) * n, v = d * (1 - Math.abs(c % 2 - 1));
    c >= 0 && c < 1 ? (s = d, l = v) : c >= 1 && c < 2 ? (s = v, l = d) : c >= 2 && c < 3 ? (l = d, f = v) : c >= 3 && c < 4 ? (l = v, f = d) : c >= 4 && c < 5 ? (s = v, f = d) : c >= 5 && c < 6 && (s = d, f = v);
    const g = i - d / 2;
    this.r = R((s + g) * 255), this.g = R((l + g) * 255), this.b = R((f + g) * 255);
  }
  fromHsv({
    h: e,
    s: n,
    v: i,
    a
  }) {
    this._h = e % 360, this._s = n, this._v = i, this.a = typeof a == "number" ? a : 1;
    const s = R(i * 255);
    if (this.r = s, this.g = s, this.b = s, n <= 0)
      return;
    const l = e / 60, f = Math.floor(l), c = l - f, d = R(i * (1 - n) * 255), v = R(i * (1 - n * c) * 255), g = R(i * (1 - n * (1 - c)) * 255);
    switch (f) {
      case 0:
        this.g = g, this.b = d;
        break;
      case 1:
        this.r = v, this.b = d;
        break;
      case 2:
        this.r = d, this.b = g;
        break;
      case 3:
        this.r = d, this.g = v;
        break;
      case 4:
        this.r = g, this.g = d;
        break;
      case 5:
      default:
        this.g = d, this.b = v;
        break;
    }
  }
  fromHsvString(e) {
    const n = xe(e, ot);
    this.fromHsv({
      h: n[0],
      s: n[1],
      v: n[2],
      a: n[3]
    });
  }
  fromHslString(e) {
    const n = xe(e, ot);
    this.fromHsl({
      h: n[0],
      s: n[1],
      l: n[2],
      a: n[3]
    });
  }
  fromRgbString(e) {
    const n = xe(e, (i, a) => (
      // Convert percentage to number. e.g. 50% -> 128
      a.includes("%") ? R(i / 100 * 255) : i
    ));
    this.r = n[0], this.g = n[1], this.b = n[2], this.a = n[3];
  }
}
var ce = 2, st = 0.16, Or = 0.05, Tr = 0.05, jr = 0.15, Ct = 5, xt = 4, Pr = [{
  index: 7,
  amount: 15
}, {
  index: 6,
  amount: 25
}, {
  index: 5,
  amount: 30
}, {
  index: 5,
  amount: 45
}, {
  index: 5,
  amount: 65
}, {
  index: 5,
  amount: 85
}, {
  index: 4,
  amount: 90
}, {
  index: 3,
  amount: 95
}, {
  index: 2,
  amount: 97
}, {
  index: 1,
  amount: 98
}];
function ut(r, e, n) {
  var i;
  return Math.round(r.h) >= 60 && Math.round(r.h) <= 240 ? i = n ? Math.round(r.h) - ce * e : Math.round(r.h) + ce * e : i = n ? Math.round(r.h) + ce * e : Math.round(r.h) - ce * e, i < 0 ? i += 360 : i >= 360 && (i -= 360), i;
}
function lt(r, e, n) {
  if (r.h === 0 && r.s === 0)
    return r.s;
  var i;
  return n ? i = r.s - st * e : e === xt ? i = r.s + st : i = r.s + Or * e, i > 1 && (i = 1), n && e === Ct && i > 0.1 && (i = 0.1), i < 0.06 && (i = 0.06), Math.round(i * 100) / 100;
}
function ct(r, e, n) {
  var i;
  return n ? i = r.v + Tr * e : i = r.v - jr * e, i = Math.max(0, Math.min(1, i)), Math.round(i * 100) / 100;
}
function kr(r) {
  for (var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = [], i = new q(r), a = i.toHsv(), s = Ct; s > 0; s -= 1) {
    var l = new q({
      h: ut(a, s, !0),
      s: lt(a, s, !0),
      v: ct(a, s, !0)
    });
    n.push(l);
  }
  n.push(i);
  for (var f = 1; f <= xt; f += 1) {
    var c = new q({
      h: ut(a, f),
      s: lt(a, f),
      v: ct(a, f)
    });
    n.push(c);
  }
  return e.theme === "dark" ? Pr.map(function(d) {
    var v = d.index, g = d.amount;
    return new q(e.backgroundColor || "#141414").mix(n[v], g).toHexString();
  }) : n.map(function(d) {
    return d.toHexString();
  });
}
var we = ["#e6f4ff", "#bae0ff", "#91caff", "#69b1ff", "#4096ff", "#1677ff", "#0958d9", "#003eb3", "#002c8c", "#001d66"];
we.primary = we[5];
function ft(r, e) {
  var n = Object.keys(r);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(r);
    e && (i = i.filter(function(a) {
      return Object.getOwnPropertyDescriptor(r, a).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function D(r) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ft(Object(n), !0).forEach(function(i) {
      T(r, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(n)) : ft(Object(n)).forEach(function(i) {
      Object.defineProperty(r, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return r;
}
function Mr() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Ar(r, e) {
  if (!r)
    return !1;
  if (r.contains)
    return r.contains(e);
  for (var n = e; n; ) {
    if (n === r)
      return !0;
    n = n.parentNode;
  }
  return !1;
}
var dt = "data-rc-order", ht = "data-rc-priority", Ir = "rc-util-key", Se = /* @__PURE__ */ new Map();
function Et() {
  var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, e = r.mark;
  return e ? e.startsWith("data-") ? e : "data-".concat(e) : Ir;
}
function Te(r) {
  if (r.attachTo)
    return r.attachTo;
  var e = document.querySelector("head");
  return e || document.body;
}
function Dr(r) {
  return r === "queue" ? "prependQueue" : r ? "prepend" : "append";
}
function je(r) {
  return Array.from((Se.get(r) || r).children).filter(function(e) {
    return e.tagName === "STYLE";
  });
}
function wt(r) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (!Mr())
    return null;
  var n = e.csp, i = e.prepend, a = e.priority, s = a === void 0 ? 0 : a, l = Dr(i), f = l === "prependQueue", c = document.createElement("style");
  c.setAttribute(dt, l), f && s && c.setAttribute(ht, "".concat(s)), n != null && n.nonce && (c.nonce = n == null ? void 0 : n.nonce), c.innerHTML = r;
  var d = Te(e), v = d.firstChild;
  if (i) {
    if (f) {
      var g = (e.styles || je(d)).filter(function(w) {
        if (!["prepend", "prependQueue"].includes(w.getAttribute(dt)))
          return !1;
        var I = Number(w.getAttribute(ht) || 0);
        return s >= I;
      });
      if (g.length)
        return d.insertBefore(c, g[g.length - 1].nextSibling), c;
    }
    d.insertBefore(c, v);
  } else
    d.appendChild(c);
  return c;
}
function Nr(r) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = Te(e);
  return (e.styles || je(n)).find(function(i) {
    return i.getAttribute(Et(e)) === r;
  });
}
function $r(r, e) {
  var n = Se.get(r);
  if (!n || !Ar(document, n)) {
    var i = wt("", e), a = i.parentNode;
    Se.set(r, a), r.removeChild(i);
  }
}
function Fr(r, e) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = Te(n), a = je(i), s = D(D({}, n), {}, {
    styles: a
  });
  $r(i, s);
  var l = Nr(e, s);
  if (l) {
    var f, c;
    if ((f = s.csp) !== null && f !== void 0 && f.nonce && l.nonce !== ((c = s.csp) === null || c === void 0 ? void 0 : c.nonce)) {
      var d;
      l.nonce = (d = s.csp) === null || d === void 0 ? void 0 : d.nonce;
    }
    return l.innerHTML !== r && (l.innerHTML = r), l;
  }
  var v = wt(r, s);
  return v.setAttribute(Et(s), e), v;
}
function St(r) {
  var e;
  return r == null || (e = r.getRootNode) === null || e === void 0 ? void 0 : e.call(r);
}
function Hr(r) {
  return St(r) instanceof ShadowRoot;
}
function Lr(r) {
  return Hr(r) ? St(r) : null;
}
var Re = {}, Pe = [], Vr = function(e) {
  Pe.push(e);
};
function Wr(r, e) {
  if (process.env.NODE_ENV !== "production" && !r && console !== void 0) {
    var n = Pe.reduce(function(i, a) {
      return a(i ?? "", "warning");
    }, e);
    n && console.error("Warning: ".concat(n));
  }
}
function Yr(r, e) {
  if (process.env.NODE_ENV !== "production" && !r && console !== void 0) {
    var n = Pe.reduce(function(i, a) {
      return a(i ?? "", "note");
    }, e);
    n && console.warn("Note: ".concat(n));
  }
}
function Ur() {
  Re = {};
}
function Rt(r, e, n) {
  !e && !Re[n] && (r(!1, n), Re[n] = !0);
}
function de(r, e) {
  Rt(Wr, r, e);
}
function Br(r, e) {
  Rt(Yr, r, e);
}
de.preMessage = Vr;
de.resetWarned = Ur;
de.noteOnce = Br;
function qr(r) {
  return r.replace(/-(.)/g, function(e, n) {
    return n.toUpperCase();
  });
}
function zr(r, e) {
  de(r, "[@ant-design/icons] ".concat(e));
}
function vt(r) {
  return W(r) === "object" && typeof r.name == "string" && typeof r.theme == "string" && (W(r.icon) === "object" || typeof r.icon == "function");
}
function gt() {
  var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  return Object.keys(r).reduce(function(e, n) {
    var i = r[n];
    switch (n) {
      case "class":
        e.className = i, delete e.class;
        break;
      default:
        delete e[n], e[qr(n)] = i;
    }
    return e;
  }, {});
}
function Oe(r, e, n) {
  return n ? /* @__PURE__ */ fe.createElement(r.tag, D(D({
    key: e
  }, gt(r.attrs)), n), (r.children || []).map(function(i, a) {
    return Oe(i, "".concat(e, "-").concat(r.tag, "-").concat(a));
  })) : /* @__PURE__ */ fe.createElement(r.tag, D({
    key: e
  }, gt(r.attrs)), (r.children || []).map(function(i, a) {
    return Oe(i, "".concat(e, "-").concat(r.tag, "-").concat(a));
  }));
}
function Ot(r) {
  return kr(r)[0];
}
function Tt(r) {
  return r ? Array.isArray(r) ? r : [r] : [];
}
var Kr = `
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`, Jr = function(e) {
  var n = dr(pt), i = n.csp, a = n.prefixCls, s = n.layer, l = Kr;
  a && (l = l.replace(/anticon/g, a)), s && (l = "@layer ".concat(s, ` {
`).concat(l, `
}`)), mt(function() {
    var f = e.current, c = Lr(f);
    Fr(l, "@ant-design-icons", {
      prepend: !s,
      csp: i,
      attachTo: c
    });
  }, []);
}, Gr = ["icon", "className", "onClick", "style", "primaryColor", "secondaryColor"], re = {
  primaryColor: "#333",
  secondaryColor: "#E6E6E6",
  calculated: !1
};
function Xr(r) {
  var e = r.primaryColor, n = r.secondaryColor;
  re.primaryColor = e, re.secondaryColor = n || Ot(e), re.calculated = !!n;
}
function Qr() {
  return D({}, re);
}
var K = function(e) {
  var n = e.icon, i = e.className, a = e.onClick, s = e.style, l = e.primaryColor, f = e.secondaryColor, c = bt(e, Gr), d = A.useRef(), v = re;
  if (l && (v = {
    primaryColor: l,
    secondaryColor: f || Ot(l)
  }), Jr(d), zr(vt(n), "icon should be icon definiton, but got ".concat(n)), !vt(n))
    return null;
  var g = n;
  return g && typeof g.icon == "function" && (g = D(D({}, g), {}, {
    icon: g.icon(v.primaryColor, v.secondaryColor)
  })), Oe(g.icon, "svg-".concat(g.name), D(D({
    className: i,
    onClick: a,
    style: s,
    "data-icon": g.name,
    width: "1em",
    height: "1em",
    fill: "currentColor",
    "aria-hidden": "true"
  }, c), {}, {
    ref: d
  }));
};
K.displayName = "IconReact";
K.getTwoToneColors = Qr;
K.setTwoToneColors = Xr;
function jt(r) {
  var e = Tt(r), n = yt(e, 2), i = n[0], a = n[1];
  return K.setTwoToneColors({
    primaryColor: i,
    secondaryColor: a
  });
}
function Zr() {
  var r = K.getTwoToneColors();
  return r.calculated ? [r.primaryColor, r.secondaryColor] : r.primaryColor;
}
var en = ["className", "icon", "spin", "rotate", "tabIndex", "onClick", "twoToneColor"];
jt(we.primary);
var J = /* @__PURE__ */ A.forwardRef(function(r, e) {
  var n = r.className, i = r.icon, a = r.spin, s = r.rotate, l = r.tabIndex, f = r.onClick, c = r.twoToneColor, d = bt(r, en), v = A.useContext(pt), g = v.prefixCls, w = g === void 0 ? "anticon" : g, I = v.rootClassName, Y = Rr(I, w, T(T({}, "".concat(w, "-").concat(i.name), !!i.name), "".concat(w, "-spin"), !!a || i.name === "loading"), n), _ = l;
  _ === void 0 && f && (_ = -1);
  var j = s ? {
    msTransform: "rotate(".concat(s, "deg)"),
    transform: "rotate(".concat(s, "deg)")
  } : void 0, M = Tt(c), C = yt(M, 2), $ = C[0], F = C[1];
  return /* @__PURE__ */ A.createElement("span", z({
    role: "img",
    "aria-label": i.name
  }, d, {
    ref: e,
    tabIndex: _,
    onClick: f,
    className: Y
  }), /* @__PURE__ */ A.createElement(K, {
    icon: i,
    primaryColor: $,
    secondaryColor: F,
    style: j
  }));
});
J.displayName = "AntdIcon";
J.getTwoToneColor = Zr;
J.setTwoToneColor = jt;
var tn = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" } }] }, name: "delete", theme: "outlined" }, rn = function(e, n) {
  return /* @__PURE__ */ A.createElement(J, z({}, e, {
    ref: n,
    icon: tn
  }));
}, Pt = /* @__PURE__ */ A.forwardRef(rn);
process.env.NODE_ENV !== "production" && (Pt.displayName = "DeleteOutlined");
var nn = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" } }] }, name: "edit", theme: "outlined" }, an = function(e, n) {
  return /* @__PURE__ */ A.createElement(J, z({}, e, {
    ref: n,
    icon: nn
  }));
}, kt = /* @__PURE__ */ A.forwardRef(an);
process.env.NODE_ENV !== "production" && (kt.displayName = "EditOutlined");
var on = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" } }, { tag: "path", attrs: { d: "M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z" } }] }, name: "plus", theme: "outlined" }, sn = function(e, n) {
  return /* @__PURE__ */ A.createElement(J, z({}, e, {
    ref: n,
    icon: on
  }));
}, Mt = /* @__PURE__ */ A.forwardRef(sn);
process.env.NODE_ENV !== "production" && (Mt.displayName = "PlusOutlined");
function cn() {
  const [r, e] = ue([]), [n, i] = ue(!1), [a, s] = ue(!1), [l, f] = ue(null), [c] = Q.useForm(), d = async () => {
    i(!0);
    try {
      const j = await (await fetch("/api/plugins/user-management/users")).json();
      e(j.users || []);
    } catch (_) {
      V.error("加载用户列表失败"), console.error("加载用户列表失败:", _);
    } finally {
      i(!1);
    }
  };
  mt(() => {
    d();
  }, []);
  const v = () => {
    f(null), s(!0), c.resetFields();
  }, g = (_) => {
    f(_), s(!0), c.setFieldsValue(_);
  }, w = async (_) => {
    try {
      await fetch(`/api/plugins/user-management/users/${_}`, {
        method: "DELETE"
      }), e((j) => j.filter((M) => M.id !== _)), V.success("删除成功");
    } catch (j) {
      V.error("删除失败"), console.error("删除失败:", j);
    }
  }, I = async () => {
    try {
      const _ = await c.validateFields(), j = l ? `/api/plugins/user-management/users/${l.id}` : "/api/plugins/user-management/users", C = await fetch(j, {
        method: l ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(_)
      });
      if (C.ok) {
        const $ = await C.json();
        l ? (e((F) => F.map((ne) => ne.id === $.id ? $ : ne)), V.success("更新成功")) : (e((F) => [...F, $]), V.success("创建成功")), s(!1), c.resetFields();
      } else
        V.error("提交失败");
    } catch (_) {
      V.error("提交失败"), console.error("提交失败:", _);
    }
  }, Y = [
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
      render: (_) => new Date(_).toLocaleString("zh-CN")
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_, j) => /* @__PURE__ */ E.jsxs("div", { children: [
        /* @__PURE__ */ E.jsx(
          Ce,
          {
            type: "link",
            icon: /* @__PURE__ */ E.jsx(kt, {}),
            onClick: () => g(j),
            children: "编辑"
          }
        ),
        /* @__PURE__ */ E.jsx(
          Ce,
          {
            type: "link",
            danger: !0,
            icon: /* @__PURE__ */ E.jsx(Pt, {}),
            onClick: () => w(j.id),
            children: "删除"
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ E.jsxs("div", { children: [
    /* @__PURE__ */ E.jsx("div", { style: { marginBottom: 16, textAlign: "right" }, children: /* @__PURE__ */ E.jsx(Ce, { type: "primary", icon: /* @__PURE__ */ E.jsx(Mt, {}), onClick: v, children: "新建用户" }) }),
    /* @__PURE__ */ E.jsx(
      hr,
      {
        columns: Y,
        dataSource: r,
        rowKey: "id",
        loading: n,
        bordered: !0
      }
    ),
    /* @__PURE__ */ E.jsx(
      vr,
      {
        title: l ? "编辑用户" : "新建用户",
        open: a,
        onOk: I,
        onCancel: () => {
          s(!1), c.resetFields();
        },
        okText: "确定",
        cancelText: "取消",
        children: /* @__PURE__ */ E.jsxs(Q, { form: c, layout: "vertical", children: [
          /* @__PURE__ */ E.jsx(
            Q.Item,
            {
              label: "姓名",
              name: "name",
              rules: [{ required: !0, message: "请输入姓名" }],
              children: /* @__PURE__ */ E.jsx(rt, { placeholder: "请输入姓名" })
            }
          ),
          /* @__PURE__ */ E.jsx(
            Q.Item,
            {
              label: "邮箱",
              name: "email",
              rules: [
                { required: !0, message: "请输入邮箱" },
                { type: "email", message: "请输入有效的邮箱地址" }
              ],
              children: /* @__PURE__ */ E.jsx(rt, { placeholder: "请输入邮箱" })
            }
          ),
          /* @__PURE__ */ E.jsx(
            Q.Item,
            {
              label: "角色",
              name: "role",
              rules: [{ required: !0, message: "请选择角色" }],
              children: /* @__PURE__ */ E.jsxs(le, { placeholder: "请选择角色", children: [
                /* @__PURE__ */ E.jsx(le.Option, { value: "管理员", children: "管理员" }),
                /* @__PURE__ */ E.jsx(le.Option, { value: "用户", children: "用户" }),
                /* @__PURE__ */ E.jsx(le.Option, { value: "访客", children: "访客" })
              ] })
            }
          )
        ] })
      }
    )
  ] });
}
export {
  cn as default
};
