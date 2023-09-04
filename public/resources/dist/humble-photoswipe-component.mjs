/*!
  * PhotoSwipe Lightbox 5.3.2 - https://photoswipe.com
  * (c) 2022 Dmytro Semenov
  */
function et(s, t, e) {
  const i = document.createElement(t || "div");
  return s && (i.className = s), e && e.appendChild(i), i;
}
function ne(s, t, e) {
  let i = "translate3d(" + s + "px," + (t || 0) + "px,0)";
  return e !== void 0 && (i += " scale3d(" + e + "," + e + ",1)"), i;
}
function vt(s, t, e) {
  s.style.width = typeof t == "number" ? t + "px" : t, s.style.height = typeof e == "number" ? e + "px" : e;
}
const V = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error"
};
function se(s) {
  if (s.which === 2 || s.ctrlKey || s.metaKey || s.altKey || s.shiftKey)
    return !0;
}
function ht(s, t, e = document) {
  let i = [];
  if (s instanceof Element)
    i = [s];
  else if (s instanceof NodeList || Array.isArray(s))
    i = Array.from(s);
  else {
    const n = typeof s == "string" ? s : t;
    n && (i = Array.from(e.querySelectorAll(n)));
  }
  return i;
}
function re(s) {
  return typeof s == "function" && s.prototype && s.prototype.goTo;
}
function Et() {
  return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}
class oe {
  constructor(t, e) {
    this.type = t, e && Object.assign(this, e);
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
}
class ae {
  constructor() {
    this._listeners = {}, this._filters = {}, this.pswp = void 0, this.options = void 0;
  }
  addFilter(t, e, i = 100) {
    this._filters[t] || (this._filters[t] = []), this._filters[t].push({ fn: e, priority: i }), this._filters[t].sort((n, r) => n.priority - r.priority), this.pswp && this.pswp.addFilter(t, e, i);
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
    const i = new oe(t, e);
    return this._listeners && this._listeners[t] && this._listeners[t].forEach((n) => {
      n.call(this, i);
    }), i;
  }
}
class le {
  constructor(t, e) {
    this.element = et(
      "pswp__img pswp__img--placeholder",
      t ? "img" : "",
      e
    ), t && (this.element.decoding = "async", this.element.alt = "", this.element.src = t, this.element.setAttribute("role", "presentation")), this.element.setAttribute("aria-hiden", "true");
  }
  setDisplayedSize(t, e) {
    !this.element || (this.element.tagName === "IMG" ? (vt(this.element, 250, "auto"), this.element.style.transformOrigin = "0 0", this.element.style.transform = ne(0, 0, t / 250)) : vt(this.element, t, e));
  }
  destroy() {
    this.element.parentNode && this.element.remove(), this.element = null;
  }
}
class he {
  constructor(t, e, i) {
    this.instance = e, this.data = t, this.index = i, this.element = void 0, this.displayedImageWidth = 0, this.displayedImageHeight = 0, this.width = Number(this.data.w) || Number(this.data.width) || 0, this.height = Number(this.data.h) || Number(this.data.height) || 0, this.isAttached = !1, this.hasSlide = !1, this.state = V.IDLE, this.data.type ? this.type = this.data.type : this.data.src ? this.type = "image" : this.type = "html", this.instance.dispatch("contentInit", { content: this });
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
        this.placeholder = new le(
          i,
          this.slide.container
        );
      }
    this.element && !e || this.instance.dispatch("contentLoad", { content: this, isLazy: t }).defaultPrevented || (this.isImageContent() ? (this.element = et("pswp__img", "img"), this.displayedImageWidth && this.loadImage(t)) : (this.element = et("pswp__content"), this.element.innerHTML = this.data.html || ""), e && this.slide && this.slide.updateContentSize(!0));
  }
  loadImage(t) {
    const e = this.element;
    this.instance.dispatch("contentLoadImage", { content: this, isLazy: t }).defaultPrevented || (this.updateSrcsetSizes(), this.data.srcset && (e.srcset = this.data.srcset), e.src = this.data.src, e.alt = this.data.alt || "", this.state = V.LOADING, e.complete ? this.onLoaded() : (e.onload = () => {
      this.onLoaded();
    }, e.onerror = () => {
      this.onError();
    }));
  }
  setSlide(t) {
    this.slide = t, this.hasSlide = !0, this.instance = t.pswp;
  }
  onLoaded() {
    this.state = V.LOADED, this.slide && (this.instance.dispatch("loadComplete", { slide: this.slide, content: this }), this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode && (this.append(), this.slide.updateContentSize(!0)), (this.state === V.LOADED || this.state === V.ERROR) && this.removePlaceholder());
  }
  onError() {
    this.state = V.ERROR, this.slide && (this.displayError(), this.instance.dispatch("loadComplete", { slide: this.slide, isError: !0, content: this }), this.instance.dispatch("loadError", { slide: this.slide, content: this }));
  }
  isLoading() {
    return this.instance.applyFilters(
      "isContentLoading",
      this.state === V.LOADING,
      this
    );
  }
  isError() {
    return this.state === V.ERROR;
  }
  isImageContent() {
    return this.type === "image";
  }
  setDisplayedSize(t, e) {
    if (!!this.element && (this.placeholder && this.placeholder.setDisplayedSize(t, e), !this.instance.dispatch("contentResize", { content: this, width: t, height: e }).defaultPrevented && (vt(this.element, t, e), this.isImageContent() && !this.isError()))) {
      const i = !this.displayedImageWidth && t;
      this.displayedImageWidth = t, this.displayedImageHeight = e, i ? this.loadImage(!1) : this.updateSrcsetSizes(), this.slide && this.instance.dispatch("imageSizeChange", { slide: this.slide, width: t, height: e, content: this });
    }
  }
  isZoomable() {
    return this.instance.applyFilters(
      "isContentZoomable",
      this.isImageContent() && this.state !== V.ERROR,
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
      let t = et("pswp__error-msg");
      t.innerText = this.instance.options.errorMsg, t = this.instance.applyFilters(
        "contentErrorElement",
        t,
        this
      ), this.element = et("pswp__content pswp__error-msg-container"), this.element.appendChild(t), this.slide.container.innerText = "", this.slide.container.appendChild(this.element), this.slide.updateContentSize(!0), this.removePlaceholder();
    }
  }
  append() {
    if (this.isAttached)
      return;
    if (this.isAttached = !0, this.state === V.ERROR) {
      this.displayError();
      return;
    }
    if (this.instance.dispatch("contentAppend", { content: this }).defaultPrevented)
      return;
    const t = "decode" in this.element;
    this.isImageContent() ? t && this.slide && (!this.slide.isActive || Et()) ? (this.isDecoding = !0, this.element.decode().finally(() => {
      this.isDecoding = !1, this.appendImage();
    })) : this.appendImage() : this.element && !this.element.parentNode && this.slide.container.appendChild(this.element);
  }
  activate() {
    this.instance.dispatch("contentActivate", { content: this }).defaultPrevented || this.slide && (this.isImageContent() && this.isDecoding && !Et() ? this.appendImage() : this.isError() && this.load(!1, !0));
  }
  deactivate() {
    this.instance.dispatch("contentDeactivate", { content: this });
  }
  remove() {
    this.isAttached = !1, !this.instance.dispatch("contentRemove", { content: this }).defaultPrevented && (this.element && this.element.parentNode && this.element.remove(), this.placeholder && this.placeholder.element && this.placeholder.element.remove());
  }
  appendImage() {
    !this.isAttached || this.instance.dispatch("contentAppendImage", { content: this }).defaultPrevented || (this.slide && this.element && !this.element.parentNode && this.slide.container.appendChild(this.element), (this.state === V.LOADED || this.state === V.ERROR) && this.removePlaceholder());
  }
}
function ce(s, t) {
  if (s.getViewportSizeFn) {
    const e = s.getViewportSizeFn(s, t);
    if (e)
      return e;
  }
  return {
    x: document.documentElement.clientWidth,
    y: window.innerHeight
  };
}
function lt(s, t, e, i, n) {
  let r;
  if (t.paddingFn)
    r = t.paddingFn(e, i, n)[s];
  else if (t.padding)
    r = t.padding[s];
  else {
    const o = "padding" + s[0].toUpperCase() + s.slice(1);
    t[o] && (r = t[o]);
  }
  return r || 0;
}
function ue(s, t, e, i) {
  return {
    x: t.x - lt("left", s, t, e, i) - lt("right", s, t, e, i),
    y: t.y - lt("top", s, t, e, i) - lt("bottom", s, t, e, i)
  };
}
const Tt = 4e3;
class de {
  constructor(t, e, i, n) {
    this.pswp = n, this.options = t, this.itemData = e, this.index = i;
  }
  update(t, e, i) {
    this.elementSize = {
      x: t,
      y: e
    }, this.panAreaSize = i;
    const n = this.panAreaSize.x / this.elementSize.x, r = this.panAreaSize.y / this.elementSize.y;
    this.fit = Math.min(1, n < r ? n : r), this.fill = Math.min(1, n > r ? n : r), this.vFill = Math.min(1, r), this.initial = this._getInitial(), this.secondary = this._getSecondary(), this.max = Math.max(
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
    return t || (t = Math.min(1, this.fit * 3), t * this.elementSize.x > Tt && (t = Tt / this.elementSize.x), t);
  }
  _getInitial() {
    return this._parseZoomLevelOption("initial") || this.fit;
  }
  _getMax() {
    const t = this._parseZoomLevelOption("max");
    return t || Math.max(1, this.fit * 4);
  }
}
function Nt(s, t, e) {
  const i = t.createContentFromData(s, e);
  if (!i || !i.lazyLoad)
    return;
  const { options: n } = t, r = t.viewportSize || ce(n, t), o = ue(n, r, s, e), a = new de(n, s, -1);
  return a.update(i.width, i.height, o), i.lazyLoad(), i.setDisplayedSize(
    Math.ceil(i.width * a.initial),
    Math.ceil(i.height * a.initial)
  ), i;
}
function pe(s, t) {
  const e = t.getItemData(s);
  if (!t.dispatch("lazyLoadSlide", { index: s, itemData: e }).defaultPrevented)
    return Nt(e, t, s);
}
class fe extends ae {
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
    return new he(t, this, e);
  }
  getItemData(t) {
    const { dataSource: e } = this.options;
    let i;
    Array.isArray(e) ? i = e[t] : e && e.gallery && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), i = e.items[t]);
    let n = i;
    n instanceof Element && (n = this._domElementToItemData(n));
    const r = this.dispatch("itemData", {
      itemData: n || {},
      index: t
    });
    return this.applyFilters("itemData", r.itemData, t);
  }
  _getGalleryDOMElements(t) {
    return this.options.children || this.options.childSelector ? ht(
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
      const n = t.querySelector("img");
      n && (e.msrc = n.currentSrc || n.src, e.alt = n.getAttribute("alt")), (i.dataset.pswpCropped || i.dataset.cropped) && (e.thumbCropped = !0);
    }
    return this.applyFilters("domItemData", e, t, i);
  }
  lazyLoadData(t, e) {
    return Nt(t, this, e);
  }
}
class me extends fe {
  constructor(t) {
    super(), this.options = t || {}, this._uid = 0;
  }
  init() {
    this.onThumbnailsClick = this.onThumbnailsClick.bind(this), ht(this.options.gallery, this.options.gallerySelector).forEach((t) => {
      t.addEventListener("click", this.onThumbnailsClick, !1);
    });
  }
  onThumbnailsClick(t) {
    if (se(t) || window.pswp || window.navigator.onLine === !1)
      return;
    let e = { x: t.clientX, y: t.clientY };
    !e.x && !e.y && (e = null);
    let i = this.getClickedIndex(t);
    i = this.applyFilters("clickedIndex", i, t, this);
    const n = {
      gallery: t.currentTarget
    };
    i >= 0 && (t.preventDefault(), this.loadAndOpen(i, n, e));
  }
  getClickedIndex(t) {
    if (this.options.getClickedIndexFn)
      return this.options.getClickedIndexFn.call(this, t);
    const e = t.target, n = ht(
      this.options.children,
      this.options.childSelector,
      t.currentTarget
    ).findIndex(
      (r) => r === e || r.contains(e)
    );
    return n !== -1 ? n : this.options.children || this.options.childSelector ? -1 : 0;
  }
  loadAndOpen(t, e, i) {
    return window.pswp ? !1 : (this.options.index = t, this.options.initialPointerPos = i, this.shouldOpen = !0, this.preload(t, e), !0);
  }
  preload(t, e) {
    const { options: i } = this;
    e && (i.dataSource = e);
    const n = [], r = typeof i.pswpModule;
    if (re(i.pswpModule))
      n.push(Promise.resolve(i.pswpModule));
    else {
      if (r === "string")
        throw new Error("pswpModule as string is no longer supported");
      if (r === "function")
        n.push(i.pswpModule());
      else
        throw new Error("pswpModule is not valid");
    }
    typeof i.openPromise == "function" && n.push(i.openPromise()), i.preloadFirstSlide !== !1 && t >= 0 && (this._preloadedContent = pe(t, this));
    const o = ++this._uid;
    Promise.all(n).then((a) => {
      if (this.shouldOpen) {
        const h = a[0];
        this._openPhotoswipe(h, o);
      }
    });
  }
  _openPhotoswipe(t, e) {
    if (e !== this._uid && this.shouldOpen || (this.shouldOpen = !1, window.pswp))
      return;
    const i = typeof t == "object" ? new t.default(this.options) : new t(this.options);
    this.pswp = i, window.pswp = i, Object.keys(this._listeners).forEach((n) => {
      this._listeners[n].forEach((r) => {
        i.on(n, r);
      });
    }), Object.keys(this._filters).forEach((n) => {
      this._filters[n].forEach((r) => {
        i.addFilter(n, r.fn, r.priority);
      });
    }), this._preloadedContent && (i.contentLoader.addToCache(this._preloadedContent), this._preloadedContent = null), i.on("destroy", () => {
      this.pswp = null, window.pswp = null;
    }), i.init();
  }
  destroy() {
    this.pswp && this.pswp.destroy(), this.shouldOpen = !1, this._listeners = null, ht(this.options.gallery, this.options.gallerySelector).forEach((t) => {
      t.removeEventListener("click", this.onThumbnailsClick, !1);
    });
  }
}
/*!
  * PhotoSwipe 5.3.2 - https://photoswipe.com
  * (c) 2022 Dmytro Semenov
  */
function M(s, t, e) {
  const i = document.createElement(t || "div");
  return s && (i.className = s), e && e.appendChild(i), i;
}
function O(s, t) {
  return s.x = t.x, s.y = t.y, t.id !== void 0 && (s.id = t.id), s;
}
function Vt(s) {
  s.x = Math.round(s.x), s.y = Math.round(s.y);
}
function wt(s, t) {
  const e = Math.abs(s.x - t.x), i = Math.abs(s.y - t.y);
  return Math.sqrt(e * e + i * i);
}
function nt(s, t) {
  return s.x === t.x && s.y === t.y;
}
function at(s, t, e) {
  return Math.min(Math.max(s, t), e);
}
function st(s, t, e) {
  let i = "translate3d(" + s + "px," + (t || 0) + "px,0)";
  return e !== void 0 && (i += " scale3d(" + e + "," + e + ",1)"), i;
}
function $(s, t, e, i) {
  s.style.transform = st(t, e, i);
}
const ge = "cubic-bezier(.4,0,.22,1)";
function Bt(s, t, e, i) {
  s.style.transition = t ? t + " " + e + "ms " + (i || ge) : "none";
}
function _t(s, t, e) {
  s.style.width = typeof t == "number" ? t + "px" : t, s.style.height = typeof e == "number" ? e + "px" : e;
}
function ye(s) {
  Bt(s);
}
function ve(s) {
  return "decode" in s ? s.decode() : s.complete ? Promise.resolve(s) : new Promise((t, e) => {
    s.onload = () => t(s), s.onerror = e;
  });
}
const B = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error"
};
function we(s) {
  if (s.which === 2 || s.ctrlKey || s.metaKey || s.altKey || s.shiftKey)
    return !0;
}
function _e(s, t, e = document) {
  let i = [];
  if (s instanceof Element)
    i = [s];
  else if (s instanceof NodeList || Array.isArray(s))
    i = Array.from(s);
  else {
    const n = typeof s == "string" ? s : t;
    n && (i = Array.from(e.querySelectorAll(n)));
  }
  return i;
}
function It() {
  return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}
