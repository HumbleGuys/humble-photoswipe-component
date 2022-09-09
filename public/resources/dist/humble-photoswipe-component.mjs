/*!
  * PhotoSwipe Lightbox 5.3.2 - https://photoswipe.com
  * (c) 2022 Dmytro Semenov
  */
function I(n, t, e) {
  const i = document.createElement(t || "div");
  return n && (i.className = n), e && e.appendChild(i), i;
}
function Q(n, t, e) {
  let i = "translate3d(" + n + "px," + (t || 0) + "px,0)";
  return e !== void 0 && (i += " scale3d(" + e + "," + e + ",1)"), i;
}
function T(n, t, e) {
  n.style.width = typeof t == "number" ? t + "px" : t, n.style.height = typeof e == "number" ? e + "px" : e;
}
const f = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error"
};
function J(n) {
  if (n.which === 2 || n.ctrlKey || n.metaKey || n.altKey || n.shiftKey)
    return !0;
}
function x(n, t, e = document) {
  let i = [];
  if (n instanceof Element)
    i = [n];
  else if (n instanceof NodeList || Array.isArray(n))
    i = Array.from(n);
  else {
    const s = typeof n == "string" ? n : t;
    s && (i = Array.from(e.querySelectorAll(s)));
  }
  return i;
}
function tt(n) {
  return typeof n == "function" && n.prototype && n.prototype.goTo;
}
function D() {
  return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}
class et {
  constructor(t, e) {
    this.type = t, e && Object.assign(this, e);
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
}
class it {
  constructor() {
    this._listeners = {}, this._filters = {}, this.pswp = void 0, this.options = void 0;
  }
  addFilter(t, e, i = 100) {
    this._filters[t] || (this._filters[t] = []), this._filters[t].push({ fn: e, priority: i }), this._filters[t].sort((s, o) => s.priority - o.priority), this.pswp && this.pswp.addFilter(t, e, i);
  }
  removeFilter(t, e) {
    this._filters[t] && (this._filters[t] = this._filters[t].filter((i) => i.fn !== e)), this.pswp && this.pswp.removeFilter(t, e);
  }
  applyFilters(t, ...e) {
    return this._filters[t] && this._filters[t].forEach((i) => {
      e[0] = i.fn.apply(this, e);
    }), e[0];
  }
  on(t, e) {
    this._listeners[t] || (this._listeners[t] = []), this._listeners[t].push(e), this.pswp && this.pswp.on(t, e);
  }
  off(t, e) {
    this._listeners[t] && (this._listeners[t] = this._listeners[t].filter((i) => e !== i)), this.pswp && this.pswp.off(t, e);
  }
  dispatch(t, e) {
    if (this.pswp)
      return this.pswp.dispatch(t, e);
    const i = new et(t, e);
    return this._listeners && this._listeners[t] && this._listeners[t].forEach((s) => {
      s.call(this, i);
    }), i;
  }
}
class st {
  constructor(t, e) {
    this.element = I(
      "pswp__img pswp__img--placeholder",
      t ? "img" : "",
      e
    ), t && (this.element.decoding = "async", this.element.alt = "", this.element.src = t, this.element.setAttribute("role", "presentation")), this.element.setAttribute("aria-hiden", "true");
  }
  setDisplayedSize(t, e) {
    !this.element || (this.element.tagName === "IMG" ? (T(this.element, 250, "auto"), this.element.style.transformOrigin = "0 0", this.element.style.transform = Q(0, 0, t / 250)) : T(this.element, t, e));
  }
  destroy() {
    this.element.parentNode && this.element.remove(), this.element = null;
  }
}
class nt {
  constructor(t, e, i) {
    this.instance = e, this.data = t, this.index = i, this.element = void 0, this.displayedImageWidth = 0, this.displayedImageHeight = 0, this.width = Number(this.data.w) || Number(this.data.width) || 0, this.height = Number(this.data.h) || Number(this.data.height) || 0, this.isAttached = !1, this.hasSlide = !1, this.state = f.IDLE, this.data.type ? this.type = this.data.type : this.data.src ? this.type = "image" : this.type = "html", this.instance.dispatch("contentInit", { content: this });
  }
  removePlaceholder() {
    this.placeholder && !this.keepPlaceholder() && setTimeout(() => {
      this.placeholder && (this.placeholder.destroy(), this.placeholder = null);
    }, 1e3);
  }
  load(t, e) {
    if (this.slide && this.usePlaceholder())
      if (this.placeholder) {
        const i = this.placeholder.element;
        i && !i.parentElement && this.slide.container.prepend(i);
      } else {
        const i = this.instance.applyFilters(
          "placeholderSrc",
          this.data.msrc && this.slide.isFirstSlide ? this.data.msrc : !1,
          this
        );
        this.placeholder = new st(
          i,
          this.slide.container
        );
      }
    this.element && !e || this.instance.dispatch("contentLoad", { content: this, isLazy: t }).defaultPrevented || (this.isImageContent() ? (this.element = I("pswp__img", "img"), this.displayedImageWidth && this.loadImage(t)) : (this.element = I("pswp__content"), this.element.innerHTML = this.data.html || ""), e && this.slide && this.slide.updateContentSize(!0));
  }
  loadImage(t) {
    const e = this.element;
    this.instance.dispatch("contentLoadImage", { content: this, isLazy: t }).defaultPrevented || (this.updateSrcsetSizes(), this.data.srcset && (e.srcset = this.data.srcset), e.src = this.data.src, e.alt = this.data.alt || "", this.state = f.LOADING, e.complete ? this.onLoaded() : (e.onload = () => {
      this.onLoaded();
    }, e.onerror = () => {
      this.onError();
    }));
  }
  setSlide(t) {
    this.slide = t, this.hasSlide = !0, this.instance = t.pswp;
  }
  onLoaded() {
    this.state = f.LOADED, this.slide && (this.instance.dispatch("loadComplete", { slide: this.slide, content: this }), this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode && (this.append(), this.slide.updateContentSize(!0)), (this.state === f.LOADED || this.state === f.ERROR) && this.removePlaceholder());
  }
  onError() {
    this.state = f.ERROR, this.slide && (this.displayError(), this.instance.dispatch("loadComplete", { slide: this.slide, isError: !0, content: this }), this.instance.dispatch("loadError", { slide: this.slide, content: this }));
  }
  isLoading() {
    return this.instance.applyFilters(
      "isContentLoading",
      this.state === f.LOADING,
      this
    );
  }
  isError() {
    return this.state === f.ERROR;
  }
  isImageContent() {
    return this.type === "image";
  }
  setDisplayedSize(t, e) {
    if (!!this.element && (this.placeholder && this.placeholder.setDisplayedSize(t, e), !this.instance.dispatch("contentResize", { content: this, width: t, height: e }).defaultPrevented && (T(this.element, t, e), this.isImageContent() && !this.isError()))) {
      const i = !this.displayedImageWidth && t;
      this.displayedImageWidth = t, this.displayedImageHeight = e, i ? this.loadImage(!1) : this.updateSrcsetSizes(), this.slide && this.instance.dispatch("imageSizeChange", { slide: this.slide, width: t, height: e, content: this });
    }
  }
  isZoomable() {
    return this.instance.applyFilters(
      "isContentZoomable",
      this.isImageContent() && this.state !== f.ERROR,
      this
    );
  }
  updateSrcsetSizes() {
    if (this.data.srcset) {
      const t = this.element, e = this.instance.applyFilters(
        "srcsetSizesWidth",
        this.displayedImageWidth,
        this
      );
      (!t.dataset.largestUsedSize || e > parseInt(t.dataset.largestUsedSize, 10)) && (t.sizes = e + "px", t.dataset.largestUsedSize = String(e));
    }
  }
  usePlaceholder() {
    return this.instance.applyFilters(
      "useContentPlaceholder",
      this.isImageContent(),
      this
    );
  }
  lazyLoad() {
    this.instance.dispatch("contentLazyLoad", { content: this }).defaultPrevented || this.load(!0);
  }
  keepPlaceholder() {
    return this.instance.applyFilters(
      "isKeepingPlaceholder",
      this.isLoading(),
      this
    );
  }
  destroy() {
    this.hasSlide = !1, this.slide = null, !this.instance.dispatch("contentDestroy", { content: this }).defaultPrevented && (this.remove(), this.placeholder && (this.placeholder.destroy(), this.placeholder = null), this.isImageContent() && this.element && (this.element.onload = null, this.element.onerror = null, this.element = null));
  }
  displayError() {
    if (this.slide) {
      let t = I("pswp__error-msg");
      t.innerText = this.instance.options.errorMsg, t = this.instance.applyFilters(
        "contentErrorElement",
        t,
        this
      ), this.element = I("pswp__content pswp__error-msg-container"), this.element.appendChild(t), this.slide.container.innerText = "", this.slide.container.appendChild(this.element), this.slide.updateContentSize(!0), this.removePlaceholder();
    }
  }
  append() {
    if (this.isAttached)
      return;
    if (this.isAttached = !0, this.state === f.ERROR) {
      this.displayError();
      return;
    }
    if (this.instance.dispatch("contentAppend", { content: this }).defaultPrevented)
      return;
    const t = "decode" in this.element;
    this.isImageContent() ? t && this.slide && (!this.slide.isActive || D()) ? (this.isDecoding = !0, this.element.decode().finally(() => {
      this.isDecoding = !1, this.appendImage();
    })) : this.appendImage() : this.element && !this.element.parentNode && this.slide.container.appendChild(this.element);
  }
  activate() {
    this.instance.dispatch("contentActivate", { content: this }).defaultPrevented || this.slide && (this.isImageContent() && this.isDecoding && !D() ? this.appendImage() : this.isError() && this.load(!1, !0));
  }
  deactivate() {
    this.instance.dispatch("contentDeactivate", { content: this });
  }
  remove() {
    this.isAttached = !1, !this.instance.dispatch("contentRemove", { content: this }).defaultPrevented && (this.element && this.element.parentNode && this.element.remove(), this.placeholder && this.placeholder.element && this.placeholder.element.remove());
  }
  appendImage() {
    !this.isAttached || this.instance.dispatch("contentAppendImage", { content: this }).defaultPrevented || (this.slide && this.element && !this.element.parentNode && this.slide.container.appendChild(this.element), (this.state === f.LOADED || this.state === f.ERROR) && this.removePlaceholder());
  }
}
function ot(n, t) {
  if (n.getViewportSizeFn) {
    const e = n.getViewportSizeFn(n, t);
    if (e)
      return e;
  }
  return {
    x: document.documentElement.clientWidth,
    y: window.innerHeight
  };
}
function z(n, t, e, i, s) {
  let o;
  if (t.paddingFn)
    o = t.paddingFn(e, i, s)[n];
  else if (t.padding)
    o = t.padding[n];
  else {
    const r = "padding" + n[0].toUpperCase() + n.slice(1);
    t[r] && (o = t[r]);
  }
  return o || 0;
}
function rt(n, t, e, i) {
  return {
    x: t.x - z("left", n, t, e, i) - z("right", n, t, e, i),
    y: t.y - z("top", n, t, e, i) - z("bottom", n, t, e, i)
  };
}
const Z = 4e3;
class at {
  constructor(t, e, i, s) {
    this.pswp = s, this.options = t, this.itemData = e, this.index = i;
  }
  update(t, e, i) {
    this.elementSize = {
      x: t,
      y: e
    }, this.panAreaSize = i;
    const s = this.panAreaSize.x / this.elementSize.x, o = this.panAreaSize.y / this.elementSize.y;
    this.fit = Math.min(1, s < o ? s : o), this.fill = Math.min(1, s > o ? s : o), this.vFill = Math.min(1, o), this.initial = this._getInitial(), this.secondary = this._getSecondary(), this.max = Math.max(
      this.initial,
      this.secondary,
      this._getMax()
    ), this.min = Math.min(
      this.fit,
      this.initial,
      this.secondary
    ), this.pswp && this.pswp.dispatch("zoomLevelsUpdate", { zoomLevels: this, slideData: this.itemData });
  }
  _parseZoomLevelOption(t) {
    const e = t + "ZoomLevel", i = this.options[e];
    if (!!i)
      return typeof i == "function" ? i(this) : i === "fill" ? this.fill : i === "fit" ? this.fit : Number(i);
  }
  _getSecondary() {
    let t = this._parseZoomLevelOption("secondary");
    return t || (t = Math.min(1, this.fit * 3), t * this.elementSize.x > Z && (t = Z / this.elementSize.x), t);
  }
  _getInitial() {
    return this._parseZoomLevelOption("initial") || this.fit;
  }
  _getMax() {
    const t = this._parseZoomLevelOption("max");
    return t || Math.max(1, this.fit * 4);
  }
}
function W(n, t, e) {
  const i = t.createContentFromData(n, e);
  if (!i || !i.lazyLoad)
    return;
  const { options: s } = t, o = t.viewportSize || ot(s, t), r = rt(s, o, n, e), a = new at(s, n, -1);
  return a.update(i.width, i.height, r), i.lazyLoad(), i.setDisplayedSize(
    Math.ceil(i.width * a.initial),
    Math.ceil(i.height * a.initial)
  ), i;
}
function ht(n, t) {
  const e = t.getItemData(n);
  if (!t.dispatch("lazyLoadSlide", { index: n, itemData: e }).defaultPrevented)
    return W(e, t, n);
}
class lt extends it {
  getNumItems() {
    let t;
    const { dataSource: e } = this.options;
    e ? "length" in e ? t = e.length : "gallery" in e && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), e.items && (t = e.items.length)) : t = 0;
    const i = this.dispatch("numItems", {
      dataSource: e,
      numItems: t
    });
    return this.applyFilters("numItems", i.numItems, e);
  }
  createContentFromData(t, e) {
    return new nt(t, this, e);
  }
  getItemData(t) {
    const { dataSource: e } = this.options;
    let i;
    Array.isArray(e) ? i = e[t] : e && e.gallery && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), i = e.items[t]);
    let s = i;
    s instanceof Element && (s = this._domElementToItemData(s));
    const o = this.dispatch("itemData", {
      itemData: s || {},
      index: t
    });
    return this.applyFilters("itemData", o.itemData, t);
  }
  _getGalleryDOMElements(t) {
    return this.options.children || this.options.childSelector ? x(
      this.options.children,
      this.options.childSelector,
      t
    ) || [] : [t];
  }
  _domElementToItemData(t) {
    const e = {
      element: t
    }, i = t.tagName === "A" ? t : t.querySelector("a");
    if (i) {
      e.src = i.dataset.pswpSrc || i.href, i.dataset.pswpSrcset && (e.srcset = i.dataset.pswpSrcset), e.width = parseInt(i.dataset.pswpWidth, 10), e.height = parseInt(i.dataset.pswpHeight, 10), e.w = e.width, e.h = e.height, i.dataset.pswpType && (e.type = i.dataset.pswpType);
      const s = t.querySelector("img");
      s && (e.msrc = s.currentSrc || s.src, e.alt = s.getAttribute("alt")), (i.dataset.pswpCropped || i.dataset.cropped) && (e.thumbCropped = !0);
    }
    return this.applyFilters("domItemData", e, t, i);
  }
  lazyLoadData(t, e) {
    return W(t, this, e);
  }
}
class ct extends lt {
  constructor(t) {
    super(), this.options = t || {}, this._uid = 0;
  }
  init() {
    this.onThumbnailsClick = this.onThumbnailsClick.bind(this), x(this.options.gallery, this.options.gallerySelector).forEach((t) => {
      t.addEventListener("click", this.onThumbnailsClick, !1);
    });
  }
  onThumbnailsClick(t) {
    if (J(t) || window.pswp || window.navigator.onLine === !1)
      return;
    let e = { x: t.clientX, y: t.clientY };
    !e.x && !e.y && (e = null);
    let i = this.getClickedIndex(t);
    i = this.applyFilters("clickedIndex", i, t, this);
    const s = {
      gallery: t.currentTarget
    };
    i >= 0 && (t.preventDefault(), this.loadAndOpen(i, s, e));
  }
  getClickedIndex(t) {
    if (this.options.getClickedIndexFn)
      return this.options.getClickedIndexFn.call(this, t);
    const e = t.target, s = x(
      this.options.children,
      this.options.childSelector,
      t.currentTarget
    ).findIndex(
      (o) => o === e || o.contains(e)
    );
    return s !== -1 ? s : this.options.children || this.options.childSelector ? -1 : 0;
  }
  loadAndOpen(t, e, i) {
    return window.pswp ? !1 : (this.options.index = t, this.options.initialPointerPos = i, this.shouldOpen = !0, this.preload(t, e), !0);
  }
  preload(t, e) {
    const { options: i } = this;
    e && (i.dataSource = e);
    const s = [], o = typeof i.pswpModule;
    if (tt(i.pswpModule))
      s.push(Promise.resolve(i.pswpModule));
    else {
      if (o === "string")
        throw new Error("pswpModule as string is no longer supported");
      if (o === "function")
        s.push(i.pswpModule());
      else
        throw new Error("pswpModule is not valid");
    }
    typeof i.openPromise == "function" && s.push(i.openPromise()), i.preloadFirstSlide !== !1 && t >= 0 && (this._preloadedContent = ht(t, this));
    const r = ++this._uid;
    Promise.all(s).then((a) => {
      if (this.shouldOpen) {
        const l = a[0];
        this._openPhotoswipe(l, r);
      }
    });
  }
  _openPhotoswipe(t, e) {
    if (e !== this._uid && this.shouldOpen || (this.shouldOpen = !1, window.pswp))
      return;
    const i = typeof t == "object" ? new t.default(this.options) : new t(this.options);
    this.pswp = i, window.pswp = i, Object.keys(this._listeners).forEach((s) => {
      this._listeners[s].forEach((o) => {
        i.on(s, o);
      });
    }), Object.keys(this._filters).forEach((s) => {
      this._filters[s].forEach((o) => {
        i.addFilter(s, o.fn, o.priority);
      });
    }), this._preloadedContent && (i.contentLoader.addToCache(this._preloadedContent), this._preloadedContent = null), i.on("destroy", () => {
      this.pswp = null, window.pswp = null;
    }), i.init();
  }
  destroy() {
    this.pswp && this.pswp.destroy(), this.shouldOpen = !1, this._listeners = null, x(this.options.gallery, this.options.gallerySelector).forEach((t) => {
      t.removeEventListener("click", this.onThumbnailsClick, !1);
    });
  }
}
/*!
  * PhotoSwipe 5.3.2 - https://photoswipe.com
  * (c) 2022 Dmytro Semenov
  */
