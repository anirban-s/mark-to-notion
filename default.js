var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function (a) {
  return (a.raw = a);
};
$jscomp.createTemplateTagFirstArgWithRaw = function (a, b) {
  a.raw = b;
  return a;
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a;
      };
$jscomp.getGlobal = function (a) {
  a = [
    "object" == typeof globalThis && globalThis,
    a,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) return c;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b, c) {
  if (!c || null != a) {
    c = $jscomp.propertyToPolyfillSymbol[b];
    if (null == c) return a[b];
    c = a[c];
    return void 0 !== c ? c : a[b];
  }
};
$jscomp.polyfill = function (a, b, c, d) {
  b &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(a, b, c, d)
      : $jscomp.polyfillUnisolated(a, b, c, d));
};
$jscomp.polyfillUnisolated = function (a, b, c, d) {
  c = $jscomp.global;
  a = a.split(".");
  for (d = 0; d < a.length - 1; d++) {
    var f = a[d];
    if (!(f in c)) return;
    c = c[f];
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d &&
    null != b &&
    $jscomp.defineProperty(c, a, { configurable: !0, writable: !0, value: b });
};
$jscomp.polyfillIsolated = function (a, b, c, d) {
  var f = a.split(".");
  a = 1 === f.length;
  d = f[0];
  d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var h = 0; h < f.length - 1; h++) {
    var n = f[h];
    if (!(n in d)) return;
    d = d[n];
  }
  f = f[f.length - 1];
  c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[f] : null;
  b = b(c);
  null != b &&
    (a
      ? $jscomp.defineProperty($jscomp.polyfills, f, {
          configurable: !0,
          writable: !0,
          value: b,
        })
      : b !== c &&
        (void 0 === $jscomp.propertyToPolyfillSymbol[f] &&
          ((c = (1e9 * Math.random()) >>> 0),
          ($jscomp.propertyToPolyfillSymbol[f] = $jscomp.IS_SYMBOL_NATIVE
            ? $jscomp.global.Symbol(f)
            : $jscomp.POLYFILL_PREFIX + c + "$" + f)),
        $jscomp.defineProperty(d, $jscomp.propertyToPolyfillSymbol[f], {
          configurable: !0,
          writable: !0,
          value: b,
        })));
};
$jscomp.underscoreProtoCanBeSet = function () {
  var a = { a: !0 },
    b = {};
  try {
    return (b.__proto__ = a), b.a;
  } catch (c) {}
  return !1;
};
$jscomp.setPrototypeOf =
  $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf
    ? Object.setPrototypeOf
    : $jscomp.underscoreProtoCanBeSet()
    ? function (a, b) {
        a.__proto__ = b;
        if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
        return a;
      }
    : null;
