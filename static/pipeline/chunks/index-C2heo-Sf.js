import { g as bh } from "./percentages-BXMCSKIN-DqGOvamv.js";
const bo = 20, QC = {
  rect: "rectangle",
  circle: "ellipse"
}, Do = {
  startOnLoad: !1,
  flowchart: { curve: "linear" },
  themeVariables: {
    fontSize: `${bo}px`
  },
  maxEdges: 500,
  maxTextSize: 5e4
};
class xs {
  constructor({ converter: t }) {
    this.convert = (r, i) => this.converter(r, {
      ...i,
      fontSize: i.fontSize || bo
    }), this.converter = t;
  }
}
var jr;
(function(e) {
  e.ROUND = "round", e.STADIUM = "stadium", e.DOUBLECIRCLE = "doublecircle", e.CIRCLE = "circle", e.DIAMOND = "diamond", e.CYLINDER = "cylinder";
})(jr || (jr = {}));
var Se;
(function(e) {
  e.COLOR = "color";
})(Se || (Se = {}));
var Ht;
(function(e) {
  e.FILL = "fill", e.STROKE = "stroke", e.STROKE_WIDTH = "stroke-width", e.STROKE_DASHARRAY = "stroke-dasharray";
})(Ht || (Ht = {}));
var Ls = {}, mu;
function JC() {
  if (mu) return Ls;
  mu = 1, Object.defineProperty(Ls, "__esModule", { value: !0 }), Ls.removeMarkdown = void 0;
  var e = function(t, r) {
    r === void 0 && (r = {
      listUnicodeChar: ""
    }), r = r || {}, r.listUnicodeChar = r.hasOwnProperty("listUnicodeChar") ? r.listUnicodeChar : !1, r.stripListLeaders = r.hasOwnProperty("stripListLeaders") ? r.stripListLeaders : !0, r.gfm = r.hasOwnProperty("gfm") ? r.gfm : !0, r.useImgAltText = r.hasOwnProperty("useImgAltText") ? r.useImgAltText : !0, r.preserveLinks = r.hasOwnProperty("preserveLinks") ? r.preserveLinks : !1;
    var i = t || "";
    i = i.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, "");
    try {
      r.stripListLeaders && (r.listUnicodeChar ? i = i.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, r.listUnicodeChar + " $1") : i = i.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1")), r.gfm && (i = i.replace(/\n={2,}/g, `
`).replace(/~{3}.*\n/g, "").replace(/~~/g, "").replace(/`{3}.*\n/g, "")), r.preserveLinks && (i = i.replace(/\[(.*?)\][\[\(](.*?)[\]\)]/g, "$1 ($2)")), i = i.replace(/<[^>]*>/g, "").replace(/^[=\-]{2,}\s*$/g, "").replace(/\[\^.+?\](\: .*?$)?/g, "").replace(/\s{0,2}\[.*?\]: .*?$/g, "").replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, r.useImgAltText ? "$1" : "").replace(/\[(.*?)\][\[\(].*?[\]\)]/g, "$1").replace(/^\s{0,3}>\s?/g, "").replace(/(^|\n)\s{0,3}>\s?/g, `

`).replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "").replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, "$1$2$3").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/(`{3,})(.*?)\1/gm, "$2").replace(/`(.+?)`/g, "$1").replace(/\n{2,}/g, `

`);
    } catch (s) {
      return console.error(s), t;
    }
    return i;
  };
  return Ls.removeMarkdown = e, Ls;
}
var tb = JC();
const eb = {
  arrow_circle: {
    endArrowhead: "circle"
  },
  arrow_cross: {
    endArrowhead: "bar"
  },
  arrow_open: {
    endArrowhead: null,
    startArrowhead: null
  },
  double_arrow_circle: {
    endArrowhead: "circle",
    startArrowhead: "circle"
  },
  double_arrow_cross: {
    endArrowhead: "bar",
    startArrowhead: "bar"
  },
  double_arrow_point: {
    endArrowhead: "arrow",
    startArrowhead: "arrow"
  }
}, rb = (e) => eb[e], Ta = (e) => {
  let t = e.text;
  return e.labelType === "markdown" && (t = tb.removeMarkdown(e.text)), ib(t);
}, ib = (e) => {
  const t = /\s?(fa|fab):[a-zA-Z0-9-]+/g;
  return e.replace(t, "");
}, no = (e) => {
  const t = {};
  return Object.keys(e).forEach((r) => {
    switch (r) {
      case Ht.FILL: {
        t.backgroundColor = e[r], t.fillStyle = "solid";
        break;
      }
      case Ht.STROKE: {
        t.strokeColor = e[r];
        break;
      }
      case Ht.STROKE_WIDTH: {
        t.strokeWidth = Number(e[r]?.split("px")[0]);
        break;
      }
      case Ht.STROKE_DASHARRAY: {
        t.strokeStyle = "dashed";
        break;
      }
    }
  }), t;
}, _l = (e) => {
  const t = {};
  return Object.keys(e).forEach((r) => {
    r === Se.COLOR && (t.strokeColor = e[r]);
  }), t;
}, sb = (e, t) => [e, t], ob = 32, vp = 0.62, nb = 12, ab = 12, Bp = (e, t) => Math.max(20, Math.ceil(e.length * t * vp)), lb = (e, t, r, i) => {
  const s = i || bo;
  if (e !== jr.CYLINDER || !t || t.includes(`
`))
    return s;
  const o = Math.max(20, r - nb);
  return Bp(t, s) <= o ? s : Math.max(ab, Math.floor(o / (t.length * vp)));
}, hb = (e) => {
  const t = {};
  e.subGraphs.map((i) => {
    i.nodeIds.forEach((s) => {
      t[i.id] = {
        id: i.id,
        parent: null,
        isLeaf: !1
      }, t[s] = {
        id: s,
        parent: i.id,
        isLeaf: e.vertices[s] !== void 0
      };
    });
  });
  const r = {};
  return [...Object.keys(e.vertices), ...e.subGraphs.map((i) => i.id)].forEach((i) => {
    if (!t[i])
      return;
    let s = t[i];
    const o = [];
    for (s.isLeaf || o.push(`subgraph_group_${s.id}`); s.parent; )
      o.push(`subgraph_group_${s.parent}`), s = t[s.parent];
    r[i] = o;
  }), {
    getGroupIds: (i) => r[i] || [],
    getParentId: (i) => t[i] ? t[i].parent : null
  };
}, cb = new xs({
  converter: (e, t) => {
    const r = [], i = t.fontSize, { getGroupIds: s, getParentId: o } = hb(e);
    return e.subGraphs.reverse().forEach((n) => {
      const a = s(n.id), l = Ta(n), u = Bp(l, i || 16) + ob * 2, d = Math.max(n.width, u), f = n.x - (d - n.width) / 2, m = no(n.containerStyle), y = _l(n.labelStyle), x = {
        id: n.id,
        type: "rectangle",
        groupIds: a,
        x: f,
        y: n.y,
        width: d,
        height: n.height,
        label: {
          groupIds: a,
          text: l,
          fontSize: i,
          verticalAlign: "top",
          ...y
        },
        ...m
      };
      r.push(x);
    }), Object.values(e.vertices).forEach((n) => {
      if (!n)
        return;
      const a = s(n.id), l = Ta(n), c = lb(n.type, l, n.width, i), h = no(n.containerStyle), u = _l(n.labelStyle);
      let d = {
        id: n.id,
        type: "rectangle",
        groupIds: a,
        x: n.x,
        y: n.y,
        width: n.width,
        height: n.height,
        strokeWidth: 2,
        label: {
          groupIds: a,
          text: l,
          fontSize: c,
          ...u
        },
        link: n.link || null,
        ...h
      };
      switch (n.type) {
        case jr.STADIUM: {
          d = { ...d, roundness: { type: 3 } };
          break;
        }
        case jr.ROUND: {
          d = { ...d, roundness: { type: 3 } };
          break;
        }
        case jr.DOUBLECIRCLE: {
          a.push(`doublecircle_${n.id}}`);
          const m = {
            type: "ellipse",
            groupIds: a,
            x: n.x + 5,
            y: n.y + 5,
            width: n.width - 10,
            height: n.height - 10,
            strokeWidth: 2,
            roundness: { type: 3 },
            label: {
              groupIds: a,
              text: l,
              fontSize: c,
              ...u
            }
          };
          d = { ...d, groupIds: a, type: "ellipse" }, r.push(m);
          break;
        }
        case jr.CIRCLE: {
          d.type = "ellipse";
          break;
        }
        case jr.DIAMOND: {
          d.type = "diamond";
          break;
        }
      }
      r.push(d);
    }), e.edges.forEach((n) => {
      let a = [];
      const l = o(n.start), c = o(n.end);
      l && l === c && (a = s(l));
      const { startX: h, startY: u, reflectionPoints: d } = n, f = d.map((w) => sb(w.x - d[0].x, w.y - d[0].y)), m = rb(n.type || "arrow_point"), y = r.find((w) => w.id === n.start), x = r.find((w) => w.id === n.end);
      if (!y || !x)
        return;
      const b = {
        id: `${n.start}_${n.end}`,
        type: "arrow",
        groupIds: a,
        x: h,
        y: u,
        // 4 and 2 are the Excalidraw's stroke width of thick and thin respectively
        // TODO: use constant exported from Excalidraw package
        strokeWidth: n.stroke === "thick" ? 4 : 2,
        strokeStyle: n.stroke === "dotted" ? "dashed" : void 0,
        points: f,
        ...n.text ? { label: { text: Ta(n), fontSize: i, groupIds: a } } : {},
        roundness: {
          type: 2
        },
        ...m,
        start: {
          id: y.id || ""
        },
        end: {
          id: x.id || ""
        }
      };
      r.push(b);
    }), {
      elements: r
    };
  }
});
let ub = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", ze = (e = 21) => {
  let t = "", r = crypto.getRandomValues(new Uint8Array(e |= 0));
  for (; e--; )
    t += ub[r[e] & 63];
  return t;
};
const db = new xs({
  converter: (e) => {
    const t = ze(), { width: r, height: i } = e, s = {
      type: "image",
      x: 0,
      y: 0,
      width: r,
      height: i,
      status: "saved",
      fileId: t
    };
    return { files: {
      [t]: {
        id: t,
        mimeType: e.mimeType,
        dataURL: e.dataURL
      }
    }, elements: [s] };
  }
}), Qs = (e, t) => [e, t], kh = (e) => e.replace(/\\n/g, `
`), ui = (e) => {
  const t = {
    type: "line",
    x: e.startX,
    y: e.startY,
    points: [
      Qs(0, 0),
      Qs(e.endX - e.startX, e.endY - e.startY)
    ],
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    strokeStyle: e.strokeStyle || "solid",
    strokeColor: e.strokeColor || "#000",
    strokeWidth: e.strokeWidth || 1
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, di = (e) => {
  const t = {
    type: "text",
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    text: kh(e.text) || "",
    fontSize: e.fontSize,
    verticalAlign: "top",
    strokeColor: e.color
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, zi = (e) => {
  const t = {
    text: kh(e?.label?.text || ""),
    fontSize: e?.label?.fontSize,
    textAlign: e.label?.textAlign,
    verticalAlign: e.label?.verticalAlign || "middle",
    strokeColor: e.label?.color || "#000",
    ...e.groupId ? { groupIds: [e.groupId] } : {}
  };
  let r = {};
  e.type === "rectangle" && e.subtype === "activation" && (r = {
    backgroundColor: "#e9ecef",
    fillStyle: "solid"
  });
  const i = {
    id: e.id,
    type: e.type,
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    label: t,
    strokeStyle: e?.strokeStyle,
    strokeWidth: e?.strokeWidth,
    strokeColor: e?.strokeColor,
    backgroundColor: e?.bgColor,
    fillStyle: "solid",
    ...r
  };
  return e.groupId && Object.assign(i, { groupIds: [e.groupId] }), i;
}, wh = (e) => {
  const t = {
    type: "arrow",
    x: e.startX,
    y: e.startY,
    points: e.points?.map(([r, i]) => Qs(r, i)) || [
      Qs(0, 0),
      Qs(e.endX - e.startX, e.endY - e.startY)
    ],
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    strokeStyle: e?.strokeStyle || "solid",
    endArrowhead: e?.endArrowhead || null,
    startArrowhead: e?.startArrowhead || null,
    label: {
      text: kh(e?.label?.text || ""),
      fontSize: 16,
      textAlign: e?.label?.textAlign,
      verticalAlign: e?.label?.verticalAlign
    },
    roundness: {
      type: 2
    },
    start: e.start,
    end: e.end
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), t;
}, Po = 10, _a = 16, fb = 24, pb = 4, gb = (e) => {
  if (!e)
    return !0;
  const t = e.trim().toLowerCase();
  return t === "transparent" || t === "none" || t === "rgba(0,0,0,0)" || t === "rgba(0, 0, 0, 0)";
}, mb = (e, t) => Math.max(20, Math.round(e.length * t * 0.6)), yu = (e, t, r = !0) => {
  const i = e, s = i.groupIds ?? [];
  if (s.includes(t) || (i.groupIds = [...s, t]), !r || !i.label)
    return;
  const o = i.label.groupIds ?? [];
  o.includes(t) || (i.label.groupIds = [...o, t]);
}, yb = new xs({
  converter: (e) => {
    const t = [], r = [];
    if (Object.values(e.nodes).forEach((i) => {
      !i || !i.length || i.forEach((s) => {
        let o;
        switch (s.type) {
          case "line":
            o = ui(s);
            break;
          case "rectangle":
          case "ellipse":
            o = zi(s);
            break;
          case "text":
            o = di(s);
            break;
          default:
            throw `unknown type ${s.type}`;
        }
        s.type === "rectangle" && s?.subtype === "activation" ? r.push(o) : t.push(o);
      });
    }), Object.values(e.lines).forEach((i) => {
      i && t.push(ui(i));
    }), Object.values(e.arrows).forEach((i) => {
      i && (t.push(wh(i)), i.sequenceNumber && t.push(zi(i.sequenceNumber)));
    }), t.push(...r), e.loops) {
      const { lines: i, texts: s, nodes: o } = e.loops;
      i.forEach((n) => {
        t.push(ui(n));
      }), s.forEach((n) => {
        t.push(di(n));
      }), o.forEach((n) => {
        t.push(zi(n));
      });
    }
    return e.groups && e.groups.forEach((i) => {
      const { actorKeys: s, name: o } = i;
      let n = 1 / 0, a = 1 / 0, l = 0, c = 0;
      if (!s.length)
        return;
      const h = t.filter((b) => {
        if (b.id) {
          const w = b.id.indexOf("-"), _ = b.id.substring(0, w);
          return s.includes(_);
        }
        return !1;
      });
      if (!h.length || (h.forEach((b) => {
        b.x === void 0 || b.y === void 0 || b.width === void 0 || b.height === void 0 || (n = Math.min(n, b.x), a = Math.min(a, b.y), l = Math.max(l, b.x + b.width), c = Math.max(c, b.y + b.height));
      }), !Number.isFinite(n) || !Number.isFinite(a) || !Number.isFinite(l) || !Number.isFinite(c)))
        return;
      const u = n - Po, d = a - Po, f = l - n + Po * 2, m = c - a + Po * 2, y = ze(), x = ze(), C = zi({
        type: "rectangle",
        x: u,
        y: d,
        width: f,
        height: m,
        bgColor: gb(i.fill) ? void 0 : i.fill,
        strokeColor: "#1f1f1f",
        strokeWidth: 1,
        id: y,
        groupId: x
      });
      if (t.unshift(C), t.forEach((b) => {
        b.id !== y && (b.x === void 0 || b.y === void 0 || b.width === void 0 || b.height === void 0 || b.x >= n && b.x + b.width <= l && b.y >= a && b.y + b.height <= c && yu(b, x));
      }), o) {
        const b = di({
          id: ze(),
          text: o,
          x: u + pb,
          y: d - fb,
          width: mb(o, _a),
          height: _a + 8,
          fontSize: _a,
          color: "#1f1f1f",
          groupId: x
        });
        yu(b, x, !1), t.push(b);
      }
    }), { elements: t };
  }
}), xb = new xs({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      !r || !r.length || r.forEach((i) => {
        let s;
        switch (i.type) {
          case "line":
            s = ui(i);
            break;
          case "rectangle":
          case "ellipse":
            s = zi(i);
            break;
          case "text":
            s = di(i);
            break;
          default:
            throw `unknown type ${i.type}`;
        }
        t.push(s);
      });
    }), Object.values(e.lines).forEach((r) => {
      r && t.push(ui(r));
    }), Object.values(e.arrows).forEach((r) => {
      if (!r)
        return;
      const i = wh(r);
      t.push(i);
    }), Object.values(e.text).forEach((r) => {
      const i = di(r);
      t.push(i);
    }), Object.values(e.namespaces).forEach((r) => {
      const i = Object.keys(r.classes), s = [...i], o = [...e.lines, ...e.arrows, ...e.text];
      i.forEach((a) => {
        const l = o.filter((c) => c.metadata && c.metadata.classId === a).map((c) => c.id);
        l.length && s.push(...l);
      });
      const n = {
        type: "frame",
        id: ze(),
        name: r.id,
        children: s
      };
      t.push(n);
    }), { elements: t };
  }
}), Cb = new xs({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      !r || !r.length || r.forEach((i) => {
        let s;
        switch (i.type) {
          case "line":
            s = ui(i);
            break;
          case "rectangle":
          case "ellipse":
            s = zi(i);
            break;
          case "text":
            s = di(i);
            break;
          default:
            throw `unknown type ${i.type}`;
        }
        t.push(s);
      });
    }), e.lines.forEach((r) => {
      t.push(ui(r));
    }), e.arrows.forEach((r) => {
      t.push(wh(r));
    }), e.text.forEach((r) => {
      t.push(di(r));
    }), { elements: t };
  }
}), pn = (e, t) => [e, t], qs = 16, Lp = 14, bb = 1, vl = "#000000", Ap = 5, kb = Ap * 2, wb = Ap * 2, Sb = 1.25, Ep = /* @__PURE__ */ new Set([
  "choice",
  "fork",
  "join",
  "stateStart",
  "stateEnd",
  "divider"
]), Bl = (e) => e.shape === "stateEnd" ? [`state_end_group_${e.id}`] : void 0, Fp = (e) => e.shape === "rectWithTitle" && e.description.length ? [e.text, ...e.description].join(`
`) : e.text;
let ei;
const Tb = () => {
  if (ei !== void 0)
    return ei;
  if (typeof document > "u")
    return ei = null, ei;
  try {
    ei = document.createElement("canvas").getContext("2d");
  } catch {
    ei = null;
  }
  return ei;
}, cs = (e, t) => {
  const r = Tb();
  return r ? (r.font = `${t}px Excalifont, sans-serif`, r.measureText(e).width) : e.length * t * 0.6;
}, _b = (e, t, r) => {
  if (cs(e, t) <= r)
    return [e];
  const i = [];
  let s = "";
  for (const o of e) {
    const n = `${s}${o}`;
    if (s && cs(n, t) > r) {
      i.push(s), s = o;
      continue;
    }
    s = n;
  }
  return s && i.push(s), i;
}, vb = (e, t, r) => {
  if (!e.trim() || cs(e, t) <= r)
    return e;
  const i = e.split(/\s+/).filter(Boolean), s = [];
  let o = "";
  for (const n of i) {
    const a = _b(n, t, r);
    for (const [l, c] of a.entries()) {
      const u = o ? `${o}${o && l === 0 ? " " : ""}${c}` : c;
      if (cs(u, t) <= r) {
        o = u;
        continue;
      }
      o && s.push(o), o = c;
    }
    a.length > 1;
  }
  return s.push(o), s.join(`
`);
}, Bb = (e, t, r) => {
  const s = e.map((a) => vb(a, t, r)).join(`
`).split(`
`), o = Math.max(...s.map((a) => cs(a, t))), n = s.length * t * Sb;
  return {
    width: o,
    height: n
  };
}, Lb = (e, t, r, i) => {
  const s = e.split(`
`);
  for (let o = qs; o >= Lp; o -= bb) {
    const { height: n } = Bb(s, o, t);
    if (n <= r)
      return o;
  }
  return i;
}, Ab = (e) => {
  const t = Fp(e);
  if (!t || Ep.has(e.shape))
    return qs;
  const r = Math.max(1, e.width - kb), i = Math.max(1, e.height - wb), s = t.split(`
`);
  return s.length > 1 && Math.max(...s.map((n) => cs(n, qs))) <= r ? qs : Lb(t, r, i, s.length === 1 ? qs : Lp);
}, Eb = (e) => {
  if (Ep.has(e.shape))
    return;
  const t = Fp(e);
  if (t)
    return {
      text: t,
      fontSize: Ab(e),
      verticalAlign: e.shape === "rectWithTitle" || e.shape === "roundedWithTitle" ? "top" : "middle",
      ..._l(e.labelStyle)
    };
}, Fb = (e) => {
  const t = no(e.containerStyle), r = Eb(e), i = e.shape === "choice" ? "diamond" : e.shape === "stateStart" || e.shape === "stateEnd" ? "ellipse" : "rectangle", s = e.shape === "rect" || e.shape === "rectWithTitle" || e.shape === "roundedWithTitle", o = e.shape === "stateStart" || e.shape === "fork" || e.shape === "join", n = t.backgroundColor || t.strokeColor || vl, a = t.strokeColor || t.backgroundColor || vl;
  return {
    id: e.id,
    type: i,
    ...Bl(e) ? { groupIds: Bl(e) } : {},
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    ...r ? { label: r } : {},
    ...t,
    ...s ? { roundness: { type: 3 } } : {},
    ...o ? {
      backgroundColor: n,
      strokeColor: a,
      fillStyle: "solid"
    } : {}
  };
}, Mb = (e) => {
  if (!e.dividerLine)
    return null;
  const t = no(e.containerStyle);
  return {
    id: `${e.id}__divider`,
    type: "line",
    x: e.dividerLine.startX,
    y: e.dividerLine.startY,
    width: e.dividerLine.endX - e.dividerLine.startX,
    height: e.dividerLine.endY - e.dividerLine.startY,
    points: [
      pn(0, 0),
      pn(e.dividerLine.endX - e.dividerLine.startX, e.dividerLine.endY - e.dividerLine.startY)
    ],
    strokeColor: t.strokeColor || "#000",
    strokeWidth: t.strokeWidth || 1
  };
}, $b = (e) => {
  const t = no(e.containerStyle), r = Math.max(2, Math.min(e.width, e.height) * 0.32), i = e.endInnerColor || t.strokeColor || t.backgroundColor || vl;
  return {
    id: `${e.id}__inner`,
    type: "ellipse",
    groupIds: Bl(e),
    x: e.x + r,
    y: e.y + r,
    width: Math.max(1, e.width - r * 2),
    height: Math.max(1, e.height - r * 2),
    backgroundColor: i,
    strokeColor: i,
    fillStyle: "solid",
    strokeWidth: 1
  };
}, Ob = (e) => {
  const t = e.reflectionPoints.map((r, i, s) => {
    const o = s[0];
    return i === 0 ? pn(0, 0) : pn(r.x - o.x, r.y - o.y);
  });
  return {
    id: e.id,
    type: "arrow",
    x: e.startX,
    y: e.startY,
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    points: t,
    strokeColor: e.strokeColor || "#000",
    strokeWidth: e.strokeWidth || 2,
    strokeStyle: e.strokeStyle || "solid",
    endArrowhead: e.isNoteEdge ? null : "triangle",
    roundness: { type: 2 },
    start: { id: e.start },
    end: { id: e.end },
    ...e.text ? {
      label: {
        text: e.text,
        fontSize: 16
      }
    } : {}
  };
}, Ib = new xs({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      if (!r.isRenderable)
        return;
      const i = Fb(r);
      t.push(i);
      const s = Mb(r);
      s && t.push(s), r.shape === "stateEnd" && t.push($b(r));
    }), e.edges.forEach((r) => {
      t.push(Ob(r));
    }), { elements: t };
  }
}), Fe = (e) => {
  e = Pb(e);
  const t = e.replace(/#(\d+);/g, "&#$1;").replace(/#([a-z]+);/g, "&$1;"), r = document.createElement("textarea");
  return r.innerHTML = t, r.value;
}, fi = (e) => {
  const r = e.getAttribute("transform")?.match(/translate\(([ \d.-]+),\s*([\d.-]+)\)/);
  let i = 0, s = 0;
  return r && (i = Number(r[1]), s = Number(r[2])), { transformX: i, transformY: s };
}, Db = (e) => {
  let t = e;
  return t = t.replace(/style.*:\S*#.*;/g, (r) => r.substring(0, r.length - 1)), t = t.replace(/classDef.*:\S*#.*;/g, (r) => r.substring(0, r.length - 1)), t = t.replace(/#\w+;/g, (r) => {
    const i = r.substring(1, r.length - 1);
    return /^\+?\d+$/.test(i) ? `ﬂ°°${i}¶ß` : `ﬂ°${i}¶ß`;
  }), t;
}, Pb = function(e) {
  return e.replace(/ﬂ°°/g, "#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, Rb = 0.5, Sh = (e, t = Rb) => {
  const r = [];
  return e.forEach((i) => {
    const s = r[r.length - 1];
    if (!s) {
      r.push(i);
      return;
    }
    Math.hypot(i[0] - s[0], i[1] - s[1]) <= t || r.push(i);
  }), r;
}, Th = (e) => {
  const t = e.getAttribute("d");
  if (!t)
    return null;
  const r = Array.from(t.matchAll(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi), (i) => Number(i[0]));
  return r.length < 4 ? null : {
    startX: r[0],
    startY: r[1],
    endX: r[r.length - 2],
    endY: r[r.length - 1]
  };
}, Mp = (e) => {
  const t = e.getAttribute("data-points");
  if (!t) {
    const r = Th(e);
    return r ? [
      { x: r.startX, y: r.startY },
      { x: r.endX, y: r.endY }
    ] : [];
  }
  try {
    const r = atob(t), i = JSON.parse(r);
    return Array.isArray(i) ? i.filter((s) => s && typeof s.x == "number" && typeof s.y == "number" && Number.isFinite(s.x) && Number.isFinite(s.y)) : [];
  } catch {
    return [];
  }
}, $p = (e, t = { x: 0, y: 0 }, r = "LM") => {
  if (e.tagName.toLowerCase() !== "path")
    throw new Error(`Invalid input: Expected an HTMLElement of tag "path", got ${e.tagName}`);
  const i = e.getAttribute("d");
  if (!i)
    throw new Error('Path element does not contain a "d" attribute');
  const s = i.split(new RegExp(`(?=[${r}])`)), o = s[0].substring(1).split(",").map((l) => parseFloat(l)), n = s[s.length - 1].substring(1).split(",").map((l) => parseFloat(l)), a = s.map((l) => {
    const c = l[0], h = l.substring(1).split(",").map((u) => parseFloat(u));
    return c === "C" ? {
      x: h[4],
      y: h[5],
      command: c
    } : { x: h[0], y: h[1], command: c };
  }).filter((l, c, h) => {
    if (c === 0 || c === h.length - 1)
      return !0;
    if (l.x === h[c - 1].x && l.y === h[c - 1].y || c === h.length - 2 && l.command === "C")
      return !1;
    if (c === h.length - 2 && (h[c - 1].x === l.x || h[c - 1].y === l.y)) {
      const u = h[h.length - 1];
      return Math.hypot(u.x - l.x, u.y - l.y) > 20;
    }
    return l.x !== h[c - 1].x || l.y !== h[c - 1].y;
  }).map((l) => ({
    x: l.x + t.x,
    y: l.y + t.y
  }));
  return {
    startX: o[0] + t.x,
    startY: o[1] + t.y,
    endX: n[0] + t.x,
    endY: n[1] + t.y,
    reflectionPoints: a
  };
}, Nb = (e) => ({
  ...e,
  elements: e.elements.map((t) => {
    if (!("points" in t) || !Array.isArray(t.points))
      return t;
    const r = t.points;
    if (r.length < 2)
      return t;
    const i = Sh(r);
    return i.length === r.length ? t : {
      ...t,
      points: i
    };
  })
}), qb = (e, t = {}) => {
  const r = (() => {
    switch (e.type) {
      case "graphImage":
        return db.convert(e, t);
      case "flowchart":
        return cb.convert(e, t);
      case "sequence":
        return yb.convert(e, t);
      case "class":
        return xb.convert(e, t);
      case "erd":
        return Cb.convert(e, t);
      case "state":
        return Ib.convert(e, t);
      default:
        throw new Error(`graphToExcalidraw: unknown graph type "${e.type}, only flowcharts are supported!"`);
    }
  })();
  return Nb(r);
};
var Op = Object.defineProperty, p = (e, t) => Op(e, "name", { value: t, configurable: !0 }), Wb = (e, t) => {
  for (var r in t)
    Op(e, r, { get: t[r], enumerable: !0 });
}, tn = { exports: {} }, zb = tn.exports, xu;
function Hb() {
  return xu || (xu = 1, (function(e, t) {
    (function(r, i) {
      e.exports = i();
    })(zb, (function() {
      var r = 1e3, i = 6e4, s = 36e5, o = "millisecond", n = "second", a = "minute", l = "hour", c = "day", h = "week", u = "month", d = "quarter", f = "year", m = "date", y = "Invalid Date", x = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, C = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, b = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(O) {
        var I = ["th", "st", "nd", "rd"], B = O % 100;
        return "[" + O + (I[(B - 20) % 10] || I[B] || I[0]) + "]";
      } }, w = function(O, I, B) {
        var M = String(O);
        return !M || M.length >= I ? O : "" + Array(I + 1 - M.length).join(B) + O;
      }, _ = { s: w, z: function(O) {
        var I = -O.utcOffset(), B = Math.abs(I), M = Math.floor(B / 60), F = B % 60;
        return (I <= 0 ? "+" : "-") + w(M, 2, "0") + ":" + w(F, 2, "0");
      }, m: function O(I, B) {
        if (I.date() < B.date()) return -O(B, I);
        var M = 12 * (B.year() - I.year()) + (B.month() - I.month()), F = I.clone().add(M, u), Q = B - F < 0, Z = I.clone().add(M + (Q ? -1 : 1), u);
        return +(-(M + (B - F) / (Q ? F - Z : Z - F)) || 0);
      }, a: function(O) {
        return O < 0 ? Math.ceil(O) || 0 : Math.floor(O);
      }, p: function(O) {
        return { M: u, y: f, w: h, d: c, D: m, h: l, m: a, s: n, ms: o, Q: d }[O] || String(O || "").toLowerCase().replace(/s$/, "");
      }, u: function(O) {
        return O === void 0;
      } }, v = "en", E = {};
      E[v] = b;
      var A = "$isDayjsObject", L = function(O) {
        return O instanceof st || !(!O || !O[A]);
      }, z = function O(I, B, M) {
        var F;
        if (!I) return v;
        if (typeof I == "string") {
          var Q = I.toLowerCase();
          E[Q] && (F = Q), B && (E[Q] = B, F = Q);
          var Z = I.split("-");
          if (!F && Z.length > 1) return O(Z[0]);
        } else {
          var dt = I.name;
          E[dt] = I, F = dt;
        }
        return !M && F && (v = F), F || !M && v;
      }, W = function(O, I) {
        if (L(O)) return O.clone();
        var B = typeof I == "object" ? I : {};
        return B.date = O, B.args = arguments, new st(B);
      }, R = _;
      R.l = z, R.i = L, R.w = function(O, I) {
        return W(O, { locale: I.$L, utc: I.$u, x: I.$x, $offset: I.$offset });
      };
      var st = (function() {
        function O(B) {
          this.$L = z(B.locale, null, !0), this.parse(B), this.$x = this.$x || B.x || {}, this[A] = !0;
        }
        var I = O.prototype;
        return I.parse = function(B) {
          this.$d = (function(M) {
            var F = M.date, Q = M.utc;
            if (F === null) return /* @__PURE__ */ new Date(NaN);
            if (R.u(F)) return /* @__PURE__ */ new Date();
            if (F instanceof Date) return new Date(F);
            if (typeof F == "string" && !/Z$/i.test(F)) {
              var Z = F.match(x);
              if (Z) {
                var dt = Z[2] - 1 || 0, wt = (Z[7] || "0").substring(0, 3);
                return Q ? new Date(Date.UTC(Z[1], dt, Z[3] || 1, Z[4] || 0, Z[5] || 0, Z[6] || 0, wt)) : new Date(Z[1], dt, Z[3] || 1, Z[4] || 0, Z[5] || 0, Z[6] || 0, wt);
              }
            }
            return new Date(F);
          })(B), this.init();
        }, I.init = function() {
          var B = this.$d;
          this.$y = B.getFullYear(), this.$M = B.getMonth(), this.$D = B.getDate(), this.$W = B.getDay(), this.$H = B.getHours(), this.$m = B.getMinutes(), this.$s = B.getSeconds(), this.$ms = B.getMilliseconds();
        }, I.$utils = function() {
          return R;
        }, I.isValid = function() {
          return this.$d.toString() !== y;
        }, I.isSame = function(B, M) {
          var F = W(B);
          return this.startOf(M) <= F && F <= this.endOf(M);
        }, I.isAfter = function(B, M) {
          return W(B) < this.startOf(M);
        }, I.isBefore = function(B, M) {
          return this.endOf(M) < W(B);
        }, I.$g = function(B, M, F) {
          return R.u(B) ? this[M] : this.set(F, B);
        }, I.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, I.valueOf = function() {
          return this.$d.getTime();
        }, I.startOf = function(B, M) {
          var F = this, Q = !!R.u(M) || M, Z = R.p(B), dt = function(Lt, qt) {
            var zt = R.w(F.$u ? Date.UTC(F.$y, qt, Lt) : new Date(F.$y, qt, Lt), F);
            return Q ? zt : zt.endOf(c);
          }, wt = function(Lt, qt) {
            return R.w(F.toDate()[Lt].apply(F.toDate("s"), (Q ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(qt)), F);
          }, yt = this.$W, at = this.$M, kt = this.$D, mt = "set" + (this.$u ? "UTC" : "");
          switch (Z) {
            case f:
              return Q ? dt(1, 0) : dt(31, 11);
            case u:
              return Q ? dt(1, at) : dt(0, at + 1);
            case h:
              var _t = this.$locale().weekStart || 0, Mt = (yt < _t ? yt + 7 : yt) - _t;
              return dt(Q ? kt - Mt : kt + (6 - Mt), at);
            case c:
            case m:
              return wt(mt + "Hours", 0);
            case l:
              return wt(mt + "Minutes", 1);
            case a:
              return wt(mt + "Seconds", 2);
            case n:
              return wt(mt + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, I.endOf = function(B) {
          return this.startOf(B, !1);
        }, I.$set = function(B, M) {
          var F, Q = R.p(B), Z = "set" + (this.$u ? "UTC" : ""), dt = (F = {}, F[c] = Z + "Date", F[m] = Z + "Date", F[u] = Z + "Month", F[f] = Z + "FullYear", F[l] = Z + "Hours", F[a] = Z + "Minutes", F[n] = Z + "Seconds", F[o] = Z + "Milliseconds", F)[Q], wt = Q === c ? this.$D + (M - this.$W) : M;
          if (Q === u || Q === f) {
            var yt = this.clone().set(m, 1);
            yt.$d[dt](wt), yt.init(), this.$d = yt.set(m, Math.min(this.$D, yt.daysInMonth())).$d;
          } else dt && this.$d[dt](wt);
          return this.init(), this;
        }, I.set = function(B, M) {
          return this.clone().$set(B, M);
        }, I.get = function(B) {
          return this[R.p(B)]();
        }, I.add = function(B, M) {
          var F, Q = this;
          B = Number(B);
          var Z = R.p(M), dt = function(at) {
            var kt = W(Q);
            return R.w(kt.date(kt.date() + Math.round(at * B)), Q);
          };
          if (Z === u) return this.set(u, this.$M + B);
          if (Z === f) return this.set(f, this.$y + B);
          if (Z === c) return dt(1);
          if (Z === h) return dt(7);
          var wt = (F = {}, F[a] = i, F[l] = s, F[n] = r, F)[Z] || 1, yt = this.$d.getTime() + B * wt;
          return R.w(yt, this);
        }, I.subtract = function(B, M) {
          return this.add(-1 * B, M);
        }, I.format = function(B) {
          var M = this, F = this.$locale();
          if (!this.isValid()) return F.invalidDate || y;
          var Q = B || "YYYY-MM-DDTHH:mm:ssZ", Z = R.z(this), dt = this.$H, wt = this.$m, yt = this.$M, at = F.weekdays, kt = F.months, mt = F.meridiem, _t = function(qt, zt, le, _e) {
            return qt && (qt[zt] || qt(M, Q)) || le[zt].slice(0, _e);
          }, Mt = function(qt) {
            return R.s(dt % 12 || 12, qt, "0");
          }, Lt = mt || function(qt, zt, le) {
            var _e = qt < 12 ? "AM" : "PM";
            return le ? _e.toLowerCase() : _e;
          };
          return Q.replace(C, (function(qt, zt) {
            return zt || (function(le) {
              switch (le) {
                case "YY":
                  return String(M.$y).slice(-2);
                case "YYYY":
                  return R.s(M.$y, 4, "0");
                case "M":
                  return yt + 1;
                case "MM":
                  return R.s(yt + 1, 2, "0");
                case "MMM":
                  return _t(F.monthsShort, yt, kt, 3);
                case "MMMM":
                  return _t(kt, yt);
                case "D":
                  return M.$D;
                case "DD":
                  return R.s(M.$D, 2, "0");
                case "d":
                  return String(M.$W);
                case "dd":
                  return _t(F.weekdaysMin, M.$W, at, 2);
                case "ddd":
                  return _t(F.weekdaysShort, M.$W, at, 3);
                case "dddd":
                  return at[M.$W];
                case "H":
                  return String(dt);
                case "HH":
                  return R.s(dt, 2, "0");
                case "h":
                  return Mt(1);
                case "hh":
                  return Mt(2);
                case "a":
                  return Lt(dt, wt, !0);
                case "A":
                  return Lt(dt, wt, !1);
                case "m":
                  return String(wt);
                case "mm":
                  return R.s(wt, 2, "0");
                case "s":
                  return String(M.$s);
                case "ss":
                  return R.s(M.$s, 2, "0");
                case "SSS":
                  return R.s(M.$ms, 3, "0");
                case "Z":
                  return Z;
              }
              return null;
            })(qt) || Z.replace(":", "");
          }));
        }, I.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, I.diff = function(B, M, F) {
          var Q, Z = this, dt = R.p(M), wt = W(B), yt = (wt.utcOffset() - this.utcOffset()) * i, at = this - wt, kt = function() {
            return R.m(Z, wt);
          };
          switch (dt) {
            case f:
              Q = kt() / 12;
              break;
            case u:
              Q = kt();
              break;
            case d:
              Q = kt() / 3;
              break;
            case h:
              Q = (at - yt) / 6048e5;
              break;
            case c:
              Q = (at - yt) / 864e5;
              break;
            case l:
              Q = at / s;
              break;
            case a:
              Q = at / i;
              break;
            case n:
              Q = at / r;
              break;
            default:
              Q = at;
          }
          return F ? Q : R.a(Q);
        }, I.daysInMonth = function() {
          return this.endOf(u).$D;
        }, I.$locale = function() {
          return E[this.$L];
        }, I.locale = function(B, M) {
          if (!B) return this.$L;
          var F = this.clone(), Q = z(B, M, !0);
          return Q && (F.$L = Q), F;
        }, I.clone = function() {
          return R.w(this.$d, this);
        }, I.toDate = function() {
          return new Date(this.valueOf());
        }, I.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, I.toISOString = function() {
          return this.$d.toISOString();
        }, I.toString = function() {
          return this.$d.toUTCString();
        }, O;
      })(), j = st.prototype;
      return W.prototype = j, [["$ms", o], ["$s", n], ["$m", a], ["$H", l], ["$W", c], ["$M", u], ["$y", f], ["$D", m]].forEach((function(O) {
        j[O[1]] = function(I) {
          return this.$g(I, O[0], O[1]);
        };
      })), W.extend = function(O, I) {
        return O.$i || (O(I, st, W), O.$i = !0), W;
      }, W.locale = z, W.isDayjs = L, W.unix = function(O) {
        return W(1e3 * O);
      }, W.en = E[v], W.Ls = E, W.p = {}, W;
    }));
  })(tn)), tn.exports;
}
var Yb = Hb();
const Ub = /* @__PURE__ */ bh(Yb);
var Tr = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
}, q = {
  trace: /* @__PURE__ */ p((...e) => {
  }, "trace"),
  debug: /* @__PURE__ */ p((...e) => {
  }, "debug"),
  info: /* @__PURE__ */ p((...e) => {
  }, "info"),
  warn: /* @__PURE__ */ p((...e) => {
  }, "warn"),
  error: /* @__PURE__ */ p((...e) => {
  }, "error"),
  fatal: /* @__PURE__ */ p((...e) => {
  }, "fatal")
}, _h = /* @__PURE__ */ p(function(e = "fatal") {
  let t = Tr.fatal;
  typeof e == "string" ? e.toLowerCase() in Tr && (t = Tr[e]) : typeof e == "number" && (t = e), q.trace = () => {
  }, q.debug = () => {
  }, q.info = () => {
  }, q.warn = () => {
  }, q.error = () => {
  }, q.fatal = () => {
  }, t <= Tr.fatal && (q.fatal = console.error ? console.error.bind(console, qe("FATAL"), "color: orange") : console.log.bind(console, "\x1B[35m", qe("FATAL"))), t <= Tr.error && (q.error = console.error ? console.error.bind(console, qe("ERROR"), "color: orange") : console.log.bind(console, "\x1B[31m", qe("ERROR"))), t <= Tr.warn && (q.warn = console.warn ? console.warn.bind(console, qe("WARN"), "color: orange") : console.log.bind(console, "\x1B[33m", qe("WARN"))), t <= Tr.info && (q.info = console.info ? console.info.bind(console, qe("INFO"), "color: lightblue") : console.log.bind(console, "\x1B[34m", qe("INFO"))), t <= Tr.debug && (q.debug = console.debug ? console.debug.bind(console, qe("DEBUG"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", qe("DEBUG"))), t <= Tr.trace && (q.trace = console.debug ? console.debug.bind(console, qe("TRACE"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", qe("TRACE")));
}, "setLogLevel"), qe = /* @__PURE__ */ p((e) => `%c${Ub().format("ss.SSS")} : ${e} : `, "format");
const en = {
  /* CLAMP */
  min: {
    r: 0,
    g: 0,
    b: 0,
    s: 0,
    l: 0,
    a: 0
  },
  max: {
    r: 255,
    g: 255,
    b: 255,
    h: 360,
    s: 100,
    l: 100,
    a: 1
  },
  clamp: {
    r: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    g: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    b: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    h: (e) => e % 360,
    s: (e) => e >= 100 ? 100 : e < 0 ? 0 : e,
    l: (e) => e >= 100 ? 100 : e < 0 ? 0 : e,
    a: (e) => e >= 1 ? 1 : e < 0 ? 0 : e
  },
  /* CONVERSION */
  //SOURCE: https://planetcalc.com/7779
  toLinear: (e) => {
    const t = e / 255;
    return e > 0.03928 ? Math.pow((t + 0.055) / 1.055, 2.4) : t / 12.92;
  },
  //SOURCE: https://gist.github.com/mjackson/5311256
  hue2rgb: (e, t, r) => (r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? e + (t - e) * 6 * r : r < 1 / 2 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e),
  hsl2rgb: ({ h: e, s: t, l: r }, i) => {
    if (!t)
      return r * 2.55;
    e /= 360, t /= 100, r /= 100;
    const s = r < 0.5 ? r * (1 + t) : r + t - r * t, o = 2 * r - s;
    switch (i) {
      case "r":
        return en.hue2rgb(o, s, e + 1 / 3) * 255;
      case "g":
        return en.hue2rgb(o, s, e) * 255;
      case "b":
        return en.hue2rgb(o, s, e - 1 / 3) * 255;
    }
  },
  rgb2hsl: ({ r: e, g: t, b: r }, i) => {
    e /= 255, t /= 255, r /= 255;
    const s = Math.max(e, t, r), o = Math.min(e, t, r), n = (s + o) / 2;
    if (i === "l")
      return n * 100;
    if (s === o)
      return 0;
    const a = s - o, l = n > 0.5 ? a / (2 - s - o) : a / (s + o);
    if (i === "s")
      return l * 100;
    switch (s) {
      case e:
        return ((t - r) / a + (t < r ? 6 : 0)) * 60;
      case t:
        return ((r - e) / a + 2) * 60;
      case r:
        return ((e - t) / a + 4) * 60;
      default:
        return -1;
    }
  }
}, jb = {
  /* API */
  clamp: (e, t, r) => t > r ? Math.min(t, Math.max(r, e)) : Math.min(r, Math.max(t, e)),
  round: (e) => Math.round(e * 1e10) / 1e10
}, Xb = {
  /* API */
  dec2hex: (e) => {
    const t = Math.round(e).toString(16);
    return t.length > 1 ? t : `0${t}`;
  }
}, At = {
  channel: en,
  lang: jb,
  unit: Xb
}, Yr = {};
for (let e = 0; e <= 255; e++)
  Yr[e] = At.unit.dec2hex(e);
const pe = {
  ALL: 0,
  RGB: 1,
  HSL: 2
};
let Gb = class {
  constructor() {
    this.type = pe.ALL;
  }
  /* API */
  get() {
    return this.type;
  }
  set(t) {
    if (this.type && this.type !== t)
      throw new Error("Cannot change both RGB and HSL channels at the same time");
    this.type = t;
  }
  reset() {
    this.type = pe.ALL;
  }
  is(t) {
    return this.type === t;
  }
};
class Vb {
  /* CONSTRUCTOR */
  constructor(t, r) {
    this.color = r, this.changed = !1, this.data = t, this.type = new Gb();
  }
  /* API */
  set(t, r) {
    return this.color = r, this.changed = !1, this.data = t, this.type.type = pe.ALL, this;
  }
  /* HELPERS */
  _ensureHSL() {
    const t = this.data, { h: r, s: i, l: s } = t;
    r === void 0 && (t.h = At.channel.rgb2hsl(t, "h")), i === void 0 && (t.s = At.channel.rgb2hsl(t, "s")), s === void 0 && (t.l = At.channel.rgb2hsl(t, "l"));
  }
  _ensureRGB() {
    const t = this.data, { r, g: i, b: s } = t;
    r === void 0 && (t.r = At.channel.hsl2rgb(t, "r")), i === void 0 && (t.g = At.channel.hsl2rgb(t, "g")), s === void 0 && (t.b = At.channel.hsl2rgb(t, "b"));
  }
  /* GETTERS */
  get r() {
    const t = this.data, r = t.r;
    return !this.type.is(pe.HSL) && r !== void 0 ? r : (this._ensureHSL(), At.channel.hsl2rgb(t, "r"));
  }
  get g() {
    const t = this.data, r = t.g;
    return !this.type.is(pe.HSL) && r !== void 0 ? r : (this._ensureHSL(), At.channel.hsl2rgb(t, "g"));
  }
  get b() {
    const t = this.data, r = t.b;
    return !this.type.is(pe.HSL) && r !== void 0 ? r : (this._ensureHSL(), At.channel.hsl2rgb(t, "b"));
  }
  get h() {
    const t = this.data, r = t.h;
    return !this.type.is(pe.RGB) && r !== void 0 ? r : (this._ensureRGB(), At.channel.rgb2hsl(t, "h"));
  }
  get s() {
    const t = this.data, r = t.s;
    return !this.type.is(pe.RGB) && r !== void 0 ? r : (this._ensureRGB(), At.channel.rgb2hsl(t, "s"));
  }
  get l() {
    const t = this.data, r = t.l;
    return !this.type.is(pe.RGB) && r !== void 0 ? r : (this._ensureRGB(), At.channel.rgb2hsl(t, "l"));
  }
  get a() {
    return this.data.a;
  }
  /* SETTERS */
  set r(t) {
    this.type.set(pe.RGB), this.changed = !0, this.data.r = t;
  }
  set g(t) {
    this.type.set(pe.RGB), this.changed = !0, this.data.g = t;
  }
  set b(t) {
    this.type.set(pe.RGB), this.changed = !0, this.data.b = t;
  }
  set h(t) {
    this.type.set(pe.HSL), this.changed = !0, this.data.h = t;
  }
  set s(t) {
    this.type.set(pe.HSL), this.changed = !0, this.data.s = t;
  }
  set l(t) {
    this.type.set(pe.HSL), this.changed = !0, this.data.l = t;
  }
  set a(t) {
    this.changed = !0, this.data.a = t;
  }
}
const Un = new Vb({ r: 0, g: 0, b: 0, a: 0 }, "transparent"), Yi = {
  /* VARIABLES */
  re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,
  /* API */
  parse: (e) => {
    if (e.charCodeAt(0) !== 35)
      return;
    const t = e.match(Yi.re);
    if (!t)
      return;
    const r = t[1], i = parseInt(r, 16), s = r.length, o = s % 4 === 0, n = s > 4, a = n ? 1 : 17, l = n ? 8 : 4, c = o ? 0 : -1, h = n ? 255 : 15;
    return Un.set({
      r: (i >> l * (c + 3) & h) * a,
      g: (i >> l * (c + 2) & h) * a,
      b: (i >> l * (c + 1) & h) * a,
      a: o ? (i & h) * a / 255 : 1
    }, e);
  },
  stringify: (e) => {
    const { r: t, g: r, b: i, a: s } = e;
    return s < 1 ? `#${Yr[Math.round(t)]}${Yr[Math.round(r)]}${Yr[Math.round(i)]}${Yr[Math.round(s * 255)]}` : `#${Yr[Math.round(t)]}${Yr[Math.round(r)]}${Yr[Math.round(i)]}`;
  }
}, li = {
  /* VARIABLES */
  re: /^hsla?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(?:deg|grad|rad|turn)?)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(%)?))?\s*?\)$/i,
  hueRe: /^(.+?)(deg|grad|rad|turn)$/i,
  /* HELPERS */
  _hue2deg: (e) => {
    const t = e.match(li.hueRe);
    if (t) {
      const [, r, i] = t;
      switch (i) {
        case "grad":
          return At.channel.clamp.h(parseFloat(r) * 0.9);
        case "rad":
          return At.channel.clamp.h(parseFloat(r) * 180 / Math.PI);
        case "turn":
          return At.channel.clamp.h(parseFloat(r) * 360);
      }
    }
    return At.channel.clamp.h(parseFloat(e));
  },
  /* API */
  parse: (e) => {
    const t = e.charCodeAt(0);
    if (t !== 104 && t !== 72)
      return;
    const r = e.match(li.re);
    if (!r)
      return;
    const [, i, s, o, n, a] = r;
    return Un.set({
      h: li._hue2deg(i),
      s: At.channel.clamp.s(parseFloat(s)),
      l: At.channel.clamp.l(parseFloat(o)),
      a: n ? At.channel.clamp.a(a ? parseFloat(n) / 100 : parseFloat(n)) : 1
    }, e);
  },
  stringify: (e) => {
    const { h: t, s: r, l: i, a: s } = e;
    return s < 1 ? `hsla(${At.lang.round(t)}, ${At.lang.round(r)}%, ${At.lang.round(i)}%, ${s})` : `hsl(${At.lang.round(t)}, ${At.lang.round(r)}%, ${At.lang.round(i)}%)`;
  }
}, Js = {
  /* VARIABLES */
  colors: {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyanaqua: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    transparent: "#00000000",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  },
  /* API */
  parse: (e) => {
    e = e.toLowerCase();
    const t = Js.colors[e];
    if (t)
      return Yi.parse(t);
  },
  stringify: (e) => {
    const t = Yi.stringify(e);
    for (const r in Js.colors)
      if (Js.colors[r] === t)
        return r;
  }
}, Ws = {
  /* VARIABLES */
  re: /^rgba?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?)))?\s*?\)$/i,
  /* API */
  parse: (e) => {
    const t = e.charCodeAt(0);
    if (t !== 114 && t !== 82)
      return;
    const r = e.match(Ws.re);
    if (!r)
      return;
    const [, i, s, o, n, a, l, c, h] = r;
    return Un.set({
      r: At.channel.clamp.r(s ? parseFloat(i) * 2.55 : parseFloat(i)),
      g: At.channel.clamp.g(n ? parseFloat(o) * 2.55 : parseFloat(o)),
      b: At.channel.clamp.b(l ? parseFloat(a) * 2.55 : parseFloat(a)),
      a: c ? At.channel.clamp.a(h ? parseFloat(c) / 100 : parseFloat(c)) : 1
    }, e);
  },
  stringify: (e) => {
    const { r: t, g: r, b: i, a: s } = e;
    return s < 1 ? `rgba(${At.lang.round(t)}, ${At.lang.round(r)}, ${At.lang.round(i)}, ${At.lang.round(s)})` : `rgb(${At.lang.round(t)}, ${At.lang.round(r)}, ${At.lang.round(i)})`;
  }
}, pr = {
  /* VARIABLES */
  format: {
    keyword: Js,
    hex: Yi,
    rgb: Ws,
    rgba: Ws,
    hsl: li,
    hsla: li
  },
  /* API */
  parse: (e) => {
    if (typeof e != "string")
      return e;
    const t = Yi.parse(e) || Ws.parse(e) || li.parse(e) || Js.parse(e);
    if (t)
      return t;
    throw new Error(`Unsupported color format: "${e}"`);
  },
  stringify: (e) => !e.changed && e.color ? e.color : e.type.is(pe.HSL) || e.data.r === void 0 ? li.stringify(e) : e.a < 1 || !Number.isInteger(e.r) || !Number.isInteger(e.g) || !Number.isInteger(e.b) ? Ws.stringify(e) : Yi.stringify(e)
}, Ip = (e, t) => {
  const r = pr.parse(e);
  for (const i in t)
    r[i] = At.channel.clamp[i](t[i]);
  return pr.stringify(r);
}, Vr = (e, t, r = 0, i = 1) => {
  if (typeof e != "number")
    return Ip(e, { a: t });
  const s = Un.set({
    r: At.channel.clamp.r(e),
    g: At.channel.clamp.g(t),
    b: At.channel.clamp.b(r),
    a: At.channel.clamp.a(i)
  });
  return pr.stringify(s);
}, Kb = (e) => {
  const { r: t, g: r, b: i } = pr.parse(e), s = 0.2126 * At.channel.toLinear(t) + 0.7152 * At.channel.toLinear(r) + 0.0722 * At.channel.toLinear(i);
  return At.lang.round(s);
}, Zb = (e) => Kb(e) >= 0.5, tr = (e) => !Zb(e), Dp = (e, t, r) => {
  const i = pr.parse(e), s = i[t], o = At.channel.clamp[t](s + r);
  return s !== o && (i[t] = o), pr.stringify(i);
}, H = (e, t) => Dp(e, "l", t), Y = (e, t) => Dp(e, "l", -t), k = (e, t) => {
  const r = pr.parse(e), i = {};
  for (const s in t)
    t[s] && (i[s] = r[s] + t[s]);
  return Ip(e, i);
}, Qb = (e, t, r = 50) => {
  const { r: i, g: s, b: o, a: n } = pr.parse(e), { r: a, g: l, b: c, a: h } = pr.parse(t), u = r / 100, d = u * 2 - 1, f = n - h, y = ((d * f === -1 ? d : (d + f) / (1 + d * f)) + 1) / 2, x = 1 - y, C = i * y + a * x, b = s * y + l * x, w = o * y + c * x, _ = n * u + h * (1 - u);
  return Vr(C, b, w, _);
}, $ = (e, t = 100) => {
  const r = pr.parse(e);
  return r.r = 255 - r.r, r.g = 255 - r.g, r.b = 255 - r.b, Qb(r, e, t);
};
function Cu(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
  return i;
}
function Jb(e) {
  if (Array.isArray(e)) return e;
}
function t1(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var i, s, o, n, a = [], l = !0, c = !1;
    try {
      if (o = (r = r.call(e)).next, t !== 0) for (; !(l = (i = o.call(r)).done) && (a.push(i.value), a.length !== t); l = !0) ;
    } catch (h) {
      c = !0, s = h;
    } finally {
      try {
        if (!l && r.return != null && (n = r.return(), Object(n) !== n)) return;
      } finally {
        if (c) throw s;
      }
    }
    return a;
  }
}
function e1() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function r1(e, t) {
  return Jb(e) || t1(e, t) || i1(e, t) || e1();
}
function i1(e, t) {
  if (e) {
    if (typeof e == "string") return Cu(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Cu(e, t) : void 0;
  }
}
const Pp = Object.entries, bu = Object.setPrototypeOf, s1 = Object.isFrozen, o1 = Object.getPrototypeOf, n1 = Object.getOwnPropertyDescriptor;
let oe = Object.freeze, ae = Object.seal, Ri = Object.create, Rp = typeof Reflect < "u" && Reflect, Ll = Rp.apply, Al = Rp.construct;
oe || (oe = function(t) {
  return t;
});
ae || (ae = function(t) {
  return t;
});
Ll || (Ll = function(t, r) {
  for (var i = arguments.length, s = new Array(i > 2 ? i - 2 : 0), o = 2; o < i; o++) s[o - 2] = arguments[o];
  return t.apply(r, s);
});
Al || (Al = function(t) {
  for (var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), s = 1; s < r; s++) i[s - 1] = arguments[s];
  return new t(...i);
});
const oi = ie(Array.prototype.forEach), a1 = ie(Array.prototype.lastIndexOf), ku = ie(Array.prototype.pop), As = ie(Array.prototype.push), l1 = ie(Array.prototype.splice), Ui = Array.isArray, zs = ie(String.prototype.toLowerCase), va = ie(String.prototype.toString), wu = ie(String.prototype.match), Es = ie(String.prototype.replace), Su = ie(String.prototype.indexOf), h1 = ie(String.prototype.trim), c1 = ie(Number.prototype.toString), u1 = ie(Boolean.prototype.toString), Tu = typeof BigInt > "u" ? null : ie(BigInt.prototype.toString), _u = typeof Symbol > "u" ? null : ie(Symbol.prototype.toString), Le = ie(Object.prototype.hasOwnProperty), Fs = ie(Object.prototype.toString), fe = ie(RegExp.prototype.test), Wr = d1(TypeError);
function ie(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), s = 1; s < r; s++) i[s - 1] = arguments[s];
    return Ll(e, t, i);
  };
}
function d1(e) {
  return function() {
    for (var t = arguments.length, r = new Array(t), i = 0; i < t; i++) r[i] = arguments[i];
    return Al(e, r);
  };
}
function Wt(e, t) {
  let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : zs;
  if (bu && bu(e, null), !Ui(t)) return e;
  let i = t.length;
  for (; i--; ) {
    let s = t[i];
    if (typeof s == "string") {
      const o = r(s);
      o !== s && (s1(t) || (t[i] = o), s = o);
    }
    e[s] = !0;
  }
  return e;
}
function f1(e) {
  for (let t = 0; t < e.length; t++) Le(e, t) || (e[t] = null);
  return e;
}
function Pe(e) {
  const t = Ri(null);
  for (const i of Pp(e)) {
    var r = r1(i, 2);
    const s = r[0], o = r[1];
    Le(e, s) && (Ui(o) ? t[s] = f1(o) : o && typeof o == "object" && o.constructor === Object ? t[s] = Pe(o) : t[s] = o);
  }
  return t;
}
function p1(e) {
  switch (typeof e) {
    case "string":
      return e;
    case "number":
      return c1(e);
    case "boolean":
      return u1(e);
    case "bigint":
      return Tu ? Tu(e) : "0";
    case "symbol":
      return _u ? _u(e) : "Symbol()";
    case "undefined":
      return Fs(e);
    case "function":
    case "object": {
      if (e === null) return Fs(e);
      const t = e, r = We(t, "toString");
      if (typeof r == "function") {
        const i = r(t);
        return typeof i == "string" ? i : Fs(i);
      }
      return Fs(e);
    }
    default:
      return Fs(e);
  }
}
function We(e, t) {
  for (; e !== null; ) {
    const i = n1(e, t);
    if (i) {
      if (i.get) return ie(i.get);
      if (typeof i.value == "function") return ie(i.value);
    }
    e = o1(e);
  }
  function r() {
    return null;
  }
  return r;
}
function g1(e) {
  try {
    return fe(e, ""), !0;
  } catch {
    return !1;
  }
}
const vu = oe([
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "nobr",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "search",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]), Ba = oe([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "enterkeyhint",
  "exportparts",
  "filter",
  "font",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "inputmode",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "part",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "view",
  "vkern"
]), La = oe([
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence"
]), m1 = oe([
  "animate",
  "color-profile",
  "cursor",
  "discard",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignobject",
  "hatch",
  "hatchpath",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "missing-glyph",
  "script",
  "set",
  "solidcolor",
  "unknown",
  "use"
]), Aa = oe([
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "mprescripts"
]), y1 = oe([
  "maction",
  "maligngroup",
  "malignmark",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
  "semantics",
  "annotation",
  "annotation-xml",
  "mprescripts",
  "none"
]), Bu = oe(["#text"]), Lu = oe([
  "accept",
  "action",
  "align",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autopictureinpicture",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "capture",
  "cellpadding",
  "cellspacing",
  "checked",
  "cite",
  "class",
  "clear",
  "color",
  "cols",
  "colspan",
  "command",
  "commandfor",
  "controls",
  "controlslist",
  "coords",
  "crossorigin",
  "datetime",
  "decoding",
  "default",
  "dir",
  "disabled",
  "disablepictureinpicture",
  "disableremoteplayback",
  "download",
  "draggable",
  "enctype",
  "enterkeyhint",
  "exportparts",
  "face",
  "for",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "id",
  "inert",
  "inputmode",
  "integrity",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "nonce",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "optimum",
  "part",
  "pattern",
  "placeholder",
  "playsinline",
  "popover",
  "popovertarget",
  "popovertargetaction",
  "poster",
  "preload",
  "pubdate",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "rev",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "spellcheck",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "srclang",
  "start",
  "src",
  "srcset",
  "step",
  "style",
  "summary",
  "tabindex",
  "title",
  "translate",
  "type",
  "usemap",
  "valign",
  "value",
  "width",
  "wrap",
  "xmlns"
]), Ea = oe([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clippathunits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "dx",
  "dy",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradientunits",
  "gradienttransform",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "kernelmatrix",
  "kernelunitlength",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "max",
  "mask",
  "mask-type",
  "media",
  "method",
  "mode",
  "min",
  "name",
  "numoctaves",
  "offset",
  "operator",
  "opacity",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "rx",
  "ry",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "restart",
  "result",
  "rotate",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "transform",
  "transform-origin",
  "text-anchor",
  "text-decoration",
  "text-orientation",
  "text-rendering",
  "textlength",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "vector-effect",
  "viewbox",
  "visibility",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "xchannelselector",
  "ychannelselector",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]), Au = oe([
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "close",
  "columnalign",
  "columnlines",
  "columnspacing",
  "columnspan",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "frame",
  "height",
  "href",
  "id",
  "largeop",
  "length",
  "linethickness",
  "lquote",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rowspan",
  "rspace",
  "rquote",
  "scriptlevel",
  "scriptminsize",
  "scriptsizemultiplier",
  "selection",
  "separator",
  "separators",
  "stretchy",
  "subscriptshift",
  "supscriptshift",
  "symmetric",
  "voffset",
  "width",
  "xmlns"
]), Ro = oe([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), x1 = ae(/{{[\w\W]*|^[\w\W]*}}/g), C1 = ae(/<%[\w\W]*|^[\w\W]*%>/g), b1 = ae(/\${[\w\W]*/g), k1 = ae(/^data-[\-\w.\u00B7-\uFFFF]+$/), w1 = ae(/^aria-[\-\w]+$/), Eu = ae(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), S1 = ae(/^(?:\w+script|data):/i), T1 = ae(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), _1 = ae(/^html$/i), v1 = ae(/^[a-z][.\w]*(-[.\w]+)+$/i), Fu = ae(/<[/\w!]/g), Mu = ae(/<[/\w]/g), B1 = ae(/<\/no(script|embed|frames)/i), L1 = ae(/\/>/i), Ie = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  entityNode: 6,
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
}, Np = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], A1 = oe(Wt({}, Np)), E1 = (function() {
  const e = {};
  return oi(Np, (t) => {
    e[t] = ae(new RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
  }), oe(e);
})(), F1 = function() {
  return typeof window > "u" ? null : window;
}, M1 = function(t, r) {
  if (typeof t != "object" || typeof t.createPolicy != "function") return null;
  let i = null;
  const s = "data-tt-policy-suffix";
  r && r.hasAttribute(s) && (i = r.getAttribute(s));
  const o = "dompurify" + (i ? "#" + i : "");
  try {
    return t.createPolicy(o, {
      createHTML(n) {
        return n;
      },
      createScriptURL(n) {
        return n;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + o + " could not be created."), null;
  }
}, $u = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, zr = function(t, r, i, s) {
  return Le(t, r) && Ui(t[r]) ? Wt(s.base ? Pe(s.base) : {}, t[r], s.transform) : i;
}, Fa = function(t, r, i) {
  const s = Le(t, r) ? t[r] : void 0;
  return s && typeof s == "object" ? Pe(s) : i();
};
function qp() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : F1();
  const t = (ot) => qp(ot);
  if (t.version = "3.4.16", t.removed = [], !e || !e.document || e.document.nodeType !== Ie.document || !e.Element)
    return t.isSupported = !1, t;
  let r = e.document;
  const i = r, s = i.currentScript;
  e.DocumentFragment;
  const o = e.HTMLTemplateElement, n = e.Node, a = e.Element, l = e.NodeFilter;
  e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
  const c = e.DOMParser, h = e.trustedTypes, u = a.prototype, d = We(u, "cloneNode"), f = We(u, "remove"), m = We(u, "removeAttributeNode"), y = We(u, "nextSibling"), x = We(u, "childNodes"), C = We(u, "parentNode"), b = We(u, "shadowRoot"), w = We(u, "attributes"), _ = n && n.prototype ? We(n.prototype, "nodeType") : null, v = n && n.prototype ? We(n.prototype, "nodeName") : null, E = n && n.prototype ? We(n.prototype, "ownerDocument") : null, A = function(T) {
    return _ ? _(T) : T.nodeType;
  }, L = function(T) {
    return v ? v(T) : T.nodeName;
  };
  if (typeof o == "function") {
    const ot = r.createElement("template");
    ot.content && ot.content.ownerDocument && (r = ot.content.ownerDocument);
  }
  let z, W = "", R, st = !1, j = 0;
  const O = function() {
    if (j > 0) throw Wr('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, I = function(T) {
    O(), j++;
    try {
      return z.createHTML(T);
    } finally {
      j--;
    }
  }, B = function(T) {
    O(), j++;
    try {
      return z.createScriptURL(T);
    } finally {
      j--;
    }
  }, M = function() {
    return st || (R = M1(h, s), st = !0), R;
  }, F = r, Q = F.implementation, Z = F.createNodeIterator, dt = F.createDocumentFragment, wt = F.getElementsByTagName, yt = i.importNode;
  let at = $u();
  t.isSupported = typeof Pp == "function" && typeof C == "function" && Q && Q.createHTMLDocument !== void 0;
  const kt = x1, mt = C1, _t = b1, Mt = k1, Lt = w1, qt = S1, zt = T1, le = v1;
  let _e = Eu, Dt = null;
  const kr = Wt({}, [
    ...vu,
    ...Ba,
    ...La,
    ...Aa,
    ...Bu
  ]);
  let Ut = null;
  const ve = Wt({}, [
    ...Lu,
    ...Ea,
    ...Au,
    ...Ro
  ]);
  let he = Object.seal(Ri(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), Ge = null, wr = null;
  const Ce = Object.seal(Ri(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let Rr = !0, be = !0, Nr = !1, Sr = !0, ke = !1, $e = !0, g = !1, D = !1, X = null, V = null, U = !1, rt = !1, S = !1, N = !1, tt = !0, G = !1;
  const K = "user-content-";
  let et = !0, J = !1, ct = {}, ht = null;
  const xt = Wt({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let St = null;
  const $t = Wt({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let Xt = null;
  const _s = Wt({}, [
    "alt",
    "class",
    "for",
    "id",
    "label",
    "name",
    "pattern",
    "placeholder",
    "role",
    "summary",
    "title",
    "value",
    "style",
    "xmlns"
  ]), ir = "http://www.w3.org/1998/Math/MathML", sr = "http://www.w3.org/2000/svg", or = "http://www.w3.org/1999/xhtml";
  let Ai = or, ma = !1, ya = null;
  const DC = Wt({}, [
    ir,
    sr,
    or
  ], va), eu = oe([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let xa = Wt({}, eu);
  const ru = oe(["annotation-xml"]);
  let Ca = Wt({}, ru);
  const PC = Wt({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let vs = null;
  const RC = ["application/xhtml+xml", "text/html"], NC = "text/html";
  let Jt = null, Ei = null;
  const qC = r.createElement("form"), iu = function(T) {
    return T instanceof RegExp || T instanceof Function;
  }, ba = function() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (Ei && Ei === T) return;
    (!T || typeof T != "object") && (T = {}), T = Pe(T), vs = RC.indexOf(T.PARSER_MEDIA_TYPE) === -1 ? NC : T.PARSER_MEDIA_TYPE, Jt = vs === "application/xhtml+xml" ? va : zs, Dt = zr(T, "ALLOWED_TAGS", kr, { transform: Jt }), Ut = zr(T, "ALLOWED_ATTR", ve, { transform: Jt }), ya = zr(T, "ALLOWED_NAMESPACES", DC, { transform: va }), Xt = zr(T, "ADD_URI_SAFE_ATTR", _s, {
      transform: Jt,
      base: _s
    }), St = zr(T, "ADD_DATA_URI_TAGS", $t, {
      transform: Jt,
      base: $t
    }), ht = zr(T, "FORBID_CONTENTS", xt, { transform: Jt }), Ge = zr(T, "FORBID_TAGS", Pe({}), { transform: Jt }), wr = zr(T, "FORBID_ATTR", Pe({}), { transform: Jt }), ct = Le(T, "USE_PROFILES") ? T.USE_PROFILES && typeof T.USE_PROFILES == "object" ? Pe(T.USE_PROFILES) : T.USE_PROFILES : !1, Rr = T.ALLOW_ARIA_ATTR !== !1, be = T.ALLOW_DATA_ATTR !== !1, Nr = T.ALLOW_UNKNOWN_PROTOCOLS || !1, Sr = T.ALLOW_SELF_CLOSE_IN_ATTR !== !1, ke = T.SAFE_FOR_TEMPLATES || !1, $e = T.SAFE_FOR_XML !== !1, g = T.WHOLE_DOCUMENT || !1, rt = T.RETURN_DOM || !1, S = T.RETURN_DOM_FRAGMENT || !1, N = T.RETURN_TRUSTED_TYPE || !1, U = T.FORCE_BODY || !1, tt = T.SANITIZE_DOM !== !1, G = T.SANITIZE_NAMED_PROPS || !1, et = T.KEEP_CONTENT !== !1, J = T.IN_PLACE || !1, _e = g1(T.ALLOWED_URI_REGEXP) ? T.ALLOWED_URI_REGEXP : Eu, Ai = typeof T.NAMESPACE == "string" ? T.NAMESPACE : or, xa = Fa(T, "MATHML_TEXT_INTEGRATION_POINTS", () => Wt({}, eu)), Ca = Fa(T, "HTML_INTEGRATION_POINTS", () => Wt({}, ru));
    const P = Fa(T, "CUSTOM_ELEMENT_HANDLING", () => Ri(null));
    if (he = Ri(null), Le(P, "tagNameCheck") && iu(P.tagNameCheck) && (he.tagNameCheck = P.tagNameCheck), Le(P, "attributeNameCheck") && iu(P.attributeNameCheck) && (he.attributeNameCheck = P.attributeNameCheck), Le(P, "allowCustomizedBuiltInElements") && typeof P.allowCustomizedBuiltInElements == "boolean" && (he.allowCustomizedBuiltInElements = P.allowCustomizedBuiltInElements), ae(he), ke && (be = !1), S && (rt = !0), ct && (Dt = Wt({}, Bu), Ut = Ri(null), ct.html === !0 && (Wt(Dt, vu), Wt(Ut, Lu)), ct.svg === !0 && (Wt(Dt, Ba), Wt(Ut, Ea), Wt(Ut, Ro)), ct.svgFilters === !0 && (Wt(Dt, La), Wt(Ut, Ea), Wt(Ut, Ro)), ct.mathMl === !0 && (Wt(Dt, Aa), Wt(Ut, Au), Wt(Ut, Ro))), Ce.tagCheck = null, Ce.attributeCheck = null, Le(T, "ADD_TAGS") && (typeof T.ADD_TAGS == "function" ? Ce.tagCheck = T.ADD_TAGS : Ui(T.ADD_TAGS) && (Dt === kr && (Dt = Pe(Dt)), Wt(Dt, T.ADD_TAGS, Jt))), Le(T, "ADD_ATTR") && (typeof T.ADD_ATTR == "function" ? Ce.attributeCheck = T.ADD_ATTR : Ui(T.ADD_ATTR) && (Ut === ve && (Ut = Pe(Ut)), Wt(Ut, T.ADD_ATTR, Jt))), Le(T, "ADD_FORBID_CONTENTS") && Ui(T.ADD_FORBID_CONTENTS) && (ht === xt && (ht = Pe(ht)), Wt(ht, T.ADD_FORBID_CONTENTS, Jt)), et && (Dt["#text"] = !0), g && Wt(Dt, [
      "html",
      "head",
      "body"
    ]), Dt.table && (Wt(Dt, ["tbody"]), delete Ge.tbody), T.TRUSTED_TYPES_POLICY) {
      if (typeof T.TRUSTED_TYPES_POLICY.createHTML != "function") throw Wr('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof T.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Wr('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const it = z;
      z = T.TRUSTED_TYPES_POLICY;
      try {
        W = I("");
      } catch (nt) {
        throw z = it, nt;
      }
    } else T.TRUSTED_TYPES_POLICY === null ? (z = void 0, W = "") : (z === void 0 && (z = M()), z && typeof W == "string" && (W = I("")));
    oe && oe(T), Ei = T;
  }, su = Wt({}, [
    ...Ba,
    ...La,
    ...m1
  ]), ou = Wt({}, [...Aa, ...y1]), WC = function(T, P, it) {
    return P.namespaceURI === or ? T === "svg" : P.namespaceURI === ir ? T === "svg" && (it === "annotation-xml" || xa[it]) : !!su[T];
  }, zC = function(T, P, it) {
    return P.namespaceURI === or ? T === "math" : P.namespaceURI === sr ? T === "math" && Ca[it] : !!ou[T];
  }, HC = function(T, P, it) {
    return P.namespaceURI === sr && !Ca[it] || P.namespaceURI === ir && !xa[it] ? !1 : !ou[T] && (PC[T] || !su[T]);
  }, YC = function(T) {
    let P = C(T);
    (!P || !P.tagName) && (P = {
      namespaceURI: Ai,
      tagName: "template"
    });
    const it = zs(T.tagName), nt = zs(P.tagName);
    return ya[T.namespaceURI] ? T.namespaceURI === sr ? WC(it, P, nt) : T.namespaceURI === ir ? zC(it, P, nt) : T.namespaceURI === or ? HC(it, P, nt) : !!(vs === "application/xhtml+xml" && ya[T.namespaceURI]) : !1;
  }, qr = function(T) {
    As(t.removed, { element: T });
    try {
      C(T).removeChild(T);
    } catch {
      if (f(T), !C(T)) throw Wr("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, nu = function(T, P, it) {
    try {
      m(T, P);
    } catch {
      try {
        T.removeAttribute(it);
      } catch {
      }
    }
  }, Eo = function(T) {
    Fo(T);
    const P = x(T);
    if (P) {
      const nt = [];
      oi(P, (Tt) => {
        As(nt, Tt);
      }), oi(nt, (Tt) => {
        try {
          f(Tt);
        } catch {
        }
      });
    }
    const it = w(T);
    if (it) for (let nt = it.length - 1; nt >= 0; --nt) {
      const Tt = it[nt], It = Tt && Tt.name;
      typeof It == "string" && nu(T, Tt, It);
    }
  }, ti = function(T, P, it) {
    if (!it) try {
      it = P.getAttributeNode(T);
    } catch {
      it = null;
    }
    As(t.removed, {
      attribute: it || null,
      from: P
    });
    try {
      it ? m(P, it) : P.removeAttribute(T);
    } catch {
      try {
        P.removeAttribute(T);
      } catch {
      }
    }
    if (T === "is")
      if (rt || S) try {
        qr(P);
      } catch {
      }
      else try {
        P.setAttribute(T, "");
      } catch {
      }
  }, UC = function(T) {
    const P = w(T);
    if (P)
      for (let it = P.length - 1; it >= 0; --it) {
        const nt = P[it], Tt = nt && nt.name;
        typeof Tt != "string" || Ut[Jt(Tt)] || nu(T, nt, Tt);
      }
  }, Fo = function(T) {
    const P = [T];
    for (; P.length > 0; ) {
      const it = P.pop();
      A(it) === Ie.element && UC(it);
      const nt = x(it);
      if (nt) for (let Tt = nt.length - 1; Tt >= 0; --Tt) P.push(nt[Tt]);
    }
  }, au = function(T, P) {
    return $e ? T === "patchsrc" ? !0 : T === "for" && P !== "label" && P !== "output" : !1;
  }, jC = function(T) {
    if (!$e) return;
    const P = [T];
    for (; P.length > 0; ) {
      const it = P.pop(), nt = A(it);
      if (nt === Ie.processingInstruction || nt === Ie.comment && fe(Mu, it.data)) {
        try {
          f(it);
        } catch {
        }
        continue;
      }
      if (nt === Ie.element) {
        const It = it, Nt = Jt(L(it));
        try {
          It.hasAttribute && It.hasAttribute("patchsrc") && It.removeAttribute("patchsrc"), It.hasAttribute && It.hasAttribute("for") && au("for", Nt) && It.removeAttribute("for");
        } catch {
        }
      }
      const Tt = x(it);
      if (Tt) for (let It = Tt.length - 1; It >= 0; --It) P.push(Tt[It]);
    }
  }, lu = function(T) {
    let P = null, it = null;
    if (U) T = "<remove></remove>" + T;
    else {
      const It = wu(T, /^[\r\n\t ]+/);
      it = It && It[0];
    }
    vs === "application/xhtml+xml" && Ai === or && (T = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + T + "</body></html>");
    const nt = z ? I(T) : T;
    if (Ai === or) try {
      P = new c().parseFromString(nt, vs);
    } catch {
    }
    if (!P || !P.documentElement) {
      P = Q.createDocument(Ai, "template", null);
      try {
        P.documentElement.innerHTML = ma ? W : nt;
      } catch {
      }
    }
    const Tt = P.body || P.documentElement;
    return T && it && Tt.insertBefore(r.createTextNode(it), Tt.childNodes[0] || null), Ai === or ? wt.call(P, g ? "html" : "body")[0] : g ? P.documentElement : Tt;
  }, hu = function(T) {
    const P = E ? E(T) : T.ownerDocument;
    return Z.call(P || T, T, l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION, null);
  }, Mo = function(T) {
    return T = Es(T, kt, " "), T = Es(T, mt, " "), T = Es(T, _t, " "), T;
  }, ka = function(T) {
    var P;
    T.normalize();
    const it = E ? E(T) : T.ownerDocument, nt = Z.call(it || T, T, l.SHOW_TEXT | l.SHOW_COMMENT | l.SHOW_CDATA_SECTION | l.SHOW_PROCESSING_INSTRUCTION, null);
    let Tt = nt.nextNode();
    for (; Tt; )
      Tt.data = Mo(Tt.data), Tt = nt.nextNode();
    const It = (P = T.querySelectorAll) === null || P === void 0 ? void 0 : P.call(T, "template");
    It && oi(It, (Nt) => {
      Fi(Nt.content) && ka(Nt.content);
    });
  }, $o = function(T) {
    const P = v ? v(T) : null;
    return typeof P != "string" || Jt(P) !== "form" ? !1 : typeof T.nodeName != "string" || typeof T.textContent != "string" || typeof T.removeChild != "function" || T.attributes !== w(T) || typeof T.removeAttribute != "function" || typeof T.removeAttributeNode != "function" || typeof T.getAttributeNode != "function" || typeof T.setAttribute != "function" || typeof T.namespaceURI != "string" || typeof T.insertBefore != "function" || typeof T.hasChildNodes != "function" || T.nodeType !== _(T) || T.childNodes !== x(T);
  }, Fi = function(T) {
    if (!_ || typeof T != "object" || T === null) return !1;
    try {
      return _(T) === Ie.documentFragment;
    } catch {
      return !1;
    }
  }, Bs = function(T) {
    if (!_ || typeof T != "object" || T === null) return !1;
    try {
      return typeof _(T) == "number";
    } catch {
      return !1;
    }
  };
  function nr(ot, T, P) {
    ot.length !== 0 && oi(ot, (it) => {
      it.call(t, T, P, Ei);
    });
  }
  const XC = function(T, P) {
    return !!($e && T.hasChildNodes() && !Bs(T.firstElementChild) && fe(Fu, T.textContent) && fe(Fu, T.innerHTML) || $e && T.namespaceURI === or && A1[P] && (Bs(T.firstElementChild) || typeof T.textContent == "string" && fe(E1[P], T.textContent)) || T.nodeType === Ie.processingInstruction || $e && T.nodeType === Ie.comment && fe(Mu, T.data));
  }, Oo = function(T, P) {
    if (T instanceof RegExp) return fe(T, P);
    if (T instanceof Function) {
      for (var it = arguments.length, nt = new Array(it > 2 ? it - 2 : 0), Tt = 2; Tt < it; Tt++) nt[Tt - 2] = arguments[Tt];
      return !!T(P, ...nt);
    }
    return !1;
  }, GC = function(T, P, it) {
    if (!Ge[P] && fu(P) && Oo(he.tagNameCheck, P)) return !1;
    if (et && !ht[P]) {
      const nt = C(T), Tt = x(T);
      if (Tt && nt) {
        const It = Tt.length;
        for (let Nt = It - 1; Nt >= 0; --Nt) {
          const Zt = T === it ? d(Tt[Nt], !0) : Tt[Nt];
          nt.insertBefore(Zt, y(T));
        }
      }
    }
    return qr(T), !0;
  }, cu = function(T, P, it, nt) {
    return T.length === 0 ? P : P === it || P === nt ? Pe(P) : P;
  }, Mi = function(T, P) {
    return T === P || C(T) !== null ? !1 : (J && Fo(T), !0);
  }, uu = function(T, P) {
    if (nr(at.beforeSanitizeElements, T, null), Mi(T, P)) return !0;
    if ($o(T))
      return qr(T), !0;
    const it = Jt(L(T));
    if (Dt = cu(at.uponSanitizeElement, Dt, kr, X), nr(at.uponSanitizeElement, T, {
      tagName: it,
      allowedTags: Dt
    }), Mi(T, P)) return !0;
    if (XC(T, it))
      return qr(T), !0;
    if (Ge[it] || !(Ce.tagCheck instanceof Function && Ce.tagCheck(it)) && !Dt[it]) {
      const nt = GC(T, it, P);
      return nt === !1 && (nr(at.afterSanitizeElements, T, null), Mi(T, P)) ? !0 : nt;
    }
    if (A(T) === Ie.element && !YC(T) || (it === "noscript" || it === "noembed" || it === "noframes") && fe(B1, T.innerHTML))
      return qr(T), !0;
    if (ke && T.nodeType === Ie.text) {
      const nt = Mo(T.textContent);
      T.textContent !== nt && (As(t.removed, { element: T.cloneNode() }), T.textContent = nt);
    }
    return nr(at.afterSanitizeElements, T, null), Mi(T, P);
  }, du = function(T, P, it) {
    if (wr[P] || au(P, T) || tt && (P === "id" || P === "name") && (it in r || it in qC)) return !1;
    const nt = Ut[P] || Ce.attributeCheck instanceof Function && Ce.attributeCheck(P, T);
    return be && fe(Mt, P) || Rr && fe(Lt, P) ? !0 : nt ? Xt[P] || fe(_e, Es(it, zt, "")) || (P === "src" || P === "xlink:href" || P === "href") && T !== "script" && Su(it, "data:") === 0 && St[T] || Nr && !fe(qt, Es(it, zt, "")) ? !0 : !it : fu(T) && Oo(he.tagNameCheck, T) && Oo(he.attributeNameCheck, P, T) || P === "is" && he.allowCustomizedBuiltInElements && Oo(he.tagNameCheck, it);
  }, VC = Wt({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), fu = function(T) {
    return !VC[zs(T)] && fe(le, T);
  }, KC = function(T, P, it, nt) {
    if (z && typeof h == "object" && typeof h.getAttributeType == "function" && !it) switch (h.getAttributeType(T, P)) {
      case "TrustedHTML":
        return I(nt);
      case "TrustedScriptURL":
        return B(nt);
    }
    return nt;
  }, ZC = function(T, P, it, nt) {
    try {
      return it ? T.setAttributeNS(it, P, nt) : T.setAttribute(P, nt), $o(T) ? (qr(T), !1) : !0;
    } catch {
      return ti(P, T), !1;
    }
  }, pu = function(T, P) {
    if (nr(at.beforeSanitizeAttributes, T, null), Mi(T, P)) return;
    const it = T.attributes;
    if (!it || $o(T)) return;
    Ut = cu(at.uponSanitizeAttribute, Ut, ve, V);
    const nt = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: Ut,
      forceKeepAttr: void 0
    };
    let Tt = it.length;
    const It = Jt(T.nodeName);
    for (; Tt--; ) {
      const Nt = it[Tt], Zt = Nt.name, Ne = Nt.namespaceURI, Oe = Nt.value, $i = Jt(Zt), Sa = Oe;
      let we = Zt === "value" ? Sa : h1(Sa), gu = !1;
      if (nt.attrName = $i, nt.attrValue = we, nt.keepAttr = !0, nt.forceKeepAttr = void 0, nr(at.uponSanitizeAttribute, T, nt), we = nt.attrValue, G && ($i === "id" || $i === "name") && Su(we, K) !== 0 && (ti(Zt, T, Nt), we = K + we, gu = !0), $e && fe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, we)) {
        ti(Zt, T, Nt);
        continue;
      }
      if ($i === "attributename" && wu(we, "href")) {
        ti(Zt, T, Nt);
        continue;
      }
      if (!nt.forceKeepAttr) {
        if (!nt.keepAttr) {
          ti(Zt, T, Nt);
          continue;
        }
        if (!Sr && fe(L1, we)) {
          ti(Zt, T, Nt);
          continue;
        }
        if (ke && (we = Mo(we)), !du(It, $i, we)) {
          ti(Zt, T, Nt);
          continue;
        }
        we = KC(It, $i, Ne, we), we !== Sa && ZC(T, Zt, Ne, we) && gu && ku(t.removed);
      }
    }
    nr(at.afterSanitizeAttributes, T, null), Mi(T, P);
  }, Io = function(T) {
    let P = null;
    const it = hu(T);
    for (nr(at.beforeSanitizeShadowDOM, T, null); P = it.nextNode(); )
      if (nr(at.uponSanitizeShadowNode, P, null), uu(P, T), pu(P, T), Fi(P.content) && Io(P.content), A(P) === Ie.element) {
        const nt = b(P);
        Fi(nt) && (wa(nt), Io(nt));
      }
    nr(at.afterSanitizeShadowDOM, T, null);
  }, wa = function(T) {
    const P = [{
      node: T,
      shadow: null
    }];
    for (; P.length > 0; ) {
      const it = P.pop();
      if (it.shadow) {
        Io(it.shadow);
        continue;
      }
      const nt = it.node, Tt = A(nt) === Ie.element, It = x(nt);
      if (It) for (let Nt = It.length - 1; Nt >= 0; --Nt) P.push({
        node: It[Nt],
        shadow: null
      });
      if (Tt) {
        const Nt = v ? v(nt) : null;
        if (typeof Nt == "string" && Jt(Nt) === "template") {
          const Zt = nt.content;
          Fi(Zt) && P.push({
            node: Zt,
            shadow: null
          });
        }
      }
      if (Tt) {
        const Nt = b(nt);
        Fi(Nt) && P.push({
          node: null,
          shadow: Nt
        }, {
          node: Nt,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(ot) {
    let T = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, P = null, it = null, nt = null, Tt = null;
    if (ma = !ot, ma && (ot = "<!-->"), typeof ot != "string" && !Bs(ot) && (ot = p1(ot), typeof ot != "string"))
      throw Wr("dirty is not a string, aborting");
    if (!t.isSupported) return ot;
    D ? (Dt = X, Ut = V) : ba(T), (at.uponSanitizeElement.length > 0 || at.uponSanitizeAttribute.length > 0) && (Dt = Pe(Dt)), at.uponSanitizeAttribute.length > 0 && (Ut = Pe(Ut)), t.removed = [];
    const It = J && typeof ot != "string" && Bs(ot);
    if (It) {
      jC(ot);
      const Ne = L(ot);
      if (typeof Ne == "string") {
        const Oe = Jt(Ne);
        if (!Dt[Oe] || Ge[Oe])
          throw Eo(ot), Wr("root node is forbidden and cannot be sanitized in-place");
      }
      if ($o(ot))
        throw Eo(ot), Wr("root node is clobbered and cannot be sanitized in-place");
      try {
        wa(ot);
      } catch (Oe) {
        throw Eo(ot), Oe;
      }
    } else if (Bs(ot))
      P = lu("<!---->"), it = P.ownerDocument.importNode(ot, !0), it.nodeType === Ie.element && it.nodeName === "BODY" || it.nodeName === "HTML" ? P = it : P.appendChild(it), wa(P);
    else {
      if (!rt && !ke && !g && ot.indexOf("<") === -1) return z && N ? I(ot) : ot;
      if (P = lu(ot), !P) return rt ? null : N ? W : "";
    }
    P && U && qr(P.firstChild);
    const Nt = It ? ot : P;
    try {
      const Ne = hu(Nt);
      for (; nt = Ne.nextNode(); )
        uu(nt, Nt), pu(nt, Nt), Fi(nt.content) && Io(nt.content);
    } catch (Ne) {
      throw It && (Eo(ot), oi(t.removed, (Oe) => {
        Oe.element && Fo(Oe.element);
      })), Ne;
    }
    if (It) {
      let Ne = !1;
      if (oi(t.removed, (Oe) => {
        Oe.element && (Oe.element === ot && (Ne = !0), Fo(Oe.element));
      }), Ne) throw Wr("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return ke && ka(ot), ot;
    }
    if (rt) {
      if (ke && ka(P), S)
        for (Tt = dt.call(P.ownerDocument); P.firstChild; ) Tt.appendChild(P.firstChild);
      else Tt = P;
      return (Ut.shadowroot || Ut.shadowrootmode) && (Tt = yt.call(i, Tt, !0)), Tt;
    }
    let Zt = g ? P.outerHTML : P.innerHTML;
    return g && Dt["!doctype"] && P.ownerDocument && P.ownerDocument.doctype && P.ownerDocument.doctype.name && fe(_1, P.ownerDocument.doctype.name) && (Zt = "<!DOCTYPE " + P.ownerDocument.doctype.name + `>
` + Zt), ke && (Zt = Mo(Zt)), z && N ? I(Zt) : Zt;
  }, t.setConfig = function() {
    let ot = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    ba(ot), D = !0, X = Dt, V = Ut;
  }, t.clearConfig = function() {
    Ei = null, D = !1, X = null, V = null, z = R, W = "";
  }, t.isValidAttribute = function(ot, T, P) {
    Ei || ba({});
    const it = Jt(ot), nt = Jt(T);
    return du(it, nt, P);
  }, t.addHook = function(ot, T) {
    typeof T == "function" && Le(at, ot) && As(at[ot], T);
  }, t.removeHook = function(ot, T) {
    if (Le(at, ot)) {
      if (T !== void 0) {
        const P = a1(at[ot], T);
        return P === -1 ? void 0 : l1(at[ot], P, 1)[0];
      }
      return ku(at[ot]);
    }
  }, t.removeHooks = function(ot) {
    Le(at, ot) && (at[ot] = []);
  }, t.removeAllHooks = function() {
    at = $u();
  }, t;
}
var us = qp(), El = /* @__PURE__ */ p((e, t, { depth: r = 2 } = {}) => {
  const i = { depth: r };
  if (Array.isArray(t) && !Array.isArray(e))
    return t.forEach((s) => El(e, s, i)), e;
  if (Array.isArray(t) && Array.isArray(e))
    return t.forEach((s) => {
      e.includes(s) || e.push(s);
    }), e;
  if (e == null || r <= 0)
    return e != null && typeof e == "object" && typeof t == "object" ? Object.assign(e, t) : t;
  if (t != null && typeof e == "object" && typeof t == "object") {
    const s = e;
    Object.entries(t).forEach(([o, n]) => {
      if (typeof n == "object") {
        if (n === null)
          return;
        Object.hasOwn(e, o) || Object.defineProperty(e, o, {
          value: void 0,
          writable: !0,
          enumerable: !0,
          configurable: !0
        }), s[o] === void 0 && (s[o] = Array.isArray(n) ? [] : {}), typeof s[o] == "object" && (s[o] = El(s[o], n, { depth: r - 1 }));
      } else typeof s[o] != "object" && (Object.hasOwn(e, o) ? s[o] = n : Object.defineProperty(e, o, {
        value: n,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }));
    });
  }
  return e;
}, "assignWithDepth"), ne = El, mr = "#ffffff", yr = "#f2f2f2", Bt = /* @__PURE__ */ p((e, t) => t ? k(e, { s: -40, l: 10 }) : k(e, { s: -40, l: -10 }), "mkBorder"), Vi, $1 = (Vi = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#fff4dd", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.useGradient = !0, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || Bt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || Bt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || $(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || $(this.tertiaryColor), this.lineColor = this.lineColor || $(this.background), this.arrowheadColor = this.arrowheadColor || $(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || Y(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || $(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || H(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || "navy", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.darkMode ? (this.rowOdd = this.rowOdd || Y(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || Y(this.mainBkg, 10)) : (this.rowOdd = this.rowOdd || H(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || H(this.mainBkg, 5)), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || this.tertiaryColor, this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = Y(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = Y(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || $(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || H(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || Y(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = this["cScaleLabel" + r] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? k(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? k(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? k(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? k(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? k(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? k(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? k(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? k(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#8B0000",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#E8F5E9",
      complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
      chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
      clearBg: this.cynefin?.clearBg || "#FFF8E1",
      confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.background,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.background
    }, this.archEdgeColor = this.archEdgeColor || "#777", this.archEdgeArrowColor = this.archEdgeArrowColor || "#777", this.archEdgeWidth = this.archEdgeWidth || "3", this.archGroupBorderColor = this.archGroupBorderColor || "#000", this.archGroupBorderWidth = this.archGroupBorderWidth || "2px", this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Vi, "Theme"), Vi), O1 = /* @__PURE__ */ p((e) => {
  const t = new $1();
  return t.calculate(e), t;
}, "getThemeVariables"), Ki, I1 = (Ki = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = H(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = $(this.background), this.secondaryBorderColor = Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = Bt(this.tertiaryColor, this.darkMode), this.primaryTextColor = $(this.primaryColor), this.secondaryTextColor = $(this.secondaryColor), this.tertiaryTextColor = $(this.tertiaryColor), this.lineColor = $(this.background), this.textColor = $(this.background), this.mainBkg = "#1f2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = H($("#323D47"), 10), this.lineColor = "calculated", this.border1 = "#ccc", this.border2 = Vr(255, 255, 255, 0.25), this.arrowheadColor = "calculated", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#F9FFFE", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "calculated", this.activationBkgColor = "calculated", this.sequenceNumberColor = "black", this.clusterBkg = "#302F3D", this.sectionBkgColor = Y("#EAE8D9", 30), this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "#EAE8D9", this.excludeBkgColor = Y(this.sectionBkgColor, 10), this.taskBorderColor = Vr(255, 255, 255, 70), this.taskBkgColor = "calculated", this.taskTextColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = Vr(255, 255, 255, 50), this.activeTaskBkgColor = "#81B1DB", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "grey", this.critBorderColor = "#E83737", this.critBkgColor = "#E83737", this.taskTextDarkColor = "calculated", this.todayLineColor = "#DB5757", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = this.rowOdd || H(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || Y(this.mainBkg, 10), this.labelColor = "calculated", this.errorBkgColor = "#a44141", this.errorTextColor = "#ddd", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal";
  }
  updateColors() {
    this.secondBkg = H(this.mainBkg, 16), this.lineColor = this.mainContrastColor, this.arrowheadColor = this.mainContrastColor, this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.edgeLabelBackground = H(this.labelBackground, 25), this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.actorTextColor = this.mainContrastColor, this.actorLineColor = this.actorBorder, this.signalColor = this.mainContrastColor, this.signalTextColor = this.mainContrastColor, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.mainContrastColor, this.loopTextColor = this.mainContrastColor, this.noteBorderColor = this.secondaryBorderColor, this.noteBkgColor = this.secondBkg, this.noteTextColor = this.secondaryTextColor, this.activationBorderColor = this.border1, this.activationBkgColor = this.secondBkg, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.background, this.taskBkgColor = H(this.mainBkg, 23), this.taskTextColor = this.darkTextColor, this.taskTextLightColor = this.mainContrastColor, this.taskTextOutsideColor = this.taskTextLightColor, this.gridColor = this.mainContrastColor, this.doneTaskBkgColor = this.mainContrastColor, this.taskTextDarkColor = $(this.doneTaskBkgColor), this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#555", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#f4f4f4", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.cScale1 = this.cScale1 || "#0b0000", this.cScale2 = this.cScale2 || "#4d1037", this.cScale3 = this.cScale3 || "#3f5258", this.cScale4 = this.cScale4 || "#4f2f1b", this.cScale5 = this.cScale5 || "#6e0a0a", this.cScale6 = this.cScale6 || "#3b0048", this.cScale7 = this.cScale7 || "#995a01", this.cScale8 = this.cScale8 || "#154706", this.cScale9 = this.cScale9 || "#161722", this.cScale10 = this.cScale10 || "#00296f", this.cScale11 = this.cScale11 || "#01629c", this.cScale12 = this.cScale12 || "#010029", this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 });
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || $(this["cScale" + t]);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScalePeer" + t] = this["cScalePeer" + t] || H(this["cScale" + t], 10);
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(-10 + t * 4) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(-7 + t * 4) });
    this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["pie" + t] = this["cScale" + t];
    this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.mainContrastColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.mainContrastColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
    for (let t = 0; t < 8; t++)
      this["venn" + (t + 1)] = this["venn" + (t + 1)] ?? H(this["cScale" + t], 30);
    this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#FF6B6B",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#1B5E20",
      complicatedBg: this.cynefin?.complicatedBg || "#0D47A1",
      chaoticBg: this.cynefin?.chaoticBg || "#BF360C",
      clearBg: this.cynefin?.clearBg || "#F57F17",
      confusionBg: this.cynefin?.confusionBg || "#4A148C",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#3498db,#2ecc71,#e74c3c,#f1c40f,#bdc3c7,#ffffff,#34495e,#9b59b6,#1abc9c,#e67e22"
    }, this.packet = {
      startByteColor: this.primaryTextColor,
      endByteColor: this.primaryTextColor,
      labelColor: this.primaryTextColor,
      titleColor: this.primaryTextColor,
      blockStrokeColor: this.primaryTextColor,
      blockFillColor: this.background
    }, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#ff6b6b", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.mainBkg,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.mainBkg
    }, this.classText = this.primaryTextColor, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = H(this.secondaryColor, 20), this.git1 = H(this.pie2 || this.secondaryColor, 20), this.git2 = H(this.pie3 || this.tertiaryColor, 20), this.git3 = H(this.pie4 || k(this.primaryColor, { h: -30 }), 20), this.git4 = H(this.pie5 || k(this.primaryColor, { h: -60 }), 20), this.git5 = H(this.pie6 || k(this.primaryColor, { h: -90 }), 10), this.git6 = H(this.pie7 || k(this.primaryColor, { h: 60 }), 10), this.git7 = H(this.pie8 || k(this.primaryColor, { h: 120 }), 20), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || $(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || $(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "#2d2d2d", this.emUiStroke = this.emUiStroke || "#555", this.emProcessorFill = this.emProcessorFill || H("#5a3d5c", 10), this.emProcessorStroke = this.emProcessorStroke || "#8a6d8c", this.emReadModelFill = this.emReadModelFill || H("#3d5a2d", 10), this.emReadModelStroke = this.emReadModelStroke || "#6d8c5c", this.emCommandFill = this.emCommandFill || H("#2d3d5a", 10), this.emCommandStroke = this.emCommandStroke || "#5c6d8c", this.emEventFill = this.emEventFill || H("#5a452d", 10), this.emEventStroke = this.emEventStroke || "#8c755c", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || H(this.background, 5), this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || H(this.background, 12), this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || H(this.background, 12), this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || H(this.background, 2), this.nodeBorder = this.nodeBorder || "#999";
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Ki, "Theme"), Ki), D1 = /* @__PURE__ */ p((e) => {
  const t = new I1();
  return t.calculate(e), t;
}, "getThemeVariables"), Zi, P1 = (Zi = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#ECECFF", this.secondaryColor = k(this.primaryColor, { h: 120 }), this.secondaryColor = "#ffffde", this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = Bt(this.tertiaryColor, this.darkMode), this.primaryTextColor = $(this.primaryColor), this.secondaryTextColor = $(this.secondaryColor), this.tertiaryTextColor = $(this.tertiaryColor), this.lineColor = $(this.background), this.textColor = $(this.background), this.background = "white", this.mainBkg = "#ECECFF", this.secondBkg = "#ffffde", this.lineColor = "#333333", this.border1 = "#9370DB", this.primaryBorderColor = Bt(this.primaryColor, this.darkMode), this.border2 = "#aaaa33", this.arrowheadColor = "#333333", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.labelBackground = "rgba(232,232,232, 0.8)", this.textColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.clusterBkg = "#FBFBFF", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = this.taskTextDarkColor, this.taskTextClickableColor = "calculated", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBorderColor = "calculated", this.critBkgColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.sectionBkgColor = Vr(102, 102, 255, 0.49), this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#fff400", this.taskBorderColor = "#534fbc", this.taskBkgColor = "#8a90dd", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "#534fbc", this.activeTaskBkgColor = "#bfc7ff", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "navy", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = "calculated", this.rowEven = "calculated", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !1, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow(1px 2px 2px rgba(185, 185, 185, 1))", this.updateColors();
  }
  updateColors() {
    this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || Y(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || Y(this.tertiaryColor, 40);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScale" + t] = Y(this["cScale" + t], 10), this["cScalePeer" + t] = this["cScalePeer" + t] || Y(this["cScale" + t], 25);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || k(this["cScale" + t], { h: 180 });
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, l: -(7 + t * 5) });
    if (this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor, this.labelTextColor !== "calculated") {
      this.cScaleLabel0 = this.cScaleLabel0 || $(this.labelTextColor), this.cScaleLabel3 = this.cScaleLabel3 || $(this.labelTextColor);
      for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
        this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.labelTextColor;
    }
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.textColor, this.edgeLabelBackground = this.labelBackground, this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.signalColor = this.textColor, this.signalTextColor = this.textColor, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || H(this.primaryColor, 75) || "#ffffff", this.rowEven = this.rowEven || H(this.primaryColor, 1), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || k(this.tertiaryColor, { l: -40 }), this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -20 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -20 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -40 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: -40 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -40 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -90, l: -40 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -30 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? k(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? k(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? k(this.tertiaryColor, { l: -40 }), this.venn4 = this.venn4 ?? k(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? k(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? k(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? k(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? k(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#8B0000",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#E8F5E9",
      complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
      chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
      clearBg: this.cynefin?.clearBg || "#FFF8E1",
      confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.background,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.background
    }, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#ECECFF,#8493A6,#FFC3A0,#DCDDE1,#B8E994,#D1A36F,#C3CDE6,#FFB6C1,#496078,#F8F3E3"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.labelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || Y($(this.git0), 25), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || $(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || $(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (Object.keys(this).forEach((i) => {
      this[i] === "calculated" && (this[i] = void 0);
    }), typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Zi, "Theme"), Zi), R1 = /* @__PURE__ */ p((e) => {
  const t = new P1();
  return t.calculate(e), t;
}, "getThemeVariables"), Qi, N1 = (Qi = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#cde498", this.secondaryColor = "#cdffb2", this.background = "white", this.mainBkg = "#cde498", this.secondBkg = "#cdffb2", this.lineColor = "green", this.border1 = "#13540c", this.border2 = "#6eaa49", this.arrowheadColor = "green", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.tertiaryColor = H("#cde498", 10), this.primaryBorderColor = Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = Bt(this.tertiaryColor, this.darkMode), this.primaryTextColor = $(this.primaryColor), this.secondaryTextColor = $(this.secondaryColor), this.tertiaryTextColor = $(this.primaryColor), this.lineColor = $(this.background), this.textColor = $(this.background), this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#333", this.edgeLabelBackground = "#e8e8e8", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "#333", this.signalTextColor = "#333", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "#326932", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "#6eaa49", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#6eaa49", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "#487e3a", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.5))";
  }
  updateColors() {
    this.actorBorder = Y(this.mainBkg, 20), this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || Y(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || Y(this.tertiaryColor, 40);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScale" + t] = Y(this["cScale" + t], 10), this["cScalePeer" + t] = this["cScalePeer" + t] || Y(this["cScale" + t], 25);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || k(this["cScale" + t], { h: 180 });
    this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(8 + t * 5) });
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.taskBorderColor = this.border1, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || H(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || H(this.mainBkg, 20), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -30 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { h: 40, l: -40 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -50 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -50 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -50 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? k(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? k(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? k(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? k(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? k(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? k(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? k(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? k(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#8B4513",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#C8E6C9",
      complicatedBg: this.cynefin?.complicatedBg || "#DCEDC8",
      chaoticBg: this.cynefin?.chaoticBg || "#FFE0B2",
      clearBg: this.cynefin?.clearBg || "#FFF9C4",
      confusionBg: this.cynefin?.confusionBg || "#D7CCC8",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.packet = {
      startByteColor: this.primaryTextColor,
      endByteColor: this.primaryTextColor,
      labelColor: this.primaryTextColor,
      titleColor: this.primaryTextColor,
      blockStrokeColor: this.primaryTextColor,
      blockFillColor: this.mainBkg
    }, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.background,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.background
    }, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#CDE498,#FF6B6B,#A0D2DB,#D7BDE2,#F0F0F0,#FFC3A0,#7FD8BE,#FF9A8B,#FAF3E0,#FFF176"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || $(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || $(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Qi, "Theme"), Qi), q1 = /* @__PURE__ */ p((e) => {
  const t = new N1();
  return t.calculate(e), t;
}, "getThemeVariables"), Ji, W1 = (Ji = class {
  constructor() {
    this.primaryColor = "#eee", this.contrast = "#707070", this.secondaryColor = H(this.contrast, 55), this.background = "#ffffff", this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = Bt(this.tertiaryColor, this.darkMode), this.primaryTextColor = $(this.primaryColor), this.secondaryTextColor = $(this.secondaryColor), this.tertiaryTextColor = $(this.tertiaryColor), this.lineColor = $(this.background), this.textColor = $(this.background), this.mainBkg = "#eee", this.secondBkg = "calculated", this.lineColor = "#666", this.border1 = "#999", this.border2 = "calculated", this.note = "#ffa", this.text = "#333", this.critical = "#d42", this.done = "#bbb", this.arrowheadColor = "#333333", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "white", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = this.actorBorder, this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "calculated", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBkgColor = "calculated", this.critBorderColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.rowOdd = this.rowOdd || H(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || "#f4f4f4", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
  }
  updateColors() {
    this.secondBkg = H(this.contrast, 55), this.border2 = this.contrast, this.actorBorder = H(this.border1, 23), this.actorBkg = this.mainBkg, this.actorTextColor = this.text, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.signalColor = this.text, this.signalTextColor = this.text, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.text, this.loopTextColor = this.text, this.noteBorderColor = "#999", this.noteBkgColor = "#666", this.noteTextColor = "#fff", this.cScale0 = this.cScale0 || "#555", this.cScale1 = this.cScale1 || "#F4F4F4", this.cScale2 = this.cScale2 || "#555", this.cScale3 = this.cScale3 || "#BBB", this.cScale4 = this.cScale4 || "#777", this.cScale5 = this.cScale5 || "#999", this.cScale6 = this.cScale6 || "#DDD", this.cScale7 = this.cScale7 || "#FFF", this.cScale8 = this.cScale8 || "#DDD", this.cScale9 = this.cScale9 || "#BBB", this.cScale10 = this.cScale10 || "#999", this.cScale11 = this.cScale11 || "#777";
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || $(this["cScale" + t]);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this.darkMode ? this["cScalePeer" + t] = this["cScalePeer" + t] || H(this["cScale" + t], 10) : this["cScalePeer" + t] = this["cScalePeer" + t] || Y(this["cScale" + t], 10);
    this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.cScaleLabel0 = this.cScaleLabel0 || this.cScale1, this.cScaleLabel2 = this.cScaleLabel2 || this.cScale1;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { l: -(8 + t * 5) });
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.text, this.sectionBkgColor = H(this.contrast, 30), this.sectionBkgColor2 = H(this.contrast, 30), this.taskBorderColor = Y(this.contrast, 10), this.taskBkgColor = this.contrast, this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = this.text, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.gridColor = H(this.border1, 30), this.doneTaskBkgColor = this.done, this.doneTaskBorderColor = this.lineColor, this.critBkgColor = this.critical, this.critBorderColor = Y(this.critBkgColor, 10), this.todayLineColor = this.critBkgColor, this.vertLineColor = this.critBkgColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || "#000", this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f4f4f4", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.stateBorder = this.stateBorder || "#000", this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#222", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 });
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["pie" + t] = this["cScale" + t];
    this.pie12 = this.pie0, this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
    for (let t = 0; t < 8; t++)
      this["venn" + (t + 1)] = this["venn" + (t + 1)] ?? this["cScale" + t];
    this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#8B0000",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#E8F5E9",
      complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
      chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
      clearBg: this.cynefin?.clearBg || "#FFF8E1",
      confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#EEE,#6BB8E4,#8ACB88,#C7ACD6,#E8DCC2,#FFB2A8,#FFF380,#7E8D91,#FFD8B1,#FAF3E0"
    }, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.background,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.background
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = Y(this.pie1, 25) || this.primaryColor, this.git1 = this.pie2 || this.secondaryColor, this.git2 = this.pie3 || this.tertiaryColor, this.git3 = this.pie4 || k(this.primaryColor, { h: -30 }), this.git4 = this.pie5 || k(this.primaryColor, { h: -60 }), this.git5 = this.pie6 || k(this.primaryColor, { h: -90 }), this.git6 = this.pie7 || k(this.primaryColor, { h: 60 }), this.git7 = this.pie8 || k(this.primaryColor, { h: 120 }), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.branchLabelColor = this.branchLabelColor || this.labelTextColor, this.gitBranchLabel0 = this.branchLabelColor, this.gitBranchLabel1 = "white", this.gitBranchLabel2 = this.branchLabelColor, this.gitBranchLabel3 = "white", this.gitBranchLabel4 = this.branchLabelColor, this.gitBranchLabel5 = this.branchLabelColor, this.gitBranchLabel6 = this.branchLabelColor, this.gitBranchLabel7 = this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Ji, "Theme"), Ji), z1 = /* @__PURE__ */ p((e) => {
  const t = new W1();
  return t.calculate(e), t;
}, "getThemeVariables"), ts, H1 = (ts = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 2, this.primaryBorderColor = Bt(this.primaryColor, this.darkMode), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#000000", this.stateBorder = "#000000", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 0px 1px 2px rgba(0, 0, 0, 0.25));", this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || Bt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || Bt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || $(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || $(this.tertiaryColor), this.lineColor = this.lineColor || $(this.background), this.arrowheadColor = this.arrowheadColor || $(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || Y(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || $(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    if (this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || H(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || t, this.cScale1 = this.cScale1 || r, this.cScale2 = this.cScale2 || i, this.cScale3 = this.cScale3 || k(t, { h: 30 }), this.cScale4 = this.cScale4 || k(t, { h: 60 }), this.cScale5 = this.cScale5 || k(t, { h: 90 }), this.cScale6 = this.cScale6 || k(t, { h: 120 }), this.cScale7 = this.cScale7 || k(t, { h: 150 }), this.cScale8 = this.cScale8 || k(t, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(t, { h: 270 }), this.cScale10 = this.cScale10 || k(t, { h: 300 }), this.cScale11 = this.cScale11 || k(t, { h: 330 }), this.darkMode)
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = Y(this["cScale" + o], 75);
    else
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = Y(this["cScale" + o], 25);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || $(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || H(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || Y(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(ts, "Theme"), ts), Y1 = /* @__PURE__ */ p((e) => {
  const t = new H1();
  return t.calculate(e), t;
}, "getThemeVariables"), es, U1 = (es = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = H(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = $(this.background), this.secondaryBorderColor = Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = Bt(this.tertiaryColor, this.darkMode), this.primaryTextColor = $(this.primaryColor), this.secondaryTextColor = $(this.secondaryColor), this.tertiaryTextColor = $(this.tertiaryColor), this.mainBkg = "#2a2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = H($("#323D47"), 10), this.border1 = "#ccc", this.border2 = Vr(255, 255, 255, 0.25), this.arrowheadColor = $(this.background), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 1, this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.2))", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || Bt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || Bt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || $(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || $(this.tertiaryColor), this.lineColor = this.lineColor || $(this.background), this.arrowheadColor = this.arrowheadColor || $(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || Y(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || $(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || H(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = Y(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = Y(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || $(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || H(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || Y(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = this["cScaleLabel" + r] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || "#0b0000", this.git1 = this.git1 || "#4d1037", this.git2 = this.git2 || "#3f5258", this.git3 = this.git3 || "#4f2f1b", this.git4 = this.git4 || "#6e0a0a", this.git5 = this.git5 || "#3b0048", this.git6 = this.git6 || "#995a01", this.git7 = this.git7 || "#154706", this.gitDarkMode = !0, this.gitDarkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(es, "Theme"), es), j1 = /* @__PURE__ */ p((e) => {
  const t = new U1();
  return t.calculate(e), t;
}, "getThemeVariables"), rs, X1 = (rs = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = Bt("#28253D", this.darkMode), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.clusterBkg = "#F9F9FB", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.filterColor = "#000000";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || Bt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || Bt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#FEF9C3", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || $(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || $(this.tertiaryColor), this.lineColor = this.lineColor || $(this.background), this.arrowheadColor = this.arrowheadColor || $(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.noteFontWeight = 600, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || Y(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || $(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || H(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.compositeTitleBackground = "#F9F9FB", this.altBackground = "#F9F9FB", this.stateEdgeLabelBackground = "#FFFFFF", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScale" + o] = this.mainBkg;
    if (this.darkMode)
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = Y(this["cScale" + o], 75);
    else
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = Y(this["cScale" + o], 25);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || $(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || H(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || Y(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#FFFFFF", this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(rs, "Theme"), rs), G1 = /* @__PURE__ */ p((e) => {
  const t = new X1();
  return t.calculate(e), t;
}, "getThemeVariables"), is, V1 = (is = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = H(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = $(this.background), this.secondaryBorderColor = Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = Bt(this.tertiaryColor, this.darkMode), this.primaryTextColor = $(this.primaryColor), this.secondaryTextColor = $(this.secondaryColor), this.tertiaryTextColor = $(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = H($("#323D47"), 10), this.border1 = "#ccc", this.border2 = Vr(255, 255, 255, 0.25), this.arrowheadColor = $(this.background), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.filterColor = "#FFFFFF";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || Bt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || Bt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || $(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || $(this.tertiaryColor), this.lineColor = this.lineColor || $(this.background), this.arrowheadColor = this.arrowheadColor || $(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || Y(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || $(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || H(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.compositeBackground = "#16141F", this.altBackground = "#16141F", this.compositeTitleBackground = "#16141F", this.stateEdgeLabelBackground = "#16141F", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = Y(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = Y(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || $(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || H(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || Y(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = this["cScaleLabel" + r] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#16141F", this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(is, "Theme"), is), K1 = /* @__PURE__ */ p((e) => {
  const t = new V1();
  return t.calculate(e), t;
}, "getThemeVariables"), ss, Z1 = (ss = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = Bt(this.primaryColor, this.darkMode), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
      "#E879F9",
      //Fuchsia-400
      "#2DD4BF",
      //Teal-400
      "#FB923C",
      //Orange-400
      "#22D3EE",
      // Cyan-400
      "#4ADE80",
      // Green-400
      "#A78BFA",
      //Violet-400
      "#F87171",
      //red-400
      "#FACC15",
      //yellow-400
      "#818CF8",
      //indigo-400
      "#A3E635 ",
      //Lime-400
      "#38BDF8",
      //Sky-400
      "#FB7185"
      //Rose-400
    ], this.bkgColorArray = [
      "#FDF4FF",
      //Fuchsia-50
      "#F0FDFA",
      //Teal-50
      "#FFF7ED",
      //Orange-50
      "#ECFEFF",
      // Cyan-50
      "#F0FDF4",
      // Green-50
      "#F5F3FF",
      //Violet-50
      "#FEF2F2",
      //red-50
      "#FEFCE8",
      //yellow-50
      "#EEF2FF",
      //indigo-50
      "#F7FEE7",
      //Lime-50
      "#F0F9FF",
      //Sky-50
      "#FFF1F2"
      //Rose-50
    ], this.filterColor = "#000000";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || Bt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || Bt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || $(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || $(this.tertiaryColor), this.lineColor = this.lineColor || $(this.background), this.arrowheadColor = this.arrowheadColor || $(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || Y(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || $(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || H(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || $(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || H(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || Y(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.fontWeight = 600, this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(ss, "Theme"), ss), Q1 = /* @__PURE__ */ p((e) => {
  const t = new Z1();
  return t.calculate(e), t;
}, "getThemeVariables"), os, J1 = (os = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = H(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = $(this.background), this.secondaryBorderColor = Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = Bt(this.tertiaryColor, this.darkMode), this.primaryTextColor = $(this.primaryColor), this.secondaryTextColor = $(this.secondaryColor), this.tertiaryTextColor = $(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = H($("#323D47"), 10), this.border1 = "#ccc", this.border2 = Vr(255, 255, 255, 0.25), this.arrowheadColor = $(this.background), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
      "#E879F9",
      //Fuchsia-400
      "#2DD4BF",
      //Teal-400
      "#FB923C",
      //Orange-400
      "#22D3EE",
      // Cyan-400
      "#4ADE80",
      // Green-400
      "#A78BFA",
      //Violet-400
      "#F87171",
      //red-400
      "#FACC15",
      //yellow-400
      "#818CF8",
      //indigo-400
      "#A3E635 ",
      //Lime-400
      "#38BDF8",
      //Sky-400
      "#FB7185"
      //Rose-400
    ], this.bkgColorArray = [], this.filterColor = "#FFFFFF";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || Bt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || Bt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || Bt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || Bt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || $(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || $(this.tertiaryColor), this.lineColor = this.lineColor || $(this.background), this.arrowheadColor = this.arrowheadColor || $(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || Y(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || $(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.rootLabelColor = "#FFFFFF", this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || H(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || $(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || H(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || Y(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = Y(this["cScale" + r], 75);
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || tr(this.quadrant1Fill) ? H(this.quadrant1Fill) : Y(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? Y(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = H(this.git0, 25), this.git1 = H(this.git1, 25), this.git2 = H(this.git2, 25), this.git3 = H(this.git3, 25), this.git4 = H(this.git4, 25), this.git5 = H(this.git5, 25), this.git6 = H(this.git6, 25), this.git7 = H(this.git7, 25)) : (this.git0 = Y(this.git0, 25), this.git1 = Y(this.git1, 25), this.git2 = Y(this.git2, 25), this.git3 = Y(this.git3, 25), this.git4 = Y(this.git4, 25), this.git5 = Y(this.git5, 25), this.git6 = Y(this.git6, 25), this.git7 = Y(this.git7, 25)), this.gitInv0 = this.gitInv0 || $(this.git0), this.gitInv1 = this.gitInv1 || $(this.git1), this.gitInv2 = this.gitInv2 || $(this.git2), this.gitInv3 = this.gitInv3 || $(this.git3), this.gitInv4 = this.gitInv4 || $(this.git4), this.gitInv5 = this.gitInv5 || $(this.git5), this.gitInv6 = this.gitInv6 || $(this.git6), this.gitInv7 = this.gitInv7 || $(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.fontWeight = 600, this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || mr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || yr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(os, "Theme"), os), tk = /* @__PURE__ */ p((e) => {
  const t = new J1();
  return t.calculate(e), t;
}, "getThemeVariables"), Ar = {
  base: {
    getThemeVariables: O1
  },
  dark: {
    getThemeVariables: D1
  },
  default: {
    getThemeVariables: R1
  },
  forest: {
    getThemeVariables: q1
  },
  neutral: {
    getThemeVariables: z1
  },
  neo: {
    getThemeVariables: Y1
  },
  "neo-dark": {
    getThemeVariables: j1
  },
  redux: {
    getThemeVariables: G1
  },
  "redux-dark": {
    getThemeVariables: K1
  },
  "redux-color": {
    getThemeVariables: Q1
  },
  "redux-dark-color": {
    getThemeVariables: tk
  }
}, ce = {
  flowchart: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    subGraphTitleMargin: {
      top: 0,
      bottom: 0
    },
    diagramPadding: 8,
    htmlLabels: null,
    nodeSpacing: 50,
    rankSpacing: 50,
    curve: "basis",
    padding: 15,
    defaultRenderer: "dagre-wrapper",
    wrappingWidth: 200,
    inheritDir: !1
  },
  swimlane: {
    useMaxWidth: !0,
    lineHops: "arc",
    ignoreCrossLaneEdges: !0,
    optimizeRanksByCrossings: !0,
    automaticLaneOrdering: !1
  },
  sequence: {
    useMaxWidth: !0,
    hideUnusedParticipants: !1,
    activationWidth: 10,
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    mirrorActors: !0,
    forceMenus: !1,
    bottomMarginAdj: 1,
    rightAngles: !1,
    showSequenceNumbers: !1,
    actorFontSize: 14,
    actorFontFamily: '"Open Sans", sans-serif',
    actorFontWeight: 400,
    noteFontSize: 14,
    noteFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    noteFontWeight: 400,
    noteAlign: "center",
    messageFontSize: 16,
    messageFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    messageFontWeight: 400,
    wrap: !1,
    wrapPadding: 10,
    labelBoxWidth: 50,
    labelBoxHeight: 20
  },
  gantt: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4,
    topPadding: 50,
    rightPadding: 75,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    sectionFontSize: 11,
    numberSectionStyles: 4,
    axisFormat: "%Y-%m-%d",
    topAxis: !1,
    displayMode: "",
    weekday: "sunday"
  },
  journey: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    leftMargin: 150,
    maxLabelWidth: 360,
    width: 150,
    height: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    bottomMarginAdj: 1,
    rightAngles: !1,
    taskFontSize: 14,
    taskFontFamily: '"Open Sans", sans-serif',
    taskMargin: 50,
    activationWidth: 10,
    textPlacement: "fo",
    actorColours: [
      "#8FBC8F",
      "#7CFC00",
      "#00FFFF",
      "#20B2AA",
      "#B0E0E6",
      "#FFFFE0"
    ],
    sectionFills: [
      "#191970",
      "#8B008B",
      "#4B0082",
      "#2F4F4F",
      "#800000",
      "#8B4513",
      "#00008B"
    ],
    sectionColours: [
      "#fff"
    ],
    titleColor: "",
    titleFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    titleFontSize: "4ex"
  },
  class: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    arrowMarkerAbsolute: !1,
    dividerMargin: 10,
    padding: 5,
    textHeight: 10,
    defaultRenderer: "dagre-wrapper",
    htmlLabels: !1,
    hideEmptyMembersBox: !1,
    hierarchicalNamespaces: !0
  },
  state: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    dividerMargin: 10,
    sizeUnit: 5,
    padding: 8,
    textHeight: 10,
    titleShift: -15,
    noteMargin: 10,
    forkWidth: 70,
    forkHeight: 7,
    miniPadding: 2,
    fontSizeFactor: 5.02,
    fontSize: 24,
    labelHeight: 16,
    edgeLengthFactor: "20",
    compositTitleSize: 35,
    radius: 5,
    defaultRenderer: "dagre-wrapper"
  },
  er: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    diagramPadding: 20,
    layoutDirection: "TB",
    minEntityWidth: 100,
    minEntityHeight: 75,
    entityPadding: 15,
    nodeSpacing: 140,
    rankSpacing: 80,
    stroke: "gray",
    fill: "honeydew",
    fontSize: 12
  },
  pie: {
    useMaxWidth: !0,
    textPosition: 0.75,
    donutHole: 0,
    legendPosition: "right",
    highlightSlice: ""
  },
  quadrantChart: {
    useMaxWidth: !0,
    chartWidth: 500,
    chartHeight: 500,
    titleFontSize: 20,
    titlePadding: 10,
    quadrantPadding: 5,
    xAxisLabelPadding: 5,
    yAxisLabelPadding: 5,
    xAxisLabelFontSize: 16,
    yAxisLabelFontSize: 16,
    quadrantLabelFontSize: 16,
    quadrantTextTopPadding: 5,
    pointTextPadding: 5,
    pointLabelFontSize: 12,
    pointRadius: 5,
    xAxisPosition: "top",
    yAxisPosition: "left",
    quadrantInternalBorderStrokeWidth: 1,
    quadrantExternalBorderStrokeWidth: 2
  },
  xyChart: {
    useMaxWidth: !0,
    width: 700,
    height: 500,
    titleFontSize: 20,
    titlePadding: 10,
    showDataLabel: !1,
    showDataLabelOutsideBar: !1,
    showTitle: !0,
    showLegend: !0,
    legendFontSize: 14,
    legendPadding: 10,
    xAxis: {
      $ref: "#/$defs/XYChartAxisConfig",
      showLabel: !0,
      labelFontSize: 14,
      labelPadding: 5,
      showTitle: !0,
      titleFontSize: 16,
      titlePadding: 5,
      showTick: !0,
      tickLength: 5,
      tickWidth: 2,
      showAxisLine: !0,
      axisLineWidth: 2,
      labelRotation: 0
    },
    yAxis: {
      $ref: "#/$defs/XYChartAxisConfig",
      showLabel: !0,
      labelFontSize: 14,
      labelPadding: 5,
      showTitle: !0,
      titleFontSize: 16,
      titlePadding: 5,
      showTick: !0,
      tickLength: 5,
      tickWidth: 2,
      showAxisLine: !0,
      axisLineWidth: 2,
      labelRotation: 0
    },
    chartOrientation: "vertical",
    plotReservedSpacePercent: 50
  },
  requirement: {
    useMaxWidth: !0,
    rect_fill: "#f9f9f9",
    text_color: "#333",
    rect_border_size: "0.5px",
    rect_border_color: "#bbb",
    rect_min_width: 200,
    rect_min_height: 200,
    fontSize: 14,
    rect_padding: 10,
    line_height: 20
  },
  mindmap: {
    useMaxWidth: !0,
    padding: 10,
    maxNodeWidth: 200,
    layoutAlgorithm: "cose-bilkent"
  },
  ishikawa: {
    useMaxWidth: !0,
    diagramPadding: 20
  },
  kanban: {
    useMaxWidth: !0,
    padding: 8,
    sectionWidth: 200,
    ticketBaseUrl: ""
  },
  timeline: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    leftMargin: 150,
    width: 150,
    height: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    bottomMarginAdj: 1,
    rightAngles: !1,
    taskFontSize: 14,
    taskFontFamily: '"Open Sans", sans-serif',
    taskMargin: 50,
    activationWidth: 10,
    textPlacement: "fo",
    actorColours: [
      "#8FBC8F",
      "#7CFC00",
      "#00FFFF",
      "#20B2AA",
      "#B0E0E6",
      "#FFFFE0"
    ],
    sectionFills: [
      "#191970",
      "#8B008B",
      "#4B0082",
      "#2F4F4F",
      "#800000",
      "#8B4513",
      "#00008B"
    ],
    sectionColours: [
      "#fff"
    ],
    disableMulticolor: !1
  },
  gitGraph: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    diagramPadding: 8,
    nodeLabel: {
      width: 75,
      height: 100,
      x: -25,
      y: 0
    },
    mainBranchName: "main",
    mainBranchOrder: 0,
    showCommitLabel: !0,
    showBranches: !0,
    rotateCommitLabel: !0,
    parallelCommits: !1,
    arrowMarkerAbsolute: !1
  },
  c4: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    c4ShapeMargin: 50,
    c4ShapePadding: 20,
    width: 216,
    height: 60,
    boxMargin: 10,
    c4ShapeInRow: 4,
    nextLinePaddingX: 0,
    c4BoundaryInRow: 2,
    personFontSize: 14,
    personFontFamily: '"Open Sans", sans-serif',
    personFontWeight: "normal",
    external_personFontSize: 14,
    external_personFontFamily: '"Open Sans", sans-serif',
    external_personFontWeight: "normal",
    systemFontSize: 14,
    systemFontFamily: '"Open Sans", sans-serif',
    systemFontWeight: "normal",
    external_systemFontSize: 14,
    external_systemFontFamily: '"Open Sans", sans-serif',
    external_systemFontWeight: "normal",
    system_dbFontSize: 14,
    system_dbFontFamily: '"Open Sans", sans-serif',
    system_dbFontWeight: "normal",
    external_system_dbFontSize: 14,
    external_system_dbFontFamily: '"Open Sans", sans-serif',
    external_system_dbFontWeight: "normal",
    system_queueFontSize: 14,
    system_queueFontFamily: '"Open Sans", sans-serif',
    system_queueFontWeight: "normal",
    external_system_queueFontSize: 14,
    external_system_queueFontFamily: '"Open Sans", sans-serif',
    external_system_queueFontWeight: "normal",
    boundaryFontSize: 14,
    boundaryFontFamily: '"Open Sans", sans-serif',
    boundaryFontWeight: "normal",
    messageFontSize: 12,
    messageFontFamily: '"Open Sans", sans-serif',
    messageFontWeight: "normal",
    containerFontSize: 14,
    containerFontFamily: '"Open Sans", sans-serif',
    containerFontWeight: "normal",
    external_containerFontSize: 14,
    external_containerFontFamily: '"Open Sans", sans-serif',
    external_containerFontWeight: "normal",
    container_dbFontSize: 14,
    container_dbFontFamily: '"Open Sans", sans-serif',
    container_dbFontWeight: "normal",
    external_container_dbFontSize: 14,
    external_container_dbFontFamily: '"Open Sans", sans-serif',
    external_container_dbFontWeight: "normal",
    container_queueFontSize: 14,
    container_queueFontFamily: '"Open Sans", sans-serif',
    container_queueFontWeight: "normal",
    external_container_queueFontSize: 14,
    external_container_queueFontFamily: '"Open Sans", sans-serif',
    external_container_queueFontWeight: "normal",
    componentFontSize: 14,
    componentFontFamily: '"Open Sans", sans-serif',
    componentFontWeight: "normal",
    external_componentFontSize: 14,
    external_componentFontFamily: '"Open Sans", sans-serif',
    external_componentFontWeight: "normal",
    component_dbFontSize: 14,
    component_dbFontFamily: '"Open Sans", sans-serif',
    component_dbFontWeight: "normal",
    external_component_dbFontSize: 14,
    external_component_dbFontFamily: '"Open Sans", sans-serif',
    external_component_dbFontWeight: "normal",
    component_queueFontSize: 14,
    component_queueFontFamily: '"Open Sans", sans-serif',
    component_queueFontWeight: "normal",
    external_component_queueFontSize: 14,
    external_component_queueFontFamily: '"Open Sans", sans-serif',
    external_component_queueFontWeight: "normal",
    wrap: !0,
    wrapPadding: 10,
    person_bg_color: "#08427B",
    person_border_color: "#073B6F",
    external_person_bg_color: "#686868",
    external_person_border_color: "#8A8A8A",
    system_bg_color: "#1168BD",
    system_border_color: "#3C7FC0",
    system_db_bg_color: "#1168BD",
    system_db_border_color: "#3C7FC0",
    system_queue_bg_color: "#1168BD",
    system_queue_border_color: "#3C7FC0",
    external_system_bg_color: "#999999",
    external_system_border_color: "#8A8A8A",
    external_system_db_bg_color: "#999999",
    external_system_db_border_color: "#8A8A8A",
    external_system_queue_bg_color: "#999999",
    external_system_queue_border_color: "#8A8A8A",
    container_bg_color: "#438DD5",
    container_border_color: "#3C7FC0",
    container_db_bg_color: "#438DD5",
    container_db_border_color: "#3C7FC0",
    container_queue_bg_color: "#438DD5",
    container_queue_border_color: "#3C7FC0",
    external_container_bg_color: "#B3B3B3",
    external_container_border_color: "#A6A6A6",
    external_container_db_bg_color: "#B3B3B3",
    external_container_db_border_color: "#A6A6A6",
    external_container_queue_bg_color: "#B3B3B3",
    external_container_queue_border_color: "#A6A6A6",
    component_bg_color: "#85BBF0",
    component_border_color: "#78A8D8",
    component_db_bg_color: "#85BBF0",
    component_db_border_color: "#78A8D8",
    component_queue_bg_color: "#85BBF0",
    component_queue_border_color: "#78A8D8",
    external_component_bg_color: "#CCCCCC",
    external_component_border_color: "#BFBFBF",
    external_component_db_bg_color: "#CCCCCC",
    external_component_db_border_color: "#BFBFBF",
    external_component_queue_bg_color: "#CCCCCC",
    external_component_queue_border_color: "#BFBFBF"
  },
  sankey: {
    useMaxWidth: !0,
    width: 600,
    height: 400,
    linkColor: "gradient",
    nodeAlignment: "justify",
    showValues: !0,
    prefix: "",
    suffix: "",
    nodeWidth: 10,
    nodePadding: 12,
    labelStyle: "legacy"
  },
  block: {
    useMaxWidth: !0,
    padding: 8
  },
  packet: {
    useMaxWidth: !0,
    rowHeight: 32,
    bitWidth: 32,
    bitsPerRow: 32,
    showBits: !0,
    paddingX: 5,
    paddingY: 5
  },
  treeView: {
    useMaxWidth: !0,
    rowIndent: 10,
    paddingX: 5,
    paddingY: 5,
    lineThickness: 1,
    showIcons: !1,
    defaultIconPack: "",
    filenameIcons: {},
    extensionIcons: {}
  },
  architecture: {
    useMaxWidth: !0,
    padding: 40,
    iconSize: 80,
    fontSize: 16,
    randomize: !1,
    nodeSeparation: 75,
    idealEdgeLengthMultiplier: 1.5,
    edgeElasticity: 0.45,
    numIter: 2500,
    seed: 1
  },
  eventmodeling: {
    useMaxWidth: !0,
    padding: 30,
    rowHeight: 32
  },
  radar: {
    useMaxWidth: !0,
    width: 600,
    height: 600,
    marginTop: 50,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 50,
    axisScaleFactor: 1,
    axisLabelFactor: 1.05,
    curveTension: 0.17
  },
  venn: {
    useMaxWidth: !0,
    width: 800,
    height: 450,
    padding: 8,
    useDebugLayout: !1
  },
  cynefin: {
    useMaxWidth: !0,
    width: 800,
    height: 600,
    padding: 40,
    showDomainDescriptions: !0,
    boundaryAmplitude: 8,
    seed: 0
  },
  theme: "default",
  look: "classic",
  handDrawnSeed: 0,
  layout: "dagre",
  maxTextSize: 5e4,
  maxEdges: 500,
  darkMode: !1,
  fontFamily: '"trebuchet ms", verdana, arial, sans-serif;',
  logLevel: 5,
  securityLevel: "strict",
  startOnLoad: !0,
  arrowMarkerAbsolute: !1,
  secure: [
    "secure",
    "securityLevel",
    "startOnLoad",
    "maxTextSize",
    "suppressErrorRendering",
    "maxEdges"
  ],
  legacyMathML: !1,
  forceLegacyMathML: !1,
  deterministicIds: !1,
  fontSize: 16,
  markdownAutoWrap: !0,
  suppressErrorRendering: !1
}, Wp = {
  ...ce,
  // Set, even though they're `undefined` so that `configKeys` finds these keys
  // TODO: Should we replace these with `null` so that they can go in the JSON Schema?
  deterministicIDSeed: void 0,
  elk: {
    // mergeEdges is needed here to be considered
    mergeEdges: !1,
    nodePlacementStrategy: "BRANDES_KOEPF",
    nodePlacementAlignment: "NONE",
    forceNodeModelOrder: !1,
    considerModelOrder: "NODES_AND_EDGES",
    keepEntryNodeOnTop: !1
  },
  themeCSS: void 0,
  // add non-JSON default config values
  themeVariables: Ar.default.getThemeVariables(),
  sequence: {
    ...ce.sequence,
    messageFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.messageFontFamily,
        fontSize: this.messageFontSize,
        fontWeight: this.messageFontWeight
      };
    }, "messageFont"),
    noteFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.noteFontFamily,
        fontSize: this.noteFontSize,
        fontWeight: this.noteFontWeight
      };
    }, "noteFont"),
    actorFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.actorFontFamily,
        fontSize: this.actorFontSize,
        fontWeight: this.actorFontWeight
      };
    }, "actorFont")
  },
  class: {
    defaultRenderer: "dagre-wrapper",
    hideEmptyMembersBox: !1,
    hierarchicalNamespaces: !0
    // `padding` is intentionally left undefined so the unified (v2) renderer keeps
    // its own node sizing — setting the schema default of 5 here would change class
    // node dimensions.
  },
  gantt: {
    ...ce.gantt,
    tickInterval: void 0,
    useWidth: void 0
    // can probably be removed since `configKeys` already includes this
  },
  c4: {
    ...ce.c4,
    useWidth: void 0,
    personFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.personFontFamily,
        fontSize: this.personFontSize,
        fontWeight: this.personFontWeight
      };
    }, "personFont"),
    flowchart: {
      ...ce.flowchart,
      inheritDir: !1
      // default to legacy behavior
    },
    external_personFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_personFontFamily,
        fontSize: this.external_personFontSize,
        fontWeight: this.external_personFontWeight
      };
    }, "external_personFont"),
    systemFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.systemFontFamily,
        fontSize: this.systemFontSize,
        fontWeight: this.systemFontWeight
      };
    }, "systemFont"),
    external_systemFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_systemFontFamily,
        fontSize: this.external_systemFontSize,
        fontWeight: this.external_systemFontWeight
      };
    }, "external_systemFont"),
    system_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.system_dbFontFamily,
        fontSize: this.system_dbFontSize,
        fontWeight: this.system_dbFontWeight
      };
    }, "system_dbFont"),
    external_system_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_system_dbFontFamily,
        fontSize: this.external_system_dbFontSize,
        fontWeight: this.external_system_dbFontWeight
      };
    }, "external_system_dbFont"),
    system_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.system_queueFontFamily,
        fontSize: this.system_queueFontSize,
        fontWeight: this.system_queueFontWeight
      };
    }, "system_queueFont"),
    external_system_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_system_queueFontFamily,
        fontSize: this.external_system_queueFontSize,
        fontWeight: this.external_system_queueFontWeight
      };
    }, "external_system_queueFont"),
    containerFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.containerFontFamily,
        fontSize: this.containerFontSize,
        fontWeight: this.containerFontWeight
      };
    }, "containerFont"),
    external_containerFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_containerFontFamily,
        fontSize: this.external_containerFontSize,
        fontWeight: this.external_containerFontWeight
      };
    }, "external_containerFont"),
    container_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.container_dbFontFamily,
        fontSize: this.container_dbFontSize,
        fontWeight: this.container_dbFontWeight
      };
    }, "container_dbFont"),
    external_container_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_container_dbFontFamily,
        fontSize: this.external_container_dbFontSize,
        fontWeight: this.external_container_dbFontWeight
      };
    }, "external_container_dbFont"),
    container_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.container_queueFontFamily,
        fontSize: this.container_queueFontSize,
        fontWeight: this.container_queueFontWeight
      };
    }, "container_queueFont"),
    external_container_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_container_queueFontFamily,
        fontSize: this.external_container_queueFontSize,
        fontWeight: this.external_container_queueFontWeight
      };
    }, "external_container_queueFont"),
    componentFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.componentFontFamily,
        fontSize: this.componentFontSize,
        fontWeight: this.componentFontWeight
      };
    }, "componentFont"),
    external_componentFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_componentFontFamily,
        fontSize: this.external_componentFontSize,
        fontWeight: this.external_componentFontWeight
      };
    }, "external_componentFont"),
    component_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.component_dbFontFamily,
        fontSize: this.component_dbFontSize,
        fontWeight: this.component_dbFontWeight
      };
    }, "component_dbFont"),
    external_component_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_component_dbFontFamily,
        fontSize: this.external_component_dbFontSize,
        fontWeight: this.external_component_dbFontWeight
      };
    }, "external_component_dbFont"),
    component_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.component_queueFontFamily,
        fontSize: this.component_queueFontSize,
        fontWeight: this.component_queueFontWeight
      };
    }, "component_queueFont"),
    external_component_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_component_queueFontFamily,
        fontSize: this.external_component_queueFontSize,
        fontWeight: this.external_component_queueFontWeight
      };
    }, "external_component_queueFont"),
    boundaryFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.boundaryFontFamily,
        fontSize: this.boundaryFontSize,
        fontWeight: this.boundaryFontWeight
      };
    }, "boundaryFont"),
    messageFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.messageFontFamily,
        fontSize: this.messageFontSize,
        fontWeight: this.messageFontWeight
      };
    }, "messageFont")
  },
  pie: {
    ...ce.pie,
    useWidth: 984
  },
  xyChart: {
    ...ce.xyChart,
    useWidth: void 0
  },
  requirement: {
    ...ce.requirement,
    useWidth: void 0
  },
  packet: {
    ...ce.packet
  },
  eventmodeling: {
    ...ce.eventmodeling
  },
  treeView: {
    ...ce.treeView,
    useWidth: void 0
  },
  radar: {
    ...ce.radar
  },
  railroad: {
    ...ce.railroad,
    // Railroad colors and typography derive from the active theme unless explicitly overridden.
    fontSize: void 0,
    fontFamily: void 0,
    terminalFill: void 0,
    terminalStroke: void 0,
    terminalTextColor: void 0,
    nonTerminalFill: void 0,
    nonTerminalStroke: void 0,
    nonTerminalTextColor: void 0,
    lineColor: void 0,
    markerFill: void 0,
    commentFill: void 0,
    commentStroke: void 0,
    commentTextColor: void 0,
    specialFill: void 0,
    specialStroke: void 0,
    ruleNameColor: void 0
  },
  ishikawa: {
    ...ce.ishikawa
  },
  sankey: {
    ...ce.sankey,
    // Set so that `configKeys` includes this key for sanitizeDirective
    nodeColors: void 0
  },
  treemap: {
    useMaxWidth: !0,
    padding: 10,
    diagramPadding: 8,
    showValues: !0,
    nodeWidth: 100,
    nodeHeight: 40,
    borderWidth: 1,
    valueFontSize: 12,
    labelFontSize: 14,
    valueFormat: ","
  },
  venn: {
    ...ce.venn
  },
  cynefin: {
    ...ce.cynefin
  }
}, zp = /* @__PURE__ */ p((e, t = "") => Object.keys(e).reduce((r, i) => Array.isArray(e[i]) ? r : typeof e[i] == "object" && e[i] !== null ? [...r, t + i, ...zp(e[i], "")] : [...r, t + i], []), "keyify"), ek = new Set(zp(Wp, "")), Hp = Wp, rk = {
  // CSS colors (sankey)
  nodeColors: /^#[\da-f]{3,8}$|^rgb\([\d\s%,.]+\)$|^hsl\([\d\s%,.]+\)$|^[a-z]+$/i,
  // iconify icon references (treeView filenameIcons/extensionIcons)
  filenameIcons: /^[\w-]+(?::[\w-]+)?$/,
  extensionIcons: /^[\w-]+(?::[\w-]+)?$/
}, ik = /* @__PURE__ */ p((e, t) => {
  for (const r of Object.keys(e)) {
    const i = e[r];
    (r.startsWith("__") || r.includes("proto") || r.includes("constr") || typeof i != "string" || !t.test(i)) && (q.debug("sanitize deleting dictionary entry:", r, i), delete e[r]);
  }
}, "sanitizeDictionaryConfig"), gn = /* @__PURE__ */ p((e) => {
  if (q.debug("sanitizeDirective called with", e), !(typeof e != "object" || e == null)) {
    if (Array.isArray(e)) {
      e.forEach((t) => gn(t));
      return;
    }
    for (const t of Object.keys(e)) {
      if (q.debug("Checking key", t), t.startsWith("__") || t.includes("proto") || t.includes("constr") || !ek.has(t) || e[t] == null) {
        q.debug("sanitize deleting key: ", t), delete e[t];
        continue;
      }
      if (typeof e[t] == "object") {
        const i = rk[t];
        i ? ik(e[t], i) : (q.debug("sanitizing object", t), gn(e[t]));
        continue;
      }
      const r = ["themeCSS", "fontFamily", "altFontFamily"];
      for (const i of r)
        t.includes(i) && (q.debug("sanitizing css option", t), e[t] = Yp(e[t]));
    }
    if (e.themeVariables)
      for (const t of Object.keys(e.themeVariables)) {
        const r = e.themeVariables[t];
        r?.match && !r.match(/^[\d "#%(),.;A-Za-z]+$/) && (e.themeVariables[t] = "");
      }
    q.debug("After sanitization", e);
  }
}, "sanitizeDirective"), Yp = /* @__PURE__ */ p((e) => {
  let t = 0, r = 0;
  for (const i of e) {
    if (t < r)
      return "{ /* ERROR: Unbalanced CSS */ }";
    i === "{" ? t++ : i === "}" && r++;
  }
  return t !== r ? "{ /* ERROR: Unbalanced CSS */ }" : e;
}, "sanitizeCss"), ds = Object.freeze(Hp), xr = /* @__PURE__ */ p((e) => !(e === !1 || ["false", "null", "0"].includes(String(e).trim().toLowerCase())), "evaluate"), Ae = ne({}, ds), mn, mi = [], to = ne({}, ds), ko = /* @__PURE__ */ p((e, t) => {
  let r = ne({}, e), i = {};
  for (const s of t)
    Xp(s), i = ne(i, s);
  if (r = ne(r, i), i.theme && i.theme in Ar) {
    const s = ne({}, mn), o = ne(
      s.themeVariables || {},
      i.themeVariables
    );
    r.theme && r.theme in Ar && (r.themeVariables = Ar[r.theme].getThemeVariables(o));
  }
  return to = r, hk(to), to;
}, "updateCurrentConfig"), sk = /* @__PURE__ */ p((e) => (Ae = ne({}, ds), Ae = ne(Ae, e), e.theme && Ar[e.theme] && (Ae.themeVariables = Ar[e.theme].getThemeVariables(e.themeVariables)), ko(Ae, mi), Ae), "setSiteConfig"), ok = /* @__PURE__ */ p((e) => {
  mn = ne({}, e);
}, "saveConfigFromInitialize"), nk = /* @__PURE__ */ p((e) => (Ae = ne(Ae, e), ko(Ae, mi), Ae), "updateSiteConfig"), Up = /* @__PURE__ */ p(() => ne({}, Ae), "getSiteConfig"), jp = /* @__PURE__ */ p((e) => (ko(to, [e]), Kt()), "setConfig"), Kt = /* @__PURE__ */ p(() => ne({}, to), "getConfig"), Xp = /* @__PURE__ */ p((e) => {
  e && (["secure", ...Ae.secure ?? []].forEach((t) => {
    Object.hasOwn(e, t) && (q.debug(`Denied attempt to modify a secure key ${t}`, e[t]), delete e[t]);
  }), Object.keys(e).forEach((t) => {
    t.startsWith("__") && delete e[t];
  }), Object.keys(e).forEach((t) => {
    typeof e[t] == "string" && (e[t].includes("<") || e[t].includes(">") || e[t].includes("url(data:")) && delete e[t], typeof e[t] == "object" && Xp(e[t]);
  }));
}, "sanitize"), ak = /* @__PURE__ */ p((e) => {
  gn(e), e.fontFamily && !e.themeVariables?.fontFamily && (e.themeVariables = {
    ...e.themeVariables,
    fontFamily: e.fontFamily
  }), mi.push(e), ko(Ae, mi);
}, "addDirective"), yn = /* @__PURE__ */ p((e = Ae) => {
  mi = [], ko(e, mi);
}, "reset"), lk = {
  LAZY_LOAD_DEPRECATED: "The configuration options lazyLoadedDiagrams and loadExternalDiagramsAtStartup are deprecated. Please use registerExternalDiagrams instead.",
  FLOWCHART_HTML_LABELS_DEPRECATED: "flowchart.htmlLabels is deprecated. Please use global htmlLabels instead."
}, Ou = {}, Gp = /* @__PURE__ */ p((e) => {
  Ou[e] || (q.warn(lk[e]), Ou[e] = !0);
}, "issueWarning"), hk = /* @__PURE__ */ p((e) => {
  e && (e.lazyLoadedDiagrams || e.loadExternalDiagramsAtStartup) && Gp("LAZY_LOAD_DEPRECATED");
}, "checkConfig"), dI = /* @__PURE__ */ p(() => {
  let e = {};
  mn && (e = ne(e, mn));
  for (const t of mi)
    e = ne(e, t);
  return e;
}, "getUserDefinedConfig"), ye = /* @__PURE__ */ p((e) => (e.flowchart?.htmlLabels != null && Gp("FLOWCHART_HTML_LABELS_DEPRECATED"), xr(e.htmlLabels ?? e.flowchart?.htmlLabels ?? !0)), "getEffectiveHtmlLabels"), Vp = /^([^\S\n\r]*)-{3}\s*[\n\r](.*?)[\n\r]\1-{3}\s*[\n\r]+/s, eo = /%{2}{\s*(?:(\w+)\s*:|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, ck = /\s*%%.*\n/gm, ns, Kp = (ns = class extends Error {
  constructor(t) {
    super(t), this.name = "UnknownDiagramError";
  }
}, p(ns, "UnknownDiagramError"), ns), yi = {}, vh = /* @__PURE__ */ p(function(e, t) {
  e = e.replace(Vp, "").replace(eo, "").replace(ck, `
`);
  for (const [r, { detector: i }] of Object.entries(yi))
    if (i(e, t))
      return r;
  throw new Kp(
    `No diagram type detected matching given configuration for text: ${e}`
  );
}, "detectType"), Fl = /* @__PURE__ */ p((...e) => {
  for (const { id: t, detector: r, loader: i } of e)
    Zp(t, r, i);
}, "registerLazyLoadedDiagrams"), Zp = /* @__PURE__ */ p((e, t, r) => {
  yi[e] && q.warn(`Detector with key ${e} already exists. Overwriting.`), yi[e] = { detector: t, loader: r }, q.debug(`Detector with key ${e} added${r ? " with loader" : ""}`);
}, "addDetector"), uk = /* @__PURE__ */ p((e) => yi[e].loader, "getDiagramLoader"), wo = /<br\s*\/?>/gi, dk = /* @__PURE__ */ p((e) => e ? tg(e).replace(/\\n/g, "#br#").split("#br#") : [""], "getRows"), fk = /* @__PURE__ */ (() => {
  let e = !1;
  return () => {
    e || (Qp(), e = !0);
  };
})();
function Qp() {
  const e = "data-temp-href-target";
  us.addHook("beforeSanitizeAttributes", (t) => {
    t.tagName === "A" && t.hasAttribute("target") && t.setAttribute(e, t.getAttribute("target") ?? "");
  }), us.addHook("afterSanitizeAttributes", (t) => {
    t.tagName === "A" && t.hasAttribute(e) && (t.setAttribute("target", t.getAttribute(e) ?? ""), t.removeAttribute(e), t.getAttribute("target") === "_blank" && t.setAttribute("rel", "noopener"));
  });
}
p(Qp, "setupDompurifyHooks");
var Jp = /* @__PURE__ */ p((e) => (fk(), us.sanitize(e)), "removeScript"), Iu = /* @__PURE__ */ p((e, t) => {
  if (ye(t)) {
    const r = t.securityLevel;
    r === "antiscript" || r === "strict" || r === "sandbox" ? e = Jp(e) : r !== "loose" && (e = tg(e), e = e.replace(/</g, "&lt;").replace(/>/g, "&gt;"), e = e.replace(/=/g, "&equals;"), e = yk(e));
  }
  return e;
}, "sanitizeMore"), He = /* @__PURE__ */ p((e, t) => e && (t.dompurifyConfig ? e = us.sanitize(Iu(e, t), t.dompurifyConfig).toString() : e = us.sanitize(Iu(e, t), {
  FORBID_TAGS: ["style"]
}).toString(), e), "sanitizeText"), pk = /* @__PURE__ */ p((e, t) => typeof e == "string" ? He(e, t) : e.flat().map((r) => He(r, t)), "sanitizeTextOrArray"), gk = /* @__PURE__ */ p((e) => wo.test(e), "hasBreaks"), mk = /* @__PURE__ */ p((e) => e.split(wo), "splitBreaks"), yk = /* @__PURE__ */ p((e) => e.replace(/#br#/g, "<br/>"), "placeholderToBreak"), tg = /* @__PURE__ */ p((e) => e.replace(wo, "#br#"), "breakToPlaceholder"), xk = /* @__PURE__ */ p((e) => {
  let t = "";
  return e && (t = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, t = CSS.escape(t)), t;
}, "getUrl"), Ck = /* @__PURE__ */ p(function(...e) {
  const t = e.filter((r) => !isNaN(r));
  return Math.max(...t);
}, "getMax"), bk = /* @__PURE__ */ p(function(...e) {
  const t = e.filter((r) => !isNaN(r));
  return Math.min(...t);
}, "getMin"), Du = /* @__PURE__ */ p(function(e) {
  const t = e.split(/(,)/), r = [];
  for (let i = 0; i < t.length; i++) {
    let s = t[i];
    if (s === "," && i > 0 && i + 1 < t.length) {
      const o = t[i - 1], n = t[i + 1];
      kk(o, n) && (s = o + "," + n, i++, r.pop());
    }
    r.push(wk(s));
  }
  return r.join("");
}, "parseGenericTypes"), Ml = /* @__PURE__ */ p((e, t) => Math.max(0, e.split(t).length - 1), "countOccurrence"), kk = /* @__PURE__ */ p((e, t) => {
  const r = Ml(e, "~"), i = Ml(t, "~");
  return r === 1 && i === 1;
}, "shouldCombineSets"), wk = /* @__PURE__ */ p((e) => {
  const t = Ml(e, "~");
  let r = !1;
  if (t <= 1)
    return e;
  t % 2 !== 0 && e.startsWith("~") && (e = e.substring(1), r = !0);
  const i = [...e];
  let s = i.indexOf("~"), o = i.lastIndexOf("~");
  for (; s !== -1 && o !== -1 && s !== o; )
    i[s] = "<", i[o] = ">", s = i.indexOf("~"), o = i.lastIndexOf("~");
  return r && i.unshift("~"), i.join("");
}, "processSet"), Pu = /* @__PURE__ */ p(() => window.MathMLElement !== void 0, "isMathMLSupported"), $l = /\$\$(.*?)\$\$/g, ao = /* @__PURE__ */ p((e) => (e.match($l)?.length ?? 0) > 0, "hasKatex"), fI = /* @__PURE__ */ p(async (e, t) => {
  const r = document.createElement("div");
  r.innerHTML = await eg(e, t), r.id = "katex-temp", r.style.visibility = "hidden", r.style.position = "absolute", r.style.top = "0", document.querySelector("body")?.insertAdjacentElement("beforeend", r);
  const s = { width: r.clientWidth, height: r.clientHeight };
  return r.remove(), s;
}, "calculateMathMLDimensions"), Sk = /* @__PURE__ */ p(async (e, t) => {
  if (!ao(e))
    return e;
  if (!(Pu() || t.legacyMathML || t.forceLegacyMathML))
    return e.replace($l, "MathML is unsupported in this environment.");
  {
    const { default: r } = await import("./katex-DVVuOJ76.js"), i = t.forceLegacyMathML || !Pu() && t.legacyMathML ? "htmlAndMathml" : "mathml";
    return e.split(wo).map(
      (s) => ao(s) ? `<div style="display: flex; align-items: center; justify-content: center; white-space: nowrap;">${s}</div>` : `<div>${s}</div>`
    ).join("").replace(
      $l,
      (s, o) => r.renderToString(o, {
        throwOnError: !0,
        displayMode: !0,
        output: i
      }).replace(/\n/g, " ").replace(/<annotation.*<\/annotation>/g, "")
    );
  }
}, "renderKatexUnsanitized"), eg = /* @__PURE__ */ p(async (e, t) => He(await Sk(e, t), t), "renderKatexSanitized"), So = {
  getRows: dk,
  sanitizeText: He,
  sanitizeTextOrArray: pk,
  hasBreaks: gk,
  splitBreaks: mk,
  lineBreakRegex: wo,
  removeScript: Jp,
  getUrl: xk,
  evaluate: xr,
  getMax: Ck,
  getMin: bk
}, Tk = /* @__PURE__ */ p(function(e, t) {
  for (let r of t)
    e.attr(r[0], r[1]);
}, "d3Attrs"), _k = /* @__PURE__ */ p(function(e, t, r) {
  let i = /* @__PURE__ */ new Map();
  return r ? (i.set("width", "100%"), i.set("style", `max-width: ${t}px;`)) : (i.set("height", e), i.set("width", t)), i;
}, "calculateSvgSizeAttrs"), rg = /* @__PURE__ */ p(function(e, t, r, i) {
  const s = _k(t, r, i);
  Tk(e, s);
}, "configureSvgSize"), vk = /* @__PURE__ */ p(function(e, t, r, i) {
  const s = t.node().getBBox(), o = s.width, n = s.height;
  q.info(`SVG bounds: ${o}x${n}`, s);
  let a = 0, l = 0;
  q.info(`Graph bounds: ${a}x${l}`, e), a = o + r * 2, l = n + r * 2, q.info(`Calculated bounds: ${a}x${l}`), rg(t, l, a, i);
  const c = `${s.x - r} ${s.y - r} ${s.width + 2 * r} ${s.height + 2 * r}`;
  t.attr("viewBox", c);
}, "setupGraphViewbox"), rn = {};
function Ol(e) {
  return [...e.cssRules].map((t) => t.cssText).join(`
`);
}
p(Ol, "cssStyleSheetToString");
var Bk = /* @__PURE__ */ p((e, t, r, i) => {
  let s = "";
  return e in rn && rn[e] ? s = rn[e]({ ...r, svgId: i }) : q.warn(`No theme found for ${e}`), `& {
    font-family: ${r.fontFamily};
    font-size: ${r.fontSize};
    fill: ${r.textColor}
  }
  @keyframes edge-animation-frame {
    from {
      stroke-dashoffset: 0;
    }
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  & .edge-animation-slow {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 50s linear infinite;
    stroke-linecap: round;
  }
  & .edge-animation-fast {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 20s linear infinite;
    stroke-linecap: round;
  }
  /* Classes common for multiple diagrams */

  & .error-icon {
    fill: ${r.errorBkgColor};
  }
  & .error-text {
    fill: ${r.errorTextColor};
    stroke: ${r.errorTextColor};
  }

  & .edge-thickness-normal {
    stroke-width: ${r.strokeWidth ?? 1}px;
  }
  & .edge-thickness-thick {
    stroke-width: 3.5px
  }
  & .edge-pattern-solid {
    stroke-dasharray: 0;
  }
  & .edge-thickness-invisible {
    stroke-width: 0;
    fill: none;
  }
  & .edge-pattern-dashed{
    stroke-dasharray: 3;
  }
  .edge-pattern-dotted {
    stroke-dasharray: 2;
  }

  & .marker {
    fill: ${r.lineColor};
    stroke: ${r.lineColor};
  }
  & .marker.cross {
    stroke: ${r.lineColor};
  }

  & svg {
    font-family: ${r.fontFamily};
    font-size: ${r.fontSize};
  }
   & p {
    margin: 0
   }

  ${s}
  .node .neo-node {
    stroke: ${r.nodeBorder};
  }

  [data-look="neo"].node rect, [data-look="neo"].cluster rect, [data-look="neo"].node polygon {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }
  [data-look="neo"].swimlane.cluster rect {
    filter: none;
  }


  [data-look="neo"].node path {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    stroke-width: ${r.strokeWidth ?? 1}px;
  }

  [data-look="neo"].node .outer-path {
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node .neo-line path {
    stroke: ${r.nodeBorder};
    filter: none;
  }

  [data-look="neo"].node circle{
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node circle .state-start{
    fill: #000000;
  }

  [data-look="neo"].icon-shape .icon {
    fill: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

    [data-look="neo"].icon-shape .icon-neo path {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  ${t}
`;
}, "getStyles"), Lk = /* @__PURE__ */ p((e, t) => {
  t !== void 0 && (rn[e] = t);
}, "addStylesForDiagram"), Ak = Bk, ig = {};
Wb(ig, {
  clear: () => Ek,
  getAccDescription: () => Ok,
  getAccTitle: () => Mk,
  getDiagramTitle: () => Dk,
  setAccDescription: () => $k,
  setAccTitle: () => Fk,
  setDiagramTitle: () => Ik
});
var Bh = "", Lh = "", Ah = "", Eh = /* @__PURE__ */ p((e) => He(e, Kt()), "sanitizeText"), Ek = /* @__PURE__ */ p(() => {
  Bh = "", Ah = "", Lh = "";
}, "clear"), Fk = /* @__PURE__ */ p((e) => {
  Bh = Eh(e).replace(/^\s+/g, "");
}, "setAccTitle"), Mk = /* @__PURE__ */ p(() => Bh, "getAccTitle"), $k = /* @__PURE__ */ p((e) => {
  Ah = Eh(e).replace(/\n\s+/g, `
`);
}, "setAccDescription"), Ok = /* @__PURE__ */ p(() => Ah, "getAccDescription"), Ik = /* @__PURE__ */ p((e) => {
  Lh = Eh(e);
}, "setDiagramTitle"), Dk = /* @__PURE__ */ p(() => Lh, "getDiagramTitle"), Ru = q, Pk = _h, Ot = Kt, pI = jp, gI = ds, Fh = /* @__PURE__ */ p((e) => He(e, Ot()), "sanitizeText"), Rk = vk, Nk = /* @__PURE__ */ p(() => ig, "getCommonDb"), xn = {}, Cn = /* @__PURE__ */ p((e, t, r) => {
  xn[e] && Ru.warn(`Diagram with id ${e} already registered. Overwriting.`), xn[e] = t, r && Zp(e, r), Lk(e, t.styles), t.injectUtils?.(
    Ru,
    Pk,
    Ot,
    Fh,
    Rk,
    Nk(),
    () => {
    }
  );
}, "registerDiagram"), Il = /* @__PURE__ */ p((e) => {
  if (e in xn)
    return xn[e];
  throw new qk(e);
}, "getDiagram"), as, qk = (as = class extends Error {
  constructor(t) {
    super(`Diagram ${t} not found.`);
  }
}, p(as, "DiagramNotFoundError"), as), Wk = { value: () => {
} };
function sg() {
  for (var e = 0, t = arguments.length, r = {}, i; e < t; ++e) {
    if (!(i = arguments[e] + "") || i in r || /[\s.]/.test(i)) throw new Error("illegal type: " + i);
    r[i] = [];
  }
  return new sn(r);
}
function sn(e) {
  this._ = e;
}
function zk(e, t) {
  return e.trim().split(/^|\s+/).map(function(r) {
    var i = "", s = r.indexOf(".");
    if (s >= 0 && (i = r.slice(s + 1), r = r.slice(0, s)), r && !t.hasOwnProperty(r)) throw new Error("unknown type: " + r);
    return { type: r, name: i };
  });
}
sn.prototype = sg.prototype = {
  constructor: sn,
  on: function(e, t) {
    var r = this._, i = zk(e + "", r), s, o = -1, n = i.length;
    if (arguments.length < 2) {
      for (; ++o < n; ) if ((s = (e = i[o]).type) && (s = Hk(r[s], e.name))) return s;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++o < n; )
      if (s = (e = i[o]).type) r[s] = Nu(r[s], e.name, t);
      else if (t == null) for (s in r) r[s] = Nu(r[s], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var r in t) e[r] = t[r].slice();
    return new sn(e);
  },
  call: function(e, t) {
    if ((s = arguments.length - 2) > 0) for (var r = new Array(s), i = 0, s, o; i < s; ++i) r[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (o = this._[e], i = 0, s = o.length; i < s; ++i) o[i].value.apply(t, r);
  },
  apply: function(e, t, r) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var i = this._[e], s = 0, o = i.length; s < o; ++s) i[s].value.apply(t, r);
  }
};
function Hk(e, t) {
  for (var r = 0, i = e.length, s; r < i; ++r)
    if ((s = e[r]).name === t)
      return s.value;
}
function Nu(e, t, r) {
  for (var i = 0, s = e.length; i < s; ++i)
    if (e[i].name === t) {
      e[i] = Wk, e = e.slice(0, i).concat(e.slice(i + 1));
      break;
    }
  return r != null && e.push({ name: t, value: r }), e;
}
var Dl = "http://www.w3.org/1999/xhtml";
const qu = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Dl,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function jn(e) {
  var t = e += "", r = t.indexOf(":");
  return r >= 0 && (t = e.slice(0, r)) !== "xmlns" && (e = e.slice(r + 1)), qu.hasOwnProperty(t) ? { space: qu[t], local: e } : e;
}
function Yk(e) {
  return function() {
    var t = this.ownerDocument, r = this.namespaceURI;
    return r === Dl && t.documentElement.namespaceURI === Dl ? t.createElement(e) : t.createElementNS(r, e);
  };
}
function Uk(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function og(e) {
  var t = jn(e);
  return (t.local ? Uk : Yk)(t);
}
function jk() {
}
function Mh(e) {
  return e == null ? jk : function() {
    return this.querySelector(e);
  };
}
function Xk(e) {
  typeof e != "function" && (e = Mh(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], n = o.length, a = i[s] = new Array(n), l, c, h = 0; h < n; ++h)
      (l = o[h]) && (c = e.call(l, l.__data__, h, o)) && ("__data__" in l && (c.__data__ = l.__data__), a[h] = c);
  return new Re(i, this._parents);
}
function Gk(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Vk() {
  return [];
}
function ng(e) {
  return e == null ? Vk : function() {
    return this.querySelectorAll(e);
  };
}
function Kk(e) {
  return function() {
    return Gk(e.apply(this, arguments));
  };
}
function Zk(e) {
  typeof e == "function" ? e = Kk(e) : e = ng(e);
  for (var t = this._groups, r = t.length, i = [], s = [], o = 0; o < r; ++o)
    for (var n = t[o], a = n.length, l, c = 0; c < a; ++c)
      (l = n[c]) && (i.push(e.call(l, l.__data__, c, n)), s.push(l));
  return new Re(i, s);
}
function ag(e) {
  return function() {
    return this.matches(e);
  };
}
function lg(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Qk = Array.prototype.find;
function Jk(e) {
  return function() {
    return Qk.call(this.children, e);
  };
}
function t2() {
  return this.firstElementChild;
}
function e2(e) {
  return this.select(e == null ? t2 : Jk(typeof e == "function" ? e : lg(e)));
}
var r2 = Array.prototype.filter;
function i2() {
  return Array.from(this.children);
}
function s2(e) {
  return function() {
    return r2.call(this.children, e);
  };
}
function o2(e) {
  return this.selectAll(e == null ? i2 : s2(typeof e == "function" ? e : lg(e)));
}
function n2(e) {
  typeof e != "function" && (e = ag(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], n = o.length, a = i[s] = [], l, c = 0; c < n; ++c)
      (l = o[c]) && e.call(l, l.__data__, c, o) && a.push(l);
  return new Re(i, this._parents);
}
function hg(e) {
  return new Array(e.length);
}
function a2() {
  return new Re(this._enter || this._groups.map(hg), this._parents);
}
function bn(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
bn.prototype = {
  constructor: bn,
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
function l2(e) {
  return function() {
    return e;
  };
}
function h2(e, t, r, i, s, o) {
  for (var n = 0, a, l = t.length, c = o.length; n < c; ++n)
    (a = t[n]) ? (a.__data__ = o[n], i[n] = a) : r[n] = new bn(e, o[n]);
  for (; n < l; ++n)
    (a = t[n]) && (s[n] = a);
}
function c2(e, t, r, i, s, o, n) {
  var a, l, c = /* @__PURE__ */ new Map(), h = t.length, u = o.length, d = new Array(h), f;
  for (a = 0; a < h; ++a)
    (l = t[a]) && (d[a] = f = n.call(l, l.__data__, a, t) + "", c.has(f) ? s[a] = l : c.set(f, l));
  for (a = 0; a < u; ++a)
    f = n.call(e, o[a], a, o) + "", (l = c.get(f)) ? (i[a] = l, l.__data__ = o[a], c.delete(f)) : r[a] = new bn(e, o[a]);
  for (a = 0; a < h; ++a)
    (l = t[a]) && c.get(d[a]) === l && (s[a] = l);
}
function u2(e) {
  return e.__data__;
}
function d2(e, t) {
  if (!arguments.length) return Array.from(this, u2);
  var r = t ? c2 : h2, i = this._parents, s = this._groups;
  typeof e != "function" && (e = l2(e));
  for (var o = s.length, n = new Array(o), a = new Array(o), l = new Array(o), c = 0; c < o; ++c) {
    var h = i[c], u = s[c], d = u.length, f = f2(e.call(h, h && h.__data__, c, i)), m = f.length, y = a[c] = new Array(m), x = n[c] = new Array(m), C = l[c] = new Array(d);
    r(h, u, y, x, C, f, t);
    for (var b = 0, w = 0, _, v; b < m; ++b)
      if (_ = y[b]) {
        for (b >= w && (w = b + 1); !(v = x[w]) && ++w < m; ) ;
        _._next = v || null;
      }
  }
  return n = new Re(n, i), n._enter = a, n._exit = l, n;
}
function f2(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function p2() {
  return new Re(this._exit || this._groups.map(hg), this._parents);
}
function g2(e, t, r) {
  var i = this.enter(), s = this, o = this.exit();
  return typeof e == "function" ? (i = e(i), i && (i = i.selection())) : i = i.append(e + ""), t != null && (s = t(s), s && (s = s.selection())), r == null ? o.remove() : r(o), i && s ? i.merge(s).order() : s;
}
function m2(e) {
  for (var t = e.selection ? e.selection() : e, r = this._groups, i = t._groups, s = r.length, o = i.length, n = Math.min(s, o), a = new Array(s), l = 0; l < n; ++l)
    for (var c = r[l], h = i[l], u = c.length, d = a[l] = new Array(u), f, m = 0; m < u; ++m)
      (f = c[m] || h[m]) && (d[m] = f);
  for (; l < s; ++l)
    a[l] = r[l];
  return new Re(a, this._parents);
}
function y2() {
  for (var e = this._groups, t = -1, r = e.length; ++t < r; )
    for (var i = e[t], s = i.length - 1, o = i[s], n; --s >= 0; )
      (n = i[s]) && (o && n.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(n, o), o = n);
  return this;
}
function x2(e) {
  e || (e = C2);
  function t(u, d) {
    return u && d ? e(u.__data__, d.__data__) : !u - !d;
  }
  for (var r = this._groups, i = r.length, s = new Array(i), o = 0; o < i; ++o) {
    for (var n = r[o], a = n.length, l = s[o] = new Array(a), c, h = 0; h < a; ++h)
      (c = n[h]) && (l[h] = c);
    l.sort(t);
  }
  return new Re(s, this._parents).order();
}
function C2(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function b2() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function k2() {
  return Array.from(this);
}
function w2() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t)
    for (var i = e[t], s = 0, o = i.length; s < o; ++s) {
      var n = i[s];
      if (n) return n;
    }
  return null;
}
function S2() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function T2() {
  return !this.node();
}
function _2(e) {
  for (var t = this._groups, r = 0, i = t.length; r < i; ++r)
    for (var s = t[r], o = 0, n = s.length, a; o < n; ++o)
      (a = s[o]) && e.call(a, a.__data__, o, s);
  return this;
}
function v2(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function B2(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function L2(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function A2(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function E2(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttribute(e) : this.setAttribute(e, r);
  };
}
function F2(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, r);
  };
}
function M2(e, t) {
  var r = jn(e);
  if (arguments.length < 2) {
    var i = this.node();
    return r.local ? i.getAttributeNS(r.space, r.local) : i.getAttribute(r);
  }
  return this.each((t == null ? r.local ? B2 : v2 : typeof t == "function" ? r.local ? F2 : E2 : r.local ? A2 : L2)(r, t));
}
function cg(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function $2(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function O2(e, t, r) {
  return function() {
    this.style.setProperty(e, t, r);
  };
}
function I2(e, t, r) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? this.style.removeProperty(e) : this.style.setProperty(e, i, r);
  };
}
function D2(e, t, r) {
  return arguments.length > 1 ? this.each((t == null ? $2 : typeof t == "function" ? I2 : O2)(e, t, r ?? "")) : fs(this.node(), e);
}
function fs(e, t) {
  return e.style.getPropertyValue(t) || cg(e).getComputedStyle(e, null).getPropertyValue(t);
}
function P2(e) {
  return function() {
    delete this[e];
  };
}
function R2(e, t) {
  return function() {
    this[e] = t;
  };
}
function N2(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? delete this[e] : this[e] = r;
  };
}
function q2(e, t) {
  return arguments.length > 1 ? this.each((t == null ? P2 : typeof t == "function" ? N2 : R2)(e, t)) : this.node()[e];
}
function ug(e) {
  return e.trim().split(/^|\s+/);
}
function $h(e) {
  return e.classList || new dg(e);
}
function dg(e) {
  this._node = e, this._names = ug(e.getAttribute("class") || "");
}
dg.prototype = {
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
function fg(e, t) {
  for (var r = $h(e), i = -1, s = t.length; ++i < s; ) r.add(t[i]);
}
function pg(e, t) {
  for (var r = $h(e), i = -1, s = t.length; ++i < s; ) r.remove(t[i]);
}
function W2(e) {
  return function() {
    fg(this, e);
  };
}
function z2(e) {
  return function() {
    pg(this, e);
  };
}
function H2(e, t) {
  return function() {
    (t.apply(this, arguments) ? fg : pg)(this, e);
  };
}
function Y2(e, t) {
  var r = ug(e + "");
  if (arguments.length < 2) {
    for (var i = $h(this.node()), s = -1, o = r.length; ++s < o; ) if (!i.contains(r[s])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? H2 : t ? W2 : z2)(r, t));
}
function U2() {
  this.textContent = "";
}
function j2(e) {
  return function() {
    this.textContent = e;
  };
}
function X2(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function G2(e) {
  return arguments.length ? this.each(e == null ? U2 : (typeof e == "function" ? X2 : j2)(e)) : this.node().textContent;
}
function V2() {
  this.innerHTML = "";
}
function K2(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Z2(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Q2(e) {
  return arguments.length ? this.each(e == null ? V2 : (typeof e == "function" ? Z2 : K2)(e)) : this.node().innerHTML;
}
function J2() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function tw() {
  return this.each(J2);
}
function ew() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function rw() {
  return this.each(ew);
}
function iw(e) {
  var t = typeof e == "function" ? e : og(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function sw() {
  return null;
}
function ow(e, t) {
  var r = typeof e == "function" ? e : og(e), i = t == null ? sw : typeof t == "function" ? t : Mh(t);
  return this.select(function() {
    return this.insertBefore(r.apply(this, arguments), i.apply(this, arguments) || null);
  });
}
function nw() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function aw() {
  return this.each(nw);
}
function lw() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function hw() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function cw(e) {
  return this.select(e ? hw : lw);
}
function uw(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function dw(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function fw(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var r = "", i = t.indexOf(".");
    return i >= 0 && (r = t.slice(i + 1), t = t.slice(0, i)), { type: t, name: r };
  });
}
function pw(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var r = 0, i = -1, s = t.length, o; r < s; ++r)
        o = t[r], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++i] = o;
      ++i ? t.length = i : delete this.__on;
    }
  };
}
function gw(e, t, r) {
  return function() {
    var i = this.__on, s, o = dw(t);
    if (i) {
      for (var n = 0, a = i.length; n < a; ++n)
        if ((s = i[n]).type === e.type && s.name === e.name) {
          this.removeEventListener(s.type, s.listener, s.options), this.addEventListener(s.type, s.listener = o, s.options = r), s.value = t;
          return;
        }
    }
    this.addEventListener(e.type, o, r), s = { type: e.type, name: e.name, value: t, listener: o, options: r }, i ? i.push(s) : this.__on = [s];
  };
}
function mw(e, t, r) {
  var i = fw(e + ""), s, o = i.length, n;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, c = a.length, h; l < c; ++l)
        for (s = 0, h = a[l]; s < o; ++s)
          if ((n = i[s]).type === h.type && n.name === h.name)
            return h.value;
    }
    return;
  }
  for (a = t ? gw : pw, s = 0; s < o; ++s) this.each(a(i[s], t, r));
  return this;
}
function gg(e, t, r) {
  var i = cg(e), s = i.CustomEvent;
  typeof s == "function" ? s = new s(t, r) : (s = i.document.createEvent("Event"), r ? (s.initEvent(t, r.bubbles, r.cancelable), s.detail = r.detail) : s.initEvent(t, !1, !1)), e.dispatchEvent(s);
}
function yw(e, t) {
  return function() {
    return gg(this, e, t);
  };
}
function xw(e, t) {
  return function() {
    return gg(this, e, t.apply(this, arguments));
  };
}
function Cw(e, t) {
  return this.each((typeof t == "function" ? xw : yw)(e, t));
}
function* bw() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t)
    for (var i = e[t], s = 0, o = i.length, n; s < o; ++s)
      (n = i[s]) && (yield n);
}
var mg = [null];
function Re(e, t) {
  this._groups = e, this._parents = t;
}
function To() {
  return new Re([[document.documentElement]], mg);
}
function kw() {
  return this;
}
Re.prototype = To.prototype = {
  constructor: Re,
  select: Xk,
  selectAll: Zk,
  selectChild: e2,
  selectChildren: o2,
  filter: n2,
  data: d2,
  enter: a2,
  exit: p2,
  join: g2,
  merge: m2,
  selection: kw,
  order: y2,
  sort: x2,
  call: b2,
  nodes: k2,
  node: w2,
  size: S2,
  empty: T2,
  each: _2,
  attr: M2,
  style: D2,
  property: q2,
  classed: Y2,
  text: G2,
  html: Q2,
  raise: tw,
  lower: rw,
  append: iw,
  insert: ow,
  remove: aw,
  clone: cw,
  datum: uw,
  on: mw,
  dispatch: Cw,
  [Symbol.iterator]: bw
};
function Et(e) {
  return typeof e == "string" ? new Re([[document.querySelector(e)]], [document.documentElement]) : new Re([[e]], mg);
}
function Oh(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function yg(e, t) {
  var r = Object.create(e.prototype);
  for (var i in t) r[i] = t[i];
  return r;
}
function _o() {
}
var lo = 0.7, kn = 1 / lo, ji = "\\s*([+-]?\\d+)\\s*", ho = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", fr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", ww = /^#([0-9a-f]{3,8})$/, Sw = new RegExp(`^rgb\\(${ji},${ji},${ji}\\)$`), Tw = new RegExp(`^rgb\\(${fr},${fr},${fr}\\)$`), _w = new RegExp(`^rgba\\(${ji},${ji},${ji},${ho}\\)$`), vw = new RegExp(`^rgba\\(${fr},${fr},${fr},${ho}\\)$`), Bw = new RegExp(`^hsl\\(${ho},${fr},${fr}\\)$`), Lw = new RegExp(`^hsla\\(${ho},${fr},${fr},${ho}\\)$`), Wu = {
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
Oh(_o, co, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: zu,
  // Deprecated! Use color.formatHex.
  formatHex: zu,
  formatHex8: Aw,
  formatHsl: Ew,
  formatRgb: Hu,
  toString: Hu
});
function zu() {
  return this.rgb().formatHex();
}
function Aw() {
  return this.rgb().formatHex8();
}
function Ew() {
  return xg(this).formatHsl();
}
function Hu() {
  return this.rgb().formatRgb();
}
function co(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = ww.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? Yu(t) : r === 3 ? new Ee(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? No(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? No(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Sw.exec(e)) ? new Ee(t[1], t[2], t[3], 1) : (t = Tw.exec(e)) ? new Ee(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = _w.exec(e)) ? No(t[1], t[2], t[3], t[4]) : (t = vw.exec(e)) ? No(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Bw.exec(e)) ? Xu(t[1], t[2] / 100, t[3] / 100, 1) : (t = Lw.exec(e)) ? Xu(t[1], t[2] / 100, t[3] / 100, t[4]) : Wu.hasOwnProperty(e) ? Yu(Wu[e]) : e === "transparent" ? new Ee(NaN, NaN, NaN, 0) : null;
}
function Yu(e) {
  return new Ee(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function No(e, t, r, i) {
  return i <= 0 && (e = t = r = NaN), new Ee(e, t, r, i);
}
function Fw(e) {
  return e instanceof _o || (e = co(e)), e ? (e = e.rgb(), new Ee(e.r, e.g, e.b, e.opacity)) : new Ee();
}
function Pl(e, t, r, i) {
  return arguments.length === 1 ? Fw(e) : new Ee(e, t, r, i ?? 1);
}
function Ee(e, t, r, i) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +i;
}
Oh(Ee, Pl, yg(_o, {
  brighter(e) {
    return e = e == null ? kn : Math.pow(kn, e), new Ee(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? lo : Math.pow(lo, e), new Ee(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ee(pi(this.r), pi(this.g), pi(this.b), wn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Uu,
  // Deprecated! Use color.formatHex.
  formatHex: Uu,
  formatHex8: Mw,
  formatRgb: ju,
  toString: ju
}));
function Uu() {
  return `#${hi(this.r)}${hi(this.g)}${hi(this.b)}`;
}
function Mw() {
  return `#${hi(this.r)}${hi(this.g)}${hi(this.b)}${hi((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ju() {
  const e = wn(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${pi(this.r)}, ${pi(this.g)}, ${pi(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function wn(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function pi(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function hi(e) {
  return e = pi(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Xu(e, t, r, i) {
  return i <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Qe(e, t, r, i);
}
function xg(e) {
  if (e instanceof Qe) return new Qe(e.h, e.s, e.l, e.opacity);
  if (e instanceof _o || (e = co(e)), !e) return new Qe();
  if (e instanceof Qe) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, i = e.b / 255, s = Math.min(t, r, i), o = Math.max(t, r, i), n = NaN, a = o - s, l = (o + s) / 2;
  return a ? (t === o ? n = (r - i) / a + (r < i) * 6 : r === o ? n = (i - t) / a + 2 : n = (t - r) / a + 4, a /= l < 0.5 ? o + s : 2 - o - s, n *= 60) : a = l > 0 && l < 1 ? 0 : n, new Qe(n, a, l, e.opacity);
}
function $w(e, t, r, i) {
  return arguments.length === 1 ? xg(e) : new Qe(e, t, r, i ?? 1);
}
function Qe(e, t, r, i) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +i;
}
Oh(Qe, $w, yg(_o, {
  brighter(e) {
    return e = e == null ? kn : Math.pow(kn, e), new Qe(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? lo : Math.pow(lo, e), new Qe(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, i = r + (r < 0.5 ? r : 1 - r) * t, s = 2 * r - i;
    return new Ee(
      Ma(e >= 240 ? e - 240 : e + 120, s, i),
      Ma(e, s, i),
      Ma(e < 120 ? e + 240 : e - 120, s, i),
      this.opacity
    );
  },
  clamp() {
    return new Qe(Gu(this.h), qo(this.s), qo(this.l), wn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = wn(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Gu(this.h)}, ${qo(this.s) * 100}%, ${qo(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Gu(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function qo(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Ma(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const Ih = (e) => () => e;
function Cg(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function Ow(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(i) {
    return Math.pow(e + i * t, r);
  };
}
function mI(e, t) {
  var r = t - e;
  return r ? Cg(e, r > 180 || r < -180 ? r - 360 * Math.round(r / 360) : r) : Ih(isNaN(e) ? t : e);
}
function Iw(e) {
  return (e = +e) == 1 ? bg : function(t, r) {
    return r - t ? Ow(t, r, e) : Ih(isNaN(t) ? r : t);
  };
}
function bg(e, t) {
  var r = t - e;
  return r ? Cg(e, r) : Ih(isNaN(e) ? t : e);
}
const Vu = (function e(t) {
  var r = Iw(t);
  function i(s, o) {
    var n = r((s = Pl(s)).r, (o = Pl(o)).r), a = r(s.g, o.g), l = r(s.b, o.b), c = bg(s.opacity, o.opacity);
    return function(h) {
      return s.r = n(h), s.g = a(h), s.b = l(h), s.opacity = c(h), s + "";
    };
  }
  return i.gamma = e, i;
})(1);
function Ur(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
var Rl = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, $a = new RegExp(Rl.source, "g");
function Dw(e) {
  return function() {
    return e;
  };
}
function Pw(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Rw(e, t) {
  var r = Rl.lastIndex = $a.lastIndex = 0, i, s, o, n = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (i = Rl.exec(e)) && (s = $a.exec(t)); )
    (o = s.index) > r && (o = t.slice(r, o), a[n] ? a[n] += o : a[++n] = o), (i = i[0]) === (s = s[0]) ? a[n] ? a[n] += s : a[++n] = s : (a[++n] = null, l.push({ i: n, x: Ur(i, s) })), r = $a.lastIndex;
  return r < t.length && (o = t.slice(r), a[n] ? a[n] += o : a[++n] = o), a.length < 2 ? l[0] ? Pw(l[0].x) : Dw(t) : (t = l.length, function(c) {
    for (var h = 0, u; h < t; ++h) a[(u = l[h]).i] = u.x(c);
    return a.join("");
  });
}
var Ku = 180 / Math.PI, Nl = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function kg(e, t, r, i, s, o) {
  var n, a, l;
  return (n = Math.sqrt(e * e + t * t)) && (e /= n, t /= n), (l = e * r + t * i) && (r -= e * l, i -= t * l), (a = Math.sqrt(r * r + i * i)) && (r /= a, i /= a, l /= a), e * i < t * r && (e = -e, t = -t, l = -l, n = -n), {
    translateX: s,
    translateY: o,
    rotate: Math.atan2(t, e) * Ku,
    skewX: Math.atan(l) * Ku,
    scaleX: n,
    scaleY: a
  };
}
var Wo;
function Nw(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Nl : kg(t.a, t.b, t.c, t.d, t.e, t.f);
}
function qw(e) {
  return e == null || (Wo || (Wo = document.createElementNS("http://www.w3.org/2000/svg", "g")), Wo.setAttribute("transform", e), !(e = Wo.transform.baseVal.consolidate())) ? Nl : (e = e.matrix, kg(e.a, e.b, e.c, e.d, e.e, e.f));
}
function wg(e, t, r, i) {
  function s(c) {
    return c.length ? c.pop() + " " : "";
  }
  function o(c, h, u, d, f, m) {
    if (c !== u || h !== d) {
      var y = f.push("translate(", null, t, null, r);
      m.push({ i: y - 4, x: Ur(c, u) }, { i: y - 2, x: Ur(h, d) });
    } else (u || d) && f.push("translate(" + u + t + d + r);
  }
  function n(c, h, u, d) {
    c !== h ? (c - h > 180 ? h += 360 : h - c > 180 && (c += 360), d.push({ i: u.push(s(u) + "rotate(", null, i) - 2, x: Ur(c, h) })) : h && u.push(s(u) + "rotate(" + h + i);
  }
  function a(c, h, u, d) {
    c !== h ? d.push({ i: u.push(s(u) + "skewX(", null, i) - 2, x: Ur(c, h) }) : h && u.push(s(u) + "skewX(" + h + i);
  }
  function l(c, h, u, d, f, m) {
    if (c !== u || h !== d) {
      var y = f.push(s(f) + "scale(", null, ",", null, ")");
      m.push({ i: y - 4, x: Ur(c, u) }, { i: y - 2, x: Ur(h, d) });
    } else (u !== 1 || d !== 1) && f.push(s(f) + "scale(" + u + "," + d + ")");
  }
  return function(c, h) {
    var u = [], d = [];
    return c = e(c), h = e(h), o(c.translateX, c.translateY, h.translateX, h.translateY, u, d), n(c.rotate, h.rotate, u, d), a(c.skewX, h.skewX, u, d), l(c.scaleX, c.scaleY, h.scaleX, h.scaleY, u, d), c = h = null, function(f) {
      for (var m = -1, y = d.length, x; ++m < y; ) u[(x = d[m]).i] = x.x(f);
      return u.join("");
    };
  };
}
var Ww = wg(Nw, "px, ", "px)", "deg)"), zw = wg(qw, ", ", ")", ")"), ps = 0, Hs = 0, Ms = 0, Sg = 1e3, Sn, Ys, Tn = 0, xi = 0, Xn = 0, uo = typeof performance == "object" && performance.now ? performance : Date, Tg = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Dh() {
  return xi || (Tg(Hw), xi = uo.now() + Xn);
}
function Hw() {
  xi = 0;
}
function _n() {
  this._call = this._time = this._next = null;
}
_n.prototype = _g.prototype = {
  constructor: _n,
  restart: function(e, t, r) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    r = (r == null ? Dh() : +r) + (t == null ? 0 : +t), !this._next && Ys !== this && (Ys ? Ys._next = this : Sn = this, Ys = this), this._call = e, this._time = r, ql();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ql());
  }
};
function _g(e, t, r) {
  var i = new _n();
  return i.restart(e, t, r), i;
}
function Yw() {
  Dh(), ++ps;
  for (var e = Sn, t; e; )
    (t = xi - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --ps;
}
function Zu() {
  xi = (Tn = uo.now()) + Xn, ps = Hs = 0;
  try {
    Yw();
  } finally {
    ps = 0, jw(), xi = 0;
  }
}
function Uw() {
  var e = uo.now(), t = e - Tn;
  t > Sg && (Xn -= t, Tn = e);
}
function jw() {
  for (var e, t = Sn, r, i = 1 / 0; t; )
    t._call ? (i > t._time && (i = t._time), e = t, t = t._next) : (r = t._next, t._next = null, t = e ? e._next = r : Sn = r);
  Ys = e, ql(i);
}
function ql(e) {
  if (!ps) {
    Hs && (Hs = clearTimeout(Hs));
    var t = e - xi;
    t > 24 ? (e < 1 / 0 && (Hs = setTimeout(Zu, e - uo.now() - Xn)), Ms && (Ms = clearInterval(Ms))) : (Ms || (Tn = uo.now(), Ms = setInterval(Uw, Sg)), ps = 1, Tg(Zu));
  }
}
function Qu(e, t, r) {
  var i = new _n();
  return t = t == null ? 0 : +t, i.restart((s) => {
    i.stop(), e(s + t);
  }, t, r), i;
}
var Xw = sg("start", "end", "cancel", "interrupt"), Gw = [], vg = 0, Ju = 1, Wl = 2, on = 3, td = 4, zl = 5, nn = 6;
function Gn(e, t, r, i, s, o) {
  var n = e.__transition;
  if (!n) e.__transition = {};
  else if (r in n) return;
  Vw(e, r, {
    name: t,
    index: i,
    // For context during callback.
    group: s,
    // For context during callback.
    on: Xw,
    tween: Gw,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: vg
  });
}
function Ph(e, t) {
  var r = er(e, t);
  if (r.state > vg) throw new Error("too late; already scheduled");
  return r;
}
function Cr(e, t) {
  var r = er(e, t);
  if (r.state > on) throw new Error("too late; already running");
  return r;
}
function er(e, t) {
  var r = e.__transition;
  if (!r || !(r = r[t])) throw new Error("transition not found");
  return r;
}
function Vw(e, t, r) {
  var i = e.__transition, s;
  i[t] = r, r.timer = _g(o, 0, r.time);
  function o(c) {
    r.state = Ju, r.timer.restart(n, r.delay, r.time), r.delay <= c && n(c - r.delay);
  }
  function n(c) {
    var h, u, d, f;
    if (r.state !== Ju) return l();
    for (h in i)
      if (f = i[h], f.name === r.name) {
        if (f.state === on) return Qu(n);
        f.state === td ? (f.state = nn, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete i[h]) : +h < t && (f.state = nn, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete i[h]);
      }
    if (Qu(function() {
      r.state === on && (r.state = td, r.timer.restart(a, r.delay, r.time), a(c));
    }), r.state = Wl, r.on.call("start", e, e.__data__, r.index, r.group), r.state === Wl) {
      for (r.state = on, s = new Array(d = r.tween.length), h = 0, u = -1; h < d; ++h)
        (f = r.tween[h].value.call(e, e.__data__, r.index, r.group)) && (s[++u] = f);
      s.length = u + 1;
    }
  }
  function a(c) {
    for (var h = c < r.duration ? r.ease.call(null, c / r.duration) : (r.timer.restart(l), r.state = zl, 1), u = -1, d = s.length; ++u < d; )
      s[u].call(e, h);
    r.state === zl && (r.on.call("end", e, e.__data__, r.index, r.group), l());
  }
  function l() {
    r.state = nn, r.timer.stop(), delete i[t];
    for (var c in i) return;
    delete e.__transition;
  }
}
function Kw(e, t) {
  var r = e.__transition, i, s, o = !0, n;
  if (r) {
    t = t == null ? null : t + "";
    for (n in r) {
      if ((i = r[n]).name !== t) {
        o = !1;
        continue;
      }
      s = i.state > Wl && i.state < zl, i.state = nn, i.timer.stop(), i.on.call(s ? "interrupt" : "cancel", e, e.__data__, i.index, i.group), delete r[n];
    }
    o && delete e.__transition;
  }
}
function Zw(e) {
  return this.each(function() {
    Kw(this, e);
  });
}
function Qw(e, t) {
  var r, i;
  return function() {
    var s = Cr(this, e), o = s.tween;
    if (o !== r) {
      i = r = o;
      for (var n = 0, a = i.length; n < a; ++n)
        if (i[n].name === t) {
          i = i.slice(), i.splice(n, 1);
          break;
        }
    }
    s.tween = i;
  };
}
function Jw(e, t, r) {
  var i, s;
  if (typeof r != "function") throw new Error();
  return function() {
    var o = Cr(this, e), n = o.tween;
    if (n !== i) {
      s = (i = n).slice();
      for (var a = { name: t, value: r }, l = 0, c = s.length; l < c; ++l)
        if (s[l].name === t) {
          s[l] = a;
          break;
        }
      l === c && s.push(a);
    }
    o.tween = s;
  };
}
function tS(e, t) {
  var r = this._id;
  if (e += "", arguments.length < 2) {
    for (var i = er(this.node(), r).tween, s = 0, o = i.length, n; s < o; ++s)
      if ((n = i[s]).name === e)
        return n.value;
    return null;
  }
  return this.each((t == null ? Qw : Jw)(r, e, t));
}
function Rh(e, t, r) {
  var i = e._id;
  return e.each(function() {
    var s = Cr(this, i);
    (s.value || (s.value = {}))[t] = r.apply(this, arguments);
  }), function(s) {
    return er(s, i).value[t];
  };
}
function Bg(e, t) {
  var r;
  return (typeof t == "number" ? Ur : t instanceof co ? Vu : (r = co(t)) ? (t = r, Vu) : Rw)(e, t);
}
function eS(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function rS(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function iS(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var n = this.getAttribute(e);
    return n === s ? null : n === i ? o : o = t(i = n, r);
  };
}
function sS(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var n = this.getAttributeNS(e.space, e.local);
    return n === s ? null : n === i ? o : o = t(i = n, r);
  };
}
function oS(e, t, r) {
  var i, s, o;
  return function() {
    var n, a = r(this), l;
    return a == null ? void this.removeAttribute(e) : (n = this.getAttribute(e), l = a + "", n === l ? null : n === i && l === s ? o : (s = l, o = t(i = n, a)));
  };
}
function nS(e, t, r) {
  var i, s, o;
  return function() {
    var n, a = r(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (n = this.getAttributeNS(e.space, e.local), l = a + "", n === l ? null : n === i && l === s ? o : (s = l, o = t(i = n, a)));
  };
}
function aS(e, t) {
  var r = jn(e), i = r === "transform" ? zw : Bg;
  return this.attrTween(e, typeof t == "function" ? (r.local ? nS : oS)(r, i, Rh(this, "attr." + e, t)) : t == null ? (r.local ? rS : eS)(r) : (r.local ? sS : iS)(r, i, t));
}
function lS(e, t) {
  return function(r) {
    this.setAttribute(e, t.call(this, r));
  };
}
function hS(e, t) {
  return function(r) {
    this.setAttributeNS(e.space, e.local, t.call(this, r));
  };
}
function cS(e, t) {
  var r, i;
  function s() {
    var o = t.apply(this, arguments);
    return o !== i && (r = (i = o) && hS(e, o)), r;
  }
  return s._value = t, s;
}
function uS(e, t) {
  var r, i;
  function s() {
    var o = t.apply(this, arguments);
    return o !== i && (r = (i = o) && lS(e, o)), r;
  }
  return s._value = t, s;
}
function dS(e, t) {
  var r = "attr." + e;
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  var i = jn(e);
  return this.tween(r, (i.local ? cS : uS)(i, t));
}
function fS(e, t) {
  return function() {
    Ph(this, e).delay = +t.apply(this, arguments);
  };
}
function pS(e, t) {
  return t = +t, function() {
    Ph(this, e).delay = t;
  };
}
function gS(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? fS : pS)(t, e)) : er(this.node(), t).delay;
}
function mS(e, t) {
  return function() {
    Cr(this, e).duration = +t.apply(this, arguments);
  };
}
function yS(e, t) {
  return t = +t, function() {
    Cr(this, e).duration = t;
  };
}
function xS(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? mS : yS)(t, e)) : er(this.node(), t).duration;
}
function CS(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Cr(this, e).ease = t;
  };
}
function bS(e) {
  var t = this._id;
  return arguments.length ? this.each(CS(t, e)) : er(this.node(), t).ease;
}
function kS(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    if (typeof r != "function") throw new Error();
    Cr(this, e).ease = r;
  };
}
function wS(e) {
  if (typeof e != "function") throw new Error();
  return this.each(kS(this._id, e));
}
function SS(e) {
  typeof e != "function" && (e = ag(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], n = o.length, a = i[s] = [], l, c = 0; c < n; ++c)
      (l = o[c]) && e.call(l, l.__data__, c, o) && a.push(l);
  return new Fr(i, this._parents, this._name, this._id);
}
function TS(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, r = e._groups, i = t.length, s = r.length, o = Math.min(i, s), n = new Array(i), a = 0; a < o; ++a)
    for (var l = t[a], c = r[a], h = l.length, u = n[a] = new Array(h), d, f = 0; f < h; ++f)
      (d = l[f] || c[f]) && (u[f] = d);
  for (; a < i; ++a)
    n[a] = t[a];
  return new Fr(n, this._parents, this._name, this._id);
}
function _S(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var r = t.indexOf(".");
    return r >= 0 && (t = t.slice(0, r)), !t || t === "start";
  });
}
function vS(e, t, r) {
  var i, s, o = _S(t) ? Ph : Cr;
  return function() {
    var n = o(this, e), a = n.on;
    a !== i && (s = (i = a).copy()).on(t, r), n.on = s;
  };
}
function BS(e, t) {
  var r = this._id;
  return arguments.length < 2 ? er(this.node(), r).on.on(e) : this.each(vS(r, e, t));
}
function LS(e) {
  return function() {
    var t = this.parentNode;
    for (var r in this.__transition) if (+r !== e) return;
    t && t.removeChild(this);
  };
}
function AS() {
  return this.on("end.remove", LS(this._id));
}
function ES(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = Mh(e));
  for (var i = this._groups, s = i.length, o = new Array(s), n = 0; n < s; ++n)
    for (var a = i[n], l = a.length, c = o[n] = new Array(l), h, u, d = 0; d < l; ++d)
      (h = a[d]) && (u = e.call(h, h.__data__, d, a)) && ("__data__" in h && (u.__data__ = h.__data__), c[d] = u, Gn(c[d], t, r, d, c, er(h, r)));
  return new Fr(o, this._parents, t, r);
}
function FS(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = ng(e));
  for (var i = this._groups, s = i.length, o = [], n = [], a = 0; a < s; ++a)
    for (var l = i[a], c = l.length, h, u = 0; u < c; ++u)
      if (h = l[u]) {
        for (var d = e.call(h, h.__data__, u, l), f, m = er(h, r), y = 0, x = d.length; y < x; ++y)
          (f = d[y]) && Gn(f, t, r, y, d, m);
        o.push(d), n.push(h);
      }
  return new Fr(o, n, t, r);
}
var MS = To.prototype.constructor;
function $S() {
  return new MS(this._groups, this._parents);
}
function OS(e, t) {
  var r, i, s;
  return function() {
    var o = fs(this, e), n = (this.style.removeProperty(e), fs(this, e));
    return o === n ? null : o === r && n === i ? s : s = t(r = o, i = n);
  };
}
function Lg(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function IS(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var n = fs(this, e);
    return n === s ? null : n === i ? o : o = t(i = n, r);
  };
}
function DS(e, t, r) {
  var i, s, o;
  return function() {
    var n = fs(this, e), a = r(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), fs(this, e))), n === l ? null : n === i && l === s ? o : (s = l, o = t(i = n, a));
  };
}
function PS(e, t) {
  var r, i, s, o = "style." + t, n = "end." + o, a;
  return function() {
    var l = Cr(this, e), c = l.on, h = l.value[o] == null ? a || (a = Lg(t)) : void 0;
    (c !== r || s !== h) && (i = (r = c).copy()).on(n, s = h), l.on = i;
  };
}
function RS(e, t, r) {
  var i = (e += "") == "transform" ? Ww : Bg;
  return t == null ? this.styleTween(e, OS(e, i)).on("end.style." + e, Lg(e)) : typeof t == "function" ? this.styleTween(e, DS(e, i, Rh(this, "style." + e, t))).each(PS(this._id, e)) : this.styleTween(e, IS(e, i, t), r).on("end.style." + e, null);
}
function NS(e, t, r) {
  return function(i) {
    this.style.setProperty(e, t.call(this, i), r);
  };
}
function qS(e, t, r) {
  var i, s;
  function o() {
    var n = t.apply(this, arguments);
    return n !== s && (i = (s = n) && NS(e, n, r)), i;
  }
  return o._value = t, o;
}
function WS(e, t, r) {
  var i = "style." + (e += "");
  if (arguments.length < 2) return (i = this.tween(i)) && i._value;
  if (t == null) return this.tween(i, null);
  if (typeof t != "function") throw new Error();
  return this.tween(i, qS(e, t, r ?? ""));
}
function zS(e) {
  return function() {
    this.textContent = e;
  };
}
function HS(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function YS(e) {
  return this.tween("text", typeof e == "function" ? HS(Rh(this, "text", e)) : zS(e == null ? "" : e + ""));
}
function US(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function jS(e) {
  var t, r;
  function i() {
    var s = e.apply(this, arguments);
    return s !== r && (t = (r = s) && US(s)), t;
  }
  return i._value = e, i;
}
function XS(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, jS(e));
}
function GS() {
  for (var e = this._name, t = this._id, r = Ag(), i = this._groups, s = i.length, o = 0; o < s; ++o)
    for (var n = i[o], a = n.length, l, c = 0; c < a; ++c)
      if (l = n[c]) {
        var h = er(l, t);
        Gn(l, e, r, c, n, {
          time: h.time + h.delay + h.duration,
          delay: 0,
          duration: h.duration,
          ease: h.ease
        });
      }
  return new Fr(i, this._parents, e, r);
}
function VS() {
  var e, t, r = this, i = r._id, s = r.size();
  return new Promise(function(o, n) {
    var a = { value: n }, l = { value: function() {
      --s === 0 && o();
    } };
    r.each(function() {
      var c = Cr(this, i), h = c.on;
      h !== e && (t = (e = h).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), s === 0 && o();
  });
}
var KS = 0;
function Fr(e, t, r, i) {
  this._groups = e, this._parents = t, this._name = r, this._id = i;
}
function Ag() {
  return ++KS;
}
var _r = To.prototype;
Fr.prototype = {
  constructor: Fr,
  select: ES,
  selectAll: FS,
  selectChild: _r.selectChild,
  selectChildren: _r.selectChildren,
  filter: SS,
  merge: TS,
  selection: $S,
  transition: GS,
  call: _r.call,
  nodes: _r.nodes,
  node: _r.node,
  size: _r.size,
  empty: _r.empty,
  each: _r.each,
  on: BS,
  attr: aS,
  attrTween: dS,
  style: RS,
  styleTween: WS,
  text: YS,
  textTween: XS,
  remove: AS,
  tween: tS,
  delay: gS,
  duration: xS,
  ease: bS,
  easeVarying: wS,
  end: VS,
  [Symbol.iterator]: _r[Symbol.iterator]
};
function ZS(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var QS = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: ZS
};
function JS(e, t) {
  for (var r; !(r = e.__transition) || !(r = r[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return r;
}
function tT(e) {
  var t, r;
  e instanceof Fr ? (t = e._id, e = e._name) : (t = Ag(), (r = QS).time = Dh(), e = e == null ? null : e + "");
  for (var i = this._groups, s = i.length, o = 0; o < s; ++o)
    for (var n = i[o], a = n.length, l, c = 0; c < a; ++c)
      (l = n[c]) && Gn(l, e, t, c, n, r || JS(l, t));
  return new Fr(i, this._parents, e, t);
}
To.prototype.interrupt = Zw;
To.prototype.transition = tT;
const Hl = Math.PI, Yl = 2 * Hl, ni = 1e-6, eT = Yl - ni;
function Eg(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function rT(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return Eg;
  const r = 10 ** t;
  return function(i) {
    this._ += i[0];
    for (let s = 1, o = i.length; s < o; ++s)
      this._ += Math.round(arguments[s] * r) / r + i[s];
  };
}
class iT {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? Eg : rT(t);
  }
  moveTo(t, r) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${this._x1 = +t},${this._y1 = +r}`;
  }
  quadraticCurveTo(t, r, i, s) {
    this._append`Q${+t},${+r},${this._x1 = +i},${this._y1 = +s}`;
  }
  bezierCurveTo(t, r, i, s, o, n) {
    this._append`C${+t},${+r},${+i},${+s},${this._x1 = +o},${this._y1 = +n}`;
  }
  arcTo(t, r, i, s, o) {
    if (t = +t, r = +r, i = +i, s = +s, o = +o, o < 0) throw new Error(`negative radius: ${o}`);
    let n = this._x1, a = this._y1, l = i - t, c = s - r, h = n - t, u = a - r, d = h * h + u * u;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (d > ni) if (!(Math.abs(u * l - c * h) > ni) || !o)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let f = i - n, m = s - a, y = l * l + c * c, x = f * f + m * m, C = Math.sqrt(y), b = Math.sqrt(d), w = o * Math.tan((Hl - Math.acos((y + d - x) / (2 * C * b))) / 2), _ = w / b, v = w / C;
      Math.abs(_ - 1) > ni && this._append`L${t + _ * h},${r + _ * u}`, this._append`A${o},${o},0,0,${+(u * f > h * m)},${this._x1 = t + v * l},${this._y1 = r + v * c}`;
    }
  }
  arc(t, r, i, s, o, n) {
    if (t = +t, r = +r, i = +i, n = !!n, i < 0) throw new Error(`negative radius: ${i}`);
    let a = i * Math.cos(s), l = i * Math.sin(s), c = t + a, h = r + l, u = 1 ^ n, d = n ? s - o : o - s;
    this._x1 === null ? this._append`M${c},${h}` : (Math.abs(this._x1 - c) > ni || Math.abs(this._y1 - h) > ni) && this._append`L${c},${h}`, i && (d < 0 && (d = d % Yl + Yl), d > eT ? this._append`A${i},${i},0,1,${u},${t - a},${r - l}A${i},${i},0,1,${u},${this._x1 = c},${this._y1 = h}` : d > ni && this._append`A${i},${i},0,${+(d >= Hl)},${u},${this._x1 = t + i * Math.cos(o)},${this._y1 = r + i * Math.sin(o)}`);
  }
  rect(t, r, i, s) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${i = +i}v${+s}h${-i}Z`;
  }
  toString() {
    return this._;
  }
}
function Oi(e) {
  return function() {
    return e;
  };
}
const yI = Math.abs, xI = Math.atan2, CI = Math.cos, bI = Math.max, kI = Math.min, wI = Math.sin, SI = Math.sqrt, ed = 1e-12, Nh = Math.PI, rd = Nh / 2, TI = 2 * Nh;
function _I(e) {
  return e > 1 ? 0 : e < -1 ? Nh : Math.acos(e);
}
function vI(e) {
  return e >= 1 ? rd : e <= -1 ? -rd : Math.asin(e);
}
function sT(e) {
  let t = 3;
  return e.digits = function(r) {
    if (!arguments.length) return t;
    if (r == null)
      t = null;
    else {
      const i = Math.floor(r);
      if (!(i >= 0)) throw new RangeError(`invalid digits: ${r}`);
      t = i;
    }
    return e;
  }, () => new iT(t);
}
function oT(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Fg(e) {
  this._context = e;
}
Fg.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function ro(e) {
  return new Fg(e);
}
function nT(e) {
  return e[0];
}
function aT(e) {
  return e[1];
}
function lT(e, t) {
  var r = Oi(!0), i = null, s = ro, o = null, n = sT(a);
  e = typeof e == "function" ? e : e === void 0 ? nT : Oi(e), t = typeof t == "function" ? t : t === void 0 ? aT : Oi(t);
  function a(l) {
    var c, h = (l = oT(l)).length, u, d = !1, f;
    for (i == null && (o = s(f = n())), c = 0; c <= h; ++c)
      !(c < h && r(u = l[c], c, l)) === d && ((d = !d) ? o.lineStart() : o.lineEnd()), d && o.point(+e(u, c, l), +t(u, c, l));
    if (f) return o = null, f + "" || null;
  }
  return a.x = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : Oi(+l), a) : e;
  }, a.y = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : Oi(+l), a) : t;
  }, a.defined = function(l) {
    return arguments.length ? (r = typeof l == "function" ? l : Oi(!!l), a) : r;
  }, a.curve = function(l) {
    return arguments.length ? (s = l, i != null && (o = s(i)), a) : s;
  }, a.context = function(l) {
    return arguments.length ? (l == null ? i = o = null : o = s(i = l), a) : i;
  }, a;
}
class Mg {
  constructor(t, r) {
    this._context = t, this._x = r;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  }
  point(t, r) {
    switch (t = +t, r = +r, this._point) {
      case 0: {
        this._point = 1, this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r);
        break;
      }
      case 1:
        this._point = 2;
      // falls through
      default: {
        this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + t) / 2, this._y0, this._x0, r, t, r) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + r) / 2, t, this._y0, t, r);
        break;
      }
    }
    this._x0 = t, this._y0 = r;
  }
}
function $g(e) {
  return new Mg(e, !0);
}
function Og(e) {
  return new Mg(e, !1);
}
function Kr() {
}
function vn(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function Vn(e) {
  this._context = e;
}
Vn.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        vn(this, this._x1, this._y1);
      // falls through
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      // falls through
      default:
        vn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function Ul(e) {
  return new Vn(e);
}
function Ig(e) {
  this._context = e;
}
Ig.prototype = {
  areaStart: Kr,
  areaEnd: Kr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x2 = e, this._y2 = t;
        break;
      case 1:
        this._point = 2, this._x3 = e, this._y3 = t;
        break;
      case 2:
        this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
        break;
      default:
        vn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function hT(e) {
  return new Ig(e);
}
function Dg(e) {
  this._context = e;
}
Dg.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6, i = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, i) : this._context.moveTo(r, i);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        vn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function cT(e) {
  return new Dg(e);
}
function Pg(e, t) {
  this._basis = new Vn(e), this._beta = t;
}
Pg.prototype = {
  lineStart: function() {
    this._x = [], this._y = [], this._basis.lineStart();
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length - 1;
    if (r > 0)
      for (var i = e[0], s = t[0], o = e[r] - i, n = t[r] - s, a = -1, l; ++a <= r; )
        l = a / r, this._basis.point(
          this._beta * e[a] + (1 - this._beta) * (i + l * o),
          this._beta * t[a] + (1 - this._beta) * (s + l * n)
        );
    this._x = this._y = null, this._basis.lineEnd();
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
const uT = (function e(t) {
  function r(i) {
    return t === 1 ? new Vn(i) : new Pg(i, t);
  }
  return r.beta = function(i) {
    return e(+i);
  }, r;
})(0.85);
function Bn(e, t, r) {
  e._context.bezierCurveTo(
    e._x1 + e._k * (e._x2 - e._x0),
    e._y1 + e._k * (e._y2 - e._y0),
    e._x2 + e._k * (e._x1 - t),
    e._y2 + e._k * (e._y1 - r),
    e._x2,
    e._y2
  );
}
function qh(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
qh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        Bn(this, this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2, this._x1 = e, this._y1 = t;
        break;
      case 2:
        this._point = 3;
      // falls through
      default:
        Bn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const Rg = (function e(t) {
  function r(i) {
    return new qh(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function Wh(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Wh.prototype = {
  areaStart: Kr,
  areaEnd: Kr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x3 = e, this._y3 = t;
        break;
      case 1:
        this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
        break;
      case 2:
        this._point = 3, this._x5 = e, this._y5 = t;
        break;
      default:
        Bn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const dT = (function e(t) {
  function r(i) {
    return new Wh(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function zh(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
zh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        Bn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const fT = (function e(t) {
  function r(i) {
    return new zh(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function Hh(e, t, r) {
  var i = e._x1, s = e._y1, o = e._x2, n = e._y2;
  if (e._l01_a > ed) {
    var a = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, l = 3 * e._l01_a * (e._l01_a + e._l12_a);
    i = (i * a - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / l, s = (s * a - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / l;
  }
  if (e._l23_a > ed) {
    var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, h = 3 * e._l23_a * (e._l23_a + e._l12_a);
    o = (o * c + e._x1 * e._l23_2a - t * e._l12_2a) / h, n = (n * c + e._y1 * e._l23_2a - r * e._l12_2a) / h;
  }
  e._context.bezierCurveTo(i, s, o, n, e._x2, e._y2);
}
function Ng(e, t) {
  this._context = e, this._alpha = t;
}
Ng.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      // falls through
      default:
        Hh(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const qg = (function e(t) {
  function r(i) {
    return t ? new Ng(i, t) : new qh(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function Wg(e, t) {
  this._context = e, this._alpha = t;
}
Wg.prototype = {
  areaStart: Kr,
  areaEnd: Kr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1, this._x3 = e, this._y3 = t;
        break;
      case 1:
        this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
        break;
      case 2:
        this._point = 3, this._x5 = e, this._y5 = t;
        break;
      default:
        Hh(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const pT = (function e(t) {
  function r(i) {
    return t ? new Wg(i, t) : new Wh(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function zg(e, t) {
  this._context = e, this._alpha = t;
}
zg.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        Hh(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const gT = (function e(t) {
  function r(i) {
    return t ? new zg(i, t) : new zh(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function Hg(e) {
  this._context = e;
}
Hg.prototype = {
  areaStart: Kr,
  areaEnd: Kr,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function mT(e) {
  return new Hg(e);
}
function id(e) {
  return e < 0 ? -1 : 1;
}
function sd(e, t, r) {
  var i = e._x1 - e._x0, s = t - e._x1, o = (e._y1 - e._y0) / (i || s < 0 && -0), n = (r - e._y1) / (s || i < 0 && -0), a = (o * s + n * i) / (i + s);
  return (id(o) + id(n)) * Math.min(Math.abs(o), Math.abs(n), 0.5 * Math.abs(a)) || 0;
}
function od(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function Oa(e, t, r) {
  var i = e._x0, s = e._y0, o = e._x1, n = e._y1, a = (o - i) / 3;
  e._context.bezierCurveTo(i + a, s + a * t, o - a, n - a * r, o, n);
}
function Ln(e) {
  this._context = e;
}
Ln.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Oa(this, this._t0, od(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var r = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, Oa(this, od(this, r = sd(this, e, t)), r);
          break;
        default:
          Oa(this, this._t0, r = sd(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function Yg(e) {
  this._context = new Ug(e);
}
(Yg.prototype = Object.create(Ln.prototype)).point = function(e, t) {
  Ln.prototype.point.call(this, t, e);
};
function Ug(e) {
  this._context = e;
}
Ug.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, r, i, s, o) {
    this._context.bezierCurveTo(t, e, i, r, o, s);
  }
};
function jg(e) {
  return new Ln(e);
}
function Xg(e) {
  return new Yg(e);
}
function Gg(e) {
  this._context = e;
}
Gg.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [], this._y = [];
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length;
    if (r)
      if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2)
        this._context.lineTo(e[1], t[1]);
      else
        for (var i = nd(e), s = nd(t), o = 0, n = 1; n < r; ++o, ++n)
          this._context.bezierCurveTo(i[0][o], s[0][o], i[1][o], s[1][o], e[n], t[n]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function nd(e) {
  var t, r = e.length - 1, i, s = new Array(r), o = new Array(r), n = new Array(r);
  for (s[0] = 0, o[0] = 2, n[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) s[t] = 1, o[t] = 4, n[t] = 4 * e[t] + 2 * e[t + 1];
  for (s[r - 1] = 2, o[r - 1] = 7, n[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) i = s[t] / o[t - 1], o[t] -= i, n[t] -= i * n[t - 1];
  for (s[r - 1] = n[r - 1] / o[r - 1], t = r - 2; t >= 0; --t) s[t] = (n[t] - s[t + 1]) / o[t];
  for (o[r - 1] = (e[r] + s[r - 1]) / 2, t = 0; t < r - 1; ++t) o[t] = 2 * e[t + 1] - s[t + 1];
  return [s, o];
}
function Vg(e) {
  return new Gg(e);
}
function Kn(e, t) {
  this._context = e, this._t = t;
}
Kn.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN, this._point = 0;
  },
  lineEnd: function() {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default: {
        if (this._t <= 0)
          this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(r, this._y), this._context.lineTo(r, t);
        }
        break;
      }
    }
    this._x = e, this._y = t;
  }
};
function Kg(e) {
  return new Kn(e, 0.5);
}
function Zg(e) {
  return new Kn(e, 0);
}
function Qg(e) {
  return new Kn(e, 1);
}
function Us(e, t, r) {
  this.k = e, this.x = t, this.y = r;
}
Us.prototype = {
  constructor: Us,
  scale: function(e) {
    return e === 1 ? this : new Us(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Us(this.k, this.x + this.k * e, this.y + this.k * t);
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
Us.prototype;
var yT = /* @__PURE__ */ p((e) => {
  const { securityLevel: t } = Ot();
  let r = Et("body");
  if (t === "sandbox") {
    const o = Et(`#i${e}`).node()?.contentDocument ?? document;
    r = Et(o.body);
  }
  return r.select(`#${e}`);
}, "selectSvgElement"), xT = /* @__PURE__ */ p((e) => {
  const { handDrawnSeed: t } = Ot();
  return {
    fill: e,
    hachureAngle: 120,
    // angle of hachure,
    hachureGap: 4,
    fillWeight: 2,
    roughness: 0.7,
    stroke: e,
    seed: t
  };
}, "solidStateFill"), CT = /* @__PURE__ */ p((e) => Array.isArray(e) ? e : e ? e.split(";").map((t) => t.trim()).filter(Boolean) : [], "normalizeStyleList"), Cs = /* @__PURE__ */ p((e) => {
  const t = bT([
    ...e.cssCompiledStyles || [],
    ...e.cssStyles || [],
    ...CT(e.labelStyle)
  ]);
  return { stylesMap: t, stylesArray: [...t] };
}, "compileStyles"), bT = /* @__PURE__ */ p((e) => {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const [i, s] = r.split(":");
    t.set(i.trim(), s?.trim());
  }), t;
}, "styles2Map"), Jg = /* @__PURE__ */ p((e) => e === "color" || e === "font-size" || e === "font-family" || e === "font-weight" || e === "font-style" || e === "text-decoration" || e === "text-align" || e === "text-transform" || e === "line-height" || e === "letter-spacing" || e === "word-spacing" || e === "text-shadow" || e === "text-overflow" || e === "white-space" || e === "word-wrap" || e === "word-break" || e === "overflow-wrap" || e === "hyphens", "isLabelStyle"), gt = /* @__PURE__ */ p((e) => {
  const { stylesArray: t } = Cs(e), r = [], i = [], s = [], o = [];
  return t.forEach((n) => {
    const a = n[0];
    Jg(a) ? r.push(n.join(":") + " !important") : (i.push(n.join(":") + " !important"), a.includes("stroke") && s.push(n.join(":") + " !important"), a === "fill" && o.push(n.join(":") + " !important"));
  }), {
    labelStyles: r.join(";"),
    nodeStyles: i.join(";"),
    stylesArray: t,
    borderStyles: s,
    backgroundStyles: o
  };
}, "styles2String"), ut = /* @__PURE__ */ p((e, t) => {
  const { themeVariables: r, handDrawnSeed: i } = Ot(), { nodeBorder: s, mainBkg: o } = r, { stylesMap: n } = Cs(e);
  return Object.assign(
    {
      roughness: 0.7,
      fill: n.get("fill") || o,
      fillStyle: "hachure",
      // solid fill
      fillWeight: 4,
      hachureGap: 5.2,
      stroke: n.get("stroke") || s,
      seed: i,
      strokeWidth: n.get("stroke-width")?.replace("px", "") || 1.3,
      fillLineDash: [0, 0],
      strokeLineDash: kT(n.get("stroke-dasharray"))
    },
    t
  );
}, "userNodeOverrides"), kT = /* @__PURE__ */ p((e) => {
  if (!e)
    return [0, 0];
  const t = e.trim().split(/\s+/).map(Number);
  if (t.length === 1) {
    const s = isNaN(t[0]) ? 0 : t[0];
    return [s, s];
  }
  const r = isNaN(t[0]) ? 0 : t[0], i = isNaN(t[1]) ? 0 : t[1];
  return [r, i];
}, "getStrokeDashArray");
const wT = Object.freeze({
  left: 0,
  top: 0,
  width: 16,
  height: 16
}), An = Object.freeze({
  rotate: 0,
  vFlip: !1,
  hFlip: !1
}), tm = Object.freeze({
  ...wT,
  ...An
}), ST = Object.freeze({
  ...tm,
  body: "",
  hidden: !1
}), TT = Object.freeze({
  width: null,
  height: null
}), _T = Object.freeze({
  ...TT,
  ...An
}), vT = (e, t, r, i = "") => {
  const s = e.split(":");
  if (e.slice(0, 1) === "@") {
    if (s.length < 2 || s.length > 3) return null;
    i = s.shift().slice(1);
  }
  if (s.length > 3 || !s.length) return null;
  if (s.length > 1) {
    const a = s.pop(), l = s.pop(), c = {
      provider: s.length > 0 ? s[0] : i,
      prefix: l,
      name: a
    };
    return Ia(c) ? c : null;
  }
  const o = s[0], n = o.split("-");
  if (n.length > 1) {
    const a = {
      provider: i,
      prefix: n.shift(),
      name: n.join("-")
    };
    return Ia(a) ? a : null;
  }
  if (r && i === "") {
    const a = {
      provider: i,
      prefix: "",
      name: o
    };
    return Ia(a, r) ? a : null;
  }
  return null;
}, Ia = (e, t) => e ? !!((t && e.prefix === "" || e.prefix) && e.name) : !1;
function BT(e, t) {
  const r = {};
  !e.hFlip != !t.hFlip && (r.hFlip = !0), !e.vFlip != !t.vFlip && (r.vFlip = !0);
  const i = ((e.rotate || 0) + (t.rotate || 0)) % 4;
  return i && (r.rotate = i), r;
}
function ad(e, t) {
  const r = BT(e, t);
  for (const i in ST) i in An ? i in e && !(i in r) && (r[i] = An[i]) : i in t ? r[i] = t[i] : i in e && (r[i] = e[i]);
  return r;
}
function LT(e, t) {
  const r = e.icons, i = e.aliases || /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null);
  function o(n) {
    if (r[n]) return s[n] = [];
    if (!(n in s)) {
      s[n] = null;
      const a = i[n] && i[n].parent, l = a && o(a);
      l && (s[n] = [a].concat(l));
    }
    return s[n];
  }
  return (t || Object.keys(r).concat(Object.keys(i))).forEach(o), s;
}
function ld(e, t, r) {
  const i = e.icons, s = e.aliases || /* @__PURE__ */ Object.create(null);
  let o = {};
  function n(a) {
    o = ad(i[a] || s[a], o);
  }
  return n(t), r.forEach(n), ad(e, o);
}
function AT(e, t) {
  if (e.icons[t]) return ld(e, t, []);
  const r = LT(e, [t])[t];
  return r ? ld(e, t, r) : null;
}
const ET = /(-?[0-9.]*[0-9]+[0-9.]*)/g, FT = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function hd(e, t, r) {
  if (t === 1) return e;
  if (r = r || 100, typeof e == "number") return Math.ceil(e * t * r) / r;
  if (typeof e != "string") return e;
  const i = e.split(ET);
  if (i === null || !i.length) return e;
  const s = [];
  let o = i.shift(), n = FT.test(o);
  for (; ; ) {
    if (n) {
      const a = parseFloat(o);
      isNaN(a) ? s.push(o) : s.push(Math.ceil(a * t * r) / r);
    } else s.push(o);
    if (o = i.shift(), o === void 0) return s.join("");
    n = !n;
  }
}
function MT(e, t = "defs") {
  let r = "";
  const i = e.indexOf("<" + t);
  for (; i >= 0; ) {
    const s = e.indexOf(">", i), o = e.indexOf("</" + t);
    if (s === -1 || o === -1) break;
    const n = e.indexOf(">", o);
    if (n === -1) break;
    r += e.slice(s + 1, o).trim(), e = e.slice(0, i).trim() + e.slice(n + 1);
  }
  return {
    defs: r,
    content: e
  };
}
function $T(e, t) {
  return e ? "<defs>" + e + "</defs>" + t : t;
}
function OT(e, t, r) {
  const i = MT(e);
  return $T(i.defs, t + i.content + r);
}
const IT = (e) => e === "unset" || e === "undefined" || e === "none";
function DT(e, t) {
  const r = {
    ...tm,
    ...e
  }, i = {
    ..._T,
    ...t
  }, s = {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height
  };
  let o = r.body;
  [r, i].forEach((y) => {
    const x = [], C = y.hFlip, b = y.vFlip;
    let w = y.rotate;
    C ? b ? w += 2 : (x.push("translate(" + (s.width + s.left).toString() + " " + (0 - s.top).toString() + ")"), x.push("scale(-1 1)"), s.top = s.left = 0) : b && (x.push("translate(" + (0 - s.left).toString() + " " + (s.height + s.top).toString() + ")"), x.push("scale(1 -1)"), s.top = s.left = 0);
    let _;
    switch (w < 0 && (w -= Math.floor(w / 4) * 4), w = w % 4, w) {
      case 1:
        _ = s.height / 2 + s.top, x.unshift("rotate(90 " + _.toString() + " " + _.toString() + ")");
        break;
      case 2:
        x.unshift("rotate(180 " + (s.width / 2 + s.left).toString() + " " + (s.height / 2 + s.top).toString() + ")");
        break;
      case 3:
        _ = s.width / 2 + s.left, x.unshift("rotate(-90 " + _.toString() + " " + _.toString() + ")");
    }
    w % 2 === 1 && (s.left !== s.top && (_ = s.left, s.left = s.top, s.top = _), s.width !== s.height && (_ = s.width, s.width = s.height, s.height = _)), x.length && (o = OT(o, '<g transform="' + x.join(" ") + '">', "</g>"));
  });
  const n = i.width, a = i.height, l = s.width, c = s.height;
  let h, u;
  n === null ? (u = a === null ? "1em" : a === "auto" ? c : a, h = hd(u, l / c)) : (h = n === "auto" ? l : n, u = a === null ? hd(h, c / l) : a === "auto" ? c : a);
  const d = {}, f = (y, x) => {
    IT(x) || (d[y] = x.toString());
  };
  f("width", h), f("height", u);
  const m = [
    s.left,
    s.top,
    l,
    c
  ];
  return d.viewBox = m.join(" "), {
    attributes: d,
    viewBox: m,
    body: o
  };
}
const PT = /\sid="(\S+)"/g, cd = /* @__PURE__ */ new Map();
function RT(e) {
  e = e.replace(/[0-9]+$/, "") || "a";
  const t = cd.get(e) || 0;
  return cd.set(e, t + 1), t ? `${e}${t}` : e;
}
function NT(e) {
  const t = [];
  let r;
  for (; r = PT.exec(e); ) t.push(r[1]);
  if (!t.length) return e;
  const i = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  return t.forEach((s) => {
    const o = RT(s), n = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    e = e.replace(new RegExp('([#;"])(' + n + ')([")]|\\.[a-z])', "g"), "$1" + o + i + "$3");
  }), e = e.replace(new RegExp(i, "g"), ""), e;
}
function qT(e, t) {
  let r = e.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const i in t) r += " " + i + '="' + t[i] + '"';
  return '<svg xmlns="http://www.w3.org/2000/svg"' + r + ">" + e + "</svg>";
}
var WT = {
  body: '<g><rect width="80" height="80" style="fill: #087ebf; stroke-width: 0px;"/><text transform="translate(21.16 64.67)" style="fill: #fff; font-family: ArialMT, Arial; font-size: 67.75px;"><tspan x="0" y="0">?</tspan></text></g>',
  height: 80,
  width: 80
}, jl = /* @__PURE__ */ new Map(), em = /* @__PURE__ */ new Map(), zT = /* @__PURE__ */ p((e) => {
  for (const t of e) {
    if (!t.name)
      throw new Error(
        'Invalid icon loader. Must have a "name" property with non-empty string value.'
      );
    if (q.debug("Registering icon pack:", t.name), "loader" in t)
      em.set(t.name, t.loader);
    else if ("icons" in t)
      jl.set(t.name, t.icons);
    else
      throw q.error("Invalid icon loader:", t), new Error('Invalid icon loader. Must have either "icons" or "loader" property.');
  }
}, "registerIconPacks"), rm = /* @__PURE__ */ p(async (e, t) => {
  const r = vT(e, !0, t !== void 0);
  if (!r)
    throw new Error(`Invalid icon name: ${e}`);
  const i = r.prefix || t;
  if (!i)
    throw new Error(`Icon name must contain a prefix: ${e}`);
  let s = jl.get(i);
  if (!s) {
    const n = em.get(i);
    if (!n)
      throw new Error(`Icon set not found: ${r.prefix}`);
    try {
      s = { ...await n(), prefix: i }, jl.set(i, s);
    } catch (a) {
      throw q.error(a), new Error(`Failed to load icon set: ${r.prefix}`);
    }
  }
  const o = AT(s, r.name);
  if (!o)
    throw new Error(`Icon not found: ${e}`);
  return o;
}, "getRegisteredIconData"), HT = /* @__PURE__ */ p(async (e) => {
  try {
    return await rm(e), !0;
  } catch {
    return !1;
  }
}, "isIconAvailable"), vo = /* @__PURE__ */ p(async (e, t, r) => {
  let i;
  try {
    i = await rm(e, t?.fallbackPrefix);
  } catch (n) {
    q.error(n), i = WT;
  }
  const s = DT(i, t), o = qT(NT(s.body), {
    ...s.attributes,
    ...r
  });
  return He(o, Kt());
}, "getIconSVG"), zo = {}, se = {}, ud;
function YT() {
  return ud || (ud = 1, Object.defineProperty(se, "__esModule", { value: !0 }), se.BLANK_URL = se.relativeFirstCharacters = se.whitespaceEscapeCharsRegex = se.urlSchemeRegex = se.ctrlCharactersRegex = se.htmlCtrlEntityRegex = se.htmlEntitiesRegex = se.invalidProtocolRegex = void 0, se.invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im, se.htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g, se.htmlCtrlEntityRegex = /&(newline|tab);/gi, se.ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim, se.urlSchemeRegex = /^.+(:|&colon;)/gim, se.whitespaceEscapeCharsRegex = /(\\|%5[cC])((%(6[eE]|72|74))|[nrt])/g, se.relativeFirstCharacters = [".", "/"], se.BLANK_URL = "about:blank"), se;
}
var dd;
function UT() {
  if (dd) return zo;
  dd = 1, Object.defineProperty(zo, "__esModule", { value: !0 }), zo.sanitizeUrl = o;
  var e = YT();
  function t(n) {
    return e.relativeFirstCharacters.indexOf(n[0]) > -1;
  }
  function r(n) {
    var a = n.replace(e.ctrlCharactersRegex, "");
    return a.replace(e.htmlEntitiesRegex, function(l, c) {
      return String.fromCharCode(c);
    });
  }
  function i(n) {
    return URL.canParse(n);
  }
  function s(n) {
    try {
      return decodeURIComponent(n);
    } catch {
      return n;
    }
  }
  function o(n) {
    if (!n)
      return e.BLANK_URL;
    var a, l = s(n.trim());
    do
      l = r(l).replace(e.htmlCtrlEntityRegex, "").replace(e.ctrlCharactersRegex, "").replace(e.whitespaceEscapeCharsRegex, "").trim(), l = s(l), a = l.match(e.ctrlCharactersRegex) || l.match(e.htmlEntitiesRegex) || l.match(e.htmlCtrlEntityRegex) || l.match(e.whitespaceEscapeCharsRegex);
    while (a && a.length > 0);
    var c = l;
    if (!c)
      return e.BLANK_URL;
    if (t(c))
      return c;
    var h = c.trimStart(), u = h.match(e.urlSchemeRegex);
    if (!u)
      return c;
    var d = u[0].toLowerCase().trim();
    if (e.invalidProtocolRegex.test(d))
      return e.BLANK_URL;
    var f = h.replace(/\\/g, "/");
    if (d === "mailto:" || d.includes("://"))
      return f;
    if (d === "http:" || d === "https:") {
      if (!i(f))
        return e.BLANK_URL;
      var m = new URL(f);
      return m.protocol = m.protocol.toLowerCase(), m.hostname = m.hostname.toLowerCase(), m.toString();
    }
    return f;
  }
  return zo;
}
var jT = UT();
function Da(e) {
  if (typeof e != "object" || e == null) return !1;
  if (Object.getPrototypeOf(e) === null) return !0;
  if (Object.prototype.toString.call(e) !== "[object Object]") {
    const r = e[Symbol.toStringTag];
    return r == null || !Object.getOwnPropertyDescriptor(e, Symbol.toStringTag)?.writable ? !1 : e.toString() === `[object ${r}]`;
  }
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; ) t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
function XT() {
}
function im(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function Yh(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const GT = "[object RegExp]", sm = "[object String]", om = "[object Number]", nm = "[object Boolean]", am = "[object Arguments]", VT = "[object Symbol]", KT = "[object Date]", ZT = "[object Map]", QT = "[object Set]", JT = "[object Array]", t_ = "[object ArrayBuffer]", e_ = "[object Object]", r_ = "[object DataView]", i_ = "[object Uint8Array]", s_ = "[object Uint8ClampedArray]", o_ = "[object Uint16Array]", n_ = "[object Uint32Array]", a_ = "[object Int8Array]", l_ = "[object Int16Array]", h_ = "[object Int32Array]", c_ = "[object Float32Array]", u_ = "[object Float64Array]", fd = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || /* @__PURE__ */ (function() {
  return this;
})();
function Uh(e) {
  return typeof fd.Buffer < "u" && fd.Buffer.isBuffer(e);
}
function d_(e) {
  return Number.isSafeInteger(e) && e >= 0;
}
function lm(e) {
  return e != null && typeof e != "function" && d_(e.length);
}
function f_(e) {
  return e === "__proto__";
}
function jh(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
function Xh(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function p_(e, t) {
  return Hi(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function Hi(e, t, r, i = /* @__PURE__ */ new Map(), s = void 0) {
  const o = s?.(e, t, r, i);
  if (o !== void 0) return o;
  if (jh(e)) return e;
  if (i.has(e)) return i.get(e);
  if (Array.isArray(e)) {
    const n = new Array(e.length);
    i.set(e, n);
    for (let a = 0; a < e.length; a++) n[a] = Hi(e[a], a, r, i, s);
    return Object.hasOwn(e, "index") && (n.index = e.index), Object.hasOwn(e, "input") && (n.input = e.input), n;
  }
  if (e instanceof Date) return new Date(e.getTime());
  if (e instanceof RegExp) {
    const n = new RegExp(e.source, e.flags);
    return n.lastIndex = e.lastIndex, n;
  }
  if (e instanceof Map) {
    const n = /* @__PURE__ */ new Map();
    i.set(e, n);
    for (const [a, l] of e) n.set(a, Hi(l, a, r, i, s));
    return n;
  }
  if (e instanceof Set) {
    const n = /* @__PURE__ */ new Set();
    i.set(e, n);
    for (const a of e) n.add(Hi(a, void 0, r, i, s));
    return n;
  }
  if (Uh(e)) return e.subarray();
  if (Xh(e)) {
    const n = new (Object.getPrototypeOf(e)).constructor(e.length);
    i.set(e, n);
    for (let a = 0; a < e.length; a++) n[a] = Hi(e[a], a, r, i, s);
    return n;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  if (e instanceof DataView) {
    const n = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return i.set(e, n), Ve(n, e, r, i, s), n;
  }
  if (typeof File < "u" && e instanceof File) {
    const n = new File([e], e.name, { type: e.type });
    return i.set(e, n), Ve(n, e, r, i, s), n;
  }
  if (typeof Blob < "u" && e instanceof Blob) {
    const n = new Blob([e], { type: e.type });
    return i.set(e, n), Ve(n, e, r, i, s), n;
  }
  if (e instanceof Error) {
    const n = structuredClone(e);
    return i.set(e, n), n.message = e.message, n.name = e.name, n.stack = e.stack, n.cause = e.cause, n.constructor = e.constructor, Ve(n, e, r, i, s), n;
  }
  if (e instanceof Boolean) {
    const n = new Boolean(e.valueOf());
    return i.set(e, n), Ve(n, e, r, i, s), n;
  }
  if (e instanceof Number) {
    const n = new Number(e.valueOf());
    return i.set(e, n), Ve(n, e, r, i, s), n;
  }
  if (e instanceof String) {
    const n = new String(e.valueOf());
    return i.set(e, n), Ve(n, e, r, i, s), n;
  }
  if (typeof e == "object" && g_(e)) {
    const n = Object.create(Object.getPrototypeOf(e));
    return i.set(e, n), Ve(n, e, r, i, s), n;
  }
  return e;
}
function Ve(e, t, r = e, i, s) {
  const o = [...Object.keys(t), ...im(t)];
  for (let n = 0; n < o.length; n++) {
    const a = o[n], l = Object.getOwnPropertyDescriptor(e, a);
    (l == null || l.writable) && (e[a] = Hi(t[a], a, r, i, s));
  }
}
function g_(e) {
  switch (Yh(e)) {
    case am:
    case JT:
    case t_:
    case r_:
    case nm:
    case KT:
    case c_:
    case u_:
    case a_:
    case l_:
    case h_:
    case ZT:
    case om:
    case e_:
    case GT:
    case QT:
    case sm:
    case VT:
    case i_:
    case s_:
    case o_:
    case n_:
      return !0;
    default:
      return !1;
  }
}
function m_(e, t) {
  return p_(e, (r, i, s, o) => {
    if (typeof e == "object") {
      if (Yh(e) === "[object Object]" && typeof e.constructor != "function") {
        const n = {};
        return o.set(e, n), Ve(n, e, s, o), n;
      }
      switch (Object.prototype.toString.call(e)) {
        case om:
        case sm:
        case nm: {
          const n = new e.constructor(e?.valueOf());
          return Ve(n, e), n;
        }
        case am: {
          const n = {};
          return Ve(n, e), n.length = e.length, n[Symbol.iterator] = e[Symbol.iterator], n;
        }
        default:
          return;
      }
    }
  });
}
function pd(e) {
  return m_(e);
}
function Xl(e) {
  return e !== null && typeof e == "object" && Yh(e) === "[object Arguments]";
}
function Gl(e) {
  return typeof e == "object" && e !== null;
}
function y_(e) {
  return Gl(e) && lm(e);
}
function an(e) {
  return Xh(e);
}
function x_(e) {
  const t = e?.constructor;
  return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
function Bo(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function") throw new TypeError("Expected a function");
  const r = function(...i) {
    const s = t ? t.apply(this, i) : i[0], o = r.cache;
    if (o.has(s)) return o.get(s);
    const n = e.apply(this, i);
    return r.cache = o.set(s, n) || o, n;
  };
  return r.cache = new (Bo.Cache || Map)(), r;
}
Bo.Cache = Map;
function C_(e) {
  if (jh(e)) return e;
  if (Array.isArray(e) || Xh(e) || e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  const t = Object.getPrototypeOf(e);
  if (t == null) return Object.assign(Object.create(t), e);
  const r = t.constructor;
  if (e instanceof Date || e instanceof Map || e instanceof Set) return new r(e);
  if (e instanceof RegExp) {
    const i = new r(e);
    return i.lastIndex = e.lastIndex, i;
  }
  if (e instanceof DataView) return new r(e.buffer.slice(0));
  if (e instanceof Error) {
    let i;
    return e instanceof AggregateError ? i = new r(e.errors, e.message, { cause: e.cause }) : i = new r(e.message, { cause: e.cause }), i.stack = e.stack, Object.assign(i, e), i;
  }
  return typeof File < "u" && e instanceof File ? new r([e], e.name, {
    type: e.type,
    lastModified: e.lastModified
  }) : typeof e == "object" ? Object.assign(Object.create(t), e) : e;
}
function b_(e, ...t) {
  const r = t.slice(0, -1), i = t[t.length - 1];
  let s = e;
  for (let o = 0; o < r.length; o++) {
    const n = r[o];
    s = ln(s, n, i, /* @__PURE__ */ new Map());
  }
  return s;
}
function ln(e, t, r, i) {
  if (jh(e) && (e = Object(e)), t == null || typeof t != "object") return e;
  if (i.has(t)) return C_(i.get(t));
  if (i.set(t, e), Array.isArray(t)) {
    t = t.slice();
    for (let o = 0; o < t.length; o++) o in t || (t[o] = void 0);
  }
  const s = [...Object.keys(t), ...im(t)];
  for (let o = 0; o < s.length; o++) {
    const n = s[o];
    if (f_(n)) continue;
    let a = t[n], l = e[n];
    if (Xl(a) && (a = { ...a }), Xl(l) && (l = { ...l }), Uh(a) && (a = pd(a)), Array.isArray(a)) if (Array.isArray(l)) {
      const h = [], u = Reflect.ownKeys(l);
      for (let d = 0; d < u.length; d++) {
        const f = u[d];
        h[f] = l[f];
      }
      l = h;
    } else if (y_(l)) {
      const h = [];
      for (let u = 0; u < l.length; u++) h[u] = l[u];
      l = h;
    } else l = [];
    const c = r(l, a, n, e, t, i);
    c !== void 0 ? e[n] = c : Array.isArray(a) || Gl(l) && Gl(a) && (Da(l) || Da(a) || an(l) || an(a)) ? e[n] = ln(l, a, r, i) : l == null && Da(a) ? e[n] = ln({}, a, r, i) : l == null && an(a) ? e[n] = pd(a) : (l === void 0 || a !== void 0) && (e[n] = a);
  }
  return e;
}
function k_(e, ...t) {
  return b_(e, ...t, XT);
}
function gd(e) {
  if (e == null) return !0;
  if (lm(e))
    return typeof e.splice != "function" && typeof e != "string" && !Uh(e) && !an(e) && !Xl(e) ? !1 : e.length === 0;
  if (typeof e == "object" || typeof e == "function") {
    if (e instanceof Map || e instanceof Set) return e.size === 0;
    const t = Object.keys(e);
    return x_(e) ? t.filter((r) => r !== "constructor").length === 0 : t.length === 0;
  }
  return !0;
}
var w_ = "​", S_ = {
  curveBasis: Ul,
  curveBasisClosed: hT,
  curveBasisOpen: cT,
  curveBumpX: $g,
  curveBumpY: Og,
  curveBundle: uT,
  curveCardinalClosed: dT,
  curveCardinalOpen: fT,
  curveCardinal: Rg,
  curveCatmullRomClosed: pT,
  curveCatmullRomOpen: gT,
  curveCatmullRom: qg,
  curveLinear: ro,
  curveLinearClosed: mT,
  curveMonotoneX: jg,
  curveMonotoneY: Xg,
  curveNatural: Vg,
  curveStep: Kg,
  curveStepAfter: Qg,
  curveStepBefore: Zg
}, T_ = /\s*(?:(\w+)(?=:):|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, __ = /* @__PURE__ */ p(function(e, t) {
  const r = hm(e, /(?:init\b)|(?:initialize\b)/);
  let i = {};
  if (Array.isArray(r)) {
    const n = r.map((a) => a.args);
    gn(n), i = ne(i, [...n]);
  } else
    i = r.args;
  if (!i)
    return;
  let s = vh(e, t);
  const o = "config";
  return i[o] !== void 0 && (s === "flowchart-v2" && (s = "flowchart"), i[s] = i[o], delete i[o]), i;
}, "detectInit"), hm = /* @__PURE__ */ p(function(e, t = null) {
  try {
    const r = new RegExp(
      `[%]{2}(?![{]${T_.source})(?=[}][%]{2}).*
`,
      "ig"
    );
    e = e.trim().replace(r, "").replace(/'/gm, '"'), q.debug(
      `Detecting diagram directive${t !== null ? " type:" + t : ""} based on the text:${e}`
    );
    let i;
    const s = [];
    for (; (i = eo.exec(e)) !== null; )
      if (i.index === eo.lastIndex && eo.lastIndex++, i && !t || t && i[1]?.match(t) || t && i[2]?.match(t)) {
        const o = i[1] ? i[1] : i[2], n = i[3] ? i[3].trim() : i[4] ? JSON.parse(i[4].trim()) : null;
        s.push({ type: o, args: n });
      }
    return s.length === 0 ? { type: e, args: null } : s.length === 1 ? s[0] : s;
  } catch (r) {
    return q.error(
      `ERROR: ${r.message} - Unable to parse directive type: '${t}' based on the text: '${e}'`
    ), { type: void 0, args: null };
  }
}, "detectDirective"), v_ = /* @__PURE__ */ p(function(e) {
  return e.replace(eo, "");
}, "removeDirectives"), B_ = /* @__PURE__ */ p(function(e, t) {
  for (const [r, i] of t.entries())
    if (i.match(e))
      return r;
  return -1;
}, "isSubstringInArray");
function Gh(e, t) {
  if (!e)
    return t;
  const r = `curve${e.charAt(0).toUpperCase() + e.slice(1)}`;
  return S_[r] ?? t;
}
p(Gh, "interpolateToCurve");
function cm(e, t) {
  const r = e.trim();
  if (r)
    return t.securityLevel !== "loose" ? jT.sanitizeUrl(r) : r;
}
p(cm, "formatUrl");
var L_ = /* @__PURE__ */ p((e, ...t) => {
  const r = e.split("."), i = r.length - 1, s = r[i];
  let o = window;
  for (let n = 0; n < i; n++)
    if (o = o[r[n]], !o) {
      q.error(`Function name: ${e} not found in window`);
      return;
    }
  o[s](...t);
}, "runFunc");
function Vh(e, t) {
  return !e || !t ? 0 : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
}
p(Vh, "distance");
function um(e) {
  let t, r = 0;
  e.forEach((s) => {
    r += Vh(s, t), t = s;
  });
  const i = r / 2;
  return Kh(e, i);
}
p(um, "traverseEdge");
function dm(e) {
  return e.length === 1 ? e[0] : um(e);
}
p(dm, "calcLabelPosition");
var md = /* @__PURE__ */ p((e, t = 2) => {
  const r = Math.pow(10, t);
  return Math.round(e * r) / r;
}, "roundNumber"), Kh = /* @__PURE__ */ p((e, t) => {
  let r, i = t;
  for (const s of e) {
    if (r) {
      const o = Vh(s, r);
      if (o === 0)
        return r;
      if (o < i)
        i -= o;
      else {
        const n = i / o;
        if (n <= 0)
          return r;
        if (n >= 1)
          return { x: s.x, y: s.y };
        if (n > 0 && n < 1)
          return {
            x: md((1 - n) * r.x + n * s.x, 5),
            y: md((1 - n) * r.y + n * s.y, 5)
          };
      }
    }
    r = s;
  }
  throw new Error("Could not find a suitable point for the given distance");
}, "calculatePoint"), A_ = /* @__PURE__ */ p((e, t, r) => {
  q.info(`our points ${JSON.stringify(t)}`), t[0] !== r && (t = t.reverse());
  const s = Kh(t, 25), o = e ? 10 : 5, n = Math.atan2(t[0].y - s.y, t[0].x - s.x), a = { x: 0, y: 0 };
  return a.x = Math.sin(n) * o + (t[0].x + s.x) / 2, a.y = -Math.cos(n) * o + (t[0].y + s.y) / 2, a;
}, "calcCardinalityPosition");
function fm(e, t, r) {
  const i = structuredClone(r);
  q.info("our points", i), t !== "start_left" && t !== "start_right" && i.reverse();
  const s = 25 + e, o = Kh(i, s), n = 10 + e * 0.5, a = Math.atan2(i[0].y - o.y, i[0].x - o.x), l = { x: 0, y: 0 };
  return t === "start_left" ? (l.x = Math.sin(a + Math.PI) * n + (i[0].x + o.x) / 2, l.y = -Math.cos(a + Math.PI) * n + (i[0].y + o.y) / 2) : t === "end_right" ? (l.x = Math.sin(a - Math.PI) * n + (i[0].x + o.x) / 2 - 5, l.y = -Math.cos(a - Math.PI) * n + (i[0].y + o.y) / 2 - 5) : t === "end_left" ? (l.x = Math.sin(a) * n + (i[0].x + o.x) / 2 - 5, l.y = -Math.cos(a) * n + (i[0].y + o.y) / 2 - 5) : (l.x = Math.sin(a) * n + (i[0].x + o.x) / 2, l.y = -Math.cos(a) * n + (i[0].y + o.y) / 2), l;
}
p(fm, "calcTerminalLabelPosition");
function pm(e) {
  let t = "", r = "";
  for (const i of e)
    i !== void 0 && (i.startsWith("color:") || i.startsWith("text-align:") ? r = r + i + ";" : t = t + i + ";");
  return { style: t, labelStyle: r };
}
p(pm, "getStylesFromArray");
var yd = 0, E_ = /* @__PURE__ */ p(() => (yd++, "id-" + Math.random().toString(36).substr(2, 12) + "-" + yd), "generateId");
function gm(e) {
  let t = "";
  const r = "0123456789abcdef", i = r.length;
  for (let s = 0; s < e; s++)
    t += r.charAt(Math.floor(Math.random() * i));
  return t;
}
p(gm, "makeRandomHex");
var F_ = /* @__PURE__ */ p((e) => gm(e.length), "random"), M_ = /* @__PURE__ */ p(function() {
  return {
    x: 0,
    y: 0,
    fill: void 0,
    anchor: "start",
    style: "#666",
    width: 100,
    height: 100,
    textMargin: 0,
    rx: 0,
    ry: 0,
    valign: void 0,
    text: ""
  };
}, "getTextObj"), $_ = /* @__PURE__ */ p(function(e, t) {
  const r = t.text.replace(So.lineBreakRegex, " "), [, i] = Zn(t.fontSize), s = e.append("text");
  s.attr("x", t.x), s.attr("y", t.y), s.style("text-anchor", t.anchor), s.style("font-family", t.fontFamily), s.style("font-size", i), s.style("font-weight", t.fontWeight), s.attr("fill", t.fill), t.class !== void 0 && s.attr("class", t.class);
  const o = s.append("tspan");
  return o.attr("x", t.x + t.textMargin * 2), o.attr("fill", t.fill), o.text(r), s;
}, "drawSimpleText"), O_ = Bo(
  (e, t, r) => {
    if (!e || (r = Object.assign(
      { fontSize: 12, fontWeight: 400, fontFamily: "Arial", joinWith: "<br/>" },
      r
    ), So.lineBreakRegex.test(e)))
      return e;
    const i = e.split(" ").filter(Boolean), s = [];
    let o = "";
    return i.forEach((n, a) => {
      const l = Mr(`${n} `, r), c = Mr(o, r);
      if (l > t) {
        const { hyphenatedStrings: d, remainingWord: f } = I_(n, t, "-", r);
        s.push(o, ...d), o = f;
      } else c + l >= t ? (s.push(o), o = n) : o = [o, n].filter(Boolean).join(" ");
      a + 1 === i.length && s.push(o);
    }), s.filter((n) => n !== "").join(r.joinWith);
  },
  (e, t, r) => `${e}${t}${r.fontSize}${r.fontWeight}${r.fontFamily}${r.joinWith}`
), I_ = Bo(
  (e, t, r = "-", i) => {
    i = Object.assign(
      { fontSize: 12, fontWeight: 400, fontFamily: "Arial", margin: 0 },
      i
    );
    const s = [...e], o = [];
    let n = "";
    return s.forEach((a, l) => {
      const c = `${n}${a}`;
      if (Mr(c, i) >= t) {
        const u = l + 1, d = s.length === u, f = `${c}${r}`;
        o.push(d ? c : f), n = "";
      } else
        n = c;
    }), { hyphenatedStrings: o, remainingWord: n };
  },
  (e, t, r = "-", i) => `${e}${t}${r}${i.fontSize}${i.fontWeight}${i.fontFamily}`
);
function mm(e, t) {
  return Zh(e, t).height;
}
p(mm, "calculateTextHeight");
function Mr(e, t) {
  return Zh(e, t).width;
}
p(Mr, "calculateTextWidth");
var Zh = Bo(
  (e, t) => {
    const { fontSize: r = 12, fontFamily: i = "Arial", fontWeight: s = 400 } = t;
    if (!e)
      return { width: 0, height: 0 };
    const [, o] = Zn(r), n = ["sans-serif", i], a = e.split(So.lineBreakRegex), l = [], c = Et("body");
    if (!c.remove)
      return { width: 0, height: 0, lineHeight: 0 };
    const h = c.append("svg");
    for (const d of n) {
      let f = 0;
      const m = { width: 0, height: 0, lineHeight: 0 };
      for (const y of a) {
        const x = M_();
        x.text = y || w_;
        const C = $_(h, x).style("font-size", o).style("font-weight", s).style("font-family", d), b = (C._groups || C)[0][0].getBBox();
        if (b.width === 0 && b.height === 0)
          throw new Error("svg element not in render tree");
        m.width = Math.round(Math.max(m.width, b.width)), f = Math.round(b.height), m.height += f, m.lineHeight = Math.round(Math.max(m.lineHeight, f));
      }
      l.push(m);
    }
    h.remove();
    const u = isNaN(l[1].height) || isNaN(l[1].width) || isNaN(l[1].lineHeight) || l[0].height > l[1].height && l[0].width > l[1].width && l[0].lineHeight > l[1].lineHeight ? 0 : 1;
    return l[u];
  },
  (e, t) => `${e}${t.fontSize}${t.fontWeight}${t.fontFamily}`
), ls, D_ = (ls = class {
  constructor(t = !1, r) {
    this.count = 0, this.count = r ? r.length : 0, this.next = t ? () => this.count++ : () => Date.now();
  }
}, p(ls, "InitIDGenerator"), ls), Ho, P_ = /* @__PURE__ */ p(function(e) {
  return Ho = Ho || document.createElement("div"), e = escape(e).replace(/%26/g, "&").replace(/%23/g, "#").replace(/%3B/g, ";"), Ho.innerHTML = e, unescape(Ho.textContent);
}, "entityDecode");
function Qh(e) {
  return "str" in e;
}
p(Qh, "isDetailedError");
var R_ = /* @__PURE__ */ p((e, t, r, i) => {
  if (!i)
    return;
  const s = e.node()?.getBBox();
  s && e.append("text").text(i).attr("text-anchor", "middle").attr("x", s.x + s.width / 2).attr("y", -r).attr("class", t);
}, "insertTitle"), Zn = /* @__PURE__ */ p((e) => {
  if (typeof e == "number")
    return [e, e + "px"];
  const t = parseInt(e ?? "", 10);
  return Number.isNaN(t) ? [void 0, void 0] : e === String(t) ? [t, e + "px"] : [t, e];
}, "parseFontSize");
function Jh(e, t) {
  return k_({}, e, t);
}
p(Jh, "cleanAndMerge");
var me = {
  assignWithDepth: ne,
  wrapLabel: O_,
  calculateTextHeight: mm,
  calculateTextWidth: Mr,
  calculateTextDimensions: Zh,
  cleanAndMerge: Jh,
  detectInit: __,
  detectDirective: hm,
  isSubstringInArray: B_,
  interpolateToCurve: Gh,
  calcLabelPosition: dm,
  calcCardinalityPosition: A_,
  calcTerminalLabelPosition: fm,
  formatUrl: cm,
  getStylesFromArray: pm,
  generateId: E_,
  random: F_,
  runFunc: L_,
  entityDecode: P_,
  insertTitle: R_,
  isLabelCoordinateInPath: ym,
  parseFontSize: Zn,
  InitIDGenerator: D_
}, N_ = /* @__PURE__ */ p(function(e) {
  let t = e;
  return t = t.replace(/style.*:\S*#.*;/g, function(r) {
    return r.substring(0, r.length - 1);
  }), t = t.replace(/classDef.*:\S*#.*;/g, function(r) {
    return r.substring(0, r.length - 1);
  }), t = t.replace(/#\w+;/g, function(r) {
    const i = r.substring(1, r.length - 1);
    return /^\+?\d+$/.test(i) ? "ﬂ°°" + i + "¶ß" : "ﬂ°" + i + "¶ß";
  }), t;
}, "encodeEntities"), Zr = /* @__PURE__ */ p(function(e) {
  return e.replace(/ﬂ°°/g, "&#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, "decodeEntities"), BI = /* @__PURE__ */ p((e, t, {
  counter: r = 0,
  prefix: i,
  suffix: s
}, o) => o || `${i ? `${i}_` : ""}${e}_${t}_${r}${s ? `_${s}` : ""}`, "getEdgeId");
function re(e) {
  return e ?? null;
}
p(re, "handleUndefinedAttr");
function ym(e, t) {
  const r = Math.round(e.x), i = Math.round(e.y), s = t.replace(
    /(\d+\.\d+)/g,
    (o) => Math.round(parseFloat(o)).toString()
  );
  return s.includes(r.toString()) || s.includes(i.toString());
}
p(ym, "isLabelCoordinateInPath");
var hn = { exports: {} }, xd = hn.exports, Cd;
function q_() {
  return Cd || (Cd = 1, (function(e) {
    (function(t) {
      var r = function() {
      }, i = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.msRequestAnimationFrame || function(h) {
        return setTimeout(h, 16);
      };
      function s() {
        var h = this;
        h.reads = [], h.writes = [], h.raf = i.bind(t);
      }
      s.prototype = {
        constructor: s,
        /**
         * We run this inside a try catch
         * so that if any jobs error, we
         * are able to recover and continue
         * to flush the batch until it's empty.
         *
         * @param {Array} tasks
         */
        runTasks: function(h) {
          for (var u; u = h.shift(); ) u();
        },
        /**
         * Adds a job to the read batch and
         * schedules a new frame if need be.
         *
         * @param  {Function} fn
         * @param  {Object} ctx the context to be bound to `fn` (optional).
         * @public
         */
        measure: function(h, u) {
          var d = u ? h.bind(u) : h;
          return this.reads.push(d), o(this), d;
        },
        /**
         * Adds a job to the
         * write batch and schedules
         * a new frame if need be.
         *
         * @param  {Function} fn
         * @param  {Object} ctx the context to be bound to `fn` (optional).
         * @public
         */
        mutate: function(h, u) {
          var d = u ? h.bind(u) : h;
          return this.writes.push(d), o(this), d;
        },
        /**
         * Clears a scheduled 'read' or 'write' task.
         *
         * @param {Object} task
         * @return {Boolean} success
         * @public
         */
        clear: function(h) {
          return a(this.reads, h) || a(this.writes, h);
        },
        /**
         * Extend this FastDom with some
         * custom functionality.
         *
         * Because fastdom must *always* be a
         * singleton, we're actually extending
         * the fastdom instance. This means tasks
         * scheduled by an extension still enter
         * fastdom's global task queue.
         *
         * The 'super' instance can be accessed
         * from `this.fastdom`.
         *
         * @example
         *
         * var myFastdom = fastdom.extend({
         *   initialize: function() {
         *     // runs on creation
         *   },
         *
         *   // override a method
         *   measure: function(fn) {
         *     // do extra stuff ...
         *
         *     // then call the original
         *     return this.fastdom.measure(fn);
         *   },
         *
         *   ...
         * });
         *
         * @param  {Object} props  properties to mixin
         * @return {FastDom}
         */
        extend: function(h) {
          if (typeof h != "object") throw new Error("expected object");
          var u = Object.create(this);
          return l(u, h), u.fastdom = this, u.initialize && u.initialize(), u;
        },
        // override this with a function
        // to prevent Errors in console
        // when tasks throw
        catch: null
      };
      function o(h) {
        h.scheduled || (h.scheduled = !0, h.raf(n.bind(null, h)));
      }
      function n(h) {
        var u = h.writes, d = h.reads, f;
        try {
          r("flushing reads", d.length), h.runTasks(d), r("flushing writes", u.length), h.runTasks(u);
        } catch (m) {
          f = m;
        }
        if (h.scheduled = !1, (d.length || u.length) && o(h), f)
          if (r("task errored", f.message), h.catch) h.catch(f);
          else throw f;
      }
      function a(h, u) {
        var d = h.indexOf(u);
        return !!~d && !!h.splice(d, 1);
      }
      function l(h, u) {
        for (var d in u)
          u.hasOwnProperty(d) && (h[d] = u[d]);
      }
      var c = t.fastdom = t.fastdom || new s();
      e.exports = c;
    })(typeof window < "u" ? window : typeof xd < "u" ? xd : globalThis);
  })(hn)), hn.exports;
}
var W_ = q_();
const z_ = /* @__PURE__ */ bh(W_);
var Pa = { exports: {} }, bd;
function H_() {
  return bd || (bd = 1, (function(e) {
    (function() {
      var t = {
        initialize: function() {
          this._tasks = /* @__PURE__ */ new Map();
        },
        mutate: function(i, s) {
          return r(this, "mutate", i, s);
        },
        measure: function(i, s) {
          return r(this, "measure", i, s);
        },
        clear: function(i) {
          var s = this._tasks, o = s.get(i);
          this.fastdom.clear(o), s.delete(i);
        }
      };
      function r(i, s, o, n) {
        var a = i._tasks, l = i.fastdom, c, h = new Promise(function(u, d) {
          c = l[s](function() {
            a.delete(h);
            try {
              u(n ? o.call(n) : o());
            } catch (f) {
              d(f);
            }
          }, n);
        });
        return a.set(h, c), h;
      }
      e.exports = t;
    })();
  })(Pa)), Pa.exports;
}
var Y_ = H_();
const U_ = /* @__PURE__ */ bh(Y_);
function tc() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var _i = tc();
function xm(e) {
  _i = e;
}
var io = { exec: () => null };
function Yt(e, t = "") {
  let r = typeof e == "string" ? e : e.source, i = { replace: (s, o) => {
    let n = typeof o == "string" ? o : o.source;
    return n = n.replace(Te.caret, "$1"), r = r.replace(s, n), i;
  }, getRegex: () => new RegExp(r, t) };
  return i;
}
var j_ = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Te = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i") }, X_ = /^(?:[ \t]*(?:\n|$))+/, G_ = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, V_ = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Lo = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, K_ = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ec = /(?:[*+-]|\d{1,9}[.)])/, Cm = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, bm = Yt(Cm).replace(/bull/g, ec).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Z_ = Yt(Cm).replace(/bull/g, ec).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), rc = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Q_ = /^[^\n]+/, ic = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, J_ = Yt(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", ic).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), tv = Yt(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, ec).getRegex(), Qn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", sc = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ev = Yt("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", sc).replace("tag", Qn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), km = Yt(rc).replace("hr", Lo).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Qn).getRegex(), rv = Yt(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", km).getRegex(), oc = { blockquote: rv, code: G_, def: J_, fences: V_, heading: K_, hr: Lo, html: ev, lheading: bm, list: tv, newline: X_, paragraph: km, table: io, text: Q_ }, kd = Yt("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Lo).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Qn).getRegex(), iv = { ...oc, lheading: Z_, table: kd, paragraph: Yt(rc).replace("hr", Lo).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", kd).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Qn).getRegex() }, sv = { ...oc, html: Yt(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", sc).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: io, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Yt(rc).replace("hr", Lo).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", bm).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, ov = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, nv = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, wm = /^( {2,}|\\)\n(?!\s*$)/, av = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Jn = /[\p{P}\p{S}]/u, nc = /[\s\p{P}\p{S}]/u, Sm = /[^\s\p{P}\p{S}]/u, lv = Yt(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, nc).getRegex(), Tm = /(?!~)[\p{P}\p{S}]/u, hv = /(?!~)[\s\p{P}\p{S}]/u, cv = /(?:[^\s\p{P}\p{S}]|~)/u, uv = Yt(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", j_ ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), _m = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, dv = Yt(_m, "u").replace(/punct/g, Jn).getRegex(), fv = Yt(_m, "u").replace(/punct/g, Tm).getRegex(), vm = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", pv = Yt(vm, "gu").replace(/notPunctSpace/g, Sm).replace(/punctSpace/g, nc).replace(/punct/g, Jn).getRegex(), gv = Yt(vm, "gu").replace(/notPunctSpace/g, cv).replace(/punctSpace/g, hv).replace(/punct/g, Tm).getRegex(), mv = Yt("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Sm).replace(/punctSpace/g, nc).replace(/punct/g, Jn).getRegex(), yv = Yt(/\\(punct)/, "gu").replace(/punct/g, Jn).getRegex(), xv = Yt(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Cv = Yt(sc).replace("(?:-->|$)", "-->").getRegex(), bv = Yt("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Cv).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), En = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, kv = Yt(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", En).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Bm = Yt(/^!?\[(label)\]\[(ref)\]/).replace("label", En).replace("ref", ic).getRegex(), Lm = Yt(/^!?\[(ref)\](?:\[\])?/).replace("ref", ic).getRegex(), wv = Yt("reflink|nolink(?!\\()", "g").replace("reflink", Bm).replace("nolink", Lm).getRegex(), wd = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ac = { _backpedal: io, anyPunctuation: yv, autolink: xv, blockSkip: uv, br: wm, code: nv, del: io, emStrongLDelim: dv, emStrongRDelimAst: pv, emStrongRDelimUnd: mv, escape: ov, link: kv, nolink: Lm, punctuation: lv, reflink: Bm, reflinkSearch: wv, tag: bv, text: av, url: io }, Sv = { ...ac, link: Yt(/^!?\[(label)\]\((.*?)\)/).replace("label", En).getRegex(), reflink: Yt(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", En).getRegex() }, Vl = { ...ac, emStrongRDelimAst: gv, emStrongLDelim: fv, url: Yt(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", wd).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Yt(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", wd).getRegex() }, Tv = { ...Vl, br: Yt(wm).replace("{2,}", "*").getRegex(), text: Yt(Vl.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Yo = { normal: oc, gfm: iv, pedantic: sv }, $s = { normal: ac, gfm: Vl, breaks: Tv, pedantic: Sv }, _v = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Sd = (e) => _v[e];
function ar(e, t) {
  if (t) {
    if (Te.escapeTest.test(e)) return e.replace(Te.escapeReplace, Sd);
  } else if (Te.escapeTestNoEncode.test(e)) return e.replace(Te.escapeReplaceNoEncode, Sd);
  return e;
}
function Td(e) {
  try {
    e = encodeURI(e).replace(Te.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function _d(e, t) {
  let r = e.replace(Te.findPipe, (o, n, a) => {
    let l = !1, c = n;
    for (; --c >= 0 && a[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = r.split(Te.splitPipe), s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; s < i.length; s++) i[s] = i[s].trim().replace(Te.slashPipe, "|");
  return i;
}
function Os(e, t, r) {
  let i = e.length;
  if (i === 0) return "";
  let s = 0;
  for (; s < i && e.charAt(i - s - 1) === t; )
    s++;
  return e.slice(0, i - s);
}
function vv(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let r = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) r++;
  else if (e[i] === t[1] && (r--, r < 0)) return i;
  return r > 0 ? -2 : -1;
}
function vd(e, t, r, i, s) {
  let o = t.href, n = t.title || null, a = e[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: r, href: o, title: n, text: a, tokens: i.inlineTokens(a) };
  return i.state.inLink = !1, l;
}
function Bv(e, t, r) {
  let i = e.match(r.other.indentCodeCompensation);
  if (i === null) return t;
  let s = i[1];
  return t.split(`
`).map((o) => {
    let n = o.match(r.other.beginningSpace);
    if (n === null) return o;
    let [a] = n;
    return a.length >= s.length ? o.slice(s.length) : o;
  }).join(`
`);
}
var Fn = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || _i;
  }
  space(t) {
    let r = this.rules.block.newline.exec(t);
    if (r && r[0].length > 0) return { type: "space", raw: r[0] };
  }
  code(t) {
    let r = this.rules.block.code.exec(t);
    if (r) {
      let i = r[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: r[0], codeBlockStyle: "indented", text: this.options.pedantic ? i : Os(i, `
`) };
    }
  }
  fences(t) {
    let r = this.rules.block.fences.exec(t);
    if (r) {
      let i = r[0], s = Bv(i, r[3] || "", this.rules);
      return { type: "code", raw: i, lang: r[2] ? r[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : r[2], text: s };
    }
  }
  heading(t) {
    let r = this.rules.block.heading.exec(t);
    if (r) {
      let i = r[2].trim();
      if (this.rules.other.endingHash.test(i)) {
        let s = Os(i, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (i = s.trim());
      }
      return { type: "heading", raw: r[0], depth: r[1].length, text: i, tokens: this.lexer.inline(i) };
    }
  }
  hr(t) {
    let r = this.rules.block.hr.exec(t);
    if (r) return { type: "hr", raw: Os(r[0], `
`) };
  }
  blockquote(t) {
    let r = this.rules.block.blockquote.exec(t);
    if (r) {
      let i = Os(r[0], `
`).split(`
`), s = "", o = "", n = [];
      for (; i.length > 0; ) {
        let a = !1, l = [], c;
        for (c = 0; c < i.length; c++) if (this.rules.other.blockquoteStart.test(i[c])) l.push(i[c]), a = !0;
        else if (!a) l.push(i[c]);
        else break;
        i = i.slice(c);
        let h = l.join(`
`), u = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${h}` : h, o = o ? `${o}
${u}` : u;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, n, !0), this.lexer.state.top = d, i.length === 0) break;
        let f = n.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let m = f, y = m.raw + `
` + i.join(`
`), x = this.blockquote(y);
          n[n.length - 1] = x, s = s.substring(0, s.length - m.raw.length) + x.raw, o = o.substring(0, o.length - m.text.length) + x.text;
          break;
        } else if (f?.type === "list") {
          let m = f, y = m.raw + `
` + i.join(`
`), x = this.list(y);
          n[n.length - 1] = x, s = s.substring(0, s.length - f.raw.length) + x.raw, o = o.substring(0, o.length - m.raw.length) + x.raw, i = y.substring(n.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: n, text: o };
    }
  }
  list(t) {
    let r = this.rules.block.list.exec(t);
    if (r) {
      let i = r[1].trim(), s = i.length > 1, o = { type: "list", raw: "", ordered: s, start: s ? +i.slice(0, -1) : "", loose: !1, items: [] };
      i = s ? `\\d{1,9}\\${i.slice(-1)}` : `\\${i}`, this.options.pedantic && (i = s ? i : "[*+-]");
      let n = this.rules.other.listItemRegex(i), a = !1;
      for (; t; ) {
        let c = !1, h = "", u = "";
        if (!(r = n.exec(t)) || this.rules.block.hr.test(t)) break;
        h = r[0], t = t.substring(h.length);
        let d = r[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (b) => " ".repeat(3 * b.length)), f = t.split(`
`, 1)[0], m = !d.trim(), y = 0;
        if (this.options.pedantic ? (y = 2, u = d.trimStart()) : m ? y = r[1].length + 1 : (y = r[2].search(this.rules.other.nonSpaceChar), y = y > 4 ? 1 : y, u = d.slice(y), y += r[1].length), m && this.rules.other.blankLine.test(f) && (h += f + `
`, t = t.substring(f.length + 1), c = !0), !c) {
          let b = this.rules.other.nextBulletRegex(y), w = this.rules.other.hrRegex(y), _ = this.rules.other.fencesBeginRegex(y), v = this.rules.other.headingBeginRegex(y), E = this.rules.other.htmlBeginRegex(y);
          for (; t; ) {
            let A = t.split(`
`, 1)[0], L;
            if (f = A, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), L = f) : L = f.replace(this.rules.other.tabCharGlobal, "    "), _.test(f) || v.test(f) || E.test(f) || b.test(f) || w.test(f)) break;
            if (L.search(this.rules.other.nonSpaceChar) >= y || !f.trim()) u += `
` + L.slice(y);
            else {
              if (m || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || _.test(d) || v.test(d) || w.test(d)) break;
              u += `
` + f;
            }
            !m && !f.trim() && (m = !0), h += A + `
`, t = t.substring(A.length + 1), d = L.slice(y);
          }
        }
        o.loose || (a ? o.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (a = !0));
        let x = null, C;
        this.options.gfm && (x = this.rules.other.listIsTask.exec(u), x && (C = x[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), o.items.push({ type: "list_item", raw: h, task: !!x, checked: C, loose: !1, text: u, tokens: [] }), o.raw += h;
      }
      let l = o.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      o.raw = o.raw.trimEnd();
      for (let c = 0; c < o.items.length; c++) if (this.lexer.state.top = !1, o.items[c].tokens = this.lexer.blockTokens(o.items[c].text, []), !o.loose) {
        let h = o.items[c].tokens.filter((d) => d.type === "space"), u = h.length > 0 && h.some((d) => this.rules.other.anyLine.test(d.raw));
        o.loose = u;
      }
      if (o.loose) for (let c = 0; c < o.items.length; c++) o.items[c].loose = !0;
      return o;
    }
  }
  html(t) {
    let r = this.rules.block.html.exec(t);
    if (r) return { type: "html", block: !0, raw: r[0], pre: r[1] === "pre" || r[1] === "script" || r[1] === "style", text: r[0] };
  }
  def(t) {
    let r = this.rules.block.def.exec(t);
    if (r) {
      let i = r[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = r[2] ? r[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", o = r[3] ? r[3].substring(1, r[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : r[3];
      return { type: "def", tag: i, raw: r[0], href: s, title: o };
    }
  }
  table(t) {
    let r = this.rules.block.table.exec(t);
    if (!r || !this.rules.other.tableDelimiter.test(r[2])) return;
    let i = _d(r[1]), s = r[2].replace(this.rules.other.tableAlignChars, "").split("|"), o = r[3]?.trim() ? r[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], n = { type: "table", raw: r[0], header: [], align: [], rows: [] };
    if (i.length === s.length) {
      for (let a of s) this.rules.other.tableAlignRight.test(a) ? n.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? n.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? n.align.push("left") : n.align.push(null);
      for (let a = 0; a < i.length; a++) n.header.push({ text: i[a], tokens: this.lexer.inline(i[a]), header: !0, align: n.align[a] });
      for (let a of o) n.rows.push(_d(a, n.header.length).map((l, c) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: n.align[c] })));
      return n;
    }
  }
  lheading(t) {
    let r = this.rules.block.lheading.exec(t);
    if (r) return { type: "heading", raw: r[0], depth: r[2].charAt(0) === "=" ? 1 : 2, text: r[1], tokens: this.lexer.inline(r[1]) };
  }
  paragraph(t) {
    let r = this.rules.block.paragraph.exec(t);
    if (r) {
      let i = r[1].charAt(r[1].length - 1) === `
` ? r[1].slice(0, -1) : r[1];
      return { type: "paragraph", raw: r[0], text: i, tokens: this.lexer.inline(i) };
    }
  }
  text(t) {
    let r = this.rules.block.text.exec(t);
    if (r) return { type: "text", raw: r[0], text: r[0], tokens: this.lexer.inline(r[0]) };
  }
  escape(t) {
    let r = this.rules.inline.escape.exec(t);
    if (r) return { type: "escape", raw: r[0], text: r[1] };
  }
  tag(t) {
    let r = this.rules.inline.tag.exec(t);
    if (r) return !this.lexer.state.inLink && this.rules.other.startATag.test(r[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(r[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(r[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(r[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: r[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: r[0] };
  }
  link(t) {
    let r = this.rules.inline.link.exec(t);
    if (r) {
      let i = r[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(i)) {
        if (!this.rules.other.endAngleBracket.test(i)) return;
        let n = Os(i.slice(0, -1), "\\");
        if ((i.length - n.length) % 2 === 0) return;
      } else {
        let n = vv(r[2], "()");
        if (n === -2) return;
        if (n > -1) {
          let a = (r[0].indexOf("!") === 0 ? 5 : 4) + r[1].length + n;
          r[2] = r[2].substring(0, n), r[0] = r[0].substring(0, a).trim(), r[3] = "";
        }
      }
      let s = r[2], o = "";
      if (this.options.pedantic) {
        let n = this.rules.other.pedanticHrefTitle.exec(s);
        n && (s = n[1], o = n[3]);
      } else o = r[3] ? r[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(i) ? s = s.slice(1) : s = s.slice(1, -1)), vd(r, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: o && o.replace(this.rules.inline.anyPunctuation, "$1") }, r[0], this.lexer, this.rules);
    }
  }
  reflink(t, r) {
    let i;
    if ((i = this.rules.inline.reflink.exec(t)) || (i = this.rules.inline.nolink.exec(t))) {
      let s = (i[2] || i[1]).replace(this.rules.other.multipleSpaceGlobal, " "), o = r[s.toLowerCase()];
      if (!o) {
        let n = i[0].charAt(0);
        return { type: "text", raw: n, text: n };
      }
      return vd(i, o, i[0], this.lexer, this.rules);
    }
  }
  emStrong(t, r, i = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && i.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !i || this.rules.inline.punctuation.exec(i))) {
      let o = [...s[0]].length - 1, n, a, l = o, c = 0, h = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, r = r.slice(-1 * t.length + o); (s = h.exec(r)) != null; ) {
        if (n = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !n) continue;
        if (a = [...n].length, s[3] || s[4]) {
          l += a;
          continue;
        } else if ((s[5] || s[6]) && o % 3 && !((o + a) % 3)) {
          c += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l + c);
        let u = [...s[0]][0].length, d = t.slice(0, o + s.index + u + a);
        if (Math.min(o, a) % 2) {
          let m = d.slice(1, -1);
          return { type: "em", raw: d, text: m, tokens: this.lexer.inlineTokens(m) };
        }
        let f = d.slice(2, -2);
        return { type: "strong", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
      }
    }
  }
  codespan(t) {
    let r = this.rules.inline.code.exec(t);
    if (r) {
      let i = r[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(i), o = this.rules.other.startingSpaceChar.test(i) && this.rules.other.endingSpaceChar.test(i);
      return s && o && (i = i.substring(1, i.length - 1)), { type: "codespan", raw: r[0], text: i };
    }
  }
  br(t) {
    let r = this.rules.inline.br.exec(t);
    if (r) return { type: "br", raw: r[0] };
  }
  del(t) {
    let r = this.rules.inline.del.exec(t);
    if (r) return { type: "del", raw: r[0], text: r[2], tokens: this.lexer.inlineTokens(r[2]) };
  }
  autolink(t) {
    let r = this.rules.inline.autolink.exec(t);
    if (r) {
      let i, s;
      return r[2] === "@" ? (i = r[1], s = "mailto:" + i) : (i = r[1], s = i), { type: "link", raw: r[0], text: i, href: s, tokens: [{ type: "text", raw: i, text: i }] };
    }
  }
  url(t) {
    let r;
    if (r = this.rules.inline.url.exec(t)) {
      let i, s;
      if (r[2] === "@") i = r[0], s = "mailto:" + i;
      else {
        let o;
        do
          o = r[0], r[0] = this.rules.inline._backpedal.exec(r[0])?.[0] ?? "";
        while (o !== r[0]);
        i = r[0], r[1] === "www." ? s = "http://" + r[0] : s = r[0];
      }
      return { type: "link", raw: r[0], text: i, href: s, tokens: [{ type: "text", raw: i, text: i }] };
    }
  }
  inlineText(t) {
    let r = this.rules.inline.text.exec(t);
    if (r) {
      let i = this.lexer.state.inRawBlock;
      return { type: "text", raw: r[0], text: r[0], escaped: i };
    }
  }
}, Ke = class Kl {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || _i, this.options.tokenizer = this.options.tokenizer || new Fn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: Te, block: Yo.normal, inline: $s.normal };
    this.options.pedantic ? (r.block = Yo.pedantic, r.inline = $s.pedantic) : this.options.gfm && (r.block = Yo.gfm, this.options.breaks ? r.inline = $s.breaks : r.inline = $s.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Yo, inline: $s };
  }
  static lex(t, r) {
    return new Kl(r).lex(t);
  }
  static lexInline(t, r) {
    return new Kl(r).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(Te.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let i = this.inlineQueue[r];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, r = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(Te.tabCharGlobal, "    ").replace(Te.spaceLine, "")); t; ) {
      let s;
      if (this.options.extensions?.block?.some((n) => (s = n.call({ lexer: this }, t, r)) ? (t = t.substring(s.raw.length), r.push(s), !0) : !1)) continue;
      if (s = this.tokenizer.space(t)) {
        t = t.substring(s.raw.length);
        let n = r.at(-1);
        s.raw.length === 1 && n !== void 0 ? n.raw += `
` : r.push(s);
        continue;
      }
      if (s = this.tokenizer.code(t)) {
        t = t.substring(s.raw.length);
        let n = r.at(-1);
        n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith(`
`) ? "" : `
`) + s.raw, n.text += `
` + s.text, this.inlineQueue.at(-1).src = n.text) : r.push(s);
        continue;
      }
      if (s = this.tokenizer.fences(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.heading(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.hr(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.blockquote(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.list(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.html(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.def(t)) {
        t = t.substring(s.raw.length);
        let n = r.at(-1);
        n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith(`
`) ? "" : `
`) + s.raw, n.text += `
` + s.raw, this.inlineQueue.at(-1).src = n.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = { href: s.href, title: s.title }, r.push(s));
        continue;
      }
      if (s = this.tokenizer.table(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.lheading(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      let o = t;
      if (this.options.extensions?.startBlock) {
        let n = 1 / 0, a = t.slice(1), l;
        this.options.extensions.startBlock.forEach((c) => {
          l = c.call({ lexer: this }, a), typeof l == "number" && l >= 0 && (n = Math.min(n, l));
        }), n < 1 / 0 && n >= 0 && (o = t.substring(0, n + 1));
      }
      if (this.state.top && (s = this.tokenizer.paragraph(o))) {
        let n = r.at(-1);
        i && n?.type === "paragraph" ? (n.raw += (n.raw.endsWith(`
`) ? "" : `
`) + s.raw, n.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : r.push(s), i = o.length !== t.length, t = t.substring(s.raw.length);
        continue;
      }
      if (s = this.tokenizer.text(t)) {
        t = t.substring(s.raw.length);
        let n = r.at(-1);
        n?.type === "text" ? (n.raw += (n.raw.endsWith(`
`) ? "" : `
`) + s.raw, n.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : r.push(s);
        continue;
      }
      if (t) {
        let n = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(n);
          break;
        } else throw new Error(n);
      }
    }
    return this.state.top = !0, r;
  }
  inline(t, r = []) {
    return this.inlineQueue.push({ src: t, tokens: r }), r;
  }
  inlineTokens(t, r = []) {
    let i = t, s = null;
    if (this.tokens.links) {
      let l = Object.keys(this.tokens.links);
      if (l.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; ) l.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; ) i = i.slice(0, s.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let o;
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; ) o = s[2] ? s[2].length : 0, i = i.slice(0, s.index + o) + "[" + "a".repeat(s[0].length - o - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    i = this.options.hooks?.emStrongMask?.call({ lexer: this }, i) ?? i;
    let n = !1, a = "";
    for (; t; ) {
      n || (a = ""), n = !1;
      let l;
      if (this.options.extensions?.inline?.some((h) => (l = h.call({ lexer: this }, t, r)) ? (t = t.substring(l.raw.length), r.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.escape(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.tag(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.link(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(l.raw.length);
        let h = r.at(-1);
        l.type === "text" && h?.type === "text" ? (h.raw += l.raw, h.text += l.text) : r.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(t, i, a)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.codespan(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.br(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.del(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.autolink(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (!this.state.inLink && (l = this.tokenizer.url(t))) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      let c = t;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, u = t.slice(1), d;
        this.options.extensions.startInline.forEach((f) => {
          d = f.call({ lexer: this }, u), typeof d == "number" && d >= 0 && (h = Math.min(h, d));
        }), h < 1 / 0 && h >= 0 && (c = t.substring(0, h + 1));
      }
      if (l = this.tokenizer.inlineText(c)) {
        t = t.substring(l.raw.length), l.raw.slice(-1) !== "_" && (a = l.raw.slice(-1)), n = !0;
        let h = r.at(-1);
        h?.type === "text" ? (h.raw += l.raw, h.text += l.text) : r.push(l);
        continue;
      }
      if (t) {
        let h = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
      }
    }
    return r;
  }
}, Mn = class {
  options;
  parser;
  constructor(t) {
    this.options = t || _i;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: r, escaped: i }) {
    let s = (r || "").match(Te.notSpaceStart)?.[0], o = t.replace(Te.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + ar(s) + '">' + (i ? o : ar(o, !0)) + `</code></pre>
` : "<pre><code>" + (i ? o : ar(o, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: r }) {
    return `<h${r}>${this.parser.parseInline(t)}</h${r}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let r = t.ordered, i = t.start, s = "";
    for (let a = 0; a < t.items.length; a++) {
      let l = t.items[a];
      s += this.listitem(l);
    }
    let o = r ? "ol" : "ul", n = r && i !== 1 ? ' start="' + i + '"' : "";
    return "<" + o + n + `>
` + s + "</" + o + `>
`;
  }
  listitem(t) {
    let r = "";
    if (t.task) {
      let i = this.checkbox({ checked: !!t.checked });
      t.loose ? t.tokens[0]?.type === "paragraph" ? (t.tokens[0].text = i + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = i + " " + ar(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({ type: "text", raw: i + " ", text: i + " ", escaped: !0 }) : r += i + " ";
    }
    return r += this.parser.parse(t.tokens, !!t.loose), `<li>${r}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let r = "", i = "";
    for (let o = 0; o < t.header.length; o++) i += this.tablecell(t.header[o]);
    r += this.tablerow({ text: i });
    let s = "";
    for (let o = 0; o < t.rows.length; o++) {
      let n = t.rows[o];
      i = "";
      for (let a = 0; a < n.length; a++) i += this.tablecell(n[a]);
      s += this.tablerow({ text: i });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + r + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let r = this.parser.parseInline(t.tokens), i = t.header ? "th" : "td";
    return (t.align ? `<${i} align="${t.align}">` : `<${i}>`) + r + `</${i}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${ar(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: r, tokens: i }) {
    let s = this.parser.parseInline(i), o = Td(t);
    if (o === null) return s;
    t = o;
    let n = '<a href="' + t + '"';
    return r && (n += ' title="' + ar(r) + '"'), n += ">" + s + "</a>", n;
  }
  image({ href: t, title: r, text: i, tokens: s }) {
    s && (i = this.parser.parseInline(s, this.parser.textRenderer));
    let o = Td(t);
    if (o === null) return ar(i);
    t = o;
    let n = `<img src="${t}" alt="${i}"`;
    return r && (n += ` title="${ar(r)}"`), n += ">", n;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : ar(t.text);
  }
}, lc = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
}, Ze = class Zl {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || _i, this.options.renderer = this.options.renderer || new Mn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new lc();
  }
  static parse(t, r) {
    return new Zl(r).parse(t);
  }
  static parseInline(t, r) {
    return new Zl(r).parseInline(t);
  }
  parse(t, r = !0) {
    let i = "";
    for (let s = 0; s < t.length; s++) {
      let o = t[s];
      if (this.options.extensions?.renderers?.[o.type]) {
        let a = o, l = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (l !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          i += l || "";
          continue;
        }
      }
      let n = o;
      switch (n.type) {
        case "space": {
          i += this.renderer.space(n);
          continue;
        }
        case "hr": {
          i += this.renderer.hr(n);
          continue;
        }
        case "heading": {
          i += this.renderer.heading(n);
          continue;
        }
        case "code": {
          i += this.renderer.code(n);
          continue;
        }
        case "table": {
          i += this.renderer.table(n);
          continue;
        }
        case "blockquote": {
          i += this.renderer.blockquote(n);
          continue;
        }
        case "list": {
          i += this.renderer.list(n);
          continue;
        }
        case "html": {
          i += this.renderer.html(n);
          continue;
        }
        case "def": {
          i += this.renderer.def(n);
          continue;
        }
        case "paragraph": {
          i += this.renderer.paragraph(n);
          continue;
        }
        case "text": {
          let a = n, l = this.renderer.text(a);
          for (; s + 1 < t.length && t[s + 1].type === "text"; ) a = t[++s], l += `
` + this.renderer.text(a);
          r ? i += this.renderer.paragraph({ type: "paragraph", raw: l, text: l, tokens: [{ type: "text", raw: l, text: l, escaped: !0 }] }) : i += l;
          continue;
        }
        default: {
          let a = 'Token with "' + n.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return i;
  }
  parseInline(t, r = this.renderer) {
    let i = "";
    for (let s = 0; s < t.length; s++) {
      let o = t[s];
      if (this.options.extensions?.renderers?.[o.type]) {
        let a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          i += a || "";
          continue;
        }
      }
      let n = o;
      switch (n.type) {
        case "escape": {
          i += r.text(n);
          break;
        }
        case "html": {
          i += r.html(n);
          break;
        }
        case "link": {
          i += r.link(n);
          break;
        }
        case "image": {
          i += r.image(n);
          break;
        }
        case "strong": {
          i += r.strong(n);
          break;
        }
        case "em": {
          i += r.em(n);
          break;
        }
        case "codespan": {
          i += r.codespan(n);
          break;
        }
        case "br": {
          i += r.br(n);
          break;
        }
        case "del": {
          i += r.del(n);
          break;
        }
        case "text": {
          i += r.text(n);
          break;
        }
        default: {
          let a = 'Token with "' + n.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return i;
  }
}, js = class {
  options;
  block;
  constructor(t) {
    this.options = t || _i;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? Ke.lex : Ke.lexInline;
  }
  provideParser() {
    return this.block ? Ze.parse : Ze.parseInline;
  }
}, Lv = class {
  defaults = tc();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Ze;
  Renderer = Mn;
  TextRenderer = lc;
  Lexer = Ke;
  Tokenizer = Fn;
  Hooks = js;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, r) {
    let i = [];
    for (let s of t) switch (i = i.concat(r.call(this, s)), s.type) {
      case "table": {
        let o = s;
        for (let n of o.header) i = i.concat(this.walkTokens(n.tokens, r));
        for (let n of o.rows) for (let a of n) i = i.concat(this.walkTokens(a.tokens, r));
        break;
      }
      case "list": {
        let o = s;
        i = i.concat(this.walkTokens(o.items, r));
        break;
      }
      default: {
        let o = s;
        this.defaults.extensions?.childTokens?.[o.type] ? this.defaults.extensions.childTokens[o.type].forEach((n) => {
          let a = o[n].flat(1 / 0);
          i = i.concat(this.walkTokens(a, r));
        }) : o.tokens && (i = i.concat(this.walkTokens(o.tokens, r)));
      }
    }
    return i;
  }
  use(...t) {
    let r = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((i) => {
      let s = { ...i };
      if (s.async = this.defaults.async || s.async || !1, i.extensions && (i.extensions.forEach((o) => {
        if (!o.name) throw new Error("extension name required");
        if ("renderer" in o) {
          let n = r.renderers[o.name];
          n ? r.renderers[o.name] = function(...a) {
            let l = o.renderer.apply(this, a);
            return l === !1 && (l = n.apply(this, a)), l;
          } : r.renderers[o.name] = o.renderer;
        }
        if ("tokenizer" in o) {
          if (!o.level || o.level !== "block" && o.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let n = r[o.level];
          n ? n.unshift(o.tokenizer) : r[o.level] = [o.tokenizer], o.start && (o.level === "block" ? r.startBlock ? r.startBlock.push(o.start) : r.startBlock = [o.start] : o.level === "inline" && (r.startInline ? r.startInline.push(o.start) : r.startInline = [o.start]));
        }
        "childTokens" in o && o.childTokens && (r.childTokens[o.name] = o.childTokens);
      }), s.extensions = r), i.renderer) {
        let o = this.defaults.renderer || new Mn(this.defaults);
        for (let n in i.renderer) {
          if (!(n in o)) throw new Error(`renderer '${n}' does not exist`);
          if (["options", "parser"].includes(n)) continue;
          let a = n, l = i.renderer[a], c = o[a];
          o[a] = (...h) => {
            let u = l.apply(o, h);
            return u === !1 && (u = c.apply(o, h)), u || "";
          };
        }
        s.renderer = o;
      }
      if (i.tokenizer) {
        let o = this.defaults.tokenizer || new Fn(this.defaults);
        for (let n in i.tokenizer) {
          if (!(n in o)) throw new Error(`tokenizer '${n}' does not exist`);
          if (["options", "rules", "lexer"].includes(n)) continue;
          let a = n, l = i.tokenizer[a], c = o[a];
          o[a] = (...h) => {
            let u = l.apply(o, h);
            return u === !1 && (u = c.apply(o, h)), u;
          };
        }
        s.tokenizer = o;
      }
      if (i.hooks) {
        let o = this.defaults.hooks || new js();
        for (let n in i.hooks) {
          if (!(n in o)) throw new Error(`hook '${n}' does not exist`);
          if (["options", "block"].includes(n)) continue;
          let a = n, l = i.hooks[a], c = o[a];
          js.passThroughHooks.has(n) ? o[a] = (h) => {
            if (this.defaults.async && js.passThroughHooksRespectAsync.has(n)) return (async () => {
              let d = await l.call(o, h);
              return c.call(o, d);
            })();
            let u = l.call(o, h);
            return c.call(o, u);
          } : o[a] = (...h) => {
            if (this.defaults.async) return (async () => {
              let d = await l.apply(o, h);
              return d === !1 && (d = await c.apply(o, h)), d;
            })();
            let u = l.apply(o, h);
            return u === !1 && (u = c.apply(o, h)), u;
          };
        }
        s.hooks = o;
      }
      if (i.walkTokens) {
        let o = this.defaults.walkTokens, n = i.walkTokens;
        s.walkTokens = function(a) {
          let l = [];
          return l.push(n.call(this, a)), o && (l = l.concat(o.call(this, a))), l;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, r) {
    return Ke.lex(t, r ?? this.defaults);
  }
  parser(t, r) {
    return Ze.parse(t, r ?? this.defaults);
  }
  parseMarkdown(t) {
    return (r, i) => {
      let s = { ...i }, o = { ...this.defaults, ...s }, n = this.onError(!!o.silent, !!o.async);
      if (this.defaults.async === !0 && s.async === !1) return n(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof r > "u" || r === null) return n(new Error("marked(): input parameter is undefined or null"));
      if (typeof r != "string") return n(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(r) + ", string expected"));
      if (o.hooks && (o.hooks.options = o, o.hooks.block = t), o.async) return (async () => {
        let a = o.hooks ? await o.hooks.preprocess(r) : r, l = await (o.hooks ? await o.hooks.provideLexer() : t ? Ke.lex : Ke.lexInline)(a, o), c = o.hooks ? await o.hooks.processAllTokens(l) : l;
        o.walkTokens && await Promise.all(this.walkTokens(c, o.walkTokens));
        let h = await (o.hooks ? await o.hooks.provideParser() : t ? Ze.parse : Ze.parseInline)(c, o);
        return o.hooks ? await o.hooks.postprocess(h) : h;
      })().catch(n);
      try {
        o.hooks && (r = o.hooks.preprocess(r));
        let a = (o.hooks ? o.hooks.provideLexer() : t ? Ke.lex : Ke.lexInline)(r, o);
        o.hooks && (a = o.hooks.processAllTokens(a)), o.walkTokens && this.walkTokens(a, o.walkTokens);
        let l = (o.hooks ? o.hooks.provideParser() : t ? Ze.parse : Ze.parseInline)(a, o);
        return o.hooks && (l = o.hooks.postprocess(l)), l;
      } catch (a) {
        return n(a);
      }
    };
  }
  onError(t, r) {
    return (i) => {
      if (i.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let s = "<p>An error occurred:</p><pre>" + ar(i.message + "", !0) + "</pre>";
        return r ? Promise.resolve(s) : s;
      }
      if (r) return Promise.reject(i);
      throw i;
    };
  }
}, Ci = new Lv();
function jt(e, t) {
  return Ci.parse(e, t);
}
jt.options = jt.setOptions = function(e) {
  return Ci.setOptions(e), jt.defaults = Ci.defaults, xm(jt.defaults), jt;
};
jt.getDefaults = tc;
jt.defaults = _i;
jt.use = function(...e) {
  return Ci.use(...e), jt.defaults = Ci.defaults, xm(jt.defaults), jt;
};
jt.walkTokens = function(e, t) {
  return Ci.walkTokens(e, t);
};
jt.parseInline = Ci.parseInline;
jt.Parser = Ze;
jt.parser = Ze.parse;
jt.Renderer = Mn;
jt.TextRenderer = lc;
jt.Lexer = Ke;
jt.lexer = Ke.lex;
jt.Tokenizer = Fn;
jt.Hooks = js;
jt.parse = jt;
jt.options;
jt.setOptions;
jt.use;
jt.walkTokens;
jt.parseInline;
Ze.parse;
Ke.lex;
function Am(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  var i = Array.from(typeof e == "string" ? [e] : e);
  i[i.length - 1] = i[i.length - 1].replace(/\r?\n([\t ]*)$/, "");
  var s = i.reduce(function(a, l) {
    var c = l.match(/\n([\t ]+|(?!\s).)/g);
    return c ? a.concat(c.map(function(h) {
      var u, d;
      return (d = (u = h.match(/[\t ]/g)) === null || u === void 0 ? void 0 : u.length) !== null && d !== void 0 ? d : 0;
    })) : a;
  }, []);
  if (s.length) {
    var o = new RegExp(`
[	 ]{`.concat(Math.min.apply(Math, s), "}"), "g");
    i = i.map(function(a) {
      return a.replace(o, `
`);
    });
  }
  i[0] = i[0].replace(/^\r?\n/, "");
  var n = i[0];
  return t.forEach(function(a, l) {
    var c = n.match(/(?:^|\n)( *)$/), h = c ? c[1] : "", u = a;
    typeof a == "string" && a.includes(`
`) && (u = String(a).split(`
`).map(function(d, f) {
      return f === 0 ? d : "".concat(h).concat(d);
    }).join(`
`)), n += u + i[l + 1];
  }), n;
}
var Ql = typeof performance < "u" && typeof performance.now == "function", Ii = /* @__PURE__ */ p(() => Ql ? performance.now() : 0, "now"), Ra = "🧜 ", Av = "Mermaid render", Ev = "Mermaid", Fv = {
  parse: "tertiary",
  prepare: "secondary",
  measure: "primary",
  layout: "primary-dark",
  layoutCore: "error",
  draw: "primary-light",
  paint: "secondary-dark",
  serialize: "tertiary-dark",
  render: "primary-light"
}, hs;
hs = class {
  constructor() {
    this.enabled = !1, this.autoPrint = !0, this.records = [], this.maxRecords = 200, this.roots = [], this.stack = [], this.buckets = {};
  }
  enable() {
    return this.enabled = !0, this;
  }
  disable() {
    return this.enabled = !1, this;
  }
  /** Begin a new top-level measurement (one per diagram render). */
  start(t) {
    this.enabled && (this.roots = [], this.stack = [], this.buckets = {}, this.begin(t));
  }
  /**
   * Accumulate the wall-clock of a synchronous sub-operation into a named bucket,
   * summed over every call within the render — for hot operations that run too
   * often to be individual tree spans (e.g. per-node `getBBox`). Returns the
   * function's result. No-op (just calls `fn`) unless enabled.
   */
  tickSync(t, r) {
    if (!this.enabled)
      return r();
    const i = Ii();
    try {
      return r();
    } finally {
      this.buckets[t] = (this.buckets[t] ?? 0) + (Ii() - i);
    }
  }
  /**
   * Async variant of {@link tickSync}. WARNING: only meaningful for operations
   * that run one-at-a-time. Do NOT use it for calls awaited concurrently (e.g.
   * `Promise.all(nodes.map(...))`) — their wall-clocks overlap and the summed
   * bucket balloons far past the real elapsed time. For concurrent CPU
   * attribution use a DevTools CPU profile instead.
   */
  async tick(t, r) {
    if (!this.enabled)
      return r();
    const i = Ii();
    try {
      return await r();
    } finally {
      this.buckets[t] = (this.buckets[t] ?? 0) + (Ii() - i);
    }
  }
  /** End the current top-level measurement and optionally print a summary. */
  stop() {
    if (!this.enabled)
      return;
    for (; this.stack.length > 0; )
      this.end();
    const t = this.roots.at(-1), r = this.runLabel ?? t?.name;
    return t && (this.records.push({ label: r ?? t.name, tree: t, buckets: { ...this.buckets } }), this.records.length > this.maxRecords && this.records.splice(0, this.records.length - this.maxRecords), this.autoPrint && this.printSummary(t, r)), this.runLabel = void 0, t;
  }
  /** Open a child span. Pair with {@link end}. No-op unless enabled. */
  begin(t) {
    if (!this.enabled)
      return;
    const r = { name: t, start: Ii(), duration: -1, children: [] }, i = this.stack.at(-1);
    if (i ? i.children.push(r) : this.roots.push(r), this.stack.push(r), Ql && typeof performance.mark == "function")
      try {
        performance.mark(`${Ra}${t} ▶`);
      } catch {
      }
  }
  /** Close the most recently opened span. No-op unless enabled. */
  end() {
    if (!this.enabled)
      return;
    const t = this.stack.pop();
    if (!t)
      return;
    const r = Ii();
    if (t.duration = r - t.start, Ql && typeof performance.measure == "function")
      try {
        performance.measure(`${Ra}${t.name}`, {
          start: t.start,
          end: r,
          detail: {
            devtools: {
              dataType: "track-entry",
              track: Av,
              trackGroup: Ev,
              color: Fv[t.name] ?? "primary",
              tooltipText: `${t.name} — ${t.duration.toFixed(1)} ms`
            }
          }
        });
      } catch {
      }
  }
  /**
   * Measure an async phase. Returns the wrapped function's result and rethrows
   * any error after closing the span, so instrumentation never swallows
   * failures or leaks an open span. No measurement overhead unless enabled.
   */
  async span(t, r) {
    if (!this.enabled)
      return r();
    this.begin(t);
    try {
      return await r();
    } finally {
      this.end();
    }
  }
  /** The most recent completed render tree, or `undefined`. */
  report() {
    return this.records.at(-1)?.tree ?? this.roots.at(-1);
  }
  /** Drop all collected records and any in-progress spans. */
  clear() {
    this.records.length = 0, this.roots = [], this.stack = [], this.runLabel = void 0;
  }
  reset() {
    this.roots = [], this.stack = [];
  }
  printSummary(t = this.report(), r) {
    if (!t)
      return;
    const i = t.duration, s = r && r !== t.name ? `${t.name} [${r}]` : t.name, o = ["ms        %    phase"], n = /* @__PURE__ */ p((l, c) => {
      const h = "  ".repeat(c), u = l.duration.toFixed(1).padStart(8), d = i > 0 ? `${(l.duration / i * 100).toFixed(0).padStart(3)}%` : "   -";
      o.push(`${u}  ${d}  ${h}${l.name}`);
      for (const f of l.children)
        n(f, c + 1);
      if (l.children.length > 0) {
        const f = l.children.reduce((y, x) => y + x.duration, 0), m = l.duration - f;
        if (m > 0.5) {
          const y = m.toFixed(1).padStart(8);
          o.push(`${y}       ${h}  (self)`);
        }
      }
    }, "walk");
    n(t, 0);
    const a = Object.keys(this.buckets);
    if (a.length > 0) {
      o.push("—— buckets (summed) ——");
      for (const l of a)
        o.push(`${this.buckets[l].toFixed(1).padStart(8)}       ${l}`);
    }
    console.log(`${Ra}mermaid render profile · ${s}
${o.join(`
`)}`);
  }
}, p(hs, "Profiler");
globalThis.injected ??= {
  includeLargeFeatures: !0,
  profiling: !1,
  version: "0.0.0"
};
var Mv = (
  // @ts-expect-error -- fastdom types aren't yet ESM-compatible, we need this hack
  z_.extend({
    /**
     * `requestAnimationFrame` is too slow compared to `queueMicrotask`.
     */
    raf(e) {
      typeof queueMicrotask == "function" ? queueMicrotask(e) : setTimeout(e, 0);
    }
  }).extend(U_)
), bi = Mv;
function Em(e, { markdownAutoWrap: t }) {
  const i = e.replace(/<br\/>/g, `
`).replace(/\n{2,}/g, `
`);
  return Am(i);
}
p(Em, "preprocessMarkdown");
function Fm(e) {
  return e.split(/\\n|\n|<br\s*\/?>/gi).map(
    (t) => t.trim().match(/<[^>]+>|[^\s<>]+/g)?.map((r) => ({ content: r, type: "normal" })) ?? []
  );
}
p(Fm, "nonMarkdownToLines");
function Mm(e, t = {}) {
  const r = Em(e, t), i = jt.lexer(r), s = [[]];
  let o = 0;
  function n(a, l = "normal") {
    a.type === "text" ? a.text.split(`
`).forEach((h, u) => {
      u !== 0 && (o++, s.push([])), h.split(" ").forEach((d) => {
        d = d.replace(/&#39;/g, "'"), d && s[o].push({ content: d, type: l });
      });
    }) : a.type === "strong" || a.type === "em" ? a.tokens.forEach((c) => {
      n(c, a.type);
    }) : a.type === "html" && s[o].push({ content: a.text, type: "normal" });
  }
  return p(n, "processNode"), i.forEach((a) => {
    a.type === "paragraph" ? a.tokens?.forEach((l) => {
      n(l);
    }) : a.type === "html" ? s[o].push({ content: a.text, type: "normal" }) : s[o].push({ content: a.raw, type: "normal" });
  }), s;
}
p(Mm, "markdownToLines");
function $m(e) {
  return e ? `<p>${/**
  * Replace new lines with <br /> tags.
  *
  * Unlike in markdown text, `\n` sequences are treated as line breaks here.
  */
  e.replace(/\\n|\n/g, "<br />")}</p>` : "";
}
p($m, "nonMarkdownToHTML");
function Om(e, { markdownAutoWrap: t } = {}) {
  const r = jt.lexer(e);
  function i(s) {
    return s.type === "text" ? t === !1 ? s.text.replace(/\n */g, "<br/>").replace(/ /g, "&nbsp;") : s.text.replace(/\n */g, "<br/>") : s.type === "strong" ? `<strong>${s.tokens?.map(i).join("")}</strong>` : s.type === "em" ? `<em>${s.tokens?.map(i).join("")}</em>` : s.type === "paragraph" ? `<p>${s.tokens?.map(i).join("")}</p>` : s.type === "space" ? "" : s.type === "html" ? `${s.text}` : s.type === "escape" ? s.text : (q.warn(`Unsupported markdown: ${s.type}`), s.raw);
  }
  return p(i, "output"), r.map(i).join("");
}
p(Om, "markdownToHTML");
function Im(e) {
  return Intl.Segmenter ? [...new Intl.Segmenter().segment(e)].map((t) => t.segment) : [...e];
}
p(Im, "splitTextToChars");
function Dm(e, t) {
  const r = Im(t.content);
  return hc(e, [], r, t.type);
}
p(Dm, "splitWordToFitWidth");
function hc(e, t, r, i) {
  if (r.length === 0)
    return [
      { content: t.join(""), type: i },
      { content: "", type: i }
    ];
  const [s, ...o] = r, n = [...t, s];
  return e([{ content: n.join(""), type: i }]) ? hc(e, n, o, i) : (t.length === 0 && s && (t.push(s), r.shift()), [
    { content: t.join(""), type: i },
    { content: r.join(""), type: i }
  ]);
}
p(hc, "splitWordToFitWidthRecursion");
function Pm(e, t) {
  if (e.some(({ content: r }) => r.includes(`
`)))
    throw new Error("splitLineToFitWidth does not support newlines in the line");
  return $n(e, t);
}
p(Pm, "splitLineToFitWidth");
function $n(e, t, r = [], i = []) {
  if (e.length === 0)
    return i.length > 0 && r.push(i), r.length > 0 ? r : [];
  let s = "";
  e[0].content === " " && (s = " ", e.shift());
  const o = e.shift() ?? { content: " ", type: "normal" }, n = [...i];
  if (s !== "" && n.push({ content: s, type: "normal" }), n.push(o), t(n))
    return $n(e, t, r, n);
  if (i.length > 0)
    r.push(i), e.unshift(o);
  else if (o.content) {
    const [a, l] = Dm(t, o);
    r.push([a]), l.content && e.unshift(l);
  }
  return $n(e, t, r);
}
p($n, "splitLineToFitWidthRecursion");
function Jl(e, t) {
  t && e.attr("style", t);
}
p(Jl, "applyStyle");
var Bd = 16384;
async function Rm(e, t, r, i, s = !1, o = Kt()) {
  const n = e.append("foreignObject");
  n.attr("width", `${Math.min(10 * r, Bd)}px`), n.attr("height", `${Math.min(10 * r, Bd)}px`);
  const a = n.append("xhtml:div"), l = ao(t.label) ? await eg(t.label.replace(So.lineBreakRegex, `
`), o) : He(t.label, o), c = t.isNode ? "nodeLabel" : "edgeLabel", h = a.append("span");
  return h.html(l), Jl(h, t.labelStyle), h.attr("class", `${c} ${i}`), Jl(a, t.labelStyle), a.style("display", "table-cell"), a.style("white-space", "nowrap"), a.style("line-height", "1.5"), r !== Number.POSITIVE_INFINITY && (a.style("max-width", r + "px"), a.style("text-align", "center")), a.attr("xmlns", "http://www.w3.org/1999/xhtml"), s && a.attr("class", "labelBkg"), (await bi.measure(() => a.node().getBoundingClientRect())).width === r && (a.style("display", "table"), a.style("white-space", "break-spaces"), a.style("width", r + "px")), n.node();
}
p(Rm, "addHtmlSpan");
function ta(e, t, r, i = !1) {
  const s = e.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", t * r - 0.1 + "em").attr("dy", r + "em");
  return i && s.attr("text-anchor", "middle"), s;
}
p(ta, "createTspan");
function Nm(e, t, r) {
  const i = e.append("text"), s = ta(i, 1, t);
  ea(s, r);
  const o = s.node().getComputedTextLength();
  return i.remove(), o;
}
p(Nm, "computeWidthOfText");
function $v(e, t, r) {
  const i = e.append("text"), s = ta(i, 1, t);
  ea(s, [{ content: r, type: "normal" }]);
  const o = s.node()?.getBoundingClientRect();
  return o && i.remove(), o;
}
p($v, "computeDimensionOfText");
function qm(e, t, r, i = !1, s = !1) {
  const n = t.append("g"), a = n.insert("rect").attr("class", "background").attr("style", "stroke: none"), l = n.append("text").attr("y", "-10.1");
  s && l.attr("text-anchor", "middle");
  let c = 0;
  for (const h of r) {
    const u = /* @__PURE__ */ p((f) => Nm(n, 1.1, f) <= e, "checkWidth"), d = u(h) ? [h] : Pm(h, u);
    for (const f of d) {
      const m = ta(l, c, 1.1, s);
      ea(m, f), c++;
    }
  }
  if (i) {
    const h = l.node().getBBox(), u = 2;
    return a.attr("x", h.x - u).attr("y", h.y - u).attr("width", h.width + 2 * u).attr("height", h.height + 2 * u), n.node();
  } else
    return l.node();
}
p(qm, "createFormattedText");
function th(e) {
  const t = /&(amp|lt|gt);/g;
  return e.replace(t, (r, i) => {
    switch (i) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      default:
        return r;
    }
  });
}
p(th, "decodeHTMLEntities");
function ea(e, t) {
  e.text(""), t.forEach((r, i) => {
    const s = e.append("tspan").attr("font-style", r.type === "em" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", r.type === "strong" ? "bold" : "normal");
    i === 0 ? s.text(th(r.content)) : s.text(" " + th(r.content));
  });
}
p(ea, "updateTextContentAndStyles");
async function Wm(e, t = {}) {
  const r = [];
  e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, (s, o, n) => (r.push(
    (async () => {
      const a = `${o}:${n}`;
      return await HT(a) ? await vo(a, void 0, { class: "label-icon" }) : `<i class='${He(s, t).replace(":", " ")}'></i>`;
    })()
  ), s));
  const i = await Promise.all(r);
  return e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, () => i.shift() ?? "");
}
p(Wm, "replaceIconSubstring");
var rr = /* @__PURE__ */ p(async (e, t = "", {
  style: r = "",
  isTitle: i = !1,
  classes: s = "",
  useHtmlLabels: o = !0,
  markdown: n = !0,
  isNode: a = !0,
  /**
   * The width to wrap the text within. Set to `Number.POSITIVE_INFINITY` for no wrapping.
   */
  width: l = 200,
  addSvgBackground: c = !1
} = {}, h) => {
  if (q.debug(
    "XYZ createText",
    t,
    r,
    i,
    s,
    o,
    a,
    "addSvgBackground: ",
    c
  ), o) {
    const u = n ? Om(t, h) : $m(t), d = await Wm(Zr(u), h), f = t.replace(/\\\\/g, "\\"), m = {
      isNode: a,
      label: ao(t) ? f : d,
      labelStyle: r.replace("fill:", "color:")
    };
    return await Rm(e, m, l, s, c, h);
  } else {
    const u = Zr(t.replace(/<br\s*\/?>/g, "<br/>")), d = n ? Mm(u.replace("<br>", "<br/>"), h) : Fm(u), f = qm(
      l,
      e,
      d,
      t ? c : !1,
      !a
    );
    if (a) {
      /stroke:/.exec(r) && (r = r.replace("stroke:", "lineColor:"));
      const m = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      Et(f).attr("style", m);
    } else {
      const m = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/background:/g, "fill:");
      Et(f).select("rect").attr("style", m.replace(/background:/g, "fill:"));
      const y = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      Et(f).select("text").attr("style", y);
    }
    return i ? Et(f).selectAll("tspan.text-outer-tspan").classed("title-row", !0) : Et(f).selectAll("tspan.text-outer-tspan").classed("row", !0), f;
  }
}, "createText");
function Na(e, t, r) {
  if (e && e.length) {
    const [i, s] = t, o = Math.PI / 180 * r, n = Math.cos(o), a = Math.sin(o);
    for (const l of e) {
      const [c, h] = l;
      l[0] = (c - i) * n - (h - s) * a + i, l[1] = (c - i) * a + (h - s) * n + s;
    }
  }
}
function Ov(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}
function Iv(e, t, r, i = 1) {
  const s = r, o = Math.max(t, 0.1), n = e[0] && e[0][0] && typeof e[0][0] == "number" ? [e] : e, a = [0, 0];
  if (s) for (const c of n) Na(c, a, s);
  const l = (function(c, h, u) {
    const d = [];
    for (const b of c) {
      const w = [...b];
      Ov(w[0], w[w.length - 1]) || w.push([w[0][0], w[0][1]]), w.length > 2 && d.push(w);
    }
    const f = [];
    h = Math.max(h, 0.1);
    const m = [];
    for (const b of d) for (let w = 0; w < b.length - 1; w++) {
      const _ = b[w], v = b[w + 1];
      if (_[1] !== v[1]) {
        const E = Math.min(_[1], v[1]);
        m.push({ ymin: E, ymax: Math.max(_[1], v[1]), x: E === _[1] ? _[0] : v[0], islope: (v[0] - _[0]) / (v[1] - _[1]) });
      }
    }
    if (m.sort(((b, w) => b.ymin < w.ymin ? -1 : b.ymin > w.ymin ? 1 : b.x < w.x ? -1 : b.x > w.x ? 1 : b.ymax === w.ymax ? 0 : (b.ymax - w.ymax) / Math.abs(b.ymax - w.ymax))), !m.length) return f;
    let y = [], x = m[0].ymin, C = 0;
    for (; y.length || m.length; ) {
      if (m.length) {
        let b = -1;
        for (let w = 0; w < m.length && !(m[w].ymin > x); w++) b = w;
        m.splice(0, b + 1).forEach(((w) => {
          y.push({ s: x, edge: w });
        }));
      }
      if (y = y.filter(((b) => !(b.edge.ymax <= x))), y.sort(((b, w) => b.edge.x === w.edge.x ? 0 : (b.edge.x - w.edge.x) / Math.abs(b.edge.x - w.edge.x))), (u !== 1 || C % h == 0) && y.length > 1) for (let b = 0; b < y.length; b += 2) {
        const w = b + 1;
        if (w >= y.length) break;
        const _ = y[b].edge, v = y[w].edge;
        f.push([[Math.round(_.x), x], [Math.round(v.x), x]]);
      }
      x += u, y.forEach(((b) => {
        b.edge.x = b.edge.x + u * b.edge.islope;
      })), C++;
    }
    return f;
  })(n, o, i);
  if (s) {
    for (const c of n) Na(c, a, -s);
    (function(c, h, u) {
      const d = [];
      c.forEach(((f) => d.push(...f))), Na(d, h, u);
    })(l, a, -s);
  }
  return l;
}
function Ao(e, t) {
  var r;
  const i = t.hachureAngle + 90;
  let s = t.hachureGap;
  s < 0 && (s = 4 * t.strokeWidth), s = Math.round(Math.max(s, 0.1));
  let o = 1;
  return t.roughness >= 1 && (((r = t.randomizer) === null || r === void 0 ? void 0 : r.next()) || Math.random()) > 0.7 && (o = s), Iv(e, s, i, o || 1);
}
class cc {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    return this._fillPolygons(t, r);
  }
  _fillPolygons(t, r) {
    const i = Ao(t, r);
    return { type: "fillSketch", ops: this.renderLines(i, r) };
  }
  renderLines(t, r) {
    const i = [];
    for (const s of t) i.push(...this.helper.doubleLineOps(s[0][0], s[0][1], s[1][0], s[1][1], r));
    return i;
  }
}
function ra(e) {
  const t = e[0], r = e[1];
  return Math.sqrt(Math.pow(t[0] - r[0], 2) + Math.pow(t[1] - r[1], 2));
}
class Dv extends cc {
  fillPolygons(t, r) {
    let i = r.hachureGap;
    i < 0 && (i = 4 * r.strokeWidth), i = Math.max(i, 0.1);
    const s = Ao(t, Object.assign({}, r, { hachureGap: i })), o = Math.PI / 180 * r.hachureAngle, n = [], a = 0.5 * i * Math.cos(o), l = 0.5 * i * Math.sin(o);
    for (const [c, h] of s) ra([c, h]) && n.push([[c[0] - a, c[1] + l], [...h]], [[c[0] + a, c[1] - l], [...h]]);
    return { type: "fillSketch", ops: this.renderLines(n, r) };
  }
}
class Pv extends cc {
  fillPolygons(t, r) {
    const i = this._fillPolygons(t, r), s = Object.assign({}, r, { hachureAngle: r.hachureAngle + 90 }), o = this._fillPolygons(t, s);
    return i.ops = i.ops.concat(o.ops), i;
  }
}
class Rv {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = Ao(t, r = Object.assign({}, r, { hachureAngle: 0 }));
    return this.dotsOnLines(i, r);
  }
  dotsOnLines(t, r) {
    const i = [];
    let s = r.hachureGap;
    s < 0 && (s = 4 * r.strokeWidth), s = Math.max(s, 0.1);
    let o = r.fillWeight;
    o < 0 && (o = r.strokeWidth / 2);
    const n = s / 4;
    for (const a of t) {
      const l = ra(a), c = l / s, h = Math.ceil(c) - 1, u = l - h * s, d = (a[0][0] + a[1][0]) / 2 - s / 4, f = Math.min(a[0][1], a[1][1]);
      for (let m = 0; m < h; m++) {
        const y = f + u + m * s, x = d - n + 2 * Math.random() * n, C = y - n + 2 * Math.random() * n, b = this.helper.ellipse(x, C, o, o, r);
        i.push(...b.ops);
      }
    }
    return { type: "fillSketch", ops: i };
  }
}
class Nv {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = Ao(t, r);
    return { type: "fillSketch", ops: this.dashedLine(i, r) };
  }
  dashedLine(t, r) {
    const i = r.dashOffset < 0 ? r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap : r.dashOffset, s = r.dashGap < 0 ? r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap : r.dashGap, o = [];
    return t.forEach(((n) => {
      const a = ra(n), l = Math.floor(a / (i + s)), c = (a + s - l * (i + s)) / 2;
      let h = n[0], u = n[1];
      h[0] > u[0] && (h = n[1], u = n[0]);
      const d = Math.atan((u[1] - h[1]) / (u[0] - h[0]));
      for (let f = 0; f < l; f++) {
        const m = f * (i + s), y = m + i, x = [h[0] + m * Math.cos(d) + c * Math.cos(d), h[1] + m * Math.sin(d) + c * Math.sin(d)], C = [h[0] + y * Math.cos(d) + c * Math.cos(d), h[1] + y * Math.sin(d) + c * Math.sin(d)];
        o.push(...this.helper.doubleLineOps(x[0], x[1], C[0], C[1], r));
      }
    })), o;
  }
}
class qv {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap, s = r.zigzagOffset < 0 ? i : r.zigzagOffset, o = Ao(t, r = Object.assign({}, r, { hachureGap: i + s }));
    return { type: "fillSketch", ops: this.zigzagLines(o, s, r) };
  }
  zigzagLines(t, r, i) {
    const s = [];
    return t.forEach(((o) => {
      const n = ra(o), a = Math.round(n / (2 * r));
      let l = o[0], c = o[1];
      l[0] > c[0] && (l = o[1], c = o[0]);
      const h = Math.atan((c[1] - l[1]) / (c[0] - l[0]));
      for (let u = 0; u < a; u++) {
        const d = 2 * u * r, f = 2 * (u + 1) * r, m = Math.sqrt(2 * Math.pow(r, 2)), y = [l[0] + d * Math.cos(h), l[1] + d * Math.sin(h)], x = [l[0] + f * Math.cos(h), l[1] + f * Math.sin(h)], C = [y[0] + m * Math.cos(h + Math.PI / 4), y[1] + m * Math.sin(h + Math.PI / 4)];
        s.push(...this.helper.doubleLineOps(y[0], y[1], C[0], C[1], i), ...this.helper.doubleLineOps(C[0], C[1], x[0], x[1], i));
      }
    })), s;
  }
}
const Be = {};
class Wv {
  constructor(t) {
    this.seed = t;
  }
  next() {
    return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
  }
}
const zv = 0, qa = 1, Ld = 2, Uo = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };
function Wa(e, t) {
  return e.type === t;
}
function uc(e) {
  const t = [], r = (function(n) {
    const a = new Array();
    for (; n !== ""; ) if (n.match(/^([ \t\r\n,]+)/)) n = n.substr(RegExp.$1.length);
    else if (n.match(/^([aAcChHlLmMqQsStTvVzZ])/)) a[a.length] = { type: zv, text: RegExp.$1 }, n = n.substr(RegExp.$1.length);
    else {
      if (!n.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) return [];
      a[a.length] = { type: qa, text: `${parseFloat(RegExp.$1)}` }, n = n.substr(RegExp.$1.length);
    }
    return a[a.length] = { type: Ld, text: "" }, a;
  })(e);
  let i = "BOD", s = 0, o = r[s];
  for (; !Wa(o, Ld); ) {
    let n = 0;
    const a = [];
    if (i === "BOD") {
      if (o.text !== "M" && o.text !== "m") return uc("M0,0" + e);
      s++, n = Uo[o.text], i = o.text;
    } else Wa(o, qa) ? n = Uo[i] : (s++, n = Uo[o.text], i = o.text);
    if (!(s + n < r.length)) throw new Error("Path data ended short");
    for (let l = s; l < s + n; l++) {
      const c = r[l];
      if (!Wa(c, qa)) throw new Error("Param not a number: " + i + "," + c.text);
      a[a.length] = +c.text;
    }
    if (typeof Uo[i] != "number") throw new Error("Bad segment: " + i);
    {
      const l = { key: i, data: a };
      t.push(l), s += n, o = r[s], i === "M" && (i = "L"), i === "m" && (i = "l");
    }
  }
  return t;
}
function zm(e) {
  let t = 0, r = 0, i = 0, s = 0;
  const o = [];
  for (const { key: n, data: a } of e) switch (n) {
    case "M":
      o.push({ key: "M", data: [...a] }), [t, r] = a, [i, s] = a;
      break;
    case "m":
      t += a[0], r += a[1], o.push({ key: "M", data: [t, r] }), i = t, s = r;
      break;
    case "L":
      o.push({ key: "L", data: [...a] }), [t, r] = a;
      break;
    case "l":
      t += a[0], r += a[1], o.push({ key: "L", data: [t, r] });
      break;
    case "C":
      o.push({ key: "C", data: [...a] }), t = a[4], r = a[5];
      break;
    case "c": {
      const l = a.map(((c, h) => h % 2 ? c + r : c + t));
      o.push({ key: "C", data: l }), t = l[4], r = l[5];
      break;
    }
    case "Q":
      o.push({ key: "Q", data: [...a] }), t = a[2], r = a[3];
      break;
    case "q": {
      const l = a.map(((c, h) => h % 2 ? c + r : c + t));
      o.push({ key: "Q", data: l }), t = l[2], r = l[3];
      break;
    }
    case "A":
      o.push({ key: "A", data: [...a] }), t = a[5], r = a[6];
      break;
    case "a":
      t += a[5], r += a[6], o.push({ key: "A", data: [a[0], a[1], a[2], a[3], a[4], t, r] });
      break;
    case "H":
      o.push({ key: "H", data: [...a] }), t = a[0];
      break;
    case "h":
      t += a[0], o.push({ key: "H", data: [t] });
      break;
    case "V":
      o.push({ key: "V", data: [...a] }), r = a[0];
      break;
    case "v":
      r += a[0], o.push({ key: "V", data: [r] });
      break;
    case "S":
      o.push({ key: "S", data: [...a] }), t = a[2], r = a[3];
      break;
    case "s": {
      const l = a.map(((c, h) => h % 2 ? c + r : c + t));
      o.push({ key: "S", data: l }), t = l[2], r = l[3];
      break;
    }
    case "T":
      o.push({ key: "T", data: [...a] }), t = a[0], r = a[1];
      break;
    case "t":
      t += a[0], r += a[1], o.push({ key: "T", data: [t, r] });
      break;
    case "Z":
    case "z":
      o.push({ key: "Z", data: [] }), t = i, r = s;
  }
  return o;
}
function Hm(e) {
  const t = [];
  let r = "", i = 0, s = 0, o = 0, n = 0, a = 0, l = 0;
  for (const { key: c, data: h } of e) {
    switch (c) {
      case "M":
        t.push({ key: "M", data: [...h] }), [i, s] = h, [o, n] = h;
        break;
      case "C":
        t.push({ key: "C", data: [...h] }), i = h[4], s = h[5], a = h[2], l = h[3];
        break;
      case "L":
        t.push({ key: "L", data: [...h] }), [i, s] = h;
        break;
      case "H":
        i = h[0], t.push({ key: "L", data: [i, s] });
        break;
      case "V":
        s = h[0], t.push({ key: "L", data: [i, s] });
        break;
      case "S": {
        let u = 0, d = 0;
        r === "C" || r === "S" ? (u = i + (i - a), d = s + (s - l)) : (u = i, d = s), t.push({ key: "C", data: [u, d, ...h] }), a = h[0], l = h[1], i = h[2], s = h[3];
        break;
      }
      case "T": {
        const [u, d] = h;
        let f = 0, m = 0;
        r === "Q" || r === "T" ? (f = i + (i - a), m = s + (s - l)) : (f = i, m = s);
        const y = i + 2 * (f - i) / 3, x = s + 2 * (m - s) / 3, C = u + 2 * (f - u) / 3, b = d + 2 * (m - d) / 3;
        t.push({ key: "C", data: [y, x, C, b, u, d] }), a = f, l = m, i = u, s = d;
        break;
      }
      case "Q": {
        const [u, d, f, m] = h, y = i + 2 * (u - i) / 3, x = s + 2 * (d - s) / 3, C = f + 2 * (u - f) / 3, b = m + 2 * (d - m) / 3;
        t.push({ key: "C", data: [y, x, C, b, f, m] }), a = u, l = d, i = f, s = m;
        break;
      }
      case "A": {
        const u = Math.abs(h[0]), d = Math.abs(h[1]), f = h[2], m = h[3], y = h[4], x = h[5], C = h[6];
        u === 0 || d === 0 ? (t.push({ key: "C", data: [i, s, x, C, x, C] }), i = x, s = C) : (i !== x || s !== C) && (Ym(i, s, x, C, u, d, f, m, y).forEach((function(b) {
          t.push({ key: "C", data: b });
        })), i = x, s = C);
        break;
      }
      case "Z":
        t.push({ key: "Z", data: [] }), i = o, s = n;
    }
    r = c;
  }
  return t;
}
function Is(e, t, r) {
  return [e * Math.cos(r) - t * Math.sin(r), e * Math.sin(r) + t * Math.cos(r)];
}
function Ym(e, t, r, i, s, o, n, a, l, c) {
  const h = (u = n, Math.PI * u / 180);
  var u;
  let d = [], f = 0, m = 0, y = 0, x = 0;
  if (c) [f, m, y, x] = c;
  else {
    [e, t] = Is(e, t, -h), [r, i] = Is(r, i, -h);
    const j = (e - r) / 2, O = (t - i) / 2;
    let I = j * j / (s * s) + O * O / (o * o);
    I > 1 && (I = Math.sqrt(I), s *= I, o *= I);
    const B = s * s, M = o * o, F = B * M - B * O * O - M * j * j, Q = B * O * O + M * j * j, Z = (a === l ? -1 : 1) * Math.sqrt(Math.abs(F / Q));
    y = Z * s * O / o + (e + r) / 2, x = Z * -o * j / s + (t + i) / 2, f = Math.asin(parseFloat(((t - x) / o).toFixed(9))), m = Math.asin(parseFloat(((i - x) / o).toFixed(9))), e < y && (f = Math.PI - f), r < y && (m = Math.PI - m), f < 0 && (f = 2 * Math.PI + f), m < 0 && (m = 2 * Math.PI + m), l && f > m && (f -= 2 * Math.PI), !l && m > f && (m -= 2 * Math.PI);
  }
  let C = m - f;
  if (Math.abs(C) > 120 * Math.PI / 180) {
    const j = m, O = r, I = i;
    m = l && m > f ? f + 120 * Math.PI / 180 * 1 : f + 120 * Math.PI / 180 * -1, d = Ym(r = y + s * Math.cos(m), i = x + o * Math.sin(m), O, I, s, o, n, 0, l, [m, j, y, x]);
  }
  C = m - f;
  const b = Math.cos(f), w = Math.sin(f), _ = Math.cos(m), v = Math.sin(m), E = Math.tan(C / 4), A = 4 / 3 * s * E, L = 4 / 3 * o * E, z = [e, t], W = [e + A * w, t - L * b], R = [r + A * v, i - L * _], st = [r, i];
  if (W[0] = 2 * z[0] - W[0], W[1] = 2 * z[1] - W[1], c) return [W, R, st].concat(d);
  {
    d = [W, R, st].concat(d);
    const j = [];
    for (let O = 0; O < d.length; O += 3) {
      const I = Is(d[O][0], d[O][1], h), B = Is(d[O + 1][0], d[O + 1][1], h), M = Is(d[O + 2][0], d[O + 2][1], h);
      j.push([I[0], I[1], B[0], B[1], M[0], M[1]]);
    }
    return j;
  }
}
const Hv = { randOffset: function(e, t) {
  return vt(e, t);
}, randOffsetWithRange: function(e, t, r) {
  return On(e, t, r);
}, ellipse: function(e, t, r, i, s) {
  const o = jm(r, i, s);
  return eh(e, t, s, o).opset;
}, doubleLineOps: function(e, t, r, i, s) {
  return Qr(e, t, r, i, s, !0);
} };
function Um(e, t, r, i, s) {
  return { type: "path", ops: Qr(e, t, r, i, s) };
}
function cn(e, t, r) {
  const i = (e || []).length;
  if (i > 2) {
    const s = [];
    for (let o = 0; o < i - 1; o++) s.push(...Qr(e[o][0], e[o][1], e[o + 1][0], e[o + 1][1], r));
    return t && s.push(...Qr(e[i - 1][0], e[i - 1][1], e[0][0], e[0][1], r)), { type: "path", ops: s };
  }
  return i === 2 ? Um(e[0][0], e[0][1], e[1][0], e[1][1], r) : { type: "path", ops: [] };
}
function Yv(e, t, r, i, s) {
  return (function(o, n) {
    return cn(o, !0, n);
  })([[e, t], [e + r, t], [e + r, t + i], [e, t + i]], s);
}
function Ad(e, t) {
  if (e.length) {
    const r = typeof e[0][0] == "number" ? [e] : e, i = jo(r[0], 1 * (1 + 0.2 * t.roughness), t), s = t.disableMultiStroke ? [] : jo(r[0], 1.5 * (1 + 0.22 * t.roughness), Md(t));
    for (let o = 1; o < r.length; o++) {
      const n = r[o];
      if (n.length) {
        const a = jo(n, 1 * (1 + 0.2 * t.roughness), t), l = t.disableMultiStroke ? [] : jo(n, 1.5 * (1 + 0.22 * t.roughness), Md(t));
        for (const c of a) c.op !== "move" && i.push(c);
        for (const c of l) c.op !== "move" && s.push(c);
      }
    }
    return { type: "path", ops: i.concat(s) };
  }
  return { type: "path", ops: [] };
}
function jm(e, t, r) {
  const i = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(e / 2, 2) + Math.pow(t / 2, 2)) / 2)), s = Math.ceil(Math.max(r.curveStepCount, r.curveStepCount / Math.sqrt(200) * i)), o = 2 * Math.PI / s;
  let n = Math.abs(e / 2), a = Math.abs(t / 2);
  const l = 1 - r.curveFitting;
  return n += vt(n * l, r), a += vt(a * l, r), { increment: o, rx: n, ry: a };
}
function eh(e, t, r, i) {
  const [s, o] = $d(i.increment, e, t, i.rx, i.ry, 1, i.increment * On(0.1, On(0.4, 1, r), r), r);
  let n = In(s, null, r);
  if (!r.disableMultiStroke && r.roughness !== 0) {
    const [a] = $d(i.increment, e, t, i.rx, i.ry, 1.5, 0, r), l = In(a, null, r);
    n = n.concat(l);
  }
  return { estimatedPoints: o, opset: { type: "path", ops: n } };
}
function Ed(e, t, r, i, s, o, n, a, l) {
  const c = e, h = t;
  let u = Math.abs(r / 2), d = Math.abs(i / 2);
  u += vt(0.01 * u, l), d += vt(0.01 * d, l);
  let f = s, m = o;
  for (; f < 0; ) f += 2 * Math.PI, m += 2 * Math.PI;
  m - f > 2 * Math.PI && (f = 0, m = 2 * Math.PI);
  const y = 2 * Math.PI / l.curveStepCount, x = Math.min(y / 2, (m - f) / 2), C = Od(x, c, h, u, d, f, m, 1, l);
  if (!l.disableMultiStroke) {
    const b = Od(x, c, h, u, d, f, m, 1.5, l);
    C.push(...b);
  }
  return n && (a ? C.push(...Qr(c, h, c + u * Math.cos(f), h + d * Math.sin(f), l), ...Qr(c, h, c + u * Math.cos(m), h + d * Math.sin(m), l)) : C.push({ op: "lineTo", data: [c, h] }, { op: "lineTo", data: [c + u * Math.cos(f), h + d * Math.sin(f)] })), { type: "path", ops: C };
}
function Fd(e, t) {
  const r = Hm(zm(uc(e))), i = [];
  let s = [0, 0], o = [0, 0];
  for (const { key: n, data: a } of r) switch (n) {
    case "M":
      o = [a[0], a[1]], s = [a[0], a[1]];
      break;
    case "L":
      i.push(...Qr(o[0], o[1], a[0], a[1], t)), o = [a[0], a[1]];
      break;
    case "C": {
      const [l, c, h, u, d, f] = a;
      i.push(...Uv(l, c, h, u, d, f, o, t)), o = [d, f];
      break;
    }
    case "Z":
      i.push(...Qr(o[0], o[1], s[0], s[1], t)), o = [s[0], s[1]];
  }
  return { type: "path", ops: i };
}
function za(e, t) {
  const r = [];
  for (const i of e) if (i.length) {
    const s = t.maxRandomnessOffset || 0, o = i.length;
    if (o > 2) {
      r.push({ op: "move", data: [i[0][0] + vt(s, t), i[0][1] + vt(s, t)] });
      for (let n = 1; n < o; n++) r.push({ op: "lineTo", data: [i[n][0] + vt(s, t), i[n][1] + vt(s, t)] });
    }
  }
  return { type: "fillPath", ops: r };
}
function Di(e, t) {
  return (function(r, i) {
    let s = r.fillStyle || "hachure";
    if (!Be[s]) switch (s) {
      case "zigzag":
        Be[s] || (Be[s] = new Dv(i));
        break;
      case "cross-hatch":
        Be[s] || (Be[s] = new Pv(i));
        break;
      case "dots":
        Be[s] || (Be[s] = new Rv(i));
        break;
      case "dashed":
        Be[s] || (Be[s] = new Nv(i));
        break;
      case "zigzag-line":
        Be[s] || (Be[s] = new qv(i));
        break;
      default:
        s = "hachure", Be[s] || (Be[s] = new cc(i));
    }
    return Be[s];
  })(t, Hv).fillPolygons(e, t);
}
function Md(e) {
  const t = Object.assign({}, e);
  return t.randomizer = void 0, e.seed && (t.seed = e.seed + 1), t;
}
function Xm(e) {
  return e.randomizer || (e.randomizer = new Wv(e.seed || 0)), e.randomizer.next();
}
function On(e, t, r, i = 1) {
  return r.roughness * i * (Xm(r) * (t - e) + e);
}
function vt(e, t, r = 1) {
  return On(-e, e, t, r);
}
function Qr(e, t, r, i, s, o = !1) {
  const n = o ? s.disableMultiStrokeFill : s.disableMultiStroke, a = rh(e, t, r, i, s, !0, !1);
  if (n) return a;
  const l = rh(e, t, r, i, s, !0, !0);
  return a.concat(l);
}
function rh(e, t, r, i, s, o, n) {
  const a = Math.pow(e - r, 2) + Math.pow(t - i, 2), l = Math.sqrt(a);
  let c = 1;
  c = l < 200 ? 1 : l > 500 ? 0.4 : -16668e-7 * l + 1.233334;
  let h = s.maxRandomnessOffset || 0;
  h * h * 100 > a && (h = l / 10);
  const u = h / 2, d = 0.2 + 0.2 * Xm(s);
  let f = s.bowing * s.maxRandomnessOffset * (i - t) / 200, m = s.bowing * s.maxRandomnessOffset * (e - r) / 200;
  f = vt(f, s, c), m = vt(m, s, c);
  const y = [], x = () => vt(u, s, c), C = () => vt(h, s, c), b = s.preserveVertices;
  return n ? y.push({ op: "move", data: [e + (b ? 0 : x()), t + (b ? 0 : x())] }) : y.push({ op: "move", data: [e + (b ? 0 : vt(h, s, c)), t + (b ? 0 : vt(h, s, c))] }), n ? y.push({ op: "bcurveTo", data: [f + e + (r - e) * d + x(), m + t + (i - t) * d + x(), f + e + 2 * (r - e) * d + x(), m + t + 2 * (i - t) * d + x(), r + (b ? 0 : x()), i + (b ? 0 : x())] }) : y.push({ op: "bcurveTo", data: [f + e + (r - e) * d + C(), m + t + (i - t) * d + C(), f + e + 2 * (r - e) * d + C(), m + t + 2 * (i - t) * d + C(), r + (b ? 0 : C()), i + (b ? 0 : C())] }), y;
}
function jo(e, t, r) {
  if (!e.length) return [];
  const i = [];
  i.push([e[0][0] + vt(t, r), e[0][1] + vt(t, r)]), i.push([e[0][0] + vt(t, r), e[0][1] + vt(t, r)]);
  for (let s = 1; s < e.length; s++) i.push([e[s][0] + vt(t, r), e[s][1] + vt(t, r)]), s === e.length - 1 && i.push([e[s][0] + vt(t, r), e[s][1] + vt(t, r)]);
  return In(i, null, r);
}
function In(e, t, r) {
  const i = e.length, s = [];
  if (i > 3) {
    const o = [], n = 1 - r.curveTightness;
    s.push({ op: "move", data: [e[1][0], e[1][1]] });
    for (let a = 1; a + 2 < i; a++) {
      const l = e[a];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (n * e[a + 1][0] - n * e[a - 1][0]) / 6, l[1] + (n * e[a + 1][1] - n * e[a - 1][1]) / 6], o[2] = [e[a + 1][0] + (n * e[a][0] - n * e[a + 2][0]) / 6, e[a + 1][1] + (n * e[a][1] - n * e[a + 2][1]) / 6], o[3] = [e[a + 1][0], e[a + 1][1]], s.push({ op: "bcurveTo", data: [o[1][0], o[1][1], o[2][0], o[2][1], o[3][0], o[3][1]] });
    }
  } else i === 3 ? (s.push({ op: "move", data: [e[1][0], e[1][1]] }), s.push({ op: "bcurveTo", data: [e[1][0], e[1][1], e[2][0], e[2][1], e[2][0], e[2][1]] })) : i === 2 && s.push(...rh(e[0][0], e[0][1], e[1][0], e[1][1], r, !0, !0));
  return s;
}
function $d(e, t, r, i, s, o, n, a) {
  const l = [], c = [];
  if (a.roughness === 0) {
    e /= 4, c.push([t + i * Math.cos(-e), r + s * Math.sin(-e)]);
    for (let h = 0; h <= 2 * Math.PI; h += e) {
      const u = [t + i * Math.cos(h), r + s * Math.sin(h)];
      l.push(u), c.push(u);
    }
    c.push([t + i * Math.cos(0), r + s * Math.sin(0)]), c.push([t + i * Math.cos(e), r + s * Math.sin(e)]);
  } else {
    const h = vt(0.5, a) - Math.PI / 2;
    c.push([vt(o, a) + t + 0.9 * i * Math.cos(h - e), vt(o, a) + r + 0.9 * s * Math.sin(h - e)]);
    const u = 2 * Math.PI + h - 0.01;
    for (let d = h; d < u; d += e) {
      const f = [vt(o, a) + t + i * Math.cos(d), vt(o, a) + r + s * Math.sin(d)];
      l.push(f), c.push(f);
    }
    c.push([vt(o, a) + t + i * Math.cos(h + 2 * Math.PI + 0.5 * n), vt(o, a) + r + s * Math.sin(h + 2 * Math.PI + 0.5 * n)]), c.push([vt(o, a) + t + 0.98 * i * Math.cos(h + n), vt(o, a) + r + 0.98 * s * Math.sin(h + n)]), c.push([vt(o, a) + t + 0.9 * i * Math.cos(h + 0.5 * n), vt(o, a) + r + 0.9 * s * Math.sin(h + 0.5 * n)]);
  }
  return [c, l];
}
function Od(e, t, r, i, s, o, n, a, l) {
  const c = o + vt(0.1, l), h = [];
  h.push([vt(a, l) + t + 0.9 * i * Math.cos(c - e), vt(a, l) + r + 0.9 * s * Math.sin(c - e)]);
  for (let u = c; u <= n; u += e) h.push([vt(a, l) + t + i * Math.cos(u), vt(a, l) + r + s * Math.sin(u)]);
  return h.push([t + i * Math.cos(n), r + s * Math.sin(n)]), h.push([t + i * Math.cos(n), r + s * Math.sin(n)]), In(h, null, l);
}
function Uv(e, t, r, i, s, o, n, a) {
  const l = [], c = [a.maxRandomnessOffset || 1, (a.maxRandomnessOffset || 1) + 0.3];
  let h = [0, 0];
  const u = a.disableMultiStroke ? 1 : 2, d = a.preserveVertices;
  for (let f = 0; f < u; f++) f === 0 ? l.push({ op: "move", data: [n[0], n[1]] }) : l.push({ op: "move", data: [n[0] + (d ? 0 : vt(c[0], a)), n[1] + (d ? 0 : vt(c[0], a))] }), h = d ? [s, o] : [s + vt(c[f], a), o + vt(c[f], a)], l.push({ op: "bcurveTo", data: [e + vt(c[f], a), t + vt(c[f], a), r + vt(c[f], a), i + vt(c[f], a), h[0], h[1]] });
  return l;
}
function Ds(e) {
  return [...e];
}
function Id(e, t = 0) {
  const r = e.length;
  if (r < 3) throw new Error("A curve must have at least three points.");
  const i = [];
  if (r === 3) i.push(Ds(e[0]), Ds(e[1]), Ds(e[2]), Ds(e[2]));
  else {
    const s = [];
    s.push(e[0], e[0]);
    for (let a = 1; a < e.length; a++) s.push(e[a]), a === e.length - 1 && s.push(e[a]);
    const o = [], n = 1 - t;
    i.push(Ds(s[0]));
    for (let a = 1; a + 2 < s.length; a++) {
      const l = s[a];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (n * s[a + 1][0] - n * s[a - 1][0]) / 6, l[1] + (n * s[a + 1][1] - n * s[a - 1][1]) / 6], o[2] = [s[a + 1][0] + (n * s[a][0] - n * s[a + 2][0]) / 6, s[a + 1][1] + (n * s[a][1] - n * s[a + 2][1]) / 6], o[3] = [s[a + 1][0], s[a + 1][1]], i.push(o[1], o[2], o[3]);
    }
  }
  return i;
}
function un(e, t) {
  return Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2);
}
function jv(e, t, r) {
  const i = un(t, r);
  if (i === 0) return un(e, t);
  let s = ((e[0] - t[0]) * (r[0] - t[0]) + (e[1] - t[1]) * (r[1] - t[1])) / i;
  return s = Math.max(0, Math.min(1, s)), un(e, ai(t, r, s));
}
function ai(e, t, r) {
  return [e[0] + (t[0] - e[0]) * r, e[1] + (t[1] - e[1]) * r];
}
function ih(e, t, r, i) {
  const s = i || [];
  if ((function(a, l) {
    const c = a[l + 0], h = a[l + 1], u = a[l + 2], d = a[l + 3];
    let f = 3 * h[0] - 2 * c[0] - d[0];
    f *= f;
    let m = 3 * h[1] - 2 * c[1] - d[1];
    m *= m;
    let y = 3 * u[0] - 2 * d[0] - c[0];
    y *= y;
    let x = 3 * u[1] - 2 * d[1] - c[1];
    return x *= x, f < y && (f = y), m < x && (m = x), f + m;
  })(e, t) < r) {
    const a = e[t + 0];
    s.length ? (o = s[s.length - 1], n = a, Math.sqrt(un(o, n)) > 1 && s.push(a)) : s.push(a), s.push(e[t + 3]);
  } else {
    const l = e[t + 0], c = e[t + 1], h = e[t + 2], u = e[t + 3], d = ai(l, c, 0.5), f = ai(c, h, 0.5), m = ai(h, u, 0.5), y = ai(d, f, 0.5), x = ai(f, m, 0.5), C = ai(y, x, 0.5);
    ih([l, d, y, C], 0, r, s), ih([C, x, m, u], 0, r, s);
  }
  var o, n;
  return s;
}
function Xv(e, t) {
  return Dn(e, 0, e.length, t);
}
function Dn(e, t, r, i, s) {
  const o = s || [], n = e[t], a = e[r - 1];
  let l = 0, c = 1;
  for (let h = t + 1; h < r - 1; ++h) {
    const u = jv(e[h], n, a);
    u > l && (l = u, c = h);
  }
  return Math.sqrt(l) > i ? (Dn(e, t, c + 1, i, o), Dn(e, c, r, i, o)) : (o.length || o.push(n), o.push(a)), o;
}
function Ha(e, t = 0.15, r) {
  const i = [], s = (e.length - 1) / 3;
  for (let o = 0; o < s; o++)
    ih(e, 3 * o, t, i);
  return r && r > 0 ? Dn(i, 0, i.length, r) : i;
}
const De = "none";
class Pn {
  constructor(t) {
    this.defaultOptions = { maxRandomnessOffset: 2, roughness: 1, bowing: 1, stroke: "#000", strokeWidth: 1, curveTightness: 0, curveFitting: 0.95, curveStepCount: 9, fillStyle: "hachure", fillWeight: -1, hachureAngle: -41, hachureGap: -1, dashOffset: -1, dashGap: -1, zigzagOffset: -1, seed: 0, disableMultiStroke: !1, disableMultiStrokeFill: !1, preserveVertices: !1, fillShapeRoughnessGain: 0.8 }, this.config = t || {}, this.config.options && (this.defaultOptions = this._o(this.config.options));
  }
  static newSeed() {
    return Math.floor(Math.random() * 2 ** 31);
  }
  _o(t) {
    return t ? Object.assign({}, this.defaultOptions, t) : this.defaultOptions;
  }
  _d(t, r, i) {
    return { shape: t, sets: r || [], options: i || this.defaultOptions };
  }
  line(t, r, i, s, o) {
    const n = this._o(o);
    return this._d("line", [Um(t, r, i, s, n)], n);
  }
  rectangle(t, r, i, s, o) {
    const n = this._o(o), a = [], l = Yv(t, r, i, s, n);
    if (n.fill) {
      const c = [[t, r], [t + i, r], [t + i, r + s], [t, r + s]];
      n.fillStyle === "solid" ? a.push(za([c], n)) : a.push(Di([c], n));
    }
    return n.stroke !== De && a.push(l), this._d("rectangle", a, n);
  }
  ellipse(t, r, i, s, o) {
    const n = this._o(o), a = [], l = jm(i, s, n), c = eh(t, r, n, l);
    if (n.fill) if (n.fillStyle === "solid") {
      const h = eh(t, r, n, l).opset;
      h.type = "fillPath", a.push(h);
    } else a.push(Di([c.estimatedPoints], n));
    return n.stroke !== De && a.push(c.opset), this._d("ellipse", a, n);
  }
  circle(t, r, i, s) {
    const o = this.ellipse(t, r, i, i, s);
    return o.shape = "circle", o;
  }
  linearPath(t, r) {
    const i = this._o(r);
    return this._d("linearPath", [cn(t, !1, i)], i);
  }
  arc(t, r, i, s, o, n, a = !1, l) {
    const c = this._o(l), h = [], u = Ed(t, r, i, s, o, n, a, !0, c);
    if (a && c.fill) if (c.fillStyle === "solid") {
      const d = Object.assign({}, c);
      d.disableMultiStroke = !0;
      const f = Ed(t, r, i, s, o, n, !0, !1, d);
      f.type = "fillPath", h.push(f);
    } else h.push((function(d, f, m, y, x, C, b) {
      const w = d, _ = f;
      let v = Math.abs(m / 2), E = Math.abs(y / 2);
      v += vt(0.01 * v, b), E += vt(0.01 * E, b);
      let A = x, L = C;
      for (; A < 0; ) A += 2 * Math.PI, L += 2 * Math.PI;
      L - A > 2 * Math.PI && (A = 0, L = 2 * Math.PI);
      const z = (L - A) / b.curveStepCount, W = [];
      for (let R = A; R <= L; R += z) W.push([w + v * Math.cos(R), _ + E * Math.sin(R)]);
      return W.push([w + v * Math.cos(L), _ + E * Math.sin(L)]), W.push([w, _]), Di([W], b);
    })(t, r, i, s, o, n, c));
    return c.stroke !== De && h.push(u), this._d("arc", h, c);
  }
  curve(t, r) {
    const i = this._o(r), s = [], o = Ad(t, i);
    if (i.fill && i.fill !== De) if (i.fillStyle === "solid") {
      const n = Ad(t, Object.assign(Object.assign({}, i), { disableMultiStroke: !0, roughness: i.roughness ? i.roughness + i.fillShapeRoughnessGain : 0 }));
      s.push({ type: "fillPath", ops: this._mergedShape(n.ops) });
    } else {
      const n = [], a = t;
      if (a.length) {
        const l = typeof a[0][0] == "number" ? [a] : a;
        for (const c of l) c.length < 3 ? n.push(...c) : c.length === 3 ? n.push(...Ha(Id([c[0], c[0], c[1], c[2]]), 10, (1 + i.roughness) / 2)) : n.push(...Ha(Id(c), 10, (1 + i.roughness) / 2));
      }
      n.length && s.push(Di([n], i));
    }
    return i.stroke !== De && s.push(o), this._d("curve", s, i);
  }
  polygon(t, r) {
    const i = this._o(r), s = [], o = cn(t, !0, i);
    return i.fill && (i.fillStyle === "solid" ? s.push(za([t], i)) : s.push(Di([t], i))), i.stroke !== De && s.push(o), this._d("polygon", s, i);
  }
  path(t, r) {
    const i = this._o(r), s = [];
    if (!t) return this._d("path", s, i);
    t = (t || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
    const o = i.fill && i.fill !== "transparent" && i.fill !== De, n = i.stroke !== De, a = !!(i.simplification && i.simplification < 1), l = (function(h, u, d) {
      const f = Hm(zm(uc(h))), m = [];
      let y = [], x = [0, 0], C = [];
      const b = () => {
        C.length >= 4 && y.push(...Ha(C, u)), C = [];
      }, w = () => {
        b(), y.length && (m.push(y), y = []);
      };
      for (const { key: v, data: E } of f) switch (v) {
        case "M":
          w(), x = [E[0], E[1]], y.push(x);
          break;
        case "L":
          b(), y.push([E[0], E[1]]);
          break;
        case "C":
          if (!C.length) {
            const A = y.length ? y[y.length - 1] : x;
            C.push([A[0], A[1]]);
          }
          C.push([E[0], E[1]]), C.push([E[2], E[3]]), C.push([E[4], E[5]]);
          break;
        case "Z":
          b(), y.push([x[0], x[1]]);
      }
      if (w(), !d) return m;
      const _ = [];
      for (const v of m) {
        const E = Xv(v, d);
        E.length && _.push(E);
      }
      return _;
    })(t, 1, a ? 4 - 4 * (i.simplification || 1) : (1 + i.roughness) / 2), c = Fd(t, i);
    if (o) if (i.fillStyle === "solid") if (l.length === 1) {
      const h = Fd(t, Object.assign(Object.assign({}, i), { disableMultiStroke: !0, roughness: i.roughness ? i.roughness + i.fillShapeRoughnessGain : 0 }));
      s.push({ type: "fillPath", ops: this._mergedShape(h.ops) });
    } else s.push(za(l, i));
    else s.push(Di(l, i));
    return n && (a ? l.forEach(((h) => {
      s.push(cn(h, !1, i));
    })) : s.push(c)), this._d("path", s, i);
  }
  opsToPath(t, r) {
    let i = "";
    for (const s of t.ops) {
      const o = typeof r == "number" && r >= 0 ? s.data.map(((n) => +n.toFixed(r))) : s.data;
      switch (s.op) {
        case "move":
          i += `M${o[0]} ${o[1]} `;
          break;
        case "bcurveTo":
          i += `C${o[0]} ${o[1]}, ${o[2]} ${o[3]}, ${o[4]} ${o[5]} `;
          break;
        case "lineTo":
          i += `L${o[0]} ${o[1]} `;
      }
    }
    return i.trim();
  }
  toPaths(t) {
    const r = t.sets || [], i = t.options || this.defaultOptions, s = [];
    for (const o of r) {
      let n = null;
      switch (o.type) {
        case "path":
          n = { d: this.opsToPath(o), stroke: i.stroke, strokeWidth: i.strokeWidth, fill: De };
          break;
        case "fillPath":
          n = { d: this.opsToPath(o), stroke: De, strokeWidth: 0, fill: i.fill || De };
          break;
        case "fillSketch":
          n = this.fillSketch(o, i);
      }
      n && s.push(n);
    }
    return s;
  }
  fillSketch(t, r) {
    let i = r.fillWeight;
    return i < 0 && (i = r.strokeWidth / 2), { d: this.opsToPath(t), stroke: r.fill || De, strokeWidth: i, fill: De };
  }
  _mergedShape(t) {
    return t.filter(((r, i) => i === 0 || r.op !== "move"));
  }
}
class Gv {
  constructor(t, r) {
    this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.gen = new Pn(r);
  }
  draw(t) {
    const r = t.sets || [], i = t.options || this.getDefaultOptions(), s = this.ctx, o = t.options.fixedDecimalPlaceDigits;
    for (const n of r) switch (n.type) {
      case "path":
        s.save(), s.strokeStyle = i.stroke === "none" ? "transparent" : i.stroke, s.lineWidth = i.strokeWidth, i.strokeLineDash && s.setLineDash(i.strokeLineDash), i.strokeLineDashOffset && (s.lineDashOffset = i.strokeLineDashOffset), this._drawToContext(s, n, o), s.restore();
        break;
      case "fillPath": {
        s.save(), s.fillStyle = i.fill || "";
        const a = t.shape === "curve" || t.shape === "polygon" || t.shape === "path" ? "evenodd" : "nonzero";
        this._drawToContext(s, n, o, a), s.restore();
        break;
      }
      case "fillSketch":
        this.fillSketch(s, n, i);
    }
  }
  fillSketch(t, r, i) {
    let s = i.fillWeight;
    s < 0 && (s = i.strokeWidth / 2), t.save(), i.fillLineDash && t.setLineDash(i.fillLineDash), i.fillLineDashOffset && (t.lineDashOffset = i.fillLineDashOffset), t.strokeStyle = i.fill || "", t.lineWidth = s, this._drawToContext(t, r, i.fixedDecimalPlaceDigits), t.restore();
  }
  _drawToContext(t, r, i, s = "nonzero") {
    t.beginPath();
    for (const o of r.ops) {
      const n = typeof i == "number" && i >= 0 ? o.data.map(((a) => +a.toFixed(i))) : o.data;
      switch (o.op) {
        case "move":
          t.moveTo(n[0], n[1]);
          break;
        case "bcurveTo":
          t.bezierCurveTo(n[0], n[1], n[2], n[3], n[4], n[5]);
          break;
        case "lineTo":
          t.lineTo(n[0], n[1]);
      }
    }
    r.type === "fillPath" ? t.fill(s) : t.stroke();
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  line(t, r, i, s, o) {
    const n = this.gen.line(t, r, i, s, o);
    return this.draw(n), n;
  }
  rectangle(t, r, i, s, o) {
    const n = this.gen.rectangle(t, r, i, s, o);
    return this.draw(n), n;
  }
  ellipse(t, r, i, s, o) {
    const n = this.gen.ellipse(t, r, i, s, o);
    return this.draw(n), n;
  }
  circle(t, r, i, s) {
    const o = this.gen.circle(t, r, i, s);
    return this.draw(o), o;
  }
  linearPath(t, r) {
    const i = this.gen.linearPath(t, r);
    return this.draw(i), i;
  }
  polygon(t, r) {
    const i = this.gen.polygon(t, r);
    return this.draw(i), i;
  }
  arc(t, r, i, s, o, n, a = !1, l) {
    const c = this.gen.arc(t, r, i, s, o, n, a, l);
    return this.draw(c), c;
  }
  curve(t, r) {
    const i = this.gen.curve(t, r);
    return this.draw(i), i;
  }
  path(t, r) {
    const i = this.gen.path(t, r);
    return this.draw(i), i;
  }
}
const Xo = "http://www.w3.org/2000/svg";
class Vv {
  constructor(t, r) {
    this.svg = t, this.gen = new Pn(r);
  }
  draw(t) {
    const r = t.sets || [], i = t.options || this.getDefaultOptions(), s = this.svg.ownerDocument || window.document, o = s.createElementNS(Xo, "g"), n = t.options.fixedDecimalPlaceDigits;
    for (const a of r) {
      let l = null;
      switch (a.type) {
        case "path":
          l = s.createElementNS(Xo, "path"), l.setAttribute("d", this.opsToPath(a, n)), l.setAttribute("stroke", i.stroke), l.setAttribute("stroke-width", i.strokeWidth + ""), l.setAttribute("fill", "none"), i.strokeLineDash && l.setAttribute("stroke-dasharray", i.strokeLineDash.join(" ").trim()), i.strokeLineDashOffset && l.setAttribute("stroke-dashoffset", `${i.strokeLineDashOffset}`);
          break;
        case "fillPath":
          l = s.createElementNS(Xo, "path"), l.setAttribute("d", this.opsToPath(a, n)), l.setAttribute("stroke", "none"), l.setAttribute("stroke-width", "0"), l.setAttribute("fill", i.fill || ""), t.shape !== "curve" && t.shape !== "polygon" || l.setAttribute("fill-rule", "evenodd");
          break;
        case "fillSketch":
          l = this.fillSketch(s, a, i);
      }
      l && o.appendChild(l);
    }
    return o;
  }
  fillSketch(t, r, i) {
    let s = i.fillWeight;
    s < 0 && (s = i.strokeWidth / 2);
    const o = t.createElementNS(Xo, "path");
    return o.setAttribute("d", this.opsToPath(r, i.fixedDecimalPlaceDigits)), o.setAttribute("stroke", i.fill || ""), o.setAttribute("stroke-width", s + ""), o.setAttribute("fill", "none"), i.fillLineDash && o.setAttribute("stroke-dasharray", i.fillLineDash.join(" ").trim()), i.fillLineDashOffset && o.setAttribute("stroke-dashoffset", `${i.fillLineDashOffset}`), o;
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  opsToPath(t, r) {
    return this.gen.opsToPath(t, r);
  }
  line(t, r, i, s, o) {
    const n = this.gen.line(t, r, i, s, o);
    return this.draw(n);
  }
  rectangle(t, r, i, s, o) {
    const n = this.gen.rectangle(t, r, i, s, o);
    return this.draw(n);
  }
  ellipse(t, r, i, s, o) {
    const n = this.gen.ellipse(t, r, i, s, o);
    return this.draw(n);
  }
  circle(t, r, i, s) {
    const o = this.gen.circle(t, r, i, s);
    return this.draw(o);
  }
  linearPath(t, r) {
    const i = this.gen.linearPath(t, r);
    return this.draw(i);
  }
  polygon(t, r) {
    const i = this.gen.polygon(t, r);
    return this.draw(i);
  }
  arc(t, r, i, s, o, n, a = !1, l) {
    const c = this.gen.arc(t, r, i, s, o, n, a, l);
    return this.draw(c);
  }
  curve(t, r) {
    const i = this.gen.curve(t, r);
    return this.draw(i);
  }
  path(t, r) {
    const i = this.gen.path(t, r);
    return this.draw(i);
  }
}
var ft = { canvas: (e, t) => new Gv(e, t), svg: (e, t) => new Vv(e, t), generator: (e) => new Pn(e), newSeed: () => Pn.newSeed() }, Kv = 1, Zv = 3;
async function dc(e) {
  const t = e.getElementsByTagName("img");
  if (!t || t.length === 0)
    return;
  const r = !fc(e);
  await Promise.all(
    [...t].map(
      (i) => new Promise((s) => {
        function o() {
          if (i.style.display = "flex", i.style.flexDirection = "column", r) {
            const n = Ot().fontSize ? Ot().fontSize : window.getComputedStyle(document.body).fontSize, a = 5, [l = Hp.fontSize] = Zn(n), c = l * a + "px";
            i.style.minWidth = c, i.style.maxWidth = c;
          } else
            i.style.width = "100%";
          s(i);
        }
        p(o, "setupImage"), setTimeout(() => {
          i.complete && o();
        }), i.addEventListener("error", o), i.addEventListener("load", o);
      })
    )
  );
}
p(dc, "configureLabelImages");
function fc(e) {
  return e.nodeType === Zv ? e.textContent?.trim() !== "" : e.nodeType !== Kv || e.tagName.toLowerCase() === "img" ? !1 : [...e.childNodes].some(fc);
}
p(fc, "hasTextBesidesImages");
var Dd = 3, Qv = 32, Jv = /* @__PURE__ */ p(async (e, t, r) => {
  const i = Ot(), s = e.insert("g").attr("class", r ?? "node default").attr("id", t.domId || t.id), o = s.insert("g").attr("class", "label").attr("style", re(t.labelStyle)), a = [
    { text: typeof t.label == "string" ? t.label : t.label?.[0] ?? "", cssClass: "c4-name" },
    { text: t.stereotype, cssClass: "c4-type" },
    ...(t.description ?? []).map((C) => ({ text: C, cssClass: "c4-descr" }))
  ].filter((C) => C.text), l = t.width ? Math.max(t.width - 2 * (t.padding ?? 0), Qv) : Ot().flowchart?.wrappingWidth ?? 200, h = i.c4?.wrap ?? !0 ? l : Number.POSITIVE_INFINITY, u = await Promise.all(
    a.map(async (C) => {
      const b = o.append("g").attr("class", C.cssClass), w = await rr(
        b,
        He(Zr(C.text ?? ""), i),
        {
          useHtmlLabels: !1,
          markdown: !1,
          isNode: !0,
          width: h,
          style: t.labelStyle
        },
        i
      );
      return Et(w).selectAll("tspan.text-outer-tspan").attr("text-anchor", "middle"), Et(w).selectAll("tspan.text-inner-tspan").attr("font-weight", null).attr("font-style", null), { el: b, box: b.node().getBBox() };
    })
  ), d = Math.max(...u.map(({ box: C }) => C.width), 0);
  let f = 0;
  for (const { el: C, box: b } of u)
    C.attr("transform", `translate(${d / 2 - b.x - b.width / 2}, ${f - b.y})`), f += b.height + Dd;
  const m = u.length > 0 ? f - Dd : 0;
  o.insert("rect", ":first-child"), o.attr("transform", `translate(${-d / 2}, ${-m / 2})`);
  const y = o.node().getBBox(), x = (t.padding ?? 0) / 2;
  return { shapeSvg: s, bbox: y, halfPadding: x, label: o };
}, "c4LabelHelper"), Ct = /* @__PURE__ */ p(async (e, t, r) => {
  if (t.stereotype !== void 0)
    return Jv(e, t, r);
  let i;
  const s = t.useHtmlLabels || xr(Ot()?.htmlLabels);
  r ? i = r : i = "node default";
  const o = e.insert("g").attr("class", i).attr("id", t.domId || t.id), n = o.insert("g").attr("class", "label").attr("style", re(t.labelStyle));
  let a;
  t.label === void 0 ? a = "" : a = typeof t.label == "string" ? t.label : t.label[0];
  const l = !!t.icon || !!t.img, c = t.labelType === "markdown", h = await rr(
    n,
    He(Zr(a), Ot()),
    {
      useHtmlLabels: s,
      width: t.width || t.wrappingWidth || Ot().flowchart?.wrappingWidth,
      classes: c ? "markdown-node-label" : "",
      style: t.labelStyle,
      addSvgBackground: l,
      markdown: c
    },
    Ot()
  ), u = (t?.padding ?? 0) / 2;
  let d;
  if (s) {
    const f = h.children[0], m = Et(h);
    await dc(f), d = await bi.measure(
      () => f.getBoundingClientRect()
    ), m.attr("width", d.width), m.attr("height", d.height);
  } else
    d = await bi.measure(
      () => h.getBBox()
    );
  return s ? n.attr("transform", "translate(" + -d.width / 2 + ", " + -d.height / 2 + ")") : n.attr("transform", "translate(0, " + -d.height / 2 + ")"), t.centerLabel && n.attr("transform", "translate(" + -d.width / 2 + ", " + -d.height / 2 + ")"), n.insert("rect", ":first-child"), { shapeSvg: o, bbox: d, halfPadding: u, label: n };
}, "labelHelper"), Ya = /* @__PURE__ */ p(async (e, t, r) => {
  const i = r.useHtmlLabels ?? ye(Ot()), s = e.insert("g").attr("class", "label").attr("style", r.labelStyle || ""), o = await rr(s, He(Zr(t), Ot()), {
    useHtmlLabels: i,
    width: r.width || Ot()?.flowchart?.wrappingWidth,
    style: r.labelStyle,
    addSvgBackground: !!r.icon || !!r.img
  }), n = r.padding / 2;
  let a;
  if (ye(Ot())) {
    const l = o.children[0], c = Et(o);
    a = await bi.measure(
      () => l.getBoundingClientRect()
    ), c.attr("width", a.width), c.attr("height", a.height);
  } else
    a = await bi.measure(
      () => o.getBBox()
    );
  return i ? s.attr("transform", "translate(" + -a.width / 2 + ", " + -a.height / 2 + ")") : s.attr("transform", "translate(0, " + -a.height / 2 + ")"), r.centerLabel && s.attr("transform", "translate(" + -a.width / 2 + ", " + -a.height / 2 + ")"), s.insert("rect", ":first-child"), { shapeSvg: e, bbox: a, halfPadding: n, label: s };
}, "insertLabel"), pt = /* @__PURE__ */ p((e, t, r) => {
  if (r) {
    e.width = r.width, e.height = r.height;
    return;
  }
  const i = t.node().getBBox();
  e.width = i.width, e.height = i.height;
}, "updateNodeBounds"), bt = /* @__PURE__ */ p((e, t) => (e.look === "handDrawn" ? "rough-node" : "node") + " " + e.cssClasses + " " + (t || ""), "getNodeClasses");
function Rt(e) {
  const t = e.map((r, i) => `${i === 0 ? "M" : "L"}${r.x},${r.y}`);
  return t.push("Z"), t.join(" ");
}
p(Rt, "createPathFromPoints");
function Jr(e, t, r, i, s, o) {
  const n = [], l = r - e, c = i - t, h = l / o, u = 2 * Math.PI / h, d = t + c / 2;
  for (let f = 0; f <= 50; f++) {
    const m = f / 50, y = e + m * l, x = d + s * Math.sin(u * (y - e));
    n.push({ x: y, y: x });
  }
  return n;
}
p(Jr, "generateFullSineWavePoints");
function dr(e, t, r, i, s, o) {
  const n = [], a = s * Math.PI / 180, h = (o * Math.PI / 180 - a) / (i - 1);
  for (let u = 0; u < i; u++) {
    const d = a + u * h, f = e + r * Math.cos(d), m = t + r * Math.sin(d);
    n.push({ x: -f, y: -m });
  }
  return n;
}
p(dr, "generateCirclePoints");
function sh(e) {
  const t = Array.from(e.childNodes).filter(
    (l) => l.tagName === "path"
  ), r = document.createElementNS("http://www.w3.org/2000/svg", "path"), i = t.map((l) => l.getAttribute("d")).filter((l) => l !== null).join(" ");
  r.setAttribute("d", i);
  const s = t.find((l) => l.getAttribute("fill") !== "none"), o = t.find((l) => l.getAttribute("stroke") !== "none"), n = /* @__PURE__ */ p((l, c) => l?.getAttribute(c) ?? void 0, "getAttr");
  if (s) {
    const l = {
      fill: n(s, "fill"),
      "fill-opacity": n(s, "fill-opacity") ?? "1"
    };
    Object.entries(l).forEach(([c, h]) => {
      h && r.setAttribute(c, h);
    });
  }
  if (o) {
    const l = {
      stroke: n(o, "stroke"),
      "stroke-width": n(o, "stroke-width") ?? "1",
      "stroke-opacity": n(o, "stroke-opacity") ?? "1"
    };
    Object.entries(l).forEach(([c, h]) => {
      h && r.setAttribute(c, h);
    });
  }
  const a = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return a.appendChild(r), a;
}
p(sh, "mergePaths");
var tB = /* @__PURE__ */ p((e, t) => {
  var r = e.x, i = e.y, s = t.x - r, o = t.y - i, n = e.width / 2, a = e.height / 2, l, c;
  return Math.abs(o) * n > Math.abs(s) * a ? (o < 0 && (a = -a), l = o === 0 ? 0 : a * s / o, c = a) : (s < 0 && (n = -n), l = n, c = s === 0 ? 0 : n * o / s), { x: r + l, y: i + c };
}, "intersectRect"), vi = tB, Xe = /* @__PURE__ */ p((e, t, r, i, s) => [
  "M",
  e + s,
  t,
  // Move to the first point
  "H",
  e + r - s,
  // Draw horizontal line to the beginning of the right corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + r,
  t + s,
  // Draw arc to the right top corner
  "V",
  t + i - s,
  // Draw vertical line down to the beginning of the right bottom corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + r - s,
  t + i,
  // Draw arc to the right bottom corner
  "H",
  e + s,
  // Draw horizontal line to the beginning of the left bottom corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e,
  t + i - s,
  // Draw arc to the left bottom corner
  "V",
  t + s,
  // Draw vertical line up to the beginning of the left top corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + s,
  t,
  // Draw arc to the left top corner
  "Z"
  // Close the path
].join(" "), "createRoundedRectPathD"), eB = /* @__PURE__ */ p(async (e, t, r, i = !1, s = !1) => {
  let o = t || "";
  typeof o == "object" && (o = o[0]);
  const n = Ot(), a = ye(n);
  return await rr(
    e,
    o,
    {
      style: r,
      isTitle: i,
      useHtmlLabels: a,
      markdown: !1,
      isNode: s,
      width: Number.POSITIVE_INFINITY
    },
    n
  );
}, "createLabel"), Xr = eB;
function Gm(e, t) {
  return e.intersect(t);
}
p(Gm, "intersectNode");
var rB = Gm;
function Vm(e, t, r, i) {
  var s = e.x, o = e.y, n = s - i.x, a = o - i.y, l = Math.sqrt(t * t * a * a + r * r * n * n), c = Math.abs(t * r * n / l);
  i.x < s && (c = -c);
  var h = Math.abs(t * r * a / l);
  return i.y < o && (h = -h), { x: s + c, y: o + h };
}
p(Vm, "intersectEllipse");
var Km = Vm;
function Zm(e, t, r) {
  return Km(e, t, t, r);
}
p(Zm, "intersectCircle");
var iB = Zm;
function Qm(e, t, r, i) {
  {
    const s = t.y - e.y, o = e.x - t.x, n = t.x * e.y - e.x * t.y, a = s * r.x + o * r.y + n, l = s * i.x + o * i.y + n, c = 1e-6;
    if (a !== 0 && l !== 0 && oh(a, l))
      return;
    const h = i.y - r.y, u = r.x - i.x, d = i.x * r.y - r.x * i.y, f = h * e.x + u * e.y + d, m = h * t.x + u * t.y + d;
    if (Math.abs(f) < c && Math.abs(m) < c && oh(f, m))
      return;
    const y = s * u - h * o;
    if (y === 0)
      return;
    const x = Math.abs(y / 2);
    let C = o * d - u * n;
    const b = C < 0 ? (C - x) / y : (C + x) / y;
    C = h * n - s * d;
    const w = C < 0 ? (C - x) / y : (C + x) / y;
    return { x: b, y: w };
  }
}
p(Qm, "intersectLine");
function oh(e, t) {
  return e * t > 0;
}
p(oh, "sameSign");
var sB = Qm;
function Jm(e, t, r) {
  let i = e.x, s = e.y, o = [], n = Number.POSITIVE_INFINITY, a = Number.POSITIVE_INFINITY;
  typeof t.forEach == "function" ? t.forEach(function(h) {
    n = Math.min(n, h.x), a = Math.min(a, h.y);
  }) : (n = Math.min(n, t.x), a = Math.min(a, t.y));
  let l = i - e.width / 2 - n, c = s - e.height / 2 - a;
  for (let h = 0; h < t.length; h++) {
    let u = t[h], d = t[h < t.length - 1 ? h + 1 : 0], f = sB(
      e,
      r,
      { x: l + u.x, y: c + u.y },
      { x: l + d.x, y: c + d.y }
    );
    f && o.push(f);
  }
  return o.length ? (o.length > 1 && o.sort(function(h, u) {
    let d = h.x - r.x, f = h.y - r.y, m = Math.sqrt(d * d + f * f), y = u.x - r.x, x = u.y - r.y, C = Math.sqrt(y * y + x * x);
    return m < C ? -1 : m === C ? 0 : 1;
  }), o[0]) : e;
}
p(Jm, "intersectPolygon");
var oB = Jm, lt = {
  node: rB,
  circle: iB,
  ellipse: Km,
  polygon: oB,
  rect: vi
};
function ty(e, t) {
  const { labelStyles: r } = gt(t);
  t.labelStyle = r;
  const i = bt(t);
  let s = i;
  i || (s = "anchor");
  const o = e.insert("g").attr("class", s).attr("id", t.domId || t.id), n = 1, { cssStyles: a } = t, l = ft.svg(o), c = ut(t, { fill: "black", stroke: "none", fillStyle: "solid" });
  t.look !== "handDrawn" && (c.roughness = 0);
  const h = l.circle(0, 0, n * 2, c), u = o.insert(() => h, ":first-child");
  return u.attr("class", "anchor").attr("style", re(a)), pt(t, u), t.intersect = function(d) {
    return q.info("Circle intersect", t, n, d), lt.circle(t, n, d);
  }, o;
}
p(ty, "anchor");
function nh(e, t, r, i, s, o, n) {
  const l = (e + r) / 2, c = (t + i) / 2, h = Math.atan2(i - t, r - e), u = (r - e) / 2, d = (i - t) / 2, f = u / s, m = d / o, y = Math.sqrt(f ** 2 + m ** 2);
  if (y > 1)
    throw new Error("The given radii are too small to create an arc between the points.");
  const x = Math.sqrt(1 - y ** 2), C = l + x * o * Math.sin(h) * (n ? -1 : 1), b = c - x * s * Math.cos(h) * (n ? -1 : 1), w = Math.atan2((t - b) / o, (e - C) / s);
  let v = Math.atan2((i - b) / o, (r - C) / s) - w;
  n && v < 0 && (v += 2 * Math.PI), !n && v > 0 && (v -= 2 * Math.PI);
  const E = [];
  for (let A = 0; A < 20; A++) {
    const L = A / 19, z = w + L * v, W = C + s * Math.cos(z), R = b + o * Math.sin(z);
    E.push({ x: W, y: R });
  }
  return E;
}
p(nh, "generateArcPoints");
function ey(e, t, r) {
  const [i, s] = [t, r].sort((o, n) => n - o);
  return s * (1 - Math.sqrt(1 - (e / i / 2) ** 2));
}
p(ey, "calculateArcSagitta");
async function ry(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 12 : s, a = /* @__PURE__ */ p((z) => z + n, "calcTotalHeight"), l = /* @__PURE__ */ p((z) => {
    const W = z / 2;
    return [W / (2.5 + z / 50), W];
  }, "calcEllipseRadius"), { shapeSvg: c, bbox: h } = await Ct(e, t, bt(t)), u = a(t?.height ? t?.height : h.height), [d, f] = l(u), m = ey(u, d, f), x = (t?.width ? t?.width : h.width) + o * 2 + m - m, C = u, { cssStyles: b } = t, w = [
    { x: x / 2, y: -C / 2 },
    { x: -x / 2, y: -C / 2 },
    ...nh(-x / 2, -C / 2, -x / 2, C / 2, d, f, !1),
    { x: x / 2, y: C / 2 },
    ...nh(x / 2, C / 2, x / 2, -C / 2, d, f, !0)
  ], _ = ft.svg(c), v = ut(t, {});
  t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
  const E = Rt(w), A = _.path(E, v), L = c.insert(() => A, ":first-child");
  return L.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && L.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(${d / 2}, 0)`), pt(t, L), t.intersect = function(z) {
    return lt.polygon(t, w, z);
  }, c;
}
p(ry, "bowTieRect");
async function iy(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: n, label: a } = await Ct(e, t, bt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = Math.max(n.width + c * 2, t.width ?? 0, 80), u = Math.max(Math.min(h * 0.08, 12), 5), d = Math.max(n.height + c * 2 + u, t.height ?? 0), f = -d / 2 + u, m = d / 2, y = h * 0.72, x = [
    `M${-h / 2},${f}`,
    `L${-y / 2},${m}`,
    `A${y / 2},${u} 0 0 0 ${y / 2},${m}`,
    `L${h / 2},${f}`,
    `A${h / 2},${u} 0 0 0 ${-h / 2},${f}`,
    "Z"
  ].join(" "), { cssStyles: C } = t, b = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const L = ft.svg(o).path(x, ut(t, {}));
    b.node()?.appendChild(L), C && b.attr("style", C);
  } else
    b.append("path").attr("d", x).attr("style", s);
  b.append("ellipse").attr("cx", 0).attr("cy", f).attr("rx", h / 2).attr("ry", u).attr("style", `fill:none;stroke:${l};stroke-width:1px`), pt(t, b);
  const w = f + (m - f) / 2;
  a.attr(
    "transform",
    `translate(${-(n.width / 2) - (n.x - (n.left ?? 0))}, ${w - n.height / 2 - (n.y - (n.top ?? 0))})`
  );
  const _ = 12, v = /* @__PURE__ */ p((A, L, z) => Array.from({ length: _ + 1 }, (W, R) => {
    const st = Math.PI - R * Math.PI / _;
    return { x: A * Math.cos(st), y: L + z * u * Math.sin(st) };
  }), "arc"), E = [...v(h / 2, f, -1), ...v(y / 2, m, 1).reverse()];
  return t.intersect = function(A) {
    return lt.polygon(t, E, A);
  }, o;
}
p(iy, "bucket");
var Pd = 20, Rd = 8, nB = 80, Ua = 8;
async function sy(e, t) {
  const { themeVariables: r } = Ot(), i = r.clusterBkg, s = r.clusterBorder, { nodeStyles: o } = gt(t), { shapeSvg: n, bbox: a } = await Ct(e, t, bt(t)), l = t.padding ?? 8, c = a.height, h = Math.max(a.width + l * 2, nB, t?.width ?? 0), u = Math.max(
    c + Rd + Pd + l * 2,
    t?.height ?? 0
  ), d = -h / 2, f = -u / 2, m = -28 / 2, y = n.select(".label");
  y && (t.useHtmlLabels ?? ye(Ot()) ? y.attr("transform", `translate(${-a.width / 2}, ${-a.height / 2 + m})`) : y.attr("transform", `translate(0, ${-a.height / 2 + m})`));
  let x;
  if (t.look === "handDrawn") {
    const v = ft.svg(n), E = ut(t, {
      fill: i,
      stroke: s,
      fillStyle: "solid"
    }), A = v.path(
      Xe(d, f, h, u, Ua),
      E
    );
    x = n.insert(() => A, ":first-child"), x.attr("class", "basic label-container collapsed-group").attr("style", re(t.cssStyles));
  } else
    x = n.insert("rect", ":first-child"), x.attr("class", "basic label-container collapsed-group").attr("style", o).attr("rx", Ua).attr("ry", Ua).attr("x", d).attr("y", f).attr("width", h).attr("height", u).attr("fill", i).attr("stroke", s);
  const C = f + l + c + Rd;
  n.append("line").attr("class", "collapsed-separator").attr("x1", d + 8).attr("y1", C).attr("x2", d + h - 8).attr("y2", C).attr("stroke", s).attr("stroke-dasharray", "3, 3");
  const b = C + Pd / 2, w = 2.5, _ = 10;
  for (let v = -1; v <= 1; v++)
    n.append("circle").attr("class", "collapsed-indicator").attr("cx", v * _).attr("cy", b).attr("r", w).attr("fill", s);
  return pt(t, x), t.calcIntersect = function(v, E) {
    return lt.rect(v, E);
  }, t.intersect = function(v) {
    return lt.rect(t, v);
  }, n;
}
p(sy, "collapsedGroup");
function br(e, t, r, i) {
  return e.insert("polygon", ":first-child").attr(
    "points",
    i.map(function(s) {
      return s.x + "," + s.y;
    }).join(" ")
  ).attr("class", "label-container").attr("transform", "translate(" + -t / 2 + "," + r / 2 + ")");
}
p(br, "insertPolygonShape");
var aB = ["right", "left", "up", "down"], pc = "point", lB = /* @__PURE__ */ p((e) => {
  const t = /* @__PURE__ */ new Set();
  for (const r of e)
    switch (r) {
      case "x":
        t.add("right"), t.add("left");
        break;
      case "y":
        t.add("up"), t.add("down");
        break;
      default:
        t.add(r);
        break;
    }
  return t;
}, "expandAndDeduplicateDirections"), hB = /* @__PURE__ */ p((e) => aB.filter((t) => e.has(t)).join("|") || pc, "getDirectionKey"), Nd = {
  "right|left|up|down": /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: 0, y: 0 },
    { x: t, y: 0 },
    { x: i / 2, y: 2 * r },
    { x: i - t, y: 0 },
    { x: i, y: 0 },
    { x: i, y: -e / 3 },
    { x: i + 2 * r, y: -e / 2 },
    { x: i, y: -2 * e / 3 },
    { x: i, y: -e },
    { x: i - t, y: -e },
    { x: i / 2, y: -e - 2 * r },
    { x: t, y: -e },
    { x: 0, y: -e },
    { x: 0, y: -2 * e / 3 },
    { x: -2 * r, y: -e / 2 },
    { x: 0, y: -e / 3 }
  ], "right|left|up|down"),
  "right|left|up": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: t, y: 0 },
    { x: r - t, y: 0 },
    { x: r, y: -e / 2 },
    { x: r - t, y: -e },
    { x: t, y: -e },
    { x: 0, y: -e / 2 }
  ], "right|left|up"),
  "right|left|down": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: 0, y: 0 },
    { x: t, y: -e },
    { x: r - t, y: -e },
    { x: r, y: 0 }
  ], "right|left|down"),
  "right|up|down": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: 0, y: 0 },
    { x: r, y: -t },
    { x: r, y: -e + t },
    { x: 0, y: -e }
  ], "right|up|down"),
  "left|up|down": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: r, y: 0 },
    { x: 0, y: -t },
    { x: 0, y: -e + t },
    { x: r, y: -e }
  ], "left|up|down"),
  "right|left": /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: t, y: 0 },
    { x: t, y: -r },
    { x: i - t, y: -r },
    { x: i - t, y: 0 },
    { x: i, y: -e / 2 },
    { x: i - t, y: -e },
    { x: i - t, y: -e + r },
    { x: t, y: -e + r },
    { x: t, y: -e },
    { x: 0, y: -e / 2 }
  ], "right|left"),
  "up|down": /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: i / 2, y: 0 },
    { x: 0, y: -r },
    { x: t, y: -r },
    { x: t, y: -e + r },
    { x: 0, y: -e + r },
    { x: i / 2, y: -e },
    { x: i, y: -e + r },
    { x: i - t, y: -e + r },
    { x: i - t, y: -r },
    { x: i, y: -r }
  ], "up|down"),
  "right|up": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: 0, y: 0 },
    { x: r, y: -t },
    { x: 0, y: -e }
  ], "right|up"),
  "right|down": /* @__PURE__ */ p(({ height: e, width: t }) => [
    { x: 0, y: 0 },
    { x: t, y: 0 },
    { x: 0, y: -e }
  ], "right|down"),
  "left|up": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: r, y: 0 },
    { x: 0, y: -t },
    { x: r, y: -e }
  ], "left|up"),
  "left|down": /* @__PURE__ */ p(({ height: e, width: t }) => [
    { x: t, y: 0 },
    { x: 0, y: 0 },
    { x: t, y: -e }
  ], "left|down"),
  right: /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: t, y: -r },
    { x: t, y: -r },
    { x: i - t, y: -r },
    { x: i - t, y: 0 },
    { x: i, y: -e / 2 },
    { x: i - t, y: -e },
    { x: i - t, y: -e + r },
    { x: t, y: -e + r },
    { x: t, y: -e + r }
  ], "right"),
  left: /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: t, y: 0 },
    { x: t, y: -r },
    { x: i - t, y: -r },
    { x: i - t, y: -e + r },
    { x: t, y: -e + r },
    { x: t, y: -e },
    { x: 0, y: -e / 2 }
  ], "left"),
  up: /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: t, y: -r },
    { x: t, y: -e + r },
    { x: 0, y: -e + r },
    { x: i / 2, y: -e },
    { x: i, y: -e + r },
    { x: i - t, y: -e + r },
    { x: i - t, y: -r }
  ], "up"),
  down: /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: i / 2, y: 0 },
    { x: 0, y: -r },
    { x: t, y: -r },
    { x: t, y: -e + r },
    { x: i - t, y: -e + r },
    { x: i - t, y: -r },
    { x: i, y: -r }
  ], "down"),
  [pc]: () => [{ x: 0, y: 0 }]
}, cB = /* @__PURE__ */ p((e, t, r, i) => {
  const s = lB(e), o = (r.padding ?? 0) / 2, n = t.height + 4 * o, a = n / 2, l = i ?? t.width + 2 * a + 2 * o, c = hB(s);
  return (Nd[c] ?? Nd[pc])({ height: n, midpoint: a, padding: o, width: l });
}, "getArrowPoints");
async function oy(e, t) {
  const r = t, { shapeSvg: i, bbox: s } = await Ct(e, r, bt(r)), o = r.padding ?? 0, n = s.height + 2 * o, a = n / 2, l = s.width + 2 * a + o, c = r.width ?? 0, u = r.positioned && (r.widthInColumns ?? 1) > 1 && c > l ? c : l, d = cB(r.directions ?? [], s, r, u), f = br(i, u, n, d);
  return f.attr("style", r.style ?? null), pt(r, f), r.intersect = function(m) {
    return lt.polygon(r, d, m);
  }, i;
}
p(oy, "block_arrow");
async function ny(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: n, label: a } = await Ct(e, t, bt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = 18, u = 12, d = Math.max(n.width + c * 2, t.width ?? 0, 90), f = Math.max(n.height + c * 2 + h, t.height ?? 0), m = -f / 2, { cssStyles: y } = t, x = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const w = ft.svg(o).path(
      Xe(-d / 2, m, d, f, u),
      ut(t, {})
    );
    x.node()?.appendChild(w), y && x.attr("style", y);
  } else
    x.append("rect").attr("x", -d / 2).attr("y", m).attr("width", d).attr("height", f).attr("rx", u).attr("ry", u).attr("style", s);
  x.append("line").attr("x1", -d / 2).attr("y1", m + h).attr("x2", d / 2).attr("y2", m + h).attr("style", `stroke:${l};stroke-width:1px`);
  for (let b = 0; b < 3; b++)
    x.append("circle").attr("cx", -d / 2 + 12 + b * 9).attr("cy", m + h / 2).attr("r", 2.5).attr("style", `fill:${l};stroke:none`);
  x.append("rect").attr("class", "browser-address-bar").attr("x", -d / 2 + 44).attr("y", m + 4).attr("width", Math.max(d - 56, 10)).attr("height", h - 8).attr("rx", 3).attr("ry", 3).attr("style", `fill:none;stroke:${l};stroke-width:1px;opacity:0.6`), pt(t, x);
  const C = m + h + (f - h) / 2;
  return a.attr(
    "transform",
    `translate(${-(n.width / 2) - (n.x - (n.left ?? 0))}, ${C - n.height / 2 - (n.y - (n.top ?? 0))})`
  ), t.intersect = function(b) {
    return lt.rect(t, b);
  }, o;
}
p(ny, "browser");
var Go = 12;
async function ay(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 28 : s, n = t.look === "neo" ? 24 : s, { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = (t?.width ?? l.width) + (t.look === "neo" ? o * 2 : o + Go), h = (t?.height ?? l.height) + (t.look === "neo" ? n * 2 : n), u = 0, d = c, f = -h, m = 0, y = [
    { x: u + Go, y: f },
    { x: d, y: f },
    { x: d, y: m },
    { x: u, y: m },
    { x: u, y: f + Go },
    { x: u + Go, y: f }
  ];
  let x;
  const { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const b = ft.svg(a), w = ut(t, {}), _ = Rt(y), v = b.path(_, w);
    x = a.insert(() => v, ":first-child").attr("transform", `translate(${-c / 2}, ${h / 2})`), C && x.attr("style", C);
  } else
    x = br(a, c, h, y);
  return i && x.attr("style", i), pt(t, x), t.intersect = function(b) {
    return lt.polygon(t, y, b);
  }, a;
}
p(ay, "card");
function ly(e, t) {
  const { nodeStyles: r } = gt(t);
  t.label = "";
  const i = e.insert("g").attr("class", bt(t)).attr("id", t.domId ?? t.id), { cssStyles: s } = t, o = Math.max(28, t.width ?? 0), n = [
    { x: 0, y: o / 2 },
    { x: o / 2, y: 0 },
    { x: 0, y: -o / 2 },
    { x: -o / 2, y: 0 }
  ], a = ft.svg(i), l = ut(t, {});
  t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
  const c = Rt(n), h = a.path(c, l), u = i.insert(() => h, ":first-child");
  return s && t.look !== "handDrawn" && u.selectAll("path").attr("style", s), r && t.look !== "handDrawn" && u.selectAll("path").attr("style", r), t.width = 28, t.height = 28, t.intersect = function(d) {
    return lt.polygon(t, n, d);
  }, i;
}
p(ly, "choice");
async function gc(e, t, r) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: n, halfPadding: a } = await Ct(e, t, bt(t)), l = 16, c = r?.padding ?? a, h = t.look === "neo" ? n.width / 2 + l * 2 : n.width / 2 + c;
  let u;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const f = ft.svg(o), m = ut(t, {}), y = f.circle(0, 0, h * 2, m);
    u = o.insert(() => y, ":first-child"), u.attr("class", "basic label-container").attr("style", re(d));
  } else
    u = o.insert("circle", ":first-child").attr("class", "basic label-container").attr("style", s).attr("r", h).attr("cx", 0).attr("cy", 0);
  return pt(t, u), t.calcIntersect = function(f, m) {
    const y = f.width / 2;
    return lt.circle(f, y, m);
  }, t.intersect = function(f) {
    return q.info("Circle intersect", t, h, f), lt.circle(t, h, f);
  }, o;
}
p(gc, "circle");
async function hy(e, t) {
  const r = t, i = ["node", r.cssClasses, r.class].filter(Boolean).join(" "), { shapeSvg: s, bbox: o, halfPadding: n } = await Ct(e, r, i), a = s.insert("rect", ":first-child"), l = r.padding ?? 0, c = r.positioned ? r.width ?? 0 : o.width + l, h = r.positioned ? r.height ?? 0 : o.height + l, u = r.positioned ? -c / 2 : -o.width / 2 - n, d = r.positioned ? -h / 2 : -o.height / 2 - n;
  return a.attr("class", "basic cluster composite label-container").attr("style", r.style ?? null).attr("rx", r.rx ?? null).attr("ry", r.ry ?? null).attr("x", u).attr("y", d).attr("width", c).attr("height", h), pt(r, a), r.intersect = function(f) {
    return lt.rect(r, f);
  }, s;
}
p(hy, "composite");
async function cy(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: n, label: a } = await Ct(e, t, bt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = 20, u = 12, d = Math.max(n.width + c * 2, t.width ?? 0, 90), f = Math.max(n.height + c * 2 + h, t.height ?? 0), m = -f / 2, { cssStyles: y } = t, x = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const w = ft.svg(o).path(
      Xe(-d / 2, m, d, f, u),
      ut(t, {})
    );
    x.node()?.appendChild(w), y && x.attr("style", y);
  } else
    x.append("rect").attr("x", -d / 2).attr("y", m).attr("width", d).attr("height", f).attr("rx", u).attr("ry", u).attr("style", s);
  x.append("text").attr("x", -d / 2 + 12).attr("y", m + 16).attr("class", "console-glyph").attr("style", `font-family:monospace;font-weight:bold;font-size:14px;fill:${l}`).text(">_"), pt(t, x);
  const C = m + h + (f - h) / 2;
  return a.attr(
    "transform",
    `translate(${-(n.width / 2) - (n.x - (n.left ?? 0))}, ${C - n.height / 2 - (n.y - (n.top ?? 0))})`
  ), t.intersect = function(b) {
    return lt.rect(t, b);
  }, o;
}
p(cy, "consoleWindow");
function uy(e) {
  const t = Math.cos(Math.PI / 4), r = Math.sin(Math.PI / 4), i = e * 2, s = { x: i / 2 * t, y: i / 2 * r }, o = { x: -(i / 2) * t, y: i / 2 * r }, n = { x: -(i / 2) * t, y: -(i / 2) * r }, a = { x: i / 2 * t, y: -(i / 2) * r };
  return `M ${o.x},${o.y} L ${a.x},${a.y}
                   M ${s.x},${s.y} L ${n.x},${n.y}`;
}
p(uy, "createLine");
function dy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r, t.label = "";
  const s = e.insert("g").attr("class", bt(t)).attr("id", t.domId ?? t.id), o = Math.max(30, t?.width ?? 0), { cssStyles: n } = t, a = ft.svg(s), l = ut(t, {});
  t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
  const c = a.circle(0, 0, o * 2, l), h = uy(o), u = a.path(h, l), d = s.insert(() => c, ":first-child");
  return d.insert(() => u), d.attr("class", "outer-path"), n && t.look !== "handDrawn" && d.selectAll("path").attr("style", n), i && t.look !== "handDrawn" && d.selectAll("path").attr("style", i), pt(t, d), t.intersect = function(f) {
    return q.info("crossedCircle intersect", t, { radius: o, point: f }), lt.circle(t, o, f);
  }, s;
}
p(dy, "crossedCircle");
function vr(e, t, r, i = 100, s = 0, o = 180) {
  const n = [], a = s * Math.PI / 180, h = (o * Math.PI / 180 - a) / (i - 1);
  for (let u = 0; u < i; u++) {
    const d = a + u * h, f = e + r * Math.cos(d), m = t + r * Math.sin(d);
    n.push({ x: -f, y: -m });
  }
  return n;
}
p(vr, "generateCirclePoints");
async function fy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: n } = await Ct(e, t, bt(t)), a = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + a, h = o.height + l, u = Math.max(5, h * 0.1), { cssStyles: d } = t, f = [
    ...vr(c / 2, -h / 2, u, 30, -90, 0),
    { x: -c / 2 - u, y: u },
    ...vr(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...vr(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: -c / 2 - u, y: -h / 2 },
    ...vr(c / 2, h / 2, u, 20, 0, 90)
  ], m = [
    { x: c / 2, y: -h / 2 - u },
    { x: -c / 2, y: -h / 2 - u },
    ...vr(c / 2, -h / 2, u, 20, -90, 0),
    { x: -c / 2 - u, y: -u },
    ...vr(c / 2 + c * 0.1, -u, u, 20, -180, -270),
    ...vr(c / 2 + c * 0.1, u, u, 20, -90, -180),
    { x: -c / 2 - u, y: h / 2 },
    ...vr(c / 2, h / 2, u, 20, 0, 90),
    { x: -c / 2, y: h / 2 + u },
    { x: c / 2, y: h / 2 + u }
  ], y = ft.svg(s), x = ut(t, { fill: "none" });
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const b = Rt(f).replace("Z", ""), w = y.path(b, x), _ = Rt(m), v = y.path(_, { ...x }), E = s.insert("g", ":first-child");
  return E.insert(() => v, ":first-child").attr("stroke-opacity", 0), E.insert(() => w, ":first-child"), E.attr("class", "text"), d && t.look !== "handDrawn" && E.selectAll("path").attr("style", d), i && t.look !== "handDrawn" && E.selectAll("path").attr("style", i), E.attr("transform", `translate(${u}, 0)`), n.attr(
    "transform",
    `translate(${-c / 2 + u - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), pt(t, E), t.intersect = function(A) {
    return lt.polygon(t, m, A);
  }, s;
}
p(fy, "curlyBraceLeft");
function Br(e, t, r, i = 100, s = 0, o = 180) {
  const n = [], a = s * Math.PI / 180, h = (o * Math.PI / 180 - a) / (i - 1);
  for (let u = 0; u < i; u++) {
    const d = a + u * h, f = e + r * Math.cos(d), m = t + r * Math.sin(d);
    n.push({ x: f, y: m });
  }
  return n;
}
p(Br, "generateCirclePoints");
async function py(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: n } = await Ct(e, t, bt(t)), a = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + (t.look === "neo" ? a * 2 : a), h = o.height + (t.look === "neo" ? l * 2 : l), u = Math.max(5, h * 0.1), { cssStyles: d } = t, f = [
    ...Br(c / 2, -h / 2, u, 20, -90, 0),
    { x: c / 2 + u, y: -u },
    ...Br(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...Br(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: c / 2 + u, y: h / 2 },
    ...Br(c / 2, h / 2, u, 20, 0, 90)
  ], m = [
    { x: -c / 2, y: -h / 2 - u },
    { x: c / 2, y: -h / 2 - u },
    ...Br(c / 2, -h / 2, u, 20, -90, 0),
    { x: c / 2 + u, y: -u },
    ...Br(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...Br(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: c / 2 + u, y: h / 2 },
    ...Br(c / 2, h / 2, u, 20, 0, 90),
    { x: c / 2, y: h / 2 + u },
    { x: -c / 2, y: h / 2 + u }
  ], y = ft.svg(s), x = ut(t, { fill: "none" });
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const b = Rt(f).replace("Z", ""), w = y.path(b, x), _ = Rt(m), v = y.path(_, { ...x }), E = s.insert("g", ":first-child");
  return E.insert(() => v, ":first-child").attr("stroke-opacity", 0), E.insert(() => w, ":first-child"), E.attr("class", "text"), d && t.look !== "handDrawn" && E.selectAll("path").attr("style", d), i && t.look !== "handDrawn" && E.selectAll("path").attr("style", i), E.attr("transform", `translate(${-u}, 0)`), n.attr(
    "transform",
    `translate(${-c / 2 + (t.padding ?? 0) / 2 - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), pt(t, E), t.intersect = function(A) {
    return lt.polygon(t, m, A);
  }, s;
}
p(py, "curlyBraceRight");
function ue(e, t, r, i = 100, s = 0, o = 180) {
  const n = [], a = s * Math.PI / 180, h = (o * Math.PI / 180 - a) / (i - 1);
  for (let u = 0; u < i; u++) {
    const d = a + u * h, f = e + r * Math.cos(d), m = t + r * Math.sin(d);
    n.push({ x: -f, y: -m });
  }
  return n;
}
p(ue, "generateCirclePoints");
async function gy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: n } = await Ct(e, t, bt(t)), a = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + (t.look === "neo" ? a * 2 : a), h = o.height + (t.look === "neo" ? l * 2 : l), u = Math.max(5, h * 0.1), { cssStyles: d } = t, f = [
    ...ue(c / 2, -h / 2, u, 30, -90, 0),
    { x: -c / 2 - u, y: u },
    ...ue(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...ue(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: -c / 2 - u, y: -h / 2 },
    ...ue(c / 2, h / 2, u, 20, 0, 90)
  ], m = [
    ...ue(-c / 2 + u + u / 2, -h / 2, u, 20, -90, -180),
    { x: c / 2 - u / 2, y: u },
    ...ue(-c / 2 - u / 2, -u, u, 20, 0, 90),
    ...ue(-c / 2 - u / 2, u, u, 20, -90, 0),
    { x: c / 2 - u / 2, y: -u },
    ...ue(-c / 2 + u + u / 2, h / 2, u, 30, -180, -270)
  ], y = [
    { x: c / 2, y: -h / 2 - u },
    { x: -c / 2, y: -h / 2 - u },
    ...ue(c / 2, -h / 2, u, 20, -90, 0),
    { x: -c / 2 - u, y: -u },
    ...ue(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...ue(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: -c / 2 - u, y: h / 2 },
    ...ue(c / 2, h / 2, u, 20, 0, 90),
    { x: -c / 2, y: h / 2 + u },
    { x: c / 2 - u - u / 2, y: h / 2 + u },
    ...ue(-c / 2 + u + u / 2, -h / 2, u, 20, -90, -180),
    { x: c / 2 - u / 2, y: u },
    ...ue(-c / 2 - u / 2, -u, u, 20, 0, 90),
    ...ue(-c / 2 - u / 2, u, u, 20, -90, 0),
    { x: c / 2 - u / 2, y: -u },
    ...ue(-c / 2 + u + u / 2, h / 2, u, 30, -180, -270)
  ], x = ft.svg(s), C = ut(t, { fill: "none" });
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const w = Rt(f).replace("Z", ""), _ = x.path(w, C), E = Rt(m).replace("Z", ""), A = x.path(E, C), L = Rt(y), z = x.path(L, { ...C }), W = s.insert("g", ":first-child");
  return W.insert(() => z, ":first-child").attr("stroke-opacity", 0), W.insert(() => _, ":first-child"), W.insert(() => A, ":first-child"), W.attr("class", "text"), d && t.look !== "handDrawn" && W.selectAll("path").attr("style", d), i && t.look !== "handDrawn" && W.selectAll("path").attr("style", i), W.attr("transform", `translate(${u - u / 4}, 0)`), n.attr(
    "transform",
    `translate(${-c / 2 + (t.padding ?? 0) / 2 - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), pt(t, W), t.intersect = function(R) {
    return lt.polygon(t, y, R);
  }, s;
}
p(gy, "curlyBraces");
async function my(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 12 : s, a = 20, l = 5, { shapeSvg: c, bbox: h } = await Ct(e, t, bt(t)), u = Math.max(a, (h.width + o * 2) * 1.25, t?.width ?? 0), d = Math.max(l, h.height + n * 2, t?.height ?? 0), f = d / 2, { cssStyles: m } = t, y = ft.svg(c), x = ut(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = u, b = d, w = C - f, _ = b / 4, v = [
    { x: w, y: 0 },
    { x: _, y: 0 },
    { x: 0, y: b / 2 },
    { x: _, y: b },
    { x: w, y: b },
    ...dr(-w, -b / 2, f, 50, 270, 90)
  ], E = Rt(v), A = y.path(E, x), L = c.insert(() => A, ":first-child");
  return L.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && L.selectChildren("path").attr("style", m), i && t.look !== "handDrawn" && L.selectChildren("path").attr("style", i), L.attr("transform", `translate(${-u / 2}, ${-d / 2})`), pt(t, L), t.intersect = function(z) {
    return lt.polygon(t, v, z);
  }, c;
}
p(my, "curvedTrapezoid");
async function yy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: n } = await Ct(e, t, bt(t)), a = t.padding ?? 20, l = Math.max(o.width + a * 2, t.width ?? 0, 100), c = Math.min(Math.max(l * 0.23, 16), 56), h = c * 0.27, u = Math.max(
    o.height + a * 2,
    t.height ? t.height - (2 * c - h) : 0
  ), d = Math.min(l * 0.177, u * 0.45), f = u + 2 * c - h, m = -f / 2, y = m + 2 * c - h, x = s.insert("g", ":first-child").attr("class", "basic label-container"), { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const L = ft.svg(s), z = ut(t, {}), W = L.path(
      Xe(-l / 2, y, l, u, d),
      z
    ), R = L.circle(0, m + c, c * 2, z);
    x.insert(() => R, ":first-child"), x.insert(() => W, ":first-child"), C && x.attr("style", C);
  } else
    x.append("rect").attr("x", -l / 2).attr("y", y).attr("width", l).attr("height", u).attr("rx", d).attr("ry", d).attr("style", i), x.append("circle").attr("cx", 0).attr("cy", m + c).attr("r", c).attr("style", i);
  pt(t, x);
  const b = y + u / 2;
  n.attr(
    "transform",
    `translate(${-(o.width / 2) - (o.x - (o.left ?? 0))}, ${b - o.height / 2 - (o.y - (o.top ?? 0))})`
  );
  const w = m + c, _ = Math.asin(Math.min(1, (y - w) / c)) * 180 / Math.PI, A = [
    ...dr(
      0,
      -w,
      c,
      24,
      180 + _,
      -_
    ),
    ...dr(-(-l / 2 + d), -(y + d), d, 12, 90, 0),
    ...dr(
      -(-l / 2 + d),
      -(f / 2 - d),
      d,
      12,
      360,
      270
    ),
    ...dr(
      -(l / 2 - d),
      -(f / 2 - d),
      d,
      12,
      270,
      180
    ),
    ...dr(
      -(l / 2 - d),
      -(y + d),
      d,
      12,
      180,
      90
    )
  ];
  return t.intersect = function(L) {
    return lt.polygon(t, A, L);
  }, s;
}
p(yy, "person");
var uB = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t + o}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`
].join(" "), "createCylinderPathD"), dB = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t + o}`,
  `M${e + r},${t + o}`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`
].join(" "), "createOuterCylinderPathD"), fB = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e - r / 2},${-i / 2}`, `a${s},${o} 0,0,0 ${r},0`].join(" "), "createInnerCylinderPathD"), qd = 8, Wd = 8;
async function xy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 24 : s, n = t.look === "neo" ? 24 : s, a = t.width ?? 0;
  if (t.width && (t.width = t.width - n, t.width < Wd && (t.width = Wd)), t.height) {
    const b = a / 2 / (2.5 + a / 50);
    t.height = t.height - o - b * 3, t.height < qd && (t.height = qd);
  }
  const { shapeSvg: l, bbox: c, label: h } = await Ct(e, t, bt(t)), u = Math.max(t.width ?? 0, c.width) + n, d = u / 2, f = d / (2.5 + u / 50), m = Math.max(t.height ?? 0, c.height) + o + f;
  let y;
  const { cssStyles: x } = t;
  if (t.look === "handDrawn") {
    const C = ft.svg(l), b = dB(0, 0, u, m, d, f), w = fB(0, f, u, m, d, f), _ = ut(t, {}), v = C.path(b, _), E = C.path(w, ut(t, { fill: "none" }));
    y = l.insert(() => E, ":first-child"), y = l.insert(() => v, ":first-child"), y.attr("class", "basic label-container"), x && y.attr("style", x);
  } else {
    const C = uB(0, 0, u, m, d, f);
    y = l.insert("path", ":first-child").attr("d", C).attr("class", "basic label-container outer-path").attr("style", re(x)).attr("style", i);
  }
  return y.attr("label-offset-y", f), y.attr("transform", `translate(${-u / 2}, ${-(m / 2 + f)})`), pt(t, y), h.attr(
    "transform",
    `translate(${-(c.width / 2) - (c.x - (c.left ?? 0))}, ${-(c.height / 2) + (t.padding ?? 0) / 1.5 - (c.y - (c.top ?? 0))})`
  ), t.intersect = function(C) {
    const b = lt.rect(t, C), w = b.x - (t.x ?? 0);
    if (d != 0 && (Math.abs(w) < (t.width ?? 0) / 2 || Math.abs(w) == (t.width ?? 0) / 2 && Math.abs(b.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - f)) {
      let _ = f * f * (1 - w * w / (d * d));
      _ > 0 && (_ = Math.sqrt(_)), _ = f - _, C.y - (t.y ?? 0) > 0 && (_ = -_), b.y += _;
    }
    return b;
  }, l;
}
p(xy, "cylinder");
async function bs(e, t, r) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: n } = await Ct(e, t, bt(t)), a = Math.max(n.width + r.labelPaddingX * 2, t?.width || 0), l = Math.max(n.height + r.labelPaddingY * 2, t?.height || 0), c = -a / 2, h = -l / 2;
  let u, { rx: d, ry: f } = t;
  const { cssStyles: m } = t;
  if (r?.rx && r.ry && (d = r.rx, f = r.ry), t.look === "handDrawn") {
    const y = ft.svg(o), x = ut(t, {}), C = d || f ? y.path(Xe(c, h, a, l, d || 0), x) : y.rectangle(c, h, a, l, x);
    u = o.insert(() => C, ":first-child"), u.attr("class", "basic label-container").attr("style", re(m));
  } else
    u = o.insert("rect", ":first-child"), u.attr("class", "basic label-container").attr("style", s).attr("rx", re(d)).attr("ry", re(f)).attr("x", c).attr("y", h).attr("width", a).attr("height", l);
  return pt(
    t,
    u,
    t.look === "handDrawn" ? void 0 : { width: a, height: l }
  ), t.calcIntersect = function(y, x) {
    return lt.rect(y, x);
  }, t.intersect = function(y) {
    return lt.rect(t, y);
  }, o;
}
p(bs, "drawRect");
async function Cy(e, t) {
  const { cssClasses: r, labelPaddingX: i, labelPaddingY: s, padding: o, width: n, height: a } = t, l = {
    rx: 0,
    ry: 0,
    labelPaddingX: i ?? (o ?? 0) * 2,
    labelPaddingY: s ?? o ?? 0
  }, c = await bs(e, t, l);
  if (t.look === "handDrawn") {
    const f = ft.svg(c), m = ut(t, {}), y = c.select(".basic.label-container > path:nth-child(2)"), x = y.node();
    if (!x)
      return c;
    let C = null;
    if (x instanceof SVGGraphicsElement)
      C = x.getBBox();
    else
      return c;
    return c.insert(
      () => f.line(C.x, C.y, C.x + C.width, C.y, m),
      ".basic.label-container g.label"
    ), c.insert(
      () => f.line(
        C.x,
        C.y + C.height,
        C.x + C.width,
        C.y + C.height,
        m
      ),
      ".basic.label-container g.label"
    ), y.remove(), c;
  }
  const h = c.select(".basic.label-container"), u = (Number(h.attr("width")) || n) ?? 0, d = (Number(h.attr("height")) || a) ?? 0;
  return u > 0 && d > 0 && h.attr("stroke-dasharray", `${u} ${d}`), c;
}
p(Cy, "datastore");
async function by(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 16 : t.padding ?? 0, { shapeSvg: n, bbox: a, label: l } = await Ct(e, t, bt(t)), c = a.width + s, h = a.height + o, u = h * 0.2, d = -c / 2, f = -h / 2 - u / 2, { cssStyles: m } = t, y = ft.svg(n), x = ut(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = [
    { x: d, y: f + u },
    { x: -d, y: f + u },
    { x: -d, y: -f },
    { x: d, y: -f },
    { x: d, y: f },
    { x: -d, y: f },
    { x: -d, y: f + u }
  ], b = y.polygon(
    C.map((_) => [_.x, _.y]),
    x
  ), w = n.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && w.selectAll("path").attr("style", m), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${d + (t.padding ?? 0) / 2 - (a.x - (a.left ?? 0))}, ${f + u + (t.padding ?? 0) / 2 - (a.y - (a.top ?? 0))})`
  ), pt(t, w), t.intersect = function(_) {
    return lt.rect(t, _);
  }, n;
}
p(by, "dividedRectangle");
async function ky(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t), s = t.look === "neo" ? 12 : 5;
  t.labelStyle = r;
  const o = t.padding ?? 0, n = t.look === "neo" ? 16 : o, { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = (t?.width ? t?.width / 2 : l.width / 2) + (n ?? 0), h = c - s;
  let u;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const f = ft.svg(a), m = ut(t, { roughness: 0.2, strokeWidth: 2.5 }), y = ut(t, { roughness: 0.2, strokeWidth: 1.5 }), x = f.circle(0, 0, c * 2, m), C = f.circle(0, 0, h * 2, y);
    u = a.insert("g", ":first-child"), u.attr("class", re(t.cssClasses)).attr("style", re(d)), u.node()?.appendChild(x), u.node()?.appendChild(C);
  } else {
    u = a.insert("g", ":first-child");
    const f = u.insert("circle", ":first-child"), m = u.insert("circle");
    u.attr("class", "basic label-container").attr("style", i), f.attr("class", "outer-circle").attr("style", i).attr("r", c).attr("cx", 0).attr("cy", 0), m.attr("class", "inner-circle").attr("style", i).attr("r", h).attr("cx", 0).attr("cy", 0);
  }
  return pt(t, u), t.intersect = function(f) {
    return q.info("DoubleCircle intersect", t, c, f), lt.circle(t, c, f);
  }, a;
}
p(ky, "doublecircle");
function wy(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.label = "", t.labelStyle = i;
  const o = e.insert("g").attr("class", bt(t)).attr("id", t.domId ?? t.id), n = 7, { cssStyles: a } = t, l = ft.svg(o), { nodeBorder: c } = r, h = ut(t, { fillStyle: "solid" });
  t.look !== "handDrawn" && (h.roughness = 0);
  const u = l.circle(0, 0, n * 2, h), d = o.insert(() => u, ":first-child");
  return d.selectAll("path").attr("style", `fill: ${c} !important;`), a && a.length > 0 && t.look !== "handDrawn" && d.selectAll("path").attr("style", a), s && t.look !== "handDrawn" && d.selectAll("path").attr("style", s), pt(t, d), t.intersect = function(f) {
    return q.info("filledCircle intersect", t, { radius: n, point: f }), lt.circle(t, n, f);
  }, o;
}
p(wy, "filledCircle");
var zd = 10, Hd = 10;
async function Sy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? s * 2 : s;
  (t.width || t.height) && (t.height = t?.height ?? 0, t.height < zd && (t.height = zd), t.width = (t?.width ?? 0) - o - o / 2, t.width < Hd && (t.width = Hd));
  const { shapeSvg: n, bbox: a, label: l } = await Ct(e, t, bt(t)), c = (t?.width ? t?.width : a.width) + (o ?? 0), h = t?.height ? t?.height : c + a.height, u = h, d = [
    { x: 0, y: -h },
    { x: u, y: -h },
    { x: u / 2, y: 0 }
  ], { cssStyles: f } = t, m = ft.svg(n), y = ut(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = Rt(d), C = m.path(x, y), b = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${h / 2})`).attr("class", "outer-path");
  return f && t.look !== "handDrawn" && b.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && b.selectChildren("path").attr("style", i), t.width = c, t.height = h, pt(t, b), l.attr(
    "transform",
    `translate(${-a.width / 2 - (a.x - (a.left ?? 0))}, ${-h / 2 + (t.padding ?? 0) / 2 + (a.y - (a.top ?? 0))})`
  ), t.intersect = function(w) {
    return q.info("Triangle intersect", t, d, w), lt.polygon(t, d, w);
  }, n;
}
p(Sy, "flippedTriangle");
async function Ty(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: n } = await Ct(e, t, bt(t)), a = t.padding ?? 12, l = Math.max(o.width + a * 2, t.width ?? 0, 90), c = o.height + a * 2, h = Math.max(Math.min(c * 0.16, 14), 8), u = Math.max(c + h, t.height ?? 0), d = u - h, f = Math.max(l * 0.38, 28), m = -u / 2, y = [
    { x: -l / 2, y: m },
    { x: -l / 2 + f, y: m },
    { x: -l / 2 + f, y: m + h },
    { x: l / 2, y: m + h },
    { x: l / 2, y: u / 2 },
    { x: -l / 2, y: u / 2 }
  ], x = [
    `M${y[0].x},${y[0].y}`,
    ...y.slice(1).map((_) => `L${_.x},${_.y}`),
    "Z"
  ].join(" "), { cssStyles: C } = t;
  let b;
  if (t.look === "handDrawn") {
    const v = ft.svg(s).path(x, ut(t, {}));
    b = s.insert(() => v, ":first-child").attr("class", "basic label-container"), C && b.attr("style", C);
  } else
    b = s.insert("path", ":first-child").attr("d", x).attr("class", "basic label-container").attr("style", i);
  t.look === "handDrawn" ? pt(t, b) : pt(t, b, { width: l, height: u });
  const w = m + h + d / 2;
  return n.attr(
    "transform",
    `translate(${-(o.width / 2) - (o.x - (o.left ?? 0))}, ${w - o.height / 2 - (o.y - (o.top ?? 0))})`
  ), t.intersect = function(_) {
    return lt.polygon(t, y, _);
  }, s;
}
p(Ty, "folder");
function _y(e, t, { dir: r, config: { state: i, themeVariables: s } }) {
  const { nodeStyles: o } = gt(t);
  t.label = "";
  const n = e.insert("g").attr("class", bt(t)).attr("id", t.domId ?? t.id), { cssStyles: a } = t;
  let l = Math.max(70, t?.width ?? 0), c = Math.max(10, t?.height ?? 0);
  r === "LR" && (l = Math.max(10, t?.width ?? 0), c = Math.max(70, t?.height ?? 0));
  const h = -1 * l / 2, u = -1 * c / 2, d = ft.svg(n), f = ut(t, {
    stroke: s.lineColor,
    fill: s.lineColor
  });
  t.look !== "handDrawn" && (f.roughness = 0, f.fillStyle = "solid");
  const m = d.rectangle(h, u, l, c, f), y = n.insert(() => m, ":first-child");
  a && t.look !== "handDrawn" && y.selectAll("path").attr("style", a), o && t.look !== "handDrawn" && y.selectAll("path").attr("style", o), pt(t, y);
  const x = i?.padding ?? 0;
  return t.width && t.height && (t.width += x / 2 || 0, t.height += x / 2 || 0), t.intersect = function(C) {
    return lt.rect(t, C);
  }, n;
}
p(_y, "forkJoin");
async function vy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = 15, o = 10, n = t.look === "neo" ? 16 : t.padding ?? 0, a = t.look === "neo" ? 12 : t.padding ?? 0;
  (t.width || t.height) && (t.height = (t?.height ?? 0) - a * 2, t.height < o && (t.height = o), t.width = (t?.width ?? 0) - n * 2, t.width < s && (t.width = s));
  const { shapeSvg: l, bbox: c } = await Ct(e, t, bt(t)), h = (t?.width ? t?.width : Math.max(s, c.width)) + n * 2, u = (t?.height ? t?.height : Math.max(o, c.height)) + a * 2, d = u / 2, { cssStyles: f } = t, m = ft.svg(l), y = ut(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -h / 2, y: -u / 2 },
    { x: h / 2 - d, y: -u / 2 },
    ...dr(-h / 2 + d, 0, d, 50, 90, 270),
    { x: h / 2 - d, y: u / 2 },
    { x: -h / 2, y: u / 2 }
  ], C = Rt(x), b = m.path(C, y), w = l.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && w.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), pt(t, w), t.intersect = function(_) {
    return q.info("Pill intersect", t, { radius: d, point: _ }), lt.polygon(t, x, _);
  }, l;
}
p(vy, "halfRoundedRectangle");
var pB = /* @__PURE__ */ p((e, t, r, i, s) => [
  `M${e + s},${t}`,
  `L${e + r - s},${t}`,
  `L${e + r},${t - i / 2}`,
  `L${e + r - s},${t - i}`,
  `L${e + s},${t - i}`,
  `L${e},${t - i / 2}`,
  "Z"
].join(" "), "createHexagonPathD");
async function By(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t), s = t.look === "neo" ? 3.5 : 4;
  t.labelStyle = r;
  const o = t.padding ?? 0, n = 70, a = 32, l = t.look === "neo" ? n : o, c = t.look === "neo" ? a : o;
  if (t.width || t.height) {
    const w = (t.height ?? 0) / s;
    t.width = (t?.width ?? 0) - 2 * w - c, t.height = (t.height ?? 0) - l;
  }
  const { shapeSvg: h, bbox: u } = await Ct(e, t, bt(t)), d = (t?.height ? t?.height : u.height) + l, f = d / s, m = (t?.width ? t?.width : u.width) + 2 * f + c, y = [
    { x: f, y: 0 },
    { x: m - f, y: 0 },
    { x: m, y: -d / 2 },
    { x: m - f, y: -d },
    { x: f, y: -d },
    { x: 0, y: -d / 2 }
  ];
  let x;
  const { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const b = ft.svg(h), w = ut(t, {}), _ = pB(0, 0, m, d, f), v = b.path(_, w);
    x = h.insert(() => v, ":first-child").attr("transform", `translate(${-m / 2}, ${d / 2})`), C && x.attr("style", C);
  } else
    x = br(h, m, d, y);
  return i && x.attr("style", i), t.width = m, t.height = d, pt(t, x), t.intersect = function(b) {
    return lt.polygon(t, y, b);
  }, h;
}
p(By, "hexagon");
async function Ly(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.label = "", t.labelStyle = r;
  const { shapeSvg: s } = await Ct(e, t, bt(t)), o = Math.max(30, t?.width ?? 0), n = Math.max(30, t?.height ?? 0), { cssStyles: a } = t, l = ft.svg(s), c = ut(t, {});
  t.look !== "handDrawn" && (c.roughness = 0, c.fillStyle = "solid");
  const h = [
    { x: 0, y: 0 },
    { x: o, y: 0 },
    { x: 0, y: n },
    { x: o, y: n }
  ], u = Rt(h), d = l.path(u, c), f = s.insert(() => d, ":first-child");
  return f.attr("class", "basic label-container outer-path"), a && t.look !== "handDrawn" && f.selectChildren("path").attr("style", a), i && t.look !== "handDrawn" && f.selectChildren("path").attr("style", i), f.attr("transform", `translate(${-o / 2}, ${-n / 2})`), pt(t, f), t.intersect = function(m) {
    return q.info("Pill intersect", t, { points: h }), lt.polygon(t, h, m);
  }, s;
}
p(Ly, "hourglass");
async function Ay(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = gt(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, n = t.assetWidth ?? 48, a = Math.max(o, n), l = i?.wrappingWidth;
  t.width = Math.max(a, l ?? 0);
  const { shapeSvg: c, bbox: h, label: u } = await Ct(e, t, "icon-shape default"), d = t.pos === "t", f = a, m = a, { nodeBorder: y } = r, { stylesMap: x } = Cs(t), C = -m / 2, b = -f / 2, w = t.label ? 8 : 0, _ = ft.svg(c), v = ut(t, { stroke: "none", fill: "none" });
  t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
  const E = _.rectangle(C, b, m, f, v), A = Math.max(m, h.width), L = f + h.height + w, z = _.rectangle(-A / 2, -L / 2, A, L, {
    ...v,
    fill: "transparent",
    stroke: "none"
  }), W = c.insert(() => E, ":first-child"), R = c.insert(() => z);
  if (t.icon) {
    const st = c.append("g");
    st.html(
      `<g>${await vo(t.icon, {
        height: a,
        width: a,
        fallbackPrefix: ""
      })}</g>`
    );
    const j = st.node().getBBox(), O = j.width, I = j.height, B = j.x, M = j.y;
    st.attr(
      "transform",
      `translate(${-O / 2 - B},${d ? h.height / 2 + w / 2 - I / 2 - M : -h.height / 2 - w / 2 - I / 2 - M})`
    ), st.attr("style", `color: ${x.get("stroke") ?? y};`);
  }
  return u.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${d ? -L / 2 : L / 2 - h.height})`
  ), W.attr(
    "transform",
    `translate(0,${d ? h.height / 2 + w / 2 : -h.height / 2 - w / 2})`
  ), pt(t, R), t.intersect = function(st) {
    if (q.info("iconSquare intersect", t, st), !t.label)
      return lt.rect(t, st);
    const j = t.x ?? 0, O = t.y ?? 0, I = t.height ?? 0;
    let B = [];
    return d ? B = [
      { x: j - h.width / 2, y: O - I / 2 },
      { x: j + h.width / 2, y: O - I / 2 },
      { x: j + h.width / 2, y: O - I / 2 + h.height + w },
      { x: j + m / 2, y: O - I / 2 + h.height + w },
      { x: j + m / 2, y: O + I / 2 },
      { x: j - m / 2, y: O + I / 2 },
      { x: j - m / 2, y: O - I / 2 + h.height + w },
      { x: j - h.width / 2, y: O - I / 2 + h.height + w }
    ] : B = [
      { x: j - m / 2, y: O - I / 2 },
      { x: j + m / 2, y: O - I / 2 },
      { x: j + m / 2, y: O - I / 2 + f },
      { x: j + h.width / 2, y: O - I / 2 + f },
      { x: j + h.width / 2 / 2, y: O + I / 2 },
      { x: j - h.width / 2, y: O + I / 2 },
      { x: j - h.width / 2, y: O - I / 2 + f },
      { x: j - m / 2, y: O - I / 2 + f }
    ], lt.polygon(t, B, st);
  }, c;
}
p(Ay, "icon");
async function Ey(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = gt(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, n = t.assetWidth ?? 48, a = Math.max(o, n), l = i?.wrappingWidth;
  t.width = Math.max(a, l ?? 0);
  const { shapeSvg: c, bbox: h, label: u } = await Ct(e, t, "icon-shape default"), d = 20, f = t.label ? 8 : 0, m = t.pos === "t", { nodeBorder: y, mainBkg: x } = r, { stylesMap: C } = Cs(t), b = ft.svg(c), w = ut(t, {});
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const _ = C.get("fill");
  w.stroke = _ ?? x;
  const v = c.append("g");
  t.icon && v.html(
    `<g>${await vo(t.icon, {
      height: a,
      width: a,
      fallbackPrefix: ""
    })}</g>`
  );
  const E = v.node().getBBox(), A = E.width, L = E.height, z = E.x, W = E.y, R = Math.max(A, L) * Math.SQRT2 + d * 2, st = b.circle(0, 0, R, w), j = Math.max(R, h.width), O = R + h.height + f, I = b.rectangle(-j / 2, -O / 2, j, O, {
    ...w,
    fill: "transparent",
    stroke: "none"
  }), B = c.insert(() => st, ":first-child"), M = c.insert(() => I);
  return v.attr(
    "transform",
    `translate(${-A / 2 - z},${m ? h.height / 2 + f / 2 - L / 2 - W : -h.height / 2 - f / 2 - L / 2 - W})`
  ), v.attr("style", `color: ${C.get("stroke") ?? y};`), u.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${m ? -O / 2 : O / 2 - h.height})`
  ), B.attr(
    "transform",
    `translate(0,${m ? h.height / 2 + f / 2 : -h.height / 2 - f / 2})`
  ), pt(t, M), t.intersect = function(F) {
    return q.info("iconSquare intersect", t, F), lt.rect(t, F);
  }, c;
}
p(Ey, "iconCircle");
async function Fy(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = gt(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, n = t.assetWidth ?? 48, a = Math.max(o, n), l = i?.wrappingWidth;
  t.width = Math.max(a, l ?? 0);
  const { shapeSvg: c, bbox: h, halfPadding: u, label: d } = await Ct(
    e,
    t,
    "icon-shape default"
  ), f = t.pos === "t", m = a + u * 2, y = a + u * 2, { nodeBorder: x, mainBkg: C } = r, { stylesMap: b } = Cs(t), w = -y / 2, _ = -m / 2, v = t.label ? 8 : 0, E = ft.svg(c), A = ut(t, {});
  t.look !== "handDrawn" && (A.roughness = 0, A.fillStyle = "solid");
  const L = b.get("fill");
  A.stroke = L ?? C;
  const z = E.path(Xe(w, _, y, m, 5), A), W = Math.max(y, h.width), R = m + h.height + v, st = E.rectangle(-W / 2, -R / 2, W, R, {
    ...A,
    fill: "transparent",
    stroke: "none"
  }), j = c.insert(() => z, ":first-child").attr("class", "icon-shape2"), O = c.insert(() => st);
  if (t.icon) {
    const I = c.append("g");
    I.html(
      `<g>${await vo(t.icon, {
        height: a,
        width: a,
        fallbackPrefix: ""
      })}</g>`
    );
    const B = I.node().getBBox(), M = B.width, F = B.height, Q = B.x, Z = B.y;
    I.attr(
      "transform",
      `translate(${-M / 2 - Q},${f ? h.height / 2 + v / 2 - F / 2 - Z : -h.height / 2 - v / 2 - F / 2 - Z})`
    ), I.attr("style", `color: ${b.get("stroke") ?? x};`);
  }
  return d.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${f ? -R / 2 : R / 2 - h.height})`
  ), j.attr(
    "transform",
    `translate(0,${f ? h.height / 2 + v / 2 : -h.height / 2 - v / 2})`
  ), pt(t, O), t.intersect = function(I) {
    if (q.info("iconSquare intersect", t, I), !t.label)
      return lt.rect(t, I);
    const B = t.x ?? 0, M = t.y ?? 0, F = t.height ?? 0;
    let Q = [];
    return f ? Q = [
      { x: B - h.width / 2, y: M - F / 2 },
      { x: B + h.width / 2, y: M - F / 2 },
      { x: B + h.width / 2, y: M - F / 2 + h.height + v },
      { x: B + y / 2, y: M - F / 2 + h.height + v },
      { x: B + y / 2, y: M + F / 2 },
      { x: B - y / 2, y: M + F / 2 },
      { x: B - y / 2, y: M - F / 2 + h.height + v },
      { x: B - h.width / 2, y: M - F / 2 + h.height + v }
    ] : Q = [
      { x: B - y / 2, y: M - F / 2 },
      { x: B + y / 2, y: M - F / 2 },
      { x: B + y / 2, y: M - F / 2 + m },
      { x: B + h.width / 2, y: M - F / 2 + m },
      { x: B + h.width / 2 / 2, y: M + F / 2 },
      { x: B - h.width / 2, y: M + F / 2 },
      { x: B - h.width / 2, y: M - F / 2 + m },
      { x: B - y / 2, y: M - F / 2 + m }
    ], lt.polygon(t, Q, I);
  }, c;
}
p(Fy, "iconRounded");
async function My(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = gt(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, n = t.assetWidth ?? 48, a = Math.max(o, n), l = i?.wrappingWidth;
  t.width = Math.max(a, l ?? 0);
  const { shapeSvg: c, bbox: h, halfPadding: u, label: d } = await Ct(
    e,
    t,
    "icon-shape default"
  ), f = t.pos === "t", m = a + u * 2, y = a + u * 2, { nodeBorder: x, mainBkg: C } = r, { stylesMap: b } = Cs(t), w = -y / 2, _ = -m / 2, v = t.label ? 8 : 0, E = ft.svg(c), A = ut(t, {});
  t.look !== "handDrawn" && (A.roughness = 0, A.fillStyle = "solid");
  const L = b.get("fill");
  A.stroke = L ?? C;
  const z = E.path(Xe(w, _, y, m, 0.1), A), W = Math.max(y, h.width), R = m + h.height + v, st = E.rectangle(-W / 2, -R / 2, W, R, {
    ...A,
    fill: "transparent",
    stroke: "none"
  }), j = c.insert(() => z, ":first-child"), O = c.insert(() => st);
  if (t.icon) {
    const I = c.append("g");
    I.html(
      `<g>${await vo(t.icon, {
        height: a,
        width: a,
        fallbackPrefix: ""
      })}</g>`
    );
    const B = I.node().getBBox(), M = B.width, F = B.height, Q = B.x, Z = B.y;
    I.attr(
      "transform",
      `translate(${-M / 2 - Q},${f ? h.height / 2 + v / 2 - F / 2 - Z : -h.height / 2 - v / 2 - F / 2 - Z})`
    ), I.attr("style", `color: ${b.get("stroke") ?? x};`);
  }
  return d.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${f ? -R / 2 : R / 2 - h.height})`
  ), j.attr(
    "transform",
    `translate(0,${f ? h.height / 2 + v / 2 : -h.height / 2 - v / 2})`
  ), pt(t, O), t.intersect = function(I) {
    if (q.info("iconSquare intersect", t, I), !t.label)
      return lt.rect(t, I);
    const B = t.x ?? 0, M = t.y ?? 0, F = t.height ?? 0;
    let Q = [];
    return f ? Q = [
      { x: B - h.width / 2, y: M - F / 2 },
      { x: B + h.width / 2, y: M - F / 2 },
      { x: B + h.width / 2, y: M - F / 2 + h.height + v },
      { x: B + y / 2, y: M - F / 2 + h.height + v },
      { x: B + y / 2, y: M + F / 2 },
      { x: B - y / 2, y: M + F / 2 },
      { x: B - y / 2, y: M - F / 2 + h.height + v },
      { x: B - h.width / 2, y: M - F / 2 + h.height + v }
    ] : Q = [
      { x: B - y / 2, y: M - F / 2 },
      { x: B + y / 2, y: M - F / 2 },
      { x: B + y / 2, y: M - F / 2 + m },
      { x: B + h.width / 2, y: M - F / 2 + m },
      { x: B + h.width / 2 / 2, y: M + F / 2 },
      { x: B - h.width / 2, y: M + F / 2 },
      { x: B - h.width / 2, y: M - F / 2 + m },
      { x: B - y / 2, y: M - F / 2 + m }
    ], lt.polygon(t, Q, I);
  }, c;
}
p(My, "iconSquare");
async function $y(e, t, { config: { flowchart: r } }) {
  const i = new Image();
  i.src = t?.img ?? "", await i.decode();
  const s = Number(i.naturalWidth.toString().replace("px", "")), o = Number(i.naturalHeight.toString().replace("px", ""));
  t.imageAspectRatio = s / o;
  const { labelStyles: n } = gt(t);
  t.labelStyle = n;
  const a = r?.wrappingWidth;
  t.defaultWidth = r?.wrappingWidth;
  const l = Math.max(
    t.label ? a ?? 0 : 0,
    t?.assetWidth ?? s
  ), c = t.constraint === "on" && t?.assetHeight ? t.assetHeight * t.imageAspectRatio : l, h = t.constraint === "on" ? c / t.imageAspectRatio : t?.assetHeight ?? o;
  t.width = Math.max(c, a ?? 0);
  const { shapeSvg: u, bbox: d, label: f } = await Ct(e, t, "image-shape default"), m = t.pos === "t", y = -c / 2, x = -h / 2, C = t.label ? 8 : 0, b = ft.svg(u), w = ut(t, {});
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const _ = b.rectangle(y, x, c, h, w), v = Math.max(c, d.width), E = h + d.height + C, A = b.rectangle(-v / 2, -E / 2, v, E, {
    ...w,
    fill: "none",
    stroke: "none"
  }), L = u.insert(() => _, ":first-child"), z = u.insert(() => A);
  if (t.img) {
    const W = u.append("image");
    W.attr("href", t.img), W.attr("width", c), W.attr("height", h), W.attr("preserveAspectRatio", "none"), W.attr(
      "transform",
      `translate(${-c / 2},${m ? E / 2 - h : -E / 2})`
    );
  }
  return f.attr(
    "transform",
    `translate(${-d.width / 2 - (d.x - (d.left ?? 0))},${m ? -h / 2 - d.height / 2 - C / 2 : h / 2 - d.height / 2 + C / 2})`
  ), L.attr(
    "transform",
    `translate(0,${m ? d.height / 2 + C / 2 : -d.height / 2 - C / 2})`
  ), pt(t, z), t.intersect = function(W) {
    if (q.info("iconSquare intersect", t, W), !t.label)
      return lt.rect(t, W);
    const R = t.x ?? 0, st = t.y ?? 0, j = t.height ?? 0;
    let O = [];
    return m ? O = [
      { x: R - d.width / 2, y: st - j / 2 },
      { x: R + d.width / 2, y: st - j / 2 },
      { x: R + d.width / 2, y: st - j / 2 + d.height + C },
      { x: R + c / 2, y: st - j / 2 + d.height + C },
      { x: R + c / 2, y: st + j / 2 },
      { x: R - c / 2, y: st + j / 2 },
      { x: R - c / 2, y: st - j / 2 + d.height + C },
      { x: R - d.width / 2, y: st - j / 2 + d.height + C }
    ] : O = [
      { x: R - c / 2, y: st - j / 2 },
      { x: R + c / 2, y: st - j / 2 },
      { x: R + c / 2, y: st - j / 2 + h },
      { x: R + d.width / 2, y: st - j / 2 + h },
      { x: R + d.width / 2 / 2, y: st + j / 2 },
      { x: R - d.width / 2, y: st + j / 2 },
      { x: R - d.width / 2, y: st - j / 2 + h },
      { x: R - c / 2, y: st - j / 2 + h }
    ], lt.polygon(t, O, W);
  }, u;
}
p($y, "imageSquare");
async function Oy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, n = t.look === "neo" ? s * 2 : s, { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = Math.max(l.height + o * 2, t.height ?? 0), h = Math.max(l.width + n * 2, (t.width ?? 0) - c), u = [
    { x: 0, y: 0 },
    { x: h, y: 0 },
    { x: h + 3 * c / 6, y: -c },
    { x: -3 * c / 6, y: -c }
  ];
  let d;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = ft.svg(a), y = ut(t, {}), x = Rt(u), C = m.path(x, y);
    d = a.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && d.attr("style", f);
  } else
    d = br(a, h, c, u);
  return i && d.attr("style", i), t.width = h, t.height = c, pt(t, d), t.intersect = function(m) {
    return lt.polygon(t, u, m);
  }, a;
}
p(Oy, "inv_trapezoid");
async function Iy(e, t) {
  const { shapeSvg: r, bbox: i, label: s } = await Ct(e, t, "label"), o = r.insert("rect", ":first-child");
  return o.attr("width", 0.1).attr("height", 0.1), r.attr("class", "label edgeLabel"), s.attr(
    "transform",
    `translate(${-(i.width / 2) - (i.x - (i.left ?? 0))}, ${-(i.height / 2) - (i.y - (i.top ?? 0))})`
  ), pt(t, o), t.intersect = function(l) {
    return lt.rect(t, l);
  }, r;
}
p(Iy, "labelRect");
async function Dy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, n = t.look === "neo" ? s * 2 : s, { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + n, (t.width ?? 0) - c), u = [
    { x: 0, y: 0 },
    { x: h + 3 * c / 6, y: 0 },
    { x: h, y: -c },
    { x: -(3 * c) / 6, y: -c }
  ];
  let d;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = ft.svg(a), y = ut(t, {}), x = Rt(u), C = m.path(x, y);
    d = a.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && d.attr("style", f);
  } else
    d = br(a, h, c, u);
  return i && d.attr("style", i), t.width = h, t.height = c, pt(t, d), t.intersect = function(m) {
    return lt.polygon(t, u, m);
  }, a;
}
p(Dy, "lean_left");
async function Py(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, n = t.look === "neo" ? s * 2 : s, { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + n, (t.width ?? 0) - c), u = [
    { x: -3 * c / 6, y: 0 },
    { x: h, y: 0 },
    { x: h + 3 * c / 6, y: -c },
    { x: 0, y: -c }
  ];
  let d;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = ft.svg(a), y = ut(t, {}), x = Rt(u), C = m.path(x, y);
    d = a.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && d.attr("style", f);
  } else
    d = br(a, h, c, u);
  return i && d.attr("style", i), t.width = h, t.height = c, pt(t, d), t.intersect = function(m) {
    return lt.polygon(t, u, m);
  }, a;
}
p(Py, "lean_right");
function Ry(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.label = "", t.labelStyle = r;
  const s = e.insert("g").attr("class", bt(t)).attr("id", t.domId ?? t.id), { cssStyles: o } = t, n = Math.max(35, t?.width ?? 0), a = Math.max(35, t?.height ?? 0), l = 7, c = [
    { x: n, y: 0 },
    { x: 0, y: a + l / 2 },
    { x: n - 2 * l, y: a + l / 2 },
    { x: 0, y: 2 * a },
    { x: n, y: a - l / 2 },
    { x: 2 * l, y: a - l / 2 }
  ], h = ft.svg(s), u = ut(t, {});
  t.look !== "handDrawn" && (u.roughness = 0, u.fillStyle = "solid");
  const d = Rt(c), f = h.path(d, u), m = s.insert(() => f, ":first-child");
  return m.attr("class", "outer-path"), o && t.look !== "handDrawn" && m.selectAll("path").attr("style", o), i && t.look !== "handDrawn" && m.selectAll("path").attr("style", i), m.attr("transform", `translate(-${n / 2},${-a})`), pt(t, m), t.intersect = function(y) {
    return q.info("lightningBolt intersect", t, y), lt.polygon(t, c, y);
  }, s;
}
p(Ry, "lightningBolt");
var gB = /* @__PURE__ */ p((e, t, r, i, s, o, n) => [
  `M${e},${t + o}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`,
  `M${e},${t + o + n}`,
  `a${s},${o} 0,0,0 ${r},0`
].join(" "), "createCylinderPathD"), mB = /* @__PURE__ */ p((e, t, r, i, s, o, n) => [
  `M${e},${t + o}`,
  `M${e + r},${t + o}`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`,
  `M${e},${t + o + n}`,
  `a${s},${o} 0,0,0 ${r},0`
].join(" "), "createOuterCylinderPathD"), yB = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e - r / 2},${-i / 2}`, `a${s},${o} 0,0,0 ${r},0`].join(" "), "createInnerCylinderPathD"), Yd = 10, Ud = 10;
async function Ny(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 24 : s;
  if (t.width || t.height) {
    const C = t.width ?? 0;
    t.width = (t.width ?? 0) - o, t.width < Ud && (t.width = Ud);
    const w = C / 2 / (2.5 + C / 50);
    t.height = (t.height ?? 0) - n - w * 3, t.height < Yd && (t.height = Yd);
  }
  const { shapeSvg: a, bbox: l, label: c } = await Ct(e, t, bt(t)), h = (t?.width ? t?.width : l.width) + o * 2, u = h / 2, d = u / (2.5 + h / 50), f = (t?.height ? t?.height : l.height) + d + n * 2, m = f * 0.1;
  let y;
  const { cssStyles: x } = t;
  if (t.look === "handDrawn") {
    const C = ft.svg(a), b = mB(0, 0, h, f, u, d, m), w = yB(0, d, h, f, u, d), _ = ut(t, {}), v = C.path(b, _), E = C.path(w, _);
    a.insert(() => E, ":first-child").attr("class", "line"), y = a.insert(() => v, ":first-child"), y.attr("class", "basic label-container"), x && y.attr("style", x);
  } else {
    const C = gB(0, 0, h, f, u, d, m);
    y = a.insert("path", ":first-child").attr("d", C).attr("class", "basic label-container outer-path").attr("style", re(x)).attr("style", i);
  }
  return y.attr("label-offset-y", d), y.attr("transform", `translate(${-h / 2}, ${-(f / 2 + d)})`), pt(t, y), c.attr(
    "transform",
    `translate(${-(l.width / 2) - (l.x - (l.left ?? 0))}, ${-(l.height / 2) + d - (l.y - (l.top ?? 0))})`
  ), t.intersect = function(C) {
    const b = lt.rect(t, C), w = b.x - (t.x ?? 0);
    if (u != 0 && (Math.abs(w) < (t.width ?? 0) / 2 || Math.abs(w) == (t.width ?? 0) / 2 && Math.abs(b.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - d)) {
      let _ = d * d * (1 - w * w / (u * u));
      _ > 0 && (_ = Math.sqrt(_)), _ = d - _, C.y - (t.y ?? 0) > 0 && (_ = -_), b.y += _;
    }
    return b;
  }, a;
}
p(Ny, "linedCylinder");
async function qy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 12 : s;
  if (t.width || t.height) {
    const _ = t.width;
    t.width = (_ ?? 0) * 10 / 11 - o * 2, t.width < 10 && (t.width = 10), t.height = (t?.height ?? 0) - n * 2, t.height < 10 && (t.height = 10);
  }
  const { shapeSvg: a, bbox: l, label: c } = await Ct(e, t, bt(t)), h = (t?.width ? t?.width : l.width) + (o ?? 0) * 2, u = (t?.height ? t?.height : l.height) + (n ?? 0) * 2, d = t.look === "neo" ? u / 4 : u / 8, f = u + d, { cssStyles: m } = t, y = ft.svg(a), x = ut(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = [
    { x: -h / 2 - h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2 - h / 2 * 0.1, y: f / 2 },
    ...Jr(
      -h / 2 - h / 2 * 0.1,
      f / 2,
      h / 2 + h / 2 * 0.1,
      f / 2,
      d,
      0.8
    ),
    { x: h / 2 + h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2 - h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2, y: -f / 2 },
    { x: -h / 2, y: f / 2 * 1.1 },
    { x: -h / 2, y: -f / 2 }
  ], b = y.polygon(
    C.map((_) => [_.x, _.y]),
    x
  ), w = a.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && w.selectAll("path").attr("style", m), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), w.attr("transform", `translate(0,${-d / 2})`), c.attr(
    "transform",
    `translate(${-h / 2 + (t.padding ?? 0) + h / 2 * 0.1 / 2 - (l.x - (l.left ?? 0))},${-u / 2 + (t.padding ?? 0) - d / 2 - (l.y - (l.top ?? 0))})`
  ), pt(t, w), t.intersect = function(_) {
    return lt.polygon(t, C, _);
  }, a;
}
p(qy, "linedWaveEdgedRect");
async function Wy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 12 : s, a = t.look === "neo" ? 10 : 5;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - o * 2 - 2 * a, 10), t.height = Math.max((t?.height ?? 0) - n * 2 - 2 * a, 10));
  const { shapeSvg: l, bbox: c, label: h } = await Ct(e, t, bt(t)), u = (t?.width ? t?.width : c.width) + o * 2 + 2 * a, d = (t?.height ? t?.height : c.height) + n * 2 + 2 * a, f = u - 2 * a, m = d - 2 * a, y = -f / 2, x = -m / 2, { cssStyles: C } = t, b = ft.svg(l), w = ut(t, {}), _ = [
    { x: y - a, y: x + a },
    { x: y - a, y: x + m + a },
    { x: y + f - a, y: x + m + a },
    { x: y + f - a, y: x + m },
    { x: y + f, y: x + m },
    { x: y + f, y: x + m - a },
    { x: y + f + a, y: x + m - a },
    { x: y + f + a, y: x - a },
    { x: y + a, y: x - a },
    { x: y + a, y: x },
    { x: y, y: x },
    { x: y, y: x + a }
  ], v = [
    { x: y, y: x + a },
    { x: y + f - a, y: x + a },
    { x: y + f - a, y: x + m },
    { x: y + f, y: x + m },
    { x: y + f, y: x },
    { x: y, y: x }
  ];
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const E = Rt(_);
  let A = b.path(E, w);
  const L = Rt(v);
  let z = b.path(L, w);
  t.look !== "handDrawn" && (A = sh(A), z = sh(z));
  const W = l.insert("g", ":first-child");
  return W.insert(() => A), W.insert(() => z), W.attr("class", "basic label-container outer-path"), C && t.look !== "handDrawn" && W.selectAll("path").attr("style", C), i && t.look !== "handDrawn" && W.selectAll("path").attr("style", i), h.attr(
    "transform",
    `translate(${-(c.width / 2) - a - (c.x - (c.left ?? 0))}, ${-(c.height / 2) + a - (c.y - (c.top ?? 0))})`
  ), pt(t, W), t.intersect = function(R) {
    return lt.polygon(t, _, R);
  }, l;
}
p(Wy, "multiRect");
async function zy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: n } = await Ct(e, t, bt(t)), a = t.padding ?? 0, l = t.look === "neo" ? 16 : a, c = t.look === "neo" ? 12 : a;
  let h = !0;
  (t.width || t.height) && (h = !1, t.width = (t?.width ?? 0) - l * 2, t.height = (t?.height ?? 0) - c * 3);
  const u = Math.max(o.width, t?.width ?? 0) + l * 2, d = Math.max(o.height, t?.height ?? 0) + c * 3, f = t.look === "neo" ? d / 4 : d / 8, m = d + (h ? f / 2 : -f / 2), y = -u / 2, x = -m / 2, C = 10, { cssStyles: b } = t, w = Jr(
    y - C,
    x + m + C,
    y + u - C,
    x + m + C,
    f,
    0.8
  ), _ = w?.[w.length - 1], v = [
    { x: y - C, y: x + C },
    { x: y - C, y: x + m + C },
    ...w,
    { x: y + u - C, y: _.y - C },
    { x: y + u, y: _.y - C },
    { x: y + u, y: _.y - 2 * C },
    { x: y + u + C, y: _.y - 2 * C },
    { x: y + u + C, y: x - C },
    { x: y + C, y: x - C },
    { x: y + C, y: x },
    { x: y, y: x },
    { x: y, y: x + C }
  ], E = [
    { x: y, y: x + C },
    { x: y + u - C, y: x + C },
    { x: y + u - C, y: _.y - C },
    { x: y + u, y: _.y - C },
    { x: y + u, y: x },
    { x: y, y: x }
  ], A = ft.svg(s), L = ut(t, {});
  t.look !== "handDrawn" && (L.roughness = 0, L.fillStyle = "solid");
  const z = Rt(v), W = A.path(z, L), R = Rt(E), st = A.path(R, L), j = s.insert(() => W, ":first-child");
  return j.insert(() => st), j.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && j.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && j.selectAll("path").attr("style", i), j.attr("transform", `translate(0,${-f / 2})`), n.attr(
    "transform",
    `translate(${-(o.width / 2) - C - (o.x - (o.left ?? 0))}, ${-(o.height / 2) + C - f / 2 - (o.y - (o.top ?? 0))})`
  ), pt(t, j), t.intersect = function(O) {
    return lt.polygon(t, v, O);
  }, s;
}
p(zy, "multiWaveEdgedRectangle");
async function Hy(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.labelStyle = i, t.useHtmlLabels || ye(Kt()) || (t.centerLabel = !0);
  const { shapeSvg: n, bbox: a, label: l } = await Ct(e, t, bt(t)), c = Math.max(a.width + (t.padding ?? 0) * 2, t?.width ?? 0), h = Math.max(a.height + (t.padding ?? 0) * 2, t?.height ?? 0), u = -c / 2, d = -h / 2, { cssStyles: f } = t, m = ft.svg(n), y = ut(t, {
    fill: r.noteBkgColor,
    stroke: r.noteBorderColor
  });
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = m.rectangle(u, d, c, h, y), C = n.insert(() => x, ":first-child");
  return C.attr("class", "basic label-container outer-path"), l.attr("class", "label noteLabel"), f && t.look !== "handDrawn" && C.selectAll("path").attr("style", f), s && t.look !== "handDrawn" && C.selectAll("path").attr("style", s), l.attr(
    "transform",
    `translate(${-a.width / 2 - (a.x - (a.left ?? 0))}, ${-(a.height / 2) - (a.y - (a.top ?? 0))})`
  ), pt(t, C), t.intersect = function(b) {
    return lt.rect(t, b);
  }, n;
}
p(Hy, "note");
var xB = /* @__PURE__ */ p((e, t, r) => [
  `M${e + r / 2},${t}`,
  `L${e + r},${t - r / 2}`,
  `L${e + r / 2},${t - r}`,
  `L${e},${t - r / 2}`,
  "Z"
].join(" "), "createDecisionBoxPathD");
async function Yy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o } = await Ct(e, t, bt(t)), n = o.width + (t.padding ?? 0), a = o.height + (t.padding ?? 0), l = n + a, c = 0.5, h = [
    { x: l / 2, y: 0 },
    { x: l, y: -l / 2 },
    { x: l / 2, y: -l },
    { x: 0, y: -l / 2 }
  ];
  let u;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const f = ft.svg(s), m = ut(t, {}), y = xB(0, 0, l), x = f.path(y, m);
    u = s.insert(() => x, ":first-child").attr("transform", `translate(${-l / 2 + c}, ${l / 2})`), d && u.attr("style", d);
  } else
    u = br(s, l, l, h), u.attr("transform", `translate(${-l / 2 + c}, ${l / 2})`);
  return i && u.attr("style", i), pt(t, u), t.calcIntersect = function(f, m) {
    const y = f.width, x = [
      { x: y / 2, y: 0 },
      { x: y, y: -y / 2 },
      { x: y / 2, y: -y },
      { x: 0, y: -y / 2 }
    ], C = lt.polygon(f, x, m);
    return { x: C.x - 0.5, y: C.y - 0.5 };
  }, t.intersect = function(f) {
    return this.calcIntersect(t, f);
  }, s;
}
p(Yy, "question");
async function Uy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 21 : s ?? 0, n = t.look === "neo" ? 12 : s ?? 0, { shapeSvg: a, bbox: l, label: c } = await Ct(e, t, bt(t)), h = l.width + (t.look === "neo" ? o * 2 : o), u = Math.max(
    l.height + (t.look === "neo" ? n * 2 : n),
    t.height ?? 0
  ), d = u / 4, m = -Math.max(h, (t.width ?? 0) - d) / 2, y = -u / 2, x = y / 2, C = [
    { x: m + x, y },
    { x: m, y: 0 },
    { x: m + x, y: -y },
    { x: -m, y: -y },
    { x: -m, y }
  ], { cssStyles: b } = t, w = ft.svg(a), _ = ut(t, {});
  t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
  const v = Rt(C), E = w.path(v, _), A = a.insert(() => E, ":first-child");
  return A.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && A.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && A.selectAll("path").attr("style", i), A.attr("transform", `translate(${-x / 2},0)`), c.attr(
    "transform",
    `translate(${-x / 2 - l.width / 2 - (l.x - (l.left ?? 0))}, ${-(l.height / 2) - (l.y - (l.top ?? 0))})`
  ), pt(t, A), t.intersect = function(L) {
    return lt.polygon(t, C, L);
  }, a;
}
p(Uy, "rect_left_inv_arrow");
async function jy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  let s;
  t.cssClasses ? s = "node " + t.cssClasses : s = "node default";
  const o = e.insert("g").attr("class", s).attr("id", t.domId || t.id), n = o.insert("g"), a = o.insert("g").attr("class", "label").attr("style", i), l = t.description, c = t.label, h = await Xr(a, c, t.labelStyle, !0, !0);
  let u = { width: 0, height: 0 };
  if (ye(Ot())) {
    const L = h.children[0], z = Et(h);
    u = L.getBoundingClientRect(), z.attr("width", u.width), z.attr("height", u.height);
  }
  q.info("Text 2", l);
  const d = l || [], f = h.getBBox(), m = await Xr(
    a,
    Array.isArray(d) ? d.join("<br/>") : d,
    t.labelStyle,
    !0,
    !0
  ), y = m.children[0], x = Et(m);
  u = y.getBoundingClientRect(), x.attr("width", u.width), x.attr("height", u.height);
  const C = (t.padding || 0) / 2;
  Et(m).attr(
    "transform",
    "translate( " + (u.width > f.width ? 0 : (f.width - u.width) / 2) + ", " + (f.height + C + 5) + ")"
  ), Et(h).attr(
    "transform",
    "translate( " + (u.width < f.width ? 0 : -(f.width - u.width) / 2) + ", 0)"
  ), u = a.node().getBBox(), a.attr(
    "transform",
    "translate(" + -u.width / 2 + ", " + (-u.height / 2 - C + 3) + ")"
  );
  const b = u.width + (t.padding || 0), w = u.height + (t.padding || 0), _ = -u.width / 2 - C, v = -u.height / 2 - C;
  let E, A;
  if (t.look === "handDrawn") {
    const L = ft.svg(o), z = ut(t, {}), W = L.path(
      Xe(_, v, b, w, t.rx || 0),
      z
    ), R = L.line(
      -u.width / 2 - C,
      -u.height / 2 - C + f.height + C,
      u.width / 2 + C,
      -u.height / 2 - C + f.height + C,
      z
    );
    A = o.insert(() => (q.debug("Rough node insert CXC", W), R), ":first-child"), E = o.insert(() => (q.debug("Rough node insert CXC", W), W), ":first-child");
  } else
    E = n.insert("rect", ":first-child"), A = n.insert("line"), E.attr("class", "outer title-state").attr("style", i).attr("x", -u.width / 2 - C).attr("y", -u.height / 2 - C).attr("width", u.width + (t.padding || 0)).attr("height", u.height + (t.padding || 0)), A.attr("class", "divider").attr("x1", -u.width / 2 - C).attr("x2", u.width / 2 + C).attr("y1", -u.height / 2 - C + f.height + C).attr("y2", -u.height / 2 - C + f.height + C);
  return pt(t, E), t.intersect = function(L) {
    return lt.rect(t, L);
  }, o;
}
p(jy, "rectWithTitle");
async function Xy(e, t, { config: { themeVariables: r } }) {
  const i = r?.radius ?? 5, s = {
    rx: i,
    ry: i,
    labelPaddingX: (t?.padding ?? 0) * 1,
    labelPaddingY: (t?.padding ?? 0) * 1
  };
  return bs(e, t, s);
}
p(Xy, "roundedRect");
var ri = 8;
async function Gy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 12 : t.padding ?? 0, { shapeSvg: n, bbox: a, label: l } = await Ct(e, t, bt(t)), c = (t?.width ?? a.width) + s * 2 + (t.look === "neo" ? ri : ri * 2), h = (t?.height ?? a.height) + o * 2, u = c - ri, d = h, f = ri - c / 2, m = -h / 2, { cssStyles: y } = t, x = ft.svg(n), C = ut(t, {});
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const b = [
    { x: f, y: m },
    { x: f + u, y: m },
    { x: f + u, y: m + d },
    { x: f - ri, y: m + d },
    { x: f - ri, y: m },
    { x: f, y: m },
    { x: f, y: m + d }
  ], w = x.polygon(
    b.map((v) => [v.x, v.y]),
    C
  ), _ = n.insert(() => w, ":first-child");
  return _.attr("class", "basic label-container outer-path").attr("style", re(y)), i && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), y && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${ri / 2 - a.width / 2 - (a.x - (a.left ?? 0))}, ${-(a.height / 2) - (a.y - (a.top ?? 0))})`
  ), pt(t, _), t.intersect = function(v) {
    return lt.rect(t, v);
  }, n;
}
p(Gy, "shadedProcess");
async function Vy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 12 : s;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - o * 2, 10), t.height = Math.max((t?.height ?? 0) / 1.5 - n * 2, 10));
  const { shapeSvg: a, bbox: l, label: c } = await Ct(e, t, bt(t)), h = (t?.width ? t?.width : l.width) + o * 2, u = ((t?.height ? t?.height : l.height) + n * 2) * 1.5, d = h, f = u / 1.5, m = -d / 2, y = -f / 2, { cssStyles: x } = t, C = ft.svg(a), b = ut(t, {});
  t.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
  const w = [
    { x: m, y },
    { x: m, y: y + f },
    { x: m + d, y: y + f },
    { x: m + d, y: y - f / 2 }
  ], _ = Rt(w), v = C.path(_, b), E = a.insert(() => v, ":first-child");
  return E.attr("class", "basic label-container  outer-path"), x && t.look !== "handDrawn" && E.selectChildren("path").attr("style", x), i && t.look !== "handDrawn" && E.selectChildren("path").attr("style", i), E.attr("transform", `translate(0, ${f / 4})`), c.attr(
    "transform",
    `translate(${-d / 2 + (t.padding ?? 0) - (l.x - (l.left ?? 0))}, ${-f / 4 + (t.padding ?? 0) - (l.y - (l.top ?? 0))})`
  ), pt(t, E), t.intersect = function(A) {
    return lt.polygon(t, w, A);
  }, a;
}
p(Vy, "slopedRect");
async function Ky(e, t) {
  const r = t.padding ?? 0, i = t.look === "neo" ? 16 : r * 2, s = t.look === "neo" ? 12 : r, o = {
    rx: 0,
    ry: 0,
    labelPaddingX: t.labelPaddingX ?? i,
    labelPaddingY: s
  };
  return bs(e, t, o);
}
p(Ky, "squareRect");
async function Zy(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 20 : s, n = t.look === "neo" ? 12 : s, { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = l.height + (t.look === "neo" ? n * 2 : n), h = l.width + c / 4 + (t.look === "neo" ? o * 2 : o), u = c / 2, { cssStyles: d } = t, f = ft.svg(a), m = ut(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const y = [
    { x: -h / 2 + u, y: -c / 2 },
    { x: h / 2 - u, y: -c / 2 },
    ...dr(-h / 2 + u, 0, u, 50, 90, 270),
    { x: h / 2 - u, y: c / 2 },
    ...dr(h / 2 - u, 0, u, 50, 270, 450)
  ], x = Rt(y), C = f.path(x, m), b = a.insert(() => C, ":first-child");
  return b.attr("class", "basic label-container outer-path"), d && t.look !== "handDrawn" && b.selectChildren("path").attr("style", d), i && t.look !== "handDrawn" && b.selectChildren("path").attr("style", i), pt(t, b), t.intersect = function(w) {
    return lt.polygon(t, y, w);
  }, a;
}
p(Zy, "stadium");
async function Qy(e, t) {
  const r = {
    rx: t.look === "neo" ? 3 : 5,
    ry: t.look === "neo" ? 3 : 5
  };
  return bs(e, t, r);
}
p(Qy, "state");
function Jy(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.labelStyle = i;
  const { cssStyles: o } = t, { lineColor: n, stateBorder: a, nodeBorder: l, nodeShadow: c } = r;
  (t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width || (t.width = 14), t.height || (t.height = 14);
  const h = e.insert("g").attr("class", "node default").attr("id", t.domId ?? t.id), u = ft.svg(h), d = ut(t, {});
  t.look !== "handDrawn" && (d.roughness = 0, d.fillStyle = "solid");
  const f = u.circle(0, 0, t.width, {
    ...d,
    stroke: n,
    strokeWidth: 2
  }), m = a ?? l, y = (t.width ?? 0) * 5 / 14, x = u.circle(0, 0, y, {
    ...d,
    fill: m,
    stroke: m,
    strokeWidth: 2,
    fillStyle: "solid"
  }), C = h.insert(() => f, ":first-child");
  if (C.insert(() => x), t.look !== "handDrawn" && C.attr("class", "outer-path"), o && C.selectAll("path").attr("style", o), s && C.selectAll("path").attr("style", s), t.width < 25 && c && t.look !== "handDrawn") {
    const b = e.node()?.ownerSVGElement?.id ?? "", w = b ? `${b}-drop-shadow-small` : "drop-shadow-small";
    C.attr("style", `filter:url(#${w})`);
  }
  return pt(t, C), t.intersect = function(b) {
    return lt.circle(t, (t.width ?? 0) / 2, b);
  }, h;
}
p(Jy, "stateEnd");
function t0(e, t, { config: { themeVariables: r } }) {
  const { lineColor: i, nodeShadow: s } = r;
  (t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width || (t.width = 14), t.height || (t.height = 14);
  const o = e.insert("g").attr("class", "node default").attr("id", t.domId || t.id);
  let n;
  if (t.look === "handDrawn") {
    const l = ft.svg(o).circle(0, 0, t.width, xT(i));
    n = o.insert(() => l), n.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
  } else
    n = o.insert("circle", ":first-child"), n.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
  if (t.width < 25 && s && t.look !== "handDrawn") {
    const a = e.node()?.ownerSVGElement?.id ?? "", l = a ? `${a}-drop-shadow-small` : "drop-shadow-small";
    n.attr("style", `filter:url(#${l})`);
  }
  return pt(t, n), t.intersect = function(a) {
    return lt.circle(t, (t.width ?? 7) / 2, a);
  }, o;
}
p(t0, "stateStart");
var Pi = 8;
async function e0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t?.padding ?? 8, o = t.look === "neo" ? 28 : s, n = t.look === "neo" ? 12 : s, { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = Math.max(l.width + 2 * Pi + o, t.width ?? 0), h = Math.max(l.height + n, t.height ?? 0), u = c - 2 * Pi, d = h, f = -c / 2, m = -h / 2, y = [
    { x: 0, y: 0 },
    { x: u, y: 0 },
    { x: u, y: -d },
    { x: 0, y: -d },
    { x: 0, y: 0 },
    { x: -8, y: 0 },
    { x: u + 8, y: 0 },
    { x: u + 8, y: -d },
    { x: -8, y: -d },
    { x: -8, y: 0 }
  ];
  if (t.look === "handDrawn") {
    const x = ft.svg(a), C = ut(t, {}), b = x.rectangle(f, m, u + 16, d, C), w = x.line(f + Pi, m, f + Pi, m + d, C), _ = x.line(f + Pi + u, m, f + Pi + u, m + d, C);
    a.insert(() => w, ":first-child"), a.insert(() => _, ":first-child");
    const v = a.insert(() => b, ":first-child"), { cssStyles: E } = t;
    v.attr("class", "basic label-container").attr("style", re(E)), pt(t, v);
  } else {
    const x = br(a, u, d, y);
    i && x.attr("style", i), pt(t, x);
  }
  return t.intersect = function(x) {
    return lt.polygon(t, y, x);
  }, a;
}
p(e0, "subroutine");
var ja = 0.2;
async function r0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 12 : s;
  (t.width || t.height) && (t.height = Math.max((t?.height ?? 0) - n * 2, 10), t.width = Math.max(
    (t?.width ?? 0) - o * 2 - ja * (t.height + n * 2),
    10
  ));
  const { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = (t?.height ? t?.height : l.height) + n * 2, h = ja * c, u = ja * c, f = (t?.width ? t?.width : l.width) + o * 2 + h - h, m = c, y = -f / 2, x = -m / 2, { cssStyles: C } = t, b = ft.svg(a), w = ut(t, {}), _ = [
    { x: y - h / 2, y: x },
    { x: y + f + h / 2, y: x },
    { x: y + f + h / 2, y: x + m },
    { x: y - h / 2, y: x + m }
  ], v = [
    { x: y + f - h / 2, y: x + m },
    { x: y + f + h / 2, y: x + m },
    { x: y + f + h / 2, y: x + m - u }
  ];
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const E = Rt(_), A = b.path(E, w), L = Rt(v), z = b.path(L, { ...w, fillStyle: "solid" }), W = a.insert(() => z, ":first-child");
  return W.insert(() => A, ":first-child"), W.attr("class", "basic label-container outer-path"), C && t.look !== "handDrawn" && W.selectAll("path").attr("style", C), i && t.look !== "handDrawn" && W.selectAll("path").attr("style", i), pt(t, W), t.intersect = function(R) {
    return lt.polygon(t, _, R);
  }, a;
}
p(r0, "taggedRect");
async function i0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: n } = await Ct(e, t, bt(t)), a = Math.max(o.width + (t.padding ?? 0) * 2, t?.width ?? 0), l = Math.max(o.height + (t.padding ?? 0) * 2, t?.height ?? 0), c = l / 8, h = 0.2 * a, u = 0.2 * l, d = l + c, { cssStyles: f } = t, m = ft.svg(s), y = ut(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -a / 2 - a / 2 * 0.1, y: d / 2 },
    ...Jr(
      -a / 2 - a / 2 * 0.1,
      d / 2,
      a / 2 + a / 2 * 0.1,
      d / 2,
      c,
      0.8
    ),
    { x: a / 2 + a / 2 * 0.1, y: -d / 2 },
    { x: -a / 2 - a / 2 * 0.1, y: -d / 2 }
  ], C = -a / 2 + a / 2 * 0.1, b = -d / 2 - u * 0.4, w = [
    { x: C + a - h, y: (b + l) * 1.3 },
    { x: C + a, y: b + l - u },
    { x: C + a, y: (b + l) * 0.9 },
    ...Jr(
      C + a,
      (b + l) * 1.25,
      C + a - h,
      (b + l) * 1.3,
      -l * 0.02,
      0.5
    )
  ], _ = Rt(x), v = m.path(_, y), E = Rt(w), A = m.path(E, {
    ...y,
    fillStyle: "solid"
  }), L = s.insert(() => A, ":first-child");
  return L.insert(() => v, ":first-child"), L.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && L.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(0,${-c / 2})`), n.attr(
    "transform",
    `translate(${-a / 2 + (t.padding ?? 0) - (o.x - (o.left ?? 0))},${-l / 2 + (t.padding ?? 0) - c / 2 - (o.y - (o.top ?? 0))})`
  ), pt(t, L), t.intersect = function(z) {
    return lt.polygon(t, x, z);
  }, s;
}
p(i0, "taggedWaveEdgedRectangle");
async function s0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o } = await Ct(e, t, bt(t)), n = Math.max(o.width + (t.padding ?? 0), t?.width || 0), a = Math.max(o.height + (t.padding ?? 0), t?.height || 0), l = -n / 2, c = -a / 2, h = s.insert("rect", ":first-child");
  return h.attr("class", "text").attr("style", i).attr("rx", 0).attr("ry", 0).attr("x", l).attr("y", c).attr("width", n).attr("height", a), pt(t, h), t.intersect = function(u) {
    return lt.rect(t, u);
  }, s;
}
p(s0, "text");
var CB = /* @__PURE__ */ p((e, t, r, i, s, o) => `M${e},${t}
    a${s},${o} 0,0,1 0,${-i}
    l${r},0
    a${s},${o} 0,0,1 0,${i}
    M${r},${-i}
    a${s},${o} 0,0,0 0,${i}
    l${-r},0`, "createCylinderPathD"), bB = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t}`,
  `M${e + r},${t}`,
  `a${s},${o} 0,0,0 0,${-i}`,
  `l${-r},0`,
  `a${s},${o} 0,0,0 0,${i}`,
  `l${r},0`
].join(" "), "createOuterCylinderPathD"), kB = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e + r / 2},${-i / 2}`, `a${s},${o} 0,0,0 0,${i}`].join(" "), "createInnerCylinderPathD"), jd = 5, Xd = 10;
async function o0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 12 : s / 2, n = t.height ?? 0;
  if (t.height && (t.height = t.height - o, t.height < jd && (t.height = jd)), t.width) {
    const C = n / 2 / (2.5 + n / 50);
    t.width = t.width - o - C * 3, t.width < Xd && (t.width = Xd);
  }
  const { shapeSvg: a, bbox: l, label: c } = await Ct(e, t, bt(t)), h = Math.max(t.height ?? 0, l.height) + o, u = h / 2, d = u / (2.5 + h / 50), f = Math.max(t.width ?? 0, l.width) + d + o, { cssStyles: m } = t;
  let y;
  if (t.look === "handDrawn") {
    const x = ft.svg(a), C = bB(0, 0, f, h, d, u), b = kB(0, 0, f, h, d, u), w = x.path(C, ut(t, {})), _ = x.path(b, ut(t, { fill: "none" }));
    y = a.insert(() => _, ":first-child"), y = a.insert(() => w, ":first-child"), y.attr("class", "basic label-container"), m && y.attr("style", m);
  } else {
    const x = CB(0, 0, f, h, d, u);
    y = a.insert("path", ":first-child").attr("d", x).attr("class", "basic label-container").attr("style", re(m)).attr("style", i), y.attr("class", "basic label-container outer-path"), m && y.selectAll("path").attr("style", m), i && y.selectAll("path").attr("style", i);
  }
  return y.attr("label-offset-x", d), y.attr("transform", `translate(${-f / 2}, ${h / 2} )`), c.attr(
    "transform",
    `translate(${-(l.width / 2) - d - (l.x - (l.left ?? 0))}, ${-(l.height / 2) - (l.y - (l.top ?? 0))})`
  ), pt(t, y), t.intersect = function(x) {
    const C = lt.rect(t, x), b = C.y - (t.y ?? 0);
    if (u != 0 && (Math.abs(b) < (t.height ?? 0) / 2 || Math.abs(b) == (t.height ?? 0) / 2 && Math.abs(C.x - (t.x ?? 0)) > (t.width ?? 0) / 2 - d)) {
      let w = d * d * (1 - b * b / (u * u));
      w != 0 && (w = Math.sqrt(Math.abs(w))), w = d - w, x.x - (t.x ?? 0) > 0 && (w = -w), C.x += w;
    }
    return C;
  }, a;
}
p(o0, "tiltedCylinder");
async function n0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = (t.look === "neo", s), n = t.look === "neo" ? s * 2 : s, { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + n, (t.width ?? 0) - c), u = [
    { x: -3 * c / 6, y: 0 },
    { x: h + 3 * c / 6, y: 0 },
    { x: h, y: -c },
    { x: 0, y: -c }
  ];
  let d;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = ft.svg(a), y = ut(t, {}), x = Rt(u), C = m.path(x, y);
    d = a.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && d.attr("style", f);
  } else
    d = br(a, h, c, u);
  return i && d.attr("style", i), t.width = h, t.height = c, pt(t, d), t.intersect = function(m) {
    return lt.polygon(t, u, m);
  }, a;
}
p(n0, "trapezoid");
async function a0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 12 : s, a = 15, l = 5;
  (t.width || t.height) && (t.height = (t.height ?? 0) - n * 2, t.height < l && (t.height = l), t.width = (t.width ?? 0) - o * 2, t.width < a && (t.width = a));
  const { shapeSvg: c, bbox: h } = await Ct(e, t, bt(t)), u = (t?.width ? t?.width : h.width) + o * 2, d = (t?.height ? t?.height : h.height) + n * 2, { cssStyles: f } = t, m = ft.svg(c), y = ut(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -u / 2 * 0.8, y: -d / 2 },
    { x: u / 2 * 0.8, y: -d / 2 },
    { x: u / 2, y: -d / 2 * 0.6 },
    { x: u / 2, y: d / 2 },
    { x: -u / 2, y: d / 2 },
    { x: -u / 2, y: -d / 2 * 0.6 }
  ], C = Rt(x), b = m.path(C, y), w = c.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && w.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), pt(t, w), t.intersect = function(_) {
    return lt.polygon(t, x, _);
  }, c;
}
p(a0, "trapezoidalPentagon");
var Gd = 10, Vd = 10;
async function l0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? s * 2 : s;
  (t.width || t.height) && (t.width = ((t?.width ?? 0) - o) / 2, t.width < Vd && (t.width = Vd), t.height = t?.height ?? 0, t.height < Gd && (t.height = Gd));
  const { shapeSvg: n, bbox: a, label: l } = await Ct(e, t, bt(t)), c = xr(Ot().flowchart?.htmlLabels), h = (t?.width ? t?.width : a.width) + o, u = t?.height ? t?.height : h + a.height, d = u, f = [
    { x: 0, y: 0 },
    { x: d, y: 0 },
    { x: d / 2, y: -u }
  ], { cssStyles: m } = t, y = ft.svg(n), x = ut(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = Rt(f), b = y.path(C, x), w = n.insert(() => b, ":first-child").attr("transform", `translate(${-u / 2}, ${u / 2})`).attr("class", "outer-path");
  return m && t.look !== "handDrawn" && w.selectChildren("path").attr("style", m), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), t.width = h, t.height = u, pt(t, w), l.attr(
    "transform",
    `translate(${-a.width / 2 - (a.x - (a.left ?? 0))}, ${u / 2 - (a.height + (t.padding ?? 0) / (c ? 2 : 1) - (a.y - (a.top ?? 0)))})`
  ), t.intersect = function(_) {
    return q.info("Triangle intersect", t, f, _), lt.polygon(t, f, _);
  }, n;
}
p(l0, "triangle");
async function h0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 12 : s;
  let a = !0;
  (t.width || t.height) && (a = !1, t.width = (t?.width ?? 0) - o * 2, t.width < 10 && (t.width = 10), t.height = (t?.height ?? 0) - n * 2, t.height < 10 && (t.height = 10));
  const { shapeSvg: l, bbox: c, label: h } = await Ct(e, t, bt(t)), u = (t?.width ? t?.width : c.width) + (o ?? 0) * 2, d = (t?.height ? t?.height : c.height) + (n ?? 0) * 2, f = t.look === "neo" ? d / 4 : d / 8, m = d + (a ? f : -f), { cssStyles: y } = t, C = 14 - u, b = C > 0 ? C / 2 : 0, w = ft.svg(l), _ = ut(t, {});
  t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
  const v = [
    { x: -u / 2 - b, y: m / 2 },
    ...Jr(
      -u / 2 - b,
      m / 2,
      u / 2 + b,
      m / 2,
      f,
      0.8
    ),
    { x: u / 2 + b, y: -m / 2 },
    { x: -u / 2 - b, y: -m / 2 }
  ], E = Rt(v), A = w.path(E, _), L = l.insert(() => A, ":first-child");
  return L.attr("class", "basic label-container outer-path"), y && t.look !== "handDrawn" && L.selectAll("path").attr("style", y), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(0,${-f / 2})`), h.attr(
    "transform",
    `translate(${-u / 2 + (t.padding ?? 0) - (c.x - (c.left ?? 0))},${-d / 2 + (t.padding ?? 0) - f - (c.y - (c.top ?? 0))})`
  ), pt(t, L), t.intersect = function(z) {
    return lt.polygon(t, v, z);
  }, l;
}
p(h0, "waveEdgedRectangle");
async function c0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, n = t.look === "neo" ? 20 : s;
  if (t.width || t.height) {
    t.width = t?.width ?? 0, t.width < 20 && (t.width = 20), t.height = t?.height ?? 0, t.height < 10 && (t.height = 10);
    const _ = Math.min(t.height * 0.2, t.height / 4);
    t.height = Math.ceil(t.height - n - _ * (20 / 9)), t.width = t.width - o * 2;
  }
  const { shapeSvg: a, bbox: l } = await Ct(e, t, bt(t)), c = (t?.width ? t?.width : l.width) + o * 2, h = (t?.height ? t?.height : l.height) + n, u = h / 8, d = h + u * 2, { cssStyles: f } = t, m = ft.svg(a), y = ut(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -c / 2, y: d / 2 },
    ...Jr(-c / 2, d / 2, c / 2, d / 2, u, 1),
    { x: c / 2, y: -d / 2 },
    ...Jr(c / 2, -d / 2, -c / 2, -d / 2, u, -1)
  ], C = Rt(x), b = m.path(C, y), w = a.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container"), f && t.look !== "handDrawn" && w.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), pt(t, w), t.intersect = function(_) {
    return lt.polygon(t, x, _);
  }, a;
}
p(c0, "waveRectangle");
var Qt = 10;
async function u0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 12 : t.padding ?? 0;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - s * 2 - Qt, 10), t.height = Math.max((t?.height ?? 0) - o * 2 - Qt, 10));
  const { shapeSvg: n, bbox: a, label: l } = await Ct(e, t, bt(t)), c = (t?.width ? t?.width : a.width) + s * 2 + Qt, h = (t?.height ? t?.height : a.height) + o * 2 + Qt, u = c - Qt, d = h - Qt, f = -u / 2, m = -d / 2, { cssStyles: y } = t, x = ft.svg(n), C = ut(t, {}), b = [
    { x: f - Qt, y: m - Qt },
    { x: f - Qt, y: m + d },
    { x: f + u, y: m + d },
    { x: f + u, y: m - Qt }
  ], w = `M${f - Qt},${m - Qt} L${f + u},${m - Qt} L${f + u},${m + d} L${f - Qt},${m + d} L${f - Qt},${m - Qt}
                M${f - Qt},${m} L${f + u},${m}
                M${f},${m - Qt} L${f},${m + d}`;
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const _ = x.path(w, C), v = n.insert(() => _, ":first-child");
  return v.attr("transform", `translate(${Qt / 2}, ${Qt / 2})`), v.attr("class", "basic label-container outer-path"), y && t.look !== "handDrawn" && v.selectAll("path").attr("style", y), i && t.look !== "handDrawn" && v.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${-(a.width / 2) + Qt / 2 - (a.x - (a.left ?? 0))}, ${-(a.height / 2) + Qt / 2 - (a.y - (a.top ?? 0))})`
  ), pt(t, v), t.intersect = function(E) {
    return lt.polygon(t, b, E);
  }, n;
}
p(u0, "windowPane");
var Kd = /* @__PURE__ */ new Set(["redux-color", "redux-dark-color"]), wB = /* @__PURE__ */ new Set(["redux", "redux-dark", "redux-color", "redux-dark-color"]);
async function mc(e, t) {
  const r = t;
  r.alias && (t.label = r.alias);
  const { theme: i, themeVariables: s } = Kt(), { rowEven: o, rowOdd: n, nodeBorder: a, borderColorArray: l } = s;
  if (t.look === "handDrawn") {
    const { themeVariables: mt } = Kt(), { background: _t } = mt, Mt = {
      ...t,
      id: t.id + "-background",
      domId: (t.domId || t.id) + "-background",
      look: "default",
      cssStyles: ["stroke: none", `fill: ${_t}`]
    };
    await mc(e, Mt);
  }
  const c = Kt();
  t.useHtmlLabels = c.htmlLabels;
  let h = c.er?.diagramPadding ?? 10, u = c.er?.entityPadding ?? 6;
  const { cssStyles: d } = t, { labelStyles: f, nodeStyles: m } = gt(t);
  if (r.attributes.length === 0 && t.label) {
    const mt = {
      rx: 0,
      ry: 0,
      labelPaddingX: h,
      labelPaddingY: h * 1.5
    };
    Mr(t.label, c) + mt.labelPaddingX * 2 < c.er.minEntityWidth && (t.width = c.er.minEntityWidth);
    const _t = await bs(e, t, mt);
    if (i != null && Kd.has(i)) {
      const Mt = r.colorIndex ?? 0;
      _t.attr("data-color-id", `color-${Mt % l.length}`);
    }
    if (!xr(c.htmlLabels)) {
      const Mt = _t.select("text"), Lt = Mt.node()?.getBBox();
      Mt.attr("transform", `translate(${-Lt.width / 2}, 0)`);
    }
    return _t;
  }
  c.htmlLabels || (h *= 1.25, u *= 1.25);
  let y = bt(t);
  y || (y = "node default");
  const x = e.insert("g").attr("class", y).attr("id", t.domId || t.id), C = await Ni(x, t.label ?? "", c, 0, 0, ["name"], f);
  C.height += u;
  let b = 0;
  const w = [], _ = [];
  let v = 0, E = 0, A = 0, L = 0, z = !0, W = !0;
  for (const mt of r.attributes) {
    const _t = await Ni(
      x,
      mt.type,
      c,
      0,
      b,
      ["attribute-type"],
      f
    );
    v = Math.max(v, _t.width + h);
    const Mt = await Ni(
      x,
      mt.name,
      c,
      0,
      b,
      ["attribute-name"],
      f
    );
    E = Math.max(E, Mt.width + h);
    const Lt = await Ni(
      x,
      mt.keys.join(),
      c,
      0,
      b,
      ["attribute-keys"],
      f
    );
    A = Math.max(A, Lt.width + h);
    const qt = await Ni(
      x,
      mt.comment,
      c,
      0,
      b,
      ["attribute-comment"],
      f
    );
    L = Math.max(L, qt.width + h);
    const zt = Math.max(_t.height, Mt.height, Lt.height, qt.height) + u;
    _.push({ yOffset: b, rowHeight: zt }), b += zt;
  }
  let R = 4;
  A <= h && (z = !1, A = 0, R--), L <= h && (W = !1, L = 0, R--);
  const st = x.node().getBBox();
  if (C.width + h * 2 - (v + E + A + L) > 0) {
    const mt = C.width + h * 2 - (v + E + A + L);
    v += mt / R, E += mt / R, A > 0 && (A += mt / R), L > 0 && (L += mt / R);
  }
  const j = v + E + A + L, O = ft.svg(x), I = ut(t, {});
  t.look !== "handDrawn" && (I.roughness = 0, I.fillStyle = "solid");
  let B = 0;
  _.length > 0 && (B = _.reduce((mt, _t) => mt + (_t?.rowHeight ?? 0), 0));
  const M = Math.max(st.width + h * 2, t?.width || 0, j), F = Math.max((B ?? 0) + C.height, t?.height || 0), Q = -M / 2, Z = -F / 2;
  if (x.selectAll("g:not(:first-child)").each((mt, _t, Mt) => {
    const Lt = Et(Mt[_t]), qt = Lt.attr("transform");
    let zt = 0, le = 0;
    if (qt) {
      const Dt = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(qt);
      Dt && (zt = parseFloat(Dt[1]), le = parseFloat(Dt[2]), Lt.attr("class").includes("attribute-name") ? zt += v : Lt.attr("class").includes("attribute-keys") ? zt += v + E : Lt.attr("class").includes("attribute-comment") && (zt += v + E + A));
    }
    Lt.attr(
      "transform",
      `translate(${Q + h / 2 + zt}, ${le + Z + C.height + u / 2})`
    );
  }), x.select(".name").attr("transform", "translate(" + -C.width / 2 + ", " + (Z + u / 2) + ")"), i != null && Kd.has(i)) {
    const mt = r.colorIndex ?? 0;
    x.attr("data-color-id", `color-${mt % l.length}`);
  }
  const dt = O.rectangle(Q, Z, M, F, I), wt = x.insert(() => dt, ":first-child").attr("class", "outer-path").attr("style", d.join(""));
  w.push(0);
  for (const [mt, _t] of _.entries()) {
    const Lt = (mt + 1) % 2 === 0 && _t.yOffset !== 0, qt = O.rectangle(Q, C.height + Z + _t?.yOffset, M, _t?.rowHeight, {
      ...I,
      fill: Lt ? o : n,
      stroke: a
    });
    x.insert(() => qt, "g.label").attr("style", d.join("")).attr("class", `row-rect-${Lt ? "even" : "odd"}`);
  }
  const yt = 1e-4;
  let at = qi(Q, C.height + Z, M + Q, C.height + Z, yt), kt = O.polygon(
    at.map((mt) => [mt.x, mt.y]),
    I
  );
  if (x.insert(() => kt).attr("class", "divider"), at = qi(v + Q, C.height + Z, v + Q, F + Z, yt), kt = O.polygon(
    at.map((mt) => [mt.x, mt.y]),
    I
  ), x.insert(() => kt).attr("class", "divider"), z) {
    const mt = v + E + Q;
    at = qi(mt, C.height + Z, mt, F + Z, yt), kt = O.polygon(
      at.map((_t) => [_t.x, _t.y]),
      I
    ), x.insert(() => kt).attr("class", "divider");
  }
  if (W) {
    const mt = v + E + A + Q;
    at = qi(mt, C.height + Z, mt, F + Z, yt), kt = O.polygon(
      at.map((_t) => [_t.x, _t.y]),
      I
    ), x.insert(() => kt).attr("class", "divider");
  }
  for (const mt of w) {
    const _t = C.height + Z + mt;
    at = qi(Q, _t, M + Q, _t, yt), kt = O.polygon(
      at.map((Mt) => [Mt.x, Mt.y]),
      I
    ), x.insert(() => kt).attr("class", "divider");
  }
  if (pt(t, wt), m && t.look !== "handDrawn")
    if (i != null && wB.has(i))
      x.selectAll("path").attr("style", m);
    else {
      const _t = m.split(";")?.filter((Mt) => Mt.includes("stroke"))?.map((Mt) => `${Mt}`).join("; ");
      x.selectAll("path").attr("style", _t ?? ""), x.selectAll(".row-rect-even path").attr("style", m);
    }
  return t.intersect = function(mt) {
    return lt.rect(t, mt);
  }, x;
}
p(mc, "erBox");
async function Ni(e, t, r, i = 0, s = 0, o = [], n = "") {
  const a = e.insert("g").attr("class", `label ${o.join(" ")}`).attr("transform", `translate(${i}, ${s})`).attr("style", n);
  t !== Du(t) && (t = Du(t), t = t.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
  const l = a.node().appendChild(
    await rr(
      a,
      t,
      {
        width: Mr(t, r) + 100,
        style: n,
        useHtmlLabels: r.htmlLabels
      },
      r
    )
  );
  if (t.includes("&lt;") || t.includes("&gt;")) {
    let h = l.children[0];
    for (h.textContent = h.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">"); h.childNodes[0]; )
      h = h.childNodes[0], h.textContent = h.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
  }
  let c = l.getBBox();
  if (xr(r.htmlLabels)) {
    const h = l.children[0];
    h.style.textAlign = "start";
    const u = Et(l);
    c = h.getBoundingClientRect(), u.attr("width", c.width), u.attr("height", c.height);
  }
  return c;
}
p(Ni, "addText");
function qi(e, t, r, i, s) {
  return e === r ? [
    { x: e - s / 2, y: t },
    { x: e + s / 2, y: t },
    { x: r + s / 2, y: i },
    { x: r - s / 2, y: i }
  ] : [
    { x: e, y: t - s / 2 },
    { x: e, y: t + s / 2 },
    { x: r, y: i + s / 2 },
    { x: r, y: i - s / 2 }
  ];
}
p(qi, "lineToPolygon");
async function d0(e, t, r, i, s = r.class.padding ?? 12) {
  const o = i ? 0 : 3, n = e.insert("g").attr("class", bt(t)).attr("id", t.domId || t.id);
  let a = null, l = null, c = null, h = null, u = 0, d = 0, f = 0;
  if (a = n.insert("g").attr("class", "annotation-group text"), t.annotations.length > 0) {
    const b = t.annotations[0];
    await Xs(a, { text: `«${b}»` }, 0), u = a.node().getBBox().height;
  }
  l = n.insert("g").attr("class", "label-group text"), await Xs(l, t, 0, ["font-weight: bolder"]);
  const m = l.node().getBBox();
  d = m.height, c = n.insert("g").attr("class", "members-group text");
  let y = 0;
  for (const b of t.members) {
    const w = await Xs(c, b, y, [b.parseClassifier()]);
    y += w + o;
  }
  f = c.node().getBBox().height, f <= 0 && (f = s / 2), h = n.insert("g").attr("class", "methods-group text");
  let x = 0;
  for (const b of t.methods) {
    const w = await Xs(h, b, x, [b.parseClassifier()]);
    x += w + o;
  }
  let C = n.node().getBBox();
  if (a !== null) {
    const b = a.node().getBBox();
    a.attr("transform", `translate(${-b.width / 2})`);
  }
  return l.attr("transform", `translate(${-m.width / 2}, ${u})`), C = n.node().getBBox(), c.attr(
    "transform",
    `translate(0, ${u + d + s * 2})`
  ), C = n.node().getBBox(), h.attr(
    "transform",
    `translate(0, ${u + d + (f ? f + s * 4 : s * 2)})`
  ), C = n.node().getBBox(), { shapeSvg: n, bbox: C };
}
p(d0, "textHelper");
async function Xs(e, t, r, i = []) {
  const s = e.insert("g").attr("class", "label").attr("style", i.join("; ")), o = Kt();
  let n = "useHtmlLabels" in t ? t.useHtmlLabels : xr(o.htmlLabels) ?? !0, a = "";
  "text" in t ? a = t.text : a = t.label, !n && a.startsWith("\\") && (a = a.substring(1)), ao(a) && (n = !0);
  const l = await rr(
    s,
    Fh(Zr(a)),
    {
      width: Mr(a, o) + 50,
      // Add room for error when splitting text into multiple lines
      classes: "markdown-node-label",
      useHtmlLabels: n
    },
    o
  );
  let c, h = 1;
  if (n) {
    const u = l.children[0], d = Et(l);
    h = u.innerHTML.split("<br>").length, u.innerHTML.includes("</math>") && (h += u.innerHTML.split("<mrow>").length - 1), await dc(u), c = u.getBoundingClientRect(), d.attr("width", c.width), d.attr("height", c.height);
  } else {
    i.includes("font-weight: bolder") && Et(l).selectAll("tspan").attr("font-weight", ""), h = l.children.length;
    const u = l.children[0];
    (l.textContent === "" || l.textContent.includes("&gt")) && (u.textContent = a[0] + a.substring(1).replaceAll("&gt;", ">").replaceAll("&lt;", "<").trim(), a[1] === " " && (u.textContent = u.textContent[0] + " " + u.textContent.substring(1))), u.textContent === "undefined" && (u.textContent = ""), c = l.getBBox();
  }
  return s.attr("transform", "translate(0," + (-c.height / (2 * h) + r) + ")"), c.height;
}
p(Xs, "addText");
async function f0(e, t) {
  const r = Ot(), { themeVariables: i } = r, { useGradient: s } = i, o = r.class.padding ?? 12, n = o, a = t.useHtmlLabels ?? xr(r.htmlLabels) ?? !0, l = t;
  l.annotations = l.annotations ?? [], l.members = l.members ?? [], l.methods = l.methods ?? [];
  const { shapeSvg: c, bbox: h } = await d0(e, t, r, a, n), { labelStyles: u, nodeStyles: d } = gt(t);
  t.labelStyle = u, t.cssStyles = l.styles || "";
  const f = l.styles?.join(";") || d || "";
  t.cssStyles || (t.cssStyles = f.replaceAll("!important", "").split(";"));
  const m = l.members.length === 0 && l.methods.length === 0 && !r.class?.hideEmptyMembersBox, y = ft.svg(c), x = ut(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = Math.max(t.width ?? 0, h.width);
  let b = Math.max(t.height ?? 0, h.height);
  const w = (t.height ?? 0) > h.height;
  l.members.length === 0 && l.methods.length === 0 ? b += n : l.members.length > 0 && l.methods.length === 0 && (b += n * 2);
  const _ = -C / 2, v = -b / 2;
  let E = m ? o * 2 : l.members.length === 0 && l.methods.length === 0 ? -o : 0;
  w && (E = o * 2);
  const A = y.rectangle(
    _ - o,
    v - o - (m ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0),
    C + 2 * o,
    b + 2 * o + E,
    x
  ), L = c.insert(() => A, ":first-child");
  L.attr("class", "basic label-container outer-path");
  const z = L.node().getBBox(), W = c.select(".annotation-group").node().getBBox().height - (m ? o / 2 : 0) || 0, R = c.select(".label-group").node().getBBox().height - (m ? o / 2 : 0) || 0, st = c.select(".members-group").node().getBBox().height - (m ? o / 2 : 0) || 0, j = (W + R + v + o - (v - o - (m ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0))) / 2;
  if (c.selectAll(".text").each((O, I, B) => {
    const M = Et(B[I]), F = M.attr("transform");
    let Q = 0;
    if (F) {
      const yt = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(F);
      yt && (Q = parseFloat(yt[2]));
    }
    let Z = Q + v + o - (m ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0);
    if (M.attr("class").includes("methods-group")) {
      const wt = Math.max(st, n / 2);
      w ? Z = Math.max(
        j,
        W + R + wt + v + n * 2 + o
      ) + n * 2 : Z = W + R + wt + v + n * 4 + o;
    }
    l.members.length === 0 && l.methods.length === 0 && r.class?.hideEmptyMembersBox && (l.annotations.length > 0 ? Z = Q - n : Z = Q), a || (Z -= 4);
    let dt = _;
    (M.attr("class").includes("label-group") || M.attr("class").includes("annotation-group")) && (dt = -M.node()?.getBBox().width / 2 || 0, c.selectAll("text").each(function(wt, yt, at) {
      window.getComputedStyle(at[yt]).textAnchor === "middle" && (dt = 0);
    })), M.attr("transform", `translate(${dt}, ${Z})`);
  }), l.members.length > 0 || l.methods.length > 0 || m) {
    const O = W + R + v + o, I = y.line(
      z.x,
      O,
      z.x + z.width,
      O + 1e-3,
      x
    );
    c.insert(() => I).attr("class", `divider${t.look === "neo" && !s ? " neo-line" : ""}`).attr("style", f);
  }
  if (m || l.members.length > 0 || l.methods.length > 0) {
    const O = W + R + st + v + n * 2 + o, I = y.line(
      z.x,
      w ? Math.max(j, O) : O,
      z.x + z.width,
      (w ? Math.max(j, O) : O) + 1e-3,
      x
    );
    c.insert(() => I).attr("class", `divider${t.look === "neo" && !s ? " neo-line" : ""}`).attr("style", f);
  }
  if (l.look !== "handDrawn" && c.selectAll("path").attr("style", f), L.select(":nth-child(2)").attr("style", f), c.selectAll(".divider").select("path").attr("style", f), t.labelStyle ? c.selectAll("span").attr("style", t.labelStyle) : c.selectAll("span").attr("style", f), !a) {
    const O = RegExp(/color\s*:\s*([^;]*)/), I = O.exec(f);
    if (I) {
      const B = I[0].replace("color", "fill");
      c.selectAll("tspan").attr("style", B);
    } else if (u) {
      const B = O.exec(u);
      if (B) {
        const M = B[0].replace("color", "fill");
        c.selectAll("tspan").attr("style", M);
      }
    }
  }
  return pt(t, L), t.intersect = function(O) {
    return lt.rect(t, O);
  }, c;
}
p(f0, "classBox");
async function p0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const s = t, o = t, n = 20, a = 20, l = "verifyMethod" in t, c = bt(t), h = Ot(), { themeVariables: u } = h, { borderColorArray: d, requirementEdgeLabelBackground: f } = u, m = h.layout === "elk" ? "start" : "center", y = e.insert("g").attr("class", c).attr("id", t.domId ?? t.id);
  let x;
  l ? x = await lr(
    y,
    `&lt;&lt;${s.type}&gt;&gt;`,
    0,
    t.labelStyle
  ) : x = await lr(y, "&lt;&lt;Element&gt;&gt;", 0, t.labelStyle);
  let C = x;
  const b = await lr(
    y,
    s.name,
    C,
    t.labelStyle + "; font-weight: bold;"
  );
  if (C += b + a, l) {
    const R = await lr(
      y,
      `${s.requirementId ? `ID: ${s.requirementId}` : ""}`,
      C,
      t.labelStyle,
      m
    );
    C += R;
    const st = await lr(
      y,
      `${s.text ? `Text: ${s.text}` : ""}`,
      C,
      t.labelStyle,
      m
    );
    C += st;
    const j = await lr(
      y,
      `${s.risk ? `Risk: ${s.risk}` : ""}`,
      C,
      t.labelStyle,
      m
    );
    C += j, await lr(
      y,
      `${s.verifyMethod ? `Verification: ${s.verifyMethod}` : ""}`,
      C,
      t.labelStyle,
      m
    );
  } else {
    const R = await lr(
      y,
      `${o.type ? `Type: ${o.type}` : ""}`,
      C,
      t.labelStyle,
      m
    );
    C += R, await lr(
      y,
      `${o.docRef ? `Doc Ref: ${o.docRef}` : ""}`,
      C,
      t.labelStyle,
      m
    );
  }
  const w = (y.node()?.getBBox().width ?? 200) + n, _ = (y.node()?.getBBox().height ?? 200) + n, v = -w / 2, E = -_ / 2, A = ft.svg(y), L = ut(t, {});
  t.look !== "handDrawn" && (L.roughness = 0, L.fillStyle = "solid");
  const z = A.rectangle(v, E, w, _, L), W = y.insert(() => z, ":first-child");
  if (W.attr("class", "basic label-container outer-path").attr("style", i), d?.length) {
    const R = t.colorIndex ?? 0;
    y.attr("data-color-id", `color-${R % d.length}`);
  }
  if (y.selectAll(".label").each((R, st, j) => {
    const O = Et(j[st]), I = O.attr("transform");
    let B = 0, M = 0;
    if (I) {
      const dt = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(I);
      dt && (B = parseFloat(dt[1]), M = parseFloat(dt[2]));
    }
    const F = M - _ / 2;
    let Q = v + n / 2;
    (st === 0 || st === 1) && (Q = B), O.attr("transform", `translate(${Q}, ${F + n})`);
  }), C > x + b + a) {
    const R = E + x + b + a;
    let st;
    if (t.look === "neo") {
      const I = [
        [v, R],
        [v + w, R],
        [v + w, R + 1e-3],
        [v, R + 1e-3]
      ];
      st = A.polygon(I, L);
    } else
      st = A.line(v, R, v + w, R, L);
    y.insert(() => st).attr("class", "divider");
  }
  return pt(t, W), t.intersect = function(R) {
    return lt.rect(t, R);
  }, i && t.look !== "handDrawn" && (f || d?.length) && y.selectAll("path").attr("style", i), y;
}
p(p0, "requirementBox");
async function lr(e, t, r, i = "", s = "center") {
  if (t === "")
    return 0;
  const o = e.insert("g").attr("class", "label").attr("style", i), n = Ot(), a = n.htmlLabels ?? !0, l = await rr(
    o,
    Fh(Zr(t)),
    {
      width: Mr(t, n) + 50,
      // Add room for error when splitting text into multiple lines
      classes: "markdown-node-label",
      useHtmlLabels: a,
      style: i
    },
    n
  );
  let c;
  if (a) {
    const h = l.children[0], u = Et(l);
    s === "start" && Et(h).style("text-align", "left"), c = h.getBoundingClientRect(), u.attr("width", c.width), u.attr("height", c.height);
  } else {
    const h = l.children[0];
    for (const u of h.children)
      i && u.setAttribute("style", i);
    if (s === "start") {
      h.setAttribute("text-anchor", "start");
      for (const u of h.children)
        u.setAttribute("text-anchor", "start");
    }
    c = l.getBBox(), c.height += 6;
  }
  return o.attr("transform", `translate(${-c.width / 2},${-c.height / 2 + r})`), c.height;
}
p(lr, "addText");
var SB = /* @__PURE__ */ p((e) => {
  switch (e) {
    case "Very High":
      return "red";
    case "High":
      return "orange";
    case "Medium":
      return null;
    // no stroke
    case "Low":
      return "blue";
    case "Very Low":
      return "lightblue";
  }
}, "colorFromPriority");
async function g0(e, t, { config: r }) {
  const { labelStyles: i, nodeStyles: s } = gt(t);
  t.labelStyle = i || "";
  const o = 10, n = t.width;
  t.width = (t.width ?? 200) - 10;
  const {
    shapeSvg: a,
    bbox: l,
    label: c
  } = await Ct(e, t, bt(t)), h = t.padding || 10;
  let u = "", d;
  "ticket" in t && t.ticket && r?.kanban?.ticketBaseUrl && (u = r?.kanban?.ticketBaseUrl.replace("#TICKET#", t.ticket), d = a.insert("svg:a", ":first-child").attr("class", "kanban-ticket-link").attr("xlink:href", u).attr("target", "_blank"));
  const f = {
    useHtmlLabels: t.useHtmlLabels,
    labelStyle: t.labelStyle || "",
    width: t.width,
    img: t.img,
    padding: t.padding || 8,
    centerLabel: !1
  };
  let m, y;
  d ? { label: m, bbox: y } = await Ya(
    d,
    "ticket" in t && t.ticket || "",
    f
  ) : { label: m, bbox: y } = await Ya(
    a,
    "ticket" in t && t.ticket || "",
    f
  );
  const { label: x, bbox: C } = await Ya(
    a,
    "assigned" in t && t.assigned || "",
    f
  );
  t.width = n;
  const b = 10, w = t?.width || 0, _ = Math.max(y.height, C.height) / 2, v = Math.max(l.height + b * 2, t?.height || 0) + _, E = -w / 2, A = -v / 2;
  c.attr(
    "transform",
    "translate(" + (h - w / 2) + ", " + (-_ - l.height / 2) + ")"
  ), m.attr(
    "transform",
    "translate(" + (h - w / 2) + ", " + (-_ + l.height / 2) + ")"
  ), x.attr(
    "transform",
    "translate(" + (h + w / 2 - C.width - 2 * o) + ", " + (-_ + l.height / 2) + ")"
  );
  let L;
  const { rx: z, ry: W } = t, { cssStyles: R } = t;
  if (t.look === "handDrawn") {
    const st = ft.svg(a), j = ut(t, {}), O = z || W ? st.path(Xe(E, A, w, v, z || 0), j) : st.rectangle(E, A, w, v, j);
    L = a.insert(() => O, ":first-child"), L.attr("class", "basic label-container").attr("style", R || null);
  } else {
    L = a.insert("rect", ":first-child"), L.attr("class", "basic label-container __APA__").attr("style", s).attr("rx", z ?? 5).attr("ry", W ?? 5).attr("x", E).attr("y", A).attr("width", w).attr("height", v);
    const st = "priority" in t && t.priority;
    if (st) {
      const j = a.append("line"), O = E + 2, I = A + Math.floor((z ?? 0) / 2), B = A + v - Math.floor((z ?? 0) / 2);
      j.attr("x1", O).attr("y1", I).attr("x2", O).attr("y2", B).attr("stroke-width", "4").attr("stroke", SB(st));
    }
  }
  return pt(t, L), t.height = v, t.intersect = function(st) {
    return lt.rect(t, st);
  }, a;
}
p(g0, "kanbanItem");
async function m0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: n, label: a } = await Ct(
    e,
    t,
    bt(t)
  ), l = o.width + 10 * n, c = o.height + 8 * n, h = 0.15 * l, { cssStyles: u } = t, d = o.width + 20, f = o.height + 20, m = Math.max(l, d), y = Math.max(c, f);
  a.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`);
  let x;
  const C = `M0 0 
    a${h},${h} 1 0,0 ${m * 0.25},${-1 * y * 0.1}
    a${h},${h} 1 0,0 ${m * 0.25},0
    a${h},${h} 1 0,0 ${m * 0.25},0
    a${h},${h} 1 0,0 ${m * 0.25},${y * 0.1}

    a${h},${h} 1 0,0 ${m * 0.15},${y * 0.33}
    a${h * 0.8},${h * 0.8} 1 0,0 0,${y * 0.34}
    a${h},${h} 1 0,0 ${-1 * m * 0.15},${y * 0.33}

    a${h},${h} 1 0,0 ${-1 * m * 0.25},${y * 0.15}
    a${h},${h} 1 0,0 ${-1 * m * 0.25},0
    a${h},${h} 1 0,0 ${-1 * m * 0.25},0
    a${h},${h} 1 0,0 ${-1 * m * 0.25},${-1 * y * 0.15}

    a${h},${h} 1 0,0 ${-1 * m * 0.1},${-1 * y * 0.33}
    a${h * 0.8},${h * 0.8} 1 0,0 0,${-1 * y * 0.34}
    a${h},${h} 1 0,0 ${m * 0.1},${-1 * y * 0.33}
  H0 V0 Z`;
  if (t.look === "handDrawn") {
    const b = ft.svg(s), w = ut(t, {}), _ = b.path(C, w);
    x = s.insert(() => _, ":first-child"), x.attr("class", "basic label-container").attr("style", re(u));
  } else
    x = s.insert("path", ":first-child").attr("class", "basic label-container").attr("style", i).attr("d", C);
  return x.attr("transform", `translate(${-m / 2}, ${-y / 2})`), pt(t, x), t.calcIntersect = function(b, w) {
    return lt.rect(b, w);
  }, t.intersect = function(b) {
    return q.info("Bang intersect", t, b), lt.rect(t, b);
  }, s;
}
p(m0, "bang");
async function y0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: n, label: a } = await Ct(
    e,
    t,
    bt(t)
  ), l = o.width + 2 * n, c = o.height + 2 * n, h = 0.15 * l, u = 0.25 * l, d = 0.35 * l, f = 0.2 * l, { cssStyles: m } = t;
  let y;
  const x = `M0 0 
    a${h},${h} 0 0,1 ${l * 0.25},${-1 * l * 0.1}
    a${d},${d} 1 0,1 ${l * 0.4},${-1 * l * 0.1}
    a${u},${u} 1 0,1 ${l * 0.35},${l * 0.2}

    a${h},${h} 1 0,1 ${l * 0.15},${c * 0.35}
    a${f},${f} 1 0,1 ${-1 * l * 0.15},${c * 0.65}

    a${u},${h} 1 0,1 ${-1 * l * 0.25},${l * 0.15}
    a${d},${d} 1 0,1 ${-1 * l * 0.5},0
    a${h},${h} 1 0,1 ${-1 * l * 0.25},${-1 * l * 0.15}

    a${h},${h} 1 0,1 ${-1 * l * 0.1},${-1 * c * 0.35}
    a${f},${f} 1 0,1 ${l * 0.1},${-1 * c * 0.65}
  H0 V0 Z`;
  if (t.look === "handDrawn") {
    const C = ft.svg(s), b = ut(t, {}), w = C.path(x, b);
    y = s.insert(() => w, ":first-child"), y.attr("class", "basic label-container").attr("style", re(m));
  } else
    y = s.insert("path", ":first-child").attr("class", "basic label-container").attr("style", i).attr("d", x);
  return a.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), y.attr("transform", `translate(${-l / 2}, ${-c / 2})`), pt(t, y), t.calcIntersect = function(C, b) {
    return lt.rect(C, b);
  }, t.intersect = function(C) {
    return q.info("Cloud intersect", t, C), lt.rect(t, C);
  }, s;
}
p(y0, "cloud");
async function x0(e, t) {
  const { labelStyles: r, nodeStyles: i } = gt(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: n, label: a } = await Ct(
    e,
    t,
    bt(t)
  ), l = o.width + 8 * n, c = o.height + 2 * n, h = 5, u = t.look === "neo" ? `
    M${-l / 2} ${c / 2 - h}
    v${-c + 2 * h}
    q0,-${h} ${h},-${h}
    h${l - 2 * h}
    q${h},0 ${h},${h}
    v${c - h}
    H${-l / 2}
    Z
  ` : `
    M${-l / 2} ${c / 2 - h}
    v${-c + 2 * h}
    q0,-${h} ${h},-${h}
    h${l - 2 * h}
    q${h},0 ${h},${h}
    v${c - 2 * h}
    q0,${h} ${-h},${h}
    h${-(l - 2 * h)}
    q${-h},0 ${-h},${-h}
    Z
  `;
  if (!t.domId)
    throw new Error(
      `defaultMindmapNode: node "${t.id}" is missing a domId — was render.ts domId prefixing skipped?`
    );
  const d = s.append("path").attr("id", t.domId).attr("class", "node-bkg node-" + t.type).attr("style", i).attr("d", u);
  return s.append("line").attr("class", "node-line-").attr("x1", -l / 2).attr("y1", c / 2).attr("x2", l / 2).attr("y2", c / 2), a.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), s.append(() => a.node()), pt(t, d), t.calcIntersect = function(f, m) {
    return lt.rect(f, m);
  }, t.intersect = function(f) {
    return lt.rect(t, f);
  }, s;
}
p(x0, "defaultMindmapNode");
async function C0(e, t) {
  const r = {
    padding: t.padding ?? 0
  };
  return gc(e, t, r);
}
p(C0, "mindmapCircle");
var TB = [
  {
    semanticName: "Process",
    name: "Rectangle",
    shortName: "rect",
    description: "Standard process shape",
    aliases: ["proc", "process", "rectangle"],
    internalAliases: ["squareRect"],
    handler: Ky
  },
  {
    semanticName: "Event",
    name: "Rounded Rectangle",
    shortName: "rounded",
    description: "Represents an event",
    aliases: ["event"],
    internalAliases: ["roundedRect"],
    handler: Xy
  },
  {
    semanticName: "Terminal Point",
    name: "Stadium",
    shortName: "stadium",
    description: "Terminal point",
    aliases: ["terminal", "pill"],
    handler: Zy
  },
  {
    semanticName: "Subprocess",
    name: "Framed Rectangle",
    shortName: "fr-rect",
    description: "Subprocess",
    aliases: ["subprocess", "subproc", "framed-rectangle", "subroutine"],
    handler: e0
  },
  {
    semanticName: "Database",
    name: "Cylinder",
    shortName: "cyl",
    description: "Database storage",
    aliases: ["db", "database", "cylinder"],
    handler: xy
  },
  {
    semanticName: "Data Store",
    name: "Data Store",
    shortName: "datastore",
    description: "Data flow diagram data store",
    aliases: ["data-store"],
    handler: Cy
  },
  {
    semanticName: "Folder",
    name: "Folder",
    shortName: "folder",
    description: "Folder or directory",
    aliases: ["directory"],
    handler: Ty
  },
  {
    semanticName: "Bucket",
    name: "Bucket",
    shortName: "bucket",
    description: "Object storage bucket",
    handler: iy
  },
  {
    semanticName: "Console",
    name: "Console (terminal window)",
    shortName: "console",
    description: "Terminal or console window",
    handler: cy
  },
  {
    semanticName: "Browser",
    name: "Browser",
    shortName: "browser",
    description: "Browser window",
    handler: ny
  },
  {
    semanticName: "Person",
    name: "Person",
    shortName: "person",
    description: "Person (circular head above a rounded body)",
    handler: yy
  },
  {
    semanticName: "Start",
    name: "Circle",
    shortName: "circle",
    description: "Starting point",
    aliases: ["circ"],
    handler: gc
  },
  {
    semanticName: "Bang",
    name: "Bang",
    shortName: "bang",
    description: "Bang",
    aliases: ["bang"],
    handler: m0
  },
  {
    semanticName: "Cloud",
    name: "Cloud",
    shortName: "cloud",
    description: "cloud",
    aliases: ["cloud"],
    handler: y0
  },
  {
    semanticName: "Decision",
    name: "Diamond",
    shortName: "diam",
    description: "Decision-making step",
    aliases: ["decision", "diamond", "question"],
    handler: Yy
  },
  {
    semanticName: "Prepare Conditional",
    name: "Hexagon",
    shortName: "hex",
    description: "Preparation or condition step",
    aliases: ["hexagon", "prepare"],
    handler: By
  },
  {
    semanticName: "Data Input/Output",
    name: "Lean Right",
    shortName: "lean-r",
    description: "Represents input or output",
    aliases: ["lean-right", "in-out"],
    internalAliases: ["lean_right"],
    handler: Py
  },
  {
    semanticName: "Data Input/Output",
    name: "Lean Left",
    shortName: "lean-l",
    description: "Represents output or input",
    aliases: ["lean-left", "out-in"],
    internalAliases: ["lean_left"],
    handler: Dy
  },
  {
    semanticName: "Priority Action",
    name: "Trapezoid Base Bottom",
    shortName: "trap-b",
    description: "Priority action",
    aliases: ["priority", "trapezoid-bottom", "trapezoid"],
    handler: n0
  },
  {
    semanticName: "Manual Operation",
    name: "Trapezoid Base Top",
    shortName: "trap-t",
    description: "Represents a manual task",
    aliases: ["manual", "trapezoid-top", "inv-trapezoid"],
    internalAliases: ["inv_trapezoid"],
    handler: Oy
  },
  {
    semanticName: "Stop",
    name: "Double Circle",
    shortName: "dbl-circ",
    description: "Represents a stop point",
    aliases: ["double-circle"],
    internalAliases: ["doublecircle"],
    handler: ky
  },
  {
    semanticName: "Text Block",
    name: "Text Block",
    shortName: "text",
    description: "Text block",
    handler: s0
  },
  {
    semanticName: "Card",
    name: "Notched Rectangle",
    shortName: "notch-rect",
    description: "Represents a card",
    aliases: ["card", "notched-rectangle"],
    handler: ay
  },
  {
    semanticName: "Lined/Shaded Process",
    name: "Lined Rectangle",
    shortName: "lin-rect",
    description: "Lined process shape",
    aliases: ["lined-rectangle", "lined-process", "lin-proc", "shaded-process"],
    handler: Gy
  },
  {
    semanticName: "Start",
    name: "Small Circle",
    shortName: "sm-circ",
    description: "Small starting point",
    aliases: ["start", "small-circle"],
    internalAliases: ["stateStart"],
    handler: t0
  },
  {
    semanticName: "Stop",
    name: "Framed Circle",
    shortName: "fr-circ",
    description: "Stop point",
    aliases: ["stop", "framed-circle"],
    internalAliases: ["stateEnd"],
    handler: Jy
  },
  {
    semanticName: "Fork/Join",
    name: "Filled Rectangle",
    shortName: "fork",
    description: "Fork or join in process flow",
    aliases: ["join"],
    internalAliases: ["forkJoin"],
    handler: _y
  },
  {
    semanticName: "Collate",
    name: "Hourglass",
    shortName: "hourglass",
    description: "Represents a collate operation",
    aliases: ["hourglass", "collate"],
    handler: Ly
  },
  {
    semanticName: "Comment",
    name: "Curly Brace",
    shortName: "brace",
    description: "Adds a comment",
    aliases: ["comment", "brace-l"],
    handler: fy
  },
  {
    semanticName: "Comment Right",
    name: "Curly Brace",
    shortName: "brace-r",
    description: "Adds a comment",
    handler: py
  },
  {
    semanticName: "Comment with braces on both sides",
    name: "Curly Braces",
    shortName: "braces",
    description: "Adds a comment",
    handler: gy
  },
  {
    semanticName: "Com Link",
    name: "Lightning Bolt",
    shortName: "bolt",
    description: "Communication link",
    aliases: ["com-link", "lightning-bolt"],
    handler: Ry
  },
  {
    semanticName: "Document",
    name: "Document",
    shortName: "doc",
    description: "Represents a document",
    aliases: ["doc", "document"],
    handler: h0
  },
  {
    semanticName: "Delay",
    name: "Half-Rounded Rectangle",
    shortName: "delay",
    description: "Represents a delay",
    aliases: ["half-rounded-rectangle"],
    handler: vy
  },
  {
    semanticName: "Direct Access Storage",
    name: "Horizontal Cylinder",
    shortName: "h-cyl",
    description: "Direct access storage",
    aliases: ["das", "horizontal-cylinder"],
    handler: o0
  },
  {
    semanticName: "Disk Storage",
    name: "Lined Cylinder",
    shortName: "lin-cyl",
    description: "Disk storage",
    aliases: ["disk", "lined-cylinder"],
    handler: Ny
  },
  {
    semanticName: "Display",
    name: "Curved Trapezoid",
    shortName: "curv-trap",
    description: "Represents a display",
    aliases: ["curved-trapezoid", "display"],
    handler: my
  },
  {
    semanticName: "Divided Process",
    name: "Divided Rectangle",
    shortName: "div-rect",
    description: "Divided process shape",
    aliases: ["div-proc", "divided-rectangle", "divided-process"],
    handler: by
  },
  {
    semanticName: "Extract",
    name: "Triangle",
    shortName: "tri",
    description: "Extraction process",
    aliases: ["extract", "triangle"],
    handler: l0
  },
  {
    semanticName: "Internal Storage",
    name: "Window Pane",
    shortName: "win-pane",
    description: "Internal storage",
    aliases: ["internal-storage", "window-pane"],
    handler: u0
  },
  {
    semanticName: "Junction",
    name: "Filled Circle",
    shortName: "f-circ",
    description: "Junction point",
    aliases: ["junction", "filled-circle"],
    handler: wy
  },
  {
    semanticName: "Loop Limit",
    name: "Trapezoidal Pentagon",
    shortName: "notch-pent",
    description: "Loop limit step",
    aliases: ["loop-limit", "notched-pentagon"],
    handler: a0
  },
  {
    semanticName: "Manual File",
    name: "Flipped Triangle",
    shortName: "flip-tri",
    description: "Manual file operation",
    aliases: ["manual-file", "flipped-triangle"],
    handler: Sy
  },
  {
    semanticName: "Manual Input",
    name: "Sloped Rectangle",
    shortName: "sl-rect",
    description: "Manual input step",
    aliases: ["manual-input", "sloped-rectangle"],
    handler: Vy
  },
  {
    semanticName: "Multi-Document",
    name: "Stacked Document",
    shortName: "docs",
    description: "Multiple documents",
    aliases: ["documents", "st-doc", "stacked-document"],
    handler: zy
  },
  {
    semanticName: "Multi-Process",
    name: "Stacked Rectangle",
    shortName: "st-rect",
    description: "Multiple processes",
    aliases: ["procs", "processes", "stacked-rectangle"],
    handler: Wy
  },
  {
    semanticName: "Stored Data",
    name: "Bow Tie Rectangle",
    shortName: "bow-rect",
    description: "Stored data",
    aliases: ["stored-data", "bow-tie-rectangle"],
    handler: ry
  },
  {
    semanticName: "Summary",
    name: "Crossed Circle",
    shortName: "cross-circ",
    description: "Summary",
    aliases: ["summary", "crossed-circle"],
    handler: dy
  },
  {
    semanticName: "Tagged Document",
    name: "Tagged Document",
    shortName: "tag-doc",
    description: "Tagged document",
    aliases: ["tag-doc", "tagged-document"],
    handler: i0
  },
  {
    semanticName: "Tagged Process",
    name: "Tagged Rectangle",
    shortName: "tag-rect",
    description: "Tagged process",
    aliases: ["tagged-rectangle", "tag-proc", "tagged-process"],
    handler: r0
  },
  {
    semanticName: "Paper Tape",
    name: "Flag",
    shortName: "flag",
    description: "Paper tape",
    aliases: ["paper-tape"],
    handler: c0
  },
  {
    semanticName: "Odd",
    name: "Odd",
    shortName: "odd",
    description: "Odd shape",
    internalAliases: ["rect_left_inv_arrow"],
    handler: Uy
  },
  {
    semanticName: "Lined Document",
    name: "Lined Document",
    shortName: "lin-doc",
    description: "Lined document",
    aliases: ["lined-document"],
    handler: qy
  }
], _B = /* @__PURE__ */ p(() => {
  const t = [
    ...Object.entries({
      // States
      state: Qy,
      choice: ly,
      note: Hy,
      // Rectangles
      composite: hy,
      rectWithTitle: jy,
      labelRect: Iy,
      block_arrow: oy,
      // Collapsed subgraph (flowchart `@{ view: collapsed }`)
      collapsedGroup: sy,
      // Icons
      iconSquare: My,
      iconCircle: Ey,
      icon: Ay,
      iconRounded: Fy,
      imageSquare: $y,
      anchor: ty,
      // Kanban diagram
      kanbanItem: g0,
      //Mindmap diagram
      mindmapCircle: C0,
      defaultMindmapNode: x0,
      // class diagram
      classBox: f0,
      // er diagram
      erBox: mc,
      // Requirement diagram
      requirementBox: p0
    }),
    ...TB.flatMap((r) => [
      r.shortName,
      ..."aliases" in r ? r.aliases : [],
      ..."internalAliases" in r ? r.internalAliases : []
    ].map((s) => [s, r.handler]))
  ];
  return Object.fromEntries(t);
}, "generateShapeMap"), b0 = _B();
function vB(e) {
  return e in b0;
}
p(vB, "isValidShape");
var ia = /* @__PURE__ */ p(({
  flowchart: e
}) => {
  const t = e?.subGraphTitleMargin?.top ?? 0, r = e?.subGraphTitleMargin?.bottom ?? 0, i = t + r;
  return {
    subGraphTitleTopMargin: t,
    subGraphTitleBottomMargin: r,
    subGraphTitleTotalMargin: i
  };
}, "getSubGraphTitleMargins"), sa = /* @__PURE__ */ new Map();
async function yc(e, t, r) {
  let i, s;
  t.shape === "rect" && (t.rx && t.ry ? t.shape = "roundedRect" : t.shape = "squareRect");
  const o = t.shape ? b0[t.shape] : void 0;
  if (!o)
    throw new Error(`No such shape: ${t.shape}. Please check your syntax.`);
  if (t.link) {
    let n;
    r.config.securityLevel === "sandbox" ? n = "_top" : t.linkTarget && (n = t.linkTarget || "_blank"), i = e.insert("svg:a").attr("xlink:href", t.link).attr("target", n ?? null), s = await o(i, t, r);
  } else
    s = await o(e, t, r), i = s;
  return i.attr("data-look", re(t.look)), t.tooltip && s.attr("title", t.tooltip), sa.set(t.id, i), t.haveCallback && i.attr("class", i.attr("class") + " clickable"), i;
}
p(yc, "insertNode");
var $I = /* @__PURE__ */ p((e, t) => {
  sa.set(t.id, e);
}, "setNodeElem"), BB = /* @__PURE__ */ p(() => {
  sa.clear();
}, "clear"), Zd = /* @__PURE__ */ p((e) => {
  const t = sa.get(e.id);
  q.trace(
    "Transforming node",
    e.diff,
    e,
    "translate(" + (e.x - e.width / 2 - 5) + ", " + e.width / 2 + ")"
  );
  const r = 8, i = e.diff || 0;
  return e.clusterNode ? t.attr(
    "transform",
    "translate(" + (e.x + i - e.width / 2) + ", " + (e.y - e.height / 2 - r) + ")"
  ) : t.attr("transform", "translate(" + e.x + ", " + e.y + ")"), i;
}, "positionNode"), LB = /* @__PURE__ */ p(async (e, t) => {
  const r = Ot(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: n } = i, a = n, { labelStyles: l, nodeStyles: c, borderStyles: h, backgroundStyles: u } = gt(t), d = e.insert("g").attr("class", "cluster swimlane " + (t.cssClasses || "")).attr("id", t.id).attr("data-id", t.id).attr("data-et", "cluster").attr("data-look", t.look), f = xr(r.flowchart.htmlLabels), m = t.direction === "LR", y = d.insert("g").attr("class", "cluster-label swimlane-label"), x = await rr(y, t.label, {
    style: t.labelStyle,
    useHtmlLabels: f,
    isNode: !0,
    width: t.width
  });
  let C = x.getBBox();
  if (f) {
    const j = x.children[0], O = Et(x);
    C = j.getBoundingClientRect(), O.attr("width", C.width), O.attr("height", C.height);
  }
  const b = t.padding ?? 0, w = t.width <= C.width + b ? C.width + b : t.width;
  t.width <= C.width + b ? t.diff = (w - t.width) / 2 - b : t.diff = -b;
  const _ = t.height, v = t.y - _ / 2, E = t.y + _ / 2, A = t.x - w / 2, L = t.swimlaneContentTop !== void 0 ? t.swimlaneContentTop : v + _ / 3, z = m ? 4 : 0, W = C.height + 2 * z;
  let R, st;
  if (m) {
    const j = Math.max(W, C.height + 2 * z), O = A + j, I = Math.max(0, w - j);
    if (t.look === "handDrawn") {
      const F = ft.svg(d), Q = ut(t, {
        roughness: 0.7,
        fill: o,
        stroke: a,
        fillWeight: 3,
        seed: s
      }), Z = ut(t, {
        roughness: 0.7,
        fill: "none",
        stroke: a,
        seed: s
      }), dt = F.rectangle(A, v, j, _, Q);
      R = d.insert(() => dt, ":first-child");
      const wt = F.rectangle(O, v, I, _, Z);
      st = d.insert(() => wt, ":first-child"), R.select("path:nth-child(2)").attr("style", h.join(";")), R.select("path").attr("style", u.join(";").replace("fill", "stroke"));
    } else
      R = d.insert("rect", ":first-child"), st = d.insert("rect", ":first-child"), R.attr("class", "swimlane-title").attr("style", c).attr("x", A).attr("y", v).attr("width", j).attr("height", _).attr("fill", o).attr("stroke", a), st.attr("class", "swimlane-body").attr("style", c).attr("x", O).attr("y", v).attr("width", I).attr("height", _).attr("fill", "none").attr("stroke", a);
    const B = A + j / 2, M = t.y;
    y.attr(
      "transform",
      `translate(${B}, ${M}) rotate(-90) translate(${-C.width / 2}, ${-C.height / 2})`
    );
  } else {
    const j = Math.max(0, L - v), O = Math.min(W, j), I = v + O, B = Math.max(0, E - I), M = t.x - w / 2;
    if (t.look === "handDrawn") {
      const Z = ft.svg(d), dt = ut(t, {
        roughness: 0.7,
        fill: o,
        stroke: a,
        fillWeight: 3,
        seed: s
      }), wt = ut(t, {
        roughness: 0.7,
        fill: "none",
        stroke: a,
        seed: s
      }), yt = Z.rectangle(M, v, w, O, dt);
      R = d.insert(() => yt, ":first-child");
      const at = Z.rectangle(M, I, w, B, wt);
      st = d.insert(() => at, ":first-child"), R.select("path:nth-child(2)").attr("style", h.join(";")), R.select("path").attr("style", u.join(";").replace("fill", "stroke"));
    } else
      R = d.insert("rect", ":first-child"), st = d.insert("rect", ":first-child"), R.attr("class", "swimlane-title").attr("style", c).attr("x", M).attr("y", v).attr("width", w).attr("height", O).attr("fill", o).attr("stroke", a), st.attr("class", "swimlane-body").attr("style", c).attr("x", M).attr("y", I).attr("width", w).attr("height", B).attr("fill", "none").attr("stroke", a);
    const F = t.x - C.width / 2, Q = v + (O - C.height) / 2;
    y.attr("transform", `translate(${F}, ${Q})`);
  }
  if (q.trace("Swimlane data ", t, JSON.stringify(t)), l) {
    const j = y.select("span");
    j && j.attr("style", l);
  }
  return t.offsetX = 0, t.width = w, t.height = _, t.offsetY = C.height - b / 2, t.intersect = function(j) {
    return vi(t, j);
  }, { cluster: d, labelBBox: C };
}, "swimlane"), k0 = /* @__PURE__ */ p(async (e, t) => {
  q.info("Creating subgraph rect for ", t.id, t);
  const r = Ot(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: n } = i, { labelStyles: a, nodeStyles: l, borderStyles: c, backgroundStyles: h } = gt(t), u = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), d = ye(r), f = u.insert("g").attr("class", "cluster-label ");
  let m;
  t.labelType === "markdown" ? m = await rr(f, t.label, {
    style: t.labelStyle,
    useHtmlLabels: d,
    isNode: !0,
    width: t.width
  }) : m = await Xr(f, t.label, t.labelStyle || "", !1, !0);
  let y = m.getBBox();
  if (ye(r)) {
    const A = m.children[0], L = Et(m);
    y = A.getBoundingClientRect(), L.attr("width", y.width), L.attr("height", y.height);
  }
  const x = t.width <= y.width + t.padding ? y.width + t.padding : t.width;
  t.width <= y.width + t.padding ? t.diff = (x - t.width) / 2 - t.padding : t.diff = -t.padding;
  const C = t.height, b = t.x - x / 2, w = t.y - C / 2;
  q.trace("Data ", t, JSON.stringify(t));
  let _;
  if (t.look === "handDrawn") {
    const A = ft.svg(u), L = ut(t, {
      roughness: 0.7,
      fill: o,
      // fill: 'red',
      stroke: n,
      fillWeight: 3,
      seed: s
    }), z = A.path(Xe(b, w, x, C, 0), L);
    _ = u.insert(() => (q.debug("Rough node insert CXC", z), z), ":first-child"), _.select("path:nth-child(2)").attr("style", c.join(";")), _.select("path").attr("style", h.join(";").replace("fill", "stroke"));
  } else
    _ = u.insert("rect", ":first-child"), _.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", b).attr("y", w).attr("width", x).attr("height", C);
  const { subGraphTitleTopMargin: v } = ia(r);
  if (f.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${t.x - y.width / 2}, ${t.y - t.height / 2 + v})`
  ), a) {
    const A = f.select("span");
    A && A.attr("style", a);
  }
  const E = _.node().getBBox();
  return t.offsetX = 0, t.width = E.width, t.height = E.height, t.offsetY = y.height - t.padding / 2, t.intersect = function(A) {
    return vi(t, A);
  }, { cluster: u, labelBBox: y };
}, "rect"), AB = /* @__PURE__ */ p((e, t) => {
  const r = e.insert("g").attr("class", "note-cluster").attr("id", t.domId), i = r.insert("rect", ":first-child"), s = 0 * t.padding, o = s / 2;
  i.attr("rx", t.rx).attr("ry", t.ry).attr("x", t.x - t.width / 2 - o).attr("y", t.y - t.height / 2 - o).attr("width", t.width + s).attr("height", t.height + s).attr("fill", "none");
  const n = i.node().getBBox();
  return t.width = n.width, t.height = n.height, t.intersect = function(a) {
    return vi(t, a);
  }, { cluster: r, labelBBox: { width: 0, height: 0 } };
}, "noteGroup"), EB = /* @__PURE__ */ p(async (e, t) => {
  const r = Ot(), { themeVariables: i, handDrawnSeed: s } = r, { altBackground: o, compositeBackground: n, compositeTitleBackground: a, nodeBorder: l } = i, c = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-id", t.id).attr("data-look", t.look), h = c.insert("g", ":first-child"), u = c.insert("g").attr("class", "cluster-label");
  let d = c.append("rect");
  const f = await Xr(u, t.label, t.labelStyle, void 0, !0);
  let m = f.getBBox();
  if (ye(r)) {
    const z = f.children[0], W = Et(f);
    m = z.getBoundingClientRect(), W.attr("width", m.width), W.attr("height", m.height);
  }
  const y = 0 * t.padding, x = y / 2, C = (t.width <= m.width + t.padding ? m.width + t.padding : t.width) + y;
  t.width <= m.width + t.padding ? t.diff = (C - t.width) / 2 - t.padding : t.diff = -t.padding;
  const b = t.height + y, w = t.height + y - m.height - 6, _ = t.x - C / 2, v = t.y - b / 2;
  t.width = C;
  const E = t.y - t.height / 2 - x + m.height + 2;
  let A;
  if (t.look === "handDrawn") {
    const z = t.cssClasses.includes("statediagram-cluster-alt"), W = ft.svg(c), R = t.rx || t.ry ? W.path(Xe(_, v, C, b, 10), {
      roughness: 0.7,
      fill: a,
      fillStyle: "solid",
      stroke: l,
      seed: s
    }) : W.rectangle(_, v, C, b, { seed: s });
    A = c.insert(() => R, ":first-child");
    const st = W.rectangle(_, E, C, w, {
      fill: z ? o : n,
      fillStyle: z ? "hachure" : "solid",
      stroke: l,
      seed: s
    });
    A = c.insert(() => R, ":first-child"), d = c.insert(() => st);
  } else
    A = h.insert("rect", ":first-child"), A.attr("class", "outer").attr("x", _).attr("y", v).attr("width", C).attr("height", b).attr("data-look", t.look), d.attr("class", "inner").attr("x", _).attr("y", E).attr("width", C).attr("height", w);
  u.attr(
    "transform",
    `translate(${t.x - m.width / 2}, ${v + 1 - (ye(r) ? 0 : 3)})`
  );
  const L = A.node().getBBox();
  return t.height = L.height, t.offsetX = 0, t.offsetY = m.height - t.padding / 2, t.labelBBox = m, t.intersect = function(z) {
    return vi(t, z);
  }, { cluster: c, labelBBox: m };
}, "roundedWithTitle"), FB = /* @__PURE__ */ p(async (e, t) => {
  q.info("Creating subgraph rect for ", t.id, t);
  const r = Ot(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: n } = i, { labelStyles: a, nodeStyles: l, borderStyles: c, backgroundStyles: h } = gt(t), u = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), d = ye(r), f = u.insert("g").attr("class", "cluster-label "), m = await rr(f, t.label, {
    style: t.labelStyle,
    useHtmlLabels: d,
    isNode: !0,
    width: t.width
  });
  let y = m.getBBox();
  if (ye(r)) {
    const A = m.children[0], L = Et(m);
    y = A.getBoundingClientRect(), L.attr("width", y.width), L.attr("height", y.height);
  }
  const x = t.width <= y.width + t.padding ? y.width + t.padding : t.width;
  t.width <= y.width + t.padding ? t.diff = (x - t.width) / 2 - t.padding : t.diff = -t.padding;
  const C = t.height, b = t.x - x / 2, w = t.y - C / 2;
  q.trace("Data ", t, JSON.stringify(t));
  let _;
  if (t.look === "handDrawn") {
    const A = ft.svg(u), L = ut(t, {
      roughness: 0.7,
      fill: o,
      // fill: 'red',
      stroke: n,
      fillWeight: 4,
      seed: s
    }), z = A.path(Xe(b, w, x, C, t.rx), L);
    _ = u.insert(() => (q.debug("Rough node insert CXC", z), z), ":first-child"), _.select("path:nth-child(2)").attr("style", c.join(";")), _.select("path").attr("style", h.join(";").replace("fill", "stroke"));
  } else
    _ = u.insert("rect", ":first-child"), _.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", b).attr("y", w).attr("width", x).attr("height", C);
  const { subGraphTitleTopMargin: v } = ia(r);
  if (f.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${t.x - y.width / 2}, ${t.y - t.height / 2 + v})`
  ), a) {
    const A = f.select("span");
    A && A.attr("style", a);
  }
  const E = _.node().getBBox();
  return t.offsetX = 0, t.width = E.width, t.height = E.height, t.offsetY = y.height - t.padding / 2, t.intersect = function(A) {
    return vi(t, A);
  }, { cluster: u, labelBBox: y };
}, "kanbanSection"), MB = /* @__PURE__ */ p((e, t) => {
  const r = Ot(), { themeVariables: i, handDrawnSeed: s } = r, { nodeBorder: o } = i, n = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-look", t.look), a = n.insert("g", ":first-child"), l = 0 * t.padding, c = t.width + l;
  t.diff = -t.padding;
  const h = t.height + l, u = t.x - c / 2, d = t.y - h / 2;
  t.width = c;
  let f;
  if (t.look === "handDrawn") {
    const x = ft.svg(n).rectangle(u, d, c, h, {
      fill: "lightgrey",
      roughness: 0.5,
      strokeLineDash: [5],
      stroke: o,
      seed: s
    });
    f = n.insert(() => x, ":first-child");
  } else {
    f = a.insert("rect", ":first-child");
    let y = "outer";
    t.look, y = "divider", f.attr("class", y).attr("x", u).attr("y", d).attr("width", c).attr("height", h).attr("data-look", t.look);
  }
  const m = f.node().getBBox();
  return t.height = m.height, t.offsetX = 0, t.offsetY = 0, t.intersect = function(y) {
    return vi(t, y);
  }, { cluster: n, labelBBox: {} };
}, "divider"), $B = k0, OB = {
  rect: k0,
  squareRect: $B,
  roundedWithTitle: EB,
  noteGroup: AB,
  divider: MB,
  kanbanSection: FB,
  swimlane: LB
}, w0 = /* @__PURE__ */ new Map(), S0 = /* @__PURE__ */ p(async (e, t) => {
  const r = t.shape || "rect", i = await OB[r](e, t);
  return w0.set(t.id, i), i;
}, "insertCluster"), IB = /* @__PURE__ */ p(() => {
  w0 = /* @__PURE__ */ new Map();
}, "clear"), Ps = /* @__PURE__ */ p((e, t) => {
  if (t)
    return "translate(" + -e.width / 2 + ", " + -e.height / 2 + ")";
  const r = e.x ?? 0, i = e.y ?? 0;
  return "translate(" + -(r + e.width / 2) + ", " + -(i + e.height / 2) + ")";
}, "computeLabelTransform"), ge = {
  aggregation: 17.25,
  extension: 17.25,
  composition: 17.25,
  dependency: 6,
  lollipop: 13.5,
  arrow_point: 4,
  arrow_barb: 0,
  arrow_barb_neo: 5.5
  //arrow_cross: 24,
}, Qd = {
  arrow_point: 4,
  arrow_cross: 12.5,
  arrow_circle: 12.5
};
function Gs(e, t) {
  if (e === void 0 || t === void 0)
    return { angle: 0, deltaX: 0, deltaY: 0 };
  e = Vt(e), t = Vt(t);
  const [r, i] = [e.x, e.y], [s, o] = [t.x, t.y], n = s - r, a = o - i;
  return { angle: Math.atan(a / n), deltaX: n, deltaY: a };
}
p(Gs, "calculateDeltaAndAngle");
var Vt = /* @__PURE__ */ p((e) => Array.isArray(e) ? { x: e[0], y: e[1] } : e, "pointTransformer"), DB = /* @__PURE__ */ p((e) => ({
  x: /* @__PURE__ */ p(function(t, r, i) {
    let s = 0;
    const o = Vt(i[0]).x < Vt(i[i.length - 1]).x ? "left" : "right";
    if (r === 0 && Object.hasOwn(ge, e.arrowTypeStart)) {
      const { angle: f, deltaX: m } = Gs(i[0], i[1]);
      s = ge[e.arrowTypeStart] * Math.cos(f) * (m >= 0 ? 1 : -1);
    } else if (r === i.length - 1 && Object.hasOwn(ge, e.arrowTypeEnd)) {
      const { angle: f, deltaX: m } = Gs(
        i[i.length - 1],
        i[i.length - 2]
      );
      s = ge[e.arrowTypeEnd] * Math.cos(f) * (m >= 0 ? 1 : -1);
    }
    const n = Math.abs(
      Vt(t).x - Vt(i[i.length - 1]).x
    ), a = Math.abs(
      Vt(t).y - Vt(i[i.length - 1]).y
    ), l = Math.abs(Vt(t).x - Vt(i[0]).x), c = Math.abs(Vt(t).y - Vt(i[0]).y), h = ge[e.arrowTypeStart], u = ge[e.arrowTypeEnd], d = 1;
    if (n < u && n > 0 && a < u) {
      let f = u + d - n;
      f *= o === "right" ? -1 : 1, s -= f;
    }
    if (l < h && l > 0 && c < h) {
      let f = h + d - l;
      f *= o === "right" ? -1 : 1, s += f;
    }
    return Vt(t).x + s;
  }, "x"),
  y: /* @__PURE__ */ p(function(t, r, i) {
    let s = 0;
    const o = Vt(i[0]).y < Vt(i[i.length - 1]).y ? "down" : "up";
    if (r === 0 && Object.hasOwn(ge, e.arrowTypeStart)) {
      const { angle: f, deltaY: m } = Gs(i[0], i[1]);
      s = ge[e.arrowTypeStart] * Math.abs(Math.sin(f)) * (m >= 0 ? 1 : -1);
    } else if (r === i.length - 1 && Object.hasOwn(ge, e.arrowTypeEnd)) {
      const { angle: f, deltaY: m } = Gs(
        i[i.length - 1],
        i[i.length - 2]
      );
      s = ge[e.arrowTypeEnd] * Math.abs(Math.sin(f)) * (m >= 0 ? 1 : -1);
    }
    const n = Math.abs(
      Vt(t).y - Vt(i[i.length - 1]).y
    ), a = Math.abs(
      Vt(t).x - Vt(i[i.length - 1]).x
    ), l = Math.abs(Vt(t).y - Vt(i[0]).y), c = Math.abs(Vt(t).x - Vt(i[0]).x), h = ge[e.arrowTypeStart], u = ge[e.arrowTypeEnd], d = 1;
    if (n < u && n > 0 && a < u) {
      let f = u + d - n;
      f *= o === "up" ? -1 : 1, s -= f;
    }
    if (l < h && l > 0 && c < h) {
      let f = h + d - l;
      f *= o === "up" ? -1 : 1, s += f;
    }
    return Vt(t).y + s;
  }, "y")
}), "getLineFunctionsWithOffset"), PB = /* @__PURE__ */ p((e, t, r, i, s, o = !1, n) => {
  t.arrowTypeStart && Jd(
    e,
    "start",
    t.arrowTypeStart,
    r,
    i,
    s,
    o,
    n
  ), t.arrowTypeEnd && Jd(e, "end", t.arrowTypeEnd, r, i, s, o, n);
}, "addEdgeMarkers"), RB = {
  arrow_cross: { type: "cross", fill: !1 },
  arrow_point: { type: "point", fill: !0 },
  arrow_barb: { type: "barb", fill: !0 },
  arrow_barb_neo: { type: "barb", fill: !0 },
  arrow_circle: { type: "circle", fill: !1 },
  aggregation: { type: "aggregation", fill: !1 },
  extension: { type: "extension", fill: !1 },
  composition: { type: "composition", fill: !0 },
  dependency: { type: "dependency", fill: !0 },
  lollipop: { type: "lollipop", fill: !1 },
  only_one: { type: "onlyOne", fill: !1 },
  zero_or_one: { type: "zeroOrOne", fill: !1 },
  one_or_more: { type: "oneOrMore", fill: !1 },
  zero_or_more: { type: "zeroOrMore", fill: !1 },
  requirement_arrow: { type: "requirement_arrow", fill: !1 },
  requirement_contains: { type: "requirement_contains", fill: !1 }
}, NB = [
  "cross",
  "point",
  "circle",
  "lollipop",
  "aggregation",
  "extension",
  "composition",
  "dependency",
  "barb"
], Jd = /* @__PURE__ */ p((e, t, r, i, s, o, n = !1, a) => {
  if (!r || r === "none")
    return;
  const l = RB[r], c = l && NB.includes(l.type);
  if (!l) {
    q.warn(`Unknown arrow type: ${r}`);
    return;
  }
  const h = l.type, f = `${s}_${o}-${h}${t === "start" ? "Start" : "End"}${n && c ? "-margin" : ""}`;
  if (a && a.trim() !== "") {
    const m = a.replace(/[^\dA-Za-z]/g, "_"), y = `${f}_${m}`;
    if (!document.getElementById(y)) {
      const x = document.getElementById(f);
      if (x) {
        const C = x.cloneNode(!0);
        C.id = y, C.querySelectorAll("path, circle, line").forEach((w) => {
          w.setAttribute("stroke", a), l.fill && w.setAttribute("fill", a);
        }), x.parentNode?.appendChild(C);
      }
    }
    e.attr(`marker-${t}`, `url(${i}#${y})`);
  } else
    e.attr(`marker-${t}`, `url(${i}#${f})`);
}, "addEdgeMarker"), qB = /* @__PURE__ */ p((e) => typeof e == "string" ? e : Ot()?.flowchart?.curve, "resolveEdgeCurveType"), gs = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), WB = /* @__PURE__ */ p(() => {
  gs.clear(), te.clear();
}, "clear"), T0 = /* @__PURE__ */ p((e) => !!(e.label || e.startLabelLeft || e.startLabelRight || e.endLabelLeft || e.endLabelRight), "hasEdgeLabel"), Rs = /* @__PURE__ */ p((e) => e ? typeof e == "string" ? e : e.reduce((t, r) => t + ";" + r, "") : "", "getLabelStyles"), xc = /* @__PURE__ */ p(async (e, t) => {
  const r = Ot();
  let i = ye(r);
  const { labelStyles: s } = gt(t);
  t.labelStyle = s;
  const o = e.insert("g").attr("class", "edgeLabel"), n = o.insert("g").attr("class", "label").attr("data-id", t.id), a = t.labelType === "markdown", c = await rr(
    e,
    t.label,
    {
      style: Rs(t.labelStyle),
      useHtmlLabels: i,
      addSvgBackground: !0,
      isNode: !1,
      markdown: a,
      // Plain text edge labels should auto-wrap, markdown edge labels respect markdownAutoWrap config
      width: a ? void 0 : void 0
    },
    r
  );
  n.node().appendChild(c), q.info("abc82", t, t.labelType);
  let h, u;
  if (i) {
    const f = c.children[0], m = Et(c);
    h = await bi.measure(() => f.getBoundingClientRect()), u = h, m.attr("width", h.width), m.attr("height", h.height);
  } else {
    const f = Et(c).select("text").node();
    await bi.measure(() => {
      h = c.getBBox(), f && typeof f.getBBox == "function" ? u = f.getBBox() : u = h;
    });
  }
  n.attr("transform", Ps(u, i)), gs.set(t.id, o), t.width = h.width, t.height = h.height;
  let d;
  if (t.startLabelLeft) {
    const f = e.insert("g").attr("class", "edgeTerminals"), m = f.insert("g").attr("class", "inner"), y = await Xr(
      m,
      t.startLabelLeft,
      Rs(t.labelStyle) || "",
      !1,
      !1
    );
    d = y;
    let x = y.getBBox();
    if (i) {
      const C = y.children[0], b = Et(y);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    m.attr("transform", Ps(x, i)), te.get(t.id) || te.set(t.id, {}), te.get(t.id).startLeft = f, Vs(d, t.startLabelLeft);
  }
  if (t.startLabelRight) {
    const f = e.insert("g").attr("class", "edgeTerminals"), m = f.insert("g").attr("class", "inner"), y = await Xr(
      m,
      t.startLabelRight,
      Rs(t.labelStyle) || "",
      !1,
      !1
    );
    d = y;
    let x = y.getBBox();
    if (i) {
      const C = y.children[0], b = Et(y);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    m.attr("transform", Ps(x, i)), te.get(t.id) || te.set(t.id, {}), te.get(t.id).startRight = f, Vs(d, t.startLabelRight);
  }
  if (t.endLabelLeft) {
    const f = e.insert("g").attr("class", "edgeTerminals"), m = f.insert("g").attr("class", "inner"), y = await Xr(
      f,
      t.endLabelLeft,
      Rs(t.labelStyle) || "",
      !1,
      !1
    );
    d = y;
    let x = y.getBBox();
    if (i) {
      const C = y.children[0], b = Et(y);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    m.attr("transform", Ps(x, i)), te.get(t.id) || te.set(t.id, {}), te.get(t.id).endLeft = f, Vs(d, t.endLabelLeft);
  }
  if (t.endLabelRight) {
    const f = e.insert("g").attr("class", "edgeTerminals"), m = f.insert("g").attr("class", "inner"), y = await Xr(
      f,
      t.endLabelRight,
      Rs(t.labelStyle) || "",
      !1,
      !1
    );
    d = y;
    let x = y.getBBox();
    if (i) {
      const C = y.children[0], b = Et(y);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    m.attr("transform", Ps(x, i)), te.get(t.id) || te.set(t.id, {}), te.get(t.id).endRight = f, Vs(d, t.endLabelRight);
  }
  return c;
}, "insertEdgeLabel");
function Vs(e, t) {
  ye(Ot()) && e && (e.style.width = t.length * 9 + "px", e.style.height = "12px");
}
p(Vs, "setTerminalWidth");
var zB = /* @__PURE__ */ p((e, t) => {
  q.debug("Moving label abc88 ", e.id, e.label, gs.get(e.id), t);
  let r = t.updatedPath ? t.updatedPath : t.originalPath;
  const i = Ot(), { subGraphTitleTotalMargin: s } = ia(i);
  if (e.label) {
    const o = gs.get(e.id);
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcLabelPosition(r);
      q.debug(
        "Moving label " + e.label + " from (",
        n,
        ",",
        a,
        ") to (",
        l.x,
        ",",
        l.y,
        ") abc88"
      ), t.updatedPath && (n = l.x, a = l.y);
    }
    o.attr("transform", `translate(${n}, ${a + s / 2})`);
  }
  if (e.startLabelLeft) {
    const o = te.get(e.id).startLeft;
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", r);
      n = l.x, a = l.y;
    }
    o.attr("transform", `translate(${n}, ${a})`);
  }
  if (e.startLabelRight) {
    const o = te.get(e.id).startRight;
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(
        e.arrowTypeStart ? 10 : 0,
        "start_right",
        r
      );
      n = l.x, a = l.y;
    }
    o.attr("transform", `translate(${n}, ${a})`);
  }
  if (e.endLabelLeft) {
    const o = te.get(e.id).endLeft;
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", r);
      n = l.x, a = l.y;
    }
    o.attr("transform", `translate(${n}, ${a})`);
  }
  if (e.endLabelRight) {
    const o = te.get(e.id).endRight;
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", r);
      n = l.x, a = l.y;
    }
    o.attr("transform", `translate(${n}, ${a})`);
  }
}, "positionEdgeLabel"), HB = /* @__PURE__ */ p((e, t) => {
  if (!e?.isLabelEdge || !e?.id?.endsWith("-to-label") || !Array.isArray(t) || t.length !== 2)
    return t;
  const [r, i] = t, s = Math.abs(i.x - r.x), o = Math.abs(i.y - r.y);
  return s < 1e-3 || o < 1e-3 ? t : o >= s ? [r, { x: r.x, y: i.y }, i] : [r, { x: i.x, y: r.y }, i];
}, "orthogonalizeToLabelClippedPoints"), YB = /* @__PURE__ */ p((e, t) => {
  const r = e.x, i = e.y, s = Math.abs(t.x - r), o = Math.abs(t.y - i), n = e.width / 2, a = e.height / 2;
  return s >= n || o >= a;
}, "outsideNode"), UB = /* @__PURE__ */ p((e, t, r) => {
  q.debug(`intersection calc abc89:
  outsidePoint: ${JSON.stringify(t)}
  insidePoint : ${JSON.stringify(r)}
  node        : x:${e.x} y:${e.y} w:${e.width} h:${e.height}`);
  const i = e.x, s = e.y, o = Math.abs(i - r.x), n = e.width / 2;
  let a = r.x < t.x ? n - o : n + o;
  const l = e.height / 2, c = Math.abs(t.y - r.y), h = Math.abs(t.x - r.x);
  if (Math.abs(s - t.y) * n > Math.abs(i - t.x) * l) {
    let u = r.y < t.y ? t.y - l - s : s - l - t.y;
    a = h * u / c;
    const d = {
      x: r.x < t.x ? r.x + a : r.x - h + a,
      y: r.y < t.y ? r.y + c - u : r.y - c + u
    };
    return a === 0 && (d.x = t.x, d.y = t.y), h === 0 && (d.x = t.x), c === 0 && (d.y = t.y), q.debug(`abc89 top/bottom calc, Q ${c}, q ${u}, R ${h}, r ${a}`, d), d;
  } else {
    r.x < t.x ? a = t.x - n - i : a = i - n - t.x;
    let u = c * a / h, d = r.x < t.x ? r.x + h - a : r.x - h + a, f = r.y < t.y ? r.y + u : r.y - u;
    return q.debug(`sides calc abc89, Q ${c}, q ${u}, R ${h}, r ${a}`, { _x: d, _y: f }), a === 0 && (d = t.x, f = t.y), h === 0 && (d = t.x), c === 0 && (f = t.y), { x: d, y: f };
  }
}, "intersection"), tf = /* @__PURE__ */ p((e, t) => {
  q.warn("abc88 cutPathAtIntersect", e, t);
  let r = [], i = e[0], s = !1;
  return e.forEach((o) => {
    if (q.info("abc88 checking point", o, t), !YB(t, o) && !s) {
      const n = UB(t, i, o);
      q.debug("abc88 inside", o, i, n), q.debug("abc88 intersection", n, t);
      let a = !1;
      r.forEach((l) => {
        a = a || l.x === n.x && l.y === n.y;
      }), r.some((l) => l.x === n.x && l.y === n.y) ? q.warn("abc88 no intersect", n, r) : r.push(n), s = !0;
    } else
      q.warn("abc88 outside", o, i), i = o, s || r.push(o);
  }), q.debug("returning points", r), r;
}, "cutPathAtIntersect");
function _0(e) {
  const t = [], r = [];
  for (let i = 1; i < e.length - 1; i++) {
    const s = e[i - 1], o = e[i], n = e[i + 1];
    (s.x === o.x && o.y === n.y && Math.abs(o.x - n.x) > 5 && Math.abs(o.y - s.y) > 5 || s.y === o.y && o.x === n.x && Math.abs(o.x - s.x) > 5 && Math.abs(o.y - n.y) > 5) && (t.push(o), r.push(i));
  }
  return { cornerPoints: t, cornerPointPositions: r };
}
p(_0, "extractCornerPoints");
var ef = /* @__PURE__ */ p(function(e, t, r) {
  const i = t.x - e.x, s = t.y - e.y, o = Math.sqrt(i * i + s * s), n = r / o;
  return { x: t.x - n * i, y: t.y - n * s };
}, "findAdjacentPoint"), jB = /* @__PURE__ */ p(function(e) {
  const { cornerPointPositions: t } = _0(e), r = [];
  for (let i = 0; i < e.length; i++)
    if (t.includes(i)) {
      const s = e[i - 1], o = e[i + 1], n = e[i], a = ef(s, n, 5), l = ef(o, n, 5), c = l.x - a.x, h = l.y - a.y;
      r.push(a);
      const u = Math.sqrt(2) * 2;
      let d = { x: n.x, y: n.y };
      if (Math.abs(o.x - s.x) > 10 && Math.abs(o.y - s.y) >= 10) {
        q.debug(
          "Corner point fixing",
          Math.abs(o.x - s.x),
          Math.abs(o.y - s.y)
        );
        const f = 5;
        n.x === a.x ? d = {
          x: c < 0 ? a.x - f + u : a.x + f - u,
          y: h < 0 ? a.y - u : a.y + u
        } : d = {
          x: c < 0 ? a.x - u : a.x + u,
          y: h < 0 ? a.y - f + u : a.y + f - u
        };
      } else
        q.debug(
          "Corner point skipping fixing",
          Math.abs(o.x - s.x),
          Math.abs(o.y - s.y)
        );
      r.push(d, l);
    } else
      r.push(e[i]);
  return r;
}, "fixCorners"), XB = /* @__PURE__ */ p((e, t, r) => {
  const i = e - t - r, s = 2, o = 2, n = s + o, a = Math.floor(i / n), l = Number.isFinite(a) ? Math.max(0, a) : 0, c = Array(l).fill(`${s} ${o}`).join(" ");
  return `0 ${t} ${c} ${r}`;
}, "generateDashArray"), v0 = /* @__PURE__ */ p(function(e, t, r, i, s, o, n, a = !1) {
  if (!n)
    throw new Error(
      `insertEdge: missing diagramId for edge "${t.id}" — edge IDs require a diagram prefix for uniqueness`
    );
  const { handDrawnSeed: l, layout: c } = Ot();
  let h = t.points, u = !1;
  const d = s;
  var f = o;
  const m = [];
  for (const F in t.cssCompiledStyles)
    Jg(F) || m.push(t.cssCompiledStyles[F]);
  if (c === "swimlane") {
    if (f.intersect && d.intersect && Array.isArray(h) && h.length >= 2)
      if (h.length === 2)
        h = [d.intersect(h[0]), f.intersect(h[1])];
      else {
        const F = h.slice(1, -1), Q = F[0], Z = F[F.length - 1], dt = 0.5, wt = Math.abs(h[h.length - 1].x - Z.x) < dt && Math.abs(h[h.length - 1].y - Z.y) < dt, yt = d.intersect(Q), at = wt ? Z : f.intersect(Z), kt = Math.abs(at.x - Z.x) < dt && Math.abs(at.y - Z.y) < dt, _t = Math.abs(yt.x - Q.x) < dt && Math.abs(yt.y - Q.y) < dt ? [] : [yt], Mt = kt ? [] : [at];
        h = [..._t, ...F, ...Mt];
      }
    h = HB(t, h);
  } else f.intersect && d.intersect && !a && (h = h.slice(1, t.points.length - 1), h.unshift(d.intersect(h[0])), h.push(f.intersect(h[h.length - 1])));
  const y = btoa(JSON.stringify(h));
  t.toCluster && (q.info("to cluster abc88", r.get(t.toCluster)), h = tf(t.points, r.get(t.toCluster).node), u = !0), t.fromCluster && (q.debug(
    "from cluster abc88",
    r.get(t.fromCluster),
    JSON.stringify(h, null, 2)
  ), h = tf(h.reverse(), r.get(t.fromCluster).node).reverse(), u = !0);
  let x = h.filter((F) => !Number.isNaN(F.y));
  const C = qB(t.curve);
  C !== "rounded" && (x = jB(x));
  let b = ro;
  switch (C) {
    case "linear":
      b = ro;
      break;
    case "basis":
      b = Ul;
      break;
    case "cardinal":
      b = Rg;
      break;
    case "bumpX":
      b = $g;
      break;
    case "bumpY":
      b = Og;
      break;
    case "catmullRom":
      b = qg;
      break;
    case "monotoneX":
      b = jg;
      break;
    case "monotoneY":
      b = Xg;
      break;
    case "natural":
      b = Vg;
      break;
    case "step":
      b = Kg;
      break;
    case "stepAfter":
      b = Qg;
      break;
    case "stepBefore":
      b = Zg;
      break;
    case "rounded":
      b = ro;
      break;
    default:
      b = Ul;
  }
  const { x: w, y: _ } = DB(t), v = lT().x(w).y(_).curve(b);
  let E;
  switch (t.thickness) {
    case "normal":
      E = "edge-thickness-normal";
      break;
    case "thick":
      E = "edge-thickness-thick";
      break;
    case "invisible":
      E = "edge-thickness-invisible";
      break;
    default:
      E = "edge-thickness-normal";
  }
  switch (t.pattern) {
    case "solid":
      E += " edge-pattern-solid";
      break;
    case "dotted":
      E += " edge-pattern-dotted";
      break;
    case "dashed":
      E += " edge-pattern-dashed";
      break;
    default:
      E += " edge-pattern-solid";
  }
  let A, L = C === "rounded" ? B0(L0(x, t), 5) : v(x);
  const z = Array.isArray(t.style) ? t.style : [t.style];
  let W = z.find((F) => F?.startsWith("stroke:")), R = "";
  t.animate && (R = "edge-animation-fast"), t.animation && (R = "edge-animation-" + t.animation);
  let st = !1;
  if (t.look === "handDrawn") {
    const F = ft.svg(e);
    Object.assign([], x);
    const Q = F.path(L, {
      roughness: 0.3,
      seed: l
    });
    E += " transition", A = Et(Q).select("path").attr("id", `${n}-${t.id}`).attr(
      "class",
      " " + E + (t.classes ? " " + t.classes : "") + (R ? " " + R : "")
    ).attr("style", z ? z.reduce((dt, wt) => dt + ";" + wt, "") : "");
    let Z = A.attr("d");
    A.attr("d", Z), e.node().appendChild(A.node());
  } else {
    const F = m.join(";"), Q = z ? z.reduce((kt, mt) => kt + mt + ";", "") : "", Z = (F ? F + ";" + Q + ";" : Q) + ";" + (z ? z.reduce((kt, mt) => kt + ";" + mt, "") : "");
    A = e.append("path").attr("d", L).attr("id", `${n}-${t.id}`).attr(
      "class",
      " " + E + (t.classes ? " " + t.classes : "") + (R ? " " + R : "")
    ).attr("style", Z), W = Z.match(/stroke:([^;]+)/)?.[1], st = t.animate === !0 || !!t.animation || F.includes("animation");
    const dt = A.node(), wt = typeof dt.getTotalLength == "function" ? dt.getTotalLength() : 0, yt = Qd[t.arrowTypeStart] || 0, at = Qd[t.arrowTypeEnd] || 0;
    if (t.look === "neo" && !st) {
      const mt = `stroke-dasharray: ${t.pattern === "dotted" || t.pattern === "dashed" ? XB(wt, yt, at) : `0 ${yt} ${wt - yt - at} ${at}`}; stroke-dashoffset: 0;`;
      A.attr("style", mt + A.attr("style"));
    }
  }
  A.attr("data-edge", !0), A.attr("data-et", "edge"), A.attr("data-id", t.id), A.attr("data-points", y), A.attr("data-look", re(t.look)), t.showPoints && x.forEach((F) => {
    e.append("circle").style("stroke", "red").style("fill", "red").attr("r", 1).attr("cx", F.x).attr("cy", F.y);
  });
  let j = "";
  (Ot().flowchart.arrowMarkerAbsolute || Ot().state.arrowMarkerAbsolute) && (j = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, j = j.replace(/\(/g, "\\(").replace(/\)/g, "\\)")), q.info("arrowTypeStart", t.arrowTypeStart), q.info("arrowTypeEnd", t.arrowTypeEnd);
  const O = !st && t?.look === "neo";
  PB(A, t, j, n, i, O, W);
  const I = Math.floor(h.length / 2), B = h[I];
  me.isLabelCoordinateInPath(B, A.attr("d")) || (u = !0);
  let M = {};
  return u && (M.updatedPath = h), M.originalPath = t.points, M;
}, "insertEdge");
function B0(e, t) {
  if (e.length < 2)
    return "";
  let r = "";
  const i = e.length, s = 1e-5;
  for (let o = 0; o < i; o++) {
    const n = e[o], a = e[o - 1], l = e[o + 1];
    if (o === 0)
      r += `M${n.x},${n.y}`;
    else if (o === i - 1)
      r += `L${n.x},${n.y}`;
    else {
      const c = n.x - a.x, h = n.y - a.y, u = l.x - n.x, d = l.y - n.y, f = Math.hypot(c, h), m = Math.hypot(u, d);
      if (f < s || m < s) {
        r += `L${n.x},${n.y}`;
        continue;
      }
      const y = c / f, x = h / f, C = u / m, b = d / m, w = y * C + x * b, _ = Math.max(-1, Math.min(1, w)), v = Math.acos(_);
      if (v < s || Math.abs(Math.PI - v) < s) {
        r += `L${n.x},${n.y}`;
        continue;
      }
      const E = Math.min(t / Math.sin(v / 2), f / 2, m / 2), A = n.x - y * E, L = n.y - x * E, z = n.x + C * E, W = n.y + b * E;
      r += `L${A},${L}`, r += `Q${n.x},${n.y} ${z},${W}`;
    }
  }
  return r;
}
p(B0, "generateRoundedPath");
function ah(e, t) {
  if (!e || !t)
    return { angle: 0, deltaX: 0, deltaY: 0 };
  const r = t.x - e.x, i = t.y - e.y;
  return { angle: Math.atan2(i, r), deltaX: r, deltaY: i };
}
p(ah, "calculateDeltaAndAngle");
function L0(e, t) {
  const r = e.map((s) => ({ ...s }));
  if (e.length >= 2 && ge[t.arrowTypeStart]) {
    const s = ge[t.arrowTypeStart], o = e[0], n = e[1], { angle: a } = ah(o, n), l = s * Math.cos(a), c = s * Math.sin(a);
    r[0].x = o.x + l, r[0].y = o.y + c;
  }
  const i = e.length;
  if (i >= 2 && ge[t.arrowTypeEnd]) {
    const s = ge[t.arrowTypeEnd], o = e[i - 1], n = e[i - 2], { angle: a } = ah(n, o), l = s * Math.cos(a), c = s * Math.sin(a);
    r[i - 1].x = o.x - l, r[i - 1].y = o.y - c;
  }
  return r;
}
p(L0, "applyMarkerOffsetsToPoints");
var GB = /* @__PURE__ */ p((e, t, r, i) => {
  t.forEach((s) => {
    yL[s](e, r, i);
  });
}, "insertMarkers"), VB = /* @__PURE__ */ p((e, t, r) => {
  q.trace("Making markers for ", r), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionStart").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,7 L18,13 V 1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionEnd").attr("class", "marker extension " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,1 V 13 L18,7 Z"), e.append("marker").attr("id", r + "_" + t + "-extensionStart-margin").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,7 18,13 18,1").style("stroke-width", 2).style("stroke-dasharray", "0"), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionEnd-margin").attr("class", "marker extension " + t).attr("refX", 9).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,1 10,13 18,7").style("stroke-width", 2).style("stroke-dasharray", "0");
}, "extension"), KB = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionStart").attr("class", "marker composition " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionEnd").attr("class", "marker composition " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionStart-margin").attr("class", "marker composition " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("viewBox", "0 0 15 15").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionEnd-margin").attr("class", "marker composition " + t).attr("refX", 3.5).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "composition"), ZB = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationStart").attr("class", "marker aggregation " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationEnd").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationStart-margin").attr("class", "marker aggregation " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationEnd-margin").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "aggregation"), QB = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyStart").attr("class", "marker dependency " + t).attr("refX", 6).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyEnd").attr("class", "marker dependency " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyStart-margin").attr("class", "marker dependency " + t).attr("refX", 4).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyEnd-margin").attr("class", "marker dependency " + t).attr("refX", 16).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
}, "dependency"), JB = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopStart").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopEnd").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopStart-margin").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopEnd-margin").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2);
}, "lollipop"), tL = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-pointEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 4.5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 5 L 10 10 L 10 0 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 11.5).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 10.5).attr("markerHeight", 14).attr("orient", "auto").append("path").attr("d", "M 0 0 L 11.5 7 L 0 14 z").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 1).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11.5).attr("markerHeight", 14).attr("orient", "auto").append("polygon").attr("points", "0,7 11.5,14 11.5,0").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "point"), eL = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-circleEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 11).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -1).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refY", 5).attr("refX", 12.25).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -2).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "circle"), rL = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-crossEnd").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", 12).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-crossStart").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", -1).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-crossEnd-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", 17.7).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5), e.append("marker").attr("id", r + "_" + t + "-crossStart-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", -3.5).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5).style("stroke-dasharray", "1,0");
}, "cross"), iL = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
}, "barb"), sL = /* @__PURE__ */ p((e, t, r) => {
  const i = Kt(), { themeVariables: s } = i, { transitionColor: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "strokeWidth").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd-margin").attr("refX", 17).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z").attr("fill", `${o}`);
}, "barbNeo"), oL = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18"), e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18");
}, "only_one"), nL = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
  i.append("circle").attr("fill", "white").attr("cx", 21).attr("cy", 9).attr("r", 6), i.append("path").attr("d", "M9,0 L9,18");
  const s = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
  s.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 9).attr("r", 6), s.append("path").attr("d", "M21,0 L21,18");
}, "zero_or_one"), aL = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27"), e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18");
}, "one_or_more"), lL = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
  i.append("circle").attr("fill", "white").attr("cx", 48).attr("cy", 18).attr("r", 6), i.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18");
  const s = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
  s.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 18).attr("r", 6), s.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18");
}, "zero_or_more"), hL = /* @__PURE__ */ p((e, t, r) => {
  const i = Kt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18").attr("stroke-width", `${o}`), e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18").attr("stroke-width", `${o}`);
}, "only_one_neo"), cL = /* @__PURE__ */ p((e, t, r) => {
  const i = Kt(), { themeVariables: s } = i, { strokeWidth: o, mainBkg: n } = s, a = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
  a.append("circle").attr("fill", n ?? "white").attr("cx", 21).attr("cy", 9).attr("stroke-width", `${o}`).attr("r", 6), a.append("path").attr("d", "M9,0 L9,18").attr("stroke-width", `${o}`);
  const l = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
  l.append("circle").attr("fill", n ?? "white").attr("cx", 9).attr("cy", 9).attr("stroke-width", `${o}`).attr("r", 6), l.append("path").attr("d", "M21,0 L21,18").attr("stroke-width", `${o}`);
}, "zero_or_one_neo"), uL = /* @__PURE__ */ p((e, t, r) => {
  const i = Kt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27").attr("stroke-width", `${o}`), e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18").attr("stroke-width", `${o}`);
}, "one_or_more_neo"), dL = /* @__PURE__ */ p((e, t, r) => {
  const i = Kt(), { themeVariables: s } = i, { strokeWidth: o, mainBkg: n } = s, a = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
  a.append("circle").attr("fill", n ?? "white").attr("cx", 45.5).attr("cy", 18).attr("r", 6).attr("stroke-width", `${o}`), a.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18").attr("stroke-width", `${o}`);
  const l = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
  l.append("circle").attr("fill", n ?? "white").attr("cx", 11).attr("cy", 18).attr("r", 6).attr("stroke-width", `${o}`), l.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18").attr("stroke-width", `${o}`);
}, "zero_or_more_neo"), fL = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("path").attr(
    "d",
    `M0,0
      L20,10
      M20,10
      L0,20`
  );
}, "requirement_arrow"), pL = /* @__PURE__ */ p((e, t, r) => {
  const i = Kt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("stroke-width", `${o}`).attr("viewBox", "0 0 25 20").append("path").attr(
    "d",
    `M0,0
      L20,10
      M20,10
      L0,20`
  ).attr("stroke-linejoin", "miter");
}, "requirement_arrow_neo"), gL = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("g");
  i.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), i.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), i.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10);
}, "requirement_contains"), mL = /* @__PURE__ */ p((e, t, r) => {
  const i = Kt(), { themeVariables: s } = i, { strokeWidth: o } = s, n = e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("g");
  n.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), n.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), n.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10), n.selectAll("*").attr("stroke-width", `${o}`);
}, "requirement_contains_neo"), yL = {
  extension: VB,
  composition: KB,
  aggregation: ZB,
  dependency: QB,
  lollipop: JB,
  point: tL,
  circle: eL,
  cross: rL,
  barb: iL,
  barbNeo: sL,
  only_one: oL,
  zero_or_one: nL,
  one_or_more: aL,
  zero_or_more: lL,
  only_one_neo: hL,
  zero_or_one_neo: cL,
  one_or_more_neo: uL,
  zero_or_more_neo: dL,
  requirement_arrow: fL,
  requirement_contains: gL,
  requirement_arrow_neo: pL,
  requirement_contains_neo: mL
}, A0 = GB, E0 = typeof global == "object" && global && global.Object === Object && global, xL = typeof self == "object" && self && self.Object === Object && self, Ir = E0 || xL || Function("return this")(), gr = Ir.Symbol, F0 = Object.prototype, CL = F0.hasOwnProperty, bL = F0.toString, Ns = gr ? gr.toStringTag : void 0;
function kL(e) {
  var t = CL.call(e, Ns), r = e[Ns];
  try {
    e[Ns] = void 0;
    var i = !0;
  } catch {
  }
  var s = bL.call(e);
  return i && (t ? e[Ns] = r : delete e[Ns]), s;
}
var wL = Object.prototype, SL = wL.toString;
function TL(e) {
  return SL.call(e);
}
var _L = "[object Null]", vL = "[object Undefined]", rf = gr ? gr.toStringTag : void 0;
function ks(e) {
  return e == null ? e === void 0 ? vL : _L : rf && rf in Object(e) ? kL(e) : TL(e);
}
function ki(e) {
  return e != null && typeof e == "object";
}
var BL = "[object Symbol]";
function Cc(e) {
  return typeof e == "symbol" || ki(e) && ks(e) == BL;
}
function M0(e, t) {
  for (var r = -1, i = e == null ? 0 : e.length, s = Array(i); ++r < i; )
    s[r] = t(e[r], r, e);
  return s;
}
var Me = Array.isArray, sf = gr ? gr.prototype : void 0, of = sf ? sf.toString : void 0;
function $0(e) {
  if (typeof e == "string")
    return e;
  if (Me(e))
    return M0(e, $0) + "";
  if (Cc(e))
    return of ? of.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function bc(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
function oa(e) {
  return e;
}
var LL = "[object AsyncFunction]", AL = "[object Function]", EL = "[object GeneratorFunction]", FL = "[object Proxy]";
function Rn(e) {
  if (!bc(e))
    return !1;
  var t = ks(e);
  return t == AL || t == EL || t == LL || t == FL;
}
var Xa = Ir["__core-js_shared__"], nf = (function() {
  var e = /[^.]+$/.exec(Xa && Xa.keys && Xa.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
})();
function ML(e) {
  return !!nf && nf in e;
}
var $L = Function.prototype, OL = $L.toString;
function Bi(e) {
  if (e != null) {
    try {
      return OL.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var IL = /[\\^$.*+?()[\]{}|]/g, DL = /^\[object .+?Constructor\]$/, PL = Function.prototype, RL = Object.prototype, NL = PL.toString, qL = RL.hasOwnProperty, WL = RegExp(
  "^" + NL.call(qL).replace(IL, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function zL(e) {
  if (!bc(e) || ML(e))
    return !1;
  var t = Rn(e) ? WL : DL;
  return t.test(Bi(e));
}
function HL(e, t) {
  return e?.[t];
}
function Li(e, t) {
  var r = HL(e, t);
  return zL(r) ? r : void 0;
}
var lh = Li(Ir, "WeakMap");
function YL(e, t, r) {
  switch (r.length) {
    case 0:
      return e.call(t);
    case 1:
      return e.call(t, r[0]);
    case 2:
      return e.call(t, r[0], r[1]);
    case 3:
      return e.call(t, r[0], r[1], r[2]);
  }
  return e.apply(t, r);
}
function UL() {
}
var jL = 800, XL = 16, GL = Date.now;
function VL(e) {
  var t = 0, r = 0;
  return function() {
    var i = GL(), s = XL - (i - r);
    if (r = i, s > 0) {
      if (++t >= jL)
        return arguments[0];
    } else
      t = 0;
    return e.apply(void 0, arguments);
  };
}
function Ks(e) {
  return function() {
    return e;
  };
}
var af = (function() {
  try {
    var e = Li(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
})(), KL = af ? function(e, t) {
  return af(e, "toString", {
    configurable: !0,
    enumerable: !1,
    value: Ks(t),
    writable: !0
  });
} : oa, ZL = VL(KL);
function QL(e, t) {
  for (var r = -1, i = e == null ? 0 : e.length; ++r < i && t(e[r], r, e) !== !1; )
    ;
  return e;
}
function JL(e, t, r, i) {
  for (var s = e.length, o = r + -1; ++o < s; )
    if (t(e[o], o, e))
      return o;
  return -1;
}
function tA(e) {
  return e !== e;
}
function eA(e, t, r) {
  for (var i = r - 1, s = e.length; ++i < s; )
    if (e[i] === t)
      return i;
  return -1;
}
function rA(e, t, r) {
  return t === t ? eA(e, t, r) : JL(e, tA, r);
}
function iA(e, t) {
  var r = e == null ? 0 : e.length;
  return !!r && rA(e, t, 0) > -1;
}
var sA = 9007199254740991, oA = /^(?:0|[1-9]\d*)$/;
function O0(e, t) {
  var r = typeof e;
  return t = t ?? sA, !!t && (r == "number" || r != "symbol" && oA.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function I0(e, t) {
  return e === t || e !== e && t !== t;
}
var lf = Math.max;
function nA(e, t, r) {
  return t = lf(t === void 0 ? e.length - 1 : t, 0), function() {
    for (var i = arguments, s = -1, o = lf(i.length - t, 0), n = Array(o); ++s < o; )
      n[s] = i[t + s];
    s = -1;
    for (var a = Array(t + 1); ++s < t; )
      a[s] = i[s];
    return a[t] = r(n), YL(e, this, a);
  };
}
function aA(e, t) {
  return ZL(nA(e, t, oa), e + "");
}
var lA = 9007199254740991;
function kc(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= lA;
}
function na(e) {
  return e != null && kc(e.length) && !Rn(e);
}
var hA = Object.prototype;
function D0(e) {
  var t = e && e.constructor, r = typeof t == "function" && t.prototype || hA;
  return e === r;
}
function cA(e, t) {
  for (var r = -1, i = Array(e); ++r < e; )
    i[r] = t(r);
  return i;
}
var uA = "[object Arguments]";
function hf(e) {
  return ki(e) && ks(e) == uA;
}
var P0 = Object.prototype, dA = P0.hasOwnProperty, fA = P0.propertyIsEnumerable, aa = hf(/* @__PURE__ */ (function() {
  return arguments;
})()) ? hf : function(e) {
  return ki(e) && dA.call(e, "callee") && !fA.call(e, "callee");
};
function pA() {
  return !1;
}
var R0 = typeof exports == "object" && exports && !exports.nodeType && exports, cf = R0 && typeof module == "object" && module && !module.nodeType && module, gA = cf && cf.exports === R0, uf = gA ? Ir.Buffer : void 0, mA = uf ? uf.isBuffer : void 0, Nn = mA || pA, yA = "[object Arguments]", xA = "[object Array]", CA = "[object Boolean]", bA = "[object Date]", kA = "[object Error]", wA = "[object Function]", SA = "[object Map]", TA = "[object Number]", _A = "[object Object]", vA = "[object RegExp]", BA = "[object Set]", LA = "[object String]", AA = "[object WeakMap]", EA = "[object ArrayBuffer]", FA = "[object DataView]", MA = "[object Float32Array]", $A = "[object Float64Array]", OA = "[object Int8Array]", IA = "[object Int16Array]", DA = "[object Int32Array]", PA = "[object Uint8Array]", RA = "[object Uint8ClampedArray]", NA = "[object Uint16Array]", qA = "[object Uint32Array]", Gt = {};
Gt[MA] = Gt[$A] = Gt[OA] = Gt[IA] = Gt[DA] = Gt[PA] = Gt[RA] = Gt[NA] = Gt[qA] = !0;
Gt[yA] = Gt[xA] = Gt[EA] = Gt[CA] = Gt[FA] = Gt[bA] = Gt[kA] = Gt[wA] = Gt[SA] = Gt[TA] = Gt[_A] = Gt[vA] = Gt[BA] = Gt[LA] = Gt[AA] = !1;
function WA(e) {
  return ki(e) && kc(e.length) && !!Gt[ks(e)];
}
function zA(e) {
  return function(t) {
    return e(t);
  };
}
var N0 = typeof exports == "object" && exports && !exports.nodeType && exports, so = N0 && typeof module == "object" && module && !module.nodeType && module, HA = so && so.exports === N0, Ga = HA && E0.process, df = (function() {
  try {
    var e = so && so.require && so.require("util").types;
    return e || Ga && Ga.binding && Ga.binding("util");
  } catch {
  }
})(), ff = df && df.isTypedArray, wc = ff ? zA(ff) : WA, YA = Object.prototype, UA = YA.hasOwnProperty;
function jA(e, t) {
  var r = Me(e), i = !r && aa(e), s = !r && !i && Nn(e), o = !r && !i && !s && wc(e), n = r || i || s || o, a = n ? cA(e.length, String) : [], l = a.length;
  for (var c in e)
    (t || UA.call(e, c)) && !(n && // Safari 9 has enumerable `arguments.length` in strict mode.
    (c == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    s && (c == "offset" || c == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    o && (c == "buffer" || c == "byteLength" || c == "byteOffset") || // Skip index properties.
    O0(c, l))) && a.push(c);
  return a;
}
function XA(e, t) {
  return function(r) {
    return e(t(r));
  };
}
var GA = XA(Object.keys, Object), VA = Object.prototype, KA = VA.hasOwnProperty;
function q0(e) {
  if (!D0(e))
    return GA(e);
  var t = [];
  for (var r in Object(e))
    KA.call(e, r) && r != "constructor" && t.push(r);
  return t;
}
function ur(e) {
  return na(e) ? jA(e) : q0(e);
}
var ZA = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, QA = /^\w*$/;
function Sc(e, t) {
  if (Me(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || Cc(e) ? !0 : QA.test(e) || !ZA.test(e) || t != null && e in Object(t);
}
var fo = Li(Object, "create");
function JA() {
  this.__data__ = fo ? fo(null) : {}, this.size = 0;
}
function tE(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var eE = "__lodash_hash_undefined__", rE = Object.prototype, iE = rE.hasOwnProperty;
function sE(e) {
  var t = this.__data__;
  if (fo) {
    var r = t[e];
    return r === eE ? void 0 : r;
  }
  return iE.call(t, e) ? t[e] : void 0;
}
var oE = Object.prototype, nE = oE.hasOwnProperty;
function aE(e) {
  var t = this.__data__;
  return fo ? t[e] !== void 0 : nE.call(t, e);
}
var lE = "__lodash_hash_undefined__";
function hE(e, t) {
  var r = this.__data__;
  return this.size += this.has(e) ? 0 : 1, r[e] = fo && t === void 0 ? lE : t, this;
}
function wi(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var i = e[t];
    this.set(i[0], i[1]);
  }
}
wi.prototype.clear = JA;
wi.prototype.delete = tE;
wi.prototype.get = sE;
wi.prototype.has = aE;
wi.prototype.set = hE;
function cE() {
  this.__data__ = [], this.size = 0;
}
function la(e, t) {
  for (var r = e.length; r--; )
    if (I0(e[r][0], t))
      return r;
  return -1;
}
var uE = Array.prototype, dE = uE.splice;
function fE(e) {
  var t = this.__data__, r = la(t, e);
  if (r < 0)
    return !1;
  var i = t.length - 1;
  return r == i ? t.pop() : dE.call(t, r, 1), --this.size, !0;
}
function pE(e) {
  var t = this.__data__, r = la(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function gE(e) {
  return la(this.__data__, e) > -1;
}
function mE(e, t) {
  var r = this.__data__, i = la(r, e);
  return i < 0 ? (++this.size, r.push([e, t])) : r[i][1] = t, this;
}
function Dr(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var i = e[t];
    this.set(i[0], i[1]);
  }
}
Dr.prototype.clear = cE;
Dr.prototype.delete = fE;
Dr.prototype.get = pE;
Dr.prototype.has = gE;
Dr.prototype.set = mE;
var po = Li(Ir, "Map");
function yE() {
  this.size = 0, this.__data__ = {
    hash: new wi(),
    map: new (po || Dr)(),
    string: new wi()
  };
}
function xE(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function ha(e, t) {
  var r = e.__data__;
  return xE(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function CE(e) {
  var t = ha(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function bE(e) {
  return ha(this, e).get(e);
}
function kE(e) {
  return ha(this, e).has(e);
}
function wE(e, t) {
  var r = ha(this, e), i = r.size;
  return r.set(e, t), this.size += r.size == i ? 0 : 1, this;
}
function Pr(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var i = e[t];
    this.set(i[0], i[1]);
  }
}
Pr.prototype.clear = yE;
Pr.prototype.delete = CE;
Pr.prototype.get = bE;
Pr.prototype.has = kE;
Pr.prototype.set = wE;
var SE = "Expected a function";
function Tc(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(SE);
  var r = function() {
    var i = arguments, s = t ? t.apply(this, i) : i[0], o = r.cache;
    if (o.has(s))
      return o.get(s);
    var n = e.apply(this, i);
    return r.cache = o.set(s, n) || o, n;
  };
  return r.cache = new (Tc.Cache || Pr)(), r;
}
Tc.Cache = Pr;
var TE = 500;
function _E(e) {
  var t = Tc(e, function(i) {
    return r.size === TE && r.clear(), i;
  }), r = t.cache;
  return t;
}
var vE = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, BE = /\\(\\)?/g, LE = _E(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(vE, function(r, i, s, o) {
    t.push(s ? o.replace(BE, "$1") : i || r);
  }), t;
});
function AE(e) {
  return e == null ? "" : $0(e);
}
function W0(e, t) {
  return Me(e) ? e : Sc(e, t) ? [e] : LE(AE(e));
}
function ca(e) {
  if (typeof e == "string" || Cc(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function z0(e, t) {
  t = W0(t, e);
  for (var r = 0, i = t.length; e != null && r < i; )
    e = e[ca(t[r++])];
  return r && r == i ? e : void 0;
}
function EE(e, t, r) {
  var i = e == null ? void 0 : z0(e, t);
  return i === void 0 ? r : i;
}
function H0(e, t) {
  for (var r = -1, i = t.length, s = e.length; ++r < i; )
    e[s + r] = t[r];
  return e;
}
var pf = gr ? gr.isConcatSpreadable : void 0;
function FE(e) {
  return Me(e) || aa(e) || !!(pf && e && e[pf]);
}
function ME(e, t, r, i, s) {
  var o = -1, n = e.length;
  for (r || (r = FE), s || (s = []); ++o < n; ) {
    var a = e[o];
    r(a) ? H0(s, a) : i || (s[s.length] = a);
  }
  return s;
}
function $E(e, t, r, i) {
  var s = -1, o = e == null ? 0 : e.length;
  for (i && o && (r = e[++s]); ++s < o; )
    r = t(r, e[s], s, e);
  return r;
}
function OE() {
  this.__data__ = new Dr(), this.size = 0;
}
function IE(e) {
  var t = this.__data__, r = t.delete(e);
  return this.size = t.size, r;
}
function DE(e) {
  return this.__data__.get(e);
}
function PE(e) {
  return this.__data__.has(e);
}
var RE = 200;
function NE(e, t) {
  var r = this.__data__;
  if (r instanceof Dr) {
    var i = r.__data__;
    if (!po || i.length < RE - 1)
      return i.push([e, t]), this.size = ++r.size, this;
    r = this.__data__ = new Pr(i);
  }
  return r.set(e, t), this.size = r.size, this;
}
function Er(e) {
  var t = this.__data__ = new Dr(e);
  this.size = t.size;
}
Er.prototype.clear = OE;
Er.prototype.delete = IE;
Er.prototype.get = DE;
Er.prototype.has = PE;
Er.prototype.set = NE;
function Y0(e, t) {
  for (var r = -1, i = e == null ? 0 : e.length, s = 0, o = []; ++r < i; ) {
    var n = e[r];
    t(n, r, e) && (o[s++] = n);
  }
  return o;
}
function qE() {
  return [];
}
var WE = Object.prototype, zE = WE.propertyIsEnumerable, gf = Object.getOwnPropertySymbols, HE = gf ? function(e) {
  return e == null ? [] : (e = Object(e), Y0(gf(e), function(t) {
    return zE.call(e, t);
  }));
} : qE;
function YE(e, t, r) {
  var i = t(e);
  return Me(e) ? i : H0(i, r(e));
}
function mf(e) {
  return YE(e, ur, HE);
}
var hh = Li(Ir, "DataView"), ch = Li(Ir, "Promise"), Xi = Li(Ir, "Set"), yf = "[object Map]", UE = "[object Object]", xf = "[object Promise]", Cf = "[object Set]", bf = "[object WeakMap]", kf = "[object DataView]", jE = Bi(hh), XE = Bi(po), GE = Bi(ch), VE = Bi(Xi), KE = Bi(lh), Lr = ks;
(hh && Lr(new hh(new ArrayBuffer(1))) != kf || po && Lr(new po()) != yf || ch && Lr(ch.resolve()) != xf || Xi && Lr(new Xi()) != Cf || lh && Lr(new lh()) != bf) && (Lr = function(e) {
  var t = ks(e), r = t == UE ? e.constructor : void 0, i = r ? Bi(r) : "";
  if (i)
    switch (i) {
      case jE:
        return kf;
      case XE:
        return yf;
      case GE:
        return xf;
      case VE:
        return Cf;
      case KE:
        return bf;
    }
  return t;
});
var wf = Ir.Uint8Array, ZE = "__lodash_hash_undefined__";
function QE(e) {
  return this.__data__.set(e, ZE), this;
}
function JE(e) {
  return this.__data__.has(e);
}
function go(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.__data__ = new Pr(); ++t < r; )
    this.add(e[t]);
}
go.prototype.add = go.prototype.push = QE;
go.prototype.has = JE;
function tF(e, t) {
  for (var r = -1, i = e == null ? 0 : e.length; ++r < i; )
    if (t(e[r], r, e))
      return !0;
  return !1;
}
function U0(e, t) {
  return e.has(t);
}
var eF = 1, rF = 2;
function j0(e, t, r, i, s, o) {
  var n = r & eF, a = e.length, l = t.length;
  if (a != l && !(n && l > a))
    return !1;
  var c = o.get(e), h = o.get(t);
  if (c && h)
    return c == t && h == e;
  var u = -1, d = !0, f = r & rF ? new go() : void 0;
  for (o.set(e, t), o.set(t, e); ++u < a; ) {
    var m = e[u], y = t[u];
    if (i)
      var x = n ? i(y, m, u, t, e, o) : i(m, y, u, e, t, o);
    if (x !== void 0) {
      if (x)
        continue;
      d = !1;
      break;
    }
    if (f) {
      if (!tF(t, function(C, b) {
        if (!U0(f, b) && (m === C || s(m, C, r, i, o)))
          return f.push(b);
      })) {
        d = !1;
        break;
      }
    } else if (!(m === y || s(m, y, r, i, o))) {
      d = !1;
      break;
    }
  }
  return o.delete(e), o.delete(t), d;
}
function iF(e) {
  var t = -1, r = Array(e.size);
  return e.forEach(function(i, s) {
    r[++t] = [s, i];
  }), r;
}
function _c(e) {
  var t = -1, r = Array(e.size);
  return e.forEach(function(i) {
    r[++t] = i;
  }), r;
}
var sF = 1, oF = 2, nF = "[object Boolean]", aF = "[object Date]", lF = "[object Error]", hF = "[object Map]", cF = "[object Number]", uF = "[object RegExp]", dF = "[object Set]", fF = "[object String]", pF = "[object Symbol]", gF = "[object ArrayBuffer]", mF = "[object DataView]", Sf = gr ? gr.prototype : void 0, Va = Sf ? Sf.valueOf : void 0;
function yF(e, t, r, i, s, o, n) {
  switch (r) {
    case mF:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case gF:
      return !(e.byteLength != t.byteLength || !o(new wf(e), new wf(t)));
    case nF:
    case aF:
    case cF:
      return I0(+e, +t);
    case lF:
      return e.name == t.name && e.message == t.message;
    case uF:
    case fF:
      return e == t + "";
    case hF:
      var a = iF;
    case dF:
      var l = i & sF;
      if (a || (a = _c), e.size != t.size && !l)
        return !1;
      var c = n.get(e);
      if (c)
        return c == t;
      i |= oF, n.set(e, t);
      var h = j0(a(e), a(t), i, s, o, n);
      return n.delete(e), h;
    case pF:
      if (Va)
        return Va.call(e) == Va.call(t);
  }
  return !1;
}
var xF = 1, CF = Object.prototype, bF = CF.hasOwnProperty;
function kF(e, t, r, i, s, o) {
  var n = r & xF, a = mf(e), l = a.length, c = mf(t), h = c.length;
  if (l != h && !n)
    return !1;
  for (var u = l; u--; ) {
    var d = a[u];
    if (!(n ? d in t : bF.call(t, d)))
      return !1;
  }
  var f = o.get(e), m = o.get(t);
  if (f && m)
    return f == t && m == e;
  var y = !0;
  o.set(e, t), o.set(t, e);
  for (var x = n; ++u < l; ) {
    d = a[u];
    var C = e[d], b = t[d];
    if (i)
      var w = n ? i(b, C, d, t, e, o) : i(C, b, d, e, t, o);
    if (!(w === void 0 ? C === b || s(C, b, r, i, o) : w)) {
      y = !1;
      break;
    }
    x || (x = d == "constructor");
  }
  if (y && !x) {
    var _ = e.constructor, v = t.constructor;
    _ != v && "constructor" in e && "constructor" in t && !(typeof _ == "function" && _ instanceof _ && typeof v == "function" && v instanceof v) && (y = !1);
  }
  return o.delete(e), o.delete(t), y;
}
var wF = 1, Tf = "[object Arguments]", _f = "[object Array]", Vo = "[object Object]", SF = Object.prototype, vf = SF.hasOwnProperty;
function TF(e, t, r, i, s, o) {
  var n = Me(e), a = Me(t), l = n ? _f : Lr(e), c = a ? _f : Lr(t);
  l = l == Tf ? Vo : l, c = c == Tf ? Vo : c;
  var h = l == Vo, u = c == Vo, d = l == c;
  if (d && Nn(e)) {
    if (!Nn(t))
      return !1;
    n = !0, h = !1;
  }
  if (d && !h)
    return o || (o = new Er()), n || wc(e) ? j0(e, t, r, i, s, o) : yF(e, t, l, r, i, s, o);
  if (!(r & wF)) {
    var f = h && vf.call(e, "__wrapped__"), m = u && vf.call(t, "__wrapped__");
    if (f || m) {
      var y = f ? e.value() : e, x = m ? t.value() : t;
      return o || (o = new Er()), s(y, x, r, i, o);
    }
  }
  return d ? (o || (o = new Er()), kF(e, t, r, i, s, o)) : !1;
}
function vc(e, t, r, i, s) {
  return e === t ? !0 : e == null || t == null || !ki(e) && !ki(t) ? e !== e && t !== t : TF(e, t, r, i, vc, s);
}
var _F = 1, vF = 2;
function BF(e, t, r, i) {
  var s = r.length, o = s;
  if (e == null)
    return !o;
  for (e = Object(e); s--; ) {
    var n = r[s];
    if (n[2] ? n[1] !== e[n[0]] : !(n[0] in e))
      return !1;
  }
  for (; ++s < o; ) {
    n = r[s];
    var a = n[0], l = e[a], c = n[1];
    if (n[2]) {
      if (l === void 0 && !(a in e))
        return !1;
    } else {
      var h = new Er(), u;
      if (!(u === void 0 ? vc(c, l, _F | vF, i, h) : u))
        return !1;
    }
  }
  return !0;
}
function X0(e) {
  return e === e && !bc(e);
}
function LF(e) {
  for (var t = ur(e), r = t.length; r--; ) {
    var i = t[r], s = e[i];
    t[r] = [i, s, X0(s)];
  }
  return t;
}
function G0(e, t) {
  return function(r) {
    return r == null ? !1 : r[e] === t && (t !== void 0 || e in Object(r));
  };
}
function AF(e) {
  var t = LF(e);
  return t.length == 1 && t[0][2] ? G0(t[0][0], t[0][1]) : function(r) {
    return r === e || BF(r, e, t);
  };
}
function EF(e, t) {
  return e != null && t in Object(e);
}
function FF(e, t, r) {
  t = W0(t, e);
  for (var i = -1, s = t.length, o = !1; ++i < s; ) {
    var n = ca(t[i]);
    if (!(o = e != null && r(e, n)))
      break;
    e = e[n];
  }
  return o || ++i != s ? o : (s = e == null ? 0 : e.length, !!s && kc(s) && O0(n, s) && (Me(e) || aa(e)));
}
function MF(e, t) {
  return e != null && FF(e, t, EF);
}
var $F = 1, OF = 2;
function IF(e, t) {
  return Sc(e) && X0(t) ? G0(ca(e), t) : function(r) {
    var i = EE(r, e);
    return i === void 0 && i === t ? MF(r, e) : vc(t, i, $F | OF);
  };
}
function DF(e) {
  return function(t) {
    return t?.[e];
  };
}
function PF(e) {
  return function(t) {
    return z0(t, e);
  };
}
function RF(e) {
  return Sc(e) ? DF(ca(e)) : PF(e);
}
function V0(e) {
  return typeof e == "function" ? e : e == null ? oa : typeof e == "object" ? Me(e) ? IF(e[0], e[1]) : AF(e) : RF(e);
}
function NF(e) {
  return function(t, r, i) {
    for (var s = -1, o = Object(t), n = i(t), a = n.length; a--; ) {
      var l = n[++s];
      if (r(o[l], l, o) === !1)
        break;
    }
    return t;
  };
}
var qF = NF();
function WF(e, t) {
  return e && qF(e, t, ur);
}
function zF(e, t) {
  return function(r, i) {
    if (r == null)
      return r;
    if (!na(r))
      return e(r, i);
    for (var s = r.length, o = -1, n = Object(r); ++o < s && i(n[o], o, n) !== !1; )
      ;
    return r;
  };
}
var Bc = zF(WF);
function HF(e) {
  return ki(e) && na(e);
}
function YF(e) {
  return typeof e == "function" ? e : oa;
}
function ii(e, t) {
  var r = Me(e) ? QL : Bc;
  return r(e, YF(t));
}
function UF(e, t) {
  var r = [];
  return Bc(e, function(i, s, o) {
    t(i, s, o) && r.push(i);
  }), r;
}
function Ko(e, t) {
  var r = Me(e) ? Y0 : UF;
  return r(e, V0(t));
}
function jF(e, t) {
  return M0(t, function(r) {
    return e[r];
  });
}
function Ka(e) {
  return e == null ? [] : jF(e, ur(e));
}
var XF = "[object Map]", GF = "[object Set]", VF = Object.prototype, KF = VF.hasOwnProperty;
function Bf(e) {
  if (e == null)
    return !0;
  if (na(e) && (Me(e) || typeof e == "string" || typeof e.splice == "function" || Nn(e) || wc(e) || aa(e)))
    return !e.length;
  var t = Lr(e);
  if (t == XF || t == GF)
    return !e.size;
  if (D0(e))
    return !q0(e).length;
  for (var r in e)
    if (KF.call(e, r))
      return !1;
  return !0;
}
function Wi(e) {
  return e === void 0;
}
function ZF(e, t, r, i, s) {
  return s(e, function(o, n, a) {
    r = i ? (i = !1, o) : t(r, o, n, a);
  }), r;
}
function QF(e, t, r) {
  var i = Me(e) ? $E : ZF, s = arguments.length < 3;
  return i(e, V0(t), r, s, Bc);
}
var JF = 1 / 0, tM = Xi && 1 / _c(new Xi([, -0]))[1] == JF ? function(e) {
  return new Xi(e);
} : UL, eM = 200;
function rM(e, t, r) {
  var i = -1, s = iA, o = e.length, n = !0, a = [], l = a;
  if (o >= eM) {
    var c = tM(e);
    if (c)
      return _c(c);
    n = !1, s = U0, l = new go();
  } else
    l = a;
  t:
    for (; ++i < o; ) {
      var h = e[i], u = h;
      if (h = h !== 0 ? h : 0, n && u === u) {
        for (var d = l.length; d--; )
          if (l[d] === u)
            continue t;
        a.push(h);
      } else s(l, u, r) || (l !== a && l.push(u), a.push(h));
    }
  return a;
}
var iM = aA(function(e) {
  return rM(ME(e, 1, HF, !0));
}), sM = "\0", si = "\0", Lf = "";
class ua {
  /**
   * @param {GraphOptions} [opts] - Graph options.
   */
  constructor(t = {}) {
    this._isDirected = Object.prototype.hasOwnProperty.call(t, "directed") ? t.directed : !0, this._isMultigraph = Object.prototype.hasOwnProperty.call(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.prototype.hasOwnProperty.call(t, "compound") ? t.compound : !1, this._label = void 0, this._defaultNodeLabelFn = Ks(void 0), this._defaultEdgeLabelFn = Ks(void 0), this._nodes = {}, this._isCompound && (this._parent = {}, this._children = {}, this._children[si] = {}), this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {};
  }
  /* === Graph functions ========= */
  /**
   *
   * @returns {boolean} `true` if the graph is [directed](https://en.wikipedia.org/wiki/Directed_graph).
   * A directed graph treats the order of nodes in an edge as significant whereas an
   * [undirected](https://en.wikipedia.org/wiki/Graph_(mathematics)#Undirected_graph)
   * graph does not.
   * This example demonstrates the difference:
   *
   * @example
   *
   * ```js
   * var directed = new Graph({ directed: true });
   * directed.setEdge("a", "b", "my-label");
   * directed.edge("a", "b"); // returns "my-label"
   * directed.edge("b", "a"); // returns undefined
   *
   * var undirected = new Graph({ directed: false });
   * undirected.setEdge("a", "b", "my-label");
   * undirected.edge("a", "b"); // returns "my-label"
   * undirected.edge("b", "a"); // returns "my-label"
   * ```
   */
  isDirected() {
    return this._isDirected;
  }
  /**
   * @returns {boolean} `true` if the graph is a multigraph.
   */
  isMultigraph() {
    return this._isMultigraph;
  }
  /**
   * @returns {boolean} `true` if the graph is compound.
   */
  isCompound() {
    return this._isCompound;
  }
  /**
   * Sets the label for the graph to `label`.
   *
   * @param {GraphLabel} label - Label for the graph.
   * @returns {this}
   */
  setGraph(t) {
    return this._label = t, this;
  }
  /**
   * @returns {GraphLabel | undefined} the currently assigned label for the graph.
   * If no label has been assigned, returns `undefined`.
   *
   * @example
   *
   * ```js
   * var g = new Graph();
   * g.graph(); // returns undefined
   * g.setGraph("graph-label");
   *  g.graph(); // returns "graph-label"
   * ```
   */
  graph() {
    return this._label;
  }
  /* === Node functions ========== */
  /**
   * Sets a new default value that is assigned to nodes that are created without
   * a label.
   *
   * @param {typeof this._defaultNodeLabelFn | NodeLabel} newDefault - If a function,
   * it is called with the id of the node being created.
   * Otherwise, it is assigned as the label directly.
   * @returns {this}
   */
  setDefaultNodeLabel(t) {
    return Rn(t) || (t = Ks(t)), this._defaultNodeLabelFn = t, this;
  }
  /**
   * @returns {number} the number of nodes in the graph.
   */
  nodeCount() {
    return this._nodeCount;
  }
  /**
   * @returns {NodeID[]} the ids of the nodes in the graph.
   *
   * @remarks
   * Use {@link node()} to get the label for each node.
   * Takes `O(|V|)` time.
   */
  nodes() {
    return ur(this._nodes);
  }
  /**
   * @returns {NodeID[]} those nodes in the graph that have no in-edges.
   * @remarks Takes `O(|V|)` time.
   */
  sources() {
    var t = this;
    return Ko(this.nodes(), function(r) {
      return Bf(t._in[r]);
    });
  }
  /**
   * @returns {NodeID[]} those nodes in the graph that have no out-edges.
   * @remarks Takes `O(|V|)` time.
   */
  sinks() {
    var t = this;
    return Ko(this.nodes(), function(r) {
      return Bf(t._out[r]);
    });
  }
  /**
   * Invokes setNode method for each node in `vs` list.
   *
   * @param {Collection<NodeID | number>} vs - List of node IDs to create/set.
   * @param {NodeLabel} [value] - If set, update all nodes with this value.
   * @returns {this}
   * @remarks Complexity: O(|names|).
   */
  setNodes(t, r) {
    var i = arguments, s = this;
    return ii(t, function(o) {
      i.length > 1 ? s.setNode(o, r) : s.setNode(o);
    }), this;
  }
  /**
   * Creates or updates the value for the node `v` in the graph.
   *
   * @param {NodeID | number} v - ID of the node to create/set.
   * @param {NodeLabel} [value] - If supplied, it is set as the value for the node.
   * If not supplied and the node was created by this call then
   * {@link setDefaultNodeLabel} will be used to set the node's value.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  setNode(t, r) {
    return Object.prototype.hasOwnProperty.call(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = r), this) : (this._nodes[t] = arguments.length > 1 ? r : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = si, this._children[t] = {}, this._children[si][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
  }
  /**
   * Gets the label of node with specified name.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeLabel | undefined} the label assigned to the node with the id `v`
   * if it is in the graph.
   * Otherwise returns `undefined`.
   * @remarks Takes `O(1)` time.
   */
  node(t) {
    return this._nodes[t];
  }
  /**
   * Detects whether graph has a node with specified name or not.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {boolean} Returns `true` the graph has a node with the id.
   * @remarks Takes `O(1)` time.
   */
  hasNode(t) {
    return Object.prototype.hasOwnProperty.call(this._nodes, t);
  }
  /**
   * Remove the node with the id `v` in the graph or do nothing if the node is
   * not in the graph.
   *
   * If the node was removed this function also removes any incident edges.
   *
   * @param {NodeID | number} v - Node ID to remove.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(|E|)` time.
   */
  removeNode(t) {
    if (Object.prototype.hasOwnProperty.call(this._nodes, t)) {
      var r = (i) => this.removeEdge(this._edgeObjs[i]);
      delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], ii(this.children(t), (i) => {
        this.setParent(i);
      }), delete this._children[t]), ii(ur(this._in[t]), r), delete this._in[t], delete this._preds[t], ii(ur(this._out[t]), r), delete this._out[t], delete this._sucs[t], --this._nodeCount;
    }
    return this;
  }
  /**
   * Sets the parent for `v` to `parent` if it is defined or removes the parent
   * for `v` if `parent` is undefined.
   *
   * @param {NodeID | number} v - Node ID to set the parent for.
   * @param {NodeID | number} [parent] - Parent node ID. If not defined, removes the parent.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @throws if the graph is not compound.
   * @throws if setting the parent would create a cycle.
   * @remarks Takes `O(1)` time.
   */
  setParent(t, r) {
    if (!this._isCompound)
      throw new Error("Cannot set parent in a non-compound graph");
    if (Wi(r))
      r = si;
    else {
      r += "";
      for (var i = r; !Wi(i); i = this.parent(i))
        if (i === t)
          throw new Error("Setting " + r + " as parent of " + t + " would create a cycle");
      this.setNode(r);
    }
    return this.setNode(t), this._removeFromParentsChildList(t), this._parent[t] = r, this._children[r][t] = !0, this;
  }
  /**
   * @private
   * @param {NodeID | number} v - Node ID.
   */
  _removeFromParentsChildList(t) {
    delete this._children[this._parent[t]][t];
  }
  /**
   * Get parent node for node `v`.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID | undefined} the node that is a parent of node `v`
   * or `undefined` if node `v` does not have a parent or is not a member of
   * the graph.
   * Always returns `undefined` for graphs that are not compound.
   * @remarks Takes `O(1)` time.
   */
  parent(t) {
    if (this._isCompound) {
      var r = this._parent[t];
      if (r !== si)
        return r;
    }
  }
  /**
   * Gets list of direct children of node v.
   *
   * @param {NodeID | number} [v] - Node ID. If not specified, gets nodes
   * with no parent (top-level nodes).
   * @returns {NodeID[] | undefined} all nodes that are children of node `v` or
   * `undefined` if node `v` is not in the graph.
   * Always returns `[]` for graphs that are not compound.
   * @remarks Takes `O(|V|)` time.
   */
  children(t) {
    if (Wi(t) && (t = si), this._isCompound) {
      var r = this._children[t];
      if (r)
        return ur(r);
    } else {
      if (t === si)
        return this.nodes();
      if (this.hasNode(t))
        return [];
    }
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are predecessors of the
   * specified node or `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link neighbors} instead.
   * Takes `O(|V|)` time.
   */
  predecessors(t) {
    var r = this._preds[t];
    if (r)
      return ur(r);
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are successors of the
   * specified node or `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link neighbors} instead.
   * Takes `O(|V|)` time.
   */
  successors(t) {
    var r = this._sucs[t];
    if (r)
      return ur(r);
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are predecessors or
   * successors of the specified node
   * or `undefined` if node `v` is not in the graph.
   * @remarks Takes `O(|V|)` time.
   */
  neighbors(t) {
    var r = this.predecessors(t);
    if (r)
      return iM(r, this.successors(t));
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {boolean} True if the node is a leaf (has no successors), false otherwise.
   */
  isLeaf(t) {
    var r;
    return this.isDirected() ? r = this.successors(t) : r = this.neighbors(t), r.length === 0;
  }
  /**
     * Creates new graph with nodes filtered via `filter`.
     * Edges incident to rejected node
     * are also removed.
     * 
     * In case of compound graph, if parent is rejected by `filter`,
     * than all its children are rejected too.
  
     * @param {(v: NodeID) => boolean} filter - Function that returns `true` for nodes to keep.
     * @returns {Graph<GraphLabel, NodeLabel, EdgeLabel>} A new graph containing only the nodes for which `filter` returns `true`.
     * @remarks Average-case complexity: O(|E|+|V|).
     */
  filterNodes(t) {
    var r = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });
    r.setGraph(this.graph());
    var i = this;
    ii(this._nodes, function(n, a) {
      t(a) && r.setNode(a, n);
    }), ii(this._edgeObjs, function(n) {
      r.hasNode(n.v) && r.hasNode(n.w) && r.setEdge(n, i.edge(n));
    });
    var s = {};
    function o(n) {
      var a = i.parent(n);
      return a === void 0 || r.hasNode(a) ? (s[n] = a, a) : a in s ? s[a] : o(a);
    }
    return this._isCompound && ii(r.nodes(), function(n) {
      r.setParent(n, o(n));
    }), r;
  }
  /* === Edge functions ========== */
  /**
   * Sets a new default value that is assigned to edges that are created without
   * a label.
   *
   * @param {typeof this._defaultEdgeLabelFn | EdgeLabel} newDefault - If a function,
   * it is called with the parameters `(v, w, name)`.
   * Otherwise, it is assigned as the label directly.
   * @returns {this}
   */
  setDefaultEdgeLabel(t) {
    return Rn(t) || (t = Ks(t)), this._defaultEdgeLabelFn = t, this;
  }
  /**
   * @returns {number} the number of edges in the graph.
   * @remarks Complexity: O(1).
   */
  edgeCount() {
    return this._edgeCount;
  }
  /**
   * Gets edges of the graph.
   *
   * @returns {EdgeObj[]} the {@link EdgeObj} for each edge in the graph.
   *
   * @remarks
   * In case of compound graph subgraphs are not considered.
   * Use {@link edge()} to get the label for each edge.
   * Takes `O(|E|)` time.
   */
  edges() {
    return Ka(this._edgeObjs);
  }
  /**
   * Establish an edges path over the nodes in nodes list.
   *
   * If some edge is already exists, it will update its label, otherwise it will
   * create an edge between pair of nodes with label provided or default label
   * if no label provided.
   *
   * @param {Collection<NodeID>} vs - List of node IDs to create edges between.
   * @param {EdgeLabel} [value] - If set, update all edges with this value.
   * @returns {this}
   * @remarks Complexity: O(|nodes|).
   */
  setPath(t, r) {
    var i = this, s = arguments;
    return QF(t, function(o, n) {
      return s.length > 1 ? i.setEdge(o, n, r) : i.setEdge(o, n), n;
    }), this;
  }
  /**
   * Creates or updates the label for the edge (`v`, `w`) with the optionally
   * supplied `name`.
   *
   * @overload
   * @param {EdgeObj} arg0 - Edge object.
   * @param {EdgeLabel} [value] - If supplied, it is set as the label for the edge.
   * If not supplied and the edge was created by this call then
   * {@link setDefaultEdgeLabel} will be used to assign the edge's label.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  /**
   * Creates or updates the label for the edge (`v`, `w`) with the optionally
   * supplied `name`.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID. Number values will be coerced to strings.
   * @param {NodeID | number} w - Target node ID. Number values will be coerced to strings.
   * @param {EdgeLabel} [value] - If supplied, it is set as the label for the edge.
   * If not supplied and the edge was created by this call then
   * {@link setDefaultEdgeLabel} will be used to assign the edge's label.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  setEdge() {
    var t, r, i, s, o = !1, n = arguments[0];
    typeof n == "object" && n !== null && "v" in n ? (t = n.v, r = n.w, i = n.name, arguments.length === 2 && (s = arguments[1], o = !0)) : (t = n, r = arguments[1], i = arguments[3], arguments.length > 2 && (s = arguments[2], o = !0)), t = "" + t, r = "" + r, Wi(i) || (i = "" + i);
    var a = Zs(this._isDirected, t, r, i);
    if (Object.prototype.hasOwnProperty.call(this._edgeLabels, a))
      return o && (this._edgeLabels[a] = s), this;
    if (!Wi(i) && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(r), this._edgeLabels[a] = o ? s : this._defaultEdgeLabelFn(t, r, i);
    var l = oM(this._isDirected, t, r, i);
    return t = l.v, r = l.w, Object.freeze(l), this._edgeObjs[a] = l, Af(this._preds[r], t), Af(this._sucs[t], r), this._in[r][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {EdgeLabel | undefined} the label for the edge (`v`, `w`) if the
   * graph has an edge between `v` and `w` with the optional `name`.
   * Returned `undefined` if there is no such edge in the graph.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  /**
   * Gets the label for the specified edge.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {EdgeLabel | undefined} the label for the edge (`v`, `w`) if the
   * graph has an edge between `v` and `w` with the optional `name`.
   * Returned `undefined` if there is no such edge in the graph.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  edge(t, r, i) {
    var s = arguments.length === 1 ? Za(this._isDirected, arguments[0]) : Zs(this._isDirected, t, r, i);
    return this._edgeLabels[s];
  }
  /**
   * Detects whether the graph contains specified edge or not.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {boolean} `true` if the graph has an edge between `v` and `w`
   * with the optional `name`.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  /**
   * Detects whether the graph contains specified edge or not.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {boolean} `true` if the graph has an edge between `v` and `w`
   * with the optional `name`.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  hasEdge(t, r, i) {
    var s = arguments.length === 1 ? Za(this._isDirected, arguments[0]) : Zs(this._isDirected, t, r, i);
    return Object.prototype.hasOwnProperty.call(this._edgeLabels, s);
  }
  /**
   * Removes the edge (`v`, `w`) if the graph has an edge between `v` and `w`
   * with the optional `name`. If not this function does nothing.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {this}
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  /**
   * Removes the edge (`v`, `w`) if the graph has an edge between `v` and `w`
   * with the optional `name`. If not this function does nothing.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {this}
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  removeEdge(t, r, i) {
    var s = arguments.length === 1 ? Za(this._isDirected, arguments[0]) : Zs(this._isDirected, t, r, i), o = this._edgeObjs[s];
    return o && (t = o.v, r = o.w, delete this._edgeLabels[s], delete this._edgeObjs[s], Ef(this._preds[r], t), Ef(this._sucs[t], r), delete this._in[r][s], delete this._out[t][s], this._edgeCount--), this;
  }
  /**
   * @param {NodeID | number} v - Target node ID.
   * @param {NodeID | number} [u] - Optionally filters edges down to just those
   * coming from node `u`.
   * @returns {EdgeObj[] | undefined} all edges that point to the node `v`.
   * Returns `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link nodeEdges} instead.
   * Takes `O(|E|)` time.
   */
  inEdges(t, r) {
    var i = this._in[t];
    if (i) {
      var s = Ka(i);
      return r ? Ko(s, function(o) {
        return o.v === r;
      }) : s;
    }
  }
  /**
   * @param {NodeID | number} v - Target node ID.
   * @param {NodeID | number} [w] - Optionally filters edges down to just those
   * that point to `w`.
   * @returns {EdgeObj[] | undefined} all edges that point to the node `v`.
   * Returns `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link nodeEdges} instead.
   * Takes `O(|E|)` time.
   */
  outEdges(t, r) {
    var i = this._out[t];
    if (i) {
      var s = Ka(i);
      return r ? Ko(s, function(o) {
        return o.w === r;
      }) : s;
    }
  }
  /**
   * @param {NodeID | number} v - Target Node ID.
   * @param {NodeID | number} [w] - If set, filters those edges down to just
   * those between nodes `v` and `w` regardless of direction
   * @returns {EdgeObj[] | undefined} all edges to or from node `v` regardless
   * of direction. Returns `undefined` if node `v` is not in the graph.
   * @remarks Takes `O(|E|)` time.
   */
  nodeEdges(t, r) {
    var i = this.inEdges(t, r);
    if (i)
      return i.concat(this.outEdges(t, r));
  }
}
ua.prototype._nodeCount = 0;
ua.prototype._edgeCount = 0;
function Af(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function Ef(e, t) {
  --e[t] || delete e[t];
}
function Zs(e, t, r, i) {
  var s = "" + t, o = "" + r;
  if (!e && s > o) {
    var n = s;
    s = o, o = n;
  }
  return s + Lf + o + Lf + (Wi(i) ? sM : i);
}
function oM(e, t, r, i) {
  var s = "" + t, o = "" + r;
  if (!e && s > o) {
    var n = s;
    s = o, o = n;
  }
  var a = { v: s, w: o };
  return i && (a.name = i), a;
}
function Za(e, t) {
  return Zs(e, t.v, t.w, t.name);
}
function K0(e, { edgePathsClass: t = "edges edgePaths" } = {}) {
  const r = e.insert("g").attr("class", "root"), i = r.insert("g").attr("class", "clusters"), s = r.insert("g").attr("class", t), o = r.insert("g").attr("class", "edgeLabels"), n = r.insert("g").attr("class", "nodes");
  return { clusters: i, edgePaths: s, edgeLabels: o, nodes: n, rootGroups: r };
}
p(K0, "createLayoutElementGroups");
async function Z0(e, t) {
  if (t.label) {
    const { shapeSvg: r, bbox: i } = await Ct(e, t);
    t.labelBBox = { width: i.width, height: i.height }, r.remove();
  } else
    t.labelBBox = { width: 0, height: 0 };
}
p(Z0, "measureGroupLabel");
async function Q0(e, t, r) {
  const i = await yc(e, t, r), s = i.node()?.getBBox() ?? { width: 0, height: 0 };
  return t.width = s.width, t.height = s.height, i;
}
p(Q0, "insertMeasuredNode");
async function J0(e, t) {
  const r = new ua({
    multigraph: !0,
    compound: !0
  }), i = [...t.edges], s = Ot(), o = K0(e), { edgeLabels: n, nodes: a } = o, l = /* @__PURE__ */ new Map(), c = e.node() != null;
  await Promise.all(
    t.nodes.map(async (h) => {
      if (h.isGroup)
        c && await Z0(a, h), r.setNode(h.id, { ...h });
      else {
        if (c) {
          const u = await Q0(a, h, {
            config: s,
            dir: h.dir
          });
          l.set(h.id, u);
        }
        r.setNode(h.id, { ...h });
      }
    })
  );
  for (const h of i)
    c && T0(h) && await xc(n, h), r.setEdge(h.start, h.end, { ...h }, h.id), t.edges.some((d) => d.id === h.id) || t.edges.push(h);
  if (globalThis.mermaidCaptureSizes) {
    const { captureNodeSizes: h } = await import("./sizeCapture-INFHLROL-vK7_nGsv.js");
    h(e, t);
  }
  return {
    graph: r,
    groups: o,
    nodeElements: l
  };
}
p(J0, "createGraphWithElements");
var Pt = /* @__PURE__ */ new Map(), ci = /* @__PURE__ */ new Map(), tx = /* @__PURE__ */ new Map(), nM = /* @__PURE__ */ p(() => {
  ci.clear(), tx.clear(), Pt.clear();
}, "clear"), mo = /* @__PURE__ */ p((e, t) => {
  const r = ci.get(t) || [];
  return q.trace("In isDescendant", t, " ", e, " = ", r.includes(e)), r.includes(e);
}, "isDescendant"), aM = /* @__PURE__ */ p((e, t) => {
  const r = ci.get(t) || [];
  return q.info("Descendants of ", t, " is ", r), q.info("Edge is ", e), e.v === t || e.w === t ? !1 : r ? r.includes(e.v) || mo(e.v, t) || mo(e.w, t) || r.includes(e.w) : (q.debug("Tilt, ", t, ",not in descendants"), !1);
}, "edgeInCluster"), ex = /* @__PURE__ */ p((e, t, r, i) => {
  q.debug(
    "Copying children of ",
    e,
    "root",
    i,
    "data",
    t.node(e),
    i
  );
  const s = t.children(e) || [];
  e !== i && s.push(e), q.debug("Copying (nodes) clusterId", e, "nodes", s), s.forEach((o) => {
    if (t.children(o).length > 0)
      ex(o, t, r, i);
    else {
      const n = t.node(o);
      q.info("cp ", o, " to ", i, " with parent ", e), r.setNode(o, n), i !== t.parent(o) && (q.debug("Setting parent", o, t.parent(o)), r.setParent(o, t.parent(o))), e !== i && o !== e ? (q.debug("Setting parent", o, e), r.setParent(o, e)) : (q.info("In copy ", e, "root", i, "data", t.node(e), i), q.debug(
        "Not Setting parent for node=",
        o,
        "cluster!==rootId",
        e !== i,
        "node!==clusterId",
        o !== e
      ));
      const a = t.edges(o);
      q.debug("Copying Edges", a), a.forEach((l) => {
        q.info("Edge", l);
        const c = t.edge(l.v, l.w, l.name);
        q.info("Edge data", c, i);
        try {
          aM(l, i) ? (q.info("Copying as ", l.v, l.w, c, l.name), r.setEdge(l.v, l.w, c, l.name), q.info("newGraph edges ", r.edges(), r.edge(r.edges()[0]))) : q.info(
            "Skipping copy of edge ",
            l.v,
            "-->",
            l.w,
            " rootId: ",
            i,
            " clusterId:",
            e
          );
        } catch (h) {
          q.error(h);
        }
      });
    }
    q.debug("Removing node", o), t.removeNode(o);
  });
}, "copy"), rx = /* @__PURE__ */ p((e, t) => {
  const r = t.children(e);
  let i = [...r];
  for (const s of r)
    tx.set(s, e), i = [...i, ...rx(s, t)];
  return i;
}, "extractDescendants"), lM = /* @__PURE__ */ p((e, t, r) => {
  const i = e.edges().filter((l) => l.v === t || l.w === t), s = e.edges().filter((l) => l.v === r || l.w === r), o = i.map((l) => ({ v: l.v === t ? r : l.v, w: l.w === t ? t : l.w })), n = s.map((l) => ({ v: l.v, w: l.w }));
  return o.filter((l) => n.some((c) => l.v === c.v && l.w === c.w));
}, "findCommonEdges"), qn = /* @__PURE__ */ p((e, t, r) => {
  const i = t.children(e);
  if (q.trace("Searching children of id ", e, i), i.length < 1)
    return e;
  let s;
  for (const o of i) {
    const n = qn(o, t, r), a = lM(t, r, n);
    if (n)
      if (a.length > 0)
        s = n;
      else
        return n;
  }
  return s;
}, "findNonClusterChild"), Ff = /* @__PURE__ */ p((e) => !Pt.has(e) || !Pt.get(e).externalConnections ? e : Pt.has(e) ? Pt.get(e).id : e, "getAnchorId"), OI = /* @__PURE__ */ p((e, t) => {
  if (!e || t > 10) {
    q.debug("Opting out, no graph ");
    return;
  } else
    q.debug("Opting in, graph ");
  e.nodes().forEach(function(r) {
    e.children(r).length > 0 && (q.debug(
      "Cluster identified",
      r,
      " Replacement id in edges: ",
      qn(r, e, r)
    ), ci.set(r, rx(r, e)), Pt.set(r, { id: qn(r, e, r), clusterData: e.node(r) }));
  }), e.nodes().forEach(function(r) {
    const i = e.children(r), s = e.edges();
    i.length > 0 ? (q.debug("Cluster identified", r, ci), s.forEach((o) => {
      const n = mo(o.v, r), a = mo(o.w, r);
      n ^ a && (q.debug("Edge: ", o, " leaves cluster ", r), q.debug("Descendants of XXX ", r, ": ", ci.get(r)), Pt.get(r).externalConnections = !0);
    })) : q.debug("Not a cluster ", r, ci);
  });
  for (let r of Pt.keys()) {
    const i = Pt.get(r).id, s = e.parent(i);
    s !== r && Pt.has(s) && !Pt.get(s).externalConnections && (Pt.get(r).id = s);
    const o = e.edges().some((n) => n.v === r);
    if (i && Pt.get(r)?.externalConnections && o && ox(e, i, r)) {
      const n = hM(e, r, e.parent(i));
      n && (Pt.get(r).id = n);
    }
  }
  e.edges().forEach(function(r) {
    const i = e.edge(r);
    q.debug("Edge " + r.v + " -> " + r.w + ": " + JSON.stringify(r)), q.debug("Edge " + r.v + " -> " + r.w + ": " + JSON.stringify(e.edge(r)));
    let s = r.v, o = r.w;
    if (q.debug(
      "Fix XXX",
      Pt,
      "ids:",
      r.v,
      r.w,
      "Translating: ",
      Pt.get(r.v),
      " --- ",
      Pt.get(r.w)
    ), Pt.get(r.v) || Pt.get(r.w)) {
      if (q.debug("Fixing and trying - removing XXX", r.v, r.w, r.name), s = Ff(r.v), o = Ff(r.w), e.removeEdge(r.v, r.w, r.name), s !== r.v) {
        const n = e.parent(s);
        Pt.get(n).externalConnections = !0, i.fromCluster = r.v;
      }
      if (o !== r.w) {
        const n = e.parent(o);
        Pt.get(n).externalConnections = !0, i.toCluster = r.w;
      }
      q.debug("Fix Replacing with XXX", s, o, r.name), e.setEdge(s, o, i, r.name);
    }
  }), ix(e, 0), q.trace(Pt);
}, "adjustClustersAndEdges"), ix = /* @__PURE__ */ p((e, t) => {
  if (t > 10) {
    q.error("Bailing out");
    return;
  }
  let r = e.nodes(), i = !1;
  for (const s of r) {
    const o = e.children(s);
    i = i || o.length > 0;
  }
  if (!i) {
    q.debug("Done, no node has children", e.nodes());
    return;
  }
  q.debug("Nodes = ", r, t);
  for (const s of r)
    if (q.debug(
      "Extracting node",
      s,
      Pt,
      Pt.has(s) && !Pt.get(s).externalConnections,
      !e.parent(s),
      e.node(s),
      e.children("D"),
      " Depth ",
      t
    ), !Pt.has(s))
      q.debug("Not a cluster", s, t);
    else if (!Pt.get(s).externalConnections && e.children(s) && e.children(s).length > 0) {
      q.debug(
        "Cluster without external connections, without a parent and with children",
        s,
        t
      );
      let n = e.graph().rankdir === "TB" ? "LR" : "TB";
      Pt.get(s)?.clusterData?.dir && (n = Pt.get(s).clusterData.dir, q.debug("Fixing dir", Pt.get(s).clusterData.dir, n));
      const a = new ua({
        multigraph: !0,
        compound: !0
      }).setGraph({
        rankdir: n,
        nodesep: 50,
        ranksep: 50,
        marginx: 8,
        marginy: 8
      }).setDefaultEdgeLabel(function() {
        return {};
      });
      ex(s, e, a, s), e.setNode(s, {
        clusterNode: !0,
        id: s,
        clusterData: Pt.get(s).clusterData,
        label: Pt.get(s).label,
        graph: a
      });
    } else
      q.debug(
        "Cluster ** ",
        s,
        " **not meeting the criteria !externalConnections:",
        !Pt.get(s).externalConnections,
        " no parent: ",
        !e.parent(s),
        " children ",
        e.children(s) && e.children(s).length > 0,
        e.children("D"),
        t
      ), q.debug(Pt);
  r = e.nodes(), q.debug("New list of nodes", r);
  for (const s of r) {
    const o = e.node(s);
    q.debug(" Now next level", s, o), o?.clusterNode && ix(o.graph, t + 1);
  }
}, "extractor"), sx = /* @__PURE__ */ p((e, t) => {
  if (t.length === 0)
    return [];
  let r = Object.assign([], t);
  return t.forEach((i) => {
    const s = e.children(i), o = sx(e, s);
    r = [...r, ...o];
  }), r;
}, "sorter"), II = /* @__PURE__ */ p((e) => sx(e, e.children()), "sortNodesByHierarchy"), ox = /* @__PURE__ */ p((e, t, r) => {
  let i = e.parent(t);
  for (; i && i !== r; ) {
    const s = Pt.get(i);
    if (s && !s.externalConnections)
      return !0;
    i = e.parent(i);
  }
  return !1;
}, "isNodeInExtractableCluster"), hM = /* @__PURE__ */ p((e, t, r) => {
  const i = e.children(t) ?? [];
  for (const s of i) {
    if (s === r || mo(s, r))
      continue;
    const o = qn(s, e, t);
    if (o && !ox(e, o, t))
      return o;
  }
  return null;
}, "findSafeAnchorNode");
function cM({
  prepareLayout: e,
  measureLayout: t,
  runLayoutCore: r,
  paintLayout: i,
  afterPaint: s,
  paintOptions: o
}) {
  const n = t ?? ax;
  return /* @__PURE__ */ p(async function(l, c, h, u) {
    const d = c.select("g");
    (h?.insertMarkers ?? A0)(
      d,
      l.markers,
      l.type,
      l.diagramId
    ), nx();
    const f = {
      element: d,
      // root SVG <g>
      helpers: h,
      // Mermaid helper functions
      options: u
      // { algorithm: "elk.layered" }
    };
    f.preparedLayout = await e?.(l, f);
    const m = await n(l, f), y = await r(l, f), x = {
      ...f,
      measure: m
    };
    i ? await i(l, x, y) : await lx(
      l,
      x,
      o
    ), await s?.(l, x, y);
  }, "render");
}
p(cM, "createCommonLayoutRenderer");
function nx() {
  BB(), WB(), IB(), nM();
}
p(nx, "clearLayoutRenderState");
async function ax(e, { element: t }) {
  return await J0(t, e);
}
p(ax, "defaultMeasureLayout");
async function lx(e, t, r = {}) {
  const { measure: i } = t, { groups: s } = i;
  for (const n of r.getNodes?.(e, t) ?? e.nodes)
    r.skipNode?.(n, t) || await hx(s, n, t, r);
  const o = ux(e.nodes);
  for (const n of e.edges)
    dx(n, r) || await fx(s, n, o, e, r, t);
}
p(lx, "paintLayoutData");
async function hx(e, t, r, i) {
  t.clusterNode ? Zd(t) : cx(t, r, i) ? await S0(e.clusters, t) : Zd(t);
}
p(hx, "paintLayoutNode");
function cx(e, t, r) {
  return e.isGroup === !0 && (r.isCluster?.(e, t) ?? !0);
}
p(cx, "shouldPaintAsCluster");
function ux(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    r?.id && t.set(r.id, r);
  return t;
}
p(ux, "buildNodeLookup");
function dx(e, t) {
  return e.isLayoutOnly || !!t.skipEdge?.(e);
}
p(dx, "shouldSkipPaintEdge");
async function fx(e, t, r, i, s, o) {
  const n = v0(
    e.edgePaths,
    { ...t },
    s.clusterDb ?? /* @__PURE__ */ new Map(),
    i.type,
    uh(t.start, t, r, o, s),
    uh(t.end, t, r, o, s),
    i.diagramId,
    px(t, s)
  );
  T0(t) && (gs.has(t.id) || await xc(e.edgeLabels, t), gx(t, n));
}
p(fx, "paintLayoutEdge");
function uh(e, t, r, i, s) {
  return s.getEdgeNode?.(e, t, i) ?? (e ? r.get(e) ?? {} : {});
}
p(uh, "getRenderedNode");
function px(e, t) {
  return typeof t.skipIntersect == "function" ? t.skipIntersect(e) : t.skipIntersect ?? !1;
}
p(px, "shouldSkipIntersect");
function gx(e, t) {
  const r = t?.updatedPath ?? t?.originalPath, i = Kt(), { subGraphTitleTotalMargin: s } = ia({
    flowchart: i.flowchart ?? {}
  });
  if (e.label) {
    const o = gs.get(e.id);
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcLabelPosition(r);
      q.debug(
        "Moving label " + e.label + " from (",
        n,
        ",",
        a,
        ") to (",
        l.x,
        ",",
        l.y,
        ") abc88"
      ), t?.updatedPath && (n = l.x, a = l.y);
    }
    o.attr("transform", `translate(${n}, ${a + s / 2})`);
  }
  if (e?.startLabelLeft) {
    const o = te.get(e.id).startLeft;
    let n = e?.x, a = e?.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", r);
      n = l.x, a = l.y;
    }
    o.attr("transform", `translate(${n}, ${a})`);
  }
  if (e.startLabelRight) {
    const o = te.get(e.id).startRight;
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(
        e.arrowTypeStart ? 10 : 0,
        "start_right",
        r
      );
      n = l.x, a = l.y;
    }
    o.attr("transform", `translate(${n}, ${a})`);
  }
  if (e.endLabelLeft) {
    const o = te.get(e.id).endLeft;
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", r);
      n = l.x, a = l.y;
    }
    o.attr("transform", `translate(${n}, ${a})`);
  }
  if (e.endLabelRight) {
    const o = te.get(e.id).endRight;
    let n = e.x, a = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", r);
      n = l.x, a = l.y;
    }
    o.attr("transform", `translate(${n}, ${a})`);
  }
}
p(gx, "positionRenderedEdgeLabel");
function mx(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
p(mx, "getDefaultExportFromCjs");
var de = {}, Zo = {}, Hr = {}, Mf;
function ws() {
  if (Mf) return Hr;
  Mf = 1;
  function e(n) {
    return typeof n > "u" || n === null;
  }
  p(e, "isNothing");
  function t(n) {
    return typeof n == "object" && n !== null;
  }
  p(t, "isObject");
  function r(n) {
    return Array.isArray(n) ? n : e(n) ? [] : [n];
  }
  p(r, "toArray");
  function i(n, a) {
    if (a) {
      const l = Object.keys(a);
      for (let c = 0, h = l.length; c < h; c += 1) {
        const u = l[c];
        n[u] = a[u];
      }
    }
    return n;
  }
  p(i, "extend");
  function s(n, a) {
    let l = "";
    for (let c = 0; c < a; c += 1)
      l += n;
    return l;
  }
  p(s, "repeat");
  function o(n) {
    return n === 0 && Number.NEGATIVE_INFINITY === 1 / n;
  }
  return p(o, "isNegativeZero"), Hr.isNothing = e, Hr.isObject = t, Hr.toArray = r, Hr.repeat = s, Hr.isNegativeZero = o, Hr.extend = i, Hr;
}
p(ws, "requireCommon");
var Qa, $f;
function Ss() {
  if ($f) return Qa;
  $f = 1;
  function e(r, i) {
    let s = "";
    const o = r.reason || "(unknown reason)";
    return r.mark ? (r.mark.name && (s += 'in "' + r.mark.name + '" '), s += "(" + (r.mark.line + 1) + ":" + (r.mark.column + 1) + ")", !i && r.mark.snippet && (s += `

` + r.mark.snippet), o + " " + s) : o;
  }
  p(e, "formatError");
  function t(r, i) {
    Error.call(this), this.name = "YAMLException", this.reason = r, this.mark = i, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return p(t, "YAMLException2"), t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t.prototype.toString = /* @__PURE__ */ p(function(i) {
    return this.name + ": " + e(this, i);
  }, "toString"), Qa = t, Qa;
}
p(Ss, "requireException");
var Ja, Of;
function yx() {
  if (Of) return Ja;
  Of = 1;
  const e = ws();
  function t(s, o, n, a, l) {
    let c = "", h = "";
    const u = Math.floor(l / 2) - 1;
    return a - o > u && (c = " ... ", o = a - u + c.length), n - a > u && (h = " ...", n = a + u - h.length), {
      str: c + s.slice(o, n).replace(/\t/g, "→") + h,
      pos: a - o + c.length
      // relative position
    };
  }
  p(t, "getLine");
  function r(s, o) {
    return e.repeat(" ", o - s.length) + s;
  }
  p(r, "padStart");
  function i(s, o) {
    if (o = Object.create(o || null), !s.buffer) return null;
    o.maxLength || (o.maxLength = 79), typeof o.indent != "number" && (o.indent = 1), typeof o.linesBefore != "number" && (o.linesBefore = 3), typeof o.linesAfter != "number" && (o.linesAfter = 2);
    const n = /\r?\n|\r|\0/g, a = [0], l = [];
    let c, h = -1;
    for (; c = n.exec(s.buffer); )
      l.push(c.index), a.push(c.index + c[0].length), s.position <= c.index && h < 0 && (h = a.length - 2);
    h < 0 && (h = a.length - 1);
    let u = "";
    const d = Math.min(s.line + o.linesAfter, l.length).toString().length, f = o.maxLength - (o.indent + d + 3);
    for (let y = 1; y <= o.linesBefore && !(h - y < 0); y++) {
      const x = t(
        s.buffer,
        a[h - y],
        l[h - y],
        s.position - (a[h] - a[h - y]),
        f
      );
      u = e.repeat(" ", o.indent) + r((s.line - y + 1).toString(), d) + " | " + x.str + `
` + u;
    }
    const m = t(s.buffer, a[h], l[h], s.position, f);
    u += e.repeat(" ", o.indent) + r((s.line + 1).toString(), d) + " | " + m.str + `
`, u += e.repeat("-", o.indent + d + 3 + m.pos) + `^
`;
    for (let y = 1; y <= o.linesAfter && !(h + y >= l.length); y++) {
      const x = t(
        s.buffer,
        a[h + y],
        l[h + y],
        s.position - (a[h] - a[h + y]),
        f
      );
      u += e.repeat(" ", o.indent) + r((s.line + y + 1).toString(), d) + " | " + x.str + `
`;
    }
    return u.replace(/\n$/, "");
  }
  return p(i, "makeSnippet"), Ja = i, Ja;
}
p(yx, "requireSnippet");
var tl, If;
function xe() {
  if (If) return tl;
  If = 1;
  const e = Ss(), t = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], r = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function i(o) {
    const n = {};
    return o !== null && Object.keys(o).forEach(function(a) {
      o[a].forEach(function(l) {
        n[String(l)] = a;
      });
    }), n;
  }
  p(i, "compileStyleAliases");
  function s(o, n) {
    if (n = n || {}, Object.keys(n).forEach(function(a) {
      if (t.indexOf(a) === -1)
        throw new e('Unknown option "' + a + '" is met in definition of "' + o + '" YAML type.');
    }), this.options = n, this.tag = o, this.kind = n.kind || null, this.resolve = n.resolve || function() {
      return !0;
    }, this.construct = n.construct || function(a) {
      return a;
    }, this.instanceOf = n.instanceOf || null, this.predicate = n.predicate || null, this.represent = n.represent || null, this.representName = n.representName || null, this.defaultStyle = n.defaultStyle || null, this.multi = n.multi || !1, this.styleAliases = i(n.styleAliases || null), r.indexOf(this.kind) === -1)
      throw new e('Unknown kind "' + this.kind + '" is specified for "' + o + '" YAML type.');
  }
  return p(s, "Type2"), tl = s, tl;
}
p(xe, "requireType");
var el, Df;
function Lc() {
  if (Df) return el;
  Df = 1;
  const e = Ss(), t = xe();
  function r(o, n) {
    const a = [];
    return o[n].forEach(function(l) {
      let c = a.length;
      a.forEach(function(h, u) {
        h.tag === l.tag && h.kind === l.kind && h.multi === l.multi && (c = u);
      }), a[c] = l;
    }), a;
  }
  p(r, "compileList");
  function i() {
    const o = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    };
    function n(a) {
      a.multi ? (o.multi[a.kind].push(a), o.multi.fallback.push(a)) : o[a.kind][a.tag] = o.fallback[a.tag] = a;
    }
    p(n, "collectType");
    for (let a = 0, l = arguments.length; a < l; a += 1)
      arguments[a].forEach(n);
    return o;
  }
  p(i, "compileMap");
  function s(o) {
    return this.extend(o);
  }
  return p(s, "Schema2"), s.prototype.extend = /* @__PURE__ */ p(function(n) {
    let a = [], l = [];
    if (n instanceof t)
      l.push(n);
    else if (Array.isArray(n))
      l = l.concat(n);
    else if (n && (Array.isArray(n.implicit) || Array.isArray(n.explicit)))
      n.implicit && (a = a.concat(n.implicit)), n.explicit && (l = l.concat(n.explicit));
    else
      throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    a.forEach(function(h) {
      if (!(h instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (h.loadKind && h.loadKind !== "scalar")
        throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (h.multi)
        throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), l.forEach(function(h) {
      if (!(h instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const c = Object.create(s.prototype);
    return c.implicit = (this.implicit || []).concat(a), c.explicit = (this.explicit || []).concat(l), c.compiledImplicit = r(c, "implicit"), c.compiledExplicit = r(c, "explicit"), c.compiledTypeMap = i(c.compiledImplicit, c.compiledExplicit), c;
  }, "extend"), el = s, el;
}
p(Lc, "requireSchema");
var rl, Pf;
function Ac() {
  if (Pf) return rl;
  Pf = 1;
  const e = xe();
  return rl = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : "";
    }, "construct")
  }), rl;
}
p(Ac, "requireStr");
var il, Rf;
function Ec() {
  if (Rf) return il;
  Rf = 1;
  const e = xe();
  return il = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : [];
    }, "construct")
  }), il;
}
p(Ec, "requireSeq");
var sl, Nf;
function Fc() {
  if (Nf) return sl;
  Nf = 1;
  const e = xe();
  return sl = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : {};
    }, "construct")
  }), sl;
}
p(Fc, "requireMap");
var ol, qf;
function Mc() {
  if (qf) return ol;
  qf = 1;
  const e = Lc();
  return ol = new e({
    explicit: [
      Ac(),
      Ec(),
      Fc()
    ]
  }), ol;
}
p(Mc, "requireFailsafe");
var nl, Wf;
function $c() {
  if (Wf) return nl;
  Wf = 1;
  const e = xe();
  function t(s) {
    if (s === null) return !0;
    const o = s.length;
    return o === 1 && s === "~" || o === 4 && (s === "null" || s === "Null" || s === "NULL");
  }
  p(t, "resolveYamlNull");
  function r() {
    return null;
  }
  p(r, "constructYamlNull");
  function i(s) {
    return s === null;
  }
  return p(i, "isNull"), nl = new e("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: t,
    construct: r,
    predicate: i,
    represent: {
      canonical: /* @__PURE__ */ p(function() {
        return "~";
      }, "canonical"),
      lowercase: /* @__PURE__ */ p(function() {
        return "null";
      }, "lowercase"),
      uppercase: /* @__PURE__ */ p(function() {
        return "NULL";
      }, "uppercase"),
      camelcase: /* @__PURE__ */ p(function() {
        return "Null";
      }, "camelcase"),
      empty: /* @__PURE__ */ p(function() {
        return "";
      }, "empty")
    },
    defaultStyle: "lowercase"
  }), nl;
}
p($c, "require_null");
var al, zf;
function Oc() {
  if (zf) return al;
  zf = 1;
  const e = xe();
  function t(s) {
    if (s === null) return !1;
    const o = s.length;
    return o === 4 && (s === "true" || s === "True" || s === "TRUE") || o === 5 && (s === "false" || s === "False" || s === "FALSE");
  }
  p(t, "resolveYamlBoolean");
  function r(s) {
    return s === "true" || s === "True" || s === "TRUE";
  }
  p(r, "constructYamlBoolean");
  function i(s) {
    return Object.prototype.toString.call(s) === "[object Boolean]";
  }
  return p(i, "isBoolean"), al = new e("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: t,
    construct: r,
    predicate: i,
    represent: {
      lowercase: /* @__PURE__ */ p(function(s) {
        return s ? "true" : "false";
      }, "lowercase"),
      uppercase: /* @__PURE__ */ p(function(s) {
        return s ? "TRUE" : "FALSE";
      }, "uppercase"),
      camelcase: /* @__PURE__ */ p(function(s) {
        return s ? "True" : "False";
      }, "camelcase")
    },
    defaultStyle: "lowercase"
  }), al;
}
p(Oc, "requireBool");
var ll, Hf;
function Ic() {
  if (Hf) return ll;
  Hf = 1;
  const e = ws(), t = xe();
  function r(c) {
    return c >= 48 && c <= 57 || c >= 65 && c <= 70 || c >= 97 && c <= 102;
  }
  p(r, "isHexCode");
  function i(c) {
    return c >= 48 && c <= 55;
  }
  p(i, "isOctCode");
  function s(c) {
    return c >= 48 && c <= 57;
  }
  p(s, "isDecCode");
  function o(c) {
    if (c === null) return !1;
    const h = c.length;
    let u = 0, d = !1;
    if (!h) return !1;
    let f = c[u];
    if ((f === "-" || f === "+") && (f = c[++u]), f === "0") {
      if (u + 1 === h) return !0;
      if (f = c[++u], f === "b") {
        for (u++; u < h; u++) {
          if (f = c[u], f !== "0" && f !== "1") return !1;
          d = !0;
        }
        return d && isFinite(n(c));
      }
      if (f === "x") {
        for (u++; u < h; u++) {
          if (!r(c.charCodeAt(u))) return !1;
          d = !0;
        }
        return d && isFinite(n(c));
      }
      if (f === "o") {
        for (u++; u < h; u++) {
          if (!i(c.charCodeAt(u))) return !1;
          d = !0;
        }
        return d && isFinite(n(c));
      }
    }
    for (; u < h; u++) {
      if (!s(c.charCodeAt(u)))
        return !1;
      d = !0;
    }
    return d ? isFinite(n(c)) : !1;
  }
  p(o, "resolveYamlInteger");
  function n(c) {
    let h = c, u = 1, d = h[0];
    if ((d === "-" || d === "+") && (d === "-" && (u = -1), h = h.slice(1), d = h[0]), h === "0") return 0;
    if (d === "0") {
      if (h[1] === "b") return u * parseInt(h.slice(2), 2);
      if (h[1] === "x") return u * parseInt(h.slice(2), 16);
      if (h[1] === "o") return u * parseInt(h.slice(2), 8);
    }
    return u * parseInt(h, 10);
  }
  p(n, "parseYamlInteger");
  function a(c) {
    return n(c);
  }
  p(a, "constructYamlInteger");
  function l(c) {
    return Object.prototype.toString.call(c) === "[object Number]" && c % 1 === 0 && !e.isNegativeZero(c);
  }
  return p(l, "isInteger"), ll = new t("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: o,
    construct: a,
    predicate: l,
    represent: {
      binary: /* @__PURE__ */ p(function(c) {
        return c >= 0 ? "0b" + c.toString(2) : "-0b" + c.toString(2).slice(1);
      }, "binary"),
      octal: /* @__PURE__ */ p(function(c) {
        return c >= 0 ? "0o" + c.toString(8) : "-0o" + c.toString(8).slice(1);
      }, "octal"),
      decimal: /* @__PURE__ */ p(function(c) {
        return c.toString(10);
      }, "decimal"),
      hexadecimal: /* @__PURE__ */ p(function(c) {
        return c >= 0 ? "0x" + c.toString(16).toUpperCase() : "-0x" + c.toString(16).toUpperCase().slice(1);
      }, "hexadecimal")
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), ll;
}
p(Ic, "requireInt");
var hl, Yf;
function Dc() {
  if (Yf) return hl;
  Yf = 1;
  const e = ws(), t = xe(), r = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), i = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function s(c) {
    return c === null || !r.test(c) ? !1 : isFinite(parseFloat(c, 10)) ? !0 : i.test(c);
  }
  p(s, "resolveYamlFloat");
  function o(c) {
    let h = c.toLowerCase();
    const u = h[0] === "-" ? -1 : 1;
    return "+-".indexOf(h[0]) >= 0 && (h = h.slice(1)), h === ".inf" ? u === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : h === ".nan" ? NaN : u * parseFloat(h, 10);
  }
  p(o, "constructYamlFloat");
  const n = /^[-+]?[0-9]+e/;
  function a(c, h) {
    if (isNaN(c))
      switch (h) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === c)
      switch (h) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === c)
      switch (h) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (e.isNegativeZero(c))
      return "-0.0";
    const u = c.toString(10);
    return n.test(u) ? u.replace("e", ".e") : u;
  }
  p(a, "representYamlFloat");
  function l(c) {
    return Object.prototype.toString.call(c) === "[object Number]" && (c % 1 !== 0 || e.isNegativeZero(c));
  }
  return p(l, "isFloat"), hl = new t("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: s,
    construct: o,
    predicate: l,
    represent: a,
    defaultStyle: "lowercase"
  }), hl;
}
p(Dc, "requireFloat");
var cl, Uf;
function Pc() {
  return Uf || (Uf = 1, cl = Mc().extend({
    implicit: [
      $c(),
      Oc(),
      Ic(),
      Dc()
    ]
  })), cl;
}
p(Pc, "requireJson");
var ul, jf;
function Rc() {
  return jf || (jf = 1, ul = Pc()), ul;
}
p(Rc, "requireCore");
var dl, Xf;
function Nc() {
  if (Xf) return dl;
  Xf = 1;
  const e = xe(), t = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), r = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function i(n) {
    return n === null ? !1 : t.exec(n) !== null || r.exec(n) !== null;
  }
  p(i, "resolveYamlTimestamp");
  function s(n) {
    let a = 0, l = null, c = t.exec(n);
    if (c === null && (c = r.exec(n)), c === null) throw new Error("Date resolve error");
    const h = +c[1], u = +c[2] - 1, d = +c[3];
    if (!c[4])
      return new Date(Date.UTC(h, u, d));
    const f = +c[4], m = +c[5], y = +c[6];
    if (c[7]) {
      for (a = c[7].slice(0, 3); a.length < 3; )
        a += "0";
      a = +a;
    }
    if (c[9]) {
      const C = +c[10], b = +(c[11] || 0);
      l = (C * 60 + b) * 6e4, c[9] === "-" && (l = -l);
    }
    const x = new Date(Date.UTC(h, u, d, f, m, y, a));
    return l && x.setTime(x.getTime() - l), x;
  }
  p(s, "constructYamlTimestamp");
  function o(n) {
    return n.toISOString();
  }
  return p(o, "representYamlTimestamp"), dl = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: i,
    construct: s,
    instanceOf: Date,
    represent: o
  }), dl;
}
p(Nc, "requireTimestamp");
var fl, Gf;
function qc() {
  if (Gf) return fl;
  Gf = 1;
  const e = xe();
  function t(r) {
    return r === "<<" || r === null;
  }
  return p(t, "resolveYamlMerge"), fl = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: t
  }), fl;
}
p(qc, "requireMerge");
var pl, Vf;
function Wc() {
  if (Vf) return pl;
  Vf = 1;
  const e = xe(), t = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function r(n) {
    if (n === null) return !1;
    let a = 0;
    const l = n.length, c = t;
    for (let h = 0; h < l; h++) {
      const u = c.indexOf(n.charAt(h));
      if (!(u > 64)) {
        if (u < 0) return !1;
        a += 6;
      }
    }
    return a % 8 === 0;
  }
  p(r, "resolveYamlBinary");
  function i(n) {
    const a = n.replace(/[\r\n=]/g, ""), l = a.length, c = t;
    let h = 0;
    const u = [];
    for (let f = 0; f < l; f++)
      f % 4 === 0 && f && (u.push(h >> 16 & 255), u.push(h >> 8 & 255), u.push(h & 255)), h = h << 6 | c.indexOf(a.charAt(f));
    const d = l % 4 * 6;
    return d === 0 ? (u.push(h >> 16 & 255), u.push(h >> 8 & 255), u.push(h & 255)) : d === 18 ? (u.push(h >> 10 & 255), u.push(h >> 2 & 255)) : d === 12 && u.push(h >> 4 & 255), new Uint8Array(u);
  }
  p(i, "constructYamlBinary");
  function s(n) {
    let a = "", l = 0;
    const c = n.length, h = t;
    for (let d = 0; d < c; d++)
      d % 3 === 0 && d && (a += h[l >> 18 & 63], a += h[l >> 12 & 63], a += h[l >> 6 & 63], a += h[l & 63]), l = (l << 8) + n[d];
    const u = c % 3;
    return u === 0 ? (a += h[l >> 18 & 63], a += h[l >> 12 & 63], a += h[l >> 6 & 63], a += h[l & 63]) : u === 2 ? (a += h[l >> 10 & 63], a += h[l >> 4 & 63], a += h[l << 2 & 63], a += h[64]) : u === 1 && (a += h[l >> 2 & 63], a += h[l << 4 & 63], a += h[64], a += h[64]), a;
  }
  p(s, "representYamlBinary");
  function o(n) {
    return Object.prototype.toString.call(n) === "[object Uint8Array]";
  }
  return p(o, "isBinary"), pl = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: r,
    construct: i,
    predicate: o,
    represent: s
  }), pl;
}
p(Wc, "requireBinary");
var gl, Kf;
function zc() {
  if (Kf) return gl;
  Kf = 1;
  const e = xe(), t = Object.prototype.hasOwnProperty, r = Object.prototype.toString;
  function i(o) {
    if (o === null) return !0;
    const n = [], a = o;
    for (let l = 0, c = a.length; l < c; l += 1) {
      const h = a[l];
      let u = !1;
      if (r.call(h) !== "[object Object]") return !1;
      let d;
      for (d in h)
        if (t.call(h, d))
          if (!u) u = !0;
          else return !1;
      if (!u) return !1;
      if (n.indexOf(d) === -1) n.push(d);
      else return !1;
    }
    return !0;
  }
  p(i, "resolveYamlOmap");
  function s(o) {
    return o !== null ? o : [];
  }
  return p(s, "constructYamlOmap"), gl = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: i,
    construct: s
  }), gl;
}
p(zc, "requireOmap");
var ml, Zf;
function Hc() {
  if (Zf) return ml;
  Zf = 1;
  const e = xe(), t = Object.prototype.toString;
  function r(s) {
    if (s === null) return !0;
    const o = s, n = new Array(o.length);
    for (let a = 0, l = o.length; a < l; a += 1) {
      const c = o[a];
      if (t.call(c) !== "[object Object]") return !1;
      const h = Object.keys(c);
      if (h.length !== 1) return !1;
      n[a] = [h[0], c[h[0]]];
    }
    return !0;
  }
  p(r, "resolveYamlPairs");
  function i(s) {
    if (s === null) return [];
    const o = s, n = new Array(o.length);
    for (let a = 0, l = o.length; a < l; a += 1) {
      const c = o[a], h = Object.keys(c);
      n[a] = [h[0], c[h[0]]];
    }
    return n;
  }
  return p(i, "constructYamlPairs"), ml = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: r,
    construct: i
  }), ml;
}
p(Hc, "requirePairs");
var yl, Qf;
function Yc() {
  if (Qf) return yl;
  Qf = 1;
  const e = xe(), t = Object.prototype.hasOwnProperty;
  function r(s) {
    if (s === null) return !0;
    const o = s;
    for (const n in o)
      if (t.call(o, n) && o[n] !== null)
        return !1;
    return !0;
  }
  p(r, "resolveYamlSet");
  function i(s) {
    return s !== null ? s : {};
  }
  return p(i, "constructYamlSet"), yl = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: r,
    construct: i
  }), yl;
}
p(Yc, "requireSet");
var xl, Jf;
function da() {
  return Jf || (Jf = 1, xl = Rc().extend({
    implicit: [
      Nc(),
      qc()
    ],
    explicit: [
      Wc(),
      zc(),
      Hc(),
      Yc()
    ]
  })), xl;
}
p(da, "require_default");
var tp;
function xx() {
  if (tp) return Zo;
  tp = 1;
  const e = ws(), t = Ss(), r = yx(), i = da(), s = Object.prototype.hasOwnProperty, o = 1, n = 2, a = 3, l = 4, c = 1, h = 2, u = 3, d = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, f = /[\x85\u2028\u2029]/, m = /[,\[\]{}]/, y = /^(?:!|!!|![0-9A-Za-z-]+!)$/, x = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function C(g) {
    return Object.prototype.toString.call(g);
  }
  p(C, "_class");
  function b(g) {
    return g === 10 || g === 13;
  }
  p(b, "isEol");
  function w(g) {
    return g === 9 || g === 32;
  }
  p(w, "isWhiteSpace");
  function _(g) {
    return g === 9 || g === 32 || g === 10 || g === 13;
  }
  p(_, "isWsOrEol");
  function v(g) {
    return g === 44 || g === 91 || g === 93 || g === 123 || g === 125;
  }
  p(v, "isFlowIndicator");
  function E(g) {
    if (g >= 48 && g <= 57)
      return g - 48;
    const D = g | 32;
    return D >= 97 && D <= 102 ? D - 97 + 10 : -1;
  }
  p(E, "fromHexCode");
  function A(g) {
    return g === 120 ? 2 : g === 117 ? 4 : g === 85 ? 8 : 0;
  }
  p(A, "escapedHexLen");
  function L(g) {
    return g >= 48 && g <= 57 ? g - 48 : -1;
  }
  p(L, "fromDecimalCode");
  function z(g) {
    switch (g) {
      case 48:
        return "\0";
      case 97:
        return "\x07";
      case 98:
        return "\b";
      case 116:
        return "	";
      case 9:
        return "	";
      case 110:
        return `
`;
      case 118:
        return "\v";
      case 102:
        return "\f";
      case 114:
        return "\r";
      case 101:
        return "\x1B";
      case 32:
        return " ";
      case 34:
        return '"';
      case 47:
        return "/";
      case 92:
        return "\\";
      case 78:
        return "";
      case 95:
        return " ";
      case 76:
        return "\u2028";
      case 80:
        return "\u2029";
      default:
        return "";
    }
  }
  p(z, "simpleEscapeSequence");
  function W(g) {
    return g <= 65535 ? String.fromCharCode(g) : String.fromCharCode(
      (g - 65536 >> 10) + 55296,
      (g - 65536 & 1023) + 56320
    );
  }
  p(W, "charFromCodepoint");
  function R(g, D, X) {
    D === "__proto__" ? Object.defineProperty(g, D, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: X
    }) : g[D] = X;
  }
  p(R, "setProperty");
  const st = new Array(256), j = new Array(256);
  for (let g = 0; g < 256; g++)
    st[g] = z(g) ? 1 : 0, j[g] = z(g);
  function O(g, D) {
    this.input = g, this.filename = D.filename || null, this.schema = D.schema || i, this.onWarning = D.onWarning || null, this.legacy = D.legacy || !1, this.json = D.json || !1, this.listener = D.listener || null, this.maxDepth = typeof D.maxDepth == "number" ? D.maxDepth : 100, this.maxTotalMergeKeys = typeof D.maxTotalMergeKeys == "number" ? D.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = g.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  p(O, "State");
  function I(g, D) {
    const X = {
      name: g.filename,
      buffer: g.input.slice(0, -1),
      // omit trailing \0
      position: g.position,
      line: g.line,
      column: g.position - g.lineStart
    };
    return X.snippet = r(X), new t(D, X);
  }
  p(I, "generateError");
  function B(g, D) {
    throw I(g, D);
  }
  p(B, "throwError");
  function M(g, D) {
    g.onWarning && g.onWarning.call(null, I(g, D));
  }
  p(M, "throwWarning");
  function F(g, D, X) {
    const V = g.anchorMapTransactions;
    if (V.length !== 0) {
      const U = V[V.length - 1];
      s.call(U, D) || (U[D] = {
        existed: s.call(g.anchorMap, D),
        value: g.anchorMap[D]
      });
    }
    g.anchorMap[D] = X;
  }
  p(F, "storeAnchor");
  function Q(g) {
    g.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  p(Q, "beginAnchorTransaction");
  function Z(g) {
    const D = g.anchorMapTransactions.pop(), X = g.anchorMapTransactions;
    if (X.length === 0) return;
    const V = X[X.length - 1], U = Object.keys(D);
    for (let rt = 0, S = U.length; rt < S; rt += 1) {
      const N = U[rt];
      s.call(V, N) || (V[N] = D[N]);
    }
  }
  p(Z, "commitAnchorTransaction");
  function dt(g) {
    const D = g.anchorMapTransactions.pop(), X = Object.keys(D);
    for (let V = X.length - 1; V >= 0; V -= 1) {
      const U = D[X[V]];
      U.existed ? g.anchorMap[X[V]] = U.value : delete g.anchorMap[X[V]];
    }
  }
  p(dt, "rollbackAnchorTransaction");
  function wt(g) {
    return {
      position: g.position,
      line: g.line,
      lineStart: g.lineStart,
      lineIndent: g.lineIndent,
      firstTabInLine: g.firstTabInLine,
      tag: g.tag,
      anchor: g.anchor,
      kind: g.kind,
      result: g.result
    };
  }
  p(wt, "snapshotState");
  function yt(g, D) {
    g.position = D.position, g.line = D.line, g.lineStart = D.lineStart, g.lineIndent = D.lineIndent, g.firstTabInLine = D.firstTabInLine, g.tag = D.tag, g.anchor = D.anchor, g.kind = D.kind, g.result = D.result;
  }
  p(yt, "restoreState");
  const at = {
    YAML: /* @__PURE__ */ p(function(D, X, V) {
      D.version !== null && B(D, "duplication of %YAML directive"), V.length !== 1 && B(D, "YAML directive accepts exactly one argument");
      const U = /^([0-9]+)\.([0-9]+)$/.exec(V[0]);
      U === null && B(D, "ill-formed argument of the YAML directive");
      const rt = parseInt(U[1], 10), S = parseInt(U[2], 10);
      rt !== 1 && B(D, "unacceptable YAML version of the document"), D.version = V[0], D.checkLineBreaks = S < 2, S !== 1 && S !== 2 && M(D, "unsupported YAML version of the document");
    }, "handleYamlDirective"),
    TAG: /* @__PURE__ */ p(function(D, X, V) {
      let U;
      V.length !== 2 && B(D, "TAG directive accepts exactly two arguments");
      const rt = V[0];
      U = V[1], y.test(rt) || B(D, "ill-formed tag handle (first argument) of the TAG directive"), s.call(D.tagMap, rt) && B(D, 'there is a previously declared suffix for "' + rt + '" tag handle'), x.test(U) || B(D, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        U = decodeURIComponent(U);
      } catch {
        B(D, "tag prefix is malformed: " + U);
      }
      D.tagMap[rt] = U;
    }, "handleTagDirective")
  };
  function kt(g, D, X, V) {
    if (D < X) {
      const U = g.input.slice(D, X);
      if (V)
        for (let rt = 0, S = U.length; rt < S; rt += 1) {
          const N = U.charCodeAt(rt);
          N === 9 || N >= 32 && N <= 1114111 || B(g, "expected valid JSON character");
        }
      else d.test(U) && B(g, "the stream contains non-printable characters");
      g.result += U;
    }
  }
  p(kt, "captureSegment");
  function mt(g, D, X, V) {
    e.isObject(X) || B(g, "cannot merge mappings; the provided source object is unacceptable");
    const U = Object.keys(X);
    for (let rt = 0, S = U.length; rt < S; rt += 1) {
      const N = U[rt];
      g.maxTotalMergeKeys !== -1 && ++g.totalMergeKeys > g.maxTotalMergeKeys && B(g, "merge keys exceeded maxTotalMergeKeys (" + g.maxTotalMergeKeys + ")"), s.call(D, N) || (R(D, N, X[N]), V[N] = !0);
    }
  }
  p(mt, "mergeMappings");
  function _t(g, D, X, V, U, rt, S, N, tt) {
    if (Array.isArray(U)) {
      U = Array.prototype.slice.call(U);
      for (let G = 0, K = U.length; G < K; G += 1)
        Array.isArray(U[G]) && B(g, "nested arrays are not supported inside keys"), typeof U == "object" && C(U[G]) === "[object Object]" && (U[G] = "[object Object]");
    }
    if (typeof U == "object" && C(U) === "[object Object]" && (U = "[object Object]"), U = String(U), D === null && (D = {}), V === "tag:yaml.org,2002:merge")
      if (Array.isArray(rt))
        for (let G = 0, K = rt.length; G < K; G += 1)
          mt(g, D, rt[G], X);
      else
        mt(g, D, rt, X);
    else
      !g.json && !s.call(X, U) && s.call(D, U) && (g.line = S || g.line, g.lineStart = N || g.lineStart, g.position = tt || g.position, B(g, "duplicated mapping key")), R(D, U, rt), delete X[U];
    return D;
  }
  p(_t, "storeMappingPair");
  function Mt(g) {
    const D = g.input.charCodeAt(g.position);
    D === 10 ? g.position++ : D === 13 ? (g.position++, g.input.charCodeAt(g.position) === 10 && g.position++) : B(g, "a line break is expected"), g.line += 1, g.lineStart = g.position, g.firstTabInLine = -1;
  }
  p(Mt, "readLineBreak");
  function Lt(g, D, X) {
    let V = 0, U = g.input.charCodeAt(g.position);
    for (; U !== 0; ) {
      for (; w(U); )
        U === 9 && g.firstTabInLine === -1 && (g.firstTabInLine = g.position), U = g.input.charCodeAt(++g.position);
      if (D && U === 35)
        do
          U = g.input.charCodeAt(++g.position);
        while (U !== 10 && U !== 13 && U !== 0);
      if (b(U))
        for (Mt(g), U = g.input.charCodeAt(g.position), V++, g.lineIndent = 0; U === 32; )
          g.lineIndent++, U = g.input.charCodeAt(++g.position);
      else
        break;
    }
    return X !== -1 && V !== 0 && g.lineIndent < X && M(g, "deficient indentation"), V;
  }
  p(Lt, "skipSeparationSpace");
  function qt(g) {
    let D = g.position, X = g.input.charCodeAt(D);
    return !!((X === 45 || X === 46) && X === g.input.charCodeAt(D + 1) && X === g.input.charCodeAt(D + 2) && (D += 3, X = g.input.charCodeAt(D), X === 0 || _(X)));
  }
  p(qt, "testDocumentSeparator");
  function zt(g, D) {
    D === 1 ? g.result += " " : D > 1 && (g.result += e.repeat(`
`, D - 1));
  }
  p(zt, "writeFoldedLines");
  function le(g, D, X) {
    let V, U, rt, S, N, tt;
    const G = g.kind, K = g.result;
    let et = g.input.charCodeAt(g.position);
    if (_(et) || v(et) || et === 35 || et === 38 || et === 42 || et === 33 || et === 124 || et === 62 || et === 39 || et === 34 || et === 37 || et === 64 || et === 96)
      return !1;
    if (et === 63 || et === 45) {
      const J = g.input.charCodeAt(g.position + 1);
      if (_(J) || X && v(J))
        return !1;
    }
    for (g.kind = "scalar", g.result = "", V = U = g.position, rt = !1; et !== 0; ) {
      if (et === 58) {
        const J = g.input.charCodeAt(g.position + 1);
        if (_(J) || X && v(J))
          break;
      } else if (et === 35) {
        const J = g.input.charCodeAt(g.position - 1);
        if (_(J))
          break;
      } else {
        if (g.position === g.lineStart && qt(g) || X && v(et))
          break;
        if (b(et))
          if (S = g.line, N = g.lineStart, tt = g.lineIndent, Lt(g, !1, -1), g.lineIndent >= D) {
            rt = !0, et = g.input.charCodeAt(g.position);
            continue;
          } else {
            g.position = U, g.line = S, g.lineStart = N, g.lineIndent = tt;
            break;
          }
      }
      rt && (kt(g, V, U, !1), zt(g, g.line - S), V = U = g.position, rt = !1), w(et) || (U = g.position + 1), et = g.input.charCodeAt(++g.position);
    }
    return kt(g, V, U, !1), g.result ? !0 : (g.kind = G, g.result = K, !1);
  }
  p(le, "readPlainScalar");
  function _e(g, D) {
    let X, V, U = g.input.charCodeAt(g.position);
    if (U !== 39)
      return !1;
    for (g.kind = "scalar", g.result = "", g.position++, X = V = g.position; (U = g.input.charCodeAt(g.position)) !== 0; )
      if (U === 39)
        if (kt(g, X, g.position, !0), U = g.input.charCodeAt(++g.position), U === 39)
          X = g.position, g.position++, V = g.position;
        else
          return !0;
      else b(U) ? (kt(g, X, V, !0), zt(g, Lt(g, !1, D)), X = V = g.position) : g.position === g.lineStart && qt(g) ? B(g, "unexpected end of the document within a single quoted scalar") : (g.position++, w(U) || (V = g.position));
    B(g, "unexpected end of the stream within a single quoted scalar");
  }
  p(_e, "readSingleQuotedScalar");
  function Dt(g, D) {
    let X, V, U, rt = g.input.charCodeAt(g.position);
    if (rt !== 34)
      return !1;
    for (g.kind = "scalar", g.result = "", g.position++, X = V = g.position; (rt = g.input.charCodeAt(g.position)) !== 0; ) {
      if (rt === 34)
        return kt(g, X, g.position, !0), g.position++, !0;
      if (rt === 92) {
        if (kt(g, X, g.position, !0), rt = g.input.charCodeAt(++g.position), b(rt))
          Lt(g, !1, D);
        else if (rt < 256 && st[rt])
          g.result += j[rt], g.position++;
        else if ((U = A(rt)) > 0) {
          let S = U, N = 0;
          for (; S > 0; S--)
            rt = g.input.charCodeAt(++g.position), (U = E(rt)) >= 0 ? N = (N << 4) + U : B(g, "expected hexadecimal character");
          g.result += W(N), g.position++;
        } else
          B(g, "unknown escape sequence");
        X = V = g.position;
      } else b(rt) ? (kt(g, X, V, !0), zt(g, Lt(g, !1, D)), X = V = g.position) : g.position === g.lineStart && qt(g) ? B(g, "unexpected end of the document within a double quoted scalar") : (g.position++, w(rt) || (V = g.position));
    }
    B(g, "unexpected end of the stream within a double quoted scalar");
  }
  p(Dt, "readDoubleQuotedScalar");
  function kr(g, D) {
    let X = !0, V, U, rt;
    const S = g.tag;
    let N;
    const tt = g.anchor;
    let G, K, et, J;
    const ct = /* @__PURE__ */ Object.create(null);
    let ht, xt, St, $t = g.input.charCodeAt(g.position);
    if ($t === 91)
      G = 93, J = !1, N = [];
    else if ($t === 123)
      G = 125, J = !0, N = {};
    else
      return !1;
    for (g.anchor !== null && F(g, g.anchor, N), $t = g.input.charCodeAt(++g.position); $t !== 0; ) {
      if (Lt(g, !0, D), $t = g.input.charCodeAt(g.position), $t === G)
        return g.position++, g.tag = S, g.anchor = tt, g.kind = J ? "mapping" : "sequence", g.result = N, !0;
      if (X ? $t === 44 && B(g, "expected the node content, but found ','") : B(g, "missed comma between flow collection entries"), xt = ht = St = null, K = et = !1, $t === 63) {
        const Xt = g.input.charCodeAt(g.position + 1);
        _(Xt) && (K = et = !0, g.position++, Lt(g, !0, D));
      }
      V = g.line, U = g.lineStart, rt = g.position, be(g, D, o, !1, !0), xt = g.tag, ht = g.result, Lt(g, !0, D), $t = g.input.charCodeAt(g.position), (et || g.line === V) && $t === 58 && (K = !0, $t = g.input.charCodeAt(++g.position), Lt(g, !0, D), be(g, D, o, !1, !0), St = g.result), J ? _t(g, N, ct, xt, ht, St, V, U, rt) : K ? N.push(_t(g, null, ct, xt, ht, St, V, U, rt)) : N.push(ht), Lt(g, !0, D), $t = g.input.charCodeAt(g.position), $t === 44 ? (X = !0, $t = g.input.charCodeAt(++g.position)) : X = !1;
    }
    B(g, "unexpected end of the stream within a flow collection");
  }
  p(kr, "readFlowCollection");
  function Ut(g, D) {
    let X, V = c, U = !1, rt = !1, S = D, N = 0, tt = !1, G, K = g.input.charCodeAt(g.position);
    if (K === 124)
      X = !1;
    else if (K === 62)
      X = !0;
    else
      return !1;
    for (g.kind = "scalar", g.result = ""; K !== 0; )
      if (K = g.input.charCodeAt(++g.position), K === 43 || K === 45)
        c === V ? V = K === 43 ? u : h : B(g, "repeat of a chomping mode identifier");
      else if ((G = L(K)) >= 0)
        G === 0 ? B(g, "bad explicit indentation width of a block scalar; it cannot be less than one") : rt ? B(g, "repeat of an indentation width identifier") : (S = D + G - 1, rt = !0);
      else
        break;
    if (w(K)) {
      do
        K = g.input.charCodeAt(++g.position);
      while (w(K));
      if (K === 35)
        do
          K = g.input.charCodeAt(++g.position);
        while (!b(K) && K !== 0);
    }
    for (; K !== 0; ) {
      for (Mt(g), g.lineIndent = 0, K = g.input.charCodeAt(g.position); (!rt || g.lineIndent < S) && K === 32; )
        g.lineIndent++, K = g.input.charCodeAt(++g.position);
      if (!rt && g.lineIndent > S && (S = g.lineIndent), b(K)) {
        N++;
        continue;
      }
      if (!rt && S === 0 && B(g, "missing indentation for block scalar"), g.lineIndent < S) {
        V === u ? g.result += e.repeat(`
`, U ? 1 + N : N) : V === c && U && (g.result += `
`);
        break;
      }
      X ? w(K) ? (tt = !0, g.result += e.repeat(`
`, U ? 1 + N : N)) : tt ? (tt = !1, g.result += e.repeat(`
`, N + 1)) : N === 0 ? U && (g.result += " ") : g.result += e.repeat(`
`, N) : g.result += e.repeat(`
`, U ? 1 + N : N), U = !0, rt = !0, N = 0;
      const et = g.position;
      for (; !b(K) && K !== 0; )
        K = g.input.charCodeAt(++g.position);
      kt(g, et, g.position, !1);
    }
    return !0;
  }
  p(Ut, "readBlockScalar");
  function ve(g, D) {
    const X = g.tag, V = g.anchor, U = [];
    let rt = !1;
    if (g.firstTabInLine !== -1) return !1;
    g.anchor !== null && F(g, g.anchor, U);
    let S = g.input.charCodeAt(g.position);
    for (; S !== 0 && (g.firstTabInLine !== -1 && (g.position = g.firstTabInLine, B(g, "tab characters must not be used in indentation")), S === 45); ) {
      const N = g.input.charCodeAt(g.position + 1);
      if (!_(N))
        break;
      if (rt = !0, g.position++, Lt(g, !0, -1) && g.lineIndent <= D) {
        U.push(null), S = g.input.charCodeAt(g.position);
        continue;
      }
      const tt = g.line;
      if (be(g, D, a, !1, !0), U.push(g.result), Lt(g, !0, -1), S = g.input.charCodeAt(g.position), (g.line === tt || g.lineIndent > D) && S !== 0)
        B(g, "bad indentation of a sequence entry");
      else if (g.lineIndent < D)
        break;
    }
    return rt ? (g.tag = X, g.anchor = V, g.kind = "sequence", g.result = U, !0) : !1;
  }
  p(ve, "readBlockSequence");
  function he(g, D, X) {
    let V, U, rt, S;
    const N = g.tag, tt = g.anchor, G = {}, K = /* @__PURE__ */ Object.create(null);
    let et = null, J = null, ct = null, ht = !1, xt = !1;
    if (g.firstTabInLine !== -1) return !1;
    g.anchor !== null && F(g, g.anchor, G);
    let St = g.input.charCodeAt(g.position);
    for (; St !== 0; ) {
      !ht && g.firstTabInLine !== -1 && (g.position = g.firstTabInLine, B(g, "tab characters must not be used in indentation"));
      const $t = g.input.charCodeAt(g.position + 1), Xt = g.line;
      if ((St === 63 || St === 58) && _($t))
        St === 63 ? (ht && (_t(g, G, K, et, J, null, U, rt, S), et = J = ct = null), xt = !0, ht = !0, V = !0) : ht ? (ht = !1, V = !0) : B(g, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), g.position += 1, St = $t;
      else {
        if (U = g.line, rt = g.lineStart, S = g.position, !be(g, X, n, !1, !0))
          break;
        if (g.line === Xt) {
          for (St = g.input.charCodeAt(g.position); w(St); )
            St = g.input.charCodeAt(++g.position);
          if (St === 58)
            St = g.input.charCodeAt(++g.position), _(St) || B(g, "a whitespace character is expected after the key-value separator within a block mapping"), ht && (_t(g, G, K, et, J, null, U, rt, S), et = J = ct = null), xt = !0, ht = !1, V = !1, et = g.tag, J = g.result;
          else if (xt)
            B(g, "can not read an implicit mapping pair; a colon is missed");
          else
            return g.tag = N, g.anchor = tt, !0;
        } else if (xt)
          B(g, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return g.tag = N, g.anchor = tt, !0;
      }
      if ((g.line === Xt || g.lineIndent > D) && (ht && (U = g.line, rt = g.lineStart, S = g.position), be(g, D, l, !0, V) && (ht ? J = g.result : ct = g.result), ht || (_t(g, G, K, et, J, ct, U, rt, S), et = J = ct = null), Lt(g, !0, -1), St = g.input.charCodeAt(g.position)), (g.line === Xt || g.lineIndent > D) && St !== 0)
        B(g, "bad indentation of a mapping entry");
      else if (g.lineIndent < D)
        break;
    }
    return ht && _t(g, G, K, et, J, null, U, rt, S), xt && (g.tag = N, g.anchor = tt, g.kind = "mapping", g.result = G), xt;
  }
  p(he, "readBlockMapping");
  function Ge(g) {
    let D = !1, X = !1, V, U, rt = g.input.charCodeAt(g.position);
    if (rt !== 33) return !1;
    g.tag !== null && B(g, "duplication of a tag property"), rt = g.input.charCodeAt(++g.position), rt === 60 ? (D = !0, rt = g.input.charCodeAt(++g.position)) : rt === 33 ? (X = !0, V = "!!", rt = g.input.charCodeAt(++g.position)) : V = "!";
    let S = g.position;
    if (D) {
      do
        rt = g.input.charCodeAt(++g.position);
      while (rt !== 0 && rt !== 62);
      g.position < g.length ? (U = g.input.slice(S, g.position), rt = g.input.charCodeAt(++g.position)) : B(g, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; rt !== 0 && !_(rt); )
        rt === 33 && (X ? B(g, "tag suffix cannot contain exclamation marks") : (V = g.input.slice(S - 1, g.position + 1), y.test(V) || B(g, "named tag handle cannot contain such characters"), X = !0, S = g.position + 1)), rt = g.input.charCodeAt(++g.position);
      U = g.input.slice(S, g.position), m.test(U) && B(g, "tag suffix cannot contain flow indicator characters");
    }
    U && !x.test(U) && B(g, "tag name cannot contain such characters: " + U);
    try {
      U = decodeURIComponent(U);
    } catch {
      B(g, "tag name is malformed: " + U);
    }
    return D ? g.tag = U : s.call(g.tagMap, V) ? g.tag = g.tagMap[V] + U : V === "!" ? g.tag = "!" + U : V === "!!" ? g.tag = "tag:yaml.org,2002:" + U : B(g, 'undeclared tag handle "' + V + '"'), !0;
  }
  p(Ge, "readTagProperty");
  function wr(g) {
    let D = g.input.charCodeAt(g.position);
    if (D !== 38) return !1;
    g.anchor !== null && B(g, "duplication of an anchor property"), D = g.input.charCodeAt(++g.position);
    const X = g.position;
    for (; D !== 0 && !_(D) && !v(D); )
      D = g.input.charCodeAt(++g.position);
    return g.position === X && B(g, "name of an anchor node must contain at least one character"), g.anchor = g.input.slice(X, g.position), !0;
  }
  p(wr, "readAnchorProperty");
  function Ce(g) {
    let D = g.input.charCodeAt(g.position);
    if (D !== 42) return !1;
    D = g.input.charCodeAt(++g.position);
    const X = g.position;
    for (; D !== 0 && !_(D) && !v(D); )
      D = g.input.charCodeAt(++g.position);
    g.position === X && B(g, "name of an alias node must contain at least one character");
    const V = g.input.slice(X, g.position);
    return s.call(g.anchorMap, V) || B(g, 'unidentified alias "' + V + '"'), g.result = g.anchorMap[V], Lt(g, !0, -1), !0;
  }
  p(Ce, "readAlias");
  function Rr(g, D, X, V) {
    const U = wt(g);
    return Q(g), yt(g, D), g.tag = null, g.anchor = null, g.kind = null, g.result = null, he(g, X, V) && g.kind === "mapping" ? (Z(g), !0) : (dt(g), yt(g, U), !1);
  }
  p(Rr, "tryReadBlockMappingFromProperty");
  function be(g, D, X, V, U) {
    let rt, S, N = 1, tt = !1, G = !1, K = null, et, J, ct;
    g.depth >= g.maxDepth && B(g, "nesting exceeded maxDepth (" + g.maxDepth + ")"), g.depth += 1, g.listener !== null && g.listener("open", g), g.tag = null, g.anchor = null, g.kind = null, g.result = null;
    const ht = rt = S = l === X || a === X;
    if (V && Lt(g, !0, -1) && (tt = !0, g.lineIndent > D ? N = 1 : g.lineIndent === D ? N = 0 : g.lineIndent < D && (N = -1)), N === 1)
      for (; ; ) {
        const xt = g.input.charCodeAt(g.position), St = wt(g);
        if (tt && (xt === 33 && g.tag !== null || xt === 38 && g.anchor !== null) || !Ge(g) && !wr(g))
          break;
        K === null && (K = St), Lt(g, !0, -1) ? (tt = !0, S = ht, g.lineIndent > D ? N = 1 : g.lineIndent === D ? N = 0 : g.lineIndent < D && (N = -1)) : S = !1;
      }
    if (S && (S = tt || U), N === 1 || l === X)
      if (o === X || n === X ? J = D : J = D + 1, ct = g.position - g.lineStart, N === 1)
        if (S && (ve(g, ct) || he(g, ct, J)) || kr(g, J))
          G = !0;
        else {
          const xt = g.input.charCodeAt(g.position);
          K !== null && ht && !S && xt !== 124 && xt !== 62 && Rr(
            g,
            K,
            K.position - K.lineStart,
            J
          ) || rt && Ut(g, J) || _e(g, J) || Dt(g, J) ? G = !0 : Ce(g) ? (G = !0, (g.tag !== null || g.anchor !== null) && B(g, "alias node should not have any properties")) : le(g, J, o === X) && (G = !0, g.tag === null && (g.tag = "?")), g.anchor !== null && F(g, g.anchor, g.result);
        }
      else N === 0 && (G = S && ve(g, ct));
    if (g.tag === null)
      g.anchor !== null && F(g, g.anchor, g.result);
    else if (g.tag === "?") {
      g.result !== null && g.kind !== "scalar" && B(g, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + g.kind + '"');
      for (let xt = 0, St = g.implicitTypes.length; xt < St; xt += 1)
        if (et = g.implicitTypes[xt], et.resolve(g.result)) {
          g.result = et.construct(g.result), g.tag = et.tag, g.anchor !== null && F(g, g.anchor, g.result);
          break;
        }
    } else if (g.tag !== "!") {
      if (s.call(g.typeMap[g.kind || "fallback"], g.tag))
        et = g.typeMap[g.kind || "fallback"][g.tag];
      else {
        et = null;
        const xt = g.typeMap.multi[g.kind || "fallback"];
        for (let St = 0, $t = xt.length; St < $t; St += 1)
          if (g.tag.slice(0, xt[St].tag.length) === xt[St].tag) {
            et = xt[St];
            break;
          }
      }
      et || B(g, "unknown tag !<" + g.tag + ">"), g.result !== null && et.kind !== g.kind && B(g, "unacceptable node kind for !<" + g.tag + '> tag; it should be "' + et.kind + '", not "' + g.kind + '"'), et.resolve(g.result, g.tag) ? (g.result = et.construct(g.result, g.tag), g.anchor !== null && F(g, g.anchor, g.result)) : B(g, "cannot resolve a node with !<" + g.tag + "> explicit tag");
    }
    return g.listener !== null && g.listener("close", g), g.depth -= 1, g.tag !== null || g.anchor !== null || G;
  }
  p(be, "composeNode");
  function Nr(g) {
    const D = g.position;
    let X = !1, V;
    for (g.version = null, g.checkLineBreaks = g.legacy, g.tagMap = /* @__PURE__ */ Object.create(null), g.anchorMap = /* @__PURE__ */ Object.create(null); (V = g.input.charCodeAt(g.position)) !== 0 && (Lt(g, !0, -1), V = g.input.charCodeAt(g.position), !(g.lineIndent > 0 || V !== 37)); ) {
      X = !0, V = g.input.charCodeAt(++g.position);
      let U = g.position;
      for (; V !== 0 && !_(V); )
        V = g.input.charCodeAt(++g.position);
      const rt = g.input.slice(U, g.position), S = [];
      for (rt.length < 1 && B(g, "directive name must not be less than one character in length"); V !== 0; ) {
        for (; w(V); )
          V = g.input.charCodeAt(++g.position);
        if (V === 35) {
          do
            V = g.input.charCodeAt(++g.position);
          while (V !== 0 && !b(V));
          break;
        }
        if (b(V)) break;
        for (U = g.position; V !== 0 && !_(V); )
          V = g.input.charCodeAt(++g.position);
        S.push(g.input.slice(U, g.position));
      }
      V !== 0 && Mt(g), s.call(at, rt) ? at[rt](g, rt, S) : M(g, 'unknown document directive "' + rt + '"');
    }
    if (Lt(g, !0, -1), g.lineIndent === 0 && g.input.charCodeAt(g.position) === 45 && g.input.charCodeAt(g.position + 1) === 45 && g.input.charCodeAt(g.position + 2) === 45 ? (g.position += 3, Lt(g, !0, -1)) : X && B(g, "directives end mark is expected"), be(g, g.lineIndent - 1, l, !1, !0), Lt(g, !0, -1), g.checkLineBreaks && f.test(g.input.slice(D, g.position)) && M(g, "non-ASCII line breaks are interpreted as content"), g.documents.push(g.result), g.position === g.lineStart && qt(g)) {
      g.input.charCodeAt(g.position) === 46 && (g.position += 3, Lt(g, !0, -1));
      return;
    }
    g.position < g.length - 1 && B(g, "end of the stream or a document separator is expected");
  }
  p(Nr, "readDocument");
  function Sr(g, D) {
    g = String(g), D = D || {}, g.length !== 0 && (g.charCodeAt(g.length - 1) !== 10 && g.charCodeAt(g.length - 1) !== 13 && (g += `
`), g.charCodeAt(0) === 65279 && (g = g.slice(1)));
    const X = new O(g, D), V = g.indexOf("\0");
    for (V !== -1 && (X.position = V, B(X, "null byte is not allowed in input")), X.input += "\0"; X.input.charCodeAt(X.position) === 32; )
      X.lineIndent += 1, X.position += 1;
    for (; X.position < X.length - 1; )
      Nr(X);
    return X.documents;
  }
  p(Sr, "loadDocuments");
  function ke(g, D, X) {
    D !== null && typeof D == "object" && typeof X > "u" && (X = D, D = null);
    const V = Sr(g, X);
    if (typeof D != "function")
      return V;
    for (let U = 0, rt = V.length; U < rt; U += 1)
      D(V[U]);
  }
  p(ke, "loadAll2");
  function $e(g, D) {
    const X = Sr(g, D);
    if (X.length !== 0) {
      if (X.length === 1)
        return X[0];
      throw new t("expected a single document in the stream, but found more");
    }
  }
  return p($e, "load2"), Zo.loadAll = ke, Zo.load = $e, Zo;
}
p(xx, "requireLoader");
var Cl = {}, ep;
function Cx() {
  if (ep) return Cl;
  ep = 1;
  const e = ws(), t = Ss(), r = da(), i = Object.prototype.toString, s = Object.prototype.hasOwnProperty, o = 65279, n = 9, a = 10, l = 13, c = 32, h = 33, u = 34, d = 35, f = 37, m = 38, y = 39, x = 42, C = 44, b = 45, w = 58, _ = 61, v = 62, E = 63, A = 64, L = 91, z = 93, W = 96, R = 123, st = 124, j = 125, O = {};
  O[0] = "\\0", O[7] = "\\a", O[8] = "\\b", O[9] = "\\t", O[10] = "\\n", O[11] = "\\v", O[12] = "\\f", O[13] = "\\r", O[27] = "\\e", O[34] = '\\"', O[92] = "\\\\", O[133] = "\\N", O[160] = "\\_", O[8232] = "\\L", O[8233] = "\\P";
  const I = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], B = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function M(S, N) {
    if (N === null) return {};
    const tt = {}, G = Object.keys(N);
    for (let K = 0, et = G.length; K < et; K += 1) {
      let J = G[K], ct = String(N[J]);
      J.slice(0, 2) === "!!" && (J = "tag:yaml.org,2002:" + J.slice(2));
      const ht = S.compiledTypeMap.fallback[J];
      ht && s.call(ht.styleAliases, ct) && (ct = ht.styleAliases[ct]), tt[J] = ct;
    }
    return tt;
  }
  p(M, "compileStyleMap");
  function F(S) {
    let N, tt;
    const G = S.toString(16).toUpperCase();
    if (S <= 255)
      N = "x", tt = 2;
    else if (S <= 65535)
      N = "u", tt = 4;
    else if (S <= 4294967295)
      N = "U", tt = 8;
    else
      throw new t("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + N + e.repeat("0", tt - G.length) + G;
  }
  p(F, "encodeHex");
  const Q = 1, Z = 2;
  function dt(S) {
    this.schema = S.schema || r, this.indent = Math.max(1, S.indent || 2), this.noArrayIndent = S.noArrayIndent || !1, this.skipInvalid = S.skipInvalid || !1, this.flowLevel = e.isNothing(S.flowLevel) ? -1 : S.flowLevel, this.styleMap = M(this.schema, S.styles || null), this.sortKeys = S.sortKeys || !1, this.lineWidth = S.lineWidth || 80, this.noRefs = S.noRefs || !1, this.noCompatMode = S.noCompatMode || !1, this.condenseFlow = S.condenseFlow || !1, this.quotingType = S.quotingType === '"' ? Z : Q, this.forceQuotes = S.forceQuotes || !1, this.replacer = typeof S.replacer == "function" ? S.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  p(dt, "State");
  function wt(S, N) {
    const tt = e.repeat(" ", N);
    let G = 0, K = "";
    const et = S.length;
    for (; G < et; ) {
      let J;
      const ct = S.indexOf(`
`, G);
      ct === -1 ? (J = S.slice(G), G = et) : (J = S.slice(G, ct + 1), G = ct + 1), J.length && J !== `
` && (K += tt), K += J;
    }
    return K;
  }
  p(wt, "indentString");
  function yt(S, N) {
    return `
` + e.repeat(" ", S.indent * N);
  }
  p(yt, "generateNextLine");
  function at(S, N) {
    for (let tt = 0, G = S.implicitTypes.length; tt < G; tt += 1)
      if (S.implicitTypes[tt].resolve(N))
        return !0;
    return !1;
  }
  p(at, "testImplicitResolving");
  function kt(S) {
    return S === c || S === n;
  }
  p(kt, "isWhitespace");
  function mt(S) {
    return S >= 32 && S <= 126 || S >= 161 && S <= 55295 && S !== 8232 && S !== 8233 || S >= 57344 && S <= 65533 && S !== o || S >= 65536 && S <= 1114111;
  }
  p(mt, "isPrintable");
  function _t(S) {
    return mt(S) && S !== o && // - b-char
    S !== l && S !== a;
  }
  p(_t, "isNsCharOrWhitespace");
  function Mt(S, N, tt) {
    const G = _t(S), K = G && !kt(S);
    return (
      // ns-plain-safe
      (tt ? G : G && // - c-flow-indicator
      S !== C && S !== L && S !== z && S !== R && S !== j) && // ns-plain-char
      S !== d && // false on '#'
      !(N === w && !K) || // false on ': '
      _t(N) && !kt(N) && S === d || // change to true on '[^ ]#'
      N === w && K
    );
  }
  p(Mt, "isPlainSafe");
  function Lt(S) {
    return mt(S) && S !== o && !kt(S) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    S !== b && S !== E && S !== w && S !== C && S !== L && S !== z && S !== R && S !== j && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    S !== d && S !== m && S !== x && S !== h && S !== st && S !== _ && S !== v && S !== y && S !== u && // | “%” | “@” | “`”)
    S !== f && S !== A && S !== W;
  }
  p(Lt, "isPlainSafeFirst");
  function qt(S) {
    return !kt(S) && S !== w;
  }
  p(qt, "isPlainSafeLast");
  function zt(S, N) {
    const tt = S.charCodeAt(N);
    let G;
    return tt >= 55296 && tt <= 56319 && N + 1 < S.length && (G = S.charCodeAt(N + 1), G >= 56320 && G <= 57343) ? (tt - 55296) * 1024 + G - 56320 + 65536 : tt;
  }
  p(zt, "codePointAt");
  function le(S) {
    return /^\n* /.test(S);
  }
  p(le, "needIndentIndicator");
  const _e = 1, Dt = 2, kr = 3, Ut = 4, ve = 5;
  function he(S, N, tt, G, K, et, J, ct) {
    let ht, xt = 0, St = null, $t = !1, Xt = !1;
    const _s = G !== -1;
    let ir = -1, sr = Lt(zt(S, 0)) && qt(zt(S, S.length - 1));
    if (N || J)
      for (ht = 0; ht < S.length; xt >= 65536 ? ht += 2 : ht++) {
        if (xt = zt(S, ht), !mt(xt))
          return ve;
        sr = sr && Mt(xt, St, ct), St = xt;
      }
    else {
      for (ht = 0; ht < S.length; xt >= 65536 ? ht += 2 : ht++) {
        if (xt = zt(S, ht), xt === a)
          $t = !0, _s && (Xt = Xt || // Foldable line = too long, and not more-indented.
          ht - ir - 1 > G && S[ir + 1] !== " ", ir = ht);
        else if (!mt(xt))
          return ve;
        sr = sr && Mt(xt, St, ct), St = xt;
      }
      Xt = Xt || _s && ht - ir - 1 > G && S[ir + 1] !== " ";
    }
    return !$t && !Xt ? sr && !J && !K(S) ? _e : et === Z ? ve : Dt : tt > 9 && le(S) ? ve : J ? et === Z ? ve : Dt : Xt ? Ut : kr;
  }
  p(he, "chooseScalarStyle");
  function Ge(S, N, tt, G, K) {
    S.dump = (function() {
      if (N.length === 0)
        return S.quotingType === Z ? '""' : "''";
      if (!S.noCompatMode && (I.indexOf(N) !== -1 || B.test(N)))
        return S.quotingType === Z ? '"' + N + '"' : "'" + N + "'";
      const et = S.indent * Math.max(1, tt), J = S.lineWidth === -1 ? -1 : Math.max(Math.min(S.lineWidth, 40), S.lineWidth - et), ct = G || // No block styles in flow mode.
      S.flowLevel > -1 && tt >= S.flowLevel;
      function ht(xt) {
        return at(S, xt);
      }
      switch (p(ht, "testAmbiguity"), he(
        N,
        ct,
        S.indent,
        J,
        ht,
        S.quotingType,
        S.forceQuotes && !G,
        K
      )) {
        case _e:
          return N;
        case Dt:
          return "'" + N.replace(/'/g, "''") + "'";
        case kr:
          return "|" + wr(N, S.indent) + Ce(wt(N, et));
        case Ut:
          return ">" + wr(N, S.indent) + Ce(wt(Rr(N, J), et));
        case ve:
          return '"' + Nr(N) + '"';
        default:
          throw new t("impossible error: invalid scalar style");
      }
    })();
  }
  p(Ge, "writeScalar");
  function wr(S, N) {
    const tt = le(S) ? String(N) : "", G = S[S.length - 1] === `
`, et = G && (S[S.length - 2] === `
` || S === `
`) ? "+" : G ? "" : "-";
    return tt + et + `
`;
  }
  p(wr, "blockHeader");
  function Ce(S) {
    return S[S.length - 1] === `
` ? S.slice(0, -1) : S;
  }
  p(Ce, "dropEndingNewline");
  function Rr(S, N) {
    const tt = /(\n+)([^\n]*)/g;
    let G = (function() {
      let ct = S.indexOf(`
`);
      return ct = ct !== -1 ? ct : S.length, tt.lastIndex = ct, be(S.slice(0, ct), N);
    })(), K = S[0] === `
` || S[0] === " ", et, J;
    for (; J = tt.exec(S); ) {
      const ct = J[1], ht = J[2];
      et = ht[0] === " ", G += ct + (!K && !et && ht !== "" ? `
` : "") + be(ht, N), K = et;
    }
    return G;
  }
  p(Rr, "foldString");
  function be(S, N) {
    if (S === "" || S[0] === " ") return S;
    const tt = / [^ ]/g;
    let G, K = 0, et, J = 0, ct = 0, ht = "";
    for (; G = tt.exec(S); )
      ct = G.index, ct - K > N && (et = J > K ? J : ct, ht += `
` + S.slice(K, et), K = et + 1), J = ct;
    return ht += `
`, S.length - K > N && J > K ? ht += S.slice(K, J) + `
` + S.slice(J + 1) : ht += S.slice(K), ht.slice(1);
  }
  p(be, "foldLine");
  function Nr(S) {
    let N = "", tt = 0;
    for (let G = 0; G < S.length; tt >= 65536 ? G += 2 : G++) {
      tt = zt(S, G);
      const K = O[tt];
      !K && mt(tt) ? (N += S[G], tt >= 65536 && (N += S[G + 1])) : N += K || F(tt);
    }
    return N;
  }
  p(Nr, "escapeString");
  function Sr(S, N, tt) {
    let G = "";
    const K = S.tag;
    for (let et = 0, J = tt.length; et < J; et += 1) {
      let ct = tt[et];
      S.replacer && (ct = S.replacer.call(tt, String(et), ct)), (X(S, N, ct, !1, !1) || typeof ct > "u" && X(S, N, null, !1, !1)) && (G !== "" && (G += "," + (S.condenseFlow ? "" : " ")), G += S.dump);
    }
    S.tag = K, S.dump = "[" + G + "]";
  }
  p(Sr, "writeFlowSequence");
  function ke(S, N, tt, G) {
    let K = "";
    const et = S.tag;
    for (let J = 0, ct = tt.length; J < ct; J += 1) {
      let ht = tt[J];
      S.replacer && (ht = S.replacer.call(tt, String(J), ht)), (X(S, N + 1, ht, !0, !0, !1, !0) || typeof ht > "u" && X(S, N + 1, null, !0, !0, !1, !0)) && ((!G || K !== "") && (K += yt(S, N)), S.dump && a === S.dump.charCodeAt(0) ? K += "-" : K += "- ", K += S.dump);
    }
    S.tag = et, S.dump = K || "[]";
  }
  p(ke, "writeBlockSequence");
  function $e(S, N, tt) {
    let G = "";
    const K = S.tag, et = Object.keys(tt);
    for (let J = 0, ct = et.length; J < ct; J += 1) {
      let ht = "";
      G !== "" && (ht += ", "), S.condenseFlow && (ht += '"');
      const xt = et[J];
      let St = tt[xt];
      S.replacer && (St = S.replacer.call(tt, xt, St)), X(S, N, xt, !1, !1) && (S.dump.length > 1024 && (ht += "? "), ht += S.dump + (S.condenseFlow ? '"' : "") + ":" + (S.condenseFlow ? "" : " "), X(S, N, St, !1, !1) && (ht += S.dump, G += ht));
    }
    S.tag = K, S.dump = "{" + G + "}";
  }
  p($e, "writeFlowMapping");
  function g(S, N, tt, G) {
    let K = "";
    const et = S.tag, J = Object.keys(tt);
    if (S.sortKeys === !0)
      J.sort();
    else if (typeof S.sortKeys == "function")
      J.sort(S.sortKeys);
    else if (S.sortKeys)
      throw new t("sortKeys must be a boolean or a function");
    for (let ct = 0, ht = J.length; ct < ht; ct += 1) {
      let xt = "";
      (!G || K !== "") && (xt += yt(S, N));
      const St = J[ct];
      let $t = tt[St];
      if (S.replacer && ($t = S.replacer.call(tt, St, $t)), !X(S, N + 1, St, !0, !0, !0))
        continue;
      const Xt = S.tag !== null && S.tag !== "?" || S.dump && S.dump.length > 1024;
      Xt && (S.dump && a === S.dump.charCodeAt(0) ? xt += "?" : xt += "? "), xt += S.dump, Xt && (xt += yt(S, N)), X(S, N + 1, $t, !0, Xt) && (S.dump && a === S.dump.charCodeAt(0) ? xt += ":" : xt += ": ", xt += S.dump, K += xt);
    }
    S.tag = et, S.dump = K || "{}";
  }
  p(g, "writeBlockMapping");
  function D(S, N, tt) {
    const G = tt ? S.explicitTypes : S.implicitTypes;
    for (let K = 0, et = G.length; K < et; K += 1) {
      const J = G[K];
      if ((J.instanceOf || J.predicate) && (!J.instanceOf || typeof N == "object" && N instanceof J.instanceOf) && (!J.predicate || J.predicate(N))) {
        if (tt ? J.multi && J.representName ? S.tag = J.representName(N) : S.tag = J.tag : S.tag = "?", J.represent) {
          const ct = S.styleMap[J.tag] || J.defaultStyle;
          let ht;
          if (i.call(J.represent) === "[object Function]")
            ht = J.represent(N, ct);
          else if (s.call(J.represent, ct))
            ht = J.represent[ct](N, ct);
          else
            throw new t("!<" + J.tag + '> tag resolver accepts not "' + ct + '" style');
          S.dump = ht;
        }
        return !0;
      }
    }
    return !1;
  }
  p(D, "detectType");
  function X(S, N, tt, G, K, et, J) {
    S.tag = null, S.dump = tt, D(S, tt, !1) || D(S, tt, !0);
    const ct = i.call(S.dump), ht = G;
    G && (G = S.flowLevel < 0 || S.flowLevel > N);
    const xt = ct === "[object Object]" || ct === "[object Array]";
    let St, $t;
    if (xt && (St = S.duplicates.indexOf(tt), $t = St !== -1), (S.tag !== null && S.tag !== "?" || $t || S.indent !== 2 && N > 0) && (K = !1), $t && S.usedDuplicates[St])
      S.dump = "*ref_" + St;
    else {
      if (xt && $t && !S.usedDuplicates[St] && (S.usedDuplicates[St] = !0), ct === "[object Object]")
        G && Object.keys(S.dump).length !== 0 ? (g(S, N, S.dump, K), $t && (S.dump = "&ref_" + St + S.dump)) : ($e(S, N, S.dump), $t && (S.dump = "&ref_" + St + " " + S.dump));
      else if (ct === "[object Array]")
        G && S.dump.length !== 0 ? (S.noArrayIndent && !J && N > 0 ? ke(S, N - 1, S.dump, K) : ke(S, N, S.dump, K), $t && (S.dump = "&ref_" + St + S.dump)) : (Sr(S, N, S.dump), $t && (S.dump = "&ref_" + St + " " + S.dump));
      else if (ct === "[object String]")
        S.tag !== "?" && Ge(S, S.dump, N, et, ht);
      else {
        if (ct === "[object Undefined]")
          return !1;
        if (S.skipInvalid) return !1;
        throw new t("unacceptable kind of an object to dump " + ct);
      }
      if (S.tag !== null && S.tag !== "?") {
        let Xt = encodeURI(
          S.tag[0] === "!" ? S.tag.slice(1) : S.tag
        ).replace(/!/g, "%21");
        S.tag[0] === "!" ? Xt = "!" + Xt : Xt.slice(0, 18) === "tag:yaml.org,2002:" ? Xt = "!!" + Xt.slice(18) : Xt = "!<" + Xt + ">", S.dump = Xt + " " + S.dump;
      }
    }
    return !0;
  }
  p(X, "writeNode");
  function V(S, N) {
    const tt = [], G = [];
    U(S, tt, G);
    const K = G.length;
    for (let et = 0; et < K; et += 1)
      N.duplicates.push(tt[G[et]]);
    N.usedDuplicates = new Array(K);
  }
  p(V, "getDuplicateReferences");
  function U(S, N, tt) {
    if (S !== null && typeof S == "object") {
      const G = N.indexOf(S);
      if (G !== -1)
        tt.indexOf(G) === -1 && tt.push(G);
      else if (N.push(S), Array.isArray(S))
        for (let K = 0, et = S.length; K < et; K += 1)
          U(S[K], N, tt);
      else {
        const K = Object.keys(S);
        for (let et = 0, J = K.length; et < J; et += 1)
          U(S[K[et]], N, tt);
      }
    }
  }
  p(U, "inspectNode");
  function rt(S, N) {
    N = N || {};
    const tt = new dt(N);
    tt.noRefs || V(S, tt);
    let G = S;
    return tt.replacer && (G = tt.replacer.call({ "": G }, "", G)), X(tt, 0, G, !0, !0) ? tt.dump + `
` : "";
  }
  return p(rt, "dump2"), Cl.dump = rt, Cl;
}
p(Cx, "requireDumper");
var rp;
function bx() {
  if (rp) return de;
  rp = 1;
  const e = xx(), t = Cx();
  function r(i, s) {
    return function() {
      throw new Error("Function yaml." + i + " is removed in js-yaml 4. Use yaml." + s + " instead, which is now safe by default.");
    };
  }
  return p(r, "renamed"), de.Type = xe(), de.Schema = Lc(), de.FAILSAFE_SCHEMA = Mc(), de.JSON_SCHEMA = Pc(), de.CORE_SCHEMA = Rc(), de.DEFAULT_SCHEMA = da(), de.load = e.load, de.loadAll = e.loadAll, de.dump = t.dump, de.YAMLException = Ss(), de.types = {
    binary: Wc(),
    float: Dc(),
    map: Fc(),
    null: $c(),
    pairs: Hc(),
    set: Yc(),
    timestamp: Nc(),
    bool: Oc(),
    int: Ic(),
    merge: qc(),
    omap: zc(),
    seq: Ec(),
    str: Ac()
  }, de.safeLoad = r("safeLoad", "load"), de.safeLoadAll = r("safeLoadAll", "loadAll"), de.safeDump = r("safeDump", "dump"), de;
}
p(bx, "requireJsYaml");
var uM = bx(), dM = /* @__PURE__ */ mx(uM), {
  Type: DI,
  Schema: PI,
  FAILSAFE_SCHEMA: RI,
  JSON_SCHEMA: fM,
  CORE_SCHEMA: NI,
  DEFAULT_SCHEMA: qI,
  load: pM,
  loadAll: WI,
  dump: zI,
  YAMLException: HI,
  types: YI,
  safeLoad: UI,
  safeLoadAll: jI,
  safeDump: XI
} = dM, gM = {
  common: So,
  getConfig: Kt,
  insertCluster: S0,
  insertEdge: v0,
  insertEdgeLabel: xc,
  insertMarkers: A0,
  insertNode: yc,
  interpolateToCurve: Gh,
  labelHelper: Ct,
  log: q,
  positionEdgeLabel: zB
}, yo = {}, kx = /* @__PURE__ */ p((e) => {
  for (const t of e)
    yo[t.name] = t;
}, "registerLayoutLoaders"), mM = /* @__PURE__ */ p(() => {
  kx([
    {
      name: "dagre",
      loader: /* @__PURE__ */ p(async () => await import("./dagre-GXQ25YYZ-AsRMN-Lv.js"), "loader")
    },
    {
      name: "swimlane",
      loader: /* @__PURE__ */ p(async () => await import("./swimlanes-42K2YHIH-Co740Zje.js"), "loader")
    },
    {
      name: "cose-bilkent",
      loader: /* @__PURE__ */ p(async () => await import("./cose-bilkent-JH36ORCC-D5HB5nY8.js"), "loader")
    }
  ]);
}, "registerDefaultLayoutLoaders");
mM();
var GI = /* @__PURE__ */ p(async (e, t) => {
  if (!(e.layoutAlgorithm in yo))
    throw new Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
  if (e.diagramId)
    for (const h of e.nodes) {
      const u = h.domId || h.id;
      h.domId = `${e.diagramId}-${u}`;
    }
  const r = yo[e.layoutAlgorithm], i = await r.loader(), { theme: s, themeVariables: o } = e.config, { useGradient: n, gradientStart: a, gradientStop: l } = o, c = t.attr("id");
  if (t.append("defs").append("filter").attr("id", `${c}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${s?.includes("dark") ? "#FFFFFF" : "#000000"}`), t.append("defs").append("filter").attr("id", `${c}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${s?.includes("dark") ? "#FFFFFF" : "#000000"}`), n) {
    const h = t.append("linearGradient").attr("id", t.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    h.append("svg:stop").attr("offset", "0%").attr("stop-color", a).attr("stop-opacity", 1), h.append("svg:stop").attr("offset", "100%").attr("stop-color", l).attr("stop-opacity", 1);
  }
  return i.render(e, t, gM, {
    algorithm: r.algorithm
  });
}, "render"), VI = /* @__PURE__ */ p((e = "", { fallback: t = "dagre" } = {}) => {
  if (e in yo)
    return e;
  if (t in yo)
    return q.warn(`Layout algorithm ${e} is not registered. Using ${t} as fallback.`), t;
  throw new Error(`Both layout algorithms ${e} and ${t} are not registered.`);
}, "getRegisteredLayoutAlgorithm"), Uc = "comm", wx = "rule", Sx = "decl", yM = "@media", xM = "@import", CM = "@supports", bM = "@namespace", dh = "@keyframes", Tx = "@layer", kM = "@scope", wM = Math.abs, oo = String.fromCharCode;
function _x(e) {
  return e.trim();
}
function fh(e, t, r) {
  return e.replace(t, r);
}
function Gi(e, t) {
  return e.charCodeAt(t) | 0;
}
function ms(e, t, r) {
  return e.slice(t, r);
}
function cr(e) {
  return e.length;
}
function vx(e) {
  return e.length;
}
function Qo(e, t) {
  return t.push(e), e;
}
var fa = 1, ys = 1, Bx = 0, Ye = 0, ee = 0, Ts = "";
function jc(e, t, r, i, s, o, n, a) {
  return { value: e, root: t, parent: r, type: i, props: s, children: o, line: fa, column: ys, length: n, return: "", siblings: a };
}
function SM() {
  return ee;
}
function TM() {
  return ee = Ye > 0 ? Gi(Ts, --Ye) : 0, ys--, ee === 10 && (ys = 1, fa--), ee;
}
function Je() {
  return ee = Ye < Bx ? Gi(Ts, Ye++) : 0, ys++, ee === 10 && (ys = 1, fa++), ee;
}
function Gr() {
  return Gi(Ts, Ye);
}
function dn() {
  return Ye;
}
function pa(e, t) {
  return ms(Ts, e, t);
}
function xo(e) {
  switch (e) {
    // \0 \t \n \r \s whitespace token
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    // ! + , / > @ ~ isolate token
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    // ; { } breakpoint token
    case 59:
    case 123:
    case 125:
      return 4;
    // : accompanied token
    case 58:
      return 3;
    // " ' ( [ opening delimit token
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    // ) ] closing delimit token
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function _M(e) {
  return fa = ys = 1, Bx = cr(Ts = e), Ye = 0, [];
}
function vM(e) {
  return Ts = "", e;
}
function bl(e) {
  return _x(pa(Ye - 1, ph(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function BM(e) {
  for (; (ee = Gr()) && ee < 33; )
    Je();
  return xo(e) > 2 || xo(ee) > 3 ? "" : " ";
}
function LM(e, t) {
  for (; --t && Je() && !(ee < 48 || ee > 102 || ee > 57 && ee < 65 || ee > 70 && ee < 97); )
    ;
  return pa(e, dn() + (t < 6 && Gr() == 32 && Je() == 32));
}
function ph(e) {
  for (; Je(); )
    switch (ee) {
      // ] ) " '
      case e:
        return Ye;
      // " '
      case 34:
      case 39:
        e !== 34 && e !== 39 && ph(ee);
        break;
      // (
      case 40:
        e === 41 && ph(e);
        break;
      // \
      case 92:
        Je();
        break;
    }
  return Ye;
}
function AM(e, t) {
  for (; Je() && e + ee !== 57; )
    if (e + ee === 84 && Gr() === 47)
      break;
  return "/*" + pa(t, Ye - 1) + "*" + oo(e === 47 ? e : Je());
}
function EM(e) {
  for (; !xo(Gr()); )
    Je();
  return pa(e, Ye);
}
function FM(e) {
  return vM(fn("", null, null, null, [""], e = _M(e), 0, [0], e));
}
function fn(e, t, r, i, s, o, n, a, l) {
  for (var c = 0, h = 0, u = n, d = 0, f = 0, m = 0, y = 1, x = 1, C = 1, b = 0, w = 0, _ = "", v = s, E = o, A = i, L = _; x; )
    switch (m = w, w = Je()) {
      // (
      case 40:
        m != 108 && Gi(L, u - 1) == 58 ? (b++, L += "(") : L += bl(w);
        break;
      // )
      case 41:
        b--, L += ")";
        break;
      // " ' [
      case 34:
      case 39:
      case 91:
        L += bl(w);
        break;
      // \t \n \r \s
      case 9:
      case 10:
      case 13:
      case 32:
        if (b > 0) {
          L += oo(w);
          break;
        }
        L += BM(m);
        break;
      // \
      case 92:
        L += LM(dn() - 1, 7);
        continue;
      // /
      case 47:
        switch (Gr()) {
          case 42:
          case 47:
            Qo(MM(AM(Je(), dn()), t, r, l), l), (xo(m || 1) == 5 || xo(Gr() || 1) == 5) && cr(L) && ms(L, -1, void 0) !== " " && (L += " ");
            break;
          default:
            L += "/";
        }
        break;
      // {
      case 123 * y:
        a[c++] = cr(L) * C;
      // } ; \0
      case 125 * y:
      case 59:
      case 0:
        if (b > 0 && w) {
          L += oo(w);
          break;
        }
        switch (w) {
          // \0 }
          case 0:
          case 125:
            x = 0;
          // ;
          case 59 + h:
            C == -1 && (L = fh(L, /\f/g, "")), f > 0 && (cr(L) - u || y === 0) && Qo(f > 32 ? sp(L + ";", i, r, u - 1, l) : sp(fh(L, " ", "") + ";", i, r, u - 2, l), l);
            break;
          // @ ;
          case 59:
            L += ";";
          // { rule/at-rule
          default:
            if (Qo(A = ip(L, t, r, c, h, s, a, _, v = [], E = [], u, o), o), w === 123)
              if (h === 0)
                fn(L, t, A, A, v, o, u, a, E);
              else {
                switch (d) {
                  // c(ontainer)
                  case 99:
                    if (Gi(L, 3) === 110) break;
                  // l(ayer)
                  case 108:
                    if (Gi(L, 2) === 97) break;
                  default:
                    h = 0;
                  // d(ocument) m(edia) s(upports)
                  case 100:
                  case 109:
                  case 115:
                }
                h ? fn(e, A, A, i && Qo(ip(e, A, A, 0, 0, s, a, _, s, v = [], u, E), E), s, E, u, a, i ? v : E) : fn(L, A, A, A, [""], E, 0, a, E);
              }
        }
        c = h = f = 0, y = C = 1, _ = L = "", u = n;
        break;
      // :
      case 58:
        u = 1 + cr(L), f = m;
      default:
        if (y < 1) {
          if (w == 123)
            --y;
          else if (w == 125 && y++ == 0 && TM() == 125)
            continue;
        }
        switch (L += oo(w), w * y) {
          // &
          case 38:
            C = h > 0 ? 1 : (L += "\f", -1);
            break;
          // ,
          case 44:
            if (b > 0) break;
            a[c++] = (cr(L) - 1) * C, C = 1;
            break;
          // @
          case 64:
            Gr() === 45 && (L += bl(Je())), d = Gr(), h = u = cr(_ = L += EM(dn())), w++;
            break;
          // -
          case 45:
            m === 45 && cr(L) == 2 && (y = 0);
        }
    }
  return o;
}
function ip(e, t, r, i, s, o, n, a, l, c, h, u) {
  for (var d = s - 1, f = s === 0 ? o : [""], m = vx(f), y = 0, x = 0, C = 0; y < i; ++y)
    for (var b = 0, w = ms(e, d + 1, d = wM(x = n[y])), _ = e; b < m; ++b)
      (_ = _x(x > 0 ? f[b] + " " + w : fh(w, /&\f/g, f[b]))) && (l[C++] = _);
  return jc(e, t, r, s === 0 ? wx : a, l, c, h, u);
}
function MM(e, t, r, i) {
  return jc(e, t, r, Uc, oo(SM()), ms(e, 2, -2), 0, i);
}
function sp(e, t, r, i, s) {
  return jc(e, t, r, Sx, ms(e, 0, i), ms(e, i + 1, -1), i, s);
}
function gh(e, t) {
  for (var r = "", i = 0; i < e.length; i++)
    r += t(e[i], i, e, t) || "";
  return r;
}
function $M(e, t, r, i) {
  switch (e.type) {
    case Tx:
      if (e.children.length) break;
    case xM:
    case bM:
    case Sx:
      return e.return = e.return || e.value;
    case Uc:
      return "";
    case dh:
      return e.return = e.value + "{" + gh(e.children, i) + "}";
    case wx:
      if (!cr(e.value = e.props.join(","))) return "";
  }
  return cr(r = gh(e.children, i)) ? e.return = e.value + "{" + r + "}" : "";
}
function OM(e) {
  var t = vx(e);
  return function(r, i, s, o) {
    for (var n = "", a = 0; a < t; a++)
      n += e[a](r, i, s, o) || "";
    return n;
  };
}
var Lx = "c4", IM = /* @__PURE__ */ p((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"), DM = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./c4Diagram-7LVT6UL2-CY3pKWHf.js");
  return { id: Lx, diagram: e };
}, "loader"), PM = {
  id: Lx,
  detector: IM,
  loader: DM
}, RM = PM, Ax = "flowchart", NM = /* @__PURE__ */ p((e, t) => t?.flowchart?.defaultRenderer === "dagre-wrapper" || t?.flowchart?.defaultRenderer === "elk" ? !1 : /^\s*graph/.test(e), "detector"), qM = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-Bx4d2t8v.js").then((t) => t.f);
  return { id: Ax, diagram: e };
}, "loader"), WM = {
  id: Ax,
  detector: NM,
  loader: qM
}, zM = WM, Ex = "flowchart-v2", HM = /* @__PURE__ */ p((e, t) => t?.flowchart?.defaultRenderer === "dagre-d3" ? !1 : (t?.flowchart?.defaultRenderer === "elk" && (t.layout = "elk"), /^\s*graph/.test(e) && t?.flowchart?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*flowchart/.test(e)), "detector"), YM = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-Bx4d2t8v.js").then((t) => t.f);
  return { id: Ex, diagram: e };
}, "loader"), UM = {
  id: Ex,
  detector: HM,
  loader: YM
}, jM = UM, Fx = "swimlane", XM = /* @__PURE__ */ p((e) => /^\s*swimlane-beta\b/.test(e), "detector"), GM = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./swimlanesDiagram-VR7AAH4N-4-exThf-.js");
  return { id: Fx, diagram: e };
}, "loader"), VM = {
  id: Fx,
  detector: XM,
  loader: GM
}, KM = VM, Mx = "er", ZM = /* @__PURE__ */ p((e) => /^\s*erDiagram/.test(e), "detector"), QM = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./erDiagram-RLTQ6QDP-BQ6UywPl.js");
  return { id: Mx, diagram: e };
}, "loader"), JM = {
  id: Mx,
  detector: ZM,
  loader: QM
}, t5 = JM, $x = "gitGraph", e5 = /* @__PURE__ */ p((e) => /^\s*gitGraph/.test(e), "detector"), r5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./gitGraphDiagram-WWUBYQGX-DK_eEEh3.js");
  return { id: $x, diagram: e };
}, "loader"), i5 = {
  id: $x,
  detector: e5,
  loader: r5
}, s5 = i5, Ox = "gantt", o5 = /* @__PURE__ */ p((e) => /^\s*gantt/.test(e), "detector"), n5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ganttDiagram-EL5Y4UJY-B5XMAzhw.js");
  return { id: Ox, diagram: e };
}, "loader"), a5 = {
  id: Ox,
  detector: o5,
  loader: n5
}, l5 = a5, Ix = "info", h5 = /* @__PURE__ */ p((e) => /^\s*info/.test(e), "detector"), c5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./infoDiagram-27XIBGKW-dLMBgmGz.js");
  return { id: Ix, diagram: e };
}, "loader"), u5 = {
  id: Ix,
  detector: h5,
  loader: c5
}, Dx = "pie", d5 = /* @__PURE__ */ p((e) => /^\s*pie/.test(e), "detector"), f5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./pieDiagram-E7YTZNPT-CrLT_X7r.js");
  return { id: Dx, diagram: e };
}, "loader"), p5 = {
  id: Dx,
  detector: d5,
  loader: f5
}, Px = "quadrantChart", g5 = /* @__PURE__ */ p((e) => /^\s*quadrantChart/.test(e), "detector"), m5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./quadrantDiagram-AXDQQJYC-tg-Z97OZ.js");
  return { id: Px, diagram: e };
}, "loader"), y5 = {
  id: Px,
  detector: g5,
  loader: m5
}, x5 = y5, Rx = "xychart", C5 = /* @__PURE__ */ p((e) => /^\s*xychart(-beta)?/.test(e), "detector"), b5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./xychartDiagram-S5SC5T6Z-CWUIQyPs.js");
  return { id: Rx, diagram: e };
}, "loader"), k5 = {
  id: Rx,
  detector: C5,
  loader: b5
}, w5 = k5, Nx = "requirement", S5 = /* @__PURE__ */ p((e) => /^\s*requirement(Diagram)?/.test(e), "detector"), T5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./requirementDiagram-BXWQKSXE-De34sjPQ.js");
  return { id: Nx, diagram: e };
}, "loader"), _5 = {
  id: Nx,
  detector: S5,
  loader: T5
}, v5 = _5, qx = "sequence", B5 = /* @__PURE__ */ p((e) => /^\s*sequenceDiagram/.test(e), "detector"), L5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./sequenceDiagram-WJ2MYXX4-Fx9UJJ4J.js");
  return { id: qx, diagram: e };
}, "loader"), A5 = {
  id: qx,
  detector: B5,
  loader: L5
}, E5 = A5, Wx = "class", F5 = /* @__PURE__ */ p((e, t) => t?.class?.defaultRenderer === "dagre-wrapper" ? !1 : /^\s*classDiagram/.test(e), "detector"), M5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./classDiagram-ZZMXUADV-DIyRwVz5.js");
  return { id: Wx, diagram: e };
}, "loader"), $5 = {
  id: Wx,
  detector: F5,
  loader: M5
}, O5 = $5, zx = "classDiagram", I5 = /* @__PURE__ */ p((e, t) => /^\s*classDiagram/.test(e) && t?.class?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*classDiagram-v2/.test(e), "detector"), D5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./classDiagram-v2-VYDZK3BY-DIyRwVz5.js");
  return { id: zx, diagram: e };
}, "loader"), P5 = {
  id: zx,
  detector: I5,
  loader: D5
}, R5 = P5, Hx = "state", N5 = /* @__PURE__ */ p((e, t) => t?.state?.defaultRenderer === "dagre-wrapper" ? !1 : /^\s*stateDiagram/.test(e), "detector"), q5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./stateDiagram-D77RDMKH-BgaSydtG.js");
  return { id: Hx, diagram: e };
}, "loader"), W5 = {
  id: Hx,
  detector: N5,
  loader: q5
}, z5 = W5, Yx = "stateDiagram", H5 = /* @__PURE__ */ p((e, t) => !!(/^\s*stateDiagram-v2/.test(e) || /^\s*stateDiagram/.test(e) && t?.state?.defaultRenderer === "dagre-wrapper"), "detector"), Y5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./stateDiagram-v2-MP3YSRHH-Bf-aBFrm.js");
  return { id: Yx, diagram: e };
}, "loader"), U5 = {
  id: Yx,
  detector: H5,
  loader: Y5
}, j5 = U5, Ux = "journey", X5 = /* @__PURE__ */ p((e) => /^\s*journey/.test(e), "detector"), G5 = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./journeyDiagram-3NMN7TZE-DCnGjxOZ.js");
  return { id: Ux, diagram: e };
}, "loader"), V5 = {
  id: Ux,
  detector: X5,
  loader: G5
}, K5 = V5, Z5 = /* @__PURE__ */ p((e, t, r) => {
  q.debug(`rendering svg for syntax error
`);
  const i = yT(t), s = i.append("g");
  i.attr("viewBox", "0 0 2412 512"), rg(i, 100, 512, !0), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"
  ), s.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text"), s.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${r}`);
}, "draw"), jx = { draw: Z5 }, Q5 = jx, J5 = {
  db: {},
  renderer: jx,
  parser: {
    parse: /* @__PURE__ */ p(() => {
    }, "parse")
  }
}, t$ = J5, Xx = "flowchart-elk", e$ = /* @__PURE__ */ p((e, t = {}) => (
  // If diagram explicitly states flowchart-elk
  /^\s*flowchart-elk/.test(e) || // If a flowchart/graph diagram has their default renderer set to elk
  /^\s*(flowchart|graph)/.test(e) && t?.flowchart?.defaultRenderer === "elk" ? (t.layout = "elk", !0) : !1
), "detector"), r$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-Bx4d2t8v.js").then((t) => t.f);
  return { id: Xx, diagram: e };
}, "loader"), i$ = {
  id: Xx,
  detector: e$,
  loader: r$
}, s$ = i$, Gx = "timeline", o$ = /* @__PURE__ */ p((e) => /^\s*timeline/.test(e), "detector"), n$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./timeline-definition-24CTP7MA-3ESp9YOx.js");
  return { id: Gx, diagram: e };
}, "loader"), a$ = {
  id: Gx,
  detector: o$,
  loader: n$
}, l$ = a$, Vx = "mindmap", h$ = /* @__PURE__ */ p((e) => /^\s*mindmap/.test(e), "detector"), c$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./mindmap-definition-YA3MSWOX-D4_JaDDQ.js");
  return { id: Vx, diagram: e };
}, "loader"), u$ = {
  id: Vx,
  detector: h$,
  loader: c$
}, d$ = u$, Kx = "kanban", f$ = /* @__PURE__ */ p((e) => /^\s*kanban/.test(e), "detector"), p$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./kanban-definition-UXKFOSKX-DaREB3sn.js");
  return { id: Kx, diagram: e };
}, "loader"), g$ = {
  id: Kx,
  detector: f$,
  loader: p$
}, m$ = g$, Zx = "sankey", y$ = /* @__PURE__ */ p((e) => /^\s*sankey(-beta)?/.test(e), "detector"), x$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./sankeyDiagram-P5KCCOFB-9WzrqoF-.js");
  return { id: Zx, diagram: e };
}, "loader"), C$ = {
  id: Zx,
  detector: y$,
  loader: x$
}, b$ = C$, Qx = "packet", k$ = /* @__PURE__ */ p((e) => /^\s*packet(-beta)?/.test(e), "detector"), w$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-Z3DM3KII-CV58ZTOE.js");
  return { id: Qx, diagram: e };
}, "loader"), S$ = {
  id: Qx,
  detector: k$,
  loader: w$
}, Jx = "radar", T$ = /* @__PURE__ */ p((e) => /^\s*radar-beta/.test(e), "detector"), _$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-UQ7AKVKN-BPfu-Rsi.js");
  return { id: Jx, diagram: e };
}, "loader"), v$ = {
  id: Jx,
  detector: T$,
  loader: _$
}, tC = "block", B$ = /* @__PURE__ */ p((e) => /^\s*block(-beta)?/.test(e), "detector"), L$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./blockDiagram-I7D4REHJ-BtAIqYz6.js");
  return { id: tC, diagram: e };
}, "loader"), A$ = {
  id: tC,
  detector: B$,
  loader: L$
}, E$ = A$, eC = "treeView", F$ = /* @__PURE__ */ p((e) => /^\s*treeView-beta/.test(e), "detector"), M$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-S7CK7UJ4-DUjvWlDW.js");
  return { id: eC, diagram: e };
}, "loader"), $$ = {
  id: eC,
  detector: F$,
  loader: M$
}, O$ = $$, rC = "architecture", I$ = /* @__PURE__ */ p((e) => /^\s*architecture/.test(e), "detector"), D$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./architectureDiagram-5GKGNRK7-CWPyusf9.js");
  return { id: rC, diagram: e };
}, "loader"), P$ = {
  id: rC,
  detector: I$,
  loader: D$
}, R$ = P$, iC = "eventmodeling", N$ = /* @__PURE__ */ p((e) => /^\s*eventmodeling/.test(e), "detector"), q$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-VSXAHHWV-YRy3Odyf.js");
  return { id: iC, diagram: e };
}, "loader"), W$ = {
  id: iC,
  detector: N$,
  loader: q$
}, z$ = W$, sC = "ishikawa", H$ = /* @__PURE__ */ p((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"), Y$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ishikawaDiagram-5VMMS53U-CXK6u5Is.js");
  return { id: sC, diagram: e };
}, "loader"), U$ = {
  id: sC,
  detector: H$,
  loader: Y$
}, oC = "venn", j$ = /* @__PURE__ */ p((e) => /^\s*venn-beta/.test(e), "detector"), X$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./vennDiagram-4TSXK5OY-bAtnP7oe.js");
  return { id: oC, diagram: e };
}, "loader"), G$ = {
  id: oC,
  detector: j$,
  loader: X$
}, V$ = G$, nC = "treemap", K$ = /* @__PURE__ */ p((e) => /^\s*treemap/.test(e), "detector"), Z$ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-VX7I27RA-DA_f3Cy8.js");
  return { id: nC, diagram: e };
}, "loader"), Q$ = {
  id: nC,
  detector: K$,
  loader: Z$
}, aC = "wardley", J$ = /* @__PURE__ */ p((e) => /^\s*wardley-beta/i.test(e), "detector"), tO = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./wardleyDiagram-VM6X3IG4-Cp-PaE9W.js");
  return { id: aC, diagram: e };
}, "loader"), eO = {
  id: aC,
  detector: J$,
  loader: tO
}, rO = eO, lC = "cynefin", iO = /* @__PURE__ */ p((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"), sO = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./cynefinDiagram-5FMLGOSQ-DPgbRM6q.js");
  return { id: lC, diagram: e };
}, "loader"), oO = {
  id: lC,
  detector: iO,
  loader: sO
}, hC = "railroad", nO = /* @__PURE__ */ p((e) => /^\s*railroad-beta/i.test(e), "detector"), aO = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./railroadDiagram-O6MQD6OU-88gO87sM.js");
  return { id: hC, diagram: e };
}, "loader"), lO = {
  id: hC,
  detector: nO,
  loader: aO
}, cC = "railroadEbnf", hO = /* @__PURE__ */ p((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"), cO = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ebnfDiagram-PWID7BFC-BKc3ElfZ.js");
  return { id: cC, diagram: e };
}, "loader"), uO = {
  id: cC,
  detector: hO,
  loader: cO
}, uC = "railroadAbnf", dO = /* @__PURE__ */ p((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"), fO = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./abnfDiagram-VCTEODGH-hHufE6Nw.js");
  return { id: uC, diagram: e };
}, "loader"), pO = {
  id: uC,
  detector: dO,
  loader: fO
}, dC = "railroadPeg", gO = /* @__PURE__ */ p((e) => /^\s*railroad-peg-beta/i.test(e), "detector"), mO = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./pegDiagram-XKGWAZYB-l7BPRxX7.js");
  return { id: dC, diagram: e };
}, "loader"), yO = {
  id: dC,
  detector: gO,
  loader: mO
}, op = !1, ga = /* @__PURE__ */ p(() => {
  op || (op = !0, Cn("error", t$, (e) => e.toLowerCase().trim() === "error"), Cn(
    "---",
    // --- diagram type may appear if YAML front-matter is not parsed correctly
    {
      db: {
        clear: /* @__PURE__ */ p(() => {
        }, "clear")
      },
      styles: {},
      // should never be used
      renderer: {
        draw: /* @__PURE__ */ p(() => {
        }, "draw")
      },
      parser: {
        parse: /* @__PURE__ */ p(() => {
          throw new Error(
            "Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks"
          );
        }, "parse")
      },
      init: /* @__PURE__ */ p(() => null, "init")
      // no op
    },
    (e) => e.toLowerCase().trimStart().startsWith("---")
  ), Fl(s$, d$, R$), Fl(
    RM,
    m$,
    R5,
    O5,
    t5,
    l5,
    u5,
    p5,
    v5,
    E5,
    KM,
    jM,
    zM,
    l$,
    s5,
    j5,
    z5,
    K5,
    x5,
    b$,
    S$,
    w5,
    E$,
    z$,
    O$,
    v$,
    U$,
    Q$,
    lO,
    uO,
    pO,
    yO,
    V$,
    rO,
    oO
  ));
}, "addDiagrams"), xO = /* @__PURE__ */ p(async () => {
  q.debug("Loading registered diagrams");
  const t = (await Promise.allSettled(
    Object.entries(yi).map(async ([r, { detector: i, loader: s }]) => {
      if (s)
        try {
          Il(r);
        } catch {
          try {
            const { diagram: o, id: n } = await s();
            Cn(n, o, i);
          } catch (o) {
            throw q.error(`Failed to load external diagram with key ${r}. Removing from detectors.`), delete yi[r], o;
          }
        }
    })
  )).filter((r) => r.status === "rejected");
  if (t.length > 0) {
    q.error(`Failed to load ${t.length} external diagrams`);
    for (const r of t)
      q.error(r);
    throw new Error(`Failed to load ${t.length} external diagrams`);
  }
}, "loadRegisteredDiagrams"), CO = "graphics-document document";
function fC(e, t) {
  e.attr("role", CO), t !== "" && e.attr("aria-roledescription", t);
}
p(fC, "setA11yDiagramInfo");
function pC(e, t, r, i) {
  if (e.insert !== void 0) {
    if (r) {
      const s = `chart-desc-${i}`;
      e.attr("aria-describedby", s), e.insert("desc", ":first-child").attr("id", s).text(r);
    }
    if (t) {
      const s = `chart-title-${i}`;
      e.attr("aria-labelledby", s), e.insert("title", ":first-child").attr("id", s).text(t);
    }
  }
}
p(pC, "addSVGa11yTitleDescription");
var gi, mh = (gi = class {
  constructor(t, r, i, s, o) {
    this.type = t, this.text = r, this.db = i, this.parser = s, this.renderer = o;
  }
  static async fromText(t, r = {}) {
    const i = Kt(), s = vh(t, i);
    t = N_(t) + `
`;
    try {
      Il(s);
    } catch {
      const c = uk(s);
      if (!c)
        throw new Kp(`Diagram ${s} not found.`);
      const { id: h, diagram: u } = await c();
      Cn(h, u);
    }
    const { db: o, parser: n, renderer: a, init: l } = Il(s);
    return n.parser && (n.parser.yy = o), o.clear?.(), l?.(i), r.title && o.setDiagramTitle?.(r.title), await n.parse(t), new gi(s, t, o, n, a);
  }
  async render(t, r) {
    await this.renderer.draw(this.text, t, r, this);
  }
  getParser() {
    return this.parser;
  }
  getType() {
    return this.type;
  }
}, p(gi, "Diagram"), gi), np = [], bO = /* @__PURE__ */ p(() => {
  np.forEach((e) => {
    e();
  }), np = [];
}, "attachFunctions"), kO = /* @__PURE__ */ p((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function gC(e) {
  const t = e.match(Vp);
  if (!t)
    return {
      text: e,
      metadata: {}
    };
  const r = t[1], i = r ? t[2].split(`
`).map((n) => n.startsWith(r) ? n.slice(r.length) : n).join(`
`) : t[2];
  let s = pM(i, {
    // To support config, we need JSON schema.
    // https://www.yaml.org/spec/1.2/spec.html#id2803231
    schema: fM
  }) ?? {};
  s = typeof s == "object" && !Array.isArray(s) ? s : {};
  const o = {};
  return s.displayMode && (o.displayMode = s.displayMode.toString()), s.title && (o.title = s.title.toString()), s.config && (o.config = s.config), {
    text: e.slice(t[0].length),
    metadata: o
  };
}
p(gC, "extractFrontMatter");
var wO = /* @__PURE__ */ p((e) => e.replace(/\r\n?/g, `
`).replace(
  /<(\w+)([^>]*)>/g,
  (t, r, i) => "<" + r + i.replace(/="([^"]*)"/g, "='$1'") + ">"
), "cleanupText"), SO = /* @__PURE__ */ p((e) => {
  const { text: t, metadata: r } = gC(e), { displayMode: i, title: s, config: o = {} } = r;
  return i && (o.gantt || (o.gantt = {}), o.gantt.displayMode = i), { title: s, config: o, text: t };
}, "processFrontmatter"), TO = /* @__PURE__ */ p((e) => {
  const t = me.detectInit(e) ?? {}, r = me.detectDirective(e, "wrap");
  return Array.isArray(r) ? t.wrap = r.some(({ type: i }) => i === "wrap") : r?.type === "wrap" && (t.wrap = !0), {
    text: v_(e),
    directive: t
  };
}, "processDirectives");
function Xc(e) {
  const t = wO(e), r = SO(t), i = TO(r.text), s = Jh(r.config, i.directive);
  return e = kO(i.text), {
    code: e,
    title: r.title,
    config: s
  };
}
p(Xc, "preprocessDiagram");
function mC(e) {
  const t = new TextEncoder().encode(e), r = Array.from(t, (i) => String.fromCodePoint(i)).join("");
  return btoa(r);
}
p(mC, "toBase64");
var _O = 5e4, vO = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", BO = "sandbox", LO = "loose", AO = "http://www.w3.org/2000/svg", EO = "http://www.w3.org/1999/xlink", FO = "http://www.w3.org/1999/xhtml", MO = "100%", $O = "100%", OO = "border:0;margin:0;", IO = "margin:0", DO = "allow-top-navigation-by-user-activation allow-popups", PO = 'The "iframe" tag is not supported by your browser.', RO = ["foreignobject"], NO = ["dominant-baseline"];
function Gc(e) {
  const t = Xc(e);
  return yn(), ak(t.config ?? {}), t;
}
p(Gc, "processAndSetConfigs");
async function yC(e, t) {
  ga();
  try {
    const { code: r, config: i } = Gc(e);
    return { diagramType: (await CC(r)).type, config: i };
  } catch (r) {
    if (t?.suppressErrors)
      return !1;
    throw r;
  }
}
p(yC, "parse");
var ap = /* @__PURE__ */ p((e, t, r = []) => {
  const i = Yp(`{ ${r.join(" !important; ")} !important; }`);
  return `.${e} ${t} ${i}`;
}, "cssImportantStyles"), qO = /* @__PURE__ */ p((e, t = /* @__PURE__ */ new Map()) => {
  const r = new CSSStyleSheet();
  if (e.fontFamily !== void 0 && r.insertRule(
    `:root { --mermaid-font-family: ${e.fontFamily}}`,
    r.cssRules.length
  ), e.altFontFamily !== void 0 && r.insertRule(
    `:root { --mermaid-alt-font-family: ${e.altFontFamily}}`,
    r.cssRules.length
  ), t instanceof Map) {
    const a = ye(e) ? ["> *", "span"] : ["rect", "polygon", "ellipse", "circle", "path"];
    t.forEach((l) => {
      gd(l.styles) || a.forEach((c) => {
        r.insertRule(
          ap(l.id, c, l.styles),
          r.cssRules.length
        );
      }), gd(l.textStyles) || r.insertRule(
        ap(
          l.id,
          "tspan",
          (l?.textStyles || []).map((c) => c.replace("color", "fill"))
        ),
        r.cssRules.length
      );
    });
  }
  let i = "";
  if (e.themeCSS !== void 0)
    if (typeof r.replaceSync == "function") {
      const s = new CSSStyleSheet();
      s.replaceSync(e.themeCSS), i = Ol(s) + `
`;
    } else
      i += `${e.themeCSS}
`;
  return i + Ol(r);
}, "createCssStyles"), WO = /* @__PURE__ */ p((e, t) => gh(
  FM(`${e}{${t}}`),
  OM([
    /* @__PURE__ */ p(function(i, s, o, n) {
      if (i.type === "rule" && Array.isArray(i.props)) {
        if (i.parent && i.parent.type === dh)
          return;
        i.props = i.props.map((a) => a === e && Array.isArray(i.children) && i.children.every((c) => c.type !== "decl" ? !1 : (/* @__PURE__ */ new Set([
          "font-family",
          "font-size",
          "fill"
        ])).has(c.props)) || // If the prop already starts with the namespace followed by a space or >, then it's already namespaced.
        (a.startsWith(`${e} `) || a.startsWith(`${e}>`)) && // Column combinators are not yet widely supported, it's not yet compressed to `${namespace}||`,
        // so we need to add an extra check for that
        !a.startsWith(`${e} ||`) ? a : `${e} ${a}`);
      } else i.type.startsWith("@") && ([
        ...[
          yM,
          CM,
          Tx,
          kM,
          "@container",
          "@starting-style"
        ],
        dh
        // needed for Mermaid's animation feature
      ].includes(i.type) || (q.warn(`Removing unsupported at-rule ${i.type} from CSS`), i.type = Uc));
    }, "addNamespace"),
    $M
  ])
), "compileCSS"), zO = /* @__PURE__ */ p((e, t, r, i) => {
  const s = qO(e, r), o = Ak(
    t,
    s,
    { ...e.themeVariables, theme: e.theme, look: e.look },
    i
  );
  return WO(i, o);
}, "createUserStyles"), HO = /* @__PURE__ */ p((e = "", t, r) => {
  let i = e;
  return !r && !t && (i = i.replace(
    /marker-end="url\([\d+./:=?A-Za-z-]*?#/g,
    'marker-end="url(#'
  )), i = Zr(i), i = i.replace(/<br>/g, "<br/>"), i;
}, "cleanUpSvgCode"), YO = /* @__PURE__ */ p((e = "", t) => {
  const r = t?.viewBox?.baseVal?.height ? t.viewBox.baseVal.height + "px" : $O, i = mC(`<body style="${IO}">${e}</body>`);
  return `<iframe style="width:${MO};height:${r};${OO}" src="data:text/html;charset=UTF-8;base64,${i}" sandbox="${DO}">
  ${PO}
</iframe>`;
}, "putIntoIFrame"), lp = /* @__PURE__ */ p((e, t, r, i, s) => {
  const o = e.append("div");
  o.attr("id", r), i && o.attr("style", i);
  const n = o.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", AO);
  return s && n.attr("xmlns:xlink", s), n.append("g"), e;
}, "appendDivSvgG");
function yh(e, t) {
  return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
p(yh, "sandboxedIframe");
var UO = /* @__PURE__ */ p((e, t, r, i) => {
  e.getElementById(t)?.remove(), e.getElementById(r)?.remove(), e.getElementById(i)?.remove();
}, "removeExistingElements"), jO = /* @__PURE__ */ p(async function(e, t, r) {
  ga();
  const i = Gc(t);
  t = i.code;
  const s = Kt();
  q.debug(s), t.length > (s?.maxTextSize ?? _O) && (t = vO);
  const o = `#${e}`, n = "i" + e, a = "#" + n, l = "d" + e, c = "#" + l, h = /* @__PURE__ */ p(() => {
    const O = Et(d ? a : c).node();
    O && "remove" in O && O.remove();
  }, "removeTempElements");
  let u = Et(document.body);
  const d = s.securityLevel === BO, f = s.securityLevel === LO, m = s.fontFamily;
  if (r !== void 0) {
    if (r && (r.innerHTML = ""), d) {
      const j = yh(Et(r), n);
      u = Et(j.nodes()[0].contentDocument.body), u.node().style.margin = "0";
    } else
      u = Et(r);
    lp(u, e, l, `font-family: ${m}`, EO);
  } else {
    if (UO(document, e, l, n), d) {
      const j = yh(Et(document.body), n);
      u = Et(j.nodes()[0].contentDocument.body), u.node().style.margin = "0";
    } else
      u = Et("body");
    lp(u, e, l);
  }
  let y, x;
  try {
    y = await mh.fromText(t, { title: i.title });
  } catch (j) {
    if (s.suppressErrorRendering)
      throw h(), j;
    y = await mh.fromText("error"), x = j;
  }
  const C = u.select(c).node(), b = y.type, w = C.firstChild, _ = w.firstChild, v = y.renderer.getClasses?.(t, y), E = zO(s, b, v, o), A = document.createElement("style");
  A.innerHTML = E, w.insertBefore(A, _);
  try {
    await y.renderer.draw(t, e, "11.17.2", y);
  } catch (j) {
    throw s.suppressErrorRendering ? h() : Q5.draw(t, e, "11.17.2"), j;
  }
  const L = u.select(`${c} svg`), z = y.db.getAccTitle?.(), W = y.db.getAccDescription?.();
  bC(b, L, z, W);
  const st = (/* @__PURE__ */ p(() => {
    u.select(`[id="${e}"]`).selectAll("foreignobject > *").attr("xmlns", FO);
    let j = u.select(c).node().innerHTML;
    if (q.debug("config.arrowMarkerAbsolute", s.arrowMarkerAbsolute), j = HO(j, d, xr(s.arrowMarkerAbsolute)), d) {
      const O = u.select(c + " svg").node();
      j = YO(j, O);
    } else f || (j = us.sanitize(j, {
      ADD_TAGS: RO,
      ADD_ATTR: NO,
      HTML_INTEGRATION_POINTS: { foreignobject: !0 }
    }));
    return bO(), j;
  }, "serializeSvg"))();
  if (x)
    throw x;
  return h(), {
    diagramType: b,
    svg: st,
    bindFunctions: y.db.bindFunctions
  };
}, "render");
function xC(e = {}) {
  const t = ne({}, e);
  t?.fontFamily && !t.themeVariables?.fontFamily && (t.themeVariables || (t.themeVariables = {}), t.themeVariables.fontFamily = t.fontFamily), ok(t), t?.theme && t.theme in Ar ? t.themeVariables = Ar[t.theme].getThemeVariables(
    t.themeVariables
  ) : t && (t.themeVariables = Ar.default.getThemeVariables(t.themeVariables));
  const r = typeof t == "object" ? sk(t) : Up();
  _h(r.logLevel), ga();
}
p(xC, "initialize");
var CC = /* @__PURE__ */ p((e, t = {}) => {
  const { code: r } = Xc(e);
  return mh.fromText(r, t);
}, "getDiagramFromText");
function bC(e, t, r, i) {
  fC(t, e), pC(t, r, i, t.attr("id"));
}
p(bC, "addA11yInfo");
var Si = Object.freeze({
  render: jO,
  parse: yC,
  getDiagramFromText: CC,
  initialize: xC,
  getConfig: Kt,
  /**
   * @deprecated This function does nothing. It will be overwritten by the next
   *             call to {@link render} or {@link parse}.
   */
  setConfig: jp,
  getSiteConfig: Up,
  updateSiteConfig: nk,
  reset: /* @__PURE__ */ p(() => {
    yn();
  }, "reset"),
  globalReset: /* @__PURE__ */ p(() => {
    yn(ds);
  }, "globalReset"),
  defaultConfig: ds
});
_h(Kt().logLevel);
yn(Kt());
var XO = /* @__PURE__ */ p((e, t, r) => {
  q.warn(e), Qh(e) ? (r && r(e.str, e.hash), t.push({ ...e, message: e.str, error: e })) : (r && r(e), e instanceof Error && t.push({
    str: e.message,
    message: e.message,
    hash: e.name,
    error: e
  }));
}, "handleError"), kC = /* @__PURE__ */ p(async function(e = {
  querySelector: ".mermaid"
}) {
  try {
    await GO(e);
  } catch (t) {
    if (Qh(t) && q.error(t.str), $r.parseError && $r.parseError(t), !e.suppressErrors)
      throw q.error("Use the suppressErrors option to suppress these errors"), t;
  }
}, "run"), GO = /* @__PURE__ */ p(async function({ postRenderCallback: e, querySelector: t, nodes: r } = {
  querySelector: ".mermaid"
}) {
  const i = Si.getConfig();
  q.debug(`${e ? "" : "No "}Callback function found`);
  let s;
  if (r)
    s = r;
  else if (t)
    s = document.querySelectorAll(t);
  else
    throw new Error("Nodes and querySelector are both undefined");
  q.debug(`Found ${s.length} diagrams`), i?.startOnLoad !== void 0 && (q.debug("Start On Load: " + i?.startOnLoad), Si.updateSiteConfig({ startOnLoad: i?.startOnLoad }));
  const o = new me.InitIDGenerator(i.deterministicIds, i.deterministicIDSeed);
  let n;
  const a = [];
  for (const l of Array.from(s)) {
    if (q.info("Rendering diagram: " + l.id), l.getAttribute("data-processed"))
      continue;
    l.setAttribute("data-processed", "true");
    const c = `mermaid-${o.next()}`;
    n = l.innerHTML, n = Am(me.entityDecode(n)).trim().replace(/<br\s*\/?>/gi, "<br/>");
    const h = me.detectInit(n);
    h && q.debug("Detected early reinit: ", h);
    try {
      const { svg: u, bindFunctions: d } = await _C(c, n, l);
      l.innerHTML = u, e && await e(c), d && d(l);
    } catch (u) {
      XO(u, a, $r.parseError);
    }
  }
  if (a.length > 0)
    throw a[0];
}, "runThrowsErrors"), wC = /* @__PURE__ */ p(function(e) {
  Si.initialize(e);
}, "initialize"), VO = /* @__PURE__ */ p(async function(e, t, r) {
  q.warn("mermaid.init is deprecated. Please use run instead."), e && wC(e);
  const i = { postRenderCallback: r, querySelector: ".mermaid" };
  typeof t == "string" ? i.querySelector = t : t && (t instanceof HTMLElement ? i.nodes = [t] : i.nodes = t), await kC(i);
}, "init"), KO = /* @__PURE__ */ p(async (e, {
  lazyLoad: t = !0
} = {}) => {
  ga(), Fl(...e), t === !1 && await xO();
}, "registerExternalDiagrams"), SC = /* @__PURE__ */ p(function() {
  if ($r.startOnLoad) {
    const { startOnLoad: e } = Si.getConfig();
    e && $r.run().catch((t) => q.error("Mermaid failed to initialize", t));
  }
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", SC, !1);
var ZO = /* @__PURE__ */ p(function(e) {
  $r.parseError = e;
}, "setParseErrorHandler"), Wn = [], kl = !1, TC = /* @__PURE__ */ p(async () => {
  if (!kl) {
    for (kl = !0; Wn.length > 0; ) {
      const e = Wn.shift();
      if (e)
        try {
          await e();
        } catch (t) {
          q.error("Error executing queue", t);
        }
    }
    kl = !1;
  }
}, "executeQueue"), QO = /* @__PURE__ */ p(async (e, t) => new Promise((r, i) => {
  const s = /* @__PURE__ */ p(() => new Promise((o, n) => {
    Si.parse(e, t).then(
      (a) => {
        o(a), r(a);
      },
      (a) => {
        q.error("Error parsing", a), $r.parseError?.(a), n(a), i(a);
      }
    );
  }), "performCall");
  Wn.push(s), TC().catch(i);
}), "parse"), _C = /* @__PURE__ */ p((e, t, r) => new Promise((i, s) => {
  const o = /* @__PURE__ */ p(() => new Promise((n, a) => {
    Si.render(e, t, r).then(
      (l) => {
        n(l), i(l);
      },
      (l) => {
        q.error("Error parsing", l), $r.parseError?.(l), a(l), s(l);
      }
    );
  }), "performCall");
  Wn.push(o), TC().catch(s);
}), "render"), JO = /* @__PURE__ */ p(() => Object.keys(yi).map((e) => ({
  id: e
})), "getRegisteredDiagramsMetadata"), $r = {
  startOnLoad: !0,
  mermaidAPI: Si,
  parse: QO,
  render: _C,
  init: VO,
  run: kC,
  registerExternalDiagrams: KO,
  registerLayoutLoaders: kx,
  initialize: wC,
  parseError: void 0,
  contentLoaded: SC,
  setParseErrorHandler: ZO,
  detectType: vh,
  registerIconPacks: zT,
  getRegisteredDiagramsMetadata: JO
}, wl = $r;
const Ft = (e) => e.replace(/\s*!important\s*$/i, "").trim(), t3 = (e, t) => {
  let r = t;
  for (; r < e.length && /\s/.test(e[r]); )
    r += 1;
  const i = r;
  for (; r < e.length && /[a-z-]/i.test(e[r]); )
    r += 1;
  if (r === i)
    return !1;
  for (; r < e.length && /\s/.test(e[r]); )
    r += 1;
  return e[r] === ":";
}, Ue = (e) => {
  const t = [];
  let r = 0;
  for (; r < e.length; ) {
    for (; r < e.length && /[\s;,]/.test(e[r]); )
      r += 1;
    if (r >= e.length)
      break;
    const i = r;
    for (; r < e.length && e[r] !== ":" && !(e[r] === ";" || e[r] === ","); )
      r += 1;
    if (r >= e.length || e[r] !== ":")
      break;
    const s = e.substring(i, r).trim().toLowerCase();
    r += 1;
    const o = r;
    let n = 0, a = null;
    for (; r < e.length; ) {
      const c = e[r];
      if (a) {
        c === a && e[r - 1] !== "\\" && (a = null), r += 1;
        continue;
      }
      if (c === '"' || c === "'") {
        a = c, r += 1;
        continue;
      }
      if (c === "(") {
        n += 1, r += 1;
        continue;
      }
      if (c === ")") {
        n = Math.max(0, n - 1), r += 1;
        continue;
      }
      if (n === 0 && (c === ";" || c === "," || /\s/.test(c) && t3(e, r)))
        break;
      r += 1;
    }
    const l = Ft(e.substring(o, r));
    s && l && t.push({ property: s, value: l }), r < e.length && (e[r] === ";" || e[r] === ",") && (r += 1);
  }
  return t;
}, je = (e) => {
  const t = Ft(e);
  if (!t)
    return !1;
  if (typeof CSS < "u" && typeof CSS.supports == "function")
    return CSS.supports("color", t);
  if (typeof document < "u") {
    const r = document.createElement("div");
    return r.style.color = "", r.style.color = t, r.style.color !== "";
  }
  return !1;
}, hp = (e, t) => {
  const r = e.getAttribute("style");
  return r && Ue(r).find((i) => i.property === t)?.value || "";
}, Sl = (...e) => {
  for (const t of e) {
    const r = Ft(t || "");
    if (je(r))
      return r;
  }
}, Vc = (e, t) => {
  const r = e.querySelector("text, foreignObject, div, span, p") || e, i = Sl(r.getAttribute?.("fill"), hp(r, "fill"), r.style?.fill);
  if (i)
    return i;
  const s = Sl(r.getAttribute?.("color"), hp(r, "color"), r.style?.color);
  if (s)
    return s;
  const o = Sl(t);
  if (o)
    return o;
}, Kc = (e, t, r) => {
  switch (t) {
    case Ht.FILL:
    case Ht.STROKE:
      je(r) && (e[t] = r);
      break;
    case Ht.STROKE_WIDTH:
    case Ht.STROKE_DASHARRAY:
      e[t] = r;
      break;
  }
}, zn = (e, t, r) => {
  t === Se.COLOR && je(r) && (e[Se.COLOR] = r);
}, Hn = (e, t, r) => {
  e && Ue(e).forEach(({ property: i, value: s }) => {
    Kc(t, i, s), zn(r, i, s);
  });
}, vC = (e, t) => {
  e && Ue(e).forEach(({ property: r, value: i }) => {
    if (r === "fill" && je(i)) {
      t[Se.COLOR] = i;
      return;
    }
    zn(t, r, i);
  });
}, BC = (e, t) => {
  if (!e)
    return;
  [
    [Ht.FILL, e.getAttribute("fill")],
    [Ht.STROKE, e.getAttribute("stroke")],
    [
      Ht.STROKE_WIDTH,
      e.getAttribute("stroke-width")
    ],
    [
      Ht.STROKE_DASHARRAY,
      e.getAttribute("stroke-dasharray")
    ]
  ].forEach(([i, s]) => {
    const o = Ft(s || "");
    o && Kc(t, i, o);
  });
}, LC = (e, t) => {
  if (!e)
    return;
  const r = e.getAttribute("fill") || e.getAttribute("color"), i = Ft(r || "");
  je(i) && (t[Se.COLOR] = i);
}, xh = (e, t, r, i) => {
  if (!(t instanceof Map))
    return;
  const s = t.get(e);
  s && (s.styles?.forEach((o) => {
    Ue(o).forEach(({ property: n, value: a }) => {
      Kc(r, n, a), zn(i, n, a);
    });
  }), s.textStyles?.forEach((o) => {
    Ue(o).forEach(({ property: n, value: a }) => {
      zn(i, n, a);
    });
  }));
}, e3 = (e, t, r) => {
  const i = e.nodes.map((d) => d.startsWith("flowchart-") ? d.split("-")[1] : d), s = t.querySelector(`[id='${e.id}']`);
  if (!s)
    throw new Error("SubGraph element not found");
  const o = Zc(s, t), n = s.getBBox(), a = {
    width: n.width,
    height: n.height
  }, l = {}, c = {}, h = s.querySelector(":scope > rect, :scope > path, :scope > polygon, :scope > ellipse") || s.querySelector(".cluster > rect, .cluster > path, .cluster > polygon, .cluster > ellipse") || s.querySelector("rect, path, polygon, ellipse");
  Hn(s.getAttribute("style"), l, c), Hn(h?.getAttribute("style"), l, c), BC(h, l);
  const u = s.querySelector(".cluster-label text, .cluster-label tspan") || s.querySelector("text");
  return vC(u?.getAttribute("style"), c), LC(u, c), xh(e.id, r, l, c), e.classes?.forEach((d) => {
    xh(d, r, l, c);
  }), {
    id: e.id,
    nodeIds: i,
    text: Fe(e.title),
    labelType: "text",
    ...o,
    ...a,
    containerStyle: l,
    labelStyle: c
  };
}, cp = (e, t, r) => {
  const i = t.querySelector(`[id*="${e.domId}"]`);
  if (!i)
    return;
  let s;
  i.parentElement?.tagName.toLowerCase() === "a" && (s = i.parentElement.getAttribute("xlink:href"));
  const o = Zc(s ? i.parentElement : i, t), n = i.getBBox(), a = {
    width: n.width,
    height: n.height
  }, l = {}, c = {};
  e.classes && r instanceof Map && (Array.isArray(e.classes) ? e.classes : [e.classes]).forEach((d) => {
    xh(d, r, l, c);
  }), e.styles?.forEach((d) => {
    Hn(d, l, c);
  });
  const h = i.querySelector(".label-container");
  return Hn(h?.getAttribute("style"), l, c), BC(h, l), Array.from(i.querySelectorAll(".label, .nodeLabel, .label text, .label tspan, .label span, .label div")).forEach((d) => {
    vC(d.getAttribute("style"), c), LC(d, c);
  }), {
    id: e.id,
    labelType: e.labelType,
    text: Fe(e.text || ""),
    type: e.type,
    link: s || void 0,
    ...o,
    ...a,
    containerStyle: l,
    labelStyle: c
  };
}, r3 = (e, t, r) => {
  const i = r.querySelector(`[id*="${e.id}"]`);
  if (!i)
    throw new Error("Edge element not found");
  const s = Zc(i, r), o = $p(i, s);
  return e.length = void 0, {
    ...e,
    ...o,
    text: Fe(e.text)
  };
}, Zc = (e, t) => {
  if (!e)
    throw new Error("Element not found");
  let r = e.parentElement?.parentElement;
  const i = e.childNodes[0];
  let s = { x: 0, y: 0 };
  if (i) {
    const { transformX: l, transformY: c } = fi(i), h = i.getBBox();
    s = {
      x: Number(i.getAttribute("x")) || l + h.x || 0,
      y: Number(i.getAttribute("y")) || c + h.y || 0
    };
  }
  const { transformX: o, transformY: n } = fi(e), a = {
    x: o + s.x,
    y: n + s.y
  };
  for (; r && r.id !== t.id; ) {
    if (r.classList.value === "root" && r.hasAttribute("transform")) {
      const { transformX: l, transformY: c } = fi(r);
      a.x += l, a.y += c;
    }
    r = r.parentElement;
  }
  return a;
}, i3 = (e, t) => {
  const r = e.getVertices(), i = e.getEdges(), s = e.getSubGraphs(), o = e.getClasses(), n = {}, a = o instanceof Map ? o : {};
  r instanceof Map ? r.forEach((u, d) => {
    n[d] = cp(u, t, a);
  }) : typeof r == "object" && r !== null && Object.entries(r).forEach(([u, d]) => {
    n[u] = cp(d, t, a);
  });
  const l = /* @__PURE__ */ new Map(), c = (Array.isArray(i) ? i : []).map((u) => {
    if (!t.querySelector(`[id*="${u.id}"]`))
      return null;
    const d = `${u.start}-${u.end}`, f = l.get(d) || 0;
    return l.set(d, f + 1), r3(u, f, t);
  }).filter((u) => u !== null && u.reflectionPoints.length > 1);
  return {
    type: "flowchart",
    subGraphs: (Array.isArray(s) ? s : []).map((u) => e3(u, t, a)),
    vertices: n,
    edges: c
  };
}, s3 = (e, t) => {
  const r = {};
  t?.label && (r.label = { text: Fe(t.label), fontSize: 16 });
  const i = e.tagName;
  if (i === "line")
    r.startX = Number(e.getAttribute("x1")), r.startY = Number(e.getAttribute("y1")), r.endX = Number(e.getAttribute("x2")), r.endY = Number(e.getAttribute("y2"));
  else if (i === "path") {
    const n = e.getAttribute("d");
    if (!n)
      throw new Error('Path element does not contain a "d" attribute');
    const a = n.split(/(?=[LC])/), l = a[0].substring(1).split(",").map((u) => parseFloat(u)), c = [];
    a.forEach((u) => {
      const d = u.substring(1).trim().split(" ").map((f) => {
        const [m, y] = f.split(",");
        return [
          parseFloat(m) - l[0],
          parseFloat(y) - l[1]
        ];
      });
      c.push(...d);
    });
    const h = c[c.length - 1];
    r.startX = l[0], r.startY = l[1], r.endX = h[0], r.endY = h[1], r.points = c;
  }
  t?.label && (r.startY = r.startY - 10, r.endY = r.endY - 10);
  const s = e.getAttribute("stroke"), o = (s && s !== "none" ? s : "") || getComputedStyle(e).stroke || "";
  return r.strokeColor = o ? Ft(o) : null, r.strokeWidth = Number(e.getAttribute("stroke-width")), r.type = "arrow", r.strokeStyle = t?.strokeStyle || "solid", r.startArrowhead = t?.startArrowhead || null, r.endArrowhead = t?.endArrowhead || null, r;
}, Qc = (e, t, r, i, s) => {
  const o = {};
  return o.type = "arrow", o.startX = e, o.startY = t, o.endX = r, o.endY = i, Object.assign(o, { ...s }), o;
}, Yn = (e, t, r, i) => ({
  type: "text",
  x: e,
  y: t,
  text: r,
  width: i?.width || 20,
  height: i?.height || 20,
  fontSize: i?.fontSize || bo,
  id: i?.id,
  color: i?.color,
  groupId: i?.groupId,
  metadata: i?.metadata
}), AC = (e, t, r) => {
  const i = {}, s = Number(e.getAttribute("x")), o = Number(e.getAttribute("y"));
  i.type = "text", i.text = Fe(t), r?.id && (i.id = r.id), r?.groupId && (i.groupId = r.groupId);
  const n = e.getBBox();
  i.width = n.width, i.height = n.height, i.x = s - n.width / 2, i.y = o;
  const a = parseInt(getComputedStyle(e).fontSize);
  return i.fontSize = a, i.color = Vc(e), i;
}, Or = (e, t, r = {}) => {
  const i = {};
  i.type = t;
  const { label: s, subtype: o, id: n, groupId: a } = r;
  i.id = n, a && (i.groupId = a), s && (i.label = {
    text: Fe(s.text),
    fontSize: 16,
    textAlign: s?.textAlign,
    verticalAlign: s?.verticalAlign
  });
  const l = e.getBBox();
  switch (i.x = l.x, i.y = l.y, i.width = l.width, i.height = l.height, i.subtype = o, o) {
    case "highlight":
      const c = e.getAttribute("fill");
      c && (i.bgColor = Ft(c));
      break;
    case "note":
      i.strokeStyle = "dashed";
      break;
  }
  return i;
}, Co = (e, t, r, i, s, o) => {
  const n = {};
  n.startX = t, n.startY = r, n.endX = i, o?.groupId && (n.groupId = o.groupId), o?.id && (n.id = o.id), n.endY = s;
  const a = e.getAttribute("stroke");
  return n.strokeColor = a ? Ft(a) : null, n.strokeWidth = Number(e.getAttribute("stroke-width")), n.type = "line", n;
}, up = {
  0: "SOLID",
  1: "DOTTED",
  3: "SOLID_CROSS",
  4: "DOTTED_CROSS",
  5: "SOLID_OPEN",
  6: "DOTTED_OPEN",
  24: "SOLID_POINT",
  25: "DOTTED_POINT"
}, hr = {
  SOLID: 0,
  DOTTED: 1,
  NOTE: 2,
  SOLID_CROSS: 3,
  DOTTED_CROSS: 4,
  SOLID_OPEN: 5,
  DOTTED_OPEN: 6,
  SOLID_POINT: 24,
  DOTTED_POINT: 25,
  CRITICAL_START: 27
}, o3 = (e) => {
  let t;
  switch (e) {
    case hr.SOLID:
    case hr.SOLID_CROSS:
    case hr.SOLID_OPEN:
    case hr.SOLID_POINT:
      t = "solid";
      break;
    case hr.DOTTED:
    case hr.DOTTED_CROSS:
    case hr.DOTTED_OPEN:
    case hr.DOTTED_POINT:
      t = "dotted";
      break;
    default:
      t = "solid";
      break;
  }
  return t;
}, n3 = (e, t) => {
  if (!!e.nextElementSibling?.classList.contains("sequenceNumber")) {
    const i = e.nextElementSibling?.textContent;
    if (!i)
      throw new Error("sequence number not present");
    const s = 30, o = s / 2, a = {
      type: "rectangle",
      x: t.startX - 10,
      y: t.startY - o,
      label: { text: i, fontSize: 14 },
      bgColor: "#e9ecef",
      height: s,
      subtype: "sequence"
    };
    Object.assign(t, { sequenceNumber: a });
  }
}, dp = (e, t, r) => {
  if (!e)
    throw "root node not found";
  const i = ze(), s = Array.from(e.children), o = [];
  return s.forEach((n, a) => {
    const l = `${r?.id}-${a}`;
    let c;
    switch (n.tagName) {
      case "line":
        const h = Number(n.getAttribute("x1")), u = Number(n.getAttribute("y1")), d = Number(n.getAttribute("x2")), f = Number(n.getAttribute("y2"));
        c = Co(n, h, u, d, f, { groupId: i, id: l });
        break;
      case "text":
        c = AC(n, t, {
          groupId: i,
          id: l
        });
        break;
      case "circle":
        c = Or(n, "ellipse", {
          label: n.textContent ? { text: n.textContent } : void 0,
          groupId: i,
          id: l
        });
      default:
        c = Or(n, QC[n.tagName], {
          label: n.textContent ? { text: n.textContent } : void 0,
          groupId: i,
          id: l
        });
    }
    o.push(c);
  }), o;
}, fp = (e, t) => {
  const r = t.getAttribute("fill"), i = t.getAttribute("stroke"), s = t.getAttribute("stroke-width"), o = t.getAttribute("stroke-dasharray");
  r && r !== "none" && (e.bgColor = Ft(r)), i && i !== "none" && (e.strokeColor = Ft(i)), s && (e.strokeWidth = Number(s)), o && o.trim() && (e.strokeStyle = "dashed");
}, a3 = (e, t) => {
  const r = Array.from(t.querySelectorAll(".actor-top")), i = Array.from(t.querySelectorAll(".actor-bottom")), s = [], o = [], n = {}, a = e instanceof Map ? Array.from(e.values()) : Object.values(e), l = Array.from(t.querySelectorAll(".actor-line")), c = (h, u) => {
    const d = h.name, f = l.find((y) => y.getAttribute("name") === d);
    if (f)
      return f;
    const m = h.type === "participant" ? u.parentElement?.previousElementSibling : u.previousElementSibling;
    return m ? m.tagName === "line" ? m : m.querySelector("line") : null;
  };
  return a.forEach((h) => {
    const u = r.find((m) => m.getAttribute("name") === h.name), d = i.find((m) => m.getAttribute("name") === h.name);
    if (!u || !d)
      throw "root not found";
    const f = h.description;
    if (h.type === "participant") {
      const m = Or(u, "rectangle", { id: `${h.name}-top`, label: { text: f }, subtype: "actor" });
      if (fp(m, u), !m)
        throw "Top Node element not found!";
      s.push([m]);
      const y = Or(d, "rectangle", { id: `${h.name}-bottom`, label: { text: f }, subtype: "actor" });
      n[h.name] = {
        topId: `${h.name}-top`,
        bottomId: `${h.name}-bottom`,
        bindType: "rectangle"
      }, fp(y, d), s.push([y]);
      const x = c(h, u);
      if (x?.tagName !== "line")
        throw "Line not found";
      const C = Number(x.getAttribute("x1"));
      if (!m.height)
        throw "Top node element height is null";
      const b = m.y + m.height, w = y.y, _ = Number(x.getAttribute("x2")), v = Co(x, C, b, _, w);
      o.push(v);
    } else if (h.type === "actor") {
      const m = dp(u, f, {
        id: `${h.name}-top`
      });
      s.push(m);
      const y = dp(d, f, {
        id: `${h.name}-bottom`
      });
      s.push(y);
      const x = c(h, u);
      if (x?.tagName !== "line")
        throw "Line not found";
      const C = Number(x.getAttribute("x1")), b = Number(x.getAttribute("y1")), w = Number(x.getAttribute("x2")), _ = y.find((A) => A.type === "ellipse");
      if (_) {
        const A = _.y, L = Co(x, C, b, w, A);
        o.push(L);
      }
      const v = m.find((A) => A.type === "ellipse"), E = y.find((A) => A.type === "ellipse");
      v?.id && E?.id && (n[h.name] = {
        topId: v.id,
        bottomId: E.id,
        bindType: "ellipse"
      });
    }
  }), { nodes: s, lines: o, actorMap: n };
}, l3 = (e, t, r) => {
  const i = [], s = Array.from(t.querySelectorAll('[class*="messageLine"]')), o = Object.keys(up), n = e.filter((a) => o.includes(a.type.toString()));
  return s.forEach((a, l) => {
    const c = n[l], h = up[c.type], u = s3(a, {
      label: c?.message,
      strokeStyle: o3(c.type),
      endArrowhead: h === "SOLID_OPEN" || h === "DOTTED_OPEN" ? null : "arrow"
    }), d = r[c.from], f = r[c.to];
    d?.topId && f?.topId && (u.start = { type: d.bindType || "rectangle", id: d.topId }, u.end = { type: f.bindType || "rectangle", id: f.topId }), n3(a, u), i.push(u);
  }), i;
}, h3 = (e, t) => {
  const r = Array.from(t.querySelectorAll(".note")).map((o) => o.parentElement), i = e.filter((o) => o.type === hr.NOTE), s = [];
  return r.forEach((o, n) => {
    if (!o)
      return;
    const a = o.firstChild, l = i[n].message, c = Or(a, "rectangle", {
      label: { text: l },
      subtype: "note"
    }), h = a.getAttribute("fill"), u = a.getAttribute("stroke"), d = a.getAttribute("stroke-width"), f = a.getAttribute("stroke-dasharray");
    h && h !== "none" && (c.bgColor = Ft(h)), u && u !== "none" && (c.strokeColor = Ft(u)), d && (c.strokeWidth = Number(d)), f && f.trim() && (c.strokeStyle = "dashed"), s.push(c);
  }), s;
}, c3 = (e) => {
  const t = Array.from(e.querySelectorAll("[class*=activation]")), r = [];
  return t.forEach((i) => {
    const s = Or(i, "rectangle", {
      label: { text: "" },
      subtype: "activation"
    });
    (() => {
      const n = i.getAttribute("fill"), a = i.getAttribute("stroke"), l = i.getAttribute("stroke-width"), c = i.getAttribute("stroke-dasharray");
      n && n !== "none" && (s.bgColor = Ft(n)), a && a !== "none" && (s.strokeColor = Ft(a)), l && (s.strokeWidth = Number(l)), c && c.trim() && (s.strokeStyle = "dashed");
    })(), r.push(s);
  }), r;
}, u3 = (e, t) => {
  const r = Array.from(t.querySelectorAll(".loopLine")), i = [], s = [], o = [];
  r.forEach((h) => {
    const u = Number(h.getAttribute("x1")), d = Number(h.getAttribute("y1")), f = Number(h.getAttribute("x2")), m = Number(h.getAttribute("y2")), y = Co(h, u, d, f, m);
    y.strokeStyle = "dotted", y.strokeColor = "#adb5bd", y.strokeWidth = 2, i.push(y);
  });
  const n = Array.from(t.querySelectorAll(".loopText")), a = e.filter((h) => h.type === hr.CRITICAL_START).map((h) => h.message);
  n.forEach((h) => {
    const u = h.textContent || "", d = AC(h, u), f = u.match(/\[(.*?)\]/)?.[1] || "";
    a.includes(f) && (d.x += 16), s.push(d);
  });
  const l = Array.from(t?.querySelectorAll(".labelBox")), c = Array.from(t?.querySelectorAll(".labelText"));
  return l.forEach((h, u) => {
    const d = c[u]?.textContent || "", f = Or(h, "rectangle", {
      label: { text: d }
    });
    f.strokeColor = "#adb5bd", f.bgColor = "#e9ecef", f.width = void 0, o.push(f);
  }), { lines: i, texts: s, nodes: o };
}, d3 = (e) => {
  const t = Array.from(e.querySelectorAll(".rect")).filter((i) => i.parentElement?.tagName !== "g"), r = [];
  return t.forEach((i) => {
    const s = Or(i, "rectangle", {
      label: { text: "" },
      subtype: "highlight"
    });
    r.push(s);
  }), r;
}, f3 = (e, t) => {
  const r = e.db, i = [], o = r.getBoxes().map((x) => ({
    ...x,
    fill: Ft(x.fill || "")
  })), n = d3(t), a = r.getActors(), { nodes: l, lines: c, actorMap: h } = a3(a, t), u = r.getMessages(), d = l3(u, t, h), f = h3(u, t), m = c3(t), y = u3(u, t);
  return i.push(n), i.push(...l), i.push(f), i.push(m), { type: "sequence", lines: c, arrows: d, nodes: i, loops: y, groups: o };
}, p3 = (e) => {
  const t = {};
  return e && e.forEach((r) => {
    Ue(r).forEach(({ property: i, value: s }) => {
      i && s && (t[i] = Ft(s));
    });
  }), t;
}, Jo = {
  AGGREGATION: 0,
  EXTENSION: 1,
  COMPOSITION: 2,
  DEPENDENCY: 3
}, pp = {
  LINE: 0,
  DOTTED_LINE: 1
}, gp = 16, g3 = (e) => {
  let t;
  switch (e) {
    case pp.LINE:
      t = "solid";
      break;
    case pp.DOTTED_LINE:
      t = "dotted";
      break;
    default:
      t = "solid";
  }
  return t;
}, mp = (e) => {
  let t;
  switch (e) {
    case Jo.AGGREGATION:
      t = "diamond_outline";
      break;
    case Jo.COMPOSITION:
      t = "diamond";
      break;
    case Jo.EXTENSION:
      t = "triangle_outline";
      break;
    case "none":
      t = null;
      break;
    case Jo.DEPENDENCY:
    default:
      t = "arrow";
      break;
  }
  return t;
}, Tl = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: n } = fi(s);
    r += o, i += n, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, yp = /* @__PURE__ */ new Set([
  "triangle_outline",
  "diamond",
  "diamond_outline"
]), EC = (e, t = 0.5) => {
  if (e.length <= 2)
    return [...e];
  const r = [e[0]];
  for (let i = 1; i < e.length - 1; i++) {
    const s = r[r.length - 1], o = e[i], n = e[i + 1], a = n.x - s.x, l = n.y - s.y, c = Math.hypot(a, l);
    if (!c)
      continue;
    const u = Math.abs(a * (o.y - s.y) - l * (o.x - s.x)) / c, d = ((o.x - s.x) * a + (o.y - s.y) * l) / (c * c);
    u <= t && d >= -t && d <= 1 + t || r.push(o);
  }
  return r.push(e[e.length - 1]), r;
}, FC = (e) => {
  const t = Sh(Mp(e).map((i) => [i.x, i.y])).map(([i, s]) => ({ x: i, y: s })), r = Th(e);
  return r && t.length >= 2 && (t[0] = {
    x: r.startX,
    y: r.startY
  }, t[t.length - 1] = {
    x: r.endX,
    y: r.endY
  }), EC(t);
}, xp = (e, t, r) => {
  const i = e.x - t.x, s = e.y - t.y, o = Math.hypot(i, s);
  return o ? {
    x: e.x + i / o * r,
    y: e.y + s / o * r
  } : e;
}, m3 = (e, t) => {
  const r = Sh(t.map((o) => [o.x, o.y])).map(([o, n]) => ({ x: o, y: n }));
  if (r.length < 2)
    throw new Error("Arrow route must contain at least two points");
  const i = r[0], s = r[r.length - 1];
  e.startX = i.x, e.startY = i.y, e.endX = s.x, e.endY = s.y, e.points = r.map((o) => [
    o.x - i.x,
    o.y - i.y
  ]);
}, y3 = (e) => {
  const t = e.points?.map(([o, n]) => ({ x: e.startX + o, y: e.startY + n })).filter((o) => Number.isFinite(o.x) && Number.isFinite(o.y));
  if (!t || t.length < 2)
    return e;
  const r = [...t], i = !!e.startArrowhead && yp.has(e.startArrowhead), s = !!e.endArrowhead && yp.has(e.endArrowhead);
  if (!i && !s)
    return e;
  if (i && (r[0] = xp(r[0], r[1], gp)), s) {
    const o = r.length - 1;
    r[o] = xp(r[o], r[o - 1], gp);
  }
  return m3(e, r), e;
}, x3 = (e, t) => {
  const r = Ft(e.getAttribute("stroke") || getComputedStyle(e).stroke || ""), i = parseFloat(e.getAttribute("stroke-width") || getComputedStyle(e).strokeWidth || "1");
  je(r) && r !== "none" && (t.strokeColor = r), Number.isFinite(i) && i > 0 && (t.strokeWidth = i);
}, C3 = (e) => {
  const t = [];
  return e.forEach((r) => {
    FC(r).forEach((i) => {
      const s = t[t.length - 1];
      s && s.x === i.x && s.y === i.y || t.push(i);
    });
  }), EC(t);
}, MC = (e, t, r) => {
  if (e.length < 2)
    throw new Error(`Class diagram edge ${t?.id || "<unknown>"} is missing usable path points`);
  const i = e[0], s = e[e.length - 1], o = Qc(i.x, i.y, s.x, s.y, {
    id: t?.getAttribute("data-id") || t?.id || void 0,
    ...r,
    points: e.map((n) => [
      n.x - i.x,
      n.y - i.y
    ])
  });
  return t && x3(t, o), y3(o);
}, $C = (e, t) => MC(C3(e), e[0], t), b3 = (e, t) => {
  const r = FC(e);
  return MC([r[0], r[r.length - 1]], e, t);
}, k3 = (e, t) => $C([e], t), w3 = (e, t) => [
  `${e}-cyclic-special-1`,
  `${e}-cyclic-special-mid`,
  `${e}-cyclic-special-2`
].map((i) => t.querySelector(`path[id="${i}"][data-edge="true"]`)).filter((i) => i !== null), S3 = (e) => e.points?.map(([t, r]) => ({ x: e.startX + t, y: e.startY + r })).filter((t) => Number.isFinite(t.x) && Number.isFinite(t.y)) || [], Cp = (e, t) => {
  const r = S3(e);
  if (r.length < 2)
    return null;
  const i = t === "start", s = i ? r[0] : r[r.length - 1], o = i ? r[1] : r[r.length - 2], n = o.x === s.x ? i ? -1 : 1 : Math.sign(o.x - s.x), a = o.y === s.y ? 1 : Math.sign(o.y - s.y);
  return {
    x: s.x + n * 20,
    y: s.y + (a >= 0 ? 12 : -28)
  };
}, T3 = (e, t) => {
  let r = e;
  for (; r && r !== t; ) {
    if (r.classList.contains("annotation-group") || r.classList.contains("label-group"))
      return "header";
    if (r.classList.contains("members-group"))
      return "members";
    if (r.classList.contains("methods-group"))
      return "methods";
    r = r.parentElement;
  }
  return "other";
}, _3 = (e, t, r) => {
  const i = [], s = [], o = [];
  return Object.values(e).forEach((n) => {
    const { domId: a, id: l } = n, c = ze(), h = p3(
      // @ts-ignore
      n.styles || n.cssStyles
    );
    let u;
    try {
      u = r ? r(l) : void 0;
    } catch {
      u = void 0;
    }
    const d = (M) => {
      const F = new RegExp(`^classId-${M}(?:-|$)`);
      return Array.from(t.querySelectorAll("[id]")).filter((Z) => F.test(Z.id))[0];
    }, f = u && t.querySelector(`#${u}`) || t.querySelector(`#${a}`) || t.querySelector(`[data-id='${l}']`) || d(l);
    if (!f)
      throw Error(`DOM Node with id ${a} not found`);
    const m = f.querySelector("rect") || f, y = m.getBBox(), { tx: x, ty: C } = Tl(m, t), b = {
      type: "rectangle",
      id: l,
      groupId: c,
      x: y.x + x,
      y: y.y + C,
      width: y.width,
      height: y.height,
      metadata: { classId: l }
    }, w = m.getAttribute("fill"), _ = m.getAttribute("stroke"), v = m.getAttribute("stroke-width"), E = m.getAttribute("stroke-dasharray"), A = getComputedStyle(m), L = Ft(w || h.fill || (w ? A.fill : "")), z = Ft(_ || h.stroke || (_ ? A.stroke : "")), W = v || h["stroke-width"] || (v ? A.strokeWidth : ""), R = E || h["stroke-dasharray"] || (E ? A.strokeDasharray === "none" ? "" : A.strokeDasharray : ""), st = (M) => {
      if (!M || !je(M))
        return !1;
      const F = M.toLowerCase();
      return !(F === "none" || F === "transparent" || F === "rgba(0, 0, 0, 0)" || F === "black" || F === "#000" || F === "#000000" || F === "rgb(0, 0, 0)" || F === "rgba(0, 0, 0, 1)");
    };
    st(L) ? b.bgColor = L : b.bgColor = void 0, st(z) ? b.strokeColor = z : b.strokeColor = void 0, W ? b.strokeWidth = Number(W) : b.strokeWidth = void 0, R && R.trim().length > 0 ? b.strokeStyle = "dashed" : b.strokeStyle = void 0, i.push(b), [
      ...Array.from(f.querySelectorAll("line")),
      ...Array.from(f.querySelectorAll("g.divider path"))
    ].forEach((M) => {
      const { tx: F, ty: Q } = Tl(M, t);
      let Z, dt, wt, yt;
      if (M.tagName.toLowerCase() === "line")
        Z = Number(M.getAttribute("x1")) + F, dt = Number(M.getAttribute("y1")) + Q, wt = Number(M.getAttribute("x2")) + F, yt = Number(M.getAttribute("y2")) + Q;
      else {
        const kt = M.getBBox();
        Z = kt.x + F, wt = kt.x + kt.width + F;
        const mt = kt.y + kt.height / 2 + Q;
        dt = mt, yt = mt;
      }
      if (Z === wt && dt === yt)
        return;
      const at = Co(
        // @ts-ignore
        M,
        Z,
        dt,
        wt,
        yt,
        {
          groupId: c,
          id: ze()
        }
      );
      b.strokeColor ? at.strokeColor = b.strokeColor : at.strokeColor = void 0, b.strokeWidth !== void 0 ? at.strokeWidth = b.strokeWidth : at.strokeWidth = void 0, b.strokeStyle ? at.strokeStyle = b.strokeStyle : at.strokeStyle = void 0, at.metadata = { classId: l }, s.push(at);
    });
    const O = Array.from(f.querySelectorAll("text, foreignObject")), I = [];
    O.forEach((M) => {
      const F = M.tagName.toLowerCase() === "foreignobject", Q = F ? [] : Array.from(M.querySelectorAll("tspan")), Z = Q.length ? Q.map((kt) => kt.textContent?.trim()).filter(Boolean).join(`
`) : M.textContent?.trim() || "";
      if (!Z)
        return;
      const dt = M.getBBox(), { ty: wt } = Tl(M, t);
      let yt = parseFloat(getComputedStyle(M).fontSize || "");
      if (F && (!Number.isFinite(yt) || !yt)) {
        const kt = M.querySelector("div, span, p");
        kt && (yt = parseFloat(getComputedStyle(kt).fontSize || ""));
      }
      (!Number.isFinite(yt) || yt <= 0) && (yt = Math.max(12, dt.height * 0.6)), yt = yt * 0.9;
      const at = Vc(M, h.color);
      I.push({
        section: T3(M, f),
        text: Fe(Z),
        x: dt.x,
        y: dt.y + wt,
        width: b && b.width ? Math.max(b.width - 8, dt.width) : dt.width,
        height: dt.height,
        fontSize: yt,
        color: at
      });
    });
    const B = I.filter((M) => M.section === "header").sort((M, F) => M.y - F.y || M.x - F.x);
    if (!b.label) {
      const M = B.length === 0 && I.length === 1 ? I : B;
      M.length > 0 && (b.label = {
        text: M.map((F) => F.text).join(`
`),
        fontSize: Math.max(...M.map((F) => F.fontSize)),
        color: M.find((F) => F.color)?.color,
        verticalAlign: "top"
      });
    }
    I.filter((M) => B.length > 0 ? M.section !== "header" : !(b.label && I.length === 1)).forEach((M) => {
      const F = Yn((b?.x || 0) + 4, M.y, M.text, {
        width: M.width,
        height: M.height,
        fontSize: M.fontSize,
        color: M.color,
        id: ze(),
        groupId: c,
        metadata: { classId: l }
      });
      o.push(F);
    });
  }), { nodes: i, lines: s, text: o };
}, v3 = (e, t, r, i) => {
  const s = Array.from(r.querySelectorAll('.edgePaths path[data-edge="true"]:not([id^="edgeNote"]):not([id*="-cyclic-special-"])'));
  if (e.length === 0)
    return { arrows: [], text: [] };
  const o = [], n = [];
  let a = 0;
  return e.forEach((l) => {
    const { id1: c, id2: h, relation: u } = l, d = t.find((W) => W.id === c), f = t.find((W) => W.id === h);
    if (!d)
      throw new Error(`parseRelations: Cannot find node with id ${c}`);
    if (!f)
      throw new Error(`parseRelations: Cannot find node with id ${h}`);
    const m = g3(u.lineType), y = mp(u.type1), x = mp(u.type2);
    let C;
    if (c === h) {
      const W = w3(c, r);
      if (!W.length)
        throw new Error(`parseRelations: Cannot find rendered SVG edge for relation ${c} -> ${h}`);
      C = $C(W, {
        strokeStyle: m,
        startArrowhead: y,
        endArrowhead: x,
        label: l.title ? { text: l.title } : void 0,
        start: { type: "rectangle", id: d.id },
        end: { type: "rectangle", id: f.id }
      });
    } else {
      const W = s[a];
      if (!W)
        throw new Error(`parseRelations: Cannot find rendered SVG edge for relation ${c} -> ${h}`);
      a += 1, C = b3(W, {
        strokeStyle: m,
        startArrowhead: y,
        endArrowhead: x,
        label: l.title ? { text: l.title } : void 0,
        start: { type: "rectangle", id: d.id },
        end: { type: "rectangle", id: f.id }
      });
    }
    o.push(C);
    const { relationTitle1: b, relationTitle2: w } = l, _ = c === h, v = 20, E = 15, A = 15;
    let L, z;
    if (b && b !== "none") {
      if (_) {
        const R = Cp(C, "start");
        R && (L = R.x, z = R.y);
      } else
        switch (i) {
          case "TB":
            L = C.startX - v, C.endX < C.startX && (L -= A), z = C.startY + E;
            break;
          case "BT":
            L = C.startX + v, C.endX > C.startX && (L += A), z = C.startY - E;
            break;
          case "LR":
            L = C.startX + v, z = C.startY + E, C.endY > C.startY && (z += A);
            break;
          case "RL":
            L = C.startX - v, z = C.startY - E, C.startY > C.endY && (z -= A);
            break;
          default:
            L = C.startX - v, z = C.startY + E;
        }
      L ??= C.startX - v, z ??= C.startY + E;
      const W = Yn(L, z, b, {
        fontSize: 16
      });
      n.push(W);
    }
    if (w && w !== "none") {
      if (_) {
        const R = Cp(C, "end");
        R && (L = R.x, z = R.y);
      } else
        switch (i) {
          case "TB":
            L = C.endX + v, C.endX < C.startX && (L += A), z = C.endY - E;
            break;
          case "BT":
            L = C.endX - v, C.endX > C.startX && (L -= A), z = C.endY + E;
            break;
          case "LR":
            L = C.endX - v, z = C.endY - E, C.endY > C.startY && (z -= A);
            break;
          case "RL":
            L = C.endX + v, z = C.endY + E, C.startY > C.endY && (z += A);
            break;
          default:
            L = C.endX + v, z = C.endY - E;
        }
      L ??= C.endX + v, z ??= C.endY + E;
      const W = Yn(L, z, w, {
        fontSize: 16
      });
      n.push(W);
    }
  }), { arrows: o, text: n };
}, B3 = (e, t, r) => {
  const i = [], s = [];
  return e.forEach((o, n) => {
    const { id: a, text: l, class: c } = o, h = t.querySelector(`#${a}`);
    if (!h)
      throw new Error(`Node with id ${a} not found!`);
    const { transformX: u, transformY: d } = fi(h), f = h.firstChild, m = Or(f, "rectangle", {
      id: a,
      subtype: "note",
      label: { text: l }
    });
    if (Object.assign(m, {
      x: m.x + u,
      y: m.y + d
    }), i.push(m), c) {
      const y = r.find((E) => E.id === c);
      if (!y)
        throw new Error(`class node with id ${c} not found!`);
      const x = t.querySelector(`path[id="edgeNote${n + 1}"][data-edge="true"]`);
      if (x) {
        s.push(k3(x, {
          strokeStyle: "dotted",
          startArrowhead: null,
          endArrowhead: null,
          start: { id: m.id, type: "rectangle" },
          end: { id: y.id, type: "rectangle" }
        }));
        return;
      }
      const C = m.x + (m.width || 0) / 2, b = m.y + (m.height || 0), w = C, _ = y.y, v = Qc(C, b, w, _, {
        strokeStyle: "dotted",
        startArrowhead: null,
        endArrowhead: null,
        start: { id: m.id, type: "rectangle" },
        end: { id: y.id, type: "rectangle" }
      });
      s.push(v);
    }
  }), { notes: i, connectors: s };
}, L3 = (e, t) => {
  const r = e.db, i = r.getDirection?.() || "TB", s = [], o = [], n = [], a = [], l = r.getNamespaces?.() || [], c = r.getClasses?.() || {}, h = c instanceof Map ? Object.fromEntries(c) : c;
  if (h && Object.keys(h).length) {
    const C = (
      //@ts-ignore
      typeof r.lookUpDomId == "function" ? (
        //@ts-ignore
        r.lookUpDomId.bind(r)
      ) : void 0
    ), b = _3(h, t, C);
    s.push(b.nodes), o.push(...b.lines), n.push(...b.text), a.push(...b.nodes);
  }
  const u = r.getRelations?.() || [], { arrows: d, text: f } = v3(u, a, t, i), m = r.getNotes?.() || [], { notes: y, connectors: x } = B3(m, t, a);
  return s.push(y), d.push(...x), n.push(...f), { type: "class", nodes: s, lines: o, arrows: d, text: n, namespaces: l };
}, bp = 18, A3 = (e) => {
  const t = {};
  return e && e.forEach((r) => {
    Ue(r).forEach(({ property: i, value: s }) => {
      i && s && (t[i] = Ft(s));
    });
  }), t;
}, E3 = (e) => {
  if (e == null || e === "")
    return;
  const t = typeof e == "number" ? e : parseFloat(Ft(e));
  if (!(!Number.isFinite(t) || t <= 0))
    return t;
}, Jc = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: n } = fi(s);
    r += o, i += n, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, F3 = (e) => {
  const t = Array.from(e.querySelectorAll("tspan")), r = t.length ? t.map((i) => i.textContent?.trim()).filter(Boolean).join(`
`) : e.textContent?.trim() || "";
  return Fe(r);
}, M3 = (e) => {
  const t = e.querySelector("text, foreignObject, div, span, p") || e;
  let r = parseFloat(getComputedStyle(t).fontSize || "");
  return (!Number.isFinite(r) || r <= 0) && (r = Math.max(12, e.getBBox().height * 0.75)), r;
}, $3 = (e, t, r) => {
  const i = F3(e);
  if (!i)
    return null;
  const s = e.getBBox(), { tx: o, ty: n } = Jc(e, t);
  return {
    className: e.getAttribute("class") || "",
    text: i,
    x: s.x + o,
    y: s.y + n,
    width: s.width,
    height: s.height,
    fontSize: M3(e),
    color: Vc(e, r)
  };
}, O3 = (e, t, r, i, s, o, n) => {
  const { tx: a, ty: l } = Jc(e, t);
  let c = 0, h = 0, u = 0, d = 0;
  if (e.tagName.toLowerCase() === "line")
    c = Number(e.getAttribute("x1")) + a, h = Number(e.getAttribute("y1")) + l, u = Number(e.getAttribute("x2")) + a, d = Number(e.getAttribute("y2")) + l;
  else {
    const m = Th(e);
    if (!m)
      return null;
    c = m.startX + a, h = m.startY + l, u = m.endX + a, d = m.endY + l;
  }
  const f = {
    type: "line",
    id: ze(),
    groupId: r,
    startX: c,
    startY: h,
    endX: u,
    endY: d,
    metadata: { entityId: i }
  };
  return s && je(s) && s !== "none" && (f.strokeColor = s), o !== void 0 && (f.strokeWidth = o), n && (f.strokeStyle = n), f;
}, kp = (e) => {
  switch (e?.toLowerCase()) {
    case "one":
      return "cardinality_one";
    case "many":
      return "cardinality_many";
    case "only_one":
      return "cardinality_exactly_one";
    case "one_or_more":
      return "cardinality_one_or_many";
    case "zero_or_one":
      return "cardinality_zero_or_one";
    case "zero_or_more":
      return "cardinality_zero_or_many";
    default:
      return null;
  }
}, I3 = (e) => {
  switch (e) {
    case "dotted":
      return "dotted";
    case "dashed":
      return "dashed";
    default:
      return "solid";
  }
}, D3 = (e, t) => {
  const r = t.querySelector(`path[id="${e.id}"][data-edge="true"]`);
  return r ? [r] : e.start !== e.end ? [] : [
    `${e.start}-cyclic-special-1`,
    `${e.start}-cyclic-special-mid`,
    `${e.start}-cyclic-special-2`
  ].map((s) => t.querySelector(`path[id="${s}"][data-edge="true"]`)).filter((s) => s !== null);
}, P3 = (e) => {
  const t = [];
  return e.forEach((r) => {
    Mp(r).forEach((i) => {
      const s = t[t.length - 1];
      s && s.x === i.x && s.y === i.y || t.push(i);
    });
  }), t;
}, R3 = (e, t) => {
  const r = t.querySelector(`[id="${e.id}"]`);
  if (!r)
    throw new Error(`ER entity ${e.id} not found in rendered SVG`);
  const i = e.attributes.length ? ze() : void 0, s = r.getBBox(), { tx: o, ty: n } = Jc(r, t), a = A3([
    ...e.cssStyles || [],
    ...e.cssCompiledStyles || []
  ]), l = Ft(a.fill || ""), c = Ft(a.stroke || ""), h = E3(a["stroke-width"]), u = Ft(a["stroke-dasharray"] || ""), d = Array.from(r.querySelectorAll("g.label")).map((w) => $3(w, t, a.color)).filter((w) => w !== null), f = d.find((w) => w.className.includes("name")) || d[0], m = d.filter((w) => w !== f), y = f?.text || Fe(e.alias || e.label || ""), x = {
    type: "rectangle",
    id: e.id,
    groupId: i,
    x: s.x + o,
    y: s.y + n,
    width: s.width,
    height: s.height,
    label: {
      text: y,
      fontSize: e.attributes.length ? bp : f?.fontSize || 16,
      color: f?.color,
      textAlign: "center",
      verticalAlign: e.attributes.length ? "top" : "middle"
    },
    metadata: {
      entityId: e.id,
      entityLabel: e.label,
      entityAlias: e.alias
    }
  };
  je(l) && l !== "none" && (x.bgColor = l), je(c) && c !== "none" && (x.strokeColor = c), h && Number.isFinite(h) && h > 0 && (x.strokeWidth = h), u && u !== "none" && (x.strokeStyle = "dashed");
  const C = Array.from(r.querySelectorAll(".divider path, path.divider, line.divider")).map((w) => O3(w, t, i, e.id, x.strokeColor, x.strokeWidth, x.strokeStyle)).filter((w) => w !== null), b = m.map((w) => Yn(w.x, w.y, w.text, {
    id: ze(),
    groupId: i,
    width: w.width,
    height: w.height,
    fontSize: bp,
    color: w.color,
    metadata: { entityId: e.id }
  }));
  return { container: x, lines: C, text: b };
}, N3 = (e, t) => {
  const r = D3(e, t);
  if (!r.length)
    throw new Error(`ER relationship ${e.id} not found in rendered SVG`);
  const i = P3(r);
  if (i.length < 2)
    throw new Error(`ER relationship ${e.id} is missing usable path points`);
  const s = i[0], o = i[i.length - 1], n = r[0], a = Ft(n.getAttribute("stroke") || getComputedStyle(n).stroke || ""), l = Number(n.getAttribute("stroke-width") || getComputedStyle(n).strokeWidth || 1), c = Qc(s.x, s.y, o.x, o.y, {
    id: e.id,
    label: e.label ? {
      text: Fe(e.label),
      fontSize: 16,
      textAlign: "center"
    } : void 0,
    strokeStyle: I3(e.pattern),
    startArrowhead: kp(e.arrowTypeStart),
    endArrowhead: kp(e.arrowTypeEnd),
    start: { type: "rectangle", id: e.start },
    end: { type: "rectangle", id: e.end },
    points: i.map((h) => [
      h.x - s.x,
      h.y - s.y
    ])
  });
  return je(a) && a !== "none" && (c.strokeColor = a), Number.isFinite(l) && l > 0 && (c.strokeWidth = l), c;
}, q3 = (e, t) => {
  const r = e.getData(), i = r.nodes, s = r.edges, o = [], n = [], a = [];
  i.forEach((c) => {
    const h = R3(c, t);
    o.push(h.container), n.push(...h.lines), a.push(...h.text);
  });
  const l = s.map((c) => N3(c, t));
  return {
    type: "erd",
    nodes: [o],
    lines: n,
    arrows: l,
    text: a
  };
}, Ti = (e) => {
  const t = Ft(e || "");
  return !t || t === "none" || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)" ? !1 : je(t);
}, OC = (e, t, r) => {
  switch (t) {
    case Ht.FILL:
    case Ht.STROKE:
      Ti(r) && (e[t] = Ft(r));
      break;
    case Ht.STROKE_WIDTH:
    case Ht.STROKE_DASHARRAY:
      Ft(r) && (e[t] = Ft(r));
      break;
  }
}, IC = (e, t, r) => {
  t === Se.COLOR && Ti(r) && (e[Se.COLOR] = Ft(r));
}, W3 = (e, t, r) => {
  e && Ue(e).forEach(({ property: i, value: s }) => {
    OC(t, i, s), IC(r, i, s);
  });
}, z3 = (e, t) => {
  e && Ue(e).forEach(({ property: r, value: i }) => {
    if (r === Ht.FILL && Ti(i)) {
      t[Se.COLOR] = Ft(i);
      return;
    }
    IC(t, r, i);
  });
}, H3 = (e) => {
  const t = /* @__PURE__ */ new Set();
  return e.filter(Boolean).forEach((r) => {
    Ue(r || "").forEach(({ property: i }) => {
      t.add(i);
    });
  }), t;
}, Y3 = (e, t, r) => {
  if (!e)
    return;
  [
    [Ht.FILL, e.getAttribute("fill")],
    [Ht.STROKE, e.getAttribute("stroke")],
    [
      Ht.STROKE_WIDTH,
      e.getAttribute("stroke-width")
    ],
    [
      Ht.STROKE_DASHARRAY,
      e.getAttribute("stroke-dasharray")
    ]
  ].forEach(([s, o]) => {
    if (!r.has(s) || t[s])
      return;
    const n = Ft(o || "");
    n && OC(t, s, n);
  });
}, U3 = (e, t, r) => {
  if (!e)
    return;
  const i = [
    e,
    ...Array.from(e.querySelectorAll("text, foreignObject, div, span, p"))
  ];
  for (const s of i) {
    if (t[Se.COLOR] || (r.has(Se.COLOR) || r.has(Ht.FILL)) && (z3(s.getAttribute("style"), t), t[Se.COLOR]))
      break;
    const o = Ft(s.getAttribute("fill") || s.getAttribute("color") || "");
    (r.has(Se.COLOR) || r.has(Ht.FILL)) && Ti(o) && (t[Se.COLOR] = o);
  }
}, tu = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: n } = fi(s);
    r += o, i += n, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, j3 = (e, t) => {
  const r = e.getBBox(), { tx: i, ty: s } = tu(e, t);
  return {
    x: r.x + i,
    y: r.y + s,
    width: r.width,
    height: r.height
  };
}, X3 = (e, t) => {
  const r = e.querySelector("line.divider");
  if (!r)
    return;
  const { tx: i, ty: s } = tu(r, t);
  return {
    startX: Number(r.getAttribute("x1")) + i,
    startY: Number(r.getAttribute("y1")) + s,
    endX: Number(r.getAttribute("x2")) + i,
    endY: Number(r.getAttribute("y2")) + s
  };
}, G3 = (e) => {
  const t = e.getBBox();
  return Math.abs(t.width * t.height);
}, wp = (e, t) => {
  const r = e.getAttribute("style");
  if (!r)
    return;
  const i = Ue(r).find((s) => s.property === t);
  if (i)
    return Ft(i.value);
}, Ch = (e, t) => {
  const r = e.map((s) => ({ element: s, area: G3(s) })).filter(({ area: s }) => Number.isFinite(s) && s > 0);
  return r.length === 0 ? null : r.sort((s, o) => t === "largest" ? o.area - s.area : s.area - o.area)[0].element;
}, V3 = (e, t) => {
  if (!e || !t.has(Ht.FILL) && !t.has(Ht.STROKE))
    return;
  const r = Ft(e.getAttribute("fill") || wp(e, Ht.FILL) || ""), i = Ft(e.getAttribute("stroke") || wp(e, Ht.STROKE) || "");
  if (Ti(r))
    return r;
  if (Ti(i))
    return i;
}, K3 = (e, t) => {
  const r = Array.from(e.querySelectorAll("circle, ellipse, path")), i = Ch(r, "smallest");
  return V3(i, t);
}, Z3 = (e) => {
  if (e.length < 2)
    return e;
  const t = e.slice(1), r = t.filter((i) => i.trim().length > 0).reduce((i, s) => {
    const o = s.match(/^\s*/)?.[0].length ?? 0;
    return Math.min(i, o);
  }, Number.POSITIVE_INFINITY);
  return !Number.isFinite(r) || r <= 0 ? e.map((i) => i.trimEnd()) : [
    e[0].trimEnd(),
    ...t.map((i) => i.replace(new RegExp(`^\\s{0,${r}}`), "").trimEnd())
  ];
}, Q3 = (e) => {
  const t = Array.isArray(e.label) ? e.label.map((i) => Fe(i)) : Fe(e.label || "").split(`
`);
  return Z3(t).join(`
`);
}, J3 = (e) => e.description ? (Array.isArray(e.description) ? e.description : [e.description]).map((r) => Fe(r)).filter((r) => r.length > 0) : [], tI = (e) => {
  const t = /* @__PURE__ */ new Set(), r = (s) => (s && t.add(s), s), i = (s) => {
    const o = s.find((n) => !t.has(n));
    return r(o || null);
  };
  return (s) => {
    const o = [
      `[id='${s.domId}']`,
      `[id='${s.id}']`,
      `[data-id='${s.id}']`
    ];
    for (const n of o) {
      const a = e.querySelector(n);
      if (a)
        return r(a);
    }
    switch (s.shape) {
      case "divider":
        return i(Array.from(e.querySelectorAll("g.statediagram-cluster-alt")));
      case "stateStart":
        return i(Array.from(e.querySelectorAll("g.node.default")).filter((n) => n.querySelector("circle.state-start")));
      case "stateEnd":
        return i(Array.from(e.querySelectorAll("g.node.default")).filter((n) => !n.querySelector("circle.state-start")));
      default:
        return null;
    }
  };
}, eI = (e, t) => {
  switch (t) {
    case "roundedWithTitle":
      return e.querySelector("rect.outer") || e.querySelector("rect") || e;
    case "divider":
      return e.querySelector("rect.divider") || e.querySelector("rect") || e;
    case "rectWithTitle":
      return e.querySelector("rect.outer") || e.querySelector("rect") || e;
    case "stateStart":
      return Ch(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
    case "stateEnd":
      return Ch(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
    default:
      return e.querySelector("rect, path, circle, ellipse, polygon") || e;
  }
}, rI = (e, t, r) => {
  const i = r(e);
  if (!i)
    throw new Error(`State node element not found for "${e.id}"`);
  const s = eI(i, e.shape), o = {}, n = {}, a = [
    e.labelStyle,
    ...e.cssCompiledStyles || [],
    ...e.cssStyles || []
  ], l = H3(a);
  a.filter(Boolean).forEach((h) => {
    W3(h, o, n);
  }), Y3(s, o, l), U3(i, n, l);
  const c = j3(s, t);
  return {
    id: e.id,
    shape: e.shape,
    text: Q3(e),
    description: J3(e),
    x: c.x,
    y: c.y,
    width: c.width,
    height: c.height,
    parentId: e.parentId,
    position: e.position,
    containerStyle: o,
    labelStyle: n,
    dividerLine: e.shape === "rectWithTitle" ? X3(i, t) : void 0,
    endInnerColor: e.shape === "stateEnd" ? K3(i, l) : void 0,
    isRenderable: e.shape !== "noteGroup"
  };
}, iI = (e, t) => {
  const r = t.querySelector(`[id='${e.id}']`);
  if (!r)
    return null;
  const { tx: i, ty: s } = tu(r, t), o = $p(r, { x: i, y: s }, "MCL");
  if (o.reflectionPoints.length < 2)
    return null;
  const n = {}, a = (c, h) => {
    switch (c) {
      case Ht.STROKE:
        Ti(h) && (n.strokeColor = Ft(h));
        break;
      case Ht.STROKE_WIDTH: {
        const u = parseFloat(Ft(h));
        Number.isFinite(u) && u > 0 && (n.strokeWidth = u);
        break;
      }
      case Ht.STROKE_DASHARRAY:
        Ft(h) && (n.strokeStyle = "dashed");
        break;
    }
  };
  [e.style].filter(Boolean).forEach((c) => {
    Ue(c || "").forEach(({ property: h, value: u }) => {
      a(h, u);
    });
  });
  const l = e.arrowhead === "none" || e.classes?.includes("note-edge");
  return {
    id: e.id,
    start: e.start,
    end: e.end,
    text: Fe(e.label || ""),
    ...o,
    strokeColor: n.strokeColor,
    strokeWidth: n.strokeWidth,
    strokeStyle: l ? "dashed" : n.strokeStyle,
    isNoteEdge: l
  };
}, sI = (e, t) => {
  const { nodes: r, edges: i } = e.getData(), s = tI(t);
  return {
    type: "state",
    nodes: r.map((o) => rI(o, t, s)),
    edges: i.map((o) => iI(o, t)).filter((o) => o !== null)
  };
};
let Sp = Promise.resolve();
const oI = (e) => {
  const t = Sp.then(e, e);
  return Sp = t.then(() => {
  }, () => {
  }), t;
};
let Tp = null, nI = 0;
const aI = (e) => JSON.stringify(e), _p = (e) => {
  const t = e.querySelector("svg");
  if (!t)
    throw new Error("SVG element not found");
  const r = t.getBoundingClientRect(), i = r.width, s = r.height;
  t.setAttribute("width", `${i}`), t.setAttribute("height", `${s}`);
  const o = "image/svg+xml", n = unescape(encodeURIComponent(t.outerHTML)), l = `data:image/svg+xml;base64,${btoa(n)}`;
  return {
    type: "graphImage",
    mimeType: o,
    dataURL: l,
    width: i,
    height: s
  };
}, lI = async (e, t = Do) => oI(async () => {
  const r = t.themeVariables?.fontSize ?? Do.themeVariables.fontSize, i = {
    ...Do,
    ...t,
    fontSize: r,
    themeVariables: {
      ...Do.themeVariables,
      ...t.themeVariables,
      fontSize: r
    }
  }, s = aI(i);
  s !== Tp && (wl.initialize(i), Tp = s);
  const o = await wl.mermaidAPI.getDiagramFromText(Db(e)), n = `mermaid-to-excalidraw-${nI++}`, a = document.createElement("div");
  a.setAttribute("style", "opacity: 0; position: fixed; z-index: -1; left: -99999px; top: -99999px;");
  const l = `${n}-container`;
  a.id = l, document.getElementById(l)?.remove(), document.body.appendChild(a);
  try {
    const { svg: c } = await wl.render(n, e, a);
    a.innerHTML = c;
    let h;
    try {
      switch (o.type) {
        case "flowchart-v2":
        case "graph": {
          h = i3(o.db, a);
          break;
        }
        case "sequence": {
          h = f3(o, a);
          break;
        }
        case "class":
        case "classDiagram": {
          h = L3(o, a);
          break;
        }
        case "er": {
          h = q3(o.db, a);
          break;
        }
        case "state":
        case "stateDiagram": {
          h = sI(o.db, a);
          break;
        }
        default:
          h = _p(a);
      }
    } catch (u) {
      console.error("Error processing Mermaid diagram:", u), h = _p(a);
    }
    return h;
  } finally {
    a.remove();
  }
}), hI = async (e, t) => {
  const r = t || {}, i = parseInt(r.themeVariables?.fontSize ?? "") || bo, s = await lI(e, {
    ...r,
    themeVariables: {
      ...r.themeVariables
    }
  });
  return qb(s, {
    fontSize: i
  });
}, KI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseMermaidToExcalidraw: hI
}, Symbol.toStringTag, { value: "Module" }));
export {
  fM as $,
  Kt as A,
  Rk as B,
  pr as C,
  Jh as D,
  Hp as E,
  F_ as F,
  yT as G,
  sT as H,
  rd as I,
  ed as J,
  TI as K,
  CI as L,
  wI as M,
  kI as N,
  yI as O,
  Nh as P,
  SI as Q,
  xI as R,
  Oi as S,
  vI as T,
  At as U,
  _I as V,
  bI as W,
  R1 as X,
  pI as Y,
  pM as Z,
  p as _,
  Mk as a,
  am as a$,
  ao as a0,
  fI as a1,
  Zn as a2,
  w_ as a3,
  xk as a4,
  eg as a5,
  us as a6,
  Du as a7,
  ua as a8,
  lT as a9,
  zB as aA,
  ge as aB,
  $v as aC,
  jh as aD,
  Yh as aE,
  an as aF,
  n_ as aG,
  o_ as aH,
  s_ as aI,
  i_ as aJ,
  VT as aK,
  sm as aL,
  QT as aM,
  GT as aN,
  e_ as aO,
  om as aP,
  ZT as aQ,
  h_ as aR,
  l_ as aS,
  a_ as aT,
  u_ as aU,
  c_ as aV,
  KT as aW,
  nm as aX,
  r_ as aY,
  t_ as aZ,
  JT as a_,
  Ul as aa,
  E_ as ab,
  tr as ac,
  H as ad,
  Y as ae,
  vk as af,
  ig as ag,
  S0 as ah,
  yc as ai,
  Zd as aj,
  vo as ak,
  zT as al,
  Zh as am,
  ft as an,
  II as ao,
  OI as ap,
  cM as aq,
  Pt as ar,
  K0 as as,
  pt as at,
  $I as au,
  qn as av,
  Q0 as aw,
  ia as ax,
  xc as ay,
  v0 as az,
  Fk as b,
  W0 as b$,
  A0 as b0,
  pm as b1,
  Dp as b2,
  oT as b3,
  dI as b4,
  rr as b5,
  WT as b6,
  gI as b7,
  Ih as b8,
  Ur as b9,
  ki as bA,
  ks as bB,
  Ir as bC,
  wf as bD,
  gr as bE,
  Lr as bF,
  zA as bG,
  df as bH,
  Nn as bI,
  Er as bJ,
  QL as bK,
  Me as bL,
  mf as bM,
  wc as bN,
  HF as bO,
  aa as bP,
  Rn as bQ,
  qF as bR,
  V0 as bS,
  ur as bT,
  JL as bU,
  Bc as bV,
  M0 as bW,
  YF as bX,
  WF as bY,
  FF as bZ,
  oa as b_,
  co as ba,
  Vu as bb,
  Rw as bc,
  gt as bd,
  Jg as be,
  Ee as bf,
  Fw as bg,
  Oh as bh,
  yg as bi,
  _o as bj,
  bg as bk,
  mI as bl,
  Ub as bm,
  Cc as bn,
  bc as bo,
  af as bp,
  I0 as bq,
  na as br,
  O0 as bs,
  aA as bt,
  D0 as bu,
  jA as bv,
  ME as bw,
  ZL as bx,
  nA as by,
  XA as bz,
  Ot as c,
  ca as c0,
  z0 as c1,
  MF as c2,
  AE as c3,
  ii as c4,
  Ks as c5,
  Wi as c6,
  Ko as c7,
  Ka as c8,
  QF as c9,
  vB as ca,
  KI as cb,
  rg as d,
  ne as e,
  Mr as f,
  Ok as g,
  b0 as h,
  He as i,
  Et as j,
  So as k,
  q as l,
  mm as m,
  wo as n,
  jT as o,
  Ik as p,
  Dk as q,
  Ek as r,
  $k as s,
  BI as t,
  Vr as u,
  Wb as v,
  O_ as w,
  VI as x,
  GI as y,
  me as z
};