function m(n, t, e) {
  const i = document.createElement(t || "div");
  return n && (i.className = n), e && e.appendChild(i), i;
}
function u(n, t) {
  return n.x = t.x, n.y = t.y, t.id !== void 0 && (n.id = t.id), n;
}
function V(n) {
  n.x = Math.round(n.x), n.y = Math.round(n.y);
}
function E(n, t) {
  const e = Math.abs(n.x - t.x), i = Math.abs(n.y - t.y);
  return Math.sqrt(e * e + i * i);
}
function C(n, t) {
  return n.x === t.x && n.y === t.y;
}
function b(n, t, e) {
  return Math.min(Math.max(n, t), e);
}
function A(n, t, e) {
  let i = "translate3d(" + n + "px," + (t || 0) + "px,0)";
  return e !== void 0 && (i += " scale3d(" + e + "," + e + ",1)"), i;
}
function v(n, t, e, i) {
  n.style.transform = A(t, e, i);
}
const dt = "cubic-bezier(.4,0,.22,1)";
function U(n, t, e, i) {
  n.style.transition = t ? t + " " + e + "ms " + (i || dt) : "none";
}
function O(n, t, e) {
  n.style.width = typeof t == "number" ? t + "px" : t, n.style.height = typeof e == "number" ? e + "px" : e;
}
function pt(n) {
  U(n);
}
function ut(n) {
  return "decode" in n ? n.decode() : n.complete ? Promise.resolve(n) : new Promise((t, e) => {
    n.onload = () => t(n), n.onerror = e;
  });
}
const _ = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error"
};
function mt(n) {
  if (n.which === 2 || n.ctrlKey || n.metaKey || n.altKey || n.shiftKey)
    return !0;
}
function ft(n, t, e = document) {
  let i = [];
  if (n instanceof Element)
    i = [n];
  else if (n instanceof NodeList || Array.isArray(n))
    i = Array.from(n);
  else {
    const s = typeof n == "string" ? n : t;
    s && (i = Array.from(e.querySelectorAll(s)));
  }
  return i;
}
function M() {
  return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}