$jscomp.arrayIteratorImpl = function (a) {
  var b = 0;
  return function () {
    return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.makeIterator = function (a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) return b.call(a);
  if ("number" == typeof a.length) return $jscomp.arrayIterator(a);
  throw Error(String(a) + " is not an iterable or ArrayLike");
};
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function (a) {
  if (!(a instanceof Object))
    throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function () {
  this.isRunning_ = !1;
  this.yieldAllIterator_ = null;
  this.yieldResult = void 0;
  this.nextAddress = 1;
  this.finallyAddress_ = this.catchAddress_ = 0;
  this.finallyContexts_ = this.abruptCompletion_ = null;
};
$jscomp.generator.Context.prototype.start_ = function () {
  if (this.isRunning_) throw new TypeError("Generator is already running");
  this.isRunning_ = !0;
};
$jscomp.generator.Context.prototype.stop_ = function () {
  this.isRunning_ = !1;
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
$jscomp.generator.Context.prototype.next_ = function (a) {
  this.yieldResult = a;
};
$jscomp.generator.Context.prototype.throw_ = function (a) {
  this.abruptCompletion_ = { exception: a, isException: !0 };
  this.jumpToErrorHandler_();
};
$jscomp.generator.Context.prototype["return"] = function (a) {
  this.abruptCompletion_ = { return: a };
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
  this.abruptCompletion_ = { jumpTo: a };
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.yield = function (a, b) {
  this.nextAddress = b;
  return { value: a };
};
$jscomp.generator.Context.prototype.yieldAll = function (a, b) {
  var c = $jscomp.makeIterator(a),
    d = c.next();
  $jscomp.generator.ensureIteratorResultIsObject_(d);
  if (d.done) (this.yieldResult = d.value), (this.nextAddress = b);
  else return (this.yieldAllIterator_ = c), this.yield(d.value, b);
};
$jscomp.generator.Context.prototype.jumpTo = function (a) {
  this.nextAddress = a;
};
$jscomp.generator.Context.prototype.jumpToEnd = function () {
  this.nextAddress = 0;
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
  this.catchAddress_ = a;
  void 0 != b && (this.finallyAddress_ = b);
};
$jscomp.generator.Context.prototype.setFinallyBlock = function (a) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = a || 0;
};
$jscomp.generator.Context.prototype.leaveTryBlock = function (a, b) {
  this.nextAddress = a;
  this.catchAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.enterCatchBlock = function (a) {
  this.catchAddress_ = a || 0;
  a = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return a;
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function (a, b, c) {
  c
    ? (this.finallyContexts_[c] = this.abruptCompletion_)
    : (this.finallyContexts_ = [this.abruptCompletion_]);
  this.catchAddress_ = a || 0;
  this.finallyAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
  var c = this.finallyContexts_.splice(b || 0)[0];
  if ((c = this.abruptCompletion_ = this.abruptCompletion_ || c)) {
    if (c.isException) return this.jumpToErrorHandler_();
    void 0 != c.jumpTo && this.finallyAddress_ < c.jumpTo
      ? ((this.nextAddress = c.jumpTo), (this.abruptCompletion_ = null))
      : (this.nextAddress = this.finallyAddress_);
  } else this.nextAddress = a;
};
$jscomp.generator.Context.prototype.forIn = function (a) {
  return new $jscomp.generator.Context.PropertyIterator(a);
};
$jscomp.generator.Context.PropertyIterator = function (a) {
  this.object_ = a;
  this.properties_ = [];
  for (var b in a) this.properties_.push(b);
  this.properties_.reverse();
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
  for (; 0 < this.properties_.length; ) {
    var a = this.properties_.pop();
    if (a in this.object_) return a;
  }
  return null;
};
$jscomp.generator.Engine_ = function (a) {
  this.context_ = new $jscomp.generator.Context();
  this.program_ = a;
};
$jscomp.generator.Engine_.prototype.next_ = function (a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_)
    return this.yieldAllStep_(
      this.context_.yieldAllIterator_.next,
      a,
      this.context_.next_
    );
  this.context_.next_(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.return_ = function (a) {
  this.context_.start_();
  var b = this.context_.yieldAllIterator_;
  if (b)
    return this.yieldAllStep_(
      "return" in b
        ? b["return"]
        : function (c) {
            return { value: c, done: !0 };
          },
      a,
      this.context_["return"]
    );
  this.context_["return"](a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.throw_ = function (a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_)
    return this.yieldAllStep_(
      this.context_.yieldAllIterator_["throw"],
      a,
      this.context_.next_
    );
  this.context_.throw_(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (a, b, c) {
  try {
    var d = a.call(this.context_.yieldAllIterator_, b);
    $jscomp.generator.ensureIteratorResultIsObject_(d);
    if (!d.done) return this.context_.stop_(), d;
    var f = d.value;
  } catch (h) {
    return (
      (this.context_.yieldAllIterator_ = null),
      this.context_.throw_(h),
      this.nextStep_()
    );
  }
  this.context_.yieldAllIterator_ = null;
  c.call(this.context_, f);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.nextStep_ = function () {
  for (; this.context_.nextAddress; )
    try {
      var a = this.program_(this.context_);
      if (a) return this.context_.stop_(), { value: a.value, done: !1 };
    } catch (b) {
      (this.context_.yieldResult = void 0), this.context_.throw_(b);
    }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    a = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (a.isException) throw a.exception;
    return { value: a["return"], done: !0 };
  }
  return { value: void 0, done: !0 };
};
$jscomp.generator.Generator_ = function (a) {
  this.next = function (b) {
    return a.next_(b);
  };
  this["throw"] = function (b) {
    return a.throw_(b);
  };
  this["return"] = function (b) {
    return a.return_(b);
  };
  this[Symbol.iterator] = function () {
    return this;
  };
};
$jscomp.generator.createGenerator = function (a, b) {
  var c = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
  $jscomp.setPrototypeOf &&
    a.prototype &&
    $jscomp.setPrototypeOf(c, a.prototype);
  return c;
};
$jscomp.asyncExecutePromiseGenerator = function (a) {
  function b(d) {
    return a.next(d);
  }
  function c(d) {
    return a["throw"](d);
  }
  return new Promise(function (d, f) {
    function h(n) {
      n.done ? d(n.value) : Promise.resolve(n.value).then(b, c).then(h, f);
    }
    h(a.next());
  });
};
$jscomp.asyncExecutePromiseGeneratorFunction = function (a) {
  return $jscomp.asyncExecutePromiseGenerator(a());
};
$jscomp.asyncExecutePromiseGeneratorProgram = function (a) {
  return $jscomp.asyncExecutePromiseGenerator(
    new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a))
  );
};
document.addEventListener("DOMContentLoaded", function () {
  function a(k) {
    var g;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
      if (1 == e.nextAddress)
        return e.yield(
          fetch("https://api.notion.com/v1/search", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + p,
              "Content-Type": "application/json",
              "Notion-Version": "2022-06-28",
            },
            body: JSON.stringify({
              query: k,
              filter: { value: "page", property: "object" },
              sort: { direction: "ascending", timestamp: "last_edited_time" },
            }),
          }),
          2
        );
      if (3 != e.nextAddress) return (g = e.yieldResult), e.yield(g.json(), 3);
      g = e.yieldResult;
      return e["return"](g.results[0].id);
    });
  }
  function b(k) {
    var g;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
      if (1 == e.nextAddress)
        return e.yield(
          fetch("https://api.notion.com/v1/search", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + p,
              "Content-Type": "application/json",
              "Notion-Version": "2022-06-28",
            },
            body: JSON.stringify({
              query: k,
              filter: { value: "page", property: "object" },
              sort: { direction: "ascending", timestamp: "last_edited_time" },
            }),
          }),
          2
        );
      if (3 != e.nextAddress) return (g = e.yieldResult), e.yield(g.json(), 3);
      g = e.yieldResult;
      return e["return"](0 < g.results.length);
    });
  }
  function c(k, g, e) {
    var l;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (q) {
      if (1 == q.nextAddress)
        return q.yield(
          fetch("https://api.notion.com/v1/pages", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + p,
              "Content-Type": "application/json",
              "Notion-Version": "2022-06-28",
            },
            body: JSON.stringify({
              parent: { type: "page_id", page_id: k },
              properties: { title: [{ type: "text", text: { content: g } }] },
              children: [{ object: "block", type: "embed", embed: { url: e } }],
            }),
          }),
          2
        );
      document.getElementById("url").value = "";
      l = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Saved!",
        message: "The tweet is saved to Notion page.",
      };
      chrome.notifications.create("saveNotification", l);
      q.jumpToEnd();
    });
  }
  function d(k, g) {
    var e;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (l) {
      if (1 == l.nextAddress)
        return l.yield(
          fetch("https://api.notion.com/v1/blocks/" + k + "/children", {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + p,
              "Content-Type": "application/json",
              "Notion-Version": "2022-06-28",
            },
            body: JSON.stringify({
              children: [{ object: "block", type: "embed", embed: { url: g } }],
            }),
          }),
          2
        );
      document.getElementById("url").value = "";
      e = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Saved!",
        message: "The tweet is saved to Notion page.",
      };
      chrome.notifications.update("saveNotification", e);
      l.jumpToEnd();
    });
  }
  function f(k) {
    var g, e, l, q;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (m) {
      switch (m.nextAddress) {
        case 1:
          g = "Twitter Bookmarks";
          var t = k.split("/");
          e = "twitter.com" === t[2] && t[3] ? "@" + t[3] : "Other WebSite";
          return m.yield(b(e), 2);
        case 2:
          return (q = m.yieldResult) ? m.yield(a(e), 7) : m.yield(a(g), 5);
        case 5:
          return (l = m.yieldResult), m.yield(c(l, e, k), 0);
        case 7:
          return (l = m.yieldResult), m.yield(d(l, k), 0);
      }
    });
  }
  var h = document.getElementById("url"),
    n = document.getElementById("save-to-notion"),
    u = document.getElementById("secret"),
    v = document.getElementById("toggleSecret"),
    r = document.getElementById("secret-input"),
    p = localStorage.getItem("notionKey");
  p
    ? ((u.value = p), (r.style.display = "none"))
    : ((r.style.display = "block"),
      (u.placeholder = "Paste Your Notion API Key"));
  v.addEventListener("click", function () {
    "none" === r.style.display
      ? (r.style.display = "block")
      : ((p = u.value),
        localStorage.setItem("notionKey", p),
        (r.style.display = "none"));
  });
  n.addEventListener("click", function () {
    0 < h.value.length && f(h.value);
  });
});
