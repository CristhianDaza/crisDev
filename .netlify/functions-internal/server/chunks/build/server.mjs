import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, shallowRef, h, resolveComponent, computed, hasInjectionContext, inject, getCurrentInstance, defineAsyncComponent, createElementBlock, provide, cloneVNode, createApp, Fragment, onServerPrefetch, mergeProps, unref, toRef, onErrorCaptured, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, toValue, watch, getCurrentScope, ref, withCtx, createBlock, openBlock, toDisplayString as toDisplayString$1, nextTick, createTextVNode, createCommentVNode, renderList, renderSlot, useSlots, useSSRContext, Text } from 'vue';
import { v as sanitizeStatusCode, w as getContext, $ as $fetch$1, x as baseURL, y as klona, z as defuFn, A as createHooks, m as createError$1, B as executeAsync, C as toRouteMatcher, D as createRouter, E as defu, F as getRequestURL, G as getRequestHeader, H as parse$1, o as destr, I as createDefu, J as isEqual$1, K as setCookie, L as getCookie, M as deleteCookie } from '../nitro/nitro.mjs';
import { createPathIndexLanguageParser, parseAcceptLanguage } from '@intlify/utils';
import { Icon, _api, addAPIProvider, setCustomIconsLoader, getIcon, loadIcon as loadIcon$1 } from '@iconify/vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderSlot, ssrRenderTeleport } from 'vue/server-renderer';
import { getIconCSS } from '@iconify/utils/lib/css/icon';
import { debounce } from 'perfect-debounce';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import '@iconify/utils';
import 'consola';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.1.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function isEqual(a, b, options = {}) {
  if (!options.trailingSlash) {
    a = withTrailingSlash(a);
    b = withTrailingSlash(b);
  }
  if (!options.leadingSlash) {
    a = withLeadingSlash(a);
    b = withLeadingSlash(b);
  }
  if (!options.encoding) {
    a = decode(a);
    b = decode(b);
  }
  return a === b;
}
const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index2 = routes.findIndex((route2) => route2.name === name);
        if (index2 !== -1) {
          routes.splice(index2, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate2 = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate: navigate2, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate2();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const LazyIcon = defineAsyncComponent(() => Promise.resolve().then(() => index).then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["Icon", LazyIcon]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
/*!
  * shared v11.1.12
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
const assign = Object.assign;
const _create = Object.create;
const create = (obj = null) => _create(obj);
function escapeHtml(rawText) {
  return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function escapeAttributeValue(value) {
  return value.replace(/&(?![a-zA-Z0-9#]{2,6};)/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function sanitizeTranslatedHtml(html) {
  html = html.replace(/(\w+)\s*=\s*"([^"]*)"/g, (_, attrName, attrValue) => `${attrName}="${escapeAttributeValue(attrValue)}"`);
  html = html.replace(/(\w+)\s*=\s*'([^']*)'/g, (_, attrName, attrValue) => `${attrName}='${escapeAttributeValue(attrValue)}'`);
  const eventHandlerPattern = /\s*on\w+\s*=\s*["']?[^"'>]+["']?/gi;
  if (eventHandlerPattern.test(html)) {
    html = html.replace(/(\s+)(on)(\w+\s*=)/gi, "$1&#111;n$3");
  }
  const javascriptUrlPattern = [
    // In href, src, action, formaction attributes
    /(\s+(?:href|src|action|formaction)\s*=\s*["']?)\s*javascript:/gi,
    // In style attributes within url()
    /(style\s*=\s*["'][^"']*url\s*\(\s*)javascript:/gi
  ];
  javascriptUrlPattern.forEach((pattern) => {
    html = html.replace(pattern, "$1javascript&#58;");
  });
  return html;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function join(items, separator2 = "") {
  return items.reduce((str, item, index2) => index2 === 0 ? str + item : str + separator2 + item, "");
}
const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error("Invalid value");
  }
  const stack = [{ src, des }];
  while (stack.length) {
    const { src: src2, des: des2 } = stack.pop();
    Object.keys(src2).forEach((key) => {
      if (key === "__proto__") {
        return;
      }
      if (isObject(src2[key]) && !isObject(des2[key])) {
        des2[key] = Array.isArray(src2[key]) ? [] : create();
      }
      if (isNotObjectOrIsArray(des2[key]) || isNotObjectOrIsArray(src2[key])) {
        des2[key] = src2[key];
      } else {
        stack.push({ src: src2[key], des: des2[key] });
      }
    });
  }
}
function localeHead$1(options, currentLanguage = options.getCurrentLanguage(), currentDirection = options.getCurrentDirection()) {
  const metaObject = {
    htmlAttrs: {},
    link: [],
    meta: []
  };
  if (options.dir) {
    metaObject.htmlAttrs.dir = currentDirection;
  }
  if (options.lang && currentLanguage) {
    metaObject.htmlAttrs.lang = currentLanguage;
  }
  if (options.seo) {
    const alternateLinks = getHreflangLinks(options);
    metaObject.link = metaObject.link.concat(
      alternateLinks,
      getCanonicalLink(options)
    );
    metaObject.meta = metaObject.meta.concat(
      getOgUrl(options),
      getCurrentOgLocale(options),
      getAlternateOgLocales(
        options,
        options.locales.map((x) => x.language || x.code)
      )
    );
  }
  return metaObject;
}
function createLocaleMap(locales) {
  const localeMap = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    if (!locale.language) {
      console.warn("Locale `language` ISO code is required to generate alternate link");
      continue;
    }
    const [language, region] = locale.language.split("-");
    if (language && region && (locale.isCatchallLocale || !localeMap.has(language))) {
      localeMap.set(language, locale);
    }
    localeMap.set(locale.language, locale);
  }
  return localeMap;
}
function getHreflangLinks(options) {
  if (!options.hreflangLinks) return [];
  const links = [];
  const localeMap = createLocaleMap(options.locales);
  for (const [language, locale] of localeMap.entries()) {
    const link = getHreflangLink(language, locale, options);
    if (!link) continue;
    links.push(link);
    if (options.defaultLocale && options.defaultLocale === locale.code && links[0].hreflang !== "x-default") {
      links.unshift(
        { [options.key]: "i18n-xd", rel: "alternate", href: link.href, hreflang: "x-default" }
      );
    }
  }
  return links;
}
function getHreflangLink(language, locale, options, routeWithoutQuery = options.strictCanonicals ? options.getRouteWithoutQuery() : void 0) {
  const localePath2 = options.getLocalizedRoute(locale.code, routeWithoutQuery);
  if (!localePath2) return void 0;
  const href = withQuery(
    hasProtocol(localePath2) ? localePath2 : joinURL(options.baseUrl, localePath2),
    options.strictCanonicals ? getCanonicalQueryParams(options) : {}
  );
  return { [options.key]: `i18n-alt-${language}`, rel: "alternate", href, hreflang: language };
}
function getCanonicalUrl(options, route = options.getCurrentRoute()) {
  const currentRoute = options.getLocaleRoute(
    Object.assign({}, route, { path: void 0, name: options.getRouteBaseName(route) })
  );
  if (!currentRoute) return "";
  return withQuery(joinURL(options.baseUrl, currentRoute.path), getCanonicalQueryParams(options));
}
function getCanonicalLink(options, href = getCanonicalUrl(options)) {
  if (!href) return [];
  return [{ [options.key]: "i18n-can", rel: "canonical", href }];
}
function getCanonicalQueryParams(options, route = options.getCurrentRoute()) {
  const currentRoute = options.getLocaleRoute(
    Object.assign({}, route, { path: void 0, name: options.getRouteBaseName(route) })
  );
  const currentRouteQuery = currentRoute?.query ?? {};
  const params = {};
  for (const param of options.canonicalQueries.filter((x) => x in currentRouteQuery)) {
    params[param] ??= [];
    for (const val of toArray$1(currentRouteQuery[param])) {
      params[param].push(val || "");
    }
  }
  return params;
}
function getOgUrl(options, href = getCanonicalUrl(options)) {
  if (!href) return [];
  return [
    { [options.key]: "i18n-og-url", property: "og:url", content: href }
  ];
}
function getCurrentOgLocale(options, currentLanguage = options.getCurrentLanguage()) {
  if (!currentLanguage) return [];
  return [
    { [options.key]: "i18n-og", property: "og:locale", content: formatOgLanguage(currentLanguage) }
  ];
}
function getAlternateOgLocales(options, languages, currentLanguage = options.getCurrentLanguage()) {
  const alternateLocales = languages.filter((locale) => locale && locale !== currentLanguage);
  return alternateLocales.map(
    (locale) => ({
      [options.key]: `i18n-og-alt-${locale}`,
      property: "og:locale:alternate",
      content: formatOgLanguage(locale)
    })
  );
}
function formatOgLanguage(val = "") {
  return val.replace(/-/g, "_");
}
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
function localePath(ctx, route, locale = ctx.getLocale()) {
  if (isString(route) && hasProtocol(route, { acceptRelative: true })) {
    return route;
  }
  try {
    return resolveRoute(ctx, route, locale).fullPath;
  } catch {
    return "";
  }
}
function localeRoute(ctx, route, locale = ctx.getLocale()) {
  try {
    return resolveRoute(ctx, route, locale);
  } catch {
    return;
  }
}
function normalizeRawLocation(route) {
  if (!isString(route)) {
    return assign({}, route);
  }
  if (route[0] === "/") {
    const { pathname: path, search, hash } = parsePath(route);
    return { path, query: parseQuery(search), hash };
  }
  return { name: route };
}
function resolveRoute(ctx, route, locale) {
  const normalized = normalizeRawLocation(route);
  const resolved = ctx.router.resolve(ctx.resolveLocalizedRouteObject(normalized, locale));
  if (resolved.name) {
    return resolved;
  }
  return ctx.router.resolve(route);
}
function switchLocalePath(ctx, locale, route = ctx.router.currentRoute.value) {
  const name = ctx.getRouteBaseName(route);
  if (!name) {
    return "";
  }
  const routeCopy = {
    name,
    params: assign({}, route.params, ctx.getLocalizedDynamicParams(locale)),
    fullPath: route.fullPath,
    query: route.query,
    hash: route.hash,
    path: route.path,
    meta: route.meta
  };
  const path = localePath(ctx, routeCopy, locale);
  return ctx.afterSwitchLocalePath(path, locale);
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function prerenderRoutes(path) {
  {
    return;
  }
}
function createHeadContext(ctx, config, locale = ctx.getLocale(), locales = ctx.getLocales(), baseUrl = ctx.getBaseUrl()) {
  const currentLocale = locales.find((l) => l.code === locale) || {};
  const canonicalQueries = typeof config.seo === "object" && config.seo?.canonicalQueries || [];
  if (!baseUrl && true && true) {
    console.warn("I18n `baseUrl` is required to generate valid SEO tag links.");
  }
  return {
    ...config,
    key: "id",
    locales,
    baseUrl,
    canonicalQueries,
    hreflangLinks: ctx.routingOptions.hreflangLinks,
    defaultLocale: ctx.routingOptions.defaultLocale,
    strictCanonicals: ctx.routingOptions.strictCanonicals,
    getRouteBaseName: ctx.getRouteBaseName,
    getCurrentRoute: () => ctx.router.currentRoute.value,
    getCurrentLanguage: () => currentLocale.language,
    getCurrentDirection: () => currentLocale.dir || "ltr",
    getLocaleRoute: (route) => localeRoute(ctx, route),
    getLocalizedRoute: (locale2, route) => switchLocalePath(ctx, locale2, route),
    getRouteWithoutQuery: () => {
      try {
        return assign({}, ctx.router.resolve({ query: {} }), { meta: ctx.router.currentRoute.value.meta });
      } catch {
        return void 0;
      }
    }
  };
}
function localeHead(ctx, { dir = true, lang = true, seo = true }) {
  return localeHead$1(createHeadContext(ctx, { dir, lang, seo }));
}
const separator = "___";
function normalizeRouteName(routeName) {
  if (typeof routeName === "string") return routeName;
  if (routeName != null) return routeName.toString();
  return "";
}
function getRouteBaseName(route) {
  return normalizeRouteName(typeof route === "object" ? route?.name : route).split(separator)[0];
}
const pathLanguageParser = createPathIndexLanguageParser(0);
const getLocaleFromRoutePath = (path) => pathLanguageParser(path);
const getLocaleFromRouteName = (name) => name.split(separator).at(1) ?? "";
function normalizeInput(input) {
  return typeof input !== "object" ? String(input) : String(input?.name || input?.path || "");
}
function getLocaleFromRoute(route) {
  const input = normalizeInput(route);
  return input[0] === "/" ? getLocaleFromRoutePath(input) : getLocaleFromRouteName(input);
}
function createLocaleRouteNameGetter(defaultLocale) {
  {
    return (routeName) => normalizeRouteName(routeName);
  }
}
function createLocalizedRouteByPathResolver(router) {
  {
    return (route) => route;
  }
}
const localeCodes = [
  "es",
  "en"
];
const localeLoaders = {
  es: [
    {
      key: "locale_es_46json_3b71de7a",
      load: () => import(
        './es-nI8RO77j.mjs'
        /* webpackChunkName: "locale_es_46json_3b71de7a" */
      ),
      cache: true
    }
  ],
  en: [
    {
      key: "locale_en_46json_b49aa314",
      load: () => import(
        './en-CpvlZggP.mjs'
        /* webpackChunkName: "locale_en_46json_b49aa314" */
      ),
      cache: true
    }
  ]
};
const vueI18nConfigs = [];
const normalizedLocales = [
  {
    code: "es",
    name: "Español",
    language: void 0
  },
  {
    code: "en",
    name: "English",
    language: void 0
  }
];
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!nuxtApp._asyncData[key.value]?._init) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => {
      if (!nuxtApp._asyncData[key.value]?._init) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual$1(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual$1(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse$1(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
function useRequestURL(opts) {
  {
    return getRequestURL(useRequestEvent(), opts);
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate: navigate2, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate: navigate2,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, slots.default?.());
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_0$3 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const inlineConfig = {
  "nuxt": {},
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};
const __appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig ||= klona(__appConfig);
  return nuxtApp._appConfig;
}
const cacheMessages = /* @__PURE__ */ new Map();
const merger = createDefu((obj, key, value) => {
  if (key === "messages" || key === "datetimeFormats" || key === "numberFormats") {
    obj[key] ??= create(null);
    deepCopy(value, obj[key]);
    return true;
  }
});
async function loadVueI18nOptions(vueI18nConfigs2) {
  const nuxtApp = useNuxtApp();
  let vueI18nOptions = { messages: create(null) };
  for (const configFile of vueI18nConfigs2) {
    const resolver = await configFile().then((x) => x.default);
    const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver;
    vueI18nOptions = merger(create(null), resolved, vueI18nOptions);
  }
  vueI18nOptions.fallbackLocale ??= false;
  return vueI18nOptions;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
const isResolvedModule = (val) => isModule(val) || true;
async function getLocaleMessages$1(locale, loader) {
  const nuxtApp = useNuxtApp();
  try {
    const getter = await nuxtApp.runWithContext(loader.load).then((x) => isResolvedModule(x) ? x.default : x);
    return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter;
  } catch (e) {
    throw new Error(`Failed loading locale (${locale}): ` + e.message);
  }
}
async function getLocaleMessagesMergedCached(locale, loaders = []) {
  const nuxtApp = useNuxtApp();
  const merged = {};
  for (const loader of loaders) {
    const cached = getCachedMessages(loader);
    const messages = cached || await nuxtApp.runWithContext(async () => await getLocaleMessages$1(locale, loader));
    if (!cached && loader.cache !== false) {
      cacheMessages.set(loader.key, { ttl: Date.now() + 86400 * 1e3, value: messages });
    }
    deepCopy(messages, merged);
  }
  return merged;
}
function getCachedMessages(loader) {
  if (loader.cache === false) return;
  const cache2 = cacheMessages.get(loader.key);
  if (cache2 == null) return;
  return cache2.ttl > Date.now() ? cache2.value : void 0;
}
function getI18nTarget(i18n) {
  return i18n != null && "global" in i18n && "mode" in i18n ? i18n.global : i18n;
}
function getComposer$3(i18n) {
  const target = getI18nTarget(i18n);
  return "__composer" in target ? target.__composer : target;
}
function useRuntimeI18n(nuxtApp) {
  if (!nuxtApp) {
    return (/* @__PURE__ */ useRuntimeConfig()).public.i18n;
  }
  return nuxtApp.$config.public.i18n;
}
function useI18nDetection(nuxtApp) {
  const detectBrowserLanguage = useRuntimeI18n(nuxtApp).detectBrowserLanguage;
  const detect = detectBrowserLanguage || {};
  return {
    ...detect,
    enabled: !!detectBrowserLanguage,
    cookieKey: detect.cookieKey || "i18n_redirected"
  };
}
function resolveRootRedirect(config) {
  if (!config) return void 0;
  return {
    path: "/" + (isString(config) ? config : config.path).replace(/^\//, ""),
    code: !isString(config) && config.statusCode || 302
  };
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function matchDomainLocale(locales, host, pathLocale) {
  const normalizeDomain = (domain = "") => domain.replace(/https?:\/\//, "");
  const matches = locales.filter(
    (locale) => normalizeDomain(locale.domain) === host || toArray(locale.domains).includes(host)
  );
  if (matches.length <= 1) {
    return matches[0]?.code;
  }
  return (
    // match by current path locale
    matches.find((l) => l.code === pathLocale)?.code || // fallback to default locale for the domain
    matches.find((l) => l.defaultForDomains?.includes(host) ?? l.domainDefault)?.code
  );
}
function domainFromLocale(domainLocales, url, locale) {
  const lang = normalizedLocales.find((x) => x.code === locale);
  const domain = domainLocales?.[locale]?.domain || lang?.domain || lang?.domains?.find((v) => v === url.host);
  if (!domain) {
    return;
  }
  if (hasProtocol(domain, { strict: true })) {
    return domain;
  }
  return url.protocol + "//" + domain;
}
function getDefaultLocaleForDomain(host) {
  return normalizedLocales.find((l) => !!l.defaultForDomains?.includes(host))?.code;
}
const isSupportedLocale = (locale) => localeCodes.includes(locale || "");
const resolveSupportedLocale = (locale) => isSupportedLocale(locale) ? locale : void 0;
const useLocaleConfigs = () => useState(
  "i18n:cached-locale-configs",
  () => void 0
);
const useResolvedLocale = () => useState("i18n:resolved-locale", () => "");
function useI18nCookie({ cookieCrossOrigin, cookieDomain, cookieSecure, cookieKey }) {
  const date = /* @__PURE__ */ new Date();
  return useCookie(cookieKey, {
    path: "/",
    readonly: false,
    expires: new Date(date.setDate(date.getDate() + 365)),
    sameSite: cookieCrossOrigin ? "none" : "lax",
    domain: cookieDomain || void 0,
    secure: cookieCrossOrigin || cookieSecure
  });
}
function createNuxtI18nContext(nuxt, vueI18n, defaultLocale) {
  const i18n = getI18nTarget(vueI18n);
  const runtimeI18n = useRuntimeI18n(nuxt);
  const detectConfig = useI18nDetection(nuxt);
  const serverLocaleConfigs = useLocaleConfigs();
  const localeCookie = useI18nCookie(detectConfig);
  const getLocaleConfig = (locale) => serverLocaleConfigs.value[locale];
  const getDomainFromLocale = (locale) => domainFromLocale(runtimeI18n.domainLocales, useRequestURL({ xForwardedHost: true }), locale);
  const baseUrl = createBaseUrlGetter(nuxt, runtimeI18n.baseUrl);
  const resolvedLocale = useResolvedLocale();
  if (nuxt.ssrContext?.event?.context?.nuxtI18n?.detectLocale) {
    resolvedLocale.value = nuxt.ssrContext.event.context.nuxtI18n.detectLocale;
  }
  const loadMessagesFromClient = async (locale) => {
    const locales = getLocaleConfig(locale)?.fallbacks ?? [];
    if (!locales.includes(locale)) locales.push(locale);
    for (const k of locales) {
      const msg = await nuxt.runWithContext(() => getLocaleMessagesMergedCached(k, localeLoaders[k]));
      i18n.mergeLocaleMessage(k, msg);
    }
  };
  const loadMessagesFromServer = async (locale) => {
    if (locale in localeLoaders === false) return;
    const headers = getLocaleConfig(locale)?.cacheable ? {} : { "Cache-Control": "no-cache" };
    const messages = await $fetch(`/_i18n/${"ZUR5TDIg"}/${locale}/messages.json`, { headers });
    for (const k of Object.keys(messages)) {
      i18n.mergeLocaleMessage(k, messages[k]);
    }
  };
  const ctx = {
    vueI18n,
    initial: true,
    preloaded: false,
    config: runtimeI18n,
    rootRedirect: resolveRootRedirect(runtimeI18n.rootRedirect),
    redirectStatusCode: runtimeI18n.redirectStatusCode ?? 302,
    dynamicResourcesSSG: false,
    getDefaultLocale: () => defaultLocale,
    getLocale: () => unref(i18n.locale),
    setLocale: async (locale) => {
      const oldLocale = ctx.getLocale();
      if (locale === oldLocale || !isSupportedLocale(locale)) return;
      if (isRef(i18n.locale)) {
        i18n.locale.value = locale;
      } else {
        i18n.locale = locale;
      }
      await nuxt.callHook("i18n:localeSwitched", { newLocale: locale, oldLocale });
      resolvedLocale.value = locale;
    },
    setLocaleSuspend: async (locale) => {
      if (!isSupportedLocale(locale)) return;
      ctx.vueI18n.__pendingLocale = locale;
      ctx.vueI18n.__pendingLocalePromise = new Promise((resolve) => {
        ctx.vueI18n.__resolvePendingLocalePromise = async () => {
          ctx.setCookieLocale(locale);
          await ctx.setLocale(locale);
          ctx.vueI18n.__pendingLocale = void 0;
          resolve();
        };
      });
      {
        await ctx.vueI18n.__resolvePendingLocalePromise?.();
      }
    },
    getLocales: () => unref(i18n.locales).map((x) => isString(x) ? { code: x } : x),
    setCookieLocale: (locale) => {
      if (detectConfig.useCookie && isSupportedLocale(locale)) {
        localeCookie.value = locale;
      }
    },
    getBaseUrl: (locale) => {
      if (locale) {
        return joinURL(getDomainFromLocale(locale) || baseUrl(), nuxt.$config.app.baseURL);
      }
      return joinURL(baseUrl(), nuxt.$config.app.baseURL);
    },
    loadMessages: async (locale) => {
      try {
        return ctx.dynamicResourcesSSG || false ? await loadMessagesFromClient(locale) : await loadMessagesFromServer(locale);
      } catch (e) {
        console.warn(`Failed to load messages for locale "${locale}"`, e);
      }
    },
    composableCtx: void 0
  };
  ctx.composableCtx = createComposableContext(ctx, nuxt);
  return ctx;
}
function useNuxtI18nContext(nuxt) {
  if (nuxt._nuxtI18n == null) {
    throw new Error("Nuxt I18n context has not been set up yet.");
  }
  return nuxt._nuxtI18n;
}
function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index2, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index2 / browserLocales.length });
      break;
    }
  }
  for (const [index2, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index2 / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const matchedLocales = matchBrowserLocale(
    locales.map((l) => ({ code: l.code, language: l.language || l.code })),
    browserLocales
  );
  return matchedLocales.sort(compareBrowserLocale).at(0)?.code ?? "";
}
const getCookieLocale = (event, cookieName) => {
  const cookieValue = getRequestHeader(event, "cookie") || "";
  return parse$1(cookieValue)[cookieName];
};
const getRouteLocale = (event, route) => getLocaleFromRoute(route);
const getHeaderLocale = (event) => {
  return findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, "accept-language") || ""));
};
const getHostLocale = (event, path, domainLocales) => {
  const host = getRequestURL(event, { xForwardedHost: true }).host;
  const locales = normalizedLocales.map((l) => ({
    ...l,
    domain: domainLocales[l.code]?.domain ?? l.domain
  }));
  return matchDomainLocale(locales, host, getLocaleFromRoutePath(path));
};
const useDetectors = (event, config, nuxtApp) => {
  if (!event) {
    throw new Error("H3Event is required for server-side locale detection");
  }
  const runtimeI18n = useRuntimeI18n(nuxtApp);
  return {
    cookie: () => getCookieLocale(event, config.cookieKey),
    header: () => getHeaderLocale(event),
    navigator: () => void 0,
    host: (path) => getHostLocale(event, path, runtimeI18n.domainLocales),
    route: (path) => getRouteLocale(event, path)
  };
};
const isRouteLocationPathRaw = (val) => !!val.path && !val.name;
function useComposableContext(nuxtApp) {
  const context = nuxtApp?._nuxtI18n?.composableCtx;
  if (!context) {
    throw new Error(
      "i18n context is not initialized. Ensure the i18n plugin is installed and the composable is used within a Vue component or setup function."
    );
  }
  return context;
}
const formatTrailingSlash = withoutTrailingSlash;
function createComposableContext(ctx, nuxtApp = useNuxtApp()) {
  const router = useRouter();
  useDetectors(useRequestEvent(), useI18nDetection(nuxtApp), nuxtApp);
  const defaultLocale = ctx.getDefaultLocale();
  const getLocalizedRouteName = createLocaleRouteNameGetter();
  function resolveLocalizedRouteByName(route, locale) {
    route.name ||= getRouteBaseName(router.currentRoute.value);
    const localizedName = getLocalizedRouteName(route.name, locale);
    if (router.hasRoute(localizedName)) {
      route.name = localizedName;
    }
    return route;
  }
  const routeByPathResolver = createLocalizedRouteByPathResolver();
  function resolveLocalizedRouteByPath(input, locale) {
    const route = routeByPathResolver(input, locale);
    const baseName = getRouteBaseName(route);
    if (baseName) {
      route.name = getLocalizedRouteName(baseName, locale);
      return route;
    }
    route.path = formatTrailingSlash(route.path, true);
    return route;
  }
  const composableCtx = {
    router,
    _head: void 0,
    get head() {
      this._head ??= useHead({});
      return this._head;
    },
    metaState: { htmlAttrs: {}, meta: [], link: [] },
    seoSettings: {
      dir: false,
      lang: false,
      seo: false
    },
    localePathPayload: getLocalePathPayload(),
    routingOptions: {
      defaultLocale,
      strictCanonicals: ctx.config.experimental.alternateLinkCanonicalQueries ?? true,
      hreflangLinks: false
    },
    getLocale: ctx.getLocale,
    getLocales: ctx.getLocales,
    getBaseUrl: ctx.getBaseUrl,
    getRouteBaseName,
    getRouteLocalizedParams: () => router.currentRoute.value.meta["nuxtI18nInternal"] ?? {},
    getLocalizedDynamicParams: (locale) => {
      return composableCtx.getRouteLocalizedParams()?.[locale];
    },
    afterSwitchLocalePath: (path, locale) => {
      composableCtx.getRouteLocalizedParams();
      return path;
    },
    resolveLocalizedRouteObject: (route, locale) => {
      return isRouteLocationPathRaw(route) ? resolveLocalizedRouteByPath(route, locale) : resolveLocalizedRouteByName(route, locale);
    }
  };
  return composableCtx;
}
function getLocalePathPayload(nuxtApp = useNuxtApp()) {
  return JSON.parse("{}");
}
async function loadAndSetLocale(nuxtApp, locale) {
  const ctx = useNuxtI18nContext(nuxtApp);
  const oldLocale = ctx.getLocale();
  if (locale === oldLocale && !ctx.initial) {
    return locale;
  }
  const data = { oldLocale, newLocale: locale, initialSetup: ctx.initial, context: nuxtApp };
  let override = await nuxtApp.callHook("i18n:beforeLocaleSwitch", data);
  if (override != null && false) {
    console.warn("[nuxt-i18n] Do not return in `i18n:beforeLocaleSwitch`, mutate `data.newLocale` instead.");
  }
  override ??= data.newLocale;
  if (isSupportedLocale(override)) {
    locale = override;
  }
  await ctx.loadMessages(locale);
  await ctx.setLocaleSuspend(locale);
  return locale;
}
function skipDetect(detect, path, pathLocale) {
  {
    return false;
  }
}
function detectLocale(nuxtApp, route) {
  const detectConfig = useI18nDetection(nuxtApp);
  const detectors = useDetectors(useRequestEvent(nuxtApp), detectConfig, nuxtApp);
  const ctx = useNuxtI18nContext(nuxtApp);
  const path = isString(route) ? route : route.path;
  function* detect() {
    if (ctx.initial && detectConfig.enabled && !skipDetect(detectConfig, path, detectors.route(path))) {
      yield detectors.cookie();
      yield detectors.header();
      yield detectors.navigator();
      yield detectConfig.fallbackLocale;
    }
  }
  for (const detected of detect()) {
    if (detected && isSupportedLocale(detected)) {
      return detected;
    }
  }
  return ctx.getLocale() || ctx.getDefaultLocale() || "";
}
function navigate(nuxtApp, to, locale) {
  return;
}
function createBaseUrlGetter(nuxt, baseUrl, defaultLocale, getDomainFromLocale) {
  if (isFunction(baseUrl)) {
    return () => baseUrl(nuxt);
  }
  return () => {
    return baseUrl ?? "";
  };
}
/*!
  * message-compiler v11.1.12
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function createPosition(line, column, offset) {
  return { line, column, offset };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  return loc;
}
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14};
const COMPILE_ERROR_CODES_EXTEND_POINT = 17;
function createCompileError(code, loc, options = {}) {
  const { domain, messages, args } = options;
  const msg = code;
  const error = new SyntaxError(String(msg));
  error.code = code;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index22) => _buf[index22] === CHAR_CR && _buf[index22 + 1] === CHAR_LF;
  const isLF = (index22) => _buf[index22] === CHAR_LF;
  const isPS = (index22) => _buf[index22] === CHAR_PS;
  const isLS = (index22) => _buf[index22] === CHAR_LS;
  const isLineEnd = (index22) => isCRLF(index22) || isLF(index22) || isPS(index22) || isLS(index22);
  const index2 = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index: index2,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const DOT = ".";
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 13,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 13,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;
    if (onError) {
      const loc = location ? createLocation(ctx.startLoc, pos) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$3,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type;
    const token = { type };
    if (location) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(
    context2,
    13
    /* TokenTypes.EOF */
  );
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 7) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 7 || currentType === 11)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    const fn = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        return isTextStart(scnr, false);
      }
    };
    const ret = fn();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = "") => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return hasSpace;
      } else if (ch === "@" || !ch) {
        return hasSpace;
      } else if (ch === "|") {
        return !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF);
      } else {
        return true;
      }
    };
    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function isIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36;
  }
  function takeIdentifierChar(scnr) {
    return takeChar(scnr, isIdentifier);
  }
  function isNamedIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36 || // $
    cc === 45;
  }
  function takeNamedIdentifierChar(scnr) {
    return takeChar(scnr, isNamedIdentifier);
  }
  function isDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function takeDigit(scnr) {
    return takeChar(scnr, isDigit);
  }
  function isHexDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57 || // 0-9
    cc >= 65 && cc <= 70 || // A-F
    cc >= 97 && cc <= 102;
  }
  function takeHexDigit(scnr) {
    return takeChar(scnr, isHexDigit);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name = "";
    while (ch = takeNamedIdentifierChar(scnr)) {
      name += ch;
    }
    const currentChar = scnr.currentChar();
    if (currentChar && currentChar !== "}" && currentChar !== EOF && currentChar !== CHAR_SP && currentChar !== CHAR_LF && currentChar !== "　") {
      const invalidPart = readInvalidIdentifier(scnr);
      emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, name + invalidPart);
      return name + invalidPart;
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return name;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return value;
  }
  function isLiteral2(ch) {
    return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    while (ch = takeChar(scnr, isLiteral2)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current = scnr.currentChar();
    if (current === CHAR_LF || current === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function isInvalidIdentifier(ch) {
    return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    while (ch = takeChar(scnr, isInvalidIdentifier)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    return name;
  }
  function readLinkedRefer(scnr) {
    const fn = (buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF || ch === DOT) {
        buf += ch;
        scnr.next();
        return fn(buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(buf);
      }
    };
    return fn("");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(
      scnr,
      "|"
      /* TokenChars.Pipe */
    );
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          2,
          "{"
          /* TokenChars.BraceLeft */
        );
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default: {
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 4 || context2.currentType === 5 || context2.currentType === 6)) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 4, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 6, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 12, readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
      }
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 7 || currentType === 8 || currentType === 11 || currentType === 9) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(
          context2,
          7,
          "@"
          /* TokenChars.LinkedAlias */
        );
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          8,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          9,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 11, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 10, readLinkedRefer(scnr));
          }
        }
        if (currentType === 7) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = {
      type: 13
      /* TokenTypes.EOF */
    };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default: {
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        break;
      }
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(
        _context,
        13
        /* TokenTypes.EOF */
      );
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN$2 = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    // eslint-disable-next-line no-useless-escape
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "�";
    }
  }
}
function createParser(options = {}) {
  const location = options.location !== false;
  const { onError } = options;
  function emitError(tokenzer, code, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onError) {
      const loc = location ? createLocation(start, end) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$2,
        args
      });
      onError(err);
    }
  }
  function startNode(type, offset, loc) {
    const node = { type };
    if (location) {
      node.start = offset;
      node.end = offset;
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset, pos, type) {
    if (location) {
      node.end = offset;
      if (node.loc) {
        node.loc.end = pos;
      }
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index2) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(5, offset, loc);
    node.index = parseInt(index2, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(4, offset, loc);
    node.key = key;
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(9, offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(8, offset, loc);
    if (token.type !== 11) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 8) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 9) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 10:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 4:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default: {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
      }
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 4:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 7: {
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
        }
      }
    } while (context.currentType !== 13 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 13);
    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 13) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (options.onCacheKey) {
      node.cacheKey = options.onCacheKey(source);
    }
    if (context.currentType !== 13) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 13) {
    return "EOF";
  }
  const name = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name.length > 10 ? name.slice(0, 9) + "…" : name;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name) => {
    _context.helpers.add(name);
    return name;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6: {
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper(
        "linked"
        /* HelperNameMap.LINKED */
      );
      transformer.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  );
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
  const body = ast.body;
  if (body.type === 2) {
    optimizeMessageNode(body);
  } else {
    body.cases.forEach((c) => optimizeMessageNode(c));
  }
  return ast;
}
function optimizeMessageNode(message) {
  if (message.items.length === 1) {
    const item = message.items[0];
    if (item.type === 3 || item.type === 9) {
      message.static = item.value;
      delete item.value;
    }
  } else {
    const values = [];
    for (let i = 0; i < message.items.length; i++) {
      const item = message.items[i];
      if (!(item.type === 3 || item.type === 9)) {
        break;
      }
      if (item.value == null) {
        break;
      }
      values.push(item.value);
    }
    if (values.length === message.items.length) {
      message.static = join(values);
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i];
        if (item.type === 3 || item.type === 9) {
          delete item.value;
        }
      }
    }
  }
}
function minify(node) {
  node.t = node.type;
  switch (node.type) {
    case 0: {
      const resource = node;
      minify(resource.body);
      resource.b = resource.body;
      delete resource.body;
      break;
    }
    case 1: {
      const plural = node;
      const cases = plural.cases;
      for (let i = 0; i < cases.length; i++) {
        minify(cases[i]);
      }
      plural.c = cases;
      delete plural.cases;
      break;
    }
    case 2: {
      const message = node;
      const items = message.items;
      for (let i = 0; i < items.length; i++) {
        minify(items[i]);
      }
      message.i = items;
      delete message.items;
      if (message.static) {
        message.s = message.static;
        delete message.static;
      }
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const valueNode = node;
      if (valueNode.value) {
        valueNode.v = valueNode.value;
        delete valueNode.value;
      }
      break;
    }
    case 6: {
      const linked = node;
      minify(linked.key);
      linked.k = linked.key;
      delete linked.key;
      if (linked.modifier) {
        minify(linked.modifier);
        linked.m = linked.modifier;
        delete linked.modifier;
      }
      break;
    }
    case 5: {
      const list = node;
      list.i = list.index;
      delete list.index;
      break;
    }
    case 4: {
      const named = node;
      named.k = named.key;
      delete named.key;
      break;
    }
  }
  delete node.type;
}
function createCodeGenerator(ast, options) {
  const { filename, breakLineCode, needIndent: _needIndent } = options;
  const location = options.location !== false;
  const _context = {
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  if (location && ast.loc) {
    _context.source = ast.loc.source;
  }
  const context = () => _context;
  function push(code, node) {
    _context.code += code;
  }
  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);
    if (i === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "list"
        /* HelperNameMap.LIST */
      )}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
  }
}
const generate = (ast, options = {}) => {
  const mode = isString(options.mode) ? options.mode : "normal";
  const filename = isString(options.filename) ? options.filename : "message.intl";
  !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    filename,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  delete ast.helpers;
  const { code, map } = generator.context();
  return {
    ast,
    code,
    map: map ? map.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function baseCompile$1(source, options = {}) {
  const assignedOptions = assign({}, options);
  const jit = !!assignedOptions.jit;
  const enalbeMinify = !!assignedOptions.minify;
  const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  if (!jit) {
    transform(ast, assignedOptions);
    return generate(ast, assignedOptions);
  } else {
    enambeOptimize && optimize(ast);
    enalbeMinify && minify(ast);
    return { ast, code: "" };
  }
}
/*!
  * core-base v11.1.12
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function isMessageAST(val) {
  return isObject(val) && resolveType(val) === 0 && (hasOwn(val, "b") || hasOwn(val, "body"));
}
const PROPS_BODY = ["b", "body"];
function resolveBody(node) {
  return resolveProps(node, PROPS_BODY);
}
const PROPS_CASES = ["c", "cases"];
function resolveCases(node) {
  return resolveProps(node, PROPS_CASES, []);
}
const PROPS_STATIC = ["s", "static"];
function resolveStatic(node) {
  return resolveProps(node, PROPS_STATIC);
}
const PROPS_ITEMS = ["i", "items"];
function resolveItems(node) {
  return resolveProps(node, PROPS_ITEMS, []);
}
const PROPS_TYPE = ["t", "type"];
function resolveType(node) {
  return resolveProps(node, PROPS_TYPE);
}
const PROPS_VALUE = ["v", "value"];
function resolveValue$1(node, type) {
  const resolved = resolveProps(node, PROPS_VALUE);
  if (resolved != null) {
    return resolved;
  } else {
    throw createUnhandleNodeError(type);
  }
}
const PROPS_MODIFIER = ["m", "modifier"];
function resolveLinkedModifier(node) {
  return resolveProps(node, PROPS_MODIFIER);
}
const PROPS_KEY = ["k", "key"];
function resolveLinkedKey(node) {
  const resolved = resolveProps(node, PROPS_KEY);
  if (resolved) {
    return resolved;
  } else {
    throw createUnhandleNodeError(
      6
      /* NodeTypes.Linked */
    );
  }
}
function resolveProps(node, props, defaultValue) {
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (hasOwn(node, prop) && node[prop] != null) {
      return node[prop];
    }
  }
  return defaultValue;
}
const AST_NODE_PROPS_KEYS = [
  ...PROPS_BODY,
  ...PROPS_CASES,
  ...PROPS_STATIC,
  ...PROPS_ITEMS,
  ...PROPS_KEY,
  ...PROPS_MODIFIER,
  ...PROPS_VALUE,
  ...PROPS_TYPE
];
function createUnhandleNodeError(type) {
  return new Error(`unhandled node type: ${type}`);
}
function format(ast) {
  const msg = (ctx) => formatParts(ctx, ast);
  return msg;
}
function formatParts(ctx, ast) {
  const body = resolveBody(ast);
  if (body == null) {
    throw createUnhandleNodeError(
      0
      /* NodeTypes.Resource */
    );
  }
  const type = resolveType(body);
  if (type === 1) {
    const plural = body;
    const cases = resolveCases(plural);
    return ctx.plural(cases.reduce((messages, c) => [
      ...messages,
      formatMessageParts(ctx, c)
    ], []));
  } else {
    return formatMessageParts(ctx, body);
  }
}
function formatMessageParts(ctx, node) {
  const static_ = resolveStatic(node);
  if (static_ != null) {
    return ctx.type === "text" ? static_ : ctx.normalize([static_]);
  } else {
    const messages = resolveItems(node).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
    return ctx.normalize(messages);
  }
}
function formatMessagePart(ctx, node) {
  const type = resolveType(node);
  switch (type) {
    case 3: {
      return resolveValue$1(node, type);
    }
    case 9: {
      return resolveValue$1(node, type);
    }
    case 4: {
      const named = node;
      if (hasOwn(named, "k") && named.k) {
        return ctx.interpolate(ctx.named(named.k));
      }
      if (hasOwn(named, "key") && named.key) {
        return ctx.interpolate(ctx.named(named.key));
      }
      throw createUnhandleNodeError(type);
    }
    case 5: {
      const list = node;
      if (hasOwn(list, "i") && isNumber(list.i)) {
        return ctx.interpolate(ctx.list(list.i));
      }
      if (hasOwn(list, "index") && isNumber(list.index)) {
        return ctx.interpolate(ctx.list(list.index));
      }
      throw createUnhandleNodeError(type);
    }
    case 6: {
      const linked = node;
      const modifier = resolveLinkedModifier(linked);
      const key = resolveLinkedKey(linked);
      return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
    }
    case 7: {
      return resolveValue$1(node, type);
    }
    case 8: {
      return resolveValue$1(node, type);
    }
    default:
      throw new Error(`unhandled node on format message part: ${type}`);
  }
}
const defaultOnCacheKey = (message) => message;
let compileCache = create();
function baseCompile(message, options = {}) {
  let detectError = false;
  const onError = options.onError || defaultOnError;
  options.onError = (err) => {
    detectError = true;
    onError(err);
  };
  return { ...baseCompile$1(message, options), detectError };
}
// @__NO_SIDE_EFFECTS__
function compile(message, context) {
  if (isString(message)) {
    isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: "production" !== "production",
      jit: true
    });
    const msg = format(ast);
    return !detectError ? compileCache[cacheKey] = msg : msg;
  } else {
    const cacheKey = message.cacheKey;
    if (cacheKey) {
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      return compileCache[cacheKey] = format(message);
    } else {
      return format(message);
    }
  }
}
const CoreErrorCodes = {
  INVALID_ARGUMENT: COMPILE_ERROR_CODES_EXTEND_POINT,
  // 17
  INVALID_DATE_ARGUMENT: 18,
  INVALID_ISO_DATE_ARGUMENT: 19,
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
  NOT_SUPPORT_LOCALE_TYPE: 23
};
const CORE_ERROR_CODES_EXTEND_POINT = 24;
function createCoreError(code) {
  return createCompileError(code, null, void 0);
}
function getLocale(context, options) {
  return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
let _resolveLocale;
function resolveLocale(locale) {
  if (isString(locale)) {
    return locale;
  } else {
    if (isFunction(locale)) {
      if (locale.resolvedOnce && _resolveLocale != null) {
        return _resolveLocale;
      } else if (locale.constructor.name === "Function") {
        const resolve = locale();
        if (isPromise(resolve)) {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
        }
        return _resolveLocale = resolve;
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
      }
    } else {
      throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
    }
  }
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray(fallback) ? fallback : isObject(fallback) ? Object.keys(fallback) : isString(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString(start) ? start : DEFAULT_LOCALE;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString(defaults) ? [defaults] : defaults;
    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const pathStateMachine = [];
pathStateMachine[
  0
  /* States.BEFORE_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    0
    /* States.BEFORE_PATH */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* States.IN_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1
    /* States.IN_PATH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* States.BEFORE_IDENT */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  3
  /* States.IN_IDENT */
] = {
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1,
    1
    /* Actions.PUSH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2,
    1
    /* Actions.PUSH */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    1
    /* Actions.PUSH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7,
    1
    /* Actions.PUSH */
  ]
};
pathStateMachine[
  4
  /* States.IN_SUB_PATH */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ],
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* PathCharTypes.RIGHT_BRACKET */
  ]: [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code = ch.charCodeAt(0);
  switch (code) {
    case 91:
    // [
    case 93:
    // ]
    case 46:
    // .
    case 34:
    // "
    case 39:
      return ch;
    case 95:
    // _
    case 36:
    // $
    case 45:
      return "i";
    case 9:
    // Tab (HT)
    case 10:
    // Newline (LF)
    case 13:
    // Return (CR)
    case 160:
    // No-break space (NBSP)
    case 65279:
    // Byte Order Mark (BOM)
    case 8232:
    // Line Separator (LS)
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index2 = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* Actions.APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* Actions.PUSH */
  ] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* Actions.APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* Actions.APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* Actions.PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index2 + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index2++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* Actions.APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index2++;
    c = path[index2];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap[
      "l"
      /* PathCharTypes.ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const key = hit[i];
    if (AST_NODE_PROPS_KEYS.includes(key) && isMessageAST(last)) {
      return null;
    }
    const val = last[key];
    if (val === void 0) {
      return null;
    }
    if (isFunction(last)) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
const VERSION$1 = "11.1.12";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      return type === "text" && isString(val) ? val.toUpperCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      return type === "text" && isString(val) ? val.toLowerCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      return type === "text" && isString(val) ? capitalize(val) : type === "vnode" && isObject(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
    }
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
const setAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ (meta) => {
};
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
  const version = isString(options.version) ? options.version : VERSION$1;
  const locale = isString(options.locale) || isFunction(options.locale) ? options.locale : DEFAULT_LOCALE;
  const _locale = isFunction(locale) ? DEFAULT_LOCALE : locale;
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
  const messages = isPlainObject(options.messages) ? options.messages : createResources(_locale);
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : createResources(_locale);
  const modifiers = assign(create(), options.modifiers, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || create();
  const missing = isFunction(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject(options.fallbackContext) ? options.fallbackContext : void 0;
  const internalOptions = options;
  const __datetimeFormatters = isObject(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  return context;
}
const createResources = (locale) => ({ [locale]: create() });
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString(ret) ? ret : key;
  } else {
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
function isAlmostSameLocale(locale, compareLocale) {
  if (locale === compareLocale)
    return false;
  return locale.split("-")[0] === compareLocale.split("-")[0];
}
function isImplicitFallback(targetLocale, locales) {
  const index2 = locales.indexOf(targetLocale);
  if (index2 === -1) {
    return false;
  }
  for (let i = index2 + 1; i < locales.length; i++) {
    if (isAlmostSameLocale(targetLocale, locales[i])) {
      return true;
    }
  }
  return false;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  let value;
  if (isString(arg1)) {
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    return new Intl.NumberFormat(locale, overrides).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join(values);
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index2 = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index2 : index2;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages) => {
    return messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
  };
  const _list = options.list || [];
  const list = (index2) => _list[index2];
  const _named = options.named || create();
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key, useLinked) {
    const msg = isFunction(options.messages) ? options.messages(key, !!useLinked) : isObject(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject(options.processor) && isFunction(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type2 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject(arg1)) {
        modifier = arg1.modifier || modifier;
        type2 = arg1.type || type2;
      } else if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString(arg2)) {
        type2 = arg2 || type2;
      }
    }
    const ret = message(key, true)(ctx);
    const msg = (
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type2 === "vnode" && isArray(ret) && modifier ? ret[0] : ret
    );
    return modifier ? _modifier(modifier)(msg, type2) : msg;
  };
  const ctx = {
    [
      "list"
      /* HelperNameMap.LIST */
    ]: list,
    [
      "named"
      /* HelperNameMap.NAMED */
    ]: named,
    [
      "plural"
      /* HelperNameMap.PLURAL */
    ]: plural,
    [
      "linked"
      /* HelperNameMap.LINKED */
    ]: linked,
    [
      "message"
      /* HelperNameMap.MESSAGE */
    ]: message,
    [
      "type"
      /* HelperNameMap.TYPE */
    ]: type,
    [
      "interpolate"
      /* HelperNameMap.INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* HelperNameMap.NORMALIZE */
    ]: normalize,
    [
      "values"
      /* HelperNameMap.VALUES */
    ]: assign(create(), _list, _named)
  };
  return ctx;
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : null;
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey != null && (isString(defaultMsgOrKey) || isFunction(defaultMsgOrKey));
  const locale = getLocale(context, options);
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages[locale] || create()
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const onError = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  let ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (escapeParameter && isString(ret)) {
    ret = sanitizeTranslatedHtml(ret);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map((item) => isString(item) ? escapeHtml(item) : item);
  } else if (isObject(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = create();
  let targetLocale;
  let format2 = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    message = messages[targetLocale] || create();
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
      break;
    }
    if (!isImplicitFallback(targetLocale, locales)) {
      const missingRet = handleMissing(
        context,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        key,
        targetLocale,
        missingWarn,
        type
      );
      if (missingRet !== key) {
        format2 = missingRet;
      }
    }
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = (() => format2);
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = create();
  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign(options, arg3);
  }
  return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err) => {
      onError && onError(err);
      {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key, useLinked) => {
    let val = resolveValue2(message, key);
    if (val == null && (fallbackContext || useLinked)) {
      const [, , message2] = resolveMessageFormat(
        fallbackContext || context,
        // NOTE: if has fallbackContext, fallback to root, else if use linked, fallback to local context
        key,
        locale,
        fallbackLocale,
        fallbackWarn,
        missingWarn
      );
      val = resolveValue2(message2, key);
    }
    if (isString(val) || isMessageAST(val)) {
      let occurred = false;
      const onError = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, onError);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
/*!
  * vue-i18n v11.1.12
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
const VERSION = "11.1.12";
const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: CORE_ERROR_CODES_EXTEND_POINT,
  // 24
  // legacy module errors
  INVALID_ARGUMENT: 25,
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: 26,
  NOT_INSTALLED: 27,
  // directive module errors
  REQUIRED_VALUE: 28,
  INVALID_VALUE: 29,
  NOT_INSTALLED_WITH_PROVIDE: 31,
  // unexpected error
  UNEXPECTED_ERROR: 32};
function createI18nError(code, ...args) {
  return createCompileError(code, null, void 0);
}
const TranslateVNodeSymbol = /* @__PURE__ */ makeSymbol("__translateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol("__numberParts");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
const InejctWithOptionSymbol = /* @__PURE__ */ makeSymbol("__injectWithOption");
const DisposeSymbol = /* @__PURE__ */ makeSymbol("__dispose");
function handleFlatJson(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  if (isMessageAST(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      let hasStringValue = false;
      for (let i = 0; i < lastIndex; i++) {
        if (subKeys[i] === "__proto__") {
          throw new Error(`unsafe key: ${subKeys[i]}`);
        }
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = create();
        }
        if (!isObject(currentObj[subKeys[i]])) {
          hasStringValue = true;
          break;
        }
        currentObj = currentObj[subKeys[i]];
      }
      if (!hasStringValue) {
        if (!isMessageAST(currentObj)) {
          currentObj[subKeys[lastIndex]] = obj[key];
          delete obj[key];
        } else {
          if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) {
            delete obj[key];
          }
        }
      }
      if (!isMessageAST(currentObj)) {
        const target = currentObj[subKeys[lastIndex]];
        if (isObject(target)) {
          handleFlatJson(target);
        }
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject(messages) ? messages : isArray(__i18n) ? create() : { [locale]: create() };
  if (isArray(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || create();
          deepCopy(resource, ret[locale2]);
        } else {
          deepCopy(resource, ret);
        }
      } else {
        isString(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(gl, options, componentOptions) {
  let messages = isObject(options.messages) ? options.messages : create();
  if ("__i18nGlobal" in componentOptions) {
    messages = getLocaleMessages(gl.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages);
  if (locales.length) {
    locales.forEach((locale) => {
      gl.mergeLocaleMessage(locale, messages[locale]);
    });
  }
  {
    if (isObject(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
const NOOP_RETURN_ARRAY = () => [];
const NOOP_RETURN_FALSE = () => false;
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return ((ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  });
}
const getMetaInfo = /* @__NO_SIDE_EFFECTS__ */ () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}) {
  const { __root, __injectWithOption } = options;
  const _isGlobal = __root === void 0;
  const flatJson = options.flatJson;
  const _ref = shallowRef;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = _ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = _ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = _ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _context.locale = val;
      _locale.value = val;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _context.fallbackLocale = val;
      _fallbackLocale.value = val;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    try {
      if ("production" !== "production" || false) ;
      if (!_isGlobal) {
        _context.fallbackContext = __root ? getFallbackContext() : void 0;
      }
      ret = fn(_context);
    } finally {
      if (!_isGlobal) {
        _context.fallbackContext = void 0;
      }
    }
    if (warnType !== "translate exists" && // for not `te` (e.g `t`)
    isNumber(ret) && ret === NOT_REOSLVED || warnType === "translate exists" && !ret) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val) || isArray(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val) || isArray(val));
  }
  function normalize(values) {
    return values.map((val) => isString(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function translateVNode(...args) {
    return wrapWithDeps((context) => {
      let ret;
      const _context2 = context;
      try {
        _context2.processor = processor;
        ret = Reflect.apply(translate, null, [_context2, ...args]);
      } finally {
        _context2.processor = null;
      }
      return ret;
    }, () => parseTranslateArgs(...args), "translate", (root) => root[TranslateVNodeSymbol](...args), (key) => [createTextNode(key)], (val) => isArray(val));
  }
  function numberParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => root[NumberPartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
  }
  function datetimeParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => root[DatetimePartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    return wrapWithDeps(() => {
      if (!key) {
        return false;
      }
      const targetLocale = isString(locale2) ? locale2 : _locale.value;
      const message = getLocaleMessage(targetLocale);
      const resolved = _context.messageResolver(message, key);
      return isMessageAST(resolved) || isMessageFunction(resolved) || isString(resolved);
    }, () => [key], "translate exists", (root) => {
      return Reflect.apply(root.te, root, [key, locale2]);
    }, NOOP_RETURN_FALSE, (val) => isBoolean(val));
  }
  function resolveMessages(key) {
    let messages2 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages2 = messageValue;
        break;
      }
    }
    return messages2;
  }
  function tm(key) {
    const messages2 = resolveMessages(key);
    return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    if (flatJson) {
      const _message = { [locale2]: message };
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
      message = _message[locale2];
    }
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    const _message = { [locale2]: message };
    if (flatJson) {
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
    }
    message = _message[locale2];
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOptionSymbol] = __injectWithOption;
    composer[TranslateVNodeSymbol] = translateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  return composer;
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return [
        ...slot,
        // prettier-ignore
        ...current.type === Fragment ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, create());
  }
}
function getFragmentableTag() {
  return Fragment;
}
const TranslationImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-t",
  props: assign({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      validator: (val) => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const keys = Object.keys(slots).filter((key) => key[0] !== "_");
      const options = create();
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = isString(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n[TranslateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign(create(), attrs);
      const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }
});
const Translation = TranslationImpl;
function isVNode(target) {
  return isArray(target) && !isString(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = create();
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString(props.format)) {
      options.key = props.format;
    } else if (isObject(props.format)) {
      if (isString(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign(create(), options2, { [prop]: props.format[prop] }) : options2;
      }, create());
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray(parts)) {
      children = parts.map((part, index2) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index: index2, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index2}`;
        }
        return node;
      });
    } else if (isString(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign(create(), attrs);
    const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NumberFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-n",
  props: assign({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[NumberPartsSymbol](...args)
    ));
  }
});
const NumberFormat = NumberFormatImpl;
function getComposer$1(i18n, instance) {
  const i18nInternal = i18n;
  if (i18n.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}
function vTDirective(i18n) {
  const _process = (binding) => {
    const { instance, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$1(i18n, instance.$);
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (isString(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    [Translation.name, "I18nT"].forEach((name) => app.component(name, Translation));
    [NumberFormat.name, "I18nN"].forEach((name) => app.component(name, NumberFormat));
    [DatetimeFormat.name, "I18nD"].forEach((name) => app.component(name, DatetimeFormat));
  }
  {
    app.directive("t", vTDirective(i18n));
  }
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol("global-vue-i18n");
function createI18n(options = {}) {
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options);
  const symbol = /* @__PURE__ */ makeSymbol("");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  const i18n = {
    // mode
    get mode() {
      return "composition";
    },
    // install plugin
    async install(app, ...options2) {
      app.__VUE_I18N_SYMBOL__ = symbol;
      app.provide(app.__VUE_I18N_SYMBOL__, i18n);
      if (isPlainObject(options2[0])) {
        const opts = options2[0];
        i18n.__composerExtend = opts.__composerExtend;
        i18n.__vueI18nExtend = opts.__vueI18nExtend;
      }
      let globalReleaseHandler = null;
      if (__globalInjection) {
        globalReleaseHandler = injectGlobalFields(app, i18n.global);
      }
      {
        apply(app, i18n, ...options2);
      }
      const unmountApp = app.unmount;
      app.unmount = () => {
        globalReleaseHandler && globalReleaseHandler();
        i18n.dispose();
        unmountApp();
      };
    },
    // global accessor
    get global() {
      return __global;
    },
    dispose() {
      globalScope.stop();
    },
    // @internal
    __instances,
    // @internal
    __getInstance,
    // @internal
    __setInstance,
    // @internal
    __deleteInstance
  };
  return i18n;
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
  }
  const i18n = getI18nInstance(instance);
  const gl = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (scope === "global") {
    adjustI18nResources(gl, options, componentOptions);
    return gl;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = gl;
    }
    return composer2;
  }
  const i18nInternal = i18n;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (gl) {
      composerOptions.__root = gl;
    }
    composer = createComposer(composerOptions);
    if (i18nInternal.__composerExtend) {
      composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
    }
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode) {
  const scope = effectScope();
  const obj = scope.run(() => createComposer(options));
  if (obj == null) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
  }
  return [scope, obj];
}
function getI18nInstance(instance) {
  const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
  if (!i18n) {
    throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
  }
  return i18n;
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
  return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer(i18n, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = getParentComponentInstance(target, useComponent);
  while (current != null) {
    const i18nInternal = i18n;
    if (i18n.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    }
    if (composer != null) {
      break;
    }
    if (root === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function getParentComponentInstance(target, useComponent = false) {
  if (target == null) {
    return null;
  }
  return !useComponent ? target.parent : target.vnode.ctx || target.parent;
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
function injectGlobalFields(app, composer) {
  const i18n = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
  const dispose = () => {
    delete app.config.globalProperties.$i18n;
    globalExportMethods.forEach((method) => {
      delete app.config.globalProperties[`$${method}`];
    });
  };
  return dispose;
}
const DatetimeFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-d",
  props: assign({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[DatetimePartsSymbol](...args)
    ));
  }
});
const DatetimeFormat = DatetimeFormatImpl;
registerMessageCompiler(compile);
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
function useRouteBaseName(nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  return (route) => {
    if (route == null) return;
    return common.getRouteBaseName(route) || void 0;
  };
}
function useLocalePath(nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  return (route, locale) => localePath(common, route, locale);
}
function useLocaleRoute(nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  return (route, locale) => localeRoute(common, route, locale);
}
function useSwitchLocalePath(nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  return (locale) => switchLocalePath(common, locale);
}
const identifier = "nuxt-i18n-slp";
const switchLocalePathLinkWrapperExpr = new RegExp(
  [`<!--${identifier}-\\[(\\w+)\\]-->`, `.+?`, `<!--/${identifier}-->`].join(""),
  "g"
);
const switch_locale_path_ssr_NflG9_QeVcJ1jVig0vCfxB_cZhpEMQ9U2ujRUiYbbVw = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:switch-locale-path-ssr",
  dependsOn: ["i18n:plugin"],
  setup(_nuxt) {
    const nuxt = useNuxtApp(_nuxt._id);
    const switchLocalePath2 = useSwitchLocalePath(nuxt);
    nuxt.hook("app:rendered", (ctx) => {
      if (ctx.renderResult?.html == null) return;
      ctx.renderResult.html = ctx.renderResult.html.replaceAll(
        switchLocalePathLinkWrapperExpr,
        (match, p1) => {
          const encoded = encodeURI(switchLocalePath2(p1 ?? ""));
          return match.replace(
            /href="([^"]+)"/,
            `href="${encoded || "#"}" ${""}`
          );
        }
      );
    });
  }
});
const route_locale_detect__HPHJq3Jg7gwhwgKEI8tQavopSAjmrCSPXl9HgL2h9U = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:route-locale-detect",
  dependsOn: ["i18n:plugin"],
  async setup(_nuxt) {
    let __temp, __restore;
    const nuxt = useNuxtApp(_nuxt._id);
    const ctx = useNuxtI18nContext(nuxt);
    const resolvedLocale = useResolvedLocale();
    [__temp, __restore] = executeAsync(() => nuxt.runWithContext(
      () => loadAndSetLocale(
        nuxt,
        ctx.initial && resolvedLocale.value || detectLocale(nuxt, nuxt.$router.currentRoute.value)
      )
    )), await __temp, __restore();
    return;
  }
});
const preload_30FByJAs5vQa4mNNQLX15KPGCCVjIGrzdTjh6ve5W24 = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:preload",
  dependsOn: ["i18n:plugin"],
  async setup(_nuxt) {
    return;
  }
});
function extendI18n(i18n, { extendComposer, extendComposerInstance }) {
  const scope = effectScope();
  const installI18n = i18n.install.bind(i18n);
  i18n.install = (app, ...options) => {
    const pluginOptions = assign({}, options[0]);
    pluginOptions.__composerExtend = (c) => {
      extendComposerInstance(c, getComposer$3(i18n));
      return () => {
      };
    };
    if (i18n.mode === "legacy") {
      pluginOptions.__vueI18nExtend = (vueI18n) => {
        extendComposerInstance(vueI18n, getComposer$3(vueI18n));
        return () => {
        };
      };
    }
    Reflect.apply(installI18n, i18n, [app, pluginOptions]);
    const globalComposer = getComposer$3(i18n);
    scope.run(() => {
      extendComposer(globalComposer);
      if (i18n.mode === "legacy" && "__composer" in i18n.global) {
        extendComposerInstance(i18n.global, getComposer$3(i18n.global));
      }
    });
    if (i18n.mode === "composition" && app.config.globalProperties.$i18n != null) {
      extendComposerInstance(app.config.globalProperties.$i18n, globalComposer);
    }
    if (app.unmount) {
      const unmountApp = app.unmount.bind(app);
      app.unmount = () => {
        scope.stop();
        unmountApp();
      };
    }
  };
}
const setupVueI18nOptions = async (defaultLocale) => {
  const options = await loadVueI18nOptions(vueI18nConfigs);
  options.locale = defaultLocale || options.locale || "en-US";
  options.defaultLocale = defaultLocale;
  options.fallbackLocale ??= false;
  options.messages ??= {};
  for (const locale of localeCodes) {
    options.messages[locale] ??= {};
  }
  return options;
};
const i18n_EI7LsD1KYQADczz5hrChviGQCdVM8yUkvFEZLJpmnvM = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin",
  parallel: false,
  async setup(_nuxt) {
    let __temp, __restore;
    Object.defineProperty(_nuxt.versions, "nuxtI18n", { get: () => "10.1.1" });
    const nuxt = useNuxtApp(_nuxt._id);
    const runtimeI18n = useRuntimeI18n(nuxt);
    const preloadedOptions = nuxt.ssrContext?.event?.context?.nuxtI18n?.vueI18nOptions;
    const _defaultLocale = getDefaultLocaleForDomain(useRequestURL({ xForwardedHost: true }).host) || runtimeI18n.defaultLocale || "";
    const optionsI18n = preloadedOptions || ([__temp, __restore] = executeAsync(() => setupVueI18nOptions(_defaultLocale)), __temp = await __temp, __restore(), __temp);
    const localeConfigs = useLocaleConfigs();
    {
      localeConfigs.value = useRequestEvent().context.nuxtI18n?.localeConfigs || {};
    }
    prerenderRoutes(localeCodes.map((locale) => `/_i18n/${"ZUR5TDIg"}/${locale}/messages.json`));
    const i18n = createI18n(optionsI18n);
    const detectors = useDetectors(useRequestEvent(nuxt), useI18nDetection(nuxt), nuxt);
    const ctx = createNuxtI18nContext(nuxt, i18n, optionsI18n.defaultLocale);
    nuxt._nuxtI18n = ctx;
    extendI18n(i18n, {
      extendComposer(composer) {
        composer.locales = computed(() => runtimeI18n.locales);
        composer.localeCodes = computed(() => localeCodes);
        const _baseUrl = ref(ctx.getBaseUrl());
        composer.baseUrl = computed(() => _baseUrl.value);
        composer.strategy = "no_prefix";
        composer.localeProperties = computed(
          () => normalizedLocales.find((l) => l.code === composer.locale.value) || { code: composer.locale.value }
        );
        composer.setLocale = async (locale) => {
          await loadAndSetLocale(nuxt, locale);
          await nuxt.runWithContext(() => navigate(nuxt, nuxt.$router.currentRoute.value));
        };
        composer.loadLocaleMessages = ctx.loadMessages;
        composer.differentDomains = false;
        composer.defaultLocale = optionsI18n.defaultLocale;
        composer.getBrowserLocale = () => resolveSupportedLocale(detectors.header());
        composer.getLocaleCookie = () => resolveSupportedLocale(detectors.cookie());
        composer.setLocaleCookie = ctx.setCookieLocale;
        composer.finalizePendingLocaleChange = async () => {
          if (!i18n.__pendingLocale) return;
          await i18n.__resolvePendingLocalePromise?.();
        };
        composer.waitForPendingLocaleChange = async () => {
          await i18n?.__pendingLocalePromise;
        };
      },
      extendComposerInstance(instance, c) {
        const props = [
          ["locales", () => c.locales],
          ["localeCodes", () => c.localeCodes],
          ["baseUrl", () => c.baseUrl],
          ["strategy", () => "no_prefix"],
          ["localeProperties", () => c.localeProperties],
          ["setLocale", () => async (locale) => Reflect.apply(c.setLocale, c, [locale])],
          ["loadLocaleMessages", () => async (locale) => Reflect.apply(c.loadLocaleMessages, c, [locale])],
          ["differentDomains", () => false],
          ["defaultLocale", () => c.defaultLocale],
          ["getBrowserLocale", () => () => Reflect.apply(c.getBrowserLocale, c, [])],
          ["getLocaleCookie", () => () => Reflect.apply(c.getLocaleCookie, c, [])],
          ["setLocaleCookie", () => (locale) => Reflect.apply(c.setLocaleCookie, c, [locale])],
          ["finalizePendingLocaleChange", () => () => Reflect.apply(c.finalizePendingLocaleChange, c, [])],
          ["waitForPendingLocaleChange", () => () => Reflect.apply(c.waitForPendingLocaleChange, c, [])]
        ];
        for (const [key, get] of props) {
          Object.defineProperty(instance, key, { get });
        }
      }
    });
    nuxt.vueApp.use(i18n);
    Object.defineProperty(nuxt, "$i18n", { get: () => getI18nTarget(i18n) });
    nuxt.provide("localeHead", (options) => localeHead(nuxt._nuxtI18n.composableCtx, options));
    nuxt.provide("localePath", useLocalePath(nuxt));
    nuxt.provide("localeRoute", useLocaleRoute(nuxt));
    nuxt.provide("routeBaseName", useRouteBaseName(nuxt));
    nuxt.provide("getRouteBaseName", useRouteBaseName(nuxt));
    nuxt.provide("switchLocalePath", useSwitchLocalePath(nuxt));
  }
});
const plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    const configs = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
      resources.push(baseURL2 + (options.localApiEndpoint || "/api/_nuxt_icon"));
      if (options.fallbackToApi === true || options.fallbackToApi === "client-only") {
        resources.push(options.iconifyApiEndpoint);
      }
    } else if (options.provider === "none") {
      _api.setFetch(() => Promise.resolve(new Response()));
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    async function customIconLoader(icons, prefix) {
      try {
        const data = await $fetch(resources[0] + "/" + prefix + ".json", {
          query: {
            icons: icons.join(",")
          }
        });
        if (!data || data.prefix !== prefix || !data.icons)
          throw new Error("Invalid data" + JSON.stringify(data));
        return data;
      } catch (e) {
        console.error("Failed to load custom icons", e);
        return null;
      }
    }
    addAPIProvider("", { resources });
    for (const prefix of options.customCollections || []) {
      if (prefix)
        setCustomIconsLoader(customIconLoader, prefix);
    }
  }
  // For type portability
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const ssg_detect_IpHCGcQQ_IR5Rl99qyukWoMA9fJGfuTYyoksTzy81cs = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:ssg-detect",
  dependsOn: ["i18n:plugin", "i18n:plugin:route-locale-detect"],
  enforce: "post",
  setup(_nuxt) {
    return;
  }
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  switch_locale_path_ssr_NflG9_QeVcJ1jVig0vCfxB_cZhpEMQ9U2ujRUiYbbVw,
  route_locale_detect__HPHJq3Jg7gwhwgKEI8tQavopSAjmrCSPXl9HgL2h9U,
  preload_30FByJAs5vQa4mNNQLX15KPGCCVjIGrzdTjh6ve5W24,
  i18n_EI7LsD1KYQADczz5hrChviGQCdVM8yUkvFEZLJpmnvM,
  plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8,
  ssg_detect_IpHCGcQQ_IR5Rl99qyukWoMA9fJGfuTYyoksTzy81cs
];
async function loadIcon(name, timeout) {
  if (!name)
    return null;
  const _icon = getIcon(name);
  if (_icon)
    return _icon;
  let timeoutWarn;
  const load = loadIcon$1(name).catch(() => {
    console.warn(`[Icon] failed to load icon \`${name}\``);
    return null;
  });
  if (timeout > 0)
    await Promise.race([
      load,
      new Promise((resolve) => {
        timeoutWarn = setTimeout(() => {
          console.warn(`[Icon] loading icon \`${name}\` timed out after ${timeout}ms`);
          resolve();
        }, timeout);
      })
    ]).finally(() => clearTimeout(timeoutWarn));
  else
    await load;
  return getIcon(name);
}
function useResolvedName(getName) {
  const options = useAppConfig().icon;
  const collections = (options.collections || []).sort((a, b) => b.length - a.length);
  return computed(() => {
    const name = getName();
    const bare = name.startsWith(options.cssSelectorPrefix) ? name.slice(options.cssSelectorPrefix.length) : name;
    const resolved = options.aliases?.[bare] || bare;
    if (!resolved.includes(":")) {
      const collection = collections.find((c) => resolved.startsWith(c + "-"));
      return collection ? collection + ":" + resolved.slice(collection.length + 1) : resolved;
    }
    return resolved;
  });
}
function resolveCustomizeFn(customize, globalCustomize) {
  if (customize === false) return void 0;
  if (customize === true || customize === null) return globalCustomize;
  return customize;
}
const SYMBOL_SERVER_CSS = "NUXT_ICONS_SERVER_CSS";
function escapeCssSelector(selector) {
  return selector.replace(/([^\w-])/g, "\\$1");
}
const NuxtIconCss = /* @__PURE__ */ defineComponent({
  name: "NuxtIconCss",
  props: {
    name: {
      type: String,
      required: true
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props) {
    const nuxt = useNuxtApp();
    const options = useAppConfig().icon;
    const cssClass = computed(() => props.name ? options.cssSelectorPrefix + props.name : "");
    const selector = computed(() => "." + escapeCssSelector(cssClass.value));
    function getCSS(icon, withLayer = true) {
      let iconSelector = selector.value;
      if (options.cssWherePseudo) {
        iconSelector = `:where(${iconSelector})`;
      }
      const css = getIconCSS(icon, {
        iconSelector,
        format: "compressed",
        customise: resolveCustomizeFn(props.customize, options.customize)
      });
      if (options.cssLayer && withLayer) {
        return `@layer ${options.cssLayer} { ${css} }`;
      }
      return css;
    }
    onServerPrefetch(async () => {
      {
        const configs = (/* @__PURE__ */ useRuntimeConfig()).icon || {};
        if (!configs?.serverKnownCssClasses?.includes(cssClass.value)) {
          const icon = await loadIcon(props.name, options.fetchTimeout).catch(() => null);
          if (!icon)
            return null;
          let ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS];
          if (!ssrCSS) {
            ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS] = /* @__PURE__ */ new Map();
            nuxt.runWithContext(() => {
              useHead({
                style: [
                  () => {
                    const sep = "";
                    let css = Array.from(ssrCSS.values()).sort().join(sep);
                    if (options.cssLayer) {
                      css = `@layer ${options.cssLayer} {${sep}${css}${sep}}`;
                    }
                    return { innerHTML: css };
                  }
                ]
              }, {
                tagPriority: "low"
              });
            });
          }
          if (props.name && !ssrCSS.has(props.name)) {
            const css = getCSS(icon, false);
            ssrCSS.set(props.name, css);
          }
          return null;
        }
      }
    });
    return () => h("span", { class: ["iconify", cssClass.value] });
  }
});
const NuxtIconSvg = /* @__PURE__ */ defineComponent({
  name: "NuxtIconSvg",
  props: {
    name: {
      type: String,
      required: true
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props, { slots }) {
    useNuxtApp();
    const options = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const storeKey = "i-" + name.value;
    if (name.value) {
      onServerPrefetch(async () => {
        {
          await useAsyncData(
            storeKey,
            async () => await loadIcon(name.value, options.fetchTimeout),
            { deep: false }
          );
        }
      });
    }
    return () => h(Icon, {
      icon: name.value,
      ssr: true,
      // Iconify uses `customise`, where we expose `customize` for consistency
      customise: resolveCustomizeFn(props.customize, options.customize)
    }, slots);
  }
});
const __nuxt_component_1$2 = defineComponent({
  name: "NuxtIcon",
  props: {
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: null
    },
    size: {
      type: [Number, String],
      required: false,
      default: null
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props, { slots }) {
    const nuxtApp = useNuxtApp();
    const runtimeOptions = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const component = computed(
      () => nuxtApp.vueApp?.component(name.value) || ((props.mode || runtimeOptions.mode) === "svg" ? NuxtIconSvg : NuxtIconCss)
    );
    const style = computed(() => {
      const size = props.size || runtimeOptions.size;
      return size ? { fontSize: Number.isNaN(+size) ? size : size + "px" } : null;
    });
    return () => h(
      component.value,
      {
        ...runtimeOptions.attrs,
        name: name.value,
        class: runtimeOptions.class,
        style: style.value,
        customize: props.customize
      },
      slots
    );
  }
});
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$2
}, Symbol.toStringTag, { value: "Module" }));
const logoUrl = "" + __buildAssetsURL("main-logo-cris-dev.C-3XUqG9.png");
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$i = {
  __name: "CdHeader",
  __ssrInlineRender: true,
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const route = useRoute();
    useRouter();
    const hydrated = ref(false);
    const isMenuOpen = ref(false);
    const isScrolled = ref(false);
    const ensureHash = (href) => {
      if (!href) return "";
      return href.startsWith("#") ? href : `#${href}`;
    };
    const isActive = (href) => {
      if (!href) return false;
      const hash = href.startsWith("#") ? href : `#${href}`;
      return route.hash === hash;
    };
    const activeClassFor = (href) => {
      if (!hydrated.value) return "";
      return isActive(href) ? "after:origin-left after:scale-x-100 text-primary" : "";
    };
    const scrollToSection = (href) => {
      return;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1$2;
      const _component_NuxtLink = __nuxt_component_0$3;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [
          "fixed top-0 left-0 right-0 z-50 m-auto text-text px-4 sm:px-6 md:px-8 lg:px-16 transition-all duration-500 ease-in-out",
          unref(isScrolled) ? "py-2 bg-border/90 backdrop-blur-md shadow-2xl" : "py-4 bg-border shadow-lg"
        ]
      }, _attrs))} data-v-78bed492><header class="flex items-center justify-between max-w-screen-xl m-auto w-full" data-v-78bed492><div class="${ssrRenderClass([
        "flex items-center gap-3 transition-all duration-500",
        unref(isScrolled) ? "scale-90" : "scale-100"
      ])}" data-v-78bed492><img${ssrRenderAttr("src", unref(logoUrl))}${ssrRenderAttr("alt", _ctx.$t("global.altLogo"))} class="${ssrRenderClass([
        "drop-shadow-sm transition-all duration-500",
        unref(isScrolled) ? "h-6 w-8" : "h-7 w-9"
      ])}" data-v-78bed492><h2 class="${ssrRenderClass([
        "tracking-wider text-text flex items-center font-bold transition-all duration-500",
        unref(isScrolled) ? "text-lg md:text-xl" : "text-xl md:text-2xl"
      ])}" data-v-78bed492> &lt;<span class="text-text" data-v-78bed492>Cris</span><span class="text-primary" data-v-78bed492>Dev</span> /&gt; </h2></div><button type="button" class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-text hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"${ssrRenderAttr("aria-expanded", unref(isMenuOpen) ? "true" : "false")} aria-label="Abrir menú" data-v-78bed492>`);
      if (!unref(isMenuOpen)) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:menu",
          class: "h-6 w-6"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:close",
          class: "h-6 w-6"
        }, null, _parent));
      }
      _push(`</button><nav class="hidden md:flex flex-1 justify-end" data-v-78bed492><ul class="flex flex-wrap gap-5" data-v-78bed492><!--[-->`);
      ssrRenderList(__props.menus, ({ name, id }) => {
        _push(`<li data-v-78bed492>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: ensureHash(id),
          class: [
            "relative inline-block text-text transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-primary after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 font-bold after:transition-transform after:duration-500 after:ease-in-out uppercase cursor-pointer",
            activeClassFor(id)
          ],
          "aria-current": unref(hydrated) && isActive(id) ? "page" : void 0,
          onClick: ($event) => scrollToSection()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-primary font-bold" data-v-78bed492${_scopeId}>&lt;</span> ${ssrInterpolate(_ctx.$t(name))} <span class="text-primary font-bold" data-v-78bed492${_scopeId}></span>/&gt; `);
            } else {
              return [
                createVNode("span", { class: "text-primary font-bold" }, "<"),
                createTextVNode(" " + toDisplayString$1(_ctx.$t(name)) + " ", 1),
                createVNode("span", { class: "text-primary font-bold" }),
                createTextVNode("/> ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav></header>`);
      if (unref(isMenuOpen)) {
        _push(`<div class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col w-screen h-screen" role="dialog" aria-modal="true" data-v-78bed492><div class="flex items-center justify-between p-4 bg-black/70 backdrop-blur-sm shadow-lg flex-shrink-0" data-v-78bed492><div class="flex items-center gap-2" data-v-78bed492><img${ssrRenderAttr("src", unref(logoUrl))}${ssrRenderAttr("alt", _ctx.$t("global.altLogo"))} class="h-7 w-9 drop-shadow-sm" data-v-78bed492><span class="font-bold text-lg" data-v-78bed492>&lt;<span class="text-text" data-v-78bed492>Cris</span><span class="text-primary" data-v-78bed492>Dev</span> /&gt;</span></div><button type="button" class="inline-flex items-center justify-center rounded-md p-2 text-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200" aria-label="Cerrar menú" data-v-78bed492>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:close",
          class: "h-7 w-7"
        }, null, _parent));
        _push(`</button></div><nav class="flex-1 flex items-center justify-center overflow-y-auto" data-v-78bed492><ul class="flex flex-col items-center gap-6 p-6 my-auto" data-v-78bed492><!--[-->`);
        ssrRenderList(__props.menus, ({ name, id }) => {
          _push(`<li class="w-full text-center" data-v-78bed492><a${ssrRenderAttr("href", ensureHash(id))} class="${ssrRenderClass([[unref(hydrated) && isActive(id) ? "text-primary scale-110" : ""], "text-2xl uppercase font-extrabold tracking-wide text-white hover:text-primary transition-all duration-300 cursor-pointer block py-3 hover:scale-110 transform w-full"])}"${ssrRenderAttr("aria-current", unref(hydrated) && isActive(id) ? "page" : void 0)} data-v-78bed492><span class="text-primary font-bold" data-v-78bed492>&lt;</span> ${ssrInterpolate(_ctx.$t(name))} <span class="text-primary font-bold" data-v-78bed492>/&gt;</span></a></li>`);
        });
        _push(`<!--]--></ul></nav></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/Header.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-78bed492"]]);
const _sfc_main$h = {
  __name: "UIButton",
  __ssrInlineRender: true,
  props: {
    variant: {
      type: String,
      default: "primary",
      validator: (value) => ["primary", "secondary"].includes(value)
    },
    icon: {
      type: String,
      default: null
    },
    iconPosition: {
      type: String,
      default: "right",
      validator: (value) => ["left", "right"].includes(value)
    },
    type: {
      type: String,
      default: "button",
      validator: (value) => ["button", "submit", "reset"].includes(value)
    },
    href: {
      type: String,
      default: null
    },
    target: {
      type: String,
      default: null
    },
    rel: {
      type: String,
      default: null
    }
  },
  setup(__props) {
    const props = __props;
    const buttonClasses = computed(() => {
      const baseClasses = "inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95";
      const variantClasses = {
        primary: "group relative shadow-lg hover:shadow-xl bg-primary text-text",
        secondary: "border-2 border-border bg-surface text-text hover:border-primary"
      };
      return `${baseClasses} ${variantClasses[props.variant]}`;
    });
    const componentTag = computed(() => props.href ? "a" : "button");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1$2;
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(componentTag)), mergeProps({
        type: !__props.href ? __props.type : void 0,
        href: __props.href,
        target: __props.target,
        rel: __props.rel,
        class: unref(buttonClasses)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.icon && __props.iconPosition === "left") {
              _push2(ssrRenderComponent(_component_Icon, {
                name: __props.icon,
                class: "mr-2 w-4 h-4"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="${ssrRenderClass(__props.variant === "primary" ? "relative z-10" : "")}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</span>`);
            if (__props.icon && __props.iconPosition === "right") {
              _push2(ssrRenderComponent(_component_Icon, {
                name: __props.icon,
                class: "ml-2 w-4 h-4"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.variant === "primary") {
              _push2(`<span class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" style="${ssrRenderStyle({ "background": "var(--primary)" })}"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.icon && __props.iconPosition === "left" ? (openBlock(), createBlock(_component_Icon, {
                key: 0,
                name: __props.icon,
                class: "mr-2 w-4 h-4"
              }, null, 8, ["name"])) : createCommentVNode("", true),
              createVNode("span", {
                class: __props.variant === "primary" ? "relative z-10" : ""
              }, [
                renderSlot(_ctx.$slots, "default")
              ], 2),
              __props.icon && __props.iconPosition === "right" ? (openBlock(), createBlock(_component_Icon, {
                key: 1,
                name: __props.icon,
                class: "ml-2 w-4 h-4"
              }, null, 8, ["name"])) : createCommentVNode("", true),
              __props.variant === "primary" ? (openBlock(), createBlock("span", {
                key: 2,
                class: "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg",
                style: { "background": "var(--primary)" }
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Button.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = {
  __name: "CdTooltip",
  __ssrInlineRender: true,
  props: {
    position: {
      type: String,
      default: "top",
      validator: (value) => ["top", "bottom", "left", "right"].includes(value)
    },
    content: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    delay: {
      type: Number,
      default: 200
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: "200px"
    },
    variant: {
      type: String,
      default: "dark",
      validator: (value) => ["dark", "light", "primary", "accent", "code", "custom"].includes(value)
    },
    offset: {
      type: Number,
      default: 8
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    useSlots();
    const isVisible = ref(false);
    ref(null);
    ref(null);
    ref(null);
    const tooltipPosition = ref({ top: 0, left: 0 });
    ref(true);
    const tooltipContent = computed(() => props.content || props.text);
    const variantClasses = computed(() => {
      const variants = {
        dark: "bg-gray-900 dark:bg-gray-800 text-text",
        light: "bg-white dark:bg-surface text-text border border-border shadow-soft",
        primary: "bg-primary text-text",
        accent: "bg-accent text-text",
        code: "bg-bg/95 backdrop-blur-sm text-text font-medium shadow-xl border border-primary/30",
        custom: props.customClass
      };
      return variants[props.variant] || variants.dark;
    });
    const arrowVariantClass = computed(() => {
      const variants = {
        dark: "border-gray-900 dark:border-gray-800",
        light: "border-white dark:border-surface",
        primary: "border-primary",
        accent: "border-accent",
        code: "border-bg/95",
        custom: ""
      };
      return variants[props.variant] || variants.dark;
    });
    const arrowPosition = computed(() => {
      const arrows = {
        top: "top-full left-1/2 -translate-x-1/2 -mt-[1px] border-t-[6px] border-x-[6px] border-x-transparent",
        bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-[1px] border-b-[6px] border-x-[6px] border-x-transparent",
        left: "left-full top-1/2 -translate-y-1/2 -ml-[1px] border-l-[6px] border-y-[6px] border-y-transparent",
        right: "right-full top-1/2 -translate-y-1/2 -mr-[1px] border-r-[6px] border-y-[6px] border-y-transparent"
      };
      return arrows[props.position] || arrows.top;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tooltip-wrapper" }, _attrs))} data-v-e331c051><div data-v-e331c051>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(isVisible)) {
          _push2(`<div class="${ssrRenderClass([
            "tooltip-content",
            "fixed z-[9999] px-3 py-2 text-sm rounded-lg",
            "pointer-events-none",
            unref(variantClasses)
          ])}" style="${ssrRenderStyle({
            top: `${unref(tooltipPosition).top}px`,
            left: `${unref(tooltipPosition).left}px`,
            maxWidth: __props.maxWidth,
            whiteSpace: __props.maxWidth ? "normal" : "nowrap"
          })}" role="tooltip" data-v-e331c051>`);
          if (__props.variant === "code") {
            _push2(`<!--[--><span class="text-primary" data-v-e331c051>&lt;</span>`);
            ssrRenderSlot(_ctx.$slots, "content", {}, () => {
              _push2(`${ssrInterpolate(unref(tooltipContent))}`);
            }, _push2, _parent);
            _push2(`<span class="text-primary" data-v-e331c051>/&gt;</span><!--]-->`);
          } else {
            ssrRenderSlot(_ctx.$slots, "content", {}, () => {
              _push2(`${ssrInterpolate(unref(tooltipContent))}`);
            }, _push2, _parent);
          }
          if (__props.showArrow) {
            _push2(`<div class="${ssrRenderClass([
              "absolute w-0 h-0",
              unref(arrowPosition),
              unref(arrowVariantClass)
            ])}" data-v-e331c051></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/Tooltip.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-e331c051"]]);
const photoUrl = "" + __buildAssetsURL("image-cris.0Gh-ySdG.png");
const siteUrl = "https://cris-dev.com";
const calculateYearsOfExperience = () => {
  const start = new Date(2018, 6, 1);
  const now = /* @__PURE__ */ new Date();
  let years = now.getFullYear() - start.getFullYear();
  const month = now.getMonth() - start.getMonth();
  if (month < 0 || month === 0 && now.getDate() < start.getDate()) {
    years--;
  }
  return years;
};
const mainMenu = [
  { name: "menu.home", id: "#home", order: 1 },
  { name: "menu.projects", id: "#projects", order: 2 },
  { name: "menu.experience", id: "#experience", order: 3 },
  { name: "menu.skills", id: "#skills", order: 4 },
  { name: "menu.contact", id: "#contact", order: 5 }
];
const socialMediaLinks = [
  {
    name: "social.github",
    url: "https://github.com/CristhianDaza",
    icon: "mdi:github",
    order: 1
  },
  {
    name: "social.linkedin",
    url: "https://co.linkedin.com/in/cristhiandaza",
    icon: "mdi:linkedin",
    order: 2
  },
  {
    name: "social.resume",
    url: "https://drive.google.com/file/d/1fNnhXDL_xN1kUpmQD7QG_t5ydqtlVnWq/view",
    icon: "mdi:file-account",
    order: 3
  }
];
const projects = [
  {
    id: 1,
    title: "projects.redGlobal.title",
    shortDescription: "projects.redGlobal.shortDescription",
    fullDescription: "projects.redGlobal.fullDescription",
    technologies: [
      "Vue.js",
      "Vite",
      "TypeScript",
      "Pinia",
      "Tailwind CSS",
      "Firebase (Auth/Firestore/Storage)",
      "Cloudinary",
      "EmailJS",
      "XLSX"
    ],
    image: "/images/projects/redGlobalPromo.png",
    projectUrl: "https://www.redglobalpromo.com.co/",
    githubUrl: "https://github.com/CristhianDaza/redGlobal",
    featured: true,
    date: "2025",
    highlights: [
      "projects.redGlobal.highlights.highlight1",
      "projects.redGlobal.highlights.highlight2",
      "projects.redGlobal.highlights.highlight3",
      "projects.redGlobal.highlights.highlight4",
      "projects.redGlobal.highlights.highlight5"
    ]
  },
  {
    id: 2,
    title: "projects.finControl.title",
    shortDescription: "projects.finControl.shortDescription",
    fullDescription: "projects.finControl.fullDescription",
    technologies: ["Vue.js", "Vite", "Chart.js", "Firebase", "Pinia"],
    image: "/images/projects/finControl.png",
    projectUrl: "https://fin-control.netlify.app",
    featured: true,
    date: "2025",
    highlights: [
      "projects.finControl.highlights.highlight1",
      "projects.finControl.highlights.highlight2",
      "projects.finControl.highlights.highlight3",
      "projects.finControl.highlights.highlight4",
      "projects.finControl.highlights.highlight5"
    ]
  },
  {
    id: 3,
    title: "projects.mega.title",
    shortDescription: "projects.mega.shortDescription",
    fullDescription: "projects.mega.fullDescription",
    technologies: ["Vue.js", "Vite", "TodoVue Components", "Pinia", "Firebase", "PrimeVue", "Tailwind CSS", "Lodash", "vue3-carousel"],
    image: "/images/projects/megapromocionales.png",
    projectUrl: "https://megapromocionales.com.co/",
    githubUrl: "https://github.com/CristhianDaza/megaprom",
    featured: false,
    date: "2024",
    highlights: [
      "projects.mega.highlights.highlight1",
      "projects.mega.highlights.highlight2",
      "projects.mega.highlights.highlight3",
      "projects.mega.highlights.highlight4",
      "projects.mega.highlights.highlight5"
    ]
  },
  {
    id: 4,
    title: "projects.todoVue.title",
    shortDescription: "projects.todoVue.shortDescription",
    fullDescription: "projects.todoVue.fullDescription",
    technologies: ["Vue.js", "Nuxt", "Vite", "Sass", "TodoVue Components"],
    image: "/images/projects/TODOvue.png",
    projectUrl: "https://tv-demo.netlify.app/",
    githubUrl: "https://github.com/orgs/TODOvue/repositories",
    featured: false,
    date: "2023",
    highlights: [
      "projects.todoVue.highlights.highlight1",
      "projects.todoVue.highlights.highlight2",
      "projects.todoVue.highlights.highlight3",
      "projects.todoVue.highlights.highlight4",
      "projects.todoVue.highlights.highlight5"
    ]
  },
  {
    id: 6,
    title: "projects.portfolio.title",
    shortDescription: "projects.portfolio.shortDescription",
    fullDescription: "projects.portfolio.fullDescription",
    technologies: ["Vue.js", "Nuxt", "Tailwind CSS"],
    image: "/images/projects/crisDev.png",
    githubUrl: "https://github.com/CristhianDaza/crisDev",
    featured: false,
    date: "2025",
    highlights: [
      "projects.portfolio.highlights.highlight1",
      "projects.portfolio.highlights.highlight2",
      "projects.portfolio.highlights.highlight3",
      "projects.portfolio.highlights.highlight4"
    ]
  }
];
const experiences = [
  {
    id: 1,
    company: "experience.company1.name",
    position: "experience.company1.position",
    description: "experience.company1.description",
    startDate: { month: 7, year: 2022 },
    endDate: null,
    technologies: ["JavaScript", "LitElement", "Web Components", "Cells", "Polymer"],
    type: "full-time"
  },
  {
    id: 2,
    company: "experience.company2.name",
    position: "experience.company2.position",
    description: "experience.company2.description",
    startDate: { month: 12, year: 2021 },
    endDate: { month: 6, year: 2022 },
    technologies: ["Vue.js", "NativeScript", "TypeScript", "Tailwind CSS"],
    type: "full-time"
  },
  {
    id: 3,
    company: "experience.company3.name",
    position: "experience.company3.position",
    description: "experience.company3.description",
    startDate: { month: 8, year: 2021 },
    endDate: { month: 11, year: 2021 },
    technologies: ["Vue.js", "MicroFrontend", "Vuetify", "TypeScript", "Vue Test Utils"],
    type: "contract"
  },
  {
    id: 4,
    company: "experience.company4.name",
    position: "experience.company4.position",
    description: "experience.company4.description",
    startDate: { month: 6, year: 2018 },
    endDate: { month: 7, year: 2021 },
    technologies: ["Vue.js", "Vuetify", "Firebase"],
    type: "full-time"
  }
];
function experienceYears(startYear, startMonth = 1, endYear = null, endMonth = null) {
  const start = new Date(startYear, startMonth - 1);
  const end = endYear ? new Date(endYear, (endMonth || 1) - 1) : /* @__PURE__ */ new Date();
  const diff = (end - start) / (1e3 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(diff));
}
const skillCategories = [
  {
    id: "frontend",
    name: "skills.categories.frontend",
    icon: "mdi:code-tags",
    color: "var(--primary)",
    skills: [
      { name: "JavaScript", icon: "mdi:language-javascript", years: experienceYears(2018) },
      { name: "Vue.js", icon: "mdi:vuejs", years: experienceYears(2018) },
      { name: "LitElement", icon: "mdi:web", years: experienceYears(2022) },
      { name: "Web Components", icon: "mdi:puzzle", years: experienceYears(2022) },
      { name: "TypeScript", icon: "mdi:language-typescript", years: experienceYears(2021) },
      { name: "Vuetify", icon: "mdi:vuetify", years: experienceYears(2020, 1, 2022, 6) }
    ]
  },
  {
    id: "styling",
    name: "skills.categories.styling",
    icon: "mdi:palette",
    color: "var(--accent)",
    skills: [
      { name: "CSS", icon: "mdi:palette-outline", years: experienceYears(2018) },
      { name: "Tailwind CSS", icon: "mdi:tailwind", years: experienceYears(2021, 12, 2025, 6) }
    ]
  },
  {
    id: "tools",
    name: "skills.categories.tools",
    icon: "mdi:tools",
    color: "#f59e0b",
    skills: [
      { name: "Git", icon: "mdi:git", years: experienceYears(2020) },
      { name: "Firebase", icon: "mdi:firebase", years: experienceYears(2018, 6, 2021, 7) },
      { name: "Vue Test Utils", icon: "mdi:test-tube", years: experienceYears(2021, 8, 2025, 11) }
    ]
  },
  {
    id: "mobile",
    name: "skills.categories.mobile",
    icon: "mdi:cellphone",
    color: "#8b5cf6",
    skills: [
      { name: "NativeScript", icon: "mdi:cellphone-cog", years: experienceYears(2021, 1, 2022, 12) },
      { name: "Responsive Design", icon: "mdi:monitor-cellphone", years: experienceYears(2018) }
    ]
  },
  {
    id: "practices",
    name: "skills.categories.practices",
    icon: "mdi:target",
    color: "#10b981",
    skills: [
      { name: "Accessibility", icon: "mdi:accessibility", years: experienceYears(2022) },
      { name: "Performance", icon: "mdi:speedometer", years: experienceYears(2021) },
      { name: "Testing", icon: "mdi:flask", years: experienceYears(2021, 8, 2025, 11) },
      { name: "Clean Code", icon: "mdi:check-decagram", years: experienceYears(2018) }
    ]
  }
];
const _sfc_main$f = {
  __name: "CdHero",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    function scrollToId(id) {
    }
    const experience = computed(() => {
      return calculateYearsOfExperience();
    });
    const sortedSocialMedia = computed(
      () => socialMediaLinks.slice().sort((a, b) => a.order - b.order)
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIButton = _sfc_main$h;
      const _component_CdTooltip = __nuxt_component_0$1;
      const _component_Icon = __nuxt_component_1$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative overflow-hidden min-h-screen flex items-center",
        style: { "background": "radial-gradient(ellipse 1400px 800px at 60% 20%, color-mix(in srgb, var(--primary) 15%, transparent), transparent)" }
      }, _attrs))} data-v-241abcdd><div class="absolute inset-0 overflow-hidden pointer-events-none" data-v-241abcdd><div class="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl" style="${ssrRenderStyle({ "background": "radial-gradient(circle, var(--accent), transparent 70%)" })}" data-v-241abcdd></div><div class="absolute top-1/2 -left-32 w-80 h-80 rounded-full opacity-10 blur-3xl" style="${ssrRenderStyle({ "background": "radial-gradient(circle, var(--primary), transparent 70%)" })}" data-v-241abcdd></div></div><div class="relative mx-auto max-w-7xl px-6 py-16 w-full mt-12" data-v-241abcdd><div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16" data-v-241abcdd><div class="space-y-6 lg:space-y-8" data-v-241abcdd><div class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm animate-fade-in border-border bg-[color-mix(in_srgb,_var(--surface),_transparent_40%)] text-text" data-v-241abcdd><span class="relative flex h-2.5 w-2.5" data-v-241abcdd><span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-accent" data-v-241abcdd></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" data-v-241abcdd></span></span> ${ssrInterpolate(_ctx.$t("hero.role"))}</div><div class="space-y-3" data-v-241abcdd><h1 class="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl" data-v-241abcdd><span class="block text-text animate-slide-up" data-v-241abcdd>${ssrInterpolate(_ctx.$t("hero.greeting"))}</span><span class="block bg-clip-text text-transparent animate-slide-up-delay" style="${ssrRenderStyle({ "background-image": "linear-gradient(120deg, var(--primary), var(--accent))" })}" data-v-241abcdd>${ssrInterpolate(_ctx.$t("hero.name"))}. </span></h1><p class="text-lg sm:text-xl lg:text-2xl text-muted max-w-xl leading-relaxed animate-fade-in-delay" data-v-241abcdd>${ssrInterpolate(_ctx.$t("hero.description", { years: unref(experience) }))}</p></div><div class="flex flex-wrap items-center gap-4 pt-2" data-v-241abcdd>`);
      _push(ssrRenderComponent(_component_UIButton, {
        variant: "primary",
        onClick: ($event) => scrollToId()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("hero.contactButton"))}`);
          } else {
            return [
              createTextVNode(toDisplayString$1(_ctx.$t("hero.contactButton")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UIButton, {
        variant: "secondary",
        icon: "mdi-arrow-right-bold",
        onClick: ($event) => scrollToId()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("hero.projectsButton"))}`);
          } else {
            return [
              createTextVNode(toDisplayString$1(_ctx.$t("hero.projectsButton")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex flex-wrap gap-2.5 pt-4" data-v-241abcdd><!--[-->`);
      ssrRenderList(unref(sortedSocialMedia), (social) => {
        _push(ssrRenderComponent(_component_CdTooltip, {
          key: social.name,
          content: _ctx.$t(social.name),
          variant: "code"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<a${ssrRenderAttr("href", social.url || "#")} target="_blank" rel="noopener noreferrer" class="group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 cursor-pointer animate-slide-up-delay bg-surface/50 dark:bg-chip text-text/90 hover:text-text border border-border/30" data-v-241abcdd${_scopeId}>`);
              if (social.icon) {
                _push2(ssrRenderComponent(_component_Icon, {
                  name: social.icon,
                  class: "w-5 h-5"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, var(--primary), var(--accent))" })}" data-v-241abcdd${_scopeId}></span></a>`);
            } else {
              return [
                createVNode("a", {
                  href: social.url || "#",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  class: "group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 cursor-pointer animate-slide-up-delay bg-surface/50 dark:bg-chip text-text/90 hover:text-text border border-border/30"
                }, [
                  social.icon ? (openBlock(), createBlock(_component_Icon, {
                    key: 0,
                    name: social.icon,
                    class: "w-5 h-5"
                  }, null, 8, ["name"])) : createCommentVNode("", true),
                  createVNode("span", {
                    class: "absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity",
                    style: { "background": "linear-gradient(135deg, var(--primary), var(--accent))" }
                  })
                ], 8, ["href"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><div class="relative lg:pl-8" data-v-241abcdd><div class="relative group" data-v-241abcdd><div class="absolute inset-0 rounded-3xl opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, var(--primary), var(--accent))" })}" data-v-241abcdd></div><div class="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border-4 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] border-border bg-gradient-to-br from-surface to-transparent" data-v-241abcdd><img${ssrRenderAttr("src", unref(photoUrl))}${ssrRenderAttr("alt", _ctx.$t("global.altImagePerfil"))} class="h-full w-full object-cover" data-v-241abcdd><div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="${ssrRenderStyle({ "background": "linear-gradient(180deg, transparent 60%, color-mix(in srgb, var(--primary) 20%, transparent))" })}" data-v-241abcdd></div></div><div class="pointer-events-none absolute -left-6 -top-6 hidden select-none lg:block animate-float" data-v-241abcdd><div class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl border-border text-text" style="${ssrRenderStyle({ "background": "color-mix(in srgb, var(--surface) 80%, transparent)" })}" data-v-241abcdd> ✨ ${ssrInterpolate(_ctx.$t("hero.UI"))}</div></div><div class="pointer-events-none absolute -right-6 top-1/3 hidden select-none lg:block animate-float-delay" data-v-241abcdd><div class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl border-border text-text" style="${ssrRenderStyle({ "background": "color-mix(in srgb, var(--surface) 80%, transparent)" })}" data-v-241abcdd> 🚀 ${ssrInterpolate(_ctx.$t("hero.performance"))}</div></div><div class="pointer-events-none absolute -left-8 bottom-12 hidden select-none lg:block animate-float" data-v-241abcdd><div class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl border-border text-text" style="${ssrRenderStyle({ "background": "color-mix(in srgb, var(--surface) 80%, transparent)" })}" data-v-241abcdd> 💎 ${ssrInterpolate(_ctx.$t("hero.codeQuality"))}</div></div></div></div></div></div><button type="button" aria-label="Scroll down" class="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted hover:text-primary transition-colors duration-300 cursor-pointer group animate-fade-in-delay-long z-10" data-v-241abcdd><span class="text-xs sm:text-sm font-medium" data-v-241abcdd>${ssrInterpolate(_ctx.$t("hero.scrollDown"))}</span><div class="relative" data-v-241abcdd>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:chevron-down",
        class: "w-6 h-6 sm:w-8 sm:h-8 animate-bounce"
      }, null, _parent));
      _push(`<div class="absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity" data-v-241abcdd>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:chevron-down",
        class: "w-6 h-6 sm:w-8 sm:h-8 text-primary"
      }, null, _parent));
      _push(`</div></div></button></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/Hero.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-241abcdd"]]);
const _sfc_main$e = {
  __name: "UIChip",
  __ssrInlineRender: true,
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({ class: "px-2.5 py-1 bg-primary text-text text-xs font-medium rounded-lg hover:bg-bg hover:text-text transition-colors" }, _attrs))}>${ssrInterpolate(__props.content)}</span>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Chip.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = {
  __name: "CdPrCard",
  __ssrInlineRender: true,
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["openProject"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIChip = _sfc_main$e;
      const _component_Icon = __nuxt_component_1$2;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "project-card group cursor-pointer overflow-hidden rounded-radius bg-surface border border-border transition-all duration-300 hover:shadow-shadow hover:-translate-y-2" }, _attrs))} data-v-dad73854><div class="relative h-48 overflow-hidden" data-v-dad73854>`);
      if (__props.project.image) {
        _push(`<img${ssrRenderAttr("src", __props.project.image)}${ssrRenderAttr("alt", _ctx.$t(__props.project.title))} class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" data-v-dad73854>`);
      } else {
        _push(`<div class="w-full h-full bg-gradient-to-br from-primary to-accent opacity-80" data-v-dad73854><div class="absolute inset-0 flex items-center justify-center text-6xl text-text/30 font-bold" data-v-dad73854>${ssrInterpolate(__props.project.title.charAt(0))}</div></div>`);
      }
      _push(`<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" data-v-dad73854></div>`);
      if (__props.project.featured) {
        _push(`<div class="absolute top-3 right-3 px-3 py-1 bg-accent text-text text-xs font-semibold rounded-full" data-v-dad73854>${ssrInterpolate(_ctx.$t("projects.featured"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="p-6" data-v-dad73854><div class="flex items-start justify-between gap-2 mb-3" data-v-dad73854><h3 class="text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-1" data-v-dad73854>${ssrInterpolate(_ctx.$t(__props.project?.title))}</h3><span class="text-sm text-muted whitespace-nowrap" data-v-dad73854>${ssrInterpolate(__props.project.date)}</span></div><p class="text-muted text-sm mb-4 line-clamp-2 leading-relaxed" data-v-dad73854>${ssrInterpolate(_ctx.$t(__props.project.shortDescription))}</p><div class="flex flex-wrap gap-2 mb-4" data-v-dad73854><!--[-->`);
      ssrRenderList(__props.project.technologies.slice(0, 3), (tech) => {
        _push(ssrRenderComponent(_component_UIChip, {
          key: tech,
          content: tech
        }, null, _parent));
      });
      _push(`<!--]-->`);
      if (__props.project.technologies.length > 3) {
        _push(`<span class="px-2.5 py-1 text-muted text-xs font-medium" data-v-dad73854> +${ssrInterpolate(__props.project.technologies.length - 3)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex gap-3 pt-4 border-t border-border" data-v-dad73854>`);
      if (__props.project.projectUrl) {
        _push(`<a${ssrRenderAttr("href", __props.project.projectUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors font-medium" data-v-dad73854>`);
        _push(ssrRenderComponent(_component_Icon, { name: "mdi:open-in-new" }, null, _parent));
        _push(` ${ssrInterpolate(_ctx.$t("projects.viewProject"))}</a>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.project.githubUrl) {
        _push(`<a${ssrRenderAttr("href", __props.project.githubUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors font-medium" data-v-dad73854>`);
        _push(ssrRenderComponent(_component_Icon, { name: "mdi:github" }, null, _parent));
        _push(` ${ssrInterpolate(_ctx.$t("social.github"))}</a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 rounded-radius transition-opacity pointer-events-none" data-v-dad73854></div></article>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/projects/Card.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-dad73854"]]);
const _sfc_main$c = {
  __name: "CdPrDetail",
  __ssrInlineRender: true,
  props: {
    project: {
      type: Object,
      default: null
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const closeModal = () => {
      emit("close");
    };
    watch(() => props.isOpen, (isOpen) => {
      if (isOpen) {
        (void 0).body.style.overflow = "hidden";
        (void 0).body.style.paddingRight = `${(void 0).innerWidth - (void 0).documentElement.clientWidth}px`;
      } else {
        (void 0).body.style.overflow = "";
        (void 0).body.style.paddingRight = "";
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CdTooltip = __nuxt_component_0$1;
      const _component_Icon = __nuxt_component_1$2;
      const _component_UIChip = _sfc_main$e;
      const _component_UIButton = _sfc_main$h;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" data-v-711f0a6c><div class="project-detail relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-radius bg-surface shadow-2xl" data-v-711f0a6c>`);
          _push2(ssrRenderComponent(_component_CdTooltip, {
            content: _ctx.$t("global.close"),
            position: "left",
            variant: "primary"
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`<button class="absolute top-4 right-4 z-20 p-2 w-10 h-10 flex items-center justify-center rounded-full bg-chip text-text hover:bg-primary hover:text-text transition-colors shadow-lg" data-v-711f0a6c${_scopeId}>`);
                _push3(ssrRenderComponent(_component_Icon, { name: "mdi:close" }, null, _parent2, _scopeId));
                _push3(`</button>`);
              } else {
                return [
                  createVNode("button", {
                    class: "absolute top-4 right-4 z-20 p-2 w-10 h-10 flex items-center justify-center rounded-full bg-chip text-text hover:bg-primary hover:text-text transition-colors shadow-lg",
                    onClick: closeModal
                  }, [
                    createVNode(_component_Icon, { name: "mdi:close" })
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<div class="overflow-y-auto max-h-[90vh] project-detail-scroll" data-v-711f0a6c><div class="relative h-64 overflow-hidden" data-v-711f0a6c>`);
          if (__props.project.image) {
            _push2(`<img${ssrRenderAttr("src", __props.project.image)}${ssrRenderAttr("alt", __props.project.title)} class="w-full h-full object-cover" data-v-711f0a6c>`);
          } else {
            _push2(`<div class="w-full h-full bg-gradient-to-br from-primary to-accent" data-v-711f0a6c><div class="absolute inset-0 flex items-center justify-center text-9xl text-text/20 font-bold" data-v-711f0a6c>${ssrInterpolate(__props.project.title.charAt(0))}</div></div>`);
          }
          _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" data-v-711f0a6c></div>`);
          if (__props.project.featured) {
            _push2(`<div class="absolute top-6 left-6 px-4 py-2 bg-accent text-text text-sm font-semibold rounded-full shadow-lg" data-v-711f0a6c> ⭐ ${ssrInterpolate(_ctx.$t("projects.featuredProject"))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="p-8" data-v-711f0a6c><div class="flex items-start justify-between gap-4 mb-4" data-v-711f0a6c><h2 class="text-3xl md:text-4xl font-bold text-text" data-v-711f0a6c>${ssrInterpolate(_ctx.$t(__props.project.title))}</h2><span class="px-3 py-1 bg-chip text-primary text-sm font-semibold rounded-lg whitespace-nowrap" data-v-711f0a6c>${ssrInterpolate(__props.project.date)}</span></div><p class="text-muted text-lg leading-relaxed mb-8" data-v-711f0a6c>${ssrInterpolate(_ctx.$t(__props.project.fullDescription))}</p>`);
          if (__props.project.highlights && __props.project.highlights.length) {
            _push2(`<div class="mb-8" data-v-711f0a6c><h3 class="text-xl font-semibold text-text mb-4 flex items-center gap-2" data-v-711f0a6c>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:lightbulb",
              class: "text-accent"
            }, null, _parent));
            _push2(` ${ssrInterpolate(_ctx.$t("projects.highlights"))}</h3><ul class="grid grid-cols-1 md:grid-cols-2 gap-3" data-v-711f0a6c><!--[-->`);
            ssrRenderList(__props.project.highlights, (highlight, index2) => {
              _push2(`<li class="flex items-center gap-2 text-muted bg-surface/50 border border-border p-3 rounded-lg hover:bg-surface transition-colors" style="${ssrRenderStyle({ animationDelay: `${index2 * 0.1}s` })}" data-v-711f0a6c>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "mdi:star",
                class: "flex-shrink-0 w-5 h-5 text-warning"
              }, null, _parent));
              _push2(`<span class="flex-1" data-v-711f0a6c>${ssrInterpolate(_ctx.$t(highlight))}</span></li>`);
            });
            _push2(`<!--]--></ul></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mb-8" data-v-711f0a6c><h3 class="text-xl font-semibold text-text mb-4 flex items-center gap-2" data-v-711f0a6c>`);
          _push2(ssrRenderComponent(_component_Icon, {
            name: "mdi:code-tags",
            class: "text-primary"
          }, null, _parent));
          _push2(` ${ssrInterpolate(_ctx.$t("projects.technologiesUsed"))}</h3><div class="flex flex-wrap gap-3" data-v-711f0a6c><!--[-->`);
          ssrRenderList(__props.project.technologies, (tech, index2) => {
            _push2(ssrRenderComponent(_component_UIChip, {
              key: index2,
              content: tech
            }, null, _parent));
          });
          _push2(`<!--]--></div></div><div class="flex flex-wrap gap-4 pt-6 border-t border-border" data-v-711f0a6c>`);
          if (__props.project.projectUrl) {
            _push2(ssrRenderComponent(_component_UIButton, {
              variant: "primary",
              icon: "mdi:open-in-new",
              href: __props.project.projectUrl,
              target: "_blank",
              rel: "noopener noreferrer"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.$t("projects.viewProjectLive"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString$1(_ctx.$t("projects.viewProjectLive")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (__props.project.githubUrl) {
            _push2(ssrRenderComponent(_component_UIButton, {
              variant: "secondary",
              icon: "mdi:github",
              "icon-position": "left",
              href: __props.project.githubUrl,
              target: "_blank",
              rel: "noopener noreferrer"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.$t("projects.viewCodeInGitHub"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString$1(_ctx.$t("projects.viewCodeInGitHub")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/projects/Detail.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-711f0a6c"]]);
const useSeo = () => {
  const { t, locale } = useI18n();
  const setProjectSeo = (project) => {
    if (!project) return;
    const projectTitle = t(project.title);
    const projectDescription = t(project.shortDescription);
    const projectUrl = `${siteUrl}/#project-${project.id}`;
    const imageUrl = project.image || `${siteUrl}/og-image.jpg`;
    useHead({
      htmlAttrs: {
        lang: locale.value
      },
      title: `${projectTitle} | Cristhian Daza`,
      meta: [
        { name: "description", content: projectDescription },
        { name: "keywords", content: `${project.technologies.join(", ")}, frontend developer, cristhian daza, portfolio` },
        { property: "og:title", content: `${projectTitle} | Cristhian Daza` },
        { property: "og:description", content: projectDescription },
        { property: "og:url", content: projectUrl },
        { property: "og:image", content: imageUrl },
        { property: "og:image:secure_url", content: imageUrl },
        { property: "og:image:alt", content: projectTitle },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: locale.value === "es" ? "es_ES" : "en_US" },
        { name: "twitter:title", content: `${projectTitle} | Cristhian Daza` },
        { name: "twitter:description", content: projectDescription },
        { name: "twitter:image", content: imageUrl },
        { name: "twitter:image:alt", content: projectTitle },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@CristhianDaza" }
      ],
      link: [
        { rel: "canonical", href: projectUrl }
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: projectTitle,
            description: projectDescription,
            author: {
              "@type": "Person",
              name: "Cristhian Daza",
              url: siteUrl
            },
            url: project.projectUrl || projectUrl,
            image: imageUrl,
            keywords: project.technologies.join(", "),
            datePublished: `${project.date}-01-01`,
            inLanguage: locale.value
          })
        }
      ]
    });
  };
  const resetSeo = () => {
    const defaultTitle = "Cristhian Daza | Frontend Developer";
    const years = calculateYearsOfExperience();
    const defaultDescription = locale.value === "es" ? `Desarrollador Frontend con más de ${years} años de experiencia creando experiencias web rápidas, accesibles y centradas en el usuario.` : `Frontend developer with over ${years} years of experience building modern, accessible, and scalable interfaces using Vue, LitElement, and Tailwind. Passionate about clean code, modular architecture, and user-centered experiences.`;
    useHead({
      htmlAttrs: {
        lang: locale.value
      },
      title: defaultTitle,
      meta: [
        { name: "description", content: defaultDescription },
        { name: "keywords", content: "frontend developer, vue.js, nuxt, javascript, typescript, tailwind css, web development, cristhian daza" },
        { property: "og:title", content: defaultTitle },
        { property: "og:description", content: defaultDescription },
        { property: "og:url", content: siteUrl },
        { property: "og:image", content: `${siteUrl}/og-image.jpg` },
        { property: "og:image:secure_url", content: `${siteUrl}/og-image.jpg` },
        { property: "og:image:alt", content: "Cristhian Daza - Frontend Developer Portfolio" },
        { property: "og:locale", content: locale.value === "es" ? "es_ES" : "en_US" },
        { name: "twitter:title", content: defaultTitle },
        { name: "twitter:description", content: defaultDescription },
        { name: "twitter:image", content: `${siteUrl}/og-image.jpg` },
        { name: "twitter:image:alt", content: "Cristhian Daza - Frontend Developer Portfolio" }
      ],
      link: [
        { rel: "canonical", href: siteUrl }
      ]
    });
  };
  const setSectionSeo = (section) => {
    const sections = {
      projects: {
        title: t("menu.projects"),
        description: locale.value === "es" ? "Proyectos destacados de desarrollo frontend con Vue.js, Nuxt y tecnologías modernas" : "Featured frontend development projects with Vue.js, Nuxt and modern technologies"
      },
      experience: {
        title: t("menu.experience"),
        description: locale.value === "es" ? "Experiencia profesional como Frontend Developer en diferentes empresas y proyectos" : "Professional experience as Frontend Developer in different companies and projects"
      },
      skills: {
        title: t("menu.skills"),
        description: locale.value === "es" ? "Tecnologías y habilidades en desarrollo frontend: Vue.js, Nuxt, JavaScript, TypeScript, Tailwind CSS" : "Frontend development technologies and skills: Vue.js, Nuxt, JavaScript, TypeScript, Tailwind CSS"
      },
      contact: {
        title: t("menu.contact"),
        description: locale.value === "es" ? "Ponte en contacto para proyectos, colaboraciones o consultas" : "Get in touch for projects, collaborations or inquiries"
      }
    };
    const sectionData = sections[section];
    if (!sectionData) return;
    useHead({
      htmlAttrs: {
        lang: locale.value
      },
      title: `${sectionData.title} | Cristhian Daza`,
      meta: [
        { name: "description", content: sectionData.description },
        { property: "og:title", content: `${sectionData.title} | Cristhian Daza` },
        { property: "og:description", content: sectionData.description },
        { property: "og:url", content: `${siteUrl}/#${section}` },
        { property: "og:locale", content: locale.value === "es" ? "es_ES" : "en_US" },
        { name: "twitter:title", content: `${sectionData.title} | Cristhian Daza` },
        { name: "twitter:description", content: sectionData.description }
      ],
      link: [
        { rel: "canonical", href: `${siteUrl}/#${section}` }
      ]
    });
  };
  return {
    setProjectSeo,
    resetSeo,
    setSectionSeo
  };
};
const _sfc_main$b = {
  __name: "CdProjects",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedProject = ref(null);
    const isProjectDetailOpen = ref(false);
    const { setProjectSeo, resetSeo } = useSeo();
    const openProject = (project) => {
      selectedProject.value = project;
      isProjectDetailOpen.value = true;
      setProjectSeo(project);
    };
    const closeProjectDetail = () => {
      isProjectDetailOpen.value = false;
      resetSeo();
      setTimeout(() => {
        selectedProject.value = null;
      }, 300);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CdPrCard = __nuxt_component_0;
      const _component_CdPrDetail = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-12 text-center"><h2 class="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">${ssrInterpolate(_ctx.$t("projects.title"))}</h2><p class="text-muted text-lg max-w-2xl mx-auto">${ssrInterpolate(_ctx.$t("projects.description"))}</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      ssrRenderList("projects" in _ctx ? _ctx.projects : unref(projects), (project) => {
        _push(ssrRenderComponent(_component_CdPrCard, {
          key: project.id,
          project,
          onOpenProject: openProject
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(selectedProject)) {
        _push(ssrRenderComponent(_component_CdPrDetail, {
          project: unref(selectedProject),
          "is-open": unref(isProjectDetailOpen),
          onClose: closeProjectDetail
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/Projects.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: "CdExperience",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const sortedExperiences = computed(
      () => experiences.slice().sort((a, b) => {
        const aDate = a.startDate.year * 12 + a.startDate.month;
        const bDate = b.startDate.year * 12 + b.startDate.month;
        return bDate - aDate;
      })
    );
    const formatDate = (date) => {
      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"
      ];
      if (!date) return t("experience.present");
      const monthName = months[date.month - 1];
      return `${monthName} ${date.year}`;
    };
    const calculateDuration = (startDate, endDate) => {
      const end = endDate ? new Date(endDate.year, endDate.month - 1) : /* @__PURE__ */ new Date();
      const start = new Date(startDate.year, startDate.month - 1);
      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }
      const parts = [];
      if (years > 0) {
        parts.push(`${years} ${years === 1 ? t("experience.year") : t("experience.years")}`);
      }
      if (months > 0) {
        parts.push(`${months} ${months === 1 ? t("experience.month") : t("experience.months")}`);
      }
      return parts.length > 0 ? parts.join(" ") : `1 ${t("experience.month")}`;
    };
    const isVisible = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIChip = _sfc_main$e;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "experience-section",
        class: "w-full"
      }, _attrs))} data-v-a6728fb8><div class="text-center mb-16" data-v-a6728fb8><h2 class="${ssrRenderClass([unref(isVisible) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-700"])}" data-v-a6728fb8>${ssrInterpolate(unref(t)("experience.title"))}</h2><p class="${ssrRenderClass([unref(isVisible) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "text-muted text-lg max-w-2xl mx-auto transition-all duration-700 delay-100"])}" data-v-a6728fb8>${ssrInterpolate(unref(t)("experience.description"))}</p></div><div class="relative max-w-5xl mx-auto" data-v-a6728fb8><div class="${ssrRenderClass([unref(isVisible) ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0", "absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full transition-all duration-1000 bg-gradient-to-b from-primary to-accent origin-top"])}" data-v-a6728fb8></div><!--[-->`);
      ssrRenderList(unref(sortedExperiences), (exp, index2) => {
        _push(`<div class="relative mb-16 last:mb-0" data-v-a6728fb8><div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center" data-v-a6728fb8><div class="${ssrRenderClass([[
          unref(isVisible) ? "opacity-100 md:translate-x-0" : "opacity-0",
          index2 % 2 === 0 ? "md:-translate-x-8" : "md:translate-x-8 md:col-start-2"
        ], "relative transition-all duration-700 max-w-2xl mx-auto md:mx-0 md:max-w-none"])}" style="${ssrRenderStyle(`transition-delay: ${index2 * 150}ms`)}" data-v-a6728fb8><div class="p-6 rounded-2xl backdrop-blur-sm border border-border bg-surface transition-all duration-300 hover:scale-105 hover:shadow-2xl group" data-v-a6728fb8><div class="${ssrRenderClass([index2 % 2 === 0 ? "md:items-end" : "md:items-start", "mb-3 flex flex-col gap-2 items-start md:items-start"])}" data-v-a6728fb8><div class="inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-primary" data-v-a6728fb8>${ssrInterpolate(formatDate(exp.startDate))} - ${ssrInterpolate(exp.endDate ? formatDate(exp.endDate) : unref(t)("experience.present"))}</div><div class="inline-block px-3 py-1 rounded-full text-xs font-medium transition-colors bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-accent" data-v-a6728fb8>${ssrInterpolate(calculateDuration(exp.startDate, exp.endDate))}</div></div><h3 class="${ssrRenderClass([index2 % 2 === 0 ? "md:text-right" : "md:text-left", "text-2xl font-bold mb-2 transition-colors text-text text-left"])}" data-v-a6728fb8>${ssrInterpolate(unref(t)(exp.position))}</h3><h4 class="${ssrRenderClass([index2 % 2 === 0 ? "md:text-right" : "md:text-left", "text-lg font-semibold mb-3 transition-colors text-primary text-left"])}" data-v-a6728fb8>${ssrInterpolate(unref(t)(exp.company))}</h4><p class="${ssrRenderClass([index2 % 2 === 0 ? "md:text-right" : "md:text-left", "mb-4 leading-relaxed text-muted text-left"])}" data-v-a6728fb8>${ssrInterpolate(unref(t)(exp.description))}</p><div class="${ssrRenderClass([index2 % 2 === 0 ? "md:justify-end" : "md:justify-start", "flex flex-wrap gap-2 justify-start"])}" data-v-a6728fb8><!--[-->`);
        ssrRenderList(exp.technologies, (tech) => {
          _push(ssrRenderComponent(_component_UIChip, {
            key: tech,
            content: tech
          }, null, _parent));
        });
        _push(`<!--]--></div></div></div></div><div class="${ssrRenderClass([unref(isVisible) ? "opacity-100 scale-100" : "opacity-0 scale-0", "absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 hidden md:block transition-all duration-500 z-10"])}" style="${ssrRenderStyle(`transition-delay: ${index2 * 150 + 200}ms`)}" data-v-a6728fb8><div class="w-4 h-4 rounded-full border-4 border-primary bg-surface transition-all duration-300 hover:scale-150" data-v-a6728fb8><div class="absolute inset-0 rounded-full animate-ping opacity-75 text-primary" data-v-a6728fb8></div></div></div></div>`);
      });
      _push(`<!--]--></div><div class="absolute inset-0 overflow-hidden pointer-events-none -z-10" data-v-a6728fb8><div class="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-5 blur-3xl bg-[radial-gradient(circle,var(--accent),transparent_70%)]" data-v-a6728fb8></div><div class="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-5 blur-3xl bg-[radial-gradient(circle,var(--primary),transparent_70%)]" data-v-a6728fb8></div></div></div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/Experience.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-a6728fb8"]]);
const _sfc_main$9 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Icon = __nuxt_component_1$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))} data-v-3fc5dcd8><div class="text-center max-w-3xl mx-auto mb-16 space-y-4" data-v-3fc5dcd8><h2 class="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in [animation-delay:0.1s]" data-v-3fc5dcd8>${ssrInterpolate(_ctx.$t("skills.title"))}</h2><p class="text-muted text-lg max-w-2xl mx-auto animate-fade-in [animation-delay:0.2s]" data-v-3fc5dcd8>${ssrInterpolate(_ctx.$t("skills.description"))}</p></div><div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-v-3fc5dcd8><!--[-->`);
  ssrRenderList("skillCategories" in _ctx ? _ctx.skillCategories : unref(skillCategories), (category, index2) => {
    _push(`<div class="group relative rounded-2xl border border-border bg-surface p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-up [animation-fill-mode:both]" style="${ssrRenderStyle({
      animationDelay: `${0.1 * (index2 + 1)}s`
    })}" data-v-3fc5dcd8><div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" style="${ssrRenderStyle({ background: `radial-gradient(circle at top left, ${category.color}, transparent)` })}" data-v-3fc5dcd8></div><div class="relative mb-6 flex items-center gap-3" data-v-3fc5dcd8><div class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" style="${ssrRenderStyle({ backgroundColor: `color-mix(in srgb, ${category.color} 15%, transparent)` })}" data-v-3fc5dcd8>`);
    _push(ssrRenderComponent(_component_Icon, {
      name: category.icon
    }, null, _parent));
    _push(`</div><h3 class="text-xl font-semibold text-text" data-v-3fc5dcd8>${ssrInterpolate(_ctx.$t(category.name))}</h3></div><div class="relative space-y-3" data-v-3fc5dcd8><!--[-->`);
    ssrRenderList(category.skills, (skill, skillIndex) => {
      _push(`<div class="group/skill flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:bg-[color-mix(in_srgb,_var(--primary)_5%,_transparent)]" style="${ssrRenderStyle({
        animationDelay: `${0.1 * (index2 + 1) + 0.05 * skillIndex}s`
      })}" data-v-3fc5dcd8><span class="text-xl transition-transform duration-300 group-hover/skill:scale-125" data-v-3fc5dcd8>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: skill.icon
      }, null, _parent));
      _push(`</span><div class="flex-1 min-w-0" data-v-3fc5dcd8><div class="flex items-baseline justify-between gap-2" data-v-3fc5dcd8><span class="text-sm font-medium text-text truncate" data-v-3fc5dcd8>${ssrInterpolate(skill.name)}</span><span class="text-xs text-muted whitespace-nowrap flex items-center gap-1" data-v-3fc5dcd8>`);
      _push(ssrRenderComponent(_component_Icon, { name: "mdi-clock" }, null, _parent));
      _push(` ${ssrInterpolate(skill.years)}+ ${ssrInterpolate(skill.years === 1 ? _ctx.$t("experience.year") : _ctx.$t("experience.years"))}</span></div><div class="relative mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,_var(--border)_50%,_transparent)]" data-v-3fc5dcd8><div class="h-full rounded-full transition-all duration-700 group-hover/skill:w-full" style="${ssrRenderStyle({
        width: `${skill.years / 7 * 100}%`,
        backgroundColor: category.color,
        boxShadow: `0 0 10px ${category.color}40`
      })}" data-v-3fc5dcd8></div></div></div></div>`);
    });
    _push(`<!--]--></div><div class="relative mt-6 flex items-center justify-between text-xs text-muted" data-v-3fc5dcd8><span class="flex items-center gap-1" data-v-3fc5dcd8>`);
    _push(ssrRenderComponent(_component_Icon, { name: "mdi-code-tags" }, null, _parent));
    _push(` ${ssrInterpolate(category.skills.length)} ${ssrInterpolate(_ctx.$t("skills.technologies"))}</span><div class="h-1.5 w-1.5 rounded-full animate-pulse" style="${ssrRenderStyle({ backgroundColor: category.color })}" data-v-3fc5dcd8></div></div></div>`);
  });
  _push(`<!--]--></div><div class="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none animate-float bg-[radial-gradient(circle,_var(--primary),_transparent_70%)]" data-v-3fc5dcd8></div><div class="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none animate-float-delayed bg-[radial-gradient(circle,_var(--accent),_transparent_70%)]" data-v-3fc5dcd8></div></div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/Skills.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-3fc5dcd8"]]), { __name: "CdSkills" });
const _sfc_main$8 = {
  __name: "CdContact",
  __ssrInlineRender: true,
  setup(__props) {
    const formData = reactive({
      name: "",
      email: "",
      message: ""
    });
    const isSubmitting = ref(false);
    const showSuccess = ref(false);
    const showError2 = ref(false);
    const isVisible = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1$2;
      const _component_UIButton = _sfc_main$h;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "contact-section",
        class: "relative w-full overflow-hidden"
      }, _attrs))} data-v-191ef33f><div class="absolute inset-0 -z-10" data-v-191ef33f><div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" data-v-191ef33f></div><div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" data-v-191ef33f></div></div><div class="relative mx-auto max-w-5xl px-6" data-v-191ef33f><div class="text-center mb-12" data-v-191ef33f><h2 class="${ssrRenderClass([unref(isVisible) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "mb-4 text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-all duration-700"])}" data-v-191ef33f>${ssrInterpolate(_ctx.$t("contact.title"))}</h2><p class="${ssrRenderClass([unref(isVisible) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "text-muted text-lg md:text-xl max-w-2xl mx-auto transition-all duration-700 delay-100"])}" data-v-191ef33f>${ssrInterpolate(_ctx.$t("contact.description"))}</p></div><div class="${ssrRenderClass([unref(isVisible) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "relative mx-auto max-w-2xl transition-all duration-700 delay-200"])}" data-v-191ef33f><div class="relative rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-xl border bg-surface/50 border-border/50 hover:shadow-2xl transition-shadow duration-500" data-v-191ef33f><form class="space-y-6" data-v-191ef33f><div class="group space-y-2" data-v-191ef33f><label for="name" class="flex items-center gap-2 text-sm font-semibold text-text" data-v-191ef33f>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi-account",
        class: "w-5 h-5 text-primary"
      }, null, _parent));
      _push(` ${ssrInterpolate(_ctx.$t("contact.nameLabel"))}</label><div class="relative" data-v-191ef33f><input id="name"${ssrRenderAttr("value", unref(formData).name)} type="text" required${ssrRenderAttr("placeholder", _ctx.$t("contact.namePlaceholder"))} class="w-full px-4 py-3.5 pl-11 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg bg-surface text-text border-border focus:border-primary focus:ring-primary/20 hover:border-primary/50"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} data-v-191ef33f>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi-account-outline",
        class: "absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
      }, null, _parent));
      _push(`</div></div><div class="group space-y-2" data-v-191ef33f><label for="email" class="flex items-center gap-2 text-sm font-semibold text-text" data-v-191ef33f>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi-email",
        class: "w-5 h-5 text-primary"
      }, null, _parent));
      _push(` ${ssrInterpolate(_ctx.$t("contact.emailLabel"))}</label><div class="relative" data-v-191ef33f><input id="email"${ssrRenderAttr("value", unref(formData).email)} type="email" required${ssrRenderAttr("placeholder", _ctx.$t("contact.emailPlaceholder", { at: "@" }))} class="w-full px-4 py-3.5 pl-11 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg bg-surface text-text border-border focus:border-primary focus:ring-primary/20 hover:border-primary/50"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} data-v-191ef33f>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi-email-outline",
        class: "absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
      }, null, _parent));
      _push(`</div></div><div class="group space-y-2" data-v-191ef33f><label for="message" class="flex items-center gap-2 text-sm font-semibold text-text" data-v-191ef33f>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi-message-text",
        class: "w-5 h-5 text-primary"
      }, null, _parent));
      _push(` ${ssrInterpolate(_ctx.$t("contact.messageLabel"))}</label><div class="relative" data-v-191ef33f><textarea id="message" required rows="5"${ssrRenderAttr("placeholder", _ctx.$t("contact.messagePlaceholder"))} class="w-full px-4 py-3.5 pl-11 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg resize-none bg-surface text-text border-border focus:border-primary focus:ring-primary/20 hover:border-primary/50"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} data-v-191ef33f>${ssrInterpolate(unref(formData).message)}</textarea>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi-message-outline",
        class: "absolute left-3.5 top-4 w-5 h-5 text-muted pointer-events-none"
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UIButton, {
        type: "submit",
        variant: "primary",
        icon: unref(isSubmitting) ? "mdi-loading" : "mdi-send",
        "icon-position": "right",
        class: ["w-full !py-4", { "opacity-50 cursor-not-allowed pointer-events-none": unref(isSubmitting) }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="flex items-center justify-center gap-2" data-v-191ef33f${_scopeId}>`);
            if (unref(isSubmitting)) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "mdi-loading",
                class: "w-5 h-5 animate-spin"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(isSubmitting) ? _ctx.$t("contact.sending") : _ctx.$t("contact.sendButton"))}</span>`);
          } else {
            return [
              createVNode("span", { class: "flex items-center justify-center gap-2" }, [
                unref(isSubmitting) ? (openBlock(), createBlock(_component_Icon, {
                  key: 0,
                  name: "mdi-loading",
                  class: "w-5 h-5 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString$1(unref(isSubmitting) ? _ctx.$t("contact.sending") : _ctx.$t("contact.sendButton")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(showSuccess)) {
        _push(`<div class="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30" data-v-191ef33f>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi-check-circle",
          class: "w-6 h-6 flex-shrink-0 text-green-500 mt-0.5"
        }, null, _parent));
        _push(`<p class="text-sm font-medium text-text" data-v-191ef33f>${ssrInterpolate(_ctx.$t("contact.successMessage"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showError2)) {
        _push(`<div class="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30" data-v-191ef33f>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi-alert-circle",
          class: "w-6 h-6 flex-shrink-0 text-red-500 mt-0.5"
        }, null, _parent));
        _push(`<p class="text-sm font-medium text-text" data-v-191ef33f>${ssrInterpolate(_ctx.$t("contact.errorMessage"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div></div></div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/Contact.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-191ef33f"]]);
const useLanguage = () => {
  const { locale, locales, setLocale } = useI18n();
  const initializeLanguage = async () => {
    return;
  };
  const changeLanguage = async (newLocale) => {
    return;
  };
  return {
    locale,
    locales,
    initializeLanguage,
    changeLanguage
  };
};
const _sfc_main$7 = {
  __name: "CdSeLanguage",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, locales } = useLanguage();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:translate",
        class: "w-5 h-5 text-primary"
      }, null, _parent));
      _push(`<h3 class="text-lg font-medium text-white">${ssrInterpolate(_ctx.$t("settings.language.language"))}</h3></div><p class="text-sm text-gray-400">${ssrInterpolate(_ctx.$t("settings.language.languageDescription"))}</p><div class="space-y-2"><!--[-->`);
      ssrRenderList(unref(locales), (lang) => {
        _push(`<button type="button" class="${ssrRenderClass([
          "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200",
          unref(locale) === lang.code ? "bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50 shadow-lg shadow-primary/10" : "bg-gray-800/50 border-gray-700/50 hover:border-primary/30 hover:bg-gray-800/80"
        ])}"><div class="flex items-center gap-3"><div class="${ssrRenderClass([
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
          unref(locale) === lang.code ? "bg-primary/30 text-primary" : "bg-gray-700/50 text-gray-400"
        ])}">${ssrInterpolate(lang.code.toUpperCase())}</div><span class="${ssrRenderClass([
          "font-medium",
          unref(locale) === lang.code ? "text-white" : "text-gray-300"
        ])}">${ssrInterpolate(lang.name)}</span></div>`);
        if (unref(locale) === lang.code) {
          _push(`<div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "mdi:check-circle",
            class: "w-5 h-5 text-primary"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/settings/Language.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const useTheme = () => {
  const theme = useState("theme", () => "default");
  const themes = [
    { value: "default", label: "Default", icon: "mdi:theme-light-dark" },
    { value: "dark", label: "Dark", icon: "mdi:weather-night" },
    { value: "light", label: "Light", icon: "mdi:white-balance-sunny" }
  ];
  const initializeTheme = () => {
    return;
  };
  const changeTheme = (newTheme) => {
    return;
  };
  return {
    theme,
    themes,
    initializeTheme,
    changeTheme
  };
};
const _sfc_main$6 = {
  __name: "CdSeTheme",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme, themes } = useTheme();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:palette",
        class: "w-5 h-5 text-primary"
      }, null, _parent));
      _push(`<h3 class="text-lg font-medium text-white">${ssrInterpolate(_ctx.$t("settings.theme.theme"))}</h3></div><p class="text-sm text-gray-400">${ssrInterpolate(_ctx.$t("settings.theme.themeDescription"))}</p><div class="grid grid-cols-3 gap-3"><!--[-->`);
      ssrRenderList(unref(themes), (themeOption) => {
        _push(`<button type="button" class="${ssrRenderClass([[
          unref(theme) === themeOption.value ? "bg-primary/10 border-primary shadow-lg shadow-primary/20" : "bg-gray-800/30 border-gray-700/50 hover:border-primary/50 hover:bg-gray-800/50"
        ], "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 group"])}"><div class="${ssrRenderClass([[
          unref(theme) === themeOption.value ? "bg-primary/20 text-primary" : "bg-gray-700/50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
        ], "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"])}">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: themeOption.icon,
          class: "w-5 h-5"
        }, null, _parent));
        _push(`</div><span class="${ssrRenderClass([[
          unref(theme) === themeOption.value ? "text-primary" : "text-gray-400 group-hover:text-gray-300"
        ], "text-xs font-medium transition-colors duration-300"])}">${ssrInterpolate(_ctx.$t(`settings.theme.${themeOption.value}`))}</span>`);
        if (unref(theme) === themeOption.value) {
          _push(`<div class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "mdi:check",
            class: "w-3 h-3 text-white"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/settings/Theme.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "CdSeSidebar",
  __ssrInlineRender: true,
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleClose = () => {
      emit("close");
    };
    watch(() => props.isOpen, (newVal) => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1$2;
      const _component_CdTooltip = __nuxt_component_0$1;
      const _component_CdSeLanguage = _sfc_main$7;
      const _component_CdSeTheme = _sfc_main$6;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" data-v-4ecd7669>`);
          if (__props.isOpen) {
            _push2(`<div class="fixed left-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-r border-primary/20 shadow-2xl flex flex-col" data-v-4ecd7669><div class="flex items-center justify-between px-6 py-5 border-b border-primary/10" data-v-4ecd7669><div class="flex items-center gap-3" data-v-4ecd7669><div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30" data-v-4ecd7669>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:cog",
              class: "w-5 h-5 text-primary"
            }, null, _parent));
            _push2(`</div><h2 class="text-xl font-semibold text-white" data-v-4ecd7669>${ssrInterpolate(_ctx.$t("settings.title"))}</h2></div>`);
            _push2(ssrRenderComponent(_component_CdTooltip, {
              content: _ctx.$t("global.close"),
              position: "right",
              variant: "primary"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`<button type="button" class="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors group"${ssrRenderAttr("aria-label", _ctx.$t("global.close"))} data-v-4ecd7669${_scopeId}>`);
                  _push3(ssrRenderComponent(_component_Icon, {
                    name: "mdi:close",
                    class: "w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                  }, null, _parent2, _scopeId));
                  _push3(`</button>`);
                } else {
                  return [
                    createVNode("button", {
                      type: "button",
                      class: "w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors group",
                      "aria-label": _ctx.$t("global.close"),
                      onClick: handleClose
                    }, [
                      createVNode(_component_Icon, {
                        name: "mdi:close",
                        class: "w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                      })
                    ], 8, ["aria-label"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div><div class="flex-1 px-6 py-6 space-y-8" data-v-4ecd7669><div class="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-1" data-v-4ecd7669>`);
            _push2(ssrRenderComponent(_component_CdSeLanguage, null, null, _parent));
            _push2(`<hr class="border-t border-gray-800/50" data-v-4ecd7669>`);
            _push2(ssrRenderComponent(_component_CdSeTheme, null, null, _parent));
            _push2(`</div></div><div class="px-6 py-4 border-t border-primary/10" data-v-4ecd7669><p class="text-xs text-gray-500 text-center" data-v-4ecd7669>${ssrInterpolate(_ctx.$t("settings.footer"))}</p></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/settings/Sidebar.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-4ecd7669"]]);
const _sfc_main$4 = {
  __name: "CdSettings",
  __ssrInlineRender: true,
  setup(__props) {
    const isSettingsOpen = ref(false);
    const toggleSettings = () => {
      isSettingsOpen.value = !isSettingsOpen.value;
    };
    const closeSettings = () => {
      isSettingsOpen.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CdTooltip = __nuxt_component_0$1;
      const _component_Icon = __nuxt_component_1$2;
      const _component_CdSeSidebar = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6 md:left-8">`);
      _push(ssrRenderComponent(_component_CdTooltip, {
        position: "right",
        variant: "code",
        delay: 100,
        offset: 12,
        "show-arrow": false
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-xs font-medium"${_scopeId}>${ssrInterpolate(_ctx.$t("settings.title"))}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-xs font-medium" }, toDisplayString$1(_ctx.$t("settings.title")), 1)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="group"${ssrRenderAttr("aria-label", _ctx.$t("settings.openSettings"))}${_scopeId}><div class="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"${_scopeId}><div class="${ssrRenderClass([
              "absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md",
              "border border-primary/30 shadow-lg",
              "flex items-center justify-center",
              "transition-all duration-300 ease-out",
              "group-hover:scale-110 group-hover:from-primary/30 group-hover:to-accent/30",
              "group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20",
              "group-active:scale-95",
              unref(isSettingsOpen) && "scale-110 from-primary/30 to-accent/30 border-primary/50"
            ])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:cog",
              class: [
                "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-all duration-300",
                "text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]",
                "group-hover:rotate-90",
                unref(isSettingsOpen) ? "rotate-90" : ""
              ]
            }, null, _parent2, _scopeId));
            _push2(`</div><svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100"${_scopeId}><defs${_scopeId}><linearGradient id="settingsGradient" x1="0%" y1="0%" x2="100%" y2="100%"${_scopeId}><stop offset="0%" style="${ssrRenderStyle(`stop-color: var(--primary); stop-opacity: 0.6`)}"${_scopeId}></stop><stop offset="100%" style="${ssrRenderStyle(`stop-color: var(--accent); stop-opacity: 0.6`)}"${_scopeId}></stop></linearGradient></defs><circle cx="50" cy="50" r="48" fill="none" stroke="url(#settingsGradient)" stroke-width="2"${ssrRenderAttr("stroke-dasharray", 301)}${ssrRenderAttr("stroke-dashoffset", unref(isSettingsOpen) ? 0 : 301)} stroke-linecap="round" class="transition-all duration-500 ease-out"${_scopeId}></circle></svg></div></button>`);
          } else {
            return [
              createVNode("button", {
                type: "button",
                class: "group",
                "aria-label": _ctx.$t("settings.openSettings"),
                onClick: toggleSettings
              }, [
                createVNode("div", { class: "relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" }, [
                  createVNode("div", {
                    class: [
                      "absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md",
                      "border border-primary/30 shadow-lg",
                      "flex items-center justify-center",
                      "transition-all duration-300 ease-out",
                      "group-hover:scale-110 group-hover:from-primary/30 group-hover:to-accent/30",
                      "group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20",
                      "group-active:scale-95",
                      unref(isSettingsOpen) && "scale-110 from-primary/30 to-accent/30 border-primary/50"
                    ]
                  }, [
                    createVNode(_component_Icon, {
                      name: "mdi:cog",
                      class: [
                        "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-all duration-300",
                        "text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]",
                        "group-hover:rotate-90",
                        unref(isSettingsOpen) ? "rotate-90" : ""
                      ]
                    }, null, 8, ["class"])
                  ], 2),
                  (openBlock(), createBlock("svg", {
                    class: "absolute inset-0 w-full h-full -rotate-90 pointer-events-none",
                    viewBox: "0 0 100 100"
                  }, [
                    createVNode("defs", null, [
                      createVNode("linearGradient", {
                        id: "settingsGradient",
                        x1: "0%",
                        y1: "0%",
                        x2: "100%",
                        y2: "100%"
                      }, [
                        createVNode("stop", {
                          offset: "0%",
                          style: `stop-color: var(--primary); stop-opacity: 0.6`
                        }),
                        createVNode("stop", {
                          offset: "100%",
                          style: `stop-color: var(--accent); stop-opacity: 0.6`
                        })
                      ])
                    ]),
                    createVNode("circle", {
                      cx: "50",
                      cy: "50",
                      r: "48",
                      fill: "none",
                      stroke: "url(#settingsGradient)",
                      "stroke-width": "2",
                      "stroke-dasharray": 301,
                      "stroke-dashoffset": unref(isSettingsOpen) ? 0 : 301,
                      "stroke-linecap": "round",
                      class: "transition-all duration-500 ease-out"
                    }, null, 8, ["stroke-dashoffset"])
                  ]))
                ])
              ], 8, ["aria-label"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CdSeSidebar, {
        "is-open": unref(isSettingsOpen),
        onClose: closeSettings
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/Settings.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "CdScrollToTop",
  __ssrInlineRender: true,
  setup(__props) {
    const isVisible = ref(false);
    const scrollProgress = ref(0);
    const scrollToTop = () => {
      (void 0).scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CdTooltip = __nuxt_component_0$1;
      if (unref(isVisible)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8" }, _attrs))} data-v-813fffc3>`);
        _push(ssrRenderComponent(_component_CdTooltip, {
          position: "left",
          variant: "code",
          delay: 100,
          offset: 12,
          "show-arrow": false
        }, {
          content: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.$t("global.upToTop"))}`);
            } else {
              return [
                createTextVNode(toDisplayString$1(_ctx.$t("global.upToTop")), 1)
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button type="button" class="group" aria-label="Volver arriba" data-v-813fffc3${_scopeId}><div class="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden" data-v-813fffc3${_scopeId}><svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100" data-v-813fffc3${_scopeId}><defs data-v-813fffc3${_scopeId}><linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%" data-v-813fffc3${_scopeId}><stop offset="0%" style="${ssrRenderStyle(`stop-color: var(--primary); stop-opacity: 0.3`)}" data-v-813fffc3${_scopeId}></stop><stop offset="100%" style="${ssrRenderStyle(`stop-color: var(--accent); stop-opacity: 0.3`)}" data-v-813fffc3${_scopeId}></stop></linearGradient><linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%" data-v-813fffc3${_scopeId}><stop offset="0%" style="${ssrRenderStyle(`stop-color: var(--primary); stop-opacity: 1`)}" data-v-813fffc3${_scopeId}></stop><stop offset="50%" style="${ssrRenderStyle(`stop-color: var(--primary); stop-opacity: 1`)}" data-v-813fffc3${_scopeId}></stop><stop offset="100%" style="${ssrRenderStyle(`stop-color: var(--accent); stop-opacity: 1`)}" data-v-813fffc3${_scopeId}></stop></linearGradient><filter id="glow" data-v-813fffc3${_scopeId}><feGaussianBlur stdDeviation="2" result="coloredBlur" data-v-813fffc3${_scopeId}></feGaussianBlur><feMerge data-v-813fffc3${_scopeId}><feMergeNode in="coloredBlur" data-v-813fffc3${_scopeId}></feMergeNode><feMergeNode in="SourceGraphic" data-v-813fffc3${_scopeId}></feMergeNode></feMerge></filter></defs><circle cx="50" cy="50" r="45" fill="none" stroke="url(#bgGradient)" stroke-width="4" class="transition-all duration-300" data-v-813fffc3${_scopeId}></circle><circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" stroke-width="4"${ssrRenderAttr("stroke-dasharray", 283)}${ssrRenderAttr("stroke-dashoffset", 283 - 283 * unref(scrollProgress) / 100)} stroke-linecap="round" class="transition-all duration-300 ease-out" filter="url(#glow)" data-v-813fffc3${_scopeId}></circle></svg><div class="${ssrRenderClass([
                "absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md",
                "border border-primary/30 shadow-lg",
                "flex items-center justify-center",
                "transition-all duration-300 ease-out",
                "sm:group-hover:scale-110 sm:group-hover:from-primary/30 sm:group-hover:to-accent/30",
                "sm:group-hover:border-primary/50 sm:group-hover:shadow-2xl sm:group-hover:shadow-primary/20",
                "group-active:scale-95"
              ])}" data-v-813fffc3${_scopeId}><svg class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary transition-all duration-300 ease-out group-hover:translate-y-[-3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-813fffc3${_scopeId}><line x1="12" y1="19" x2="12" y2="5" data-v-813fffc3${_scopeId}></line><polyline points="5 12 12 5 19 12" data-v-813fffc3${_scopeId}></polyline></svg><!--[-->`);
              ssrRenderList(3, (i) => {
                _push2(`<span class="${ssrRenderClass([
                  "absolute w-1 h-1 rounded-full bg-primary/60",
                  "transition-all duration-700 ease-out",
                  "opacity-0 group-hover:opacity-100"
                ])}" style="${ssrRenderStyle({
                  top: "-8px",
                  left: `${30 + i * 15}%`,
                  transitionDelay: `${i * 50}ms`
                })}" data-v-813fffc3${_scopeId}></span>`);
              });
              _push2(`<!--]--></div><div class="absolute inset-0 rounded-full bg-primary/20 animate-ping-slow opacity-0 sm:group-hover:opacity-100" data-v-813fffc3${_scopeId}></div></div></button>`);
            } else {
              return [
                createVNode("button", {
                  type: "button",
                  class: "group",
                  "aria-label": "Volver arriba",
                  onClick: scrollToTop
                }, [
                  createVNode("div", { class: "relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden" }, [
                    (openBlock(), createBlock("svg", {
                      class: "absolute inset-0 w-full h-full -rotate-90",
                      viewBox: "0 0 100 100"
                    }, [
                      createVNode("defs", null, [
                        createVNode("linearGradient", {
                          id: "bgGradient",
                          x1: "0%",
                          y1: "0%",
                          x2: "100%",
                          y2: "100%"
                        }, [
                          createVNode("stop", {
                            offset: "0%",
                            style: `stop-color: var(--primary); stop-opacity: 0.3`
                          }),
                          createVNode("stop", {
                            offset: "100%",
                            style: `stop-color: var(--accent); stop-opacity: 0.3`
                          })
                        ]),
                        createVNode("linearGradient", {
                          id: "progressGradient",
                          x1: "0%",
                          y1: "0%",
                          x2: "100%",
                          y2: "100%"
                        }, [
                          createVNode("stop", {
                            offset: "0%",
                            style: `stop-color: var(--primary); stop-opacity: 1`
                          }),
                          createVNode("stop", {
                            offset: "50%",
                            style: `stop-color: var(--primary); stop-opacity: 1`
                          }),
                          createVNode("stop", {
                            offset: "100%",
                            style: `stop-color: var(--accent); stop-opacity: 1`
                          })
                        ]),
                        createVNode("filter", { id: "glow" }, [
                          createVNode("feGaussianBlur", {
                            stdDeviation: "2",
                            result: "coloredBlur"
                          }),
                          createVNode("feMerge", null, [
                            createVNode("feMergeNode", { in: "coloredBlur" }),
                            createVNode("feMergeNode", { in: "SourceGraphic" })
                          ])
                        ])
                      ]),
                      createVNode("circle", {
                        cx: "50",
                        cy: "50",
                        r: "45",
                        fill: "none",
                        stroke: "url(#bgGradient)",
                        "stroke-width": "4",
                        class: "transition-all duration-300"
                      }),
                      createVNode("circle", {
                        cx: "50",
                        cy: "50",
                        r: "45",
                        fill: "none",
                        stroke: "url(#progressGradient)",
                        "stroke-width": "4",
                        "stroke-dasharray": 283,
                        "stroke-dashoffset": 283 - 283 * unref(scrollProgress) / 100,
                        "stroke-linecap": "round",
                        class: "transition-all duration-300 ease-out",
                        filter: "url(#glow)"
                      }, null, 8, ["stroke-dashoffset"])
                    ])),
                    createVNode("div", { class: [
                      "absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md",
                      "border border-primary/30 shadow-lg",
                      "flex items-center justify-center",
                      "transition-all duration-300 ease-out",
                      "sm:group-hover:scale-110 sm:group-hover:from-primary/30 sm:group-hover:to-accent/30",
                      "sm:group-hover:border-primary/50 sm:group-hover:shadow-2xl sm:group-hover:shadow-primary/20",
                      "group-active:scale-95"
                    ] }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary transition-all duration-300 ease-out group-hover:translate-y-[-3px]",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2.5",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, [
                        createVNode("line", {
                          x1: "12",
                          y1: "19",
                          x2: "12",
                          y2: "5"
                        }),
                        createVNode("polyline", { points: "5 12 12 5 19 12" })
                      ])),
                      (openBlock(), createBlock(Fragment, null, renderList(3, (i) => {
                        return createVNode("span", {
                          key: i,
                          class: [
                            "absolute w-1 h-1 rounded-full bg-primary/60",
                            "transition-all duration-700 ease-out",
                            "opacity-0 group-hover:opacity-100"
                          ],
                          style: {
                            top: "-8px",
                            left: `${30 + i * 15}%`,
                            transitionDelay: `${i * 50}ms`
                          }
                        }, null, 4);
                      }), 64))
                    ]),
                    createVNode("div", { class: "absolute inset-0 rounded-full bg-primary/20 animate-ping-slow opacity-0 sm:group-hover:opacity-100" })
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/ScrollToTop.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-813fffc3"]]);
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    useLanguage();
    useTheme();
    useSeo();
    const { locale } = useI18n();
    useHead({
      htmlAttrs: {
        lang: locale.value
      }
    });
    watch(locale, (newLocale) => {
      useHead({
        htmlAttrs: {
          lang: newLocale
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CdHeader = __nuxt_component_0$2;
      const _component_CdHero = __nuxt_component_1$1;
      const _component_CdProjects = _sfc_main$b;
      const _component_CdExperience = __nuxt_component_3;
      const _component_CdSkills = __nuxt_component_4;
      const _component_CdContact = __nuxt_component_5;
      const _component_CdSettings = _sfc_main$4;
      const _component_CdScrollToTop = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-x-hidden w-full" }, _attrs))}><div class="bg-decorative-effects"><div class="bg-blob-primary"></div><div class="bg-blob-accent"></div><div class="bg-blob-primary-center"></div><div class="bg-grid-pattern"></div></div><main id="home">`);
      _push(ssrRenderComponent(_component_CdHeader, { menus: "mainMenu" in _ctx ? _ctx.mainMenu : unref(mainMenu) }, null, _parent));
      _push(`</main><section id="home" class="min-h-screen">`);
      _push(ssrRenderComponent(_component_CdHero, null, null, _parent));
      _push(`</section><section id="projects" class="mx-auto max-w-7xl px-6 pb-16 my-20 min-h-screen">`);
      _push(ssrRenderComponent(_component_CdProjects, null, null, _parent));
      _push(`</section><section id="experience" class="mx-auto max-w-7xl px-6 pb-16 my-20 min-h-screen">`);
      _push(ssrRenderComponent(_component_CdExperience, null, null, _parent));
      _push(`</section><section id="skills" class="mx-auto max-w-7xl px-6 pb-16 my-20 min-h-screen">`);
      _push(ssrRenderComponent(_component_CdSkills, null, null, _parent));
      _push(`</section><section id="contact" class="mx-auto max-w-7xl px-6 pb-16 my-20 min-h-screen">`);
      _push(ssrRenderComponent(_component_CdContact, null, null, _parent));
      _push(`</section>`);
      _push(ssrRenderComponent(_component_CdSettings, null, null, _parent));
      _push(ssrRenderComponent(_component_CdScrollToTop, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-D5q_-FJd.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-D0gfKC7L.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, __nuxt_component_0$3 as a, entry$1 as default, useHead as u };
//# sourceMappingURL=server.mjs.map