let G = !1;
try {
  window.addEventListener("test", null, Object.defineProperty({}, "passive", {
    get: () => {
      G = !0;
    }
  }));
} catch {
}
class _t {
  constructor() {
    this._pool = [];
  }
  add(t, e, i, s) {
    this._toggleListener(t, e, i, s);
  }
  remove(t, e, i, s) {
    this._toggleListener(t, e, i, s, !0);
  }
  removeAll() {
    this._pool.forEach((t) => {
      this._toggleListener(
        t.target,
        t.type,
        t.listener,
        t.passive,
        !0,
        !0
      );
    }), this._pool = [];
  }
  _toggleListener(t, e, i, s, o, r) {
    if (!t)
      return;
    const a = o ? "removeEventListener" : "addEventListener";
    e.split(" ").forEach((h) => {
      if (h) {
        r || (o ? this._pool = this._pool.filter((d) => d.type !== h || d.listener !== i || d.target !== t) : this._pool.push({
          target: t,
          type: h,
          listener: i,
          passive: s
        }));
        const c = G ? { passive: s || !1 } : !1;
        t[a](
          h,
          i,
          c
        );
      }
    });
  }
}
function q(n, t) {
  if (n.getViewportSizeFn) {
    const e = n.getViewportSizeFn(n, t);
    if (e)
      return e;
  }
  return {
    x: document.documentElement.clientWidth,
    y: window.innerHeight
  };
}
function L(n, t, e, i, s) {
  let o;
  if (t.paddingFn)
    o = t.paddingFn(e, i, s)[n];
  else if (t.padding)
    o = t.padding[n];
  else {
    const r = "padding" + n[0].toUpperCase() + n.slice(1);
    t[r] && (o = t[r]);
  }
  return o || 0;
}
function $(n, t, e, i) {
  return {
    x: t.x - L("left", n, t, e, i) - L("right", n, t, e, i),
    y: t.y - L("top", n, t, e, i) - L("bottom", n, t, e, i)
  };
}
class gt {
  constructor(t) {
    this.slide = t, this.currZoomLevel = 1, this.center = {}, this.max = {}, this.min = {}, this.reset();
  }
  update(t) {
    this.currZoomLevel = t, this.slide.width ? (this._updateAxis("x"), this._updateAxis("y"), this.slide.pswp.dispatch("calcBounds", { slide: this.slide })) : this.reset();
  }
  _updateAxis(t) {
    const { pswp: e } = this.slide, i = this.slide[t === "x" ? "width" : "height"] * this.currZoomLevel, o = L(
      t === "x" ? "left" : "top",
      e.options,
      e.viewportSize,
      this.slide.data,
      this.slide.index
    ), r = this.slide.panAreaSize[t];
    this.center[t] = Math.round((r - i) / 2) + o, this.max[t] = i > r ? Math.round(r - i) + o : this.center[t], this.min[t] = i > r ? o : this.center[t];
  }
  reset() {
    this.center.x = 0, this.center.y = 0, this.max.x = 0, this.max.y = 0, this.min.x = 0, this.min.y = 0;
  }
  correctPan(t, e) {
    return b(e, this.max[t], this.min[t]);
  }
}
const R = 4e3;
class K {
  constructor(t, e, i, s) {
    this.pswp = s, this.options = t, this.itemData = e, this.index = i;
  }
  update(t, e, i) {
    this.elementSize = {
      x: t,
      y: e
    }, this.panAreaSize = i;
    const s = this.panAreaSize.x / this.elementSize.x, o = this.panAreaSize.y / this.elementSize.y;
    this.fit = Math.min(1, s < o ? s : o), this.fill = Math.min(1, s > o ? s : o), this.vFill = Math.min(1, o), this.initial = this._getInitial(), this.secondary = this._getSecondary(), this.max = Math.max(
      this.initial,
      this.secondary,
      this._getMax()
    ), this.min = Math.min(
      this.fit,
      this.initial,
      this.secondary
    ), this.pswp && this.pswp.dispatch("zoomLevelsUpdate", { zoomLevels: this, slideData: this.itemData });
  }
  _parseZoomLevelOption(t) {
    const e = t + "ZoomLevel", i = this.options[e];
    if (!!i)
      return typeof i == "function" ? i(this) : i === "fill" ? this.fill : i === "fit" ? this.fit : Number(i);
  }
  _getSecondary() {
    let t = this._parseZoomLevelOption("secondary");
    return t || (t = Math.min(1, this.fit * 3), t * this.elementSize.x > R && (t = R / this.elementSize.x), t);
  }
  _getInitial() {
    return this._parseZoomLevelOption("initial") || this.fit;
  }
  _getMax() {
    const t = this._parseZoomLevelOption("max");
    return t || Math.max(1, this.fit * 4);
  }
}
class yt {
  constructor(t, e, i) {
    this.data = t, this.index = e, this.pswp = i, this.isActive = e === i.currIndex, this.currentResolution = 0, this.panAreaSize = {}, this.isFirstSlide = this.isActive && !i.opener.isOpen, this.zoomLevels = new K(i.options, t, e, i), this.pswp.dispatch("gettingData", {
      slide: this,
      data: this.data,
      index: e
    }), this.pan = {
      x: 0,
      y: 0
    }, this.content = this.pswp.contentLoader.getContentBySlide(this), this.container = m("pswp__zoom-wrap"), this.currZoomLevel = 1, this.width = this.content.width, this.height = this.content.height, this.bounds = new gt(this), this.prevDisplayedWidth = -1, this.prevDisplayedHeight = -1, this.pswp.dispatch("slideInit", { slide: this });
  }
  setIsActive(t) {
    t && !this.isActive ? this.activate() : !t && this.isActive && this.deactivate();
  }
  append(t) {
    this.holderElement = t, this.container.style.transformOrigin = "0 0", this.data && (this.calculateSize(), this.load(), this.updateContentSize(), this.appendHeavy(), this.holderElement.appendChild(this.container), this.zoomAndPanToInitial(), this.pswp.dispatch("firstZoomPan", { slide: this }), this.applyCurrentZoomPan(), this.pswp.dispatch("afterSetContent", { slide: this }), this.isActive && this.activate());
  }
  load() {
    this.content.load(), this.pswp.dispatch("slideLoad", { slide: this });
  }
  appendHeavy() {
    const { pswp: t } = this, e = !0;
    this.heavyAppended || !t.opener.isOpen || t.mainScroll.isShifted() || !this.isActive && !e || this.pswp.dispatch("appendHeavy", { slide: this }).defaultPrevented || (this.heavyAppended = !0, this.content.append(), this.pswp.dispatch("appendHeavyContent", { slide: this }));
  }
  activate() {
    this.isActive = !0, this.appendHeavy(), this.content.activate(), this.pswp.dispatch("slideActivate", { slide: this });
  }
  deactivate() {
    this.isActive = !1, this.content.deactivate(), this.currZoomLevel !== this.zoomLevels.initial && this.calculateSize(), this.currentResolution = 0, this.zoomAndPanToInitial(), this.applyCurrentZoomPan(), this.updateContentSize(), this.pswp.dispatch("slideDeactivate", { slide: this });
  }
  destroy() {
    this.content.hasSlide = !1, this.content.remove(), this.container.remove(), this.pswp.dispatch("slideDestroy", { slide: this });
  }
  resize() {
    this.currZoomLevel === this.zoomLevels.initial || !this.isActive ? (this.calculateSize(), this.currentResolution = 0, this.zoomAndPanToInitial(), this.applyCurrentZoomPan(), this.updateContentSize()) : (this.calculateSize(), this.bounds.update(this.currZoomLevel), this.panTo(this.pan.x, this.pan.y));
  }
  updateContentSize(t) {
    const e = this.currentResolution || this.zoomLevels.initial;
    if (!e)
      return;
    const i = Math.round(this.width * e) || this.pswp.viewportSize.x, s = Math.round(this.height * e) || this.pswp.viewportSize.y;
    !this.sizeChanged(i, s) && !t || this.content.setDisplayedSize(i, s);
  }
  sizeChanged(t, e) {
    return t !== this.prevDisplayedWidth || e !== this.prevDisplayedHeight ? (this.prevDisplayedWidth = t, this.prevDisplayedHeight = e, !0) : !1;
  }
  getPlaceholderElement() {
    if (this.content.placeholder)
      return this.content.placeholder.element;
  }
  zoomTo(t, e, i, s) {
    const { pswp: o } = this;
    if (!this.isZoomable() || o.mainScroll.isShifted())
      return;
    o.dispatch("beforeZoomTo", {
      destZoomLevel: t,
      centerPoint: e,
      transitionDuration: i
    }), o.animations.stopAllPan();
    const r = this.currZoomLevel;
    s || (t = b(t, this.zoomLevels.min, this.zoomLevels.max)), this.setZoomLevel(t), this.pan.x = this.calculateZoomToPanOffset("x", e, r), this.pan.y = this.calculateZoomToPanOffset("y", e, r), V(this.pan);
    const a = () => {
      this._setResolution(t), this.applyCurrentZoomPan();
    };
    i ? o.animations.startTransition({
      isPan: !0,
      name: "zoomTo",
      target: this.container,
      transform: this.getCurrentTransform(),
      onComplete: a,
      duration: i,
      easing: o.options.easing
    }) : a();
  }
  toggleZoom(t) {
    this.zoomTo(
      this.currZoomLevel === this.zoomLevels.initial ? this.zoomLevels.secondary : this.zoomLevels.initial,
      t,
      this.pswp.options.zoomAnimationDuration
    );
  }
  setZoomLevel(t) {
    this.currZoomLevel = t, this.bounds.update(this.currZoomLevel);
  }
  calculateZoomToPanOffset(t, e, i) {
    if (this.bounds.max[t] - this.bounds.min[t] === 0)
      return this.bounds.center[t];
    e || (e = this.pswp.getViewportCenterPoint());
    const o = this.currZoomLevel / i;
    return this.bounds.correctPan(
      t,
      (this.pan[t] - e[t]) * o + e[t]
    );
  }
  panTo(t, e) {
    this.pan.x = this.bounds.correctPan("x", t), this.pan.y = this.bounds.correctPan("y", e), this.applyCurrentZoomPan();
  }
  isPannable() {
    return this.width && this.currZoomLevel > this.zoomLevels.fit;
  }
  isZoomable() {
    return this.width && this.content.isZoomable();
  }
  applyCurrentZoomPan() {
    this._applyZoomTransform(this.pan.x, this.pan.y, this.currZoomLevel), this === this.pswp.currSlide && this.pswp.dispatch("zoomPanUpdate", { slide: this });
  }
  zoomAndPanToInitial() {
    this.currZoomLevel = this.zoomLevels.initial, this.bounds.update(this.currZoomLevel), u(this.pan, this.bounds.center), this.pswp.dispatch("initialZoomPan", { slide: this });
  }
  _applyZoomTransform(t, e, i) {
    i /= this.currentResolution || this.zoomLevels.initial, v(this.container, t, e, i);
  }
  calculateSize() {
    const { pswp: t } = this;
    u(
      this.panAreaSize,
      $(t.options, t.viewportSize, this.data, this.index)
    ), this.zoomLevels.update(this.width, this.height, this.panAreaSize), t.dispatch("calcSlideSize", {
      slide: this
    });
  }
  getCurrentTransform() {
    const t = this.currZoomLevel / (this.currentResolution || this.zoomLevels.initial);
    return A(this.pan.x, this.pan.y, t);
  }
  _setResolution(t) {
    t !== this.currentResolution && (this.currentResolution = t, this.updateContentSize(), this.pswp.dispatch("resolutionChanged"));
  }
}
const vt = 0.35, wt = 0.6, F = 0.4, N = 0.5;
function St(n, t) {
  return n * t / (1 - t);
}
class Pt {
  constructor(t) {
    this.gestures = t, this.pswp = t.pswp, this.startPan = {};
  }
  start() {
    u(this.startPan, this.pswp.currSlide.pan), this.pswp.animations.stopAll();
  }
  change() {
    const { p1: t, prevP1: e, dragAxis: i, pswp: s } = this.gestures, { currSlide: o } = s;
    if (i === "y" && s.options.closeOnVerticalDrag && o.currZoomLevel <= o.zoomLevels.fit && !this.gestures.isMultitouch) {
      const r = o.pan.y + (t.y - e.y);
      if (!s.dispatch("verticalDrag", { panY: r }).defaultPrevented) {
        this._setPanWithFriction("y", r, wt);
        const a = 1 - Math.abs(this._getVerticalDragRatio(o.pan.y));
        s.applyBgOpacity(a), o.applyCurrentZoomPan();
      }
    } else
      this._panOrMoveMainScroll("x") || (this._panOrMoveMainScroll("y"), V(o.pan), o.applyCurrentZoomPan());
  }
  end() {
    const { pswp: t, velocity: e } = this.gestures, { mainScroll: i } = t;
    let s = 0;
    if (t.animations.stopAll(), i.isShifted()) {
      const r = (i.x - i.getCurrSlideX()) / t.viewportSize.x;
      e.x < -N && r < 0 || e.x < 0.1 && r < -0.5 ? (s = 1, e.x = Math.min(e.x, 0)) : (e.x > N && r > 0 || e.x > -0.1 && r > 0.5) && (s = -1, e.x = Math.max(e.x, 0)), i.moveIndexBy(s, !0, e.x);
    }
    t.currSlide.currZoomLevel > t.currSlide.zoomLevels.max || this.gestures.isMultitouch ? this.gestures.zoomLevels.correctZoomPan(!0) : (this._finishPanGestureForAxis("x"), this._finishPanGestureForAxis("y"));
  }
  _finishPanGestureForAxis(t) {
    const { pswp: e } = this, { currSlide: i } = e, { velocity: s } = this.gestures, { pan: o, bounds: r } = i, a = o[t], l = e.bgOpacity < 1 && t === "y", h = 0.995, c = a + St(s[t], h);
    if (l) {
      const y = this._getVerticalDragRatio(a), w = this._getVerticalDragRatio(c);
      if (y < 0 && w < -F || y > 0 && w > F) {
        e.close();
        return;
      }
    }
    const d = r.correctPan(t, c);
    if (a === d)
      return;
    const p = d === c ? 1 : 0.82, g = e.bgOpacity, S = d - a;
    e.animations.startSpring({
      name: "panGesture" + t,
      isPan: !0,
      start: a,
      end: d,
      velocity: s[t],
      dampingRatio: p,
      onUpdate: (y) => {
        if (l && e.bgOpacity < 1) {
          const w = 1 - (d - y) / S;
          e.applyBgOpacity(b(
            g + (1 - g) * w,
            0,
            1
          ));
        }
        o[t] = Math.floor(y), i.applyCurrentZoomPan();
      }
    });
  }
  _panOrMoveMainScroll(t) {
    const { p1: e, pswp: i, dragAxis: s, prevP1: o, isMultitouch: r } = this.gestures, { currSlide: a, mainScroll: l } = i, h = e[t] - o[t], c = l.x + h;
    if (!h)
      return;
    if (t === "x" && !a.isPannable() && !r)
      return l.moveTo(c, !0), !0;
    const { bounds: d } = a, p = a.pan[t] + h;
    if (i.options.allowPanToNext && s === "x" && t === "x" && !r) {
      const g = l.getCurrSlideX(), S = l.x - g, y = h > 0, w = !y;
      if (p > d.min[t] && y) {
        if (d.min[t] <= this.startPan[t])
          return l.moveTo(c, !0), !0;
        this._setPanWithFriction(t, p);
      } else if (p < d.max[t] && w) {
        if (this.startPan[t] <= d.max[t])
          return l.moveTo(c, !0), !0;
        this._setPanWithFriction(t, p);
      } else if (S !== 0) {
        if (S > 0)
          return l.moveTo(Math.max(c, g), !0), !0;
        if (S < 0)
          return l.moveTo(Math.min(c, g), !0), !0;
      } else
        this._setPanWithFriction(t, p);
    } else
      t === "y" ? !l.isShifted() && d.min.y !== d.max.y && this._setPanWithFriction(t, p) : this._setPanWithFriction(t, p);
  }
  _getVerticalDragRatio(t) {
    return (t - this.pswp.currSlide.bounds.center.y) / (this.pswp.viewportSize.y / 3);
  }
  _setPanWithFriction(t, e, i) {
    const { pan: s, bounds: o } = this.pswp.currSlide;
    if (o.correctPan(t, e) !== e || i) {
      const a = Math.round(e - s[t]);
      s[t] += a * (i || vt);
    } else
      s[t] = e;
  }
}
const It = 0.05, Lt = 0.15;
function B(n, t, e) {
  return n.x = (t.x + e.x) / 2, n.y = (t.y + e.y) / 2, n;
}
class Ct {
  constructor(t) {
    this.gestures = t, this.pswp = this.gestures.pswp, this._startPan = {}, this._startZoomPoint = {}, this._zoomPoint = {};
  }
  start() {
    this._startZoomLevel = this.pswp.currSlide.currZoomLevel, u(this._startPan, this.pswp.currSlide.pan), this.pswp.animations.stopAllPan(), this._wasOverFitZoomLevel = !1;
  }
  change() {
    const { p1: t, startP1: e, p2: i, startP2: s, pswp: o } = this.gestures, { currSlide: r } = o, a = r.zoomLevels.min, l = r.zoomLevels.max;
    if (!r.isZoomable() || o.mainScroll.isShifted())
      return;
    B(this._startZoomPoint, e, s), B(this._zoomPoint, t, i);
    let h = 1 / E(e, s) * E(t, i) * this._startZoomLevel;
    if (h > r.zoomLevels.initial + r.zoomLevels.initial / 15 && (this._wasOverFitZoomLevel = !0), h < a)
      if (o.options.pinchToClose && !this._wasOverFitZoomLevel && this._startZoomLevel <= r.zoomLevels.initial) {
        const c = 1 - (a - h) / (a / 1.2);
        o.dispatch("pinchClose", { bgOpacity: c }).defaultPrevented || o.applyBgOpacity(c);
      } else
        h = a - (a - h) * Lt;
    else
      h > l && (h = l + (h - l) * It);
    r.pan.x = this._calculatePanForZoomLevel("x", h), r.pan.y = this._calculatePanForZoomLevel("y", h), r.setZoomLevel(h), r.applyCurrentZoomPan();
  }
  end() {
    const { pswp: t } = this, { currSlide: e } = t;
    e.currZoomLevel < e.zoomLevels.initial && !this._wasOverFitZoomLevel && t.options.pinchToClose ? t.close() : this.correctZoomPan();
  }
  _calculatePanForZoomLevel(t, e) {
    const i = e / this._startZoomLevel;
    return this._zoomPoint[t] - (this._startZoomPoint[t] - this._startPan[t]) * i;
  }
  correctZoomPan(t) {
    const { pswp: e } = this, { currSlide: i } = e;
    if (!i.isZoomable())
      return;
    this._zoomPoint.x === void 0 && (t = !0);
    const s = i.currZoomLevel;
    let o, r = !0;
    s < i.zoomLevels.initial ? o = i.zoomLevels.initial : s > i.zoomLevels.max ? o = i.zoomLevels.max : (r = !1, o = s);
    const a = e.bgOpacity, l = e.bgOpacity < 1, h = u({}, i.pan);
    let c = u({}, h);
    t && (this._zoomPoint.x = 0, this._zoomPoint.y = 0, this._startZoomPoint.x = 0, this._startZoomPoint.y = 0, this._startZoomLevel = s, u(this._startPan, h)), r && (c = {
      x: this._calculatePanForZoomLevel("x", o),
      y: this._calculatePanForZoomLevel("y", o)
    }), i.setZoomLevel(o), c = {
      x: i.bounds.correctPan("x", c.x),
      y: i.bounds.correctPan("y", c.y)
    }, i.setZoomLevel(s);
    let d = !0;
    if (C(c, h) && (d = !1), !d && !r && !l) {
      i._setResolution(o), i.applyCurrentZoomPan();
      return;
    }
    e.animations.stopAllPan(), e.animations.startSpring({
      isPan: !0,
      start: 0,
      end: 1e3,
      velocity: 0,
      dampingRatio: 1,
      naturalFrequency: 40,
      onUpdate: (p) => {
        if (p /= 1e3, d || r) {
          if (d && (i.pan.x = h.x + (c.x - h.x) * p, i.pan.y = h.y + (c.y - h.y) * p), r) {
            const g = s + (o - s) * p;
            i.setZoomLevel(g);
          }
          i.applyCurrentZoomPan();
        }
        l && e.bgOpacity < 1 && e.applyBgOpacity(b(
          a + (1 - a) * p,
          0,
          1
        ));
      },
      onComplete: () => {
        i._setResolution(o), i.applyCurrentZoomPan();
      }
    });
  }
}
function k(n) {
  return !!n.target.closest(".pswp__container");
}
class At {
  constructor(t) {
    this.gestures = t;
  }
  click(t, e) {
    const i = e.target.classList, s = i.contains("pswp__img"), o = i.contains("pswp__item") || i.contains("pswp__zoom-wrap");
    s ? this._doClickOrTapAction("imageClick", t, e) : o && this._doClickOrTapAction("bgClick", t, e);
  }
  tap(t, e) {
    k(e) && this._doClickOrTapAction("tap", t, e);
  }
  doubleTap(t, e) {
    k(e) && this._doClickOrTapAction("doubleTap", t, e);
  }
  _doClickOrTapAction(t, e, i) {
    const { pswp: s } = this.gestures, { currSlide: o } = s, r = t + "Action", a = s.options[r];
    if (!s.dispatch(r, { point: e, originalEvent: i }).defaultPrevented) {
      if (typeof a == "function") {
        a.call(s, e, i);
        return;
      }
      switch (a) {
        case "close":
        case "next":
          s[a]();
          break;
        case "zoom":
          o.toggleZoom(e);
          break;
        case "zoom-or-close":
          o.isZoomable() && o.zoomLevels.secondary !== o.zoomLevels.initial ? o.toggleZoom(e) : s.options.clickToCloseNonZoomable && s.close();
          break;
        case "toggle-controls":
          this.gestures.pswp.element.classList.toggle("pswp--ui-visible");
          break;
      }
    }
  }
}
const bt = 10, zt = 300, xt = 25;
class Tt {
  constructor(t) {
    this.pswp = t, this.dragAxis = void 0, this.p1 = {}, this.p2 = {}, this.prevP1 = {}, this.prevP2 = {}, this.startP1 = {}, this.startP2 = {}, this.velocity = {}, this._lastStartP1 = {}, this._intervalP1 = {}, this._numActivePoints = 0, this._ongoingPointers = [], this._touchEventEnabled = "ontouchstart" in window, this._pointerEventEnabled = !!window.PointerEvent, this.supportsTouch = this._touchEventEnabled || this._pointerEventEnabled && navigator.maxTouchPoints > 1, this.supportsTouch || (t.options.allowPanToNext = !1), this.drag = new Pt(this), this.zoomLevels = new Ct(this), this.tapHandler = new At(this), t.on("bindEvents", () => {
      t.events.add(t.scrollWrap, "click", (e) => this._onClick(e)), this._pointerEventEnabled ? this._bindEvents("pointer", "down", "up", "cancel") : this._touchEventEnabled ? (this._bindEvents("touch", "start", "end", "cancel"), t.scrollWrap.ontouchmove = () => {
      }, t.scrollWrap.ontouchend = () => {
      }) : this._bindEvents("mouse", "down", "up");
    });
  }
  _bindEvents(t, e, i, s) {
    const { pswp: o } = this, { events: r } = o, a = s ? t + s : "";
    r.add(o.scrollWrap, t + e, this.onPointerDown.bind(this)), r.add(window, t + "move", this.onPointerMove.bind(this)), r.add(window, t + i, this.onPointerUp.bind(this)), a && r.add(o.scrollWrap, a, this.onPointerUp.bind(this));
  }
  onPointerDown(t) {
    let e;
    if ((t.type === "mousedown" || t.pointerType === "mouse") && (e = !0), e && t.button > 0)
      return;
    const { pswp: i } = this;
    if (!i.opener.isOpen) {
      t.preventDefault();
      return;
    }
    i.dispatch("pointerDown", { originalEvent: t }).defaultPrevented || (e && (i.mouseDetected(), this._preventPointerEventBehaviour(t)), i.animations.stopAll(), this._updatePoints(t, "down"), this.pointerDown = !0, this._numActivePoints === 1 && (this.dragAxis = null, u(this.startP1, this.p1)), this._numActivePoints > 1 ? (this._clearTapTimer(), this.isMultitouch = !0) : this.isMultitouch = !1);
  }
  onPointerMove(t) {
    t.preventDefault(), this._numActivePoints && (this._updatePoints(t, "move"), !this.pswp.dispatch("pointerMove", { originalEvent: t }).defaultPrevented && (this._numActivePoints === 1 && !this.isDragging ? (this.dragAxis || this._calculateDragDirection(), this.dragAxis && !this.isDragging && (this.isZooming && (this.isZooming = !1, this.zoomLevels.end()), this.isDragging = !0, this._clearTapTimer(), this._updateStartPoints(), this._intervalTime = Date.now(), this._velocityCalculated = !1, u(this._intervalP1, this.p1), this.velocity.x = 0, this.velocity.y = 0, this.drag.start(), this._rafStopLoop(), this._rafRenderLoop())) : this._numActivePoints > 1 && !this.isZooming && (this._finishDrag(), this.isZooming = !0, this._updateStartPoints(), this.zoomLevels.start(), this._rafStopLoop(), this._rafRenderLoop())));
  }
  _finishDrag() {
    this.isDragging && (this.isDragging = !1, this._velocityCalculated || this._updateVelocity(!0), this.drag.end(), this.dragAxis = null);
  }
  onPointerUp(t) {
    !this._numActivePoints || (this._updatePoints(t, "up"), !this.pswp.dispatch("pointerUp", { originalEvent: t }).defaultPrevented && (this._numActivePoints === 0 && (this.pointerDown = !1, this._rafStopLoop(), this.isDragging ? this._finishDrag() : !this.isZooming && !this.isMultitouch && this._finishTap(t)), this._numActivePoints < 2 && this.isZooming && (this.isZooming = !1, this.zoomLevels.end(), this._numActivePoints === 1 && (this.dragAxis = null, this._updateStartPoints()))));
  }
  _rafRenderLoop() {
    (this.isDragging || this.isZooming) && (this._updateVelocity(), this.isDragging ? C(this.p1, this.prevP1) || this.drag.change() : (!C(this.p1, this.prevP1) || !C(this.p2, this.prevP2)) && this.zoomLevels.change(), this._updatePrevPoints(), this.raf = requestAnimationFrame(this._rafRenderLoop.bind(this)));
  }
  _updateVelocity(t) {
    const e = Date.now(), i = e - this._intervalTime;
    i < 50 && !t || (this.velocity.x = this._getVelocity("x", i), this.velocity.y = this._getVelocity("y", i), this._intervalTime = e, u(this._intervalP1, this.p1), this._velocityCalculated = !0);
  }
  _finishTap(t) {
    const { mainScroll: e } = this.pswp;
    if (e.isShifted()) {
      e.moveIndexBy(0, !0);
      return;
    }
    if (t.type.indexOf("cancel") > 0)
      return;
    if (t.type === "mouseup" || t.pointerType === "mouse") {
      this.tapHandler.click(this.startP1, t);
      return;
    }
    const i = this.pswp.options.doubleTapAction ? zt : 0;
    this._tapTimer ? (this._clearTapTimer(), E(this._lastStartP1, this.startP1) < xt && this.tapHandler.doubleTap(this.startP1, t)) : (u(this._lastStartP1, this.startP1), this._tapTimer = setTimeout(() => {
      this.tapHandler.tap(this.startP1, t), this._clearTapTimer();
    }, i));
  }
  _clearTapTimer() {
    this._tapTimer && (clearTimeout(this._tapTimer), this._tapTimer = null);
  }
  _getVelocity(t, e) {
    const i = this.p1[t] - this._intervalP1[t];
    return Math.abs(i) > 1 && e > 5 ? i / e : 0;
  }
  _rafStopLoop() {
    this.raf && (cancelAnimationFrame(this.raf), this.raf = null);
  }
  _preventPointerEventBehaviour(t) {
    return t.preventDefault(), !0;
  }
  _updatePoints(t, e) {
    if (this._pointerEventEnabled) {
      const i = t, s = this._ongoingPointers.findIndex((o) => o.id === i.pointerId);
      e === "up" && s > -1 ? this._ongoingPointers.splice(s, 1) : e === "down" && s === -1 ? this._ongoingPointers.push(this._convertEventPosToPoint(i, {})) : s > -1 && this._convertEventPosToPoint(i, this._ongoingPointers[s]), this._numActivePoints = this._ongoingPointers.length, this._numActivePoints > 0 && u(this.p1, this._ongoingPointers[0]), this._numActivePoints > 1 && u(this.p2, this._ongoingPointers[1]);
    } else {
      const i = t;
      this._numActivePoints = 0, i.type.indexOf("touch") > -1 ? i.touches && i.touches.length > 0 && (this._convertEventPosToPoint(i.touches[0], this.p1), this._numActivePoints++, i.touches.length > 1 && (this._convertEventPosToPoint(i.touches[1], this.p2), this._numActivePoints++)) : (this._convertEventPosToPoint(t, this.p1), e === "up" ? this._numActivePoints = 0 : this._numActivePoints++);
    }
  }
  _updatePrevPoints() {
    u(this.prevP1, this.p1), u(this.prevP2, this.p2);
  }
  _updateStartPoints() {
    u(this.startP1, this.p1), u(this.startP2, this.p2), this._updatePrevPoints();
  }
  _calculateDragDirection() {
    if (this.pswp.mainScroll.isShifted())
      this.dragAxis = "x";
    else {
      const t = Math.abs(this.p1.x - this.startP1.x) - Math.abs(this.p1.y - this.startP1.y);
      if (t !== 0) {
        const e = t > 0 ? "x" : "y";
        Math.abs(this.p1[e] - this.startP1[e]) >= bt && (this.dragAxis = e);
      }
    }
  }
  _convertEventPosToPoint(t, e) {
    return e.x = t.pageX - this.pswp.offset.x, e.y = t.pageY - this.pswp.offset.y, "pointerId" in t ? e.id = t.pointerId : t.identifier !== void 0 && (e.id = t.identifier), e;
  }
  _onClick(t) {
    this.pswp.mainScroll.isShifted() && (t.preventDefault(), t.stopPropagation());
  }
}
const Et = 0.35;
class Ot {
  constructor(t) {
    this.pswp = t, this.x = 0, this.slideWidth = void 0, this.itemHolders = void 0, this.resetPosition();
  }
  resize(t) {
    const { pswp: e } = this, i = Math.round(
      e.viewportSize.x + e.viewportSize.x * e.options.spacing
    ), s = i !== this.slideWidth;
    s && (this.slideWidth = i, this.moveTo(this.getCurrSlideX())), this.itemHolders.forEach((o, r) => {
      s && v(o.el, (r + this._containerShiftIndex) * this.slideWidth), t && o.slide && o.slide.resize();
    });
  }
  resetPosition() {
    this._currPositionIndex = 0, this._prevPositionIndex = 0, this.slideWidth = 0, this._containerShiftIndex = -1;
  }
  appendHolders() {
    this.itemHolders = [];
    for (let t = 0; t < 3; t++) {
      const e = m("pswp__item", !1, this.pswp.container);
      e.style.display = t === 1 ? "block" : "none", this.itemHolders.push({
        el: e
      });
    }
  }
  canBeSwiped() {
    return this.pswp.getNumItems() > 1;
  }
  moveIndexBy(t, e, i) {
    const { pswp: s } = this;
    let o = s.potentialIndex + t;
    const r = s.getNumItems();
    if (s.canLoop()) {
      o = s.getLoopedIndex(o);
      const l = (t + r) % r;
      l <= r / 2 ? t = l : t = l - r;
    } else
      o < 0 ? o = 0 : o >= r && (o = r - 1), t = o - s.potentialIndex;
    s.potentialIndex = o, this._currPositionIndex -= t, s.animations.stopMainScroll();
    const a = this.getCurrSlideX();
    if (!e)
      this.moveTo(a), this.updateCurrItem();
    else {
      s.animations.startSpring({
        isMainScroll: !0,
        start: this.x,
        end: a,
        velocity: i || 0,
        naturalFrequency: 30,
        dampingRatio: 1,
        onUpdate: (h) => {
          this.moveTo(h);
        },
        onComplete: () => {
          this.updateCurrItem(), s.appendHeavy();
        }
      });
      let l = s.potentialIndex - s.currIndex;
      if (s.canLoop()) {
        const h = (l + r) % r;
        h <= r / 2 ? l = h : l = h - r;
      }
      Math.abs(l) > 1 && this.updateCurrItem();
    }
    if (t)
      return !0;
  }
  getCurrSlideX() {
    return this.slideWidth * this._currPositionIndex;
  }
  isShifted() {
    return this.x !== this.getCurrSlideX();
  }
  updateCurrItem() {
    const { pswp: t } = this, e = this._prevPositionIndex - this._currPositionIndex;
    if (!e)
      return;
    this._prevPositionIndex = this._currPositionIndex, t.currIndex = t.potentialIndex;
    let i = Math.abs(e), s;
    i >= 3 && (this._containerShiftIndex += e + (e > 0 ? -3 : 3), i = 3);
    for (let o = 0; o < i; o++)
      e > 0 ? (s = this.itemHolders.shift(), this.itemHolders[2] = s, this._containerShiftIndex++, v(s.el, (this._containerShiftIndex + 2) * this.slideWidth), t.setContent(s, t.currIndex - i + o + 2)) : (s = this.itemHolders.pop(), this.itemHolders.unshift(s), this._containerShiftIndex--, v(s.el, this._containerShiftIndex * this.slideWidth), t.setContent(s, t.currIndex + i - o - 2));
    Math.abs(this._containerShiftIndex) > 50 && !this.isShifted() && (this.resetPosition(), this.resize()), t.animations.stopAllPan(), this.itemHolders.forEach((o, r) => {
      o.slide && o.slide.setIsActive(r === 1);
    }), t.currSlide = this.itemHolders[1].slide, t.contentLoader.updateLazy(e), t.currSlide.applyCurrentZoomPan(), t.dispatch("change");
  }
  moveTo(t, e) {
    let i, s;
    !this.pswp.canLoop() && e && (i = (this.slideWidth * this._currPositionIndex - t) / this.slideWidth, i += this.pswp.currIndex, s = Math.round(t - this.x), (i < 0 && s > 0 || i >= this.pswp.getNumItems() - 1 && s < 0) && (t = this.x + s * Et)), this.x = t, v(this.pswp.container, t), this.pswp.dispatch("moveMainScroll", { x: t, dragging: e });
  }
}
class Dt {
  constructor(t) {
    this.pswp = t, t.on("bindEvents", () => {
      t.options.initialPointerPos || this._focusRoot(), t.events.add(document, "focusin", this._onFocusIn.bind(this)), t.events.add(document, "keydown", this._onKeyDown.bind(this));
    });
    const e = document.activeElement;
    t.on("destroy", () => {
      t.options.returnFocus && e && this._wasFocused && e.focus();
    });
  }
  _focusRoot() {
    this._wasFocused || (this.pswp.element.focus(), this._wasFocused = !0);
  }
  _onKeyDown(t) {
    const { pswp: e } = this;
    if (e.dispatch("keydown", { originalEvent: t }).defaultPrevented || mt(t))
      return;
    let i, s, o;
    switch (t.keyCode) {
      case 27:
        e.options.escKey && (i = "close");
        break;
      case 90:
        i = "toggleZoom";
        break;
      case 37:
        s = "x";
        break;
      case 38:
        s = "y";
        break;
      case 39:
        s = "x", o = !0;
        break;
      case 40:
        o = !0, s = "y";
        break;
      case 9:
        this._focusRoot();
        break;
    }
    if (s) {
      t.preventDefault();
      const { currSlide: r } = e;
      e.options.arrowKeys && s === "x" && e.getNumItems() > 1 ? i = o ? "next" : "prev" : r && r.currZoomLevel > r.zoomLevels.fit && (r.pan[s] += o ? -80 : 80, r.panTo(r.pan.x, r.pan.y));
    }
    i && (t.preventDefault(), e[i]());
  }
  _onFocusIn(t) {
    const { template: e } = this.pswp;
    document !== t.target && e !== t.target && !e.contains(t.target) && e.focus();
  }
}
const Zt = "cubic-bezier(.4,0,.22,1)";
class Mt {
  constructor(t) {
    this.props = t;
    const {
      target: e,
      onComplete: i,
      transform: s,
      onFinish: o
    } = t;
    let {
      duration: r,
      easing: a
    } = t;
    this.onFinish = o;
    const l = s ? "transform" : "opacity", h = t[l];
    this._target = e, this._onComplete = i, r = r || 333, a = a || Zt, this._onTransitionEnd = this._onTransitionEnd.bind(this), this._helperTimeout = setTimeout(() => {
      U(e, l, r, a), this._helperTimeout = setTimeout(() => {
        e.addEventListener("transitionend", this._onTransitionEnd, !1), e.addEventListener("transitioncancel", this._onTransitionEnd, !1), this._helperTimeout = setTimeout(() => {
          this._finalizeAnimation();
        }, r + 500), e.style[l] = h;
      }, 30);
    }, 0);
  }
  _onTransitionEnd(t) {
    t.target === this._target && this._finalizeAnimation();
  }
  _finalizeAnimation() {
    this._finished || (this._finished = !0, this.onFinish(), this._onComplete && this._onComplete());
  }
  destroy() {
    this._helperTimeout && clearTimeout(this._helperTimeout), pt(this._target), this._target.removeEventListener("transitionend", this._onTransitionEnd, !1), this._target.removeEventListener("transitioncancel", this._onTransitionEnd, !1), this._finished || this._finalizeAnimation();
  }
}
const Rt = 12, Ft = 0.75;
class Nt {
  constructor(t, e, i) {
    this.velocity = t * 1e3, this._dampingRatio = e || Ft, this._naturalFrequency = i || Rt, this._dampingRatio < 1 && (this._dampedFrequency = this._naturalFrequency * Math.sqrt(1 - this._dampingRatio * this._dampingRatio));
  }
  easeFrame(t, e) {
    let i = 0, s;
    e /= 1e3;
    const o = Math.E ** (-this._dampingRatio * this._naturalFrequency * e);
    if (this._dampingRatio === 1)
      s = this.velocity + this._naturalFrequency * t, i = (t + s * e) * o, this.velocity = i * -this._naturalFrequency + s * o;
    else if (this._dampingRatio < 1) {
      s = 1 / this._dampedFrequency * (this._dampingRatio * this._naturalFrequency * t + this.velocity);
      const r = Math.cos(this._dampedFrequency * e), a = Math.sin(this._dampedFrequency * e);
      i = o * (t * r + s * a), this.velocity = i * -this._naturalFrequency * this._dampingRatio + o * (-this._dampedFrequency * t * a + this._dampedFrequency * s * r);
    }
    return i;
  }
}
class Bt {
  constructor(t) {
    this.props = t;
    const {
      start: e,
      end: i,
      velocity: s,
      onUpdate: o,
      onComplete: r,
      onFinish: a,
      dampingRatio: l,
      naturalFrequency: h
    } = t;
    this.onFinish = a;
    const c = new Nt(s, l, h);
    let d = Date.now(), p = e - i;
    const g = () => {
      this._raf && (p = c.easeFrame(p, Date.now() - d), Math.abs(p) < 1 && Math.abs(c.velocity) < 50 ? (o(i), r && r(), this.onFinish()) : (d = Date.now(), o(p + i), this._raf = requestAnimationFrame(g)));
    };
    this._raf = requestAnimationFrame(g);
  }
  destroy() {
    this._raf >= 0 && cancelAnimationFrame(this._raf), this._raf = null;
  }
}
class kt {
  constructor() {
    this.activeAnimations = [];
  }
  startSpring(t) {
    this._start(t, !0);
  }
  startTransition(t) {
    this._start(t);
  }
  _start(t, e) {
    let i;
    return e ? i = new Bt(t) : i = new Mt(t), this.activeAnimations.push(i), i.onFinish = () => this.stop(i), i;
  }
  stop(t) {
    t.destroy();
    const e = this.activeAnimations.indexOf(t);
    e > -1 && this.activeAnimations.splice(e, 1);
  }
  stopAll() {
    this.activeAnimations.forEach((t) => {
      t.destroy();
    }), this.activeAnimations = [];
  }
  stopAllPan() {
    this.activeAnimations = this.activeAnimations.filter((t) => t.props.isPan ? (t.destroy(), !1) : !0);
  }
  stopMainScroll() {
    this.activeAnimations = this.activeAnimations.filter((t) => t.props.isMainScroll ? (t.destroy(), !1) : !0);
  }
  isPanRunning() {
    return this.activeAnimations.some((t) => t.props.isPan);
  }
}
class Ht {
  constructor(t) {
    this.pswp = t, t.events.add(t.element, "wheel", this._onWheel.bind(this));
  }
  _onWheel(t) {
    t.preventDefault();
    const { currSlide: e } = this.pswp;
    let { deltaX: i, deltaY: s } = t;
    if (!!e && !this.pswp.dispatch("wheel", { originalEvent: t }).defaultPrevented)
      if (t.ctrlKey || this.pswp.options.wheelToZoom) {
        if (e.isZoomable()) {
          let o = -s;
          t.deltaMode === 1 ? o *= 0.05 : o *= t.deltaMode ? 1 : 2e-3, o = 2 ** o;
          const r = e.currZoomLevel * o;
          e.zoomTo(r, {
            x: t.clientX,
            y: t.clientY
          });
        }
      } else
        e.isPannable() && (t.deltaMode === 1 && (i *= 18, s *= 18), e.panTo(
          e.pan.x - i,
          e.pan.y - s
        ));
  }
}
function Wt(n) {
  if (typeof n == "string")
    return n;
  if (!n || !n.isCustomSVG)
    return "";
  const t = n;
  let e = '<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 %d %d" width="%d" height="%d">';
  return e = e.split("%d").join(t.size || 32), t.outlineID && (e += '<use class="pswp__icn-shadow" xlink:href="#' + t.outlineID + '"/>'), e += t.inner, e += "</svg>", e;
}
class Vt {
  constructor(t, e) {
    const i = e.name || e.className;
    let s = e.html;
    if (t.options[i] === !1)
      return;
    typeof t.options[i + "SVG"] == "string" && (s = t.options[i + "SVG"]), t.dispatch("uiElementCreate", { data: e });
    let o = "";
    e.isButton ? (o += "pswp__button ", o += e.className || `pswp__button--${e.name}`) : o += e.className || `pswp__${e.name}`;
    let r, a = e.isButton ? e.tagName || "button" : e.tagName || "div";
    if (a = a.toLowerCase(), r = m(o, a), e.isButton) {
      r = m(o, a), a === "button" && (r.type = "button");
      let { title: c } = e;
      const { ariaLabel: d } = e;
      typeof t.options[i + "Title"] == "string" && (c = t.options[i + "Title"]), c && (r.title = c), (d || c) && r.setAttribute("aria-label", d || c);
    }
    r.innerHTML = Wt(s), e.onInit && e.onInit(r, t), e.onClick && (r.onclick = (c) => {
      typeof e.onClick == "string" ? t[e.onClick]() : e.onClick(c, r, t);
    });
    const l = e.appendTo || "bar";
    let h;
    l === "bar" ? (t.topBar || (t.topBar = m("pswp__top-bar pswp__hide-on-close", "div", t.scrollWrap)), h = t.topBar) : (r.classList.add("pswp__hide-on-close"), l === "wrapper" ? h = t.scrollWrap : h = t.element), h.appendChild(t.applyFilters("uiElement", r, e));
  }
}
function X(n, t, e) {
  n.classList.add("pswp__button--arrow"), t.on("change", () => {
    t.options.loop || (e ? n.disabled = !(t.currIndex < t.getNumItems() - 1) : n.disabled = !(t.currIndex > 0));
  });
}
const Ut = {
  name: "arrowPrev",
  className: "pswp__button--arrow--prev",
  title: "Previous",
  order: 10,
  isButton: !0,
  appendTo: "wrapper",
  html: {
    isCustomSVG: !0,
    size: 60,
    inner: '<path d="M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z" id="pswp__icn-arrow"/>',
    outlineID: "pswp__icn-arrow"
  },
  onClick: "prev",
  onInit: X
}, Gt = {
  name: "arrowNext",
  className: "pswp__button--arrow--next",
  title: "Next",
  order: 11,
  isButton: !0,
  appendTo: "wrapper",
  html: {
    isCustomSVG: !0,
    size: 60,
    inner: '<use xlink:href="#pswp__icn-arrow"/>',
    outlineID: "pswp__icn-arrow"
  },
  onClick: "next",
  onInit: (n, t) => {
    X(n, t, !0);
  }
}, qt = {
  name: "close",
  title: "Close",
  order: 20,
  isButton: !0,
  html: {
    isCustomSVG: !0,
    inner: '<path d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z" id="pswp__icn-close"/>',
    outlineID: "pswp__icn-close"
  },
  onClick: "close"
}, $t = {
  name: "zoom",
  title: "Zoom",
  order: 10,
  isButton: !0,
  html: {
    isCustomSVG: !0,
    inner: '<path d="M17.426 19.926a6 6 0 1 1 1.5-1.5L23 22.5 21.5 24l-4.074-4.074z" id="pswp__icn-zoom"/><path fill="currentColor" class="pswp__zoom-icn-bar-h" d="M11 16v-2h6v2z"/><path fill="currentColor" class="pswp__zoom-icn-bar-v" d="M13 12h2v6h-2z"/>',
    outlineID: "pswp__icn-zoom"
  },
  onClick: "toggleZoom"
}, Kt = {
  name: "preloader",
  appendTo: "bar",
  order: 7,
  html: {
    isCustomSVG: !0,
    inner: '<path fill-rule="evenodd" clip-rule="evenodd" d="M21.2 16a5.2 5.2 0 1 1-5.2-5.2V8a8 8 0 1 0 8 8h-2.8Z" id="pswp__icn-loading"/>',
    outlineID: "pswp__icn-loading"
  },
  onInit: (n, t) => {
    let e, i;
    const s = (a, l) => {
      n.classList[l ? "add" : "remove"]("pswp__preloader--" + a);
    }, o = (a) => {
      e !== a && (e = a, s("active", a));
    }, r = () => {
      if (!t.currSlide.content.isLoading()) {
        o(!1), i && (clearTimeout(i), i = null);
        return;
      }
      i || (i = setTimeout(() => {
        o(t.currSlide.content.isLoading()), i = null;
      }, t.options.preloaderDelay));
    };
    t.on("change", r), t.on("loadComplete", (a) => {
      t.currSlide === a.slide && r();
    }), t.ui.updatePreloaderVisibility = r;
  }
}, Xt = {
  name: "counter",
  order: 5,
  onInit: (n, t) => {
    t.on("change", () => {
      n.innerText = t.currIndex + 1 + t.options.indexIndicatorSep + t.getNumItems();
    });
  }
};
function H(n, t) {
  n.classList[t ? "add" : "remove"]("pswp--zoomed-in");
}
class Yt {
  constructor(t) {
    this.pswp = t, this.updatePreloaderVisibility = void 0, this._lastUpdatedZoomLevel = void 0;
  }
  init() {
    const { pswp: t } = this;
    this.isRegistered = !1, this.uiElementsData = [
      qt,
      Ut,
      Gt,
      $t,
      Kt,
      Xt
    ], t.dispatch("uiRegister"), this.uiElementsData.sort((e, i) => (e.order || 0) - (i.order || 0)), this.items = [], this.isRegistered = !0, this.uiElementsData.forEach((e) => {
      this.registerElement(e);
    }), t.on("change", () => {
      t.element.classList[t.getNumItems() === 1 ? "add" : "remove"]("pswp--one-slide");
    }), t.on("zoomPanUpdate", () => this._onZoomPanUpdate());
  }
  registerElement(t) {
    this.isRegistered ? this.items.push(
      new Vt(this.pswp, t)
    ) : this.uiElementsData.push(t);
  }
  _onZoomPanUpdate() {
    const { template: t, currSlide: e, options: i } = this.pswp;
    let { currZoomLevel: s } = e;
    if (this.pswp.opener.isClosing || (this.pswp.opener.isOpen || (s = e.zoomLevels.initial), s === this._lastUpdatedZoomLevel))
      return;
    this._lastUpdatedZoomLevel = s;
    const o = e.zoomLevels.initial - e.zoomLevels.secondary;
    if (Math.abs(o) < 0.01 || !e.isZoomable()) {
      H(t, !1), t.classList.remove("pswp--zoom-allowed");
      return;
    }
    t.classList.add("pswp--zoom-allowed");
    const r = s === e.zoomLevels.initial ? e.zoomLevels.secondary : e.zoomLevels.initial;
    H(t, r <= s), (i.imageClickAction === "zoom" || i.imageClickAction === "zoom-or-close") && t.classList.add("pswp--click-to-zoom");
  }
}
function jt(n) {
  const t = n.getBoundingClientRect();
  return {
    x: t.left,
    y: t.top,
    w: t.width
  };
}
function Qt(n, t, e) {
  const i = n.getBoundingClientRect(), s = i.width / t, o = i.height / e, r = s > o ? s : o, a = (i.width - t * r) / 2, l = (i.height - e * r) / 2, h = {
    x: i.left + a,
    y: i.top + l,
    w: t * r
  };
  return h.innerRect = {
    w: i.width,
    h: i.height,
    x: a,
    y: l
  }, h;
}
function Jt(n, t, e) {
  const i = e.dispatch("thumbBounds", {
    index: n,
    itemData: t,
    instance: e
  });
  if (i.thumbBounds)
    return i.thumbBounds;
  const { element: s } = t;
  let o, r;
  if (s && e.options.thumbSelector !== !1) {
    const a = e.options.thumbSelector || "img";
    r = s.matches(a) ? s : s.querySelector(a);
  }
  return r = e.applyFilters("thumbEl", r, t, n), r && (t.thumbCropped ? o = Qt(
    r,
    t.width || t.w,
    t.height || t.h
  ) : o = jt(r)), e.applyFilters("thumbBounds", o, t, n);
}
class te {
  constructor(t, e) {
    this.type = t, e && Object.assign(this, e);
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
}
class ee {
  constructor() {
    this._listeners = {}, this._filters = {}, this.pswp = void 0, this.options = void 0;
  }
  addFilter(t, e, i = 100) {
    this._filters[t] || (this._filters[t] = []), this._filters[t].push({ fn: e, priority: i }), this._filters[t].sort((s, o) => s.priority - o.priority), this.pswp && this.pswp.addFilter(t, e, i);
  }
  removeFilter(t, e) {
    this._filters[t] && (this._filters[t] = this._filters[t].filter((i) => i.fn !== e)), this.pswp && this.pswp.removeFilter(t, e);
  }
  applyFilters(t, ...e) {
    return this._filters[t] && this._filters[t].forEach((i) => {
      e[0] = i.fn.apply(this, e);
    }), e[0];
  }
  on(t, e) {
    this._listeners[t] || (this._listeners[t] = []), this._listeners[t].push(e), this.pswp && this.pswp.on(t, e);
  }
  off(t, e) {
    this._listeners[t] && (this._listeners[t] = this._listeners[t].filter((i) => e !== i)), this.pswp && this.pswp.off(t, e);
  }
  dispatch(t, e) {
    if (this.pswp)
      return this.pswp.dispatch(t, e);
    const i = new te(t, e);
    return this._listeners && this._listeners[t] && this._listeners[t].forEach((s) => {
      s.call(this, i);
    }), i;
  }
}
class ie {
  constructor(t, e) {
    this.element = m(
      "pswp__img pswp__img--placeholder",
      t ? "img" : "",
      e
    ), t && (this.element.decoding = "async", this.element.alt = "", this.element.src = t, this.element.setAttribute("role", "presentation")), this.element.setAttribute("aria-hiden", "true");
  }
  setDisplayedSize(t, e) {
    !this.element || (this.element.tagName === "IMG" ? (O(this.element, 250, "auto"), this.element.style.transformOrigin = "0 0", this.element.style.transform = A(0, 0, t / 250)) : O(this.element, t, e));
  }
  destroy() {
    this.element.parentNode && this.element.remove(), this.element = null;
  }
}
class se {
  constructor(t, e, i) {
    this.instance = e, this.data = t, this.index = i, this.element = void 0, this.displayedImageWidth = 0, this.displayedImageHeight = 0, this.width = Number(this.data.w) || Number(this.data.width) || 0, this.height = Number(this.data.h) || Number(this.data.height) || 0, this.isAttached = !1, this.hasSlide = !1, this.state = _.IDLE, this.data.type ? this.type = this.data.type : this.data.src ? this.type = "image" : this.type = "html", this.instance.dispatch("contentInit", { content: this });
  }
  removePlaceholder() {
    this.placeholder && !this.keepPlaceholder() && setTimeout(() => {
      this.placeholder && (this.placeholder.destroy(), this.placeholder = null);
    }, 1e3);
  }
  load(t, e) {
    if (this.slide && this.usePlaceholder())
      if (this.placeholder) {
        const i = this.placeholder.element;
        i && !i.parentElement && this.slide.container.prepend(i);
      } else {
        const i = this.instance.applyFilters(
          "placeholderSrc",
          this.data.msrc && this.slide.isFirstSlide ? this.data.msrc : !1,
          this
        );
        this.placeholder = new ie(
          i,
          this.slide.container
        );
      }
    this.element && !e || this.instance.dispatch("contentLoad", { content: this, isLazy: t }).defaultPrevented || (this.isImageContent() ? (this.element = m("pswp__img", "img"), this.displayedImageWidth && this.loadImage(t)) : (this.element = m("pswp__content"), this.element.innerHTML = this.data.html || ""), e && this.slide && this.slide.updateContentSize(!0));
  }
  loadImage(t) {
    const e = this.element;
    this.instance.dispatch("contentLoadImage", { content: this, isLazy: t }).defaultPrevented || (this.updateSrcsetSizes(), this.data.srcset && (e.srcset = this.data.srcset), e.src = this.data.src, e.alt = this.data.alt || "", this.state = _.LOADING, e.complete ? this.onLoaded() : (e.onload = () => {
      this.onLoaded();
    }, e.onerror = () => {
      this.onError();
    }));
  }
  setSlide(t) {
    this.slide = t, this.hasSlide = !0, this.instance = t.pswp;
  }
  onLoaded() {
    this.state = _.LOADED, this.slide && (this.instance.dispatch("loadComplete", { slide: this.slide, content: this }), this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode && (this.append(), this.slide.updateContentSize(!0)), (this.state === _.LOADED || this.state === _.ERROR) && this.removePlaceholder());
  }
  onError() {
    this.state = _.ERROR, this.slide && (this.displayError(), this.instance.dispatch("loadComplete", { slide: this.slide, isError: !0, content: this }), this.instance.dispatch("loadError", { slide: this.slide, content: this }));
  }
  isLoading() {
    return this.instance.applyFilters(
      "isContentLoading",
      this.state === _.LOADING,
      this
    );
  }
  isError() {
    return this.state === _.ERROR;
  }
  isImageContent() {
    return this.type === "image";
  }
  setDisplayedSize(t, e) {
    if (!!this.element && (this.placeholder && this.placeholder.setDisplayedSize(t, e), !this.instance.dispatch("contentResize", { content: this, width: t, height: e }).defaultPrevented && (O(this.element, t, e), this.isImageContent() && !this.isError()))) {
      const i = !this.displayedImageWidth && t;
      this.displayedImageWidth = t, this.displayedImageHeight = e, i ? this.loadImage(!1) : this.updateSrcsetSizes(), this.slide && this.instance.dispatch("imageSizeChange", { slide: this.slide, width: t, height: e, content: this });
    }
  }
  isZoomable() {
    return this.instance.applyFilters(
      "isContentZoomable",
      this.isImageContent() && this.state !== _.ERROR,
      this
    );
  }
  updateSrcsetSizes() {
    if (this.data.srcset) {
      const t = this.element, e = this.instance.applyFilters(
        "srcsetSizesWidth",
        this.displayedImageWidth,
        this
      );
      (!t.dataset.largestUsedSize || e > parseInt(t.dataset.largestUsedSize, 10)) && (t.sizes = e + "px", t.dataset.largestUsedSize = String(e));
    }
  }
  usePlaceholder() {
    return this.instance.applyFilters(
      "useContentPlaceholder",
      this.isImageContent(),
      this
    );
  }
  lazyLoad() {
    this.instance.dispatch("contentLazyLoad", { content: this }).defaultPrevented || this.load(!0);
  }
  keepPlaceholder() {
    return this.instance.applyFilters(
      "isKeepingPlaceholder",
      this.isLoading(),
      this
    );
  }
  destroy() {
    this.hasSlide = !1, this.slide = null, !this.instance.dispatch("contentDestroy", { content: this }).defaultPrevented && (this.remove(), this.placeholder && (this.placeholder.destroy(), this.placeholder = null), this.isImageContent() && this.element && (this.element.onload = null, this.element.onerror = null, this.element = null));
  }
  displayError() {
    if (this.slide) {
      let t = m("pswp__error-msg");
      t.innerText = this.instance.options.errorMsg, t = this.instance.applyFilters(
        "contentErrorElement",
        t,
        this
      ), this.element = m("pswp__content pswp__error-msg-container"), this.element.appendChild(t), this.slide.container.innerText = "", this.slide.container.appendChild(this.element), this.slide.updateContentSize(!0), this.removePlaceholder();
    }
  }
  append() {
    if (this.isAttached)
      return;
    if (this.isAttached = !0, this.state === _.ERROR) {
      this.displayError();
      return;
    }
    if (this.instance.dispatch("contentAppend", { content: this }).defaultPrevented)
      return;
    const t = "decode" in this.element;
    this.isImageContent() ? t && this.slide && (!this.slide.isActive || M()) ? (this.isDecoding = !0, this.element.decode().finally(() => {
      this.isDecoding = !1, this.appendImage();
    })) : this.appendImage() : this.element && !this.element.parentNode && this.slide.container.appendChild(this.element);
  }
  activate() {
    this.instance.dispatch("contentActivate", { content: this }).defaultPrevented || this.slide && (this.isImageContent() && this.isDecoding && !M() ? this.appendImage() : this.isError() && this.load(!1, !0));
  }
  deactivate() {
    this.instance.dispatch("contentDeactivate", { content: this });
  }
  remove() {
    this.isAttached = !1, !this.instance.dispatch("contentRemove", { content: this }).defaultPrevented && (this.element && this.element.parentNode && this.element.remove(), this.placeholder && this.placeholder.element && this.placeholder.element.remove());
  }
  appendImage() {
    !this.isAttached || this.instance.dispatch("contentAppendImage", { content: this }).defaultPrevented || (this.slide && this.element && !this.element.parentNode && this.slide.container.appendChild(this.element), (this.state === _.LOADED || this.state === _.ERROR) && this.removePlaceholder());
  }
}
const ne = 5;
function Y(n, t, e) {
  const i = t.createContentFromData(n, e);
  if (!i || !i.lazyLoad)
    return;
  const { options: s } = t, o = t.viewportSize || q(s, t), r = $(s, o, n, e), a = new K(s, n, -1);
  return a.update(i.width, i.height, r), i.lazyLoad(), i.setDisplayedSize(
    Math.ceil(i.width * a.initial),
    Math.ceil(i.height * a.initial)
  ), i;
}
function oe(n, t) {
  const e = t.getItemData(n);
  if (!t.dispatch("lazyLoadSlide", { index: n, itemData: e }).defaultPrevented)
    return Y(e, t, n);
}
class re {
  constructor(t) {
    this.pswp = t, this.limit = Math.max(
      t.options.preload[0] + t.options.preload[1] + 1,
      ne
    ), this._cachedItems = [];
  }
  updateLazy(t) {
    const { pswp: e } = this;
    if (e.dispatch("lazyLoad").defaultPrevented)
      return;
    const { preload: i } = e.options, s = t === void 0 ? !0 : t >= 0;
    let o;
    for (o = 0; o <= i[1]; o++)
      this.loadSlideByIndex(e.currIndex + (s ? o : -o));
    for (o = 1; o <= i[0]; o++)
      this.loadSlideByIndex(e.currIndex + (s ? -o : o));
  }
  loadSlideByIndex(t) {
    t = this.pswp.getLoopedIndex(t);
    let e = this.getContentByIndex(t);
    e || (e = oe(t, this.pswp), e && this.addToCache(e));
  }
  getContentBySlide(t) {
    let e = this.getContentByIndex(t.index);
    return e || (e = this.pswp.createContentFromData(t.data, t.index), e && this.addToCache(e)), e && e.setSlide(t), e;
  }
  addToCache(t) {
    if (this.removeByIndex(t.index), this._cachedItems.push(t), this._cachedItems.length > this.limit) {
      const e = this._cachedItems.findIndex((i) => !i.isAttached && !i.hasSlide);
      e !== -1 && this._cachedItems.splice(e, 1)[0].destroy();
    }
  }
  removeByIndex(t) {
    const e = this._cachedItems.findIndex((i) => i.index === t);
    e !== -1 && this._cachedItems.splice(e, 1);
  }
  getContentByIndex(t) {
    return this._cachedItems.find((e) => e.index === t);
  }
  destroy() {
    this._cachedItems.forEach((t) => t.destroy()), this._cachedItems = null;
  }
}
class ae extends ee {
  getNumItems() {
    let t;
    const { dataSource: e } = this.options;
    e ? "length" in e ? t = e.length : "gallery" in e && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), e.items && (t = e.items.length)) : t = 0;
    const i = this.dispatch("numItems", {
      dataSource: e,
      numItems: t
    });
    return this.applyFilters("numItems", i.numItems, e);
  }
  createContentFromData(t, e) {
    return new se(t, this, e);
  }
  getItemData(t) {
    const { dataSource: e } = this.options;
    let i;
    Array.isArray(e) ? i = e[t] : e && e.gallery && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), i = e.items[t]);
    let s = i;
    s instanceof Element && (s = this._domElementToItemData(s));
    const o = this.dispatch("itemData", {
      itemData: s || {},
      index: t
    });
    return this.applyFilters("itemData", o.itemData, t);
  }
  _getGalleryDOMElements(t) {
    return this.options.children || this.options.childSelector ? ft(
      this.options.children,
      this.options.childSelector,
      t
    ) || [] : [t];
  }
  _domElementToItemData(t) {
    const e = {
      element: t
    }, i = t.tagName === "A" ? t : t.querySelector("a");
    if (i) {
      e.src = i.dataset.pswpSrc || i.href, i.dataset.pswpSrcset && (e.srcset = i.dataset.pswpSrcset), e.width = parseInt(i.dataset.pswpWidth, 10), e.height = parseInt(i.dataset.pswpHeight, 10), e.w = e.width, e.h = e.height, i.dataset.pswpType && (e.type = i.dataset.pswpType);
      const s = t.querySelector("img");
      s && (e.msrc = s.currentSrc || s.src, e.alt = s.getAttribute("alt")), (i.dataset.pswpCropped || i.dataset.cropped) && (e.thumbCropped = !0);
    }
    return this.applyFilters("domItemData", e, t, i);
  }
  lazyLoadData(t, e) {
    return Y(t, this, e);
  }
}
const P = 3e-3;
class he {
  constructor(t) {
    this.pswp = t, this.isClosed = !0, this._prepareOpen = this._prepareOpen.bind(this), this._thumbBounds = void 0, t.on("firstZoomPan", this._prepareOpen);
  }
  open() {
    this._prepareOpen(), this._start();
  }
  close() {
    if (this.isClosed || this.isClosing || this.isOpening)
      return !1;
    const t = this.pswp.currSlide;
    return this.isOpen = !1, this.isOpening = !1, this.isClosing = !0, this._duration = this.pswp.options.hideAnimationDuration, t && t.currZoomLevel * t.width >= this.pswp.options.maxWidthToAnimate && (this._duration = 0), this._applyStartProps(), setTimeout(() => {
      this._start();
    }, this._croppedZoom ? 30 : 0), !0;
  }
  _prepareOpen() {
    if (this.pswp.off("firstZoomPan", this._prepareOpen), !this.isOpening) {
      const t = this.pswp.currSlide;
      this.isOpening = !0, this.isClosing = !1, this._duration = this.pswp.options.showAnimationDuration, t && t.zoomLevels.initial * t.width >= this.pswp.options.maxWidthToAnimate && (this._duration = 0), this._applyStartProps();
    }
  }
  _applyStartProps() {
    const { pswp: t } = this, e = this.pswp.currSlide, { options: i } = t;
    if (i.showHideAnimationType === "fade" ? (i.showHideOpacity = !0, this._thumbBounds = !1) : i.showHideAnimationType === "none" ? (i.showHideOpacity = !1, this._duration = 0, this._thumbBounds = !1) : this.isOpening && t._initialThumbBounds ? this._thumbBounds = t._initialThumbBounds : this._thumbBounds = this.pswp.getThumbBounds(), this._placeholder = e.getPlaceholderElement(), t.animations.stopAll(), this._useAnimation = this._duration > 50, this._animateZoom = Boolean(this._thumbBounds) && e.content && e.content.usePlaceholder() && (!this.isClosing || !t.mainScroll.isShifted()), this._animateZoom ? this._animateRootOpacity = i.showHideOpacity : (this._animateRootOpacity = !0, this.isOpening && (e.zoomAndPanToInitial(), e.applyCurrentZoomPan())), this._animateBgOpacity = !this._animateRootOpacity && this.pswp.options.bgOpacity > P, this._opacityElement = this._animateRootOpacity ? t.element : t.bg, !this._useAnimation) {
      this._duration = 0, this._animateZoom = !1, this._animateBgOpacity = !1, this._animateRootOpacity = !0, this.isOpening && (t.element.style.opacity = String(P), t.applyBgOpacity(1));
      return;
    }
    this._animateZoom && this._thumbBounds && this._thumbBounds.innerRect ? (this._croppedZoom = !0, this._cropContainer1 = this.pswp.container, this._cropContainer2 = this.pswp.currSlide.holderElement, t.container.style.overflow = "hidden", t.container.style.width = t.viewportSize.x + "px") : this._croppedZoom = !1, this.isOpening ? (this._animateRootOpacity ? (t.element.style.opacity = String(P), t.applyBgOpacity(1)) : (this._animateBgOpacity && (t.bg.style.opacity = String(P)), t.element.style.opacity = "1"), this._animateZoom && (this._setClosedStateZoomPan(), this._placeholder && (this._placeholder.style.willChange = "transform", this._placeholder.style.opacity = String(P)))) : this.isClosing && (t.mainScroll.itemHolders[0].el.style.display = "none", t.mainScroll.itemHolders[2].el.style.display = "none", this._croppedZoom && t.mainScroll.x !== 0 && (t.mainScroll.resetPosition(), t.mainScroll.resize()));
  }
  _start() {
    this.isOpening && this._useAnimation && this._placeholder && this._placeholder.tagName === "IMG" ? new Promise((t) => {
      let e = !1, i = !0;
      ut(this._placeholder).finally(() => {
        e = !0, i || t();
      }), setTimeout(() => {
        i = !1, e && t();
      }, 50), setTimeout(t, 250);
    }).finally(() => this._initiate()) : this._initiate();
  }
  _initiate() {
    this.pswp.element.style.setProperty("--pswp-transition-duration", this._duration + "ms"), this.pswp.dispatch(
      this.isOpening ? "openingAnimationStart" : "closingAnimationStart"
    ), this.pswp.dispatch(
      "initialZoom" + (this.isOpening ? "In" : "Out")
    ), this.pswp.element.classList[this.isOpening ? "add" : "remove"]("pswp--ui-visible"), this.isOpening ? (this._placeholder && (this._placeholder.style.opacity = "1"), this._animateToOpenState()) : this.isClosing && this._animateToClosedState(), this._useAnimation || this._onAnimationComplete();
  }
  _onAnimationComplete() {
    const { pswp: t } = this;
    this.isOpen = this.isOpening, this.isClosed = this.isClosing, this.isOpening = !1, this.isClosing = !1, t.dispatch(
      this.isOpen ? "openingAnimationEnd" : "closingAnimationEnd"
    ), t.dispatch(
      "initialZoom" + (this.isOpen ? "InEnd" : "OutEnd")
    ), this.isClosed ? t.destroy() : this.isOpen && (this._animateZoom && (t.container.style.overflow = "visible", t.container.style.width = "100%"), t.currSlide.applyCurrentZoomPan());
  }
  _animateToOpenState() {
    const { pswp: t } = this;
    this._animateZoom && (this._croppedZoom && (this._animateTo(this._cropContainer1, "transform", "translate3d(0,0,0)"), this._animateTo(this._cropContainer2, "transform", "none")), t.currSlide.zoomAndPanToInitial(), this._animateTo(
      t.currSlide.container,
      "transform",
      t.currSlide.getCurrentTransform()
    )), this._animateBgOpacity && this._animateTo(t.bg, "opacity", String(t.options.bgOpacity)), this._animateRootOpacity && this._animateTo(t.element, "opacity", "1");
  }
  _animateToClosedState() {
    const { pswp: t } = this;
    this._animateZoom && this._setClosedStateZoomPan(!0), this._animateBgOpacity && t.bgOpacity > 0.01 && this._animateTo(t.bg, "opacity", "0"), this._animateRootOpacity && this._animateTo(t.element, "opacity", "0");
  }
  _setClosedStateZoomPan(t) {
    if (!this._thumbBounds)
      return;
    const { pswp: e } = this, { innerRect: i } = this._thumbBounds, { currSlide: s, viewportSize: o } = e;
    if (this._croppedZoom) {
      const r = -o.x + (this._thumbBounds.x - i.x) + i.w, a = -o.y + (this._thumbBounds.y - i.y) + i.h, l = o.x - i.w, h = o.y - i.h;
      t ? (this._animateTo(
        this._cropContainer1,
        "transform",
        A(r, a)
      ), this._animateTo(
        this._cropContainer2,
        "transform",
        A(l, h)
      )) : (v(this._cropContainer1, r, a), v(this._cropContainer2, l, h));
    }
    u(s.pan, i || this._thumbBounds), s.currZoomLevel = this._thumbBounds.w / s.width, t ? this._animateTo(s.container, "transform", s.getCurrentTransform()) : s.applyCurrentZoomPan();
  }
  _animateTo(t, e, i) {
    if (!this._duration) {
      t.style[e] = i;
      return;
    }
    const { animations: s } = this.pswp, o = {
      duration: this._duration,
      easing: this.pswp.options.easing,
      onComplete: () => {
        s.activeAnimations.length || this._onAnimationComplete();
      },
      target: t
    };
    o[e] = i, s.startTransition(o);
  }
}
const le = {
  allowPanToNext: !0,
  spacing: 0.1,
  loop: !0,
  pinchToClose: !0,
  closeOnVerticalDrag: !0,
  hideAnimationDuration: 333,
  showAnimationDuration: 333,
  zoomAnimationDuration: 333,
  escKey: !0,
  arrowKeys: !0,
  returnFocus: !0,
  maxWidthToAnimate: 4e3,
  clickToCloseNonZoomable: !0,
  imageClickAction: "zoom-or-close",
  bgClickAction: "close",
  tapAction: "toggle-controls",
  doubleTapAction: "zoom",
  indexIndicatorSep: " / ",
  preloaderDelay: 2e3,
  bgOpacity: 0.8,
  index: 0,
  errorMsg: "The image cannot be loaded",
  preload: [1, 2],
  easing: "cubic-bezier(.4,0,.22,1)"
};
class ce extends ae {
  constructor(t) {
    super(), this._prepareOptions(t), this.offset = {}, this._prevViewportSize = {}, this.viewportSize = {}, this.bgOpacity = 1, this.topBar = void 0, this.events = new _t(), this.animations = new kt(), this.mainScroll = new Ot(this), this.gestures = new Tt(this), this.opener = new he(this), this.keyboard = new Dt(this), this.contentLoader = new re(this);
  }
  init() {
    if (this.isOpen || this.isDestroying)
      return;
    this.isOpen = !0, this.dispatch("init"), this.dispatch("beforeOpen"), this._createMainStructure();
    let t = "pswp--open";
    return this.gestures.supportsTouch && (t += " pswp--touch"), this.options.mainClass && (t += " " + this.options.mainClass), this.element.className += " " + t, this.currIndex = this.options.index || 0, this.potentialIndex = this.currIndex, this.dispatch("firstUpdate"), this.scrollWheel = new Ht(this), (Number.isNaN(this.currIndex) || this.currIndex < 0 || this.currIndex >= this.getNumItems()) && (this.currIndex = 0), this.gestures.supportsTouch || this.mouseDetected(), this.updateSize(), this.offset.y = window.pageYOffset, this._initialItemData = this.getItemData(this.currIndex), this.dispatch("gettingData", {
      index: this.currIndex,
      data: this._initialItemData,
      slide: void 0
    }), this._initialThumbBounds = this.getThumbBounds(), this.dispatch("initialLayout"), this.on("openingAnimationEnd", () => {
      this.mainScroll.itemHolders[0].el.style.display = "block", this.mainScroll.itemHolders[2].el.style.display = "block", this.setContent(this.mainScroll.itemHolders[0], this.currIndex - 1), this.setContent(this.mainScroll.itemHolders[2], this.currIndex + 1), this.appendHeavy(), this.contentLoader.updateLazy(), this.events.add(window, "resize", this._handlePageResize.bind(this)), this.events.add(window, "scroll", this._updatePageScrollOffset.bind(this)), this.dispatch("bindEvents");
    }), this.setContent(this.mainScroll.itemHolders[1], this.currIndex), this.dispatch("change"), this.opener.open(), this.dispatch("afterInit"), !0;
  }
  getLoopedIndex(t) {
    const e = this.getNumItems();
    return this.options.loop && (t > e - 1 && (t -= e), t < 0 && (t += e)), t = b(t, 0, e - 1), t;
  }
  appendHeavy() {
    this.mainScroll.itemHolders.forEach((t) => {
      t.slide && t.slide.appendHeavy();
    });
  }
  goTo(t) {
    this.mainScroll.moveIndexBy(
      this.getLoopedIndex(t) - this.potentialIndex
    );
  }
  next() {
    this.goTo(this.potentialIndex + 1);
  }
  prev() {
    this.goTo(this.potentialIndex - 1);
  }
  zoomTo(...t) {
    this.currSlide.zoomTo(...t);
  }
  toggleZoom() {
    this.currSlide.toggleZoom();
  }
  close() {
    !this.opener.isOpen || this.isDestroying || (this.isDestroying = !0, this.dispatch("close"), this.events.removeAll(), this.opener.close());
  }
  destroy() {
    if (!this.isDestroying) {
      this.options.showHideAnimationType = "none", this.close();
      return;
    }
    this.dispatch("destroy"), this.listeners = null, this.scrollWrap.ontouchmove = null, this.scrollWrap.ontouchend = null, this.element.remove(), this.mainScroll.itemHolders.forEach((t) => {
      t.slide && t.slide.destroy();
    }), this.contentLoader.destroy(), this.events.removeAll();
  }
  refreshSlideContent(t) {
    this.contentLoader.removeByIndex(t), this.mainScroll.itemHolders.forEach((e, i) => {
      let s = this.currSlide.index - 1 + i;
      this.canLoop() && (s = this.getLoopedIndex(s)), s === t && (this.setContent(e, t, !0), i === 1 && (this.currSlide = e.slide, e.slide.setIsActive(!0)));
    }), this.dispatch("change");
  }
  setContent(t, e, i) {
    if (this.canLoop() && (e = this.getLoopedIndex(e)), t.slide) {
      if (t.slide.index === e && !i)
        return;
      t.slide.destroy(), t.slide = null;
    }
    if (!this.canLoop() && (e < 0 || e >= this.getNumItems()))
      return;
    const s = this.getItemData(e);
    t.slide = new yt(s, e, this), e === this.currIndex && (this.currSlide = t.slide), t.slide.append(t.el);
  }
  getViewportCenterPoint() {
    return {
      x: this.viewportSize.x / 2,
      y: this.viewportSize.y / 2
    };
  }
  updateSize(t) {
    if (this.isDestroying)
      return;
    const e = q(this.options, this);
    !t && C(e, this._prevViewportSize) || (u(this._prevViewportSize, e), this.dispatch("beforeResize"), u(this.viewportSize, this._prevViewportSize), this._updatePageScrollOffset(), this.dispatch("viewportSize"), this.mainScroll.resize(this.opener.isOpen), !this.hasMouse && window.matchMedia("(any-hover: hover)").matches && this.mouseDetected(), this.dispatch("resize"));
  }
  applyBgOpacity(t) {
    this.bgOpacity = Math.max(t, 0), this.bg.style.opacity = String(this.bgOpacity * this.options.bgOpacity);
  }
  mouseDetected() {
    this.hasMouse || (this.hasMouse = !0, this.element.classList.add("pswp--has_mouse"));
  }
  _handlePageResize() {
    this.updateSize(), /iPhone|iPad|iPod/i.test(window.navigator.userAgent) && setTimeout(() => {
      this.updateSize();
    }, 500);
  }
  _updatePageScrollOffset() {
    this.setScrollOffset(0, window.pageYOffset);
  }
  setScrollOffset(t, e) {
    this.offset.x = t, this.offset.y = e, this.dispatch("updateScrollOffset");
  }
  _createMainStructure() {
    this.element = m("pswp"), this.element.setAttribute("tabindex", "-1"), this.element.setAttribute("role", "dialog"), this.template = this.element, this.bg = m("pswp__bg", !1, this.element), this.scrollWrap = m("pswp__scroll-wrap", !1, this.element), this.container = m("pswp__container", !1, this.scrollWrap), this.mainScroll.appendHolders(), this.ui = new Yt(this), this.ui.init(), (this.options.appendToEl || document.body).appendChild(this.element);
  }
  getThumbBounds() {
    return Jt(
      this.currIndex,
      this.currSlide ? this.currSlide.data : this._initialItemData,
      this
    );
  }
  canLoop() {
    return this.options.loop && this.getNumItems() > 2;
  }
  _prepareOptions(t) {
    window.matchMedia("(prefers-reduced-motion), (update: slow)").matches && (t.showHideAnimationType = "none", t.zoomAnimationDuration = 0), this.options = {
      ...le,
      ...t
    };
  }
}
const de = ({ options: n = {} }) => ({
  init() {
    document.addEventListener("alpine:initialized", () => {
      this.initLightbox();
    });
  },
  initLightbox() {
    console.log(this.$el.id), new ct({
      gallery: this.$el,
      children: "a",
      pswpModule: ce,
      ...n
    }).init();
  }
});
document.addEventListener("alpine:init", () => {
  window.Alpine.data("photoSwipe", de);
});