let Wt = !1;
try {
  window.addEventListener("test", null, Object.defineProperty({}, "passive", {
    get: () => {
      Wt = !0;
    }
  }));
} catch {
}
class Pe {
  constructor() {
    this._pool = [];
  }
  add(t, e, i, n) {
    this._toggleListener(t, e, i, n);
  }
  remove(t, e, i, n) {
    this._toggleListener(t, e, i, n, !0);
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
  _toggleListener(t, e, i, n, r, o) {
    if (!t)
      return;
    const a = r ? "removeEventListener" : "addEventListener";
    e.split(" ").forEach((l) => {
      if (l) {
        o || (r ? this._pool = this._pool.filter((f) => f.type !== l || f.listener !== i || f.target !== t) : this._pool.push({
          target: t,
          type: l,
          listener: i,
          passive: n
        }));
        const p = Wt ? { passive: n || !1 } : !1;
        t[a](
          l,
          i,
          p
        );
      }
    });
  }
}
function Ht(s, t) {
  if (s.getViewportSizeFn) {
    const e = s.getViewportSizeFn(s, t);
    if (e)
      return e;
  }
  return {
    x: document.documentElement.clientWidth,
    y: window.innerHeight
  };
}
function it(s, t, e, i, n) {
  let r;
  if (t.paddingFn)
    r = t.paddingFn(e, i, n)[s];
  else if (t.padding)
    r = t.padding[s];
  else {
    const o = "padding" + s[0].toUpperCase() + s.slice(1);
    t[o] && (r = t[o]);
  }
  return r || 0;
}
function jt(s, t, e, i) {
  return {
    x: t.x - it("left", s, t, e, i) - it("right", s, t, e, i),
    y: t.y - it("top", s, t, e, i) - it("bottom", s, t, e, i)
  };
}
class be {
  constructor(t) {
    this.slide = t, this.currZoomLevel = 1, this.center = {}, this.max = {}, this.min = {}, this.reset();
  }
  update(t) {
    this.currZoomLevel = t, this.slide.width ? (this._updateAxis("x"), this._updateAxis("y"), this.slide.pswp.dispatch("calcBounds", { slide: this.slide })) : this.reset();
  }
  _updateAxis(t) {
    const { pswp: e } = this.slide, i = this.slide[t === "x" ? "width" : "height"] * this.currZoomLevel, r = it(
      t === "x" ? "left" : "top",
      e.options,
      e.viewportSize,
      this.slide.data,
      this.slide.index
    ), o = this.slide.panAreaSize[t];
    this.center[t] = Math.round((o - i) / 2) + r, this.max[t] = i > o ? Math.round(o - i) + r : this.center[t], this.min[t] = i > o ? r : this.center[t];
  }
  reset() {
    this.center.x = 0, this.center.y = 0, this.max.x = 0, this.max.y = 0, this.min.x = 0, this.min.y = 0;
  }
  correctPan(t, e) {
    return at(e, this.max[t], this.min[t]);
  }
}
const Ct = 4e3;
class qt {
  constructor(t, e, i, n) {
    this.pswp = n, this.options = t, this.itemData = e, this.index = i;
  }
  update(t, e, i) {
    this.elementSize = {
      x: t,
      y: e
    }, this.panAreaSize = i;
    const n = this.panAreaSize.x / this.elementSize.x, r = this.panAreaSize.y / this.elementSize.y;
    this.fit = Math.min(1, n < r ? n : r), this.fill = Math.min(1, n > r ? n : r), this.vFill = Math.min(1, r), this.initial = this._getInitial(), this.secondary = this._getSecondary(), this.max = Math.max(
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
    return t || (t = Math.min(1, this.fit * 3), t * this.elementSize.x > Ct && (t = Ct / this.elementSize.x), t);
  }
  _getInitial() {
    return this._parseZoomLevelOption("initial") || this.fit;
  }
  _getMax() {
    const t = this._parseZoomLevelOption("max");
    return t || Math.max(1, this.fit * 4);
  }
}
class Se {
  constructor(t, e, i) {
    this.data = t, this.index = e, this.pswp = i, this.isActive = e === i.currIndex, this.currentResolution = 0, this.panAreaSize = {}, this.isFirstSlide = this.isActive && !i.opener.isOpen, this.zoomLevels = new qt(i.options, t, e, i), this.pswp.dispatch("gettingData", {
      slide: this,
      data: this.data,
      index: e
    }), this.pan = {
      x: 0,
      y: 0
    }, this.content = this.pswp.contentLoader.getContentBySlide(this), this.container = M("pswp__zoom-wrap"), this.currZoomLevel = 1, this.width = this.content.width, this.height = this.content.height, this.bounds = new be(this), this.prevDisplayedWidth = -1, this.prevDisplayedHeight = -1, this.pswp.dispatch("slideInit", { slide: this });
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
    const i = Math.round(this.width * e) || this.pswp.viewportSize.x, n = Math.round(this.height * e) || this.pswp.viewportSize.y;
    !this.sizeChanged(i, n) && !t || this.content.setDisplayedSize(i, n);
  }
  sizeChanged(t, e) {
    return t !== this.prevDisplayedWidth || e !== this.prevDisplayedHeight ? (this.prevDisplayedWidth = t, this.prevDisplayedHeight = e, !0) : !1;
  }
  getPlaceholderElement() {
    if (this.content.placeholder)
      return this.content.placeholder.element;
  }
  zoomTo(t, e, i, n) {
    const { pswp: r } = this;
    if (!this.isZoomable() || r.mainScroll.isShifted())
      return;
    r.dispatch("beforeZoomTo", {
      destZoomLevel: t,
      centerPoint: e,
      transitionDuration: i
    }), r.animations.stopAllPan();
    const o = this.currZoomLevel;
    n || (t = at(t, this.zoomLevels.min, this.zoomLevels.max)), this.setZoomLevel(t), this.pan.x = this.calculateZoomToPanOffset("x", e, o), this.pan.y = this.calculateZoomToPanOffset("y", e, o), Vt(this.pan);
    const a = () => {
      this._setResolution(t), this.applyCurrentZoomPan();
    };
    i ? r.animations.startTransition({
      isPan: !0,
      name: "zoomTo",
      target: this.container,
      transform: this.getCurrentTransform(),
      onComplete: a,
      duration: i,
      easing: r.options.easing
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
    const r = this.currZoomLevel / i;
    return this.bounds.correctPan(
      t,
      (this.pan[t] - e[t]) * r + e[t]
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
    this.currZoomLevel = this.zoomLevels.initial, this.bounds.update(this.currZoomLevel), O(this.pan, this.bounds.center), this.pswp.dispatch("initialZoomPan", { slide: this });
  }
  _applyZoomTransform(t, e, i) {
    i /= this.currentResolution || this.zoomLevels.initial, $(this.container, t, e, i);
  }
  calculateSize() {
    const { pswp: t } = this;
    O(
      this.panAreaSize,
      jt(t.options, t.viewportSize, this.data, this.index)
    ), this.zoomLevels.update(this.width, this.height, this.panAreaSize), t.dispatch("calcSlideSize", {
      slide: this
    });
  }
  getCurrentTransform() {
    const t = this.currZoomLevel / (this.currentResolution || this.zoomLevels.initial);
    return st(this.pan.x, this.pan.y, t);
  }
  _setResolution(t) {
    t !== this.currentResolution && (this.currentResolution = t, this.updateContentSize(), this.pswp.dispatch("resolutionChanged"));
  }
}
const Ee = 0.35, Te = 0.6, Lt = 0.4, At = 0.5;
function Ie(s, t) {
  return s * t / (1 - t);
}
class Ce {
  constructor(t) {
    this.gestures = t, this.pswp = t.pswp, this.startPan = {};
  }
  start() {
    O(this.startPan, this.pswp.currSlide.pan), this.pswp.animations.stopAll();
  }
  change() {
    const { p1: t, prevP1: e, dragAxis: i, pswp: n } = this.gestures, { currSlide: r } = n;
    if (i === "y" && n.options.closeOnVerticalDrag && r.currZoomLevel <= r.zoomLevels.fit && !this.gestures.isMultitouch) {
      const o = r.pan.y + (t.y - e.y);
      if (!n.dispatch("verticalDrag", { panY: o }).defaultPrevented) {
        this._setPanWithFriction("y", o, Te);
        const a = 1 - Math.abs(this._getVerticalDragRatio(r.pan.y));
        n.applyBgOpacity(a), r.applyCurrentZoomPan();
      }
    } else
      this._panOrMoveMainScroll("x") || (this._panOrMoveMainScroll("y"), Vt(r.pan), r.applyCurrentZoomPan());
  }
  end() {
    const { pswp: t, velocity: e } = this.gestures, { mainScroll: i } = t;
    let n = 0;
    if (t.animations.stopAll(), i.isShifted()) {
      const o = (i.x - i.getCurrSlideX()) / t.viewportSize.x;
      e.x < -At && o < 0 || e.x < 0.1 && o < -0.5 ? (n = 1, e.x = Math.min(e.x, 0)) : (e.x > At && o > 0 || e.x > -0.1 && o > 0.5) && (n = -1, e.x = Math.max(e.x, 0)), i.moveIndexBy(n, !0, e.x);
    }
    t.currSlide.currZoomLevel > t.currSlide.zoomLevels.max || this.gestures.isMultitouch ? this.gestures.zoomLevels.correctZoomPan(!0) : (this._finishPanGestureForAxis("x"), this._finishPanGestureForAxis("y"));
  }
  _finishPanGestureForAxis(t) {
    const { pswp: e } = this, { currSlide: i } = e, { velocity: n } = this.gestures, { pan: r, bounds: o } = i, a = r[t], h = e.bgOpacity < 1 && t === "y", l = 0.995, p = a + Ie(n[t], l);
    if (h) {
      const L = this._getVerticalDragRatio(a), C = this._getVerticalDragRatio(p);
      if (L < 0 && C < -Lt || L > 0 && C > Lt) {
        e.close();
        return;
      }
    }
    const f = o.correctPan(t, p);
    if (a === f)
      return;
    const y = f === p ? 1 : 0.82, _ = e.bgOpacity, P = f - a;
    e.animations.startSpring({
      name: "panGesture" + t,
      isPan: !0,
      start: a,
      end: f,
      velocity: n[t],
      dampingRatio: y,
      onUpdate: (L) => {
        if (h && e.bgOpacity < 1) {
          const C = 1 - (f - L) / P;
          e.applyBgOpacity(at(
            _ + (1 - _) * C,
            0,
            1
          ));
        }
        r[t] = Math.floor(L), i.applyCurrentZoomPan();
      }
    });
  }
  _panOrMoveMainScroll(t) {
    const { p1: e, pswp: i, dragAxis: n, prevP1: r, isMultitouch: o } = this.gestures, { currSlide: a, mainScroll: h } = i, l = e[t] - r[t], p = h.x + l;
    if (!l)
      return;
    if (t === "x" && !a.isPannable() && !o)
      return h.moveTo(p, !0), !0;
    const { bounds: f } = a, y = a.pan[t] + l;
    if (i.options.allowPanToNext && n === "x" && t === "x" && !o) {
      const _ = h.getCurrSlideX(), P = h.x - _, L = l > 0, C = !L;
      if (y > f.min[t] && L) {
        if (f.min[t] <= this.startPan[t])
          return h.moveTo(p, !0), !0;
        this._setPanWithFriction(t, y);
      } else if (y < f.max[t] && C) {
        if (this.startPan[t] <= f.max[t])
          return h.moveTo(p, !0), !0;
        this._setPanWithFriction(t, y);
      } else if (P !== 0) {
        if (P > 0)
          return h.moveTo(Math.max(p, _), !0), !0;
        if (P < 0)
          return h.moveTo(Math.min(p, _), !0), !0;
      } else
        this._setPanWithFriction(t, y);
    } else
      t === "y" ? !h.isShifted() && f.min.y !== f.max.y && this._setPanWithFriction(t, y) : this._setPanWithFriction(t, y);
  }
  _getVerticalDragRatio(t) {
    return (t - this.pswp.currSlide.bounds.center.y) / (this.pswp.viewportSize.y / 3);
  }
  _setPanWithFriction(t, e, i) {
    const { pan: n, bounds: r } = this.pswp.currSlide;
    if (r.correctPan(t, e) !== e || i) {
      const a = Math.round(e - n[t]);
      n[t] += a * (i || Ee);
    } else
      n[t] = e;
  }
}
const Le = 0.05, Ae = 0.15;
function Ot(s, t, e) {
  return s.x = (t.x + e.x) / 2, s.y = (t.y + e.y) / 2, s;
}
class Oe {
  constructor(t) {
    this.gestures = t, this.pswp = this.gestures.pswp, this._startPan = {}, this._startZoomPoint = {}, this._zoomPoint = {};
  }
  start() {
    this._startZoomLevel = this.pswp.currSlide.currZoomLevel, O(this._startPan, this.pswp.currSlide.pan), this.pswp.animations.stopAllPan(), this._wasOverFitZoomLevel = !1;
  }
  change() {
    const { p1: t, startP1: e, p2: i, startP2: n, pswp: r } = this.gestures, { currSlide: o } = r, a = o.zoomLevels.min, h = o.zoomLevels.max;
    if (!o.isZoomable() || r.mainScroll.isShifted())
      return;
    Ot(this._startZoomPoint, e, n), Ot(this._zoomPoint, t, i);
    let l = 1 / wt(e, n) * wt(t, i) * this._startZoomLevel;
    if (l > o.zoomLevels.initial + o.zoomLevels.initial / 15 && (this._wasOverFitZoomLevel = !0), l < a)
      if (r.options.pinchToClose && !this._wasOverFitZoomLevel && this._startZoomLevel <= o.zoomLevels.initial) {
        const p = 1 - (a - l) / (a / 1.2);
        r.dispatch("pinchClose", { bgOpacity: p }).defaultPrevented || r.applyBgOpacity(p);
      } else
        l = a - (a - l) * Ae;
    else
      l > h && (l = h + (l - h) * Le);
    o.pan.x = this._calculatePanForZoomLevel("x", l), o.pan.y = this._calculatePanForZoomLevel("y", l), o.setZoomLevel(l), o.applyCurrentZoomPan();
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
    const n = i.currZoomLevel;
    let r, o = !0;
    n < i.zoomLevels.initial ? r = i.zoomLevels.initial : n > i.zoomLevels.max ? r = i.zoomLevels.max : (o = !1, r = n);
    const a = e.bgOpacity, h = e.bgOpacity < 1, l = O({}, i.pan);
    let p = O({}, l);
    t && (this._zoomPoint.x = 0, this._zoomPoint.y = 0, this._startZoomPoint.x = 0, this._startZoomPoint.y = 0, this._startZoomLevel = n, O(this._startPan, l)), o && (p = {
      x: this._calculatePanForZoomLevel("x", r),
      y: this._calculatePanForZoomLevel("y", r)
    }), i.setZoomLevel(r), p = {
      x: i.bounds.correctPan("x", p.x),
      y: i.bounds.correctPan("y", p.y)
    }, i.setZoomLevel(n);
    let f = !0;
    if (nt(p, l) && (f = !1), !f && !o && !h) {
      i._setResolution(r), i.applyCurrentZoomPan();
      return;
    }
    e.animations.stopAllPan(), e.animations.startSpring({
      isPan: !0,
      start: 0,
      end: 1e3,
      velocity: 0,
      dampingRatio: 1,
      naturalFrequency: 40,
      onUpdate: (y) => {
        if (y /= 1e3, f || o) {
          if (f && (i.pan.x = l.x + (p.x - l.x) * y, i.pan.y = l.y + (p.y - l.y) * y), o) {
            const _ = n + (r - n) * y;
            i.setZoomLevel(_);
          }
          i.applyCurrentZoomPan();
        }
        h && e.bgOpacity < 1 && e.applyBgOpacity(at(
          a + (1 - a) * y,
          0,
          1
        ));
      },
      onComplete: () => {
        i._setResolution(r), i.applyCurrentZoomPan();
      }
    });
  }
}
function kt(s) {
  return !!s.target.closest(".pswp__container");
}
class ke {
  constructor(t) {
    this.gestures = t;
  }
  click(t, e) {
    const i = e.target.classList, n = i.contains("pswp__img"), r = i.contains("pswp__item") || i.contains("pswp__zoom-wrap");
    n ? this._doClickOrTapAction("imageClick", t, e) : r && this._doClickOrTapAction("bgClick", t, e);
  }
  tap(t, e) {
    kt(e) && this._doClickOrTapAction("tap", t, e);
  }
  doubleTap(t, e) {
    kt(e) && this._doClickOrTapAction("doubleTap", t, e);
  }
  _doClickOrTapAction(t, e, i) {
    const { pswp: n } = this.gestures, { currSlide: r } = n, o = t + "Action", a = n.options[o];
    if (!n.dispatch(o, { point: e, originalEvent: i }).defaultPrevented) {
      if (typeof a == "function") {
        a.call(n, e, i);
        return;
      }
      switch (a) {
        case "close":
        case "next":
          n[a]();
          break;
        case "zoom":
          r.toggleZoom(e);
          break;
        case "zoom-or-close":
          r.isZoomable() && r.zoomLevels.secondary !== r.zoomLevels.initial ? r.toggleZoom(e) : n.options.clickToCloseNonZoomable && n.close();
          break;
        case "toggle-controls":
          this.gestures.pswp.element.classList.toggle("pswp--ui-visible");
          break;
      }
    }
  }
}
const xe = 10, ze = 300, De = 25;
class Me {
  constructor(t) {
    this.pswp = t, this.dragAxis = void 0, this.p1 = {}, this.p2 = {}, this.prevP1 = {}, this.prevP2 = {}, this.startP1 = {}, this.startP2 = {}, this.velocity = {}, this._lastStartP1 = {}, this._intervalP1 = {}, this._numActivePoints = 0, this._ongoingPointers = [], this._touchEventEnabled = "ontouchstart" in window, this._pointerEventEnabled = !!window.PointerEvent, this.supportsTouch = this._touchEventEnabled || this._pointerEventEnabled && navigator.maxTouchPoints > 1, this.supportsTouch || (t.options.allowPanToNext = !1), this.drag = new Ce(this), this.zoomLevels = new Oe(this), this.tapHandler = new ke(this), t.on("bindEvents", () => {
      t.events.add(t.scrollWrap, "click", (e) => this._onClick(e)), this._pointerEventEnabled ? this._bindEvents("pointer", "down", "up", "cancel") : this._touchEventEnabled ? (this._bindEvents("touch", "start", "end", "cancel"), t.scrollWrap.ontouchmove = () => {
      }, t.scrollWrap.ontouchend = () => {
      }) : this._bindEvents("mouse", "down", "up");
    });
  }
  _bindEvents(t, e, i, n) {
    const { pswp: r } = this, { events: o } = r, a = n ? t + n : "";
    o.add(r.scrollWrap, t + e, this.onPointerDown.bind(this)), o.add(window, t + "move", this.onPointerMove.bind(this)), o.add(window, t + i, this.onPointerUp.bind(this)), a && o.add(r.scrollWrap, a, this.onPointerUp.bind(this));
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
    i.dispatch("pointerDown", { originalEvent: t }).defaultPrevented || (e && (i.mouseDetected(), this._preventPointerEventBehaviour(t)), i.animations.stopAll(), this._updatePoints(t, "down"), this.pointerDown = !0, this._numActivePoints === 1 && (this.dragAxis = null, O(this.startP1, this.p1)), this._numActivePoints > 1 ? (this._clearTapTimer(), this.isMultitouch = !0) : this.isMultitouch = !1);
  }
  onPointerMove(t) {
    t.preventDefault(), this._numActivePoints && (this._updatePoints(t, "move"), !this.pswp.dispatch("pointerMove", { originalEvent: t }).defaultPrevented && (this._numActivePoints === 1 && !this.isDragging ? (this.dragAxis || this._calculateDragDirection(), this.dragAxis && !this.isDragging && (this.isZooming && (this.isZooming = !1, this.zoomLevels.end()), this.isDragging = !0, this._clearTapTimer(), this._updateStartPoints(), this._intervalTime = Date.now(), this._velocityCalculated = !1, O(this._intervalP1, this.p1), this.velocity.x = 0, this.velocity.y = 0, this.drag.start(), this._rafStopLoop(), this._rafRenderLoop())) : this._numActivePoints > 1 && !this.isZooming && (this._finishDrag(), this.isZooming = !0, this._updateStartPoints(), this.zoomLevels.start(), this._rafStopLoop(), this._rafRenderLoop())));
  }
  _finishDrag() {
    this.isDragging && (this.isDragging = !1, this._velocityCalculated || this._updateVelocity(!0), this.drag.end(), this.dragAxis = null);
  }
  onPointerUp(t) {
    !this._numActivePoints || (this._updatePoints(t, "up"), !this.pswp.dispatch("pointerUp", { originalEvent: t }).defaultPrevented && (this._numActivePoints === 0 && (this.pointerDown = !1, this._rafStopLoop(), this.isDragging ? this._finishDrag() : !this.isZooming && !this.isMultitouch && this._finishTap(t)), this._numActivePoints < 2 && this.isZooming && (this.isZooming = !1, this.zoomLevels.end(), this._numActivePoints === 1 && (this.dragAxis = null, this._updateStartPoints()))));
  }
  _rafRenderLoop() {
    (this.isDragging || this.isZooming) && (this._updateVelocity(), this.isDragging ? nt(this.p1, this.prevP1) || this.drag.change() : (!nt(this.p1, this.prevP1) || !nt(this.p2, this.prevP2)) && this.zoomLevels.change(), this._updatePrevPoints(), this.raf = requestAnimationFrame(this._rafRenderLoop.bind(this)));
  }
  _updateVelocity(t) {
    const e = Date.now(), i = e - this._intervalTime;
    i < 50 && !t || (this.velocity.x = this._getVelocity("x", i), this.velocity.y = this._getVelocity("y", i), this._intervalTime = e, O(this._intervalP1, this.p1), this._velocityCalculated = !0);
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
    const i = this.pswp.options.doubleTapAction ? ze : 0;
    this._tapTimer ? (this._clearTapTimer(), wt(this._lastStartP1, this.startP1) < De && this.tapHandler.doubleTap(this.startP1, t)) : (O(this._lastStartP1, this.startP1), this._tapTimer = setTimeout(() => {
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
      const i = t, n = this._ongoingPointers.findIndex((r) => r.id === i.pointerId);
      e === "up" && n > -1 ? this._ongoingPointers.splice(n, 1) : e === "down" && n === -1 ? this._ongoingPointers.push(this._convertEventPosToPoint(i, {})) : n > -1 && this._convertEventPosToPoint(i, this._ongoingPointers[n]), this._numActivePoints = this._ongoingPointers.length, this._numActivePoints > 0 && O(this.p1, this._ongoingPointers[0]), this._numActivePoints > 1 && O(this.p2, this._ongoingPointers[1]);
    } else {
      const i = t;
      this._numActivePoints = 0, i.type.indexOf("touch") > -1 ? i.touches && i.touches.length > 0 && (this._convertEventPosToPoint(i.touches[0], this.p1), this._numActivePoints++, i.touches.length > 1 && (this._convertEventPosToPoint(i.touches[1], this.p2), this._numActivePoints++)) : (this._convertEventPosToPoint(t, this.p1), e === "up" ? this._numActivePoints = 0 : this._numActivePoints++);
    }
  }
  _updatePrevPoints() {
    O(this.prevP1, this.p1), O(this.prevP2, this.p2);
  }
  _updateStartPoints() {
    O(this.startP1, this.p1), O(this.startP2, this.p2), this._updatePrevPoints();
  }
  _calculateDragDirection() {
    if (this.pswp.mainScroll.isShifted())
      this.dragAxis = "x";
    else {
      const t = Math.abs(this.p1.x - this.startP1.x) - Math.abs(this.p1.y - this.startP1.y);
      if (t !== 0) {
        const e = t > 0 ? "x" : "y";
        Math.abs(this.p1[e] - this.startP1[e]) >= xe && (this.dragAxis = e);
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
const Re = 0.35;
class Fe {
  constructor(t) {
    this.pswp = t, this.x = 0, this.slideWidth = void 0, this.itemHolders = void 0, this.resetPosition();
  }
  resize(t) {
    const { pswp: e } = this, i = Math.round(
      e.viewportSize.x + e.viewportSize.x * e.options.spacing
    ), n = i !== this.slideWidth;
    n && (this.slideWidth = i, this.moveTo(this.getCurrSlideX())), this.itemHolders.forEach((r, o) => {
      n && $(r.el, (o + this._containerShiftIndex) * this.slideWidth), t && r.slide && r.slide.resize();
    });
  }
  resetPosition() {
    this._currPositionIndex = 0, this._prevPositionIndex = 0, this.slideWidth = 0, this._containerShiftIndex = -1;
  }
  appendHolders() {
    this.itemHolders = [];
    for (let t = 0; t < 3; t++) {
      const e = M("pswp__item", !1, this.pswp.container);
      e.style.display = t === 1 ? "block" : "none", this.itemHolders.push({
        el: e
      });
    }
  }
  canBeSwiped() {
    return this.pswp.getNumItems() > 1;
  }
  moveIndexBy(t, e, i) {
    const { pswp: n } = this;
    let r = n.potentialIndex + t;
    const o = n.getNumItems();
    if (n.canLoop()) {
      r = n.getLoopedIndex(r);
      const h = (t + o) % o;
      h <= o / 2 ? t = h : t = h - o;
    } else
      r < 0 ? r = 0 : r >= o && (r = o - 1), t = r - n.potentialIndex;
    n.potentialIndex = r, this._currPositionIndex -= t, n.animations.stopMainScroll();
    const a = this.getCurrSlideX();
    if (!e)
      this.moveTo(a), this.updateCurrItem();
    else {
      n.animations.startSpring({
        isMainScroll: !0,
        start: this.x,
        end: a,
        velocity: i || 0,
        naturalFrequency: 30,
        dampingRatio: 1,
        onUpdate: (l) => {
          this.moveTo(l);
        },
        onComplete: () => {
          this.updateCurrItem(), n.appendHeavy();
        }
      });
      let h = n.potentialIndex - n.currIndex;
      if (n.canLoop()) {
        const l = (h + o) % o;
        l <= o / 2 ? h = l : h = l - o;
      }
      Math.abs(h) > 1 && this.updateCurrItem();
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
    let i = Math.abs(e), n;
    i >= 3 && (this._containerShiftIndex += e + (e > 0 ? -3 : 3), i = 3);
    for (let r = 0; r < i; r++)
      e > 0 ? (n = this.itemHolders.shift(), this.itemHolders[2] = n, this._containerShiftIndex++, $(n.el, (this._containerShiftIndex + 2) * this.slideWidth), t.setContent(n, t.currIndex - i + r + 2)) : (n = this.itemHolders.pop(), this.itemHolders.unshift(n), this._containerShiftIndex--, $(n.el, this._containerShiftIndex * this.slideWidth), t.setContent(n, t.currIndex + i - r - 2));
    Math.abs(this._containerShiftIndex) > 50 && !this.isShifted() && (this.resetPosition(), this.resize()), t.animations.stopAllPan(), this.itemHolders.forEach((r, o) => {
      r.slide && r.slide.setIsActive(o === 1);
    }), t.currSlide = this.itemHolders[1].slide, t.contentLoader.updateLazy(e), t.currSlide.applyCurrentZoomPan(), t.dispatch("change");
  }
  moveTo(t, e) {
    let i, n;
    !this.pswp.canLoop() && e && (i = (this.slideWidth * this._currPositionIndex - t) / this.slideWidth, i += this.pswp.currIndex, n = Math.round(t - this.x), (i < 0 && n > 0 || i >= this.pswp.getNumItems() - 1 && n < 0) && (t = this.x + n * Re)), this.x = t, $(this.pswp.container, t), this.pswp.dispatch("moveMainScroll", { x: t, dragging: e });
  }
}
class Ze {
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
    if (e.dispatch("keydown", { originalEvent: t }).defaultPrevented || we(t))
      return;
    let i, n, r;
    switch (t.keyCode) {
      case 27:
        e.options.escKey && (i = "close");
        break;
      case 90:
        i = "toggleZoom";
        break;
      case 37:
        n = "x";
        break;
      case 38:
        n = "y";
        break;
      case 39:
        n = "x", r = !0;
        break;
      case 40:
        r = !0, n = "y";
        break;
      case 9:
        this._focusRoot();
        break;
    }
    if (n) {
      t.preventDefault();
      const { currSlide: o } = e;
      e.options.arrowKeys && n === "x" && e.getNumItems() > 1 ? i = r ? "next" : "prev" : o && o.currZoomLevel > o.zoomLevels.fit && (o.pan[n] += r ? -80 : 80, o.panTo(o.pan.x, o.pan.y));
    }
    i && (t.preventDefault(), e[i]());
  }
  _onFocusIn(t) {
    const { template: e } = this.pswp;
    document !== t.target && e !== t.target && !e.contains(t.target) && e.focus();
  }
}
const Ne = "cubic-bezier(.4,0,.22,1)";
class Ve {
  constructor(t) {
    this.props = t;
    const {
      target: e,
      onComplete: i,
      transform: n,
      onFinish: r
    } = t;
    let {
      duration: o,
      easing: a
    } = t;
    this.onFinish = r;
    const h = n ? "transform" : "opacity", l = t[h];
    this._target = e, this._onComplete = i, o = o || 333, a = a || Ne, this._onTransitionEnd = this._onTransitionEnd.bind(this), this._helperTimeout = setTimeout(() => {
      Bt(e, h, o, a), this._helperTimeout = setTimeout(() => {
        e.addEventListener("transitionend", this._onTransitionEnd, !1), e.addEventListener("transitioncancel", this._onTransitionEnd, !1), this._helperTimeout = setTimeout(() => {
          this._finalizeAnimation();
        }, o + 500), e.style[h] = l;
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
    this._helperTimeout && clearTimeout(this._helperTimeout), ye(this._target), this._target.removeEventListener("transitionend", this._onTransitionEnd, !1), this._target.removeEventListener("transitioncancel", this._onTransitionEnd, !1), this._finished || this._finalizeAnimation();
  }
}
const Be = 12, We = 0.75;
class He {
  constructor(t, e, i) {
    this.velocity = t * 1e3, this._dampingRatio = e || We, this._naturalFrequency = i || Be, this._dampingRatio < 1 && (this._dampedFrequency = this._naturalFrequency * Math.sqrt(1 - this._dampingRatio * this._dampingRatio));
  }
  easeFrame(t, e) {
    let i = 0, n;
    e /= 1e3;
    const r = Math.E ** (-this._dampingRatio * this._naturalFrequency * e);
    if (this._dampingRatio === 1)
      n = this.velocity + this._naturalFrequency * t, i = (t + n * e) * r, this.velocity = i * -this._naturalFrequency + n * r;
    else if (this._dampingRatio < 1) {
      n = 1 / this._dampedFrequency * (this._dampingRatio * this._naturalFrequency * t + this.velocity);
      const o = Math.cos(this._dampedFrequency * e), a = Math.sin(this._dampedFrequency * e);
      i = r * (t * o + n * a), this.velocity = i * -this._naturalFrequency * this._dampingRatio + r * (-this._dampedFrequency * t * a + this._dampedFrequency * n * o);
    }
    return i;
  }
}
class je {
  constructor(t) {
    this.props = t;
    const {
      start: e,
      end: i,
      velocity: n,
      onUpdate: r,
      onComplete: o,
      onFinish: a,
      dampingRatio: h,
      naturalFrequency: l
    } = t;
    this.onFinish = a;
    const p = new He(n, h, l);
    let f = Date.now(), y = e - i;
    const _ = () => {
      this._raf && (y = p.easeFrame(y, Date.now() - f), Math.abs(y) < 1 && Math.abs(p.velocity) < 50 ? (r(i), o && o(), this.onFinish()) : (f = Date.now(), r(y + i), this._raf = requestAnimationFrame(_)));
    };
    this._raf = requestAnimationFrame(_);
  }
  destroy() {
    this._raf >= 0 && cancelAnimationFrame(this._raf), this._raf = null;
  }
}
class qe {
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
    return e ? i = new je(t) : i = new Ve(t), this.activeAnimations.push(i), i.onFinish = () => this.stop(i), i;
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
class Ue {
  constructor(t) {
    this.pswp = t, t.events.add(t.element, "wheel", this._onWheel.bind(this));
  }
  _onWheel(t) {
    t.preventDefault();
    const { currSlide: e } = this.pswp;
    let { deltaX: i, deltaY: n } = t;
    if (!!e && !this.pswp.dispatch("wheel", { originalEvent: t }).defaultPrevented)
      if (t.ctrlKey || this.pswp.options.wheelToZoom) {
        if (e.isZoomable()) {
          let r = -n;
          t.deltaMode === 1 ? r *= 0.05 : r *= t.deltaMode ? 1 : 2e-3, r = 2 ** r;
          const o = e.currZoomLevel * r;
          e.zoomTo(o, {
            x: t.clientX,
            y: t.clientY
          });
        }
      } else
        e.isPannable() && (t.deltaMode === 1 && (i *= 18, n *= 18), e.panTo(
          e.pan.x - i,
          e.pan.y - n
        ));
  }
}
function $e(s) {
  if (typeof s == "string")
    return s;
  if (!s || !s.isCustomSVG)
    return "";
  const t = s;
  let e = '<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 %d %d" width="%d" height="%d">';
  return e = e.split("%d").join(t.size || 32), t.outlineID && (e += '<use class="pswp__icn-shadow" xlink:href="#' + t.outlineID + '"/>'), e += t.inner, e += "</svg>", e;
}
class Ge {
  constructor(t, e) {
    const i = e.name || e.className;
    let n = e.html;
    if (t.options[i] === !1)
      return;
    typeof t.options[i + "SVG"] == "string" && (n = t.options[i + "SVG"]), t.dispatch("uiElementCreate", { data: e });
    let r = "";
    e.isButton ? (r += "pswp__button ", r += e.className || `pswp__button--${e.name}`) : r += e.className || `pswp__${e.name}`;
    let o, a = e.isButton ? e.tagName || "button" : e.tagName || "div";
    if (a = a.toLowerCase(), o = M(r, a), e.isButton) {
      o = M(r, a), a === "button" && (o.type = "button");
      let { title: p } = e;
      const { ariaLabel: f } = e;
      typeof t.options[i + "Title"] == "string" && (p = t.options[i + "Title"]), p && (o.title = p), (f || p) && o.setAttribute("aria-label", f || p);
    }
    o.innerHTML = $e(n), e.onInit && e.onInit(o, t), e.onClick && (o.onclick = (p) => {
      typeof e.onClick == "string" ? t[e.onClick]() : e.onClick(p, o, t);
    });
    const h = e.appendTo || "bar";
    let l;
    h === "bar" ? (t.topBar || (t.topBar = M("pswp__top-bar pswp__hide-on-close", "div", t.scrollWrap)), l = t.topBar) : (o.classList.add("pswp__hide-on-close"), h === "wrapper" ? l = t.scrollWrap : l = t.element), l.appendChild(t.applyFilters("uiElement", o, e));
  }
}
function Ut(s, t, e) {
  s.classList.add("pswp__button--arrow"), t.on("change", () => {
    t.options.loop || (e ? s.disabled = !(t.currIndex < t.getNumItems() - 1) : s.disabled = !(t.currIndex > 0));
  });
}
const Ye = {
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
  onInit: Ut
}, Xe = {
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
  onInit: (s, t) => {
    Ut(s, t, !0);
  }
}, Ke = {
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
}, Qe = {
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
}, Je = {
  name: "preloader",
  appendTo: "bar",
  order: 7,
  html: {
    isCustomSVG: !0,
    inner: '<path fill-rule="evenodd" clip-rule="evenodd" d="M21.2 16a5.2 5.2 0 1 1-5.2-5.2V8a8 8 0 1 0 8 8h-2.8Z" id="pswp__icn-loading"/>',
    outlineID: "pswp__icn-loading"
  },
  onInit: (s, t) => {
    let e, i;
    const n = (a, h) => {
      s.classList[h ? "add" : "remove"]("pswp__preloader--" + a);
    }, r = (a) => {
      e !== a && (e = a, n("active", a));
    }, o = () => {
      if (!t.currSlide.content.isLoading()) {
        r(!1), i && (clearTimeout(i), i = null);
        return;
      }
      i || (i = setTimeout(() => {
        r(t.currSlide.content.isLoading()), i = null;
      }, t.options.preloaderDelay));
    };
    t.on("change", o), t.on("loadComplete", (a) => {
      t.currSlide === a.slide && o();
    }), t.ui.updatePreloaderVisibility = o;
  }
}, ti = {
  name: "counter",
  order: 5,
  onInit: (s, t) => {
    t.on("change", () => {
      s.innerText = t.currIndex + 1 + t.options.indexIndicatorSep + t.getNumItems();
    });
  }
};
function xt(s, t) {
  s.classList[t ? "add" : "remove"]("pswp--zoomed-in");
}
class ei {
  constructor(t) {
    this.pswp = t, this.updatePreloaderVisibility = void 0, this._lastUpdatedZoomLevel = void 0;
  }
  init() {
    const { pswp: t } = this;
    this.isRegistered = !1, this.uiElementsData = [
      Ke,
      Ye,
      Xe,
      Qe,
      Je,
      ti
    ], t.dispatch("uiRegister"), this.uiElementsData.sort((e, i) => (e.order || 0) - (i.order || 0)), this.items = [], this.isRegistered = !0, this.uiElementsData.forEach((e) => {
      this.registerElement(e);
    }), t.on("change", () => {
      t.element.classList[t.getNumItems() === 1 ? "add" : "remove"]("pswp--one-slide");
    }), t.on("zoomPanUpdate", () => this._onZoomPanUpdate());
  }
  registerElement(t) {
    this.isRegistered ? this.items.push(
      new Ge(this.pswp, t)
    ) : this.uiElementsData.push(t);
  }
  _onZoomPanUpdate() {
    const { template: t, currSlide: e, options: i } = this.pswp;
    let { currZoomLevel: n } = e;
    if (this.pswp.opener.isClosing || (this.pswp.opener.isOpen || (n = e.zoomLevels.initial), n === this._lastUpdatedZoomLevel))
      return;
    this._lastUpdatedZoomLevel = n;
    const r = e.zoomLevels.initial - e.zoomLevels.secondary;
    if (Math.abs(r) < 0.01 || !e.isZoomable()) {
      xt(t, !1), t.classList.remove("pswp--zoom-allowed");
      return;
    }
    t.classList.add("pswp--zoom-allowed");
    const o = n === e.zoomLevels.initial ? e.zoomLevels.secondary : e.zoomLevels.initial;
    xt(t, o <= n), (i.imageClickAction === "zoom" || i.imageClickAction === "zoom-or-close") && t.classList.add("pswp--click-to-zoom");
  }
}
function ii(s) {
  const t = s.getBoundingClientRect();
  return {
    x: t.left,
    y: t.top,
    w: t.width
  };
}
function ni(s, t, e) {
  const i = s.getBoundingClientRect(), n = i.width / t, r = i.height / e, o = n > r ? n : r, a = (i.width - t * o) / 2, h = (i.height - e * o) / 2, l = {
    x: i.left + a,
    y: i.top + h,
    w: t * o
  };
  return l.innerRect = {
    w: i.width,
    h: i.height,
    x: a,
    y: h
  }, l;
}
function si(s, t, e) {
  const i = e.dispatch("thumbBounds", {
    index: s,
    itemData: t,
    instance: e
  });
  if (i.thumbBounds)
    return i.thumbBounds;
  const { element: n } = t;
  let r, o;
  if (n && e.options.thumbSelector !== !1) {
    const a = e.options.thumbSelector || "img";
    o = n.matches(a) ? n : n.querySelector(a);
  }
  return o = e.applyFilters("thumbEl", o, t, s), o && (t.thumbCropped ? r = ni(
    o,
    t.width || t.w,
    t.height || t.h
  ) : r = ii(o)), e.applyFilters("thumbBounds", r, t, s);
}
class ri {
  constructor(t, e) {
    this.type = t, e && Object.assign(this, e);
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
}
class oi {
  constructor() {
    this._listeners = {}, this._filters = {}, this.pswp = void 0, this.options = void 0;
  }
  addFilter(t, e, i = 100) {
    this._filters[t] || (this._filters[t] = []), this._filters[t].push({ fn: e, priority: i }), this._filters[t].sort((n, r) => n.priority - r.priority), this.pswp && this.pswp.addFilter(t, e, i);
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
    const i = new ri(t, e);
    return this._listeners && this._listeners[t] && this._listeners[t].forEach((n) => {
      n.call(this, i);
    }), i;
  }
}
class ai {
  constructor(t, e) {
    this.element = M(
      "pswp__img pswp__img--placeholder",
      t ? "img" : "",
      e
    ), t && (this.element.decoding = "async", this.element.alt = "", this.element.src = t, this.element.setAttribute("role", "presentation")), this.element.setAttribute("aria-hiden", "true");
  }
  setDisplayedSize(t, e) {
    !this.element || (this.element.tagName === "IMG" ? (_t(this.element, 250, "auto"), this.element.style.transformOrigin = "0 0", this.element.style.transform = st(0, 0, t / 250)) : _t(this.element, t, e));
  }
  destroy() {
    this.element.parentNode && this.element.remove(), this.element = null;
  }
}
class li {
  constructor(t, e, i) {
    this.instance = e, this.data = t, this.index = i, this.element = void 0, this.displayedImageWidth = 0, this.displayedImageHeight = 0, this.width = Number(this.data.w) || Number(this.data.width) || 0, this.height = Number(this.data.h) || Number(this.data.height) || 0, this.isAttached = !1, this.hasSlide = !1, this.state = B.IDLE, this.data.type ? this.type = this.data.type : this.data.src ? this.type = "image" : this.type = "html", this.instance.dispatch("contentInit", { content: this });
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
        this.placeholder = new ai(
          i,
          this.slide.container
        );
      }
    this.element && !e || this.instance.dispatch("contentLoad", { content: this, isLazy: t }).defaultPrevented || (this.isImageContent() ? (this.element = M("pswp__img", "img"), this.displayedImageWidth && this.loadImage(t)) : (this.element = M("pswp__content"), this.element.innerHTML = this.data.html || ""), e && this.slide && this.slide.updateContentSize(!0));
  }
  loadImage(t) {
    const e = this.element;
    this.instance.dispatch("contentLoadImage", { content: this, isLazy: t }).defaultPrevented || (this.updateSrcsetSizes(), this.data.srcset && (e.srcset = this.data.srcset), e.src = this.data.src, e.alt = this.data.alt || "", this.state = B.LOADING, e.complete ? this.onLoaded() : (e.onload = () => {
      this.onLoaded();
    }, e.onerror = () => {
      this.onError();
    }));
  }
  setSlide(t) {
    this.slide = t, this.hasSlide = !0, this.instance = t.pswp;
  }
  onLoaded() {
    this.state = B.LOADED, this.slide && (this.instance.dispatch("loadComplete", { slide: this.slide, content: this }), this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode && (this.append(), this.slide.updateContentSize(!0)), (this.state === B.LOADED || this.state === B.ERROR) && this.removePlaceholder());
  }
  onError() {
    this.state = B.ERROR, this.slide && (this.displayError(), this.instance.dispatch("loadComplete", { slide: this.slide, isError: !0, content: this }), this.instance.dispatch("loadError", { slide: this.slide, content: this }));
  }
  isLoading() {
    return this.instance.applyFilters(
      "isContentLoading",
      this.state === B.LOADING,
      this
    );
  }
  isError() {
    return this.state === B.ERROR;
  }
  isImageContent() {
    return this.type === "image";
  }
  setDisplayedSize(t, e) {
    if (!!this.element && (this.placeholder && this.placeholder.setDisplayedSize(t, e), !this.instance.dispatch("contentResize", { content: this, width: t, height: e }).defaultPrevented && (_t(this.element, t, e), this.isImageContent() && !this.isError()))) {
      const i = !this.displayedImageWidth && t;
      this.displayedImageWidth = t, this.displayedImageHeight = e, i ? this.loadImage(!1) : this.updateSrcsetSizes(), this.slide && this.instance.dispatch("imageSizeChange", { slide: this.slide, width: t, height: e, content: this });
    }
  }
  isZoomable() {
    return this.instance.applyFilters(
      "isContentZoomable",
      this.isImageContent() && this.state !== B.ERROR,
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
      let t = M("pswp__error-msg");
      t.innerText = this.instance.options.errorMsg, t = this.instance.applyFilters(
        "contentErrorElement",
        t,
        this
      ), this.element = M("pswp__content pswp__error-msg-container"), this.element.appendChild(t), this.slide.container.innerText = "", this.slide.container.appendChild(this.element), this.slide.updateContentSize(!0), this.removePlaceholder();
    }
  }
  append() {
    if (this.isAttached)
      return;
    if (this.isAttached = !0, this.state === B.ERROR) {
      this.displayError();
      return;
    }
    if (this.instance.dispatch("contentAppend", { content: this }).defaultPrevented)
      return;
    const t = "decode" in this.element;
    this.isImageContent() ? t && this.slide && (!this.slide.isActive || It()) ? (this.isDecoding = !0, this.element.decode().finally(() => {
      this.isDecoding = !1, this.appendImage();
    })) : this.appendImage() : this.element && !this.element.parentNode && this.slide.container.appendChild(this.element);
  }
  activate() {
    this.instance.dispatch("contentActivate", { content: this }).defaultPrevented || this.slide && (this.isImageContent() && this.isDecoding && !It() ? this.appendImage() : this.isError() && this.load(!1, !0));
  }
  deactivate() {
    this.instance.dispatch("contentDeactivate", { content: this });
  }
  remove() {
    this.isAttached = !1, !this.instance.dispatch("contentRemove", { content: this }).defaultPrevented && (this.element && this.element.parentNode && this.element.remove(), this.placeholder && this.placeholder.element && this.placeholder.element.remove());
  }
  appendImage() {
    !this.isAttached || this.instance.dispatch("contentAppendImage", { content: this }).defaultPrevented || (this.slide && this.element && !this.element.parentNode && this.slide.container.appendChild(this.element), (this.state === B.LOADED || this.state === B.ERROR) && this.removePlaceholder());
  }
}
const hi = 5;
function $t(s, t, e) {
  const i = t.createContentFromData(s, e);
  if (!i || !i.lazyLoad)
    return;
  const { options: n } = t, r = t.viewportSize || Ht(n, t), o = jt(n, r, s, e), a = new qt(n, s, -1);
  return a.update(i.width, i.height, o), i.lazyLoad(), i.setDisplayedSize(
    Math.ceil(i.width * a.initial),
    Math.ceil(i.height * a.initial)
  ), i;
}
function ci(s, t) {
  const e = t.getItemData(s);
  if (!t.dispatch("lazyLoadSlide", { index: s, itemData: e }).defaultPrevented)
    return $t(e, t, s);
}
class ui {
  constructor(t) {
    this.pswp = t, this.limit = Math.max(
      t.options.preload[0] + t.options.preload[1] + 1,
      hi
    ), this._cachedItems = [];
  }
  updateLazy(t) {
    const { pswp: e } = this;
    if (e.dispatch("lazyLoad").defaultPrevented)
      return;
    const { preload: i } = e.options, n = t === void 0 ? !0 : t >= 0;
    let r;
    for (r = 0; r <= i[1]; r++)
      this.loadSlideByIndex(e.currIndex + (n ? r : -r));
    for (r = 1; r <= i[0]; r++)
      this.loadSlideByIndex(e.currIndex + (n ? -r : r));
  }
  loadSlideByIndex(t) {
    t = this.pswp.getLoopedIndex(t);
    let e = this.getContentByIndex(t);
    e || (e = ci(t, this.pswp), e && this.addToCache(e));
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
class di extends oi {
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
    return new li(t, this, e);
  }
  getItemData(t) {
    const { dataSource: e } = this.options;
    let i;
    Array.isArray(e) ? i = e[t] : e && e.gallery && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), i = e.items[t]);
    let n = i;
    n instanceof Element && (n = this._domElementToItemData(n));
    const r = this.dispatch("itemData", {
      itemData: n || {},
      index: t
    });
    return this.applyFilters("itemData", r.itemData, t);
  }
  _getGalleryDOMElements(t) {
    return this.options.children || this.options.childSelector ? _e(
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
      const n = t.querySelector("img");
      n && (e.msrc = n.currentSrc || n.src, e.alt = n.getAttribute("alt")), (i.dataset.pswpCropped || i.dataset.cropped) && (e.thumbCropped = !0);
    }
    return this.applyFilters("domItemData", e, t, i);
  }
  lazyLoadData(t, e) {
    return $t(t, this, e);
  }
}
const J = 3e-3;
class pi {
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
    if (i.showHideAnimationType === "fade" ? (i.showHideOpacity = !0, this._thumbBounds = !1) : i.showHideAnimationType === "none" ? (i.showHideOpacity = !1, this._duration = 0, this._thumbBounds = !1) : this.isOpening && t._initialThumbBounds ? this._thumbBounds = t._initialThumbBounds : this._thumbBounds = this.pswp.getThumbBounds(), this._placeholder = e.getPlaceholderElement(), t.animations.stopAll(), this._useAnimation = this._duration > 50, this._animateZoom = Boolean(this._thumbBounds) && e.content && e.content.usePlaceholder() && (!this.isClosing || !t.mainScroll.isShifted()), this._animateZoom ? this._animateRootOpacity = i.showHideOpacity : (this._animateRootOpacity = !0, this.isOpening && (e.zoomAndPanToInitial(), e.applyCurrentZoomPan())), this._animateBgOpacity = !this._animateRootOpacity && this.pswp.options.bgOpacity > J, this._opacityElement = this._animateRootOpacity ? t.element : t.bg, !this._useAnimation) {
      this._duration = 0, this._animateZoom = !1, this._animateBgOpacity = !1, this._animateRootOpacity = !0, this.isOpening && (t.element.style.opacity = String(J), t.applyBgOpacity(1));
      return;
    }
    this._animateZoom && this._thumbBounds && this._thumbBounds.innerRect ? (this._croppedZoom = !0, this._cropContainer1 = this.pswp.container, this._cropContainer2 = this.pswp.currSlide.holderElement, t.container.style.overflow = "hidden", t.container.style.width = t.viewportSize.x + "px") : this._croppedZoom = !1, this.isOpening ? (this._animateRootOpacity ? (t.element.style.opacity = String(J), t.applyBgOpacity(1)) : (this._animateBgOpacity && (t.bg.style.opacity = String(J)), t.element.style.opacity = "1"), this._animateZoom && (this._setClosedStateZoomPan(), this._placeholder && (this._placeholder.style.willChange = "transform", this._placeholder.style.opacity = String(J)))) : this.isClosing && (t.mainScroll.itemHolders[0].el.style.display = "none", t.mainScroll.itemHolders[2].el.style.display = "none", this._croppedZoom && t.mainScroll.x !== 0 && (t.mainScroll.resetPosition(), t.mainScroll.resize()));
  }
  _start() {
    this.isOpening && this._useAnimation && this._placeholder && this._placeholder.tagName === "IMG" ? new Promise((t) => {
      let e = !1, i = !0;
      ve(this._placeholder).finally(() => {
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
    const { pswp: e } = this, { innerRect: i } = this._thumbBounds, { currSlide: n, viewportSize: r } = e;
    if (this._croppedZoom) {
      const o = -r.x + (this._thumbBounds.x - i.x) + i.w, a = -r.y + (this._thumbBounds.y - i.y) + i.h, h = r.x - i.w, l = r.y - i.h;
      t ? (this._animateTo(
        this._cropContainer1,
        "transform",
        st(o, a)
      ), this._animateTo(
        this._cropContainer2,
        "transform",
        st(h, l)
      )) : ($(this._cropContainer1, o, a), $(this._cropContainer2, h, l));
    }
    O(n.pan, i || this._thumbBounds), n.currZoomLevel = this._thumbBounds.w / n.width, t ? this._animateTo(n.container, "transform", n.getCurrentTransform()) : n.applyCurrentZoomPan();
  }
  _animateTo(t, e, i) {
    if (!this._duration) {
      t.style[e] = i;
      return;
    }
    const { animations: n } = this.pswp, r = {
      duration: this._duration,
      easing: this.pswp.options.easing,
      onComplete: () => {
        n.activeAnimations.length || this._onAnimationComplete();
      },
      target: t
    };
    r[e] = i, n.startTransition(r);
  }
}
const fi = {
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
class mi extends di {
  constructor(t) {
    super(), this._prepareOptions(t), this.offset = {}, this._prevViewportSize = {}, this.viewportSize = {}, this.bgOpacity = 1, this.topBar = void 0, this.events = new Pe(), this.animations = new qe(), this.mainScroll = new Fe(this), this.gestures = new Me(this), this.opener = new pi(this), this.keyboard = new Ze(this), this.contentLoader = new ui(this);
  }
  init() {
    if (this.isOpen || this.isDestroying)
      return;
    this.isOpen = !0, this.dispatch("init"), this.dispatch("beforeOpen"), this._createMainStructure();
    let t = "pswp--open";
    return this.gestures.supportsTouch && (t += " pswp--touch"), this.options.mainClass && (t += " " + this.options.mainClass), this.element.className += " " + t, this.currIndex = this.options.index || 0, this.potentialIndex = this.currIndex, this.dispatch("firstUpdate"), this.scrollWheel = new Ue(this), (Number.isNaN(this.currIndex) || this.currIndex < 0 || this.currIndex >= this.getNumItems()) && (this.currIndex = 0), this.gestures.supportsTouch || this.mouseDetected(), this.updateSize(), this.offset.y = window.pageYOffset, this._initialItemData = this.getItemData(this.currIndex), this.dispatch("gettingData", {
      index: this.currIndex,
      data: this._initialItemData,
      slide: void 0
    }), this._initialThumbBounds = this.getThumbBounds(), this.dispatch("initialLayout"), this.on("openingAnimationEnd", () => {
      this.mainScroll.itemHolders[0].el.style.display = "block", this.mainScroll.itemHolders[2].el.style.display = "block", this.setContent(this.mainScroll.itemHolders[0], this.currIndex - 1), this.setContent(this.mainScroll.itemHolders[2], this.currIndex + 1), this.appendHeavy(), this.contentLoader.updateLazy(), this.events.add(window, "resize", this._handlePageResize.bind(this)), this.events.add(window, "scroll", this._updatePageScrollOffset.bind(this)), this.dispatch("bindEvents");
    }), this.setContent(this.mainScroll.itemHolders[1], this.currIndex), this.dispatch("change"), this.opener.open(), this.dispatch("afterInit"), !0;
  }
  getLoopedIndex(t) {
    const e = this.getNumItems();
    return this.options.loop && (t > e - 1 && (t -= e), t < 0 && (t += e)), t = at(t, 0, e - 1), t;
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
      let n = this.currSlide.index - 1 + i;
      this.canLoop() && (n = this.getLoopedIndex(n)), n === t && (this.setContent(e, t, !0), i === 1 && (this.currSlide = e.slide, e.slide.setIsActive(!0)));
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
    const n = this.getItemData(e);
    t.slide = new Se(n, e, this), e === this.currIndex && (this.currSlide = t.slide), t.slide.append(t.el);
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
    const e = Ht(this.options, this);
    !t && nt(e, this._prevViewportSize) || (O(this._prevViewportSize, e), this.dispatch("beforeResize"), O(this.viewportSize, this._prevViewportSize), this._updatePageScrollOffset(), this.dispatch("viewportSize"), this.mainScroll.resize(this.opener.isOpen), !this.hasMouse && window.matchMedia("(any-hover: hover)").matches && this.mouseDetected(), this.dispatch("resize"));
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
    this.element = M("pswp"), this.element.setAttribute("tabindex", "-1"), this.element.setAttribute("role", "dialog"), this.template = this.element, this.bg = M("pswp__bg", !1, this.element), this.scrollWrap = M("pswp__scroll-wrap", !1, this.element), this.container = M("pswp__container", !1, this.scrollWrap), this.mainScroll.appendHolders(), this.ui = new ei(this), this.ui.init(), (this.options.appendToEl || document.body).appendChild(this.element);
  }
  getThumbBounds() {
    return si(
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
      ...fi,
      ...t
    };
  }
}
/*! @vimeo/player v2.20.1 | (c) 2023 Vimeo | MIT License | https://github.com/vimeo/player.js */
function zt(s, t) {
  var e = Object.keys(s);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(s);
    t && (i = i.filter(function(n) {
      return Object.getOwnPropertyDescriptor(s, n).enumerable;
    })), e.push.apply(e, i);
  }
  return e;
}
function Dt(s) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? zt(Object(e), !0).forEach(function(i) {
      ct(s, i, e[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(s, Object.getOwnPropertyDescriptors(e)) : zt(Object(e)).forEach(function(i) {
      Object.defineProperty(s, i, Object.getOwnPropertyDescriptor(e, i));
    });
  }
  return s;
}
function z() {
  z = function() {
    return s;
  };
  var s = {}, t = Object.prototype, e = t.hasOwnProperty, i = Object.defineProperty || function(u, c, d) {
    u[c] = d.value;
  }, n = typeof Symbol == "function" ? Symbol : {}, r = n.iterator || "@@iterator", o = n.asyncIterator || "@@asyncIterator", a = n.toStringTag || "@@toStringTag";
  function h(u, c, d) {
    return Object.defineProperty(u, c, {
      value: d,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), u[c];
  }
  try {
    h({}, "");
  } catch {
    h = function(c, d, E) {
      return c[d] = E;
    };
  }
  function l(u, c, d, E) {
    var w = c && c.prototype instanceof y ? c : y, I = Object.create(w.prototype), k = new R(E || []);
    return i(I, "_invoke", {
      value: S(u, d, k)
    }), I;
  }
  function p(u, c, d) {
    try {
      return {
        type: "normal",
        arg: u.call(c, d)
      };
    } catch (E) {
      return {
        type: "throw",
        arg: E
      };
    }
  }
  s.wrap = l;
  var f = {};
  function y() {
  }
  function _() {
  }
  function P() {
  }
  var L = {};
  h(L, r, function() {
    return this;
  });
  var C = Object.getPrototypeOf, x = C && C(C(N([])));
  x && x !== t && e.call(x, r) && (L = x);
  var v = P.prototype = y.prototype = Object.create(L);
  function m(u) {
    ["next", "throw", "return"].forEach(function(c) {
      h(u, c, function(d) {
        return this._invoke(c, d);
      });
    });
  }
  function g(u, c) {
    function d(w, I, k, F) {
      var Z = p(u[w], u, I);
      if (Z.type !== "throw") {
        var Y = Z.arg, Q = Y.value;
        return Q && typeof Q == "object" && e.call(Q, "__await") ? c.resolve(Q.__await).then(function(j) {
          d("next", j, k, F);
        }, function(j) {
          d("throw", j, k, F);
        }) : c.resolve(Q).then(function(j) {
          Y.value = j, k(Y);
        }, function(j) {
          return d("throw", j, k, F);
        });
      }
      F(Z.arg);
    }
    var E;
    i(this, "_invoke", {
      value: function(w, I) {
        function k() {
          return new c(function(F, Z) {
            d(w, I, F, Z);
          });
        }
        return E = E ? E.then(k, k) : k();
      }
    });
  }
  function S(u, c, d) {
    var E = "suspendedStart";
    return function(w, I) {
      if (E === "executing")
        throw new Error("Generator is already running");
      if (E === "completed") {
        if (w === "throw")
          throw I;
        return gt();
      }
      for (d.method = w, d.arg = I; ; ) {
        var k = d.delegate;
        if (k) {
          var F = T(k, d);
          if (F) {
            if (F === f)
              continue;
            return F;
          }
        }
        if (d.method === "next")
          d.sent = d._sent = d.arg;
        else if (d.method === "throw") {
          if (E === "suspendedStart")
            throw E = "completed", d.arg;
          d.dispatchException(d.arg);
        } else
          d.method === "return" && d.abrupt("return", d.arg);
        E = "executing";
        var Z = p(u, c, d);
        if (Z.type === "normal") {
          if (E = d.done ? "completed" : "suspendedYield", Z.arg === f)
            continue;
          return {
            value: Z.arg,
            done: d.done
          };
        }
        Z.type === "throw" && (E = "completed", d.method = "throw", d.arg = Z.arg);
      }
    };
  }
  function T(u, c) {
    var d = c.method, E = u.iterator[d];
    if (E === void 0)
      return c.delegate = null, d === "throw" && u.iterator.return && (c.method = "return", c.arg = void 0, T(u, c), c.method === "throw") || d !== "return" && (c.method = "throw", c.arg = new TypeError("The iterator does not provide a '" + d + "' method")), f;
    var w = p(E, u.iterator, c.arg);
    if (w.type === "throw")
      return c.method = "throw", c.arg = w.arg, c.delegate = null, f;
    var I = w.arg;
    return I ? I.done ? (c[u.resultName] = I.value, c.next = u.nextLoc, c.method !== "return" && (c.method = "next", c.arg = void 0), c.delegate = null, f) : I : (c.method = "throw", c.arg = new TypeError("iterator result is not an object"), c.delegate = null, f);
  }
  function A(u) {
    var c = {
      tryLoc: u[0]
    };
    1 in u && (c.catchLoc = u[1]), 2 in u && (c.finallyLoc = u[2], c.afterLoc = u[3]), this.tryEntries.push(c);
  }
  function b(u) {
    var c = u.completion || {};
    c.type = "normal", delete c.arg, u.completion = c;
  }
  function R(u) {
    this.tryEntries = [{
      tryLoc: "root"
    }], u.forEach(A, this), this.reset(!0);
  }
  function N(u) {
    if (u) {
      var c = u[r];
      if (c)
        return c.call(u);
      if (typeof u.next == "function")
        return u;
      if (!isNaN(u.length)) {
        var d = -1, E = function w() {
          for (; ++d < u.length; )
            if (e.call(u, d))
              return w.value = u[d], w.done = !1, w;
          return w.value = void 0, w.done = !0, w;
        };
        return E.next = E;
      }
    }
    return {
      next: gt
    };
  }
  function gt() {
    return {
      value: void 0,
      done: !0
    };
  }
  return _.prototype = P, i(v, "constructor", {
    value: P,
    configurable: !0
  }), i(P, "constructor", {
    value: _,
    configurable: !0
  }), _.displayName = h(P, a, "GeneratorFunction"), s.isGeneratorFunction = function(u) {
    var c = typeof u == "function" && u.constructor;
    return !!c && (c === _ || (c.displayName || c.name) === "GeneratorFunction");
  }, s.mark = function(u) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(u, P) : (u.__proto__ = P, h(u, a, "GeneratorFunction")), u.prototype = Object.create(v), u;
  }, s.awrap = function(u) {
    return {
      __await: u
    };
  }, m(g.prototype), h(g.prototype, o, function() {
    return this;
  }), s.AsyncIterator = g, s.async = function(u, c, d, E, w) {
    w === void 0 && (w = Promise);
    var I = new g(l(u, c, d, E), w);
    return s.isGeneratorFunction(c) ? I : I.next().then(function(k) {
      return k.done ? k.value : I.next();
    });
  }, m(v), h(v, a, "Generator"), h(v, r, function() {
    return this;
  }), h(v, "toString", function() {
    return "[object Generator]";
  }), s.keys = function(u) {
    var c = Object(u), d = [];
    for (var E in c)
      d.push(E);
    return d.reverse(), function w() {
      for (; d.length; ) {
        var I = d.pop();
        if (I in c)
          return w.value = I, w.done = !1, w;
      }
      return w.done = !0, w;
    };
  }, s.values = N, R.prototype = {
    constructor: R,
    reset: function(u) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(b), !u)
        for (var c in this)
          c.charAt(0) === "t" && e.call(this, c) && !isNaN(+c.slice(1)) && (this[c] = void 0);
    },
    stop: function() {
      this.done = !0;
      var u = this.tryEntries[0].completion;
      if (u.type === "throw")
        throw u.arg;
      return this.rval;
    },
    dispatchException: function(u) {
      if (this.done)
        throw u;
      var c = this;
      function d(Z, Y) {
        return I.type = "throw", I.arg = u, c.next = Z, Y && (c.method = "next", c.arg = void 0), !!Y;
      }
      for (var E = this.tryEntries.length - 1; E >= 0; --E) {
        var w = this.tryEntries[E], I = w.completion;
        if (w.tryLoc === "root")
          return d("end");
        if (w.tryLoc <= this.prev) {
          var k = e.call(w, "catchLoc"), F = e.call(w, "finallyLoc");
          if (k && F) {
            if (this.prev < w.catchLoc)
              return d(w.catchLoc, !0);
            if (this.prev < w.finallyLoc)
              return d(w.finallyLoc);
          } else if (k) {
            if (this.prev < w.catchLoc)
              return d(w.catchLoc, !0);
          } else {
            if (!F)
              throw new Error("try statement without catch or finally");
            if (this.prev < w.finallyLoc)
              return d(w.finallyLoc);
          }
        }
      }
    },
    abrupt: function(u, c) {
      for (var d = this.tryEntries.length - 1; d >= 0; --d) {
        var E = this.tryEntries[d];
        if (E.tryLoc <= this.prev && e.call(E, "finallyLoc") && this.prev < E.finallyLoc) {
          var w = E;
          break;
        }
      }
      w && (u === "break" || u === "continue") && w.tryLoc <= c && c <= w.finallyLoc && (w = null);
      var I = w ? w.completion : {};
      return I.type = u, I.arg = c, w ? (this.method = "next", this.next = w.finallyLoc, f) : this.complete(I);
    },
    complete: function(u, c) {
      if (u.type === "throw")
        throw u.arg;
      return u.type === "break" || u.type === "continue" ? this.next = u.arg : u.type === "return" ? (this.rval = this.arg = u.arg, this.method = "return", this.next = "end") : u.type === "normal" && c && (this.next = c), f;
    },
    finish: function(u) {
      for (var c = this.tryEntries.length - 1; c >= 0; --c) {
        var d = this.tryEntries[c];
        if (d.finallyLoc === u)
          return this.complete(d.completion, d.afterLoc), b(d), f;
      }
    },
    catch: function(u) {
      for (var c = this.tryEntries.length - 1; c >= 0; --c) {
        var d = this.tryEntries[c];
        if (d.tryLoc === u) {
          var E = d.completion;
          if (E.type === "throw") {
            var w = E.arg;
            b(d);
          }
          return w;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function(u, c, d) {
      return this.delegate = {
        iterator: N(u),
        resultName: c,
        nextLoc: d
      }, this.method === "next" && (this.arg = void 0), f;
    }
  }, s;
}
function Mt(s, t, e, i, n, r, o) {
  try {
    var a = s[r](o), h = a.value;
  } catch (l) {
    e(l);
    return;
  }
  a.done ? t(h) : Promise.resolve(h).then(i, n);
}
function U(s) {
  return function() {
    var t = this, e = arguments;
    return new Promise(function(i, n) {
      var r = s.apply(t, e);
      function o(h) {
        Mt(r, i, n, o, a, "next", h);
      }
      function a(h) {
        Mt(r, i, n, o, a, "throw", h);
      }
      o(void 0);
    });
  };
}
function Gt(s, t) {
  if (!(s instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Rt(s, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(s, Kt(i.key), i);
  }
}
function Yt(s, t, e) {
  return t && Rt(s.prototype, t), e && Rt(s, e), Object.defineProperty(s, "prototype", {
    writable: !1
  }), s;
}
function ct(s, t, e) {
  return t = Kt(t), t in s ? Object.defineProperty(s, t, {
    value: e,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : s[t] = e, s;
}
function gi(s, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  s.prototype = Object.create(t && t.prototype, {
    constructor: {
      value: s,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(s, "prototype", {
    writable: !1
  }), t && ot(s, t);
}
function rt(s) {
  return rt = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e) {
    return e.__proto__ || Object.getPrototypeOf(e);
  }, rt(s);
}
function ot(s, t) {
  return ot = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(i, n) {
    return i.__proto__ = n, i;
  }, ot(s, t);
}
function Xt() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
    return !1;
  if (typeof Proxy == "function")
    return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function ut(s, t, e) {
  return Xt() ? ut = Reflect.construct.bind() : ut = function(n, r, o) {
    var a = [null];
    a.push.apply(a, r);
    var h = Function.bind.apply(n, a), l = new h();
    return o && ot(l, o.prototype), l;
  }, ut.apply(null, arguments);
}
function yi(s) {
  return Function.toString.call(s).indexOf("[native code]") !== -1;
}
function Pt(s) {
  var t = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
  return Pt = function(i) {
    if (i === null || !yi(i))
      return i;
    if (typeof i != "function")
      throw new TypeError("Super expression must either be null or a function");
    if (typeof t < "u") {
      if (t.has(i))
        return t.get(i);
      t.set(i, n);
    }
    function n() {
      return ut(i, arguments, rt(this).constructor);
    }
    return n.prototype = Object.create(i.prototype, {
      constructor: {
        value: n,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), ot(n, i);
  }, Pt(s);
}
function dt(s) {
  if (s === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return s;
}
function vi(s, t) {
  if (t && (typeof t == "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return dt(s);
}
function wi(s) {
  var t = Xt();
  return function() {
    var i = rt(s), n;
    if (t) {
      var r = rt(this).constructor;
      n = Reflect.construct(i, arguments, r);
    } else
      n = i.apply(this, arguments);
    return vi(this, n);
  };
}
function _i(s, t) {
  if (typeof s != "object" || s === null)
    return s;
  var e = s[Symbol.toPrimitive];
  if (e !== void 0) {
    var i = e.call(s, t || "default");
    if (typeof i != "object")
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(s);
}
function Kt(s) {
  var t = _i(s, "string");
  return typeof t == "symbol" ? t : String(t);
}
var Qt = typeof global < "u" && {}.toString.call(global) === "[object global]";
function Ft(s, t) {
  return s.indexOf(t.toLowerCase()) === 0 ? s : "".concat(t.toLowerCase()).concat(s.substr(0, 1).toUpperCase()).concat(s.substr(1));
}
function Pi(s) {
  return Boolean(s && s.nodeType === 1 && "nodeName" in s && s.ownerDocument && s.ownerDocument.defaultView);
}
function bi(s) {
  return !isNaN(parseFloat(s)) && isFinite(s) && Math.floor(s) == s;
}
function G(s) {
  return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(s);
}
function Jt(s) {
  var t = /^https:\/\/player\.vimeo\.com\/video\/\d+/;
  return t.test(s);
}
function te() {
  var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = s.id, e = s.url, i = t || e;
  if (!i)
    throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
  if (bi(i))
    return "https://vimeo.com/".concat(i);
  if (G(i))
    return i.replace("http:", "https:");
  throw t ? new TypeError("\u201C".concat(t, "\u201D is not a valid video id.")) : new TypeError("\u201C".concat(i, "\u201D is not a vimeo.com url."));
}
var Zt = function(t, e, i) {
  var n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "addEventListener", r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : "removeEventListener", o = typeof e == "string" ? [e] : e;
  return o.forEach(function(a) {
    t[n](a, i);
  }), {
    cancel: function() {
      return o.forEach(function(h) {
        return t[r](h, i);
      });
    }
  };
}, Si = typeof Array.prototype.indexOf < "u", Ei = typeof window < "u" && typeof window.postMessage < "u";
if (!Qt && (!Si || !Ei))
  throw new Error("Sorry, the Vimeo Player API is not available in this browser.");
var K = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ti(s, t) {
  return t = { exports: {} }, s(t, t.exports), t.exports;
}
/*!
 * weakmap-polyfill v2.0.4 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2021 polygonplanet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */
(function(s) {
  if (s.WeakMap)
    return;
  var t = Object.prototype.hasOwnProperty, e = Object.defineProperty && function() {
    try {
      return Object.defineProperty({}, "x", {
        value: 1
      }).x === 1;
    } catch {
    }
  }(), i = function(r, o, a) {
    e ? Object.defineProperty(r, o, {
      configurable: !0,
      writable: !0,
      value: a
    }) : r[o] = a;
  };
  s.WeakMap = function() {
    function r() {
      if (this === void 0)
        throw new TypeError("Constructor WeakMap requires 'new'");
      if (i(this, "_id", a("_WeakMap")), arguments.length > 0)
        throw new TypeError("WeakMap iterable is not supported");
    }
    i(r.prototype, "delete", function(l) {
      if (o(this, "delete"), !n(l))
        return !1;
      var p = l[this._id];
      return p && p[0] === l ? (delete l[this._id], !0) : !1;
    }), i(r.prototype, "get", function(l) {
      if (o(this, "get"), !!n(l)) {
        var p = l[this._id];
        if (p && p[0] === l)
          return p[1];
      }
    }), i(r.prototype, "has", function(l) {
      if (o(this, "has"), !n(l))
        return !1;
      var p = l[this._id];
      return !!(p && p[0] === l);
    }), i(r.prototype, "set", function(l, p) {
      if (o(this, "set"), !n(l))
        throw new TypeError("Invalid value used as weak map key");
      var f = l[this._id];
      return f && f[0] === l ? (f[1] = p, this) : (i(l, this._id, [l, p]), this);
    });
    function o(l, p) {
      if (!n(l) || !t.call(l, "_id"))
        throw new TypeError(p + " method called on incompatible receiver " + typeof l);
    }
    function a(l) {
      return l + "_" + h() + "." + h();
    }
    function h() {
      return Math.random().toString().substring(2);
    }
    return i(r, "_polyfill", !0), r;
  }();
  function n(r) {
    return Object(r) === r;
  }
})(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : K);
var W = Ti(function(s) {
  /*! Native Promise Only
      v0.8.1 (c) Kyle Simpson
      MIT License: http://getify.mit-license.org
  */
  (function(e, i, n) {
    i[e] = i[e] || n(), s.exports && (s.exports = i[e]);
  })("Promise", K, function() {
    var e, i, n, r = Object.prototype.toString, o = typeof setImmediate < "u" ? function(m) {
      return setImmediate(m);
    } : setTimeout;
    try {
      Object.defineProperty({}, "x", {}), e = function(m, g, S, T) {
        return Object.defineProperty(m, g, {
          value: S,
          writable: !0,
          configurable: T !== !1
        });
      };
    } catch {
      e = function(g, S, T) {
        return g[S] = T, g;
      };
    }
    n = function() {
      var m, g, S;
      function T(A, b) {
        this.fn = A, this.self = b, this.next = void 0;
      }
      return {
        add: function(b, R) {
          S = new T(b, R), g ? g.next = S : m = S, g = S, S = void 0;
        },
        drain: function() {
          var b = m;
          for (m = g = i = void 0; b; )
            b.fn.call(b.self), b = b.next;
        }
      };
    }();
    function a(v, m) {
      n.add(v, m), i || (i = o(n.drain));
    }
    function h(v) {
      var m, g = typeof v;
      return v != null && (g == "object" || g == "function") && (m = v.then), typeof m == "function" ? m : !1;
    }
    function l() {
      for (var v = 0; v < this.chain.length; v++)
        p(this, this.state === 1 ? this.chain[v].success : this.chain[v].failure, this.chain[v]);
      this.chain.length = 0;
    }
    function p(v, m, g) {
      var S, T;
      try {
        m === !1 ? g.reject(v.msg) : (m === !0 ? S = v.msg : S = m.call(void 0, v.msg), S === g.promise ? g.reject(TypeError("Promise-chain cycle")) : (T = h(S)) ? T.call(S, g.resolve, g.reject) : g.resolve(S));
      } catch (A) {
        g.reject(A);
      }
    }
    function f(v) {
      var m, g = this;
      if (!g.triggered) {
        g.triggered = !0, g.def && (g = g.def);
        try {
          (m = h(v)) ? a(function() {
            var S = new P(g);
            try {
              m.call(v, function() {
                f.apply(S, arguments);
              }, function() {
                y.apply(S, arguments);
              });
            } catch (T) {
              y.call(S, T);
            }
          }) : (g.msg = v, g.state = 1, g.chain.length > 0 && a(l, g));
        } catch (S) {
          y.call(new P(g), S);
        }
      }
    }
    function y(v) {
      var m = this;
      m.triggered || (m.triggered = !0, m.def && (m = m.def), m.msg = v, m.state = 2, m.chain.length > 0 && a(l, m));
    }
    function _(v, m, g, S) {
      for (var T = 0; T < m.length; T++)
        (function(b) {
          v.resolve(m[b]).then(function(N) {
            g(b, N);
          }, S);
        })(T);
    }
    function P(v) {
      this.def = v, this.triggered = !1;
    }
    function L(v) {
      this.promise = v, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0;
    }
    function C(v) {
      if (typeof v != "function")
        throw TypeError("Not a function");
      if (this.__NPO__ !== 0)
        throw TypeError("Not a promise");
      this.__NPO__ = 1;
      var m = new L(this);
      this.then = function(S, T) {
        var A = {
          success: typeof S == "function" ? S : !0,
          failure: typeof T == "function" ? T : !1
        };
        return A.promise = new this.constructor(function(R, N) {
          if (typeof R != "function" || typeof N != "function")
            throw TypeError("Not a function");
          A.resolve = R, A.reject = N;
        }), m.chain.push(A), m.state !== 0 && a(l, m), A.promise;
      }, this.catch = function(S) {
        return this.then(void 0, S);
      };
      try {
        v.call(void 0, function(S) {
          f.call(m, S);
        }, function(S) {
          y.call(m, S);
        });
      } catch (g) {
        y.call(m, g);
      }
    }
    var x = e({}, "constructor", C, !1);
    return C.prototype = x, e(x, "__NPO__", 0, !1), e(C, "resolve", function(m) {
      var g = this;
      return m && typeof m == "object" && m.__NPO__ === 1 ? m : new g(function(T, A) {
        if (typeof T != "function" || typeof A != "function")
          throw TypeError("Not a function");
        T(m);
      });
    }), e(C, "reject", function(m) {
      return new this(function(S, T) {
        if (typeof S != "function" || typeof T != "function")
          throw TypeError("Not a function");
        T(m);
      });
    }), e(C, "all", function(m) {
      var g = this;
      return r.call(m) != "[object Array]" ? g.reject(TypeError("Not an array")) : m.length === 0 ? g.resolve([]) : new g(function(T, A) {
        if (typeof T != "function" || typeof A != "function")
          throw TypeError("Not a function");
        var b = m.length, R = Array(b), N = 0;
        _(g, m, function(u, c) {
          R[u] = c, ++N === b && T(R);
        }, A);
      });
    }), e(C, "race", function(m) {
      var g = this;
      return r.call(m) != "[object Array]" ? g.reject(TypeError("Not an array")) : new g(function(T, A) {
        if (typeof T != "function" || typeof A != "function")
          throw TypeError("Not a function");
        _(g, m, function(R, N) {
          T(N);
        }, A);
      });
    }), C;
  });
}), H = /* @__PURE__ */ new WeakMap();
function tt(s, t, e) {
  var i = H.get(s.element) || {};
  t in i || (i[t] = []), i[t].push(e), H.set(s.element, i);
}
function pt(s, t) {
  var e = H.get(s.element) || {};
  return e[t] || [];
}
function ft(s, t, e) {
  var i = H.get(s.element) || {};
  if (!i[t])
    return !0;
  if (!e)
    return i[t] = [], H.set(s.element, i), !0;
  var n = i[t].indexOf(e);
  return n !== -1 && i[t].splice(n, 1), H.set(s.element, i), i[t] && i[t].length === 0;
}
function Ii(s, t) {
  var e = pt(s, t);
  if (e.length < 1)
    return !1;
  var i = e.shift();
  return ft(s, t, i), i;
}
function Ci(s, t) {
  var e = H.get(s);
  H.set(t, e), H.delete(s);
}
function mt(s) {
  if (typeof s == "string")
    try {
      s = JSON.parse(s);
    } catch (t) {
      return console.warn(t), {};
    }
  return s;
}
function q(s, t, e) {
  if (!(!s.element.contentWindow || !s.element.contentWindow.postMessage)) {
    var i = {
      method: t
    };
    e !== void 0 && (i.value = e);
    var n = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1"));
    n >= 8 && n < 10 && (i = JSON.stringify(i)), s.element.contentWindow.postMessage(i, s.origin);
  }
}
function Li(s, t) {
  t = mt(t);
  var e = [], i;
  if (t.event) {
    if (t.event === "error") {
      var n = pt(s, t.data.method);
      n.forEach(function(o) {
        var a = new Error(t.data.message);
        a.name = t.data.name, o.reject(a), ft(s, t.data.method, o);
      });
    }
    e = pt(s, "event:".concat(t.event)), i = t.data;
  } else if (t.method) {
    var r = Ii(s, t.method);
    r && (e.push(r), i = t.value);
  }
  e.forEach(function(o) {
    try {
      if (typeof o == "function") {
        o.call(s, i);
        return;
      }
      o.resolve(i);
    } catch {
    }
  });
}
var Ai = ["autopause", "autoplay", "background", "byline", "color", "colors", "controls", "dnt", "height", "id", "interactive_params", "keyboard", "loop", "maxheight", "maxwidth", "muted", "playsinline", "portrait", "responsive", "speed", "texttrack", "title", "transparent", "url", "width"];
function ee(s) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return Ai.reduce(function(e, i) {
    var n = s.getAttribute("data-vimeo-".concat(i));
    return (n || n === "") && (e[i] = n === "" ? 1 : n), e;
  }, t);
}
function bt(s, t) {
  var e = s.html;
  if (!t)
    throw new TypeError("An element must be provided");
  if (t.getAttribute("data-vimeo-initialized") !== null)
    return t.querySelector("iframe");
  var i = document.createElement("div");
  return i.innerHTML = e, t.appendChild(i.firstChild), t.setAttribute("data-vimeo-initialized", "true"), t.querySelector("iframe");
}
function ie(s) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, e = arguments.length > 2 ? arguments[2] : void 0;
  return new Promise(function(i, n) {
    if (!G(s))
      throw new TypeError("\u201C".concat(s, "\u201D is not a vimeo.com url."));
    var r = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(s));
    for (var o in t)
      t.hasOwnProperty(o) && (r += "&".concat(o, "=").concat(encodeURIComponent(t[o])));
    var a = "XDomainRequest" in window ? new XDomainRequest() : new XMLHttpRequest();
    a.open("GET", r, !0), a.onload = function() {
      if (a.status === 404) {
        n(new Error("\u201C".concat(s, "\u201D was not found.")));
        return;
      }
      if (a.status === 403) {
        n(new Error("\u201C".concat(s, "\u201D is not embeddable.")));
        return;
      }
      try {
        var h = JSON.parse(a.responseText);
        if (h.domain_status_code === 403) {
          bt(h, e), n(new Error("\u201C".concat(s, "\u201D is not embeddable.")));
          return;
        }
        i(h);
      } catch (l) {
        n(l);
      }
    }, a.onerror = function() {
      var h = a.status ? " (".concat(a.status, ")") : "";
      n(new Error("There was an error fetching the embed code from Vimeo".concat(h, ".")));
    }, a.send();
  });
}
function Oi() {
  var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document, t = [].slice.call(s.querySelectorAll("[data-vimeo-id], [data-vimeo-url]")), e = function(n) {
    "console" in window && console.error && console.error("There was an error creating an embed: ".concat(n));
  };
  t.forEach(function(i) {
    try {
      if (i.getAttribute("data-vimeo-defer") !== null)
        return;
      var n = ee(i), r = te(n);
      ie(r, n, i).then(function(o) {
        return bt(o, i);
      }).catch(e);
    } catch (o) {
      e(o);
    }
  });
}
function ki() {
  var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (!window.VimeoPlayerResizeEmbeds_) {
    window.VimeoPlayerResizeEmbeds_ = !0;
    var t = function(i) {
      if (!!G(i.origin) && !(!i.data || i.data.event !== "spacechange")) {
        for (var n = s.querySelectorAll("iframe"), r = 0; r < n.length; r++)
          if (n[r].contentWindow === i.source) {
            var o = n[r].parentElement;
            o.style.paddingBottom = "".concat(i.data.data[0].bottom, "px");
            break;
          }
      }
    };
    window.addEventListener("message", t);
  }
}
function xi() {
  var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (!window.VimeoSeoMetadataAppended) {
    window.VimeoSeoMetadataAppended = !0;
    var t = function(i) {
      if (!!G(i.origin)) {
        var n = mt(i.data);
        if (!(!n || n.event !== "ready"))
          for (var r = s.querySelectorAll("iframe"), o = 0; o < r.length; o++) {
            var a = r[o], h = a.contentWindow === i.source;
            if (Jt(a.src) && h) {
              var l = new St(a);
              l.callMethod("appendVideoMetadata", window.location.href);
            }
          }
      }
    };
    window.addEventListener("message", t);
  }
}
function zi() {
  var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (!window.VimeoCheckedUrlTimeParam) {
    window.VimeoCheckedUrlTimeParam = !0;
    var t = function(n) {
      "console" in window && console.error && console.error("There was an error getting video Id: ".concat(n));
    }, e = function(n) {
      if (!!G(n.origin)) {
        var r = mt(n.data);
        if (!(!r || r.event !== "ready"))
          for (var o = s.querySelectorAll("iframe"), a = function() {
            var p = o[h], f = p.contentWindow === n.source;
            if (Jt(p.src) && f) {
              var y = new St(p);
              y.getVideoId().then(function(_) {
                var P = new RegExp("[?&]vimeo_t_".concat(_, "=([^&#]*)")).exec(window.location.href);
                if (P && P[1]) {
                  var L = decodeURI(P[1]);
                  y.setCurrentTime(L);
                }
              }).catch(t);
            }
          }, h = 0; h < o.length; h++)
            a();
      }
    };
    window.addEventListener("message", e);
  }
}
function Di() {
  var s = function() {
    for (var i, n = [
      ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
      ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
      ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
      ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
      ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
    ], r = 0, o = n.length, a = {}; r < o; r++)
      if (i = n[r], i && i[1] in document) {
        for (r = 0; r < i.length; r++)
          a[n[0][r]] = i[r];
        return a;
      }
    return !1;
  }(), t = {
    fullscreenchange: s.fullscreenchange,
    fullscreenerror: s.fullscreenerror
  }, e = {
    request: function(n) {
      return new Promise(function(r, o) {
        var a = function l() {
          e.off("fullscreenchange", l), r();
        };
        e.on("fullscreenchange", a), n = n || document.documentElement;
        var h = n[s.requestFullscreen]();
        h instanceof Promise && h.then(a).catch(o);
      });
    },
    exit: function() {
      return new Promise(function(n, r) {
        if (!e.isFullscreen) {
          n();
          return;
        }
        var o = function h() {
          e.off("fullscreenchange", h), n();
        };
        e.on("fullscreenchange", o);
        var a = document[s.exitFullscreen]();
        a instanceof Promise && a.then(o).catch(r);
      });
    },
    on: function(n, r) {
      var o = t[n];
      o && document.addEventListener(o, r);
    },
    off: function(n, r) {
      var o = t[n];
      o && document.removeEventListener(o, r);
    }
  };
  return Object.defineProperties(e, {
    isFullscreen: {
      get: function() {
        return Boolean(document[s.fullscreenElement]);
      }
    },
    element: {
      enumerable: !0,
      get: function() {
        return document[s.fullscreenElement];
      }
    },
    isEnabled: {
      enumerable: !0,
      get: function() {
        return Boolean(document[s.fullscreenEnabled]);
      }
    }
  }), e;
}
var Mi = {
  role: "viewer",
  autoPlayMuted: !0,
  allowedDrift: 0.3,
  maxAllowedDrift: 1,
  minCheckInterval: 0.1,
  maxRateAdjustment: 0.2,
  maxTimeToCatchUp: 1
}, Ri = /* @__PURE__ */ function(s) {
  gi(e, s);
  var t = wi(e);
  function e(i, n) {
    var r, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = arguments.length > 3 ? arguments[3] : void 0;
    return Gt(this, e), r = t.call(this), ct(dt(r), "logger", void 0), ct(dt(r), "speedAdjustment", 0), ct(dt(r), "adjustSpeed", /* @__PURE__ */ function() {
      var h = U(/* @__PURE__ */ z().mark(function l(p, f) {
        var y;
        return z().wrap(function(P) {
          for (; ; )
            switch (P.prev = P.next) {
              case 0:
                if (r.speedAdjustment !== f) {
                  P.next = 2;
                  break;
                }
                return P.abrupt("return");
              case 2:
                return P.next = 4, p.getPlaybackRate();
              case 4:
                return P.t0 = P.sent, P.t1 = r.speedAdjustment, P.t2 = P.t0 - P.t1, P.t3 = f, y = P.t2 + P.t3, r.log("New playbackRate:  ".concat(y)), P.next = 12, p.setPlaybackRate(y);
              case 12:
                r.speedAdjustment = f;
              case 13:
              case "end":
                return P.stop();
            }
        }, l);
      }));
      return function(l, p) {
        return h.apply(this, arguments);
      };
    }()), r.logger = a, r.init(n, i, Dt(Dt({}, Mi), o)), r;
  }
  return Yt(e, [{
    key: "disconnect",
    value: function() {
      this.dispatchEvent(new Event("disconnect"));
    }
  }, {
    key: "init",
    value: function() {
      var i = U(/* @__PURE__ */ z().mark(function r(o, a, h) {
        var l = this, p, f, y;
        return z().wrap(function(P) {
          for (; ; )
            switch (P.prev = P.next) {
              case 0:
                return P.next = 2, this.waitForTOReadyState(o, "open");
              case 2:
                if (h.role !== "viewer") {
                  P.next = 10;
                  break;
                }
                return P.next = 5, this.updatePlayer(o, a, h);
              case 5:
                p = Zt(o, "change", function() {
                  return l.updatePlayer(o, a, h);
                }), f = this.maintainPlaybackPosition(o, a, h), this.addEventListener("disconnect", function() {
                  f.cancel(), p.cancel();
                }), P.next = 14;
                break;
              case 10:
                return P.next = 12, this.updateTimingObject(o, a);
              case 12:
                y = Zt(a, ["seeked", "play", "pause", "ratechange"], function() {
                  return l.updateTimingObject(o, a);
                }, "on", "off"), this.addEventListener("disconnect", function() {
                  return y.cancel();
                });
              case 14:
              case "end":
                return P.stop();
            }
        }, r, this);
      }));
      function n(r, o, a) {
        return i.apply(this, arguments);
      }
      return n;
    }()
  }, {
    key: "updateTimingObject",
    value: function() {
      var i = U(/* @__PURE__ */ z().mark(function r(o, a) {
        return z().wrap(function(l) {
          for (; ; )
            switch (l.prev = l.next) {
              case 0:
                return l.t0 = o, l.next = 3, a.getCurrentTime();
              case 3:
                return l.t1 = l.sent, l.next = 6, a.getPaused();
              case 6:
                if (!l.sent) {
                  l.next = 10;
                  break;
                }
                l.t2 = 0, l.next = 13;
                break;
              case 10:
                return l.next = 12, a.getPlaybackRate();
              case 12:
                l.t2 = l.sent;
              case 13:
                l.t3 = l.t2, l.t4 = {
                  position: l.t1,
                  velocity: l.t3
                }, l.t0.update.call(l.t0, l.t4);
              case 16:
              case "end":
                return l.stop();
            }
        }, r);
      }));
      function n(r, o) {
        return i.apply(this, arguments);
      }
      return n;
    }()
  }, {
    key: "updatePlayer",
    value: function() {
      var i = U(/* @__PURE__ */ z().mark(function r(o, a, h) {
        var l, p, f;
        return z().wrap(function(_) {
          for (; ; )
            switch (_.prev = _.next) {
              case 0:
                if (l = o.query(), p = l.position, f = l.velocity, typeof p == "number" && a.setCurrentTime(p), typeof f != "number") {
                  _.next = 25;
                  break;
                }
                if (f !== 0) {
                  _.next = 11;
                  break;
                }
                return _.next = 6, a.getPaused();
              case 6:
                if (_.t0 = _.sent, _.t0 !== !1) {
                  _.next = 9;
                  break;
                }
                a.pause();
              case 9:
                _.next = 25;
                break;
              case 11:
                if (!(f > 0)) {
                  _.next = 25;
                  break;
                }
                return _.next = 14, a.getPaused();
              case 14:
                if (_.t1 = _.sent, _.t1 !== !0) {
                  _.next = 19;
                  break;
                }
                return _.next = 18, a.play().catch(/* @__PURE__ */ function() {
                  var P = U(/* @__PURE__ */ z().mark(function L(C) {
                    return z().wrap(function(v) {
                      for (; ; )
                        switch (v.prev = v.next) {
                          case 0:
                            if (!(C.name === "NotAllowedError" && h.autoPlayMuted)) {
                              v.next = 5;
                              break;
                            }
                            return v.next = 3, a.setMuted(!0);
                          case 3:
                            return v.next = 5, a.play().catch(function(m) {
                              return console.error("Couldn't play the video from TimingSrcConnector. Error:", m);
                            });
                          case 5:
                          case "end":
                            return v.stop();
                        }
                    }, L);
                  }));
                  return function(L) {
                    return P.apply(this, arguments);
                  };
                }());
              case 18:
                this.updatePlayer(o, a, h);
              case 19:
                return _.next = 21, a.getPlaybackRate();
              case 21:
                if (_.t2 = _.sent, _.t3 = f, _.t2 === _.t3) {
                  _.next = 25;
                  break;
                }
                a.setPlaybackRate(f);
              case 25:
              case "end":
                return _.stop();
            }
        }, r, this);
      }));
      function n(r, o, a) {
        return i.apply(this, arguments);
      }
      return n;
    }()
  }, {
    key: "maintainPlaybackPosition",
    value: function(n, r, o) {
      var a = this, h = o.allowedDrift, l = o.maxAllowedDrift, p = o.minCheckInterval, f = o.maxRateAdjustment, y = o.maxTimeToCatchUp, _ = Math.min(y, Math.max(p, l)) * 1e3, P = /* @__PURE__ */ function() {
        var C = U(/* @__PURE__ */ z().mark(function x() {
          var v, m, g, S, T;
          return z().wrap(function(b) {
            for (; ; )
              switch (b.prev = b.next) {
                case 0:
                  if (b.t0 = n.query().velocity === 0, b.t0) {
                    b.next = 6;
                    break;
                  }
                  return b.next = 4, r.getPaused();
                case 4:
                  b.t1 = b.sent, b.t0 = b.t1 === !0;
                case 6:
                  if (!b.t0) {
                    b.next = 8;
                    break;
                  }
                  return b.abrupt("return");
                case 8:
                  return b.t2 = n.query().position, b.next = 11, r.getCurrentTime();
                case 11:
                  if (b.t3 = b.sent, v = b.t2 - b.t3, m = Math.abs(v), a.log("Drift: ".concat(v)), !(m > l)) {
                    b.next = 22;
                    break;
                  }
                  return b.next = 18, a.adjustSpeed(r, 0);
                case 18:
                  r.setCurrentTime(n.query().position), a.log("Resync by currentTime"), b.next = 29;
                  break;
                case 22:
                  if (!(m > h)) {
                    b.next = 29;
                    break;
                  }
                  return g = m / y, S = f, T = g < S ? (S - g) / 2 : S, b.next = 28, a.adjustSpeed(r, T * Math.sign(v));
                case 28:
                  a.log("Resync by playbackRate");
                case 29:
                case "end":
                  return b.stop();
              }
          }, x);
        }));
        return function() {
          return C.apply(this, arguments);
        };
      }(), L = setInterval(function() {
        return P();
      }, _);
      return {
        cancel: function() {
          return clearInterval(L);
        }
      };
    }
  }, {
    key: "log",
    value: function(n) {
      var r;
      (r = this.logger) === null || r === void 0 || r.call(this, "TimingSrcConnector: ".concat(n));
    }
  }, {
    key: "waitForTOReadyState",
    value: function(n, r) {
      return new Promise(function(o) {
        var a = function h() {
          n.readyState === r ? o() : n.addEventListener("readystatechange", h, {
            once: !0
          });
        };
        a();
      });
    }
  }]), e;
}(/* @__PURE__ */ Pt(EventTarget)), X = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), D = {}, St = /* @__PURE__ */ function() {
  function s(t) {
    var e = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (Gt(this, s), window.jQuery && t instanceof jQuery && (t.length > 1 && window.console && console.warn && console.warn("A jQuery object with multiple elements was passed, using the first element."), t = t[0]), typeof document < "u" && typeof t == "string" && (t = document.getElementById(t)), !Pi(t))
      throw new TypeError("You must pass either a valid element or a valid id.");
    if (t.nodeName !== "IFRAME") {
      var n = t.querySelector("iframe");
      n && (t = n);
    }
    if (t.nodeName === "IFRAME" && !G(t.getAttribute("src") || ""))
      throw new Error("The player element passed isn\u2019t a Vimeo embed.");
    if (X.has(t))
      return X.get(t);
    this._window = t.ownerDocument.defaultView, this.element = t, this.origin = "*";
    var r = new W(function(a, h) {
      if (e._onMessage = function(f) {
        if (!(!G(f.origin) || e.element.contentWindow !== f.source)) {
          e.origin === "*" && (e.origin = f.origin);
          var y = mt(f.data), _ = y && y.event === "error", P = _ && y.data && y.data.method === "ready";
          if (P) {
            var L = new Error(y.data.message);
            L.name = y.data.name, h(L);
            return;
          }
          var C = y && y.event === "ready", x = y && y.method === "ping";
          if (C || x) {
            e.element.setAttribute("data-ready", "true"), a();
            return;
          }
          Li(e, y);
        }
      }, e._window.addEventListener("message", e._onMessage), e.element.nodeName !== "IFRAME") {
        var l = ee(t, i), p = te(l);
        ie(p, l, t).then(function(f) {
          var y = bt(f, t);
          return e.element = y, e._originalElement = t, Ci(t, y), X.set(e.element, e), f;
        }).catch(h);
      }
    });
    if (yt.set(this, r), X.set(this.element, this), this.element.nodeName === "IFRAME" && q(this, "ping"), D.isEnabled) {
      var o = function() {
        return D.exit();
      };
      this.fullscreenchangeHandler = function() {
        D.isFullscreen ? tt(e, "event:exitFullscreen", o) : ft(e, "event:exitFullscreen", o), e.ready().then(function() {
          q(e, "fullscreenchange", D.isFullscreen);
        });
      }, D.on("fullscreenchange", this.fullscreenchangeHandler);
    }
    return this;
  }
  return Yt(s, [{
    key: "callMethod",
    value: function(e) {
      var i = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return new W(function(r, o) {
        return i.ready().then(function() {
          tt(i, e, {
            resolve: r,
            reject: o
          }), q(i, e, n);
        }).catch(o);
      });
    }
  }, {
    key: "get",
    value: function(e) {
      var i = this;
      return new W(function(n, r) {
        return e = Ft(e, "get"), i.ready().then(function() {
          tt(i, e, {
            resolve: n,
            reject: r
          }), q(i, e);
        }).catch(r);
      });
    }
  }, {
    key: "set",
    value: function(e, i) {
      var n = this;
      return new W(function(r, o) {
        if (e = Ft(e, "set"), i == null)
          throw new TypeError("There must be a value to set.");
        return n.ready().then(function() {
          tt(n, e, {
            resolve: r,
            reject: o
          }), q(n, e, i);
        }).catch(o);
      });
    }
  }, {
    key: "on",
    value: function(e, i) {
      if (!e)
        throw new TypeError("You must pass an event name.");
      if (!i)
        throw new TypeError("You must pass a callback function.");
      if (typeof i != "function")
        throw new TypeError("The callback must be a function.");
      var n = pt(this, "event:".concat(e));
      n.length === 0 && this.callMethod("addEventListener", e).catch(function() {
      }), tt(this, "event:".concat(e), i);
    }
  }, {
    key: "off",
    value: function(e, i) {
      if (!e)
        throw new TypeError("You must pass an event name.");
      if (i && typeof i != "function")
        throw new TypeError("The callback must be a function.");
      var n = ft(this, "event:".concat(e), i);
      n && this.callMethod("removeEventListener", e).catch(function(r) {
      });
    }
  }, {
    key: "loadVideo",
    value: function(e) {
      return this.callMethod("loadVideo", e);
    }
  }, {
    key: "ready",
    value: function() {
      var e = yt.get(this) || new W(function(i, n) {
        n(new Error("Unknown player. Probably unloaded."));
      });
      return W.resolve(e);
    }
  }, {
    key: "addCuePoint",
    value: function(e) {
      var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.callMethod("addCuePoint", {
        time: e,
        data: i
      });
    }
  }, {
    key: "removeCuePoint",
    value: function(e) {
      return this.callMethod("removeCuePoint", e);
    }
  }, {
    key: "enableTextTrack",
    value: function(e, i) {
      if (!e)
        throw new TypeError("You must pass a language.");
      return this.callMethod("enableTextTrack", {
        language: e,
        kind: i
      });
    }
  }, {
    key: "disableTextTrack",
    value: function() {
      return this.callMethod("disableTextTrack");
    }
  }, {
    key: "pause",
    value: function() {
      return this.callMethod("pause");
    }
  }, {
    key: "play",
    value: function() {
      return this.callMethod("play");
    }
  }, {
    key: "requestFullscreen",
    value: function() {
      return D.isEnabled ? D.request(this.element) : this.callMethod("requestFullscreen");
    }
  }, {
    key: "exitFullscreen",
    value: function() {
      return D.isEnabled ? D.exit() : this.callMethod("exitFullscreen");
    }
  }, {
    key: "getFullscreen",
    value: function() {
      return D.isEnabled ? W.resolve(D.isFullscreen) : this.get("fullscreen");
    }
  }, {
    key: "requestPictureInPicture",
    value: function() {
      return this.callMethod("requestPictureInPicture");
    }
  }, {
    key: "exitPictureInPicture",
    value: function() {
      return this.callMethod("exitPictureInPicture");
    }
  }, {
    key: "getPictureInPicture",
    value: function() {
      return this.get("pictureInPicture");
    }
  }, {
    key: "remotePlaybackPrompt",
    value: function() {
      return this.callMethod("remotePlaybackPrompt");
    }
  }, {
    key: "unload",
    value: function() {
      return this.callMethod("unload");
    }
  }, {
    key: "destroy",
    value: function() {
      var e = this;
      return new W(function(i) {
        if (yt.delete(e), X.delete(e.element), e._originalElement && (X.delete(e._originalElement), e._originalElement.removeAttribute("data-vimeo-initialized")), e.element && e.element.nodeName === "IFRAME" && e.element.parentNode && (e.element.parentNode.parentNode && e._originalElement && e._originalElement !== e.element.parentNode ? e.element.parentNode.parentNode.removeChild(e.element.parentNode) : e.element.parentNode.removeChild(e.element)), e.element && e.element.nodeName === "DIV" && e.element.parentNode) {
          e.element.removeAttribute("data-vimeo-initialized");
          var n = e.element.querySelector("iframe");
          n && n.parentNode && (n.parentNode.parentNode && e._originalElement && e._originalElement !== n.parentNode ? n.parentNode.parentNode.removeChild(n.parentNode) : n.parentNode.removeChild(n));
        }
        e._window.removeEventListener("message", e._onMessage), D.isEnabled && D.off("fullscreenchange", e.fullscreenchangeHandler), i();
      });
    }
  }, {
    key: "getAutopause",
    value: function() {
      return this.get("autopause");
    }
  }, {
    key: "setAutopause",
    value: function(e) {
      return this.set("autopause", e);
    }
  }, {
    key: "getBuffered",
    value: function() {
      return this.get("buffered");
    }
  }, {
    key: "getCameraProps",
    value: function() {
      return this.get("cameraProps");
    }
  }, {
    key: "setCameraProps",
    value: function(e) {
      return this.set("cameraProps", e);
    }
  }, {
    key: "getChapters",
    value: function() {
      return this.get("chapters");
    }
  }, {
    key: "getCurrentChapter",
    value: function() {
      return this.get("currentChapter");
    }
  }, {
    key: "getColor",
    value: function() {
      return this.get("color");
    }
  }, {
    key: "getColors",
    value: function() {
      return W.all([this.get("colorOne"), this.get("colorTwo"), this.get("colorThree"), this.get("colorFour")]);
    }
  }, {
    key: "setColor",
    value: function(e) {
      return this.set("color", e);
    }
  }, {
    key: "setColors",
    value: function(e) {
      if (!Array.isArray(e))
        return new W(function(r, o) {
          return o(new TypeError("Argument must be an array."));
        });
      var i = new W(function(r) {
        return r(null);
      }), n = [e[0] ? this.set("colorOne", e[0]) : i, e[1] ? this.set("colorTwo", e[1]) : i, e[2] ? this.set("colorThree", e[2]) : i, e[3] ? this.set("colorFour", e[3]) : i];
      return W.all(n);
    }
  }, {
    key: "getCuePoints",
    value: function() {
      return this.get("cuePoints");
    }
  }, {
    key: "getCurrentTime",
    value: function() {
      return this.get("currentTime");
    }
  }, {
    key: "setCurrentTime",
    value: function(e) {
      return this.set("currentTime", e);
    }
  }, {
    key: "getDuration",
    value: function() {
      return this.get("duration");
    }
  }, {
    key: "getEnded",
    value: function() {
      return this.get("ended");
    }
  }, {
    key: "getLoop",
    value: function() {
      return this.get("loop");
    }
  }, {
    key: "setLoop",
    value: function(e) {
      return this.set("loop", e);
    }
  }, {
    key: "setMuted",
    value: function(e) {
      return this.set("muted", e);
    }
  }, {
    key: "getMuted",
    value: function() {
      return this.get("muted");
    }
  }, {
    key: "getPaused",
    value: function() {
      return this.get("paused");
    }
  }, {
    key: "getPlaybackRate",
    value: function() {
      return this.get("playbackRate");
    }
  }, {
    key: "setPlaybackRate",
    value: function(e) {
      return this.set("playbackRate", e);
    }
  }, {
    key: "getPlayed",
    value: function() {
      return this.get("played");
    }
  }, {
    key: "getQualities",
    value: function() {
      return this.get("qualities");
    }
  }, {
    key: "getQuality",
    value: function() {
      return this.get("quality");
    }
  }, {
    key: "setQuality",
    value: function(e) {
      return this.set("quality", e);
    }
  }, {
    key: "getRemotePlaybackAvailability",
    value: function() {
      return this.get("remotePlaybackAvailability");
    }
  }, {
    key: "getRemotePlaybackState",
    value: function() {
      return this.get("remotePlaybackState");
    }
  }, {
    key: "getSeekable",
    value: function() {
      return this.get("seekable");
    }
  }, {
    key: "getSeeking",
    value: function() {
      return this.get("seeking");
    }
  }, {
    key: "getTextTracks",
    value: function() {
      return this.get("textTracks");
    }
  }, {
    key: "getVideoEmbedCode",
    value: function() {
      return this.get("videoEmbedCode");
    }
  }, {
    key: "getVideoId",
    value: function() {
      return this.get("videoId");
    }
  }, {
    key: "getVideoTitle",
    value: function() {
      return this.get("videoTitle");
    }
  }, {
    key: "getVideoWidth",
    value: function() {
      return this.get("videoWidth");
    }
  }, {
    key: "getVideoHeight",
    value: function() {
      return this.get("videoHeight");
    }
  }, {
    key: "getVideoUrl",
    value: function() {
      return this.get("videoUrl");
    }
  }, {
    key: "getVolume",
    value: function() {
      return this.get("volume");
    }
  }, {
    key: "setVolume",
    value: function(e) {
      return this.set("volume", e);
    }
  }, {
    key: "setTimingSrc",
    value: function() {
      var t = U(/* @__PURE__ */ z().mark(function i(n, r) {
        var o = this, a;
        return z().wrap(function(l) {
          for (; ; )
            switch (l.prev = l.next) {
              case 0:
                if (n) {
                  l.next = 2;
                  break;
                }
                throw new TypeError("A Timing Object must be provided.");
              case 2:
                return l.next = 4, this.ready();
              case 4:
                return a = new Ri(this, n, r), q(this, "notifyTimingObjectConnect"), a.addEventListener("disconnect", function() {
                  return q(o, "notifyTimingObjectDisconnect");
                }), l.abrupt("return", a);
              case 8:
              case "end":
                return l.stop();
            }
        }, i, this);
      }));
      function e(i, n) {
        return t.apply(this, arguments);
      }
      return e;
    }()
  }]), s;
}();
Qt || (D = Di(), Oi(), ki(), xi(), zi());
class Fi {
  constructor(t, e) {
    this.videoUrl = t, this.el = e, this.player = null, this.init();
  }
  init() {
    this.player = new St(this.el, {
      url: this.videoUrl,
      width: 1920,
      loop: !1,
      autoplay: !0
    });
  }
  destroy() {
    this.player.destroy();
  }
}
class Zi {
  constructor(t, e) {
    this.videoUrl = t, this.el = e, this.player = null, this.videoId = null, this.init();
  }
  init() {
    this.videoId = this.getVideoId(this.videoUrl), window.onYouTubeIframeAPIReady ? this.initPlayer() : this.createPlayer();
  }
  createPlayer() {
    const t = document.createElement("script");
    t.src = "https://www.youtube.com/iframe_api";
    const e = document.getElementsByTagName("script")[0];
    e.parentNode.insertBefore(t, e), window.onYouTubeIframeAPIReady = () => {
      this.initPlayer();
    };
  }
  initPlayer() {
    if (window.YT === void 0 || !window.YT) {
      window.onYouTubeIframeAPIReady = null, this.createPlayer();
      return;
    }
    this.player = new window.YT.Player(this.el, {
      height: 1080,
      width: 1920,
      videoId: this.videoId,
      playerVars: {
        playsinline: 1
      },
      events: {
        onReady: this.onPlayerReady
      }
    });
  }
  getVideoId(t) {
    const e = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/, i = t.match(e);
    return i && i[7].length == 11 ? i[7] : !1;
  }
  onPlayerReady(t) {
    t.target.playVideo();
  }
  stopVideo() {
    this.player.stopVideo();
  }
  destroy() {
    this.player.destroy();
  }
}
class Ni {
  constructor({ videoUrl: t, index: e }) {
    this.videoUrl = t, this.index = e, this.youtubePlayer = null, this.vimeoPlayer = null, this.id = `photoSwipeVideoIframe_${this.index}`, this.videoType = this.getVideoType(), this.isPlaying = !1;
  }
  getVideoType() {
    if (!!this.videoUrl) {
      if (this.videoUrl.includes("youtu"))
        return "youtube";
      if (this.videoUrl.includes("vimeo"))
        return "vimeo";
    }
  }
  play() {
    if (this.tryToPlay(), this.isPlaying)
      return;
    const t = setInterval(() => {
      this.tryToPlay(), this.isPlaying && clearInterval(t);
    }, 100);
  }
  tryToPlay() {
    document.querySelector(`#${this.id}`) && (this.videoType === "youtube" ? this.playYoutube() : this.videoType === "vimeo" && this.playVimeo(), this.isPlaying = !0);
  }
  playYoutube() {
    this.youtubePlayer = new Zi(this.videoUrl, this.id);
  }
  playVimeo() {
    this.vimeoPlayer = new Fi(this.videoUrl, this.id);
  }
  destroy() {
    this.isPlaying = !1, this.youtubePlayer && (this.youtubePlayer.destroy(), this.youtubePlayer = null), this.vimeoPlayer && (this.vimeoPlayer.destroy(), this.vimeoPlayer = null);
  }
  render() {
    const t = document.createElement("div");
    t.classList = "photoSwipe__videoItem";
    const e = document.createElement("div");
    e.classList = "photoSwipe__videoHolder";
    const i = document.createElement("div");
    i.classList = "photoSwipe__videoHolderInner";
    const n = document.createElement("div");
    return n.classList = "photoSwipe__video", n.id = this.id, i.appendChild(n), e.appendChild(i), t.appendChild(e), t;
  }
}
const Vi = ({ options: s = {} }) => ({
  lightbox: null,
  elements: null,
  videoPlayers: [],
  init() {
    document.addEventListener("alpine:initialized", () => {
      this.elements = this.$el.querySelectorAll("a"), this.initLightbox();
    });
  },
  initLightbox() {
    this.lightbox = new me({
      gallery: this.$el,
      children: "a",
      pswpModule: mi,
      ...s
    }), this.lightbox.on("contentLoad", (t) => {
      const { content: e } = t;
      if (e.type === "video") {
        t.preventDefault();
        const i = new Ni({
          videoUrl: e.data.src,
          index: e.index
        });
        e.element = i.render(), this.videoPlayers.push(i);
      }
    }), this.lightbox.on("contentActivate", ({ content: t }) => {
      t.type === "video" && this.getCurrentVideoPlayer(t.index, t.data.src).play();
    }), this.lightbox.on("contentDeactivate", ({ content: t }) => {
      t.type === "video" && this.getCurrentVideoPlayer(t.index, t.data.src).destroy();
    }), this.lightbox.on("destroy", () => {
      this.videoPlayers.forEach((t) => t.destroy()), this.videoPlayers = [];
    }), this.lightbox.init();
  },
  getCurrentVideoPlayer(t, e) {
    return this.videoPlayers.find((i) => i.index === t && i.videoUrl === e);
  },
  open(t = 0) {
    s.dataSource || this.setDataSourceFromHtml(), this.lightbox.loadAndOpen(t);
  },
  setDataSourceFromHtml() {
    this.lightbox.options.dataSource = Array.from(this.elements).map((t) => ({
      src: t.href,
      width: t.dataset.pswpWidth,
      height: t.dataset.pswpHeight
    }));
  }
});
document.addEventListener("alpine:init", () => {
  window.Alpine.data("photoSwipe", Vi);
});
