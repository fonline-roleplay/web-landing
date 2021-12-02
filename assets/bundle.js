(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Splide, EVENT_SCROLL } = require('@splidejs/splide');

const SimpleBar = require('simplebar');

function initSlider(el, isVertical = false) {
    const slides = el.querySelectorAll('.splide__slide')
    const options = {
        wheel: false,
        height: '800px',
    };
    if (isVertical) {
        options['direction'] = 'ttb';
    }
    const splide = new Splide(el, options)
    splide.on('pagination:mounted', function(data) {
        const splide = data.list.parentElement;
        if (splide.classList.contains('--slider')) return;

        const sidebar = document.createElement('DIV');
        const pagination = data.list;
        sidebar.classList.add('splide__sidebar')
        data.list.classList.add('splide__button-grid');
        data.items.forEach(function(item) {
            const slide = slides[item.page];
            const title = slide.dataset.title || (item.page + 1);
            const icon = slide.dataset.icon;
            if (icon) {
                item.button.innerHTML = `<div class='btn__header'><div class=title>${title}</div><img class=icon src="${icon}"></div>`;
            } else {
                item.button.innerHTML = `<div class='btn__header'><div class=title>${title}</div></div>`;
            }
            item.button.parentElement.classList.add('btn')
            item.button.parentElement.classList.add('btn--with-dot')
            item.button.classList.add('btn--transparent')
        });
        splide.appendChild(sidebar);
        for (const block of splide.querySelectorAll('.splide__before-pagination') || []) {
            sidebar.appendChild(block)
        }
        sidebar.appendChild(pagination);

        for (const block of splide.querySelectorAll('.splide__after-pagination') || []) {
            sidebar.appendChild(block)
        }
    });
    splide.on('mounted', function(e) {
        for (const cel of splide.root.querySelectorAll('.splide:not(.is-initialized)')) {
            initSlider(cel, false);
        }
        /*
        for (const slider of splide.querySelectorAll('.splide > .splide__track > .splide__list > .splide__slide > .splide')) {
            initSlider(slider);
        }*/
    });
    splide.mount();
}

