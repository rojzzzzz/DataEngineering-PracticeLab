import { r as Ur, g as qa, R as Ga, a as Ua, j as p, b as I, c as Ka, v as Qa, d as Ja, q as ec, e as tc, f as et, h as Zt } from "./sqlTools-DG5PmrOC.js";
function se(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, o; n < e.length; n++)
      (o = se(e[n])) !== "" && (t += (t && " ") + o);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var nc = { value: () => {
} };
function gn() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new qt(n);
}
function qt(e) {
  this._ = e;
}
function oc(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", r = n.indexOf(".");
    if (r >= 0 && (o = n.slice(r + 1), n = n.slice(0, r)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
qt.prototype = gn.prototype = {
  constructor: qt,
  on: function(e, t) {
    var n = this._, o = oc(e + "", n), r, i = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((r = (e = o[i]).type) && (r = rc(n[r], e.name))) return r;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (r = (e = o[i]).type) n[r] = Ro(n[r], e.name, t);
      else if (t == null) for (r in n) n[r] = Ro(n[r], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new qt(e);
  },
  call: function(e, t) {
    if ((r = arguments.length - 2) > 0) for (var n = new Array(r), o = 0, r, i; o < r; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (i = this._[e], o = 0, r = i.length; o < r; ++o) i[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var o = this._[e], r = 0, i = o.length; r < i; ++r) o[r].value.apply(t, n);
  }
};
function rc(e, t) {
  for (var n = 0, o = e.length, r; n < o; ++n)
    if ((r = e[n]).name === t)
      return r.value;
}
function Ro(e, t, n) {
  for (var o = 0, r = e.length; o < r; ++o)
    if (e[o].name === t) {
      e[o] = nc, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Fn = "http://www.w3.org/1999/xhtml";
const jo = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Fn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function pn(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), jo.hasOwnProperty(t) ? { space: jo[t], local: e } : e;
}
function ic(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Fn && t.documentElement.namespaceURI === Fn ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function sc(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Kr(e) {
  var t = pn(e);
  return (t.local ? sc : ic)(t);
}
function ac() {
}
function ro(e) {
  return e == null ? ac : function() {
    return this.querySelector(e);
  };
}
function cc(e) {
  typeof e != "function" && (e = ro(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = new Array(s), c, l, u = 0; u < s; ++u)
      (c = i[u]) && (l = e.call(c, c.__data__, u, i)) && ("__data__" in c && (l.__data__ = c.__data__), a[u] = l);
  return new he(o, this._parents);
}
function lc(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function uc() {
  return [];
}
function Qr(e) {
  return e == null ? uc : function() {
    return this.querySelectorAll(e);
  };
}
function dc(e) {
  return function() {
    return lc(e.apply(this, arguments));
  };
}
function fc(e) {
  typeof e == "function" ? e = dc(e) : e = Qr(e);
  for (var t = this._groups, n = t.length, o = [], r = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, c, l = 0; l < a; ++l)
      (c = s[l]) && (o.push(e.call(c, c.__data__, l, s)), r.push(c));
  return new he(o, r);
}
function Jr(e) {
  return function() {
    return this.matches(e);
  };
}
function ei(e) {
  return function(t) {
    return t.matches(e);
  };
}
var hc = Array.prototype.find;
function gc(e) {
  return function() {
    return hc.call(this.children, e);
  };
}
function pc() {
  return this.firstElementChild;
}
function mc(e) {
  return this.select(e == null ? pc : gc(typeof e == "function" ? e : ei(e)));
}
var yc = Array.prototype.filter;
function xc() {
  return Array.from(this.children);
}
function wc(e) {
  return function() {
    return yc.call(this.children, e);
  };
}
function vc(e) {
  return this.selectAll(e == null ? xc : wc(typeof e == "function" ? e : ei(e)));
}
function bc(e) {
  typeof e != "function" && (e = Jr(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = [], c, l = 0; l < s; ++l)
      (c = i[l]) && e.call(c, c.__data__, l, i) && a.push(c);
  return new he(o, this._parents);
}
function ti(e) {
  return new Array(e.length);
}
function Sc() {
  return new he(this._enter || this._groups.map(ti), this._parents);
}
function Jt(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Jt.prototype = {
  constructor: Jt,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Ec(e) {
  return function() {
    return e;
  };
}
function _c(e, t, n, o, r, i) {
  for (var s = 0, a, c = t.length, l = i.length; s < l; ++s)
    (a = t[s]) ? (a.__data__ = i[s], o[s] = a) : n[s] = new Jt(e, i[s]);
  for (; s < c; ++s)
    (a = t[s]) && (r[s] = a);
}
function Cc(e, t, n, o, r, i, s) {
  var a, c, l = /* @__PURE__ */ new Map(), u = t.length, f = i.length, d = new Array(u), h;
  for (a = 0; a < u; ++a)
    (c = t[a]) && (d[a] = h = s.call(c, c.__data__, a, t) + "", l.has(h) ? r[a] = c : l.set(h, c));
  for (a = 0; a < f; ++a)
    h = s.call(e, i[a], a, i) + "", (c = l.get(h)) ? (o[a] = c, c.__data__ = i[a], l.delete(h)) : n[a] = new Jt(e, i[a]);
  for (a = 0; a < u; ++a)
    (c = t[a]) && l.get(d[a]) === c && (r[a] = c);
}
function Nc(e) {
  return e.__data__;
}
function Mc(e, t) {
  if (!arguments.length) return Array.from(this, Nc);
  var n = t ? Cc : _c, o = this._parents, r = this._groups;
  typeof e != "function" && (e = Ec(e));
  for (var i = r.length, s = new Array(i), a = new Array(i), c = new Array(i), l = 0; l < i; ++l) {
    var u = o[l], f = r[l], d = f.length, h = kc(e.call(u, u && u.__data__, l, o)), g = h.length, v = a[l] = new Array(g), x = s[l] = new Array(g), y = c[l] = new Array(d);
    n(u, f, v, x, y, h, t);
    for (var C = 0, m = 0, b, k; C < g; ++C)
      if (b = v[C]) {
        for (C >= m && (m = C + 1); !(k = x[m]) && ++m < g; ) ;
        b._next = k || null;
      }
  }
  return s = new he(s, o), s._enter = a, s._exit = c, s;
}
function kc(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Ic() {
  return new he(this._exit || this._groups.map(ti), this._parents);
}
function $c(e, t, n) {
  var o = this.enter(), r = this, i = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), n == null ? i.remove() : n(i), o && r ? o.merge(r).order() : r;
}
function Pc(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, r = n.length, i = o.length, s = Math.min(r, i), a = new Array(r), c = 0; c < s; ++c)
    for (var l = n[c], u = o[c], f = l.length, d = a[c] = new Array(f), h, g = 0; g < f; ++g)
      (h = l[g] || u[g]) && (d[g] = h);
  for (; c < r; ++c)
    a[c] = n[c];
  return new he(a, this._parents);
}
function Ac() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], r = o.length - 1, i = o[r], s; --r >= 0; )
      (s = o[r]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function Tc(e) {
  e || (e = Rc);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, o = n.length, r = new Array(o), i = 0; i < o; ++i) {
    for (var s = n[i], a = s.length, c = r[i] = new Array(a), l, u = 0; u < a; ++u)
      (l = s[u]) && (c[u] = l);
    c.sort(t);
  }
  return new he(r, this._parents).order();
}
function Rc(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function jc() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Dc() {
  return Array.from(this);
}
function Hc() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, i = o.length; r < i; ++r) {
      var s = o[r];
      if (s) return s;
    }
  return null;
}
function zc() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Lc() {
  return !this.node();
}
function Bc(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var r = t[n], i = 0, s = r.length, a; i < s; ++i)
      (a = r[i]) && e.call(a, a.__data__, i, r);
  return this;
}
function Vc(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Oc(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Fc(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Xc(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Yc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Wc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Zc(e, t) {
  var n = pn(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Oc : Vc : typeof t == "function" ? n.local ? Wc : Yc : n.local ? Xc : Fc)(n, t));
}
function ni(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function qc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Gc(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Uc(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function Kc(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? qc : typeof t == "function" ? Uc : Gc)(e, t, n ?? "")) : it(this.node(), e);
}
function it(e, t) {
  return e.style.getPropertyValue(t) || ni(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Qc(e) {
  return function() {
    delete this[e];
  };
}
function Jc(e, t) {
  return function() {
    this[e] = t;
  };
}
function el(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function tl(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Qc : typeof t == "function" ? el : Jc)(e, t)) : this.node()[e];
}
function oi(e) {
  return e.trim().split(/^|\s+/);
}
function io(e) {
  return e.classList || new ri(e);
}
function ri(e) {
  this._node = e, this._names = oi(e.getAttribute("class") || "");
}
ri.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function ii(e, t) {
  for (var n = io(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
}
function si(e, t) {
  for (var n = io(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
}
function nl(e) {
  return function() {
    ii(this, e);
  };
}
function ol(e) {
  return function() {
    si(this, e);
  };
}
function rl(e, t) {
  return function() {
    (t.apply(this, arguments) ? ii : si)(this, e);
  };
}
function il(e, t) {
  var n = oi(e + "");
  if (arguments.length < 2) {
    for (var o = io(this.node()), r = -1, i = n.length; ++r < i; ) if (!o.contains(n[r])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? rl : t ? nl : ol)(n, t));
}
function sl() {
  this.textContent = "";
}
function al(e) {
  return function() {
    this.textContent = e;
  };
}
function cl(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function ll(e) {
  return arguments.length ? this.each(e == null ? sl : (typeof e == "function" ? cl : al)(e)) : this.node().textContent;
}
function ul() {
  this.innerHTML = "";
}
function dl(e) {
  return function() {
    this.innerHTML = e;
  };
}
function fl(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function hl(e) {
  return arguments.length ? this.each(e == null ? ul : (typeof e == "function" ? fl : dl)(e)) : this.node().innerHTML;
}
function gl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function pl() {
  return this.each(gl);
}
function ml() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function yl() {
  return this.each(ml);
}
function xl(e) {
  var t = typeof e == "function" ? e : Kr(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function wl() {
  return null;
}
function vl(e, t) {
  var n = typeof e == "function" ? e : Kr(e), o = t == null ? wl : typeof t == "function" ? t : ro(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function bl() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Sl() {
  return this.each(bl);
}
function El() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function _l() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Cl(e) {
  return this.select(e ? _l : El);
}
function Nl(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Ml(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function kl(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function Il(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, r = t.length, i; n < r; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++o] = i;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function $l(e, t, n) {
  return function() {
    var o = this.__on, r, i = Ml(t);
    if (o) {
      for (var s = 0, a = o.length; s < a; ++s)
        if ((r = o[s]).type === e.type && r.name === e.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = i, r.options = n), r.value = t;
          return;
        }
    }
    this.addEventListener(e.type, i, n), r = { type: e.type, name: e.name, value: t, listener: i, options: n }, o ? o.push(r) : this.__on = [r];
  };
}
function Pl(e, t, n) {
  var o = kl(e + ""), r, i = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var c = 0, l = a.length, u; c < l; ++c)
        for (r = 0, u = a[c]; r < i; ++r)
          if ((s = o[r]).type === u.type && s.name === u.name)
            return u.value;
    }
    return;
  }
  for (a = t ? $l : Il, r = 0; r < i; ++r) this.each(a(o[r], t, n));
  return this;
}
function ai(e, t, n) {
  var o = ni(e), r = o.CustomEvent;
  typeof r == "function" ? r = new r(t, n) : (r = o.document.createEvent("Event"), n ? (r.initEvent(t, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function Al(e, t) {
  return function() {
    return ai(this, e, t);
  };
}
function Tl(e, t) {
  return function() {
    return ai(this, e, t.apply(this, arguments));
  };
}
function Rl(e, t) {
  return this.each((typeof t == "function" ? Tl : Al)(e, t));
}
function* jl() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, i = o.length, s; r < i; ++r)
      (s = o[r]) && (yield s);
}
var ci = [null];
function he(e, t) {
  this._groups = e, this._parents = t;
}
function $t() {
  return new he([[document.documentElement]], ci);
}
function Dl() {
  return this;
}
he.prototype = $t.prototype = {
  constructor: he,
  select: cc,
  selectAll: fc,
  selectChild: mc,
  selectChildren: vc,
  filter: bc,
  data: Mc,
  enter: Sc,
  exit: Ic,
  join: $c,
  merge: Pc,
  selection: Dl,
  order: Ac,
  sort: Tc,
  call: jc,
  nodes: Dc,
  node: Hc,
  size: zc,
  empty: Lc,
  each: Bc,
  attr: Zc,
  style: Kc,
  property: tl,
  classed: il,
  text: ll,
  html: hl,
  raise: pl,
  lower: yl,
  append: xl,
  insert: vl,
  remove: Sl,
  clone: Cl,
  datum: Nl,
  on: Pl,
  dispatch: Rl,
  [Symbol.iterator]: jl
};
function fe(e) {
  return typeof e == "string" ? new he([[document.querySelector(e)]], [document.documentElement]) : new he([[e]], ci);
}
function Hl(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function pe(e, t) {
  if (e = Hl(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var r = t.getBoundingClientRect();
      return [e.clientX - r.left - t.clientLeft, e.clientY - r.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const zl = { passive: !1 }, vt = { capture: !0, passive: !1 };
function In(e) {
  e.stopImmediatePropagation();
}
function ot(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function li(e) {
  var t = e.document.documentElement, n = fe(e).on("dragstart.drag", ot, vt);
  "onselectstart" in t ? n.on("selectstart.drag", ot, vt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function ui(e, t) {
  var n = e.document.documentElement, o = fe(e).on("dragstart.drag", null);
  t && (o.on("click.drag", ot, vt), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Ht = (e) => () => e;
function Xn(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: r,
  active: i,
  x: s,
  y: a,
  dx: c,
  dy: l,
  dispatch: u
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: r, enumerable: !0, configurable: !0 },
    active: { value: i, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: c, enumerable: !0, configurable: !0 },
    dy: { value: l, enumerable: !0, configurable: !0 },
    _: { value: u }
  });
}
Xn.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Ll(e) {
  return !e.ctrlKey && !e.button;
}
function Bl() {
  return this.parentNode;
}
function Vl(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Ol() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function di() {
  var e = Ll, t = Bl, n = Vl, o = Ol, r = {}, i = gn("start", "drag", "end"), s = 0, a, c, l, u, f = 0;
  function d(b) {
    b.on("mousedown.drag", h).filter(o).on("touchstart.drag", x).on("touchmove.drag", y, zl).on("touchend.drag touchcancel.drag", C).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(b, k) {
    if (!(u || !e.call(this, b, k))) {
      var E = m(this, t.call(this, b, k), b, k, "mouse");
      E && (fe(b.view).on("mousemove.drag", g, vt).on("mouseup.drag", v, vt), li(b.view), In(b), l = !1, a = b.clientX, c = b.clientY, E("start", b));
    }
  }
  function g(b) {
    if (ot(b), !l) {
      var k = b.clientX - a, E = b.clientY - c;
      l = k * k + E * E > f;
    }
    r.mouse("drag", b);
  }
  function v(b) {
    fe(b.view).on("mousemove.drag mouseup.drag", null), ui(b.view, l), ot(b), r.mouse("end", b);
  }
  function x(b, k) {
    if (e.call(this, b, k)) {
      var E = b.changedTouches, M = t.call(this, b, k), A = E.length, P, V;
      for (P = 0; P < A; ++P)
        (V = m(this, M, b, k, E[P].identifier, E[P])) && (In(b), V("start", b, E[P]));
    }
  }
  function y(b) {
    var k = b.changedTouches, E = k.length, M, A;
    for (M = 0; M < E; ++M)
      (A = r[k[M].identifier]) && (ot(b), A("drag", b, k[M]));
  }
  function C(b) {
    var k = b.changedTouches, E = k.length, M, A;
    for (u && clearTimeout(u), u = setTimeout(function() {
      u = null;
    }, 500), M = 0; M < E; ++M)
      (A = r[k[M].identifier]) && (In(b), A("end", b, k[M]));
  }
  function m(b, k, E, M, A, P) {
    var V = i.copy(), H = pe(P || E, k), B, z, w;
    if ((w = n.call(b, new Xn("beforestart", {
      sourceEvent: E,
      target: d,
      identifier: A,
      active: s,
      x: H[0],
      y: H[1],
      dx: 0,
      dy: 0,
      dispatch: V
    }), M)) != null)
      return B = w.x - H[0] || 0, z = w.y - H[1] || 0, function N(_, $, R) {
        var T = H, L;
        switch (_) {
          case "start":
            r[A] = N, L = s++;
            break;
          case "end":
            delete r[A], --s;
          // falls through
          case "drag":
            H = pe(R || $, k), L = s;
            break;
        }
        V.call(
          _,
          b,
          new Xn(_, {
            sourceEvent: $,
            subject: w,
            target: d,
            identifier: A,
            active: L,
            x: H[0] + B,
            y: H[1] + z,
            dx: H[0] - T[0],
            dy: H[1] - T[1],
            dispatch: V
          }),
          M
        );
      };
  }
  return d.filter = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Ht(!!b), d) : e;
  }, d.container = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Ht(b), d) : t;
  }, d.subject = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : Ht(b), d) : n;
  }, d.touchable = function(b) {
    return arguments.length ? (o = typeof b == "function" ? b : Ht(!!b), d) : o;
  }, d.on = function() {
    var b = i.on.apply(i, arguments);
    return b === i ? d : b;
  }, d.clickDistance = function(b) {
    return arguments.length ? (f = (b = +b) * b, d) : Math.sqrt(f);
  }, d;
}
function so(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function fi(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function Pt() {
}
var bt = 0.7, en = 1 / bt, rt = "\\s*([+-]?\\d+)\\s*", St = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ne = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Fl = /^#([0-9a-f]{3,8})$/, Xl = new RegExp(`^rgb\\(${rt},${rt},${rt}\\)$`), Yl = new RegExp(`^rgb\\(${Ne},${Ne},${Ne}\\)$`), Wl = new RegExp(`^rgba\\(${rt},${rt},${rt},${St}\\)$`), Zl = new RegExp(`^rgba\\(${Ne},${Ne},${Ne},${St}\\)$`), ql = new RegExp(`^hsl\\(${St},${Ne},${Ne}\\)$`), Gl = new RegExp(`^hsla\\(${St},${Ne},${Ne},${St}\\)$`), Do = {
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
so(Pt, Ge, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ho,
  // Deprecated! Use color.formatHex.
  formatHex: Ho,
  formatHex8: Ul,
  formatHsl: Kl,
  formatRgb: zo,
  toString: zo
});
function Ho() {
  return this.rgb().formatHex();
}
function Ul() {
  return this.rgb().formatHex8();
}
function Kl() {
  return hi(this).formatHsl();
}
function zo() {
  return this.rgb().formatRgb();
}
function Ge(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Fl.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Lo(t) : n === 3 ? new le(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? zt(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? zt(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Xl.exec(e)) ? new le(t[1], t[2], t[3], 1) : (t = Yl.exec(e)) ? new le(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Wl.exec(e)) ? zt(t[1], t[2], t[3], t[4]) : (t = Zl.exec(e)) ? zt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ql.exec(e)) ? Oo(t[1], t[2] / 100, t[3] / 100, 1) : (t = Gl.exec(e)) ? Oo(t[1], t[2] / 100, t[3] / 100, t[4]) : Do.hasOwnProperty(e) ? Lo(Do[e]) : e === "transparent" ? new le(NaN, NaN, NaN, 0) : null;
}
function Lo(e) {
  return new le(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function zt(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new le(e, t, n, o);
}
function Ql(e) {
  return e instanceof Pt || (e = Ge(e)), e ? (e = e.rgb(), new le(e.r, e.g, e.b, e.opacity)) : new le();
}
function Yn(e, t, n, o) {
  return arguments.length === 1 ? Ql(e) : new le(e, t, n, o ?? 1);
}
function le(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
so(le, Yn, fi(Pt, {
  brighter(e) {
    return e = e == null ? en : Math.pow(en, e), new le(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? bt : Math.pow(bt, e), new le(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new le(Ze(this.r), Ze(this.g), Ze(this.b), tn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Bo,
  // Deprecated! Use color.formatHex.
  formatHex: Bo,
  formatHex8: Jl,
  formatRgb: Vo,
  toString: Vo
}));
function Bo() {
  return `#${We(this.r)}${We(this.g)}${We(this.b)}`;
}
function Jl() {
  return `#${We(this.r)}${We(this.g)}${We(this.b)}${We((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Vo() {
  const e = tn(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Ze(this.r)}, ${Ze(this.g)}, ${Ze(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function tn(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Ze(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function We(e) {
  return e = Ze(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Oo(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new me(e, t, n, o);
}
function hi(e) {
  if (e instanceof me) return new me(e.h, e.s, e.l, e.opacity);
  if (e instanceof Pt || (e = Ge(e)), !e) return new me();
  if (e instanceof me) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, r = Math.min(t, n, o), i = Math.max(t, n, o), s = NaN, a = i - r, c = (i + r) / 2;
  return a ? (t === i ? s = (n - o) / a + (n < o) * 6 : n === i ? s = (o - t) / a + 2 : s = (t - n) / a + 4, a /= c < 0.5 ? i + r : 2 - i - r, s *= 60) : a = c > 0 && c < 1 ? 0 : s, new me(s, a, c, e.opacity);
}
function eu(e, t, n, o) {
  return arguments.length === 1 ? hi(e) : new me(e, t, n, o ?? 1);
}
function me(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
so(me, eu, fi(Pt, {
  brighter(e) {
    return e = e == null ? en : Math.pow(en, e), new me(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? bt : Math.pow(bt, e), new me(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, r = 2 * n - o;
    return new le(
      $n(e >= 240 ? e - 240 : e + 120, r, o),
      $n(e, r, o),
      $n(e < 120 ? e + 240 : e - 120, r, o),
      this.opacity
    );
  },
  clamp() {
    return new me(Fo(this.h), Lt(this.s), Lt(this.l), tn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = tn(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Fo(this.h)}, ${Lt(this.s) * 100}%, ${Lt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Fo(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Lt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function $n(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const ao = (e) => () => e;
function tu(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function nu(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function ou(e) {
  return (e = +e) == 1 ? gi : function(t, n) {
    return n - t ? nu(t, n, e) : ao(isNaN(t) ? n : t);
  };
}
function gi(e, t) {
  var n = t - e;
  return n ? tu(e, n) : ao(isNaN(e) ? t : e);
}
const nn = (function e(t) {
  var n = ou(t);
  function o(r, i) {
    var s = n((r = Yn(r)).r, (i = Yn(i)).r), a = n(r.g, i.g), c = n(r.b, i.b), l = gi(r.opacity, i.opacity);
    return function(u) {
      return r.r = s(u), r.g = a(u), r.b = c(u), r.opacity = l(u), r + "";
    };
  }
  return o.gamma = e, o;
})(1);
function ru(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), r;
  return function(i) {
    for (r = 0; r < n; ++r) o[r] = e[r] * (1 - i) + t[r] * i;
    return o;
  };
}
function iu(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function su(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, r = new Array(o), i = new Array(n), s;
  for (s = 0; s < o; ++s) r[s] = yt(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < o; ++s) i[s] = r[s](a);
    return i;
  };
}
function au(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function _e(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function cu(e, t) {
  var n = {}, o = {}, r;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (r in t)
    r in e ? n[r] = yt(e[r], t[r]) : o[r] = t[r];
  return function(i) {
    for (r in n) o[r] = n[r](i);
    return o;
  };
}
var Wn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Pn = new RegExp(Wn.source, "g");
function lu(e) {
  return function() {
    return e;
  };
}
function uu(e) {
  return function(t) {
    return e(t) + "";
  };
}
function pi(e, t) {
  var n = Wn.lastIndex = Pn.lastIndex = 0, o, r, i, s = -1, a = [], c = [];
  for (e = e + "", t = t + ""; (o = Wn.exec(e)) && (r = Pn.exec(t)); )
    (i = r.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (o = o[0]) === (r = r[0]) ? a[s] ? a[s] += r : a[++s] = r : (a[++s] = null, c.push({ i: s, x: _e(o, r) })), n = Pn.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? c[0] ? uu(c[0].x) : lu(t) : (t = c.length, function(l) {
    for (var u = 0, f; u < t; ++u) a[(f = c[u]).i] = f.x(l);
    return a.join("");
  });
}
function yt(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? ao(t) : (n === "number" ? _e : n === "string" ? (o = Ge(t)) ? (t = o, nn) : pi : t instanceof Ge ? nn : t instanceof Date ? au : iu(t) ? ru : Array.isArray(t) ? su : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? cu : _e)(e, t);
}
var Xo = 180 / Math.PI, Zn = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function mi(e, t, n, o, r, i) {
  var s, a, c;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (c = e * n + t * o) && (n -= e * c, o -= t * c), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, c /= a), e * o < t * n && (e = -e, t = -t, c = -c, s = -s), {
    translateX: r,
    translateY: i,
    rotate: Math.atan2(t, e) * Xo,
    skewX: Math.atan(c) * Xo,
    scaleX: s,
    scaleY: a
  };
}
var Bt;
function du(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Zn : mi(t.a, t.b, t.c, t.d, t.e, t.f);
}
function fu(e) {
  return e == null || (Bt || (Bt = document.createElementNS("http://www.w3.org/2000/svg", "g")), Bt.setAttribute("transform", e), !(e = Bt.transform.baseVal.consolidate())) ? Zn : (e = e.matrix, mi(e.a, e.b, e.c, e.d, e.e, e.f));
}
function yi(e, t, n, o) {
  function r(l) {
    return l.length ? l.pop() + " " : "";
  }
  function i(l, u, f, d, h, g) {
    if (l !== f || u !== d) {
      var v = h.push("translate(", null, t, null, n);
      g.push({ i: v - 4, x: _e(l, f) }, { i: v - 2, x: _e(u, d) });
    } else (f || d) && h.push("translate(" + f + t + d + n);
  }
  function s(l, u, f, d) {
    l !== u ? (l - u > 180 ? u += 360 : u - l > 180 && (l += 360), d.push({ i: f.push(r(f) + "rotate(", null, o) - 2, x: _e(l, u) })) : u && f.push(r(f) + "rotate(" + u + o);
  }
  function a(l, u, f, d) {
    l !== u ? d.push({ i: f.push(r(f) + "skewX(", null, o) - 2, x: _e(l, u) }) : u && f.push(r(f) + "skewX(" + u + o);
  }
  function c(l, u, f, d, h, g) {
    if (l !== f || u !== d) {
      var v = h.push(r(h) + "scale(", null, ",", null, ")");
      g.push({ i: v - 4, x: _e(l, f) }, { i: v - 2, x: _e(u, d) });
    } else (f !== 1 || d !== 1) && h.push(r(h) + "scale(" + f + "," + d + ")");
  }
  return function(l, u) {
    var f = [], d = [];
    return l = e(l), u = e(u), i(l.translateX, l.translateY, u.translateX, u.translateY, f, d), s(l.rotate, u.rotate, f, d), a(l.skewX, u.skewX, f, d), c(l.scaleX, l.scaleY, u.scaleX, u.scaleY, f, d), l = u = null, function(h) {
      for (var g = -1, v = d.length, x; ++g < v; ) f[(x = d[g]).i] = x.x(h);
      return f.join("");
    };
  };
}
var hu = yi(du, "px, ", "px)", "deg)"), gu = yi(fu, ", ", ")", ")"), pu = 1e-12;
function Yo(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function mu(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function yu(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Gt = (function e(t, n, o) {
  function r(i, s) {
    var a = i[0], c = i[1], l = i[2], u = s[0], f = s[1], d = s[2], h = u - a, g = f - c, v = h * h + g * g, x, y;
    if (v < pu)
      y = Math.log(d / l) / t, x = function(M) {
        return [
          a + M * h,
          c + M * g,
          l * Math.exp(t * M * y)
        ];
      };
    else {
      var C = Math.sqrt(v), m = (d * d - l * l + o * v) / (2 * l * n * C), b = (d * d - l * l - o * v) / (2 * d * n * C), k = Math.log(Math.sqrt(m * m + 1) - m), E = Math.log(Math.sqrt(b * b + 1) - b);
      y = (E - k) / t, x = function(M) {
        var A = M * y, P = Yo(k), V = l / (n * C) * (P * yu(t * A + k) - mu(k));
        return [
          a + V * h,
          c + V * g,
          l * P / Yo(t * A + k)
        ];
      };
    }
    return x.duration = y * 1e3 * t / Math.SQRT2, x;
  }
  return r.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, c = a * a;
    return e(s, a, c);
  }, r;
})(Math.SQRT2, 2, 4);
var st = 0, pt = 0, ht = 0, xi = 1e3, on, mt, rn = 0, Ue = 0, mn = 0, Et = typeof performance == "object" && performance.now ? performance : Date, wi = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function co() {
  return Ue || (wi(xu), Ue = Et.now() + mn);
}
function xu() {
  Ue = 0;
}
function sn() {
  this._call = this._time = this._next = null;
}
sn.prototype = vi.prototype = {
  constructor: sn,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? co() : +n) + (t == null ? 0 : +t), !this._next && mt !== this && (mt ? mt._next = this : on = this, mt = this), this._call = e, this._time = n, qn();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, qn());
  }
};
function vi(e, t, n) {
  var o = new sn();
  return o.restart(e, t, n), o;
}
function wu() {
  co(), ++st;
  for (var e = on, t; e; )
    (t = Ue - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --st;
}
function Wo() {
  Ue = (rn = Et.now()) + mn, st = pt = 0;
  try {
    wu();
  } finally {
    st = 0, bu(), Ue = 0;
  }
}
function vu() {
  var e = Et.now(), t = e - rn;
  t > xi && (mn -= t, rn = e);
}
function bu() {
  for (var e, t = on, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : on = n);
  mt = e, qn(o);
}
function qn(e) {
  if (!st) {
    pt && (pt = clearTimeout(pt));
    var t = e - Ue;
    t > 24 ? (e < 1 / 0 && (pt = setTimeout(Wo, e - Et.now() - mn)), ht && (ht = clearInterval(ht))) : (ht || (rn = Et.now(), ht = setInterval(vu, xi)), st = 1, wi(Wo));
  }
}
function Zo(e, t, n) {
  var o = new sn();
  return t = t == null ? 0 : +t, o.restart((r) => {
    o.stop(), e(r + t);
  }, t, n), o;
}
var Su = gn("start", "end", "cancel", "interrupt"), Eu = [], bi = 0, qo = 1, Gn = 2, Ut = 3, Go = 4, Un = 5, Kt = 6;
function yn(e, t, n, o, r, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  _u(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: r,
    // For context during callback.
    on: Su,
    tween: Eu,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: bi
  });
}
function lo(e, t) {
  var n = ve(e, t);
  if (n.state > bi) throw new Error("too late; already scheduled");
  return n;
}
function Me(e, t) {
  var n = ve(e, t);
  if (n.state > Ut) throw new Error("too late; already running");
  return n;
}
function ve(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function _u(e, t, n) {
  var o = e.__transition, r;
  o[t] = n, n.timer = vi(i, 0, n.time);
  function i(l) {
    n.state = qo, n.timer.restart(s, n.delay, n.time), n.delay <= l && s(l - n.delay);
  }
  function s(l) {
    var u, f, d, h;
    if (n.state !== qo) return c();
    for (u in o)
      if (h = o[u], h.name === n.name) {
        if (h.state === Ut) return Zo(s);
        h.state === Go ? (h.state = Kt, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete o[u]) : +u < t && (h.state = Kt, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete o[u]);
      }
    if (Zo(function() {
      n.state === Ut && (n.state = Go, n.timer.restart(a, n.delay, n.time), a(l));
    }), n.state = Gn, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Gn) {
      for (n.state = Ut, r = new Array(d = n.tween.length), u = 0, f = -1; u < d; ++u)
        (h = n.tween[u].value.call(e, e.__data__, n.index, n.group)) && (r[++f] = h);
      r.length = f + 1;
    }
  }
  function a(l) {
    for (var u = l < n.duration ? n.ease.call(null, l / n.duration) : (n.timer.restart(c), n.state = Un, 1), f = -1, d = r.length; ++f < d; )
      r[f].call(e, u);
    n.state === Un && (n.on.call("end", e, e.__data__, n.index, n.group), c());
  }
  function c() {
    n.state = Kt, n.timer.stop(), delete o[t];
    for (var l in o) return;
    delete e.__transition;
  }
}
function Qt(e, t) {
  var n = e.__transition, o, r, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((o = n[s]).name !== t) {
        i = !1;
        continue;
      }
      r = o.state > Gn && o.state < Un, o.state = Kt, o.timer.stop(), o.on.call(r ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function Cu(e) {
  return this.each(function() {
    Qt(this, e);
  });
}
function Nu(e, t) {
  var n, o;
  return function() {
    var r = Me(this, e), i = r.tween;
    if (i !== n) {
      o = n = i;
      for (var s = 0, a = o.length; s < a; ++s)
        if (o[s].name === t) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    r.tween = o;
  };
}
function Mu(e, t, n) {
  var o, r;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = Me(this, e), s = i.tween;
    if (s !== o) {
      r = (o = s).slice();
      for (var a = { name: t, value: n }, c = 0, l = r.length; c < l; ++c)
        if (r[c].name === t) {
          r[c] = a;
          break;
        }
      c === l && r.push(a);
    }
    i.tween = r;
  };
}
function ku(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = ve(this.node(), n).tween, r = 0, i = o.length, s; r < i; ++r)
      if ((s = o[r]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? Nu : Mu)(n, e, t));
}
function uo(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var r = Me(this, o);
    (r.value || (r.value = {}))[t] = n.apply(this, arguments);
  }), function(r) {
    return ve(r, o).value[t];
  };
}
function Si(e, t) {
  var n;
  return (typeof t == "number" ? _e : t instanceof Ge ? nn : (n = Ge(t)) ? (t = n, nn) : pi)(e, t);
}
function Iu(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function $u(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Pu(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function Au(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function Tu(e, t, n) {
  var o, r, i;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), c = a + "", s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a)));
  };
}
function Ru(e, t, n) {
  var o, r, i;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), c = a + "", s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a)));
  };
}
function ju(e, t) {
  var n = pn(e), o = n === "transform" ? gu : Si;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Ru : Tu)(n, o, uo(this, "attr." + e, t)) : t == null ? (n.local ? $u : Iu)(n) : (n.local ? Au : Pu)(n, o, t));
}
function Du(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Hu(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function zu(e, t) {
  var n, o;
  function r() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && Hu(e, i)), n;
  }
  return r._value = t, r;
}
function Lu(e, t) {
  var n, o;
  function r() {
    var i = t.apply(this, arguments);
    return i !== o && (n = (o = i) && Du(e, i)), n;
  }
  return r._value = t, r;
}
function Bu(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = pn(e);
  return this.tween(n, (o.local ? zu : Lu)(o, t));
}
function Vu(e, t) {
  return function() {
    lo(this, e).delay = +t.apply(this, arguments);
  };
}
function Ou(e, t) {
  return t = +t, function() {
    lo(this, e).delay = t;
  };
}
function Fu(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Vu : Ou)(t, e)) : ve(this.node(), t).delay;
}
function Xu(e, t) {
  return function() {
    Me(this, e).duration = +t.apply(this, arguments);
  };
}
function Yu(e, t) {
  return t = +t, function() {
    Me(this, e).duration = t;
  };
}
function Wu(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Xu : Yu)(t, e)) : ve(this.node(), t).duration;
}
function Zu(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Me(this, e).ease = t;
  };
}
function qu(e) {
  var t = this._id;
  return arguments.length ? this.each(Zu(t, e)) : ve(this.node(), t).ease;
}
function Gu(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Me(this, e).ease = n;
  };
}
function Uu(e) {
  if (typeof e != "function") throw new Error();
  return this.each(Gu(this._id, e));
}
function Ku(e) {
  typeof e != "function" && (e = Jr(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var i = t[r], s = i.length, a = o[r] = [], c, l = 0; l < s; ++l)
      (c = i[l]) && e.call(c, c.__data__, l, i) && a.push(c);
  return new je(o, this._parents, this._name, this._id);
}
function Qu(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, r = n.length, i = Math.min(o, r), s = new Array(o), a = 0; a < i; ++a)
    for (var c = t[a], l = n[a], u = c.length, f = s[a] = new Array(u), d, h = 0; h < u; ++h)
      (d = c[h] || l[h]) && (f[h] = d);
  for (; a < o; ++a)
    s[a] = t[a];
  return new je(s, this._parents, this._name, this._id);
}
function Ju(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function ed(e, t, n) {
  var o, r, i = Ju(t) ? lo : Me;
  return function() {
    var s = i(this, e), a = s.on;
    a !== o && (r = (o = a).copy()).on(t, n), s.on = r;
  };
}
function td(e, t) {
  var n = this._id;
  return arguments.length < 2 ? ve(this.node(), n).on.on(e) : this.each(ed(n, e, t));
}
function nd(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function od() {
  return this.on("end.remove", nd(this._id));
}
function rd(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = ro(e));
  for (var o = this._groups, r = o.length, i = new Array(r), s = 0; s < r; ++s)
    for (var a = o[s], c = a.length, l = i[s] = new Array(c), u, f, d = 0; d < c; ++d)
      (u = a[d]) && (f = e.call(u, u.__data__, d, a)) && ("__data__" in u && (f.__data__ = u.__data__), l[d] = f, yn(l[d], t, n, d, l, ve(u, n)));
  return new je(i, this._parents, t, n);
}
function id(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Qr(e));
  for (var o = this._groups, r = o.length, i = [], s = [], a = 0; a < r; ++a)
    for (var c = o[a], l = c.length, u, f = 0; f < l; ++f)
      if (u = c[f]) {
        for (var d = e.call(u, u.__data__, f, c), h, g = ve(u, n), v = 0, x = d.length; v < x; ++v)
          (h = d[v]) && yn(h, t, n, v, d, g);
        i.push(d), s.push(u);
      }
  return new je(i, s, t, n);
}
var sd = $t.prototype.constructor;
function ad() {
  return new sd(this._groups, this._parents);
}
function cd(e, t) {
  var n, o, r;
  return function() {
    var i = it(this, e), s = (this.style.removeProperty(e), it(this, e));
    return i === s ? null : i === n && s === o ? r : r = t(n = i, o = s);
  };
}
function Ei(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function ld(e, t, n) {
  var o, r = n + "", i;
  return function() {
    var s = it(this, e);
    return s === r ? null : s === o ? i : i = t(o = s, n);
  };
}
function ud(e, t, n) {
  var o, r, i;
  return function() {
    var s = it(this, e), a = n(this), c = a + "";
    return a == null && (c = a = (this.style.removeProperty(e), it(this, e))), s === c ? null : s === o && c === r ? i : (r = c, i = t(o = s, a));
  };
}
function dd(e, t) {
  var n, o, r, i = "style." + t, s = "end." + i, a;
  return function() {
    var c = Me(this, e), l = c.on, u = c.value[i] == null ? a || (a = Ei(t)) : void 0;
    (l !== n || r !== u) && (o = (n = l).copy()).on(s, r = u), c.on = o;
  };
}
function fd(e, t, n) {
  var o = (e += "") == "transform" ? hu : Si;
  return t == null ? this.styleTween(e, cd(e, o)).on("end.style." + e, Ei(e)) : typeof t == "function" ? this.styleTween(e, ud(e, o, uo(this, "style." + e, t))).each(dd(this._id, e)) : this.styleTween(e, ld(e, o, t), n).on("end.style." + e, null);
}
function hd(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function gd(e, t, n) {
  var o, r;
  function i() {
    var s = t.apply(this, arguments);
    return s !== r && (o = (r = s) && hd(e, s, n)), o;
  }
  return i._value = t, i;
}
function pd(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, gd(e, t, n ?? ""));
}
function md(e) {
  return function() {
    this.textContent = e;
  };
}
function yd(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function xd(e) {
  return this.tween("text", typeof e == "function" ? yd(uo(this, "text", e)) : md(e == null ? "" : e + ""));
}
function wd(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function vd(e) {
  var t, n;
  function o() {
    var r = e.apply(this, arguments);
    return r !== n && (t = (n = r) && wd(r)), t;
  }
  return o._value = e, o;
}
function bd(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, vd(e));
}
function Sd() {
  for (var e = this._name, t = this._id, n = _i(), o = this._groups, r = o.length, i = 0; i < r; ++i)
    for (var s = o[i], a = s.length, c, l = 0; l < a; ++l)
      if (c = s[l]) {
        var u = ve(c, t);
        yn(c, e, n, l, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new je(o, this._parents, e, n);
}
function Ed() {
  var e, t, n = this, o = n._id, r = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, c = { value: function() {
      --r === 0 && i();
    } };
    n.each(function() {
      var l = Me(this, o), u = l.on;
      u !== e && (t = (e = u).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(c)), l.on = t;
    }), r === 0 && i();
  });
}
var _d = 0;
function je(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function _i() {
  return ++_d;
}
var Ae = $t.prototype;
je.prototype = {
  constructor: je,
  select: rd,
  selectAll: id,
  selectChild: Ae.selectChild,
  selectChildren: Ae.selectChildren,
  filter: Ku,
  merge: Qu,
  selection: ad,
  transition: Sd,
  call: Ae.call,
  nodes: Ae.nodes,
  node: Ae.node,
  size: Ae.size,
  empty: Ae.empty,
  each: Ae.each,
  on: td,
  attr: ju,
  attrTween: Bu,
  style: fd,
  styleTween: pd,
  text: xd,
  textTween: bd,
  remove: od,
  tween: ku,
  delay: Fu,
  duration: Wu,
  ease: qu,
  easeVarying: Uu,
  end: Ed,
  [Symbol.iterator]: Ae[Symbol.iterator]
};
function Cd(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Nd = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Cd
};
function Md(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function kd(e) {
  var t, n;
  e instanceof je ? (t = e._id, e = e._name) : (t = _i(), (n = Nd).time = co(), e = e == null ? null : e + "");
  for (var o = this._groups, r = o.length, i = 0; i < r; ++i)
    for (var s = o[i], a = s.length, c, l = 0; l < a; ++l)
      (c = s[l]) && yn(c, e, t, l, s, n || Md(c, t));
  return new je(o, this._parents, e, t);
}
$t.prototype.interrupt = Cu;
$t.prototype.transition = kd;
const Vt = (e) => () => e;
function Id(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: r
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: r }
  });
}
function Te(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Te.prototype = {
  constructor: Te,
  scale: function(e) {
    return e === 1 ? this : new Te(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Te(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var xn = new Te(1, 0, 0);
Ci.prototype = Te.prototype;
function Ci(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return xn;
  return e.__zoom;
}
function An(e) {
  e.stopImmediatePropagation();
}
function gt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function $d(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Pd() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Uo() {
  return this.__zoom || xn;
}
function Ad(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function Td() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Rd(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], r = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    r > o ? (o + r) / 2 : Math.min(0, o) || Math.max(0, r),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function Ni() {
  var e = $d, t = Pd, n = Rd, o = Ad, r = Td, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, c = Gt, l = gn("start", "zoom", "end"), u, f, d, h = 500, g = 150, v = 0, x = 10;
  function y(w) {
    w.property("__zoom", Uo).on("wheel.zoom", A, { passive: !1 }).on("mousedown.zoom", P).on("dblclick.zoom", V).filter(r).on("touchstart.zoom", H).on("touchmove.zoom", B).on("touchend.zoom touchcancel.zoom", z).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(w, N, _, $) {
    var R = w.selection ? w.selection() : w;
    R.property("__zoom", Uo), w !== R ? k(w, N, _, $) : R.interrupt().each(function() {
      E(this, arguments).event($).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, y.scaleBy = function(w, N, _, $) {
    y.scaleTo(w, function() {
      var R = this.__zoom.k, T = typeof N == "function" ? N.apply(this, arguments) : N;
      return R * T;
    }, _, $);
  }, y.scaleTo = function(w, N, _, $) {
    y.transform(w, function() {
      var R = t.apply(this, arguments), T = this.__zoom, L = _ == null ? b(R) : typeof _ == "function" ? _.apply(this, arguments) : _, S = T.invert(L), j = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(m(C(T, j), L, S), R, s);
    }, _, $);
  }, y.translateBy = function(w, N, _, $) {
    y.transform(w, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof _ == "function" ? _.apply(this, arguments) : _
      ), t.apply(this, arguments), s);
    }, null, $);
  }, y.translateTo = function(w, N, _, $, R) {
    y.transform(w, function() {
      var T = t.apply(this, arguments), L = this.__zoom, S = $ == null ? b(T) : typeof $ == "function" ? $.apply(this, arguments) : $;
      return n(xn.translate(S[0], S[1]).scale(L.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof _ == "function" ? -_.apply(this, arguments) : -_
      ), T, s);
    }, $, R);
  };
  function C(w, N) {
    return N = Math.max(i[0], Math.min(i[1], N)), N === w.k ? w : new Te(N, w.x, w.y);
  }
  function m(w, N, _) {
    var $ = N[0] - _[0] * w.k, R = N[1] - _[1] * w.k;
    return $ === w.x && R === w.y ? w : new Te(w.k, $, R);
  }
  function b(w) {
    return [(+w[0][0] + +w[1][0]) / 2, (+w[0][1] + +w[1][1]) / 2];
  }
  function k(w, N, _, $) {
    w.on("start.zoom", function() {
      E(this, arguments).event($).start();
    }).on("interrupt.zoom end.zoom", function() {
      E(this, arguments).event($).end();
    }).tween("zoom", function() {
      var R = this, T = arguments, L = E(R, T).event($), S = t.apply(R, T), j = _ == null ? b(S) : typeof _ == "function" ? _.apply(R, T) : _, X = Math.max(S[1][0] - S[0][0], S[1][1] - S[0][1]), F = R.__zoom, q = typeof N == "function" ? N.apply(R, T) : N, K = c(F.invert(j).concat(X / F.k), q.invert(j).concat(X / q.k));
      return function(W) {
        if (W === 1) W = q;
        else {
          var D = K(W), O = X / D[2];
          W = new Te(O, j[0] - D[0] * O, j[1] - D[1] * O);
        }
        L.zoom(null, W);
      };
    });
  }
  function E(w, N, _) {
    return !_ && w.__zooming || new M(w, N);
  }
  function M(w, N) {
    this.that = w, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = t.apply(w, N), this.taps = 0;
  }
  M.prototype = {
    event: function(w) {
      return w && (this.sourceEvent = w), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(w, N) {
      return this.mouse && w !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && w !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && w !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(w) {
      var N = fe(this.that).datum();
      l.call(
        w,
        this.that,
        new Id(w, {
          sourceEvent: this.sourceEvent,
          target: y,
          transform: this.that.__zoom,
          dispatch: l
        }),
        N
      );
    }
  };
  function A(w, ...N) {
    if (!e.apply(this, arguments)) return;
    var _ = E(this, N).event(w), $ = this.__zoom, R = Math.max(i[0], Math.min(i[1], $.k * Math.pow(2, o.apply(this, arguments)))), T = pe(w);
    if (_.wheel)
      (_.mouse[0][0] !== T[0] || _.mouse[0][1] !== T[1]) && (_.mouse[1] = $.invert(_.mouse[0] = T)), clearTimeout(_.wheel);
    else {
      if ($.k === R) return;
      _.mouse = [T, $.invert(T)], Qt(this), _.start();
    }
    gt(w), _.wheel = setTimeout(L, g), _.zoom("mouse", n(m(C($, R), _.mouse[0], _.mouse[1]), _.extent, s));
    function L() {
      _.wheel = null, _.end();
    }
  }
  function P(w, ...N) {
    if (d || !e.apply(this, arguments)) return;
    var _ = w.currentTarget, $ = E(this, N, !0).event(w), R = fe(w.view).on("mousemove.zoom", j, !0).on("mouseup.zoom", X, !0), T = pe(w, _), L = w.clientX, S = w.clientY;
    li(w.view), An(w), $.mouse = [T, this.__zoom.invert(T)], Qt(this), $.start();
    function j(F) {
      if (gt(F), !$.moved) {
        var q = F.clientX - L, K = F.clientY - S;
        $.moved = q * q + K * K > v;
      }
      $.event(F).zoom("mouse", n(m($.that.__zoom, $.mouse[0] = pe(F, _), $.mouse[1]), $.extent, s));
    }
    function X(F) {
      R.on("mousemove.zoom mouseup.zoom", null), ui(F.view, $.moved), gt(F), $.event(F).end();
    }
  }
  function V(w, ...N) {
    if (e.apply(this, arguments)) {
      var _ = this.__zoom, $ = pe(w.changedTouches ? w.changedTouches[0] : w, this), R = _.invert($), T = _.k * (w.shiftKey ? 0.5 : 2), L = n(m(C(_, T), $, R), t.apply(this, N), s);
      gt(w), a > 0 ? fe(this).transition().duration(a).call(k, L, $, w) : fe(this).call(y.transform, L, $, w);
    }
  }
  function H(w, ...N) {
    if (e.apply(this, arguments)) {
      var _ = w.touches, $ = _.length, R = E(this, N, w.changedTouches.length === $).event(w), T, L, S, j;
      for (An(w), L = 0; L < $; ++L)
        S = _[L], j = pe(S, this), j = [j, this.__zoom.invert(j), S.identifier], R.touch0 ? !R.touch1 && R.touch0[2] !== j[2] && (R.touch1 = j, R.taps = 0) : (R.touch0 = j, T = !0, R.taps = 1 + !!u);
      u && (u = clearTimeout(u)), T && (R.taps < 2 && (f = j[0], u = setTimeout(function() {
        u = null;
      }, h)), Qt(this), R.start());
    }
  }
  function B(w, ...N) {
    if (this.__zooming) {
      var _ = E(this, N).event(w), $ = w.changedTouches, R = $.length, T, L, S, j;
      for (gt(w), T = 0; T < R; ++T)
        L = $[T], S = pe(L, this), _.touch0 && _.touch0[2] === L.identifier ? _.touch0[0] = S : _.touch1 && _.touch1[2] === L.identifier && (_.touch1[0] = S);
      if (L = _.that.__zoom, _.touch1) {
        var X = _.touch0[0], F = _.touch0[1], q = _.touch1[0], K = _.touch1[1], W = (W = q[0] - X[0]) * W + (W = q[1] - X[1]) * W, D = (D = K[0] - F[0]) * D + (D = K[1] - F[1]) * D;
        L = C(L, Math.sqrt(W / D)), S = [(X[0] + q[0]) / 2, (X[1] + q[1]) / 2], j = [(F[0] + K[0]) / 2, (F[1] + K[1]) / 2];
      } else if (_.touch0) S = _.touch0[0], j = _.touch0[1];
      else return;
      _.zoom("touch", n(m(L, S, j), _.extent, s));
    }
  }
  function z(w, ...N) {
    if (this.__zooming) {
      var _ = E(this, N).event(w), $ = w.changedTouches, R = $.length, T, L;
      for (An(w), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, h), T = 0; T < R; ++T)
        L = $[T], _.touch0 && _.touch0[2] === L.identifier ? delete _.touch0 : _.touch1 && _.touch1[2] === L.identifier && delete _.touch1;
      if (_.touch1 && !_.touch0 && (_.touch0 = _.touch1, delete _.touch1), _.touch0) _.touch0[1] = this.__zoom.invert(_.touch0[0]);
      else if (_.end(), _.taps === 2 && (L = pe(L, this), Math.hypot(f[0] - L[0], f[1] - L[1]) < x)) {
        var S = fe(this).on("dblclick.zoom");
        S && S.apply(this, arguments);
      }
    }
  }
  return y.wheelDelta = function(w) {
    return arguments.length ? (o = typeof w == "function" ? w : Vt(+w), y) : o;
  }, y.filter = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : Vt(!!w), y) : e;
  }, y.touchable = function(w) {
    return arguments.length ? (r = typeof w == "function" ? w : Vt(!!w), y) : r;
  }, y.extent = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : Vt([[+w[0][0], +w[0][1]], [+w[1][0], +w[1][1]]]), y) : t;
  }, y.scaleExtent = function(w) {
    return arguments.length ? (i[0] = +w[0], i[1] = +w[1], y) : [i[0], i[1]];
  }, y.translateExtent = function(w) {
    return arguments.length ? (s[0][0] = +w[0][0], s[1][0] = +w[1][0], s[0][1] = +w[0][1], s[1][1] = +w[1][1], y) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, y.constrain = function(w) {
    return arguments.length ? (n = w, y) : n;
  }, y.duration = function(w) {
    return arguments.length ? (a = +w, y) : a;
  }, y.interpolate = function(w) {
    return arguments.length ? (c = w, y) : c;
  }, y.on = function() {
    var w = l.on.apply(l, arguments);
    return w === l ? y : w;
  }, y.clickDistance = function(w) {
    return arguments.length ? (v = (w = +w) * w, y) : Math.sqrt(v);
  }, y.tapDistance = function(w) {
    return arguments.length ? (x = +w, y) : x;
  }, y;
}
const we = {
  error001: (e = "react") => `Seems like you have not used ${e === "svelte" ? "SvelteFlowProvider" : "ReactFlowProvider"} as an ancestor. Help: https://${e}flow.dev/error#001`,
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: t, sourceHandle: n, targetHandle: o }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : o}", edge id: ${t}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",
  error016: (e) => `Edge with id "${e}" does not exist, it may have been removed. This can happen when an edge is deleted before the "onEdgeClick" handler is called.`
}, _t = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Mi = ["Enter", " ", "Escape"], ki = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
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
var at;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(at || (at = {}));
var qe;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(qe || (qe = {}));
var Ct;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Ct || (Ct = {}));
const Ii = {
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
var Le;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Le || (Le = {}));
var Nt;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Nt || (Nt = {}));
var Y;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(Y || (Y = {}));
const Ko = {
  [Y.Left]: Y.Right,
  [Y.Right]: Y.Left,
  [Y.Top]: Y.Bottom,
  [Y.Bottom]: Y.Top
}, $i = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, jd = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), fo = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), At = (e, t = [0, 0]) => {
  const { width: n, height: o } = be(e), r = e.origin ?? t, i = n * r[0], s = o * r[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, Pi = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const o = e.reduce((r, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : fo(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, wn(r, an(a, t.nodeOrigin))) : r;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? vn(o) : { x: 0, y: 0, width: 0, height: 0 };
}, Tt = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, o = !1;
  return e.forEach((r) => {
    (t.filter === void 0 || t.filter(r)) && (n = wn(n, an(r)), o = !0);
  }), o ? vn(n) : { x: 0, y: 0, width: 0, height: 0 };
}, ho = (e, t, [n, o, r] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / r, c = (t.y - o) / r, l = t.width / r, u = t.height / r, f = [];
  for (const d of e.values()) {
    const { measured: h, selectable: g = !0, hidden: v = !1 } = d;
    if (s && !g || v)
      continue;
    const x = h.width ?? d.width ?? d.initialWidth ?? 0, y = h.height ?? d.height ?? d.initialHeight ?? 0, { x: C, y: m } = d.internals.positionAbsolute, b = ji(a, c, l, u, C, m, x, y), k = x * y, E = i && b > 0;
    (!d.internals.handleBounds || E || b >= k || d.dragging) && f.push(d);
  }
  return f;
}, Dd = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((o) => {
    n.add(o.id);
  }), t.filter((o) => n.has(o.source) || n.has(o.target));
};
function Hd(e, t) {
  const n = /* @__PURE__ */ new Map(), o = t?.nodes ? new Set(t.nodes.map((r) => r.id)) : null;
  return e.forEach((r) => {
    let i;
    if (t?.includeHiddenNodes) {
      const { width: s, height: a } = be(r);
      i = s > 0 && a > 0;
    } else
      i = !!(r.measured.width && r.measured.height && !r.hidden);
    i && (!o || o.has(r.id)) && n.set(r.id, r);
  }), n;
}
async function zd({ nodes: e, width: t, height: n, panZoom: o, minZoom: r, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = Hd(e, s), c = Tt(a), l = po(c, t, n, s?.minZoom ?? r, s?.maxZoom ?? i, s?.padding ?? 0.1);
  return await o.setViewport(l, {
    duration: s?.duration,
    ease: s?.ease,
    interpolate: s?.interpolate
  }), !0;
}
function Ai({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: o = [0, 0], nodeExtent: r, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: c, y: l } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, u = s.origin ?? o;
  let f = s.extent || r;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i?.("005", we.error005());
    else {
      const { width: h, height: g } = be(a);
      h && g && (f = [
        [c, l],
        [c + h, l + g]
      ]);
    }
  else a && Qe(s.extent) && (f = [
    [s.extent[0][0] + c, s.extent[0][1] + l],
    [s.extent[1][0] + c, s.extent[1][1] + l]
  ]);
  const d = Qe(f) ? Ke(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && i?.("015", we.error015()), {
    position: {
      x: d.x - c + (s.measured.width ?? 0) * u[0],
      y: d.y - l + (s.measured.height ?? 0) * u[1]
    },
    positionAbsolute: d
  };
}
async function Ld({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: o, onBeforeDelete: r }) {
  const i = new Set(e.map((d) => d.id)), s = [];
  for (const d of n) {
    if (d.deletable === !1)
      continue;
    const h = i.has(d.id), g = !h && d.parentId && s.find((v) => v.id === d.parentId);
    (h || g) && s.push(d);
  }
  const a = new Set(t.map((d) => d.id)), c = o.filter((d) => d.deletable !== !1), u = Dd(s, c);
  for (const d of c)
    a.has(d.id) && !u.find((g) => g.id === d.id) && u.push(d);
  if (!r)
    return {
      edges: u,
      nodes: s
    };
  const f = await r({
    nodes: s,
    edges: u
  });
  return typeof f == "boolean" ? f ? { edges: u, nodes: s } : { edges: [], nodes: [] } : f;
}
const ct = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), Ke = (e = { x: 0, y: 0 }, t, n) => ({
  x: ct(e.x, t[0][0], t[1][0] - (n?.width ?? 0)),
  y: ct(e.y, t[0][1], t[1][1] - (n?.height ?? 0))
});
function Ti(e, t, n) {
  const { width: o, height: r } = be(n), { x: i, y: s } = n.internals.positionAbsolute;
  return Ke(e, [
    [i, s],
    [i + o, s + r]
  ], t);
}
const Qo = (e, t, n) => e < t ? ct(Math.abs(e - t), 1, t) / t : e > n ? -ct(Math.abs(e - n), 1, t) / t : 0, go = (e, t, n = 15, o = 40) => {
  const r = Qo(e.x, o, t.width - o) * n, i = Qo(e.y, o, t.height - o) * n;
  return [r, i];
}, wn = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), Kn = ({ x: e, y: t, width: n, height: o }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + o
}), vn = ({ x: e, y: t, x2: n, y2: o }) => ({
  x: e,
  y: t,
  width: n - e,
  height: o - t
}), Mt = (e, t = [0, 0]) => {
  const { x: n, y: o } = fo(e) ? e.internals.positionAbsolute : At(e, t);
  return {
    x: n,
    y: o,
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}, an = (e, t = [0, 0]) => {
  const { x: n, y: o } = fo(e) ? e.internals.positionAbsolute : At(e, t);
  return {
    x: n,
    y: o,
    x2: n + (e.measured?.width ?? e.width ?? e.initialWidth ?? 0),
    y2: o + (e.measured?.height ?? e.height ?? e.initialHeight ?? 0)
  };
}, Ri = (e, t) => vn(wn(Kn(e), Kn(t))), ji = (e, t, n, o, r, i, s, a) => {
  const c = Math.max(0, Math.min(e + n, r + s) - Math.max(e, r)), l = Math.max(0, Math.min(t + o, i + a) - Math.max(t, i));
  return Math.ceil(c * l);
}, cn = (e, t) => ji(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Jo = (e) => ye(e.width) && ye(e.height) && ye(e.x) && ye(e.y), ye = (e) => !isNaN(e) && isFinite(e), Di = (e, t) => (n, o) => {
}, Rt = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), jt = ({ x: e, y: t }, [n, o, r], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / r,
    y: (t - o) / r
  };
  return i ? Rt(a, s) : a;
}, lt = ({ x: e, y: t }, [n, o, r]) => ({
  x: e * r + n,
  y: t * r + o
});
function tt(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return console.error(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Bd(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = tt(e, n), r = tt(e, t);
    return {
      top: o,
      right: r,
      bottom: o,
      left: r,
      x: r * 2,
      y: o * 2
    };
  }
  if (typeof e == "object") {
    const o = tt(e.top ?? e.y ?? 0, n), r = tt(e.bottom ?? e.y ?? 0, n), i = tt(e.left ?? e.x ?? 0, t), s = tt(e.right ?? e.x ?? 0, t);
    return { top: o, right: s, bottom: r, left: i, x: i + s, y: o + r };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Vd(e, t, n, o, r, i) {
  const { x: s, y: a } = lt(e, [t, n, o]), { x: c, y: l } = lt({ x: e.x + e.width, y: e.y + e.height }, [t, n, o]), u = r - c, f = i - l;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(u),
    bottom: Math.floor(f)
  };
}
const po = (e, t, n, o, r, i) => {
  const s = Bd(i, t, n), a = (t - s.x) / e.width, c = (n - s.y) / e.height, l = Math.min(a, c), u = ct(l, o, r), f = e.x + e.width / 2, d = e.y + e.height / 2, h = t / 2 - f * u, g = n / 2 - d * u, v = Vd(e, h, g, u, t, n), x = {
    left: Math.min(v.left - s.left, 0),
    top: Math.min(v.top - s.top, 0),
    right: Math.min(v.right - s.right, 0),
    bottom: Math.min(v.bottom - s.bottom, 0)
  };
  return {
    x: h - x.left + x.right,
    y: g - x.top + x.bottom,
    zoom: u
  };
}, kt = () => typeof navigator < "u" && navigator?.userAgent?.indexOf("Mac") >= 0;
function Qe(e) {
  return e != null && e !== "parent";
}
function be(e) {
  return {
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}
function Hi(e) {
  return (e.measured?.width ?? e.width ?? e.initialWidth) !== void 0 && (e.measured?.height ?? e.height ?? e.initialHeight) !== void 0;
}
function zi(e, t = { width: 0, height: 0 }, n, o, r) {
  const i = { ...e }, s = o.get(n);
  if (s) {
    const a = s.origin || r;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function er(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Od() {
  let e, t;
  return { promise: new Promise((o, r) => {
    e = o, t = r;
  }), resolve: e, reject: t };
}
function Fd(e) {
  return { ...ki, ...e || {} };
}
function Li(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function xt(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: o, containerBounds: r }) {
  const { x: i, y: s } = xe(e), a = jt({ x: i - (r?.left ?? 0), y: s - (r?.top ?? 0) }, o), { x: c, y: l } = n ? Rt(a, t) : a;
  return {
    xSnapped: c,
    ySnapped: l,
    ...a
  };
}
const mo = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Bi = (e) => e?.getRootNode?.() || window?.document, Xd = ["INPUT", "SELECT", "TEXTAREA"];
function Vi(e) {
  const t = e.composedPath?.()?.[0] || e.target;
  return t?.nodeType !== 1 ? !1 : Xd.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const Oi = (e) => "clientX" in e, xe = (e, t) => {
  const n = Oi(e), o = n ? e.clientX : e.touches?.[0].clientX, r = n ? e.clientY : e.touches?.[0].clientY;
  return {
    x: o - (t?.left ?? 0),
    y: r - (t?.top ?? 0)
  };
}, tr = (e, t, n, o, r) => {
  const i = t.querySelectorAll(`.${e}`);
  return !i || !i.length ? null : Array.from(i).map((s) => {
    const a = s.getBoundingClientRect();
    return {
      id: s.getAttribute("data-handleid"),
      type: e,
      nodeId: r,
      position: s.getAttribute("data-handlepos"),
      x: (a.left - n.left) / o,
      y: (a.top - n.top) / o,
      ...mo(s)
    };
  });
};
function Fi({ sourceX: e, sourceY: t, targetX: n, targetY: o, sourceControlX: r, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const c = e * 0.125 + r * 0.375 + s * 0.375 + n * 0.125, l = t * 0.125 + i * 0.375 + a * 0.375 + o * 0.125, u = Math.abs(c - e), f = Math.abs(l - t);
  return [c, l, u, f];
}
function Ot(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function nr({ pos: e, x1: t, y1: n, x2: o, y2: r, c: i }) {
  switch (e) {
    case Y.Left:
      return [t - Ot(t - o, i), n];
    case Y.Right:
      return [t + Ot(o - t, i), n];
    case Y.Top:
      return [t, n - Ot(n - r, i)];
    case Y.Bottom:
      return [t, n + Ot(r - n, i)];
  }
}
function Xi({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: o, targetY: r, targetPosition: i = Y.Top, curvature: s = 0.25 }) {
  const [a, c] = nr({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r,
    c: s
  }), [l, u] = nr({
    pos: i,
    x1: o,
    y1: r,
    x2: e,
    y2: t,
    c: s
  }), [f, d, h, g] = Fi({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: a,
    sourceControlY: c,
    targetControlX: l,
    targetControlY: u
  });
  return [
    `M${e},${t} C${a},${c} ${l},${u} ${o},${r}`,
    f,
    d,
    h,
    g
  ];
}
function Yi({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const r = Math.abs(n - e) / 2, i = n < e ? n + r : n - r, s = Math.abs(o - t) / 2, a = o < t ? o + s : o - s;
  return [i, a, r, s];
}
function Yd({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: o = 0, elevateOnSelect: r = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return o;
  const s = r && n ? o + 1e3 : o, a = Math.max(e.parentId || r && e.selected ? e.internals.z : 0, t.parentId || r && t.selected ? t.internals.z : 0);
  return s + a;
}
function Wd({ sourceNode: e, targetNode: t, width: n, height: o, transform: r }) {
  const i = wn(an(e), an(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -r[0] / r[2],
    y: -r[1] / r[2],
    width: n / r[2],
    height: o / r[2]
  };
  return cn(s, vn(i)) > 0;
}
const Zd = ({ source: e, sourceHandle: t, target: n, targetHandle: o }) => `xy-edge__${e}${t || ""}-${n}${o || ""}`, qd = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Gd = (e, t, n = {}) => {
  if (!e.source || !e.target)
    return n.onError?.("006", we.error006()), t;
  const o = n.getEdgeId || Zd;
  let r;
  return $i(e) ? r = { ...e } : r = {
    ...e,
    id: o(e)
  }, qd(r, t) ? t : (r.sourceHandle === null && delete r.sourceHandle, r.targetHandle === null && delete r.targetHandle, t.concat(r));
};
function Wi({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const [r, i, s, a] = Yi({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, r, i, s, a];
}
const or = {
  [Y.Left]: { x: -1, y: 0 },
  [Y.Right]: { x: 1, y: 0 },
  [Y.Top]: { x: 0, y: -1 },
  [Y.Bottom]: { x: 0, y: 1 }
}, Ud = ({ source: e, sourcePosition: t = Y.Bottom, target: n }) => t === Y.Left || t === Y.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, rr = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Kd({ source: e, sourcePosition: t = Y.Bottom, target: n, targetPosition: o = Y.Top, center: r, offset: i, stepPosition: s }) {
  const a = or[t], c = or[o], l = { x: e.x + a.x * i, y: e.y + a.y * i }, u = { x: n.x + c.x * i, y: n.y + c.y * i }, f = Ud({
    source: l,
    sourcePosition: t,
    target: u
  }), d = f.x !== 0 ? "x" : "y", h = f[d];
  let g = [], v, x;
  const y = { x: 0, y: 0 }, C = { x: 0, y: 0 }, [, , m, b] = Yi({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[d] * c[d] === -1) {
    d === "x" ? (v = r.x ?? l.x + (u.x - l.x) * s, x = r.y ?? (l.y + u.y) / 2) : (v = r.x ?? (l.x + u.x) / 2, x = r.y ?? l.y + (u.y - l.y) * s);
    const A = [
      { x: v, y: l.y },
      { x: v, y: u.y }
    ], P = [
      { x: l.x, y: x },
      { x: u.x, y: x }
    ];
    a[d] === h ? g = d === "x" ? A : P : g = d === "x" ? P : A;
  } else {
    const A = [{ x: l.x, y: u.y }], P = [{ x: u.x, y: l.y }];
    if (d === "x" ? g = a.x === h ? P : A : g = a.y === h ? A : P, t === o) {
      const w = Math.abs(e[d] - n[d]);
      if (w <= i) {
        const N = Math.min(i - 1, i - w);
        a[d] === h ? y[d] = (l[d] > e[d] ? -1 : 1) * N : C[d] = (u[d] > n[d] ? -1 : 1) * N;
      }
    }
    if (t !== o) {
      const w = d === "x" ? "y" : "x", N = a[d] === c[w], _ = l[w] > u[w], $ = l[w] < u[w];
      (a[d] === 1 && (!N && _ || N && $) || a[d] !== 1 && (!N && $ || N && _)) && (g = d === "x" ? A : P);
    }
    const V = { x: l.x + y.x, y: l.y + y.y }, H = { x: u.x + C.x, y: u.y + C.y }, B = Math.max(Math.abs(V.x - g[0].x), Math.abs(H.x - g[0].x)), z = Math.max(Math.abs(V.y - g[0].y), Math.abs(H.y - g[0].y));
    B >= z ? (v = (V.x + H.x) / 2, x = g[0].y) : (v = g[0].x, x = (V.y + H.y) / 2);
  }
  const k = { x: l.x + y.x, y: l.y + y.y }, E = { x: u.x + C.x, y: u.y + C.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...k.x !== g[0].x || k.y !== g[0].y ? [k] : [],
    ...g,
    ...E.x !== g[g.length - 1].x || E.y !== g[g.length - 1].y ? [E] : [],
    n
  ], v, x, m, b];
}
function Qd(e, t, n, o) {
  const r = Math.min(rr(e, t) / 2, rr(t, n) / 2, o), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const l = e.x < n.x ? -1 : 1, u = e.y < n.y ? 1 : -1;
    return `L ${i + r * l},${s}Q ${i},${s} ${i},${s + r * u}`;
  }
  const a = e.x < n.x ? 1 : -1, c = e.y < n.y ? -1 : 1;
  return `L ${i},${s + r * c}Q ${i},${s} ${i + r * a},${s}`;
}
function ln({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: o, targetY: r, targetPosition: i = Y.Top, borderRadius: s = 5, centerX: a, centerY: c, offset: l = 20, stepPosition: u = 0.5 }) {
  const [f, d, h, g, v] = Kd({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: r },
    targetPosition: i,
    center: { x: a, y: c },
    offset: l,
    stepPosition: u
  });
  let x = `M${f[0].x} ${f[0].y}`;
  for (let y = 1; y < f.length - 1; y++)
    x += Qd(f[y - 1], f[y], f[y + 1], s);
  return x += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [x, d, h, g, v];
}
function ir(e) {
  return e && !!(e.internals.handleBounds || e.handles?.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Jd(e) {
  const { sourceNode: t, targetNode: n } = e;
  if (!ir(t) || !ir(n))
    return null;
  const o = t.internals.handleBounds || sr(t.handles), r = n.internals.handleBounds || sr(n.handles), i = ar(o?.source ?? [], e.sourceHandle), s = ar(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === at.Strict ? r?.target ?? [] : (r?.target ?? []).concat(r?.source ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return e.onError?.("008", we.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = i?.position || Y.Bottom, c = s?.position || Y.Top, l = Je(t, i, a), u = Je(n, s, c);
  return {
    sourceX: l.x,
    sourceY: l.y,
    targetX: u.x,
    targetY: u.y,
    sourcePosition: a,
    targetPosition: c
  };
}
function sr(e) {
  if (!e)
    return null;
  const t = [], n = [];
  for (const o of e)
    o.width = o.width ?? 1, o.height = o.height ?? 1, o.type === "source" ? t.push(o) : o.type === "target" && n.push(o);
  return {
    source: t,
    target: n
  };
}
function Je(e, t, n = Y.Left, o = !1) {
  const r = (t?.x ?? 0) + e.internals.positionAbsolute.x, i = (t?.y ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? be(e);
  if (o)
    return { x: r + s / 2, y: i + a / 2 };
  switch (t?.position ?? n) {
    case Y.Top:
      return { x: r + s / 2, y: i };
    case Y.Right:
      return { x: r + s, y: i + a / 2 };
    case Y.Bottom:
      return { x: r + s / 2, y: i + a };
    case Y.Left:
      return { x: r, y: i + a / 2 };
  }
}
function ar(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Qn(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}` : "";
}
function ef(e, { id: t, defaultColor: n, defaultMarkerStart: o, defaultMarkerEnd: r }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || o, a.markerEnd || r].forEach((c) => {
    if (c && typeof c == "object") {
      const l = Qn(c, t);
      i.has(l) || (s.push({ id: l, color: c.color || n, ...c }), i.add(l));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const Zi = 1e3, tf = 10, yo = {
  nodeOrigin: [0, 0],
  nodeExtent: _t,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, nf = {
  ...yo,
  checkEquality: !0
};
function xo(e, t) {
  const n = { ...e };
  for (const o in t)
    t[o] !== void 0 && (n[o] = t[o]);
  return n;
}
function of(e, t, n) {
  const o = xo(yo, n);
  for (const r of e.values())
    if (r.parentId)
      vo(r, e, t, o);
    else {
      const i = At(r, o.nodeOrigin), s = Qe(r.extent) ? r.extent : o.nodeExtent, a = Ke(i, s, be(r));
      r.internals.positionAbsolute = a;
    }
}
function rf(e, t) {
  if (!e.handles)
    return e.measured ? t?.internals.handleBounds : void 0;
  const n = [], o = [];
  for (const r of e.handles) {
    const i = {
      id: r.id,
      width: r.width ?? 1,
      height: r.height ?? 1,
      nodeId: e.id,
      x: r.x,
      y: r.y,
      position: r.position,
      type: r.type
    };
    r.type === "source" ? n.push(i) : r.type === "target" && o.push(i);
  }
  return {
    source: n,
    target: o
  };
}
function wo(e) {
  return e === "manual";
}
function Jn(e, t, n, o = {}) {
  const r = xo(nf, o), i = { i: 0 }, s = new Map(t), a = r?.elevateNodesOnSelect && !wo(r.zIndexMode) ? Zi : 0;
  let c = e.length > 0, l = !1;
  t.clear(), n.clear();
  for (const u of e) {
    let f = s.get(u.id);
    if (r.checkEquality && u === f?.internals.userNode)
      t.set(u.id, f);
    else {
      const d = At(u, r.nodeOrigin), h = Qe(u.extent) ? u.extent : r.nodeExtent, g = Ke(d, h, be(u));
      f = {
        ...r.defaults,
        ...u,
        measured: {
          width: u.measured?.width,
          height: u.measured?.height
        },
        internals: {
          positionAbsolute: g,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: rf(u, f),
          z: qi(u, a, r.zIndexMode),
          userNode: u
        }
      }, t.set(u.id, f);
    }
    (f.measured === void 0 || f.measured.width === void 0 || f.measured.height === void 0) && !f.hidden && (c = !1), u.parentId && vo(f, t, n, o, i), l ||= u.selected ?? !1;
  }
  return { nodesInitialized: c, hasSelectedNodes: l };
}
function sf(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function vo(e, t, n, o, r) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: c } = xo(yo, o), l = e.parentId, u = t.get(l);
  if (!u) {
    console.warn(`Parent node ${l} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  sf(e, n), r && !u.parentId && u.internals.rootParentIndex === void 0 && c === "auto" && (u.internals.rootParentIndex = ++r.i, u.internals.z = u.internals.z + r.i * tf), r && u.internals.rootParentIndex !== void 0 && (r.i = u.internals.rootParentIndex);
  const f = i && !wo(c) ? Zi : 0, { x: d, y: h, z: g } = af(e, u, s, a, f, c), { positionAbsolute: v } = e.internals, x = d !== v.x || h !== v.y;
  (x || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: x ? { x: d, y: h } : v,
      z: g
    }
  });
}
function qi(e, t, n) {
  const o = ye(e.zIndex) ? e.zIndex : 0;
  return wo(n) ? o : o + (e.selected ? t : 0);
}
function af(e, t, n, o, r, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, c = be(e), l = At(e, n), u = Qe(e.extent) ? Ke(l, e.extent, c) : l;
  let f = Ke({ x: s + u.x, y: a + u.y }, o, c);
  e.extent === "parent" && (f = Ti(f, c, t));
  const d = qi(e, r, i), h = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: h >= d ? h + 1 : d
  };
}
function bo(e, t, n, o = [0, 0]) {
  const r = [], i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const a = t.get(s.parentId);
    if (!a)
      continue;
    const c = i.get(s.parentId)?.expandedRect ?? Mt(a), l = Ri(c, s.rect);
    i.set(s.parentId, { expandedRect: l, parent: a });
  }
  return i.size > 0 && i.forEach(({ expandedRect: s, parent: a }, c) => {
    const l = a.internals.positionAbsolute, u = be(a), f = a.origin ?? o, d = s.x < l.x ? Math.round(Math.abs(l.x - s.x)) : 0, h = s.y < l.y ? Math.round(Math.abs(l.y - s.y)) : 0, g = Math.max(u.width, Math.round(s.width)), v = Math.max(u.height, Math.round(s.height)), x = (g - u.width) * f[0], y = (v - u.height) * f[1];
    (d > 0 || h > 0 || x || y) && (r.push({
      id: c,
      type: "position",
      position: {
        x: a.position.x - d + x,
        y: a.position.y - h + y
      }
    }), n.get(c)?.forEach((C) => {
      e.some((m) => m.id === C.id) || r.push({
        id: C.id,
        type: "position",
        position: {
          x: C.position.x + d,
          y: C.position.y + h
        }
      });
    })), (u.width < s.width || u.height < s.height || d || h) && r.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: g + (d ? f[0] * d - x : 0),
        height: v + (h ? f[1] * h - y : 0)
      }
    });
  }), r;
}
function cf(e, t, n, o, r, i, s) {
  const a = o?.querySelector(".xyflow__viewport");
  let c = !1;
  if (!a)
    return { changes: [], updatedInternals: c };
  const l = [], u = window.getComputedStyle(a), { m22: f } = new window.DOMMatrixReadOnly(u.transform), d = [];
  for (const h of e.values()) {
    const g = t.get(h.id);
    if (!g)
      continue;
    if (g.hidden) {
      t.set(g.id, {
        ...g,
        internals: {
          ...g.internals,
          handleBounds: void 0
        }
      }), c = !0;
      continue;
    }
    const v = mo(h.nodeElement), x = g.measured.width !== v.width || g.measured.height !== v.height;
    if (!!(v.width && v.height && (x || !g.internals.handleBounds || h.force))) {
      const C = h.nodeElement.getBoundingClientRect(), m = Qe(g.extent) ? g.extent : i;
      let { positionAbsolute: b } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const E = t.get(g.parentId);
        E && (b = Ti(b, v, E));
      } else m && (b = Ke(b, m, v));
      const k = {
        ...g,
        measured: v,
        internals: {
          ...g.internals,
          positionAbsolute: b,
          handleBounds: {
            source: tr("source", h.nodeElement, C, f, g.id),
            target: tr("target", h.nodeElement, C, f, g.id)
          }
        }
      };
      t.set(g.id, k), g.parentId && vo(k, t, n, { nodeOrigin: r, zIndexMode: s }), c = !0, x && (l.push({
        id: g.id,
        type: "dimensions",
        dimensions: v
      }), g.expandParent && g.parentId && d.push({
        id: g.id,
        parentId: g.parentId,
        rect: Mt(k, r)
      }));
    }
  }
  if (d.length > 0) {
    const h = bo(d, t, n, r);
    l.push(...h);
  }
  return { changes: l, updatedInternals: c };
}
async function lf({ delta: e, panZoom: t, transform: n, translateExtent: o, width: r, height: i }) {
  if (!t || !e.x && !e.y)
    return !1;
  const s = await t.setViewportConstrained({
    x: n[0] + e.x,
    y: n[1] + e.y,
    zoom: n[2]
  }, [
    [0, 0],
    [r, i]
  ], o);
  return !!s && (s.x !== n[0] || s.y !== n[1] || s.k !== n[2]);
}
function cr(e, t, n, o, r, i) {
  let s = r;
  const a = o.get(s) || /* @__PURE__ */ new Map();
  o.set(s, a.set(n, t)), s = `${r}-${e}`;
  const c = o.get(s) || /* @__PURE__ */ new Map();
  if (o.set(s, c.set(n, t)), i) {
    s = `${r}-${e}-${i}`;
    const l = o.get(s) || /* @__PURE__ */ new Map();
    o.set(s, l.set(n, t));
  }
}
function Gi(e, t, n) {
  e.clear(), t.clear();
  for (const o of n) {
    const { source: r, target: i, sourceHandle: s = null, targetHandle: a = null } = o, c = { edgeId: o.id, source: r, target: i, sourceHandle: s, targetHandle: a }, l = `${r}-${s}--${i}-${a}`, u = `${i}-${a}--${r}-${s}`;
    cr("source", c, u, e, r, s), cr("target", c, l, e, i, a), t.set(o.id, o);
  }
}
function Ui(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Ui(n, t) : !1;
}
function lr(e, t, n) {
  let o = e;
  do {
    if (o?.matches?.(t))
      return !0;
    if (o === n)
      return !1;
    o = o?.parentElement;
  } while (o);
  return !1;
}
function uf(e, t, n, o) {
  const r = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === o) && (!s.parentId || !Ui(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
      const a = e.get(i);
      a && r.set(i, {
        id: i,
        position: a.position || { x: 0, y: 0 },
        distance: {
          x: n.x - a.internals.positionAbsolute.x,
          y: n.y - a.internals.positionAbsolute.y
        },
        extent: a.extent,
        parentId: a.parentId,
        origin: a.origin,
        expandParent: a.expandParent,
        internals: {
          positionAbsolute: a.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: a.measured.width ?? 0,
          height: a.measured.height ?? 0
        }
      });
    }
  return r;
}
function Tn({ nodeId: e, dragItems: t, nodeLookup: n, dragging: o = !0 }) {
  const r = [];
  for (const [s, a] of t) {
    const c = n.get(s)?.internals.userNode;
    c && r.push({
      ...c,
      position: a.position,
      dragging: o
    });
  }
  if (!e)
    return [r[0], r];
  const i = n.get(e)?.internals.userNode;
  return [
    i ? {
      ...i,
      position: t.get(e)?.position || i.position,
      dragging: o
    } : r[0],
    r
  ];
}
function df({ dragItems: e, snapGrid: t, x: n, y: o }) {
  const r = e.values().next().value;
  if (!r)
    return null;
  const i = {
    x: n - r.distance.x,
    y: o - r.distance.y
  }, s = Rt(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function ff({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: o, onDragStop: r }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), c = !1, l = { x: 0, y: 0 }, u = null, f = !1, d = null, h = !1, g = !1, v = null;
  function x({ noDragClassName: C, handleSelector: m, domNode: b, isSelectable: k, nodeId: E, nodeClickDistance: M = 0 }) {
    d = fe(b);
    function A({ x: B, y: z }) {
      const { nodeLookup: w, nodeExtent: N, snapGrid: _, snapToGrid: $, nodeOrigin: R, onNodeDrag: T, onSelectionDrag: L, onError: S, updateNodePositions: j } = t();
      i = { x: B, y: z };
      let X = !1;
      const F = a.size > 1, q = F && N ? Kn(Tt(a)) : null, K = F && $ ? df({
        dragItems: a,
        snapGrid: _,
        x: B,
        y: z
      }) : null;
      for (const [W, D] of a) {
        if (!w.has(W))
          continue;
        let O = { x: B - D.distance.x, y: z - D.distance.y };
        $ && (O = K ? {
          x: Math.round(O.x + K.x),
          y: Math.round(O.y + K.y)
        } : Rt(O, _));
        let Q = null;
        if (F && N && !D.extent && q) {
          const { positionAbsolute: G } = D.internals, J = G.x - q.x + N[0][0], ee = G.x + D.measured.width - q.x2 + N[1][0], ne = G.y - q.y + N[0][1], ae = G.y + D.measured.height - q.y2 + N[1][1];
          Q = [
            [J, ne],
            [ee, ae]
          ];
        }
        const { position: U, positionAbsolute: Z } = Ai({
          nodeId: W,
          nextPosition: O,
          nodeLookup: w,
          nodeExtent: Q || N,
          nodeOrigin: R,
          onError: S
        });
        X = X || D.position.x !== U.x || D.position.y !== U.y, D.position = U, D.internals.positionAbsolute = Z;
      }
      if (g = g || X, !!X && (j(a, !0), v && (o || T || !E && L))) {
        const [W, D] = Tn({
          nodeId: E,
          dragItems: a,
          nodeLookup: w
        });
        o?.(v, a, W, D), T?.(v, W, D), E || L?.(v, D);
      }
    }
    async function P() {
      if (!u)
        return;
      const { transform: B, panBy: z, autoPanSpeed: w, autoPanOnNodeDrag: N } = t();
      if (!N) {
        c = !1, cancelAnimationFrame(s);
        return;
      }
      const [_, $] = go(l, u, w);
      (_ !== 0 || $ !== 0) && (i.x = (i.x ?? 0) - _ / B[2], i.y = (i.y ?? 0) - $ / B[2], await z({ x: _, y: $ }) && A(i)), s = requestAnimationFrame(P);
    }
    function V(B) {
      const { nodeLookup: z, multiSelectionActive: w, nodesDraggable: N, transform: _, snapGrid: $, snapToGrid: R, selectNodesOnDrag: T, onNodeDragStart: L, onSelectionDragStart: S, unselectNodesAndEdges: j } = t();
      f = !0, (!T || !k) && !w && E && (z.get(E)?.selected || j()), k && T && E && e?.(E);
      const X = xt(B.sourceEvent, { transform: _, snapGrid: $, snapToGrid: R, containerBounds: u });
      if (i = X, a = uf(z, N, X, E), a.size > 0 && (n || L || !E && S)) {
        const [F, q] = Tn({
          nodeId: E,
          dragItems: a,
          nodeLookup: z
        });
        n?.(B.sourceEvent, a, F, q), L?.(B.sourceEvent, F, q), E || S?.(B.sourceEvent, q);
      }
    }
    const H = di().clickDistance(M).on("start", (B) => {
      const { domNode: z, nodeDragThreshold: w, transform: N, snapGrid: _, snapToGrid: $ } = t();
      u = z?.getBoundingClientRect() || null, h = !1, g = !1, v = B.sourceEvent, w === 0 && V(B), i = xt(B.sourceEvent, { transform: N, snapGrid: _, snapToGrid: $, containerBounds: u }), l = xe(B.sourceEvent, u);
    }).on("drag", (B) => {
      const { autoPanOnNodeDrag: z, transform: w, snapGrid: N, snapToGrid: _, nodeDragThreshold: $, nodeLookup: R } = t(), T = xt(B.sourceEvent, { transform: w, snapGrid: N, snapToGrid: _, containerBounds: u });
      if (v = B.sourceEvent, (B.sourceEvent.type === "touchmove" && B.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      E && !R.has(E)) && (h = !0), !h) {
        if (!c && z && f && (c = !0, P()), !f) {
          const L = xe(B.sourceEvent, u), S = L.x - l.x, j = L.y - l.y;
          Math.sqrt(S * S + j * j) > $ && V(B);
        }
        (i.x !== T.xSnapped || i.y !== T.ySnapped) && a && f && (l = xe(B.sourceEvent, u), A(T));
      }
    }).on("end", (B) => {
      if (!f || h) {
        h && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (c = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: z, updateNodePositions: w, onNodeDragStop: N, onSelectionDragStop: _ } = t();
        if (g && (w(a, !1), g = !1), r || N || !E && _) {
          const [$, R] = Tn({
            nodeId: E,
            dragItems: a,
            nodeLookup: z,
            dragging: !1
          });
          r?.(B.sourceEvent, a, $, R), N?.(B.sourceEvent, $, R), E || _?.(B.sourceEvent, R);
        }
      }
    }).filter((B) => {
      const z = B.target;
      return !B.button && (!C || !lr(z, `.${C}`, b)) && (!m || lr(z, m, b));
    });
    d.call(H);
  }
  function y() {
    d?.on(".drag", null);
  }
  return {
    update: x,
    destroy: y
  };
}
function hf(e, t, n) {
  const o = [], r = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    cn(r, Mt(i)) > 0 && o.push(i);
  return o;
}
const gf = 250;
function pf(e, t, n, o) {
  let r = [], i = 1 / 0;
  const s = hf(e, n, t + gf);
  for (const a of s) {
    const c = [...a.internals.handleBounds?.source ?? [], ...a.internals.handleBounds?.target ?? []];
    for (const l of c) {
      if (o.nodeId === l.nodeId && o.type === l.type && o.id === l.id)
        continue;
      const { x: u, y: f } = Je(a, l, l.position, !0), d = Math.sqrt(Math.pow(u - e.x, 2) + Math.pow(f - e.y, 2));
      d > t || (d < i ? (r = [{ ...l, x: u, y: f }], i = d) : d === i && r.push({ ...l, x: u, y: f }));
    }
  }
  if (!r.length)
    return null;
  if (r.length > 1) {
    const a = o.type === "source" ? "target" : "source";
    return r.find((c) => c.type === a) ?? r[0];
  }
  return r[0];
}
function Ki(e, t, n, o, r, i = !1) {
  const s = o.get(e);
  if (!s)
    return null;
  const a = r === "strict" ? s.internals.handleBounds?.[t] : [...s.internals.handleBounds?.source ?? [], ...s.internals.handleBounds?.target ?? []], c = (n ? a?.find((l) => l.id === n) : a?.[0]) ?? null;
  return c && i ? { ...c, ...Je(s, c, c.position, !0) } : c;
}
function Qi(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function mf(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Ji = () => !0;
function yf(e, { connectionMode: t, connectionRadius: n, handleId: o, nodeId: r, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: c, lib: l, autoPanOnConnect: u, flowId: f, panBy: d, cancelConnection: h, onConnectStart: g, onConnect: v, onConnectEnd: x, isValidConnection: y = Ji, onReconnectEnd: C, updateConnection: m, getTransform: b, getFromHandle: k, autoPanSpeed: E, dragThreshold: M = 1, handleDomNode: A }) {
  const P = Bi(e.target);
  let V = 0, H;
  const { x: B, y: z } = xe(e), w = Qi(i, A), N = a?.getBoundingClientRect();
  let _ = !1;
  if (!N || !w)
    return;
  const $ = Ki(r, w, o, c, t);
  if (!$)
    return;
  let R = xe(e, N), T = !1, L = null, S = !1, j = null;
  function X() {
    if (!u || !N)
      return;
    const [U, Z] = go(R, N, E);
    d({ x: U, y: Z }), V = requestAnimationFrame(X);
  }
  const F = {
    ...$,
    nodeId: r,
    type: w,
    position: $.position
  }, q = c.get(r);
  let W = {
    inProgress: !0,
    isValid: null,
    from: Je(q, F, Y.Left, !0),
    fromHandle: F,
    fromPosition: F.position,
    fromNode: q,
    to: R,
    toHandle: null,
    toPosition: Ko[F.position],
    toNode: null,
    pointer: R
  };
  function D() {
    _ = !0, m(W), g?.(e, { nodeId: r, handleId: o, handleType: w });
  }
  M === 0 && D();
  function O(U) {
    if (!_) {
      const { x: ae, y: ke } = xe(U), Se = ae - B, Ee = ke - z;
      if (!(Se * Se + Ee * Ee > M * M))
        return;
      D();
    }
    if (!k() || !F) {
      Q(U);
      return;
    }
    const Z = b();
    R = xe(U, N), H = pf(jt(R, Z, !1, [1, 1]), n, c, F), T || (X(), T = !0);
    const G = es(U, {
      handle: H,
      connectionMode: t,
      fromNodeId: r,
      fromHandleId: o,
      fromType: s ? "target" : "source",
      isValidConnection: y,
      doc: P,
      lib: l,
      flowId: f,
      nodeLookup: c
    });
    j = G.handleDomNode, L = G.connection, S = mf(!!H, G.isValid);
    const J = c.get(r), ee = J ? Je(J, F, Y.Left, !0) : W.from, ne = {
      ...W,
      from: ee,
      isValid: S,
      to: G.toHandle && S ? lt({ x: G.toHandle.x, y: G.toHandle.y }, Z) : R,
      toHandle: G.toHandle,
      toPosition: S && G.toHandle ? G.toHandle.position : Ko[F.position],
      toNode: G.toHandle ? c.get(G.toHandle.nodeId) : null,
      pointer: R
    };
    m(ne), W = ne;
  }
  function Q(U) {
    if (!("touches" in U && U.touches.length > 0)) {
      if (_) {
        (H || j) && L && S && v?.(L);
        const { inProgress: Z, ...G } = W, J = {
          ...G,
          toPosition: W.toHandle ? W.toPosition : null
        };
        x?.(U, J), i && C?.(U, J);
      }
      h(), cancelAnimationFrame(V), T = !1, S = !1, L = null, j = null, P.removeEventListener("mousemove", O), P.removeEventListener("mouseup", Q), P.removeEventListener("touchmove", O), P.removeEventListener("touchend", Q);
    }
  }
  P.addEventListener("mousemove", O), P.addEventListener("mouseup", Q), P.addEventListener("touchmove", O), P.addEventListener("touchend", Q);
}
function es(e, { handle: t, connectionMode: n, fromNodeId: o, fromHandleId: r, fromType: i, doc: s, lib: a, flowId: c, isValidConnection: l = Ji, nodeLookup: u }) {
  const f = i === "target", d = t ? s.querySelector(`.${a}-flow__handle[data-id="${c}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: h, y: g } = xe(e), v = s.elementFromPoint(h, g), x = v?.classList.contains(`${a}-flow__handle`) ? v : d, y = {
    handleDomNode: x,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (x) {
    const C = Qi(void 0, x), m = x.getAttribute("data-nodeid"), b = x.getAttribute("data-handleid"), k = x.classList.contains("connectable"), E = x.classList.contains("connectableend");
    if (!m || !C)
      return y;
    const M = {
      source: f ? m : o,
      sourceHandle: f ? b : r,
      target: f ? o : m,
      targetHandle: f ? r : b
    };
    y.connection = M;
    const P = k && E && (n === at.Strict ? f && C === "source" || !f && C === "target" : m !== o || b !== r);
    y.isValid = P && l(M), y.toHandle = Ki(m, C, b, u, n, !0);
  }
  return y;
}
const eo = {
  onPointerDown: yf,
  isValid: es
};
function xf({ domNode: e, panZoom: t, getTransform: n, getViewScale: o }) {
  const r = fe(e);
  function i({ translateExtent: a, width: c, height: l, zoomStep: u = 1, pannable: f = !0, zoomable: d = !0, inversePan: h = !1 }) {
    const g = (m) => {
      if (m.sourceEvent.type !== "wheel" || !t)
        return;
      const b = n(), k = m.sourceEvent.ctrlKey && kt() ? 10 : 1, E = -m.sourceEvent.deltaY * (m.sourceEvent.deltaMode === 1 ? 0.05 : m.sourceEvent.deltaMode ? 1 : 2e-3) * u, M = b[2] * Math.pow(2, E * k);
      t.scaleTo(M);
    };
    let v = [0, 0];
    const x = (m) => {
      (m.sourceEvent.type === "mousedown" || m.sourceEvent.type === "touchstart") && (v = [
        m.sourceEvent.clientX ?? m.sourceEvent.touches[0].clientX,
        m.sourceEvent.clientY ?? m.sourceEvent.touches[0].clientY
      ]);
    }, y = (m) => {
      const b = n();
      if (m.sourceEvent.type !== "mousemove" && m.sourceEvent.type !== "touchmove" || !t)
        return;
      const k = [
        m.sourceEvent.clientX ?? m.sourceEvent.touches[0].clientX,
        m.sourceEvent.clientY ?? m.sourceEvent.touches[0].clientY
      ], E = [k[0] - v[0], k[1] - v[1]];
      v = k;
      const M = o() * Math.max(b[2], Math.log(b[2])) * (h ? -1 : 1), A = {
        x: b[0] - E[0] * M,
        y: b[1] - E[1] * M
      }, P = [
        [0, 0],
        [c, l]
      ];
      t.setViewportConstrained({
        x: A.x,
        y: A.y,
        zoom: b[2]
      }, P, a);
    }, C = Ni().on("start", x).on("zoom", f ? y : null).on("zoom.wheel", d ? g : null);
    r.call(C, {});
  }
  function s() {
    r.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: pe
  };
}
const bn = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Rn = ({ x: e, y: t, zoom: n }) => xn.translate(e, t).scale(n), ze = (e, t) => e.target.closest(`.${t}`), ts = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), wf = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, jn = (e, t = 0, n = wf, o = () => {
}) => {
  const r = typeof t == "number" && t > 0;
  return r || o(), r ? e.transition().duration(t).ease(n).on("end", o) : e;
}, ns = (e) => {
  const t = e.ctrlKey && kt() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function vf({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: o, panOnScrollMode: r, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: c, onPanZoomEnd: l }) {
  return (u) => {
    if (ze(u, t))
      return u.ctrlKey && u.preventDefault(), !1;
    u.preventDefault(), u.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (u.ctrlKey && s) {
      const x = pe(u), y = ns(u), C = f * Math.pow(2, y);
      o.scaleTo(n, C, x, u);
      return;
    }
    const d = u.deltaMode === 1 ? 20 : 1;
    let h = r === qe.Vertical ? 0 : u.deltaX * d, g = r === qe.Horizontal ? 0 : u.deltaY * d;
    !kt() && u.shiftKey && r !== qe.Vertical && (h = u.deltaY * d, g = 0), o.translateBy(
      n,
      -(h / f) * i,
      -(g / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const v = bn(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? c?.(u, v) : (e.isPanScrolling = !0, a?.(u, v)), e.panScrollTimeout = setTimeout(() => {
      l?.(u, v), e.isPanScrolling = !1;
    }, 150);
  };
}
function bf({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(o, r) {
    const i = o.type === "wheel", s = !t && i && !o.ctrlKey, a = ze(o, e);
    if (o.ctrlKey && i && a && o.preventDefault(), s || a)
      return null;
    o.preventDefault(), n.call(this, o, r);
  };
}
function Sf({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (o) => {
    if (o.sourceEvent?.internal)
      return;
    const r = bn(o.transform);
    e.mouseButton = o.sourceEvent?.button || 0, e.isZoomingOrPanning = !0, e.prevViewport = r, o.sourceEvent?.type === "mousedown" && t(!0), n && n?.(o.sourceEvent, r);
  };
}
function Ef({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: o, onPanZoom: r }) {
  return (i) => {
    e.usedRightMouseButton = !!(n && ts(t, e.mouseButton ?? 0)), i.sourceEvent?.sync || o([i.transform.x, i.transform.y, i.transform.k]), r && !i.sourceEvent?.internal && r?.(i.sourceEvent, bn(i.transform));
  };
}
function _f({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: o, onPanZoomEnd: r, onPaneContextMenu: i }) {
  return (s) => {
    if (!s.sourceEvent?.internal && (e.isZoomingOrPanning = !1, i && ts(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, o(!1), r)) {
      const a = bn(s.transform);
      e.prevViewport = a, clearTimeout(e.timerId), e.timerId = setTimeout(
        () => {
          r?.(s.sourceEvent, a);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        n ? 150 : 0
      );
    }
  };
}
function Cf({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: o, panOnDrag: r, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: c, noPanClassName: l, lib: u, connectionInProgress: f }) {
  return (d) => {
    const h = t || n, g = o && d.ctrlKey, v = d.type === "wheel";
    if (d.button === 1 && d.type === "mousedown" && (ze(d, `${u}-flow__node`) || ze(d, `${u}-flow__edge`) || ze(d, `${u}-flow__selection`) || ze(d, `${u}-flow__nodesselection`)))
      return !0;
    if (!r && !h && !i && !s && !o || a || f && !v || ze(d, c) && v || ze(d, l) && (!v || i && v && !t) || !o && d.ctrlKey && v)
      return !1;
    if (!o && d.type === "touchstart" && d.touches?.length > 1)
      return d.preventDefault(), !1;
    if (!h && !i && !g && v || !r && (d.type === "mousedown" || d.type === "touchstart") || Array.isArray(r) && !r.includes(d.button) && d.type === "mousedown")
      return !1;
    const x = Array.isArray(r) && r.includes(d.button) || !d.button || d.button <= 1;
    return (!d.ctrlKey || v || e) && x;
  };
}
function Nf({ domNode: e, minZoom: t, maxZoom: n, translateExtent: o, viewport: r, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: c }) {
  const l = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, u = e.getBoundingClientRect();
  let f = [
    [0, 0],
    [u.width, u.height]
  ];
  (typeof ResizeObserver < "u" ? new ResizeObserver((z) => {
    const w = z[0];
    w && (f = [
      [0, 0],
      [w.contentRect.width, w.contentRect.height]
    ]);
  }) : null)?.observe(e);
  const h = Ni().extent(() => f).scaleExtent([t, n]).translateExtent(o), g = fe(e).call(h);
  b({
    x: r.x,
    y: r.y,
    zoom: ct(r.zoom, t, n)
  }, [
    [0, 0],
    [u.width, u.height]
  ], o);
  const v = g.on("wheel.zoom"), x = g.on("dblclick.zoom");
  h.wheelDelta(ns);
  async function y(z, w) {
    return g ? new Promise((N) => {
      h?.interpolate(w?.interpolate === "linear" ? yt : Gt).transform(jn(g, w?.duration, w?.ease, () => N(!0)), z);
    }) : !1;
  }
  function C({ noWheelClassName: z, noPanClassName: w, onPaneContextMenu: N, userSelectionActive: _, panOnScroll: $, panOnDrag: R, panOnScrollMode: T, panOnScrollSpeed: L, preventScrolling: S, zoomOnPinch: j, zoomOnScroll: X, zoomOnDoubleClick: F, panActivationKeyPressed: q = !1, zoomActivationKeyPressed: K, lib: W, onTransformChange: D, connectionInProgress: O, paneClickDistance: Q, selectionOnDrag: U }) {
    _ && !l.isZoomingOrPanning && m();
    const Z = $ && !K && !_;
    h.clickDistance(U ? 1 / 0 : !ye(Q) || Q < 0 ? 0 : Q);
    const G = Z ? vf({
      zoomPanValues: l,
      noWheelClassName: z,
      d3Selection: g,
      d3Zoom: h,
      panOnScrollMode: T,
      panOnScrollSpeed: L,
      zoomOnPinch: j,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : bf({
      noWheelClassName: z,
      preventScrolling: S,
      d3ZoomHandler: v
    });
    g.on("wheel.zoom", G, { passive: !1 });
    const J = Sf({
      zoomPanValues: l,
      onDraggingChange: c,
      onPanZoomStart: s
    });
    h.on("start", J);
    const ee = Ef({
      zoomPanValues: l,
      panOnDrag: R,
      onPaneContextMenu: !!N,
      onPanZoom: i,
      onTransformChange: D
    });
    h.on("zoom", ee);
    const ne = _f({
      zoomPanValues: l,
      panOnDrag: R,
      panOnScroll: $,
      onPaneContextMenu: N,
      onPanZoomEnd: a,
      onDraggingChange: c
    });
    h.on("end", ne);
    const ae = Cf({
      panActivationKeyPressed: q,
      zoomActivationKeyPressed: K,
      panOnDrag: R,
      zoomOnScroll: X,
      panOnScroll: $,
      zoomOnDoubleClick: F,
      zoomOnPinch: j,
      userSelectionActive: _,
      noPanClassName: w,
      noWheelClassName: z,
      lib: W,
      connectionInProgress: O
    });
    h.filter(ae), F ? g.on("dblclick.zoom", x) : g.on("dblclick.zoom", null);
  }
  function m() {
    h.on("zoom", null);
  }
  async function b(z, w, N) {
    const _ = Rn(z), $ = h?.constrain()(_, w, N);
    return $ && await y($), $;
  }
  async function k(z, w) {
    const N = Rn(z);
    return await y(N, w), N;
  }
  function E(z) {
    if (g) {
      const w = Rn(z), N = g.property("__zoom");
      (N.k !== z.zoom || N.x !== z.x || N.y !== z.y) && h?.transform(g, w, null, { sync: !0 });
    }
  }
  function M() {
    const z = g ? Ci(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: z.x, y: z.y, zoom: z.k };
  }
  async function A(z, w) {
    return g ? new Promise((N) => {
      h?.interpolate(w?.interpolate === "linear" ? yt : Gt).scaleTo(jn(g, w?.duration, w?.ease, () => N(!0)), z);
    }) : !1;
  }
  async function P(z, w) {
    return g ? new Promise((N) => {
      h?.interpolate(w?.interpolate === "linear" ? yt : Gt).scaleBy(jn(g, w?.duration, w?.ease, () => N(!0)), z);
    }) : !1;
  }
  function V(z) {
    h?.scaleExtent(z);
  }
  function H(z) {
    h?.translateExtent(z);
  }
  function B(z) {
    const w = !ye(z) || z < 0 ? 0 : z;
    h?.clickDistance(w);
  }
  return {
    update: C,
    destroy: m,
    setViewport: k,
    setViewportConstrained: b,
    getViewport: M,
    scaleTo: A,
    scaleBy: P,
    setScaleExtent: V,
    setTranslateExtent: H,
    syncViewport: E,
    setClickDistance: B
  };
}
var ut;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(ut || (ut = {}));
function Mf({ width: e, prevWidth: t, height: n, prevHeight: o, affectsX: r, affectsY: i }) {
  const s = e - t, a = n - o, c = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && r && (c[0] = c[0] * -1), a && i && (c[1] = c[1] * -1), c;
}
function ur(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), o = e.includes("left"), r = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: o,
    affectsY: r
  };
}
function De(e, t) {
  return Math.max(0, t - e);
}
function He(e, t) {
  return Math.max(0, e - t);
}
function Ft(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function dr(e, t) {
  return e ? !t : t;
}
function kf(e, t, n, o, r, i, s, a) {
  let { affectsX: c, affectsY: l } = t;
  const { isHorizontal: u, isVertical: f } = t, d = u && f, { xSnapped: h, ySnapped: g } = n, { minWidth: v, maxWidth: x, minHeight: y, maxHeight: C } = o, { x: m, y: b, width: k, height: E, aspectRatio: M } = e;
  let A = Math.floor(u ? h - e.pointerX : 0), P = Math.floor(f ? g - e.pointerY : 0);
  const V = k + (c ? -A : A), H = E + (l ? -P : P), B = -i[0] * k, z = -i[1] * E;
  let w = Ft(V, v, x), N = Ft(H, y, C);
  if (s) {
    let R = 0, T = 0;
    c && A < 0 ? R = De(m + A + B, s[0][0]) : !c && A > 0 && (R = He(m + V + B, s[1][0])), l && P < 0 ? T = De(b + P + z, s[0][1]) : !l && P > 0 && (T = He(b + H + z, s[1][1])), w = Math.max(w, R), N = Math.max(N, T);
  }
  if (a) {
    let R = 0, T = 0;
    c && A > 0 ? R = He(m + A, a[0][0]) : !c && A < 0 && (R = De(m + V, a[1][0])), l && P > 0 ? T = He(b + P, a[0][1]) : !l && P < 0 && (T = De(b + H, a[1][1])), w = Math.max(w, R), N = Math.max(N, T);
  }
  if (r) {
    if (u) {
      const R = Ft(V / M, y, C) * M;
      if (w = Math.max(w, R), s) {
        let T = 0;
        !c && !l || c && !l && d ? T = He(b + z + V / M, s[1][1]) * M : T = De(b + z + (c ? A : -A) / M, s[0][1]) * M, w = Math.max(w, T);
      }
      if (a) {
        let T = 0;
        !c && !l || c && !l && d ? T = De(b + V / M, a[1][1]) * M : T = He(b + (c ? A : -A) / M, a[0][1]) * M, w = Math.max(w, T);
      }
    }
    if (f) {
      const R = Ft(H * M, v, x) / M;
      if (N = Math.max(N, R), s) {
        let T = 0;
        !c && !l || l && !c && d ? T = He(m + H * M + B, s[1][0]) / M : T = De(m + (l ? P : -P) * M + B, s[0][0]) / M, N = Math.max(N, T);
      }
      if (a) {
        let T = 0;
        !c && !l || l && !c && d ? T = De(m + H * M, a[1][0]) / M : T = He(m + (l ? P : -P) * M, a[0][0]) / M, N = Math.max(N, T);
      }
    }
  }
  P = P + (P < 0 ? N : -N), A = A + (A < 0 ? w : -w), r && (d ? V > H * M ? P = (dr(c, l) ? -A : A) / M : A = (dr(c, l) ? -P : P) * M : u ? (P = A / M, l = c) : (A = P * M, c = l));
  const _ = c ? m + A : m, $ = l ? b + P : b;
  return {
    width: k + (c ? -A : A),
    height: E + (l ? -P : P),
    x: i[0] * A * (c ? -1 : 1) + _,
    y: i[1] * P * (l ? -1 : 1) + $
  };
}
const os = { width: 0, height: 0, x: 0, y: 0 }, If = {
  ...os,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function $f(e, t, n) {
  const o = t.position.x + e.position.x, r = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, c = n[1] * s;
  return [
    [o - a, r - c],
    [o + i - a, r + s - c]
  ];
}
function Pf({ domNode: e, nodeId: t, getStoreItems: n, onChange: o, onEnd: r }) {
  const i = fe(e);
  let s = {
    controlDirection: ur("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: l, boundaries: u, keepAspectRatio: f, resizeDirection: d, onResizeStart: h, onResize: g, onResizeEnd: v, shouldResize: x }) {
    let y = { ...os }, C = { ...If };
    s = {
      boundaries: u,
      resizeDirection: d,
      keepAspectRatio: f,
      controlDirection: ur(l)
    };
    let m, b = null, k = [], E, M, A;
    const P = di().on("start", (V) => {
      const { nodeLookup: H, transform: B, snapGrid: z, snapToGrid: w, nodeOrigin: N, paneDomNode: _ } = n();
      if (m = H.get(t), !m)
        return;
      b = _?.getBoundingClientRect() ?? null;
      const { xSnapped: $, ySnapped: R } = xt(V.sourceEvent, {
        transform: B,
        snapGrid: z,
        snapToGrid: w,
        containerBounds: b
      });
      y = {
        width: m.measured.width ?? 0,
        height: m.measured.height ?? 0,
        x: m.position.x ?? 0,
        y: m.position.y ?? 0
      }, C = {
        ...y,
        pointerX: $,
        pointerY: R,
        aspectRatio: y.width / y.height
      }, E = void 0, M = Qe(m.extent) ? m.extent : void 0, m.parentId && (m.extent === "parent" || m.expandParent) && (E = H.get(m.parentId)), E && m.extent === "parent" && (M = [
        [0, 0],
        [E.measured.width, E.measured.height]
      ]), k = [], A = void 0;
      for (const [T, L] of H)
        if (L.parentId === t && (k.push({
          id: T,
          position: { ...L.position },
          extent: L.extent
        }), L.extent === "parent" || L.expandParent)) {
          const S = $f(L, m, L.origin ?? N);
          A ? A = [
            [Math.min(S[0][0], A[0][0]), Math.min(S[0][1], A[0][1])],
            [Math.max(S[1][0], A[1][0]), Math.max(S[1][1], A[1][1])]
          ] : A = S;
        }
      h?.(V, { ...y });
    }).on("drag", (V) => {
      const { transform: H, snapGrid: B, snapToGrid: z, nodeOrigin: w } = n(), N = xt(V.sourceEvent, {
        transform: H,
        snapGrid: B,
        snapToGrid: z,
        containerBounds: b
      }), _ = [];
      if (!m)
        return;
      const { x: $, y: R, width: T, height: L } = y, S = {}, j = m.origin ?? w, { width: X, height: F, x: q, y: K } = kf(C, s.controlDirection, N, s.boundaries, s.keepAspectRatio, j, M, A), W = X !== T, D = F !== L, O = q !== $ && W, Q = K !== R && D;
      if (!O && !Q && !W && !D)
        return;
      const U = {
        prevValues: { ...y },
        startX: C.x,
        startY: C.y,
        childNodes: k.map((ee) => ({
          ...ee,
          position: { ...ee.position }
        }))
      };
      if ((O || Q || j[0] === 1 || j[1] === 1) && (S.x = O ? q : y.x, S.y = Q ? K : y.y, y.x = S.x, y.y = S.y, k.length > 0)) {
        const ee = q - $, ne = K - R;
        for (const ae of k)
          ae.position = {
            x: ae.position.x - ee + j[0] * (X - T),
            y: ae.position.y - ne + j[1] * (F - L)
          }, _.push(ae);
      }
      if ((W || D) && (S.width = W && (!s.resizeDirection || s.resizeDirection === "horizontal") ? X : y.width, S.height = D && (!s.resizeDirection || s.resizeDirection === "vertical") ? F : y.height, y.width = S.width, y.height = S.height), E && m.expandParent) {
        const ee = j[0] * (S.width ?? 0);
        S.x && S.x < ee && (y.x = ee, C.x = C.x - (S.x - ee));
        const ne = j[1] * (S.height ?? 0);
        S.y && S.y < ne && (y.y = ne, C.y = C.y - (S.y - ne));
      }
      const Z = Mf({
        width: y.width,
        prevWidth: T,
        height: y.height,
        prevHeight: L,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), G = { ...y, direction: Z };
      if (x?.(V, G) === !1) {
        y = U.prevValues, C.x = U.startX, C.y = U.startY, k.forEach((ee, ne) => {
          ee.position = U.childNodes[ne].position;
        });
        return;
      }
      g?.(V, G), o(S, _);
    }).on("end", (V) => {
      v?.(V, { ...y }), r?.({ ...y });
    });
    i.call(P);
  }
  function c() {
    i.on(".drag", null);
  }
  return {
    update: a,
    destroy: c
  };
}
var Dn = { exports: {} }, Hn = {}, zn = { exports: {} }, Ln = {};
var fr;
function Af() {
  if (fr) return Ln;
  fr = 1;
  var e = Ur();
  function t(f, d) {
    return f === d && (f !== 0 || 1 / f === 1 / d) || f !== f && d !== d;
  }
  var n = typeof Object.is == "function" ? Object.is : t, o = e.useState, r = e.useEffect, i = e.useLayoutEffect, s = e.useDebugValue;
  function a(f, d) {
    var h = d(), g = o({ inst: { value: h, getSnapshot: d } }), v = g[0].inst, x = g[1];
    return i(
      function() {
        v.value = h, v.getSnapshot = d, c(v) && x({ inst: v });
      },
      [f, h, d]
    ), r(
      function() {
        return c(v) && x({ inst: v }), f(function() {
          c(v) && x({ inst: v });
        });
      },
      [f]
    ), s(h), h;
  }
  function c(f) {
    var d = f.getSnapshot;
    f = f.value;
    try {
      var h = d();
      return !n(f, h);
    } catch {
      return !0;
    }
  }
  function l(f, d) {
    return d();
  }
  var u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? l : a;
  return Ln.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : u, Ln;
}
var hr;
function Tf() {
  return hr || (hr = 1, zn.exports = Af()), zn.exports;
}
var gr;
function Rf() {
  if (gr) return Hn;
  gr = 1;
  var e = Ur(), t = Tf();
  function n(l, u) {
    return l === u && (l !== 0 || 1 / l === 1 / u) || l !== l && u !== u;
  }
  var o = typeof Object.is == "function" ? Object.is : n, r = t.useSyncExternalStore, i = e.useRef, s = e.useEffect, a = e.useMemo, c = e.useDebugValue;
  return Hn.useSyncExternalStoreWithSelector = function(l, u, f, d, h) {
    var g = i(null);
    if (g.current === null) {
      var v = { hasValue: !1, value: null };
      g.current = v;
    } else v = g.current;
    g = a(
      function() {
        function y(E) {
          if (!C) {
            if (C = !0, m = E, E = d(E), h !== void 0 && v.hasValue) {
              var M = v.value;
              if (h(M, E))
                return b = M;
            }
            return b = E;
          }
          if (M = b, o(m, E)) return M;
          var A = d(E);
          return h !== void 0 && h(M, A) ? (m = E, M) : (m = E, b = A);
        }
        var C = !1, m, b, k = f === void 0 ? null : f;
        return [
          function() {
            return y(u());
          },
          k === null ? void 0 : function() {
            return y(k());
          }
        ];
      },
      [u, f, d, h]
    );
    var x = r(l, g[0], g[1]);
    return s(
      function() {
        v.hasValue = !0, v.value = x;
      },
      [x]
    ), c(x), x;
  }, Hn;
}
var pr;
function jf() {
  return pr || (pr = 1, Dn.exports = Rf()), Dn.exports;
}
var Df = jf();
const Hf = /* @__PURE__ */ qa(Df), zf = {}, mr = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), o = (u, f) => {
    const d = typeof u == "function" ? u(t) : u;
    if (!Object.is(d, t)) {
      const h = t;
      t = f ?? (typeof d != "object" || d === null) ? d : Object.assign({}, t, d), n.forEach((g) => g(t, h));
    }
  }, r = () => t, c = { setState: o, getState: r, getInitialState: () => l, subscribe: (u) => (n.add(u), () => n.delete(u)), destroy: () => {
    (zf ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, l = t = e(o, r, c);
  return c;
}, Lf = (e) => e ? mr(e) : mr, { useDebugValue: Bf } = Ga, { useSyncExternalStoreWithSelector: Vf } = Hf, Of = (e) => e;
function rs(e, t = Of, n) {
  const o = Vf(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return Bf(o), o;
}
const yr = (e, t) => {
  const n = Lf(e), o = (r, i = t) => rs(n, r, i);
  return Object.assign(o, n), o;
}, Ff = (e, t) => e ? yr(e, t) : yr;
function ie(e, t) {
  if (Object.is(e, t))
    return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  if (e instanceof Map && t instanceof Map) {
    if (e.size !== t.size) return !1;
    for (const [o, r] of e)
      if (!Object.is(r, t.get(o)))
        return !1;
    return !0;
  }
  if (e instanceof Set && t instanceof Set) {
    if (e.size !== t.size) return !1;
    for (const o of e)
      if (!t.has(o))
        return !1;
    return !0;
  }
  const n = Object.keys(e);
  if (n.length !== Object.keys(t).length)
    return !1;
  for (const o of n)
    if (!Object.prototype.hasOwnProperty.call(t, o) || !Object.is(e[o], t[o]))
      return !1;
  return !0;
}
Ua();
const Sn = I.createContext(null), Xf = Sn.Provider, is = we.error001("react");
function te(e, t) {
  const n = I.useContext(Sn);
  if (n === null)
    throw new Error(is);
  return rs(n, e, t);
}
function re() {
  const e = I.useContext(Sn);
  if (e === null)
    throw new Error(is);
  return I.useMemo(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const xr = { display: "none" }, Yf = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, ss = "react-flow__node-desc", as = "react-flow__edge-desc", Wf = "react-flow__aria-live", Zf = (e) => e.ariaLiveMessage, qf = (e) => e.ariaLabelConfig;
function Gf({ rfId: e }) {
  const t = te(Zf);
  return p.jsx("div", { id: `${Wf}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: Yf, children: t });
}
function Uf({ rfId: e, disableKeyboardA11y: t }) {
  const n = te(qf);
  return p.jsxs(p.Fragment, { children: [p.jsx("div", { id: `${ss}-${e}`, style: xr, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), p.jsx("div", { id: `${as}-${e}`, style: xr, children: n["edge.a11yDescription.default"] }), !t && p.jsx(Gf, { rfId: e })] });
}
const En = I.forwardRef(({ position: e = "top-left", children: t, className: n, style: o, ...r }, i) => {
  const s = `${e}`.split("-");
  return p.jsx("div", { className: se(["react-flow__panel", n, ...s]), style: o, ref: i, ...r, children: t });
});
En.displayName = "Panel";
const wr = "https://reactflow.dev?utm_source=attribution";
function Kf({ proOptions: e, position: t = "bottom-right" }) {
  return I.useEffect(() => {
  }, []), e?.hideAttribution ? null : p.jsx(En, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${wr}`, children: p.jsx("a", { href: wr, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const Qf = (e) => {
  const t = [], n = [];
  for (const [, o] of e.nodeLookup)
    o.selected && t.push(o.internals.userNode);
  for (const [, o] of e.edgeLookup)
    o.selected && n.push(o);
  return { selectedNodes: t, selectedEdges: n };
}, Xt = (e) => e.id;
function Jf(e, t) {
  return ie(e.selectedNodes.map(Xt), t.selectedNodes.map(Xt)) && ie(e.selectedEdges.map(Xt), t.selectedEdges.map(Xt));
}
function eh({ onSelectionChange: e }) {
  const t = re(), { selectedNodes: n, selectedEdges: o } = te(Qf, Jf);
  return I.useEffect(() => {
    const r = { nodes: n, edges: o };
    e?.(r), t.getState().onSelectionChangeHandlers.forEach((i) => i(r));
  }, [n, o, e]), null;
}
const th = (e) => !!e.onSelectionChangeHandlers;
function nh({ onSelectionChange: e }) {
  const t = te(th);
  return e || t ? p.jsx(eh, { onSelectionChange: e }) : null;
}
const cs = [0, 0], oh = { x: 0, y: 0, zoom: 1 }, rh = [
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
], vr = [...rh, "rfId"], ih = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), br = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: _t,
  nodeOrigin: cs,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function sh(e) {
  const { setNodes: t, setEdges: n, setMinZoom: o, setMaxZoom: r, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: c } = te(ih, ie), l = re();
  I.useEffect(() => (c(e.defaultNodes, e.defaultEdges), () => {
    u.current = br, a();
  }), []);
  const u = I.useRef(br);
  return I.useEffect(
    () => {
      for (const f of vr) {
        const d = e[f], h = u.current[f];
        d !== h && (typeof e[f] > "u" || (f === "nodes" ? t(d) : f === "edges" ? n(d) : f === "minZoom" ? o(d) : f === "maxZoom" ? r(d) : f === "translateExtent" ? i(d) : f === "nodeExtent" ? s(d) : f === "ariaLabelConfig" ? l.setState({ ariaLabelConfig: Fd(d) }) : f === "fitView" ? l.setState({ fitViewQueued: d }) : f === "fitViewOptions" ? l.setState({ fitViewOptions: d }) : l.setState({ [f]: d })));
      }
      u.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    vr.map((f) => e[f])
  ), null;
}
function Sr() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function ah(e) {
  const [t, n] = I.useState(e === "system" ? null : e);
  return I.useEffect(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = Sr(), r = () => n(o?.matches ? "dark" : "light");
    return r(), o?.addEventListener("change", r), () => {
      o?.removeEventListener("change", r);
    };
  }, [e]), t !== null ? t : Sr()?.matches ? "dark" : "light";
}
const Er = typeof document < "u" ? document : null;
function It(e = null, t = { target: Er, actInsideInputWithModifier: !0 }) {
  const [n, o] = I.useState(!1), r = I.useRef(!1), i = I.useRef(/* @__PURE__ */ new Set([])), [s, a] = I.useMemo(() => {
    if (e !== null) {
      const l = (Array.isArray(e) ? e : [e]).filter((f) => typeof f == "string").map((f) => f.replace(/\+/g, `
`).replace(`

`, `
+`).split(`
`)), u = l.reduce((f, d) => f.concat(...d), []);
      return [l, u];
    }
    return [[], []];
  }, [e]);
  return I.useEffect(() => {
    const c = t?.target ?? Er, l = t?.actInsideInputWithModifier ?? !0;
    if (e !== null) {
      const u = (h) => {
        if (r.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!r.current || r.current && !l) && Vi(h))
          return !1;
        const v = Cr(h.code, a);
        if (i.current.add(h[v]), _r(s, i.current, !1)) {
          const x = h.composedPath?.()?.[0] || h.target, y = x?.nodeName === "BUTTON" || x?.nodeName === "A";
          t.preventDefault !== !1 && (r.current || !y) && h.preventDefault(), o(!0);
        }
      }, f = (h) => {
        const g = Cr(h.code, a);
        _r(s, i.current, !0) ? (o(!1), i.current.clear()) : i.current.delete(h[g]), h.key === "Meta" && i.current.clear(), r.current = !1;
      }, d = () => {
        i.current.clear(), o(!1);
      };
      return c?.addEventListener("keydown", u), c?.addEventListener("keyup", f), window.addEventListener("blur", d), window.addEventListener("contextmenu", d), () => {
        c?.removeEventListener("keydown", u), c?.removeEventListener("keyup", f), window.removeEventListener("blur", d), window.removeEventListener("contextmenu", d);
      };
    }
  }, [e, o]), n;
}
function _r(e, t, n) {
  return e.filter((o) => n || o.length === t.size).some((o) => o.every((r) => t.has(r)));
}
function Cr(e, t) {
  return t.includes(e) ? "code" : "key";
}
const ch = () => {
  const e = re();
  return I.useMemo(() => ({
    zoomIn: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1.2, t) : !1;
    },
    zoomOut: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1 / 1.2, t) : !1;
    },
    zoomTo: async (t, n) => {
      const { panZoom: o } = e.getState();
      return o ? o.scaleTo(t, n) : !1;
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (t, n) => {
      const { transform: [o, r, i], panZoom: s } = e.getState();
      return s ? (await s.setViewport({
        x: t.x ?? o,
        y: t.y ?? r,
        zoom: t.zoom ?? i
      }, n), !0) : !1;
    },
    getViewport: () => {
      const [t, n, o] = e.getState().transform;
      return { x: t, y: n, zoom: o };
    },
    setCenter: async (t, n, o) => e.getState().setCenter(t, n, o),
    fitBounds: async (t, n) => {
      const { width: o, height: r, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), c = po(t, o, r, i, s, n?.padding ?? 0.1);
      return a ? (await a.setViewport(c, {
        duration: n?.duration,
        ease: n?.ease,
        interpolate: n?.interpolate
      }), !0) : !1;
    },
    screenToFlowPosition: (t, n = {}) => {
      const { transform: o, snapGrid: r, snapToGrid: i, domNode: s } = e.getState();
      if (!s)
        return t;
      const { x: a, y: c } = s.getBoundingClientRect(), l = {
        x: t.x - a,
        y: t.y - c
      }, u = n.snapGrid ?? r, f = n.snapToGrid ?? i;
      return jt(l, o, f, u);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: o } = e.getState();
      if (!o)
        return t;
      const { x: r, y: i } = o.getBoundingClientRect(), s = lt(t, n);
      return {
        x: s.x + r,
        y: s.y + i
      };
    }
  }), []);
};
function ls(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const i of e)
    if (i.type === "add") {
      r.push(i);
      continue;
    } else if (i.type === "remove" || i.type === "replace")
      o.set(i.id, [i]);
    else {
      const s = o.get(i.id);
      s ? s.push(i) : o.set(i.id, [i]);
    }
  for (const i of t) {
    const s = o.get(i.id);
    if (!s) {
      n.push(i);
      continue;
    }
    if (s[0].type === "remove")
      continue;
    if (s[0].type === "replace") {
      n.push({ ...s[0].item });
      continue;
    }
    const a = { ...i };
    for (const c of s)
      lh(c, a);
    n.push(a);
  }
  return r.length && r.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function lh(e, t) {
  switch (e.type) {
    case "select": {
      t.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (t.position = e.position), typeof e.dragging < "u" && (t.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && (t.measured = {
        ...e.dimensions
      }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
      break;
    }
  }
}
function uh(e, t) {
  return ls(e, t);
}
function dh(e, t) {
  return ls(e, t);
}
function Ye(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function nt(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [r, i] of e) {
    const s = t.has(r);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), o.push(Ye(i.id, s)));
  }
  return o;
}
function Nr({ items: e = [], lookup: t }) {
  const n = [], o = new Map(e.map((r) => [r.id, r]));
  for (const [r, i] of e.entries()) {
    const s = t.get(i.id), a = s?.internals?.userNode ?? s;
    a !== void 0 && a !== i && n.push({ id: i.id, item: i, type: "replace" }), a === void 0 && n.push({ item: i, type: "add", index: r });
  }
  for (const [r] of t)
    o.get(r) === void 0 && n.push({ id: r, type: "remove" });
  return n;
}
function Mr(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const fh = Di();
function hh(e, t, n = {}) {
  return Gd(e, t, {
    ...n,
    onError: n.onError ?? fh
  });
}
const kr = (e) => jd(e), gh = (e) => $i(e);
function us(e) {
  return I.forwardRef(e);
}
const ds = typeof window < "u" ? I.useLayoutEffect : I.useEffect;
function Ir(e) {
  const [t, n] = I.useState(BigInt(0)), [o] = I.useState(() => ph(() => n((r) => r + BigInt(1))));
  return ds(() => {
    const r = o.get();
    r.length && (e(r), o.reset());
  }, [t]), o;
}
function ph(e) {
  let t = [];
  return {
    get: () => t,
    reset: () => {
      t = [];
    },
    push: (n) => {
      t.push(n), e();
    }
  };
}
const fs = I.createContext(null);
function mh({ children: e }) {
  const t = re(), n = I.useCallback((a) => {
    const { nodes: c = [], setNodes: l, hasDefaultNodes: u, onNodesChange: f, nodeLookup: d, fitViewQueued: h, onNodesChangeMiddlewareMap: g } = t.getState();
    let v = c;
    for (const y of a)
      v = typeof y == "function" ? y(v) : y;
    let x = Nr({
      items: v,
      lookup: d
    });
    for (const y of g.values())
      x = y(x);
    u && l(v), x.length > 0 ? f?.(x) : h && window.requestAnimationFrame(() => {
      const { fitViewQueued: y, nodes: C, setNodes: m } = t.getState();
      y && m(C);
    });
  }, []), o = Ir(n), r = I.useCallback((a) => {
    const { edges: c = [], setEdges: l, hasDefaultEdges: u, onEdgesChange: f, edgeLookup: d } = t.getState();
    let h = c;
    for (const g of a)
      h = typeof g == "function" ? g(h) : g;
    u ? l(h) : f && f(Nr({
      items: h,
      lookup: d
    }));
  }, []), i = Ir(r), s = I.useMemo(() => ({ nodeQueue: o, edgeQueue: i }), []);
  return p.jsx(fs.Provider, { value: s, children: e });
}
function yh() {
  const e = I.useContext(fs);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const xh = (e) => !!e.panZoom;
function So() {
  const e = ch(), t = re(), n = yh(), o = te(xh), r = I.useMemo(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, c = (f) => {
      const { nodeLookup: d, nodeOrigin: h } = t.getState(), g = kr(f) ? f : d.get(f.id), v = g.parentId ? zi(g.position, g.measured, g.parentId, d, h) : g.position, x = {
        ...g,
        position: v,
        width: g.measured?.width ?? g.width,
        height: g.measured?.height ?? g.height
      };
      return Mt(x);
    }, l = (f, d, h = { replace: !1 }) => {
      s((g) => g.map((v) => {
        if (v.id === f) {
          const x = typeof d == "function" ? d(v) : d;
          return h.replace && kr(x) ? x : { ...v, ...x };
        }
        return v;
      }));
    }, u = (f, d, h = { replace: !1 }) => {
      a((g) => g.map((v) => {
        if (v.id === f) {
          const x = typeof d == "function" ? d(v) : d;
          return h.replace && gh(x) ? x : { ...v, ...x };
        }
        return v;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((f) => ({ ...f })),
      getNode: (f) => i(f)?.internals.userNode,
      getInternalNode: i,
      getEdges: () => {
        const { edges: f = [] } = t.getState();
        return f.map((d) => ({ ...d }));
      },
      getEdge: (f) => t.getState().edgeLookup.get(f),
      setNodes: s,
      setEdges: a,
      addNodes: (f) => {
        const d = Array.isArray(f) ? f : [f];
        n.nodeQueue.push((h) => [...h, ...d]);
      },
      addEdges: (f) => {
        const d = Array.isArray(f) ? f : [f];
        n.edgeQueue.push((h) => [...h, ...d]);
      },
      toObject: () => {
        const { nodes: f = [], edges: d = [], transform: h } = t.getState(), [g, v, x] = h;
        return {
          nodes: f.map((y) => ({ ...y })),
          edges: d.map((y) => ({ ...y })),
          viewport: {
            x: g,
            y: v,
            zoom: x
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: d = [] }) => {
        const { nodes: h, edges: g, onNodesDelete: v, onEdgesDelete: x, triggerNodeChanges: y, triggerEdgeChanges: C, onDelete: m, onBeforeDelete: b } = t.getState(), { nodes: k, edges: E } = await Ld({
          nodesToRemove: f,
          edgesToRemove: d,
          nodes: h,
          edges: g,
          onBeforeDelete: b
        }), M = E.length > 0, A = k.length > 0;
        if (M) {
          const P = E.map(Mr);
          x?.(E), C(P);
        }
        if (A) {
          const P = k.map(Mr);
          v?.(k), y(P);
        }
        return (A || M) && m?.({ nodes: k, edges: E }), { deletedNodes: k, deletedEdges: E };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, d = !0, h) => {
        const g = Jo(f), v = g ? f : c(f), x = h !== void 0;
        return v ? (h || t.getState().nodes).filter((y) => {
          const C = t.getState().nodeLookup.get(y.id);
          if (C && !g && (y.id === f.id || !C.internals.positionAbsolute))
            return !1;
          const m = Mt(x ? y : C), b = cn(m, v);
          return d && b > 0 || b >= m.width * m.height || b >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (f, d, h = !0) => {
        const v = Jo(f) ? f : c(f);
        if (!v)
          return !1;
        const x = cn(v, d);
        return h && x > 0 || x >= d.width * d.height || x >= v.width * v.height;
      },
      updateNode: l,
      updateNodeData: (f, d, h = { replace: !1 }) => {
        l(f, (g) => {
          const v = typeof d == "function" ? d(g) : d;
          return h.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, h);
      },
      updateEdge: u,
      updateEdgeData: (f, d, h = { replace: !1 }) => {
        u(f, (g) => {
          const v = typeof d == "function" ? d(g) : d;
          return h.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, h);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: d, nodeOrigin: h } = t.getState();
        return Pi(f, { nodeLookup: d, nodeOrigin: h });
      },
      getHandleConnections: ({ type: f, id: d, nodeId: h }) => Array.from(t.getState().connectionLookup.get(`${h}-${f}${d ? `-${d}` : ""}`)?.values() ?? []),
      getNodeConnections: ({ type: f, handleId: d, nodeId: h }) => Array.from(t.getState().connectionLookup.get(`${h}${f ? d ? `-${f}-${d}` : `-${f}` : ""}`)?.values() ?? []),
      fitView: async (f) => {
        const d = t.getState().fitViewResolver ?? Od();
        return t.setState({ fitViewQueued: !0, fitViewOptions: f, fitViewResolver: d }), n.nodeQueue.push((h) => [...h]), d.promise;
      }
    };
  }, []);
  return I.useMemo(() => ({
    ...r,
    ...e,
    viewportInitialized: o
  }), [o]);
}
const $r = (e) => e.selected, wh = typeof window < "u" ? window : void 0;
function vh({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = re(), { deleteElements: o } = So(), r = It(e, { actInsideInputWithModifier: !1 }), i = It(t, { target: wh });
  I.useEffect(() => {
    if (r) {
      const { edges: s, nodes: a } = n.getState();
      o({ nodes: a.filter($r), edges: s.filter($r) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [r]), I.useEffect(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function bh(e) {
  const t = re();
  I.useEffect(() => {
    const n = () => {
      if (!e.current || !(e.current.checkVisibility?.() ?? !0))
        return !1;
      const o = mo(e.current);
      (o.height === 0 || o.width === 0) && t.getState().onError?.("004", we.error004()), t.setState({ width: o.width || 500, height: o.height || 500 });
    };
    if (e.current) {
      n(), window.addEventListener("resize", n);
      const o = new ResizeObserver(() => n());
      return o.observe(e.current), () => {
        window.removeEventListener("resize", n), o && e.current && o.unobserve(e.current);
      };
    }
  }, []);
}
const _n = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Sh = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Eh({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: o = !1, panActivationKeyPressed: r, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = qe.Free, zoomOnDoubleClick: a = !0, panOnDrag: c = !0, defaultViewport: l, translateExtent: u, minZoom: f, maxZoom: d, zoomActivationKeyCode: h, preventScrolling: g = !0, children: v, noWheelClassName: x, noPanClassName: y, onViewportChange: C, isControlledViewport: m, paneClickDistance: b, selectionOnDrag: k }) {
  const E = re(), M = I.useRef(null), { userSelectionActive: A, lib: P, connectionInProgress: V } = te(Sh, ie), H = It(h), B = I.useRef();
  bh(M);
  const z = I.useCallback((w) => {
    C?.({ x: w[0], y: w[1], zoom: w[2] }), m || E.setState({ transform: w });
  }, [C, m]);
  return I.useEffect(() => {
    if (M.current) {
      B.current = Nf({
        domNode: M.current,
        minZoom: f,
        maxZoom: d,
        translateExtent: u,
        viewport: l,
        onDraggingChange: ($) => E.setState((R) => R.paneDragging === $ ? R : { paneDragging: $ }),
        onPanZoomStart: ($, R) => {
          const { onViewportChangeStart: T, onMoveStart: L } = E.getState();
          L?.($, R), T?.(R);
        },
        onPanZoom: ($, R) => {
          const { onViewportChange: T, onMove: L } = E.getState();
          L?.($, R), T?.(R);
        },
        onPanZoomEnd: ($, R) => {
          const { onViewportChangeEnd: T, onMoveEnd: L } = E.getState();
          L?.($, R), T?.(R);
        }
      });
      const { x: w, y: N, zoom: _ } = B.current.getViewport();
      return E.setState({
        panZoom: B.current,
        transform: [w, N, _],
        domNode: M.current.closest(".react-flow")
      }), () => {
        B.current?.destroy();
      };
    }
  }, []), I.useEffect(() => {
    B.current?.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: o,
      panActivationKeyPressed: r,
      panOnScrollSpeed: i,
      panOnScrollMode: s,
      zoomOnDoubleClick: a,
      panOnDrag: c,
      zoomActivationKeyPressed: H,
      preventScrolling: g,
      noPanClassName: y,
      userSelectionActive: A,
      noWheelClassName: x,
      lib: P,
      onTransformChange: z,
      connectionInProgress: V,
      selectionOnDrag: k,
      paneClickDistance: b
    });
  }, [
    e,
    t,
    n,
    o,
    r,
    i,
    s,
    a,
    c,
    H,
    g,
    y,
    A,
    x,
    P,
    z,
    V,
    k,
    b
  ]), p.jsx("div", { className: "react-flow__renderer", ref: M, style: _n, children: v });
}
const _h = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Ch() {
  const { userSelectionActive: e, userSelectionRect: t } = te(_h, ie);
  return e && t ? p.jsx("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Bn = (e, t) => (n) => {
  n.target === t.current && e?.(n);
}, Nh = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function Mh({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Ct.Full, panOnDrag: o, autoPanOnSelection: r, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: c, onPaneClick: l, onPaneContextMenu: u, onPaneScroll: f, onPaneMouseEnter: d, onPaneMouseMove: h, onPaneMouseLeave: g, children: v }) {
  const x = I.useRef(0), y = re(), { userSelectionActive: C, elementsSelectable: m, dragging: b, panBy: k, autoPanSpeed: E } = te(Nh, ie), M = m && (e || C), A = I.useRef(null), P = I.useRef(), V = I.useRef(/* @__PURE__ */ new Set()), H = I.useRef(/* @__PURE__ */ new Set()), B = I.useRef(!1), z = I.useRef(!1), w = I.useRef({ x: 0, y: 0 }), N = I.useRef(!1), _ = (D) => {
    if (z.current || B.current || y.getState().connection.inProgress) {
      z.current = !1, B.current = !1;
      return;
    }
    l?.(D), y.getState().resetSelectedElements(), y.setState({ nodesSelectionActive: !1 });
  }, $ = (D) => {
    if (Array.isArray(o) && o?.includes(2)) {
      D.preventDefault();
      return;
    }
    u?.(D);
  }, R = f ? (D) => f(D) : void 0, T = (D) => {
    z.current && (D.stopPropagation(), z.current = !1);
  }, L = (D) => {
    if (D.pointerType === "touch" && o !== !1 && !t)
      return;
    const { domNode: O, transform: Q } = y.getState();
    if (P.current = O?.getBoundingClientRect(), !P.current)
      return;
    const U = D.target === A.current;
    if (!U && !!D.target.closest(".nokey") || !e || !(s && U || t) || D.button !== 0 || !D.isPrimary)
      return;
    D.target?.setPointerCapture?.(D.pointerId), z.current = !1;
    const { x: J, y: ee } = xe(D.nativeEvent, P.current), ne = jt({ x: J, y: ee }, Q);
    y.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: ne.x,
        startY: ne.y,
        x: J,
        y: ee
      }
    }), U || (D.stopPropagation(), D.preventDefault());
  };
  function S(D, O) {
    const { userSelectionRect: Q } = y.getState();
    if (!Q)
      return;
    const { transform: U, nodeLookup: Z, edgeLookup: G, connectionLookup: J, triggerNodeChanges: ee, triggerEdgeChanges: ne, defaultEdgeOptions: ae } = y.getState(), ke = { x: Q.startX, y: Q.startY }, { x: Se, y: Ee } = lt(ke, U), Ie = {
      startX: ke.x,
      startY: ke.y,
      x: D < Se ? D : Se,
      y: O < Ee ? O : Ee,
      width: Math.abs(D - Se),
      height: Math.abs(O - Ee)
    }, ft = V.current, Oe = H.current;
    V.current = new Set(ho(Z, Ie, U, n === Ct.Partial, !0).map((ge) => ge.id)), H.current = /* @__PURE__ */ new Set();
    const Fe = ae?.selectable ?? !0;
    for (const ge of V.current) {
      const $e = J.get(ge);
      if ($e)
        for (const { edgeId: Pe } of $e.values()) {
          const Xe = G.get(Pe);
          Xe && (Xe.selectable ?? Fe) && H.current.add(Pe);
        }
    }
    if (!er(ft, V.current)) {
      const ge = nt(Z, V.current, !0);
      ee(ge);
    }
    if (!er(Oe, H.current)) {
      const ge = nt(G, H.current);
      ne(ge);
    }
    y.setState({
      userSelectionRect: Ie,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function j() {
    if (!r || !P.current)
      return;
    const [D, O] = go(w.current, P.current, E);
    k({ x: D, y: O }).then((Q) => {
      if (!z.current || !Q) {
        x.current = requestAnimationFrame(j);
        return;
      }
      const { x: U, y: Z } = w.current;
      S(U, Z), x.current = requestAnimationFrame(j);
    });
  }
  const X = () => {
    cancelAnimationFrame(x.current), x.current = 0, N.current = !1;
  };
  I.useEffect(() => () => X(), []);
  const F = (D) => {
    const { userSelectionRect: O, transform: Q, resetSelectedElements: U } = y.getState();
    if (!P.current || !O)
      return;
    const { x: Z, y: G } = xe(D.nativeEvent, P.current);
    w.current = { x: Z, y: G };
    const J = lt({ x: O.startX, y: O.startY }, Q);
    if (!z.current) {
      const ee = t ? 0 : i;
      if (Math.hypot(Z - J.x, G - J.y) <= ee)
        return;
      U(), a?.(D);
    }
    z.current = !0, N.current || (j(), N.current = !0), S(Z, G);
  }, q = (D) => {
    if (!M) {
      D.target === A.current && y.getState().connection.inProgress && (B.current = !0);
      return;
    }
    D.button === 0 && (D.target?.releasePointerCapture?.(D.pointerId), !C && D.target === A.current && y.getState().userSelectionRect && _?.(D), y.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), z.current && (c?.(D), y.setState({
      nodesSelectionActive: V.current.size > 0
    })), X());
  }, K = (D) => {
    D.target?.releasePointerCapture?.(D.pointerId), X();
  }, W = o === !0 || Array.isArray(o) && o.includes(0);
  return p.jsxs("div", { className: se(["react-flow__pane", { draggable: W, dragging: b, selection: e }]), onClick: M ? void 0 : Bn(_, A), onContextMenu: Bn($, A), onWheel: Bn(R, A), onPointerEnter: M ? void 0 : d, onPointerMove: M ? F : h, onPointerUp: q, onPointerCancel: M ? K : void 0, onPointerDownCapture: M ? L : void 0, onClickCapture: M ? T : void 0, onPointerLeave: g, ref: A, style: _n, children: [v, p.jsx(Ch, {})] });
}
function to({ id: e, store: t, unselect: n = !1, nodeRef: o }) {
  const { addSelectedNodes: r, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: c } = t.getState(), l = a.get(e);
  if (!l) {
    c?.("012", we.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), l.selected ? (n || l.selected && s) && (i({ nodes: [l], edges: [] }), requestAnimationFrame(() => o?.current?.blur())) : r([e]);
}
function hs({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: o, nodeId: r, isSelectable: i, nodeClickDistance: s }) {
  const a = re(), [c, l] = I.useState(!1), u = I.useRef();
  return I.useEffect(() => {
    if (!t)
      return u.current = ff({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          to({
            id: f,
            store: a,
            nodeRef: e
          });
        },
        onDragStart: () => {
          l(!0);
        },
        onDragStop: () => {
          l(!1);
        }
      }), () => {
        u.current?.destroy(), u.current = void 0;
      };
  }, [t, a, e]), I.useEffect(() => {
    t || !e.current || !u.current || u.current.update({
      noDragClassName: n,
      handleSelector: o,
      domNode: e.current,
      isSelectable: i,
      nodeId: r,
      nodeClickDistance: s
    });
  }, [n, o, t, i, e, r, s]), c;
}
const kh = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function gs() {
  const e = re();
  return I.useCallback((n) => {
    const { nodeExtent: o, snapToGrid: r, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: c, nodeLookup: l, nodeOrigin: u } = e.getState(), f = /* @__PURE__ */ new Map(), d = kh(s), h = r ? i[0] : 5, g = r ? i[1] : 5, v = n.direction.x * h * n.factor, x = n.direction.y * g * n.factor;
    for (const [, y] of l) {
      if (!d(y))
        continue;
      let C = {
        x: y.internals.positionAbsolute.x + v,
        y: y.internals.positionAbsolute.y + x
      };
      r && (C = Rt(C, i));
      const { position: m, positionAbsolute: b } = Ai({
        nodeId: y.id,
        nextPosition: C,
        nodeLookup: l,
        nodeExtent: o,
        nodeOrigin: u,
        onError: a
      });
      y.position = m, y.internals.positionAbsolute = b, f.set(y.id, y);
    }
    c(f);
  }, []);
}
const Eo = I.createContext(null), Ih = Eo.Provider;
Eo.Consumer;
const ps = () => I.useContext(Eo), $h = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), ms = I.createContext(null);
function Ph({ children: e }) {
  const t = te($h, ie);
  return p.jsx(ms.Provider, { value: t, children: e });
}
function Ah() {
  const e = I.useContext(ms);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Th = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, Rh = (e, t, n) => (o) => {
  const { connectionClickStartHandle: r, connectionMode: i, connection: s } = o, { fromHandle: a, toHandle: c, isValid: l } = s;
  if (!a && !r)
    return Th;
  const u = c?.nodeId === e && c?.id === t && c?.type === n;
  return {
    connectingFrom: a?.nodeId === e && a?.id === t && a?.type === n,
    connectingTo: u,
    clickConnecting: r?.nodeId === e && r?.id === t && r?.type === n,
    isPossibleEndHandle: i === at.Strict ? a?.type !== n : e !== a?.nodeId || t !== a?.id,
    connectionInProcess: !!a,
    clickConnectionInProcess: !!r,
    valid: u && l
  };
};
function jh({ type: e = "source", position: t = Y.Top, isValidConnection: n, isConnectable: o = !0, isConnectableStart: r = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: c, className: l, onMouseDown: u, onTouchStart: f, ...d }, h) {
  const g = s || null, v = e === "target", x = re(), y = ps(), { connectOnClick: C, noPanClassName: m, rfId: b } = Ah(), { connectingFrom: k, connectingTo: E, clickConnecting: M, isPossibleEndHandle: A, connectionInProcess: P, clickConnectionInProcess: V, valid: H } = te(Rh(y, g, e), ie);
  y || x.getState().onError?.("010", we.error010());
  const B = (N) => {
    const { defaultEdgeOptions: _, onConnect: $, hasDefaultEdges: R } = x.getState(), T = {
      ..._,
      ...N
    };
    if (R) {
      const { edges: L, setEdges: S, onError: j } = x.getState();
      S(hh(T, L, { onError: j }));
    }
    $?.(T), a?.(T);
  }, z = (N) => {
    if (!y)
      return;
    const _ = Oi(N.nativeEvent);
    if (r && (_ && N.button === 0 || !_)) {
      const $ = x.getState();
      eo.onPointerDown(N.nativeEvent, {
        handleDomNode: N.currentTarget,
        autoPanOnConnect: $.autoPanOnConnect,
        connectionMode: $.connectionMode,
        connectionRadius: $.connectionRadius,
        domNode: $.domNode,
        nodeLookup: $.nodeLookup,
        lib: $.lib,
        isTarget: v,
        handleId: g,
        nodeId: y,
        flowId: $.rfId,
        panBy: $.panBy,
        cancelConnection: $.cancelConnection,
        onConnectStart: $.onConnectStart,
        onConnectEnd: (...R) => x.getState().onConnectEnd?.(...R),
        updateConnection: $.updateConnection,
        onConnect: B,
        isValidConnection: n || ((...R) => x.getState().isValidConnection?.(...R) ?? !0),
        getTransform: () => x.getState().transform,
        getFromHandle: () => x.getState().connection.fromHandle,
        autoPanSpeed: $.autoPanSpeed,
        dragThreshold: $.connectionDragThreshold
      });
    }
    _ ? u?.(N) : f?.(N);
  }, w = (N) => {
    const { onClickConnectStart: _, onClickConnectEnd: $, connectionClickStartHandle: R, connectionMode: T, isValidConnection: L, lib: S, rfId: j, nodeLookup: X, connection: F } = x.getState();
    if (!y || !R && !r)
      return;
    if (!R) {
      _?.(N.nativeEvent, { nodeId: y, handleId: g, handleType: e }), x.setState({ connectionClickStartHandle: { nodeId: y, type: e, id: g } });
      return;
    }
    const q = Bi(N.target), K = n || L, { connection: W, isValid: D } = eo.isValid(N.nativeEvent, {
      handle: {
        nodeId: y,
        id: g,
        type: e
      },
      connectionMode: T,
      fromNodeId: R.nodeId,
      fromHandleId: R.id || null,
      fromType: R.type,
      isValidConnection: K,
      flowId: j,
      doc: q,
      lib: S,
      nodeLookup: X
    });
    D && W && B(W);
    const O = structuredClone(F);
    delete O.inProgress, O.toPosition = O.toHandle ? O.toHandle.position : null, $?.(N, O), x.setState({ connectionClickStartHandle: null });
  };
  return p.jsx("div", { "data-handleid": g, "data-nodeid": y, "data-handlepos": t, "data-id": `${b}-${y}-${g}-${e}`, className: se([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    m,
    l,
    {
      source: !v,
      target: v,
      connectable: o,
      connectablestart: r,
      connectableend: i,
      clickconnecting: M,
      connectingfrom: k,
      connectingto: E,
      valid: H,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: o && (!P || A) && (P || V ? i : r)
    }
  ]), onMouseDown: z, onTouchStart: z, onClick: C ? w : void 0, ref: h, ...d, children: c });
}
const dt = I.memo(us(jh));
function Dh({ data: e, isConnectable: t, sourcePosition: n = Y.Bottom }) {
  return p.jsxs(p.Fragment, { children: [e?.label, p.jsx(dt, { type: "source", position: n, isConnectable: t })] });
}
function Hh({ data: e, isConnectable: t, targetPosition: n = Y.Top, sourcePosition: o = Y.Bottom }) {
  return p.jsxs(p.Fragment, { children: [p.jsx(dt, { type: "target", position: n, isConnectable: t }), e?.label, p.jsx(dt, { type: "source", position: o, isConnectable: t })] });
}
function zh() {
  return null;
}
function Lh({ data: e, isConnectable: t, targetPosition: n = Y.Top }) {
  return p.jsxs(p.Fragment, { children: [p.jsx(dt, { type: "target", position: n, isConnectable: t }), e?.label] });
}
const un = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Pr = {
  input: Dh,
  default: Hh,
  output: Lh,
  group: zh
};
function Bh(e) {
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? e.style?.width,
    height: e.height ?? e.initialHeight ?? e.style?.height
  } : {
    width: e.width ?? e.style?.width,
    height: e.height ?? e.style?.height
  };
}
const Vh = (e) => {
  const { width: t, height: n, x: o, y: r } = Tt(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: ye(t) ? t : null,
    height: ye(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${o}px,${r}px)`
  };
};
function Oh({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const o = re(), { width: r, height: i, transformString: s, userSelectionActive: a } = te(Vh, ie), c = gs(), l = I.useRef(null);
  I.useEffect(() => {
    n || l.current?.focus({
      preventScroll: !0
    });
  }, [n]);
  const u = !a && r !== null && i !== null;
  if (hs({
    nodeRef: l,
    disabled: !u
  }), !u)
    return null;
  const f = e ? (h) => {
    const g = o.getState().nodes.filter((v) => v.selected);
    e(h, g);
  } : void 0, d = (h) => {
    Object.prototype.hasOwnProperty.call(un, h.key) && (h.preventDefault(), c({
      direction: un[h.key],
      factor: h.shiftKey ? 4 : 1
    }));
  };
  return p.jsx("div", { className: se(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: p.jsx("div", { ref: l, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : d, style: {
    width: r,
    height: i
  } }) });
}
const Ar = typeof window < "u" ? window : void 0, Fh = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function ys({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: c, selectionKeyCode: l, selectionOnDrag: u, selectionMode: f, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: g, panActivationKeyCode: v, zoomActivationKeyCode: x, elementsSelectable: y, zoomOnScroll: C, zoomOnPinch: m, panOnScroll: b, panOnScrollSpeed: k, panOnScrollMode: E, zoomOnDoubleClick: M, panOnDrag: A, autoPanOnSelection: P, defaultViewport: V, translateExtent: H, minZoom: B, maxZoom: z, preventScrolling: w, onSelectionContextMenu: N, noWheelClassName: _, noPanClassName: $, disableKeyboardA11y: R, onViewportChange: T, isControlledViewport: L }) {
  const { nodesSelectionActive: S, userSelectionActive: j } = te(Fh, ie), X = It(l, { target: Ar }), F = It(v, { target: Ar }), q = F || A, K = F || b, W = u && q !== !0, D = X || j || W;
  return vh({ deleteKeyCode: c, multiSelectionKeyCode: g }), p.jsx(Eh, { onPaneContextMenu: i, elementsSelectable: y, zoomOnScroll: C, zoomOnPinch: m, panOnScroll: K, panActivationKeyPressed: F, panOnScrollSpeed: k, panOnScrollMode: E, zoomOnDoubleClick: M, panOnDrag: !X && q, defaultViewport: V, translateExtent: H, minZoom: B, maxZoom: z, zoomActivationKeyCode: x, preventScrolling: w, noWheelClassName: _, noPanClassName: $, onViewportChange: T, isControlledViewport: L, paneClickDistance: a, selectionOnDrag: W, children: p.jsxs(Mh, { onSelectionStart: d, onSelectionEnd: h, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: q, autoPanOnSelection: P, isSelecting: !!D, selectionMode: f, selectionKeyPressed: X, paneClickDistance: a, selectionOnDrag: W, children: [e, S && p.jsx(Oh, { onSelectionContextMenu: N, noPanClassName: $, disableKeyboardA11y: R })] }) });
}
ys.displayName = "FlowRenderer";
const Xh = I.memo(ys), Yh = (e) => (t) => e ? ho(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Wh(e) {
  return te(I.useCallback(Yh(e), [e]), ie);
}
const Zh = (e) => e.updateNodeInternals;
function qh() {
  const e = te(Zh), [t] = I.useState(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
    const o = /* @__PURE__ */ new Map();
    n.forEach((r) => {
      const i = r.target.getAttribute("data-id");
      o.set(i, {
        id: i,
        nodeElement: r.target,
        force: !0
      });
    }), e(o);
  }));
  return I.useEffect(() => () => {
    t?.disconnect();
  }, [t]), t;
}
function Gh({ node: e, nodeType: t, hasDimensions: n, resizeObserver: o }) {
  const r = re(), i = I.useRef(null), s = I.useRef(null), a = I.useRef(e.sourcePosition), c = I.useRef(e.targetPosition), l = I.useRef(t), u = n && !!e.internals.handleBounds;
  return I.useEffect(() => {
    i.current && !e.hidden && (!u || s.current !== i.current) && (s.current && o?.unobserve(s.current), o?.observe(i.current), s.current = i.current);
  }, [u, e.hidden]), I.useEffect(() => () => {
    s.current && (o?.unobserve(s.current), s.current = null);
  }, []), I.useEffect(() => {
    if (i.current) {
      const f = l.current !== t, d = a.current !== e.sourcePosition, h = c.current !== e.targetPosition;
      (f || d || h) && (l.current = t, a.current = e.sourcePosition, c.current = e.targetPosition, r.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function Uh({ id: e, onClick: t, onMouseEnter: n, onMouseMove: o, onMouseLeave: r, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: c, nodesConnectable: l, nodesFocusable: u, resizeObserver: f, noDragClassName: d, noPanClassName: h, disableKeyboardA11y: g, rfId: v, nodeTypes: x, nodeClickDistance: y, onError: C }) {
  const { node: m, internals: b, isParent: k } = te((D) => {
    const O = D.nodeLookup.get(e), Q = D.parentLookup.has(e);
    return {
      node: O,
      internals: O.internals,
      isParent: Q
    };
  }, ie);
  let E = m.type || "default", M = x?.[E] || Pr[E];
  M === void 0 && (C?.("003", we.error003(E)), E = "default", M = x?.default || Pr.default);
  const A = !!(m.draggable || a && typeof m.draggable > "u"), P = !!(m.selectable || c && typeof m.selectable > "u"), V = !!(m.connectable || l && typeof m.connectable > "u"), H = !!(m.focusable || u && typeof m.focusable > "u"), B = re(), z = Hi(m), w = Gh({ node: m, nodeType: E, hasDimensions: z, resizeObserver: f }), N = hs({
    nodeRef: w,
    disabled: m.hidden || !A,
    noDragClassName: d,
    handleSelector: m.dragHandle,
    nodeId: e,
    isSelectable: P,
    nodeClickDistance: y
  }), _ = gs();
  if (m.hidden)
    return null;
  const $ = be(m), R = Bh(m), T = P || A || t || n || o || r, L = n ? (D) => n(D, { ...b.userNode }) : void 0, S = o ? (D) => o(D, { ...b.userNode }) : void 0, j = r ? (D) => r(D, { ...b.userNode }) : void 0, X = i ? (D) => i(D, { ...b.userNode }) : void 0, F = s ? (D) => s(D, { ...b.userNode }) : void 0, q = (D) => {
    const { selectNodesOnDrag: O, nodeDragThreshold: Q } = B.getState();
    P && (!O || !A || Q > 0) && to({
      id: e,
      store: B,
      nodeRef: w
    }), t && t(D, { ...b.userNode });
  }, K = (D) => {
    if (!(Vi(D.nativeEvent) || g)) {
      if (Mi.includes(D.key) && P) {
        const O = D.key === "Escape";
        to({
          id: e,
          store: B,
          unselect: O,
          nodeRef: w
        });
      } else if (A && m.selected && Object.prototype.hasOwnProperty.call(un, D.key)) {
        D.preventDefault();
        const { ariaLabelConfig: O } = B.getState();
        B.setState({
          ariaLiveMessage: O["node.a11yDescription.ariaLiveMessage"]({
            direction: D.key.replace("Arrow", "").toLowerCase(),
            x: ~~b.positionAbsolute.x,
            y: ~~b.positionAbsolute.y
          })
        }), _({
          direction: un[D.key],
          factor: D.shiftKey ? 4 : 1
        });
      }
    }
  }, W = () => {
    if (g || !w.current?.matches(":focus-visible"))
      return;
    const { transform: D, width: O, height: Q, autoPanOnNodeFocus: U, setCenter: Z } = B.getState();
    if (!U)
      return;
    ho(/* @__PURE__ */ new Map([[e, m]]), { x: 0, y: 0, width: O, height: Q }, D, !0).length > 0 || Z(m.position.x + $.width / 2, m.position.y + $.height / 2, {
      zoom: D[2]
    });
  };
  return p.jsx("div", { className: se([
    "react-flow__node",
    `react-flow__node-${E}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [h]: A
    },
    m.className,
    {
      selected: m.selected,
      selectable: P,
      parent: k,
      draggable: A,
      dragging: N
    }
  ]), ref: w, style: {
    zIndex: b.z,
    transform: `translate(${b.positionAbsolute.x}px,${b.positionAbsolute.y}px)`,
    pointerEvents: T ? "all" : "none",
    visibility: z ? "visible" : "hidden",
    ...m.style,
    ...R
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: L, onMouseMove: S, onMouseLeave: j, onContextMenu: X, onClick: q, onDoubleClick: F, onKeyDown: H ? K : void 0, tabIndex: H ? 0 : void 0, onFocus: H ? W : void 0, role: m.ariaRole ?? (H ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${ss}-${v}`, "aria-label": m.ariaLabel, ...m.domAttributes, children: p.jsx(Ih, { value: e, children: p.jsx(M, { id: e, data: m.data, type: E, positionAbsoluteX: b.positionAbsolute.x, positionAbsoluteY: b.positionAbsolute.y, selected: m.selected ?? !1, selectable: P, draggable: A, deletable: m.deletable ?? !0, isConnectable: V, sourcePosition: m.sourcePosition, targetPosition: m.targetPosition, dragging: N, dragHandle: m.dragHandle, zIndex: b.z, parentId: m.parentId, ...$ }) }) });
}
var Kh = I.memo(Uh);
const Qh = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function xs(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, onError: r } = te(Qh, ie), i = Wh(e.onlyRenderVisibleElements), s = qh();
  return p.jsx("div", { className: "react-flow__nodes", style: _n, children: i.map((a) => (
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
    p.jsx(Kh, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, nodeClickDistance: e.nodeClickDistance, onError: r }, a)
  )) });
}
xs.displayName = "NodeRenderer";
const Jh = I.memo(xs);
function eg(e) {
  return te(I.useCallback((n) => {
    if (!e)
      return n.edges.map((r) => r.id);
    const o = [];
    if (n.width && n.height)
      for (const r of n.edges) {
        const i = n.nodeLookup.get(r.source), s = n.nodeLookup.get(r.target);
        i && s && Wd({
          sourceNode: i,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && o.push(r.id);
      }
    return o;
  }, [e]), ie);
}
const tg = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return p.jsx("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, ng = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return p.jsx("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, Tr = {
  [Nt.Arrow]: tg,
  [Nt.ArrowClosed]: ng
};
function og(e) {
  const t = re();
  return I.useMemo(() => Object.prototype.hasOwnProperty.call(Tr, e) ? Tr[e] : (t.getState().onError?.("009", we.error009(e)), null), [e]);
}
const rg = ({ id: e, type: t, color: n, width: o = 12.5, height: r = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const c = og(t);
  return c ? p.jsx("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${o}`, markerHeight: `${r}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: p.jsx(c, { color: n, strokeWidth: s }) }) : null;
}, ws = ({ defaultColor: e, rfId: t }) => {
  const n = te((i) => i.edges), o = te((i) => i.defaultEdgeOptions), r = I.useMemo(() => ef(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: o?.markerStart,
    defaultMarkerEnd: o?.markerEnd
  }), [n, o, t, e]);
  return r.length ? p.jsx("svg", { className: "react-flow__marker", "aria-hidden": "true", children: p.jsx("defs", { children: r.map((i) => p.jsx(rg, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
ws.displayName = "MarkerDefinitions";
var ig = I.memo(ws);
function vs({ x: e, y: t, label: n, labelStyle: o, labelShowBg: r = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: c, className: l, ...u }) {
  const [f, d] = I.useState({ x: 1, y: 0, width: 0, height: 0 }), h = se(["react-flow__edge-textwrapper", l]), g = I.useRef(null);
  return I.useEffect(() => {
    if (g.current) {
      const v = g.current.getBBox();
      d({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? p.jsxs("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: h, visibility: f.width ? "visible" : "hidden", ...u, children: [r && p.jsx("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), p.jsx("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: g, style: o, children: n }), c] }) : null;
}
vs.displayName = "EdgeText";
const sg = I.memo(vs);
function Dt({ path: e, labelX: t, labelY: n, label: o, labelStyle: r, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: c, interactionWidth: l = 20, ...u }) {
  return p.jsxs(p.Fragment, { children: [p.jsx("path", { ...u, d: e, fill: "none", className: se(["react-flow__edge-path", u.className]) }), l ? p.jsx("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: l, className: "react-flow__edge-interaction" }) : null, o && ye(t) && ye(n) ? p.jsx(sg, { x: t, y: n, label: o, labelStyle: r, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: c }) : null] });
}
function Rr({ pos: e, x1: t, y1: n, x2: o, y2: r }) {
  return e === Y.Left || e === Y.Right ? [0.5 * (t + o), n] : [t, 0.5 * (n + r)];
}
function bs({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: o, targetY: r, targetPosition: i = Y.Top }) {
  const [s, a] = Rr({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r
  }), [c, l] = Rr({
    pos: i,
    x1: o,
    y1: r,
    x2: e,
    y2: t
  }), [u, f, d, h] = Fi({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: s,
    sourceControlY: a,
    targetControlX: c,
    targetControlY: l
  });
  return [
    `M${e},${t} C${s},${a} ${c},${l} ${o},${r}`,
    u,
    f,
    d,
    h
  ];
}
function Ss(e) {
  return I.memo(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, sourcePosition: s, targetPosition: a, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: x, interactionWidth: y }) => {
    const [C, m, b] = bs({
      sourceX: n,
      sourceY: o,
      sourcePosition: s,
      targetX: r,
      targetY: i,
      targetPosition: a
    }), k = e.isInternal ? void 0 : t;
    return p.jsx(Dt, { id: k, path: C, labelX: m, labelY: b, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: x, interactionWidth: y });
  });
}
const ag = Ss({ isInternal: !1 }), Es = Ss({ isInternal: !0 });
ag.displayName = "SimpleBezierEdge";
Es.displayName = "SimpleBezierEdgeInternal";
function _s(e) {
  return I.memo(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, sourcePosition: h = Y.Bottom, targetPosition: g = Y.Top, markerEnd: v, markerStart: x, pathOptions: y, interactionWidth: C }) => {
    const [m, b, k] = ln({
      sourceX: n,
      sourceY: o,
      sourcePosition: h,
      targetX: r,
      targetY: i,
      targetPosition: g,
      borderRadius: y?.borderRadius,
      offset: y?.offset,
      stepPosition: y?.stepPosition
    }), E = e.isInternal ? void 0 : t;
    return p.jsx(Dt, { id: E, path: m, labelX: b, labelY: k, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: v, markerStart: x, interactionWidth: C });
  });
}
const Cs = _s({ isInternal: !1 }), Ns = _s({ isInternal: !0 });
Cs.displayName = "SmoothStepEdge";
Ns.displayName = "SmoothStepEdgeInternal";
function Ms(e) {
  return I.memo(({ id: t, ...n }) => {
    const o = e.isInternal ? void 0 : t;
    return p.jsx(Cs, { ...n, id: o, pathOptions: I.useMemo(() => ({ borderRadius: 0, offset: n.pathOptions?.offset }), [n.pathOptions?.offset]) });
  });
}
const cg = Ms({ isInternal: !1 }), ks = Ms({ isInternal: !0 });
cg.displayName = "StepEdge";
ks.displayName = "StepEdgeInternal";
function Is(e) {
  return I.memo(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: g, interactionWidth: v }) => {
    const [x, y, C] = Wi({ sourceX: n, sourceY: o, targetX: r, targetY: i }), m = e.isInternal ? void 0 : t;
    return p.jsx(Dt, { id: m, path: x, labelX: y, labelY: C, label: s, labelStyle: a, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: g, interactionWidth: v });
  });
}
const lg = Is({ isInternal: !1 }), $s = Is({ isInternal: !0 });
lg.displayName = "StraightEdge";
$s.displayName = "StraightEdgeInternal";
function Ps(e) {
  return I.memo(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: i, sourcePosition: s = Y.Bottom, targetPosition: a = Y.Top, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: x, pathOptions: y, interactionWidth: C }) => {
    const [m, b, k] = Xi({
      sourceX: n,
      sourceY: o,
      sourcePosition: s,
      targetX: r,
      targetY: i,
      targetPosition: a,
      curvature: y?.curvature
    }), E = e.isInternal ? void 0 : t;
    return p.jsx(Dt, { id: E, path: m, labelX: b, labelY: k, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: x, interactionWidth: C });
  });
}
const ug = Ps({ isInternal: !1 }), As = Ps({ isInternal: !0 });
ug.displayName = "BezierEdge";
As.displayName = "BezierEdgeInternal";
const jr = {
  default: As,
  straight: $s,
  step: ks,
  smoothstep: Ns,
  simplebezier: Es
}, Dr = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, dg = (e, t, n) => n === Y.Left ? e - t : n === Y.Right ? e + t : e, fg = (e, t, n) => n === Y.Top ? e - t : n === Y.Bottom ? e + t : e, Hr = "react-flow__edgeupdater";
function zr({ position: e, centerX: t, centerY: n, radius: o = 10, onMouseDown: r, onMouseEnter: i, onMouseOut: s, type: a }) {
  return p.jsx("circle", { onMouseDown: r, onMouseEnter: i, onMouseOut: s, className: se([Hr, `${Hr}-${a}`]), cx: dg(t, o, e), cy: fg(n, o, e), r: o, stroke: "transparent", fill: "transparent" });
}
function hg({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: o, sourceY: r, targetX: i, targetY: s, sourcePosition: a, targetPosition: c, onReconnect: l, onReconnectStart: u, onReconnectEnd: f, setReconnecting: d, setUpdateHover: h }) {
  const g = re(), v = (b, k) => {
    if (b.button !== 0)
      return;
    const { autoPanOnConnect: E, domNode: M, connectionMode: A, connectionRadius: P, lib: V, onConnectStart: H, cancelConnection: B, nodeLookup: z, rfId: w, panBy: N, updateConnection: _ } = g.getState(), $ = k.type === "target", R = (S, j) => {
      d(!1), f?.(S, n, k.type, j);
    }, T = (S) => l?.(n, S), L = (S, j) => {
      d(!0), u?.(b, n, k.type), H?.(S, j);
    };
    eo.onPointerDown(b.nativeEvent, {
      autoPanOnConnect: E,
      connectionMode: A,
      connectionRadius: P,
      domNode: M,
      handleId: k.id,
      nodeId: k.nodeId,
      nodeLookup: z,
      isTarget: $,
      edgeUpdaterType: k.type,
      lib: V,
      flowId: w,
      cancelConnection: B,
      panBy: N,
      isValidConnection: (...S) => g.getState().isValidConnection?.(...S) ?? !0,
      onConnect: T,
      onConnectStart: L,
      onConnectEnd: (...S) => g.getState().onConnectEnd?.(...S),
      onReconnectEnd: R,
      updateConnection: _,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: b.currentTarget
    });
  }, x = (b) => v(b, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), y = (b) => v(b, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), C = () => h(!0), m = () => h(!1);
  return p.jsxs(p.Fragment, { children: [(e === !0 || e === "source") && p.jsx(zr, { position: a, centerX: o, centerY: r, radius: t, onMouseDown: x, onMouseEnter: C, onMouseOut: m, type: "source" }), (e === !0 || e === "target") && p.jsx(zr, { position: c, centerX: i, centerY: s, radius: t, onMouseDown: y, onMouseEnter: C, onMouseOut: m, type: "target" })] });
}
function gg({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: o, onClick: r, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: c, onMouseLeave: l, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, rfId: g, edgeTypes: v, noPanClassName: x, onError: y, disableKeyboardA11y: C }) {
  let m = te((Z) => Z.edgeLookup.get(e));
  const b = te((Z) => Z.defaultEdgeOptions);
  m = b ? { ...b, ...m } : m;
  let k = m.type || "default", E = v?.[k] || jr[k];
  E === void 0 && (y?.("011", we.error011(k)), k = "default", E = v?.default || jr.default);
  const M = !!(m.focusable || t && typeof m.focusable > "u"), A = typeof f < "u" && (m.reconnectable || n && typeof m.reconnectable > "u"), P = !!(m.selectable || o && typeof m.selectable > "u"), V = I.useRef(null), [H, B] = I.useState(!1), [z, w] = I.useState(!1), N = re(), { zIndex: _ = m.zIndex, sourceX: $, sourceY: R, targetX: T, targetY: L, sourcePosition: S, targetPosition: j } = te(I.useCallback((Z) => {
    const G = Z.nodeLookup.get(m.source), J = Z.nodeLookup.get(m.target);
    if (!G || !J)
      return Dr;
    const ee = Jd({
      id: e,
      sourceNode: G,
      targetNode: J,
      sourceHandle: m.sourceHandle || null,
      targetHandle: m.targetHandle || null,
      connectionMode: Z.connectionMode,
      onError: y
    }), ne = Yd({
      selected: m.selected,
      zIndex: m.zIndex,
      sourceNode: G,
      targetNode: J,
      elevateOnSelect: Z.elevateEdgesOnSelect,
      zIndexMode: Z.zIndexMode
    });
    return {
      ...ee || Dr,
      zIndex: ne
    };
  }, [m.source, m.target, m.sourceHandle, m.targetHandle, m.selected, m.zIndex, y]), ie), X = I.useMemo(() => m.markerStart ? `url('#${Qn(m.markerStart, g)}')` : void 0, [m.markerStart, g]), F = I.useMemo(() => m.markerEnd ? `url('#${Qn(m.markerEnd, g)}')` : void 0, [m.markerEnd, g]);
  if (m.hidden || $ === null || R === null || T === null || L === null)
    return null;
  const q = (Z) => {
    const { addSelectedEdges: G, unselectNodesAndEdges: J, multiSelectionActive: ee } = N.getState();
    P && (N.setState({ nodesSelectionActive: !1 }), m.selected && ee ? (J({ nodes: [], edges: [m] }), V.current?.blur()) : G([e])), r && r(Z, m);
  }, K = i ? (Z) => {
    i(Z, { ...m });
  } : void 0, W = s ? (Z) => {
    s(Z, { ...m });
  } : void 0, D = a ? (Z) => {
    a(Z, { ...m });
  } : void 0, O = c ? (Z) => {
    c(Z, { ...m });
  } : void 0, Q = l ? (Z) => {
    l(Z, { ...m });
  } : void 0, U = (Z) => {
    if (!C && Mi.includes(Z.key) && P) {
      const { unselectNodesAndEdges: G, addSelectedEdges: J } = N.getState();
      Z.key === "Escape" ? (V.current?.blur(), G({ edges: [m] })) : J([e]);
    }
  };
  return p.jsx("svg", { style: { zIndex: _ }, children: p.jsxs("g", { className: se([
    "react-flow__edge",
    `react-flow__edge-${k}`,
    m.className,
    x,
    {
      selected: m.selected,
      animated: m.animated,
      inactive: !P && !r,
      updating: H,
      selectable: P
    }
  ]), onClick: q, onDoubleClick: K, onContextMenu: W, onMouseEnter: D, onMouseMove: O, onMouseLeave: Q, onKeyDown: M ? U : void 0, tabIndex: M ? 0 : void 0, role: m.ariaRole ?? (M ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": m.ariaLabel === null ? void 0 : m.ariaLabel || `Edge from ${m.source} to ${m.target}`, "aria-describedby": M ? `${as}-${g}` : void 0, ref: V, ...m.domAttributes, children: [!z && p.jsx(E, { id: e, source: m.source, target: m.target, type: m.type, selected: m.selected, animated: m.animated, selectable: P, deletable: m.deletable ?? !0, label: m.label, labelStyle: m.labelStyle, labelShowBg: m.labelShowBg, labelBgStyle: m.labelBgStyle, labelBgPadding: m.labelBgPadding, labelBgBorderRadius: m.labelBgBorderRadius, sourceX: $, sourceY: R, targetX: T, targetY: L, sourcePosition: S, targetPosition: j, data: m.data, style: m.style, sourceHandleId: m.sourceHandle, targetHandleId: m.targetHandle, markerStart: X, markerEnd: F, pathOptions: "pathOptions" in m ? m.pathOptions : void 0, interactionWidth: m.interactionWidth }), A && p.jsx(hg, { edge: m, isReconnectable: A, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, sourceX: $, sourceY: R, targetX: T, targetY: L, sourcePosition: S, targetPosition: j, setUpdateHover: B, setReconnecting: w })] }) });
}
var pg = I.memo(gg);
const mg = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function Ts({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: o, noPanClassName: r, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: c, onEdgeMouseLeave: l, onEdgeClick: u, reconnectRadius: f, onEdgeDoubleClick: d, onReconnectStart: h, onReconnectEnd: g, disableKeyboardA11y: v }) {
  const { edgesFocusable: x, edgesReconnectable: y, elementsSelectable: C, onError: m } = te(mg, ie), b = eg(t);
  return p.jsxs("div", { className: "react-flow__edges", children: [p.jsx(ig, { defaultColor: e, rfId: n }), b.map((k) => p.jsx(pg, { id: k, edgesFocusable: x, edgesReconnectable: y, elementsSelectable: C, noPanClassName: r, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: c, onMouseLeave: l, onClick: u, reconnectRadius: f, onDoubleClick: d, onReconnectStart: h, onReconnectEnd: g, rfId: n, onError: m, edgeTypes: o, disableKeyboardA11y: v }, k))] });
}
Ts.displayName = "EdgeRenderer";
const yg = I.memo(Ts), Lr = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function xg({ children: e }) {
  const t = re(), n = I.useRef(null), [o] = I.useState(() => t.getState().transform);
  return ds(() => {
    let r = null;
    const i = () => {
      const s = t.getState().transform;
      r && s[0] === r[0] && s[1] === r[1] && s[2] === r[2] || (r = s, n.current && (n.current.style.transform = Lr(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), p.jsx("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Lr(o) }, children: e });
}
function wg(e) {
  const t = So(), n = I.useRef(!1);
  I.useEffect(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const vg = (e) => e.panZoom?.syncViewport;
function bg(e) {
  const t = te(vg), n = re();
  return I.useEffect(() => {
    e && (t?.(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Sg(e) {
  return e.connection.inProgress ? { ...e.connection, to: jt(e.connection.to, e.transform) } : { ...e.connection };
}
function Eg(e) {
  return Sg;
}
function _g(e) {
  const t = Eg();
  return te(t, ie);
}
const Cg = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Ng({ containerStyle: e, style: t, type: n, component: o }) {
  const { nodesConnectable: r, width: i, height: s, isValid: a, inProgress: c } = te(Cg, ie);
  return !(i && r && c) ? null : p.jsx("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: p.jsx("g", { className: se(["react-flow__connection", Li(a)]), children: p.jsx(Rs, { style: t, type: n, CustomComponent: o, isValid: a }) }) });
}
const Rs = ({ style: e, type: t = Le.Bezier, CustomComponent: n, isValid: o }) => {
  const { inProgress: r, from: i, fromNode: s, fromHandle: a, fromPosition: c, to: l, toNode: u, toHandle: f, toPosition: d, pointer: h } = _g();
  if (!r)
    return;
  if (n)
    return p.jsx(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: l.x, toY: l.y, fromPosition: c, toPosition: d, connectionStatus: Li(o), toNode: u, toHandle: f, pointer: h });
  let g = "";
  const v = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: c,
    targetX: l.x,
    targetY: l.y,
    targetPosition: d
  };
  switch (t) {
    case Le.Bezier:
      [g] = Xi(v);
      break;
    case Le.SimpleBezier:
      [g] = bs(v);
      break;
    case Le.Step:
      [g] = ln({
        ...v,
        borderRadius: 0
      });
      break;
    case Le.SmoothStep:
      [g] = ln(v);
      break;
    default:
      [g] = Wi(v);
  }
  return p.jsx("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
Rs.displayName = "ConnectionLine";
const Mg = {};
function Br(e = Mg) {
  I.useRef(e), re(), I.useEffect(() => {
  }, [e]);
}
function kg() {
  re(), I.useRef(!1), I.useEffect(() => {
  }, []);
}
function js({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: o, onEdgeClick: r, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: c, onNodeMouseLeave: l, onNodeContextMenu: u, onSelectionContextMenu: f, onSelectionStart: d, onSelectionEnd: h, connectionLineType: g, connectionLineStyle: v, connectionLineComponent: x, connectionLineContainerStyle: y, selectionKeyCode: C, selectionOnDrag: m, selectionMode: b, multiSelectionKeyCode: k, panActivationKeyCode: E, zoomActivationKeyCode: M, deleteKeyCode: A, onlyRenderVisibleElements: P, elementsSelectable: V, defaultViewport: H, translateExtent: B, minZoom: z, maxZoom: w, preventScrolling: N, defaultMarkerColor: _, zoomOnScroll: $, zoomOnPinch: R, panOnScroll: T, panOnScrollSpeed: L, panOnScrollMode: S, zoomOnDoubleClick: j, panOnDrag: X, autoPanOnSelection: F, onPaneClick: q, onPaneMouseEnter: K, onPaneMouseMove: W, onPaneMouseLeave: D, onPaneScroll: O, onPaneContextMenu: Q, paneClickDistance: U, nodeClickDistance: Z, onEdgeContextMenu: G, onEdgeMouseEnter: J, onEdgeMouseMove: ee, onEdgeMouseLeave: ne, reconnectRadius: ae, onReconnect: ke, onReconnectStart: Se, onReconnectEnd: Ee, noDragClassName: Ie, noWheelClassName: ft, noPanClassName: Oe, disableKeyboardA11y: Fe, nodeExtent: ge, rfId: $e, viewport: Pe, onViewportChange: Xe, nodesDraggable: Nn }) {
  return Br(e), Br(t), kg(), wg(n), bg(Pe), p.jsx(Xh, { onPaneClick: q, onPaneMouseEnter: K, onPaneMouseMove: W, onPaneMouseLeave: D, onPaneContextMenu: Q, onPaneScroll: O, paneClickDistance: U, deleteKeyCode: A, selectionKeyCode: C, selectionOnDrag: m, selectionMode: b, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: k, panActivationKeyCode: E, zoomActivationKeyCode: M, elementsSelectable: V, zoomOnScroll: $, zoomOnPinch: R, zoomOnDoubleClick: j, panOnScroll: T, panOnScrollSpeed: L, panOnScrollMode: S, panOnDrag: X, autoPanOnSelection: F, defaultViewport: H, translateExtent: B, minZoom: z, maxZoom: w, onSelectionContextMenu: f, preventScrolling: N, noDragClassName: Ie, noWheelClassName: ft, noPanClassName: Oe, disableKeyboardA11y: Fe, onViewportChange: Xe, isControlledViewport: !!Pe, children: p.jsxs(xg, { children: [p.jsx(yg, { edgeTypes: t, onEdgeClick: r, onEdgeDoubleClick: s, onReconnect: ke, onReconnectStart: Se, onReconnectEnd: Ee, onlyRenderVisibleElements: P, onEdgeContextMenu: G, onEdgeMouseEnter: J, onEdgeMouseMove: ee, onEdgeMouseLeave: ne, reconnectRadius: ae, defaultMarkerColor: _, noPanClassName: Oe, disableKeyboardA11y: Fe, rfId: $e }), p.jsx(Ng, { style: v, type: g, component: x, containerStyle: y }), p.jsx("div", { className: "react-flow__edgelabel-renderer" }), p.jsx(Jh, { nodeTypes: e, onNodeClick: o, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: c, onNodeMouseLeave: l, onNodeContextMenu: u, nodeClickDistance: Z, onlyRenderVisibleElements: P, noPanClassName: Oe, noDragClassName: Ie, disableKeyboardA11y: Fe, nodeExtent: ge, rfId: $e, nodesDraggable: Nn }), p.jsx("div", { className: "react-flow__viewport-portal" })] }) });
}
js.displayName = "GraphView";
const Ig = I.memo(js), $g = Di(), Vr = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: i, fitView: s, fitViewOptions: a, minZoom: c = 0.5, maxZoom: l = 2, nodeOrigin: u, nodeExtent: f, zIndexMode: d = "basic" } = {}) => {
  const h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), y = o ?? t ?? [], C = n ?? e ?? [], m = u ?? [0, 0], b = f ?? _t;
  Gi(v, x, y);
  const { nodesInitialized: k } = Jn(C, h, g, {
    nodeOrigin: m,
    nodeExtent: b,
    zIndexMode: d
  });
  let E = [0, 0, 1];
  if (s && r && i) {
    const M = Tt(h, {
      filter: (H) => !!((H.width || H.initialWidth) && (H.height || H.initialHeight))
    }), { x: A, y: P, zoom: V } = po(M, r, i, c, l, a?.padding ?? 0.1);
    E = [A, P, V];
  }
  return {
    rfId: "1",
    width: r ?? 0,
    height: i ?? 0,
    transform: E,
    nodes: C,
    nodesInitialized: k,
    nodeLookup: h,
    parentLookup: g,
    edges: y,
    edgeLookup: x,
    connectionLookup: v,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: o !== void 0,
    panZoom: null,
    minZoom: c,
    maxZoom: l,
    translateExtent: _t,
    nodeExtent: b,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: at.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: m,
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
    fitViewQueued: s ?? !1,
    fitViewOptions: a,
    fitViewResolver: null,
    connection: { ...Ii },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: $g,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: ki,
    zIndexMode: d,
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
}, Pg = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: i, fitView: s, fitViewOptions: a, minZoom: c, maxZoom: l, nodeOrigin: u, nodeExtent: f, zIndexMode: d }) => Ff((h, g) => {
  async function v() {
    const { nodeLookup: x, panZoom: y, fitViewOptions: C, fitViewResolver: m, width: b, height: k, minZoom: E, maxZoom: M } = g();
    y && (await zd({
      nodes: x,
      width: b,
      height: k,
      panZoom: y,
      minZoom: E,
      maxZoom: M
    }, C), m?.resolve(!0), h({ fitViewResolver: null }));
  }
  return {
    ...Vr({
      nodes: e,
      edges: t,
      width: r,
      height: i,
      fitView: s,
      fitViewOptions: a,
      minZoom: c,
      maxZoom: l,
      nodeOrigin: u,
      nodeExtent: f,
      defaultNodes: n,
      defaultEdges: o,
      zIndexMode: d
    }),
    setNodes: (x) => {
      const { nodeLookup: y, parentLookup: C, nodeOrigin: m, nodeExtent: b, elevateNodesOnSelect: k, fitViewQueued: E, zIndexMode: M, nodesSelectionActive: A } = g(), { nodesInitialized: P, hasSelectedNodes: V } = Jn(x, y, C, {
        nodeOrigin: m,
        nodeExtent: b,
        elevateNodesOnSelect: k,
        checkEquality: !0,
        zIndexMode: M
      }), H = A && V;
      E && P ? (v(), h({
        nodes: x,
        nodesInitialized: P,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: H
      })) : h({ nodes: x, nodesInitialized: P, nodesSelectionActive: H });
    },
    setEdges: (x) => {
      const { connectionLookup: y, edgeLookup: C } = g();
      Gi(y, C, x), h({ edges: x });
    },
    setDefaultNodesAndEdges: (x, y) => {
      if (x) {
        const { setNodes: C } = g();
        C(x), h({ hasDefaultNodes: !0 });
      }
      if (y) {
        const { setEdges: C } = g();
        C(y), h({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (x) => {
      const { triggerNodeChanges: y, nodeLookup: C, parentLookup: m, domNode: b, nodeOrigin: k, nodeExtent: E, debug: M, fitViewQueued: A, zIndexMode: P } = g(), { changes: V, updatedInternals: H } = cf(x, C, m, b, k, E, P);
      H && (of(C, m, { nodeOrigin: k, nodeExtent: E, zIndexMode: P }), A ? (v(), h({ fitViewQueued: !1, fitViewOptions: void 0 })) : h({}), V?.length > 0 && (M && console.log("React Flow: trigger node changes", V), y?.(V)));
    },
    updateNodePositions: (x, y = !1) => {
      const C = [];
      let m = [];
      const { nodeLookup: b, triggerNodeChanges: k, connection: E, updateConnection: M, onNodesChangeMiddlewareMap: A } = g();
      for (const [P, V] of x) {
        const H = b.get(P), B = !!(H?.expandParent && H?.parentId && V?.position), z = {
          id: P,
          type: "position",
          position: B ? {
            x: Math.max(0, V.position.x),
            y: Math.max(0, V.position.y)
          } : V.position,
          dragging: y
        };
        if (H && E.inProgress && E.fromNode.id === H.id) {
          const w = Je(H, E.fromHandle, Y.Left, !0);
          M({ ...E, from: w });
        }
        B && H.parentId && C.push({
          id: P,
          parentId: H.parentId,
          rect: {
            ...V.internals.positionAbsolute,
            width: V.measured.width ?? 0,
            height: V.measured.height ?? 0
          }
        }), m.push(z);
      }
      if (C.length > 0) {
        const { parentLookup: P, nodeOrigin: V } = g(), H = bo(C, b, P, V);
        m.push(...H);
      }
      for (const P of A.values())
        m = P(m);
      k(m);
    },
    triggerNodeChanges: (x) => {
      const { onNodesChange: y, setNodes: C, nodes: m, hasDefaultNodes: b, debug: k } = g();
      if (x?.length) {
        if (b) {
          const E = uh(x, m);
          C(E);
        }
        k && console.log("React Flow: trigger node changes", x), y?.(x);
      }
    },
    triggerEdgeChanges: (x) => {
      const { onEdgesChange: y, setEdges: C, edges: m, hasDefaultEdges: b, debug: k } = g();
      if (x?.length) {
        if (b) {
          const E = dh(x, m);
          C(E);
        }
        k && console.log("React Flow: trigger edge changes", x), y?.(x);
      }
    },
    addSelectedNodes: (x) => {
      const { multiSelectionActive: y, edgeLookup: C, nodeLookup: m, triggerNodeChanges: b, triggerEdgeChanges: k } = g();
      if (y) {
        const E = x.map((M) => Ye(M, !0));
        b(E);
        return;
      }
      b(nt(m, /* @__PURE__ */ new Set([...x]), !0)), k(nt(C));
    },
    addSelectedEdges: (x) => {
      const { multiSelectionActive: y, edgeLookup: C, nodeLookup: m, triggerNodeChanges: b, triggerEdgeChanges: k } = g();
      if (y) {
        const E = x.map((M) => Ye(M, !0));
        k(E);
        return;
      }
      k(nt(C, /* @__PURE__ */ new Set([...x]))), b(nt(m, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: x, edges: y } = {}) => {
      const { edges: C, nodes: m, nodeLookup: b, triggerNodeChanges: k, triggerEdgeChanges: E } = g(), M = x || m, A = y || C, P = [];
      for (const H of M) {
        if (!H.selected)
          continue;
        const B = b.get(H.id);
        B && (B.selected = !1), P.push(Ye(H.id, !1));
      }
      const V = [];
      for (const H of A)
        H.selected && V.push(Ye(H.id, !1));
      k(P), E(V);
    },
    setMinZoom: (x) => {
      const { panZoom: y, maxZoom: C } = g();
      y?.setScaleExtent([x, C]), h({ minZoom: x });
    },
    setMaxZoom: (x) => {
      const { panZoom: y, minZoom: C } = g();
      y?.setScaleExtent([C, x]), h({ maxZoom: x });
    },
    setTranslateExtent: (x) => {
      g().panZoom?.setTranslateExtent(x), h({ translateExtent: x });
    },
    resetSelectedElements: () => {
      const { edges: x, nodes: y, triggerNodeChanges: C, triggerEdgeChanges: m, elementsSelectable: b } = g();
      if (!b)
        return;
      const k = y.reduce((M, A) => A.selected ? [...M, Ye(A.id, !1)] : M, []), E = x.reduce((M, A) => A.selected ? [...M, Ye(A.id, !1)] : M, []);
      C(k), m(E);
    },
    setNodeExtent: (x) => {
      const { nodes: y, nodeLookup: C, parentLookup: m, nodeOrigin: b, elevateNodesOnSelect: k, nodeExtent: E, zIndexMode: M } = g();
      x[0][0] === E[0][0] && x[0][1] === E[0][1] && x[1][0] === E[1][0] && x[1][1] === E[1][1] || (Jn(y, C, m, {
        nodeOrigin: b,
        nodeExtent: x,
        elevateNodesOnSelect: k,
        checkEquality: !1,
        zIndexMode: M
      }), h({ nodeExtent: x }));
    },
    panBy: (x) => {
      const { transform: y, width: C, height: m, panZoom: b, translateExtent: k } = g();
      return lf({ delta: x, panZoom: b, transform: y, translateExtent: k, width: C, height: m });
    },
    setCenter: async (x, y, C) => {
      const { width: m, height: b, maxZoom: k, panZoom: E } = g();
      if (!E)
        return !1;
      const M = typeof C?.zoom < "u" ? C.zoom : k;
      return await E.setViewport({
        x: m / 2 - x * M,
        y: b / 2 - y * M,
        zoom: M
      }, { duration: C?.duration, ease: C?.ease, interpolate: C?.interpolate }), !0;
    },
    cancelConnection: () => {
      h({
        connection: { ...Ii }
      });
    },
    updateConnection: (x) => {
      h({ connection: x });
    },
    reset: () => h({ ...Vr() })
  };
}, Object.is);
function Ag({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: o, initialWidth: r, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: c, fitView: l, nodeOrigin: u, nodeExtent: f, zIndexMode: d, children: h }) {
  const [g] = I.useState(() => Pg({
    nodes: e,
    edges: t,
    defaultNodes: n,
    defaultEdges: o,
    width: r,
    height: i,
    fitView: l,
    minZoom: s,
    maxZoom: a,
    fitViewOptions: c,
    nodeOrigin: u,
    nodeExtent: f,
    zIndexMode: d
  }));
  return p.jsx(Xf, { value: g, children: p.jsx(mh, { children: p.jsx(Ph, { children: h }) }) });
}
function Tg({ children: e, nodes: t, edges: n, defaultNodes: o, defaultEdges: r, width: i, height: s, fitView: a, fitViewOptions: c, minZoom: l, maxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h }) {
  return I.useContext(Sn) ? p.jsx(p.Fragment, { children: e }) : p.jsx(Ag, { initialNodes: t, initialEdges: n, defaultNodes: o, defaultEdges: r, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: c, initialMinZoom: l, initialMaxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h, children: e });
}
const Rg = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function jg({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, className: r, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: c, onInit: l, onMove: u, onMoveStart: f, onMoveEnd: d, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: x, onClickConnectEnd: y, onNodeMouseEnter: C, onNodeMouseMove: m, onNodeMouseLeave: b, onNodeContextMenu: k, onNodeDoubleClick: E, onNodeDragStart: M, onNodeDrag: A, onNodeDragStop: P, onNodesDelete: V, onEdgesDelete: H, onDelete: B, onSelectionChange: z, onSelectionDragStart: w, onSelectionDrag: N, onSelectionDragStop: _, onSelectionContextMenu: $, onSelectionStart: R, onSelectionEnd: T, onBeforeDelete: L, connectionMode: S, connectionLineType: j = Le.Bezier, connectionLineStyle: X, connectionLineComponent: F, connectionLineContainerStyle: q, deleteKeyCode: K = "Backspace", selectionKeyCode: W = "Shift", selectionOnDrag: D = !1, selectionMode: O = Ct.Full, panActivationKeyCode: Q = "Space", multiSelectionKeyCode: U = kt() ? "Meta" : "Control", zoomActivationKeyCode: Z = kt() ? "Meta" : "Control", snapToGrid: G, snapGrid: J, onlyRenderVisibleElements: ee = !1, selectNodesOnDrag: ne, nodesDraggable: ae, autoPanOnNodeFocus: ke, nodesConnectable: Se, nodesFocusable: Ee, nodeOrigin: Ie = cs, edgesFocusable: ft, edgesReconnectable: Oe, elementsSelectable: Fe = !0, defaultViewport: ge = oh, minZoom: $e = 0.5, maxZoom: Pe = 2, translateExtent: Xe = _t, preventScrolling: Nn = !0, nodeExtent: Mn, defaultMarkerColor: Ys = "#b1b1b7", zoomOnScroll: Ws = !0, zoomOnPinch: Zs = !0, panOnScroll: qs = !1, panOnScrollSpeed: Gs = 0.5, panOnScrollMode: Us = qe.Free, zoomOnDoubleClick: Ks = !0, panOnDrag: Qs = !0, onPaneClick: Js, onPaneMouseEnter: ea, onPaneMouseMove: ta, onPaneMouseLeave: na, onPaneScroll: oa, onPaneContextMenu: ra, paneClickDistance: ia = 1, nodeClickDistance: sa = 0, children: aa, onReconnect: ca, onReconnectStart: la, onReconnectEnd: ua, onEdgeContextMenu: da, onEdgeDoubleClick: fa, onEdgeMouseEnter: ha, onEdgeMouseMove: ga, onEdgeMouseLeave: pa, reconnectRadius: ma = 10, onNodesChange: ya, onEdgesChange: xa, noDragClassName: wa = "nodrag", noWheelClassName: va = "nowheel", noPanClassName: No = "nopan", fitView: Mo, fitViewOptions: ko, connectOnClick: ba, attributionPosition: Sa, proOptions: Ea, defaultEdgeOptions: _a, elevateNodesOnSelect: Ca = !0, elevateEdgesOnSelect: Na = !1, disableKeyboardA11y: Io = !1, autoPanOnConnect: Ma, autoPanOnNodeDrag: ka, autoPanOnSelection: Ia = !0, autoPanSpeed: $a, connectionRadius: Pa, isValidConnection: Aa, onError: Ta, style: Ra, id: $o, nodeDragThreshold: ja, connectionDragThreshold: Da, viewport: Ha, onViewportChange: za, width: La, height: Ba, colorMode: Va = "light", debug: Oa, onScroll: Po, ariaLabelConfig: Fa, zIndexMode: Ao = "basic", ...Xa }, Ya) {
  const kn = $o || "1", Wa = ah(Va), Za = I.useCallback((To) => {
    To.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Po?.(To);
  }, [Po]);
  return p.jsx("div", { "data-testid": "rf__wrapper", ...Xa, onScroll: Za, style: { ...Ra, ...Rg }, ref: Ya, className: se(["react-flow", r, Wa]), id: $o, role: "application", children: p.jsxs(Tg, { nodes: e, edges: t, width: La, height: Ba, fitView: Mo, fitViewOptions: ko, minZoom: $e, maxZoom: Pe, nodeOrigin: Ie, nodeExtent: Mn, zIndexMode: Ao, children: [p.jsx(sh, { nodes: e, edges: t, defaultNodes: n, defaultEdges: o, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: x, onClickConnectEnd: y, nodesDraggable: ae, autoPanOnNodeFocus: ke, nodesConnectable: Se, nodesFocusable: Ee, edgesFocusable: ft, edgesReconnectable: Oe, elementsSelectable: Fe, elevateNodesOnSelect: Ca, elevateEdgesOnSelect: Na, minZoom: $e, maxZoom: Pe, nodeExtent: Mn, onNodesChange: ya, onEdgesChange: xa, snapToGrid: G, snapGrid: J, connectionMode: S, translateExtent: Xe, connectOnClick: ba, defaultEdgeOptions: _a, fitView: Mo, fitViewOptions: ko, onNodesDelete: V, onEdgesDelete: H, onDelete: B, onNodeDragStart: M, onNodeDrag: A, onNodeDragStop: P, onSelectionDrag: N, onSelectionDragStart: w, onSelectionDragStop: _, onMove: u, onMoveStart: f, onMoveEnd: d, noPanClassName: No, nodeOrigin: Ie, rfId: kn, autoPanOnConnect: Ma, autoPanOnNodeDrag: ka, autoPanSpeed: $a, onError: Ta, connectionRadius: Pa, isValidConnection: Aa, selectNodesOnDrag: ne, nodeDragThreshold: ja, connectionDragThreshold: Da, onBeforeDelete: L, debug: Oa, ariaLabelConfig: Fa, zIndexMode: Ao }), p.jsx(Ig, { onInit: l, onNodeClick: a, onEdgeClick: c, onNodeMouseEnter: C, onNodeMouseMove: m, onNodeMouseLeave: b, onNodeContextMenu: k, onNodeDoubleClick: E, nodeTypes: i, edgeTypes: s, connectionLineType: j, connectionLineStyle: X, connectionLineComponent: F, connectionLineContainerStyle: q, selectionKeyCode: W, selectionOnDrag: D, selectionMode: O, deleteKeyCode: K, multiSelectionKeyCode: U, panActivationKeyCode: Q, zoomActivationKeyCode: Z, onlyRenderVisibleElements: ee, defaultViewport: ge, translateExtent: Xe, minZoom: $e, maxZoom: Pe, preventScrolling: Nn, zoomOnScroll: Ws, zoomOnPinch: Zs, zoomOnDoubleClick: Ks, panOnScroll: qs, panOnScrollSpeed: Gs, panOnScrollMode: Us, panOnDrag: Qs, autoPanOnSelection: Ia, onPaneClick: Js, onPaneMouseEnter: ea, onPaneMouseMove: ta, onPaneMouseLeave: na, onPaneScroll: oa, onPaneContextMenu: ra, paneClickDistance: ia, nodeClickDistance: sa, onSelectionContextMenu: $, onSelectionStart: R, onSelectionEnd: T, onReconnect: ca, onReconnectStart: la, onReconnectEnd: ua, onEdgeContextMenu: da, onEdgeDoubleClick: fa, onEdgeMouseEnter: ha, onEdgeMouseMove: ga, onEdgeMouseLeave: pa, reconnectRadius: ma, defaultMarkerColor: Ys, noDragClassName: wa, noWheelClassName: va, noPanClassName: No, rfId: kn, disableKeyboardA11y: Io, nodeExtent: Mn, viewport: Ha, onViewportChange: za, nodesDraggable: ae }), p.jsx(nh, { onSelectionChange: z }), aa, p.jsx(Kf, { proOptions: Ea, position: Sa }), p.jsx(Uf, { rfId: kn, disableKeyboardA11y: Io })] }) });
}
var Dg = us(jg);
function Hg({ dimensions: e, lineWidth: t, variant: n, className: o }) {
  return p.jsx("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: se(["react-flow__background-pattern", n, o]) });
}
function zg({ radius: e, className: t }) {
  return p.jsx("circle", { cx: e, cy: e, r: e, className: se(["react-flow__background-pattern", "dots", t]) });
}
var Be;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(Be || (Be = {}));
const Lg = {
  [Be.Dots]: 1,
  [Be.Lines]: 1,
  [Be.Cross]: 6
}, Bg = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function Ds({
  id: e,
  variant: t = Be.Dots,
  // only used for dots and cross
  gap: n = 20,
  // only used for lines and cross
  size: o,
  lineWidth: r = 1,
  offset: i = 0,
  color: s,
  bgColor: a,
  style: c,
  className: l,
  patternClassName: u
}) {
  const f = I.useRef(null), { transform: d, patternId: h } = te(Bg, ie), g = o || Lg[t], v = t === Be.Dots, x = t === Be.Cross, y = Array.isArray(n) ? n : [n, n], C = [y[0] * d[2] || 1, y[1] * d[2] || 1], m = g * d[2], b = Array.isArray(i) ? i : [i, i], k = x ? [m, m] : C, E = [
    b[0] * d[2] + k[0] / 2,
    b[1] * d[2] + k[1] / 2
  ], M = `${h}${e || ""}`;
  return p.jsxs("svg", { className: se(["react-flow__background", l]), style: {
    ...c,
    ..._n,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [p.jsx("pattern", { id: M, x: d[0] % C[0], y: d[1] % C[1], width: C[0], height: C[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${E[0]},-${E[1]})`, children: v ? p.jsx(zg, { radius: m / 2, className: u }) : p.jsx(Hg, { dimensions: k, lineWidth: r, variant: t, className: u }) }), p.jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${M})` })] });
}
Ds.displayName = "Background";
const Vg = I.memo(Ds);
function Og() {
  return p.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: p.jsx("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function Fg() {
  return p.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: p.jsx("path", { d: "M0 0h32v4.2H0z" }) });
}
function Xg() {
  return p.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: p.jsx("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function Yg() {
  return p.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: p.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function Wg() {
  return p.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: p.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function Yt({ children: e, className: t, ...n }) {
  return p.jsx("button", { type: "button", className: se(["react-flow__controls-button", t]), ...n, children: e });
}
const Zg = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function Hs({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: o = !0, fitViewOptions: r, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: c, className: l, children: u, position: f = "bottom-left", orientation: d = "vertical", "aria-label": h }) {
  const g = re(), { isInteractive: v, minZoomReached: x, maxZoomReached: y, ariaLabelConfig: C } = te(Zg, ie), { zoomIn: m, zoomOut: b, fitView: k } = So(), E = () => {
    m(), i?.();
  }, M = () => {
    b(), s?.();
  }, A = () => {
    k(r), a?.();
  }, P = () => {
    g.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), c?.(!v);
  }, V = d === "horizontal" ? "horizontal" : "vertical";
  return p.jsxs(En, { className: se(["react-flow__controls", V, l]), position: f, style: e, "data-testid": "rf__controls", "aria-label": h ?? C["controls.ariaLabel"], children: [t && p.jsxs(p.Fragment, { children: [p.jsx(Yt, { onClick: E, className: "react-flow__controls-zoomin", title: C["controls.zoomIn.ariaLabel"], "aria-label": C["controls.zoomIn.ariaLabel"], disabled: y, children: p.jsx(Og, {}) }), p.jsx(Yt, { onClick: M, className: "react-flow__controls-zoomout", title: C["controls.zoomOut.ariaLabel"], "aria-label": C["controls.zoomOut.ariaLabel"], disabled: x, children: p.jsx(Fg, {}) })] }), n && p.jsx(Yt, { className: "react-flow__controls-fitview", onClick: A, title: C["controls.fitView.ariaLabel"], "aria-label": C["controls.fitView.ariaLabel"], children: p.jsx(Xg, {}) }), o && p.jsx(Yt, { className: "react-flow__controls-interactive", onClick: P, title: C["controls.interactive.ariaLabel"], "aria-label": C["controls.interactive.ariaLabel"], children: v ? p.jsx(Wg, {}) : p.jsx(Yg, {}) }), u] });
}
Hs.displayName = "Controls";
const qg = I.memo(Hs);
function Gg({ id: e, x: t, y: n, width: o, height: r, style: i, color: s, strokeColor: a, strokeWidth: c, className: l, borderRadius: u, shapeRendering: f, selected: d, onClick: h }) {
  const { background: g, backgroundColor: v } = i || {}, x = s || g || v;
  return p.jsx("rect", { className: se(["react-flow__minimap-node", { selected: d }, l]), x: t, y: n, rx: u, ry: u, width: o, height: r, style: {
    fill: x,
    stroke: a,
    strokeWidth: c
  }, shapeRendering: f, onClick: h ? (y) => h(y, e) : void 0 });
}
const Ug = I.memo(Gg), Kg = (e) => e.nodes.map((t) => t.id), Vn = (e) => e instanceof Function ? e : () => e;
function Qg({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: o = 5,
  nodeStrokeWidth: r,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = Ug,
  onClick: s
}) {
  const a = te(Kg, ie), c = Vn(t), l = Vn(e), u = Vn(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return p.jsx(p.Fragment, { children: a.map((d) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    p.jsx(ep, { id: d, nodeColorFunc: c, nodeStrokeColorFunc: l, nodeClassNameFunc: u, nodeBorderRadius: o, nodeStrokeWidth: r, NodeComponent: i, onClick: s, shapeRendering: f }, d)
  )) });
}
function Jg({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: o, nodeBorderRadius: r, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: c }) {
  const { node: l, x: u, y: f, width: d, height: h } = te((g) => {
    const v = g.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const x = v.internals.userNode, { x: y, y: C } = v.internals.positionAbsolute, { width: m, height: b } = be(x);
    return {
      node: x,
      x: y,
      y: C,
      width: m,
      height: b
    };
  }, ie);
  return !l || l.hidden || !Hi(l) ? null : p.jsx(a, { x: u, y: f, width: d, height: h, style: l.style, selected: !!l.selected, className: o(l), color: t(l), borderRadius: r, strokeColor: n(l), strokeWidth: i, shapeRendering: s, onClick: c, id: l.id });
}
const ep = I.memo(Jg);
var tp = I.memo(Qg);
const np = 200, op = 150, rp = (e) => !e.hidden, ip = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  let n = !1;
  for (const o of e.nodeLookup.values())
    if (!o.hidden) {
      n = !0;
      break;
    }
  return {
    viewBB: t,
    boundingRect: n ? Ri(Tt(e.nodeLookup, { filter: rp }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Or = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, sp = (e, t) => Or(e.viewBB, t.viewBB) && Or(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, ap = "react-flow__minimap-desc";
function zs({
  style: e,
  className: t,
  nodeStrokeColor: n,
  nodeColor: o,
  nodeClassName: r = "",
  nodeBorderRadius: i = 5,
  nodeStrokeWidth: s,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: a,
  bgColor: c,
  maskColor: l,
  maskStrokeColor: u,
  maskStrokeWidth: f,
  position: d = "bottom-right",
  onClick: h,
  onNodeClick: g,
  pannable: v = !1,
  zoomable: x = !1,
  ariaLabel: y,
  inversePan: C,
  zoomStep: m = 1,
  offsetScale: b = 5
}) {
  const k = re(), E = I.useRef(null), { boundingRect: M, panZoom: A, viewBB: P, rfId: V, translateExtent: H, flowWidth: B, flowHeight: z, ariaLabelConfig: w } = te(ip, sp), N = e?.width ?? np, _ = e?.height ?? op, $ = M.width / N, R = M.height / _, T = Math.max($, R), L = T * N, S = T * _, j = b * T, X = M.x - (L - M.width) / 2 - j, F = M.y - (S - M.height) / 2 - j, q = L + j * 2, K = S + j * 2, W = `${ap}-${V}`, D = I.useRef(0), O = I.useRef();
  D.current = T, I.useEffect(() => {
    const J = k.getState().panZoom;
    if (E.current && J)
      return O.current = xf({
        domNode: E.current,
        panZoom: J,
        getTransform: () => k.getState().transform,
        getViewScale: () => D.current
      }), () => {
        O.current?.destroy();
      };
  }, [A]), I.useEffect(() => {
    O.current?.update({
      translateExtent: H,
      width: B,
      height: z,
      inversePan: C,
      pannable: v,
      zoomStep: m,
      zoomable: x
    });
  }, [v, x, C, m, H, B, z]);
  const Q = h ? (J) => {
    const [ee, ne] = O.current?.pointer(J) || [0, 0];
    h(J, { x: ee, y: ne });
  } : void 0, U = I.useCallback((J, ee) => {
    const ne = k.getState().nodeLookup.get(ee).internals.userNode;
    g?.(J, ne);
  }, [g]), Z = g ? U : void 0, G = y ?? w["minimap.ariaLabel"];
  return p.jsx(En, { position: d, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof u == "string" ? u : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * T : void 0,
    "--xy-minimap-node-background-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: se(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: p.jsxs("svg", { width: N, height: _, viewBox: `${X} ${F} ${q} ${K}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": W, ref: E, onClick: Q, children: [G && p.jsx("title", { id: W, children: G }), p.jsx(tp, { onClick: Z, nodeColor: o, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: r, nodeStrokeWidth: s, nodeComponent: a }), p.jsx("path", { className: "react-flow__minimap-mask", d: `M${X - j},${F - j}h${q + j * 2}v${K + j * 2}h${-q - j * 2}z
        M${P.x},${P.y}h${P.width}v${P.height}h${-P.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
zs.displayName = "MiniMap";
const cp = I.memo(zs), lp = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, up = {
  [ut.Line]: "right",
  [ut.Handle]: "bottom-right"
};
function dp({ nodeId: e, position: t, variant: n = ut.Handle, className: o, style: r = void 0, children: i, color: s, minWidth: a = 10, minHeight: c = 10, maxWidth: l = Number.MAX_VALUE, maxHeight: u = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: d, autoScale: h = !0, shouldResize: g, onResizeStart: v, onResize: x, onResizeEnd: y }) {
  const C = ps(), m = typeof e == "string" ? e : C, b = re(), k = I.useRef(null), E = n === ut.Handle, M = te(I.useCallback(lp(E && h), [E, h]), ie), A = I.useRef(null), P = t ?? up[n];
  I.useEffect(() => {
    if (!(!k.current || !m))
      return A.current || (A.current = Pf({
        domNode: k.current,
        nodeId: m,
        getStoreItems: () => {
          const { nodeLookup: H, transform: B, snapGrid: z, snapToGrid: w, nodeOrigin: N, domNode: _ } = b.getState();
          return {
            nodeLookup: H,
            transform: B,
            snapGrid: z,
            snapToGrid: w,
            nodeOrigin: N,
            paneDomNode: _
          };
        },
        onChange: (H, B) => {
          const { triggerNodeChanges: z, nodeLookup: w, parentLookup: N, nodeOrigin: _ } = b.getState(), $ = [], R = { x: H.x, y: H.y }, T = w.get(m);
          if (T && T.expandParent && T.parentId) {
            const L = T.origin ?? _, S = H.width ?? T.measured.width ?? 0, j = H.height ?? T.measured.height ?? 0, X = {
              id: T.id,
              parentId: T.parentId,
              rect: {
                width: S,
                height: j,
                ...zi({
                  x: H.x ?? T.position.x,
                  y: H.y ?? T.position.y
                }, { width: S, height: j }, T.parentId, w, L)
              }
            }, F = bo([X], w, N, _);
            $.push(...F), R.x = H.x ? Math.max(L[0] * S, H.x) : void 0, R.y = H.y ? Math.max(L[1] * j, H.y) : void 0;
          }
          if (R.x !== void 0 && R.y !== void 0) {
            const L = {
              id: m,
              type: "position",
              position: { ...R }
            };
            $.push(L);
          }
          if (H.width !== void 0 && H.height !== void 0) {
            const S = {
              id: m,
              type: "dimensions",
              resizing: !0,
              setAttributes: d ? d === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: H.width,
                height: H.height
              }
            };
            $.push(S);
          }
          for (const L of B) {
            const S = {
              ...L,
              type: "position"
            };
            $.push(S);
          }
          z($);
        },
        onEnd: ({ width: H, height: B }) => {
          const z = {
            id: m,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: H,
              height: B
            }
          };
          b.getState().triggerNodeChanges([z]);
        }
      })), A.current.update({
        controlPosition: P,
        boundaries: {
          minWidth: a,
          minHeight: c,
          maxWidth: l,
          maxHeight: u
        },
        keepAspectRatio: f,
        resizeDirection: d,
        onResizeStart: v,
        onResize: x,
        onResizeEnd: y,
        shouldResize: g
      }), () => {
        A.current?.destroy();
      };
  }, [
    P,
    a,
    c,
    l,
    u,
    f,
    v,
    x,
    y,
    g
  ]);
  const V = P.split("-");
  return p.jsx("div", { className: se(["react-flow__resize-control", "nodrag", ...V, n, o]), ref: k, style: {
    ...r,
    scale: M,
    ...s && { [E ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
I.memo(dp);
function fp(e, t) {
  if (e.match(/^[a-z]+:\/\//i))
    return e;
  if (e.match(/^\/\//))
    return window.location.protocol + e;
  if (e.match(/^[a-z]+:/i))
    return e;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), r = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(r), t && (o.href = t), r.href = e, r.href;
}
const hp = /* @__PURE__ */ (() => {
  let e = 0;
  const t = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (e += 1, `u${t()}${e}`);
})();
function Re(e) {
  const t = [];
  for (let n = 0, o = e.length; n < o; n++)
    t.push(e[n]);
  return t;
}
function dn(e, t) {
  const o = (e.ownerDocument.defaultView || window).getComputedStyle(e).getPropertyValue(t);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function gp(e) {
  const t = dn(e, "border-left-width"), n = dn(e, "border-right-width");
  return e.clientWidth + t + n;
}
function pp(e) {
  const t = dn(e, "border-top-width"), n = dn(e, "border-bottom-width");
  return e.clientHeight + t + n;
}
function Ls(e, t = {}) {
  const n = t.width || gp(e), o = t.height || pp(e);
  return { width: n, height: o };
}
function mp() {
  let e, t;
  try {
    t = process;
  } catch {
  }
  const n = t && t.env ? t.env.devicePixelRatio : null;
  return n && (e = parseInt(n, 10), Number.isNaN(e) && (e = 1)), e || window.devicePixelRatio || 1;
}
const de = 16384;
function yp(e) {
  (e.width > de || e.height > de) && (e.width > de && e.height > de ? e.width > e.height ? (e.height *= de / e.width, e.width = de) : (e.width *= de / e.height, e.height = de) : e.width > de ? (e.height *= de / e.width, e.width = de) : (e.width *= de / e.height, e.height = de));
}
function fn(e) {
  return new Promise((t, n) => {
    const o = new Image();
    o.decode = () => t(o), o.onload = () => t(o), o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = e;
  });
}
async function xp(e) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(e)).then(encodeURIComponent).then((t) => `data:image/svg+xml;charset=utf-8,${t}`);
}
async function wp(e, t, n) {
  const o = "http://www.w3.org/2000/svg", r = document.createElementNS(o, "svg"), i = document.createElementNS(o, "foreignObject");
  return r.setAttribute("width", `${t}`), r.setAttribute("height", `${n}`), r.setAttribute("viewBox", `0 0 ${t} ${n}`), i.setAttribute("width", "100%"), i.setAttribute("height", "100%"), i.setAttribute("x", "0"), i.setAttribute("y", "0"), i.setAttribute("externalResourcesRequired", "true"), r.appendChild(i), i.appendChild(e), xp(r);
}
const ue = (e, t) => {
  if (e instanceof t)
    return !0;
  const n = Object.getPrototypeOf(e);
  return n === null ? !1 : n.constructor.name === t.name || ue(n, t);
};
function vp(e) {
  const t = e.getPropertyValue("content");
  return `${e.cssText} content: '${t.replace(/'|"/g, "")}';`;
}
function bp(e) {
  return Re(e).map((t) => {
    const n = e.getPropertyValue(t), o = e.getPropertyPriority(t);
    return `${t}: ${n}${o ? " !important" : ""};`;
  }).join(" ");
}
function Sp(e, t, n) {
  const o = `.${e}:${t}`, r = n.cssText ? vp(n) : bp(n);
  return document.createTextNode(`${o}{${r}}`);
}
function Fr(e, t, n) {
  const o = window.getComputedStyle(e, n), r = o.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const i = hp();
  try {
    t.className = `${t.className} ${i}`;
  } catch {
    return;
  }
  const s = document.createElement("style");
  s.appendChild(Sp(i, n, o)), t.appendChild(s);
}
function Ep(e, t) {
  Fr(e, t, ":before"), Fr(e, t, ":after");
}
const Xr = "application/font-woff", Yr = "image/jpeg", _p = {
  woff: Xr,
  woff2: Xr,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Yr,
  jpeg: Yr,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Cp(e) {
  const t = /\.([^./]*?)$/g.exec(e);
  return t ? t[1] : "";
}
function _o(e) {
  const t = Cp(e).toLowerCase();
  return _p[t] || "";
}
function Np(e) {
  return e.split(/,/)[1];
}
function no(e) {
  return e.search(/^(data:)/) !== -1;
}
function Mp(e, t) {
  return `data:${t};base64,${e}`;
}
async function Bs(e, t, n) {
  const o = await fetch(e, t);
  if (o.status === 404)
    throw new Error(`Resource "${o.url}" not found`);
  const r = await o.blob();
  return new Promise((i, s) => {
    const a = new FileReader();
    a.onerror = s, a.onloadend = () => {
      try {
        i(n({ res: o, result: a.result }));
      } catch (c) {
        s(c);
      }
    }, a.readAsDataURL(r);
  });
}
const On = {};
function kp(e, t, n) {
  let o = e.replace(/\?.*/, "");
  return n && (o = e), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), t ? `[${t}]${o}` : o;
}
async function Co(e, t, n) {
  const o = kp(e, t, n.includeQueryParams);
  if (On[o] != null)
    return On[o];
  n.cacheBust && (e += (/\?/.test(e) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let r;
  try {
    const i = await Bs(e, n.fetchRequestInit, ({ res: s, result: a }) => (t || (t = s.headers.get("Content-Type") || ""), Np(a)));
    r = Mp(i, t);
  } catch (i) {
    r = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${e}`;
    i && (s = typeof i == "string" ? i : i.message), s && console.warn(s);
  }
  return On[o] = r, r;
}
async function Ip(e) {
  const t = e.toDataURL();
  return t === "data:," ? e.cloneNode(!1) : fn(t);
}
async function $p(e, t) {
  if (e.currentSrc) {
    const i = document.createElement("canvas"), s = i.getContext("2d");
    i.width = e.clientWidth, i.height = e.clientHeight, s?.drawImage(e, 0, 0, i.width, i.height);
    const a = i.toDataURL();
    return fn(a);
  }
  const n = e.poster, o = _o(n), r = await Co(n, o, t);
  return fn(r);
}
async function Pp(e) {
  var t;
  try {
    if (!((t = e?.contentDocument) === null || t === void 0) && t.body)
      return await Cn(e.contentDocument.body, {}, !0);
  } catch {
  }
  return e.cloneNode(!1);
}
async function Ap(e, t) {
  return ue(e, HTMLCanvasElement) ? Ip(e) : ue(e, HTMLVideoElement) ? $p(e, t) : ue(e, HTMLIFrameElement) ? Pp(e) : e.cloneNode(!1);
}
const Tp = (e) => e.tagName != null && e.tagName.toUpperCase() === "SLOT";
async function Rp(e, t, n) {
  var o, r;
  let i = [];
  return Tp(e) && e.assignedNodes ? i = Re(e.assignedNodes()) : ue(e, HTMLIFrameElement) && (!((o = e.contentDocument) === null || o === void 0) && o.body) ? i = Re(e.contentDocument.body.childNodes) : i = Re(((r = e.shadowRoot) !== null && r !== void 0 ? r : e).childNodes), i.length === 0 || ue(e, HTMLVideoElement) || await i.reduce((s, a) => s.then(() => Cn(a, n)).then((c) => {
    c && t.appendChild(c);
  }), Promise.resolve()), t;
}
function jp(e, t) {
  const n = t.style;
  if (!n)
    return;
  const o = window.getComputedStyle(e);
  o.cssText ? (n.cssText = o.cssText, n.transformOrigin = o.transformOrigin) : Re(o).forEach((r) => {
    let i = o.getPropertyValue(r);
    r === "font-size" && i.endsWith("px") && (i = `${Math.floor(parseFloat(i.substring(0, i.length - 2))) - 0.1}px`), ue(e, HTMLIFrameElement) && r === "display" && i === "inline" && (i = "block"), r === "d" && t.getAttribute("d") && (i = `path(${t.getAttribute("d")})`), n.setProperty(r, i, o.getPropertyPriority(r));
  });
}
function Dp(e, t) {
  ue(e, HTMLTextAreaElement) && (t.innerHTML = e.value), ue(e, HTMLInputElement) && t.setAttribute("value", e.value);
}
function Hp(e, t) {
  if (ue(e, HTMLSelectElement)) {
    const o = Array.from(t.children).find((r) => e.value === r.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function zp(e, t) {
  return ue(t, Element) && (jp(e, t), Ep(e, t), Dp(e, t), Hp(e, t)), t;
}
async function Lp(e, t) {
  const n = e.querySelectorAll ? e.querySelectorAll("use") : [];
  if (n.length === 0)
    return e;
  const o = {};
  for (let i = 0; i < n.length; i++) {
    const a = n[i].getAttribute("xlink:href");
    if (a) {
      const c = e.querySelector(a), l = document.querySelector(a);
      !c && l && !o[a] && (o[a] = await Cn(l, t, !0));
    }
  }
  const r = Object.values(o);
  if (r.length) {
    const i = "http://www.w3.org/1999/xhtml", s = document.createElementNS(i, "svg");
    s.setAttribute("xmlns", i), s.style.position = "absolute", s.style.width = "0", s.style.height = "0", s.style.overflow = "hidden", s.style.display = "none";
    const a = document.createElementNS(i, "defs");
    s.appendChild(a);
    for (let c = 0; c < r.length; c++)
      a.appendChild(r[c]);
    e.appendChild(s);
  }
  return e;
}
async function Cn(e, t, n) {
  return !n && t.filter && !t.filter(e) ? null : Promise.resolve(e).then((o) => Ap(o, t)).then((o) => Rp(e, o, t)).then((o) => zp(e, o)).then((o) => Lp(o, t));
}
const Vs = /url\((['"]?)([^'"]+?)\1\)/g, Bp = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, Vp = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Op(e) {
  const t = e.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`, "g");
}
function Fp(e) {
  const t = [];
  return e.replace(Vs, (n, o, r) => (t.push(r), n)), t.filter((n) => !no(n));
}
async function Xp(e, t, n, o, r) {
  try {
    const i = n ? fp(t, n) : t, s = _o(t);
    let a;
    return r || (a = await Co(i, s, o)), e.replace(Op(t), `$1${a}$3`);
  } catch {
  }
  return e;
}
function Yp(e, { preferredFontFormat: t }) {
  return t ? e.replace(Vp, (n) => {
    for (; ; ) {
      const [o, , r] = Bp.exec(n) || [];
      if (!r)
        return "";
      if (r === t)
        return `src: ${o};`;
    }
  }) : e;
}
function Os(e) {
  return e.search(Vs) !== -1;
}
async function Fs(e, t, n) {
  if (!Os(e))
    return e;
  const o = Yp(e, n);
  return Fp(o).reduce((i, s) => i.then((a) => Xp(a, s, t, n)), Promise.resolve(o));
}
async function Wt(e, t, n) {
  var o;
  const r = (o = t.style) === null || o === void 0 ? void 0 : o.getPropertyValue(e);
  if (r) {
    const i = await Fs(r, null, n);
    return t.style.setProperty(e, i, t.style.getPropertyPriority(e)), !0;
  }
  return !1;
}
async function Wp(e, t) {
  await Wt("background", e, t) || await Wt("background-image", e, t), await Wt("mask", e, t) || await Wt("mask-image", e, t);
}
async function Zp(e, t) {
  const n = ue(e, HTMLImageElement);
  if (!(n && !no(e.src)) && !(ue(e, SVGImageElement) && !no(e.href.baseVal)))
    return;
  const o = n ? e.src : e.href.baseVal, r = await Co(o, _o(o), t);
  await new Promise((i, s) => {
    e.onload = i, e.onerror = s;
    const a = e;
    a.decode && (a.decode = i), a.loading === "lazy" && (a.loading = "eager"), n ? (e.srcset = "", e.src = r) : e.href.baseVal = r;
  });
}
async function qp(e, t) {
  const o = Re(e.childNodes).map((r) => Xs(r, t));
  await Promise.all(o).then(() => e);
}
async function Xs(e, t) {
  ue(e, Element) && (await Wp(e, t), await Zp(e, t), await qp(e, t));
}
function Gp(e, t) {
  const { style: n } = e;
  t.backgroundColor && (n.backgroundColor = t.backgroundColor), t.width && (n.width = `${t.width}px`), t.height && (n.height = `${t.height}px`);
  const o = t.style;
  return o != null && Object.keys(o).forEach((r) => {
    n[r] = o[r];
  }), e;
}
const Wr = {};
async function Zr(e) {
  let t = Wr[e];
  if (t != null)
    return t;
  const o = await (await fetch(e)).text();
  return t = { url: e, cssText: o }, Wr[e] = t, t;
}
async function qr(e, t) {
  let n = e.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, i = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let a = s.replace(o, "$1");
    return a.startsWith("https://") || (a = new URL(a, e.url).href), Bs(a, t.fetchRequestInit, ({ result: c }) => (n = n.replace(s, `url(${c})`), [s, c]));
  });
  return Promise.all(i).then(() => n);
}
function Gr(e) {
  if (e == null)
    return [];
  const t = [], n = /(\/\*[\s\S]*?\*\/)/gi;
  let o = e.replace(n, "");
  const r = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  for (; ; ) {
    const c = r.exec(o);
    if (c === null)
      break;
    t.push(c[0]);
  }
  o = o.replace(r, "");
  const i = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, s = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", a = new RegExp(s, "gi");
  for (; ; ) {
    let c = i.exec(o);
    if (c === null) {
      if (c = a.exec(o), c === null)
        break;
      i.lastIndex = a.lastIndex;
    } else
      a.lastIndex = i.lastIndex;
    t.push(c[0]);
  }
  return t;
}
async function Up(e, t) {
  const n = [], o = [];
  return e.forEach((r) => {
    if ("cssRules" in r)
      try {
        Re(r.cssRules || []).forEach((i, s) => {
          if (i.type === CSSRule.IMPORT_RULE) {
            let a = s + 1;
            const c = i.href, l = Zr(c).then((u) => qr(u, t)).then((u) => Gr(u).forEach((f) => {
              try {
                r.insertRule(f, f.startsWith("@import") ? a += 1 : r.cssRules.length);
              } catch (d) {
                console.error("Error inserting rule from remote css", {
                  rule: f,
                  error: d
                });
              }
            })).catch((u) => {
              console.error("Error loading remote css", u.toString());
            });
            o.push(l);
          }
        });
      } catch (i) {
        const s = e.find((a) => a.href == null) || document.styleSheets[0];
        r.href != null && o.push(Zr(r.href).then((a) => qr(a, t)).then((a) => Gr(a).forEach((c) => {
          s.insertRule(c, r.cssRules.length);
        })).catch((a) => {
          console.error("Error loading remote stylesheet", a);
        })), console.error("Error inlining remote css file", i);
      }
  }), Promise.all(o).then(() => (e.forEach((r) => {
    if ("cssRules" in r)
      try {
        Re(r.cssRules || []).forEach((i) => {
          n.push(i);
        });
      } catch (i) {
        console.error(`Error while reading CSS rules from ${r.href}`, i);
      }
  }), n));
}
function Kp(e) {
  return e.filter((t) => t.type === CSSRule.FONT_FACE_RULE).filter((t) => Os(t.style.getPropertyValue("src")));
}
async function Qp(e, t) {
  if (e.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = Re(e.ownerDocument.styleSheets), o = await Up(n, t);
  return Kp(o);
}
async function Jp(e, t) {
  const n = await Qp(e, t);
  return (await Promise.all(n.map((r) => {
    const i = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return Fs(r.cssText, i, t);
  }))).join(`
`);
}
async function em(e, t) {
  const n = t.fontEmbedCSS != null ? t.fontEmbedCSS : t.skipFonts ? null : await Jp(e, t);
  if (n) {
    const o = document.createElement("style"), r = document.createTextNode(n);
    o.appendChild(r), e.firstChild ? e.insertBefore(o, e.firstChild) : e.appendChild(o);
  }
}
async function tm(e, t = {}) {
  const { width: n, height: o } = Ls(e, t), r = await Cn(e, t, !0);
  return await em(r, t), await Xs(r, t), Gp(r, t), await wp(r, n, o);
}
async function nm(e, t = {}) {
  const { width: n, height: o } = Ls(e, t), r = await tm(e, t), i = await fn(r), s = document.createElement("canvas"), a = s.getContext("2d"), c = t.pixelRatio || mp(), l = t.canvasWidth || n, u = t.canvasHeight || o;
  return s.width = l * c, s.height = u * c, t.skipAutoScale || yp(s), s.style.width = `${l}`, s.style.height = `${u}`, t.backgroundColor && (a.fillStyle = t.backgroundColor, a.fillRect(0, 0, s.width, s.height)), a.drawImage(i, 0, 0, s.width, s.height), s;
}
async function om(e, t = {}) {
  return (await nm(e, t)).toDataURL();
}
function rm(e) {
  const n = Math.max(400, e.width + 320), o = Math.max(300, e.height + 320), r = Math.min(
    1.5,
    4096 / n,
    4096 / o,
    Math.sqrt(12e6 / (n * o))
  );
  return {
    width: Math.ceil(n * r),
    height: Math.ceil(o * r),
    scale: r,
    x: (160 - e.x) * r,
    y: (160 - e.y) * r
  };
}
async function im(e, t, n) {
  await document.fonts.ready;
  const o = e.querySelector(".react-flow");
  if (!o) throw new Error("Canvas is unavailable");
  const r = Pi(t.getNodes());
  let i = r.x, s = r.y, a = r.x + r.width, c = r.y + r.height;
  for (const h of t.getEdges()) {
    const g = h.data?.lane;
    typeof g != "number" || !Number.isFinite(g) || (h.data?.vertical ? (i = Math.min(i, g), a = Math.max(a, g)) : (s = Math.min(s, g), c = Math.max(c, g)));
  }
  const l = rm({
    x: i,
    y: s,
    width: a - i,
    height: c - s
  }), u = o.cloneNode(!0);
  Object.assign(u.style, {
    position: "relative",
    left: "0",
    top: "0",
    width: `${l.width}px`,
    height: `${l.height}px`,
    background: "white"
  }), u.querySelectorAll(
    ".react-flow__controls, .react-flow__minimap, .react-flow__background, .react-flow__attribution, .react-flow__handle, .erd-drawing-surface, .erd-drawing-preview"
  ).forEach((h) => h.remove()), u.querySelectorAll(".selected, .sut-node-active").forEach((h) => h.classList.remove("selected", "sut-node-active")), u.querySelectorAll(".react-flow__node, .react-flow__edge").forEach((h) => {
    h.style.opacity = "1";
  }), u.querySelectorAll(".react-flow__edge-path").forEach((h) => {
    h.style.opacity = "1", h.style.stroke = "#8597a5", h.style.strokeWidth = "1.6";
  });
  const f = u.querySelector(".react-flow__viewport");
  if (!f) throw new Error("Canvas viewport is unavailable");
  f.style.transform = `translate(${l.x}px, ${l.y}px) scale(${l.scale})`;
  const d = document.createElement("div");
  Object.assign(d.style, {
    position: "fixed",
    left: "-100000px",
    top: "0"
  }), d.appendChild(u), e.appendChild(d);
  try {
    const h = await om(u, {
      width: l.width,
      height: l.height,
      pixelRatio: 1,
      backgroundColor: "#ffffff",
      style: { left: "0", top: "0" }
    }), g = document.createElement("a");
    return g.download = `${n.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 100) || "diagram"}.png`, g.href = h, document.body.appendChild(g), g.click(), g.remove(), { url: h, filename: g.download };
  } finally {
    d.remove();
  }
}
function sm(e) {
  const t = e.data?.lane, n = !!e.data?.vertical;
  let [o, r, i] = ln({
    sourceX: e.sourceX,
    sourceY: e.sourceY,
    targetX: e.targetX,
    targetY: e.targetY,
    sourcePosition: e.sourcePosition,
    targetPosition: e.targetPosition,
    borderRadius: 12,
    offset: 24
  });
  if (t !== void 0) {
    const s = n ? [
      [e.sourceX, e.sourceY],
      [e.sourceX, e.sourceY + 24],
      [t, e.sourceY + 24],
      [t, e.targetY - 24],
      [e.targetX, e.targetY - 24],
      [e.targetX, e.targetY]
    ] : [
      [e.sourceX, e.sourceY],
      [e.sourceX + 24, e.sourceY],
      [e.sourceX + 24, t],
      [e.targetX - 24, t],
      [e.targetX - 24, e.targetY],
      [e.targetX, e.targetY]
    ];
    o = `M ${s[0].join(" ")}`;
    for (let a = 1; a < s.length - 1; a++) {
      const c = s[a - 1], l = s[a], u = s[a + 1], f = Math.hypot(
        l[0] - c[0],
        l[1] - c[1]
      ), d = Math.hypot(u[0] - l[0], u[1] - l[1]), h = Math.min(12, f / 2, d / 2);
      if (!f || !d) {
        o += ` L ${l.join(" ")}`;
        continue;
      }
      const g = l.map(
        (x, y) => x - (x - c[y]) / f * h
      ), v = l.map(
        (x, y) => x + (u[y] - x) / d * h
      );
      o += ` L ${g.join(" ")} Q ${l.join(" ")} ${v.join(" ")}`;
    }
    o += ` L ${s.at(-1).join(" ")}`, r = n ? t : (e.sourceX + e.targetX) / 2, i = n ? (e.sourceY + e.targetY) / 2 : t;
  }
  return /* @__PURE__ */ p.jsx(
    Dt,
    {
      id: e.id,
      path: o,
      markerEnd: e.markerEnd,
      style: e.style,
      label: e.label,
      labelX: r,
      labelY: i,
      labelStyle: e.labelStyle,
      labelShowBg: e.labelShowBg,
      labelBgStyle: e.labelBgStyle,
      labelBgPadding: e.labelBgPadding,
      labelBgBorderRadius: e.labelBgBorderRadius
    }
  );
}
const Ce = { width: 300, height: 208 };
function am(e, t) {
  return Ka(e, !0).map((n) => ({
    id: n.id,
    position: t === "vertical" ? {
      x: n.position.y / 160 * (Ce.width + 64),
      y: n.position.x / 420 * (Ce.height + 88)
    } : {
      x: n.position.x / 420 * (Ce.width + 140),
      y: n.position.y / 160 * (Ce.height + 64)
    }
  }));
}
function ce(e, t) {
  const n = e[t];
  return typeof n == "number" && Number.isFinite(n) && n >= 0 ? n : void 0;
}
const cm = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3
}), oe = (e, t = "") => e === void 0 ? "—" : `${cm.format(e)}${t ? ` ${t}` : ""}`;
function Ve(e) {
  const t = e.properties, n = ce(t, "Plan Rows"), o = ce(t, "Actual Rows"), r = ce(t, "Actual Loops"), i = ce(t, "Actual Total Time"), s = t["Never Executed"] === !0 || r === 0, a = !s && r !== void 0 && Number.isInteger(r) && i !== void 0 && Number.isFinite(i * r) ? i * r : void 0, c = !s && n !== void 0 && n > 0 && o !== void 0 && o > 0 ? Math.max(o / n, n / o) : void 0;
  return {
    estimated: n,
    actual: o,
    loops: r,
    time: i,
    cumulative: a,
    factor: c,
    never: s,
    cost: ce(t, "Total Cost"),
    startupCost: ce(t, "Startup Cost"),
    startupTime: ce(t, "Actual Startup Time")
  };
}
function oo(e) {
  const t = String(e.properties["Node Type"] ?? e.label);
  return /Scan|Bitmap/.test(t) ? "Scan" : /Join|Nested Loop/.test(t) ? "Join" : /Sort|Aggregate|Group|Unique|Window/.test(t) ? "Sort / aggregate" : /Gather/.test(t) ? "Parallel" : /Hash|Materialize|Memoize/.test(t) ? "Intermediate" : e.kind === "plan-group" ? "Subplan" : "Plan step";
}
function wt(e) {
  const t = e.properties;
  return [
    t["Relation Name"] ? `${t.Schema ? `${t.Schema}.` : ""}${t["Relation Name"]}${t.Alias ? ` AS ${t.Alias}` : ""}` : "",
    t["Index Name"] ? `Index: ${t["Index Name"]}` : "",
    t["CTE Name"] ? `CTE: ${t["CTE Name"]}` : ""
  ].filter(Boolean).join(" · ");
}
function lm(e) {
  return [
    "Index Cond",
    "Recheck Cond",
    "Hash Cond",
    "Merge Cond",
    "Join Filter",
    "Filter",
    "Sort Key",
    "Group Key"
  ].filter((t) => e.properties[t] !== void 0).map((t) => ({
    label: t,
    value: Array.isArray(e.properties[t]) ? e.properties[t].map(String).join(", ") : String(e.properties[t])
  }));
}
function um(e) {
  const t = Ve(e), n = [];
  return t.time !== void 0 && !t.never ? n.push({ label: "Time / loop", value: oe(t.time, "ms") }) : t.cost !== void 0 && n.push({ label: "Estimated cost", value: oe(t.cost) }), t.estimated !== void 0 && n.push({ label: "Estimated rows", value: oe(t.estimated) }), t.actual !== void 0 && !t.never && n.push({ label: "Rows / loop", value: oe(t.actual) }), t.loops !== void 0 && n.push({ label: "Loops", value: oe(t.loops) }), n;
}
function hn(e) {
  const t = Ve(e), n = e.properties, o = [];
  t.factor !== void 0 && t.factor >= 10 ? o.push({
    nodeId: e.id,
    kind: "estimate",
    title: `${oe(t.factor)}× row estimate difference`,
    detail: `Estimated ${oe(t.estimated)} rows; returned ${oe(t.actual)} per loop. Partial execution, including LIMIT, can affect this comparison.`
  }) : !t.never && t.estimated === 0 && t.actual !== void 0 && t.actual > 0 && o.push({
    nodeId: e.id,
    kind: "estimate",
    title: "Rows returned against a zero estimate",
    detail: `Returned ${oe(t.actual)} rows per loop; estimated zero. Inspect this step in context.`
  }), String(n["Sort Space Type"]).toLowerCase() === "disk" && o.push({
    nodeId: e.id,
    kind: "disk",
    title: "Sort used disk",
    detail: ce(n, "Sort Space Used") !== void 0 ? `${oe(ce(n, "Sort Space Used"), "kB")} of sort space reported on disk.` : "The plan reports disk sort space."
  });
  const r = ce(n, "Temp Read Blocks"), i = ce(n, "Temp Written Blocks");
  ((r ?? 0) > 0 || (i ?? 0) > 0) && o.push({
    nodeId: e.id,
    kind: "disk",
    title: "Temporary buffer I/O",
    detail: `Temp blocks read: ${oe(r)}; written: ${oe(i)}. Counts include child steps and are not summed.`
  });
  const s = ce(n, "Hash Batches");
  return s !== void 0 && s > 1 && o.push({
    nodeId: e.id,
    kind: "batches",
    title: `Hash used ${oe(s)} batches`,
    detail: "Inspect hash memory and temporary I/O for this step."
  }), o;
}
function dm(e) {
  const t = new Set(
    e.edges.filter((o) => !o.back).map((o) => o.target)
  );
  return e.nodes.filter((o) => !t.has(o.id)).map((o, r) => {
    const i = e.summary?.[`Plan ${r + 1}`], s = i && typeof i == "object" && !Array.isArray(i) ? i : {};
    return {
      label: `Plan ${r + 1}`,
      nodeId: o.id,
      metrics: Ve(o),
      execution: ce(s, "Execution Time"),
      planning: ce(s, "Planning Time")
    };
  });
}
function fm(e) {
  const t = e.properties;
  return [
    ["Startup Cost", "Estimated startup cost", ""],
    ["Total Cost", "Estimated total cost", ""],
    ["Plan Rows", "Estimated rows", ""],
    ["Plan Width", "Estimated row width", "bytes"],
    ["Actual Startup Time", "Startup time / loop", "ms"],
    ["Actual Total Time", "Total time / loop", "ms"],
    ["Actual Rows", "Rows returned / loop", ""],
    ["Actual Loops", "Loops", ""],
    ["Rows Removed by Filter", "Rows removed by filter / loop", ""],
    ["Rows Removed by Join Filter", "Rows removed by join filter / loop", ""],
    ["Heap Fetches", "Heap fetches", ""],
    ["Workers Planned", "Workers planned", ""],
    ["Workers Launched", "Workers launched", ""],
    ["Shared Hit Blocks", "Shared blocks hit", ""],
    ["Shared Read Blocks", "Shared blocks read", ""],
    ["Shared Dirtied Blocks", "Shared blocks dirtied", ""],
    ["Shared Written Blocks", "Shared blocks written", ""],
    ["Local Hit Blocks", "Local blocks hit", ""],
    ["Local Read Blocks", "Local blocks read", ""],
    ["Local Dirtied Blocks", "Local blocks dirtied", ""],
    ["Local Written Blocks", "Local blocks written", ""],
    ["Temp Read Blocks", "Temp blocks read", ""],
    ["Temp Written Blocks", "Temp blocks written", ""],
    ["Sort Space Used", "Sort space", "kB"],
    ["Peak Memory Usage", "Peak memory", "kB"],
    ["Hash Batches", "Hash batches", ""],
    ["Hash Buckets", "Hash buckets", ""]
  ].filter(([n]) => ce(t, n) !== void 0).map(([n, o, r]) => ({
    label: o,
    value: oe(ce(t, n), r)
  }));
}
const hm = I.memo(function({
  graph: t,
  focus: n
}) {
  const [o, r] = I.useState(!1), i = I.useMemo(() => t.nodes.flatMap(hn), [t]), s = I.useMemo(
    () => new Map(t.nodes.map((a) => [a.id, a.label])),
    [t]
  );
  return /* @__PURE__ */ p.jsxs("div", { className: "sut-plan-overview", children: [
    dm(t).map((a) => /* @__PURE__ */ p.jsxs("div", { className: "sut-plan-summary", children: [
      /* @__PURE__ */ p.jsxs("strong", { children: [
        a.label,
        " ·",
        " ",
        a.metrics.actual !== void 0 || a.execution !== void 0 ? "Measured execution" : "Estimates only"
      ] }),
      /* @__PURE__ */ p.jsxs("dl", { className: "sut-plan-metrics", children: [
        /* @__PURE__ */ p.jsxs("div", { children: [
          /* @__PURE__ */ p.jsx("dt", { children: "Execution time" }),
          /* @__PURE__ */ p.jsx("dd", { children: oe(a.execution, "ms") })
        ] }),
        /* @__PURE__ */ p.jsxs("div", { children: [
          /* @__PURE__ */ p.jsx("dt", { children: "Planning time" }),
          /* @__PURE__ */ p.jsx("dd", { children: oe(a.planning, "ms") })
        ] }),
        /* @__PURE__ */ p.jsxs("div", { children: [
          /* @__PURE__ */ p.jsx("dt", { children: "Root estimated cost" }),
          /* @__PURE__ */ p.jsx("dd", { children: oe(a.metrics.cost) })
        ] }),
        /* @__PURE__ */ p.jsxs("div", { children: [
          /* @__PURE__ */ p.jsx("dt", { children: "Root estimated rows" }),
          /* @__PURE__ */ p.jsx("dd", { children: oe(a.metrics.estimated) })
        ] }),
        /* @__PURE__ */ p.jsxs("div", { children: [
          /* @__PURE__ */ p.jsx("dt", { children: "Root rows / loop" }),
          /* @__PURE__ */ p.jsx("dd", { children: oe(a.metrics.actual) })
        ] })
      ] })
    ] }, a.nodeId)),
    /* @__PURE__ */ p.jsx("p", { className: "sut-plan-note", children: "— means not supplied. Costs are planner units. Actual rows and times are averages per loop; node timings and buffer counts include inputs and must not be added together." }),
    i.length > 0 && /* @__PURE__ */ p.jsxs(
      "details",
      {
        className: "sut-plan-review",
        onToggle: (a) => r(a.currentTarget.open),
        children: [
          /* @__PURE__ */ p.jsxs("summary", { children: [
            "Review points (",
            i.length,
            ")"
          ] }),
          /* @__PURE__ */ p.jsx("p", { className: "sut-plan-note", children: "These are observations to inspect in context, not automatic diagnoses." }),
          o && i.map((a, c) => /* @__PURE__ */ p.jsxs("button", { onClick: () => n(a.nodeId), children: [
            /* @__PURE__ */ p.jsx("strong", { children: a.title }),
            /* @__PURE__ */ p.jsxs("span", { children: [
              s.get(a.nodeId),
              " · ",
              a.detail
            ] })
          ] }, `${a.nodeId}-${c}`))
        ]
      }
    )
  ] });
});
function gm({ node: e }) {
  const t = Ve(e), n = lm(e);
  return /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
    wt(e) && /* @__PURE__ */ p.jsx("p", { children: wt(e) }),
    e.properties["Sort Method"] !== void 0 && /* @__PURE__ */ p.jsxs("p", { className: "sut-plan-note", children: [
      "Sort method: ",
      String(e.properties["Sort Method"]),
      e.properties["Sort Space Type"] ? ` · ${String(e.properties["Sort Space Type"])}` : ""
    ] }),
    t.never && /* @__PURE__ */ p.jsx("p", { className: "sut-plan-status", children: "Never executed" }),
    /* @__PURE__ */ p.jsx("dl", { className: "sut-plan-detail-metrics", children: fm(e).map((o) => /* @__PURE__ */ p.jsxs("div", { children: [
      /* @__PURE__ */ p.jsx("dt", { children: o.label }),
      /* @__PURE__ */ p.jsx("dd", { children: o.value })
    ] }, o.label)) }),
    t.cumulative !== void 0 && /* @__PURE__ */ p.jsxs("p", { className: "sut-plan-note", children: [
      "Inclusive time × loops: ",
      oe(t.cumulative, "ms"),
      ". Includes child work; this is not exclusive time."
    ] }),
    n.map((o) => /* @__PURE__ */ p.jsxs("div", { children: [
      /* @__PURE__ */ p.jsx("h4", { children: o.label }),
      /* @__PURE__ */ p.jsx("pre", { children: o.value })
    ] }, o.label)),
    hn(e).map((o) => /* @__PURE__ */ p.jsxs("p", { className: "sut-plan-note", children: [
      /* @__PURE__ */ p.jsxs("strong", { children: [
        o.title,
        "."
      ] }),
      " ",
      o.detail
    ] }, o.title))
  ] });
}
const pm = I.memo(function({
  graph: t,
  focus: n
}) {
  const [o, r] = I.useState("order"), [i, s] = I.useState(!1), a = [...t.nodes];
  return o !== "order" && a.sort(
    (c, l) => (Ve(l)[o] ?? -1) - (Ve(c)[o] ?? -1)
  ), /* @__PURE__ */ p.jsxs(
    "details",
    {
      className: "sut-plan-table",
      onToggle: (c) => s(c.currentTarget.open),
      children: [
        /* @__PURE__ */ p.jsxs("summary", { children: [
          "Compare all plan steps (",
          a.length,
          ")"
        ] }),
        i && /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
          /* @__PURE__ */ p.jsxs("label", { children: [
            "Order",
            " ",
            /* @__PURE__ */ p.jsxs(
              "select",
              {
                "aria-label": "Plan table order",
                value: o,
                onChange: (c) => r(c.target.value),
                children: [
                  /* @__PURE__ */ p.jsx("option", { value: "order", children: "Plan order" }),
                  /* @__PURE__ */ p.jsx("option", { value: "cumulative", children: "Inclusive time × loops" }),
                  /* @__PURE__ */ p.jsx("option", { value: "cost", children: "Estimated cost" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ p.jsx("p", { className: "sut-plan-note", children: "Time columns include input work. A high estimate or inclusive time alone does not identify the cause of slow execution." }),
          /* @__PURE__ */ p.jsx("div", { className: "sut-plan-table-scroll", children: /* @__PURE__ */ p.jsxs("table", { children: [
            /* @__PURE__ */ p.jsx("thead", { children: /* @__PURE__ */ p.jsxs("tr", { children: [
              /* @__PURE__ */ p.jsx("th", { children: "Step" }),
              /* @__PURE__ */ p.jsx("th", { children: "Est. rows" }),
              /* @__PURE__ */ p.jsx("th", { children: "Rows / loop" }),
              /* @__PURE__ */ p.jsx("th", { children: "Loops" }),
              /* @__PURE__ */ p.jsx("th", { children: "Time / loop (ms)" }),
              /* @__PURE__ */ p.jsx("th", { children: "Time × loops (ms)" }),
              /* @__PURE__ */ p.jsx("th", { children: "Est. cost" })
            ] }) }),
            /* @__PURE__ */ p.jsx("tbody", { children: a.map((c) => {
              const l = Ve(c);
              return /* @__PURE__ */ p.jsxs("tr", { children: [
                /* @__PURE__ */ p.jsxs("th", { children: [
                  /* @__PURE__ */ p.jsx("button", { onClick: () => n(c.id), children: c.label }),
                  l.never && /* @__PURE__ */ p.jsx("small", { children: "Never executed" })
                ] }),
                /* @__PURE__ */ p.jsx("td", { children: oe(l.estimated) }),
                /* @__PURE__ */ p.jsx("td", { children: oe(l.actual) }),
                /* @__PURE__ */ p.jsx("td", { children: oe(l.loops) }),
                /* @__PURE__ */ p.jsx("td", { children: oe(l.time) }),
                /* @__PURE__ */ p.jsx("td", { children: oe(l.cumulative) }),
                /* @__PURE__ */ p.jsx("td", { children: oe(l.cost) })
              ] }, c.id);
            }) })
          ] }) })
        ] })
      ]
    }
  );
}), mm = { query: sm };
function ym(e, t, n) {
  return new Promise((o, r) => {
    let i = 0;
    const s = setTimeout(() => {
      cancelAnimationFrame(i), r(new Error("Export nodes did not finish rendering."));
    }, 5e3), a = () => {
      e.isConnected ? e.querySelectorAll(".react-flow__node").length === t && e.querySelectorAll(".react-flow__edge").length === n ? (clearTimeout(s), o()) : i = requestAnimationFrame(a) : (clearTimeout(s), r(new Error("Graph closed during export.")));
    };
    i = requestAnimationFrame(a);
  });
}
const xm = I.memo(function({ data: t }) {
  const n = Zt(t), o = t, r = t.plan ? Ve(o) : null;
  return /* @__PURE__ */ p.jsxs(
    "div",
    {
      className: `sut-node sut-node-${t.kind} ${t.plan ? `sut-plan-node sut-plan-${oo(o).split(" ")[0].toLowerCase()}` : ""} ${t.active ? "sut-node-active" : ""}`,
      role: "button",
      tabIndex: 0,
      "aria-label": `Inspect ${t.label}`,
      "aria-pressed": !!t.active,
      onClick: () => t.inspect(),
      onKeyDown: (i) => {
        (i.key === "Enter" || i.key === " ") && (i.preventDefault(), t.inspect());
      },
      children: [
        t.inputs.map((i, s, a) => /* @__PURE__ */ p.jsx(
          dt,
          {
            id: `in-${i}`,
            type: "target",
            position: t.vertical ? Y.Top : Y.Left,
            style: t.vertical ? { left: `${(s + 1) / (a.length + 1) * 100}%` } : { top: `${(s + 1) / (a.length + 1) * 100}%` }
          },
          i
        )),
        /* @__PURE__ */ p.jsx("span", { className: "sut-node-kind", children: t.plan ? oo(o) : n.category }),
        /* @__PURE__ */ p.jsx("strong", { title: n.title, children: n.title }),
        t.plan ? /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
          wt(o) && /* @__PURE__ */ p.jsx("p", { title: wt(o), children: wt(o) }),
          /* @__PURE__ */ p.jsx("dl", { className: "sut-plan-card-metrics", children: um(o).map((i) => /* @__PURE__ */ p.jsxs("div", { children: [
            /* @__PURE__ */ p.jsx("dt", { children: i.label }),
            /* @__PURE__ */ p.jsx("dd", { children: i.value })
          ] }, i.label)) }),
          (r?.never || t.collapsed || hn(o).length > 0) && /* @__PURE__ */ p.jsx("span", { className: "sut-plan-status", children: r?.never ? "Never executed" : t.collapsed ? "Inputs collapsed" : hn(o)[0].title })
        ] }) : n.preview && /* @__PURE__ */ p.jsx("p", { title: n.preview, children: n.preview }),
        t.outputs.map((i, s, a) => /* @__PURE__ */ p.jsx(
          dt,
          {
            id: `out-${i}`,
            type: "source",
            position: t.vertical ? Y.Bottom : Y.Right,
            style: t.vertical ? { left: `${(s + 1) / (a.length + 1) * 100}%` } : { top: `${(s + 1) / (a.length + 1) * 100}%` }
          },
          i
        ))
      ]
    }
  );
}), wm = { tool: xm };
function bm({
  graph: e,
  tree: t
}) {
  const [n, o] = I.useState(null), [r, i] = I.useState(/* @__PURE__ */ new Set()), [s, a] = I.useState(null), [c, l] = I.useState(""), [u, f] = I.useState(
    null
  ), [d, h] = I.useState(!1), g = I.useRef(null), v = I.useRef(null), [x, y] = I.useState(
    "vertical"
  ), [C, m] = I.useState(""), [b, k] = I.useState(!1), E = I.useMemo(
    () => t ? Qa(e, r) : e,
    [e, r, t]
  ), M = I.useMemo(
    () => new Map(E.nodes.map((S) => [S.id, S])),
    [E]
  ), A = I.useMemo(() => Ja(E, n), [E, n]), P = I.useMemo(
    () => t ? am(E, x) : ec(E, x),
    [E, t, x]
  ), V = I.useMemo(() => {
    const S = new Map(
      E.nodes.map((j) => [
        j.id,
        { inputs: [], outputs: [] }
      ])
    );
    for (const j of E.edges)
      S.get(j.target)?.inputs.push(j.id), S.get(j.source)?.outputs.push(j.id);
    return S;
  }, [E]), H = I.useMemo(
    () => t ? /* @__PURE__ */ new Map() : tc(E, P, x),
    [E, P, x, t]
  ), B = I.useMemo(
    () => P.map((S) => {
      const j = {
        ...S,
        type: "tool",
        width: t ? Ce.width : et.width,
        height: t ? Ce.height : et.height,
        selected: !1,
        style: {
          width: t ? Ce.width : et.width,
          height: t ? Ce.height : et.height,
          opacity: 1
        },
        data: {
          ...M.get(S.id),
          ...V.get(S.id),
          vertical: x === "vertical",
          plan: t,
          collapsed: r.has(S.id),
          active: !1,
          inspect: () => o(S.id)
        }
      };
      return {
        normal: j,
        faded: { ...j, style: { ...j.style, opacity: 0.3 } },
        active: {
          ...j,
          selected: !0,
          data: { ...j.data, active: !0 }
        }
      };
    }),
    [P, M, t, x, V, r]
  ), z = I.useMemo(
    () => B.map(
      (S) => S.normal.id === n ? S.active : A.has(S.normal.id) ? S.normal : S.faded
    ),
    [B, n, A]
  ), w = I.useMemo(
    () => E.edges.map((S) => {
      const j = {
        ...S,
        sourceHandle: `out-${S.id}`,
        targetHandle: `in-${S.id}`,
        data: { lane: H.get(S.id), vertical: x === "vertical" },
        label: t && S.label === "input" ? void 0 : S.label,
        labelStyle: { fill: "#425b66", fontSize: 11, fontWeight: 500 },
        labelShowBg: !0,
        labelBgStyle: { fill: "#ffffff", fillOpacity: 1, stroke: "#dce5e9" },
        labelBgPadding: [9, 5],
        labelBgBorderRadius: 5,
        pathOptions: { borderRadius: 14, offset: 32 },
        markerEnd: {
          type: Nt.ArrowClosed,
          color: S.back ? "#b1671e" : "#6d8c99"
        },
        style: {
          strokeDasharray: S.back || /reference|dependency|subquery/.test(S.label) ? "6 4" : void 0,
          stroke: S.back ? "#a56321" : "#6d8c99",
          strokeWidth: 1.5,
          opacity: 1
        },
        type: t ? "smoothstep" : "query"
      };
      return {
        normal: j,
        faded: { ...j, style: { ...j.style, opacity: 0.2 } },
        active: {
          ...j,
          style: {
            ...j.style,
            stroke: S.back ? "#a56321" : "#126e63",
            strokeWidth: 2.5
          }
        }
      };
    }),
    [E, t, H, x]
  ), N = I.useMemo(
    () => w.map(
      (S) => n ? A.has(S.normal.source) && A.has(S.normal.target) ? S.active : S.faded : S.normal
    ),
    [w, n, A]
  ), _ = e.nodes.find((S) => S.id === n), $ = I.useMemo(
    () => e.nodes.map((S) => ({
      node: S,
      text: `${S.label} ${Zt(S).preview} ${S.sql ?? ""} ${t ? JSON.stringify(S.properties) : ""}`.toLowerCase()
    })),
    [e, t]
  ), R = I.useMemo(() => {
    const S = C.trim().toLowerCase();
    return $.filter((j) => j.text.includes(S)).map((j) => j.node);
  }, [$, C]), T = I.useCallback(
    (S) => {
      M.has(S) ? s?.fitView({
        nodes: [{ id: S }],
        padding: 0.6,
        minZoom: 0.75,
        maxZoom: 1,
        duration: 250
      }) : (v.current = S, i(/* @__PURE__ */ new Set())), o(S);
    },
    [M, s]
  ), L = () => {
    if (!n && s) {
      const j = g.current?.querySelector(".sut-graph"), X = P.filter(
        (F) => x === "vertical" ? F.position.y === 0 : F.position.x === 0
      );
      if (j && X.length) {
        const F = Math.min(...X.map((O) => O.position.x)), q = Math.min(...X.map((O) => O.position.y)), K = Math.max(...X.map((O) => O.position.x)) - F + (t ? Ce.width : et.width), W = Math.max(...X.map((O) => O.position.y)) - q + (t ? Ce.height : et.height), D = Math.min(
          0.9,
          Math.max(0.7, (j.clientWidth - 64) / K)
        );
        s.setViewport({
          zoom: D,
          x: (x === "vertical" ? Math.max(32, (j.clientWidth - K * D) / 2) : 32) - F * D,
          y: (x === "vertical" ? 40 : Math.max(40, (j.clientHeight - W * D) / 2)) - q * D
        });
        return;
      }
    }
    const S = P.find((j) => j.id === n) ?? [...P].sort(
      (j, X) => x === "vertical" ? j.position.y - X.position.y || j.position.x - X.position.x : j.position.x - X.position.x || j.position.y - X.position.y
    )[0];
    S && s?.fitView({
      nodes: [{ id: S.id }],
      padding: 0.6,
      minZoom: 0.75,
      maxZoom: 0.9
    });
  };
  return I.useEffect(() => {
    o(null), v.current = null, i((S) => S.size ? /* @__PURE__ */ new Set() : S), f(null), m(""), l("");
  }, [e]), I.useEffect(() => {
    if (!s) return;
    const S = requestAnimationFrame(() => {
      L();
    });
    return () => cancelAnimationFrame(S);
  }, [s, e, x, t]), I.useEffect(() => {
    const S = v.current;
    if (!S || !s || !M.has(S)) return;
    const j = requestAnimationFrame(() => {
      v.current = null, s.fitView({
        nodes: [{ id: S }],
        padding: 0.6,
        minZoom: 0.75,
        maxZoom: 0.9,
        duration: 250
      });
    });
    return () => cancelAnimationFrame(j);
  }, [s, M]), /* @__PURE__ */ p.jsxs(
    "section",
    {
      className: `sut-graph-section ${b ? "sut-graph-expanded" : ""}`,
      ref: g,
      "aria-label": t ? "Execution plan graph" : "SQL query graph",
      children: [
        /* @__PURE__ */ p.jsxs("div", { className: "sut-graph-heading", children: [
          /* @__PURE__ */ p.jsxs("div", { children: [
            /* @__PURE__ */ p.jsx("h3", { children: t ? "Execution plan" : "Query flow" }),
            /* @__PURE__ */ p.jsx("p", { children: t ? "Follow parent steps to their inputs. Select a step to inspect estimates and execution metrics." : "Follow the arrows from source tables to the returned rows." })
          ] }),
          /* @__PURE__ */ p.jsxs("span", { children: [
            E.nodes.length,
            " ",
            t ? "steps" : "nodes",
            " ·",
            " ",
            E.edges.length,
            " connections"
          ] })
        ] }),
        t && /* @__PURE__ */ p.jsx(hm, { graph: e, focus: T }),
        /* @__PURE__ */ p.jsxs("div", { className: "sut-actions sut-graph-actions", children: [
          /* @__PURE__ */ p.jsxs("label", { children: [
            "Layout",
            " ",
            /* @__PURE__ */ p.jsxs(
              "select",
              {
                "aria-label": "Graph layout",
                value: x,
                onChange: (S) => y(S.target.value),
                children: [
                  /* @__PURE__ */ p.jsx("option", { value: "vertical", children: "Top to bottom" }),
                  /* @__PURE__ */ p.jsx("option", { value: "horizontal", children: "Left to right" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ p.jsx("button", { onClick: () => s?.fitView({ padding: 0.15 }), children: "Fit graph" }),
          /* @__PURE__ */ p.jsx("button", { onClick: L, children: "Readable view" }),
          /* @__PURE__ */ p.jsx("button", { "aria-pressed": b, onClick: () => k(!b), children: b ? "Compact canvas" : "Expand canvas" }),
          n && /* @__PURE__ */ p.jsx("button", { onClick: () => o(null), children: "Clear selection" }),
          t && /* @__PURE__ */ p.jsx("button", { onClick: () => i(/* @__PURE__ */ new Set()), children: "Expand all" }),
          /* @__PURE__ */ p.jsx(
            "button",
            {
              disabled: !s || d,
              onClick: async () => {
                if (!(!g.current || !s)) {
                  h(!0), l("");
                  try {
                    await ym(
                      g.current,
                      z.length,
                      N.length
                    ), f(
                      await im(
                        g.current,
                        s,
                        t ? "explain-plan" : "sql-structure"
                      )
                    );
                  } catch {
                    l("PNG export failed. Try a smaller graph.");
                  } finally {
                    h(!1);
                  }
                }
              },
              children: d ? "Exporting…" : "Export PNG"
            }
          ),
          t && /* @__PURE__ */ p.jsx("span", { children: "Export includes currently expanded nodes." })
        ] }),
        !t && /* @__PURE__ */ p.jsxs("div", { className: "sut-graph-legend", "aria-label": "Graph legend", children: [
          /* @__PURE__ */ p.jsx("span", { className: "sut-legend-source", children: "Tables" }),
          /* @__PURE__ */ p.jsx("span", { className: "sut-legend-cte", children: "CTEs / subqueries" }),
          /* @__PURE__ */ p.jsx("span", { className: "sut-legend-transform", children: "Query operations" }),
          /* @__PURE__ */ p.jsx("span", { className: "sut-legend-result", children: "Result" }),
          /* @__PURE__ */ p.jsx("span", { children: "Dashed arrows: references / dependencies" }),
          /* @__PURE__ */ p.jsx("span", { children: "Select a node to trace its inputs and outputs." })
        ] }),
        c && /* @__PURE__ */ p.jsx("p", { role: "alert", children: c }),
        u && /* @__PURE__ */ p.jsxs("details", { children: [
          /* @__PURE__ */ p.jsx("summary", { children: "PNG ready - preview or save" }),
          /* @__PURE__ */ p.jsx("a", { href: u.url, download: u.filename, children: "Save PNG" }),
          /* @__PURE__ */ p.jsx(
            "img",
            {
              className: "sut-preview",
              src: u.url,
              alt: "Graph export preview"
            }
          )
        ] }),
        /* @__PURE__ */ p.jsxs("div", { className: "sut-graph-workspace", children: [
          /* @__PURE__ */ p.jsx("div", { className: "sut-graph", children: /* @__PURE__ */ p.jsxs(
            Dg,
            {
              nodes: z,
              edges: N,
              nodeTypes: wm,
              edgeTypes: mm,
              onInit: a,
              onNodeClick: (S, j) => o(j.id),
              onPaneClick: () => o(null),
              nodesDraggable: !1,
              nodesConnectable: !1,
              onlyRenderVisibleElements: t && !d,
              deleteKeyCode: null,
              onKeyDown: (S) => {
                S.key === "Escape" && o(null);
              },
              minZoom: 0.02,
              maxZoom: 2,
              children: [
                /* @__PURE__ */ p.jsx(Vg, { gap: 24, size: 1, color: "#d4e0e3" }),
                /* @__PURE__ */ p.jsx(qg, { showInteractive: !1 }),
                /* @__PURE__ */ p.jsx(
                  cp,
                  {
                    pannable: !0,
                    zoomable: !0,
                    nodeColor: (S) => S.data.kind === "output" ? "#126e63" : String(S.data.kind).startsWith("cte") ? "#8671aa" : "#85aab8"
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ p.jsxs(
            "aside",
            {
              className: "sut-graph-inspector",
              "aria-label": t ? "Plan inspector" : "Query inspector",
              children: [
                /* @__PURE__ */ p.jsxs("label", { className: "sut-graph-search", children: [
                  "Find a step",
                  /* @__PURE__ */ p.jsx(
                    "input",
                    {
                      type: "search",
                      placeholder: t ? "Operator, table, index, or condition" : "Table, clause, or expression",
                      value: C,
                      onChange: (S) => m(S.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ p.jsxs(
                  "details",
                  {
                    className: "sut-graph-outline",
                    open: !_ || !!C,
                    children: [
                      /* @__PURE__ */ p.jsxs("summary", { children: [
                        t ? "Plan steps" : "Query steps",
                        " (",
                        R.length,
                        ")"
                      ] }),
                      /* @__PURE__ */ p.jsxs("div", { className: "sut-step-list", children: [
                        R.map((S) => {
                          const j = Zt(S);
                          return /* @__PURE__ */ p.jsxs(
                            "button",
                            {
                              "aria-pressed": S.id === n,
                              onClick: () => T(S.id),
                              children: [
                                /* @__PURE__ */ p.jsx("span", { children: t ? oo(S) : j.category }),
                                /* @__PURE__ */ p.jsx("strong", { children: j.title })
                              ]
                            },
                            S.id
                          );
                        }),
                        !R.length && /* @__PURE__ */ p.jsx("p", { role: "status", children: "No matching steps. Try a table name or SQL keyword." })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ p.jsx("div", { className: "sut-node-details", children: _ ? /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
                  /* @__PURE__ */ p.jsx("h3", { children: _.label }),
                  t && /* @__PURE__ */ p.jsx(gm, { node: _ }),
                  _.kind === "select" && Array.isArray(_.properties.columns) && /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
                    /* @__PURE__ */ p.jsx("h4", { children: "Selected expressions" }),
                    /* @__PURE__ */ p.jsx("ul", { className: "sut-expression-list", children: _.properties.columns.map((S, j) => /* @__PURE__ */ p.jsx("li", { children: /* @__PURE__ */ p.jsx("code", { children: String(S) }) }, j)) })
                  ] }),
                  _.kind === "join" && /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
                    /* @__PURE__ */ p.jsx("h4", { children: "Join condition" }),
                    /* @__PURE__ */ p.jsx("pre", { children: String(_.properties.condition ?? "No join predicate") })
                  ] }),
                  t && e.edges.some((S) => S.source === _.id) && /* @__PURE__ */ p.jsx(
                    "button",
                    {
                      onClick: () => i((S) => {
                        const j = new Set(S);
                        return j.has(_.id) ? j.delete(_.id) : j.add(_.id), j;
                      }),
                      children: r.has(_.id) ? "Expand inputs" : "Collapse inputs"
                    }
                  ),
                  Object.keys(_.properties).length > 0 && /* @__PURE__ */ p.jsxs("details", { children: [
                    /* @__PURE__ */ p.jsx("summary", { children: "All properties" }),
                    /* @__PURE__ */ p.jsx("pre", { children: JSON.stringify(_.properties, null, 2) })
                  ] }),
                  _.sql && /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
                    /* @__PURE__ */ p.jsx("h4", { children: "SQL for this step" }),
                    /* @__PURE__ */ p.jsx("pre", { children: _.sql })
                  ] }),
                  /* @__PURE__ */ p.jsx("h4", { children: t ? "Connected steps" : "Inputs and outputs" }),
                  /* @__PURE__ */ p.jsx("div", { className: "sut-connected-list", children: E.edges.filter((S) => S.target === _.id || S.source === _.id).map((S) => {
                    const j = S.target === _.id, X = M.get(j ? S.source : S.target);
                    return X ? /* @__PURE__ */ p.jsxs("button", { onClick: () => T(X.id), children: [
                      /* @__PURE__ */ p.jsxs("span", { children: [
                        t ? j ? "Parent" : "Input" : j ? "Input" : "Output",
                        S.label ? ` · ${S.label}` : ""
                      ] }),
                      Zt(X).title
                    ] }, S.id) : null;
                  }) })
                ] }) : /* @__PURE__ */ p.jsx("p", { className: "sut-inspector-hint", children: t ? "Choose a step to compare estimated and actual rows, inspect timing, buffers, and conditions." : "Choose a step in the graph or list to see its SQL and connections." }) })
              ]
            }
          )
        ] }),
        t && /* @__PURE__ */ p.jsx(pm, { graph: e, focus: T }),
        e.summary && /* @__PURE__ */ p.jsxs("details", { children: [
          /* @__PURE__ */ p.jsx("summary", { children: "Supplied summary and extra properties" }),
          /* @__PURE__ */ p.jsx("pre", { children: JSON.stringify(e.summary, null, 2) })
        ] })
      ]
    }
  );
}
export {
  bm as default
};