document.addEventListener('DOMContentLoaded', function() {
    for (const el of document.querySelectorAll('.tool > .splide:not(.is-initialized)')) {
        initSlider(el, true);
    }

    /*for (const el of document.querySelectorAll('.splide__slide--video')) {
        el.addEventListener('click', function(e) {
            const targetURL = el.dataset.url;
            for (const target of el.querySelectorAll('iframe')) {
                target.style.visibility = 'visible';
                target.src = targetURL;
            }
            for (const target of el.querySelectorAll('.splide__screen__description')) {
                target.style.display = 'none';
            }
            el.classList.add('is-playing')
        })
    }*/

    /*Array.prototype.forEach.call(
        document.querySelectorAll('.--with-scrollbar'),
        el => new SimpleBar()
    );*/

    for (const scrollbar of document.querySelectorAll('.--with-scrollbar')) {
        new SimpleBar(scrollbar)
    }
});
},{"@splidejs/splide":2,"simplebar":3}],2:[function(require,module,exports){
/*!
 * Splide.js
 * Version  : 3.5.0
 * License  : MIT
 * Copyright: 2021 Naotoshi Fujita
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const PROJECT_CODE = "splide";
const DATA_ATTRIBUTE = `data-${PROJECT_CODE}`;

const CREATED = 1;
const MOUNTED = 2;
const IDLE = 3;
const MOVING = 4;
const DESTROYED = 5;
const STATES = {
  CREATED,
  MOUNTED,
  IDLE,
  MOVING,
  DESTROYED
};

const DEFAULT_EVENT_PRIORITY = 10;
const DEFAULT_USER_EVENT_PRIORITY = 20;

function empty(array) {
  array.length = 0;
}

function isObject(subject) {
  return !isNull(subject) && typeof subject === "object";
}
function isArray(subject) {
  return Array.isArray(subject);
}
function isFunction(subject) {
  return typeof subject === "function";
}
function isString(subject) {
  return typeof subject === "string";
}
function isUndefined(subject) {
  return typeof subject === "undefined";
}
function isNull(subject) {
  return subject === null;
}
function isHTMLElement(subject) {
  return subject instanceof HTMLElement;
}

function toArray(value) {
  return isArray(value) ? value : [value];
}

function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}

function includes(array, value) {
  return array.indexOf(value) > -1;
}

function push(array, items) {
  array.push(...toArray(items));
  return array;
}

const arrayProto = Array.prototype;

function slice(arrayLike, start, end) {
  return arrayProto.slice.call(arrayLike, start, end);
}

function find(arrayLike, predicate) {
  return slice(arrayLike).filter(predicate)[0];
}

function toggleClass(elm, classes, add) {
  if (elm) {
    forEach(classes, (name) => {
      if (name) {
        elm.classList[add ? "add" : "remove"](name);
      }
    });
  }
}

function addClass(elm, classes) {
  toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
}

function append(parent, children) {
  forEach(children, parent.appendChild.bind(parent));
}

function before(nodes, ref) {
  forEach(nodes, (node) => {
    const parent = ref.parentNode;
    if (parent) {
      parent.insertBefore(node, ref);
    }
  });
}

function matches(elm, selector) {
  return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
}

function children(parent, selector) {
  return parent ? slice(parent.children).filter((child) => matches(child, selector)) : [];
}

function child(parent, selector) {
  return selector ? children(parent, selector)[0] : parent.firstElementChild;
}

function forOwn(object, iteratee, right) {
  if (object) {
    let keys = Object.keys(object);
    keys = right ? keys.reverse() : keys;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }
  return object;
}

function assign(object) {
  slice(arguments, 1).forEach((source) => {
    forOwn(source, (value, key) => {
      object[key] = source[key];
    });
  });
  return object;
}

function merge(object, source) {
  forOwn(source, (value, key) => {
    if (isArray(value)) {
      object[key] = value.slice();
    } else if (isObject(value)) {
      object[key] = merge(isObject(object[key]) ? object[key] : {}, value);
    } else {
      object[key] = value;
    }
  });
  return object;
}

function removeAttribute(elm, attrs) {
  if (elm) {
    forEach(attrs, (attr) => {
      elm.removeAttribute(attr);
    });
  }
}

function setAttribute(elm, attrs, value) {
  if (isObject(attrs)) {
    forOwn(attrs, (value2, name) => {
      setAttribute(elm, name, value2);
    });
  } else {
    isNull(value) ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
  }
}

function create(tag, attrs, parent) {
  const elm = document.createElement(tag);
  if (attrs) {
    isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
  }
  parent && append(parent, elm);
  return elm;
}

function style(elm, prop, value) {
  if (isUndefined(value)) {
    return getComputedStyle(elm)[prop];
  }
  if (!isNull(value)) {
    const { style: style2 } = elm;
    value = `${value}`;
    if (style2[prop] !== value) {
      style2[prop] = value;
    }
  }
}

function display(elm, display2) {
  style(elm, "display", display2);
}

function focus(elm) {
  elm["setActive"] && elm["setActive"]() || elm.focus({ preventScroll: true });
}

function getAttribute(elm, attr) {
  return elm.getAttribute(attr);
}

function hasClass(elm, className) {
  return elm && elm.classList.contains(className);
}

function rect(target) {
  return target.getBoundingClientRect();
}

function remove(nodes) {
  forEach(nodes, (node) => {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
}

function measure(parent, value) {
  if (isString(value)) {
    const div = create("div", { style: `width: ${value}; position: absolute;` }, parent);
    value = rect(div).width;
    remove(div);
  }
  return value;
}

function parseHtml(html) {
  return child(new DOMParser().parseFromString(html, "text/html").body);
}

function prevent(e, stopPropagation) {
  e.preventDefault();
  if (stopPropagation) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}

function query(parent, selector) {
  return parent && parent.querySelector(selector);
}

function queryAll(parent, selector) {
  return slice(parent.querySelectorAll(selector));
}

function removeClass(elm, classes) {
  toggleClass(elm, classes, false);
}

function unit(value) {
  return isString(value) ? value : value ? `${value}px` : "";
}

function assert(condition, message = "") {
  if (!condition) {
    throw new Error(`[${PROJECT_CODE}] ${message}`);
  }
}

function nextTick(callback) {
  setTimeout(callback);
}

const noop = () => {
};

function raf(func) {
  return requestAnimationFrame(func);
}

const { min, max, floor, ceil, abs } = Math;

function approximatelyEqual(x, y, epsilon) {
  return abs(x - y) < epsilon;
}

function between(number, minOrMax, maxOrMin, exclusive) {
  const minimum = min(minOrMax, maxOrMin);
  const maximum = max(minOrMax, maxOrMin);
  return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
}

function clamp(number, x, y) {
  const minimum = min(x, y);
  const maximum = max(x, y);
  return min(max(minimum, number), maximum);
}

function sign(x) {
  return +(x > 0) - +(x < 0);
}

function camelToKebab(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function format(string, replacements) {
  forEach(replacements, (replacement) => {
    string = string.replace("%s", `${replacement}`);
  });
  return string;
}

function pad(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

const ids = {};
function uniqueId(prefix) {
  return `${prefix}${pad(ids[prefix] = (ids[prefix] || 0) + 1)}`;
}

function EventBus() {
  let handlers = {};
  function on(events, callback, key, priority = DEFAULT_EVENT_PRIORITY) {
    forEachEvent(events, (event, namespace) => {
      handlers[event] = handlers[event] || [];
      push(handlers[event], {
        _event: event,
        _callback: callback,
        _namespace: namespace,
        _priority: priority,
        _key: key
      }).sort((handler1, handler2) => handler1._priority - handler2._priority);
    });
  }
  function off(events, key) {
    forEachEvent(events, (event, namespace) => {
      const eventHandlers = handlers[event];
      handlers[event] = eventHandlers && eventHandlers.filter((handler) => {
        return handler._key ? handler._key !== key : key || handler._namespace !== namespace;
      });
    });
  }
  function offBy(key) {
    forOwn(handlers, (eventHandlers, event) => {
      off(event, key);
    });
  }
  function emit(event) {
    (handlers[event] || []).forEach((handler) => {
      handler._callback.apply(handler, slice(arguments, 1));
    });
  }
  function destroy() {
    handlers = {};
  }
  function forEachEvent(events, iteratee) {
    toArray(events).join(" ").split(" ").forEach((eventNS) => {
      const fragments = eventNS.split(".");
      iteratee(fragments[0], fragments[1]);
    });
  }
  return {
    on,
    off,
    offBy,
    emit,
    destroy
  };
}

const EVENT_MOUNTED = "mounted";
const EVENT_READY = "ready";
const EVENT_MOVE = "move";
const EVENT_MOVED = "moved";
const EVENT_CLICK = "click";
const EVENT_ACTIVE = "active";
const EVENT_INACTIVE = "inactive";
const EVENT_VISIBLE = "visible";
const EVENT_HIDDEN = "hidden";
const EVENT_SLIDE_KEYDOWN = "slide:keydown";
const EVENT_REFRESH = "refresh";
const EVENT_UPDATED = "updated";
const EVENT_RESIZE = "resize";
const EVENT_RESIZED = "resized";
const EVENT_REPOSITIONED = "repositioned";
const EVENT_DRAG = "drag";
const EVENT_DRAGGING = "dragging";
const EVENT_DRAGGED = "dragged";
const EVENT_SCROLL = "scroll";
const EVENT_SCROLLED = "scrolled";
const EVENT_DESTROY = "destroy";
const EVENT_ARROWS_MOUNTED = "arrows:mounted";
const EVENT_ARROWS_UPDATED = "arrows:updated";
const EVENT_PAGINATION_MOUNTED = "pagination:mounted";
const EVENT_PAGINATION_UPDATED = "pagination:updated";
const EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
const EVENT_AUTOPLAY_PLAY = "autoplay:play";
const EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
const EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
const EVENT_LAZYLOAD_LOADED = "lazyload:loaded";

function EventInterface(Splide2) {
  const { event } = Splide2;
  const key = {};
  let listeners = [];
  function on(events, callback, priority) {
    event.on(events, callback, key, priority);
  }
  function off(events) {
    event.off(events, key);
  }
  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, (target, event2) => {
      listeners.push([target, event2, callback, options]);
      target.addEventListener(event2, callback, options);
    });
  }
  function unbind(targets, events, callback) {
    forEachEvent(targets, events, (target, event2) => {
      listeners = listeners.filter((listener) => {
        if (listener[0] === target && listener[1] === event2 && (!callback || listener[2] === callback)) {
          target.removeEventListener(event2, listener[2], listener[3]);
          return false;
        }
        return true;
      });
    });
  }
  function forEachEvent(targets, events, iteratee) {
    forEach(targets, (target) => {
      if (target) {
        events.split(" ").forEach(iteratee.bind(null, target));
      }
    });
  }
  function destroy() {
    listeners = listeners.filter((data) => unbind(data[0], data[1]));
    event.offBy(key);
  }
  event.on(EVENT_DESTROY, destroy, key);
  return {
    on,
    off,
    emit: event.emit,
    bind,
    unbind,
    destroy
  };
}

function RequestInterval(interval, onInterval, onUpdate, limit) {
  const { now } = Date;
  let startTime;
  let rate = 0;
  let id;
  let paused = true;
  let count = 0;
  function update() {
    if (!paused) {
      const elapsed = now() - startTime;
      if (elapsed >= interval) {
        rate = 1;
        startTime = now();
      } else {
        rate = elapsed / interval;
      }
      if (onUpdate) {
        onUpdate(rate);
      }
      if (rate === 1) {
        onInterval();
        if (limit && ++count >= limit) {
          return pause();
        }
      }
      raf(update);
    }
  }
  function start(resume) {
    !resume && cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    raf(update);
  }
  function pause() {
    paused = true;
  }
  function rewind() {
    startTime = now();
    rate = 0;
    if (onUpdate) {
      onUpdate(rate);
    }
  }
  function cancel() {
    cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }
  function set(time) {
    interval = time;
  }
  function isPaused() {
    return paused;
  }
  return {
    start,
    rewind,
    pause,
    cancel,
    set,
    isPaused
  };
}

function State(initialState) {
  let state = initialState;
  function set(value) {
    state = value;
  }
  function is(states) {
    return includes(toArray(states), state);
  }
  return { set, is };
}

function Throttle(func, duration) {
  let interval;
  function throttled() {
    if (!interval) {
      interval = RequestInterval(duration || 0, () => {
        func.apply(this, arguments);
        interval = null;
      }, null, 1);
      interval.start();
    }
  }
  return throttled;
}

function Options(Splide2, Components2, options) {
  const throttledObserve = Throttle(observe);
  let initialOptions;
  let points;
  let currPoint;
  function setup() {
    try {
      merge(options, JSON.parse(getAttribute(Splide2.root, DATA_ATTRIBUTE)));
    } catch (e) {
      assert(false, e.message);
    }
    initialOptions = merge({}, options);
    const { breakpoints } = options;
    if (breakpoints) {
      const isMin = options.mediaQuery === "min";
      points = Object.keys(breakpoints).sort((n, m) => isMin ? +m - +n : +n - +m).map((point) => [
        point,
        matchMedia(`(${isMin ? "min" : "max"}-width:${point}px)`)
      ]);
      observe();
    }
  }
  function mount() {
    if (points) {
      addEventListener("resize", throttledObserve);
    }
  }
  function destroy(completely) {
    if (completely) {
      removeEventListener("resize", throttledObserve);
    }
  }
  function observe() {
    const item = find(points, (item2) => item2[1].matches) || [];
    if (item[0] !== currPoint) {
      onMatch(currPoint = item[0]);
    }
  }
  function onMatch(point) {
    const newOptions = options.breakpoints[point] || initialOptions;
    if (newOptions.destroy) {
      Splide2.options = initialOptions;
      Splide2.destroy(newOptions.destroy === "completely");
    } else {
      if (Splide2.state.is(DESTROYED)) {
        destroy(true);
        Splide2.mount();
      }
      Splide2.options = newOptions;
    }
  }
  return {
    setup,
    mount,
    destroy
  };
}

const RTL = "rtl";
const TTB = "ttb";

const ORIENTATION_MAP = {
  marginRight: ["marginBottom", "marginLeft"],
  autoWidth: ["autoHeight"],
  fixedWidth: ["fixedHeight"],
  paddingLeft: ["paddingTop", "paddingRight"],
  paddingRight: ["paddingBottom", "paddingLeft"],
  width: ["height"],
  left: ["top", "right"],
  right: ["bottom", "left"],
  x: ["y"],
  X: ["Y"],
  Y: ["X"],
  ArrowLeft: ["ArrowUp", "ArrowRight"],
  ArrowRight: ["ArrowDown", "ArrowLeft"]
};
function Direction(Splide2, Components2, options) {
  function resolve(prop, axisOnly) {
    const { direction } = options;
    const index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
    return ORIENTATION_MAP[prop][index] || prop;
  }
  function orient(value) {
    return value * (options.direction === RTL ? 1 : -1);
  }
  return {
    resolve,
    orient
  };
}

const CLASS_ROOT = PROJECT_CODE;
const CLASS_SLIDER = `${PROJECT_CODE}__slider`;
const CLASS_TRACK = `${PROJECT_CODE}__track`;
const CLASS_LIST = `${PROJECT_CODE}__list`;
const CLASS_SLIDE = `${PROJECT_CODE}__slide`;
const CLASS_CLONE = `${CLASS_SLIDE}--clone`;
const CLASS_CONTAINER = `${CLASS_SLIDE}__container`;
const CLASS_ARROWS = `${PROJECT_CODE}__arrows`;
const CLASS_ARROW = `${PROJECT_CODE}__arrow`;
const CLASS_ARROW_PREV = `${CLASS_ARROW}--prev`;
const CLASS_ARROW_NEXT = `${CLASS_ARROW}--next`;
const CLASS_PAGINATION = `${PROJECT_CODE}__pagination`;
const CLASS_PAGINATION_PAGE = `${CLASS_PAGINATION}__page`;
const CLASS_PROGRESS = `${PROJECT_CODE}__progress`;
const CLASS_PROGRESS_BAR = `${CLASS_PROGRESS}__bar`;
const CLASS_AUTOPLAY = `${PROJECT_CODE}__autoplay`;
const CLASS_PLAY = `${PROJECT_CODE}__play`;
const CLASS_PAUSE = `${PROJECT_CODE}__pause`;
const CLASS_SPINNER = `${PROJECT_CODE}__spinner`;
const CLASS_INITIALIZED = "is-initialized";
const CLASS_ACTIVE = "is-active";
const CLASS_PREV = "is-prev";
const CLASS_NEXT = "is-next";
const CLASS_VISIBLE = "is-visible";
const CLASS_LOADING = "is-loading";
const STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING];
const CLASSES = {
  slide: CLASS_SLIDE,
  clone: CLASS_CLONE,
  arrows: CLASS_ARROWS,
  arrow: CLASS_ARROW,
  prev: CLASS_ARROW_PREV,
  next: CLASS_ARROW_NEXT,
  pagination: CLASS_PAGINATION,
  page: CLASS_PAGINATION_PAGE,
  spinner: CLASS_SPINNER
};

function Elements(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  const { root } = Splide2;
  const elements = {};
  const slides = [];
  let classes;
  let slider;
  let track;
  let list;
  function setup() {
    collect();
    identify();
    addClass(root, classes = getClasses());
  }
  function mount() {
    on(EVENT_REFRESH, refresh, DEFAULT_EVENT_PRIORITY - 2);
    on(EVENT_UPDATED, update);
  }
  function destroy() {
    [root, track, list].forEach((elm) => {
      removeAttribute(elm, "style");
    });
    empty(slides);
    removeClass(root, classes);
  }
  function refresh() {
    destroy();
    setup();
  }
  function update() {
    removeClass(root, classes);
    addClass(root, classes = getClasses());
  }
  function collect() {
    slider = child(root, `.${CLASS_SLIDER}`);
    track = query(root, `.${CLASS_TRACK}`);
    list = child(track, `.${CLASS_LIST}`);
    assert(track && list, "A track/list element is missing.");
    push(slides, children(list, `.${CLASS_SLIDE}:not(.${CLASS_CLONE})`));
    const autoplay = find(`.${CLASS_AUTOPLAY}`);
    const arrows = find(`.${CLASS_ARROWS}`);
    assign(elements, {
      root,
      slider,
      track,
      list,
      slides,
      arrows,
      autoplay,
      prev: query(arrows, `.${CLASS_ARROW_PREV}`),
      next: query(arrows, `.${CLASS_ARROW_NEXT}`),
      bar: query(find(`.${CLASS_PROGRESS}`), `.${CLASS_PROGRESS_BAR}`),
      play: query(autoplay, `.${CLASS_PLAY}`),
      pause: query(autoplay, `.${CLASS_PAUSE}`)
    });
  }
  function identify() {
    const id = root.id || uniqueId(PROJECT_CODE);
    root.id = id;
    track.id = track.id || `${id}-track`;
    list.id = list.id || `${id}-list`;
  }
  function find(selector) {
    return child(root, selector) || child(slider, selector);
  }
  function getClasses() {
    return [
      `${CLASS_ROOT}--${options.type}`,
      `${CLASS_ROOT}--${options.direction}`,
      options.drag && `${CLASS_ROOT}--draggable`,
      options.isNavigation && `${CLASS_ROOT}--nav`,
      CLASS_ACTIVE
    ];
  }
  return assign(elements, {
    setup,
    mount,
    destroy
  });
}

const ROLE = "role";
const ARIA_CONTROLS = "aria-controls";
const ARIA_CURRENT = "aria-current";
const ARIA_LABEL = "aria-label";
const ARIA_HIDDEN = "aria-hidden";
const TAB_INDEX = "tabindex";
const DISABLED = "disabled";
const ARIA_ORIENTATION = "aria-orientation";
const ALL_ATTRIBUTES = [
  ROLE,
  ARIA_CONTROLS,
  ARIA_CURRENT,
  ARIA_LABEL,
  ARIA_HIDDEN,
  ARIA_ORIENTATION,
  TAB_INDEX,
  DISABLED
];

const SLIDE = "slide";
const LOOP = "loop";
const FADE = "fade";

function Slide$1(Splide2, index, slideIndex, slide) {
  const { on, emit, bind, destroy: destroyEvents } = EventInterface(Splide2);
  const { Components, root, options } = Splide2;
  const { isNavigation, updateOnMove } = options;
  const { resolve } = Components.Direction;
  const styles = getAttribute(slide, "style");
  const isClone = slideIndex > -1;
  const container = child(slide, `.${CLASS_CONTAINER}`);
  const focusableNodes = options.focusableNodes && queryAll(slide, options.focusableNodes);
  let destroyed;
  function mount() {
    if (!isClone) {
      slide.id = `${root.id}-slide${pad(index + 1)}`;
    }
    bind(slide, "click keydown", (e) => {
      emit(e.type === "click" ? EVENT_CLICK : EVENT_SLIDE_KEYDOWN, this, e);
    });
    on([EVENT_REFRESH, EVENT_REPOSITIONED, EVENT_MOVED, EVENT_SCROLLED], update.bind(this));
    on(EVENT_NAVIGATION_MOUNTED, initNavigation.bind(this));
    if (updateOnMove) {
      on(EVENT_MOVE, onMove.bind(this));
    }
  }
  function destroy() {
    destroyed = true;
    destroyEvents();
    removeClass(slide, STATUS_CLASSES);
    removeAttribute(slide, ALL_ATTRIBUTES);
    setAttribute(slide, "style", styles);
  }
  function initNavigation() {
    const idx = isClone ? slideIndex : index;
    const label = format(options.i18n.slideX, idx + 1);
    const controls = Splide2.splides.map((target) => target.splide.root.id).join(" ");
    setAttribute(slide, ARIA_LABEL, label);
    setAttribute(slide, ARIA_CONTROLS, controls);
    setAttribute(slide, ROLE, "menuitem");
    updateActivity.call(this, isActive());
  }
  function onMove(next, prev, dest) {
    if (!destroyed) {
      update.call(this);
      if (dest === index) {
        updateActivity.call(this, true);
      }
    }
  }
  function update() {
    if (!destroyed) {
      const { index: currIndex } = Splide2;
      updateActivity.call(this, isActive());
      updateVisibility.call(this, isVisible());
      toggleClass(slide, CLASS_PREV, index === currIndex - 1);
      toggleClass(slide, CLASS_NEXT, index === currIndex + 1);
    }
  }
  function updateActivity(active) {
    if (active !== hasClass(slide, CLASS_ACTIVE)) {
      toggleClass(slide, CLASS_ACTIVE, active);
      if (isNavigation) {
        setAttribute(slide, ARIA_CURRENT, active || null);
      }
      emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, this);
    }
  }
  function updateVisibility(visible) {
    const ariaHidden = !visible && !isActive();
    setAttribute(slide, ARIA_HIDDEN, ariaHidden || null);
    setAttribute(slide, TAB_INDEX, !ariaHidden && options.slideFocus ? 0 : null);
    if (focusableNodes) {
      focusableNodes.forEach((node) => {
        setAttribute(node, TAB_INDEX, ariaHidden ? -1 : null);
      });
    }
    if (visible !== hasClass(slide, CLASS_VISIBLE)) {
      toggleClass(slide, CLASS_VISIBLE, visible);
      emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, this);
    }
  }
  function style$1(prop, value, useContainer) {
    style(useContainer && container || slide, prop, value);
  }
  function isActive() {
    return Splide2.index === index;
  }
  function isVisible() {
    if (Splide2.is(FADE)) {
      return isActive();
    }
    const trackRect = rect(Components.Elements.track);
    const slideRect = rect(slide);
    const left = resolve("left");
    const right = resolve("right");
    return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
  }
  function isWithin(from, distance) {
    let diff = abs(from - index);
    if (!isClone && (options.rewind || Splide2.is(LOOP))) {
      diff = min(diff, Splide2.length - diff);
    }
    return diff <= distance;
  }
  return {
    index,
    slideIndex,
    slide,
    container,
    isClone,
    mount,
    destroy,
    style: style$1,
    isWithin
  };
}

function Slides(Splide2, Components2, options) {
  const { on, emit, bind } = EventInterface(Splide2);
  const { slides, list } = Components2.Elements;
  const Slides2 = [];
  function mount() {
    init();
    on(EVENT_REFRESH, refresh);
    on([EVENT_MOUNTED, EVENT_REFRESH], () => {
      Slides2.sort((Slide1, Slide2) => Slide1.index - Slide2.index);
    });
  }
  function init() {
    slides.forEach((slide, index) => {
      register(slide, index, -1);
    });
  }
  function destroy() {
    forEach$1((Slide2) => {
      Slide2.destroy();
    });
    empty(Slides2);
  }
  function refresh() {
    destroy();
    init();
  }
  function register(slide, index, slideIndex) {
    const object = Slide$1(Splide2, index, slideIndex, slide);
    object.mount();
    Slides2.push(object);
  }
  function get(excludeClones) {
    return excludeClones ? filter((Slide2) => !Slide2.isClone) : Slides2;
  }
  function getIn(page) {
    const { Controller } = Components2;
    const index = Controller.toIndex(page);
    const max = Controller.hasFocus() ? 1 : options.perPage;
    return filter((Slide2) => between(Slide2.index, index, index + max - 1));
  }
  function getAt(index) {
    return filter(index)[0];
  }
  function add(items, index) {
    forEach(items, (slide) => {
      if (isString(slide)) {
        slide = parseHtml(slide);
      }
      if (isHTMLElement(slide)) {
        const ref = slides[index];
        ref ? before(slide, ref) : append(list, slide);
        addClass(slide, options.classes.slide);
        observeImages(slide, emit.bind(null, EVENT_RESIZE));
      }
    });
    emit(EVENT_REFRESH);
  }
  function remove$1(matcher) {
    remove(filter(matcher).map((Slide2) => Slide2.slide));
    emit(EVENT_REFRESH);
  }
  function forEach$1(iteratee, excludeClones) {
    get(excludeClones).forEach(iteratee);
  }
  function filter(matcher) {
    return Slides2.filter(isFunction(matcher) ? matcher : (Slide2) => isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index));
  }
  function style(prop, value, useContainer) {
    forEach$1((Slide2) => {
      Slide2.style(prop, value, useContainer);
    });
  }
  function observeImages(elm, callback) {
    const images = queryAll(elm, "img");
    let { length } = images;
    if (length) {
      images.forEach((img) => {
        bind(img, "load error", () => {
          if (!--length) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  }
  function getLength(excludeClones) {
    return excludeClones ? slides.length : Slides2.length;
  }
  function isEnough() {
    return Slides2.length > options.perPage;
  }
  return {
    mount,
    destroy,
    register,
    get,
    getIn,
    getAt,
    add,
    remove: remove$1,
    forEach: forEach$1,
    filter,
    style,
    getLength,
    isEnough
  };
}

function Layout(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const { Slides } = Components2;
  const { resolve } = Components2.Direction;
  const { root, track, list } = Components2.Elements;
  const { getAt } = Slides;
  let vertical;
  let rootRect;
  function mount() {
    init();
    bind(window, "resize load", Throttle(emit.bind(this, EVENT_RESIZE)));
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on(EVENT_RESIZE, resize);
  }
  function init() {
    rootRect = null;
    vertical = options.direction === TTB;
    style(root, "maxWidth", unit(options.width));
    style(track, resolve("paddingLeft"), cssPadding(false));
    style(track, resolve("paddingRight"), cssPadding(true));
    resize();
  }
  function resize() {
    const newRect = rect(root);
    if (!rootRect || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
      style(track, "height", cssTrackHeight());
      Slides.style(resolve("marginRight"), unit(options.gap));
      Slides.style("width", cssSlideWidth() || null);
      setSlidesHeight();
      rootRect = newRect;
      emit(EVENT_RESIZED);
    }
  }
  function setSlidesHeight() {
    Slides.style("height", cssSlideHeight() || null, true);
  }
  function cssPadding(right) {
    const { padding } = options;
    const prop = resolve(right ? "right" : "left");
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  }
  function cssTrackHeight() {
    let height = "";
    if (vertical) {
      height = cssHeight();
      assert(height, "height or heightRatio is missing.");
      height = `calc(${height} - ${cssPadding(false)} - ${cssPadding(true)})`;
    }
    return height;
  }
  function cssHeight() {
    return unit(options.height || rect(list).width * options.heightRatio);
  }
  function cssSlideWidth() {
    return options.autoWidth ? "" : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
  }
  function cssSlideHeight() {
    return unit(options.fixedHeight) || (vertical ? options.autoHeight ? "" : cssSlideSize() : cssHeight());
  }
  function cssSlideSize() {
    const gap = unit(options.gap);
    return `calc((100%${gap && ` + ${gap}`})/${options.perPage || 1}${gap && ` - ${gap}`})`;
  }
  function listSize() {
    return rect(list)[resolve("width")];
  }
  function slideSize(index, withoutGap) {
    const Slide = getAt(index || 0);
    return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
  }
  function totalSize(index, withoutGap) {
    const Slide = getAt(index);
    if (Slide) {
      const right = rect(Slide.slide)[resolve("right")];
      const left = rect(list)[resolve("left")];
      return abs(right - left) + (withoutGap ? 0 : getGap());
    }
    return 0;
  }
  function sliderSize() {
    return totalSize(Splide2.length - 1, true) - totalSize(-1, true);
  }
  function getGap() {
    const Slide = getAt(0);
    return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
  }
  function getPadding(right) {
    return parseFloat(style(track, resolve(`padding${right ? "Right" : "Left"}`))) || 0;
  }
  return {
    mount,
    listSize,
    slideSize,
    sliderSize,
    totalSize,
    getPadding
  };
}

function Clones(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { Elements, Slides } = Components2;
  const { resolve } = Components2.Direction;
  const clones = [];
  let cloneCount;
  function mount() {
    init();
    on(EVENT_REFRESH, refresh);
    on([EVENT_UPDATED, EVENT_RESIZE], observe);
  }
  function init() {
    if (cloneCount = computeCloneCount()) {
      generate(cloneCount);
      emit(EVENT_RESIZE);
    }
  }
  function destroy() {
    remove(clones);
    empty(clones);
  }
  function refresh() {
    destroy();
    init();
  }
  function observe() {
    if (cloneCount < computeCloneCount()) {
      emit(EVENT_REFRESH);
    }
  }
  function generate(count) {
    const slides = Slides.get().slice();
    const { length } = slides;
    if (length) {
      while (slides.length < count) {
        push(slides, slides);
      }
      push(slides.slice(-count), slides.slice(0, count)).forEach((Slide, index) => {
        const isHead = index < count;
        const clone = cloneDeep(Slide.slide, index);
        isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
        push(clones, clone);
        Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
      });
    }
  }
  function cloneDeep(elm, index) {
    const clone = elm.cloneNode(true);
    addClass(clone, options.classes.clone);
    clone.id = `${Splide2.root.id}-clone${pad(index + 1)}`;
    return clone;
  }
  function computeCloneCount() {
    let { clones: clones2 } = options;
    if (!Splide2.is(LOOP)) {
      clones2 = 0;
    } else if (!clones2) {
      const fixedSize = measure(Elements.list, options[resolve("fixedWidth")]);
      const fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
      const baseCount = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage;
      clones2 = baseCount * (options.drag ? (options.flickMaxPages || 1) + 1 : 2);
    }
    return clones2;
  }
  return {
    mount,
    destroy
  };
}

function Move(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { slideSize, getPadding, totalSize, listSize, sliderSize } = Components2.Layout;
  const { resolve, orient } = Components2.Direction;
  const { list, track } = Components2.Elements;
  let Transition;
  function mount() {
    Transition = Components2.Transition;
    on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
  }
  function destroy() {
    removeAttribute(list, "style");
  }
  function reposition() {
    if (!isBusy()) {
      Components2.Scroll.cancel();
      jump(Splide2.index);
      emit(EVENT_REPOSITIONED);
    }
  }
  function move(dest, index, prev, callback) {
    if (!isBusy()) {
      const { set } = Splide2.state;
      const position = getPosition();
      if (dest !== index) {
        Transition.cancel();
        translate(shift(position, dest > index), true);
      }
      set(MOVING);
      emit(EVENT_MOVE, index, prev, dest);
      Transition.start(index, () => {
        set(IDLE);
        emit(EVENT_MOVED, index, prev, dest);
        if (options.trimSpace === "move" && dest !== prev && position === getPosition()) {
          Components2.Controller.go(dest > prev ? ">" : "<", false, callback);
        } else {
          callback && callback();
        }
      });
    }
  }
  function jump(index) {
    translate(toPosition(index, true));
  }
  function translate(position, preventLoop) {
    if (!Splide2.is(FADE)) {
      list.style.transform = `translate${resolve("X")}(${preventLoop ? position : loop(position)}px)`;
    }
  }
  function loop(position) {
    if (Splide2.is(LOOP)) {
      const diff = orient(position - getPosition());
      const exceededMin = exceededLimit(false, position) && diff < 0;
      const exceededMax = exceededLimit(true, position) && diff > 0;
      if (exceededMin || exceededMax) {
        position = shift(position, exceededMax);
      }
    }
    return position;
  }
  function shift(position, backwards) {
    const excess = position - getLimit(backwards);
    const size = sliderSize();
    position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
    return position;
  }
  function cancel() {
    translate(getPosition());
    Transition.cancel();
  }
  function toIndex(position) {
    const Slides = Components2.Slides.get();
    let index = 0;
    let minDistance = Infinity;
    for (let i = 0; i < Slides.length; i++) {
      const slideIndex = Slides[i].index;
      const distance = abs(toPosition(slideIndex, true) - position);
      if (distance <= minDistance) {
        minDistance = distance;
        index = slideIndex;
      } else {
        break;
      }
    }
    return index;
  }
  function toPosition(index, trimming) {
    const position = orient(totalSize(index - 1) - offset(index));
    return trimming ? trim(position) : position;
  }
  function getPosition() {
    const left = resolve("left");
    return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
  }
  function trim(position) {
    if (options.trimSpace && Splide2.is(SLIDE)) {
      position = clamp(position, 0, orient(sliderSize() - listSize()));
    }
    return position;
  }
  function offset(index) {
    const { focus } = options;
    return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
  }
  function getLimit(max) {
    return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
  }
  function isBusy() {
    return Splide2.state.is(MOVING) && options.waitForTransition;
  }
  function exceededLimit(max, position) {
    position = isUndefined(position) ? getPosition() : position;
    const exceededMin = max !== true && orient(position) < orient(getLimit(false));
    const exceededMax = max !== false && orient(position) > orient(getLimit(true));
    return exceededMin || exceededMax;
  }
  return {
    mount,
    destroy,
    move,
    jump,
    translate,
    shift,
    cancel,
    toIndex,
    toPosition,
    getPosition,
    getLimit,
    isBusy,
    exceededLimit
  };
}

function Controller(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  const { Move } = Components2;
  const { getPosition, getLimit } = Move;
  const { isEnough, getLength } = Components2.Slides;
  const isLoop = Splide2.is(LOOP);
  const isSlide = Splide2.is(SLIDE);
  let currIndex = options.start || 0;
  let prevIndex = currIndex;
  let slideCount;
  let perMove;
  let perPage;
  function mount() {
    init();
    on([EVENT_UPDATED, EVENT_REFRESH], init, DEFAULT_EVENT_PRIORITY - 1);
  }
  function init() {
    slideCount = getLength(true);
    perMove = options.perMove;
    perPage = options.perPage;
    currIndex = clamp(currIndex, 0, slideCount - 1);
  }
  function go(control, allowSameIndex, callback) {
    const dest = parse(control);
    if (options.useScroll) {
      scroll(dest, true, true, options.speed, callback);
    } else {
      const index = loop(dest);
      if (index > -1 && !Move.isBusy() && (allowSameIndex || index !== currIndex)) {
        setIndex(index);
        Move.move(dest, index, prevIndex, callback);
      }
    }
  }
  function scroll(destination, useIndex, snap, duration, callback) {
    const dest = useIndex ? destination : toDest(destination);
    Components2.Scroll.scroll(useIndex || snap ? Move.toPosition(dest, true) : destination, duration, () => {
      setIndex(Move.toIndex(Move.getPosition()));
      callback && callback();
    });
  }
  function parse(control) {
    let index = currIndex;
    if (isString(control)) {
      const [, indicator, number] = control.match(/([+\-<>])(\d+)?/) || [];
      if (indicator === "+" || indicator === "-") {
        index = computeDestIndex(currIndex + +`${indicator}${+number || 1}`, currIndex, true);
      } else if (indicator === ">") {
        index = number ? toIndex(+number) : getNext(true);
      } else if (indicator === "<") {
        index = getPrev(true);
      }
    } else {
      index = isLoop ? control : clamp(control, 0, getEnd());
    }
    return index;
  }
  function getNext(destination) {
    return getAdjacent(false, destination);
  }
  function getPrev(destination) {
    return getAdjacent(true, destination);
  }
  function getAdjacent(prev, destination) {
    const number = perMove || (hasFocus() ? 1 : perPage);
    const dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex);
    if (dest === -1 && isSlide) {
      if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
        return prev ? 0 : getEnd();
      }
    }
    return destination ? dest : loop(dest);
  }
  function computeDestIndex(dest, from, incremental) {
    if (isEnough()) {
      const end = getEnd();
      if (dest < 0 || dest > end) {
        if (between(0, dest, from, true) || between(end, from, dest, true)) {
          dest = toIndex(toPage(dest));
        } else {
          if (isLoop) {
            dest = perMove ? dest : dest < 0 ? -(slideCount % perPage || perPage) : slideCount;
          } else if (options.rewind) {
            dest = dest < 0 ? end : 0;
          } else {
            dest = -1;
          }
        }
      } else {
        if (!incremental && dest !== from) {
          dest = perMove ? dest : toIndex(toPage(from) + (dest < from ? -1 : 1));
        }
      }
    } else {
      dest = -1;
    }
    return dest;
  }
  function getEnd() {
    let end = slideCount - perPage;
    if (hasFocus() || isLoop && perMove) {
      end = slideCount - 1;
    }
    return max(end, 0);
  }
  function loop(index) {
    if (isLoop) {
      return isEnough() ? index % slideCount + (index < 0 ? slideCount : 0) : -1;
    }
    return index;
  }
  function toIndex(page) {
    return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
  }
  function toPage(index) {
    if (!hasFocus()) {
      index = between(index, slideCount - perPage, slideCount - 1) ? slideCount - 1 : index;
      index = floor(index / perPage);
    }
    return index;
  }
  function toDest(destination) {
    const closest = Move.toIndex(destination);
    return isSlide ? clamp(closest, 0, getEnd()) : closest;
  }
  function setIndex(index) {
    if (index !== currIndex) {
      prevIndex = currIndex;
      currIndex = index;
    }
  }
  function getIndex(prev) {
    return prev ? prevIndex : currIndex;
  }
  function hasFocus() {
    return !isUndefined(options.focus) || options.isNavigation;
  }
  return {
    mount,
    go,
    scroll,
    getNext,
    getPrev,
    getAdjacent,
    getEnd,
    setIndex,
    getIndex,
    toIndex,
    toPage,
    toDest,
    hasFocus
  };
}

const XML_NAME_SPACE = "http://www.w3.org/2000/svg";
const PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
const SIZE = 40;

function Arrows(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const { classes, i18n } = options;
  const { Elements, Controller } = Components2;
  let wrapper = Elements.arrows;
  let prev = Elements.prev;
  let next = Elements.next;
  let created;
  const arrows = {};
  function mount() {
    init();
    on(EVENT_UPDATED, init);
  }
  function init() {
    if (options.arrows) {
      if (!prev || !next) {
        createArrows();
      }
    }
    if (prev && next) {
      if (!arrows.prev) {
        const { id } = Elements.track;
        setAttribute(prev, ARIA_CONTROLS, id);
        setAttribute(next, ARIA_CONTROLS, id);
        arrows.prev = prev;
        arrows.next = next;
        listen();
        emit(EVENT_ARROWS_MOUNTED, prev, next);
      } else {
        display(wrapper, options.arrows === false ? "none" : "");
      }
    }
  }
  function destroy() {
    if (created) {
      remove(wrapper);
    } else {
      removeAttribute(prev, ALL_ATTRIBUTES);
      removeAttribute(next, ALL_ATTRIBUTES);
    }
  }
  function listen() {
    const { go } = Controller;
    on([EVENT_MOUNTED, EVENT_MOVED, EVENT_UPDATED, EVENT_REFRESH, EVENT_SCROLLED], update);
    bind(next, "click", () => {
      go(">", true);
    });
    bind(prev, "click", () => {
      go("<", true);
    });
  }
  function createArrows() {
    wrapper = create("div", classes.arrows);
    prev = createArrow(true);
    next = createArrow(false);
    created = true;
    append(wrapper, [prev, next]);
    before(wrapper, child(options.arrows === "slider" && Elements.slider || Splide2.root));
  }
  function createArrow(prev2) {
    const arrow = `<button class="${classes.arrow} ${prev2 ? classes.prev : classes.next}" type="button"><svg xmlns="${XML_NAME_SPACE}" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><path d="${options.arrowPath || PATH}" />`;
    return parseHtml(arrow);
  }
  function update() {
    const index = Splide2.index;
    const prevIndex = Controller.getPrev();
    const nextIndex = Controller.getNext();
    const prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
    const nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
    prev.disabled = prevIndex < 0;
    next.disabled = nextIndex < 0;
    setAttribute(prev, ARIA_LABEL, prevLabel);
    setAttribute(next, ARIA_LABEL, nextLabel);
    emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
  }
  return {
    arrows,
    mount,
    destroy
  };
}

const INTERVAL_DATA_ATTRIBUTE = `${DATA_ATTRIBUTE}-interval`;

function Autoplay(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), update);
  const { isPaused } = interval;
  const { Elements } = Components2;
  let hovered;
  let focused;
  let paused;
  function mount() {
    const { autoplay } = options;
    if (autoplay) {
      initButton(true);
      initButton(false);
      listen();
      if (autoplay !== "pause") {
        play();
      }
    }
  }
  function initButton(forPause) {
    const prop = forPause ? "pause" : "play";
    const button = Elements[prop];
    if (button) {
      setAttribute(button, ARIA_CONTROLS, Elements.track.id);
      setAttribute(button, ARIA_LABEL, options.i18n[prop]);
      bind(button, "click", forPause ? pause : play);
    }
  }
  function listen() {
    const { root } = Elements;
    if (options.pauseOnHover) {
      bind(root, "mouseenter mouseleave", (e) => {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }
    if (options.pauseOnFocus) {
      bind(root, "focusin focusout", (e) => {
        focused = e.type === "focusin";
        autoToggle();
      });
    }
    on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    on(EVENT_MOVE, updateInterval);
  }
  function play() {
    if (isPaused() && Components2.Slides.isEnough()) {
      interval.start(!options.resetProgress);
      focused = hovered = paused = false;
      emit(EVENT_AUTOPLAY_PLAY);
    }
  }
  function pause(manual = true) {
    if (!isPaused()) {
      interval.pause();
      emit(EVENT_AUTOPLAY_PAUSE);
    }
    paused = manual;
  }
  function autoToggle() {
    if (!paused) {
      if (!hovered && !focused) {
        play();
      } else {
        pause(false);
      }
    }
  }
  function update(rate) {
    const { bar } = Elements;
    bar && style(bar, "width", `${rate * 100}%`);
    emit(EVENT_AUTOPLAY_PLAYING, rate);
  }
  function updateInterval() {
    const Slide = Components2.Slides.getAt(Splide2.index);
    interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
  }
  return {
    mount,
    destroy: interval.cancel,
    play,
    pause,
    isPaused
  };
}

function Cover(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  function mount() {
    if (options.cover) {
      on(EVENT_LAZYLOAD_LOADED, (img, Slide) => {
        toggle(true, img, Slide);
      });
      on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply.bind(null, true));
    }
  }
  function destroy() {
    apply(false);
  }
  function apply(cover) {
    Components2.Slides.forEach((Slide) => {
      const img = child(Slide.container || Slide.slide, "img");
      if (img && img.src) {
        toggle(cover, img, Slide);
      }
    });
  }
  function toggle(cover, img, Slide) {
    Slide.style("background", cover ? `center/cover no-repeat url("${img.src}")` : "", true);
    display(img, cover ? "none" : "");
  }
  return {
    mount,
    destroy
  };
}

const BOUNCE_DIFF_THRESHOLD = 10;
const BOUNCE_DURATION = 600;
const FRICTION_FACTOR = 0.6;
const BASE_VELOCITY = 1.5;
const MIN_DURATION = 800;

function Scroll(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { Move } = Components2;
  const { getPosition, getLimit, exceededLimit } = Move;
  let interval;
  let scrollCallback;
  function mount() {
    on(EVENT_MOVE, clear);
    on([EVENT_UPDATED, EVENT_REFRESH], cancel);
  }
  function scroll(destination, duration, callback, suppressConstraint) {
    const start = getPosition();
    let friction = 1;
    duration = duration || computeDuration(abs(destination - start));
    scrollCallback = callback;
    clear();
    interval = RequestInterval(duration, onScrolled, (rate) => {
      const position = getPosition();
      const target = start + (destination - start) * easing(rate);
      const diff = (target - getPosition()) * friction;
      Move.translate(position + diff);
      if (Splide2.is(SLIDE) && !suppressConstraint && exceededLimit()) {
        friction *= FRICTION_FACTOR;
        if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
          bounce(exceededLimit(false));
        }
      }
    }, 1);
    emit(EVENT_SCROLL);
    interval.start();
  }
  function bounce(backwards) {
    scroll(getLimit(!backwards), BOUNCE_DURATION, null, true);
  }
  function onScrolled() {
    const position = getPosition();
    const index = Move.toIndex(position);
    if (!between(index, 0, Splide2.length - 1)) {
      Move.translate(Move.shift(position, index > 0), true);
    }
    scrollCallback && scrollCallback();
    emit(EVENT_SCROLLED);
  }
  function computeDuration(distance) {
    return max(distance / BASE_VELOCITY, MIN_DURATION);
  }
  function clear() {
    if (interval) {
      interval.cancel();
    }
  }
  function cancel() {
    if (interval && !interval.isPaused()) {
      clear();
      onScrolled();
    }
  }
  function easing(t) {
    const { easingFunc } = options;
    return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
  }
  return {
    mount,
    destroy: clear,
    scroll,
    cancel
  };
}

const SCROLL_LISTENER_OPTIONS = { passive: false, capture: true };

const FRICTION = 5;
const LOG_INTERVAL = 200;
const POINTER_DOWN_EVENTS = "touchstart mousedown";
const POINTER_MOVE_EVENTS = "touchmove mousemove";
const POINTER_UP_EVENTS = "touchend touchcancel mouseup";

function Drag(Splide2, Components2, options) {
  const { on, emit, bind, unbind } = EventInterface(Splide2);
  const { Move, Scroll, Controller } = Components2;
  const { track } = Components2.Elements;
  const { resolve, orient } = Components2.Direction;
  const { getPosition, exceededLimit } = Move;
  let basePosition;
  let baseEvent;
  let prevBaseEvent;
  let lastEvent;
  let isFree;
  let dragging;
  let hasExceeded = false;
  let clickPrevented;
  let disabled;
  let target;
  function mount() {
    bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
    bind(track, "click", onClick, { capture: true });
    bind(track, "dragstart", prevent);
    on([EVENT_MOUNTED, EVENT_UPDATED], init);
  }
  function init() {
    const { drag } = options;
    disable(!drag);
    isFree = drag === "free";
  }
  function onPointerDown(e) {
    if (!disabled) {
      const { noDrag } = options;
      const isTouch = isTouchEvent(e);
      const isDraggable = !noDrag || !matches(e.target, noDrag);
      if (isDraggable && (isTouch || !e.button)) {
        if (!Move.isBusy()) {
          target = isTouch ? track : window;
          prevBaseEvent = null;
          lastEvent = null;
          clickPrevented = false;
          bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
          bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
          Move.cancel();
          Scroll.cancel();
          save(e);
        } else {
          prevent(e, true);
        }
      }
    }
  }
  function onPointerMove(e) {
    if (!lastEvent) {
      emit(EVENT_DRAG);
    }
    lastEvent = e;
    if (e.cancelable) {
      const diff = coordOf(e) - coordOf(baseEvent);
      if (dragging) {
        Move.translate(basePosition + constrain(diff));
        const expired = timeOf(e) - timeOf(baseEvent) > LOG_INTERVAL;
        const exceeded = hasExceeded !== (hasExceeded = exceededLimit());
        if (expired || exceeded) {
          save(e);
        }
        emit(EVENT_DRAGGING);
        clickPrevented = true;
        prevent(e);
      } else {
        let { dragMinThreshold: thresholds } = options;
        thresholds = isObject(thresholds) ? thresholds : { mouse: 0, touch: +thresholds || 10 };
        dragging = abs(diff) > (isTouchEvent(e) ? thresholds.touch : thresholds.mouse);
        if (isSliderDirection()) {
          prevent(e);
        }
      }
    }
  }
  function onPointerUp(e) {
    unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
    unbind(target, POINTER_UP_EVENTS, onPointerUp);
    const { index } = Splide2;
    if (lastEvent) {
      if (dragging || e.cancelable && isSliderDirection()) {
        const velocity = computeVelocity(e);
        const destination = computeDestination(velocity);
        if (isFree) {
          Controller.scroll(destination);
        } else if (Splide2.is(FADE)) {
          Controller.go(index + orient(sign(velocity)));
        } else {
          Controller.go(Controller.toDest(destination), true);
        }
        prevent(e);
      }
      emit(EVENT_DRAGGED);
    } else {
      if (!isFree && getPosition() !== Move.toPosition(index)) {
        Controller.go(index, true);
      }
    }
    dragging = false;
  }
  function save(e) {
    prevBaseEvent = baseEvent;
    baseEvent = e;
    basePosition = getPosition();
  }
  function onClick(e) {
    if (!disabled && clickPrevented) {
      prevent(e, true);
    }
  }
  function isSliderDirection() {
    const diffX = abs(coordOf(lastEvent) - coordOf(baseEvent));
    const diffY = abs(coordOf(lastEvent, true) - coordOf(baseEvent, true));
    return diffX > diffY;
  }
  function computeVelocity(e) {
    if (Splide2.is(LOOP) || !hasExceeded) {
      const base = baseEvent === lastEvent && prevBaseEvent || baseEvent;
      const diffCoord = coordOf(lastEvent) - coordOf(base);
      const diffTime = timeOf(e) - timeOf(base);
      const isFlick = timeOf(e) - timeOf(lastEvent) < LOG_INTERVAL;
      if (diffTime && isFlick) {
        return diffCoord / diffTime;
      }
    }
    return 0;
  }
  function computeDestination(velocity) {
    return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
  }
  function coordOf(e, orthogonal) {
    return (isTouchEvent(e) ? e.touches[0] : e)[`page${resolve(orthogonal ? "Y" : "X")}`];
  }
  function timeOf(e) {
    return e.timeStamp;
  }
  function constrain(diff) {
    return diff / (hasExceeded && Splide2.is(SLIDE) ? FRICTION : 1);
  }
  function isTouchEvent(e) {
    return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
  }
  function isDragging() {
    return dragging;
  }
  function disable(value) {
    disabled = value;
  }
  return {
    mount,
    disable,
    isDragging
  };
}

const IE_ARROW_KEYS = ["Left", "Right", "Up", "Down"];
function Keyboard(Splide2, Components2, options) {
  const { on, bind, unbind } = EventInterface(Splide2);
  const { root } = Components2.Elements;
  const { resolve } = Components2.Direction;
  let target;
  let disabled;
  function mount() {
    init();
    on(EVENT_UPDATED, onUpdated);
    on(EVENT_MOVE, onMove);
  }
  function init() {
    const { keyboard = "global" } = options;
    if (keyboard) {
      if (keyboard === "focused") {
        target = root;
        setAttribute(root, TAB_INDEX, 0);
      } else {
        target = window;
      }
      bind(target, "keydown", onKeydown);
    }
  }
  function destroy() {
    unbind(target, "keydown");
    if (isHTMLElement(target)) {
      removeAttribute(target, TAB_INDEX);
    }
  }
  function onMove() {
    disabled = true;
    nextTick(() => {
      disabled = false;
    });
  }
  function onUpdated() {
    destroy();
    init();
  }
  function onKeydown(e) {
    if (!disabled) {
      const { key } = e;
      const normalizedKey = includes(IE_ARROW_KEYS, key) ? `Arrow${key}` : key;
      if (normalizedKey === resolve("ArrowLeft")) {
        Splide2.go("<");
      } else if (normalizedKey === resolve("ArrowRight")) {
        Splide2.go(">");
      }
    }
  }
  return {
    mount,
    destroy
  };
}

const SRC_DATA_ATTRIBUTE = `${DATA_ATTRIBUTE}-lazy`;
const SRCSET_DATA_ATTRIBUTE = `${SRC_DATA_ATTRIBUTE}-srcset`;
const IMAGE_SELECTOR = `[${SRC_DATA_ATTRIBUTE}], [${SRCSET_DATA_ATTRIBUTE}]`;

function LazyLoad(Splide2, Components2, options) {
  const { on, off, bind, emit } = EventInterface(Splide2);
  const isSequential = options.lazyLoad === "sequential";
  let images = [];
  let index = 0;
  function mount() {
    if (options.lazyLoad) {
      on([EVENT_MOUNTED, EVENT_REFRESH], () => {
        destroy();
        init();
      });
      if (!isSequential) {
        on([EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED], observe);
      }
    }
  }
  function init() {
    Components2.Slides.forEach((_Slide) => {
      queryAll(_Slide.slide, IMAGE_SELECTOR).forEach((_img) => {
        const src = getAttribute(_img, SRC_DATA_ATTRIBUTE);
        const srcset = getAttribute(_img, SRCSET_DATA_ATTRIBUTE);
        if (src !== _img.src || srcset !== _img.srcset) {
          const _spinner = create("span", options.classes.spinner, _img.parentElement);
          setAttribute(_spinner, ROLE, "presentation");
          images.push({ _img, _Slide, src, srcset, _spinner });
          !_img.src && display(_img, "none");
        }
      });
    });
    if (isSequential) {
      loadNext();
    }
  }
  function destroy() {
    index = 0;
    images = [];
  }
  function observe() {
    images = images.filter((data) => {
      const distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
      if (data._Slide.isWithin(Splide2.index, distance)) {
        return load(data);
      }
      return true;
    });
    if (!images.length) {
      off(EVENT_MOVED);
    }
  }
  function load(data) {
    const { _img } = data;
    addClass(data._Slide.slide, CLASS_LOADING);
    bind(_img, "load error", (e) => {
      onLoad(data, e.type === "error");
    });
    ["src", "srcset"].forEach((name) => {
      if (data[name]) {
        setAttribute(_img, name, data[name]);
        removeAttribute(_img, name === "src" ? SRC_DATA_ATTRIBUTE : SRCSET_DATA_ATTRIBUTE);
      }
    });
  }
  function onLoad(data, error) {
    const { _Slide } = data;
    removeClass(_Slide.slide, CLASS_LOADING);
    if (!error) {
      remove(data._spinner);
      display(data._img, "");
      emit(EVENT_LAZYLOAD_LOADED, data._img, _Slide);
      emit(EVENT_RESIZE);
    }
    if (isSequential) {
      loadNext();
    }
  }
  function loadNext() {
    if (index < images.length) {
      load(images[index++]);
    }
  }
  return {
    mount,
    destroy
  };
}

function Pagination(Splide2, Components2, options) {
  const { on, emit, bind, unbind } = EventInterface(Splide2);
  const { Slides, Elements, Controller } = Components2;
  const { hasFocus, getIndex } = Controller;
  const items = [];
  let list;
  function mount() {
    init();
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on([EVENT_MOVE, EVENT_SCROLLED], update);
  }
  function init() {
    destroy();
    if (options.pagination && Slides.isEnough()) {
      createPagination();
      emit(EVENT_PAGINATION_MOUNTED, { list, items }, getAt(Splide2.index));
      update();
    }
  }
  function destroy() {
    if (list) {
      remove(list);
      items.forEach((item) => {
        unbind(item.button, "click");
      });
      empty(items);
      list = null;
    }
  }
  function createPagination() {
    const { length } = Splide2;
    const { classes, i18n, perPage } = options;
    const parent = options.pagination === "slider" && Elements.slider || Elements.root;
    const max = hasFocus() ? length : ceil(length / perPage);
    list = create("ul", classes.pagination, parent);
    for (let i = 0; i < max; i++) {
      const li = create("li", null, list);
      const button = create("button", { class: classes.page, type: "button" }, li);
      const controls = Slides.getIn(i).map((Slide) => Slide.slide.id);
      const text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
      bind(button, "click", onClick.bind(null, i));
      setAttribute(button, ARIA_CONTROLS, controls.join(" "));
      setAttribute(button, ARIA_LABEL, format(text, i + 1));
      items.push({ li, button, page: i });
    }
  }
  function onClick(page) {
    Controller.go(`>${page}`, true, () => {
      const Slide = Slides.getAt(Controller.toIndex(page));
      Slide && focus(Slide.slide);
    });
  }
  function getAt(index) {
    return items[Controller.toPage(index)];
  }
  function update() {
    const prev = getAt(getIndex(true));
    const curr = getAt(getIndex());
    if (prev) {
      removeClass(prev.button, CLASS_ACTIVE);
      removeAttribute(prev.button, ARIA_CURRENT);
    }
    if (curr) {
      addClass(curr.button, CLASS_ACTIVE);
      setAttribute(curr.button, ARIA_CURRENT, true);
    }
    emit(EVENT_PAGINATION_UPDATED, { list, items }, prev, curr);
  }
  return {
    items,
    mount,
    destroy,
    getAt
  };
}

const TRIGGER_KEYS = [" ", "Enter", "Spacebar"];
function Sync(Splide2, Components2, options) {
  const { list } = Components2.Elements;
  const events = [];
  function mount() {
    Splide2.splides.forEach((target) => {
      !target.isParent && sync(target.splide);
    });
    if (options.isNavigation) {
      navigate();
    }
  }
  function destroy() {
    removeAttribute(list, ALL_ATTRIBUTES);
    events.forEach((event) => {
      event.destroy();
    });
    empty(events);
  }
  function remount() {
    destroy();
    mount();
  }
  function sync(splide) {
    [Splide2, splide].forEach((instance) => {
      const event = EventInterface(instance);
      const target = instance === Splide2 ? splide : Splide2;
      event.on(EVENT_MOVE, (index, prev, dest) => {
        target.go(target.is(LOOP) ? dest : index);
      });
      events.push(event);
    });
  }
  function navigate() {
    const event = EventInterface(Splide2);
    const { on } = event;
    on(EVENT_CLICK, onClick);
    on(EVENT_SLIDE_KEYDOWN, onKeydown);
    on([EVENT_MOUNTED, EVENT_UPDATED], update);
    setAttribute(list, ROLE, "menu");
    events.push(event);
    event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
  }
  function update() {
    setAttribute(list, ARIA_ORIENTATION, options.direction !== TTB ? "horizontal" : null);
  }
  function onClick(Slide) {
    Splide2.go(Slide.index);
  }
  function onKeydown(Slide, e) {
    if (includes(TRIGGER_KEYS, e.key)) {
      onClick(Slide);
      prevent(e);
    }
  }
  return {
    mount,
    destroy,
    remount
  };
}

function Wheel(Splide2, Components2, options) {
  const { bind } = EventInterface(Splide2);
  function mount() {
    if (options.wheel) {
      bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
    }
  }
  function onWheel(e) {
    if (e.cancelable) {
      const { deltaY } = e;
      if (deltaY) {
        const backwards = deltaY < 0;
        Splide2.go(backwards ? "<" : ">");
        shouldPrevent(backwards) && prevent(e);
      }
    }
  }
  function shouldPrevent(backwards) {
    return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
  }
  return {
    mount
  };
}

var ComponentConstructors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Options: Options,
  Direction: Direction,
  Elements: Elements,
  Slides: Slides,
  Layout: Layout,
  Clones: Clones,
  Move: Move,
  Controller: Controller,
  Arrows: Arrows,
  Autoplay: Autoplay,
  Cover: Cover,
  Scroll: Scroll,
  Drag: Drag,
  Keyboard: Keyboard,
  LazyLoad: LazyLoad,
  Pagination: Pagination,
  Sync: Sync,
  Wheel: Wheel
});

const I18N = {
  prev: "Previous slide",
  next: "Next slide",
  first: "Go to first slide",
  last: "Go to last slide",
  slideX: "Go to slide %s",
  pageX: "Go to page %s",
  play: "Start autoplay",
  pause: "Pause autoplay"
};

const DEFAULTS = {
  type: "slide",
  speed: 400,
  waitForTransition: true,
  perPage: 1,
  arrows: true,
  pagination: true,
  interval: 5e3,
  pauseOnHover: true,
  pauseOnFocus: true,
  resetProgress: true,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  drag: true,
  direction: "ltr",
  slideFocus: true,
  trimSpace: true,
  focusableNodes: "a, button, textarea, input, select, iframe",
  classes: CLASSES,
  i18n: I18N
};

function Fade(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  function mount() {
    on([EVENT_MOUNTED, EVENT_REFRESH], () => {
      nextTick(() => {
        Components2.Slides.style("transition", `opacity ${options.speed}ms ${options.easing}`);
      });
    });
  }
  function start(index, done) {
    const { track } = Components2.Elements;
    style(track, "height", unit(rect(track).height));
    nextTick(() => {
      done();
      style(track, "height", "");
    });
  }
  return {
    mount,
    start,
    cancel: noop
  };
}

function Slide(Splide2, Components2, options) {
  const { bind } = EventInterface(Splide2);
  const { Move, Controller } = Components2;
  const { list } = Components2.Elements;
  let endCallback;
  function mount() {
    bind(list, "transitionend", (e) => {
      if (e.target === list && endCallback) {
        cancel();
        endCallback();
      }
    });
  }
  function start(index, done) {
    const destination = Move.toPosition(index, true);
    const position = Move.getPosition();
    const speed = getSpeed(index);
    if (abs(destination - position) >= 1 && speed >= 1) {
      apply(`transform ${speed}ms ${options.easing}`);
      Move.translate(destination, true);
      endCallback = done;
    } else {
      Move.jump(index);
      done();
    }
  }
  function cancel() {
    apply("");
  }
  function getSpeed(index) {
    const { rewindSpeed } = options;
    if (Splide2.is(SLIDE) && rewindSpeed) {
      const prev = Controller.getIndex(true);
      const end = Controller.getEnd();
      if (prev === 0 && index >= end || prev >= end && index === 0) {
        return rewindSpeed;
      }
    }
    return options.speed;
  }
  function apply(transition) {
    style(list, "transition", transition);
  }
  return {
    mount,
    start,
    cancel
  };
}

const _Splide = class {
  constructor(target, options) {
    this.event = EventBus();
    this.Components = {};
    this.state = State(CREATED);
    this.splides = [];
    this._options = {};
    this._Extensions = {};
    const root = isString(target) ? query(document, target) : target;
    assert(root, `${root} is invalid.`);
    this.root = root;
    merge(DEFAULTS, _Splide.defaults);
    merge(merge(this._options, DEFAULTS), options || {});
  }
  mount(Extensions, Transition) {
    const { state, Components: Components2 } = this;
    assert(state.is([CREATED, DESTROYED]), "Already mounted!");
    state.set(CREATED);
    this._Components = Components2;
    this._Transition = Transition || this._Transition || (this.is(FADE) ? Fade : Slide);
    this._Extensions = Extensions || this._Extensions;
    const Constructors = assign({}, ComponentConstructors, this._Extensions, { Transition: this._Transition });
    forOwn(Constructors, (Component, key) => {
      const component = Component(this, Components2, this._options);
      Components2[key] = component;
      component.setup && component.setup();
    });
    forOwn(Components2, (component) => {
      component.mount && component.mount();
    });
    this.emit(EVENT_MOUNTED);
    addClass(this.root, CLASS_INITIALIZED);
    state.set(IDLE);
    this.emit(EVENT_READY);
    return this;
  }
  sync(splide) {
    this.splides.push({ splide });
    splide.splides.push({ splide: this, isParent: true });
    if (this.state.is(IDLE)) {
      this._Components.Sync.remount();
      splide.Components.Sync.remount();
    }
    return this;
  }
  go(control) {
    this._Components.Controller.go(control);
    return this;
  }
  on(events, callback) {
    this.event.on(events, callback, null, DEFAULT_USER_EVENT_PRIORITY);
    return this;
  }
  off(events) {
    this.event.off(events);
    return this;
  }
  emit(event) {
    this.event.emit(event, ...slice(arguments, 1));
    return this;
  }
  add(slides, index) {
    this._Components.Slides.add(slides, index);
    return this;
  }
  remove(matcher) {
    this._Components.Slides.remove(matcher);
    return this;
  }
  is(type) {
    return this._options.type === type;
  }
  refresh() {
    this.emit(EVENT_REFRESH);
    return this;
  }
  destroy(completely = true) {
    const { event, state } = this;
    if (state.is(CREATED)) {
      event.on(EVENT_READY, this.destroy.bind(this, completely), this);
    } else {
      forOwn(this._Components, (component) => {
        component.destroy && component.destroy(completely);
      }, true);
      event.emit(EVENT_DESTROY);
      event.destroy();
      completely && empty(this.splides);
      state.set(DESTROYED);
    }
    return this;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    const { _options } = this;
    merge(_options, options);
    if (!this.state.is(CREATED)) {
      this.emit(EVENT_UPDATED, _options);
    }
  }
  get length() {
    return this._Components.Slides.getLength(true);
  }
  get index() {
    return this._Components.Controller.getIndex();
  }
};
let Splide = _Splide;
Splide.defaults = {};
Splide.STATES = STATES;

const CLASS_RENDERED = "is-rendered";

const RENDERER_DEFAULT_CONFIG = {
  listTag: "ul",
  slideTag: "li"
};

class Style {
  constructor(id, options) {
    this.styles = {};
    this.id = id;
    this.options = options;
  }
  rule(selector, prop, value, breakpoint) {
    breakpoint = breakpoint || "default";
    const selectors = this.styles[breakpoint] = this.styles[breakpoint] || {};
    const styles = selectors[selector] = selectors[selector] || {};
    styles[prop] = value;
  }
  build() {
    let css = "";
    if (this.styles.default) {
      css += this.buildSelectors(this.styles.default);
    }
    Object.keys(this.styles).sort((n, m) => this.options.mediaQuery === "min" ? +n - +m : +m - +n).forEach((breakpoint) => {
      if (breakpoint !== "default") {
        css += `@media screen and (max-width: ${breakpoint}px) {`;
        css += this.buildSelectors(this.styles[breakpoint]);
        css += `}`;
      }
    });
    return css;
  }
  buildSelectors(selectors) {
    let css = "";
    forOwn(selectors, (styles, selector) => {
      selector = `#${this.id} ${selector}`.trim();
      css += `${selector} {`;
      forOwn(styles, (value, prop) => {
        if (value || value === 0) {
          css += `${prop}: ${value};`;
        }
      });
      css += "}";
    });
    return css;
  }
}

class SplideRenderer {
  constructor(contents, options, config, defaults) {
    this.slides = [];
    this.options = {};
    this.breakpoints = [];
    merge(DEFAULTS, defaults || {});
    merge(merge(this.options, DEFAULTS), options || {});
    this.contents = contents;
    this.config = assign({}, RENDERER_DEFAULT_CONFIG, config || {});
    this.id = this.config.id || uniqueId("splide");
    this.Style = new Style(this.id, this.options);
    this.Direction = Direction(null, null, this.options);
    assert(this.contents.length, "Provide at least 1 content.");
    this.init();
  }
  static clean(splide) {
    const { on } = EventInterface(splide);
    const { root } = splide;
    const clones = queryAll(root, `.${CLASS_CLONE}`);
    on(EVENT_MOUNTED, () => {
      remove(child(root, "style"));
    });
    remove(clones);
  }
  init() {
    this.parseBreakpoints();
    this.initSlides();
    this.registerRootStyles();
    this.registerTrackStyles();
    this.registerSlideStyles();
    this.registerListStyles();
  }
  initSlides() {
    push(this.slides, this.contents.map((content, index) => {
      content = isString(content) ? { html: content } : content;
      content.styles = content.styles || {};
      content.attrs = content.attrs || {};
      this.cover(content);
      const classes = `${this.options.classes.slide} ${index === 0 ? CLASS_ACTIVE : ""}`;
      assign(content.attrs, {
        class: `${classes} ${content.attrs.class || ""}`.trim(),
        style: this.buildStyles(content.styles)
      });
      return content;
    }));
    if (this.isLoop()) {
      this.generateClones(this.slides);
    }
  }
  registerRootStyles() {
    this.breakpoints.forEach(([width, options]) => {
      this.Style.rule(" ", "max-width", unit(options.width), width);
    });
  }
  registerTrackStyles() {
    const { Style: Style2 } = this;
    const selector = `.${CLASS_TRACK}`;
    this.breakpoints.forEach(([width, options]) => {
      Style2.rule(selector, this.resolve("paddingLeft"), this.cssPadding(options, false), width);
      Style2.rule(selector, this.resolve("paddingRight"), this.cssPadding(options, true), width);
      Style2.rule(selector, "height", this.cssTrackHeight(options), width);
    });
  }
  registerListStyles() {
    const { Style: Style2 } = this;
    const selector = `.${CLASS_LIST}`;
    this.breakpoints.forEach(([width, options]) => {
      Style2.rule(selector, "transform", this.buildTranslate(options), width);
      if (!this.cssSlideHeight(options)) {
        Style2.rule(selector, "aspect-ratio", this.cssAspectRatio(options), width);
      }
    });
  }
  registerSlideStyles() {
    const { Style: Style2 } = this;
    const selector = `.${CLASS_SLIDE}`;
    this.breakpoints.forEach(([width, options]) => {
      Style2.rule(selector, "width", this.cssSlideWidth(options), width);
      Style2.rule(selector, "height", this.cssSlideHeight(options) || "100%", width);
      Style2.rule(selector, this.resolve("marginRight"), unit(options.gap) || "0px", width);
      Style2.rule(`${selector} > img`, "display", options.cover ? "none" : "inline", width);
    });
  }
  buildTranslate(options) {
    const { resolve, orient } = this.Direction;
    const values = [];
    values.push(this.cssOffsetClones(options));
    values.push(this.cssOffsetGaps(options));
    if (this.isCenter(options)) {
      values.push(this.buildCssValue(orient(-50), "%"));
      values.push(...this.cssOffsetCenter(options));
    }
    return values.filter(Boolean).map((value) => `translate${resolve("X")}(${value})`).join(" ");
  }
  cssOffsetClones(options) {
    const { resolve, orient } = this.Direction;
    const cloneCount = this.getCloneCount();
    if (this.isFixedWidth(options)) {
      const { value, unit: unit2 } = this.parseCssValue(options[resolve("fixedWidth")]);
      return this.buildCssValue(orient(value) * cloneCount, unit2);
    }
    const percent = 100 * cloneCount / options.perPage;
    return `${orient(percent)}%`;
  }
  cssOffsetCenter(options) {
    const { resolve, orient } = this.Direction;
    if (this.isFixedWidth(options)) {
      const { value, unit: unit2 } = this.parseCssValue(options[resolve("fixedWidth")]);
      return [this.buildCssValue(orient(value / 2), unit2)];
    }
    const values = [];
    const { perPage, gap } = options;
    values.push(`${orient(50 / perPage)}%`);
    if (gap) {
      const { value, unit: unit2 } = this.parseCssValue(gap);
      const gapOffset = (value / perPage - value) / 2;
      values.push(this.buildCssValue(orient(gapOffset), unit2));
    }
    return values;
  }
  cssOffsetGaps(options) {
    const cloneCount = this.getCloneCount();
    if (cloneCount && options.gap) {
      const { orient } = this.Direction;
      const { value, unit: unit2 } = this.parseCssValue(options.gap);
      if (this.isFixedWidth(options)) {
        return this.buildCssValue(orient(value * cloneCount), unit2);
      }
      const { perPage } = options;
      const gaps = cloneCount / perPage;
      return this.buildCssValue(orient(gaps * value), unit2);
    }
    return "";
  }
  resolve(prop) {
    return camelToKebab(this.Direction.resolve(prop));
  }
  cssPadding(options, right) {
    const { padding } = options;
    const prop = this.Direction.resolve(right ? "right" : "left", true);
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  }
  cssTrackHeight(options) {
    let height = "";
    if (this.isVertical()) {
      height = this.cssHeight(options);
      assert(height, '"height" is missing.');
      height = `calc(${height} - ${this.cssPadding(options, false)} - ${this.cssPadding(options, true)})`;
    }
    return height;
  }
  cssHeight(options) {
    return unit(options.height);
  }
  cssSlideWidth(options) {
    return options.autoWidth ? "" : unit(options.fixedWidth) || (this.isVertical() ? "" : this.cssSlideSize(options));
  }
  cssSlideHeight(options) {
    return unit(options.fixedHeight) || (this.isVertical() ? options.autoHeight ? "" : this.cssSlideSize(options) : this.cssHeight(options));
  }
  cssSlideSize(options) {
    const gap = unit(options.gap);
    return `calc((100%${gap && ` + ${gap}`})/${options.perPage || 1}${gap && ` - ${gap}`})`;
  }
  cssAspectRatio(options) {
    const { heightRatio } = options;
    return heightRatio ? `${1 / heightRatio}` : "";
  }
  buildCssValue(value, unit2) {
    return `${value}${unit2}`;
  }
  parseCssValue(value) {
    if (isString(value)) {
      const number = parseFloat(value) || 0;
      const unit2 = value.replace(/\d*(\.\d*)?/, "") || "px";
      return { value: number, unit: unit2 };
    }
    return { value, unit: "px" };
  }
  parseBreakpoints() {
    const { breakpoints } = this.options;
    this.breakpoints.push(["default", this.options]);
    if (breakpoints) {
      forOwn(breakpoints, (options, width) => {
        this.breakpoints.push([width, merge(merge({}, this.options), options)]);
      });
    }
  }
  isFixedWidth(options) {
    return !!options[this.Direction.resolve("fixedWidth")];
  }
  isLoop() {
    return this.options.type === LOOP;
  }
  isCenter(options) {
    if (options.focus === "center") {
      if (this.isLoop()) {
        return true;
      }
      if (this.options.type === SLIDE) {
        return !this.options.trimSpace;
      }
    }
    return false;
  }
  isVertical() {
    return this.options.direction === TTB;
  }
  buildClasses() {
    const { options } = this;
    return [
      CLASS_ROOT,
      `${CLASS_ROOT}--${options.type}`,
      `${CLASS_ROOT}--${options.direction}`,
      options.drag && `${CLASS_ROOT}--draggable`,
      options.isNavigation && `${CLASS_ROOT}--nav`,
      CLASS_ACTIVE,
      !this.config.hidden && CLASS_RENDERED
    ].filter(Boolean).join(" ");
  }
  buildAttrs(attrs) {
    let attr = "";
    forOwn(attrs, (value, key) => {
      attr += value ? ` ${camelToKebab(key)}="${value}"` : "";
    });
    return attr.trim();
  }
  buildStyles(styles) {
    let style = "";
    forOwn(styles, (value, key) => {
      style += ` ${camelToKebab(key)}:${value};`;
    });
    return style.trim();
  }
  renderSlides() {
    const { slideTag: tag } = this.config;
    return this.slides.map((content) => {
      return `<${tag} ${this.buildAttrs(content.attrs)}>${content.html || ""}</${tag}>`;
    }).join("");
  }
  cover(content) {
    const { styles, html = "" } = content;
    if (this.options.cover && !this.options.lazyLoad) {
      const src = html.match(/<img.*?src\s*=\s*(['"])(.+?)\1.*?>/);
      if (src && src[2]) {
        styles.background = `center/cover no-repeat url('${src[2]}')`;
      }
    }
  }
  generateClones(contents) {
    const { classes } = this.options;
    const count = this.getCloneCount();
    const slides = contents.slice();
    while (slides.length < count) {
      push(slides, slides);
    }
    push(slides.slice(-count).reverse(), slides.slice(0, count)).forEach((content, index) => {
      const attrs = assign({}, content.attrs, { class: `${content.attrs.class} ${classes.clone}` });
      const clone = assign({}, content, { attrs });
      index < count ? contents.unshift(clone) : contents.push(clone);
    });
  }
  getCloneCount() {
    if (this.isLoop()) {
      const { options } = this;
      if (options.clones) {
        return options.clones;
      }
      const perPage = max(...this.breakpoints.map(([, options2]) => options2.perPage));
      return perPage * ((options.flickMaxPages || 1) + 1);
    }
    return 0;
  }
  renderArrows() {
    let html = "";
    html += `<div class="${this.options.classes.arrows}">`;
    html += this.renderArrow(true);
    html += this.renderArrow(false);
    html += `</div>`;
    return html;
  }
  renderArrow(prev) {
    const { classes, i18n } = this.options;
    const attrs = {
      class: `${classes.arrow} ${prev ? classes.prev : classes.next}`,
      type: "button",
      ariaLabel: prev ? i18n.prev : i18n.next
    };
    return `<button ${this.buildAttrs(attrs)}><svg xmlns="${XML_NAME_SPACE}" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><path d="${this.options.arrowPath || PATH}" /></svg></button>`;
  }
  html() {
    const { rootClass, listTag, arrows, beforeTrack, afterTrack, slider, beforeSlider, afterSlider } = this.config;
    let html = "";
    html += `<div id="${this.id}" class="${this.buildClasses()} ${rootClass || ""}">`;
    html += `<style>${this.Style.build()}</style>`;
    if (slider) {
      html += beforeSlider || "";
      html += `<div class="splide__slider">`;
    }
    html += beforeTrack || "";
    if (arrows) {
      html += this.renderArrows();
    }
    html += `<div class="splide__track">`;
    html += `<${listTag} class="splide__list">`;
    html += this.renderSlides();
    html += `</${listTag}>`;
    html += `</div>`;
    html += afterTrack || "";
    if (slider) {
      html += `</div>`;
      html += afterSlider || "";
    }
    html += `</div>`;
    return html;
  }
}

exports.CLASSES = CLASSES;
exports.CLASS_ACTIVE = CLASS_ACTIVE;
exports.CLASS_ARROW = CLASS_ARROW;
exports.CLASS_ARROWS = CLASS_ARROWS;
exports.CLASS_ARROW_NEXT = CLASS_ARROW_NEXT;
exports.CLASS_ARROW_PREV = CLASS_ARROW_PREV;
exports.CLASS_AUTOPLAY = CLASS_AUTOPLAY;
exports.CLASS_CLONE = CLASS_CLONE;
exports.CLASS_CONTAINER = CLASS_CONTAINER;
exports.CLASS_INITIALIZED = CLASS_INITIALIZED;
exports.CLASS_LIST = CLASS_LIST;
exports.CLASS_LOADING = CLASS_LOADING;
exports.CLASS_NEXT = CLASS_NEXT;
exports.CLASS_PAGINATION = CLASS_PAGINATION;
exports.CLASS_PAGINATION_PAGE = CLASS_PAGINATION_PAGE;
exports.CLASS_PAUSE = CLASS_PAUSE;
exports.CLASS_PLAY = CLASS_PLAY;
exports.CLASS_PREV = CLASS_PREV;
exports.CLASS_PROGRESS = CLASS_PROGRESS;
exports.CLASS_PROGRESS_BAR = CLASS_PROGRESS_BAR;
exports.CLASS_ROOT = CLASS_ROOT;
exports.CLASS_SLIDE = CLASS_SLIDE;
exports.CLASS_SLIDER = CLASS_SLIDER;
exports.CLASS_SPINNER = CLASS_SPINNER;
exports.CLASS_TRACK = CLASS_TRACK;
exports.CLASS_VISIBLE = CLASS_VISIBLE;
exports.EVENT_ACTIVE = EVENT_ACTIVE;
exports.EVENT_ARROWS_MOUNTED = EVENT_ARROWS_MOUNTED;
exports.EVENT_ARROWS_UPDATED = EVENT_ARROWS_UPDATED;
exports.EVENT_AUTOPLAY_PAUSE = EVENT_AUTOPLAY_PAUSE;
exports.EVENT_AUTOPLAY_PLAY = EVENT_AUTOPLAY_PLAY;
exports.EVENT_AUTOPLAY_PLAYING = EVENT_AUTOPLAY_PLAYING;
exports.EVENT_CLICK = EVENT_CLICK;
exports.EVENT_DESTROY = EVENT_DESTROY;
exports.EVENT_DRAG = EVENT_DRAG;
exports.EVENT_DRAGGED = EVENT_DRAGGED;
exports.EVENT_DRAGGING = EVENT_DRAGGING;
exports.EVENT_HIDDEN = EVENT_HIDDEN;
exports.EVENT_INACTIVE = EVENT_INACTIVE;
exports.EVENT_LAZYLOAD_LOADED = EVENT_LAZYLOAD_LOADED;
exports.EVENT_MOUNTED = EVENT_MOUNTED;
exports.EVENT_MOVE = EVENT_MOVE;
exports.EVENT_MOVED = EVENT_MOVED;
exports.EVENT_NAVIGATION_MOUNTED = EVENT_NAVIGATION_MOUNTED;
exports.EVENT_PAGINATION_MOUNTED = EVENT_PAGINATION_MOUNTED;
exports.EVENT_PAGINATION_UPDATED = EVENT_PAGINATION_UPDATED;
exports.EVENT_READY = EVENT_READY;
exports.EVENT_REFRESH = EVENT_REFRESH;
exports.EVENT_REPOSITIONED = EVENT_REPOSITIONED;
exports.EVENT_RESIZE = EVENT_RESIZE;
exports.EVENT_RESIZED = EVENT_RESIZED;
exports.EVENT_SCROLL = EVENT_SCROLL;
exports.EVENT_SCROLLED = EVENT_SCROLLED;
exports.EVENT_SLIDE_KEYDOWN = EVENT_SLIDE_KEYDOWN;
exports.EVENT_UPDATED = EVENT_UPDATED;
exports.EVENT_VISIBLE = EVENT_VISIBLE;
exports.EventBus = EventBus;
exports.EventInterface = EventInterface;
exports.RequestInterval = RequestInterval;
exports.STATUS_CLASSES = STATUS_CLASSES;
exports.Splide = Splide;
exports.SplideRenderer = SplideRenderer;
exports.State = State;
exports.Throttle = Throttle;
exports['default'] = Splide;

},{}],3:[function(require,module,exports){
(function (global){(function (){
/**
 * SimpleBar.js - v5.3.6
 * Scrollbars, simpler.
 * https://grsmto.github.io/simplebar/
 *
 * Made by Adrien Denat from a fork by Jonathan Nicol
 * Under MIT License
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).SimpleBar=e()}(this,(function(){"use strict";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var r,i,n,o="object",s=function(t){return t&&t.Math==Math&&t},a=s(typeof globalThis==o&&globalThis)||s(typeof window==o&&window)||s(typeof self==o&&self)||s(typeof t==o&&t)||Function("return this")(),c=function(t){try{return!!t()}catch(t){return!0}},l=!c((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})),u={}.propertyIsEnumerable,f=Object.getOwnPropertyDescriptor,h={f:f&&!u.call({1:2},1)?function(t){var e=f(this,t);return!!e&&e.enumerable}:u},d=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},p={}.toString,v=function(t){return p.call(t).slice(8,-1)},g="".split,b=c((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==v(t)?g.call(t,""):Object(t)}:Object,y=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t},m=function(t){return b(y(t))},x=function(t){return"object"==typeof t?null!==t:"function"==typeof t},E=function(t,e){if(!x(t))return t;var r,i;if(e&&"function"==typeof(r=t.toString)&&!x(i=r.call(t)))return i;if("function"==typeof(r=t.valueOf)&&!x(i=r.call(t)))return i;if(!e&&"function"==typeof(r=t.toString)&&!x(i=r.call(t)))return i;throw TypeError("Can't convert object to primitive value")},w={}.hasOwnProperty,S=function(t,e){return w.call(t,e)},O=a.document,k=x(O)&&x(O.createElement),A=function(t){return k?O.createElement(t):{}},T=!l&&!c((function(){return 7!=Object.defineProperty(A("div"),"a",{get:function(){return 7}}).a})),L=Object.getOwnPropertyDescriptor,z={f:l?L:function(t,e){if(t=m(t),e=E(e,!0),T)try{return L(t,e)}catch(t){}if(S(t,e))return d(!h.f.call(t,e),t[e])}},R=function(t){if(!x(t))throw TypeError(String(t)+" is not an object");return t},_=Object.defineProperty,M={f:l?_:function(t,e,r){if(R(t),e=E(e,!0),R(r),T)try{return _(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},C=l?function(t,e,r){return M.f(t,e,d(1,r))}:function(t,e,r){return t[e]=r,t},W=function(t,e){try{C(a,t,e)}catch(r){a[t]=e}return e},j=e((function(t){var e=a["__core-js_shared__"]||W("__core-js_shared__",{});(t.exports=function(t,r){return e[t]||(e[t]=void 0!==r?r:{})})("versions",[]).push({version:"3.2.1",mode:"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})})),N=j("native-function-to-string",Function.toString),I=a.WeakMap,B="function"==typeof I&&/native code/.test(N.call(I)),D=0,P=Math.random(),F=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++D+P).toString(36)},V=j("keys"),X=function(t){return V[t]||(V[t]=F(t))},H={},q=a.WeakMap;if(B){var $=new q,Y=$.get,G=$.has,U=$.set;r=function(t,e){return U.call($,t,e),e},i=function(t){return Y.call($,t)||{}},n=function(t){return G.call($,t)}}else{var Q=X("state");H[Q]=!0,r=function(t,e){return C(t,Q,e),e},i=function(t){return S(t,Q)?t[Q]:{}},n=function(t){return S(t,Q)}}var K={set:r,get:i,has:n,enforce:function(t){return n(t)?i(t):r(t,{})},getterFor:function(t){return function(e){var r;if(!x(e)||(r=i(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}},J=e((function(t){var e=K.get,r=K.enforce,i=String(N).split("toString");j("inspectSource",(function(t){return N.call(t)})),(t.exports=function(t,e,n,o){var s=!!o&&!!o.unsafe,c=!!o&&!!o.enumerable,l=!!o&&!!o.noTargetGet;"function"==typeof n&&("string"!=typeof e||S(n,"name")||C(n,"name",e),r(n).source=i.join("string"==typeof e?e:"")),t!==a?(s?!l&&t[e]&&(c=!0):delete t[e],c?t[e]=n:C(t,e,n)):c?t[e]=n:W(e,n)})(Function.prototype,"toString",(function(){return"function"==typeof this&&e(this).source||N.call(this)}))})),Z=a,tt=function(t){return"function"==typeof t?t:void 0},et=function(t,e){return arguments.length<2?tt(Z[t])||tt(a[t]):Z[t]&&Z[t][e]||a[t]&&a[t][e]},rt=Math.ceil,it=Math.floor,nt=function(t){return isNaN(t=+t)?0:(t>0?it:rt)(t)},ot=Math.min,st=function(t){return t>0?ot(nt(t),9007199254740991):0},at=Math.max,ct=Math.min,lt=function(t){return function(e,r,i){var n,o=m(e),s=st(o.length),a=function(t,e){var r=nt(t);return r<0?at(r+e,0):ct(r,e)}(i,s);if(t&&r!=r){for(;s>a;)if((n=o[a++])!=n)return!0}else for(;s>a;a++)if((t||a in o)&&o[a]===r)return t||a||0;return!t&&-1}},ut={includes:lt(!0),indexOf:lt(!1)}.indexOf,ft=function(t,e){var r,i=m(t),n=0,o=[];for(r in i)!S(H,r)&&S(i,r)&&o.push(r);for(;e.length>n;)S(i,r=e[n++])&&(~ut(o,r)||o.push(r));return o},ht=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],dt=ht.concat("length","prototype"),pt={f:Object.getOwnPropertyNames||function(t){return ft(t,dt)}},vt={f:Object.getOwnPropertySymbols},gt=et("Reflect","ownKeys")||function(t){var e=pt.f(R(t)),r=vt.f;return r?e.concat(r(t)):e},bt=function(t,e){for(var r=gt(e),i=M.f,n=z.f,o=0;o<r.length;o++){var s=r[o];S(t,s)||i(t,s,n(e,s))}},yt=/#|\.prototype\./,mt=function(t,e){var r=Et[xt(t)];return r==St||r!=wt&&("function"==typeof e?c(e):!!e)},xt=mt.normalize=function(t){return String(t).replace(yt,".").toLowerCase()},Et=mt.data={},wt=mt.NATIVE="N",St=mt.POLYFILL="P",Ot=mt,kt=z.f,At=function(t,e){var r,i,n,o,s,c=t.target,l=t.global,u=t.stat;if(r=l?a:u?a[c]||W(c,{}):(a[c]||{}).prototype)for(i in e){if(o=e[i],n=t.noTargetGet?(s=kt(r,i))&&s.value:r[i],!Ot(l?i:c+(u?".":"#")+i,t.forced)&&void 0!==n){if(typeof o==typeof n)continue;bt(o,n)}(t.sham||n&&n.sham)&&C(o,"sham",!0),J(r,i,o,t)}},Tt=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t},Lt=function(t,e,r){if(Tt(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,i){return t.call(e,r,i)};case 3:return function(r,i,n){return t.call(e,r,i,n)}}return function(){return t.apply(e,arguments)}},zt=function(t){return Object(y(t))},Rt=Array.isArray||function(t){return"Array"==v(t)},_t=!!Object.getOwnPropertySymbols&&!c((function(){return!String(Symbol())})),Mt=a.Symbol,Ct=j("wks"),Wt=function(t){return Ct[t]||(Ct[t]=_t&&Mt[t]||(_t?Mt:F)("Symbol."+t))},jt=Wt("species"),Nt=function(t,e){var r;return Rt(t)&&("function"!=typeof(r=t.constructor)||r!==Array&&!Rt(r.prototype)?x(r)&&null===(r=r[jt])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===e?0:e)},It=[].push,Bt=function(t){var e=1==t,r=2==t,i=3==t,n=4==t,o=6==t,s=5==t||o;return function(a,c,l,u){for(var f,h,d=zt(a),p=b(d),v=Lt(c,l,3),g=st(p.length),y=0,m=u||Nt,x=e?m(a,g):r?m(a,0):void 0;g>y;y++)if((s||y in p)&&(h=v(f=p[y],y,d),t))if(e)x[y]=h;else if(h)switch(t){case 3:return!0;case 5:return f;case 6:return y;case 2:It.call(x,f)}else if(n)return!1;return o?-1:i||n?n:x}},Dt={forEach:Bt(0),map:Bt(1),filter:Bt(2),some:Bt(3),every:Bt(4),find:Bt(5),findIndex:Bt(6)},Pt=function(t,e){var r=[][t];return!r||!c((function(){r.call(null,e||function(){throw 1},1)}))},Ft=Dt.forEach,Vt=Pt("forEach")?function(t){return Ft(this,t,arguments.length>1?arguments[1]:void 0)}:[].forEach;At({target:"Array",proto:!0,forced:[].forEach!=Vt},{forEach:Vt});var Xt={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0};for(var Ht in Xt){var qt=a[Ht],$t=qt&&qt.prototype;if($t&&$t.forEach!==Vt)try{C($t,"forEach",Vt)}catch(t){$t.forEach=Vt}}var Yt=!("undefined"==typeof window||!window.document||!window.document.createElement),Gt=Wt("species"),Ut=Dt.filter;At({target:"Array",proto:!0,forced:!function(t){return!c((function(){var e=[];return(e.constructor={})[Gt]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}("filter")},{filter:function(t){return Ut(this,t,arguments.length>1?arguments[1]:void 0)}});var Qt=Object.keys||function(t){return ft(t,ht)},Kt=l?Object.defineProperties:function(t,e){R(t);for(var r,i=Qt(e),n=i.length,o=0;n>o;)M.f(t,r=i[o++],e[r]);return t},Jt=et("document","documentElement"),Zt=X("IE_PROTO"),te=function(){},ee=function(){var t,e=A("iframe"),r=ht.length;for(e.style.display="none",Jt.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),ee=t.F;r--;)delete ee.prototype[ht[r]];return ee()},re=Object.create||function(t,e){var r;return null!==t?(te.prototype=R(t),r=new te,te.prototype=null,r[Zt]=t):r=ee(),void 0===e?r:Kt(r,e)};H[Zt]=!0;var ie=Wt("unscopables"),ne=Array.prototype;null==ne[ie]&&C(ne,ie,re(null));var oe,se,ae,ce=function(t){ne[ie][t]=!0},le={},ue=!c((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype})),fe=X("IE_PROTO"),he=Object.prototype,de=ue?Object.getPrototypeOf:function(t){return t=zt(t),S(t,fe)?t[fe]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?he:null},pe=Wt("iterator"),ve=!1;[].keys&&("next"in(ae=[].keys())?(se=de(de(ae)))!==Object.prototype&&(oe=se):ve=!0),null==oe&&(oe={}),S(oe,pe)||C(oe,pe,(function(){return this}));var ge={IteratorPrototype:oe,BUGGY_SAFARI_ITERATORS:ve},be=M.f,ye=Wt("toStringTag"),me=function(t,e,r){t&&!S(t=r?t:t.prototype,ye)&&be(t,ye,{configurable:!0,value:e})},xe=ge.IteratorPrototype,Ee=function(){return this},we=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),e=r instanceof Array}catch(t){}return function(r,i){return R(r),function(t){if(!x(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype")}(i),e?t.call(r,i):r.__proto__=i,r}}():void 0),Se=ge.IteratorPrototype,Oe=ge.BUGGY_SAFARI_ITERATORS,ke=Wt("iterator"),Ae=function(){return this},Te=function(t,e,r,i,n,o,s){!function(t,e,r){var i=e+" Iterator";t.prototype=re(xe,{next:d(1,r)}),me(t,i,!1),le[i]=Ee}(r,e,i);var a,c,l,u=function(t){if(t===n&&g)return g;if(!Oe&&t in p)return p[t];switch(t){case"keys":case"values":case"entries":return function(){return new r(this,t)}}return function(){return new r(this)}},f=e+" Iterator",h=!1,p=t.prototype,v=p[ke]||p["@@iterator"]||n&&p[n],g=!Oe&&v||u(n),b="Array"==e&&p.entries||v;if(b&&(a=de(b.call(new t)),Se!==Object.prototype&&a.next&&(de(a)!==Se&&(we?we(a,Se):"function"!=typeof a[ke]&&C(a,ke,Ae)),me(a,f,!0))),"values"==n&&v&&"values"!==v.name&&(h=!0,g=function(){return v.call(this)}),p[ke]!==g&&C(p,ke,g),le[e]=g,n)if(c={values:u("values"),keys:o?g:u("keys"),entries:u("entries")},s)for(l in c)!Oe&&!h&&l in p||J(p,l,c[l]);else At({target:e,proto:!0,forced:Oe||h},c);return c},Le=K.set,ze=K.getterFor("Array Iterator"),Re=Te(Array,"Array",(function(t,e){Le(this,{type:"Array Iterator",target:m(t),index:0,kind:e})}),(function(){var t=ze(this),e=t.target,r=t.kind,i=t.index++;return!e||i>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:i,done:!1}:"values"==r?{value:e[i],done:!1}:{value:[i,e[i]],done:!1}}),"values");le.Arguments=le.Array,ce("keys"),ce("values"),ce("entries");var _e=Object.assign,Me=!_e||c((function(){var t={},e={},r=Symbol();return t[r]=7,"abcdefghijklmnopqrst".split("").forEach((function(t){e[t]=t})),7!=_e({},t)[r]||"abcdefghijklmnopqrst"!=Qt(_e({},e)).join("")}))?function(t,e){for(var r=zt(t),i=arguments.length,n=1,o=vt.f,s=h.f;i>n;)for(var a,c=b(arguments[n++]),u=o?Qt(c).concat(o(c)):Qt(c),f=u.length,d=0;f>d;)a=u[d++],l&&!s.call(c,a)||(r[a]=c[a]);return r}:_e;At({target:"Object",stat:!0,forced:Object.assign!==Me},{assign:Me});var Ce=Wt("toStringTag"),We="Arguments"==v(function(){return arguments}()),je=function(t){var e,r,i;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),Ce))?r:We?v(e):"Object"==(i=v(e))&&"function"==typeof e.callee?"Arguments":i},Ne={};Ne[Wt("toStringTag")]="z";var Ie="[object z]"!==String(Ne)?function(){return"[object "+je(this)+"]"}:Ne.toString,Be=Object.prototype;Ie!==Be.toString&&J(Be,"toString",Ie,{unsafe:!0});var De="\t\n\v\f\r                　\u2028\u2029\ufeff",Pe="["+De+"]",Fe=RegExp("^"+Pe+Pe+"*"),Ve=RegExp(Pe+Pe+"*$"),Xe=function(t){return function(e){var r=String(y(e));return 1&t&&(r=r.replace(Fe,"")),2&t&&(r=r.replace(Ve,"")),r}},He={start:Xe(1),end:Xe(2),trim:Xe(3)}.trim,qe=a.parseInt,$e=/^[+-]?0[Xx]/,Ye=8!==qe(De+"08")||22!==qe(De+"0x16")?function(t,e){var r=He(String(t));return qe(r,e>>>0||($e.test(r)?16:10))}:qe;At({global:!0,forced:parseInt!=Ye},{parseInt:Ye});var Ge=function(t){return function(e,r){var i,n,o=String(y(e)),s=nt(r),a=o.length;return s<0||s>=a?t?"":void 0:(i=o.charCodeAt(s))<55296||i>56319||s+1===a||(n=o.charCodeAt(s+1))<56320||n>57343?t?o.charAt(s):i:t?o.slice(s,s+2):n-56320+(i-55296<<10)+65536}},Ue={codeAt:Ge(!1),charAt:Ge(!0)},Qe=Ue.charAt,Ke=K.set,Je=K.getterFor("String Iterator");Te(String,"String",(function(t){Ke(this,{type:"String Iterator",string:String(t),index:0})}),(function(){var t,e=Je(this),r=e.string,i=e.index;return i>=r.length?{value:void 0,done:!0}:(t=Qe(r,i),e.index+=t.length,{value:t,done:!1})}));var Ze=function(t,e,r){for(var i in e)J(t,i,e[i],r);return t},tr=!c((function(){return Object.isExtensible(Object.preventExtensions({}))})),er=e((function(t){var e=M.f,r=F("meta"),i=0,n=Object.isExtensible||function(){return!0},o=function(t){e(t,r,{value:{objectID:"O"+ ++i,weakData:{}}})},s=t.exports={REQUIRED:!1,fastKey:function(t,e){if(!x(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!S(t,r)){if(!n(t))return"F";if(!e)return"E";o(t)}return t[r].objectID},getWeakData:function(t,e){if(!S(t,r)){if(!n(t))return!0;if(!e)return!1;o(t)}return t[r].weakData},onFreeze:function(t){return tr&&s.REQUIRED&&n(t)&&!S(t,r)&&o(t),t}};H[r]=!0})),rr=(er.REQUIRED,er.fastKey,er.getWeakData,er.onFreeze,Wt("iterator")),ir=Array.prototype,nr=Wt("iterator"),or=function(t,e,r,i){try{return i?e(R(r)[0],r[1]):e(r)}catch(e){var n=t.return;throw void 0!==n&&R(n.call(t)),e}},sr=e((function(t){var e=function(t,e){this.stopped=t,this.result=e};(t.exports=function(t,r,i,n,o){var s,a,c,l,u,f,h,d=Lt(r,i,n?2:1);if(o)s=t;else{if("function"!=typeof(a=function(t){if(null!=t)return t[nr]||t["@@iterator"]||le[je(t)]}(t)))throw TypeError("Target is not iterable");if(void 0!==(h=a)&&(le.Array===h||ir[rr]===h)){for(c=0,l=st(t.length);l>c;c++)if((u=n?d(R(f=t[c])[0],f[1]):d(t[c]))&&u instanceof e)return u;return new e(!1)}s=a.call(t)}for(;!(f=s.next()).done;)if((u=or(s,d,f.value,n))&&u instanceof e)return u;return new e(!1)}).stop=function(t){return new e(!0,t)}})),ar=function(t,e,r){if(!(t instanceof e))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation");return t},cr=Wt("iterator"),lr=!1;try{var ur=0,fr={next:function(){return{done:!!ur++}},return:function(){lr=!0}};fr[cr]=function(){return this},Array.from(fr,(function(){throw 2}))}catch(t){}var hr=function(t,e,r,i,n){var o=a[t],s=o&&o.prototype,l=o,u=i?"set":"add",f={},h=function(t){var e=s[t];J(s,t,"add"==t?function(t){return e.call(this,0===t?0:t),this}:"delete"==t?function(t){return!(n&&!x(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return n&&!x(t)?void 0:e.call(this,0===t?0:t)}:"has"==t?function(t){return!(n&&!x(t))&&e.call(this,0===t?0:t)}:function(t,r){return e.call(this,0===t?0:t,r),this})};if(Ot(t,"function"!=typeof o||!(n||s.forEach&&!c((function(){(new o).entries().next()})))))l=r.getConstructor(e,t,i,u),er.REQUIRED=!0;else if(Ot(t,!0)){var d=new l,p=d[u](n?{}:-0,1)!=d,v=c((function(){d.has(1)})),g=function(t,e){if(!e&&!lr)return!1;var r=!1;try{var i={};i[cr]=function(){return{next:function(){return{done:r=!0}}}},t(i)}catch(t){}return r}((function(t){new o(t)})),b=!n&&c((function(){for(var t=new o,e=5;e--;)t[u](e,e);return!t.has(-0)}));g||((l=e((function(e,r){ar(e,l,t);var n=function(t,e,r){var i,n;return we&&"function"==typeof(i=e.constructor)&&i!==r&&x(n=i.prototype)&&n!==r.prototype&&we(t,n),t}(new o,e,l);return null!=r&&sr(r,n[u],n,i),n}))).prototype=s,s.constructor=l),(v||b)&&(h("delete"),h("has"),i&&h("get")),(b||p)&&h(u),n&&s.clear&&delete s.clear}return f[t]=l,At({global:!0,forced:l!=o},f),me(l,t),n||r.setStrong(l,t,i),l},dr=er.getWeakData,pr=K.set,vr=K.getterFor,gr=Dt.find,br=Dt.findIndex,yr=0,mr=function(t){return t.frozen||(t.frozen=new xr)},xr=function(){this.entries=[]},Er=function(t,e){return gr(t.entries,(function(t){return t[0]===e}))};xr.prototype={get:function(t){var e=Er(this,t);if(e)return e[1]},has:function(t){return!!Er(this,t)},set:function(t,e){var r=Er(this,t);r?r[1]=e:this.entries.push([t,e])},delete:function(t){var e=br(this.entries,(function(e){return e[0]===t}));return~e&&this.entries.splice(e,1),!!~e}};var wr={getConstructor:function(t,e,r,i){var n=t((function(t,o){ar(t,n,e),pr(t,{type:e,id:yr++,frozen:void 0}),null!=o&&sr(o,t[i],t,r)})),o=vr(e),s=function(t,e,r){var i=o(t),n=dr(R(e),!0);return!0===n?mr(i).set(e,r):n[i.id]=r,t};return Ze(n.prototype,{delete:function(t){var e=o(this);if(!x(t))return!1;var r=dr(t);return!0===r?mr(e).delete(t):r&&S(r,e.id)&&delete r[e.id]},has:function(t){var e=o(this);if(!x(t))return!1;var r=dr(t);return!0===r?mr(e).has(t):r&&S(r,e.id)}}),Ze(n.prototype,r?{get:function(t){var e=o(this);if(x(t)){var r=dr(t);return!0===r?mr(e).get(t):r?r[e.id]:void 0}},set:function(t,e){return s(this,t,e)}}:{add:function(t){return s(this,t,!0)}}),n}},Sr=(e((function(t){var e,r=K.enforce,i=!a.ActiveXObject&&"ActiveXObject"in a,n=Object.isExtensible,o=function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}},s=t.exports=hr("WeakMap",o,wr,!0,!0);if(B&&i){e=wr.getConstructor(o,"WeakMap",!0),er.REQUIRED=!0;var c=s.prototype,l=c.delete,u=c.has,f=c.get,h=c.set;Ze(c,{delete:function(t){if(x(t)&&!n(t)){var i=r(this);return i.frozen||(i.frozen=new e),l.call(this,t)||i.frozen.delete(t)}return l.call(this,t)},has:function(t){if(x(t)&&!n(t)){var i=r(this);return i.frozen||(i.frozen=new e),u.call(this,t)||i.frozen.has(t)}return u.call(this,t)},get:function(t){if(x(t)&&!n(t)){var i=r(this);return i.frozen||(i.frozen=new e),u.call(this,t)?f.call(this,t):i.frozen.get(t)}return f.call(this,t)},set:function(t,i){if(x(t)&&!n(t)){var o=r(this);o.frozen||(o.frozen=new e),u.call(this,t)?h.call(this,t,i):o.frozen.set(t,i)}else h.call(this,t,i);return this}})}})),Wt("iterator")),Or=Wt("toStringTag"),kr=Re.values;for(var Ar in Xt){var Tr=a[Ar],Lr=Tr&&Tr.prototype;if(Lr){if(Lr[Sr]!==kr)try{C(Lr,Sr,kr)}catch(t){Lr[Sr]=kr}if(Lr[Or]||C(Lr,Or,Ar),Xt[Ar])for(var zr in Re)if(Lr[zr]!==Re[zr])try{C(Lr,zr,Re[zr])}catch(t){Lr[zr]=Re[zr]}}}var Rr="Expected a function",_r=NaN,Mr="[object Symbol]",Cr=/^\s+|\s+$/g,Wr=/^[-+]0x[0-9a-f]+$/i,jr=/^0b[01]+$/i,Nr=/^0o[0-7]+$/i,Ir=parseInt,Br="object"==typeof t&&t&&t.Object===Object&&t,Dr="object"==typeof self&&self&&self.Object===Object&&self,Pr=Br||Dr||Function("return this")(),Fr=Object.prototype.toString,Vr=Math.max,Xr=Math.min,Hr=function(){return Pr.Date.now()};function qr(t,e,r){var i,n,o,s,a,c,l=0,u=!1,f=!1,h=!0;if("function"!=typeof t)throw new TypeError(Rr);function d(e){var r=i,o=n;return i=n=void 0,l=e,s=t.apply(o,r)}function p(t){var r=t-c;return void 0===c||r>=e||r<0||f&&t-l>=o}function v(){var t=Hr();if(p(t))return g(t);a=setTimeout(v,function(t){var r=e-(t-c);return f?Xr(r,o-(t-l)):r}(t))}function g(t){return a=void 0,h&&i?d(t):(i=n=void 0,s)}function b(){var t=Hr(),r=p(t);if(i=arguments,n=this,c=t,r){if(void 0===a)return function(t){return l=t,a=setTimeout(v,e),u?d(t):s}(c);if(f)return a=setTimeout(v,e),d(c)}return void 0===a&&(a=setTimeout(v,e)),s}return e=Yr(e)||0,$r(r)&&(u=!!r.leading,o=(f="maxWait"in r)?Vr(Yr(r.maxWait)||0,e):o,h="trailing"in r?!!r.trailing:h),b.cancel=function(){void 0!==a&&clearTimeout(a),l=0,i=c=n=a=void 0},b.flush=function(){return void 0===a?s:g(Hr())},b}function $r(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function Yr(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&Fr.call(t)==Mr}(t))return _r;if($r(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=$r(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Cr,"");var r=jr.test(t);return r||Nr.test(t)?Ir(t.slice(2),r?2:8):Wr.test(t)?_r:+t}var Gr=function(t,e,r){var i=!0,n=!0;if("function"!=typeof t)throw new TypeError(Rr);return $r(r)&&(i="leading"in r?!!r.leading:i,n="trailing"in r?!!r.trailing:n),qr(t,e,{leading:i,maxWait:e,trailing:n})},Ur="Expected a function",Qr=NaN,Kr="[object Symbol]",Jr=/^\s+|\s+$/g,Zr=/^[-+]0x[0-9a-f]+$/i,ti=/^0b[01]+$/i,ei=/^0o[0-7]+$/i,ri=parseInt,ii="object"==typeof t&&t&&t.Object===Object&&t,ni="object"==typeof self&&self&&self.Object===Object&&self,oi=ii||ni||Function("return this")(),si=Object.prototype.toString,ai=Math.max,ci=Math.min,li=function(){return oi.Date.now()};function ui(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function fi(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&si.call(t)==Kr}(t))return Qr;if(ui(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=ui(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Jr,"");var r=ti.test(t);return r||ei.test(t)?ri(t.slice(2),r?2:8):Zr.test(t)?Qr:+t}var hi=function(t,e,r){var i,n,o,s,a,c,l=0,u=!1,f=!1,h=!0;if("function"!=typeof t)throw new TypeError(Ur);function d(e){var r=i,o=n;return i=n=void 0,l=e,s=t.apply(o,r)}function p(t){var r=t-c;return void 0===c||r>=e||r<0||f&&t-l>=o}function v(){var t=li();if(p(t))return g(t);a=setTimeout(v,function(t){var r=e-(t-c);return f?ci(r,o-(t-l)):r}(t))}function g(t){return a=void 0,h&&i?d(t):(i=n=void 0,s)}function b(){var t=li(),r=p(t);if(i=arguments,n=this,c=t,r){if(void 0===a)return function(t){return l=t,a=setTimeout(v,e),u?d(t):s}(c);if(f)return a=setTimeout(v,e),d(c)}return void 0===a&&(a=setTimeout(v,e)),s}return e=fi(e)||0,ui(r)&&(u=!!r.leading,o=(f="maxWait"in r)?ai(fi(r.maxWait)||0,e):o,h="trailing"in r?!!r.trailing:h),b.cancel=function(){void 0!==a&&clearTimeout(a),l=0,i=c=n=a=void 0},b.flush=function(){return void 0===a?s:g(li())},b},di="Expected a function",pi="__lodash_hash_undefined__",vi="[object Function]",gi="[object GeneratorFunction]",bi=/^\[object .+?Constructor\]$/,yi="object"==typeof t&&t&&t.Object===Object&&t,mi="object"==typeof self&&self&&self.Object===Object&&self,xi=yi||mi||Function("return this")();var Ei=Array.prototype,wi=Function.prototype,Si=Object.prototype,Oi=xi["__core-js_shared__"],ki=function(){var t=/[^.]+$/.exec(Oi&&Oi.keys&&Oi.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),Ai=wi.toString,Ti=Si.hasOwnProperty,Li=Si.toString,zi=RegExp("^"+Ai.call(Ti).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Ri=Ei.splice,_i=Di(xi,"Map"),Mi=Di(Object,"create");function Ci(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var i=t[e];this.set(i[0],i[1])}}function Wi(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var i=t[e];this.set(i[0],i[1])}}function ji(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var i=t[e];this.set(i[0],i[1])}}function Ni(t,e){for(var r,i,n=t.length;n--;)if((r=t[n][0])===(i=e)||r!=r&&i!=i)return n;return-1}function Ii(t){return!(!Fi(t)||(e=t,ki&&ki in e))&&(function(t){var e=Fi(t)?Li.call(t):"";return e==vi||e==gi}(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t)?zi:bi).test(function(t){if(null!=t){try{return Ai.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t));var e}function Bi(t,e){var r,i,n=t.__data__;return("string"==(i=typeof(r=e))||"number"==i||"symbol"==i||"boolean"==i?"__proto__"!==r:null===r)?n["string"==typeof e?"string":"hash"]:n.map}function Di(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return Ii(r)?r:void 0}function Pi(t,e){if("function"!=typeof t||e&&"function"!=typeof e)throw new TypeError(di);var r=function(){var i=arguments,n=e?e.apply(this,i):i[0],o=r.cache;if(o.has(n))return o.get(n);var s=t.apply(this,i);return r.cache=o.set(n,s),s};return r.cache=new(Pi.Cache||ji),r}function Fi(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}Ci.prototype.clear=function(){this.__data__=Mi?Mi(null):{}},Ci.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},Ci.prototype.get=function(t){var e=this.__data__;if(Mi){var r=e[t];return r===pi?void 0:r}return Ti.call(e,t)?e[t]:void 0},Ci.prototype.has=function(t){var e=this.__data__;return Mi?void 0!==e[t]:Ti.call(e,t)},Ci.prototype.set=function(t,e){return this.__data__[t]=Mi&&void 0===e?pi:e,this},Wi.prototype.clear=function(){this.__data__=[]},Wi.prototype.delete=function(t){var e=this.__data__,r=Ni(e,t);return!(r<0)&&(r==e.length-1?e.pop():Ri.call(e,r,1),!0)},Wi.prototype.get=function(t){var e=this.__data__,r=Ni(e,t);return r<0?void 0:e[r][1]},Wi.prototype.has=function(t){return Ni(this.__data__,t)>-1},Wi.prototype.set=function(t,e){var r=this.__data__,i=Ni(r,t);return i<0?r.push([t,e]):r[i][1]=e,this},ji.prototype.clear=function(){this.__data__={hash:new Ci,map:new(_i||Wi),string:new Ci}},ji.prototype.delete=function(t){return Bi(this,t).delete(t)},ji.prototype.get=function(t){return Bi(this,t).get(t)},ji.prototype.has=function(t){return Bi(this,t).has(t)},ji.prototype.set=function(t,e){return Bi(this,t).set(t,e),this},Pi.Cache=ji;var Vi,Xi=Pi,Hi=[],qi="ResizeObserver loop completed with undelivered notifications.";!function(t){t.BORDER_BOX="border-box",t.CONTENT_BOX="content-box",t.DEVICE_PIXEL_CONTENT_BOX="device-pixel-content-box"}(Vi||(Vi={}));var $i,Yi=function(t){return Object.freeze(t)},Gi=function(t,e){this.inlineSize=t,this.blockSize=e,Yi(this)},Ui=function(){function t(t,e,r,i){return this.x=t,this.y=e,this.width=r,this.height=i,this.top=this.y,this.left=this.x,this.bottom=this.top+this.height,this.right=this.left+this.width,Yi(this)}return t.prototype.toJSON=function(){var t=this;return{x:t.x,y:t.y,top:t.top,right:t.right,bottom:t.bottom,left:t.left,width:t.width,height:t.height}},t.fromRect=function(e){return new t(e.x,e.y,e.width,e.height)},t}(),Qi=function(t){return t instanceof SVGElement&&"getBBox"in t},Ki=function(t){if(Qi(t)){var e=t.getBBox(),r=e.width,i=e.height;return!r&&!i}var n=t,o=n.offsetWidth,s=n.offsetHeight;return!(o||s||t.getClientRects().length)},Ji=function(t){var e,r;if(t instanceof Element)return!0;var i=null===(r=null===(e=t)||void 0===e?void 0:e.ownerDocument)||void 0===r?void 0:r.defaultView;return!!(i&&t instanceof i.Element)},Zi="undefined"!=typeof window?window:{},tn=new WeakMap,en=/auto|scroll/,rn=/^tb|vertical/,nn=/msie|trident/i.test(Zi.navigator&&Zi.navigator.userAgent),on=function(t){return parseFloat(t||"0")},sn=function(t,e,r){return void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=!1),new Gi((r?e:t)||0,(r?t:e)||0)},an=Yi({devicePixelContentBoxSize:sn(),borderBoxSize:sn(),contentBoxSize:sn(),contentRect:new Ui(0,0,0,0)}),cn=function(t,e){if(void 0===e&&(e=!1),tn.has(t)&&!e)return tn.get(t);if(Ki(t))return tn.set(t,an),an;var r=getComputedStyle(t),i=Qi(t)&&t.ownerSVGElement&&t.getBBox(),n=!nn&&"border-box"===r.boxSizing,o=rn.test(r.writingMode||""),s=!i&&en.test(r.overflowY||""),a=!i&&en.test(r.overflowX||""),c=i?0:on(r.paddingTop),l=i?0:on(r.paddingRight),u=i?0:on(r.paddingBottom),f=i?0:on(r.paddingLeft),h=i?0:on(r.borderTopWidth),d=i?0:on(r.borderRightWidth),p=i?0:on(r.borderBottomWidth),v=f+l,g=c+u,b=(i?0:on(r.borderLeftWidth))+d,y=h+p,m=a?t.offsetHeight-y-t.clientHeight:0,x=s?t.offsetWidth-b-t.clientWidth:0,E=n?v+b:0,w=n?g+y:0,S=i?i.width:on(r.width)-E-x,O=i?i.height:on(r.height)-w-m,k=S+v+x+b,A=O+g+m+y,T=Yi({devicePixelContentBoxSize:sn(Math.round(S*devicePixelRatio),Math.round(O*devicePixelRatio),o),borderBoxSize:sn(k,A,o),contentBoxSize:sn(S,O,o),contentRect:new Ui(f,c,S,O)});return tn.set(t,T),T},ln=function(t,e,r){var i=cn(t,r),n=i.borderBoxSize,o=i.contentBoxSize,s=i.devicePixelContentBoxSize;switch(e){case Vi.DEVICE_PIXEL_CONTENT_BOX:return s;case Vi.BORDER_BOX:return n;default:return o}},un=function(t){var e=cn(t);this.target=t,this.contentRect=e.contentRect,this.borderBoxSize=Yi([e.borderBoxSize]),this.contentBoxSize=Yi([e.contentBoxSize]),this.devicePixelContentBoxSize=Yi([e.devicePixelContentBoxSize])},fn=function(t){if(Ki(t))return 1/0;for(var e=0,r=t.parentNode;r;)e+=1,r=r.parentNode;return e},hn=function(){var t=1/0,e=[];Hi.forEach((function(r){if(0!==r.activeTargets.length){var i=[];r.activeTargets.forEach((function(e){var r=new un(e.target),n=fn(e.target);i.push(r),e.lastReportedSize=ln(e.target,e.observedBox),n<t&&(t=n)})),e.push((function(){r.callback.call(r.observer,i,r.observer)})),r.activeTargets.splice(0,r.activeTargets.length)}}));for(var r=0,i=e;r<i.length;r++){(0,i[r])()}return t},dn=function(t){Hi.forEach((function(e){e.activeTargets.splice(0,e.activeTargets.length),e.skippedTargets.splice(0,e.skippedTargets.length),e.observationTargets.forEach((function(r){r.isActive()&&(fn(r.target)>t?e.activeTargets.push(r):e.skippedTargets.push(r))}))}))},pn=function(){var t,e=0;for(dn(e);Hi.some((function(t){return t.activeTargets.length>0}));)e=hn(),dn(e);return Hi.some((function(t){return t.skippedTargets.length>0}))&&("function"==typeof ErrorEvent?t=new ErrorEvent("error",{message:qi}):((t=document.createEvent("Event")).initEvent("error",!1,!1),t.message=qi),window.dispatchEvent(t)),e>0},vn=[],gn=function(t){if(!$i){var e=0,r=document.createTextNode("");new MutationObserver((function(){return vn.splice(0).forEach((function(t){return t()}))})).observe(r,{characterData:!0}),$i=function(){r.textContent=""+(e?e--:e++)}}vn.push(t),$i()},bn=0,yn={attributes:!0,characterData:!0,childList:!0,subtree:!0},mn=["resize","load","transitionend","animationend","animationstart","animationiteration","keyup","keydown","mouseup","mousedown","mouseover","mouseout","blur","focus"],xn=function(t){return void 0===t&&(t=0),Date.now()+t},En=!1,wn=new(function(){function t(){var t=this;this.stopped=!0,this.listener=function(){return t.schedule()}}return t.prototype.run=function(t){var e=this;if(void 0===t&&(t=250),!En){En=!0;var r,i=xn(t);r=function(){var r=!1;try{r=pn()}finally{if(En=!1,t=i-xn(),!bn)return;r?e.run(1e3):t>0?e.run(t):e.start()}},gn((function(){requestAnimationFrame(r)}))}},t.prototype.schedule=function(){this.stop(),this.run()},t.prototype.observe=function(){var t=this,e=function(){return t.observer&&t.observer.observe(document.body,yn)};document.body?e():Zi.addEventListener("DOMContentLoaded",e)},t.prototype.start=function(){var t=this;this.stopped&&(this.stopped=!1,this.observer=new MutationObserver(this.listener),this.observe(),mn.forEach((function(e){return Zi.addEventListener(e,t.listener,!0)})))},t.prototype.stop=function(){var t=this;this.stopped||(this.observer&&this.observer.disconnect(),mn.forEach((function(e){return Zi.removeEventListener(e,t.listener,!0)})),this.stopped=!0)},t}()),Sn=function(t){!bn&&t>0&&wn.start(),!(bn+=t)&&wn.stop()},On=function(){function t(t,e){this.target=t,this.observedBox=e||Vi.CONTENT_BOX,this.lastReportedSize={inlineSize:0,blockSize:0}}return t.prototype.isActive=function(){var t,e=ln(this.target,this.observedBox,!0);return t=this.target,Qi(t)||function(t){switch(t.tagName){case"INPUT":if("image"!==t.type)break;case"VIDEO":case"AUDIO":case"EMBED":case"OBJECT":case"CANVAS":case"IFRAME":case"IMG":return!0}return!1}(t)||"inline"!==getComputedStyle(t).display||(this.lastReportedSize=e),this.lastReportedSize.inlineSize!==e.inlineSize||this.lastReportedSize.blockSize!==e.blockSize},t}(),kn=function(t,e){this.activeTargets=[],this.skippedTargets=[],this.observationTargets=[],this.observer=t,this.callback=e},An=new WeakMap,Tn=function(t,e){for(var r=0;r<t.length;r+=1)if(t[r].target===e)return r;return-1},Ln=function(){function t(){}return t.connect=function(t,e){var r=new kn(t,e);An.set(t,r)},t.observe=function(t,e,r){var i=An.get(t),n=0===i.observationTargets.length;Tn(i.observationTargets,e)<0&&(n&&Hi.push(i),i.observationTargets.push(new On(e,r&&r.box)),Sn(1),wn.schedule())},t.unobserve=function(t,e){var r=An.get(t),i=Tn(r.observationTargets,e),n=1===r.observationTargets.length;i>=0&&(n&&Hi.splice(Hi.indexOf(r),1),r.observationTargets.splice(i,1),Sn(-1))},t.disconnect=function(t){var e=this,r=An.get(t);r.observationTargets.slice().forEach((function(r){return e.unobserve(t,r.target)})),r.activeTargets.splice(0,r.activeTargets.length)},t}(),zn=function(){function t(t){if(0===arguments.length)throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");if("function"!=typeof t)throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");Ln.connect(this,t)}return t.prototype.observe=function(t,e){if(0===arguments.length)throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!Ji(t))throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");Ln.observe(this,t,e)},t.prototype.unobserve=function(t){if(0===arguments.length)throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!Ji(t))throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");Ln.unobserve(this,t)},t.prototype.disconnect=function(){Ln.disconnect(this)},t.toString=function(){return"function ResizeObserver () { [polyfill code] }"},t}(),Rn=function(t){return function(e,r,i,n){Tt(r);var o=zt(e),s=b(o),a=st(o.length),c=t?a-1:0,l=t?-1:1;if(i<2)for(;;){if(c in s){n=s[c],c+=l;break}if(c+=l,t?c<0:a<=c)throw TypeError("Reduce of empty array with no initial value")}for(;t?c>=0:a>c;c+=l)c in s&&(n=r(n,s[c],c,o));return n}},_n={left:Rn(!1),right:Rn(!0)}.left;At({target:"Array",proto:!0,forced:Pt("reduce")},{reduce:function(t){return _n(this,t,arguments.length,arguments.length>1?arguments[1]:void 0)}});var Mn=M.f,Cn=Function.prototype,Wn=Cn.toString,jn=/^\s*function ([^ (]*)/;!l||"name"in Cn||Mn(Cn,"name",{configurable:!0,get:function(){try{return Wn.call(this).match(jn)[1]}catch(t){return""}}});var Nn,In,Bn=function(){var t=R(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e},Dn=RegExp.prototype.exec,Pn=String.prototype.replace,Fn=Dn,Vn=(Nn=/a/,In=/b*/g,Dn.call(Nn,"a"),Dn.call(In,"a"),0!==Nn.lastIndex||0!==In.lastIndex),Xn=void 0!==/()??/.exec("")[1];(Vn||Xn)&&(Fn=function(t){var e,r,i,n,o=this;return Xn&&(r=new RegExp("^"+o.source+"$(?!\\s)",Bn.call(o))),Vn&&(e=o.lastIndex),i=Dn.call(o,t),Vn&&i&&(o.lastIndex=o.global?i.index+i[0].length:e),Xn&&i&&i.length>1&&Pn.call(i[0],r,(function(){for(n=1;n<arguments.length-2;n++)void 0===arguments[n]&&(i[n]=void 0)})),i});var Hn=Fn;At({target:"RegExp",proto:!0,forced:/./.exec!==Hn},{exec:Hn});var qn=Wt("species"),$n=!c((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),Yn=!c((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var r="ab".split(t);return 2!==r.length||"a"!==r[0]||"b"!==r[1]})),Gn=function(t,e,r,i){var n=Wt(t),o=!c((function(){var e={};return e[n]=function(){return 7},7!=""[t](e)})),s=o&&!c((function(){var e=!1,r=/a/;return r.exec=function(){return e=!0,null},"split"===t&&(r.constructor={},r.constructor[qn]=function(){return r}),r[n](""),!e}));if(!o||!s||"replace"===t&&!$n||"split"===t&&!Yn){var a=/./[n],l=r(n,""[t],(function(t,e,r,i,n){return e.exec===Hn?o&&!n?{done:!0,value:a.call(e,r,i)}:{done:!0,value:t.call(r,e,i)}:{done:!1}})),u=l[0],f=l[1];J(String.prototype,t,u),J(RegExp.prototype,n,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)}),i&&C(RegExp.prototype[n],"sham",!0)}},Un=Ue.charAt,Qn=function(t,e,r){return e+(r?Un(t,e).length:1)},Kn=function(t,e){var r=t.exec;if("function"==typeof r){var i=r.call(t,e);if("object"!=typeof i)throw TypeError("RegExp exec method returned something other than an Object or null");return i}if("RegExp"!==v(t))throw TypeError("RegExp#exec called on incompatible receiver");return Hn.call(t,e)};Gn("match",1,(function(t,e,r){return[function(e){var r=y(this),i=null==e?void 0:e[t];return void 0!==i?i.call(e,r):new RegExp(e)[t](String(r))},function(t){var i=r(e,t,this);if(i.done)return i.value;var n=R(t),o=String(this);if(!n.global)return Kn(n,o);var s=n.unicode;n.lastIndex=0;for(var a,c=[],l=0;null!==(a=Kn(n,o));){var u=String(a[0]);c[l]=u,""===u&&(n.lastIndex=Qn(o,st(n.lastIndex),s)),l++}return 0===l?null:c}]}));var Jn=Math.max,Zn=Math.min,to=Math.floor,eo=/\$([$&'`]|\d\d?|<[^>]*>)/g,ro=/\$([$&'`]|\d\d?)/g;Gn("replace",2,(function(t,e,r){return[function(r,i){var n=y(this),o=null==r?void 0:r[t];return void 0!==o?o.call(r,n,i):e.call(String(n),r,i)},function(t,n){var o=r(e,t,this,n);if(o.done)return o.value;var s=R(t),a=String(this),c="function"==typeof n;c||(n=String(n));var l=s.global;if(l){var u=s.unicode;s.lastIndex=0}for(var f=[];;){var h=Kn(s,a);if(null===h)break;if(f.push(h),!l)break;""===String(h[0])&&(s.lastIndex=Qn(a,st(s.lastIndex),u))}for(var d,p="",v=0,g=0;g<f.length;g++){h=f[g];for(var b=String(h[0]),y=Jn(Zn(nt(h.index),a.length),0),m=[],x=1;x<h.length;x++)m.push(void 0===(d=h[x])?d:String(d));var E=h.groups;if(c){var w=[b].concat(m,y,a);void 0!==E&&w.push(E);var S=String(n.apply(void 0,w))}else S=i(b,a,y,m,E,n);y>=v&&(p+=a.slice(v,y)+S,v=y+b.length)}return p+a.slice(v)}];function i(t,r,i,n,o,s){var a=i+t.length,c=n.length,l=ro;return void 0!==o&&(o=zt(o),l=eo),e.call(s,l,(function(e,s){var l;switch(s.charAt(0)){case"$":return"$";case"&":return t;case"`":return r.slice(0,i);case"'":return r.slice(a);case"<":l=o[s.slice(1,-1)];break;default:var u=+s;if(0===u)return e;if(u>c){var f=to(u/10);return 0===f?e:f<=c?void 0===n[f-1]?s.charAt(1):n[f-1]+s.charAt(1):e}l=n[u-1]}return void 0===l?"":l}))}}));var io=function(t){return Array.prototype.reduce.call(t,(function(t,e){var r=e.name.match(/data-simplebar-(.+)/);if(r){var i=r[1].replace(/\W+(.)/g,(function(t,e){return e.toUpperCase()}));switch(e.value){case"true":t[i]=!0;break;case"false":t[i]=!1;break;case void 0:t[i]=!0;break;default:t[i]=e.value}}return t}),{})};function no(t){return t&&t.ownerDocument&&t.ownerDocument.defaultView?t.ownerDocument.defaultView:window}function oo(t){return t&&t.ownerDocument?t.ownerDocument:document}var so=null,ao=null;function co(t){if(null===so){var e=oo(t);if(void 0===e)return so=0;var r=e.body,i=e.createElement("div");i.classList.add("simplebar-hide-scrollbar"),r.appendChild(i);var n=i.getBoundingClientRect().right;r.removeChild(i),so=n}return so}Yt&&window.addEventListener("resize",(function(){ao!==window.devicePixelRatio&&(ao=window.devicePixelRatio,so=null)}));var lo=function(){function t(e,r){var i=this;this.onScroll=function(){var t=no(i.el);i.scrollXTicking||(t.requestAnimationFrame(i.scrollX),i.scrollXTicking=!0),i.scrollYTicking||(t.requestAnimationFrame(i.scrollY),i.scrollYTicking=!0)},this.scrollX=function(){i.axis.x.isOverflowing&&(i.showScrollbar("x"),i.positionScrollbar("x")),i.scrollXTicking=!1},this.scrollY=function(){i.axis.y.isOverflowing&&(i.showScrollbar("y"),i.positionScrollbar("y")),i.scrollYTicking=!1},this.onMouseEnter=function(){i.showScrollbar("x"),i.showScrollbar("y")},this.onMouseMove=function(t){i.mouseX=t.clientX,i.mouseY=t.clientY,(i.axis.x.isOverflowing||i.axis.x.forceVisible)&&i.onMouseMoveForAxis("x"),(i.axis.y.isOverflowing||i.axis.y.forceVisible)&&i.onMouseMoveForAxis("y")},this.onMouseLeave=function(){i.onMouseMove.cancel(),(i.axis.x.isOverflowing||i.axis.x.forceVisible)&&i.onMouseLeaveForAxis("x"),(i.axis.y.isOverflowing||i.axis.y.forceVisible)&&i.onMouseLeaveForAxis("y"),i.mouseX=-1,i.mouseY=-1},this.onWindowResize=function(){i.scrollbarWidth=i.getScrollbarWidth(),i.hideNativeScrollbar()},this.hideScrollbars=function(){i.axis.x.track.rect=i.axis.x.track.el.getBoundingClientRect(),i.axis.y.track.rect=i.axis.y.track.el.getBoundingClientRect(),i.isWithinBounds(i.axis.y.track.rect)||(i.axis.y.scrollbar.el.classList.remove(i.classNames.visible),i.axis.y.isVisible=!1),i.isWithinBounds(i.axis.x.track.rect)||(i.axis.x.scrollbar.el.classList.remove(i.classNames.visible),i.axis.x.isVisible=!1)},this.onPointerEvent=function(t){var e,r;i.axis.x.track.rect=i.axis.x.track.el.getBoundingClientRect(),i.axis.y.track.rect=i.axis.y.track.el.getBoundingClientRect(),(i.axis.x.isOverflowing||i.axis.x.forceVisible)&&(e=i.isWithinBounds(i.axis.x.track.rect)),(i.axis.y.isOverflowing||i.axis.y.forceVisible)&&(r=i.isWithinBounds(i.axis.y.track.rect)),(e||r)&&(t.preventDefault(),t.stopPropagation(),"mousedown"===t.type&&(e&&(i.axis.x.scrollbar.rect=i.axis.x.scrollbar.el.getBoundingClientRect(),i.isWithinBounds(i.axis.x.scrollbar.rect)?i.onDragStart(t,"x"):i.onTrackClick(t,"x")),r&&(i.axis.y.scrollbar.rect=i.axis.y.scrollbar.el.getBoundingClientRect(),i.isWithinBounds(i.axis.y.scrollbar.rect)?i.onDragStart(t,"y"):i.onTrackClick(t,"y"))))},this.drag=function(e){var r=i.axis[i.draggedAxis].track,n=r.rect[i.axis[i.draggedAxis].sizeAttr],o=i.axis[i.draggedAxis].scrollbar,s=i.contentWrapperEl[i.axis[i.draggedAxis].scrollSizeAttr],a=parseInt(i.elStyles[i.axis[i.draggedAxis].sizeAttr],10);e.preventDefault(),e.stopPropagation();var c=(("y"===i.draggedAxis?e.pageY:e.pageX)-r.rect[i.axis[i.draggedAxis].offsetAttr]-i.axis[i.draggedAxis].dragOffset)/(n-o.size)*(s-a);"x"===i.draggedAxis&&(c=i.isRtl&&t.getRtlHelpers().isRtlScrollbarInverted?c-(n+o.size):c,c=i.isRtl&&t.getRtlHelpers().isRtlScrollingInverted?-c:c),i.contentWrapperEl[i.axis[i.draggedAxis].scrollOffsetAttr]=c},this.onEndDrag=function(t){var e=oo(i.el),r=no(i.el);t.preventDefault(),t.stopPropagation(),i.el.classList.remove(i.classNames.dragging),e.removeEventListener("mousemove",i.drag,!0),e.removeEventListener("mouseup",i.onEndDrag,!0),i.removePreventClickId=r.setTimeout((function(){e.removeEventListener("click",i.preventClick,!0),e.removeEventListener("dblclick",i.preventClick,!0),i.removePreventClickId=null}))},this.preventClick=function(t){t.preventDefault(),t.stopPropagation()},this.el=e,this.minScrollbarWidth=20,this.options=Object.assign({},t.defaultOptions,{},r),this.classNames=Object.assign({},t.defaultOptions.classNames,{},this.options.classNames),this.axis={x:{scrollOffsetAttr:"scrollLeft",sizeAttr:"width",scrollSizeAttr:"scrollWidth",offsetSizeAttr:"offsetWidth",offsetAttr:"left",overflowAttr:"overflowX",dragOffset:0,isOverflowing:!0,isVisible:!1,forceVisible:!1,track:{},scrollbar:{}},y:{scrollOffsetAttr:"scrollTop",sizeAttr:"height",scrollSizeAttr:"scrollHeight",offsetSizeAttr:"offsetHeight",offsetAttr:"top",overflowAttr:"overflowY",dragOffset:0,isOverflowing:!0,isVisible:!1,forceVisible:!1,track:{},scrollbar:{}}},this.removePreventClickId=null,t.instances.has(this.el)||(this.recalculate=Gr(this.recalculate.bind(this),64),this.onMouseMove=Gr(this.onMouseMove.bind(this),64),this.hideScrollbars=hi(this.hideScrollbars.bind(this),this.options.timeout),this.onWindowResize=hi(this.onWindowResize.bind(this),64,{leading:!0}),t.getRtlHelpers=Xi(t.getRtlHelpers),this.init())}t.getRtlHelpers=function(){var e=document.createElement("div");e.innerHTML='<div class="hs-dummy-scrollbar-size"><div style="height: 200%; width: 200%; margin: 10px 0;"></div></div>';var r=e.firstElementChild;document.body.appendChild(r);var i=r.firstElementChild;r.scrollLeft=0;var n=t.getOffset(r),o=t.getOffset(i);r.scrollLeft=999;var s=t.getOffset(i);return{isRtlScrollingInverted:n.left!==o.left&&o.left-s.left!=0,isRtlScrollbarInverted:n.left!==o.left}},t.getOffset=function(t){var e=t.getBoundingClientRect(),r=oo(t),i=no(t);return{top:e.top+(i.pageYOffset||r.documentElement.scrollTop),left:e.left+(i.pageXOffset||r.documentElement.scrollLeft)}};var e=t.prototype;return e.init=function(){t.instances.set(this.el,this),Yt&&(this.initDOM(),this.setAccessibilityAttributes(),this.scrollbarWidth=this.getScrollbarWidth(),this.recalculate(),this.initListeners())},e.initDOM=function(){var t=this;if(Array.prototype.filter.call(this.el.children,(function(e){return e.classList.contains(t.classNames.wrapper)})).length)this.wrapperEl=this.el.querySelector("."+this.classNames.wrapper),this.contentWrapperEl=this.options.scrollableNode||this.el.querySelector("."+this.classNames.contentWrapper),this.contentEl=this.options.contentNode||this.el.querySelector("."+this.classNames.contentEl),this.offsetEl=this.el.querySelector("."+this.classNames.offset),this.maskEl=this.el.querySelector("."+this.classNames.mask),this.placeholderEl=this.findChild(this.wrapperEl,"."+this.classNames.placeholder),this.heightAutoObserverWrapperEl=this.el.querySelector("."+this.classNames.heightAutoObserverWrapperEl),this.heightAutoObserverEl=this.el.querySelector("."+this.classNames.heightAutoObserverEl),this.axis.x.track.el=this.findChild(this.el,"."+this.classNames.track+"."+this.classNames.horizontal),this.axis.y.track.el=this.findChild(this.el,"."+this.classNames.track+"."+this.classNames.vertical);else{for(this.wrapperEl=document.createElement("div"),this.contentWrapperEl=document.createElement("div"),this.offsetEl=document.createElement("div"),this.maskEl=document.createElement("div"),this.contentEl=document.createElement("div"),this.placeholderEl=document.createElement("div"),this.heightAutoObserverWrapperEl=document.createElement("div"),this.heightAutoObserverEl=document.createElement("div"),this.wrapperEl.classList.add(this.classNames.wrapper),this.contentWrapperEl.classList.add(this.classNames.contentWrapper),this.offsetEl.classList.add(this.classNames.offset),this.maskEl.classList.add(this.classNames.mask),this.contentEl.classList.add(this.classNames.contentEl),this.placeholderEl.classList.add(this.classNames.placeholder),this.heightAutoObserverWrapperEl.classList.add(this.classNames.heightAutoObserverWrapperEl),this.heightAutoObserverEl.classList.add(this.classNames.heightAutoObserverEl);this.el.firstChild;)this.contentEl.appendChild(this.el.firstChild);this.contentWrapperEl.appendChild(this.contentEl),this.offsetEl.appendChild(this.contentWrapperEl),this.maskEl.appendChild(this.offsetEl),this.heightAutoObserverWrapperEl.appendChild(this.heightAutoObserverEl),this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl),this.wrapperEl.appendChild(this.maskEl),this.wrapperEl.appendChild(this.placeholderEl),this.el.appendChild(this.wrapperEl)}if(!this.axis.x.track.el||!this.axis.y.track.el){var e=document.createElement("div"),r=document.createElement("div");e.classList.add(this.classNames.track),r.classList.add(this.classNames.scrollbar),e.appendChild(r),this.axis.x.track.el=e.cloneNode(!0),this.axis.x.track.el.classList.add(this.classNames.horizontal),this.axis.y.track.el=e.cloneNode(!0),this.axis.y.track.el.classList.add(this.classNames.vertical),this.el.appendChild(this.axis.x.track.el),this.el.appendChild(this.axis.y.track.el)}this.axis.x.scrollbar.el=this.axis.x.track.el.querySelector("."+this.classNames.scrollbar),this.axis.y.scrollbar.el=this.axis.y.track.el.querySelector("."+this.classNames.scrollbar),this.options.autoHide||(this.axis.x.scrollbar.el.classList.add(this.classNames.visible),this.axis.y.scrollbar.el.classList.add(this.classNames.visible)),this.el.setAttribute("data-simplebar","init")},e.setAccessibilityAttributes=function(){var t=this.options.ariaLabel||"scrollable content";this.contentWrapperEl.setAttribute("tabindex","0"),this.contentWrapperEl.setAttribute("role","region"),this.contentWrapperEl.setAttribute("aria-label",t)},e.initListeners=function(){var t=this,e=no(this.el);this.options.autoHide&&this.el.addEventListener("mouseenter",this.onMouseEnter),["mousedown","click","dblclick"].forEach((function(e){t.el.addEventListener(e,t.onPointerEvent,!0)})),["touchstart","touchend","touchmove"].forEach((function(e){t.el.addEventListener(e,t.onPointerEvent,{capture:!0,passive:!0})})),this.el.addEventListener("mousemove",this.onMouseMove),this.el.addEventListener("mouseleave",this.onMouseLeave),this.contentWrapperEl.addEventListener("scroll",this.onScroll),e.addEventListener("resize",this.onWindowResize);var r=!1,i=e.ResizeObserver||zn;this.resizeObserver=new i((function(){r&&t.recalculate()})),this.resizeObserver.observe(this.el),this.resizeObserver.observe(this.contentEl),e.requestAnimationFrame((function(){r=!0})),this.mutationObserver=new e.MutationObserver(this.recalculate),this.mutationObserver.observe(this.contentEl,{childList:!0,subtree:!0,characterData:!0})},e.recalculate=function(){var t=no(this.el);this.elStyles=t.getComputedStyle(this.el),this.isRtl="rtl"===this.elStyles.direction;var e=this.heightAutoObserverEl.offsetHeight<=1,r=this.heightAutoObserverEl.offsetWidth<=1,i=this.contentEl.offsetWidth,n=this.contentWrapperEl.offsetWidth,o=this.elStyles.overflowX,s=this.elStyles.overflowY;this.contentEl.style.padding=this.elStyles.paddingTop+" "+this.elStyles.paddingRight+" "+this.elStyles.paddingBottom+" "+this.elStyles.paddingLeft,this.wrapperEl.style.margin="-"+this.elStyles.paddingTop+" -"+this.elStyles.paddingRight+" -"+this.elStyles.paddingBottom+" -"+this.elStyles.paddingLeft;var a=this.contentEl.scrollHeight,c=this.contentEl.scrollWidth;this.contentWrapperEl.style.height=e?"auto":"100%",this.placeholderEl.style.width=r?i+"px":"auto",this.placeholderEl.style.height=a+"px";var l=this.contentWrapperEl.offsetHeight;this.axis.x.isOverflowing=c>i,this.axis.y.isOverflowing=a>l,this.axis.x.isOverflowing="hidden"!==o&&this.axis.x.isOverflowing,this.axis.y.isOverflowing="hidden"!==s&&this.axis.y.isOverflowing,this.axis.x.forceVisible="x"===this.options.forceVisible||!0===this.options.forceVisible,this.axis.y.forceVisible="y"===this.options.forceVisible||!0===this.options.forceVisible,this.hideNativeScrollbar();var u=this.axis.x.isOverflowing?this.scrollbarWidth:0,f=this.axis.y.isOverflowing?this.scrollbarWidth:0;this.axis.x.isOverflowing=this.axis.x.isOverflowing&&c>n-f,this.axis.y.isOverflowing=this.axis.y.isOverflowing&&a>l-u,this.axis.x.scrollbar.size=this.getScrollbarSize("x"),this.axis.y.scrollbar.size=this.getScrollbarSize("y"),this.axis.x.scrollbar.el.style.width=this.axis.x.scrollbar.size+"px",this.axis.y.scrollbar.el.style.height=this.axis.y.scrollbar.size+"px",this.positionScrollbar("x"),this.positionScrollbar("y"),this.toggleTrackVisibility("x"),this.toggleTrackVisibility("y")},e.getScrollbarSize=function(t){if(void 0===t&&(t="y"),!this.axis[t].isOverflowing)return 0;var e,r=this.contentEl[this.axis[t].scrollSizeAttr],i=this.axis[t].track.el[this.axis[t].offsetSizeAttr],n=i/r;return e=Math.max(~~(n*i),this.options.scrollbarMinSize),this.options.scrollbarMaxSize&&(e=Math.min(e,this.options.scrollbarMaxSize)),e},e.positionScrollbar=function(e){if(void 0===e&&(e="y"),this.axis[e].isOverflowing){var r=this.contentWrapperEl[this.axis[e].scrollSizeAttr],i=this.axis[e].track.el[this.axis[e].offsetSizeAttr],n=parseInt(this.elStyles[this.axis[e].sizeAttr],10),o=this.axis[e].scrollbar,s=this.contentWrapperEl[this.axis[e].scrollOffsetAttr],a=(s="x"===e&&this.isRtl&&t.getRtlHelpers().isRtlScrollingInverted?-s:s)/(r-n),c=~~((i-o.size)*a);c="x"===e&&this.isRtl&&t.getRtlHelpers().isRtlScrollbarInverted?c+(i-o.size):c,o.el.style.transform="x"===e?"translate3d("+c+"px, 0, 0)":"translate3d(0, "+c+"px, 0)"}},e.toggleTrackVisibility=function(t){void 0===t&&(t="y");var e=this.axis[t].track.el,r=this.axis[t].scrollbar.el;this.axis[t].isOverflowing||this.axis[t].forceVisible?(e.style.visibility="visible",this.contentWrapperEl.style[this.axis[t].overflowAttr]="scroll"):(e.style.visibility="hidden",this.contentWrapperEl.style[this.axis[t].overflowAttr]="hidden"),this.axis[t].isOverflowing?r.style.display="block":r.style.display="none"},e.hideNativeScrollbar=function(){this.offsetEl.style[this.isRtl?"left":"right"]=this.axis.y.isOverflowing||this.axis.y.forceVisible?"-"+this.scrollbarWidth+"px":0,this.offsetEl.style.bottom=this.axis.x.isOverflowing||this.axis.x.forceVisible?"-"+this.scrollbarWidth+"px":0},e.onMouseMoveForAxis=function(t){void 0===t&&(t="y"),this.axis[t].track.rect=this.axis[t].track.el.getBoundingClientRect(),this.axis[t].scrollbar.rect=this.axis[t].scrollbar.el.getBoundingClientRect(),this.isWithinBounds(this.axis[t].scrollbar.rect)?this.axis[t].scrollbar.el.classList.add(this.classNames.hover):this.axis[t].scrollbar.el.classList.remove(this.classNames.hover),this.isWithinBounds(this.axis[t].track.rect)?(this.showScrollbar(t),this.axis[t].track.el.classList.add(this.classNames.hover)):this.axis[t].track.el.classList.remove(this.classNames.hover)},e.onMouseLeaveForAxis=function(t){void 0===t&&(t="y"),this.axis[t].track.el.classList.remove(this.classNames.hover),this.axis[t].scrollbar.el.classList.remove(this.classNames.hover)},e.showScrollbar=function(t){void 0===t&&(t="y");var e=this.axis[t].scrollbar.el;this.axis[t].isVisible||(e.classList.add(this.classNames.visible),this.axis[t].isVisible=!0),this.options.autoHide&&this.hideScrollbars()},e.onDragStart=function(t,e){void 0===e&&(e="y");var r=oo(this.el),i=no(this.el),n=this.axis[e].scrollbar,o="y"===e?t.pageY:t.pageX;this.axis[e].dragOffset=o-n.rect[this.axis[e].offsetAttr],this.draggedAxis=e,this.el.classList.add(this.classNames.dragging),r.addEventListener("mousemove",this.drag,!0),r.addEventListener("mouseup",this.onEndDrag,!0),null===this.removePreventClickId?(r.addEventListener("click",this.preventClick,!0),r.addEventListener("dblclick",this.preventClick,!0)):(i.clearTimeout(this.removePreventClickId),this.removePreventClickId=null)},e.onTrackClick=function(t,e){var r=this;if(void 0===e&&(e="y"),this.options.clickOnTrack){var i=no(this.el);this.axis[e].scrollbar.rect=this.axis[e].scrollbar.el.getBoundingClientRect();var n=this.axis[e].scrollbar.rect[this.axis[e].offsetAttr],o=parseInt(this.elStyles[this.axis[e].sizeAttr],10),s=this.contentWrapperEl[this.axis[e].scrollOffsetAttr],a=("y"===e?this.mouseY-n:this.mouseX-n)<0?-1:1,c=-1===a?s-o:s+o;!function t(){var n,o;-1===a?s>c&&(s-=r.options.clickOnTrackSpeed,r.contentWrapperEl.scrollTo(((n={})[r.axis[e].offsetAttr]=s,n)),i.requestAnimationFrame(t)):s<c&&(s+=r.options.clickOnTrackSpeed,r.contentWrapperEl.scrollTo(((o={})[r.axis[e].offsetAttr]=s,o)),i.requestAnimationFrame(t))}()}},e.getContentElement=function(){return this.contentEl},e.getScrollElement=function(){return this.contentWrapperEl},e.getScrollbarWidth=function(){try{return"none"===getComputedStyle(this.contentWrapperEl,"::-webkit-scrollbar").display||"scrollbarWidth"in document.documentElement.style||"-ms-overflow-style"in document.documentElement.style?0:co(this.el)}catch(t){return co(this.el)}},e.removeListeners=function(){var t=this,e=no(this.el);this.options.autoHide&&this.el.removeEventListener("mouseenter",this.onMouseEnter),["mousedown","click","dblclick"].forEach((function(e){t.el.removeEventListener(e,t.onPointerEvent,!0)})),["touchstart","touchend","touchmove"].forEach((function(e){t.el.removeEventListener(e,t.onPointerEvent,{capture:!0,passive:!0})})),this.el.removeEventListener("mousemove",this.onMouseMove),this.el.removeEventListener("mouseleave",this.onMouseLeave),this.contentWrapperEl&&this.contentWrapperEl.removeEventListener("scroll",this.onScroll),e.removeEventListener("resize",this.onWindowResize),this.mutationObserver&&this.mutationObserver.disconnect(),this.resizeObserver&&this.resizeObserver.disconnect(),this.recalculate.cancel(),this.onMouseMove.cancel(),this.hideScrollbars.cancel(),this.onWindowResize.cancel()},e.unMount=function(){this.removeListeners(),t.instances.delete(this.el)},e.isWithinBounds=function(t){return this.mouseX>=t.left&&this.mouseX<=t.left+t.width&&this.mouseY>=t.top&&this.mouseY<=t.top+t.height},e.findChild=function(t,e){var r=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.msMatchesSelector;return Array.prototype.filter.call(t.children,(function(t){return r.call(t,e)}))[0]},t}();return lo.defaultOptions={autoHide:!0,forceVisible:!1,clickOnTrack:!0,clickOnTrackSpeed:40,classNames:{contentEl:"simplebar-content",contentWrapper:"simplebar-content-wrapper",offset:"simplebar-offset",mask:"simplebar-mask",wrapper:"simplebar-wrapper",placeholder:"simplebar-placeholder",scrollbar:"simplebar-scrollbar",track:"simplebar-track",heightAutoObserverWrapperEl:"simplebar-height-auto-observer-wrapper",heightAutoObserverEl:"simplebar-height-auto-observer",visible:"simplebar-visible",horizontal:"simplebar-horizontal",vertical:"simplebar-vertical",hover:"simplebar-hover",dragging:"simplebar-dragging"},scrollbarMinSize:25,scrollbarMaxSize:0,timeout:1e3},lo.instances=new WeakMap,lo.initDOMLoadedElements=function(){document.removeEventListener("DOMContentLoaded",this.initDOMLoadedElements),window.removeEventListener("load",this.initDOMLoadedElements),Array.prototype.forEach.call(document.querySelectorAll("[data-simplebar]"),(function(t){"init"===t.getAttribute("data-simplebar")||lo.instances.has(t)||new lo(t,io(t.attributes))}))},lo.removeObserver=function(){this.globalObserver.disconnect()},lo.initHtmlApi=function(){this.initDOMLoadedElements=this.initDOMLoadedElements.bind(this),"undefined"!=typeof MutationObserver&&(this.globalObserver=new MutationObserver(lo.handleMutations),this.globalObserver.observe(document,{childList:!0,subtree:!0})),"complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll?window.setTimeout(this.initDOMLoadedElements):(document.addEventListener("DOMContentLoaded",this.initDOMLoadedElements),window.addEventListener("load",this.initDOMLoadedElements))},lo.handleMutations=function(t){t.forEach((function(t){Array.prototype.forEach.call(t.addedNodes,(function(t){1===t.nodeType&&(t.hasAttribute("data-simplebar")?!lo.instances.has(t)&&document.documentElement.contains(t)&&new lo(t,io(t.attributes)):Array.prototype.forEach.call(t.querySelectorAll("[data-simplebar]"),(function(t){"init"!==t.getAttribute("data-simplebar")&&!lo.instances.has(t)&&document.documentElement.contains(t)&&new lo(t,io(t.attributes))})))})),Array.prototype.forEach.call(t.removedNodes,(function(t){1===t.nodeType&&("init"===t.getAttribute("data-simplebar")?lo.instances.has(t)&&!document.documentElement.contains(t)&&lo.instances.get(t).unMount():Array.prototype.forEach.call(t.querySelectorAll('[data-simplebar="init"]'),(function(t){lo.instances.has(t)&&!document.documentElement.contains(t)&&lo.instances.get(t).unMount()})))}))}))},lo.getOptions=io,Yt&&lo.initHtmlApi(),lo}));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
